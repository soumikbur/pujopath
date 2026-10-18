const fs = require('fs');
const path = require('path');
const {
  EXPORTS_DIR,
  IMAGES,
  RED, RED_HOVER, RED_SOFT, RED_BORDER, BG_CREAM, BG_WHITE, BG_SURFACE,
  TEXT_MAIN, TEXT_DARK, TEXT_SEC, TEXT_MUTED, TEXT_FAINT, BORDER, BORDER_LIGHT, LINKEDIN_BLUE, GOLD,
  SVG_DEFS,
  renderCapacitorHeader,
  renderCapacitorFooter,
  renderMobileBottomNav,
  renderAndroidGesturePill,
} = require('./authentic-components');

const CAP_DIR = path.join(EXPORTS_DIR, 'capacitor-mobile');
if (!fs.existsSync(CAP_DIR)) fs.mkdirSync(CAP_DIR, { recursive: true });

// -------------------------------------------------------------------------
// 1. Capacitor Launch Splash Screen (412 x 915)
// -------------------------------------------------------------------------
function generateCapacitorLaunchSplash() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <!-- Base Background -->
  <rect width="412" height="915" fill="#140707"/>

  <!-- Fullscreen Authentic Sacred Durga Protima Artwork (durga-bg.jpg) -->
  <image href="${IMAGES.durgaBg}" width="412" height="915" preserveAspectRatio="xMidYMid slice"/>

  <!-- Dark Atmospheric Gradient Overlay for Perfect Contrast -->
  <rect width="412" height="915" fill="url(#splash-dark-grad)"/>
  <defs>
    <linearGradient id="splash-dark-grad" x1="0" y1="0" x2="0" y2="915" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.6"/>
      <stop offset="35%" stop-color="#000000" stop-opacity="0.2"/>
      <stop offset="70%" stop-color="#000000" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- Android System Status Bar (White on dark) -->
  <g id="Android_Status_Bar_Splash">
    <text x="24" y="28" fill="#FFFFFF" font-size="14" font-weight="600">6:36</text>
    <g transform="translate(328, 16)">
      <text x="0" y="12" fill="#FFFFFF" font-size="11" font-weight="700">5G</text>
      <path d="M22 22 L22 14 M25 22 L25 10 M28 22 L28 6 M31 22 L31 2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <rect x="38" y="8" width="18" height="10" rx="2" stroke="#FFFFFF" stroke-width="1.5" fill="none"/>
      <rect x="40" y="10" width="12" height="6" fill="#FFFFFF"/>
      <line x1="57" y1="11" x2="57" y2="15" stroke="#FFFFFF" stroke-width="1.5"/>
    </g>
  </g>

  <!-- Top Audio Enabled Badge + Skip Button -->
  <g transform="translate(24, 60)">
    <!-- Audio Enabled Badge -->
    <rect width="126" height="28" rx="14" fill="#000000" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1"/>
    <text x="14" y="18" fill="#FFFFFF" font-size="11" font-weight="600">🔊 Audio Enabled</text>

    <!-- Skip Button (Right) -->
    <g transform="translate(294, 0)">
      <rect width="70" height="28" rx="14" fill="#000000" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1"/>
      <text x="35" y="18" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">Skip &gt;</text>
    </g>
  </g>

  <!-- Centered Spiritual Content & Mantra -->
  <g transform="translate(206, 600)" text-anchor="middle">
    <!-- Traditional Floral Mandala Emblem -->
    <circle cx="0" cy="0" r="32" fill="${RED}" fill-opacity="0.85"/>
    <text x="0" y="10" fill="#FFFFFF" font-size="28" font-weight="900">卐</text>

    <!-- Brand Name -->
    <text x="0" y="60" fill="#FFFFFF" font-size="34" font-weight="900" letter-spacing="1" class="brand">PujoPath</text>
    <text x="0" y="84" fill="#f5d0b5" font-size="14" font-weight="600" letter-spacing="2">KOLKATA DURGA PUJA 2026</text>

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
      <rect width="200" height="4" rx="2" fill="${RED}"/>
    </g>
    <text x="0" y="206" fill="#f5f1eb" font-size="11" font-weight="500">Preparing sacred routes...</text>
  </g>

  <!-- Android Bottom Gesture Pill -->
  ${renderAndroidGesturePill(886, 412)}
</svg>`;
}

// -------------------------------------------------------------------------
// 2. Capacitor Android Home Screen (412 x 1780)
// -------------------------------------------------------------------------
function generateCapacitorHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1780" viewBox="0 0 412 1780" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="412" height="1780" fill="${BG_CREAM}"/>

  <!-- Background Festival Artwork (Subtle Fixed Watermark) -->
  <g id="Cap_Background_Artwork" opacity="0.20">
    <image href="${IMAGES.ghibliBg}" width="412" height="440" preserveAspectRatio="xMidYMid slice"/>
  </g>

  <!-- Capacitor Header (NO APK Button, text logo, Moon, EN/বাংলা, Heart) -->
  ${renderCapacitorHeader()}

  <!-- 1. Hero Card -->
  <g id="Cap_Hero_Card" transform="translate(18, 116)">
    <rect width="376" height="260" rx="22" fill="${BG_WHITE}" fill-opacity="0.95" stroke="${BORDER}" stroke-width="1"/>
    
    <g transform="translate(20, 20)">
      <!-- Real Live Status Pill (📅 Puja is live) -->
      <g id="Cap_Countdown_Pill">
        <rect width="130" height="28" rx="14" fill="${RED_SOFT}" stroke="${RED_BORDER}" stroke-width="1"/>
        <text x="12" y="19" font-size="13">📅</text>
        <text x="32" y="19" fill="${RED}" font-size="11" font-weight="700">Puja is live</text>
      </g>

      <!-- Headline -->
      <text x="0" y="70" fill="${TEXT_MAIN}" font-size="26" font-weight="900" letter-spacing="-0.5">Your Puja, made simple.</text>
      <text x="0" y="96" fill="${TEXT_SEC}" font-size="13" font-weight="500">Find the pandals you love, build a route,</text>
      <text x="0" y="114" fill="${TEXT_SEC}" font-size="13" font-weight="500">and head out with confidence.</text>

      <!-- Action Buttons -->
      <g transform="translate(0, 136)">
        <g>
          <rect width="336" height="42" rx="12" fill="${RED}"/>
          <text x="168" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">🔍 Find pandals →</text>
        </g>
        <g transform="translate(0, 50)">
          <rect width="336" height="42" rx="12" fill="${BG_WHITE}" stroke="#d2c7bc" stroke-width="1"/>
          <text x="168" y="26" fill="${TEXT_MAIN}" font-size="13" font-weight="700" text-anchor="middle">✈ Build a route</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 2. Quick Access 2-Column Grid (Exact copy from live APK) -->
  <g id="Cap_Quick_Access" transform="translate(18, 396)">
    <text x="0" y="0" fill="${TEXT_MAIN}" font-size="16" font-weight="800">Quick Access</text>
    <g transform="translate(0, 12)">
      ${renderCapQuickCard(0, 0, '📍', 'Map', 'See all pandals at a glance', '#b42323')}
      ${renderCapQuickCard(192, 0, '🔀', 'Route Planner', 'Optimize your hopping trail', '#0d9488')}
      ${renderCapQuickCard(0, 84, '🚇', 'Metro Guide', 'Find nearest metro stations', '#2563eb')}
      ${renderCapQuickCard(192, 84, '📅', 'Calendar', 'Auspicious tithis and hours', '#ea580c')}
      ${renderCapQuickCard(0, 168, '🎵', 'Puja Music', 'Chandi Path &amp; Dhak beats', '#7c3aed')}
      ${renderCapQuickCard(192, 168, '✨', 'Mahalaya', 'Timeless dawn broadcast', '#d97706')}
    </g>
  </g>

  <!-- 3. Curated Highlights with Real Photos -->
  <g id="Cap_Puja_Highlights" transform="translate(18, 686)">
    <g transform="translate(0, 0)">
      <text x="0" y="0" fill="${RED}" font-size="16" font-weight="900">✣</text>
      <text x="18" y="0" fill="${TEXT_MAIN}" font-size="16" font-weight="800">Puja Highlights</text>
      <text x="376" y="0" fill="${RED}" font-size="12" font-weight="700" text-anchor="end">View all →</text>
    </g>
    <g transform="translate(0, 14)">
      ${renderCapHighlightCard(0, IMAGES.sovabazar, 'Traditions &amp; Art', 'Traditions &amp; Pandal Art', "Discover Bengal's timeless heritage celebrations.", 'highlight-1-clip')}
      ${renderCapHighlightCard(104, IMAGES.bagbazar, 'Almanac', 'Sacred Almanac &amp; Timings', 'Accurate Ashtami Sandhi Puja, Pushpanjali timings.', 'highlight-2-clip')}
      ${renderCapHighlightCard(208, IMAGES.collegeSquare, 'Routes', 'Pujo Evenings &amp; Routes', 'Plan your route for best evening illumination.', 'highlight-3-clip')}
    </g>
  </g>

  <!-- 4. Feature Utility Cards -->
  <g id="Cap_Feature_Pills" transform="translate(18, 1030)">
    ${renderCapFeaturePill(0, 0, '✨', 'Ultra Simple', 'Only what you need')}
    ${renderCapFeaturePill(192, 0, '⚡', 'Lightning Fast', 'Smooth experience')}
    ${renderCapFeaturePill(0, 58, '📱', 'Fully Responsive', 'All devices')}
    ${renderCapFeaturePill(192, 58, '🌙', 'Dark Mode', 'Click to toggle')}
    ${renderCapFeaturePill(0, 116, '🌐', 'Bengali &amp; English', 'Click to toggle')}
    ${renderCapFeaturePill(192, 116, '❤️', 'Saved Trails', 'Saved favorites')}
  </g>

  <!-- 5. Actual Capacitor Android Footer (Strictly credit line only) -->
  ${renderCapacitorFooter(1620, 412)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderMobileBottomNav(1692, 412, 'Home')}
  ${renderAndroidGesturePill(1756, 412)}
</svg>`;
}

