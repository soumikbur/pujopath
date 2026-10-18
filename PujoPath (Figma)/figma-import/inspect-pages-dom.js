const http = require('http');

async function main() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const evalExpr = (expr) => new Promise((resolve) => {
    const id = 1;
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id === id) resolve(m.result.result.value);
    });
    ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
  });

  const script = `(() => {
    const rows = Array.from(document.querySelectorAll('*')).filter(el => {
      return el.children.length === 0 && (el.innerText === 'Web — Desktop' || el.innerText === 'Web — Mobile' || el.innerText === 'Capacitor — Android Mobile');
    });
    return rows.map(r => {
      const parentRow = r.closest('[class*=\"row\"], [class*=\"item\"], [role=\"row\"], [role=\"treeitem\"]') || r.parentElement;
      return {
        text: r.innerText,
        tag: r.tagName,
        parentTag: parentRow ? parentRow.tagName : null,
        parentClass: parentRow ? parentRow.className : null,
        parentRole: parentRow ? parentRow.getAttribute('role') : null,
        parentRect: parentRow ? parentRow.getBoundingClientRect() : null
      };
    });
  })()`;

  const res = await evalExpr(script);
  console.log('Pages Elements:', JSON.stringify(res, null, 2));
  ws.close();
}

main().catch(console.error);
