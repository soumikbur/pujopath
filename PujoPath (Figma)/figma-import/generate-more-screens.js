const fs = require('fs');
const path = require('path');

const FIGMA_DIR = path.resolve(__dirname, '..');
const EXPORTS_DIR = path.join(FIGMA_DIR, 'exports');

const RED = '#b42323';
const RED_SOFT = '#fdeeee';
const BG_CREAM = '#FCFAF7';
const BG_WHITE = '#FFFFFF';
const BG_SURFACE = '#F5F1EB';
const TEXT_MAIN = '#242424';
const TEXT_SEC = '#5C524A';
const TEXT_MUTED = '#7E7268';
const BORDER = '#E8E1D9';
const BORDER_LIGHT = '#F0EAE2';
const GOLD = '#d97706';
const GOLD_SOFT = '#fef3c7';

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

function mobileHeader() {
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
    <g transform="translate(250, 12)">
      <rect width="50" height="32" rx="8" fill="${RED}"/>
      <text x="25" y="20" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">App</text>
      <rect x="58" width="34" height="32" rx="8" fill="${BG_SURFACE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="75" y="20" fill="${RED}" font-size="11" font-weight="700" text-anchor="middle" class="bengali">বাং</text>
    </g>
  </g>
  `;
}

function mobileBottomNav(activeTab, y = 1936) {
  const tabs = ['Home', 'Explore', 'Map', 'Planner', 'More'];
  const icons = { Home: '🏠', Explore: '🧭', Map: '🗺️', Planner: '🔀', More: '⋯' };
  const step = 390 / 5;

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
    <rect width="390" height="64" fill="${BG_WHITE}"/>
    <line x1="0" y1="0" x2="390" y2="0" stroke="${BORDER}" stroke-width="1"/>
    ${tabsSvg}
  </g>
  `;
}

