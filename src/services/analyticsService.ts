import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { db } from '../config/firebase'

export type ContentClickCategory = 'books' | 'questions' | 'articles' | 'messages'

export interface ClickEvent {
  id: string
  category: ContentClickCategory
  slug: string
  title: string
  action: 'click' | 'view' | 'download'
  timestamp: string // ISO format
  date: string // YYYY-MM-DD
  path?: string
  referrer?: string
}

export interface CategoryTotals {
  books: number
  questions: number
  articles: number
  messages: number
  total: number
}

export interface ItemClickStat {
  slug: string
  title: string
  category: ContentClickCategory
  clicks: number
  lastClicked: string
}

export interface DailyClickStat {
  date: string
  displayDate: string
  books: number
  questions: number
  articles: number
  messages: number
  total: number
}

export interface AnalyticsOverview {
  totals: CategoryTotals
  recentClicks: ClickEvent[]
  topItems: {
    books: ItemClickStat[]
    questions: ItemClickStat[]
    articles: ItemClickStat[]
    messages: ItemClickStat[]
  }
  dailyTrend: DailyClickStat[]
  allItemStats: ItemClickStat[]
}

const LOCAL_STORAGE_KEY = 'satya_sakshi_analytics_events_v2'
const CLICKS_COLLECTION = 'analytics_clicks'
const SUMMARY_COLLECTION = 'analytics_summary'
const ITEMS_COLLECTION = 'analytics_items'

/**
 * Deduplicate rapid consecutive clicks on the exact same item within 1.5 seconds
 */
const recentClicksMemory = new Map<string, number>()

function isDuplicateRapidClick(key: string): boolean {
  const now = Date.now()
  const last = recentClicksMemory.get(key)
  if (last && now - last < 1500) {
    return true
  }
  recentClicksMemory.set(key, now)
  return false
}

/**
 * Get all clicks stored in localStorage
 */
export function getLocalClicks(): ClickEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Save clicks to localStorage
 */
function saveLocalClicks(events: ClickEvent[]) {
  try {
    // Keep max 500 events locally
    const trimmed = events.slice(0, 500)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // ignore
  }
}

/**
 * Track a click/view interaction on any content across the website
 */
export async function trackContentClick(
  category: ContentClickCategory,
  slug: string,
  title: string,
  action: 'click' | 'view' | 'download' = 'click',
  path?: string,
): Promise<void> {
  const clickKey = `${category}__${slug}__${action}`
  if (isDuplicateRapidClick(clickKey)) {
    return
  }

  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10)
  const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const event: ClickEvent = {
    id,
    category,
    slug,
    title: title.trim() || slug,
    action,
    timestamp: now.toISOString(),
    date: dateStr,
    path: path || window.location.pathname,
    referrer: document.referrer ? new URL(document.referrer).pathname : undefined,
  }

  // 1. Immediately buffer to localStorage
  const currentLocal = getLocalClicks()
  currentLocal.unshift(event)
  saveLocalClicks(currentLocal)

  // 2. Persist to Firestore asynchronously (doesn't block UI)
  try {
    const clickDocRef = doc(db, CLICKS_COLLECTION, id)
    const summaryDocRef = doc(db, SUMMARY_COLLECTION, 'totals')
    const itemDocRef = doc(db, ITEMS_COLLECTION, `${category}__${slug}`)

    await Promise.all([
      setDoc(clickDocRef, {
        ...event,
        createdAt: serverTimestamp(),
      }),
      setDoc(
        summaryDocRef,
        {
          [category]: increment(1),
          total: increment(1),
          lastUpdated: now.toISOString(),
        },
        { merge: true },
      ),
      setDoc(
        itemDocRef,
        {
          slug,
          category,
          title: title.trim() || slug,
          clicks: increment(1),
          lastClicked: now.toISOString(),
        },
        { merge: true },
      ),
    ])
  } catch (err) {
    console.warn('Analytics event stored locally; Firestore sync pending:', err)
  }
}

/**
 * Compute aggregate analytics from a raw list of click events
 */
