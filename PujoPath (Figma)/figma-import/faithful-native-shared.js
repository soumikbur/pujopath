const fs = require('fs');
const path = require('path');

const { IMAGES } = require('./authentic-tokens-and-assets');

// Native Android Design Tokens for Light & Dark Modes
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
    headerBg: '#ffffff',
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
    headerBg: '#181411',
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
function renderNativeStatusBar(isDark = false, isFullscreenDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const iconColor = isFullscreenDark ? '#FFFFFF' : t.statusBarIcon;
  const bgColor = isFullscreenDark ? 'none' : t.statusBarBg;

  return `
  <!-- ANDROID SYSTEM STATUS BAR (412 x 40) -->
  <g id="Native_Status_Bar">
    <rect width="412" height="40" fill="${bgColor}"/>
    <text x="24" y="26" fill="${iconColor}" font-size="14" font-weight="600">9:10</text>
    
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
function renderNativeGesturePill(Y = 891, isDark = false, width = 412) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const pillX = Math.round((width - 72) / 2);

  return `
  <!-- ANDROID SYSTEM GESTURE NAVIGATION PILL (Y=${Y}) -->
  <g id="Native_Gesture_Pill" transform="translate(0, ${Y})">
    <rect width="${width}" height="24" fill="none"/>
    <rect x="${pillX}" y="10" width="72" height="4" rx="2" fill="${t.gesturePill}" fill-opacity="${t.gesturePillOpacity}"/>
  </g>
  `;
}

// 3. Native App Header (412 x 56)
function renderNativeHeader(title = '', isDark = false, options = {}) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const showBack = options.showBack || false;
  const festivalPill = options.festivalPill || '🌸 Durga Puja';

  let leftAction = `
    <!-- Brand / Back -->
    <g transform="translate(18, 12)">
      <text x="0" y="26" fill="${t.red}" font-size="22" font-weight="900" letter-spacing="-0.5" class="brand">PujoPath</text>
    </g>
  `;

  if (showBack) {
    leftAction = `
      <!-- Back Arrow -->
      <g transform="translate(16, 10)">
        <circle cx="18" cy="18" r="18" fill="${isDark ? '#26201b' : '#f0eae2'}"/>
        <path d="M22 18H14M14 18L18 14M14 18L18 22" stroke="${t.textMain}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <text x="60" y="36" fill="${t.textMain}" font-size="18" font-weight="700">${title}</text>
    `;
  } else if (festivalPill) {
    leftAction += `
      <!-- Festival Edition Pill -->
      <g transform="translate(122, 14)">
        <rect width="102" height="28" rx="14" fill="${t.redPillBg}" stroke="${t.redPillBorder}" stroke-width="1"/>
        <text x="51" y="19" fill="${t.redPillText}" font-size="11" font-weight="700" text-anchor="middle">${festivalPill}</text>
      </g>
    `;
  }

  return `
  <!-- NATIVE REACT NATIVE APP HEADER (412 x 56) -->
  <g id="Native_Header" transform="translate(0, 40)">
    <rect width="412" height="56" fill="${t.headerBg}"/>
    <line x1="0" y1="56" x2="412" y2="56" stroke="${t.headerBorder}" stroke-width="1"/>

    ${leftAction}

    <!-- Right Controls: Theme Toggle, Language, Heart, Bell -->
    <g id="Native_Controls" transform="translate(200, 10)">
      <!-- Theme Toggle -->
      <g id="Theme_Toggle">
        <rect width="34" height="36" rx="11" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="17" y="23" fill="${t.textMuted}" font-size="13" text-anchor="middle">${t.themeIcon}</text>
      </g>

      <!-- Language Pill -->
      <g id="Lang_Pill" transform="translate(40, 0)">
        <rect width="66" height="36" rx="11" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <rect x="2" y="3" width="28" height="30" rx="8" fill="${t.red}"/>
        <text x="16" y="22" fill="#FFFFFF" font-size="10" font-weight="800" text-anchor="middle">EN</text>
        <text x="46" y="22" fill="${t.textMuted}" font-size="11" font-weight="600" text-anchor="middle" class="bengali">বাংলা</text>
      </g>

      <!-- Favorites Heart with badge -->
      <g id="Favorites_Btn" transform="translate(112, 0)">
        <rect width="36" height="36" rx="11" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="18" y="24" fill="${t.textMuted}" font-size="15" text-anchor="middle">♡</text>
        <circle cx="28" cy="8" r="6" fill="${t.red}"/>
        <text x="28" y="11" fill="#FFFFFF" font-size="8" font-weight="800" text-anchor="middle">1</text>
      </g>

      <!-- Notification Bell -->
      <g id="Bell_Btn" transform="translate(154, 0)">
        <rect width="36" height="36" rx="11" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="18" y="23" fill="${t.textMuted}" font-size="14" text-anchor="middle">🔔</text>
      </g>
    </g>
  </g>
  `;
}

// 4. Native 5-Tab Bottom Navigation (412 x 64) with Active Dot & Spring Scaling
function renderNativeBottomNav(activeTab = 'Home', isDark = false, Y = 827) {
  const t = isDark ? TOKENS.dark : TOKENS.light;

  const tabs = [
    { id: 'Home', name: 'Home', icon: 'M3 10L12 3L21 10V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10Z' },
    { id: 'Explore', name: 'Explore', icon: 'M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16 8L13.5 13.5L8 16L10.5 10.5L16 8Z' },
    { id: 'Map', name: 'Map', icon: 'M12 2C8.1 2 5 5.1 5 9C5 14.2 12 22 12 22C12 22 19 14.2 19 9C19 5.1 15.9 2 12 2ZM12 11.5C10.6 11.5 9.5 10.4 9.5 9C9.5 7.6 10.6 6.5 12 6.5C13.4 6.5 14.5 7.6 14.5 9C14.5 10.4 13.4 11.5 12 11.5Z' },
    { id: 'Planner', name: 'Planner', icon: 'M4 19C4 17.3 5.3 16 7 16H17C18.7 16 20 17.3 20 19M12 4V12M8 8H16' },
    { id: 'More', name: 'More', icon: 'M6 12C6 12.5 5.5 13 5 13C4.5 13 4 12.5 4 12C4 11.5 4.5 11 5 11C5.5 11 6 11.5 6 12ZM13 12C13 12.5 12.5 13 12 13C11.5 13 11 12.5 11 12C11 11.5 11.5 11 12 11C12.5 11 13 11.5 13 12ZM20 12C20 12.5 19.5 13 19 13C18.5 13 18 12.5 18 12C18 11.5 18.5 11 19 11C19.5 11 20 11.5 20 12Z' }
  ];

  let tabItems = '';
  const tabWidth = 412 / 5;

  tabs.forEach((tab, index) => {
    const isActive = tab.id === activeTab;
    const xPos = index * tabWidth;
    const iconColor = isActive ? t.red : t.navInactiveText;
    const labelColor = isActive ? t.red : t.navInactiveText;
    const fontWeight = isActive ? '700' : '500';

    tabItems += `
      <!-- Tab: ${tab.name} -->
      <g transform="translate(${xPos}, 0)">
        <rect width="${tabWidth}" height="64" fill="none"/>
        <g transform="translate(${tabWidth / 2}, 18)">
          <path d="${tab.icon}" fill="${isActive ? iconColor : 'none'}" stroke="${iconColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" transform="translate(-12, -12)"/>
        </g>
        <text x="${tabWidth / 2}" y="48" fill="${labelColor}" font-size="11" font-weight="${fontWeight}" text-anchor="middle">${tab.name}</text>
        ${isActive ? `<circle cx="${tabWidth / 2}" cy="56" r="2.5" fill="${t.red}"/>` : ''}
      </g>
    `;
  });

  return `
  <!-- NATIVE 5-TAB BOTTOM NAVIGATION BAR (Y=${Y}) -->
  <g id="Native_Bottom_Nav" transform="translate(0, ${Y})">
    <rect width="412" height="64" fill="${t.navBg}"/>
    <line x1="0" y1="0" x2="412" y2="0" stroke="${t.navBorder}" stroke-width="1"/>
    ${tabItems}
  </g>
  `;
}

module.exports = {
  TOKENS,
  IMAGES,
  SVG_STYLE,
  renderNativeStatusBar,
  renderNativeGesturePill,
  renderNativeHeader,
  renderNativeBottomNav
};
