const http = require('http');

async function verifyDevOrder() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function evalExpr(expr) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.result && msg.result.result) {
            resolve(msg.result.result.value);
          } else {
            resolve(msg);
          }
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true, awaitPromise: true }
      }));
    });
  }

  const res = await evalExpr(`(async () => {
    const results = {};

    function getTextInOrder(node, acc) {
      if (node.type === 'TEXT') {
        acc.push({ text: node.characters, x: node.absoluteTransform ? node.absoluteTransform[0][2] : node.x, y: node.absoluteTransform ? node.absoluteTransform[1][2] : node.y });
      }
      if (node.children) {
        for (const ch of node.children) {
          getTextInOrder(ch, acc);
        }
      }
    }

    // 1. Desktop
    const p1 = figma.root.children.find(p => p.name === 'Web — Desktop');
    await figma.setCurrentPageAsync(p1);
    const dDev = p1.children.find(c => c.name === '02_web_desktop_developer');
    const dTexts = [];
    if (dDev) getTextInOrder(dDev, dTexts);
    results.desktop = {
      moumitaIndex: dTexts.findIndex(t => t.text.includes('Moumita')),
      soumikIndex: dTexts.findIndex(t => t.text.includes('Soumik')),
      allDevMentions: dTexts.filter(t => t.text.includes('Moumita') || t.text.includes('Soumik')).map(t => t.text)
    };

    // 2. Web Mobile
    const p2 = figma.root.children.find(p => p.name === 'Web — Mobile');
    await figma.setCurrentPageAsync(p2);
    const wmDev = p2.children.find(c => c.name === '02_web_mobile_developer');
    const wmTexts = [];
    if (wmDev) getTextInOrder(wmDev, wmTexts);
    results.webMobile = {
      moumitaIndex: wmTexts.findIndex(t => t.text.includes('Moumita')),
      soumikIndex: wmTexts.findIndex(t => t.text.includes('Soumik')),
      allDevMentions: wmTexts.filter(t => t.text.includes('Moumita') || t.text.includes('Soumik')).map(t => t.text)
    };

    // 3. Capacitor Mobile
    const p3 = figma.root.children.find(p => p.name === 'Capacitor — Android Mobile');
    await figma.setCurrentPageAsync(p3);
    const cmDev = p3.children.find(c => c.name === '02_capacitor_android_developer');
    const cmTexts = [];
    if (cmDev) getTextInOrder(cmDev, cmTexts);
    results.capacitorMobile = {
      moumitaIndex: cmTexts.findIndex(t => t.text.includes('Moumita')),
      soumikIndex: cmTexts.findIndex(t => t.text.includes('Soumik')),
      allDevMentions: cmTexts.filter(t => t.text.includes('Moumita') || t.text.includes('Soumik')).map(t => t.text)
    };

    // Return to Page 1
    await figma.setCurrentPageAsync(p1);
    return results;
  })()`);

  console.log('Developer Order Verification in Cloud File:');
  console.log(JSON.stringify(res, null, 2));

  ws.close();
}

verifyDevOrder().catch(console.error);