export function computeAnalyticsFromEvents(events: ClickEvent[]): AnalyticsOverview {
  const totals: CategoryTotals = {
    books: 0,
    questions: 0,
    articles: 0,
    messages: 0,
    total: events.length,
  }

  const itemMap = new Map<string, ItemClickStat>()
  const dateMap = new Map<string, DailyClickStat>()

  // Initialize last 7 days for the chart
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dStr = d.toISOString().slice(0, 10)
    const displayDate = d.toLocaleDateString('te-IN', {
      month: 'short',
      day: 'numeric',
    })
    dateMap.set(dStr, {
      date: dStr,
      displayDate,
      books: 0,
      questions: 0,
      articles: 0,
      messages: 0,
      total: 0,
    })
  }

  for (const event of events) {
    // Totals
    if (totals[event.category] !== undefined) {
      totals[event.category]++
    }

    // Daily trends
    let daily = dateMap.get(event.date)
    if (!daily) {
      const d = new Date(event.timestamp)
      const displayDate = isNaN(d.getTime())
        ? event.date
        : d.toLocaleDateString('te-IN', { month: 'short', day: 'numeric' })
      daily = {
        date: event.date,
        displayDate,
        books: 0,
        questions: 0,
        articles: 0,
        messages: 0,
        total: 0,
      }
      dateMap.set(event.date, daily)
    }
    daily[event.category]++
    daily.total++

    // Item stats
    const itemKey = `${event.category}__${event.slug}`
    const existing = itemMap.get(itemKey)
    if (existing) {
      existing.clicks++
      if (new Date(event.timestamp) > new Date(existing.lastClicked)) {
        existing.lastClicked = event.timestamp
      }
    } else {
      itemMap.set(itemKey, {
        slug: event.slug,
        title: event.title,
        category: event.category,
        clicks: 1,
        lastClicked: event.timestamp,
      })
    }
  }

  const allItemStats = Array.from(itemMap.values()).sort((a, b) => b.clicks - a.clicks)

  const topItems = {
    books: allItemStats.filter((i) => i.category === 'books').slice(0, 10),
    questions: allItemStats.filter((i) => i.category === 'questions').slice(0, 10),
    articles: allItemStats.filter((i) => i.category === 'articles').slice(0, 10),
    messages: allItemStats.filter((i) => i.category === 'messages').slice(0, 10),
  }

  const dailyTrend = Array.from(dateMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14) // Last 14 days max

  return {
    totals,
    recentClicks: events.slice(0, 100),
    topItems,
    dailyTrend,
    allItemStats,
  }
}

/**
 * Fetch live analytics data from Firestore, augmented with local cache
 */
export async function fetchLiveAnalytics(): Promise<AnalyticsOverview> {
  let firestoreEvents: ClickEvent[] = []
  let firestoreItems: ItemClickStat[] = []

  try {
    const [clicksSnap, itemsSnap] = await Promise.all([
      getDocs(query(collection(db, CLICKS_COLLECTION), orderBy('timestamp', 'desc'), limit(300))),
      getDocs(query(collection(db, ITEMS_COLLECTION))),
    ])

    clicksSnap.forEach((docSnap) => {
      const data = docSnap.data() as ClickEvent
      firestoreEvents.push({
        id: docSnap.id,
        category: data.category || 'messages',
        slug: data.slug || docSnap.id,
        title: data.title || data.slug || 'తెలియని అంశం',
        action: data.action || 'click',
        timestamp: data.timestamp || new Date().toISOString(),
        date: data.date || (data.timestamp ? data.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10)),
        path: data.path,
        referrer: data.referrer,
      })
    })

    itemsSnap.forEach((docSnap) => {
      const data = docSnap.data()
      firestoreItems.push({
        slug: data.slug || docSnap.id,
        title: data.title || data.slug,
        category: data.category || 'messages',
        clicks: Number(data.clicks) || 0,
        lastClicked: data.lastClicked || new Date().toISOString(),
      })
    })
  } catch (err) {
    console.warn('Could not read Firestore analytics; using local events:', err)
  }

  // Merge with local events
  const localEvents = getLocalClicks()
  const combinedMap = new Map<string, ClickEvent>()

  for (const ev of firestoreEvents) {
    combinedMap.set(ev.id, ev)
  }
  for (const ev of localEvents) {
    if (!combinedMap.has(ev.id)) {
      combinedMap.set(ev.id, ev)
    }
  }

  const allEvents = Array.from(combinedMap.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  const overview = computeAnalyticsFromEvents(allEvents)

  // If firestoreItems contains counts that exceed local/fetched logs, merge them into top items
  if (firestoreItems.length > 0) {
    const itemMap = new Map<string, ItemClickStat>()
    for (const item of overview.allItemStats) {
      itemMap.set(`${item.category}__${item.slug}`, item)
    }
    for (const fsItem of firestoreItems) {
      const key = `${fsItem.category}__${fsItem.slug}`
      const existing = itemMap.get(key)
      if (existing) {
        existing.clicks = Math.max(existing.clicks, fsItem.clicks)
      } else {
        itemMap.set(key, fsItem)
      }
    }
    const mergedAll = Array.from(itemMap.values()).sort((a, b) => b.clicks - a.clicks)
    overview.allItemStats = mergedAll
    overview.topItems = {
      books: mergedAll.filter((i) => i.category === 'books').slice(0, 10),
      questions: mergedAll.filter((i) => i.category === 'questions').slice(0, 10),
      articles: mergedAll.filter((i) => i.category === 'articles').slice(0, 10),
      messages: mergedAll.filter((i) => i.category === 'messages').slice(0, 10),
    }
  }

  return overview
}

