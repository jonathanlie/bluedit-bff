import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Validate and decode JWT token
 */
export const validateJWT = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Extract JWT token from Authorization header
 */
export const extractTokenFromHeader = (
  authHeader: string | undefined
): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new globalThis.URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if string contains potentially dangerous content
 */
export const containsDangerousContent = (input: string): boolean => {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Generate a secure random string
 */
export const generateSecureToken = (length: number = 32): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
