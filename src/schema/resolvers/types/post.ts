import {
  PostResolvers,
  ResolversParentTypes,
} from '../../../generated/graphql-types.js';

export const postResolvers: PostResolvers = {
  user: async (post: ResolversParentTypes['Post']) => post.user ?? null,
  subbluedit: async (post: ResolversParentTypes['Post']) =>
    post.subbluedit ?? null,
  comments: async (post: ResolversParentTypes['Post']) => post.comments ?? [],
  votes: async (post: ResolversParentTypes['Post']) => post.votes ?? [],
};
