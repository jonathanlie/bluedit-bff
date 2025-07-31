export const commentTypeResolvers = {
  user: async (comment) => comment.user,
  post: async (comment) => comment.post,
  parentComment: async (comment) => comment.parent_comment,
  replies: async (comment) => comment.replies || [],
  votes: async (comment) => comment.votes || [],
};
