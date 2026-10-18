const fs = require('fs');
const path = require('path');
const {
  EXPORTS_DIR,
  IMAGES,
  COLORS,
  SVG_FONTS_AND_STYLES
} = require('./authentic-tokens-and-assets');

const MOBILE_DIR = path.join(EXPORTS_DIR, 'web-mobile');
if (!fs.existsSync(MOBILE_DIR)) fs.mkdirSync(MOBILE_DIR, { recursive: true });

// Mobile Web Sticky Header (390 x 56)
function renderMobileWebHeader() {
  return `
  <!-- STICKY MOBILE WEB HEADER (56px) -->
  <g id="Header_Mobile_Web">
    <rect width="390" height="56" fill="${COLORS.darkBg}" fill-opacity="0.96"/>
    <line x1="0" y1="56" x2="390" y2="56" stroke="${COLORS.darkBorder}" stroke-width="1"/>

    <!-- Left Brand -->
    <g transform="translate(16, 16)">
      <text x="0" y="20" fill="${COLORS.red}" font-size="20" font-weight="900" letter-spacing="-0.5" class="brand">PujoPath</text>
    </g>

    <!-- Right Controls -->
    <g id="Header_Mobile_Controls" transform="translate(180, 11)">
      <!-- App Download Button (Red Pill) -->
      <g id="App_Download_Pill">
        <rect width="66" height="34" rx="10" fill="${COLORS.red}"/>
        <text x="33" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">📥 App</text>
      </g>

      <!-- Theme Mode Toggle -->
      <g id="Theme_Toggle_Mob" transform="translate(74, 0)">
        <rect width="34" height="34" rx="10" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="17" y="22" fill="${COLORS.darkTextMuted}" font-size="14" text-anchor="middle">☼</text>
      </g>

      <!-- Language Toggle Pill -->
      <g id="Lang_Toggle_Mob" transform="translate(116, 0)">
        <rect width="48" height="34" rx="10" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="24" y="22" fill="${COLORS.red}" font-size="11" font-weight="800" text-anchor="middle">EN</text>
      </g>

      <!-- Saved Favorites Heart -->
      <g id="Favorites_Mob" transform="translate(172, 0)">
        <rect width="34" height="34" rx="10" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="17" y="22" fill="${COLORS.darkTextMuted}" font-size="14" text-anchor="middle">♡</text>
      </g>
    </g>
  </g>
  `;
}

// Mobile Bottom 5-Tab Navigation (390 x 64)
function renderMobileBottomNav(activeTab = 'Home', yPos = 1686) {
  const tabs = [
    { name: 'Home', icon: '🏠', active: activeTab === 'Home' },
    { name: 'Explore', icon: '🔍', active: activeTab === 'Explore' },
    { name: 'Map', icon: '📍', active: activeTab === 'Map' },
    { name: 'Planner', icon: '🔀', active: activeTab === 'Planner' },
    { name: 'More', icon: '☰', active: activeTab === 'More' }
  ];

  let tabsSvg = '';
  tabs.forEach((t, i) => {
    const x = i * 78;
    const color = t.active ? COLORS.red : COLORS.darkTextMuted;
    const bg = t.active ? COLORS.redSoftDark : 'transparent';
    const weight = t.active ? '800' : '500';
    tabsSvg += `
      <g transform="translate(${x}, 4)">
        <rect x="12" y="2" width="54" height="48" rx="12" fill="${bg}"/>
        <text x="39" y="24" font-size="16" text-anchor="middle">${t.icon}</text>
        <text x="39" y="42" fill="${color}" font-size="10" font-weight="${weight}" text-anchor="middle">${t.name}</text>
      </g>
    `;
  });

  return `
  <!-- FIXED MOBILE BOTTOM NAVIGATION BAR (y=${yPos}) -->
  <g id="Mobile_Bottom_Nav" transform="translate(0, ${yPos})">
    <rect width="390" height="64" fill="${COLORS.darkBg}" fill-opacity="0.98"/>
    <line x1="0" y1="0" x2="390" y2="0" stroke="${COLORS.darkBorder}" stroke-width="1"/>
    ${tabsSvg}
  </g>
  `;
}

// Floating Audio Mini-Player Bar (Above Bottom Nav)
function renderMobileAudioBar(yPos = 1630) {
  return `
  <!-- FLOATING AUDIO MINI-PLAYER BAR (y=${yPos}) -->
  <g id="Mobile_Floating_Audio_Bar" transform="translate(16, ${yPos})">
    <rect width="358" height="48" rx="14" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
    <g transform="translate(12, 8)">
      <clipPath id="m-audio-thumb"><rect width="32" height="32" rx="8"/></clipPath>
      <g clip-path="url(#m-audio-thumb)">
        <image href="${IMAGES.miniplayer}" width="32" height="32" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <text x="44" y="14" fill="${COLORS.darkTextMain}" font-size="11" font-weight="700">🌸 Sacred Sandhya Aarti</text>
      <text x="44" y="27" fill="${COLORS.darkTextMuted}" font-size="9">Belur Math Dhak &amp; Shankha Recitation</text>

      <g transform="translate(260, 4)">
        <rect width="66" height="24" rx="8" fill="${COLORS.redSoftDark}" stroke="${COLORS.redBorderDark}" stroke-width="1"/>
        <text x="33" y="16" fill="${COLORS.red}" font-size="10" font-weight="800" text-anchor="middle">⏸ Pause</text>
      </g>
    </g>
  </g>
  `;
}

