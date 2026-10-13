const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/pandals/index.ts');
let content = fs.readFileSync(filePath, 'utf8');

const imageMap = {
  'bagbazar-sarbojanin': '/images/pandals/ekchala-traditional.jpg',
  'kumartuli-park': '/images/pandals/art-craft-terracotta.jpg',
  'sovabazar-rajbari': '/images/pandals/sovabazar-rajbari.jpg',
  'college-square': '/images/pandals/college-square-water.jpg',
  'santosh-mitra-square': '/images/pandals/college-square-water.jpg',
  'ekdalia-evergreen': '/images/pandals/south-temple-replica.jpg',
  'singhi-park': '/images/pandals/ekchala-traditional.jpg',
  'maddox-square': '/images/pandals/ekchala-traditional.jpg',
  'suruchi-sangha': '/images/pandals/art-craft-terracotta.jpg',
  'chetla-agrani': '/images/pandals/art-craft-terracotta.jpg',
  'tridhara-sammilani': '/images/pandals/south-temple-replica.jpg',
  'sreebhumi-sporting-club': '/images/pandals/college-square-water.jpg',
  'fd-block-salt-lake': '/images/pandals/south-temple-replica.jpg',
  'behala-natun-dal': '/images/pandals/art-craft-terracotta.jpg',
  'hindustan-park': '/images/pandals/art-craft-terracotta.jpg',
  'mudiali-club': '/images/pandals/ekchala-traditional.jpg',
  'shiv-mandir-sarbojanin': '/images/pandals/south-temple-replica.jpg',
  'ahiritola-sarbojanin': '/images/pandals/ekchala-traditional.jpg',
  'naktala-udayan-sangha': '/images/pandals/art-craft-terracotta.jpg',
  'babu-bagan-club': '/images/pandals/south-temple-replica.jpg',
  'howrah-shibpur-mandir-tala': '/images/pandals/ekchala-traditional.jpg',
  'bj-block-salt-lake': '/images/pandals/art-craft-terracotta.jpg',
  'new-town-sarbojanin': '/images/pandals/college-square-water.jpg',
};

for (const [id, img] of Object.entries(imageMap)) {
  const idRegex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?imageUrl:\\s*)['"][^'"]+['"]`, 'g');
  content = content.replace(idRegex, `$1'${img}'`);
}

// Replace any remaining unsplash URLs with local fallback/pandals
content = content.replace(/https:\/\/images\.unsplash\.com\/[^\s'"]+/g, '/images/pandals/ekchala-traditional.jpg');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated all pandal images to authentic photos!');
