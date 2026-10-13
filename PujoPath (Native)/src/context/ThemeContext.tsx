import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  gold: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textMuted: string;
  textSecondary: string;
  border: string;
  card: string;
  badge: string;
  badgeText: string;
  statusBar: 'light' | 'dark';
}

const lightColors: ThemeColors = {
  primary: '#8B0000', // Deep festive crimson
  primaryDark: '#5E0000',
  primaryLight: '#B22222',
  secondary: '#D97706', // Marigold amber
  accent: '#DC2626',
  gold: '#D4AF37', // Festive Kashful gold
  background: '#FAF7F2', // Warm cream paper
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#1C1917',
  textMuted: '#78716C',
  textSecondary: '#44403C',
  border: '#E7E5E4',
  card: '#FFFFFF',
  badge: '#FEE2E2',
  badgeText: '#991B1B',
  statusBar: 'dark',
};

const darkColors: ThemeColors = {
  primary: '#E11D48',
  primaryDark: '#9F1239',
  primaryLight: '#FB7185',
  secondary: '#F59E0B',
  accent: '#EF4444',
  gold: '#FBBF24',
  background: '#0F172A', // Slate dark
  surface: '#1E293B',
  surfaceElevated: '#334155',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textSecondary: '#CBD5E1',
  border: '#334155',
  card: '#1E293B',
  badge: '#3B0764',
  badgeText: '#F472B6',
  statusBar: 'light',
};

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
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

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
