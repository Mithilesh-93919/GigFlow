import morgan, { StreamOptions } from 'morgan';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { env } from '../config/env';

// Pipe morgan output into the winston logger
const stream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

// Skip logging in test environment
const skip = (): boolean => env.nodeEnv === 'test';

const morganFormat = env.isDev()
  ? ':method :url :status :res[content-length] - :response-time ms'
  : ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]';

/**
 * HTTP request logger middleware.
 * Colourised in development, Apache Combined Log Format in production.
 */
export const requestLogger = morgan(
  (tokens: morgan.TokenIndexer<Request, Response>, req: Request, res: Response) => {
    return [
      tokens['method'](req, res),
      tokens['url'](req, res),
      tokens['status'](req, res),
      tokens['res'](req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');
  },
  { stream, skip },
);

export { morganFormat };
