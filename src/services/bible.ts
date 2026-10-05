import { BIBLE_BOOKS, type BibleBookMeta, type Testament } from '../data/bible/books.generated'

/** On-disk shape of a book file in /public/bible — compact to keep it small. */
export interface BibleBookFile {
  /** Canonical book number. */
  b: number
  /** English name, kept for debugging and fallback labels. */
  e: string
  /** Telugu name. */
  t: string
  /** Chapters as `[chapterNumber, verseTexts[]]`. */
  c: [number, string[]][]
}

export interface Chapter {
  number: number
  verses: string[]
}

export interface LoadedBook {
  meta: BibleBookMeta
  chapters: Chapter[]
}

const BOOK_URL = (slug: string) => `${import.meta.env.BASE_URL}data/bible/${slug}.json`

const cache = new Map<string, Promise<LoadedBook>>()

export function getBookMeta(slug: string): BibleBookMeta | undefined {
  return BIBLE_BOOKS.find((b) => b.slug === slug)
}

export function getBooksByTestament(testament: Testament): BibleBookMeta[] {
  return BIBLE_BOOKS.filter((b) => b.testament === testament)
}

export function getAdjacentBooks(slug: string): {
  previous?: BibleBookMeta
  next?: BibleBookMeta
} {
  const index = BIBLE_BOOKS.findIndex((b) => b.slug === slug)
  if (index === -1) return {}
  return {
    previous: BIBLE_BOOKS[index - 1],
    next: BIBLE_BOOKS[index + 1],
  }
}

/** Locate a chapter inside a loaded book. */
export function getChapter(book: LoadedBook, chapterNumber: number): Chapter | undefined {
  const found = book.chapters.find((c) => c.number === chapterNumber)
  return found ? { number: found.number, verses: found.verses } : undefined
}

/** Steps to the previous/next chapter across the whole canon. */
export function stepChapter(
  slug: string,
  chapter: number,
  delta: -1 | 1,
): { slug: string; chapter: number } | undefined {
  const index = BIBLE_BOOKS.findIndex((b) => b.slug === slug)
  if (index === -1) return undefined

  const meta = BIBLE_BOOKS[index]
  const target = chapter + delta

  if (target >= 1 && target <= meta.chapters) return { slug, chapter: target }

  if (delta === 1) {
    const next = BIBLE_BOOKS[index + 1]
    return next ? { slug: next.slug, chapter: 1 } : undefined
  }

  const previous = BIBLE_BOOKS[index - 1]
  return previous ? { slug: previous.slug, chapter: previous.chapters } : undefined
}

/**
 * Lazily load one book. Results are memoised for the session so moving between
 * chapters of the same book never re-fetches, and so repeated navigations are
 * instant.
 */
export function loadBook(slug: string): Promise<LoadedBook> {
  const cached = cache.get(slug)
  if (cached) return cached

  const meta = getBookMeta(slug)
  if (!meta) return Promise.reject(new Error(`Unknown Bible book: ${slug}`))

  const request = fetch(BOOK_URL(slug))
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load "${meta.telugu}" (${res.status})`)
      return res.json() as Promise<BibleBookFile>
    })
    .then((file) => ({
      meta,
      chapters: file.c.map(([number, verses]) => ({ number, verses })),
    }))
    .catch((error: unknown) => {
      // Allow a retry after a network failure.
      cache.delete(slug)
      throw error
    })

  cache.set(slug, request)
  return request
}

/** Human-readable reference, e.g. "యోహాను 3:16". */
export function formatReference(
  bookSlug: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
): string {
  const meta = getBookMeta(bookSlug)
  const name = meta?.telugu ?? bookSlug
  if (!verseStart) return `${name} ${chapter}`
  if (verseEnd && verseEnd !== verseStart) return `${name} ${chapter}:${verseStart}-${verseEnd}`
  return `${name} ${chapter}:${verseStart}`
}

/** Canonical path for a chapter, used for links and share URLs. */
export function chapterPath(slug: string, chapter: number): string {
  return `/bible/${slug}/${chapter}`
}

/** Build a sharable text block for a verse range. */
export async function verseShareText(
  bookSlug: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
): Promise<string> {
  const book = await loadBook(bookSlug)
  const verses = getChapter(book, chapter)?.verses ?? []
  const selected = verses.slice(verseStart - 1, verseEnd)
  const body = selected
    .map((text, i) => `${verseStart + i}. ${text}`)
    .join(' ')
  return `"${body}" — ${formatReference(bookSlug, chapter, verseStart, verseEnd)}`
}