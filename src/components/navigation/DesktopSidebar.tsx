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
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-stone-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm p-4 overflow-y-auto justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                  ? 'bg-sindoor-600 text-white shadow-md shadow-sindoor-600/30'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400')} />
                <span>{item.label}</span>
              </div>

              {item.badge !== null && item.badge !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold',
                    isActive
                      ? 'bg-white text-sindoor-700'
                      : 'bg-sindoor-100 dark:bg-sindoor-950 text-sindoor-700 dark:text-sindoor-300'
                  )}
                >
                  {locale === 'bn' ? toBengaliDigits(item.badge) : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-gold-500/10 via-sindoor-500/5 to-transparent border border-gold-500/20 text-xs">
        <div className="flex items-center gap-1.5 text-gold-700 dark:text-gold-400 font-bold mb-1">
          <span>🌾</span>
          <span>শারদোৎসব ২০২৬</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400">
          কাশফুলের দোলা আর নীল আকাশে শারদীয়ার আগমন বার্তা।
        </p>
      </div>
    </aside>
  );
}
