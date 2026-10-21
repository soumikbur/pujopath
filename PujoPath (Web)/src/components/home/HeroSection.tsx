'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Navigation, Search, Flame, Sparkles } from 'lucide-react';
import { CalendarService } from '@/lib/services/CalendarService';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFestival } from '@/lib/context/FestivalContext';
import { toBengaliDigits } from '@/lib/geo';
import { cn } from '@/lib/utils/cn';

export function HeroSection() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { activeFestival, isKali } = useFestival();
  const [countdown, setCountdown] = useState(CalendarService.getCountdown());

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(CalendarService.getCountdown()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const days = isBn ? toBengaliDigits(countdown.days) : countdown.days;

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-3xl border backdrop-blur-md p-6 sm:p-10 shadow-sm transition-all duration-300',
        isKali
          ? 'border-purple-200/80 dark:border-purple-900/60 bg-gradient-to-br from-[#faf5ff]/95 via-white/90 to-[#f3e8ff]/70 dark:from-[#1b0d2a]/95 dark:via-[#140c24]/90 dark:to-[#221035]/80'
          : 'border-[#eee8e1]/95 dark:border-[#2f2720]/95 bg-white/90 dark:bg-[#1a1613]/90'
      )}
    >
      <div className="max-w-2xl relative z-10">
        {/* Festive Badge */}
        {isKali ? (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-300/60 dark:border-purple-700/60 bg-purple-100/80 dark:bg-purple-950/80 px-3.5 py-1.5 text-xs font-bold text-purple-900 dark:text-purple-300 shadow-xs">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>{isBn ? '🪔 দীপান্বিতা অমাবস্যা ও শ্যামাপূজা ২০২৬' : '🪔 DIPANWITA AMAVASYA & KALI PUJA 2026'}</span>
          </div>
        ) : (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f5c6c2]/60 dark:border-[#4d221e]/60 bg-[#fbe8e6] dark:bg-[#341b18] px-3.5 py-1.5 text-xs font-bold text-[#a61c1c] dark:text-[#ff8787] shadow-xs">
            <CalendarDays className="h-4 w-4" />
            <span>{countdown.isLive ? (isBn ? 'পুজো চলছে' : 'Puja is live') : (isBn ? `${days} দিন বাকি` : `${days} days to Puja`)}</span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-black tracking-tight text-[#1a1715] dark:text-[#faf6f0] sm:text-5xl leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {isKali
            ? isBn
              ? 'মা শ্যামা পূজা ও বারাসাত পরিক্রমা'
              : 'Kali Puja & Barasat Illumination'
            : isBn
            ? 'আপনার পুজো, সহজভাবে।'
            : 'Your Puja, made simple.'}
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 max-w-xl text-sm leading-6 sm:leading-7 text-[#4a4039] dark:text-[#cdc1b5] font-medium sm:text-lg">
          {isKali
            ? isBn
              ? 'বারাসাতের ঐতিহ্যবাহী আলোকসজ্জা, নিশীথ অমাবস্যার নির্ঘণ্ট ও ঐতিহাসিক কালীক্ষেত্র দর্শন।'
              : "Discover Barasat's celebrated lighting spectacles, midnight Amavasya muhurat & sacred Shaktipeeths."
            : isBn
            ? 'পছন্দের প্যান্ডেল খুঁজুন, রুট বানান, আর নিশ্চিন্তে বেরিয়ে পড়ুন।'
            : 'Find the pandals you love, build a route, and head out with confidence.'}
        </p>

        {/* CTA Buttons */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={isKali ? '/kali-puja' : '/explore'}
            className={cn(
              'inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md',
              isKali ? 'bg-purple-700 hover:bg-purple-800' : 'bg-[#b42323] hover:bg-[#971c1c]'
            )}
          >
            {isKali ? <Flame className="h-4 w-4 text-amber-400" /> : <Search className="h-4 w-4" />}
            <span>{isKali ? (isBn ? 'বারাসাত ও শ্যামাপূজা গাইড' : 'Barasat & Kali Puja Guide') : (isBn ? 'প্যান্ডেল খুঁজুন' : 'Find pandals')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={isKali ? '/map?festival=kali' : '/planner'}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#d2c7bc] dark:border-[#3c342c] bg-white/95 dark:bg-[#201b17]/95 px-5 py-3 text-sm font-bold text-[#1c1917] dark:text-[#faf6f0] transition-all duration-150 hover:bg-[#f7f2ec] dark:hover:bg-[#28221c] active:scale-95 shadow-xs"
          >
            <Navigation className={cn('h-4 w-4', isKali ? 'text-purple-600' : 'text-[#b42323]')} />
            <span>{isKali ? (isBn ? 'বারাসাত মানচিত্র' : 'View Barasat Map') : (isBn ? 'রুট তৈরি করুন' : 'Build a route')}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
