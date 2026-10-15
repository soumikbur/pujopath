/**
 * PujoPath Application Configuration & Runtime Environment Validator
 *
 * Provides centralized access to environment settings and validates that
 * required variables are configured appropriately during development.
 */

export interface AppConfig {
  appUrl: string;
  basePath: string;
  mapProvider: 'google' | 'openstreetmap' | 'cartodb' | 'custom';
  googleMapsApiKey: string;
  googleMapsMapId: string;
  defaultLocale: 'en' | 'bn';
  defaultTheme: 'light' | 'dark';
  analyticsEnabled: boolean;
}

export const config: AppConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://pujopath.vercel.app',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  mapProvider: (process.env.NEXT_PUBLIC_MAP_PROVIDER as AppConfig['mapProvider']) || 'google',
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  googleMapsMapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
  defaultLocale: (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as 'en' | 'bn') || 'en',
  defaultTheme: 'light', // Strict requirement: First-time visitors always default to light mode
  analyticsEnabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
};

/**
 * Direct public download URL for the published Android APK release asset.
 */
export const APK_DOWNLOAD_URL =
  'https://github.com/soumikbur/pujopath/releases/download/v1.0.0/PujoPath-v1.0.0.apk';

/**
 * Validates the runtime development environment.
 * Warns if developers have cloned the repository without creating their local .env.local file.
 */
export function validateEnvironment(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (process.env.NODE_ENV === 'development') {
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      warnings.push('NEXT_PUBLIC_APP_URL is unset. Defaulting to local runtime.');
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
