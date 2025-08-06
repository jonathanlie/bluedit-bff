import { CommentResolvers, ResolversParentTypes } from '../../../generated/graphql-types.js';

export const commentResolvers: CommentResolvers = {
  user: async (comment: ResolversParentTypes['Comment']) => comment.user ?? null,
  post: async (comment: ResolversParentTypes['Comment']) => comment.post ?? null,
  parentComment: async (comment: ResolversParentTypes['Comment']) => comment.parentComment ?? null,
  replies: async (comment: ResolversParentTypes['Comment']) => comment.replies ?? [],
  votes: async (comment: ResolversParentTypes['Comment']) => comment.votes ?? [],
};
