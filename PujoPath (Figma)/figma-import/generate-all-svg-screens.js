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
const GOLD = '#d97706';
const GOLD_SOFT = '#fef3c7';

// Common defs
const SVG_DEFS = `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&amp;family=Inter:wght@400;500;600;700;800&amp;family=Plus+Jakarta+Sans:wght@700;800&amp;display=swap');
      text { font-family: 'Inter', system-ui, sans-serif; }
      .title { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
      .bengali { font-family: 'Hind Siliguri', 'Inter', sans-serif; }
    </style>
  </defs>
`;

function desktopHeader(activeTab = 'Explore') {
  return `
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
      ${renderDesktopNavLink('Explore', 0, activeTab === 'Explore')}
      ${renderDesktopNavLink('Planner', 85, activeTab === 'Planner')}
      ${renderDesktopNavLink('Map', 170, activeTab === 'Map')}
      ${renderDesktopNavLink('Calendar', 235, activeTab === 'Calendar')}
      ${renderDesktopNavLink('Metro', 330, activeTab === 'Metro')}
      ${renderDesktopNavLink('Music', 410, activeTab === 'Music')}
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
  `;
}

function renderDesktopNavLink(label, x, isActive) {
  if (isActive) {
    return `
    <g transform="translate(${x}, -6)">
      <rect x="-10" y="0" width="${label.length * 9 + 20}" height="32" rx="16" fill="${RED_SOFT}"/>
      <text x="${(label.length * 9) / 2}" y="21" fill="${RED}" font-size="14" font-weight="700" text-anchor="middle">${label}</text>
    </g>`;
  }
  return `<text x="${x}" y="15" fill="${TEXT_SEC}" font-size="14" font-weight="600">${label}</text>`;
}

function desktopFooter(y) {
  return `
  <!-- FOOTER -->
  <g id="Footer" transform="translate(0, ${y})">
    <rect width="1440" height="200" fill="${BG_SURFACE}"/>
    <line x1="0" y1="0" x2="1440" y2="0" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(80, 50)">
      <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">PujoPath — Discover. Plan. Experience Pujo.</text>
      <text x="0" y="44" fill="${TEXT_MUTED}" font-size="14">Digital companion for Durga Puja 2026. Made with heart in Bengal.</text>
      <text x="0" y="80" fill="${RED}" font-size="13" font-weight="600">Crafted by Soumik &amp; Moumita</text>
      <text x="210" y="80" fill="${TEXT_MUTED}" font-size="13">• © 2026 PujoPath. Open Data Initiative.</text>
    </g>
  </g>
  `;
}

function mobileHeader(hasInstallBtn = true) {
  return `
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
    <g transform="translate(${hasInstallBtn ? '250' : '290'}, 12)">
      ${hasInstallBtn ? `
      <rect width="50" height="32" rx="8" fill="${RED}"/>
      <text x="25" y="20" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">App</text>
      <rect x="58" width="34" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="75" y="20" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle" class="bengali">বাং</text>
      ` : `
      <rect width="34" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="17" y="20" font-size="13" text-anchor="middle">☀️</text>
      <rect x="42" width="44" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="64" y="20" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle" class="bengali">বাংলা</text>
      `}
    </g>
  </g>
  `;
}

function mobileBottomNav(activeTab = 'Home', width = 390, y = 1936) {
  const tabs = ['Home', 'Explore', 'Map', 'Planner', 'More'];
  const icons = { Home: '🏠', Explore: '🧭', Map: '🗺️', Planner: '🔀', More: '⋯' };
  const step = width / 5;

  let tabsSvg = '';
  tabs.forEach((t, i) => {
    const x = step * i + step / 2;
    const isActive = t === activeTab;
    tabsSvg += `
    <g transform="translate(${x}, 14)" text-anchor="middle">
      <text x="0" y="16" font-size="18">${icons[t]}</text>
      <text x="0" y="32" fill="${isActive ? RED : TEXT_MUTED}" font-size="10" font-weight="${isActive ? '700' : '500'}">${t}</text>
    </g>`;
  });

  return `
  <!-- Fixed Mobile Bottom Navigation (64px) -->
  <g id="Mobile_Bottom_Nav" transform="translate(0, ${y})">
    <rect width="${width}" height="64" fill="${BG_WHITE}"/>
    <line x1="0" y1="0" x2="${width}" y2="0" stroke="${BORDER}" stroke-width="1"/>
    ${tabsSvg}
  </g>
  `;
}

function androidStatusBar(width = 412) {
  return `
  <!-- ANDROID SYSTEM STATUS BAR (40px) -->
  <g id="Android_Status_Bar">
    <rect width="${width}" height="40" fill="${BG_CREAM}"/>
    <text x="20" y="26" fill="${TEXT_MAIN}" font-size="14" font-weight="600">9:34</text>
    <g transform="translate(${width - 82}, 14)">
      <text x="0" y="12" fill="${TEXT_MAIN}" font-size="12" font-weight="700">5G</text>
      <text x="22" y="12" fill="${TEXT_MAIN}" font-size="12">📶</text>
      <text x="44" y="12" fill="${TEXT_MAIN}" font-size="12">🔋</text>
    </g>
  </g>
  `;
}

function androidGesturePill(width = 412, y = 1976) {
  return `
  <rect x="0" y="${y}" width="${width}" height="24" fill="${BG_WHITE}"/>
  <rect x="${(width - 72) / 2}" y="${y + 10}" width="72" height="4" rx="2" fill="#5a504a"/>
  `;
}

