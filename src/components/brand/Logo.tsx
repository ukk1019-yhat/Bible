import { Link } from 'react-router-dom'
import { site } from '../../config/site'

/**
 * Brand identity using the official Satya Sakshi logo.
 */
export function BrandMark({ size = 42, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/brand/satyasakshi-logo-original.png"
      alt={site.brand.telugu}
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover shadow-sm ring-1 ring-gold-600/40 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      loading="eager"
    />
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
