const fs = require('fs');
const path = require('path');
const {
  EXPORTS_DIR,
  IMAGES,
  RED, RED_HOVER, RED_SOFT, RED_BORDER, BG_CREAM, BG_WHITE, BG_SURFACE,
  TEXT_MAIN, TEXT_DARK, TEXT_SEC, TEXT_MUTED, TEXT_FAINT, BORDER, BORDER_LIGHT, LINKEDIN_BLUE, GOLD,
  SVG_DEFS,
  renderMobileWebHeader,
  renderMobileFooter,
  renderMobileBottomNav,
} = require('./authentic-components');

const MOBILE_DIR = path.join(EXPORTS_DIR, 'web-mobile');
if (!fs.existsSync(MOBILE_DIR)) fs.mkdirSync(MOBILE_DIR, { recursive: true });

// -------------------------------------------------------------------------
// 1. Web Mobile Home Screen (390 x 1750)
// -------------------------------------------------------------------------
function generateMobileHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1750" viewBox="0 0 390 1750" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="1750" fill="${BG_CREAM}"/>

  <!-- Background Festival Artwork -->
  <g id="Background_Artwork_Mobile" opacity="0.22">
    <image href="${IMAGES.ghibliBg}" width="390" height="420" preserveAspectRatio="xMidYMid slice"/>
  </g>

  <!-- Sticky Mobile Header -->
  ${renderMobileWebHeader()}

  <!-- 1. Hero Card -->
  <g id="Mobile_Hero_Card" transform="translate(16, 76)">
    <rect width="358" height="260" rx="20" fill="${BG_WHITE}" fill-opacity="0.92" stroke="${BORDER}" stroke-width="1"/>
    
    <g transform="translate(20, 20)">
      <!-- Real Countdown Pill -->
      <g id="Countdown_Pill">
        <rect width="160" height="28" rx="14" fill="${RED_SOFT}" stroke="${RED_BORDER}" stroke-width="1"/>
        <text x="12" y="19" font-size="13">🗓️</text>
        <text x="32" y="19" fill="${RED}" font-size="11" font-weight="700">180 days to Puja</text>
      </g>

      <!-- Headline -->
      <text x="0" y="70" fill="${TEXT_MAIN}" font-size="26" font-weight="900" letter-spacing="-0.5">Your Puja, made simple.</text>
      <text x="0" y="96" fill="${TEXT_SEC}" font-size="13" font-weight="500">Find the pandals you love, build a route,</text>
      <text x="0" y="114" fill="${TEXT_SEC}" font-size="13" font-weight="500">and head out with confidence.</text>

      <!-- Action Buttons -->
      <g transform="translate(0, 136)">
        <!-- Find Pandals Full-Width -->
        <g>
          <rect width="318" height="42" rx="12" fill="${RED}"/>
          <text x="159" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">🔍 Find pandals →</text>
        </g>
        <!-- Build Route Secondary -->
        <g transform="translate(0, 50)">
          <rect width="318" height="42" rx="12" fill="${BG_WHITE}" stroke="#d2c7bc" stroke-width="1"/>
          <text x="159" y="26" fill="${TEXT_MAIN}" font-size="13" font-weight="700" text-anchor="middle">🧭 Build a route</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 2. Quick Access 2-Column Grid (6 cards) -->
  <g id="Mobile_Quick_Access" transform="translate(16, 356)">
    <text x="0" y="0" fill="${TEXT_MAIN}" font-size="16" font-weight="800">Quick Access</text>

    <g transform="translate(0, 12)">
      ${renderMobileQuickCard(0, 0, '📍', 'Map', 'See all pandals', '#b42323')}
      ${renderMobileQuickCard(184, 0, '🔀', 'Route Planner', 'Optimize your trail', '#0d9488')}
      ${renderMobileQuickCard(0, 84, '🚇', 'Metro Guide', 'Find stations', '#2563eb')}
      ${renderMobileQuickCard(184, 84, '📅', 'Calendar', 'Auspicious tithis', '#ea580c')}
      ${renderMobileQuickCard(0, 168, '🎵', 'Puja Music', 'Chandi Path &amp; Dhak', '#7c3aed')}
      ${renderMobileQuickCard(184, 168, '✨', 'Mahalaya', 'Dawn broadcast', '#d97706')}
    </g>
  </g>

  <!-- 3. Curated Puja Highlights (3 Stacked Cards with Real Images) -->
  <g id="Mobile_Puja_Highlights" transform="translate(16, 646)">
    <g transform="translate(0, 0)">
      <text x="0" y="0" fill="${RED}" font-size="16" font-weight="900">✣</text>
      <text x="18" y="0" fill="${TEXT_MAIN}" font-size="16" font-weight="800">Puja Highlights</text>
      <text x="358" y="0" fill="${RED}" font-size="12" font-weight="700" text-anchor="end">View all →</text>
    </g>

    <g transform="translate(0, 14)">
      ${renderMobileHighlightCard(0, IMAGES.sovabazar, 'Traditions &amp; Art', 'Traditions &amp; Pandal Art', "Bengal's heritage installations.", 'highlight-1-clip')}
      ${renderMobileHighlightCard(104, IMAGES.bagbazar, 'Almanac', 'Sacred Almanac &amp; Timings', 'Ashtami Sandhi Puja schedules.', 'highlight-2-clip')}
      ${renderMobileHighlightCard(208, IMAGES.collegeSquare, 'Routes', 'Pujo Evenings &amp; Routes', 'Illumination &amp; evening hopping.', 'highlight-3-clip')}
    </g>
  </g>

  <!-- 4. Feature Footer (6 Pills in 2-Column Grid) -->
  <g id="Mobile_Feature_Pills" transform="translate(16, 990)">
    ${renderMobileFeaturePill(0, 0, '✨', 'Ultra Simple', 'Only what you need')}
    ${renderMobileFeaturePill(184, 0, '⚡', 'Lightning Fast', 'Smooth experience')}
    ${renderMobileFeaturePill(0, 58, '📱', 'Fully Responsive', 'All devices')}
    ${renderMobileFeaturePill(184, 58, '🌙', 'Dark Mode', 'Click to toggle')}
    ${renderMobileFeaturePill(0, 116, '🌐', 'Bengali &amp; English', 'Click to toggle')}
    ${renderMobileFeaturePill(184, 116, '❤️', 'Saved Trails', 'Saved favorites')}
  </g>

  <!-- Authoritative Mobile Footer (with safe area above bottom nav) -->
  ${renderMobileFooter(1200, 390, true)}

  <!-- Fixed Mobile Bottom Navigation (stays at bottom of viewport) -->
  ${renderMobileBottomNav(1686, 390, 'Home')}
