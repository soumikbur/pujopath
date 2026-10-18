const fs = require('fs');
const path = require('path');
const {
  EXPORTS_DIR,
  IMAGES,
  COLORS,
  SVG_FONTS_AND_STYLES
} = require('./authentic-tokens-and-assets');

const DESKTOP_DIR = path.join(EXPORTS_DIR, 'web-desktop');
if (!fs.existsSync(DESKTOP_DIR)) fs.mkdirSync(DESKTOP_DIR, { recursive: true });

// Shared Desktop Header (Dark Theme, 1440px wide, 64px high)
function renderDesktopHeader(activeTab = 'Explore') {
  const tabs = [
    { name: 'Explore', active: activeTab === 'Explore' },
    { name: 'Map', active: activeTab === 'Map' },
    { name: 'Plan', active: activeTab === 'Plan' },
    { name: 'More ▾', active: activeTab === 'More' }
  ];

  let tabsSvg = '';
  let tabX = 140;
  tabs.forEach(t => {
    const textCol = t.active ? COLORS.red : COLORS.darkTextMuted;
    const bgCol = t.active ? COLORS.redSoftDark : 'transparent';
    const weight = t.active ? '700' : '600';
    tabsSvg += `
      <g transform="translate(${tabX}, 12)">
        <rect width="80" height="40" rx="12" fill="${bgCol}"/>
        <text x="40" y="25" fill="${textCol}" font-size="14" font-weight="${weight}" text-anchor="middle">${t.name}</text>
      </g>
    `;
    tabX += 90;
  });

  return `
  <!-- DESKTOP STICKY HEADER (64px) -->
  <g id="Header_Desktop">
    <rect width="1440" height="64" fill="${COLORS.darkBg}" fill-opacity="0.94"/>
    <line x1="0" y1="64" x2="1440" y2="64" stroke="${COLORS.darkBorder}" stroke-width="1"/>

    <!-- Left Brand Logo -->
    <g transform="translate(80, 20)">
      <text x="0" y="22" fill="${COLORS.red}" font-size="22" font-weight="900" letter-spacing="-0.5" class="brand">PujoPath</text>
    </g>

    <!-- Center Nav Tabs -->
    <g id="Nav_Tabs">
      ${tabsSvg}
    </g>

    <!-- Right Controls: Install App, Mode Toggle, Language, Heart -->
    <g id="Header_Controls" transform="translate(1030, 14)">
      <!-- Install App Button (Red Pill) -->
      <g id="Install_App_Btn">
        <rect width="130" height="36" rx="12" fill="${COLORS.red}"/>
        <text x="65" y="23" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">📥 Install App</text>
      </g>

      <!-- Dark Mode Toggle Button (Square) -->
      <g id="Theme_Toggle_Btn" transform="translate(142, 0)">
        <rect width="36" height="36" rx="12" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="18" y="23" fill="${COLORS.darkTextMuted}" font-size="15" text-anchor="middle">☼</text>
      </g>

      <!-- Language Switch (EN / বাংলা Pill) -->
      <g id="Lang_Switch_Btn" transform="translate(190, 0)">
        <rect width="90" height="36" rx="12" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <!-- Active EN Tab -->
        <rect x="3" y="3" width="40" height="30" rx="8" fill="${COLORS.red}"/>
        <text x="23" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">EN</text>
        <!-- Inactive বাংলা Tab -->
        <text x="66" y="22" fill="${COLORS.darkTextMuted}" font-size="12" font-weight="600" text-anchor="middle" class="bengali">বাংলা</text>
      </g>

      <!-- Saved Favorites Heart Button -->
      <g id="Favorites_Btn" transform="translate(292, 0)">
        <rect width="36" height="36" rx="12" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="18" y="23" fill="${COLORS.darkTextMuted}" font-size="15" text-anchor="middle">♡</text>
      </g>
    </g>
  </g>
  `;
}

// Shared Desktop Footer & Audio Bar
function renderDesktopFooter(yPos = 1200) {
  return `
  <!-- DESKTOP FOOTER SECTION (y=${yPos}) -->
  <g id="Footer_Desktop" transform="translate(0, ${yPos})">
    <rect width="1440" height="150" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
    
    <g transform="translate(80, 36)">
      <!-- Brand & Mission -->
      <text x="0" y="20" fill="${COLORS.red}" font-size="20" font-weight="900" class="brand">PujoPath</text>
      <text x="0" y="44" fill="${COLORS.darkTextMuted}" font-size="13">Discover. Plan. Experience Kolkata's Durga Puja with confidence.</text>
      <text x="0" y="70" fill="${COLORS.darkTextFaint}" font-size="12">Crafted with ❤️ by Soumik &amp; Moumita. Non-commercial, open community project.</text>
      
      <!-- Quick Nav Links -->
      <g transform="translate(850, 10)">
        <text x="0" y="14" fill="${COLORS.darkTextSecondary}" font-size="13" font-weight="700">Quick Links</text>
        <text x="0" y="38" fill="${COLORS.darkTextMuted}" font-size="13">Explore Pandals</text>
        <text x="0" y="60" fill="${COLORS.darkTextMuted}" font-size="13">Route Planner</text>
        
        <text x="160" y="38" fill="${COLORS.darkTextMuted}" font-size="13">Metro Guide</text>
        <text x="160" y="60" fill="${COLORS.darkTextMuted}" font-size="13">Sacred Calendar</text>
        
        <text x="310" y="38" fill="${COLORS.darkTextMuted}" font-size="13">Puja Music</text>
        <text x="310" y="60" fill="${COLORS.darkTextMuted}" font-size="13">Developers</text>
      </g>
    </g>
  </g>

  <!-- PERSISTENT FLOATING AUDIO PLAYER BAR (y=${yPos + 90}) -->
  <g id="Floating_Audio_Player_Desktop" transform="translate(80, ${yPos + 80})">
    <rect width="1280" height="56" rx="16" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1.5"/>
    
    <g transform="translate(20, 12)">
      <!-- Thumbnail -->
      <clipPath id="audio-thumb-clip"><rect width="32" height="32" rx="8"/></clipPath>
      <g clip-path="url(#audio-thumb-clip)">
        <image href="${IMAGES.miniplayer}" width="32" height="32" preserveAspectRatio="xMidYMid slice"/>
      </g>

      <!-- Track Info -->
      <text x="46" y="16" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">🌸 Sacred Sandhya Aarti</text>
      <text x="46" y="28" fill="${COLORS.darkTextMuted}" font-size="11">Traditional Dhak &amp; Shankha Recitation • Belur Math</text>
      
      <!-- Progress Bar (Center) -->
      <g transform="translate(420, 12)">
        <text x="-40" y="8" fill="${COLORS.darkTextMuted}" font-size="11">2:45</text>
        <rect width="360" height="4" rx="2" fill="${COLORS.darkBorder}"/>
        <rect width="140" height="4" rx="2" fill="${COLORS.red}"/>
        <circle cx="140" cy="2" r="5" fill="#FFFFFF"/>
        <text x="375" y="8" fill="${COLORS.darkTextMuted}" font-size="11">5:12</text>
      </g>

      <!-- Audio Controls (Right) -->
      <g transform="translate(1080, 4)">
        <rect width="84" height="26" rx="8" fill="${COLORS.redSoftDark}" stroke="${COLORS.redBorderDark}" stroke-width="1"/>
        <text x="42" y="18" fill="${COLORS.red}" font-size="11" font-weight="700" text-anchor="middle">⏸ Pause</text>
        <text x="110" y="18" fill="${COLORS.darkTextMuted}" font-size="14">🔊</text>
      </g>
    </g>
  </g>
  `;
}