// -------------------------------------------------------------
// 1. Web Desktop Explore Screen (1440 x 2200)
// -------------------------------------------------------------
function generateWebDesktopExplore() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="2200" viewBox="0 0 1440 2200" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="1440" height="2200" fill="${BG_CREAM}"/>
  ${desktopHeader('Explore')}

  <!-- Page Header -->
  <g id="Explore_Header" transform="translate(80, 100)">
    <rect width="130" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="65" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">🔍 PANDAL DISCOVERY</text>
    <text x="0" y="65" fill="${TEXT_MAIN}" font-size="38" font-weight="800" class="title">Explore Puja Pandals</text>
    <text x="0" y="96" fill="${TEXT_SEC}" font-size="16">Search 774 mapped pandals across Kolkata by zone, metro proximity, theme, and crowd level.</text>

    <!-- Search Input Bar -->
    <g transform="translate(0, 130)">
      <rect width="1280" height="54" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="24" y="34" font-size="20">🔍</text>
      <text x="56" y="33" fill="${TEXT_MUTED}" font-size="15">Search by pandal name, locality, or metro station (e.g. Bagbazar, Sovabazar, Dum Dum)...</text>
      <rect x="1170" y="9" width="96" height="36" rx="10" fill="${RED}"/>
      <text x="1218" y="32" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Search</text>
    </g>

    <!-- Zone Filter Pills -->
    <g transform="translate(0, 210)">
      <!-- Pill 1: All (Active) -->
      <rect x="0" width="86" height="36" rx="18" fill="${RED}"/>
      <text x="43" y="23" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">All (774)</text>

      <!-- Pill 2: North Kolkata -->
      <rect x="96" width="140" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="166" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">North Kolkata (182)</text>

      <!-- Pill 3: South Kolkata -->
      <rect x="246" width="140" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="316" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">South Kolkata (214)</text>

      <!-- Pill 4: Central Kolkata -->
      <rect x="396" width="150" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="471" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Central Kolkata (98)</text>

      <!-- Pill 5: Salt Lake -->
      <rect x="556" width="120" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="616" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Salt Lake (64)</text>

      <!-- Pill 6: Howrah -->
      <rect x="686" width="110" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="741" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Howrah (76)</text>

      <!-- Pill 7: Behala -->
      <rect x="806" width="110" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="861" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Behala (85)</text>

      <!-- Pill 8: Bonedi Bari -->
      <rect x="926" width="135" height="36" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="993" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Bonedi Bari (55)</text>
    </g>

    <!-- Quick Checkboxes Row -->
    <g transform="translate(0, 270)">
      <text x="0" y="16" fill="${TEXT_MUTED}" font-size="12" font-weight="700">FILTERS:</text>
      <!-- Checkbox 1 -->
      <rect x="70" y="2" width="16" height="16" rx="4" fill="${RED}"/>
      <text x="78" y="14" fill="#FFFFFF" font-size="11" text-anchor="middle">✓</text>
      <text x="94" y="15" fill="${TEXT_MAIN}" font-size="13" font-weight="500">Metro Accessible Only</text>

      <!-- Checkbox 2 -->
      <rect x="270" y="2" width="16" height="16" rx="4" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="294" y="15" fill="${TEXT_MAIN}" font-size="13" font-weight="500">Wheelchair Friendly</text>

      <!-- Checkbox 3 -->
      <rect x="450" y="2" width="16" height="16" rx="4" fill="${RED}"/>
      <text x="458" y="14" fill="#FFFFFF" font-size="11" text-anchor="middle">✓</text>
      <text x="474" y="15" fill="${TEXT_MAIN}" font-size="13" font-weight="500">2026 Theme Concept Verified</text>
    </g>
  </g>

  <!-- PANDAL CARDS GRID (3 Columns x 2 Rows = 6 Cards) -->
  <g id="Pandal_Grid" transform="translate(80, 440)">
    
    <!-- Card 1: Bagbazar Sarbojanin -->
    <g transform="translate(0, 0)">
      <rect width="406" height="390" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <rect width="406" height="190" rx="20" fill="#a82323"/>
      <text x="203" y="105" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">Bagbazar Sarbojanin Photo</text>
      <g transform="translate(20, 210)">
        <rect width="110" height="24" rx="12" fill="${RED_SOFT}"/>
        <text x="55" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">North Kolkata</text>
        <text x="0" y="52" fill="${TEXT_MAIN}" font-size="20" font-weight="800">Bagbazar Sarbojanin</text>
        <text x="0" y="74" fill="${TEXT_MUTED}" font-size="14" class="bengali">বাগবাজার সর্বজনীন দুর্গোৎসব</text>
        <text x="0" y="106" fill="${TEXT_SEC}" font-size="13">🚇 Shyambazar • 🚶 500m • 👥 High Crowd</text>
        <line x1="0" y1="126" x2="366" y2="126" stroke="${BORDER_LIGHT}" stroke-width="1"/>
        <g transform="translate(0, 140)">
          <rect width="160" height="34" rx="10" fill="${RED}"/>
          <text x="80" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">+ Add to Route</text>
          <rect x="170" width="100" height="34" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
          <text x="220" y="22" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">View Details</text>
        </g>
      </g>
    </g>

    <!-- Card 2: Kumartuli Park -->
    <g transform="translate(436, 0)">
      <rect width="406" height="390" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <rect width="406" height="190" rx="20" fill="#c2410c"/>
      <text x="203" y="105" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">Kumartuli Park Photo</text>
      <g transform="translate(20, 210)">
        <rect width="110" height="24" rx="12" fill="${RED_SOFT}"/>
        <text x="55" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">North Kolkata</text>
        <text x="0" y="52" fill="${TEXT_MAIN}" font-size="20" font-weight="800">Kumartuli Park</text>
        <text x="0" y="74" fill="${TEXT_MUTED}" font-size="14" class="bengali">কুমারটুলি পার্ক সার্বজনীন</text>
        <text x="0" y="106" fill="${TEXT_SEC}" font-size="13">🚇 Sovabazar • 🚶 650m • 👥 Very High</text>
        <line x1="0" y1="126" x2="366" y2="126" stroke="${BORDER_LIGHT}" stroke-width="1"/>
        <g transform="translate(0, 140)">
          <rect width="160" height="34" rx="10" fill="${RED}"/>
          <text x="80" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">+ Add to Route</text>
          <rect x="170" width="100" height="34" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
          <text x="220" y="22" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">View Details</text>
        </g>
      </g>
    </g>

    <!-- Card 3: Sovabazar Rajbari -->
    <g transform="translate(872, 0)">
      <rect width="406" height="390" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <rect width="406" height="190" rx="20" fill="#b45309"/>
      <text x="203" y="105" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">Sovabazar Rajbari Photo</text>
      <g transform="translate(20, 210)">
        <rect width="110" height="24" rx="12" fill="${RED_SOFT}"/>
        <text x="55" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">Bonedi Bari</text>
        <text x="0" y="52" fill="${TEXT_MAIN}" font-size="20" font-weight="800">Sovabazar Rajbari</text>
        <text x="0" y="74" fill="${TEXT_MUTED}" font-size="14" class="bengali">শোভাবাজার রাজবাড়ি</text>
        <text x="0" y="106" fill="${TEXT_SEC}" font-size="13">🚇 Sovabazar • 🚶 400m • 👥 Heritage</text>
        <line x1="0" y1="126" x2="366" y2="126" stroke="${BORDER_LIGHT}" stroke-width="1"/>
        <g transform="translate(0, 140)">
          <rect width="160" height="34" rx="10" fill="${RED}"/>
          <text x="80" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">+ Add to Route</text>
          <rect x="170" width="100" height="34" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
          <text x="220" y="22" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">View Details</text>
        </g>
      </g>
    </g>

    <!-- Row 2 -->
    <!-- Card 4: Suruchi Sangha -->
    <g transform="translate(0, 420)">
      <rect width="406" height="390" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <rect width="406" height="190" rx="20" fill="#991b1b"/>
      <text x="203" y="105" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">Suruchi Sangha Photo</text>
      <g transform="translate(20, 210)">
        <rect width="110" height="24" rx="12" fill="${RED_SOFT}"/>
        <text x="55" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">South Kolkata</text>
        <text x="0" y="52" fill="${TEXT_MAIN}" font-size="20" font-weight="800">Suruchi Sangha</text>
        <text x="0" y="74" fill="${TEXT_MUTED}" font-size="14" class="bengali">সুরুচি সংঘ</text>
        <text x="0" y="106" fill="${TEXT_SEC}" font-size="13">🚇 Majerhat • 🚶 800m • 👥 Extreme Crowd</text>
        <line x1="0" y1="126" x2="366" y2="126" stroke="${BORDER_LIGHT}" stroke-width="1"/>
        <g transform="translate(0, 140)">
          <rect width="160" height="34" rx="10" fill="${RED}"/>
          <text x="80" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">+ Add to Route</text>
          <rect x="170" width="100" height="34" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
          <text x="220" y="22" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">View Details</text>
        </g>
      </g>
    </g>

    <!-- Card 5: Ekdalia Evergreen -->
    <g transform="translate(436, 420)">
      <rect width="406" height="390" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <rect width="406" height="190" rx="20" fill="#15803d"/>
      <text x="203" y="105" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">Ekdalia Evergreen Photo</text>
      <g transform="translate(20, 210)">
        <rect width="110" height="24" rx="12" fill="${RED_SOFT}"/>
        <text x="55" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">South Kolkata</text>
        <text x="0" y="52" fill="${TEXT_MAIN}" font-size="20" font-weight="800">Ekdalia Evergreen</text>
        <text x="0" y="74" fill="${TEXT_MUTED}" font-size="14" class="bengali">একডালিয়া এভারগ্রিন ক্লাব</text>
        <text x="0" y="106" fill="${TEXT_SEC}" font-size="13">🚇 Gariahat • 🚶 700m • 👥 High Crowd</text>
        <line x1="0" y1="126" x2="366" y2="126" stroke="${BORDER_LIGHT}" stroke-width="1"/>
        <g transform="translate(0, 140)">
          <rect width="160" height="34" rx="10" fill="${RED}"/>
          <text x="80" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">+ Add to Route</text>
          <rect x="170" width="100" height="34" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
          <text x="220" y="22" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">View Details</text>
        </g>
      </g>
    </g>

    <!-- Card 6: Sreebhumi Sporting Club -->
    <g transform="translate(872, 420)">
      <rect width="406" height="390" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <rect width="406" height="190" rx="20" fill="#4338ca"/>
      <text x="203" y="105" fill="#FFFFFF" font-size="16" font-weight="700" text-anchor="middle">Sreebhumi Sporting Club Photo</text>
      <g transform="translate(20, 210)">
        <rect width="110" height="24" rx="12" fill="${RED_SOFT}"/>
        <text x="55" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">Salt Lake</text>
        <text x="0" y="52" fill="${TEXT_MAIN}" font-size="20" font-weight="800">Sreebhumi Sporting Club</text>
        <text x="0" y="74" fill="${TEXT_MUTED}" font-size="14" class="bengali">শ্রীভূমি স্পোর্টিং ক্লাব</text>
        <text x="0" y="106" fill="${TEXT_SEC}" font-size="13">🚇 Ultadanga • 🚶 1.2km • 👥 Extreme Crowd</text>
        <line x1="0" y1="126" x2="366" y2="126" stroke="${BORDER_LIGHT}" stroke-width="1"/>
        <g transform="translate(0, 140)">
          <rect width="160" height="34" rx="10" fill="${RED}"/>
          <text x="80" y="22" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">+ Add to Route</text>
          <rect x="170" width="100" height="34" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
          <text x="220" y="22" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">View Details</text>
        </g>
      </g>
    </g>
  </g>

  <!-- Pagination Controls -->
  <g id="Pagination" transform="translate(80, 1310)">
    <rect width="1280" height="60" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <text x="24" y="36" fill="${TEXT_SEC}" font-size="14">Showing 1 to 6 of 774 pandals</text>
    <g transform="translate(1000, 12)">
      <rect width="80" height="36" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="40" y="23" fill="${TEXT_MUTED}" font-size="13" font-weight="600" text-anchor="middle">&lt; Prev</text>

      <rect x="90" width="36" height="36" rx="10" fill="${RED}"/>
      <text x="108" y="23" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">1</text>

      <rect x="134" width="36" height="36" rx="10" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="152" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">2</text>

      <rect x="178" width="80" height="36" rx="10" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="218" y="23" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Next &gt;</text>
    </g>
  </g>

  ${desktopFooter(1950)}
