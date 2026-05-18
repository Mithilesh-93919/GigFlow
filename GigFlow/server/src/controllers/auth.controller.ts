import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { authService } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { UnauthorizedError } from '../utils/AppError';

/**
 * POST /api/v1/auth/register
 * Public — create a new user account.
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const body = req.body as RegisterInput;
  const result = await authService.register(body);
  sendSuccess(res, result, 'Account created successfully', StatusCodes.CREATED);
});

/**
 * POST /api/v1/auth/login
 * Public — authenticate and receive a JWT token.
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const body = req.body as LoginInput;
  const result = await authService.login(body);
  sendSuccess(res, result, 'Login successful', StatusCodes.OK);
});

/**
 * GET /api/v1/auth/profile
 * Protected — return the authenticated user's profile.
 */
export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Not authenticated');
  }
  const profile = await authService.getProfile(req.user.id);
  sendSuccess(res, profile, 'Profile retrieved successfully', StatusCodes.OK);
});
