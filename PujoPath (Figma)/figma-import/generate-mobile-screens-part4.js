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

// 10. MOBILE ABOUT & HELPLINES SCREEN (390 x 1500 px)
function generateMobileAbout(isDark = false) {
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
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="700" letter-spacing="1">ℹ️ SAFETY &amp; ASSISTANCE</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="24" font-weight="900">Emergency Helplines</text>
    <text x="0" y="70" fill="${t.textMain}" font-size="24" font-weight="900">&amp; Safety Guide</text>
    <text x="0" y="94" fill="${t.textMuted}" font-size="12">Official 24×7 emergency contacts and essential guidance</text>
    <text x="0" y="110" fill="${t.textMuted}" font-size="12">for safe and smooth pandal hopping.</text>

    <!-- Helpline Cards (6 Cards) -->
    <!-- Card 1: Police -->
    <g transform="translate(0, 126)">
      <rect width="358" height="96" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="16" fill="${t.textMain}" font-size="15" font-weight="800">Kolkata Police Emergency</text>
        <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Central emergency response</text>
        <text x="0" y="58" fill="${t.red}" font-size="18" font-weight="900">100 / 112</text>

        <rect x="274" y="8" width="46" height="46" rx="14" fill="${t.redPillBg}"/>
        <text x="297" y="36" fill="${t.red}" font-size="18" text-anchor="middle">📞</text>
      </g>
    </g>

    <!-- Card 2: Traffic Police -->
    <g transform="translate(0, 232)">
      <rect width="358" height="96" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="16" fill="${t.textMain}" font-size="15" font-weight="800">Kolkata Traffic Police Helpline</text>
        <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Traffic &amp; road advisories</text>
        <text x="0" y="58" fill="${t.red}" font-size="17" font-weight="900">1073 / 033-2214-3644</text>

        <rect x="274" y="8" width="46" height="46" rx="14" fill="${t.redPillBg}"/>
        <text x="297" y="36" fill="${t.red}" font-size="18" text-anchor="middle">📞</text>
      </g>
    </g>

    <!-- Card 3: Women Helpline -->
    <g transform="translate(0, 338)">
      <rect width="358" height="96" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="16" fill="${t.textMain}" font-size="15" font-weight="800">Women Helpline</text>
        <text x="0" y="34" fill="${t.textSubtle}" font-size="11">24×7 special assistance for women</text>
        <text x="0" y="58" fill="${t.red}" font-size="18" font-weight="900">1091 / 181</text>

        <rect x="274" y="8" width="46" height="46" rx="14" fill="${t.redPillBg}"/>
        <text x="297" y="36" fill="${t.red}" font-size="18" text-anchor="middle">📞</text>
      </g>
    </g>

    <!-- Card 4: Ambulance -->
    <g transform="translate(0, 444)">
      <rect width="358" height="96" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="16" fill="${t.textMain}" font-size="15" font-weight="800">Ambulance Emergency Services</text>
        <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Immediate medical ambulance</text>
        <text x="0" y="58" fill="${t.red}" font-size="18" font-weight="900">102 / 108</text>

        <rect x="274" y="8" width="46" height="46" rx="14" fill="${t.redPillBg}"/>
        <text x="297" y="36" fill="${t.red}" font-size="18" text-anchor="middle">📞</text>
      </g>
    </g>

    <!-- Card 5: Fire Service -->
    <g transform="translate(0, 550)">
      <rect width="358" height="96" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="16" fill="${t.textMain}" font-size="15" font-weight="800">Fire &amp; Rescue Services</text>
        <text x="0" y="34" fill="${t.textSubtle}" font-size="11">West Bengal Fire &amp; Emergency Service</text>
        <text x="0" y="58" fill="${t.red}" font-size="18" font-weight="900">101</text>

        <rect x="274" y="8" width="46" height="46" rx="14" fill="${t.redPillBg}"/>
        <text x="297" y="36" fill="${t.red}" font-size="18" text-anchor="middle">📞</text>
      </g>
    </g>

    <!-- Card 6: Metro Helpline -->
    <g transform="translate(0, 656)">
      <rect width="358" height="96" rx="18" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(18, 18)">
        <text x="0" y="16" fill="${t.textMain}" font-size="15" font-weight="800">Kolkata Metro Security Helpline</text>
        <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Railway Protection Force (RPF)</text>
        <text x="0" y="58" fill="${t.blueLine}" font-size="18" font-weight="900">139</text>

        <rect x="274" y="8" width="46" height="46" rx="14" fill="${isDark ? '#1e293b' : '#eff6ff'}"/>
        <text x="297" y="36" fill="${t.blueLine}" font-size="18" text-anchor="middle">🚇</text>
      </g>
    </g>

    <!-- Mission & Cultural Info Card (y: 768) -->
    <g transform="translate(0, 768)">
      <rect width="358" height="150" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
      <g transform="translate(20, 20)">
        <text x="0" y="16" fill="${t.textMain}" font-size="15" font-weight="800">About the PujoPath Companion</text>
        <text x="0" y="38" fill="${t.textSubtle}" font-size="12">PujoPath is an open cultural initiative built for Kolkata,</text>
        <text x="0" y="54" fill="${t.textSubtle}" font-size="12">dedicated to helping visitors and locals navigate over 770+</text>
        <text x="0" y="70" fill="${t.textSubtle}" font-size="12">Durga Puja pandals with transit integration and reverence.</text>

        <line x1="0" y1="88" x2="318" y2="88" stroke="${t.cardBorder}" stroke-width="1"/>
        <text x="0" y="106" fill="${t.red}" font-size="11" font-weight="700">Official Open Source Initiative • Version 2.0</text>
      </g>
    </g>
  </g>

  ${renderMobileFooter(1300, isDark)}
  ${renderMobileBottomNav('More', isDark, H - 64)}
</svg>
`;
}

// 11. MOBILE FEEDBACK SCREEN (390 x 1250 px)
function generateMobileFeedback(isDark = false) {
  const W = 390;
  const H = 1250;
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderMobileBackground(H, isDark)}
  ${renderMobileHeader(isDark)}

  <g transform="translate(16, 72)">
    <!-- Label & Title -->
    <text x="0" y="16" fill="${t.red}" font-size="11" font-weight="700" letter-spacing="1">💬 FEEDBACK &amp; SUGGESTIONS</text>
    <text x="0" y="44" fill="${t.textMain}" font-size="24" font-weight="900">Share Your Feedback</text>
    <text x="0" y="68" fill="${t.textMuted}" font-size="12">Have suggestions, corrections, or new features to suggest?</text>
    <text x="0" y="84" fill="${t.textMuted}" font-size="12">Send your feedback directly via email.</text>

    <!-- Email Card Hero (w: 358, h: 220) -->
    <g transform="translate(0, 102)">
      <rect width="358" height="220" rx="22" fill="${isDark ? '#142033' : '#eff6ff'}" stroke="${isDark ? '#1e3a5f' : '#bfdbfe'}" stroke-width="1.5"/>
      <g transform="translate(20, 20)">
        <rect width="104" height="24" rx="8" fill="${isDark ? '#1e3a5f' : '#dbeafe'}"/>
        <text x="52" y="16" fill="${t.blueBtn}" font-size="10" font-weight="700" text-anchor="middle">✉ Direct Email</text>

        <text x="0" y="56" fill="${t.textMain}" font-size="20" font-weight="900">Send Feedback via Email</text>
        <text x="0" y="78" fill="${t.textMuted}" font-size="12">Messages go directly to soumik.bur@gmail.com.</text>
        <text x="0" y="94" fill="${t.textMuted}" font-size="12">We review all feedback, pandal updates, and community</text>
        <text x="0" y="110" fill="${t.textMuted}" font-size="12">suggestions promptly.</text>

        <!-- Button -->
        <g transform="translate(0, 128)">
          <rect width="318" height="46" rx="14" fill="#0a66c2"/>
          <text x="130" y="28" fill="#FFFFFF" font-size="14">✉</text>
          <text x="150" y="28" fill="#FFFFFF" font-size="13" font-weight="700">Send Feedback Email ↗</text>
        </g>
      </g>
    </g>

    <!-- What You Can Share Header (y: 342) -->
    <g transform="translate(0, 342)">
      <text x="0" y="20" fill="${t.textSubtle}" font-size="11" font-weight="800" letter-spacing="0.5">WHAT YOU CAN SHARE</text>

      <!-- Category Card 1: Bug / Issue -->
      <g transform="translate(0, 32)">
        <rect width="358" height="88" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="36" height="36" rx="10" fill="${t.redPillBg}"/>
          <text x="18" y="24" fill="${t.red}" font-size="16" text-anchor="middle">🐞</text>

          <g transform="translate(48, 2)">
            <text x="0" y="16" fill="${t.textMain}" font-size="14" font-weight="800">Report an Issue / Bug</text>
            <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Spotted an incorrect timing, location issue, or</text>
            <text x="0" y="48" fill="${t.textSubtle}" font-size="11">broken feature? Let us know so we can fix it.</text>
          </g>
        </g>
      </g>

      <!-- Category Card 2: Pandal Update -->
      <g transform="translate(0, 130)">
        <rect width="358" height="88" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="36" height="36" rx="10" fill="${isDark ? '#3b2514' : '#fff7ed'}"/>
          <text x="18" y="24" fill="${t.amberStar}" font-size="16" text-anchor="middle">💡</text>

          <g transform="translate(48, 2)">
            <text x="0" y="16" fill="${t.textMain}" font-size="14" font-weight="800">Suggest a Pandal Update</text>
            <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Have updated photos, theme names, or crowd tips</text>
            <text x="0" y="48" fill="${t.textSubtle}" font-size="11">for a pandal? Submit updates directly.</text>
          </g>
        </g>
      </g>

      <!-- Category Card 3: Feature Requests -->
      <g transform="translate(0, 228)">
        <rect width="358" height="88" rx="16" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1"/>
        <g transform="translate(16, 16)">
          <rect width="36" height="36" rx="10" fill="${isDark ? '#142c1c' : '#dcfce7'}"/>
          <text x="18" y="24" fill="${t.greenLine}" font-size="16" text-anchor="middle">✨</text>

          <g transform="translate(48, 2)">
            <text x="0" y="16" fill="${t.textMain}" font-size="14" font-weight="800">Feature Requests &amp; Ideas</text>
            <text x="0" y="34" fill="${t.textSubtle}" font-size="11">Have ideas for the next version of PujoPath?</text>
            <text x="0" y="48" fill="${t.textSubtle}" font-size="11">We'd love to hear your thoughts.</text>
          </g>
        </g>
      </g>
    </g>
  </g>

  ${renderMobileFooter(1050, isDark)}
  ${renderMobileBottomNav('More', isDark, H - 64)}
</svg>
`;
}

