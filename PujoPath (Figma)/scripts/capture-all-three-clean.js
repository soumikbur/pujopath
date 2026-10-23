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

  function cleanOverlays() {
    return new Promise(resolve => {
      const id = 10;
      const h = e => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', h);
          resolve();
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            // Remove dialogs, modals, and survey popups
            const modals = Array.from(document.querySelectorAll('[role="dialog"], [data-testid="modal"], div[class*="modal"]')).filter(m => {
              const t = m.innerText || '';
              return t.includes('Create new color style') || t.includes('Which statement best reflects');
            });
            modals.forEach(m => m.remove());

            // Remove survey container if present
            const survey = Array.from(document.querySelectorAll('div')).filter(d => (d.innerText || '').includes('Hi there. Which statement'));
            survey.forEach(s => s.remove());

            // Ensure File view is selected
            const fileBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim() === 'File');
            if (fileBtn) fileBtn.click();

            return true;
          })()`,
          returnByValue: true
        }
      }));
    });
  }

  let reqId = 2000;
  function evaluateInFigma(expr) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const h = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', h);
          if (m.result?.result?.value !== undefined) resolve(m.result.result.value);
          else if (m.result?.result?.description) resolve(m.result.result.description);
          else if (m.error) reject(new Error(JSON.stringify(msg.error)));
          else resolve(m);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, contextId: targetContextId, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  function captureScreenshot(filename) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const h = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', h);
          if (m.result?.data) {
            const outPath = path.join(ARTIFACT_DIR, filename);
            fs.writeFileSync(outPath, Buffer.from(m.result.data, 'base64'));
            console.log(`✓ Screenshot captured: ${filename}`);
            resolve(outPath);
          } else reject(new Error('Screenshot failed'));
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot' }));
    });
  }

  // 1. Capture Native Android Page Clean
  console.log('1. Capturing Native Android Page...');
  await cleanOverlays();
  await evaluateInFigma(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Native Android');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise(r => setTimeout(r, 1500));
  await cleanOverlays();
  await captureScreenshot('figma_native_android_clean.png');

  // 2. Capture Zoomed Native Android Hero Screens
  console.log('2. Capturing Zoomed Native Android Screens...');
  await evaluateInFigma(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Native Android');
    const heroNodes = page.children.filter(c => 
      c.name.includes('01_native_festival_select') || 
      c.name.includes('02_native_home') || 
      c.name.includes('03_native_explore')
    );
    figma.viewport.scrollAndZoomIntoView(heroNodes);
  })()`);
  await new Promise(r => setTimeout(r, 1500));
  await cleanOverlays();
  await captureScreenshot('figma_native_android_zoom.png');

  // 3. Capture Web — Mobile Page
  console.log('3. Capturing Web — Mobile Page...');
  await evaluateInFigma(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise(r => setTimeout(r, 1500));
  await cleanOverlays();
  await captureScreenshot('figma_web_mobile_clean.png');

  // 4. Capture Web — Desktop Page
  console.log('4. Capturing Web — Desktop Page...');
  await evaluateInFigma(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise(r => setTimeout(r, 1500));
  await cleanOverlays();
  await captureScreenshot('figma_web_desktop_clean.png');

  ws.close();
  console.log('Done capturing all pages cleanly.');
}

main().catch(console.error);
