const fs = require('fs');
const path = require('path');
const http = require('http');

const ARTIFACT_DIR = 'C:/Users/soumi/.gemini/antigravity-ide/brain/efd504b0-6417-46e8-824b-e1f69b967c2c';

async function main() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej));

  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) throw new Error('Figma tab not found');

  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  // Set viewport to 1920x1080
  ws.send(JSON.stringify({
    id: 1,
    method: 'Emulation.setDeviceMetricsOverride',
    params: { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false }
  }));

  // Enable Runtime
  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') {
      contexts.push(msg.params.context);
    }
  };
  ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
  await new Promise(r => setTimeout(r, 1500));

  // Dismiss popup by clicking SVG or pressing Escape
  await new Promise(resolve => {
    const id = 10;
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
        expression: `(() => {
          // Find survey X button
          const svgs = Array.from(document.querySelectorAll('svg'));
          for (const s of svgs) {
            const path = s.querySelector('path');
            if (path && (path.getAttribute('d') || '').includes('M')) {
              const btn = s.closest('button, [role="button"], div');
              if (btn && btn.offsetHeight < 40 && btn.offsetWidth < 40) {
                // If it looks like a close icon
                const rect = btn.getBoundingClientRect();
                if (rect.top > 200 && rect.top < 800) {
                  btn.click();
                }
              }
            }
          }
          // Also press Escape
          document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));
          return true;
        })()`,
        returnByValue: true
      }
    }));
  });

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
      console.log(`Discovered Figma Context: ${ctx.id}`);
      break;
    }
  }

  let reqId = 2000;
  function evaluate(expr) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const h = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', h);
          if (m.result?.result?.value !== undefined) resolve(m.result.result.value);
          else if (m.result?.result?.description) resolve(m.result.result.description);
          else if (m.error) reject(new Error(JSON.stringify(m.error)));
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
          } else {
            reject(new Error('Screenshot failed'));
          }
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot' }));
    });
  }

  // 1. Inspect all pages and child counts
  console.log('\n--- Inspecting Document Tree ---');
  const doc = await evaluate(`(() => {
    return {
      title: document.title,
      rootName: figma.root ? figma.root.name : null,
      pages: figma.root ? figma.root.children.map(p => ({
        id: p.id,
        name: p.name,
        childCount: p.children.length
      })) : []
    };
  })()`);
  console.log('Document Summary:', JSON.stringify(doc, null, 2));

  // 2. Select Native Android and zoom to fit
  console.log('\n--- Capturing Native Android Page ---');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Native Android');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('figma_native_android_full.png');

  // 3. Select Web — Mobile and zoom to fit
  console.log('\n--- Capturing Web — Mobile Page ---');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('figma_web_mobile_full.png');

  // 4. Select Web — Desktop and zoom to fit
  console.log('\n--- Capturing Web — Desktop Page ---');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('figma_web_desktop_full.png');

  // 5. Switch back to Native Android and zoom in on key live screens (Festival select, Home, Explore, Music)
  console.log('\n--- Capturing Native Android Close-up ---');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Native Android');
    if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
    else figma.currentPage = page;
    
    // Zoom in on the first 4 screens of Light Mode
    const heroNodes = page.children.filter(c => 
      c.name.includes('01_native_festival_select') || 
      c.name.includes('02_native_home') || 
      c.name.includes('03_native_explore') ||
      c.name.includes('08_native_music_player')
    );
    if (heroNodes.length > 0) {
      figma.viewport.scrollAndZoomIntoView(heroNodes);
    }
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('figma_native_android_closeup.png');

  ws.close();
  console.log('\n✓ All screenshots successfully saved to artifacts directory!');
}

main().catch(console.error);
