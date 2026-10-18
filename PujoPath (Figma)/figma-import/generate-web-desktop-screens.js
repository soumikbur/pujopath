const fs = require('fs');
const path = require('path');
const {
  EXPORTS_DIR,
  IMAGES,
  RED, RED_HOVER, RED_SOFT, RED_BORDER, BG_CREAM, BG_WHITE, BG_SURFACE,
  TEXT_MAIN, TEXT_DARK, TEXT_SEC, TEXT_MUTED, TEXT_FAINT, BORDER, BORDER_LIGHT, LINKEDIN_BLUE, GOLD,
  SVG_DEFS,
  renderDesktopHeader,
  renderDesktopFooter,
} = require('./authentic-components');

const DESKTOP_DIR = path.join(EXPORTS_DIR, 'web-desktop');
if (!fs.existsSync(DESKTOP_DIR)) fs.mkdirSync(DESKTOP_DIR, { recursive: true });

// -------------------------------------------------------------------------
// 1. Desktop Home Screen (1440 x 1400)
// -------------------------------------------------------------------------
function generateDesktopHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1400" viewBox="0 0 1440 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <!-- Base Background -->
  <rect width="1440" height="1400" fill="${BG_CREAM}"/>

  <!-- Background Festival Artwork (Ghibli Durga Idol Landscape) -->
  <g id="Background_Artwork" opacity="0.22">
    <image href="${IMAGES.ghibliBg}" width="1440" height="700" preserveAspectRatio="xMidYMid slice"/>
    <rect width="1440" height="700" fill="url(#bg-gradient)"/>
  </g>
  <defs>
    <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="700" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${BG_CREAM}" stop-opacity="0.3"/>
      <stop offset="80%" stop-color="${BG_CREAM}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${BG_CREAM}" stop-opacity="1.0"/>
    </linearGradient>
  </defs>

  <!-- Sticky Header -->
  ${renderDesktopHeader('Home')}

  <!-- 1. Hero Section (max-w-6xl = 1200px centered: x=120) -->
  <g id="Hero_Section" transform="translate(120, 96)">
    <rect width="1200" height="300" rx="24" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
    
    <g transform="translate(48, 40)">
      <!-- Real Countdown Pill -->
      <g id="Countdown_Pill">
        <rect width="170" height="30" rx="15" fill="${RED_SOFT}" stroke="${RED_BORDER}" stroke-width="1"/>
        <text x="14" y="20" font-size="14">🗓️</text>
        <text x="36" y="20" fill="${RED}" font-size="12" font-weight="700">180 days to Puja</text>
      </g>

      <!-- Headline -->
      <text x="0" y="86" fill="${TEXT_MAIN}" font-size="44" font-weight="900" letter-spacing="-1">Your Puja, made simple.</text>
      
      <!-- Subtitle -->
      <text x="0" y="124" fill="${TEXT_SEC}" font-size="17" font-weight="500">Find the pandals you love, build a route, and head out with confidence.</text>

      <!-- Action Buttons Row -->
      <g id="Hero_Actions" transform="translate(0, 160)">
        <!-- Find Pandals Primary Button -->
        <g id="Find_Pandals_Btn">
          <rect width="168" height="48" rx="14" fill="${RED}"/>
          <path d="M22 24 A6 6 0 1 1 22 12 A6 6 0 0 1 22 24 M27 27 L23 23" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
          <text x="82" y="30" fill="#FFFFFF" font-size="15" font-weight="700" text-anchor="middle">Find pandals</text>
          <path d="M136 24 L144 24 M140 20 L144 24 L140 28" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        </g>

        <!-- Build a Route Secondary Button -->
        <g id="Build_Route_Btn" transform="translate(184, 0)">
          <rect width="168" height="48" rx="14" fill="${BG_WHITE}" stroke="#d2c7bc" stroke-width="1"/>
          <!-- Navigation Arrow -->
          <path d="M24 16 L34 24 L24 32 L27 24 Z" fill="${RED}"/>
          <text x="92" y="30" fill="${TEXT_MAIN}" font-size="15" font-weight="700" text-anchor="middle">Build a route</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 2. Quick Access Key Shortcuts (6 cards in grid) -->
  <g id="Quick_Access_Section" transform="translate(120, 420)">
    <text x="0" y="0" fill="${TEXT_MAIN}" font-size="18" font-weight="800" letter-spacing="-0.3">Quick Access</text>

    <g id="Quick_Access_Grid" transform="translate(0, 16)">
      <!-- Card 1: Map -->
      <g id="QA_Map" transform="translate(0, 0)">
        <rect width="186" height="110" rx="16" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="#b42323" fill-opacity="0.12"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">📍</text>
        <text x="16" y="78" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Map</text>
        <text x="16" y="96" fill="${TEXT_MUTED}" font-size="11">See all pandals</text>
      </g>

      <!-- Card 2: Route Planner -->
      <g id="QA_Planner" transform="translate(202, 0)">
        <rect width="186" height="110" rx="16" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="#0d9488" fill-opacity="0.12"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">🔀</text>
        <text x="16" y="78" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Route Planner</text>
        <text x="16" y="96" fill="${TEXT_MUTED}" font-size="11">Optimize your trail</text>
      </g>

      <!-- Card 3: Metro Guide -->
      <g id="QA_Metro" transform="translate(404, 0)">
        <rect width="186" height="110" rx="16" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="#2563eb" fill-opacity="0.12"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">🚇</text>
        <text x="16" y="78" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Metro Guide</text>
        <text x="16" y="96" fill="${TEXT_MUTED}" font-size="11">Find nearest stations</text>
      </g>

      <!-- Card 4: Calendar -->
      <g id="QA_Calendar" transform="translate(606, 0)">
        <rect width="186" height="110" rx="16" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="#ea580c" fill-opacity="0.12"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">📅</text>
        <text x="16" y="78" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Calendar</text>
        <text x="16" y="96" fill="${TEXT_MUTED}" font-size="11">Auspicious tithis</text>
      </g>

      <!-- Card 5: Puja Music -->
      <g id="QA_Music" transform="translate(808, 0)">
        <rect width="186" height="110" rx="16" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="#7c3aed" fill-opacity="0.12"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">🎵</text>
        <text x="16" y="78" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Puja Music</text>
        <text x="16" y="96" fill="${TEXT_MUTED}" font-size="11">Chandi Path &amp; Dhak</text>
      </g>

      <!-- Card 6: Mahalaya -->
      <g id="QA_Mahalaya" transform="translate(1010, 0)">
        <rect width="190" height="110" rx="16" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="#d97706" fill-opacity="0.12"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">✨</text>
        <text x="16" y="78" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Mahalaya</text>
        <text x="16" y="96" fill="${TEXT_MUTED}" font-size="11">Timeless dawn broadcast</text>
      </g>
    </g>
  </g>

  <!-- 3. Curated Puja Highlights (3 cards with authentic pandal photos) -->
  <g id="Puja_Highlights_Section" transform="translate(120, 580)">
    <g transform="translate(0, 0)">
      <text x="0" y="0" fill="${RED}" font-size="18" font-weight="900">✣</text>
      <text x="22" y="0" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Puja Highlights</text>
      <text x="0" y="22" fill="${TEXT_MUTED}" font-size="13">A glimpse of Bengal's Durga Puja culture</text>
      <text x="1200" y="0" fill="${RED}" font-size="13" font-weight="700" text-anchor="end">View all →</text>
    </g>

    <g id="Highlights_Grid" transform="translate(0, 36)">
      <!-- Card 1: Sovabazar Rajbari -->
      <g id="Highlight_Card_1" transform="translate(0, 0)">
        <rect width="386" height="104" rx="18" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
        <!-- Photo -->
        <g transform="translate(12, 12)">
          <image href="${IMAGES.sovabazar}" width="110" height="80" clip-path="url(#highlight-1-clip)" preserveAspectRatio="xMidYMid slice"/>
          <rect width="78" height="18" rx="4" fill="#000000" fill-opacity="0.6"/>
          <text x="39" y="13" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">Traditions &amp; Art</text>
        </g>
        <g transform="translate(134, 24)">
          <text x="0" y="14" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Traditions &amp; Pandal Art</text>
          <text x="0" y="34" fill="${TEXT_MUTED}" font-size="11">Discover Bengal's timeless heritage</text>
          <text x="0" y="48" fill="${TEXT_MUTED}" font-size="11">celebrations and creative installations.</text>
        </g>
      </g>

      <!-- Card 2: Bagbazar Sarbojanin -->
      <g id="Highlight_Card_2" transform="translate(406, 0)">
        <rect width="386" height="104" rx="18" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
        <!-- Photo -->
        <g transform="translate(12, 12)">
          <image href="${IMAGES.bagbazar}" width="110" height="80" clip-path="url(#highlight-2-clip)" preserveAspectRatio="xMidYMid slice"/>
          <rect width="52" height="18" rx="4" fill="#000000" fill-opacity="0.6"/>
          <text x="26" y="13" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">Almanac</text>
        </g>
        <g transform="translate(134, 24)">
          <text x="0" y="14" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Sacred Almanac &amp; Timings</text>
          <text x="0" y="34" fill="${TEXT_MUTED}" font-size="11">Accurate Ashtami Sandhi Puja,</text>
          <text x="0" y="48" fill="${TEXT_MUTED}" font-size="11">Pushpanjali, and tithi timings.</text>
        </g>
      </g>

      <!-- Card 3: College Square -->
      <g id="Highlight_Card_3" transform="translate(812, 0)">
        <rect width="388" height="104" rx="18" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
        <!-- Photo -->
        <g transform="translate(12, 12)">
          <image href="${IMAGES.collegeSquare}" width="110" height="80" clip-path="url(#highlight-3-clip)" preserveAspectRatio="xMidYMid slice"/>
          <rect width="46" height="18" rx="4" fill="#000000" fill-opacity="0.6"/>
          <text x="23" y="13" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">Routes</text>
        </g>
        <g transform="translate(134, 24)">
          <text x="0" y="14" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Pujo Evenings &amp; Routes</text>
          <text x="0" y="34" fill="${TEXT_MUTED}" font-size="11">Plan your route for the best evening</text>
          <text x="0" y="48" fill="${TEXT_MUTED}" font-size="11">hopping and illumination.</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 4. Interactive Feature Highlights Footer (6 Pills) -->
  <g id="Feature_Pills_Section" transform="translate(120, 755)">
    <g id="Feature_Pills_Grid">
      ${renderFeaturePill(0, '✨', 'Ultra Simple', 'Only what you need')}
      ${renderFeaturePill(202, '⚡', 'Lightning Fast', 'Smooth experience')}
      ${renderFeaturePill(404, '📱', 'Fully Responsive', 'All devices')}
      ${renderFeaturePill(606, '🌙', 'Dark Mode', 'Click to toggle')}
      ${renderFeaturePill(808, '🌐', 'Bengali &amp; English', 'Click to toggle')}
      ${renderFeaturePill(1010, '❤️', 'Saved Trails', 'Saved favorites')}
    </g>
  </g>

  <!-- Authoritative Footer with pause rotation control -->
  ${renderDesktopFooter(900, true)}
