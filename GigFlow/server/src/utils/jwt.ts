import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types/index';
import { UnauthorizedError } from './AppError';

/**
 * Sign a JWT token with the given payload.
 * Expiry is driven by JWT_EXPIRES_IN env var (default: 7d).
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verify and decode a JWT token.
 * Throws UnauthorizedError if the token is invalid or expired.
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    // jwt.verify returns string | JwtPayload (from @types/jsonwebtoken)
    if (typeof decoded === 'string') {
      throw new UnauthorizedError('Invalid token payload');
    }

    // Narrow to our JwtPayload shape
    const { id, email, role } = decoded as JwtPayload;
    if (!id || !email || !role) {
      throw new UnauthorizedError('Malformed token payload');
    }

    return { id, email, role };
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;

    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }

    throw new UnauthorizedError('Token verification failed');
  }
};
