import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, Download, Plus } from 'lucide-react';
import { leadsApi } from '../api/leads';
import toast from 'react-hot-toast';

interface LeadsFiltersProps {
  onAddLeadClick: () => void;
}

export const LeadsFilters: React.FC<LeadsFiltersProps> = ({
  onAddLeadClick,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Local search input state for instant typing responsive feedback
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [isExporting, setIsExporting] = useState(false);

  // Sync local search when URL changes externally (like resets)
  useEffect(() => {
    setLocalSearch(searchParams.get('search') || '');
  }, [searchParams]);

  // Debounced search sync to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (localSearch.trim()) {
          next.set('search', localSearch.trim());
        } else {
          next.delete('search');
        }
        next.set('page', '1'); // Reset to page 1 on new search query
        return next;
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchParams]);

  const updateParam = useCallback((key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.set('page', '1'); // Reset to page 1 on filter alteration
      return next;
    });
  }, [setSearchParams]);

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
    setLocalSearch('');
    toast.success('Filters cleared');
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const activeParams = {
        status: searchParams.get('status') || undefined,
        source: searchParams.get('source') || undefined,
        search: searchParams.get('search') || undefined,
        sort: searchParams.get('sort') || undefined,
      };

      const csvContent = await leadsApi.exportLeads(activeParams);

      // Trigger file download in browser
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Leads exported successfully!');
    } catch (err) {
      toast.error('Failed to export leads. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const currentStatus = searchParams.get('status') || '';
  const currentSource = searchParams.get('source') || '';
  const currentSort = searchParams.get('sort') || 'latest';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 space-y-4">
      {/* ─── SEARCH & BUTTONS HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search leads by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 sm:self-end md:self-auto">
          {/* CSV Export */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>

          {/* Add New Lead */}
          {onAddLeadClick && (
            <button
              onClick={onAddLeadClick}
              className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Lead
            </button>
          )}
        </div>
      </div>

      {/* ─── DROPDOWNS & FILTERS FOOTER ─── */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
        {/* Status Filter */}
        <div className="w-full sm:w-auto min-w-[130px]">
          <select
            value={currentStatus}
            onChange={(e) => updateParam('status', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Source Filter */}
        <div className="w-full sm:w-auto min-w-[130px]">
          <select
            value={currentSource}
            onChange={(e) => updateParam('source', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="w-full sm:w-auto min-w-[130px]">
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          >
            <option value="latest">Latest Created</option>
            <option value="oldest">Oldest Created</option>
          </select>
        </div>

        {/* Reset Button */}
        {(currentStatus || currentSource || currentSort !== 'latest' || localSearch) && (
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 ml-auto sm:ml-0"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
