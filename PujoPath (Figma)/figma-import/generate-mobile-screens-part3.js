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

// 07. MOBILE MUSIC SCREEN (390 x 1650 px)
function generateMobileMusic(isDark = false) {
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
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="700" letter-spacing="1">🎵 SHARODIYA SOUNDSCAPE &amp; HERITAGE</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="24" font-weight="900">Festive Puja Music</text>
    <text x="0" y="70" fill="${t.textMain}" font-size="24" font-weight="900">Traditions</text>
    <text x="0" y="94" fill="${t.textMuted}" font-size="12">Explore Bengal's rich Durga Puja music culture — traditional</text>
    <text x="0" y="110" fill="${t.textMuted}" font-size="12">Dhak beats, Agomoni hymns, and immersion chants.</text>

    <!-- Top Soundscapes / Playlist Toggle (y: 124) -->
    <g transform="translate(0, 124)">
      <rect width="254" height="38" rx="12" fill="${isDark ? '#201b17' : '#f0eae1'}"/>
      <rect x="4" y="4" width="122" height="30" rx="9" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="65" y="23" fill="${t.red}" font-size="12" font-weight="700" text-anchor="middle">All Soundscapes</text>

      <text x="188" y="23" fill="${t.textSubtle}" font-size="12" font-weight="600" text-anchor="middle">🏷 My Playlist (0)</text>
    </g>

    <!-- Mood Card (w: 358, h: 220) -->
    <g transform="translate(0, 174)">
      <rect width="358" height="220" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="18" fill="${t.textMain}" font-size="15" font-weight="800">✨ Choose Your Puja Mood</text>

        <!-- Mood Pills Grid -->
        <!-- Row 1 -->
        <g transform="translate(0, 32)">
          <rect width="82" height="30" rx="10" fill="${t.red}"/>
          <text x="41" y="19" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">All Moods</text>

          <rect x="90" y="0" width="124" height="30" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="152" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Ritual &amp; Devotion</text>
        </g>

        <!-- Row 2 -->
        <g transform="translate(0, 70)">
          <rect width="168" height="30" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="84" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Dhak &amp; Traditional Sounds</text>

          <rect x="176" y="0" width="116" height="30" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="234" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Pandal Hopping</text>
        </g>

        <!-- Row 3 -->
        <g transform="translate(0, 108)">
          <rect width="140" height="30" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="70" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Bengali Festive Music</text>

          <rect x="148" y="0" width="144" height="30" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="220" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Bisarjan &amp; Farewell</text>
        </g>

        <!-- Row 4 -->
        <g transform="translate(0, 146)">
          <rect width="146" height="30" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="73" y="19" fill="${t.textMain}" font-size="11" font-weight="600" text-anchor="middle">Ambient Puja Sounds</text>
        </g>
      </g>
    </g>

    <!-- Search Input -->
    <g transform="translate(0, 408)">
      <rect width="358" height="42" rx="12" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <text x="14" y="26" fill="${t.textFaint}" font-size="14">🔍</text>
      <text x="36" y="26" fill="${t.textFaint}" font-size="13">Search tracks, artists, rhythms...</text>
    </g>

    <!-- Curated Audio Tracks Header -->
    <g transform="translate(0, 466)">
      <text x="0" y="20" fill="${t.textMain}" font-size="16" font-weight="800">Curated Audio Library (22)</text>
      <text x="358" y="20" fill="${t.textSubtle}" font-size="11" text-anchor="end">Verified Licences ↗</text>

      <!-- Track 1: Dhaker Awaj -->
      <g transform="translate(0, 36)">
        <rect width="358" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="40" height="40" rx="10" fill="${t.red}"/>
          <text x="20" y="26" fill="#FFFFFF" font-size="16" text-anchor="middle">▶</text>

          <g transform="translate(52, 2)">
            <text x="0" y="16" fill="${t.textMain}" font-size="14" font-weight="800">Traditional Dhak — Kashi &amp; Kanshi</text>
            <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Gokul Das Dhaki Samiti • Pure Acoustic Dhak</text>
            <text x="0" y="52" fill="${t.red}" font-size="11" font-weight="700">⏱ 04:18 • Traditional Rhythm</text>
          </g>

          <text x="316" y="28" fill="${t.textFaint}" font-size="15" text-anchor="end">♡</text>
        </g>
      </g>

      <!-- Track 2: Dhunuchi Naach Rhythm -->
      <g transform="translate(0, 142)">
        <rect width="358" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="40" height="40" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="20" y="26" fill="${t.textMain}" font-size="16" text-anchor="middle">▶</text>

          <g transform="translate(52, 2)">
            <text x="0" y="16" fill="${t.textMain}" font-size="14" font-weight="800">Dhunuchi Naach Frenzy (Aarti Beat)</text>
            <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Kolkata Rajbari Dhaaki Troupes</text>
            <text x="0" y="52" fill="${t.amberStar}" font-size="11" font-weight="700">⏱ 05:42 • High Energy Aarti</text>
          </g>

          <text x="316" y="28" fill="${t.textFaint}" font-size="15" text-anchor="end">♡</text>
        </g>
      </g>

      <!-- Track 3: Birendra Krishna Bhadra - Chandipath Excerpt -->
      <g transform="translate(0, 248)">
        <rect width="358" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="40" height="40" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="20" y="26" fill="${t.textMain}" font-size="16" text-anchor="middle">▶</text>

          <g transform="translate(52, 2)">
            <text x="0" y="16" fill="${t.textMain}" font-size="14" font-weight="800">Chandipath — Ya Devi Sarvabhuteshu</text>
            <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Birendra Krishna Bhadra • AIR Akashvani</text>
            <text x="0" y="52" fill="${t.blueLine}" font-size="11" font-weight="700">⏱ 06:15 • Sacred Recitation</text>
          </g>

          <text x="316" y="28" fill="${t.textFaint}" font-size="15" text-anchor="end">♡</text>
        </g>
      </g>

      <!-- Track 4: Agomoni Gaan -->
      <g transform="translate(0, 354)">
        <rect width="358" height="96" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="40" height="40" rx="10" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
          <text x="20" y="26" fill="${t.textMain}" font-size="16" text-anchor="middle">▶</text>

          <g transform="translate(52, 2)">
            <text x="0" y="16" fill="${t.textMain}" font-size="14" font-weight="800">Bajlo Tomar Alor Benu</text>
            <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Supriti Ghosh • Pankaj Kumar Mullick</text>
            <text x="0" y="52" fill="${t.greenLine}" font-size="11" font-weight="700">⏱ 03:28 • Classic Agomoni</text>
          </g>

          <text x="316" y="28" fill="${t.textFaint}" font-size="15" text-anchor="end">♡</text>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileFooter(1450, isDark)}
  ${renderMobileBottomNav('More', isDark, H - 64)}
