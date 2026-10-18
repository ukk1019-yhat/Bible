import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Generates public/version.json with the current build timestamp and version.
 * This allows the PWA and service worker to reliably detect when a new version
 * is deployed on the server and update immediately without any caching glitch.
 */
async function generateVersion() {
  const timestamp = Date.now()
  const isoDate = new Date().toISOString()
  
  const payload = {
    version: `1.0.${timestamp}`,
    timestamp,
    buildTime: isoDate,
  }

  const outPath = join('public', 'version.json')
  await writeFile(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  console.log(`public/version.json written — version: ${payload.version} (${payload.buildTime})`)
}

generateVersion().catch((err) => {
  console.error('Failed to generate version.json:', err)
  process.exit(1)
})
