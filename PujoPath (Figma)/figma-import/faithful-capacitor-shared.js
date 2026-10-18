const fs = require('fs');
const path = require('path');

const { IMAGES } = require('./authentic-tokens-and-assets');

// Capacitor Android Design Tokens for Light & Dark Modes
const TOKENS = {
  light: {
    bg: '#fcfaf7',
    statusBarBg: '#fcfaf7',
    statusBarIcon: '#1a1715',
    card: '#ffffff',
    cardBorder: '#e8e1d9',
    cardElevated: '#fdfbf7',
    cardInner: '#f9f6f1',
    textMain: '#242424',
    textDark: '#1a1715',
    textMuted: '#5c524a',
    textSubtle: '#7e7268',
    textFaint: '#8f847b',
    red: '#b42323',
    redHover: '#961c1c',
    redPillBg: '#feeceb',
    redPillBorder: '#fca5a5',
    redPillText: '#b42323',
    navBg: '#ffffff',
    navBorder: '#eee8e1',
    navActiveBg: '#fdeeee',
    navActiveText: '#b42323',
    navInactiveText: '#665a54',
    headerBg: 'rgba(252, 250, 247, 0.98)',
    headerBorder: '#eee8e1',
    inputBg: '#ffffff',
    inputBorder: '#e5e0d8',
    blueBtn: '#0a66c2',
    blueLine: '#2563eb',
    greenLine: '#16a34a',
    amberStar: '#d97706',
    white: '#ffffff',
    gesturePill: '#1a1715',
    gesturePillOpacity: '0.8',
    themeIcon: '🌙',
    shadow: 'rgba(0,0,0,0.06)'
  },
  dark: {
    bg: '#14110e',
    statusBarBg: '#14110e',
    statusBarIcon: '#ffffff',
    card: '#1e1915',
    cardBorder: '#3d3227',
    cardElevated: '#27201a',
    cardInner: '#251e18',
    textMain: '#f8f3ec',
    textDark: '#ffffff',
    textMuted: '#d4c7ba',
    textSubtle: '#a39486',
    textFaint: '#786e65',
    red: '#b42323',
    redHover: '#961c1c',
    redPillBg: '#341b18',
    redPillBorder: '#5a2722',
    redPillText: '#fca5a5',
    navBg: '#181411',
    navBorder: '#2a241f',
    navActiveBg: '#341b18',
    navActiveText: '#fca5a5',
    navInactiveText: '#a89e95',
    headerBg: 'rgba(20, 17, 14, 0.98)',
    headerBorder: '#2a241f',
    inputBg: '#1e1915',
    inputBorder: '#3d3227',
    blueBtn: '#38bdf8',
    blueLine: '#3b82f6',
    greenLine: '#22c55e',
    amberStar: '#f59e0b',
    white: '#ffffff',
    gesturePill: '#ffffff',
    gesturePillOpacity: '0.8',
    themeIcon: '☀️',
    shadow: 'rgba(0,0,0,0.5)'
  }
};

// SVG typography and font import
const SVG_STYLE = `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800;900&amp;display=swap');
      text { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .bengali { font-family: 'Hind Siliguri', 'Inter', sans-serif; }
      .brand { font-family: 'Inter', sans-serif; font-weight: 900; }
    </style>
  </defs>
`;

// 1. Android Status Bar (412 x 40)
function renderAndroidStatusBar(isDark = false, isFullscreenDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const iconColor = isFullscreenDark ? '#FFFFFF' : t.statusBarIcon;
  const bgColor = isFullscreenDark ? 'none' : t.statusBarBg;

  return `
  <!-- ANDROID SYSTEM STATUS BAR (412 x 40) -->
  <g id="Android_Status_Bar">
    <rect width="412" height="40" fill="${bgColor}"/>
    <text x="24" y="26" fill="${iconColor}" font-size="14" font-weight="600">9:34</text>
    
    <g transform="translate(320, 14)">
      <!-- 5G Badge -->
      <text x="0" y="12" fill="${iconColor}" font-size="11" font-weight="700">5G</text>
      <!-- Signal Bars -->
      <path d="M22 18 L22 14 M25 18 L25 10 M28 18 L28 6 M31 18 L31 2" stroke="${iconColor}" stroke-width="2" stroke-linecap="round"/>
      <!-- Battery Icon -->
      <rect x="38" y="5" width="18" height="11" rx="3" stroke="${iconColor}" stroke-width="1.5" fill="none"/>
      <rect x="40" y="7" width="11" height="7" fill="${iconColor}"/>
      <line x1="57" y1="8" x2="57" y2="13" stroke="${iconColor}" stroke-width="1.5"/>
    </g>
  </g>
  `;
}

