import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

const typeDefs = `#graphql
  type User {
    id: ID!
    name: String
    email: String!
    avatarUrl: String
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    user: User
    subbluedit: Subbluedit
  }

  type Subbluedit {
    id: ID!
    name: String!
    description: String!
    user: User
    posts: [Post!]
  }

  type Query {
    me: User
    subblueditByName(name: String!): Subbluedit
  }

  type Mutation {
    signInWithGoogle(googleToken: String!): User
    createSubbluedit(name: String!, description: String): Subbluedit
    createPost(subblueditId: ID!, title: String!, body: String): Post
  }
`;

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      // 1. Get the session token from the browser's cookie
      const cookies = context.req.headers.cookie;
      const token = cookies?.split(';')
        .find(cookie => cookie.trim().startsWith('session_token='))
        ?.split('=')[1];

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
    subblueditByName: async (_, { name }, context) => {
      try {
        const response = await axios.get(`${API_URL}/subbluedits/${encodeURIComponent(name)}`);
        const sub = response.data;
        return {
          id: sub.id,
          name: sub.name,
          description: sub.description,
          user: sub.user,
          posts: sub.posts,
        };
      } catch (error) {
        if (error.response && error.response.status === 404) return null;
        throw new Error(error.response?.data?.error || error.message);
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
    createSubbluedit: async (_, { name, description }, context) => {
      const cookies = context.req.headers.cookie;
      const token = cookies?.split(';')
        .find(cookie => cookie.trim().startsWith('session_token='))
        ?.split('=')[1];
      if (!token) throw new Error('Not authenticated');
      try {
        const response = await axios.post(
          `${API_URL}/subbluedits`,
          { subbluedit: { name, description } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sub = response.data;
        return {
          id: sub.id,
          name: sub.name,
          description: sub.description,
          user: sub.user,
          posts: sub.posts,
        };
      } catch (error) {
        throw new Error(error.response?.data?.errors?.join(', ') || error.message);
      }
    },
    createPost: async (_, { subblueditId, title, body }, context) => {
      const cookies = context.req.headers.cookie;
      const token = cookies?.split(';')
        .find(cookie => cookie.trim().startsWith('session_token='))
        ?.split('=')[1];
      if (!token) throw new Error('Not authenticated');
      try {
        const response = await axios.post(
          `${API_URL}/subbluedits/${subblueditId}/posts`,
          { post: { title, body } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const post = response.data;
        return {
          id: post.id,
          title: post.title,
          body: post.body,
          user: post.user,
          subbluedit: post.subbluedit,
        };
      } catch (error) {
        throw new Error(error.response?.data?.errors?.join(', ') || error.message);
      }
    },
  },
  Subbluedit: {
    user: async (subbluedit) => subbluedit.user,
    posts: async (subbluedit) => subbluedit.posts,
  },
  Post: {
    user: async (post) => post.user,
    subbluedit: async (post) => post.subbluedit,
  },
};

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));
app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
await server.start();

app.use('/', expressMiddleware(server, {
  context: async ({ req, res }) => ({ req, res }),
}));

app.listen(4000, () => {
  console.log('🚀 BFF Server ready at: http://localhost:4000');
});