</svg>`;
}

// -------------------------------------------------------------
// 2. Web Desktop Calendar Screen (1440 x 1800)
// -------------------------------------------------------------
function generateWebDesktopCalendar() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1800" viewBox="0 0 1440 1800" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="1440" height="1800" fill="${BG_CREAM}"/>
  ${desktopHeader('Calendar')}

  <!-- Header -->
  <g id="Calendar_Header" transform="translate(80, 100)">
    <rect width="160" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="80" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">📅 PUJA ALMANAC 1433</text>
    <text x="0" y="65" fill="${TEXT_MAIN}" font-size="38" font-weight="800" class="title">Durga Puja 2026 Sacred Calendar</text>
    <text x="0" y="96" fill="${TEXT_SEC}" font-size="16">Exact tithi schedules, pushpanjali auspicious timings, and sandhi puja hours according to pure almanac calculations.</text>

    <!-- SANDHI PUJA FEATURE SECTION -->
    <g id="Sandhi_Puja_Feature" transform="translate(0, 130)">
      <rect width="1280" height="220" rx="24" fill="${BG_WHITE}" stroke="#fca5a5" stroke-width="2"/>
      
      <g transform="translate(32, 28)">
        <rect width="130" height="24" rx="12" fill="${RED_SOFT}"/>
        <text x="65" y="16" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">মহাসন্ধিক্ষণ ২০২৬</text>

        <rect x="140" width="160" height="24" rx="12" fill="${GOLD_SOFT}"/>
        <text x="220" y="16" fill="${GOLD}" font-size="11" font-weight="700" text-anchor="middle">108 Lotuses &amp; Lamps</text>

        <text x="0" y="68" fill="${TEXT_MAIN}" font-size="28" font-weight="800" class="title">Sandhi Puja Auspicious Timings</text>
        <text x="0" y="94" fill="${TEXT_SEC}" font-size="15">The auspicious confluence of Maha Ashtami ending and Maha Navami commencing. 48-minute sacred window.</text>

        <!-- Time Badge -->
        <g transform="translate(0, 115)">
          <rect width="450" height="44" rx="12" fill="#fff1f1" stroke="${RED}" stroke-width="1"/>
          <text x="22" y="28" font-size="18">🔥</text>
          <text x="50" y="28" fill="${RED}" font-size="15" font-weight="800">Monday, 19 October 2026 • 10:27 AM – 11:15 AM IST</text>
        </g>
      </g>

      <!-- Right Convention Selector -->
      <g transform="translate(860, 28)">
        <text x="0" y="16" fill="${TEXT_MUTED}" font-size="11" font-weight="800">ALMANAC CONVENTION</text>
        <g transform="translate(0, 26)">
          <rect width="380" height="60" rx="14" fill="${RED_SOFT}" stroke="${RED}" stroke-width="1.5"/>
          <text x="16" y="26" fill="${RED}" font-size="14" font-weight="700">Pure Almanac (বিশুদ্ধ সিদ্ধান্ত)</text>
          <text x="16" y="46" fill="${TEXT_SEC}" font-size="12">10:27 AM – 11:15 AM (48 Mins Duration)</text>
          <circle cx="350" cy="30" r="10" fill="${RED}"/>
          <text x="350" y="34" fill="#FFFFFF" font-size="11" text-anchor="middle">✓</text>
        </g>
        <g transform="translate(0, 96)">
          <rect width="380" height="60" rx="14" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
          <text x="16" y="26" fill="${TEXT_MAIN}" font-size="14" font-weight="600">Surya Siddhanta (সূর্যসিদ্ধান্ত)</text>
          <text x="16" y="46" fill="${TEXT_MUTED}" font-size="12">10:35 AM – 11:23 AM (48 Mins Duration)</text>
        </g>
      </g>
    </g>

    <!-- 6-DAY FESTIVAL SCHEDULE TABLE -->
    <g id="Festival_Schedule_Table" transform="translate(0, 390)">
      <text x="0" y="24" fill="${TEXT_MAIN}" font-size="24" font-weight="800" class="title">Complete Festival Tithi Schedule</text>

      <g transform="translate(0, 44)">
        <rect width="1280" height="520" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>

        <!-- Table Header -->
        <rect width="1280" height="50" rx="20" fill="${BG_SURFACE}"/>
        <text x="30" y="32" fill="${TEXT_MUTED}" font-size="13" font-weight="700">DATE &amp; DAY</text>
        <text x="240" y="32" fill="${TEXT_MUTED}" font-size="13" font-weight="700">FESTIVAL TITHI</text>
        <text x="520" y="32" fill="${TEXT_MUTED}" font-size="13" font-weight="700">AUSPICIOUS TIMINGS &amp; RITUALS</text>
        <text x="1050" y="32" fill="${TEXT_MUTED}" font-size="13" font-weight="700">CULTURAL SIGNIFICANCE</text>

        <!-- Row 1: Mahalaya -->
        <g transform="translate(0, 50)">
          <line x1="0" y1="78" x2="1280" y2="78" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="30" y="45" fill="${TEXT_MAIN}" font-size="15" font-weight="700">10 Oct 2026, Sat</text>
          <text x="240" y="38" fill="${RED}" font-size="16" font-weight="800">Mahalaya (মহালয়া)</text>
          <text x="240" y="58" fill="${TEXT_MUTED}" font-size="12">Amavasya Tithi begins 4:12 AM</text>
          <text x="520" y="45" fill="${TEXT_SEC}" font-size="14">Tarpan 05:30 AM – 10:15 AM • Radio Broadcast 04:00 AM</text>
          <text x="1050" y="45" fill="${TEXT_MAIN}" font-size="14">Invoking Goddess Durga</text>
        </g>

        <!-- Row 2: Maha Shashthi -->
        <g transform="translate(0, 128)">
          <line x1="0" y1="78" x2="1280" y2="78" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="30" y="45" fill="${TEXT_MAIN}" font-size="15" font-weight="700">17 Oct 2026, Sat</text>
          <text x="240" y="38" fill="${RED}" font-size="16" font-weight="800">Maha Shashthi (মহাষষ্ঠী)</text>
          <text x="240" y="58" fill="${TEXT_MUTED}" font-size="12">Shashthi Tithi upto 07:45 PM</text>
          <text x="520" y="45" fill="${TEXT_SEC}" font-size="14">Bodhon &amp; Amantran 06:30 PM • Adhibas 07:15 PM</text>
          <text x="1050" y="45" fill="${TEXT_MAIN}" font-size="14">Awakening of the Goddess</text>
        </g>

        <!-- Row 3: Maha Saptami -->
        <g transform="translate(0, 206)">
          <line x1="0" y1="78" x2="1280" y2="78" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="30" y="45" fill="${TEXT_MAIN}" font-size="15" font-weight="700">18 Oct 2026, Sun</text>
          <text x="240" y="38" fill="${RED}" font-size="16" font-weight="800">Maha Saptami (মহাসপ্তমী)</text>
          <text x="240" y="58" fill="${TEXT_MUTED}" font-size="12">Saptami Tithi ends 08:32 PM</text>
          <text x="520" y="45" fill="${TEXT_SEC}" font-size="14">Kola Bou Snan 06:15 AM • Pushpanjali 09:30 AM</text>
          <text x="1050" y="45" fill="${TEXT_MAIN}" font-size="14">Nabapatrika Entry Ritual</text>
        </g>

        <!-- Row 4: Maha Ashtami -->
        <g transform="translate(0, 284)">
          <line x1="0" y1="78" x2="1280" y2="78" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="30" y="45" fill="${TEXT_MAIN}" font-size="15" font-weight="700">19 Oct 2026, Mon</text>
          <text x="240" y="38" fill="${RED}" font-size="16" font-weight="800">Maha Ashtami &amp; Sandhi Puja</text>
          <text x="240" y="58" fill="${TEXT_MUTED}" font-size="12">Ashtami ends 10:51 AM</text>
          <text x="520" y="45" fill="${RED}" font-size="14" font-weight="700">Anjali 08:30 AM • Sandhi Puja 10:27 AM – 11:15 AM</text>
          <text x="1050" y="45" fill="${TEXT_MAIN}" font-size="14">Peak Devotional Zenith</text>
        </g>

        <!-- Row 5: Maha Navami -->
        <g transform="translate(0, 362)">
          <line x1="0" y1="78" x2="1280" y2="78" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="30" y="45" fill="${TEXT_MAIN}" font-size="15" font-weight="700">20 Oct 2026, Tue</text>
          <text x="240" y="38" fill="${RED}" font-size="16" font-weight="800">Maha Navami (মহানবমী)</text>
          <text x="240" y="58" fill="${TEXT_MUTED}" font-size="12">Navami Tithi ends 11:40 AM</text>
          <text x="520" y="45" fill="${TEXT_SEC}" font-size="14">Navami Homa 10:30 AM • Sandhya Aarti 06:45 PM</text>
          <text x="1050" y="45" fill="${TEXT_MAIN}" font-size="14">Sacred Yajna &amp; Celebration</text>
        </g>

        <!-- Row 6: Vijaya Dashami -->
        <g transform="translate(0, 440)">
          <text x="30" y="45" fill="${TEXT_MAIN}" font-size="15" font-weight="700">21 Oct 2026, Wed</text>
          <text x="240" y="38" fill="${RED}" font-size="16" font-weight="800">Vijaya Dashami (বিজয়া দশমী)</text>
          <text x="240" y="58" fill="${TEXT_MUTED}" font-size="12">Dashami Tithi ends 12:50 PM</text>
          <text x="520" y="45" fill="${TEXT_SEC}" font-size="14">Darpan Visarjan 09:30 AM • Sindoor Khela 02:00 PM</text>
          <text x="1050" y="45" fill="${TEXT_MAIN}" font-size="14">Farewell to the Goddess</text>
        </g>
      </g>
    </g>
  </g>

  ${desktopFooter(1550)}
</svg>`;
}

