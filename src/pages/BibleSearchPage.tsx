import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BibleSearchResults } from '../components/bible/BibleSearchResults'
import { SearchField } from '../components/ui/SearchField'
import { PageHeader } from '../components/ui/Layout'
import { useDebounced } from '../hooks/useUi'
import { useSeo } from '../hooks/useSeo'

/**
 * Full-text Bible search.
 *
 * The query lives in the URL so a search can be linked, bookmarked or shared,
 * and the back button behaves the way people expect.
 */
export function BibleSearchPage() {
  const [params, setParams] = useSearchParams()
  const urlQuery = params.get('q') ?? ''

  // Typing updates local state immediately; only the debounced value reaches
  // the URL, so the field stays responsive.
  const [input, setInput] = useState(urlQuery)
  const query = useDebounced(input, 240)

  // Keep the address bar in step with the field without adding history entries
  // for every keystroke.
  useEffect(() => {
    if (query === urlQuery) return
    setParams(query ? { q: query } : {}, { replace: true })
  }, [query, urlQuery, setParams])

  // Adopt a query that arrived from elsewhere (back/forward, a shared link)
  // during render rather than in an effect, which would flash stale results.
  const [syncedQuery, setSyncedQuery] = useState(urlQuery)
  if (syncedQuery !== urlQuery) {
    setSyncedQuery(urlQuery)
    setInput(urlQuery)
  }

  useSeo({
    title: 'బైబిల్‌లో వెతకండి',
    description:
      'పరిశుద్ధ తెలుగు బైబిల్‌లో మీరు జాగ్రత్తగా వాడిన పదాన్ని వెతకండి — పుస్తకం, అధ్యాయం, వాక్య సంఖ్యతో సహా.',
    path: urlQuery ? `/bible/search?q=${urlQuery}` : '/bible/search',
    noIndex: true,
  })

  return (
    <>
      <PageHeader
        eyebrow="బైబిల్ అన్వేషణ"
        title="బైబిల్‌లో వెతకండి"
        icon="search"
        lede="66 పుస్తకాలను అన్వేషిస్తుంది. మీరు టైప్ చేస్తున్న కొద్దీ మీకు ఫలితాలు కనిపిస్తాయి."
        crumbs={[
          { label: 'హోమ్', to: '/' },
          { label: 'బైబిల్', to: '/bible' },
          { label: 'వెతకడం' },
        ]}
      />

      <div className="shell py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <SearchField
            label="బైబిల్‌లో వెతకండి"
            hideLabel
            autoFocus
            size="lg"
            placeholder="ఉదా: దేవుడు ప్రేమ"
            value={input}
            onChange={setInput}
            hint="కనీసం రెండు అక్షరాలు టైప్ చేయండి. అన్ని అక్షరాలను టైప్ చేయవలసిన అవసరం లేదు."
          />

          <div className="mt-10">
            {query.trim().length >= 2 ? (
              <BibleSearchResults key={query} query={query} />
            ) : (
              <div className="rounded-[var(--radius-lg)] border border-dashed border-cream-400 bg-cream-50 px-6 py-14 text-center">
                <h2 className="text-lg text-forest-900">ఏది వెతకాలనుకుంటున్నారు?</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                  దేవుని పేరు, ప్రార్థన, శిక్షలు, వాక్యాలు — ఏదైనా పదాన్ని టైప్ చేయండి.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
