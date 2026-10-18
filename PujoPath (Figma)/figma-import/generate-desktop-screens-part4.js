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

// 09. MEET THE DEVELOPERS (1440 x 1220 px)
function generateDeveloper() {
  const W = 1440;
  const H = 1220;

  const moumitaPills = ['User Interface Design', 'Frontend Architecture', 'Responsive Layouts', 'User Experience (UX)', 'Visual Consistency', 'Cultural Curation', 'Frontend Interaction Design'];
  const soumikPills = ['Backend Architecture', 'Core Application Logic', 'System Architecture', 'Route Optimization Algorithms', 'Offline-First Transit', 'Backend Integrations', 'Performance & Reliability'];

  function renderPills(pills) {
    let svg = '';
    let curX = 0;
    let curY = 0;
    pills.forEach((p, i) => {
      const pWidth = p.length * 7 + 24;
      if (curX + pWidth > 516) {
        curX = 0;
        curY += 32;
      }
      svg += `
        <g transform="translate(${curX}, ${curY})">
          <rect width="${pWidth}" height="26" rx="8" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="${pWidth / 2}" y="17" fill="${C.textMain}" font-size="10" font-weight="600" text-anchor="middle">${p}</text>
        </g>
      `;
      curX += pWidth + 8;
    });
    return svg;
  }

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderBackground(H)}
  ${renderHeader('Explore')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${C.redPillText}" font-size="12" font-weight="700" letter-spacing="1">🧑‍🤝‍🧑 PROJECT CO-CREATORS</text>
    <text x="0" y="54" fill="${C.textMain}" font-size="34" font-weight="800">Meet the Developers</text>
    <text x="0" y="82" fill="${C.textMuted}" font-size="14">PujoPath is a collaborative project co-created by Soumik and Moumita to help people discover Kolkata's Durga Puja pandals and plan their festive experiences.</text>

    <!-- 2 Profile Cards Side-by-Side (w: 564, h: 540) -->
    <g transform="translate(0, 114)">
      <!-- Left Card: Moumita -->
      <g transform="translate(0, 0)">
        <rect width="564" height="540" rx="20" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 24)">
          <!-- Photo Left -->
          <clipPath id="devMoumita"><rect width="104" height="104" rx="16"/></clipPath>
          <image href="${ASSETS.moumita}" width="104" height="104" preserveAspectRatio="xMidYMid slice" clip-path="url(#devMoumita)"/>
          <circle cx="94" cy="94" r="12" fill="${C.red}"/>
          <text x="94" y="98" fill="#FFFFFF" font-size="10" text-anchor="middle">🎨</text>

          <!-- Header Right -->
          <g transform="translate(124, 6)">
            <rect width="84" height="20" rx="10" fill="${C.redPillBg}" stroke="${C.redPillBorder}" stroke-width="1"/>
            <text x="42" y="14" fill="${C.redPillText}" font-size="9" font-weight="700" text-anchor="middle">✦ Co-Creator</text>

            <text x="0" y="46" fill="${C.textMain}" font-size="24" font-weight="800">Moumita</text>
            <text x="0" y="68" fill="${C.redPillText}" font-size="13" font-weight="700">UI &amp; Frontend Lead</text>
          </g>

          <!-- Bio -->
          <text x="0" y="136" fill="${C.textMuted}" font-size="12">Directs user interface design, frontend architecture, responsive layouts, user experience, visual consistency, and interaction design, alongside research and curation of Kolkata's historic Bonedi Bari traditions and cultural festival narratives.</text>

          <!-- Key Responsibilities -->
          <g transform="translate(0, 204)">
            <text x="0" y="14" fill="${C.textMuted}" font-size="10" font-weight="700" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
            <g transform="translate(0, 28)">
              ${renderPills(moumitaPills)}
            </g>
          </g>

          <!-- Bottom Row: Profile & LinkedIn -->
          <g transform="translate(0, 440)">
            <line x1="0" y1="0" x2="516" y2="0" stroke="${C.cardBorder}" stroke-width="1"/>
            <text x="0" y="32" fill="${C.textMuted}" font-size="12">Professional Profile</text>
            <rect x="396" y="12" width="120" height="36" rx="10" fill="${C.blueBtn}"/>
            <text x="456" y="34" fill="${C.white}" font-size="12" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>

      <!-- Right Card: Soumik -->
      <g transform="translate(588, 0)">
        <rect width="564" height="540" rx="20" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 24)">
          <!-- Photo Left -->
          <clipPath id="devSoumik"><rect width="104" height="104" rx="16"/></clipPath>
          <image href="${ASSETS.soumik}" width="104" height="104" preserveAspectRatio="xMidYMid slice" clip-path="url(#devSoumik)"/>
          <circle cx="94" cy="94" r="12" fill="${C.red}"/>
          <text x="94" y="98" fill="#FFFFFF" font-size="10" text-anchor="middle">&lt;/&gt;</text>

          <!-- Header Right -->
          <g transform="translate(124, 6)">
            <rect width="84" height="20" rx="10" fill="${C.redPillBg}" stroke="${C.redPillBorder}" stroke-width="1"/>
            <text x="42" y="14" fill="${C.redPillText}" font-size="9" font-weight="700" text-anchor="middle">✦ Co-Creator</text>

            <text x="0" y="46" fill="${C.textMain}" font-size="24" font-weight="800">Soumik</text>
            <text x="0" y="68" fill="${C.redPillText}" font-size="13" font-weight="700">Backend &amp; Systems Lead</text>
          </g>

          <!-- Bio -->
          <text x="0" y="136" fill="${C.textMuted}" font-size="12">Directs backend &amp; systems architecture, core application logic, route optimization algorithms, offline-first transit functionality, backend integrations, and platform performance &amp; reliability.</text>

          <!-- Key Responsibilities -->
          <g transform="translate(0, 204)">
            <text x="0" y="14" fill="${C.textMuted}" font-size="10" font-weight="700" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
            <g transform="translate(0, 28)">
              ${renderPills(soumikPills)}
            </g>
          </g>

          <!-- Bottom Row: Profile & LinkedIn -->
          <g transform="translate(0, 440)">
            <line x1="0" y1="0" x2="516" y2="0" stroke="${C.cardBorder}" stroke-width="1"/>
            <text x="0" y="32" fill="${C.textMuted}" font-size="12">Professional Profile</text>
            <rect x="396" y="12" width="120" height="36" rx="10" fill="${C.blueBtn}"/>
            <text x="456" y="34" fill="${C.white}" font-size="12" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Feedback & Suggestions Banner (w: 1152, h: 104) -->
    <g transform="translate(0, 680)">
      <rect width="1152" height="104" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 20)">
        <text x="0" y="18" fill="${C.blueLine}" font-size="11" font-weight="700" letter-spacing="0.5">💬 FEEDBACK &amp; SUGGESTIONS</text>
        <text x="0" y="44" fill="${C.textMain}" font-size="18" font-weight="800">Have feedback or suggestions for the team?</text>
        <text x="0" y="66" fill="${C.textMuted}" font-size="12">Share ideas, report bugs, or request features directly via our dedicated feedback channel.</text>

        <rect x="948" y="16" width="156" height="42" rx="12" fill="${C.blueBtn}"/>
        <text x="1026" y="42" fill="${C.white}" font-size="13" font-weight="700" text-anchor="middle">💬 Share Feedback</text>
      </g>
    </g>
  </g>

  ${renderFooter(900)}