// -------------------------------------------------------------
// 3. Web Desktop Route Planner Screen (1440 x 1600)
// -------------------------------------------------------------
function generateWebDesktopPlanner() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1600" viewBox="0 0 1440 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="1440" height="1600" fill="${BG_CREAM}"/>
  ${desktopHeader('Planner')}

  <g id="Planner_Content" transform="translate(80, 100)">
    <rect width="140" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="70" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">🔀 ROUTE OPTIMIZER</text>
    <text x="0" y="65" fill="${TEXT_MAIN}" font-size="38" font-weight="800" class="title">Durga Puja Route Planner</text>
    <text x="0" y="96" fill="${TEXT_SEC}" font-size="16">Build an optimized walking circuit with smart clustering algorithms to minimize walking distance and bypass traffic.</text>

    <!-- Metrics Bar -->
    <g transform="translate(0, 130)">
      <rect width="1280" height="74" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <g transform="translate(30, 24)">
        <text x="0" y="18" fill="${TEXT_MUTED}" font-size="11" font-weight="700">STOPS</text>
        <text x="0" y="38" fill="${TEXT_MAIN}" font-size="18" font-weight="800">4 Selected</text>

        <text x="240" y="18" fill="${TEXT_MUTED}" font-size="11" font-weight="700">TOTAL DISTANCE</text>
        <text x="240" y="38" fill="${TEXT_MAIN}" font-size="18" font-weight="800">3.2 km</text>

        <text x="480" y="18" fill="${TEXT_MUTED}" font-size="11" font-weight="700">EST. WALKING TIME</text>
        <text x="480" y="38" fill="${TEXT_MAIN}" font-size="18" font-weight="800">48 mins</text>

        <text x="720" y="18" fill="${TEXT_MUTED}" font-size="11" font-weight="700">SMART CLUSTER SAVINGS</text>
        <text x="720" y="38" fill="${RED}" font-size="18" font-weight="800">⚡ 1.8 km saved</text>
      </g>
      <g transform="translate(1060, 16)">
        <rect width="190" height="42" rx="12" fill="${RED}"/>
        <text x="95" y="27" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">⚡ Optimize Route</text>
      </g>
    </g>

    <!-- Two-Column Layout -->
    <g transform="translate(0, 230)">
      <!-- Left: Stop Sequence Cards -->
      <g transform="translate(0, 0)">
        <text x="0" y="20" fill="${TEXT_MAIN}" font-size="20" font-weight="800" class="title">Itinerary Stops</text>

        <!-- Stop 1 -->
        <g transform="translate(0, 40)">
          <rect width="580" height="88" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
          <circle cx="44" cy="44" r="18" fill="${RED}"/>
          <text x="44" y="50" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">1</text>
          <g transform="translate(80, 24)">
            <text x="0" y="18" fill="${TEXT_MAIN}" font-size="16" font-weight="800">Bagbazar Sarbojanin</text>
            <text x="0" y="38" fill="${TEXT_MUTED}" font-size="13">North Kolkata • Shyambazar Metro • 500m</text>
          </g>
        </g>

        <!-- Transit connector -->
        <line x1="44" y1="130" x2="44" y2="155" stroke="${RED}" stroke-width="2" stroke-dasharray="4 4"/>
        <text x="70" y="146" fill="${TEXT_MUTED}" font-size="12">🚶 650m (8 mins walk)</text>

        <!-- Stop 2 -->
        <g transform="translate(0, 160)">
          <rect width="580" height="88" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
          <circle cx="44" cy="44" r="18" fill="${RED}"/>
          <text x="44" y="50" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">2</text>
          <g transform="translate(80, 24)">
            <text x="0" y="18" fill="${TEXT_MAIN}" font-size="16" font-weight="800">Kumartuli Park</text>
            <text x="0" y="38" fill="${TEXT_MUTED}" font-size="13">North Kolkata • Sovabazar Metro • 650m</text>
          </g>
        </g>

        <!-- Transit connector -->
        <line x1="44" y1="250" x2="44" y2="275" stroke="${RED}" stroke-width="2" stroke-dasharray="4 4"/>
        <text x="70" y="266" fill="${TEXT_MUTED}" font-size="12">🚶 400m (5 mins walk)</text>

        <!-- Stop 3 -->
        <g transform="translate(0, 280)">
          <rect width="580" height="88" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
          <circle cx="44" cy="44" r="18" fill="${RED}"/>
          <text x="44" y="50" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">3</text>
          <g transform="translate(80, 24)">
            <text x="0" y="18" fill="${TEXT_MAIN}" font-size="16" font-weight="800">Sovabazar Rajbari</text>
            <text x="0" y="38" fill="${TEXT_MUTED}" font-size="13">Bonedi Bari • Sovabazar Metro • 400m</text>
          </g>
        </g>
      </g>

      <!-- Right: Map Canvas & Actions -->
      <g transform="translate(620, 0)">
        <text x="0" y="20" fill="${TEXT_MAIN}" font-size="20" font-weight="800" class="title">Route Visualizer</text>
        <g transform="translate(0, 40)">
          <rect width="660" height="328" rx="20" fill="#f0e9df" stroke="${BORDER}" stroke-width="1"/>
          <text x="330" y="160" fill="${TEXT_MUTED}" font-size="16" font-weight="600" text-anchor="middle">🗺️ Interactive Kolkata Leaflet Route Canvas</text>
          <g transform="translate(30, 260)">
            <rect width="180" height="42" rx="12" fill="${RED}"/>
            <text x="90" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Open in Google Maps ↗</text>
            <rect x="195" width="140" height="42" rx="12" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
            <text x="265" y="26" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Share Circuit ↗</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  ${desktopFooter(1350)}
