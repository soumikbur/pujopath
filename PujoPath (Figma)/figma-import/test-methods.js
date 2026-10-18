const http = require('http');

async function testMethods() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          try {
            return {
              type: typeof figma,
              keys: Object.keys(figma),
              hasRoot: !!figma.root,
              rootName: figma.root ? figma.root.name : null,
              createPageType: typeof figma.createPage,
              createNodeFromSvgType: typeof figma.createNodeFromSvg
            };
          } catch (e) {
            return { error: e.message, stack: e.stack };
          }
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Result:', JSON.stringify(msg, null, 2));
      ws.close();
    }
  };
}
testMethods().catch(console.error);