// Mobile Footer Attribution
function renderMobileFooter(yPos = 1530) {
  return `
  <!-- MOBILE FOOTER (y=${yPos}) -->
  <g id="Mobile_Footer" transform="translate(16, ${yPos})">
    <rect width="358" height="74" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
    <g transform="translate(20, 22)">
      <text x="159" y="14" fill="${COLORS.darkTextSecondary}" font-size="12" font-weight="700" text-anchor="middle">Made by Soumik &amp; Moumita with ❤️</text>
      <text x="159" y="34" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">Kolkata Durga Puja 2026 • 100% Free &amp; Open</text>
    </g>
  </g>
  `;
}

// -------------------------------------------------------------------------
// 1. Mobile Home Screen (390 x 1850)
// -------------------------------------------------------------------------
function generateMobileHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1850" viewBox="0 0 390 1850" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="390" height="1850" fill="${COLORS.darkBg}"/>

  <!-- Background Festive Artwork Overlay -->
  <g id="Mobile_Bg_Artwork" opacity="0.18">
    <image href="${IMAGES.ghibliBg}" width="390" height="460" preserveAspectRatio="xMidYMid slice"/>
  </g>

  <defs>
    <clipPath id="m-hl-1"><rect width="90" height="68" rx="10"/></clipPath>
    <clipPath id="m-hl-2"><rect width="90" height="68" rx="10"/></clipPath>
    <clipPath id="m-hl-3"><rect width="90" height="68" rx="10"/></clipPath>
  </defs>

  ${renderMobileWebHeader()}

  <!-- 1. Mobile Hero Card -->
  <g id="Mobile_Hero_Card" transform="translate(16, 72)">
    <rect width="358" height="264" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
    
    <g transform="translate(20, 20)">
      <!-- Countdown Pill -->
      <g id="Countdown_Pill">
        <rect width="160" height="28" rx="14" fill="${COLORS.redSoftDark}" stroke="${COLORS.redBorderDark}" stroke-width="1"/>
        <text x="12" y="19" font-size="13">🗓️</text>
        <text x="32" y="19" fill="${COLORS.red}" font-size="11" font-weight="700">180 days to Puja</text>
      </g>

      <!-- Headline & Subtitle -->
      <text x="0" y="70" fill="${COLORS.darkTextMain}" font-size="26" font-weight="900" letter-spacing="-0.5">Your Puja, made simple.</text>
      <text x="0" y="96" fill="${COLORS.darkTextMuted}" font-size="13">Find the pandals you love, build a route,</text>
      <text x="0" y="114" fill="${COLORS.darkTextMuted}" font-size="13">and head out with confidence.</text>

      <!-- Action Buttons -->
      <g transform="translate(0, 134)">
        <rect width="318" height="42" rx="12" fill="${COLORS.red}"/>
        <text x="159" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">🔍 Find pandals →</text>

        <g transform="translate(0, 50)">
          <rect width="318" height="42" rx="12" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="159" y="26" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700" text-anchor="middle">🧭 Build a route</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 2. Quick Access 2-Column Grid (6 cards) -->
  <g id="Mobile_Quick_Access" transform="translate(16, 356)">
    <text x="0" y="0" fill="${COLORS.darkTextMain}" font-size="16" font-weight="800">Quick Access</text>

    <g transform="translate(0, 14)">
      <!-- Map -->
      <g transform="translate(0, 0)">
        <rect width="174" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="${COLORS.redSoftDark}"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">📍</text>
        <text x="54" y="32" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Map</text>
        <text x="54" y="47" fill="${COLORS.darkTextMuted}" font-size="10">All pandals</text>
      </g>

      <!-- Route Planner -->
      <g transform="translate(184, 0)">
        <rect width="174" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="rgba(13, 148, 136, 0.18)"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">🔀</text>
        <text x="54" y="32" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Planner</text>
        <text x="54" y="47" fill="${COLORS.darkTextMuted}" font-size="10">Optimize trail</text>
      </g>

      <!-- Metro Guide -->
      <g transform="translate(0, 84)">
        <rect width="174" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="rgba(37, 99, 235, 0.18)"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">🚇</text>
        <text x="54" y="32" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Metro Guide</text>
        <text x="54" y="47" fill="${COLORS.darkTextMuted}" font-size="10">Station lines</text>
      </g>

      <!-- Calendar -->
      <g transform="translate(184, 84)">
        <rect width="174" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="rgba(234, 88, 12, 0.18)"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">📅</text>
        <text x="54" y="32" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Calendar</text>
        <text x="54" y="47" fill="${COLORS.darkTextMuted}" font-size="10">Sandhi puja</text>
      </g>

      <!-- Puja Music -->
      <g transform="translate(0, 168)">
        <rect width="174" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="rgba(124, 58, 237, 0.18)"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">🎵</text>
        <text x="54" y="32" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Puja Music</text>
        <text x="54" y="47" fill="${COLORS.darkTextMuted}" font-size="10">Chandi Path</text>
      </g>

      <!-- Mahalaya -->
      <g transform="translate(184, 168)">
        <rect width="174" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="12" y="14" width="34" height="34" rx="10" fill="rgba(217, 119, 6, 0.18)"/>
        <text x="29" y="37" font-size="16" text-anchor="middle">✨</text>
        <text x="54" y="32" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Mahalaya</text>
        <text x="54" y="47" fill="${COLORS.darkTextMuted}" font-size="10">Dawn stream</text>
      </g>
    </g>
  </g>

  <!-- 3. Curated Puja Highlights (3 Stacked Cards) -->
  <g id="Mobile_Highlights" transform="translate(16, 640)">
    <g transform="translate(0, 0)">
      <text x="0" y="0" fill="${COLORS.red}" font-size="16" font-weight="900">✣</text>
      <text x="18" y="0" fill="${COLORS.darkTextMain}" font-size="16" font-weight="800">Puja Highlights</text>
      <text x="358" y="0" fill="${COLORS.red}" font-size="12" font-weight="700" text-anchor="end">View all →</text>
    </g>

    <g transform="translate(0, 16)">
      <!-- Card 1 -->
      <g transform="translate(0, 0)">
        <rect width="358" height="90" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <g transform="translate(12, 11)" clip-path="url(#m-hl-1)">
          <image href="${IMAGES.sovabazar}" width="90" height="68" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(114, 18)">
          <text x="0" y="14" fill="${COLORS.red}" font-size="10" font-weight="700">TRADITIONS &amp; ART</text>
          <text x="0" y="34" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Traditions &amp; Pandal Art</text>
          <text x="0" y="52" fill="${COLORS.darkTextMuted}" font-size="11">Bengal's heritage bonedi bari installations.</text>
        </g>
      </g>

      <!-- Card 2 -->
      <g transform="translate(0, 102)">
        <rect width="358" height="90" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <g transform="translate(12, 11)" clip-path="url(#m-hl-2)">
          <image href="${IMAGES.bagbazar}" width="90" height="68" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(114, 18)">
          <text x="0" y="14" fill="${COLORS.gold}" font-size="10" font-weight="700">SACRED ALMANAC</text>
          <text x="0" y="34" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Sacred Almanac &amp; Timings</text>
          <text x="0" y="52" fill="${COLORS.darkTextMuted}" font-size="11">Ashtami Sandhi Puja schedules.</text>
        </g>
      </g>

      <!-- Card 3 -->
      <g transform="translate(0, 204)">
        <rect width="358" height="90" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <g transform="translate(12, 11)" clip-path="url(#m-hl-3)">
          <image href="${IMAGES.collegeSquare}" width="90" height="68" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(114, 18)">
          <text x="0" y="14" fill="${COLORS.blue}" font-size="10" font-weight="700">PUJO ROUTES</text>
          <text x="0" y="34" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Pujo Evenings &amp; Routes</text>
          <text x="0" y="52" fill="${COLORS.darkTextMuted}" font-size="11">Illumination &amp; evening hopping.</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 4. Feature Pills 2-Column Grid -->
  <g id="Mobile_Feature_Pills" transform="translate(16, 980)">
    <g transform="translate(0, 0)">
      <!-- Pill 1 -->
      <g transform="translate(0, 0)">
        <rect width="174" height="52" rx="12" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="12" y="32" font-size="16">✨</text>
        <text x="36" y="24" fill="${COLORS.darkTextMain}" font-size="11" font-weight="700">Ultra Simple</text>
        <text x="36" y="38" fill="${COLORS.darkTextMuted}" font-size="9">Only what you need</text>
      </g>
      <!-- Pill 2 -->
      <g transform="translate(184, 0)">
        <rect width="174" height="52" rx="12" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="12" y="32" font-size="16">⚡</text>
        <text x="36" y="24" fill="${COLORS.darkTextMain}" font-size="11" font-weight="700">Lightning Fast</text>
        <text x="36" y="38" fill="${COLORS.darkTextMuted}" font-size="9">Smooth experience</text>
      </g>
      <!-- Pill 3 -->
      <g transform="translate(0, 60)">
        <rect width="174" height="52" rx="12" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="12" y="32" font-size="16">📱</text>
        <text x="36" y="24" fill="${COLORS.darkTextMain}" font-size="11" font-weight="700">Fully Responsive</text>
        <text x="36" y="38" fill="${COLORS.darkTextMuted}" font-size="9">All devices</text>
      </g>
      <!-- Pill 4 -->
      <g transform="translate(184, 60)">
        <rect width="174" height="52" rx="12" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="12" y="32" font-size="16">🌸</text>
        <text x="36" y="24" fill="${COLORS.darkTextMain}" font-size="11" font-weight="700">100% Free</text>
        <text x="36" y="38" fill="${COLORS.darkTextMuted}" font-size="9">Open community</text>
      </g>
    </g>
  </g>

  <!-- Mobile Footer -->
  ${renderMobileFooter(1140)}

  <!-- Floating Audio Mini-Player Bar -->
  ${renderMobileAudioBar(1710)}

  <!-- Bottom Navigation -->
  ${renderMobileBottomNav('Home', 1770)}
