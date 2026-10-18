const fs = require('fs');
const path = require('path');
const {
  OUT_DIR_LIGHT,
  ASSETS,
  CL,
  SVG_STYLE_LIGHT,
  renderHeaderLight,
  renderFooterLight,
  renderBackgroundLight
} = require('./faithful-desktop-light-shared');

function generateHomeLight() {
  const W = 1440;
  const H = 1150;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE_LIGHT}
  ${renderBackgroundLight(H, true)}
  ${renderHeaderLight('Explore')}

  <!-- HERO CARD (x: 144, y: 88, w: 1152, h: 290) -->
  <g id="Hero_Card" transform="translate(144, 88)" filter="url(#softShadow)">
    <rect width="1152" height="290" rx="24" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
    
    <g transform="translate(48, 40)">
      <!-- Pill: Puja is live -->
      <g id="Hero_Status_Pill">
        <rect width="118" height="28" rx="14" fill="${CL.redPillBg}" stroke="${CL.redPillBorder}" stroke-width="1"/>
        <text x="14" y="19" fill="${CL.redPillText}" font-size="12">📅</text>
        <text x="34" y="19" fill="${CL.redPillText}" font-size="12" font-weight="700">Puja is live</text>
      </g>

      <!-- Heading -->
      <text x="0" y="82" fill="${CL.textMain}" font-size="40" font-weight="800" letter-spacing="-0.8">Your Puja, made simple.</text>
      <text x="0" y="118" fill="${CL.textMuted}" font-size="16" font-weight="400">Find the pandals you love, build a route, and head out with confidence.</text>

      <!-- Buttons: Find pandals -> & Build a route -->
      <g transform="translate(0, 150)">
        <!-- Find pandals -->
        <g id="Btn_Find_Pandals">
          <rect width="170" height="46" rx="14" fill="${CL.red}"/>
          <text x="22" y="28" fill="${CL.white}" font-size="15">🔍</text>
          <text x="46" y="28" fill="${CL.white}" font-size="15" font-weight="700">Find pandals  →</text>
        </g>
        <!-- Build a route -->
        <g id="Btn_Build_Route" transform="translate(186, 0)">
          <rect width="144" height="46" rx="14" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
          <text x="20" y="28" fill="${CL.textMain}" font-size="15">🧭</text>
          <text x="44" y="28" fill="${CL.textMain}" font-size="15" font-weight="700">Build a route</text>
        </g>
      </g>
    </g>
  </g>

  <!-- QUICK ACCESS SECTION (y: 406) -->
  <g id="Quick_Access_Section" transform="translate(144, 406)">
    <text x="0" y="22" fill="${CL.textMain}" font-size="20" font-weight="800">Quick Access</text>

    <!-- 6 Cards Row (w: 180, h: 104, gap: 14) -->
    <g transform="translate(0, 36)">
      <!-- 1. Map -->
      <g id="Card_QA_Map" transform="translate(0, 0)">
        <rect width="180" height="104" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="#feeceb"/>
        <text x="24" y="36" fill="${CL.red}" font-size="16">📍</text>
        <text x="14" y="68" fill="${CL.textMain}" font-size="14" font-weight="700">Map</text>
        <text x="14" y="86" fill="${CL.textSubtle}" font-size="11">See all pandals at a glance</text>
      </g>

      <!-- 2. Route Planner -->
      <g id="Card_QA_Planner" transform="translate(194, 0)">
        <rect width="180" height="104" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="#ccfbf1"/>
        <text x="24" y="36" fill="${CL.teal}" font-size="16">🧭</text>
        <text x="14" y="68" fill="${CL.textMain}" font-size="14" font-weight="700">Route Planner</text>
        <text x="14" y="86" fill="${CL.textSubtle}" font-size="11">Optimize your hopping trail</text>
      </g>

      <!-- 3. Metro Guide -->
      <g id="Card_QA_Metro" transform="translate(388, 0)">
        <rect width="180" height="104" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="#dbeafe"/>
        <text x="24" y="36" fill="${CL.blueLine}" font-size="16">🚇</text>
        <text x="14" y="68" fill="${CL.textMain}" font-size="14" font-weight="700">Metro Guide</text>
        <text x="14" y="86" fill="${CL.textSubtle}" font-size="11">Find nearest metro stations</text>
      </g>

      <!-- 4. Calendar -->
      <g id="Card_QA_Calendar" transform="translate(582, 0)">
        <rect width="180" height="104" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="#ffedd5"/>
        <text x="24" y="36" fill="#ea580c" font-size="16">📅</text>
        <text x="14" y="68" fill="${CL.textMain}" font-size="14" font-weight="700">Calendar</text>
        <text x="14" y="86" fill="${CL.textSubtle}" font-size="11">Auspicious tithis and hours</text>
      </g>

      <!-- 5. Puja Music -->
      <g id="Card_QA_Music" transform="translate(776, 0)">
        <rect width="180" height="104" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="#ede9fe"/>
        <text x="24" y="36" fill="${CL.purplePill}" font-size="16">🎵</text>
        <text x="14" y="68" fill="${CL.textMain}" font-size="14" font-weight="700">Puja Music</text>
        <text x="14" y="86" fill="${CL.textSubtle}" font-size="11">Chandi Path &amp; Dhak beats</text>
      </g>

      <!-- 6. Mahalaya -->
      <g id="Card_QA_Mahalaya" transform="translate(970, 0)">
        <rect width="180" height="104" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <rect x="14" y="14" width="34" height="34" rx="10" fill="#fef3c7"/>
        <text x="24" y="36" fill="#d97706" font-size="16">✨</text>
        <text x="14" y="68" fill="${CL.textMain}" font-size="14" font-weight="700">Mahalaya</text>
        <text x="14" y="86" fill="${CL.textSubtle}" font-size="11">Timeless dawn broadcast</text>
      </g>
    </g>
  </g>

  <!-- PUJA HIGHLIGHTS (y: 574) -->
  <g id="Puja_Highlights_Section" transform="translate(144, 574)">
    <g>
      <text x="0" y="20" fill="${CL.red}" font-size="16">❖</text>
      <text x="20" y="20" fill="${CL.textMain}" font-size="18" font-weight="800">Puja Highlights</text>
      <text x="0" y="44" fill="${CL.textSubtle}" font-size="13">A glimpse of Bengal's Durga Puja culture</text>
      <text x="1152" y="24" fill="${CL.red}" font-size="13" font-weight="700" text-anchor="end">View all →</text>
    </g>

    <!-- 3 Photo Cards Row (w: 368, h: 104, gap: 24) -->
    <g transform="translate(0, 60)">
      <!-- Card 1: Traditions & Art -->
      <g id="Highlight_Card_1" transform="translate(0, 0)">
        <rect width="368" height="104" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(12, 12)">
          <clipPath id="hl1_clip"><rect width="90" height="80" rx="10"/></clipPath>
          <image href="${ASSETS.sovabazar}" width="90" height="80" preserveAspectRatio="xMidYMid slice" clip-path="url(#hl1_clip)"/>
          <rect y="0" width="70" height="16" rx="4" fill="#000000" fill-opacity="0.6"/>
          <text x="4" y="12" fill="${CL.white}" font-size="8" font-weight="700">Traditions &amp; Art</text>
        </g>
        <text x="114" y="38" fill="${CL.textMain}" font-size="14" font-weight="700">Traditions &amp; Pandal Art</text>
        <text x="114" y="58" fill="${CL.textSubtle}" font-size="11">Discover Bengal's timeless heritage</text>
        <text x="114" y="74" fill="${CL.textSubtle}" font-size="11">celebrations and creative...</text>
      </g>

      <!-- Card 2: Sacred Almanac -->
      <g id="Highlight_Card_2" transform="translate(392, 0)">
        <rect width="368" height="104" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(12, 12)">
          <clipPath id="hl2_clip"><rect width="90" height="80" rx="10"/></clipPath>
          <image href="${ASSETS.bagbazar}" width="90" height="80" preserveAspectRatio="xMidYMid slice" clip-path="url(#hl2_clip)"/>
          <rect y="0" width="50" height="16" rx="4" fill="#000000" fill-opacity="0.6"/>
          <text x="6" y="12" fill="${CL.white}" font-size="8" font-weight="700">Almanac</text>
        </g>
        <text x="114" y="38" fill="${CL.textMain}" font-size="14" font-weight="700">Sacred Almanac &amp; Timings</text>
        <text x="114" y="58" fill="${CL.textSubtle}" font-size="11">Accurate Ashtami Sandhi Puja,</text>
        <text x="114" y="74" fill="${CL.textSubtle}" font-size="11">Pushpanjali, and tithi timings.</text>
      </g>

      <!-- Card 3: Pujo Evenings & Routes -->
      <g id="Highlight_Card_3" transform="translate(784, 0)">
        <rect width="368" height="104" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(12, 12)">
          <clipPath id="hl3_clip"><rect width="90" height="80" rx="10"/></clipPath>
          <image href="${ASSETS.ekdalia}" width="90" height="80" preserveAspectRatio="xMidYMid slice" clip-path="url(#hl3_clip)"/>
          <rect y="0" width="46" height="16" rx="4" fill="#000000" fill-opacity="0.6"/>
          <text x="6" y="12" fill="${CL.white}" font-size="8" font-weight="700">Routes</text>
        </g>
        <text x="114" y="38" fill="${CL.textMain}" font-size="14" font-weight="700">Pujo Evenings &amp; Routes</text>
        <text x="114" y="58" fill="${CL.textSubtle}" font-size="11">Plan your route for the best evening</text>
        <text x="114" y="74" fill="${CL.textSubtle}" font-size="11">hopping and illumination.</text>
      </g>
    </g>
  </g>

  <!-- 6 FEATURE PILLS ROW (y: 772) -->
  <g id="Feature_Pills_Row" transform="translate(144, 772)">
    <!-- 1: Ultra Simple -->
    <g id="Pill_1" transform="translate(0, 0)">
      <rect width="180" height="52" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="14" y="31" fill="${CL.textMuted}" font-size="14">🪄</text>
      <text x="36" y="24" fill="${CL.textMain}" font-size="12" font-weight="700">Ultra Simple</text>
      <text x="36" y="38" fill="${CL.textFaint}" font-size="10">Only what you need</text>
    </g>

    <!-- 2: Lightning Fast -->
    <g id="Pill_2" transform="translate(194, 0)">
      <rect width="180" height="52" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="14" y="31" fill="#ea580c" font-size="14">⚡</text>
      <text x="36" y="24" fill="${CL.textMain}" font-size="12" font-weight="700">Lightning Fast</text>
      <text x="36" y="38" fill="${CL.textFaint}" font-size="10">Smooth experience</text>
    </g>

    <!-- 3: Fully Responsive -->
    <g id="Pill_3" transform="translate(388, 0)">
      <rect width="180" height="52" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="14" y="31" fill="${CL.teal}" font-size="14">📱</text>
      <text x="36" y="24" fill="${CL.textMain}" font-size="12" font-weight="700">Fully Responsive</text>
      <text x="36" y="38" fill="${CL.textFaint}" font-size="10">All devices</text>
    </g>

    <!-- 4: Dark Mode (Click to toggle) -->
    <g id="Pill_4" transform="translate(582, 0)">
      <rect width="180" height="52" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="14" y="31" fill="${CL.textMuted}" font-size="14">🌙</text>
      <text x="36" y="24" fill="${CL.textMain}" font-size="12" font-weight="700">Dark Mode</text>
      <text x="36" y="38" fill="${CL.textFaint}" font-size="10">Click to toggle</text>
    </g>

    <!-- 5: Bengali & English -->
    <g id="Pill_5" transform="translate(776, 0)">
      <rect width="180" height="52" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="14" y="31" fill="${CL.blueLine}" font-size="14">🌐</text>
      <text x="36" y="24" fill="${CL.textMain}" font-size="12" font-weight="700">Bengali &amp; English</text>
      <text x="36" y="38" fill="${CL.textFaint}" font-size="10">Click to toggle</text>
    </g>

    <!-- 6: Saved Trails -->
    <g id="Pill_6" transform="translate(970, 0)">
      <rect width="180" height="52" rx="16" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="14" y="31" fill="${CL.red}" font-size="14">♡</text>
      <text x="36" y="24" fill="${CL.textMain}" font-size="12" font-weight="700">Saved Trails</text>
      <text x="36" y="38" fill="${CL.textFaint}" font-size="10">Saved favorites</text>
    </g>
  </g>

  ${renderFooterLight(992)}
</svg>
`;
}

const homeSvg = generateHomeLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '01_web_desktop_home_light.svg'), homeSvg, 'utf8');
console.log(`✓ Generated 01_web_desktop_home_light.svg (${(homeSvg.length / 1024).toFixed(1)} KB)`);
