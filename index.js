import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// 1. Define your schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// 2. Define your resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from the Bluedit BFF!',
  },
};

// 3. Create the server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 4. Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 BFF Server ready at: ${url}`);
