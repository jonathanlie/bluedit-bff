import { userQueryResolvers } from './user.js';
import { postQueryResolvers } from './post.js';
import { subblueditQueryResolvers } from './subbluedit.js';

export const queryResolvers = {
  ...userQueryResolvers,
  ...postQueryResolvers,
  ...subblueditQueryResolvers,
};
