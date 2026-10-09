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
    telugu: 'సత్యసాక్షి',
    teluguSpaced: 'సత్య సాక్షి',
    english: 'Satya Sakshi',
    tagline: 'We Challenge Conventional Thinking',
    positioning: 'తెలుగు క్రైస్తవ జ్ఞాన వేదిక',
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
    address: 'కాకినాడ & గొంధి (యు. కొత్తపల్లి), ఆంధ్రప్రదేశ్',
  },

  /**
   * Official physical locations & prayer centers with Google Maps coordinates and verified QR codes.
   */
  locations: [
    {
      id: 'kakinada-bible-study',
      name: 'Bible Study Center',
      teluguName: 'బైబిల్ స్టడీ సెంటర్',
      area: 'కాకినాడ (Kakinada)',
      city: 'Kakinada',
      landmark: 'రమణయ్యపేట',
      addressLine1: 'రోడ్ నం. 2, విద్యానగర్ 1, కృష్ణా నగర్',
      addressLine2: 'రమణయ్యపేట, కాకినాడ, ఆంధ్రప్రదేశ్ - 533005',
      fullAddress: 'Rd 2, Vidyanagar 1, Krishna Nagar, Ramanayyapeta, Kakinada, Andhra Pradesh 533005',
      plusCode: 'X6QX+WCR, Kakinada',
      mapUrl: 'https://www.google.com/maps/place/X6QX%2BWCR+Bible+Study+Center,+Rd+2,+Vidyanagar+1,+Krishna+Nagar,+Ramanayapeta,+Ramanayyapeta,+Andhra+Pradesh+533005',
      qrImage: '/brand/qr-kakinada-bible-study.png',
      tag: 'బైబిల్ అధ్యయన కేంద్రం',
      englishTag: 'Bible Study Center',
    },
    {
      id: 'kottapalli-church',
      name: 'Church of The Living God',
      teluguName: 'చర్చ్ ఆఫ్ ది లివింగ్ గాడ్',
      area: 'గొంధి, యు. కొత్తపల్లి',
      city: 'U. Kothapalli',
      landmark: 'గొంధి గ్రామం',
      addressLine1: 'A, గొంధి గ్రామం',
      addressLine2: 'యు. కొత్తపల్లి (మండలం), కాకినాడ జిల్లా, ఆంధ్రప్రదేశ్ - 533407',
      fullAddress: 'A, Gondhi, U. Kothapalli (Kottapalli), Kakinada Dist., Andhra Pradesh 533407',
      plusCode: '88JM+C2H, Gondhi',
      mapUrl: 'https://www.google.com/maps/place/88JM%2BC2H+Church+of+The+Living+God,+A,+Gondhi,+Kottapalli,+Andhra+Pradesh+533407',
      qrImage: '/brand/qr-kottapalli-church.png',
      tag: 'ఆరాధన & ప్రార్థనా సంఘం',
      englishTag: 'Worship Center',
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