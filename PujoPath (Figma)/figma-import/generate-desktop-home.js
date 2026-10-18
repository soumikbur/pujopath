const fs = require('fs');
const path = require('path');
const {
  OUT_DIR,
  ASSETS,
  C,
  SVG_STYLE,
  renderHeader,
  renderFooter,
  renderBackground
} = require('./faithful-desktop-shared');

// 1. HOME FRAME (1440 x 1150 px) - Exact match for deployed home
function generateHome() {
  const W = 1440;
  const H = 1150;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderBackground(H)}
  ${renderHeader('Explore')}

  <!-- HERO CARD (x: 144, y: 88, w: 1152, h: 290) -->
  <g id="Hero_Card" transform="translate(144, 88)">
    <rect width="1152" height="290" rx="24" fill="${C.cardBg}" fill-opacity="0.9" stroke="${C.cardBorder}" stroke-width="1"/>
    
    <g transform="translate(48, 40)">
      <!-- Pill: Puja is live -->
      <g id="Hero_Status_Pill">
        <rect width="118" height="28" rx="14" fill="${C.redPillBg}" stroke="${C.redPillBorder}" stroke-width="1"/>
        <text x="14" y="19" fill="${C.redPillText}" font-size="12">📅</text>
        <text x="34" y="19" fill="${C.redPillText}" font-size="12" font-weight="700">Puja is live</text>
      </g>

      <!-- Heading -->
      <text x="0" y="82" fill="${C.textMain}" font-size="40" font-weight="800" letter-spacing="-0.8">Your Puja, made simple.</text>
      <text x="0" y="118" fill="${C.textMuted}" font-size="16" font-weight="400">Find the pandals you love, build a route, and head out with confidence.</text>

      <!-- Buttons: Find pandals -> & Build a route -->
      <g transform="translate(0, 150)">
        <!-- Find pandals -->
        <g id="Btn_Find_Pandals">
          <rect width="170" height="46" rx="14" fill="${C.red}"/>
          <text x="22" y="28" fill="${C.white}" font-size="15">🔍</text>
          <text x="46" y="28" fill="${C.white}" font-size="15" font-weight="700">Find pandals  →</text>
        </g>
        <!-- Build a route -->
        <g id="Btn_Build_Route" transform="translate(186, 0)">
          <rect width="144" height="46" rx="14" fill="${C.cardElevated}" stroke="#42372e" stroke-width="1"/>
          <text x="20" y="28" fill="${C.textMain}" font-size="15">🧭</text>
          <text x="44" y="28" fill="${C.textMain}" font-size="15" font-weight="700">Build a route</text>
        </g>
      </g>
    </g>
  </g>

  <!-- QUICK ACCESS SECTION (y: 406) -->
  <g id="Quick_Access_Section" transform="translate(144, 406)">
    <text x="0" y="22" fill="${C.textMain}" font-size="20" font-weight="800">Quick Access</text>

    <!-- 6 Cards Row (w: 180, h: 104, gap: 14) -->
    <g transform="translate(0, 36)">
      <!-- 1. Map -->
      <g id="Card_QA_Map" transform="translate(0, 0)">
        <rect width="180" height="104" rx="16" fill="${C.cardBg}" fill-opacity="0.8" stroke="${C.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="${C.red}" fill-opacity="0.12"/>
        <text x="24" y="36" fill="${C.red}" font-size="16">📍</text>
        <text x="14" y="68" fill="${C.textMain}" font-size="14" font-weight="700">Map</text>
        <text x="14" y="86" fill="${C.textMuted}" font-size="11">See all pandals at a glance</text>
      </g>

      <!-- 2. Route Planner -->
      <g id="Card_QA_Planner" transform="translate(194, 0)">
        <rect width="180" height="104" rx="16" fill="${C.cardBg}" fill-opacity="0.8" stroke="${C.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="${C.teal}" fill-opacity="0.12"/>
        <text x="24" y="36" fill="${C.teal}" font-size="16">🧭</text>
        <text x="14" y="68" fill="${C.textMain}" font-size="14" font-weight="700">Route Planner</text>
        <text x="14" y="86" fill="${C.textMuted}" font-size="11">Optimize your hopping trail</text>
      </g>

      <!-- 3. Metro Guide -->
      <g id="Card_QA_Metro" transform="translate(388, 0)">
        <rect width="180" height="104" rx="16" fill="${C.cardBg}" fill-opacity="0.8" stroke="${C.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="${C.blueLine}" fill-opacity="0.12"/>
        <text x="24" y="36" fill="${C.blueLine}" font-size="16">🚇</text>
        <text x="14" y="68" fill="${C.textMain}" font-size="14" font-weight="700">Metro Guide</text>
        <text x="14" y="86" fill="${C.textMuted}" font-size="11">Find nearest metro stations</text>
      </g>

      <!-- 4. Calendar -->
      <g id="Card_QA_Calendar" transform="translate(582, 0)">
        <rect width="180" height="104" rx="16" fill="${C.cardBg}" fill-opacity="0.8" stroke="${C.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="#ea580c" fill-opacity="0.12"/>
        <text x="24" y="36" fill="#ea580c" font-size="16">📅</text>
        <text x="14" y="68" fill="${C.textMain}" font-size="14" font-weight="700">Calendar</text>
        <text x="14" y="86" fill="${C.textMuted}" font-size="11">Auspicious tithis and hours</text>
      </g>

      <!-- 5. Puja Music -->
      <g id="Card_QA_Music" transform="translate(776, 0)">
        <rect width="180" height="104" rx="16" fill="${C.cardBg}" fill-opacity="0.8" stroke="${C.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="${C.purplePill}" fill-opacity="0.12"/>
        <text x="24" y="36" fill="${C.purplePill}" font-size="16">🎵</text>
        <text x="14" y="68" fill="${C.textMain}" font-size="14" font-weight="700">Puja Music</text>
        <text x="14" y="86" fill="${C.textMuted}" font-size="11">Chandi Path &amp; Dhak beats</text>
      </g>

      <!-- 6. Mahalaya -->
      <g id="Card_QA_Mahalaya" transform="translate(970, 0)">
        <rect width="182" height="104" rx="16" fill="${C.cardBg}" fill-opacity="0.8" stroke="${C.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="${C.amberStar}" fill-opacity="0.12"/>
        <text x="24" y="36" fill="${C.amberStar}" font-size="16">✨</text>
        <text x="14" y="68" fill="${C.textMain}" font-size="14" font-weight="700">Mahalaya</text>
        <text x="14" y="86" fill="${C.textMuted}" font-size="11">Timeless dawn broadcast</text>
      </g>
    </g>
  </g>

  <!-- PUJA HIGHLIGHTS SECTION (y: 574) -->
  <g id="Puja_Highlights_Section" transform="translate(144, 574)">
    <g transform="translate(0, 0)">
      <text x="0" y="20" fill="${C.red}" font-size="18">✦</text>
      <text x="20" y="20" fill="${C.textMain}" font-size="18" font-weight="800">Puja Highlights</text>
      <text x="0" y="42" fill="${C.textMuted}" font-size="13">A glimpse of Bengal's Durga Puja culture</text>
      <text x="1152" y="30" fill="${C.red}" font-size="14" font-weight="700" text-anchor="end">View all →</text>
    </g>

    <!-- 3 Photo Cards Row (w: 368, h: 104) -->
    <g transform="translate(0, 58)">
      <!-- Card 1: Traditions & Art -->
      <g id="Highlight_Card_1" transform="translate(0, 0)">
        <rect width="368" height="104" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <clipPath id="clipPandal1"><rect x="12" y="12" width="108" height="80" rx="10"/></clipPath>
        <image href="${ASSETS.sovabazar}" x="12" y="12" width="108" height="80" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipPandal1)"/>
        <!-- Pill over photo -->
        <rect x="18" y="18" width="76" height="18" rx="6" fill="#000000" fill-opacity="0.6"/>
        <text x="56" y="31" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">Traditions &amp; Art</text>

        <text x="132" y="38" fill="${C.textMain}" font-size="14" font-weight="700">Traditions &amp; Pandal Art</text>
        <text x="132" y="58" fill="${C.textMuted}" font-size="11">Discover Bengal's timeless heritage</text>
        <text x="132" y="74" fill="${C.textMuted}" font-size="11">celebrations and creative...</text>
      </g>

      <!-- Card 2: Almanac -->
      <g id="Highlight_Card_2" transform="translate(392, 0)">
        <rect width="368" height="104" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <clipPath id="clipPandal2"><rect x="12" y="12" width="108" height="80" rx="10"/></clipPath>
        <image href="${ASSETS.bagbazar}" x="12" y="12" width="108" height="80" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipPandal2)"/>
        <!-- Pill over photo -->
        <rect x="18" y="18" width="56" height="18" rx="6" fill="#000000" fill-opacity="0.6"/>
        <text x="46" y="31" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">Almanac</text>

        <text x="132" y="38" fill="${C.textMain}" font-size="14" font-weight="700">Sacred Almanac &amp; Timings</text>
        <text x="132" y="58" fill="${C.textMuted}" font-size="11">Accurate Ashtami Sandhi Puja,</text>
        <text x="132" y="74" fill="${C.textMuted}" font-size="11">Pushpanjali, and tithi timings.</text>
      </g>

      <!-- Card 3: Routes -->
      <g id="Highlight_Card_3" transform="translate(784, 0)">
        <rect width="368" height="104" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <clipPath id="clipPandal3"><rect x="12" y="12" width="108" height="80" rx="10"/></clipPath>
        <image href="${ASSETS.collegeSquare}" x="12" y="12" width="108" height="80" preserveAspectRatio="xMidYMid slice" clip-path="url(#clipPandal3)"/>
        <!-- Pill over photo -->
        <rect x="18" y="18" width="50" height="18" rx="6" fill="#000000" fill-opacity="0.6"/>
        <text x="43" y="31" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">Routes</text>

        <text x="132" y="38" fill="${C.textMain}" font-size="14" font-weight="700">Pujo Evenings &amp; Routes</text>
        <text x="132" y="58" fill="${C.textMuted}" font-size="11">Plan your route for the best evening</text>
        <text x="132" y="74" fill="${C.textMuted}" font-size="11">hopping and illumination.</text>
      </g>
    </g>
  </g>

  <!-- FEATURE PILLS ROW (y: 760) -->
  <g id="Feature_Pills_Section" transform="translate(144, 760)">
    <!-- 6 Pills (w: 180, h: 52) -->
    <!-- 1 -->
    <g transform="translate(0, 0)">
      <rect width="180" height="52" rx="14" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="14" y="32" fill="${C.red}" font-size="14">🪄</text>
      <text x="36" y="24" fill="${C.textMain}" font-size="12" font-weight="700">Ultra Simple</text>
      <text x="36" y="40" fill="${C.textMuted}" font-size="10">Only what you need</text>
    </g>
    <!-- 2 -->
    <g transform="translate(194, 0)">
      <rect width="180" height="52" rx="14" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="14" y="32" fill="${C.red}" font-size="14">⚡</text>
      <text x="36" y="24" fill="${C.textMain}" font-size="12" font-weight="700">Lightning Fast</text>
      <text x="36" y="40" fill="${C.textMuted}" font-size="10">Smooth experience</text>
    </g>
    <!-- 3 -->
    <g transform="translate(388, 0)">
      <rect width="180" height="52" rx="14" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="14" y="32" fill="${C.red}" font-size="14">📱</text>
      <text x="36" y="24" fill="${C.textMain}" font-size="12" font-weight="700">Fully Responsive</text>
      <text x="36" y="40" fill="${C.textMuted}" font-size="10">All devices</text>
    </g>
    <!-- 4 -->
    <g transform="translate(582, 0)">
      <rect width="180" height="52" rx="14" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="14" y="32" fill="${C.red}" font-size="14">☼</text>
      <text x="36" y="24" fill="${C.textMain}" font-size="12" font-weight="700">Light Mode</text>
      <text x="36" y="40" fill="${C.textMuted}" font-size="10">Click to toggle</text>
    </g>
    <!-- 5 -->
    <g transform="translate(776, 0)">
      <rect width="180" height="52" rx="14" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="14" y="32" fill="${C.red}" font-size="14">🌐</text>
      <text x="36" y="24" fill="${C.textMain}" font-size="12" font-weight="700">Bengali &amp; English</text>
      <text x="36" y="40" fill="${C.textMuted}" font-size="10">Click to toggle</text>
    </g>
    <!-- 6 -->
    <g transform="translate(970, 0)">
      <rect width="182" height="52" rx="14" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="14" y="32" fill="${C.red}" font-size="14">♡</text>
      <text x="36" y="24" fill="${C.textMain}" font-size="12" font-weight="700">Saved Trails</text>
      <text x="36" y="40" fill="${C.textMuted}" font-size="10">Saved favorites</text>
    </g>
  </g>

  <!-- FOOTER -->
  ${renderFooter(860)}
</svg>
`;
}

// Write Home SVG
fs.writeFileSync(path.join(OUT_DIR, '01_web_desktop_home.svg'), generateHome().trim());
console.log('✓ 01_web_desktop_home.svg generated');
