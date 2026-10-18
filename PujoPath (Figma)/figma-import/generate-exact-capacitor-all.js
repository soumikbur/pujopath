const fs = require('fs');
const path = require('path');
const {
  IMAGES,
  TOKENS,
  SVG_STYLE,
  renderAndroidStatusBar,
  renderAndroidGesturePill,
  renderCapacitorHeader,
  renderCapacitorBottomNav,
  renderCapacitorFooter,
  renderCapacitorMiniplayer
} = require('./faithful-capacitor-shared');

const OUT_DIR = path.resolve(__dirname, '../exports/capacitor-mobile');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// -----------------------------------------------------------------------------
// 1. Splash Screen (412 x 915)
// -----------------------------------------------------------------------------
function generateSplashScreen(isDark = false) {
  const modeLabel = isDark ? 'Dark Mode' : 'Light Mode';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <!-- Base Background -->
  <rect width="412" height="915" fill="#140707"/>

  <!-- Fullscreen Sacred Durga Protima Artwork -->
  <image href="${IMAGES.durgaBg}" width="412" height="915" preserveAspectRatio="xMidYMid slice"/>

  <!-- Dark Atmospheric Gradient Overlay for Contrast -->
  <rect width="412" height="915" fill="url(#splash_dark_grad_${isDark ? 'dark' : 'light'})"/>
  <defs>
    <linearGradient id="splash_dark_grad_${isDark ? 'dark' : 'light'}" x1="0" y1="0" x2="0" y2="915" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.6"/>
      <stop offset="35%" stop-color="#000000" stop-opacity="0.2"/>
      <stop offset="70%" stop-color="#000000" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- Android System Status Bar (White on dark) -->
  ${renderAndroidStatusBar(isDark, true)}

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
  <g transform="translate(206, 590)" text-anchor="middle">
    <!-- Traditional Floral Mandala Emblem -->
    <circle cx="0" cy="0" r="32" fill="#b42323" fill-opacity="0.9"/>
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
      <rect width="200" height="4" rx="2" fill="#b42323"/>
    </g>
    <text x="0" y="206" fill="#f5f1eb" font-size="11" font-weight="500">Preparing sacred routes...</text>
  </g>

  <!-- Android Bottom Gesture Pill -->
  ${renderAndroidGesturePill(886, isDark)}
</svg>`;
}

// -----------------------------------------------------------------------------
// 2. Home Screen (412 x 1850)
// -----------------------------------------------------------------------------
function generateHomeScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1850" viewBox="0 0 412 1850" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="1850" fill="${t.bg}"/>

  <!-- Background Watermark Artwork -->
  <g opacity="${isDark ? '0.25' : '0.15'}">
    <image href="${IMAGES.ghibliBg}" width="412" height="420" preserveAspectRatio="xMidYMid slice"/>
  </g>

  <!-- Android Status Bar + Capacitor App Bar -->
  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- 1. Hero Card -->
  <g id="Cap_Hero_Card" transform="translate(18, 114)">
    <rect width="376" height="264" rx="22" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1" filter="drop-shadow(0 4px 16px ${t.shadow})"/>
    
    <g transform="translate(20, 20)">
      <!-- Status Pill -->
      <g id="Countdown_Pill">
        <rect width="136" height="28" rx="14" fill="${t.redPillBg}" stroke="${t.redPillBorder}" stroke-width="1"/>
        <text x="12" y="19" font-size="13">📅</text>
        <text x="32" y="19" fill="${t.redPillText}" font-size="11" font-weight="700">Puja is live</text>
      </g>

      <!-- Headline -->
      <text x="0" y="70" fill="${t.textMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Your Puja, made simple.</text>
      <text x="0" y="96" fill="${t.textMuted}" font-size="13">Find the pandals you love, build a route,</text>
      <text x="0" y="114" fill="${t.textMuted}" font-size="13">and head out with confidence.</text>

      <!-- Action Buttons -->
      <g transform="translate(0, 136)">
        <rect width="336" height="42" rx="12" fill="${t.red}"/>
        <text x="168" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">🔍 Find pandals →</text>

        <g transform="translate(0, 50)">
          <rect width="336" height="42" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="168" y="26" fill="${t.textMain}" font-size="13" font-weight="700" text-anchor="middle">🧭 Build a route</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 2. Quick Access 2-Column Grid -->
  <g id="Cap_Quick_Access" transform="translate(18, 400)">
    <text x="0" y="0" fill="${t.textMain}" font-size="16" font-weight="800">Quick Access</text>
    <g transform="translate(0, 14)">
      ${renderQuickCard(0, 0, '📍', 'Map', 'See all pandals at a glance', '#b42323', t)}
      ${renderQuickCard(192, 0, '🔀', 'Route Planner', 'Optimize your hopping trail', '#0d9488', t)}
      ${renderQuickCard(0, 84, '🚇', 'Metro Guide', 'Find nearest metro stations', '#2563eb', t)}
      ${renderQuickCard(192, 84, '📅', 'Calendar', 'Auspicious tithis and hours', '#ea580c', t)}
      ${renderQuickCard(0, 168, '🎵', 'Puja Music', 'Chandi Path &amp; Dhak beats', '#7c3aed', t)}
      ${renderQuickCard(192, 168, '✨', 'Mahalaya', 'Timeless dawn broadcast', '#d97706', t)}
    </g>
  </g>

  <!-- 3. Curated Highlights with Real Photos -->
  <g id="Cap_Puja_Highlights" transform="translate(18, 690)">
    <g transform="translate(0, 0)">
      <text x="0" y="0" fill="${t.red}" font-size="16" font-weight="900">✣</text>
      <text x="18" y="0" fill="${t.textMain}" font-size="16" font-weight="800">Puja Highlights</text>
      <text x="376" y="0" fill="${t.red}" font-size="12" font-weight="700" text-anchor="end">View all →</text>
    </g>
    <g transform="translate(0, 14)">
      ${renderHighlightCard(0, IMAGES.sovabazar, 'Traditions &amp; Art', 'Traditions &amp; Pandal Art', "Discover Bengal's timeless heritage celebrations.", 'hl1_' + (isDark ? 'dark' : 'light'), t)}
      ${renderHighlightCard(104, IMAGES.bagbazar, 'Almanac', 'Sacred Almanac &amp; Timings', 'Accurate Ashtami Sandhi Puja, Pushpanjali timings.', 'hl2_' + (isDark ? 'dark' : 'light'), t)}
      ${renderHighlightCard(208, IMAGES.collegeSquare, 'Routes', 'Pujo Evenings &amp; Routes', 'Plan your route for best evening illumination.', 'hl3_' + (isDark ? 'dark' : 'light'), t)}
    </g>
  </g>

  <!-- 4. Feature Utility Pills -->
  <g id="Cap_Feature_Pills" transform="translate(18, 1040)">
    ${renderFeaturePill(0, 0, '✨', 'Ultra Simple', 'Only what you need', t)}
    ${renderFeaturePill(192, 0, '⚡', 'Lightning Fast', 'Smooth experience', t)}
    ${renderFeaturePill(0, 58, '📱', 'Fully Responsive', 'All devices', t)}
    ${renderFeaturePill(192, 58, '🌙', 'Dark Mode', 'Click to toggle', t)}
    ${renderFeaturePill(0, 116, '🌐', 'Bengali &amp; English', 'Click to toggle', t)}
    ${renderFeaturePill(192, 116, '❤️', 'Saved Trails', 'Saved favorites', t)}
  </g>

  <!-- 5. Footer -->
  ${renderCapacitorFooter(1680, isDark)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('Home', isDark, 1762)}
  ${renderAndroidGesturePill(1826, isDark)}
</svg>`;
}

