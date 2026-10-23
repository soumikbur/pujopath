const fs = require('fs');
const path = require('path');
const {
  TOKENS,
  IMAGES,
  SVG_STYLE,
  renderNativeStatusBar,
  renderNativeGesturePill,
  renderNativeHeader,
  renderNativeBottomNav
} = require('./faithful-native-shared');

const OUT_DIR = path.resolve(__dirname, '../exports/native-android');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// -----------------------------------------------------------------------------
// 1. Festival Select Screen (412 x 915)
// -----------------------------------------------------------------------------
function generateFestivalSelect(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="915" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}

  <!-- Top Header -->
  <g transform="translate(0, 40)">
    <rect width="412" height="56" fill="${t.headerBg}"/>
    <line x1="0" y1="56" x2="412" y2="56" stroke="${t.headerBorder}" stroke-width="1"/>
    <text x="18" y="36" fill="${t.red}" font-size="22" font-weight="900" class="brand">PujoPath</text>
    <g transform="translate(112, 16)">
      <rect width="108" height="24" rx="6" fill="${t.redPillBg}" stroke="${t.redPillBorder}" stroke-width="1"/>
      <text x="54" y="16" fill="${t.redPillText}" font-size="10" font-weight="800" text-anchor="middle">FESTIVAL EDITION</text>
    </g>
    <g transform="translate(300, 10)">
      <rect width="36" height="36" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="18" y="23" fill="${t.textMuted}" font-size="14" text-anchor="middle">${t.themeIcon}</text>
    </g>
    <g transform="translate(344, 10)">
      <rect width="52" height="36" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <rect x="2" y="3" width="22" height="30" rx="8" fill="${t.red}"/>
      <text x="13" y="22" fill="#FFFFFF" font-size="9" font-weight="800" text-anchor="middle">EN</text>
      <text x="36" y="22" fill="${t.textMuted}" font-size="10" class="bengali" text-anchor="middle">বাংলা</text>
    </g>
  </g>

  <!-- Title & Subtitle -->
  <g transform="translate(20, 115)">
    <text x="186" y="20" fill="${t.textMain}" font-size="24" font-weight="800" text-anchor="middle">Choose Your Festival</text>
    <text x="186" y="42" fill="${t.textMuted}" font-size="12" text-anchor="middle">Immerse in Bengal's sacred celebrations. Select an experience</text>
    <text x="186" y="58" fill="${t.textMuted}" font-size="12" text-anchor="middle">below to enter its dedicated world of pandals, rituals, and music.</text>
  </g>

  <!-- Card 1: Durga Puja -->
  <g transform="translate(20, 195)">
    <rect width="372" height="330" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="durga_clip_${isDark ? 'd' : 'l'}"><rect width="372" height="150" rx="20"/></clipPath>
    <g clip-path="url(#durga_clip_${isDark ? 'd' : 'l'})">
      <image href="${IMAGES.durgaBg || IMAGES.heroDurga}" width="372" height="150" preserveAspectRatio="xMidYMid slice"/>
      <rect width="372" height="150" fill="black" fill-opacity="0.25"/>
    </g>
    <g transform="translate(16, 16)">
      <rect width="138" height="24" rx="12" fill="${t.red}"/>
      <text x="69" y="16" fill="#FFFFFF" font-size="10" font-weight="800" text-anchor="middle">🍁 SHARODOTSAV 2026</text>
    </g>
    <text x="20" y="184" fill="${t.textMain}" font-size="20" font-weight="800">Durga Puja</text>
    <text x="20" y="202" fill="${t.red}" font-size="12" font-weight="700">Grand Autumn Heritage Carnival</text>
    <text x="20" y="222" fill="${t.textMuted}" font-size="11">Explore 774+ iconic pandals across Kolkata, heritage Bonedi</text>
    <text x="20" y="238" fill="${t.textMuted}" font-size="11">Bari traditions, smart hopping routes, and festive dhak beats.</text>

    <!-- Chips -->
    <g transform="translate(20, 252)">
      <rect width="84" height="22" rx="6" fill="${t.redPillBg}"/>
      <text x="42" y="15" fill="${t.redPillText}" font-size="10" font-weight="600" text-anchor="middle">📍 774 Pandals</text>
      <g transform="translate(90, 0)">
        <rect width="90" height="22" rx="6" fill="${t.redPillBg}"/>
        <text x="45" y="15" fill="${t.redPillText}" font-size="10" font-weight="600" text-anchor="middle">🗺️ Hopping Trails</text>
      </g>
      <g transform="translate(186, 0)">
        <rect width="70" height="22" rx="6" fill="${t.redPillBg}"/>
        <text x="35" y="15" fill="${t.redPillText}" font-size="10" font-weight="600" text-anchor="middle">📅 Almanac</text>
      </g>
      <g transform="translate(262, 0)">
        <rect width="70" height="22" rx="6" fill="${t.redPillBg}"/>
        <text x="35" y="15" fill="${t.redPillText}" font-size="10" font-weight="600" text-anchor="middle">🎵 Dhak Music</text>
      </g>
    </g>

    <!-- Button -->
    <g transform="translate(20, 282)">
      <rect width="332" height="38" rx="14" fill="${t.red}"/>
      <text x="166" y="24" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Enter Durga Puja Experience →</text>
    </g>
  </g>

  <!-- Card 2: Kali Puja -->
  <g transform="translate(20, 545)">
    <rect width="372" height="330" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="kali_clip_${isDark ? 'd' : 'l'}"><rect width="372" height="150" rx="20"/></clipPath>
    <g clip-path="url(#kali_clip_${isDark ? 'd' : 'l'})">
      <rect width="372" height="150" fill="#2d124d"/>
      <image href="${IMAGES.miniplayer || IMAGES.durgaMandala}" width="372" height="150" preserveAspectRatio="xMidYMid slice"/>
      <rect width="372" height="150" fill="#18072b" fill-opacity="0.4"/>
    </g>
    <g transform="translate(16, 16)">
      <rect width="168" height="24" rx="12" fill="#581c87"/>
      <text x="84" y="16" fill="#f3e8ff" font-size="10" font-weight="800" text-anchor="middle">🪔 DIPANWITA AMAVASYA 2026</text>
    </g>
    <text x="20" y="184" fill="${t.textMain}" font-size="20" font-weight="800">Kali Puja</text>
    <text x="20" y="202" fill="#d97706" font-size="12" font-weight="700">Devotion, Illumination &amp; Shaktipeeths</text>
    <text x="20" y="222" fill="${t.textMuted}" font-size="11">Journey through revered Shaktipeeths, authentic midnight</text>
    <text x="20" y="238" fill="${t.textMuted}" font-size="11">timings, Barasat mega pandals, and soulful Shyama Sangeet.</text>

    <!-- Chips -->
    <g transform="translate(20, 252)">
      <rect width="90" height="22" rx="6" fill="#f3e8ff" stroke="#d8b4fe" stroke-width="1"/>
      <text x="45" y="15" fill="#581c87" font-size="10" font-weight="600" text-anchor="middle">🏛️ 33 Pandals</text>
      <g transform="translate(96, 0)">
        <rect width="84" height="22" rx="6" fill="#f3e8ff" stroke="#d8b4fe" stroke-width="1"/>
        <text x="42" y="15" fill="#581c87" font-size="10" font-weight="600" text-anchor="middle">🕒 Midnight Tithi</text>
      </g>
      <g transform="translate(186, 0)">
        <rect width="70" height="22" rx="6" fill="#f3e8ff" stroke="#d8b4fe" stroke-width="1"/>
        <text x="35" y="15" fill="#581c87" font-size="10" font-weight="600" text-anchor="middle">🪔 14 Diyas</text>
      </g>
      <g transform="translate(262, 0)">
        <rect width="70" height="22" rx="6" fill="#f3e8ff" stroke="#d8b4fe" stroke-width="1"/>
        <text x="35" y="15" fill="#581c87" font-size="10" font-weight="600" text-anchor="middle">🎵 Shyama Songs</text>
      </g>
    </g>

    <!-- Button -->
    <g transform="translate(20, 282)">
      <rect width="332" height="38" rx="14" fill="#6b21a8"/>
      <text x="166" y="24" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Enter Kali Puja Experience →</text>
    </g>
  </g>

  ${renderNativeGesturePill(891, isDark)}