/**
 * Clear all analytics events (Admin action)
 */
export async function clearAllAnalytics(): Promise<void> {
  // Clear local storage
  localStorage.removeItem(LOCAL_STORAGE_KEY)

  // Clear Firestore collections
  try {
    const [clicksSnap, itemsSnap] = await Promise.all([
      getDocs(collection(db, CLICKS_COLLECTION)),
      getDocs(collection(db, ITEMS_COLLECTION)),
    ])

    const deletePromises: Promise<void>[] = []
    clicksSnap.forEach((d) => deletePromises.push(deleteDoc(d.ref)))
    itemsSnap.forEach((d) => deletePromises.push(deleteDoc(d.ref)))
    deletePromises.push(deleteDoc(doc(db, SUMMARY_COLLECTION, 'totals')))

    await Promise.all(deletePromises)
  } catch (err) {
    console.warn('Error clearing Firestore analytics:', err)
  }
}

/**
 * Seed sample clicks so admin can immediately evaluate and test the dashboard
 */
export async function seedSampleClicks(): Promise<number> {
  const sampleItems: { category: ContentClickCategory; slug: string; title: string; count: number }[] = [
    // Books
    { category: 'books', slug: 'prayer-life', title: 'ప్రార్థన జీవితం (Prayer Life)', count: 28 },
    { category: 'books', slug: 'faith-foundations', title: 'విశ్వాస పునాదులు (Faith Foundations)', count: 21 },
    { category: 'books', slug: 'christian-family', title: 'క్రైస్తవ కుటుంబం (Christian Family)', count: 17 },
    { category: 'books', slug: 'bible-study-guide', title: 'బైబిల్ అధ్యయన మార్గదర్శి', count: 14 },
    { category: 'books', slug: 'youth-godly-walk', title: 'యవ్వనుల పవిత్ర ప్రయాణం', count: 9 },

    // Questions & Answers
    { category: 'questions', slug: 'who-is-jesus', title: 'యేసుక్రీస్తు ఎవరు? ఆయన దేవుడా?', count: 35 },
    { category: 'questions', slug: 'how-to-pray', title: 'ప్రార్థన ఎలా చేయాలి? బైబిల్ ఏం చెబుతోంది?', count: 29 },
    { category: 'questions', slug: 'what-is-salvation', title: 'రక్షణ అంటే ఏమిటి? అది ఎలా దొరుకుతుంది?', count: 24 },
    { category: 'questions', slug: 'why-read-bible', title: 'రోజూ బైబిల్ ఎందుకు చదవాలి?', count: 18 },
    { category: 'questions', slug: 'forgiveness-of-sins', title: 'పాపక్షమాపణ ఎలా పొందాలి?', count: 12 },

    // Articles
    { category: 'articles', slug: 'daily-devotion-power', title: 'అనుదిన ప్రార్థన యొక్క ఆత్మీయ శక్తి', count: 31 },
    { category: 'articles', slug: 'peace-in-trouble', title: 'కష్టకాలంలో దేవుని సమాధానం', count: 26 },
    { category: 'articles', slug: 'living-by-faith', title: 'విశ్వాసంతో జీవించడం అంటే ఏమిటి?', count: 20 },
    { category: 'articles', slug: 'gods-love-unfailing', title: 'ఎన్నడూ ఎడబాయని దేవుని ప్రేమ', count: 16 },

    // Messages / Videos
    { category: 'messages', slug: 'luke-15-prodigal-son', title: 'లూకా 15 — తప్పిపోయిన కుమారుడు (Bro. Sudhakar CH.)', count: 48 },
    { category: 'messages', slug: 'matthew-6-lords-prayer', title: 'మత్తయి 6 — పరలోకమందున్న మా తండ్రీ', count: 39 },
    { category: 'messages', slug: 'psalm-23-the-lord-is-my-shepherd', title: 'కీర్తనలు 23 — యెహోవా నా కాపరి', count: 34 },
    { category: 'messages', slug: 'john-3-16-eternal-life', title: 'యోహాను 3:16 — నిత్యజీవపు వాగ్దానం', count: 27 },
    { category: 'messages', slug: 'romans-8-more-than-conquerors', title: 'రోమీయులకు 8 — జయించువారికంటె ఎక్కువైనవారం', count: 22 },
  ]

  const now = Date.now()
  const generatedEvents: ClickEvent[] = []
  let totalCount = 0

  for (const item of sampleItems) {
    for (let c = 0; c < item.count; c++) {
      // Spread across the last 10 days
      const daysAgo = Math.floor(Math.random() * 8)
      const eventDate = new Date(now - daysAgo * 86400000 - Math.floor(Math.random() * 3600000 * 20))
      const id = `sample_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      const ev: ClickEvent = {
        id,
        category: item.category,
        slug: item.slug,
        title: item.title,
        action: item.category === 'books' && c % 3 === 0 ? 'download' : 'click',
        timestamp: eventDate.toISOString(),
        date: eventDate.toISOString().slice(0, 10),
        path: `/${item.category === 'messages' ? 'videos' : item.category}/${item.slug}`,
      }

      generatedEvents.push(ev)
      totalCount++
    }
  }

  // Save to local storage
  saveLocalClicks(generatedEvents)

  // Push summaries and sample events to Firestore
  try {
    for (const item of sampleItems) {
      await setDoc(
        doc(db, ITEMS_COLLECTION, `${item.category}__${item.slug}`),
        {
          slug: item.slug,
          category: item.category,
          title: item.title,
          clicks: item.count,
          lastClicked: new Date().toISOString(),
        },
        { merge: true },
      )
    }

    const totals: CategoryTotals = {
      books: sampleItems.filter((i) => i.category === 'books').reduce((s, i) => s + i.count, 0),
      questions: sampleItems.filter((i) => i.category === 'questions').reduce((s, i) => s + i.count, 0),
      articles: sampleItems.filter((i) => i.category === 'articles').reduce((s, i) => s + i.count, 0),
      messages: sampleItems.filter((i) => i.category === 'messages').reduce((s, i) => s + i.count, 0),
      total: totalCount,
    }

    await setDoc(doc(db, SUMMARY_COLLECTION, 'totals'), {
      ...totals,
      lastUpdated: new Date().toISOString(),
    })

    // Save recent 30 sample click events to Firestore
    const recent30 = generatedEvents.slice(0, 30)
    for (const ev of recent30) {
      await setDoc(doc(db, CLICKS_COLLECTION, ev.id), ev)
    }
  } catch (err) {
    console.warn('Sample clicks generated in local storage; firestore write warning:', err)
  }

  return totalCount
}

/**
 * Format click events into CSV string for download
 */
export function exportClicksToCSV(events: ClickEvent[]): string {
  const headers = ['తేదీ & సమయం (Timestamp)', 'విభాగం (Category)', 'శీర్షిక (Title)', 'Slug/ID', 'చర్య (Action)', 'లింక్ (Path)']
  const rows = events.map((e) => [
    `"${e.timestamp}"`,
    `"${e.category}"`,
    `"${(e.title || '').replace(/"/g, '""')}"`,
    `"${e.slug}"`,
    `"${e.action}"`,
    `"${e.path || ''}"`,
  ])

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
}
