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

function createEvalFn(ws) {
  return function evalExpr(expr) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(new Error(msg.error.message));
          else if (msg.result && msg.result.result) resolve(msg.result.result.value);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    });
  };
}

function captureScreenshot(ws) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.result && msg.result.data) resolve(msg.result.data);
        else reject(new Error('Screenshot failed: ' + JSON.stringify(msg)));
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id,
      method: 'Page.captureScreenshot',
      params: { format: 'png' }
    }));
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  console.log('Connected to Figma WS:', wsUrl);
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);
  const evalExpr = createEvalFn(ws);

  const pages = [
    { name: 'Web — Desktop', out: 'figma_verified_web_desktop.png' },
    { name: 'Web — Mobile', out: 'figma_verified_web_mobile.png' },
    { name: 'Capacitor — Android Mobile', out: 'figma_verified_capacitor_mobile.png' }
  ];

  const valDir = path.resolve('PujoPath (Figma)/validation');

  for (const p of pages) {
    console.log(`Navigating to page "${p.name}"...`);
    await evalExpr(`(() => {
      const target = figma.root.children.find(page => page.name === '${p.name}');
      if (target) {
        figma.currentPage = target;
        figma.viewport.scrollAndZoomIntoView(target.children);
      }
    })()`);

    // Give 2 seconds for canvas to render
    await new Promise(r => setTimeout(r, 2000));

    console.log(`Capturing canvas screenshot for "${p.name}"...`);
    const b64 = await captureScreenshot(ws);
    const outPath = path.join(valDir, p.out);
    fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
    console.log(`✓ Saved canvas screenshot: ${p.out} (${(b64.length / 1024).toFixed(1)} KB base64)`);
  }

  // Also zoom in on specific key frames for detailed side-by-side verification:
  // 1. Desktop Home Frame close-up
  console.log('Capturing Desktop Home close-up...');
  await evalExpr(`(() => {
    const p = figma.root.children.find(page => page.name === 'Web — Desktop');
    figma.currentPage = p;
    const home = p.children.find(c => c.name === '01_web_desktop_home');
    if (home) figma.viewport.scrollAndZoomIntoView([home]);
  })()`);
  await new Promise(r => setTimeout(r, 1500));
  const b64Home = await captureScreenshot(ws);
  fs.writeFileSync(path.join(valDir, 'figma_detail_desktop_home.png'), Buffer.from(b64Home, 'base64'));
  console.log('✓ Saved figma_detail_desktop_home.png');

  // 2. Mobile Home Frame close-up
  console.log('Capturing Mobile Home close-up...');
  await evalExpr(`(() => {
    const p = figma.root.children.find(page => page.name === 'Web — Mobile');
    figma.currentPage = p;
    const home = p.children.find(c => c.name === '01_web_mobile_home');
    if (home) figma.viewport.scrollAndZoomIntoView([home]);
  })()`);
  await new Promise(r => setTimeout(r, 1500));
  const b64Mob = await captureScreenshot(ws);
  fs.writeFileSync(path.join(valDir, 'figma_detail_mobile_home.png'), Buffer.from(b64Mob, 'base64'));
  console.log('✓ Saved figma_detail_mobile_home.png');

  // 3. Capacitor Home Frame close-up
  console.log('Capturing Capacitor Home close-up...');
  await evalExpr(`(() => {
    const p = figma.root.children.find(page => page.name === 'Capacitor — Android Mobile');
    figma.currentPage = p;
    const home = p.children.find(c => c.name === '02_capacitor_android_home');
    if (home) figma.viewport.scrollAndZoomIntoView([home]);
  })()`);
  await new Promise(r => setTimeout(r, 1500));
  const b64Cap = await captureScreenshot(ws);
  fs.writeFileSync(path.join(valDir, 'figma_detail_capacitor_home.png'), Buffer.from(b64Cap, 'base64'));
  console.log('✓ Saved figma_detail_capacitor_home.png');

  // Return to Desktop overview
  await evalExpr(`(() => {
    const p = figma.root.children.find(page => page.name === 'Web — Desktop');
    figma.currentPage = p;
    figma.viewport.scrollAndZoomIntoView(p.children);
  })()`);

  ws.close();
  console.log('All verification captures completed!');
}

main().catch(console.error);
