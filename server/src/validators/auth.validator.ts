import { z } from 'zod';
import { UserRole } from '../types/index';

// ─── Reusable Field Schemas ───────────────────────────────────────────────────

const nameSchema = z
  .string({ required_error: 'Name is required' })
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters');

const emailSchema = z
  .string({ required_error: 'Email is required' })
  .email('Please provide a valid email address')
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const roleSchema = z
  .enum(['admin', 'sales'] satisfies [UserRole, ...UserRole[]])
  .default('sales');

// ─── Register Schema ──────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema.optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Login Schema ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
