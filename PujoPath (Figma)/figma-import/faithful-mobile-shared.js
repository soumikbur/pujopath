const fs = require('fs');
const path = require('path');

const ASSETS = JSON.parse(fs.readFileSync(path.join(__dirname, 'desktop-assets-base64.json'), 'utf8'));

// Mobile Design Tokens for Light & Dark Modes
const TOKENS = {
  light: {
    bg: '#fcfaf7',
    card: '#ffffff',
    cardBorder: '#eee8e1',
    cardElevated: '#fdfbf7',
    cardInner: '#f9f6f1',
    textMain: '#1a1715',
    textMuted: '#57524c',
    textSubtle: '#736c65',
    textFaint: '#8c847c',
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
    headerBg: 'rgba(252, 250, 247, 0.96)',
    headerBorder: '#eee8e1',
    inputBg: '#ffffff',
    inputBorder: '#e5e0d8',
    blueBtn: '#0a66c2',
    blueLine: '#2563eb',
    greenLine: '#16a34a',
    amberStar: '#d97706',
    white: '#ffffff',
    themeIcon: '🌙',
    shadow: 'rgba(0,0,0,0.06)'
  },
  dark: {
    bg: '#0f0d0c',
    card: '#1a1613',
    cardBorder: '#2e2620',
    cardElevated: '#201b17',
    cardInner: '#25201b',
    textMain: '#ede5dc',
    textMuted: '#a89e95',
    textSubtle: '#786e65',
    textFaint: '#5a524a',
    red: '#b42323',
    redHover: '#961c1c',
    redPillBg: '#341b18',
    redPillBorder: '#5c221e',
    redPillText: '#fca5a5',
    navBg: '#14100e',
    navBorder: '#2e2620',
    navActiveBg: '#341b18',
    navActiveText: '#fca5a5',
    navInactiveText: '#a89e95',
    headerBg: 'rgba(15, 13, 12, 0.96)',
    headerBorder: '#2e2620',
    inputBg: '#1a1613',
    inputBorder: '#382e25',
    blueBtn: '#38bdf8',
    blueLine: '#3b82f6',
    greenLine: '#22c55e',
    amberStar: '#f59e0b',
    white: '#ffffff',
    themeIcon: '☼',
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
    </style>
  </defs>
`;

// Mobile Background
function renderMobileBackground(H, isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const overlayOpacity = isDark ? '0.78' : '0.45';

  return `
  <!-- MOBILE BACKGROUND -->
  <rect width="390" height="${H}" fill="${t.bg}"/>
  
  <!-- Festival Artwork Top Fade -->
  <g opacity="${isDark ? '0.35' : '0.22'}">
    <image href="${ASSETS.ghibliEveningBg}" width="390" height="340" preserveAspectRatio="xMidYMin slice"/>
    <rect width="390" height="340" fill="url(#bg_fade_${isDark ? 'dark' : 'light'})"/>
  </g>
  <defs>
    <linearGradient id="bg_fade_${isDark ? 'dark' : 'light'}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.bg}" stop-opacity="0.1"/>
      <stop offset="70%" stop-color="${t.bg}" stop-opacity="${overlayOpacity}"/>
      <stop offset="100%" stop-color="${t.bg}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  `;
}

// Mobile Header (390 x 56)
function renderMobileHeader(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
  <!-- STICKY MOBILE HEADER (56px) -->
  <g id="Mobile_Header">
    <rect width="390" height="56" fill="${t.headerBg}"/>
    <line x1="0" y1="56" x2="390" y2="56" stroke="${t.headerBorder}" stroke-width="1"/>

    <!-- Left Brand -->
    <text x="16" y="35" fill="${t.red}" font-size="20" font-weight="900" letter-spacing="-0.5">PujoPath</text>

    <!-- Right Controls -->
    <g transform="translate(182, 11)">
      <!-- Install App Pill -->
      <rect x="0" y="0" width="62" height="34" rx="10" fill="${t.red}"/>
      <text x="31" y="21" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">📥 App</text>

      <!-- Theme Mode Toggle -->
      <g transform="translate(68, 0)">
        <rect width="34" height="34" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="17" y="22" fill="${t.textMuted}" font-size="14" text-anchor="middle">${t.themeIcon}</text>
      </g>

      <!-- Language Pill -->
      <g transform="translate(108, 0)">
        <rect width="56" height="34" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <rect x="4" y="5" width="22" height="24" rx="6" fill="${t.red}"/>
        <text x="15" y="21" fill="#FFFFFF" font-size="10" font-weight="800" text-anchor="middle">EN</text>
        <text x="40" y="21" fill="${t.textMuted}" font-size="10" font-weight="600" text-anchor="middle" class="bengali">বাংলা</text>
      </g>

      <!-- Favorites Heart -->
      <g transform="translate(170, 0)">
        <rect width="34" height="34" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="17" y="22" fill="${t.textMuted}" font-size="14" text-anchor="middle">♡</text>
      </g>
    </g>
  </g>
  `;
}

// Mobile Bottom Navigation Bar (390 x 64)
function renderMobileBottomNav(activeTab = 'Home', isDark = false, Y = 780) {
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
    const x = 12 + i * 74;
    const strokeColor = isActive ? t.red : t.navInactiveText;
    const textColor = isActive ? t.red : t.navInactiveText;
    const strokeW = isActive ? '2.4' : '1.8';

    itemsSvg += `
    <!-- Tab: ${tab.name} -->
    <g transform="translate(${x}, 6)">
      ${isActive ? `<rect x="0" y="0" width="66" height="48" rx="12" fill="${t.navActiveBg}"/>` : ''}
      <g transform="translate(23, 6)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round">
          ${tab.icon}
        </svg>
      </g>
      <text x="33" y="37" fill="${textColor}" font-size="11" font-weight="${isActive ? '700' : '600'}" text-anchor="middle">${tab.name}</text>
      ${isActive ? `<circle cx="33" cy="44" r="2" fill="${t.red}"/>` : ''}
    </g>
    `;
  });

  return `
  <!-- FIXED MOBILE BOTTOM NAV (64px) -->
  <g id="Mobile_Bottom_Nav" transform="translate(0, ${Y})">
    <rect width="390" height="64" fill="${t.navBg}"/>
    <line x1="0" y1="0" x2="390" y2="0" stroke="${t.navBorder}" stroke-width="1"/>
    ${itemsSvg}
  </g>
  `;
}

// Mobile Footer
function renderMobileFooter(Y, isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
  <!-- MOBILE FOOTER -->
  <g transform="translate(16, ${Y})">
    <line x1="0" y1="0" x2="358" y2="0" stroke="${t.cardBorder}" stroke-width="1"/>
    
    <g transform="translate(0, 18)">
      <text x="0" y="16" fill="${t.red}" font-size="15" font-weight="800">PujoPath</text>
      <text x="76" y="16" fill="${t.textSubtle}" font-size="12">Kolkata Durga Puja Companion</text>
      <text x="0" y="36" fill="${t.textFaint}" font-size="11">Explore pandals, plan walking routes, check metro connectivity.</text>

      <g transform="translate(0, 56)">
        <text x="0" y="14" fill="${t.textSubtle}" font-size="11">© 2026 PujoPath. All rights reserved.</text>
        <text x="260" y="14" fill="${t.red}" font-size="11" font-weight="700">Helpline &amp; About ↗</text>
      </g>

      <g transform="translate(0, 84)">
        <rect width="358" height="32" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="16" y="20" fill="${t.textSubtle}" font-size="11">🌸 Festive Pandal &amp; Dhakis  ⏸ Pause</text>
        <text x="340" y="20" fill="${t.textFaint}" font-size="10" text-anchor="end">Made by Soumik &amp; Moumita with ❤️</text>
      </g>
    </g>
  </g>
  `;
}

module.exports = {
  ASSETS,
  TOKENS,
  SVG_STYLE,
  renderMobileBackground,
  renderMobileHeader,
  renderMobileBottomNav,
  renderMobileFooter
};