function renderQuickCard(x, y, icon, title, desc, color, t) {
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="184" height="74" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <rect x="12" y="14" width="32" height="32" rx="8" fill="${color}" fill-opacity="0.12"/>
    <text x="28" y="35" font-size="15" text-anchor="middle">${icon}</text>
    <text x="52" y="28" fill="${t.textMain}" font-size="13" font-weight="700">${title}</text>
    <text x="52" y="44" fill="${t.textMuted}" font-size="10">${desc}</text>
  </g>`;
}

function renderHighlightCard(y, imageHref, badge, title, desc, clipId, t) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="376" height="92" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <g transform="translate(10, 10)">
      <clipPath id="${clipId}"><rect width="105" height="72" rx="10"/></clipPath>
      <image href="${imageHref}" width="105" height="72" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
      <rect width="68" height="16" rx="4" fill="#000000" fill-opacity="0.65"/>
      <text x="34" y="12" fill="#FFFFFF" font-size="8" font-weight="700" text-anchor="middle">${badge}</text>
    </g>
    <g transform="translate(126, 22)">
      <text x="0" y="14" fill="${t.textMain}" font-size="13" font-weight="700">${title}</text>
      <text x="0" y="34" fill="${t.textMuted}" font-size="11">${desc}</text>
    </g>
  </g>`;
}

function renderFeaturePill(x, y, icon, title, desc, t) {
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="184" height="48" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="18" y="28" font-size="14">${icon}</text>
    <text x="38" y="22" fill="${t.textMain}" font-size="11" font-weight="700">${title}</text>
    <text x="38" y="36" fill="${t.textMuted}" font-size="9">${desc}</text>
  </g>`;
}

// -----------------------------------------------------------------------------
// 3. Explore Screen (412 x 2250)
// -----------------------------------------------------------------------------
function generateExploreScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="2250" viewBox="0 0 412 2250" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="2250" fill="${t.bg}"/>

  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- Page Header -->
  <g id="Cap_Explore_Header" transform="translate(20, 114)">
    <rect width="134" height="24" rx="12" fill="${t.redPillBg}"/>
    <text x="67" y="16" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">🔍 PANDAL DIRECTORY</text>
    <text x="0" y="52" fill="${t.textMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Explore Kolkata Pandals</text>
    <text x="0" y="74" fill="${t.textMuted}" font-size="13">Search 774 mapped pandals in Kolkata.</text>

    <!-- Search Input -->
    <g transform="translate(0, 92)">
      <rect width="372" height="46" rx="14" fill="${t.inputBg}" stroke="${t.inputBorder}" stroke-width="1"/>
      <text x="14" y="28" font-size="16">🔍</text>
      <text x="42" y="28" fill="${t.textMuted}" font-size="13">Search pandals by name, Bonedi Bari, t...</text>
    </g>

    <!-- Zone Pills -->
    <g transform="translate(0, 150)">
      <rect x="0" width="76" height="30" rx="15" fill="${t.red}"/>
      <text x="38" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All Zones</text>

      <rect x="84" width="105" height="30" rx="15" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="136" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">North Kolkata</text>

      <rect x="197" width="105" height="30" rx="15" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="249" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">South Kolkata</text>

      <rect x="310" width="62" height="30" rx="15" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="341" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Bonedi</text>
    </g>

    <!-- Feature Filters Toggle Collapse -->
    <g transform="translate(0, 194)">
      <rect width="372" height="34" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="14" y="21" fill="${t.textMain}" font-size="12" font-weight="600">Filter by Features</text>
      <text x="354" y="21" fill="${t.textMuted}" font-size="12" text-anchor="end">∨</text>
    </g>

    <!-- Count & Sort Bar -->
    <g transform="translate(0, 244)">
      <text x="0" y="14" fill="${t.textMuted}" font-size="13">Showing <tspan fill="${t.red}" font-weight="800">774 pandals</tspan></text>
      <g transform="translate(262, -4)">
        <rect width="110" height="26" rx="8" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="55" y="17" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Recommended ∨</text>
      </g>
    </g>
  </g>

  <!-- PANDAL CARDS (Authentic Card Layout) -->
  <g id="Cap_Pandal_Cards" transform="translate(20, 420)">
    ${renderAuthenticPandalCard(0, IMAGES.sreebhumi, 'Dum Dum', 'Featured', 'Sreebhumi Sporting Club', 'Lake Town', '4.9', 'Ultadanga Metro', '1.2km', null, isDark, t)}
    ${renderAuthenticPandalCard(390, IMAGES.sovabazar, 'North Kolkata', 'Bonedi Bari', 'Sovabazar Rajbari (Boro Taraf)', 'Sovabazar', '4.8', 'Sovabazar Sutanuti Metro', '350m', 'Visitor access confirmed', isDark, t)}
    ${renderAuthenticPandalCard(780, IMAGES.bagbazar, 'North Kolkata', 'Heritage', 'Bagbazar Sarbojanin', 'Bagbazar', '4.7', 'Shyambazar Metro', '500m', null, isDark, t)}
    ${renderAuthenticPandalCard(1170, IMAGES.kumartuli, 'North Kolkata', 'Sabeki', 'Kumartuli Park', 'Kumartuli', '4.6', 'Sovabazar Metro', '700m', null, isDark, t)}
  </g>

  <!-- Footer -->
  ${renderCapacitorFooter(2080, isDark)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('Explore', isDark, 2162)}
  ${renderAndroidGesturePill(2226, isDark)}
</svg>`;
}

function renderAuthenticPandalCard(y, imageHref, zone, tag, title, locality, rating, metro, distance, bonediStatus, isDark, t) {
  const isBonedi = tag === 'Bonedi Bari';
  const clipId = `cap_pandal_clip_${y}_${isDark ? 'dark' : 'light'}`;
  return `
  <g transform="translate(0, ${y})">
    <rect width="372" height="370" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    
    <!-- Image Header with Dark Gradient Overlay -->
    <g transform="translate(0, 0)">
      <clipPath id="${clipId}"><rect width="372" height="190" rx="18"/></clipPath>
      <image href="${imageHref}" width="372" height="190" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
      
      <defs>
        <linearGradient id="card_grad_${y}_${isDark ? 'dark' : 'light'}" x1="0" y1="0" x2="0" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.2"/>
          <stop offset="55%" stop-color="#000000" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
        </linearGradient>
      </defs>
      <rect width="372" height="190" rx="18" fill="url(#card_grad_${y}_${isDark ? 'dark' : 'light'})"/>

      <!-- Top Badges -->
      <g transform="translate(14, 14)">
        <rect width="${zone.length * 7 + 16}" height="22" rx="11" fill="#FFFFFF" fill-opacity="0.95"/>
        <text x="${(zone.length * 7 + 16) / 2}" y="15" fill="#1A1715" font-size="10" font-weight="700" text-anchor="middle">${zone}</text>

        ${tag ? `
        <g transform="translate(${zone.length * 7 + 22}, 0)">
          <rect width="${tag.length * 7 + 18}" height="22" rx="11" fill="${isBonedi ? '#800020' : '#ea580c'}"/>
          <text x="${(tag.length * 7 + 18) / 2}" y="15" fill="${isBonedi ? '#fef08a' : '#FFFFFF'}" font-size="10" font-weight="800" text-anchor="middle">${tag}</text>
        </g>` : ''}
      </g>

      <!-- Top Right Heart Bookmark Button -->
      <g transform="translate(328, 12)">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF" fill-opacity="0.9"/>
        <path d="M16 22 C13 19 11 17 11 14.5 A2.8 2.8 0 0 1 16 13 A2.8 2.8 0 0 1 21 14.5 C21 17 19 19 16 22 Z" stroke="${t.red}" stroke-width="1.5" fill="none"/>
      </g>

      <!-- Bottom-Left 2025 Photo Badge -->
      <g transform="translate(14, 134)">
        <rect width="84" height="20" rx="10" fill="#065f46" fill-opacity="0.85" stroke="#34d399" stroke-width="1" stroke-opacity="0.4"/>
        <text x="42" y="14" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>

      <!-- Bottom Title on Image -->
      <text x="14" y="174" fill="#FFFFFF" font-size="16" font-weight="800" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))">${title}</text>
    </g>

    <!-- Card Body Content -->
    <g transform="translate(16, 204)">
      <!-- Locality and Rating -->
      <g>
        <text x="0" y="14" font-size="13">📍</text>
        <text x="20" y="14" fill="${t.textMain}" font-size="13" font-weight="600">${locality}</text>
        <text x="340" y="14" fill="${t.amberStar}" font-size="13" font-weight="800" text-anchor="end">★ ${rating}</text>
      </g>

      <!-- Metro station -->
      <g transform="translate(0, 24)">
        <text x="0" y="14" font-size="13">🚇</text>
        <text x="20" y="14" fill="${t.textMuted}" font-size="12">${metro} (${distance})</text>
      </g>

      ${bonediStatus ? `
      <g transform="translate(0, 48)">
        <rect width="160" height="20" rx="10" fill="${isDark ? '#064e3b' : '#ecfdf5'}" stroke="${isDark ? '#059669' : '#a7f3d0'}" stroke-width="1"/>
        <text x="80" y="14" fill="${isDark ? '#a7f3d0' : '#047857'}" font-size="10" font-weight="700" text-anchor="middle">${bonediStatus}</text>
      </g>` : ''}

      <!-- Bottom Divider Line -->
      <line x1="0" y1="84" x2="340" y2="84" stroke="${t.cardBorder}" stroke-width="1"/>

      <!-- Footer Actions: Left View Details link, Right Add Route Pill -->
      <g transform="translate(0, 102)">
        <text x="0" y="20" fill="${t.red}" font-size="13" font-weight="700">View Details →</text>
        
        <g transform="translate(236, 0)">
          <rect width="104" height="32" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="18" y="20" fill="${t.red}" font-size="12">✈</text>
          <text x="36" y="20" fill="${t.textMain}" font-size="11" font-weight="700">Add Route</text>
        </g>
      </g>
    </g>
  </g>`;
}

