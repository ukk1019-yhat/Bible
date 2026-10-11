import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Article, Question } from '../types/content'
import { articles as initialArticles } from '../data/content/articles'
import { questions as initialQuestions } from '../data/content/questions'

const ARTICLES_COLLECTION = 'articles'
const QUESTIONS_COLLECTION = 'questions'

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

/* -------------------------------------------------------------------------- */
/*  Articles                                                                  */
/* -------------------------------------------------------------------------- */

let cachedArticles: Article[] | null = null

export async function fetchLiveArticles(): Promise<Article[]> {
  try {
    const q = query(collection(db, ARTICLES_COLLECTION))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      cachedArticles = initialArticles
      return initialArticles
    }

    const firestoreArticles: Article[] = []
    snapshot.forEach((docSnap) => {
      firestoreArticles.push(docSnap.data() as Article)
    })

    // Merge: Firestore items override static ones by slug; new items appended
    const map = new Map<string, Article>()
    for (const item of initialArticles) {
      map.set(item.slug, item)
    }
    for (const item of firestoreArticles) {
      map.set(item.slug, item)
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
  // Update local cache
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
  if (cachedArticles) {
    cachedArticles = cachedArticles.filter((a) => a.slug !== slug)
  }
}

export async function seedInitialArticles(): Promise<number> {
  let count = 0
  for (const article of initialArticles) {
    await setDoc(doc(db, ARTICLES_COLLECTION, article.slug), sanitizeForFirestore(article))
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
    const q = query(collection(db, QUESTIONS_COLLECTION))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      cachedQuestions = initialQuestions
      return initialQuestions
    }

    const firestoreQuestions: Question[] = []
    snapshot.forEach((docSnap) => {
      firestoreQuestions.push(docSnap.data() as Question)
    })

    const map = new Map<string, Question>()
    for (const item of initialQuestions) {
      map.set(item.slug, item)
    }
    for (const item of firestoreQuestions) {
      map.set(item.slug, item)
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
  if (cachedQuestions) {
    cachedQuestions = cachedQuestions.filter((q) => q.slug !== slug)
  }
}

export async function seedInitialQuestions(): Promise<number> {
  let count = 0
  for (const question of initialQuestions) {
    await setDoc(doc(db, QUESTIONS_COLLECTION, question.slug), sanitizeForFirestore(question))
    count++
  }
  return count
}
