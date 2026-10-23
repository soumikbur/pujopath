const fs = require('fs');
const path = require('path');
const http = require('http');

const ARTIFACT_DIR = 'C:/Users/soumi/.gemini/antigravity-ide/brain/efd504b0-6417-46e8-824b-e1f69b967c2c';

async function main() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej));

  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  // Set viewport to 1920x1080
  ws.send(JSON.stringify({
    id: 1,
    method: 'Emulation.setDeviceMetricsOverride',
    params: { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false }
  }));

  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') {
      contexts.push(msg.params.context);
    }
  };
  ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
  await new Promise(r => setTimeout(r, 1000));

  // Find Figma context
  let targetContextId = null;
  for (const ctx of contexts) {
    const res = await new Promise(resolve => {
      const id = 1000 + ctx.id;
      const h = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', h);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', h);
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

  // Click File button in main DOM
  await new Promise(resolve => {
    const id = 10;
    const h = e => {
      const m = JSON.parse(e.data);
      if (m.id === id) {
        ws.removeEventListener('message', h);
        resolve(m.result?.result?.value);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          // Click File button
          const btns = Array.from(document.querySelectorAll('button'));
          const fileBtn = btns.find(b => b.innerText && b.innerText.trim() === 'File');
          if (fileBtn) fileBtn.click();

          // Remove any survey container or floating dialogs
          const overlays = Array.from(document.querySelectorAll('div, iframe')).filter(el => {
            const t = el.innerText || '';
            return t.includes('Which statement best reflects') || t.includes('opinion you would share');
          });
          overlays.forEach(o => o.remove());

          return { clickedFile: !!fileBtn, removedOverlays: overlays.length };
        })()`,
        returnByValue: true
      }
    }));
  });

  await new Promise(r => setTimeout(r, 1500));

  // Switch to Native Android and center canvas
  if (targetContextId) {
    await new Promise((resolve, reject) => {
      const id = 20;
      const h = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', h);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: {
          expression: `(async () => {
            const page = figma.root.children.find(p => p.name === 'Native Android');
            if (page) {
              if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
              else figma.currentPage = page;
              figma.viewport.scrollAndZoomIntoView(page.children);
              return { success: true, count: page.children.length };
            }
            return { success: false };
          })()`,
          contextId: targetContextId,
          returnByValue: true,
          awaitPromise: true
        }
      }));
    });
  }

  await new Promise(r => setTimeout(r, 2000));

  // Capture clean full HD screenshot
  await new Promise((resolve, reject) => {
    const id = 30;
    const h = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === id) {
        ws.removeEventListener('message', h);
        if (m.result?.data) {
          const outPath = path.join(ARTIFACT_DIR, 'figma_native_android_canvas_view.png');
          fs.writeFileSync(outPath, Buffer.from(m.result.data, 'base64'));
          console.log(`✓ Screenshot captured: figma_native_android_canvas_view.png`);
          resolve();
        } else reject(new Error('Screenshot failed'));
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot' }));
  });

  ws.close();
}

main().catch(console.error);
