import { UserRole } from './index';

/**
 * Express Request module augmentation.
 * Attaches `req.user` globally after the authenticate middleware runs.
 * No need to use a custom request type in controllers — `req.user` is available everywhere.
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}
