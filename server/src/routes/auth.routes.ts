import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validators/auth.validator';

export const authRouter = Router();

/**
 * POST /api/v1/auth/register
 * Body validated against registerSchema before reaching the controller.
 */
authRouter.post('/register', validate('body', registerSchema), register);

/**
 * POST /api/v1/auth/login
 * Body validated against loginSchema before reaching the controller.
 */
authRouter.post('/login', validate('body', loginSchema), login);

/**
 * GET /api/v1/auth/profile
 * Requires a valid Bearer token.
 */
authRouter.get('/profile', authenticate, getProfile);
