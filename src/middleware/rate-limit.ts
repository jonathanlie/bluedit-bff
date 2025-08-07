import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

/**
 * IP-only key generator to avoid IPv6 warnings
 */
const ipOnlyKeyGenerator = (req: Request): string => {
  return ipKeyGenerator(req.ip || req.connection.remoteAddress || 'unknown');
};

/**
 * Basic rate limiting middleware
 * Limits requests per IP address only (to avoid IPv6 warnings)
 */
export const rateLimiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  message: {
    error: config.security.rateLimit.message,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipOnlyKeyGenerator,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests',
      message: config.security.rateLimit.message,
      retryAfter: Math.ceil(config.security.rateLimit.windowMs / 1000),
    });
  },
});

/**
 * Progressive rate limiting middleware
 * Slows down requests after a certain threshold
 */
export const speedLimiter = slowDown({
  windowMs: config.security.slowDown.windowMs,
  delayAfter: config.security.slowDown.delayAfter,
  delayMs: () => config.security.slowDown.delayMs,
  keyGenerator: ipOnlyKeyGenerator,
  validate: { delayMs: false }, // Disable validation warning
});

/**
 * Stricter rate limiting for authentication endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs:
    process.env['NODE_ENV'] === 'production' ? 15 * 60 * 1000 : 60 * 1000, // 15 min prod, 1 min dev
  max: process.env['NODE_ENV'] === 'production' ? 5 : 20, // 5 prod, 20 dev attempts
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipOnlyKeyGenerator,
  handler: (req: Request, res: Response) => {
    const windowMs =
      process.env['NODE_ENV'] === 'production' ? 15 * 60 * 1000 : 60 * 1000;
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please wait before trying to authenticate again.',
      retryAfter: Math.ceil(windowMs / 1000),
    });
  },
});

/**
 * GraphQL-specific rate limiting
 * More lenient for queries, stricter for mutations
 */
export const graphqlRateLimiter = rateLimit({
  windowMs:
    process.env['NODE_ENV'] === 'production' ? 15 * 60 * 1000 : 60 * 1000,
  max: (req: Request) => {
    const body = req.body;
    if (body?.query && body.query.toLowerCase().includes('mutation')) {
      return process.env['NODE_ENV'] === 'production' ? 20 : 200;
    }
    return process.env['NODE_ENV'] === 'production' ? 100 : 1000;
  },
  message: {
    error: 'GraphQL rate limit exceeded',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipOnlyKeyGenerator,
  handler: (req: Request, res: Response) => {
    const isMutation = req.body?.query?.toLowerCase().includes('mutation');
    const windowMs =
      process.env['NODE_ENV'] === 'production' ? 15 * 60 * 1000 : 60 * 1000;
    res.status(429).json({
      error: 'GraphQL rate limit exceeded',
      message: isMutation
        ? 'Too many mutations, please slow down.'
        : 'Too many queries, please slow down.',
      retryAfter: Math.ceil(windowMs / 1000),
    });
  },
});

/**
 * Health check rate limiting
 * Very lenient for health checks
 */
export const healthCheckRateLimiter = rateLimit({
  windowMs: process.env['NODE_ENV'] === 'production' ? 60 * 1000 : 10 * 1000, // 1 min prod, 10 sec dev
  max: process.env['NODE_ENV'] === 'production' ? 30 : 100, // 30 prod, 100 dev
  message: {
    error: 'Too many health check requests',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) =>
    ipKeyGenerator(req.ip || req.connection.remoteAddress || 'unknown'),
});

/**
 * Apply rate limiting based on endpoint
 */
export const applyRateLimiting = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const path = req.path;

  // Skip rate limiting for health checks (handled separately)
  if (path === '/health') {
    return next();
  }

  // Apply appropriate rate limiting based on endpoint
  if (path.includes('/auth')) {
    return authRateLimiter(req, res, next);
  }

  // For GraphQL endpoints, apply GraphQL-specific rate limiting
  if (path === '/' && req.method === 'POST') {
    return graphqlRateLimiter(req, res, next);
  }

  // Default rate limiting for other endpoints
  return rateLimiter(req, res, next);
};
