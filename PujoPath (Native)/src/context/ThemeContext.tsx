import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { useFestival } from '@/context/FestivalContext';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primarySoft: string;
  primarySoftBorder: string;
  secondary: string;
  accent: string;
  gold: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceHover: string;
  surfaceElevated: string;
  surfaceHero: string;
  card: string;
  text: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSubtle: string;
  borderStrong: string;
  badge: string;
  badgeText: string;
  statusBar: 'light' | 'dark';
}

// Durga Puja Light Mode: Warm Autumn Heritage Palette
const durgaLightColors: ThemeColors = {
  primary: '#B42323',
  primaryHover: '#971E1E',
  primarySoft: '#FDEEEE',
  primarySoftBorder: '#F6CECA',
  secondary: '#D97706',
  accent: '#D52F2F',
  gold: '#D5A247',
  background: '#FCFAF7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F1EB',
  surfaceHover: '#F2EDE6',
  surfaceElevated: '#FFFFFF',
  surfaceHero: '#FFF8F1',
  card: '#FFFFFF',
  text: '#242424',
  textPrimary: '#242424',
  textSecondary: '#5C524A',
  textMuted: '#776D65',
  border: '#EEE8E1',
  borderSubtle: '#F0EAE2',
  borderStrong: '#D5C9BD',
  badge: '#FDEEEE',
  badgeText: '#B42323',
  statusBar: 'dark',
};

// Durga Puja Dark Mode: Rich Warm Charcoal with Vermilion Accents
const durgaDarkColors: ThemeColors = {
  primary: '#B42323',
  primaryHover: '#E23C3C',
  primarySoft: '#341B18',
  primarySoftBorder: '#4D221E',
  secondary: '#E8B860',
  accent: '#E23C3C',
  gold: '#E8B860',
  background: '#14110E',
  surface: '#1A1613',
  surfaceSecondary: '#201B17',
  surfaceHover: '#332B23',
  surfaceElevated: '#201B17',
  surfaceHero: '#1E1915',
  card: '#1A1613',
  text: '#FAF6F0',
  textPrimary: '#FAF6F0',
  textSecondary: '#CDC1B5',
  textMuted: '#A89E95',
  border: '#2F2720',
  borderSubtle: '#2C231B',
  borderStrong: '#544536',
  badge: '#341B18',
  badgeText: '#FF8787',
  statusBar: 'light',
};

// Kali Puja Light Mode: Regal Violet & Lavender Devotional Palette
const kaliLightColors: ThemeColors = {
  primary: '#7E22CE',
  primaryHover: '#6B21A8',
  primarySoft: '#F3E8FF',
  primarySoftBorder: '#D8B4FE',
  secondary: '#4F46E5',
  accent: '#9333EA',
  gold: '#D97706',
  background: '#FAF7FD',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3ECF9',
  surfaceHover: '#EDE2F7',
  surfaceElevated: '#FFFFFF',
  surfaceHero: '#F5ECFD',
  card: '#FFFFFF',
  text: '#1E152A',
  textPrimary: '#1E152A',
  textSecondary: '#5B4B6E',
  textMuted: '#7E6E91',
  border: '#E8DCF5',
  borderSubtle: '#F0E7FA',
  borderStrong: '#C5B0E3',
  badge: '#F3E8FF',
  badgeText: '#7E22CE',
  statusBar: 'dark',
};

// Kali Puja Dark Mode: Deep Midnight Indigo & Sacred Violet Palette
const kaliDarkColors: ThemeColors = {
  primary: '#A855F7',
  primaryHover: '#9333EA',
  primarySoft: '#23153C',
  primarySoftBorder: '#4C1D95',
  secondary: '#818CF8',
  accent: '#C084FC',
  gold: '#FBBF24',
  background: '#090714',
  surface: '#130E26',
  surfaceSecondary: '#1B1435',
  surfaceHover: '#241B45',
  surfaceElevated: '#1A1235',
  surfaceHero: '#160F30',
  card: '#130E26',
  text: '#F5F3FF',
  textPrimary: '#F5F3FF',
  textSecondary: '#C4B5FD',
  textMuted: '#8B7AA8',
  border: '#2E2154',
  borderSubtle: '#221840',
  borderStrong: '#4C3580',
  badge: '#2A1445',
  badgeText: '#E9D5FF',
  statusBar: 'light',
};

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
  activeFestival: 'durga' | 'kali' | null;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: durgaLightColors,
  toggleTheme: () => {},
  setTheme: () => {},
  activeFestival: null,
});

const THEME_STORAGE_KEY = '@pujopath_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(false);
  const { activeFestival } = useFestival();

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored !== null) {
        setIsDark(stored === 'dark');
      } else {
        setIsDark(systemColorScheme === 'dark');
      }
    });
  }, [systemColorScheme]);

  const toggleTheme = React.useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const setTheme = React.useCallback((dark: boolean) => {
    setIsDark(dark);
    AsyncStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
  }, []);

  const colors = React.useMemo(() => {
    if (activeFestival === 'kali') {
      return isDark ? kaliDarkColors : kaliLightColors;
    }
    return isDark ? durgaDarkColors : durgaLightColors;
  }, [isDark, activeFestival]);

  const value = React.useMemo(
    () => ({ isDark, colors, toggleTheme, setTheme, activeFestival }),
    [isDark, colors, toggleTheme, setTheme, activeFestival]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

