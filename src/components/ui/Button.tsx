'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

    const variants = {
      primary:
        'bg-[#5B5CE2] hover:bg-[#4E4FD1] text-white shadow-sm focus:ring-[#5B5CE2]/30 active:scale-[0.99]',
      secondary:
        'bg-white hover:bg-[#F8F9FC] text-[#171923] border border-[#E6E8F0] shadow-xs focus:ring-[#5B5CE2]/20',
      outline:
        'bg-transparent hover:bg-[#F1F3F9] text-[#60657A] hover:text-[#171923] border border-[#E6E8F0] focus:ring-[#5B5CE2]/20',
      danger:
        'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs focus:ring-[#DC2626]/20',
      ghost:
        'bg-transparent hover:bg-[#F1F3F9] text-[#60657A] hover:text-[#171923] focus:ring-[#5B5CE2]/20',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
