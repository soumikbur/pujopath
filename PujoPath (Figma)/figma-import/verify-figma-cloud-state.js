const http = require('http');
const fs = require('fs');

async function getWsUrl() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!tab) throw new Error('Figma design tab not found');
  return tab.webSocketDebuggerUrl;
}

async function evalInTab(ws, expr) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.result && msg.result.result) {
          resolve(msg.result.result.value);
        } else {
          resolve(msg);
        }
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: { expression: expr, returnByValue: true }
    }));
  });
}

async function captureScreenshot(ws, filename) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        const buf = Buffer.from(msg.result.data, 'base64');
        fs.writeFileSync(filename, buf);
        resolve(buf.length);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot' }));
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  console.log('--- 1. INSPECTING ACTIVE CLOUD DOCUMENT ---');
  const docInfo = await evalInTab(ws, `(() => {
    return {
      title: document.title,
      url: window.location.href,
      rootName: figma.root.name,
      pageCount: figma.root.children.length,
      pages: figma.root.children.map(p => ({
        name: p.name,
        frameCount: p.children.length,
        frames: p.children.map(f => f.name)
      })),
      stylesCount: figma.getLocalPaintStyles().length,
      styles: figma.getLocalPaintStyles().map(s => s.name)
    };
  })()`);
  console.log('Document Info:', JSON.stringify(docInfo, null, 2));

  console.log('\n--- 2. VERIFYING PAGE 1: Web — Desktop ---');
  const desktopCheck = await evalInTab(ws, `(() => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
    
    // Find developer frame and verify layers
    const devFrame = page.children.find(c => c.name === '02_web_desktop_developer');
    let devTextNodes = [];
    if (devFrame) {
      function findText(node) {
        if (node.type === 'TEXT') devTextNodes.push(node.characters);
        if (node.children) {
          for (const ch of node.children) findText(ch);
        }
      }
      findText(devFrame);
    }

    return {
      activePage: figma.currentPage.name,
      frameCount: page.children.length,
      hasDeveloperFrame: !!devFrame,
      devFrameChildCount: devFrame ? devFrame.children.length : 0,
      devTextSamples: devTextNodes.slice(0, 15)
    };
  })()`);
  console.log('Web — Desktop Check:', JSON.stringify(desktopCheck, null, 2));
  await new Promise(r => setTimeout(r, 1000));
  await captureScreenshot(ws, 'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc/verify_web_desktop_canvas.png');
  console.log('Saved verify_web_desktop_canvas.png');

  console.log('\n--- 3. VERIFYING PAGE 2: Web — Mobile ---');
  const webMobileCheck = await evalInTab(ws, `(() => {
    const page = figma.root.children.find(p => p.name === 'Web — Mobile');
    figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
    return {
      activePage: figma.currentPage.name,
      frameCount: page.children.length,
      frames: page.children.map(c => c.name)
    };
  })()`);
  console.log('Web — Mobile Check:', JSON.stringify(webMobileCheck, null, 2));
  await new Promise(r => setTimeout(r, 1000));
  await captureScreenshot(ws, 'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc/verify_web_mobile_canvas.png');
  console.log('Saved verify_web_mobile_canvas.png');

  console.log('\n--- 4. VERIFYING PAGE 3: Capacitor — Android Mobile ---');
  const capCheck = await evalInTab(ws, `(() => {
    const page = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    figma.currentPage = page;
    figma.viewport.scrollAndZoomIntoView(page.children);
    return {
      activePage: figma.currentPage.name,
      frameCount: page.children.length,
      frames: page.children.map(c => c.name)
    };
  })()`);
  console.log('Capacitor — Android Mobile Check:', JSON.stringify(capCheck, null, 2));
  await new Promise(r => setTimeout(r, 1000));
  await captureScreenshot(ws, 'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc/verify_capacitor_mobile_canvas.png');
  console.log('Saved verify_capacitor_mobile_canvas.png');

  console.log('\n--- 5. VERIFYING LAYER EDITABILITY ---');
  const editCheck = await evalInTab(ws, `(() => {
    const page = figma.root.children.find(p => p.name === 'Web — Desktop');
    const firstFrame = page.children[0];
    const isFrameEditable = typeof firstFrame.resize === 'function' && typeof firstFrame.appendChild === 'function';
    // Test selecting a node
    figma.currentPage.selection = [firstFrame];
    const selectionName = figma.currentPage.selection[0].name;

    return {
      isFrameEditable,
      selectionName,
      selectionType: figma.currentPage.selection[0].type
    };
  })()`);
  console.log('Editability Check:', JSON.stringify(editCheck, null, 2));

  // Reset back to desktop page
  await evalInTab(ws, `figma.currentPage = figma.root.children.find(p => p.name === 'Web — Desktop')`);

  ws.close();
}

main().catch(console.error);
