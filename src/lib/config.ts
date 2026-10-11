/**
 * PujoPath Application Configuration & Runtime Environment Validator
 *
 * Provides centralized access to environment settings and validates that
 * required variables are configured appropriately during development.
 */

export interface AppConfig {
  appUrl: string;
  basePath: string;
  mapProvider: 'openstreetmap' | 'cartodb' | 'custom';
  defaultLocale: 'en' | 'bn';
  defaultTheme: 'light' | 'dark';
  analyticsEnabled: boolean;
}

export const config: AppConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://soumikbur.github.io/pujopath',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  mapProvider: (process.env.NEXT_PUBLIC_MAP_PROVIDER as AppConfig['mapProvider']) || 'openstreetmap',
  defaultLocale: (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as 'en' | 'bn') || 'en',
  defaultTheme: 'light', // Strict requirement: First-time visitors always default to light mode
  analyticsEnabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
};

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
