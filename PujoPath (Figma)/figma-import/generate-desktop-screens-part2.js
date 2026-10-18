const fs = require('fs');
const path = require('path');
const {
  OUT_DIR,
  C,
  SVG_STYLE,
  renderHeader,
  renderFooter,
  renderBackground
} = require('./faithful-desktop-shared');

// 04. ROUTE PLANNER (1440 x 1320 px)
function generatePlanner() {
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
        <rect width="368" height="72" rx="14" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="16" y="28" fill="${C.textMain}" font-size="14" font-weight="700">${p.name}</text>
        <text x="16" y="48" fill="${C.textMuted}" font-size="11">${p.loc}</text>
        ${p.bonedi ? `<rect x="16" y="52" width="68" height="16" rx="4" fill="#000000" fill-opacity="0.6"/><text x="50" y="64" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">🏛 Bonedi Bari</text>` : ''}
        <rect x="296" y="20" width="56" height="32" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="324" y="41" fill="${C.redPillText}" font-size="12" font-weight="700" text-anchor="middle">+ Add</text>
      </g>
    `;
  });

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderBackground(H)}
  ${renderHeader('Plan')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${C.redPillText}" font-size="12" font-weight="700" letter-spacing="1">ROUTE PLANNER</text>
    <text x="0" y="54" fill="${C.textMain}" font-size="34" font-weight="800">Pandal Hopping Route Planner</text>
    <text x="0" y="82" fill="${C.textMuted}" font-size="14">Plan your customized pandal hopping route across Kolkata with smart nearest-neighbor optimization.</text>

    <!-- Top Stats Banner -->
    <g transform="translate(0, 108)">
      <rect width="1152" height="76" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 20)">
        <text x="0" y="16" fill="${C.textMuted}" font-size="10" font-weight="700" letter-spacing="0.5">TOTAL STOPS</text>
        <text x="0" y="42" fill="${C.textMain}" font-size="22" font-weight="800">0 Pandals</text>

        <text x="260" y="16" fill="${C.textMuted}" font-size="10" font-weight="700" letter-spacing="0.5">WALKING DISTANCE</text>
        <text x="260" y="42" fill="${C.redPillText}" font-size="22" font-weight="800">0 m</text>

        <text x="520" y="16" fill="${C.textMuted}" font-size="10" font-weight="700" letter-spacing="0.5">EST. DURATION</text>
        <text x="520" y="42" fill="${C.textMain}" font-size="22" font-weight="800">~0 mins</text>

        <!-- Optimize Trail Button -->
        <rect x="912" y="4" width="192" height="40" rx="12" fill="${C.redPillBg}" stroke="${C.redPillBorder}" stroke-width="1"/>
        <text x="1008" y="29" fill="${C.redPillText}" font-size="13" font-weight="700" text-anchor="middle">✦ Optimize Trail</text>
      </g>
    </g>

    <!-- Empty State Box -->
    <g transform="translate(0, 204)">
      <rect width="1152" height="190" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <g transform="translate(576, 32)">
        <text x="0" y="24" fill="${C.redPillText}" font-size="28" text-anchor="middle">🧭</text>
        <text x="0" y="60" fill="${C.textMain}" font-size="18" font-weight="800" text-anchor="middle">Your Puja Trail is Empty</text>
        <text x="0" y="84" fill="${C.textMuted}" font-size="13" text-anchor="middle">Browse pandals in the directory and click "Add Route" to build your personalized walking trail, or add your own custom pandal.</text>
        
        <g transform="translate(-150, 104)">
          <rect width="144" height="38" rx="10" fill="${C.red}"/>
          <text x="72" y="24" fill="${C.white}" font-size="13" font-weight="700" text-anchor="middle">🔍 Explore Pandals</text>

          <rect x="156" y="0" width="144" height="38" rx="10" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="228" y="24" fill="${C.redPillText}" font-size="13" font-weight="700" text-anchor="middle">+ Add New Pandal</text>
        </g>
      </g>
    </g>

    <!-- Add Pandals Section -->
    <g transform="translate(0, 414)">
      <rect width="1152" height="500" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      
      <g transform="translate(24, 24)">
        <text x="0" y="18" fill="${C.red}" font-size="16">✦</text>
        <text x="20" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Add Pandals to Your Trail</text>
        <text x="0" y="38" fill="${C.textMuted}" font-size="12">Filter by locality, heritage houses, or add your own custom pandal.</text>

        <!-- Search + Add Custom -->
        <g transform="translate(620, 0)">
          <rect width="320" height="38" rx="10" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="14" y="24" fill="${C.textMuted}" font-size="12">🔍 Search pandals...</text>
          
          <rect x="330" y="0" width="150" height="38" rx="10" fill="${C.cardElevated}" stroke="${C.red}" stroke-width="1"/>
          <text x="405" y="24" fill="${C.red}" font-size="12" font-weight="700" text-anchor="middle">+ Add New Pandal</text>
        </g>

        <!-- Filter Pills -->
        <g transform="translate(0, 56)">
          <rect x="0" y="0" width="84" height="28" rx="8" fill="${C.red}"/>
          <text x="42" y="19" fill="${C.white}" font-size="11" font-weight="700" text-anchor="middle">All Pandals</text>

          <rect x="92" y="0" width="110" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="147" y="19" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">🏛 Bonedi Bari 24</text>

          <rect x="210" y="0" width="60" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="240" y="19" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">North</text>

          <rect x="278" y="0" width="60" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="308" y="19" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">South</text>

          <rect x="346" y="0" width="68" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="380" y="19" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">Central</text>

          <rect x="422" y="0" width="116" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="480" y="19" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">Salt Lake &amp; East</text>
        </g>

        <!-- 3-Column Pandals Grid -->
        <g transform="translate(0, 102)">
          ${pCards}
        </g>

        <!-- Show More Button -->
        <g transform="translate(450, 440)">
          <rect width="200" height="34" rx="10" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="100" y="22" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">Show More Pandals (+12)</text>
        </g>
      </g>
    </g>
  </g>

  ${renderFooter(1140)}
</svg>
`;
}

