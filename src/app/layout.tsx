import type { Metadata, Viewport } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/I18nContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AudioProvider } from '@/lib/context/AudioContext';
import { FavoritesProvider } from '@/lib/context/FavoritesContext';
import { AppShell } from '@/components/navigation/AppShell';
import { PwaRegister } from '@/components/pwa/PwaRegister';

export const metadata: Metadata = {
  title: 'PujoPath — Discover. Plan. Experience Pujo.',
  description:
    'A minimal, clean, modern Durga Puja 2026 digital companion with pandal discovery, route planner, metro guide, sacred calendar, and Sharodiya music.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#D52F2F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-pujo-bg-main min-h-screen text-pujo-text-primary antialiased selection:bg-pujo-red selection:text-white">
        <ThemeProvider>
          <I18nProvider>
            <AudioProvider>
              <FavoritesProvider>
                <AppShell>{children}</AppShell>
                <PwaRegister />
              </FavoritesProvider>
            </AudioProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
