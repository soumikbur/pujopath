const fs = require('fs');
const path = require('path');

const ASSETS = JSON.parse(fs.readFileSync(path.join(__dirname, 'desktop-assets-base64.json'), 'utf8'));
const OUT_DIR_LIGHT = path.resolve(__dirname, '../exports/web-desktop-faithful-light');
if (!fs.existsSync(OUT_DIR_LIGHT)) fs.mkdirSync(OUT_DIR_LIGHT, { recursive: true });

const CL = {
  red: '#b42323',
  redHover: '#961c1c',
  redPillBg: '#feeceb',
  redPillBorder: '#fca5a5',
  redPillText: '#b42323',
  
  lightBg: '#fcfaf7',        // Warm cream body background
  cardBg: '#ffffff',         // Clean white cards
  cardBorder: '#eee8e1',     // Soft warm card border (rgb(238, 232, 225))
  cardBorderSubtle: '#f0eae1',
  headerBorder: '#eee8e1',   // 1px solid rgb(238, 232, 225)
  cardElevated: '#fdfbf7',   // Elevated card background
  cardInner: '#f9f6f1',      // Sub-card background
  inputBg: '#fcfaf7',
  
  textMain: '#1a1715',       // Deep charcoal/black text (#1a1715 or #242424)
  textMuted: '#57524c',      // Medium warm grey body text
  textFaint: '#8c847c',      // Subtle caption / timestamp text
  textSubtle: '#736c65',
  white: '#ffffff',
  
  blueBtn: '#0a66c2',
  blueLine: '#2563eb',
  greenLine: '#16a34a',
  purplePill: '#7c3aed',
  amberStar: '#d97706',
  teal: '#0d9488',
  
  // Badges & pills
  badgeDirectAudioBg: '#dcfce7',
  badgeDirectAudioText: '#15803d',
  badgeAuthStreamBg: '#fee2e2',
  badgeAuthStreamText: '#b91c1c',
  
  yellowAlertBg: '#fffbeb',
  yellowAlertBorder: '#fde68a',
  yellowAlertText: '#92400e',
  
  blueBannerBg: '#eff6ff',
  blueBannerBorder: '#bfdbfe',
  blueBannerTitle: '#1e3a8a',
  blueBannerText: '#1e40af',
  
  redBannerBg: '#991b1b', // Red all-night metro banner
  redBannerText: '#ffffff'
};

// Common SVG styles for Light Mode
const SVG_STYLE_LIGHT = `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800;900&amp;display=swap');
      text { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      .bengali { font-family: 'Hind Siliguri', 'Inter', sans-serif; }
    </style>
    <radialGradient id="vignetteLight" cx="50%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#fcfaf7" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#fcfaf7" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#fcfaf7" stop-opacity="0.96"/>
    </radialGradient>
    <filter id="softShadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#4a3b32" flood-opacity="0.05"/>
    </filter>
  </defs>
`;

// Shared Desktop Header for Light Mode (1440px wide, 65px high)
function renderHeaderLight(activeRoute = '') {
  const nav = [
    { name: 'Explore', active: activeRoute === 'Explore' },
    { name: 'Map', active: activeRoute === 'Map' },
    { name: 'Plan', active: activeRoute === 'Plan' },
    { name: 'More ⌵', active: activeRoute === 'More' }
  ];

  let navItems = '';
  let nx = 340;
  nav.forEach(item => {
    const col = item.active ? CL.textMain : CL.textMuted;
    const bg = item.active ? '#f5efe6' : 'transparent';
    navItems += `
      <g transform="translate(${nx}, 13)">
        <rect width="78" height="38" rx="12" fill="${bg}"/>
        <text x="39" y="24" fill="${col}" font-size="14" font-weight="700" text-anchor="middle">${item.name}</text>
      </g>
    `;
    nx += 86;
  });

  return `
  <!-- HEADER LIGHT (Height: 65px) -->
  <g id="Header_Desktop_Light">
    <rect width="1440" height="65" fill="${CL.white}" fill-opacity="0.88"/>
    <line x1="0" y1="65" x2="1440" y2="65" stroke="${CL.headerBorder}" stroke-width="1"/>

    <g transform="translate(144, 0)">
      <!-- Logo -->
      <text x="0" y="41" fill="${CL.red}" font-size="20" font-weight="800" letter-spacing="-0.3">PujoPath</text>
      
      <!-- Nav items -->
      ${navItems}

      <!-- Right Actions: Install App, Mode, Lang, Saved -->
      <g transform="translate(740, 13)">
        <!-- Install App -->
        <g id="Btn_Install_App">
          <rect width="124" height="38" rx="12" fill="${CL.red}"/>
          <text x="22" y="24" fill="${CL.white}" font-size="14">📥</text>
          <text x="44" y="24" fill="${CL.white}" font-size="14" font-weight="700">Install App</text>
        </g>
        <!-- Theme Toggle (Moon icon in light mode) -->
        <g id="Btn_Theme_Toggle" transform="translate(136, 0)">
          <rect width="38" height="38" rx="12" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="19" y="24" fill="${CL.textMuted}" font-size="15" text-anchor="middle">🌙</text>
        </g>
        <!-- Lang Pill -->
        <g id="Pill_Lang_Toggle" transform="translate(186, 0)">
          <rect width="88" height="38" rx="12" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <!-- Active EN -->
          <rect x="4" y="4" width="38" height="30" rx="8" fill="${CL.red}"/>
          <text x="23" y="23" fill="${CL.white}" font-size="12" font-weight="700" text-anchor="middle">EN</text>
          <!-- Inactive বাংলা -->
          <text x="63" y="23" fill="${CL.textMuted}" font-size="12" font-weight="700" text-anchor="middle" class="bengali">বাংলা</text>
        </g>
        <!-- Saved Heart -->
        <g id="Btn_Saved_Trails" transform="translate(286, 0)">
          <rect width="38" height="38" rx="12" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="19" y="24" fill="${CL.textMuted}" font-size="15" text-anchor="middle">♡</text>
        </g>
      </g>
    </g>
  </g>
  `;
}

