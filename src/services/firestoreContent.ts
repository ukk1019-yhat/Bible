import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Article, Question, Video } from '../types/content'
import { articles as initialArticles } from '../data/content/articles'
import { questions as initialQuestions } from '../data/content/questions'
import { videos as initialVideos } from '../data/content/videos'

const ARTICLES_COLLECTION = 'articles'
const DELETED_ARTICLES_COLLECTION = 'deleted_articles'

const QUESTIONS_COLLECTION = 'questions'
const DELETED_QUESTIONS_COLLECTION = 'deleted_questions'

const VIDEOS_COLLECTION = 'videos'
const DELETED_VIDEOS_COLLECTION = 'deleted_videos'

/**
 * Remove any undefined values to avoid Firestore serialization errors.
 */
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const result: any = Array.isArray(obj) ? [] : {}
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) {
      continue
    }
    if (val !== null && typeof val === 'object') {
      result[key] = sanitizeForFirestore(val)
    } else {
      result[key] = val
    }
  }
  return result
}

/**
 * Extracts a clean 11-character YouTube ID from various YouTube URL formats.
 */
export function extractYouTubeId(urlOrId: string): string {
  const trimmed = urlOrId.trim()
  if (!trimmed) return ''
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
  )
  return match ? match[1] : trimmed
}

/* -------------------------------------------------------------------------- */
/*  Articles                                                                  */
/* -------------------------------------------------------------------------- */

let cachedArticles: Article[] | null = null

export async function fetchLiveArticles(): Promise<Article[]> {
  try {
    const [qSnap, delSnap] = await Promise.all([
      getDocs(query(collection(db, ARTICLES_COLLECTION))),
      getDocs(query(collection(db, DELETED_ARTICLES_COLLECTION))).catch(() => ({ docs: [] })),
    ])

    const deletedSlugs = new Set(delSnap.docs.map((d: any) => d.id))

    const firestoreArticles: Article[] = []
    qSnap.forEach((docSnap) => {
      if (!deletedSlugs.has(docSnap.id)) {
        firestoreArticles.push(docSnap.data() as Article)
      }
    })

    const map = new Map<string, Article>()
    for (const item of initialArticles) {
      if (!deletedSlugs.has(item.slug)) {
        map.set(item.slug, item)
      }
    }
    for (const item of firestoreArticles) {
      if (!deletedSlugs.has(item.slug)) {
        map.set(item.slug, item)
      }
    }

    const merged = Array.from(map.values())
    cachedArticles = merged
    return merged
  } catch (err) {
    console.warn('Could not load articles from Firestore, using offline data:', err)
    return cachedArticles || initialArticles
  }
}

export function getCachedArticles(): Article[] {
  return cachedArticles || initialArticles
}

export async function saveArticleToFirestore(article: Article): Promise<void> {
  const sanitized = sanitizeForFirestore(article)
  await setDoc(doc(db, ARTICLES_COLLECTION, article.slug), sanitized)
  await deleteDoc(doc(db, DELETED_ARTICLES_COLLECTION, article.slug)).catch(() => {})
  if (cachedArticles) {
    const index = cachedArticles.findIndex((a) => a.slug === article.slug)
    if (index >= 0) {
      cachedArticles[index] = article
    } else {
      cachedArticles.unshift(article)
    }
  }
}

export async function deleteArticleFromFirestore(slug: string): Promise<void> {
  await deleteDoc(doc(db, ARTICLES_COLLECTION, slug))
  await setDoc(doc(db, DELETED_ARTICLES_COLLECTION, slug), {
    slug,
    deletedAt: new Date().toISOString(),
  })
  if (cachedArticles) {
    cachedArticles = cachedArticles.filter((a) => a.slug !== slug)
  }
}

export async function seedInitialArticles(): Promise<number> {
  let count = 0
  for (const article of initialArticles) {
    await setDoc(doc(db, ARTICLES_COLLECTION, article.slug), sanitizeForFirestore(article))
    await deleteDoc(doc(db, DELETED_ARTICLES_COLLECTION, article.slug)).catch(() => {})
    count++
  }
  return count
}

/* -------------------------------------------------------------------------- */
/*  Questions & Answers                                                       */
/* -------------------------------------------------------------------------- */

let cachedQuestions: Question[] | null = null

export async function fetchLiveQuestions(): Promise<Question[]> {
  try {
    const [qSnap, delSnap] = await Promise.all([
      getDocs(query(collection(db, QUESTIONS_COLLECTION))),
      getDocs(query(collection(db, DELETED_QUESTIONS_COLLECTION))).catch(() => ({ docs: [] })),
    ])

    const deletedSlugs = new Set(delSnap.docs.map((d: any) => d.id))

    const firestoreQuestions: Question[] = []
    qSnap.forEach((docSnap) => {
      if (!deletedSlugs.has(docSnap.id)) {
        firestoreQuestions.push(docSnap.data() as Question)
      }
    })

    const map = new Map<string, Question>()
    for (const item of initialQuestions) {
      if (!deletedSlugs.has(item.slug)) {
        map.set(item.slug, item)
      }
    }
    for (const item of firestoreQuestions) {
      if (!deletedSlugs.has(item.slug)) {
        map.set(item.slug, item)
      }
    }

    const merged = Array.from(map.values())
    cachedQuestions = merged
    return merged
  } catch (err) {
    console.warn('Could not load questions from Firestore, using offline data:', err)
    return cachedQuestions || initialQuestions
  }
}

