const http = require('http');

async function inspectFileMenu() {
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
          const fileBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim() === 'File');
          if (fileBtn) {
            fileBtn.click();
            return 'Clicked File button';
          }
          return 'File button not found';
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Result:', msg.result.result.value);
      setTimeout(async () => {
        // Now check open menu items
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const menuItems = Array.from(document.querySelectorAll('[role=\"menuitem\"], [role=\"option\"], .menu-item, [data-testid*=\"menu\"]')).map(m => m.innerText.trim());
              return menuItems;
            })()`,
            returnByValue: true
          }
        }));
      }, 500);
    } else if (msg.id === 2) {
      console.log('Menu items:', JSON.stringify(msg.result.result.value, null, 2));
      ws.close();
    }
  };
}
inspectFileMenu().catch(console.error);
