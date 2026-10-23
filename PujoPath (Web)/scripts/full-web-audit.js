const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = path.resolve('C:\\Users\\soumi\\.gemini\\antigravity-ide\\brain\\efd504b0-6417-46e8-824b-e1f69b967c2c');
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'web_audit_screens');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'small_mobile', width: 320, height: 568, deviceScaleFactor: 2, mobile: true },
  { name: 'compact_android', width: 360, height: 800, deviceScaleFactor: 2, mobile: true },
  { name: 'standard_mobile', width: 375, height: 812, deviceScaleFactor: 3, mobile: true },
  { name: 'modern_mobile', width: 390, height: 844, deviceScaleFactor: 3, mobile: true },
  { name: 'large_mobile', width: 412, height: 915, deviceScaleFactor: 2.625, mobile: true },
  { name: 'landscape_mobile', width: 844, height: 390, deviceScaleFactor: 3, mobile: true },
  { name: 'tablet', width: 768, height: 1024, deviceScaleFactor: 2, mobile: false },
  { name: 'desktop', width: 1366, height: 768, deviceScaleFactor: 1, mobile: false },
  { name: 'large_desktop', width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false },
];

const ROUTES = [
  { path: '/', name: 'Homepage' },
  { path: '/select-puja', name: 'Select Puja Hub' },
  { path: '/explore', name: 'Explore & Search' },
  { path: '/pandals/bagbazar-sarbojanin', name: 'Pandal Details (Bagbazar)' },
  { path: '/kali-puja', name: 'Kali Puja Landing' },
  { path: '/map', name: 'Interactive Map' },
  { path: '/planner', name: 'Route Planner' },
  { path: '/metro', name: 'Kolkata Metro Guide' },
  { path: '/music', name: 'Puja Music Player' },
  { path: '/calendar', name: 'Puja Calendar & Tithi' },
  { path: '/mahalaya', name: 'Mahalaya Special' },
  { path: '/notifications', name: 'Festive Notifications' },
  { path: '/saved', name: 'Saved Bookmarks' },
  { path: '/helpline', name: 'Emergency Helpline' },
  { path: '/feedback', name: 'Feedback & Suggestions' },
  { path: '/about', name: 'About & Credits' },
  { path: '/developer', name: 'Developer Diagnostics' },
  { path: '/non-existent-route-test-404', name: '404 Error Page' },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
    this.consoleLogs = [];
    this.networkFailures = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
          this.consoleLogs.push({
            type: msg.params.type,
            args: msg.params.args.map((a) => a.value || a.description || ''),
          });
        }
        if (msg.method === 'Log.entryAdded') {
          this.consoleLogs.push({
            type: msg.params.entry.level,
            text: msg.params.entry.text,
          });
        }
        if (msg.method === 'Network.loadingFailed') {
          this.networkFailures.push({
            url: msg.params.url,
            error: msg.params.errorText,
          });
        }
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

async function ensureChrome() {
  try {
    const list = await fetchJson('http://127.0.0.1:9222/json/list');
    return { process: null, list };
  } catch (e) {
    const p = spawn(CHROME_PATH, [
      '--headless=new',
      '--remote-debugging-port=9222',
      `--user-data-dir=${process.env.TEMP}\\chrome-full-audit-${Date.now()}`,
      '--no-first-run',
      '--disable-gpu',
      '--hide-scrollbars',
    ]);
    for (let i = 0; i < 25; i++) {
      await sleep(400);
      try {
        const list = await fetchJson('http://127.0.0.1:9222/json/list');
        return { process: p, list };
      } catch (err) {}
    }
    throw new Error('Chrome launch timeout');
  }
}

