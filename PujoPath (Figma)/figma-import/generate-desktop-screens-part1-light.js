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

// 02. EXPLORE SCREEN LIGHT (1440 x 1460 px)
function generateExploreLight() {
  const W = 1440;
  const H = 1460;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE_LIGHT}
  ${renderBackgroundLight(H, false)}
  ${renderHeaderLight('Explore')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${CL.red}" font-size="12" font-weight="700" letter-spacing="1">🔍 PANDAL DIRECTORY</text>
    <text x="0" y="54" fill="${CL.textMain}" font-size="34" font-weight="800">Explore Kolkata Pandals</text>
    <text x="0" y="82" fill="${CL.textMuted}" font-size="14">Filter by heritage traditions, thematic craftsmanship, nearby metro stations, and crowd levels.</text>

    <!-- Search Input -->
    <g transform="translate(0, 108)">
      <rect width="1152" height="52" rx="16" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="20" y="32" fill="${CL.textFaint}" font-size="15">🔍</text>
      <text x="48" y="32" fill="${CL.textFaint}" font-size="14">Search pandals by name, Bonedi Bari, theme, locality or metro...</text>
    </g>

    <!-- Filter by Zone Pills -->
    <g transform="translate(0, 176)">
      <text x="0" y="16" fill="${CL.textFaint}" font-size="11" font-weight="700" letter-spacing="0.5">FILTER BY ZONE</text>
      <g transform="translate(0, 26)">
        <!-- All Zones (active) -->
        <rect x="0" y="0" width="84" height="32" rx="10" fill="${CL.red}"/>
        <text x="42" y="21" fill="${CL.white}" font-size="12" font-weight="700" text-anchor="middle">All Zones</text>
        
        <!-- Other Zones -->
        <rect x="92" y="0" width="104" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="144" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">North Kolkata</text>

        <rect x="204" y="0" width="104" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="256" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">South Kolkata</text>

        <rect x="316" y="0" width="112" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="372" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Central Kolkata</text>

        <rect x="436" y="0" width="80" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="476" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Salt Lake</text>

        <rect x="524" y="0" width="80" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="564" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Dum Dum</text>

        <rect x="612" y="0" width="70" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="647" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Behala</text>

        <rect x="690" y="0" width="76" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="728" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Howrah</text>
      </g>
    </g>

    <!-- Results Counter & Sort -->
    <g transform="translate(0, 252)">
      <text x="0" y="18" fill="${CL.textMuted}" font-size="13">Showing <tspan fill="${CL.textMain}" font-weight="700">774</tspan> pandals</text>
      <rect x="1020" y="0" width="132" height="32" rx="8" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="1032" y="21" fill="${CL.textMain}" font-size="12" font-weight="600">Recommended ⌵</text>
    </g>

    <!-- 3-COLUMN CARD GRID -->
    <!-- ROW 1 (y: 298) -->
    <g transform="translate(0, 298)">
      <!-- Card 1: Sreebhumi -->
      <g id="Explore_Card_1" transform="translate(0, 0)">
        <rect width="368" height="370" rx="18" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(10, 10)">
          <clipPath id="c1_clip"><rect width="348" height="180" rx="14"/></clipPath>
          <image href="${ASSETS.sreebhumi}" width="348" height="180" preserveAspectRatio="xMidYMid slice" clip-path="url(#c1_clip)"/>
          <rect x="10" y="10" width="76" height="24" rx="12" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="48" y="26" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">Dum Dum</text>
          <circle cx="328" cy="22" r="14" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="328" y="26" fill="${CL.textMuted}" font-size="13" text-anchor="middle">♡</text>
        </g>
        <g transform="translate(20, 204)">
          <text x="0" y="20" fill="${CL.textMain}" font-size="16" font-weight="800">Sreebhumi Sporting Club</text>
          <text x="0" y="44" fill="${CL.textSubtle}" font-size="12">📍 Lake Town / VIP Road</text>
          <text x="328" y="44" fill="${CL.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="66" fill="${CL.blueLine}" font-size="12" font-weight="600">🚇 Dum Dum Metro (2.9 km)</text>
          <g transform="translate(0, 88)">
            <text x="0" y="24" fill="${CL.red}" font-size="13" font-weight="700">View Details →</text>
            <rect x="228" y="4" width="100" height="30" rx="8" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
            <text x="278" y="24" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">+ Add Route</text>
          </g>
        </g>
      </g>

      <!-- Card 2: Sovabazar Rajbari -->
      <g id="Explore_Card_2" transform="translate(392, 0)">
        <rect width="368" height="370" rx="18" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(10, 10)">
          <clipPath id="c2_clip"><rect width="348" height="180" rx="14"/></clipPath>
          <image href="${ASSETS.sovabazar}" width="348" height="180" preserveAspectRatio="xMidYMid slice" clip-path="url(#c2_clip)"/>
          <rect x="10" y="10" width="94" height="24" rx="12" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="57" y="26" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">North Kolkata</text>
          <rect x="110" y="10" width="80" height="24" rx="12" fill="${CL.red}"/>
          <text x="150" y="26" fill="${CL.white}" font-size="11" font-weight="700" text-anchor="middle">Bonedi Bari</text>
          <circle cx="328" cy="22" r="14" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="328" y="26" fill="${CL.textMuted}" font-size="13" text-anchor="middle">♡</text>
        </g>
        <g transform="translate(20, 204)">
          <text x="0" y="20" fill="${CL.textMain}" font-size="16" font-weight="800">Sovabazar Rajbari (Boro Taraf)</text>
          <text x="0" y="44" fill="${CL.textSubtle}" font-size="12">📍 Sovabazar</text>
          <text x="328" y="44" fill="${CL.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="66" fill="${CL.blueLine}" font-size="12" font-weight="600">🚇 Shobhabazar Sutanuti Metro (300 m)</text>
          <g transform="translate(0, 88)">
            <text x="0" y="24" fill="${CL.red}" font-size="13" font-weight="700">View Details →</text>
            <rect x="228" y="4" width="100" height="30" rx="8" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
            <text x="278" y="24" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">+ Add Route</text>
          </g>
        </g>
      </g>

      <!-- Card 3: Santosh Mitra Square -->
      <g id="Explore_Card_3" transform="translate(784, 0)">
        <rect width="368" height="370" rx="18" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(10, 10)">
          <clipPath id="c3_clip"><rect width="348" height="180" rx="14"/></clipPath>
          <image href="${ASSETS.santoshMitra}" width="348" height="180" preserveAspectRatio="xMidYMid slice" clip-path="url(#c3_clip)"/>
          <rect x="10" y="10" width="100" height="24" rx="12" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="60" y="26" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">Central Kolkata</text>
          <circle cx="328" cy="22" r="14" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="328" y="26" fill="${CL.textMuted}" font-size="13" text-anchor="middle">♡</text>
        </g>
        <g transform="translate(20, 204)">
          <text x="0" y="20" fill="${CL.textMain}" font-size="16" font-weight="800">Santosh Mitra Square (Lebutala)</text>
          <text x="0" y="44" fill="${CL.textSubtle}" font-size="12">📍 Bowbazar / Sealdah</text>
          <text x="328" y="44" fill="${CL.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="66" fill="${CL.blueLine}" font-size="12" font-weight="600">🚇 Central Metro (700 m)</text>
          <g transform="translate(0, 88)">
            <text x="0" y="24" fill="${CL.red}" font-size="13" font-weight="700">View Details →</text>
            <rect x="228" y="4" width="100" height="30" rx="8" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
            <text x="278" y="24" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">+ Add Route</text>
          </g>
        </g>
      </g>
    </g>

    <!-- ROW 2 (y: 688) -->
    <g transform="translate(0, 688)">
      <!-- Card 4: Maddox Square -->
      <g id="Explore_Card_4" transform="translate(0, 0)">
        <rect width="368" height="370" rx="18" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(10, 10)">
          <clipPath id="c4_clip"><rect width="348" height="180" rx="14"/></clipPath>
          <image href="${ASSETS.maddox}" width="348" height="180" preserveAspectRatio="xMidYMid slice" clip-path="url(#c4_clip)"/>
          <rect x="10" y="10" width="94" height="24" rx="12" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="57" y="26" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">South Kolkata</text>
          <circle cx="328" cy="22" r="14" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="328" y="26" fill="${CL.textMuted}" font-size="13" text-anchor="middle">♡</text>
        </g>
        <g transform="translate(20, 204)">
          <text x="0" y="20" fill="${CL.textMain}" font-size="16" font-weight="800">Maddox Square (Ballygunge)</text>
          <text x="0" y="44" fill="${CL.textSubtle}" font-size="12">📍 Ballygunge / Ritchie Road</text>
          <text x="328" y="44" fill="${CL.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="66" fill="${CL.blueLine}" font-size="12" font-weight="600">🚇 Netaji Bhavan Metro (1.1 km)</text>
          <g transform="translate(0, 88)">
            <text x="0" y="24" fill="${CL.red}" font-size="13" font-weight="700">View Details →</text>
            <rect x="228" y="4" width="100" height="30" rx="8" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
            <text x="278" y="24" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">+ Add Route</text>
          </g>
        </g>
      </g>

      <!-- Card 5: Bagbazar Sarbojanin -->
      <g id="Explore_Card_5" transform="translate(392, 0)">
        <rect width="368" height="370" rx="18" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(10, 10)">
          <clipPath id="c5_clip"><rect width="348" height="180" rx="14"/></clipPath>
          <image href="${ASSETS.bagbazar}" width="348" height="180" preserveAspectRatio="xMidYMid slice" clip-path="url(#c5_clip)"/>
          <rect x="10" y="10" width="94" height="24" rx="12" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="57" y="26" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">North Kolkata</text>
          <circle cx="328" cy="22" r="14" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="328" y="26" fill="${CL.textMuted}" font-size="13" text-anchor="middle">♡</text>
        </g>
        <g transform="translate(20, 204)">
          <text x="0" y="20" fill="${CL.textMain}" font-size="16" font-weight="800">Bagbazar Sarbojanin</text>
          <text x="0" y="44" fill="${CL.textSubtle}" font-size="12">📍 Bagbazar</text>
          <text x="328" y="44" fill="${CL.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="66" fill="${CL.blueLine}" font-size="12" font-weight="600">🚇 Shyambazar Metro (750 m)</text>
          <g transform="translate(0, 88)">
            <text x="0" y="24" fill="${CL.red}" font-size="13" font-weight="700">View Details →</text>
            <rect x="228" y="4" width="100" height="30" rx="8" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
            <text x="278" y="24" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">+ Add Route</text>
          </g>
        </g>
      </g>

      <!-- Card 6: Ekdalia Evergreen -->
      <g id="Explore_Card_6" transform="translate(784, 0)">
        <rect width="368" height="370" rx="18" fill="${CL.cardBg}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(10, 10)">
          <clipPath id="c6_clip"><rect width="348" height="180" rx="14"/></clipPath>
          <image href="${ASSETS.ekdalia}" width="348" height="180" preserveAspectRatio="xMidYMid slice" clip-path="url(#c6_clip)"/>
          <rect x="10" y="10" width="94" height="24" rx="12" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="57" y="26" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">South Kolkata</text>
          <circle cx="328" cy="22" r="14" fill="${CL.white}" fill-opacity="0.9"/>
          <text x="328" y="26" fill="${CL.textMuted}" font-size="13" text-anchor="middle">♡</text>
        </g>
        <g transform="translate(20, 204)">
          <text x="0" y="20" fill="${CL.textMain}" font-size="16" font-weight="800">Ekdalia Evergreen Club</text>
          <text x="0" y="44" fill="${CL.textSubtle}" font-size="12">📍 Gariahat</text>
          <text x="328" y="44" fill="${CL.amberStar}" font-size="12" font-weight="700" text-anchor="end">★ 4.9</text>
          <text x="0" y="66" fill="${CL.blueLine}" font-size="12" font-weight="600">🚇 Kalighat Metro (1.4 km)</text>
          <g transform="translate(0, 88)">
            <text x="0" y="24" fill="${CL.red}" font-size="13" font-weight="700">View Details →</text>
            <rect x="228" y="4" width="100" height="30" rx="8" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
            <text x="278" y="24" fill="${CL.textMain}" font-size="11" font-weight="700" text-anchor="middle">+ Add Route</text>
          </g>
        </g>
      </g>
    </g>

    <!-- STICKY BOTTOM TRAIL BAR (y: 1080) -->
    <g id="Sticky_Trail_Bar" transform="translate(100, 1080)">
      <rect width="952" height="54" rx="16" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1" filter="url(#softShadow)"/>
      <rect x="14" y="11" width="32" height="32" rx="10" fill="#feeceb"/>
      <text x="30" y="32" fill="${CL.red}" font-size="14" text-anchor="middle">🧭</text>
      <text x="56" y="28" fill="${CL.textMain}" font-size="13" font-weight="700">0 Pandals Selected</text>
      <text x="56" y="43" fill="${CL.textFaint}" font-size="11">Click "Add Route" on any card to build your trail</text>
      <g transform="translate(800, 11)">
        <rect width="138" height="32" rx="8" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
        <text x="69" y="21" fill="${CL.textMain}" font-size="12" font-weight="700" text-anchor="middle">Open Planner ↗</text>
      </g>
    </g>
  </g>

  ${renderFooterLight(1302)}
</svg>
`;
}

// 03. MAP SCREEN LIGHT (1440 x 1000 px)
function generateMapLight() {
  const W = 1440;
  const H = 1000;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE_LIGHT}
  ${renderBackgroundLight(H, false)}
  ${renderHeaderLight('Map')}

  <g transform="translate(144, 80)">
    <!-- Zone Filter Bar (w: 1152) -->
    <g id="Map_Zone_Filter_Bar">
      <rect x="0" y="0" width="60" height="34" rx="10" fill="${CL.red}"/>
      <text x="30" y="22" fill="${CL.white}" font-size="12" font-weight="700" text-anchor="middle">All</text>

      <rect x="68" y="0" width="112" height="34" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="124" y="22" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">🏛 Bonedi Bari</text>

      <rect x="188" y="0" width="104" height="34" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="240" y="22" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">North Kolkata</text>

      <rect x="300" y="0" width="104" height="34" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="352" y="22" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">South Kolkata</text>

      <rect x="412" y="0" width="112" height="34" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="468" y="22" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Central Kolkata</text>

      <rect x="532" y="0" width="80" height="34" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="572" y="22" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Salt Lake</text>

      <rect x="620" y="0" width="80" height="34" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="660" y="22" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Dum Dum</text>

      <rect x="708" y="0" width="70" height="34" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="743" y="22" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Behala</text>

      <rect x="786" y="0" width="76" height="34" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="824" y="22" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Howrah</text>

      <rect x="870" y="0" width="104" height="34" rx="10" fill="${CL.white}" stroke="${CL.redPillBorder}" stroke-width="1"/>
      <text x="922" y="22" fill="${CL.red}" font-size="12" font-weight="700" text-anchor="middle">🚇 Metro Lines</text>
    </g>

    <!-- Vector Map Container (w: 1152, h: 630) -->
    <g id="Interactive_Vector_Map_Light" transform="translate(0, 48)">
      <rect width="1152" height="630" rx="22" fill="#f4efe6" stroke="${CL.cardBorder}" stroke-width="1.5"/>

      <!-- Hooghly River Flow in soft blue -->
      <path d="M 280,0 Q 290,120 260,240 T 290,480 T 240,630" fill="none" stroke="#bfdbfe" stroke-width="54" stroke-linecap="round"/>
      <text x="280" y="340" fill="#3b82f6" font-size="12" font-style="italic" font-weight="600" transform="rotate(-82, 280, 340)">Hooghly River (Ganga)</text>

      <!-- Road Networks (White major roads, light orange expressways) -->
      <path d="M 0,260 L 1152,240" stroke="#fed7aa" stroke-width="6"/>
      <path d="M 0,420 L 1152,430" stroke="#ffffff" stroke-width="7"/>
      <path d="M 380,0 L 410,630" stroke="#ffffff" stroke-width="8"/>
      <path d="M 640,0 L 610,630" stroke="#fed7aa" stroke-width="7"/>
      <path d="M 880,0 L 890,630" stroke="#ffffff" stroke-width="6"/>

      <!-- Metro Line (Blue Line North-South & Green Line East-West) -->
      <path d="M 395,0 L 415,630" stroke="${CL.blueLine}" stroke-width="4" stroke-dasharray="10 5"/>
      <path d="M 120,290 L 980,280" stroke="${CL.greenLine}" stroke-width="4" stroke-dasharray="10 5"/>

      <!-- Kolkata Regional Labels -->
      <text x="180" y="240" fill="#64748b" font-size="13" font-weight="700">Howrah</text>
      <text x="440" y="90" fill="#64748b" font-size="13" font-weight="700">North Kolkata</text>
      <text x="440" y="320" fill="#64748b" font-size="13" font-weight="700">Central Kolkata</text>
      <text x="440" y="520" fill="#64748b" font-size="13" font-weight="700">South Kolkata</text>
      <text x="820" y="220" fill="#64748b" font-size="13" font-weight="700">Salt Lake Sector V</text>

      <!-- Pandal Pin Clusters (Red circular pins with gold count) -->
      <g id="Pandal_Pin_1" transform="translate(420, 110)">
        <circle cx="0" cy="0" r="18" fill="${CL.red}" stroke="${CL.white}" stroke-width="2.5"/>
        <text x="0" y="5" fill="${CL.white}" font-size="11" font-weight="800" text-anchor="middle">128</text>
      </g>
      <g id="Pandal_Pin_2" transform="translate(440, 270)">
        <circle cx="0" cy="0" r="18" fill="${CL.red}" stroke="${CL.white}" stroke-width="2.5"/>
        <text x="0" y="5" fill="${CL.white}" font-size="11" font-weight="800" text-anchor="middle">84</text>
      </g>
      <g id="Pandal_Pin_3" transform="translate(450, 480)">
        <circle cx="0" cy="0" r="22" fill="${CL.red}" stroke="${CL.white}" stroke-width="3"/>
        <text x="0" y="5" fill="${CL.white}" font-size="12" font-weight="800" text-anchor="middle">246</text>
      </g>
      <g id="Pandal_Pin_4" transform="translate(800, 240)">
        <circle cx="0" cy="0" r="16" fill="${CL.red}" stroke="${CL.white}" stroke-width="2.5"/>
        <text x="0" y="5" fill="${CL.white}" font-size="10" font-weight="800" text-anchor="middle">42</text>
      </g>
      <g id="Pandal_Pin_5" transform="translate(320, 160)">
        <circle cx="0" cy="0" r="14" fill="${CL.red}" stroke="${CL.white}" stroke-width="2"/>
        <text x="0" y="4" fill="${CL.white}" font-size="9" font-weight="800" text-anchor="middle">19</text>
      </g>

      <!-- Map Controls (Zoom buttons) -->
      <g transform="translate(24, 24)">
        <rect width="36" height="72" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="18" y="27" fill="${CL.textMain}" font-size="18" font-weight="700" text-anchor="middle">+</text>
        <line x1="6" y1="36" x2="30" y2="36" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="18" y="58" fill="${CL.textMain}" font-size="18" font-weight="700" text-anchor="middle">−</text>
      </g>

      <!-- Sticky bottom bar -->
      <g transform="translate(100, 552)">
        <rect width="952" height="54" rx="16" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1" filter="url(#softShadow)"/>
        <rect x="14" y="11" width="32" height="32" rx="10" fill="#feeceb"/>
        <text x="30" y="32" fill="${CL.red}" font-size="14" text-anchor="middle">🧭</text>
        <text x="56" y="28" fill="${CL.textMain}" font-size="13" font-weight="700">0 Pandals Selected</text>
        <text x="56" y="43" fill="${CL.textFaint}" font-size="11">Click "Add Route" on any pandal marker to build your trail</text>
        <g transform="translate(800, 11)">
          <rect width="138" height="32" rx="8" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
          <text x="69" y="21" fill="${CL.textMain}" font-size="12" font-weight="700" text-anchor="middle">Open Planner ↗</text>
        </g>
      </g>
    </g>
  </g>

  ${renderFooterLight(842)}
</svg>
`;
}

const expSvg = generateExploreLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '02_web_desktop_explore_light.svg'), expSvg, 'utf8');
console.log(`✓ Generated 02_web_desktop_explore_light.svg (${(expSvg.length / 1024).toFixed(1)} KB)`);

const mapSvg = generateMapLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '03_web_desktop_map_light.svg'), mapSvg, 'utf8');
console.log(`✓ Generated 03_web_desktop_map_light.svg (${(mapSvg.length / 1024).toFixed(1)} KB)`);
