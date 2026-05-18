import React from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { ShowForRole } from './ShowForRole';
import { Edit2, Trash2, AlertTriangle, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  totalLeads: number;
  limit: number;
  onPageChange: (page: number) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onRetry?: () => void;
}

const statusStyles: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  New: {
    bg: 'bg-indigo-50 border-indigo-100',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
  },
  Contacted: {
    bg: 'bg-amber-50 border-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  Qualified: {
    bg: 'bg-emerald-50 border-emerald-100',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  Lost: {
    bg: 'bg-rose-50 border-rose-100',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
  },
};

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  isLoading,
  error,
  page,
  totalPages,
  totalLeads,
  limit,
  onPageChange,
  onEdit,
  onDelete,
  onRetry,
}) => {

  // ─── ERROR STATE ───
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-red-100 rounded-2xl shadow-sm text-center">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Failed to load leads</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          {error.message || 'An error occurred while fetching the lead directory.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // ─── LOADING STATE SKELETON ───
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-pulse">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16" /></th>
                <th className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32" /></th>
                <th className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20" /></th>
                <th className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20" /></th>
                <th className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-28" /></th>
                <th className="px-6 py-4 text-right"><div className="h-4 bg-slate-200 rounded w-12 ml-auto" /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(limit)].map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-40" /></td>
                  <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-20" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                  <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-16 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── EMPTY STATE ───
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
        <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No leads found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Try adjusting your filter settings or create a new lead to populate this list.
        </p>
      </div>
    );
  }

  // Calculate pagination window
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalLeads);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* ─── SCROLLABLE RESPONSIVE TABLE ─── */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => {
              const statusStyle = statusStyles[lead.status] || statusStyles.New;
              return (
                <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                  {/* Name */}
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap">
                    <Link
                      to={`/leads/${lead._id}`}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {lead.name}
                    </Link>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {lead.email}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 text-xs font-semibold border rounded-full capitalize",
                      statusStyle.bg,
                      statusStyle.text
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", statusStyle.dot)} />
                      {lead.status}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {lead.source}
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        title="Edit Lead"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <ShowForRole roles="admin">
                        <button
                          onClick={() => onDelete(lead)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </ShowForRole>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── PAGINATION PANEL ─── */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
        <div className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-800">{startIndex}</span> to{' '}
          <span className="font-semibold text-slate-800">{endIndex}</span> of{' '}
          <span className="font-semibold text-slate-800">{totalLeads}</span> leads
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-medium text-slate-700">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
