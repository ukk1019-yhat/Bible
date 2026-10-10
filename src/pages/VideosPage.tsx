import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getVideoBySlug,
  speakers,
  videos,
} from '../data/content/videos'
import { VIDEO_CATEGORIES, type Video, type VideoCategory } from '../types/content'
import { site } from '../config/site'
import { VideoCard } from '../components/content/VideoCard'
import { YouTubeEmbed } from '../components/content/YouTubeEmbed'
import { Icon } from '../components/ui/Icon'
import { Breadcrumbs, PageHeader } from '../components/ui/Layout'
import { Badge, EmptyState, Reveal } from '../components/ui/Section'
import { graph, useSeo } from '../hooks/useSeo'
import NotFoundPage from './NotFoundPage'

/**
 * `/messages` shows messages and Bible studies; `/videos` shows the whole
 * channel, including Q&A sessions. Both are the same real content, split the
 * way a reader actually looks for it.
 */
const MESSAGE_CATEGORIES: VideoCategory[] = [
  'బైబిల్ సందేశాలు',
  'బైబిల్ అధ్యయనం',
  'బోధనలు',
]

function filterByCategory(list: Video[], category: VideoCategory | null) {
  return category ? list.filter((video) => video.category === category) : list
}

interface ListingProps {
  /** Restrict to message-style categories. */
  messagesOnly?: boolean
}

