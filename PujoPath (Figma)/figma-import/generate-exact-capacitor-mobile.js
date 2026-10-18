const fs = require('fs');
const path = require('path');
const {
  EXPORTS_DIR,
  IMAGES,
  COLORS,
  SVG_FONTS_AND_STYLES
} = require('./authentic-tokens-and-assets');

const CAP_DIR = path.join(EXPORTS_DIR, 'capacitor-mobile');
if (!fs.existsSync(CAP_DIR)) fs.mkdirSync(CAP_DIR, { recursive: true });

// Android 40px System Status Bar (Light mode by default: dark icons)
function renderAndroidStatusBar(isDarkBg = false) {
  const iconColor = isDarkBg ? '#FFFFFF' : '#1A1715';
  return `
  <!-- ANDROID SYSTEM STATUS BAR (40px) -->
  <g id="Android_Status_Bar">
    <rect width="412" height="40" fill="none"/>
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

// Android 24px Gesture Home Pill
function renderAndroidGesturePill(yPos = 890, width = 412) {
  const pillX = Math.round((width - 72) / 2);
  return `
  <!-- ANDROID SYSTEM GESTURE NAVIGATION PILL (y=${yPos}) -->
  <g id="Android_Gesture_Pill" transform="translate(0, ${yPos})">
    <rect width="${width}" height="24" fill="none"/>
    <rect x="${pillX}" y="10" width="72" height="4" rx="2" fill="#1A1715" fill-opacity="0.8"/>
  </g>
  `;
}

// Capacitor Android App Bar (412 x 56, NO Install App button!)
function renderCapacitorAppBar(activeTab = 'Explore') {
  return `
  <!-- CAPACITOR ANDROID APP BAR (56px, NO INSTALL BUTTON) -->
  <g id="Capacitor_App_Bar" transform="translate(0, 40)">
    <rect width="412" height="56" fill="${COLORS.lightBg}" fill-opacity="0.96"/>
    <line x1="0" y1="56" x2="412" y2="56" stroke="${COLORS.lightBorder}" stroke-width="1"/>

    <!-- Left Brand Logo (Clean text) -->
    <g transform="translate(18, 16)">
      <text x="0" y="22" fill="${COLORS.red}" font-size="22" font-weight="900" letter-spacing="-0.5" class="brand">PujoPath</text>
    </g>

    <!-- Right Controls: Moon Toggle, Language Pill, Favorites Heart -->
    <g id="Cap_Controls" transform="translate(240, 11)">
      <!-- Moon / Dark Mode Toggle -->
      <g id="Cap_Theme_Toggle">
        <rect width="36" height="36" rx="12" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="18" y="23" fill="${COLORS.lightTextMuted}" font-size="14" text-anchor="middle">🌙</text>
      </g>

      <!-- Language Toggle Pill -->
      <g id="Cap_Lang_Toggle" transform="translate(44, 0)">
        <rect width="68" height="36" rx="12" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <rect x="3" y="3" width="30" height="30" rx="8" fill="${COLORS.red}"/>
        <text x="18" y="22" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle">EN</text>
        <text x="48" y="22" fill="${COLORS.lightTextMuted}" font-size="11" font-weight="600" text-anchor="middle" class="bengali">বাংলা</text>
      </g>

      <!-- Favorites Heart Button -->
      <g id="Cap_Favorites" transform="translate(120, 0)">
        <rect width="36" height="36" rx="12" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="18" y="23" fill="${COLORS.lightTextMuted}" font-size="15" text-anchor="middle">♡</text>
      </g>
    </g>
  </g>
  `;
}

// Android Bottom Navigation (412 x 60)
function renderCapacitorBottomNav(activeTab = 'Home', yPos = 830) {
  const tabs = [
    { name: 'Home', icon: '🏠', active: activeTab === 'Home' },
    { name: 'Explore', icon: '🔍', active: activeTab === 'Explore' },
    { name: 'Map', icon: '📍', active: activeTab === 'Map' },
    { name: 'Planner', icon: '🔀', active: activeTab === 'Planner' },
    { name: 'More', icon: '☰', active: activeTab === 'More' }
  ];

  let tabsSvg = '';
  tabs.forEach((t, i) => {
    const x = i * 82;
    const color = t.active ? COLORS.red : COLORS.lightTextMuted;
    const bg = t.active ? COLORS.redSoftLight : 'transparent';
    const weight = t.active ? '800' : '500';
    tabsSvg += `
      <g transform="translate(${x}, 4)">
        <rect x="14" y="2" width="54" height="46" rx="12" fill="${bg}"/>
        <text x="41" y="22" font-size="16" text-anchor="middle">${t.icon}</text>
        <text x="41" y="40" fill="${color}" font-size="10" font-weight="${weight}" text-anchor="middle">${t.name}</text>
      </g>
    `;
  });

  return `
  <!-- CAPACITOR ANDROID BOTTOM NAVIGATION BAR (y=${yPos}) -->
  <g id="Capacitor_Bottom_Nav" transform="translate(0, ${yPos})">
    <rect width="412" height="60" fill="${COLORS.lightBg}" fill-opacity="0.98"/>
    <line x1="0" y1="0" x2="412" y2="0" stroke="${COLORS.lightBorder}" stroke-width="1"/>
    ${tabsSvg}
  </g>
  `;
}

// -------------------------------------------------------------------------
// 1. Capacitor Launch Splash Screen (412 x 915)
// -------------------------------------------------------------------------
function generateCapacitorLaunchSplash() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="412" height="915" fill="#140707"/>

  <!-- Fullscreen Sacred Durga Protima Artwork (durga-bg.jpg) -->
  <image href="${IMAGES.durgaBg}" width="412" height="915" preserveAspectRatio="xMidYMid slice"/>

  <!-- Gradient Overlay -->
  <rect width="412" height="915" fill="url(#splash-dark-grad)"/>
  <defs>
    <linearGradient id="splash-dark-grad" x1="0" y1="0" x2="0" y2="915" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.6"/>
      <stop offset="35%" stop-color="#000000" stop-opacity="0.2"/>
      <stop offset="70%" stop-color="#000000" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- Android Status Bar (White on dark) -->
  ${renderAndroidStatusBar(true)}

  <!-- Top Audio Enabled Badge + Skip Button -->
  <g transform="translate(24, 60)">
    <rect width="126" height="28" rx="14" fill="#000000" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1"/>
    <text x="14" y="18" fill="#FFFFFF" font-size="11" font-weight="600">🔊 Audio Enabled</text>

    <g transform="translate(294, 0)">
      <rect width="70" height="28" rx="14" fill="#000000" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1"/>
      <text x="35" y="18" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">Skip &gt;</text>
    </g>
  </g>

  <!-- Centered Spiritual Content & Mantra -->
  <g transform="translate(206, 600)" text-anchor="middle">
    <!-- Traditional Floral Emblem -->
    <circle cx="0" cy="0" r="32" fill="${COLORS.red}" fill-opacity="0.85"/>
    <text x="0" y="10" fill="#FFFFFF" font-size="28" font-weight="900">卐</text>

    <!-- Brand Name -->
    <text x="0" y="60" fill="#FFFFFF" font-size="34" font-weight="900" letter-spacing="1" class="brand">PujoPath</text>
    <text x="0" y="84" fill="#f5d0b5" font-size="13" font-weight="600" letter-spacing="2">KOLKATA DURGA PUJA 2026</text>

    <!-- Sanskrit Shloka -->
    <g transform="translate(0, 116)">
      <text x="0" y="0" fill="#fef3c7" font-size="13" font-weight="600" class="bengali">
        যা দেবী সর্বভূতেষু মাতৃরূপেণ সংস্থিতা।
      </text>
      <text x="0" y="20" fill="#fef3c7" font-size="13" font-weight="600" class="bengali">
        নমস্তস্যৈ নমস্তস্যৈ নমস্তস্যৈ নমো নমঃ॥
      </text>
    </g>

    <!-- Loading Progress Bar -->
    <g transform="translate(-120, 180)">
      <rect width="240" height="4" rx="2" fill="#ffffff" fill-opacity="0.3"/>
      <rect width="200" height="4" rx="2" fill="${COLORS.red}"/>
    </g>
    <text x="0" y="206" fill="#f5f1eb" font-size="11" font-weight="500">Preparing sacred routes...</text>
  </g>

  ${renderAndroidGesturePill(886, 412)}
</svg>`;
}

