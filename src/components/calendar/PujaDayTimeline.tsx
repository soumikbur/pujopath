'use client';

import React from 'react';
import { Calendar, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { PujaDay } from '@/types';
import { useI18n } from '@/lib/i18n/I18nContext';

interface PujaDayTimelineProps {
  days: PujaDay[];
}

export function PujaDayTimeline({ days }: PujaDayTimelineProps) {
  const { locale, t } = useI18n();

  return (
    <div className="space-y-6">
      {days.map((day) => {
        const dayTitle = locale === 'bn' ? day.dayNameBn : day.dayName;
        const significance = locale === 'bn' ? day.significanceBn : day.significance;
        const pushpanjali = locale === 'bn' ? day.pushpanjaliTimingsBn : day.pushpanjaliTimings;
        const bhog = locale === 'bn' ? day.bhogTimingsBn : day.bhogTimings;
        const rituals = locale === 'bn' ? day.ritualsBn : day.rituals;

        return (
          <div
            key={day.id}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sindoor-600 dark:text-sindoor-400">
                    {day.dateString}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sindoor-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {dayTitle}
                </h3>
              </div>

              <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gold-50 dark:bg-gold-950/50 text-gold-800 dark:text-gold-300 border border-gold-200 dark:border-gold-800 self-start sm:self-auto">
                {day.gregorianDate}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {significance}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Clock className="w-4 h-4 text-sindoor-600" />
                  <span>{t('pushpanjaliLabel')}</span>
                </div>
                <p className="text-xs font-mono font-semibold text-sindoor-600 dark:text-sindoor-400 pl-6">
                  {pushpanjali}
                </p>
              </div>

              {bhog && (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    <span>{t('bhogLabel')}</span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-gold-700 dark:text-gold-400 pl-6">
                    {bhog}
                  </p>
                </div>
              )}
            </div>

            {/* Rituals List */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('ritualsLabel')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rituals.map((ritual, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{ritual}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
