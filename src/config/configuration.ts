import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
    },
    server: {
      port: parseInt(process.env.PORT, 10) || 3000,
      nodeEnv: process.env.NODE_ENV || 'development',
    },
    cors: {
      origin: process.env.CORS_ORIGIN,
    },
    rateLimit: {
      ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
      max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    },
    cache: {
      ttl: parseInt(process.env.CACHE_TTL, 10) || 60,
      max: parseInt(process.env.CACHE_MAX, 10) || 100,
    },
    swagger: {
      title: process.env.SWAGGER_TITLE || 'OL API',
      description: process.env.SWAGGER_DESCRIPTION || 'API de OL',
      version: process.env.SWAGGER_VERSION || '1.0',
      path: process.env.SWAGGER_PATH || 'api',
    },
  };
}); 