</svg>`;
}

// -------------------------------------------------------------------------
// 2. Mobile Developer Screen (390 x 1500)
// -------------------------------------------------------------------------
function generateMobileDeveloper() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1500" viewBox="0 0 390 1500" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="390" height="1500" fill="${COLORS.darkBg}"/>

  <defs>
    <clipPath id="m-moumita-clip"><rect width="80" height="80" rx="16"/></clipPath>
    <clipPath id="m-soumik-clip"><rect width="80" height="80" rx="16"/></clipPath>
  </defs>

  ${renderMobileWebHeader()}

  <g transform="translate(16, 75)">
    <text x="0" y="24" fill="${COLORS.darkTextMain}" font-size="24" font-weight="900">Meet the Developers</text>
    <text x="0" y="48" fill="${COLORS.darkTextMuted}" font-size="12">Crafted with love for Kolkata's Durga Puja devotees.</text>

    <!-- Moumita Card -->
    <g transform="translate(0, 70)">
      <rect width="358" height="340" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <g clip-path="url(#m-moumita-clip)">
          <image href="${IMAGES.moumita}" width="80" height="80" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(96, 10)">
          <text x="0" y="16" fill="${COLORS.darkTextMain}" font-size="20" font-weight="800">Moumita</text>
          <rect x="0" y="26" width="140" height="22" rx="6" fill="${COLORS.redSoftDark}"/>
          <text x="70" y="41" fill="${COLORS.red}" font-size="10" font-weight="700" text-anchor="middle">UI &amp; Frontend Lead</text>
        </g>

        <text x="0" y="115" fill="${COLORS.darkTextSecondary}" font-size="12">
          Leads design systems, typography, and visual accessibility.
        </text>
        <text x="0" y="135" fill="${COLORS.darkTextSecondary}" font-size="12">
          Focused on intuitive, aesthetic pandal discovery.
        </text>

        <!-- Tags -->
        <g transform="translate(0, 165)">
          <rect width="90" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="45" y="16" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">Design Systems</text>

          <rect x="98" width="80" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="138" y="16" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">TailwindCSS</text>

          <rect x="186" width="70" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="221" y="16" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">Figma UX</text>
        </g>

        <g transform="translate(0, 215)">
          <rect width="318" height="40" rx="12" fill="${COLORS.linkedin}"/>
          <text x="159" y="25" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Connect on LinkedIn ↗</text>
        </g>
      </g>
    </g>

    <!-- Soumik Card -->
    <g transform="translate(0, 430)">
      <rect width="358" height="340" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <g clip-path="url(#m-soumik-clip)">
          <image href="${IMAGES.soumik}" width="80" height="80" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(96, 10)">
          <text x="0" y="16" fill="${COLORS.darkTextMain}" font-size="20" font-weight="800">Soumik</text>
          <rect x="0" y="26" width="150" height="22" rx="6" fill="rgba(37, 99, 235, 0.18)"/>
          <text x="75" y="41" fill="${COLORS.blue}" font-size="10" font-weight="700" text-anchor="middle">Backend &amp; Systems Lead</text>
        </g>

        <text x="0" y="115" fill="${COLORS.darkTextSecondary}" font-size="12">
          Architects route optimizer, geospatial algorithms, and
        </text>
        <text x="0" y="135" fill="${COLORS.darkTextSecondary}" font-size="12">
          offline-first Android Capacitor pipeline.
        </text>

        <g transform="translate(0, 165)">
          <rect width="90" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="45" y="16" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">Next.js &amp; Node</text>

          <rect x="98" width="100" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="148" y="16" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">Capacitor Android</text>

          <rect x="206" width="80" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="246" y="16" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">Geo-Routing</text>
        </g>

        <g transform="translate(0, 215)">
          <rect width="318" height="40" rx="12" fill="${COLORS.linkedin}"/>
          <text x="159" y="25" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Connect on LinkedIn ↗</text>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileFooter(870)}
  ${renderMobileAudioBar(1360)}
  ${renderMobileBottomNav('More', 1420)}
</svg>`;
}

