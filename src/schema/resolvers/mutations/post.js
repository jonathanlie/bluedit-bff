import { apiClient } from '../../../services/api-client.js';
import { CookieService } from '../../../services/cookie-service.js';

export const postMutationResolvers = {
  createPost: async (_, { subblueditName, title, body }, context) => {
    const token = CookieService.getToken(context.req.headers.cookie);
    if (!token) throw new Error('Not authenticated');

    try {
      const post = await apiClient.post(
        `/subbluedits/${subblueditName}/posts`,
        { post: { title, body } },
        { Authorization: `Bearer ${token}` }
      );

      return {
        id: post.id,
        title: post.title,
        body: post.body,
        user: post.user,
        subbluedit: post.subbluedit,
      };
    } catch (error) {
      throw error;
    }
  },
};
