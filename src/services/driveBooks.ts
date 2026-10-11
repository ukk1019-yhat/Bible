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
 * Fetches the live list of Christian books from Google Drive.
 * Bypasses all browser and proxy caches to ensure any additions or deletions
 * in Google Drive immediately reflect on the website.
 */
export async function fetchDriveBooks(): Promise<ChristianBook[]> {
  try {
    const timestamp = Date.now()
    const url = `${GOOGLE_DRIVE_BOOKS_ENDPOINT}${
      GOOGLE_DRIVE_BOOKS_ENDPOINT.includes('?') ? '&' : '?'
    }_t=${timestamp}`

    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    })

    if (!res.ok) {
      throw new Error(`Drive script returned HTTP ${res.status}`)
    }

    const data = await res.json()

    if (!Array.isArray(data)) {
      throw new Error('Drive script did not return an array')
    }

    // If drive folder is empty (e.g. all books deleted), return empty list
    if (data.length === 0) {
      try {
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

      // Find matching category by slug or telugu name in title/description if mentioned
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

    // Update session cache with latest fresh data
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(mapped))
    } catch {
      // ignore
    }

    return mapped
  } catch (err) {
    // Only if network fails, check if we have a temporary offline cache
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch {
      // ignore
    }

    // Otherwise return fallback books from books.ts
    return fallbackBooks
  }
}
