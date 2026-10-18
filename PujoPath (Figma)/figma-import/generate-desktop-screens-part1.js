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

// 02. EXPLORE SCREEN (1440 x 1460 px)
function generateExplore() {
  const W = 1440;
  const H = 1460;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderBackground(H)}
  ${renderHeader('Explore')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${C.redPillText}" font-size="12" font-weight="700" letter-spacing="1">🔍 PANDAL DIRECTORY</text>
    <text x="0" y="54" fill="${C.textMain}" font-size="34" font-weight="800">Explore Kolkata Pandals</text>
    <text x="0" y="82" fill="${C.textMuted}" font-size="14">Filter by heritage traditions, thematic craftsmanship, nearby metro stations, and crowd levels.</text>

    <!-- Search Input -->
    <g transform="translate(0, 108)">
      <rect width="1152" height="52" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="20" y="32" fill="${C.textMuted}" font-size="15">🔍</text>
      <text x="48" y="32" fill="${C.textMuted}" font-size="14">Search pandals by name, Bonedi Bari, theme, locality or metro...</text>
    </g>

    <!-- Filter by Zone Pills -->
    <g transform="translate(0, 176)">
      <text x="0" y="16" fill="${C.textMuted}" font-size="11" font-weight="700" letter-spacing="0.5">FILTER BY ZONE</text>
      <g transform="translate(0, 26)">
        <!-- All Zones (active) -->
        <rect x="0" y="0" width="84" height="32" rx="10" fill="${C.red}"/>
        <text x="42" y="21" fill="${C.white}" font-size="12" font-weight="700" text-anchor="middle">All Zones</text>
        
        <!-- Other Zones -->
        <rect x="92" y="0" width="104" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="144" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">North Kolkata</text>

        <rect x="204" y="0" width="104" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="256" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">South Kolkata</text>

        <rect x="316" y="0" width="112" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="372" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">Central Kolkata</text>

        <rect x="436" y="0" width="80" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="476" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">Salt Lake</text>

        <rect x="524" y="0" width="80" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="564" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">Dum Dum</text>

        <rect x="612" y="0" width="70" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="647" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">Behala</text>

        <rect x="690" y="0" width="76" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="728" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">Howrah</text>
      </g>
    </g>

    <!-- Results Counter & Sort -->
    <g transform="translate(0, 252)">
      <text x="0" y="18" fill="${C.textMuted}" font-size="13">Showing <tspan fill="${C.textMain}" font-weight="700">774</tspan> pandals</text>
      <rect x="1020" y="0" width="132" height="32" rx="8" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="1032" y="21" fill="${C.textMain}" font-size="12" font-weight="600">Recommended ⌵</text>
    </g>

    <!-- 3-COLUMN CARD GRID -->
    <!-- ROW 1 (y: 298) -->
    <g transform="translate(0, 298)">
      <!-- Card 1: Sreebhumi -->
      <g id="Explore_Card_1" transform="translate(0, 0)">
        <rect width="368" height="370" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <clipPath id="expImg1"><rect x="0" y="0" width="368" height="200" rx="18"/></clipPath>
        <image href="${ASSETS.sreebhumi}" x="0" y="0" width="368" height="200" preserveAspectRatio="xMidYMid slice" clip-path="url(#expImg1)"/>
        <!-- Badge -->
        <rect x="14" y="14" width="74" height="22" rx="6" fill="#000000" fill-opacity="0.6"/>
        <text x="51" y="29" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">Dum Dum</text>
        <!-- Heart -->
        <circle cx="342" cy="25" r="14" fill="#000000" fill-opacity="0.5"/>
        <text x="342" y="30" fill="#FFFFFF" font-size="12" text-anchor="middle">♡</text>

        <!-- Content -->
        <g transform="translate(18, 222)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Sreebhumi Sporting Club</text>
          <text x="0" y="40" fill="${C.textMuted}" font-size="12">📍 Lake Town / VIP Road</text>
          <text x="332" y="40" fill="${C.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="60" fill="${C.blueLine}" font-size="12">🚇 Dum Dum Metro (2.9 km)</text>
          
          <line x1="0" y1="84" x2="332" y2="84" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="0" y="112" fill="${C.red}" font-size="13" font-weight="700">View Details →</text>
          <rect x="232" y="94" width="100" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="282" y="113" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">+ Add Route</text>
        </g>
      </g>

      <!-- Card 2: Sovabazar Rajbari -->
      <g id="Explore_Card_2" transform="translate(392, 0)">
        <rect width="368" height="370" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <clipPath id="expImg2"><rect x="0" y="0" width="368" height="200" rx="18"/></clipPath>
        <image href="${ASSETS.sovabazar}" x="0" y="0" width="368" height="200" preserveAspectRatio="xMidYMid slice" clip-path="url(#expImg2)"/>
        <!-- Badges -->
        <rect x="14" y="14" width="84" height="22" rx="6" fill="#000000" fill-opacity="0.6"/>
        <text x="56" y="29" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
        <rect x="104" y="14" width="76" height="22" rx="6" fill="${C.red}"/>
        <text x="142" y="29" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">Bonedi Bari</text>
        <!-- Heart -->
        <circle cx="342" cy="25" r="14" fill="#000000" fill-opacity="0.5"/>
        <text x="342" y="30" fill="#FFFFFF" font-size="12" text-anchor="middle">♡</text>

        <!-- Content -->
        <g transform="translate(18, 222)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Sovabazar Rajbari (Boro Taraf)</text>
          <text x="0" y="40" fill="${C.textMuted}" font-size="12">📍 Sovabazar</text>
          <text x="332" y="40" fill="${C.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="60" fill="${C.blueLine}" font-size="12">🚇 Shobhabazar Sutanuti Metro (300 m)</text>
          
          <line x1="0" y1="84" x2="332" y2="84" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="0" y="112" fill="${C.red}" font-size="13" font-weight="700">View Details →</text>
          <rect x="232" y="94" width="100" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="282" y="113" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">+ Add Route</text>
        </g>
      </g>

      <!-- Card 3: Santosh Mitra Square -->
      <g id="Explore_Card_3" transform="translate(784, 0)">
        <rect width="368" height="370" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <clipPath id="expImg3"><rect x="0" y="0" width="368" height="200" rx="18"/></clipPath>
        <image href="${ASSETS.santoshMitra}" x="0" y="0" width="368" height="200" preserveAspectRatio="xMidYMid slice" clip-path="url(#expImg3)"/>
        <!-- Badge -->
        <rect x="14" y="14" width="94" height="22" rx="6" fill="#000000" fill-opacity="0.6"/>
        <text x="61" y="29" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">Central Kolkata</text>
        <!-- Heart -->
        <circle cx="342" cy="25" r="14" fill="#000000" fill-opacity="0.5"/>
        <text x="342" y="30" fill="#FFFFFF" font-size="12" text-anchor="middle">♡</text>

        <!-- Content -->
        <g transform="translate(18, 222)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Santosh Mitra Square (Lebutala)</text>
          <text x="0" y="40" fill="${C.textMuted}" font-size="12">📍 Bowbazar / Sealdah</text>
          <text x="332" y="40" fill="${C.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="60" fill="${C.blueLine}" font-size="12">🚇 Central Metro (700 m)</text>
          
          <line x1="0" y1="84" x2="332" y2="84" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="0" y="112" fill="${C.red}" font-size="13" font-weight="700">View Details →</text>
          <rect x="232" y="94" width="100" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="282" y="113" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">+ Add Route</text>
        </g>
      </g>
    </g>

    <!-- ROW 2 (y: 692) -->
    <g transform="translate(0, 692)">
      <!-- Card 4: Maddox Square -->
      <g id="Explore_Card_4" transform="translate(0, 0)">
        <rect width="368" height="370" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <clipPath id="expImg4"><rect x="0" y="0" width="368" height="200" rx="18"/></clipPath>
        <image href="${ASSETS.maddox}" x="0" y="0" width="368" height="200" preserveAspectRatio="xMidYMid slice" clip-path="url(#expImg4)"/>
        <!-- Badges -->
        <rect x="14" y="14" width="86" height="22" rx="6" fill="#000000" fill-opacity="0.6"/>
        <text x="57" y="29" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">South Kolkata</text>
        <rect x="106" y="14" width="60" height="22" rx="6" fill="#ca8a04"/>
        <text x="136" y="29" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">Heritage</text>

        <!-- Content -->
        <g transform="translate(18, 222)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Maddox Square (Ballygunge)</text>
          <text x="0" y="40" fill="${C.textMuted}" font-size="12">📍 Ballygunge / Ritchie Road</text>
          <text x="332" y="40" fill="${C.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="60" fill="${C.blueLine}" font-size="12">🚇 Netaji Bhavan Metro (1.1 km)</text>
          
          <line x1="0" y1="84" x2="332" y2="84" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="0" y="112" fill="${C.red}" font-size="13" font-weight="700">View Details →</text>
          <rect x="232" y="94" width="100" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="282" y="113" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">+ Add Route</text>
        </g>
      </g>

      <!-- Card 5: Bagbazar Sarbojanin -->
      <g id="Explore_Card_5" transform="translate(392, 0)">
        <rect width="368" height="370" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <clipPath id="expImg5"><rect x="0" y="0" width="368" height="200" rx="18"/></clipPath>
        <image href="${ASSETS.bagbazar}" x="0" y="0" width="368" height="200" preserveAspectRatio="xMidYMid slice" clip-path="url(#expImg5)"/>
        <!-- Badges -->
        <rect x="14" y="14" width="86" height="22" rx="6" fill="#000000" fill-opacity="0.6"/>
        <text x="57" y="29" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
        <rect x="106" y="14" width="60" height="22" rx="6" fill="#ca8a04"/>
        <text x="136" y="29" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">Heritage</text>

        <!-- Content -->
        <g transform="translate(18, 222)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Bagbazar Sarbojanin</text>
          <text x="0" y="40" fill="${C.textMuted}" font-size="12">📍 Bagbazar</text>
          <text x="332" y="40" fill="${C.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="60" fill="${C.blueLine}" font-size="12">🚇 Shyambazar Metro (750 m)</text>
          
          <line x1="0" y1="84" x2="332" y2="84" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="0" y="112" fill="${C.red}" font-size="13" font-weight="700">View Details →</text>
          <rect x="232" y="94" width="100" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="282" y="113" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">+ Add Route</text>
        </g>
      </g>

      <!-- Card 6: Ekdalia Evergreen -->
      <g id="Explore_Card_6" transform="translate(784, 0)">
        <rect width="368" height="370" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <clipPath id="expImg6"><rect x="0" y="0" width="368" height="200" rx="18"/></clipPath>
        <image href="${ASSETS.ekdalia}" x="0" y="0" width="368" height="200" preserveAspectRatio="xMidYMid slice" clip-path="url(#expImg6)"/>
        <!-- Badges -->
        <rect x="14" y="14" width="86" height="22" rx="6" fill="#000000" fill-opacity="0.6"/>
        <text x="57" y="29" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">South Kolkata</text>
        <rect x="106" y="14" width="60" height="22" rx="6" fill="#ca8a04"/>
        <text x="136" y="29" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">Heritage</text>

        <!-- Content -->
        <g transform="translate(18, 222)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Ekdalia Evergreen Club</text>
          <text x="0" y="40" fill="${C.textMuted}" font-size="12">📍 Gariahat</text>
          <text x="332" y="40" fill="${C.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="60" fill="${C.blueLine}" font-size="12">🚇 Kalighat Metro (1.4 km)</text>
          
          <line x1="0" y1="84" x2="332" y2="84" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="0" y="112" fill="${C.red}" font-size="13" font-weight="700">View Details →</text>
          <rect x="232" y="94" width="100" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="282" y="113" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">+ Add Route</text>
        </g>
      </g>
    </g>

    <!-- Sticky Bottom Bar -->
    <g transform="translate(240, 1090)">
      <rect width="672" height="52" rx="26" fill="#181411" stroke="${C.cardBorder}" stroke-width="1"/>
      <circle cx="32" cy="26" r="14" fill="${C.red}" fill-opacity="0.2"/>
      <text x="32" y="31" fill="${C.red}" font-size="13" text-anchor="middle">🧭</text>
      <text x="58" y="26" fill="${C.textMain}" font-size="13" font-weight="700">0 Pandals Selected</text>
      <text x="58" y="40" fill="${C.textMuted}" font-size="11">Click "Add Route" on any card to build your trail</text>
      <rect x="532" y="10" width="124" height="32" rx="16" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="594" y="30" fill="${C.textMain}" font-size="12" font-weight="700" text-anchor="middle">Open Planner ↗</text>
    </g>
  </g>

  ${renderFooter(1280)}
</svg>
`;
}

// 03. MAP SCREEN (1440 x 1000 px)
function generateMap() {
  const W = 1440;
  const H = 1000;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderBackground(H)}
  ${renderHeader('Map')}

  <g transform="translate(144, 88)">
    <!-- Top Filter Pills -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="50" height="32" rx="10" fill="${C.red}"/>
      <text x="25" y="21" fill="${C.white}" font-size="12" font-weight="700" text-anchor="middle">All</text>

      <rect x="58" y="0" width="104" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="110" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">🏛 Bonedi Bari</text>

      <rect x="170" y="0" width="104" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="222" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">North Kolkata</text>

      <rect x="282" y="0" width="104" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="334" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">South Kolkata</text>

      <rect x="394" y="0" width="112" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="450" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">Central Kolkata</text>

      <rect x="514" y="0" width="80" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="554" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">Salt Lake</text>

      <rect x="602" y="0" width="80" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="642" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">Dum Dum</text>

      <rect x="690" y="0" width="76" height="32" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="728" y="21" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">Howrah</text>

      <!-- Metro Lines Button -->
      <rect x="1032" y="0" width="120" height="32" rx="10" fill="${C.cardBg}" stroke="${C.red}" stroke-width="1"/>
      <text x="1092" y="21" fill="${C.red}" font-size="12" font-weight="700" text-anchor="middle">🚇 Metro Lines</text>
    </g>

    <!-- Map Canvas Container (w: 1152, h: 640) -->
    <g transform="translate(0, 48)">
      <rect width="1152" height="640" rx="20" fill="#e8ecef" stroke="${C.cardBorder}" stroke-width="1"/>

      <!-- Kolkata River & Streets Vector -->
      <path d="M 380 0 C 350 150, 410 320, 360 480 C 330 560, 290 640, 240 640 L 290 640 C 340 640, 390 560, 420 480 C 470 320, 410 150, 440 0 Z" fill="#9ec5e8"/>
      
      <!-- Major roads / grid -->
      <line x1="100" y1="200" x2="1100" y2="240" stroke="#d5dce2" stroke-width="6"/>
      <line x1="200" y1="420" x2="1050" y2="380" stroke="#d5dce2" stroke-width="5"/>
      <line x1="600" y1="50" x2="580" y2="600" stroke="#d5dce2" stroke-width="6"/>
      <line x1="780" y1="80" x2="750" y2="580" stroke="#d5dce2" stroke-width="5"/>

      <!-- Metro Blue Line -->
      <path d="M 590 60 L 585 220 L 565 380 L 530 580" stroke="${C.blueLine}" stroke-width="4" stroke-dasharray="6,4"/>

      <!-- Pandal Cluster Markers -->
      <!-- Cluster 1 (North) -->
      <circle cx="560" cy="160" r="18" fill="${C.red}" stroke="#ffffff" stroke-width="3"/>
      <text x="560" y="165" fill="#ffffff" font-size="12" font-weight="800" text-anchor="middle">48</text>

      <!-- Cluster 2 (Central) -->
      <circle cx="610" cy="270" r="22" fill="${C.red}" stroke="#ffffff" stroke-width="3"/>
      <text x="610" y="276" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle">120</text>

      <!-- Cluster 3 (South) -->
      <circle cx="580" cy="410" r="24" fill="${C.red}" stroke="#ffffff" stroke-width="3"/>
      <text x="580" y="416" fill="#ffffff" font-size="14" font-weight="800" text-anchor="middle">186</text>

      <!-- Cluster 4 (Dum Dum) -->
      <circle cx="720" cy="140" r="16" fill="${C.red}" stroke="#ffffff" stroke-width="3"/>
      <text x="720" y="145" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">32</text>

      <!-- Cluster 5 (Salt Lake) -->
      <circle cx="840" cy="240" r="16" fill="${C.red}" stroke="#ffffff" stroke-width="3"/>
      <text x="840" y="245" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">24</text>

      <!-- Zoom Controls (+ / -) -->
      <g transform="translate(18, 18)">
        <rect width="36" height="72" rx="8" fill="#ffffff" stroke="#c0cad4" stroke-width="1"/>
        <text x="18" y="26" fill="#333333" font-size="18" font-weight="700" text-anchor="middle">+</text>
        <line x1="6" y1="36" x2="30" y2="36" stroke="#e0e0e0" stroke-width="1"/>
        <text x="18" y="60" fill="#333333" font-size="18" font-weight="700" text-anchor="middle">−</text>
      </g>

      <!-- Map Attribution -->
      <text x="1134" y="626" fill="#666666" font-size="10" text-anchor="end">🇺🇦 Leaflet | © OpenStreetMap contributors</text>
    </g>

    <!-- Sticky Bottom Bar -->
    <g transform="translate(240, 610)">
      <rect width="672" height="52" rx="26" fill="#181411" stroke="${C.cardBorder}" stroke-width="1"/>
      <circle cx="32" cy="26" r="14" fill="${C.red}" fill-opacity="0.2"/>
      <text x="32" y="31" fill="${C.red}" font-size="13" text-anchor="middle">🧭</text>
      <text x="58" y="26" fill="${C.textMain}" font-size="13" font-weight="700">0 Pandals Selected</text>
      <text x="58" y="40" fill="${C.textMuted}" font-size="11">Click "Add Route" on any card to build your trail</text>
      <rect x="532" y="10" width="124" height="32" rx="16" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="594" y="30" fill="${C.textMain}" font-size="12" font-weight="700" text-anchor="middle">Open Planner ↗</text>
    </g>
  </g>

  ${renderFooter(820)}
</svg>
`;
}

fs.writeFileSync(path.join(OUT_DIR, '02_web_desktop_explore.svg'), generateExplore().trim());
fs.writeFileSync(path.join(OUT_DIR, '03_web_desktop_map.svg'), generateMap().trim());
console.log('✓ 02_web_desktop_explore.svg & 03_web_desktop_map.svg generated');
