import { subblueditTypeResolvers } from './subbluedit.js';
import { postTypeResolvers } from './post.js';
import { commentTypeResolvers } from './comment.js';
import { voteTypeResolvers } from './vote.js';

export const typeResolvers = {
  Subbluedit: subblueditTypeResolvers,
  Post: postTypeResolvers,
  Comment: commentTypeResolvers,
  Vote: voteTypeResolvers,
  Voteable: {
    __resolveType(obj) {
      if (obj.title) return 'Post';
      if (obj.body) return 'Comment';
      return null;
    },
  },
};
