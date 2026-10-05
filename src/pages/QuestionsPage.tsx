import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getQuestionBySlug,
  getRelatedQuestions,
  questions,
  questionTopics,
} from '../data/content/questions'
import { ScriptureBlock } from '../components/bible/ScriptureBlock'
import { QuestionCard } from '../components/content/Cards'
import { Icon } from '../components/ui/Icon'
import { PageHeader, Prose } from '../components/ui/Layout'
import { Badge, EmptyState, Reveal } from '../components/ui/Section'
import { SearchField } from '../components/ui/SearchField'
import { useDebounced } from '../hooks/useUi'
import { graph, useSeo } from '../hooks/useSeo'
import { matchesAllTokens } from '../utils/text'
import NotFoundPage from './NotFoundPage'

export function QuestionsPage() {
  const [topic, setTopic] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const query = useDebounced(input, 180)

  useSeo({
    title: 'ప్రశ్నలు & సమాధానాలు — బైబిల్ ఆధారంగా',
    description:
      'దేవుడు ఎవరు, రక్షణ ఏమిటి, బైబిల్ ఎందుకు చదవాలి — బైబిల్ వాక్యాలతో సమాధానాలు. తెలుగు క్రైస్తవ ప్రశ్నలకు స్పష్టమైన సమాధానాలు.',
    path: '/questions',
    jsonLd: graph({
      '@type': 'FAQPage',
      mainEntity: questions.map((question) => ({
        '@type': 'Question',
        name: question.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${question.summary} ${question.answer
            .flatMap((section) => section.paragraphs)
            .join(' ')}`,
        },
      })),
    }),
  })

  const visible = useMemo(
    () =>
      questions.filter((question) => {
        if (topic && question.topic !== topic) return false
        if (!query.trim()) return true
        return matchesAllTokens(
          `${question.question} ${question.summary} ${question.topic}`,
          query,
        )
      }),
    [topic, query],
  )

  return (
    <>
      <PageHeader
        eyebrow="ప్రశ్నలు & సమాధానాలు"
        title="మీ ప్రశ్నకు సమాధానం ఇక్కడే"
        icon="question"
        lede="ప్రతి సమాధానం బైబిల్ వాక్యంతో ముందుచేయబడింది. మీరు కూడా ప్రశ్న పెట్టాలంటే సంప్రదించండి."
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'ప్రశ్నలు & సమాధానాలు' }]}
      />

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-14">
          {/* Filters */}
          <aside className="lg:sticky lg:top-24">
            <SearchField
              label="ప్రశ్నలు వెతకండి"
              hideLabel
              placeholder="ఉదా: ప్రార్థన"
              value={input}
              onChange={setInput}
            />

            <nav aria-label="అంశాల ప్రకారం" className="mt-6">
              <h2 className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                అంశం
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                <li>
                  <button
                    type="button"
                    onClick={() => setTopic(null)}
                    aria-pressed={topic === null}
                    className={`min-h-9 rounded-full px-3.5 text-sm transition-colors ${
                      topic === null
                        ? 'bg-forest-800 font-medium text-cream-50'
                        : 'bg-cream-200 text-ink-soft hover:bg-cream-300'
                    }`}
                  >
                    అన్నీ ({questions.length})
                  </button>
                </li>
                {questionTopics.map((item) => {
                  const count = questions.filter((q) => q.topic === item).length
                  return (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => setTopic(item)}
                        aria-pressed={topic === item}
                        className={`min-h-9 rounded-full px-3.5 text-sm transition-colors ${
                          topic === item
                            ? 'bg-forest-800 font-medium text-cream-50'
                            : 'bg-cream-200 text-ink-soft hover:bg-cream-300'
                        }`}
                      >
                        {item} ({count})
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>

          {/* Results */}
          <section aria-label="ప్రశ్నల జాబితా">
            {visible.length === 0 ? (
              <EmptyState
                icon={<Icon name="search" size={26} />}
                title="ఏ ప్రశ్నా కనబడలేదు"
                description="వేరే పదంతో ప్రయత్నించండి లేదా అన్ని అంశాలను చూడండి."
                action={{ label: 'అన్ని ప్రశ్నలు', to: '/questions' }}
              />
            ) : (
              <>
                <p className="mb-6 text-sm text-ink-muted" role="status" aria-live="polite">
                  {visible.length} ప్రశ్నలు
                </p>

                <ul className="grid gap-4 md:grid-cols-2">
                  {visible.map((question, index) => (
                    <li key={question.slug}>
                      <QuestionCard question={question} delay={index * 50} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  )
}

/** Route wrapper — validates the slug before the SEO hook resolves a title. */
export function QuestionRoute() {
  const { slug = '' } = useParams()
  const question = getQuestionBySlug(slug)

  useSeo({
    title: question ? `${question.question} — ప్రశ్నలు & సమాధానాలు` : 'ప్రశ్న కనబడలేదు',
    description: question ? question.summary : 'ఈ ప్రశ్న ఈ పేజీలో లేదు.',
    path: `/questions/${slug}`,
  })

  if (!question) return <NotFoundPage />
  return <QuestionView question={question} />
}

function QuestionView({ question }: { question: (typeof questions)[number] }) {
  const related = getRelatedQuestions(question.slug)

  return (
    <>
      <PageHeader
        eyebrow={question.topic}
        title={question.question}
        crumbs={[
          { label: 'హోమ్', to: '/' },
          { label: 'ప్రశ్నలు & సమాధానాలు', to: '/questions' },
          { label: question.question },
        ]}
      />

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,44rem)_17rem] lg:items-start lg:gap-16">
          <article>
            <p className="border-s-2 border-gold-500 ps-5 font-serif text-[1.2rem] leading-relaxed text-forest-900">
              {question.summary}
            </p>

            <Prose className="mt-10">
              {question.answer.map((section) => (
                <section key={section.heading} className="mb-10 last:mb-0">
                  <h2 className="mb-4 text-xl text-forest-950">{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mb-5">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </Prose>

            {/* Every verse cited in the answer, pulled from the reader itself. */}
            <section className="mt-14 border-t border-cream-300 pt-10" aria-labelledby="cited">
              <h2 id="cited" className="text-lg text-forest-950">
                ఈ సమాధానంలో సూచించిన వాక్యాలు
              </h2>
              <div className="mt-5 space-y-2">
                {question.verses.map((reference) => (
                  <ScriptureBlock
                    key={`${reference.bookSlug}-${reference.chapter}-${reference.verseStart}`}
                    reference={reference}
                    size="sm"
                  />
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-5">
              <h2 className="text-sm font-semibold text-forest-900">మీకు కూడా ప్రశ్న ఉందా?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                బైబిల్ ఆధారంగా సమాధానం కావాలి? మా బైబిల్ సందేశాల్లో వివరణ ఉంది.
              </p>
              <Link
                to="/messages"
                className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700"
              >
                సందేశాలు చూడండి
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>

            {related.length > 0 ? (
              <nav aria-label="సంబంధిత ప్రశ్నలు">
                <h2 className="text-2xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  సంబంధిత ప్రశ్నలు
                </h2>
                <ul className="mt-4 space-y-3">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/questions/${item.slug}`}
                        className="group flex items-start gap-2 text-[0.95rem] text-forest-800 transition-colors hover:text-forest-600"
                      >
                        <Icon
                          name="chevron-right"
                          size={16}
                          className="mt-1 shrink-0 text-gold-600 transition-transform group-hover:translate-x-0.5"
                        />
                        <span className="link-underline">{item.question}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            <Reveal>
              <Badge tone="outline" className="whitespace-normal text-left">
                సమాధానం బైబిల్ (BSI) వాక్యంపై ఆధారపడును.
              </Badge>
            </Reveal>
          </aside>
        </div>
      </div>
    </>
  )
}
