import { Link } from 'react-router-dom'
import { site } from '../../config/site'

/**
 * Brand identity using the official Satya Sakshi logo.
 * The emblem displays the sacred cross with Holy Spirit flame and Bible,
 * while 'full' renders the complete official lockup.
 */
export function BrandMark({
  size = 52,
  variant = 'emblem',
  className = '',
}: {
  size?: number
  variant?: 'emblem' | 'full'
  className?: string
}) {
  const src =
    variant === 'full'
      ? '/brand/satyasakshi-logo-tight.png'
      : '/brand/satyasakshi-emblem.png'

  return (
    <span
      className={`shrink-0 inline-flex items-center justify-center overflow-hidden rounded-full bg-white shadow-xs ring-1 ring-gold-600/35 transition-transform duration-300 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img
        src={src}
        alt={site.brand.telugu}
        width={size}
        height={size}
        className="h-full w-full object-cover"
        loading="eager"
      />
    </span>
  )
}

/**
 * Renders the full official logo graphic lockup with high fidelity.
 */
export function FullBrandLogo({
  width = 320,
  className = '',
}: {
  width?: number
  className?: string
}) {
  return (
    <div
      className={`inline-flex flex-col items-center overflow-hidden rounded-2xl bg-white p-3 shadow-md ring-1 ring-gold-500/30 ${className}`}
      style={{ maxWidth: `${width}px` }}
    >
      <img
        src="/brand/satyasakshi-logo-tight.png"
        alt={`${site.brand.telugu} — ${site.brand.tagline}`}
        width={width}
        height={Math.round((width * 610) / 944)}
        className="h-auto w-full object-contain"
        loading="lazy"
      />
    </div>
  )
}

export function Wordmark({
  size = 'md',
  onDark = false,
  showTagline = true,
}: {
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
  showTagline?: boolean
}) {
  const telugu =
    size === 'sm'
      ? 'text-[1.05rem]'
      : size === 'lg'
        ? 'text-2xl sm:text-3xl'
        : 'text-[1.18rem] sm:text-[1.36rem]'
  const tagline =
    size === 'sm'
      ? 'text-[0.58rem]'
      : size === 'lg'
        ? 'text-xs'
        : 'text-[0.62rem] sm:text-[0.72rem]'

  return (
    <span className="flex flex-col leading-tight">
      <span
        className={`font-logo font-extrabold tracking-tight ${telugu} ${
          onDark ? 'text-cream-50' : 'text-forest-950'
        }`}
      >
        {site.brand.teluguSpaced}
      </span>
      {showTagline && (
        <span
          className={`mt-0.5 font-serif italic font-medium leading-none tracking-tight sm:tracking-normal truncate max-w-[210px] sm:max-w-none ${tagline} ${
            onDark ? 'text-gold-300/90' : 'text-stone-800'
          }`}
        >
          {site.brand.tagline}
        </span>
      )}
    </span>
  )
}

export function BrandLockup({
  size = 'md',
  onDark = false,
  markSize = 52,
  markVariant = 'emblem',
  showTagline = true,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
  markSize?: number
  markVariant?: 'emblem' | 'full'
  showTagline?: boolean
  className?: string
}) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-3 sm:gap-3.5 ${className}`}
      aria-label={`${site.brand.telugu} — ${site.brand.tagline} — ముఖ్య పేజీకి వెళ్ళండి`}
    >
      <BrandMark
        size={markSize}
        variant={markVariant}
        className="group-hover:scale-[1.05]"
      />
      <Wordmark size={size} onDark={onDark} showTagline={showTagline} />
    </Link>
  )
}
