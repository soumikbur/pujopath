const fs = require('fs');
const path = require('path');
const {
  ASSETS,
  TOKENS,
  SVG_STYLE,
  renderMobileBackground,
  renderMobileHeader,
  renderMobileBottomNav,
  renderMobileFooter
} = require('./faithful-mobile-shared');

const OUT_DIR = path.resolve(__dirname, '../exports/web-mobile-faithful');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// 01. MOBILE HOME SCREEN (390 x 1920 px)
function generateMobileHome(isDark = false) {
  const W = 390;
  const H = 1920;
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderMobileBackground(H, isDark)}
  ${renderMobileHeader(isDark)}

  <g transform="translate(16, 72)">
    <!-- Hero Card (w: 358, h: 290) -->
    <rect width="358" height="290" rx="24" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    
    <g transform="translate(20, 20)">
      <!-- Puja is live pill -->
      <rect width="108" height="26" rx="10" fill="${t.redPillBg}"/>
      <text x="14" y="17" fill="${t.red}" font-size="11">📅</text>
      <text x="32" y="17" fill="${t.red}" font-size="11" font-weight="700">Puja is live</text>

      <!-- Headline -->
      <text x="0" y="58" fill="${t.textMain}" font-size="24" font-weight="900" letter-spacing="-0.5">Your Puja, made simple.</text>
      <text x="0" y="86" fill="${t.textMuted}" font-size="13">Find the pandals you love, build a route, and</text>
      <text x="0" y="104" fill="${t.textMuted}" font-size="13">head out with confidence.</text>

      <!-- Primary CTA: Find pandals -->
      <g transform="translate(0, 130)">
        <rect width="318" height="48" rx="14" fill="${t.red}"/>
        <text x="100" y="30" fill="#FFFFFF" font-size="14">🔍</text>
        <text x="122" y="30" fill="#FFFFFF" font-size="14" font-weight="700">Find pandals →</text>
      </g>

      <!-- Secondary CTA: Build a route -->
      <g transform="translate(0, 190)">
        <rect width="318" height="48" rx="14" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="108" y="30" fill="${t.red}" font-size="14">⌲</text>
        <text x="128" y="30" fill="${t.textMain}" font-size="14" font-weight="700">Build a route</text>
      </g>
    </g>

    <!-- Quick Access Title -->
    <g transform="translate(0, 314)">
      <text x="0" y="20" fill="${t.textMain}" font-size="17" font-weight="800">Quick Access</text>

      <!-- 2-Column Grid (6 Cards, 171 x 120 each) -->
      <!-- Row 1 -->
      <!-- Card 1: Map -->
      <g transform="translate(0, 36)">
        <rect width="171" height="120" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(14, 14)">
          <rect width="36" height="36" rx="10" fill="${isDark ? '#341b18' : '#feeceb'}"/>
          <text x="18" y="24" fill="${t.red}" font-size="16" text-anchor="middle">📍</text>
          <text x="0" y="58" fill="${t.textMain}" font-size="14" font-weight="800">Map</text>
          <text x="0" y="76" fill="${t.textSubtle}" font-size="11">See all pandals at a</text>
          <text x="0" y="90" fill="${t.textSubtle}" font-size="11">glance</text>
        </g>
      </g>

      <!-- Card 2: Route Planner -->
      <g transform="translate(187, 36)">
        <rect width="171" height="120" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(14, 14)">
          <rect width="36" height="36" rx="10" fill="${isDark ? '#132e27' : '#ecfdf5'}"/>
          <text x="18" y="24" fill="${isDark ? '#34d399' : '#059669'}" font-size="16" text-anchor="middle">🔀</text>
          <text x="0" y="58" fill="${t.textMain}" font-size="14" font-weight="800">Route Planner</text>
          <text x="0" y="76" fill="${t.textSubtle}" font-size="11">Optimize your hopping</text>
          <text x="0" y="90" fill="${t.textSubtle}" font-size="11">trail</text>
        </g>
      </g>

      <!-- Row 2 -->
      <!-- Card 3: Metro Guide -->
      <g transform="translate(0, 168)">
        <rect width="171" height="120" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(14, 14)">
          <rect width="36" height="36" rx="10" fill="${isDark ? '#1e293b' : '#eff6ff'}"/>
          <text x="18" y="24" fill="${t.blueLine}" font-size="16" text-anchor="middle">🚇</text>
          <text x="0" y="58" fill="${t.textMain}" font-size="14" font-weight="800">Metro Guide</text>
          <text x="0" y="76" fill="${t.textSubtle}" font-size="11">Find nearest metro</text>
          <text x="0" y="90" fill="${t.textSubtle}" font-size="11">stations</text>
        </g>
      </g>

      <!-- Card 4: Calendar -->
      <g transform="translate(187, 168)">
        <rect width="171" height="120" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(14, 14)">
          <rect width="36" height="36" rx="10" fill="${isDark ? '#3b2514' : '#fff7ed'}"/>
          <text x="18" y="24" fill="${t.amberStar}" font-size="16" text-anchor="middle">📅</text>
          <text x="0" y="58" fill="${t.textMain}" font-size="14" font-weight="800">Calendar</text>
          <text x="0" y="76" fill="${t.textSubtle}" font-size="11">Auspicious tithis and</text>
          <text x="0" y="90" fill="${t.textSubtle}" font-size="11">hours</text>
        </g>
      </g>

      <!-- Row 3 -->
      <!-- Card 5: Puja Music -->
      <g transform="translate(0, 300)">
        <rect width="171" height="120" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(14, 14)">
          <rect width="36" height="36" rx="10" fill="${isDark ? '#2e1065' : '#faf5ff'}"/>
          <text x="18" y="24" fill="#a855f7" font-size="16" text-anchor="middle">🎵</text>
          <text x="0" y="58" fill="${t.textMain}" font-size="14" font-weight="800">Puja Music</text>
          <text x="0" y="76" fill="${t.textSubtle}" font-size="11">Chandi Path &amp; Dhak</text>
          <text x="0" y="90" fill="${t.textSubtle}" font-size="11">beats</text>
        </g>
      </g>

      <!-- Card 6: Mahalaya -->
      <g transform="translate(187, 300)">
        <rect width="171" height="120" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(14, 14)">
          <rect width="36" height="36" rx="10" fill="${isDark ? '#3f2c00' : '#fefce8'}"/>
          <text x="18" y="24" fill="#eab308" font-size="16" text-anchor="middle">✨</text>
          <text x="0" y="58" fill="${t.textMain}" font-size="14" font-weight="800">Mahalaya</text>
          <text x="0" y="76" fill="${t.textSubtle}" font-size="11">Timeless dawn</text>
          <text x="0" y="90" fill="${t.textSubtle}" font-size="11">broadcast</text>
        </g>
      </g>
    </g>

    <!-- Puja Highlights (y: 756) -->
    <g transform="translate(0, 756)">
      <text x="0" y="20" fill="${t.red}" font-size="14">✨</text>
      <text x="18" y="20" fill="${t.textMain}" font-size="16" font-weight="800">Puja Highlights</text>
      <text x="358" y="20" fill="${t.red}" font-size="12" font-weight="700" text-anchor="end">View all →</text>
      <text x="0" y="40" fill="${t.textSubtle}" font-size="12">A glimpse of Bengal's Durga Puja culture</text>

      <!-- Highlight Card 1: Traditions & Pandal Art (w: 358, h: 104) -->
      <g transform="translate(0, 56)">
        <rect width="358" height="104" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(14, 14)">
          <clipPath id="h1_clip_${isDark ? 'd' : 'l'}"><rect width="90" height="76" rx="12"/></clipPath>
          <image href="${ASSETS.bagbazar}" width="90" height="76" preserveAspectRatio="xMidYMid slice" clip-path="url(#h1_clip_${isDark ? 'd' : 'l'})"/>
          <g transform="translate(104, 8)">
            <text x="0" y="16" fill="${t.textMain}" font-size="14" font-weight="800">Traditions &amp; Pandal Art</text>
            <text x="0" y="36" fill="${t.textSubtle}" font-size="11">Discover Bengal's timeless heritage</text>
            <text x="0" y="52" fill="${t.textSubtle}" font-size="11">celebrations and creative craftsmanship.</text>
          </g>
        </g>
      </g>

      <!-- Highlight Card 2: Sacred Almanac & Timings (w: 358, h: 104) -->
      <g transform="translate(0, 172)">
        <rect width="358" height="104" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(14, 14)">
          <clipPath id="h2_clip_${isDark ? 'd' : 'l'}"><rect width="90" height="76" rx="12"/></clipPath>
          <image href="${ASSETS.sovabazar}" width="90" height="76" preserveAspectRatio="xMidYMid slice" clip-path="url(#h2_clip_${isDark ? 'd' : 'l'})"/>
          <g transform="translate(104, 8)">
            <text x="0" y="16" fill="${t.textMain}" font-size="14" font-weight="800">Sacred Almanac &amp; Timings</text>
            <text x="0" y="36" fill="${t.textSubtle}" font-size="11">Accurate Ashtami Sandhi Puja,</text>
            <text x="0" y="52" fill="${t.textSubtle}" font-size="11">Pushpanjali, and tithi timings.</text>
          </g>
        </g>
      </g>

      <!-- Highlight Card 3: Pujo Evenings & Routes (w: 358, h: 104) -->
      <g transform="translate(0, 288)">
        <rect width="358" height="104" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(14, 14)">
          <clipPath id="h3_clip_${isDark ? 'd' : 'l'}"><rect width="90" height="76" rx="12"/></clipPath>
          <image href="${ASSETS.sreebhumi}" width="90" height="76" preserveAspectRatio="xMidYMid slice" clip-path="url(#h3_clip_${isDark ? 'd' : 'l'})"/>
          <g transform="translate(104, 8)">
            <text x="0" y="16" fill="${t.textMain}" font-size="14" font-weight="800">Pujo Evenings &amp; Routes</text>
            <text x="0" y="36" fill="${t.textSubtle}" font-size="11">Plan your route for the best evening</text>
            <text x="0" y="52" fill="${t.textSubtle}" font-size="11">hopping and illumination.</text>
          </g>
        </g>
      </g>
    </g>

    <!-- 6 Feature Badges (y: 1166) -->
    <g transform="translate(0, 1166)">
      <!-- Row 1 -->
      <g transform="translate(0, 0)">
        <rect width="171" height="42" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="12" y="26" fill="${t.textSubtle}" font-size="12">🪄 Ultra Simple</text>
      </g>
      <g transform="translate(187, 0)">
        <rect width="171" height="42" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="12" y="26" fill="${t.textSubtle}" font-size="12">⚡ Lightning Fast</text>
      </g>

      <!-- Row 2 -->
      <g transform="translate(0, 52)">
        <rect width="171" height="42" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="12" y="26" fill="${t.textSubtle}" font-size="12">📱 Fully Responsive</text>
      </g>
      <g transform="translate(187, 52)">
        <rect width="171" height="42" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="12" y="26" fill="${t.textSubtle}" font-size="12">${isDark ? '☼ Light Mode' : '🌙 Dark Mode'}</text>
      </g>

      <!-- Row 3 -->
      <g transform="translate(0, 104)">
        <rect width="171" height="42" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="12" y="26" fill="${t.textSubtle}" font-size="12">🌐 Bengali &amp; English</text>
      </g>
      <g transform="translate(187, 104)">
        <rect width="171" height="42" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="12" y="26" fill="${t.textSubtle}" font-size="12">♡ Saved Trails</text>
      </g>
    </g>
  </g>

  ${renderMobileFooter(1720, isDark)}
  ${renderMobileBottomNav('Home', isDark, H - 64)}
