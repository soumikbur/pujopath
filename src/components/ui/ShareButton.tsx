'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils/cn';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  variant?: 'icon' | 'labeled';
  className?: string;
}

export function ShareButton({
  title,
  text,
  url,
  variant = 'icon',
  className,
}: ShareButtonProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // ignore
      }
    }
  };

  if (variant === 'labeled') {
    return (
      <button
        onClick={handleShare}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 border bg-white dark:bg-slate-800 hover:bg-stone-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-stone-200 dark:border-slate-700',
          className
        )}
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
        <span>{copied ? t('copiedToClipboard') : t('sharePandal')}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      title={copied ? t('copiedToClipboard') : t('sharePandal')}
      aria-label={copied ? t('copiedToClipboard') : t('sharePandal')}
      className={cn(
        'p-2.5 rounded-xl backdrop-blur-md transition-all duration-200 active:scale-90 border bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-stone-200/80 dark:border-slate-700/80 shadow-sm',
        className
      )}
    >
      {copied ? (
        <Check className="w-5 h-5 text-emerald-600 animate-pulse" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}
    </button>
  );
}
