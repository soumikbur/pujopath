const http = require('http');

async function testFigma() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!tab) {
    console.log('No design tab found');
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
            hasFigma: typeof figma !== 'undefined',
            figmaKeys: typeof figma !== 'undefined' ? Object.keys(figma) : [],
            title: document.title,
            url: window.location.href
          };
          if (typeof figma !== 'undefined' && figma.root) {
            res.rootName = figma.root.name;
            res.pages = figma.root.children ? figma.root.children.map(p => p.name) : [];
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
      console.log('Figma API Test Result:', JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };
}
testFigma().catch(console.error);