function renderCapQuickCard(x, y, icon, title, desc, color) {
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="184" height="74" rx="14" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
    <rect x="12" y="14" width="32" height="32" rx="8" fill="${color}" fill-opacity="0.12"/>
    <text x="28" y="35" font-size="15" text-anchor="middle">${icon}</text>
    <text x="52" y="28" fill="${TEXT_MAIN}" font-size="13" font-weight="700">${title}</text>
    <text x="52" y="44" fill="${TEXT_MUTED}" font-size="10">${desc}</text>
  </g>`;
}

function renderCapHighlightCard(y, imageHref, badge, title, desc, clipId) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="376" height="92" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(10, 10)">
      <image href="${imageHref}" width="105" height="72" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
      <rect width="68" height="16" rx="4" fill="#000000" fill-opacity="0.65"/>
      <text x="34" y="12" fill="#FFFFFF" font-size="8" font-weight="700" text-anchor="middle">${badge}</text>
    </g>
    <g transform="translate(126, 22)">
      <text x="0" y="14" fill="${TEXT_MAIN}" font-size="13" font-weight="700">${title}</text>
      <text x="0" y="34" fill="${TEXT_MUTED}" font-size="11">${desc}</text>
    </g>
  </g>`;
}

function renderCapFeaturePill(x, y, icon, title, desc) {
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="184" height="48" rx="12" fill="${BG_WHITE}" fill-opacity="0.8" stroke="#eadcce" stroke-width="1"/>
    <text x="18" y="28" font-size="14">${icon}</text>
    <text x="38" y="22" fill="${TEXT_DARK}" font-size="11" font-weight="700">${title}</text>
    <text x="38" y="36" fill="${TEXT_MUTED}" font-size="9">${desc}</text>
  </g>`;
}

// -------------------------------------------------------------------------
// 3. Capacitor Android Explore Screen (412 x 2250)
// -------------------------------------------------------------------------
function generateCapacitorExplore() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="2250" viewBox="0 0 412 2250" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="412" height="2250" fill="${BG_CREAM}"/>
  ${renderCapacitorHeader()}

  <!-- Page Header -->
  <g id="Cap_Explore_Header" transform="translate(20, 116)">
    <rect width="134" height="24" rx="12" fill="${RED_SOFT}"/>
    <text x="67" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">🔍 PANDAL DIRECTORY</text>
    <text x="0" y="52" fill="${TEXT_MAIN}" font-size="26" font-weight="900" letter-spacing="-0.5">Explore Kolkata Pandals</text>
    <text x="0" y="74" fill="${TEXT_SEC}" font-size="13">Search 774 mapped pandals in Kolkata.</text>

    <!-- Search Input -->
    <g transform="translate(0, 92)">
      <rect width="372" height="46" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="14" y="28" font-size="16">🔍</text>
      <text x="42" y="28" fill="${TEXT_MUTED}" font-size="13">Search pandals by name, Bonedi Bari, t...</text>
    </g>

    <!-- Zone Pills -->
    <g transform="translate(0, 150)">
      <rect x="0" width="76" height="30" rx="15" fill="${RED}"/>
      <text x="38" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All Zones</text>

      <rect x="84" width="105" height="30" rx="15" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="136" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">North Kolkata</text>

      <rect x="197" width="105" height="30" rx="15" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="249" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">South Kolkata</text>

      <rect x="310" width="62" height="30" rx="15" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="341" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Bonedi</text>
    </g>

    <!-- Feature Filters Toggle Collapse -->
    <g transform="translate(0, 194)">
      <rect width="372" height="34" rx="10" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="14" y="21" fill="${TEXT_MAIN}" font-size="12" font-weight="600">Filter by Features</text>
      <text x="354" y="21" fill="${TEXT_MUTED}" font-size="12" text-anchor="end">∨</text>
    </g>

    <!-- Count & Sort Bar -->
    <g transform="translate(0, 244)">
      <text x="0" y="14" fill="${TEXT_SEC}" font-size="13">Showing <tspan fill="${RED}" font-weight="800">774 pandals</tspan></text>
      <g transform="translate(262, -4)">
        <rect width="110" height="26" rx="8" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="55" y="17" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Recommended ∨</text>
      </g>
    </g>
  </g>

  <!-- PANDAL CARDS (AUTHENTIC APK CARD DESIGN: Name on image, 2025 Photo, View Details link & Add Route pill) -->
  <g id="Cap_Pandal_Cards" transform="translate(20, 420)">
    ${renderCapAuthenticCard(0, IMAGES.sreebhumi, 'Dum Dum', 'Featured', 'Sreebhumi Sporting Club', 'Lake Town', '4.9', 'Ultadanga Metro', '1.2km', null)}
    ${renderCapAuthenticCard(390, IMAGES.sovabazar, 'North Kolkata', 'Bonedi Bari', 'Sovabazar Rajbari (Boro Taraf)', 'Sovabazar', '4.8', 'Sovabazar Sutanuti Metro', '350m', 'Visitor access confirmed')}
    ${renderCapAuthenticCard(780, IMAGES.bagbazar, 'North Kolkata', 'Heritage', 'Bagbazar Sarbojanin', 'Bagbazar', '4.7', 'Shyambazar Metro', '500m', null)}
    ${renderCapAuthenticCard(1170, IMAGES.kumartuli, 'North Kolkata', 'Sabeki', 'Kumartuli Park', 'Kumartuli', '4.6', 'Sovabazar Metro', '700m', null)}
  </g>

  <!-- Actual Capacitor Android Footer -->
  ${renderCapacitorFooter(2080, 412)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderMobileBottomNav(2162, 412, 'Explore')}
  ${renderAndroidGesturePill(2226, 412)}
</svg>`;
}

