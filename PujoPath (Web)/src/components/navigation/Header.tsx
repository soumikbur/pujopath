'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  ChevronDown,
  Download,
  Heart,
  Info,
  MessageSquare,
  Moon,
  Music2,
  Sparkles,
  Sun,
  Train,
  Users,
  Bell,
  Flame,
  Phone,
} from 'lucide-react';
import { NATIVE_APK_DOWNLOAD_URL } from '@/lib/config';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { useFestival } from '@/lib/context/FestivalContext';
import { InstallNativeAppModal } from './InstallNativeAppModal';
import { cn } from '@/lib/utils/cn';

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { savedPandalIds } = useFavorites();
  const { unreadCount } = useNotifications();
  const { activeFestival, isKali } = useFestival();
  const [moreOpen, setMoreOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isBn = locale === 'bn';

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close dropdown whenever the active route changes
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const primaryLinks = [
    { href: '/select-puja', label: isBn ? 'পূজা নির্বাচন' : 'Puja Selection' },
    { href: '/explore', label: isBn ? 'অন্বেষণ' : 'Explore' },
    { href: '/map', label: isBn ? 'মানচিত্র' : 'Map' },
    { href: '/planner', label: isBn ? 'রুট' : 'Plan' },
  ];

  const secondaryLinks = [
    { href: '/kali-puja', label: isBn ? 'শ্যামাপূজা ও বারাসাত' : 'Kali Puja & Barasat', icon: Flame },
    { href: '/notifications', label: isBn ? 'বিজ্ঞপ্তি' : 'Notifications', icon: Bell },
    { href: '/helpline', label: isBn ? 'জরুরি হেল্পলাইন' : 'Helpline', icon: Phone },
    { href: '/calendar', label: isBn ? 'ক্যালেন্ডার' : 'Calendar', icon: Calendar },
    { href: '/metro', label: isBn ? 'মেট্রো' : 'Metro', icon: Train },
    { href: '/music', label: isBn ? 'সঙ্গীত' : 'Music', icon: Music2 },
    { href: '/mahalaya', label: isBn ? 'মহালয়া' : 'Mahalaya', icon: Sparkles },
    { href: '/about', label: isBn ? 'সাহায্য' : 'Help', icon: Info },
    { href: '/feedback', label: isBn ? 'মতামত' : 'Feedback', icon: MessageSquare },
    { href: '/developer', label: isBn ? 'ডেভেলপার' : 'Developer', icon: Users },
  ];

  const isSecondaryActive = secondaryLinks.some((link) => pathname === link.href);

  return (
    <header className="sticky top-0 z-[1100] border-b border-[#eee8e1] dark:border-[#2a241f] bg-[#fcfaf7]/98 dark:bg-[#14110e]/98 backdrop-blur-md transition-colors duration-200 pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-1.5 sm:gap-3 px-2.5 sm:px-6">
        {/* Brand Logo & Active Festival Pill */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center text-lg sm:text-xl font-extrabold tracking-tight text-[#b42323] transition-transform active:scale-95 shrink-0"
            aria-label="PujoPath home"
          >
            <span>PujoPath</span>
          </Link>

          {/* Dedicated Festival Switcher Pill */}
          <Link
            href="/select-puja"
            className={cn(
              'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold border transition-all active:scale-95 shadow-xs shrink-0',
              isKali
                ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:border-purple-400'
                : 'bg-[#fdeeee] dark:bg-[#341b18] text-[#b42323] dark:text-[#ff8787] border-[#f6ceca] dark:border-[#532822] hover:border-pujo-red/50'
            )}
            title={isBn ? 'উৎসব নির্বাচন ও পরিবর্তন করুন' : 'Change festival experience'}
          >
            <span className="hidden min-[420px]:inline">{isKali ? (isBn ? '🪔 শ্যামাপূজা ▾' : '🪔 Kali Puja ▾') : (isBn ? '🌸 দুর্গাপূজা ▾' : '🌸 Durga Puja ▾')}</span>
            <span className="min-[420px]:hidden">{isKali ? '🪔' : '🌸'}</span>
          </Link>
        </div>

        {/* Desktop Primary Nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-xl px-3 py-2 text-sm font-bold transition-all duration-150',
                pathname === link.href
                  ? 'bg-[#f9e9e7] dark:bg-[#341b18] text-[#b42323]'
                  : 'text-[#625b55] dark:text-[#a89e95] hover:bg-[#f5f1ec] dark:hover:bg-[#201c18] hover:text-[#242424] dark:hover:text-[#EDE5DC]'
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* More Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="desktop-more-menu-button"
              onClick={() => setMoreOpen((open) => !open)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setMoreOpen(true);
                }
              }}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              aria-controls="desktop-more-menu"
              className={cn(
                'flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#b42323]',
                isSecondaryActive
                  ? 'bg-[#f9e9e7] dark:bg-[#341b18] text-[#b42323]'
                  : 'text-[#625b55] dark:text-[#a89e95] hover:bg-[#f5f1ec] dark:hover:bg-[#201c18] hover:text-[#242424] dark:hover:text-[#EDE5DC]'
              )}
            >
              <span>{isBn ? 'আরও' : 'More'}</span>
              <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', moreOpen && 'rotate-180')} />
            </button>

            {moreOpen && (
              <div
                id="desktop-more-menu"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="desktop-more-menu-button"
                style={{ backgroundColor: theme === 'dark' ? '#1a1613' : '#ffffff' }}
                className="absolute right-0 top-full mt-2 w-52 sm:w-56 rounded-2xl border border-[#ded4c8] dark:border-[#382e25] bg-white dark:bg-[#1a1613] p-1.5 shadow-2xl shadow-black/20 dark:shadow-black/70 z-[1200] max-h-[calc(100vh-5rem)] overflow-y-auto"
              >
                {secondaryLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors outline-none focus-visible:bg-[#f7f3ee] dark:focus-visible:bg-[#241f1a] focus-visible:ring-2 focus-visible:ring-[#b42323]',
                        isActive
                          ? 'bg-[#f9e9e7] dark:bg-[#341b18] text-[#b42323]'
                          : 'text-[#4a423d] dark:text-[#c4b9ae] hover:bg-[#f7f3ee] dark:hover:bg-[#241f1a]'
                      )}
                    >
                      <Icon className="h-4 w-4 text-[#b42323] shrink-0" aria-hidden="true" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls: Install App + Theme Switch + Language Switch + Saved Heart */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Install Native Android App Button */}
          <button
            id="install-app-header-btn"
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                const ua = navigator.userAgent || '';
                const isAndroid = /android/i.test(ua);
                if (isAndroid) {
                  // Direct download trigger for Android devices
                  const a = document.createElement('a');
                  a.href = NATIVE_APK_DOWNLOAD_URL;
                  a.download = 'PujoPath-Native.apk';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              }
              setInstallModalOpen(true);
            }}
            title={
              isBn
                ? 'নেটিভ অ্যান্ড্রয়েড অ্যাপ ইনস্টল করুন (APK)'
                : 'Install Native Android App (APK)'
            }
            aria-label={isBn ? 'নেটিভ অ্যান্ড্রয়েড অ্যাপ ইনস্টল করুন' : 'Install Native Android App'}
            className="flex items-center gap-1 sm:gap-1.5 h-9 px-2 sm:px-3 rounded-xl bg-[#b42323] hover:bg-[#971e1e] text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-150 active:scale-95 shrink-0 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{isBn ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
            <span className="hidden min-[360px]:inline sm:hidden">{isBn ? 'অ্যাপ' : 'App'}</span>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            role="switch"
            aria-checked={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e1d9] dark:border-[#332b24] text-[#625b55] dark:text-[#b4a99e] hover:bg-[#f5f1ec] dark:hover:bg-[#221c17] transition-all active:scale-95"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400 animate-in spin-in-180 duration-200" />
            ) : (
              <Moon className="h-4 w-4 text-[#625b55] animate-in spin-in-180 duration-200" />
            )}
          </button>

          {/* Language Switcher */}
          <div className="flex rounded-xl border border-[#e8e1d9] dark:border-[#332b24] p-0.5 text-xs font-bold">
            <button
              onClick={() => setLocale('en')}
              className={cn(
                'rounded-lg px-2 py-1 transition-all',
                locale === 'en'
                  ? 'bg-[#b42323] text-white shadow-sm'
                  : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white'
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLocale('bn')}
              className={cn(
                'rounded-lg px-2 py-1 transition-all',
                locale === 'bn'
                  ? 'bg-[#b42323] text-white shadow-sm'
                  : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424] dark:hover:text-white'
              )}
            >
              বাংলা
            </button>
          </div>

          {/* Saved Pandals Heart with Dynamic Counter Badge */}
          <Link
            href="/saved"
            aria-label={isBn ? 'সংরক্ষিত প্যান্ডেল' : 'Saved pandals'}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e1d9] dark:border-[#332b24] text-[#625b55] dark:text-[#b4a99e] hover:bg-[#f5f1ec] dark:hover:bg-[#221c17] hover:text-[#b42323] transition-all active:scale-95"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-transform',
                savedPandalIds.length > 0 && 'fill-[#b42323] text-[#b42323]'
              )}
            />
            {savedPandalIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#b42323] px-1 text-[10px] font-bold text-white shadow-sm">
                {savedPandalIds.length}
              </span>
            )}
          </Link>

          {/* Notifications Bell with Dynamic Unread Counter Badge */}
          <Link
            href="/notifications"
            aria-label={isBn ? 'উৎসব নোটিফিকেশন' : 'Festive notifications'}
            title={isBn ? 'বিজ্ঞপ্তি ও অ্যালার্ট' : 'Notifications & Alerts'}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e1d9] dark:border-[#332b24] text-[#625b55] dark:text-[#b4a99e] hover:bg-[#f5f1ec] dark:hover:bg-[#221c17] hover:text-[#b42323] transition-all active:scale-95"
          >
            <Bell
              className={cn(
                'h-4 w-4 transition-transform',
                unreadCount > 0 && 'text-[#b42323] dark:text-[#e05656]'
              )}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#b42323] px-1 text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Cross-Device Native Android App Installation Modal */}
      <InstallNativeAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
    </header>
  );
}
