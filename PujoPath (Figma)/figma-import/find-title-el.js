const http = require('http');

async function checkTitleEl() {
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
          const els = Array.from(document.querySelectorAll('*')).filter(el => el.innerText && el.innerText.trim() === 'Untitled');
          return els.map(e => ({
            tag: e.tagName,
            className: e.className,
            contentEditable: e.contentEditable,
            role: e.getAttribute('role'),
            id: e.id,
            ariaLabel: e.getAttribute('aria-label')
          }));
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Title elements:', JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };
}
checkTitleEl().catch(console.error);
