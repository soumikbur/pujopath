const http = require('http');

async function testPageLoading() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function evalExpr(expr) {
    return new Promise((resolve) => {
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
        params: { expression: expr, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  console.log('Testing page methods and switching...');
  const res = await evalExpr(`(async () => {
    const page2 = figma.root.children.find(p => p.name === 'Web — Mobile');
    const page3 = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    
    let p2Before = page2.children.length;
    let p3Before = page3.children.length;

    // Check if loadAsync exists
    const hasLoadAsync = typeof page2.loadAsync === 'function';

    // Switch to page 2
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page2);
    } else {
      figma.currentPage = page2;
    }
    let p2After = page2.children.length;

    // Switch to page 3
    if (typeof figma.setCurrentPageAsync === 'function') {
      await figma.setCurrentPageAsync(page3);
    } else {
      figma.currentPage = page3;
    }
    let p3After = page3.children.length;

    return {
      hasLoadAsync,
      p2Before,
      p2After,
      p2Frames: page2.children.map(c => c.name),
      p3Before,
      p3After,
      p3Frames: page3.children.map(c => c.name)
    };
  })()`);

  console.log('Lazy Loading Test Result:', JSON.stringify(res, null, 2));
  ws.close();
}

testPageLoading().catch(console.error);
