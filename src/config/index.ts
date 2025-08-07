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
  jwtSecret: string;
  jwtExpiresIn: string;
}

interface SecurityConfig {
  rateLimit: {
    windowMs: number;
    max: number;
    message: string;
  };
  slowDown: {
    windowMs: number;
    delayAfter: number;
    delayMs: number;
  };
  validation: {
    maxQueryDepth: number;
    maxQueryComplexity: number;
    maxPayloadSize: string;
  };
}

interface Config {
  api: ApiConfig;
  server: ServerConfig;
  auth: AuthConfig;
  security: SecurityConfig;
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
    jwtSecret:
      process.env['JWT_SECRET'] ||
      'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: '24h',
  },
  security: {
    rateLimit: {
      windowMs:
        process.env['NODE_ENV'] === 'production' ? 15 * 60 * 1000 : 60 * 1000, // 15 min prod, 1 min dev
      max: process.env['NODE_ENV'] === 'production' ? 100 : 1000, // 100 prod, 1000 dev
      message: 'Too many requests from this IP, please try again later.',
    },
    slowDown: {
      windowMs:
        process.env['NODE_ENV'] === 'production' ? 15 * 60 * 1000 : 60 * 1000, // 15 min prod, 1 min dev
      delayAfter: process.env['NODE_ENV'] === 'production' ? 50 : 500, // 50 prod, 500 dev
      delayMs: process.env['NODE_ENV'] === 'production' ? 500 : 100, // 500ms prod, 100ms dev
    },
    validation: {
      maxQueryDepth: 10,
      maxQueryComplexity: 1000,
      maxPayloadSize: process.env['NODE_ENV'] === 'production' ? '1mb' : '10mb',
    },
  },
};