// -------------------------------------------------------------------------
// 2. Capacitor Android Home Screen (412 x 1850)
// -------------------------------------------------------------------------
function generateCapacitorAndroidHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1850" viewBox="0 0 412 1850" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="412" height="1850" fill="${COLORS.lightBg}"/>

  <defs>
    <clipPath id="cap-hl-1"><rect width="90" height="68" rx="10"/></clipPath>
    <clipPath id="cap-hl-2"><rect width="90" height="68" rx="10"/></clipPath>
    <clipPath id="cap-hl-3"><rect width="90" height="68" rx="10"/></clipPath>
  </defs>

  ${renderAndroidStatusBar(false)}
  ${renderCapacitorAppBar('Home')}

  <!-- 1. Floating Hero Card -->
  <g id="Capacitor_Hero_Card" transform="translate(16, 108)">
    <rect width="380" height="264" rx="20" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
    
    <g transform="translate(20, 20)">
      <!-- Real Countdown Pill -->
      <g id="Countdown_Pill">
        <rect width="160" height="28" rx="14" fill="${COLORS.redSoftLight}" stroke="${COLORS.redBorderLight}" stroke-width="1"/>
        <text x="12" y="19" font-size="13">🗓️</text>
        <text x="32" y="19" fill="${COLORS.red}" font-size="11" font-weight="700">180 days to Puja</text>
      </g>

      <!-- Headline -->
      <text x="0" y="70" fill="${COLORS.lightTextMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Your Puja, made simple.</text>
      <text x="0" y="96" fill="${COLORS.lightTextMuted}" font-size="13">Find the pandals you love, build a route,</text>
      <text x="0" y="114" fill="${COLORS.lightTextMuted}" font-size="13">and head out with confidence.</text>

      <!-- Action Buttons -->
      <g transform="translate(0, 134)">
        <rect width="340" height="42" rx="12" fill="${COLORS.red}"/>
        <text x="170" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">🔍 Find pandals →</text>

        <g transform="translate(0, 50)">
          <rect width="340" height="42" rx="12" fill="${COLORS.lightCard}" stroke="#d2c7bc" stroke-width="1"/>
          <text x="170" y="26" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700" text-anchor="middle">🧭 Build a route</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 2. Quick Access 2-Column Grid (6 cards) -->
  <g id="Capacitor_Quick_Access" transform="translate(16, 392)">
    <text x="0" y="0" fill="${COLORS.lightTextMain}" font-size="16" font-weight="800">Quick Access</text>

    <g transform="translate(0, 14)">
      <!-- Map -->
      <g transform="translate(0, 0)">
        <rect width="184" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="${COLORS.redSoftLight}"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">📍</text>
        <text x="54" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Map</text>
        <text x="54" y="47" fill="${COLORS.lightTextMuted}" font-size="10">All pandals</text>
      </g>

      <!-- Route Planner -->
      <g transform="translate(196, 0)">
        <rect width="184" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="rgba(13, 148, 136, 0.12)"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">🔀</text>
        <text x="54" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Planner</text>
        <text x="54" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Optimize trail</text>
      </g>

      <!-- Metro Guide -->
      <g transform="translate(0, 84)">
        <rect width="184" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="rgba(37, 99, 235, 0.12)"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">🚇</text>
        <text x="54" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Metro Guide</text>
        <text x="54" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Station lines</text>
      </g>

      <!-- Calendar -->
      <g transform="translate(196, 84)">
        <rect width="184" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="rgba(234, 88, 12, 0.12)"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">📅</text>
        <text x="54" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Calendar</text>
        <text x="54" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Sandhi puja</text>
      </g>

      <!-- Puja Music -->
      <g transform="translate(0, 168)">
        <rect width="184" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="rgba(124, 58, 237, 0.12)"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">🎵</text>
        <text x="54" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Puja Music</text>
        <text x="54" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Chandi Path</text>
      </g>

      <!-- Mahalaya -->
      <g transform="translate(196, 168)">
        <rect width="184" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="rgba(217, 119, 6, 0.12)"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">✨</text>
        <text x="54" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Mahalaya</text>
        <text x="54" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Dawn stream</text>
      </g>
    </g>
  </g>

  <!-- 3. Curated Puja Highlights (3 Stacked Cards) -->
  <g id="Capacitor_Highlights" transform="translate(16, 676)">
    <g transform="translate(0, 0)">
      <text x="0" y="0" fill="${COLORS.red}" font-size="16" font-weight="900">✣</text>
      <text x="18" y="0" fill="${COLORS.lightTextMain}" font-size="16" font-weight="800">Puja Highlights</text>
      <text x="380" y="0" fill="${COLORS.red}" font-size="12" font-weight="700" text-anchor="end">View all →</text>
    </g>

    <g transform="translate(0, 16)">
      <!-- Card 1 -->
      <g transform="translate(0, 0)">
        <rect width="380" height="90" rx="16" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <g transform="translate(12, 11)" clip-path="url(#cap-hl-1)">
          <image href="${IMAGES.sovabazar}" width="90" height="68" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(116, 18)">
          <text x="0" y="14" fill="${COLORS.red}" font-size="10" font-weight="700">TRADITIONS &amp; ART</text>
          <text x="0" y="34" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Traditions &amp; Pandal Art</text>
          <text x="0" y="52" fill="${COLORS.lightTextMuted}" font-size="11">Bengal's heritage bonedi bari installations.</text>
        </g>
      </g>

      <!-- Card 2 -->
      <g transform="translate(0, 102)">
        <rect width="380" height="90" rx="16" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <g transform="translate(12, 11)" clip-path="url(#cap-hl-2)">
          <image href="${IMAGES.bagbazar}" width="90" height="68" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(116, 18)">
          <text x="0" y="14" fill="${COLORS.gold}" font-size="10" font-weight="700">SACRED ALMANAC</text>
          <text x="0" y="34" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Sacred Almanac &amp; Timings</text>
          <text x="0" y="52" fill="${COLORS.lightTextMuted}" font-size="11">Ashtami Sandhi Puja schedules.</text>
        </g>
      </g>

      <!-- Card 3 -->
      <g transform="translate(0, 204)">
        <rect width="380" height="90" rx="16" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <g transform="translate(12, 11)" clip-path="url(#cap-hl-3)">
          <image href="${IMAGES.collegeSquare}" width="90" height="68" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(116, 18)">
          <text x="0" y="14" fill="${COLORS.blue}" font-size="10" font-weight="700">PUJO ROUTES</text>
          <text x="0" y="34" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Pujo Evenings &amp; Routes</text>
          <text x="0" y="52" fill="${COLORS.lightTextMuted}" font-size="11">Illumination &amp; evening hopping.</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 4. Feature Pills Grid -->
  <g id="Capacitor_Feature_Pills" transform="translate(16, 1016)">
    <g transform="translate(0, 0)">
      <g transform="translate(0, 0)">
        <rect width="184" height="52" rx="12" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="12" y="32" font-size="16">✨</text>
        <text x="36" y="24" fill="${COLORS.lightTextMain}" font-size="11" font-weight="700">Ultra Simple</text>
        <text x="36" y="38" fill="${COLORS.lightTextMuted}" font-size="9">Only what you need</text>
      </g>
      <g transform="translate(196, 0)">
        <rect width="184" height="52" rx="12" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="12" y="32" font-size="16">⚡</text>
        <text x="36" y="24" fill="${COLORS.lightTextMain}" font-size="11" font-weight="700">Lightning Fast</text>
        <text x="36" y="38" fill="${COLORS.lightTextMuted}" font-size="9">Smooth experience</text>
      </g>
      <g transform="translate(0, 60)">
        <rect width="184" height="52" rx="12" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="12" y="32" font-size="16">📱</text>
        <text x="36" y="24" fill="${COLORS.lightTextMain}" font-size="11" font-weight="700">Native Android</text>
        <text x="36" y="38" fill="${COLORS.lightTextMuted}" font-size="9">Capacitor APK</text>
      </g>
      <g transform="translate(196, 60)">
        <rect width="184" height="52" rx="12" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="12" y="32" font-size="16">🌸</text>
        <text x="36" y="24" fill="${COLORS.lightTextMain}" font-size="11" font-weight="700">100% Free</text>
        <text x="36" y="38" fill="${COLORS.lightTextMuted}" font-size="9">Open community</text>
      </g>
    </g>
  </g>

  <!-- Attribution Footer -->
  <g transform="translate(16, 1176)">
    <rect width="380" height="74" rx="16" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
    <g transform="translate(20, 22)">
      <text x="170" y="14" fill="${COLORS.lightTextMain}" font-size="12" font-weight="700" text-anchor="middle">Made by Soumik &amp; Moumita with ❤️</text>
      <text x="170" y="34" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">Kolkata Durga Puja 2026 • Android Distributed App</text>
    </g>
  </g>

  ${renderCapacitorBottomNav('Home', 1766)}
  ${renderAndroidGesturePill(1826, 412)}
