import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

/**
 * Enhanced security headers middleware
 * Uses Helmet with custom configuration for our needs
 */
export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for development
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", config.api.url],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },

  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Disable for development

  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: { policy: 'same-origin' },

  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: { policy: 'same-site' },

  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },

  // Frameguard
  frameguard: { action: 'deny' },

  // Hide Powered-By
  hidePoweredBy: true,

  // HSTS
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },

  // IE No Open
  ieNoOpen: true,

  // NoSniff
  noSniff: true,

  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

  // XSS Protection
  xssFilter: true,
});

/**
 * Custom security headers for GraphQL endpoints
 */
export const graphqlSecurityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add specific headers for GraphQL endpoints
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Allow GraphQL introspection in development
  if (process.env['NODE_ENV'] === 'development') {
    res.setHeader('X-GraphQL-Introspection', 'enabled');
  }

  next();
};

/**
 * Environment-specific security configuration
 */
export const environmentSecurity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add environment-specific security headers
  if (process.env['NODE_ENV'] === 'production') {
    // Stricter security in production
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  } else {
    // More lenient in development
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1');
  }

  next();
};

/**
 * Request logging for security monitoring
 */
export const securityLogging = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log potentially suspicious requests
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /exec\s*\(/i,
  ];

  const userAgent = req.headers['user-agent'] || '';
  const url = req.url;
  const method = req.method;

  // Check for suspicious patterns
  const isSuspicious = suspiciousPatterns.some(
    pattern =>
      pattern.test(userAgent) || pattern.test(url) || pattern.test(method)
  );

  if (isSuspicious) {
    // eslint-disable-next-line no-console
    console.warn('Suspicious request detected:', {
      ip: req.ip,
      userAgent,
      url,
      method,
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

/**
 * Apply all security middleware
 */
export const applySecurityMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Apply security logging first
  securityLogging(req, res, () => {
    // Apply environment-specific security
    environmentSecurity(req, res, () => {
      // Apply GraphQL-specific headers for GraphQL endpoints
      if (req.path === '/' && req.method === 'POST') {
        graphqlSecurityHeaders(req, res, next);
      } else {
        next();
      }
    });
  });
};