</svg>`;
}

function renderFeaturePill(x, icon, title, desc) {
  return `
  <g transform="translate(${x}, 0)">
    <rect width="186" height="52" rx="14" fill="${BG_WHITE}" fill-opacity="0.8" stroke="#eadcce" stroke-width="1"/>
    <rect x="8" y="10" width="32" height="32" rx="8" fill="#d52f2f" fill-opacity="0.1"/>
    <text x="24" y="31" font-size="15" text-anchor="middle">${icon}</text>
    <text x="48" y="24" fill="${TEXT_DARK}" font-size="12" font-weight="700">${title}</text>
    <text x="48" y="38" fill="${TEXT_MUTED}" font-size="10" font-weight="500">${desc}</text>
  </g>`;
}

// -------------------------------------------------------------------------
// 2. Desktop Developer Screen (1440 x 1350)
// -------------------------------------------------------------------------
function generateDesktopDeveloper() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1350" viewBox="0 0 1440 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="1440" height="1350" fill="${BG_CREAM}"/>
  ${renderDesktopHeader('More')}

  <!-- Main Developer Content (max-w-4xl = 1000px centered: x=220) -->
  <g id="Developer_Page_Content" transform="translate(220, 96)">
    <!-- Header Section -->
    <g id="Dev_Header">
      <g id="CoCreator_Badge">
        <text x="0" y="14" fill="${RED}" font-size="12" font-weight="800" letter-spacing="1">👥 PROJECT CO-CREATORS</text>
      </g>
      <text x="0" y="56" fill="${TEXT_DARK}" font-size="38" font-weight="900" letter-spacing="-0.5">Meet the Developers</text>
      <text x="0" y="86" fill="${TEXT_SEC}" font-size="15" font-weight="400">
        PujoPath is a collaborative project co-created by Soumik and Moumita to help people discover Kolkata's Durga Puja pandals and plan their festive experiences.
      </text>
    </g>

    <!-- DEVELOPER CARDS GRID: 2 COLUMNS (Moumita on Left, Soumik on Right) -->
    <g id="Developer_Cards_Grid" transform="translate(0, 126)">
      
      <!-- ======================================================== -->
      <!-- CARD 1: MOUMITA — UI & FRONTEND LEAD (LEFT)             -->
      <!-- ======================================================== -->
      <g id="Card_Moumita" transform="translate(0, 0)">
        <rect width="485" height="660" rx="24" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

        <!-- Top Profile Row: Real Photo + Badge + Name + Title -->
        <g transform="translate(32, 32)">
          <!-- Authentic Photographic Portrait (moumita.jpg) -->
          <g id="Moumita_Photo_Container">
            <image href="${IMAGES.moumita}" width="96" height="96" clip-path="url(#moumita-clip)" preserveAspectRatio="xMidYMid slice"/>
            <rect width="96" height="96" rx="16" stroke="${RED}" stroke-width="2" stroke-opacity="0.25" fill="none"/>
            <!-- Layout Badge on Avatar -->
            <circle cx="86" cy="86" r="13" fill="#faf7f2" stroke="${BORDER}" stroke-width="1"/>
            <text x="86" y="90" font-size="11" text-anchor="middle">📐</text>
          </g>

          <g transform="translate(116, 6)">
            <!-- Co-Creator Pill -->
            <rect width="96" height="22" rx="11" fill="${RED_SOFT}"/>
            <text x="12" y="15" fill="${RED}" font-size="11" font-weight="700">✨ Co-Creator</text>
            <!-- Name -->
            <text x="0" y="48" fill="${TEXT_DARK}" font-size="24" font-weight="900">Moumita</text>
            <!-- Role -->
            <text x="0" y="70" fill="${RED}" font-size="14" font-weight="700">UI &amp; Frontend Lead</text>
          </g>
        </g>

        <!-- Narrative Description -->
        <g transform="translate(32, 156)">
          <text x="0" y="0" fill="${TEXT_SEC}" font-size="13" line-height="22">
            <tspan x="0" dy="18">Directs user interface design, frontend architecture, responsive layouts, user experience,</tspan>
            <tspan x="0" dy="20">visual consistency, and interaction design, alongside research and curation of Kolkata's</tspan>
            <tspan x="0" dy="20">historic Bonedi Bari traditions and cultural festival narratives.</tspan>
          </text>
        </g>

        <!-- Key Responsibilities Chips -->
        <g transform="translate(32, 250)">
          <text x="0" y="0" fill="#8a7f76" font-size="11" font-weight="800" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
          <g transform="translate(0, 12)">
            ${renderResponsibilityChip(0, 0, 'User Interface Design')}
            ${renderResponsibilityChip(145, 0, 'Frontend Architecture')}
            ${renderResponsibilityChip(0, 36, 'Responsive Layouts')}
            ${renderResponsibilityChip(140, 36, 'User Experience (UX)')}
            ${renderResponsibilityChip(0, 72, 'Visual Consistency')}
            ${renderResponsibilityChip(135, 72, 'Cultural Curation')}
            ${renderResponsibilityChip(0, 108, 'Frontend Interaction Design')}
          </g>
        </g>

        <!-- Professional Profile / LinkedIn Action -->
        <g id="Moumita_LinkedIn_Row" transform="translate(32, 590)">
          <line x1="0" y1="0" x2="421" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="0" y="32" fill="#8a7f76" font-size="12">Professional Profile</text>
          <!-- LinkedIn Blue Button -->
          <g transform="translate(315, 12)">
            <rect width="106" height="34" rx="10" fill="${LINKEDIN_BLUE}"/>
            <text x="14" y="22" font-size="14">in</text>
            <text x="36" y="22" fill="#FFFFFF" font-size="13" font-weight="700">LinkedIn</text>
            <text x="90" y="22" fill="#FFFFFF" font-size="12">↗</text>
          </g>
        </g>
      </g>

      <!-- ======================================================== -->
      <!-- CARD 2: SOUMIK — BACKEND & SYSTEMS LEAD (RIGHT)         -->
      <!-- ======================================================== -->
      <g id="Card_Soumik" transform="translate(515, 0)">
        <rect width="485" height="660" rx="24" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

        <!-- Top Profile Row: Real Photo + Badge + Name + Title -->
        <g transform="translate(32, 32)">
          <!-- Authentic Photographic Portrait (soumik.jpg) -->
          <g id="Soumik_Photo_Container">
            <image href="${IMAGES.soumik}" width="96" height="96" clip-path="url(#soumik-clip)" preserveAspectRatio="xMidYMid slice"/>
            <rect width="96" height="96" rx="16" stroke="${RED}" stroke-width="2" stroke-opacity="0.25" fill="none"/>
            <!-- Code Badge on Avatar -->
            <circle cx="86" cy="86" r="13" fill="#faf7f2" stroke="${BORDER}" stroke-width="1"/>
            <text x="86" y="90" font-size="11" text-anchor="middle">💻</text>
          </g>

          <g transform="translate(116, 6)">
            <!-- Co-Creator Pill -->
            <rect width="96" height="22" rx="11" fill="${RED_SOFT}"/>
            <text x="12" y="15" fill="${RED}" font-size="11" font-weight="700">✨ Co-Creator</text>
            <!-- Name -->
            <text x="0" y="48" fill="${TEXT_DARK}" font-size="24" font-weight="900">Soumik</text>
            <!-- Role -->
            <text x="0" y="70" fill="${RED}" font-size="14" font-weight="700">Backend &amp; Systems Lead</text>
          </g>
        </g>

        <!-- Narrative Description -->
        <g transform="translate(32, 156)">
          <text x="0" y="0" fill="${TEXT_SEC}" font-size="13" line-height="22">
            <tspan x="0" dy="18">Directs backend &amp; systems architecture, core application logic, route optimization algorithms,</tspan>
            <tspan x="0" dy="20">offline-first transit functionality, backend integrations, and platform performance &amp; reliability.</tspan>
            <tspan x="0" dy="20">Engineers the digital core connecting millions across Kolkata festive days.</tspan>
          </text>
        </g>

        <!-- Key Responsibilities Chips -->
        <g transform="translate(32, 250)">
          <text x="0" y="0" fill="#8a7f76" font-size="11" font-weight="800" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
          <g transform="translate(0, 12)">
            ${renderResponsibilityChip(0, 0, 'Backend Architecture')}
            ${renderResponsibilityChip(145, 0, 'Core Application Logic')}
            ${renderResponsibilityChip(0, 36, 'System Architecture')}
            ${renderResponsibilityChip(140, 36, 'Route Optimization')}
            ${renderResponsibilityChip(0, 72, 'Offline-First Transit')}
            ${renderResponsibilityChip(135, 72, 'Backend Integrations')}
            ${renderResponsibilityChip(0, 108, 'Performance &amp; Reliability')}
          </g>
        </g>

        <!-- Professional Profile / LinkedIn Action -->
        <g id="Soumik_LinkedIn_Row" transform="translate(32, 590)">
          <line x1="0" y1="0" x2="421" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="0" y="32" fill="#8a7f76" font-size="12">Professional Profile</text>
          <!-- LinkedIn Blue Button -->
          <g transform="translate(315, 12)">
            <rect width="106" height="34" rx="10" fill="${LINKEDIN_BLUE}"/>
            <text x="14" y="22" font-size="14">in</text>
            <text x="36" y="22" fill="#FFFFFF" font-size="13" font-weight="700">LinkedIn</text>
            <text x="90" y="22" fill="#FFFFFF" font-size="12">↗</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  <!-- Authoritative Footer -->
  ${renderDesktopFooter(1080, false)}
</svg>`;
}