// -----------------------------------------------------------------------------
// 4. Map Screen (412 x 915)
// -----------------------------------------------------------------------------
function generateMapScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="915" fill="${t.bg}"/>

  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- Top Filter Chips Bar -->
  <g id="Cap_Map_Filters" transform="translate(16, 108)">
    <rect x="0" width="56" height="32" rx="12" fill="${t.red}"/>
    <text x="28" y="20" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All</text>

    <rect x="62" width="108" height="32" rx="12" fill="#800020"/>
    <text x="116" y="20" fill="#fef08a" font-size="11" font-weight="800" text-anchor="middle">🏛️ Bonedi Bari</text>

    <rect x="176" width="98" height="32" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="225" y="20" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">North Kolkata</text>

    <g transform="translate(282, 0)">
      <rect width="98" height="32" rx="12" fill="${t.redPillBg}" stroke="${t.redPillBorder}" stroke-width="1"/>
      <text x="14" y="20" font-size="12">🚆</text>
      <text x="32" y="20" fill="${t.red}" font-size="11" font-weight="700">Metro</text>
    </g>
  </g>

  <!-- Interactive Map Canvas -->
  <g id="Map_Canvas" transform="translate(0, 148)">
    <rect width="412" height="600" fill="${isDark ? '#1a1816' : '#ede8df'}"/>

    <!-- Hooghly River -->
    <path d="M70 0 C90 120 40 260 65 380 C85 470 50 540 60 600 L0 600 L0 0 Z" fill="${isDark ? '#1b2a3a' : '#b9d6f2'}" stroke="${isDark ? '#234160' : '#9bbfe4'}" stroke-width="1.5"/>
    <text x="28" y="280" fill="${isDark ? '#3b6a9a' : '#6082a6'}" font-size="10" font-weight="700" transform="rotate(-75, 28, 280)">HOOGHLY RIVER</text>

    <!-- Bridges -->
    <line x1="45" y1="210" x2="110" y2="215" stroke="${isDark ? '#475569' : '#718096'}" stroke-width="3" stroke-linecap="round"/>
    <text x="80" y="204" fill="${isDark ? '#94a3b8' : '#4a5568'}" font-size="8" font-weight="700">Howrah Bridge</text>

    <line x1="50" y1="440" x2="120" y2="445" stroke="${isDark ? '#475569' : '#718096'}" stroke-width="3" stroke-linecap="round"/>
    <text x="85" y="434" fill="${isDark ? '#94a3b8' : '#4a5568'}" font-size="8" font-weight="700">Vidyasagar Setu</text>

    <!-- Major Road Networks -->
    <path d="M120 0 L130 600 M240 0 L250 600 M70 180 L412 190 M80 320 L412 330 M60 480 L412 490" stroke="${isDark ? '#2e2722' : '#FFFFFF'}" stroke-width="3"/>
    <path d="M180 0 L185 600 M100 240 L412 250 M100 400 L412 410" stroke="${isDark ? '#241f1a' : '#fbf8f3'}" stroke-width="1.8"/>

    <!-- Metro Blue Line 1 -->
    <path d="M190 20 L185 580" stroke="${t.blueLine}" stroke-width="3.5" stroke-dasharray="6,4"/>
    
    <!-- Metro Green Line 2 -->
    <path d="M30 310 L412 315" stroke="${t.greenLine}" stroke-width="3.5" stroke-dasharray="6,4"/>

    <!-- Pandal Cluster Glowing Pins -->
    ${renderMapPin(210, 80, '24', 'Shyambazar', t)}
    ${renderMapPin(140, 140, '18', 'Sovabazar', t)}
    ${renderMapPin(230, 240, '32', 'College Sq', t)}
    ${renderMapPin(280, 50, '15', 'Dum Dum', t)}
    ${renderMapPin(180, 360, '12', 'Park St', t)}
    ${renderMapPin(260, 440, '45', 'Gariahat', t)}
    ${renderMapPin(150, 510, '28', 'Behala', t)}

    <!-- Zoom Controls -->
    <g transform="translate(360, 20)">
      <rect width="36" height="74" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1" filter="drop-shadow(0 2px 4px ${t.shadow})"/>
      <text x="18" y="26" fill="${t.textMain}" font-size="18" font-weight="700" text-anchor="middle">+</text>
      <line x1="6" y1="37" x2="30" y2="37" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="18" y="58" fill="${t.textMain}" font-size="18" font-weight="700" text-anchor="middle">−</text>
    </g>
  </g>

  <!-- Bottom Floating Sheet -->
  <g id="Cap_Map_Floating_Bar" transform="translate(14, 735)">
    <rect width="384" height="70" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1" filter="drop-shadow(0 4px 12px ${t.shadow})"/>
    
    <g transform="translate(14, 15)">
      <!-- Route Icon in soft red pill -->
      <rect width="38" height="38" rx="12" fill="${t.redPillBg}"/>
      <text x="19" y="24" font-size="16" text-anchor="middle">🔀</text>

      <!-- Summary Copy -->
      <g transform="translate(48, 6)">
        <text x="0" y="12" fill="${t.textMain}" font-size="13" font-weight="900">0 Pandals Selected</text>
        <text x="0" y="26" fill="${t.textMuted}" font-size="10">Click "Add Route" on any card to build trail</text>
      </g>

      <!-- Actions: Open Planner button + Dismiss X -->
      <g transform="translate(242, 4)">
        <rect width="84" height="32" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="42" y="20" fill="${t.textMain}" font-size="11" font-weight="700" text-anchor="middle">Open Plan</text>

        <text x="100" y="21" fill="${t.textMuted}" font-size="14" text-anchor="middle">✕</text>
      </g>
    </g>
  </g>

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('Map', isDark, 827)}
  ${renderAndroidGesturePill(891, isDark)}
