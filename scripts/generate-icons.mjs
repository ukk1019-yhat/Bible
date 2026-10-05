/**
 * Generates the PWA / home-screen icons from the same open-book mark used by
 * public/favicon.svg and the OG card:
 *
 *   node scripts/generate-icons.mjs
 *
 * Two families are written, because they have different requirements:
 *
 *   - `any` icons may use the full square, so the mark is drawn generously.
 *   - the `maskable` icon must survive Android cropping to a circle inscribed
 *     in the middle 80% of the image, so the mark is scaled down to sit inside
 *     that safe zone. The real logo does not qualify: its wordmark runs to the
 *     edges, so declaring it maskable (as an earlier manifest did) would clip
 *     the Telugu text.
 *
 * Rasterised with resvg so no font is involved — the mark is pure geometry.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { Resvg } from '@resvg/resvg-js'

const COLORS = {
  forest900: '#10291e',
  gold400: '#d8b871',
}

/**
 * Draws the mark centred in a `size` square.
 *
 * `scale` is the fraction of the canvas the mark's 40×40 box occupies. The
 * favicon uses 1; maskable icons need about 0.62 so the corners of the box,
 * and therefore of the safe circle, stay outside the artwork.
 */
function svg(size, scale) {
  const box = size * scale
  const offset = (size - box) / 2
  const stroke = (box / 40) * 1.9

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${COLORS.forest900}" />
  <g transform="translate(${offset.toFixed(2)} ${offset.toFixed(2)}) scale(${(box / 40).toFixed(4)})">
    <g fill="none" stroke="${COLORS.gold400}" stroke-width="${stroke.toFixed(3)}"
       stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 12.5c-2.6-2-5.4-2.8-8.5-2.8v14c3.1 0 5.9 0.8 8.5 2.8" />
      <path d="M20 12.5c2.6-2 5.4-2.8 8.5-2.8v14c-3.1 0-5.9 0.8-8.5 2.8" />
      <path d="M20 12.5v14" />
      <path d="M20 26.5v4.2" />
    </g>
  </g>
</svg>`
}

const TARGETS = [
  // Apple touch icons are always masked to a rounded square by the OS, so the
  // mark can fill more of the canvas.
  { file: 'public/icons/apple-touch-icon.png', size: 180, scale: 1 },
  { file: 'public/icons/icon-192.png', size: 192, scale: 1 },
  { file: 'public/icons/icon-512.png', size: 512, scale: 1 },
  // Maskable: artwork confined to the middle 80% safe zone.
  { file: 'public/icons/maskable-512.png', size: 512, scale: 0.62 },
  // Extra density for iOS home screens on Retina.
  { file: 'public/icons/icon-1024.png', size: 1024, scale: 1 },
]

await mkdir('public/icons', { recursive: true })

for (const { file, size, scale } of TARGETS) {
  const resvg = new Resvg(svg(size, scale), { fitTo: { mode: 'width', value: size } })
  const png = resvg.render().asPng()
  await writeFile(file, png)
  console.log(`${file} written (${size}×${size}, ${png.length} bytes)`)
}
