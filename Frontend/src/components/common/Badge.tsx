import React from 'react';
import type { TaskPriority, TaskStatus } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'status' | 'priority' | 'role' | 'neutral';
  value?: TaskStatus | TaskPriority | string;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  value,
  className = '',
  dot = true,
}) => {
  let dotColor = 'bg-zinc-400';
  let badgeStyle = 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60';
  let displayText = children;

  if (variant === 'status') {
    switch (value) {
      case 'todo':
        dotColor = 'bg-amber-400';
        badgeStyle = 'bg-amber-950/30 text-amber-300 border-amber-800/40';
        displayText = displayText || 'To Do';
        break;
      case 'in-progress':
        dotColor = 'bg-blue-400';
        badgeStyle = 'bg-blue-950/30 text-blue-300 border-blue-800/40';
        displayText = displayText || 'In Progress';
        break;
      case 'completed':
        dotColor = 'bg-emerald-400';
        badgeStyle = 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40';
        displayText = displayText || 'Done';
        break;
    }
  } else if (variant === 'priority') {
    switch (value) {
      case 'low':
        dotColor = 'bg-zinc-400';
        badgeStyle = 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50';
        displayText = displayText || 'Low';
        break;
      case 'medium':
        dotColor = 'bg-orange-400';
        badgeStyle = 'bg-orange-950/30 text-orange-300 border-orange-800/40';
        displayText = displayText || 'Medium';
        break;
      case 'high':
        dotColor = 'bg-rose-400';
        badgeStyle = 'bg-rose-950/30 text-rose-300 border-rose-800/40';
        displayText = displayText || 'High';
        break;
    }
  } else if (variant === 'role') {
    switch (value) {
      case 'owner':
        dotColor = 'bg-indigo-400';
        badgeStyle = 'bg-indigo-950/30 text-indigo-300 border-indigo-800/40';
        displayText = displayText || 'Owner';
        break;
      case 'admin':
        dotColor = 'bg-sky-400';
        badgeStyle = 'bg-sky-950/30 text-sky-300 border-sky-800/40';
        displayText = displayText || 'Admin';
        break;
      default:
        dotColor = 'bg-zinc-400';
        badgeStyle = 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60';
        displayText = displayText || 'Member';
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${badgeStyle} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />}
      <span>{displayText}</span>
    </span>
  );
};
