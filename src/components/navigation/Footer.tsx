'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/I18nContext';

export function Footer() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  return (
    <footer className="mt-auto w-full border-t border-[#eee8e1] dark:border-[#2a221b] bg-white/60 dark:bg-[#181411]/60 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-center sm:text-left">
          {/* Brand & Cultural Tagline */}
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-base font-black tracking-tight text-[#b42323] dark:text-[#e05656]">
                PujoPath
              </span>
              <span className="text-xs text-[#a89e95] dark:text-[#6b6158]">|</span>
              <span className="text-xs font-semibold text-[#776d65] dark:text-[#a89e95]">
                {isBn ? 'বাঙালির দুর্গোৎসব পরিক্রমা' : 'Kolkata Durga Puja Companion'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#8f847b] dark:text-[#80766d]">
              {isBn
                ? 'কলকাতার পূজামণ্ডপ, রুট প্ল্যানার ও শারদীয় উৎসবের ডিজিটাল সঙ্গী।'
                : 'Explore pandals, plan walking routes, check metro connectivity, and celebrate Bengal.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium text-[#776d65] dark:text-[#a89e95]">
            <Link href="/explore" className="hover:text-[#b42323] transition-colors">
              {isBn ? 'প্যান্ডেল' : 'Explore'}
            </Link>
            <Link href="/planner" className="hover:text-[#b42323] transition-colors">
              {isBn ? 'পরিক্রমা' : 'Planner'}
            </Link>
            <Link href="/metro" className="hover:text-[#b42323] transition-colors">
              {isBn ? 'মেট্রো' : 'Metro'}
            </Link>
            <Link href="/calendar" className="hover:text-[#b42323] transition-colors">
              {isBn ? 'পঞ্জিকা' : 'Calendar'}
            </Link>
            <Link href="/music" className="hover:text-[#b42323] transition-colors">
              {isBn ? 'সুরতরঙ্গ' : 'Music'}
            </Link>
            <Link href="/about" className="hover:text-[#b42323] transition-colors">
              {isBn ? 'পরিচিতি' : 'About'}
            </Link>
          </div>
        </div>

        {/* Creator Watermark Signature & Copyright */}
        <div className="mt-5 pt-4 border-t border-[#f0eae2] dark:border-[#251e18] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-[#776d65] dark:text-[#a89e95]">
          <div className="order-2 sm:order-1 text-[11px] text-[#9c9187] dark:text-[#73685f]">
            © {new Date().getFullYear()} PujoPath. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </div>

          <div
            className="order-1 sm:order-2 font-medium tracking-wide text-xs sm:text-[13px] select-text"
            aria-label="Made by Soumik & Moumita with love"
          >
            <span>Made by </span>
            <span className="font-semibold text-[#b42323] dark:text-[#e05656]">Soumik & Moumita</span>
            <span> with </span>
            <span className="text-[#e02424] inline-block text-sm" role="img" aria-label="heart">❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
