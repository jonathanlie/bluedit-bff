import { apiClient } from '../../../services/api-client.js';
import { CookieService } from '../../../services/cookie-service.js';

export const authMutationResolvers = {
  signInWithGoogle: async (_, { googleToken }, context) => {
    console.log('BFF: Received signInWithGoogle request with token length:', googleToken?.length);

    try {
      console.log('BFF: Making request to Rails API at:', '/auth/google');
      const response = await apiClient.post('/auth/google', {
        google_token: googleToken,
      });

      console.log('BFF: Rails API response:', response);
      const { token, user } = response;

      CookieService.setToken(context.res, token);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url,
      };
    } catch (error) {
      console.error('BFF: Error calling Rails API:', error.message);
      throw new Error(`Failed to authenticate with backend API: ${error.message}`);
    }
  },
};
