import { userTypeDefs } from './types/user.js';
import { postTypeDefs } from './types/post.js';
import { commentTypeDefs } from './types/comment.js';
import { voteTypeDefs } from './types/vote.js';
import { subblueditTypeDefs } from './types/subbluedit.js';

import { queryTypeDefs } from './queries/index.js';
import { mutationTypeDefs } from './mutations/index.js';

export const typeDefs = `#graphql
  ${userTypeDefs}
  ${postTypeDefs}
  ${commentTypeDefs}
  ${voteTypeDefs}
  ${subblueditTypeDefs}
  ${queryTypeDefs}
  ${mutationTypeDefs}
`;
