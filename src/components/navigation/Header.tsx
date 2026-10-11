'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  ChevronDown,
  Heart,
  Info,
  Menu,
  Moon,
  Music2,
  Sparkles,
  Sun,
  Train,
  X,
} from 'lucide-react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils/cn';

export function Header() {
  const pathname = usePathname();
  const { locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { savedPandalIds } = useFavorites();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        setMobileMenuOpen(false);
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

  // Close dropdown and mobile menu whenever the active route changes
  useEffect(() => {
    setMoreOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const primaryLinks = [
    { href: '/explore', label: isBn ? 'অন্বেষণ' : 'Explore' },
    { href: '/map', label: isBn ? 'মানচিত্র' : 'Map' },
    { href: '/planner', label: isBn ? 'রুট' : 'Plan' },
  ];

  const secondaryLinks = [
    { href: '/calendar', label: isBn ? 'ক্যালেন্ডার' : 'Calendar', icon: Calendar },
    { href: '/metro', label: isBn ? 'মেট্রো' : 'Metro', icon: Train },
    { href: '/music', label: isBn ? 'সঙ্গীত' : 'Music', icon: Music2 },
    { href: '/mahalaya', label: isBn ? 'মহালয়া' : 'Mahalaya', icon: Sparkles },
    { href: '/about', label: isBn ? 'সাহায্য' : 'Help', icon: Info },
  ];

  const isSecondaryActive = secondaryLinks.some((link) => pathname === link.href);

  return (
    <header className="sticky top-0 z-[1100] border-b border-[#eee8e1] dark:border-[#2a241f] bg-[#fcfaf7]/98 dark:bg-[#14110e]/98 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-black tracking-tight text-[#b42323] transition-transform active:scale-95"
          aria-label="PujoPath home"
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#b42323] text-sm font-bold text-white shadow-sm">
            প
          </span>
          <span className="font-extrabold text-[#b42323]">PujoPath</span>
        </Link>

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
                className="absolute right-0 top-full mt-2 w-52 sm:w-56 rounded-2xl border border-[#e8e1d9] dark:border-[#2f2720] bg-white/98 dark:bg-[#1a1613]/98 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/15 dark:shadow-black/60 z-[1200] max-h-[calc(100vh-5rem)] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
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

        {/* Right Controls: Theme Switch + Language Switch + Saved Heart + Mobile Hamburger */}
        <div className="flex items-center gap-2">

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
          <div className="hidden rounded-xl border border-[#e8e1d9] dark:border-[#332b24] p-0.5 text-xs font-bold sm:flex">
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

          {/* Mobile Hamburger Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e1d9] dark:border-[#332b24] text-[#625b55] dark:text-[#b4a99e] hover:bg-[#f5f1ec] dark:hover:bg-[#221c17] md:hidden transition-all active:scale-95"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="border-t border-[#eee8e1] dark:border-[#2a241f] bg-white dark:bg-[#181411] px-4 py-4 md:hidden shadow-2xl animate-in slide-in-from-top-2 duration-150"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2">
            {[...primaryLinks, ...secondaryLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'rounded-xl px-3 py-2.5 text-sm font-bold transition-colors',
                  pathname === link.href
                    ? 'bg-[#f9e9e7] dark:bg-[#341b18] text-[#b42323]'
                    : 'text-[#4a423d] dark:text-[#c4b9ae] hover:bg-[#f7f3ee] dark:hover:bg-[#221c17]'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Language Switcher button */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'bn' : 'en')}
              className="rounded-xl px-3 py-2.5 text-left text-sm font-bold text-[#4a423d] dark:text-[#c4b9ae] hover:bg-[#f7f3ee] dark:hover:bg-[#221c17] border border-[#eee8e1] dark:border-[#2a241f]"
            >
              {locale === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