// -------------------------------------------------------------------------
// 1. Desktop Home Screen (1440 x 1400)
// -------------------------------------------------------------------------
function generateDesktopHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1400" viewBox="0 0 1440 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <!-- Base Background (Deep Dark Theme) -->
  <rect width="1440" height="1400" fill="${COLORS.darkBg}"/>

  <!-- Background Festive Mandala Artwork -->
  <g id="Background_Artwork_Desktop" opacity="0.18">
    <image href="${IMAGES.ghibliBg}" width="1440" height="700" preserveAspectRatio="xMidYMid slice"/>
    <rect width="1440" height="700" fill="url(#bg-dark-fade)"/>
  </g>
  <defs>
    <linearGradient id="bg-dark-fade" x1="0" y1="0" x2="0" y2="700" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${COLORS.darkBg}" stop-opacity="0.3"/>
      <stop offset="70%" stop-color="${COLORS.darkBg}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${COLORS.darkBg}" stop-opacity="1.0"/>
    </linearGradient>
    <clipPath id="d-highlight-1"><rect width="120" height="90" rx="12"/></clipPath>
    <clipPath id="d-highlight-2"><rect width="120" height="90" rx="12"/></clipPath>
    <clipPath id="d-highlight-3"><rect width="120" height="90" rx="12"/></clipPath>
  </defs>

  <!-- Sticky Header -->
  ${renderDesktopHeader('Home')}

  <!-- 1. Hero Section (1280px centered at x=80) -->
  <g id="Hero_Section" transform="translate(80, 96)">
    <rect width="1280" height="290" rx="24" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
    
    <g transform="translate(48, 36)">
      <!-- Countdown / Live Status Pill -->
      <g id="Countdown_Pill">
        <rect width="170" height="30" rx="15" fill="${COLORS.redSoftDark}" stroke="${COLORS.redBorderDark}" stroke-width="1"/>
        <text x="14" y="20" font-size="14">🗓️</text>
        <text x="36" y="20" fill="${COLORS.red}" font-size="12" font-weight="700">180 days to Puja</text>
      </g>

      <!-- Headline -->
      <text x="0" y="86" fill="${COLORS.darkTextMain}" font-size="44" font-weight="900" letter-spacing="-1">Your Puja, made simple.</text>
      
      <!-- Subtitle -->
      <text x="0" y="124" fill="${COLORS.darkTextMuted}" font-size="16" font-weight="500">Find the pandals you love, build a route, and head out with confidence.</text>

      <!-- Action Buttons Row -->
      <g id="Hero_Actions" transform="translate(0, 156)">
        <!-- Find Pandals Primary Button -->
        <g id="Find_Pandals_Btn">
          <rect width="180" height="48" rx="14" fill="${COLORS.red}"/>
          <text x="90" y="30" fill="#FFFFFF" font-size="15" font-weight="700" text-anchor="middle">🔍 Find pandals →</text>
        </g>

        <!-- Build a Route Secondary Button -->
        <g id="Build_Route_Btn" transform="translate(200, 0)">
          <rect width="180" height="48" rx="14" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="90" y="30" fill="${COLORS.darkTextMain}" font-size="15" font-weight="700" text-anchor="middle">🧭 Build a route</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 2. Quick Access Key Shortcuts (6 cards in grid) -->
  <g id="Quick_Access_Section" transform="translate(80, 416)">
    <text x="0" y="0" fill="${COLORS.darkTextMain}" font-size="18" font-weight="800">Quick Access</text>

    <g id="Quick_Access_Grid" transform="translate(0, 16)">
      <!-- Card 1: Map -->
      <g id="QA_Map" transform="translate(0, 0)">
        <rect width="200" height="110" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="${COLORS.redSoftDark}"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">📍</text>
        <text x="16" y="78" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Map</text>
        <text x="16" y="96" fill="${COLORS.darkTextMuted}" font-size="11">See all pandals</text>
      </g>

      <!-- Card 2: Route Planner -->
      <g id="QA_Planner" transform="translate(216, 0)">
        <rect width="200" height="110" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="rgba(13, 148, 136, 0.18)"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">🔀</text>
        <text x="16" y="78" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Route Planner</text>
        <text x="16" y="96" fill="${COLORS.darkTextMuted}" font-size="11">Optimize your trail</text>
      </g>

      <!-- Card 3: Metro Guide -->
      <g id="QA_Metro" transform="translate(432, 0)">
        <rect width="200" height="110" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="rgba(37, 99, 235, 0.18)"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">🚇</text>
        <text x="16" y="78" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Metro Guide</text>
        <text x="16" y="96" fill="${COLORS.darkTextMuted}" font-size="11">Find stations</text>
      </g>

      <!-- Card 4: Sacred Calendar -->
      <g id="QA_Calendar" transform="translate(648, 0)">
        <rect width="200" height="110" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="rgba(234, 88, 12, 0.18)"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">📅</text>
        <text x="16" y="78" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Calendar</text>
        <text x="16" y="96" fill="${COLORS.darkTextMuted}" font-size="11">Auspicious tithis</text>
      </g>

      <!-- Card 5: Puja Music -->
      <g id="QA_Music" transform="translate(864, 0)">
        <rect width="200" height="110" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="rgba(124, 58, 237, 0.18)"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">🎵</text>
        <text x="16" y="78" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Puja Music</text>
        <text x="16" y="96" fill="${COLORS.darkTextMuted}" font-size="11">Chandi Path &amp; Dhak</text>
      </g>

      <!-- Card 6: Mahalaya Special -->
      <g id="QA_Mahalaya" transform="translate(1080, 0)">
        <rect width="200" height="110" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <rect x="16" y="16" width="38" height="38" rx="10" fill="rgba(217, 119, 6, 0.18)"/>
        <text x="35" y="41" font-size="18" text-anchor="middle">✨</text>
        <text x="16" y="78" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Mahalaya</text>
        <text x="16" y="96" fill="${COLORS.darkTextMuted}" font-size="11">Dawn broadcast</text>
      </g>
    </g>
  </g>

  <!-- 3. Curated Puja Highlights (3 large cards) -->
  <g id="Puja_Highlights_Section" transform="translate(80, 570)">
    <g transform="translate(0, 0)">
      <text x="0" y="0" fill="${COLORS.red}" font-size="18" font-weight="900">✣</text>
      <text x="22" y="0" fill="${COLORS.darkTextMain}" font-size="18" font-weight="800">Puja Highlights</text>
      <text x="1280" y="0" fill="${COLORS.red}" font-size="13" font-weight="700" text-anchor="end">View all highlights →</text>
    </g>

    <g id="Highlights_Grid" transform="translate(0, 18)">
      <!-- Highlight 1: Sovabazar -->
      <g id="HL_Card_1" transform="translate(0, 0)">
        <rect width="413" height="120" rx="18" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <g transform="translate(16, 15)" clip-path="url(#d-highlight-1)">
          <image href="${IMAGES.sovabazar}" width="120" height="90" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(152, 24)">
          <rect width="90" height="20" rx="6" fill="${COLORS.redSoftDark}"/>
          <text x="45" y="14" fill="${COLORS.red}" font-size="10" font-weight="700" text-anchor="middle">Traditions &amp; Art</text>
          <text x="0" y="44" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Traditions &amp; Pandal Art</text>
          <text x="0" y="64" fill="${COLORS.darkTextMuted}" font-size="12">Heritage bonedi bari installations.</text>
        </g>
      </g>

      <!-- Highlight 2: Bagbazar -->
      <g id="HL_Card_2" transform="translate(433, 0)">
        <rect width="413" height="120" rx="18" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <g transform="translate(16, 15)" clip-path="url(#d-highlight-2)">
          <image href="${IMAGES.bagbazar}" width="120" height="90" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(152, 24)">
          <rect width="80" height="20" rx="6" fill="rgba(217, 119, 6, 0.18)"/>
          <text x="40" y="14" fill="${COLORS.gold}" font-size="10" font-weight="700" text-anchor="middle">Sacred Almanac</text>
          <text x="0" y="44" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Sacred Almanac &amp; Timings</text>
          <text x="0" y="64" fill="${COLORS.darkTextMuted}" font-size="12">Ashtami Sandhi Puja schedules.</text>
        </g>
      </g>

      <!-- Highlight 3: College Square -->
      <g id="HL_Card_3" transform="translate(866, 0)">
        <rect width="413" height="120" rx="18" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <g transform="translate(16, 15)" clip-path="url(#d-highlight-3)">
          <image href="${IMAGES.collegeSquare}" width="120" height="90" preserveAspectRatio="xMidYMid slice"/>
        </g>
        <g transform="translate(152, 24)">
          <rect width="80" height="20" rx="6" fill="rgba(37, 99, 235, 0.18)"/>
          <text x="40" y="14" fill="${COLORS.blue}" font-size="10" font-weight="700" text-anchor="middle">Night Routes</text>
          <text x="0" y="44" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Pujo Evenings &amp; Routes</text>
          <text x="0" y="64" fill="${COLORS.darkTextMuted}" font-size="12">Illumination &amp; evening hopping.</text>
        </g>
      </g>
    </g>
  </g>

  <!-- 4. Feature Pills Grid (6 pills in 3 cols) -->
  <g id="Feature_Pills_Section" transform="translate(80, 730)">
    <g transform="translate(0, 0)">
      <!-- Pill 1 -->
      <g transform="translate(0, 0)">
        <rect width="413" height="54" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="20" y="33" font-size="18">✨</text>
        <text x="50" y="27" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Ultra Simple</text>
        <text x="50" y="43" fill="${COLORS.darkTextMuted}" font-size="11">Only what you need, nothing you don't</text>
      </g>
      <!-- Pill 2 -->
      <g transform="translate(433, 0)">
        <rect width="413" height="54" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="20" y="33" font-size="18">⚡</text>
        <text x="50" y="27" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Lightning Fast</text>
        <text x="50" y="43" fill="${COLORS.darkTextMuted}" font-size="11">Zero clutter, instant route calculations</text>
      </g>
      <!-- Pill 3 -->
      <g transform="translate(866, 0)">
        <rect width="413" height="54" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="20" y="33" font-size="18">📱</text>
        <text x="50" y="27" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Fully Responsive</text>
        <text x="50" y="43" fill="${COLORS.darkTextMuted}" font-size="11">Flawless on Web, Mobile, and Android</text>
      </g>
    </g>

    <g transform="translate(0, 68)">
      <!-- Pill 4 -->
      <g transform="translate(0, 0)">
        <rect width="413" height="54" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="20" y="33" font-size="18">🌸</text>
        <text x="50" y="27" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">100% Free &amp; Open</text>
        <text x="50" y="43" fill="${COLORS.darkTextMuted}" font-size="11">Non-commercial, community driven</text>
      </g>
      <!-- Pill 5 -->
      <g transform="translate(433, 0)">
        <rect width="413" height="54" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="20" y="33" font-size="18">📍</text>
        <text x="50" y="27" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Interactive Map</text>
        <text x="50" y="43" fill="${COLORS.darkTextMuted}" font-size="11">Diya pins with live metro integration</text>
      </g>
      <!-- Pill 6 -->
      <g transform="translate(866, 0)">
        <rect width="413" height="54" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="20" y="33" font-size="18">🔀</text>
        <text x="50" y="27" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Smart Route Planner</text>
        <text x="50" y="43" fill="${COLORS.darkTextMuted}" font-size="11">Multi-stop trail optimization</text>
      </g>
    </g>
  </g>

  <!-- Global Footer & Audio Bar -->
  ${renderDesktopFooter(960)}
