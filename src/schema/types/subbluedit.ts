export const subblueditTypeDefs = `#graphql
  type Subbluedit {
    id: ID!
    name: String!
    description: String!
    user: User
    posts: [Post!]
  }
`;
