const http = require('http');

async function run() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url.includes('figma.com'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `Array.from(document.querySelectorAll('button, a')).map(b => ({
          tag: b.tagName,
          text: b.innerText.trim(),
          ariaLabel: b.getAttribute('aria-label'),
          class: b.className
        })).filter(b => b.text || b.ariaLabel)`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Buttons/Links on Page:', JSON.stringify(msg.result.result.value.slice(0, 30), null, 2));
      ws.close();
    }
  };
}
run().catch(console.error);
