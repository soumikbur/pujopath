const http = require('http');

async function auditEditability() {
  const tabs = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const figmaTab = tabs.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(figmaTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const contexts = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.executionContextCreated') contexts.push(msg.params.context);
  };
  ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
  await new Promise(r => setTimeout(r, 1000));

  let ctxId = null;
  for (const ctx of contexts) {
    const res = await new Promise(resolve => {
      const id = 100 + ctx.id;
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
    if (res === 'object') { ctxId = ctx.id; break; }
  }

  const auditResult = await new Promise(resolve => {
    const id = 500;
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
          const page = figma.root.children.find(p => p.name === 'Web — Desktop');
          const typeCounts = {};
          let totalNodes = 0;
          const textSamples = [];
          const frameAudits = [];

          function walk(node) {
            totalNodes++;
            typeCounts[node.type] = (typeCounts[node.type] || 0) + 1;
            if (node.type === 'TEXT') {
              if (textSamples.length < 25) textSamples.push(node.characters);
            }
            if (node.children) {
              for (const child of node.children) {
                walk(child);
              }
            }
          }

          for (const frame of page.children) {
            const frameTypes = {};
            let frameTotal = 0;
            function walkFrame(n) {
              frameTotal++;
              frameTypes[n.type] = (frameTypes[n.type] || 0) + 1;
              if (n.children) {
                for (const ch of n.children) walkFrame(ch);
              }
            }
            walkFrame(frame);
            frameAudits.push({
              name: frame.name,
              width: frame.width,
              height: frame.height,
              totalNodes: frameTotal,
              nodeTypes: frameTypes
            });
            walk(frame);
          }

          return {
            pageName: page.name,
            totalFrames: page.children.length,
            totalNodes,
            typeCounts,
            textSamples,
            frameAudits
          };
        })()`,
        contextId: ctxId,
        returnByValue: true
      }
    }));
  });

  console.log('EDITABILITY AUDIT RESULTS:');
  console.log('Total Frames:', auditResult.totalFrames);
  console.log('Total Nodes:', auditResult.totalNodes);
  console.log('Node Types Breakdown:', JSON.stringify(auditResult.typeCounts, null, 2));
  console.log('\nPer Frame Node Statistics:');
  for (const fa of auditResult.frameAudits) {
    console.log(`- ${fa.name} (${fa.width}x${fa.height}): ${fa.totalNodes} nodes -> ${JSON.stringify(fa.nodeTypes)}`);
  }
  console.log('\nText Samples (First 25):', auditResult.textSamples);

  ws.close();
}

auditEditability().catch(console.error);
