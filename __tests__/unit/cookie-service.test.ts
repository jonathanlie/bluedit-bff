import { jest } from '@jest/globals';
import { CookieService } from '../../src/services/cookie-service.js';
import { Response } from 'express';

// Mock Express Response
const mockResponse = () => {
  const res = {} as Response;
  res.setHeader = jest.fn().mockReturnValue(res) as any;
  return res;
};

describe('CookieService', () => {
  let mockRes: Response;

  beforeEach(() => {
    mockRes = mockResponse();
    jest.clearAllMocks();
  });

  describe('parseCookies', () => {
    it('should parse cookie header correctly', () => {
      const cookieHeader = 'session_token=abc123; user_id=123; theme=dark';
      const result = CookieService.parseCookies(cookieHeader);

      expect(result).toEqual({
        session_token: 'abc123',
        user_id: '123',
        theme: 'dark',
      });
    });

    it('should return empty object for undefined cookie header', () => {
      const result = CookieService.parseCookies(undefined);
      expect(result).toEqual({});
    });

    it('should handle empty cookie header', () => {
      const result = CookieService.parseCookies('');
      expect(result).toEqual({});
    });
  });

  describe('getToken', () => {
    it('should extract token from cookie header', () => {
      const cookieHeader = 'session_token=abc123; user_id=123';
      const token = CookieService.getToken(cookieHeader);
      expect(token).toBe('abc123');
    });

    it('should return undefined when token not found', () => {
      const cookieHeader = 'user_id=123; theme=dark';
      const token = CookieService.getToken(cookieHeader);
      expect(token).toBeUndefined();
    });
  });

  describe('setToken', () => {
    it('should set token cookie header', () => {
      const token = 'test-token-123';

      CookieService.setToken(mockRes, token);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Set-Cookie',
        expect.stringContaining('session_token=test-token-123')
      );
    });
  });
});
