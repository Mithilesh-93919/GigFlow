import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createLeadSchema, updateLeadSchema, leadIdParamSchema } from '../validators/lead.validator';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/lead.controller';

export const leadRouter = Router();

/**
 * All lead routes require a valid JWT — authenticate is applied globally here.
 * Role-based access is applied per-route via authorize().
 */
leadRouter.use(authenticate);

// ─── POST /api/v1/leads ─────────────────────────────────────────────────────
// admin and sales can create leads
leadRouter.post(
  '/',
  authorize('admin', 'sales'),
  validate('body', createLeadSchema),
  createLead,
);

// ─── GET /api/v1/leads ──────────────────────────────────────────────────────
// admin and sales can list all leads
leadRouter.get(
  '/',
  authorize('admin', 'sales'),
  getLeads,
);

// ─── GET /api/v1/leads/export ───────────────────────────────────────────────
// admin and sales can export leads to CSV
leadRouter.get(
  '/export',
  authorize('admin', 'sales'),
  exportLeads,
);

// ─── GET /api/v1/leads/:id ──────────────────────────────────────────────────
// admin and sales can view a single lead
leadRouter.get(
  '/:id',
  authorize('admin', 'sales'),
  validate('params', leadIdParamSchema),
  getLeadById,
);

// ─── PUT /api/v1/leads/:id ──────────────────────────────────────────────────
// admin and sales can update a lead
leadRouter.put(
  '/:id',
  authorize('admin', 'sales'),
  validate('params', leadIdParamSchema),
  validate('body', updateLeadSchema),
  updateLead,
);

// ─── DELETE /api/v1/leads/:id ───────────────────────────────────────────────
// only admin can delete leads
leadRouter.delete(
  '/:id',
  authorize('admin'),
  validate('params', leadIdParamSchema),
  deleteLead,
);
