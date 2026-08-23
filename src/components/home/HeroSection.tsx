'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Navigation, ArrowRight, MapPin } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { toBengaliDigits } from '@/lib/geo';
import { CalendarService } from '@/lib/services/CalendarService';

export function HeroSection() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const [countdown, setCountdown] = useState(CalendarService.getCountdown());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(CalendarService.getCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => {
    const padded = n < 10 ? `0${n}` : `${n}`;
    return isBn ? toBengaliDigits(padded) : padded;
  };

  return (
    <section
      className="relative overflow-hidden rounded-[22px] p-6 sm:p-7 md:p-8 min-h-[340px] md:min-h-[360px] flex items-center"
      style={{
        background: 'rgba(255, 248, 241, 0.75)',
        border: '1px solid rgba(240, 228, 215, 0.9)',
        boxShadow: '0 2px 10px rgba(70, 35, 15, 0.04)',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full relative z-10">
        {/* Left Column (50%) */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#D52F2F] tracking-tight leading-[1.12]">
              {isBn ? 'দুর্গাপূজা ২০২৬' : 'Durga Puja 2026'}
            </h1>
            <p className="text-base sm:text-[16px] text-[#242424] font-medium">
              {isBn ? 'ঐতিহ্য উদযাপন করুন। স্মৃতি তৈরি করুন।' : 'Celebrate tradition. Create memories.'}
            </p>
          </div>

          {/* 4 Countdown Cards */}
          <div className="grid grid-cols-4 gap-2.5 max-w-[400px]">
            {[
              { val: countdown.days, label: isBn ? 'দিন' : 'DAYS' },
              { val: countdown.hours, label: isBn ? 'ঘণ্টা' : 'HRS' },
              { val: countdown.minutes, label: isBn ? 'মিনিট' : 'MINS' },
              { val: countdown.seconds, label: isBn ? 'সেকেন্ড' : 'SECS' },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="rounded-[14px] py-2 px-1 text-center h-[70px] flex flex-col items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(234, 220, 206, 0.9)',
                  boxShadow: '0 1px 4px rgba(70, 35, 15, 0.03)',
                }}
              >
                <div className="text-2xl sm:text-[26px] font-black text-[#D52F2F] tracking-tight leading-none">
                  {formatNum(unit.val)}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#665A54] font-bold tracking-wider mt-1 uppercase">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 max-w-[420px]">
            <Link
              href="/explore"
              className="flex-1 inline-flex items-center justify-center gap-2 h-[44px] px-5 rounded-[14px] bg-[#D52F2F] hover:bg-[#BD2424] text-white font-bold text-sm shadow-sm transition-all duration-150 active:scale-[0.98]"
            >
              <Search className="w-4 h-4" />
              <span>{isBn ? 'প্যান্ডেল দেখুন' : 'Explore Pandals'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/planner"
              className="flex-1 inline-flex items-center justify-center gap-2 h-[44px] px-5 rounded-[14px] bg-white hover:bg-gray-50 border border-[#D52F2F] text-[#242424] font-bold text-sm transition-all duration-150 active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4 text-[#D52F2F]" />
              <span>{isBn ? 'পরিকল্পনা করুন' : 'Plan Your Route'}</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Photograph (50%) */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden shadow-card group" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
            <Image
              src="/images/hero-pandal-kolkata.jpg"
              alt="Authentic Kolkata Durga Puja Pandal Celebration"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, 540px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Location Badge */}
            <div
              className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold"
              style={{
                background: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <MapPin className="w-3.5 h-3.5 text-[#D52F2F]" />
              <span>{isBn ? 'কলকাতা • দুর্গাপূজা' : 'Kolkata • Durga Puja'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
