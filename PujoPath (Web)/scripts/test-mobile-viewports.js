const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\efd504b0-6417-46e8-824b-e1f69b967c2c');
const TEMP_USER_DATA = path.join(process.env.TEMP || '.', 'chrome-cdp-profile-' + Date.now());

const VIEWPORTS = [
  { name: '320x568', width: 320, height: 568 },
  { name: '360x800', width: 360, height: 800 },
  { name: '375x812', width: 375, height: 812 },
  { name: '390x844', width: 390, height: 844 },
  { name: '412x915', width: 412, height: 915 },
  { name: '844x390_landscape', width: 844, height: 390 }
];

const PAGES = [
  '/',
  '/explore',
  '/kali-puja',
  '/map',
  '/planner',
  '/metro',
  '/music',
  '/calendar',
  '/helpline'
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('--- Launching Chrome for Viewport Diagnostics ---');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--no-first-run',
    '--disable-gpu',
    '--hide-scrollbars'
  ]);

  let versionInfo;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      versionInfo = await fetchJson('http://127.0.0.1:9222/json/version');
      if (versionInfo && versionInfo.webSocketDebuggerUrl) break;
    } catch (e) {}
  }

  if (!versionInfo || !versionInfo.webSocketDebuggerUrl) {
    throw new Error('Failed to connect to Chrome debugging port.');
  }

  console.log('Connected to Chrome WebSocket:', versionInfo.webSocketDebuggerUrl);

  const targets = await fetchJson('http://127.0.0.1:9222/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('DOM.enable');

  const report = {};

  for (const pagePath of PAGES) {
    const url = `http://localhost:3000${pagePath}`;
    console.log(`\n======================================================`);
    console.log(`Testing Route: ${pagePath}`);
    console.log(`======================================================`);
    report[pagePath] = {};

    await cdp.send('Page.navigate', { url });
    await sleep(1500); // Wait for page to render

    for (const vp of VIEWPORTS) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.width < 500
      });
      await sleep(300);

      const evalRes = await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const docW = document.documentElement.scrollWidth;
          const winW = window.innerWidth;
          const bodyW = document.body.scrollWidth;
          const overflowing = [];
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winW + 2) {
              overflowing.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || undefined,
                className: el.className && typeof el.className === 'string' ? el.className.split(' ').slice(0, 5).join(' ') : undefined,
                rectRight: Math.round(rect.right),
                rectWidth: Math.round(rect.width),
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth,
                excessPx: Math.round(rect.right - winW)
              });
            }
          }
          return {
            winW,
            docW,
            bodyW,
            hasOverflow: (docW > winW + 1) || (bodyW > winW + 1),
            overflowAmount: Math.max(0, docW - winW, bodyW - winW),
            overflowingElementsCount: overflowing.length,
            overflowingElements: overflowing.slice(0, 60)
          };
        })()`,
        returnByValue: true
      });

      const metrics = evalRes.result.value;
      report[pagePath][vp.name] = metrics;

      const status = metrics.hasOverflow ? `⚠️ OVERFLOW (+${metrics.overflowAmount}px, ${metrics.overflowingElementsCount} elements)` : '✅ FITS VIEWPORT';
      console.log(`  Viewport ${vp.name.padEnd(18)} : ${status}`);

      if (metrics.hasOverflow && metrics.overflowingElements.length > 0) {
        const nonSvg = metrics.overflowingElements.filter(el => el.tag !== 'svg' && el.tag !== 'circle' && el.tag !== 'path' && el.tag !== 'line' && el.tag !== 'g');
        console.log(`     Found ${metrics.overflowingElementsCount} total overflowing elements (${nonSvg.length} non-SVG elements)`);
        for (const el of (nonSvg.length > 0 ? nonSvg : metrics.overflowingElements).slice(0, 8)) {
          console.log(`     -> <${el.tag} id="${el.id || ''}" class="${el.className || ''}"> right=${el.rectRight}px (width=${el.rectWidth}px, excess=${el.excessPx}px)`);
        }
      }

      // Save screenshot for 375x812 on homepage and any failing viewports
      if (vp.name === '375x812' || (metrics.hasOverflow && vp.name === '320x568')) {
        const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        const filename = `vp_${pagePath.replace(/[^a-z0-9]/gi, '_')}_${vp.name}.png`;
        const filepath = path.join(ARTIFACT_DIR, filename);
        fs.writeFileSync(filepath, Buffer.from(screenshot.data, 'base64'));
        console.log(`     Saved screenshot: ${filename}`);
      }
    }
  }

  cdp.close();
  chromeProcess.kill();
  console.log('\n--- Diagnostics Complete ---');
}

run().catch(err => {
  console.error('Error running viewport test:', err);
  process.exit(1);
});
