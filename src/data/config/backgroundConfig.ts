/**
 * PujoPath — Subtle Ghibli-Inspired Durga Puja Background Configuration
 *
 * Defines the 6 original AI-generated Ghibli-style illustrations capturing
 * authentic Bengali Durga Puja atmosphere, providing both Landscape (16:9)
 * and Portrait (3:4) assets for desktop and mobile devices.
 */

export interface GhibliBackground {
  id: string;
  srcLandscape: string;
  srcPortrait: string;
  /** Legacy alias for backwards compatibility */
  src: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

export const GHIBLI_BACKGROUNDS: GhibliBackground[] = [
  {
    id: 'pandal-illumination',
    srcLandscape: '/images/backgrounds/ghibli-pandal-illumination-landscape.webp',
    srcPortrait: '/images/backgrounds/ghibli-pandal-illumination-portrait.webp',
    src: '/images/backgrounds/ghibli-pandal-illumination.webp',
    titleEn: 'Illuminated Pandal Night',
    titleBn: 'আলোকোজ্জ্বল মণ্ডপ সন্ধ্যা',
    descriptionEn: 'An ornate Durga Puja pandal glowing with warm golden lights and festive twilight mist.',
    descriptionBn: 'উৎসবের সন্ধ্যায় আলোয় উদ্ভাসিত মনোরম দুর্গোৎসব মণ্ডপ।',
  },
  {
    id: 'devotees-praying',
    srcLandscape: '/images/backgrounds/ghibli-devotees-praying-landscape.webp',
    srcPortrait: '/images/backgrounds/ghibli-devotees-praying-portrait.webp',
    src: '/images/backgrounds/ghibli-devotees-praying.webp',
    titleEn: 'Devotees in Anjali Prayer',
    titleBn: 'করজোড়ে অঞ্জলি ও প্রার্থনা',
    descriptionEn: 'Bengali devotees in traditional garad sarees and kurtas offering heartfelt prayers before Goddess Durga.',
    descriptionBn: 'মা দুর্গার চরণে করজোড়ে ভক্তদের ব্যাকুল অঞ্জলি ও নিবেদন।',
  },
  {
    id: 'priest-aarti',
    srcLandscape: '/images/backgrounds/ghibli-priest-aarti-landscape.webp',
    srcPortrait: '/images/backgrounds/ghibli-priest-aarti-portrait.webp',
    src: '/images/backgrounds/ghibli-priest-aarti.webp',
    titleEn: 'Sacred Sandhya Aarti',
    titleBn: 'পবিত্র সন্ধ্যা আরতি',
    descriptionEn: 'A Brahmin priest conducting evening puja with a tiered brass panchapradip and fragrant dhuno.',
    descriptionBn: 'পঞ্চপ্রদীপ ও ধুনোর ধোঁয়ায় পুরোহিতের পবিত্র সান্ধ্য আরতি।',
  },
  {
    id: 'durga-idol-flowers',
    srcLandscape: '/images/backgrounds/ghibli-durga-idol-flowers-landscape.webp',
    srcPortrait: '/images/backgrounds/ghibli-durga-idol-flowers-portrait.webp',
    src: '/images/backgrounds/ghibli-durga-idol-flowers.webp',
    titleEn: 'Ekchala Protima & Kash Phool',
    titleBn: 'একচালা প্রতিমা ও শুভ্র কাশফুল',
    descriptionEn: 'Traditional sholapith daaker saaj Durga idol surrounded by autumn kash flowers and red hibiscus.',
    descriptionBn: 'শোলার সাজে একচালা দেবী প্রতিমা এবং শরতের শুভ্র কাশফুল।',
  },
  {
    id: 'evening-pandal-crowd',
    srcLandscape: '/images/backgrounds/ghibli-evening-pandal-crowd-landscape.webp',
    srcPortrait: '/images/backgrounds/ghibli-evening-pandal-crowd-portrait.webp',
    src: '/images/backgrounds/ghibli-evening-pandal-crowd.webp',
    titleEn: 'Festive Pandal & Dhakis',
    titleBn: 'আনন্দমুখর মণ্ডপ ও ঢাকির বোল',
    descriptionEn: 'Joyful Kolkata families, festive street stalls, and rhythmic dhakis playing outside a glowing pandal.',
    descriptionBn: 'মণ্ডপ চত্বরে পরিবার-পরিজনের উল্লাস এবং ঢাকির উৎসবমুখর বোল।',
  },
  {
    id: 'traditional-diyas-incense',
    srcLandscape: '/images/backgrounds/ghibli-traditional-diyas-incense-landscape.webp',
    srcPortrait: '/images/backgrounds/ghibli-traditional-diyas-incense-portrait.webp',
    src: '/images/backgrounds/ghibli-traditional-diyas-incense.webp',
    titleEn: 'Alpana, Diyas & Dhunuchi',
    titleBn: 'আলপনা, প্রদীপ ও ধুনুচি',
    descriptionEn: 'A serene sanctum floor with intricate white alpana, glowing terracotta lamps, and frankincense smoke.',
    descriptionBn: 'সাদা আলপনা, মাটির প্রদীপ ও ধুনুচির পবিত্র সুবাসে স্নিগ্ধ গর্ভগৃহ।',
  },
];

export interface BackgroundRotationSettings {
  /** Rotation interval in milliseconds (approx 20–35s, default 28s) */
  intervalMs: number;
  /** Crossfade transition duration in milliseconds (approx 1.5–2.5s, default 2s) */
  transitionDurationMs: number;
  /** Visible yet subtle image opacity for Light Mode (default 0.32) */
  lightModeOpacity: number;
  /** Visible yet subtle image opacity for Dark Mode (default 0.38) */
  darkModeOpacity: number;
  /** Subtle blur in pixels (0 for crisp painterly background) */
  blurPx: number;
}

export const BACKGROUND_SETTINGS: BackgroundRotationSettings = {
  intervalMs: 28000,          // 28 seconds
  transitionDurationMs: 2000,  // 2.0 seconds smooth crossfade
  lightModeOpacity: 0.18,      // 18% opacity ensures artwork is understated & text is immediately readable
  darkModeOpacity: 0.22,       // 22% opacity provides soft warm glowing festive atmosphere without competing with text
  blurPx: 0,
};

/**
 * Reliably identifies if the current pathname corresponds to the homepage.
 * Normalizes trailing slashes, Next.js basePath (/pujopath), query params, and hashes.
 * Ensures non-homepage routes (e.g. /map, /planner, /explore, /pandals/...) never show background images.
 */
export function isHomepageRoute(pathname?: string | null): boolean {
  if (!pathname) return true;
  const clean = pathname.split('?')[0].split('#')[0].trim();
  const normalized = clean.replace(/\/+$/, '') || '/';
  return (
    normalized === '/' ||
    normalized === '' ||
    normalized === '/pujopath' ||
    normalized === '/index.html' ||
    normalized === '/pujopath/index.html'
  );
}

/**
 * Returns a truly random background index that is guaranteed
 * not to repeat the previous index when more than 1 image is available.
 */
export function getNextRandomIndex(currentIndex: number, total: number = GHIBLI_BACKGROUNDS.length): number {
  if (total <= 1) return 0;
  let next = Math.floor(Math.random() * total);
  while (next === currentIndex) {
    next = Math.floor(Math.random() * total);
  }
  return next;
}

