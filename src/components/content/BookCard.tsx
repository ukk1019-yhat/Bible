import type { ChristianBook } from '../../types/content'
import { Icon } from '../ui/Icon'
import { Badge } from '../ui/Section'
import { trackContentClick } from '../../services/analyticsService'

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

export function BookCard({
  book,
  delay = 0,
  variant = 'grid',
}: {
  book: ChristianBook
  delay?: number
  variant?: 'grid' | 'list' | 'compact'
}) {
  const handleBookClick = () => {
    trackContentClick('books', book.slug, book.title, book.pdfUrl ? 'download' : 'click', '/books')
  }

  if (variant === 'list') {
    return (
      <article
        data-reveal=""
        style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
        className="group flex flex-col sm:flex-row gap-5 rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-4 sm:p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-md"
      >
        <div className="w-24 sm:w-32 shrink-0">
          {book.pdfUrl ? (
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBookClick}
              className="block transition-transform duration-200 group-hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:ring-offset-2 rounded-[var(--radius-md)]"
              aria-label={`${book.title} (PDF)`}
            >
              <BookCover book={book} />
            </a>
          ) : (
            <BookCover book={book} />
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="outline">{book.category.telugu}</Badge>
              {book.author ? (
                <span className="text-xs text-ink-muted">రచయిత: {book.author}</span>
              ) : null}
            </div>

            <h3 className="mt-2 text-lg font-serif font-semibold text-forest-950 group-hover:text-forest-700">
              {book.pdfUrl ? (
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleBookClick}
                  className="hover:underline"
                >
                  {book.title}
                </a>
              ) : (
                book.title
              )}
            </h3>

            {book.description ? (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {book.description}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-cream-200 pt-3">
            {book.pdfUrl ? (
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleBookClick}
                className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-4 py-1.5 text-xs font-medium text-cream-50 transition-colors hover:bg-forest-900"
              >
                <Icon name="download" size={14} />
                ఉచిత PDF చదవండి
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <Icon name="clock" size={14} />
                త్వరలో అందుబాటులో
              </span>
            )}
            <span className="text-2xs text-ink-muted">తెలుగు అనువాదం</span>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article
        data-reveal=""
        style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
        className="group flex h-full flex-col rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 p-3 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-sm"
      >
        <div className="aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-sm)]">
          {book.pdfUrl ? (
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBookClick}
              className="block size-full"
              aria-label={`${book.title} (PDF)`}
            >
              <BookCover book={book} className="size-full p-2.5" />
            </a>
          ) : (
            <BookCover book={book} className="size-full p-2.5" />
          )}
        </div>

        <div className="mt-2.5 flex flex-1 flex-col justify-between">
          <div>
            <Badge tone="outline" className="scale-90 origin-left text-3xs">
              {book.category.telugu}
            </Badge>
            <h3 className="mt-1 line-clamp-2 text-xs sm:text-sm font-medium text-forest-900 group-hover:text-forest-700">
              {book.title}
            </h3>
            {book.author ? (
              <p className="mt-0.5 truncate text-2xs text-ink-muted">{book.author}</p>
            ) : null}
          </div>

          <div className="mt-2 border-t border-cream-200 pt-2 text-2xs">
            {book.pdfUrl ? (
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleBookClick}
                className="inline-flex items-center gap-1 text-forest-700 font-medium hover:underline"
              >
                <Icon name="download" size={11} />
                PDF
              </a>
            ) : (
              <span className="text-ink-muted">త్వరలో</span>
            )}
          </div>
        </div>
      </article>
    )
  }

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
          onClick={handleBookClick}
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
              onClick={handleBookClick}
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
            onClick={handleBookClick}
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