</svg>`;
}

// -------------------------------------------------------------------------
// 2. Desktop Developer Screen (1440 x 1350)
// -------------------------------------------------------------------------
function generateDesktopDeveloper() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1350" viewBox="0 0 1440 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="1440" height="1350" fill="${COLORS.darkBg}"/>

  <defs>
    <clipPath id="moumita-clip-d"><rect width="120" height="120" rx="20"/></clipPath>
    <clipPath id="soumik-clip-d"><rect width="120" height="120" rx="20"/></clipPath>
  </defs>

  <!-- Sticky Header -->
  ${renderDesktopHeader('More')}

  <!-- Page Header Title -->
  <g transform="translate(80, 110)">
    <text x="0" y="0" fill="${COLORS.darkTextMain}" font-size="36" font-weight="900" letter-spacing="-0.5">Meet the Developers</text>
    <text x="0" y="32" fill="${COLORS.darkTextMuted}" font-size="16">The minds and hearts building PujoPath for Kolkata's Durga Puja devotees.</text>
  </g>

  <!-- 2 Developer Profile Cards (Side-by-Side: 624px each at x=80 and x=736) -->
  <g transform="translate(80, 190)">
    <!-- Moumita Card -->
    <g id="Dev_Moumita" transform="translate(0, 0)">
      <rect width="624" height="420" rx="24" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      
      <g transform="translate(36, 36)">
        <!-- Photo & Name Row -->
        <g clip-path="url(#moumita-clip-d)">
          <image href="${IMAGES.moumita}" width="120" height="120" preserveAspectRatio="xMidYMid slice"/>
        </g>

        <g transform="translate(144, 20)">
          <text x="0" y="16" fill="${COLORS.darkTextMain}" font-size="24" font-weight="800">Moumita</text>
          <rect x="0" y="28" width="160" height="24" rx="8" fill="${COLORS.redSoftDark}"/>
          <text x="80" y="44" fill="${COLORS.red}" font-size="11" font-weight="700" text-anchor="middle">UI &amp; Frontend Lead</text>
          <text x="0" y="78" fill="${COLORS.darkTextMuted}" font-size="13">Product Designer &amp; Web Architect</text>
        </g>

        <!-- Bio -->
        <g transform="translate(0, 150)">
          <text x="0" y="16" fill="${COLORS.darkTextSecondary}" font-size="14" line-height="22">
            Moumita leads the design system, typography, and visual language of PujoPath.
          </text>
          <text x="0" y="38" fill="${COLORS.darkTextSecondary}" font-size="14">
            Her focus is delivering an authentic, accessible Kolkata festive experience across
          </text>
          <text x="0" y="60" fill="${COLORS.darkTextSecondary}" font-size="14">
            both modern desktop web browsers and handheld mobile interfaces.
          </text>
        </g>

        <!-- Skills Tags -->
        <g transform="translate(0, 240)">
          <rect x="0" y="0" width="110" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="55" y="18" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Design Systems</text>

          <rect x="120" y="0" width="100" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="170" y="18" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Accessibility</text>

          <rect x="230" y="0" width="100" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="280" y="18" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">TailwindCSS</text>

          <rect x="340" y="0" width="80" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="380" y="18" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Figma UX</text>
        </g>

        <!-- LinkedIn CTA Button -->
        <g transform="translate(0, 300)">
          <rect width="200" height="42" rx="12" fill="${COLORS.linkedin}"/>
          <text x="100" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Connect on LinkedIn ↗</text>
        </g>
      </g>
    </g>

    <!-- Soumik Card -->
    <g id="Dev_Soumik" transform="translate(656, 0)">
      <rect width="624" height="420" rx="24" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      
      <g transform="translate(36, 36)">
        <!-- Photo & Name Row -->
        <g clip-path="url(#soumik-clip-d)">
          <image href="${IMAGES.soumik}" width="120" height="120" preserveAspectRatio="xMidYMid slice"/>
        </g>

        <g transform="translate(144, 20)">
          <text x="0" y="16" fill="${COLORS.darkTextMain}" font-size="24" font-weight="800">Soumik</text>
          <rect x="0" y="28" width="170" height="24" rx="8" fill="rgba(37, 99, 235, 0.18)"/>
          <text x="85" y="44" fill="${COLORS.blue}" font-size="11" font-weight="700" text-anchor="middle">Backend &amp; Systems Lead</text>
          <text x="0" y="78" fill="${COLORS.darkTextMuted}" font-size="13">Fullstack Engineer &amp; Android Specialist</text>
        </g>

        <!-- Bio -->
        <g transform="translate(0, 150)">
          <text x="0" y="16" fill="${COLORS.darkTextSecondary}" font-size="14">
            Soumik architects the geospatial algorithms, route optimizer, and offline-first
          </text>
          <text x="0" y="38" fill="${COLORS.darkTextSecondary}" font-size="14">
            Android Capacitor pipeline. He ensures low-latency performance during peak
          </text>
          <text x="0" y="60" fill="${COLORS.darkTextSecondary}" font-size="14">
            Puja evening congestion and high concurrency traffic.
          </text>
        </g>

        <!-- Skills Tags -->
        <g transform="translate(0, 240)">
          <rect x="0" y="0" width="120" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="60" y="18" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Next.js &amp; Node</text>

          <rect x="130" y="0" width="130" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="195" y="18" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Capacitor Android</text>

          <rect x="270" y="0" width="100" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="320" y="18" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Geo-Routing</text>

          <rect x="380" y="0" width="100" height="28" rx="8" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="430" y="18" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">Cloud Native</text>
        </g>

        <!-- LinkedIn CTA Button -->
        <g transform="translate(0, 300)">
          <rect width="200" height="42" rx="12" fill="${COLORS.linkedin}"/>
          <text x="100" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Connect on LinkedIn ↗</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Project Philosophy Card (Full Width) -->
  <g transform="translate(80, 640)">
    <rect width="1280" height="150" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
    <g transform="translate(40, 36)">
      <text x="0" y="16" fill="${COLORS.gold}" font-size="16" font-weight="800">✨ Built for Devotees, Pandals &amp; Kolkata</text>
      <text x="0" y="44" fill="${COLORS.darkTextSecondary}" font-size="14">
        PujoPath was born out of personal devotion and the sheer magic of Durga Puja. Our mission is to keep the entire experience
      </text>
      <text x="0" y="68" fill="${COLORS.darkTextMuted}" font-size="13">
        100% free, privacy-first, ad-free, and open for everyone navigating Kolkata's grandest festival.
      </text>
    </g>
  </g>

  <!-- Global Footer & Audio Bar -->
  ${renderDesktopFooter(850)}
</svg>`;
}

