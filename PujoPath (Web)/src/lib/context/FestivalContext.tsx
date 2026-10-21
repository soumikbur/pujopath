'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type FestivalType = 'durga' | 'kali';

export interface FestivalThemeTokens {
  name: string;
  nameBn: string;
  badgeText: string;
  badgeTextBn: string;
  primaryColor: string;
  primaryLight: string;
  primaryDark: string;
  accentColor: string;
  secondaryAccent: string;
  surfaceHeaderBg: string;
  surfaceCardBg: string;
}

export const FESTIVAL_THEMES: Record<FestivalType, FestivalThemeTokens> = {
  durga: {
    name: 'Durga Puja',
    nameBn: 'শ্রী শ্রী দুর্গাপূজা',
    badgeText: 'DURGA PUJA',
    badgeTextBn: 'শারদোৎসব',
    primaryColor: '#B42323',
    primaryLight: '#FEE2E2',
    primaryDark: '#341B18',
    accentColor: '#D97706',
    secondaryAccent: '#EA580C',
    surfaceHeaderBg: '#FDEDED',
    surfaceCardBg: '#FFF9F5',
  },
  kali: {
    name: 'Kali Puja',
    nameBn: 'মা শ্যামা পূজা ও দীপাবলি',
    badgeText: 'KALI PUJA',
    badgeTextBn: 'দীপান্বিতা অমাবস্যা',
    primaryColor: '#9333EA',
    primaryLight: '#F3E8FF',
    primaryDark: '#2D1236',
    accentColor: '#FBBF24',
    secondaryAccent: '#DC2626',
    surfaceHeaderBg: '#2D1236',
    surfaceCardBg: '#1C1026',
  },
};

const FESTIVAL_STORAGE_KEY = '@pujopath_active_festival';

interface FestivalContextType {
  activeFestival: FestivalType;
  selectFestival: (festival: FestivalType) => void;
  resetFestival: () => void;
  toggleFestival: () => void;
  festivalTheme: FestivalThemeTokens;
  isKali: boolean;
  isDurga: boolean;
}

const FestivalContext = createContext<FestivalContextType>({
  activeFestival: 'durga',
  selectFestival: () => {},
  resetFestival: () => {},
  toggleFestival: () => {},
  festivalTheme: FESTIVAL_THEMES.durga,
  isKali: false,
  isDurga: true,
});

export const FestivalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFestival, setActiveFestival] = useState<FestivalType>('durga');

  useEffect(() => {
    try {
      // 1. Check URL search param if present (e.g. ?festival=kali)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const festParam = urlParams.get('festival');
        if (festParam === 'kali' || festParam === 'durga') {
          setActiveFestival(festParam);
          localStorage.setItem(FESTIVAL_STORAGE_KEY, festParam);
          return;
        }

        // 2. Check saved storage preference
        const saved = localStorage.getItem(FESTIVAL_STORAGE_KEY);
        if (saved === 'kali' || saved === 'durga') {
          setActiveFestival(saved);
        }
      }
    } catch {}
  }, []);

  const selectFestival = (festival: FestivalType) => {
    setActiveFestival(festival);
    try {
      localStorage.setItem(FESTIVAL_STORAGE_KEY, festival);
    } catch {}
  };

  const resetFestival = () => {
    selectFestival('durga');
  };

  const toggleFestival = () => {
    selectFestival(activeFestival === 'durga' ? 'kali' : 'durga');
  };

  const festivalTheme = FESTIVAL_THEMES[activeFestival] || FESTIVAL_THEMES.durga;

  return (
    <FestivalContext.Provider
      value={{
        activeFestival,
        selectFestival,
        resetFestival,
        toggleFestival,
        festivalTheme,
        isKali: activeFestival === 'kali',
        isDurga: activeFestival === 'durga',
      }}
    >
      {children}
    </FestivalContext.Provider>
  );
};

export const useFestival = () => useContext(FestivalContext);