function renderCapAuthenticCard(y, imageHref, zone, tag, title, locality, rating, metro, distance, bonediStatus) {
  const isBonedi = tag === 'Bonedi Bari';
  return `
  <g transform="translate(0, ${y})">
    <rect width="372" height="370" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    
    <!-- Image Header with Dark Gradient Overlay -->
    <g transform="translate(0, 0)">
      <image href="${imageHref}" width="372" height="190" clip-path="url(#mob-pandal-clip)" preserveAspectRatio="xMidYMid slice"/>
      
      <!-- Gradient for Text Contrast -->
      <defs>
        <linearGradient id="card-grad-${y}" x1="0" y1="0" x2="0" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.2"/>
          <stop offset="55%" stop-color="#000000" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
        </linearGradient>
      </defs>
      <rect width="372" height="190" rx="16" fill="url(#card-grad-${y})"/>

      <!-- Top Badges -->
      <g transform="translate(14, 14)">
        <rect width="${zone.length * 7 + 16}" height="22" rx="11" fill="#FFFFFF" fill-opacity="0.95"/>
        <text x="${(zone.length * 7 + 16) / 2}" y="15" fill="${TEXT_MAIN}" font-size="10" font-weight="700" text-anchor="middle">${zone}</text>

        ${tag ? `
        <g transform="translate(${zone.length * 7 + 22}, 0)">
          <rect width="${tag.length * 7 + 18}" height="22" rx="11" fill="${isBonedi ? '#800020' : '#ea580c'}"/>
          <text x="${(tag.length * 7 + 18) / 2}" y="15" fill="${isBonedi ? '#fef08a' : '#FFFFFF'}" font-size="10" font-weight="800" text-anchor="middle">${tag}</text>
        </g>` : ''}
      </g>

      <!-- Top Right Heart Button -->
      <g transform="translate(328, 12)">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF" fill-opacity="0.9"/>
        <path d="M16 22 C13 19 11 17 11 14.5 A2.8 2.8 0 0 1 16 13 A2.8 2.8 0 0 1 21 14.5 C21 17 19 19 16 22 Z" stroke="${RED}" stroke-width="1.5" fill="none"/>
      </g>

      <!-- Bottom-Left 2025 Photo Badge -->
      <g transform="translate(14, 134)">
        <rect width="84" height="20" rx="10" fill="#065f46" fill-opacity="0.85" stroke="#34d399" stroke-width="1" stroke-opacity="0.4"/>
        <text x="42" y="14" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>

      <!-- Bottom Title on Image (Authentic Capacitor APK) -->
      <text x="14" y="174" fill="#FFFFFF" font-size="16" font-weight="800" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">${title}</text>
    </g>

    <!-- Card Body Content -->
    <g transform="translate(16, 204)">
      <!-- Locality and Rating -->
      <g>
        <text x="0" y="14" font-size="13">📍</text>
        <text x="20" y="14" fill="${TEXT_MAIN}" font-size="13" font-weight="600">${locality}</text>
        <text x="340" y="14" fill="#d97706" font-size="13" font-weight="800" text-anchor="end">★ ${rating}</text>
      </g>

      <!-- Metro station -->
      <g transform="translate(0, 24)">
        <text x="0" y="14" font-size="13">🚇</text>
        <text x="20" y="14" fill="${TEXT_MUTED}" font-size="12">${metro} (${distance})</text>
      </g>

      ${bonediStatus ? `
      <g transform="translate(0, 48)">
        <rect width="160" height="20" rx="10" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1"/>
        <text x="80" y="14" fill="#047857" font-size="10" font-weight="700" text-anchor="middle">${bonediStatus}</text>
      </g>` : ''}

      <!-- Bottom Border Line -->
      <line x1="0" y1="84" x2="340" y2="84" stroke="${BORDER_LIGHT}" stroke-width="1"/>

      <!-- Footer Actions: Left View Details link, Right Add Route Pill -->
      <g transform="translate(0, 102)">
        <text x="0" y="20" fill="${RED}" font-size="13" font-weight="700">View Details →</text>
        
        <g transform="translate(236, 0)">
          <rect width="104" height="32" rx="12" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
          <text x="18" y="20" fill="${RED}" font-size="12">✈</text>
          <text x="36" y="20" fill="${TEXT_MAIN}" font-size="11" font-weight="700">Add Route</text>
        </g>
      </g>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 4. Capacitor Android Map Screen (412 x 915)
// -------------------------------------------------------------------------
function generateCapacitorMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="412" height="915" fill="#f8f5f0"/>
  ${renderCapacitorHeader()}

  <!-- Top Filter Chips Bar -->
  <g id="Cap_Map_Filters" transform="translate(16, 110)">
    <rect x="0" width="56" height="32" rx="12" fill="${RED}"/>
    <text x="28" y="20" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All</text>

    <rect x="62" width="108" height="32" rx="12" fill="#800020"/>
    <text x="116" y="20" fill="#fef08a" font-size="11" font-weight="800" text-anchor="middle">🏛️ Bonedi Bari</text>

    <rect x="176" width="98" height="32" rx="12" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <text x="225" y="20" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">North Kolkata</text>

    <g transform="translate(282, 0)">
      <rect width="98" height="32" rx="12" fill="#f9e9e7" stroke="#f6ceca" stroke-width="1"/>
      <text x="14" y="20" font-size="12">🚆</text>
      <text x="32" y="20" fill="${RED}" font-size="11" font-weight="700">Metro</text>
    </g>
  </g>

  <!-- Interactive Map Canvas Representation (Hooghly River, Grid, Metro Lines, Diya Cluster Pins) -->
  <g id="Map_Canvas" transform="translate(0, 150)">
    <!-- Map Base -->
    <rect width="412" height="600" fill="#ede8df"/>

    <!-- Hooghly River Geometry -->
    <path d="M70 0 C90 120 40 260 65 380 C85 470 50 540 60 600 L0 600 L0 0 Z" fill="#b9d6f2" stroke="#9bbfe4" stroke-width="1.5"/>
    <text x="28" y="280" fill="#6082a6" font-size="10" font-weight="700" transform="rotate(-75, 28, 280)">HOOGHLY RIVER</text>

    <!-- Howrah & Vidyasagar Bridges -->
    <line x1="45" y1="210" x2="110" y2="215" stroke="#718096" stroke-width="3" stroke-linecap="round"/>
    <text x="80" y="204" fill="#4a5568" font-size="8" font-weight="700">Howrah Bridge</text>

    <line x1="50" y1="440" x2="120" y2="445" stroke="#718096" stroke-width="3" stroke-linecap="round"/>
    <text x="85" y="434" fill="#4a5568" font-size="8" font-weight="700">Vidyasagar Setu</text>

    <!-- Major Road Networks -->
    <path d="M120 0 L130 600 M240 0 L250 600 M70 180 L412 190 M80 320 L412 330 M60 480 L412 490" stroke="#FFFFFF" stroke-width="3"/>
    <path d="M180 0 L185 600 M100 240 L412 250 M100 400 L412 410" stroke="#fbf8f3" stroke-width="1.8"/>

    <!-- Metro Blue Line 1 (North to South) -->
    <path d="M190 20 L185 580" stroke="#2563eb" stroke-width="3.5" stroke-dasharray="6,4"/>
    
    <!-- Metro Green Line 2 (East-West under river) -->
    <path d="M30 310 L412 315" stroke="#059669" stroke-width="3.5" stroke-dasharray="6,4"/>

    <!-- Pandal Cluster Glowing Pins across Kolkata -->
    <!-- Shyambazar Cluster -->
    ${renderMapPin(210, 80, '24', 'Shyambazar')}
    <!-- Bagbazar / Sovabazar Cluster -->
    ${renderMapPin(140, 140, '18', 'Sovabazar')}
    <!-- College Square Cluster -->
    ${renderMapPin(230, 240, '32', 'College Sq')}
    <!-- Dum Dum Cluster -->
    ${renderMapPin(280, 50, '15', 'Dum Dum')}
    <!-- Park Street Cluster -->
    ${renderMapPin(180, 360, '12', 'Park St')}
    <!-- Gariahat Cluster -->
    ${renderMapPin(260, 440, '45', 'Gariahat')}
    <!-- Behala Cluster -->
    ${renderMapPin(150, 510, '28', 'Behala')}

    <!-- Map UI Zoom & Layer Controls -->
    <g transform="translate(360, 20)">
      <rect width="36" height="74" rx="10" fill="#FFFFFF" stroke="${BORDER}" stroke-width="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
      <text x="18" y="26" fill="${TEXT_DARK}" font-size="18" font-weight="700" text-anchor="middle">+</text>
      <line x1="6" y1="37" x2="30" y2="37" stroke="${BORDER}" stroke-width="1"/>
      <text x="18" y="58" fill="${TEXT_DARK}" font-size="18" font-weight="700" text-anchor="middle">−</text>
    </g>
  </g>

  <!-- Bottom Floating Sheet (Exact match to emulator actual_app_map.png) -->
  <g id="Cap_Map_Floating_Bar" transform="translate(14, 730)">
    <rect width="384" height="70" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.12))"/>
    
    <g transform="translate(14, 15)">
      <!-- Route Icon in soft red pill -->
      <rect width="38" height="38" rx="12" fill="${RED_SOFT}"/>
      <text x="19" y="24" font-size="16" text-anchor="middle">🔀</text>

      <!-- Summary Copy -->
      <g transform="translate(48, 6)">
        <text x="0" y="12" fill="${TEXT_DARK}" font-size="13" font-weight="900">0 Pandals Selected</text>
        <text x="0" y="26" fill="${TEXT_MUTED}" font-size="10">Click "Add Route" on any card to build trail</text>
      </g>

      <!-- Actions: Open Planner button + Dismiss X -->
      <g transform="translate(242, 4)">
        <rect width="84" height="32" rx="10" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="42" y="20" fill="${TEXT_MAIN}" font-size="11" font-weight="700" text-anchor="middle">Open Plan</text>

        <text x="100" y="21" fill="${TEXT_MUTED}" font-size="14" text-anchor="middle">✕</text>
      </g>
    </g>
  </g>

  <!-- Actual Capacitor Android Footer -->
  ${renderCapacitorFooter(806, 412)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderMobileBottomNav(826, 412, 'Map')}
  ${renderAndroidGesturePill(890, 412)}
</svg>`;
}

