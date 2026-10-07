import type { ChristianBook } from '../types/content'
import { bookCategories, books as fallbackBooks } from '../data/content/books'

export const GOOGLE_DRIVE_BOOKS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbyWMBAUO4GpOG4WnRxoGUwOl9c0ohFopZSdrWNGNVr7XI7dRvu4g_vHprtVCvFsvcox/exec'

const COVERS: ChristianBook['cover'][] = ['sage', 'clay', 'indigo', 'olive', 'plum', 'stone']

interface DriveApiBook {
  id: string
  title: string
  description?: string
  pdfUrl: string
  createdAt?: string
}

const CACHE_KEY = 'satya_sakshi_drive_books_cache'

export async function fetchDriveBooks(): Promise<ChristianBook[]> {
  try {
    const res = await fetch(GOOGLE_DRIVE_BOOKS_ENDPOINT, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`Drive script returned HTTP ${res.status}`)
    }

    const data = await res.json()

    if (!Array.isArray(data)) {
      throw new Error('Drive script did not return an array')
    }

    if (data.length === 0) {
      return fallbackBooks
    }

    const mapped: ChristianBook[] = data.map((item: DriveApiBook, index: number) => {
      // Find matching category by slug or telugu name in title/description if mentioned
      const matchedCategory =
        bookCategories.find(
          (c) =>
            item.title.toLowerCase().includes(c.telugu) ||
            (item.description && item.description.toLowerCase().includes(c.telugu)),
        ) || bookCategories[0]

      return {
        slug: item.id || `drive-book-${index}`,
        title: item.title || 'తెలుగు క్రైస్తవ పుస్తకం',
        author: 'సత్యసాక్షి',
        category: matchedCategory,
        description: item.description || undefined,
        pdfUrl: item.pdfUrl,
        cover: COVERS[index % COVERS.length],
        status: 'published',
      }
    })

    // Cache successful response
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(mapped))
    } catch {
      // ignore storage quota errors
    }

    return mapped
  } catch (err) {
    // If network fails, try cache first
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
