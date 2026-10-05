import { createContext, useCallback, useContext, useLayoutEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  STRINGS,
  type LanguageCode,
  type StringKey,
} from './strings'

interface LanguageValue {
  language: LanguageCode
  /** True when the interface is not in Telugu, which is when the Bible notice shows. */
  isForeign: boolean
  setLanguage: (language: LanguageCode) => void
  /** Look up an interface string in the active language. */
  t: (key: StringKey) => string
  /** `te-IN` or `en`, for `<html lang>`. */
  htmlLang: string
}

const LanguageContext = createContext<LanguageValue | null>(null)

function isLanguage(value: unknown): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value)
}

/**
 * Interface language.
 *
 * Telugu is the default and the only language the content itself exists in, so
 * nothing is guessed here: switching only affects chrome strings. The Bible
 * reader reads `isForeign` to explain why the scripture stays in Telugu.
 *
 * `<html lang>` is kept in sync because it drives font selection, hyphenation
 * and screen-reader pronunciation — leaving it at `te` while showing English
 * text would make assistive tech mispronounce the whole page.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useLocalStorage<LanguageCode>('language', DEFAULT_LANGUAGE)

  // A hand-edited or stale value must not produce a blank interface.
  const language = isLanguage(stored) ? stored : DEFAULT_LANGUAGE

  const setLanguage = useCallback(
    (next: LanguageCode) => setStored(next),
    [setStored],
  )

  const value = useMemo<LanguageValue>(() => {
    const active = LANGUAGES.find((entry) => entry.code === language) ?? LANGUAGES[0]

    return {
      language,
      isForeign: language !== DEFAULT_LANGUAGE,
      setLanguage,
      htmlLang: active.htmlLang,
      t: (key) => STRINGS[language][key] ?? STRINGS[DEFAULT_LANGUAGE][key],
    }
  }, [language, setLanguage])

  return (
    <LanguageContext.Provider value={value}>
      <HtmlLangSync lang={value.htmlLang} />
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Keeps the document language honest. `index.html` ships `lang="te"` so the
 * first paint is correct for the default; this updates it when the reader
 * switches.
 *
 * A layout effect, not a passive one, so the attribute is corrected before the
 * browser paints the new language — a screen reader should never be handed
 * English text labelled as Telugu.
 */
function HtmlLangSync({ lang }: { lang: string }) {
  useLayoutEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return null
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return value
}
