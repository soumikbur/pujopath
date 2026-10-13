'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, Route } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';

export default function NotFound() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="space-y-4 max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f9e9e7] dark:bg-[#341b18] text-[#b42323] text-2xl font-black shadow-xs">
          ৪০৪
        </div>

        <h1 className="text-3xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
          {isBn ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Page Not Found'}
        </h1>

        <p className="text-sm text-[#776d65] dark:text-[#a89e95] leading-relaxed">
          {isBn
            ? 'আপনি যে পাতাটিতে পৌঁছানোর চেষ্টা করছেন তা পরিবর্তিত হয়েছে অথবা পথটি ভুল। নিচে দেওয়া লিঙ্কগুলির মাধ্যমে সহজেই সঠিক স্থানে ফিরে যান।'
            : 'The page or route you are looking for does not exist or has been moved. Use the quick links below to return to your Puja trail.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#b42323] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#971c1c] active:scale-95 shadow-sm"
          >
            <Home className="h-4 w-4" />
            <span>{isBn ? 'হোমপেজে ফিরে যান' : 'Back to Home'}</span>
          </Link>

          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] px-5 py-2.5 text-sm font-bold text-[#242424] dark:text-[#ede5dc] transition-all hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] active:scale-95 shadow-xs"
          >
            <Compass className="h-4 w-4 text-[#b42323]" />
            <span>{isBn ? 'প্যান্ডেল সন্ধান' : 'Explore Pandals'}</span>
          </Link>

          <Link
            href="/planner"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] px-5 py-2.5 text-sm font-bold text-[#242424] dark:text-[#ede5dc] transition-all hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] active:scale-95 shadow-xs"
          >
            <Route className="h-4 w-4 text-[#0d9488]" />
            <span>{isBn ? 'রুট প্ল্যানার' : 'Planner'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
