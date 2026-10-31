import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_SITE_TEXTS,
  fetchLiveSiteTexts,
  saveSiteTextsToFirestore,
  type TextDefinition,
} from '../../services/siteTextService'
import { Icon } from '../ui/Icon'

interface SiteTextManagerProps {
  onNotify: (message: string, type?: 'success' | 'error') => void
}

type PageCategory = 'all' | 'home' | 'bible' | 'videos' | 'questions' | 'articles' | 'contact' | 'about' | 'footer' | 'custom'

const PAGE_TABS: Array<{ id: PageCategory; label: string; countHint?: number }> = [
  { id: 'all', label: 'అన్నీ (All)' },
  { id: 'home', label: 'హోమ్ పేజీ (Home)' },
  { id: 'bible', label: 'బైబిల్ (Bible)' },
  { id: 'videos', label: 'సందేశాలు (Messages)' },
  { id: 'questions', label: 'ప్రశ్నలు (Questions)' },
  { id: 'articles', label: 'వ్యాసాలు (Articles)' },
  { id: 'contact', label: 'సంప్రదింపు & చిరునామా (Contact)' },
  { id: 'about', label: 'గురించి (About)' },
  { id: 'footer', label: 'ఫుటర్ & గ్లోబల్ (Footer)' },
  { id: 'custom', label: 'కస్టమ్ కీలు (Custom)' },
]

