import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '../utils/apiResponse';

/**
 * Catch-all 404 handler.
 * Register this AFTER all routes but BEFORE the error handler.
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, StatusCodes.NOT_FOUND);
};
