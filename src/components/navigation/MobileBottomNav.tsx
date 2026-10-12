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
} from 'lucide-react';
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
    { href: '/calendar', label: isBn ? 'ক্যালেন্ডার' : 'Calendar', icon: Calendar },
    { href: '/metro', label: isBn ? 'মেট্রো গাইড' : 'Metro Guide', icon: Train },
    { href: '/music', label: isBn ? 'পুজোর সঙ্গীত' : 'Puja Music', icon: Music2 },
    { href: '/mahalaya', label: isBn ? 'মহালয়া বিশেষ' : 'Mahalaya Special', icon: Sparkles },
    { href: '/saved', label: isBn ? 'সংরক্ষিত প্যান্ডেল' : 'Saved Pandals', icon: Heart },
    { href: '/about', label: isBn ? 'হেল্পলাইন' : 'Helpline', icon: Info },
  ];

  return (
    <>
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-[1100] bg-white dark:bg-[#181411] border-t border-[#eee8e1] dark:border-[#2a241f] px-3 py-2 pb-safe shadow-elevated transition-colors duration-200"
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
                  'flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-2 rounded-xl transition-all duration-150 relative select-none',
                  isActive
                    ? 'text-pujo-red font-bold scale-105'
                    : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-[#ede5dc]'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'stroke-[2.4]' : 'stroke-[1.8]')} />
                <span className="text-[11px] font-bold tracking-tight mt-0.5">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-pujo-red mt-0.5" />
                )}
              </Link>
            );
          })}

          {/* More trigger */}
          <button
            onClick={() => setMoreOpen(true)}
            aria-label="More navigation options"
            aria-expanded={moreOpen}
            className={cn(
              'flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-2 rounded-xl transition-all select-none',
              moreOpen
                ? 'text-pujo-red font-bold'
                : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-[#ede5dc]'
            )}
          >
            <MoreHorizontal className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[11px] font-bold tracking-tight mt-0.5">{isBn ? 'আরও' : 'More'}</span>
          </button>
        </div>
      </nav>

      {/* More Drawer */}
      {moreOpen && (
        <div className="fixed inset-0 z-[1300] flex flex-col justify-end md:hidden bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#181411] border-t border-[#eee8e1] dark:border-[#2a241f] rounded-t-3xl p-6 space-y-4 shadow-elevated max-h-[80vh] overflow-y-auto">
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

            <div className="grid grid-cols-2 gap-3 pb-6">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'p-3.5 rounded-2xl flex items-center gap-3 border transition-colors',
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
          </div>
        </div>
      )}
    </>
  );
}