function renderMapPin(x, y, count, label) {
  return `
  <g transform="translate(${x}, ${y})">
    <!-- Glow Ripple -->
    <circle cx="16" cy="16" r="20" fill="${RED}" fill-opacity="0.2"/>
    <!-- Pin Body -->
    <circle cx="16" cy="16" r="14" fill="${RED}" stroke="#FFFFFF" stroke-width="2"/>
    <text x="16" y="20" fill="#FFFFFF" font-size="10" font-weight="900" text-anchor="middle">${count}</text>
    <!-- Label Pill -->
    <g transform="translate(-14, 34)">
      <rect width="${label.length * 6.5 + 16}" height="18" rx="6" fill="#FFFFFF" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
      <text x="${(label.length * 6.5 + 16) / 2}" y="13" fill="${TEXT_DARK}" font-size="9" font-weight="700" text-anchor="middle">${label}</text>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 5. Capacitor Android Route Planner Screen (412 x 1750)
// -------------------------------------------------------------------------
function generateCapacitorPlanner() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1750" viewBox="0 0 412 1750" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="412" height="1750" fill="${BG_CREAM}"/>
  ${renderCapacitorHeader()}

  <!-- Page Header -->
  <g id="Cap_Planner_Header" transform="translate(20, 116)">
    <rect width="120" height="24" rx="12" fill="${RED_SOFT}"/>
    <text x="60" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">🔀 ROUTE PLANNER</text>
    <text x="0" y="52" fill="${TEXT_MAIN}" font-size="26" font-weight="900" letter-spacing="-0.5">Pandal Hopping Route</text>
    <text x="0" y="74" fill="${TEXT_SEC}" font-size="13">Plan your walking trail with smart nearest-neighbor routing.</text>

    <!-- Metrics Summary Card -->
    <g transform="translate(0, 96)">
      <rect width="372" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <g transform="translate(24, 18)">
        <text x="36" y="14" fill="${TEXT_MUTED}" font-size="10" font-weight="700" text-anchor="middle">TOTAL STOPS</text>
        <text x="36" y="38" fill="${RED}" font-size="18" font-weight="900" text-anchor="middle">4 Pandals</text>

        <line x1="94" y1="4" x2="94" y2="44" stroke="${BORDER_LIGHT}" stroke-width="1"/>

        <text x="162" y="14" fill="${TEXT_MUTED}" font-size="10" font-weight="700" text-anchor="middle">WALK DISTANCE</text>
        <text x="162" y="38" fill="${TEXT_MAIN}" font-size="18" font-weight="900" text-anchor="middle">3.8 km</text>

        <line x1="230" y1="4" x2="230" y2="44" stroke="${BORDER_LIGHT}" stroke-width="1"/>

        <text x="286" y="14" fill="${TEXT_MUTED}" font-size="10" font-weight="700" text-anchor="middle">EST. DURATION</text>
        <text x="286" y="38" fill="${TEXT_MAIN}" font-size="18" font-weight="900" text-anchor="middle">~3h 15m</text>
      </g>
    </g>

    <!-- Optimize Trail Button -->
    <g transform="translate(0, 182)">
      <rect width="372" height="44" rx="14" fill="${RED}"/>
      <text x="186" y="27" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">⚡ Optimize Hopping Sequence</text>
    </g>
  </g>

  <!-- Sequenced Stops -->
  <g id="Cap_Planner_Stops" transform="translate(20, 390)">
    ${renderCapPlannerStop(0, 1, 'Bagbazar Sarbojanin', 'Shyambazar Metro • Start Point')}
    ${renderCapPlannerStop(96, 2, 'Kumartuli Park', '400m walk from Stop 1')}
    ${renderCapPlannerStop(192, 3, 'Sovabazar Rajbari', '450m walk from Stop 2 • Heritage')}
    ${renderCapPlannerStop(288, 4, 'College Square', 'Central Metro • Evening Illumination')}

    <!-- Action Buttons: Export to Maps & WhatsApp Share -->
    <g transform="translate(0, 396)">
      <rect width="372" height="46" rx="14" fill="${RED}"/>
      <text x="186" y="28" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">📍 Export Route to Google Maps</text>

      <g transform="translate(0, 56)">
        <rect width="372" height="46" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="186" y="28" fill="${TEXT_MAIN}" font-size="13" font-weight="700" text-anchor="middle">💬 Share Trail via WhatsApp</text>
      </g>
    </g>
  </g>

  <!-- Actual Capacitor Android Footer -->
  ${renderCapacitorFooter(1580, 412)}

  <!-- Fixed Mobile Bottom Navigation + Gesture Pill -->
  ${renderMobileBottomNav(1662, 412, 'Planner')}
  ${renderAndroidGesturePill(1726, 412)}
</svg>`;
}

