'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#171923]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2 text-sm bg-white border rounded-lg text-[#171923] placeholder-[#A0AEC0] transition-colors focus:outline-none shadow-xs',
            error
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/15'
              : 'border-[#E6E8F0] hover:border-[#D0D4E4] focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[#60657A]">{hint}</p>}
        {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
