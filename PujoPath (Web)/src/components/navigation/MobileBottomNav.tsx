'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  MapPin,
  Route,
  MoreHorizontal,
  Train,
  Calendar,
  Music2,
  Sparkles,
  Heart,
  Info,
  X,
  MessageSquare,
  Users,
  Bell,
  Flame,
  Phone,
  Download,
} from 'lucide-react';
import { NATIVE_APK_DOWNLOAD_URL } from '@/lib/config';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils/cn';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const [moreOpen, setMoreOpen] = useState(false);

  // Close drawer on route change or Escape key
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMoreOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mainItems = [
    { href: '/', label: isBn ? 'হোম' : 'Home', icon: Home },
    { href: '/explore', label: isBn ? 'অন্বেষণ' : 'Explore', icon: Compass },
    { href: '/map', label: isBn ? 'মানচিত্র' : 'Map', icon: MapPin },
    { href: '/planner', label: isBn ? 'পরিকল্পনা' : 'Planner', icon: Route },
  ];

  const secondaryItems = [
    { href: '/select-puja', label: isBn ? 'পূজা নির্বাচন' : 'Puja Selection', icon: Sparkles },
    { href: '/kali-puja', label: isBn ? 'শ্যামাপূজা ও বারাসাত' : 'Kali Puja & Barasat', icon: Flame },
    { href: '/notifications', label: isBn ? 'বিজ্ঞপ্তি ও অ্যালার্ট' : 'Notifications', icon: Bell },
    { href: '/helpline', label: isBn ? 'জরুরি হেল্পলাইন' : 'Helpline', icon: Phone },
    { href: '/calendar', label: isBn ? 'ক্যালেন্ডার' : 'Calendar', icon: Calendar },
    { href: '/metro', label: isBn ? 'মেট্রো গাইড' : 'Metro Guide', icon: Train },
    { href: '/music', label: isBn ? 'পুজোর সঙ্গীত' : 'Puja Music', icon: Music2 },
    { href: '/mahalaya', label: isBn ? 'মহালয়া বিশেষ' : 'Mahalaya Special', icon: Sparkles },
    { href: '/about', label: isBn ? 'সাহায্য ও তথ্য' : 'Help', icon: Info },
    { href: '/feedback', label: isBn ? 'মতামত' : 'Feedback', icon: MessageSquare },
    { href: '/developer', label: isBn ? 'ডেভেলপার' : 'Developer', icon: Users },
    { href: '/saved', label: isBn ? 'সংরক্ষিত প্যান্ডেল' : 'Saved Pandals', icon: Heart },
  ];

  return (
    <>
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-[1100] bg-white dark:bg-[#181411] border-t border-[#eee8e1] dark:border-[#2a241f] px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-elevated transition-colors duration-200"
      >
        <div className="flex items-center justify-around max-w-sm mx-auto">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl relative select-none transition-all duration-150 ease-out active:scale-[0.93] active:bg-[#f6eee3] dark:active:bg-[#251f1a]',
                  isActive
                    ? 'text-pujo-red font-bold bg-[#fdeeee]/50 dark:bg-[#341b18]/50'
                    : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-[#ede5dc] hover:bg-[#f8f4ef] dark:hover:bg-[#201c18]'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-transform duration-200 ease-out', isActive ? 'stroke-[2.4]' : 'stroke-[1.8]')} />
                <span className="text-[11px] font-bold tracking-tight mt-0.5 transition-colors duration-200">{item.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'w-1.5 h-1.5 rounded-full bg-pujo-red mt-0.5 transition-all duration-200 ease-out',
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                  )}
                />
              </Link>
            );
          })}

          {/* More trigger */}
          <button
            onClick={() => setMoreOpen(true)}
            aria-label="More navigation options"
            aria-expanded={moreOpen}
            className={cn(
              'flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl relative select-none transition-all duration-150 ease-out active:scale-[0.93] active:bg-[#f6eee3] dark:active:bg-[#251f1a]',
              moreOpen
                ? 'text-pujo-red font-bold bg-[#fdeeee]/50 dark:bg-[#341b18]/50'
                : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-[#ede5dc] hover:bg-[#f8f4ef] dark:hover:bg-[#201c18]'
            )}
          >
            <MoreHorizontal className="w-5 h-5 stroke-[1.8] transition-transform duration-200" />
            <span className="text-[11px] font-bold tracking-tight mt-0.5 transition-colors duration-200">{isBn ? 'আরও' : 'More'}</span>
            <span aria-hidden="true" className="w-1.5 h-1.5 mt-0.5 opacity-0" />
          </button>
        </div>
      </nav>

      {/* More Drawer */}
      {moreOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isBn ? 'অন্যান্য সুবিধাসমূহ' : 'More Features'}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMoreOpen(false);
          }}
          className="fixed inset-0 z-[1300] flex flex-col justify-end lg:hidden bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white dark:bg-[#181411] border-t border-[#eee8e1] dark:border-[#2a241f] rounded-t-3xl p-6 space-y-4 shadow-elevated max-h-[80vh] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#eee8e1] dark:border-[#2a241f] pb-3">
              <h3 className="font-bold text-base text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'অন্যান্য সুবিধাসমূহ' : 'More Features'}
              </h3>
              <button
                onClick={() => setMoreOpen(false)}
                aria-label="Close features drawer"
                className="p-1.5 rounded-lg text-[#776d65] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-2">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'p-3.5 rounded-2xl flex items-center gap-3 border transition-all duration-100 ease-out active:scale-[0.96]',
                      isActive
                        ? 'bg-[#fdeeee] dark:bg-[#341b18] border-[#f6ceca] dark:border-[#4a2420] text-[#d52f2f] dark:text-[#e05656]'
                        : 'bg-[#fcfaf7] dark:bg-[#201c18] border-[#eee8e1] dark:border-[#2a241f] text-[#4a423d] dark:text-[#c4b9ae] hover:text-[#242424] dark:hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4 text-[#b42323] dark:text-[#e05656] shrink-0" />
                    <span className="text-xs sm:text-sm font-bold">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions: Install Native App & Feedback */}
            <div className="pt-2 border-t border-[#eee8e1] dark:border-[#2a241f] space-y-2">
              <a
                href={NATIVE_APK_DOWNLOAD_URL}
                download="PujoPath-Native.apk"
                onClick={() => setMoreOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-2xl bg-pujo-red hover:bg-[#991b1b] text-white font-bold text-xs shadow-sm transition-all active:scale-95 text-center"
                title={isBn ? 'নেটিভ অ্যান্ড্রয়েড অ্যাপ ডাউনলোড করুন (APK)' : 'Download Native Android App (APK)'}
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'নেটিভ অ্যান্ড্রয়েড অ্যাপ ইনস্টল (১১৪ MB)' : 'Install Native Android App (114 MB)'}</span>
              </a>

              <Link
                href="/feedback"
                onClick={() => setMoreOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-2xl bg-[#f0f7ff] dark:bg-[#1a2634] text-[#0a66c2] dark:text-[#70b5f9] border border-[#0a66c2]/30 dark:border-[#0a66c2]/40 font-bold text-xs hover:bg-[#0a66c2] hover:text-white transition-colors shadow-sm"
                title={isBn ? 'মতামত ও পরামর্শ দিন' : 'Share Feedback & Suggestions'}
                aria-label={isBn ? 'মতামত পেজে যান' : 'Go to feedback page'}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'মতামত জানান (Feedback)' : 'Share Feedback'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
