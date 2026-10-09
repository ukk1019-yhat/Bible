/**
 * Generates the Open Graph share image at public/og-image.png.
 *
 * The card is drawn as SVG and rasterised with resvg so the Telugu headline is
 * rendered by a real Telugu font rather than being faked. Run it once when the
 * wordmark or the 1200×630 template changes:
 *
 *   node scripts/generate-og-image.mjs
 *
 * Font files are pulled from the Google Fonts CSS API on demand (a plain UA
 * gets TTF links instead of woff2, which resvg cannot read) and cached in the
 * system temp directory.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const WIDTH = 1200
const HEIGHT = 630

const COLORS = {
  forest950: '#0a1d15',
  forest900: '#10291e',
  forest700: '#1d4a36',
  forest100: '#e2ede6',
  gold400: '#d8b871',
  gold200: '#eddcb6',
  cream100: '#fbf7ef',
  cream300: '#ece3d1',
}

const FONT_QUERY =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700'

/** Cached TTF paths, keyed by weight. */
const fontCache = new Map()

async function loadFont(weight) {
  if (fontCache.has(weight)) return fontCache.get(weight)

  const dir = join(tmpdir(), 'satyasakshi-og-fonts')
  await mkdir(dir, { recursive: true })

  const file = join(dir, `NotoSansTelugu-${weight}.ttf`)
  if (!existsSync(file)) {
    const css = await fetch(FONT_QUERY, {
      headers: { 'user-agent': 'Mozilla/5.0' },
    }).then((r) => {
      if (!r.ok) throw new Error(`Google Fonts returned ${r.status}`)
      return r.text()
    })

    // Pick the @font-face block whose font-weight matches, then its TTF URL.
    const blocks = css.split('@font-face').filter((block) => block.includes('truetype'))
    const match = blocks.find((block) =>
      block.includes(`font-weight: ${weight}`),
    )
    const url = match?.match(/url\((https:[^)]+\.ttf)\)/)?.[1]
    if (!url) throw new Error(`No TTF URL for weight ${weight}`)

    const bytes = await fetch(url).then((r) => r.arrayBuffer())
    await writeFile(file, Buffer.from(bytes))
  }

  fontCache.set(weight, file)
  return file
}

/** The open-book mark, matching public/favicon.svg. */
const MARK = `
  <g transform="translate(88 92)">
    <rect width="104" height="104" rx="24" fill="${COLORS.forest700}" />
    <g fill="none" stroke="${COLORS.gold400}" stroke-width="5"
       stroke-linecap="round" stroke-linejoin="round">
      <path d="M52 34c-6.8-5.2-14-7.3-22-7.3v36.2c8 0 15.2 2.1 22 7.3" transform="translate(0 4)" />
      <path d="M52 34c6.8-5.2 14-7.3 22-7.3v36.2c-8 0-15.2 2.1-22 7.3" transform="translate(0 4)" />
      <path d="M52 34v36.2" />
      <path d="M52 70.2v11" />
    </g>
  </g>`

function svg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.forest900}" />
      <stop offset="100%" stop-color="${COLORS.forest950}" />
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.1" r="0.75">
      <stop offset="0%" stop-color="${COLORS.forest700}" stop-opacity="0.55" />
      <stop offset="100%" stop-color="${COLORS.forest700}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />

  <!-- hairline frame -->
  <rect x="32" y="32" width="${WIDTH - 64}" height="${HEIGHT - 64}" rx="10"
        fill="none" stroke="${COLORS.gold400}" stroke-opacity="0.28" />

  ${MARK}

  <text x="88" y="300" font-family="Noto Sans Telugu" font-size="82" font-weight="700"
        fill="${COLORS.cream100}">సత్య సాక్షి</text>

  <text x="88" y="352" font-family="Noto Sans Telugu" font-size="24" font-weight="400"
        fill="${COLORS.gold400}" letter-spacing="6">SATYA SAKSHI</text>

  <rect x="88" y="392" width="72" height="3" fill="${COLORS.gold400}" />

  <text x="88" y="452" font-family="Noto Sans Telugu" font-size="32" font-weight="700"
        fill="${COLORS.gold200}">క్రైస్తవ విజ్ఞాన వేధిక</text>

  <text x="88" y="500" font-family="Noto Sans Telugu" font-size="28" font-weight="400"
        fill="${COLORS.forest100}">దేవుని వాక్యము ప్రతి ఇంటికి</text>

  <text x="88" y="546" font-family="Noto Sans Telugu" font-size="22" font-weight="400"
        fill="${COLORS.cream300}" fill-opacity="0.85">పరిశుద్ధ బైబిల్ · సందేశాలు · ప్రశ్నలకు సమాధానాలు</text>

  <text x="${WIDTH - 88}" y="556" font-family="Noto Sans Telugu" font-size="24" font-weight="400"
        fill="${COLORS.gold400}" fill-opacity="0.9" text-anchor="end">satyasakshi.in</text>
</svg>`
}

async function main() {
  const regular = await loadFont(400)
  const bold = await loadFont(700)

  const resvg = new Resvg(svg(), {
    fitTo: { mode: 'width', value: WIDTH },
    font: {
      fontFiles: [regular, bold],
      loadSystemFonts: false,
      defaultFontFamily: 'Noto Sans Telugu',
    },
  })

  const png = resvg.render().asPng()
  await mkdir('public', { recursive: true })
  await writeFile('public/og-image.png', png)

  console.log(`public/og-image.png written (${png.length} bytes, ${WIDTH}×${HEIGHT})`)
}

await main()