</svg>`;
}

// -------------------------------------------------------------
// 4. Web Desktop Kolkata Metro Screen (1440 x 1600)
// -------------------------------------------------------------
function generateWebDesktopMetro() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="1600" viewBox="0 0 1440 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="1440" height="1600" fill="${BG_CREAM}"/>
  ${desktopHeader('Metro')}

  <g id="Metro_Content" transform="translate(80, 100)">
    <rect width="150" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="75" y="17" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle">🚇 TRANSIT COMPANION</text>
    <text x="0" y="65" fill="${TEXT_MAIN}" font-size="38" font-weight="800" class="title">Kolkata Metro Puja Guide</text>
    <text x="0" y="96" fill="${TEXT_SEC}" font-size="16">Official 2026 Durga Puja all-night metro schedules, station exits, and direct walking links to Kolkata's iconic pandals.</text>

    <!-- Metro Line Tabs -->
    <g transform="translate(0, 130)">
      <rect width="260" height="46" rx="14" fill="#0066cc"/>
      <text x="130" y="28" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">🚇 Blue Line (North-South)</text>

      <rect x="275" width="260" height="46" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="405" y="28" fill="${TEXT_MAIN}" font-size="14" font-weight="600" text-anchor="middle">🟢 Green Line (Howrah - Sector V)</text>

      <rect x="550" width="180" height="46" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="640" y="28" fill="${TEXT_MAIN}" font-size="14" font-weight="600" text-anchor="middle">🟣 Purple Line</text>

      <!-- Night Service Banner -->
      <g transform="translate(860, 0)">
        <rect width="420" height="46" rx="14" fill="${GOLD_SOFT}" stroke="${GOLD}" stroke-width="1"/>
        <text x="20" y="28" font-size="16">🌙</text>
        <text x="45" y="28" fill="#92400e" font-size="13" font-weight="700">Puja Special: All-Night Trains (Saptami – Navami)</text>
      </g>
    </g>

    <!-- Stations Grid -->
    <g transform="translate(0, 210)">
      <text x="0" y="24" fill="${TEXT_MAIN}" font-size="22" font-weight="800" class="title">Key North-South Metro Pandal Hubs</text>

      <g transform="translate(0, 44)">
        <!-- Station 1: Shyambazar -->
        <g transform="translate(0, 0)">
          <rect width="625" height="150" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
          <rect x="24" y="24" width="8" height="102" rx="4" fill="#0066cc"/>
          <g transform="translate(48, 30)">
            <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Shyambazar (শ্যামবাজার)</text>
            <text x="0" y="42" fill="${TEXT_MUTED}" font-size="13">Exits: Gate 1 (R.G. Kar Rd) • Gate 4 (Bhupen Bose Ave)</text>
            <text x="0" y="74" fill="${RED}" font-size="14" font-weight="700">Nearby Pandals:</text>
            <text x="120" y="74" fill="${TEXT_SEC}" font-size="13">Bagbazar Sarbojanin (500m), Shyambazar Nabinkur (350m)</text>
          </g>
        </g>

        <!-- Station 2: Sovabazar Sutanuti -->
        <g transform="translate(655, 0)">
          <rect width="625" height="150" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
          <rect x="24" y="24" width="8" height="102" rx="4" fill="#0066cc"/>
          <g transform="translate(48, 30)">
            <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Sovabazar Sutanuti (শোভাবাজার সুতানুটি)</text>
            <text x="0" y="42" fill="${TEXT_MUTED}" font-size="13">Exits: Gate 2 (Sovabazar St) • Gate 3 (BK Paul Ave)</text>
            <text x="0" y="74" fill="${RED}" font-size="14" font-weight="700">Nearby Pandals:</text>
            <text x="120" y="74" fill="${TEXT_SEC}" font-size="13">Kumartuli Park (650m), Sovabazar Rajbari (400m), Ahiritola (700m)</text>
          </g>
        </g>

        <!-- Station 3: MG Road -->
        <g transform="translate(0, 170)">
          <rect width="625" height="150" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
          <rect x="24" y="24" width="8" height="102" rx="4" fill="#0066cc"/>
          <g transform="translate(48, 30)">
            <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Mahatma Gandhi Road (মহাত্মা গান্ধী রোড)</text>
            <text x="0" y="42" fill="${TEXT_MUTED}" font-size="13">Exits: Gate 1 (College St) • Gate 2 (CR Avenue)</text>
            <text x="0" y="74" fill="${RED}" font-size="14" font-weight="700">Nearby Pandals:</text>
            <text x="120" y="74" fill="${TEXT_SEC}" font-size="13">College Square (450m), Mohammad Ali Park (250m)</text>
          </g>
        </g>

        <!-- Station 4: Kalighat / Jatin Das Park -->
        <g transform="translate(655, 170)">
          <rect width="625" height="150" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
          <rect x="24" y="24" width="8" height="102" rx="4" fill="#0066cc"/>
          <g transform="translate(48, 30)">
            <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Kalighat (কালীঘাট)</text>
            <text x="0" y="42" fill="${TEXT_MUTED}" font-size="13">Exits: Gate 1 (SP Mukherjee Rd) • Gate 4 (Rashbehari Ave)</text>
            <text x="0" y="74" fill="${RED}" font-size="14" font-weight="700">Nearby Pandals:</text>
            <text x="120" y="74" fill="${TEXT_SEC}" font-size="13">Badamtala Ashar Sangha (300m), 66 Pally (400m), Mudiali (550m)</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  ${desktopFooter(1350)}
</svg>`;
}

// -------------------------------------------------------------
// 5. Web Mobile Developer Screen (390 x 1750)
// (Strict Requirement: Moumita 1st, Soumik 2nd)
// -------------------------------------------------------------
function generateWebMobileDeveloper() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1750" viewBox="0 0 390 1750" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="1750" fill="${BG_CREAM}"/>
  ${mobileHeader(true)}

  <g id="Dev_Mobile_Content" transform="translate(16, 76)">
    <rect width="160" height="26" rx="13" fill="${RED_SOFT}"/>
    <text x="80" y="17" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">👥 PROJECT CO-CREATORS</text>
    <text x="0" y="60" fill="${TEXT_MAIN}" font-size="26" font-weight="800" class="title">Meet the Developers</text>
    <text x="0" y="86" fill="${TEXT_SEC}" font-size="13">PujoPath is a collaborative project co-created by Soumik and Moumita.</text>

    <!-- STACKED CARDS: MOUMITA 1ST, SOUMIK 2ND -->
    <g transform="translate(0, 120)">
      
      <!-- CARD 1: MOUMITA -->
      <g id="Moumita_Card" transform="translate(0, 0)">
        <rect width="358" height="660" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        
        <g transform="translate(16, 16)">
          <rect width="72" height="72" rx="16" fill="#c93b3b" stroke="${RED}" stroke-width="2"/>
          <text x="36" y="46" fill="#FFFFFF" font-size="28" font-weight="800" text-anchor="middle">M</text>
          
          <g transform="translate(86, 6)">
            <rect width="95" height="22" rx="11" fill="${RED_SOFT}"/>
            <text x="47" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">✨ Co-Creator</text>
            <text x="0" y="44" fill="${TEXT_MAIN}" font-size="20" font-weight="800" class="title">Moumita</text>
            <text x="0" y="64" fill="${RED}" font-size="13" font-weight="700">UI &amp; Frontend Lead</text>
          </g>
        </g>

        <!-- Description -->
        <text x="16" y="116" fill="${TEXT_SEC}" font-size="13">
          <tspan x="16" dy="0">Directs user interface design, frontend architecture,</tspan>
          <tspan x="16" dy="19">responsive layouts, user experience, visual consistency,</tspan>
          <tspan x="16" dy="19">and interaction design, alongside research and curation</tspan>
          <tspan x="16" dy="19">of Kolkata's historic Bonedi Bari traditions and</tspan>
          <tspan x="16" dy="19">cultural festival narratives.</tspan>
        </text>

        <!-- Responsibilities -->
        <g transform="translate(16, 235)">
          <text x="0" y="0" fill="${TEXT_MUTED}" font-size="10" font-weight="800">KEY RESPONSIBILITIES</text>
          <g transform="translate(0, 10)">
            <rect x="0" y="0" width="135" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="67" y="17" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">User Interface Design</text>

            <rect x="143" y="0" width="145" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="215" y="17" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Frontend Architecture</text>

            <rect x="0" y="32" width="130" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="65" y="49" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Responsive Layouts</text>

            <rect x="138" y="32" width="145" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="210" y="49" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">User Experience (UX)</text>

            <rect x="0" y="64" width="130" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="65" y="81" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Visual Consistency</text>

            <rect x="138" y="64" width="115" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="195" y="81" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Cultural Curation</text>
          </g>
        </g>

        <!-- LinkedIn -->
        <g transform="translate(16, 595)">
          <line x1="0" y1="0" x2="326" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="0" y="30" fill="${TEXT_MUTED}" font-size="12">Professional Profile</text>
          <g transform="translate(216, 14)">
            <rect width="110" height="32" rx="8" fill="${LINKEDIN_BLUE}"/>
            <text x="55" y="21" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>

      <!-- CARD 2: SOUMIK -->
      <g id="Soumik_Card" transform="translate(0, 680)">
        <rect width="358" height="660" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        
        <g transform="translate(16, 16)">
          <rect width="72" height="72" rx="16" fill="#b42323" stroke="${RED}" stroke-width="2"/>
          <text x="36" y="46" fill="#FFFFFF" font-size="28" font-weight="800" text-anchor="middle">S</text>
          
          <g transform="translate(86, 6)">
            <rect width="95" height="22" rx="11" fill="${RED_SOFT}"/>
            <text x="47" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">✨ Co-Creator</text>
            <text x="0" y="44" fill="${TEXT_MAIN}" font-size="20" font-weight="800" class="title">Soumik</text>
            <text x="0" y="64" fill="${RED}" font-size="13" font-weight="700">Backend &amp; Systems Lead</text>
          </g>
        </g>

        <!-- Description -->
        <text x="16" y="116" fill="${TEXT_SEC}" font-size="13">
          <tspan x="16" dy="0">Directs backend &amp; systems architecture, core application</tspan>
          <tspan x="16" dy="19">logic, route optimization algorithms, offline-first transit</tspan>
          <tspan x="16" dy="19">functionality, backend integrations, and platform</tspan>
          <tspan x="16" dy="19">performance &amp; reliability.</tspan>
        </text>

        <!-- Responsibilities -->
        <g transform="translate(16, 235)">
          <text x="0" y="0" fill="${TEXT_MUTED}" font-size="10" font-weight="800">KEY RESPONSIBILITIES</text>
          <g transform="translate(0, 10)">
            <rect x="0" y="0" width="140" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="70" y="17" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Backend Architecture</text>

            <rect x="148" y="0" width="150" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="223" y="17" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Core Application Logic</text>

            <rect x="0" y="32" width="135" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="67" y="49" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">System Architecture</text>

            <rect x="143" y="32" width="165" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="225" y="49" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Route Optimization</text>

            <rect x="0" y="64" width="130" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="65" y="81" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Offline-First Transit</text>

            <rect x="138" y="64" width="145" height="26" rx="8" fill="#f7f3ee" stroke="#e8dfd5" stroke-width="1"/>
            <text x="210" y="81" fill="#554b44" font-size="10" font-weight="600" text-anchor="middle">Backend Integrations</text>
          </g>
        </g>

        <!-- LinkedIn -->
        <g transform="translate(16, 595)">
          <line x1="0" y1="0" x2="326" y2="0" stroke="${BORDER_LIGHT}" stroke-width="1"/>
          <text x="0" y="30" fill="${TEXT_MUTED}" font-size="12">Professional Profile</text>
          <g transform="translate(216, 14)">
            <rect width="110" height="32" rx="8" fill="${LINKEDIN_BLUE}"/>
            <text x="55" y="21" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  ${mobileBottomNav('More', 390, 1686)}
