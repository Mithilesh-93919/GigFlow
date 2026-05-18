import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 block">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-400",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500 hover:border-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-red-500 animate-fadeIn" role="alert">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
