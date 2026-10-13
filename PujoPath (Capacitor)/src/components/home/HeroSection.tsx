'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Navigation, Search } from 'lucide-react';
import { CalendarService } from '@/lib/services/CalendarService';
import { useI18n } from '@/lib/i18n/I18nContext';
import { toBengaliDigits } from '@/lib/geo';

export function HeroSection() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const [countdown, setCountdown] = useState(CalendarService.getCountdown());

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(CalendarService.getCountdown()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const days = isBn ? toBengaliDigits(countdown.days) : countdown.days;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#eee8e1]/95 dark:border-[#2f2720]/95 bg-white/90 dark:bg-[#1a1613]/90 backdrop-blur-md p-6 sm:p-10 shadow-sm transition-colors duration-200">
      <div className="max-w-2xl relative z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f5c6c2]/60 dark:border-[#4d221e]/60 bg-[#fbe8e6] dark:bg-[#341b18] px-3.5 py-1.5 text-xs font-bold text-[#a61c1c] dark:text-[#ff8787] shadow-xs">
          <CalendarDays className="h-4 w-4" />
          {countdown.isLive ? (isBn ? 'পুজো চলছে' : 'Puja is live') : (isBn ? `${days} দিন বাকি` : `${days} days to Puja`)}
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#1a1715] dark:text-[#faf6f0] sm:text-5xl leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {isBn ? 'আপনার পুজো, সহজভাবে।' : 'Your Puja, made simple.'}
        </h1>
        <p className="mt-3.5 max-w-xl text-sm leading-6 sm:leading-7 text-[#4a4039] dark:text-[#cdc1b5] font-medium sm:text-lg">
          {isBn ? 'পছন্দের প্যান্ডেল খুঁজুন, রুট বানান, আর নিশ্চিন্তে বেরিয়ে পড়ুন।' : 'Find the pandals you love, build a route, and head out with confidence.'}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/explore"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#b42323] px-5 py-3 text-sm font-bold text-white transition-all duration-150 hover:bg-[#971c1c] active:scale-95 shadow-sm hover:shadow-md"
          >
            <Search className="h-4 w-4" />
            <span>{isBn ? 'প্যান্ডেল খুঁজুন' : 'Find pandals'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/planner"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#d2c7bc] dark:border-[#3c342c] bg-white/95 dark:bg-[#201b17]/95 px-5 py-3 text-sm font-bold text-[#1c1917] dark:text-[#faf6f0] transition-all duration-150 hover:bg-[#f7f2ec] dark:hover:bg-[#28221c] active:scale-95 shadow-xs"
          >
            <Navigation className="h-4 w-4 text-[#b42323]" />
            <span>{isBn ? 'রুট তৈরি করুন' : 'Build a route'}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
