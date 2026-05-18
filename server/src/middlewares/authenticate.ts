import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * authenticate middleware
 *
 * Expects: Authorization: Bearer <token>
 * On success: attaches decoded payload to req.user and calls next().
 * On failure: forwards an UnauthorizedError to the global error handler.
 */
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization header missing or malformed');
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // verifyToken throws UnauthorizedError on any failure
    const payload = verifyToken(token);

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  },
);