function renderResponsibilityChip(x, y, label) {
  const width = label.length * 6.5 + 24;
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="${width}" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
    <text x="${width / 2}" y="18" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">${label}</text>
  </g>`;
}

// -------------------------------------------------------------------------
// 3. Desktop Explore Screen (1440 x 1850)
// -------------------------------------------------------------------------
function generateDesktopExplore() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1850" viewBox="0 0 1440 1850" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="1440" height="1850" fill="${BG_CREAM}"/>
  ${renderDesktopHeader('Explore')}

  <!-- Page Header -->
  <g id="Explore_Header" transform="translate(80, 96)">
    <g id="Discovery_Badge">
      <rect width="136" height="26" rx="13" fill="${RED_SOFT}"/>
      <text x="68" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">🔍 PANDAL DISCOVERY</text>
    </g>
    <text x="0" y="65" fill="${TEXT_MAIN}" font-size="38" font-weight="900" letter-spacing="-0.5">Explore Puja Pandals</text>
    <text x="0" y="96" fill="${TEXT_SEC}" font-size="16">Search 774 mapped pandals across Kolkata by zone, metro proximity, theme, and crowd level.</text>

    <!-- Search Input Bar -->
    <g transform="translate(0, 126)">
      <rect width="1280" height="54" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="24" y="34" font-size="20">🔍</text>
      <text x="56" y="33" fill="${TEXT_MUTED}" font-size="15">Search by pandal name, locality, or metro station (e.g. Bagbazar, Sovabazar, Dum Dum)...</text>
      <rect x="1170" y="9" width="96" height="36" rx="10" fill="${RED}"/>
      <text x="1218" y="32" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Search</text>
    </g>

    <!-- Zone Filter Pills -->
    <g transform="translate(0, 202)">
      <!-- Pill 1: All (Active) -->
      <rect x="0" width="86" height="36" rx="18" fill="${RED}"/>
      <text x="43" y="23" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">All (774)</text>

      <!-- Pill 2: North Kolkata -->
      <rect x="96" width="146" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="169" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">North Kolkata (182)</text>

      <!-- Pill 3: South Kolkata -->
      <rect x="252" width="146" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="325" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">South Kolkata (214)</text>

      <!-- Pill 4: Central Kolkata -->
      <rect x="408" width="156" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="486" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Central Kolkata (98)</text>

      <!-- Pill 5: Salt Lake -->
      <rect x="574" width="124" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="636" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Salt Lake (64)</text>

      <!-- Pill 6: Bonedi Bari -->
      <rect x="708" width="138" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="777" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Bonedi Bari (55)</text>
    </g>
  </g>

  <!-- PANDAL CARDS (3x2 GRID WITH AUTHENTIC HIGH-RES IMAGES) -->
  <g id="Pandal_Cards_Grid" transform="translate(80, 420)">
    
    <!-- Row 1: Bagbazar (0), Kumartuli (436), Sovabazar (872) -->
    ${renderPandalCard(0, 0, IMAGES.bagbazar, 'North Kolkata', 'Bagbazar Sarbojanin', 'বাগবাজার সার্বজনীন', 'Shyambazar (500m walk)', 'Traditional • Heritage', 'Moderate Crowd', 'pandal-1-clip')}
    ${renderPandalCard(436, 0, IMAGES.kumartuli, 'North Kolkata', 'Kumartuli Park', 'কুমারটুলী পার্ক', 'Sovabazar (700m walk)', 'Clay Artistry • Innovation', 'High Footfall', 'pandal-2-clip')}
    ${renderPandalCard(872, 0, IMAGES.sovabazar, 'Bonedi Bari', 'Sovabazar Rajbari', 'শোভাবাজার রাজবাড়ি', 'Sovabazar (400m walk)', '1757 Nabakrishna Deb Heritage', 'Sacred Legacy', 'pandal-3-clip')}

    <!-- Row 2: Suruchi (0), Ekdalia (436), Sreebhumi (872) -->
    ${renderPandalCard(0, 430, IMAGES.suruchi, 'South Kolkata', 'Suruchi Sangha', 'সুরুচি সংঘ', 'Majerhat (900m walk)', 'All-India State Theme • Cultural', 'High Footfall', 'pandal-4-clip')}
    ${renderPandalCard(436, 430, IMAGES.ekdalia, 'South Kolkata', 'Ekdalia Evergreen', 'একডালিয়া এভারগ্রিন', 'Gariahat (1.1km walk)', 'South Indian Temple Replica', 'High Footfall', 'pandal-5-clip')}
    ${renderPandalCard(872, 430, IMAGES.sreebhumi, 'North Kolkata', 'Sreebhumi Sporting Club', 'শ্রীভূমি স্পোর্টিং ক্লাব', 'Ultadanga (1.2km walk)', 'Grand Palace Illumination', 'Extreme Footfall', 'pandal-6-clip')}
  </g>

  <!-- Pagination Controls -->
  <g id="Pagination" transform="translate(80, 1340)">
    <rect width="1280" height="60" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <text x="24" y="36" fill="${TEXT_SEC}" font-size="14">Showing 1 to 6 of 774 pandals</text>
    <g transform="translate(1000, 12)">
      <rect width="80" height="36" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="40" y="23" fill="${TEXT_MUTED}" font-size="13" font-weight="600" text-anchor="middle">&lt; Prev</text>
      <rect x="90" width="36" height="36" rx="10" fill="${RED}"/>
      <text x="108" y="23" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">1</text>
      <rect x="134" width="36" height="36" rx="10" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="152" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">2</text>
      <rect x="178" width="80" height="36" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="218" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Next &gt;</text>
    </g>
  </g>

  <!-- Authoritative Footer -->
  ${renderDesktopFooter(1500, false)}
</svg>`;
}

