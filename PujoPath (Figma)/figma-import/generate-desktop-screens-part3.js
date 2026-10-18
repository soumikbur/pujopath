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

// 06. METRO GUIDE (1440 x 1280 px)
function generateMetro() {
  const W = 1440;
  const H = 1280;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderBackground(H)}
  ${renderHeader('Explore')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${C.redPillText}" font-size="12" font-weight="700" letter-spacing="1">TRANSIT SCHEDULES</text>
    <text x="0" y="54" fill="${C.textMain}" font-size="34" font-weight="800">Kolkata Metro Timetable &amp; Puja Guide</text>
    <text x="0" y="82" fill="${C.textMuted}" font-size="14">Official Kolkata Metro Railway operating hours, first/last trains, and 2026 Durga Puja all-night special services.</text>

    <!-- Filter Pills -->
    <g transform="translate(0, 108)">
      <rect x="0" y="0" width="220" height="34" rx="10" fill="${C.red}"/>
      <text x="110" y="22" fill="${C.white}" font-size="12" font-weight="700" text-anchor="middle">🌙 2026 Puja Night Special  TILL 4 AM</text>

      <rect x="230" y="0" width="160" height="34" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="310" y="22" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">⏱ Regular Timetables</text>

      <rect x="400" y="0" width="160" height="34" rx="10" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="480" y="22" fill="${C.textMain}" font-size="12" font-weight="600" text-anchor="middle">🚇 Stations &amp; Pandals</text>
    </g>

    <!-- Large Red Banner Card -->
    <g transform="translate(0, 160)">
      <rect width="1152" height="140" rx="18" fill="url(#redBannerGrad)" stroke="#b42323" stroke-width="1.5"/>
      <g transform="translate(28, 24)">
        <!-- Badges -->
        <rect x="0" y="0" width="170" height="22" rx="11" fill="#000000" fill-opacity="0.3"/>
        <text x="85" y="15" fill="#FFFFFF" font-size="9" font-weight="700" text-anchor="middle">ALL-NIGHT METRO SERVICE</text>

        <rect x="178" y="0" width="180" height="22" rx="11" fill="#facc15" fill-opacity="0.2"/>
        <text x="268" y="15" fill="#facc15" font-size="9" font-weight="700" text-anchor="middle">SAPTAMI • ASHTAMI • NAVAMI</text>

        <text x="0" y="52" fill="#FFFFFF" font-size="22" font-weight="800">Overnight Trains Running 1:00 PM to 4:00 AM Next Morning</text>
        <text x="0" y="74" fill="#fecaca" font-size="12">Special overnight operations on the Blue Line (Dakshineswar – Kavi Subhash) and Green Line (Howrah Maidan – Salt Lake Sector V) with 6-minute peak frequency.</text>
        
        <text x="0" y="96" fill="#fca5a5" font-size="11">✓ Verified: 12 October 2026   Official Indian Railways Notice ↗</text>
      </g>
    </g>

    <!-- 2-Column Schedule Grid (5 Cards) -->
    <g transform="translate(0, 320)">
      <!-- Row 1 -->
      <!-- Card 1: Blue Line All-Night -->
      <g transform="translate(0, 0)">
        <rect width="564" height="200" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 20)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Blue Line — Maha Saptami to Navami</text>
          <rect x="440" y="0" width="76" height="22" rx="6" fill="${C.purplePill}" fill-opacity="0.3"/>
          <text x="478" y="15" fill="#d8b4fe" font-size="10" font-weight="700" text-anchor="middle">🌙 All-Night</text>
          <text x="0" y="38" fill="${C.textMuted}" font-size="11">📅 17 October 2026 – 19 October 2026 (Saptami, Ashtami, Navami)</text>

          <rect y="50" width="516" height="52" rx="10" fill="${C.cardElevated}"/>
          <text x="16" y="72" fill="${C.textMuted}" font-size="10">First Train</text>
          <text x="16" y="90" fill="${C.textMain}" font-size="13" font-weight="700">01:00 PM (Afternoon start)</text>
          <text x="280" y="72" fill="${C.textMuted}" font-size="10">Last Train</text>
          <text x="280" y="90" fill="${C.redPillText}" font-size="13" font-weight="700">04:00 AM (Next Morning)</text>

          <text x="0" y="122" fill="${C.redPillText}" font-size="11">⏱ Peak Headway: Every 6 minutes</text>
          <text x="0" y="140" fill="${C.textMuted}" font-size="11">Official Special Durga Puja night timetable: Trains operate continuously.</text>
        </g>
      </g>

      <!-- Card 2: Green Line All-Night -->
      <g transform="translate(588, 0)">
        <rect width="564" height="200" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 20)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Green Line — Saptami to Navami Special</text>
          <rect x="440" y="0" width="76" height="22" rx="6" fill="${C.purplePill}" fill-opacity="0.3"/>
          <text x="478" y="15" fill="#d8b4fe" font-size="10" font-weight="700" text-anchor="middle">🌙 All-Night</text>
          <text x="0" y="38" fill="${C.textMuted}" font-size="11">📅 17 October 2026 – 19 October 2026</text>

          <rect y="50" width="516" height="52" rx="10" fill="${C.cardElevated}"/>
          <text x="16" y="72" fill="${C.textMuted}" font-size="10">First Train</text>
          <text x="16" y="90" fill="${C.textMain}" font-size="13" font-weight="700">01:30 PM</text>
          <text x="280" y="72" fill="${C.textMuted}" font-size="10">Last Train</text>
          <text x="280" y="90" fill="${C.redPillText}" font-size="13" font-weight="700">03:59 AM (Next Morning)</text>

          <text x="0" y="122" fill="${C.redPillText}" font-size="11">⏱ Peak Headway: Every 8 minutes</text>
          <text x="0" y="140" fill="${C.textMuted}" font-size="11">Special night trains connecting Howrah Maidan and Salt Lake Sector V.</text>
        </g>
      </g>

      <!-- Row 2 -->
      <!-- Card 3: Blue Line Extended -->
      <g transform="translate(0, 220)">
        <rect width="564" height="190" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 20)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Blue Line — Panchami &amp; Shashthi Extended</text>
          <rect x="440" y="0" width="76" height="22" rx="6" fill="${C.greenLine}" fill-opacity="0.2"/>
          <text x="478" y="15" fill="#86efac" font-size="10" font-weight="700" text-anchor="middle">Extended</text>
          <text x="0" y="38" fill="${C.textMuted}" font-size="11">📅 15 October 2026 – 16 October 2026 (Panchami &amp; Shashthi)</text>

          <rect y="50" width="516" height="52" rx="10" fill="${C.cardElevated}"/>
          <text x="16" y="72" fill="${C.textMuted}" font-size="10">First Train</text>
          <text x="16" y="90" fill="${C.textMain}" font-size="13" font-weight="700">06:50 AM</text>
          <text x="280" y="72" fill="${C.textMuted}" font-size="10">Last Train</text>
          <text x="280" y="90" fill="${C.redPillText}" font-size="13" font-weight="700">12:00 Midnight</text>

          <text x="0" y="122" fill="${C.redPillText}" font-size="11">⏱ Peak Headway: Every 7 minutes</text>
          <text x="0" y="140" fill="${C.textMuted}" font-size="11">Extended night operations until midnight to handle initial festive rush.</text>
        </g>
      </g>

      <!-- Card 4: Bijoya Dashami -->
      <g transform="translate(588, 220)">
        <rect width="564" height="190" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 20)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Blue Line — Bijoya Dashami Immersion</text>
          <rect x="440" y="0" width="76" height="22" rx="6" fill="${C.greenLine}" fill-opacity="0.2"/>
          <text x="478" y="15" fill="#86efac" font-size="10" font-weight="700" text-anchor="middle">Extended</text>
          <text x="0" y="38" fill="${C.textMuted}" font-size="11">📅 21 October 2026 (Bijoya Dashami)</text>

          <rect y="50" width="516" height="52" rx="10" fill="${C.cardElevated}"/>
          <text x="16" y="72" fill="${C.textMuted}" font-size="10">First Train</text>
          <text x="16" y="90" fill="${C.textMain}" font-size="13" font-weight="700">01:00 PM</text>
          <text x="280" y="72" fill="${C.textMuted}" font-size="10">Last Train</text>
          <text x="280" y="90" fill="${C.redPillText}" font-size="13" font-weight="700">10:30 PM</text>

          <text x="0" y="122" fill="${C.redPillText}" font-size="11">⏱ Peak Headway: Every 10 minutes</text>
          <text x="0" y="140" fill="${C.textMuted}" font-size="11">Post-immersion schedule; morning services remain closed.</text>
        </g>
      </g>

      <!-- Row 3: Orange Line Suspended -->
      <g transform="translate(0, 430)">
        <rect width="564" height="170" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 20)">
          <text x="0" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Orange Line — Festival Status</text>
          <rect x="420" y="0" width="96" height="22" rx="6" fill="#78350f" stroke="#ca8a04" stroke-width="1"/>
          <text x="468" y="15" fill="#fef08a" font-size="10" font-weight="700" text-anchor="middle">Suspended</text>
          <text x="0" y="38" fill="${C.textMuted}" font-size="11">📅 17 October 2026 – 21 October 2026 (Saptami to Dashami)</text>

          <rect y="50" width="516" height="46" rx="10" fill="${C.cardElevated}"/>
          <text x="16" y="78" fill="${C.redPillText}" font-size="12" font-weight="700">Suspended (পরিষেবা স্থগিত) — High-demand corridor reallocation</text>
        </g>
      </g>
    </g>
  </g>

  ${renderFooter(1100)}
