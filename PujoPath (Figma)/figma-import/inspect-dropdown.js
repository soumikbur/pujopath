const http = require('http');

async function inspectDropdown() {
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
          const modals = Array.from(document.querySelectorAll('[data-testid], [aria-label], [role=\"dialog\"], [role=\"menu\"], [role=\"listbox\"], .dropdown, [class*=\"menu\"]')).map(el => ({
            tag: el.tagName,
            text: el.innerText ? el.innerText.trim().substring(0, 100) : '',
            role: el.getAttribute('role'),
            className: el.className
          }));
          return modals.filter(m => m.text.length > 0).slice(0, 20);
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Modals/Menus:', JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };
}
inspectDropdown().catch(console.error);
