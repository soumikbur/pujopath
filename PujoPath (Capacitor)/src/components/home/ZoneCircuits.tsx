'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { LocalityZone } from '@/types';
import { toBengaliDigits } from '@/lib/geo';

export function ZoneCircuits() {
  const { locale, t } = useI18n();

  const zones: { name: LocalityZone; nameBn: string; count: number; desc: string; descBn: string; color: string }[] = [
    {
      name: 'North Kolkata',
      nameBn: 'উত্তর কলকাতা',
      count: 8,
      desc: 'Heritage sabeki idols, century-old baris & grand lighting',
      descBn: 'সাবেকি প্রতিমা, বনেদি বাড়ি ও শতাব্দী প্রাচীন ঐতিহ্য',
      color: 'from-amber-600 to-orange-700',
    },
    {
      name: 'South Kolkata',
      nameBn: 'দক্ষিণ কলকাতা',
      count: 7,
      desc: 'Groundbreaking art installations, massive crowds & lavish themes',
      descBn: 'বিখ্যাত থিম পুজো, আধুনিক শিল্পকলা ও উপচে পড়া ভিড়',
      color: 'from-sindoor-600 to-rose-700',
    },
    {
      name: 'Central Kolkata',
      nameBn: 'মধ্য কলকাতা',
      count: 3,
      desc: 'Historic squares, iconic water reflections & classic lighting',
      descBn: 'ঐতিহাসিক স্কোয়ার, বিখ্যাত আলোকসজ্জা ও জলাশয়ের প্রতিচ্ছবি',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      name: 'Salt Lake',
      nameBn: 'সল্টলেক ও ই এম বাইপাস',
      count: 3,
      desc: 'Spacious architectural wonders and serene evening hopping',
      descBn: 'বিশাল স্থাপত্যের অনুকরণে তৈরি চোখ জুড়ানো মণ্ডপ',
      color: 'from-emerald-600 to-teal-700',
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t('secExploreByZone')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {t('secExploreByZoneSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {zones.map((zone) => (
          <Link
            key={zone.name}
            href={`/explore?zone=${encodeURIComponent(zone.name)}`}
            className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sindoor-600 dark:text-sindoor-400">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {locale === 'bn'
                    ? `${toBengaliDigits(zone.count)} টি পুজো`
                    : `${zone.count} Pandals`}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sindoor-600 group-hover:translate-x-1 transition-all" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-sindoor-600 dark:group-hover:text-sindoor-400 transition-colors">
              {locale === 'bn' ? zone.nameBn : zone.name}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {locale === 'bn' ? zone.descBn : zone.desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
