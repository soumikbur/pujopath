'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Shield, AlertCircle, HeartPulse, Flame, Users, AlertTriangle, Send, Mail, ExternalLink, LifeBuoy } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';

interface HelplineItem {
  name: string;
  nameBn: string;
  phone: string;
  desc: string;
  descBn: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
}

export default function HelplinePage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const helplines: HelplineItem[] = [
    {
      name: 'Kolkata Police Emergency',
      nameBn: 'কলকাতা পুলিশ কন্ট্রোল রুম',
      phone: '100',
      desc: '24/7 Police emergency assistance & incident response',
      descBn: '২৪ ঘণ্টা পুলিশ জরুরি সহায়তা ও তাৎক্ষণিক প্রতিক্রিয়া',
      icon: Shield,
      color: '#dc2626',
      badgeBg: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50',
    },
    {
      name: 'National Emergency Number',
      nameBn: 'জাতীয় জরুরি নম্বর',
      phone: '112',
      desc: 'Unified all-in-one emergency dispatch (Police, Fire, Ambulance)',
      descBn: 'একক জাতীয় জরুরি সেবা (পুলিশ, দমকল ও অ্যাম্বুলেন্স)',
      icon: AlertCircle,
      color: '#e11d48',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
    },
    {
      name: 'Ambulance & Medical Emergency',
      nameBn: 'অ্যাম্বুলেন্স ও স্বাস্থ্য জরুরি সেবা',
      phone: '102',
      desc: 'Urgent medical aid & rapid hospital transport',
      descBn: 'জরুরি চিকিৎসা ও নিকটবর্তী হাসপাতালে দ্রুত পরিবহন',
      icon: HeartPulse,
      color: '#059669',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
    },
    {
      name: 'Fire Brigade Service',
      nameBn: 'দমকল ও অগ্নিনির্বাপক বাহিনী',
      phone: '101',
      desc: 'Fire fighting, electrical hazard response & rescue',
      descBn: 'অগ্নিনির্বাপণ, বৈদ্যুতিক ঝুঁকি ও নাগরিক উদ্ধার কাজ',
      icon: Flame,
      color: '#ea580c',
      badgeBg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50',
    },
    {
      name: 'Women Safety Helpline',
      nameBn: 'মহিলা হেল্পলাইন',
      phone: '1090',
      desc: 'Dedicated round-the-clock women safety & rapid intervention',
      descBn: 'সার্বক্ষণিক নারী নিরাপত্তা ও দ্রুত পুলিশি সহায়তা',
      icon: LifeBuoy,
      color: '#9333ea',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50',
    },
    {
      name: 'Disaster Management Helpline',
      nameBn: 'দুর্যোগ মোকাবিলা দপ্তর',
      phone: '1070',
      desc: 'Severe weather alert, crowd control & civil rescue',
      descBn: 'প্রাকৃতিক দুর্যোগ, ভিড় নিয়ন্ত্রণ ও উদ্ধার ব্যবস্থাপনা',
      icon: AlertTriangle,
      color: '#d97706',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    },
    {
      name: 'Childline Support',
      nameBn: 'চাইল্ডলাইন সহায়তা',
      phone: '1098',
      desc: 'Protection and rapid reunification for lost children in crowds',
      descBn: 'পূজায় হারিয়ে যাওয়া শিশুদের দ্রুত উদ্ধার ও পরিবারে প্রত্যর্পণ',
      icon: Users,
      color: '#2563eb',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-14 px-1">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2 text-[#b42323] dark:text-[#e05656] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Phone className="w-4 h-4" />
          <span>{isBn ? 'জরুরি সহায়তা ডিরেক্টরি' : 'Emergency Directory'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isBn ? 'জরুরি পূজা হেল্পলাইন' : 'Emergency Helplines'}
        </h1>
        <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1.5 leading-relaxed max-w-2xl">
          {isBn
            ? 'কলকাতায় পূজা দর্শনের সময় যেকোনো দুর্ঘটনা, চিকিৎসা বা পুলিশি সহায়তার জন্য সরাসরি এক ক্লিকে কল করুন।'
            : 'Direct one-tap dialing and contact information for Kolkata police, medical, fire, and child protection services during Durga Puja.'}
        </p>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {helplines.map((item, idx) => {
          const Icon = item.icon;
          const name = isBn ? item.nameBn : item.name;
          const desc = isBn ? item.descBn : item.desc;

          return (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${item.color}15`,
                    borderColor: `${item.color}35`,
                    color: item.color,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc] truncate">
                    {name}
                  </h2>
                  <p className="text-xs text-[#665a54] dark:text-[#a89e95] mt-1 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#f2ece4] dark:border-[#27211c] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8a7f76] dark:text-[#7f746b]">
                  {isBn ? 'টোল-ফ্রি ২৪×৭' : '24x7 Toll-Free'}
                </span>
                <a
                  href={`tel:${item.phone}`}
                  aria-label={`${isBn ? 'কল করুন' : 'Call'} ${name} on ${item.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.03] active:scale-[0.98]"
                  style={{ backgroundColor: item.color }}
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>{item.phone}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Guidelines Card */}
      <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#fffdf8] to-[#faf3e3] dark:from-[#211a12] dark:to-[#1a140d] border border-[#f0d68a]/50 dark:border-[#f0d68a]/20 shadow-card space-y-4">
        <div className="flex items-center gap-2.5 text-[#b45309] dark:text-[#f59e0b] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" />
          <span>{isBn ? 'পূজা দর্শনে বিশেষ নিরাপত্তা পরামর্শ' : 'Puja Safety Guidelines'}</span>
        </div>
        <h3 className="text-xl font-black text-[#242424] dark:text-[#ede5dc]">
          {isBn ? 'ভিড়ে নিরাপদে প্যান্ডেল হপিং করুন' : 'Stay Safe in Festive Crowds'}
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-[#5f5148] dark:text-[#cfc3b8] leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b45309] dark:bg-[#f59e0b] mt-1.5 shrink-0" />
            <span>
              {isBn
                ? 'শিশুদের পকেটে অভিভাবকের নাম ও ফোন নম্বর লিখে রাখা ব্যাজ বা কার্ড সাথে রাখুন।'
                : 'Keep an ID card or contact number tag in children’s pockets in heavy pandal crowds.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b45309] dark:bg-[#f59e0b] mt-1.5 shrink-0" />
            <span>
              {isBn
                ? 'ভিড় এড়াতে মধ্যরাত (১২টা থেকে ভোর ৪টা) বা সকালের শান্ত সময় ব্যবহার করুন।'
                : 'Take advantage of early morning or midnight hopping to avoid rush hours.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b45309] dark:bg-[#f59e0b] mt-1.5 shrink-0" />
            <span>
              {isBn
                ? 'কলকাতা মেট্রোর বিশেষ সারারাত সার্ভিস ও নির্ধারিত এক্সিট গেট ব্যবহার করুন।'
                : 'Use Kolkata Metro’s dedicated overnight festive train network and designated exit gates.'}
            </span>
          </li>
        </ul>
      </div>

      {/* Community Feedback Cross-Link */}
      <div className="p-7 sm:p-8 rounded-3xl bg-[#f0f7ff] dark:bg-[#132233] border border-[#0a66c2]/30 dark:border-[#0a66c2]/40 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-[#0a66c2] dark:text-[#70b5f9] text-xs font-bold uppercase tracking-wider">
            <Send className="w-3.5 h-3.5" />
            <span>{isBn ? 'মতামত ও পরামর্শ' : 'Feedback & Suggestions'}</span>
          </div>
          <h4 className="text-lg font-bold text-[#1a2b3c] dark:text-[#e4edf7]">
            {isBn ? 'অন্য কোনো জরুরি নম্বর যোগ করতে চান?' : 'Have feedback or a new helpline to add?'}
          </h4>
          <p className="text-xs sm:text-sm text-[#4d5e70] dark:text-[#a4b4c6] leading-relaxed">
            {isBn
              ? 'পুজোপথকে আরও উপযোগী করতে আপনার পরামর্শ সরাসরি আমাদের ডেভেলপারকে লিঙ্কডইন বা ইমেলে জানান।'
              : 'Help keep PujoPath accurate and complete. Reach out to the developer directly via LinkedIn messaging or email.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/feedback"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{isBn ? 'মতামত দিন' : 'Share Feedback'}</span>
          </Link>
          <a
            href="https://www.linkedin.com/in/soumik-ghosh-883a1a22b/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white dark:bg-[#1f2f42] border border-[#cbdff2] dark:border-[#253f59] text-[#0a66c2] dark:text-[#70b5f9] font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <span>LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
