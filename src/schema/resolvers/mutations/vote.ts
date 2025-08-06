import { apiClient } from '../../../services/api-client.js';
import { MutationResolvers } from '../../../generated/graphql-types.js';
import { GraphQLContext } from '../../../middleware/context.js';
import { ApiVoteResponse } from '../../../types/api.js';

export const voteMutationResolvers: MutationResolvers = {
  vote: async (
    _: unknown,
    { votableId, votableType, value },
    context: GraphQLContext
  ): Promise<boolean | null> => {
    try {
      const response = await apiClient.post('/votes', {
        votable_id: votableId,
        votable_type: votableType,
        value,
      }, {
        'Cookie': context.req.headers.cookie || '',
      }) as ApiVoteResponse;

      return response.success;
    } catch (error) {
      console.error('Error voting:', error);
      throw new Error('Failed to vote');
    }
  },
};
