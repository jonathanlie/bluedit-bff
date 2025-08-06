import { apiClient } from '../../../services/api-client.js';
import {
  MutationResolvers,
  Comment,
} from '../../../generated/graphql-types.js';
import { GraphQLContext } from '../../../middleware/context.js';
import { ApiComment } from '../../../types/api.js';

export const commentMutationResolvers: MutationResolvers = {
  createComment: async (
    _: unknown,
    { postId, body },
    context: GraphQLContext
  ): Promise<Comment | null> => {
    try {
      const response = (await apiClient.post(
        '/comments',
        {
          post_id: postId,
          body,
        },
        {
          Cookie: context.req.headers.cookie || '',
        }
      )) as ApiComment;

      return response as Comment;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating comment:', error);
      throw new Error('Failed to create comment');
    }
  },
};
