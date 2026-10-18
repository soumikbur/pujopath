const http = require('http');

async function checkRenameMethods() {
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
          const res = {};
          if (typeof App !== 'undefined') {
            res.hasApp = true;
            res.appKeys = Object.keys(App).slice(0, 30);
            if (App.file) {
              res.fileKeys = Object.keys(App.file);
            }
          }
          // Search DOM for the text 'Untitled' or file name
          const allEls = Array.from(document.querySelectorAll('*'));
          res.matchingText = allEls.filter(el => el.children.length === 0 && el.textContent.includes('Untitled')).map(el => ({
            tag: el.tagName,
            text: el.textContent,
            className: el.className
          }));
          return res;
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Rename check:', JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };
}
checkRenameMethods().catch(console.error);
