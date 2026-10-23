'use client';

import React from 'react';
import { RouteBuilder } from '@/components/planner/RouteBuilder';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Route } from 'lucide-react';

export default function PlannerPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto pb-12 min-w-0">
      <div>
        <div className="flex items-center gap-2 text-pujo-red text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Route className="w-4 h-4" />
          <span>{isBn ? 'রুট প্ল্যানার' : 'Route Planner'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-pujo-text-primary mt-1 tracking-tight">
          {isBn ? 'প্যান্ডেল হপিং রুট প্ল্যানার' : 'Pandal Hopping Route Planner'}
        </h1>
        <p className="text-sm sm:text-base text-pujo-text-muted mt-1">
          {isBn
            ? 'পছন্দের মণ্ডপগুলো নির্বাচন করুন এবং স্মার্ট অপটিমাইজার দিয়ে সবচেয়ে কম হাঁটা ও সুবিধাজনক পরিক্রমা রুট তৈরি করুন।'
            : 'Plan your customized pandal hopping route across Kolkata with smart nearest-neighbor optimization.'}
        </p>
      </div>

      <RouteBuilder />
    </div>
  );
}
