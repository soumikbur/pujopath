const http = require('http');

async function renameByUi() {
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
          const titleBtn = document.querySelector('.filename_view--title--EqcWj') || Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.trim() === 'Untitled');
          if (titleBtn) {
            titleBtn.click();
            return 'Clicked title button';
          }
          return 'Title button not found';
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      console.log('Result 1:', msg.result.result.value);
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const input = document.querySelector('input.filename_view--titleInput--h8kLq, input[aria-label*=\"file name\" i], .filename_view--input--e9U3r, input:focus') || document.querySelector('input[type=\"text\"]:focus');
              if (input) {
                input.value = 'PujoPath — Complete UI/UX Design';
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
                input.blur();
                return 'Renamed via input: ' + input.value;
              }
              // Check activeElement
              if (document.activeElement && document.activeElement.tagName === 'INPUT') {
                document.activeElement.value = 'PujoPath — Complete UI/UX Design';
                document.activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
                document.activeElement.blur();
                return 'Renamed via activeElement: ' + document.activeElement.value;
              }
              return 'Input not found, activeElement=' + (document.activeElement ? document.activeElement.tagName : 'none');
            })()`,
            returnByValue: true
          }
        }));
      }, 300);
    } else if (msg.id === 2) {
      console.log('Result 2:', JSON.stringify(msg.result.result.value, null, 2));
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: 'document.title',
            returnByValue: true
          }
        }));
      }, 500);
    } else if (msg.id === 3) {
      console.log('Final document.title:', msg.result.result.value);
      ws.close();
    }
  };
}
renameByUi().catch(console.error);
