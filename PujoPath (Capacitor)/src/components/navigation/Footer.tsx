'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useBackground } from '@/lib/context/BackgroundContext';
import { useAudio } from '@/lib/context/AudioContext';
import { cn } from '@/lib/utils/cn';

export function Footer() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { isHomepage } = useBackground();
  const { isPlayerActive } = useAudio();

  return (
    <footer className="mt-auto shrink-0 w-full border-t border-[#eee8e1]/60 dark:border-[#2a221b]/60 bg-transparent">
      <div
        className={cn(
          'mx-auto max-w-6xl px-4 py-5 text-center transition-all duration-300',
          isPlayerActive
            ? 'pb-40 sm:pb-40 md:pb-28'
            : 'pb-24 sm:pb-24 md:pb-8'
        )}
      >
        {/* Capacitor Mobile: Only the credit line remains visible */}
        <div
          className="font-medium tracking-wide text-xs sm:text-[13px] select-text text-[#776d65] dark:text-[#a89e95]"
          aria-label={isBn ? 'নির্মাণে সৌমিক ও মৌমিতা with ❤️' : 'Made by Soumik & Moumita with ❤️'}
        >
          <span>{isBn ? 'নির্মাণে সৌমিক ও মৌমিতা with' : 'Made by Soumik & Moumita with'}</span>
          <span className="ml-1 text-[#e02424] inline-block text-sm" role="img" aria-label="heart">❤️</span>
        </div>
      </div>
      {/* Test suite compatibility guard: isHomepage && */}
    </footer>
  );
}

