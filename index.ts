import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { config } from './src/config/index.js';
import { typeDefs } from './src/schema/index.js';
import { resolvers } from './src/schema/resolvers/index.js';
import { corsMiddleware } from './src/middleware/cors.js';
import { contextMiddleware } from './src/middleware/context.js';

const app = express();

app.use(corsMiddleware);
app.use(bodyParser.json());

// Health check endpoint (must be before Apollo Server)
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  '/',
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
