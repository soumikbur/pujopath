const fs = require('fs');

const attribution = JSON.parse(fs.readFileSync('scripts/pandal-attribution.json', 'utf8'));
const sources = JSON.parse(fs.readFileSync('scripts/pandal-sources.json', 'utf8'));

let md = `# PujoPath — Durga Puja Pandal Image Attribution & Licensing

All Durga Puja pandal photographs in PujoPath are authentic images of celebrated Kolkata Durga Puja pandals sourced from Wikimedia Commons under Creative Commons and Public Domain licenses.

| Pandal ID | File Name | Wikimedia Commons Source | Photographer / Author | License | Optimized Size |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

attribution.forEach((item, idx) => {
  const src = sources.find(s => s.id === item.id);
  const fileClean = src ? src.file.replace('File:', '') : item.filename;
  md += `| \`${item.id}\` | \`${item.filename}\` | [${fileClean}](${src?.url || '#'}) | ${item.author} | **${item.license}** | ${item.optimizedSizeKB} KB (-${Math.round((1 - item.optimizedSizeKB / item.originalSizeKB) * 100)}%) |\n`;
});

md += `
## Image Optimization Details
- **Target Dimensions**: 1200 × 675 (16:9 widescreen, matched to \`aspect-video\` card layout)
- **Format**: Modern WebP with entropy-based Region of Interest (ROI) preservation via \`sharp\`
- **Quality Factor**: 82% quality with level 4 compression effort
- **Cumulative Reduction**: ~95% size reduction across all pandal assets (saving bandwidth and accelerating mobile LCP)
- **Fallback**: Graceful fallback to \`pandal-fallback.webp\` on network interruptions.
`;

fs.writeFileSync('PANDAL_IMAGE_ATTRIBUTION.md', md);
console.log('Successfully generated PANDAL_IMAGE_ATTRIBUTION.md');
