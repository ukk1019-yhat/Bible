import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const sourceJpg = 'public/brand/satyasakshi-logo.jpg';
const sourcePng = 'public/brand/satyasakshi-watermark.png';

if (!fs.existsSync(sourceJpg)) {
  console.error('Source logo file does not exist at:', sourceJpg);
  process.exit(1);
}

const jpgData = fs.readFileSync(sourceJpg);
const jpgB64 = jpgData.toString('base64');

// 1. Full 1024x1024 original PNG (untouched full canvas with shadow & background)
const svgOriginal = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <image href="data:image/jpeg;base64,${jpgB64}" width="1024" height="1024" />
</svg>`;
const resvgOriginal = new Resvg(svgOriginal, { fitTo: { mode: 'width', value: 1024 } });
const fullPng = resvgOriginal.render().asPng();
fs.writeFileSync('public/brand/satyasakshi-logo.png', fullPng);
fs.writeFileSync('public/brand/satyasakshi-logo-original.png', fullPng);
console.log('Wrote public/brand/satyasakshi-logo.png & satyasakshi-logo-original.png (1024x1024)');

// 2. Complete uncropped transparent artwork (full cross, flame, Bible, Telugu title, and tagline)
if (fs.existsSync(sourcePng)) {
  const pngData = fs.readFileSync(sourcePng);
  const pngB64 = pngData.toString('base64');

  // Complete bounds: artwork is from x=86 to 436 (w=350), y=77 to 361 (h=284).
  // Giving balanced padding all around ensures nothing is cropped.
  const viewBox = '70 60 382 318';
  const width = 764;
  const height = 636;

  const svgFull = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">
    <image href="data:image/png;base64,${pngB64}" width="500" height="500" />
  </svg>`;

  const resvgFull = new Resvg(svgFull, { fitTo: { mode: 'width', value: width } });
  const fullTransparent = resvgFull.render().asPng();

  fs.writeFileSync('public/brand/satyasakshi-logo-full.png', fullTransparent);
  // Ensure legacy paths also point to the uncropped complete artwork
  fs.writeFileSync('public/brand/satyasakshi-logo-tight.png', fullTransparent);
  fs.writeFileSync('public/brand/satyasakshi-emblem.png', fullTransparent);
  console.log('Wrote public/brand/satyasakshi-logo-full.png (uncropped, complete logo)');
}
