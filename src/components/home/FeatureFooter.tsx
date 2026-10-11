'use client';

import React from 'react';
import {
  Sparkles,
  Zap,
  Smartphone,
  Moon,
  Sun,
  Languages,
  Heart,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils/cn';

export function FeatureFooter() {
  const { locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const isBn = locale === 'bn';

  const features = [
    {
      icon: Sparkles,
      title: isBn ? 'অতি সহজ' : 'Ultra Simple',
      desc: isBn ? 'শুধু প্রয়োজনীয় জিনিস' : 'Only what you need',
      onClick: undefined,
    },
    {
      icon: Zap,
      title: isBn ? 'দ্রুত ও মসৃণ' : 'Lightning Fast',
      desc: isBn ? 'মসৃণ অভিজ্ঞতা' : 'Smooth experience',
      onClick: undefined,
    },
    {
      icon: Smartphone,
      title: isBn ? 'সব ডিভাইসে উপযোগী' : 'Fully Responsive',
      desc: isBn ? 'সব ডিভাইসে' : 'All devices',
      onClick: undefined,
    },
    {
      icon: theme === 'dark' ? Sun : Moon,
      title: theme === 'dark' ? (isBn ? 'লাইট মোড' : 'Light Mode') : (isBn ? 'ডার্ক মোড' : 'Dark Mode'),
      desc: isBn ? 'ক্লিক করে বদলান' : 'Click to toggle',
      onClick: toggleTheme,
      isAction: true,
    },
    {
      icon: Languages,
      title: isBn ? 'বাংলা ও ইংরেজি' : 'Bengali & English',
      desc: isBn ? 'ভাষা পরিবর্তন করুন' : 'Click to toggle',
      onClick: () => setLocale(locale === 'en' ? 'bn' : 'en'),
      isAction: true,
    },
    {
      icon: Heart,
      title: isBn ? 'প্রিয় প্যান্ডেল' : 'Saved Trails',
      desc: isBn ? 'পছন্দের তালিকা' : 'Saved favorites',
      onClick: () => {
        window.location.href = '/saved';
      },
      isAction: true,
    },
  ];

  return (
    <section className="py-1 shrink-0">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {features.map((f, idx) => {
          const Icon = f.icon;
          const Component = f.onClick ? 'button' : 'div';
          return (
            <Component
              key={idx}
              onClick={f.onClick}
              className={cn(
                'flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all duration-150',
                'bg-white/80 dark:bg-[#1a1613]/80 border-[#eadcce] dark:border-[#2f2720] shadow-xs',
                f.isAction && 'hover:border-[#d52f2f] hover:bg-[#fff9f8] dark:hover:bg-[#251e18] cursor-pointer active:scale-95'
              )}
            >
              <div
                className="p-1.5 rounded-xl shrink-0 bg-[#d52f2f]/10 text-[#d52f2f]"
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#242424] dark:text-[#EDE5DC] leading-tight truncate">
                  {f.title}
                </h4>
                <p className="text-[10px] text-[#665a54] dark:text-[#a89e95] truncate mt-0.5 font-medium">
                  {f.desc}
                </p>
              </div>
            </Component>
          );
        })}
      </div>
    </section>
  );
}
