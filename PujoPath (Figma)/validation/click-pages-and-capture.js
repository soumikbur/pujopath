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

  function evalExpr(expr) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    });
  }

  function mouseClick(x, y) {
    return new Promise((resolve) => {
      ws.send(JSON.stringify({
        id: 10,
        method: 'Input.dispatchMouseEvent',
        params: { type: 'mousePressed', x, y, button: 'left', clickCount: 1 }
      }));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 11,
          method: 'Input.dispatchMouseEvent',
          params: { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 }
        }));
        setTimeout(resolve, 300);
      }, 100);
    });
  }

  function shot(destPath) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          fs.writeFileSync(destPath, Buffer.from(m.result.data, 'base64'));
          resolve(destPath);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot' }));
    });
  }

  const brainDir = 'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc';

  // 1. Get coords of "Web — Desktop"
  const deskCoords = await evalExpr(`(() => {
    const els = Array.from(document.querySelectorAll('*'));
    const target = els.find(el => el.children.length === 0 && el.innerText && el.innerText.trim() === 'Web — Desktop');
    if (target) {
      const rect = target.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, rect };
    }
    return null;
  })()`);
  console.log('Web — Desktop coords:', deskCoords);

  if (deskCoords) {
    console.log('Dispatching mouse click on Web — Desktop...');
    await mouseClick(Math.round(deskCoords.x), Math.round(deskCoords.y));
    await new Promise(r => setTimeout(r, 2500));
    await shot(path.join(brainDir, 'canvas_web_desktop_verified.png'));
    console.log('✓ Saved canvas_web_desktop_verified.png');
  }

  // 2. Get coords of "Web — Mobile"
  const mobCoords = await evalExpr(`(() => {
    const els = Array.from(document.querySelectorAll('*'));
    const target = els.find(el => el.children.length === 0 && el.innerText && el.innerText.trim() === 'Web — Mobile');
    if (target) {
      const rect = target.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, rect };
    }
    return null;
  })()`);
  console.log('Web — Mobile coords:', mobCoords);

  if (mobCoords) {
    console.log('Dispatching mouse click on Web — Mobile...');
    await mouseClick(Math.round(mobCoords.x), Math.round(mobCoords.y));
    await new Promise(r => setTimeout(r, 2500));
    await shot(path.join(brainDir, 'canvas_web_mobile_verified.png'));
    console.log('✓ Saved canvas_web_mobile_verified.png');
  }

  // 3. Get coords of "Capacitor — Android Mobile"
  const capCoords = await evalExpr(`(() => {
    const els = Array.from(document.querySelectorAll('*'));
    const target = els.find(el => el.children.length === 0 && el.innerText && el.innerText.trim() === 'Capacitor — Android Mobile');
    if (target) {
      const rect = target.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, rect };
    }
    return null;
  })()`);
  console.log('Capacitor coords:', capCoords);

  if (capCoords) {
    console.log('Dispatching mouse click on Capacitor — Android Mobile...');
    await mouseClick(Math.round(capCoords.x), Math.round(capCoords.y));
    await new Promise(r => setTimeout(r, 2500));
    await shot(path.join(brainDir, 'canvas_capacitor_verified.png'));
    console.log('✓ Saved canvas_capacitor_verified.png');
  }

  ws.close();
  console.log('Mouse click verification completed!');
}

main().catch(console.error);