export function getCachedQuestions(): Question[] {
  return cachedQuestions || initialQuestions
}

export async function saveQuestionToFirestore(question: Question): Promise<void> {
  const sanitized = sanitizeForFirestore(question)
  await setDoc(doc(db, QUESTIONS_COLLECTION, question.slug), sanitized)
  await deleteDoc(doc(db, DELETED_QUESTIONS_COLLECTION, question.slug)).catch(() => {})
  if (cachedQuestions) {
    const index = cachedQuestions.findIndex((q) => q.slug === question.slug)
    if (index >= 0) {
      cachedQuestions[index] = question
    } else {
      cachedQuestions.unshift(question)
    }
  }
}

export async function deleteQuestionFromFirestore(slug: string): Promise<void> {
  await deleteDoc(doc(db, QUESTIONS_COLLECTION, slug))
  await setDoc(doc(db, DELETED_QUESTIONS_COLLECTION, slug), {
    slug,
    deletedAt: new Date().toISOString(),
  })
  if (cachedQuestions) {
    cachedQuestions = cachedQuestions.filter((q) => q.slug !== slug)
  }
}

export async function seedInitialQuestions(): Promise<number> {
  let count = 0
  for (const question of initialQuestions) {
    await setDoc(doc(db, QUESTIONS_COLLECTION, question.slug), sanitizeForFirestore(question))
    await deleteDoc(doc(db, DELETED_QUESTIONS_COLLECTION, question.slug)).catch(() => {})
    count++
  }
  return count
}

/* -------------------------------------------------------------------------- */
/*  YouTube Videos / Messages                                                 */
/* -------------------------------------------------------------------------- */

let cachedVideos: Video[] | null = null

export async function fetchLiveVideos(): Promise<Video[]> {
  try {
    const [qSnap, delSnap] = await Promise.all([
      getDocs(query(collection(db, VIDEOS_COLLECTION))),
      getDocs(query(collection(db, DELETED_VIDEOS_COLLECTION))).catch(() => ({ docs: [] })),
    ])

    const deletedSlugs = new Set(delSnap.docs.map((d: any) => d.id))

    const firestoreVideos: Video[] = []
    qSnap.forEach((docSnap) => {
      if (!deletedSlugs.has(docSnap.id)) {
        firestoreVideos.push(docSnap.data() as Video)
      }
    })

    const map = new Map<string, Video>()
    for (const item of initialVideos) {
      if (!deletedSlugs.has(item.slug)) {
        map.set(item.slug, item)
      }
    }
    for (const item of firestoreVideos) {
      if (!deletedSlugs.has(item.slug)) {
        map.set(item.slug, item)
      }
    }

    const merged = Array.from(map.values())
    cachedVideos = merged
    return merged
  } catch (err) {
    console.warn('Could not load videos from Firestore, using offline data:', err)
    return cachedVideos || initialVideos
  }
}

export function getCachedVideos(): Video[] {
  return cachedVideos || initialVideos
}

export async function saveVideoToFirestore(video: Video): Promise<void> {
  const sanitized = sanitizeForFirestore(video)
  await setDoc(doc(db, VIDEOS_COLLECTION, video.slug), sanitized)
  await deleteDoc(doc(db, DELETED_VIDEOS_COLLECTION, video.slug)).catch(() => {})
  if (cachedVideos) {
    const index = cachedVideos.findIndex((v) => v.slug === video.slug)
    if (index >= 0) {
      cachedVideos[index] = video
    } else {
      cachedVideos.unshift(video)
    }
  }
}

export async function deleteVideoFromFirestore(slug: string): Promise<void> {
  await deleteDoc(doc(db, VIDEOS_COLLECTION, slug))
  await setDoc(doc(db, DELETED_VIDEOS_COLLECTION, slug), {
    slug,
    deletedAt: new Date().toISOString(),
  })
  if (cachedVideos) {
    cachedVideos = cachedVideos.filter((v) => v.slug !== slug)
  }
}

export async function seedInitialVideos(): Promise<number> {
  let count = 0
  for (const video of initialVideos) {
    await setDoc(doc(db, VIDEOS_COLLECTION, video.slug), sanitizeForFirestore(video))
    await deleteDoc(doc(db, DELETED_VIDEOS_COLLECTION, video.slug)).catch(() => {})
    count++
  }
  return count
}