// 2. Android 24px Gesture Home Pill
function renderAndroidGesturePill(Y = 891, isDark = false, width = 412) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const pillX = Math.round((width - 72) / 2);

  return `
  <!-- ANDROID SYSTEM GESTURE NAVIGATION PILL (Y=${Y}) -->
  <g id="Android_Gesture_Pill" transform="translate(0, ${Y})">
    <rect width="${width}" height="24" fill="none"/>
    <rect x="${pillX}" y="10" width="72" height="4" rx="2" fill="${t.gesturePill}" fill-opacity="${t.gesturePillOpacity}"/>
  </g>
  `;
}

// 3. Capacitor App Bar (412 x 56, NO Install App button!)
function renderCapacitorHeader(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
  <!-- CAPACITOR ANDROID APP BAR (412 x 56, NO INSTALL BUTTON) -->
  <g id="Capacitor_App_Bar" transform="translate(0, 40)">
    <rect width="412" height="56" fill="${t.headerBg}"/>
    <line x1="0" y1="56" x2="412" y2="56" stroke="${t.headerBorder}" stroke-width="1"/>

    <!-- Left Brand Logo -->
    <text x="18" y="36" fill="${t.red}" font-size="22" font-weight="900" letter-spacing="-0.5" class="brand">PujoPath</text>

    <!-- Right Controls: Theme Toggle, Language Switcher, Favorites Heart -->
    <g id="Cap_Controls" transform="translate(240, 10)">
      <!-- Moon / Sun Toggle -->
      <g id="Cap_Theme_Toggle">
        <rect width="36" height="36" rx="11" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="18" y="23" fill="${t.textMuted}" font-size="14" text-anchor="middle">${t.themeIcon}</text>
      </g>

      <!-- Language Toggle Pill (EN / বাংলা) -->
      <g id="Cap_Lang_Toggle" transform="translate(44, 0)">
        <rect width="68" height="36" rx="11" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <rect x="3" y="3" width="30" height="30" rx="8" fill="${t.red}"/>
        <text x="18" y="22" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle">EN</text>
        <text x="48" y="22" fill="${t.textMuted}" font-size="11" font-weight="600" text-anchor="middle" class="bengali">বাংলা</text>
      </g>

      <!-- Favorites Heart Button -->
      <g id="Cap_Favorites" transform="translate(120, 0)">
        <rect width="36" height="36" rx="11" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="18" y="23" fill="${t.textMuted}" font-size="15" text-anchor="middle">♡</text>
      </g>
    </g>
  </g>
  `;
}

// 4. Capacitor Android Bottom Navigation (412 x 64)
function renderCapacitorBottomNav(activeTab = 'Home', isDark = false, Y = 827) {
  const t = isDark ? TOKENS.dark : TOKENS.light;

  const tabs = [
    {
      id: 'Home',
      name: 'Home',
      icon: `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>`
    },
    {
      id: 'Explore',
      name: 'Explore',
      icon: `<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path><circle cx="12" cy="12" r="10"></circle>`
    },
    {
      id: 'Map',
      name: 'Map',
      icon: `<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle>`
    },
    {
      id: 'Planner',
      name: 'Planner',
      icon: `<circle cx="6" cy="19" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path><circle cx="18" cy="5" r="3"></circle>`
    },
    {
      id: 'More',
      name: 'More',
      icon: `<circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle><circle cx="5" cy="12" r="1.5"></circle>`
    }
  ];

  let itemsSvg = '';
  tabs.forEach((tab, i) => {
    const isActive = tab.id.toLowerCase() === activeTab.toLowerCase();
    const x = 12 + i * 78;
    const strokeColor = isActive ? t.red : t.navInactiveText;
    const textColor = isActive ? t.red : t.navInactiveText;
    const strokeW = isActive ? '2.4' : '1.8';

    itemsSvg += `
    <!-- Tab: ${tab.name} -->
    <g transform="translate(${x}, 6)">
      ${isActive ? `<rect x="0" y="0" width="70" height="48" rx="12" fill="${t.navActiveBg}"/>` : ''}
      <g transform="translate(25, 6)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round">
          ${tab.icon}
        </svg>
      </g>
      <text x="35" y="37" fill="${textColor}" font-size="11" font-weight="${isActive ? '700' : '600'}" text-anchor="middle">${tab.name}</text>
      ${isActive ? `<circle cx="35" cy="44" r="2" fill="${t.red}"/>` : ''}
    </g>
    `;
  });

  return `
  <!-- CAPACITOR ANDROID BOTTOM NAVIGATION (412 x 64, Y=${Y}) -->
  <g id="Capacitor_Bottom_Nav" transform="translate(0, ${Y})">
    <rect width="412" height="64" fill="${t.navBg}"/>
    <line x1="0" y1="0" x2="412" y2="0" stroke="${t.navBorder}" stroke-width="1"/>
    ${itemsSvg}
  </g>
  `;
}

// 5. Capacitor Android Footer
function renderCapacitorFooter(Y, isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
  <!-- CAPACITOR ANDROID FOOTER -->
  <g transform="translate(18, ${Y})">
    <line x1="0" y1="0" x2="376" y2="0" stroke="${t.cardBorder}" stroke-width="1"/>
    
    <g transform="translate(0, 18)">
      <text x="0" y="16" fill="${t.red}" font-size="15" font-weight="900" class="brand">PujoPath</text>
      <text x="78" y="16" fill="${t.textSubtle}" font-size="12">Kolkata Durga Puja Companion</text>
      <text x="0" y="36" fill="${t.textFaint}" font-size="11">Explore pandals, plan walking routes, check metro connectivity.</text>

      <g transform="translate(0, 56)">
        <text x="0" y="14" fill="${t.textSubtle}" font-size="11">© 2026 PujoPath. All rights reserved.</text>
        <text x="270" y="14" fill="${t.red}" font-size="11" font-weight="700">Helpline &amp; About ↗</text>
      </g>

      <g transform="translate(0, 84)">
        <rect width="376" height="32" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="16" y="20" fill="${t.textSubtle}" font-size="11">🌸 Festive Pandal &amp; Dhakis  ⏸ Pause</text>
        <text x="360" y="20" fill="${t.textFaint}" font-size="10" text-anchor="end">Made by Soumik &amp; Moumita with ❤️</text>
      </g>
    </g>
  </g>
  `;
}

