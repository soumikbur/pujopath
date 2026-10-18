const http = require('http');

async function testLazy() {
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

  const result = await new Promise(resolve => {
    const id = 200;
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
        expression: `(async () => {
          const report = [];
          for (const page of figma.root.children) {
            if (typeof figma.setCurrentPageAsync === 'function') {
              await figma.setCurrentPageAsync(page);
            } else {
              figma.currentPage = page;
            }
            await new Promise(r => setTimeout(r, 1200));
            report.push({
              name: page.name,
              frameCount: page.children.length,
              frames: page.children.map(c => c.name)
            });
          }
          // Switch back to Web — Desktop as default
          const desk = figma.root.children.find(p => p.name === 'Web — Desktop');
          if (desk) {
            if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(desk);
            else figma.currentPage = desk;
            figma.viewport.scrollAndZoomIntoView(desk.children);
          }
          return report;
        })()`,
        contextId: ctxId,
        returnByValue: true,
        awaitPromise: true
      }
    }));
  });

  console.log('Lazy load page inspection results:');
  console.log(JSON.stringify(result, null, 2));

  ws.close();
}

testLazy().catch(console.error);
