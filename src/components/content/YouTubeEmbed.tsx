import { useState } from 'react'
import { Icon } from '../ui/Icon'

/**
 * Privacy-friendly YouTube embed.
 *
 * The iframe is only created after the reader asks for it, so no request ever
 * reaches Google until then. Until that moment the poster is just the
 * thumbnail served from YouTube's CDN with a clear play affordance.
 */
export function YouTubeEmbed({
  videoId,
  title,
  className = '',
}: {
  videoId: string
  title: string
  className?: string
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-forest-950 shadow-lg ${className}`}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex size-full items-center justify-center"
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              // Not every upload has a max-res frame; fall back to the standard one.
              const img = event.currentTarget
              if (!img.src.includes('hqdefault')) img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
            }}
            className="absolute inset-0 size-full object-cover opacity-90 transition-opacity group-hover:opacity-75"
          />
          <span className="relative flex size-20 items-center justify-center rounded-full bg-cream-50/95 text-forest-900 shadow-xl transition-transform duration-300 group-hover:scale-105">
            <Icon name="play" size={32} />
          </span>
          <span className="sr-only">{title} వీడియోను చూడండి</span>
        </button>
      )}
    </div>
  )
}
