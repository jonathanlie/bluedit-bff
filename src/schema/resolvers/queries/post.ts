import { apiClient } from '../../../services/api-client.js';
import { QueryResolvers, Post } from '../../../generated/graphql-types.js';
import { ApiPost } from '../../../types/api.js';

export const postQueryResolvers: QueryResolvers = {
  postById: async (
    _: unknown,
    { id }
  ): Promise<Post | null> => {
    try {
      const response = await apiClient.get(`/posts/${id}`) as ApiPost;
      return response as Post;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      console.error('Error fetching post:', error);
      throw new Error('Failed to fetch post');
    }
  },
};