// 05. CALENDAR SCREEN (1440 x 1720 px)
function generateCalendar() {
  const W = 1440;
  const H = 1720;

  const days = [
    { title: 'Mahalaya (মহালয়া)', date: '2026-10-10', badge: 'AMAVASYA (MAHALAYA AMAVASYA)', desc: 'The sacred dawn of Agomoni marking the arrival of Goddess Durga and the end of Pitru Paksha. Bengalis wake at 4:00 AM for the legendary Chandipath recitation.', pushp: 'Tarpan: 05:15 AM - 09:30 AM' },
    { title: 'Maha Panchami (মহা পঞ্চমী)', date: '2026-10-15', badge: 'PANCHAMI TITHI', desc: 'The festive awakening marking the welcoming of Mother Durga, Anandamela food celebrations, and ceremonial inauguration of pandals across the city.', pushp: 'Tithi extends till 01:43 AM (Late Night)' },
    { title: 'Maha Shashthi (মহা ষষ্ঠী)', date: '2026-10-16', badge: 'SHASHTHI TITHI', desc: 'The official beginning of Durga Puja rituals. Goddess Durga is welcomed with the awakening ritual (Bodhon) under the sacred Bilva (Bel) tree.', pushp: '08:30 AM - 10:00 AM (Tithi till 03:47 AM Night)' },
    { title: 'Maha Saptami (মহা সপ্তমী)', date: '2026-10-17', badge: 'SAPTAMI TITHI', desc: 'Arrival of Nabapatrika (Kola Bou) after morning holy bath at the river, representing nature and agriculture fertility, followed by Pran Pratishtha.', pushp: '08:30 AM - 10:15 AM (Tithi till Sun 05:53 AM)' },
    { title: 'Maha Ashtami & Sandhi Puja (মহা অষ্টমী ও সন্ধিপূজা)', date: '2026-10-19', badge: 'MAHA ASHTAMI TITHI • SACRED ANJALI', desc: 'The most sacred day of Durga Puja. Devotees fast for Ashtami Pushpanjali, followed by the momentous Sandhi Puja with Balidan, 108 lotus flowers, and 108 lamps.', pushp: '06:30 AM - 07:45 AM (Must conclude before 07:50 AM)', highlight: true },
    { title: 'Maha Nabami (মহা নবমী)', date: '2026-10-20', badge: 'NABAMI TITHI', desc: 'The celebratory day marking the final victory of Devi Mahishasuramardini over the demon Mahishasura. Navami tithi lasts until 09:31 AM, followed by Maha Nabami Homa.', pushp: '08:00 AM - 09:15 AM (Tithi ends at 09:31 AM)' },
    { title: 'Bijoya Dashami & Sindoor Khela (বিজয়া দশমী ও সিঁদুর উৎসব)', date: '2026-10-21', badge: 'DASHAMI TITHI', desc: 'Bittersweet farewell as Mother Durga departs for Mount Kailash. Dashami tithi continues till 10:47 AM, followed by Aparajita Puja, Dadhikarma, Debi Bisorjon (immersion), and Sindoor Khela.', pushp: '08:30 AM - 10:30 AM (Aparajita Puja & Pushpanjali)' }
  ];

  let dayCardsSvg = '';
  let dy = 550;
  days.forEach((d, idx) => {
    const cardH = d.highlight ? 180 : 130;
    dayCardsSvg += `
      <g transform="translate(0, ${dy})">
        <rect width="1152" height="${cardH}" rx="18" fill="${C.cardBg}" stroke="${d.highlight ? '#ca8a04' : C.cardBorder}" stroke-width="${d.highlight ? '1.5' : '1'}"/>
        
        <g transform="translate(24, 20)">
          <!-- Top Row: Badge & Date -->
          <text x="0" y="14" fill="${d.highlight ? '#ca8a04' : C.redPillText}" font-size="10" font-weight="700" letter-spacing="0.5">${d.badge}</text>
          <text x="1104" y="14" fill="${C.textMuted}" font-size="12" font-weight="600" text-anchor="end">${d.date}</text>

          <!-- Day Title -->
          <text x="0" y="44" fill="${C.textMain}" font-size="20" font-weight="800">${d.title}</text>
          <text x="0" y="68" fill="${C.textMuted}" font-size="12">${d.desc}</text>

          ${d.highlight ? `
          <!-- Key Anjali Timing Banner -->
          <g transform="translate(0, 86)">
            <rect width="1104" height="52" rx="12" fill="#341b18" stroke="#4d221e" stroke-width="1"/>
            <text x="20" y="32" fill="#ca8a04" font-size="16">✨</text>
            <text x="46" y="24" fill="#ca8a04" font-size="11" font-weight="700">Maha Ashtami Sacred Pushpanjali (Special Highlight)</text>
            <text x="46" y="42" fill="${C.white}" font-size="14" font-weight="800">06:30 AM – 07:45 AM (Must conclude before 07:50 AM)</text>
            <rect x="940" y="12" width="144" height="28" rx="8" fill="${C.red}"/>
            <text x="1012" y="31" fill="${C.white}" font-size="10" font-weight="700" text-anchor="middle">KEY ANJALI TIMING</text>
          </g>
          ` : `
          <!-- Pushpanjali line -->
          <g transform="translate(0, 80)">
            <rect width="1104" height="34" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
            <text x="16" y="22" fill="${C.redPillText}" font-size="11">🕒 Pushpanjali Auspicious Timings: <tspan fill="${C.textMain}" font-weight="700">${d.pushp}</tspan></text>
          </g>
          `}
        </g>
      </g>
    `;
    dy += cardH + 16;
  });

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderBackground(H)}
  ${renderHeader('Explore')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${C.redPillText}" font-size="12" font-weight="700" letter-spacing="1">📅 PUJA ALMANAC</text>
    <text x="0" y="54" fill="${C.textMain}" font-size="34" font-weight="800">Durga Puja 2026 Sacred Calendar</text>
    <text x="0" y="82" fill="${C.textMuted}" font-size="14">Exact tithi schedules, pushpanjali auspicious timings, and sandhi puja hours.</text>

    <!-- Top Auspicious Card (w: 1152, h: 420) -->
    <g transform="translate(0, 108)">
      <rect width="1152" height="420" rx="20" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      
      <g transform="translate(28, 28)">
        <!-- Badges & Timing -->
        <rect x="0" y="0" width="190" height="24" rx="12" fill="${C.redPillBg}" stroke="${C.redPillBorder}" stroke-width="1"/>
        <text x="95" y="16" fill="${C.redPillText}" font-size="10" font-weight="700" text-anchor="middle">SACRED SANDHI WINDOW 2026</text>

        <rect x="200" y="0" width="140" height="24" rx="12" fill="#362208" stroke="#ca8a04" stroke-width="1"/>
        <text x="270" y="16" fill="#facc15" font-size="10" font-weight="700" text-anchor="middle">108 Lotuses &amp; Lamps</text>

        <text x="1096" y="18" fill="${C.redPillText}" font-size="13" font-weight="700" text-anchor="end">48 minutes (2 Dandas: 07:26 AM – 08:14 AM)</text>

        <!-- Big Title -->
        <text x="0" y="60" fill="${C.textMain}" font-size="24" font-weight="800">🔥 Sandhi Puja Auspicious Timings</text>

        <!-- Almanac Selector Buttons -->
        <g transform="translate(0, 78)">
          <text x="0" y="16" fill="${C.textMuted}" font-size="10" font-weight="700" letter-spacing="0.5">SELECT ALMANAC / PANJIKA CONVENTION:</text>
          
          <g transform="translate(0, 24)">
            <rect width="360" height="48" rx="12" fill="#2d1715" stroke="${C.red}" stroke-width="1.5"/>
            <text x="16" y="24" fill="${C.white}" font-size="12" font-weight="700">Bengali Almanac 1433 Schedule (১৪৩৩ বিশুদ্ধ)</text>
            <text x="16" y="40" fill="${C.redPillText}" font-size="11">07:26 AM IST – 08:14 AM IST  ✓</text>

            <rect x="372" y="0" width="360" height="48" rx="12" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
            <text x="388" y="24" fill="${C.textMain}" font-size="12" font-weight="600">Drik Panchang (Modern Ephemeris)</text>
            <text x="388" y="40" fill="${C.textMuted}" font-size="11">10:27 AM IST – 11:15 AM IST</text>

            <rect x="744" y="0" width="352" height="48" rx="12" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
            <text x="760" y="24" fill="${C.textMain}" font-size="12" font-weight="600">Gupta Press / Surya Siddhanta</text>
            <text x="760" y="40" fill="${C.textMuted}" font-size="11">06:21 PM IST – 07:09 PM IST</text>
          </g>
        </g>

        <!-- 3 Metric Boxes -->
        <g transform="translate(0, 168)">
          <!-- Box 1 -->
          <rect width="360" height="72" rx="12" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="16" y="22" fill="${C.textMuted}" font-size="10" font-weight="700">FESTIVAL &amp; DATE</text>
          <text x="16" y="42" fill="${C.redPillText}" font-size="14" font-weight="700">Sandhi Puja (সন্ধিপূজা)</text>
          <text x="16" y="60" fill="${C.textMain}" font-size="12">Monday, 19 October 2026</text>

          <!-- Box 2 -->
          <rect x="372" y="0" width="360" height="72" rx="12" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="388" y="22" fill="${C.textMuted}" font-size="10" font-weight="700">SANDHI PUJA WINDOW (IST)</text>
          <text x="388" y="42" fill="${C.redPillText}" font-size="14" font-weight="700">07:26 AM IST – 08:14 AM IST</text>
          <text x="388" y="60" fill="${C.textMain}" font-size="12">Indian Standard Time (IST)</text>

          <!-- Box 3 -->
          <rect x="744" y="0" width="352" height="72" rx="12" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="760" y="22" fill="${C.textMuted}" font-size="10" font-weight="700">TOTAL DURATION</text>
          <text x="760" y="42" fill="#ca8a04" font-size="14" font-weight="700">48 minutes (2 Dandas)</text>
          <text x="760" y="60" fill="${C.textMain}" font-size="12">Last 24m Ashtami + First 24m Navami</text>
        </g>

        <!-- Context & Gold Warning -->
        <g transform="translate(0, 256)">
          <text x="0" y="16" fill="${C.textMain}" font-size="11" font-weight="700">SIGNIFICANCE &amp; MYTHOLOGICAL CONTEXT:</text>
          <text x="0" y="34" fill="${C.textMuted}" font-size="11">Sandhi Puja commemorates the supreme cosmic moment when Goddess Durga assumed the fiery form of Chamunda</text>
          <text x="0" y="50" fill="${C.textMuted}" font-size="11">to vanquish demons Chanda and Munda. Sandhi Puja begins at 07:26 AM with Balidan at 07:50 AM with 108 lotuses and lamps.</text>

          <rect y="64" width="1096" height="34" rx="8" fill="#362208" stroke="#ca8a04" stroke-width="1"/>
          <text x="14" y="85" fill="#facc15" font-size="11">⚠️ Almanac Note: Approved reference timetable (১৪৩৩ বঙ্গাব্দ বিশুদ্ধ সিদ্ধান্ত). Kolkata coordinates 22.5726° N, 88.3639° E.</text>
        </g>
      </g>
    </g>

    <!-- 7 Festival Day Cards -->
    ${dayCardsSvg}
  </g>

  ${renderFooter(1540)}
</svg>
`;
}

fs.writeFileSync(path.join(OUT_DIR, '04_web_desktop_planner.svg'), generatePlanner().trim());
fs.writeFileSync(path.join(OUT_DIR, '05_web_desktop_calendar.svg'), generateCalendar().trim());
console.log('✓ 04_web_desktop_planner.svg & 05_web_desktop_calendar.svg generated');