// 6. Capacitor Android Floating Mini-Player (Floats directly above bottom nav)
function renderCapacitorMiniplayer(Y = 747, isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
  <!-- CAPACITOR FLOATING MINIPLAYER (Y=${Y}) -->
  <g id="Capacitor_Floating_Miniplayer" transform="translate(12, ${Y})">
    <!-- Container with Soft Elevation -->
    <rect width="388" height="70" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1" filter="drop-shadow(0 4px 12px ${t.shadow})"/>
    
    <!-- Top Thin Progress Bar (Red Active 35%) -->
    <rect x="0" y="0" width="138" height="3" rx="1.5" fill="${t.red}"/>

    <g transform="translate(14, 13)">
      <!-- Durga Artwork Thumbnail -->
      <g id="Miniplayer_Artwork">
        <rect width="44" height="44" rx="22" fill="#240c0c"/>
        <clipPath id="miniplayer-art-clip-${isDark ? 'dark' : 'light'}">
          <circle cx="22" cy="22" r="22"/>
        </clipPath>
        <g clip-path="url(#miniplayer-art-clip-${isDark ? 'dark' : 'light'})">
          <image href="${IMAGES.miniplayer}" width="44" height="44" preserveAspectRatio="xMidYMid slice"/>
        </g>
      </g>

      <!-- Track Information -->
      <g transform="translate(56, 4)">
        <text x="0" y="14" fill="${t.textMain}" font-size="13" font-weight="800">Bisarjan Dhak &amp; Asche Bocho...</text>
        <text x="0" y="28" fill="${t.textMuted}" font-size="10">Babughat Immersion Procession Dh...</text>
        <text x="0" y="40" fill="${t.red}" font-size="9" font-weight="700">00:31 / 01:38</text>
      </g>

      <!-- Controls (Play/Pause, Queue, Close) -->
      <g transform="translate(254, 4)">
        <!-- Red Circular Play/Pause Button -->
        <circle cx="20" cy="18" r="18" fill="${t.red}"/>
        <path d="M16 11 L27 18 L16 25 Z" fill="#FFFFFF"/>

        <!-- Playlist Queue Icon -->
        <text x="56" y="22" fill="${t.textMuted}" font-size="16">≡</text>

        <!-- Dismiss X Icon -->
        <text x="86" y="22" fill="${t.textMuted}" font-size="15">✕</text>
      </g>
    </g>
  </g>
  `;
}

module.exports = {
  IMAGES,
  TOKENS,
  SVG_STYLE,
  renderAndroidStatusBar,
  renderAndroidGesturePill,
  renderCapacitorHeader,
  renderCapacitorBottomNav,
  renderCapacitorFooter,
  renderCapacitorMiniplayer
};
