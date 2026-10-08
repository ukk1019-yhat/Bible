import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const sourceJpg = 'public/brand/satyasakshi-logo.jpg';

if (!fs.existsSync(sourceJpg)) {
  console.error('Source logo file does not exist at:', sourceJpg);
  process.exit(1);
}

const data = fs.readFileSync(sourceJpg);
const b64 = data.toString('base64');

function renderCrop(name, viewBox, width, height) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">
    <image href="data:image/jpeg;base64,${b64}" width="1024" height="1024" />
  </svg>`;
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  const pngBuffer = resvg.render().asPng();
  fs.writeFileSync(`public/brand/${name}.png`, pngBuffer);
  console.log(`Wrote public/brand/${name}.png (${width}x${height})`);
  return pngBuffer;
}

// 1. Full 1024x1024 PNG
const fullPng = renderCrop('satyasakshi-logo', '0 0 1024 1024', 1024, 1024);
fs.writeFileSync('public/brand/satyasakshi-logo-original.png', fullPng);

// 2. Focused Sacred Emblem (cross + fire flame + halo + Bible crest)
renderCrop('satyasakshi-emblem', '297 115 430 430', 512, 512);

// 3. Tight Full Artwork (emblem + Telugu title + English tagline)
renderCrop('satyasakshi-logo-tight', '40 135 944 610', 944, 610);
