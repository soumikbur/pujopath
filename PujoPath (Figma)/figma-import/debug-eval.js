const http = require('http');

async function main() {
  const list = await new Promise((res, rej) => http.get('http://127.0.0.1:9222/json/list', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tab = list.find(t => t.url && t.url.includes('figma.com/design/'));
  console.log('Found tab:', tab.id, tab.url);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  console.log('WS opened');

  ws.onmessage = (e) => {
    console.log('RAW MSG:', e.data.substring(0, 300));
  };

  // Test simple eval
  ws.send(JSON.stringify({
    id: 101,
    method: 'Runtime.evaluate',
    params: {
      expression: 'typeof figma',
      returnByValue: true
    }
  }));

  setTimeout(() => {
    ws.close();
    process.exit(0);
  }, 4000);
}

main().catch(console.error);
