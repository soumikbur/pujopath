'use client';

import React, { useState, useEffect } from 'react';
import { Pandal } from '@/types';
import { PandalCard } from './PandalCard';
import { Sparkles, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { toBengaliDigits } from '@/lib/geo';

interface PandalGridProps {
  pandals: Pandal[];
  variant?: 'grid' | 'horizontal';
}

const PAGE_SIZE = 36;

export function PandalGrid({ pandals, variant = 'grid' }: PandalGridProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when the underlying filtered list changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [pandals]);

  if (pandals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#1a1613] rounded-3xl border border-[#eee8e1] dark:border-[#2f2720] shadow-card">
        <Sparkles className="w-8 h-8 text-[#b42323] mb-2" />
        <h3 className="font-bold text-base text-[#242424] dark:text-[#ede5dc]">
          {isBn ? 'কোনো মণ্ডপ পাওয়া যায়নি' : 'No Pandals Found'}
        </h3>
        <p className="text-xs text-[#776d65] dark:text-[#a89e95] mt-1 max-w-xs">
          {isBn
            ? 'অন্য এলাকা বা ভিন্ন অনুসন্ধানী শব্দ নির্বাচন করে আবার চেষ্টা করুন।'
            : 'Try clearing your filters or search query to explore more pandals.'}
        </p>
      </div>
    );
  }

  const displayedPandals = pandals.slice(0, visibleCount);
  const remainingCount = pandals.length - visibleCount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedPandals.map((pandal) => (
          <PandalCard key={pandal.id} pandal={pandal} variant={variant} />
        ))}
      </div>

      {remainingCount > 0 && (
        <div className="flex flex-col items-center justify-center gap-3 pt-4 pb-2">
          <p className="text-xs text-[#776d65] dark:text-[#a89e95] font-semibold">
            {isBn ? (
              <>
                মোট <strong className="text-[#242424] dark:text-[#ede5dc]">{toBengaliDigits(pandals.length)}</strong> টির মধ্যে{' '}
                <strong className="text-[#b42323]">{toBengaliDigits(displayedPandals.length)}</strong> টি মণ্ডপ প্রদর্শিত হচ্ছে
              </>
            ) : (
              <>
                Showing <strong className="text-[#b42323]">{displayedPandals.length}</strong> of{' '}
                <strong className="text-[#242424] dark:text-[#ede5dc]">{pandals.length}</strong> pandals
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="px-6 py-2.5 rounded-xl bg-[#b42323] hover:bg-[#971c1c] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
              <span>
                {isBn
                  ? `আরও মণ্ডপ দেখুন (+${toBengaliDigits(Math.min(PAGE_SIZE, remainingCount))})`
                  : `Load More Pandals (+${Math.min(PAGE_SIZE, remainingCount)})`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setVisibleCount(pandals.length)}
              className="px-4 py-2.5 rounded-xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] hover:border-[#b42323] text-[#4a423d] dark:text-[#c4b9ae] hover:text-[#b42323] font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>{isBn ? `সকল মণ্ডপ একবারে দেখুন (${toBengaliDigits(pandals.length)})` : `Show All (${pandals.length})`}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
