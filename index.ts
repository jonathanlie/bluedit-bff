import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { config } from './src/config/index.js';
import { typeDefs } from './src/schema/index.js';
import { resolvers } from './src/schema/resolvers/index.js';
import { corsMiddleware } from './src/middleware/cors.js';
import { contextMiddleware } from './src/middleware/context.js';

// Security middleware imports
import {
  securityHeaders,
  applySecurityMiddleware,
} from './src/middleware/security.js';
import {
  rateLimiter,
  speedLimiter,
  healthCheckRateLimiter,
} from './src/middleware/rate-limit.js';
import {
  authenticateJWT,
  requireAuthForMutations,
} from './src/middleware/auth.js';
import {
  sanitizeBody,
  validatePayloadSize,
} from './src/middleware/validation.js';

const app = express();

// Security middleware (order matters!)
app.use(securityHeaders); // Security headers first
app.use(applySecurityMiddleware); // Custom security middleware
app.use(corsMiddleware); // CORS after security headers
app.use(validatePayloadSize); // Validate payload size
app.use(bodyParser.json({ limit: config.security.validation.maxPayloadSize }));
app.use(sanitizeBody); // Sanitize request body
app.use(authenticateJWT); // JWT authentication (optional)
app.use(speedLimiter); // Progressive rate limiting
app.use(rateLimiter); // Basic rate limiting

// Health check endpoint (must be before Apollo Server)
app.get(
  '/health',
  healthCheckRateLimiter,
  (req: express.Request, res: express.Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  }
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  '/',
  requireAuthForMutations, // Require auth for mutations
  expressMiddleware(server, {
    context: contextMiddleware,
  })
);

// Start server
app.listen(config.server.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 BFF Server ready at: http://localhost:${config.server.port}`);
  // eslint-disable-next-line no-console
  console.log(`📊 GraphQL endpoint: http://localhost:${config.server.port}/`);
  // eslint-disable-next-line no-console
  console.log(`🏥 Health check: http://localhost:${config.server.port}/health`);
});
