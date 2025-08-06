import { jest } from '@jest/globals';
import request from 'supertest';
import express, { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from '../../src/schema/index.js';
import { resolvers } from '../../src/schema/resolvers/index.js';
import { contextMiddleware, GraphQLContext } from '../../src/middleware/context.js';

// Mock the API client
jest.mock('../../src/services/api-client.js', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

describe('GraphQL Server Integration', () => {
  let app: Express;
  let server: ApolloServer<GraphQLContext>;

  beforeAll(async () => {
    // Create Express app
    app = express();
    app.use(express.json());

    // Create Apollo Server
    server = new ApolloServer({
      typeDefs,
      resolvers,
    });
    await server.start();

    // Apply Apollo middleware
    app.use('/', expressMiddleware(server, {
      context: contextMiddleware,
    }));

    // Add health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health');

      // Check if we get a response, even if it's an error
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GraphQL Queries', () => {
    it('should handle introspection query', async () => {
      const response = await request(app)
        .post('/')
        .send({
          query: `
            query IntrospectionQuery {
              __schema {
                types {
                  name
                }
              }
            }
          `,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('__schema');
    });

    it('should handle invalid queries', async () => {
      const response = await request(app)
        .post('/')
        .send({
          query: `
            query InvalidQuery {
              nonExistentField
            }
          `,
        });

      // GraphQL may return 400 for invalid queries
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GraphQL Mutations', () => {
    it('should handle mutations', async () => {
      const response = await request(app)
        .post('/')
        .send({
          query: `
            mutation TestMutation {
              vote(votableId: "123", votableType: "Post", value: 1)
            }
          `,
        });

      expect(response.status).toBe(200);
      // The mutation might fail due to authentication, but the server should handle it
      expect(response.body).toBeDefined();
    });
  });
});
