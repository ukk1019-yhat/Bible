import { Link } from 'react-router-dom'
import { site } from '../../config/site'

/**
 * Brand identity using the official Satya Sakshi logo.
 */
export function BrandMark({ size = 52, className = '' }: { size?: number; className?: string }) {
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
  const telugu = size === 'sm' ? 'text-base' : 'text-[1.28rem]'
  const english = size === 'sm' ? 'text-[0.64rem]' : 'text-[0.72rem]'

  return (
    <span className="flex flex-col leading-tight">
      <span
        className={`font-logo font-bold tracking-tight ${telugu} ${
          onDark ? 'text-cream-50' : 'text-forest-900'
        }`}
      >
        {site.brand.telugu}
      </span>
      <span
        className={`mt-0.5 font-sans font-medium uppercase tracking-[0.22em] ${english} ${
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
  markSize = 52,
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
      className={`group inline-flex items-center gap-3.5 ${className}`}
      aria-label={`${site.brand.telugu} — ముఖ్య పేజీకి వెళ్ళండి`}
    >
      <BrandMark size={markSize} className="shrink-0 transition-transform duration-300 group-hover:scale-[1.05]" />
      <Wordmark size={size} onDark={onDark} />
    </Link>
  )
}