// -------------------------------------------------------------------------
// 3. Mobile Explore Screen (390 x 1950)
// -------------------------------------------------------------------------
function generateMobileExplore() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1950" viewBox="0 0 390 1950" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="390" height="1950" fill="${COLORS.darkBg}"/>

  <defs>
    <clipPath id="m-exp-1"><rect width="358" height="180" rx="18"/></clipPath>
    <clipPath id="m-exp-2"><rect width="358" height="180" rx="18"/></clipPath>
    <clipPath id="m-exp-3"><rect width="358" height="180" rx="18"/></clipPath>
    <clipPath id="m-exp-4"><rect width="358" height="180" rx="18"/></clipPath>
  </defs>

  ${renderMobileWebHeader()}

  <g transform="translate(16, 75)">
    <text x="0" y="22" fill="${COLORS.darkTextMain}" font-size="24" font-weight="900">Explore Pandals</text>
    <text x="0" y="44" fill="${COLORS.darkTextMuted}" font-size="12">48+ Iconic Pandals across Kolkata.</text>

    <!-- Search Input Box -->
    <g transform="translate(0, 60)">
      <rect width="358" height="44" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="16" y="27" font-size="14">🔍</text>
      <text x="42" y="27" fill="${COLORS.darkTextMuted}" font-size="12">Search pandal, zone, metro...</text>
    </g>

    <!-- Zone Filter Pills (Horizontal) -->
    <g transform="translate(0, 118)">
      <rect width="60" height="30" rx="8" fill="${COLORS.red}"/>
      <text x="30" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All (48)</text>

      <rect x="68" width="80" height="30" rx="8" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="108" y="19" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">North (16)</text>

      <rect x="156" width="80" height="30" rx="8" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="196" y="19" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">South (18)</text>

      <rect x="244" width="70" height="30" rx="8" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="279" y="19" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Central (8)</text>
    </g>

    <!-- Pandal Cards Stack -->
    <!-- Card 1: Bagbazar -->
    <g transform="translate(0, 165)">
      <rect width="358" height="380" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g clip-path="url(#m-exp-1)">
        <image href="${IMAGES.bagbazar}" width="358" height="180" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <g transform="translate(12, 12)">
        <rect width="84" height="22" rx="6" fill="rgba(0,0,0,0.65)"/>
        <text x="42" y="15" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <g transform="translate(16, 200)">
        <text x="0" y="14" fill="${COLORS.red}" font-size="10" font-weight="700">NORTH KOLKATA • HERITAGE</text>
        <text x="0" y="38" fill="${COLORS.darkTextMain}" font-size="18" font-weight="800">Bagbazar Sarbojanin</text>
        <text x="0" y="60" fill="${COLORS.darkTextMuted}" font-size="12">Century-old traditional Ekchala protima and daker saaj.</text>

        <g transform="translate(0, 80)">
          <rect width="80" height="22" rx="6" fill="${COLORS.redSoftDark}"/>
          <text x="40" y="15" fill="${COLORS.red}" font-size="10" font-weight="700" text-anchor="middle">High Crowd</text>

          <rect x="90" width="120" height="22" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="150" y="15" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">🚇 Shyambazar (450m)</text>
        </g>

        <g transform="translate(0, 120)">
          <rect width="326" height="40" rx="12" fill="${COLORS.red}"/>
          <text x="163" y="25" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 2: Kumartuli Park -->
    <g transform="translate(0, 565)">
      <rect width="358" height="380" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g clip-path="url(#m-exp-2)">
        <image href="${IMAGES.kumartuli}" width="358" height="180" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <g transform="translate(12, 12)">
        <rect width="84" height="22" rx="6" fill="rgba(0,0,0,0.65)"/>
        <text x="42" y="15" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <g transform="translate(16, 200)">
        <text x="0" y="14" fill="${COLORS.teal}" font-size="10" font-weight="700">NORTH KOLKATA • ART &amp; SCULPTURE</text>
        <text x="0" y="38" fill="${COLORS.darkTextMain}" font-size="18" font-weight="800">Kumartuli Park</text>
        <text x="0" y="60" fill="${COLORS.darkTextMuted}" font-size="12">Artisan epicenter with visionary contemporary idol sculpting.</text>

        <g transform="translate(0, 80)">
          <rect width="90" height="22" rx="6" fill="rgba(13, 148, 136, 0.18)"/>
          <text x="45" y="15" fill="${COLORS.teal}" font-size="10" font-weight="700" text-anchor="middle">Moderate Crowd</text>

          <rect x="100" width="120" height="22" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="160" y="15" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">🚇 Sovabazar (600m)</text>
        </g>

        <g transform="translate(0, 120)">
          <rect width="326" height="40" rx="12" fill="${COLORS.red}"/>
          <text x="163" y="25" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 3: Sovabazar Rajbari -->
    <g transform="translate(0, 965)">
      <rect width="358" height="380" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g clip-path="url(#m-exp-3)">
        <image href="${IMAGES.sovabazar}" width="358" height="180" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <g transform="translate(12, 12)">
        <rect width="84" height="22" rx="6" fill="rgba(0,0,0,0.65)"/>
        <text x="42" y="15" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <g transform="translate(16, 200)">
        <text x="0" y="14" fill="${COLORS.gold}" font-size="10" font-weight="700">NORTH KOLKATA • RAJBARI HERITAGE</text>
        <text x="0" y="38" fill="${COLORS.darkTextMain}" font-size="18" font-weight="800">Sovabazar Rajbari</text>
        <text x="0" y="60" fill="${COLORS.darkTextMuted}" font-size="12">Founded in 1757 in the grand Natmandir courtyard.</text>

        <g transform="translate(0, 80)">
          <rect width="80" height="22" rx="6" fill="${COLORS.redSoftDark}"/>
          <text x="40" y="15" fill="${COLORS.red}" font-size="10" font-weight="700" text-anchor="middle">High Crowd</text>

          <rect x="90" width="120" height="22" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="150" y="15" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">🚇 Sovabazar (350m)</text>
        </g>

        <g transform="translate(0, 120)">
          <rect width="326" height="40" rx="12" fill="${COLORS.red}"/>
          <text x="163" y="25" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 4: Suruchi Sangha -->
    <g transform="translate(0, 1365)">
      <rect width="358" height="380" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g clip-path="url(#m-exp-4)">
        <image href="${IMAGES.suruchi}" width="358" height="180" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <g transform="translate(12, 12)">
        <rect width="84" height="22" rx="6" fill="rgba(0,0,0,0.65)"/>
        <text x="42" y="15" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <g transform="translate(16, 200)">
        <text x="0" y="14" fill="${COLORS.blue}" font-size="10" font-weight="700">SOUTH KOLKATA • STATE THEME</text>
        <text x="0" y="38" fill="${COLORS.darkTextMain}" font-size="18" font-weight="800">Suruchi Sangha</text>
        <text x="0" y="60" fill="${COLORS.darkTextMuted}" font-size="12">Indian cultural state representations and grand outdoor pavilions.</text>

        <g transform="translate(0, 80)">
          <rect width="80" height="22" rx="6" fill="${COLORS.redSoftDark}"/>
          <text x="40" y="15" fill="${COLORS.red}" font-size="10" font-weight="700" text-anchor="middle">High Crowd</text>

          <rect x="90" width="120" height="22" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="150" y="15" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">🚇 Kalighat (1.1km)</text>
        </g>

        <g transform="translate(0, 120)">
          <rect width="326" height="40" rx="12" fill="${COLORS.red}"/>
          <text x="163" y="25" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileAudioBar(1810)}
  ${renderMobileBottomNav('Explore', 1870)}