</svg>`;
}

function renderMobileQuickCard(x, y, icon, title, desc, color) {
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="174" height="74" rx="14" fill="${BG_WHITE}" fill-opacity="0.9" stroke="${BORDER}" stroke-width="1"/>
    <rect x="12" y="14" width="32" height="32" rx="8" fill="${color}" fill-opacity="0.12"/>
    <text x="28" y="35" font-size="15" text-anchor="middle">${icon}</text>
    <text x="52" y="28" fill="${TEXT_MAIN}" font-size="13" font-weight="700">${title}</text>
    <text x="52" y="44" fill="${TEXT_MUTED}" font-size="10">${desc}</text>
  </g>`;
}

function renderMobileHighlightCard(y, imageHref, badge, title, desc, clipId) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="358" height="92" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(10, 10)">
      <image href="${imageHref}" width="100" height="72" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
      <rect width="64" height="16" rx="4" fill="#000000" fill-opacity="0.65"/>
      <text x="32" y="12" fill="#FFFFFF" font-size="8" font-weight="700" text-anchor="middle">${badge}</text>
    </g>
    <g transform="translate(122, 22)">
      <text x="0" y="14" fill="${TEXT_MAIN}" font-size="13" font-weight="700">${title}</text>
      <text x="0" y="34" fill="${TEXT_MUTED}" font-size="11">${desc}</text>
    </g>
  </g>`;
}

function renderMobileFeaturePill(x, y, icon, title, desc) {
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="174" height="48" rx="12" fill="${BG_WHITE}" fill-opacity="0.8" stroke="#eadcce" stroke-width="1"/>
    <text x="18" y="28" font-size="14">${icon}</text>
    <text x="38" y="22" fill="${TEXT_DARK}" font-size="11" font-weight="700">${title}</text>
    <text x="38" y="36" fill="${TEXT_MUTED}" font-size="9">${desc}</text>
  </g>`;
}

