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
    <section className="relative overflow-hidden rounded-3xl border border-[#eee8e1]/90 dark:border-[#2f2720]/90 bg-white/85 dark:bg-[#1a1613]/85 backdrop-blur-md p-5 sm:p-10 shadow-xs transition-colors duration-200">
      <div className="max-w-2xl relative z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f9e9e7]/90 dark:bg-[#341b18]/90 px-3.5 py-1.5 text-xs font-bold text-[#b42323] shadow-xs">
          <CalendarDays className="h-4 w-4" />
          {countdown.isLive ? (isBn ? 'পুজো চলছে' : 'Puja is live') : (isBn ? `${days} দিন বাকি` : `${days} days to Puja`)}
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#242424] dark:text-[#ede5dc] sm:text-5xl leading-tight">
          {isBn ? 'আপনার পুজো, সহজভাবে।' : 'Your Puja, made simple.'}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 sm:leading-7 text-[#665a54] dark:text-[#a89e95] sm:text-lg">
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
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#ded6ce] dark:border-[#383129] bg-white/90 dark:bg-[#1a1613]/90 px-5 py-3 text-sm font-bold text-[#3f3833] dark:text-[#ede5dc] transition-all duration-150 hover:bg-[#f7f3ee] dark:hover:bg-[#241f1a] active:scale-95 shadow-xs"
          >
            <Navigation className="h-4 w-4 text-[#b42323]" />
            <span>{isBn ? 'রুট তৈরি করুন' : 'Build a route'}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