</svg>`;
}

// -------------------------------------------------------------------------
// 3. Capacitor Android Explore Screen (412 x 1950)
// -------------------------------------------------------------------------
function generateCapacitorAndroidExplore() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1950" viewBox="0 0 412 1950" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="412" height="1950" fill="${COLORS.lightBg}"/>

  <defs>
    <clipPath id="cap-exp-1"><rect width="380" height="190" rx="18"/></clipPath>
    <clipPath id="cap-exp-2"><rect width="380" height="190" rx="18"/></clipPath>
    <clipPath id="cap-exp-3"><rect width="380" height="190" rx="18"/></clipPath>
    <clipPath id="cap-exp-4"><rect width="380" height="190" rx="18"/></clipPath>
  </defs>

  ${renderAndroidStatusBar(false)}
  ${renderCapacitorAppBar('Explore')}

  <g transform="translate(16, 108)">
    <text x="0" y="24" fill="${COLORS.lightTextMain}" font-size="24" font-weight="900">Explore Pandals</text>
    <text x="0" y="46" fill="${COLORS.lightTextMuted}" font-size="12">48+ Iconic Pandals across Kolkata.</text>

    <!-- Search Input Box -->
    <g transform="translate(0, 60)">
      <rect width="380" height="44" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <text x="16" y="27" font-size="14">🔍</text>
      <text x="42" y="27" fill="${COLORS.lightTextMuted}" font-size="12">Search pandals by name, zone, metro...</text>
    </g>

    <!-- Zone Filter Pills -->
    <g transform="translate(0, 118)">
      <rect width="60" height="30" rx="8" fill="${COLORS.red}"/>
      <text x="30" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All (48)</text>

      <rect x="68" width="84" height="30" rx="8" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <text x="110" y="19" fill="${COLORS.lightTextMuted}" font-size="11" text-anchor="middle">North (16)</text>

      <rect x="160" width="84" height="30" rx="8" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <text x="202" y="19" fill="${COLORS.lightTextMuted}" font-size="11" text-anchor="middle">South (18)</text>

      <rect x="252" width="76" height="30" rx="8" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <text x="290" y="19" fill="${COLORS.lightTextMuted}" font-size="11" text-anchor="middle">Central (8)</text>
    </g>

    <!-- Card 1: Bagbazar (Matching actual_cap_explore_top.png) -->
    <g transform="translate(0, 165)">
      <rect width="380" height="390" rx="20" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <g clip-path="url(#cap-exp-1)">
        <image href="${IMAGES.bagbazar}" width="380" height="190" preserveAspectRatio="xMidYMid slice"/>
        <!-- Bottom Dark Gradient Overlay on Image -->
        <rect y="110" width="380" height="80" fill="url(#pandal-img-fade)"/>
      </g>
      <defs>
        <linearGradient id="pandal-img-fade" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
        </linearGradient>
      </defs>

      <!-- Badge on Image Top Left -->
      <g transform="translate(14, 14)">
        <rect width="86" height="22" rx="6" fill="rgba(0,0,0,0.65)"/>
        <text x="43" y="15" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>

      <!-- Pandal Title Overlaid directly on Image Bottom -->
      <text x="18" y="174" fill="#FFFFFF" font-size="18" font-weight="900">Bagbazar Sarbojanin</text>

      <!-- Content Below Image -->
      <g transform="translate(18, 208)">
        <text x="0" y="14" fill="${COLORS.red}" font-size="10" font-weight="800">NORTH KOLKATA • CENTURY HERITAGE</text>
        <text x="0" y="36" fill="${COLORS.lightTextMuted}" font-size="12">Iconic Ekchala idol with authentic white daker saaj.</text>

        <g transform="translate(0, 56)">
          <rect width="84" height="24" rx="6" fill="${COLORS.redSoftLight}"/>
          <text x="42" y="16" fill="${COLORS.red}" font-size="10" font-weight="800" text-anchor="middle">High Crowd</text>

          <rect x="94" width="130" height="24" rx="6" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
          <text x="159" y="16" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">🚇 Shyambazar (450m)</text>
        </g>

        <g transform="translate(0, 96)">
          <rect width="344" height="42" rx="12" fill="${COLORS.red}"/>
          <text x="172" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 2: Kumartuli Park -->
    <g transform="translate(0, 580)">
      <rect width="380" height="390" rx="20" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <g clip-path="url(#cap-exp-2)">
        <image href="${IMAGES.kumartuli}" width="380" height="190" preserveAspectRatio="xMidYMid slice"/>
        <rect y="110" width="380" height="80" fill="url(#pandal-img-fade)"/>
      </g>
      <g transform="translate(14, 14)">
        <rect width="86" height="22" rx="6" fill="rgba(0,0,0,0.65)"/>
        <text x="43" y="15" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <text x="18" y="174" fill="#FFFFFF" font-size="18" font-weight="900">Kumartuli Park</text>

      <g transform="translate(18, 208)">
        <text x="0" y="14" fill="${COLORS.teal}" font-size="10" font-weight="800">NORTH KOLKATA • ARTISAN HUB</text>
        <text x="0" y="36" fill="${COLORS.lightTextMuted}" font-size="12">Master artisans creating contemporary idol installations.</text>

        <g transform="translate(0, 56)">
          <rect width="96" height="24" rx="6" fill="rgba(13, 148, 136, 0.12)"/>
          <text x="48" y="16" fill="${COLORS.teal}" font-size="10" font-weight="800" text-anchor="middle">Moderate Crowd</text>

          <rect x="106" width="130" height="24" rx="6" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
          <text x="171" y="16" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">🚇 Sovabazar (600m)</text>
        </g>

        <g transform="translate(0, 96)">
          <rect width="344" height="42" rx="12" fill="${COLORS.red}"/>
          <text x="172" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 3: Sovabazar Rajbari -->
    <g transform="translate(0, 995)">
      <rect width="380" height="390" rx="20" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <g clip-path="url(#cap-exp-3)">
        <image href="${IMAGES.sovabazar}" width="380" height="190" preserveAspectRatio="xMidYMid slice"/>
        <rect y="110" width="380" height="80" fill="url(#pandal-img-fade)"/>
      </g>
      <g transform="translate(14, 14)">
        <rect width="86" height="22" rx="6" fill="rgba(0,0,0,0.65)"/>
        <text x="43" y="15" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <text x="18" y="174" fill="#FFFFFF" font-size="18" font-weight="900">Sovabazar Rajbari</text>

      <g transform="translate(18, 208)">
        <text x="0" y="14" fill="${COLORS.gold}" font-size="10" font-weight="800">NORTH KOLKATA • RAJBARI NATMANDIR</text>
        <text x="0" y="36" fill="${COLORS.lightTextMuted}" font-size="12">Founded in 1757 by Raja Nabakrishna Deb.</text>

        <g transform="translate(0, 56)">
          <rect width="84" height="24" rx="6" fill="${COLORS.redSoftLight}"/>
          <text x="42" y="16" fill="${COLORS.red}" font-size="10" font-weight="800" text-anchor="middle">High Crowd</text>

          <rect x="94" width="130" height="24" rx="6" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
          <text x="159" y="16" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">🚇 Sovabazar (350m)</text>
        </g>

        <g transform="translate(0, 96)">
          <rect width="344" height="42" rx="12" fill="${COLORS.red}"/>
          <text x="172" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 4: Suruchi Sangha -->
    <g transform="translate(0, 1410)">
      <rect width="380" height="390" rx="20" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <g clip-path="url(#cap-exp-4)">
        <image href="${IMAGES.suruchi}" width="380" height="190" preserveAspectRatio="xMidYMid slice"/>
        <rect y="110" width="380" height="80" fill="url(#pandal-img-fade)"/>
      </g>
      <g transform="translate(14, 14)">
        <rect width="86" height="22" rx="6" fill="rgba(0,0,0,0.65)"/>
        <text x="43" y="15" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <text x="18" y="174" fill="#FFFFFF" font-size="18" font-weight="900">Suruchi Sangha</text>

      <g transform="translate(18, 208)">
        <text x="0" y="14" fill="${COLORS.blue}" font-size="10" font-weight="800">SOUTH KOLKATA • STATE THEME</text>
        <text x="0" y="36" fill="${COLORS.lightTextMuted}" font-size="12">Indian cultural representations and massive outdoor pavilions.</text>

        <g transform="translate(0, 56)">
          <rect width="84" height="24" rx="6" fill="${COLORS.redSoftLight}"/>
          <text x="42" y="16" fill="${COLORS.red}" font-size="10" font-weight="800" text-anchor="middle">High Crowd</text>

          <rect x="94" width="130" height="24" rx="6" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
          <text x="159" y="16" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">🚇 Kalighat (1.1km)</text>
        </g>

        <g transform="translate(0, 96)">
          <rect width="344" height="42" rx="12" fill="${COLORS.red}"/>
          <text x="172" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>
  </g>

  ${renderCapacitorBottomNav('Explore', 1866)}
  ${renderAndroidGesturePill(1926, 412)}
</svg>`;
}

