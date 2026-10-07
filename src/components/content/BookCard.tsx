import type { ChristianBook } from '../../types/content'
import { Icon } from '../ui/Icon'
import { Badge } from '../ui/Section'

/**
 * Book cover art, drawn rather than photographed.
 *
 * Satya Sakshi has not published any book files yet, so there are no covers to
 * show. A generated cover keeps the shelf looking intentional instead of
 * padding it with grey placeholder boxes.
 */
const COVERS: Record<ChristianBook['cover'], { from: string; to: string; mark: string }> = {
  sage: { from: '#1d4a36', to: '#10291e', mark: '#d8b871' },
  clay: { from: '#7a4a33', to: '#4a2a1c', mark: '#eddcb6' },
  indigo: { from: '#2c3b5a', to: '#161f33', mark: '#c9d4e8' },
  olive: { from: '#4e5230', to: '#2b2e18', mark: '#e2dcb4' },
  plum: { from: '#4f2a44', to: '#2b1524', mark: '#e6c9de' },
  stone: { from: '#4a4f52', to: '#26292b', mark: '#ddd0b7' },
}

export function BookCover({ book, className = '' }: { book: ChristianBook; className?: string }) {
  const palette = COVERS[book.cover]

  return (
    <div
      className={`relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[var(--radius-md)] p-4 shadow-md ${className}`}
      style={{ backgroundImage: `linear-gradient(155deg, ${palette.from}, ${palette.to})` }}
      aria-hidden="true"
    >
      <span
        className="absolute inset-x-0 top-0 h-px"
        style={{ backgroundColor: palette.mark, opacity: 0.5 }}
      />
      <svg viewBox="0 0 48 48" className="size-8 opacity-80" fill="none" stroke={palette.mark} strokeWidth="1.4">
        <path d="M24 14c-3-2.3-6.2-3.2-9.8-3.2v16.4c3.6 0 6.8.9 9.8 3.2" />
        <path d="M24 14c3-2.3 6.2-3.2 9.8-3.2v16.4c-3.6 0-6.8.9-9.8 3.2" />
        <path d="M24 14v16.4" />
      </svg>
      <span
        className="line-clamp-4 font-serif text-sm font-semibold leading-snug"
        style={{ color: palette.mark }}
      >
        {book.title}
      </span>
    </div>
  )
}

export function BookCard({ book, delay = 0 }: { book: ChristianBook; delay?: number }) {
  return (
    <article
      data-reveal=""
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className="group flex h-full flex-col"
    >
      {book.pdfUrl ? (
        <a
          href={book.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-transform duration-300 group-hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:ring-offset-2 rounded-[var(--radius-md)]"
          aria-label={`${book.title} (PDF)`}
        >
          <BookCover book={book} />
        </a>
      ) : (
        <BookCover book={book} className="transition-transform duration-300 group-hover:-translate-y-1" />
      )}

      <div className="mt-4 flex flex-1 flex-col">
        <Badge tone="outline" className="self-start">
          {book.category.telugu}
        </Badge>

        <h3 className="mt-2.5 text-[1.05rem] leading-snug font-medium text-forest-900">
          {book.pdfUrl ? (
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest-700 hover:underline"
            >
              {book.title}
            </a>
          ) : (
            book.title
          )}
        </h3>

        {book.author ? <p className="mt-1 text-sm text-ink-muted">{book.author}</p> : null}

        {book.description ? (
          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-soft">
            {book.description}
          </p>
        ) : null}

        {book.pdfUrl ? (
          <a
            href={book.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-800 hover:underline"
          >
            <Icon name="download" size={15} />
            PDF చదవండి
          </a>
        ) : (
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <Icon name="clock" size={15} />
            త్వరలో అందుబాటులో
          </p>
        )}
      </div>
    </article>
  )
}
