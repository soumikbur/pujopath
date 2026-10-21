'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Check, ArrowRight, Compass } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFestival } from '@/lib/context/FestivalContext';
import { cn } from '@/lib/utils/cn';

export function PujaSelectionSection() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { activeFestival, selectFestival } = useFestival();

  return (
    <section
      aria-label="Puja Selection"
      className="w-full rounded-3xl p-4 sm:p-5 border border-[#eee8e1] dark:border-[#2a241f] bg-white/70 dark:bg-[#181411]/70 backdrop-blur-md shadow-sm transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eee8e1] dark:border-[#2a241f]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider uppercase text-pujo-red dark:text-[#f87171]">
              {isBn ? 'উৎসব নির্বাচন ও পরিবর্তন' : 'PUJA SELECTION & EXPERIENCE'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fdeeee] dark:bg-[#341b18] text-pujo-red dark:text-[#f87171]">
              {isBn ? 'বাছাইকৃত' : 'Active Choice'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#242424] dark:text-[#ede5dc] tracking-tight mt-0.5">
            {isBn ? 'আপনি কোন পূজা পরিক্রমা করতে চান?' : 'Which Puja would you like to explore?'}
          </h2>
        </div>

        <Link
          href="/select-puja"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-pujo-red dark:text-[#f87171] hover:underline shrink-0"
        >
          <span>{isBn ? 'পূর্ণ বিবরণী দেখুন' : 'Explore All Details'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Interactive Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
        {/* 1. Durga Puja Option */}
        <button
          type="button"
          onClick={() => selectFestival('durga')}
          className={cn(
            'flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.98]',
            activeFestival === 'durga'
              ? 'bg-[#fdeeee] dark:bg-[#2d1512] border-pujo-red/60 dark:border-[#e05656]/60 shadow-sm ring-1 ring-pujo-red/40'
              : 'bg-[#fcfaf7] dark:bg-[#1f1a16] border-[#eee8e1] dark:border-[#2a241f] hover:border-pujo-red/30'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                activeFestival === 'durga'
                  ? 'bg-pujo-red text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              )}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base text-[#242424] dark:text-[#ede5dc]">
                  {isBn ? 'শ্রী শ্রী দুর্গাপূজা' : 'Durga Puja'}
                </span>
                {activeFestival === 'durga' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pujo-red text-white">
                    {isBn ? 'সক্রিয়' : 'Selected'}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-[#665a54] dark:text-[#a89e95] line-clamp-1 mt-0.5">
                {isBn
                  ? 'কলকাতার শ্রেষ্ঠ ৪৫০+ মণ্ডপ, বনেদি বাড়ি ও রুট প্ল্যানার'
                  : '450+ Kolkata heritage pandals, Bonedi Bari & hopping trails'}
              </p>
            </div>
          </div>

          <div
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-2 border transition-all',
              activeFestival === 'durga'
                ? 'bg-pujo-red border-pujo-red text-white'
                : 'border-stone-300 dark:border-stone-700 bg-transparent text-transparent'
            )}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </button>

        {/* 2. Kali Puja Option */}
        <button
          type="button"
          onClick={() => selectFestival('kali')}
          className={cn(
            'flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.98]',
            activeFestival === 'kali'
              ? 'bg-[#f5e8ff] dark:bg-[#25103a] border-purple-500/60 dark:border-purple-400/60 shadow-sm ring-1 ring-purple-500/40'
              : 'bg-[#fcfaf7] dark:bg-[#1f1a16] border-[#eee8e1] dark:border-[#2a241f] hover:border-purple-400/30'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                activeFestival === 'kali'
                  ? 'bg-purple-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              )}
            >
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base text-[#242424] dark:text-[#ede5dc]">
                  {isBn ? 'মা শ্যামা পূজা ও বারাসাত' : 'Kali Puja & Barasat'}
                </span>
                {activeFestival === 'kali' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-700 text-white">
                    {isBn ? 'সক্রিয়' : 'Selected'}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-[#665a54] dark:text-[#a89e95] line-clamp-1 mt-0.5">
                {isBn
                  ? 'বারাসাতের বিখ্যাত আলোকসজ্জা, নিশীথ নির্ঘণ্ট ও কালীক্ষেত্র'
                  : 'Barasat illumination, midnight muhurat & sacred Shaktipeeths'}
              </p>
            </div>
          </div>

          <div
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-2 border transition-all',
              activeFestival === 'kali'
                ? 'bg-purple-700 border-purple-700 text-white'
                : 'border-stone-300 dark:border-stone-700 bg-transparent text-transparent'
            )}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </button>
      </div>
    </section>
  );
}
