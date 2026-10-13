import type { Metadata, Viewport } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/I18nContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AudioProvider } from '@/lib/context/AudioContext';
import { FavoritesProvider } from '@/lib/context/FavoritesContext';
import { BackgroundProvider } from '@/lib/context/BackgroundContext';
import { AppShell } from '@/components/navigation/AppShell';
import { PwaRegister } from '@/components/pwa/PwaRegister';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: 'PujoPath — Discover. Plan. Experience Pujo.',
  description:
    'A minimal, clean, modern Durga Puja 2026 digital companion with pandal discovery, route planner, metro guide, sacred calendar, and Sharodiya music.',
  manifest: `${basePath}/manifest.json`,
  icons: {
    icon: `${basePath}/icons/icon-192.png`,
    apple: `${basePath}/icons/icon-192.png`,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FCFAF7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Anti-FOUC theme initialization script: defaults to light mode for first-time visitors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('pujopath_theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FCFAF7] dark:bg-[#14110E] text-[#242424] dark:text-[#EDE5DC] antialiased selection:bg-pujo-red selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <I18nProvider>
            <AudioProvider>
              <FavoritesProvider>
                <BackgroundProvider>
                  <AppShell>{children}</AppShell>
                  <PwaRegister />
                </BackgroundProvider>
              </FavoritesProvider>
            </AudioProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
