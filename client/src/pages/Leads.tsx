import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LeadsFilters } from '../components/LeadsFilters';
import { LeadsTable } from '../components/LeadsTable';
import { LeadModal, LeadFormValues } from '../components/LeadModal';
import { useLeads, useLeadMutations } from '../hooks/useLeads';
import { Lead } from '../types/lead';

const Leads: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { createLead, updateLead, deleteLead } = useLeadMutations();
  const [searchInput, setSearchInput] = useState(
  searchParams.get('search') || ''
);

  // Extract filters from URL
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = 10;
  const status = searchParams.get('status') || undefined;
  const source = searchParams.get('source') || undefined;
  const search = searchParams.get('search') || undefined;
  const sort = searchParams.get('sort') || undefined;
  useEffect(() => {
  const timer = setTimeout(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (searchInput.trim()) {
        params.set('search', searchInput);
      } else {
        params.delete('search');
      }

      params.set('page', '1');

      return params;
    });
  }, 500);

  return () => clearTimeout(timer);
}, [searchInput, setSearchParams]);

  // TanStack Query lead query hook
  const { data, isLoading, error, refetch } = useLeads({
    page,
    limit,
    status,
    source,
    search,
    sort,
  });

  // Modal Open/Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
  };

  const handleAddClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (lead: Lead) => {
    if (window.confirm(`Are you sure you want to permanently delete lead "${lead.name}"?`)) {
      try {
        await deleteLead(lead._id);
      } catch (err) {
        // Error already handled by useMutation onError hook
      }
    }
  };

  const handleFormSubmit = async (values: LeadFormValues) => {
    try {
      setIsMutating(true);
      if (selectedLead) {
        // Update Action
        await updateLead({
          id: selectedLead._id,
          payload: values,
        });
      } else {
        // Create Action
        await createLead(values);
      }
      setIsModalOpen(false);
      setSelectedLead(null);
    } catch (err) {
      // Errors are handled inside hook mutations using toasts
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight sm:text-3xl">
            Lead Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track, query, and coordinate leads across channels.
          </p>
        </div>
      </div>

      {/* Advanced Filtering & Actions */}
      <LeadsFilters
        onAddLeadClick={handleAddClick}
        search={searchInput}
        onSearchChange={setSearchInput} />
      
        

      {/* Leads Responsive Directory */}
      <div className="flex-1 min-h-[400px]">
        <LeadsTable
          leads={data?.data || []}
          isLoading={isLoading}
          error={error}
          page={page}
          totalPages={data?.totalPages || 1}
          totalLeads={data?.total || 0}
          limit={limit}
          onPageChange={handlePageChange}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRetry={refetch}
        />
      </div>

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
        onSubmit={handleFormSubmit}
        isLoading={isMutating}
        lead={selectedLead}
      />
    </div>
  );
};

export default Leads;
