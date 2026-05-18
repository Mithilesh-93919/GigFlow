import { Schema, model, Document, Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export const LEAD_SOURCES = ['Website', 'Instagram', 'Referral'] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES as unknown as string[],
        message: `Status must be one of: ${LEAD_STATUSES.join(', ')}`,
      },
      default: 'New',
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      enum: {
        values: LEAD_SOURCES as unknown as string[],
        message: `Source must be one of: ${LEAD_SOURCES.join(', ')}`,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdBy: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const LeadModel = model<ILead>('Lead', leadSchema);
