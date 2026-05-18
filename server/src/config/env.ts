/**
 * Validated, typed environment configuration.
 * All env vars are accessed through this module — never process.env directly.
 */

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  port: parseInt(process.env['PORT'] ?? '5000', 10),
  nodeEnv: (process.env['NODE_ENV'] ?? 'development') as
    | 'development'
    | 'production'
    | 'test',
  mongodbUri: requireEnv('MONGODB_URI'),
  corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',
  logLevel: (process.env['LOG_LEVEL'] ?? 'info') as
    | 'error'
    | 'warn'
    | 'info'
    | 'http'
    | 'debug',
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '7d',
  isDev(): boolean {
    return this.nodeEnv === 'development';
  },
  isProd(): boolean {
    return this.nodeEnv === 'production';
  },
} as const;
