import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { articles } from '../data/content/articles'
import { books } from '../data/content/books'
import { questions } from '../data/content/questions'
import { videos } from '../data/content/videos'
import { Icon, type IconName } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/Layout'
import { Badge, Reveal } from '../components/ui/Section'
import { SearchField } from '../components/ui/SearchField'
import { useDebounced } from '../hooks/useUi'
import { useSeo } from '../hooks/useSeo'
import { matchesAllTokens } from '../utils/text'

interface Result {
  kind: 'ప్రశ్న' | 'వ్యాసం' | 'వీడియో' | 'పుస్తకం'
  title: string
  snippet: string
  to: string
  icon: IconName
  badge?: string
}

/**
 * Platform-wide search across the site's own content.
 *
 * Bible text search lives at /bible/search and is offered as a separate action,
 * because scanning the whole canon behaves very differently from matching a
 * few hundred titles — mixing them would make both feel slow.
 */
export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const urlQuery = params.get('q') ?? ''
  const input = useDebounced(urlQuery, 180)

  useSeo({
    title: 'అన్వేషించండి',
    description: 'సత్యసాక్షి వేదికలోని ప్రశ్నలు, వ్యాసాలు, సందేశాలు, పుస్తకాలను వెతకండి.',
    path: '/search',
    noIndex: true,
  })

  const results = useMemo<Result[]>(() => {
    if (!input.trim()) return []

    const found: Result[] = []

    for (const question of questions) {
      if (
        matchesAllTokens(
          `${question.question} ${question.summary} ${question.topic}`,
          input,
        )
      ) {
        found.push({
          kind: 'ప్రశ్న',
          title: question.question,
          snippet: question.summary,
          to: `/questions/${question.slug}`,
          icon: 'question',
          badge: question.topic,
        })
      }
    }

    for (const article of articles) {
      if (matchesAllTokens(`${article.title} ${article.excerpt}`, input)) {
        found.push({
          kind: 'వ్యాసం',
          title: article.title,
          snippet: article.excerpt,
          to: `/articles/${article.slug}`,
          icon: 'book',
          badge: article.category.telugu,
        })
      }
    }

    for (const video of videos) {
      if (
        matchesAllTokens(
          `${video.title} ${video.description ?? ''} ${video.category} ${video.scripture ?? ''}`,
          input,
        )
      ) {
        found.push({
          kind: 'వీడియో',
          title: video.title,
          snippet: video.description ?? video.category,
          to: `/videos/${video.slug}`,
          icon: 'play',
          badge: video.category,
        })
      }
    }

    for (const book of books) {
      if (matchesAllTokens(`${book.title} ${book.author ?? ''}`, input)) {
        found.push({
          kind: 'పుస్తకం',
          title: book.title,
          snippet: book.description ?? book.category.telugu,
          to: `/books/${book.slug}`,
          icon: 'stack',
          badge: book.category.telugu,
        })
      }
    }

    return found
  }, [input])

  const setQuery = (value: string) => {
    setParams(value.trim() ? { q: value } : {}, { replace: true })
  }

  return (
    <>
      <PageHeader
        eyebrow="అన్వేషణ"
        title="వేదికలో వెతకండి"
        icon="search"
        lede="ప్రశ్నలు, వ్యాసాలు, సందేశాలు, పుస్తకాల్లో వెతకండి. బైబిల్ వాక్యంలో కూడా వెతకవచ్చు."
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'వెతకండి' }]}
      />

      <div className="shell py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <SearchField
            label="ఈ వేదికలో వెతకండి"
            hideLabel
            autoFocus
            size="lg"
            placeholder="ఉదా: ప్రార్థన, రక్షణ, బైబిల్"
            value={input}
            onChange={setQuery}
          />

          <div className="mt-10">
            {!input.trim() ? (
              <div className="rounded-[var(--radius-lg)] border border-dashed border-cream-400 bg-cream-50 px-6 py-14 text-center">
                <h2 className="text-lg text-forest-900">ఏది వెతకాలనుకుంటున్నారు?</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                  పైన టైప్ చేయడం మొదలుపెట్టండి. బైబిల్ వాక్యం కోసం ప్రత్యేక అన్వేషణ ఉంది.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-[var(--radius-lg)] border border-dashed border-cream-400 bg-cream-50 px-6 py-14 text-center">
                <h2 className="text-lg text-forest-900">ఏమీ దొరకలేదు</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                  “{input}” గురించి ఈ వేదికలో ఇంకా వ్యాసాలు లేదు సందేశాలు లేవు. బైబిల్
                  వాక్యంలో వెతకవచ్చు.
                </p>
                <Link
                  to={`/bible/search?q=${encodeURIComponent(input)}`}
                  className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700"
                >
                  బైబిల్‌లో వెతకండి
                  <Icon name="arrow-right" size={15} />
                </Link>
              </div>
            ) : (
              <>
                <p className="mb-6 text-sm text-ink-muted" role="status" aria-live="polite">
                  {results.length} ఫలితాలు
                </p>

                <ul className="space-y-3">
                  {results.map((result) => (
                    <li key={`${result.kind}-${result.to}`}>
                      <Link
                        to={result.to}
                        className="group flex items-start gap-4 rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 p-4 transition-colors hover:border-forest-300 hover:bg-forest-100/40"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-forest-100 text-forest-700">
                          <Icon name={result.icon} size={18} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <Badge tone="outline">{result.kind}</Badge>
                            {result.badge ? (
                              <span className="text-xs text-ink-muted">{result.badge}</span>
                            ) : null}
                          </span>
                          <span className="mt-1.5 block text-[1.02rem] font-medium text-forest-900">
                            {result.title}
                          </span>
                          <span className="mt-1 block text-sm text-ink-muted">
                            {result.snippet}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Reveal className="mt-8">
                  <div className="rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-6 text-center">
                    <p className="text-sm text-ink-soft">
                      బైబిల్ వాక్యంలో వెతకాలనుకుంటున్నారా?
                    </p>
                    <Link
                      to={`/bible/search?q=${encodeURIComponent(input)}`}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] bg-forest-800 px-5 text-[0.95rem] font-medium text-cream-50 transition-colors hover:bg-forest-700"
                    >
                      <Icon name="book-open" size={17} />
                      బైబిల్‌లో వెతకండి
                    </Link>
                  </div>
                </Reveal>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
