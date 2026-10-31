import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BIBLE_BOOKS, type Testament } from '../../data/bible/books.generated'
import { Icon, type IconName } from '../ui/Icon'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useSiteText } from '../../services/siteTextService'

type BookViewStyle = 'cards' | 'compact' | 'list' | 'grouped'

interface BibleCategory {
  id: string
  testament: Testament
  telugu: string
  english: string
  description: string
  slugs: string[]
}

const BIBLE_CATEGORIES: BibleCategory[] = [
  // పాత నిబంధన (Old Testament) — 39 పుస్తకాలు
  {
    id: 'law',
    testament: 'ot',
    telugu: 'ధర్మశాస్త్ర గ్రంథాలు (తోరా)',
    english: 'The Law / Pentateuch',
    description: 'మోషే రాసిన మొదటి 5 గ్రంథాలు — సృష్టి, నిబంధనలు మరియు దైవాజ్ఞలు.',
    slugs: ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy'],
  },
  {
    id: 'ot-history',
    testament: 'ot',
    telugu: 'చరిత్ర గ్రంథాలు',
    english: 'Historical Books',
    description: 'కనాను ప్రవేశం మొదలుకొని ఇశ్రాయేలు రాజులు మరియు బబులోను చెర వరకు చరిత్ర.',
    slugs: [
      'joshua',
      'judges',
      'ruth',
      '1-samuel',
      '2-samuel',
      '1-kings',
      '2-kings',
      '1-chronicles',
      '2-chronicles',
      'ezra',
      'nehemiah',
      'esther',
    ],
  },
  {
    id: 'poetry',
    testament: 'ot',
    telugu: 'కావ్య & జ్ఞాన గ్రంథాలు',
    english: 'Poetry & Wisdom Literature',
    description: 'కీర్తనలు, స్తుతులు, ప్రార్థనలు మరియు జీవిత జ్ఞానోపదేశాలు.',
    slugs: ['job', 'psalms', 'proverbs', 'ecclesiastes', 'song-of-solomon'],
  },
  {
    id: 'major-prophets',
    testament: 'ot',
    telugu: 'ప్రధాన ప్రవక్తలు',
    english: 'Major Prophets',
    description: 'రక్షణ, మెస్సీయ రాకడ మరియు తీర్పు గురించిన సుదీర్ఘ ప్రవచనాలు.',
    slugs: ['isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel'],
  },
  {
    id: 'minor-prophets',
    testament: 'ot',
    telugu: 'చిన్న ప్రవక్తలు',
    english: 'Minor Prophets',
    description: 'పన్నెండుగురు భక్త ప్రవక్తల ద్వారా దేవుని గంభీర సందేశాలు.',
    slugs: [
      'hosea',
      'joel',
      'amos',
      'obadiah',
      'jonah',
      'micah',
      'nahum',
      'habakkuk',
      'zephaniah',
      'haggai',
      'zechariah',
      'malachi',
    ],
  },
  // క్రొత్త నిబంధన (New Testament) — 27 పుస్తకాలు
  {
    id: 'gospels',
    testament: 'nt',
    telugu: 'సువార్తలు',
    english: 'The Gospels',
    description: 'యేసుక్రీస్తు జననం, జీవితం, పరిచర్య, సిలువ మరణం మరియు పునరుత్థానం.',
    slugs: ['matthew', 'mark', 'luke', 'john'],
  },
  {
    id: 'church-history',
    testament: 'nt',
    telugu: 'ఆదిమ సంఘ చరిత్ర',
    english: 'Church History',
    description: 'పరిశుద్ధాత్మ దిగిరావడం, అపొస్తలుల సువార్త ప్రకటనా విస్తరణ.',
    slugs: ['acts'],
  },
  {
    id: 'pauline-epistles',
    testament: 'nt',
    telugu: 'పౌలు పత్రికలు',
    english: 'Pauline Epistles',
    description: 'అపొస్తలుడైన పౌలు వివిధ సంఘాలకు మరియు వ్యక్తులకు రాసిన ఉపదేశ లేఖలు.',
    slugs: [
      'romans',
      '1-corinthians',
      '2-corinthians',
      'galatians',
      'ephesians',
      'philippians',
      'colossians',
      '1-thessalonians',
      '2-thessalonians',
      '1-timothy',
      '2-timothy',
      'titus',
      'philemon',
      'hebrews',
    ],
  },
  {
    id: 'general-epistles',
    testament: 'nt',
    telugu: 'సాధారణ పత్రికలు',
    english: 'General Epistles',
    description: 'యాకోబు, పేతురు, యోహాను, యూదా రాసిన క్రైస్తవ జీవిత విశ్వాస సందేశాలు.',
    slugs: ['james', '1-peter', '2-peter', '1-john', '2-john', '3-john', 'jude'],
  },
  {
    id: 'prophecy',
    testament: 'nt',
    telugu: 'ప్రకటన గ్రంథము',
    english: 'Prophecy / Revelation',
    description: 'యేసుక్రీస్తు రెండవ రాకడ, అంతిమ తీర్పు మరియు నూతన నిత్యరాజ్య దర్శనం.',
    slugs: ['revelation'],
  },
]

