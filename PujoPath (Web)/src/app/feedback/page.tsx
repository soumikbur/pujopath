'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, ExternalLink, Bug, Lightbulb, HeartHandshake, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';

export default function FeedbackPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const topics = [
    {
      icon: Bug,
      title: isBn ? 'তথ্য সংশোধন বা বাগ রিপোর্ট' : 'Report an Issue / Bug',
      desc: isBn
        ? 'কোনো মণ্ডপের সময়সূচী, অবস্থান বা তথ্যে ত্রুটি থাকলে আমাদের জানান।'
        : 'Spotted an incorrect timing, location issue, or broken feature? Let us know so we can fix it.',
    },
    {
      icon: Lightbulb,
      title: isBn ? 'নতুন সুবিধার প্রস্তাব' : 'Feature Suggestions',
      desc: isBn
        ? 'পুজোপথকে আরও উপযোগী করতে আপনার নতুন ধারণা বা পরামর্শ শেয়ার করুন।'
        : 'Have ideas for new filters, transit enhancements, or interactive tools for pandal hoppers?',
    },
    {
      icon: HeartHandshake,
      title: isBn ? 'সহযোগিতা ও তথ্য সংযোজন' : 'Community Collaboration',
      desc: isBn
        ? 'আপনার এলাকার পুজো বা নিজস্ব আলোকচিত্র যুক্ত করার জন্য যোগাযোগ করুন।'
        : 'Want to contribute photographs, club details, or community itineraries? Connect with us.',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-14 px-1">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#0a66c2] dark:text-[#70b5f9] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>{isBn ? 'মতামত ও পরামর্শ' : 'Feedback & Suggestions'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isBn ? 'আপনার মূল্যবান মতামত জানান' : 'Share Your Feedback'}
        </h1>
        <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1.5 leading-relaxed max-w-2xl">
          {isBn
            ? 'পুজোপথকে আরও সমৃদ্ধ ও নিখুঁত করতে আপনার যেকোনো পরামর্শ বা প্রতিক্রিয়া সরাসরি ইমেলের মাধ্যমে আমাদের পাঠাতে পারেন।'
            : 'Have suggestions, corrections, or new features to suggest? Send your feedback directly via email.'}
        </p>
      </div>

      {/* Main Feedback Hero Card */}
      <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#f0f7ff] via-white to-[#e8f2ff] dark:from-[#132233] dark:via-[#161d24] dark:to-[#101a24] border border-[#0a66c2]/30 dark:border-[#0a66c2]/40 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a66c2]/10 dark:bg-[#0a66c2]/25 text-[#0a66c2] dark:text-[#70b5f9] text-xs font-bold">
            <Mail className="w-3.5 h-3.5" />
            <span>{isBn ? 'সরাসরি ইমেল' : 'Direct Email'}</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1a2b3c] dark:text-[#e4edf7] tracking-tight">
            {isBn ? 'ইমেলের মাধ্যমে মতামত পাঠান' : 'Send Feedback via Email'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4d5e70] dark:text-[#a4b4c6] leading-relaxed">
            {isBn
              ? 'আমরা নিয়মিত প্রতিটি ইমেল পর্যালোচনা করি। বোতামে চাপ দিলে আপনার ডিভাইসে সরাসরি soumik.bur@gmail.com ঠিকানায় ইমেল কম্পোজ উইন্ডো খুলবে।'
              : 'Messages go directly to soumik.bur@gmail.com. We review all feedback, pandal updates, and community suggestions promptly.'}
          </p>
        </div>

        <a
          id="feedback-btn"
          href="mailto:soumik.bur@gmail.com?subject=PujoPath%20Feedback"
          aria-label={isBn ? 'ইমেলে মতামত দিন' : 'Send feedback via email'}
          title={isBn ? 'soumik.bur@gmail.com ঠিকানায় ইমেল পাঠান' : 'Send email to soumik.bur@gmail.com'}
          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <Mail className="w-4 h-4" />
          <span>{isBn ? 'ইমেল পাঠান (Send Email)' : 'Send Feedback Email'}</span>
          <ExternalLink className="w-4 h-4 ml-0.5" />
        </a>
      </div>

      {/* Suggested Topics Grid */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95] px-1">
          {isBn ? 'মতামতের বিষয়সমূহ' : 'What You Can Share'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topics.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-xs space-y-2"
              >
                <div className="w-9 h-9 rounded-xl bg-[#faf7f2] dark:bg-[#251e18] border border-[#eee8e1] dark:border-[#382e25] flex items-center justify-center text-[#b42323] dark:text-[#e05656]">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#242424] dark:text-[#ede5dc]">{t.title}</h4>
                <p className="text-xs text-[#665a54] dark:text-[#a89e95] leading-relaxed">{t.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meet Developers Cross-Link */}
      <div className="p-6 rounded-3xl bg-[#faf7f2] dark:bg-[#1f1a16] border border-[#eee8e1] dark:border-[#2f2720] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#b42323] dark:text-[#e05656] text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>{isBn ? 'প্রকল্পের দল' : 'Project Creators'}</span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-[#242424] dark:text-[#ede5dc]">
            {isBn ? 'পুজোপথ ডেভেলপারদের পরিচয় জানতে চান?' : 'Want to meet the creators behind PujoPath?'}
          </h4>
          <p className="text-xs text-[#776d65] dark:text-[#a89e95]">
            {isBn
              ? 'আমাদের ডেডিকেটেড ডেভেলপার পেজে গিয়ে সৌমিক ও মৌমিতার প্রোফাইল দেখুন।'
              : 'Learn more about Soumik and Moumita and explore their professional profiles.'}
          </p>
        </div>

        <Link
          href="/developer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#2b241e] border border-[#ded4c8] dark:border-[#3f342a] text-xs sm:text-sm font-bold text-[#242424] dark:text-[#ede5dc] hover:text-[#b42323] dark:hover:text-[#e05656] shadow-xs transition-all shrink-0"
        >
          <Users className="w-4 h-4 text-[#b42323]" />
          <span>{isBn ? 'ডেভেলপার পেজ দেখুন' : 'Meet Developers'}</span>
        </Link>
      </div>
    </div>
  );
}
