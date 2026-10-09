import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Video } from '../../types/content'
import { Button } from '../ui/Button'
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
 * invented and no image work is needed. Featured card supports inline playback
 * on demand without tracking before click.
 */
export function VideoCard({ video, featured = false, delay = 0 }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <article
      data-reveal=""
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 transition-[border-color,box-shadow,transform] duration-300 hover:border-forest-300 hover:shadow-lg ${
        featured ? 'md:flex-row hover:-translate-y-0.5' : 'hover:-translate-y-1'
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-forest-900 ${
          featured ? 'md:w-[48%] lg:w-[50%]' : ''
        }`}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-forest-950">
          {featured && isPlaying ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <>
              <img
                src={featured ? `https://i.ytimg.com/vi/${video.youtubeId}/maxresdefault.jpg` : THUMB(video.youtubeId)}
                alt=""
                width={featured ? 1280 : 480}
                height={featured ? 720 : 360}
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  const img = event.currentTarget
                  if (!img.src.includes('hqdefault')) img.src = THUMB(video.youtubeId)
                }}
                className="size-full object-cover opacity-95 transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {featured ? (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="group/play absolute inset-0 z-10 flex size-full cursor-pointer items-center justify-center bg-forest-950/25 transition-colors duration-300 hover:bg-forest-950/40"
                  aria-label={`${video.title} వీడియోను చూడండి`}
                >
                  <span className="flex size-16 items-center justify-center rounded-full bg-cream-50/95 text-forest-900 shadow-xl transition-transform duration-300 group-hover/play:scale-110">
                    <Icon name="play" size={28} />
                  </span>
                </button>
              ) : (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-forest-950/25 transition-colors duration-300 group-hover:bg-forest-950/40"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-cream-50/95 text-forest-900 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Icon name="play" size={24} />
                  </span>
                </span>
              )}
            </>
          )}
        </div>

        {video.featured ? (
          <span className="pointer-events-none absolute left-3 top-3 z-20">
            <Badge tone="gold">ప్రధాన సందేశం</Badge>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="forest">{video.category}</Badge>
            {video.scripture ? (
              <span className="text-xs font-medium text-gold-700">{video.scripture}</span>
            ) : null}
          </div>

          <h3
            className={`mt-3 font-serif font-bold text-forest-900 transition-colors hover:text-forest-700 ${
              featured ? 'text-xl sm:text-2xl leading-snug' : 'text-[1.05rem] leading-snug'
            }`}
          >
            {featured ? (
              <Link to={`/videos/${video.slug}`} className="hover:underline">
                {video.title}
              </Link>
            ) : (
              <Link to={`/videos/${video.slug}`} className="after:absolute after:inset-0">
                {video.title}
              </Link>
            )}
          </h3>

          {video.description ? (
            <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-[0.95rem]">
              {video.description}
            </p>
          ) : null}

          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-ink-muted">
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

        {featured ? (
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-cream-300/80 pt-5">
            <Button to={`/videos/${video.slug}`} size="sm" variant="secondary" icon="arrow-right">
              సందేశం వివరాలు
            </Button>
            <Button
              href={`https://youtu.be/${video.youtubeId}`}
              size="sm"
              variant="ghost"
              icon="external"
            >
              YouTube లో చూడండి
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  )
}
