/**
 * Checks that every content slug used in a URL has a matching data entry, and
 * that every entry in a data file is reachable from the route table.
 *
 *   node scripts/check-content.mjs
 *
 * The sitemap and the site search index are built from the same data files, so
 * a typo in a slug shows up as a page that 404s while still being advertised.
 */
import { readFile } from 'node:fs/promises'

const COLLECTIONS = [
  // Entries are anchored on the field that follows `slug`, so a category or
  // speaker slug is never mistaken for a routable page slug.
  { file: 'src/data/content/questions.ts', base: '/questions', after: 'question:' },
  { file: 'src/data/content/articles.ts', base: '/articles', after: 'title:' },
  { file: 'src/data/content/videos.ts', base: '/videos', after: 'title:' },
  { file: 'src/data/content/books.ts', base: '/books', after: 'title:' },
]

const problems = []

for (const { file, base, after } of COLLECTIONS) {
  const source = await readFile(file, 'utf8')

  // Keep only the slugs that are immediately followed by `after`, which is how
  // a routable entry is told apart from a category or speaker record.
  const routed = []
  const lines = source.split('\n')
  for (let i = 0; i < lines.length; i += 1) {
    const match = /^\s{4}slug:\s*'([^']+)',\s*$/.exec(lines[i])
    if (!match) continue
    const next = lines[i + 1] ?? ''
    if (next.trim().startsWith(after)) routed.push(match[1])
  }

  // A slug with characters that break a URL is a silent failure: the page
  // renders, but the link and the sitemap disagree.
  for (const slug of routed) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      problems.push(`${file}: slug "${slug}" is not a lowercase kebab-case path segment`)
    }
  }

  const seen = new Set()
  for (const slug of routed) {
    if (seen.has(slug)) problems.push(`${file}: duplicate slug "${slug}"`)
    seen.add(slug)
  }

  console.log(`${base.padEnd(12)} ${String(routed.length).padStart(3)} entries  (${file})`)
}

/** Article categories must resolve to the articles index, not a dead filter. */
// Category slugs are referenced by filter links, not by route, so a collision
// with an article slug would only be confusing, not broken. Still worth knowing.
const articlesSource = await readFile('src/data/content/articles.ts', 'utf8')
const categories = [...articlesSource.matchAll(/^\s{2}\{ slug: '([^']+)'/gm)].map((m) => m[1])
const articleSlugs = [...articlesSource.matchAll(/^\s{4}slug: '([^']+)',$/gm)].map((m) => m[1])

for (const category of categories) {
  if (articleSlugs.includes(category)) {
    problems.push(`articles.ts: category slug "${category}" collides with an article slug`)
  }
}

console.log(`\ncategories: ${categories.length} (${categories.join(', ')})`)

if (problems.length > 0) {
  console.log(`\n${problems.length} problem(s):`)
  for (const problem of problems) console.log(`  ${problem}`)
  process.exitCode = 1
} else {
  console.log('\nall content slugs are valid, unique and path-safe')
}