// Shared Desktop Footer for Light Mode
function renderFooterLight(yPos = 1450) {
  return `
  <!-- FOOTER LIGHT (y=${yPos}) -->
  <g id="Footer_Desktop_Light" transform="translate(0, ${yPos})">
    <rect width="1440" height="158" fill="${CL.white}" fill-opacity="0.85"/>
    <line x1="0" y1="0" x2="1440" y2="0" stroke="${CL.headerBorder}" stroke-width="1"/>

    <g transform="translate(144, 28)">
      <!-- Row 1: Brand & Mission -->
      <text x="0" y="22" fill="${CL.red}" font-size="16" font-weight="800">PujoPath</text>
      <line x1="72" y1="8" x2="72" y2="26" stroke="${CL.cardBorder}" stroke-width="1.5"/>
      <text x="84" y="22" fill="${CL.textMain}" font-size="14" font-weight="600">Kolkata Durga Puja Companion</text>
      <text x="0" y="46" fill="${CL.textMuted}" font-size="13">Explore pandals, plan walking routes, check metro connectivity, and celebrate Bengal.</text>

      <!-- Right: Helpline & About link -->
      <text x="1152" y="22" fill="${CL.textMain}" font-size="14" font-weight="600" text-anchor="end">Helpline &amp; About</text>

      <!-- Divider line -->
      <line x1="0" y1="72" x2="1152" y2="72" stroke="${CL.cardBorder}" stroke-width="1"/>

      <!-- Row 2: Copyright & Creator Attribution -->
      <g transform="translate(0, 98)">
        <text x="0" y="16" fill="${CL.textMuted}" font-size="13">© 2026 PujoPath. All rights reserved.  •  🌸 Festive Pandal &amp; Dhakis  ⏸ Pause</text>
        <text x="1152" y="16" fill="${CL.textMain}" font-size="13" font-weight="600" text-anchor="end">Made by Soumik &amp; Moumita with ❤️</text>
      </g>
    </g>
  </g>
  `;
}

// Background for Light Mode with subtle authentic mandala corner motifs
function renderBackgroundLight(height = 1650, hasCrowd = true) {
  const mandalaWatermark = `
    <!-- Subtle Golden/Sepia Mandala Watermarks -->
    <g opacity="0.14" stroke="#c4b5a5" stroke-width="1" fill="none">
      <!-- Left Watermark -->
      <g transform="translate(60, 160)">
        <circle cx="0" cy="0" r="140"/>
        <circle cx="0" cy="0" r="105"/>
        <circle cx="0" cy="0" r="70"/>
        <circle cx="0" cy="0" r="35"/>
        <line x1="-140" y1="0" x2="140" y2="0"/>
        <line x1="0" y1="-140" x2="0" y2="140"/>
        <line x1="-100" y1="-100" x2="100" y2="100"/>
        <line x1="-100" y1="100" x2="100" y2="-100"/>
        <path d="M 0,-105 Q 35,-70 0,-35 Q -35,-70 0,-105 Z"/>
        <path d="M 0,105 Q 35,70 0,35 Q -35,70 0,105 Z"/>
        <path d="M -105,0 Q -70,35 -35,0 Q -70,-35 -105,0 Z"/>
        <path d="M 105,0 Q 70,35 35,0 Q 70,-35 105,0 Z"/>
      </g>
      <!-- Right Watermark -->
      <g transform="translate(1380, 160)">
        <circle cx="0" cy="0" r="140"/>
        <circle cx="0" cy="0" r="105"/>
        <circle cx="0" cy="0" r="70"/>
        <circle cx="0" cy="0" r="35"/>
        <line x1="-140" y1="0" x2="140" y2="0"/>
        <line x1="0" y1="-140" x2="0" y2="140"/>
        <line x1="-100" y1="-100" x2="100" y2="100"/>
        <line x1="-100" y1="100" x2="100" y2="-100"/>
        <path d="M 0,-105 Q 35,-70 0,-35 Q -35,-70 0,-105 Z"/>
        <path d="M 0,105 Q 35,70 0,35 Q -35,70 0,105 Z"/>
        <path d="M -105,0 Q -70,35 -35,0 Q -70,-35 -105,0 Z"/>
        <path d="M 105,0 Q 70,35 35,0 Q 70,-35 105,0 Z"/>
      </g>
    </g>
  `;

  if (hasCrowd) {
    return `
    <!-- BACKGROUND LIGHT WITH WARM FESTIVE ARTWORK -->
    <g id="Page_Background_Light">
      <rect width="1440" height="${height}" fill="${CL.lightBg}"/>
      <image href="${ASSETS.ghibliEveningBg}" width="1440" height="1000" preserveAspectRatio="xMidYMid slice" opacity="0.18"/>
      <rect width="1440" height="${height}" fill="url(#vignetteLight)"/>
      ${mandalaWatermark}
    </g>
    `;
  }
  return `
  <!-- BACKGROUND LIGHT WITH WARM CREAM -->
  <g id="Page_Background_Light">
    <rect width="1440" height="${height}" fill="${CL.lightBg}"/>
    ${mandalaWatermark}
  </g>
  `;
}

module.exports = {
  OUT_DIR_LIGHT,
  ASSETS,
  CL,
  SVG_STYLE_LIGHT,
  renderHeaderLight,
  renderFooterLight,
  renderBackgroundLight
};
