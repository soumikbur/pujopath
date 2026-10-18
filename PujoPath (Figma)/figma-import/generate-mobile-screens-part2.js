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

// 04. MOBILE PLANNER SCREEN (390 x 1650 px)
function generateMobilePlanner(isDark = false) {
  const W = 390;
  const H = 1650;
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderMobileBackground(H, isDark)}
  ${renderMobileHeader(isDark)}

  <g transform="translate(16, 72)">
    <!-- Label & Heading -->
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="700" letter-spacing="1">🔀 ROUTE PLANNER</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="24" font-weight="900">Pandal Hopping Route</text>
    <text x="0" y="70" fill="${t.textMain}" font-size="24" font-weight="900">Planner</text>
    <text x="0" y="96" fill="${t.textMuted}" font-size="12">Plan your customized pandal hopping route across Kolkata with</text>
    <text x="0" y="112" fill="${t.textMuted}" font-size="12">smart nearest-neighbor optimization.</text>

    <!-- Stats Summary Card (w: 358, h: 140) -->
    <g transform="translate(0, 130)">
      <rect width="358" height="140" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <text x="0" y="14" fill="${t.textSubtle}" font-size="11" font-weight="700">TOTAL STOPS</text>
        <text x="0" y="44" fill="${t.textMain}" font-size="22" font-weight="900">3 Pandals</text>

        <text x="170" y="14" fill="${t.textSubtle}" font-size="11" font-weight="700">WALKING DISTANCE</text>
        <text x="170" y="44" fill="${t.red}" font-size="22" font-weight="900">1.8 km</text>

        <text x="0" y="80" fill="${t.textSubtle}" font-size="11" font-weight="700">EST. DURATION</text>
        <text x="0" y="104" fill="${t.textMain}" font-size="18" font-weight="800">~45 mins</text>

        <!-- Optimize Button -->
        <g transform="translate(160, 68)">
          <rect width="158" height="38" rx="10" fill="${t.red}"/>
          <text x="79" y="24" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">✨ Optimize Trail</text>
        </g>
      </g>
    </g>

    <!-- Stops Timeline (3 Stops Cards) -->
    <g transform="translate(0, 290)">
      <text x="0" y="20" fill="${t.textMain}" font-size="16" font-weight="800">Your Route Stops</text>

      <!-- Stop 1: Bagbazar Sarbojanin -->
      <g transform="translate(0, 36)">
        <rect width="358" height="110" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <circle cx="12" cy="12" r="12" fill="${t.red}"/>
          <text x="12" y="16" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">1</text>
          
          <g transform="translate(36, 0)">
            <text x="0" y="14" fill="${t.textMain}" font-size="15" font-weight="800">Bagbazar Sarbojanin</text>
            <text x="0" y="32" fill="${t.textSubtle}" font-size="11">📍 Bagbazar Ghat • Starting Point</text>
            <text x="0" y="50" fill="${t.amberStar}" font-size="11">★ 4.8 Sabeki • Low morning crowd</text>
            <text x="0" y="70" fill="${t.blueLine}" font-size="11">⏱ Recommended Stay: 20 mins</text>
          </g>
        </g>
      </g>

      <!-- Connecting Leg 1 to 2 -->
      <g transform="translate(28, 150)">
        <line x1="0" y1="0" x2="0" y2="28" stroke="${t.red}" stroke-width="2" stroke-dasharray="4 2"/>
        <text x="16" y="18" fill="${t.textSubtle}" font-size="11">🚶 800m walk • ~10 mins</text>
      </g>

      <!-- Stop 2: Sovabazar Rajbari -->
      <g transform="translate(0, 182)">
        <rect width="358" height="110" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <circle cx="12" cy="12" r="12" fill="${t.red}"/>
          <text x="12" y="16" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">2</text>
          
          <g transform="translate(36, 0)">
            <text x="0" y="14" fill="${t.textMain}" font-size="15" font-weight="800">Sovabazar Rajbari</text>
            <text x="0" y="32" fill="${t.textSubtle}" font-size="11">📍 Sovabazar Street • Stop 2</text>
            <text x="0" y="50" fill="${t.amberStar}" font-size="11">★ 4.9 Bonedi Bari • Moderate crowd</text>
            <text x="0" y="70" fill="${t.blueLine}" font-size="11">⏱ Recommended Stay: 25 mins</text>
          </g>
        </g>
      </g>

      <!-- Connecting Leg 2 to 3 -->
      <g transform="translate(28, 296)">
        <line x1="0" y1="0" x2="0" y2="28" stroke="${t.red}" stroke-width="2" stroke-dasharray="4 2"/>
        <text x="16" y="18" fill="${t.textSubtle}" font-size="11">🚶 1.0 km walk • ~12 mins</text>
      </g>

      <!-- Stop 3: Kumartuli Park -->
      <g transform="translate(0, 328)">
        <rect width="358" height="110" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <circle cx="12" cy="12" r="12" fill="${t.red}"/>
          <text x="12" y="16" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">3</text>
          
          <g transform="translate(36, 0)">
            <text x="0" y="14" fill="${t.textMain}" font-size="15" font-weight="800">Kumartuli Park Sarbojanin</text>
            <text x="0" y="32" fill="${t.textSubtle}" font-size="11">📍 Kumartuli • Destination</text>
            <text x="0" y="50" fill="${t.amberStar}" font-size="11">★ 4.7 Artisan Theme • High evening crowd</text>
            <text x="0" y="70" fill="${t.blueLine}" font-size="11">⏱ Recommended Stay: 30 mins</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Action Buttons -->
    <g transform="translate(0, 780)">
      <rect width="358" height="46" rx="12" fill="${t.card}" stroke="${t.red}" stroke-width="1.5"/>
      <text x="179" y="28" fill="${t.red}" font-size="13" font-weight="700" text-anchor="middle">+ Add New Pandal to Trail</text>

      <rect y="56" width="358" height="46" rx="12" fill="${t.red}"/>
      <text x="179" y="84" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">Start Live Navigation ⌲</text>
    </g>
  </g>

  ${renderMobileFooter(1450, isDark)}
  ${renderMobileBottomNav('Planner', isDark, H - 64)}
