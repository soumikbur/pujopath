'use client';

import React from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { PUJA_CALENDAR_DATA } from '@/data/calendar';
import { useI18n } from '@/lib/i18n/I18nContext';

export default function CalendarPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

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
