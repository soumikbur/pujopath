'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Flame, ExternalLink, Info, CheckCircle2, Moon, CheckCircle, AlertCircle, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { PUJA_CALENDAR_DATA } from '@/data/calendar';
import { getSandhiPujaSchedule } from '@/data/calendar/sandhiPuja';
import {
  getKaliPujaSchedule,
  AVAILABLE_KALI_PUJA_YEARS,
  KALI_PUJA_TRADITIONS,
  KALI_PRANAM_MANTRA,
} from '@/data/calendar/kaliPuja';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFestival } from '@/lib/context/FestivalContext';
import { cn } from '@/lib/utils/cn';

export default function CalendarPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { activeFestival, selectFestival, isKali } = useFestival();

  // Durga Sandhi Puja state
  const sandhiSchedule = getSandhiPujaSchedule(2026);
  const [selectedConventionId, setSelectedConventionId] = useState<string>(
    sandhiSchedule.primaryConventionId
  );
  const activeConvention =
    sandhiSchedule.conventions.find((c) => c.id === selectedConventionId) ||
    sandhiSchedule.conventions[0];

  // Kali Puja state
  const [selectedKaliYear, setSelectedKaliYear] = useState<number>(2026);
  const kaliSchedule = getKaliPujaSchedule(selectedKaliYear);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Festival Switcher Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#f4ede4] dark:bg-[#201c18] border border-[#eee8e1] dark:border-[#2f2720] w-fit">
        <button
          type="button"
          onClick={() => selectFestival('durga')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer',
            !isKali
              ? 'bg-[#b42323] text-white shadow-xs'
              : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white'
          )}
        >
          <span>🌸</span>
          <span>{isBn ? 'শারদীয়া দুর্গাপূজা ২০২৬' : 'Durga Puja 2026'}</span>
        </button>
        <button
          type="button"
          onClick={() => selectFestival('kali')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer',
            isKali
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white'
          )}
        >
          <span>🪔</span>
          <span>{isBn ? 'শ্যামা পূজা ও অমাবস্যা' : 'Kali Puja & Amavasya'}</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <div className={cn(
          'flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider',
          isKali ? 'text-purple-600 dark:text-purple-400' : 'text-[#b42323]'
        )}>
          <Calendar className="w-4 h-4" />
          <span>
            {isKali
              ? (isBn ? 'শ্যামা পূজা পঞ্জিকা ও নিশীথ লগ্ন' : 'Kali Puja Almanac & Muhurat')
              : (isBn ? 'পূজা পঞ্জিকা ও নির্ঘণ্ট' : 'Puja Almanac')}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isKali
            ? (isBn ? 'মা শ্যামা পূজা ও দীপান্বিতা অমাবস্যা নির্ঘণ্ট' : 'Sacred Kali Puja & Nishita Kaal Almanac')
            : (isBn ? 'শারদীয়া দুর্গাপূজা ২০২৬ বিশুদ্ধ নির্ঘণ্ট' : 'Durga Puja 2026 Sacred Calendar')}
        </h1>
        <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1">
          {isKali
            ? (isBn
                ? 'কার্তিক অমাবস্যার পুণ্য মহানিশায় মা কালীর আরাধনা, নিশীথ কাল লগ্ন, ভূত চতুর্দশীর ১৪ প্রদীপ ও বারাসাত পরিক্রমা।'
                : 'Exact Kartik Amavasya tithis, midnight Nishita Kaal Mahanisha muhurat, Bhoot Chaturdashi 14 lamps, and Barasat circuit.')
            : (isBn
                ? 'মহালয়া, মহাষষ্ঠী, মহাসপ্তমী, মহাষ্টমী অঞ্জলি, সন্ধিপূজা ও বিজয়া দশমীর নির্ভুল শুভ সময়সূচি।'
                : 'Exact tithi schedules, pushpanjali auspicious timings, and sandhi puja hours.')}
        </p>
      </div>

      {/* =========================================================================
          CONDITIONAL CONTENT: KALI PUJA PANJIKA VIEW
         ========================================================================= */}
      {isKali ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Year Selector & Verification Badge */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'পঞ্জিকা বছর নির্বাচন করুন:' : 'Select Panjika Year:'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {AVAILABLE_KALI_PUJA_YEARS.map((yr) => {
                const isSelected = yr === selectedKaliYear;
                return (
                  <button
                    key={yr}
                    onClick={() => setSelectedKaliYear(yr)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
                      isSelected
                        ? 'bg-purple-700 text-white shadow-md scale-105'
                        : 'bg-[#faf7f2] dark:bg-[#251e18] text-[#554b44] dark:text-[#c4b9ae] border border-[#ded4c8] dark:border-[#382e25] hover:border-purple-600'
                    )}
                  >
                    {yr}
                    {yr === 2026 && (
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border',
                kaliSchedule.verified
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
              )}
            >
              {kaliSchedule.verified ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              <span>
                {kaliSchedule.verified
                  ? isBn
                    ? 'বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা দ্বারা নিশ্চিত'
                    : 'Verified Bisuddha Siddhanta Panjika'
                  : isBn
                  ? 'সাময়িক সময়সূচী'
                  : 'Provisional'}
              </span>
            </div>
          </div>

          {/* Nishita Kaal & Amavasya Timings Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#fdfaf7] via-[#faf4ff] to-[#f4e8ff] dark:from-[#1e1329] dark:via-[#190e24] dark:to-[#12071d] border-2 border-purple-300/60 dark:border-purple-800/50 shadow-lg space-y-6">
            <div className="flex items-center gap-3 border-b border-purple-200/60 dark:border-purple-900/40 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-800 dark:text-purple-300 text-[10px] font-black uppercase tracking-wider">
                    {isBn ? 'প্রধান নিশীথ লগ্ন' : 'Primary Puja Muhurat'}
                  </span>
                  <span className="text-xs text-purple-900 dark:text-purple-200/80 font-medium">
                    {isBn ? kaliSchedule.nishitaKaalPuja.applicableNightBn : kaliSchedule.nishitaKaalPuja.applicableNight}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] mt-0.5">
                  {isBn ? 'মহানিশা ও নিশীথ কাল পূজা লগ্ন' : 'Mahanisha & Nishita Kaal Timing'}
                </h2>
              </div>
            </div>

            {/* Highlight Box */}
            <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-400/40 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                    {isBn ? 'পূজার পুণ্য সময়সীমা (কলকাতা স্থানাঙ্ক):' : 'Auspicious Midnight Window (Kolkata):'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-purple-900 dark:text-purple-200 mt-0.5">
                    {isBn ? kaliSchedule.nishitaKaalPuja.windowStringBn : kaliSchedule.nishitaKaalPuja.windowString}
                  </div>
                </div>
                {kaliSchedule.nishitaKaalPuja.durationMinutes > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-200 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold text-xs self-start sm:self-auto">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {isBn
                        ? `${kaliSchedule.nishitaKaalPuja.durationMinutes} মিনিট`
                        : `${kaliSchedule.nishitaKaalPuja.durationMinutes} mins`}
                    </span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-purple-900 dark:text-purple-200/90 leading-relaxed">
                {isBn ? kaliSchedule.nishitaKaalPuja.descriptionBn : kaliSchedule.nishitaKaalPuja.description}
              </p>
            </div>

            {/* Amavasya Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#251533] border border-purple-200/50 dark:border-purple-900/40">
                <span className="text-xs font-bold text-[#8a7f76] dark:text-[#a89e95]">
                  {isBn ? 'অমাবস্যা তিথি আরম্ভ' : 'Amavasya Begins'}
                </span>
                <div className="text-base font-bold text-[#242424] dark:text-[#ede5dc] mt-1">
                  {isBn ? kaliSchedule.amavasyaTithi.beginsBn : kaliSchedule.amavasyaTithi.begins}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#251533] border border-purple-200/50 dark:border-purple-900/40">
                <span className="text-xs font-bold text-[#8a7f76] dark:text-[#a89e95]">
                  {isBn ? 'অমাবস্যা তিথি সমাপ্তি' : 'Amavasya Ends'}
                </span>
                <div className="text-base font-bold text-[#242424] dark:text-[#ede5dc] mt-1">
                  {isBn ? kaliSchedule.amavasyaTithi.endsBn : kaliSchedule.amavasyaTithi.ends}
                </div>
              </div>
            </div>

            {/* Bhoot Chaturdashi & Pranam Section */}
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-sm">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>
                  {isBn
                    ? `ভূত চতুর্দশী: ${kaliSchedule.bhootChaturdashi.dateStringBn}`
                    : `Bhoot Chaturdashi: ${kaliSchedule.bhootChaturdashi.dateString}`}
                </span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                {isBn ? kaliSchedule.bhootChaturdashi.ritualsBn : kaliSchedule.bhootChaturdashi.rituals}
              </p>
            </div>

            {/* Sacred Pranam Mantra */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#20102d] border border-purple-200/60 dark:border-purple-900/40 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                {isBn ? 'শ্রী শ্রী মা কালীর প্রণাম মন্ত্র' : 'Sacred Kali Pranam Mantra'}
              </span>
              <p className="font-serif text-sm sm:text-base font-bold text-[#242424] dark:text-[#ede5dc] leading-relaxed">
                {KALI_PRANAM_MANTRA.sanskrit}
              </p>
              <p className="text-xs text-[#776d65] dark:text-[#a89e95]">
                {isBn ? KALI_PRANAM_MANTRA.meaningBn : KALI_PRANAM_MANTRA.meaningEn}
              </p>
            </div>

            {/* Quick Actions to Explore Barasat & Shaktipeeths */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/explore?festival=kali"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                <span>{isBn ? 'বারাসাত কালীপূজা মণ্ডপ তালিকা' : 'Explore Barasat Pandals'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/kali-puja"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] text-purple-700 dark:text-purple-300 hover:border-purple-600 font-bold text-xs shadow-xs transition-all"
              >
                <span>{isBn ? 'ঐতিহাসিক সতীপীঠ ও পূর্ণ বিবরণ' : 'Shaktipeeths & Full Guide'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            DURGA PUJA PANJIKA VIEW (Sandhi Puja + Daily Timeline)
           ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-200">
          <section
            id="sandhi-puja-section"
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#fff7f5] via-white to-[#fef5ed] dark:from-[#241713] dark:via-[#1c1511] dark:to-[#17120e] border-2 border-[#b42323]/30 dark:border-[#b42323]/40 shadow-lg space-y-5 transition-colors"
          >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0ded8] dark:border-[#38261e] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#b42323] text-white flex items-center justify-center shadow-md shrink-0">
              <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#b42323] px-2.5 py-0.5 rounded-full bg-[#b42323]/10 dark:bg-[#b42323]/25">
                  {isBn ? 'মহাসন্ধিক্ষণ ২০২৬' : 'Sacred Sandhi Window 2026'}
                </span>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                  {isBn ? '১০৮ পদ্ম ও ১০৮ প্রদীপ' : '108 Lotuses & Lamps'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#242424] dark:text-[#ede5dc] mt-1">
                {isBn ? 'সন্ধিপূজা বিশেষ নির্ঘণ্ট (Sandhi Puja Timings)' : 'Sandhi Puja Auspicious Timings'}
              </h2>
            </div>
          </div>

          <div className="text-xs sm:text-sm font-sans font-bold text-[#b42323] px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#201c18] border border-[#f0ded8] dark:border-[#38261e] shadow-xs self-start sm:self-auto">
            {isBn ? activeConvention.durationDisplayBn : activeConvention.durationDisplay}
          </div>
        </div>

        {/* Panjika Convention Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#665a54] dark:text-[#a89e95] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#b42323]" />
              <span>{isBn ? 'পঞ্জিকা গণনা পদ্ধতি নির্বাচন করুন:' : 'Select Almanac / Panjika Convention:'}</span>
            </span>
            <span className="text-[11px] text-[#776d65] dark:text-[#a89e95]">
              {isBn ? 'কলকাতার ভৌগোলিক স্থানাঙ্ক ভিত্তিক' : 'Calculated for Kolkata'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sandhiSchedule.conventions.map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => setSelectedConventionId(conv.id)}
                className={cn(
                  'p-3.5 rounded-2xl border text-left transition-all text-xs font-semibold flex flex-col justify-between gap-1.5',
                  selectedConventionId === conv.id
                    ? 'border-[#b42323] bg-white dark:bg-[#1a1613] shadow-md ring-2 ring-[#b42323]/20'
                    : 'border-[#eee8e1] dark:border-[#2f2720] bg-white/70 dark:bg-[#1a1613]/60 hover:border-[#b42323]/40'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-[#242424] dark:text-[#ede5dc]">
                    {isBn ? conv.nameBn : conv.name}
                  </span>
                  {selectedConventionId === conv.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#b42323] shrink-0" />
                  )}
                </div>
                <div className="text-[11px] font-sans font-bold text-[#b42323]">
                  {isBn ? conv.startTimeBn : conv.startTime} – {isBn ? conv.endTimeBn : conv.endTime}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Convention Timing Display Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#191411] border border-[#f0ded8] dark:border-[#38261e] space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Date */}
            <div className="p-3.5 rounded-xl bg-[#fdfaf7] dark:bg-[#201a16] border border-[#eee8e1] dark:border-[#2f2720]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
                {isBn ? 'উৎসব ও তারিখ' : 'Festival & Date'}
              </span>
              <div className="font-black text-base text-[#242424] dark:text-[#ede5dc] mt-0.5">
                {isBn ? activeConvention.festivalBn : activeConvention.festival}
              </div>
              <div className="text-xs text-[#b42323] font-semibold mt-0.5">
                {isBn ? activeConvention.dateStringBn : activeConvention.dateString}
              </div>
            </div>

            {/* Time Window */}
            <div className="p-3.5 rounded-xl bg-[#fdfaf7] dark:bg-[#201a16] border border-[#eee8e1] dark:border-[#2f2720]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
                {isBn ? 'সন্ধিপূজা লগ্ন সময়সূচি' : 'Sandhi Puja Window (IST)'}
              </span>
              <div className="font-black text-lg text-[#b42323] mt-0.5 font-sans">
                {isBn ? activeConvention.startTimeBn : activeConvention.startTime} –{' '}
                {isBn ? activeConvention.endTimeBn : activeConvention.endTime}
              </div>
              <div className="text-[11px] text-[#776d65] dark:text-[#a89e95] mt-0.5">
                {isBn ? 'এশিয়া/কলকাতা সময়' : 'Indian Standard Time (IST)'}
              </div>
            </div>

            {/* Duration & Split */}
            <div className="p-3.5 rounded-xl bg-[#fdfaf7] dark:bg-[#201a16] border border-[#eee8e1] dark:border-[#2f2720]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
                {isBn ? 'মোট স্থায়িত্বকাল' : 'Total Duration'}
              </span>
              <div className="font-black text-lg text-amber-600 dark:text-amber-400 mt-0.5 font-sans">
                {isBn ? activeConvention.durationDisplayBn : activeConvention.durationDisplay}
              </div>
              <div className="text-[11px] text-[#776d65] dark:text-[#a89e95] mt-0.5">
                {isBn ? 'অষ্টমী শেষ ২৪ মিনিট + নবমী প্রথম ২৪ মিনিট' : 'Last 24m Ashtami + First 24m Navami'}
              </div>
            </div>
          </div>

          {/* Spiritual Significance */}
          <div className="space-y-1.5 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#242424] dark:text-[#ede5dc]">
              {isBn ? 'সন্ধিপূজার তাৎপর্য ও পৌরাণিক মাহাত্ম্য:' : 'Significance & Mythological Context:'}
            </h4>
            <p className="text-xs sm:text-sm text-[#4a423d] dark:text-[#c4b9ae] leading-relaxed">
              {isBn ? activeConvention.significanceBn : activeConvention.significance}
            </p>
          </div>

          {/* Kolkata Coordinates & Source Citation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-[#eee8e1] dark:border-[#2f2720] text-xs text-[#776d65] dark:text-[#a89e95]">
            <div className="flex items-center gap-1.5">
              <span>{isBn ? 'গণনা স্থান:' : 'Calculated for:'}</span>
              <strong className="text-[#242424] dark:text-[#ede5dc]">
                {isBn ? activeConvention.locationBn : activeConvention.location}
              </strong>
            </div>

            <a
              href={activeConvention.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#b42323] hover:underline font-bold self-start sm:self-auto"
            >
              <span>{isBn ? 'মূল পঞ্জিকা উৎস পরীক্ষা করুন' : 'View Verified Almanac Source'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Panjika Difference Explanation Note */}
          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
            <p className="leading-relaxed">
              <strong>{isBn ? 'পঞ্জিকা বিষয়ক প্রয়োজনীয় দ্রষ্টব্য: ' : 'Almanac Note: '}</strong>
              {isBn ? activeConvention.calculationNoteBn : activeConvention.calculationNote}
            </p>
          </div>
        </div>
      </section>

      {/* Daily Puja Timeline Cards */}
      <div className="space-y-4">

        {PUJA_CALENDAR_DATA.map((day) => {
          const isAshtami = day.id === 'maha-ashtami-2026' || day.slug === 'maha-ashtami';

          return (
            <div
              key={day.id}
              className={cn(
                'p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border shadow-card space-y-3.5 transition-colors',
                isAshtami
                  ? 'border-amber-500/50 dark:border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'border-[#eee8e1] dark:border-[#2f2720]'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee8e1] dark:border-[#2f2720] pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#b42323]">
                      {day.tithis[0] ? (isBn ? day.tithis[0].nameBn : day.tithis[0].name) : day.dateString}
                    </span>
                    {isAshtami && (
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        {isBn ? 'বিশেষ অঞ্জলি লগ্ন' : 'Sacred Anjali'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] mt-0.5">
                    {isBn ? day.dayNameBn : day.dayName}
                  </h3>
                </div>
                <div className="text-xs sm:text-sm font-sans font-bold text-[#4a423d] dark:text-[#c4b9ae] px-3.5 py-1.5 rounded-full bg-[#fcfaf7] dark:bg-[#201c18] border border-[#eee8e1] dark:border-[#2f2720] self-start sm:self-auto shadow-sm">
                  {day.gregorianDate}
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#4a423d] dark:text-[#c4b9ae] leading-relaxed font-medium">
                {isBn ? day.significanceBn : day.significance}
              </p>

              {isAshtami ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-amber-500/15 dark:from-amber-950/40 dark:via-[#2b1816] dark:to-amber-950/40 border-2 border-amber-500/60 dark:border-amber-500/50 shadow-md ring-2 ring-amber-500/20 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-extrabold text-[#961818] dark:text-amber-400 flex items-center gap-2 text-sm sm:text-base">
                      <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                      <span>
                        {isBn
                          ? 'মহাষ্টমীর প্রধান পুষ্পাঞ্জলি সময় (বিশেষ নির্ঘণ্ট)'
                          : 'Maha Ashtami Sacred Pushpanjali (Special Highlight)'}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase bg-[#b42323] text-white shadow-xs">
                      {isBn ? 'প্রধান অঞ্জলি' : 'Key Anjali Timing'}
                    </span>
                  </div>
                  <p className="font-sans text-[#b42323] dark:text-[#fca5a5] font-black text-lg sm:text-xl pl-7">
                    {isBn ? day.pushpanjaliTimingsBn : day.pushpanjaliTimings}
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#fcfaf7] dark:bg-[#201c18] border border-[#eee8e1] dark:border-[#2f2720] space-y-1">
                  <div className="font-bold text-[#242424] dark:text-[#ede5dc] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#b42323]" />
                    <span>{isBn ? 'পুষ্পাঞ্জলির শুভ সময়' : 'Pushpanjali Auspicious Timings'}</span>
                  </div>
                  <p className="font-sans text-[#b42323] font-black text-base pl-6">
                    {isBn ? day.pushpanjaliTimingsBn : day.pushpanjaliTimings}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )}
</div>
  );
}

