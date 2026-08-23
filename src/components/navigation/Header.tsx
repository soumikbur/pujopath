'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Menu,
  X,
  ChevronDown,
  Watch,
  Train,
  Music2,
  Sparkles,
  Info,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { cn } from '@/lib/utils/cn';

interface HeaderProps {
  onToggleWatchMode?: () => void;
  isWatchMode?: boolean;
}

export function Header({ onToggleWatchMode, isWatchMode }: HeaderProps) {
  const pathname = usePathname();
  const { locale, setLocale } = useI18n();
  const { savedPandalIds } = useFavorites();
  const isBn = locale === 'bn';

  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavLinks = [
    { href: '/', label: isBn ? 'হোম' : 'Home' },
    { href: '/explore', label: isBn ? 'অন্বেষণ' : 'Explore' },
    { href: '/map', label: isBn ? 'মানচিত্র' : 'Map' },
    { href: '/planner', label: isBn ? 'পরিকল্পনা' : 'Planner' },
    { href: '/calendar', label: isBn ? 'ক্যালেন্ডার' : 'Calendar' },
  ];

  const moreDropdownLinks = [
    { href: '/metro', label: isBn ? 'মেট্রো গাইড' : 'Metro Guide', icon: Train },
    { href: '/music', label: isBn ? 'সঙ্গীত ও ঢাক' : 'Puja Music', icon: Music2 },
    { href: '/mahalaya', label: isBn ? 'মহালয়া বিশেষ' : 'Mahalaya Special', icon: Sparkles },
    { href: '/about', label: isBn ? 'তথ্য ও হেল্পলাইন' : 'About & Helpline', icon: Info },
  ];

  return (
    <header
      className="relative z-40 w-full shrink-0 px-5 sm:px-8"
      style={{
        height: '60px',
        background: 'rgba(255, 255, 255, 0.35)',
        borderBottom: '1px solid rgba(234, 220, 206, 0.7)',
      }}
    >
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto h-full">
        {/* Left: Red Trishul Logo + PujoPath Wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-[#4A423D] hover:text-[#242424] -ml-1 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
              style={{
                background: 'rgba(213, 47, 47, 0.08)',
                border: '1px solid rgba(213, 47, 47, 0.2)',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D52F2F"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M12 2v20" />
                <path d="M12 7a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0v-2a5 5 0 0 1 5-5z" />
                <path d="M5 9c1.5-2 3.5-3 7-3s5.5 1 7 3" />
              </svg>
            </div>

            <span className="text-[20px] font-black tracking-tight text-[#D52F2F] font-display">
              PujoPath
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {mainNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative py-1 text-[14px] transition-colors duration-150',
                  isActive
                    ? 'text-[#D52F2F] font-bold'
                    : 'text-[#242424] hover:text-[#D52F2F] font-medium'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[14px] left-0 right-0 h-[2.5px] bg-[#D52F2F] rounded-full" />
                )}
              </Link>
            );
          })}

          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 200)}
              className={cn(
                'flex items-center gap-1 py-1 text-[14px] transition-colors duration-150',
                pathname === '/metro' || pathname === '/music' || pathname === '/mahalaya' || pathname === '/about'
                  ? 'text-[#D52F2F] font-bold'
                  : 'text-[#242424] hover:text-[#D52F2F] font-medium'
              )}
            >
              <span>{isBn ? 'আরও' : 'More'}</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', moreOpen && 'rotate-180')} />
            </button>

            {moreOpen && (
              <div
                className="absolute top-full right-0 mt-2.5 w-48 rounded-2xl p-1.5 space-y-1 z-50"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(234, 220, 206, 0.8)',
                  boxShadow: '0 8px 32px rgba(70, 35, 15, 0.12)',
                }}
              >
                {moreDropdownLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#4A423D] hover:text-[#242424] hover:bg-[#F8F0E8] transition-colors"
                    >
                      <Icon className="w-4 h-4 text-[#D52F2F]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Watch UI Pill + Language Switcher + Heart + Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {onToggleWatchMode && (
            <button
              onClick={onToggleWatchMode}
              title={isWatchMode ? 'Exit Watch Mode' : 'Preview Smartwatch UI'}
              className="px-3 py-1 rounded-full text-xs font-semibold text-[#3D332F] hover:text-[#D52F2F] transition-colors flex items-center gap-1.5"
              style={{
                border: '1px solid rgba(234, 220, 206, 0.8)',
                background: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <Watch className="w-3.5 h-3.5" />
              <span>Watch UI</span>
            </button>
          )}

          <div
            className="flex items-center p-0.5 rounded-full text-xs font-bold"
            style={{
              border: '1px solid rgba(234, 220, 206, 0.8)',
              background: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            <button
              onClick={() => setLocale('en')}
              className={cn(
                'px-2.5 py-0.5 rounded-full transition-all text-xs',
                locale === 'en'
                  ? 'bg-[#D52F2F] text-white shadow-sm'
                  : 'text-[#4A423D] hover:text-[#242424]'
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLocale('bn')}
              className={cn(
                'px-2.5 py-0.5 rounded-full transition-all text-xs',
                locale === 'bn'
                  ? 'bg-[#D52F2F] text-white shadow-sm'
                  : 'text-[#4A423D] hover:text-[#242424]'
              )}
            >
              বাংলা
            </button>
          </div>

          <Link
            href="/saved"
            aria-label={isBn ? 'সংরক্ষিত' : 'Saved Pandals'}
            className="p-1.5 text-[#242424] hover:text-[#D52F2F] transition-colors"
          >
            <Heart className={cn('w-[18px] h-[18px]', savedPandalIds.length > 0 && 'text-[#D52F2F] fill-[#D52F2F]')} />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#242424] hover:text-[#D52F2F] transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Menu for Mobile */}
      {mobileMenuOpen && (
        <div
          className="mt-3 p-3.5 rounded-2xl space-y-2"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(234, 220, 206, 0.8)',
            boxShadow: '0 8px 32px rgba(70, 35, 15, 0.12)',
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[...mainNavLinks, ...moreDropdownLinks, { href: '/saved', label: isBn ? 'সংরক্ষিত' : 'Saved', icon: Heart }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors',
                  pathname === link.href
                    ? 'bg-red-50 border-red-200 text-[#D52F2F]'
                    : 'bg-[#F8F0E8] border-[#EADCCE] text-[#4A423D] hover:text-[#242424]'
                )}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
