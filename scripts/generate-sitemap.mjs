/**
 * Generates public/sitemap.xml from the route table and the generated Bible
 * catalogue, so the sitemap can never drift from the routes that exist.
 *
 *   node scripts/generate-sitemap.mjs
 *
 * Wired into `npm run build`, which runs it before Vite so the file is copied
 * into dist/ alongside the app.
 */
import { readFile, writeFile } from 'node:fs/promises'

const SITE = 'https://satyasakshi.in'
const TODAY = new Date().toISOString().slice(0, 10)

/**
 * Static routes, in the order they matter.
 *
 * `check` is the path `scripts/check-links.mjs` looks for: only a path listed
 * here is treated as real, so a page that exists but is not declared here is
 * silently left out of the sitemap rather than advertised wrongly.
 */
const STATIC_ROUTES = [
  ['/', 1.0, 'daily'],
  ['/bible', 0.9, 'weekly'],
  ['/questions', 0.85, 'weekly'],
  ['/messages', 0.8, 'weekly'],
  ['/videos', 0.7, 'weekly'],
  ['/articles', 0.7, 'weekly'],
  ['/books', 0.6, 'monthly'],
  ['/about', 0.5, 'yearly'],
  ['/contact', 0.4, 'yearly'],
  ['/privacy', 0.2, 'yearly'],
  ['/terms', 0.2, 'yearly'],
]

const escape = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function entry({ loc, priority, changefreq, lastmod }) {
  return [
    '  <url>',
    `    <loc>${escape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(2)}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

/** Reads slugs, telugu names and chapter counts from the generated catalogue. */
async function readBooks() {
  const source = await readFile('src/data/bible/books.generated.ts', 'utf8')
  const books = []
  const re = /"number":\s*(\d+),\s*"slug":\s*"([^"]+)",\s*"telugu":\s*"([^"]+)",\s*"english":\s*"([^"]+)",\s*"shortTelugu":\s*"[^"]*",\s*"testament":\s*"(ot|nt)",\s*"chapters":\s*(\d+)/g

  let match
  while ((match = re.exec(source)) !== null) {
    const [, number, slug, telugu, english, testament, chapters] = match
    books.push({
      number: Number(number),
      slug,
      telugu,
      english,
      testament,
      chapters: Number(chapters),
    })
  }

  if (books.length !== 66) {
    throw new Error(
      `Expected 66 books in books.generated.ts, parsed ${books.length}. ` +
        'Regenerate the catalogue before the sitemap.',
    )
  }

  return books
}

function bookUrls(books) {
  const urls = []

  for (const book of books) {
    urls.push({
      loc: `${SITE}/bible/${book.slug}`,
      priority: 0.75,
      changefreq: 'monthly',
    })

    for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
      urls.push({
        loc: `${SITE}/bible/${book.slug}/${chapter}`,
        // Chapter pages are the bulk of the index; keep them just under the
        // book page so the canon structure stays clear.
        priority: 0.6,
        changefreq: 'monthly',
      })
    }
  }

  return urls
}

function contentUrls() {
  // Each pattern is anchored on the field that follows `slug` inside an entry,
  // so category slugs and speaker slugs are never picked up as pages.
  const sources = [
    { file: 'src/data/content/questions.ts', pattern: /slug:\s*'([^']+)',\s*\n\s*question:/g, base: '/questions/' },
    { file: 'src/data/content/articles.ts', pattern: /slug:\s*'([^']+)',\s*\n\s*title:/g, base: '/articles/' },
    { file: 'src/data/content/videos.ts', pattern: /slug:\s*'([^']+)',\s*\n\s*title:/g, base: '/videos/' },
  ]

  return Promise.all(
    sources.map(async ({ file, pattern, base }) => {
      const source = await readFile(file, 'utf8')
      const found = []
      for (const match of source.matchAll(pattern)) {
        found.push({
          loc: `${SITE}${base}${match[1]}`,
          priority: 0.7,
          changefreq: 'monthly',
        })
      }
      if (found.length === 0) {
        throw new Error(`No entries matched in ${file} — sitemap would be incomplete.`)
      }
      return found
    }),
  ).then((groups) => groups.flat())
}

/**
 * Routes that must stay out of the sitemap even though the router serves them.
 * Both set `noIndex`, so listing them would contradict their own meta tags.
 */
const NO_INDEX = new Set(['search', 'bible/search'])

/**
 * Fails if the sitemap advertises a page the router does not serve, or misses
 * an indexable static page that it does. Keeps the two lists honest about each
 * other, so a newly added page cannot be forgotten.
 */
async function verifyAgainstRoutes() {
  const app = await readFile('src/App.tsx', 'utf8')
  const declared = [...app.matchAll(/path:\s*'([^']*)'/g)]
    .map((m) => m[1])
    // '/' is the layout path; the index route is declared with `index: true`.
    .filter((p) => p !== '/' && p !== '*')

  const serves = (path) => {
    const segments = path.replace(/^\//, '').split('/')
    return declared.some((pattern) => {
      const parts = pattern.split('/')
      if (parts.length !== segments.length) return false
      return parts.every((part, i) => part.startsWith(':') || part === segments[i])
    })
  }

  const advertised = STATIC_ROUTES.map(([path]) => path).filter((p) => p !== '/')

  const problems = [
    ...advertised
      .filter((p) => !serves(p))
      .map((p) => `sitemap lists ${p}, which is not a route`),
    ...declared
      .filter((p) => !p.includes(':') && !NO_INDEX.has(p))
      .filter((p) => !advertised.includes(`/${p}`))
      .map((p) => `route /${p} is missing from the sitemap`),
    ...[...NO_INDEX]
      .filter((p) => advertised.includes(`/${p}`))
      .map((p) => `/${p} sets noIndex but is listed in the sitemap`),
  ]

  if (problems.length > 0) {
    throw new Error(problems.join('\n  '))
  }
}

const books = await readBooks()
const content = await contentUrls()
await verifyAgainstRoutes()

const urls = [
  ...STATIC_ROUTES.map(([path, priority, changefreq]) => ({
    loc: `${SITE}${path === '/' ? '' : path}`,
    priority,
    changefreq,
  })),
  ...content,
  ...bookUrls(books),
]

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => entry({ ...url, lastmod: TODAY })),
  '</urlset>',
  '',
].join('\n')

await writeFile('public/sitemap.xml', xml)

const chapters = books.reduce((sum, book) => sum + book.chapters, 0)
console.log(
  `public/sitemap.xml written — ${urls.length} URLs ` +
    `(${STATIC_ROUTES.length} static, ${content.length} content, ${books.length} books, ${chapters} chapters)`,
)
