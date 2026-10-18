const fs = require('fs');
const path = require('path');

const ASSETS = JSON.parse(fs.readFileSync(path.join(__dirname, 'desktop-assets-base64.json'), 'utf8'));
const OUT_DIR = path.resolve(__dirname, '../exports/web-desktop-faithful');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const C = {
  red: '#b42323',
  redHover: '#961c1c',
  redPillBg: '#341b18',
  redPillBorder: '#4d221e',
  redPillText: '#ff8787',
  
  darkBg: '#14110e',
  cardBg: '#1a1613',
  cardBorder: '#2f2720',
  headerBorder: '#2a241f',
  cardElevated: '#221c17',
  
  textMain: '#ede5dc',
  textMuted: '#a89e95',
  textFaint: '#6e645c',
  white: '#ffffff',
  
  blueBtn: '#0a66c2',
  blueLine: '#2563eb',
  greenLine: '#16a34a',
  purplePill: '#7c3aed',
  amberStar: '#f59e0b',
  teal: '#0d9488',
};

// Common SVG styles
const SVG_STYLE = `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800;900&amp;display=swap');
      text { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      .bengali { font-family: 'Hind Siliguri', 'Inter', sans-serif; }
    </style>
    <radialGradient id="vignette" cx="50%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#14110e" stop-opacity="0.2"/>
      <stop offset="55%" stop-color="#14110e" stop-opacity="0.58"/>
      <stop offset="100%" stop-color="#14110e" stop-opacity="0.88"/>
    </radialGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#221c17" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#1a1613" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="redBannerGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#961c1c"/>
      <stop offset="100%" stop-color="#4a1212"/>
    </linearGradient>
  </defs>
`;

// Shared Desktop Header (1440px wide, 65px high)
function renderHeader(activeRoute = '') {
  const nav = [
    { name: 'Explore', active: activeRoute === 'Explore' },
    { name: 'Map', active: activeRoute === 'Map' },
    { name: 'Plan', active: activeRoute === 'Plan' },
    { name: 'More ⌵', active: activeRoute === 'More' }
  ];

  let navItems = '';
  let nx = 340;
  nav.forEach(item => {
    const col = item.active ? C.white : '#d4c7ba';
    const bg = item.active ? '#201c18' : 'transparent';
    navItems += `
      <g transform="translate(${nx}, 13)">
        <rect width="78" height="38" rx="12" fill="${bg}"/>
        <text x="39" y="24" fill="${col}" font-size="14" font-weight="700" text-anchor="middle">${item.name}</text>
      </g>
    `;
    nx += 86;
  });

  return `
  <!-- HEADER (Height: 65px) -->
  <g id="Header_Desktop">
    <rect width="1440" height="65" fill="${C.darkBg}" fill-opacity="0.98"/>
    <line x1="0" y1="65" x2="1440" y2="65" stroke="${C.headerBorder}" stroke-width="1"/>

    <g transform="translate(144, 0)">
      <!-- Logo -->
      <text x="0" y="41" fill="${C.red}" font-size="20" font-weight="800" letter-spacing="-0.3">PujoPath</text>
      
      <!-- Nav items -->
      ${navItems}

      <!-- Right Actions: Install App, Mode, Lang, Saved -->
      <g transform="translate(740, 13)">
        <!-- Install App -->
        <g id="Btn_Install_App">
          <rect width="124" height="38" rx="12" fill="${C.red}"/>
          <text x="22" y="24" fill="${C.white}" font-size="14">📥</text>
          <text x="44" y="24" fill="${C.white}" font-size="14" font-weight="700">Install App</text>
        </g>
        <!-- Theme Toggle -->
        <g id="Btn_Theme_Toggle" transform="translate(136, 0)">
          <rect width="38" height="38" rx="19" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="19" y="24" fill="${C.amberStar}" font-size="16" text-anchor="middle">☼</text>
        </g>
        <!-- Lang Pill -->
        <g id="Pill_Lang_Toggle" transform="translate(186, 0)">
          <rect width="88" height="38" rx="12" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
          <!-- Active EN -->
          <rect x="4" y="4" width="38" height="30" rx="8" fill="${C.red}"/>
          <text x="23" y="23" fill="${C.white}" font-size="12" font-weight="700" text-anchor="middle">EN</text>
          <!-- Inactive বাংলা -->
          <text x="63" y="23" fill="#d4c7ba" font-size="12" font-weight="700" text-anchor="middle" class="bengali">বাংলা</text>
        </g>
        <!-- Saved Heart -->
        <g id="Btn_Saved_Trails" transform="translate(286, 0)">
          <rect width="38" height="38" rx="19" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="19" y="24" fill="#d4c7ba" font-size="15" text-anchor="middle">♡</text>
        </g>
      </g>
    </g>
  </g>
  `;
}

// Shared Desktop Footer
function renderFooter(yPos = 1450) {
  return `
  <!-- FOOTER (y=${yPos}) -->
  <g id="Footer_Desktop" transform="translate(0, ${yPos})">
    <rect width="1440" height="158" fill="#181411" fill-opacity="0.6"/>
    <line x1="0" y1="0" x2="1440" y2="0" stroke="${C.headerBorder}" stroke-width="1"/>

    <g transform="translate(144, 28)">
      <!-- Row 1: Brand & Mission -->
      <text x="0" y="22" fill="${C.red}" font-size="16" font-weight="800">PujoPath</text>
      <line x1="72" y1="8" x2="72" y2="26" stroke="${C.cardBorder}" stroke-width="1.5"/>
      <text x="84" y="22" fill="${C.textMain}" font-size="14" font-weight="600">Kolkata Durga Puja Companion</text>
      <text x="0" y="46" fill="${C.textMuted}" font-size="13">Explore pandals, plan walking routes, check metro connectivity, and celebrate Bengal.</text>

      <!-- Right: Helpline & About link -->
      <text x="1152" y="22" fill="${C.textMain}" font-size="14" font-weight="600" text-anchor="end">Helpline &amp; About</text>

      <!-- Divider line -->
      <line x1="0" y1="72" x2="1152" y2="72" stroke="${C.cardBorder}" stroke-width="1"/>

      <!-- Row 2: Copyright & Creator Attribution -->
      <g transform="translate(0, 98)">
        <text x="0" y="16" fill="${C.textMuted}" font-size="13">© 2026 PujoPath. All rights reserved.  •  🌸 Festive Pandal &amp; Dhakis  ⏸ Pause</text>
        <text x="1152" y="16" fill="${C.textMain}" font-size="13" font-weight="600" text-anchor="end">Made by Soumik &amp; Moumita with ❤️</text>
      </g>
    </g>
  </g>
  `;
}

// Background with authentic artwork and vignette
function renderBackground(height = 1650) {
  return `
  <!-- BACKGROUND ARTWORK & VIGNETTE -->
  <g id="Page_Background">
    <rect width="1440" height="${height}" fill="${C.darkBg}"/>
    <image href="${ASSETS.ghibliEveningBg}" width="1440" height="1000" preserveAspectRatio="xMidYMid slice" opacity="0.36"/>
    <rect width="1440" height="${height}" fill="url(#vignette)"/>
  </g>
  `;
}

console.log('Faithful Web Desktop Generator initialized successfully.');

module.exports = {
  OUT_DIR,
  ASSETS,
  C,
  SVG_STYLE,
  renderHeader,
  renderFooter,
  renderBackground
};