</svg>
`;
}

// 08. MOBILE MAHALAYA SCREEN (390 x 1500 px)
function generateMobileMahalaya(isDark = false) {
  const W = 390;
  const H = 1500;
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderMobileBackground(H, isDark)}
  ${renderMobileHeader(isDark)}

  <g transform="translate(16, 72)">
    <!-- Label & Title -->
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="700" letter-spacing="1">✨ DAWN BROADCAST HERITAGE</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="24" font-weight="900">Mahalaya &amp;</text>
    <text x="0" y="70" fill="${t.textMain}" font-size="24" font-weight="900">Mahishasura Mardini</text>
    <text x="0" y="94" fill="${t.textMuted}" font-size="12">The timeless dawn recitation by Birendra Krishna Bhadra</text>
    <text x="0" y="110" fill="${t.textMuted}" font-size="12">broadcast across Bengal since 1931 on All India Radio.</text>

    <!-- Golden Deity Hero Card (w: 358, h: 440) -->
    <g transform="translate(0, 126)">
      <rect width="358" height="440" rx="22" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      
      <!-- Deity Image Center -->
      <g transform="translate(94, 20)">
        <clipPath id="mah_mob_clip_${isDark ? 'd' : 'l'}"><rect width="170" height="170" rx="20"/></clipPath>
        <image href="${ASSETS.mahalayaArt}" width="170" height="170" preserveAspectRatio="xMidYMid slice" clip-path="url(#mah_mob_clip_${isDark ? 'd' : 'l'})"/>
      </g>

      <!-- Badges -->
      <g transform="translate(0, 206)">
        <rect x="84" y="0" width="190" height="24" rx="8" fill="${t.redPillBg}"/>
        <text x="179" y="16" fill="${t.red}" font-size="10" font-weight="700" text-anchor="middle">AIR Akashvani Archive (1931)</text>

        <rect x="100" y="30" width="158" height="24" rx="8" fill="${isDark ? '#142c1c' : '#dcfce7'}"/>
        <text x="179" y="46" fill="${isDark ? '#4ade80' : '#15803d'}" font-size="10" font-weight="700" text-anchor="middle">✓ Authorized In-Page Stream</text>
      </g>

      <!-- Details -->
      <g transform="translate(20, 276)">
        <text x="159" y="18" fill="${t.textMain}" font-size="17" font-weight="900" text-anchor="middle">Mahishasura Mardini</text>
        <text x="159" y="36" fill="${t.textMain}" font-size="14" font-weight="700" text-anchor="middle">Birendra Krishna Bhadra</text>

        <text x="159" y="58" fill="${t.textSubtle}" font-size="12" text-anchor="middle">Sacred Sanskrit Chandi Mahatmya, script by</text>
        <text x="159" y="74" fill="${t.textSubtle}" font-size="12" text-anchor="middle">Bani Kumar, and music by Pankaj Kumar Mullick.</text>

        <!-- CTAs -->
        <g transform="translate(0, 94)">
          <rect width="318" height="44" rx="12" fill="${t.red}"/>
          <text x="96" y="27" fill="#FFFFFF" font-size="14">▶</text>
          <text x="118" y="27" fill="#FFFFFF" font-size="13" font-weight="700">Play Mahishasura Mardini</text>
        </g>
      </g>
    </g>

    <!-- The Creative Legends (y: 586) -->
    <g transform="translate(0, 586)">
      <text x="0" y="20" fill="${t.textMain}" font-size="16" font-weight="800">✨ The Creative Legends</text>

      <!-- Legend 1: Birendra Krishna Bhadra -->
      <g transform="translate(0, 32)">
        <rect width="358" height="84" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(18, 16)">
          <text x="0" y="14" fill="${t.red}" font-size="10" font-weight="700">RECITATION &amp; CHANDI PATH</text>
          <text x="0" y="36" fill="${t.textMain}" font-size="15" font-weight="800">Birendra Krishna Bhadra</text>
          <text x="0" y="54" fill="${t.textSubtle}" font-size="11">Iconic resonant sacred invocation across 9 decades</text>
        </g>
      </g>

      <!-- Legend 2: Bani Kumar -->
      <g transform="translate(0, 126)">
        <rect width="358" height="84" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(18, 16)">
          <text x="0" y="14" fill="${t.red}" font-size="10" font-weight="700">SCRIPT &amp; CONCEPT</text>
          <text x="0" y="36" fill="${t.textMain}" font-size="15" font-weight="800">Bani Kumar</text>
          <text x="0" y="54" fill="${t.textSubtle}" font-size="11">Chandi Mahatmya lyrical composition</text>
        </g>
      </g>

      <!-- Legend 3: Pankaj Kumar Mullick -->
      <g transform="translate(0, 220)">
        <rect width="358" height="84" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(18, 16)">
          <text x="0" y="14" fill="${t.red}" font-size="10" font-weight="700">MUSIC DIRECTION</text>
          <text x="0" y="36" fill="${t.textMain}" font-size="15" font-weight="800">Pankaj Kumar Mullick</text>
          <text x="0" y="54" fill="${t.textSubtle}" font-size="11">Timeless orchestral &amp; vocal score</text>
        </g>
      </g>

      <!-- About 1931 Broadcast Card -->
      <g transform="translate(0, 314)">
        <rect width="358" height="110" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(18, 18)">
          <text x="0" y="14" fill="${t.textMain}" font-size="14" font-weight="800">About the 1931 Dawn Broadcast</text>
          <text x="0" y="36" fill="${t.textSubtle}" font-size="11">First broadcast live at 4:00 AM on Mahalaya in 1931</text>
          <text x="0" y="52" fill="${t.textSubtle}" font-size="11">from 1, Garstin Place AIR studio Kolkata.</text>
          <text x="0" y="72" fill="${t.red}" font-size="11" font-weight="700">Broadcast every Mahalaya dawn on Akashvani ↗</text>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileFooter(1300, isDark)}
  ${renderMobileBottomNav('More', isDark, H - 64)}
</svg>
`;
}