</svg>
`;
}

// 05. MOBILE CALENDAR SCREEN (390 x 1850 px)
function generateMobileCalendar(isDark = false) {
  const W = 390;
  const H = 1850;
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderMobileBackground(H, isDark)}
  ${renderMobileHeader(isDark)}

  <g transform="translate(16, 72)">
    <!-- Label & Title -->
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="700" letter-spacing="1">📅 PUJA ALMANAC</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="24" font-weight="900">Durga Puja 2026 Sacred</text>
    <text x="0" y="70" fill="${t.textMain}" font-size="24" font-weight="900">Calendar</text>
    <text x="0" y="94" fill="${t.textMuted}" font-size="12">Exact tithi schedules, pushpanjali auspicious timings, and</text>
    <text x="0" y="110" fill="${t.textMuted}" font-size="12">sandhi puja hours.</text>

    <!-- Sandhi Puja Special Card (w: 358, h: 360) -->
    <g transform="translate(0, 126)">
      <rect width="358" height="360" rx="22" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <!-- Top Row Badges -->
        <rect x="52" y="0" width="168" height="26" rx="8" fill="${t.redPillBg}"/>
        <text x="136" y="17" fill="${t.red}" font-size="10" font-weight="800" text-anchor="middle">SACRED SANDHI WINDOW 2026</text>

        <rect x="228" y="0" width="90" height="26" rx="8" fill="${isDark ? '#3b2c00' : '#fef3c7'}"/>
        <text x="273" y="17" fill="${t.amberStar}" font-size="9" font-weight="700" text-anchor="middle">108 Lotuses</text>

        <!-- Flame icon -->
        <rect x="0" y="0" width="42" height="42" rx="12" fill="${t.red}"/>
        <text x="21" y="27" fill="#ffffff" font-size="18" text-anchor="middle">🔥</text>

        <!-- Title -->
        <text x="0" y="72" fill="${t.textMain}" font-size="20" font-weight="900">Sandhi Puja Auspicious</text>
        <text x="0" y="96" fill="${t.textMain}" font-size="20" font-weight="900">Timings</text>

        <!-- Time Highlight Box -->
        <rect y="112" width="318" height="42" rx="10" fill="${t.cardInner}" stroke="${t.redPillBorder}" stroke-width="1"/>
        <text x="159" y="138" fill="${t.red}" font-size="12" font-weight="800" text-anchor="middle">48 minutes (2 Dandas: 07:26 AM – 08:14 AM)</text>

        <line x1="0" y1="170" x2="318" y2="170" stroke="${t.cardBorder}" stroke-width="1"/>

        <text x="0" y="190" fill="${t.textSubtle}" font-size="10" font-weight="800" letter-spacing="0.5">SELECT ALMANAC / PANJIKA CONVENTION:</text>

        <!-- Option 1: Selected Panjika -->
        <g transform="translate(0, 202)">
          <rect width="318" height="54" rx="10" fill="${t.cardInner}" stroke="${t.red}" stroke-width="1.5"/>
          <text x="14" y="24" fill="${t.textMain}" font-size="12" font-weight="800">Bengali Almanac 1433 Schedule (১৪৩৩)</text>
          <text x="14" y="42" fill="${t.red}" font-size="11" font-weight="700">07:26 AM IST – 08:14 AM IST</text>
          <circle cx="296" cy="27" r="9" fill="${t.red}"/>
          <text x="296" y="31" fill="#ffffff" font-size="10" text-anchor="middle">✓</text>
        </g>

        <!-- Option 2 -->
        <g transform="translate(0, 264)">
          <rect width="318" height="50" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="14" y="22" fill="${t.textMain}" font-size="12" font-weight="600">Drik Panchang (Modern Ephemeris)</text>
          <text x="14" y="38" fill="${t.textSubtle}" font-size="11">10:27 AM IST – 11:15 AM IST</text>
        </g>
      </g>
    </g>

    <!-- 5 Day Tithi Cards (y: 506) -->
    <g transform="translate(0, 506)">
      <text x="0" y="20" fill="${t.textMain}" font-size="16" font-weight="800">Daily Tithi Timeline (16–20 Oct 2026)</text>

      <!-- Day 1: Shashthi -->
      <g transform="translate(0, 36)">
        <rect width="358" height="116" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="800">MAHA SHASHTHI • 16 OCT 2026</text>
          <text x="0" y="38" fill="${t.textMain}" font-size="16" font-weight="800">Bodhon, Amontron &amp; Adhibas</text>
          <text x="0" y="58" fill="${t.textSubtle}" font-size="12">Shashthi Tithi begins at 08:42 AM</text>
          <text x="0" y="78" fill="${t.textFaint}" font-size="11">🔔 Evening Kalparambha &amp; Adhibas rites performed.</text>
        </g>
      </g>

      <!-- Day 2: Saptami -->
      <g transform="translate(0, 164)">
        <rect width="358" height="116" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="800">MAHA SAPTAMI • 17 OCT 2026</text>
          <text x="0" y="38" fill="${t.textMain}" font-size="16" font-weight="800">Nabapatrika Pravesh &amp; Snan</text>
          <text x="0" y="58" fill="${t.textSubtle}" font-size="12">Kola Bou Snan at river ghat: 06:15 AM</text>
          <text x="0" y="78" fill="${t.textFaint}" font-size="11">🙏 Morning Pushpanjali window: 08:30 AM – 10:00 AM</text>
        </g>
      </g>

      <!-- Day 3: Ashtami (Featured) -->
      <g transform="translate(0, 292)">
        <rect width="358" height="136" rx="16" fill="${t.card}" stroke="${t.red}" stroke-width="1.5"/>
        <g transform="translate(16, 16)">
          <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="800">MAHA ASHTAMI • 18 OCT 2026 ⭐ MOST SACRED</text>
          <text x="0" y="38" fill="${t.textMain}" font-size="16" font-weight="800">Sandhi Puja &amp; Kumari Puja</text>
          <text x="0" y="58" fill="${t.textSubtle}" font-size="12">Ashtami Pushpanjali: 06:45 AM – 07:45 AM</text>
          <text x="0" y="78" fill="${t.red}" font-size="12" font-weight="700">🔥 Sandhi Puja: 07:26 AM – 08:14 AM (108 Diyas)</text>
          <text x="0" y="98" fill="${t.textFaint}" font-size="11">Belur Math Kumari Puja broadcast: 09:00 AM</text>
        </g>
      </g>

      <!-- Day 4: Navami -->
      <g transform="translate(0, 440)">
        <rect width="358" height="116" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="800">MAHA NAVAMI • 19 OCT 2026</text>
          <text x="0" y="38" fill="${t.textMain}" font-size="16" font-weight="800">Navami Homa &amp; Maha Aarti</text>
          <text x="0" y="58" fill="${t.textSubtle}" font-size="12">Navami Bhog &amp; Maha Aarti: 12:30 PM</text>
          <text x="0" y="78" fill="${t.textFaint}" font-size="11">Dhunuchi Naach across community pandals in the evening.</text>
        </g>
      </g>

      <!-- Day 5: Dashami -->
      <g transform="translate(0, 568)">
        <rect width="358" height="116" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="800">VIJAYA DASHAMI • 20 OCT 2026</text>
          <text x="0" y="38" fill="${t.textMain}" font-size="16" font-weight="800">Sindoor Khela &amp; Bisorjan</text>
          <text x="0" y="58" fill="${t.textSubtle}" font-size="12">Devi Boron &amp; Sindoor Khela: 10:00 AM</text>
          <text x="0" y="78" fill="${t.textFaint}" font-size="11">Subho Bijoya greetings and immersion at Babughat.</text>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileFooter(1650, isDark)}
  ${renderMobileBottomNav('More', isDark, H - 64)}
</svg>
`;
}

