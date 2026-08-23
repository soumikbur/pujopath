'use client';

import React from 'react';
import { Bookmark, Heart } from 'lucide-react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils/cn';

interface FavoriteButtonProps {
  pandalId: string;
  variant?: 'icon' | 'labeled' | 'heart';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({
  pandalId,
  variant = 'icon',
  className,
  size = 'md',
}: FavoriteButtonProps) {
  const { isPandalSaved, toggleSavePandal } = useFavorites();
  const { t } = useI18n();
  const saved = isPandalSaved(pandalId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavePandal(pandalId);
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'heart') {
    return (
      <button
        onClick={handleClick}
        title={saved ? t('savedPandal') : t('savePandal')}
        aria-label={saved ? t('savedPandal') : t('savePandal')}
        className={cn(
          'p-2 rounded-full backdrop-blur-md transition-all duration-200 active:scale-90',
          saved
            ? 'bg-sindoor-600 text-white shadow-md shadow-sindoor-600/30'
            : 'bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700',
          className
        )}
      >
        <Heart
          className={cn(
            iconSizes[size],
            'transition-transform duration-200',
            saved && 'fill-current scale-110'
          )}
        />
      </button>
    );
  }

  if (variant === 'labeled') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 border',
          saved
            ? 'bg-sindoor-50 dark:bg-sindoor-950/60 text-sindoor-600 dark:text-sindoor-300 border-sindoor-300 dark:border-sindoor-800'
            : 'bg-white dark:bg-slate-800 hover:bg-stone-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-stone-200 dark:border-slate-700',
          className
        )}
      >
        <Bookmark className={cn(iconSizes[size], saved && 'fill-current text-sindoor-600')} />
        <span>{saved ? t('savedPandal') : t('savePandal')}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      title={saved ? t('savedPandal') : t('savePandal')}
      aria-label={saved ? t('savedPandal') : t('savePandal')}
      className={cn(
        'p-2.5 rounded-xl backdrop-blur-md transition-all duration-200 active:scale-90 border',
        saved
          ? 'bg-sindoor-600 text-white border-sindoor-600 shadow-md shadow-sindoor-600/30'
          : 'bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-stone-200/80 dark:border-slate-700/80 shadow-sm',
        className
      )}
    >
      <Bookmark
        className={cn(
          iconSizes[size],
          'transition-transform duration-200',
          saved && 'fill-current scale-105'
        )}
      />
    </button>
  );
}
