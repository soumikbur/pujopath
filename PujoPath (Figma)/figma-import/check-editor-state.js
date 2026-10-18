const http = require('http');

async function checkDom() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com'));
  if (!tab) {
    console.log('No figma tab found');
    return;
  }
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          return {
            canvasCount: document.querySelectorAll('canvas').length,
            title: document.title,
            currentUrl: window.location.href,
            cookies: document.cookie,
            hasFigmaGlobal: typeof figma !== 'undefined',
            hasApp: typeof App !== 'undefined'
          };
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('DOM check:', JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };
}
checkDom().catch(console.error);
