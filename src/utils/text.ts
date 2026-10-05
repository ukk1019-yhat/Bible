/**
 * Telugu-aware text normalisation for search.
 *
 * Telugu script has no case, but it does have vowel signs that can appear
 * before or after the base consonant, plus combining marks that differ by
 * normalisation form. Users also type informal spellings, so we strip
 * punctuation, collapse whitespace and normalise to NFC before comparing.
 */

/** Zero-width and bidi control characters that should never match. */
const INVISIBLE = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g

/** Punctuation, symbols and spaces. */
const NON_WORD = /[\s!-/:-@[-`{-~‐-‧‰-⁞]/g

/** Telugu dependent vowel signs (matras) and virama, used to fold spellings. */
const TELUGU_MARKS = /[ัิ-ฺํా-ౖ]/g

/**
 * Fold a string into a comparable form.
 *
 * `stripMarks` additionally removes dependent vowel signs, which lets a search
 * for "రక్షణ" match "రక్షణము"-style inflections in scripture text.
 */
export function normalise(input: string, stripMarks = false): string {
  let value = input.normalize('NFC')
  value = value.replace(INVISIBLE, '').toLocaleLowerCase('te')
  value = value.replace(NON_WORD, ' ').trim()
  if (stripMarks) value = value.replace(TELUGU_MARKS, '')
  return value
}

export interface MatchPosition {
  start: number
  end: number
}

/**
 * Split `text` into alternating plain/highlighted segments for a query.
 * Returns `[{ text, match }]` covering the whole string.
 */
export function highlight(
  text: string,
  query: string,
  stripMarks = false,
): { text: string; match: boolean }[] {
  const needle = normalise(query, stripMarks)
  if (!needle) return [{ text, match: false }]

  const haystackFolded = normalise(text, stripMarks)
  const hay = Array.from(haystackFolded)
  const pin = Array.from(normalise(text))

  const segments: { text: string; match: boolean }[] = []
  let cursor = 0
  let found = 0

  while (found < pin.length) {
    const idx = hay.indexOf(needle, found)
    if (idx === -1) break
    if (idx > cursor) segments.push({ text: pin.slice(cursor, idx).join(''), match: false })
    segments.push({ text: pin.slice(idx, idx + needle.length).join(''), match: true })
    cursor = idx + needle.length
    found = cursor
  }

  if (cursor === 0) return [{ text, match: false }]
  if (cursor < pin.length) segments.push({ text: pin.slice(cursor).join(''), match: false })
  void hay
  return segments
}

/** Simple substring test used to filter lists. */
export function includesQuery(haystack: string, needle: string, stripMarks = false): boolean {
  const q = normalise(needle, stripMarks)
  if (!q) return true
  return normalise(haystack, stripMarks).includes(q)
}

/** Every whitespace-separated token of the query must appear. */
export function matchesAllTokens(haystack: string, query: string, stripMarks = false): boolean {
  const tokens = normalise(query, stripMarks).split(' ').filter(Boolean)
  if (tokens.length === 0) return true
  const hay = normalise(haystack, stripMarks)
  return tokens.every((t) => hay.includes(t))
}

/** Build a short excerpt around the first match, with ellipses. */
export function excerpt(text: string, query: string, length = 168): string {
  const pin = Array.from(text)
  if (pin.length <= length) return text

  const q = normalise(query)
  const folded = normalise(text)
  const idx = q ? folded.indexOf(q) : -1

  if (idx < 0) return `${pin.slice(0, length).join('').trimEnd()}…`

  const half = Math.floor((length - 1) / 2)
  const start = Math.max(0, idx - half)
  const end = Math.min(pin.length, start + length)
  const body = pin.slice(start, end).join('').trim()
  return `${start > 0 ? '…' : ''}${body}${end < pin.length ? '…' : ''}`
}