</svg>
`;
}

// 02. MOBILE EXPLORE SCREEN (390 x 2050 px)
function generateMobileExplore(isDark = false) {
  const W = 390;
  const H = 2050;
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderMobileBackground(H, isDark)}
  ${renderMobileHeader(isDark)}

  <g transform="translate(16, 72)">
    <!-- Label & Title -->
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="700" letter-spacing="1">🔍 PANDAL DIRECTORY</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="24" font-weight="900">Explore Kolkata Pandals</text>
    <text x="0" y="68" fill="${t.textMuted}" font-size="12">Filter by heritage traditions, thematic craftsmanship,</text>
    <text x="0" y="84" fill="${t.textMuted}" font-size="12">nearby metro stations, and crowd levels.</text>

    <!-- Filter Card (w: 358, h: 290) -->
    <g transform="translate(0, 102)">
      <rect width="358" height="290" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      
      <g transform="translate(16, 16)">
        <!-- Search Input -->
        <rect width="326" height="42" rx="12" fill="${t.inputBg}" stroke="${t.inputBorder}" stroke-width="1"/>
        <text x="14" y="26" fill="${t.textFaint}" font-size="14">🔍</text>
        <text x="36" y="26" fill="${t.textFaint}" font-size="13">Search pandals by name, Bonedi Ba...</text>

        <!-- Filter by Zone Header -->
        <text x="0" y="78" fill="${t.textSubtle}" font-size="11" font-weight="800" letter-spacing="0.5">FILTER BY ZONE</text>
        
        <!-- Zone Pills -->
        <g transform="translate(0, 90)">
          <rect width="84" height="32" rx="10" fill="${t.red}"/>
          <text x="42" y="20" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">All Zones</text>

          <rect x="92" y="0" width="108" height="32" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="146" y="20" fill="${t.textMain}" font-size="12" font-weight="600" text-anchor="middle">North Kolkata</text>

          <rect x="208" y="0" width="108" height="32" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="262" y="20" fill="${t.textMain}" font-size="12" font-weight="600" text-anchor="middle">South Kolkata</text>
        </g>

        <!-- Feature Filters -->
        <text x="0" y="148" fill="${t.textSubtle}" font-size="11" font-weight="800" letter-spacing="0.5">FEATURE FILTERS</text>

        <!-- Toggle Row 1 -->
        <g transform="translate(0, 160)">
          <!-- Switch 1 -->
          <rect width="40" height="22" rx="11" fill="${isDark ? '#382e25' : '#e5e0d8'}"/>
          <circle cx="11" cy="11" r="8" fill="#ffffff"/>
          <text x="50" y="16" fill="${t.textMain}" font-size="12" font-weight="600">Bonedi Bari</text>

          <!-- Switch 2 -->
          <g transform="translate(164, 0)">
            <rect width="40" height="22" rx="11" fill="${isDark ? '#382e25' : '#e5e0d8'}"/>
            <circle cx="11" cy="11" r="8" fill="#ffffff"/>
            <text x="50" y="16" fill="${t.textMain}" font-size="12" font-weight="600">Near Metro</text>
          </g>
        </g>

        <!-- Toggle Row 2 -->
        <g transform="translate(0, 194)">
          <!-- Switch 3 -->
          <rect width="40" height="22" rx="11" fill="${isDark ? '#382e25' : '#e5e0d8'}"/>
          <circle cx="11" cy="11" r="8" fill="#ffffff"/>
          <text x="50" y="16" fill="${t.textMain}" font-size="12" font-weight="600">Heritage Sabeki</text>

          <!-- Switch 4 -->
          <g transform="translate(164, 0)">
            <rect width="40" height="22" rx="11" fill="${isDark ? '#382e25' : '#e5e0d8'}"/>
            <circle cx="11" cy="11" r="8" fill="#ffffff"/>
            <text x="50" y="16" fill="${t.textMain}" font-size="12" font-weight="600">Wheelchair</text>
          </g>
        </g>

        <!-- Results Counter & Sort (y: 236) -->
        <g transform="translate(0, 236)">
          <text x="0" y="20" fill="${t.textSubtle}" font-size="13">Showing <tspan fill="${t.red}" font-weight="800">774</tspan> pandals</text>

          <rect x="204" y="2" width="122" height="28" rx="8" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="216" y="21" fill="${t.textMain}" font-size="11" font-weight="600">Recommended ⌵</text>
        </g>
      </g>
    </g>

    <!-- Pandal List (3 Cards) -->
    <!-- Card 1: Dum Dum Tarun Dal / Sreebhumi -->
    <g transform="translate(0, 408)">
      <rect width="358" height="340" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      
      <!-- Top Image (w: 358, h: 170) -->
      <clipPath id="p1_clip_${isDark ? 'd' : 'l'}"><rect width="358" height="170" rx="20"/></clipPath>
      <image href="${ASSETS.sreebhumi}" width="358" height="170" preserveAspectRatio="xMidYMid slice" clip-path="url(#p1_clip_${isDark ? 'd' : 'l'})"/>
      
      <!-- Badges over image -->
      <rect x="14" y="14" width="86" height="26" rx="10" fill="#ffffff" fill-opacity="0.9"/>
      <text x="57" y="31" fill="#1a1715" font-size="11" font-weight="700" text-anchor="middle">Dum Dum</text>

      <rect x="312" y="14" width="32" height="32" rx="10" fill="#ffffff" fill-opacity="0.9"/>
      <text x="328" y="35" fill="#e11d48" font-size="15" text-anchor="middle">♡</text>

      <!-- Details -->
      <g transform="translate(18, 186)">
        <text x="0" y="20" fill="${t.textMain}" font-size="18" font-weight="800">Sreebhumi Sporting Club</text>
        <text x="0" y="40" fill="${t.textSubtle}" font-size="12">📍 Lake Town, VIP Road • Near Ultadanga</text>

        <!-- Tags Row -->
        <g transform="translate(0, 54)">
          <rect width="78" height="22" rx="6" fill="${t.redPillBg}"/>
          <text x="39" y="15" fill="${t.red}" font-size="10" font-weight="700" text-anchor="middle">Grand Palace</text>

          <rect x="84" y="0" width="76" height="22" rx="6" fill="${isDark ? '#382510' : '#fef3c7'}"/>
          <text x="122" y="15" fill="${t.amberStar}" font-size="10" font-weight="700" text-anchor="middle">★ 4.9 (4.8k)</text>

          <rect x="166" y="0" width="84" height="22" rx="6" fill="${isDark ? '#2b1515' : '#fee2e2'}"/>
          <text x="208" y="15" fill="#dc2626" font-size="10" font-weight="700" text-anchor="middle">High Crowd</text>
        </g>

        <!-- Buttons -->
        <g transform="translate(0, 90)">
          <rect width="154" height="38" rx="10" fill="${t.red}"/>
          <text x="77" y="24" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">View Details →</text>

          <rect x="164" y="0" width="154" height="38" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="241" y="24" fill="${t.textMain}" font-size="12" font-weight="600" text-anchor="middle">+ Add to Route</text>
        </g>
      </g>
    </g>

    <!-- Card 2: Sovabazar Rajbari -->
    <g transform="translate(0, 764)">
      <rect width="358" height="340" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <clipPath id="p2_clip_${isDark ? 'd' : 'l'}"><rect width="358" height="170" rx="20"/></clipPath>
      <image href="${ASSETS.sovabazar}" width="358" height="170" preserveAspectRatio="xMidYMid slice" clip-path="url(#p2_clip_${isDark ? 'd' : 'l'})"/>
      
      <rect x="14" y="14" width="94" height="26" rx="10" fill="#ffffff" fill-opacity="0.9"/>
      <text x="61" y="31" fill="#1a1715" font-size="11" font-weight="700" text-anchor="middle">North Kolkata</text>

      <rect x="312" y="14" width="32" height="32" rx="10" fill="#ffffff" fill-opacity="0.9"/>
      <text x="328" y="35" fill="#e11d48" font-size="15" text-anchor="middle">♡</text>

      <g transform="translate(18, 186)">
        <text x="0" y="20" fill="${t.textMain}" font-size="18" font-weight="800">Sovabazar Rajbari (Bara Taraf)</text>
        <text x="0" y="40" fill="${t.textSubtle}" font-size="12">📍 Sovabazar • 3 min walk from Metro</text>

        <g transform="translate(0, 54)">
          <rect width="78" height="22" rx="6" fill="${t.redPillBg}"/>
          <text x="39" y="15" fill="${t.red}" font-size="10" font-weight="700" text-anchor="middle">Bonedi Bari</text>

          <rect x="84" y="0" width="76" height="22" rx="6" fill="${isDark ? '#382510' : '#fef3c7'}"/>
          <text x="122" y="15" fill="${t.amberStar}" font-size="10" font-weight="700" text-anchor="middle">★ 4.9 (3.2k)</text>

          <rect x="166" y="0" width="84" height="22" rx="6" fill="${isDark ? '#142c1c' : '#dcfce7'}"/>
          <text x="208" y="15" fill="#16a34a" font-size="10" font-weight="700" text-anchor="middle">Moderate</text>
        </g>

        <g transform="translate(0, 90)">
          <rect width="154" height="38" rx="10" fill="${t.red}"/>
          <text x="77" y="24" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">View Details →</text>

          <rect x="164" y="0" width="154" height="38" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="241" y="24" fill="${t.textMain}" font-size="12" font-weight="600" text-anchor="middle">+ Add to Route</text>
        </g>
      </g>
    </g>

    <!-- Card 3: Bagbazar Sarbojanin -->
    <g transform="translate(0, 1120)">
      <rect width="358" height="340" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <clipPath id="p3_clip_${isDark ? 'd' : 'l'}"><rect width="358" height="170" rx="20"/></clipPath>
      <image href="${ASSETS.bagbazar}" width="358" height="170" preserveAspectRatio="xMidYMid slice" clip-path="url(#p3_clip_${isDark ? 'd' : 'l'})"/>
      
      <rect x="14" y="14" width="94" height="26" rx="10" fill="#ffffff" fill-opacity="0.9"/>
      <text x="61" y="31" fill="#1a1715" font-size="11" font-weight="700" text-anchor="middle">North Kolkata</text>

      <rect x="312" y="14" width="32" height="32" rx="10" fill="#ffffff" fill-opacity="0.9"/>
      <text x="328" y="35" fill="#e11d48" font-size="15" text-anchor="middle">♡</text>

      <g transform="translate(18, 186)">
        <text x="0" y="20" fill="${t.textMain}" font-size="18" font-weight="800">Bagbazar Sarbojanin Durgotsav</text>
        <text x="0" y="40" fill="${t.textSubtle}" font-size="12">📍 Bagbazar Ghat • Near Shyambazar Metro</text>

        <g transform="translate(0, 54)">
          <rect width="84" height="22" rx="6" fill="${t.redPillBg}"/>
          <text x="42" y="15" fill="${t.red}" font-size="10" font-weight="700" text-anchor="middle">Traditional Sabeki</text>

          <rect x="90" y="0" width="76" height="22" rx="6" fill="${isDark ? '#382510' : '#fef3c7'}"/>
          <text x="128" y="15" fill="${t.amberStar}" font-size="10" font-weight="700" text-anchor="middle">★ 4.8 (5.1k)</text>

          <rect x="172" y="0" width="84" height="22" rx="6" fill="${isDark ? '#2b1515' : '#fee2e2'}"/>
          <text x="214" y="15" fill="#dc2626" font-size="10" font-weight="700" text-anchor="middle">High Crowd</text>
        </g>

        <g transform="translate(0, 90)">
          <rect width="154" height="38" rx="10" fill="${t.red}"/>
          <text x="77" y="24" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">View Details →</text>

          <rect x="164" y="0" width="154" height="38" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="241" y="24" fill="${t.textMain}" font-size="12" font-weight="600" text-anchor="middle">+ Add to Route</text>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileFooter(1850, isDark)}
  ${renderMobileBottomNav('Explore', isDark, H - 64)}
</svg>
`;
}