// -------------------------------------------------------------------------
// 2. Web Mobile Developer Screen (390 x 1950)
// -------------------------------------------------------------------------
function generateMobileDeveloper() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1950" viewBox="0 0 390 1950" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="1950" fill="${BG_CREAM}"/>
  ${renderMobileWebHeader()}

  <!-- Page Header -->
  <g id="Mobile_Dev_Header" transform="translate(16, 76)">
    <text x="0" y="14" fill="${RED}" font-size="11" font-weight="800" letter-spacing="1">👥 PROJECT CO-CREATORS</text>
    <text x="0" y="46" fill="${TEXT_DARK}" font-size="28" font-weight="900" letter-spacing="-0.5">Meet the Developers</text>
    <text x="0" y="74" fill="${TEXT_SEC}" font-size="13">
      PujoPath is co-created by Soumik and Moumita to help people discover Kolkata's Durga Puja.
    </text>
  </g>

  <!-- STACKED DEVELOPER CARDS -->
  <g id="Mobile_Dev_Cards" transform="translate(16, 190)">
    
    <!-- CARD 1: MOUMITA (TOP) -->
    <g id="Card_Mobile_Moumita" transform="translate(0, 0)">
      <rect width="358" height="660" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

      <!-- Profile Header -->
      <g transform="translate(20, 20)">
        <!-- Photo with layout badge -->
        <g id="Moumita_Photo_Mobile">
          <image href="${IMAGES.moumita}" width="80" height="80" clip-path="url(#moumita-mob-clip)" preserveAspectRatio="xMidYMid slice"/>
          <rect width="80" height="80" rx="16" stroke="${RED}" stroke-width="1.8" stroke-opacity="0.25" fill="none"/>
          <circle cx="72" cy="72" r="11" fill="#faf7f2" stroke="${BORDER}" stroke-width="1"/>
          <text x="72" y="76" font-size="9" text-anchor="middle">📐</text>
        </g>

        <g transform="translate(96, 6)">
          <rect width="88" height="20" rx="10" fill="${RED_SOFT}"/>
          <text x="10" y="14" fill="${RED}" font-size="10" font-weight="700">✨ Co-Creator</text>
          <text x="0" y="44" fill="${TEXT_DARK}" font-size="22" font-weight="900">Moumita</text>
          <text x="0" y="64" fill="${RED}" font-size="13" font-weight="700">UI &amp; Frontend Lead</text>
        </g>
      </g>

      <!-- Narrative -->
      <g transform="translate(20, 116)">
        <text x="0" y="0" fill="${TEXT_SEC}" font-size="12">
          <tspan x="0" dy="16">Directs user interface design, frontend architecture,</tspan>
          <tspan x="0" dy="18">responsive layouts, user experience, visual consistency,</tspan>
          <tspan x="0" dy="18">and interaction design, alongside research of historic</tspan>
          <tspan x="0" dy="18">Bonedi Bari traditions and festival narratives.</tspan>
        </text>
      </g>

      <!-- Key Responsibilities Chips -->
      <g transform="translate(20, 210)">
        <text x="0" y="0" fill="#8a7f76" font-size="10" font-weight="800" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
        <g transform="translate(0, 10)">
          ${renderMobileChip(0, 0, 'User Interface Design')}
          ${renderMobileChip(145, 0, 'Frontend Arch')}
          ${renderMobileChip(0, 34, 'Responsive Layouts')}
          ${renderMobileChip(140, 34, 'User Experience (UX)')}
          ${renderMobileChip(0, 68, 'Visual Consistency')}
          ${renderMobileChip(135, 68, 'Cultural Curation')}
          ${renderMobileChip(0, 102, 'Interaction Design')}
        </g>
      </g>

      <!-- LinkedIn Action Button -->
      <g transform="translate(20, 600)">
        <line x1="0" y1="0" x2="318" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
        <text x="0" y="28" fill="#8a7f76" font-size="11">Professional Profile</text>
        <g transform="translate(216, 10)">
          <rect width="102" height="34" rx="10" fill="${LINKEDIN_BLUE}"/>
          <text x="12" y="22" font-size="13">in</text>
          <text x="32" y="22" fill="#FFFFFF" font-size="12" font-weight="700">LinkedIn</text>
          <text x="86" y="22" fill="#FFFFFF" font-size="11">↗</text>
        </g>
      </g>
    </g>

    <!-- CARD 2: SOUMIK (BOTTOM) -->
    <g id="Card_Mobile_Soumik" transform="translate(0, 680)">
      <rect width="358" height="660" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

      <!-- Profile Header -->
      <g transform="translate(20, 20)">
        <!-- Photo with code badge -->
        <g id="Soumik_Photo_Mobile">
          <image href="${IMAGES.soumik}" width="80" height="80" clip-path="url(#soumik-mob-clip)" preserveAspectRatio="xMidYMid slice"/>
          <rect width="80" height="80" rx="16" stroke="${RED}" stroke-width="1.8" stroke-opacity="0.25" fill="none"/>
          <circle cx="72" cy="72" r="11" fill="#faf7f2" stroke="${BORDER}" stroke-width="1"/>
          <text x="72" y="76" font-size="9" text-anchor="middle">💻</text>
        </g>

        <g transform="translate(96, 6)">
          <rect width="88" height="20" rx="10" fill="${RED_SOFT}"/>
          <text x="10" y="14" fill="${RED}" font-size="10" font-weight="700">✨ Co-Creator</text>
          <text x="0" y="44" fill="${TEXT_DARK}" font-size="22" font-weight="900">Soumik</text>
          <text x="0" y="64" fill="${RED}" font-size="13" font-weight="700">Backend &amp; Systems Lead</text>
        </g>
      </g>

      <!-- Narrative -->
      <g transform="translate(20, 116)">
        <text x="0" y="0" fill="${TEXT_SEC}" font-size="12">
          <tspan x="0" dy="16">Directs backend &amp; systems architecture, core application</tspan>
          <tspan x="0" dy="18">logic, route optimization algorithms, offline-first transit</tspan>
          <tspan x="0" dy="18">functionality, backend integrations, and performance.</tspan>
          <tspan x="0" dy="18">Connecting millions across Kolkata festive days.</tspan>
        </text>
      </g>

      <!-- Key Responsibilities Chips -->
      <g transform="translate(20, 210)">
        <text x="0" y="0" fill="#8a7f76" font-size="10" font-weight="800" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
        <g transform="translate(0, 10)">
          ${renderMobileChip(0, 0, 'Backend Architecture')}
          ${renderMobileChip(145, 0, 'Core App Logic')}
          ${renderMobileChip(0, 34, 'System Architecture')}
          ${renderMobileChip(140, 34, 'Route Optimization')}
          ${renderMobileChip(0, 68, 'Offline-First Transit')}
          ${renderMobileChip(135, 68, 'Backend Integrations')}
          ${renderMobileChip(0, 102, 'Performance &amp; Scale')}
        </g>
      </g>

      <!-- LinkedIn Action Button -->
      <g transform="translate(20, 600)">
        <line x1="0" y1="0" x2="318" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
        <text x="0" y="28" fill="#8a7f76" font-size="11">Professional Profile</text>
        <g transform="translate(216, 10)">
          <rect width="102" height="34" rx="10" fill="${LINKEDIN_BLUE}"/>
          <text x="12" y="22" font-size="13">in</text>
          <text x="32" y="22" fill="#FFFFFF" font-size="12" font-weight="700">LinkedIn</text>
          <text x="86" y="22" fill="#FFFFFF" font-size="11">↗</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Authoritative Mobile Footer -->
  ${renderMobileFooter(1550, 390, false)}

  <!-- Fixed Mobile Bottom Navigation -->
  ${renderMobileBottomNav(1886, 390, 'More')}
