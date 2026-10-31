import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const SETTINGS_COLLECTION = 'site_settings'
const TEXT_CORRECTIONS_DOC = 'text_corrections'
const LOCAL_STORAGE_KEY = 'satyasakshi:site_texts'

export interface TextDefinition {
  key: string
  page: 'home' | 'bible' | 'videos' | 'questions' | 'articles' | 'contact' | 'about' | 'footer' | 'general'
  label: string
  description?: string
  defaultValue: string
  multiline?: boolean
}

/**
 * Predefined catalog of editable texts across all website pages.
 * Administrators can edit any of these, or add custom keys.
 */
export const DEFAULT_SITE_TEXTS: TextDefinition[] = [
  // ------------------------- HOME PAGE -------------------------
  {
    key: 'home.hero.title',
    page: 'home',
    label: 'హోమ్ ప్రధాన శీర్షిక (Hero Title)',
    description: 'హోమ్ పేజీ పైభాగంలో కనిపించే పెద్ద శీర్షిక',
    defaultValue: 'దేవుని వాక్యము ప్రతి ఇంటికి',
  },
  {
    key: 'home.hero.lede',
    page: 'home',
    label: 'హోమ్ పరిచయ వాక్యం (Hero Lede)',
    description: 'హోమ్ పేజీ ప్రధాన శీర్షిక కింద ఉండే వివరణ వాక్యం',
    defaultValue:
      'పరిశుద్ధ తెలుగు బైబిల్, బైబిల్ సందేశాలు, ప్రశ్నలు & సమాధానాలు, వ్యాసాలు — అన్నీ ఒకే వేదికలో. ఉచితముగా వెతకండి, చదవండి, అడగండి, వీక్షించండి మరియు మీ హృదయానికి సమీపించనీయండి.',
    multiline: true,
  },
  {
    key: 'home.quote.verse',
    page: 'home',
    label: 'హోమ్ కోట్ బానర్ వాక్యం (Hero Quote Text)',
    description: 'హీరో విభాగంలో కనిపించే బైబిల్ సత్య వాక్యం',
    defaultValue:
      'ఈ వేదికలో మీరు చదివే ప్రతి వాక్యం, ప్రతి సమాధానం — అన్నీ బైబిల్ నుండే. అన్నీ ఆ దేవుని మాటలే.',
    multiline: true,
  },
  {
    key: 'home.quote.ref',
    page: 'home',
    label: 'హోమ్ కోట్ రెఫరెన్స్ (Hero Quote Reference)',
    description: 'కోట్ కింద ఉండే బైబిల్ రిఫరెన్స్',
    defaultValue: 'ప్రకటన 3:14',
  },
  {
    key: 'home.messages.title',
    page: 'home',
    label: 'సందేశాల విభాగ శీర్షిక (Messages Section Title)',
    description: 'హోమ్ పేజీలో వీడియోల సెక్షన్ శీర్షిక',
    defaultValue: 'సందేశాలను ఇక్కడ నుండి వీక్షించండి',
  },
  {
    key: 'home.messages.lede',
    page: 'home',
    label: 'సందేశాల విభాగ వివరణ (Messages Section Lede)',
    description: 'సందేశాల సెక్షన్ కింద ఉండే ఉప-వాక్యం',
    defaultValue: 'Bro. Sudhakar CH. బైబిల్ సందేశాలు — మీరు ఎప్పుడైనా చూడగలరు.',
  },
  {
    key: 'home.bible.title',
    page: 'home',
    label: 'బైబిల్ స్ట్రిప్ శీర్షిక (Bible Strip Title)',
    description: 'హోమ్ పేజీలోని బైబిల్ విభాగం శీర్షిక',
    defaultValue: 'మీ భాషలోనే, అధ్యాయం వారీగా',
  },
  {
    key: 'home.bible.lede',
    page: 'home',
    label: 'బైబిల్ స్ట్రిప్ వివరణ (Bible Strip Lede)',
    description: 'హోమ్ పేజీలోని బైబిల్ విభాగం వివరణ',
    defaultValue:
      'మీరు తెరిచిన అధ్యాయం మాత్రమే లోడ్ అవుతుంది — అందుకే చదవడం వేగంగా, డేటా వ్యర్థం లేకుండా. అక్షర పరిమాణాన్ని మార్చవచ్చు, వాక్యాన్ని భద్రపరచవచ్చు, భాగం చేయవచ్చు.',
    multiline: true,
  },
  {
    key: 'home.questions.title',
    page: 'home',
    label: 'ప్రశ్నల విభాగ శీర్షిక (Questions Section Title)',
    description: 'హోమ్ పేజీలోని ప్రశ్నల విభాగం శీర్షిక',
    defaultValue: 'బైబిల్ ఆధారంగా',
  },
  {
    key: 'home.questions.lede',
    page: 'home',
    label: 'ప్రశ్నల విభాగ వివరణ (Questions Section Lede)',
    description: 'హోమ్ పేజీలోని ప్రశ్నల విభాగం వివరణ',
    defaultValue: 'మీ ప్రశ్నకు సమాధానం బైబిల్‌లో ఉంది. ఇక్కడ అదే వాక్యాలతో వివరణ ఇస్తున్నాం.',
  },
  {
    key: 'home.articles.title',
    page: 'home',
    label: 'వ్యాసాల విభాగ శీర్షిక (Articles Section Title)',
    description: 'హోమ్ పేజీలోని వ్యాసాల విభాగం శీర్షిక',
    defaultValue: 'ఆలోచించడానికి',
  },
  {
    key: 'home.articles.lede',
    page: 'home',
    label: 'వ్యాసాల విభాగ వివరణ (Articles Section Lede)',
    description: 'హోమ్ పేజీలోని వ్యాసాల విభాగం వివరణ',
    defaultValue: 'పరిశుద్ధ వాక్యాన్ని లోతుగా అర్థం చేసుకోవడానికి వ్యాసాలు.',
  },

  // ------------------------- BIBLE PAGE -------------------------
  {
    key: 'bible.header.title',
    page: 'bible',
    label: 'బైబిల్ పేజీ శీర్షిక (Bible Page Title)',
    defaultValue: 'పరిశుద్ధ బైబిల్',
  },
  {
    key: 'bible.header.lede',
    page: 'bible',
    label: 'బైబిల్ పేజీ వివరణ (Bible Page Lede)',
    defaultValue:
      'పరిశుద్ధ గ్రంథం తెలుగులో — 66 పుస్తకాలు, 1,189 అధ్యాయాలు, 31,101 వచనాలు. అధ్యాయాల వారీగా స్పష్టంగా చదవండి.',
    multiline: true,
  },
  {
    key: 'bible.books.heading',
    page: 'bible',
    label: 'అన్ని పుస్తకాల సెక్షన్ శీర్షిక (All Books Heading)',
    defaultValue: 'అన్ని పుస్తకాలు',
  },
  {
    key: 'bible.books.lede',
    page: 'bible',
    label: 'అన్ని పుస్తకాల సెక్షన్ వివరణ (All Books Lede)',
    defaultValue: 'పాత నిబంధన మరియు నూతన నిబంధన — మొత్తం 66 పుస్తకాలు.',
  },
  {
    key: 'bible.ot.label',
    page: 'bible',
    label: 'పాత నిబంధన ట్యాబ్ లేబుల్ (Old Testament Label)',
    defaultValue: 'పాత నిబంధన',
  },
  {
    key: 'bible.nt.label',
    page: 'bible',
    label: 'నూతన నిబంధన ట్యాబ్ లేబుల్ (New Testament Label)',
    defaultValue: 'నూతన నిబంధన',
  },

  // ------------------------- MESSAGES / VIDEOS PAGE -------------------------
  {
    key: 'videos.header.title',
    page: 'videos',
    label: 'సందేశాలు పేజీ శీర్షిక (Messages Page Title)',
    defaultValue: 'బైబిల్ సందేశాలు',
  },
  {
    key: 'videos.header.lede',
    page: 'videos',
    label: 'సందేశాలు పేజీ వివరణ (Messages Page Lede)',
    defaultValue:
      'బైబిల్ సందేశాలు, బైబిల్ అధ్యయనం — Bro. Sudhakar CH. బోధనలు. మీరు ఎప్పుడైనా, ఎక్కడనుండైనా చూడగలరు.',
    multiline: true,
  },

  // ------------------------- QUESTIONS PAGE -------------------------
  {
    key: 'questions.header.title',
    page: 'questions',
    label: 'ప్రశ్నల పేజీ శీర్షిక (Questions Page Title)',
    defaultValue: 'మీ ప్రశ్నకు సమాధానం ఇక్కడే',
  },
  {
    key: 'questions.header.lede',
    page: 'questions',
    label: 'ప్రశ్నల పేజీ వివరణ (Questions Page Lede)',
    defaultValue:
      'ప్రతి సమాధానం బైబిల్ వాక్యంతో ముందుచేయబడింది. మీరు కూడా ప్రశ్న పెట్టాలంటే సంప్రదించండి.',
    multiline: true,
  },

  // ------------------------- ARTICLES PAGE -------------------------
  {
    key: 'articles.header.title',
    page: 'articles',
    label: 'వ్యాసాలు పేజీ శీర్షిక (Articles Page Title)',
    defaultValue: 'వ్యాసాలు',
  },
  {
    key: 'articles.header.lede',
    page: 'articles',
    label: 'వ్యాసాలు పేజీ వివరణ (Articles Page Lede)',
    defaultValue: 'బైబిల్ ఆధారంగా ఆలోచించడానికి సహాయపడే సంక్షిప్త వ్యాసాలు.',
  },

  // ------------------------- CONTACT & ADDRESS -------------------------
  {
    key: 'contact.header.title',
    page: 'contact',
    label: 'సంప్రదింపు పేజీ శీర్షిక (Contact Page Title)',
    defaultValue: 'మేము ఎలా చేరుకోవాలి?',
  },
  {
    key: 'contact.header.lede',
    page: 'contact',
    label: 'సంప్రదింపు పేజీ వివరణ (Contact Page Lede)',
    defaultValue: 'మీ ప్రశ్న, మీ సూచన - మాకు పంపండి',
  },
  {
    key: 'contact.kakinada.address1',
    page: 'contact',
    label: 'కాకినాడ కేంద్రం అడ్రస్ లైన్ 1 (Kakinada Address Line 1)',
    defaultValue: 'రోడ్ నం. 1, వైద్యనగర్',
  },
  {
    key: 'contact.kakinada.address2',
    page: 'contact',
    label: 'కాకినాడ కేంద్రం అడ్రస్ లైన్ 2 (Kakinada Address Line 2)',
    defaultValue: 'రమణయ్యపేట, కాకినాడ - 533005',
  },
  {
    key: 'contact.kottapalli.address1',
    page: 'contact',
    label: 'కొత్తపల్లి కేంద్రం అడ్రస్ లైన్ 1 (Kottapalli Address Line 1)',
    defaultValue: 'గొంధి కొత్తపల్లి, శంఖవరం మండలం',
  },
  {
    key: 'contact.kottapalli.address2',
    page: 'contact',
    label: 'కొత్తపల్లి కేంద్రం అడ్రస్ లైన్ 2 (Kottapalli Address Line 2)',
    defaultValue: 'కాకినాడ జిల్లా, ఆంధ్రప్రదేశ్ - 533407',
  },
  {
    key: 'contact.phone',
    page: 'contact',
    label: 'సంప్రదింపు ఫోన్ నంబర్ (Contact Phone)',
    defaultValue: '+91 98499 44954',
  },
  {
    key: 'contact.whatsapp',
    page: 'contact',
    label: 'WhatsApp నంబర్ (WhatsApp Phone)',
    defaultValue: '+91 98499 44954',
  },
  {
    key: 'contact.email',
    page: 'contact',
    label: 'సంప్రదింపు ఈమెయిల్ (Contact Email)',
    defaultValue: 'bible@support.satyasakshi.in',
  },

  // ------------------------- ABOUT PAGE -------------------------
  {
    key: 'about.header.title',
    page: 'about',
    label: 'మా గురించి పేజీ శీర్షిక (About Page Title)',
    defaultValue: 'సత్యసాక్షి గురించి',
  },
  {
    key: 'about.header.lede',
    page: 'about',
    label: 'మా గురించి పేజీ వివరణ (About Page Lede)',
    defaultValue: 'దేవుని వాక్యము ప్రతి ఇంటికి — స్వచ్ఛమైన, లాభాపేక్ష లేని క్రైస్తవ సేవ.',
  },

  // ------------------------- FOOTER & GLOBAL -------------------------
  {
    key: 'footer.copyright',
    page: 'footer',
    label: 'కాపీరైట్ వాక్యం (Copyright Text)',
    defaultValue: '© 2026 సత్యసాక్షి. సర్వహక్కులు ప్రత్యేకించబడ్డాయి.',
  },
  {
    key: 'footer.rights',
    page: 'footer',
    label: 'హక్కుల నోటీసు (Rights Reserved Notice)',
    defaultValue: 'సర్వ హక్కులూ ప్రత్యేకించబడ్డాయి (All Rights Reserved)',
  },
  {
    key: 'footer.tagline',
    page: 'footer',
    label: 'ట్యాగ్‌లైన్ (Brand Tagline)',
    defaultValue: 'We Challenge Conventional Thinking',
  },
]