// -------------------------------------------------------------------------
// 3. Desktop Explore Screen (1440 x 1950)
// -------------------------------------------------------------------------
function generateDesktopExplore() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1950" viewBox="0 0 1440 1950" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="1440" height="1950" fill="${COLORS.darkBg}"/>

  <defs>
    <clipPath id="p-bagbazar"><rect width="405" height="210" rx="18"/></clipPath>
    <clipPath id="p-kumartuli"><rect width="405" height="210" rx="18"/></clipPath>
    <clipPath id="p-sovabazar"><rect width="405" height="210" rx="18"/></clipPath>
    <clipPath id="p-suruchi"><rect width="405" height="210" rx="18"/></clipPath>
    <clipPath id="p-ekdalia"><rect width="405" height="210" rx="18"/></clipPath>
    <clipPath id="p-sreebhumi"><rect width="405" height="210" rx="18"/></clipPath>
  </defs>

  <!-- Sticky Header -->
  ${renderDesktopHeader('Explore')}

  <!-- Page Header & Search Bar -->
  <g transform="translate(80, 96)">
    <text x="0" y="24" fill="${COLORS.darkTextMain}" font-size="32" font-weight="900">Explore Kolkata Pandals</text>
    <text x="0" y="52" fill="${COLORS.darkTextMuted}" font-size="15">Discover 48+ iconic pandals across North, South, Central Kolkata &amp; Salt Lake.</text>

    <!-- Search Input Box -->
    <g transform="translate(0, 75)">
      <rect width="1280" height="52" rx="16" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1.5"/>
      <text x="24" y="32" fill="${COLORS.darkTextMuted}" font-size="16">🔍</text>
      <text x="56" y="32" fill="${COLORS.darkTextMuted}" font-size="14">Search pandals by name, zone, theme, or metro station...</text>
    </g>

    <!-- Filter Zone Pills -->
    <g transform="translate(0, 145)">
      <!-- All Active -->
      <rect width="84" height="34" rx="10" fill="${COLORS.red}"/>
      <text x="42" y="22" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">All (48)</text>

      <rect x="94" width="136" height="34" rx="10" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="162" y="22" fill="${COLORS.darkTextMuted}" font-size="13" text-anchor="middle">North Kolkata (16)</text>

      <rect x="240" width="136" height="34" rx="10" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="308" y="22" fill="${COLORS.darkTextMuted}" font-size="13" text-anchor="middle">South Kolkata (18)</text>

      <rect x="386" width="110" height="34" rx="10" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="441" y="22" fill="${COLORS.darkTextMuted}" font-size="13" text-anchor="middle">Central (8)</text>

      <rect x="506" width="116" height="34" rx="10" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <text x="564" y="22" fill="${COLORS.darkTextMuted}" font-size="13" text-anchor="middle">Salt Lake (6)</text>
    </g>
  </g>

  <!-- 3-Column Pandal Directory Grid (Row 1 at y=320, Row 2 at y=840) -->
  <g transform="translate(80, 310)">
    <!-- Card 1: Bagbazar Sarbojanin -->
    <g id="Pandal_Bagbazar" transform="translate(0, 0)">
      <rect width="405" height="480" rx="22" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g clip-path="url(#p-bagbazar)">
        <image href="${IMAGES.bagbazar}" width="405" height="210" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <!-- Badges on Image -->
      <g transform="translate(14, 14)">
        <rect width="90" height="24" rx="8" fill="rgba(0,0,0,0.65)"/>
        <text x="45" y="16" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <g transform="translate(20, 230)">
        <text x="0" y="16" fill="${COLORS.red}" font-size="11" font-weight="700">NORTH KOLKATA • HERITAGE</text>
        <text x="0" y="44" fill="${COLORS.darkTextMain}" font-size="20" font-weight="800">Bagbazar Sarbojanin</text>
        <text x="0" y="70" fill="${COLORS.darkTextMuted}" font-size="13">Century-old traditional Ekchala protima and classic daker saaj.</text>
        
        <!-- Metrics -->
        <g transform="translate(0, 95)">
          <rect width="84" height="24" rx="6" fill="${COLORS.redSoftDark}"/>
          <text x="42" y="16" fill="${COLORS.red}" font-size="11" font-weight="700" text-anchor="middle">High Crowd</text>
          
          <rect x="94" width="130" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="159" y="16" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">🚇 Shyambazar (450m)</text>
        </g>

        <!-- CTA Button -->
        <g transform="translate(0, 140)">
          <rect width="365" height="42" rx="12" fill="${COLORS.red}"/>
          <text x="182" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 2: Kumartuli Park -->
    <g id="Pandal_Kumartuli" transform="translate(437, 0)">
      <rect width="405" height="480" rx="22" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g clip-path="url(#p-kumartuli)">
        <image href="${IMAGES.kumartuli}" width="405" height="210" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <g transform="translate(14, 14)">
        <rect width="90" height="24" rx="8" fill="rgba(0,0,0,0.65)"/>
        <text x="45" y="16" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <g transform="translate(20, 230)">
        <text x="0" y="16" fill="${COLORS.teal}" font-size="11" font-weight="700">NORTH KOLKATA • ART &amp; SCULPTURE</text>
        <text x="0" y="44" fill="${COLORS.darkTextMain}" font-size="20" font-weight="800">Kumartuli Park</text>
        <text x="0" y="70" fill="${COLORS.darkTextMuted}" font-size="13">Artisan epicenter with visionary contemporary idol sculpting.</text>
        
        <g transform="translate(0, 95)">
          <rect width="100" height="24" rx="6" fill="rgba(13, 148, 136, 0.18)"/>
          <text x="50" y="16" fill="${COLORS.teal}" font-size="11" font-weight="700" text-anchor="middle">Moderate Crowd</text>
          
          <rect x="110" width="130" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="175" y="16" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">🚇 Sovabazar (600m)</text>
        </g>

        <g transform="translate(0, 140)">
          <rect width="365" height="42" rx="12" fill="${COLORS.red}"/>
          <text x="182" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 3: Sovabazar Rajbari -->
    <g id="Pandal_Sovabazar" transform="translate(874, 0)">
      <rect width="405" height="480" rx="22" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g clip-path="url(#p-sovabazar)">
        <image href="${IMAGES.sovabazar}" width="405" height="210" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <g transform="translate(14, 14)">
        <rect width="90" height="24" rx="8" fill="rgba(0,0,0,0.65)"/>
        <text x="45" y="16" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <g transform="translate(20, 230)">
        <text x="0" y="16" fill="${COLORS.gold}" font-size="11" font-weight="700">NORTH KOLKATA • ARISTOCRATIC RAJBARI</text>
        <text x="0" y="44" fill="${COLORS.darkTextMain}" font-size="20" font-weight="800">Sovabazar Rajbari</text>
        <text x="0" y="70" fill="${COLORS.darkTextMuted}" font-size="13">Founded in 1757 by Raja Nabakrishna Deb in the grand Natmandir courtyard.</text>
        
        <g transform="translate(0, 95)">
          <rect width="90" height="24" rx="6" fill="${COLORS.redSoftDark}"/>
          <text x="45" y="16" fill="${COLORS.red}" font-size="11" font-weight="700" text-anchor="middle">High Crowd</text>
          
          <rect x="100" width="130" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="165" y="16" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">🚇 Sovabazar (350m)</text>
        </g>

        <g transform="translate(0, 140)">
          <rect width="365" height="42" rx="12" fill="${COLORS.red}"/>
          <text x="182" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 4: Suruchi Sangha -->
    <g id="Pandal_Suruchi" transform="translate(0, 510)">
      <rect width="405" height="480" rx="22" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g clip-path="url(#p-suruchi)">
        <image href="${IMAGES.suruchi}" width="405" height="210" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <g transform="translate(14, 14)">
        <rect width="90" height="24" rx="8" fill="rgba(0,0,0,0.65)"/>
        <text x="45" y="16" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <g transform="translate(20, 230)">
        <text x="0" y="16" fill="${COLORS.blue}" font-size="11" font-weight="700">SOUTH KOLKATA • STATE THEME</text>
        <text x="0" y="44" fill="${COLORS.darkTextMain}" font-size="20" font-weight="800">Suruchi Sangha</text>
        <text x="0" y="70" fill="${COLORS.darkTextMuted}" font-size="13">Renowned Indian state cultural representations and outdoor pavilions.</text>
        
        <g transform="translate(0, 95)">
          <rect width="90" height="24" rx="6" fill="${COLORS.redSoftDark}"/>
          <text x="45" y="16" fill="${COLORS.red}" font-size="11" font-weight="700" text-anchor="middle">High Crowd</text>
          
          <rect x="100" width="130" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="165" y="16" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">🚇 Kalighat (1.1km)</text>
        </g>

        <g transform="translate(0, 140)">
          <rect width="365" height="42" rx="12" fill="${COLORS.red}"/>
          <text x="182" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 5: Ekdalia Evergreen -->
    <g id="Pandal_Ekdalia" transform="translate(437, 510)">
      <rect width="405" height="480" rx="22" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g clip-path="url(#p-ekdalia)">
        <image href="${IMAGES.ekdalia}" width="405" height="210" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <g transform="translate(14, 14)">
        <rect width="90" height="24" rx="8" fill="rgba(0,0,0,0.65)"/>
        <text x="45" y="16" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <g transform="translate(20, 230)">
        <text x="0" y="16" fill="${COLORS.gold}" font-size="11" font-weight="700">SOUTH KOLKATA • TEMPLE ARCHITECTURE</text>
        <text x="0" y="44" fill="${COLORS.darkTextMain}" font-size="20" font-weight="800">Ekdalia Evergreen Club</text>
        <text x="0" y="70" fill="${COLORS.darkTextMuted}" font-size="13">Majestic South Indian temple replica with dazzling German chandeliers.</text>
        
        <g transform="translate(0, 95)">
          <rect width="90" height="24" rx="6" fill="${COLORS.redSoftDark}"/>
          <text x="45" y="16" fill="${COLORS.red}" font-size="11" font-weight="700" text-anchor="middle">High Crowd</text>
          
          <rect x="100" width="130" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="165" y="16" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">🚇 Gariahat (400m)</text>
        </g>

        <g transform="translate(0, 140)">
          <rect width="365" height="42" rx="12" fill="${COLORS.red}"/>
          <text x="182" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>

    <!-- Card 6: Sreebhumi Sporting Club -->
    <g id="Pandal_Sreebhumi" transform="translate(874, 510)">
      <rect width="405" height="480" rx="22" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g clip-path="url(#p-sreebhumi)">
        <image href="${IMAGES.sreebhumi}" width="405" height="210" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <g transform="translate(14, 14)">
        <rect width="90" height="24" rx="8" fill="rgba(0,0,0,0.65)"/>
        <text x="45" y="16" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">📷 2025 Photo</text>
      </g>
      <g transform="translate(20, 230)">
        <text x="0" y="16" fill="${COLORS.purple}" font-size="11" font-weight="700">VIP ROAD • MONUMENTAL SPECTACLE</text>
        <text x="0" y="44" fill="${COLORS.darkTextMain}" font-size="20" font-weight="800">Sreebhumi Sporting Club</text>
        <text x="0" y="70" fill="${COLORS.darkTextMuted}" font-size="13">Stunning palace architecture illuminated with royal gold jewelry for Maa Durga.</text>
        
        <g transform="translate(0, 95)">
          <rect width="90" height="24" rx="6" fill="${COLORS.redSoftDark}"/>
          <text x="45" y="16" fill="${COLORS.red}" font-size="11" font-weight="700" text-anchor="middle">Extreme Crowd</text>
          
          <rect x="100" width="130" height="24" rx="6" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="165" y="16" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">🚇 Ultadanga (1.4km)</text>
        </g>

        <g transform="translate(0, 140)">
          <rect width="365" height="42" rx="12" fill="${COLORS.red}"/>
          <text x="182" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">+ Add to Route Planner</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Global Footer & Audio Bar -->
  ${renderDesktopFooter(1420)}
