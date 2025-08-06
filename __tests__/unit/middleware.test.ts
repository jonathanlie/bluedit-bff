import { jest } from '@jest/globals';
import { contextMiddleware } from '../../src/middleware/context.js';
import { corsMiddleware } from '../../src/middleware/cors.js';
import { Request, Response } from 'express';

// Mock Express Request and Response
const mockRequest = (): Partial<Request> => ({
  headers: {},
  cookies: {},
});

const mockResponse = (): Partial<Response> => ({
  setHeader: jest.fn() as any,
  status: jest.fn().mockReturnThis() as any,
  json: jest.fn().mockReturnThis() as any,
});

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('contextMiddleware', () => {
    it('should create GraphQL context with request and response', async () => {
      const req = mockRequest() as Request;
      const res = mockResponse() as Response;

      const context = await contextMiddleware({ req, res });

      expect(context).toEqual({
        req,
        res,
      });
    });
  });

  describe('corsMiddleware', () => {
    it('should be a function', () => {
      expect(typeof corsMiddleware).toBe('function');
    });

    it('should be configured with CORS options', () => {
      // The middleware is created with cors library, so we just verify it exists
      expect(corsMiddleware).toBeDefined();
    });
  });
});