// -------------------------------------------------------------------------
// 4. Capacitor Android Map Screen (412 x 915)
// -------------------------------------------------------------------------
function generateCapacitorAndroidMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="412" height="915" fill="#e5e3df"/>

  <!-- OpenStreetMap Style Realistic Map Canvas -->
  <g id="Cap_Map_Canvas">
    <!-- River Hooghly -->
    <path d="M 40 0 Q 90 250, 60 500 T 110 915" stroke="#b5d0e8" stroke-width="70" fill="none"/>
    <text x="70" y="420" fill="#7fa8cb" font-size="13" font-weight="700" transform="rotate(-80, 70, 420)">Hooghly River</text>

    <!-- Roads & Blocks -->
    <rect x="120" y="140" width="100" height="120" fill="#f2efe9" stroke="#e0dbd3" stroke-width="1"/>
    <rect x="240" y="140" width="140" height="120" fill="#f2efe9" stroke="#e0dbd3" stroke-width="1"/>
    <rect x="120" y="280" width="120" height="160" fill="#f2efe9" stroke="#e0dbd3" stroke-width="1"/>
    <rect x="260" y="280" width="120" height="160" fill="#f2efe9" stroke="#e0dbd3" stroke-width="1"/>

    <!-- Main Arteries -->
    <path d="M 0 270 L 412 270 M 0 450 L 412 450 M 0 600 L 412 600" stroke="#ffffff" stroke-width="8"/>
    <path d="M 115 0 L 115 915 M 245 0 L 245 915 M 375 0 L 375 915" stroke="#ffffff" stroke-width="8"/>

    <!-- Metro Transit Line (Blue) -->
    <path d="M 245 0 L 245 915" stroke="#3b82f6" stroke-width="3" stroke-dasharray="6 4"/>

    <!-- Pandal Diya Pins -->
    <!-- Bagbazar Pin -->
    <g transform="translate(180, 210)">
      <circle cx="0" cy="0" r="16" fill="${COLORS.red}"/>
      <text x="0" y="5" fill="#FFFFFF" font-size="12" font-weight="900" text-anchor="middle">1</text>
      <rect x="-60" y="-36" width="120" height="24" rx="6" fill="#FFFFFF" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <text x="0" y="-20" fill="${COLORS.lightTextMain}" font-size="10" font-weight="800" text-anchor="middle">Bagbazar Sarbojanin</text>
    </g>

    <!-- Kumartuli Pin -->
    <g transform="translate(160, 360)">
      <circle cx="0" cy="0" r="16" fill="${COLORS.teal}"/>
      <text x="0" y="5" fill="#FFFFFF" font-size="12" font-weight="900" text-anchor="middle">2</text>
      <rect x="-50" y="-36" width="100" height="24" rx="6" fill="#FFFFFF" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <text x="0" y="-20" fill="${COLORS.lightTextMain}" font-size="10" font-weight="800" text-anchor="middle">Kumartuli Park</text>
    </g>

    <!-- Sovabazar Pin -->
    <g transform="translate(300, 340)">
      <circle cx="0" cy="0" r="16" fill="${COLORS.gold}"/>
      <text x="0" y="5" fill="#FFFFFF" font-size="12" font-weight="900" text-anchor="middle">3</text>
      <rect x="-55" y="-36" width="110" height="24" rx="6" fill="#FFFFFF" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <text x="0" y="-20" fill="${COLORS.lightTextMain}" font-size="10" font-weight="800" text-anchor="middle">Sovabazar Rajbari</text>
    </g>
  </g>

  ${renderAndroidStatusBar(false)}
  ${renderCapacitorAppBar('Map')}

  <!-- Floating Map Bottom Sheet (Selected Pandal Details) -->
  <g transform="translate(16, 680)">
    <rect width="380" height="136" rx="20" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1.5"/>
    <g transform="translate(18, 18)">
      <text x="0" y="14" fill="${COLORS.red}" font-size="10" font-weight="800">SELECTED PANDAL</text>
      <text x="0" y="38" fill="${COLORS.lightTextMain}" font-size="17" font-weight="900">Bagbazar Sarbojanin</text>
      <text x="0" y="58" fill="${COLORS.lightTextMuted}" font-size="12">Shyambazar Metro (450m) • Crowd: High</text>

      <g transform="translate(0, 72)">
        <rect width="166" height="34" rx="10" fill="${COLORS.red}"/>
        <text x="83" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">Get Directions ↗</text>

        <rect x="176" width="166" height="34" rx="10" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="259" y="22" fill="${COLORS.lightTextMain}" font-size="12" font-weight="700" text-anchor="middle">+ Add to Trail</text>
      </g>
    </g>
  </g>

  ${renderCapacitorBottomNav('Map', 830)}
  ${renderAndroidGesturePill(890, 412)}
