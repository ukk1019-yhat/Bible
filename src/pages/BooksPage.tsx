import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookCategories } from '../data/content/books'
import { BookCard } from '../components/content/BookCard'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/Layout'
import { EmptyState, Reveal } from '../components/ui/Section'
import { useSeo } from '../hooks/useSeo'
import { fetchDriveBooks } from '../services/driveBooks'
import type { ChristianBook } from '../types/content'

export function BooksPage() {
  const [bookList, setBookList] = useState<ChristianBook[]>([])
  const [category, setCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadBooks = async (isManual = false) => {
    if (isManual) setRefreshing(true)
    try {
      const items = await fetchDriveBooks()
      setBookList(items)
    } finally {
      setLoading(false)
      if (isManual) setRefreshing(false)
    }
  }

  useEffect(() => {
    let active = true
    fetchDriveBooks().then((items) => {
      if (active) {
        setBookList(items)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  useSeo({
    title: 'క్రైస్తవ పుస్తకాలు — ఉచిత తెలుగు డౌన్‌లోడ్‌లు',
    description:
      'బైబిల్ అధ్యయనం, విశ్వాసం, ప్రార్థన, కుటుంబం, యువత — తెలుగు క్రైస్తవ పుస్తకాల గ్రంథాలయం. ఉచిత PDF డౌన్‌లోడ్‌లు.',
    path: '/books',
  })

  const visible = useMemo(
    () =>
      category ? bookList.filter((book) => book.category.slug === category) : bookList,
    [category, bookList],
  )

  const hasBooks = bookList.length > 0

  return (
    <>
      <PageHeader
        eyebrow="పుస్తకాల గ్రంథాలయం"
        title="క్రైస్తవ పుస్తకాలు"
        icon="stack"
        lede="తెలుగు భాషలో ఉచితంగా చదవగల క్రైస్తవ పుస్తకాల గ్రంథాలయం."
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'పుస్తకాలు' }]}
      />

      <div className="shell py-12 sm:py-16">
        {/* Filters and live sync refresh button */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCategory(null)}
              aria-pressed={category === null}
              className={`min-h-9 rounded-full px-4 text-sm transition-colors ${
                category === null
                  ? 'bg-forest-800 font-medium text-cream-50'
                  : 'bg-cream-200 text-ink-soft hover:bg-cream-300'
              }`}
            >
              అన్నీ {hasBooks ? `(${bookList.length})` : ''}
            </button>
            {bookCategories.map((item) => {
              const count = bookList.filter((b) => b.category.slug === item.slug).length
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setCategory(item.slug)}
                  aria-pressed={category === item.slug}
                  className={`min-h-9 rounded-full px-4 text-sm transition-colors ${
                    category === item.slug
                      ? 'bg-forest-800 font-medium text-cream-50'
                      : 'bg-cream-200 text-ink-soft hover:bg-cream-300'
                  }`}
                >
                  {item.telugu} {count > 0 ? `(${count})` : ''}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => loadBooks(true)}
            disabled={refreshing}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-cream-400 bg-cream-100 px-3.5 py-1 text-xs font-medium text-forest-900 transition-colors hover:bg-cream-200 disabled:opacity-50"
            title="Google Drive నుండి తాజా పుస్తకాలను అప్‌డేట్ చేయండి"
          >
            <Icon
              name="refresh"
              size={14}
              className={refreshing ? 'animate-spin text-gold-600' : 'text-forest-700'}
            />
            <span>{refreshing ? 'తాజాకరిస్తోంది...' : 'తాజాకరించు (Sync)'}</span>
          </button>
        </div>

        {/* Book Grid or Skeleton or Empty State */}
        {loading && bookList.length === 0 ? (
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex aspect-[3/4] animate-pulse flex-col justify-end rounded-[var(--radius-md)] bg-cream-200/80 p-4"
              >
                <div className="h-4 w-3/4 rounded bg-cream-300/80" />
              </div>
            ))}
          </div>
        ) : visible.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {visible.map((book, index) => (
              <li key={book.slug}>
                <BookCard book={book} delay={index * 40} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<Icon name="stack" size={28} />}
            title={category ? 'ఈ విభాగంలో పుస్తకాలు లేవు' : 'పుస్తకాలు త్వరలో అందుబాటులో'}
            description={
              category ? (
                <>
                  <p>ఎంచుకున్న విభాగంలో ప్రస్తుతం పుస్తకాలు లేవు.</p>
                  <button
                    type="button"
                    onClick={() => setCategory(null)}
                    className="mt-4 rounded-full bg-forest-800 px-5 py-2 text-sm font-medium text-cream-50 transition-colors hover:bg-forest-900"
                  >
                    అన్ని పుస్తకాలు చూడండి
                  </button>
                </>
              ) : (
                <>
                  <p>
                    సత్యసాక్షి ఉచిత తెలుగు క్రైస్తవ PDF పుస్తకాలను తయారు చేస్తోంది. ఇప్పటికి
                    ఏ పుస్తకం కూడా ప్రచురించలేదు.
                  </p>
                  <p className="mt-3">
                    ప్రచురణ జరిగిన వెంటనే ఇక్కడ కనిపిస్తాయి. అప్పటివరకు మీరు బైబిల్ చదవగలరు —
                    అది ఇక్కడే ఉంది.
                  </p>
                </>
              )
            }
          />
        )}

        {/* What the library will hold — a real, committed taxonomy. */}
        <Reveal className="mt-16">
          <section aria-labelledby="library-plans">
            <h2 id="library-plans" className="text-xl text-forest-950">
              గ్రంథాలయంలో ఉండే అంశాలు
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {bookCategories.map((item) => (
                <li
                  key={item.slug}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 px-4 py-3.5"
                >
                  <Icon name="book" size={17} className="shrink-0 text-gold-600" />
                  <span className="text-[0.95rem] text-forest-900">{item.telugu}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* Honest alternative while the library is empty. */}
        <Reveal className="mt-12">
          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              to="/bible"
              className="group flex flex-col rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-6 transition-colors hover:border-forest-300 hover:bg-forest-100/40"
            >
              <Icon name="book-open" size={22} className="text-forest-700" />
              <span className="mt-4 font-serif text-[1.1rem] font-semibold text-forest-900">
                బైబిల్ చదవండి
              </span>
              <span className="mt-1.5 text-sm text-ink-muted">
                66 పుస్తకాలు, 1,189 అధ్యాయాలు — ఇప్పటికే అందుబాటులో.
              </span>
            </Link>

            <Link
              to="/questions"
              className="group flex flex-col rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-6 transition-colors hover:border-forest-300 hover:bg-forest-100/40"
            >
              <Icon name="question" size={22} className="text-forest-700" />
              <span className="mt-4 font-serif text-[1.1rem] font-semibold text-forest-900">
                ప్రశ్నలు & సమాధానాలు
              </span>
              <span className="mt-1.5 text-sm text-ink-muted">
                బైబిల్ ఆధారంగా సమాధానాలు — ఇప్పటికే చదవగలరు.
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  )
}
