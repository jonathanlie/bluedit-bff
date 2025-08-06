export const commentTypeDefs = `#graphql
  type Comment {
    id: ID!
    body: String!
    user: User
    post: Post
    parentComment: Comment
    replies: [Comment!]
    votes: [Vote!]
  }
`;