</svg>
`;
}

// 10. ABOUT & SAFETY GUIDE (1440 x 1420 px)
function generateAbout() {
  const W = 1440;
  const H = 1420;

  const helplines = [
    { title: 'Kolkata Police Emergency', sub: 'Central emergency response', num: '100 / 112' },
    { title: 'Kolkata Traffic Police Helpline', sub: 'Traffic & road advisories', num: '1073 / 033-2214-3644' },
    { title: 'Women Helpline', sub: '24×7 special assistance for women', num: '1091 / 181' },
    { title: 'Ambulance Emergency Services', sub: 'Immediate medical ambulance', num: '102 / 108' },
    { title: 'Fire & Rescue Services', sub: 'Fire rescue department', num: '101' },
    { title: 'Kolkata Metro Rail Helpdesk', sub: 'Metro transit helpline', num: '033-2226-7285' }
  ];

  let hCards = '';
  helplines.forEach((h, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const hx = col * 588;
    const hy = row * 104;
    hCards += `
      <g transform="translate(${hx}, ${hy})">
        <rect width="564" height="92" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="24" y="32" fill="${C.textMain}" font-size="15" font-weight="800">${h.title}</text>
        <text x="24" y="52" fill="${C.textMuted}" font-size="11">${h.sub}</text>
        <text x="24" y="74" fill="${C.redPillText}" font-size="15" font-weight="800">${h.num}</text>

        <rect x="504" y="24" width="36" height="36" rx="18" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="522" y="46" fill="${C.redPillText}" font-size="14" text-anchor="middle">📞</text>
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
    <text x="0" y="20" fill="${C.redPillText}" font-size="12" font-weight="700" letter-spacing="1">ℹ SAFETY &amp; ASSISTANCE</text>
    <text x="0" y="54" fill="${C.textMain}" font-size="34" font-weight="800">Emergency Helplines &amp; Safety Guide</text>
    <text x="0" y="82" fill="${C.textMuted}" font-size="14">Official 24×7 emergency contacts and essential guidance for safe and smooth pandal hopping.</text>

    <!-- 6 Helplines Grid -->
    <g transform="translate(0, 114)">
      ${hCards}
    </g>

    <!-- Essential Tips Card -->
    <g transform="translate(0, 450)">
      <rect width="1152" height="170" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 20)">
        <text x="0" y="18" fill="${C.red}" font-size="15">🛡</text>
        <text x="24" y="18" fill="${C.textMain}" font-size="16" font-weight="800">Essential Pandal Hopping Tips</text>
        
        <text x="0" y="48" fill="${C.textMuted}" font-size="12">•  Use the Kolkata Metro (Blue &amp; Green lines) to travel between major hubs and bypass road traffic.</text>
        <text x="0" y="72" fill="${C.textMuted}" font-size="12">•  Visit high-crowd pandals during morning hours (8 AM – 12 PM) for minimal queues and peaceful Darshan.</text>
        <text x="0" y="96" fill="${C.textMuted}" font-size="12">•  Carry reusable water bottles and stay hydrated while hopping.</text>
        <text x="0" y="120" fill="${C.textMuted}" font-size="12">•  In case of overcrowding or emergency, reach out to the nearest Kolkata Police May I Help You kiosk.</text>
      </g>
    </g>

    <!-- About PujoPath Card -->
    <g transform="translate(0, 640)">
      <rect width="1152" height="150" rx="18" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 20)">
        <text x="0" y="18" fill="${C.redPillText}" font-size="11" font-weight="700">ℹ ABOUT THE INITIATIVE</text>
        <text x="0" y="44" fill="${C.textMain}" font-size="20" font-weight="800">About PujoPath</text>
        <text x="0" y="68" fill="${C.textMuted}" font-size="12">PujoPath is a collaborative project co-created by Soumik and Moumita to help people discover Kolkata's Durga</text>
        <text x="0" y="86" fill="${C.textMuted}" font-size="12">Puja pandals and plan their festive experiences.</text>

        <g transform="translate(0, 104)">
          <rect width="180" height="34" rx="10" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="90" y="22" fill="${C.textMain}" font-size="11" font-weight="700" text-anchor="middle">🧑‍🤝‍🧑 Meet the Developers</text>

          <rect x="194" y="0" width="160" height="34" rx="10" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
          <text x="274" y="22" fill="${C.blueLine}" font-size="11" font-weight="700" text-anchor="middle">💬 Share Feedback</text>
        </g>
      </g>
    </g>
  </g>

  ${renderFooter(900)}
