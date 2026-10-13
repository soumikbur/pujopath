const https = require('https');

const MAPPINGS = [
  { id: 'bagbazar-sarbojanin', file: 'File:Bagbazar Srbojanin Durga Puja 2025 03.jpg' },
  { id: 'kumartuli-park', file: 'File:Kumartuli Park Durga Puja 2025 13.jpg' },
  { id: 'sovabazar-rajbari', file: 'File:DurgaPuja2016 - Sovabazar Rajbari 02.jpg' },
  { id: 'college-square', file: 'File:College Square Durga Puja Committee 2025 02.jpg' },
  { id: 'santosh-mitra-square', file: 'File:Santosh Mitra square Durga Puja 2025 09.jpg' },
  { id: 'ekdalia-evergreen', file: 'File:Durga Puja Pandal - Ekdalia Evergreen - Ekdalia Road - Kolkata 2013-10-11 3317.JPG' },
  { id: 'singhi-park', file: 'File:Durga Puja Pandal - Singhi Park - Kolkata 2011-10-03 00659.jpg' },
  { id: 'maddox-square', file: 'File:Durga Puja Pandal - Ballygunge Durga Puja Samiti - Maddox Square - Kolkata 2016 10-08 9716.JPG' },
  { id: 'suruchi-sangha', file: 'File:Suruchi Sangha Durga Puja 2019.jpg' },
  { id: 'chetla-agrani', file: 'File:Chetla Agrani Club, Durga Puja 2025.jpg' },
  { id: 'tridhara-sammilani', file: 'File:2016 Tridhara Sammilani Durga Puja 02.jpg' },
  { id: 'sreebhumi-sporting-club', file: 'File:Sreebhumi sporting club 2023.jpg' },
  { id: 'fd-block-salt-lake', file: 'File:Durga Puja Pandal - FD Block - Salt Lake City - Kolkata 2013-10-11 3275.JPG' },
  { id: 'behala-natun-dal', file: 'File:Behala Natun Dal\'s Durga Puja 2025 is "Shibani Dham" 24.jpg' },
  { id: 'hindustan-park', file: 'File:Durga puja at Hindustan Park Kolkata in 2009 P1210560 04.jpg' },
  { id: 'mudiali-club', file: 'File:Mudiali Club Durga Puja 2025 13.jpg' },
  { id: 'shiv-mandir-sarbojanin', file: 'File:Mudiali Shiv Mandir Durga Puja 2025 06.jpg' },
  { id: 'ahiritola-sarbojanin', file: 'File:Ahiritola Sarbojanin Durgotsab at Durga Puja 2025 14.jpg' },
  { id: 'naktala-udayan-sangha', file: 'File:২০২৩ নাকতলা উদয়ন সংঘ ৫.jpg' },
  { id: 'babu-bagan-club', file: 'File:Durga Navami puja around Dhakuria area 01.jpg' },
  { id: 'howrah-shibpur-mandir-tala', file: 'File:Durga Puja Pandal - Mandirtala - Sibpur - Howrah 2015-10-21 6530.JPG' },
  { id: 'bj-block-salt-lake', file: 'File:Saltlake BJ Block Durga Puja 2009 (14).jpg' },
  { id: 'new-town-sarbojanin', file: 'File:Sandhi Puja, Newtown, Kolkata, (IMG 1541).jpg' },
];

function fetchInfo(title) {
  return new Promise((resolve, reject) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|size|extmetadata|mime&format=json`;
    https.get(url, { headers: { 'User-Agent': 'PujoPathApp/1.0 (contact@pujopath.org)' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          for (const k in pages) {
            const ii = pages[k].imageinfo?.[0];
            resolve(ii);
            return;
          }
          resolve(null);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function verifyAll() {
  const verified = [];
  for (const m of MAPPINGS) {
    const info = await fetchInfo(m.file);
    if (!info) {
      console.error(`FAILED to fetch info for ${m.id} (${m.file})`);
      continue;
    }
    const meta = info.extmetadata || {};
    const entry = {
      id: m.id,
      file: m.file,
      url: info.url,
      width: info.width,
      height: info.height,
      size: info.size,
      mime: info.mime,
      author: meta.Artist?.value?.replace(/<[^>]+>/g, '').trim() || 'Wikimedia Contributor',
      license: meta.LicenseShortName?.value || 'CC BY-SA',
    };
    verified.push(entry);
    console.log(`✓ [${m.id}] ${info.width}x${info.height} (${Math.round(info.size / 1024)} KB) | Author: ${entry.author} | License: ${entry.license}`);
  }
  require('fs').writeFileSync('scripts/pandal-sources.json', JSON.stringify(verified, null, 2));
  console.log(`\nSuccessfully verified and saved ${verified.length} / ${MAPPINGS.length} pandal images metadata.`);
}

verifyAll();