</svg>`;
}

// -----------------------------------------------------------------------------
// 2. Native Home Screen (412 x 915) - Pixel matching emulator screenshot!
// -----------------------------------------------------------------------------
function generateNativeHome(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="915" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('', isDark, { festivalPill: '🌸 Durga Puja' })}

  <!-- Hero Card: Your Puja, made simple. -->
  <g transform="translate(16, 110)">
    <rect width="380" height="240" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    
    <g transform="translate(20, 20)">
      <rect width="86" height="22" rx="11" fill="${t.redPillBg}" stroke="${t.redPillBorder}" stroke-width="1"/>
      <text x="43" y="15" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">📅 Puja is live</text>
    </g>

    <text x="20" y="74" fill="${t.textMain}" font-size="24" font-weight="900" letter-spacing="-0.5">Your Puja, made simple.</text>
    <text x="20" y="98" fill="${t.textMuted}" font-size="12">Find the pandals you love, build a route, and head out with confidence.</text>

    <!-- Buttons -->
    <g transform="translate(20, 126)">
      <rect width="340" height="42" rx="16" fill="${t.red}"/>
      <text x="170" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">🔍 Find pandals →</text>
    </g>
    <g transform="translate(20, 176)">
      <rect width="340" height="42" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1.5"/>
      <text x="170" y="26" fill="${t.textMain}" font-size="13" font-weight="700" text-anchor="middle">↗ Build a route</text>
    </g>
  </g>

  <!-- Quick Access Header -->
  <text x="20" y="380" fill="${t.textMain}" font-size="16" font-weight="800">Quick Access</text>

  <!-- Quick Access Grid: 2 columns x 3 rows -->
  <!-- Row 1: Map & Route Planner -->
  <g transform="translate(16, 396)">
    <!-- Map -->
    <rect width="184" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <rect x="14" y="14" width="34" height="34" rx="10" fill="${t.redPillBg}"/>
    <text x="31" y="36" fill="${t.red}" font-size="16" text-anchor="middle">📍</text>
    <text x="14" y="66" fill="${t.textMain}" font-size="14" font-weight="700">Map</text>
    <text x="14" y="82" fill="${t.textMuted}" font-size="10">See all pandals at a glance</text>

    <!-- Route Planner -->
    <g transform="translate(196, 0)">
      <rect width="184" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <rect x="14" y="14" width="34" height="34" rx="10" fill="${isDark ? '#1e293b' : '#f0fdf4'}"/>
      <text x="31" y="36" fill="#16a34a" font-size="16" text-anchor="middle">🗺️</text>
      <text x="14" y="66" fill="${t.textMain}" font-size="14" font-weight="700">Route Planner</text>
      <text x="14" y="82" fill="${t.textMuted}" font-size="10">Optimize your hopping trail</text>
    </g>
  </g>

  <!-- Row 2: Metro Guide & Calendar -->
  <g transform="translate(16, 502)">
    <!-- Metro Guide -->
    <rect width="184" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <rect x="14" y="14" width="34" height="34" rx="10" fill="${isDark ? '#1e293b' : '#eff6ff'}"/>
    <text x="31" y="36" fill="#2563eb" font-size="16" text-anchor="middle">🚇</text>
    <text x="14" y="66" fill="${t.textMain}" font-size="14" font-weight="700">Metro Guide</text>
    <text x="14" y="82" fill="${t.textMuted}" font-size="10">Find nearest metro stations</text>

    <!-- Calendar -->
    <g transform="translate(196, 0)">
      <rect width="184" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <rect x="14" y="14" width="34" height="34" rx="10" fill="${isDark ? '#292524' : '#fff7ed'}"/>
      <text x="31" y="36" fill="#d97706" font-size="16" text-anchor="middle">📅</text>
      <text x="14" y="66" fill="${t.textMain}" font-size="14" font-weight="700">Calendar</text>
      <text x="14" y="82" fill="${t.textMuted}" font-size="10">Auspicious tithis &amp; hours</text>
    </g>
  </g>

  <!-- Row 3: Puja Music & Mahalaya -->
  <g transform="translate(16, 608)">
    <!-- Puja Music -->
    <rect width="184" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <rect x="14" y="14" width="34" height="34" rx="10" fill="${isDark ? '#261c28' : '#faf5ff'}"/>
    <text x="31" y="36" fill="#9333ea" font-size="16" text-anchor="middle">🎵</text>
    <text x="14" y="66" fill="${t.textMain}" font-size="14" font-weight="700">Puja Music</text>
    <text x="14" y="82" fill="${t.textMuted}" font-size="10">Chandi Path &amp; Dhak beats</text>

    <!-- Mahalaya -->
    <g transform="translate(196, 0)">
      <rect width="184" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <rect x="14" y="14" width="34" height="34" rx="10" fill="${isDark ? '#292524' : '#fefce8'}"/>
      <text x="31" y="36" fill="#ca8a04" font-size="16" text-anchor="middle">✨</text>
      <text x="14" y="66" fill="${t.textMain}" font-size="14" font-weight="700">Mahalaya</text>
      <text x="14" y="82" fill="${t.textMuted}" font-size="10">Timeless dawn broadcast</text>
    </g>
  </g>

  <!-- Upcoming Festival Banner -->
  <g transform="translate(16, 714)">
    <rect width="380" height="42" rx="14" fill="${isDark ? '#1e142e' : '#2b1a3d'}"/>
    <text x="16" y="26" fill="#fde047" font-size="11" font-weight="800">🔥 UPCOMING FESTIVAL 2026</text>
    <rect x="290" y="8" width="76" height="26" rx="8" fill="#ffffff" fill-opacity="0.15"/>
    <text x="328" y="25" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">Sun, Nov 8</text>
  </g>

  <!-- Floating Audio Miniplayer -->
  <g transform="translate(16, 762)">
    <rect width="380" height="52" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="mini_art_${isDark ? 'd' : 'l'}"><rect x="8" y="8" width="36" height="36" rx="8"/></clipPath>
    <g clip-path="url(#mini_art_${isDark ? 'd' : 'l'})">
      <image href="${IMAGES.miniplayer}" x="8" y="8" width="36" height="36" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <text x="52" y="26" fill="${t.textMain}" font-size="12" font-weight="700">Sharodiya Dhak Dhwoni &amp; Kashi Bol</text>
    <text x="52" y="40" fill="${t.red}" font-size="10" font-weight="600">Mamta Jagdish Dhody • Traditional Dhak</text>
    <circle cx="352" cy="26" r="14" fill="${t.red}"/>
    <path d="M350 20L356 26L350 32Z" fill="#FFFFFF"/>
  </g>

  ${renderNativeBottomNav('Home', isDark, 827)}
  ${renderNativeGesturePill(891, isDark)}
</svg>`;
}

