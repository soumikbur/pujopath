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

  const details = await evalExpr(`(() => {
    const header = document.querySelector('header');
    const headerChildren = Array.from(header.querySelectorAll('*')).map(el => {
      const cs = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        text: el.children.length === 0 ? el.textContent.trim() : '',
        className: el.className,
        color: cs.color,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        bg: cs.backgroundColor
      };
    }).filter(x => x.text);

    // Click "More" to see what opens
    const moreTrigger = Array.from(document.querySelectorAll('button, [role="button"]')).find(b => b.innerText && b.innerText.includes('More'));
    let dropdownHtml = null;
    let dropdownItems = [];
    if (moreTrigger) {
      moreTrigger.click();
      const openMenu = document.querySelector('[role="menu"], [class*="dropdown"], [class*="menu"], [class*="popover"]');
      if (openMenu) {
        dropdownHtml = openMenu.outerHTML;
        dropdownItems = Array.from(openMenu.querySelectorAll('a, button, div')).map(i => ({
          text: i.innerText.trim(),
          tag: i.tagName,
          href: i.getAttribute('href')
        })).filter(x => x.text);
      }
    }

    // Inspect background wallpaper
    const bgContainer = document.querySelector('[class*="background"], [class*="bg"]') || document.body;
    const bodyStyles = window.getComputedStyle(document.body);
    const bgImage = bodyStyles.backgroundImage;

    return {
      headerHeight: header.offsetHeight,
      headerPadding: window.getComputedStyle(header).padding,
      headerBg: window.getComputedStyle(header).backgroundColor,
      headerBackdrop: window.getComputedStyle(header).backdropFilter,
      headerChildren,
      dropdownItems,
      bgImage
    };
  })()`);

  console.log('Header & More dropdown details:', JSON.stringify(details, null, 2));

  ws.close();
}

main().catch(console.error);
