const fs = require('fs');
const path = require('path');

const FIGMA_DIR = path.resolve(__dirname, '..');
const EXPORTS_DIR = path.join(FIGMA_DIR, 'exports');

// Color constants
const RED = '#b42323';
const RED_HOVER = '#971e1e';
const RED_SOFT = '#fdeeee';
const BG_CREAM = '#FCFAF7';
const BG_WHITE = '#FFFFFF';
const BG_SURFACE = '#F5F1EB';
const TEXT_MAIN = '#242424';
const TEXT_SEC = '#5C524A';
const TEXT_MUTED = '#7E7268';
const BORDER = '#E8E1D9';
const BORDER_LIGHT = '#F0EAE2';
const LINKEDIN_BLUE = '#0a66c2';

// -------------------------------------------------------------
// 1. Web Desktop Home (1440 x 2400)
// -------------------------------------------------------------
function generateWebDesktopHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="2400" viewBox="0 0 1440 2400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      text { font-family: 'Inter', system-ui, sans-serif; }
      .title { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
      .bengali { font-family: 'Hind Siliguri', 'Inter', sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1440" height="2400" fill="${BG_CREAM}"/>

  <!-- TOP HEADER (Desktop: 68px) -->
  <g id="Header_Desktop">
    <rect width="1440" height="68" fill="${BG_WHITE}"/>
    <line x1="0" y1="68" x2="1440" y2="68" stroke="${BORDER}" stroke-width="1"/>

    <!-- Brand -->
    <g transform="translate(80, 16)">
      <rect width="36" height="36" rx="10" fill="${RED}"/>
      <text x="18" y="24" fill="#FFFFFF" font-size="18" font-weight="800" text-anchor="middle">P</text>
      <text x="48" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">PujoPath</text>
      <text x="48" y="32" fill="${TEXT_MUTED}" font-size="11" font-weight="500">Discover. Plan. Experience.</text>
    </g>

    <!-- Nav Links -->
    <g transform="translate(420, 24)">
      <rect x="-12" y="-4" width="76" height="32" rx="16" fill="${RED_SOFT}"/>
      <text x="26" y="17" fill="${RED}" font-size="14" font-weight="700" text-anchor="middle">Explore</text>
      <text x="110" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Planner</text>
      <text x="190" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Map</text>
      <text x="260" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Calendar</text>
      <text x="350" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Metro</text>
      <text x="430" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Music</text>
    </g>

    <!-- Controls -->
    <g transform="translate(1080, 16)">
      <!-- Install App Button (Desktop Website) -->
      <g id="Install_App_Button">
        <rect width="160" height="36" rx="12" fill="${RED}"/>
        <path d="M18 18 L18 23 M15 20 L18 23 L21 20 M18 13 L18 20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <text x="76" y="23" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Install App (APK)</text>
      </g>
      <!-- Theme Switch -->
      <rect x="172" width="36" height="36" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="190" y="23" font-size="14" text-anchor="middle">☀️</text>
      <!-- Lang Switch -->
      <rect x="218" width="46" height="36" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="241" y="23" fill="${RED}" font-size="13" font-weight="700" text-anchor="middle" class="bengali">বাংলা</text>
    </g>
  </g>

  <!-- HERO SECTION -->
  <g id="Hero_Section" transform="translate(80, 110)">
    <rect width="1280" height="380" rx="28" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    
    <g transform="translate(640, 60)" text-anchor="middle">
      <!-- Countdown Pill -->
      <rect x="-140" y="0" width="280" height="32" rx="16" fill="${RED_SOFT}"/>
      <text x="0" y="21" fill="${RED}" font-size="12" font-weight="700">🌸 শরতের আগমনী • 172 Days to Pujo</text>

      <!-- Headline -->
      <text x="0" y="80" fill="${TEXT_MAIN}" font-size="44" font-weight="800" class="title">Your Puja, made simple.</text>
      <text x="0" y="120" fill="${TEXT_SEC}" font-size="17" font-weight="400">Find the pandals you love, build an optimized walking route, and head out with complete confidence.</text>

      <!-- Action Buttons -->
      <g transform="translate(-160, 160)">
        <rect width="150" height="48" rx="14" fill="${RED}"/>
        <text x="75" y="30" fill="#FFFFFF" font-size="15" font-weight="700">Find Pandals</text>

        <rect x="170" width="150" height="48" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="245" y="30" fill="${TEXT_MAIN}" font-size="15" font-weight="600">Build a Route</text>
      </g>
    </g>
  </g>

  <!-- QUICK ACCESS GUIDES (4 CARDS) -->
  <g id="Quick_Access_Section" transform="translate(80, 530)">
    <text x="0" y="0" fill="${TEXT_MAIN}" font-size="24" font-weight="800" class="title">Quick Access Guides</text>
    
    <g transform="translate(0, 24)">
      <!-- Card 1 -->
      <rect x="0" width="298" height="150" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="24" y="44" font-size="28">🗺️</text>
      <text x="24" y="80" fill="${TEXT_MAIN}" font-size="18" font-weight="700">Interactive Map</text>
      <text x="24" y="106" fill="${TEXT_MUTED}" font-size="13">774 pandals mapped across 8 zones in Kolkata</text>

      <!-- Card 2 -->
      <rect x="327" width="298" height="150" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="351" y="44" font-size="28">🔀</text>
      <text x="351" y="80" fill="${TEXT_MAIN}" font-size="18" font-weight="700">Route Planner</text>
      <text x="351" y="106" fill="${TEXT_MUTED}" font-size="13">Smart clustering algorithms &amp; distance savings</text>

      <!-- Card 3 -->
      <rect x="654" width="298" height="150" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="678" y="44" font-size="28">🚇</text>
      <text x="678" y="80" fill="${TEXT_MAIN}" font-size="18" font-weight="700">Metro Guide</text>
      <text x="678" y="106" fill="${TEXT_MUTED}" font-size="13">Normal timetables &amp; 2026 Puja overnight schedules</text>

      <!-- Card 4 -->
      <rect x="981" width="298" height="150" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="1005" y="44" font-size="28">📅</text>
      <text x="1005" y="80" fill="${TEXT_MAIN}" font-size="18" font-weight="700">Sacred Calendar</text>
      <text x="1005" y="106" fill="${TEXT_MUTED}" font-size="13">1433 Bengali schedule &amp; Sandhi Puja timings</text>
    </g>
  </g>

  <!-- CURATED PANDALS SECTION -->
  <g id="Curated_Pandals_Section" transform="translate(80, 750)">
    <text x="0" y="0" fill="${TEXT_MAIN}" font-size="24" font-weight="800" class="title">Featured Puja Pandals</text>

    <g transform="translate(0, 24)">
      <!-- Pandal 1: Bagbazar -->
      <g transform="translate(0, 0)">
        <rect width="406" height="340" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <rect width="406" height="180" rx="20" fill="#a82323"/>
        <text x="203" y="100" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">Bagbazar Sarbojanin Photo</text>
        <rect x="20" y="200" width="110" height="24" rx="12" fill="${RED_SOFT}"/>
        <text x="75" y="216" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">North Kolkata</text>
        <text x="20" y="250" fill="${TEXT_MAIN}" font-size="19" font-weight="800">Bagbazar Sarbojanin</text>
        <text x="20" y="272" fill="${TEXT_MUTED}" font-size="14" class="bengali">বাগবাজার সর্বজনীন দুর্গোৎসব</text>
        <text x="20" y="305" fill="${TEXT_SEC}" font-size="13">🚇 Shyambazar • 🚶 500m • 👥 High Crowd</text>
      </g>

      <!-- Pandal 2: Kumartuli Park -->
      <g transform="translate(436, 0)">
        <rect width="406" height="340" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <rect width="406" height="180" rx="20" fill="#b45309"/>
        <text x="203" y="100" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">Kumartuli Park Photo</text>
        <rect x="20" y="200" width="110" height="24" rx="12" fill="${RED_SOFT}"/>
        <text x="75" y="216" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">North Kolkata</text>
        <text x="20" y="250" fill="${TEXT_MAIN}" font-size="19" font-weight="800">Kumartuli Park</text>
        <text x="20" y="272" fill="${TEXT_MUTED}" font-size="14" class="bengali">কুমারটুলি পার্ক সার্বজনীন</text>
        <text x="20" y="305" fill="${TEXT_SEC}" font-size="13">🚇 Sovabazar • 🚶 650m • 👥 Very High</text>
      </g>

      <!-- Pandal 3: Sovabazar Rajbari -->
      <g transform="translate(872, 0)">
        <rect width="406" height="340" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <rect width="406" height="180" rx="20" fill="#991b1b"/>
        <text x="203" y="100" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">Sovabazar Rajbari Photo</text>
        <rect x="20" y="200" width="100" height="24" rx="12" fill="${RED_SOFT}"/>
        <text x="70" y="216" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">Bonedi Bari</text>
        <text x="20" y="250" fill="${TEXT_MAIN}" font-size="19" font-weight="800">Sovabazar Rajbari</text>
        <text x="20" y="272" fill="${TEXT_MUTED}" font-size="14" class="bengali">শোভাবাজার রাজবাড়ি</text>
        <text x="20" y="305" fill="${TEXT_SEC}" font-size="13">🚇 Sovabazar • 🚶 400m • 👥 Heritage</text>
      </g>
    </g>
  </g>

  <!-- FOOTER -->
  <g id="Footer" transform="translate(0, 2200)">
    <rect width="1440" height="200" fill="${BG_SURFACE}"/>
    <line x1="0" y1="0" x2="1440" y2="0" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(80, 50)">
      <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">PujoPath — Discover. Plan. Experience Pujo.</text>
      <text x="0" y="44" fill="${TEXT_MUTED}" font-size="14">Digital companion for Durga Puja 2026. Made with heart in Bengal.</text>
      <text x="0" y="80" fill="${RED}" font-size="13" font-weight="600">Crafted by Soumik &amp; Moumita</text>
      <text x="210" y="80" fill="${TEXT_MUTED}" font-size="13">• © 2026 PujoPath. Open Data Initiative.</text>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// 2. Web Desktop Developer Page (Strict Verification: Moumita 1st, Soumik 2nd)
// -------------------------------------------------------------
function generateWebDesktopDeveloper() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1500" viewBox="0 0 1440 1500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      text { font-family: 'Inter', system-ui, sans-serif; }
      .title { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
      .bengali { font-family: 'Hind Siliguri', 'Inter', sans-serif; }
    </style>
  </defs>

  <rect width="1440" height="1500" fill="${BG_CREAM}"/>

  <!-- Desktop Header -->
  <g id="Header_Desktop">
    <rect width="1440" height="68" fill="${BG_WHITE}"/>
    <line x1="0" y1="68" x2="1440" y2="68" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(80, 16)">
      <rect width="36" height="36" rx="10" fill="${RED}"/>
      <text x="18" y="24" fill="#FFFFFF" font-size="18" font-weight="800" text-anchor="middle">P</text>
      <text x="48" y="24" fill="${TEXT_MAIN}" font-size="18" font-weight="800">PujoPath</text>
    </g>
    <g transform="translate(420, 24)">
      <text x="0" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Explore</text>
      <text x="80" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Planner</text>
      <text x="160" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Map</text>
      <text x="230" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Calendar</text>
      <text x="320" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Metro</text>
      <text x="400" y="17" fill="${TEXT_SEC}" font-size="14" font-weight="600">Music</text>
    </g>
    <g transform="translate(1080, 16)">
      <rect width="160" height="36" rx="12" fill="${RED}"/>
      <text x="80" y="23" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Install App (APK)</text>
    </g>
  </g>

  <!-- Main Content -->
  <g id="Developer_Content" transform="translate(80, 120)">
    <!-- Header Title -->
    <rect width="170" height="28" rx="14" fill="${RED_SOFT}"/>
    <text x="85" y="19" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">👥 PROJECT CO-CREATORS</text>
    <text x="0" y="75" fill="${TEXT_MAIN}" font-size="38" font-weight="800" class="title">Meet the Developers</text>
    <text x="0" y="108" fill="${TEXT_SEC}" font-size="16" font-weight="400">PujoPath is a collaborative project co-created by Soumik and Moumita to help people discover Kolkata's Durga Puja pandals and plan their festive experiences.</text>

    <!-- DEVELOPER CARDS: MOUMITA FIRST (CARD 1 - LEFT), SOUMIK SECOND (CARD 2 - RIGHT) -->
    <g transform="translate(0, 140)">
      
      <!-- ============================================== -->
      <!-- CARD 1: MOUMITA — UI & FRONTEND LEAD (LEFT)   -->
      <!-- ============================================== -->
      <g id="Card_1_Moumita" transform="translate(0, 0)">
        <rect width="624" height="640" rx="24" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

        <!-- Avatar & Name Row -->
        <g transform="translate(32, 32)">
          <rect width="96" height="96" rx="20" fill="#c93b3b" stroke="${RED}" stroke-width="2"/>
          <text x="48" y="58" fill="#FFFFFF" font-size="36" font-weight="800" text-anchor="middle">M</text>
          <!-- Badge on Avatar -->
          <circle cx="86" cy="86" r="14" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
          <text x="86" y="90" font-size="12" text-anchor="middle">📐</text>

          <g transform="translate(120, 10)">
            <rect width="105" height="24" rx="12" fill="${RED_SOFT}"/>
            <text x="52" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">✨ Co-Creator</text>
            <text x="0" y="48" fill="${TEXT_MAIN}" font-size="26" font-weight="800" class="title">Moumita</text>
            <text x="0" y="70" fill="${RED}" font-size="14" font-weight="700">UI &amp; Frontend Lead</text>
          </g>
        </g>

        <!-- Description -->
        <text x="32" y="168" fill="${TEXT_SEC}" font-size="14" width="560">
          <tspan x="32" dy="0">Directs user interface design, frontend architecture, responsive layouts, user experience,</tspan>
          <tspan x="32" dy="22">visual consistency, and interaction design, alongside research and curation of Kolkata's</tspan>
          <tspan x="32" dy="22">historic Bonedi Bari traditions and cultural festival narratives.</tspan>
        </text>

        <!-- Key Responsibilities -->
        <g transform="translate(32, 260)">
          <text x="0" y="0" fill="${TEXT_MUTED}" font-size="11" font-weight="800" letter-spacing="1">KEY RESPONSIBILITIES</text>
          <g transform="translate(0, 14)">
            <!-- Chip 1 -->
            <rect x="0" y="0" width="150" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="75" y="18" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">User Interface Design</text>
            <!-- Chip 2 -->
            <rect x="160" y="0" width="165" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="242" y="18" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Frontend Architecture</text>
            <!-- Chip 3 -->
            <rect x="335" y="0" width="145" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="407" y="18" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Responsive Layouts</text>
            <!-- Chip 4 -->
            <rect x="0" y="36" width="160" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="80" y="54" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">User Experience (UX)</text>
            <!-- Chip 5 -->
            <rect x="170" y="36" width="140" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="240" y="54" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Visual Consistency</text>
            <!-- Chip 6 -->
            <rect x="320" y="36" width="130" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="385" y="54" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Cultural Curation</text>
            <!-- Chip 7 -->
            <rect x="0" y="72" width="190" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="95" y="90" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Frontend Interaction Design</text>
          </g>
        </g>

        <!-- Professional Profile / LinkedIn Action -->
        <g transform="translate(32, 560)">
          <line x1="0" y1="0" x2="560" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="0" y="34" fill="${TEXT_MUTED}" font-size="13">Professional Profile</text>
          <g transform="translate(440, 16)">
            <rect width="120" height="36" rx="10" fill="${LINKEDIN_BLUE}"/>
            <text x="60" y="23" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>

      <!-- ============================================== -->
      <!-- CARD 2: SOUMIK — BACKEND & SYSTEMS LEAD (RIGHT) -->
      <!-- ============================================== -->
      <g id="Card_2_Soumik" transform="translate(656, 0)">
        <rect width="624" height="640" rx="24" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

        <!-- Avatar & Name Row -->
        <g transform="translate(32, 32)">
          <rect width="96" height="96" rx="20" fill="#b42323" stroke="${RED}" stroke-width="2"/>
          <text x="48" y="58" fill="#FFFFFF" font-size="36" font-weight="800" text-anchor="middle">S</text>
          <circle cx="86" cy="86" r="14" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
          <text x="86" y="90" font-size="12" text-anchor="middle">💻</text>

          <g transform="translate(120, 10)">
            <rect width="105" height="24" rx="12" fill="${RED_SOFT}"/>
            <text x="52" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">✨ Co-Creator</text>
            <text x="0" y="48" fill="${TEXT_MAIN}" font-size="26" font-weight="800" class="title">Soumik</text>
            <text x="0" y="70" fill="${RED}" font-size="14" font-weight="700">Backend &amp; Systems Lead</text>
          </g>
        </g>

        <!-- Description -->
        <text x="32" y="168" fill="${TEXT_SEC}" font-size="14" width="560">
          <tspan x="32" dy="0">Directs backend &amp; systems architecture, core application logic, route optimization</tspan>
          <tspan x="32" dy="22">algorithms, offline-first transit functionality, backend integrations, and platform</tspan>
          <tspan x="32" dy="22">performance &amp; reliability.</tspan>
        </text>

        <!-- Key Responsibilities -->
        <g transform="translate(32, 260)">
          <text x="0" y="0" fill="${TEXT_MUTED}" font-size="11" font-weight="800" letter-spacing="1">KEY RESPONSIBILITIES</text>
          <g transform="translate(0, 14)">
            <!-- Chip 1 -->
            <rect x="0" y="0" width="160" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="80" y="18" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Backend Architecture</text>
            <!-- Chip 2 -->
            <rect x="170" y="0" width="170" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="255" y="18" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Core Application Logic</text>
            <!-- Chip 3 -->
            <rect x="350" y="0" width="150" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="425" y="18" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">System Architecture</text>
            <!-- Chip 4 -->
            <rect x="0" y="36" width="210" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="105" y="54" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Route Optimization Algorithms</text>
            <!-- Chip 5 -->
            <rect x="220" y="36" width="145" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="292" y="54" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Offline-First Transit</text>
            <!-- Chip 6 -->
            <rect x="375" y="36" width="155" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="452" y="54" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Backend Integrations</text>
            <!-- Chip 7 -->
            <rect x="0" y="72" width="175" height="28" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="87" y="90" fill="#554b44" font-size="11" font-weight="600" text-anchor="middle">Performance &amp; Reliability</text>
          </g>
        </g>

        <!-- Professional Profile / LinkedIn Action -->
        <g transform="translate(32, 560)">
          <line x1="0" y1="0" x2="560" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="0" y="34" fill="${TEXT_MUTED}" font-size="13">Professional Profile</text>
          <g transform="translate(440, 16)">
            <rect width="120" height="36" rx="10" fill="${LINKEDIN_BLUE}"/>
            <text x="60" y="23" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  <!-- Footer -->
  <g id="Footer" transform="translate(0, 1300)">
    <rect width="1440" height="200" fill="${BG_SURFACE}"/>
    <line x1="0" y1="0" x2="1440" y2="0" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(80, 50)">
      <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">PujoPath — Discover. Plan. Experience Pujo.</text>
      <text x="0" y="44" fill="${TEXT_MUTED}" font-size="14">Digital companion for Durga Puja 2026. Made with heart in Bengal.</text>
      <text x="0" y="80" fill="${RED}" font-size="13" font-weight="600">Crafted by Soumik &amp; Moumita</text>
      <text x="210" y="80" fill="${TEXT_MUTED}" font-size="13">• © 2026 PujoPath. Open Data Initiative.</text>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// 3. Web Mobile Home (390 x 2000)
// -------------------------------------------------------------
function generateWebMobileHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="2000" viewBox="0 0 390 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      text { font-family: 'Inter', system-ui, sans-serif; }
      .title { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
      .bengali { font-family: 'Hind Siliguri', 'Inter', sans-serif; }
    </style>
  </defs>

  <rect width="390" height="2000" fill="${BG_CREAM}"/>

  <!-- Mobile Top Header (56px) -->
  <g id="Header_Mobile">
    <rect width="390" height="56" fill="${BG_WHITE}"/>
    <line x1="0" y1="56" x2="390" y2="56" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(16, 12)">
      <rect width="32" height="32" rx="8" fill="${RED}"/>
      <text x="16" y="21" fill="#FFFFFF" font-size="15" font-weight="800" text-anchor="middle">P</text>
      <text x="40" y="22" fill="${TEXT_MAIN}" font-size="16" font-weight="800">PujoPath</text>
    </g>
    <!-- Right Mobile Controls -->
    <g transform="translate(250, 12)">
      <!-- Compact Install Button -->
      <rect width="50" height="32" rx="8" fill="${RED}"/>
      <text x="25" y="20" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">App</text>
      <!-- Lang Toggle -->
      <rect x="58" width="34" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="75" y="20" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle" class="bengali">বাং</text>
    </g>
  </g>

  <!-- Mobile Hero -->
  <g id="Hero_Mobile" transform="translate(16, 76)">
    <rect width="358" height="240" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(20, 24)">
      <rect width="140" height="24" rx="12" fill="${RED_SOFT}"/>
      <text x="70" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">🌸 172 Days to Pujo</text>
      <text x="0" y="60" fill="${TEXT_MAIN}" font-size="24" font-weight="800" class="title">Your Puja, made simple.</text>
      <text x="0" y="86" fill="${TEXT_SEC}" font-size="13">Find pandals, build an optimized route, and explore Kolkata.</text>

      <!-- Buttons -->
      <g transform="translate(0, 120)">
        <rect width="150" height="40" rx="10" fill="${RED}"/>
        <text x="75" y="25" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Find Pandals</text>

        <rect x="160" width="150" height="40" rx="10" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="235" y="25" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Build Route</text>
      </g>
    </g>
  </g>

  <!-- Mobile Quick Access List -->
  <g id="Quick_Access_Mobile" transform="translate(16, 340)">
    <text x="0" y="0" fill="${TEXT_MAIN}" font-size="18" font-weight="800" class="title">Quick Access</text>
    <g transform="translate(0, 14)">
      <rect width="358" height="64" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="16" y="40" font-size="22">🗺️</text>
      <text x="54" y="32" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Interactive Map</text>
      <text x="54" y="48" fill="${TEXT_MUTED}" font-size="12">774 pandals mapped across 8 zones</text>

      <rect y="74" width="358" height="64" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="16" y="114" font-size="22">🔀</text>
      <text x="54" y="106" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Route Planner</text>
      <text x="54" y="122" fill="${TEXT_MUTED}" font-size="12">Clustering algorithms &amp; distance savings</text>

      <rect y="148" width="358" height="64" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="16" y="188" font-size="22">🚇</text>
      <text x="54" y="180" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Metro Guide</text>
      <text x="54" y="196" fill="${TEXT_MUTED}" font-size="12">Overnight Puja special timetables</text>

      <rect y="222" width="358" height="64" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="16" y="262" font-size="22">📅</text>
      <text x="54" y="254" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Sacred Calendar</text>
      <text x="54" y="270" fill="${TEXT_MUTED}" font-size="12">1433 Bengali schedule &amp; Sandhi Puja</text>
    </g>
  </g>

  <!-- Mobile Pandal Card -->
  <g id="Featured_Pandal_Mobile" transform="translate(16, 680)">
    <text x="0" y="0" fill="${TEXT_MAIN}" font-size="18" font-weight="800" class="title">Featured Pandal</text>
    <g transform="translate(0, 14)">
      <rect width="358" height="300" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <rect width="358" height="150" rx="18" fill="#a82323"/>
      <text x="179" y="80" fill="#FFFFFF" font-size="15" font-weight="700" text-anchor="middle">Bagbazar Sarbojanin Photo</text>
      <g transform="translate(16, 170)">
        <rect width="90" height="22" rx="11" fill="${RED_SOFT}"/>
        <text x="45" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
        <text x="0" y="44" fill="${TEXT_MAIN}" font-size="17" font-weight="800">Bagbazar Sarbojanin</text>
        <text x="0" y="64" fill="${TEXT_MUTED}" font-size="13" class="bengali">বাগবাজার সর্বজনীন দুর্গোৎসব</text>
        <text x="0" y="92" fill="${TEXT_SEC}" font-size="12">🚇 Shyambazar • 🚶 500m • 👥 High Crowd</text>
      </g>
    </g>
  </g>

  <!-- Mobile Footer -->
  <g id="Footer_Mobile" transform="translate(0, 1780)">
    <rect width="390" height="156" fill="${BG_SURFACE}"/>
    <line x1="0" y1="0" x2="390" y2="0" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(16, 24)">
      <text x="0" y="18" fill="${TEXT_MAIN}" font-size="15" font-weight="800">PujoPath</text>
      <text x="0" y="38" fill="${TEXT_MUTED}" font-size="12">Digital companion for Durga Puja 2026.</text>
      <text x="0" y="68" fill="${RED}" font-size="12" font-weight="600">Crafted by Soumik &amp; Moumita</text>
    </g>
  </g>

  <!-- Fixed Mobile Bottom Navigation (64px) -->
  <g id="Mobile_Bottom_Nav" transform="translate(0, 1936)">
    <rect width="390" height="64" fill="${BG_WHITE}"/>
    <line x1="0" y1="0" x2="390" y2="0" stroke="${BORDER}" stroke-width="1"/>
    <!-- Tabs -->
    <g transform="translate(39, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">🏠</text>
      <text x="0" y="32" fill="${RED}" font-size="10" font-weight="700">Home</text>
    </g>
    <g transform="translate(117, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">🧭</text>
      <text x="0" y="32" fill="${TEXT_MUTED}" font-size="10" font-weight="500">Explore</text>
    </g>
    <g transform="translate(195, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">🗺️</text>
      <text x="0" y="32" fill="${TEXT_MUTED}" font-size="10" font-weight="500">Map</text>
    </g>
    <g transform="translate(273, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">🔀</text>
      <text x="0" y="32" fill="${TEXT_MUTED}" font-size="10" font-weight="500">Planner</text>
    </g>
    <g transform="translate(351, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">⋯</text>
      <text x="0" y="32" fill="${TEXT_MUTED}" font-size="10" font-weight="500">More</text>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// 4. Capacitor Android Mobile Developer (412 x 1850)
// (Strict Requirement: Moumita 1st, Soumik 2nd, Android Status Bar, No Install App)
// -------------------------------------------------------------
function generateCapacitorAndroidDeveloper() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1850" viewBox="0 0 412 1850" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      text { font-family: 'Inter', system-ui, sans-serif; }
      .title { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
      .bengali { font-family: 'Hind Siliguri', 'Inter', sans-serif; }
    </style>
  </defs>

  <rect width="412" height="1850" fill="${BG_CREAM}"/>

  <!-- ANDROID SYSTEM STATUS BAR (40px) -->
  <g id="Android_Status_Bar">
    <rect width="412" height="40" fill="${BG_CREAM}"/>
    <text x="20" y="26" fill="${TEXT_MAIN}" font-size="14" font-weight="600">9:34</text>
    <g transform="translate(330, 14)">
      <text x="0" y="12" fill="${TEXT_MAIN}" font-size="12" font-weight="700">5G</text>
      <text x="22" y="12" fill="${TEXT_MAIN}" font-size="12">📶</text>
      <text x="44" y="12" fill="${TEXT_MAIN}" font-size="12">🔋</text>
    </g>
  </g>

  <!-- ANDROID HEADER (56px) - Note: NO Install App button! -->
  <g id="Header_Android" transform="translate(0, 40)">
    <rect width="412" height="56" fill="${BG_WHITE}"/>
    <line x1="0" y1="56" x2="412" y2="56" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(16, 12)">
      <rect width="32" height="32" rx="8" fill="${RED}"/>
      <text x="16" y="21" fill="#FFFFFF" font-size="15" font-weight="800" text-anchor="middle">P</text>
      <text x="40" y="22" fill="${TEXT_MAIN}" font-size="17" font-weight="800">PujoPath</text>
    </g>
    <!-- Right Controls: Theme & Lang (No Install Button in APK!) -->
    <g transform="translate(310, 12)">
      <rect width="34" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="17" y="20" font-size="13" text-anchor="middle">🌙</text>
      <rect x="42" width="44" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="64" y="20" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle" class="bengali">বাংলা</text>
    </g>
  </g>

  <!-- CONTENT -->
  <g id="Developer_Content_Android" transform="translate(16, 116)">
    <rect width="170" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="85" y="17" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">👥 PROJECT CO-CREATORS</text>
    <text x="0" y="60" fill="${TEXT_MAIN}" font-size="28" font-weight="800" class="title">Meet the Developers</text>
    <text x="0" y="86" fill="${TEXT_SEC}" font-size="13">PujoPath is a collaborative project co-created by Soumik and Moumita to help people discover Kolkata's Durga Puja pandals.</text>

    <!-- STACKED DEVELOPER CARDS: MOUMITA FIRST, SOUMIK SECOND -->
    <g transform="translate(0, 130)">

      <!-- ============================================== -->
      <!-- CARD 1: MOUMITA — UI & FRONTEND LEAD (FIRST)   -->
      <!-- ============================================== -->
      <g id="Card_1_Moumita_Android" transform="translate(0, 0)">
        <rect width="380" height="710" rx="22" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

        <!-- Avatar & Titles -->
        <g transform="translate(20, 20)">
          <rect width="80" height="80" rx="16" fill="#c93b3b" stroke="${RED}" stroke-width="2"/>
          <text x="40" y="50" fill="#FFFFFF" font-size="30" font-weight="800" text-anchor="middle">M</text>
          <circle cx="72" cy="72" r="12" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
          <text x="72" y="76" font-size="10" text-anchor="middle">📐</text>

          <g transform="translate(96, 6)">
            <rect width="95" height="22" rx="11" fill="${RED_SOFT}"/>
            <text x="47" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">✨ Co-Creator</text>
            <text x="0" y="44" fill="${TEXT_MAIN}" font-size="22" font-weight="800" class="title">Moumita</text>
            <text x="0" y="64" fill="${RED}" font-size="13" font-weight="700">UI &amp; Frontend Lead</text>
          </g>
        </g>

        <!-- Description -->
        <text x="20" y="130" fill="${TEXT_SEC}" font-size="13">
          <tspan x="20" dy="0">Directs user interface design, frontend architecture,</tspan>
          <tspan x="20" dy="20">responsive layouts, user experience, visual consistency,</tspan>
          <tspan x="20" dy="20">and interaction design, alongside research and curation</tspan>
          <tspan x="20" dy="20">of Kolkata's historic Bonedi Bari traditions and</tspan>
          <tspan x="20" dy="20">cultural festival narratives.</tspan>
        </text>

        <!-- Responsibilities -->
        <g transform="translate(20, 255)">
          <text x="0" y="0" fill="${TEXT_MUTED}" font-size="10" font-weight="800" letter-spacing="1">KEY RESPONSIBILITIES</text>
          <g transform="translate(0, 12)">
            <rect x="0" y="0" width="140" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="70" y="17" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">User Interface Design</text>

            <rect x="148" y="0" width="150" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="223" y="17" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Frontend Architecture</text>

            <rect x="0" y="32" width="135" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="67" y="49" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Responsive Layouts</text>

            <rect x="143" y="32" width="150" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="218" y="49" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">User Experience (UX)</text>

            <rect x="0" y="64" width="130" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="65" y="81" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Visual Consistency</text>

            <rect x="138" y="64" width="120" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="198" y="81" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Cultural Curation</text>

            <rect x="0" y="96" width="180" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="90" y="113" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Frontend Interaction Design</text>
          </g>
        </g>

        <!-- LinkedIn Action -->
        <g transform="translate(20, 640)">
          <line x1="0" y1="0" x2="340" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="0" y="32" fill="${TEXT_MUTED}" font-size="12">Professional Profile</text>
          <g transform="translate(230, 16)">
            <rect width="110" height="32" rx="8" fill="${LINKEDIN_BLUE}"/>
            <text x="55" y="21" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>

      <!-- ============================================== -->
      <!-- CARD 2: SOUMIK — BACKEND & SYSTEMS LEAD (SECOND) -->
      <!-- ============================================== -->
      <g id="Card_2_Soumik_Android" transform="translate(0, 730)">
        <rect width="380" height="710" rx="22" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

        <!-- Avatar & Titles -->
        <g transform="translate(20, 20)">
          <rect width="80" height="80" rx="16" fill="#b42323" stroke="${RED}" stroke-width="2"/>
          <text x="40" y="50" fill="#FFFFFF" font-size="30" font-weight="800" text-anchor="middle">S</text>
          <circle cx="72" cy="72" r="12" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
          <text x="72" y="76" font-size="10" text-anchor="middle">💻</text>

          <g transform="translate(96, 6)">
            <rect width="95" height="22" rx="11" fill="${RED_SOFT}"/>
            <text x="47" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">✨ Co-Creator</text>
            <text x="0" y="44" fill="${TEXT_MAIN}" font-size="22" font-weight="800" class="title">Soumik</text>
            <text x="0" y="64" fill="${RED}" font-size="13" font-weight="700">Backend &amp; Systems Lead</text>
          </g>
        </g>

        <!-- Description -->
        <text x="20" y="130" fill="${TEXT_SEC}" font-size="13">
          <tspan x="20" dy="0">Directs backend &amp; systems architecture, core application</tspan>
          <tspan x="20" dy="20">logic, route optimization algorithms, offline-first transit</tspan>
          <tspan x="20" dy="20">functionality, backend integrations, and platform</tspan>
          <tspan x="20" dy="20">performance &amp; reliability.</tspan>
        </text>

        <!-- Responsibilities -->
        <g transform="translate(20, 245)">
          <text x="0" y="0" fill="${TEXT_MUTED}" font-size="10" font-weight="800" letter-spacing="1">KEY RESPONSIBILITIES</text>
          <g transform="translate(0, 12)">
            <rect x="0" y="0" width="145" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="72" y="17" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Backend Architecture</text>

            <rect x="153" y="0" width="155" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="230" y="17" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Core Application Logic</text>

            <rect x="0" y="32" width="140" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="70" y="49" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">System Architecture</text>

            <rect x="148" y="32" width="180" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="238" y="49" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Route Optimization Algorithms</text>

            <rect x="0" y="64" width="130" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="65" y="81" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Offline-First Transit</text>

            <rect x="138" y="64" width="140" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="208" y="81" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Backend Integrations</text>

            <rect x="0" y="96" width="165" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="82" y="113" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Performance &amp; Reliability</text>
          </g>
        </g>

        <!-- LinkedIn Action -->
        <g transform="translate(20, 640)">
          <line x1="0" y1="0" x2="340" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="0" y="32" fill="${TEXT_MUTED}" font-size="12">Professional Profile</text>
          <g transform="translate(230, 16)">
            <rect width="110" height="32" rx="8" fill="${LINKEDIN_BLUE}"/>
            <text x="55" y="21" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  <!-- Mobile Bottom Nav (64px) + System Gesture Area (24px) -->
  <g id="Capacitor_Bottom_Nav" transform="translate(0, 1762)">
    <rect width="412" height="64" fill="${BG_WHITE}"/>
    <line x1="0" y1="0" x2="412" y2="0" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(41, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">🏠</text>
      <text x="0" y="32" fill="${TEXT_MUTED}" font-size="10" font-weight="500">Home</text>
    </g>
    <g transform="translate(123, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">🧭</text>
      <text x="0" y="32" fill="${TEXT_MUTED}" font-size="10" font-weight="500">Explore</text>
    </g>
    <g transform="translate(206, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">🗺️</text>
      <text x="0" y="32" fill="${TEXT_MUTED}" font-size="10" font-weight="500">Map</text>
    </g>
    <g transform="translate(288, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">🔀</text>
      <text x="0" y="32" fill="${TEXT_MUTED}" font-size="10" font-weight="500">Planner</text>
    </g>
    <g transform="translate(370, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">⋯</text>
      <text x="0" y="32" fill="${RED}" font-size="10" font-weight="700">More</text>
    </g>

    <!-- Android Home Indicator / Navigation Bar Pill (24px) -->
    <rect y="64" width="412" height="24" fill="${BG_WHITE}"/>
    <rect x="170" y="74" width="72" height="4" rx="2" fill="#5a504a"/>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// 5. Capacitor Launch Splash Screen (412 x 915)
// -------------------------------------------------------------
function generateCapacitorLaunchSplash() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      text { font-family: 'Inter', system-ui, sans-serif; }
      .title { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
    </style>
  </defs>

  <!-- Deep Sacred Crimson Canvas -->
  <rect width="412" height="915" fill="#1f0a0a"/>

  <!-- Android System Status Bar -->
  <g id="Status_Bar">
    <text x="20" y="26" fill="#fef3c7" font-size="14" font-weight="600">9:34</text>
    <g transform="translate(330, 14)">
      <text x="0" y="12" fill="#fef3c7" font-size="12" font-weight="700">5G</text>
      <text x="22" y="12" fill="#fef3c7" font-size="12">📶</text>
      <text x="44" y="12" fill="#fef3c7" font-size="12">🔋</text>
    </g>
  </g>

  <!-- Sound On Audio Badge -->
  <g transform="translate(290, 60)">
    <rect width="102" height="32" rx="16" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <text x="51" y="21" fill="#fef3c7" font-size="12" font-weight="600" text-anchor="middle">🔊 Sound On</text>
  </g>

  <!-- Central Durga Sacred Artwork Placeholder -->
  <g transform="translate(56, 160)">
    <circle cx="150" cy="150" r="140" fill="#691111" stroke="#d97706" stroke-width="3"/>
    <text x="150" y="160" fill="#fef3c7" font-size="28" font-weight="800" text-anchor="middle">মা দুর্গা</text>
    <text x="150" y="195" fill="#f59e0b" font-size="14" font-weight="600" text-anchor="middle">Durga Protima Sacred Art</text>
  </g>

  <!-- Brand Typography -->
  <g transform="translate(206, 520)" text-anchor="middle">
    <text x="0" y="0" fill="#ffffff" font-size="44" font-weight="800" class="title">PujoPath</text>
    <text x="0" y="40" fill="#fef3c7" font-size="20" font-weight="600">Your Puja, Your Path.</text>
  </g>

  <!-- Bottom Skip Action -->
  <g transform="translate(300, 840)">
    <rect width="90" height="36" rx="18" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
    <text x="45" y="23" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Skip &gt;</text>
  </g>

  <!-- Android System Gesture Pill -->
  <rect x="156" y="900" width="100" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
</svg>`;
}

// -------------------------------------------------------------
// 6. Capacitor Android "More Features" Drawer (412 x 915)
// -------------------------------------------------------------
function generateCapacitorAndroidDrawer() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="915" viewBox="0 0 412 915" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      text { font-family: 'Inter', system-ui, sans-serif; }
      .title { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
    </style>
  </defs>

  <!-- Dimmed Scrim Backdrop -->
  <rect width="412" height="915" fill="rgba(0, 0, 0, 0.45)"/>

  <!-- Bottom Sheet Container (Elevated from Bottom) -->
  <g id="Bottom_Sheet_Container" transform="translate(0, 365)">
    <rect width="412" height="550" rx="28" fill="${BG_WHITE}"/>

    <!-- Drag Handle -->
    <rect x="186" y="12" width="40" height="4" rx="2" fill="#D5C9BD"/>

    <!-- Drawer Header -->
    <g transform="translate(24, 38)">
      <text x="0" y="18" fill="${TEXT_MAIN}" font-size="20" font-weight="800" class="title">More Features</text>
      <!-- Close Button -->
      <g transform="translate(336, 0)">
        <circle cx="12" cy="12" r="14" fill="${BG_SURFACE}"/>
        <text x="12" y="17" fill="${TEXT_MUTED}" font-size="14" font-weight="700" text-anchor="middle">✕</text>
      </g>
    </g>

    <!-- 8-Feature Interactive Grid -->
    <g transform="translate(24, 85)">
      <!-- Row 1: Calendar & Metro -->
      <g transform="translate(0, 0)">
        <rect width="174" height="56" rx="14" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="35" font-size="20">📅</text>
        <text x="46" y="34" fill="${TEXT_MAIN}" font-size="14" font-weight="600">Calendar</text>
      </g>
      <g transform="translate(190, 0)">
        <rect width="174" height="56" rx="14" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="35" font-size="20">🚇</text>
        <text x="46" y="34" fill="${TEXT_MAIN}" font-size="14" font-weight="600">Metro Guide</text>
      </g>

      <!-- Row 2: Puja Music & Mahalaya -->
      <g transform="translate(0, 68)">
        <rect width="174" height="56" rx="14" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="35" font-size="20">🎵</text>
        <text x="46" y="34" fill="${TEXT_MAIN}" font-size="14" font-weight="600">Puja Music</text>
      </g>
      <g transform="translate(190, 68)">
        <rect width="174" height="56" rx="14" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="35" font-size="20">✨</text>
        <text x="46" y="34" fill="${TEXT_MAIN}" font-size="14" font-weight="600">Mahalaya</text>
      </g>

      <!-- Row 3: Help & Feedback -->
      <g transform="translate(0, 136)">
        <rect width="174" height="56" rx="14" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="35" font-size="20">ℹ️</text>
        <text x="46" y="34" fill="${TEXT_MAIN}" font-size="14" font-weight="600">Help</text>
      </g>
      <g transform="translate(190, 136)">
        <rect width="174" height="56" rx="14" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="35" font-size="20">💬</text>
        <text x="46" y="34" fill="${TEXT_MAIN}" font-size="14" font-weight="600">Feedback</text>
      </g>

      <!-- Row 4: Developer & Saved Pandals -->
      <g transform="translate(0, 204)">
        <rect width="174" height="56" rx="14" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="35" font-size="20">👥</text>
        <text x="46" y="34" fill="${TEXT_MAIN}" font-size="14" font-weight="600">Developer</text>
      </g>
      <g transform="translate(190, 204)">
        <rect width="174" height="56" rx="14" fill="${BG_CREAM}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="35" font-size="20">❤️</text>
        <text x="46" y="34" fill="${TEXT_MAIN}" font-size="14" font-weight="600">Saved Pandals</text>
      </g>
    </g>

    <!-- Share Feedback CTA Button -->
    <g transform="translate(24, 380)">
      <rect width="364" height="50" rx="14" fill="#f0f6ff" stroke="#c8e1ff" stroke-width="1"/>
      <text x="182" y="31" fill="#0066cc" font-size="14" font-weight="700" text-anchor="middle">💬 Share Feedback</text>
    </g>

    <!-- Android Home Indicator Pill -->
    <rect x="156" y="525" width="100" height="4" rx="2" fill="#5a504a"/>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// File Generation Runner
// -------------------------------------------------------------
const files = [
  { path: path.join(EXPORTS_DIR, 'web-desktop', '01_web_desktop_home.svg'), content: generateWebDesktopHome() },
  { path: path.join(EXPORTS_DIR, 'web-desktop', '02_web_desktop_developer.svg'), content: generateWebDesktopDeveloper() },
  { path: path.join(EXPORTS_DIR, 'web-mobile', '01_web_mobile_home.svg'), content: generateWebMobileHome() },
  { path: path.join(EXPORTS_DIR, 'capacitor-mobile', '01_capacitor_launch_splash.svg'), content: generateCapacitorLaunchSplash() },
  { path: path.join(EXPORTS_DIR, 'capacitor-mobile', '02_capacitor_android_developer.svg'), content: generateCapacitorAndroidDeveloper() },
  { path: path.join(EXPORTS_DIR, 'capacitor-mobile', '03_capacitor_android_drawer.svg'), content: generateCapacitorAndroidDrawer() }
];

for (const f of files) {
  fs.writeFileSync(f.path, f.content, 'utf8');
  console.log(`Generated: ${path.relative(FIGMA_DIR, f.path)} (${f.content.length} bytes)`);
}
console.log('All vector SVG screen exports generated successfully.');