</svg>`;
}

// -------------------------------------------------------------------------
// 4. Mobile Calendar Screen (390 x 1650)
// -------------------------------------------------------------------------
function generateMobileCalendar() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1650" viewBox="0 0 390 1650" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="390" height="1650" fill="${COLORS.darkBg}"/>

  ${renderMobileWebHeader()}

  <g transform="translate(16, 75)">
    <text x="0" y="24" fill="${COLORS.darkTextMain}" font-size="24" font-weight="900">Durga Puja 2026 Calendar</text>
    <text x="0" y="46" fill="${COLORS.darkTextMuted}" font-size="12">Auspicious Tithis, Timings &amp; Pushpanjali Muhurats.</text>

    <!-- Sandhi Puja Highlight -->
    <g transform="translate(0, 65)">
      <rect width="358" height="150" rx="18" fill="${COLORS.darkCard}" stroke="${COLORS.gold}" stroke-width="1.5"/>
      <g transform="translate(16, 16)">
        <rect width="130" height="22" rx="6" fill="rgba(217, 119, 6, 0.2)"/>
        <text x="65" y="15" fill="${COLORS.gold}" font-size="10" font-weight="800" text-anchor="middle">✨ AUSPICIOUS HIGHLIGHT</text>
        <text x="0" y="44" fill="${COLORS.darkTextMain}" font-size="17" font-weight="900">Maha Ashtami Sandhi Puja</text>
        <text x="0" y="64" fill="${COLORS.darkTextMuted}" font-size="11">108 Sacred Diyas &amp; Lotus Offering</text>

        <rect y="78" width="326" height="42" rx="10" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="163" y="96" fill="${COLORS.gold}" font-size="12" font-weight="800" text-anchor="middle">Window: 11:48 PM – 12:36 AM</text>
        <text x="163" y="112" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">Pushpanjali at 12:20 AM</text>
      </g>
    </g>

    <!-- Daily Tithis -->
    <g transform="translate(0, 235)">
      <!-- Sasthi -->
      <g transform="translate(0, 0)">
        <rect width="358" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="16" y="32" fill="${COLORS.red}" font-size="15" font-weight="800">Maha Sasthi</text>
        <text x="16" y="52" fill="${COLORS.darkTextMuted}" font-size="11">Bodhon, Amantran &amp; Adhibas</text>
        <text x="342" y="42" fill="${COLORS.darkTextSecondary}" font-size="11" text-anchor="end">Eve 6:45 PM</text>
      </g>

      <!-- Saptami -->
      <g transform="translate(0, 84)">
        <rect width="358" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="16" y="32" fill="${COLORS.teal}" font-size="15" font-weight="800">Maha Saptami</text>
        <text x="16" y="52" fill="${COLORS.darkTextMuted}" font-size="11">Nabapatrika Snan (Kola Bou)</text>
        <text x="342" y="42" fill="${COLORS.darkTextSecondary}" font-size="11" text-anchor="end">Morn 6:00 AM</text>
      </g>

      <!-- Ashtami -->
      <g transform="translate(0, 168)">
        <rect width="358" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.gold}" stroke-width="1"/>
        <text x="16" y="32" fill="${COLORS.gold}" font-size="15" font-weight="800">Maha Ashtami</text>
        <text x="16" y="52" fill="${COLORS.darkTextMuted}" font-size="11">Pushpanjali &amp; Kumari Puja</text>
        <text x="342" y="42" fill="${COLORS.darkTextSecondary}" font-size="11" text-anchor="end">Morn 9:30 AM</text>
      </g>

      <!-- Navami -->
      <g transform="translate(0, 252)">
        <rect width="358" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="16" y="32" fill="${COLORS.blue}" font-size="15" font-weight="800">Maha Navami</text>
        <text x="16" y="52" fill="${COLORS.darkTextMuted}" font-size="11">Maha Aarti &amp; Dhunuchi Dance</text>
        <text x="342" y="42" fill="${COLORS.darkTextSecondary}" font-size="11" text-anchor="end">Eve 7:00 PM</text>
      </g>

      <!-- Dashami -->
      <g transform="translate(0, 336)">
        <rect width="358" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="16" y="32" fill="${COLORS.red}" font-size="15" font-weight="800">Bijoya Dashami</text>
        <text x="16" y="52" fill="${COLORS.darkTextMuted}" font-size="11">Sindoor Khela &amp; Ghat Bisarjan</text>
        <text x="342" y="42" fill="${COLORS.darkTextSecondary}" font-size="11" text-anchor="end">Aft 4:00 PM</text>
      </g>
    </g>
  </g>

  ${renderMobileFooter(740)}
  ${renderMobileAudioBar(1510)}
  ${renderMobileBottomNav('More', 1570)}
</svg>`;
}

