import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface SuccessPayload<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

interface ErrorPayload {
  success: false;
  message: string;
  errors?: unknown;
}

/**
 * Send a typed success response.
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: number = StatusCodes.OK,
  meta?: Record<string, unknown>,
): Response<SuccessPayload<T>> => {
  const payload: SuccessPayload<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(payload);
};

/**
 * Send a typed error response.
 */
export const sendError = (
  res: Response,
  message = 'Internal Server Error',
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  errors?: unknown,
): Response<ErrorPayload> => {
  const payload: ErrorPayload = {
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {}),
  };
  return res.status(statusCode).json(payload);
};
