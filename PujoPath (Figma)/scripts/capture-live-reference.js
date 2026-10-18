const http = require('http');
const fs = require('fs');
const path = require('path');

const VAL_DIR = path.resolve(__dirname, '../validation');
if (!fs.existsSync(VAL_DIR)) fs.mkdirSync(VAL_DIR, { recursive: true });

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

async function capture() {
  const tab = await getTab();
  if (!tab) {
    console.error('No Vercel tab found');
    return;
  }
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let reqId = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const tasks = [
    { url: 'https://pujopath-five.vercel.app/', name: 'live_desktop_home.png', width: 1440, height: 1200 },
    { url: 'https://pujopath-five.vercel.app/developer', name: 'live_desktop_developer.png', width: 1440, height: 1200 },
    { url: 'https://pujopath-five.vercel.app/explore', name: 'live_desktop_explore.png', width: 1440, height: 1200 },
    { url: 'https://pujopath-five.vercel.app/', name: 'live_mobile_home.png', width: 390, height: 844, isMobile: true },
    { url: 'https://pujopath-five.vercel.app/developer', name: 'live_mobile_developer.png', width: 390, height: 844, isMobile: true },
  ];

  for (const t of tasks) {
    console.log(`Capturing ${t.name}...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: t.width,
      height: t.height,
      deviceScaleFactor: 1,
      mobile: !!t.isMobile,
    });
    await send('Page.navigate', { url: t.url });
    await new Promise((r) => setTimeout(r, 2500));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot && shot.data) {
      fs.writeFileSync(path.join(VAL_DIR, t.name), Buffer.from(shot.data, 'base64'));
      console.log(`Saved ${t.name} (${shot.data.length} bytes base64)`);
    }
  }

  // Reset emulation
  await send('Emulation.clearDeviceMetricsOverride');
  ws.close();
}

capture().catch(console.error);
