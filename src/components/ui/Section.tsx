import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/* -------------------------------------------------------------------------- */
/*  Section heading                                                            */
/* -------------------------------------------------------------------------- */

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  /** Short supporting line under the title. */
  lede?: ReactNode
  /** Optional trailing action, usually a "view all" link. */
  action?: { label: string; to: string }
  align?: 'start' | 'center'
  as?: 'h2' | 'h3'
  className?: string
  id?: string
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  align = 'start',
  as: Tag = 'h2',
  className = '',
  id,
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <div
      className={`flex flex-col gap-4 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <Tag
          id={id}
          className="text-balance text-2xl text-forest-950 sm:text-[1.75rem] lg:text-3xl"
        >
          {title}
        </Tag>
        {lede ? (
          <p className="mt-3 text-ink-soft text-[0.98rem] leading-relaxed">{lede}</p>
        ) : null}
      </div>

      {action ? (
        <Link
          to={action.to}
          className="link-underline inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-500"
        >
          {action.label}
          <span aria-hidden="true" className="text-gold-600">
            →
          </span>
        </Link>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Reveal — opt-in scroll animation wrapper                                  */
/* -------------------------------------------------------------------------- */

interface RevealProps {
  children: ReactNode
  /** Stagger in milliseconds. */
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}

/**
 * Marks an element for the scroll-reveal observer set up in `useScrollReveal`.
 * If JavaScript never runs, `index.css` keeps the content visible — the
 * animation is an enhancement, never a gate on reading.
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: RevealProps) {
  return (
    <Tag
      data-reveal=""
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/*  Badge                                                                      */
/* -------------------------------------------------------------------------- */

interface BadgeProps {
  children: ReactNode
  tone?: 'neutral' | 'gold' | 'forest' | 'outline'
  className?: string
}

export function Badge({ children, tone = 'neutral', className = '' }: BadgeProps) {
  const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
    neutral: 'bg-cream-200 text-ink-soft',
    gold: 'bg-gold-100 text-gold-700',
    forest: 'bg-forest-100 text-forest-800',
    outline: 'border border-cream-400 text-ink-muted',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*  Empty state                                                                */
/* -------------------------------------------------------------------------- */

interface EmptyStateProps {
  title: string
  /** Honest explanation — never a fake success message. */
  description: ReactNode
  icon?: ReactNode
  action?: { label: string; to: string }
  className?: string
}

/**
 * Used wherever Satya Sakshi has not published content yet. Says so plainly
 * instead of inventing placeholders.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-dashed border-cream-400 bg-cream-50/70 px-6 py-12 text-center ${className}`}
    >
      {icon ? <div className="mb-4 flex justify-center text-gold-600">{icon}</div> : null}
      <h3 className="text-lg text-forest-900">{title}</h3>
      <div className="mx-auto mt-2.5 max-w-md text-sm text-ink-muted">{description}</div>
      {action ? (
        <Link
          to={action.to}
          className="mt-6 inline-flex min-h-10 items-center rounded-[var(--radius-md)] border border-forest-800/25 px-5 text-sm font-medium text-forest-800 transition-colors hover:bg-forest-100/60"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  )
}