</svg>`;
}

function renderMapPin(x, y, count, label, t) {
  return `
  <g transform="translate(${x}, ${y})">
    <circle cx="16" cy="16" r="20" fill="${t.red}" fill-opacity="0.2"/>
    <circle cx="16" cy="16" r="14" fill="${t.red}" stroke="#FFFFFF" stroke-width="2"/>
    <text x="16" y="20" fill="#FFFFFF" font-size="10" font-weight="900" text-anchor="middle">${count}</text>
    <g transform="translate(-14, 34)">
      <rect width="${label.length * 6.5 + 16}" height="18" rx="6" fill="${t.card}" fill-opacity="0.95" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="${(label.length * 6.5 + 16) / 2}" y="13" fill="${t.textMain}" font-size="9" font-weight="700" text-anchor="middle">${label}</text>
    </g>
  </g>`;
}

// -----------------------------------------------------------------------------
// 5. Planner Screen (412 x 1750)
// -----------------------------------------------------------------------------
function generatePlannerScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1750" viewBox="0 0 412 1750" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="1750" fill="${t.bg}"/>

  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- Page Header -->
  <g id="Cap_Planner_Header" transform="translate(20, 114)">
    <rect width="120" height="24" rx="12" fill="${t.redPillBg}"/>
    <text x="60" y="16" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">🔀 ROUTE PLANNER</text>
    <text x="0" y="52" fill="${t.textMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Pandal Hopping Route</text>
    <text x="0" y="74" fill="${t.textMuted}" font-size="13">Plan your walking trail with smart nearest-neighbor routing.</text>

    <!-- Metrics Summary Card -->
    <g transform="translate(0, 96)">
      <rect width="372" height="74" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 18)">
        <text x="36" y="14" fill="${t.textMuted}" font-size="10" font-weight="700" text-anchor="middle">TOTAL STOPS</text>
        <text x="36" y="38" fill="${t.red}" font-size="18" font-weight="900" text-anchor="middle">4 Pandals</text>

        <line x1="94" y1="4" x2="94" y2="44" stroke="${t.cardBorder}" stroke-width="1"/>

        <text x="162" y="14" fill="${t.textMuted}" font-size="10" font-weight="700" text-anchor="middle">WALK DISTANCE</text>
        <text x="162" y="38" fill="${t.textMain}" font-size="18" font-weight="900" text-anchor="middle">3.8 km</text>

        <line x1="230" y1="4" x2="230" y2="44" stroke="${t.cardBorder}" stroke-width="1"/>

        <text x="286" y="14" fill="${t.textMuted}" font-size="10" font-weight="700" text-anchor="middle">EST. DURATION</text>
        <text x="286" y="38" fill="${t.textMain}" font-size="18" font-weight="900" text-anchor="middle">~3h 15m</text>
      </g>
    </g>

    <!-- Optimize Button -->
    <g transform="translate(0, 182)">
      <rect width="372" height="44" rx="14" fill="${t.red}"/>
      <text x="186" y="27" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">⚡ Optimize Hopping Sequence</text>
    </g>
  </g>

  <!-- Sequenced Stops -->
  <g id="Cap_Planner_Stops" transform="translate(20, 390)">
    ${renderPlannerStop(0, 1, 'Bagbazar Sarbojanin', 'Shyambazar Metro • Start Point', t)}
    ${renderPlannerStop(96, 2, 'Kumartuli Park', '400m walk from Stop 1', t)}
    ${renderPlannerStop(192, 3, 'Sovabazar Rajbari', '450m walk from Stop 2 • Heritage', t)}
    ${renderPlannerStop(288, 4, 'College Square', 'Central Metro • Evening Illumination', t)}

    <!-- Action Buttons -->
    <g transform="translate(0, 396)">
      <rect width="372" height="46" rx="14" fill="${t.red}"/>
      <text x="186" y="28" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">📍 Export Route to Google Maps</text>

      <g transform="translate(0, 56)">
        <rect width="372" height="46" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="186" y="28" fill="${t.textMain}" font-size="13" font-weight="700" text-anchor="middle">💬 Share Trail via WhatsApp</text>
      </g>
    </g>
  </g>

  <!-- Footer -->
  ${renderCapacitorFooter(1580, isDark)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('Planner', isDark, 1662)}
  ${renderAndroidGesturePill(1726, isDark)}
</svg>`;
}

function renderPlannerStop(y, idx, name, desc, t) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="372" height="84" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <circle cx="30" cy="42" r="14" fill="${t.red}"/>
    <text x="30" y="47" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">${idx}</text>
    <g transform="translate(58, 24)">
      <text x="0" y="16" fill="${t.textMain}" font-size="15" font-weight="800">${name}</text>
      <text x="0" y="36" fill="${t.textMuted}" font-size="11">${desc}</text>
    </g>
  </g>`;
}

// -----------------------------------------------------------------------------
// 6. Calendar Screen (412 x 1850)
// -----------------------------------------------------------------------------
function generateCalendarScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1850" viewBox="0 0 412 1850" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="1850" fill="${t.bg}"/>

  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- Page Header -->
  <g id="Cap_Cal_Header" transform="translate(20, 114)">
    <rect width="116" height="24" rx="12" fill="${t.redPillBg}"/>
    <text x="58" y="16" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">📅 PUJA ALMANAC</text>
    <text x="0" y="52" fill="${t.textMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Durga Puja 2026 Calendar</text>
    <text x="0" y="74" fill="${t.textMuted}" font-size="13">Exact Bengali 1433 tithi timings &amp; Sandhi Puja.</text>

    <!-- Sandhi Puja Card -->
    <g transform="translate(0, 96)">
      <rect width="372" height="220" rx="20" fill="${t.card}" stroke="${t.redPillBorder}" stroke-width="1.8"/>
      <g transform="translate(18, 18)">
        <rect width="115" height="22" rx="11" fill="${t.redPillBg}"/>
        <text x="57" y="15" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle" class="bengali">মহাসন্ধিক্ষণ ২০২৬</text>

        <rect x="124" width="135" height="22" rx="11" fill="${isDark ? '#422006' : '#fef3c7'}"/>
        <text x="191" y="15" fill="${t.amberStar}" font-size="10" font-weight="700" text-anchor="middle">108 Lotuses &amp; Lamps</text>

        <text x="0" y="58" fill="${t.textMain}" font-size="20" font-weight="900">Sandhi Puja Timings</text>
        <text x="0" y="78" fill="${t.textMuted}" font-size="12">48-minute sacred transit of Maha Ashtami to Navami.</text>

        <!-- Convention 1 -->
        <g transform="translate(0, 92)">
          <rect width="336" height="44" rx="12" fill="${t.card}" stroke="${t.red}" stroke-width="1.5"/>
          <text x="14" y="20" fill="${t.textMain}" font-size="12" font-weight="700" class="bengali">বিশুদ্ধ সিদ্ধান্ত (Bisuddha Siddhanta)</text>
          <text x="14" y="34" fill="${t.red}" font-size="11" font-weight="700">05:24 PM – 06:12 PM</text>
          <text x="320" y="26" fill="${t.red}" font-size="12" font-weight="800" text-anchor="end">✓</text>
        </g>

        <!-- Convention 2 -->
        <g transform="translate(0, 142)">
          <rect width="336" height="44" rx="12" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="14" y="20" fill="${t.textMain}" font-size="12" font-weight="600" class="bengali">সূর্যসিদ্ধান্ত (Surya Siddhanta / Gupta Press)</text>
          <text x="14" y="34" fill="${t.textMuted}" font-size="11">05:48 PM – 06:36 PM</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 5 Sacred Days -->
  <g id="Cap_Cal_Cards" transform="translate(20, 480)">
    ${renderCalendarDay(0, 'Maha Sasthi', 'মহা ষষ্ঠী', 'Oct 16, 2026', 'Bodhon, Amantran &amp; Adhivas', '06:45 PM – 08:30 PM', t)}
    ${renderCalendarDay(170, 'Maha Saptami', 'মহা সপ্তমী', 'Oct 17, 2026', 'Nabapatrika Pravesh', '06:12 AM – 08:40 AM', t)}
    ${renderCalendarDay(340, 'Maha Ashtami', 'মহা অষ্টমী', 'Oct 18, 2026', 'Sandhi Puja (108 Lamps &amp; Lotuses)', '05:24 PM – 06:12 PM', t)}
    ${renderCalendarDay(510, 'Maha Navami', 'মহা নবমী', 'Oct 19, 2026', 'Maha Aarti &amp; Dhunuchi Naach', '11:30 AM – 01:15 PM', t)}
    ${renderCalendarDay(680, 'Bijoya Dashami', 'বিজয়া দশমী', 'Oct 20, 2026', 'Sindoor Khela &amp; Immersion', '03:00 PM onwards', t)}
  </g>

  <!-- Footer -->
  ${renderCapacitorFooter(1680, isDark)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('More', isDark, 1762)}
  ${renderAndroidGesturePill(1826, isDark)}
</svg>`;
}

