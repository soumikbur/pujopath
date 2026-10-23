const http = require('http');

async function checkFigma() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!tab) {
    console.log('No design tab found yet. List:', list.map(t => ({ title: t.title, url: t.url })));
    return;
  }
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const res = {
            title: document.title,
            url: window.location.href,
            hasFigma: typeof figma !== 'undefined',
            bodyText: document.body ? document.body.innerText.substring(0, 300) : ''
          };
          if (typeof figma !== 'undefined' && figma.root) {
            res.rootName = figma.root.name;
            res.pages = figma.root.children.map(p => ({
              name: p.name,
              id: p.id,
              childCount: p.children.length,
              children: p.children.map(c => c.name)
            }));
          }
          return res;
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Figma state:', JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };
  ws.onerror = (err) => {
    console.error('WS Error:', err);
  };
}

checkFigma().catch(console.error);
