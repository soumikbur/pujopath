/**
 * PujoPath Design System Tokens
 * Source of truth extracted directly from PujoPath (Web) and PujoPath (Capacitor)
 */

export const colors = {
  brand: {
    red: '#b42323',
    redHover: '#971e1e',
    redSoft: '#fdeeee',
    redBorder: 'rgba(180, 35, 35, 0.25)',
    redDark: '#801414',
    gold: '#d97706',
    goldLight: '#fef3c7',
    goldDark: '#b45309',
  },
  light: {
    bgMain: '#fcfaf7',
    surface: '#ffffff',
    surfaceSecondary: '#f5f1eb',
    surfaceHover: '#f2ede6',
    card: '#ffffff',
    textPrimary: '#242424',
    textSecondary: '#5c524a',
    textMuted: '#7e7268',
    border: '#e8e1d9',
    borderSubtle: '#f0eae2',
    borderStrong: '#d5c9bd',
  },
  dark: {
    bgMain: '#14110e',
    surface: '#1e1915',
    surfaceSecondary: '#27201a',
    surfaceHover: '#332b23',
    card: '#1a1613',
    textPrimary: '#ede5dc',
    textSecondary: '#b5aaa0',
    textMuted: '#8a7f76',
    border: '#2f2720',
    borderSubtle: '#251e18',
    borderStrong: '#3d332a',
  },
} as const;

export const typography = {
  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: '"Plus Jakarta Sans", Inter, sans-serif',
    bengali: '"Hind Siliguri", "Noto Sans Bengali", sans-serif',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  sizes: {
    xs: '11px',
    sm: '13px',
    base: '15px',
    lg: '17px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
} as const;

export const radii = {
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '22px',
  '4xl': '28px',
  full: '9999px',
} as const;

export const shadows = {
  xs: '0 1px 3px rgba(60, 30, 15, 0.04)',
  card: '0 2px 10px rgba(70, 35, 15, 0.04)',
  container: '0 20px 60px rgba(80, 40, 20, 0.08)',
  player: '0 14px 40px rgba(70, 35, 15, 0.12)',
} as const;
