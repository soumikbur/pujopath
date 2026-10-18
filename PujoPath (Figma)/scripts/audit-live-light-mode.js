const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '../validation/reference_captures_light');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function auditLightMode() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const webTab = tabs.find(t => t.url && t.url.includes('pujopath-five.vercel.app'));
  if (!webTab) throw new Error('Live website tab not found');

  const ws = new WebSocket(webTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          if (m.error) reject(new Error(JSON.stringify(m.error)));
          else resolve(m.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evalExpr(expr) {
    const res = await sendCmd('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res?.result?.value;
  }

  // 1. Audit Home Page Light Tokens
  console.log('--- AUDITING HOME PAGE LIGHT MODE TOKENS ---');
  const tokens = await evalExpr(`(() => {
    const getStyle = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        bg: cs.backgroundColor,
        color: cs.color,
        borderColor: cs.borderColor,
        borderWidth: cs.borderWidth,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        backdropFilter: cs.backdropFilter
      };
    };

    return {
      body: getStyle('body'),
      header: getStyle('header, nav'),
      h1: getStyle('h1'),
      heroBadge: getStyle('span.inline-flex, .badge'),
      card: getStyle('article, .rounded-2xl, .rounded-3xl'),
      footer: getStyle('footer')
    };
  })()`);

  console.log('Computed Light Tokens:', JSON.stringify(tokens, null, 2));
  if (tokens) {
    fs.writeFileSync(path.join(OUT_DIR, 'light_tokens.json'), JSON.stringify(tokens, null, 2));
  }

  // 2. Capture all 11 routes in Light Mode
  const routes = [
    { path: '/', name: 'live_light_desktop_home' },
    { path: '/explore/', name: 'live_light_desktop_explore' },
    { path: '/map/', name: 'live_light_desktop_map' },
    { path: '/planner/', name: 'live_light_desktop_planner' },
    { path: '/calendar/', name: 'live_light_desktop_calendar' },
    { path: '/metro/', name: 'live_light_desktop_metro' },
    { path: '/music/', name: 'live_light_desktop_music' },
    { path: '/mahalaya/', name: 'live_light_desktop_mahalaya' },
    { path: '/developer/', name: 'live_light_desktop_developer' },
    { path: '/about/', name: 'live_light_desktop_about' },
    { path: '/feedback/', name: 'live_light_desktop_feedback' }
  ];

  for (const r of routes) {
    console.log(`Navigating to ${r.path}...`);
    await sendCmd('Page.navigate', { url: `https://pujopath-five.vercel.app${r.path}` });
    await new Promise(res => setTimeout(res, 2000));

    // Ensure it remains light mode (html has no 'dark' class)
    await evalExpr(`(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    })()`);
    await new Promise(res => setTimeout(res, 600));

    // Capture screenshot
    const shot = await sendCmd('Page.captureScreenshot', { captureBeyondViewport: false });
    const buf = Buffer.from(shot.data, 'base64');
    const outFile = path.join(OUT_DIR, `${r.name}.png`);
    fs.writeFileSync(outFile, buf);
    console.log(`✓ Captured ${r.name}.png (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  ws.close();
  console.log('\nLight mode captures complete!');
}

auditLightMode().catch(console.error);
