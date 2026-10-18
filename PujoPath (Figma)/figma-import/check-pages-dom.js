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
        expression: `(() => {
          const pagesHeader = Array.from(document.querySelectorAll('*')).find(el => el.innerText === 'Pages');
          if (!pagesHeader) return 'Pages element not found';
          const parent = pagesHeader.parentElement;
          return {
            parentTag: parent.tagName,
            parentClass: parent.className,
            parentHtml: parent.innerHTML.substring(0, 500)
          };
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Pages Header Info:', JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };
}
run().catch(console.error);