// In-memory cache & listeners
let cachedTexts: Record<string, string> = {}
let listeners: Array<(texts: Record<string, string>) => void> = []

// Initialize in-memory cache from localStorage if available
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      cachedTexts = JSON.parse(raw)
    }
  } catch {
    // Ignore storage parse error
  }
}

/**
 * Get current texts dictionary synchronously from cache.
 */
export function getCachedSiteTexts(): Record<string, string> {
  return cachedTexts
}

/**
 * Synchronous string lookup by key with fallback.
 */
export function getSiteText(key: string, fallback?: string): string {
  if (cachedTexts[key] !== undefined && cachedTexts[key].trim() !== '') {
    return cachedTexts[key]
  }
  if (fallback !== undefined) {
    return fallback
  }
  const found = DEFAULT_SITE_TEXTS.find((d) => d.key === key)
  return found ? found.defaultValue : ''
}

/**
 * Fetch all customized text corrections from Firestore.
 */
export async function fetchLiveSiteTexts(): Promise<Record<string, string>> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, TEXT_CORRECTIONS_DOC)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      const data = snap.data() as Record<string, string>
      cachedTexts = { ...data }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
        } catch {
          // Ignore storage quota
        }
      }
      notifyListeners()
      return data
    }
  } catch (err) {
    console.warn('Could not load site text corrections from Firestore, using offline cache:', err)
  }
  return cachedTexts
}