// -----------------------------------------------------------------------------
// 3. Native Explore Screen (412 x 1850)
// -----------------------------------------------------------------------------
function generateNativeExplore(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1850;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('Explore', isDark)}

  <!-- Search Bar -->
  <g transform="translate(16, 106)">
    <rect width="380" height="46" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="16" y="28" fill="${t.textMuted}" font-size="14">🔍</text>
    <text x="40" y="28" fill="${t.textMuted}" font-size="13">Search 774 pandals, zones, metro...</text>
  </g>

  <!-- Zone Filter Chips -->
  <g transform="translate(16, 164)">
    <rect width="70" height="28" rx="8" fill="${t.red}"/>
    <text x="35" y="18" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All (774)</text>

    <g transform="translate(78, 0)">
      <rect width="88" height="28" rx="8" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="44" y="18" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">North (184)</text>
    </g>
    <g transform="translate(174, 0)">
      <rect width="90" height="28" rx="8" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="45" y="18" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">South (210)</text>
    </g>
    <g transform="translate(272, 0)">
      <rect width="96" height="28" rx="8" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="48" y="18" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Central (105)</text>
    </g>
  </g>

  <!-- Category Pills -->
  <g transform="translate(16, 202)">
    <rect width="98" height="26" rx="13" fill="${t.redPillBg}" stroke="${t.redPillBorder}" stroke-width="1"/>
    <text x="49" y="17" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">🏛️ Bonedi Bari (24)</text>

    <g transform="translate(106, 0)">
      <rect width="90" height="26" rx="13" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="45" y="17" fill="${t.textMuted}" font-size="10" font-weight="600" text-anchor="middle">🚇 Near Metro</text>
    </g>
    <g transform="translate(204, 0)">
      <rect width="84" height="26" rx="13" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="42" y="17" fill="${t.textMuted}" font-size="10" font-weight="600" text-anchor="middle">⭐ Featured</text>
    </g>
    <g transform="translate(296, 0)">
      <rect width="84" height="26" rx="13" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="42" y="17" fill="${t.textMuted}" font-size="10" font-weight="600" text-anchor="middle">♿ Accessible</text>
    </g>
  </g>

  <!-- PANDAL CARD 1: Bagbazar Sarbojanin -->
  <g transform="translate(16, 244)">
    <rect width="380" height="340" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="bag_clip_${isDark ? 'd' : 'l'}"><rect width="380" height="170" rx="18"/></clipPath>
    <g clip-path="url(#bag_clip_${isDark ? 'd' : 'l'})">
      <image href="${IMAGES.bagbazar}" width="380" height="170" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <g transform="translate(14, 14)">
      <rect width="90" height="22" rx="6" fill="${t.red}"/>
      <text x="45" y="15" fill="#FFFFFF" font-size="10" font-weight="800" text-anchor="middle">106th Year</text>
    </g>
    <text x="16" y="202" fill="${t.textMain}" font-size="17" font-weight="800">Bagbazar Sarbojanin</text>
    <text x="16" y="222" fill="${t.red}" font-size="12" font-weight="700" class="bengali">বাগবাজার সর্বজনীন দুর্গোৎসব</text>

    <g transform="translate(16, 236)">
      <rect width="78" height="20" rx="6" fill="${t.redPillBg}"/>
      <text x="39" y="14" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
      <g transform="translate(84, 0)">
        <rect width="112" height="20" rx="6" fill="${isDark ? '#1e293b' : '#eff6ff'}"/>
        <text x="56" y="14" fill="#2563eb" font-size="10" font-weight="600" text-anchor="middle">🚇 Shyambazar 500m</text>
      </g>
      <g transform="translate(202, 0)">
        <rect width="68" height="20" rx="6" fill="${isDark ? '#3b1d1d' : '#fef2f2'}"/>
        <text x="34" y="14" fill="#dc2626" font-size="10" font-weight="600" text-anchor="middle">🔥 High Crowd</text>
      </g>
    </g>
    <text x="16" y="278" fill="${t.textMuted}" font-size="11">Iconic traditional idol worship, continuous Dhaki performance, and historical freedom movement legacy.</text>

    <!-- Buttons -->
    <g transform="translate(16, 296)">
      <rect width="168" height="32" rx="10" fill="${t.red}"/>
      <text x="84" y="21" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">+ Add to Route</text>
    </g>
    <g transform="translate(196, 296)">
      <rect width="168" height="32" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="84" y="21" fill="${t.textMain}" font-size="11" font-weight="700" text-anchor="middle">View Details →</text>
    </g>
  </g>

  <!-- PANDAL CARD 2: Kumartuli Park -->
  <g transform="translate(16, 604)">
    <rect width="380" height="340" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="kum_clip_${isDark ? 'd' : 'l'}"><rect width="380" height="170" rx="18"/></clipPath>
    <g clip-path="url(#kum_clip_${isDark ? 'd' : 'l'})">
      <image href="${IMAGES.kumartuli}" width="380" height="170" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <g transform="translate(14, 14)">
      <rect width="84" height="22" rx="6" fill="#059669"/>
      <text x="42" y="15" fill="#FFFFFF" font-size="10" font-weight="800" text-anchor="middle">Clay Heritage</text>
    </g>
    <text x="16" y="202" fill="${t.textMain}" font-size="17" font-weight="800">Kumartuli Park Sarbojanin</text>
    <text x="16" y="222" fill="${t.red}" font-size="12" font-weight="700" class="bengali">কুমোরটুলি পার্ক সর্বজনীন</text>

    <g transform="translate(16, 236)">
      <rect width="78" height="20" rx="6" fill="${t.redPillBg}"/>
      <text x="39" y="14" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
      <g transform="translate(84, 0)">
        <rect width="112" height="20" rx="6" fill="${isDark ? '#1e293b' : '#eff6ff'}"/>
        <text x="56" y="14" fill="#2563eb" font-size="10" font-weight="600" text-anchor="middle">🚇 Sovabazar 650m</text>
      </g>
      <g transform="translate(202, 0)">
        <rect width="80" height="20" rx="6" fill="${isDark ? '#3b1d1d' : '#fef2f2'}"/>
        <text x="40" y="14" fill="#dc2626" font-size="10" font-weight="600" text-anchor="middle">⚡ Very High</text>
      </g>
    </g>
    <text x="16" y="278" fill="${t.textMuted}" font-size="11">Located at the heart of Bengal's idol-sculpting district with magnificent architectural pandal concepts.</text>

    <g transform="translate(16, 296)">
      <rect width="168" height="32" rx="10" fill="${t.red}"/>
      <text x="84" y="21" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">+ Add to Route</text>
    </g>
    <g transform="translate(196, 296)">
      <rect width="168" height="32" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="84" y="21" fill="${t.textMain}" font-size="11" font-weight="700" text-anchor="middle">View Details →</text>
    </g>
  </g>

  <!-- PANDAL CARD 3: Sovabazar Rajbari -->
  <g transform="translate(16, 964)">
    <rect width="380" height="340" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="sov_clip_${isDark ? 'd' : 'l'}"><rect width="380" height="170" rx="18"/></clipPath>
    <g clip-path="url(#sov_clip_${isDark ? 'd' : 'l'})">
      <image href="${IMAGES.sovabazar}" width="380" height="170" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <g transform="translate(14, 14)">
      <rect width="102" height="22" rx="6" fill="#d97706"/>
      <text x="51" y="15" fill="#FFFFFF" font-size="10" font-weight="800" text-anchor="middle">Est. 1757 (269 yrs)</text>
    </g>
    <text x="16" y="202" fill="${t.textMain}" font-size="17" font-weight="800">Sovabazar Rajbari</text>
    <text x="16" y="222" fill="${t.red}" font-size="12" font-weight="700" class="bengali">শোভাবাজার রাজবাড়ি</text>

    <g transform="translate(16, 236)">
      <rect width="90" height="20" rx="6" fill="${t.redPillBg}"/>
      <text x="45" y="14" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">🏛️ Bonedi Bari</text>
      <g transform="translate(96, 0)">
        <rect width="112" height="20" rx="6" fill="${isDark ? '#1e293b' : '#eff6ff'}"/>
        <text x="56" y="14" fill="#2563eb" font-size="10" font-weight="600" text-anchor="middle">🚇 Sovabazar 400m</text>
      </g>
      <g transform="translate(214, 0)">
        <rect width="78" height="20" rx="6" fill="${isDark ? '#143823' : '#ecfdf5'}"/>
        <text x="39" y="14" fill="#059669" font-size="10" font-weight="600" text-anchor="middle">🌿 Moderate</text>
      </g>
    </g>
    <text x="16" y="278" fill="${t.textMuted}" font-size="11">Raja Nabakrishna Deb's historic palatial courtyard hosting Bengal's timeless aristocratic traditions.</text>

    <g transform="translate(16, 296)">
      <rect width="168" height="32" rx="10" fill="${t.red}"/>
      <text x="84" y="21" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">+ Add to Route</text>
    </g>
    <g transform="translate(196, 296)">
      <rect width="168" height="32" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="84" y="21" fill="${t.textMain}" font-size="11" font-weight="700" text-anchor="middle">View Details →</text>
    </g>
  </g>

  <!-- PANDAL CARD 4: Suruchi Sangha -->
  <g transform="translate(16, 1324)">
    <rect width="380" height="340" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="sur_clip_${isDark ? 'd' : 'l'}"><rect width="380" height="170" rx="18"/></clipPath>
    <g clip-path="url(#sur_clip_${isDark ? 'd' : 'l'})">
      <image href="${IMAGES.suruchi}" width="380" height="170" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <g transform="translate(14, 14)">
      <rect width="90" height="22" rx="6" fill="#7c3aed"/>
      <text x="45" y="15" fill="#FFFFFF" font-size="10" font-weight="800" text-anchor="middle">Art &amp; Theme</text>
    </g>
    <text x="16" y="202" fill="${t.textMain}" font-size="17" font-weight="800">Suruchi Sangha</text>
    <text x="16" y="222" fill="${t.red}" font-size="12" font-weight="700" class="bengali">সুরুচি সংঘ</text>

    <g transform="translate(16, 236)">
      <rect width="78" height="20" rx="6" fill="${t.redPillBg}"/>
      <text x="39" y="14" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">South Kolkata</text>
      <g transform="translate(84, 0)">
        <rect width="112" height="20" rx="6" fill="${isDark ? '#1e293b' : '#eff6ff'}"/>
        <text x="56" y="14" fill="#2563eb" font-size="10" font-weight="600" text-anchor="middle">🚇 Majerhat 800m</text>
      </g>
      <g transform="translate(202, 0)">
        <rect width="68" height="20" rx="6" fill="${isDark ? '#3b1d1d' : '#fef2f2'}"/>
        <text x="34" y="14" fill="#dc2626" font-size="10" font-weight="600" text-anchor="middle">🔥 High Crowd</text>
      </g>
    </g>
    <text x="16" y="278" fill="${t.textMuted}" font-size="11">Renowned New Alipore pandal celebrating India's rich state-wise cultural architecture with national acclaim.</text>

    <g transform="translate(16, 296)">
      <rect width="168" height="32" rx="10" fill="${t.red}"/>
      <text x="84" y="21" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">+ Add to Route</text>
    </g>
    <g transform="translate(196, 296)">
      <rect width="168" height="32" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="84" y="21" fill="${t.textMain}" font-size="11" font-weight="700" text-anchor="middle">View Details →</text>
    </g>
  </g>

  <!-- Sticky Bottom Navigation Bar -->
  <g transform="translate(0, ${H - 88})">
    ${renderNativeBottomNav('Explore', isDark, 0)}
    ${renderNativeGesturePill(64, isDark)}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 4. Native Map Screen (412 x 915)
