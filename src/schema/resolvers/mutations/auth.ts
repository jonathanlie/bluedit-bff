import { apiClient } from '../../../services/api-client.js';
import { CookieService } from '../../../services/cookie-service.js';
import { MutationResolvers, User } from '../../../generated/graphql-types.js';
import { GraphQLContext } from '../../../middleware/context.js';
import { ApiAuthResponse } from '../../../types/api.js';

export const authMutationResolvers: MutationResolvers = {
  signInWithGoogle: async (
    _: unknown,
    { googleToken },
    context: GraphQLContext
  ): Promise<User | null> => {
    try {
      const response = (await apiClient.post('/auth/google', {
        google_token: googleToken,
      })) as ApiAuthResponse;
      const { token, user } = response;

      // Set the session cookie
      CookieService.setToken(context.res, token);

      return {
        id: user.id,
        name: user.name ?? null,
        email: user.email,
        avatarUrl: user.avatar_url ?? null,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing in with Google:', error);
      throw new Error('Failed to sign in with Google');
    }
  },
};