function renderCapPlannerStop(y, idx, name, desc) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="372" height="84" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <circle cx="30" cy="42" r="14" fill="${RED}"/>
    <text x="30" y="47" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">${idx}</text>
    <g transform="translate(58, 24)">
      <text x="0" y="16" fill="${TEXT_MAIN}" font-size="15" font-weight="800">${name}</text>
      <text x="0" y="36" fill="${TEXT_MUTED}" font-size="11">${desc}</text>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 6. Capacitor Android Calendar Screen (412 x 1850)
// -------------------------------------------------------------------------
function generateCapacitorCalendar() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1850" viewBox="0 0 412 1850" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="412" height="1850" fill="${BG_CREAM}"/>
  ${renderCapacitorHeader()}

  <!-- Page Header -->
  <g id="Cap_Cal_Header" transform="translate(20, 116)">
    <rect width="116" height="24" rx="12" fill="${RED_SOFT}"/>
    <text x="58" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">📅 PUJA ALMANAC</text>
    <text x="0" y="52" fill="${TEXT_MAIN}" font-size="26" font-weight="900" letter-spacing="-0.5">Durga Puja 2026 Calendar</text>
    <text x="0" y="74" fill="${TEXT_SEC}" font-size="13">Exact Bengali 1433 tithi timings &amp; Sandhi Puja.</text>

    <!-- SANDHI PUJA SPECIAL CARD -->
    <g transform="translate(0, 96)">
      <rect width="372" height="220" rx="20" fill="${BG_WHITE}" stroke="#fca5a5" stroke-width="1.8"/>
      <g transform="translate(18, 18)">
        <rect width="115" height="22" rx="11" fill="${RED_SOFT}"/>
        <text x="57" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle" class="bengali">মহাসন্ধিক্ষণ ২০২৬</text>

        <rect x="124" width="135" height="22" rx="11" fill="#fef3c7"/>
        <text x="191" y="15" fill="${GOLD}" font-size="10" font-weight="700" text-anchor="middle">108 Lotuses &amp; Lamps</text>

        <text x="0" y="58" fill="${TEXT_MAIN}" font-size="20" font-weight="900">Sandhi Puja Timings</text>
        <text x="0" y="78" fill="${TEXT_SEC}" font-size="12">48-minute sacred transit of Maha Ashtami to Navami.</text>

        <!-- Convention 1 (Selected) -->
        <g transform="translate(0, 92)">
          <rect width="336" height="44" rx="12" fill="#FFFFFF" stroke="${RED}" stroke-width="1.5"/>
          <text x="14" y="20" fill="${TEXT_MAIN}" font-size="12" font-weight="700" class="bengali">বিশুদ্ধ সিদ্ধান্ত (Bisuddha Siddhanta)</text>
          <text x="14" y="34" fill="${RED}" font-size="11" font-weight="700">05:24 PM – 06:12 PM</text>
          <text x="320" y="26" fill="${RED}" font-size="12" font-weight="800" text-anchor="end">✓</text>
        </g>

        <!-- Convention 2 -->
        <g transform="translate(0, 142)">
          <rect width="336" height="44" rx="12" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
          <text x="14" y="20" fill="${TEXT_MAIN}" font-size="12" font-weight="600" class="bengali">সূর্যসিদ্ধান্ত (Surya Siddhanta / Gupta Press)</text>
          <text x="14" y="34" fill="${TEXT_MUTED}" font-size="11">05:48 PM – 06:36 PM</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 5 SACRED PUJA DAYS -->
  <g id="Cap_Cal_Cards" transform="translate(20, 480)">
    ${renderCapCalendarDay(0, 'Maha Sasthi', 'মহা ষষ্ঠী', 'Oct 16, 2026', 'Bodhon, Amantran &amp; Adhivas', '06:45 PM – 08:30 PM')}
    ${renderCapCalendarDay(170, 'Maha Saptami', 'মহা সপ্তমী', 'Oct 17, 2026', 'Nabapatrika Pravesh', '06:12 AM – 08:40 AM')}
    ${renderCapCalendarDay(340, 'Maha Ashtami', 'মহা অষ্টমী', 'Oct 18, 2026', 'Sandhi Puja (108 Lamps &amp; Lotuses)', '05:24 PM – 06:12 PM')}
    ${renderCapCalendarDay(510, 'Maha Navami', 'মহা নবমী', 'Oct 19, 2026', 'Maha Aarti &amp; Dhunuchi Naach', '11:30 AM – 01:15 PM')}
    ${renderCapCalendarDay(680, 'Bijoya Dashami', 'বিজয়া দশমী', 'Oct 20, 2026', 'Sindoor Khela &amp; Immersion', '03:00 PM onwards')}
  </g>

  <!-- Actual Capacitor Android Footer -->
  ${renderCapacitorFooter(1680, 412)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderMobileBottomNav(1762, 412, 'More')}
  ${renderAndroidGesturePill(1826, 412)}