// 03. MOBILE MAP SCREEN (390 x 920 px)
function generateMobileMap(isDark = false) {
  const W = 390;
  const H = 920;
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderMobileBackground(H, isDark)}
  ${renderMobileHeader(isDark)}

  <g transform="translate(16, 68)">
    <!-- Search Bar on Map -->
    <rect width="358" height="42" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
    <text x="14" y="26" fill="${t.textFaint}" font-size="14">🔍</text>
    <text x="36" y="26" fill="${t.textFaint}" font-size="13">Search pandals or metro stations...</text>
    <rect x="316" y="6" width="30" height="30" rx="8" fill="${t.cardInner}"/>
    <text x="331" y="26" fill="${t.textSubtle}" font-size="12" text-anchor="middle">⚡</text>

    <!-- Map Canvas Container (w: 358, h: 560) -->
    <g transform="translate(0, 52)">
      <rect width="358" height="560" rx="20" fill="${isDark ? '#141210' : '#f4efe8'}" stroke="${t.cardBorder}" stroke-width="1"/>
      
      <!-- Hooghly River -->
      <path d="M70 0 Q60 180 80 320 T95 560" stroke="${isDark ? '#1e3a5f' : '#b9d5f7'}" stroke-width="40" stroke-linecap="round" fill="none"/>
      <text x="72" y="260" fill="${isDark ? '#3b82f6' : '#2563eb'}" font-size="10" font-weight="700" transform="rotate(75, 72, 260)" letter-spacing="2">HOOGHLY RIVER</text>

      <!-- Metro Blue Line -->
      <path d="M120 0 L120 560" stroke="${t.blueLine}" stroke-width="3" stroke-dasharray="6 3" opacity="0.8"/>
      <!-- Metro Green Line (Under river tunnel) -->
      <path d="M0 240 L358 240" stroke="${t.greenLine}" stroke-width="3" stroke-dasharray="6 3" opacity="0.8"/>

      <!-- Pandal Pins -->
      <!-- Pin 1: Sreebhumi -->
      <g transform="translate(260, 90)">
        <circle cx="14" cy="14" r="14" fill="${t.red}"/>
        <text x="14" y="19" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">1</text>
      </g>

      <!-- Pin 2: Sovabazar (Active Selected) -->
      <g transform="translate(140, 160)">
        <circle cx="16" cy="16" r="22" fill="${t.red}" fill-opacity="0.25"/>
        <circle cx="16" cy="16" r="16" fill="${t.red}"/>
        <text x="16" y="22" fill="#ffffff" font-size="13" font-weight="800" text-anchor="middle">2</text>
      </g>

      <!-- Pin 3: College Square -->
      <g transform="translate(160, 290)">
        <circle cx="14" cy="14" r="14" fill="${t.red}"/>
        <text x="14" y="19" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">3</text>
      </g>

      <!-- Pin 4: Maddox Square -->
      <g transform="translate(190, 420)">
        <circle cx="14" cy="14" r="14" fill="${t.red}"/>
        <text x="14" y="19" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">4</text>
      </g>

      <!-- Floating Map Controls -->
      <g transform="translate(306, 16)">
        <rect width="36" height="74" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="18" y="24" fill="${t.textMain}" font-size="16" font-weight="800" text-anchor="middle">+</text>
        <line x1="6" y1="37" x2="30" y2="37" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="18" y="58" fill="${t.textMain}" font-size="16" font-weight="800" text-anchor="middle">−</text>

        <rect y="84" width="36" height="36" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="18" y="107" fill="${t.red}" font-size="14" text-anchor="middle">📍</text>
      </g>
    </g>

    <!-- Selected Pandal Bottom Floating Card (w: 358, h: 108) -->
    <g transform="translate(0, 624)">
      <rect width="358" height="108" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1" filter="drop-shadow(0 4px 12px ${t.shadow})"/>
      <g transform="translate(14, 14)">
        <clipPath id="map_pandal_clip_${isDark ? 'd' : 'l'}"><rect width="78" height="78" rx="12"/></clipPath>
        <image href="${ASSETS.sovabazar}" width="78" height="78" preserveAspectRatio="xMidYMid slice" clip-path="url(#map_pandal_clip_${isDark ? 'd' : 'l'})"/>
        
        <g transform="translate(92, 4)">
          <text x="0" y="16" fill="${t.textMain}" font-size="15" font-weight="800">Sovabazar Rajbari</text>
          <text x="0" y="34" fill="${t.textSubtle}" font-size="11">📍 Sovabazar Metro (300m away)</text>
          <text x="0" y="52" fill="${t.amberStar}" font-size="11" font-weight="700">★ 4.9 • Bonedi Bari • Moderate crowd</text>
          
          <g transform="translate(0, 58)">
            <rect width="90" height="24" rx="6" fill="${t.red}"/>
            <text x="45" y="16" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">Navigate ⌲</text>

            <rect x="98" y="0" width="134" height="24" rx="6" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
            <text x="165" y="16" fill="${t.textMain}" font-size="10" font-weight="600" text-anchor="middle">+ Add to Trail</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileBottomNav('Map', isDark, H - 64)}
</svg>
`;
}

// Write part 1 screens (Light & Dark)
fs.writeFileSync(path.join(OUT_DIR, '01_web_mobile_home_light.svg'), generateMobileHome(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '01_web_mobile_home_dark.svg'), generateMobileHome(true), 'utf8');
console.log('✓ Generated 01_web_mobile_home (Light & Dark)');

fs.writeFileSync(path.join(OUT_DIR, '02_web_mobile_explore_light.svg'), generateMobileExplore(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '02_web_mobile_explore_dark.svg'), generateMobileExplore(true), 'utf8');
console.log('✓ Generated 02_web_mobile_explore (Light & Dark)');

fs.writeFileSync(path.join(OUT_DIR, '03_web_mobile_map_light.svg'), generateMobileMap(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '03_web_mobile_map_dark.svg'), generateMobileMap(true), 'utf8');
console.log('✓ Generated 03_web_mobile_map (Light & Dark)');
