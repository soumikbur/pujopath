const http = require('http');
const fs = require('fs');

async function captureDesktopCanvas() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) throw new Error('Figma tab not found');

  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') {
      contexts.push(msg.params.context);
    }
  };
  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  await new Promise(r => setTimeout(r, 1000));

  let ctxId = null;
  for (const ctx of contexts) {
    const res = await new Promise(resolve => {
      const id = 100 + ctx.id;
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
      ctxId = ctx.id;
      break;
    }
  }

  // Focus on Web — Desktop and zoom
  await new Promise(resolve => {
    const id = 300;
    const handler = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === id) {
        ws.removeEventListener('message', handler);
        resolve(m.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: {
        expression: `(async () => {
          const page = figma.root.children.find(p => p.name === 'Web — Desktop');
          if (typeof figma.setCurrentPageAsync === 'function') {
            await figma.setCurrentPageAsync(page);
          } else {
            figma.currentPage = page;
          }
          figma.viewport.scrollAndZoomIntoView(page.children);
          return { activePage: figma.currentPage.name, frameCount: page.children.length };
        })()`,
        contextId: ctxId,
        returnByValue: true,
        awaitPromise: true
      }
    }));
  });

  await new Promise(r => setTimeout(r, 1500));

  // Capture canvas screenshot
  const shot = await new Promise(resolve => {
    const id = 400;
    const handler = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === id) {
        ws.removeEventListener('message', handler);
        resolve(m.result.data);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot' }));
  });

  const buf = Buffer.from(shot, 'base64');
  const outPath = 'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc/figma_web_desktop_canvas_all.png';
  fs.writeFileSync(outPath, buf);
  console.log(`Saved canvas overview screenshot to ${outPath} (${(buf.length / 1024).toFixed(1)} KB)`);

  ws.close();
}

captureDesktopCanvas().catch(console.error);