function renderPandalCard(x, y, imageHref, zone, titleEn, titleBn, metro, theme, crowd, clipId) {
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="406" height="400" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    
    <!-- Authentic Pandal Image Fill -->
    <image href="${imageHref}" width="406" height="190" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>

    <!-- Zone Pill Overlay -->
    <g transform="translate(16, 16)">
      <rect width="${zone.length * 7 + 20}" height="24" rx="12" fill="${RED_SOFT}"/>
      <text x="${(zone.length * 7 + 20) / 2}" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">${zone}</text>
    </g>

    <!-- Crowd Badge Overlay -->
    <g transform="translate(280, 16)">
      <rect width="110" height="24" rx="12" fill="#000000" fill-opacity="0.65"/>
      <text x="55" y="16" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">${crowd}</text>
    </g>

    <!-- Details -->
    <g transform="translate(20, 210)">
      <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">${titleEn}</text>
      <text x="0" y="42" fill="${TEXT_MUTED}" font-size="13" class="bengali">${titleBn}</text>
      
      <!-- Metro & Theme Line -->
      <text x="0" y="74" fill="${TEXT_SEC}" font-size="12">🚇 ${metro} • ${theme}</text>

      <line x1="0" y1="94" x2="366" y2="94" stroke="${BORDER_LIGHT}" stroke-width="1"/>

      <!-- Action Buttons -->
      <g transform="translate(0, 110)">
        <rect width="160" height="34" rx="10" fill="${RED}"/>
        <text x="80" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">+ Add to Route</text>

        <rect x="170" width="100" height="34" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="220" y="22" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">View Details</text>
      </g>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 4. Desktop Calendar Screen (1440 x 1400)
// -------------------------------------------------------------------------
function generateDesktopCalendar() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1400" viewBox="0 0 1440 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="1440" height="1400" fill="${BG_CREAM}"/>
  ${renderDesktopHeader('More')}

  <!-- Page Header -->
  <g id="Calendar_Header" transform="translate(80, 96)">
    <rect width="140" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="70" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">📅 DURGA PUJA 2026</text>
    <text x="0" y="65" fill="${TEXT_MAIN}" font-size="38" font-weight="900" letter-spacing="-0.5">Festival Almanac &amp; Auspicious Timings</text>
    <text x="0" y="96" fill="${TEXT_SEC}" font-size="16">Official Gupta Press &amp; PM Panjika sacred tithis, Pushpanjali schedules, and Sandhi Puja countdown.</text>
  </g>

  <!-- DAYS SCHEDULE (5 CARDS) -->
  <g id="Calendar_Cards" transform="translate(80, 240)">
    ${renderCalendarCard(0, 'Maha Sasthi', 'মহা ষষ্ঠী', 'October 16, 2026', 'Bodhon, Amantran & Adhivas', 'Evening: 06:45 PM – 08:30 PM', 'Devi Bodhon and festive inauguration across Kolkata.')}
    ${renderCalendarCard(210, 'Maha Saptami', 'মহা সপ্তমী', 'October 17, 2026', 'Nabapatrika Pravesh', 'Morning: 06:12 AM – 08:40 AM', 'Sacred bath of Kola Bou at river ghats.')}
    ${renderCalendarCard(420, 'Maha Ashtami', 'মহা অষ্টমী', 'October 18, 2026', 'Sandhi Puja & Kumari Puja', 'Sandhi Puja: 05:24 PM – 06:12 PM', '108 lotus flowers & 108 sacred earthen lamps.')}
    ${renderCalendarCard(630, 'Maha Navami', 'মহা নবমী', 'October 19, 2026', 'Maha Aarti & Dhunuchi Naach', 'Noon: 11:30 AM – 01:15 PM', 'Grand aarti and vibrant evening pandal hopping.')}
    ${renderCalendarCard(840, 'Bijoya Dashami', 'বিজয়া দশমী', 'October 20, 2026', 'Sindoor Khela & Visarjan', 'Visarjan: 03:00 PM onwards', 'Subho Bijoya greetings and immersion procession.')}
  </g>

  <!-- Authoritative Footer -->
  ${renderDesktopFooter(1160, false)}
</svg>`;
}

function renderCalendarCard(y, titleEn, titleBn, date, ritual, timings, notes) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="1280" height="190" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <!-- Left Date Column -->
    <g transform="translate(32, 32)">
      <rect width="160" height="126" rx="14" fill="${RED_SOFT}"/>
      <text x="80" y="44" fill="${RED}" font-size="20" font-weight="900" text-anchor="middle">${titleEn}</text>
      <text x="80" y="72" fill="${RED}" font-size="14" font-weight="700" text-anchor="middle" class="bengali">${titleBn}</text>
      <text x="80" y="102" fill="${TEXT_SEC}" font-size="12" font-weight="600" text-anchor="middle">${date}</text>
    </g>
    <!-- Right Ritual Details -->
    <g transform="translate(224, 36)">
      <text x="0" y="24" fill="${TEXT_MAIN}" font-size="20" font-weight="800">${ritual}</text>
      <text x="0" y="58" fill="${RED}" font-size="14" font-weight="700">⏱️ ${timings}</text>
      <text x="0" y="90" fill="${TEXT_MUTED}" font-size="14">${notes}</text>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 5. Desktop Planner Screen (1440 x 1400)
// -------------------------------------------------------------------------
function generateDesktopPlanner() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1400" viewBox="0 0 1440 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="1440" height="1400" fill="${BG_CREAM}"/>
  ${renderDesktopHeader('Plan')}

  <!-- Page Header -->
  <g id="Planner_Header" transform="translate(80, 96)">
    <rect width="140" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="70" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">🔀 ROUTE OPTIMIZER</text>
    <text x="0" y="65" fill="${TEXT_MAIN}" font-size="38" font-weight="900" letter-spacing="-0.5">Smart Pujo Route Planner</text>
    <text x="0" y="96" fill="${TEXT_SEC}" font-size="16">Build and reorder your pandal trail. PujoPath minimizes walking distance and recommends nearest transit.</text>
  </g>

  <!-- PLANNER WORKSPACE: 2 COLUMNS (Left: Stops List, Right: Metrics & Map Preview) -->
  <g id="Planner_Workspace" transform="translate(80, 240)">
    <!-- Left Column: Active Trail Stops (680px wide) -->
    <g id="Trail_Stops_Column" transform="translate(0, 0)">
      <rect width="680" height="740" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <g transform="translate(28, 28)">
        <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Your Custom Itinerary (4 Pandals)</text>
        <text x="0" y="42" fill="${TEXT_MUTED}" font-size="13">Drag and drop to re-order your visiting sequence.</text>

        <!-- Stops -->
        <g id="Stops_List" transform="translate(0, 64)">
          ${renderPlannerStop(0, 1, 'Bagbazar Sarbojanin', 'North Kolkata • Start Point', 'Shyambazar Metro (500m)', '15 mins avg wait')}
          ${renderPlannerStop(120, 2, 'Kumartuli Park', 'North Kolkata • 800m walk from Stop 1', 'Sovabazar Metro (700m)', '25 mins avg wait')}
          ${renderPlannerStop(240, 3, 'Sovabazar Rajbari', 'Bonedi Bari • 450m walk from Stop 2', 'Sovabazar Metro (400m)', 'Historic Courtyard')}
          ${renderPlannerStop(360, 4, 'College Square', 'Central Kolkata • Transit: Metro Line 1', 'Central / MG Road Metro', 'Water Illumination')}
        </g>
      </g>
    </g>

    <!-- Right Column: Summary Card & Action (560px wide) -->
    <g id="Summary_Column" transform="translate(720, 0)">
      <rect width="560" height="340" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <g transform="translate(32, 32)">
        <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Trail Summary</text>
        
        <g transform="translate(0, 50)">
          <text x="0" y="20" fill="${TEXT_SEC}" font-size="14">Total Walking Distance:</text>
          <text x="496" y="20" fill="${TEXT_MAIN}" font-size="16" font-weight="800" text-anchor="end">3.8 km</text>

          <text x="0" y="60" fill="${TEXT_SEC}" font-size="14">Estimated Hopping Duration:</text>
          <text x="496" y="60" fill="${TEXT_MAIN}" font-size="16" font-weight="800" text-anchor="end">3 hrs 15 mins</text>

          <text x="0" y="100" fill="${TEXT_SEC}" font-size="14">Transit Efficiency Score:</text>
          <text x="496" y="100" fill="${RED}" font-size="16" font-weight="800" text-anchor="end">94% Optimal</text>
        </g>

        <!-- Action Buttons -->
        <g transform="translate(0, 190)">
          <rect width="496" height="48" rx="14" fill="${RED}"/>
          <text x="248" y="30" fill="#FFFFFF" font-size="15" font-weight="700" text-anchor="middle">Export Route to Maps</text>

          <rect y="60" width="496" height="48" rx="14" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
          <text x="248" y="90" fill="${TEXT_MAIN}" font-size="15" font-weight="600" text-anchor="middle">Share Route via WhatsApp</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Authoritative Footer -->
  ${renderDesktopFooter(1160, false)}
</svg>`;
}

