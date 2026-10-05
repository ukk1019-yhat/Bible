/**
 * Date formatting for Telugu-first content.
 * ISO strings are formatted as `2026 జూన్ 5`. No date is ever invented —
 * call sites only pass dates that exist in the content data.
 */

const TELUGU_MONTHS = [
  'జనవరి',
  'ఫిబ్రవరి',
  'మార్చి',
  'ఏప్రిల్',
  'మే',
  'జూన్',
  'జూలై',
  'ఆగస్టు',
  'సెప్టెంబర్',
  'అక్టోబర్',
  'నవంబర్',
  'డిసెంబర్',
]

export function formatTeluguDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()} ${TELUGU_MONTHS[d.getMonth()]} ${d.getDate()}`
}

export function formatTeluguMonthYear(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${TELUGU_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** Telugu reading-time label, e.g. `5 నిమిషాలు`. */
export function readingTimeLabel(minutes: number): string {
  if (minutes <= 1) return '1 నిమిషం'
  if (minutes < 60) return `${minutes} నిమిషాలు`
  const hours = Math.round(minutes / 60)
  return `${hours} గంటలు`
}

/** Converts ASCII digits to Telugu digits. Used sparingly, in scripture refs. */
export function toTeluguDigits(value: string | number): string {
  const map: Record<string, string> = {
    '0': '౦',
    '1': '౧',
    '2': '౨',
    '3': '౩',
    '4': '౪',
    '5': '౫',
    '6': '౬',
    '7': '౭',
    '8': '౮',
    '9': '౯',
  }
  return String(value).replace(/\d/g, (d) => map[d] ?? d)
}

/** Transliteration-free slug helper for Telugu titles (falls back to a hash id). */
export function slugify(input: string): string {
  const slug = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'item'
}