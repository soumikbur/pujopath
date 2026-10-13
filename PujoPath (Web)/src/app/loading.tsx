'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/I18nContext';

export default function Loading() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-3 border-[#b42323]/20 border-t-[#b42323] animate-spin" />
        <div className="absolute h-6 w-6 rounded-full bg-[#f9e9e7] dark:bg-[#341b18] flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-[#b42323] animate-ping" />
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
        {isBn ? 'লোড হচ্ছে...' : 'Loading...'}
      </p>
    </div>
  );
}
