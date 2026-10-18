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

  function shot(destPath) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          if (m.result && m.result.data) {
            fs.writeFileSync(destPath, Buffer.from(m.result.data, 'base64'));
            resolve(destPath);
          } else {
            reject(new Error('Shot failed: ' + JSON.stringify(m)));
          }
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot' }));
    });
  }

  const brainDir = 'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc';

  // 1. Switch to Web — Mobile by clicking the tab element in Figma UI
  console.log('Clicking "Web — Mobile"...');
  const clickMob = await evalExpr(`(() => {
    const els = Array.from(document.querySelectorAll('*'));
    const target = els.find(el => el.children.length === 0 && el.innerText && el.innerText.trim() === 'Web — Mobile');
    if (target) {
      target.click();
      return 'Clicked: ' + target.innerText;
    }
    return 'Element not found';
  })()`);
  console.log(clickMob);
  await new Promise(r => setTimeout(r, 2000));
  await shot(path.join(brainDir, 'figma_canvas_web_mobile.png'));
  console.log('✓ Saved figma_canvas_web_mobile.png');

  // 2. Switch to Web — Desktop
  console.log('Clicking "Web — Desktop"...');
  const clickDesk = await evalExpr(`(() => {
    const els = Array.from(document.querySelectorAll('*'));
    const target = els.find(el => el.children.length === 0 && el.innerText && el.innerText.trim() === 'Web — Desktop');
    if (target) {
      target.click();
      return 'Clicked: ' + target.innerText;
    }
    return 'Element not found';
  })()`);
  console.log(clickDesk);
  await new Promise(r => setTimeout(r, 2000));
  await shot(path.join(brainDir, 'figma_canvas_web_desktop.png'));
  console.log('✓ Saved figma_canvas_web_desktop.png');

  ws.close();
}

main().catch(console.error);
