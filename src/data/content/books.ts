import type { BookCategory, ChristianBook } from '../../types/content'

/**
 * Category taxonomy for the Christian book library.
 * Defined up front so the library UI, filters and any future CMS share one
 * vocabulary — adding a book never requires a new filter.
 */
export const bookCategories: BookCategory[] = [
  { slug: 'bible-adhyayanam', telugu: 'బైబిల్ అధ్యయనం' },
  { slug: 'vishvaasam', telugu: 'విశ్వాసం' },
  { slug: 'praarthana', telugu: 'ప్రార్థన' },
  { slug: 'kutumbam', telugu: 'కుటుంబం' },
  { slug: 'yuvata', telugu: 'యువత' },
  { slug: 'pillalu', telugu: 'పిల్లలు' },
  { slug: 'aatmiya-jeevitam', telugu: 'ఆత్మీయ జీవితం' },
]

/**
 * Satya Sakshi has not published any downloadable Christian PDFs yet — the
 * existing site states "త్వరలో ఉచిత తెలుగు క్రైస్తవ PDF పుస్తకాలు అందుబాటులోకి వస్తాయి."
 *
 * Rather than invent books, authors or PDFs, this stays empty and the UI shows
 * a designed empty state. To publish a book, append an entry here:
 *
 *   { slug: '…', title: '…', author: '…', category: bookCategories[0],
 *     description: '…', pdfUrl: '/pdf/….pdf', cover: 'sage', status: 'published' }
 */
export const books: ChristianBook[] = []

export const publishedBooks = books.filter((b) => b.status === 'published')

export function getBookBySlug(slug: string): ChristianBook | undefined {
  return books.find((b) => b.slug === slug)
}

export function getCategoryBySlug(slug: string): BookCategory | undefined {
  return bookCategories.find((c) => c.slug === slug)
}