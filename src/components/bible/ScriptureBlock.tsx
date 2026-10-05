import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatReference, getChapter, loadBook, type LoadedBook } from '../../services/bible'
import { useLanguage } from '../../i18n/LanguageProvider'
import type { BibleReference } from '../../types/content'

interface QuoteResult {
  /** Identifies the range this text belongs to. */
  key: string
  text: string | null
  failed: boolean
}

/**
 * Renders a real verse range straight from the reader's text, so quotes in
 * answers can never drift out of sync with what the reader shows.
 *
 * Falls back to the reference alone if the chapter cannot be fetched — the
 * citation stays visible even when the body text is unavailable.
 */
export function ScriptureBlock({
  reference,
  size = 'md',
  showLink = true,
}: {
  reference: BibleReference
  size?: 'sm' | 'md'
  showLink?: boolean
}) {
  const { bookSlug, chapter, verseStart, verseEnd } = reference
  const key = `${bookSlug}-${chapter}-${verseStart}-${verseEnd}`
  const { t } = useLanguage()

  const [result, setResult] = useState<QuoteResult>({ key: '', text: null, failed: false })

  useEffect(() => {
    let cancelled = false

    loadBook(bookSlug)
      .then((book: LoadedBook) => {
        if (cancelled) return
        const verses = getChapter(book, chapter)?.verses ?? []
        const slice = verses.slice(verseStart - 1, verseEnd).filter(Boolean)
        setResult({
          key,
          text: slice.length > 0 ? slice.join(' ') : null,
          failed: slice.length === 0,
        })
      })
      .catch(() => {
        if (!cancelled) setResult({ key, text: null, failed: true })
      })

    return () => {
      cancelled = true
    }
  }, [bookSlug, chapter, verseStart, verseEnd, key])

  // Staleness is derived, so changing reference never needs a sync reset.
  const current = result.key === key ? result : { text: null, failed: false }
  const { text, failed } = current

  const label = formatReference(bookSlug, chapter, verseStart, verseEnd)
  const path = `/bible/${bookSlug}/${chapter}#v${verseStart}`

  return (
      <figure
        className={`my-6 rounded-[var(--radius-md)] border-s-2 border-gold-500 bg-gold-100/50 ${
          size === 'sm' ? 'px-4 py-3' : 'px-5 py-4'
        }`}
      >
      {/*
        `lang="te"` is explicit: the quoted text is always the Telugu BSI verse,
        so a screen reader must not pronounce it as English when the interface
        happens to be in English.
      */}
      {text ? (
        <p
          lang="te"
          className={`${size === 'sm' ? 'text-[0.95rem]' : 'text-[1.02rem]'} text-forest-900`}
        >
          «{text}»
        </p>
      ) : failed ? (
        <p className="text-[0.95rem] text-ink-muted">{t('bible.textUnavailable')}</p>

      ) : (
        <span
          aria-hidden="true"
          className="inline-block h-5 w-full max-w-md animate-pulse rounded-[var(--radius-xs)] bg-cream-200"
        />
      )}

      <figcaption className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gold-700">
        <span lang="te">{label}</span>
        {showLink ? (
          <Link to={path} className="link-underline text-forest-700">
            {t('bible.openInBible')}
          </Link>
        ) : null}
      </figcaption>
    </figure>
  )
}
