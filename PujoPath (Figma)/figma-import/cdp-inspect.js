const http = require('http');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const figmaTab = list.find(t => t.url.includes('figma.com'));
        if (figmaTab && figmaTab.webSocketDebuggerUrl) {
          resolve(figmaTab.webSocketDebuggerUrl);
        } else {
          reject(new Error('Figma tab not found: ' + JSON.stringify(list)));
        }
      });
    }).on('error', reject);
  });
}

async function evalInPage(wsUrl, expression) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 1;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: id++,
        method: 'Runtime.evaluate',
        params: {
          expression: expression,
          returnByValue: true
        }
      }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 1) {
        ws.close();
        if (msg.result && msg.result.result) {
          resolve(msg.result.result.value);
        } else {
          resolve(msg);
        }
      }
    };

    ws.onerror = reject;
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  console.log('Connected to WS:', wsUrl);

  const pageInfo = await evalInPage(wsUrl, `({
    title: document.title,
    url: window.location.href,
    hasFigmaGlobal: typeof figma !== 'undefined',
    hasAppGlobal: typeof App !== 'undefined',
    bodyText: document.body.innerText.substring(0, 500)
  })`);

  console.log('Page Info:', JSON.stringify(pageInfo, null, 2));
}

main().catch(console.error);
