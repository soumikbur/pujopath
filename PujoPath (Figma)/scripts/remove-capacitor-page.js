const http = require('http');

async function removeCapacitorPage() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!tab) throw new Error('Figma tab not found');

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const evalExpr = (expr) => new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result?.result?.value);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: { expression: expr, returnByValue: true, awaitPromise: true }
    }));
  });

  const res = await evalExpr(`(async () => {
    // Locate the Capacitor — Android Mobile page
    const capPage = figma.root.children.find(p => p.name.includes('Capacitor'));
    let removed = false;
    let oldName = '';
    if (capPage) {
      oldName = capPage.name;
      // Switch current page to desktop so we aren't on the deleted page
      const desk = figma.root.children.find(p => p.name === 'Web — Desktop');
      if (desk) {
        if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(desk);
        else figma.currentPage = desk;
      }
      capPage.remove();
      removed = true;
    }
    return {
      removed,
      oldName,
      remainingPages: figma.root.children.map(p => ({ id: p.id, name: p.name }))
    };
  })()`);

  console.log('Result of removing Capacitor page:', JSON.stringify(res, null, 2));
  ws.close();
}

removeCapacitorPage().catch(console.error);