// 09. MOBILE DEVELOPER SCREEN (390 x 1550 px)
function generateMobileDeveloper(isDark = false) {
  const W = 390;
  const H = 1550;
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderMobileBackground(H, isDark)}
  ${renderMobileHeader(isDark)}

  <g transform="translate(16, 72)">
    <!-- Label & Title -->
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="700" letter-spacing="1">👥 PROJECT CO-CREATORS</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="24" font-weight="900">Meet the Developers</text>
    <text x="0" y="68" fill="${t.textMuted}" font-size="12">PujoPath is a collaborative project co-created by</text>
    <text x="0" y="84" fill="${t.textMuted}" font-size="12">Soumik and Moumita to help people discover Kolkata's</text>
    <text x="0" y="100" fill="${t.textMuted}" font-size="12">Durga Puja pandals and plan their festive experiences.</text>

    <!-- Developer 1: Moumita Burman (UI & Frontend Lead) -->
    <g transform="translate(0, 118)">
      <rect width="358" height="370" rx="22" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <!-- Photo -->
        <clipPath id="moumita_mob_${isDark ? 'd' : 'l'}"><rect width="84" height="84" rx="16"/></clipPath>
        <image href="${ASSETS.moumita}" width="84" height="84" preserveAspectRatio="xMidYMid slice" clip-path="url(#moumita_mob_${isDark ? 'd' : 'l'})"/>
        
        <g transform="translate(98, 8)">
          <rect width="86" height="22" rx="6" fill="${t.redPillBg}"/>
          <text x="43" y="15" fill="${t.red}" font-size="10" font-weight="700" text-anchor="middle">✨ Co-Creator</text>

          <text x="0" y="44" fill="${t.textMain}" font-size="20" font-weight="900">Moumita</text>
          <text x="0" y="62" fill="${t.red}" font-size="12" font-weight="700">UI &amp; Frontend Lead</text>
        </g>

        <!-- Bio -->
        <g transform="translate(0, 100)">
          <text x="0" y="16" fill="${t.textSubtle}" font-size="11">Directs user interface design, frontend architecture,</text>
          <text x="0" y="32" fill="${t.textSubtle}" font-size="11">responsive layouts, user experience, and visual consistency,</text>
          <text x="0" y="48" fill="${t.textSubtle}" font-size="11">alongside curation of Kolkata's historic Bonedi Bari traditions.</text>

          <text x="0" y="78" fill="${t.textSubtle}" font-size="10" font-weight="800" letter-spacing="0.5">KEY RESPONSIBILITIES</text>

          <!-- Pills -->
          <g transform="translate(0, 88)">
            <rect width="134" height="26" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
            <text x="67" y="17" fill="${t.textMain}" font-size="10" font-weight="600" text-anchor="middle">User Interface Design</text>

            <rect x="142" y="0" width="144" height="26" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
            <text x="214" y="17" fill="${t.textMain}" font-size="10" font-weight="600" text-anchor="middle">Frontend Architecture</text>
          </g>

          <g transform="translate(0, 120)">
            <rect width="126" height="26" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
            <text x="63" y="17" fill="${t.textMain}" font-size="10" font-weight="600" text-anchor="middle">Responsive Layouts</text>

            <rect x="134" y="0" width="140" height="26" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
            <text x="204" y="17" fill="${t.textMain}" font-size="10" font-weight="600" text-anchor="middle">Cultural Curation</text>
          </g>

          <line x1="0" y1="162" x2="318" y2="162" stroke="${t.cardBorder}" stroke-width="1"/>

          <!-- LinkedIn button -->
          <g transform="translate(0, 176)">
            <text x="0" y="24" fill="${t.textSubtle}" font-size="12">Professional Profile</text>
            <rect x="212" y="4" width="106" height="34" rx="10" fill="#0a66c2"/>
            <text x="265" y="25" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Developer 2: Soumik Burman (Full Stack & Systems Architect) -->
    <g transform="translate(0, 504)">
      <rect width="358" height="370" rx="22" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <!-- Photo -->
        <clipPath id="soumik_mob_${isDark ? 'd' : 'l'}"><rect width="84" height="84" rx="16"/></clipPath>
        <image href="${ASSETS.soumik}" width="84" height="84" preserveAspectRatio="xMidYMid slice" clip-path="url(#soumik_mob_${isDark ? 'd' : 'l'})"/>
        
        <g transform="translate(98, 8)">
          <rect width="86" height="22" rx="6" fill="${t.redPillBg}"/>
          <text x="43" y="15" fill="${t.red}" font-size="10" font-weight="700" text-anchor="middle">✨ Co-Creator</text>

          <text x="0" y="44" fill="${t.textMain}" font-size="20" font-weight="900">Soumik</text>
          <text x="0" y="62" fill="${t.red}" font-size="12" font-weight="700">Full Stack &amp; Systems</text>
        </g>

        <!-- Bio -->
        <g transform="translate(0, 100)">
          <text x="0" y="16" fill="${t.textSubtle}" font-size="11">Architects full-stack applications, nearest-neighbor routing,</text>
          <text x="0" y="32" fill="${t.textSubtle}" font-size="11">interactive geospatial maps, transit optimization, state</text>
          <text x="0" y="48" fill="${t.textSubtle}" font-size="11">management, and high-performance cross-platform apps.</text>

          <text x="0" y="78" fill="${t.textSubtle}" font-size="10" font-weight="800" letter-spacing="0.5">KEY RESPONSIBILITIES</text>

          <!-- Pills -->
          <g transform="translate(0, 88)">
            <rect width="138" height="26" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
            <text x="69" y="17" fill="${t.textMain}" font-size="10" font-weight="600" text-anchor="middle">Full Stack Architecture</text>

            <rect x="146" y="0" width="136" height="26" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
            <text x="214" y="17" fill="${t.textMain}" font-size="10" font-weight="600" text-anchor="middle">Geospatial Routing</text>
          </g>

          <g transform="translate(0, 120)">
            <rect width="126" height="26" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
            <text x="63" y="17" fill="${t.textMain}" font-size="10" font-weight="600" text-anchor="middle">Data Engineering</text>

            <rect x="134" y="0" width="144" height="26" rx="8" fill="${t.cardInner}" stroke="${t.cardBorder}" stroke-width="1"/>
            <text x="206" y="17" fill="${t.textMain}" font-size="10" font-weight="600" text-anchor="middle">Offline-First Engine</text>
          </g>

          <line x1="0" y1="162" x2="318" y2="162" stroke="${t.cardBorder}" stroke-width="1"/>

          <!-- GitHub & LinkedIn -->
          <g transform="translate(0, 176)">
            <text x="0" y="24" fill="${t.textSubtle}" font-size="12">Professional Profile</text>
            <rect x="212" y="4" width="106" height="34" rx="10" fill="#0a66c2"/>
            <text x="265" y="25" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileFooter(1350, isDark)}
  ${renderMobileBottomNav('More', isDark, H - 64)}
</svg>
`;
}

// Write part 3 screens (Light & Dark)
fs.writeFileSync(path.join(OUT_DIR, '07_web_mobile_music_light.svg'), generateMobileMusic(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '07_web_mobile_music_dark.svg'), generateMobileMusic(true), 'utf8');
console.log('✓ Generated 07_web_mobile_music (Light & Dark)');

fs.writeFileSync(path.join(OUT_DIR, '08_web_mobile_mahalaya_light.svg'), generateMobileMahalaya(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '08_web_mobile_mahalaya_dark.svg'), generateMobileMahalaya(true), 'utf8');
console.log('✓ Generated 08_web_mobile_mahalaya (Light & Dark)');

fs.writeFileSync(path.join(OUT_DIR, '09_web_mobile_developer_light.svg'), generateMobileDeveloper(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '09_web_mobile_developer_dark.svg'), generateMobileDeveloper(true), 'utf8');
console.log('✓ Generated 09_web_mobile_developer (Light & Dark)');