</svg>`;
}

// -------------------------------------------------------------------------
// 5. Capacitor Android Route Planner Screen (412 x 1650)
// -------------------------------------------------------------------------
function generateCapacitorAndroidPlanner() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1650" viewBox="0 0 412 1650" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="412" height="1650" fill="${COLORS.lightBg}"/>

  ${renderAndroidStatusBar(false)}
  ${renderCapacitorAppBar('Planner')}

  <g transform="translate(16, 108)">
    <text x="0" y="24" fill="${COLORS.lightTextMain}" font-size="24" font-weight="900">Route Planner</text>
    <text x="0" y="46" fill="${COLORS.lightTextMuted}" font-size="12">Optimized trail with crowd &amp; metro integration.</text>

    <!-- Metrics Bar (Matching actual_cap_planner.png) -->
    <g transform="translate(0, 65)">
      <rect width="380" height="76" rx="16" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <g transform="translate(18, 16)">
        <text x="0" y="14" fill="${COLORS.red}" font-size="10" font-weight="800">OPTIMIZED TRAIL</text>
        <text x="0" y="36" fill="${COLORS.lightTextMain}" font-size="16" font-weight="800">North Heritage Trail • 4 Stops</text>
        <text x="344" y="36" fill="${COLORS.lightTextMuted}" font-size="12" text-anchor="end">3.4 km • ~2h 15m</text>
      </g>
    </g>

    <!-- Stop 1 -->
    <g transform="translate(0, 160)">
      <rect width="380" height="72" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <circle cx="28" cy="36" r="12" fill="${COLORS.red}"/>
      <text x="28" y="40" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle">1</text>
      <text x="52" y="30" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Bagbazar Sarbojanin</text>
      <text x="52" y="48" fill="${COLORS.lightTextMuted}" font-size="10">Start • Shyambazar Metro • Est. 35 mins</text>
      <text x="350" y="38" fill="${COLORS.lightTextMuted}" font-size="14">⋮⋮</text>
    </g>
    <text x="28" y="252" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">🚶 8 mins (600m)</text>

    <!-- Stop 2 -->
    <g transform="translate(0, 268)">
      <rect width="380" height="72" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <circle cx="28" cy="36" r="12" fill="${COLORS.teal}"/>
      <text x="28" y="40" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle">2</text>
      <text x="52" y="30" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Kumartuli Park</text>
      <text x="52" y="48" fill="${COLORS.lightTextMuted}" font-size="10">Artisan Sculptures • Est. 40 mins</text>
      <text x="350" y="38" fill="${COLORS.lightTextMuted}" font-size="14">⋮⋮</text>
    </g>
    <text x="28" y="360" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">🚶 12 mins (850m)</text>

    <!-- Stop 3 -->
    <g transform="translate(0, 376)">
      <rect width="380" height="72" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <circle cx="28" cy="36" r="12" fill="${COLORS.gold}"/>
      <text x="28" y="40" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle">3</text>
      <text x="52" y="30" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Sovabazar Rajbari</text>
      <text x="52" y="48" fill="${COLORS.lightTextMuted}" font-size="10">Bonedi Bari Courtyard • Est. 45 mins</text>
      <text x="350" y="38" fill="${COLORS.lightTextMuted}" font-size="14">⋮⋮</text>
    </g>

    <!-- Action Buttons -->
    <g transform="translate(0, 475)">
      <rect width="380" height="46" rx="12" fill="${COLORS.red}"/>
      <text x="190" y="28" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">🗺️ Open in Google Maps</text>

      <g transform="translate(0, 56)">
        <rect width="380" height="46" rx="12" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="190" y="28" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700" text-anchor="middle">🔗 Share Trail</text>
      </g>
    </g>
  </g>

  ${renderCapacitorBottomNav('Planner', 1566)}
  ${renderAndroidGesturePill(1626, 412)}
</svg>`;
}

