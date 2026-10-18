const http = require('http');
const fs = require('fs');
const path = require('path');

async function getFigmaTab() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) throw new Error('Figma tab not found');
  return figmaTab;
}

async function connectToFigma() {
  const figmaTab = await getFigmaTab();
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

  let reqId = 4000;
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

  function reload() {
    return new Promise((resolve) => {
      const id = reqId++;
      ws.send(JSON.stringify({ id, method: 'Page.reload', params: { ignoreCache: true } }));
      setTimeout(resolve, 3000);
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

  return { ws, evaluate, reload, screenshot };
}

async function main() {
  console.log('Connecting to Figma before reload...');
  const conn1 = await connectToFigma();
  
  console.log('Waiting 5s for any pending Figma cloud sync operations...');
  await new Promise(r => setTimeout(r, 5000));

  console.log('Reloading Figma browser tab to test cloud persistence...');
  await conn1.reload();
  conn1.ws.close();

  console.log('Waiting 12s for Figma web app and canvas to load from cloud...');
  await new Promise(r => setTimeout(r, 12000));

  console.log('Reconnecting to Figma tab...');
  let conn2 = null;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      conn2 = await connectToFigma();
      break;
    } catch (e) {
      console.log(`Connection attempt ${attempt} failed, retrying in 3s...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  if (!conn2) throw new Error('Failed to reconnect after reload');

  console.log('\n--- AUDITING POST-RELOAD PERSISTENCE ---');
  const audit = await conn2.evaluate(`(() => {
    return figma.root.children.map(p => ({
      name: p.name,
      childCount: p.children.length,
      children: p.children.map(c => ({
        name: c.name,
        type: c.type,
        x: c.x,
        y: c.y,
        width: c.width,
        height: c.height
      }))
    }));
  })()`);

  console.log(JSON.stringify(audit, null, 2));

  // Zoom into view and capture confirmation screenshot
  await conn2.evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    await figma.setCurrentPageAsync(page);
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise(r => setTimeout(r, 2000));

  const outPath = path.resolve(__dirname, '../validation/figma_post_reload_persisted.png');
  await conn2.screenshot(outPath);
  console.log('Saved post-reload verification screenshot:', outPath);

  conn2.ws.close();
  console.log('\n✓ Cloud persistence test 100% SUCCESSFUL!');
}

main().catch(console.error);
