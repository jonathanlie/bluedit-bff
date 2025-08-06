import { jest } from '@jest/globals';
import { config } from '../../src/config/index.js';

describe('Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Server Configuration', () => {
    it('should have default server port', () => {
      expect(config.server).toBeDefined();
      expect(config.server.port).toBeDefined();
      expect(typeof config.server.port).toBe('string');
    });

    it('should use environment variable for port', async () => {
      process.env['PORT'] = '5000';
      const { config: newConfig } = await import('../../src/config/index.js');

      expect(newConfig.server.port).toBe('5000');
    });
  });

  describe('API Configuration', () => {
    it('should have API URL configuration', () => {
      expect(config.api).toBeDefined();
      expect(config.api.url).toBeDefined();
      expect(typeof config.api.url).toBe('string');
    });

    it('should have API timeout configuration', () => {
      expect(config.api.timeout).toBeDefined();
      expect(typeof config.api.timeout).toBe('number');
    });

    it('should use environment variable for API URL', async () => {
      process.env['API_URL'] = 'http://test-api.com';
      const { config: newConfig } = await import('../../src/config/index.js');

      expect(newConfig.api.url).toBe('http://test-api.com');
    });
  });

  describe('CORS Configuration', () => {
    it('should have CORS configuration', () => {
      expect(config.server.cors).toBeDefined();
      expect(config.server.cors.origin).toBeDefined();
    });

    it('should allow localhost in development', () => {
      expect(config.server.cors.origin).toContain('http://localhost:3001');
    });
  });

  describe('Authentication Configuration', () => {
    it('should have authentication configuration', () => {
      expect(config.auth).toBeDefined();
      expect(config.auth.cookieName).toBeDefined();
      expect(typeof config.auth.cookieName).toBe('string');
    });
  });
});
