const fs = require('fs');
const path = require('path');

const FIGMA_DIR = path.resolve(__dirname, '..');
const EXPORTS_DIR = path.join(FIGMA_DIR, 'exports');
const ASSETS_DIR = path.join(FIGMA_DIR, 'assets', 'images');

// Helper to get base64 data URI
function getBase64Image(relPath, mime = 'image/jpeg') {
  const fullPath = path.join(ASSETS_DIR, relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn('Image not found:', fullPath);
    return '';
  }
  const buf = fs.readFileSync(fullPath);
  if (relPath.endsWith('.webp')) mime = 'image/webp';
  else if (relPath.endsWith('.png')) mime = 'image/png';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

// Load authentic image assets
console.log('Loading authentic images...');
const IMAGES = {
  moumita: getBase64Image('developers/moumita.jpg'),
  soumik: getBase64Image('developers/soumik.jpg'),
  bagbazar: getBase64Image('pandals/bagbazar-sarbojanin.jpg'),
  kumartuli: getBase64Image('pandals/kumartuli-park.jpg'),
  sovabazar: getBase64Image('pandals/sovabazar-rajbari.jpg'),
  suruchi: getBase64Image('pandals/suruchi-sangha.jpg'),
  ekdalia: getBase64Image('pandals/ekdalia-evergreen.jpg'),
  sreebhumi: getBase64Image('pandals/sreebhumi-sporting-club.jpg'),
  collegeSquare: getBase64Image('pandals/college-square.jpg'),
  ghibliBg: getBase64Image('backgrounds/ghibli-durga-idol-flowers-landscape.jpg'),
  durgaBg: getBase64Image('durga-bg.jpg'),
  miniplayer: getBase64Image('backgrounds/durga-miniplayer.jpg'),
};

console.log('Images loaded successfully.');

// Color tokens
const RED = '#b42323';
const RED_HOVER = '#971e1e';
const RED_SOFT = '#fbe8e6';
const RED_BORDER = '#f5c6c2';
const BG_CREAM = '#FCFAF7';
const BG_WHITE = '#FFFFFF';
const BG_SURFACE = '#F5F1EB';
const TEXT_MAIN = '#1a1715';
const TEXT_DARK = '#242424';
const TEXT_SEC = '#5C524A';
const TEXT_MUTED = '#776d65';
const TEXT_FAINT = '#8f847b';
const BORDER = '#eee8e1';
const BORDER_LIGHT = '#f0eae2';
const LINKEDIN_BLUE = '#0a66c2';
const GOLD = '#d97706';

// Common defs
const SVG_DEFS = `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800;900&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      text { font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
      .brand { font-family: 'Inter', system-ui, sans-serif; font-weight: 800; }
      .bengali { font-family: 'Hind Siliguri', 'Inter', sans-serif; }
    </style>
    <clipPath id="moumita-clip"><rect width="96" height="96" rx="16"/></clipPath>
    <clipPath id="soumik-clip"><rect width="96" height="96" rx="16"/></clipPath>
    <clipPath id="moumita-mob-clip"><rect width="80" height="80" rx="16"/></clipPath>
    <clipPath id="soumik-mob-clip"><rect width="80" height="80" rx="16"/></clipPath>
    <clipPath id="highlight-1-clip"><rect width="110" height="80" rx="12"/></clipPath>
    <clipPath id="highlight-2-clip"><rect width="110" height="80" rx="12"/></clipPath>
    <clipPath id="highlight-3-clip"><rect width="110" height="80" rx="12"/></clipPath>
    <clipPath id="pandal-1-clip"><rect width="406" height="190" rx="16"/></clipPath>
    <clipPath id="pandal-2-clip"><rect width="406" height="190" rx="16"/></clipPath>
    <clipPath id="pandal-3-clip"><rect width="406" height="190" rx="16"/></clipPath>
    <clipPath id="pandal-4-clip"><rect width="406" height="190" rx="16"/></clipPath>
    <clipPath id="pandal-5-clip"><rect width="406" height="190" rx="16"/></clipPath>
    <clipPath id="pandal-6-clip"><rect width="406" height="190" rx="16"/></clipPath>
    <clipPath id="mob-pandal-clip"><rect width="358" height="180" rx="16"/></clipPath>
  </defs>
`;

// =========================================================================
// HEADER COMPONENTS
// =========================================================================

// Desktop Header (1440px wide, 64px high)
function renderDesktopHeader(activeTab = 'Explore') {
  return `
  <!-- DESKTOP STICKY HEADER (64px) -->
  <g id="Header_Desktop">
    <rect width="1440" height="64" fill="${BG_CREAM}" fill-opacity="0.98"/>
    <line x1="0" y1="64" x2="1440" y2="64" stroke="${BORDER}" stroke-width="1"/>

    <g transform="translate(80, 14)">
      <!-- Brand Logo (Pure text, NO red square) -->
      <g id="Brand_Logo" transform="translate(0, 8)">
        <text x="0" y="20" fill="${RED}" font-size="22" font-weight="800" letter-spacing="-0.5" class="brand">PujoPath</text>
      </g>

      <!-- Desktop Primary Nav Links -->
      <g id="Desktop_Nav_Links" transform="translate(340, 2)">
        ${renderDesktopTab('Explore', 0, activeTab === 'Explore')}
        ${renderDesktopTab('Map', 95, activeTab === 'Map')}
        ${renderDesktopTab('Plan', 165, activeTab === 'Plan')}
        <!-- More Dropdown -->
        <g id="More_Dropdown" transform="translate(235, 0)">
          <rect width="80" height="36" rx="12" fill="${activeTab === 'More' ? '#f9e9e7' : 'transparent'}"/>
          <text x="14" y="23" fill="${activeTab === 'More' ? RED : '#625b55'}" font-size="14" font-weight="700">More</text>
          <path d="M54 20 L58 24 L62 20" stroke="${activeTab === 'More' ? RED : '#625b55'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>
      </g>

      <!-- Right Controls -->
      <g id="Header_Right_Controls" transform="translate(930, 0)">
        <!-- Install App (APK) Button -->
        <g id="Install_App_Button" transform="translate(0, 0)">
          <rect width="130" height="36" rx="12" fill="${RED}"/>
          <!-- Download Icon -->
          <path d="M22 17 L22 23 M19 20 L22 23 L25 20 M22 13 L22 20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <text x="74" y="23" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Install App</text>
        </g>

        <!-- Theme Switcher Toggle (Sun / Moon) -->
        <g id="Theme_Toggle" transform="translate(142, 0)">
          <rect width="36" height="36" rx="12" fill="${BG_CREAM}" stroke="#e8e1d9" stroke-width="1"/>
          <!-- Moon Icon -->
          <path d="M24 14 A6 6 0 1 1 18 24 A8 8 0 0 0 24 14 Z" fill="#625b55"/>
        </g>

        <!-- Language Switcher Pill (EN / বাংলা) -->
        <g id="Language_Switcher" transform="translate(190, 0)">
          <rect width="78" height="36" rx="12" fill="${BG_CREAM}" stroke="#e8e1d9" stroke-width="1"/>
          <!-- EN selected -->
          <rect x="2" y="2" width="36" height="32" rx="10" fill="${RED}"/>
          <text x="20" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">EN</text>
          <!-- বাংলা unselected -->
          <text x="56" y="22" fill="#625b55" font-size="12" font-weight="700" text-anchor="middle" class="bengali">বাংলা</text>
        </g>

        <!-- Saved Pandals Heart with Counter Badge -->
        <g id="Saved_Heart_Button" transform="translate(280, 0)">
          <rect width="36" height="36" rx="12" fill="${BG_CREAM}" stroke="#e8e1d9" stroke-width="1"/>
          <!-- Heart Icon -->
          <path d="M18 24 C14 20 12 18 12 15 A3.5 3.5 0 0 1 18 13.5 A3.5 3.5 0 0 1 24 15 C24 18 22 20 18 24 Z" stroke="#625b55" stroke-width="1.8" fill="none"/>
          <!-- Badge -->
          <circle cx="32" cy="6" r="7" fill="${RED}"/>
          <text x="32" y="9.5" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">3</text>
        </g>
      </g>
    </g>
  </g>
  `;
}

function renderDesktopTab(label, x, isActive) {
  if (isActive) {
    return `
    <g transform="translate(${x}, 0)">
      <rect width="${label.length * 9 + 28}" height="36" rx="12" fill="#f9e9e7"/>
      <text x="${(label.length * 9 + 28) / 2}" y="23" fill="${RED}" font-size="14" font-weight="700" text-anchor="middle">${label}</text>
    </g>`;
  }
  return `
  <g transform="translate(${x}, 0)">
    <text x="14" y="23" fill="#625b55" font-size="14" font-weight="700">${label}</text>
  </g>`;
}

// Mobile Web Header (390px wide, 60px high)
function renderMobileWebHeader() {
  return `
  <!-- MOBILE STICKY HEADER (60px) -->
  <g id="Header_Mobile">
    <rect width="390" height="60" fill="${BG_CREAM}" fill-opacity="0.98"/>
    <line x1="0" y1="60" x2="390" y2="60" stroke="${BORDER}" stroke-width="1"/>

    <g transform="translate(16, 12)">
      <!-- Brand Logo -->
      <text x="0" y="25" fill="${RED}" font-size="20" font-weight="800" letter-spacing="-0.5" class="brand">PujoPath</text>

      <!-- Right Controls -->
      <g transform="translate(186, 0)">
        <!-- App Download Button -->
        <g id="Mobile_App_Btn">
          <rect width="52" height="34" rx="10" fill="${RED}"/>
          <path d="M14 16 L14 21 M11 18 L14 21 L17 18 M14 12 L14 18" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <text x="32" y="21" fill="#FFFFFF" font-size="11" font-weight="700">App</text>
        </g>

        <!-- Theme Toggle -->
        <g id="Mobile_Theme_Toggle" transform="translate(58, 0)">
          <rect width="34" height="34" rx="10" fill="${BG_CREAM}" stroke="#e8e1d9" stroke-width="1"/>
          <path d="M22 13 A5 5 0 1 1 17 21 A6.5 6.5 0 0 0 22 13 Z" fill="#625b55"/>
        </g>

        <!-- Lang Switch -->
        <g id="Mobile_Lang_Toggle" transform="translate(98, 0)">
          <rect width="58" height="34" rx="10" fill="${BG_CREAM}" stroke="#e8e1d9" stroke-width="1"/>
          <rect x="2" y="2" width="26" height="30" rx="8" fill="${RED}"/>
          <text x="15" y="20" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">EN</text>
          <text x="42" y="20" fill="#625b55" font-size="10" font-weight="700" text-anchor="middle" class="bengali">বাং</text>
        </g>

        <!-- Saved Heart -->
        <g id="Mobile_Heart_Btn" transform="translate(162, 0)">
          <rect width="34" height="34" rx="10" fill="${BG_CREAM}" stroke="#e8e1d9" stroke-width="1"/>
          <path d="M17 22 C13.5 18.5 12 16.5 12 14 A3 3 0 0 1 17 12.5 A3 3 0 0 1 22 14 C22 16.5 20.5 18.5 17 22 Z" stroke="#625b55" stroke-width="1.6" fill="none"/>
        </g>
      </g>
    </g>
  </g>
  `;
}

// Capacitor Android Header (412px wide, NO App download button, with 40px Android Status Bar)
function renderCapacitorHeader() {
  return `
  <!-- ANDROID SYSTEM STATUS BAR (40px) -->
  <g id="Android_Status_Bar">
    <rect width="412" height="40" fill="${BG_CREAM}"/>
    <text x="20" y="26" fill="${TEXT_DARK}" font-size="14" font-weight="600">9:34</text>
    <g transform="translate(328, 14)">
      <text x="0" y="12" fill="${TEXT_DARK}" font-size="11" font-weight="700">5G</text>
      <!-- Signal bars -->
      <path d="M22 22 L22 14 M25 22 L25 10 M28 22 L28 6 M31 22 L31 2" stroke="${TEXT_DARK}" stroke-width="2" stroke-linecap="round"/>
      <!-- Battery outline -->
      <rect x="38" y="8" width="18" height="10" rx="2" stroke="${TEXT_DARK}" stroke-width="1.5" fill="none"/>
      <rect x="40" y="10" width="12" height="6" fill="${TEXT_DARK}"/>
      <line x1="57" y1="11" x2="57" y2="15" stroke="${TEXT_DARK}" stroke-width="1.5"/>
    </g>
  </g>

  <!-- CAPACITOR HEADER BAR (60px) - NO APK BUTTON -->
  <g id="Header_Capacitor" transform="translate(0, 40)">
    <rect width="412" height="60" fill="${BG_CREAM}" fill-opacity="0.98"/>
    <line x1="0" y1="60" x2="412" y2="60" stroke="${BORDER}" stroke-width="1"/>

    <g transform="translate(18, 12)">
      <!-- Brand Logo -->
      <text x="0" y="25" fill="${RED}" font-size="20" font-weight="800" letter-spacing="-0.5" class="brand">PujoPath</text>

      <!-- Right Controls: Theme + Lang + Saved (NO APK Button) -->
      <g transform="translate(230, 0)">
        <!-- Theme Toggle -->
        <g id="Cap_Theme_Toggle" transform="translate(0, 0)">
          <rect width="36" height="36" rx="12" fill="${BG_CREAM}" stroke="#e8e1d9" stroke-width="1"/>
          <path d="M24 14 A5.5 5.5 0 1 1 18 23 A7 7 0 0 0 24 14 Z" fill="#625b55"/>
        </g>

        <!-- Lang Switch -->
        <g id="Cap_Lang_Toggle" transform="translate(42, 0)">
          <rect width="76" height="36" rx="12" fill="${BG_CREAM}" stroke="#e8e1d9" stroke-width="1"/>
          <rect x="2" y="2" width="34" height="32" rx="10" fill="${RED}"/>
          <text x="19" y="22" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">EN</text>
          <text x="55" y="22" fill="#625b55" font-size="11" font-weight="700" text-anchor="middle" class="bengali">বাংলা</text>
        </g>

        <!-- Saved Heart -->
        <g id="Cap_Heart_Btn" transform="translate(124, 0)">
          <rect width="36" height="36" rx="12" fill="${BG_CREAM}" stroke="#e8e1d9" stroke-width="1"/>
          <path d="M18 24 C14 20 12 18 12 15 A3.5 3.5 0 0 1 18 13.5 A3.5 3.5 0 0 1 24 15 C24 18 22 20 18 24 Z" stroke="#625b55" stroke-width="1.8" fill="none"/>
        </g>
      </g>
    </g>
  </g>
  `;
}

// =========================================================================
// FOOTER COMPONENTS
// =========================================================================

// Authoritative Desktop Footer (1440px wide)
function renderDesktopFooter(y, showPause = true) {
  return `
  <!-- AUTHORITATIVE PRODUCTION FOOTER (Desktop) -->
  <g id="Footer_Desktop" transform="translate(0, ${y})">
    <rect width="1440" height="180" fill="${BG_WHITE}" fill-opacity="0.8"/>
    <line x1="0" y1="0" x2="1440" y2="0" stroke="${BORDER}" stroke-width="1"/>

    <g transform="translate(80, 36)">
      <!-- Row 1: Brand & Cultural Tagline + Helpline & About -->
      <g id="Footer_Row_1">
        <!-- Brand + Tagline -->
        <text x="0" y="16" fill="${RED}" font-size="16" font-weight="900" class="brand">PujoPath</text>
        <text x="76" y="16" fill="#a89e95" font-size="14">|</text>
        <text x="90" y="16" fill="#776d65" font-size="13" font-weight="600">Kolkata Durga Puja Companion</text>
        <text x="0" y="38" fill="#8f847b" font-size="12">Explore pandals, plan walking routes, check metro connectivity, and celebrate Bengal.</text>

        <!-- Helpline & About Link -->
        <text x="1280" y="24" fill="#776d65" font-size="13" font-weight="600" text-anchor="end">Helpline &amp; About</text>
      </g>

      <!-- Divider -->
      <line x1="0" y1="62" x2="1280" y2="62" stroke="${BORDER_LIGHT}" stroke-width="1"/>

      <!-- Row 2: Copyright & Pause Control + Made with Heart -->
      <g id="Footer_Row_2" transform="translate(0, 84)">
        <text x="0" y="14" fill="#9c9187" font-size="12">© 2026 PujoPath. All rights reserved.</text>

        ${showPause ? `
        <!-- Artwork & Pause Rotation Control (Homepage) -->
        <g id="Background_Artwork_Control" transform="translate(230, 0)">
          <text x="0" y="14" fill="#9c9187" font-size="12">•</text>
          <text x="14" y="14" fill="#80756a" font-size="11">🎨 Sacred Sandhya Aarti</text>
          <g transform="translate(155, -2)">
            <rect width="64" height="22" rx="6" fill="#f2ece4"/>
            <!-- Pause Icon -->
            <path d="M10 6 L10 16 M14 6 L14 16" stroke="#80756a" stroke-width="1.8" stroke-linecap="round"/>
            <text x="24" y="15" fill="#80756a" font-size="11" font-weight="600">Pause</text>
          </g>
        </g>` : ''}

        <!-- Creator Watermark Signature -->
        <g id="Creator_Signature" transform="translate(1280, 14)" text-anchor="end">
          <text x="0" y="0" fill="#776d65" font-size="13" font-weight="500">
            Made by Soumik &amp; Moumita with <tspan fill="#e02424" font-size="14">❤️</tspan>
          </text>
        </g>
      </g>
    </g>
  </g>
  `;
}

// Authoritative Mobile Footer (390px / 412px wide, with safe bottom spacing)
function renderMobileFooter(y, width = 390, showPause = true) {
  return `
  <!-- AUTHORITATIVE MOBILE FOOTER -->
  <g id="Footer_Mobile" transform="translate(0, ${y})">
    <rect width="${width}" height="220" fill="${BG_WHITE}" fill-opacity="0.8"/>
    <line x1="0" y1="0" x2="${width}" y2="0" stroke="${BORDER}" stroke-width="1"/>

    <g transform="translate(16, 24)">
      <!-- Brand & Tagline -->
      <g text-anchor="middle" transform="translate(${(width - 32) / 2}, 0)">
        <text x="0" y="16" fill="${RED}" font-size="16" font-weight="900" class="brand">
          PujoPath <tspan fill="#a89e95" font-weight="400">|</tspan> <tspan fill="#776d65" font-size="12" font-weight="600">Kolkata Durga Puja Companion</tspan>
        </text>
        <text x="0" y="36" fill="#8f847b" font-size="11">Explore pandals, plan walking routes, check metro connectivity.</text>

        <!-- Helpline & About Link -->
        <text x="0" y="62" fill="#776d65" font-size="12" font-weight="600">Helpline &amp; About</text>

        <!-- Divider -->
        <line x1="-${(width - 64) / 2}" y1="80" x2="${(width - 64) / 2}" y2="80" stroke="${BORDER_LIGHT}" stroke-width="1"/>

        <!-- Creator Signature (Prominently placed above bottom nav) -->
        <text x="0" y="104" fill="#776d65" font-size="12" font-weight="600">
          Made by Soumik &amp; Moumita with <tspan fill="#e02424">❤️</tspan>
        </text>

        <!-- Copyright & Pause -->
        <text x="0" y="128" fill="#9c9187" font-size="11">© 2026 PujoPath. All rights reserved.</text>
        ${showPause ? `
        <g transform="translate(0, 146)">
          <text x="0" y="0" fill="#80756a" font-size="10">🎨 Sacred Sandhya Aarti • ⏸ Pause</text>
        </g>` : ''}
      </g>
    </g>
  </g>
  `;
}

// Actual Capacitor Android App Footer (Solely the credit line with border-t, matching APK Footer.tsx)
function renderCapacitorFooter(y, width = 412) {
  return `
  <!-- ACTUAL CAPACITOR ANDROID FOOTER (Strictly credit line only) -->
  <g id="Footer_Capacitor" transform="translate(0, ${y})">
    <line x1="0" y1="0" x2="${width}" y2="0" stroke="#eee8e1" stroke-opacity="0.6" stroke-width="1"/>
    <g transform="translate(${width / 2}, 36)" text-anchor="middle">
      <text x="0" y="0" fill="#776d65" font-size="12" font-weight="500">
        Made by Soumik &amp; Moumita with <tspan fill="#e02424" font-size="13">❤️</tspan>
      </text>
    </g>
  </g>
  `;
}

// Mobile Bottom Nav Bar (Home, Explore, Map, Planner, More)
function renderMobileBottomNav(y, width = 390, activeTab = 'Home') {
  const tabs = [
    { name: 'Home', label: 'Home', icon: '🏠' },
    { name: 'Explore', label: 'Explore', icon: '🧭' },
    { name: 'Map', label: 'Map', icon: '📍' },
    { name: 'Planner', label: 'Planner', icon: '🔀' },
    { name: 'More', label: 'More', icon: '⋯' }
  ];
  const step = width / 5;

  let tabsSvg = '';
  tabs.forEach((t, i) => {
    const x = step * i + step / 2;
    const isActive = t.name === activeTab;
    tabsSvg += `
    <g transform="translate(${x}, 10)" text-anchor="middle">
      <text x="0" y="16" font-size="18">${t.icon}</text>
      <text x="0" y="32" fill="${isActive ? RED : '#665a54'}" font-size="11" font-weight="${isActive ? '800' : '600'}">${t.label}</text>
      ${isActive ? `<circle cx="0" cy="38" r="2" fill="${RED}"/>` : ''}
    </g>`;
  });

  return `
  <!-- FIXED MOBILE BOTTOM NAVIGATION (64px) -->
  <g id="Mobile_Bottom_Nav" transform="translate(0, ${y})">
    <rect width="${width}" height="64" fill="${BG_WHITE}"/>
    <line x1="0" y1="0" x2="${width}" y2="0" stroke="${BORDER}" stroke-width="1"/>
    ${tabsSvg}
  </g>
  `;
}

// Android Gesture Home Indicator
function renderAndroidGesturePill(y, width = 412) {
  return `
  <rect x="0" y="${y}" width="${width}" height="24" fill="${BG_WHITE}"/>
  <rect x="${(width - 72) / 2}" y="${y + 10}" width="72" height="4" rx="2" fill="#5a504a"/>
  `;
}

module.exports = {
  EXPORTS_DIR,
  IMAGES,
  RED, RED_HOVER, RED_SOFT, RED_BORDER, BG_CREAM, BG_WHITE, BG_SURFACE,
  TEXT_MAIN, TEXT_DARK, TEXT_SEC, TEXT_MUTED, TEXT_FAINT, BORDER, BORDER_LIGHT, LINKEDIN_BLUE, GOLD,
  SVG_DEFS,
  renderDesktopHeader,
  renderMobileWebHeader,
  renderCapacitorHeader,
  renderDesktopFooter,
  renderMobileFooter,
  renderCapacitorFooter,
  renderMobileBottomNav,
  renderAndroidGesturePill,
};
