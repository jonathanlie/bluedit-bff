import { Request, Response, NextFunction } from 'express';
import { validateJWT, extractTokenFromHeader } from '../utils/security.js';
import { CookieService } from '../services/cookie-service.js';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        iat: number;
        exp: number;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT tokens
 * Supports both Authorization header and cookies
 */
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try to get token from Authorization header first
    let token = extractTokenFromHeader(req.headers.authorization);

    // If no token in header, try to get from cookies
    if (!token) {
      const cookies = CookieService.parseCookies(req.headers.cookie);
      token = cookies['session_token'] || null;
    }

    // If no token found, continue without authentication
    if (!token) {
      return next();
    }

    // Validate the token
    const decoded = validateJWT(token);
    if (!decoded) {
      // Invalid token, but don't block the request
      // The application can handle unauthenticated users
      return next();
    }

    // Add user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch {
    // If there's an error, continue without authentication
    // This prevents the middleware from blocking requests
    next();
  }
};

/**
 * Middleware to require authentication
 * Blocks requests if user is not authenticated
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication required',
      message: 'Please log in to access this resource',
    });
    return;
  }

  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  if (req.user.exp < now) {
    res.status(401).json({
      error: 'Token expired',
      message: 'Your session has expired, please log in again',
    });
    return;
  }

  next();
};

/**
 * Middleware to require authentication for specific operations
 * Used for mutations and sensitive operations
 */
export const requireAuthForMutations = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Only check authentication for GraphQL mutations
  if (req.body?.query && req.body.query.toLowerCase().includes('mutation')) {
    return requireAuth(req, res, next);
  }

  // For queries, authentication is optional
  next();
};

/**
 * Middleware to get user info without requiring authentication
 * Useful for operations that work with or without authentication
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // This middleware just ensures user info is available if authenticated
  // It doesn't block requests for unauthenticated users
  authenticateJWT(req, res, next);
};

/**
 * Middleware to check if user has specific permissions
 * Can be extended for role-based access control
 */
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to access this resource',
      });
      return;
    }

    // For now, we'll implement basic permission checking
    // This can be extended with a proper RBAC system
    const userPermissions = getUserPermissions();

    if (!userPermissions.includes(permission)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You do not have permission to perform this action',
      });
      return;
    }

    next();
  };
};

/**
 * Mock function to get user permissions
 * In a real application, this would query a database
 */
const getUserPermissions = (): string[] => {
  // For now, return basic permissions for all users
  // This can be enhanced with a proper permission system
  return ['read', 'write', 'vote'];
};