// 12. MOBILE MORE MENU DRAWER / OVERLAY (390 x 844 px)
function generateMobileMoreDrawer(isDark = false) {
  const W = 390;
  const H = 844;
  const t = isDark ? TOKENS.dark : TOKENS.light;

  const menuItems = [
    { name: 'Calendar', path: 'Calendar & Timings', icon: '📅' },
    { name: 'Metro', path: 'Kolkata Metro Timetable', icon: '🚇' },
    { name: 'Music', path: 'Puja Music & Dhak Beats', icon: '🎵' },
    { name: 'Mahalaya', path: 'Mahishasura Mardini Archive', icon: '✨' },
    { name: 'Help', path: 'Emergency Helplines & Safety', icon: 'ℹ️' },
    { name: 'Feedback', path: 'Share Suggestions', icon: '💬' },
    { name: 'Developer', path: 'Meet Soumik & Moumita', icon: '👥' }
  ];

  let itemsSvg = '';
  menuItems.forEach((item, i) => {
    const y = i * 44;
    itemsSvg += `
    <g transform="translate(12, ${y})">
      <rect width="216" height="38" rx="10" fill="${t.card}" fill-opacity="0.01"/>
      <text x="12" y="24" font-size="15">${item.icon}</text>
      <text x="38" y="24" fill="${t.textMain}" font-size="14" font-weight="700">${item.name}</text>
      <text x="206" y="24" fill="${t.textFaint}" font-size="12" text-anchor="end">›</text>
    </g>
    `;
  });

  return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_STYLE}
  ${renderMobileBackground(H, isDark)}
  ${renderMobileHeader(isDark)}

  <!-- Dimmed Backdrop Overlay -->
  <rect width="${W}" height="${H}" fill="#000000" fill-opacity="0.45"/>

  <!-- Floating More Menu Dropdown (w: 240, h: 330) -->
  <g transform="translate(134, 434)">
    <rect width="240" height="330" rx="20" fill="${t.card}" stroke="${t.cardBorder}" stroke-width="1.5" filter="drop-shadow(0 12px 32px rgba(0,0,0,0.35))"/>
    
    <g transform="translate(0, 10)">
      ${itemsSvg}
    </g>
  </g>

  ${renderMobileBottomNav('More', isDark, H - 64)}
</svg>
`;
}

// Write part 4 screens (Light & Dark)
fs.writeFileSync(path.join(OUT_DIR, '10_web_mobile_about_light.svg'), generateMobileAbout(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '10_web_mobile_about_dark.svg'), generateMobileAbout(true), 'utf8');
console.log('✓ Generated 10_web_mobile_about (Light & Dark)');

fs.writeFileSync(path.join(OUT_DIR, '11_web_mobile_feedback_light.svg'), generateMobileFeedback(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '11_web_mobile_feedback_dark.svg'), generateMobileFeedback(true), 'utf8');
console.log('✓ Generated 11_web_mobile_feedback (Light & Dark)');

fs.writeFileSync(path.join(OUT_DIR, '12_web_mobile_more_drawer_light.svg'), generateMobileMoreDrawer(false), 'utf8');
fs.writeFileSync(path.join(OUT_DIR, '12_web_mobile_more_drawer_dark.svg'), generateMobileMoreDrawer(true), 'utf8');
console.log('✓ Generated 12_web_mobile_more_drawer (Light & Dark)');
