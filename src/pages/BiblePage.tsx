import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BIBLE_BOOKS } from '../data/bible/books.generated'
import { BookGrid } from '../components/bible/BookGrid'
import { Icon } from '../components/ui/Icon'
import { SearchField } from '../components/ui/SearchField'
import { PageHeader, Prose } from '../components/ui/Layout'
import { SectionHeading, Reveal } from '../components/ui/Section'
import { useBookmarks } from '../hooks/useBookmarks'
import { graph, useSeo } from '../hooks/useSeo'

const totals = {
  books: BIBLE_BOOKS.length,
  chapters: BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0),
  verses: BIBLE_BOOKS.reduce((sum, b) => sum + b.verses, 0),
}

/** Frequently opened books, in the order a new reader tends to look for them. */
const START_HERE = ['john', 'matthew', 'psalms', 'genesis', 'acts', 'proverbs']

export function BiblePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { bookmarks, remove } = useBookmarks()

  useSeo({
    title: 'తెలుగు బైబిల్ — అధ్యాయం వారీగా చదవండి',
    description:
      'పరిశుద్ధ తెలుగు బైబిల్‌ను 66 పుస్తకాలు, 1,189 అధ్యాయాలు, 31,101 వాక్యాలతో అధ్యాయం వారీగా చదవండి. వాక్యాన్ని వెతకండి, భద్రపరచండి, భాగం చేయండి.',
    path: '/bible',
    jsonLd: graph({
      '@type': 'Book',
      name: 'తెలుగు బైబిల్',
      alternateName: 'Telugu Bible (BSI)',
      inLanguage: 'te-IN',
      description:
        'పరిశుద్ధ బైబిల్ — 66 పుస్తకాలు, 1,189 అధ్యాయాలు, 31,101 వాక్యాలు.',
      isPartOf: { '@type': 'WebSite', name: 'సత్యసాక్షి', url: 'https://satyasakshi.in/bible' },
    }),
  })

  const submit = () => {
    const q = query.trim()
    if (!q) return
    void navigate(`/bible/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <PageHeader
        eyebrow="పరిశుద్ధ బైబిల్"
        title="తెలుగు బైబిల్"
        icon="book-open"
        lede="దేవుని వాక్యాన్ని అధ్యాయం వారీగా, సూచనలతో చదవండి. పుస్తకాన్ని ఎంచుకోండి, అధ్యాయాన్ని తెరవండి."
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'బైబిల్' }]}
      >
        <dl className="flex gap-8 sm:gap-10">
          {[
            { label: 'పుస్తకాలు', value: totals.books.toLocaleString('te-IN') },
            { label: 'అధ్యాయాలు', value: totals.chapters.toLocaleString('te-IN') },
            { label: 'వాక్యాలు', value: totals.verses.toLocaleString('te-IN') },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-2xs uppercase tracking-[0.14em] text-ink-muted">
                {item.label}
              </dt>
              <dd className="mt-1 font-serif text-2xl text-forest-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <div className="shell py-12 sm:py-16">
        {/* Full-text search entry */}
        <Reveal className="mb-14">
          <div className="rounded-[var(--radius-xl)] border border-cream-300 bg-cream-50 p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <div>
                <h2 className="text-xl text-forest-950">బైబిల్‌లో వెతకండి</h2>
                <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
                  మీరు జాగ్రత్తగా వాడిన పదాన్ని టైప్ చేయండి — అది ఎక్కడ ఉందో, ఎన్ని
                  సార్లు వచ్చిందో చూపిస్తాము.
                </p>
              </div>

              <SearchField
                label="బైబిల్‌లో వెతకండి"
                hideLabel
                placeholder="ఉదా: దేవుడు ప్రేమ"
                value={query}
                onChange={setQuery}
                onSubmit={submit}
                size="lg"
              />
            </div>
          </div>
        </Reveal>

        {/* Saved verses */}
        {bookmarks.length > 0 ? (
          <section className="mb-14" aria-labelledby="saved-verses">
            <SectionHeading
              as="h2"
              id="saved-verses"
              title="మీరు భద్రపరచిన అధ్యాయాలు"
              lede="ఈ వాక్యాలు మీ బ్రౌజర్‌లోనే ఉంటాయి. ఎక్కడికీ పంపబడవు."
            />

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {bookmarks.map((bookmark) => (
                <li
                  key={`${bookmark.slug}-${bookmark.chapter}`}
                  className="flex items-start gap-4 rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 p-4"
                >
                  <Icon name="bookmark" size={18} className="mt-1 shrink-0 text-gold-600" />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/bible/${bookmark.slug}/${bookmark.chapter}`}
                      className="link-underline text-[0.95rem] font-medium text-forest-900"
                    >
                      {bookmark.bookTelugu} {bookmark.chapter}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
                      {bookmark.preview}…
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(bookmark.slug, bookmark.chapter)}
                    className="shrink-0 rounded-[var(--radius-xs)] p-1.5 text-ink-muted transition-colors hover:bg-cream-200 hover:text-forest-800"
                  >
                    <Icon name="close" size={15} />
                    <span className="sr-only">
                      {bookmark.bookTelugu} {bookmark.chapter} తొలగించు
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Start here */}
        <Reveal className="mb-14">
          <SectionHeading
            as="h2"
            title="మొదట ఇక్కడి నుండి"
            lede="మొదటి సారి బైబిల్ చదవేవారికి ఈ పుస్తకాలతో మొదలుపెట్టండి."
          />
          <ul className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {START_HERE.map((slug) => {
              const book = BIBLE_BOOKS.find((b) => b.slug === slug)
              if (!book) return null
              return (
                <li key={slug}>
                  <Link
                    to={`/bible/${slug}`}
                    className="flex h-full flex-col justify-between gap-3 rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 px-4 py-4 transition-colors hover:border-forest-300 hover:bg-forest-100/50"
                  >
                    <span className="font-serif text-[1rem] font-semibold text-forest-900">
                      {book.telugu}
                    </span>
                    <span className="text-xs text-ink-muted">{book.chapters} అధ్యాయాలు</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Reveal>

        {/* All books */}
        <Reveal>
          <SectionHeading
            as="h2"
            title="అన్ని పుస్తకాలు"
            lede="పరిశుద్ధ బైబిల్ మరియు నూతన నిబంధనం — మొత్తం 66 పుస్తకాలు."
          />
          <div className="mt-8">
            <BookGrid highlightSlugs={START_HERE} />
          </div>
        </Reveal>

        {/* Text source */}
        <Reveal className="mt-16">
          <Prose className="border-t border-cream-300 pt-8 text-sm">
            <p className="text-ink-muted">
              ఈ పేజీలోని వాక్యం తెలుగు బైబిల్ (BSI) అనే పాఠ్యం నుండి తీసుకోబడింది. ఆ పాఠ్యం{' '}
              <a
                href="https://github.com/sajeevavahini/bibles"
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline text-forest-700"
              >
                Sajeeva Vahini
              </a>{' '}
              అనే సంస్థ సమకూలంగా అందుబాటులో ఉంచింది. వాక్యాలు ఇక్కడ నుండి అనుకరించబడవు;
              ప్రతి అధ్యాయం మీరు తెరిచినప్పుడు మాత్రమే లోడ్ అవుతుంది.
            </p>
          </Prose>
        </Reveal>
      </div>
    </>
  )
}
