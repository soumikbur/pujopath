const fs = require('fs');
const path = require('path');
const {
  OUT_DIR_LIGHT,
  CL,
  SVG_STYLE_LIGHT,
  renderHeaderLight,
  renderFooterLight,
  renderBackgroundLight
} = require('./faithful-desktop-light-shared');

// 04. ROUTE PLANNER LIGHT (1440 x 1320 px)
function generatePlannerLight() {
  const W = 1440;
  const H = 1320;

  const pandals = [
    { name: 'Bagbazar Sarbojanin', loc: 'Bagbazar • North Kolkata', bonedi: false },
    { name: 'Kumartuli Park Sarbojanin', loc: 'Kumartuli • North Kolkata', bonedi: false },
    { name: 'Sovabazar Rajbari (Boro Taraf)', loc: 'Sovabazar • North Kolkata', bonedi: true },
    { name: 'College Square Sarbojanin', loc: 'College Street • Central Kolkata', bonedi: false },
    { name: 'Santosh Mitra Square (Lebutala)', loc: 'Bowbazar / Sealdah • Central Kolkata', bonedi: false },
    { name: 'Ekdalia Evergreen Club', loc: 'Gariahat • South Kolkata', bonedi: false },
    { name: 'Singhi Park Sarbojanin', loc: 'Gariahat / Dover Lane • South Kolkata', bonedi: false },
    { name: 'Maddox Square (Ballygunge)', loc: 'Ballygunge / Ritchie Road • South Kolkata', bonedi: false },
    { name: 'Suruchi Sangha (New Alipore)', loc: 'New Alipore • South Kolkata', bonedi: false },
    { name: 'Chetla Agrani Club', loc: 'Chetla / Kalighat • South Kolkata', bonedi: false },
    { name: 'Tridhara Sammilani', loc: 'Manoharpukur / Deshapriya Park • South Kolkata', bonedi: false },
    { name: 'Sreebhumi Sporting Club', loc: 'Lake Town / VIP Road • Dum Dum', bonedi: false }
  ];

  let pCards = '';
  pandals.forEach((p, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const px = col * 392;
    const py = row * 82;
    pCards += `
      <g transform="translate(${px}, ${py})">
        <rect width="368" height="72" rx="14" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="16" y="28" fill="${CL.textMain}" font-size="14" font-weight="700">${p.name}</text>
        <text x="16" y="48" fill="${CL.textSubtle}" font-size="11">${p.loc}</text>
        ${p.bonedi ? `<rect x="16" y="52" width="68" height="16" rx="4" fill="${CL.red}"/><text x="50" y="64" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">🏛 Bonedi Bari</text>` : ''}
        <rect x="296" y="20" width="56" height="32" rx="8" fill="#feeceb" stroke="#fca5a5" stroke-width="1"/>
        <text x="324" y="41" fill="${CL.red}" font-size="12" font-weight="700" text-anchor="middle">+ Add</text>
      </g>
    `;
  });

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE_LIGHT}
  ${renderBackgroundLight(H, false)}
  ${renderHeaderLight('Plan')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${CL.red}" font-size="12" font-weight="700" letter-spacing="1">ROUTE PLANNER</text>
    <text x="0" y="54" fill="${CL.textMain}" font-size="34" font-weight="800">Pandal Hopping Route Planner</text>
    <text x="0" y="82" fill="${CL.textMuted}" font-size="14">Plan your customized pandal hopping route across Kolkata with smart nearest-neighbor optimization.</text>

    <!-- Top Stats Banner -->
    <g transform="translate(0, 108)">
      <rect width="1152" height="76" rx="16" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 20)">
        <text x="0" y="16" fill="${CL.textSubtle}" font-size="10" font-weight="700" letter-spacing="0.5">TOTAL STOPS</text>
        <text x="0" y="42" fill="${CL.textMain}" font-size="22" font-weight="800">0 Pandals</text>

        <text x="260" y="16" fill="${CL.textSubtle}" font-size="10" font-weight="700" letter-spacing="0.5">WALKING DISTANCE</text>
        <text x="260" y="42" fill="${CL.red}" font-size="22" font-weight="800">0 m</text>

        <text x="520" y="16" fill="${CL.textSubtle}" font-size="10" font-weight="700" letter-spacing="0.5">EST. DURATION</text>
        <text x="520" y="42" fill="${CL.textMain}" font-size="22" font-weight="800">~0 mins</text>

        <!-- Optimize Trail Button -->
        <rect x="912" y="4" width="192" height="40" rx="12" fill="#fee2e2" stroke="#fca5a5" stroke-width="1"/>
        <text x="1008" y="29" fill="${CL.red}" font-size="13" font-weight="700" text-anchor="middle">✦ Optimize Trail</text>
      </g>
    </g>

    <!-- Empty Trail State Card (w: 1152, h: 260) -->
    <g transform="translate(0, 204)">
      <rect width="1152" height="260" rx="22" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      
      <g transform="translate(576, 50)">
        <!-- Empty paper airplane icon -->
        <circle cx="0" cy="0" r="32" fill="#feeceb"/>
        <text x="0" y="8" fill="${CL.red}" font-size="24" text-anchor="middle">🧭</text>
        
        <text x="0" y="60" fill="${CL.textMain}" font-size="20" font-weight="800" text-anchor="middle">Your Puja Trail is Empty</text>
        <text x="0" y="86" fill="${CL.textMuted}" font-size="13" text-anchor="middle">Browse pandals in the directory and click "Add Route" to build your</text>
        <text x="0" y="104" fill="${CL.textMuted}" font-size="13" text-anchor="middle">personalized walking trail, or add your own custom pandal.</text>

        <!-- 2 Action Buttons -->
        <g transform="translate(-160, 126)">
          <rect width="150" height="42" rx="12" fill="${CL.red}"/>
          <text x="20" y="26" fill="${CL.white}" font-size="14">🔍</text>
          <text x="42" y="26" fill="${CL.white}" font-size="13" font-weight="700">Explore Pandals</text>

          <rect x="166" y="0" width="154" height="42" rx="12" fill="${CL.white}" stroke="${CL.red}" stroke-width="1.5"/>
          <text x="184" y="26" fill="${CL.red}" font-size="14">＋</text>
          <text x="206" y="26" fill="${CL.red}" font-size="13" font-weight="700">Add New Pandal</text>
        </g>
      </g>
    </g>

    <!-- Add Pandals to Your Trail (y: 488) -->
    <g transform="translate(0, 488)">
      <text x="0" y="24" fill="${CL.textMain}" font-size="20" font-weight="800">Add Pandals to Your Trail</text>
      <text x="0" y="46" fill="${CL.textSubtle}" font-size="13">Filter by locality, heritage houses, or add your own custom pandal.</text>

      <g transform="translate(0, 68)">
        ${pCards}
      </g>
    </g>
  </g>

  ${renderFooterLight(1162)}
</svg>
`;
}

// 05. CALENDAR SCREEN LIGHT (1440 x 1720 px)
function generateCalendarLight() {
  const W = 1440;
  const H = 1720;

  const days = [
    { title: 'Maha Sasthi (মহা ষষ্ঠী)', date: 'Saturday, 17 October 2026', tithi: 'Sasthi Tithi starts: 09:12 AM • Ends: 10:48 AM', ritual: 'Bodhon, Amantran, Adhibas & Kalparambha' },
    { title: 'Maha Saptami (মহা সপ্তমী)', date: 'Sunday, 18 October 2026', tithi: 'Saptami Tithi starts: 10:48 AM • Ends: 11:52 AM', ritual: 'Nabapatrika Pravesh (Kola Bou Snan) & Saptami Puja' },
    { title: 'Maha Astami (মহা অষ্টমী)', date: 'Monday, 19 October 2026', tithi: 'Astami Tithi starts: 11:52 AM • Ends: 12:28 PM', ritual: 'Astami Puja, Pushpanjali, Kumari Puja & Sandhi Puja (07:26 AM)' },
    { title: 'Maha Navami (মহা নবমী)', date: 'Tuesday, 20 October 2026', tithi: 'Navami Tithi starts: 12:28 PM • Ends: 01:04 PM', ritual: 'Maha Navami Bhog, Homa (Sacrificial Fire) & Dhunuchi Naach' },
    { title: 'Bijoya Dashami (বিজয়া দশমী)', date: 'Wednesday, 21 October 2026', tithi: 'Dashami Tithi starts: 01:04 PM • Ends: 02:18 PM', ritual: 'Devi Baran, Sindoor Khela, Bisorjon & Shubho Bijoya Shubhechha' },
    { title: 'Kojagari Lakshmi Puja (লক্ষ্মী পূজা)', date: 'Saturday, 24 October 2026', tithi: 'Purnima Tithi: 03:40 PM onwards', ritual: 'Household and Pandal Devi Lakshmi Aradhana on Sharad Purnima' },
    { title: 'Kali Puja & Diwali (কালী পূজা ও দীপাবলি)', date: 'Thursday, 05 November 2026', tithi: 'Amavasya Tithi: 04:12 PM onwards', ritual: 'Maa Shyama Puja during midnight auspicious hours & Deepavali' }
  ];

  let dayCards = '';
  days.forEach((d, idx) => {
    const py = idx * 104;
    dayCards += `
      <g transform="translate(0, ${py})">
        <rect width="1152" height="92" rx="16" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <!-- Date pill -->
        <rect x="20" y="16" width="160" height="28" rx="8" fill="#feeceb"/>
        <text x="100" y="35" fill="${CL.red}" font-size="11" font-weight="700" text-anchor="middle">${d.date.split(',')[0]}</text>
        
        <!-- Day Info -->
        <text x="200" y="36" fill="${CL.textMain}" font-size="16" font-weight="800">${d.title}</text>
        <text x="200" y="60" fill="${CL.textSubtle}" font-size="12">⏰ ${d.tithi}</text>
        <text x="200" y="76" fill="${CL.textMuted}" font-size="12">🌸 ${d.ritual}</text>

        <!-- Right Calendar Icon -->
        <circle cx="1110" cy="46" r="18" fill="#fdfbf7" stroke="${CL.cardBorder}" stroke-width="1"/>
        <text x="1110" y="52" fill="${CL.textSubtle}" font-size="14" text-anchor="middle">📅</text>
      </g>
    `;
  });

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE_LIGHT}
  ${renderBackgroundLight(H, false)}
  ${renderHeaderLight('More')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${CL.red}" font-size="12" font-weight="700" letter-spacing="1">📅 PUJA ALMANAC</text>
    <text x="0" y="54" fill="${CL.textMain}" font-size="34" font-weight="800">Durga Puja 2026 Sacred Calendar</text>
    <text x="0" y="82" fill="${CL.textMuted}" font-size="14">Exact tithi schedules, pushpanjali auspicious timings, and sandhi puja hours.</text>

    <!-- SANDHI PUJA AUSPICIOUS CALCULATOR CARD (w: 1152, h: 460) -->
    <g id="Sandhi_Puja_Calculator_Light" transform="translate(0, 108)">
      <rect width="1152" height="460" rx="24" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>

      <!-- Header row inside card -->
      <g transform="translate(36, 32)">
        <circle cx="20" cy="20" r="20" fill="#feeceb"/>
        <text x="20" y="26" fill="${CL.red}" font-size="16" text-anchor="middle">🔥</text>
        <text x="52" y="28" fill="${CL.textMain}" font-size="22" font-weight="800">Sandhi Puja Auspicious Timings</text>
        
        <rect x="360" y="10" width="190" height="26" rx="8" fill="#feeceb"/>
        <text x="455" y="27" fill="${CL.red}" font-size="10" font-weight="700" text-anchor="middle">SACRED SANDHI WINDOW 2026</text>

        <rect x="560" y="10" width="140" height="26" rx="8" fill="#fef3c7"/>
        <text x="630" y="27" fill="#b45309" font-size="10" font-weight="700" text-anchor="middle">108 Lotuses &amp; Lamps</text>

        <rect x="880" y="8" width="200" height="30" rx="8" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
        <text x="980" y="28" fill="${CL.red}" font-size="11" font-weight="700" text-anchor="middle">48 mins (07:26 AM - 08:14 AM)</text>
      </g>

      <!-- 3 Panjika Conventions -->
      <g transform="translate(36, 96)">
        <text x="0" y="16" fill="${CL.textSubtle}" font-size="11" font-weight="700" letter-spacing="0.5">SELECT ALMANAC / PANJIKA CONVENTION:</text>

        <!-- Convention 1 (Active) -->
        <g transform="translate(0, 28)">
          <rect width="344" height="76" rx="14" fill="#fef2f2" stroke="${CL.red}" stroke-width="1.5"/>
          <text x="16" y="28" fill="${CL.textMain}" font-size="13" font-weight="700">Bengali Almanac 1433 (বিশুদ্ধ সিদ্ধান্ত)</text>
          <text x="16" y="48" fill="${CL.red}" font-size="12" font-weight="700">07:26 AM – 08:14 AM IST</text>
          <text x="320" y="42" fill="${CL.red}" font-size="16" text-anchor="end">✓</text>
        </g>

        <!-- Convention 2 -->
        <g transform="translate(364, 28)">
          <rect width="344" height="76" rx="14" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="16" y="28" fill="${CL.textMain}" font-size="13" font-weight="700">Drik Panchang (Modern Ephemeris)</text>
          <text x="16" y="48" fill="${CL.textSubtle}" font-size="12">10:27 AM – 11:15 AM IST</text>
        </g>

        <!-- Convention 3 -->
        <g transform="translate(728, 28)">
          <rect width="344" height="76" rx="14" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="16" y="28" fill="${CL.textMain}" font-size="13" font-weight="700">Surya Siddhanta (Traditional)</text>
          <text x="16" y="48" fill="${CL.textSubtle}" font-size="12">06:21 PM – 07:09 PM IST (Eve)</text>
        </g>
      </g>

      <!-- 3 Metric Boxes -->
      <g transform="translate(36, 226)">
        <!-- Metric 1: Window -->
        <g transform="translate(0, 0)">
          <rect width="344" height="90" rx="14" fill="#fdfbf7" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="16" y="26" fill="${CL.textSubtle}" font-size="11" font-weight="700">FESTIVAL &amp; DATE</text>
          <text x="16" y="52" fill="${CL.textMain}" font-size="17" font-weight="800">Sandhi Puja (সন্ধিপূজা)</text>
          <text x="16" y="74" fill="${CL.textSubtle}" font-size="12">Monday, 19 October 2026</text>
        </g>

        <!-- Metric 2: Balidan -->
        <g transform="translate(364, 0)">
          <rect width="344" height="90" rx="14" fill="#fdfbf7" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="16" y="26" fill="${CL.textSubtle}" font-size="11" font-weight="700">SANDHI PUJA WINDOW (IST)</text>
          <text x="16" y="52" fill="${CL.red}" font-size="17" font-weight="800">07:26 AM – 08:14 AM</text>
          <text x="16" y="74" fill="${CL.textSubtle}" font-size="12">Indian Standard Time (IST)</text>
        </g>

        <!-- Metric 3: Total Duration -->
        <g transform="translate(728, 0)">
          <rect width="344" height="90" rx="14" fill="#fdfbf7" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="16" y="26" fill="${CL.textSubtle}" font-size="11" font-weight="700">TOTAL DURATION</text>
          <text x="16" y="52" fill="#b45309" font-size="17" font-weight="800">48 minutes (2 Dandas)</text>
          <text x="16" y="74" fill="${CL.textSubtle}" font-size="12">Last 24m Ashtami + First 24m Navami</text>
        </g>
      </g>

      <!-- Bottom Amber Disclaimer Notice -->
      <g transform="translate(36, 334)">
        <rect width="1072" height="48" rx="10" fill="${CL.yellowAlertBg}" stroke="${CL.yellowAlertBorder}" stroke-width="1"/>
        <text x="20" y="29" fill="${CL.yellowAlertText}" font-size="12">⚠️ Almanac Note: Official reference timetable (১৪৩৩ সালের পঞ্জিকা). Sandhi Puja begins at 07:26 AM, Balidan at 07:50 AM, ends at 08:14 AM on Monday, 19 October 2026.</text>
      </g>

      <g transform="translate(36, 400)">
        <text x="0" y="16" fill="${CL.textSubtle}" font-size="12">Calculated for: <tspan fill="${CL.textMain}" font-weight="700">Kolkata, West Bengal (22.5726° N, 88.3639° E)</tspan></text>
        <text x="1072" y="16" fill="${CL.red}" font-size="12" font-weight="700" text-anchor="end">View Verified Almanac Source ↗</text>
      </g>
    </g>

    <!-- 7 FESTIVAL DAYS LIST (y: 596) -->
    <g transform="translate(0, 596)">
      <text x="0" y="24" fill="${CL.textMain}" font-size="20" font-weight="800">Complete Festive Itinerary &amp; Tithi Calendar</text>
      <text x="0" y="46" fill="${CL.textSubtle}" font-size="13">Detailed daily schedule for every day of Durga Puja 2026.</text>

      <g transform="translate(0, 68)">
        ${dayCards}
      </g>
    </g>
  </g>

  ${renderFooterLight(1562)}
</svg>
`;
}

const planSvg = generatePlannerLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '04_web_desktop_planner_light.svg'), planSvg, 'utf8');
console.log(`✓ Generated 04_web_desktop_planner_light.svg (${(planSvg.length / 1024).toFixed(1)} KB)`);

const calSvg = generateCalendarLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '05_web_desktop_calendar_light.svg'), calSvg, 'utf8');
console.log(`✓ Generated 05_web_desktop_calendar_light.svg (${(calSvg.length / 1024).toFixed(1)} KB)`);