// -------------------------------------------------------------------------
// 5. Mobile Route Planner Screen (390 x 1550)
// -------------------------------------------------------------------------
function generateMobilePlanner() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1550" viewBox="0 0 390 1550" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="390" height="1550" fill="${COLORS.darkBg}"/>

  ${renderMobileWebHeader()}

  <g transform="translate(16, 75)">
    <text x="0" y="24" fill="${COLORS.darkTextMain}" font-size="24" font-weight="900">Route Planner</text>
    <text x="0" y="46" fill="${COLORS.darkTextMuted}" font-size="12">Optimized trail with crowd &amp; metro integration.</text>

    <!-- Metrics Bar -->
    <g transform="translate(0, 65)">
      <rect width="358" height="76" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g transform="translate(16, 16)">
        <text x="0" y="14" fill="${COLORS.red}" font-size="10" font-weight="800">NORTH TRAIL</text>
        <text x="0" y="36" fill="${COLORS.darkTextMain}" font-size="16" font-weight="800">Heritage Trail • 4 Pandals</text>
        <text x="326" y="36" fill="${COLORS.darkTextMuted}" font-size="12" text-anchor="end">3.4 km • ~2h 15m</text>
      </g>
    </g>

    <!-- Stop 1 -->
    <g transform="translate(0, 160)">
      <rect width="358" height="70" rx="14" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <circle cx="28" cy="35" r="12" fill="${COLORS.red}"/>
      <text x="28" y="39" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle">1</text>
      <text x="50" y="30" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Bagbazar Sarbojanin</text>
      <text x="50" y="48" fill="${COLORS.darkTextMuted}" font-size="10">Start • Shyambazar Metro • Est. 35 mins</text>
    </g>
    <text x="28" y="250" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">🚶 8 mins (600m)</text>

    <!-- Stop 2 -->
    <g transform="translate(0, 265)">
      <rect width="358" height="70" rx="14" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <circle cx="28" cy="35" r="12" fill="${COLORS.teal}"/>
      <text x="28" y="39" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle">2</text>
      <text x="50" y="30" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Kumartuli Park</text>
      <text x="50" y="48" fill="${COLORS.darkTextMuted}" font-size="10">Artisan Sculptures • Est. 40 mins</text>
    </g>
    <text x="28" y="355" fill="${COLORS.darkTextMuted}" font-size="10" text-anchor="middle">🚶 12 mins (850m)</text>

    <!-- Stop 3 -->
    <g transform="translate(0, 370)">
      <rect width="358" height="70" rx="14" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <circle cx="28" cy="35" r="12" fill="${COLORS.gold}"/>
      <text x="28" y="39" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle">3</text>
      <text x="50" y="30" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Sovabazar Rajbari</text>
      <text x="50" y="48" fill="${COLORS.darkTextMuted}" font-size="10">Bonedi Bari Courtyard • Est. 45 mins</text>
    </g>

    <!-- Action Buttons -->
    <g transform="translate(0, 465)">
      <rect width="358" height="44" rx="12" fill="${COLORS.red}"/>
      <text x="179" y="27" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">🗺️ Export Trail to Google Maps</text>

      <g transform="translate(0, 54)">
        <rect width="358" height="44" rx="12" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="179" y="27" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700" text-anchor="middle">🔗 Share Trail with Friends</text>
      </g>
    </g>
  </g>

  ${renderMobileFooter(680)}
  ${renderMobileAudioBar(1410)}
  ${renderMobileBottomNav('Planner', 1470)}
