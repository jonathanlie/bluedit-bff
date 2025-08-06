import { apiClient } from '../../../services/api-client.js';
import { MutationResolvers, Subbluedit } from '../../../generated/graphql-types.js';
import { GraphQLContext } from '../../../middleware/context.js';
import { ApiSubbluedit } from '../../../types/api.js';

export const subblueditMutationResolvers: MutationResolvers = {
  createSubbluedit: async (
    _: unknown,
    { name, description },
    context: GraphQLContext
  ): Promise<Subbluedit | null> => {
    try {
      const response = await apiClient.post('/subbluedits', {
        name,
        description,
      }, {
        'Cookie': context.req.headers.cookie || '',
      }) as ApiSubbluedit;

      return response as Subbluedit;
    } catch (error) {
      console.error('Error creating subbluedit:', error);
      throw new Error('Failed to create subbluedit');
    }
  },
};
