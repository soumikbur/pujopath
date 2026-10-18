const http = require('http');

async function listContexts() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') {
      contexts.push(msg.params.context);
    }
  };

  setTimeout(async () => {
    console.log(`Found ${contexts.length} Execution Contexts.`);
    for (const ctx of contexts) {
      const res = await new Promise((resolve) => {
        const id = Math.floor(Math.random() * 1000000);
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
            expression: `({ id: ${ctx.id}, origin: "${ctx.origin}", hasFigma: typeof figma !== 'undefined', hasApp: typeof App !== 'undefined' })`,
            contextId: ctx.id,
            returnByValue: true
          }
        }));
      });
      console.log('Context:', res);
    }
    ws.close();
  }, 1000);
}

listContexts().catch(console.error);