</svg>`;
}

// -------------------------------------------------------------------------
// 4. Desktop Calendar Screen (1440 x 1400)
// -------------------------------------------------------------------------
function generateDesktopCalendar() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1400" viewBox="0 0 1440 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="1440" height="1400" fill="${COLORS.darkBg}"/>

  ${renderDesktopHeader('More')}

  <g transform="translate(80, 100)">
    <text x="0" y="24" fill="${COLORS.darkTextMain}" font-size="34" font-weight="900">Durga Puja 2026 Sacred Calendar</text>
    <text x="0" y="52" fill="${COLORS.darkTextMuted}" font-size="15">Auspicious Tithis, Sandhi Puja Timings &amp; Pushpanjali Muhurats.</text>

    <!-- Sandhi Puja Feature Card (Amber Glow) -->
    <g transform="translate(0, 80)">
      <rect width="1280" height="160" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.gold}" stroke-width="1.5"/>
      <g transform="translate(36, 32)">
        <rect width="150" height="26" rx="8" fill="rgba(217, 119, 6, 0.2)"/>
        <text x="75" y="18" fill="${COLORS.gold}" font-size="11" font-weight="800" text-anchor="middle">✨ AUSPICIOUS HIGHLIGHT</text>
        <text x="0" y="54" fill="${COLORS.darkTextMain}" font-size="22" font-weight="900">Maha Ashtami Sandhi Puja • 108 Sacred Diyas</text>
        <text x="0" y="78" fill="${COLORS.darkTextSecondary}" font-size="14">
          The auspicious 48-minute celestial conjunction when Devi Durga transforms into Chamunda to vanquish Chanda and Munda.
        </text>
        <g transform="translate(800, 10)">
          <rect width="400" height="64" rx="14" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <text x="200" y="28" fill="${COLORS.gold}" font-size="14" font-weight="800" text-anchor="middle">Time Window: 11:48 PM – 12:36 AM</text>
          <text x="200" y="48" fill="${COLORS.darkTextMuted}" font-size="12" text-anchor="middle">Balidan: 12:12 AM • Pushpanjali: 12:20 AM</text>
        </g>
      </g>
    </g>

    <!-- Daily Tithis Grid (5 Cards: Sasthi, Saptami, Ashtami, Navami, Dashami) -->
    <g transform="translate(0, 270)">
      <!-- Day 1: Sasthi -->
      <g transform="translate(0, 0)">
        <rect width="1280" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="24" y="44" fill="${COLORS.red}" font-size="20" font-weight="900">Maha Sasthi</text>
        <text x="200" y="44" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Bodhon, Amantran &amp; Adhibas</text>
        <text x="500" y="44" fill="${COLORS.darkTextMuted}" font-size="13">Pratima Unveiling &amp; Prana Pratishtha</text>
        <text x="950" y="44" fill="${COLORS.darkTextSecondary}" font-size="13" font-weight="600">Evening: 6:45 PM – 8:15 PM</text>
      </g>

      <!-- Day 2: Saptami -->
      <g transform="translate(0, 86)">
        <rect width="1280" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="24" y="44" fill="${COLORS.teal}" font-size="20" font-weight="900">Maha Saptami</text>
        <text x="200" y="44" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Nabapatrika Snan (Kola Bou)</text>
        <text x="500" y="44" fill="${COLORS.darkTextMuted}" font-size="13">Holy bath at Hooghly riverfront ghats</text>
        <text x="950" y="44" fill="${COLORS.darkTextSecondary}" font-size="13" font-weight="600">Morning: 6:00 AM – 8:30 AM</text>
      </g>

      <!-- Day 3: Ashtami -->
      <g transform="translate(0, 172)">
        <rect width="1280" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.gold}" stroke-width="1"/>
        <text x="24" y="44" fill="${COLORS.gold}" font-size="20" font-weight="900">Maha Ashtami</text>
        <text x="200" y="44" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Pushpanjali &amp; Kumari Puja</text>
        <text x="500" y="44" fill="${COLORS.darkTextMuted}" font-size="13">Highest devotional attendance across all pandals</text>
        <text x="950" y="44" fill="${COLORS.darkTextSecondary}" font-size="13" font-weight="600">Pushpanjali: 9:30 AM – 10:45 AM</text>
      </g>

      <!-- Day 4: Navami -->
      <g transform="translate(0, 258)">
        <rect width="1280" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="24" y="44" fill="${COLORS.blue}" font-size="20" font-weight="900">Maha Navami</text>
        <text x="200" y="44" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Maha Aarti &amp; Dhunuchi Dance</text>
        <text x="500" y="44" fill="${COLORS.darkTextMuted}" font-size="13">Grand evening brass dhunuchi competitions with dhak</text>
        <text x="950" y="44" fill="${COLORS.darkTextSecondary}" font-size="13" font-weight="600">Aarti: 7:00 PM – 9:00 PM</text>
      </g>

      <!-- Day 5: Dashami -->
      <g transform="translate(0, 344)">
        <rect width="1280" height="74" rx="14" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="24" y="44" fill="${COLORS.red}" font-size="20" font-weight="900">Bijoya Dashami</text>
        <text x="200" y="44" fill="${COLORS.darkTextMain}" font-size="14" font-weight="700">Sindoor Khela &amp; Ghat Bisarjan</text>
        <text x="500" y="44" fill="${COLORS.darkTextMuted}" font-size="13">Immersion at Babughat &amp; Baje Kadamtala Ghat</text>
        <text x="950" y="44" fill="${COLORS.darkTextSecondary}" font-size="13" font-weight="600">Bisarjan: 4:00 PM – 11:00 PM</text>
      </g>
    </g>
  </g>

  ${renderDesktopFooter(950)}
</svg>`;
}

