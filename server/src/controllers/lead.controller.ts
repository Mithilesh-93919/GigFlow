import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { leadService, LeadQuery } from '../services/lead.service';
import { UnauthorizedError } from '../utils/AppError';
import { CreateLeadInput, UpdateLeadInput } from '../validators/lead.validator';

/**
 * POST /api/v1/leads
 * Creates a new lead. createdBy is always set from req.user.id.
 * Accessible by: admin, sales
 */
export const createLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const body = req.body as CreateLeadInput;
  const lead = await leadService.create(body, req.user.id);

  sendSuccess(res, lead, 'Lead created successfully', StatusCodes.CREATED);
});

/**
 * GET /api/v1/leads
 * Returns a paginated list of all leads.
 * Query params: page, limit, status, source, search, sort
 * Accessible by: admin, sales
 */
export const getLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const query = req.query as unknown as LeadQuery;
  const result = await leadService.findAll(query);

  sendSuccess(res, result, 'Leads retrieved successfully', StatusCodes.OK);
});

/**
 * GET /api/v1/leads/:id
 * Retrieves a single lead by ID.
 * Accessible by: admin, sales
 */
export const getLeadById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const { id } = req.params as { id: string };
  const lead = await leadService.findById(id);

  sendSuccess(res, lead, 'Lead retrieved successfully', StatusCodes.OK);
});

/**
 * PUT /api/v1/leads/:id
 * Updates a lead. Only provided fields are updated (partial update).
 * Accessible by: admin, sales
 */
export const updateLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const { id } = req.params as { id: string };
  const body = req.body as UpdateLeadInput;
  const lead = await leadService.update(id, body);

  sendSuccess(res, lead, 'Lead updated successfully', StatusCodes.OK);
});

/**
 * DELETE /api/v1/leads/:id
 * Hard-deletes a lead.
 * Accessible by: admin only
 */
export const deleteLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const { id } = req.params as { id: string };
  await leadService.remove(id);

  sendSuccess(res, null, 'Lead deleted successfully', StatusCodes.OK);
});

/**
 * GET /api/v1/leads/export
 * Exports leads to CSV format. Maintains active filters.
 * Accessible by: admin, sales
 */
export const exportLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new UnauthorizedError('Not authenticated');

  const query = req.query as unknown as LeadQuery;
  const csv = await leadService.exportToCsv(query);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=leads-export-${Date.now()}.csv`);
  res.status(StatusCodes.OK).send(csv);
});