</svg>
`;
}

// 07. PUJA MUSIC (1440 x 1350 px)
function generateMusic() {
  const W = 1440;
  const H = 1350;

  const tracks = [
    { title: 'Sharodiya Dhak Dhwoni & Kashi Bol', artist: 'Mamta Jagdish Dhody (Live Field Recording) • Dhak & Shankha', dur: '01:39', tag: 'Dhak' },
    { title: 'Sacred Shankha Naad (Auspicious Conch Call)', artist: 'David Bolton • Dhak & Shankha', dur: '00:07', tag: 'Shankha' },
    { title: 'Dhunuchi Naach Dhak Taali & Kaashor', artist: 'Traditional Bengali Dhaki Ensemble • Agomoni & Devotion', dur: '04:00', tag: 'Dhak' },
    { title: 'Master Dhaki Gokul Das Ensemble Rhythms', artist: 'Padma Shri Gokul Chandra Das & Tanmoy Bose', dur: '05:10', tag: 'Ensemble' },
    { title: 'Sharod Shondhya - Autumn Bamboo Flute', artist: 'Bansuri Arvind • Agomoni & Devotional', dur: '00:39', tag: 'Flute' },
    { title: 'Sanskrit Stotram & Chandi Dhwani (Ya Devi)', artist: 'Swami Atmananda (Vedic Chanting) • Sacred Chants', dur: '04:55', tag: 'Chants' },
    { title: 'Jago Tumi Jago (Mahisasuramardini Agomoni)', artist: 'Dwijen Mukhopadhyay, Pankaj Mullick, Bani Kumar', dur: '03:35', tag: 'Classic' },
    { title: 'Bajlo Tomar Alor Benu (Sharad Agomoni)', artist: 'Supriti Ghosh, Pankaj Mullick, Bani Kumar', dur: '03:15', tag: 'Classic' }
  ];

  let tCards = '';
  tracks.forEach((t, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const tx = col * 588;
    const ty = row * 104;
    tCards += `
      <g transform="translate(${tx}, ${ty})">
        <rect width="564" height="92" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        
        <!-- Play circle -->
        <circle cx="42" cy="46" r="22" fill="${C.red}"/>
        <text x="44" y="52" fill="${C.white}" font-size="14" text-anchor="middle">▶</text>

        <text x="80" y="36" fill="${C.textMain}" font-size="14" font-weight="700">${t.title}</text>
        <text x="80" y="56" fill="${C.textMuted}" font-size="11">${t.artist}</text>
        <text x="80" y="74" fill="${C.redPillText}" font-size="10">Creative Commons CC BY-SA 4.0 / GFDL  •  Direct Audio ↗</text>

        <text x="540" y="36" fill="${C.redPillText}" font-size="12" font-weight="700" text-anchor="end">${t.dur}</text>
        <text x="540" y="60" fill="${C.textMuted}" font-size="14" text-anchor="end">🔖</text>
      </g>
    `;
  });

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderBackground(H)}
  ${renderHeader('Explore')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${C.redPillText}" font-size="12" font-weight="700" letter-spacing="1">🎵 SHARODIYA SOUNDSCAPE &amp; HERITAGE</text>
    <text x="0" y="54" fill="${C.textMain}" font-size="34" font-weight="800">Festive Puja Music Traditions</text>
    <text x="0" y="82" fill="${C.textMuted}" font-size="14">Explore Bengal's rich Durga Puja music culture — traditional Dhak beats, Agomoni hymns, and immersion chants.</text>

    <!-- Mood Pills -->
    <g transform="translate(0, 108)">
      <rect width="1152" height="90" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <g transform="translate(20, 16)">
        <text x="0" y="16" fill="${C.textMain}" font-size="13" font-weight="700">✨ Choose Your Puja Mood</text>
        <g transform="translate(0, 26)">
          <rect x="0" y="0" width="80" height="28" rx="8" fill="${C.red}"/>
          <text x="40" y="19" fill="${C.white}" font-size="11" font-weight="700" text-anchor="middle">All Moods</text>

          <rect x="88" y="0" width="124" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="150" y="19" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">Ritual &amp; Devotion</text>

          <rect x="220" y="0" width="168" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="304" y="19" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">Dhak &amp; Traditional Sounds</text>

          <rect x="396" y="0" width="114" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="453" y="19" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">Pandal Hopping</text>

          <rect x="518" y="0" width="140" height="28" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="588" y="19" fill="${C.textMain}" font-size="11" font-weight="600" text-anchor="middle">Bengali Festive Music</text>
        </g>
      </g>
    </g>

    <!-- Search & Library Header -->
    <g transform="translate(0, 214)">
      <rect width="1152" height="46" rx="12" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <text x="18" y="28" fill="${C.textMuted}" font-size="13">🔍 Search tracks, artists, rhythms...</text>
    </g>

    <g transform="translate(0, 276)">
      <text x="0" y="20" fill="${C.textMain}" font-size="18" font-weight="800">Curated Audio Library (22)</text>
      <text x="1152" y="20" fill="${C.textMuted}" font-size="12" text-anchor="end">Verified Licenses &amp; Authorized Streams</text>
    </g>

    <!-- 2-Column Audio Track Grid -->
    <g transform="translate(0, 310)">
      ${tCards}
    </g>
  </g>

  ${renderFooter(1160)}
</svg>
`;
}

