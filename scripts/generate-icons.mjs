/**
 * Generates the PWA / home-screen icons using the official Satya Sakshi logo:
 *
 *   node scripts/generate-icons.mjs
 *
 * Features:
 *   - Uses the official uncropped brand logo (satyasakshi-logo-full.png)
 *   - Crisp, high-contrast pure white (#ffffff) canvas
 *   - The maskable icon (maskable-512.png) scales the emblem to fit comfortably
 *     within the Android 80% safe zone circle, ensuring zero clipping on any launcher
 *     (Circle, Samsung squircle, rounded rectangle, etc.)
 */
import { mkdir, writeFile } from 'node:fs/promises'
import fs from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const sourcePng = 'public/brand/satyasakshi-logo-full.png'

if (!fs.existsSync(sourcePng)) {
  console.error('Source logo file does not exist at:', sourcePng)
  process.exit(1)
}

const pngData = fs.readFileSync(sourcePng)
const pngB64 = pngData.toString('base64')

const LOGO_W = 764
const LOGO_H = 636

function generateIconSvg(canvasSize, logoWidth) {
  const logoHeight = Math.round(logoWidth * (LOGO_H / LOGO_W))
  const x = Math.round((canvasSize - logoWidth) / 2)
  const y = Math.round((canvasSize - logoHeight) / 2)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}">
  <rect width="${canvasSize}" height="${canvasSize}" fill="#ffffff" />
  <image href="data:image/png;base64,${pngB64}" x="${x}" y="${y}" width="${logoWidth}" height="${logoHeight}" />
</svg>`
}

const TARGETS = [
  // Apple touch icons (180x180)
  { file: 'public/icons/apple-touch-icon.png', size: 180, logoWidth: 136 },
  // PWA standard icons
  { file: 'public/icons/icon-192.png', size: 192, logoWidth: 144 },
  { file: 'public/icons/icon-512.png', size: 512, logoWidth: 384 },
  // Maskable: emblem strictly fits within 80% safe zone circle (radius 204.8 at 512x512)
  { file: 'public/icons/maskable-512.png', size: 512, logoWidth: 330 },
  // High-DPI icon
  { file: 'public/icons/icon-1024.png', size: 1024, logoWidth: 768 },
]

await mkdir('public/icons', { recursive: true })

for (const { file, size, logoWidth } of TARGETS) {
  const svg = generateIconSvg(size, logoWidth)
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  const png = resvg.render().asPng()
  await writeFile(file, png)
  console.log(`${file} written (${size}×${size}, logoWidth=${logoWidth}, ${png.length} bytes)`)
}
