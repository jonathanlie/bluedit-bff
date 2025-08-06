import { userQueries } from './user.js';
import { postQueries } from './post.js';
import { subblueditQueries } from './subbluedit.js';

export const queryTypeDefs = `#graphql
  type Query {
    ${userQueries}
    ${postQueries}
    ${subblueditQueries}
  }
`;