function generateWebMobileCalendar() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1900" viewBox="0 0 390 1900" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="1900" fill="${BG_CREAM}"/>
  ${mobileHeader()}

  <g id="Calendar_Mobile_Content" transform="translate(16, 76)">
    <rect width="130" height="24" rx="12" fill="${RED_SOFT}"/>
    <text x="65" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">📅 PUJA ALMANAC</text>
    <text x="0" y="56" fill="${TEXT_MAIN}" font-size="24" font-weight="800" class="title">Durga Puja Calendar</text>
    <text x="0" y="78" fill="${TEXT_SEC}" font-size="13">Exact 1433 Bengali tithis &amp; sandhi puja</text>

    <!-- Sandhi Puja Mobile Card -->
    <g transform="translate(0, 96)">
      <rect width="358" height="230" rx="20" fill="${BG_WHITE}" stroke="#fca5a5" stroke-width="2"/>
      <g transform="translate(16, 16)">
        <rect width="115" height="22" rx="11" fill="${RED_SOFT}"/>
        <text x="57" y="15" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">মহাসন্ধিক্ষণ ২০২৬</text>

        <rect x="125" width="135" height="22" rx="11" fill="${GOLD_SOFT}"/>
        <text x="192" y="15" fill="${GOLD}" font-size="10" font-weight="700" text-anchor="middle">108 Lotuses &amp; Lamps</text>

        <text x="0" y="58" fill="${TEXT_MAIN}" font-size="20" font-weight="800" class="title">Sandhi Puja Timings</text>
        <text x="0" y="80" fill="${TEXT_SEC}" font-size="12">48-minute sacred window calculated for Kolkata.</text>

        <g transform="translate(0, 96)">
          <rect width="326" height="42" rx="10" fill="#fff1f1" stroke="${RED}" stroke-width="1"/>
          <text x="14" y="26" font-size="16">🔥</text>
          <text x="36" y="26" fill="${RED}" font-size="12" font-weight="800">Mon, 19 Oct 2026 • 10:27 AM – 11:15 AM</text>
        </g>
        <g transform="translate(0, 148)">
          <text x="0" y="14" fill="${TEXT_MUTED}" font-size="11" font-weight="700">CONVENTION: Pure Almanac (বিশুদ্ধ সিদ্ধান্ত)</text>
        </g>
      </g>
    </g>

    <!-- Dates List -->
    <g transform="translate(0, 346)">
      <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800" class="title">Festival Dates</text>

      <g transform="translate(0, 34)">
        <rect width="358" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="32" fill="${RED}" font-size="14" font-weight="800">10 Oct, Sat</text>
        <text x="16" y="52" fill="${TEXT_MUTED}" font-size="11">Amavasya</text>
        <text x="110" y="32" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Mahalaya (মহালয়া)</text>
        <text x="110" y="52" fill="${TEXT_SEC}" font-size="12">Tarpan &amp; Radio Broadcast 4:00 AM</text>

        <rect y="84" width="358" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="116" fill="${RED}" font-size="14" font-weight="800">17 Oct, Sat</text>
        <text x="16" y="136" fill="${TEXT_MUTED}" font-size="11">Shashthi</text>
        <text x="110" y="116" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Maha Shashthi (মহাষষ্ঠী)</text>
        <text x="110" y="136" fill="${TEXT_SEC}" font-size="12">Bodhon &amp; Amantran 6:30 PM</text>

        <rect y="168" width="358" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="200" fill="${RED}" font-size="14" font-weight="800">18 Oct, Sun</text>
        <text x="16" y="220" fill="${TEXT_MUTED}" font-size="11">Saptami</text>
        <text x="110" y="200" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Maha Saptami (মহাসপ্তমী)</text>
        <text x="110" y="220" fill="${TEXT_SEC}" font-size="12">Kola Bou Snan 6:15 AM</text>

        <rect y="252" width="358" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="284" fill="${RED}" font-size="14" font-weight="800">19 Oct, Mon</text>
        <text x="16" y="304" fill="${TEXT_MUTED}" font-size="11">Ashtami</text>
        <text x="110" y="284" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Maha Ashtami &amp; Sandhi</text>
        <text x="110" y="304" fill="${RED}" font-size="12" font-weight="700">Sandhi Puja 10:27 AM</text>

        <rect y="336" width="358" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="368" fill="${RED}" font-size="14" font-weight="800">20 Oct, Tue</text>
        <text x="16" y="388" fill="${TEXT_MUTED}" font-size="11">Navami</text>
        <text x="110" y="368" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Maha Navami (মহানবমী)</text>
        <text x="110" y="388" fill="${TEXT_SEC}" font-size="12">Navami Homa 10:30 AM</text>

        <rect y="420" width="358" height="74" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <text x="16" y="452" fill="${RED}" font-size="14" font-weight="800">21 Oct, Wed</text>
        <text x="16" y="472" fill="${TEXT_MUTED}" font-size="11">Dashami</text>
        <text x="110" y="452" fill="${TEXT_MAIN}" font-size="14" font-weight="700">Vijaya Dashami (বিজয়া)</text>
        <text x="110" y="472" fill="${TEXT_SEC}" font-size="12">Sindoor Khela &amp; Bisarjan</text>
      </g>
    </g>
  </g>

  ${mobileBottomNav('More', 1836)}
