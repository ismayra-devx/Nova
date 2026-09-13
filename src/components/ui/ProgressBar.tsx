import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  progress: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({ progress, showLabel = false, size = 'md', className }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const getColor = (pct: number) => {
    if (pct === 100) return 'bg-[#16A34A]';
    return 'bg-[#5B5CE2]';
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="font-medium text-[#60657A]">Progress</span>
          <span className="font-semibold text-[#171923]">{clampedProgress}%</span>
        </div>
      )}
      <div className={cn('w-full bg-[#EAECEF] rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            getColor(clampedProgress)
          )}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