</svg>`;
}

function renderMobileChip(x, y, label) {
  const width = label.length * 6.5 + 20;
  return `
  <g transform="translate(${x}, ${y})">
    <rect width="${width}" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
    <text x="${width / 2}" y="17" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">${label}</text>
  </g>`;
}

// -------------------------------------------------------------------------
// 3. Web Mobile Explore Screen (390 x 2200)
// -------------------------------------------------------------------------
function generateMobileExplore() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="2200" viewBox="0 0 390 2200" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="2200" fill="${BG_CREAM}"/>
  ${renderMobileWebHeader()}

  <!-- Page Header -->
  <g id="Mobile_Explore_Header" transform="translate(16, 76)">
    <rect width="124" height="24" rx="12" fill="${RED_SOFT}"/>
    <text x="62" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">🔍 DISCOVERY</text>
    <text x="0" y="52" fill="${TEXT_MAIN}" font-size="26" font-weight="900" letter-spacing="-0.5">Explore Pandals</text>
    <text x="0" y="74" fill="${TEXT_SEC}" font-size="13">Search 774 mapped pandals in Kolkata.</text>

    <!-- Mobile Search Bar -->
    <g transform="translate(0, 92)">
      <rect width="358" height="46" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="14" y="28" font-size="16">🔍</text>
      <text x="42" y="28" fill="${TEXT_MUTED}" font-size="13">Search pandal, metro, zone...</text>
    </g>

    <!-- Horizontal Scroll Zone Chips -->
    <g transform="translate(0, 150)">
      <rect x="0" width="60" height="30" rx="15" fill="${RED}"/>
      <text x="30" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All</text>

      <rect x="68" width="100" height="30" rx="15" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="118" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">North Kolkata</text>

      <rect x="176" width="100" height="30" rx="15" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="226" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">South Kolkata</text>

      <rect x="284" width="80" height="30" rx="15" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="324" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Bonedi Bari</text>
    </g>
  </g>

  <!-- PANDAL CARDS (SINGLE COLUMN STACKED WITH REAL IMAGES) -->
  <g id="Mobile_Pandal_Cards" transform="translate(16, 280)">
    ${renderMobilePandalCard(0, IMAGES.bagbazar, 'North Kolkata', 'Bagbazar Sarbojanin', 'বাগবাজার সার্বজনীন', 'Shyambazar (500m walk)', 'Moderate Crowd')}
    ${renderMobilePandalCard(380, IMAGES.kumartuli, 'North Kolkata', 'Kumartuli Park', 'কুমারটুলী পার্ক', 'Sovabazar (700m walk)', 'High Footfall')}
    ${renderMobilePandalCard(760, IMAGES.sovabazar, 'Bonedi Bari', 'Sovabazar Rajbari', 'শোভাবাজার রাজবাড়ি', 'Sovabazar (400m walk)', 'Heritage')}
    ${renderMobilePandalCard(1140, IMAGES.suruchi, 'South Kolkata', 'Suruchi Sangha', 'সুরুচি সংঘ', 'Majerhat (900m walk)', 'High Footfall')}
  </g>

  <!-- Authoritative Mobile Footer -->
  ${renderMobileFooter(1850, 390, false)}

  <!-- Fixed Mobile Bottom Navigation -->
  ${renderMobileBottomNav(2136, 390, 'Explore')}
</svg>`;
}

