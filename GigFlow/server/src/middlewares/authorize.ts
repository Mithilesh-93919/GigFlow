import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '../types/index';
import { ForbiddenError, UnauthorizedError } from '../utils/AppError';

/**
 * authorize middleware factory
 *
 * Usage (after authenticate):
 *   router.delete('/:id', authenticate, authorize('admin'), asyncHandler(deleteUser));
 *
 * Passing multiple roles grants access to any of them:
 *   router.get('/reports', authenticate, authorize('admin', 'sales'), asyncHandler(getReports));
 */
export const authorize =
  (...roles: UserRole[]): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Not authenticated'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(
        new ForbiddenError(
          `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
        ),
      );
      return;
    }

    next();
  };
