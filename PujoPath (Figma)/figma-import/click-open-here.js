const http = require('http');

async function clickOpenHere() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com'));
  if (!tab) {
    console.log('No figma tab found');
    return;
  }
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `(() => {
          const links = Array.from(document.querySelectorAll('a, button, span, div'));
          const target = links.find(el => el.innerText && el.innerText.trim() === 'Open here instead');
          if (target) {
            target.click();
            return 'Clicked: ' + target.tagName + ' text: ' + target.innerText;
          }
          return 'Found items: ' + links.filter(l => l.innerText && l.innerText.includes('Open')).map(l => l.innerText).join(' | ');
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Result:', msg.result?.result?.value);
      ws.close();
    }
  };
}
clickOpenHere().catch(console.error);
