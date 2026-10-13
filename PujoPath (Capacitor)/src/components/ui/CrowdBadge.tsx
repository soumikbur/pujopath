'use client';

import React from 'react';
import { CrowdLevel } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils/cn';

interface CrowdBadgeProps {
  level: CrowdLevel;
  className?: string;
  showDot?: boolean;
}

export function CrowdBadge({ level, className, showDot = true }: CrowdBadgeProps) {
  const { t } = useI18n();

  const config = {
    Low: {
      label: t('crowdLow'),
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500',
      pulse: 'bg-emerald-400',
    },
    Moderate: {
      label: t('crowdModerate'),
      bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500',
      pulse: 'bg-amber-400',
    },
    High: {
      label: t('crowdHigh'),
      bg: 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      dot: 'bg-orange-500',
      pulse: 'bg-orange-400',
    },
    Extreme: {
      label: t('crowdExtreme'),
      bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      dot: 'bg-rose-500',
      pulse: 'bg-rose-400',
    },
  };

  const item = config[level] || config.Moderate;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm transition-colors',
        item.bg,
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              item.pulse
            )}
          />
          <span className={cn('relative inline-flex rounded-full h-2 w-2', item.dot)} />
        </span>
      )}
      <span>{item.label}</span>
    </span>
  );
}
