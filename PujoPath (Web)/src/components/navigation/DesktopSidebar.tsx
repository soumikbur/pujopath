'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Map,
  Navigation,
  Train,
  Music2,
  Calendar,
  Sparkles,
  Bookmark,
  Info,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { toBengaliDigits } from '@/lib/geo';
import { cn } from '@/lib/utils/cn';

export function DesktopSidebar() {
  const pathname = usePathname();
  const { t, locale } = useI18n();
  const { currentRouteStops, savedPandalIds } = useFavorites();

  const navItems = [
    { href: '/', label: t('navHome'), icon: Home },
    { href: '/explore', label: t('navExplore'), icon: Compass },
    { href: '/map', label: t('navMap'), icon: Map },
    {
      href: '/planner',
      label: t('navPlanner'),
      icon: Navigation,
      badge: currentRouteStops.length > 0 ? currentRouteStops.length : null,
    },
    { href: '/metro', label: t('navMetro'), icon: Train },
    { href: '/music', label: t('navMusic'), icon: Music2 },
    { href: '/calendar', label: t('navCalendar'), icon: Calendar },
    { href: '/mahalaya', label: t('navMahalaya'), icon: Sparkles },
    {
      href: '/saved',
      label: t('navSaved'),
      icon: Bookmark,
      badge: savedPandalIds.length > 0 ? savedPandalIds.length : null,
    },
    { href: '/about', label: t('navAbout'), icon: Info },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-[#eee8e1] dark:border-[#2f2720] bg-white/60 dark:bg-[#14110e]/60 backdrop-blur-sm p-4 overflow-y-auto justify-between transition-colors">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#776d65] dark:text-[#a89e95]">
          Festival Guide
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
                isActive
                  ? 'bg-[#f9e9e7] dark:bg-[#341b18] text-[#b42323] shadow-xs'
                  : 'text-[#4a423d] dark:text-[#c4b9ae] hover:bg-[#f7f3ee] dark:hover:bg-[#201c18] hover:text-[#242424] dark:hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4', isActive ? 'text-[#b42323]' : 'text-[#776d65] dark:text-[#a89e95]')} />
                <span>{item.label}</span>
              </div>

              {item.badge !== null && item.badge !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold',
                    isActive
                      ? 'bg-[#b42323] text-white'
                      : 'bg-[#f9e9e7] dark:bg-[#341b18] text-[#b42323]'
                  )}
                >
                  {locale === 'bn' ? toBengaliDigits(item.badge) : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-transparent border border-amber-500/20 text-xs">
        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold mb-1">
          <span>🌾</span>
          <span>শারদোৎসব ২০২৬</span>
        </div>
        <p className="text-[11px] text-[#776d65] dark:text-[#a89e95]">
          কাশফুলের দোলা আর নীল আকাশে শারদীয়ার আগমন বার্তা।
        </p>
      </div>
    </aside>
  );
}
