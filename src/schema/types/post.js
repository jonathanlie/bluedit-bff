export const postTypeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    body: String!
    user: User
    subbluedit: Subbluedit
    comments: [Comment!]
    votes: [Vote!]
  }
`;
