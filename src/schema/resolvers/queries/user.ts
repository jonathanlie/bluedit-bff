import { apiClient } from '../../../services/api-client.js';
import { QueryResolvers, User } from '../../../generated/graphql-types.js';
import { GraphQLContext } from '../../../middleware/context.js';
import { ApiUser } from '../../../types/api.js';

export const userQueryResolvers: QueryResolvers = {
  me: async (
    _: unknown,
    __: unknown,
    context: GraphQLContext
  ): Promise<User | null> => {
    try {
      const response = await apiClient.get('/auth/me', {
        'Cookie': context.req.headers.cookie || '',
      }) as ApiUser;

      return response as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },
};
