import { useRef } from 'react'
import { useLanguage } from '../../i18n/LanguageProvider'
import { LANGUAGES, type LanguageCode } from '../../i18n/strings'

/**
 * Two-language switch: తెలుగు / English.
 *
 * A two-button group rather than a single toggle, because both languages are
 * always available and the current one is a *choice*, not an on/off state. A
 * toggle would leave someone who has switched once unable to tell whether they
 * are reading the original or a translation.
 *
 * Each label is written in its own language, so the control stays readable to a
 * reader who cannot read the other option — the usual failure of a switch that
 * only ever says "English".
 */
export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useLanguage()
  const groupRef = useRef<HTMLDivElement>(null)

  /**
   * Roving focus, as expected of a segmented control: Left/Right move between
   * options and select as they go, and only the active button is tabbable.
   */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()

    const index = LANGUAGES.findIndex((entry) => entry.code === language)
    const next = LANGUAGES[(index + (event.key === 'ArrowRight' ? 1 : -1) + LANGUAGES.length) % LANGUAGES.length]

    setLanguage(next.code)
    groupRef.current?.querySelector<HTMLButtonElement>(`[data-code="${next.code}"]`)?.focus()
  }

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={t('lang.label')}
      onKeyDown={onKeyDown}
      className={`flex items-center rounded-[var(--radius-sm)] bg-cream-200/70 p-0.5 ${
        compact ? 'text-xs' : 'text-[0.78rem]'
      }`}
    >
      {LANGUAGES.map((entry: (typeof LANGUAGES)[number]) => {
        const active = entry.code === language

        return (
          <button
            key={entry.code}
            type="button"
            data-code={entry.code}
            onClick={() => setLanguage(entry.code as LanguageCode)}
            aria-pressed={active}
            tabIndex={active ? 0 : -1}
            lang={entry.htmlLang}
            className={`min-h-9 min-w-[3.25rem] rounded-[calc(var(--radius-sm)-2px)] px-2.5 font-medium transition-colors duration-200 ${
              active
                ? 'bg-cream-50 text-forest-900 shadow-xs'
                : 'text-ink-muted hover:text-forest-800'
            }`}
          >
            {entry.label}
          </button>
        )
      })}
    </div>
  )
}