</svg>`;
}

// -------------------------------------------------------------
// 6. Web Mobile Explore Screen (390 x 2100)
// -------------------------------------------------------------
function generateWebMobileExplore() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="2100" viewBox="0 0 390 2100" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="2100" fill="${BG_CREAM}"/>
  ${mobileHeader(true)}

  <g id="Explore_Mobile_Content" transform="translate(16, 76)">
    <text x="0" y="20" fill="${TEXT_MAIN}" font-size="24" font-weight="800" class="title">Explore Pandals</text>
    <text x="0" y="42" fill="${TEXT_MUTED}" font-size="13">774 pandals mapped in Kolkata</text>

    <!-- Search Input -->
    <g transform="translate(0, 58)">
      <rect width="358" height="46" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="16" y="28" font-size="16">🔍</text>
      <text x="44" y="28" fill="${TEXT_MUTED}" font-size="13">Search pandal, area, or metro...</text>
    </g>

    <!-- Horizontal Scroll Zone Pills -->
    <g transform="translate(0, 116)">
      <rect x="0" width="76" height="32" rx="16" fill="${RED}"/>
      <text x="38" y="21" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">All (774)</text>

      <rect x="84" width="90" height="32" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="129" y="21" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">North (182)</text>

      <rect x="182" width="90" height="32" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="227" y="21" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">South (214)</text>

      <rect x="280" width="78" height="32" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="319" y="21" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">Central</text>
    </g>

    <!-- Pandal Cards Stack -->
    <g transform="translate(0, 164)">
      
      <!-- Card 1 -->
      <g transform="translate(0, 0)">
        <rect width="358" height="310" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <rect width="358" height="150" rx="18" fill="#a82323"/>
        <text x="179" y="80" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">Bagbazar Sarbojanin Photo</text>
        <g transform="translate(16, 168)">
          <rect width="90" height="22" rx="11" fill="${RED_SOFT}"/>
          <text x="45" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
          <text x="0" y="44" fill="${TEXT_MAIN}" font-size="17" font-weight="800">Bagbazar Sarbojanin</text>
          <text x="0" y="64" fill="${TEXT_MUTED}" font-size="13" class="bengali">বাগবাজার সর্বজনীন দুর্গোৎসব</text>
          <text x="0" y="90" fill="${TEXT_SEC}" font-size="12">🚇 Shyambazar • 🚶 500m • 👥 High Crowd</text>
        </g>
      </g>

      <!-- Card 2 -->
      <g transform="translate(0, 326)">
        <rect width="358" height="310" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <rect width="358" height="150" rx="18" fill="#c2410c"/>
        <text x="179" y="80" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">Kumartuli Park Photo</text>
        <g transform="translate(16, 168)">
          <rect width="90" height="22" rx="11" fill="${RED_SOFT}"/>
          <text x="45" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
          <text x="0" y="44" fill="${TEXT_MAIN}" font-size="17" font-weight="800">Kumartuli Park</text>
          <text x="0" y="64" fill="${TEXT_MUTED}" font-size="13" class="bengali">কুমারটুলি পার্ক সার্বজনীন</text>
          <text x="0" y="90" fill="${TEXT_SEC}" font-size="12">🚇 Sovabazar • 🚶 650m • 👥 Very High</text>
        </g>
      </g>

      <!-- Card 3 -->
      <g transform="translate(0, 652)">
        <rect width="358" height="310" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <rect width="358" height="150" rx="18" fill="#b45309"/>
        <text x="179" y="80" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">Sovabazar Rajbari Photo</text>
        <g transform="translate(16, 168)">
          <rect width="85" height="22" rx="11" fill="${RED_SOFT}"/>
          <text x="42" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">Bonedi Bari</text>
          <text x="0" y="44" fill="${TEXT_MAIN}" font-size="17" font-weight="800">Sovabazar Rajbari</text>
          <text x="0" y="64" fill="${TEXT_MUTED}" font-size="13" class="bengali">শোভাবাজার রাজবাড়ি</text>
          <text x="0" y="90" fill="${TEXT_SEC}" font-size="12">🚇 Sovabazar • 🚶 400m • 👥 Heritage</text>
        </g>
      </g>
    </g>
  </g>

  ${mobileBottomNav('Explore', 390, 2036)}
</svg>`;
}

