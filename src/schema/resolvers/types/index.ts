import {
  VoteableResolvers,
  ResolversParentTypes,
} from '../../../generated/graphql-types.js';
import { commentResolvers } from './comment.js';
import { postResolvers } from './post.js';
import { subblueditResolvers } from './subbluedit.js';
import { voteResolvers } from './vote.js';

export const voteableResolvers: VoteableResolvers = {
  __resolveType(obj: ResolversParentTypes['Voteable']) {
    if ('title' in obj) {
      return 'Post';
    }
    if ('body' in obj && !('title' in obj)) {
      return 'Comment';
    }
    return null;
  },
};

export const typeResolvers = {
  Comment: commentResolvers,
  Post: postResolvers,
  Subbluedit: subblueditResolvers,
  Vote: voteResolvers,
  Voteable: voteableResolvers,
};