export function SiteTextManager({ onNotify }: SiteTextManagerProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [siteTexts, setSiteTexts] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<PageCategory>('all')

  // New custom key form
  const [customKey, setCustomKey] = useState('')
  const [customValue, setCustomValue] = useState('')

  useEffect(() => {
    loadTexts()
  }, [])

  const loadTexts = async () => {
    setLoading(true)
    try {
      const live = await fetchLiveSiteTexts()
      setSiteTexts(live)
    } catch {
      onNotify('డేటా లోడ్ చేయడంలో సమస్య ఏర్పడింది', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Count how many keys have overrides
  const modifiedCount = useMemo(() => {
    let count = 0
    for (const def of DEFAULT_SITE_TEXTS) {
      if (siteTexts[def.key] !== undefined && siteTexts[def.key] !== def.defaultValue) {
        count++
      }
    }
    // Also count any custom keys not in default catalog
    const defaultKeys = new Set(DEFAULT_SITE_TEXTS.map((d) => d.key))
    for (const key of Object.keys(siteTexts)) {
      if (!defaultKeys.has(key) && siteTexts[key].trim() !== '') {
        count++
      }
    }
    return count
  }, [siteTexts])

  // Custom keys list
  const customKeysList = useMemo(() => {
    const defaultKeys = new Set(DEFAULT_SITE_TEXTS.map((d) => d.key))
    return Object.keys(siteTexts).filter((key) => !defaultKeys.has(key))
  }, [siteTexts])

  // Filtered definitions
  const visibleDefinitions = useMemo(() => {
    const q = search.trim().toLowerCase()
    return DEFAULT_SITE_TEXTS.filter((def) => {
      // Category filter
      if (activeCategory !== 'all' && activeCategory !== 'custom' && def.page !== activeCategory) {
        return false
      }
      if (activeCategory === 'custom') {
        return false
      }

      // Search query
      if (!q) return true
      const currentVal = siteTexts[def.key] ?? def.defaultValue
      return (
        def.key.toLowerCase().includes(q) ||
        def.label.toLowerCase().includes(q) ||
        def.defaultValue.toLowerCase().includes(q) ||
        currentVal.toLowerCase().includes(q)
      )
    })
  }, [activeCategory, search, siteTexts])

  const handleTextChange = (key: string, value: string) => {
    setSiteTexts((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleResetSingle = (def: TextDefinition) => {
    setSiteTexts((prev) => {
      const next = { ...prev }
      delete next[def.key]
      return next
    })
    onNotify(`"${def.label}" డిఫాల్ట్ విలువకు రీసెట్ చేయబడింది.`)
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      // Clean empty keys
      const cleaned: Record<string, string> = {}
      for (const [key, val] of Object.entries(siteTexts)) {
        if (val !== undefined && val.trim() !== '') {
          cleaned[key] = val.trim()
        }
      }

      await saveSiteTextsToFirestore(cleaned)
      setSiteTexts(cleaned)
      onNotify('అన్ని పాఠ్య సవరణలు విజయవంతంగా సేవ్ అయ్యాయి! వెబ్‌సైట్‌లో లైవ్‌గా మారాయి.')
    } catch {
      onNotify('సేవ్ చేయడంలో లోపం సంభవించింది. దయచేసి మళ్ళీ ప్రయత్నించండి.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCustomKey = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanKey = customKey.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '.')
    if (!cleanKey) {
      onNotify('చెల్లుబాటు అయ్యే కీ పేరును నమోదు చేయండి', 'error')
      return
    }
    if (siteTexts[cleanKey] !== undefined) {
      onNotify('ఈ కీ ఇప్పటికే ఉంది', 'error')
      return
    }

    setSiteTexts((prev) => ({
      ...prev,
      [cleanKey]: customValue.trim(),
    }))

    setCustomKey('')
    setCustomValue('')
    onNotify(`కొత్త కీ "${cleanKey}" జోడించబడింది. సేవ్ చేయడం మర్చిపోకండి!`)
  }

  const handleDeleteCustomKey = (key: string) => {
    setSiteTexts((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    onNotify(`కీ "${key}" తొలగించబడింది.`)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Card */}
      <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-forest-800 text-cream-50">
                <Icon name="quote" size={18} />
              </span>
              <div>
                <h2 className="text-xl font-serif font-bold text-forest-950">
                  వెబ్‌సైట్ పాఠ్య సవరణల మేనేజర్ (Site Text Corrections)
                </h2>
                <p className="text-xs text-ink-muted">
                  ఏ పేజీలోని పాఠ్యాన్నైనా ఇక్కడి నుండి నేరుగా సవరించవచ్చు — కోడ్ మార్చకుండానే సైట్‌లో లైవ్‌గా అప్‌డేట్ అవుతుంది.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2 text-xs font-semibold text-ink-soft hover:bg-cream-100 hover:text-ink-strong"
            >
              <Icon name="external" size={14} />
              లైవ్ సైట్ చూడండి
            </a>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-forest-800 px-5 py-2.5 text-xs font-semibold text-cream-50 shadow-md transition-all hover:bg-forest-900 disabled:opacity-50"
            >
              <Icon name="check" size={15} />
              {saving ? 'సేవ్ అవుతోంది...' : 'అన్ని మార్పులను సేవ్ చేయండి (Save All)'}
            </button>
          </div>
        </div>

        {/* Stats & Quick Info */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-cream-200 pt-4 sm:grid-cols-4 text-xs">
          <div className="rounded-xl bg-cream-50 p-3">
            <span className="text-ink-muted">మొత్తం అందుబాటులో ఉన్న టెక్స్ట్‌లు:</span>
            <p className="mt-0.5 text-base font-bold text-forest-950">
              {DEFAULT_SITE_TEXTS.length + customKeysList.length}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3">
            <span className="text-emerald-800">ప్రత్యేకంగా సవరించినవి:</span>
            <p className="mt-0.5 text-base font-bold text-emerald-950">{modifiedCount}</p>
          </div>
          <div className="rounded-xl bg-cream-50 p-3">
            <span className="text-ink-muted">డిఫాల్ట్ రూపంలో ఉన్నవి:</span>
            <p className="mt-0.5 text-base font-bold text-forest-950">
              {DEFAULT_SITE_TEXTS.length - modifiedCount + customKeysList.length}
            </p>
          </div>
          <div className="rounded-xl bg-cream-50 p-3">
            <span className="text-ink-muted">కస్టమ్ జోడించిన కీలు:</span>
            <p className="mt-0.5 text-base font-bold text-forest-950">{customKeysList.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                activeCategory === tab.id
                  ? 'bg-forest-800 text-cream-50 shadow-sm'
                  : 'bg-white text-ink-soft border border-cream-300 hover:bg-cream-100 hover:text-forest-950'
              }`}
            >
              {tab.label}
              {tab.id === 'custom' && customKeysList.length > 0 ? ` (${customKeysList.length})` : ''}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="టెక్స్ట్ లేదా శీర్షిక వెతకండి..."
            className="w-full rounded-xl border border-cream-300 bg-white py-2 ps-9 pe-3 text-xs placeholder:text-ink-muted focus:border-forest-600 focus:outline-none"
          />
          <span className="pointer-events-none absolute left-3 top-2.5 text-ink-muted">
            <Icon name="search" size={14} />
          </span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 text-ink-muted hover:text-ink-strong"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="rounded-2xl border border-cream-300 bg-white p-12 text-center">
          <p className="text-sm text-ink-muted">పాఠ్య వివరాలు లోడ్ అవుతున్నాయి...</p>
        </div>
      ) : (
        <>
          {/* Predefined Field Catalog */}
          {activeCategory !== 'custom' && (
            <div className="space-y-4">
              {visibleDefinitions.length === 0 ? (
                <div className="rounded-2xl border border-cream-300 bg-white p-12 text-center text-ink-muted">
                  వెతకిన పదానికి సరిపోలిన పాఠ్యాలు ఏవీ కనబడలేదు.
                </div>
              ) : (
                visibleDefinitions.map((def) => {
                  const currentValue = siteTexts[def.key] ?? def.defaultValue
                  const isModified = siteTexts[def.key] !== undefined && siteTexts[def.key] !== def.defaultValue

                  return (
                    <article
                      key={def.key}
                      className={`relative rounded-2xl border p-5 transition-all ${
                        isModified
                          ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                          : 'border-cream-300 bg-white shadow-2xs'
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif font-bold text-forest-950 text-sm">
                              {def.label}
                            </h3>
                            <code className="rounded bg-cream-200/70 px-1.5 py-0.5 text-[11px] font-mono text-ink-muted">
                              {def.key}
                            </code>
                            {isModified ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                                సవరించబడింది (Live Override)
                              </span>
                            ) : (
                              <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                                డిఫాల్ట్ (Default)
                              </span>
                            )}
                          </div>
                          {def.description && (
                            <p className="mt-1 text-xs text-ink-muted">{def.description}</p>
                          )}
                        </div>

                        {/* Reset Single Button */}
                        {isModified && (
                          <button
                            type="button"
                            onClick={() => handleResetSingle(def)}
                            className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-gold-700 hover:text-gold-900 hover:underline"
                          >
                            <Icon name="refresh" size={12} />
                            డిఫాల్ట్‌కి రీసెట్ చేయండి
                          </button>
                        )}
                      </div>

                      {/* Current Value Input */}
                      <div className="mt-3">
                        {def.multiline ? (
                          <textarea
                            rows={3}
                            value={currentValue}
                            onChange={(e) => handleTextChange(def.key, e.target.value)}
                            className="w-full rounded-xl border border-cream-300 bg-cream-50/50 p-3 text-sm leading-relaxed text-forest-950 focus:border-forest-700 focus:bg-white focus:outline-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => handleTextChange(def.key, e.target.value)}
                            className="w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3.5 py-2.5 text-sm text-forest-950 focus:border-forest-700 focus:bg-white focus:outline-none"
                          />
                        )}
                      </div>

                      {/* Reference default value */}
                      <div className="mt-2 text-[11px] text-ink-muted">
                        <span className="font-semibold text-ink-soft">సిస్టమ్ డిఫాల్ట్: </span>
                        <span className="italic">{def.defaultValue}</span>
                      </div>
                    </article>
                  )
                })
              )}
            </div>
          )}

          {/* Custom Keys Tab */}
          {(activeCategory === 'custom' || activeCategory === 'all') && (
            <div className="mt-8 rounded-2xl border border-gold-300/80 bg-gold-50/30 p-6">
              <div className="flex items-center gap-2">
                <Icon name="sparkle" size={18} className="text-gold-700" />
                <h3 className="font-serif font-bold text-forest-950 text-base">
                  కొత్త కస్టమ్ పాఠ్యం జోడించండి (Add Custom Text Key)
                </h3>
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                ఏదైనా ప్రత్యేక నోటీస్ లేదా కొత్త శీర్షికను సైట్‌లోకి చేర్చడానికి కస్టమ్ కీని నమోదు చేయండి.
              </p>

              <form onSubmit={handleAddCustomKey} className="mt-4 grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
                <input
                  type="text"
                  required
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="కీ పేరు (ఉదా: announcement.banner)"
                  className="rounded-xl border border-cream-300 bg-white px-3.5 py-2 text-xs font-mono focus:border-forest-600 focus:outline-none"
                />
                <input
                  type="text"
                  required
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="పాఠ్యం (Text content in Telugu)..."
                  className="rounded-xl border border-cream-300 bg-white px-3.5 py-2 text-xs focus:border-forest-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-forest-800 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-900"
                >
                  <Icon name="check" size={13} />
                  జోడించండి (Add)
                </button>
              </form>

              {customKeysList.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                    ఇప్పటికే ఉన్న కస్టమ్ కీలు ({customKeysList.length}):
                  </h4>
                  {customKeysList.map((key) => (
                    <div
                      key={key}
                      className="flex flex-col gap-2 rounded-xl border border-cream-300 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <code className="text-xs font-mono font-bold text-forest-900">{key}</code>
                        <input
                          type="text"
                          value={siteTexts[key] || ''}
                          onChange={(e) => handleTextChange(key, e.target.value)}
                          className="mt-1 w-full rounded-lg border border-cream-300 px-3 py-1.5 text-xs focus:border-forest-600 focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomKey(key)}
                        className="inline-flex shrink-0 items-center gap-1 text-xs text-rose-600 hover:text-rose-800"
                      >
                        <Icon name="trash" size={13} />
                        తొలగించు
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Save Action Bar */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-forest-300 bg-forest-950/95 p-4 text-cream-50 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-gold-500 text-forest-950 font-bold text-xs">
                {modifiedCount}
              </span>
              <span className="text-xs text-cream-200">
                సవరించిన అంశాలు ఉన్నాయి. మార్పులు లైవ్‌లోకి రావడానికి సేవ్ చేయండి.
              </span>
            </div>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2 text-xs font-bold text-forest-950 shadow-md transition-all hover:bg-gold-400 disabled:opacity-50"
            >
              <Icon name="check" size={15} />
              {saving ? 'సేవ్ అవుతోంది...' : 'అన్ని మార్పులను సేవ్ చేయండి (Save All)'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
