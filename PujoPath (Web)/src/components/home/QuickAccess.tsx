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
  Flame,
  Phone,
  Landmark,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFestival } from '@/lib/context/FestivalContext';

export function QuickAccess() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { isKali, toggleFestival } = useFestival();

  const durgaItems = [
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
      href: '/select-puja',
      label: isBn ? 'পূজা নির্বাচন' : 'Puja Selection',
      description: isBn ? 'দুর্গা ও শ্যামাপূজা বাছাই' : 'Choose festival mode',
      icon: SlidersHorizontal,
      color: '#9333ea',
    },
    {
      href: '/kali-puja',
      label: isBn ? 'বারাসাত ও শ্যামা' : 'Kali Puja',
      description: isBn ? 'বারাসাত আলোকসজ্জা ও তর্পণ' : 'Barasat illumination & guide',
      icon: Flame,
      color: '#f97316',
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
      href: '/helpline',
      label: isBn ? 'জরুরি হেল্পলাইন' : 'Helpline',
      description: isBn ? 'পুলিশ, স্বাস্থ্য ও দমকল' : 'Police, Medical & Fire',
      icon: Phone,
      color: '#dc2626',
    },
  ];

  const kaliItems = [
    {
      href: '/explore?festival=kali',
      label: isBn ? 'বারাসাত কালীপূজা' : 'Barasat Pandals',
      description: isBn ? 'পাইওনিয়ার, নবপল্লী ও সেরা মণ্ডপ' : 'Pioneer, Nabapally, Regiment & more',
      icon: Landmark,
      color: '#9333ea',
    },
    {
      href: '/map?festival=kali',
      label: isBn ? 'বারাসাত মানচিত্র' : 'Barasat Map',
      description: isBn ? 'যাচাইকৃত অবস্থান ও রুট পিন' : 'GPS navigation & pandal pins',
      icon: MapPin,
      color: '#2563eb',
    },
    {
      href: '/kali-puja',
      label: isBn ? 'পূজার নির্ঘণ্ট ও তিথি' : 'Almanac & Timings',
      description: isBn ? 'নিশীথ কাল ও শুভ লগ্ন' : 'Nishita Kaal midnight muhurat',
      icon: Calendar,
      color: '#f59e0b',
    },
    {
      href: '/music?festival=kali',
      label: isBn ? 'শ্যামাসঙ্গীত ও স্তোত্র' : 'Shyama Sangeet',
      description: isBn ? 'ধ্যানরাগ, আরতি ও ভক্তিগীতি' : 'Sacred raga & temple chants',
      icon: Music2,
      color: '#dc2626',
    },
    {
      href: '/explore?category=Temple',
      label: isBn ? 'ঐতিহাসিক সতীপীঠ' : 'Shaktipeeths',
      description: isBn ? 'কালীঘাট, দক্ষিণেশ্বর ও বনেদি বাড়ি' : 'Kalighat, Dakshineswar & more',
      icon: Sparkles,
      color: '#7c3aed',
    },
    {
      href: '/select-puja',
      label: isBn ? 'উৎসব পরিবর্তন' : 'Switch Festival',
      description: isBn ? 'শারদীয়া দুর্গাপূজায় ফিরে যান' : 'Return to Durga Puja',
      icon: RefreshCw,
      color: '#ea580c',
    },
    {
      href: '/metro',
      label: isBn ? 'মেট্রো গাইড' : 'Metro Guide',
      description: isBn ? 'কাছের স্টেশন ও সংযোগ' : 'Find nearest metro stations',
      icon: Train,
      color: '#2563eb',
    },
    {
      href: '/helpline',
      label: isBn ? 'জরুরি হেল্পলাইন' : 'Helpline',
      description: isBn ? 'পুলিশ, স্বাস্থ্য ও নিরাপত্তা' : 'Police, Medical & Safety',
      icon: Phone,
      color: '#dc2626',
    },
  ];

  const items = isKali ? kaliItems : durgaItems;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc] tracking-tight">
          {isKali ? (isBn ? 'শ্যামাপূজা ও বারাসাত শর্টকাট' : 'Kali Puja & Barasat Shortcuts') : (isBn ? 'দ্রুত প্রবেশ' : 'Quick Access')}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col justify-between rounded-2xl border border-[#eee8e1]/90 dark:border-[#2f2720]/90 bg-white/85 dark:bg-[#1a1613]/85 backdrop-blur-md p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-pujo-red/50 hover:shadow-md active:scale-95"
            >
              <div
                className="grid h-10 w-10 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-2.5">
                <span className="block text-xs sm:text-sm font-bold text-[#242424] dark:text-[#ede5dc] group-hover:text-pujo-red dark:group-hover:text-[#ff8787] transition-colors leading-tight">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[11px] text-[#776d65] dark:text-[#a89e95] leading-tight line-clamp-1">
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
