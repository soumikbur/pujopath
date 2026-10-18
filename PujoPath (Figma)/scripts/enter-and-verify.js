const http = require('http');
const fs = require('fs');

async function enterAndVerify() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  // Click "Open here instead"
  console.log('Clicking "Open here instead"...');
  await new Promise(resolve => {
    const id = 10;
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
        expression: `(() => {
          const links = Array.from(document.querySelectorAll('a, button, [role="button"]'));
          const openHere = links.find(el => el.textContent && el.textContent.toLowerCase().includes('open here'));
          if (openHere) { openHere.click(); return true; }
          return false;
        })()`,
        returnByValue: true
      }
    }));
  });

  console.log('Waiting 8 seconds for Figma editor to load from cloud...');
  await new Promise(r => setTimeout(r, 8000));

  // Find execution context
  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') contexts.push(msg.params.context);
  };
  ws.send(JSON.stringify({ id: 20, method: 'Runtime.enable' }));
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

  console.log('Figma Context ID:', ctxId);

  // Read full document state
  const docState = await new Promise(resolve => {
    const id = 30;
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
      params: {
        expression: `(() => {
          const desk = figma.root.children.find(p => p.name === 'Web — Desktop');
          let textCount = 0;
          let nodeCount = 0;
          function countNodes(n) {
            nodeCount++;
            if (n.type === 'TEXT') textCount++;
            if (n.children) for (const c of n.children) countNodes(c);
          }
          if (desk) {
            for (const f of desk.children) countNodes(f);
            figma.currentPage = desk;
            figma.viewport.scrollAndZoomIntoView(desk.children);
          }

          return {
            title: document.title,
            rootName: figma.root.name,
            pages: figma.root.children.map(p => ({
              id: p.id,
              name: p.name,
              childCount: p.children.length,
              frames: p.children.map(c => c.name)
            })),
            desktopSummary: {
              frameCount: desk ? desk.children.length : 0,
              totalNodes: nodeCount,
              textNodes: textCount
            }
          };
        })()`,
        contextId: ctxId,
        returnByValue: true
      }
    }));
  });

  console.log('\nCONFIRMED CLOUD PERSISTED STATE:');
  console.log(JSON.stringify(docState, null, 2));

  await new Promise(r => setTimeout(r, 2000));

  // Take screenshot
  const shot = await new Promise(resolve => {
    const id = 40;
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
  const outPath = 'C:/Users/soumi/.gemini/antigravity-ide/brain/1f94477c-1543-41c0-b6c2-4a62a091aabc/final_persisted_desktop_verified.png';
  fs.writeFileSync(outPath, buf);
  console.log(`Saved ${outPath} (${(buf.length / 1024).toFixed(1)} KB)`);

  ws.close();
}

enterAndVerify().catch(console.error);
