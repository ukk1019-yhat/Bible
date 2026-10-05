import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BIBLE_BOOKS, type Testament } from '../../data/bible/books.generated'
import { Icon } from '../ui/Icon'

const TESTAMENTS: { key: Testament; telugu: string; english: string }[] = [
  { key: 'ot', telugu: 'పరిశుద్ధ బైబిల్', english: 'Old Testament' },
  { key: 'nt', telugu: 'నూతన నిబంధనం', english: 'New Testament' },
]

export interface BookGridProps {
  /** Restrict to one testament, e.g. from the "old/new" jump links. */
  testament?: Testament
  /** Books to feature first (e.g. Gospels, Psalms). */
  highlightSlugs?: string[]
}

/**
 * All 66 books, grouped by testament. Each card lists its chapter count so a
 * reader can see the shape of the canon before opening anything.
 */
export function BookGrid({ testament, highlightSlugs = [] }: BookGridProps) {
  const [active, setActive] = useState<Testament>(testament ?? 'nt')
  const [filter, setFilter] = useState('')

  const groups = useMemo(() => {
    const term = testament ?? active
    return {
      term,
      books: BIBLE_BOOKS.filter((book) => book.testament === term),
    }
  }, [testament, active])

  const visible = useMemo(() => {
    const q = filter.trim()
    if (!q) return groups.books
    return groups.books.filter((book) =>
      `${book.telugu} ${book.english}`.toLowerCase().includes(q.toLowerCase()),
    )
  }, [groups.books, filter])

  const highlighted = useMemo(
    () => new Set(highlightSlugs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightSlugs.join(',')],
  )

  return (
    <div>
      {!testament ? (
        <div
          role="tablist"
          aria-label="నిబంధనాలు"
          className="mb-8 flex gap-1 border-b border-cream-300"
        >
          {TESTAMENTS.map((item) => (
            <button
              key={item.key}
              role="tab"
              type="button"
              aria-selected={active === item.key}
              onClick={() => setActive(item.key)}
              className={`-mb-px border-b-2 px-4 py-3 text-[0.95rem] transition-colors ${
                active === item.key
                  ? 'border-forest-800 font-medium text-forest-900'
                  : 'border-transparent text-ink-muted hover:text-forest-700'
              }`}
            >
              {item.telugu}
              <span className="ml-2 text-xs text-ink-muted">{item.english}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="relative flex-1 sm:max-w-xs">
          <span className="sr-only">పేరు ప్రకారం సాఫ్ చేయండి</span>
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            <Icon name="search" size={17} />
          </span>
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="పేరు ప్రకారం సాఫ్ చేయండి…"
            className="min-h-11 w-full rounded-[var(--radius-md)] border border-cream-400 bg-cream-50 ps-10 pe-3 text-sm text-ink placeholder:text-ink-muted/80 focus:border-forest-600 focus:bg-white focus:outline-none"
          />
        </label>

        <p className="text-sm text-ink-muted" role="status">
          {visible.length} పుస్తకాలు
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-ink-muted">
          ఈ పేరుతో పుస్తకాలు లేవు. వేరే పేరు మీద ప్రయత్నించండి.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((book) => (
            <li key={book.slug}>
              <Link
                to={`/bible/${book.slug}`}
                className="group flex h-full flex-col rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-[1.05rem] font-semibold text-forest-900 group-hover:text-forest-700">
                      {book.telugu}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">{book.english}</p>
                  </div>
                  {highlighted.has(book.slug) ? (
                    <span className="shrink-0 rounded-full bg-gold-100 px-2 py-0.5 text-2xs font-medium text-gold-700">
                      ప్రధానం
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 text-xs text-ink-muted">
                  {book.chapters} అధ్యాయాలు · {book.verses.toLocaleString('te-IN')} వాక్యాలు
                </p>

                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-forest-700 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  అధ్యాయాలు
                  <Icon name="arrow-right" size={14} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {testament ? null : (
        <p className="mt-8 text-sm text-ink-muted">
          మరొక నిబంధనం చదవాలంటే పైన ఉన్న ట్యాబ్‌లను ఎంచుకోండి. మొత్తం{' '}
          {BIBLE_BOOKS.length} పుస్తకాలు,{' '}
          {BIBLE_BOOKS.reduce((sum, b) => sum + b.verses, 0).toLocaleString('te-IN')} వాక్యాలు.
        </p>
      )}
    </div>
  )
}
