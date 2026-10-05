import { Link } from 'react-router-dom'
import { site } from '../../config/site'

/**
 * Brand identity.
 *
 * The original Satya Sakshi logo is an opaque near-black square raster, which
 * reads as a heavy blob in a light editorial header. So the header uses a
 * compact drawn mark plus a Telugu wordmark: same name, same promise, far
 * lighter. The original file is still preserved at
 * `public/brand/satyasakshi-logo-original.png` for print and OG use.
 */
export function BrandMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="40" height="40" rx="10" fill="var(--color-forest-800)" />
      <g
        fill="none"
        stroke="var(--color-gold-400)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 12.5c-2.6-2-5.4-2.8-8.5-2.8v14c3.1 0 5.9.8 8.5 2.8" />
        <path d="M20 12.5c2.6-2 5.4-2.8 8.5-2.8v14c-3.1 0-5.9.8-8.5 2.8" />
        <path d="M20 12.5v14" />
        <path d="M20 26.5v4" />
      </g>
    </svg>
  )
}

export function Wordmark({
  size = 'md',
  onDark = false,
}: {
  size?: 'sm' | 'md'
  onDark?: boolean
}) {
  const telugu = size === 'sm' ? 'text-base' : 'text-lg'
  const english = size === 'sm' ? 'text-[0.62rem]' : 'text-[0.68rem]'

  return (
    <span className="flex flex-col leading-none">
      <span
        className={`font-serif font-bold tracking-tight ${telugu} ${
          onDark ? 'text-cream-50' : 'text-forest-900'
        }`}
      >
        {site.brand.telugu}
      </span>
      <span
        className={`mt-1 font-sans font-medium uppercase tracking-[0.22em] ${english} ${
          onDark ? 'text-gold-400/85' : 'text-gold-700'
        }`}
      >
        Satya Sakshi
      </span>
    </span>
  )
}

export function BrandLockup({
  size = 'md',
  onDark = false,
  markSize = 36,
  className = '',
}: {
  size?: 'sm' | 'md'
  onDark?: boolean
  markSize?: number
  className?: string
}) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label={`${site.brand.telugu} — ముఖ్య పేజీకి వెళ్ళండి`}
    >
      <BrandMark size={markSize} className="shrink-0 transition-transform duration-300 group-hover:scale-[1.04]" />
      <Wordmark size={size} onDark={onDark} />
    </Link>
  )
}
