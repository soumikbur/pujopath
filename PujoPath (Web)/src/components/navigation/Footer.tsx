'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useBackground } from '@/lib/context/BackgroundContext';
import { useAudio } from '@/lib/context/AudioContext';
import { cn } from '@/lib/utils/cn';
import { Pause, Play, Linkedin } from 'lucide-react';

export function Footer() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const { currentBackground, isPaused, togglePause, prefersReducedMotion, isHomepage } = useBackground();
  const { isPlayerActive } = useAudio();

  return (
    <footer className="mt-auto shrink-0 w-full border-t border-[#eee8e1] dark:border-[#2a221b] bg-white/60 dark:bg-[#181411]/60 backdrop-blur-md">
      <div
        className={cn(
          'mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-7 transition-all duration-300',
          isPlayerActive
            ? 'pb-44 sm:pb-44 md:pb-28'
            : 'pb-20 sm:pb-20 md:pb-7'
        )}
      >
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

          {/* Essential Helpline & Contact Link */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium text-[#776d65] dark:text-[#a89e95]">
            <Link href="/about" className="hover:text-[#b42323] dark:hover:text-[#e05656] transition-colors">
              {isBn ? 'জরুরি হেল্পলাইন ও পরিচিতি' : 'Helpline & About'}
            </Link>
          </div>
        </div>

        {/* Creator Watermark Signature, Background Artwork Info & Copyright */}
        <div className="mt-5 pt-4 border-t border-[#f0eae2] dark:border-[#251e18] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-[#776d65] dark:text-[#a89e95]">
          <div className="order-3 sm:order-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-[#9c9187] dark:text-[#73685f]">
            <span>© {new Date().getFullYear()} PujoPath. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}</span>
            {isHomepage && (
              <>
                <span className="hidden sm:inline">•</span>
                {/* Subtle Ghibli Artwork Scene Badge & Pause Control (Homepage Only) */}
                <div className="inline-flex items-center gap-1.5 text-[10px] text-[#80756a] dark:text-[#8a7f74]">
                  <span className="opacity-80">
                    🎨 {isBn ? currentBackground?.titleBn : currentBackground?.titleEn}
                  </span>
                  {!prefersReducedMotion && (
                    <button
                      type="button"
                      onClick={togglePause}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#f2ece4] dark:bg-[#231b15] hover:text-[#b42323] dark:hover:text-[#e05656] transition-colors"
                      title={
                        isPaused
                          ? isBn
                            ? 'ব্যাকগ্রাউন্ড পরিবর্তন চালু করুন'
                            : 'Resume background rotation'
                          : isBn
                          ? 'ব্যাকগ্রাউন্ড পরিবর্তন স্থগিত করুন'
                          : 'Pause background rotation'
                      }
                      aria-label={isPaused ? 'Resume background rotation' : 'Pause background rotation'}
                    >
                      {isPaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
                      <span>{isPaused ? (isBn ? 'চালু' : 'Resume') : (isBn ? 'স্থগিত' : 'Pause')}</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <div
            className="order-1 sm:order-2 font-medium tracking-wide text-xs sm:text-[13px] select-text text-[#776d65] dark:text-[#a89e95]"
            aria-label={isBn ? 'নির্মাণে সৌমিক ও মৌমিতা' : 'Made by Soumik & Moumita'}
          >
            <span>{isBn ? 'নির্মাণে ' : 'Made by '}</span>
            <a
              href="https://www.linkedin.com/in/soumik-ghosh-883a1a22b/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#b42323] dark:text-[#e05656] hover:underline hover:text-[#961b1b] dark:hover:text-[#ff8080] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b42323] rounded"
              title={isBn ? 'সৌমিক — লিঙ্কডইন প্রোফাইল' : 'Soumik — LinkedIn Profile'}
              aria-label={isBn ? 'সৌমিক — লিঙ্কডইন প্রোফাইল' : 'Soumik — LinkedIn Profile'}
            >
              <span>{isBn ? 'সৌমিক' : 'Soumik'}</span>
              <Linkedin className="w-3 h-3 text-[#0a66c2] dark:text-[#70b5f9] inline-block shrink-0" aria-hidden="true" />
            </a>
            <span>{isBn ? ' ও ' : ' & '}</span>
            <a
              href="https://www.linkedin.com/in/moumita-shee-798505226/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#b42323] dark:text-[#e05656] hover:underline hover:text-[#961b1b] dark:hover:text-[#ff8080] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b42323] rounded"
              title={isBn ? 'মৌমিতা — লিঙ্কডইন প্রোফাইল' : 'Moumita — LinkedIn Profile'}
              aria-label={isBn ? 'মৌমিতা — লিঙ্কডইন প্রোফাইল' : 'Moumita — LinkedIn Profile'}
            >
              <span>{isBn ? 'মৌমিতা' : 'Moumita'}</span>
              <Linkedin className="w-3 h-3 text-[#0a66c2] dark:text-[#70b5f9] inline-block shrink-0" aria-hidden="true" />
            </a>
            <span className="ml-1 text-[#e02424] inline-block text-sm" role="img" aria-label="heart">❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
