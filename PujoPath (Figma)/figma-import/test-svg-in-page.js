const http = require('http');

async function testSvg() {
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
            const svgSample = '<svg width=\"100\" height=\"100\"><rect width=\"100\" height=\"100\" fill=\"#b42323\"/><text x=\"10\" y=\"50\" fill=\"#ffffff\">PujoPath</text></svg>';
            const node = figma.createNodeFromSvg(svgSample);
            node.name = 'Test_Node';
            return {
              success: true,
              nodeName: node.name,
              nodeType: node.type,
              width: node.width,
              height: node.height,
              children: node.children ? node.children.map(c => ({ name: c.name, type: c.type })) : []
            };
          } catch (e) {
            return {
              success: false,
              error: e.message,
              stack: e.stack
            };
          }
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('SVG Import Result:', JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };
}
testSvg().catch(console.error);
