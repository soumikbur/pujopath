const http = require('http');
const fs = require('fs');

async function zoomAndCaptureFrames() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') contexts.push(msg.params.context);
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
    if (res === 'object') { ctxId = ctx.id; break; }
  }

  function evalExpr(expr) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          if (m.result?.result?.value !== undefined) resolve(m.result.result.value);
          else resolve(m);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, contextId: ctxId, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  async function takeScreenshot(filename) {
    return new Promise(resolve => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          const buf = Buffer.from(m.result.data, 'base64');
          fs.writeFileSync(filename, buf);
          resolve(buf.length);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot' }));
    });
  }

  // List of key frames to zoom in and capture
  const framesToCapture = [
    { name: '01_web_desktop_home', out: 'figma_frame_01_home.png' },
    { name: '02_web_desktop_explore', out: 'figma_frame_02_explore.png' },
    { name: '05_web_desktop_calendar', out: 'figma_frame_05_calendar.png' },
    { name: '09_web_desktop_developer', out: 'figma_frame_09_developer.png' }
  ];

  for (const f of framesToCapture) {
    console.log(`Zooming into ${f.name}...`);
    await evalExpr(`(() => {
      const page = figma.root.children.find(p => p.name === 'Web — Desktop');
      const frame = page.children.find(c => c.name === '${f.name}');
      if (frame) {
        figma.viewport.scrollAndZoomIntoView([frame]);
      }
    })()`);

    await new Promise(r => setTimeout(r, 1200));
    const outPath = `C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc/${f.out}`;
    const bytes = await takeScreenshot(outPath);
    console.log(`Saved ${f.out} (${(bytes / 1024).toFixed(1)} KB)`);
  }

  ws.close();
}

zoomAndCaptureFrames().catch(console.error);
