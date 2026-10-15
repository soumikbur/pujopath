'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Sparkles, MessageSquare, ExternalLink, Code2, Layout } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { getAssetPath } from '@/lib/utils/asset';

export default function DeveloperPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const [soumikImgError, setSoumikImgError] = useState(false);
  const [moumitaImgError, setMoumitaImgError] = useState(false);

  const soumikResponsibilities = isBn
    ? [
        'ব্যাকএন্ড আর্কিটেকচার',
        'কোর অ্যাপ্লিকেশন লজিক',
        'সিস্টেম আর্কিটেকচার',
        'রুট অপ্টিমাইজেশন অ্যালগরিদম',
        'অফলাইন ট্রানজিট সিস্টেম',
        'ব্যাকএন্ড ইন্টিগ্রেশন',
        'পারফরম্যান্স ও নির্ভরযোগ্যতা',
      ]
    : [
        'Backend Architecture',
        'Core Application Logic',
        'System Architecture',
        'Route Optimization Algorithms',
        'Offline-First Transit',
        'Backend Integrations',
        'Performance & Reliability',
      ];

  const moumitaResponsibilities = isBn
    ? [
        'ইউজার ইন্টারফেস ডিজাইন',
        'ফ্রন্টএন্ড আর্কিটেকচার',
        'রেসপনসিভ লেআউট',
        'ইউজার এক্সপেরিয়েন্স (UX)',
        'ভিজ্যুয়াল নান্দনিকতা',
        'সাংস্কৃতিক কিউরেশন',
        'ইন্টারঅ্যাকশন ডিজাইন',
      ]
    : [
        'User Interface Design',
        'Frontend Architecture',
        'Responsive Layouts',
        'User Experience (UX)',
        'Visual Consistency',
        'Cultural Curation',
        'Frontend Interaction Design',
      ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-14 px-1">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-[#b42323] dark:text-[#e05656] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>{isBn ? 'প্রকল্পের সহ-নির্মাতা' : 'Project Co-Creators'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isBn ? 'পুজোপথ ডেভেলপার ও নির্মাতা' : 'Meet the Developers'}
        </h1>
        <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1.5 leading-relaxed max-w-2xl">
          {isBn
            ? 'পুজোপথ হলো সৌমিক ও মৌমিতার একটি যৌথ সৃষ্টি, যা মানুষকে কলকাতার দুর্গোৎসবের মণ্ডপ আবিষ্কার ও সুষ্ঠু পরিকল্পনা করতে সাহায্য করে।'
            : 'PujoPath is a collaborative project co-created by Soumik and Moumita to help people discover Kolkata\'s Durga Puja pandals and plan their festive experiences.'}
        </p>
      </div>

      {/* Developer Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Card 1: Moumita */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex flex-col justify-between gap-6 transition-all hover:border-[#b42323]/30">
          <div className="space-y-4">
            <div className="flex items-start gap-4 sm:gap-5">
              {/* Profile Picture with Fallback Avatar */}
              <div className="relative shrink-0">
                {!moumitaImgError ? (
                  <img
                    src={getAssetPath('/images/developers/moumita.jpg')}
                    alt={isBn ? 'মৌমিতা' : 'Moumita'}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#b42323]/25 dark:border-[#e05656]/30 shadow-md"
                    onError={() => setMoumitaImgError(true)}
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#c93b3b] via-[#a32222] to-[#691111] text-white flex items-center justify-center font-black text-2xl sm:text-3xl border-2 border-[#b42323]/30 shadow-md">
                    M
                  </div>
                )}
                <span className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-[#faf7f2] dark:bg-[#251e18] border border-[#eee8e1] dark:border-[#3d332a] text-[#b42323] dark:text-[#e05656] shadow-xs">
                  <Layout className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Title & Role */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fdeeee] dark:bg-[#341b18] text-[#b42323] dark:text-[#e05656] text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>{isBn ? 'সহ-নির্মাতা' : 'Co-Creator'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
                  {isBn ? 'মৌমিতা' : 'Moumita'}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-[#b42323] dark:text-[#e05656]">
                  {isBn ? 'ইউআই ও ফ্রন্টএন্ড লিড' : 'UI & Frontend Lead'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5a504a] dark:text-[#b5aaa0] leading-relaxed">
              {isBn
                ? 'ইউজার ইন্টারফেস ডিজাইন, ফ্রন্টএন্ড আর্কিটেকচার, রেসপনসিভ লেআউট, ইউজার এক্সপেরিয়েন্স, ভিজ্যুয়াল নান্দনিকতা ও ইন্টারঅ্যাকশন ডিজাইনের পাশাপাশি কলকাতার শতাব্দীপ্রাচীন বনেদি বাড়ি ও ঐতিহ্যবাহী মণ্ডপের সাংস্কৃতিক তথ্য কিউরেশনে নেতৃত্ব দিচ্ছেন।'
                : 'Directs user interface design, frontend architecture, responsive layouts, user experience, visual consistency, and interaction design, alongside research and curation of Kolkata\'s historic Bonedi Bari traditions and cultural festival narratives.'}
            </p>

            {/* Responsibilities Chips */}
            <div className="pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8a7f76] dark:text-[#7f746b] mb-2">
                {isBn ? 'দায়িত্বসমূহ' : 'Key Responsibilities'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {moumitaResponsibilities.map((resp, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#f7f3ee] dark:bg-[#251e18] text-[#554b44] dark:text-[#c4b9ae] border border-[#e8dfd5] dark:border-[#382e25]"
                  >
                    {resp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Link to LinkedIn */}
          <div className="pt-3 border-t border-[#f2ece4] dark:border-[#27211c] flex items-center justify-between">
            <span className="text-xs text-[#8a7f76] dark:text-[#7f746b]">
              {isBn ? 'পেশাদার প্রোফাইল' : 'Professional Profile'}
            </span>
            <a
              href="https://www.linkedin.com/in/moumita-shee-798505226/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isBn ? 'মৌমিতার লিঙ্কডইন প্রোফাইল দেখুন' : "View Moumita's LinkedIn profile"}
              title={isBn ? 'মৌমিতার লিঙ্কডইন প্রোফাইল দেখুন' : "View Moumita's LinkedIn profile"}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isBn ? 'লিঙ্কডইন' : 'LinkedIn'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card 2: Soumik */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex flex-col justify-between gap-6 transition-all hover:border-[#b42323]/30">
          <div className="space-y-4">
            <div className="flex items-start gap-4 sm:gap-5">
              {/* Profile Picture with Fallback */}
              <div className="relative shrink-0">
                {!soumikImgError ? (
                  <img
                    src={getAssetPath('/images/developers/soumik.jpg')}
                    alt={isBn ? 'সৌমিক' : 'Soumik'}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#b42323]/25 dark:border-[#e05656]/30 shadow-md"
                    onError={() => setSoumikImgError(true)}
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#b42323] to-[#801414] text-white flex items-center justify-center font-black text-2xl sm:text-3xl border-2 border-[#b42323]/30 shadow-md">
                    S
                  </div>
                )}
                <span className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-[#faf7f2] dark:bg-[#251e18] border border-[#eee8e1] dark:border-[#3d332a] text-[#b42323] dark:text-[#e05656] shadow-xs">
                  <Code2 className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Title & Role */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fdeeee] dark:bg-[#341b18] text-[#b42323] dark:text-[#e05656] text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>{isBn ? 'সহ-নির্মাতা' : 'Co-Creator'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight">
                  {isBn ? 'সৌমিক' : 'Soumik'}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-[#b42323] dark:text-[#e05656]">
                  {isBn ? 'ব্যাকএন্ড ও সিস্টেমস লিড' : 'Backend & Systems Lead'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5a504a] dark:text-[#b5aaa0] leading-relaxed">
              {isBn
                ? 'পুজোপথের ব্যাকএন্ড আর্কিটেকচার, কোর অ্যাপ্লিকেশন লজিক, রুট অপ্টিমাইজেশন অ্যালগরিদম, অফলাইন-ফার্স্ট ট্রানজিট সিস্টেম, ব্যাকএন্ড ইন্টিগ্রেশন এবং অ্যাপ্লিকেশনের পারফরম্যান্স ও নির্ভরযোগ্যতা পরিচালনায় নেতৃত্ব দিচ্ছেন।'
                : 'Directs backend & systems architecture, core application logic, route optimization algorithms, offline-first transit functionality, backend integrations, and platform performance & reliability.'}
            </p>

            {/* Responsibilities Chips */}
            <div className="pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8a7f76] dark:text-[#7f746b] mb-2">
                {isBn ? 'দায়িত্বসমূহ' : 'Key Responsibilities'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {soumikResponsibilities.map((resp, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#f7f3ee] dark:bg-[#251e18] text-[#554b44] dark:text-[#c4b9ae] border border-[#e8dfd5] dark:border-[#382e25]"
                  >
                    {resp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Link to LinkedIn */}
          <div className="pt-3 border-t border-[#f2ece4] dark:border-[#27211c] flex items-center justify-between">
            <span className="text-xs text-[#8a7f76] dark:text-[#7f746b]">
              {isBn ? 'পেশাদার প্রোফাইল' : 'Professional Profile'}
            </span>
            <a
              href="https://www.linkedin.com/in/soumik-ghosh-883a1a22b/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isBn ? 'সৌমিকের লিঙ্কডইন প্রোফাইল দেখুন' : "View Soumik's LinkedIn profile"}
              title={isBn ? 'সৌমিকের লিঙ্কডইন প্রোফাইল দেখুন' : "View Soumik's LinkedIn profile"}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isBn ? 'লিঙ্কডইন' : 'LinkedIn'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Share Feedback CTA Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#faf7f2] via-white to-[#f5efe7] dark:from-[#1d1814] dark:via-[#1a1613] dark:to-[#171310] border border-[#eee8e1] dark:border-[#2f2720] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#0a66c2] dark:text-[#70b5f9] text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>{isBn ? 'মতামত ও প্রতিক্রিয়া' : 'Feedback & Suggestions'}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc]">
            {isBn ? 'ডেভেলপারদের মতামত জানাতে চান?' : 'Have feedback or suggestions for the team?'}
          </h3>
          <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95]">
            {isBn
              ? 'যেকোনো প্রযুক্তিগত পরামর্শ, ফিচার অনুরোধ বা বাগ রিপোর্ট পাঠাতে আমাদের ফিডব্যাক পেজ ব্যবহার করুন।'
              : 'Share ideas, report bugs, or request features directly via our dedicated feedback channel.'}
          </p>
        </div>

        <Link
          href="/feedback"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isBn ? 'মতামত দিন' : 'Share Feedback'}</span>
        </Link>
      </div>
    </div>
  );
}
