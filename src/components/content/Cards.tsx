import { Link } from 'react-router-dom'
import type { Article, Question } from '../../types/content'
import { formatTeluguDate, readingTimeLabel } from '../../utils/format'
import { Icon } from '../ui/Icon'
import { Badge } from '../ui/Section'

/* -------------------------------------------------------------------------- */
/*  Article card                                                               */
/* -------------------------------------------------------------------------- */

export function ArticleCard({ article, delay = 0 }: { article: Article; delay?: number }) {
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

      <h3 className="mt-3.5 text-[1.15rem] leading-snug text-forest-900 transition-colors group-hover:text-forest-700">
        <Link to={`/articles/${article.slug}`} className="after:absolute after:inset-0">
          {article.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
        {article.excerpt}
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
  return (
    <article
      data-reveal=""
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className="group relative flex h-full flex-col rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg"
    >
      <Badge tone="gold" className="self-start">
        {question.topic}
      </Badge>

      <h3 className="mt-3.5 font-serif text-[1.15rem] leading-snug text-forest-900 transition-colors group-hover:text-forest-700">
        <Link to={`/questions/${question.slug}`} className="after:absolute after:inset-0">
          {question.question}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
        {question.summary}
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