// -------------------------------------------------------------------------
// 5. Desktop Route Planner Screen (1440 x 1400)
// -------------------------------------------------------------------------
function generateDesktopPlanner() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1400" viewBox="0 0 1440 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="1440" height="1400" fill="${COLORS.darkBg}"/>

  ${renderDesktopHeader('Plan')}

  <g transform="translate(80, 96)">
    <text x="0" y="24" fill="${COLORS.darkTextMain}" font-size="34" font-weight="900">Pandal Hopping Route Planner</text>
    <text x="0" y="52" fill="${COLORS.darkTextMuted}" font-size="15">Build optimal hopping trails with real-time crowd and metro integration.</text>
  </g>

  <!-- Split Panel Workspace (Left: 460px itinerary, Right: 780px map simulation) -->
  <g transform="translate(80, 180)">
    <!-- LEFT PANEL: Route Summary & Stops -->
    <g id="Planner_Left_Panel" transform="translate(0, 0)">
      <!-- Route Metrics Card -->
      <rect width="460" height="110" rx="18" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
      <g transform="translate(24, 24)">
        <text x="0" y="16" fill="${COLORS.red}" font-size="11" font-weight="800">OPTIMIZED TRAIL</text>
        <text x="0" y="42" fill="${COLORS.darkTextMain}" font-size="20" font-weight="900">North Kolkata Heritage Trail</text>
        <text x="0" y="68" fill="${COLORS.darkTextMuted}" font-size="13">4 Pandals • 3.4 km • ~2 hrs 15 mins</text>
      </g>

      <!-- Sequential Stops List -->
      <g transform="translate(0, 130)">
        <!-- Stop 1 -->
        <g transform="translate(0, 0)">
          <rect width="460" height="84" rx="14" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <circle cx="36" cy="42" r="14" fill="${COLORS.red}"/>
          <text x="36" y="47" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">1</text>
          <text x="64" y="34" fill="${COLORS.darkTextMain}" font-size="15" font-weight="700">Bagbazar Sarbojanin</text>
          <text x="64" y="56" fill="${COLORS.darkTextMuted}" font-size="12">Start • Shyambazar Metro • Est. 35 mins</text>
        </g>
        <!-- Walking Connector -->
        <text x="36" y="104" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">🚶 8 mins (600m)</text>

        <!-- Stop 2 -->
        <g transform="translate(0, 120)">
          <rect width="460" height="84" rx="14" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <circle cx="36" cy="42" r="14" fill="${COLORS.teal}"/>
          <text x="36" y="47" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">2</text>
          <text x="64" y="34" fill="${COLORS.darkTextMain}" font-size="15" font-weight="700">Kumartuli Park</text>
          <text x="64" y="56" fill="${COLORS.darkTextMuted}" font-size="12">Artisan Idols • Est. 40 mins</text>
        </g>
        <text x="36" y="224" fill="${COLORS.darkTextMuted}" font-size="11" text-anchor="middle">🚶 12 mins (850m)</text>

        <!-- Stop 3 -->
        <g transform="translate(0, 240)">
          <rect width="460" height="84" rx="14" fill="${COLORS.darkCardElevated}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
          <circle cx="36" cy="42" r="14" fill="${COLORS.gold}"/>
          <text x="36" y="47" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">3</text>
          <text x="64" y="34" fill="${COLORS.darkTextMain}" font-size="15" font-weight="700">Sovabazar Rajbari</text>
          <text x="64" y="56" fill="${COLORS.darkTextMuted}" font-size="12">Bonedi Bari Heritage • Est. 45 mins</text>
        </g>

        <!-- Action Export Buttons -->
        <g transform="translate(0, 350)">
          <rect width="460" height="48" rx="14" fill="${COLORS.red}"/>
          <text x="230" y="30" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">🗺️ Export Trail to Google Maps</text>
        </g>
      </g>
    </g>

    <!-- RIGHT PANEL: Interactive Route Map Canvas -->
    <g id="Planner_Map_Canvas" transform="translate(500, 0)">
      <rect width="780" height="580" rx="20" fill="#1e1c1a" stroke="${COLORS.darkBorder}" stroke-width="1.5"/>
      
      <!-- River Hooghly Path (Curved Water Band) -->
      <path d="M 60 0 Q 120 200, 80 400 T 140 580" stroke="#1e3a5f" stroke-width="70" fill="none" opacity="0.6"/>
      <text x="80" y="300" fill="#4a7da5" font-size="12" font-weight="700" transform="rotate(-75, 80, 300)">Hooghly River</text>

      <!-- Roads Grid Simulation -->
      <path d="M 160 80 L 740 100 M 180 220 L 760 240 M 140 380 L 750 400 M 200 520 L 740 540" stroke="#2c2824" stroke-width="8"/>
      <path d="M 280 40 L 300 560 M 480 30 L 510 560 M 660 40 L 680 560" stroke="#2c2824" stroke-width="8"/>

      <!-- Metro Blue Line (Dotted Yellow/Blue Transit Line) -->
      <path d="M 500 0 L 520 580" stroke="#3b82f6" stroke-width="4" stroke-dasharray="8 6"/>
      <text x="530" y="80" fill="#60a5fa" font-size="11" font-weight="700">Metro Blue Line</text>

      <!-- Trail Route Connection (Red Neon Path) -->
      <path d="M 380 120 L 320 250 L 460 380" stroke="${COLORS.red}" stroke-width="4" stroke-dasharray="6 4"/>

      <!-- Pin 1 -->
      <g transform="translate(380, 120)">
        <circle cx="0" cy="0" r="18" fill="${COLORS.red}"/>
        <text x="0" y="5" fill="#FFFFFF" font-size="12" font-weight="900" text-anchor="middle">1</text>
        <rect x="25" y="-14" width="160" height="28" rx="8" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="105" y="4" fill="${COLORS.darkTextMain}" font-size="11" font-weight="700" text-anchor="middle">Bagbazar Sarbojanin</text>
      </g>

      <!-- Pin 2 -->
      <g transform="translate(320, 250)">
        <circle cx="0" cy="0" r="18" fill="${COLORS.teal}"/>
        <text x="0" y="5" fill="#FFFFFF" font-size="12" font-weight="900" text-anchor="middle">2</text>
        <rect x="25" y="-14" width="130" height="28" rx="8" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="90" y="4" fill="${COLORS.darkTextMain}" font-size="11" font-weight="700" text-anchor="middle">Kumartuli Park</text>
      </g>

      <!-- Pin 3 -->
      <g transform="translate(460, 380)">
        <circle cx="0" cy="0" r="18" fill="${COLORS.gold}"/>
        <text x="0" y="5" fill="#FFFFFF" font-size="12" font-weight="900" text-anchor="middle">3</text>
        <rect x="25" y="-14" width="140" height="28" rx="8" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <text x="95" y="4" fill="${COLORS.darkTextMain}" font-size="11" font-weight="700" text-anchor="middle">Sovabazar Rajbari</text>
      </g>
    </g>
  </g>

  ${renderDesktopFooter(950)}
