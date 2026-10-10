/**
 * Site-wide configuration.
 *
 * Everything an administrator may need to change lives here or in `src/data`.
 * Values that Satya Sakshi has not published yet are deliberately `null`
 * so the UI can render an honest state instead of inventing a value.
 */

export const site = {
  /** Canonical origin. No trailing slash. */
  url: 'https://satyasakshi.in',
  lang: 'te-IN',
  locale: 'te_IN',

  brand: {
    telugu: 'సత్య సాక్షి',
    teluguSpaced: 'సత్య సాక్షి',
    english: 'Satya Sakshi',
    tagline: 'We Challenge Conventional Thinking',
    positioning: 'క్రైస్తవ విజ్ఞాన వేధిక',
    mission: 'దేవుని వాక్యము ప్రతి ఇంటికి',
    promise: 'తెలుగు క్రైస్తవులకు బైబిల్ ఆధారిత వనరులు.',
  },

  /** Default share image. */
  ogImage: '/og-image.png',

  /**
   * Square brand asset. Prefer this over the original raster logo: that file's
   * wordmark runs to the edges, so it gets clipped when Android crops a home
   * screen icon to the maskable safe zone.
   *
   * The untouched original is kept at `public/brand/satyasakshi-logo-original.png`
   * for print use only.
   */
  logo: '/icons/icon-512.png',

  /**
   * Official channels. Only links that genuinely belong to Satya Sakshi.
   * `null` means "not published yet" — the UI hides the entry entirely.
   */
  youtube: {
    channelUrl: 'https://www.youtube.com/@sudhaword/videos',
    channelHandle: '@sudhaword',
  },

  contact: {
    /**
     * No published email address was found on the existing site. Leaving this
     * `null` makes the contact form show a clear "not yet connected" notice
     * instead of silently swallowing the message.
     */
    email: null as string | null,
    phone: null as string | null,
    address: 'రోడ్ నం. 1, విద్యానగర్, రమణయ్యపేట, కాకినాడ - 533005',
  },

  /**
   * Official physical location & prayer center with Google Maps coordinates and verified QR code.
   */
  locations: [
    {
      id: 'kakinada-bible-study',
      name: 'BIBLE STUDY CENTER - KAKINADA',
      teluguName: 'బైబిల్ స్టడీ సెంటర్ — కాకినాడ',
      area: 'కాకినాడ',
      city: 'Kakinada',
      landmark: 'రమణయ్యపేట',
      addressLine1: 'రోడ్ నం. 1, విద్యానగర్',
      addressLine2: 'రమణయ్యపేట, కాకినాడ - 533005',
      fullAddress: 'Road No. 1, Vidyanagar, Ramanayyapeta, Kakinada - 533005',
      plusCode: 'Kakinada',
      mapUrl: 'https://maps.app.goo.gl/PUXgiSjS7GHXwY758',
      qrImage: '/brand/qr-kakinada-bible-study.png',
      tag: 'బైబిల్ అధ్యయన కేంద్రం',
      englishTag: 'Bible Study Center',
    },
  ],

  /** Footer legal links that are genuinely published. */
  legal: {
    privacyPath: '/privacy',
    termsPath: '/terms',
  },
} as const

export type Site = typeof site

/** Absolute URL helper for canonical tags, OG tags and the sitemap. */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `${site.url}${clean}`
}