function renderCalendarDay(y, titleEn, titleBn, date, ritual, timings, t) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="372" height="154" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <g transform="translate(20, 18)">
      <rect width="110" height="24" rx="12" fill="${t.redPillBg}"/>
      <text x="55" y="16" fill="${t.redPillText}" font-size="11" font-weight="700" text-anchor="middle">${date}</text>
      <text x="0" y="52" fill="${t.textMain}" font-size="18" font-weight="900">${titleEn} • <tspan class="bengali" font-size="15">${titleBn}</tspan></text>
      <text x="0" y="78" fill="${t.textMuted}" font-size="13" font-weight="600">${ritual}</text>
      <text x="0" y="104" fill="${t.red}" font-size="12" font-weight="700">⏱️ ${timings}</text>
    </g>
  </g>`;
}

// -----------------------------------------------------------------------------
// 7. Metro Guide Screen (412 x 1650)
// -----------------------------------------------------------------------------
function generateMetroScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1650" viewBox="0 0 412 1650" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="1650" fill="${t.bg}"/>

  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- Page Header -->
  <g id="Cap_Metro_Header" transform="translate(20, 114)">
    <rect width="116" height="24" rx="12" fill="${t.redPillBg}"/>
    <text x="58" y="16" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">🚇 METRO GUIDE</text>
    <text x="0" y="52" fill="${t.textMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Kolkata Metro Network</text>
    <text x="0" y="74" fill="${t.textMuted}" font-size="13">Navigate Blue Line 1 &amp; Green Line 2 for pandal hopping.</text>

    <!-- Blue Line 1 Card -->
    <g transform="translate(0, 96)">
      <rect width="372" height="240" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <rect width="144" height="24" rx="12" fill="#2563eb" fill-opacity="0.15"/>
        <text x="12" y="16" fill="${t.blueLine}" font-size="11" font-weight="800">🔵 Blue Line 1 (North-South)</text>
        <text x="0" y="56" fill="${t.textMain}" font-size="18" font-weight="900">Dakshineswar ⇄ Kavi Subhash</text>
        <text x="0" y="78" fill="${t.textMuted}" font-size="12">Key pandal stops: Shyambazar, Sovabazar, Central, Kalighat.</text>

        <!-- Stations List -->
        <g transform="translate(0, 96)">
          <text x="0" y="14" fill="${t.textMain}" font-size="12" font-weight="700">Shyambazar:</text>
          <text x="90" y="14" fill="${t.textMuted}" font-size="12">Bagbazar, Shyambazar 5-Point</text>

          <text x="0" y="36" fill="${t.textMain}" font-size="12" font-weight="700">Sovabazar:</text>
          <text x="90" y="36" fill="${t.textMuted}" font-size="12">Sovabazar Rajbari, Kumartuli Park</text>

          <text x="0" y="58" fill="${t.textMain}" font-size="12" font-weight="700">Central / MG Rd:</text>
          <text x="100" y="58" fill="${t.textMuted}" font-size="12">College Square, Md. Ali Park</text>

          <text x="0" y="80" fill="${t.textMain}" font-size="12" font-weight="700">Kalighat:</text>
          <text x="90" y="80" fill="${t.textMuted}" font-size="12">Deshapriya Park, Singhi Park</text>
        </g>
      </g>
    </g>

    <!-- Green Line 2 Card -->
    <g transform="translate(0, 356)">
      <rect width="372" height="220" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <rect width="168" height="24" rx="12" fill="#16a34a" fill-opacity="0.15"/>
        <text x="12" y="16" fill="${t.greenLine}" font-size="11" font-weight="800">🟢 Green Line 2 (East-West)</text>
        <text x="0" y="56" fill="${t.textMain}" font-size="18" font-weight="900">Howrah Maidan ⇄ Salt Lake</text>
        <text x="0" y="78" fill="${t.textMuted}" font-size="12">Underwater Hooghly tunnel connecting Howrah &amp; Sealdah.</text>

        <!-- Stations List -->
        <g transform="translate(0, 96)">
          <text x="0" y="14" fill="${t.textMain}" font-size="12" font-weight="700">Howrah Stn:</text>
          <text x="90" y="14" fill="${t.textMuted}" font-size="12">Howrah Ramkrishnapur &amp; Riverfront</text>

          <text x="0" y="36" fill="${t.textMain}" font-size="12" font-weight="700">Esplanade:</text>
          <text x="90" y="36" fill="${t.textMuted}" font-size="12">Central Interchange (Lines 1 &amp; 2)</text>

          <text x="0" y="58" fill="${t.textMain}" font-size="12" font-weight="700">Karunamoyee:</text>
          <text x="100" y="58" fill="${t.textMuted}" font-size="12">Salt Lake FD, BJ &amp; AK Blocks</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Footer -->
  ${renderCapacitorFooter(1480, isDark)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('More', isDark, 1562)}
  ${renderAndroidGesturePill(1626, isDark)}
</svg>`;
}

// -----------------------------------------------------------------------------
// 8. Music Player Screen with Mini-Player (412 x 1850)
// -----------------------------------------------------------------------------
function generateMusicPlayerScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1850" viewBox="0 0 412 1850" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="1850" fill="${t.bg}"/>

  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- Page Header -->
  <g id="Cap_Music_Header" transform="translate(20, 114)">
    <rect width="186" height="26" rx="13" fill="${t.redPillBg}"/>
    <text x="93" y="17" fill="${t.redPillText}" font-size="11" font-weight="700" text-anchor="middle">🎵 SHARODIYA SOUNDSCAPE</text>
    <text x="0" y="62" fill="${t.textMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Festive Puja Music</text>
    <text x="0" y="86" fill="${t.textMuted}" font-size="13">Explore Bengal's rich Durga Puja sound culture.</text>

    <!-- Choose Your Puja Mood Card -->
    <g transform="translate(0, 106)">
      <rect width="372" height="144" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="16" y="28" fill="${t.textMain}" font-size="14" font-weight="800">✨ Choose Your Puja Mood</text>
      
      <g transform="translate(16, 42)">
        <rect width="84" height="30" rx="15" fill="${t.red}"/>
        <text x="42" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All Moods</text>

        <rect x="92" width="130" height="30" rx="15" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="157" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Ritual &amp; Devotion</text>

        <rect x="230" width="110" height="30" rx="15" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="285" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Dhak Beats</text>
      </g>

      <g transform="translate(16, 82)">
        <rect width="110" height="30" rx="15" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="55" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Pandal Hopping</text>

        <rect x="118" width="114" height="30" rx="15" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="175" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Bengali Festive</text>

        <rect x="240" width="100" height="30" rx="15" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="290" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Bisarjan</text>
      </g>
    </g>

    <!-- Search Input Bar -->
    <g transform="translate(0, 266)">
      <rect width="372" height="46" rx="12" fill="${t.inputBg}" stroke="${t.inputBorder}" stroke-width="1"/>
      <text x="16" y="28" font-size="15">🔍</text>
      <text x="42" y="28" fill="${t.textMuted}" font-size="12">Search tracks, artists, rhythms...</text>
    </g>
  </g>

  <!-- Curated Audio Library -->
  <g transform="translate(20, 450)">
    <text x="0" y="0" fill="${t.textMain}" font-size="16" font-weight="800">Curated Audio Library (22)</text>
    <text x="372" y="0" fill="${t.textFaint}" font-size="11" text-anchor="end">Verified Licences</text>

    <!-- Tracks List -->
    <g transform="translate(0, 16)">
      ${renderAudioTrack(0, 'Sharodiya Dhak Dhwoni &amp; Kashi', 'Mamta Jagdish Dhody • Traditional', '01:39', t)}
      ${renderAudioTrack(96, 'Sacred Shankha Naad (Aarti)', 'David Bolton • Dhak &amp; Shankha', '00:07', t)}
      ${renderAudioTrack(192, 'Dhunuchi Naach Dhak Taal', 'Traditional Bengali Dhaki Ensemble', '04:00', t)}
      ${renderAudioTrack(288, 'Bisarjan Dhak &amp; Asche Bochor', 'Babughat Immersion Procession', '01:39', t)}
    </g>
  </g>

  <!-- Footer -->
  ${renderCapacitorFooter(940, isDark)}

  <!-- Authentic Floating Mini-Player (Floats directly above bottom nav) -->
  ${renderCapacitorMiniplayer(1676, isDark)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('More', isDark, 1762)}
  ${renderAndroidGesturePill(1826, isDark)}
