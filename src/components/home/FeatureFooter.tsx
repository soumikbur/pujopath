'use client';

import React from 'react';
import {
  Sparkles,
  Zap,
  Smartphone,
  Moon,
  Languages,
  Watch,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';

export function FeatureFooter() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const features = [
    {
      icon: Sparkles,
      title: isBn ? 'অতি সহজ' : 'Ultra Simple',
      desc: isBn ? 'শুধু প্রয়োজনীয় জিনিস' : 'Only what you need',
    },
    {
      icon: Zap,
      title: isBn ? 'দ্রুত ও মসৃণ' : 'Lightning Fast',
      desc: isBn ? 'মসৃণ অভিজ্ঞতা' : 'Smooth experience',
    },
    {
      icon: Smartphone,
      title: isBn ? 'সব ডিভাইসে উপযোগী' : 'Fully Responsive',
      desc: isBn ? 'সব ডিভাইসে' : 'All devices',
    },
    {
      icon: Moon,
      title: isBn ? 'ডার্ক মোড' : 'Dark Mode',
      desc: isBn ? 'চোখের স্বস্তি' : 'Easy on your eyes',
    },
    {
      icon: Languages,
      title: isBn ? 'বাংলা ও ইংরেজি' : 'Bengali & English',
      desc: isBn ? 'দ্বিভাষিক প্ল্যাটফর্ম' : 'Multi-language',
    },
    {
      icon: Watch,
      title: isBn ? 'সবার জন্য তৈরি' : 'Made for Everyone',
      desc: isBn ? 'এমনকি ঘড়িতেও' : 'Even on your wrist',
    },
  ];

  return (
    <section className="py-0.5 shrink-0">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded-[14px]"
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(234, 220, 206, 0.85)',
              }}
            >
              <div
                className="p-1.5 rounded-xl shrink-0"
                style={{ background: 'rgba(213, 47, 47, 0.07)' }}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.2] text-[#D52F2F]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#242424] leading-tight truncate">
                  {f.title}
                </h4>
                <p className="text-[10px] text-[#665A54] truncate mt-0.5 font-medium">
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
