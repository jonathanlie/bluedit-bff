import { authMutationResolvers } from './auth.js';
import { postMutationResolvers } from './post.js';
import { commentMutationResolvers } from './comment.js';
import { voteMutationResolvers } from './vote.js';
import { subblueditMutationResolvers } from './subbluedit.js';

export const mutationResolvers = {
  ...authMutationResolvers,
  ...postMutationResolvers,
  ...commentMutationResolvers,
  ...voteMutationResolvers,
  ...subblueditMutationResolvers,
};
