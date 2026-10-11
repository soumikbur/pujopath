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
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 border bg-white dark:bg-[#1a1613] hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] text-[#4a423d] dark:text-[#c4b9ae] border-[#eee8e1] dark:border-[#2f2720]',
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
        'p-2.5 rounded-xl backdrop-blur-md transition-all duration-200 active:scale-90 border bg-white/90 dark:bg-[#1a1613]/90 hover:bg-white dark:hover:bg-[#251e18] text-[#4a423d] dark:text-[#c4b9ae] border-[#eee8e1] dark:border-[#2f2720] shadow-sm',
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
