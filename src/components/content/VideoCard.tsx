import { Link } from 'react-router-dom'
import type { Video } from '../../types/content'
import { Icon } from '../ui/Icon'
import { Badge } from '../ui/Section'

const THUMB = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

interface VideoCardProps {
  video: Video
  /** Larger treatment for the first item in a grid. */
  featured?: boolean
  delay?: number
}

/**
 * Video card. The thumbnail comes from YouTube's own CDN, so nothing is
 * invented and no image work is needed. Duration is deliberately absent —
 * YouTube's oEmbed endpoint does not publish it, so we do not guess.
 */
export function VideoCard({ video, featured = false, delay = 0 }: VideoCardProps) {
  return (
    <article
      data-reveal=""
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg ${
        featured ? 'md:flex-row' : ''
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-forest-900 ${
          featured ? 'md:w-[46%]' : ''
        }`}
      >
        <div className="aspect-video w-full">
          <img
            src={THUMB(video.youtubeId)}
            alt=""
            width={480}
            height={360}
            loading="lazy"
            decoding="async"
            className="size-full object-cover opacity-95 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-forest-950/25 transition-colors duration-300 group-hover:bg-forest-950/40"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-cream-50/95 text-forest-900 shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Icon name="play" size={24} />
          </span>
        </span>

        {video.featured ? (
          <span className="absolute left-3 top-3">
            <Badge tone="gold">ప్రధాన సందేశం</Badge>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="forest">{video.category}</Badge>
          {video.scripture ? (
            <span className="text-xs font-medium text-gold-700">{video.scripture}</span>
          ) : null}
        </div>

        <h3
          className={`mt-3 text-forest-900 transition-colors group-hover:text-forest-700 ${
            featured ? 'text-xl sm:text-2xl' : 'text-[1.05rem] leading-snug'
          }`}
        >
          <Link to={`/videos/${video.slug}`} className="after:absolute after:inset-0">
            {video.title}
          </Link>
        </h3>

        {video.description ? (
          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-muted">
            {video.description}
          </p>
        ) : null}

        <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
          {video.speaker ? (
            <>
              <Icon name="quote" size={14} className="text-gold-600" />
              <span>
                {video.speaker.honorific} {video.speaker.name}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </article>
  )
}
