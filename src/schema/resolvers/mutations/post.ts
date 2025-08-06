import { apiClient } from '../../../services/api-client.js';
import { MutationResolvers, Post } from '../../../generated/graphql-types.js';
import { GraphQLContext } from '../../../middleware/context.js';
import { ApiPost } from '../../../types/api.js';

export const postMutationResolvers: MutationResolvers = {
  createPost: async (
    _: unknown,
    { subblueditName, title, body },
    context: GraphQLContext
  ): Promise<Post | null> => {
    try {
      const response = (await apiClient.post(
        '/posts',
        {
          subbluedit_name: subblueditName,
          title,
          body,
        },
        {
          Cookie: context.req.headers.cookie || '',
        }
      )) as ApiPost;

      return response as Post;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  },
};
