import { useLanguage } from '../../i18n/LanguageProvider'
import { LANG_NOTICE } from '../../i18n/strings'

/**
 * Explains why scripture stays in Telugu when the interface does not.
 *
 * There is no English translation of the BSI text published on this site, so a
 * reader who switches to English and then taps a verse would otherwise land on
 * Telugu text with no explanation and no way to tell whether it is a failed
 * translation or simply the original.
 *
 * Rendered above scripture surfaces — the reader, a book page, a quoted verse —
 * and deliberately not dismissible, since it is a fact about the content rather
 * than a tip.
 */
export function BibleLanguageNotice({ className = '' }: { className?: string }) {
  const { isForeign, language } = useLanguage()

  // Only the languages that actually need an explanation show it.
  if (!isForeign || !(language in LANG_NOTICE)) return null

  return (
    <p
      role="note"
      className={`flex items-start gap-2.5 rounded-[var(--radius-md)] border border-cream-400 bg-cream-100 px-4 py-3 text-[0.9rem] leading-relaxed text-ink-soft ${className}`}
    >
      <span aria-hidden="true" className="mt-[0.2rem] shrink-0 text-gold-600">
        &#9432;
      </span>
      <span>{LANG_NOTICE[language as keyof typeof LANG_NOTICE]}</span>
    </p>
  )
}
