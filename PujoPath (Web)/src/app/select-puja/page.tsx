'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <div className="mx-auto w-full max-w-5xl py-4 sm:py-8 px-4 space-y-8 animate-in fade-in duration-300">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#eee8e1] dark:border-[#2a241f]">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-pujo-red dark:text-[#e05656]">
              PujoPath
            </span>
          </Link>
          <div className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase bg-[#fdeeee] dark:bg-[#381c18] text-pujo-red dark:text-[#f87171] border border-[#f6ceca] dark:border-[#532822]">
            {isBn ? 'উৎসব সংকলন' : 'FESTIVAL EDITION'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl border border-[#eee8e1] dark:border-[#2a241f] bg-white/80 dark:bg-[#1f1a16] text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Language Toggle */}
          <div className="flex items-center p-1 rounded-xl border border-[#eee8e1] dark:border-[#2a241f] bg-white/80 dark:bg-[#1f1a16] text-xs font-bold">
            <button
              onClick={() => setLocale('en')}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-all',
                !isBn
                  ? 'bg-pujo-red text-white shadow-sm'
                  : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424]'
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLocale('bn')}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-all',
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

      {/* Hero Welcome Text */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <h1 className="text-2xl sm:text-4xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
          {isBn ? 'উৎসব নির্বাচন করুন' : 'Choose Your Festival'}
        </h1>
        <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] leading-relaxed">
          {isBn
            ? 'বাঙালির প্রাণের শারদীয়া দুর্গাপূজা অথবা ভক্তিগম্ভীর দীপান্বিতা কালীপূজা — আপনার পছন্দের উৎসবে প্রবেশ করুন।'
            : "Immerse in Bengal's sacred celebrations. Select an experience below to enter its dedicated world of pandals, rituals, and music."}
        </p>
      </div>

      {/* Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2">
        {/* ============================================================ */}
        {/* 1. DURGA PUJA CARD                                          */}
        {/* ============================================================ */}
        <div
          onClick={() => handleSelect('durga')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleSelect('durga')}
          className={cn(
            'group relative rounded-3xl overflow-hidden border text-left cursor-pointer transition-all duration-300 hover:shadow-2xl active:scale-[0.99] flex flex-col',
            activeFestival === 'durga'
              ? 'ring-2 ring-pujo-red/80 border-[#f6ceca] dark:border-[#532822] shadow-elevated'
              : 'border-[#eee8e1] dark:border-[#2a241f] hover:border-pujo-red/50',
            'bg-[#fff9f5] dark:bg-[#1a1210]'
          )}
        >
          {/* Active selection ribbon */}
          {activeFestival === 'durga' && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-pujo-red text-white text-xs font-bold shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'সক্রিয় উৎসব' : 'Active Experience'}</span>
            </div>
          )}

          {/* Image Banner */}
          <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
            <Image
              src="/images/hero-durga.jpg"
              alt="Durga Puja 2026"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 z-10">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#b42323] text-white shadow-md">
                {isBn ? '🍁 শারদোৎসব ২০২৬' : '🍁 SHARODOTSAV 2026'}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
                  {isBn ? 'শ্রী শ্রী দুর্গাপূজা' : 'Durga Puja'}
                </h2>
                <div className="w-8 h-8 rounded-full bg-[#fee2e2] dark:bg-[#341b18] flex items-center justify-center text-pujo-red">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs sm:text-sm font-bold text-pujo-red dark:text-[#f87171]">
                {isBn ? 'মায়ের আগমনী ও ঐতিহ্যময় শারদোৎসব' : 'Grand Autumn Heritage Carnival'}
              </p>

              <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] leading-relaxed">
                {isBn
                  ? 'কলকাতার শ্রেষ্ঠ ৪৫০+ মণ্ডপ পরিক্রমা, থিম শিল্পকলা, বনেদি বাড়ির ইতিহাস, মহালয়ার চণ্ডীপাঠ ও ঢাকের উৎসব।'
                  : 'Explore 450+ iconic pandals across Kolkata, heritage Bonedi Bari traditions, smart hopping routes, and authentic festive dhak rhythms.'}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#fee2e2] dark:bg-[#341b18] text-pujo-red dark:text-[#f87171]">
                  <MapPin className="w-3 h-3" />
                  {isBn ? '৪৫০+ মণ্ডপ' : '450+ Pandals'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#fee2e2] dark:bg-[#341b18] text-pujo-red dark:text-[#f87171]">
                  <Route className="w-3 h-3" />
                  {isBn ? 'রুট প্ল্যানার' : 'Hopping Trails'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#fee2e2] dark:bg-[#341b18] text-pujo-red dark:text-[#f87171]">
                  <Calendar className="w-3 h-3" />
                  {isBn ? 'পঞ্জিকা ও সন্ধিপূজা' : 'Almanac & Muhurat'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#fee2e2] dark:bg-[#341b18] text-pujo-red dark:text-[#f87171]">
                  <Music2 className="w-3 h-3" />
                  {isBn ? 'শারদীয়া সঙ্গীত' : 'Puja Music'}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleSelect('durga')}
              className="w-full py-3 px-5 rounded-2xl bg-pujo-red hover:bg-[#991b1b] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <span>{isBn ? 'দুর্গোৎসবে প্রবেশ করুন' : 'Enter Durga Puja Experience'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. KALI PUJA CARD                                           */}
        {/* ============================================================ */}
        <div
          onClick={() => handleSelect('kali')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleSelect('kali')}
          className={cn(
            'group relative rounded-3xl overflow-hidden border text-left cursor-pointer transition-all duration-300 hover:shadow-2xl active:scale-[0.99] flex flex-col',
            activeFestival === 'kali'
              ? 'ring-2 ring-purple-600/80 border-[#e9d5ff] dark:border-[#4c1d95] shadow-elevated'
              : 'border-[#eee8e1] dark:border-[#2a241f] hover:border-purple-500/50',
            'bg-[#faf5ff] dark:bg-[#160d24]'
          )}
        >
          {/* Active selection ribbon */}
          {activeFestival === 'kali' && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'সক্রিয় উৎসব' : 'Active Experience'}</span>
            </div>
          )}

          {/* Image Banner */}
          <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
            <Image
              src="/images/kali-hero.jpg"
              alt="Kali Puja & Barasat 2026"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 z-10">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500 text-stone-900 shadow-md">
                {isBn ? '🪔 দীপান্বিতা অমাবস্যা ২০২৬' : '🪔 DIPANWITA AMAVASYA 2026'}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
                  {isBn ? 'মা শ্যামা পূজা ও দীপাবলি' : 'Kali Puja'}
                </h2>
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                  <Flame className="w-4 h-4 text-amber-500" />
                </div>
              </div>

              <p className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-400">
                {isBn ? 'অন্ধকার বিনাশিনী আদ্যাশক্তির আরাধনা' : 'Devotion, Illumination & Shaktipeeths'}
              </p>

              <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] leading-relaxed">
                {isBn
                  ? 'কালীঘাট ও দক্ষিণেশ্বর সহ ঐতিহাসিক কালীক্ষেত্র দর্শন, নিশীথ অমাবস্যার মহানির্ঘণ্ট, ১৪ প্রদীপ ও ভক্তিগম্ভীর শ্যামাসঙ্গীত।'
                  : 'Journey through revered Shaktipeeths, authentic Dipanwita Amavasya midnight timings, sacred pradip rituals, and soulful devotional music.'}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  <Compass className="w-3 h-3" />
                  {isBn ? 'ঐতিহাসিক কালীক্ষেত্র' : 'Sacred Temples'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  <Calendar className="w-3 h-3" />
                  {isBn ? 'নিশীথ কাল নির্ঘণ্ট' : 'Midnight Tithi'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  <Sparkles className="w-3 h-3" />
                  {isBn ? 'বারাসাত আলোকসজ্জা' : 'Barasat Circuit'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  <Music2 className="w-3 h-3" />
                  {isBn ? 'শ্যামাসঙ্গীত' : 'Shyama Sangeet'}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleSelect('kali')}
              className="w-full py-3 px-5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <span>{isBn ? 'শ্যামাপূজায় প্রবেশ করুন' : 'Enter Kali Puja Experience'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
