const http = require('http');

async function test() {
  const tabs = await new Promise((res, rej) => {
    http.get('http://127.0.0.1:9222/json', (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const figmaTab = tabs.find((t) => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  const result = await new Promise((resolve) => {
    const id = 1;
    const handler = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === id) {
        ws.removeEventListener('message', handler);
        console.log('Raw result:', JSON.stringify(m, null, 2));
        resolve(m.result?.result?.value);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(
      JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: {
          expression: `(async () => {
            const page = figma.root.children.find(p => p.name === 'Web — Desktop');
            if (typeof figma.setCurrentPageAsync === 'function') await figma.setCurrentPageAsync(page);
            else figma.currentPage = page;

            const explore = page.children.find(c => c.name === '03_web_desktop_explore');
            if (!explore) return { error: 'explore frame not found', pageChildren: page.children.map(c => c.name) };

            const allNodes = [];
            function rec(n) {
              const fills = Array.isArray(n.fills) ? n.fills.map(f => f.type) : null;
              allNodes.push({
                type: n.type,
                name: n.name,
                fills: fills
              });
              if (n.children) n.children.forEach(rec);
            }
            rec(explore);
            return {
              totalNodes: allNodes.length,
              imageNodes: allNodes.filter(x => x.fills && x.fills.includes('IMAGE')).map(x => ({ type: x.type, name: x.name }))
            };
          })()`,
          returnByValue: true,
          awaitPromise: true,
        },
      })
    );
  });

  console.log('Explore node analysis:', result);
  ws.close();
}

test().catch(console.error);
