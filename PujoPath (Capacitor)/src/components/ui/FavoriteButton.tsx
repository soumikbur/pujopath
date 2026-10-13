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
            ? 'bg-[#b42323] text-white shadow-md'
            : 'bg-white/80 dark:bg-[#1a1613]/80 hover:bg-white dark:hover:bg-[#251e18] text-[#4a423d] dark:text-[#c4b9ae] border border-[#eee8e1] dark:border-[#2f2720]',
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
            ? 'bg-[#fdeeee] dark:bg-[#341b18] text-[#d52f2f] dark:text-[#e05656] border-[#f6ceca] dark:border-[#4a2420]'
            : 'bg-white dark:bg-[#1a1613] hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] text-[#4a423d] dark:text-[#c4b9ae] border-[#eee8e1] dark:border-[#2f2720]',
          className
        )}
      >
        <Bookmark className={cn(iconSizes[size], saved && 'fill-current text-[#d52f2f]')} />
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
          ? 'bg-[#b42323] text-white border-[#b42323] shadow-md'
          : 'bg-white/90 dark:bg-[#1a1613]/90 hover:bg-white dark:hover:bg-[#251e18] text-[#4a423d] dark:text-[#c4b9ae] border-[#eee8e1] dark:border-[#2f2720] shadow-sm',
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
