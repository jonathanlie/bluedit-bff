export const voteTypeDefs = `#graphql
  type Vote {
    id: ID!
    value: Int!
    user: User
    votable: Voteable
  }

  union Voteable = Post | Comment
`;