// -------------------------------------------------------------------------
// 6. Capacitor Android Calendar Screen (412 x 1650)
// -------------------------------------------------------------------------
function generateCapacitorAndroidCalendar() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1650" viewBox="0 0 412 1650" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="412" height="1650" fill="${COLORS.lightBg}"/>

  ${renderAndroidStatusBar(false)}
  ${renderCapacitorAppBar('More')}

  <g transform="translate(16, 108)">
    <text x="0" y="24" fill="${COLORS.lightTextMain}" font-size="24" font-weight="900">Durga Puja 2026 Calendar</text>
    <text x="0" y="46" fill="${COLORS.lightTextMuted}" font-size="12">Auspicious Tithis, Timings &amp; Pushpanjali Muhurats.</text>

    <!-- Sandhi Puja Card -->
    <g transform="translate(0, 65)">
      <rect width="380" height="150" rx="18" fill="${COLORS.lightCard}" stroke="${COLORS.gold}" stroke-width="1.5"/>
      <g transform="translate(18, 16)">
        <rect width="130" height="22" rx="6" fill="rgba(217, 119, 6, 0.15)"/>
        <text x="65" y="15" fill="${COLORS.gold}" font-size="10" font-weight="800" text-anchor="middle">✨ AUSPICIOUS HIGHLIGHT</text>
        <text x="0" y="44" fill="${COLORS.lightTextMain}" font-size="17" font-weight="900">Maha Ashtami Sandhi Puja</text>
        <text x="0" y="64" fill="${COLORS.lightTextMuted}" font-size="11">108 Sacred Diyas &amp; Lotus Offering</text>

        <rect y="78" width="344" height="42" rx="10" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="172" y="96" fill="${COLORS.gold}" font-size="12" font-weight="800" text-anchor="middle">Window: 11:48 PM – 12:36 AM</text>
        <text x="172" y="112" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">Pushpanjali at 12:20 AM</text>
      </g>
    </g>

    <!-- Daily Tithis -->
    <g transform="translate(0, 235)">
      <g transform="translate(0, 0)">
        <rect width="380" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="32" fill="${COLORS.red}" font-size="15" font-weight="800">Maha Sasthi</text>
        <text x="16" y="52" fill="${COLORS.lightTextMuted}" font-size="11">Bodhon, Amantran &amp; Adhibas</text>
        <text x="364" y="42" fill="${COLORS.lightTextMain}" font-size="11" text-anchor="end">Eve 6:45 PM</text>
      </g>

      <g transform="translate(0, 84)">
        <rect width="380" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="32" fill="${COLORS.teal}" font-size="15" font-weight="800">Maha Saptami</text>
        <text x="16" y="52" fill="${COLORS.lightTextMuted}" font-size="11">Nabapatrika Snan (Kola Bou)</text>
        <text x="364" y="42" fill="${COLORS.lightTextMain}" font-size="11" text-anchor="end">Morn 6:00 AM</text>
      </g>

      <g transform="translate(0, 168)">
        <rect width="380" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.gold}" stroke-width="1"/>
        <text x="16" y="32" fill="${COLORS.gold}" font-size="15" font-weight="800">Maha Ashtami</text>
        <text x="16" y="52" fill="${COLORS.lightTextMuted}" font-size="11">Pushpanjali &amp; Kumari Puja</text>
        <text x="364" y="42" fill="${COLORS.lightTextMain}" font-size="11" text-anchor="end">Morn 9:30 AM</text>
      </g>

      <g transform="translate(0, 252)">
        <rect width="380" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="32" fill="${COLORS.blue}" font-size="15" font-weight="800">Maha Navami</text>
        <text x="16" y="52" fill="${COLORS.lightTextMuted}" font-size="11">Maha Aarti &amp; Dhunuchi Dance</text>
        <text x="364" y="42" fill="${COLORS.lightTextMain}" font-size="11" text-anchor="end">Eve 7:00 PM</text>
      </g>

      <g transform="translate(0, 336)">
        <rect width="380" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="32" fill="${COLORS.red}" font-size="15" font-weight="800">Bijoya Dashami</text>
        <text x="16" y="52" fill="${COLORS.lightTextMuted}" font-size="11">Sindoor Khela &amp; Ghat Bisarjan</text>
        <text x="364" y="42" fill="${COLORS.lightTextMain}" font-size="11" text-anchor="end">Aft 4:00 PM</text>
      </g>
    </g>
  </g>

  ${renderCapacitorBottomNav('More', 1566)}
  ${renderAndroidGesturePill(1626, 412)}
</svg>`;
}

// -------------------------------------------------------------------------
// 7. Capacitor Android "More" Drawer Screen (412 x 915)
// -------------------------------------------------------------------------
function generateCapacitorAndroidDrawer() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="412" height="915" fill="${COLORS.lightBg}"/>

  <!-- Backdrop Dimmer Overlay -->
  <rect width="412" height="915" fill="#000000" fill-opacity="0.45"/>

  <!-- Slide-Up Modal Bottom Sheet (Matching actual_cap_more_drawer.png) -->
  <g id="Capacitor_Bottom_Sheet" transform="translate(0, 240)">
    <rect width="412" height="675" rx="28" fill="${COLORS.lightCard}"/>
    
    <!-- Drag Handle Pill -->
    <rect x="182" y="12" width="48" height="5" rx="2.5" fill="#d2c7bc"/>

    <!-- Header Row: Title & Close Button -->
    <g transform="translate(24, 34)">
      <text x="0" y="20" fill="${COLORS.lightTextMain}" font-size="20" font-weight="900">More Features</text>
      <text x="0" y="38" fill="${COLORS.lightTextMuted}" font-size="12">Explore guides, audio, and tools</text>
      
      <circle cx="348" cy="18" r="16" fill="${COLORS.lightBg}"/>
      <text x="348" y="23" fill="${COLORS.lightTextMuted}" font-size="14" text-anchor="middle">✕</text>
    </g>

    <!-- 8 Grid Items (2 Columns x 4 Rows) -->
    <g transform="translate(24, 100)">
      <!-- Item 1: Metro Guide -->
      <g transform="translate(0, 0)">
        <rect width="174" height="74" rx="14" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="35" font-size="18">🚇</text>
        <text x="44" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Metro Guide</text>
        <text x="44" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Lines &amp; timings</text>
      </g>

      <!-- Item 2: Sacred Calendar -->
      <g transform="translate(190, 0)">
        <rect width="174" height="74" rx="14" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="35" font-size="18">📅</text>
        <text x="44" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Calendar</text>
        <text x="44" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Sacred tithis</text>
      </g>

      <!-- Item 3: Festive Music -->
      <g transform="translate(0, 84)">
        <rect width="174" height="74" rx="14" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="35" font-size="18">🎵</text>
        <text x="44" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Festive Music</text>
        <text x="44" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Chandi Path</text>
      </g>

      <!-- Item 4: Safety & Helpline -->
      <g transform="translate(190, 84)">
        <rect width="174" height="74" rx="14" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="35" font-size="18">🚨</text>
        <text x="44" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Safety &amp; Help</text>
        <text x="44" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Emergency 100/1090</text>
      </g>

      <!-- Item 5: Dhak Beats -->
      <g transform="translate(0, 168)">
        <rect width="174" height="74" rx="14" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="35" font-size="18">🥁</text>
        <text x="44" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Dhak Beats</text>
        <text x="44" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Traditional rhythms</text>
      </g>

      <!-- Item 6: Pushpanjali Mantra -->
      <g transform="translate(190, 168)">
        <rect width="174" height="74" rx="14" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="35" font-size="18">🌸</text>
        <text x="44" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Mantra Guide</text>
        <text x="44" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Bengali &amp; Sanskrit</text>
      </g>

      <!-- Item 7: Developers -->
      <g transform="translate(0, 252)">
        <rect width="174" height="74" rx="14" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="35" font-size="18">👩‍💻</text>
        <text x="44" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Developers</text>
        <text x="44" y="47" fill="${COLORS.lightTextMuted}" font-size="10">Soumik &amp; Moumita</text>
      </g>

      <!-- Item 8: Share App -->
      <g transform="translate(190, 252)">
        <rect width="174" height="74" rx="14" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="16" y="35" font-size="18">📤</text>
        <text x="44" y="32" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Share App</text>
        <text x="44" y="47" fill="${COLORS.lightTextMuted}" font-size="10">With family</text>
      </g>
    </g>

    <!-- Version & Build -->
    <g transform="translate(206, 470)" text-anchor="middle">
      <text x="0" y="0" fill="${COLORS.lightTextMuted}" font-size="12" font-weight="600">PujoPath Android v1.2.0 (Build 42)</text>
      <text x="0" y="18" fill="${COLORS.lightTextFaint}" font-size="10">Crafted with ❤️ for Kolkata Durga Puja 2026</text>
    </g>
  </g>

  ${renderCapacitorBottomNav('More', 830)}
  ${renderAndroidGesturePill(890, 412)}
</svg>`;
}

