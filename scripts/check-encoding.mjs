/**
 * Verifies every source and public file is valid UTF-8.
 *
 * The Telugu copy is the product. A file saved in a legacy Windows codepage, or
 * written with a mangled byte, shows up as U+FFFD at runtime and nothing in the
 * build catches it — so check the bytes directly.
 *
 *   node scripts/check-encoding.mjs
 */
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const EXTENSIONS = /\.(ts|tsx|js|jsx|mjs|cjs|json|html|css|md|xml|txt|webmanifest)$/
const SKIP = new Set(['node_modules', 'dist', '.git', 'coverage'])

const files = []

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walk(path)
    else if (EXTENSIONS.test(entry.name)) files.push(path)
  }
}

await walk('.')

const decoder = new TextDecoder('utf-8', { fatal: false })
const problems = []

for (const file of files) {
  const bytes = await readFile(file)

  // A round trip is the reliable test: decode, then re-encode. Any byte that
  // was not valid UTF-8 becomes U+FFFD and will not survive the trip.
  const decoded = decoder.decode(bytes)
  if (!Buffer.from(decoded, 'utf8').equals(bytes)) {
    const index = decoded.indexOf('\uFFFD')
    const line = decoded.slice(0, index).split('\n').length
    problems.push({ file, line, context: decoded.slice(Math.max(0, index - 50), index + 15) })
    continue
  }

  // A literal replacement character in the source is also wrong: it means the
  // text was already damaged before it was written.
  const literal = decoded.indexOf('\uFFFD')
  if (literal >= 0) {
    problems.push({
      file,
      line: decoded.slice(0, literal).split('\n').length,
      context: decoded.slice(Math.max(0, literal - 50), literal + 15),
    })
  }
}

console.log(`scanned ${files.length} files`)

if (problems.length > 0) {
  console.log(`\n${problems.length} encoding problem(s):`)
  for (const { file, line, context } of problems) {
    console.log(`  ${file}:${line}`)
    console.log(`    ${JSON.stringify(context)}`)
  }
  process.exitCode = 1
} else {
  console.log('all files are valid UTF-8 with no replacement characters')
}
