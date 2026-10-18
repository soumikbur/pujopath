const http = require('http');

async function main() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') {
      console.log('Context created:', msg.params.context.id, msg.params.context.name, msg.params.context.origin);
    } else if (msg.id === 200) {
      console.log('Eval in context result:', JSON.stringify(msg.result));
    }
  };

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));

  setTimeout(() => {
    // Send eval in top context and see if figma or window.__figma or something exists
    ws.send(JSON.stringify({
      id: 200,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          return {
            hasFigma: typeof figma !== 'undefined',
            windowKeys: Object.keys(window).filter(k => k.toLowerCase().includes('figma')),
            documentTitle: document.title
          };
        })()`,
        returnByValue: true
      }
    }));
  }, 1000);

  setTimeout(() => {
    ws.close();
    process.exit(0);
  }, 4000);
}

main().catch(console.error);
