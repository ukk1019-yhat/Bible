import { useEffect, useState } from 'react'
import { loadBook, type LoadedBook } from '../services/bible'

interface BookResult {
  /** The slug this result belongs to. */
  slug: string
  book: LoadedBook | null
  error: string | null
}

const EMPTY: BookResult = { slug: '', book: null, error: null }

/**
 * Loads one Bible book into memory. The underlying service caches the promise,
 * so switching chapters of the same book is instant and switching away and
 * back costs nothing.
 *
 * The result is tagged with the slug that produced it and staleness is derived
 * during render, so a new slug never needs a synchronous reset.
 */
export function useBook(slug: string | undefined) {
  const [result, setResult] = useState<BookResult>(EMPTY)

  useEffect(() => {
    if (!slug) return

    let cancelled = false

    loadBook(slug)
      .then((book) => {
        if (!cancelled) setResult({ slug, book, error: null })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setResult({
          slug,
          book: null,
          error: error instanceof Error ? error.message : 'బైబిల్ లోడ్ కాలేదు',
        })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const stale = !slug || result.slug !== slug

  return {
    book: stale ? null : result.book,
    loading: !!slug && stale,
    error: stale ? null : result.error,
  }
}