function renderMobilePandalCard(y, imageHref, zone, titleEn, titleBn, metro, crowd) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="358" height="360" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    
    <!-- Image -->
    <image href="${imageHref}" width="358" height="170" clip-path="url(#mob-pandal-clip)" preserveAspectRatio="xMidYMid slice"/>

    <!-- Zone Pill -->
    <g transform="translate(14, 14)">
      <rect width="${zone.length * 7 + 16}" height="22" rx="11" fill="${RED_SOFT}"/>
      <text x="${(zone.length * 7 + 16) / 2}" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">${zone}</text>
    </g>

    <!-- Details -->
    <g transform="translate(16, 186)">
      <text x="0" y="18" fill="${TEXT_MAIN}" font-size="17" font-weight="800">${titleEn}</text>
      <text x="0" y="38" fill="${TEXT_MUTED}" font-size="12" class="bengali">${titleBn}</text>
      <text x="0" y="66" fill="${TEXT_SEC}" font-size="11">🚇 ${metro} • ${crowd}</text>

      <line x1="0" y1="84" x2="326" y2="84" stroke="${BORDER_LIGHT}" stroke-width="1"/>

      <g transform="translate(0, 98)">
        <rect width="180" height="36" rx="10" fill="${RED}"/>
        <text x="90" y="23" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">+ Add to Route</text>

        <rect x="190" width="136" height="36" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="258" y="23" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">View Details</text>
      </g>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 4. Web Mobile Calendar Screen (390 x 1800)
// -------------------------------------------------------------------------
function generateMobileCalendar() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1800" viewBox="0 0 390 1800" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="1800" fill="${BG_CREAM}"/>
  ${renderMobileWebHeader()}

  <!-- Page Header -->
  <g id="Mobile_Cal_Header" transform="translate(16, 76)">
    <rect width="130" height="24" rx="12" fill="${RED_SOFT}"/>
    <text x="65" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">📅 ALMANAC 2026</text>
    <text x="0" y="52" fill="${TEXT_MAIN}" font-size="26" font-weight="900" letter-spacing="-0.5">Festival Almanac</text>
    <text x="0" y="74" fill="${TEXT_SEC}" font-size="13">Auspicious tithis and Sandhi Puja schedule.</text>
  </g>

  <!-- CARDS (STACKED 5 DAYS) -->
  <g id="Mobile_Cal_Cards" transform="translate(16, 170)">
    ${renderMobileCalendarDay(0, 'Maha Sasthi', 'মহা ষষ্ঠী', 'Oct 16, 2026', 'Bodhon, Amantran &amp; Adhivas', '06:45 PM – 08:30 PM')}
    ${renderMobileCalendarDay(180, 'Maha Saptami', 'মহা সপ্তমী', 'Oct 17, 2026', 'Nabapatrika Pravesh', '06:12 AM – 08:40 AM')}
    ${renderMobileCalendarDay(360, 'Maha Ashtami', 'মহা অষ্টমী', 'Oct 18, 2026', 'Sandhi Puja (108 Diyas)', '05:24 PM – 06:12 PM')}
    ${renderMobileCalendarDay(540, 'Maha Navami', 'মহা নবমী', 'Oct 19, 2026', 'Maha Aarti &amp; Dhunuchi', '11:30 AM – 01:15 PM')}
    ${renderMobileCalendarDay(720, 'Bijoya Dashami', 'বিজয়া দশমী', 'Oct 20, 2026', 'Sindoor Khela &amp; Immersion', '03:00 PM onwards')}
  </g>

  <!-- Authoritative Mobile Footer -->
  ${renderMobileFooter(1450, 390, false)}

  <!-- Fixed Mobile Bottom Navigation -->
  ${renderMobileBottomNav(1736, 390, 'More')}
