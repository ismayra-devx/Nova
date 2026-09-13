import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-[#E6E8F0] rounded-xl p-5 shadow-[0_1px_3px_0_rgba(16,24,40,0.04)] text-[#171923]',
        hover &&
          'hover:border-[#D0D4E4] hover:shadow-[0_4px_6px_-2px_rgba(16,24,40,0.05)] transition-all duration-150',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