// -------------------------------------------------------------------------
// 8. Capacitor Android Developer Screen (412 x 1500)
// -------------------------------------------------------------------------
function generateCapacitorAndroidDeveloper() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1500" viewBox="0 0 412 1500" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="412" height="1500" fill="${COLORS.lightBg}"/>

  <defs>
    <clipPath id="cap-dev-m"><rect width="80" height="80" rx="16"/></clipPath>
    <clipPath id="cap-dev-s"><rect width="80" height="80" rx="16"/></clipPath>
  </defs>

  ${renderAndroidStatusBar(false)}
  ${renderCapacitorAppBar('More')}

  <g transform="translate(16, 108)">
    <text x="0" y="24" fill="${COLORS.lightTextMain}" font-size="24" font-weight="900">Meet the Developers</text>
    <text x="0" y="46" fill="${COLORS.lightTextMuted}" font-size="12">Crafted with love for Kolkata's Durga Puja devotees.</text>

    <!-- Moumita Card -->
    <g transform="translate(0, 70)">
      <rect width="380" height="340" rx="20" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <g clip-path="url(#cap-dev-m)">
          <image href="${IMAGES.moumita}" width="80" height="80" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(96, 10)">
          <text x="0" y="16" fill="${COLORS.lightTextMain}" font-size="20" font-weight="800">Moumita</text>
          <rect x="0" y="26" width="140" height="22" rx="6" fill="${COLORS.redSoftLight}"/>
          <text x="70" y="41" fill="${COLORS.red}" font-size="10" font-weight="700" text-anchor="middle">UI &amp; Frontend Lead</text>
        </g>

        <text x="0" y="115" fill="${COLORS.lightTextSecondary}" font-size="12">
          Leads design systems, typography, and visual accessibility.
        </text>
        <text x="0" y="135" fill="${COLORS.lightTextSecondary}" font-size="12">
          Focused on intuitive, aesthetic pandal discovery.
        </text>

        <g transform="translate(0, 165)">
          <rect width="90" height="24" rx="6" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
          <text x="45" y="16" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">Design Systems</text>

          <rect x="98" width="80" height="24" rx="6" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
          <text x="138" y="16" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">TailwindCSS</text>

          <rect x="186" width="70" height="24" rx="6" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
          <text x="221" y="16" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">Figma UX</text>
        </g>

        <g transform="translate(0, 215)">
          <rect width="340" height="40" rx="12" fill="${COLORS.linkedin}"/>
          <text x="170" y="25" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Connect on LinkedIn ↗</text>
        </g>
      </g>
    </g>

    <!-- Soumik Card -->
    <g transform="translate(0, 430)">
      <rect width="380" height="340" rx="20" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <g clip-path="url(#cap-dev-s)">
          <image href="${IMAGES.soumik}" width="80" height="80" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(96, 10)">
          <text x="0" y="16" fill="${COLORS.lightTextMain}" font-size="20" font-weight="800">Soumik</text>
          <rect x="0" y="26" width="150" height="22" rx="6" fill="rgba(37, 99, 235, 0.12)"/>
          <text x="75" y="41" fill="${COLORS.blue}" font-size="10" font-weight="700" text-anchor="middle">Backend &amp; Systems Lead</text>
        </g>

        <text x="0" y="115" fill="${COLORS.lightTextSecondary}" font-size="12">
          Architects route optimizer, geospatial algorithms, and
        </text>
        <text x="0" y="135" fill="${COLORS.lightTextSecondary}" font-size="12">
          offline-first Android Capacitor pipeline.
        </text>

        <g transform="translate(0, 165)">
          <rect width="90" height="24" rx="6" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
          <text x="45" y="16" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">Next.js &amp; Node</text>

          <rect x="98" width="100" height="24" rx="6" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
          <text x="148" y="16" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">Capacitor Android</text>

          <rect x="206" width="80" height="24" rx="6" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
          <text x="246" y="16" fill="${COLORS.lightTextMuted}" font-size="10" text-anchor="middle">Geo-Routing</text>
        </g>

        <g transform="translate(0, 215)">
          <rect width="340" height="40" rx="12" fill="${COLORS.linkedin}"/>
          <text x="170" y="25" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Connect on LinkedIn ↗</text>
        </g>
      </g>
    </g>
  </g>

  ${renderCapacitorBottomNav('More', 1416)}
  ${renderAndroidGesturePill(1476, 412)}
