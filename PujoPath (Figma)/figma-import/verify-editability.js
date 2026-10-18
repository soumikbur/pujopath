const http = require('http');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const figmaTab = list.find(t => t.url && t.url.includes('figma.com/design/'));
        resolve(figmaTab.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

async function evalInPage(wsUrl, expr) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 1) {
        ws.close();
        if (msg.error) reject(new Error(msg.error.message));
        else if (msg.result && msg.result.result) resolve(msg.result.result.value);
        else resolve(msg.result);
      }
    };
    ws.onerror = reject;
  });
}

async function main() {
  const wsUrl = await getWsUrl();
  const script = `(() => {
    const summary = {
      pages: [],
      totals: {
        frames: 0,
        textNodes: 0,
        rectangles: 0,
        vectors: 0,
        imageFills: 0,
        groups: 0,
        totalNodes: 0
      }
    };

    function countNodes(node, counts) {
      counts.totalNodes++;
      if (node.type === 'TEXT') counts.textNodes++;
      else if (node.type === 'RECTANGLE') {
        counts.rectangles++;
        if (node.fills && Array.isArray(node.fills)) {
          if (node.fills.some(f => f.type === 'IMAGE')) counts.imageFills++;
        }
      }
      else if (node.type === 'VECTOR') counts.vectors++;
      else if (node.type === 'GROUP') counts.groups++;
      else if (node.type === 'FRAME') counts.frames++;

      if (node.children) {
        for (const child of node.children) {
          countNodes(child, counts);
        }
      }
    }

    for (const page of figma.root.children) {
      const pageCounts = {
        name: page.name,
        frameCount: page.children.length,
        frames: page.children.map(c => c.name),
        textNodes: 0,
        rectangles: 0,
        vectors: 0,
        imageFills: 0,
        groups: 0,
        frames: page.children.length,
        totalNodes: 0
      };

      for (const frame of page.children) {
        countNodes(frame, pageCounts);
      }

      summary.pages.push(pageCounts);
      summary.totals.frames += pageCounts.frameCount;
      summary.totals.textNodes += pageCounts.textNodes;
      summary.totals.rectangles += pageCounts.rectangles;
      summary.totals.vectors += pageCounts.vectors;
      summary.totals.imageFills += pageCounts.imageFills;
      summary.totals.groups += pageCounts.groups;
      summary.totals.totalNodes += pageCounts.totalNodes;
    }

    return summary;
  })()`;

  const res = await evalInPage(wsUrl, script);
  console.log('Editability Analysis:', JSON.stringify(res, null, 2));
}

main().catch(console.error);