// 06. MOBILE METRO SCREEN (390 x 1650 px)
function generateMobileMetro(isDark = false) {
  const W = 390;
  const H = 1650;
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderMobileBackground(H, isDark)}
  ${renderMobileHeader(isDark)}

  <g transform="translate(16, 72)">
    <!-- Label & Title -->
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="700" letter-spacing="1">🚇 TRANSIT SCHEDULES</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="24" font-weight="900">Kolkata Metro Timetable</text>
    <text x="0" y="70" fill="${t.textMain}" font-size="24" font-weight="900">&amp; Puja Guide</text>
    <text x="0" y="94" fill="${t.textMuted}" font-size="12">Official Kolkata Metro Railway operating hours, first/last</text>
    <text x="0" y="110" fill="${t.textMuted}" font-size="12">trains, and 2026 Durga Puja all-night special services.</text>

    <!-- Filter Pills -->
    <g transform="translate(0, 126)">
      <rect width="180" height="32" rx="10" fill="${t.red}"/>
      <text x="90" y="20" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">🌙 2026 Puja Night Special</text>

      <rect x="188" y="0" width="130" height="32" rx="10" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="253" y="20" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">⏱ Timetables</text>
    </g>

    <!-- Large Red Banner Card (w: 358, h: 210) -->
    <g transform="translate(0, 172)">
      <rect width="358" height="210" rx="20" fill="#991b1b" stroke="#7f1d1d" stroke-width="1.5"/>
      <g transform="translate(18, 18)">
        <rect width="156" height="22" rx="8" fill="#000000" fill-opacity="0.3"/>
        <text x="78" y="15" fill="#FFFFFF" font-size="9" font-weight="800" text-anchor="middle">ALL-NIGHT METRO SERVICE</text>

        <rect x="164" y="0" width="158" height="22" rx="8" fill="#facc15" fill-opacity="0.25"/>
        <text x="243" y="15" fill="#fde047" font-size="9" font-weight="800" text-anchor="middle">SAPTAMI • ASHTAMI • NAVAMI</text>

        <text x="0" y="56" fill="#FFFFFF" font-size="18" font-weight="900">Overnight Trains Running</text>
        <text x="0" y="78" fill="#FFFFFF" font-size="18" font-weight="900">1:00 PM to 4:00 AM Next Morning</text>
        
        <text x="0" y="106" fill="#fecaca" font-size="12">Special overnight operations on Blue Line (Dakshineswar</text>
        <text x="0" y="122" fill="#fecaca" font-size="12">– Kavi Subhash) and Green Line with 6-minute frequency.</text>

        <line x1="0" y1="142" x2="322" y2="142" stroke="#b91c1c" stroke-width="1"/>
        <text x="0" y="162" fill="#fca5a5" font-size="11">✓ Verified: 12 October 2026</text>
        <text x="322" y="162" fill="#ffffff" font-size="11" font-weight="700" text-anchor="end">Official Notice ↗</text>
      </g>
    </g>

    <!-- Metro Line Cards (y: 400) -->
    <g transform="translate(0, 400)">
      <!-- Blue Line Card -->
      <g transform="translate(0, 0)">
        <rect width="358" height="190" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(18, 18)">
          <text x="0" y="18" fill="${t.textMain}" font-size="16" font-weight="800">Blue Line — Saptami to Navami</text>
          <rect x="256" y="2" width="66" height="20" rx="6" fill="${t.redPillBg}"/>
          <text x="289" y="16" fill="${t.red}" font-size="9" font-weight="800" text-anchor="middle">🌙 All-Night</text>
          <text x="0" y="38" fill="${t.textSubtle}" font-size="11">📅 17–19 October 2026 (Dakshineswar – Kavi Subhash)</text>

          <rect y="48" width="322" height="52" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="14" y="68" fill="${t.textSubtle}" font-size="10">First Train</text>
          <text x="14" y="86" fill="${t.textMain}" font-size="12" font-weight="700">01:00 PM (Afternoon start)</text>
          <text x="174" y="68" fill="${t.textSubtle}" font-size="10">Last Train</text>
          <text x="174" y="86" fill="${t.red}" font-size="12" font-weight="700">04:00 AM (Next Morning)</text>

          <text x="0" y="122" fill="${t.red}" font-size="11" font-weight="700">⏱ Peak Headway: Every 6 minutes</text>
          <text x="0" y="140" fill="${t.textSubtle}" font-size="11">Connects Shyambazar, Sovabazar, MG Road, Kalighat.</text>
        </g>
      </g>

      <!-- Green Line Card -->
      <g transform="translate(0, 206)">
        <rect width="358" height="190" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(18, 18)">
          <text x="0" y="18" fill="${t.textMain}" font-size="16" font-weight="800">Green Line — Salt Lake &amp; Howrah</text>
          <rect x="256" y="2" width="66" height="20" rx="6" fill="${t.redPillBg}"/>
          <text x="289" y="16" fill="${t.red}" font-size="9" font-weight="800" text-anchor="middle">🌙 All-Night</text>
          <text x="0" y="38" fill="${t.textSubtle}" font-size="11">📅 17–19 October 2026 (Sector V to Sealdah &amp; Howrah)</text>

          <rect y="48" width="322" height="52" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="14" y="68" fill="${t.textSubtle}" font-size="10">First Train</text>
          <text x="14" y="86" fill="${t.textMain}" font-size="12" font-weight="700">01:30 PM</text>
          <text x="174" y="68" fill="${t.textSubtle}" font-size="10">Last Train</text>
          <text x="174" y="86" fill="${t.red}" font-size="12" font-weight="700">03:59 AM (Next Morning)</text>

          <text x="0" y="122" fill="${t.greenLine}" font-size="11" font-weight="700">⏱ Peak Headway: Every 8 minutes</text>
          <text x="0" y="140" fill="${t.textSubtle}" font-size="11">Under-river metro connectivity for Howrah and Salt Lake.</text>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileFooter(1450, isDark)}
  ${renderMobileBottomNav('More', isDark, H - 64)}
</svg>
`;
}

// Write part 2 screens (Light & Dark)
fs.writeFileSync(path.join(OUT_DIR, '04_web_mobile_planner_light.svg'), generateMobilePlanner(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '04_web_mobile_planner_dark.svg'), generateMobilePlanner(true), 'utf8');
console.log('✓ Generated 04_web_mobile_planner (Light & Dark)');

fs.writeFileSync(path.join(OUT_DIR, '05_web_mobile_calendar_light.svg'), generateMobileCalendar(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '05_web_mobile_calendar_dark.svg'), generateMobileCalendar(true), 'utf8');
console.log('✓ Generated 05_web_mobile_calendar (Light & Dark)');

fs.writeFileSync(path.join(OUT_DIR, '06_web_mobile_metro_light.svg'), generateMobileMetro(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '06_web_mobile_metro_dark.svg'), generateMobileMetro(true), 'utf8');
console.log('✓ Generated 06_web_mobile_metro (Light & Dark)');
