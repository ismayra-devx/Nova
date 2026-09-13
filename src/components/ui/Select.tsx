'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#171923]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-3 py-2 text-sm bg-white border rounded-lg text-[#171923] transition-colors focus:outline-none cursor-pointer shadow-xs',
            error
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/15'
              : 'border-[#E6E8F0] hover:border-[#D0D4E4] focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-[#171923]">
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && <p className="text-xs text-[#60657A]">{hint}</p>}
        {error && <p className="text-xs text-[#DC2626] font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
