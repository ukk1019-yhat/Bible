/**
 * Audits internal links against the route table in `src/App.tsx`.
 *
 * A literal `to="/..."` or `navigate('/...')` that does not resolve to a
 * declared route would land the reader on the 404 page. This walks the source
 * and reports anything unresolvable, including template literals, which are
 * reported separately because they cannot be checked statically.
 *
 *   node scripts/check-links.mjs
 */
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const SRC = 'src'

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
    ),
  )
  return files.flat()
}

const app = await readFile('src/App.tsx', 'utf8')
const declared = [...app.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1])

/**
 * Builds the concrete prefixes a route can match.
 *
 * `/bible/:bookSlug/:chapter` matches `/bible`, `/bible/x` and `/bible/x/1`, so
 * every literal prefix up to the first parameter is a valid target too.
 */
function prefixes(pattern) {
  const parts = pattern.split('/').filter(Boolean)
  const out = [pattern]

  let literal = ''
  for (const part of parts) {
    literal += `/${part}`
    out.push(literal)
    if (part.startsWith(':')) break
  }
  return out
}

const patterns = [...new Set(declared.flatMap(prefixes).map((p) => p.replace(/\/$/, '') || '/'))]

function resolves(path) {
  // Strip the query and hash, then drop a trailing slash so `/about/` matches.
  const clean = (path.split('?')[0].split('#')[0] || '/').replace(/\/$/, '') || '/'
  return patterns.some((p) => clean === p || clean.startsWith(`${p}/`))
}

const files = (await walk(SRC)).filter((f) => /\.tsx?$/.test(f))

/** Literal targets: the ones we can prove right or wrong. */
const literal = new Map()
/** Interpolated targets: reported for manual review. */
const dynamic = new Map()

/** Each entry captures the path in group 2 when it has a quote group, else 1. */
const PATTERNS = [
  /\bto=\{?[`'"]([^`'"]+)[`'"]/g,
  /\bto:\s*'([^']+)'/g,
  /\bnavigate\((['"`])([^'"`]+)\1/g,
  /\bnavigateTo\((['"`])([^'"`]+)\1/g,
  /\bhref:\s*'([^']+)'/g,
  /\bredirect:\s*'([^']+)'/g,
]

for (const file of files) {
  const source = await readFile(file, 'utf8')

  for (const pattern of PATTERNS) {
    for (const match of source.matchAll(pattern)) {
      const value = match.length > 2 ? match[2] : match[1]
      if (!value.startsWith('/')) continue
      if (!literal.has(value)) literal.set(value, file)
    }
  }

  // Anything with `${...}` inside a path is only checkable by eye.
  for (const match of source.matchAll(/\bto=\{?`([^`]*\$\{[^`]*)`/g)) {
    const shape = match[1].replace(/\$\{[^}]*\}/g, ':param')
    if (!dynamic.has(shape)) dynamic.set(shape, file)
  }
}

// Template literals like `/books/${book.slug}` reach here from the first pass
// too, because the regex stops at the quote. Shape them and check against the
// route table where the parameters line up.
function resolveShape(shape) {
  const clean = shape.split('?')[0].split('#')[0].replace(/\/$/, '')
  const targetParts = clean.split('/').filter(Boolean)

  return patterns.some((p) => {
    const routeParts = p.split('/').filter(Boolean)
    // A route parameter matches any one segment, interpolated or literal, so
    // segment counts must line up but the names need not.
    if (routeParts.length !== targetParts.length) return false

    return routeParts.every((part, i) => part.startsWith(':') || part === targetParts[i])
  })
}

const broken = []
const unresolvedShapes = []

for (const [target, file] of literal) {
  const clean = target.replace(/\$\{[^}]*\}/g, ':param')
  if (resolves(clean)) continue
  if (clean !== target && resolveShape(clean)) continue
  broken.push({ target, file })
}

for (const [shape, file] of dynamic) {
  if (!resolveShape(shape)) unresolvedShapes.push({ shape, file })
}

console.log(`routes declared: ${declared.length}`)
console.log(`literal internal targets checked: ${literal.size}`)

if (dynamic.size > 0) {
  console.log(`\ninterpolated targets (${dynamic.size}):`)
  for (const [shape, file] of dynamic) {
    console.log(`  ${resolveShape(shape) ? 'ok  ' : '??  '} ${shape}   (${file})`)
  }
}

const failed = broken.length + unresolvedShapes.length

if (failed > 0) {
  console.log(`\nUNRESOLVABLE targets (${failed}):`)
  for (const { target, file } of broken) console.log(`  ${target}   (${file})`)
  for (const { shape, file } of unresolvedShapes) console.log(`  ${shape}   (${file})`)
  process.exitCode = 1
} else {
  console.log('\nall internal links resolve to a declared route')
}