</svg>
`;
}

// 11. SHARE FEEDBACK (1440 x 1120 px)
function generateFeedback() {
  const W = 1440;
  const H = 1120;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderBackground(H)}
  ${renderHeader('Explore')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${C.redPillText}" font-size="12" font-weight="700" letter-spacing="1">💬 FEEDBACK &amp; SUGGESTIONS</text>
    <text x="0" y="54" fill="${C.textMain}" font-size="34" font-weight="800">Share Your Feedback</text>
    <text x="0" y="82" fill="${C.textMuted}" font-size="14">Have suggestions, corrections, or new features to suggest? Send your feedback directly via email.</text>

    <!-- Main Action Card -->
    <g transform="translate(0, 114)">
      <rect width="1152" height="160" rx="20" fill="${C.cardBg}" stroke="${C.blueBtn}" stroke-width="1.5"/>
      <g transform="translate(32, 28)">
        <rect width="96" height="22" rx="11" fill="${C.blueBtn}" fill-opacity="0.2"/>
        <text x="48" y="15" fill="#93c5fd" font-size="10" font-weight="700" text-anchor="middle">✉ Direct Email</text>

        <text x="0" y="56" fill="${C.textMain}" font-size="22" font-weight="800">Send Feedback via Email</text>
        <text x="0" y="80" fill="${C.textMuted}" font-size="13">Messages go directly to soumik.bur@gmail.com. We review all feedback, pandal</text>
        <text x="0" y="98" fill="${C.textMuted}" font-size="13">updates, and community suggestions promptly.</text>

        <rect x="880" y="32" width="200" height="44" rx="12" fill="${C.blueBtn}"/>
        <text x="980" y="59" fill="${C.white}" font-size="13" font-weight="700" text-anchor="middle">✉ Send Feedback Email ↗</text>
      </g>
    </g>

    <!-- What You Can Share Header & 3 Cards -->
    <g transform="translate(0, 298)">
      <text x="0" y="16" fill="${C.textMuted}" font-size="11" font-weight="700" letter-spacing="0.5">WHAT YOU CAN SHARE</text>
      
      <g transform="translate(0, 28)">
        <!-- Card 1 -->
        <rect width="368" height="150" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
        <circle cx="36" cy="36" r="16" fill="${C.redPillBg}"/>
        <text x="36" y="41" fill="${C.redPillText}" font-size="12" text-anchor="middle">🐞</text>
        <text x="20" y="78" fill="${C.textMain}" font-size="15" font-weight="800">Report an Issue / Bug</text>
        <text x="20" y="100" fill="${C.textMuted}" font-size="11">Spotted an incorrect timing, location issue,</text>
        <text x="20" y="116" fill="${C.textMuted}" font-size="11">or broken feature? Let us know so we can fix it.</text>

        <!-- Card 2 -->
        <g transform="translate(392, 0)">
          <rect width="368" height="150" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
          <circle cx="36" cy="36" r="16" fill="${C.redPillBg}"/>
          <text x="36" y="41" fill="${C.redPillText}" font-size="12" text-anchor="middle">💡</text>
          <text x="20" y="78" fill="${C.textMain}" font-size="15" font-weight="800">Feature Suggestions</text>
          <text x="20" y="100" fill="${C.textMuted}" font-size="11">Have ideas for new filters, transit</text>
          <text x="20" y="116" fill="${C.textMuted}" font-size="11">enhancements, or interactive tools for hoppers?</text>
        </g>

        <!-- Card 3 -->
        <g transform="translate(784, 0)">
          <rect width="368" height="150" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
          <circle cx="36" cy="36" r="16" fill="${C.redPillBg}"/>
          <text x="36" y="41" fill="${C.redPillText}" font-size="12" text-anchor="middle">🤝</text>
          <text x="20" y="78" fill="${C.textMain}" font-size="15" font-weight="800">Community Collaboration</text>
          <text x="20" y="100" fill="${C.textMuted}" font-size="11">Want to contribute photographs, club</text>
          <text x="20" y="116" fill="${C.textMuted}" font-size="11">details, or community itineraries? Connect with us.</text>
        </g>
      </g>
    </g>

    <!-- Bottom Project Creators Banner -->
    <g transform="translate(0, 508)">
      <rect width="1152" height="90" rx="16" fill="${C.cardBg}" stroke="${C.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 20)">
        <text x="0" y="16" fill="${C.redPillText}" font-size="10" font-weight="700">🧑‍🤝‍🧑 PROJECT CREATORS</text>
        <text x="0" y="38" fill="${C.textMain}" font-size="16" font-weight="800">Want to meet the creators behind PujoPath?</text>
        <text x="0" y="54" fill="${C.textMuted}" font-size="11">Learn more about Soumik and Moumita and explore their professional profiles.</text>

        <rect x="960" y="12" width="160" height="38" rx="10" fill="${C.cardElevated}" stroke="${C.cardBorder}" stroke-width="1"/>
        <text x="1040" y="36" fill="${C.textMain}" font-size="12" font-weight="700" text-anchor="middle">🧑‍🤝‍🧑 Meet Developers</text>
      </g>
    </g>
  </g>

  ${renderFooter(730)}
</svg>
`;
}

fs.writeFileSync(path.join(OUT_DIR, '09_web_desktop_developer.svg'), generateDeveloper().trim());
fs.writeFileSync(path.join(OUT_DIR, '10_web_desktop_about.svg'), generateAbout().trim());
fs.writeFileSync(path.join(OUT_DIR, '11_web_desktop_feedback.svg'), generateFeedback().trim());
console.log('✓ 09_web_desktop_developer.svg, 10_web_desktop_about.svg, 11_web_desktop_feedback.svg generated');
