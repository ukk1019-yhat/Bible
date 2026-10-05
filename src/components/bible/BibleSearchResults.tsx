import { Link } from 'react-router-dom'
import { useBibleSearch, type BibleSearchHit } from '../../services/bibleSearch'
import { highlight } from '../../utils/text'
import { Icon } from '../ui/Icon'

/**
 * Renders results for one query. Streams in as books finish loading, so the
 * first matches appear well before the whole canon has been scanned.
 */
export function BibleSearchResults({ query }: { query: string }) {
  const { status, progress, hits, booksScanned, error } = useBibleSearch(query)
  const searching = status === 'searching'

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm text-ink-soft" role="status" aria-live="polite">
          {status === 'searching'
            ? `వెతకుతోంది… ${hits.length.toLocaleString('te-IN')} ఫలితాలు (${booksScanned}/66 పుస్తకాలు)`
            : status === 'done'
              ? `${hits.length.toLocaleString('te-IN')} వాక్యాల్లో దొరికింది`
              : error
                ? 'వెతకడంలో లోపం వచ్చింది'
                : ''}
        </p>

        {searching ? (
          <div
            className="h-1 w-40 overflow-hidden rounded-full bg-cream-300"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="వెతకుతున్న పుస్తకాల ప్రగతి"
          >
            <div
              className="h-full rounded-full bg-forest-500 transition-[width] duration-300"
              style={{ width: `${Math.max(4, progress * 100)}%` }}
            />
          </div>
        ) : null}
      </div>

      {hits.length === 0 && !searching ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-cream-400 bg-cream-50 px-6 py-12 text-center">
          <h3 className="text-lg text-forest-900">ఈ పదం కనబడలేదు</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            వేరే పదంతో ప్రయత్నించండి, లేదా కొంత వాటితో అన్వేషించండి — ఉదాహరణకు “దేవుడు
            ప్రేమ”.
          </p>
        </div>
      ) : null}

      {hits.length > 0 ? (
        <ul className="divide-y divide-cream-300 border-y border-cream-300">
          {hits.map((hit) => (
            <li key={`${hit.bookSlug}-${hit.chapter}-${hit.verse}`}>
              <SearchHit hit={hit} query={query} />
            </li>
          ))}
        </ul>
      ) : null}

      {searching ? (
        <p className="mt-5 text-xs text-ink-muted">
          ఫలితాలు అన్నీ కనిపించే వరకు ఎదురు చూస్తున్నాం — ప్రతి పుస్తకం చదవడంతో కొత్తవి
          కనిపిస్తాయి.
        </p>
      ) : null}
    </div>
  )
}

function SearchHit({ hit, query }: { hit: BibleSearchHit; query: string }) {
  const path = `/bible/${hit.bookSlug}/${hit.chapter}#v${hit.verse}`
  const parts = highlight(hit.text, query)

  return (
    <Link to={path} className="group flex flex-col gap-1.5 py-4">
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-muted">
        <span className="font-medium text-forest-800">{hit.bookTelugu}</span>
        <span aria-hidden="true">·</span>
        <span>
          {hit.chapter}:{hit.verse}
        </span>
        <span className="ms-auto font-sans text-[0.68rem] uppercase tracking-wider text-cream-400">
          {hit.bookEnglish}
        </span>
      </span>

      <span className="text-[1rem] leading-relaxed text-ink-soft transition-colors group-hover:text-forest-900">
        {parts.map((part, i) =>
          part.match ? (
            <mark key={i} className="rounded-[2px] bg-gold-200/70 text-forest-950">
              {part.text}
            </mark>
          ) : (
            <span key={i}>{part.text}</span>
          ),
        )}
      </span>

      <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-forest-700 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        ఈ అధ్యాయం చదవండి
        <Icon name="arrow-right" size={13} />
      </span>
    </Link>
  )
}
