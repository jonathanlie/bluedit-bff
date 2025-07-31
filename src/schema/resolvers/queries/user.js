import { apiClient } from '../../../services/api-client.js';
import { CookieService } from '../../../services/cookie-service.js';

export const userQueryResolvers = {
  me: async (_, __, context) => {
    const token = CookieService.getToken(context.req.headers.cookie);

    if (!token) {
      return null;
    }

    try {
      const user = await apiClient.get('/auth/me', {
        Authorization: `Bearer ${token}`,
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url,
      };
    } catch (error) {
      console.error("Session validation failed:", error);
      return null;
    }
  },
};
