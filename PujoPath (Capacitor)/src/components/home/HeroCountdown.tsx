'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Compass, Navigation, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Button } from '@/components/ui/Button';
import { toBengaliDigits } from '@/lib/geo';
import { CalendarService } from '@/lib/services/CalendarService';

export function HeroCountdown() {
  const { locale, t } = useI18n();
  const [countdown, setCountdown] = useState(CalendarService.getCountdown());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(CalendarService.getCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => {
    const padded = n < 10 ? `0${n}` : `${n}`;
    return locale === 'bn' ? toBengaliDigits(padded) : padded;
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sindoor-900 via-sindoor-800 to-slate-950 text-white p-6 sm:p-10 shadow-2xl border border-sindoor-700/40">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gold-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-sindoor-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-gold-300">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>UNESCO Intangible Cultural Heritage of Humanity</span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            {t('heroTitle')}
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-stone-200 font-normal max-w-2xl leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* Live Countdown Grid */}
        <div className="pt-2">
          <div className="text-xs uppercase font-bold tracking-wider text-gold-300 mb-2.5 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{countdown.isLive ? t('festivalStatusLive') : t('countdownDays')}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md">
            {[
              { val: countdown.days, label: t('countdownDays').split(' ')[0] },
              { val: countdown.hours, label: t('countdownHours') },
              { val: countdown.minutes, label: t('countdownMinutes') },
              { val: countdown.seconds, label: t('countdownSeconds') },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 sm:p-3.5 text-center shadow-inner"
              >
                <div className="text-xl sm:text-3xl font-black text-gold-400 font-mono">
                  {formatNum(unit.val)}
                </div>
                <div className="text-[10px] sm:text-xs text-stone-300 font-medium uppercase mt-0.5">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/explore">
            <Button variant="gold" size="lg" className="shadow-lg">
              <Compass className="w-4 h-4" />
              <span>{t('btnExplorePandals')}</span>
            </Button>
          </Link>
          <Link href="/planner">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/25 text-white hover:bg-white/20 hover:text-white"
            >
              <Navigation className="w-4 h-4" />
              <span>{t('btnPlanRoute')}</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
