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

  // 1. Switch to Capacitor — Android Mobile and center on all children
  console.log('Switching to Capacitor — Android Mobile page and centering on all children...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    await figma.setCurrentPageAsync(page);
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  const overviewPath = path.join(outDir, 'figma_capacitor_overview.png');
  await screenshot(overviewPath);
  console.log('Saved capacitor overview screenshot:', overviewPath);

  // 2. Zoom into Splash & Home (Light vs Dark)
  console.log('Zooming into 01_splash & 02_home (Light vs Dark)...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    const targetFrames = page.children.filter(c => 
      c.name.includes('01_capacitor_android_splash') ||
      c.name.includes('02_capacitor_android_home') ||
      c.name.includes('Label')
    );
    figma.viewport.scrollAndZoomIntoView(targetFrames);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  const homeZoomPath = path.join(outDir, 'figma_capacitor_home_zoom.png');
  await screenshot(homeZoomPath);
  console.log('Saved home zoom screenshot:', homeZoomPath);

  // 3. Zoom specifically into 02_capacitor_android_home (Light Mode)
  console.log('Zooming into 02_capacitor_android_home (Light Mode)...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    const homeLight = page.children.find(c => c.name === '02_capacitor_android_home (Light Mode)');
    if (homeLight) figma.viewport.scrollAndZoomIntoView([homeLight]);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  const homeLightDetail = path.join(outDir, 'figma_capacitor_home_light_detail.png');
  await screenshot(homeLightDetail);
  console.log('Saved home light detail screenshot:', homeLightDetail);

  // 4. Zoom specifically into 02_capacitor_android_home (Dark Mode)
  console.log('Zooming into 02_capacitor_android_home (Dark Mode)...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    const homeDark = page.children.find(c => c.name === '02_capacitor_android_home (Dark Mode)');
    if (homeDark) figma.viewport.scrollAndZoomIntoView([homeDark]);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  const homeDarkDetail = path.join(outDir, 'figma_capacitor_home_dark_detail.png');
  await screenshot(homeDarkDetail);
  console.log('Saved home dark detail screenshot:', homeDarkDetail);

  // 5. Zoom into 08_music_player with Floating Miniplayer
  console.log('Zooming into 08_capacitor_android_music_player (Light & Dark)...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    const musicFrames = page.children.filter(c => c.name.includes('08_capacitor_android_music_player'));
    if (musicFrames.length > 0) figma.viewport.scrollAndZoomIntoView(musicFrames);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  const musicDetail = path.join(outDir, 'figma_capacitor_music_miniplayer_detail.png');
  await screenshot(musicDetail);
  console.log('Saved music miniplayer detail screenshot:', musicDetail);

  // 6. Zoom into 10_developer (Light & Dark)
  console.log('Zooming into 10_capacitor_android_developer (Light & Dark)...');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    const devFrames = page.children.filter(c => c.name.includes('10_capacitor_android_developer'));
    if (devFrames.length > 0) figma.viewport.scrollAndZoomIntoView(devFrames);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  const devDetail = path.join(outDir, 'figma_capacitor_developer_detail.png');
  await screenshot(devDetail);
  console.log('Saved developer detail screenshot:', devDetail);

  // Reset viewport to overview
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);

  ws.close();
  console.log('All Capacitor canvas screenshots captured successfully!');
}

main().catch(console.error);