</svg>`;
}

// -------------------------------------------------------------------------
// 6. Mobile Metro Guide Screen (390 x 1550)
// -------------------------------------------------------------------------
function generateMobileMetro() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1550" viewBox="0 0 390 1550" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="390" height="1550" fill="${COLORS.darkBg}"/>

  ${renderMobileWebHeader()}

  <g transform="translate(16, 75)">
    <text x="0" y="24" fill="${COLORS.darkTextMain}" font-size="24" font-weight="900">Metro Guide &amp; Timetable</text>
    <text x="0" y="46" fill="${COLORS.darkTextMuted}" font-size="12">Night-long special puja services across Kolkata.</text>

    <!-- Night Alert Banner -->
    <g transform="translate(0, 65)">
      <rect width="358" height="64" rx="14" fill="${COLORS.redSoftDark}" stroke="${COLORS.redBorderDark}" stroke-width="1"/>
      <text x="14" y="38" font-size="16">🚇</text>
      <text x="42" y="28" fill="${COLORS.red}" font-size="12" font-weight="800">ALL-NIGHT SPECIAL PUJA TRAINS</text>
      <text x="42" y="46" fill="${COLORS.darkTextSecondary}" font-size="10">Operating every 12-15 mins past midnight.</text>
    </g>

    <!-- Blue Line Card -->
    <g transform="translate(0, 145)">
      <rect width="358" height="230" rx="18" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g transform="translate(16, 16)">
        <rect width="84" height="22" rx="6" fill="rgba(37, 99, 235, 0.2)"/>
        <text x="42" y="15" fill="${COLORS.blue}" font-size="10" font-weight="800" text-anchor="middle">BLUE LINE 1</text>
        <text x="0" y="48" fill="${COLORS.darkTextMain}" font-size="16" font-weight="800">North-South Corridor</text>

        <g transform="translate(0, 65)">
          <circle cx="6" cy="8" r="4" fill="${COLORS.blue}"/>
          <text x="18" y="12" fill="${COLORS.darkTextMain}" font-size="12" font-weight="700">Shyambazar</text>
          <text x="120" y="12" fill="${COLORS.darkTextMuted}" font-size="11">→ Bagbazar Sarbojanin</text>

          <circle cx="6" cy="34" r="4" fill="${COLORS.blue}"/>
          <text x="18" y="38" fill="${COLORS.darkTextMain}" font-size="12" font-weight="700">Sovabazar</text>
          <text x="120" y="38" fill="${COLORS.darkTextMuted}" font-size="11">→ Rajbari, Kumartuli</text>

          <circle cx="6" cy="60" r="4" fill="${COLORS.blue}"/>
          <text x="18" y="64" fill="${COLORS.darkTextMain}" font-size="12" font-weight="700">MG Road</text>
          <text x="120" y="64" fill="${COLORS.darkTextMuted}" font-size="11">→ College Square</text>

          <circle cx="6" cy="86" r="4" fill="${COLORS.blue}"/>
          <text x="18" y="90" fill="${COLORS.darkTextMain}" font-size="12" font-weight="700">Kalighat</text>
          <text x="120" y="90" fill="${COLORS.darkTextMuted}" font-size="11">→ Deshapriya, Singhi Park</text>
        </g>
      </g>
    </g>

    <!-- Green Line Card -->
    <g transform="translate(0, 390)">
      <rect width="358" height="200" rx="18" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g transform="translate(16, 16)">
        <rect width="90" height="22" rx="6" fill="rgba(13, 148, 136, 0.2)"/>
        <text x="45" y="15" fill="${COLORS.teal}" font-size="10" font-weight="800" text-anchor="middle">GREEN LINE 2</text>
        <text x="0" y="48" fill="${COLORS.darkTextMain}" font-size="16" font-weight="800">Underwater River Corridor</text>

        <g transform="translate(0, 65)">
          <circle cx="6" cy="8" r="4" fill="${COLORS.teal}"/>
          <text x="18" y="12" fill="${COLORS.darkTextMain}" font-size="12" font-weight="700">Howrah Station</text>
          <text x="130" y="12" fill="${COLORS.darkTextMuted}" font-size="11">→ Underwater connection</text>

          <circle cx="6" cy="34" r="4" fill="${COLORS.teal}"/>
          <text x="18" y="38" fill="${COLORS.darkTextMain}" font-size="12" font-weight="700">Sealdah</text>
          <text x="130" y="38" fill="${COLORS.darkTextMuted}" font-size="11">→ Santosh Mitra Square</text>

          <circle cx="6" cy="60" r="4" fill="${COLORS.teal}"/>
          <text x="18" y="64" fill="${COLORS.darkTextMain}" font-size="12" font-weight="700">Karunamoyee</text>
          <text x="130" y="64" fill="${COLORS.darkTextMuted}" font-size="11">→ Salt Lake FD &amp; BJ Block</text>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileFooter(700)}
  ${renderMobileAudioBar(1410)}
  ${renderMobileBottomNav('More', 1470)}
</svg>`;
}

