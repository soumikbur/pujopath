const http = require('http');
const fs = require('fs');
const path = require('path');

const LIGHT_DIR = path.resolve(__dirname, '../validation/mobile_reference_light');
const DARK_DIR = path.resolve(__dirname, '../validation/mobile_reference_dark');
if (!fs.existsSync(LIGHT_DIR)) fs.mkdirSync(LIGHT_DIR, { recursive: true });
if (!fs.existsSync(DARK_DIR)) fs.mkdirSync(DARK_DIR, { recursive: true });

async function getTab() {
  const tabs = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  return tabs.find((t) => t.url && t.url.includes('pujopath-five.vercel.app'));
}

async function main() {
  const tab = await getTab();
  if (!tab) {
    console.error('No Vercel tab found');
    return;
  }
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let reqId = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(new Error(JSON.stringify(msg.error)));
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res?.result?.value;
  }

  // Set mobile device metrics (1:1 CSS pixels, 390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });

  const routes = [
    { path: '/', name: '01_mobile_home' },
    { path: '/explore/', name: '02_mobile_explore' },
    { path: '/map/', name: '03_mobile_map' },
    { path: '/planner/', name: '04_mobile_planner' },
    { path: '/calendar/', name: '05_mobile_calendar' },
    { path: '/metro/', name: '06_mobile_metro' },
    { path: '/music/', name: '07_mobile_music' },
    { path: '/mahalaya/', name: '08_mobile_mahalaya' },
    { path: '/developer/', name: '09_mobile_developer' },
    { path: '/about/', name: '10_mobile_about' },
    { path: '/feedback/', name: '11_mobile_feedback' }
  ];

  // Inspect navigation elements on home
  await send('Page.navigate', { url: 'https://pujopath-five.vercel.app/' });
  await new Promise((r) => setTimeout(r, 2000));

  const navInfo = await evaluate(`(() => {
    const bottomNav = document.querySelector('nav, [class*="bottom-nav"], [class*="BottomNav"], [class*="fixed bottom"]');
    const header = document.querySelector('header');
    const bottomNavLinks = Array.from(document.querySelectorAll('nav a, [class*="bottom"] a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href'),
      box: a.getBoundingClientRect()
    }));
    return {
      headerRect: header ? header.getBoundingClientRect() : null,
      bottomNavRect: bottomNav ? bottomNav.getBoundingClientRect() : null,
      bottomNavLinks,
      bodyScrollHeight: document.body.scrollHeight,
      hasMoreButton: !!Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.includes('More'))
    };
  })()`);
  console.log('Mobile navigation inspection:', JSON.stringify(navInfo, null, 2));

  // Capture for both Light and Dark modes
  for (const theme of ['light', 'dark']) {
    console.log(`\n=================== SWITCHING TO ${theme.toUpperCase()} MODE ===================`);
    
    // Set theme via html attribute and localStorage
    await evaluate(`(() => {
      if ('${theme}' === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('pujopath-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('pujopath-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    })()`);

    const outDir = theme === 'light' ? LIGHT_DIR : DARK_DIR;

    for (const r of routes) {
      console.log(`Navigating to ${r.path} (${theme})...`);
      await send('Page.navigate', { url: `https://pujopath-five.vercel.app${r.path}` });
      await new Promise((res) => setTimeout(res, 2000));

      // Re-assert theme after navigation if page re-reads storage
      await evaluate(`(() => {
        if ('${theme}' === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      })()`);
      await new Promise((res) => setTimeout(res, 500));

      // 1. Capture Full Page (entire scroll)
      try {
        const fullShot = await send('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: true
        });
        if (fullShot && fullShot.data) {
          const fullFile = path.join(outDir, `${r.name}_full.png`);
          fs.writeFileSync(fullFile, Buffer.from(fullShot.data, 'base64'));
          console.log(`✓ Saved ${r.name}_full.png (${(fullShot.data.length / 1024).toFixed(1)} KB)`);
        }
      } catch (err) {
        console.warn(`Full screenshot failed for ${r.name}: ${err.message}`);
      }

      // 2. Capture Viewport (initial 390x844 view)
      try {
        const vpShot = await send('Page.captureScreenshot', {
          format: 'png',
          captureBeyondViewport: false
        });
        if (vpShot && vpShot.data) {
          const vpFile = path.join(outDir, `${r.name}_viewport.png`);
          fs.writeFileSync(vpFile, Buffer.from(vpShot.data, 'base64'));
          console.log(`✓ Saved ${r.name}_viewport.png`);
        }
      } catch (err) {
        console.warn(`Viewport screenshot failed for ${r.name}: ${err.message}`);
      }
    }

    // Capture More Drawer / Menu modal if available
    console.log(`Testing "More" interaction on mobile (${theme})...`);
    await send('Page.navigate', { url: 'https://pujopath-five.vercel.app/' });
    await new Promise((res) => setTimeout(res, 1500));
    await evaluate(`(() => {
      if ('${theme}' === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    })()`);

    const moreClicked = await evaluate(`(() => {
      const moreBtn = Array.from(document.querySelectorAll('a, button')).find(el => 
        (el.innerText && el.innerText.trim().toLowerCase() === 'more') ||
        (el.getAttribute('aria-label') && el.getAttribute('aria-label').toLowerCase().includes('more'))
      );
      if (moreBtn) {
        moreBtn.click();
        return { clicked: true, text: moreBtn.innerText, href: moreBtn.getAttribute('href') };
      }
      return { clicked: false };
    })()`);
    console.log('More button clicked:', moreClicked);
    await new Promise((res) => setTimeout(res, 1000));

    const drawerShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    if (drawerShot && drawerShot.data) {
      fs.writeFileSync(path.join(outDir, `12_mobile_more_drawer.png`), Buffer.from(drawerShot.data, 'base64'));
      console.log(`✓ Saved 12_mobile_more_drawer.png`);
    }
  }

  // Extract mobile computed tokens and layout dimensions
  console.log('\nExtracting mobile computed layout and tokens...');
  await send('Page.navigate', { url: 'https://pujopath-five.vercel.app/' });
  await new Promise((res) => setTimeout(res, 1500));

  const mobileMetrics = await evaluate(`(() => {
    const header = document.querySelector('header');
    const bottomNav = document.querySelector('nav, [class*="bottom-nav"], [class*="fixed bottom"]');
    const card = document.querySelector('[class*="rounded"], [class*="card"]');
    const h1 = document.querySelector('h1');
    const p = document.querySelector('p');

    const getStyles = (el) => {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
        padding: s.padding,
        margin: s.margin,
        backgroundColor: s.backgroundColor,
        color: s.color,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        fontFamily: s.fontFamily,
        borderRadius: s.borderRadius,
        borderColor: s.borderColor,
        borderWidth: s.borderWidth,
        boxShadow: s.boxShadow
      };
    };

    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      header: getStyles(header),
      bottomNav: getStyles(bottomNav),
      sampleCard: getStyles(card),
      h1: getStyles(h1),
      p: getStyles(p)
    };
  })()`);

  fs.writeFileSync(
    path.resolve(__dirname, '../validation/mobile_computed_metrics.json'),
    JSON.stringify(mobileMetrics, null, 2),
    'utf8'
  );
  console.log('Saved mobile_computed_metrics.json');

  ws.close();
  console.log('\n✓ Mobile inspection and reference captures completed successfully!');
}

main().catch(console.error);