</svg>`;
}

function generateWebMobilePlanner() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="1700" viewBox="0 0 390 1700" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS}
  <rect width="390" height="1700" fill="${BG_CREAM}"/>
  ${mobileHeader()}

  <g id="Planner_Mobile_Content" transform="translate(16, 76)">
    <rect width="135" height="24" rx="12" fill="${RED_SOFT}"/>
    <text x="67" y="16" fill="${RED}" font-size="10" font-weight="700" text-anchor="middle">🔀 ROUTE PLANNER</text>
    <text x="0" y="56" fill="${TEXT_MAIN}" font-size="24" font-weight="800" class="title">My Walking Route</text>
    <text x="0" y="78" fill="${TEXT_SEC}" font-size="13">Smart clustering route with minimal walking.</text>

    <!-- Metrics Card -->
    <g transform="translate(0, 96)">
      <rect width="358" height="84" rx="18" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <g transform="translate(16, 16)">
        <text x="0" y="16" fill="${TEXT_MUTED}" font-size="10" font-weight="700">STOPS</text>
        <text x="0" y="34" fill="${TEXT_MAIN}" font-size="16" font-weight="800">3 Pandals</text>

        <text x="85" y="16" fill="${TEXT_MUTED}" font-size="10" font-weight="700">DISTANCE</text>
        <text x="85" y="34" fill="${TEXT_MAIN}" font-size="16" font-weight="800">2.4 km</text>

        <text x="175" y="16" fill="${TEXT_MUTED}" font-size="10" font-weight="700">TIME</text>
        <text x="175" y="34" fill="${TEXT_MAIN}" font-size="16" font-weight="800">38 mins</text>

        <text x="245" y="16" fill="${TEXT_MUTED}" font-size="10" font-weight="700">SAVINGS</text>
        <text x="245" y="34" fill="${RED}" font-size="15" font-weight="800">1.2 km ⚡</text>
      </g>
    </g>

    <!-- Optimize Button CTA -->
    <g transform="translate(0, 192)">
      <rect width="358" height="46" rx="14" fill="${RED}"/>
      <text x="179" y="28" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">⚡ Optimize Stop Order</text>
    </g>

    <!-- Stops Stack -->
    <g transform="translate(0, 256)">
      <text x="0" y="20" fill="${TEXT_MAIN}" font-size="18" font-weight="800" class="title">Stop Sequence</text>

      <g transform="translate(0, 34)">
        <!-- Stop 1 -->
        <rect width="358" height="80" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
        <circle cx="36" cy="40" r="16" fill="${RED}"/>
        <text x="36" y="45" fill="#FFFFFF" font-size="13" font-weight="800" text-anchor="middle">1</text>
        <g transform="translate(68, 20)">
          <text x="0" y="16" fill="${TEXT_MAIN}" font-size="15" font-weight="800">Bagbazar Sarbojanin</text>
          <text x="0" y="34" fill="${TEXT_MUTED}" font-size="12">Shyambazar Metro • 500m walk</text>
        </g>

        <!-- Connector -->
        <line x1="36" y1="84" x2="36" y2="108" stroke="${RED}" stroke-width="2" stroke-dasharray="3 3"/>
        <text x="56" y="100" fill="${TEXT_MUTED}" font-size="11">🚶 650m (8 mins walk)</text>

        <!-- Stop 2 -->
        <g transform="translate(0, 114)">
          <rect width="358" height="80" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
          <circle cx="36" cy="40" r="16" fill="${RED}"/>
          <text x="36" y="45" fill="#FFFFFF" font-size="13" font-weight="800" text-anchor="middle">2</text>
          <g transform="translate(68, 20)">
            <text x="0" y="16" fill="${TEXT_MAIN}" font-size="15" font-weight="800">Kumartuli Park</text>
            <text x="0" y="34" fill="${TEXT_MUTED}" font-size="12">Sovabazar Metro • 650m walk</text>
          </g>
        </g>

        <!-- Connector -->
        <line x1="36" y1="198" x2="36" y2="222" stroke="${RED}" stroke-width="2" stroke-dasharray="3 3"/>
        <text x="56" y="214" fill="${TEXT_MUTED}" font-size="11">🚶 400m (5 mins walk)</text>

        <!-- Stop 3 -->
        <g transform="translate(0, 228)">
          <rect width="358" height="80" rx="16" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
          <circle cx="36" cy="40" r="16" fill="${RED}"/>
          <text x="36" y="45" fill="#FFFFFF" font-size="13" font-weight="800" text-anchor="middle">3</text>
          <g transform="translate(68, 20)">
            <text x="0" y="16" fill="${TEXT_MAIN}" font-size="15" font-weight="800">Sovabazar Rajbari</text>
            <text x="0" y="34" fill="${TEXT_MUTED}" font-size="12">Bonedi Bari • Sovabazar Metro • 400m</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Export Action -->
    <g transform="translate(0, 610)">
      <rect width="358" height="46" rx="14" fill="${BG_WHITE}" stroke="${BORDER}" stroke-width="1"/>
      <text x="179" y="28" fill="${TEXT_MAIN}" font-size="13" font-weight="700" text-anchor="middle">🗺️ Open Turn-by-Turn in Google Maps ↗</text>
    </g>
  </g>

  ${mobileBottomNav('Planner', 1636)}
</svg>`;
}

fs.writeFileSync(path.join(EXPORTS_DIR, 'web-mobile', '04_web_mobile_calendar.svg'), generateWebMobileCalendar(), 'utf8');
fs.writeFileSync(path.join(EXPORTS_DIR, 'web-mobile', '05_web_mobile_planner.svg'), generateWebMobilePlanner(), 'utf8');

console.log('Generated web-mobile calendar and planner successfully.');
