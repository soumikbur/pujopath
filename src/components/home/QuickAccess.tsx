'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Route,
  Train,
  Music2,
  Calendar,
  Sparkles,
  Heart,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils/cn';

export function QuickAccess() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const items = [
    { href: '/map', label: isBn ? 'মানচিত্র' : 'Map', icon: MapPin, iconColor: '#D52F2F', iconBg: 'rgba(213,47,47,0.08)' },
    { href: '/planner', label: isBn ? 'পরিকল্পনা' : 'Planner', icon: Route, iconColor: '#0D9488', iconBg: 'rgba(13,148,136,0.08)' },
    { href: '/metro', label: isBn ? 'মেট্রো' : 'Metro', icon: Train, iconColor: '#2563EB', iconBg: 'rgba(37,99,235,0.08)' },
    { href: '/music', label: isBn ? 'সঙ্গীত' : 'Music', icon: Music2, iconColor: '#7C3AED', iconBg: 'rgba(124,58,237,0.08)' },
    { href: '/calendar', label: isBn ? 'ক্যালেন্ডার' : 'Calendar', icon: Calendar, iconColor: '#EA580C', iconBg: 'rgba(234,88,12,0.08)' },
    { href: '/mahalaya', label: isBn ? 'মহালয়া' : 'Mahalaya', icon: Sparkles, iconColor: '#D97706', iconBg: 'rgba(217,119,6,0.08)' },
    { href: '/saved', label: isBn ? 'সংরক্ষিত' : 'Saved', icon: Heart, iconColor: '#E11D48', iconBg: 'rgba(225,29,72,0.08)' },
  ];

  return (
    <section className="space-y-2 pt-0.5">
      <h2 className="text-[15px] font-bold text-[#242424] tracking-tight">
        {isBn ? 'দ্রুত প্রবেশ' : 'Quick Access'}
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center justify-center h-[76px] p-2 rounded-[16px] hover:shadow-md transition-all duration-150 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(234, 220, 206, 0.9)',
                boxShadow: '0 1px 4px rgba(70, 35, 15, 0.03)',
              }}
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shrink-0"
                style={{ background: item.iconBg }}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.2]" style={{ color: item.iconColor }} />
              </div>
              <span className="text-xs sm:text-[13px] font-bold text-[#242424] group-hover:text-[#D52F2F] transition-colors truncate w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
