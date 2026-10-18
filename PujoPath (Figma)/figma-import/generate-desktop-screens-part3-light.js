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

// 06. METRO GUIDE LIGHT (1440 x 1280 px)
function generateMetroLight() {
  const W = 1440;
  const H = 1280;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE_LIGHT}
  ${renderBackgroundLight(H, false)}
  ${renderHeaderLight('Explore')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${CL.red}" font-size="12" font-weight="700" letter-spacing="1">TRANSIT SCHEDULES</text>
    <text x="0" y="54" fill="${CL.textMain}" font-size="34" font-weight="800">Kolkata Metro Timetable &amp; Puja Guide</text>
    <text x="0" y="82" fill="${CL.textMuted}" font-size="14">Official Kolkata Metro Railway operating hours, first/last trains, and 2026 Durga Puja all-night special services.</text>

    <!-- Filter Pills -->
    <g transform="translate(0, 108)">
      <rect x="0" y="0" width="220" height="34" rx="10" fill="${CL.red}"/>
      <text x="110" y="22" fill="${CL.white}" font-size="12" font-weight="700" text-anchor="middle">🌙 2026 Puja Night Special  TILL 4 AM</text>

      <rect x="230" y="0" width="160" height="34" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="310" y="22" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">⏱ Regular Timetables</text>

      <rect x="400" y="0" width="160" height="34" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="480" y="22" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">🚇 Stations &amp; Pandals</text>
    </g>

    <!-- Large Red Banner Card -->
    <g transform="translate(0, 160)">
      <rect width="1152" height="140" rx="18" fill="${CL.redBannerBg}" stroke="#7f1d1d" stroke-width="1.5"/>
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
        <rect width="564" height="200" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 20)">
          <text x="0" y="18" fill="${CL.textMain}" font-size="16" font-weight="800">Blue Line — Maha Saptami to Navami</text>
          <rect x="440" y="0" width="76" height="22" rx="6" fill="#feeceb"/>
          <text x="478" y="15" fill="${CL.red}" font-size="10" font-weight="700" text-anchor="middle">🌙 All-Night</text>
          <text x="0" y="38" fill="${CL.textSubtle}" font-size="11">📅 17 October 2026 – 19 October 2026 (Saptami, Ashtami, Navami)</text>

          <rect y="50" width="516" height="52" rx="10" fill="#fdfbf7" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="16" y="72" fill="${CL.textSubtle}" font-size="10">First Train</text>
          <text x="16" y="90" fill="${CL.textMain}" font-size="13" font-weight="700">01:00 PM (Afternoon start)</text>
          <text x="280" y="72" fill="${CL.textSubtle}" font-size="10">Last Train</text>
          <text x="280" y="90" fill="${CL.red}" font-size="13" font-weight="700">04:00 AM (Next Morning)</text>

          <text x="0" y="122" fill="${CL.red}" font-size="11">⏱ Peak Headway: Every 6 minutes</text>
          <text x="0" y="140" fill="${CL.textSubtle}" font-size="11">Official Special Durga Puja night timetable: Trains operate continuously.</text>
        </g>
      </g>

      <!-- Card 2: Green Line Sector V to Sealdah -->
      <g transform="translate(588, 0)">
        <rect width="564" height="200" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 20)">
          <text x="0" y="18" fill="${CL.textMain}" font-size="16" font-weight="800">Green Line — Salt Lake Sector V to Sealdah</text>
          <rect x="440" y="0" width="76" height="22" rx="6" fill="#feeceb"/>
          <text x="478" y="15" fill="${CL.red}" font-size="10" font-weight="700" text-anchor="middle">🌙 All-Night</text>
          <text x="0" y="38" fill="${CL.textSubtle}" font-size="11">📅 17 October 2026 – 19 October 2026</text>

          <rect y="50" width="516" height="52" rx="10" fill="#fdfbf7" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="16" y="72" fill="${CL.textSubtle}" font-size="10">First Train</text>
          <text x="16" y="90" fill="${CL.textMain}" font-size="13" font-weight="700">01:30 PM</text>
          <text x="280" y="72" fill="${CL.textSubtle}" font-size="10">Last Train</text>
          <text x="280" y="90" fill="${CL.red}" font-size="13" font-weight="700">03:59 AM (Next Morning)</text>

          <text x="0" y="122" fill="${CL.greenLine}" font-size="11">⏱ Peak Headway: Every 8 minutes</text>
          <text x="0" y="140" fill="${CL.textSubtle}" font-size="11">Special night trains connecting Howrah and Salt Lake pandals.</text>
        </g>
      </g>

      <!-- Row 2 -->
      <!-- Card 3: Green Line Howrah Maidan to Esplanade -->
      <g transform="translate(0, 218)">
        <rect width="564" height="190" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 20)">
          <text x="0" y="18" fill="${CL.textMain}" font-size="16" font-weight="800">Green Line — Howrah Maidan to Esplanade</text>
          <rect x="440" y="0" width="76" height="22" rx="6" fill="#feeceb"/>
          <text x="478" y="15" fill="${CL.red}" font-size="10" font-weight="700" text-anchor="middle">🌙 All-Night</text>
          <text x="0" y="38" fill="${CL.textSubtle}" font-size="11">Underwater river tunnel transit corridor across Hooghly</text>

          <rect y="50" width="516" height="52" rx="10" fill="#fdfbf7" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="16" y="72" fill="${CL.textSubtle}" font-size="10">First Train</text>
          <text x="16" y="90" fill="${CL.textMain}" font-size="13" font-weight="700">02:00 PM</text>
          <text x="280" y="72" fill="${CL.textSubtle}" font-size="10">Last Train</text>
          <text x="280" y="90" fill="${CL.red}" font-size="13" font-weight="700">03:00 AM</text>

          <text x="0" y="122" fill="${CL.textSubtle}" font-size="11">Direct connectivity for Central &amp; Howrah pandal visitors.</text>
        </g>
      </g>

      <!-- Card 4: Purple Line (Joka to Taratala) -->
      <g transform="translate(588, 218)">
        <rect width="564" height="190" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 20)">
          <text x="0" y="18" fill="${CL.textMain}" font-size="16" font-weight="800">Purple Line — Joka to Majerhat</text>
          <rect x="440" y="0" width="76" height="22" rx="6" fill="#dbeafe"/>
          <text x="478" y="15" fill="${CL.blueLine}" font-size="10" font-weight="700" text-anchor="middle">Extended</text>
          <text x="0" y="38" fill="${CL.textSubtle}" font-size="11">Special services for Behala and South-West Kolkata</text>

          <rect y="50" width="516" height="52" rx="10" fill="#fdfbf7" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="16" y="72" fill="${CL.textSubtle}" font-size="10">Operating Hours</text>
          <text x="16" y="90" fill="${CL.textMain}" font-size="13" font-weight="700">08:30 AM to 09:30 PM</text>
          <text x="280" y="72" fill="${CL.textSubtle}" font-size="10">Frequency</text>
          <text x="280" y="90" fill="${CL.textMain}" font-size="13" font-weight="700">Every 25 mins</text>

          <text x="0" y="122" fill="${CL.textSubtle}" font-size="11">Key connection for Behala Natun Dal and Barisha pandals.</text>
        </g>
      </g>
    </g>
  </g>

  ${renderFooterLight(1122)}
