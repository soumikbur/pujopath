const http = require('http');
const fs = require('fs');
const path = require('path');

async function getFigmaConnection() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) throw new Error('Figma tab not found');

  await new Promise((res) => http.get(`http://127.0.0.1:9222/json/activate/${figmaTab.id}`, () => res()));

  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') contexts.push(msg.params.context);
  };
  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
  await new Promise(r => setTimeout(r, 1000));

  let targetContextId = null;
  for (const ctx of contexts) {
    const res = await new Promise(resolve => {
      const id = 1000 + ctx.id;
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
        params: { expression: 'typeof figma', contextId: ctx.id, returnByValue: true }
      }));
    });
    if (res === 'object') {
      targetContextId = ctx.id;
      break;
    }
  }

  let reqId = 3000;
  function evaluate(expr) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.result?.result?.value !== undefined) resolve(msg.result.result.value);
          else if (msg.result?.result?.description) resolve(msg.result.result.description);
          else if (msg.error) reject(new Error(JSON.stringify(msg.error)));
          else resolve(msg);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, contextId: targetContextId, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  function screenshot(filename) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.result?.data) {
            fs.writeFileSync(filename, Buffer.from(msg.result.data, 'base64'));
            resolve(filename);
          } else {
            reject(new Error(JSON.stringify(msg)));
          }
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot', params: { format: 'png' } }));
    });
  }

  return { ws, evaluate, screenshot };
}

async function main() {
  const { ws, evaluate, screenshot } = await getFigmaConnection();

  const outDir = path.resolve(__dirname, '../validation');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Capture overview of both rows
  console.log('Centering on all children of Web — Desktop...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    await figma.setCurrentPageAsync(page);
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  const overviewPath = path.join(outDir, 'figma_desktop_light_and_dark_overview.png');
  await screenshot(overviewPath);
  console.log('Saved overview screenshot:', overviewPath);

  // Zoom into first two columns: Home & Explore in both Light and Dark
  console.log('Zooming into Home & Explore (Light & Dark)...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    const targetFrames = page.children.filter(c => 
      c.name.includes('01_web_desktop_home') || 
      c.name.includes('02_web_desktop_explore') ||
      c.name.includes('Label')
    );
    figma.viewport.scrollAndZoomIntoView(targetFrames);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  const zoomPath = path.join(outDir, 'figma_desktop_light_and_dark_zoom.png');
  await screenshot(zoomPath);
  console.log('Saved zoom screenshot:', zoomPath);

  // Zoom specifically into Home Light Mode
  console.log('Zooming into 01_web_desktop_home (Light Mode)...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    const homeLight = page.children.find(c => c.name === '01_web_desktop_home (Light Mode)');
    if (homeLight) figma.viewport.scrollAndZoomIntoView([homeLight]);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  const homeLightPath = path.join(outDir, 'figma_desktop_home_light_detail.png');
  await screenshot(homeLightPath);
  console.log('Saved home light detail screenshot:', homeLightPath);

  ws.close();
  console.log('All screenshots captured successfully!');
}

main().catch(console.error);
