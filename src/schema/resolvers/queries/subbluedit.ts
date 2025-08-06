import { apiClient } from '../../../services/api-client.js';
import { QueryResolvers, Subbluedit } from '../../../generated/graphql-types.js';
import { ApiSubbluedit } from '../../../types/api.js';

export const subblueditQueryResolvers: QueryResolvers = {
  subblueditByName: async (
    _: unknown,
    { name }
  ): Promise<Subbluedit | null> => {
    try {
      const response = await apiClient.get(`/subbluedits/${name}`) as ApiSubbluedit;
      return response as Subbluedit;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      console.error('Error fetching subbluedit:', error);
      throw new Error('Failed to fetch subbluedit');
    }
  },
};
