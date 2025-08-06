interface ApiConfig {
  url: string;
  timeout: number;
}

interface CorsConfig {
  origin: string;
  credentials: boolean;
}

interface ServerConfig {
  port: string | number;
  cors: CorsConfig;
}

interface CookieOptions {
  httpOnly: boolean;
  path: string;
  sameSite: string;
  maxAge: number;
}

interface AuthConfig {
  cookieName: string;
  cookieOptions: CookieOptions;
}

interface Config {
  api: ApiConfig;
  server: ServerConfig;
  auth: AuthConfig;
}

export const config: Config = {
  api: {
    url: process.env['API_URL'] || 'http://localhost:3000/api/v1',
    timeout: 10000,
  },
  server: {
    port: process.env['PORT'] || 4000,
    cors: {
      origin: process.env['CORS_ORIGIN'] || 'http://localhost:3001',
      credentials: true,
    },
  },
  auth: {
    cookieName: 'session_token',
    cookieOptions: {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  },
};
