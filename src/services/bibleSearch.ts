import { useEffect, useRef, useState } from 'react'
import { loadBook, type LoadedBook } from './bible'
import { BIBLE_BOOKS } from '../data/bible/books.generated'
import { matchesAllTokens } from '../utils/text'

export interface BibleSearchHit {
  bookSlug: string
  bookTelugu: string
  bookEnglish: string
  testament: 'ot' | 'nt'
  chapter: number
  verse: number
  text: string
}

export type BibleSearchStatus = 'idle' | 'searching' | 'done' | 'error'

interface BibleSearchState {
  status: BibleSearchStatus
  /** 0..1 */
  progress: number
  hits: BibleSearchHit[]
  booksScanned: number
  error?: string
}

/** State is tagged with the query that produced it. */
interface TaggedState extends BibleSearchState {
  query: string
}

/** Shown when the query is too short or search is disabled. */
const EMPTY: TaggedState = {
  query: '',
  status: 'idle',
  progress: 0,
  hits: [],
  booksScanned: 0,
}

const MAX_HITS = 300
const MIN_QUERY_LENGTH = 2
const WORKER_COUNT = 4

/**
 * Full-text search across the whole Telugu Bible.
 *
 * The canon is ~10 MB, so we never ship it up front. Instead each book file is
 * fetched on demand, scanned, and released. Results stream in as books finish,
 * so the first matches appear long before the scan completes.
 *
 * The scan is plain iteration and stays cheap; a few books are in flight at
 * once to keep the network busy without starving the reader.
 */
export function useBibleSearch(query: string, enabled = true) {
  const [tagged, setTagged] = useState<TaggedState>(EMPTY)
  const cachedRef = useRef<Map<string, Promise<LoadedBook>>>(new Map())

  const trimmed = query.trim()
  const active = enabled && trimmed.length >= MIN_QUERY_LENGTH ? trimmed : ''

  useEffect(() => {
    if (!active) return

    let cancelled = false
    let reachedLimit = false

    const collected: BibleSearchHit[] = []
    let scanned = 0

    const load = (slug: string) => {
      const cached = cachedRef.current.get(slug)
      if (cached) return cached
      const promise = loadBook(slug)
      cachedRef.current.set(slug, promise)
      // Don't cache rejected promises — a later attempt should retry.
      promise.catch(() => cachedRef.current.delete(slug))
      return promise
    }

    const scan = async () => {
      const queue = [...BIBLE_BOOKS]

      const worker = async () => {
        for (;;) {
          const next = queue.shift()
          if (!next || cancelled || reachedLimit) return
          try {
            const book = await load(next.slug)
            if (cancelled) return
            for (const chapter of book.chapters) {
              for (let i = 0; i < chapter.verses.length; i += 1) {
                const text = chapter.verses[i]
                if (!matchesAllTokens(text, active)) continue
                collected.push({
                  bookSlug: next.slug,
                  bookTelugu: next.telugu,
                  bookEnglish: next.english,
                  testament: next.testament,
                  chapter: chapter.number,
                  verse: i + 1,
                  text,
                })
                // Stop every worker once the cap is reached, not just this one.
                if (collected.length >= MAX_HITS) {
                  reachedLimit = true
                  return
                }
              }
            }
          } catch {
            // Skip unreadable books rather than failing the whole search.
          }
          scanned += 1
          if (cancelled) return
          setTagged({
            query: active,
            status: 'searching',
            progress: scanned / BIBLE_BOOKS.length,
            hits: [...collected],
            booksScanned: scanned,
          })
        }
      }

      await Promise.all(Array.from({ length: WORKER_COUNT }, worker))

      // A newer query (or an unmount) supersedes this scan — leave the newer
      // state alone. Never `return` out of a `finally`, it would swallow
      // errors from the block above.
      if (cancelled) return

      setTagged({
        query: active,
        status: 'done',
        progress: 1,
        hits: [...collected],
        booksScanned: scanned,
      })
    }

    void scan()

    return () => {
      cancelled = true
    }
  }, [active])

  // Derive the resting state during render, so a new query shows a searching
  // indicator immediately instead of waiting for the effect to fire. Results
  // from a previous query are never shown against a new one.
  if (!active) return EMPTY
  if (tagged.query !== active) return { ...EMPTY, query: active, status: 'searching' }

  return tagged
}