</svg>`;
}

function renderCapCalendarDay(y, titleEn, titleBn, date, ritual, timings) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="372" height="154" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(20, 18)">
      <rect width="110" height="24" rx="12" fill="${RED_SOFT}"/>
      <text x="55" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">${date}</text>
      <text x="0" y="52" fill="${TEXT_MAIN}" font-size="18" font-weight="900">${titleEn} • <tspan class="bengali" font-size="15">${titleBn}</tspan></text>
      <text x="0" y="78" fill="${TEXT_SEC}" font-size="13" font-weight="600">${ritual}</text>
      <text x="0" y="104" fill="${RED}" font-size="12" font-weight="700">⏱️ ${timings}</text>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 7. Capacitor Android Drawer Screen (412 x 915)
// -------------------------------------------------------------------------
function generateCapacitorDrawer() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <!-- Dimmed Background Overlay Scrim -->
  <rect width="412" height="915" fill="#000000" fill-opacity="0.55"/>

  <!-- Android System Status Bar (White icons on dark) -->
  <g id="Android_Status_Bar_Drawer">
    <text x="24" y="28" fill="#FFFFFF" font-size="14" font-weight="600">6:36</text>
    <g transform="translate(328, 16)">
      <text x="0" y="12" fill="#FFFFFF" font-size="11" font-weight="700">5G</text>
      <path d="M22 22 L22 14 M25 22 L25 10 M28 22 L28 6 M31 22 L31 2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <rect x="38" y="8" width="18" height="10" rx="2" stroke="#FFFFFF" stroke-width="1.5" fill="none"/>
      <rect x="40" y="10" width="12" height="6" fill="#FFFFFF"/>
      <line x1="57" y1="11" x2="57" y2="15" stroke="#FFFFFF" stroke-width="1.5"/>
    </g>
  </g>

  <!-- Slide-up Bottom Sheet Modal -->
  <g id="More_Drawer_Modal" transform="translate(0, 200)">
    <!-- Sheet Container -->
    <rect width="412" height="715" rx="28" fill="${BG_WHITE}"/>

    <!-- Top Grab Handle -->
    <rect x="186" y="12" width="40" height="4" rx="2" fill="#c7bcb1"/>

    <!-- Drawer Header -->
    <g transform="translate(24, 38)">
      <text x="0" y="20" fill="${TEXT_DARK}" font-size="20" font-weight="900">More Features &amp; Services</text>
      <text x="0" y="38" fill="${TEXT_MUTED}" font-size="12">Explore specialized tools and cultural information</text>
      
      <!-- Close (X) Button -->
      <circle cx="340" cy="18" r="16" fill="${BG_SURFACE}"/>
      <text x="340" y="23" fill="${TEXT_MUTED}" font-size="14" text-anchor="middle">✕</text>
    </g>

    <line x1="0" y1="94" x2="412" y2="94" stroke="${BORDER}" stroke-width="1"/>

    <!-- 8 Menu Items Grid -->
    <g id="Drawer_Menu_Items" transform="translate(24, 110)">
      ${renderDrawerItem(0, 0, '📅', 'Calendar', 'Auspicious tithis and Sandhi Puja', '#ea580c')}
      ${renderDrawerItem(0, 56, '🚇', 'Metro Guide', 'Station connections & schedules', '#2563eb')}
      ${renderDrawerItem(0, 112, '🎵', 'Puja Music', 'Traditional Chandi Path &amp; Dhak beats', '#7c3aed')}
      ${renderDrawerItem(0, 168, '✨', 'Mahalaya Special', 'Birendra Krishna Bhadra classic broadcast', '#d97706')}
      ${renderDrawerItem(0, 224, 'ℹ️', 'Help &amp; Information', 'Emergency helplines and guides', '#0d9488')}
      ${renderDrawerItem(0, 280, '💬', 'Feedback &amp; Suggestions', 'Share ideas and report bugs', '#4b5563')}
      ${renderDrawerItem(0, 336, '👥', 'Meet the Developers', 'Soumik &amp; Moumita co-creators', '#b42323')}
      ${renderDrawerItem(0, 392, '❤️', 'Saved Pandals', 'Personal festival bookmarks', '#e02424')}
    </g>

    <!-- Share Feedback Quick Action (From MobileBottomNav.tsx) -->
    <g transform="translate(24, 570)">
      <rect width="364" height="46" rx="14" fill="#f0f7ff" stroke="#0a66c2" stroke-opacity="0.3" stroke-width="1"/>
      <text x="182" y="28" fill="${LINKEDIN_BLUE}" font-size="13" font-weight="700" text-anchor="middle">💬 Share Feedback</text>
    </g>

    <!-- Bottom Nav + Gesture Pill inside sheet view -->
    ${renderMobileBottomNav(628, 412, 'More')}
    ${renderAndroidGesturePill(692, 412)}
  </g>
</svg>`;
}

