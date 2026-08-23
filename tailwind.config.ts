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
            DEFAULT: '#D52F2F',
            hover: '#BD2424',
            dark: '#A31C1C',
            soft: '#FDEEEB',
            border: '#F6CECA',
          },
          gold: {
            DEFAULT: '#D5A247',
            light: '#F5E6CC',
          },
          bg: {
            main: '#F8EFE5',
            container: 'rgba(255, 252, 248, 0.78)',
            hero: 'rgba(255, 248, 241, 0.82)',
            card: 'rgba(255, 255, 255, 0.78)',
          },
          text: {
            primary: '#242424',
            secondary: '#4A423D',
            muted: '#665A54',
            red: '#D52F2F',
          },
          border: {
            DEFAULT: '#EADCCE',
            light: '#F2ECE5',
            glass: 'rgba(255, 255, 255, 0.75)',
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
