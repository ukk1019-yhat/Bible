import type { StringKey } from './strings'

/**
 * Navigation labels keyed by destination.
 *
 * `src/data/navigation.ts` stays the single source of truth for *which* pages
 * exist and their paths; this maps each one to its label in both languages.
 * Splitting them means the route table never needs translating and the labels
 * stay in one reviewable place.
 */
export const NAV_LABELS: Record<string, StringKey> = {
  '/': 'nav.home',
  '/bible': 'nav.bible',
  '/messages': 'nav.messages',
  '/videos': 'nav.videos',
  '/books': 'nav.books',
  '/questions': 'nav.questions',
  '/articles': 'nav.articles',
  '/about': 'nav.about',
  '/contact': 'nav.contact',
  '/search': 'nav.search',
  '/privacy': 'nav.privacy',
  '/terms': 'nav.terms',
}

/** Label for a navigation destination, in the active interface language. */
export function navLabel(to: string, t: (key: StringKey) => string): string {
  return t(NAV_LABELS[to] ?? 'nav.home')
}
