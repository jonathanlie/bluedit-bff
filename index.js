import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import axios from 'axios';
import cors from 'cors';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

const typeDefs = `#graphql
  type User {
    id: ID!
    name: String
    email: String!
    avatarUrl: String
  }

  type Query {
    # Fetches the currently logged-in user
    me: User
  }

  type Mutation {
    signInWithGoogle(googleToken: String!): User
  }
`;

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      // 1. Get the session token from the browser's cookie
      const token = context.req.headers.cookie?.split('session_token=')[1];

      if (!token) {
        return null; // No user is logged in
      }

      try {
        // 2. Send the token to the API to get the user's data
        //    (We will need to build this protected endpoint in Rails next)
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;

        // 3. Return the user data to the frontend
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatar_url,
        };
      } catch (error) {
        // Token is invalid or expired
        console.error("Session validation failed:", error);
        return null;
      }
    },
  },
  Mutation: {
    signInWithGoogle: async (_, { googleToken }, context) => {
      console.log('BFF: Received signInWithGoogle request with token length:', googleToken?.length);
      try {
        console.log('BFF: Making request to Rails API at:', `${API_URL}/auth/google`);
        const response = await axios.post(`${API_URL}/auth/google`, {
          google_token: googleToken,
        });

        console.log('BFF: Rails API response:', response.data);
        const { token, user } = response.data;

        context.res.setHeader(
          'Set-Cookie',
          `session_token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=2592000` // 30 days
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatar_url,
        };
      } catch (error) {
        console.error('BFF: Error calling Rails API:', error.response?.data || error.message);
        throw new Error(`Failed to authenticate with backend API: ${error.response?.data?.error || error.message}`);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req, res }) => ({ req, res }),
  listen: { port: 4000 },
  middleware: [
    cors({
      origin: 'http://localhost:3001',
      credentials: true,
    }),
  ],
});

console.log(`🚀 BFF Server ready at: ${url}`);
