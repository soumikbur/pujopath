import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudio } from '@/context/AudioContext';

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
  activeFestival: FestivalType | null;
  selectFestival: (festival: FestivalType) => Promise<void>;
  resetFestival: () => Promise<void>;
  festivalTheme: FestivalThemeTokens | null;
}

const FestivalContext = createContext<FestivalContextType>({
  activeFestival: null,
  selectFestival: async () => {},
  resetFestival: async () => {},
  festivalTheme: null,
});

export const FestivalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFestival, setActiveFestival] = useState<FestivalType | null>(null);
  const { stopAudio } = useAudio();

  // On initial app launch, we want the intentional festival selection screen.
  // We do NOT auto-select so users always experience the intentional choice screen.
  // However, we allow clearing or manual resetting.
  const selectFestival = async (festival: FestivalType) => {
    // If transitioning between different festivals, stop any active music playback cleanly
    if (activeFestival && activeFestival !== festival) {
      try {
        await stopAudio();
      } catch {}
    }
    setActiveFestival(festival);
    try {
      await AsyncStorage.setItem(FESTIVAL_STORAGE_KEY, festival);
    } catch {}
  };

  const resetFestival = async () => {
    try {
      await stopAudio();
    } catch {}
    setActiveFestival(null);
    try {
      await AsyncStorage.removeItem(FESTIVAL_STORAGE_KEY);
    } catch {}
  };

  const festivalTheme = activeFestival ? FESTIVAL_THEMES[activeFestival] : null;

  return (
    <FestivalContext.Provider
      value={{
        activeFestival,
        selectFestival,
        resetFestival,
        festivalTheme,
      }}
    >
      {children}
    </FestivalContext.Provider>
  );
};

export const useFestival = () => useContext(FestivalContext);
