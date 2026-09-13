import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'todo' | 'in_progress' | 'done' | 'low' | 'medium' | 'high' | 'owner' | 'member' | 'default';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', className, size = 'sm' }: BadgeProps) {
  const variants = {
    default: 'bg-[#F8F9FC] text-[#60657A] border-[#E6E8F0]',
    todo: 'bg-[#F1F3F9] text-[#475569] border-[#E2E8F0]',
    in_progress: 'bg-[#EEF0FD] text-[#5B5CE2] border-[#D9DCF9]',
    done: 'bg-[#EDFDF5] text-[#16A34A] border-[#BBF7D0]',
    low: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
    medium: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
    high: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    owner: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
    member: 'bg-[#F8F9FC] text-[#60657A] border-[#E6E8F0]',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium tracking-wide uppercase',
    md: 'text-xs px-2.5 py-1 rounded-md font-medium tracking-wide uppercase',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border select-none transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {variant === 'in_progress' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#5B5CE2]" />
      )}
      {variant === 'done' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
      )}
      {children}
    </span>
  );
}
