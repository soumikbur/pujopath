import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

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

// Light Mode Theme Tokens matching Capacitor source of truth
const lightColors: ThemeColors = {
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

// Dark Mode Theme Tokens: Calibrated High-Contrast Warm Charcoal matching Capacitor source of truth
const darkColors: ThemeColors = {
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

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
  setTheme: () => {},
});

const THEME_STORAGE_KEY = '@pujopath_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored !== null) {
        setIsDark(stored === 'dark');
      } else {
        setIsDark(systemColorScheme === 'dark');
      }
    });
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
    AsyncStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