async function runAudit() {
  console.log('=== Starting PujoPath Web Full Technical Audit ===');
  const { process: chromeProc, list: targets } = await ensureChrome();
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Network.enable');

  const auditReport = {
    timestamp: new Date().toISOString(),
    baseUrl: 'http://localhost:3000',
    routesAudited: [],
    viewportResults: {},
    accessibilitySummary: {},
    performanceMetrics: {},
    consoleErrors: [],
    networkErrors: [],
    overflowIssues: [],
  };

  for (const route of ROUTES) {
    console.log(`\nAuditing route: ${route.name} (${route.path})`);
    cdp.consoleLogs = [];
    cdp.networkFailures = [];

    // Navigate to route
    const navStartTime = Date.now();
    await cdp.send('Page.navigate', { url: `http://localhost:3000${route.path}` });
    await sleep(1500);
    const navDurationMs = Date.now() - navStartTime;

    const routeData = {
      path: route.path,
      name: route.name,
      navDurationMs,
      viewports: {},
      a11y: {},
    };

    // Test across all 9 viewports
    for (const vp of VIEWPORTS) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.deviceScaleFactor,
        mobile: vp.mobile,
      });
      await sleep(250);

      // Evaluate viewport overflow & geometry
      const overflowEval = await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          const docEl = document.documentElement;
          const body = document.body;
          const scrollW = Math.max(docEl.scrollWidth, body.scrollWidth);
          const hasHScroll = scrollW > w + 2;

          const overflowing = [];
          for (const el of document.querySelectorAll('*')) {
            const r = el.getBoundingClientRect();
            if (r.right > w + 2 && !['svg','circle','path','g','defs','clipPath'].includes(el.tagName.toLowerCase())) {
              overflowing.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || '',
                cls: (el.className && typeof el.className === 'string' ? el.className.slice(0, 60) : ''),
                right: Math.round(r.right),
                excess: Math.round(r.right - w)
              });
            }
          }
          return {
            windowWidth: w,
            windowHeight: h,
            scrollWidth: scrollW,
            hasHScroll,
            overflowCount: overflowing.length,
            sampleOverflow: overflowing.slice(0, 3)
          };
        })()`,
        returnByValue: true,
      });

      const vpResult = overflowEval.result.value || {};
      routeData.viewports[vp.name] = {
        viewport: `${vp.width}x${vp.height}`,
        fits: !vpResult.hasHScroll,
        scrollWidth: vpResult.scrollWidth,
        overflowCount: vpResult.overflowCount,
        samples: vpResult.sampleOverflow,
      };

      if (vpResult.hasHScroll) {
        auditReport.overflowIssues.push({
          route: route.path,
          viewport: vp.name,
          details: vpResult,
        });
      }

      // Take sample screenshot on small_mobile and desktop
      if (vp.name === 'small_mobile' || vp.name === 'desktop') {
        const screenshotData = await cdp.send('Page.captureScreenshot', { format: 'png' });
        const cleanName = route.path === '/' ? 'home' : route.path.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${cleanName}_${vp.name}.png`;
        fs.writeFileSync(path.join(SCREENSHOT_DIR, filename), Buffer.from(screenshotData.data, 'base64'));
      }
    }

    // Evaluate basic Accessibility & SEO on this route (desktop viewport)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(200);

    const a11yEval = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const images = Array.from(document.querySelectorAll('img'));
        const imagesWithoutAlt = images.filter(img => !img.hasAttribute('alt') || img.alt.trim() === '').length;

        const buttons = Array.from(document.querySelectorAll('button'));
        const buttonsWithoutAccessibleName = buttons.filter(b => {
          const text = b.innerText.trim();
          const ariaLabel = b.getAttribute('aria-label');
          const title = b.getAttribute('title');
          return !text && !ariaLabel && !title;
        }).length;

        const links = Array.from(document.querySelectorAll('a'));
        const linksWithoutAccessibleName = links.filter(a => {
          const text = a.innerText.trim();
          const ariaLabel = a.getAttribute('aria-label');
          const title = a.getAttribute('title');
          return !text && !ariaLabel && !title;
        }).length;

        const h1Count = document.querySelectorAll('h1').length;
        const pageTitle = document.title || '';
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';

        return {
          totalImages: images.length,
          imagesWithoutAlt,
          totalButtons: buttons.length,
          buttonsWithoutAccessibleName,
          totalLinks: links.length,
          linksWithoutAccessibleName,
          h1Count,
          pageTitle,
          hasMetaDesc: Boolean(metaDesc),
          metaDescLength: metaDesc.length,
          canonical
        };
      })()`,
      returnByValue: true,
    });

    routeData.a11y = a11yEval.result.value || {};
    routeData.consoleErrors = [...cdp.consoleLogs.filter((l) => l.type === 'error')];
    routeData.networkErrors = [...cdp.networkFailures];

    auditReport.routesAudited.push(routeData);
  }

  // Measure performance metrics on Homepage
  console.log('\n--- Measuring Homepage Web Vitals ---');
  await cdp.send('Page.navigate', { url: 'http://localhost:3000/' });
  await sleep(2500);

  const perfEval = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const navTiming = performance.getEntriesByType('navigation')[0] || {};
      const paintEntries = performance.getEntriesByType('paint') || [];
      const fcp = paintEntries.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
      
      return {
        dnsMs: Math.round(navTiming.domainLookupEnd - navTiming.domainLookupStart || 0),
        tcpMs: Math.round(navTiming.connectEnd - navTiming.connectStart || 0),
        ttfbMs: Math.round(navTiming.responseStart - navTiming.requestStart || 0),
        domContentLoadedMs: Math.round(navTiming.domContentLoadedEventEnd - navTiming.startTime || 0),
        loadEventMs: Math.round(navTiming.loadEventEnd - navTiming.startTime || 0),
        fcpMs: Math.round(fcp)
      };
    })()`,
    returnByValue: true,
  });

  auditReport.performanceMetrics = perfEval.result.value || {};

  const reportPath = path.join(__dirname, 'web_audit_results.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
  console.log(`\nAudit results written to: ${reportPath}`);
  console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);

  cdp.close();
  if (chromeProc) chromeProc.kill();
  console.log('=== Web Audit Complete ===');
}

runAudit().catch(console.error);
