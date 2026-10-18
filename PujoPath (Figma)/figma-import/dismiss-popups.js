const http = require('http');

async function clickGotIt() {
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
          const btns = Array.from(document.querySelectorAll('button'));
          const gotIt = btns.find(b => b.innerText && b.innerText.trim() === 'Got it');
          if (gotIt) {
            gotIt.click();
            return 'Clicked Got it';
          }
          return 'Got it not found';
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Result:', msg.result.result.value);
      ws.close();
    }
  };
}
clickGotIt().catch(console.error);
