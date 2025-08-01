import { apiClient } from '../../../services/api-client.js';
import { CookieService } from '../../../services/cookie-service.js';

export const voteMutationResolvers = {
  vote: async (_, { votableId, votableType, value }, context) => {
    const token = CookieService.getToken(context.req.headers.cookie);
    if (!token) throw new Error('Not authenticated');

    try {
      let endpoint;

      if (votableType === 'Post') {
        // For posts, we need to get the post first to find its subbluedit
        const post = await apiClient.get(`/posts/${votableId}`);
        endpoint = `/subbluedits/${post.subbluedit.name}/posts/${votableId}/vote`;
      } else if (votableType === 'Comment') {
        endpoint = `/comments/${votableId}/vote`;
      } else {
        throw new Error('Invalid votableType. Must be "Post" or "Comment"');
      }

      await apiClient.post(
        endpoint,
        { vote: { value } },
        { Authorization: `Bearer ${token}` }
      );

      return true;
    } catch (error) {
      throw error;
    }
  },
};