// -----------------------------------------------------------------------------
function generateNativeMap(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="915" fill="${isDark ? '#1a1f26' : '#e6e9ee'}"/>
  ${renderNativeStatusBar(isDark, true)}

  <!-- Simulated OpenStreetMap Tiles & Hooghly River -->
  <path d="M120 0 Q140 300 110 500 T130 915" stroke="${isDark ? '#1e3a5f' : '#bfdbfe'}" stroke-width="48" fill="none"/>
  <path d="M0 240 Q200 230 412 250" stroke="${isDark ? '#2e3846' : '#cbd5e1'}" stroke-width="8" fill="none"/>
  <path d="M0 480 Q250 490 412 470" stroke="${isDark ? '#2e3846' : '#cbd5e1'}" stroke-width="12" fill="none"/>
  <path d="M220 0 V915" stroke="${isDark ? '#2e3846' : '#cbd5e1'}" stroke-width="10" fill="none"/>

  <!-- Top Floating Overlay Header -->
  <g transform="translate(16, 50)">
    <rect width="380" height="48" rx="14" fill="${t.card}" fill-opacity="0.95" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="16" y="29" fill="${t.textMuted}" font-size="14">🔍</text>
    <text x="42" y="29" fill="${t.textMain}" font-size="13" font-weight="600">Search North, South or metro station...</text>
    <rect x="330" y="8" width="38" height="32" rx="8" fill="${t.redPillBg}"/>
    <text x="349" y="28" fill="${t.redPillText}" font-size="14" text-anchor="middle">⚙️</text>
  </g>

  <!-- Pandal Map Markers -->
  <!-- Bagbazar Pin -->
  <g transform="translate(180, 210)">
    <circle cx="16" cy="16" r="16" fill="${t.red}"/>
    <circle cx="16" cy="16" r="6" fill="#FFFFFF"/>
    <rect x="-30" y="36" width="92" height="20" rx="6" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="16" y="50" fill="${t.textMain}" font-size="9" font-weight="700" text-anchor="middle">Bagbazar (106y)</text>
  </g>

  <!-- Kumartuli Pin -->
  <g transform="translate(150, 310)">
    <circle cx="14" cy="14" r="14" fill="${t.red}"/>
    <circle cx="14" cy="14" r="5" fill="#FFFFFF"/>
    <rect x="-24" y="32" width="76" height="20" rx="6" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="14" y="46" fill="${t.textMain}" font-size="9" font-weight="700" text-anchor="middle">Kumartuli Park</text>
  </g>

  <!-- Sovabazar Rajbari Pin -->
  <g transform="translate(240, 360)">
    <circle cx="14" cy="14" r="14" fill="#d97706"/>
    <circle cx="14" cy="14" r="5" fill="#FFFFFF"/>
    <rect x="-30" y="32" width="88" height="20" rx="6" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="14" y="46" fill="${t.textMain}" font-size="9" font-weight="700" text-anchor="middle">Sovabazar Rajbari</text>
  </g>

  <!-- College Square Pin -->
  <g transform="translate(230, 480)">
    <circle cx="14" cy="14" r="14" fill="${t.red}"/>
    <circle cx="14" cy="14" r="5" fill="#FFFFFF"/>
  </g>

  <!-- Floating Map Controls (Right Side) -->
  <g transform="translate(356, 120)">
    <rect width="40" height="40" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="20" y="26" fill="${t.textMain}" font-size="18" font-weight="700" text-anchor="middle">⛶</text>
    <g transform="translate(0, 48)">
      <rect width="40" height="40" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="20" y="26" fill="${t.textMain}" font-size="18" font-weight="700" text-anchor="middle">+</text>
    </g>
    <g transform="translate(0, 96)">
      <rect width="40" height="40" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="20" y="25" fill="${t.textMain}" font-size="18" font-weight="700" text-anchor="middle">−</text>
    </g>
    <g transform="translate(0, 144)">
      <rect width="40" height="40" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="20" y="26" fill="${t.textMain}" font-size="14" text-anchor="middle">🎯</text>
    </g>
  </g>

  <!-- Bottom Selected Pandal Sheet Card -->
  <g transform="translate(16, 660)">
    <rect width="380" height="150" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="map_card_art_${isDark ? 'd' : 'l'}"><rect x="12" y="12" width="76" height="76" rx="12"/></clipPath>
    <g clip-path="url(#map_card_art_${isDark ? 'd' : 'l'})">
      <image href="${IMAGES.bagbazar}" x="12" y="12" width="76" height="76" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <text x="100" y="32" fill="${t.textMain}" font-size="16" font-weight="800">Bagbazar Sarbojanin</text>
    <text x="100" y="50" fill="${t.red}" font-size="11" font-weight="700" class="bengali">বাগবাজার সর্বজনীন দুর্গোৎসব</text>
    <text x="100" y="68" fill="${t.textMuted}" font-size="11">North Kolkata • 500m to Shyambazar Metro</text>
    
    <g transform="translate(12, 100)">
      <rect width="172" height="36" rx="10" fill="${t.red}"/>
      <text x="86" y="23" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">🧭 Get Directions</text>
    </g>
    <g transform="translate(196, 100)">
      <rect width="172" height="36" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="86" y="23" fill="${t.textMain}" font-size="12" font-weight="700" text-anchor="middle">📌 Add to Planner</text>
    </g>
  </g>

  ${renderNativeBottomNav('Map', isDark, 827)}
  ${renderNativeGesturePill(891, isDark)}
</svg>`;
}

// -----------------------------------------------------------------------------
// 5. Native Route Planner Screen (412 x 1500)
// -----------------------------------------------------------------------------
function generateNativePlanner(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1500;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('Route Planner', isDark)}

  <!-- Optimization Summary Banner -->
  <g transform="translate(16, 106)">
    <rect width="380" height="96" rx="18" fill="${isDark ? '#143823' : '#f0fdf4'}" stroke="#86efac" stroke-width="1"/>
    <text x="16" y="28" fill="#15803d" font-size="12" font-weight="800">⚡ TSP HA日內RSINE OPTIMIZER ACTIVE</text>
    <text x="16" y="52" fill="${t.textMain}" font-size="18" font-weight="900">Saved 3.4 km of Walking</text>
    <text x="16" y="74" fill="${t.textMuted}" font-size="11">Total Route: 4 Stops • 2.6 km Total Distance • Approx 38 mins walk</text>
  </g>

  <!-- Start Point Selector -->
  <g transform="translate(16, 214)">
    <rect width="380" height="48" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <circle cx="24" cy="24" r="8" fill="#22c55e"/>
    <text x="44" y="29" fill="${t.textMain}" font-size="13" font-weight="700">Start: Shyambazar Metro Station (Exit 2)</text>
    <text x="350" y="29" fill="${t.textMuted}" font-size="13">▼</text>
  </g>

  <!-- Stop 1: Bagbazar Sarbojanin -->
  <g transform="translate(16, 274)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <circle cx="28" cy="48" r="14" fill="${t.red}"/>
    <text x="28" y="53" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">1</text>
    <text x="54" y="38" fill="${t.textMain}" font-size="15" font-weight="800">Bagbazar Sarbojanin</text>
    <text x="54" y="56" fill="${t.red}" font-size="11" font-weight="600" class="bengali">বাগবাজার সর্বজনীন</text>
    <text x="54" y="74" fill="${t.textMuted}" font-size="10">North Kolkata • Traditional Ekchala Protima</text>
    <text x="340" y="52" fill="${t.textMuted}" font-size="18">☰</text>
  </g>

  <!-- Distance Connector 1 -> 2 -->
  <g transform="translate(44, 370)">
    <line x1="0" y1="0" x2="0" y2="30" stroke="${t.red}" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="16" y="20" fill="${t.red}" font-size="10" font-weight="700">600m • 8 min walk</text>
  </g>

  <!-- Stop 2: Kumartuli Park -->
  <g transform="translate(16, 400)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <circle cx="28" cy="48" r="14" fill="${t.red}"/>
    <text x="28" y="53" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">2</text>
    <text x="54" y="38" fill="${t.textMain}" font-size="15" font-weight="800">Kumartuli Park</text>
    <text x="54" y="56" fill="${t.red}" font-size="11" font-weight="600" class="bengali">কুমোরটুলি পার্ক</text>
    <text x="54" y="74" fill="${t.textMuted}" font-size="10">Sculptor Artisan Colony • Architectural Pandal</text>
    <text x="340" y="52" fill="${t.textMuted}" font-size="18">☰</text>
  </g>

  <!-- Distance Connector 2 -> 3 -->
  <g transform="translate(44, 496)">
    <line x1="0" y1="0" x2="0" y2="30" stroke="${t.red}" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="16" y="20" fill="${t.red}" font-size="10" font-weight="700">400m • 5 min walk</text>
  </g>

  <!-- Stop 3: Sovabazar Rajbari -->
  <g transform="translate(16, 526)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <circle cx="28" cy="48" r="14" fill="#d97706"/>
    <text x="28" y="53" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">3</text>
    <text x="54" y="38" fill="${t.textMain}" font-size="15" font-weight="800">Sovabazar Rajbari</text>
    <text x="54" y="56" fill="${t.red}" font-size="11" font-weight="600" class="bengali">শোভাবাজার রাজবাড়ি</text>
    <text x="54" y="74" fill="${t.textMuted}" font-size="10">Historic Aristocratic Palace Courtyard</text>
    <text x="340" y="52" fill="${t.textMuted}" font-size="18">☰</text>
  </g>

  <!-- Distance Connector 3 -> 4 -->
  <g transform="translate(44, 622)">
    <line x1="0" y1="0" x2="0" y2="30" stroke="${t.red}" stroke-width="2" stroke-dasharray="4 4"/>
    <text x="16" y="20" fill="${t.red}" font-size="10" font-weight="700">1.6 km • 20 min walk</text>
  </g>

  <!-- Stop 4: College Square -->
  <g transform="translate(16, 652)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <circle cx="28" cy="48" r="14" fill="${t.red}"/>
    <text x="28" y="53" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">4</text>
    <text x="54" y="38" fill="${t.textMain}" font-size="15" font-weight="800">College Square Sarbojanin</text>
    <text x="54" y="56" fill="${t.red}" font-size="11" font-weight="600" class="bengali">কলেজ স্কোয়ার</text>
    <text x="54" y="74" fill="${t.textMuted}" font-size="10">Historic Water Tank Illumination &amp; Heritage</text>
    <text x="340" y="52" fill="${t.textMuted}" font-size="18">☰</text>
  </g>

  <!-- Action CTA Buttons -->
  <g transform="translate(16, 770)">
    <rect width="380" height="46" rx="14" fill="${t.red}"/>
    <text x="190" y="28" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">🗺️ Open Turn-by-Turn in Google Maps</text>
  </g>
  <g transform="translate(16, 826)">
    <rect width="380" height="44" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="190" y="27" fill="${t.textMain}" font-size="13" font-weight="700" text-anchor="middle">📤 Share Itinerary / Export GPX</text>
  </g>

  <g transform="translate(0, ${H - 88})">
    ${renderNativeBottomNav('Planner', isDark, 0)}
    ${renderNativeGesturePill(64, isDark)}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 6. Native Calendar Screen (412 x 1550)
// -----------------------------------------------------------------------------
function generateNativeCalendar(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1550;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('Puja Calendar', isDark)}

  <!-- Sandhi Puja Live Countdown Card -->
  <g transform="translate(16, 106)">
    <rect width="380" height="154" rx="20" fill="${isDark ? '#261c16' : '#fff7ed'}" stroke="#fb923c" stroke-width="1.5"/>
    <g transform="translate(20, 18)">
      <rect width="130" height="24" rx="12" fill="#ea580c"/>
      <text x="65" y="16" fill="#FFFFFF" font-size="10" font-weight="800" text-anchor="middle">🕉️ SANDHI PUJA</text>
    </g>
    <text x="20" y="70" fill="${t.textMain}" font-size="18" font-weight="900">Maha Ashtami - Nabami Juncture</text>
    <text x="20" y="90" fill="${t.textMuted}" font-size="11">Exact 48-minute sacred window: 10:48 PM – 11:36 PM</text>
    
    <g transform="translate(20, 104)">
      <rect width="340" height="34" rx="10" fill="${isDark ? '#1a1410' : '#ffedd5'}"/>
      <text x="170" y="22" fill="#ea580c" font-size="13" font-weight="900" text-anchor="middle">⏳ 108 Lotus Offering &amp; 108 Deepam Aarti</text>
    </g>
  </g>

  <!-- 2026 Tithi Cards -->
  <!-- 1. Maha Shashthi -->
  <g transform="translate(16, 276)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="20" y="32" fill="${t.red}" font-size="14" font-weight="800">Maha Shashthi (মহা ষষ্ঠী)</text>
    <text x="20" y="52" fill="${t.textMain}" font-size="12" font-weight="600">Devi Bodhon, Amantran &amp; Adhibas</text>
    <text x="20" y="72" fill="${t.textMuted}" font-size="11">Oct 17, 2026 • Bilva Nimantran &amp; Kalparambha at Dusk</text>
  </g>

  <!-- 2. Maha Saptami -->
  <g transform="translate(16, 384)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="20" y="32" fill="${t.red}" font-size="14" font-weight="800">Maha Saptami (মহা সপ্তমী)</text>
    <text x="20" y="52" fill="${t.textMain}" font-size="12" font-weight="600">Nabapatrika Snan &amp; Pravesh</text>
    <text x="20" y="72" fill="${t.textMuted}" font-size="11">Oct 18, 2026 • Sacred Kolabou Snan in Ganga at Dawn</text>
  </g>

  <!-- 3. Maha Ashtami -->
  <g transform="translate(16, 492)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="20" y="32" fill="${t.red}" font-size="14" font-weight="800">Maha Ashtami (মহা অষ্টমী)</text>
    <text x="20" y="52" fill="${t.textMain}" font-size="12" font-weight="600">Kumari Puja, Pushpanjali &amp; Sandhi Puja</text>
    <text x="20" y="72" fill="${t.textMuted}" font-size="11">Oct 19, 2026 • Most sacred day across all pandals</text>
  </g>

  <!-- 4. Maha Nabami -->
  <g transform="translate(16, 600)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="20" y="32" fill="${t.red}" font-size="14" font-weight="800">Maha Nabami (মহা নবমী)</text>
    <text x="20" y="52" fill="${t.textMain}" font-size="12" font-weight="600">Nabami Homa &amp; Mahabhog Samaroha</text>
    <text x="20" y="72" fill="${t.textMuted}" font-size="11">Oct 20, 2026 • Final full day of pandal hopping</text>
  </g>

  <!-- 5. Bijoya Dashami -->
  <g transform="translate(16, 708)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="20" y="32" fill="${t.red}" font-size="14" font-weight="800">Bijoya Dashami (বিজয়া দশমী)</text>
    <text x="20" y="52" fill="${t.textMain}" font-size="12" font-weight="600">Sindoor Khela, Darpan Bisarjan &amp; Ghat Snan</text>
    <text x="20" y="72" fill="${t.textMuted}" font-size="11">Oct 21, 2026 • Shubho Bijoya sweet exchange</text>
  </g>

  <g transform="translate(0, ${H - 88})">
    ${renderNativeBottomNav('Calendar', isDark, 0)}
    ${renderNativeGesturePill(64, isDark)}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 7. Native Metro Guide (412 x 1200)
// -----------------------------------------------------------------------------
function generateNativeMetro(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1200;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('Metro Guide', isDark, { showBack: true })}

  <!-- Overnight Alert Banner -->
  <g transform="translate(16, 106)">
    <rect width="380" height="68" rx="16" fill="${isDark ? '#1e1b4b' : '#eff6ff'}" stroke="#93c5fd" stroke-width="1"/>
    <text x="16" y="28" fill="#1d4ed8" font-size="11" font-weight="800">🚇 PUJA SPECIAL OVERNIGHT METRO</text>
    <text x="16" y="50" fill="${t.textMain}" font-size="13" font-weight="600">24x7 Night Service on Saptami, Ashtami &amp; Nabami</text>
  </g>

  <!-- Blue Line Card -->
  <g transform="translate(16, 186)">
    <rect width="380" height="190" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <rect x="16" y="16" width="90" height="24" rx="8" fill="#2563eb"/>
    <text x="61" y="32" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle">BLUE LINE 1</text>
    <text x="16" y="66" fill="${t.textMain}" font-size="16" font-weight="800">North - South Corridor</text>
    <text x="16" y="86" fill="${t.textMuted}" font-size="11">Dakshineswar ↔ Kavi Subhash (New Garia) • 24 Stations</text>

    <text x="16" y="116" fill="${t.textMain}" font-size="12" font-weight="700">Key Pandal Stations:</text>
    <text x="16" y="136" fill="${t.textMuted}" font-size="11">• Shyambazar → Bagbazar, Kumartuli, Tala Prattoy</text>
    <text x="16" y="152" fill="${t.textMuted}" font-size="11">• Sovabazar Sutanuti → Sovabazar Rajbari, Ahiritola</text>
    <text x="16" y="168" fill="${t.textMuted}" font-size="11">• Kalighat → Badamtala Ashar Sangha, Deshapriya Park</text>
  </g>

  <!-- Green Line Card -->
  <g transform="translate(16, 390)">
    <rect width="380" height="190" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <rect x="16" y="16" width="100" height="24" rx="8" fill="#16a34a"/>
    <text x="66" y="32" fill="#FFFFFF" font-size="11" font-weight="800" text-anchor="middle">GREEN LINE 2</text>
    <text x="16" y="66" fill="${t.textMain}" font-size="16" font-weight="800">East - West Underwater Corridor</text>
    <text x="16" y="86" fill="${t.textMuted}" font-size="11">Howrah Maidan ↔ Sector V (Salt Lake) • Underwater Tunnel</text>

    <text x="16" y="116" fill="${t.textMain}" font-size="12" font-weight="700">Key Pandal Stations:</text>
    <text x="16" y="136" fill="${t.textMuted}" font-size="11">• Howrah Station → Direct connection to Central Pandals</text>
    <text x="16" y="152" fill="${t.textMuted}" font-size="11">• Sealdah → Santosh Mitra Square, Jagat Mukherjee</text>
    <text x="16" y="168" fill="${t.textMuted}" font-size="11">• Karunamoyee / Central Park → Salt Lake FD Block, BJ Block</text>
  </g>

  <g transform="translate(0, ${H - 88})">
    ${renderNativeBottomNav('More', isDark, 0)}
    ${renderNativeGesturePill(64, isDark)}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 8. Native Music Player Screen (412 x 1350)
// -----------------------------------------------------------------------------
function generateNativeMusic(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1350;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('Puja Music', isDark, { showBack: true })}

  <g transform="translate(16, 106)">
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="800">🎵 SHARODIYA SOUNDSCAPE &amp; HERITAGE</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="22" font-weight="900">Festive Puja Music Traditions</text>
    <text x="0" y="66" fill="${t.textMuted}" font-size="11">Explore Bengal's rich Durga Puja music culture — traditional Dhak</text>
    <text x="0" y="82" fill="${t.textMuted}" font-size="11">beats, Agomoni hymns, and immortal immersion chants.</text>
  </g>

  <!-- Segmented Control: All Soundscapes / My Playlist -->
  <g transform="translate(16, 204)">
    <rect width="130" height="32" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="65" y="21" fill="${t.textMain}" font-size="11" font-weight="700" text-anchor="middle">All Soundscapes</text>
    <g transform="translate(138, 0)">
      <rect width="112" height="32" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="56" y="21" fill="${t.textMuted}" font-size="11" font-weight="600" text-anchor="middle">🔖 My Playlist 0</text>
    </g>
  </g>

  <!-- Mood Filter Box -->
  <g transform="translate(16, 252)">
    <rect width="380" height="136" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="16" y="26" fill="${t.textMain}" font-size="13" font-weight="800">✨ Choose Your Puja Mood</text>
    
    <g transform="translate(16, 40)">
      <rect width="78" height="26" rx="13" fill="${t.red}"/>
      <text x="39" y="17" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">All Moods</text>
      <g transform="translate(86, 0)">
        <rect width="112" height="26" rx="13" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="56" y="17" fill="${t.textMuted}" font-size="10" text-anchor="middle">Ritual &amp; Devotion</text>
      </g>
      <g transform="translate(206, 0)">
        <rect width="136" height="26" rx="13" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="68" y="17" fill="${t.textMuted}" font-size="10" text-anchor="middle">Dhak &amp; Traditional Sounds</text>
      </g>
    </g>

    <g transform="translate(16, 74)">
      <rect width="104" height="26" rx="13" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="52" y="17" fill="${t.textMuted}" font-size="10" text-anchor="middle">Pandal Hopping</text>
      <g transform="translate(112, 0)">
        <rect width="130" height="26" rx="13" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="65" y="17" fill="${t.textMuted}" font-size="10" text-anchor="middle">Bengali Festive Music</text>
      </g>
    </g>
  </g>

  <!-- Track 1 -->
  <g transform="translate(16, 404)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <circle cx="34" cy="48" r="18" fill="${t.redPillBg}"/>
    <text x="34" y="53" fill="${t.red}" font-size="14" text-anchor="middle">▶</text>
    <text x="68" y="38" fill="${t.textMain}" font-size="14" font-weight="800">Sharodiya Dhak Dhwoni &amp; Kashi Bol</text>
    <text x="68" y="56" fill="${t.textMuted}" font-size="11">Mamta Jagdish Dhody • Dhak &amp; Shankha</text>
    <text x="330" y="38" fill="${t.red}" font-size="11" font-weight="700">01:39</text>
    <g transform="translate(68, 68)">
      <text x="0" y="14" fill="${t.textFaint}" font-size="9">CC BY-SA 4.0</text>
      <text x="140" y="14" fill="#0284c7" font-size="9" font-weight="600">Direct Audio ↗</text>
    </g>
  </g>

  <!-- Track 2 -->
  <g transform="translate(16, 510)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <circle cx="34" cy="48" r="18" fill="${t.redPillBg}"/>
    <text x="34" y="53" fill="${t.red}" font-size="14" text-anchor="middle">▶</text>
    <text x="68" y="38" fill="${t.textMain}" font-size="14" font-weight="800">Sacred Shankha Naad (Auspicious Conch)</text>
    <text x="68" y="56" fill="${t.textMuted}" font-size="11">David Bolton • Dhak &amp; Shankha</text>
    <text x="330" y="38" fill="${t.red}" font-size="11" font-weight="700">00:07</text>
    <g transform="translate(68, 68)">
      <text x="0" y="14" fill="${t.textFaint}" font-size="9">CC BY 2.5</text>
      <text x="140" y="14" fill="#0284c7" font-size="9" font-weight="600">Direct Audio ↗</text>
    </g>
  </g>

  <!-- Track 3 -->
  <g transform="translate(16, 616)">
    <rect width="380" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <circle cx="34" cy="48" r="18" fill="${t.redPillBg}"/>
    <text x="34" y="53" fill="${t.red}" font-size="14" text-anchor="middle">▶</text>
    <text x="68" y="38" fill="${t.textMain}" font-size="14" font-weight="800">Dhunuchi Naach Dhak Taali &amp; Kaashor</text>
    <text x="68" y="56" fill="${t.textMuted}" font-size="11">Traditional Bengali Dhaki Ensemble</text>
    <text x="330" y="38" fill="${t.red}" font-size="11" font-weight="700">04:00</text>
    <g transform="translate(68, 68)">
      <text x="0" y="14" fill="${t.textFaint}" font-size="9">Authorized Stream</text>
      <text x="140" y="14" fill="#0284c7" font-size="9" font-weight="600">Direct Audio ↗</text>
    </g>
  </g>

  <g transform="translate(0, ${H - 88})">
    ${renderNativeBottomNav('More', isDark, 0)}
    ${renderNativeGesturePill(64, isDark)}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 9. Native Mahalaya Screen (412 x 1100)
// -----------------------------------------------------------------------------
function generateNativeMahalaya(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1100;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('Mahalaya', isDark, { showBack: true })}

  <!-- Artwork Card -->
  <g transform="translate(16, 106)">
    <rect width="380" height="240" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="mah_clip_${isDark ? 'd' : 'l'}"><rect width="380" height="240" rx="20"/></clipPath>
    <g clip-path="url(#mah_clip_${isDark ? 'd' : 'l'})">
      <image href="${IMAGES.durgaBg || IMAGES.heroDurga}" width="380" height="240" preserveAspectRatio="xMidYMid slice"/>
      <rect width="380" height="240" fill="black" fill-opacity="0.45"/>
    </g>
    <text x="190" y="100" fill="#FFFFFF" font-size="22" font-weight="900" text-anchor="middle">মহিষাসুরমর্দিনী</text>
    <text x="190" y="126" fill="#fde047" font-size="14" font-weight="700" text-anchor="middle">Mahishasurmardini (1931)</text>
    <text x="190" y="152" fill="#FFFFFF" font-size="12" text-anchor="middle">Voice of Birendra Krishna Bhadra • All India Radio</text>
    <circle cx="190" cy="190" r="24" fill="${t.red}"/>
    <path d="M187 180L197 190L187 200Z" fill="#FFFFFF"/>
  </g>

  <!-- Narrative Content -->
  <g transform="translate(16, 362)">
    <rect width="380" height="150" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="20" y="32" fill="${t.red}" font-size="13" font-weight="800">THE SACRED DAWN BROADCAST</text>
    <text x="20" y="58" fill="${t.textMain}" font-size="16" font-weight="800">Arrival of the Mother Goddess</text>
    <text x="20" y="80" fill="${t.textMuted}" font-size="11">Broadcast at 4:00 AM on Mahalaya dawn since 1931, this historic recitation heralds the awakening of Devi Durga.</text>
    <text x="20" y="112" fill="${t.textMain}" font-size="11" font-weight="700">Composed by Bani Kumar • Music by Pankaj Kumar Mullick</text>
  </g>

  <g transform="translate(0, ${H - 88})">
    ${renderNativeBottomNav('More', isDark, 0)}
    ${renderNativeGesturePill(64, isDark)}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 10. Native Developer Screen (412 x 1250) - Moumita strictly Card 1!
// -----------------------------------------------------------------------------
function generateNativeDeveloper(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1250;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('Meet Developers', isDark, { showBack: true })}

  <g transform="translate(16, 106)">
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="800">COMMUNITY INITIATIVE</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="22" font-weight="900">Crafted with Devotion for Bengal</text>
    <text x="0" y="66" fill="${t.textMuted}" font-size="11">PujoPath is an open-source UNESCO cultural digital preservation effort built to celebrate Kolkata's Durga Puja.</text>
  </g>

  <!-- CARD 1: MOUMITA GHOSH (Strictly Lead UI/UX & Frontend) -->
  <g transform="translate(16, 200)">
    <rect width="380" height="240" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="mou_avatar_${isDark ? 'd' : 'l'}"><circle cx="56" cy="56" r="36"/></clipPath>
    <g clip-path="url(#mou_avatar_${isDark ? 'd' : 'l'})">
      <image href="${IMAGES.moumita}" x="20" y="20" width="72" height="72" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <text x="108" y="44" fill="${t.textMain}" font-size="18" font-weight="800">Moumita Ghosh</text>
    <text x="108" y="64" fill="${t.red}" font-size="12" font-weight="700">UI/UX Design Lead &amp; Frontend Engineer</text>
    <text x="108" y="82" fill="${t.textMuted}" font-size="11">Design System Architecture • Micro-Interactions</text>

    <text x="20" y="126" fill="${t.textMuted}" font-size="11">Championed the design system tokens, responsive mobile touch targets, Hind Siliguri typography, and tactile spring physics across PujoPath Native.</text>

    <g transform="translate(20, 182)">
      <rect width="340" height="38" rx="12" fill="#0a66c2"/>
      <text x="170" y="24" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">Connect on LinkedIn ↗</text>
    </g>
  </g>

  <!-- CARD 2: SOUMIK GHOSH (Strictly Lead Systems Architect) -->
  <g transform="translate(16, 460)">
    <rect width="380" height="240" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <clipPath id="sou_avatar_${isDark ? 'd' : 'l'}"><circle cx="56" cy="56" r="36"/></clipPath>
    <g clip-path="url(#sou_avatar_${isDark ? 'd' : 'l'})">
      <image href="${IMAGES.soumik}" x="20" y="20" width="72" height="72" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <text x="108" y="44" fill="${t.textMain}" font-size="18" font-weight="800">Soumik Ghosh</text>
    <text x="108" y="64" fill="${t.red}" font-size="12" font-weight="700">Lead Systems Architect &amp; Backend Engineer</text>
    <text x="108" y="82" fill="${t.textMuted}" font-size="11">TSP Haversine Engine • React Native Architecture</text>

    <text x="20" y="126" fill="${t.textMuted}" font-size="11">Engineered the 774-pandal offline database, Traveling Salesperson geodesic route optimizer, Kolkata Metro timetables, and Native Android deployment.</text>

    <g transform="translate(20, 182)">
      <rect width="340" height="38" rx="12" fill="#0a66c2"/>
      <text x="170" y="24" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">Connect on LinkedIn ↗</text>
    </g>
  </g>

  <!-- Feedback CTA -->
  <g transform="translate(16, 720)">
    <rect width="380" height="54" rx="14" fill="${t.redPillBg}" stroke="${t.redPillBorder}" stroke-width="1"/>
    <text x="190" y="32" fill="${t.redPillText}" font-size="13" font-weight="800" text-anchor="middle">💬 Send Direct Feedback to Developers →</text>
  </g>

  <g transform="translate(0, ${H - 88})">
    ${renderNativeBottomNav('More', isDark, 0)}
    ${renderNativeGesturePill(64, isDark)}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 11. Native Helpline Screen (412 x 1150)
// -----------------------------------------------------------------------------
function generateNativeHelpline(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1150;

  const helplines = [
    { title: 'Kolkata Police Control Room', num: '100 / (033) 2214-3230', sub: 'Lalbazar Central Headquarters 24x7', icon: '🚨' },
    { title: 'Lalbazar Puja Emergency Helpline', num: '(033) 2214-3024', sub: 'Dedicated Durga Puja Citywide Desk', icon: '👮' },
    { title: 'Ambulance Emergency Medical', num: '102 / 108', sub: 'Government & Red Cross Ambulances', icon: '🚑' },
    { title: 'Women in Distress Helpline', num: '1091 / (033) 2214-5000', sub: 'Kolkata Police Winners Squad', icon: '🛡️' },
    { title: 'West Bengal Fire & Rescue', num: '101 / (033) 2252-1165', sub: 'Central Fire Control Headquarters', icon: '🚒' },
    { title: 'Childline Emergency Assistance', num: '1098', sub: 'National Child Protection Desk', icon: '👶' }
  ];

  let cards = '';
  helplines.forEach((h, i) => {
    const yPos = 176 + (i * 96);
    cards += `
      <g transform="translate(16, ${yPos})">
        <rect width="380" height="84" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <circle cx="28" cy="42" r="16" fill="${t.redPillBg}"/>
        <text x="28" y="47" fill="${t.red}" font-size="15" text-anchor="middle">${h.icon}</text>
        <text x="56" y="32" fill="${t.textMain}" font-size="13" font-weight="800">${h.title}</text>
        <text x="56" y="50" fill="${t.red}" font-size="12" font-weight="700">${h.num}</text>
        <text x="56" y="66" fill="${t.textMuted}" font-size="10">${h.sub}</text>
        <g transform="translate(324, 24)">
          <circle cx="18" cy="18" r="18" fill="#16a34a"/>
          <text x="18" y="23" fill="#FFFFFF" font-size="13" text-anchor="middle">📞</text>
        </g>
      </g>
    `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('Emergency Helplines', isDark, { showBack: true })}

  <g transform="translate(16, 106)">
    <rect width="380" height="56" rx="14" fill="${isDark ? '#3b1d1d' : '#fef2f2'}" stroke="#fca5a5" stroke-width="1"/>
    <text x="16" y="26" fill="${t.red}" font-size="11" font-weight="800">🚨 24X7 EMERGENCY PUJA CONTACTS</text>
    <text x="16" y="44" fill="${t.textMain}" font-size="12">Tap any phone icon below to instantly dial emergency services.</text>
  </g>

  ${cards}

  <g transform="translate(0, ${H - 88})">
    ${renderNativeBottomNav('More', isDark, 0)}
    ${renderNativeGesturePill(64, isDark)}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 12. Native Feedback Screen (412 x 1050)
// -----------------------------------------------------------------------------
function generateNativeFeedback(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1050;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('Share Feedback', isDark, { showBack: true })}

  <g transform="translate(16, 106)">
    <rect width="380" height="110" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="190" y="32" fill="${t.textMain}" font-size="15" font-weight="800" text-anchor="middle">How is your PujoPath experience?</text>
    <text x="190" y="50" fill="${t.textMuted}" font-size="11" text-anchor="middle">Tap to rate your pandal hopping experience</text>
    <text x="190" y="86" fill="#f59e0b" font-size="28" text-anchor="middle">★ ★ ★ ★ ★</text>
  </g>

  <!-- Category Selection -->
  <g transform="translate(16, 232)">
    <text x="0" y="16" fill="${t.textMain}" font-size="13" font-weight="700">What is your feedback about?</text>
    <g transform="translate(0, 26)">
      <rect width="102" height="30" rx="10" fill="${t.red}"/>
      <text x="51" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">Pandal Info</text>
      <g transform="translate(110, 0)">
        <rect width="112" height="30" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="56" y="19" fill="${t.textMuted}" font-size="11" text-anchor="middle">Route Planner</text>
      </g>
      <g transform="translate(230, 0)">
        <rect width="80" height="30" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="40" y="19" fill="${t.textMuted}" font-size="11" text-anchor="middle">Audio</text>
      </g>
    </g>
  </g>

  <!-- Multiline Input Box -->
  <g transform="translate(16, 310)">
    <text x="0" y="16" fill="${t.textMain}" font-size="13" font-weight="700">Your Message</text>
    <rect y="26" width="380" height="140" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="16" y="56" fill="${t.textMuted}" font-size="12">Tell us about missing pandals, wrong timings, or suggested features...</text>
  </g>

  <!-- Email Input Box -->
  <g transform="translate(16, 496)">
    <text x="0" y="16" fill="${t.textMain}" font-size="13" font-weight="700">Email Address (Optional)</text>
    <rect y="26" width="380" height="46" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="16" y="54" fill="${t.textMuted}" font-size="12">name@example.com</text>
  </g>

  <!-- Submit Button -->
  <g transform="translate(16, 590)">
    <rect width="380" height="46" rx="14" fill="${t.red}"/>
    <text x="190" y="28" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Submit Feedback →</text>
  </g>

  <g transform="translate(0, ${H - 88})">
    ${renderNativeBottomNav('More', isDark, 0)}
    ${renderNativeGesturePill(64, isDark)}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 13. Native Notifications Screen (412 x 1150)
// -----------------------------------------------------------------------------
function generateNativeNotifications(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1150;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('Notifications', isDark, { showBack: true })}

  <!-- Status Card -->
  <g transform="translate(16, 106)">
    <rect width="380" height="80" rx="16" fill="${isDark ? '#143823' : '#f0fdf4'}" stroke="#86efac" stroke-width="1"/>
    <text x="20" y="32" fill="#15803d" font-size="12" font-weight="800">✓ NOTIFICATIONS ACTIVE</text>
    <text x="20" y="54" fill="${t.textMain}" font-size="13" font-weight="600">You will receive morning reminders &amp; Sandhi Puja tithi alerts.</text>
  </g>

  <!-- Morning Reminder Card -->
  <g transform="translate(16, 202)">
    <rect width="380" height="120" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="20" y="32" fill="${t.textMain}" font-size="14" font-weight="800">Daily Morning Puja Briefing</text>
    <text x="20" y="50" fill="${t.textMuted}" font-size="11">Receive today's tithi schedule &amp; crowd forecast</text>

    <!-- Timing Chips -->
    <g transform="translate(20, 68)">
      <rect width="64" height="28" rx="8" fill="${t.red}"/>
      <text x="32" y="18" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">8:00 AM</text>
      <g transform="translate(72, 0)">
        <rect width="64" height="28" rx="8" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="32" y="18" fill="${t.textMuted}" font-size="11" text-anchor="middle">9:00 AM</text>
      </g>
      <g transform="translate(144, 0)">
        <rect width="72" height="28" rx="8" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="36" y="18" fill="${t.textMuted}" font-size="11" text-anchor="middle">10:00 AM</text>
      </g>
    </g>
  </g>

  <!-- Sandhi Puja Alert Toggle -->
  <g transform="translate(16, 338)">
    <rect width="380" height="84" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="20" y="34" fill="${t.textMain}" font-size="14" font-weight="800">Sandhi Puja 1-Hour Early Reminder</text>
    <text x="20" y="54" fill="${t.textMuted}" font-size="11">Notify 60 minutes before the 48-minute juncture begins</text>
    <rect x="320" y="28" width="44" height="26" rx="13" fill="#16a34a"/>
    <circle cx="351" cy="41" r="10" fill="#FFFFFF"/>
  </g>

  <g transform="translate(0, ${H - 88})">
    ${renderNativeBottomNav('More', isDark, 0)}
    ${renderNativeGesturePill(64, isDark)}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// 14. Native Pandal Detail Screen (412 x 1200)
// -----------------------------------------------------------------------------
function generateNativePandalDetail(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  const H = 1200;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="${H}" viewBox="0 0 412 ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="${H}" fill="${t.bg}"/>
  ${renderNativeStatusBar(isDark, true)}

  <!-- Fullscreen Cover Artwork -->
  <image href="${IMAGES.bagbazar}" width="412" height="260" preserveAspectRatio="xMidYMid slice"/>
  <rect width="412" height="260" fill="black" fill-opacity="0.35"/>

  <!-- Back button overlay -->
  <g transform="translate(16, 48)">
    <circle cx="18" cy="18" r="18" fill="rgba(0,0,0,0.5)"/>
    <path d="M22 18H14M14 18L18 14M14 18L18 22" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Pandal Sheet Body -->
  <g transform="translate(0, 240)">
    <rect width="412" height="960" rx="24" fill="${t.bg}"/>
    <line x1="186" y1="12" x2="226" y2="12" stroke="${t.cardBorder}" stroke-width="4" stroke-linecap="round"/>

    <g transform="translate(20, 36)">
      <rect width="90" height="22" rx="6" fill="${t.red}"/>
      <text x="45" y="15" fill="#FFFFFF" font-size="10" font-weight="800" text-anchor="middle">106th Year</text>
      <g transform="translate(98, 0)">
        <rect width="102" height="22" rx="6" fill="${t.redPillBg}"/>
        <text x="51" y="15" fill="${t.redPillText}" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
      </g>
    </g>

    <text x="20" y="90" fill="${t.textMain}" font-size="22" font-weight="900">Bagbazar Sarbojanin Durgotsav</text>
    <text x="20" y="112" fill="${t.red}" font-size="13" font-weight="700" class="bengali">বাগবাজার সর্বজনীন দুর্গোৎসব ও প্রদর্শনী</text>

    <!-- Metro and Address Box -->
    <g transform="translate(20, 130)">
      <rect width="372" height="64" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="16" y="26" fill="${t.textMain}" font-size="12" font-weight="700">🚇 Shyambazar Metro Station (Exit 1)</text>
      <text x="16" y="46" fill="${t.textMuted}" font-size="11">500m walk via Girish Avenue • Approx 6 minutes</text>
    </g>

    <text x="20" y="222" fill="${t.textMain}" font-size="14" font-weight="800">Historical Significance</text>
    <text x="20" y="244" fill="${t.textMuted}" font-size="12">Founded in 1919 by revolutionary freedom fighters, Bagbazar Sarbojanin pioneered community public Durga Puja in Kolkata.</text>
    <text x="20" y="278" fill="${t.textMuted}" font-size="12">The traditional pristine white Daker Saaj idol and historical exhibition grounds attract millions of pilgrims each year.</text>

    <!-- Action Buttons -->
    <g transform="translate(20, 320)">
      <rect width="372" height="46" rx="14" fill="${t.red}"/>
      <text x="186" y="28" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">🧭 Start Walking Navigation</text>
    </g>
    <g transform="translate(20, 376)">
      <rect width="372" height="44" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1.5"/>
      <text x="186" y="27" fill="${t.textMain}" font-size="13" font-weight="700" text-anchor="middle">📌 Add to Itinerary</text>
    </g>
  </g>

  ${renderNativeGesturePill(1170, isDark)}
</svg>`;
}

