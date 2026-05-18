import { z } from 'zod';
import { LEAD_STATUSES, LEAD_SOURCES } from '../models/Lead.model';

// Spread readonly const arrays into mutable tuples that z.enum() accepts
const statusTuple = [...LEAD_STATUSES] as [
  (typeof LEAD_STATUSES)[number],
  ...(typeof LEAD_STATUSES)[number][],
];

const sourceTuple = [...LEAD_SOURCES] as [
  (typeof LEAD_SOURCES)[number],
  ...(typeof LEAD_SOURCES)[number][],
];

// ─── Create Lead Schema ───────────────────────────────────────────────────────

export const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),

  status: z
    .enum(statusTuple, {
      errorMap: () => ({ message: `Status must be one of: ${LEAD_STATUSES.join(', ')}` }),
    })
    .optional()
    .default('New'),

  source: z.enum(sourceTuple, {
    required_error: 'Source is required',
    invalid_type_error: `Source must be one of: ${LEAD_SOURCES.join(', ')}`,
  }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

// ─── Update Lead Schema ───────────────────────────────────────────────────────

export const updateLeadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),

    email: z
      .string()
      .email('Please provide a valid email address')
      .toLowerCase()
      .trim()
      .optional(),

    status: z
      .enum(statusTuple, {
        errorMap: () => ({ message: `Status must be one of: ${LEAD_STATUSES.join(', ')}` }),
      })
      .optional(),

    source: z
      .enum(sourceTuple, {
        errorMap: () => ({ message: `Source must be one of: ${LEAD_SOURCES.join(', ')}` }),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

// ─── ID Param Schema ──────────────────────────────────────────────────────────

export const leadIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid lead ID format'),
});

export type LeadIdParam = z.infer<typeof leadIdParamSchema>;
