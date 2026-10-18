const http = require('http');

async function findFigmaContext() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  if (!figmaTab) throw new Error('Figma tab not found');

  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') {
      contexts.push(msg.params.context);
    }
  };

  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  await new Promise(r => setTimeout(r, 1000));

  let targetContextId = null;
  for (const ctx of contexts) {
    const res = await new Promise(resolve => {
      const id = 1000 + ctx.id;
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
        params: { expression: 'typeof figma', contextId: ctx.id, returnByValue: true }
      }));
    });

    if (res === 'object') {
      targetContextId = ctx.id;
      console.log(`Found Figma context! ID: ${ctx.id}, Name: "${ctx.name}", Origin: "${ctx.origin}"`);
      break;
    }
  }

  if (!targetContextId) {
    ws.close();
    throw new Error('Could not find context where typeof figma === object');
  }

  // Inspect pages
  const docInfo = await new Promise(resolve => {
    const id = 2000;
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
        expression: `(() => {
          return {
            title: document.title,
            rootName: figma.root ? figma.root.name : null,
            pages: figma.root ? figma.root.children.map(p => ({
              id: p.id,
              name: p.name,
              childCount: p.children.length,
              frames: p.children.map(c => c.name)
            })) : []
          };
        })()`,
        contextId: targetContextId,
        returnByValue: true
      }
    }));
  });

  console.log('\nDocument Info:');
  console.log(JSON.stringify(docInfo, null, 2));

  ws.close();
}

findFigmaContext().catch(console.error);
