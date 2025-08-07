import request from 'supertest';
import express from 'express';
import {
  rateLimiter,
  healthCheckRateLimiter,
} from '../middleware/rate-limit.js';
import { authenticateJWT, requireAuth } from '../middleware/auth.js';
import { validatePayloadSize } from '../middleware/validation.js';
import { securityHeaders } from '../middleware/security.js';

// Mock JWT verification
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn((token: string) => {
    if (token === 'valid-token') {
      const now = Math.floor(Date.now() / 1000);
      return {
        userId: 'user123',
        email: 'test@example.com',
        iat: now,
        exp: now + 3600, // Expires in 1 hour
      };
    }
    throw new Error('Invalid token');
  }),
}));

// Mock the validateJWT function from security utils
jest.mock('../utils/security.js', () => ({
  validateJWT: jest.fn((token: string) => {
    if (token === 'valid-token') {
      const now = Math.floor(Date.now() / 1000);
      return {
        userId: 'user123',
        email: 'test@example.com',
        iat: now,
        exp: now + 3600, // Expires in 1 hour
      };
    }
    return null;
  }),
  extractTokenFromHeader: jest.fn((header: string | undefined) => {
    if (header?.startsWith('Bearer ')) {
      return header.substring(7);
    }
    return null;
  }),
}));

describe('Security Features - Simple Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('Security Headers', () => {
    beforeEach(() => {
      app.use(securityHeaders);
      app.get('/test', (req, res) => res.json({ message: 'test' }));
    });

    it('should set essential security headers', async () => {
      const response = await request(app).get('/test');

      expect(response.headers['content-security-policy']).toBeDefined();
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['strict-transport-security']).toBeDefined();
    });

    it('should have appropriate CSP policy', async () => {
      const response = await request(app).get('/test');
      const csp = response.headers['content-security-policy'];

      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self'");
    });
  });

  describe('Authentication', () => {
    beforeEach(() => {
      app.use(authenticateJWT);
      app.get('/test', (req, res) => res.json({ user: req.user }));
    });

    it('should attach user info for valid JWT', async () => {
      const response = await request(app)
        .get('/test')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe('user123');
    });

    it('should continue without user for missing token', async () => {
      const response = await request(app).get('/test');
      expect(response.status).toBe(200);
      expect(response.body.user).toBeUndefined();
    });
  });

  describe('Rate Limiting', () => {
    beforeEach(() => {
      app.use(rateLimiter);
      app.get('/test', (req, res) => res.json({ message: 'success' }));
    });

    it('should allow requests within rate limit', async () => {
      const response = await request(app).get('/test');
      expect(response.status).toBe(200);
      expect(
        response.headers['x-ratelimit-remaining'] ||
          response.headers['ratelimit-remaining']
      ).toBeDefined();
    });
  });

  describe('Health Check Rate Limiting', () => {
    beforeEach(() => {
      app.use('/health', healthCheckRateLimiter);
      app.get('/health', (req, res) => res.json({ status: 'ok' }));
    });

    it('should have lenient rate limits for health checks', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(
        response.headers['x-ratelimit-limit'] ||
          response.headers['ratelimit-limit']
      ).toBeDefined();
    });
  });

  describe('Payload Size Validation', () => {
    beforeEach(() => {
      app.use(validatePayloadSize);
      app.post('/test', (req, res) => res.json({ received: true }));
    });

    it('should allow appropriately sized payloads', async () => {
      const response = await request(app)
        .post('/test')
        .send({ data: 'small payload' });

      expect(response.status).toBe(200);
    });
  });

  describe('Protected Routes', () => {
    beforeEach(() => {
      app.use(authenticateJWT);
      app.use(requireAuth);
      app.get('/protected', (req, res) =>
        res.json({ message: 'protected', user: req.user })
      );
    });

    it('should block access without JWT', async () => {
      const response = await request(app).get('/protected');
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should allow access with valid JWT', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer valid-token');

      if (response.status !== 200) {
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);
      }

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('protected');
      expect(response.body.user).toBeDefined();
    });
  });
});
