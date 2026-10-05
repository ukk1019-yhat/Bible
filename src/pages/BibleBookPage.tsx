import { Link, Navigate, useParams } from 'react-router-dom'
import { getAdjacentBooks, getBookMeta } from '../services/bible'
import { ChapterPicker } from '../components/bible/ChapterPicker'
import { ChapterReader } from '../components/bible/ChapterReader'
import { Icon } from '../components/ui/Icon'
import { Breadcrumbs, PageHeader } from '../components/ui/Layout'
import { Reveal } from '../components/ui/Section'
import { graph, useSeo } from '../hooks/useSeo'
import NotFoundPage from './NotFoundPage'

/** One book: metadata, every chapter as a link, and neighbours in the canon. */
export function BibleBookPage() {
  const { bookSlug = '' } = useParams()
  const book = getBookMeta(bookSlug)

  useSeo({
    title: book ? `${book.telugu} — తెలుగు బైబిల్` : 'పుస్తకం కనబడలేదు',
    description: book
      ? `${book.telugu} (${book.english}) — ${book.chapters} అధ్యాయాలు, ${book.verses.toLocaleString('te-IN')} వాక్యాలు. ప్రతి అధ్యాయాన్ని ఆన్‌లైన్‌లో చదవండి.`
      : 'ఈ పుస్తకం ఈ పేజీలో లేదు.',
    path: `/bible/${bookSlug}`,
  })

  if (!book) return <NotFoundPage />

  const { previous, next } = getAdjacentBooks(bookSlug)

  return (
    <>
      <PageHeader
        eyebrow={`${book.testament === 'ot' ? 'పరిశుద్ధ బైబిల్' : 'నూతన నిబంధనం'} · ${book.english}`}
        title={book.telugu}
        crumbs={[
          { label: 'హోమ్', to: '/' },
          { label: 'బైబిల్', to: '/bible' },
          { label: book.telugu },
        ]}
      >
        <Link
          to={`/bible/${book.slug}/1`}
          className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-[var(--radius-md)] bg-forest-800 px-6 text-[0.95rem] font-medium text-cream-50 transition-colors hover:bg-forest-700"
        >
          <Icon name="book-open" size={18} />
          1వ అధ్యాయం చదవండి
        </Link>
      </PageHeader>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_16rem] lg:items-start">
          <Reveal>
            <div className="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm text-ink-muted">
              <span>{book.chapters} అధ్యాయాలు</span>
              <span>{book.verses.toLocaleString('te-IN')} వాక్యాలు</span>
            </div>
            <ChapterPicker book={book} />
          </Reveal>

          <Reveal delay={80} className="lg:sticky lg:top-24">
            <aside className="space-y-4">
              <div className="rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-5">
                <h2 className="text-sm font-semibold text-forest-900">ఈ పుస్తకం గురించి</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-muted">పేరు</dt>
                    <dd className="text-end font-medium text-forest-900">{book.telugu}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-muted">ఆంగ్లం</dt>
                    <dd className="text-end font-medium text-forest-900">{book.english}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-muted">అధ్యాయాలు</dt>
                    <dd className="font-medium text-forest-900">{book.chapters}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-muted">వాక్యాలు</dt>
                    <dd className="font-medium text-forest-900">
                      {book.verses.toLocaleString('te-IN')}
                    </dd>
                  </div>
                </dl>
              </div>

              <nav
                aria-label="పుస్తక మార్గం"
                className="grid gap-3 rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-5"
              >
                {previous ? (
                  <Link to={`/bible/${previous.slug}`} className="group flex items-center gap-3 text-sm">
                    <Icon
                      name="arrow-left"
                      size={16}
                      className="shrink-0 text-gold-600 transition-transform group-hover:-translate-x-0.5"
                    />
                    <span className="min-w-0">
                      <span className="block text-xs text-ink-muted">మునుపటి పుస్తకం</span>
                      <span className="block truncate font-medium text-forest-900">
                        {previous.telugu}
                      </span>
                    </span>
                  </Link>
                ) : null}

                {next ? (
                  <Link to={`/bible/${next.slug}`} className="group flex items-center gap-3 text-sm">
                    <span className="min-w-0 flex-1 text-end">
                      <span className="block text-xs text-ink-muted">తదుపరి పుస్తకం</span>
                      <span className="block truncate font-medium text-forest-900">
                        {next.telugu}
                      </span>
                    </span>
                    <Icon
                      name="arrow-right"
                      size={16}
                      className="shrink-0 text-gold-600 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                ) : null}
              </nav>
            </aside>
          </Reveal>
        </div>
      </div>
    </>
  )
}

/**
 * Route wrapper for `/bible/:bookSlug/:chapter`.
 * Validates the number before any data is fetched, and redirects out of range
 * rather than showing an empty chapter.
 */
export function BibleChapterRoute() {
  const { bookSlug = '', chapter = '' } = useParams()
  const book = getBookMeta(bookSlug)
  const chapterNumber = Number(chapter)

  if (!book || !Number.isInteger(chapterNumber) || chapterNumber < 1) {
    return <NotFoundPage />
  }

  if (chapterNumber > book.chapters) {
    return <Navigate to={`/bible/${bookSlug}`} replace />
  }

  return <BibleChapterView bookSlug={bookSlug} chapter={chapterNumber} />
}

function BibleChapterView({ bookSlug, chapter }: { bookSlug: string; chapter: number }) {
  const book = getBookMeta(bookSlug)!

  useSeo({
    title: `${book.telugu} ${chapter} — ${book.english} ${chapter}`,
    description: `${book.telugu} అధ్యాయం ${chapter} — ${book.english} ${chapter}. తెలుగు బైబిల్ వాక్యం ఆన్‌లైన్‌లో చదవండి, భద్రపరచండి, భాగం చేయండి.`,
    path: `/bible/${bookSlug}/${chapter}`,
    jsonLd: graph({
      '@type': 'Chapter',
      name: `${book.telugu} ${chapter}`,
      inLanguage: 'te-IN',
      isPartOf: {
        '@type': 'Book',
        name: book.telugu,
        url: `https://satyasakshi.in/bible/${bookSlug}`,
      },
    }),
  })

  return (
    <>
      <header className="border-b border-cream-300 bg-cream-50">
        <div className="shell py-8">
          <Breadcrumbs
            items={[
              { label: 'హోమ్', to: '/' },
              { label: 'బైబిల్', to: '/bible' },
              { label: book.telugu, to: `/bible/${bookSlug}` },
              { label: `అధ్యాయం ${chapter}` },
            ]}
          />
          <h1 className="mt-5 font-serif text-2xl text-forest-950 sm:text-3xl">
            {book.telugu} <span className="text-gold-700">{chapter}</span>
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            {book.english} {chapter} · పరిశుద్ధ తెలుగు బైబిల్
          </p>
        </div>
      </header>

      <div className="shell py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,46rem)_15rem] lg:items-start">
          <ChapterReader book={book} chapter={chapter} />

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-5">
              <h2 className="text-sm font-semibold text-forest-900">ఈ పుస్తకంలో</h2>
              <p className="mt-2 text-sm text-ink-soft">
                <Link
                  to={`/bible/${bookSlug}`}
                  className="link-underline font-medium text-forest-800"
                >
                  {book.telugu}
                </Link>{' '}
                — అధ్యాయం {chapter} / {book.chapters}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                {book.verses.toLocaleString('te-IN')} వాక్యాలు ఈ పుస్తకంలో ఉన్నాయి. వాక్యం
                తెలుగు బైబిల్ (BSI) నుండి.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
