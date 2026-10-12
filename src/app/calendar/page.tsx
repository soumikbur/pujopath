'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Flame, ExternalLink, Info, CheckCircle2 } from 'lucide-react';
import { PUJA_CALENDAR_DATA } from '@/data/calendar';
import { getSandhiPujaSchedule } from '@/data/calendar/sandhiPuja';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils/cn';

export default function CalendarPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const sandhiSchedule = getSandhiPujaSchedule(2026);
  const [selectedConventionId, setSelectedConventionId] = useState<string>(
    sandhiSchedule.primaryConventionId
  );

  const activeConvention =
    sandhiSchedule.conventions.find((c) => c.id === selectedConventionId) ||
    sandhiSchedule.conventions[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 text-[#b42323] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>{isBn ? 'পূজা পঞ্জিকা ও নির্ঘণ্ট' : 'Puja Almanac'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isBn ? 'শারদীয়া দুর্গাপূজা ২০২৬ বিশুদ্ধ নির্ঘণ্ট' : 'Durga Puja 2026 Sacred Calendar'}
        </h1>
        <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1">
          {isBn
            ? 'মহালয়া, মহাষষ্ঠী, মহাসপ্তমী, মহাষ্টমী অঞ্জলি, সন্ধিপূজা ও বিজয়া দশমীর নির্ভুল শুভ সময়সূচি।'
            : 'Exact tithi schedules, pushpanjali auspicious timings, and sandhi puja hours.'}
        </p>
      </div>

      {/* =========================================================================
          DEDICATED FEATURE: SANDHI PUJA AUSPICIOUS TIMINGS & PANJIKA CONVENTIONS
         ========================================================================= */}
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

        {PUJA_CALENDAR_DATA.map((day) => (
          <div
            key={day.id}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card space-y-3.5 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee8e1] dark:border-[#2f2720] pb-3.5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#b42323]">
                  {day.tithis[0] ? (isBn ? day.tithis[0].nameBn : day.tithis[0].name) : day.dateString}
                </span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-sm">
              <div className="p-3.5 rounded-2xl bg-[#fcfaf7] dark:bg-[#201c18] border border-[#eee8e1] dark:border-[#2f2720] space-y-1">
                <div className="font-bold text-[#242424] dark:text-[#ede5dc] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#b42323]" />
                  <span>{isBn ? 'পুষ্পাঞ্জলির শুভ সময়' : 'Pushpanjali Auspicious Timings'}</span>
                </div>
                <p className="font-sans text-[#b42323] font-black text-base pl-6">
                  {isBn ? day.pushpanjaliTimingsBn : day.pushpanjaliTimings}
                </p>
              </div>

              {day.bhogTimings && (
                <div className="p-3.5 rounded-2xl bg-[#fcfaf7] dark:bg-[#201c18] border border-[#eee8e1] dark:border-[#2f2720] space-y-1">
                  <div className="font-bold text-[#242424] dark:text-[#ede5dc] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{isBn ? 'ভোগ নিবেদন ও প্রসাদ' : 'Bhog Prasad Timings'}</span>
                  </div>
                  <p className="font-sans text-amber-600 dark:text-amber-400 font-black text-base pl-6">
                    {isBn ? day.bhogTimingsBn : day.bhogTimings}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
