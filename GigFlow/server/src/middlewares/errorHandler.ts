import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { env } from '../config/env';

/**
 * Centralised error-handling middleware.
 * Must be registered last in the Express pipeline (after all routes).
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  logger.error(`[${req.method}] ${req.path} — ${err.message}`, {
    stack: env.isDev() ? err.stack : undefined,
  });

  // Operational errors we deliberately threw
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    sendError(res, 'Validation failed', StatusCodes.UNPROCESSABLE_ENTITY, messages);
    return;
  }

  // Mongoose duplicate key
  if ((err as NodeJS.ErrnoException).code === '11000') {
    sendError(res, 'Duplicate field value', StatusCodes.CONFLICT);
    return;
  }

  // Mongoose cast error (invalid ObjectId etc.)
  if (err instanceof mongoose.Error.CastError) {
    sendError(res, `Invalid ${err.path}: ${err.value}`, StatusCodes.BAD_REQUEST);
    return;
  }

  // Unknown / programmer error — don't leak internals
  sendError(
    res,
    env.isDev() ? err.message : 'Internal server error',
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
};
