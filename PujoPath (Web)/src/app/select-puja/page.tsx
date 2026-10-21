'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Flame,
  ArrowRight,
  MapPin,
  Route,
  Calendar,
  Music2,
  CheckCircle2,
  Sun,
  Moon,
  Compass,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { useFestival, FestivalType } from '@/lib/context/FestivalContext';
import { cn } from '@/lib/utils/cn';

export default function SelectPujaPage() {
  const router = useRouter();
  const { locale, setLocale } = useI18n();
  const isBn = locale === 'bn';
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { activeFestival, selectFestival } = useFestival();

  const handleSelect = (festival: FestivalType) => {
    selectFestival(festival);
    router.push(`/?festival=${festival}`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-2 sm:py-4 px-2 sm:px-4 flex-1 flex flex-col justify-center animate-in fade-in duration-200">
      {/* Top Contextual Badge & Secondary Utility Strip */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-3 sm:mb-5 border-b border-[#eee8e1] dark:border-[#2a241f]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase bg-[#fdeeee] dark:bg-[#381c18] text-pujo-red dark:text-[#f87171] border border-[#f6ceca] dark:border-[#532822]">
          <span>✨</span>
          <span>{isBn ? 'উৎসব সংকলন ২০২৬ • নির্বাচন' : 'FESTIVAL EDITION 2026 • SELECTION'}</span>
        </div>

        {/* Action Controls: Theme Switcher + Language Switcher */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-[#e8e1d9] dark:border-[#332b24] bg-white/80 dark:bg-[#1f1a16] text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Language Toggle */}
          <div className="flex items-center rounded-xl border border-[#e8e1d9] dark:border-[#332b24] bg-white/80 dark:bg-[#1f1a16] p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={cn(
                'px-2 py-0.5 rounded-lg transition-all',
                !isBn
                  ? 'bg-pujo-red text-white shadow-sm'
                  : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424]'
              )}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale('bn')}
              className={cn(
                'px-2 py-0.5 rounded-lg transition-all',
                isBn
                  ? 'bg-pujo-red text-white shadow-sm'
                  : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424]'
              )}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>

      {/* Page Heading */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
          {isBn ? 'উৎসব নির্বাচন করুন' : 'Choose Your Festival'}
        </h1>
        <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] leading-relaxed max-w-lg mx-auto">
          {isBn
            ? 'বাঙালির প্রাণের শারদীয়া দুর্গাপূজা অথবা ভক্তিগম্ভীর দীপান্বিতা কালীপূজা — আপনার পছন্দের উৎসবে প্রবেশ করুন।'
            : "Immerse in Bengal's sacred celebrations. Select an experience below to explore pandals, maps, rituals, and music."}
        </p>
      </div>

      {/* Festival Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
        {/* ============================================================ */}
        {/* 1. DURGA PUJA CARD                                          */}
        {/* ============================================================ */}
        <div
          onClick={() => handleSelect('durga')}
          role="button"
          tabIndex={0}
          aria-pressed={activeFestival === 'durga'}
          aria-label={isBn ? 'শ্রী শ্রী দুর্গাপূজা নির্বাচন করুন' : 'Select Durga Puja Experience'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelect('durga');
            }
          }}
          className={cn(
            'group relative rounded-2xl sm:rounded-3xl overflow-hidden border text-left cursor-pointer transition-all duration-300 hover:shadow-xl active:scale-[0.99] flex flex-col',
            activeFestival === 'durga'
              ? 'ring-2 ring-pujo-red/90 border-[#f6ceca] dark:border-[#532822] shadow-elevated bg-[#fff9f5] dark:bg-[#1a1210]'
              : 'border-[#eee8e1] dark:border-[#2a241f] hover:border-pujo-red/50 bg-white dark:bg-[#191512]'
          )}
        >
          {/* Active / Inactive Selection Indicator Badge */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-md transition-all">
            {activeFestival === 'durga' ? (
              <span className="flex items-center gap-1.5 bg-pujo-red text-white px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'সক্রিয় উৎসব' : 'Active Experience'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full border border-white/20">
                <span>{isBn ? 'নির্বাচন করতে ক্লিক' : 'Click to Select'}</span>
              </span>
            )}
          </div>

          {/* Image Banner */}
          <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 w-full overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0">
            <Image
              src="/images/hero-durga.jpg"
              alt="Durga Puja 2026"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 z-10">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase bg-[#b42323] text-white shadow-md">
                {isBn ? '🍁 শারদোৎসব ২০২৬' : '🍁 SHARODOTSAV 2026'}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
                  {isBn ? 'শ্রী শ্রী দুর্গাপূজা' : 'Durga Puja'}
                </h2>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fee2e2] dark:bg-[#341b18] flex items-center justify-center text-pujo-red shrink-0">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              <p className="text-xs sm:text-[13px] font-bold text-pujo-red dark:text-[#f87171]">
                {isBn ? 'মায়ের আগমনী ও ঐতিহ্যময় শারদোৎসব' : 'Grand Autumn Heritage Carnival'}
              </p>

              <p className="text-xs sm:text-[13px] text-[#665a54] dark:text-[#a89e95] leading-relaxed">
                {isBn
                  ? 'কলকাতার শ্রেষ্ঠ ৪৫০+ মণ্ডপ পরিক্রমা, থিম শিল্পকলা, বনেদি বাড়ির ইতিহাস, মহালয়ার চণ্ডীপাঠ ও ঢাকের উৎসব।'
                  : 'Explore 450+ iconic pandals across Kolkata, heritage Bonedi Bari traditions, smart hopping routes, and festive dhak rhythms.'}
              </p>

              {/* 2x2 Feature Pills Grid */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-[#fee2e2] dark:bg-[#341b18] text-pujo-red dark:text-[#f87171] truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{isBn ? '৪৫০+ মণ্ডপ' : '450+ Pandals'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-[#fee2e2] dark:bg-[#341b18] text-pujo-red dark:text-[#f87171] truncate">
                  <Route className="w-3 h-3 shrink-0" />
                  <span className="truncate">{isBn ? 'রুট প্ল্যানার' : 'Hopping Trails'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-[#fee2e2] dark:bg-[#341b18] text-pujo-red dark:text-[#f87171] truncate">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span className="truncate">{isBn ? 'পঞ্জিকা ও সন্ধিপূজা' : 'Almanac & Muhurat'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-[#fee2e2] dark:bg-[#341b18] text-pujo-red dark:text-[#f87171] truncate">
                  <Music2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{isBn ? 'শারদীয়া সঙ্গীত' : 'Puja Music'}</span>
                </span>
              </div>
            </div>

            {/* Visual Action Button (pointer-events-none to prevent nested clicks) */}
            <div className="pt-2 mt-auto">
              <div
                className={cn(
                  'w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all pointer-events-none',
                  activeFestival === 'durga'
                    ? 'bg-pujo-red text-white'
                    : 'bg-[#b42323] hover:bg-[#991b1b] text-white'
                )}
              >
                <span>
                  {isBn
                    ? activeFestival === 'durga'
                      ? 'দুর্গাপূজা পরিক্রমা শুরু করুন'
                      : 'দুর্গাপূজা নির্বাচন করুন'
                    : activeFestival === 'durga'
                    ? 'Explore Durga Puja Experience'
                    : 'Switch to Durga Puja'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. KALI PUJA CARD                                           */}
        {/* ============================================================ */}
        <div
          onClick={() => handleSelect('kali')}
          role="button"
          tabIndex={0}
          aria-pressed={activeFestival === 'kali'}
          aria-label={isBn ? 'মা শ্যামা পূজা ও বারাসাত নির্বাচন করুন' : 'Select Kali Puja & Barasat Experience'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelect('kali');
            }
          }}
          className={cn(
            'group relative rounded-2xl sm:rounded-3xl overflow-hidden border text-left cursor-pointer transition-all duration-300 hover:shadow-xl active:scale-[0.99] flex flex-col',
            activeFestival === 'kali'
              ? 'ring-2 ring-purple-600/90 border-[#e9d5ff] dark:border-[#4c1d95] shadow-elevated bg-[#faf5ff] dark:bg-[#160d24]'
              : 'border-[#eee8e1] dark:border-[#2a241f] hover:border-purple-500/50 bg-white dark:bg-[#191512]'
          )}
        >
          {/* Active / Inactive Selection Indicator Badge */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-md transition-all">
            {activeFestival === 'kali' ? (
              <span className="flex items-center gap-1.5 bg-purple-600 text-white px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'সক্রিয় উৎসব' : 'Active Experience'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full border border-white/20">
                <span>{isBn ? 'নির্বাচন করতে ক্লিক' : 'Click to Select'}</span>
              </span>
            )}
          </div>

          {/* Image Banner */}
          <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 w-full overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0">
            <Image
              src="/images/kali-hero.jpg"
              alt="Kali Puja & Barasat 2026"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 z-10">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase bg-amber-500 text-stone-900 shadow-md">
                {isBn ? '🪔 দীপান্বিতা অমাবস্যা ২০২৬' : '🪔 DIPANWITA AMAVASYA 2026'}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
                  {isBn ? 'মা শ্যামা পূজা ও দীপাবলি' : 'Kali Puja'}
                </h2>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 shrink-0">
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                </div>
              </div>

              <p className="text-xs sm:text-[13px] font-bold text-purple-700 dark:text-purple-400">
                {isBn ? 'অন্ধকার বিনাশিনী আদ্যাশক্তির আরাধনা' : 'Devotion, Illumination & Shaktipeeths'}
              </p>

              <p className="text-xs sm:text-[13px] text-[#665a54] dark:text-[#a89e95] leading-relaxed">
                {isBn
                  ? 'কালীঘাট ও দক্ষিণেশ্বর সহ ঐতিহাসিক কালীক্ষেত্র দর্শন, নিশীথ অমাবস্যার মহানির্ঘণ্ট, ১৪ প্রদীপ ও ভক্তিগম্ভীর শ্যামাসঙ্গীত।'
                  : 'Journey through revered Shaktipeeths, authentic Dipanwita Amavasya midnight timings, sacred pradip rituals, and soulful music.'}
              </p>

              {/* 2x2 Feature Pills Grid */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 truncate">
                  <Compass className="w-3 h-3 shrink-0" />
                  <span className="truncate">{isBn ? 'ঐতিহাসিক কালীক্ষেত্র' : 'Sacred Temples'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 truncate">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span className="truncate">{isBn ? 'নিশীথ কাল নির্ঘণ্ট' : 'Midnight Tithi'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 truncate">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span className="truncate">{isBn ? 'বারাসাত আলোকসজ্জা' : 'Barasat Circuit'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 truncate">
                  <Music2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{isBn ? 'শ্যামাসঙ্গীত' : 'Shyama Sangeet'}</span>
                </span>
              </div>
            </div>

            {/* Visual Action Button (pointer-events-none to prevent nested clicks) */}
            <div className="pt-2 mt-auto">
              <div
                className={cn(
                  'w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all pointer-events-none',
                  activeFestival === 'kali'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-700 hover:bg-purple-800 text-white'
                )}
              >
                <span>
                  {isBn
                    ? activeFestival === 'kali'
                      ? 'কালীপূজা পরিক্রমা শুরু করুন'
                      : 'কালীপূজা নির্বাচন করুন'
                    : activeFestival === 'kali'
                    ? 'Explore Kali Puja Experience'
                    : 'Switch to Kali Puja & Barasat'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