// -----------------------------------------------------------------------------
// 15. Native More Drawer Menu (412 x 915)
// -----------------------------------------------------------------------------
function generateNativeMoreDrawer(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <!-- Dark Backdrop -->
  <rect width="412" height="915" fill="black" fill-opacity="0.6"/>
  ${renderNativeStatusBar(isDark, true)}

  <!-- Drawer Surface -->
  <g transform="translate(0, 160)">
    <rect width="412" height="755" rx="24" fill="${t.card}"/>
    <line x1="186" y1="12" x2="226" y2="12" stroke="${t.cardBorder}" stroke-width="4" stroke-linecap="round"/>

    <text x="24" y="44" fill="${t.textMain}" font-size="18" font-weight="900">Explore More Features</text>
    <text x="24" y="64" fill="${t.textMuted}" font-size="11">Festival tools, transit schedules, and developer info</text>

    <!-- Menu List -->
    <!-- Item 1: Calendar -->
    <g transform="translate(24, 84)">
      <rect width="364" height="48" rx="12" fill="${t.cardInner}"/>
      <text x="16" y="30" fill="${t.red}" font-size="15">📅</text>
      <text x="44" y="30" fill="${t.textMain}" font-size="13" font-weight="700">Calendar &amp; Tithi Almanac</text>
      <text x="340" y="30" fill="${t.textMuted}" font-size="14">→</text>
    </g>

    <!-- Item 2: Metro Guide -->
    <g transform="translate(24, 140)">
      <rect width="364" height="48" rx="12" fill="${t.cardInner}"/>
      <text x="16" y="30" fill="#2563eb" font-size="15">🚇</text>
      <text x="44" y="30" fill="${t.textMain}" font-size="13" font-weight="700">Kolkata Metro Timetables</text>
      <text x="340" y="30" fill="${t.textMuted}" font-size="14">→</text>
    </g>

    <!-- Item 3: Puja Music -->
    <g transform="translate(24, 196)">
      <rect width="364" height="48" rx="12" fill="${t.cardInner}"/>
      <text x="16" y="30" fill="#9333ea" font-size="15">🎵</text>
      <text x="44" y="30" fill="${t.textMain}" font-size="13" font-weight="700">Sharodiya Soundscapes</text>
      <text x="340" y="30" fill="${t.textMuted}" font-size="14">→</text>
    </g>

    <!-- Item 4: Mahalaya -->
    <g transform="translate(24, 252)">
      <rect width="364" height="48" rx="12" fill="${t.cardInner}"/>
      <text x="16" y="30" fill="#ca8a04" font-size="15">✨</text>
      <text x="44" y="30" fill="${t.textMain}" font-size="13" font-weight="700">Mahalaya Broadcast (1931)</text>
      <text x="340" y="30" fill="${t.textMuted}" font-size="14">→</text>
    </g>

    <!-- Item 5: Kali Puja Guide -->
    <g transform="translate(24, 308)">
      <rect width="364" height="48" rx="12" fill="${t.cardInner}"/>
      <text x="16" y="30" fill="#6b21a8" font-size="15">🪔</text>
      <text x="44" y="30" fill="${t.textMain}" font-size="13" font-weight="700">Kali Puja 2026 Special</text>
      <text x="340" y="30" fill="${t.textMuted}" font-size="14">→</text>
    </g>

    <!-- Item 6: Emergency Helplines -->
    <g transform="translate(24, 364)">
      <rect width="364" height="48" rx="12" fill="${t.cardInner}"/>
      <text x="16" y="30" fill="${t.red}" font-size="15">🚨</text>
      <text x="44" y="30" fill="${t.textMain}" font-size="13" font-weight="700">Emergency Helplines</text>
      <text x="340" y="30" fill="${t.textMuted}" font-size="14">→</text>
    </g>

    <!-- Item 7: Meet Developers -->
    <g transform="translate(24, 420)">
      <rect width="364" height="48" rx="12" fill="${t.cardInner}"/>
      <text x="16" y="30" fill="#0284c7" font-size="15">👥</text>
      <text x="44" y="30" fill="${t.textMain}" font-size="13" font-weight="700">Meet Developers (Moumita &amp; Soumik)</text>
      <text x="340" y="30" fill="${t.textMuted}" font-size="14">→</text>
    </g>

    <!-- Switch Festival Pill Button -->
    <g transform="translate(24, 490)">
      <rect width="364" height="46" rx="14" fill="${t.redPillBg}" stroke="${t.redPillBorder}" stroke-width="1"/>
      <text x="182" y="28" fill="${t.redPillText}" font-size="12" font-weight="800" text-anchor="middle">🔄 Switch Festival: Durga Puja / Kali Puja</text>
    </g>

    <text x="206" y="560" fill="${t.textFaint}" font-size="10" text-anchor="middle">PujoPath Native v1.2.0 (React Native + Hermes)</text>
  </g>

  ${renderNativeGesturePill(891, isDark)}
</svg>`;
}

// -----------------------------------------------------------------------------
// 16. Native Kali Home Screen (412 x 915)
// -----------------------------------------------------------------------------
function generateNativeKaliHome(isDark = false) {
  const t = isDark ? TOKENS.dark : TOKENS.light;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  <rect width="412" height="915" fill="${isDark ? '#110c1c' : '#faf5ff'}"/>
  ${renderNativeStatusBar(isDark)}
  ${renderNativeHeader('', isDark, { festivalPill: '🔥 Kali Puja' })}

  <!-- Hero Card: Dipanwita Amavasya -->
  <g transform="translate(16, 110)">
    <rect width="380" height="220" rx="20" fill="${isDark ? '#1a1128' : '#ffffff'}" stroke="#d8b4fe" stroke-width="1"/>
    <g transform="translate(20, 20)">
      <rect width="138" height="22" rx="11" fill="#f3e8ff" stroke="#d8b4fe" stroke-width="1"/>
      <text x="69" y="15" fill="#6b21a8" font-size="10" font-weight="700" text-anchor="middle">🪔 Dipanwita Amavasya</text>
    </g>
    <text x="20" y="74" fill="${t.textMain}" font-size="22" font-weight="900">Shyama Puja 2026</text>
    <text x="20" y="98" fill="${t.textMuted}" font-size="12">Explore 33 historic Shaktipeeths, Barasat illuminations, and sacred Shyama Sangeet.</text>

    <g transform="translate(20, 136)">
      <rect width="340" height="42" rx="14" fill="#6b21a8"/>
      <text x="170" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Explore 33 Kali Pandals →</text>
    </g>
  </g>

  <!-- Shaktipeeths Highlights -->
  <text x="20" y="360" fill="${t.textMain}" font-size="16" font-weight="800">Historic Shaktipeeths &amp; Mandirs</text>

  <!-- Grid of 4 Sacred Temples -->
  <g transform="translate(16, 376)">
    <!-- Kalighat -->
    <rect width="184" height="90" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="16" y="32" fill="${t.textMain}" font-size="14" font-weight="800">Kalighat Temple</text>
    <text x="16" y="50" fill="#6b21a8" font-size="11" font-weight="700">Maha Shaktipeeth</text>
    <text x="16" y="68" fill="${t.textMuted}" font-size="10">South Kolkata • 51 Peethas</text>

    <!-- Dakshineswar -->
    <g transform="translate(196, 0)">
      <rect width="184" height="90" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="16" y="32" fill="${t.textMain}" font-size="14" font-weight="800">Dakshineswar</text>
      <text x="16" y="50" fill="#6b21a8" font-size="11" font-weight="700">Bhavatarini Mandir</text>
      <text x="16" y="68" fill="${t.textMuted}" font-size="10">Rani Rashmoni Heritage</text>
    </g>
  </g>

  <g transform="translate(16, 476)">
    <!-- Barasat Pioneer -->
    <rect width="184" height="90" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="16" y="32" fill="${t.textMain}" font-size="14" font-weight="800">Pioneer Athletic</text>
    <text x="16" y="50" fill="#d97706" font-size="11" font-weight="700">Barasat Mega Pandal</text>
    <text x="16" y="68" fill="${t.textMuted}" font-size="10">Grand Illumination &amp; Theme</text>

    <!-- Boro Maa Naihati -->
    <g transform="translate(196, 0)">
      <rect width="184" height="90" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="16" y="32" fill="${t.textMain}" font-size="14" font-weight="800">Boro Maa Naihati</text>
      <text x="16" y="50" fill="#d97706" font-size="11" font-weight="700">Historic 21ft Idol</text>
      <text x="16" y="68" fill="${t.textMuted}" font-size="10">Over 100 Years of Devotion</text>
    </g>
  </g>

  <!-- Barasat Kali Festival Banner -->
  <g transform="translate(16, 580)">
    <rect width="380" height="80" rx="16" fill="${isDark ? '#261238' : '#faf5ff'}" stroke="#d8b4fe" stroke-width="1"/>
    <text x="16" y="30" fill="#6b21a8" font-size="11" font-weight="800">✨ BARASAT KALI FESTIVAL ZONE</text>
    <text x="16" y="50" fill="${t.textMain}" font-size="13" font-weight="700">18 Celebrated Pandals with World-Class Lighting</text>
    <text x="16" y="66" fill="${t.textMuted}" font-size="10">KNC Regiment • Pioneer • Nabapally Boys • Sandhani</text>
  </g>

  <!-- Floating Audio Miniplayer (Shyama Sangeet) -->
  <g transform="translate(16, 762)">
    <rect width="380" height="52" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <rect x="8" y="8" width="36" height="36" rx="8" fill="#6b21a8"/>
    <text x="26" y="31" fill="#FFFFFF" font-size="16" text-anchor="middle">🪔</text>
    <text x="52" y="26" fill="${t.textMain}" font-size="12" font-weight="700">Mayer Paayer Jaba Hoye (মাগো আনন্দময়ী)</text>
    <text x="52" y="40" fill="#6b21a8" font-size="10" font-weight="600">Pannalal Bhattacharya • Shyama Sangeet</text>
    <circle cx="352" cy="26" r="14" fill="#6b21a8"/>
    <path d="M350 20L356 26L350 32Z" fill="#FFFFFF"/>
  </g>

  ${renderNativeBottomNav('Home', isDark, 827)}
  ${renderNativeGesturePill(891, isDark)}
</svg>`;
}

