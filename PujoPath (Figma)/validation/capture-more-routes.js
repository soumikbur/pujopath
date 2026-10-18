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
  const ws = new WebSocket(liveTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          resolve(m.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const routes = [
    { path: '/metro/', name: 'desktop_metro' },
    { path: '/music/', name: 'desktop_music' },
    { path: '/map/', name: 'desktop_map' },
    { path: '/mahalaya/', name: 'desktop_mahalaya' }
  ];

  const outDir = path.join(__dirname, 'reference_captures');

  for (const r of routes) {
    const fullUrl = `https://pujopath-five.vercel.app${r.path}`;
    console.log(`Navigating to ${fullUrl}...`);
    await sendCmd('Page.navigate', { url: fullUrl });
    await new Promise(res => setTimeout(res, 3500));

    const layoutMetrics = await sendCmd('Page.getLayoutMetrics');
    const contentHeight = Math.ceil(layoutMetrics.contentSize.height);

    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: Math.min(contentHeight, 5000),
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(res => setTimeout(res, 600));

    const shot = await sendCmd('Page.captureScreenshot', { captureBeyondViewport: true });
    const shotPath = path.join(outDir, `live_${r.name}_full.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`✓ Saved ${shotPath} (${contentHeight}px height)`);

    await sendCmd('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
  }

  ws.close();
}

main().catch(console.error);
