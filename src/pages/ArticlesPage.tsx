import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  articleCategories,
  articles,
  getArticleBySlug,
} from '../data/content/articles'
import { ArticleCard } from '../components/content/Cards'
import { Icon } from '../components/ui/Icon'
import { PageHeader, Prose } from '../components/ui/Layout'
import { EmptyState, Reveal } from '../components/ui/Section'
import { formatTeluguDate, readingTimeLabel } from '../utils/format'
import { graph, useSeo } from '../hooks/useSeo'
import NotFoundPage from './NotFoundPage'

export function ArticlesPage() {
  const [category, setCategory] = useState<string | null>(null)

  useSeo({
    title: 'వ్యాసాలు — విశ్వాసం, ప్రార్థన, ఆత్మీయ జీవితం',
    description:
      'విశ్వాసం, ప్రార్థన, ఆత్మీయ జీవితం గురించి తెలుగు క్రైస్తవ వ్యాసాలు — సత్యసాక్షి నుండి.',
    path: '/articles',
  })

  const visible = useMemo(
    () =>
      category
        ? articles.filter((article) => article.category.slug === category)
        : articles,
    [category],
  )

  return (
    <>
      <PageHeader
        eyebrow="వ్యాసాలు"
        title="వ్యాసాలు"
        icon="book"
        lede="బైబిల్ ఆధారంగా ఆలోచించడానికి సహాయపడే సంక్షిప్త వ్యాసాలు."
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'వ్యాసాలు' }]}
      />

      <div className="shell py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-center gap-2">
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
            అన్నీ ({articles.length})
          </button>

          {articleCategories.map((item) => (
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
              {item.telugu} ({articles.filter((a) => a.category.slug === item.slug).length})
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={<Icon name="book" size={26} />}
            title="ఈ అంశంలో వ్యాసాలు ఇంకా లేవు"
            description="ఈ విభాగంలో వ్యాసాలు త్వరలో ప్రచురిస్తాము."
            action={{ label: 'అన్ని వ్యాసాలు', to: '/articles' }}
          />
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((article, index) => (
              <li key={article.slug}>
                <ArticleCard article={article} delay={index * 60} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export function ArticleRoute() {
  const { slug = '' } = useParams()
  const article = getArticleBySlug(slug)

  useSeo({
    title: article ? `${article.title} — వ్యాసాలు` : 'వ్యాసం కనబడలేదు',
    description: article?.excerpt ?? 'ఈ వ్యాసం ఈ పేజీలో లేదు.',
    path: `/articles/${slug}`,
    type: 'article',
    jsonLd:
      article && article.status === 'published'
        ? graph({
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            inLanguage: 'te-IN',
            datePublished: article.publishedAt,
            author: { '@type': 'Organization', name: 'సత్యసాక్షి' },
          })
        : undefined,
  })

  if (!article) return <NotFoundPage />

  return (
    <>
      <PageHeader
        eyebrow={article.category.telugu}
        title={article.title}
        crumbs={[
          { label: 'హోమ్', to: '/' },
          { label: 'వ్యాసాలు', to: '/articles' },
          { label: article.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted">
          {article.publishedAt ? (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="calendar" size={14} />
              {formatTeluguDate(article.publishedAt)}
            </span>
          ) : null}
          {article.readingMinutes ? (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" size={14} />
              {readingTimeLabel(article.readingMinutes)}
            </span>
          ) : null}
        </div>
      </PageHeader>

      <div className="shell py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,44rem)_17rem] lg:items-start lg:gap-16">
          <article>
            <p className="border-s-2 border-gold-500 ps-5 text-[1.2rem] leading-relaxed text-forest-900">
              {article.excerpt}
            </p>

            {article.body ? (
              <Prose className="mt-9">
                {article.body.map((block, index) => {
                  if (block.type === 'h2') {
                    return (
                      <h2 key={index} className="mb-4 mt-9 text-xl text-forest-950">
                        {block.text}
                      </h2>
                    )
                  }
                  if (block.type === 'quote') {
                    return (
                      <figure key={index} className="my-7 border-s-2 border-gold-500 ps-5">
                        <blockquote className="text-[1.1rem] leading-relaxed text-forest-900">
                          {block.text}
                        </blockquote>
                        {block.reference ? (
                          <figcaption className="mt-2 text-sm text-gold-700">
                            {block.reference}
                          </figcaption>
                        ) : null}
                      </figure>
                    )
                  }
                  if (block.type === 'list') {
                    return (
                      <ul key={index} className="mb-5 list-disc space-y-2 ps-6">
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )
                  }
                  return (
                    <p key={index} className="mb-5">
                      {block.text}
                    </p>
                  )
                })}
              </Prose>
            ) : (
              <Reveal className="mt-9">
                <EmptyState
                  icon={<Icon name="sparkle" size={26} />}
                  title="ఈ వ్యాసం ఇంకా పూర్తి కాలేదు"
                  description={
                    <>
                      <p>
                        సత్యసాక్షి ఈ వ్యాసాన్ని ప్రారంభించి, ఇంకా పూర్తి చేయాలని ఉంది. ఇప్పటికి
                        ప్రచురించిన భాగం మీరు పైన చదివిందే.
                      </p>
                      <p className="mt-3">
                        ఈ అంశంలోని మిగతా వ్యాసాలను{' '}
                        <Link to="/articles" className="link-underline text-forest-700">
                          ఇక్కడ
                        </Link>{' '}
                        చూడగలరు. బైబిల్ ఆధారంగా వివరణ కావాలంటే{' '}
                        <Link to="/questions" className="link-underline text-forest-700">
                          ప్రశ్నలు & సమాధానాలు
                        </Link>{' '}
                        చూడండి.
                      </p>
                    </>
                  }
                />
              </Reveal>
            )}
          </article>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-5">
              <h2 className="text-sm font-semibold text-forest-900">ఇతర వ్యాసాలు</h2>
              <ul className="mt-4 space-y-3">
                {articles
                  .filter((item) => item.slug !== article.slug)
                  .map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/articles/${item.slug}`}
                        className="group flex items-start gap-2 text-[0.95rem] text-forest-800 transition-colors hover:text-forest-600"
                      >
                        <Icon
                          name="chevron-right"
                          size={16}
                          className="mt-1 shrink-0 text-gold-600 transition-transform group-hover:translate-x-0.5"
                        />
                        <span className="link-underline">{item.title}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
