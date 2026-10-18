const http = require('http');
const fs = require('fs');
const path = require('path');

const VAL_DIR = path.resolve(__dirname, '../validation/reference_captures');
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
  let tab = await getTab();
  if (!tab) {
    console.error('No Vercel tab found. Creating one...');
    tab = await new Promise(resolve => {
      const req = http.request({
        hostname: '127.0.0.1',
        port: 9222,
        path: '/json/new?' + encodeURIComponent('https://pujopath-five.vercel.app/'),
        method: 'PUT'
      }, r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => resolve(JSON.parse(d)));
      });
      req.end();
    });
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

  const desktopTasks = [
    { url: 'https://pujopath-five.vercel.app/', name: 'ref_desktop_home.png' },
    { url: 'https://pujopath-five.vercel.app/explore', name: 'ref_desktop_explore.png' },
    { url: 'https://pujopath-five.vercel.app/planner', name: 'ref_desktop_planner.png' },
    { url: 'https://pujopath-five.vercel.app/calendar', name: 'ref_desktop_calendar.png' },
    { url: 'https://pujopath-five.vercel.app/metro', name: 'ref_desktop_metro.png' },
    { url: 'https://pujopath-five.vercel.app/developer', name: 'ref_desktop_developer.png' },
  ];

  const mobileTasks = [
    { url: 'https://pujopath-five.vercel.app/', name: 'ref_mobile_home.png' },
    { url: 'https://pujopath-five.vercel.app/explore', name: 'ref_mobile_explore.png' },
    { url: 'https://pujopath-five.vercel.app/planner', name: 'ref_mobile_planner.png' },
    { url: 'https://pujopath-five.vercel.app/calendar', name: 'ref_mobile_calendar.png' },
    { url: 'https://pujopath-five.vercel.app/metro', name: 'ref_mobile_metro.png' },
    { url: 'https://pujopath-five.vercel.app/music', name: 'ref_mobile_music.png' },
    { url: 'https://pujopath-five.vercel.app/developer', name: 'ref_mobile_developer.png' },
  ];

  console.log('=== CAPTURING WEB DESKTOP (1440px) ===');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  for (const t of desktopTasks) {
    console.log(`Navigating to ${t.url}...`);
    await send('Page.navigate', { url: t.url });
    await new Promise((r) => setTimeout(r, 3000));
    
    // Get full page height
    const layout = await send('Page.getLayoutMetrics');
    const contentHeight = Math.ceil(layout.contentSize.height);
    console.log(`Content height for ${t.name}: ${contentHeight}px`);

    // Capture screenshot with full content size
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: Math.min(contentHeight, 4000),
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 1000));

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    if (shot && shot.data) {
      fs.writeFileSync(path.join(VAL_DIR, t.name), Buffer.from(shot.data, 'base64'));
      console.log(`Saved ${t.name} (${(shot.data.length / 1024).toFixed(1)} KB)`);
    }
  }

  console.log('\n=== CAPTURING WEB MOBILE (390px) ===');
  for (const t of mobileTasks) {
    console.log(`Navigating to ${t.url}...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send('Page.navigate', { url: t.url });
    await new Promise((r) => setTimeout(r, 3000));

    const layout = await send('Page.getLayoutMetrics');
    const contentHeight = Math.ceil(layout.contentSize.height);
    console.log(`Content height for ${t.name}: ${contentHeight}px`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: Math.min(contentHeight, 4500),
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 1000));

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    if (shot && shot.data) {
      fs.writeFileSync(path.join(VAL_DIR, t.name), Buffer.from(shot.data, 'base64'));
      console.log(`Saved ${t.name} (${(shot.data.length / 1024).toFixed(1)} KB)`);
    }
  }

  // Reset
  await send('Emulation.clearDeviceMetricsOverride');
  ws.close();
  console.log('\nAll web reference captures completed successfully!');
}

capture().catch(console.error);