</svg>`;
}

function renderMobileCalendarDay(y, titleEn, titleBn, date, ritual, timings) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="358" height="160" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(20, 20)">
      <rect width="110" height="24" rx="12" fill="${RED_SOFT}"/>
      <text x="55" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">${date}</text>
      <text x="0" y="52" fill="${TEXT_MAIN}" font-size="18" font-weight="900">${titleEn} • <tspan class="bengali" font-size="15">${titleBn}</tspan></text>
      <text x="0" y="78" fill="${TEXT_SEC}" font-size="13" font-weight="600">${ritual}</text>
      <text x="0" y="104" fill="${RED}" font-size="12" font-weight="700">⏱️ ${timings}</text>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 5. Web Mobile Planner Screen (390 x 1800)
// -------------------------------------------------------------------------
function generateMobilePlanner() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1800" viewBox="0 0 390 1800" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="1800" fill="${BG_CREAM}"/>
  ${renderMobileWebHeader()}

  <!-- Page Header -->
  <g id="Mobile_Planner_Header" transform="translate(16, 76)">
    <rect width="136" height="24" rx="12" fill="${RED_SOFT}"/>
    <text x="68" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">🔀 OPTIMIZER</text>
    <text x="0" y="52" fill="${TEXT_MAIN}" font-size="26" font-weight="900" letter-spacing="-0.5">Route Planner</text>
    <text x="0" y="74" fill="${TEXT_SEC}" font-size="13">Optimized pandal trail sequence.</text>

    <!-- Summary Metrics Pill -->
    <g transform="translate(0, 92)">
      <rect width="358" height="60" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <g transform="translate(20, 18)">
        <text x="0" y="14" fill="${TEXT_MUTED}" font-size="11">Total Distance</text>
        <text x="0" y="32" fill="${TEXT_MAIN}" font-size="15" font-weight="800">3.8 km</text>

        <text x="120" y="14" fill="${TEXT_MUTED}" font-size="11">Duration</text>
        <text x="120" y="32" fill="${TEXT_MAIN}" font-size="15" font-weight="800">3h 15m</text>

        <text x="230" y="14" fill="${TEXT_MUTED}" font-size="11">Pandals</text>
        <text x="230" y="32" fill="${RED}" font-size="15" font-weight="800">4 Stops</text>
      </g>
    </g>
  </g>

  <!-- STOPS LIST (STACKED) -->
  <g id="Mobile_Planner_Stops" transform="translate(16, 250)">
    ${renderMobilePlannerStop(0, 1, 'Bagbazar Sarbojanin', 'Start Point • Shyambazar Metro')}
    ${renderMobilePlannerStop(100, 2, 'Kumartuli Park', '800m walk from Stop 1')}
    ${renderMobilePlannerStop(200, 3, 'Sovabazar Rajbari', '450m walk from Stop 2')}
    ${renderMobilePlannerStop(300, 4, 'College Square', 'Metro Line 1 to Central')}

    <!-- Actions -->
    <g transform="translate(0, 420)">
      <rect width="358" height="46" rx="14" fill="${RED}"/>
      <text x="179" y="28" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Export Route to Maps</text>

      <rect y="56" width="358" height="46" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="179" y="84" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Share via WhatsApp</text>
    </g>
  </g>

  <!-- Authoritative Mobile Footer -->
  ${renderMobileFooter(1450, 390, false)}

  <!-- Fixed Mobile Bottom Navigation -->
  ${renderMobileBottomNav(1736, 390, 'Planner')}
</svg>`;
}

function renderMobilePlannerStop(y, idx, name, desc) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="358" height="84" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <circle cx="28" cy="42" r="14" fill="${RED}"/>
    <text x="28" y="47" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">${idx}</text>
    <g transform="translate(54, 24)">
      <text x="0" y="16" fill="${TEXT_MAIN}" font-size="15" font-weight="800">${name}</text>
      <text x="0" y="36" fill="${TEXT_MUTED}" font-size="11">${desc}</text>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 6. Web Mobile Metro Screen (390 x 1550)