</svg>
`;
}

// 07. MUSIC SCREEN LIGHT (1440 x 1350 px)
function generateMusicLight() {
  const W = 1440;
  const H = 1350;

  const tracks = [
    { title: 'Sharodiya Dhak Dhwoni & Kashi Bol', artist: 'Mamta Jagdish Dhody (Live Field Recording)', tag: 'Dhak & Shankha', dur: '01:39', desc: 'Authentic live field recording of traditional Bengali wooden dhak drums and resonant brass kashi bells.', auth: true },
    { title: 'Sacred Shankha Naad (Auspicious Conch Call)', artist: 'David Bolton', tag: 'Dhak & Shankha', dur: '00:07', desc: 'Resonant sacred conch blowing associated with Sandhi Puja transition, evening aarati, and invoking Devi Durga.', auth: false },
    { title: 'Dhunuchi Naach Dhak Taali & Kaashor', artist: 'Traditional Bengali Dhaki Ensemble', tag: 'Dhak & Shankha', dur: '04:00', desc: 'Electrifying fast-paced rhythmic crescendo performed to accompany the sacred camphor and coconut husk Dhunuchi dance.', auth: true },
    { title: 'Master Dhaki Gokul Das Ensemble Rhythms', artist: 'Padma Shri Gokul Chandra Das & Tanmoy Bose', tag: 'Dhak & Shankha', dur: '05:10', desc: 'Virtuosic cross-rhythms by Bengal\'s master dhaki Padma Shri Gokul Chandra Das and tabla maestro Tanmoy Bose.', auth: true },
    { title: 'Sharod Shondhya - Autumn Bamboo Flute Melody', artist: 'Bansuri Arvind', tag: 'Agomoni & Devotional', dur: '00:39', desc: 'Pure acoustic bamboo flute melody evoking tranquil autumn mornings, dew on Shiuli flowers, and the arrival of the Mother.', auth: false },
    { title: 'Sanskrit Stotram & Chandi Dhwani (Ya Devi Sarvabhuteshu)', artist: 'Swami Atmananda (Vedic Chanting)', tag: 'Agomoni & Devotional', dur: '04:55', desc: 'Authentic classical Sanskrit sacred chanting and stotra recitation invoking the cosmic mother from sacred Vedic scriptures.', auth: false },
    { title: 'Aigiri Nandini Rock & Fusion Crescendo', artist: 'Kolkata Youth Fusion Collective', tag: 'Pandal Hopping', dur: '03:45', desc: 'High-energy contemporary rock-dhak fusion rendition of the Mahishasura Mardini Stotram popular in North Kolkata pandals.', auth: true },
    { title: 'Dhak Beat & Kanshi Rhythms: Bisorjon Farewell Procession', artist: 'Heritage Dhaki Samiti', tag: 'Bisorjon & Farewell', dur: '02:30', desc: 'Slow, solemn rhythmic pulse accompanying the immersion procession of Devi Durga into the waters of the Hooghly on Dashami.', auth: true }
  ];

  let trackCards = '';
  tracks.forEach((t, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const tx = col * 588;
    const ty = row * 156;
    trackCards += `
      <g transform="translate(${tx}, ${ty})">
        <rect width="564" height="142" rx="16" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <!-- Play circle -->
          <circle cx="24" cy="24" r="24" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <path d="M 21,17 L 31,24 L 21,31 Z" fill="${CL.red}"/>

          <text x="60" y="20" fill="${CL.textMain}" font-size="14" font-weight="700">${t.title.length > 40 ? t.title.substring(0, 38) + '...' : t.title}</text>
          <text x="60" y="38" fill="${CL.textSubtle}" font-size="11">${t.artist}  •  <tspan fill="${CL.red}">${t.tag}</tspan></text>
          <text x="60" y="58" fill="${CL.textMuted}" font-size="11">${t.desc.length > 68 ? t.desc.substring(0, 66) + '...' : t.desc}</text>
          
          <text x="532" y="20" fill="${CL.red}" font-size="12" font-weight="700" text-anchor="end">${t.dur}</text>

          <!-- Badges -->
          <g transform="translate(60, 76)">
            ${t.auth ? `
              <rect width="108" height="20" rx="6" fill="${CL.badgeAuthStreamBg}"/>
              <text x="54" y="14" fill="${CL.badgeAuthStreamText}" font-size="9" font-weight="700" text-anchor="middle">Authorized Stream</text>
            ` : `
              <rect width="78" height="20" rx="6" fill="${CL.badgeDirectAudioBg}"/>
              <text x="39" y="14" fill="${CL.badgeDirectAudioText}" font-size="9" font-weight="700" text-anchor="middle">Direct Audio</text>
            `}
            <text x="140" y="14" fill="${CL.textSubtle}" font-size="10">Source ↗</text>
          </g>
        </g>
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
    <text x="0" y="20" fill="${CL.red}" font-size="12" font-weight="700" letter-spacing="1">🎵 SHARODIYA SOUNDSCAPE &amp; HERITAGE</text>
    <text x="0" y="54" fill="${CL.textMain}" font-size="34" font-weight="800">Festive Puja Music Traditions</text>
    <text x="0" y="82" fill="${CL.textMuted}" font-size="14">Explore Bengal's rich Durga Puja music culture — traditional Dhak beats, Agomoni hymns, pandal-hopping anthems, and immersion chants.</text>

    <!-- Choose Your Puja Mood Section -->
    <g transform="translate(0, 108)">
      <rect width="1152" height="110" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 20)">
        <text x="0" y="16" fill="${CL.textMain}" font-size="14" font-weight="800">✨ Choose Your Puja Mood</text>
        <g transform="translate(0, 32)">
          <rect x="0" y="0" width="84" height="32" rx="10" fill="${CL.red}"/>
          <text x="42" y="21" fill="${CL.white}" font-size="12" font-weight="700" text-anchor="middle">All Moods</text>

          <rect x="94" y="0" width="134" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="161" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Ritual &amp; Devotion</text>

          <rect x="238" y="0" width="170" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="323" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Dhak &amp; Traditional Sounds</text>

          <rect x="418" y="0" width="118" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="477" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Pandal Hopping</text>

          <rect x="546" y="0" width="144" height="32" rx="10" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="618" y="21" fill="${CL.textMain}" font-size="12" font-weight="600" text-anchor="middle">Bengali Festive Music</text>
        </g>
      </g>
    </g>

    <!-- Search Input -->
    <g transform="translate(0, 234)">
      <rect width="1152" height="48" rx="14" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <text x="20" y="30" fill="${CL.textFaint}" font-size="15">🔍</text>
      <text x="48" y="30" fill="${CL.textFaint}" font-size="14">Search tracks, artists, rhythms...</text>
    </g>

    <!-- Audio Tracks Grid (8 Cards) -->
    <g transform="translate(0, 302)">
      ${trackCards}
    </g>
  </g>

  ${renderFooterLight(1192)}
