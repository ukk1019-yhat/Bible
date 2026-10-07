import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from './Icon'

/* -------------------------------------------------------------------------- */
/*  Breadcrumbs                                                                */
/* -------------------------------------------------------------------------- */

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null

  return (
    <nav aria-label="మార్గం" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-ink-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {item.to && !last ? (
                  <Link to={item.to} className="link-underline hover:text-forest-700">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={last ? 'page' : undefined} className="text-ink-soft">
                    {item.label}
                  </span>
                )}
              </li>
              {!last ? (
                <li aria-hidden="true" className="text-cream-400">
                  <Icon name="chevron-right" size={14} />
                </li>
              ) : null}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page header                                                                */
/* -------------------------------------------------------------------------- */

interface PageHeaderProps {
  eyebrow?: string
  title: string
  lede?: string
  /** Breadcrumb trail, rendered above the eyebrow. */
  crumbs?: Crumb[]
  icon?: IconName
  children?: React.ReactNode
  className?: string
}

/**
 * Shared header for every inner page. The `<h1>` lives here so each route has
 * exactly one — important for both screen readers and search engines.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  crumbs,
  icon,
  children,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`border-b border-cream-300 bg-cream-50 ${className}`}>
      <div className="shell py-10 sm:py-14">
        {crumbs?.length ? <Breadcrumbs items={crumbs} className="mb-6" /> : null}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="eyebrow mb-3 flex items-center gap-2">
                {icon ? <Icon name={icon} size={14} /> : null}
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-3xl text-forest-950 sm:text-4xl lg:text-[2.6rem]">{title}</h1>
            {lede ? (
              <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">{lede}</p>
            ) : null}
          </div>

          {children ? <div className="shrink-0">{children}</div> : null}
        </div>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  Prose — long-form reading typography                                       */
/* -------------------------------------------------------------------------- */

/**
 * Long-form body copy. Constrained to a comfortable measure with generous
 * leading, which matters more than usual for Telugu script.
 */
export function Prose({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`max-w-[var(--container-prose)] text-[1.05rem] leading-[1.95] text-ink-soft ${className}`}
    >
      {children}
    </div>
  )
}

export function ProseParagraph({ children }: { children: React.ReactNode }) {
  return <p className="mb-5">{children}</p>
}

/** Blockquote with an optional scripture reference in the margin. */
export function ProseQuote({
  children,
  reference,
}: {
  children: React.ReactNode
  reference?: string
}) {
  return (
    <figure className="my-7 border-s-2 border-gold-500 ps-5">
      <blockquote className="text-[1.1rem] leading-relaxed text-forest-900">
        {children}
      </blockquote>
      {reference ? (
        <figcaption className="mt-2 text-sm text-gold-700">{reference}</figcaption>
      ) : null}
    </figure>
  )
}
