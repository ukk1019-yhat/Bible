import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  formatReference,
  getBookMeta,
  getChapter,
  stepChapter,
} from '../../services/bible'
import { useBook } from '../../hooks/useBook'
import { useBookmarks, useReaderFontSize } from '../../hooks/useBookmarks'
import { useLanguage } from '../../i18n/LanguageProvider'
import type { BibleBookMeta } from '../../data/bible/books.generated'
import { Icon } from '../ui/Icon'
import { BibleLanguageNotice } from './BibleLanguageNotice'
import { ChapterPager } from './ChapterPicker'

interface ChapterReaderProps {
  book: BibleBookMeta
  chapter: number
}

type Status = 'idle' | 'copied' | 'failed'

/** Human label for a chapter in an adjacent book, e.g. "మత్తయి 1". */
function chapterLabel(slug: string, chapter: number): string {
  const meta = getBookMeta(slug)
  return `${meta?.shortTelugu ?? slug} ${chapter}`
}

export function ChapterReader({ book, chapter }: ChapterReaderProps) {
  const { book: loaded, loading, error } = useBook(book.slug)
  const { hash } = useLocation()
  const font = useReaderFontSize()
  const { isBookmarked, toggle } = useBookmarks()
  const { t } = useLanguage()
  const [status, setStatus] = useState<Status>('idle')
  const verseRefs = useRef(new Map<number, HTMLElement>())

  const verses = useMemo(
    () => (loaded ? (getChapter(loaded, chapter)?.verses ?? []) : []),
    [loaded, chapter],
  )

  const targetVerse = hash.startsWith('#v') ? Number(hash.slice(2)) : null

  // Deep links such as /bible/john/3#v16 should draw the eye to that verse.
  useEffect(() => {
    if (!targetVerse) return
    const node = verseRefs.current.get(targetVerse)
    if (!node) return
    node.scrollIntoView({ block: 'center' })
    node.classList.add('is-target')
    const timer = setTimeout(() => node.classList.remove('is-target'), 2400)
    return () => clearTimeout(timer)
  }, [targetVerse, verses.length])

  const neighbour = useMemo(() => stepChapter(book.slug, chapter, -1), [book.slug, chapter])
  const following = useMemo(() => stepChapter(book.slug, chapter, 1), [book.slug, chapter])

  const share = async (verseStart: number, verseEnd: number) => {
    const body = verses
      .slice(verseStart - 1, verseEnd)
      .map((text, i) => `${verseStart + i}. ${text}`)
      .join(' ')
    const reference = formatReference(book.slug, chapter, verseStart, verseEnd)
    const full = `"${body}" — ${reference}\n${window.location.href}`

    try {
      if (navigator.share) {
        await navigator.share({ title: reference, text: body, url: window.location.href })
      } else {
        await navigator.clipboard.writeText(full)
      }
      setStatus('copied')
    } catch {
      // The share sheet was dismissed, or clipboard access was refused.
      setStatus('failed')
    }

    setTimeout(() => setStatus('idle'), 2600)
  }

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <p className="sr-only">{t('ui.pageLoading')}</p>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-5 animate-pulse rounded-[var(--radius-xs)] bg-cream-200"
            style={{ width: `${92 - (i % 4) * 13}%` }}
          />
        ))}
      </div>
    )
  }

  if (error || verses.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-cream-400 bg-cream-50 px-6 py-12 text-center">
        <h2 className="text-lg text-forest-900">ఈ అధ్యాయం చూడలేకపోయాము</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          వాక్యం లోడ్ కాలేదు. ఇంటర్నెట్ సంబంధాన్ని తనిఖీ చేసి మళ్ళీ ప్రయత్నించండి.
        </p>
        <Link
          to={`/bible/${book.slug}`}
          className="mt-6 inline-flex min-h-10 items-center rounded-[var(--radius-md)] border border-forest-800/25 px-5 text-sm font-medium text-forest-800 hover:bg-forest-100/60"
        >
          {book.telugu} అధ్యాయాల వివరణకు
        </Link>
      </div>
    )
  }

  const saved = isBookmarked(book.slug, chapter)

  return (
    <div>
      {/* Reader toolbar: text size, bookmark, share. */}
      <div className="sticky top-[4.5rem] z-30 -mx-5 mb-8 flex flex-wrap items-center justify-between gap-3 border-y border-cream-300 bg-cream-50/92 px-5 py-2.5 backdrop-blur-md supports-[backdrop-filter]:bg-cream-50/80">
        <p className="font-serif text-[1.05rem] font-semibold text-forest-900">
          {book.telugu} <span className="text-gold-700">{chapter}</span>
        </p>

        <div className="flex items-center gap-1">
          <div
            className="flex items-center rounded-[var(--radius-sm)] border border-cream-400"
            role="group"
            aria-label={t('bible.resetText')}
          >
            <button
              type="button"
              onClick={font.decrease}
              disabled={font.index === 0}
              className="flex size-9 items-center justify-center text-xs font-medium text-ink-soft transition-colors hover:bg-cream-200 disabled:opacity-40"
            >
              అ−
              <span className="sr-only">{t('bible.decreaseText')}</span>
            </button>
            <span aria-live="polite" className="min-w-14 px-1 text-center text-xs text-ink-muted">
              {font.label}
            </span>
            <button
              type="button"
              onClick={font.increase}
              disabled={font.index === 2}
              className="flex size-9 items-center justify-center text-sm font-medium text-ink-soft transition-colors hover:bg-cream-200 disabled:opacity-40"
            >
              అ+
              <span className="sr-only">{t('bible.increaseText')}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              toggle({
                slug: book.slug,
                chapter,
                bookTelugu: book.telugu,
                preview: verses[0]?.slice(0, 90) ?? '',
                savedAt: Date.now(),
              })
            }
            aria-pressed={saved}
            className={`flex min-h-9 items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-xs font-medium transition-colors ${
              saved
                ? 'bg-gold-100 text-gold-700'
                : 'text-ink-soft hover:bg-cream-200 hover:text-forest-800'
            }`}
          >
            <Icon name="bookmark" size={16} />
            {saved ? t('bible.removeBookmark') : t('bible.addBookmark')}
          </button>

          <button
            type="button"
            onClick={() => share(1, verses.length)}
            className="flex min-h-9 items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-xs font-medium text-ink-soft transition-colors hover:bg-cream-200 hover:text-forest-800"
          >
            <Icon name="share" size={16} />
            {t('bible.share')}
          </button>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {status === 'copied'
          ? 'వాక్యం కాపీ అయ్యింది'
          : status === 'failed'
            ? 'వాక్యాన్ని కాపీ చేయలేకపోయాము'
            : ''}
      </p>
      {status !== 'idle' ? (
        <p
          className={`mb-4 text-sm ${status === 'copied' ? 'text-forest-700' : 'text-gold-700'}`}
        >
          {status === 'copied'
            ? 'వాక్యం కాపీ అయ్యింది.'
            : 'వాక్యాన్ని కాపీ చేయలేకపోయాము. దయచేసి మళ్ళీ ప్రయత్నించండి.'}
        </p>
      ) : null}

      <BibleLanguageNotice className="mb-5" />

      {/*
        The text. Verse numbers hang in the margin so the prose stays unbroken.

        `lang="te"` is fixed rather than inherited: these strings are the Telugu
        BSI text in every interface language, so assistive tech must read them as
        Telugu even when the surrounding chrome is English.
      */}
      <ol lang="te" className={`space-y-1 ${font.step.className}`}>
        {verses.map((text, index) => {
          const number = index + 1
          return (
            <li
              key={number}
              id={`v${number}`}
              ref={(node) => {
                if (node) verseRefs.current.set(number, node)
                else verseRefs.current.delete(number)
              }}
              className="group/verse relative scroll-mt-32 rounded-[var(--radius-sm)] px-1 py-1"
            >
              <span
                aria-hidden="true"
                className="absolute start-0 top-[0.55em] w-[1.9em] select-none text-[0.62em] font-semibold text-gold-600"
              >
                {number}
              </span>
              <span className="ps-[2.2em] text-forest-950">{text}</span>

              <button
                type="button"
                onClick={() => share(number, number)}
                className="ms-2 inline-flex size-7 items-center justify-center rounded-full text-ink-muted opacity-0 transition-opacity hover:bg-cream-200 hover:text-forest-800 focus-visible:opacity-100 group-hover/verse:opacity-100"
              >
                <Icon name="share" size={15} />
                <span className="sr-only">{number} వాక్యం భాగం చేయండి</span>
              </button>
            </li>
          )
        })}
      </ol>

      <p lang="te" className="mt-8 text-xs text-ink-muted">
        {book.english} · {book.telugu} {chapter} · మొత్తం {verses.length} వాక్యాలు
      </p>

      <div className="mt-8">
        <ChapterPager
          previous={
            neighbour
              ? { ...neighbour, label: chapterLabel(neighbour.slug, neighbour.chapter) }
              : undefined
          }
          next={
            following
              ? { ...following, label: chapterLabel(following.slug, following.chapter) }
              : undefined
          }
        />
      </div>

      <div className="mt-6">
        <Link
          to={`/bible/${book.slug}`}
          className="link-underline inline-flex items-center gap-1.5 text-sm text-forest-700"
        >
          <Icon name="book-open" size={16} />
          {book.telugu} అన్ని అధ్యాయాలు
        </Link>
      </div>
    </div>
  )
}
