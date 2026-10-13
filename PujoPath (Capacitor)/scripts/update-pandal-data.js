const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'pandals', 'index.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Match each pandal block and update its imageUrl and galleryImages based on its id
const pandalBlocks = content.split(/(\s*\{\s*id:\s*'[^']+',)/);

let updated = pandalBlocks[0];

for (let i = 1; i < pandalBlocks.length; i += 2) {
  const header = pandalBlocks[i];
  const body = pandalBlocks[i + 1] || '';

  const idMatch = header.match(/id:\s*'([^']+)'/);
  if (!idMatch) {
    updated += header + body;
    continue;
  }
  const id = idMatch[1];
  const webpPath = `/images/pandals/${id}.webp`;

  let updatedBody = body;
  // Replace imageUrl
  updatedBody = updatedBody.replace(/imageUrl:\s*'[^']+',/, `imageUrl: '${webpPath}',`);

  // Replace galleryImages array
  updatedBody = updatedBody.replace(
    /galleryImages:\s*\[[\s\S]*?\],/,
    `galleryImages: [\n      '${webpPath}',\n    ],`
  );

  updated += header + updatedBody;
}

fs.writeFileSync(filePath, updated);
console.log('Successfully updated all pandals in src/data/pandals/index.ts to their respective authentic webp images.');
