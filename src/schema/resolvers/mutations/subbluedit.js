import { apiClient } from '../../../services/api-client.js';
import { CookieService } from '../../../services/cookie-service.js';

export const subblueditMutationResolvers = {
  createSubbluedit: async (_, { name, description }, context) => {
    const token = CookieService.getToken(context.req.headers.cookie);
    if (!token) throw new Error('Not authenticated');

    try {
      const sub = await apiClient.post(
        '/subbluedits',
        { subbluedit: { name, description } },
        { Authorization: `Bearer ${token}` }
      );

      return {
        id: sub.id,
        name: sub.name,
        description: sub.description,
        user: sub.user,
        posts: sub.posts,
      };
    } catch (error) {
      throw error;
    }
  },
};