</svg>`;
}

function renderAudioTrack(y, title, artist, duration, t) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="372" height="84" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <g transform="translate(16, 16)">
      <circle cx="22" cy="24" r="18" fill="${t.redPillBg}"/>
      <path d="M18 17 L28 24 L18 31 Z" fill="${t.red}"/>
      <g transform="translate(52, 6)">
        <text x="0" y="15" fill="${t.textMain}" font-size="14" font-weight="800">${title}</text>
        <text x="0" y="34" fill="${t.textMuted}" font-size="11">${artist}</text>
      </g>
      <text x="340" y="22" fill="${t.red}" font-size="12" font-weight="700" text-anchor="end">${duration}</text>
      <text x="340" y="44" fill="${t.textFaint}" font-size="14" text-anchor="end">🔖</text>
    </g>
  </g>`;
}

// -----------------------------------------------------------------------------
// 9. Mahalaya Special Screen (412 x 1550)
// -----------------------------------------------------------------------------
function generateMahalayaScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1550" viewBox="0 0 412 1550" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="1550" fill="${t.bg}"/>

  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- Page Header -->
  <g id="Cap_Mahalaya_Header" transform="translate(20, 114)">
    <rect width="144" height="24" rx="12" fill="${t.redPillBg}"/>
    <text x="72" y="16" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">✨ MAHALAYA SPECIAL</text>
    <text x="0" y="52" fill="${t.textMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Mahishasuramardini</text>
    <text x="0" y="74" fill="${t.textMuted}" font-size="13">Birendra Krishna Bhadra's timeless 1931 dawn broadcast.</text>

    <!-- Broadcast Hero Card -->
    <g transform="translate(0, 96)">
      <rect width="372" height="260" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <rect width="130" height="22" rx="11" fill="#ea580c" fill-opacity="0.15"/>
        <text x="12" y="15" fill="#ea580c" font-size="10" font-weight="800">📻 All India Radio Classic</text>
        <text x="0" y="56" fill="${t.textMain}" font-size="18" font-weight="900">4:00 AM Dawn Broadcast</text>
        <text x="0" y="76" fill="${t.textMuted}" font-size="12">Recitation of Chandipath, Shlokas &amp; Classic Songs.</text>

        <!-- Player Audio Bar inside card -->
        <g transform="translate(0, 94)">
          <rect width="336" height="56" rx="14" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <circle cx="28" cy="28" r="18" fill="${t.red}"/>
          <path d="M24 21 L34 28 L24 35 Z" fill="#FFFFFF"/>
          <g transform="translate(56, 12)">
            <text x="0" y="14" fill="${t.textMain}" font-size="12" font-weight="800">Part 1: Chandi Path &amp; Agamani</text>
            <text x="0" y="28" fill="${t.textMuted}" font-size="10">00:00 / 45:12</text>
          </g>
        </g>

        <!-- Sanskrit Shloka -->
        <g transform="translate(0, 168)">
          <text x="0" y="16" fill="${t.red}" font-size="13" font-weight="700" class="bengali">
            আশ্বিনের শারদপ্রাতে বেজে উঠেছে আলোকপঞ্জরী...
          </text>
          <text x="0" y="34" fill="${t.textMuted}" font-size="11">The awakening of the Divine Mother on Mahalaya dawn.</text>
        </g>
      </g>
    </g>

    <!-- Historical Context Card -->
    <g transform="translate(0, 376)">
      <rect width="372" height="150" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="14" fill="${t.textMain}" font-size="15" font-weight="800">About the 1931 Recording</text>
        <text x="0" y="36" fill="${t.textMuted}" font-size="12">
          Originally composed by Raichand Boral, scripted by Bani Kumar, and voiced by the legendary Birendra Krishna Bhadra, this broadcast has been Bengal's official harbinger of Durga Puja for over nine decades.
        </text>
      </g>
    </g>
  </g>

  <!-- Footer -->
  ${renderCapacitorFooter(1380, isDark)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('More', isDark, 1462)}
  ${renderAndroidGesturePill(1526, isDark)}
