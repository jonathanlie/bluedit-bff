import { apiClient } from '../../../services/api-client.js';

export const subblueditQueryResolvers = {
  subblueditByName: async (_, { name }) => {
    try {
      const sub = await apiClient.get(`/subbluedits/${encodeURIComponent(name)}`);
      return {
        id: sub.id,
        name: sub.name,
        description: sub.description,
        user: sub.user,
        posts: sub.posts,
      };
    } catch (error) {
      if (error.message.includes('404')) return null;
      throw error;
    }
  },
};
