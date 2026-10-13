'use client';

import { PhoneCall, ShieldCheck, Info, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';

export default function AboutPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const helplines = [
    { label: isBn ? 'কলকাতা পুলিশ কন্ট্রোল রুম' : 'Kolkata Police Emergency', number: '100 / 112', desc: isBn ? 'কেন্দ্রীয় জরুরি কন্ট্রোল রুম' : 'Central emergency response' },
    { label: isBn ? 'কলকাতা ট্রাফিক পুলিশ হেল্পলাইন' : 'Kolkata Traffic Police Helpline', number: '1073 / 033-2214-3644', desc: isBn ? 'রাস্তা ও ট্রাফিক আপডেট' : 'Traffic & road advisories' },
    { label: isBn ? 'মহিলা সুরক্ষা হেল্পলাইন' : 'Women Helpline', number: '1091 / 181', desc: isBn ? '২৪x৭ মহিলা সহায়তা ও নিরাপত্তা' : '24x7 special assistance for women' },
    { label: isBn ? 'অ্যাম্বুলেন্স ও জরুরি স্বাস্থ্য পরিষেবা' : 'Ambulance Emergency Services', number: '102 / 108', desc: isBn ? 'তাৎক্ষণিক জরুরি চিকিৎসা' : 'Immediate medical ambulance' },
    { label: isBn ? 'দমকল ও উদ্ধারকারী দল' : 'Fire & Rescue Services', number: '101', desc: isBn ? 'অগ্নি নির্বাপক ও উদ্ধার বিভাগ' : 'Fire rescue department' },
    { label: isBn ? 'মেট্রো রেলওয়ে হেল্পডেস্ক' : 'Kolkata Metro Rail Helpdesk', number: '033-2226-7285', desc: isBn ? 'মেট্রো যাতায়াত সহায়তা' : 'Metro transit helpline' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 text-[#b42323] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>{isBn ? 'তথ্য ও জরুরি হেল্পলাইন' : 'Safety & Assistance'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
          {isBn ? 'জরুরি হেল্পলাইন ও সুরক্ষা নির্দেশিকা' : 'Emergency Helplines & Safety Guide'}
        </h1>
        <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1">
          {isBn
            ? 'পুজো পরিক্রমার সময় যেকোনো প্রয়োজনে কলকাতা পুলিশ ও জরুরি সহায়তা নম্বরসমূহ।'
            : 'Official 24x7 emergency contacts and essential guidance for safe and smooth pandal hopping.'}
        </p>
      </div>

      {/* Directory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {helplines.map((item, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex items-start justify-between gap-4 transition-colors"
          >
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-[#242424] dark:text-[#ede5dc]">{item.label}</h3>
              <p className="text-xs text-[#776d65] dark:text-[#a89e95]">{item.desc}</p>
              <div className="text-base font-sans font-bold text-[#b42323] dark:text-[#e05656] pt-1">{item.number}</div>
            </div>

            <a
              href={`tel:${item.number.split('/')[0].trim()}`}
              className="p-3 rounded-2xl bg-[#fdeeee] dark:bg-[#341b18] text-[#b42323] dark:text-[#e05656] border border-[#f6ceca] dark:border-[#4a2420] hover:bg-[#b42323] hover:text-white transition-colors shrink-0 shadow-sm"
              title="হেল্পলাইনে কল করুন"
              aria-label={`Call ${item.label}`}
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

      {/* Safety Tips */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] space-y-3.5 text-sm text-[#4a423d] dark:text-[#c4b9ae] leading-relaxed transition-colors">
        <h3 className="text-base sm:text-lg font-bold text-[#242424] dark:text-[#ede5dc] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#b42323]" />
          <span>{isBn ? 'নিরাপদ পুজো পরিক্রমার পরামর্শ' : 'Essential Pandal Hopping Tips'}</span>
        </h3>
        <ul className="space-y-2 list-disc list-inside">
          <li>{isBn ? 'যানজট এড়াতে কলকাতা মেট্রোর ব্লু ও গ্রীন লাইন ব্যবহার করুন।' : 'Use the Kolkata Metro (Blue & Green lines) to travel between major hubs and bypass road traffic.'}</li>
          <li>{isBn ? 'শান্তিপূর্ণ দর্শনের জন্য সকালের সময় (সকাল ৮টা – দুপুর ১২টা) পুজো দেখতে যান।' : 'Visit high-crowd pandals during morning hours (8 AM – 12 PM) for minimal queues and peaceful Darshan.'}</li>
          <li>{isBn ? 'প্রচুর জল পান করুন এবং সাথে জলের বোতল রাখুন।' : 'Carry reusable water bottles and stay hydrated while hopping.'}</li>
          <li>{isBn ? 'জরুরি পরিস্থিতিতে নিকটস্থ কলকাতা পুলিশ "মে আই হেল্প ইউ" বুথে যোগাযোগ করুন।' : 'In case of overcrowding or emergency, reach out to the nearest Kolkata Police May I Help You kiosk.'}</li>
        </ul>
      </div>

      {/* Project Co-Creators */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] space-y-4 transition-colors">
        <div className="flex items-center gap-2 text-[#b42323] dark:text-[#e05656] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>{isBn ? 'প্রকল্পের সহ-নির্মাতা' : 'Project Co-Creators'}</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#242424] dark:text-[#ede5dc]">
            {isBn ? 'পুজোপথ — আমাদের উদ্যোগ' : 'About PujoPath'}
          </h2>
          <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1.5 leading-relaxed">
            {isBn
              ? 'পুজোপথ হলো সৌমিক ও মৌমিতার একটি যৌথ সৃষ্টি, যা মানুষকে কলকাতার দুর্গোৎসবের মণ্ডপ আবিষ্কার ও সুষ্ঠু পরিকল্পনা করতে সাহায্য করে।'
              : 'PujoPath is a collaborative project co-created by Soumik and Moumita to help people discover Kolkata\'s Durga Puja pandals and plan their festive experiences.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Soumik */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#faf7f2] dark:bg-[#201b17] border border-[#eee8e1] dark:border-[#2f2720] flex items-center justify-between gap-3 transition-colors">
            <div className="space-y-0.5">
              <div className="text-base font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'সৌমিক' : 'Soumik'}
              </div>
              <div className="text-xs font-semibold text-[#b42323] dark:text-[#e05656]">
                {isBn ? 'সহ-নির্মাতা' : 'Co-Creator'}
              </div>
            </div>
            <a
              href="https://www.linkedin.com/in/soumik-ghosh-883a1a22b/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#2a241f] text-[#665a54] dark:text-[#c4b9ae] border border-[#e5ded6] dark:border-[#3d332a] hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:border-[#0a66c2]/40 dark:hover:border-[#0a66c2]/50 hover:bg-[#f0f7ff] dark:hover:bg-[#1a2634] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b42323] shrink-0 select-none inline-flex items-center justify-center min-h-[32px]"
              title={isBn ? 'সৌমিকের লিঙ্কডইন প্রোফাইল দেখুন' : "View Soumik's LinkedIn profile"}
              aria-label={isBn ? 'সৌমিকের লিঙ্কডইন প্রোফাইল দেখুন' : "View Soumik's LinkedIn profile"}
            >
              {isBn ? 'সহ-নির্মাতা' : 'Co-Creator'}
            </a>
          </div>

          {/* Moumita */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#faf7f2] dark:bg-[#201b17] border border-[#eee8e1] dark:border-[#2f2720] flex items-center justify-between gap-3 transition-colors">
            <div className="space-y-0.5">
              <div className="text-base font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'মৌমিতা' : 'Moumita'}
              </div>
              <div className="text-xs font-semibold text-[#b42323] dark:text-[#e05656]">
                {isBn ? 'সহ-নির্মাতা' : 'Co-Creator'}
              </div>
            </div>
            <a
              href="https://www.linkedin.com/in/moumita-shee-798505226/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#2a241f] text-[#665a54] dark:text-[#c4b9ae] border border-[#e5ded6] dark:border-[#3d332a] hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:border-[#0a66c2]/40 dark:hover:border-[#0a66c2]/50 hover:bg-[#f0f7ff] dark:hover:bg-[#1a2634] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b42323] shrink-0 select-none inline-flex items-center justify-center min-h-[32px]"
              title={isBn ? 'মৌমিতার লিঙ্কডইন প্রোফাইল দেখুন' : "View Moumita's LinkedIn profile"}
              aria-label={isBn ? 'মৌমিতার লিঙ্কডইন প্রোফাইল দেখুন' : "View Moumita's LinkedIn profile"}
            >
              {isBn ? 'সহ-নির্মাতা' : 'Co-Creator'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
