import { Link } from 'react-router-dom'
import { site } from '../../config/site'

/**
 * Brand identity using the official Satya Sakshi logo.
 * Renders the complete, uncropped official artwork with zero clipping.
 */
export function BrandMark({
  size = 52,
  variant = 'full',
  className = '',
}: {
  size?: number
  variant?: 'emblem' | 'full' | 'original'
  className?: string
}) {
  const src =
    variant === 'original'
      ? '/brand/satyasakshi-logo-original.png'
      : '/brand/satyasakshi-logo-full.png'

  return (
    <span
      className={`shrink-0 inline-flex items-center justify-center transition-transform duration-300 ${className}`}
      style={{ height: `${size}px` }}
    >
      <img
        src={src}
        alt={site.brand.telugu}
        height={size}
        width={Math.round((size * 764) / 636)}
        className="h-full w-auto object-contain"
        loading="eager"
      />
    </span>
  )
}

/**
 * Renders the full official logo graphic lockup with high fidelity and zero cropping.
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
      className={`inline-flex flex-col items-center rounded-2xl bg-white p-4 shadow-md ring-1 ring-gold-500/30 ${className}`}
      style={{ maxWidth: `${width}px` }}
    >
      <img
        src="/brand/satyasakshi-logo-full.png"
        alt={`${site.brand.telugu} — ${site.brand.tagline}`}
        width={width}
        height={Math.round((width * 636) / 764)}
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
  align = 'center',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
  showTagline?: boolean
  align?: 'start' | 'center'
  className?: string
}) {
  const telugu =
    size === 'sm'
      ? 'text-[1.18rem]'
      : size === 'lg'
        ? 'text-2xl sm:text-3xl'
        : 'text-[1.58rem] sm:text-[1.78rem]'
  const tagline =
    size === 'sm'
      ? 'text-[0.52rem]'
      : size === 'lg'
        ? 'text-xs'
        : 'text-[0.56rem] sm:text-[0.60rem]'

  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <span className={`flex flex-col ${alignClass} ${className}`}>
      <span
        className={`font-logo font-extrabold tracking-tight leading-none pb-1 ${telugu} ${
          onDark ? 'text-cream-50' : 'text-forest-950'
        }`}
      >
        {site.brand.telugu}
      </span>
      {showTagline && (
        <span
          className={`mt-1.5 ${
            size === 'lg' ? 'inline-block' : 'hidden sm:inline-block'
          } font-serif font-semibold leading-none tracking-normal whitespace-nowrap ${tagline} ${
            onDark ? 'text-gold-300' : 'text-stone-800'
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
  markVariant = 'full',
  showTagline = true,
  align = 'center',
  hideTextOnMobile = false,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
  markSize?: number
  markVariant?: 'emblem' | 'full' | 'original'
  showTagline?: boolean
  align?: 'start' | 'center'
  hideTextOnMobile?: boolean
  className?: string
}) {
  const textHideClass = hideTextOnMobile ? 'hidden sm:flex' : ''

  if (onDark) {
    return (
      <Link
        to="/"
        className={`group inline-flex items-center gap-3.5 ${className}`}
        aria-label={`${site.brand.telugu} — ${site.brand.tagline} — ముఖ్య పేజీకి వెళ్ళండి`}
      >
        <span className="inline-flex items-center justify-center rounded-xl bg-white/95 px-2.5 py-1.5 shadow-sm ring-1 ring-gold-500/30 transition-transform duration-300 group-hover:scale-[1.03]">
          <BrandMark size={markSize} variant={markVariant} />
        </span>
        <Wordmark
          size={size}
          onDark={true}
          showTagline={showTagline}
          align={align}
          className={textHideClass}
        />
      </Link>
    )
  }

  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-3 sm:gap-3.5 ${className}`}
      aria-label={`${site.brand.telugu} — ${site.brand.tagline} — ముఖ్య పేజీకి వెళ్ళండి`}
    >
      <BrandMark
        size={markSize}
        variant={markVariant}
        className="transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <Wordmark
        size={size}
        onDark={false}
        showTagline={showTagline}
        align={align}
        className={textHideClass}
      />
    </Link>
  )
}
