import apiClient from './client';
import { PaginatedLeads, Lead } from '../types/lead';

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  source: string;
  status?: string;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  source?: string;
  status?: string;
}

export const leadsApi = {
  getLeads: async (params: GetLeadsParams): Promise<PaginatedLeads> => {
    const response = await apiClient.get<{ data: PaginatedLeads }>('/leads', { params });
    return response.data.data;
  },

  createLead: async (payload: CreateLeadPayload): Promise<Lead> => {
    const response = await apiClient.post<{ data: Lead }>('/leads', payload);
    return response.data.data;
  },

  updateLead: async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
    const response = await apiClient.put<{ data: Lead }>(`/leads/${id}`, payload);
    return response.data.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  exportLeads: async (params: Omit<GetLeadsParams, 'page' | 'limit'>): Promise<string> => {
    const response = await apiClient.get<string>('/leads/export', {
      params,
      responseType: 'text',
    });
    return response.data;
  },
};