</svg>`;
}

// -------------------------------------------------------------------------
// 6. Desktop Metro Guide Screen (1440 x 1400)
// -------------------------------------------------------------------------
function generateDesktopMetro() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1400" viewBox="0 0 1440 1400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_FONTS_AND_STYLES}
  <rect width="1440" height="1400" fill="${COLORS.darkBg}"/>

  ${renderDesktopHeader('More')}

  <g transform="translate(80, 100)">
    <text x="0" y="24" fill="${COLORS.darkTextMain}" font-size="34" font-weight="900">Kolkata Metro Timetable &amp; Puja Guide</text>
    <text x="0" y="52" fill="${COLORS.darkTextMuted}" font-size="15">Night-long special services across Blue Line (North-South) &amp; Green Line (East-West).</text>

    <!-- Special Puja Night Service Alert Banner -->
    <g transform="translate(0, 80)">
      <rect width="1280" height="70" rx="16" fill="${COLORS.redSoftDark}" stroke="${COLORS.redBorderDark}" stroke-width="1.5"/>
      <text x="24" y="42" font-size="20">🚇</text>
      <text x="60" y="32" fill="${COLORS.red}" font-size="14" font-weight="800">ALL-NIGHT SPECIAL PUJA TRAINS (SAPTHAMI TO DASHAMI)</text>
      <text x="60" y="52" fill="${COLORS.darkTextSecondary}" font-size="13">Trains operate every 12 to 15 minutes past midnight between Dakshineswar and Kavi Subhash.</text>
    </g>

    <!-- 2 Major Metro Line Cards (Blue & Green) -->
    <g transform="translate(0, 180)">
      <!-- Blue Line Card (624px) -->
      <g transform="translate(0, 0)">
        <rect width="624" height="420" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <g transform="translate(32, 32)">
          <rect width="100" height="26" rx="8" fill="rgba(37, 99, 235, 0.2)"/>
          <text x="50" y="18" fill="${COLORS.blue}" font-size="12" font-weight="800" text-anchor="middle">BLUE LINE 1</text>
          <text x="0" y="56" fill="${COLORS.darkTextMain}" font-size="20" font-weight="800">North-South Corridor</text>
          <text x="0" y="80" fill="${COLORS.darkTextMuted}" font-size="13">Dakshineswar ↔ Kavi Subhash (New Garia)</text>
          
          <!-- Station Stops List with Pandals -->
          <g transform="translate(0, 110)">
            <circle cx="8" cy="10" r="6" fill="${COLORS.blue}"/>
            <text x="24" y="15" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Shyambazar</text>
            <text x="140" y="15" fill="${COLORS.darkTextMuted}" font-size="12">→ Bagbazar Sarbojanin, Tala Pratyay</text>

            <circle cx="8" cy="45" r="6" fill="${COLORS.blue}"/>
            <text x="24" y="50" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Sovabazar</text>
            <text x="140" y="50" fill="${COLORS.darkTextMuted}" font-size="12">→ Sovabazar Rajbari, Kumartuli Park</text>

            <circle cx="8" cy="80" r="6" fill="${COLORS.blue}"/>
            <text x="24" y="85" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">MG Road</text>
            <text x="140" y="85" fill="${COLORS.darkTextMuted}" font-size="12">→ College Square, Mohammad Ali Park</text>

            <circle cx="8" cy="115" r="6" fill="${COLORS.blue}"/>
            <text x="24" y="120" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Kalighat</text>
            <text x="140" y="120" fill="${COLORS.darkTextMuted}" font-size="12">→ Deshapriya Park, Singhi Park, Mudiali</text>

            <circle cx="8" cy="150" r="6" fill="${COLORS.blue}"/>
            <text x="24" y="155" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Rabindra Sarobar</text>
            <text x="140" y="155" fill="${COLORS.darkTextMuted}" font-size="12">→ Suruchi Sangha, Chetla Agrani</text>
          </g>
        </g>
      </g>

      <!-- Green Line Card (624px) -->
      <g transform="translate(656, 0)">
        <rect width="624" height="420" rx="20" fill="${COLORS.darkCard}" stroke="${COLORS.darkBorder}" stroke-width="1"/>
        <g transform="translate(32, 32)">
          <rect width="110" height="26" rx="8" fill="rgba(13, 148, 136, 0.2)"/>
          <text x="55" y="18" fill="${COLORS.teal}" font-size="12" font-weight="800" text-anchor="middle">GREEN LINE 2</text>
          <text x="0" y="56" fill="${COLORS.darkTextMain}" font-size="20" font-weight="800">Underwater River Corridor</text>
          <text x="0" y="80" fill="${COLORS.darkTextMuted}" font-size="13">Howrah Maidan ↔ Salt Lake Sector V</text>
          
          <g transform="translate(0, 110)">
            <circle cx="8" cy="10" r="6" fill="${COLORS.teal}"/>
            <text x="24" y="15" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Howrah Station</text>
            <text x="140" y="15" fill="${COLORS.darkTextMuted}" font-size="12">→ Underwater connection to Central Kolkata</text>

            <circle cx="8" cy="45" r="6" fill="${COLORS.teal}"/>
            <text x="24" y="50" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Sealdah</text>
            <text x="140" y="50" fill="${COLORS.darkTextMuted}" font-size="12">→ Santosh Mitra Square, Jagat Mukherjee</text>

            <circle cx="8" cy="80" r="6" fill="${COLORS.teal}"/>
            <text x="24" y="85" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Karunamoyee</text>
            <text x="140" y="85" fill="${COLORS.darkTextMuted}" font-size="12">→ Salt Lake FD Block, BJ Block</text>

            <circle cx="8" cy="115" r="6" fill="${COLORS.teal}"/>
            <text x="24" y="120" fill="${COLORS.darkTextMain}" font-size="13" font-weight="700">Sector V</text>
            <text x="140" y="120" fill="${COLORS.darkTextMuted}" font-size="12">→ New Town Sarbojanin</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  ${renderDesktopFooter(950)}
</svg>`;
}

// Build & write all 6 desktop files
console.log('Generating authoritative Web Desktop SVGs...');
const screens = [
  { name: '01_web_desktop_home.svg', fn: generateDesktopHome },
  { name: '02_web_desktop_developer.svg', fn: generateDesktopDeveloper },
  { name: '03_web_desktop_explore.svg', fn: generateDesktopExplore },
  { name: '04_web_desktop_calendar.svg', fn: generateDesktopCalendar },
  { name: '05_web_desktop_planner.svg', fn: generateDesktopPlanner },
  { name: '06_web_desktop_metro.svg', fn: generateDesktopMetro }
];

screens.forEach(s => {
  const content = s.fn();
  const filePath = path.join(DESKTOP_DIR, s.name);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ Generated:', s.name, (content.length / 1024).toFixed(1) + ' KB');
});

console.log('All Web Desktop screens generated successfully.');
