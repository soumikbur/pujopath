'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { CalendarService } from '@/lib/services/CalendarService';

export function TodayPujaCard() {
  const { locale, t } = useI18n();
  const day = CalendarService.getTodayOrUpcoming();

  return (
    <section className="rounded-3xl bg-gradient-to-br from-gold-500/10 via-stone-50 to-sindoor-500/10 dark:from-slate-900 dark:via-slate-900 dark:to-sindoor-950/30 border border-gold-400/30 dark:border-gold-500/20 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 dark:bg-gold-500/30 text-gold-800 dark:text-gold-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
            <span>{t('todayIs')}: {locale === 'bn' ? day.dayNameBn : day.dayName}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {locale === 'bn' ? day.significanceBn : day.significance}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <Clock className="w-4 h-4 text-sindoor-600" />
              <span>
                {t('pushpanjaliLabel')}:{' '}
                <strong className="text-slate-900 dark:text-white">
                  {locale === 'bn' ? day.pushpanjaliTimingsBn : day.pushpanjaliTimings}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/calendar"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-sindoor-500 transition-colors shrink-0 shadow-sm"
        >
          <Calendar className="w-4 h-4 text-sindoor-600" />
          <span>{t('navCalendar')}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </section>
  );
}