</svg>`;
}

// -----------------------------------------------------------------------------
// 10. Meet the Developers Screen (412 x 1950)
// -----------------------------------------------------------------------------
function generateDeveloperScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1950" viewBox="0 0 412 1950" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="1950" fill="${t.bg}"/>

  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- Page Header -->
  <g id="Cap_Dev_Header" transform="translate(20, 114)">
    <rect width="168" height="24" rx="12" fill="${t.redPillBg}"/>
    <text x="84" y="16" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">👥 PROJECT CO-CREATORS</text>
    <text x="0" y="52" fill="${t.textMain}" font-size="28" font-weight="900" letter-spacing="-0.5">Meet the Developers</text>
    <text x="0" y="76" fill="${t.textMuted}" font-size="13">
      PujoPath is co-created by Soumik and Moumita to help discover Kolkata's pandals.
    </text>
  </g>

  <!-- Stacked Developer Cards -->
  <g id="Cap_Dev_Cards" transform="translate(20, 230)">
    
    <!-- CARD 1: MOUMITA -->
    <g id="Cap_Card_Moumita" transform="translate(0, 0)">
      <rect width="372" height="660" rx="22" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>

      <!-- Profile Header -->
      <g transform="translate(20, 20)">
        <g id="Cap_Moumita_Photo">
          <clipPath id="moumita_mob_clip_${isDark ? 'dark' : 'light'}"><rect width="84" height="84" rx="16"/></clipPath>
          <image href="${IMAGES.moumita}" width="84" height="84" clip-path="url(#moumita_mob_clip_${isDark ? 'dark' : 'light'})" preserveAspectRatio="xMidYMid slice"/>
          <rect width="84" height="84" rx="16" stroke="${t.red}" stroke-width="1.8" stroke-opacity="0.25" fill="none"/>
          <circle cx="76" cy="76" r="11" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="76" y="80" font-size="9" text-anchor="middle">📐</text>
        </g>

        <g transform="translate(100, 6)">
          <rect width="90" height="22" rx="11" fill="${t.redPillBg}"/>
          <text x="12" y="15" fill="${t.redPillText}" font-size="10" font-weight="700">✨ Co-Creator</text>
          <text x="0" y="46" fill="${t.textMain}" font-size="24" font-weight="900">Moumita</text>
          <text x="0" y="68" fill="${t.red}" font-size="13" font-weight="700">UI &amp; Frontend Lead</text>
        </g>
      </g>

      <!-- Narrative -->
      <g transform="translate(20, 122)">
        <text x="0" y="0" fill="${t.textMuted}" font-size="12">
          <tspan x="0" dy="16">Directs user interface design, frontend architecture,</tspan>
          <tspan x="0" dy="18">responsive layouts, user experience, visual consistency,</tspan>
          <tspan x="0" dy="18">and interaction design, alongside research and curation</tspan>
          <tspan x="0" dy="18">of Kolkata's historic Bonedi Bari traditions.</tspan>
        </text>
      </g>

      <!-- Key Responsibilities Chips -->
      <g transform="translate(20, 220)">
        <text x="0" y="0" fill="${t.textFaint}" font-size="10" font-weight="800" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
        <g transform="translate(0, 10)">
          ${renderChip(0, 0, 'User Interface Design', t)}
          ${renderChip(150, 0, 'Frontend Architecture', t)}
          ${renderChip(0, 36, 'Responsive Layouts', t)}
          ${renderChip(145, 36, 'User Experience (UX)', t)}
          ${renderChip(0, 72, 'Visual Consistency', t)}
          ${renderChip(140, 72, 'Cultural Curation', t)}
          ${renderChip(0, 108, 'Frontend Interaction Design', t)}
        </g>
      </g>

      <!-- LinkedIn Action Button -->
      <g transform="translate(20, 598)">
        <line x1="0" y1="0" x2="332" y2="0" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="0" y="30" fill="${t.textFaint}" font-size="12">Professional Profile</text>
        <g transform="translate(226, 12)">
          <rect width="106" height="34" rx="10" fill="${t.blueBtn}"/>
          <text x="14" y="22" font-size="13">in</text>
          <text x="34" y="22" fill="#FFFFFF" font-size="12" font-weight="700">LinkedIn</text>
          <text x="90" y="22" fill="#FFFFFF" font-size="11">↗</text>
        </g>
      </g>
    </g>

    <!-- CARD 2: SOUMIK -->
    <g id="Cap_Card_Soumik" transform="translate(0, 684)">
      <rect width="372" height="660" rx="22" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>

      <!-- Profile Header -->
      <g transform="translate(20, 20)">
        <g id="Cap_Soumik_Photo">
          <clipPath id="soumik_mob_clip_${isDark ? 'dark' : 'light'}"><rect width="84" height="84" rx="16"/></clipPath>
          <image href="${IMAGES.soumik}" width="84" height="84" clip-path="url(#soumik_mob_clip_${isDark ? 'dark' : 'light'})" preserveAspectRatio="xMidYMid slice"/>
          <rect width="84" height="84" rx="16" stroke="${t.red}" stroke-width="1.8" stroke-opacity="0.25" fill="none"/>
          <circle cx="76" cy="76" r="11" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="76" y="80" font-size="9" font-weight="800" text-anchor="middle">&lt;/&gt;</text>
        </g>

        <g transform="translate(100, 6)">
          <rect width="90" height="22" rx="11" fill="${t.redPillBg}"/>
          <text x="12" y="15" fill="${t.redPillText}" font-size="10" font-weight="700">✨ Co-Creator</text>
          <text x="0" y="46" fill="${t.textMain}" font-size="24" font-weight="900">Soumik</text>
          <text x="0" y="68" fill="${t.red}" font-size="13" font-weight="700">Backend &amp; Systems Lead</text>
        </g>
      </g>

      <!-- Narrative -->
      <g transform="translate(20, 122)">
        <text x="0" y="0" fill="${t.textMuted}" font-size="12">
          <tspan x="0" dy="16">Directs backend &amp; systems architecture, core application</tspan>
          <tspan x="0" dy="18">logic, route optimization algorithms, offline-first transit</tspan>
          <tspan x="0" dy="18">functionality, backend integrations, and performance.</tspan>
        </text>
      </g>

      <!-- Key Responsibilities Chips -->
      <g transform="translate(20, 220)">
        <text x="0" y="0" fill="${t.textFaint}" font-size="10" font-weight="800" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
        <g transform="translate(0, 10)">
          ${renderChip(0, 0, 'Backend Architecture', t)}
          ${renderChip(150, 0, 'Core Application Logic', t)}
          ${renderChip(0, 36, 'System Architecture', t)}
          ${renderChip(145, 36, 'Route Optimization', t)}
          ${renderChip(0, 72, 'Offline-First Transit', t)}
          ${renderChip(140, 72, 'Backend Integrations', t)}
          ${renderChip(0, 108, 'Performance &amp; Scale', t)}
        </g>
      </g>

      <!-- LinkedIn Action Button -->
      <g transform="translate(20, 598)">
        <line x1="0" y1="0" x2="332" y2="0" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="0" y="30" fill="${t.textFaint}" font-size="12">Professional Profile</text>
        <g transform="translate(226, 12)">
          <rect width="106" height="34" rx="10" fill="${t.blueBtn}"/>
          <text x="14" y="22" font-size="13">in</text>
          <text x="34" y="22" fill="#FFFFFF" font-size="12" font-weight="700">LinkedIn</text>
          <text x="90" y="22" fill="#FFFFFF" font-size="11">↗</text>
        </g>
      </g>
    </g>

    <!-- CARD 3: FEEDBACK & SUGGESTIONS -->
    <g id="Cap_Card_Feedback" transform="translate(0, 1368)">
      <rect width="372" height="150" rx="22" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <text x="0" y="14" fill="${t.blueBtn}" font-size="10" font-weight="800" letter-spacing="0.5">💭 FEEDBACK &amp; SUGGESTIONS</text>
        <text x="0" y="38" fill="${t.textMain}" font-size="16" font-weight="800">Have feedback for the team?</text>
        <text x="0" y="58" fill="${t.textMuted}" font-size="11">Share ideas, report bugs, or request features directly.</text>
        
        <g transform="translate(0, 74)">
          <rect width="332" height="38" rx="12" fill="${t.blueBtn}"/>
          <text x="166" y="24" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">💬 Share Feedback</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Footer -->
  ${renderCapacitorFooter(1780, isDark)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('More', isDark, 1862)}
  ${renderAndroidGesturePill(1926, isDark)}
</svg>`;
}

function renderChip(x, y, label, t) {
  const width = label.length * 6.5 + 22;
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="${width}" height="28" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="${width / 2}" y="18" fill="${t.textMuted}" font-size="10" font-weight="600" text-anchor="middle">${label}</text>
  </g>`;
}

// -----------------------------------------------------------------------------
// 11. Help & Information Screen (412 x 1550)
// -----------------------------------------------------------------------------
function generateAboutScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1550" viewBox="0 0 412 1550" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="1550" fill="${t.bg}"/>

  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- Page Header -->
  <g id="Cap_About_Header" transform="translate(20, 114)">
    <rect width="134" height="24" rx="12" fill="${t.redPillBg}"/>
    <text x="67" y="16" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">ℹ️ HELP &amp; ABOUT</text>
    <text x="0" y="52" fill="${t.textMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Emergency &amp; Info</text>
    <text x="0" y="74" fill="${t.textMuted}" font-size="13">Official helplines and safety guidance for pandal hoppers.</text>

    <!-- Emergency Helplines Card -->
    <g transform="translate(0, 96)">
      <rect width="372" height="240" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="14" fill="${t.red}" font-size="15" font-weight="800">🚨 Emergency Helplines</text>
        
        <g transform="translate(0, 36)">
          ${renderHelplineItem(0, 'Kolkata Police Control Room', '100 / 033-2214-3230', t)}
          ${renderHelplineItem(44, 'Medical &amp; Ambulance Service', '102 / 108', t)}
          ${renderHelplineItem(88, 'Fire &amp; Emergency Response', '101', t)}
          ${renderHelplineItem(132, 'Women Safety &amp; Helplines', '1090 / 1091', t)}
        </g>
      </g>
    </g>

    <!-- Festival Visitor Guidelines Card -->
    <g transform="translate(0, 356)">
      <rect width="372" height="220" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="14" fill="${t.textMain}" font-size="15" font-weight="800">Pandal Hopping Guidelines</text>
        <text x="0" y="38" fill="${t.textMuted}" font-size="12">
          • Keep elderly and children close in crowded zones.
        </text>
        <text x="0" y="58" fill="${t.textMuted}" font-size="12">
          • Use Kolkata Metro Blue &amp; Green lines for quickest transit.
        </text>
        <text x="0" y="78" fill="${t.textMuted}" font-size="12">
          • Follow designated entry/exit barricades at all major pandals.
        </text>
        <text x="0" y="98" fill="${t.textMuted}" font-size="12">
          • Save offline trails in PujoPath before heading out.
        </text>
      </g>
    </g>
  </g>

  <!-- Footer -->
  ${renderCapacitorFooter(1380, isDark)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('More', isDark, 1462)}
  ${renderAndroidGesturePill(1526, isDark)}
</svg>`;
}

