import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi, GetLeadsParams, CreateLeadPayload, UpdateLeadPayload } from '../api/leads';
import toast from 'react-hot-toast';
import axios from 'axios';

export const useLeads = (params: GetLeadsParams) => {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadsApi.getLeads(params),
    placeholderData: (previousData) => previousData, // keep previous data while fetching new pages
  });
};

export const useLeadMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadsApi.createLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully!');
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const message = (error.response.data as { message?: string }).message || 'Failed to create lead';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) => 
      leadsApi.updateLead(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated successfully!');
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const message = (error.response.data as { message?: string }).message || 'Failed to update lead';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully!');
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const message = (error.response.data as { message?: string }).message || 'Failed to delete lead';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred');
      }
    },
  });

  return {
    createLead: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    
    updateLead: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    
    deleteLead: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
