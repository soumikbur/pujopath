import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pujo: {
          red: {
            DEFAULT: 'var(--accent-red)',
            hover: 'var(--accent-red-hover)',
            dark: '#A31C1C',
            soft: 'var(--accent-red-soft)',
            border: 'var(--accent-red-border)',
          },
          gold: {
            DEFAULT: 'var(--accent-gold)',
            light: '#F5E6CC',
          },
          bg: {
            main: 'var(--bg-main)',
            container: 'var(--surface-secondary)',
            hero: 'var(--surface-hero)',
            card: 'var(--surface-card)',
            surface: 'var(--surface)',
          },
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            muted: 'var(--text-muted)',
            red: 'var(--accent-red)',
          },
          border: {
            DEFAULT: 'var(--border)',
            light: 'var(--border-subtle)',
            glass: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['Inter', 'var(--font-display)', 'sans-serif'],
        bengali: ['Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '22px',
        '4xl': '28px',
      },
      boxShadow: {
        'xs': '0 1px 3px rgba(60, 30, 15, 0.04)',
        'card': '0 2px 10px rgba(70, 35, 15, 0.04)',
        'container': '0 20px 60px rgba(80, 40, 20, 0.08)',
        'player': '0 14px 40px rgba(70, 35, 15, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
