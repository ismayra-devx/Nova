import React from 'react';
import { cn } from '@/lib/utils/cn';

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, avatarUrl, size = 'md', className }: AvatarProps) {
  const getInitials = (str: string) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-9 h-9 text-xs',
  };

  // Harmonious, restrained color tones for avatars
  const bgColors = [
    'bg-[#5B5CE2]',
    'bg-[#4F46E5]',
    'bg-[#0284C7]',
    'bg-[#0D9488]',
    'bg-[#D97706]',
    'bg-[#7C3AED]',
  ];
  const charCodeSum = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgColor = bgColors[charCodeSum % bgColors.length];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn('rounded-full object-cover border border-[#E6E8F0]', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white select-none shrink-0 shadow-xs',
        bgColor,
        sizes[size],
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
