'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Music2,
  Route,
  Sparkles,
  Train,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';

export function QuickAccess() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const items = [
    {
      href: '/map',
      label: isBn ? 'মানচিত্র' : 'Map',
      description: isBn ? 'সব প্যান্ডেল একসঙ্গে দেখুন' : 'See all pandals at a glance',
      icon: MapPin,
      color: '#b42323',
    },
    {
      href: '/planner',
      label: isBn ? 'রুট প্ল্যানার' : 'Route Planner',
      description: isBn ? 'স্মার্ট পরিক্রমা তৈরি করুন' : 'Optimize your hopping trail',
      icon: Route,
      color: '#0d9488',
    },
    {
      href: '/metro',
      label: isBn ? 'মেট্রো গাইড' : 'Metro Guide',
      description: isBn ? 'কাছের স্টেশন খুঁজুন' : 'Find nearest metro stations',
      icon: Train,
      color: '#2563eb',
    },
    {
      href: '/calendar',
      label: isBn ? 'পঞ্জিকা' : 'Calendar',
      description: isBn ? 'পুজোর তিথি ও শুভ সময়' : 'Auspicious tithis and hours',
      icon: Calendar,
      color: '#ea580c',
    },
    {
      href: '/music',
      label: isBn ? 'শারদীয়া সঙ্গীত' : 'Puja Music',
      description: isBn ? 'চণ্ডীপাঠ ও ঢাকের বোল' : 'Chandi Path & Dhak beats',
      icon: Music2,
      color: '#7c3aed',
    },
    {
      href: '/mahalaya',
      label: isBn ? 'মহালয়া' : 'Mahalaya',
      description: isBn ? 'বীরেন্দ্রকৃষ্ণ ভদ্রের চণ্ডীপাঠ' : 'Timeless dawn broadcast',
      icon: Sparkles,
      color: '#d97706',
    },
  ];

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc] tracking-tight">
          {isBn ? 'দ্রুত প্রবেশ' : 'Quick Access'}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-2xl border border-[#eee8e1]/90 dark:border-[#2f2720]/90 bg-white/85 dark:bg-[#1a1613]/85 backdrop-blur-md p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b42323]/50 hover:shadow-md active:scale-95"
            >
              <div
                className="grid h-10 w-10 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="mt-3">
                <span className="block text-sm font-bold text-[#242424] dark:text-[#ede5dc] group-hover:text-[#b42323] transition-colors truncate">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-xs text-[#776d65] dark:text-[#a89e95] line-clamp-1">
                  {item.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