/**
 * Save text corrections to Firestore and update cache.
 */
export async function saveSiteTextsToFirestore(texts: Record<string, string>): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, TEXT_CORRECTIONS_DOC)
  await setDoc(docRef, texts)
  cachedTexts = { ...texts }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(texts))
    } catch {
      // Ignore quota
    }
  }
  notifyListeners()
}

/**
 * Reset all text corrections back to system defaults.
 */
export async function resetSiteTextsInFirestore(): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, TEXT_CORRECTIONS_DOC)
  await setDoc(docRef, {})
  cachedTexts = {}
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }
  notifyListeners()
}

function notifyListeners() {
  listeners.forEach((fn) => fn(cachedTexts))
}

/**
 * React hook to access site texts with instant reactive updates.
 *
 * Usage:
 * const { t } = useSiteText()
 * <p>{t('home.hero.lede', 'Default text...')}</p>
 */
export function useSiteText() {
  const [texts, setTexts] = useState<Record<string, string>>(cachedTexts)

  useEffect(() => {
    const listener = (newTexts: Record<string, string>) => setTexts({ ...newTexts })
    listeners.push(listener)

    // Trigger initial background fetch
    fetchLiveSiteTexts().then((res) => {
      setTexts({ ...res })
    })

    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  const t = (key: string, fallback?: string): string => {
    if (texts[key] !== undefined && texts[key].trim() !== '') {
      return texts[key]
    }
    if (fallback !== undefined) {
      return fallback
    }
    const def = DEFAULT_SITE_TEXTS.find((d) => d.key === key)
    return def ? def.defaultValue : ''
  }

  return { t, texts }
}
