/** Shared domain types. Kept free of React so services and scripts can use them. */

export type ContentStatus = 'published' | 'coming-soon'

/* -------------------------------------------------------------------------- */
/*  Videos / messages                                                         */
/* -------------------------------------------------------------------------- */

export const VIDEO_CATEGORIES = [
  'బైబిల్ సందేశాలు',
  'బైబిల్ అధ్యయనం',
  'బోధనలు',
  'ప్రశ్నలు & సమాధానాలు',
  'ప్రత్యేక కార్యక్రమాలు',
] as const

export type VideoCategory = (typeof VIDEO_CATEGORIES)[number]

export interface Speaker {
  name: string
  /** Short honourific used in listings, e.g. "బ్రో." */
  honorific?: string
  slug: string
}

export interface Video {
  slug: string
  title: string
  /** Two lines of context. Only used when it is factual (e.g. a scripture). */
  description?: string
  youtubeId: string
  category: VideoCategory
  speaker?: Speaker
  /** ISO date — only present when Satya Sakshi published one. */
  publishedAt?: string
  duration?: string
  /** Passages the message covers, e.g. "లూకా 15". */
  scripture?: string
  featured?: boolean
}

/* -------------------------------------------------------------------------- */
/*  Articles                                                                  */
/* -------------------------------------------------------------------------- */

export interface ArticleCategory {
  slug: string
  telugu: string
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  category: ArticleCategory
  /** ISO date — omitted rather than invented. */
  publishedAt?: string
  readingMinutes?: number
  /** Present only when real body copy exists. */
  body?: ArticleBlock[]
  status: ContentStatus
}

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; reference?: string }
  | { type: 'list'; items: string[] }

/* -------------------------------------------------------------------------- */
/*  Books                                                                     */
/* -------------------------------------------------------------------------- */

export interface BookCategory {
  slug: string
  telugu: string
}

export interface ChristianBook {
  slug: string
  title: string
  author?: string
  category: BookCategory
  description?: string
  /** Remote PDF. Omitted when no file is published yet. */
  pdfUrl?: string
  /** Generated cover artwork key — resolved in code. */
  cover: 'sage' | 'clay' | 'indigo' | 'olive' | 'plum' | 'stone'
  status: ContentStatus
}

/* -------------------------------------------------------------------------- */
/*  Questions & answers                                                       */
/* -------------------------------------------------------------------------- */

export interface BibleReference {
  bookSlug: string
  chapter: number
  /** 1-based inclusive range. */
  verseStart: number
  verseEnd: number
}

export interface AnswerBlock {
  type: 'p'
  text: string
}

export interface AnswerSection {
  heading: string
  paragraphs: string[]
}

export interface Question {
  slug: string
  question: string
  /** One-sentence summary used on listing cards and search results. */
  summary: string
  /** Grouping used for filters, e.g. "దేవుడు", "రక్షణ". */
  topic: string
  answer: AnswerSection[]
  verses: BibleReference[]
  relatedSlugs: string[]
  status: ContentStatus
}

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  label: string
  to: string
  /** Shown in the footer only. */
  footerOnly?: boolean
  external?: boolean
}