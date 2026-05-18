import { Schema, model, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types/index';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Excluded from queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'sales'] satisfies UserRole[],
        message: 'Role must be admin or sales',
      },
      default: 'sales',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────



// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Hash password before saving — only when it has been modified. */
userSchema.pre('save', async function (next: (err?: CallbackError) => void) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

// ─── Methods ─────────────────────────────────────────────────────────────────

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

// ─── Model ───────────────────────────────────────────────────────────────────

export const UserModel = model<IUser>('User', userSchema);