// -----------------------------------------------------------------------------
// BUILD & WRITE ALL 32 NATIVE SCREENS (16 Light + 16 Dark)
// -----------------------------------------------------------------------------
const allScreens = [
  { name: '01_native_festival_select_light.svg', fn: () => generateFestivalSelect(false) },
  { name: '01_native_festival_select_dark.svg', fn: () => generateFestivalSelect(true) },
  { name: '02_native_home_light.svg', fn: () => generateNativeHome(false) },
  { name: '02_native_home_dark.svg', fn: () => generateNativeHome(true) },
  { name: '03_native_explore_light.svg', fn: () => generateNativeExplore(false) },
  { name: '03_native_explore_dark.svg', fn: () => generateNativeExplore(true) },
  { name: '04_native_map_light.svg', fn: () => generateNativeMap(false) },
  { name: '04_native_map_dark.svg', fn: () => generateNativeMap(true) },
  { name: '05_native_planner_light.svg', fn: () => generateNativePlanner(false) },
  { name: '05_native_planner_dark.svg', fn: () => generateNativePlanner(true) },
  { name: '06_native_calendar_light.svg', fn: () => generateNativeCalendar(false) },
  { name: '06_native_calendar_dark.svg', fn: () => generateNativeCalendar(true) },
  { name: '07_native_metro_light.svg', fn: () => generateNativeMetro(false) },
  { name: '07_native_metro_dark.svg', fn: () => generateNativeMetro(true) },
  { name: '08_native_music_player_light.svg', fn: () => generateNativeMusic(false) },
  { name: '08_native_music_player_dark.svg', fn: () => generateNativeMusic(true) },
  { name: '09_native_mahalaya_light.svg', fn: () => generateNativeMahalaya(false) },
  { name: '09_native_mahalaya_dark.svg', fn: () => generateNativeMahalaya(true) },
  { name: '10_native_developer_light.svg', fn: () => generateNativeDeveloper(false) },
  { name: '10_native_developer_dark.svg', fn: () => generateNativeDeveloper(true) },
  { name: '11_native_helpline_light.svg', fn: () => generateNativeHelpline(false) },
  { name: '11_native_helpline_dark.svg', fn: () => generateNativeHelpline(true) },
  { name: '12_native_feedback_light.svg', fn: () => generateNativeFeedback(false) },
  { name: '12_native_feedback_dark.svg', fn: () => generateNativeFeedback(true) },
  { name: '13_native_notifications_light.svg', fn: () => generateNativeNotifications(false) },
  { name: '13_native_notifications_dark.svg', fn: () => generateNativeNotifications(true) },
  { name: '14_native_pandal_detail_light.svg', fn: () => generateNativePandalDetail(false) },
  { name: '14_native_pandal_detail_dark.svg', fn: () => generateNativePandalDetail(true) },
  { name: '15_native_more_drawer_light.svg', fn: () => generateNativeMoreDrawer(false) },
  { name: '15_native_more_drawer_dark.svg', fn: () => generateNativeMoreDrawer(true) },
  { name: '16_native_kali_home_light.svg', fn: () => generateNativeKaliHome(false) },
  { name: '16_native_kali_home_dark.svg', fn: () => generateNativeKaliHome(true) }
];

console.log('Generating all 32 Native Android screens...');
allScreens.forEach(s => {
  const content = s.fn();
  const filePath = path.join(OUT_DIR, s.name);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ Generated:', s.name, (content.length / 1024).toFixed(1) + ' KB');
});
console.log('Done generating all 32 Native Android vector SVGs!');