function renderPlannerStop(y, idx, name, loc, metro, wait) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="624" height="100" rx="14" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
    <!-- Index Circle -->
    <circle cx="36" cy="50" r="18" fill="${RED}"/>
    <text x="36" y="56" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">${idx}</text>
    <!-- Info -->
    <g transform="translate(72, 22)">
      <text x="0" y="16" fill="${TEXT_MAIN}" font-size="16" font-weight="800">${name}</text>
      <text x="0" y="38" fill="${TEXT_MUTED}" font-size="12">${loc}</text>
      <text x="0" y="58" fill="${RED}" font-size="12" font-weight="600">🚇 ${metro} • ${wait}</text>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 6. Desktop Metro Screen (1440 x 1400)
// -------------------------------------------------------------------------
function generateDesktopMetro() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1400" viewBox="0 0 1440 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="1440" height="1400" fill="${BG_CREAM}"/>
  ${renderDesktopHeader('More')}

  <!-- Page Header -->
  <g id="Metro_Header" transform="translate(80, 96)">
    <rect width="130" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="65" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">🚇 TRANSIT GUIDE</text>
    <text x="0" y="65" fill="${TEXT_MAIN}" font-size="38" font-weight="900" letter-spacing="-0.5">Kolkata Metro Puja Hopping Guide</text>
    <text x="0" y="96" fill="${TEXT_SEC}" font-size="16">Fastest route connectivity across Blue Line (North-South) and Green Line (East-West).</text>
  </g>

  <!-- METRO LINES (2 LARGE SECTIONS) -->
  <g id="Metro_Lines" transform="translate(80, 240)">
    <!-- Blue Line Section (620px wide) -->
    <g transform="translate(0, 0)">
      <rect width="620" height="660" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <g transform="translate(28, 28)">
        <rect width="150" height="28" rx="8" fill="#2563eb" fill-opacity="0.12"/>
        <text x="75" y="19" fill="#2563eb" font-size="12" font-weight="800" text-anchor="middle">🔵 BLUE LINE (LINE 1)</text>
        <text x="0" y="60" fill="${TEXT_MAIN}" font-size="20" font-weight="800">Dakshineswar ⇄ Kavi Subhash</text>
        
        <g transform="translate(0, 80)">
          ${renderMetroStation(0, 'Shyambazar', 'Bagbazar Sarbojanin, Kumartuli, Tala Pratyay', '350m – 600m')}
          ${renderMetroStation(100, 'Sovabazar Sutanuti', 'Sovabazar Rajbari, Ahiritola, Kumartuli Park', '400m – 700m')}
          ${renderMetroStation(200, 'Central / MG Road', 'College Square, Md. Ali Park, Santosh Mitra Sq', '500m – 800m')}
          ${renderMetroStation(300, 'Kalighat', 'Deshapriya Park, Singhi Park, Maddox Square', '600m – 1.2km')}
          ${renderMetroStation(400, 'Netaji Bhavan', 'Bhowanipore 76 Pally, Chakraberia Sarbojanin', '450m – 750m')}
        </g>
      </g>
    </g>

    <!-- Green Line Section (620px wide) -->
    <g transform="translate(660, 0)">
      <rect width="620" height="660" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <g transform="translate(28, 28)">
        <rect width="160" height="28" rx="8" fill="#0d9488" fill-opacity="0.12"/>
        <text x="80" y="19" fill="#0d9488" font-size="12" font-weight="800" text-anchor="middle">🟢 GREEN LINE (LINE 2)</text>
        <text x="0" y="60" fill="${TEXT_MAIN}" font-size="20" font-weight="800">Howrah Maidan ⇄ Salt Lake Sector V</text>
        
        <g transform="translate(0, 80)">
          ${renderMetroStation(0, 'Howrah Maidan', 'Shibpur Mandirtala, Howrah Sarbojanin', '400m – 900m')}
          ${renderMetroStation(100, 'Esplanade (Interchange)', 'Crowd Hub, Connection to Line 1 &amp; Line 2', 'Direct Interchange')}
          ${renderMetroStation(200, 'Sealdah', 'Kankurgachi Mitali, Beleghata Sandhani', '700m – 1.1km')}
          ${renderMetroStation(300, 'Salt Lake Stadium', 'FD Block, BJ Block, Salt Lake AE Block', '650m – 1.2km')}
          ${renderMetroStation(400, 'City Centre', 'Labony Estate, Salt Lake Block Pandals', '300m – 800m')}
        </g>
      </g>
    </g>
  </g>

  <!-- Authoritative Footer -->
  ${renderDesktopFooter(1080, false)}