function renderDrawerItem(x, y, icon, title, desc, color) {
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="364" height="48" rx="14" fill="${BG_SURFACE}" fill-opacity="0.6"/>
    <circle cx="24" cy="24" r="14" fill="${color}" fill-opacity="0.12"/>
    <text x="24" y="29" font-size="14" text-anchor="middle">${icon}</text>
    <text x="50" y="21" fill="${TEXT_DARK}" font-size="13" font-weight="700">${title}</text>
    <text x="50" y="36" fill="${TEXT_MUTED}" font-size="10">${desc}</text>
    <text x="346" y="28" fill="${TEXT_MUTED}" font-size="14">›</text>
  </g>`;
}

// -------------------------------------------------------------------------
// 8. Capacitor Android Developer Screen (412 x 1950)
// -------------------------------------------------------------------------
function generateCapacitorDeveloper() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1950" viewBox="0 0 412 1950" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="412" height="1950" fill="${BG_CREAM}"/>
  ${renderCapacitorHeader()}

  <!-- Page Header -->
  <g id="Cap_Dev_Header" transform="translate(20, 116)">
    <rect width="168" height="24" rx="12" fill="${RED_SOFT}"/>
    <text x="84" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">👥 PROJECT CO-CREATORS</text>
    <text x="0" y="52" fill="${TEXT_MAIN}" font-size="28" font-weight="900" letter-spacing="-0.5">Meet the Developers</text>
    <text x="0" y="76" fill="${TEXT_SEC}" font-size="13">
      PujoPath is co-created by Soumik and Moumita to help discover Kolkata's pandals.
    </text>
  </g>

  <!-- STACKED DEVELOPER CARDS: MOUMITA FIRST, SOUMIK SECOND, FEEDBACK THIRD -->
  <g id="Cap_Dev_Cards" transform="translate(20, 230)">
    
    <!-- CARD 1: MOUMITA -->
    <g id="Cap_Card_Moumita" transform="translate(0, 0)">
      <rect width="372" height="660" rx="22" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

      <!-- Profile Header -->
      <g transform="translate(20, 20)">
        <g id="Cap_Moumita_Photo">
          <image href="${IMAGES.moumita}" width="84" height="84" clip-path="url(#moumita-mob-clip)" preserveAspectRatio="xMidYMid slice"/>
          <rect width="84" height="84" rx="16" stroke="${RED}" stroke-width="1.8" stroke-opacity="0.25" fill="none"/>
          <circle cx="76" cy="76" r="11" fill="#faf7f2" stroke="${BORDER}" stroke-width="1"/>
          <text x="76" y="80" font-size="9" text-anchor="middle">📐</text>
        </g>

        <g transform="translate(100, 6)">
          <rect width="90" height="22" rx="11" fill="${RED_SOFT}"/>
          <text x="12" y="15" fill="${RED}" font-size="10" font-weight="700">✨ Co-Creator</text>
          <text x="0" y="46" fill="${TEXT_DARK}" font-size="24" font-weight="900">Moumita</text>
          <text x="0" y="68" fill="${RED}" font-size="13" font-weight="700">UI &amp; Frontend Lead</text>
        </g>
      </g>

      <!-- Narrative -->
      <g transform="translate(20, 122)">
        <text x="0" y="0" fill="${TEXT_SEC}" font-size="12">
          <tspan x="0" dy="16">Directs user interface design, frontend architecture,</tspan>
          <tspan x="0" dy="18">responsive layouts, user experience, visual consistency,</tspan>
          <tspan x="0" dy="18">and interaction design, alongside research and curation</tspan>
          <tspan x="0" dy="18">of Kolkata's historic Bonedi Bari traditions.</tspan>
        </text>
      </g>

      <!-- Key Responsibilities Chips -->
      <g transform="translate(20, 220)">
        <text x="0" y="0" fill="#8a7f76" font-size="10" font-weight="800" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
        <g transform="translate(0, 10)">
          ${renderCapChip(0, 0, 'User Interface Design')}
          ${renderCapChip(150, 0, 'Frontend Architecture')}
          ${renderCapChip(0, 36, 'Responsive Layouts')}
          ${renderCapChip(145, 36, 'User Experience (UX)')}
          ${renderCapChip(0, 72, 'Visual Consistency')}
          ${renderCapChip(140, 72, 'Cultural Curation')}
          ${renderCapChip(0, 108, 'Frontend Interaction Design')}
        </g>
      </g>

      <!-- LinkedIn Action Button -->
      <g transform="translate(20, 598)">
        <line x1="0" y1="0" x2="332" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
        <text x="0" y="30" fill="#8a7f76" font-size="12">Professional Profile</text>
        <g transform="translate(226, 12)">
          <rect width="106" height="34" rx="10" fill="${LINKEDIN_BLUE}"/>
          <text x="14" y="22" font-size="13">in</text>
          <text x="34" y="22" fill="#FFFFFF" font-size="12" font-weight="700">LinkedIn</text>
          <text x="90" y="22" fill="#FFFFFF" font-size="11">↗</text>
        </g>
      </g>
    </g>

    <!-- CARD 2: SOUMIK -->
    <g id="Cap_Card_Soumik" transform="translate(0, 684)">
      <rect width="372" height="660" rx="22" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

      <!-- Profile Header -->
      <g transform="translate(20, 20)">
        <g id="Cap_Soumik_Photo">
          <image href="${IMAGES.soumik}" width="84" height="84" clip-path="url(#soumik-mob-clip)" preserveAspectRatio="xMidYMid slice"/>
          <rect width="84" height="84" rx="16" stroke="${RED}" stroke-width="1.8" stroke-opacity="0.25" fill="none"/>
          <circle cx="76" cy="76" r="11" fill="#faf7f2" stroke="${BORDER}" stroke-width="1"/>
          <!-- Code Badge </ > matching actual APK -->
          <text x="76" y="80" font-size="9" font-weight="800" text-anchor="middle">&lt;/&gt;</text>
        </g>

        <g transform="translate(100, 6)">
          <rect width="90" height="22" rx="11" fill="${RED_SOFT}"/>
          <text x="12" y="15" fill="${RED}" font-size="10" font-weight="700">✨ Co-Creator</text>
          <text x="0" y="46" fill="${TEXT_DARK}" font-size="24" font-weight="900">Soumik</text>
          <text x="0" y="68" fill="${RED}" font-size="13" font-weight="700">Backend &amp; Systems Lead</text>
        </g>
      </g>

      <!-- Narrative -->
      <g transform="translate(20, 122)">
        <text x="0" y="0" fill="${TEXT_SEC}" font-size="12">
          <tspan x="0" dy="16">Directs backend &amp; systems architecture, core application</tspan>
          <tspan x="0" dy="18">logic, route optimization algorithms, offline-first transit</tspan>
          <tspan x="0" dy="18">functionality, backend integrations, and performance.</tspan>
        </text>
      </g>

      <!-- Key Responsibilities Chips -->
      <g transform="translate(20, 220)">
        <text x="0" y="0" fill="#8a7f76" font-size="10" font-weight="800" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
        <g transform="translate(0, 10)">
          ${renderCapChip(0, 0, 'Backend Architecture')}
          ${renderCapChip(150, 0, 'Core Application Logic')}
          ${renderCapChip(0, 36, 'System Architecture')}
          ${renderCapChip(145, 36, 'Route Optimization')}
          ${renderCapChip(0, 72, 'Offline-First Transit')}
          ${renderCapChip(140, 72, 'Backend Integrations')}
          ${renderCapChip(0, 108, 'Performance &amp; Scale')}
        </g>
      </g>

      <!-- LinkedIn Action Button -->
      <g transform="translate(20, 598)">
        <line x1="0" y1="0" x2="332" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
        <text x="0" y="30" fill="#8a7f76" font-size="12">Professional Profile</text>
        <g transform="translate(226, 12)">
          <rect width="106" height="34" rx="10" fill="${LINKEDIN_BLUE}"/>
          <text x="14" y="22" font-size="13">in</text>
          <text x="34" y="22" fill="#FFFFFF" font-size="12" font-weight="700">LinkedIn</text>
          <text x="90" y="22" fill="#FFFFFF" font-size="11">↗</text>
        </g>
      </g>
    </g>

    <!-- CARD 3: FEEDBACK & SUGGESTIONS (Exact match to APK developer page) -->
    <g id="Cap_Card_Feedback" transform="translate(0, 1368)">
      <rect width="372" height="150" rx="22" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <text x="0" y="14" fill="${LINKEDIN_BLUE}" font-size="10" font-weight="800" letter-spacing="0.5">💭 FEEDBACK &amp; SUGGESTIONS</text>
        <text x="0" y="38" fill="${TEXT_MAIN}" font-size="16" font-weight="800">Have feedback for the team?</text>
        <text x="0" y="58" fill="${TEXT_MUTED}" font-size="11">Share ideas, report bugs, or request features directly.</text>
        
        <g transform="translate(0, 74)">
          <rect width="332" height="38" rx="12" fill="${LINKEDIN_BLUE}"/>
          <text x="166" y="24" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">💬 Share Feedback</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Actual Capacitor Android Footer -->
  ${renderCapacitorFooter(1780, 412)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderMobileBottomNav(1862, 412, 'More')}
  ${renderAndroidGesturePill(1926, 412)}
</svg>`;
}

