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

// 09. MEET THE DEVELOPERS LIGHT (1440 x 1220 px)
function generateDeveloperLight() {
  const W = 1440;
  const H = 1220;

  const moumitaPills = ['User Interface Design', 'Frontend Architecture', 'Responsive Layouts', 'User Experience (UX)', 'Visual Consistency', 'Cultural Curation', 'Frontend Interaction Design'];
  const soumikPills = ['Backend Architecture', 'Core Application Logic', 'System Architecture', 'Route Optimization Algorithms', 'Offline-First Transit', 'Backend Integrations', 'Performance & Reliability'];

  function renderPillsLight(pills) {
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
          <rect width="${pWidth}" height="26" rx="8" fill="#f3efea" stroke="#e5e0d8" stroke-width="1"/>
          <text x="${pWidth / 2}" y="17" fill="#3a3530" font-size="10" font-weight="600" text-anchor="middle">${p}</text>
        </g>
      `;
      curX += pWidth + 8;
    });
    return svg;
  }

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE_LIGHT}
  ${renderBackgroundLight(H, false)}
  ${renderHeaderLight('Explore')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${CL.red}" font-size="12" font-weight="700" letter-spacing="1">🧑‍🤝‍🧑 PROJECT CO-CREATORS</text>
    <text x="0" y="54" fill="${CL.textMain}" font-size="34" font-weight="800">Meet the Developers</text>
    <text x="0" y="82" fill="${CL.textMuted}" font-size="14">PujoPath is a collaborative project co-created by Soumik and Moumita to help people discover Kolkata's Durga Puja pandals and plan their festive experiences.</text>

    <!-- 2 Profile Cards Side-by-Side (w: 564, h: 540) -->
    <g transform="translate(0, 114)">
      <!-- Left Card: Moumita -->
      <g transform="translate(0, 0)">
        <rect width="564" height="540" rx="20" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 24)">
          <!-- Photo Left -->
          <clipPath id="devMoumitaLight"><rect width="104" height="104" rx="16"/></clipPath>
          <image href="${ASSETS.moumita}" width="104" height="104" preserveAspectRatio="xMidYMid slice" clip-path="url(#devMoumitaLight)"/>
          <circle cx="94" cy="94" r="12" fill="${CL.red}"/>
          <text x="94" y="98" fill="#FFFFFF" font-size="10" text-anchor="middle">🎨</text>

          <!-- Header Right -->
          <g transform="translate(124, 6)">
            <rect width="84" height="20" rx="10" fill="#feeceb" stroke="#fca5a5" stroke-width="1"/>
            <text x="42" y="14" fill="${CL.red}" font-size="9" font-weight="700" text-anchor="middle">✦ Co-Creator</text>

            <text x="0" y="46" fill="${CL.textMain}" font-size="24" font-weight="800">Moumita</text>
            <text x="0" y="68" fill="${CL.red}" font-size="13" font-weight="700">UI &amp; Frontend Lead</text>
          </g>

          <!-- Bio -->
          <text x="0" y="136" fill="${CL.textMuted}" font-size="12">Directs user interface design, frontend architecture, responsive layouts, user experience, visual consistency, and interaction design, alongside research and curation of Kolkata's historic Bonedi Bari traditions and cultural festival narratives.</text>

          <!-- Key Responsibilities -->
          <g transform="translate(0, 204)">
            <text x="0" y="14" fill="${CL.textSubtle}" font-size="10" font-weight="700" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
            <g transform="translate(0, 26)">
              ${renderPillsLight(moumitaPills)}
            </g>
          </g>

          <!-- Footer LinkedIn Link -->
          <line x1="0" y1="440" x2="516" y2="440" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="0" y="470" fill="${CL.textSubtle}" font-size="13">Professional Profile</text>
          <g transform="translate(416, 450)">
            <rect width="100" height="32" rx="8" fill="${CL.blueBtn}"/>
            <text x="50" y="21" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>

      <!-- Right Card: Soumik -->
      <g transform="translate(588, 0)">
        <rect width="564" height="540" rx="20" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(24, 24)">
          <!-- Photo Left -->
          <clipPath id="devSoumikLight"><rect width="104" height="104" rx="16"/></clipPath>
          <image href="${ASSETS.soumik}" width="104" height="104" preserveAspectRatio="xMidYMid slice" clip-path="url(#devSoumikLight)"/>
          <circle cx="94" cy="94" r="12" fill="${CL.red}"/>
          <text x="94" y="98" fill="#FFFFFF" font-size="10" text-anchor="middle">⚡</text>

          <!-- Header Right -->
          <g transform="translate(124, 6)">
            <rect width="84" height="20" rx="10" fill="#feeceb" stroke="#fca5a5" stroke-width="1"/>
            <text x="42" y="14" fill="${CL.red}" font-size="9" font-weight="700" text-anchor="middle">✦ Co-Creator</text>

            <text x="0" y="46" fill="${CL.textMain}" font-size="24" font-weight="800">Soumik</text>
            <text x="0" y="68" fill="${CL.red}" font-size="13" font-weight="700">Backend &amp; Systems Lead</text>
          </g>

          <!-- Bio -->
          <text x="0" y="136" fill="${CL.textMuted}" font-size="12">Directs backend &amp; systems architecture, core application logic, route optimization algorithms, offline-first transit functionality, backend integrations, and platform performance &amp; reliability.</text>

          <!-- Key Responsibilities -->
          <g transform="translate(0, 204)">
            <text x="0" y="14" fill="${CL.textSubtle}" font-size="10" font-weight="700" letter-spacing="0.5">KEY RESPONSIBILITIES</text>
            <g transform="translate(0, 26)">
              ${renderPillsLight(soumikPills)}
            </g>
          </g>

          <!-- Footer LinkedIn Link -->
          <line x1="0" y1="440" x2="516" y2="440" stroke="${CL.cardBorder}" stroke-width="1"/>
          <text x="0" y="470" fill="${CL.textSubtle}" font-size="13">Professional Profile</text>
          <g transform="translate(416, 450)">
            <rect width="100" height="32" rx="8" fill="${CL.blueBtn}"/>
            <text x="50" y="21" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">LinkedIn ↗</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Feedback Banner Below (w: 1152, h: 90) -->
    <g transform="translate(0, 680)">
      <rect width="1152" height="90" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 24)">
        <text x="0" y="16" fill="${CL.blueLine}" font-size="11" font-weight="700" letter-spacing="0.5">💬 FEEDBACK &amp; SUGGESTIONS</text>
        <text x="0" y="38" fill="${CL.textMain}" font-size="16" font-weight="800">Have feedback or suggestions for the team?</text>
        <text x="0" y="56" fill="${CL.textMuted}" font-size="12">Share ideas, report bugs, or request features directly via our dedicated feedback channel.</text>

        <g transform="translate(970, 8)">
          <rect width="138" height="36" rx="10" fill="${CL.blueBtn}"/>
          <text x="69" y="23" fill="#FFFFFF" font-size="12" font-weight="700" text-anchor="middle">Share Feedback</text>
        </g>
      </g>
    </g>
  </g>

  ${renderFooterLight(1062)}
</svg>
`;
}

// 10. ABOUT & HELPLINES LIGHT (1440 x 1420 px)
function generateAboutLight() {
  const W = 1440;
  const H = 1420;

  const helplines = [
    { name: 'Kolkata Police Emergency', desc: 'Central emergency response', num: '100 / 112', icon: '🚨' },
    { name: 'Kolkata Traffic Police Helpline', desc: 'Traffic & road advisories', num: '1073 / 033-2214-3644', icon: '🚦' },
    { name: 'Women Helpline', desc: '24×7 special assistance for women', num: '1091 / 181', icon: '🌸' },
    { name: 'Ambulance Emergency Services', desc: 'Immediate medical ambulance', num: '102 / 108', icon: '🚑' },
    { name: 'Fire & Rescue Services', desc: 'Fire rescue department', num: '101', icon: '🚒' },
    { name: 'Kolkata Metro Rail Helpdesk', desc: 'Metro transit helpline', num: '033-2226-7285', icon: '🚇' }
  ];

  let hCards = '';
  helplines.forEach((h, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const hx = col * 588;
    const hy = row * 114;
    hCards += `
      <g transform="translate(${hx}, ${hy})">
        <rect width="564" height="100" rx="16" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
        <g transform="translate(20, 20)">
          <text x="0" y="18" fill="${CL.textMain}" font-size="15" font-weight="800">${h.name}</text>
          <text x="0" y="38" fill="${CL.textSubtle}" font-size="12">${h.desc}</text>
          <text x="0" y="62" fill="${CL.red}" font-size="15" font-weight="800">${h.num}</text>

          <circle cx="510" cy="30" r="20" fill="#feeceb"/>
          <text x="510" y="36" fill="${CL.red}" font-size="14" text-anchor="middle">📞</text>
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
    <text x="0" y="20" fill="${CL.red}" font-size="12" font-weight="700" letter-spacing="1">ℹ️ SAFETY &amp; ASSISTANCE</text>
    <text x="0" y="54" fill="${CL.textMain}" font-size="34" font-weight="800">Emergency Helplines &amp; Safety Guide</text>
    <text x="0" y="82" fill="${CL.textMuted}" font-size="14">Official 24×7 emergency contacts and essential guidance for safe and smooth pandal hopping.</text>

    <!-- 6 Helplines Grid -->
    <g transform="translate(0, 114)">
      ${hCards}
    </g>

    <!-- Essential Tips Card (y: 486) -->
    <g transform="translate(0, 486)">
      <rect width="1152" height="170" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 24)">
        <text x="0" y="18" fill="${CL.red}" font-size="16" font-weight="800">🛡️ Essential Pandal Hopping Tips</text>
        <text x="0" y="48" fill="${CL.textMuted}" font-size="13">• Use the Kolkata Metro (Blue &amp; Green lines) to travel between major hubs and bypass road traffic.</text>
        <text x="0" y="72" fill="${CL.textMuted}" font-size="13">• Visit high-crowd pandals during morning hours (8 AM – 12 PM) for minimal queues and peaceful Darshan.</text>
        <text x="0" y="96" fill="${CL.textMuted}" font-size="13">• Carry reusable water bottles and stay hydrated while hopping.</text>
        <text x="0" y="120" fill="${CL.textMuted}" font-size="13">• In case of overcrowding or emergency, reach out to the nearest Kolkata Police May I Help You kiosk.</text>
      </g>
    </g>

    <!-- About Initiative Card (y: 686) -->
    <g transform="translate(0, 686)">
      <rect width="1152" height="130" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 24)">
        <text x="0" y="18" fill="${CL.red}" font-size="11" font-weight="700" letter-spacing="0.5">ℹ️ ABOUT THE INITIATIVE</text>
        <text x="0" y="44" fill="${CL.textMain}" font-size="20" font-weight="800">About PujoPath</text>
        <text x="0" y="72" fill="${CL.textMuted}" font-size="13">PujoPath is a non-commercial community initiative built to celebrate Kolkata's Durga Puja. It provides verified pandal information, smart hopping routes, accurate tithi almanac schedules, and public transit navigation.</text>
      </g>
    </g>
  </g>

  ${renderFooterLight(1262)}
</svg>
`;
}

// 11. FEEDBACK SCREEN LIGHT (1440 x 1120 px)
function generateFeedbackLight() {
  const W = 1440;
  const H = 1120;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE_LIGHT}
  ${renderBackgroundLight(H, false)}
  ${renderHeaderLight('More')}

  <g transform="translate(144, 88)">
    <!-- Label & Title -->
    <text x="0" y="20" fill="${CL.red}" font-size="12" font-weight="700" letter-spacing="1">💬 FEEDBACK &amp; SUGGESTIONS</text>
    <text x="0" y="54" fill="${CL.textMain}" font-size="34" font-weight="800">Share Your Feedback</text>
    <text x="0" y="82" fill="${CL.textMuted}" font-size="14">Have suggestions, corrections, or new features to suggest? Send your feedback directly via email.</text>

    <!-- Direct Email Card (w: 1152, h: 140) in Soft Blue -->
    <g transform="translate(0, 114)">
      <rect width="1152" height="140" rx="20" fill="${CL.blueBannerBg}" stroke="${CL.blueBannerBorder}" stroke-width="1"/>
      <g transform="translate(28, 24)">
        <rect width="90" height="20" rx="6" fill="#dbeafe"/>
        <text x="45" y="14" fill="${CL.blueBannerTitle}" font-size="10" font-weight="700" text-anchor="middle">✉ Direct Email</text>

        <text x="0" y="50" fill="${CL.blueBannerTitle}" font-size="22" font-weight="800">Send Feedback via Email</text>
        <text x="0" y="74" fill="${CL.blueBannerText}" font-size="13">Messages go directly to soumik.bur@gmail.com. We review all feedback, pandal updates, and community suggestions promptly.</text>

        <g transform="translate(860, 26)">
          <rect width="210" height="42" rx="12" fill="${CL.blueBtn}"/>
          <text x="24" y="26" fill="#FFFFFF" font-size="13">✉</text>
          <text x="46" y="26" fill="#FFFFFF" font-size="13" font-weight="700">Send Feedback Email ↗</text>
        </g>
      </g>
    </g>

    <!-- 3 Feedback Categories Cards (y: 284) -->
    <g transform="translate(0, 284)">
      <text x="0" y="22" fill="${CL.textSubtle}" font-size="11" font-weight="700" letter-spacing="0.5">WHAT YOU CAN SHARE</text>

      <g transform="translate(0, 36)">
        <!-- Cat 1: Report Bug -->
        <g transform="translate(0, 0)">
          <rect width="368" height="130" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <g transform="translate(20, 20)">
            <circle cx="16" cy="16" r="16" fill="#feeceb"/>
            <text x="16" y="22" fill="${CL.red}" font-size="14" text-anchor="middle">🐞</text>
            <text x="46" y="22" fill="${CL.textMain}" font-size="15" font-weight="800">Report an Issue / Bug</text>
            <text x="0" y="56" fill="${CL.textMuted}" font-size="12">Spotted an incorrect timing, location issue, or broken feature? Let us know so we can fix it.</text>
          </g>
        </g>

        <!-- Cat 2: Feature Suggestions -->
        <g transform="translate(392, 0)">
          <rect width="368" height="130" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <g transform="translate(20, 20)">
            <circle cx="16" cy="16" r="16" fill="#fef3c7"/>
            <text x="16" y="22" fill="#b45309" font-size="14" text-anchor="middle">💡</text>
            <text x="46" y="22" fill="${CL.textMain}" font-size="15" font-weight="800">Feature Suggestions</text>
            <text x="0" y="56" fill="${CL.textMuted}" font-size="12">Have ideas for new filters, transit enhancements, or interactive tools for pandal hoppers?</text>
          </g>
        </g>

        <!-- Cat 3: Community Collaboration -->
        <g transform="translate(784, 0)">
          <rect width="368" height="130" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
          <g transform="translate(20, 20)">
            <circle cx="16" cy="16" r="16" fill="#feeceb"/>
            <text x="16" y="22" fill="${CL.red}" font-size="14" text-anchor="middle">🤝</text>
            <text x="46" y="22" fill="${CL.textMain}" font-size="15" font-weight="800">Community Collaboration</text>
            <text x="0" y="56" fill="${CL.textMuted}" font-size="12">Want to contribute photographs, club details, or community itineraries? Connect with us.</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Meet Creators Banner (y: 476) -->
    <g transform="translate(0, 476)">
      <rect width="1152" height="80" rx="18" fill="${CL.white}" stroke="${CL.cardBorder}" stroke-width="1"/>
      <g transform="translate(24, 20)">
        <text x="0" y="16" fill="${CL.red}" font-size="11" font-weight="700" letter-spacing="0.5">🧑‍🤝‍🧑 PROJECT CREATORS</text>
        <text x="0" y="38" fill="${CL.textMain}" font-size="15" font-weight="800">Want to meet the creators behind PujoPath?</text>
        <text x="320" y="38" fill="${CL.textSubtle}" font-size="12">Learn more about Soumik and Moumita and explore their professional profiles.</text>

        <g transform="translate(980, 4)">
          <rect width="128" height="34" rx="10" fill="${CL.white}" stroke="#e5e0d8" stroke-width="1"/>
          <text x="64" y="22" fill="${CL.textMain}" font-size="12" font-weight="700" text-anchor="middle">Meet Developers ↗</text>
        </g>
      </g>
    </g>
  </g>

  ${renderFooterLight(962)}
</svg>
`;
}

const devSvg = generateDeveloperLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '09_web_desktop_developer_light.svg'), devSvg, 'utf8');
console.log(`✓ Generated 09_web_desktop_developer_light.svg (${(devSvg.length / 1024).toFixed(1)} KB)`);

const abtSvg = generateAboutLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '10_web_desktop_about_light.svg'), abtSvg, 'utf8');
console.log(`✓ Generated 10_web_desktop_about_light.svg (${(abtSvg.length / 1024).toFixed(1)} KB)`);

const fbkSvg = generateFeedbackLight();
fs.writeFileSync(path.join(OUT_DIR_LIGHT, '11_web_desktop_feedback_light.svg'), fbkSvg, 'utf8');
console.log(`✓ Generated 11_web_desktop_feedback_light.svg (${(fbkSvg.length / 1024).toFixed(1)} KB)`);
