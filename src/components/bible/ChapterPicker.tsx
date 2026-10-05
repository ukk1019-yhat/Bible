import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { BibleBookMeta } from '../../data/bible/books.generated'
import { Icon } from '../ui/Icon'

/**
 * Chapter selector for a single book.
 *
 * Long books (Jeremiah, Psalms) get a wrap-around numeric grid; short books
 * get labelled rows. Either way every chapter is one tap away, which is how
 * people actually use a Bible online.
 */
export function ChapterPicker({
  book,
  activeChapter,
}: {
  book: BibleBookMeta
  activeChapter?: number
}) {
  const chapters = useMemo(
    () => Array.from({ length: book.chapters }, (_, i) => i + 1),
    [book.chapters],
  )

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-lg text-forest-900">అధ్యాయాలు</h2>
        <p className="text-sm text-ink-muted">
          {book.chapters} అధ్యాయాలు
        </p>
      </div>

      <ul
        className={`grid gap-2 ${
          book.chapters > 40 ? 'grid-cols-5 sm:grid-cols-8 md:grid-cols-10' : 'grid-cols-4 sm:grid-cols-6'
        }`}
      >
        {chapters.map((chapter) => {
          const current = chapter === activeChapter
          return (
            <li key={chapter}>
              <Link
                to={`/bible/${book.slug}/${chapter}`}
                aria-current={current ? 'page' : undefined}
                className={`flex min-h-12 items-center justify-center rounded-[var(--radius-sm)] border text-[0.95rem] transition-[background-color,border-color,color] duration-200 ${
                  current
                    ? 'border-forest-800 bg-forest-800 font-medium text-cream-50'
                    : 'border-cream-300 bg-cream-50 text-forest-900 hover:border-forest-400 hover:bg-forest-100/70'
                }`}
              >
                {chapter}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Horizontal "previous / next" pager used above and below a chapter. */
export function ChapterPager({
  previous,
  next,
}: {
  previous?: { slug: string; chapter: number; label: string }
  next?: { slug: string; chapter: number; label: string }
}) {
  return (
    <nav
      aria-label="అధ్యాయ మార్గం"
      className="grid gap-3 border-t border-cream-300 pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          to={`/bible/${previous.slug}/${previous.chapter}`}
          className="group flex items-center gap-3 rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 px-4 py-3 transition-colors hover:border-forest-300 hover:bg-forest-100/50"
        >
          <Icon
            name="arrow-left"
            size={18}
            className="shrink-0 text-gold-600 transition-transform group-hover:-translate-x-0.5"
          />
          <span className="min-w-0">
            <span className="block text-xs text-ink-muted">మునుపటి అధ్యాయం</span>
            <span className="block truncate text-sm font-medium text-forest-900">
              {previous.label}
            </span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          to={`/bible/${next.slug}/${next.chapter}`}
          className="group flex items-center justify-end gap-3 rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 px-4 py-3 text-right transition-colors hover:border-forest-300 hover:bg-forest-100/50"
        >
          <span className="min-w-0">
            <span className="block text-xs text-ink-muted">తదుపరి అధ్యాయం</span>
            <span className="block truncate text-sm font-medium text-forest-900">
              {next.label}
            </span>
          </span>
          <Icon
            name="arrow-right"
            size={18}
            className="shrink-0 text-gold-600 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </nav>
  )
}
