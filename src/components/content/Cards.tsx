import { Link } from 'react-router-dom'
import type { Article, Question } from '../../types/content'
import { formatTeluguDate, readingTimeLabel } from '../../utils/format'
import { Icon } from '../ui/Icon'
import { Badge } from '../ui/Section'
import { trackContentClick } from '../../services/analyticsService'

/* -------------------------------------------------------------------------- */
/*  Article card                                                               */
/* -------------------------------------------------------------------------- */

export function ArticleCard({
  article,
  delay = 0,
  variant = 'grid',
}: {
  article: Article
  delay?: number
  variant?: 'grid' | 'justify' | 'list'
}) {
  const handleClick = () => {
    trackContentClick('articles', article.slug, article.title, 'click', `/articles/${article.slug}`)
  }

  const cleanExcerpt = article.excerpt
    ? article.excerpt.replace(/\r\n/g, ' ').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
    : ''

  if (variant === 'justify') {
    return (
      <article
        data-reveal=""
        style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
        className="group relative flex h-full flex-col justify-between rounded-[var(--radius-xl)] border border-cream-300 bg-cream-50 p-6 sm:p-7 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg"
      >
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-200/80 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="forest">{article.category.telugu}</Badge>
              {article.publishedAt ? (
                <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                  <Icon name="calendar" size={13} />
                  {formatTeluguDate(article.publishedAt)}
                </span>
              ) : null}
            </div>
            {article.readingMinutes ? (
              <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                <Icon name="clock" size={13} />
                {readingTimeLabel(article.readingMinutes)}
              </span>
            ) : null}
          </div>

          <h3 className="mt-4 text-[1.22rem] font-serif font-semibold leading-snug text-forest-950 transition-colors group-hover:text-forest-700 [text-align:justify] [text-justify:inter-word]">
            <Link
              to={`/articles/${article.slug}`}
              onClick={handleClick}
              className="after:absolute after:inset-0"
            >
              {article.title}
            </Link>
          </h3>

          <p className="mt-3.5 text-justify text-[0.98rem] leading-relaxed text-ink-soft [text-align:justify] [text-justify:inter-word]">
            {cleanExcerpt}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-cream-200/80 pt-4">
          <span className="text-xs text-ink-muted">సంక్షిప్త వ్యాసం</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 group-hover:text-forest-900">
            వ్యాసం చదవండి
            <Icon
              name="arrow-right"
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </div>
      </article>
    )
  }

  if (variant === 'list') {
    return (
      <article
        data-reveal=""
        style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
        className="group relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-md"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="forest">{article.category.telugu}</Badge>
            {article.publishedAt ? (
              <span className="text-xs text-ink-muted">
                {formatTeluguDate(article.publishedAt)}
              </span>
            ) : null}
            {article.readingMinutes ? (
              <span className="text-xs text-ink-muted">
                · {readingTimeLabel(article.readingMinutes)}
              </span>
            ) : null}
          </div>

          <h3 className="mt-2 text-[1.12rem] font-serif font-semibold text-forest-950 transition-colors group-hover:text-forest-700 [text-align:justify] [text-justify:inter-word]">
            <Link
              to={`/articles/${article.slug}`}
              onClick={handleClick}
              className="after:absolute after:inset-0"
            >
              {article.title}
            </Link>
          </h3>

          <p className="mt-2 line-clamp-2 text-justify text-sm leading-relaxed text-ink-soft [text-align:justify] [text-justify:inter-word]">
            {cleanExcerpt}
          </p>
        </div>

        <div className="shrink-0 self-end sm:self-center">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 group-hover:translate-x-1 transition-transform">
            చదవండి
            <Icon name="arrow-right" size={14} />
          </span>
        </div>
      </article>
    )
  }

  return (
    <article
      data-reveal=""
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className="group relative flex h-full flex-col rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="forest">{article.category.telugu}</Badge>
        {article.publishedAt ? (
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
            <Icon name="calendar" size={13} />
            {formatTeluguDate(article.publishedAt)}
          </span>
        ) : null}
        {article.readingMinutes ? (
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
            <Icon name="clock" size={13} />
            {readingTimeLabel(article.readingMinutes)}
          </span>
        ) : null}
      </div>

      <h3 className="mt-3.5 text-[1.15rem] leading-snug text-forest-900 transition-colors group-hover:text-forest-700 [text-align:justify] [text-justify:inter-word]">
        <Link
          to={`/articles/${article.slug}`}
          onClick={handleClick}
          className="after:absolute after:inset-0"
        >
          {article.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-justify text-[0.95rem] leading-relaxed text-ink-soft [text-align:justify] [text-justify:inter-word]">
        {cleanExcerpt}
      </p>

      <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700">
        చదవండి
        <Icon
          name="arrow-right"
          size={15}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </p>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/*  Question card                                                              */
/* -------------------------------------------------------------------------- */

export function QuestionCard({ question, delay = 0 }: { question: Question; delay?: number }) {
  const handleClick = () => {
    trackContentClick('questions', question.slug, question.question, 'click', `/questions/${question.slug}`)
  }

  const cleanSummary = question.summary
    ? question.summary.replace(/\r\n/g, ' ').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
    : ''

  return (
    <article
      data-reveal=""
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className="group relative flex h-full flex-col rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg"
    >
      <Badge tone="gold" className="self-start">
        {question.topic}
      </Badge>

      <h3 className="mt-3.5 font-serif text-[1.15rem] leading-snug text-forest-900 transition-colors group-hover:text-forest-700 [text-align:justify] [text-justify:inter-word]">
        <Link
          to={`/questions/${question.slug}`}
          onClick={handleClick}
          className="after:absolute after:inset-0"
        >
          {question.question}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-justify text-[0.95rem] leading-relaxed text-ink-soft [text-align:justify] [text-justify:inter-word]">
        {cleanSummary}
      </p>

      <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700">
        సమాధానం చదవండి
        <Icon
          name="arrow-right"
          size={15}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </p>
    </article>
  )
}
