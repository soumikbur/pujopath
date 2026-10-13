'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, Compass } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  useEffect(() => {
    console.error('PujoPath runtime boundary captured error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="space-y-4 max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fee2e2] dark:bg-[#341b18] text-[#b42323] shadow-xs">
          <AlertTriangle className="h-8 w-8 text-[#b42323]" />
        </div>

        <h1 className="text-3xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
          {isBn ? 'একটি সমস্যা দেখা দিয়েছে' : 'Something went wrong'}
        </h1>

        <p className="text-sm text-[#776d65] dark:text-[#a89e95] leading-relaxed">
          {isBn
            ? 'পৃষ্ঠাটি লোড করার সময় একটি অপ্রত্যাশিত সমস্যা হয়েছে। আপনি পুনরায় চেষ্টা করতে পারেন অথবা অন্য পাতায় যেতে পারেন।'
            : 'An unexpected issue occurred while rendering this view. You can retry loading or return to a safe screen.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#b42323] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#971c1c] active:scale-95 shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{isBn ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] px-5 py-2.5 text-sm font-bold text-[#242424] dark:text-[#ede5dc] transition-all hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] active:scale-95 shadow-xs"
          >
            <Home className="h-4 w-4" />
            <span>{isBn ? 'হোমপেজে ফিরে যান' : 'Back to Home'}</span>
          </Link>

          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] px-5 py-2.5 text-sm font-bold text-[#242424] dark:text-[#ede5dc] transition-all hover:bg-[#f7f3ee] dark:hover:bg-[#251e18] active:scale-95 shadow-xs"
          >
            <Compass className="h-4 w-4 text-[#b42323]" />
            <span>{isBn ? 'প্যান্ডেল সন্ধান' : 'Explore'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