</svg>`;
}

// -------------------------------------------------------------------------
// 9. Capacitor Android Music Player Screen (412 x 1550)
// -------------------------------------------------------------------------
function generateCapacitorAndroidMusicPlayer() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1550" viewBox="0 0 412 1550" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="412" height="1550" fill="${COLORS.lightBg}"/>

  ${renderAndroidStatusBar(false)}
  ${renderCapacitorAppBar('More')}

  <g transform="translate(16, 108)">
    <text x="0" y="24" fill="${COLORS.lightTextMain}" font-size="24" font-weight="900">Festive Puja Music</text>
    <text x="0" y="46" fill="${COLORS.lightTextMuted}" font-size="12">Sacred Chandi Path, Agamani &amp; Dhak beats.</text>

    <!-- Mood Pills -->
    <g transform="translate(0, 65)">
      <rect width="56" height="30" rx="8" fill="${COLORS.red}"/>
      <text x="28" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All</text>

      <rect x="64" width="94" height="30" rx="8" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <text x="111" y="19" fill="${COLORS.lightTextMuted}" font-size="11" text-anchor="middle">Chandi Path</text>

      <rect x="166" width="90" height="30" rx="8" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <text x="211" y="19" fill="${COLORS.lightTextMuted}" font-size="11" text-anchor="middle">Dhak Beats</text>

      <rect x="264" width="60" height="30" rx="8" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
      <text x="294" y="19" fill="${COLORS.lightTextMuted}" font-size="11" text-anchor="middle">Aarti</text>
    </g>

    <!-- Track Cards -->
    <g transform="translate(0, 115)">
      <!-- Track 1: Sandhya Aarti (Active Track) -->
      <g transform="translate(0, 0)">
        <rect width="380" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.red}" stroke-width="1.5"/>
        <text x="18" y="32" font-size="16">🌸</text>
        <text x="44" y="28" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Sacred Sandhya Aarti</text>
        <text x="44" y="46" fill="${COLORS.red}" font-size="10" font-weight="700">ACTIVE TRACK • Belur Math</text>
        <rect x="314" y="22" width="50" height="28" rx="8" fill="${COLORS.redSoftLight}"/>
        <text x="339" y="40" fill="${COLORS.red}" font-size="11" font-weight="800" text-anchor="middle">⏸</text>
      </g>

      <!-- Track 2 -->
      <g transform="translate(0, 84)">
        <rect width="380" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="18" y="32" font-size="16">📻</text>
        <text x="44" y="28" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Mahishasuramardini (Mahalaya)</text>
        <text x="44" y="46" fill="${COLORS.lightTextMuted}" font-size="10">Birendra Krishna Bhadra • 1h 28m</text>
        <rect x="314" y="22" width="50" height="28" rx="8" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="339" y="40" fill="${COLORS.lightTextMuted}" font-size="11" font-weight="800" text-anchor="middle">▶</text>
      </g>

      <!-- Track 3 -->
      <g transform="translate(0, 168)">
        <rect width="380" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="18" y="32" font-size="16">🥁</text>
        <text x="44" y="28" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Dhunuchi Dance Dhak Rhythm</text>
        <text x="44" y="46" fill="${COLORS.lightTextMuted}" font-size="10">Traditional Kasor &amp; Dhak Beats • 8m 45s</text>
        <rect x="314" y="22" width="50" height="28" rx="8" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="339" y="40" fill="${COLORS.lightTextMuted}" font-size="11" font-weight="800" text-anchor="middle">▶</text>
      </g>

      <!-- Track 4 -->
      <g transform="translate(0, 252)">
        <rect width="380" height="74" rx="14" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="18" y="32" font-size="16">🪕</text>
        <text x="44" y="28" fill="${COLORS.lightTextMain}" font-size="13" font-weight="700">Jago Tumi Jago (Agamani)</text>
        <text x="44" y="46" fill="${COLORS.lightTextMuted}" font-size="10">Devotional Chants • 6m 12s</text>
        <rect x="314" y="22" width="50" height="28" rx="8" fill="${COLORS.lightBg}" stroke="${COLORS.lightBorder}" stroke-width="1"/>
        <text x="339" y="40" fill="${COLORS.lightTextMuted}" font-size="11" font-weight="800" text-anchor="middle">▶</text>
      </g>
    </g>
  </g>

  <!-- FLOATING PERSISTENT MINI-PLAYER BAR (Matching emulator_miniplayer_paused.png) -->
  <g id="Capacitor_Floating_Miniplayer" transform="translate(16, 1394)">
    <rect width="380" height="60" rx="16" fill="${COLORS.lightCard}" stroke="${COLORS.lightBorder}" stroke-width="1.5"/>
    <!-- Red Progress Line along top border of miniplayer -->
    <rect x="0" y="0" width="160" height="3" rx="1.5" fill="${COLORS.red}"/>
    
    <g transform="translate(14, 12)">
      <clipPath id="cap-mini-thumb"><rect width="36" height="36" rx="10"/></clipPath>
      <g clip-path="url(#cap-mini-thumb)">
        <image href="${IMAGES.miniplayer}" width="36" height="36" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <text x="48" y="16" fill="${COLORS.lightTextMain}" font-size="12" font-weight="800">🌸 Sacred Sandhya Aarti</text>
      <text x="48" y="30" fill="${COLORS.lightTextMuted}" font-size="10">Belur Math • 2:45 / 5:12</text>

      <!-- Miniplayer Controls (Right) -->
      <g transform="translate(268, 6)">
        <!-- Play / Pause Button -->
        <rect width="30" height="30" rx="10" fill="${COLORS.redSoftLight}"/>
        <text x="15" y="20" fill="${COLORS.red}" font-size="12" font-weight="900" text-anchor="middle">⏸</text>

        <!-- Queue Button -->
        <rect x="38" width="30" height="30" rx="10" fill="${COLORS.lightBg}"/>
        <text x="53" y="20" fill="${COLORS.lightTextMuted}" font-size="12" text-anchor="middle">☰</text>
      </g>
    </g>
  </g>

  ${renderCapacitorBottomNav('More', 1466)}
  ${renderAndroidGesturePill(1526, 412)}
</svg>`;
}

// Build & write all 9 capacitor files
console.log('Generating authoritative Capacitor Android SVGs...');
const screens = [
  { name: '01_capacitor_launch_splash.svg', fn: generateCapacitorLaunchSplash },
  { name: '02_capacitor_android_home.svg', fn: generateCapacitorAndroidHome },
  { name: '03_capacitor_android_explore.svg', fn: generateCapacitorAndroidExplore },
  { name: '04_capacitor_android_map.svg', fn: generateCapacitorAndroidMap },
  { name: '05_capacitor_android_planner.svg', fn: generateCapacitorAndroidPlanner },
  { name: '06_capacitor_android_calendar.svg', fn: generateCapacitorAndroidCalendar },
  { name: '07_capacitor_android_drawer.svg', fn: generateCapacitorAndroidDrawer },
  { name: '08_capacitor_android_developer.svg', fn: generateCapacitorAndroidDeveloper },
  { name: '09_capacitor_android_music_player.svg', fn: generateCapacitorAndroidMusicPlayer }
];

screens.forEach(s => {
  const content = s.fn();
  const filePath = path.join(CAP_DIR, s.name);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ Generated:', s.name, (content.length / 1024).toFixed(1) + ' KB');
});

console.log('All Capacitor Android screens generated successfully.');
