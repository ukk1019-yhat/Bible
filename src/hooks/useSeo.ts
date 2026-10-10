import { useEffect } from 'react'
import { site, absoluteUrl } from '../config/site'

export interface SeoInput {
  title: string
  description: string
  /** Route path, e.g. `/articles/rakshana-ante-emiti`. */
  path: string
  /** `article` for prose, `website` otherwise, `video.other` for watch pages. */
  type?: 'website' | 'article' | 'video.other'
  image?: string
  imageAlt?: string
  /** JSON-LD graph fragments for this route. */
  jsonLd?: Record<string, unknown>[]
  /** Keep the page out of the index (e.g. search results). */
  noIndex?: boolean
  /**
   * BCP-47 tag for the page's primary content, written to `<html lang>`.
   *
   * Pages that are mostly scripture must declare `te` even when the interface is
   * English, so search engines index them as Telugu and assistive tech uses the
   * right pronunciation.
   */
  contentLang?: string
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id: string, graph: Record<string, unknown>[]) {
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(graph)
}

const SITE_JSONLD_ID = 'ld-site'

/**
 * Static organisation markup, injected once. Declares the site, the publisher
 * and the Telugu language so search engines understand the platform from the
 * first paint on any route.
 */
function injectSiteJsonLd() {
  if (document.getElementById(SITE_JSONLD_ID)) return
  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: `${site.url}/`,
      name: `${site.brand.telugu} — ${site.brand.positioning}`,
      inLanguage: site.lang,
      publisher: { '@id': `${site.url}/#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.brand.english,
      alternateName: site.brand.telugu,
      url: `${site.url}/`,
      description: site.brand.promise,
      slogan: `${site.brand.tagline} — ${site.brand.mission}`,
      email: site.contact.email,
    },
  ]
  upsertJsonLd(SITE_JSONLD_ID, graph)
}

/**
 * Per-route SEO: title, description, canonical, hreflang, Open Graph, Twitter
 * card and JSON-LD. Every route must call this exactly once with a unique
 * title and description.
 */
export function useSeo({
  title,
  description,
  path,
  type = 'website',
  image,
  imageAlt,
  jsonLd,
  noIndex = false,
  /** Overrides the document language when the interface is not in Telugu. */
  contentLang,
}: SeoInput) {
  useEffect(() => {
    const canonical = absoluteUrl(path)
    const fullTitle = title.includes(site.brand.telugu) ? title : `${title} | ${site.brand.telugu}`
    const shareImage = absoluteUrl(image ?? site.ogImage)

    document.title = fullTitle

    setMeta('meta[name="description"]', 'name', 'description', description)
    setLink('canonical', canonical)
    setLink('alternate', canonical)

    setMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, follow' : 'index, follow')

    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:image"]', 'property', 'og:image', shareImage)
    setMeta(
      'meta[property="og:image:alt"]',
      'property',
      'og:image:alt',
      imageAlt ?? site.brand.positioning,
    )

    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', shareImage)

    // `og:locale` follows the content, not the interface language, for the same
    // reason as `<html lang>`.
    if (contentLang) setMeta('meta[property="og:locale"]', 'property', 'og:locale', contentLang)

    injectSiteJsonLd()
    if (jsonLd?.length) upsertJsonLd('ld-page', jsonLd)
    else document.getElementById('ld-page')?.remove()
  }, [title, description, path, type, image, imageAlt, jsonLd, noIndex, contentLang])
}

/** Helper: wrap route-specific nodes into a JSON-LD graph with @context. */
export function graph(...nodes: Record<string, unknown>[]): Record<string, unknown>[] {
  return nodes.map((node) => ({ '@context': 'https://schema.org', ...node }))
}