</svg>`;
}

function renderMetroStation(y, station, pandals, dist) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="564" height="84" rx="14" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
    <circle cx="28" cy="42" r="10" fill="#2563eb"/>
    <circle cx="28" cy="42" r="4" fill="#FFFFFF"/>
    <g transform="translate(52, 18)">
      <text x="0" y="16" fill="${TEXT_MAIN}" font-size="15" font-weight="800">${station}</text>
      <text x="0" y="36" fill="${TEXT_MUTED}" font-size="12">Pandals: ${pandals}</text>
      <text x="0" y="54" fill="${RED}" font-size="11" font-weight="600">🚶 Walking distance: ${dist}</text>
    </g>
  </g>`;
}

// Export and generate all 6 desktop screens
console.log('Generating Web Desktop SVGs...');
fs.writeFileSync(path.join(DESKTOP_DIR, '01_web_desktop_home.svg'), generateDesktopHome());
fs.writeFileSync(path.join(DESKTOP_DIR, '02_web_desktop_developer.svg'), generateDesktopDeveloper());
fs.writeFileSync(path.join(DESKTOP_DIR, '03_web_desktop_explore.svg'), generateDesktopExplore());
fs.writeFileSync(path.join(DESKTOP_DIR, '04_web_desktop_calendar.svg'), generateDesktopCalendar());
fs.writeFileSync(path.join(DESKTOP_DIR, '05_web_desktop_planner.svg'), generateDesktopPlanner());
fs.writeFileSync(path.join(DESKTOP_DIR, '06_web_desktop_metro.svg'), generateDesktopMetro());
console.log('Web Desktop SVGs generated successfully in:', DESKTOP_DIR);

module.exports = {
  generateDesktopHome,
  generateDesktopDeveloper,
  generateDesktopExplore,
  generateDesktopCalendar,
  generateDesktopPlanner,
  generateDesktopMetro,
};
