import { authMutationResolvers } from './auth.js';
import { commentMutationResolvers } from './comment.js';
import { postMutationResolvers } from './post.js';
import { subblueditMutationResolvers } from './subbluedit.js';
import { voteMutationResolvers } from './vote.js';

export const mutationResolvers = {
  ...authMutationResolvers,
  ...commentMutationResolvers,
  ...postMutationResolvers,
  ...subblueditMutationResolvers,
  ...voteMutationResolvers,
};
