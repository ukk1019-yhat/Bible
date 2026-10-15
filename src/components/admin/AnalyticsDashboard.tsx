import { useState, useMemo, useEffect } from 'react'
import {
  type AnalyticsOverview,
  type ContentClickCategory,
  type ClickEvent,
  type CategoryTotals,
  fetchLiveAnalytics,
  seedSampleClicks,
  clearAllAnalytics,
  exportClicksToCSV,
} from '../../services/analyticsService'
import { Icon } from '../ui/Icon'

interface AnalyticsDashboardProps {
  onNotify: (message: string, type?: 'success' | 'error') => void
}

type TimeframeFilter = 'all' | 'today' | 'week' | 'month'

function filterEventsByTimeframe(events: ClickEvent[], timeframe: TimeframeFilter): ClickEvent[] {
  if (timeframe === 'all') return events
  const now = Date.now()
  const todayStr = new Date(now).toISOString().slice(0, 10)
  const sevenDaysAgo = new Date(now - 7 * 86400000).toISOString().slice(0, 10)
  const thirtyDaysAgo = new Date(now - 30 * 86400000).toISOString().slice(0, 10)

  return events.filter((ev) => {
    if (timeframe === 'today') return ev.date === todayStr
    if (timeframe === 'week') return ev.date >= sevenDaysAgo
    if (timeframe === 'month') return ev.date >= thirtyDaysAgo
    return true
  })
}

function getRelativeTime(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diffSec < 45) return 'ఇప్పుడే'
  if (diffSec < 90) return '1 నిమిషం క్రితం'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} నిమిషాల క్రితం`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours} గంటల క్రితం`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'నిన్న'
  if (diffDays < 7) return `${diffDays} రోజుల క్రితం`
  return d.toLocaleDateString('te-IN', { month: 'short', day: 'numeric' })
}

