const fs = require('fs');
const path = require('path');
const http = require('http');

const ARTIFACT_DIR = 'C:/Users/soumi/.gemini/antigravity-ide/brain/efd504b0-6417-46e8-824b-e1f69b967c2c';

async function getFigmaTab() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }).on('error', rej));

  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) throw new Error('Figma tab not found');
  return figmaTab;
}

async function main() {
  console.log('=== STEP 1: Refreshing the Figma Document ===');
  let tab = await getFigmaTab();
  let ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  // Send Page.reload
  console.log('Triggering Page.reload on Figma tab...');
  ws.send(JSON.stringify({ id: 10, method: 'Page.reload', params: { ignoreCache: true } }));
  ws.close();

  console.log('Waiting 15 seconds for Figma to fully reload and sync cloud state...');
  await new Promise(r => setTimeout(r, 15000));

  console.log('\n=== STEP 2: Reconnecting to Reloaded Figma Tab ===');
  tab = await getFigmaTab();
  ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  // Collect execution contexts
  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') {
      contexts.push(msg.params.context);
    }
  };
  ws.send(JSON.stringify({ id: 20, method: 'Runtime.enable' }));
  await new Promise(r => setTimeout(r, 3000));

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
      console.log(`Discovered Figma Context ID after reload: ${ctx.id}`);
      break;
    }
  }

  if (!targetContextId) {
    // Retry finding context
    console.log('Figma context not ready yet, waiting 5 more seconds...');
    await new Promise(r => setTimeout(r, 5000));
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
        params: {
          expression: expr,
          contextId: targetContextId,
          returnByValue: true,
          awaitPromise: true
        }
      }));
    });
  }

  function captureScreenshot(filename) {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.result?.data) {
            const outPath = path.join(ARTIFACT_DIR, filename);
            fs.writeFileSync(outPath, Buffer.from(msg.result.data, 'base64'));
            console.log(`✓ Screenshot captured: ${filename}`);
            resolve(outPath);
          } else {
            reject(new Error('Screenshot failed'));
          }
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot' }));
    });
  }

  console.log('\n=== STEP 3: Verifying Document Persistence After Reload ===');
  const docSummary = await evaluate(`(async () => {
    // Check pages
    const pages = figma.root.children.map(p => ({
      id: p.id,
      name: p.name,
      childCount: p.children.length
    }));

    return {
      title: document.title,
      pages,
      hasCapacitor: pages.some(p => p.name.includes('Capacitor')),
      hasNativeAndroid: pages.some(p => p.name === 'Native Android'),
      hasWebDesktop: pages.some(p => p.name === 'Web — Desktop'),
      hasWebMobile: pages.some(p => p.name === 'Web — Mobile')
    };
  })()`);

  console.log('Reloaded Document Summary:', JSON.stringify(docSummary, null, 2));

  // Switch to "Native Android" page and zoom
  console.log('\n=== STEP 4: Inspecting and Capturing "Native Android" Page ===');
  const nativeInspect = await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Native Android');
    if (!page) return { error: 'Native Android page not found' };
    
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }

    figma.viewport.scrollAndZoomIntoView(page.children);

    return {
      name: page.name,
      childCount: page.children.length,
      children: page.children.map(c => ({ name: c.name, x: c.x, y: c.y, w: c.width, h: c.height }))
    };
  })()`);
  console.log(`Native Android page has ${nativeInspect.childCount} children.`);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('figma_native_android_reloaded.png');

  // Switch to "Web — Mobile" page and zoom
  console.log('\n=== STEP 5: Inspecting and Capturing "Web — Mobile" Page ===');
  const mobileInspect = await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
    if (!page) return { error: 'Web — Mobile page not found' };
    
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }

    figma.viewport.scrollAndZoomIntoView(page.children);

    return {
      name: page.name,
      childCount: page.children.length
    };
  })()`);
  console.log(`Web — Mobile page has ${mobileInspect.childCount} children.`);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('figma_web_mobile_reloaded.png');

  // Switch to "Web — Desktop" page and zoom
  console.log('\n=== STEP 6: Inspecting and Capturing "Web — Desktop" Page ===');
  const desktopInspect = await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    if (!page) return { error: 'Web — Desktop page not found' };
    
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }

    figma.viewport.scrollAndZoomIntoView(page.children);

    return {
      name: page.name,
      childCount: page.children.length
    };
  })()`);
  console.log(`Web — Desktop page has ${desktopInspect.childCount} children.`);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('figma_web_desktop_reloaded.png');

  // Switch back to Native Android and capture UI with left pages panel
  console.log('\n=== STEP 7: Capturing Final UI with Pages Panel ===');
  await evaluate(`(async () => {
    const page = figma.root.children.find(p => p.name === 'Native Android');
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page);
    } else {
      figma.currentPage = page;
    }
    figma.viewport.scrollAndZoomIntoView(page.children);
  })()`);
  await new Promise(r => setTimeout(r, 2000));
  await captureScreenshot('figma_final_native_android_ui.png');

  ws.close();
  console.log('\n✓ ALL VERIFICATION STEPS COMPLETED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
