const http = require('http');
const fs = require('fs');
const path = require('path');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const figmaTab = list.find(t => t.url && t.url.includes('figma.com/design/'));
        resolve(figmaTab.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  console.log('Connected to Figma WS:', wsUrl);
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  function sendCdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          if (m.error) reject(m.error);
          else resolve(m.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function clickAt(x, y) {
    await sendCdp('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x,
      y,
      button: 'left',
      clickCount: 1
    });
    await new Promise(r => setTimeout(r, 80));
    await sendCdp('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x,
      y,
      button: 'left',
      clickCount: 1
    });
  }

  async function zoomToFit() {
    await sendCdp('Input.dispatchKeyEvent', {
      type: 'rawKeyDown',
      key: '1',
      code: 'Digit1',
      windowsVirtualKeyCode: 49,
      modifiers: 8 // Shift
    });
    await sendCdp('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: '1',
      code: 'Digit1',
      windowsVirtualKeyCode: 49,
      modifiers: 8
    });
  }

  async function captureScreenshot(destPath) {
    const res = await sendCdp('Page.captureScreenshot', {});
    fs.writeFileSync(destPath, Buffer.from(res.data, 'base64'));
  }

  const brainDir = 'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc';

  // 1. Click Web — Desktop (x: 200, y: 121)
  console.log('Clicking Web — Desktop at (200, 121)...');
  await clickAt(200, 121);
  await new Promise(r => setTimeout(r, 2000));
  await zoomToFit();
  await new Promise(r => setTimeout(r, 1200));
  await captureScreenshot(path.join(brainDir, 'figma_verified_desktop_exact.png'));
  console.log('✓ Captured figma_verified_desktop_exact.png');

  // 2. Click Web — Mobile (x: 200, y: 153)
  console.log('Clicking Web — Mobile at (200, 153)...');
  await clickAt(200, 153);
  await new Promise(r => setTimeout(r, 2000));
  await zoomToFit();
  await new Promise(r => setTimeout(r, 1200));
  await captureScreenshot(path.join(brainDir, 'figma_verified_mobile_exact.png'));
  console.log('✓ Captured figma_verified_mobile_exact.png');

  // 3. Click Capacitor — Android Mobile (x: 240, y: 185)
  console.log('Clicking Capacitor — Android Mobile at (240, 185)...');
  await clickAt(240, 185);
  await new Promise(r => setTimeout(r, 2000));
  await zoomToFit();
  await new Promise(r => setTimeout(r, 1200));
  await captureScreenshot(path.join(brainDir, 'figma_verified_capacitor_exact.png'));
  console.log('✓ Captured figma_verified_capacitor_exact.png');

  ws.close();
  console.log('All 3 page screenshots captured with CDP input clicks!');
}

main().catch(console.error);