// -------------------------------------------------------------------------
// 7. Mobile Puja Music Screen (390 x 1550)
// -------------------------------------------------------------------------
function generateMobileMusic() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1550" viewBox="0 0 390 1550" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="390" height="1550" fill="${COLORS.darkBg}"/>

  ${renderMobileWebHeader()}

  <g transform="translate(16, 75)">
    <text x="0" y="24" fill="${COLORS.darkTextMain}" font-size="24" font-weight="900">Festive Puja Music</text>
    <text x="0" y="46" fill="${COLORS.darkTextMuted}" font-size="12">Sacred Chandi Path, Agamani &amp; Dhak beats.</text>

    <!-- Mood Pills -->
    <g transform="translate(0, 65)">
      <rect width="56" height="30" rx="8" fill="${COLORS.red}"/>
      <text x="28" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All</text>

      <rect x="64" width="94" height="30" rx="8" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="111" y="19" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Chandi Path</text>

      <rect x="166" width="90" height="30" rx="8" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="211" y="19" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Dhak Beats</text>

      <rect x="264" width="60" height="30" rx="8" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="294" y="19" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Aarti</text>
    </g>

    <!-- Audio Track Cards List -->
    <g transform="translate(0, 115)">
      <!-- Track 1: Sandhya Aarti (Now Playing) -->
      <g transform="translate(0, 0)">
        <rect width="358" height="74" rx="14" fill="${COLORS.darkCardElevated}" stroke="${COLORS.red}" stroke-width="1.5"/>
        <text x="18" y="32" font-size="16">🌸</text>
        <text x="44" y="28" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Sacred Sandhya Aarti</text>
        <text x="44" y="46" fill="${COLORS.red}" font-size="10" font-weight="700">NOW PLAYING • Belur Math</text>
        <rect x="294" y="22" width="50" height="28" rx="8" fill="${COLORS.redSoftDark}"/>
        <text x="319" y="40" fill="${COLORS.red}" font-size="11" font-weight="800" text-anchor="middle">⏸</text>
      </g>

      <!-- Track 2: Mahalaya Birendra Krishna Bhadra -->
      <g transform="translate(0, 84)">
        <rect width="358" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="18" y="32" font-size="16">📻</text>
        <text x="44" y="28" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Mahishasuramardini (Mahalaya)</text>
        <text x="44" y="46" fill="${COLORS.darkTextMuted}" font-size="10">Birendra Krishna Bhadra • 1h 28m</text>
        <rect x="294" y="22" width="50" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="319" y="40" fill="${COLORS.darkTextMuted}" font-size="11" font-weight="800" text-anchor="middle">▶</text>
      </g>

      <!-- Track 3: Royal Dhunuchi Dance Dhak -->
      <g transform="translate(0, 168)">
        <rect width="358" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="18" y="32" font-size="16">🥁</text>
        <text x="44" y="28" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Dhunuchi Dance Dhak Rhythm</text>
        <text x="44" y="46" fill="${COLORS.darkTextMuted}" font-size="10">Traditional Kasor &amp; Dhak Beats • 8m 45s</text>
        <rect x="294" y="22" width="50" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="319" y="40" fill="${COLORS.darkTextMuted}" font-size="11" font-weight="800" text-anchor="middle">▶</text>
      </g>

      <!-- Track 4: Agamani Gaan -->
      <g transform="translate(0, 252)">
        <rect width="358" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="18" y="32" font-size="16">🪕</text>
        <text x="44" y="28" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Jago Tumi Jago (Agamani)</text>
        <text x="44" y="46" fill="${COLORS.darkTextMuted}" font-size="10">Devotional Chants • 6m 12s</text>
        <rect x="294" y="22" width="50" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="319" y="40" fill="${COLORS.darkTextMuted}" font-size="11" font-weight="800" text-anchor="middle">▶</text>
      </g>
    </g>
  </g>

  ${renderMobileFooter(540)}
  ${renderMobileAudioBar(1410)}
  ${renderMobileBottomNav('More', 1470)}
</svg>`;
}

// Build & write all 7 mobile files
console.log('Generating authoritative Web Mobile SVGs...');
const screens = [
  { name: '01_web_mobile_home.svg', fn: generateMobileHome },
  { name: '02_web_mobile_developer.svg', fn: generateMobileDeveloper },
  { name: '03_web_mobile_explore.svg', fn: generateMobileExplore },
  { name: '04_web_mobile_calendar.svg', fn: generateMobileCalendar },
  { name: '05_web_mobile_planner.svg', fn: generateMobilePlanner },
  { name: '06_web_mobile_metro.svg', fn: generateMobileMetro },
  { name: '07_web_mobile_music.svg', fn: generateMobileMusic }
];

screens.forEach(s => {
  const content = s.fn();
  const filePath = path.join(MOBILE_DIR, s.name);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ Generated:', s.name, (content.length / 1024).toFixed(1) + ' KB');
});

console.log('All Web Mobile screens generated successfully.');