</svg>
`;
}

// 08. MAHALAYA SCREEN LIGHT (1440 x 1150 px)
function generateMahalayaLight() {
  const W = 1440;
  const H = 1150;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE_LIGHT}
  ${renderBackgroundLight(H, false)}
  ${renderHeaderLight('More')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${CL.red}" font-size="12" font-weight="700" letter-spacing="1">✨ DAWN BROADCAST HERITAGE</text>
    <text x="0" y="54" fill="${CL.textMain}" font-size="34" font-weight="800">Mahalaya &amp; Mahishasura Mardini</text>
    <text x="0" y="82" fill="${CL.textMuted}" font-size="14">The timeless dawn recitation by Birendra Krishna Bhadra broadcast across Bengal since 1931 on All India Radio.</text>

    <!-- Golden Deity Hero Card (w: 1152, h: 280) -->
    <g transform="translate(0, 108)">
      <rect width="1152" height="280" rx="24" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      
      <g transform="translate(24, 24)">
        <!-- Image of Deity with Diya -->
        <clipPath id="mah_clip"><rect width="232" height="232" rx="16"/></clipPath>
        <image href="${ASSETS.mahalayaArt}" width="232" height="232" preserveAspectRatio="xMidYMid slice" clip-path="url(#mah_clip)"/>
      </g>

      <g transform="translate(284, 36)">
        <!-- Badges -->
        <rect x="0" y="0" width="168" height="24" rx="8" fill="${CL.badgeAuthStreamBg}"/>
        <text x="84" y="16" fill="${CL.badgeAuthStreamText}" font-size="10" font-weight="700" text-anchor="middle">AIR Akashvani Archive (1931)</text>

        <rect x="178" y="0" width="156" height="24" rx="8" fill="${CL.badgeDirectAudioBg}"/>
        <text x="256" y="16" fill="${CL.badgeDirectAudioText}" font-size="10" font-weight="700" text-anchor="middle">Authorized In-Page Stream</text>

        <text x="0" y="60" fill="${CL.textMain}" font-size="26" font-weight="800">Mahishasura Mardini — Birendra Krishna Bhadra</text>
        <text x="0" y="88" fill="${CL.textMuted}" font-size="14">Sacred Sanskrit Chandi Mahatmya, script by Bani Kumar, and musical direction by</text>
        <text x="0" y="108" fill="${CL.textMuted}" font-size="14">Pankaj Kumar Mullick awakening Bengal for over 90 years.</text>

        <!-- Action Buttons -->
        <g transform="translate(0, 136)">
          <rect width="210" height="44" rx="12" fill="${CL.red}"/>
          <text x="24" y="27" fill="${CL.white}" font-size="14">▶</text>
          <text x="44" y="27" fill="${CL.white}" font-size="13" font-weight="700">Play Mahishasura Mardini</text>

          <rect x="222" y="0" width="156" height="44" rx="12" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
          <text x="242" y="27" fill="${CL.textMain}" font-size="13">🎵 Browse Puja Music</text>

          <rect x="390" y="0" width="134" height="44" rx="12" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
          <text x="410" y="27" fill="${CL.textMain}" font-size="13">Archive Source ↗</text>
        </g>
      </g>
    </g>

    <!-- 3 The Creative Legends Cards (y: 416) -->
    <g transform="translate(0, 416)">
      <text x="0" y="22" fill="${CL.textMain}" font-size="18" font-weight="800">✨ The Creative Legends</text>

      <g transform="translate(0, 36)">
        <!-- Legend 1 -->
        <g transform="translate(0, 0)">
          <rect width="368" height="90" rx="16" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="20" y="28" fill="${CL.red}" font-size="10" font-weight="700" letter-spacing="0.5">RECITATION &amp; CHANDI PATH</text>
          <text x="20" y="52" fill="${CL.textMain}" font-size="16" font-weight="800">Birendra Krishna Bhadra</text>
          <text x="20" y="72" fill="${CL.textSubtle}" font-size="12">Iconic resonant sacred invocation</text>
        </g>

        <!-- Legend 2 -->
        <g transform="translate(392, 0)">
          <rect width="368" height="90" rx="16" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="20" y="28" fill="${CL.red}" font-size="10" font-weight="700" letter-spacing="0.5">SCRIPT &amp; CONCEPT</text>
          <text x="20" y="52" fill="${CL.textMain}" font-size="16" font-weight="800">Bani Kumar</text>
          <text x="20" y="72" fill="${CL.textSubtle}" font-size="12">Chandi Mahatmya literary composition</text>
        </g>

        <!-- Legend 3 -->
        <g transform="translate(784, 0)">
          <rect width="368" height="90" rx="16" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="20" y="28" fill="${CL.red}" font-size="10" font-weight="700" letter-spacing="0.5">MUSIC DIRECTION</text>
          <text x="20" y="52" fill="${CL.textMain}" font-size="16" font-weight="800">Pankaj Kumar Mullick</text>
          <text x="20" y="72" fill="${CL.textSubtle}" font-size="12">Timeless orchestral &amp; vocal score</text>
        </g>
      </g>
    </g>

    <!-- About 1931 Broadcast Card (y: 566) -->
    <g transform="translate(0, 566)">
      <rect width="1152" height="120" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 24)">
        <text x="0" y="18" fill="${CL.textMain}" font-size="16" font-weight="800">About the 1931 Sacred Broadcast</text>
        <text x="0" y="44" fill="${CL.textMuted}" font-size="13">First broadcast live at 4:00 AM on the dawn of Mahalaya in 1931 from the 1, Garstin Place studio of All India Radio Kolkata.</text>
        <text x="0" y="66" fill="${CL.textMuted}" font-size="13">Even after nine decades, Bengal awakens at dawn on Mahalaya to the resonant voice of Birendra Krishna Bhadra reciting the Chandi Mahatmya.</text>
      </g>
    </g>
  </g>

  ${renderFooterLight(992)}
</svg>
`;
}

const metroSvg = generateMetroLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '06_web_desktop_metro_light.svg'), metroSvg, 'utf8');
console.log(`✓ Generated 06_web_desktop_metro_light.svg (${(metroSvg.length / 1024).toFixed(1)} KB)`);

const musicSvg = generateMusicLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '07_web_desktop_music_light.svg'), musicSvg, 'utf8');
console.log(`✓ Generated 07_web_desktop_music_light.svg (${(musicSvg.length / 1024).toFixed(1)} KB)`);

const mahSvg = generateMahalayaLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '08_web_desktop_mahalaya_light.svg'), mahSvg, 'utf8');
console.log(`✓ Generated 08_web_desktop_mahalaya_light.svg (${(mahSvg.length / 1024).toFixed(1)} KB)`);