// 08. MAHALAYA (1440 x 1150 px)
function generateMahalaya() {
  const W = 1440;
  const H = 1150;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderBackground(H)}
  ${renderHeader('Explore')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${C.redPillText}" font-size="12" font-weight="700" letter-spacing="1">✨ DAWN BROADCAST HERITAGE</text>
    <text x="0" y="54" fill="${C.textMain}" font-size="34" font-weight="800">Mahalaya &amp; Mahishasura Mardini</text>
    <text x="0" y="82" fill="${C.textMuted}" font-size="14">The timeless dawn recitation by Birendra Krishna Bhadra broadcast across Bengal since 1931 on All India Radio.</text>

    <!-- Main Feature Card -->
    <g transform="translate(0, 108)">
      <rect width="1152" height="260" rx="20" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      
      <!-- Artwork Left -->
      <clipPath id="mahImg"><rect x="24" y="24" width="212" height="212" rx="16"/></clipPath>
      <image href="${ASSETS.mahalayaArt}" x="24" y="24" width="212" height="212" preserveAspectRatio="xMidYMid slice" clip-path="url(#mahImg)"/>

      <!-- Content Right -->
      <g transform="translate(260, 28)">
        <rect x="0" y="0" width="170" height="24" rx="12" fill="${C.redPillBg}" stroke="${C.redPillBorder}" stroke-width="1"/>
        <text x="85" y="16" fill="${C.redPillText}" font-size="10" font-weight="700" text-anchor="middle">📡 AIR Akashvani Archive (1931)</text>

        <rect x="180" y="0" width="160" height="24" rx="12" fill="#064e3b" stroke="#059669" stroke-width="1"/>
        <text x="260" y="16" fill="#a7f3d0" font-size="10" font-weight="700" text-anchor="middle">🛡 Authorized In-Page Stream</text>

        <text x="0" y="58" fill="${C.textMain}" font-size="24" font-weight="800">Mahishasura Mardini — Birendra Krishna Bhadra</text>
        <text x="0" y="86" fill="${C.textMuted}" font-size="13">Sacred Sanskrit Chandi Mahatmya, script by Bani Kumar, and musical</text>
        <text x="0" y="104" fill="${C.textMuted}" font-size="13">direction by Pankaj Kumar Mullick awakening Bengal for over 90 years.</text>

        <!-- CTA Buttons -->
        <g transform="translate(0, 134)">
          <rect width="210" height="42" rx="12" fill="${C.red}"/>
          <text x="105" y="26" fill="${C.white}" font-size="13" font-weight="700" text-anchor="middle">▶ Play Mahishasura Mardini</text>

          <rect x="222" y="0" width="150" height="42" rx="12" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="297" y="26" fill="${C.textMain}" font-size="13" font-weight="600" text-anchor="middle">🎵 Browse Puja Music</text>

          <rect x="384" y="0" width="130" height="42" rx="12" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="449" y="26" fill="${C.textMuted}" font-size="13" font-weight="600" text-anchor="middle">Archive Source ↗</text>
        </g>
      </g>
    </g>

    <!-- The Creative Legends Card -->
    <g transform="translate(0, 388)">
      <rect width="1152" height="150" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 20)">
        <text x="0" y="18" fill="${C.red}" font-size="15">✨</text>
        <text x="20" y="18" fill="${C.textMain}" font-size="15" font-weight="800">The Creative Legends</text>

        <!-- 3 Columns -->
        <g transform="translate(0, 36)">
          <rect width="350" height="70" rx="10" fill="${C.cardElevated}"/>
          <text x="16" y="24" fill="${C.redPillText}" font-size="10" font-weight="700">RECITATION &amp; CHANDI PATH</text>
          <text x="16" y="44" fill="${C.textMain}" font-size="14" font-weight="700">Birendra Krishna Bhadra</text>
          <text x="16" y="60" fill="${C.textMuted}" font-size="11">Iconic resonant sacred invocation</text>

          <rect x="370" y="0" width="350" height="70" rx="10" fill="${C.cardElevated}"/>
          <text x="386" y="24" fill="${C.redPillText}" font-size="10" font-weight="700">SCRIPT &amp; CONCEPT</text>
          <text x="386" y="44" fill="${C.textMain}" font-size="14" font-weight="700">Bani Kumar</text>
          <text x="386" y="60" fill="${C.textMuted}" font-size="11">Chandi Mahatmya literary composition</text>

          <rect x="740" y="0" width="350" height="70" rx="10" fill="${C.cardElevated}"/>
          <text x="756" y="24" fill="${C.redPillText}" font-size="10" font-weight="700">MUSIC DIRECTION</text>
          <text x="756" y="44" fill="${C.textMain}" font-size="14" font-weight="700">Pankaj Kumar Mullick</text>
          <text x="756" y="60" fill="${C.textMuted}" font-size="11">Timeless orchestral &amp; vocal score</text>
        </g>
      </g>
    </g>

    <!-- Historic Broadcast Narrative -->
    <g transform="translate(0, 558)">
      <rect width="1152" height="130" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 20)">
        <text x="0" y="18" fill="${C.textMain}" font-size="15" font-weight="800">About the 1931 Sacred Broadcast</text>
        <text x="0" y="42" fill="${C.textMuted}" font-size="12">First broadcast live at 4:00 AM on the dawn of Mahalaya in 1931 from the 1, Garstin Place studio of All India Radio Kolkata.</text>
        <text x="0" y="60" fill="${C.textMuted}" font-size="12">Even after nine decades, Bengal awakens at dawn on Mahalaya to the resonant voice of Birendra Krishna Bhadra reciting the Chandi Mahatmya.</text>
        <text x="0" y="86" fill="${C.textFaint}" font-size="11">ℹ Copyright &amp; Archival Context: Commercial recording and broadcast rights are held by All India Radio (Prasar Bharati) and Saregama India.</text>
      </g>
    </g>
  </g>

  ${renderFooter(970)}
</svg>
`;
}

fs.writeFileSync(path.join(OUT_DIR, '06_web_desktop_metro.svg'), generateMetro().trim());
fs.writeFileSync(path.join(OUT_DIR, '07_web_desktop_music.svg'), generateMusic().trim());
fs.writeFileSync(path.join(OUT_DIR, '08_web_desktop_mahalaya.svg'), generateMahalaya().trim());
console.log('✓ 06_web_desktop_metro.svg, 07_web_desktop_music.svg, 08_web_desktop_mahalaya.svg generated');
