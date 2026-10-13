import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'gold' | 'outline' | 'success' | 'warning' | 'danger';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent',
    primary: 'bg-sindoor-50 dark:bg-sindoor-950/60 text-sindoor-700 dark:text-sindoor-300 border-sindoor-200 dark:border-sindoor-800',
    gold: 'bg-gold-50 dark:bg-gold-950/40 text-gold-800 dark:text-gold-300 border-gold-300 dark:border-gold-700',
    outline: 'bg-transparent text-slate-700 dark:text-slate-300 border-stone-300 dark:border-slate-700',
    success: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
