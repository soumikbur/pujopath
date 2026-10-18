const http = require('http');
const fs = require('fs');
const path = require('path');

const VAL_DIR = path.resolve(__dirname, '../validation');
if (!fs.existsSync(VAL_DIR)) fs.mkdirSync(VAL_DIR, { recursive: true });

async function getFigmaTab() {
  const tabs = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
  return tabs.find((t) => t.url && t.url.includes('figma.com/design/'));
}

async function capturePages() {
  const tab = await getFigmaTab();
  if (!tab) {
    console.error('Figma tab not found');
    return;
  }
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let reqId = 1;
  function evaluate(expr) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.result && msg.result.result) {
            resolve(msg.result.result.value);
          } else if (msg.error) {
            reject(new Error(msg.error.message));
          } else {
            resolve(msg);
          }
        }
      };
      ws.addEventListener('message', handler);
      ws.send(
        JSON.stringify({
          id,
          method: 'Runtime.evaluate',
          params: { expression: expr, returnByValue: true, awaitPromise: true },
        })
      );
    });
  }

  function screenshot(filename) {
    return new Promise((resolve) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.result && msg.result.data) {
            fs.writeFileSync(path.join(VAL_DIR, filename), Buffer.from(msg.result.data, 'base64'));
            console.log(`Saved screenshot: ${filename}`);
          }
          resolve();
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot', params: { format: 'png' } }));
    });
  }

  // 1. Capture Web — Desktop
  console.log('Capturing Web — Desktop in Figma...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise((r) => setTimeout(r, 2000));
  await screenshot('figma_web_desktop_full.png');

  // Zoom into 01_web_desktop_home
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    const home = page.children.find(c => c.name === '01_web_desktop_home');
    if (home) figma.viewport.scrollAndZoomIntoView([home]);
  })()`);
  await new Promise((r) => setTimeout(r, 1500));
  await screenshot('figma_desktop_home_detail.png');

  // Zoom into 02_web_desktop_developer
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    const dev = page.children.find(c => c.name === '02_web_desktop_developer');
    if (dev) figma.viewport.scrollAndZoomIntoView([dev]);
  })()`);
  await new Promise((r) => setTimeout(r, 1500));
  await screenshot('figma_desktop_dev_detail.png');

  // 2. Capture Web — Mobile
  console.log('Capturing Web — Mobile in Figma...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise((r) => setTimeout(r, 2000));
  await screenshot('figma_web_mobile_full.png');

  // Zoom into 01_web_mobile_home and 02_web_mobile_developer
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
    const homeAndDev = page.children.filter(c => c.name === '01_web_mobile_home' || c.name === '02_web_mobile_developer');
    if (homeAndDev.length > 0) figma.viewport.scrollAndZoomIntoView(homeAndDev);
  })()`);
  await new Promise((r) => setTimeout(r, 1500));
  await screenshot('figma_web_mobile_home_dev.png');

  // Zoom into 06_web_mobile_metro and 07_web_mobile_music
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
    const metroAndMusic = page.children.filter(c => c.name === '06_web_mobile_metro' || c.name === '07_web_mobile_music');
    if (metroAndMusic.length > 0) figma.viewport.scrollAndZoomIntoView(metroAndMusic);
  })()`);
  await new Promise((r) => setTimeout(r, 1500));
  await screenshot('figma_web_mobile_metro_music.png');

  // 3. Capture Capacitor — Android Mobile
  console.log('Capturing Capacitor — Android Mobile in Figma...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise((r) => setTimeout(r, 2000));
  await screenshot('figma_capacitor_full.png');

  // Zoom into 02_capacitor_android_home & 03_capacitor_android_explore
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    const homeAndExplore = page.children.filter(c => c.name === '02_capacitor_android_home' || c.name === '03_capacitor_android_explore');
    if (homeAndExplore.length > 0) figma.viewport.scrollAndZoomIntoView(homeAndExplore);
  })()`);
  await new Promise((r) => setTimeout(r, 1500));
  await screenshot('figma_capacitor_home_explore.png');

  // Zoom into 04_capacitor_android_map & 05_capacitor_android_planner
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    const mapAndPlanner = page.children.filter(c => c.name === '04_capacitor_android_map' || c.name === '05_capacitor_android_planner');
    if (mapAndPlanner.length > 0) figma.viewport.scrollAndZoomIntoView(mapAndPlanner);
  })()`);
  await new Promise((r) => setTimeout(r, 1500));
  await screenshot('figma_capacitor_map_planner.png');

  // Zoom into 08_capacitor_android_developer & 09_capacitor_android_music_player
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    const devAndMusic = page.children.filter(c => c.name === '08_capacitor_android_developer' || c.name === '09_capacitor_android_music_player');
    if (devAndMusic.length > 0) figma.viewport.scrollAndZoomIntoView(devAndMusic);
  })()`);
  await new Promise((r) => setTimeout(r, 1500));
  await screenshot('figma_capacitor_dev_music.png');

  // Keep Capacitor — Android Mobile active
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);

  ws.close();
  console.log('All Figma validation screenshots captured successfully!');
}

capturePages().catch(console.error);
