const http = require('http');
const fs = require('fs');
const path = require('path');

async function getTabs() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  const tabs = await getTabs();
  const liveTab = tabs.find(t => t.url && t.url.includes('pujopath-five.vercel.app'));
  if (!liveTab) {
    console.error('Live tab not found!');
    process.exit(1);
  }
  console.log('Connecting to live tab:', liveTab.webSocketDebuggerUrl);
  const ws = new WebSocket(liveTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          if (m.error) reject(new Error(m.error.message));
          else resolve(m.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Set viewport to 1440x900, scale 1
  await sendCmd('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const brainDir = 'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc';
  const outDir = path.join(__dirname, 'reference_captures');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const routes = [
    { path: '/', name: 'desktop_home' },
    { path: '/explore', name: 'desktop_explore' },
    { path: '/calendar', name: 'desktop_calendar' },
    { path: '/planner', name: 'desktop_planner' },
    { path: '/developer', name: 'desktop_developer' },
    { path: '/about', name: 'desktop_about' },
    { path: '/feedback', name: 'desktop_feedback' }
  ];

  const siteAudit = {};

  for (const r of routes) {
    const fullUrl = `https://pujopath-five.vercel.app${r.path}`;
    console.log(`\nNavigating to ${fullUrl}...`);
    await sendCmd('Page.navigate', { url: fullUrl });
    await new Promise(res => setTimeout(res, 3500));

    // Capture DOM metrics and details
    const pageData = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const main = document.querySelector('main');
        const navLinks = Array.from(document.querySelectorAll('header a, nav a')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href')
        }));
        const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
          text: b.innerText.trim(),
          classes: b.className
        }));

        // Get computed style helper
        function getStyles(el) {
          if (!el) return null;
          const cs = window.getComputedStyle(el);
          return {
            bg: cs.backgroundColor,
            color: cs.color,
            fontFamily: cs.fontFamily,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            lineHeight: cs.lineHeight,
            padding: cs.padding,
            margin: cs.margin,
            border: cs.border,
            borderRadius: cs.borderRadius,
            boxShadow: cs.boxShadow,
            width: el.offsetWidth,
            height: el.offsetHeight
          };
        }

        // Check for floating music player
        const audioBar = document.querySelector('[class*="music"], [class*="player"], [class*="audio"], [aria-label*="audio"], [aria-label*="music"]') ||
                         Array.from(document.querySelectorAll('div, footer, aside')).find(d => {
                           const s = window.getComputedStyle(d);
                           return (s.position === 'fixed' || s.position === 'sticky') && d.innerText.includes('Aarti');
                         });

        return {
          title: document.title,
          url: window.location.href,
          scrollHeight: document.documentElement.scrollHeight,
          headerStyles: getStyles(header),
          footerStyles: getStyles(footer),
          mainStyles: getStyles(main),
          navLinks,
          hasAudioBar: !!audioBar,
          audioBarStyles: getStyles(audioBar),
          bodyBg: window.getComputedStyle(document.body).backgroundColor,
          bodyColor: window.getComputedStyle(document.body).color
        };
      })()`,
      returnByValue: true
    });

    siteAudit[r.name] = pageData.result?.value;
    console.log(`Audit for ${r.name}:`, JSON.stringify(siteAudit[r.name], null, 2));

    // Capture full-page screenshot
    const layoutMetrics = await sendCmd('Page.getLayoutMetrics');
    const contentHeight = Math.ceil(layoutMetrics.contentSize.height);
    console.log(`Page content height: ${contentHeight}px`);

    // Set height to contentHeight to capture entire full page
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: Math.min(contentHeight, 5000),
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(res => setTimeout(res, 500));

    const shot = await sendCmd('Page.captureScreenshot', {
      captureBeyondViewport: true
    });

    const shotPath = path.join(outDir, `live_${r.name}_full.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`✓ Saved ${shotPath}`);

    // Reset height back to 900 for next navigation
    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
  }

  fs.writeFileSync(path.join(__dirname, 'deployed_site_audit.json'), JSON.stringify(siteAudit, null, 2));
  console.log('\nAudit complete! Saved deployed_site_audit.json');
  ws.close();
}

main().catch(console.error);