export function AnalyticsDashboard({ onNotify }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | ContentClickCategory>('all')
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<ContentClickCategory>('books')
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true)
    try {
      const res = await fetchLiveAnalytics()
      setData(res)
    } catch {
      onNotify('క్లిక్ వివరాలు లోడ్ చేయడంలో లోపం', 'error')
    } finally {
      setLoading(false)
      if (isManual) setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLiveAnalytics().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  // Filter clicks based on timeframe
  const filteredEvents = useMemo(() => {
    if (!data) return []
    return filterEventsByTimeframe(data.recentClicks, timeframe)
  }, [data, timeframe])

  // Calculated totals for active timeframe
  const activeTotals = useMemo<CategoryTotals>(() => {
    if (timeframe === 'all' && data) {
      return data.totals
    }
    const t: CategoryTotals = { books: 0, questions: 0, articles: 0, messages: 0, total: 0 }
    for (const ev of filteredEvents) {
      if (t[ev.category] !== undefined) {
        t[ev.category]++
        t.total++
      }
    }
    return t
  }, [timeframe, data, filteredEvents])

  // Filtered click logs for table
  const tableEvents = useMemo(() => {
    return filteredEvents.filter((ev) => {
      if (categoryFilter !== 'all' && ev.category !== categoryFilter) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = (ev.title || '').toLowerCase().includes(q)
        const matchSlug = (ev.slug || '').toLowerCase().includes(q)
        return matchTitle || matchSlug
      }
      return true
    })
  }, [filteredEvents, categoryFilter, searchQuery])

  // Export to CSV
  const handleExportCSV = () => {
    if (!data || data.recentClicks.length === 0) {
      onNotify('ఎగుమతి చేయడానికి క్లిక్ డేటా లేదు', 'error')
      return
    }
    try {
      const csvContent = exportClicksToCSV(data.recentClicks)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `satyasakshi_clicks_report_${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      onNotify('క్లిక్స్ నివేదిక CSV డౌన్‌లోడ్ అయ్యింది!')
    } catch {
      onNotify('CSV డౌన్‌లోడ్ చేయడంలో సమస్య ఏర్పడింది', 'error')
    }
  }

  // Seed sample clicks
  const handleSeedSamples = async () => {
    setActionLoading(true)
    try {
      const count = await seedSampleClicks()
      onNotify(`${count} డెమో క్లిక్ వివరాలు విజయవంతంగా చేర్చబడ్డాయి!`)
      await loadData()
    } catch {
      onNotify('డెమో వివరాలు చేర్చడంలో లోపం', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Clear data
  const handleConfirmClear = async () => {
    setActionLoading(true)
    try {
      await clearAllAnalytics()
      setConfirmClearOpen(false)
      onNotify('అన్ని క్లిక్ వివరాలు క్లియర్ చేయబడ్డాయి.')
      await loadData()
    } catch {
      onNotify('వివరాలు క్లియర్ చేయడంలో సమస్య', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const categoryMeta: Record<
    ContentClickCategory,
    { label: string; icon: 'stack' | 'question' | 'book' | 'youtube'; color: string; bg: string; border: string; text: string }
  > = {
    books: {
      label: 'క్రైస్తవ పుస్తకాలు',
      icon: 'stack',
      color: 'emerald',
      bg: 'bg-emerald-50 text-emerald-800',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
    },
    questions: {
      label: 'ప్రశ్నలు & సమాధానాలు',
      icon: 'question',
      color: 'indigo',
      bg: 'bg-indigo-50 text-indigo-800',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
    },
    articles: {
      label: 'వ్యాసాలు',
      icon: 'book',
      color: 'amber',
      bg: 'bg-amber-50 text-amber-800',
      border: 'border-amber-200',
      text: 'text-amber-700',
    },
    messages: {
      label: 'సందేశాలు & వీడియోలు',
      icon: 'youtube',
      color: 'rose',
      bg: 'bg-rose-50 text-rose-800',
      border: 'border-rose-200',
      text: 'text-rose-700',
    },
  }

  // Calculate percentages
  const totalClicksCount = activeTotals.total || 0
  const booksPct = totalClicksCount > 0 ? Math.round((activeTotals.books / totalClicksCount) * 100) : 0
  const questionsPct = totalClicksCount > 0 ? Math.round((activeTotals.questions / totalClicksCount) * 100) : 0
  const articlesPct = totalClicksCount > 0 ? Math.round((activeTotals.articles / totalClicksCount) * 100) : 0
  const messagesPct = totalClicksCount > 0 ? Math.round((activeTotals.messages / totalClicksCount) * 100) : 0

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 rounded-2xl bg-cream-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-cream-200" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-cream-200" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-cream-300 bg-gradient-to-r from-cream-100 via-cream-50 to-cream-100 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-forest-800 text-cream-50 shadow-md">
              <Icon name="chart" size={22} />
            </span>
            <div>
              <h2 className="text-xl font-serif font-bold text-forest-950 sm:text-2xl">
                వెబ్‌సైట్ క్లిక్స్ & ట్రాకింగ్ డ్యాష్‌బోర్డ్
              </h2>
              <p className="text-xs text-ink-muted sm:text-sm">
                పుస్తకాలు, ప్రశ్నలు, వ్యాసాలు మరియు సందేశాల ప్రత్యక్ష వీక్షణలు & క్లిక్‌ల గణాంకాలు.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe pill selector */}
          <div className="inline-flex rounded-xl border border-cream-300 bg-white p-1 shadow-xs">
            <button
              onClick={() => setTimeframe('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                timeframe === 'all'
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-ink-soft hover:text-ink-strong'
              }`}
            >
              మొత్తం
            </button>
            <button
              onClick={() => setTimeframe('today')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                timeframe === 'today'
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-ink-soft hover:text-ink-strong'
              }`}
            >
              ఈ రోజు
            </button>
            <button
              onClick={() => setTimeframe('week')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                timeframe === 'week'
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-ink-soft hover:text-ink-strong'
              }`}
            >
              గత 7 రోజులు
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                timeframe === 'month'
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'text-ink-soft hover:text-ink-strong'
              }`}
            >
              గత 30 రోజులు
            </button>
          </div>

          {/* Sync Refresh */}
          <button
            onClick={() => loadData(true)}
            disabled={refreshing || actionLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink-strong shadow-xs transition-colors hover:bg-cream-100 disabled:opacity-50"
            title="డేటాను తాజాకరించండి"
          >
            <Icon
              name="refresh"
              size={14}
              className={refreshing ? 'animate-spin text-gold-600' : 'text-forest-700'}
            />
            <span>{refreshing ? 'తాజాకరిస్తోంది...' : 'లైవ్ సింక్'}</span>
          </button>

          {/* Export to CSV */}
          <button
            onClick={handleExportCSV}
            disabled={actionLoading || !data || data.recentClicks.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-3 py-1.5 text-xs font-semibold text-forest-800 shadow-xs transition-colors hover:bg-cream-100 disabled:opacity-50"
            title="CSV ఫైల్‌గా డౌన్‌లోడ్ చేయండి"
          >
            <Icon name="export" size={14} />
            <span>CSV ఎగుమతి</span>
          </button>

          {/* Test/Seed Sample Data */}
          <button
            onClick={handleSeedSamples}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gold-300 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-900 shadow-xs transition-colors hover:bg-gold-100 disabled:opacity-50"
            title="డ్యాష్‌బోర్డ్ పరీక్షించడానికి డెమో క్లిక్ వివరాలు చేర్చండి"
          >
            <Icon name="sparkle" size={14} className="text-gold-600" />
            <span>డెమో డేటా</span>
          </button>

          {/* Clear stats */}
          <button
            onClick={() => setConfirmClearOpen(true)}
            disabled={actionLoading || totalClicksCount === 0}
            className="inline-flex items-center gap-1 rounded-xl border border-cream-300 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-700 shadow-xs transition-colors hover:bg-rose-50 disabled:opacity-40"
            title="క్లిక్ డేటా రీసెట్"
          >
            <Icon name="trash" size={13} />
            <span className="hidden sm:inline">రీసెట్</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Card */}
        <div className="relative overflow-hidden rounded-2xl border border-forest-800/20 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-900 p-5 text-cream-50 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gold-300">
              మొత్తం క్లిక్స్
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-gold-300 backdrop-blur-xs">
              <Icon name="mouse-pointer" size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {activeTotals.total.toLocaleString()}
            </span>
            <span className="text-xs text-cream-300/80">క్లిక్స్</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[0.75rem] text-gold-300/90">
            <span className="inline-block size-2 animate-pulse rounded-full bg-emerald-400" />
            <span>లైవ్ రియల్-టైమ్ ట్రాకింగ్</span>
          </div>
        </div>

        {/* Books Card */}
        <div className="rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              పుస్తకాలు
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Icon name="stack" size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-forest-950">
              {activeTotals.books.toLocaleString()}
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
              {booksPct}%
            </span>
          </div>
          <p className="mt-3 text-xs text-ink-muted">PDF డౌన్‌లోడ్‌లు & పఠనాలు</p>
        </div>

        {/* Questions & Answers Card */}
        <div className="rounded-2xl border border-indigo-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-800">
              ప్రశ్నలు & సమాధానాలు
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <Icon name="question" size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-forest-950">
              {activeTotals.questions.toLocaleString()}
            </span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800">
              {questionsPct}%
            </span>
          </div>
          <p className="mt-3 text-xs text-ink-muted">సమాధానాల వీక్షణలు</p>
        </div>

        {/* Articles Card */}
        <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              వ్యాసాలు
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Icon name="book" size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-forest-950">
              {activeTotals.articles.toLocaleString()}
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              {articlesPct}%
            </span>
          </div>
          <p className="mt-3 text-xs text-ink-muted">వ్యాసాల పఠనాలు</p>
        </div>

        {/* Messages Card */}
        <div className="rounded-2xl border border-rose-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              సందేశాలు & వీడియోలు
            </span>
            <span className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <Icon name="youtube" size={16} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-serif text-3xl font-bold text-forest-950">
              {activeTotals.messages.toLocaleString()}
            </span>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800">
              {messagesPct}%
            </span>
          </div>
          <p className="mt-3 text-xs text-ink-muted">వీడియో వీక్షణలు & క్లిక్‌లు</p>
        </div>
      </div>

      {/* Visual Category Distribution Bar */}
      <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-forest-950 sm:text-lg">
              విభాగాల వారిగా ఆదరణ శాతం (Category Distribution)
            </h3>
            <p className="text-xs text-ink-muted">
              ఏ విభాగంపై పాఠకులు ఎక్కువ ఆసక్తి కనబరుస్తున్నారో ఇక్కడ చూడండి.
            </p>
          </div>
          <span className="text-xs font-medium text-ink-soft">
            మొత్తం: {totalClicksCount} క్లిక్‌లు
          </span>
        </div>

        {/* Multi-colored Progress Bar */}
        <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full bg-cream-200 p-0.5">
          {totalClicksCount > 0 ? (
            <>
              {booksPct > 0 && (
                <div
                  style={{ width: `${booksPct}%` }}
                  className="h-full rounded-l-full bg-emerald-500 transition-all duration-500"
                  title={`పుస్తకాలు: ${activeTotals.books} (${booksPct}%)`}
                />
              )}
              {questionsPct > 0 && (
                <div
                  style={{ width: `${questionsPct}%` }}
                  className="h-full bg-indigo-500 transition-all duration-500"
                  title={`ప్రశ్నలు: ${activeTotals.questions} (${questionsPct}%)`}
                />
              )}
              {articlesPct > 0 && (
                <div
                  style={{ width: `${articlesPct}%` }}
                  className="h-full bg-amber-500 transition-all duration-500"
                  title={`వ్యాసాలు: ${activeTotals.articles} (${articlesPct}%)`}
                />
              )}
              {messagesPct > 0 && (
                <div
                  style={{ width: `${messagesPct}%` }}
                  className="h-full rounded-r-full bg-rose-500 transition-all duration-500"
                  title={`సందేశాలు: ${activeTotals.messages} (${messagesPct}%)`}
                />
              )}
            </>
          ) : (
            <div className="size-full rounded-full bg-cream-300" />
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-full bg-emerald-500" />
            <span className="text-xs text-ink-soft">
              పుస్తకాలు: <strong className="text-forest-950">{activeTotals.books}</strong> ({booksPct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-full bg-indigo-500" />
            <span className="text-xs text-ink-soft">
              ప్రశ్నలు: <strong className="text-forest-950">{activeTotals.questions}</strong> ({questionsPct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-full bg-amber-500" />
            <span className="text-xs text-ink-soft">
              వ్యాసాలు: <strong className="text-forest-950">{activeTotals.articles}</strong> ({articlesPct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-full bg-rose-500" />
            <span className="text-xs text-ink-soft">
              సందేశాలు: <strong className="text-forest-950">{activeTotals.messages}</strong> ({messagesPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Daily Activity Chart (Last 7 to 14 days) */}
      {data && data.dailyTrend && data.dailyTrend.length > 0 && (
        <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-forest-950 sm:text-lg">
                రోజువారీ కార్యాచరణ ట్రెండ్ (Daily Click Trends)
              </h3>
              <p className="text-xs text-ink-muted">
                గత రోజుల్లో జరిగిన క్లిక్‌ల పరిమాణం.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded bg-forest-700" /> క్లిక్‌లు
              </span>
            </div>
          </div>

          <div className="mt-6 flex h-48 items-end gap-2 border-b border-cream-200 pb-2 sm:gap-4">
            {(() => {
              const maxVal = Math.max(...data.dailyTrend.map((d) => d.total), 1)
              return data.dailyTrend.map((day) => {
                const heightPct = Math.round((day.total / maxVal) * 100)
                return (
                  <div key={day.date} className="group relative flex flex-1 flex-col items-center">
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute -top-16 z-30 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-forest-950 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100">
                      <p className="font-semibold">{day.displayDate}</p>
                      <p className="text-[0.7rem] text-gold-300">
                        మొత్తం: {day.total} (పుస్తకాలు: {day.books}, సందేశాలు: {day.messages})
                      </p>
                    </div>

                    {/* Bar */}
                    <div className="relative flex h-36 w-full max-w-[28px] items-end justify-center rounded-t-md bg-cream-100">
                      <div
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                        className="w-full rounded-t-md bg-gradient-to-t from-forest-800 to-forest-600 transition-all duration-300 group-hover:from-gold-600 group-hover:to-gold-500"
                      />
                    </div>

                    {/* Day label */}
                    <span className="mt-2 text-center text-[0.68rem] text-ink-muted truncate w-full">
                      {day.displayDate}
                    </span>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      )}

      {/* Leaderboards: Top Most Clicked Content by Category */}
      <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-cream-200 pb-4">
          <div>
            <h3 className="font-serif text-base font-bold text-forest-950 sm:text-lg">
              అత్యధికంగా ఆదరణ పొందిన అంశాలు (Top Popular Content)
            </h3>
            <p className="text-xs text-ink-muted">
              ప్రతి విభాగంలో పాఠకులు అత్యధికంగా క్లిక్ చేసి చదివిన మొదటి 10 అంశాలు.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['books', 'questions', 'articles', 'messages'] as ContentClickCategory[]).map((cat) => {
              const meta = categoryMeta[cat]
              const count = data?.topItems[cat]?.length || 0
              return (
                <button
                  key={cat}
                  onClick={() => setActiveLeaderboardTab(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeLeaderboardTab === cat
                      ? `${meta.bg} shadow-xs ring-1 ${meta.border}`
                      : 'bg-cream-100 text-ink-soft hover:bg-cream-200'
                  }`}
                >
                  <Icon name={meta.icon} size={13} />
                  <span>{meta.label}</span>
                  <span className="text-[0.7rem] opacity-75">({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Tab Leaderboard List */}
        <div className="mt-4">
          {(() => {
            const list = data?.topItems[activeLeaderboardTab] || []
            const meta = categoryMeta[activeLeaderboardTab]
            const maxClicks = list.length > 0 ? list[0].clicks : 1

            if (list.length === 0) {
              return (
                <div className="py-12 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-cream-100 text-ink-muted">
                    <Icon name={meta.icon} size={22} />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-forest-950">
                    ఇంకా క్లిక్ డేటా నమోదు కాలేదు
                  </h4>
                  <p className="mt-1 text-xs text-ink-muted">
                    ఈ విభాగంలో వినియోగదారులు క్లిక్ చేసినప్పుడు ఇక్కడ ర్యాంకింగ్స్ కనిపిస్తాయి.
                  </p>
                </div>
              )
            }

            return (
              <div className="divide-y divide-cream-200">
                {list.map((item, index) => {
                  const pct = Math.round((item.clicks / maxClicks) * 100)
                  const targetUrl =
                    activeLeaderboardTab === 'books'
                      ? `/books`
                      : activeLeaderboardTab === 'questions'
                      ? `/questions/${item.slug}`
                      : activeLeaderboardTab === 'articles'
                      ? `/articles/${item.slug}`
                      : `/videos/${item.slug}`

                  const rankMedal =
                    index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `#${index + 1}`

                  return (
                    <div
                      key={`${item.category}_${item.slug}`}
                      className="group flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between hover:bg-cream-50/60 rounded-xl px-2.5 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            index < 3
                              ? 'bg-gold-100 text-gold-900 border border-gold-300'
                              : 'bg-cream-200 text-ink-soft'
                          }`}
                        >
                          {rankMedal}
                        </span>

                        <div className="min-w-0 flex-1">
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-forest-950 hover:text-forest-700 hover:underline text-sm truncate block"
                          >
                            {item.title}
                          </a>
                          <span className="text-[0.72rem] text-ink-muted">
                            Slug: {item.slug}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pl-11 sm:pl-0">
                        {/* Progress bar inside card */}
                        <div className="hidden sm:block w-32 bg-cream-200 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className={`h-full rounded-full ${
                              activeLeaderboardTab === 'books'
                                ? 'bg-emerald-500'
                                : activeLeaderboardTab === 'questions'
                                ? 'bg-indigo-500'
                                : activeLeaderboardTab === 'articles'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-3 py-1 text-xs font-bold text-cream-50">
                          <Icon name="mouse-pointer" size={11} />
                          {item.clicks.toLocaleString()} క్లిక్‌లు
                        </span>

                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-ink-muted hover:bg-cream-200 hover:text-forest-900 transition-colors"
                          title="ఈ అంశాన్ని చూడండి"
                        >
                          <Icon name="external" size={14} />
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </div>

      {/* Live Click Stream / Audit Table */}
      <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-cream-200 pb-4">
          <div>
            <h3 className="font-serif text-base font-bold text-forest-950 sm:text-lg">
              లైవ్ క్లిక్ రికార్డులు (Live Click Event Stream)
            </h3>
            <p className="text-xs text-ink-muted">
              తాజాగా వెబ్‌సైట్‌లో సందర్శకులు క్లిక్ చేసిన అన్ని అంశాల ప్రత్యక్ష లాగ్.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="శీర్షిక లేదా slug వెతకండి..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-1.5 pl-8 text-xs text-forest-950 placeholder-ink-muted focus:border-forest-600 focus:bg-white focus:outline-none"
              />
              <span className="absolute left-2.5 top-2 text-ink-muted">
                <Icon name="search" size={13} />
              </span>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="rounded-xl border border-cream-300 bg-cream-50 px-2.5 py-1.5 text-xs text-forest-950 focus:border-forest-600 focus:outline-none"
            >
              <option value="all">అన్ని విభాగాలు</option>
              <option value="books">పుస్తకాలు (Books)</option>
              <option value="questions">ప్రశ్నలు (Q&A)</option>
              <option value="articles">వ్యాసాలు (Articles)</option>
              <option value="messages">సందేశాలు (Messages)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          {tableEvents.length === 0 ? (
            <div className="py-12 text-center text-xs text-ink-muted">
              ఎటువంటి క్లిక్ వివరాలు కనిపించలేదు.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-300 bg-cream-100/60 text-ink-muted font-medium">
                  <th className="py-2.5 px-3">సమయం</th>
                  <th className="py-2.5 px-3">విభాగం</th>
                  <th className="py-2.5 px-3">అంశం శీర్షిక</th>
                  <th className="py-2.5 px-3">చర్య (Action)</th>
                  <th className="py-2.5 px-3">లింక్</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {tableEvents.slice(0, 50).map((ev) => {
                  const meta = categoryMeta[ev.category as ContentClickCategory] || categoryMeta.books
                  return (
                    <tr key={ev.id} className="hover:bg-cream-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-ink-muted whitespace-nowrap">
                        <span title={ev.timestamp}>{getRelativeTime(ev.timestamp)}</span>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.7rem] font-semibold ${meta.bg}`}
                        >
                          <Icon name={meta.icon} size={11} />
                          {meta.label}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-medium text-forest-950 max-w-xs truncate">
                        {ev.title}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[0.68rem] font-medium ${
                            ev.action === 'download'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.action === 'view'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-cream-200 text-ink-strong'
                          }`}
                        >
                          {ev.action === 'download' ? 'డౌన్‌లోడ్' : ev.action === 'view' ? 'వీక్షణ' : 'క్లిక్'}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap text-ink-muted">
                        {ev.path ? (
                          <a
                            href={ev.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-forest-700 hover:underline"
                          >
                            {ev.path}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {tableEvents.length > 50 && (
          <p className="mt-4 text-center text-xs text-ink-muted">
            మొదటి 50 రికార్డులు చూపబడుతున్నాయి (మొత్తం {tableEvents.length}). పూర్తి వివరాల కోసం &quot;CSV ఎగుమతి&quot; ఉపయోగించండి.
          </p>
        )}
      </div>

      {/* Confirmation Modal for Resetting Analytics */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-cream-300 bg-white p-6 shadow-2xl">
            <div className="flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-700">
              <Icon name="trash" size={24} />
            </div>
            <h3 className="mt-4 text-lg font-serif font-bold text-forest-950">
              క్లిక్ గణాంకాలను రీసెట్ చేయాలా?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              ఇది వెబ్‌సైట్‌లోని అన్ని క్లిక్ ఈవెంట్ లాగ్‌లు మరియు కౌంటర్‌లను శాశ్వతంగా తొలగిస్తుంది. ఈ చర్యను వెనక్కి తీసుకోలేరు.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="rounded-xl border border-cream-300 bg-cream-100 px-4 py-2 text-xs font-semibold text-ink-strong hover:bg-cream-200"
              >
                రద్దు చేయి
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                disabled={actionLoading}
                className="rounded-xl bg-rose-700 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-800 disabled:opacity-50"
              >
                {actionLoading ? 'తొలగిస్తోంది...' : 'అవును, రీసెట్ చేయి'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