// -------------------------------------------------------------------------
function generateMobileMetro() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1550" viewBox="0 0 390 1550" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="1550" fill="${BG_CREAM}"/>
  ${renderMobileWebHeader()}

  <!-- Page Header -->
  <g id="Mobile_Metro_Header" transform="translate(16, 76)">
    <rect width="124" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="62" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">🚇 TRANSIT GUIDE</text>
    <text x="0" y="60" fill="${TEXT_MAIN}" font-size="24" font-weight="900" letter-spacing="-0.5">Kolkata Metro Guide</text>
    <text x="0" y="82" fill="${TEXT_SEC}" font-size="13">Fastest route connectivity across Blue &amp; Green lines.</text>

    <!-- Notice -->
    <g transform="translate(0, 102)">
      <rect width="358" height="40" rx="10" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
      <text x="14" y="25" fill="#1e40af" font-size="11" font-weight="600">🕒 All-Night Metro: 24h trains during Saptami–Navami</text>
    </g>

    <!-- Line Switcher Tabs -->
    <g transform="translate(0, 156)">
      <rect width="174" height="38" rx="12" fill="#2563eb"/>
      <text x="87" y="24" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">🔵 Blue Line (Line 1)</text>

      <rect x="184" width="174" height="38" rx="12" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="271" y="24" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">🟢 Green Line (Line 2)</text>
    </g>
  </g>

  <!-- Station List -->
  <g id="Mobile_Metro_Stations" transform="translate(16, 290)">
    ${renderMobileMetroStation(0, 'Shyambazar', 'Bagbazar, Kumartuli, Tala Pratyay', '350m – 600m')}
    ${renderMobileMetroStation(96, 'Sovabazar Sutanuti', 'Sovabazar Rajbari, Ahiritola Park', '400m – 700m')}
    ${renderMobileMetroStation(192, 'Central / MG Road', 'College Square, Md. Ali Park', '500m – 800m')}
    ${renderMobileMetroStation(288, 'Kalighat', 'Deshapriya Park, Singhi Park', '600m – 1.2km')}
    ${renderMobileMetroStation(384, 'Netaji Bhavan', 'Bhowanipore 76 Pally, Chakraberia', '450m – 750m')}
  </g>

  <!-- Authoritative Mobile Footer -->
  ${renderMobileFooter(880, 390, false)}

  <!-- Fixed Mobile Bottom Navigation -->
  ${renderMobileBottomNav(1536, 390, 'More')}
</svg>`;
}

function renderMobileMetroStation(y, station, pandals, dist) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="358" height="84" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <circle cx="28" cy="42" r="10" fill="#2563eb"/>
    <circle cx="28" cy="42" r="4" fill="#FFFFFF"/>
    <g transform="translate(48, 16)">
      <text x="0" y="16" fill="${TEXT_MAIN}" font-size="15" font-weight="800">${station}</text>
      <text x="0" y="34" fill="${TEXT_MUTED}" font-size="11">Pandals: ${pandals}</text>
      <text x="0" y="52" fill="${RED}" font-size="11" font-weight="600">🚶 Distance: ${dist}</text>
    </g>
  </g>`;
}

