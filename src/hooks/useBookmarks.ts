import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export interface Bookmark {
  slug: string
  chapter: number
  /** Telugu book name, stored so the saved list needs no lookup. */
  bookTelugu: string
  /** Telugu verse text preview. */
  preview: string
  /** Epoch ms of the save. */
  savedAt: number
}

/** Reader text-size preference, in steps. */
export const FONT_STEPS = [
  { label: 'చిన్న', className: 'text-[1rem] leading-[1.9]' },
  { label: 'మధ్య', className: 'text-[1.15rem] leading-[2]' },
  { label: 'పెద్ద', className: 'text-[1.35rem] leading-[2.1]' },
] as const

const BOOKMARKS_KEY = 'bookmarks'
const FONT_KEY = 'font-size'

/** Saved verses, newest first. Stored locally — nothing leaves the device. */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>(BOOKMARKS_KEY, [])

  const isBookmarked = useCallback(
    (slug: string, chapter: number) =>
      bookmarks.some((b) => b.slug === slug && b.chapter === chapter),
    [bookmarks],
  )

  const toggle = useCallback(
    (bookmark: Bookmark) => {
      setBookmarks((prev) => {
        const exists = prev.some(
          (b) => b.slug === bookmark.slug && b.chapter === bookmark.chapter,
        )
        return exists
          ? prev.filter((b) => !(b.slug === bookmark.slug && b.chapter === bookmark.chapter))
          : [bookmark, ...prev].slice(0, 100)
      })
    },
    [setBookmarks],
  )

  const remove = useCallback(
    (slug: string, chapter: number) => {
      setBookmarks((prev) => prev.filter((b) => !(b.slug === slug && b.chapter === chapter)))
    },
    [setBookmarks],
  )

  const clear = useCallback(() => setBookmarks([]), [setBookmarks])

  return { bookmarks, isBookmarked, toggle, remove, clear }
}

/** Reader text size, persisted between visits. */
export function useReaderFontSize() {
  const [index, setIndex] = useLocalStorage<number>(FONT_KEY, 1)

  const safeIndex = Math.min(Math.max(index, 0), FONT_STEPS.length - 1)

  return {
    step: FONT_STEPS[safeIndex],
    index: safeIndex,
    label: FONT_STEPS[safeIndex].label,
    increase: () => setIndex(Math.min(safeIndex + 1, FONT_STEPS.length - 1)),
    decrease: () => setIndex(Math.max(safeIndex - 1, 0)),
  }
}