const BOOK_CATEGORY_MAP = new Map<string, BibleCategory>()
for (const cat of BIBLE_CATEGORIES) {
  for (const slug of cat.slugs) {
    BOOK_CATEGORY_MAP.set(slug, cat)
  }
}

const STYLE_OPTIONS: {
  key: BookViewStyle
  name: string
  label: string
  icon: IconName
  help: string
}[] = [
  {
    key: 'cards',
    name: 'కార్డులు',
    label: 'వివరణాత్మక కార్డుల శైలి (Cards Grid)',
    icon: 'grid',
    help: 'పుస్తక వివరాలు, అధ్యాయాలు & వాక్యాల సంఖ్యలతో పెద్ద కార్డులు',
  },
  {
    key: 'compact',
    name: 'కాంపాక్ట్',
    label: 'శీఘ్ర ఎంపిక గ్రిడ్ (Compact Grid)',
    icon: 'grid-compact',
    help: 'స్క్రోలింగ్ లేకుండా అన్ని పుస్తకాలను ఒకే చూపులో వేగంగా ఎంచుకునే కాంపాక్ట్ టైల్స్',
  },
  {
    key: 'list',
    name: 'జాబితా',
    label: 'వరుస క్రమ జాబితా (List View)',
    icon: 'list',
    help: 'వరుస సంఖ్య, విభాగాలు మరియు అధ్యాయాల గణాంకాలతో కూడిన క్రమబద్ధమైన జాబితా',
  },
  {
    key: 'grouped',
    name: 'విభాగాలు',
    label: 'గ్రంథాల విభాగాల వారీగా (Canon Sections)',
    icon: 'layers',
    help: 'సువార్తలు, పత్రికలు, ధర్మశాస్త్రం, ప్రవక్తలు మొదలైన బైబిల్ విభాగాల ప్రకారం వర్గీకరణ',
  },
]

export interface BookGridProps {
  /** Restrict to one testament, e.g. from the "old/new" jump links. */
  testament?: Testament
  /** Books to feature first (e.g. Gospels, Psalms). */
  highlightSlugs?: string[]
}

/**
 * All 66 books, grouped by testament with multiple grid and layout styles.
 * Provides Cards, Compact Grid, List, and Canonical Sections views to give
 * readers the easiest and most convenient way to explore the Word of God.
 */