// -------------------------------------------------------------------------
// 7. Web Mobile Music Screen (390 x 1650)
// -------------------------------------------------------------------------
function generateMobileMusic() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1650" viewBox="0 0 390 1650" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="1650" fill="${BG_CREAM}"/>
  ${renderMobileWebHeader()}

  <!-- Page Header -->
  <g id="Mobile_Music_Header" transform="translate(16, 76)">
    <rect width="168" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="84" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">🎵 SHARODIYA SOUNDSCAPE</text>
    <text x="0" y="60" fill="${TEXT_MAIN}" font-size="24" font-weight="900" letter-spacing="-0.5">Festive Puja Music</text>
    <text x="0" y="82" fill="${TEXT_SEC}" font-size="13">Traditional Dhak beats, Agomoni hymns &amp; stotras.</text>

    <!-- Choose Your Puja Mood Card -->
    <g transform="translate(0, 102)">
      <rect width="358" height="144" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="16" y="28" fill="${TEXT_MAIN}" font-size="14" font-weight="800">✨ Choose Your Puja Mood</text>
      
      <!-- Mood Pills Row 1 -->
      <g transform="translate(16, 42)">
        <rect width="84" height="30" rx="15" fill="${RED}"/>
        <text x="42" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All Moods</text>

        <rect x="92" width="124" height="30" rx="15" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="154" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Ritual &amp; Devotion</text>

        <rect x="224" width="102" height="30" rx="15" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="275" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Dhak Beats</text>
      </g>

      <!-- Mood Pills Row 2 -->
      <g transform="translate(16, 82)">
        <rect width="108" height="30" rx="15" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="54" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Pandal Hopping</text>

        <rect x="116" width="108" height="30" rx="15" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="170" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Bengali Festive</text>

        <rect x="232" width="94" height="30" rx="15" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="279" y="19" fill="${TEXT_MAIN}" font-size="11" font-weight="600" text-anchor="middle">Bisarjan</text>
      </g>
    </g>

    <!-- Search Input Bar -->
    <g transform="translate(0, 260)">
      <rect width="358" height="44" rx="12" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="16" y="27" font-size="15">🔍</text>
      <text x="42" y="27" fill="${TEXT_MUTED}" font-size="12">Search tracks, artists, rhythms...</text>
    </g>
  </g>

  <!-- Curated Audio Library Header -->
  <g transform="translate(16, 400)">
    <text x="0" y="0" fill="${TEXT_MAIN}" font-size="16" font-weight="800">Curated Audio Library (22)</text>
    <text x="358" y="0" fill="${TEXT_FAINT}" font-size="11" text-anchor="end">Verified Streams</text>

    <!-- Tracks List -->
    <g transform="translate(0, 16)">
      ${renderMobileAudioTrack(0, 'Sharodiya Dhak Dhwoni &amp; Kashi', 'Mamta Jagdish Dhody • Traditional', '01:39')}
      ${renderMobileAudioTrack(98, 'Sacred Shankha Naad (Aarti)', 'David Bolton • Dhak &amp; Shankha', '00:07')}
      ${renderMobileAudioTrack(196, 'Dhunuchi Naach Dhak Taal', 'Traditional Bengali Dhaki Ensemble', '04:00')}
      ${renderMobileAudioTrack(294, 'Bisarjan Dhak &amp; Asche Bochor', 'Babughat Immersion Procession', '01:39')}
    </g>
  </g>

  <!-- Authoritative Mobile Footer -->
  ${renderMobileFooter(920, 390, false)}

  <!-- Fixed Mobile Bottom Navigation -->
  ${renderMobileBottomNav(1636, 390, 'More')}
</svg>`;
}

function renderMobileAudioTrack(y, title, artist, duration) {
  return `
  <g transform="translate(0, ${y})">
    <rect width="358" height="86" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(16, 16)">
      <circle cx="22" cy="24" r="18" fill="${RED_SOFT}"/>
      <path d="M18 17 L28 24 L18 31 Z" fill="${RED}"/>
      <g transform="translate(52, 6)">
        <text x="0" y="15" fill="${TEXT_MAIN}" font-size="14" font-weight="800">${title}</text>
        <text x="0" y="34" fill="${TEXT_MUTED}" font-size="11">${artist}</text>
      </g>
      <text x="326" y="22" fill="${RED}" font-size="12" font-weight="700" text-anchor="end">${duration}</text>
      <text x="326" y="44" fill="${TEXT_FAINT}" font-size="14" text-anchor="end">🔖</text>
    </g>
  </g>`;
}

// Export and generate all 7 web mobile screens
console.log('Generating Web Mobile SVGs...');
fs.writeFileSync(path.join(MOBILE_DIR, '01_web_mobile_home.svg'), generateMobileHome());
fs.writeFileSync(path.join(MOBILE_DIR, '02_web_mobile_developer.svg'), generateMobileDeveloper());
fs.writeFileSync(path.join(MOBILE_DIR, '03_web_mobile_explore.svg'), generateMobileExplore());
fs.writeFileSync(path.join(MOBILE_DIR, '04_web_mobile_calendar.svg'), generateMobileCalendar());
fs.writeFileSync(path.join(MOBILE_DIR, '05_web_mobile_planner.svg'), generateMobilePlanner());
fs.writeFileSync(path.join(MOBILE_DIR, '06_web_mobile_metro.svg'), generateMobileMetro());
fs.writeFileSync(path.join(MOBILE_DIR, '07_web_mobile_music.svg'), generateMobileMusic());
console.log('Web Mobile SVGs generated successfully in:', MOBILE_DIR);

module.exports = {
  generateMobileHome,
  generateMobileDeveloper,
  generateMobileExplore,
  generateMobileCalendar,
  generateMobilePlanner,
  generateMobileMetro,
  generateMobileMusic,
};
