import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Point to the schema files directly
  schema: 'src/schema/**/*.ts',
  generates: {
    // Specify the output path for the generated types
    './src/generated/graphql-types.ts': {
      plugins: [
        'typescript', // Generates base types (e.g., User, Post)
        'typescript-resolvers', // Generates types for your resolvers
      ],
      config: {
        // This helps the resolver types know the shape of your context
        contextType: '../middleware/context#GraphQLContext',
        mappers: {
          // Map GraphQL types to your domain types if needed
          User: './graphql-types#User',
          Post: './graphql-types#Post',
          Comment: './graphql-types#Comment',
          Vote: './graphql-types#Vote',
          Subbluedit: './graphql-types#Subbluedit',
        },
      },
    },
  },
};

export default config;