export function BookGrid({ testament, highlightSlugs = [] }: BookGridProps) {
  const { t } = useSiteText()
  const [active, setActive] = useState<Testament>(testament ?? 'nt')
  const [filter, setFilter] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewStyle, setViewStyle] = useLocalStorage<BookViewStyle>(
    'bible_books_view_style',
    'cards',
  )

  const currentTestament = testament ?? active

  // Categories available for current testament
  const currentCategories = useMemo(
    () => BIBLE_CATEGORIES.filter((cat) => cat.testament === currentTestament),
    [currentTestament],
  )

  const groups = useMemo(() => {
    return {
      term: currentTestament,
      books: BIBLE_BOOKS.filter((book) => book.testament === currentTestament),
    }
  }, [currentTestament])

  const visible = useMemo(() => {
    let result = groups.books

    // Category filter
    if (selectedCategory) {
      const cat = BIBLE_CATEGORIES.find((c) => c.id === selectedCategory)
      if (cat) {
        const slugSet = new Set(cat.slugs)
        result = result.filter((book) => slugSet.has(book.slug))
      }
    }

    // Search query filter
    const q = filter.trim().toLowerCase()
    if (q) {
      result = result.filter((book) =>
        `${book.telugu} ${book.english} ${book.shortTelugu} ${book.number}`
          .toLowerCase()
          .includes(q),
      )
    }

    return result
  }, [groups.books, selectedCategory, filter])

  const highlighted = useMemo(
    () => new Set(highlightSlugs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightSlugs.join(',')],
  )

  // Reset category filter when switching testaments
  const handleTestamentChange = (key: Testament) => {
    setActive(key)
    setSelectedCategory(null)
  }

  return (
    <div className="space-y-6">
      {/* ------------------- Testament Switcher Tabs ------------------- */}
      {!testament ? (
        <div
          role="tablist"
          aria-label="నిబంధనాలు"
          className="flex border-b border-cream-300"
        >
          {[
            { key: 'ot' as Testament, telugu: t('bible.ot.label', 'పాత నిబంధన'), english: 'Old Testament' },
            { key: 'nt' as Testament, telugu: t('bible.nt.label', 'నూతన నిబంధన'), english: 'New Testament' },
          ].map((item) => {
            const isSelected = currentTestament === item.key
            const bookCount = BIBLE_BOOKS.filter((b) => b.testament === item.key).length
            return (
              <button
                key={item.key}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => handleTestamentChange(item.key)}
                className={`group relative -mb-px flex items-center gap-2 border-b-2 px-5 py-3.5 text-[0.98rem] transition-all ${
                  isSelected
                    ? 'border-forest-800 font-semibold text-forest-900 bg-cream-100/50 rounded-t-[var(--radius-sm)]'
                    : 'border-transparent text-ink-muted hover:border-cream-400 hover:text-forest-700'
                }`}
              >
                <span>{item.telugu}</span>
                <span className="hidden text-xs text-ink-muted sm:inline">
                  ({item.english})
                </span>
                <span
                  className={`ms-1 rounded-full px-2 py-0.5 text-2xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-forest-800 text-cream-50'
                      : 'bg-cream-200 text-ink-muted group-hover:bg-cream-300'
                  }`}
                >
                  {bookCount}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      {/* ------------------- Control Bar: Search + Style Switcher ------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Field */}
        <div className="relative flex-1 sm:max-w-xs">
          <label htmlFor="bible-book-filter" className="sr-only">
            పుస్తకం పేరు ప్రకారం వెతకండి
          </label>
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            <Icon name="search" size={17} />
          </span>
          <input
            id="bible-book-filter"
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="పుస్తకం పేరును వెతకండి…"
            className="min-h-11 w-full rounded-[var(--radius-md)] border border-cream-400 bg-cream-50 ps-10 pe-9 text-sm text-ink placeholder:text-ink-muted/80 transition-colors focus:border-forest-600 focus:bg-white focus:outline-none"
          />
          {filter ? (
            <button
              type="button"
              onClick={() => setFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-ink-muted transition-colors hover:text-forest-900"
              title="వెతకింపును తొలగించండి"
              aria-label="వెతకింపును తొలగించండి"
            >
              <Icon name="close" size={15} />
            </button>
          ) : null}
        </div>

        {/* View Style Switcher + Book Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          <p className="text-xs sm:text-sm font-medium text-ink-soft" role="status">
            <span className="font-semibold text-forest-900">{visible.length}</span> పుస్తకాలు
            {selectedCategory ? (
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="ms-2 text-2xs text-gold-700 underline hover:text-gold-800"
              >
                (ఫిల్టర్ తొలగించు)
              </button>
            ) : null}
          </p>

          {/* Grid Style Toggle Buttons */}
          <div
            role="group"
            aria-label="పుస్తకాల ప్రదర్శన శైలి (Book Grid Style)"
            className="inline-flex items-center rounded-[var(--radius-md)] border border-cream-300 bg-cream-100 p-1 shadow-xs"
          >
            <span className="hidden ps-2 pe-1.5 text-xs font-medium text-ink-muted lg:inline">
              శైలి:
            </span>
            {STYLE_OPTIONS.map((opt) => {
              const isCurrent = viewStyle === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setViewStyle(opt.key)}
                  aria-pressed={isCurrent}
                  title={`${opt.label} — ${opt.help}`}
                  className={`inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-forest-800 text-cream-50 shadow-sm'
                      : 'text-ink-soft hover:bg-cream-200 hover:text-forest-950'
                  }`}
                >
                  <Icon name={opt.icon} size={15} />
                  <span className="hidden sm:inline">{opt.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ------------------- Quick Category Jump / Filter Pills ------------------- */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="shrink-0 text-2xs uppercase tracking-wider font-semibold text-ink-muted pe-1">
          విభాగాలు:
        </span>
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          aria-pressed={selectedCategory === null}
          className={`shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
            selectedCategory === null
              ? 'bg-forest-800 font-medium text-cream-50'
              : 'bg-cream-200/80 text-ink-soft hover:bg-cream-300 hover:text-forest-900'
          }`}
        >
          అన్నీ ({groups.books.length})
        </button>
        {currentCategories.map((cat) => {
          const isCatSelected = selectedCategory === cat.id
          const count = cat.slugs.filter((s) => groups.books.some((b) => b.slug === s)).length
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(isCatSelected ? null : cat.id)}
              aria-pressed={isCatSelected}
              className={`shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
                isCatSelected
                  ? 'bg-forest-800 font-medium text-cream-50'
                  : 'bg-cream-200/80 text-ink-soft hover:bg-cream-300 hover:text-forest-900'
              }`}
            >
              {cat.telugu} ({count})
            </button>
          )
        })}
      </div>

      {/* ------------------- Empty State ------------------- */}
      {visible.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-cream-300 bg-cream-50/50 py-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-cream-200 text-ink-muted">
            <Icon name="search" size={22} />
          </div>
          <h3 className="mt-3 text-base font-semibold text-forest-950">
            పుస్తకాలు కనుగొనబడలేదు
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            &ldquo;{filter}&rdquo; పేరుతో ఏ పుస్తకమూ సరిపోలలేదు.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            {filter ? (
              <button
                type="button"
                onClick={() => setFilter('')}
                className="rounded-full bg-forest-800 px-4 py-1.5 text-xs font-medium text-cream-50 transition-colors hover:bg-forest-900"
              >
                వెతకింపును తొలగించండి
              </button>
            ) : null}
            {selectedCategory ? (
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="rounded-full border border-cream-400 bg-cream-100 px-4 py-1.5 text-xs font-medium text-forest-900 transition-colors hover:bg-cream-200"
              >
                అన్ని విభాగాలు చూపించు
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ------------------- View Style 1: Cards View (కార్డులు) ------------------- */}
      {visible.length > 0 && viewStyle === 'cards' && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((book) => {
            const category = BOOK_CATEGORY_MAP.get(book.slug)
            return (
              <li key={book.slug}>
                <Link
                  to={`/bible/${book.slug}`}
                  className="group relative flex h-full flex-col justify-between rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-cream-200 font-mono text-2xs font-semibold text-forest-900">
                          {book.number}
                        </span>
                        {category ? (
                          <span className="truncate rounded-sm bg-forest-100/60 px-1.5 py-0.5 text-2xs font-medium text-forest-800">
                            {category.telugu}
                          </span>
                        ) : null}
                      </div>

                      {highlighted.has(book.slug) ? (
                        <span className="shrink-0 rounded-full bg-gold-100 px-2 py-0.5 text-2xs font-medium text-gold-800">
                          ప్రధానం
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3">
                      <p className="font-serif text-[1.12rem] font-semibold text-forest-950 group-hover:text-forest-700">
                        {book.telugu}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-muted font-sans">{book.english}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-cream-200/80 pt-3">
                    <p className="text-xs text-ink-muted">
                      <span className="font-medium text-forest-900">{book.chapters}</span>{' '}
                      అధ్యాయాలు ·{' '}
                      <span className="font-medium text-forest-900">
                        {book.verses.toLocaleString('te-IN')}
                      </span>{' '}
                      వాక్యాలు
                    </p>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 group-hover:translate-x-0.5 transition-transform">
                      అధ్యాయాలు
                      <Icon name="arrow-right" size={13} />
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {/* ------------------- View Style 2: Compact Tiles Grid (కాంపాక్ట్) ------------------- */}
      {visible.length > 0 && viewStyle === 'compact' && (
        <ul className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {visible.map((book) => {
            const isFeatured = highlighted.has(book.slug)
            return (
              <li key={book.slug}>
                <Link
                  to={`/bible/${book.slug}`}
                  className={`group relative flex flex-col justify-between rounded-[var(--radius-md)] border p-3 transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-sm ${
                    isFeatured
                      ? 'border-gold-300 bg-gold-50/40 hover:border-gold-400'
                      : 'border-cream-300 bg-cream-50 hover:border-forest-300 hover:bg-white'
                  }`}
                  title={`${book.telugu} (${book.english}) — ${book.chapters} అధ్యాయాలు`}
                >
                  <div className="flex items-center justify-between text-2xs text-ink-muted">
                    <span className="font-mono font-medium">#{book.number}</span>
                    <span className="rounded-full bg-cream-200/90 px-1.5 py-0.2 text-2xs font-semibold text-forest-900">
                      {book.chapters} అధ్యా.
                    </span>
                  </div>

                  <div className="my-2">
                    <p className="truncate font-serif text-[0.98rem] font-semibold text-forest-950 group-hover:text-forest-700">
                      {book.telugu}
                    </p>
                    <p className="truncate text-2xs text-ink-muted">{book.english}</p>
                  </div>

                  <div className="flex items-center justify-between text-2xs text-forest-700 font-medium opacity-80 group-hover:opacity-100">
                    <span>చదవండి</span>
                    <Icon name="arrow-right" size={11} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {/* ------------------- View Style 3: Detailed List View (జాబితా) ------------------- */}
      {visible.length > 0 && viewStyle === 'list' && (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 shadow-xs">
          <ul className="divide-y divide-cream-300">
            {visible.map((book) => {
              const category = BOOK_CATEGORY_MAP.get(book.slug)
              const isFeatured = highlighted.has(book.slug)
              return (
                <li key={book.slug}>
                  <Link
                    to={`/bible/${book.slug}`}
                    className="group flex flex-col gap-3 p-4 transition-colors hover:bg-forest-100/35 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-cream-200 font-mono text-xs font-semibold text-forest-900">
                        {book.number}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-serif text-[1.05rem] font-semibold text-forest-950 group-hover:text-forest-700">
                            {book.telugu}
                          </p>
                          <span className="text-xs text-ink-muted">({book.english})</span>
                          {category ? (
                            <span className="rounded-sm bg-forest-100/70 px-2 py-0.5 text-2xs font-medium text-forest-800">
                              {category.telugu}
                            </span>
                          ) : null}
                          {isFeatured ? (
                            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-2xs font-medium text-gold-800">
                              ప్రధానం
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-xs text-ink-muted sm:hidden">
                          {book.chapters} అధ్యాయాలు · {book.verses.toLocaleString('te-IN')} వాక్యాలు
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                      <div className="hidden text-end sm:block">
                        <p className="text-xs font-medium text-forest-900">
                          {book.chapters} అధ్యాయాలు
                        </p>
                        <p className="text-2xs text-ink-muted">
                          {book.verses.toLocaleString('te-IN')} వాక్యాలు
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-400 bg-white px-3.5 py-1 text-xs font-medium text-forest-800 transition-colors group-hover:border-forest-400 group-hover:bg-forest-800 group-hover:text-cream-50">
                        అధ్యాయాలు
                        <Icon name="arrow-right" size={13} />
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* ------------------- View Style 4: Canonical Sections View (విభాగాలు) ------------------- */}
      {visible.length > 0 && viewStyle === 'grouped' && (
        <div className="space-y-10">
          {currentCategories.map((cat) => {
            const catBooks = visible.filter((book) => cat.slugs.includes(book.slug))
            if (catBooks.length === 0) return null

            return (
              <section
                key={cat.id}
                aria-labelledby={`cat-${cat.id}`}
                className="rounded-[var(--radius-xl)] border border-cream-300 bg-cream-50/60 p-5 sm:p-6"
              >
                {/* Section Header */}
                <div className="mb-5 flex flex-col gap-1 border-b border-cream-200 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3
                        id={`cat-${cat.id}`}
                        className="font-serif text-lg font-semibold text-forest-950 sm:text-xl"
                      >
                        {cat.telugu}
                      </h3>
                      <span className="text-xs text-ink-muted">({cat.english})</span>
                      <span className="rounded-full bg-forest-800 px-2 py-0.5 text-2xs font-semibold text-cream-50">
                        {catBooks.length} పుస్తకాలు
                      </span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-ink-soft">{cat.description}</p>
                  </div>
                </div>

                {/* Books in this Section */}
                <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {catBooks.map((book) => {
                    const isFeatured = highlighted.has(book.slug)
                    return (
                      <li key={book.slug}>
                        <Link
                          to={`/bible/${book.slug}`}
                          className="group flex flex-col justify-between rounded-[var(--radius-md)] border border-cream-300 bg-white p-3.5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="flex size-5 items-center justify-center rounded-full bg-cream-200 font-mono text-2xs font-semibold text-forest-900">
                                {book.number}
                              </span>
                              {isFeatured ? (
                                <span className="rounded-full bg-gold-100 px-1.5 py-0.2 text-2xs font-medium text-gold-800">
                                  ప్రధానం
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-2 font-serif text-[1rem] font-semibold text-forest-950 group-hover:text-forest-700">
                              {book.telugu}
                            </p>
                            <p className="text-xs text-ink-muted">{book.english}</p>
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-cream-100 pt-2 text-xs text-ink-muted">
                            <span>{book.chapters} అధ్యాయాలు</span>
                            <span className="inline-flex items-center gap-0.5 text-forest-700 font-medium group-hover:translate-x-0.5 transition-transform">
                              చదవండి
                              <Icon name="arrow-right" size={12} />
                            </span>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      {/* ------------------- Footer Summary ------------------- */}
      {testament ? null : (
        <div className="mt-8 rounded-[var(--radius-md)] bg-cream-100/70 p-4 text-xs sm:text-sm text-ink-soft border border-cream-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p>
            మరొక నిబంధన చదవాలంటే పైన ఉన్న ట్యాబ్‌లను ఎంచుకోండి. మొత్తం{' '}
            <strong className="text-forest-950">{BIBLE_BOOKS.length}</strong> పుస్తకాలు,{' '}
            <strong className="text-forest-950">
              {BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0).toLocaleString('te-IN')}
            </strong>{' '}
            అధ్యాయాలు,{' '}
            <strong className="text-forest-950">
              {BIBLE_BOOKS.reduce((sum, b) => sum + b.verses, 0).toLocaleString('te-IN')}
            </strong>{' '}
            వాక్యాలు.
          </p>
          <div className="text-2xs text-ink-muted shrink-0">
            మీరు ఎంచుకున్న శైలి బ్రౌజర్‌లో భద్రపరచబడుతుంది.
          </div>
        </div>
      )}
    </div>
  )
}
