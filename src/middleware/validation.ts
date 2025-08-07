import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { sanitizeString, containsDangerousContent } from '../utils/security.js';
import { config } from '../config/index.js';

/**
 * Middleware to check for validation errors
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
      })),
    });
    return;
  }
  next();
};

/**
 * Sanitize request body to prevent XSS
 */
export const sanitizeBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.body) {
    const sanitizedBody: Record<string, any> = {};

    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        // Check for dangerous content
        if (containsDangerousContent(value)) {
          res.status(400).json({
            error: 'Request contains potentially dangerous content',
          });
          return;
        }
        sanitizedBody[key] = sanitizeString(value);
      } else {
        sanitizedBody[key] = value;
      }
    }

    req.body = sanitizedBody;
  }
  next();
};

/**
 * Validate request payload size
 */
export const validatePayloadSize = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize =
    parseInt(config.security.validation.maxPayloadSize.replace(/\D/g, '')) *
    1024 *
    1024; // Convert to bytes

  if (contentLength > maxSize) {
    res.status(413).json({
      error: 'Request payload too large',
    });
    return;
  }
  next();
};

/**
 * Validation rules for GraphQL queries
 */
export const graphqlValidationRules = (): ValidationChain[] => [
  body('query')
    .optional()
    .isString()
    .withMessage('Query must be a string')
    .custom(value => {
      if (value && containsDangerousContent(value)) {
        throw new Error('Query contains potentially dangerous content');
      }
      return true;
    }),
  body('variables')
    .optional()
    .isObject()
    .withMessage('Variables must be an object'),
  body('operationName')
    .optional()
    .isString()
    .withMessage('Operation name must be a string')
    .custom(value => {
      if (value && containsDangerousContent(value)) {
        throw new Error(
          'Operation name contains potentially dangerous content'
        );
      }
      return true;
    }),
];

/**
 * Validation rules for authentication
 */
export const authValidationRules = (): ValidationChain[] => [
  body('googleToken')
    .isString()
    .withMessage('Google token is required')
    .isLength({ min: 1 })
    .withMessage('Google token cannot be empty'),
];

/**
 * Validation rules for post creation
 */
export const postValidationRules = (): ValidationChain[] => [
  body('subblueditName')
    .isString()
    .withMessage('Subbluedit name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Subbluedit name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      'Subbluedit name can only contain letters, numbers, and underscores'
    ),
  body('title')
    .isString()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 300 })
    .withMessage('Title must be between 1 and 300 characters'),
  body('body')
    .optional()
    .isString()
    .withMessage('Body must be a string')
    .isLength({ max: 10000 })
    .withMessage('Body cannot exceed 10,000 characters'),
];

/**
 * Validation rules for comment creation
 */
export const commentValidationRules = (): ValidationChain[] => [
  body('postId')
    .isString()
    .withMessage('Post ID is required')
    .isLength({ min: 1 })
    .withMessage('Post ID cannot be empty'),
  body('body')
    .isString()
    .withMessage('Comment body is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment body must be between 1 and 1,000 characters'),
];

/**
 * Validation rules for voting
 */
export const voteValidationRules = (): ValidationChain[] => [
  body('votableId')
    .isString()
    .withMessage('Votable ID is required')
    .isLength({ min: 1 })
    .withMessage('Votable ID cannot be empty'),
  body('votableType')
    .isIn(['Post', 'Comment'])
    .withMessage('Votable type must be either Post or Comment'),
  body('value')
    .isInt({ min: -1, max: 1 })
    .withMessage('Vote value must be -1, 0, or 1'),
];
