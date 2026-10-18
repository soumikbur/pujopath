const http = require('http');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const tab = list.find(t => t.url && t.url.includes('pujopath-five.vercel.app'));
        resolve(tab.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  function evalExpr(expr) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          resolve(m.result?.result?.value);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({
        id,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    });
  }

  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000);
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', handler);
          resolve(m.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Navigate to home first
  await sendCmd('Page.navigate', { url: 'https://pujopath-five.vercel.app/' });
  await new Promise(r => setTimeout(r, 2500));

  const allLinks = await evalExpr(`(() => {
    const links = Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText.replace(/\\n/g, ' ').trim(),
      href: a.href,
      pathname: a.pathname
    }));

    // Also check what happens if we click "More" dropdown in header
    const moreBtn = Array.from(document.querySelectorAll('button, [role="button"], a')).find(el => el.innerText && el.innerText.includes('More'));
    let moreDropdownItems = [];
    if (moreBtn) {
      moreBtn.click();
      const dropdown = document.querySelector('[role="menu"], [class*="dropdown"], [class*="menu"], [class*="popover"]');
      if (dropdown) {
        moreDropdownItems = Array.from(dropdown.querySelectorAll('a, button')).map(el => ({
          text: el.innerText.replace(/\\n/g, ' ').trim(),
          href: el.href || null
        }));
      }
    }

    return { links, moreDropdownItems };
  })()`);

  console.log('Links and More dropdown:', JSON.stringify(allLinks, null, 2));

  ws.close();
}

main().catch(console.error);