function renderCapChip(x, y, label) {
  const width = label.length * 6.5 + 22;
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="${width}" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
    <text x="${width / 2}" y="18" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">${label}</text>
  </g>`;
}

// -------------------------------------------------------------------------
// 9. Capacitor Android Music Player Screen (412 x 1850)
// With Authentic Floating Miniplayer (Matching emulator_miniplayer_paused.png)
// -------------------------------------------------------------------------
function generateCapacitorMusicPlayer() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1850" viewBox="0 0 412 1850" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="412" height="1850" fill="${BG_CREAM}"/>
  ${renderCapacitorHeader()}

  <!-- Page Header -->
  <g id="Cap_Music_Header" transform="translate(20, 116)">
    <rect width="186" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="93" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">🎵 SHARODIYA SOUNDSCAPE</text>
    <text x="0" y="62" fill="${TEXT_MAIN}" font-size="26" font-weight="900" letter-spacing="-0.5">Festive Puja Music</text>
    <text x="0" y="86" fill="${TEXT_SEC}" font-size="13">Explore Bengal's rich Durga Puja sound culture.</text>

    <!-- Choose Your Puja Mood Card -->
    <g transform="translate(0, 106)">
      <rect width="372" height="144" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="16" y="28" fill="${TEXT_MAIN}" font-size="14" font-weight="800">✨ Choose Your Puja Mood</text>
      
      <g transform="translate(16, 42)">
        <rect width="84" height="30" rx="15" fill="${RED}"/>
        <text x="42" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All Moods</text>

        <rect x="92" width="130" height="30" rx="15" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="157" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Ritual &amp; Devotion</text>

        <rect x="230" width="110" height="30" rx="15" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="285" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Dhak Beats</text>
      </g>

      <g transform="translate(16, 82)">
        <rect width="110" height="30" rx="15" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="55" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Pandal Hopping</text>

        <rect x="118" width="114" height="30" rx="15" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="175" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Bengali Festive</text>

        <rect x="240" width="100" height="30" rx="15" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="290" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Bisarjan</text>
      </g>
    </g>

    <!-- Search Input Bar -->
    <g transform="translate(0, 266)">
      <rect width="372" height="46" rx="12" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="16" y="28" font-size="15">🔍</text>
      <text x="42" y="28" fill="${TEXT_MUTED}" font-size="12">Search tracks, artists, rhythms...</text>
    </g>
  </g>

  <!-- Curated Audio Library Header -->
  <g transform="translate(20, 450)">
    <text x="0" y="0" fill="${TEXT_MAIN}" font-size="16" font-weight="800">Curated Audio Library (22)</text>
    <text x="372" y="0" fill="${TEXT_FAINT}" font-size="11" text-anchor="end">Verified Licences</text>

    <!-- Tracks List -->
    <g transform="translate(0, 16)">
      ${renderCapAudioTrack(0, 'Sharodiya Dhak Dhwoni &amp; Kashi', 'Mamta Jagdish Dhody • Traditional', '01:39')}
      ${renderCapAudioTrack(96, 'Sacred Shankha Naad (Aarti)', 'David Bolton • Dhak &amp; Shankha', '00:07')}
      ${renderCapAudioTrack(192, 'Dhunuchi Naach Dhak Taal', 'Traditional Bengali Dhaki Ensemble', '04:00')}
      ${renderCapAudioTrack(288, 'Bisarjan Dhak &amp; Asche Bochor', 'Babughat Immersion Procession', '01:39')}
    </g>
  </g>

  <!-- Actual Capacitor Android Footer -->
  ${renderCapacitorFooter(940, 412)}

  <!-- 3. AUTHENTIC FLOATING MINIPLAYER (Floats Above Bottom Nav) -->
  <g id="Capacitor_Floating_Miniplayer" transform="translate(12, 1676)">
    <!-- Container with Soft Shadow -->
    <rect width="388" height="70" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.12))"/>
    
    <!-- Top Thin Progress Bar (Red Active 35%) -->
    <rect x="0" y="0" width="138" height="3" rx="1.5" fill="${RED}"/>

    <g transform="translate(14, 13)">
      <!-- Durga Artwork Thumbnail -->
      <g id="Miniplayer_Artwork_Clip">
        <rect width="44" height="44" rx="22" fill="#240c0c"/>
        <clipPath id="miniplayer-art-clip">
          <circle cx="22" cy="22" r="22"/>
        </clipPath>
        <g clip-path="url(#miniplayer-art-clip)">
          <image href="${IMAGES.miniplayer}" width="44" height="44" preserveAspectRatio="xMidYMid slice"/>
        </g>
      </g>

      <!-- Track Information -->
      <g transform="translate(56, 4)">
        <text x="0" y="14" fill="${TEXT_MAIN}" font-size="13" font-weight="800">Bisarjan Dhak &amp; Asche Bocho...</text>
        <text x="0" y="28" fill="${TEXT_MUTED}" font-size="10">Babughat Immersion Procession Dh...</text>
        <text x="0" y="40" fill="${RED}" font-size="9" font-weight="700">00:31 / 01:38</text>
      </g>

      <!-- Controls (Play/Pause, Queue, Close) -->
      <g transform="translate(254, 4)">
        <!-- Red Circular Play/Pause Button -->
        <circle cx="20" cy="18" r="18" fill="${RED}"/>
        <path d="M16 11 L27 18 L16 25 Z" fill="#FFFFFF"/>

        <!-- Playlist Queue Icon -->
        <text x="56" y="22" fill="${TEXT_MUTED}" font-size="16">≡</text>

        <!-- Dismiss X Icon -->
        <text x="86" y="22" fill="${TEXT_MUTED}" font-size="15">✕</text>
      </g>
    </g>
  </g>

  <!-- Fixed Mobile Bottom Navigation + Gesture Pill -->
  ${renderMobileBottomNav(1762, 412, 'More')}
  ${renderAndroidGesturePill(1826, 412)}
</svg>`;
}

function renderCapAudioTrack(y, title, artist, duration) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="372" height="84" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(16, 16)">
      <circle cx="22" cy="24" r="18" fill="${RED_SOFT}"/>
      <path d="M18 17 L28 24 L18 31 Z" fill="${RED}"/>
      <g transform="translate(52, 6)">
        <text x="0" y="15" fill="${TEXT_MAIN}" font-size="14" font-weight="800">${title}</text>
        <text x="0" y="34" fill="${TEXT_MUTED}" font-size="11">${artist}</text>
      </g>
      <text x="340" y="22" fill="${RED}" font-size="12" font-weight="700" text-anchor="end">${duration}</text>
      <text x="340" y="44" fill="${TEXT_FAINT}" font-size="14" text-anchor="end">🔖</text>
    </g>
  </g>`;
}

// Generate all 9 capacitor screens
console.log('Generating Capacitor SVGs...');
fs.writeFileSync(path.join(CAP_DIR, '01_capacitor_launch_splash.svg'), generateCapacitorLaunchSplash());
fs.writeFileSync(path.join(CAP_DIR, '02_capacitor_android_home.svg'), generateCapacitorHome());
fs.writeFileSync(path.join(CAP_DIR, '03_capacitor_android_explore.svg'), generateCapacitorExplore());
fs.writeFileSync(path.join(CAP_DIR, '04_capacitor_android_map.svg'), generateCapacitorMap());
fs.writeFileSync(path.join(CAP_DIR, '05_capacitor_android_planner.svg'), generateCapacitorPlanner());
fs.writeFileSync(path.join(CAP_DIR, '06_capacitor_android_calendar.svg'), generateCapacitorCalendar());
fs.writeFileSync(path.join(CAP_DIR, '07_capacitor_android_drawer.svg'), generateCapacitorDrawer());
fs.writeFileSync(path.join(CAP_DIR, '08_capacitor_android_developer.svg'), generateCapacitorDeveloper());
fs.writeFileSync(path.join(CAP_DIR, '09_capacitor_android_music_player.svg'), generateCapacitorMusicPlayer());
console.log('All 9 Capacitor SVGs generated successfully in:', CAP_DIR);

module.exports = {
  generateCapacitorLaunchSplash,
  generateCapacitorHome,
  generateCapacitorExplore,
  generateCapacitorMap,
  generateCapacitorPlanner,
  generateCapacitorCalendar,
  generateCapacitorDrawer,
  generateCapacitorDeveloper,
  generateCapacitorMusicPlayer,
};
