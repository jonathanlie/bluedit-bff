import { authMutations } from './auth.js';
import { postMutations } from './post.js';
import { commentMutations } from './comment.js';
import { voteMutations } from './vote.js';
import { subblueditMutations } from './subbluedit.js';

export const mutationTypeDefs = `#graphql
  type Mutation {
    ${authMutations}
    ${postMutations}
    ${commentMutations}
    ${voteMutations}
    ${subblueditMutations}
  }
`;
