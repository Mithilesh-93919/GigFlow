import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi, UpdateLeadPayload } from '../api/leads';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Tag,
  Globe,
  Calendar,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700 border-blue-200',
  Contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Qualified: 'bg-green-100 text-green-700 border-green-200',
  Lost: 'bg-red-100 text-red-700 border-red-200',
};

const SOURCE_COLORS: Record<string, string> = {
  Website: 'bg-purple-100 text-purple-700',
  Instagram: 'bg-pink-100 text-pink-700',
  Referral: 'bg-orange-100 text-orange-700',
};

const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
const SOURCES = ['Website', 'Instagram', 'Referral'] as const;

const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<UpdateLeadPayload>({});

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getLead(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateLeadPayload) => leadsApi.updateLead(id!, payload),
    onSuccess: () => {
      toast.success('Lead updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update lead. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => leadsApi.deleteLead(id!),
    onSuccess: () => {
      toast.success('Lead deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      navigate('/leads');
    },
    onError: () => {
      toast.error('Failed to delete lead.');
    },
  });

  const handleEditStart = () => {
    if (lead) {
      setEditValues({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateMutation.mutate(editValues);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete "${lead?.name}"? This cannot be undone.`)) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-slate-500 text-sm font-medium">Loading lead details...</span>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-600 font-semibold text-lg">Lead not found</p>
          <p className="text-red-400 text-sm mt-1">This lead may have been deleted or does not exist.</p>
          <Link to="/leads" className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/leads"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Leads
      </Link>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Lead Record</p>
              {isEditing ? (
                <input
                  className="text-2xl font-bold bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  value={editValues.name ?? ''}
                  onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
                  placeholder="Lead name"
                />
              ) : (
                <h1 className="text-2xl font-bold">{lead.name}</h1>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditStart}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detail Fields */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                value={editValues.email ?? ''}
                onChange={(e) => setEditValues((v) => ({ ...v, email: e.target.value }))}
              />
            ) : (
              <p className="text-sm font-medium text-slate-800">{lead.email}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" /> Status
            </label>
            {isEditing ? (
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                value={editValues.status ?? ''}
                onChange={(e) => setEditValues((v) => ({ ...v, status: e.target.value }))}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[lead.status] ?? 'bg-slate-100 text-slate-600'}`}>
                {lead.status}
              </span>
            )}
          </div>

          {/* Source */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" /> Lead Source
            </label>
            {isEditing ? (
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                value={editValues.source ?? ''}
                onChange={(e) => setEditValues((v) => ({ ...v, source: e.target.value }))}
              >
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${SOURCE_COLORS[lead.source] ?? 'bg-slate-100 text-slate-600'}`}>
                {lead.source}
              </span>
            )}
          </div>

          {/* Created By */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <User className="w-3.5 h-3.5" /> Created By
            </label>
            <p className="text-sm font-medium text-slate-800">{lead.createdBy || 'Unknown'}</p>
          </div>

          {/* Created At */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" /> Created At
            </label>
            <p className="text-sm font-medium text-slate-800">
              {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Updated At */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" /> Last Updated
            </label>
            <p className="text-sm font-medium text-slate-800">
              {new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;