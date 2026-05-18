import { UserModel } from '../models/User.model';
import { generateToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/AppError';
import { AuthResponse, IUserResponse } from '../types/index';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Strip the password field and return a plain IUserResponse object.
 * Using toObject() to get a POJO from the Mongoose document.
 */
const toUserResponse = (user: InstanceType<typeof UserModel>): IUserResponse => {
  const obj = user.toObject<IUserResponse>();
  return {
    _id: String(obj._id),
    name: obj.name,
    email: obj.email,
    role: obj.role,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// ─── Service ──────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Register a new user.
   * Throws ConflictError if the email is already taken.
   */
  async register(data: RegisterInput): Promise<AuthResponse> {
    const existing = await UserModel.findOne({ email: data.email });
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role ?? 'sales',
    });

    const token = generateToken({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });

    return { user: toUserResponse(user), token };
  },

  /**
   * Authenticate a user with email and password.
   * Throws UnauthorizedError for invalid credentials (same message for both
   * unknown email and wrong password to prevent user enumeration).
   */
  async login(data: LoginInput): Promise<AuthResponse> {
    // .select('+password') re-enables the field excluded in the schema
    const user = await UserModel.findOne({ email: data.email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });

    return { user: toUserResponse(user), token };
  },

  /**
   * Fetch the profile for an authenticated user (password excluded).
   * Throws NotFoundError if the user no longer exists in the DB.
   */
  async getProfile(userId: string): Promise<IUserResponse> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return toUserResponse(user);
  },
};
