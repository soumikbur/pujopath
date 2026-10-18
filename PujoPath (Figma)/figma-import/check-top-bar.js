const http = require('http');

async function checkTopBar() {
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
          const topElements = Array.from(document.querySelectorAll('input, button, [contenteditable="true"]')).map(e => ({
            tag: e.tagName,
            type: e.type,
            value: e.value,
            placeholder: e.placeholder,
            ariaLabel: e.getAttribute('aria-label'),
            text: e.innerText ? e.innerText.substring(0, 50) : '',
            className: e.className
          }));
          return topElements.slice(0, 30);
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Top elements:', JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };
}
checkTopBar().catch(console.error);
