import { apiClient } from '../../../services/api-client.js';
import { CookieService } from '../../../services/cookie-service.js';

export const commentMutationResolvers = {
  createComment: async (_, { postId, body }, context) => {
    const token = CookieService.getToken(context.req.headers.cookie);
    if (!token) throw new Error('Not authenticated');

    try {
      // First, get the post to find its subbluedit name
      const post = await apiClient.get(`/posts/${postId}`);

      const comment = await apiClient.post(
        `/subbluedits/${post.subbluedit.name}/posts/${postId}/comments`,
        { comment: { body } },
        { Authorization: `Bearer ${token}` }
      );

      return {
        id: comment.id,
        body: comment.body,
        user: comment.user,
        post: comment.post,
        parentComment: comment.parent_comment,
        replies: comment.replies || [],
        votes: comment.votes || [],
      };
    } catch (error) {
      throw error;
    }
  },
};
