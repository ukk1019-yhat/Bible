import type { ChristianBook } from '../types/content'
import { bookCategories, books as fallbackBooks } from '../data/content/books'

export const GOOGLE_DRIVE_BOOKS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbycRi4ulh2tajO6g1dzjgfYwdMx3YbkHcSdXGOC8US5Io3e7CAGpbvV-HjZtlje0p78/exec'

const COVERS: ChristianBook['cover'][] = ['sage', 'clay', 'indigo', 'olive', 'plum', 'stone']

interface DriveApiBook {
  id: string
  title: string
  description?: string
  pdfUrl: string
  createdAt?: string
}

const CACHE_KEY = 'satya_sakshi_drive_books_cache'

/**
 * Returns currently cached books immediately (0ms).
 * Checks localStorage first, then sessionStorage, then fallbackBooks.
 */
export function getCachedBooks(): ChristianBook[] {
  try {
    const local = localStorage.getItem(CACHE_KEY)
    if (local) {
      const parsed = JSON.parse(local)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // ignore
  }

  try {
    const session = sessionStorage.getItem(CACHE_KEY)
    if (session) {
      const parsed = JSON.parse(session)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // ignore
  }

  return fallbackBooks
}

/**
 * Fetches the live list of Christian books from Google Drive in background.
 * If fresh data is fetched, it updates both localStorage and sessionStorage.
 */
export async function fetchDriveBooks(bypassCache = false): Promise<ChristianBook[]> {
  try {
    const timestamp = Date.now()
    const url = `${GOOGLE_DRIVE_BOOKS_ENDPOINT}${
      GOOGLE_DRIVE_BOOKS_ENDPOINT.includes('?') ? '&' : '?'
    }_t=${timestamp}`

    const controller = new AbortController()
    // 8-second safety timeout so slow scripts never hang indefinitely
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      cache: bypassCache ? 'no-store' : 'default',
      headers: {
        Accept: 'application/json',
      },
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new Error(`Drive script returned HTTP ${res.status}`)
    }

    const data = await res.json()

    if (!Array.isArray(data)) {
      throw new Error('Drive script did not return an array')
    }

    // If drive folder is empty (e.g. all books deleted in Drive), clear cache and return empty list
    if (data.length === 0) {
      try {
        localStorage.removeItem(CACHE_KEY)
        sessionStorage.removeItem(CACHE_KEY)
      } catch {
        // ignore
      }
      return []
    }

    const mapped: ChristianBook[] = data.map((item: DriveApiBook, index: number) => {
      const known = fallbackBooks.find(
        (b) => b.pdfUrl && (b.pdfUrl.includes(item.id) || b.slug === item.id),
      )

      const matchedCategory =
        bookCategories.find(
          (c) =>
            item.title.toLowerCase().includes(c.telugu) ||
            (item.description && item.description.toLowerCase().includes(c.telugu)),
        ) || bookCategories[0]

      return {
        slug: item.id || `drive-book-${index}`,
        title: known?.title || item.title || 'తెలుగు క్రైస్తవ పుస్తకం',
        author: known?.author || 'సత్యసాక్షి',
        category: known?.category || matchedCategory,
        description: known?.description || item.description || undefined,
        pdfUrl: item.pdfUrl,
        cover: known?.cover || COVERS[index % COVERS.length],
        status: 'published',
      }
    })

    // Persist to localStorage and sessionStorage for instant load next time
    try {
      const serialized = JSON.stringify(mapped)
      localStorage.setItem(CACHE_KEY, serialized)
      sessionStorage.setItem(CACHE_KEY, serialized)
    } catch {
      // ignore
    }

    return mapped
  } catch (err) {
    console.warn('Google Drive books fetch error or timeout, using cached books:', err)
    return getCachedBooks()
  }
}
