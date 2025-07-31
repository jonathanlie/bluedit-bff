import { apiClient } from '../../../services/api-client.js';

export const postQueryResolvers = {
  postById: async (_, { id }) => {
    try {
      const post = await apiClient.get(`/posts/${id}`);
      return {
        id: post.id,
        title: post.title,
        body: post.body,
        user: post.user,
        subbluedit: post.subbluedit,
        comments: post.comments || [],
        votes: post.votes || [],
      };
    } catch (error) {
      if (error.message.includes('404')) return null;
      throw error;
    }
  },
};