// -------------------------------------------------------------
// 7. Capacitor Android Home Screen (412 x 2000)
// (Strict Requirement: 40px Status Bar, No Install Button, Android Gesture Pill)
// -------------------------------------------------------------
function generateCapacitorAndroidHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="2000" viewBox="0 0 412 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="412" height="2000" fill="${BG_CREAM}"/>
  ${androidStatusBar(412)}

  <!-- Capacitor Header (56px) - NO Install Button -->
  <g id="Header_Capacitor" transform="translate(0, 40)">
    <rect width="412" height="56" fill="${BG_WHITE}"/>
    <line x1="0" y1="56" x2="412" y2="56" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(16, 12)">
      <rect width="32" height="32" rx="8" fill="${RED}"/>
      <text x="16" y="21" fill="#FFFFFF" font-size="15" font-weight="800" text-anchor="middle">P</text>
      <text x="40" y="22" fill="${TEXT_MAIN}" font-size="17" font-weight="800">PujoPath</text>
    </g>
    <!-- Controls (Theme & Lang only, NO Install Button in APK!) -->
    <g transform="translate(310, 12)">
      <rect width="34" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="17" y="20" font-size="13" text-anchor="middle">☀️</text>
      <rect x="42" width="44" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="64" y="20" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle" class="bengali">বাংলা</text>
    </g>
  </g>

  <!-- Content -->
  <g id="Capacitor_Home_Body" transform="translate(16, 116)">
    <!-- Hero Banner -->
    <rect width="380" height="240" rx="22" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(20, 24)">
      <rect width="140" height="24" rx="12" fill="${RED_SOFT}"/>
      <text x="70" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">🌸 172 Days to Pujo</text>
      <text x="0" y="60" fill="${TEXT_MAIN}" font-size="25" font-weight="800" class="title">Your Puja, made simple.</text>
      <text x="0" y="86" fill="${TEXT_SEC}" font-size="13">Explore Kolkata's grandest pandals with offline navigation.</text>

      <g transform="translate(0, 120)">
        <rect width="160" height="42" rx="12" fill="${RED}"/>
        <text x="80" y="26" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle">Find Pandals</text>

        <rect x="172" width="160" height="42" rx="12" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="252" y="26" fill="${TEXT_MAIN}" font-size="13" font-weight="600" text-anchor="middle">Build Route</text>
      </g>
    </g>

    <!-- Quick Access Guides -->
    <g transform="translate(0, 264)">
      <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800" class="title">Quick Access Guides</text>
      
      <g transform="translate(0, 34)">
        <rect width="380" height="66" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="18" y="42" font-size="24">🗺️</text>
        <text x="58" y="32" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Interactive Map</text>
        <text x="58" y="50" fill="${TEXT_MUTED}" font-size="12">774 pandals mapped across 8 zones</text>

        <rect y="78" width="380" height="66" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="18" y="120" font-size="24">🔀</text>
        <text x="58" y="110" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Route Planner</text>
        <text x="58" y="128" fill="${TEXT_MUTED}" font-size="12">Clustering algorithms &amp; distance savings</text>

        <rect y="156" width="380" height="66" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="18" y="198" font-size="24">🚇</text>
        <text x="58" y="188" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Metro Guide</text>
        <text x="58" y="206" fill="${TEXT_MUTED}" font-size="12">Normal &amp; 2026 Puja overnight schedules</text>

        <rect y="234" width="380" height="66" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="18" y="276" font-size="24">📅</text>
        <text x="58" y="266" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Sacred Calendar</text>
        <text x="58" y="284" fill="${TEXT_MUTED}" font-size="12">1433 Bengali schedule &amp; Sandhi Puja</text>
      </g>
    </g>

    <!-- Featured Pandal -->
    <g transform="translate(0, 620)">
      <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800" class="title">Featured Pandal</text>
      <g transform="translate(0, 34)">
        <rect width="380" height="310" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <rect width="380" height="150" rx="20" fill="#a82323"/>
        <text x="190" y="80" fill="#FFFFFF" font-size="15" font-weight="700" text-anchor="middle">Bagbazar Sarbojanin Photo</text>
        <g transform="translate(16, 170)">
          <rect width="90" height="22" rx="11" fill="${RED_SOFT}"/>
          <text x="45" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
          <text x="0" y="44" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Bagbazar Sarbojanin</text>
          <text x="0" y="66" fill="${TEXT_MUTED}" font-size="13" class="bengali">বাগবাজার সর্বজনীন দুর্গোৎসব</text>
          <text x="0" y="94" fill="${TEXT_SEC}" font-size="12">🚇 Shyambazar • 🚶 500m • 👥 High Crowd</text>
        </g>
      </g>
    </g>
  </g>

  ${mobileBottomNav('Home', 412, 1912)}
  ${androidGesturePill(412, 1976)}
</svg>`;
}

// -------------------------------------------------------------
// 8. Capacitor Android Calendar Screen (412 x 1950)
// -------------------------------------------------------------
function generateCapacitorAndroidCalendar() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="1950" viewBox="0 0 412 1950" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="412" height="1950" fill="${BG_CREAM}"/>
  ${androidStatusBar(412)}

  <!-- Capacitor Header -->
  <g id="Header_Capacitor" transform="translate(0, 40)">
    <rect width="412" height="56" fill="${BG_WHITE}"/>
    <line x1="0" y1="56" x2="412" y2="56" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(16, 12)">
      <rect width="32" height="32" rx="8" fill="${RED}"/>
      <text x="16" y="21" fill="#FFFFFF" font-size="15" font-weight="800" text-anchor="middle">P</text>
      <text x="40" y="22" fill="${TEXT_MAIN}" font-size="17" font-weight="800">PujoPath</text>
    </g>
    <g transform="translate(350, 12)">
      <rect width="44" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="22" y="20" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle" class="bengali">বাংলা</text>
    </g>
  </g>

  <!-- Calendar Content -->
  <g id="Capacitor_Calendar_Body" transform="translate(16, 116)">
    <rect width="140" height="24" rx="12" fill="${RED_SOFT}"/>
    <text x="70" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">📅 PUJA ALMANAC</text>
    <text x="0" y="56" fill="${TEXT_MAIN}" font-size="24" font-weight="800" class="title">Durga Puja 2026 Calendar</text>
    <text x="0" y="78" fill="${TEXT_SEC}" font-size="13">Exact Bengali 1433 tithi timings &amp; sandhi puja</text>

    <!-- SANDHI PUJA CARD -->
    <g transform="translate(0, 100)">
      <rect width="380" height="230" rx="20" fill="${BG_WHITE}" stroke="#fca5a5" stroke-width="2"/>
      <g transform="translate(16, 16)">
        <rect width="115" height="22" rx="11" fill="${RED_SOFT}"/>
        <text x="57" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">মহাসন্ধিক্ষণ ২০২৬</text>

        <rect x="125" width="135" height="22" rx="11" fill="${GOLD_SOFT}"/>
        <text x="192" y="15" fill="${GOLD}" font-size="10" font-weight="700" text-anchor="middle">108 Lotuses &amp; Lamps</text>

        <text x="0" y="58" fill="${TEXT_MAIN}" font-size="20" font-weight="800" class="title">Sandhi Puja Timings</text>
        <text x="0" y="80" fill="${TEXT_SEC}" font-size="12">48-minute sacred window calculated for Kolkata.</text>

        <g transform="translate(0, 96)">
          <rect width="348" height="42" rx="10" fill="#fff1f1" stroke="${RED}" stroke-width="1"/>
          <text x="14" y="26" font-size="16">🔥</text>
          <text x="36" y="26" fill="${RED}" font-size="12" font-weight="800">Mon, 19 Oct 2026 • 10:27 AM – 11:15 AM IST</text>
        </g>

        <g transform="translate(0, 148)">
          <text x="0" y="14" fill="${TEXT_MUTED}" font-size="11" font-weight="700">CONVENTION: Pure Almanac (বিশুদ্ধ সিদ্ধান্ত)</text>
        </g>
      </g>
    </g>

    <!-- SCHEDULE LIST -->
    <g transform="translate(0, 350)">
      <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800" class="title">Festival Dates</text>

      <g transform="translate(0, 34)">
        <!-- Day 1 -->
        <rect width="380" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="32" fill="${RED}" font-size="15" font-weight="800">10 Oct, Sat</text>
        <text x="16" y="52" fill="${TEXT_MUTED}" font-size="11">Amavasya</text>
        <text x="120" y="32" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Mahalaya (মহালয়া)</text>
        <text x="120" y="52" fill="${TEXT_SEC}" font-size="12">Tarpan &amp; Radio Broadcast 4:00 AM</text>

        <!-- Day 2 -->
        <rect y="86" width="380" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="118" fill="${RED}" font-size="15" font-weight="800">17 Oct, Sat</text>
        <text x="16" y="138" fill="${TEXT_MUTED}" font-size="11">Shashthi</text>
        <text x="120" y="118" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Maha Shashthi (মহাষষ্ঠী)</text>
        <text x="120" y="138" fill="${TEXT_SEC}" font-size="12">Bodhon &amp; Amantran 6:30 PM</text>

        <!-- Day 3 -->
        <rect y="172" width="380" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="204" fill="${RED}" font-size="15" font-weight="800">18 Oct, Sun</text>
        <text x="16" y="224" fill="${TEXT_MUTED}" font-size="11">Saptami</text>
        <text x="120" y="204" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Maha Saptami (মহাসপ্তমী)</text>
        <text x="120" y="224" fill="${TEXT_SEC}" font-size="12">Kola Bou Snan 6:15 AM</text>

        <!-- Day 4 -->
        <rect y="258" width="380" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="290" fill="${RED}" font-size="15" font-weight="800">19 Oct, Mon</text>
        <text x="16" y="310" fill="${TEXT_MUTED}" font-size="11">Ashtami</text>
        <text x="120" y="290" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Maha Ashtami &amp; Sandhi</text>
        <text x="120" y="310" fill="${RED}" font-size="12" font-weight="700">Sandhi Puja 10:27 AM</text>

        <!-- Day 5 -->
        <rect y="344" width="380" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="376" fill="${RED}" font-size="15" font-weight="800">20 Oct, Tue</text>
        <text x="16" y="396" fill="${TEXT_MUTED}" font-size="11">Navami</text>
        <text x="120" y="376" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Maha Navami (মহানবমী)</text>
        <text x="120" y="396" fill="${TEXT_SEC}" font-size="12">Navami Homa 10:30 AM</text>

        <!-- Day 6 -->
        <rect y="430" width="380" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="462" fill="${RED}" font-size="15" font-weight="800">21 Oct, Wed</text>
        <text x="16" y="482" fill="${TEXT_MUTED}" font-size="11">Dashami</text>
        <text x="120" y="462" fill="${TEXT_MAIN}" font-size="15" font-weight="700">Vijaya Dashami (বিজয়া)</text>
        <text x="120" y="482" fill="${TEXT_SEC}" font-size="12">Sindoor Khela &amp; Bisarjan</text>
      </g>
    </g>
  </g>

  ${mobileBottomNav('More', 412, 1862)}
  ${androidGesturePill(412, 1926)}
</svg>`;
}

