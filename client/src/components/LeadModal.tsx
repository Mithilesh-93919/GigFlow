import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { Lead } from '../types/lead';
import { Input } from './Input';
import { cn } from '../utils/cn';

// ─── VALIDATION SCHEMA ───
const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost'] as const),
  source: z.enum(['Website', 'Instagram', 'Referral'] as const, {
    required_error: 'Please select a source',
    invalid_type_error: 'Please select a source',
  }),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormValues) => Promise<void>;
  isLoading: boolean;
  lead?: Lead | null; // If provided, the form acts in "Edit" mode, else "Create" mode
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  lead,
}) => {
  const isEditMode = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
    },
  });

  // Hydrate form default values when lead changes or modal opens
  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    } else {
      reset({
        name: '',
        email: '',
        status: 'New',
        source: 'Website',
      });
    }
  }, [lead, reset, isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden relative z-10 transform transition-all duration-300 animate-fadeIn scale-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditMode ? 'Edit Lead Profile' : 'Create New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
          {/* Reusable Input for Name */}
          <Input
            {...register('name')}
            id="modal-name"
            label="Lead Name"
            placeholder="e.g. Rahul Sharma"
            error={errors.name}
            disabled={isLoading}
          />

          {/* Reusable Input for Email */}
          <Input
            {...register('email')}
            id="modal-email"
            type="email"
            label="Email Address"
            placeholder="e.g. rahul@company.com"
            error={errors.email}
            disabled={isLoading}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Status Selector */}
            <div className="space-y-1.5">
              <label htmlFor="modal-status" className="text-sm font-medium text-gray-700 block">
                Status
              </label>
              <select
                id="modal-status"
                {...register('status')}
                disabled={isLoading}
                className={cn(
                  "w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  errors.status && "border-red-500 focus:ring-red-500/20"
                )}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
              {errors.status && (
                <p className="text-xs font-medium text-red-500">{errors.status.message}</p>
              )}
            </div>

            {/* Source Selector */}
            <div className="space-y-1.5">
              <label htmlFor="modal-source" className="text-sm font-medium text-gray-700 block">
                Source
              </label>
              <select
                id="modal-source"
                {...register('source')}
                disabled={isLoading}
                className={cn(
                  "w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  errors.source && "border-red-500 focus:ring-red-500/20"
                )}
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
              {errors.source && (
                <p className="text-xs font-medium text-red-500">{errors.source.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm flex items-center justify-center transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