function renderHelplineItem(y, title, num, t) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="336" height="36" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="12" y="22" fill="${t.textMain}" font-size="11" font-weight="700">${title}</text>
    <text x="324" y="22" fill="${t.red}" font-size="11" font-weight="800" text-anchor="end">${num}</text>
  </g>`;
}

// -----------------------------------------------------------------------------
// 12. Feedback Screen (412 x 1350)
// -----------------------------------------------------------------------------
function generateFeedbackScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1350" viewBox="0 0 412 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="1350" fill="${t.bg}"/>

  ${renderAndroidStatusBar(isDark)}
  ${renderCapacitorHeader(isDark)}

  <!-- Page Header -->
  <g id="Cap_Feedback_Header" transform="translate(20, 114)">
    <rect width="116" height="24" rx="12" fill="${t.redPillBg}"/>
    <text x="58" y="16" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">💬 FEEDBACK</text>
    <text x="0" y="52" fill="${t.textMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Share Your Thoughts</text>
    <text x="0" y="74" fill="${t.textMuted}" font-size="13">Help us improve PujoPath for everyone.</text>

    <!-- Feedback Form Card -->
    <g transform="translate(0, 96)">
      <rect width="372" height="340" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="14" fill="${t.textMain}" font-size="14" font-weight="700">What is your feedback about?</text>
        
        <!-- Category Pills -->
        <g transform="translate(0, 26)">
          <rect width="84" height="28" rx="14" fill="${t.red}"/>
          <text x="42" y="18" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">General</text>

          <rect x="92" width="94" height="28" rx="14" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="139" y="18" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Pandal Info</text>

          <rect x="194" width="76" height="28" rx="14" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="232" y="18" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Bug Fix</text>
        </g>

        <!-- Rating Stars -->
        <g transform="translate(0, 76)">
          <text x="0" y="14" fill="${t.textMain}" font-size="14" font-weight="700">Rate your experience</text>
          <text x="0" y="38" fill="${t.amberStar}" font-size="20">★★★★★</text>
        </g>

        <!-- Input Textarea -->
        <g transform="translate(0, 136)">
          <rect width="336" height="88" rx="12" fill="${t.inputBg}" stroke="${t.inputBorder}" stroke-width="1"/>
          <text x="14" y="24" fill="${t.textMuted}" font-size="12">Type your feedback, feature ideas, or bug report here...</text>
        </g>

        <!-- Submit Button -->
        <g transform="translate(0, 240)">
          <rect width="336" height="42" rx="12" fill="${t.red}"/>
          <text x="168" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Submit Feedback →</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Footer -->
  ${renderCapacitorFooter(1180, isDark)}

  <!-- Fixed Bottom Navigation + Gesture Pill -->
  ${renderCapacitorBottomNav('More', isDark, 1262)}
  ${renderAndroidGesturePill(1326, isDark)}
</svg>`;
}

// -----------------------------------------------------------------------------
// 13. More Drawer Sheet Overlay (412 x 915)
// -----------------------------------------------------------------------------
function generateMoreDrawerScreen(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <!-- Dimmed Background Overlay Scrim -->
  <rect width="412" height="915" fill="#000000" fill-opacity="0.55"/>

  <!-- Android System Status Bar (White icons on dark scrim) -->
  ${renderAndroidStatusBar(isDark, true)}

  <!-- Slide-up Bottom Sheet Modal -->
  <g id="More_Drawer_Modal" transform="translate(0, 195)">
    <!-- Sheet Container -->
    <rect width="412" height="720" rx="28" fill="${t.card}"/>

    <!-- Top Grab Handle -->
    <rect x="186" y="12" width="40" height="4" rx="2" fill="${isDark ? '#473d35' : '#c7bcb1'}"/>

    <!-- Drawer Header -->
    <g transform="translate(24, 38)">
      <text x="0" y="20" fill="${t.textMain}" font-size="20" font-weight="900">More Features &amp; Services</text>
      <text x="0" y="38" fill="${t.textMuted}" font-size="12">Explore specialized tools and cultural information</text>
      
      <!-- Close (X) Button -->
      <circle cx="340" cy="18" r="16" fill="${t.cardInner}"/>
      <text x="340" y="23" fill="${t.textMuted}" font-size="14" text-anchor="middle">✕</text>
    </g>

    <line x1="0" y1="94" x2="412" y2="94" stroke="${t.cardBorder}" stroke-width="1"/>

    <!-- 8 Menu Items Grid -->
    <g id="Drawer_Menu_Items" transform="translate(24, 110)">
      ${renderDrawerItem(0, 0, '📅', 'Calendar', 'Auspicious tithis and Sandhi Puja', '#ea580c', t)}
      ${renderDrawerItem(0, 56, '🚇', 'Metro Guide', 'Station connections &amp; schedules', '#2563eb', t)}
      ${renderDrawerItem(0, 112, '🎵', 'Puja Music', 'Traditional Chandi Path &amp; Dhak beats', '#7c3aed', t)}
      ${renderDrawerItem(0, 168, '✨', 'Mahalaya Special', 'Birendra Krishna Bhadra classic broadcast', '#d97706', t)}
      ${renderDrawerItem(0, 224, 'ℹ️', 'Help &amp; Information', 'Emergency helplines and guides', '#0d9488', t)}
      ${renderDrawerItem(0, 280, '💬', 'Feedback &amp; Suggestions', 'Share ideas and report bugs', '#4b5563', t)}
      ${renderDrawerItem(0, 336, '👥', 'Meet the Developers', 'Soumik &amp; Moumita co-creators', '#b42323', t)}
      ${renderDrawerItem(0, 392, '❤️', 'Saved Pandals', 'Personal festival bookmarks', '#e02424', t)}
    </g>

    <!-- Share Feedback Action -->
    <g transform="translate(24, 570)">
      <rect width="364" height="46" rx="14" fill="${t.cardInner}" stroke="${t.blueBtn}" stroke-opacity="0.3" stroke-width="1"/>
      <text x="182" y="28" fill="${t.blueBtn}" font-size="13" font-weight="700" text-anchor="middle">💬 Share Feedback</text>
    </g>

    <!-- Bottom Nav + Gesture Pill inside sheet view -->
    ${renderCapacitorBottomNav('More', isDark, 632)}
    ${renderAndroidGesturePill(696, isDark)}
  </g>
</svg>`;
}

function renderDrawerItem(x, y, icon, title, desc, color, t) {
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="364" height="48" rx="14" fill="${t.cardInner}" fill-opacity="0.6"/>
    <circle cx="24" cy="24" r="14" fill="${color}" fill-opacity="0.12"/>
    <text x="24" y="29" font-size="14" text-anchor="middle">${icon}</text>
    <text x="50" y="21" fill="${t.textMain}" font-size="13" font-weight="700">${title}</text>
    <text x="50" y="36" fill="${t.textMuted}" font-size="10">${desc}</text>
    <text x="346" y="28" fill="${t.textMuted}" font-size="14">›</text>
  </g>`;
}

// -----------------------------------------------------------------------------
// Generation Execution
// -----------------------------------------------------------------------------
const SCREENS = [
  { name: '01_capacitor_android_splash', gen: generateSplashScreen },
  { name: '02_capacitor_android_home', gen: generateHomeScreen },
  { name: '03_capacitor_android_explore', gen: generateExploreScreen },
  { name: '04_capacitor_android_map', gen: generateMapScreen },
  { name: '05_capacitor_android_planner', gen: generatePlannerScreen },
  { name: '06_capacitor_android_calendar', gen: generateCalendarScreen },
  { name: '07_capacitor_android_metro', gen: generateMetroScreen },
  { name: '08_capacitor_android_music_player', gen: generateMusicPlayerScreen },
  { name: '09_capacitor_android_mahalaya', gen: generateMahalayaScreen },
  { name: '10_capacitor_android_developer', gen: generateDeveloperScreen },
  { name: '11_capacitor_android_about', gen: generateAboutScreen },
  { name: '12_capacitor_android_feedback', gen: generateFeedbackScreen },
  { name: '13_capacitor_android_more_drawer', gen: generateMoreDrawerScreen },
];

console.log('Generating all 26 Capacitor Android screens (13 Light + 13 Dark)...');
let count = 0;

for (const s of SCREENS) {
  // Light Mode
  const lightSvg = s.gen(false);
  const lightPath = path.join(OUT_DIR, `${s.name}_light.svg`);
  fs.writeFileSync(lightPath, lightSvg, 'utf8');
  count++;

  // Dark Mode
  const darkSvg = s.gen(true);
  const darkPath = path.join(OUT_DIR, `${s.name}_dark.svg`);
  fs.writeFileSync(darkPath, darkSvg, 'utf8');
  count++;
}

console.log(`Generated all ${count} Capacitor SVGs successfully in: ${OUT_DIR}`);

module.exports = {
  SCREENS
};