// -------------------------------------------------------------
// 9. Capacitor Android Explore Screen (412 x 2100)
// -------------------------------------------------------------
function generateCapacitorAndroidExplore() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="412" height="2100" viewBox="0 0 412 2100" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="412" height="2100" fill="${BG_CREAM}"/>
  ${androidStatusBar(412)}

  <!-- Capacitor Header -->
  <g id="Header_Capacitor" transform="translate(0, 40)">
    <rect width="412" height="56" fill="${BG_WHITE}"/>
    <line x1="0" y1="56" x2="412" y2="56" stroke="${BORDER}" stroke-width="1"/>
    <g transform="translate(16, 12)">
      <rect width="32" height="32" rx="8" fill="${RED}"/>
      <text x="16" y="21" fill="#FFFFFF" font-size="15" font-weight="800" text-anchor="middle">P</text>
      <text x="40" y="22" fill="${TEXT_MAIN}" font-size="17" font-weight="800">PujoPath</text>
    </g>
    <g transform="translate(350, 12)">
      <rect width="44" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="22" y="20" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle" class="bengali">বাংলা</text>
    </g>
  </g>

  <!-- Body -->
  <g id="Capacitor_Explore_Body" transform="translate(16, 116)">
    <text x="0" y="20" fill="${TEXT_MAIN}" font-size="24" font-weight="800" class="title">Explore Pandals</text>
    <text x="0" y="42" fill="${TEXT_MUTED}" font-size="13">774 pandals mapped with offline GPS</text>

    <!-- Search Input -->
    <g transform="translate(0, 58)">
      <rect width="380" height="46" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="16" y="28" font-size="16">🔍</text>
      <text x="44" y="28" fill="${TEXT_MUTED}" font-size="13">Search pandal, area, or metro...</text>
    </g>

    <!-- Zone Filter Pills -->
    <g transform="translate(0, 116)">
      <rect x="0" width="80" height="32" rx="16" fill="${RED}"/>
      <text x="40" y="21" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">All (774)</text>

      <rect x="88" width="95" height="32" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="135" y="21" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">North (182)</text>

      <rect x="191" width="95" height="32" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="238" y="21" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">South (214)</text>

      <rect x="294" width="84" height="32" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="336" y="21" fill="${TEXT_MAIN}" font-size="12" font-weight="600" text-anchor="middle">Central</text>
    </g>

    <!-- Pandal Cards Stack -->
    <g transform="translate(0, 164)">
      <!-- Card 1 -->
      <g transform="translate(0, 0)">
        <rect width="380" height="310" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <rect width="380" height="150" rx="20" fill="#a82323"/>
        <text x="190" y="80" fill="#FFFFFF" font-size="15" font-weight="700" text-anchor="middle">Bagbazar Sarbojanin Photo</text>
        <g transform="translate(16, 168)">
          <rect width="90" height="22" rx="11" fill="${RED_SOFT}"/>
          <text x="45" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
          <text x="0" y="44" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Bagbazar Sarbojanin</text>
          <text x="0" y="66" fill="${TEXT_MUTED}" font-size="13" class="bengali">বাগবাজার সর্বজনীন দুর্গোৎসব</text>
          <text x="0" y="92" fill="${TEXT_SEC}" font-size="12">🚇 Shyambazar • 🚶 500m • 👥 High Crowd</text>
        </g>
      </g>

      <!-- Card 2 -->
      <g transform="translate(0, 326)">
        <rect width="380" height="310" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <rect width="380" height="150" rx="20" fill="#c2410c"/>
        <text x="190" y="80" fill="#FFFFFF" font-size="15" font-weight="700" text-anchor="middle">Kumartuli Park Photo</text>
        <g transform="translate(16, 168)">
          <rect width="90" height="22" rx="11" fill="${RED_SOFT}"/>
          <text x="45" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">North Kolkata</text>
          <text x="0" y="44" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Kumartuli Park</text>
          <text x="0" y="66" fill="${TEXT_MUTED}" font-size="13" class="bengali">কুমারটুলি পার্ক সার্বজনীন</text>
          <text x="0" y="92" fill="${TEXT_SEC}" font-size="12">🚇 Sovabazar • 🚶 650m • 👥 Very High</text>
        </g>
      </g>

      <!-- Card 3 -->
      <g transform="translate(0, 652)">
        <rect width="380" height="310" rx="20" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <rect width="380" height="150" rx="20" fill="#b45309"/>
        <text x="190" y="80" fill="#FFFFFF" font-size="15" font-weight="700" text-anchor="middle">Sovabazar Rajbari Photo</text>
        <g transform="translate(16, 168)">
          <rect width="85" height="22" rx="11" fill="${RED_SOFT}"/>
          <text x="42" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">Bonedi Bari</text>
          <text x="0" y="44" fill="${TEXT_MAIN}" font-size="18" font-weight="800">Sovabazar Rajbari</text>
          <text x="0" y="66" fill="${TEXT_MUTED}" font-size="13" class="bengali">শোভাবাজার রাজবাড়ি</text>
          <text x="0" y="92" fill="${TEXT_SEC}" font-size="12">🚇 Sovabazar • 🚶 400m • 👥 Heritage</text>
        </g>
      </g>
    </g>
  </g>

  ${mobileBottomNav('Explore', 412, 2012)}
  ${androidGesturePill(412, 2076)}
</svg>`;
}

// -------------------------------------------------------------
// Runner: Write all new screens to exports/
// -------------------------------------------------------------
const exportsList = [
  // Format A: Web Desktop
  { path: path.join(EXPORTS_DIR, 'web-desktop', '03_web_desktop_explore.svg'), content: generateWebDesktopExplore() },
  { path: path.join(EXPORTS_DIR, 'web-desktop', '04_web_desktop_calendar.svg'), content: generateWebDesktopCalendar() },
  { path: path.join(EXPORTS_DIR, 'web-desktop', '05_web_desktop_planner.svg'), content: generateWebDesktopPlanner() },
  { path: path.join(EXPORTS_DIR, 'web-desktop', '06_web_desktop_metro.svg'), content: generateWebDesktopMetro() },

  // Format B: Web Mobile
  { path: path.join(EXPORTS_DIR, 'web-mobile', '02_web_mobile_developer.svg'), content: generateWebMobileDeveloper() },
  { path: path.join(EXPORTS_DIR, 'web-mobile', '03_web_mobile_explore.svg'), content: generateWebMobileExplore() },

  // Format C: Capacitor Android Mobile
  { path: path.join(EXPORTS_DIR, 'capacitor-mobile', '04_capacitor_android_home.svg'), content: generateCapacitorAndroidHome() },
  { path: path.join(EXPORTS_DIR, 'capacitor-mobile', '05_capacitor_android_calendar.svg'), content: generateCapacitorAndroidCalendar() },
  { path: path.join(EXPORTS_DIR, 'capacitor-mobile', '06_capacitor_android_explore.svg'), content: generateCapacitorAndroidExplore() }
];

for (const e of exportsList) {
  fs.writeFileSync(e.path, e.content, 'utf8');
  console.log(`Exported: ${path.relative(FIGMA_DIR, e.path)} (${e.content.length} bytes)`);
}

console.log('Complete set of Figma SVG screen deliverables exported successfully.');
