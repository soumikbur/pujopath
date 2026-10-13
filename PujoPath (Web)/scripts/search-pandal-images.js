const https = require('https');

const PANDALS = [
  { id: 'bagbazar-sarbojanin', name: 'Bagbazar Sarbojanin', queries: ['Bagbazar Sarbojanin Durga Puja', 'Bagbazar Durga Puja'] },
  { id: 'kumartuli-park', name: 'Kumartuli Park', queries: ['Kumartuli Park Durga Puja', 'Kumartuli Durga Puja'] },
  { id: 'sovabazar-rajbari', name: 'Sovabazar Rajbari', queries: ['Sovabazar Rajbari Durga Puja', 'Shobhabazar Rajbari Durga Puja'] },
  { id: 'college-square', name: 'College Square', queries: ['College Square Durga Puja', 'College Square Kolkata Durga Puja'] },
  { id: 'santosh-mitra-square', name: 'Santosh Mitra Square', queries: ['Santosh Mitra Square Durga Puja', 'Lebutala Durga Puja'] },
  { id: 'ekdalia-evergreen', name: 'Ekdalia Evergreen', queries: ['Ekdalia Evergreen Durga Puja', 'Ekdalia Evergreen Club'] },
  { id: 'singhi-park', name: 'Singhi Park', queries: ['Singhi Park Durga Puja', 'Singhi Park Sarbojanin'] },
  { id: 'maddox-square', name: 'Maddox Square', queries: ['Maddox Square Durga Puja', 'Maddox Square Kolkata'] },
  { id: 'suruchi-sangha', name: 'Suruchi Sangha', queries: ['Suruchi Sangha Durga Puja', 'Suruchi Sangha New Alipore'] },
  { id: 'chetla-agrani', name: 'Chetla Agrani', queries: ['Chetla Agrani Durga Puja', 'Chetla Agrani Club'] },
  { id: 'tridhara-sammilani', name: 'Tridhara Sammilani', queries: ['Tridhara Sammilani Durga Puja', 'Tridhara Sammilani'] },
  { id: 'sreebhumi-sporting-club', name: 'Sreebhumi Sporting Club', queries: ['Sreebhumi Sporting Club Durga Puja', 'Sreebhumi Durga Puja'] },
  { id: 'fd-block-salt-lake', name: 'FD Block Salt Lake', queries: ['FD Block Durga Puja', 'FD Block Salt Lake Durga Puja'] },
  { id: 'behala-natun-dal', name: 'Behala Natun Dal', queries: ['Behala Natun Dal Durga Puja', 'Behala Nutan Dal Durga Puja'] },
  { id: 'hindustan-park', name: 'Hindustan Park', queries: ['Hindustan Park Durga Puja', 'Hindusthan Park Durga Puja'] },
  { id: 'mudiali-club', name: 'Mudiali Club', queries: ['Mudiali Club Durga Puja', 'Mudiali Durga Puja'] },
  { id: 'shiv-mandir-sarbojanin', name: 'Shiv Mandir Sarbojanin', queries: ['Shiv Mandir Durga Puja Kolkata', 'Shib Mandir Durga Puja'] },
  { id: 'ahiritola-sarbojanin', name: 'Ahiritola Sarbojanin', queries: ['Ahiritola Sarbojanin Durga Puja', 'Ahiritola Durga Puja'] },
  { id: 'naktala-udayan-sangha', name: 'Naktala Udayan Sangha', queries: ['Naktala Udayan Sangha Durga Puja', 'Naktala Durga Puja'] },
  { id: 'babu-bagan-club', name: 'Babu Bagan Club', queries: ['Babu Bagan Durga Puja', 'Babu Bagan Club Dhakuria'] },
  { id: 'howrah-shibpur-mandir-tala', name: 'Shibpur Mandirtala', queries: ['Shibpur Mandirtala Durga Puja', 'Mandirtala Durga Puja Howrah', 'Howrah Durga Puja'] },
  { id: 'bj-block-salt-lake', name: 'BJ Block Salt Lake', queries: ['BJ Block Durga Puja', 'BJ Block Salt Lake Durga Puja'] },
  { id: 'new-town-sarbojanin', name: 'New Town Sarbojanin', queries: ['New Town Sarbojanin Durga Puja', 'New Town Durga Puja Kolkata'] },
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'PujoPathApp/1.0 (contact@pujopath.org)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function search() {
  for (const p of PANDALS) {
    let results = [];
    for (const q of p.queries) {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&format=json`;
      const res = await fetchJson(url);
      if (res.query && res.query.search && res.query.search.length > 0) {
        results = res.query.search.map(s => s.title);
        break;
      }
    }
    console.log(`[${p.id}] ${p.name}: found ${results.length} files:`);
    results.slice(0, 3).forEach(f => console.log('  -', f));
  }
}

search();
