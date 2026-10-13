/**
 * PujoPath — Smart Yearly Festival Season & Photo Configuration
 *
 * Configures the active target season, the latest completed season,
 * and the policy parameters for the automated pandal photograph update system.
 */

export interface SeasonConfig {
  /** The upcoming or active festival season being planned (e.g. 2026) */
  currentTargetSeason: number;
  /** The most recent completed Durga Puja festival with complete archival photography (e.g. 2025) */
  latestCompletedSeason: number;
  /** Date the current season data was last refreshed (ISO string) */
  seasonRefreshedAt: string;
  /** Date for the next scheduled automated discovery run (ISO string) */
  nextScheduledRun: string;
  /** Active image verification policy engine version */
  policyVersion: string;
  /** Minimum confidence score (0-100) required to auto-publish a candidate photo */
  minConfidenceScore: number;
  /** Whether to retain prior-year verified photos when the current season photo is not yet available (Priority 3) */
  allowPriorYearFallback: boolean;
}

export const CURRENT_SEASON_CONFIG: SeasonConfig = {
  currentTargetSeason: 2026,
  latestCompletedSeason: 2025,
  seasonRefreshedAt: '2026-10-12',
  nextScheduledRun: '2026-10-19',
  policyVersion: '2.0.0-smart-refresh',
  minConfidenceScore: 85,
  allowPriorYearFallback: true,
};

/**
 * Helper to determine whether a given capture year represents the latest completed festival season.
 */
export function isLatestCompletedSeason(captureYear: number | null | undefined, config = CURRENT_SEASON_CONFIG): boolean {
  return captureYear === config.latestCompletedSeason;
}

/**
 * Returns a human-friendly season badge label for both English and Bengali locales.
 */
export function getSeasonBadgeLabel(
  captureYear: number | null | undefined,
  locale: string = 'en',
  config = CURRENT_SEASON_CONFIG
): { badgeText: string; isLatest: boolean; isArchival: boolean } {
  const toBnDigits = (n: number | string) => {
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n).replace(/[0-9]/g, (d) => bn[parseInt(d, 10)]);
  };

  const isBn = locale === 'bn';

  if (!captureYear) {
    return {
      badgeText: isBn ? 'ছবি অপ্রাপ্য' : 'Photo Unavailable',
      isLatest: false,
      isArchival: false,
    };
  }

  const isLatest = captureYear >= config.latestCompletedSeason;
  const isArchival = captureYear < config.latestCompletedSeason;

  if (isLatest) {
    const yrStr = isBn ? toBnDigits(captureYear) : captureYear;
    return {
      badgeText: isBn ? `${yrStr} ছবি` : `${yrStr} Photo`,
      isLatest: true,
      isArchival: false,
    };
  }

  const yrStr = isBn ? toBnDigits(captureYear) : captureYear;
  return {
    badgeText: isBn ? `${yrStr} আর্কাইভ` : `${yrStr} Archive`,
    isLatest: false,
    isArchival: true,
  };
}
