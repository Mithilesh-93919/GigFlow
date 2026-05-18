import { Types, FilterQuery } from 'mongoose';
import { Parser } from 'json2csv';
import { LeadModel, ILead } from '../models/Lead.model';
import { NotFoundError, BadRequestError } from '../utils/AppError';
import { PaginatedResult, PaginationQuery } from '../types/index';
import { parsePagination, buildPaginatedResult } from '../utils/pagination';
import { CreateLeadInput, UpdateLeadInput } from '../validators/lead.validator';

export interface LeadQuery extends PaginationQuery {
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
}

// ─── Response Type ────────────────────────────────────────────────────────────

export interface ILeadResponse {
  _id: string;
  name: string;
  email: string;
  status: ILead['status'];
  source: ILead['source'];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const toLeadResponse = (lead: ILead): ILeadResponse => ({
  _id: String(lead._id),
  name: lead.name,
  email: lead.email,
  status: lead.status,
  source: lead.source,
  createdBy: String(lead.createdBy),
  createdAt: lead.createdAt,
  updatedAt: lead.updatedAt,
});

// ─── Service ──────────────────────────────────────────────────────────────────

export const leadService = {
  /**
   * Create a new lead.
   * createdBy is always taken from the authenticated user — never from request body.
   */
  async create(data: CreateLeadInput, userId: string): Promise<ILeadResponse> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    const lead = await LeadModel.create({
      ...data,
      createdBy: new Types.ObjectId(userId),
    });

    return toLeadResponse(lead);
  },

  /**
   * Return a paginated list of all leads.
   * Supports: page, limit, status, source, search, sort
   */
  async findAll(query: LeadQuery): Promise<PaginatedResult<ILeadResponse>> {
    const { page, limit, skip } = parsePagination(query);

    const filter: FilterQuery<ILead> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.source) {
      filter.source = query.source;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    let sortObj: Record<string, 1 | -1> = { createdAt: -1 }; // latest default
    if (query.sort === 'oldest') {
      sortObj = { createdAt: 1 };
    } else if (query.sort === 'latest') {
      sortObj = { createdAt: -1 };
    }

    const [leads, total] = await Promise.all([
      LeadModel.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean<ILead[]>(),
      LeadModel.countDocuments(filter),
    ]);

    const data = leads.map((lead) => toLeadResponse(lead as ILead));
    return buildPaginatedResult(data, total, page, limit);
  },

  /**
   * Find a single lead by its MongoDB ObjectId.
   * Throws NotFoundError if it doesn't exist.
   */
  async findById(id: string): Promise<ILeadResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid lead ID format');
    }

    const lead = await LeadModel.findById(id);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    return toLeadResponse(lead);
  },

  /**
   * Update a lead by its id.
   * Returns the updated document or throws NotFoundError.
   */
  async update(id: string, data: UpdateLeadInput): Promise<ILeadResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid lead ID format');
    }

    const lead = await LeadModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    );

    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    return toLeadResponse(lead);
  },

  /**
   * Hard-delete a lead by its id.
   * Throws NotFoundError if it doesn't exist.
   */
  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid lead ID format');
    }

    const lead = await LeadModel.findByIdAndDelete(id);
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }
  },

  /**
   * Export leads matching the filter query as CSV string.
   * Supports: status, source, search, sort
   */
  async exportToCsv(query: Omit<LeadQuery, 'page' | 'limit'>): Promise<string> {
    const filter: FilterQuery<ILead> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.source) {
      filter.source = query.source;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
      ];
    }

    let sortObj: Record<string, 1 | -1> = { createdAt: -1 }; // latest default
    if (query.sort === 'oldest') {
      sortObj = { createdAt: 1 };
    } else if (query.sort === 'latest') {
      sortObj = { createdAt: -1 };
    }

    const leads = await LeadModel.find(filter)
      .sort(sortObj)
      .lean<ILead[]>();

    // Map lead fields to friendly values for the CSV
    const csvData = leads.map((lead) => {
      let createdByStr = '';
      if (lead.createdBy) {
        if (typeof lead.createdBy === 'object' && 'name' in lead.createdBy) {
          const userObj = lead.createdBy as unknown as { name: string };
          createdByStr = userObj.name;
        } else {
          createdByStr = String(lead.createdBy);
        }
      }
      return {
        ID: String(lead._id),
        Name: lead.name,
        Email: lead.email,
        Status: lead.status,
        Source: lead.source,
        'Created By': createdByStr,
        'Created At': lead.createdAt ? lead.createdAt.toISOString() : '',
        'Updated At': lead.updatedAt ? lead.updatedAt.toISOString() : '',
      };
    });

    const fields = ['ID', 'Name', 'Email', 'Status', 'Source', 'Created By', 'Created At', 'Updated At'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    return csv;
  },
};
