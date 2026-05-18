import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/apiResponse';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response): void => {
  sendSuccess(
    res,
    {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    },
    'Service is healthy',
    StatusCodes.OK,
  );
});