function VideoListing({ messagesOnly = false }: ListingProps) {
  const pool = messagesOnly
    ? videos.filter((video) => MESSAGE_CATEGORIES.includes(video.category))
    : videos

  const [category, setCategory] = useState<VideoCategory | null>(null)

  const available = useMemo(() => {
    const used = new Set(pool.map((video) => video.category))
    return VIDEO_CATEGORIES.filter((item) => used.has(item))
  }, [pool])

  const visible = useMemo(() => filterByCategory(pool, category), [pool, category])

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={`min-h-9 rounded-full px-4 text-sm transition-colors ${
            category === null
              ? 'bg-forest-800 font-medium text-cream-50'
              : 'bg-cream-200 text-ink-soft hover:bg-cream-300'
          }`}
        >
          అన్నీ ({pool.length})
        </button>

        {available.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            className={`min-h-9 rounded-full px-4 text-sm transition-colors ${
              category === item
                ? 'bg-forest-800 font-medium text-cream-50'
                : 'bg-cream-200 text-ink-soft hover:bg-cream-300'
          }`}
          >
            {item} ({pool.filter((video) => video.category === item).length})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Icon name="play" size={26} />}
          title="ఈ అంశంలో సందేశాలు ఇంకా లేవు"
          description="సత్యసాక్షి ఈ అంశంలో వీడియోలు ఇంకా ప్రచురించలేదు. YouTube చానెల్‌లో అన్ని సందేశాలు అందుబాటులో ఉన్నాయి."
          action={{ label: 'YouTube చానెల్', to: '/videos' }}
        />
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((video, index) => (
            <li key={video.slug}>
              <VideoCard video={video} delay={index * 60} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  /messages                                                                  */
/* -------------------------------------------------------------------------- */

export function MessagesPage() {
  useSeo({
    title: 'బైబిల్ సందేశాలు — బ్రో. సునిల్‌కుమార్ గారి బోధనలు',
    description:
      'బైబిల్ సందేశాలు, బైబిల్ అధ్యయనం — బ్రో. పి. సునిల్‌కుమార్ గారి బోధనలను YouTubeలో ఆన్‌లైన్ చూడండి.',
    path: '/messages',
    jsonLd: graph({
      '@type': 'CollectionPage',
      name: 'బైబిల్ సందేశాలు',
      inLanguage: 'te-IN',
      url: 'https://satyasakshi.in/messages',
    }),
  })

  return (
    <>
      <PageHeader
        eyebrow="సందేశాలు"
        title="బైబిల్ సందేశాలు"
        icon="play"
        lede="బైబిల్ సందేశాలు, బైబిల్ అధ్యయనం — బ్రో. పి. సునిల్‌కుమార్ గారి బోధనలు. మీరు ఎప్పుడైనా, ఎక్కడైనా చూడగలరు."
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'సందేశాలు' }]}
      />

      <div className="shell py-12 sm:py-16">
        <VideoListing messagesOnly />

        <Reveal className="mt-16">
          <div className="rounded-[var(--radius-xl)] border border-cream-300 bg-cream-50 p-8">
            <h2 className="text-xl text-forest-950">మరింత సందేశాలు</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
              అన్ని సందేశాలు మా YouTube చానెల్‌లో ఉన్నాయి. కొత్త వీడియోలు అప్‌లోడ్ అయిన
              వెంటనే ఇక్కడ కనిపిస్తాయి.
            </p>
            <a
              href={site.youtube.channelUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-forest-800/25 px-5 text-[0.95rem] font-medium text-forest-800 transition-colors hover:bg-forest-100/60"
            >
              <Icon name="youtube" size={18} />
              {site.youtube.channelHandle}
              <Icon name="external" size={14} />
            </a>
          </div>
        </Reveal>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  /videos                                                                    */
/* -------------------------------------------------------------------------- */

export function VideosPage() {
  useSeo({
    title: 'వీడియోలు — సత్యసాక్షి సందేశాలు',
    description:
      'సత్యసాక్షి YouTube చానెల్‌లోని అన్ని వీడియోలు — బైబిల్ సందేశాలు, బైబిల్ అధ్యయనం, ప్రశ్నలకు సమాధానాలు.',
    path: '/videos',
  })

  return (
    <>
      <PageHeader
        eyebrow="వీడియోలు"
        title="అన్ని వీడియోలు"
        icon="youtube"
        lede="బ్రో. పి. సునిల్కుమార్ గారి చానెల్‌లోని అన్ని సందేశాలు ఒకే చోట."
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'వీడియోలు' }]}
      >
        <a
          href={site.youtube.channelUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-[var(--radius-md)] bg-forest-800 px-5 text-[0.95rem] font-medium text-cream-50 transition-colors hover:bg-forest-700"
        >
          <Icon name="youtube" size={18} />
          చానెల్ చూడండి
        </a>
      </PageHeader>

      <div className="shell py-12 sm:py-16">
        <VideoListing />
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  /videos/:slug                                                             */
/* -------------------------------------------------------------------------- */

export function VideoRoute() {
  const { slug = '' } = useParams()
  const video = getVideoBySlug(slug)

  useSeo({
    title: video ? `${video.title} — సత్యసాక్షి` : 'వీడియో కనబడలేదు',
    description:
      video?.description ??
      'సత్యసాక్షి బైబిల్ సందేశాలు — బ్రో. పి. సునిల్కుమార్ గారి YouTube చానెల్‌లో.',
    path: `/videos/${slug}`,
    type: 'video.other',
  })

  if (!video) return <NotFoundPage />

  const others = videos
    .filter((item) => item.slug !== video.slug)
    .slice(0, 3)

  const speaker = video.speaker ? speakers.find((s) => s.slug === video.speaker!.slug) : undefined

  return (
    <>
      <header className="border-b border-cream-300 bg-cream-50">
        <div className="shell py-8">
          <Breadcrumbs
            className="mb-6"
            items={[
              { label: 'హోమ్', to: '/' },
              { label: 'వీడియోలు', to: '/videos' },
              { label: video.title },
            ]}
          />
        </div>
      </header>

      <div className="shell py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,52rem)_18rem] lg:items-start lg:gap-14">
          <article>
            <h1 className="text-2xl leading-snug text-forest-950 sm:text-3xl lg:text-[2.1rem]">
              {video.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge tone="forest">{video.category}</Badge>
              {video.scripture ? (
                <span className="text-sm font-medium text-gold-700">{video.scripture}</span>
              ) : null}
            </div>

            <div className="mt-7">
              <YouTubeEmbed videoId={video.youtubeId} title={video.title} />
            </div>

            {video.description ? (
              <p className="mt-7 max-w-[var(--container-prose)] text-[1.02rem] leading-relaxed text-ink-soft">
                {video.description}
              </p>
            ) : null}

            {video.scripture ? (
              <p className="mt-6">
                <Link
                  to={`/bible/search?q=${encodeURIComponent(video.scripture)}`}
                  className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-forest-700"
                >
                  <Icon name="book-open" size={16} />
                  {video.scripture} బైబిల్‌లో చదవండి
                </Link>
              </p>
            ) : null}
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-5">
              <h2 className="text-sm font-semibold text-forest-900">వివరాలు</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {speaker ? (
                  <div>
                    <dt className="text-ink-muted">బోధకుడు</dt>
                    <dd className="mt-0.5 font-medium text-forest-900">
                      {speaker.honorific} {speaker.name}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-ink-muted">అంశం</dt>
                  <dd className="mt-0.5 font-medium text-forest-900">{video.category}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">చానెల్</dt>
                  <dd className="mt-0.5">
                    <a
                      href={site.youtube.channelUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-underline font-medium text-forest-800"
                    >
                      {site.youtube.channelHandle}
                    </a>
                  </dd>
                </div>
              </dl>

              <p className="mt-4 border-t border-cream-300 pt-4 text-xs leading-relaxed text-ink-muted">
                ప్రచురణ తేదీ, వ్యవధి YouTube సమాచారం నుండి అందుబాటులో లేదు కాబట్టి ఇక్కడ చూపించాలేదు.
              </p>
            </div>
          </aside>
        </div>

        {others.length > 0 ? (
          <section className="mt-20 border-t border-cream-300 pt-12" aria-labelledby="more-videos">
            <h2 id="more-videos" className="text-xl text-forest-950">
              మరిన్ని సందేశాలు
            </h2>
            <ul className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <VideoCard video={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  )
}
