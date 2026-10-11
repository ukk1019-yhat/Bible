import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from 'firebase/auth'
import {
  subscribeToAuth,
  loginAdmin,
  registerAdmin,
  logoutAdmin,
} from '../services/authService'
import {
  fetchLiveArticles,
  saveArticleToFirestore,
  deleteArticleFromFirestore,
  seedInitialArticles,
  fetchLiveQuestions,
  saveQuestionToFirestore,
  deleteQuestionFromFirestore,
  seedInitialQuestions,
  fetchLiveVideos,
  saveVideoToFirestore,
  deleteVideoFromFirestore,
  seedInitialVideos,
  extractYouTubeId,
} from '../services/firestoreContent'
import { fetchDriveBooks } from '../services/driveBooks'
import type { Article, Question, ChristianBook, Video, VideoCategory } from '../types/content'
import { articleCategories } from '../data/content/articles'
import { VIDEO_CATEGORIES } from '../types/content'
import { speakers } from '../data/content/videos'
import { Icon } from '../components/ui/Icon'
import { BrandLockup } from '../components/brand/Logo'
import { useSeo } from '../hooks/useSeo'

export function AdminPage() {
  useSeo({
    title: 'అడ్మిన్ పోర్టల్ — సత్యసాక్షి',
    description: 'సత్యసాక్షి అడ్మిన్ కంట్రోల్ ప్యానెల్',
    path: '/admin',
    noIndex: true,
  })

  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Auth form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [authError, setAuthError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Tabs
  const [activeTab, setActiveTab] = useState<'videos' | 'articles' | 'questions' | 'books' | 'info'>('videos')

  // Videos state
  const [videos, setVideos] = useState<Video[]>([])
  const [videosLoading, setVideosLoading] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Partial<Video> | null>(null)
  const [youtubeInput, setYoutubeInput] = useState('')

  // Articles state
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(false)
  const [articleModalOpen, setArticleModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null)
  const [articleBodyText, setArticleBodyText] = useState('')

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null)
  const [questionAnswerText, setQuestionAnswerText] = useState('')

  // Drive books state
  const [books, setBooks] = useState<ChristianBook[]>([])
  const [booksLoading, setBooksLoading] = useState(false)

  // Status notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Subscribe to auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Load content when logged in
  useEffect(() => {
    if (!user) return
    loadVideos()
    loadArticles()
    loadQuestions()
    loadDriveBooks()
  }, [user])

  const loadVideos = async () => {
    setVideosLoading(true)
    try {
      const data = await fetchLiveVideos()
      setVideos(data)
    } catch {
      showToast('వీడియోలు లోడ్ చేయడంలో లోపం', 'error')
    } finally {
      setVideosLoading(false)
    }
  }

  const loadArticles = async () => {
    setArticlesLoading(true)
    try {
      const data = await fetchLiveArticles()
      setArticles(data)
    } catch {
      showToast('వ్యాసాలు లోడ్ చేయడంలో లోపం', 'error')
    } finally {
      setArticlesLoading(false)
    }
  }

  const loadQuestions = async () => {
    setQuestionsLoading(true)
    try {
      const data = await fetchLiveQuestions()
      setQuestions(data)
    } catch {
      showToast('ప్రశ్నలు లోడ్ చేయడంలో లోపం', 'error')
    } finally {
      setQuestionsLoading(false)
    }
  }

  const loadDriveBooks = async () => {
    setBooksLoading(true)
    try {
      const data = await fetchDriveBooks()
      setBooks(data)
    } catch {
      // ignore
    } finally {
      setBooksLoading(false)
    }
  }

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setActionLoading(true)

    try {
      if (isRegisterMode) {
        await registerAdmin(email, password)
        showToast('అడ్మిన్ ఖాతా విజయవంతంగా సృష్టించబడింది!')
      } else {
        await loginAdmin(email, password)
        showToast('విజయవంతంగా లాగిన్ అయ్యారు!')
      }
    } catch (err: any) {
      console.error(err)
      const code = err.code || ''
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setAuthError('ఈమెయిల్ లేదా పాస్‌వర్డ్ సరైనది కాదు.')
      } else if (code === 'auth/user-not-found') {
        setAuthError('ఈ ఈమెయిల్‌తో ఖాతా కనబడలేదు. దయచేసి ఖాతా సృష్టించండి.')
      } else if (code === 'auth/email-already-in-use') {
        setAuthError('ఈ ఈమెయిల్ ఇప్పటికే ఉపయోగంలో ఉంది. లాగిన్ అవ్వండి.')
      } else if (code === 'auth/weak-password') {
        setAuthError('పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.')
      } else {
        setAuthError(err.message || 'ప్రవేశించడంలో లోపం ఏర్పడింది.')
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = async () => {
    await logoutAdmin()
    showToast('లాగౌట్ అయ్యారు.')
  }

  // Video Actions
  const handleOpenNewVideo = () => {
    setEditingVideo({
      slug: '',
      title: '',
      youtubeId: '',
      category: 'బైబిల్ సందేశాలు',
      speaker: speakers[0],
      description: '',
      scripture: '',
      featured: false,
    })
    setYoutubeInput('')
    setVideoModalOpen(true)
  }

  const handleEditVideo = (v: Video) => {
    setEditingVideo(v)
    setYoutubeInput(v.youtubeId)
    setVideoModalOpen(true)
  }

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVideo) return

    const extractedId = extractYouTubeId(youtubeInput)
    if (!extractedId) {
      showToast('దయచేసి సరైన YouTube Video లింక్ లేదా ID ఇవ్వండి', 'error')
      return
    }

    if (!editingVideo.title?.trim()) {
      showToast('శీర్షిక అవసరం', 'error')
      return
    }

    const slug =
      editingVideo.slug?.trim() ||
      extractedId ||
      editingVideo.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)

    setActionLoading(true)
    try {
      const completeVideo: Video = {
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        title: editingVideo.title.trim(),
        youtubeId: extractedId,
        category: (editingVideo.category as VideoCategory) || 'బైబిల్ సందేశాలు',
        speaker: editingVideo.speaker || speakers[0],
        description: editingVideo.description?.trim() || undefined,
        scripture: editingVideo.scripture?.trim() || undefined,
        featured: Boolean(editingVideo.featured),
        publishedAt: editingVideo.publishedAt || new Date().toISOString(),
      }

      await saveVideoToFirestore(completeVideo)
      showToast('వీడియో విజయవంతంగా సేవ్ చేయబడింది! సందేశాలలో అప్‌డేట్ అయ్యింది.')
      setVideoModalOpen(false)
      await loadVideos()
    } catch (err: any) {
      console.error(err)
      showToast('వీడియో సేవ్ చేయడంలో లోపం: ' + err.message, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteVideo = async (slug: string, title: string) => {
    if (!window.confirm(`"${title}" వీడియోను తొలగించాలనుకుంటున్నారా?`)) return
    setActionLoading(true)
    try {
      setVideos((prev) => prev.filter((v) => v.slug !== slug))
      await deleteVideoFromFirestore(slug)
      showToast('వీడియో తొలగించబడింది!')
      await loadVideos()
    } catch (err: any) {
      showToast('తొలగించడంలో లోపం: ' + err.message, 'error')
      await loadVideos()
    } finally {
      setActionLoading(false)
    }
  }

  const handleSeedVideos = async () => {
    if (!window.confirm('ప్రస్తుత ప్రారంభ YouTube వీడియోలను డేటాబేస్‌కి ఎక్కించాలనుకుంటున్నారా?')) return
    setActionLoading(true)
    try {
      const count = await seedInitialVideos()
      showToast(`${count} వీడియోలు డేటాబేస్‌లో చేర్చబడ్డాయి!`)
      await loadVideos()
    } catch (err: any) {
      showToast('సీడింగ్ లోపం: ' + err.message, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Article Actions
  const handleOpenNewArticle = () => {
    setEditingArticle({
      slug: '',
      title: '',
      excerpt: '',
      category: articleCategories[0],
      status: 'published',
      readingMinutes: 3,
    })
    setArticleBodyText('')
    setArticleModalOpen(true)
  }

  const handleEditArticle = (art: Article) => {
    setEditingArticle(art)
    const bodyStr = art.body
      ? art.body
          .map((b) => (b.type === 'p' ? b.text : b.type === 'h2' ? `## ${b.text}` : ''))
          .filter(Boolean)
          .join('\n\n')
      : ''
    setArticleBodyText(bodyStr)
    setArticleModalOpen(true)
  }

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingArticle || !editingArticle.title || !editingArticle.slug) {
      showToast('శీర్షిక మరియు స్లగ్ అవసరం', 'error')
      return
    }

    setActionLoading(true)
    try {
      const paragraphs = articleBodyText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean)

      const bodyBlocks = paragraphs.map((text) => {
        if (text.startsWith('## ')) {
          return { type: 'h2' as const, text: text.replace('## ', '') }
        }
        return { type: 'p' as const, text }
      })

      const completeArticle: Article = {
        slug: editingArticle.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        title: editingArticle.title.trim(),
        excerpt: editingArticle.excerpt?.trim() || editingArticle.title.trim(),
        category: editingArticle.category || articleCategories[0],
        status: editingArticle.status || 'published',
        readingMinutes: editingArticle.readingMinutes || 3,
        publishedAt: editingArticle.publishedAt || new Date().toISOString(),
        body: bodyBlocks.length > 0 ? bodyBlocks : undefined,
      }

      await saveArticleToFirestore(completeArticle)
      showToast('వ్యాసం సేవ్ చేయబడింది!')
      setArticleModalOpen(false)
      await loadArticles()
    } catch (err: any) {
      console.error(err)
      showToast('వ్యాసం సేవ్ చేయడంలో లోపం: ' + err.message, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteArticle = async (slug: string, title: string) => {
    if (!window.confirm(`"${title}" వ్యాసాన్ని తొలగించాలనుకుంటున్నారా?`)) return
    setActionLoading(true)
    try {
      setArticles((prev) => prev.filter((a) => a.slug !== slug))
      await deleteArticleFromFirestore(slug)
      showToast('వ్యాసం తొలగించబడింది!')
      await loadArticles()
    } catch (err: any) {
      showToast('తొలగించడంలో లోపం: ' + err.message, 'error')
      await loadArticles()
    } finally {
      setActionLoading(false)
    }
  }

  const handleSeedArticles = async () => {
    if (!window.confirm('ప్రస్తుత ప్రారంభ వ్యాసాలను డేటాబేస్‌కి ఎక్కించాలనుకుంటున్నారా?')) return
    setActionLoading(true)
    try {
      const count = await seedInitialArticles()
      showToast(`${count} వ్యాసాలు డేటాబేస్‌లో చేర్చబడ్డాయి!`)
      await loadArticles()
    } catch (err: any) {
      showToast('సీడింగ్ లోపం: ' + err.message, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Question Actions
  const handleOpenNewQuestion = () => {
    setEditingQuestion({
      slug: '',
      question: '',
      summary: '',
      topic: 'దేవుడు',
      status: 'published',
      verses: [],
      relatedSlugs: [],
    })
    setQuestionAnswerText('')
    setQuestionModalOpen(true)
  }

  const handleEditQuestion = (q: Question) => {
    setEditingQuestion(q)
    const text = q.answer
      ? q.answer
          .map((sec) => sec.paragraphs.join('\n\n'))
          .join('\n\n')
      : ''
    setQuestionAnswerText(text)
    setQuestionModalOpen(true)
  }

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingQuestion || !editingQuestion.question || !editingQuestion.slug) {
      showToast('ప్రశ్న మరియు స్లగ్ అవసరం', 'error')
      return
    }

    setActionLoading(true)
    try {
      const paragraphs = questionAnswerText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean)

      const answerSection = [
        {
          heading: '',
          paragraphs: paragraphs.length > 0 ? paragraphs : [editingQuestion.summary || ''],
        },
      ]

      const completeQuestion: Question = {
        slug: editingQuestion.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        question: editingQuestion.question.trim(),
        summary: editingQuestion.summary?.trim() || editingQuestion.question.trim(),
        topic: editingQuestion.topic || 'దేవుడు',
        status: editingQuestion.status || 'published',
        answer: answerSection,
        verses: editingQuestion.verses || [],
        relatedSlugs: editingQuestion.relatedSlugs || [],
      }

      await saveQuestionToFirestore(completeQuestion)
      showToast('ప్రశ్న మరియు సమాధానం సేవ్ చేయబడింది!')
      setQuestionModalOpen(false)
      await loadQuestions()
    } catch (err: any) {
      console.error(err)
      showToast('ప్రశ్న సేవ్ చేయడంలో లోపం: ' + err.message, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteQuestion = async (slug: string, questionText: string) => {
    if (!window.confirm(`"${questionText}" ప్రశ్నను తొలగించాలనుకుంటున్నారా?`)) return
    setActionLoading(true)
    try {
      setQuestions((prev) => prev.filter((q) => q.slug !== slug))
      await deleteQuestionFromFirestore(slug)
      showToast('ప్రశ్న తొలగించబడింది!')
      await loadQuestions()
    } catch (err: any) {
      showToast('తొలగించడంలో లోపం: ' + err.message, 'error')
      await loadQuestions()
    } finally {
      setActionLoading(false)
    }
  }

  const handleSeedQuestions = async () => {
    if (!window.confirm('ప్రస్తుత ప్రారంభ ప్రశ్నలను డేటాబేస్‌కి ఎక్కించాలనుకుంటున్నారా?')) return
    setActionLoading(true)
    try {
      const count = await seedInitialQuestions()
      showToast(`${count} ప్రశ్నలు డేటాబేస్‌లో చేర్చబడ్డాయి!`)
      await loadQuestions()
    } catch (err: any) {
      showToast('సీడింగ్ లోపం: ' + err.message, 'error')
    } finally {
      setActionLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-forest-800">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-forest-800 border-t-transparent" />
          <span>అడ్మిన్ పోర్టల్ తనిఖీ చేయబడుతోంది...</span>
        </div>
      </div>
    )
  }

  // Not logged in -> Show Login Card
  if (!user) {
    return (
      <div className="shell flex min-h-[80vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-2xl border border-cream-300 bg-white p-8 shadow-xl">
          <div className="text-center">
            <div className="inline-block">
              <BrandLockup size="md" />
            </div>
            <h1 className="mt-4 text-2xl font-serif font-bold text-forest-950">
              అడ్మిన్ పోర్టల్ లాగిన్
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              YouTube సందేశాలు, వ్యాసాలు మరియు ప్రశ్నలు మార్చుటకు ప్రవేశించండి.
            </p>
          </div>

          {authError && (
            <div className="mt-6 rounded-lg bg-red-50 p-3.5 text-sm text-red-700 border border-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                ఈమెయిల్ (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bible@support.satyasakshi.in"
                className="mt-1.5 w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-ink-strong focus:border-forest-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                పాస్‌వర్డ్ (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-ink-strong focus:border-forest-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="mt-2 w-full rounded-lg bg-forest-800 py-3 text-center text-sm font-semibold text-cream-50 shadow-md transition-all hover:bg-forest-900 disabled:opacity-50"
            >
              {actionLoading
                ? 'పరిశీలిస్తోంది...'
                : isRegisterMode
                ? 'అడ్మిన్ ఖాతా సృష్టించండి'
                : 'పోర్టల్‌లోకి ప్రవేశించండి'}
            </button>
          </form>

          <div className="mt-6 border-t border-cream-200 pt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode)
                setAuthError('')
              }}
              className="text-xs text-forest-700 hover:text-forest-900 underline font-medium"
            >
              {isRegisterMode
                ? 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి'
                : 'మొదటిసారి అడ్మిన్ సెటప్? కొత్త ఖాతా నమోదు చేయండి'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-ink-muted hover:text-ink-strong">
              ← వెబ్‌సైట్‌కి తిరిగి వెళ్ళండి
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Logged In Admin Dashboard
  return (
    <div className="min-h-screen bg-cream-100/50 pb-20">
      {/* Toast popup */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl transition-all ${
            toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-forest-900 text-gold-300 border border-gold-500/30'
          }`}
        >
          <Icon name={toast.type === 'error' ? 'close' : 'check'} size={18} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 border-b border-cream-300 bg-white/95 backdrop-blur-md">
        <div className="shell flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" title="సత్యసాక్షి హోమ్">
              <BrandLockup size="sm" />
            </Link>
            <span className="hidden rounded-full bg-forest-800/10 px-2.5 py-0.5 text-xs font-semibold text-forest-900 sm:inline-block">
              అడ్మిన్ పోర్టల్
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-ink-strong">{user.email}</p>
              <p className="text-[10px] text-green-700 flex items-center justify-end gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Firebase లైవ్ కనెక్ట్
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cream-300 bg-cream-50 px-3 py-1.5 text-xs font-medium text-ink-strong transition-colors hover:bg-cream-200"
            >
              <Icon name="close" size={14} />
              లాగౌట్
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="shell py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-cream-300 pb-3">
          <button
            onClick={() => setActiveTab('videos')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'videos'
                ? 'bg-forest-800 text-cream-50 shadow-sm'
                : 'bg-white text-ink-soft hover:bg-cream-200 hover:text-ink-strong'
            }`}
          >
            <Icon name="youtube" size={16} />
            YouTube సందేశాలు ({videos.length})
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'articles'
                ? 'bg-forest-800 text-cream-50 shadow-sm'
                : 'bg-white text-ink-soft hover:bg-cream-200 hover:text-ink-strong'
            }`}
          >
            <Icon name="book" size={16} />
            వ్యాసాలు ({articles.length})
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'questions'
                ? 'bg-forest-800 text-cream-50 shadow-sm'
                : 'bg-white text-ink-soft hover:bg-cream-200 hover:text-ink-strong'
            }`}
          >
            <Icon name="question" size={16} />
            ప్రశ్నలు & సమాధానాలు ({questions.length})
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'books'
                ? 'bg-forest-800 text-cream-50 shadow-sm'
                : 'bg-white text-ink-soft hover:bg-cream-200 hover:text-ink-strong'
            }`}
          >
            <Icon name="download" size={16} />
            గూగుల్ డ్రైవ్ పుస్తకాలు ({books.length})
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'info'
                ? 'bg-forest-800 text-cream-50 shadow-sm'
                : 'bg-white text-ink-soft hover:bg-cream-200 hover:text-ink-strong'
            }`}
          >
            <Icon name="bookmark" size={16} />
            సిస్టమ్ స్థితి & డేటాబేస్
          </button>
        </div>

        {/* TAB: YOUTUBE VIDEOS & MESSAGES */}
        {activeTab === 'videos' && (
          <section className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-forest-950">
                  YouTube సందేశాలు & వీడియోల నిర్వహణ
                </h2>
                <p className="text-xs text-ink-muted">
                  ఇక్కడ కొత్త YouTube వీడియో చేర్చితే, అది వెంటనే సందేశాలు (/messages) మరియు వీడియోల (/videos) పేజీలలో అప్‌డేట్ అవుతుంది.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSeedVideos}
                  disabled={actionLoading}
                  title="ప్రస్తుతం ఉన్న ప్రారంభ వీడియోలను డేటాబేస్‌కి అప్‌లోడ్ చేయండి"
                  className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-cream-200 transition-colors"
                >
                  ప్రారంభ వీడియోలు సింక్ చేయండి
                </button>
                <button
                  onClick={handleOpenNewVideo}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-forest-800 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-900 transition-colors shadow-sm"
                >
                  <Icon name="play" size={14} />
                  కొత్త వీడియో చేర్చండి
                </button>
              </div>
            </div>

            {/* Videos Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-cream-300 bg-white shadow-sm">
              {videosLoading ? (
                <div className="p-8 text-center text-sm text-ink-muted">లోడ్ అవుతోంది...</div>
              ) : videos.length === 0 ? (
                <div className="p-12 text-center text-sm text-ink-muted">
                  ఇంకా ఏ వీడియోలు లేవు. పైన ఉన్న "కొత్త వీడియో చేర్చండి" బటన్ క్లిక్ చేయండి.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-cream-200 bg-cream-50 text-xs font-semibold uppercase text-ink-soft">
                      <tr>
                        <th className="px-5 py-3.5">వీడియో / శీర్షిక</th>
                        <th className="px-4 py-3.5">విభాగం (Category)</th>
                        <th className="px-4 py-3.5">బోధకుడు (Speaker)</th>
                        <th className="px-4 py-3.5">వాక్యం (Scripture)</th>
                        <th className="px-5 py-3.5 text-right">చర్యలు (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-200">
                      {videos.map((vid) => (
                        <tr key={vid.slug} className="hover:bg-cream-50/70 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://i.ytimg.com/vi/${vid.youtubeId}/default.jpg`}
                                alt={vid.title}
                                className="h-12 w-16 rounded object-cover border border-cream-200 bg-cream-100 shrink-0"
                              />
                              <div>
                                <p className="font-medium text-forest-950 line-clamp-1">{vid.title}</p>
                                <p className="text-xs font-mono text-ink-muted mt-0.5">
                                  ID: {vid.youtubeId}
                                  {vid.featured && (
                                    <span className="ml-2 rounded-full bg-gold-100 text-gold-900 px-2 py-0.5 text-[10px] font-sans font-semibold">
                                      ఫీచర్డ్
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-cream-200 px-2.5 py-1 text-xs text-ink-strong">
                              {vid.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs text-ink-strong">
                            {vid.speaker?.name || 'Bro. Sudhakar CH.'}
                          </td>
                          <td className="px-4 py-4 text-xs text-gold-800 font-medium">
                            {vid.scripture || '—'}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/videos/${vid.slug}`}
                                target="_blank"
                                className="rounded p-1.5 text-ink-soft hover:bg-cream-200 hover:text-ink-strong"
                                title="వెబ్‌సైట్‌లో చూడండి"
                              >
                                <Icon name="external" size={15} />
                              </Link>
                              <a
                                href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded p-1.5 text-red-700 hover:bg-red-50"
                                title="YouTube లో చూడండి"
                              >
                                <Icon name="youtube" size={16} />
                              </a>
                              <button
                                onClick={() => handleEditVideo(vid)}
                                className="rounded p-1.5 text-forest-800 hover:bg-forest-50 font-medium text-xs flex items-center gap-1"
                                title="సవరించండి"
                              >
                                సవరించు
                              </button>
                              <button
                                onClick={() => handleDeleteVideo(vid.slug, vid.title)}
                                className="rounded p-1.5 text-red-600 hover:bg-red-50 text-xs flex items-center gap-1"
                                title="తొలగించండి"
                              >
                                తొలగించు
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB: ARTICLES */}
        {activeTab === 'articles' && (
          <section className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-forest-950">వ్యాసాల నిర్వహణ</h2>
                <p className="text-xs text-ink-muted">
                  వెబ్‌సైట్‌లో ప్రచురింపబడే క్రైస్తవ ఆధ్యాత్మిక వ్యాసాలను రాయండి లేదా సవరించండి.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSeedArticles}
                  disabled={actionLoading}
                  title="ప్రస్తుతం ఉన్న ప్రారంభ వ్యాసాలను డేటాబేస్‌కి అప్‌లోడ్ చేయండి"
                  className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-cream-200 transition-colors"
                >
                  ప్రారంభ వ్యాసాలు సింక్ చేయండి
                </button>
                <button
                  onClick={handleOpenNewArticle}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-forest-800 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-900 transition-colors shadow-sm"
                >
                  <Icon name="check" size={14} />
                  కొత్త వ్యాసం రాయండి
                </button>
              </div>
            </div>

            {/* Articles Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-cream-300 bg-white shadow-sm">
              {articlesLoading ? (
                <div className="p-8 text-center text-sm text-ink-muted">లోడ్ అవుతోంది...</div>
              ) : articles.length === 0 ? (
                <div className="p-12 text-center text-sm text-ink-muted">
                  ఇంకా ఏ వ్యాసాలు లేవు. పైన ఉన్న "కొత్త వ్యాసం రాయండి" క్లిక్ చేయండి.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-cream-200 bg-cream-50 text-xs font-semibold uppercase text-ink-soft">
                      <tr>
                        <th className="px-5 py-3.5">శీర్షిక (Title)</th>
                        <th className="px-4 py-3.5">విభాగం (Category)</th>
                        <th className="px-4 py-3.5">స్థితి (Status)</th>
                        <th className="px-4 py-3.5">స్లగ్ (Slug)</th>
                        <th className="px-5 py-3.5 text-right">చర్యలు (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-200">
                      {articles.map((art) => (
                        <tr key={art.slug} className="hover:bg-cream-50/70 transition-colors">
                          <td className="px-5 py-4 font-medium text-forest-950">
                            {art.title}
                            {art.excerpt && (
                              <p className="text-xs text-ink-muted line-clamp-1 mt-0.5 font-normal">
                                {art.excerpt}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-cream-200 px-2.5 py-1 text-xs text-ink-strong">
                              {art.category.telugu}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                art.status === 'published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {art.status === 'published' ? 'ప్రచురించబడింది' : 'త్వరలో'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs font-mono text-ink-muted">
                            {art.slug}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/articles/${art.slug}`}
                                target="_blank"
                                className="rounded p-1.5 text-ink-soft hover:bg-cream-200 hover:text-ink-strong"
                                title="వెబ్‌సైట్‌లో చూడండి"
                              >
                                <Icon name="external" size={15} />
                              </Link>
                              <button
                                onClick={() => handleEditArticle(art)}
                                className="rounded p-1.5 text-forest-800 hover:bg-forest-50 font-medium text-xs flex items-center gap-1"
                                title="సవరించండి"
                              >
                                సవరించు
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.slug, art.title)}
                                className="rounded p-1.5 text-red-600 hover:bg-red-50 text-xs flex items-center gap-1"
                                title="తొలగించండి"
                              >
                                తొలగించు
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB: QUESTIONS & ANSWERS */}
        {activeTab === 'questions' && (
          <section className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-forest-950">
                  ప్రశ్నలు & సమాధానాల నిర్వహణ
                </h2>
                <p className="text-xs text-ink-muted">
                  విశ్వాసుల సందేహాలకు బైబిల్ ఆధారిత ప్రశ్నలు మరియు సమాధానాలను అప్‌లోడ్ చేయండి.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSeedQuestions}
                  disabled={actionLoading}
                  className="rounded-lg border border-cream-300 bg-white px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-cream-200 transition-colors"
                >
                  ప్రారంభ ప్రశ్నలు సింక్ చేయండి
                </button>
                <button
                  onClick={handleOpenNewQuestion}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-forest-800 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-900 transition-colors shadow-sm"
                >
                  <Icon name="check" size={14} />
                  కొత్త ప్రశ్న జోడించండి
                </button>
              </div>
            </div>

            {/* Questions Table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-cream-300 bg-white shadow-sm">
              {questionsLoading ? (
                <div className="p-8 text-center text-sm text-ink-muted">లోడ్ అవుతోంది...</div>
              ) : questions.length === 0 ? (
                <div className="p-12 text-center text-sm text-ink-muted">
                  ఇంకా ప్రశ్నలు లేవు.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-cream-200 bg-cream-50 text-xs font-semibold uppercase text-ink-soft">
                      <tr>
                        <th className="px-5 py-3.5">ప్రశ్న (Question)</th>
                        <th className="px-4 py-3.5">అంశం (Topic)</th>
                        <th className="px-4 py-3.5">స్థితి (Status)</th>
                        <th className="px-4 py-3.5">స్లగ్ (Slug)</th>
                        <th className="px-5 py-3.5 text-right">చర్యలు (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-200">
                      {questions.map((q) => (
                        <tr key={q.slug} className="hover:bg-cream-50/70 transition-colors">
                          <td className="px-5 py-4 font-medium text-forest-950">
                            {q.question}
                            {q.summary && (
                              <p className="text-xs text-ink-muted line-clamp-1 mt-0.5 font-normal">
                                {q.summary}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-cream-200 px-2.5 py-1 text-xs text-ink-strong">
                              {q.topic}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                q.status === 'published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {q.status === 'published' ? 'ప్రచురించబడింది' : 'త్వరలో'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs font-mono text-ink-muted">
                            {q.slug}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/questions/${q.slug}`}
                                target="_blank"
                                className="rounded p-1.5 text-ink-soft hover:bg-cream-200 hover:text-ink-strong"
                                title="వెబ్‌సైట్‌లో చూడండి"
                              >
                                <Icon name="external" size={15} />
                              </Link>
                              <button
                                onClick={() => handleEditQuestion(q)}
                                className="rounded p-1.5 text-forest-800 hover:bg-forest-50 font-medium text-xs flex items-center gap-1"
                              >
                                సవరించు
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q.slug, q.question)}
                                className="rounded p-1.5 text-red-600 hover:bg-red-50 text-xs flex items-center gap-1"
                              >
                                తొలగించు
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB: DRIVE BOOKS */}
        {activeTab === 'books' && (
          <section className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-forest-950">
                  గూగుల్ డ్రైవ్ పుస్తకాల స్థితి
                </h2>
                <p className="text-xs text-ink-muted">
                  మీరు గూగుల్ డ్రైవ్ ఫోల్డర్‌లో పుస్తకాలు చేర్చినప్పుడు లేదా తొలగించినప్పుడు అవి ఇక్కడ ఆటోమేటిక్‌గా నవీకరించబడతాయి.
                </p>
              </div>

              <button
                onClick={loadDriveBooks}
                disabled={booksLoading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-forest-800 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-900 transition-colors shadow-sm"
              >
                <Icon name="search" size={14} />
                {booksLoading ? 'డ్రైవ్ పరిశీలిస్తోంది...' : 'ఇప్పుడే డ్రైవ్ నుండి రీఫ్రెష్ చేయండి'}
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-cream-300 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-cream-200 pb-4">
                <div>
                  <h3 className="font-semibold text-sm text-forest-950">డ్రైవ్ ఫోల్డర్ అనుసంధానం</h3>
                  <p className="text-xs text-ink-muted">ప్రత్యక్ష సింక్రొనైజేషన్ యాక్టివ్‌గా ఉంది</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  {books.length} పుస్తకాలు అందుబాటులో ఉన్నాయి
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {books.map((b) => (
                  <div key={b.slug} className="rounded-lg border border-cream-200 bg-cream-50 p-3.5">
                    <p className="font-medium text-sm text-forest-950 line-clamp-1">{b.title}</p>
                    <p className="text-xs text-ink-muted mt-1">{b.category.telugu}</p>
                    {b.pdfUrl && (
                      <a
                        href={b.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-forest-700 hover:text-forest-900 underline"
                      >
                        <Icon name="download" size={12} />
                        PDF చూడండి
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB: SYSTEM INFO */}
        {activeTab === 'info' && (
          <section className="mt-6 max-w-2xl rounded-xl border border-cream-300 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-serif font-bold text-forest-950">డేటాబేస్ & సిస్టమ్ సమాచారం</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-ink-soft">డేటాబేస్ ప్రొవైడర్:</span>
                <span className="font-semibold text-forest-900">Google Firebase Firestore</span>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-ink-soft">ప్రాజెక్ట్ ఐడి:</span>
                <span className="font-mono text-xs text-forest-900">satyasakshi-bible</span>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-ink-soft">డేటాబేస్ ప్రాంతం (Region):</span>
                <span className="font-mono text-xs text-forest-900">asia-south1 (Mumbai)</span>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-ink-soft">అడ్మిన్ ఈమెయిల్:</span>
                <span className="font-semibold text-forest-900">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">హోస్టింగ్ డొమైన్:</span>
                <span className="font-semibold text-forest-900">satyasakshi.in</span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* YOUTUBE VIDEO CREATE / EDIT MODAL */}
      {videoModalOpen && editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-forest-950 flex items-center gap-2">
                <Icon name="youtube" size={22} className="text-red-600" />
                {editingVideo.slug ? 'YouTube వీడియో సవరణ' : 'కొత్త YouTube వీడియో చేర్చండి'}
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-ink-muted hover:text-ink-strong"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  YouTube లింక్ లేదా Video ID *
                </label>
                <p className="text-[11px] text-ink-muted mb-1">
                  మీరు YouTube వీడియో లింక్ (ఉదా: <code>https://youtu.be/...</code> లేదా <code>https://www.youtube.com/watch?v=...</code>) లేదా వీడియో ID నేరుగా పేస్ట్ చేయవచ్చు.
                </p>
                <input
                  type="text"
                  required
                  value={youtubeInput}
                  onChange={(e) => {
                    const inputVal = e.target.value
                    setYoutubeInput(inputVal)
                    const extracted = extractYouTubeId(inputVal)
                    setEditingVideo({
                      ...editingVideo,
                      youtubeId: extracted,
                      slug: editingVideo.slug || extracted,
                    })
                  }}
                  placeholder="ఉదా: https://youtu.be/Q2a2PxXr3vk లేదా Q2a2PxXr3vk"
                  className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                />

                {/* Instant Live Thumbnail Preview */}
                {extractYouTubeId(youtubeInput) && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-cream-200 bg-cream-50 p-2.5">
                    <img
                      src={`https://i.ytimg.com/vi/${extractYouTubeId(youtubeInput)}/mqdefault.jpg`}
                      alt="YouTube Preview"
                      className="h-16 w-24 rounded object-cover shadow-sm bg-black"
                    />
                    <div className="text-xs text-forest-900">
                      <p className="font-semibold text-green-700 flex items-center gap-1">
                        <Icon name="check" size={13} />
                        YouTube ID గుర్తించబడింది: <code>{extractYouTubeId(youtubeInput)}</code>
                      </p>
                      <p className="text-ink-muted mt-0.5">ప్రివ్యూ కనపడుతోంది</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  శీర్షిక (Video Title) *
                </label>
                <input
                  type="text"
                  required
                  value={editingVideo.title || ''}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, title: e.target.value })
                  }
                  placeholder="ఉదా: బైబిల్ చదివే క్రమము"
                  className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                    స్లగ్ / URL ID
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVideo.slug || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, slug: e.target.value })
                    }
                    placeholder="bible-chadive-kramamu"
                    className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm font-mono focus:border-forest-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                    విభాగం (Category) *
                  </label>
                  <select
                    value={editingVideo.category || 'బైబిల్ సందేశాలు'}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        category: e.target.value as VideoCategory,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                  >
                    {VIDEO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                    బోధకుడు (Speaker)
                  </label>
                  <input
                    type="text"
                    value={editingVideo.speaker?.name || 'Bro. Sudhakar CH.'}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        speaker: { name: e.target.value, slug: 'sudhakar' },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                    వాక్య ఆధారం (Scripture - ఐచ్ఛికం)
                  </label>
                  <input
                    type="text"
                    value={editingVideo.scripture || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, scripture: e.target.value })
                    }
                    placeholder="ఉదా: లూకా 15 లేదా యోహాను 3:16"
                    className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  వివరణ (Description)
                </label>
                <textarea
                  rows={3}
                  value={editingVideo.description || ''}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, description: e.target.value })
                  }
                  placeholder="ఈ సందేశం గురించిన సంక్షిప్త వివరణ..."
                  className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredVideoCheckbox"
                  checked={Boolean(editingVideo.featured)}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-cream-300 text-forest-800 focus:ring-forest-600"
                />
                <label htmlFor="featuredVideoCheckbox" className="text-xs font-medium text-forest-950">
                  హోమ్‌పేజీ ఫీచర్డ్ వీడియోగా చూపించు (Feature this message)
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-cream-200 pt-4">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="rounded-lg border border-cream-300 px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-cream-100"
                >
                  రద్దు చేయండి
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-lg bg-forest-800 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-900 disabled:opacity-50"
                >
                  {actionLoading ? 'సేవ్ అవుతోంది...' : 'వీడియో సేవ్ చేయండి'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE CREATE / EDIT MODAL */}
      {articleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-forest-950">
                {editingArticle.slug ? 'వ్యాసం సవరణ' : 'కొత్త వ్యాసం రాయండి'}
              </h3>
              <button
                onClick={() => setArticleModalOpen(false)}
                className="text-ink-muted hover:text-ink-strong"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  శీర్షిక (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => {
                    const title = e.target.value
                    setEditingArticle({
                      ...editingArticle,
                      title,
                      slug: editingArticle.slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30),
                    })
                  }}
                  placeholder="ఉదా: ప్రార్థన శక్తి"
                  className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                    స్లగ్ / URL ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.slug || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, slug: e.target.value })
                    }
                    placeholder="praarthana-shakti"
                    className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm font-mono focus:border-forest-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                    విభాగం (Category)
                  </label>
                  <select
                    value={editingArticle.category?.slug || articleCategories[0].slug}
                    onChange={(e) => {
                      const cat = articleCategories.find((c) => c.slug === e.target.value)
                      if (cat) setEditingArticle({ ...editingArticle, category: cat })
                    }}
                    className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                  >
                    {articleCategories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.telugu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                    స్థితి (Status)
                  </label>
                  <select
                    value={editingArticle.status || 'published'}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        status: e.target.value as any,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                  >
                    <option value="published">ప్రచురించబడింది (Published)</option>
                    <option value="coming-soon">త్వరలో (Coming Soon)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                    చదివే సమయం (నిమిషాలు)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingArticle.readingMinutes || 3}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        readingMinutes: parseInt(e.target.value, 10) || 3,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  సంక్షిప్త పరిచయం (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt || ''}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                  }
                  placeholder="వ్యాసం కార్డుపై కనపడే 1-2 వాక్యాల వివరణ..."
                  className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  వ్యాసం పూర్తి పాఠం (Article Body Content)
                </label>
                <p className="text-[11px] text-ink-muted mb-1">
                  పేరాలు విభజించడానికి ఖాళీ లైన్ వదలండి. ఉప-శీర్షికల కోసం <code>## శీర్షిక</code> ఉపయోగించండి.
                </p>
                <textarea
                  rows={8}
                  value={articleBodyText}
                  onChange={(e) => setArticleBodyText(e.target.value)}
                  placeholder="వ్యాసం విషయాలను ఇక్కడ టైప్ చేయండి..."
                  className="w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm leading-relaxed focus:border-forest-600 focus:outline-none font-serif"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-cream-200 pt-4">
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="rounded-lg border border-cream-300 px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-cream-100"
                >
                  రద్దు చేయండి
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-lg bg-forest-800 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-900 disabled:opacity-50"
                >
                  {actionLoading ? 'సేవ్ అవుతోంది...' : 'వ్యాసం సేవ్ చేయండి'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUESTION CREATE / EDIT MODAL */}
      {questionModalOpen && editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-forest-950">
                {editingQuestion.slug ? 'ప్రశ్న & సమాధానం సవరణ' : 'కొత్త ప్రశ్న జోడించండి'}
              </h3>
              <button
                onClick={() => setQuestionModalOpen(false)}
                className="text-ink-muted hover:text-ink-strong"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  ప్రశ్న (Question) *
                </label>
                <input
                  type="text"
                  required
                  value={editingQuestion.question || ''}
                  onChange={(e) => {
                    const q = e.target.value
                    setEditingQuestion({
                      ...editingQuestion,
                      question: q,
                      slug: editingQuestion.slug || q.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30),
                    })
                  }}
                  placeholder="ఉదా: దేవుడు ఎవరు?"
                  className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                    స్లగ్ / URL ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingQuestion.slug || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, slug: e.target.value })
                    }
                    placeholder="devudu-evaru"
                    className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm font-mono focus:border-forest-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                    అంశం (Topic)
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.topic || 'దేవుడు'}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, topic: e.target.value })
                    }
                    placeholder="దేవుడు, రక్షణ, ప్రార్థన, బైబిల్..."
                    className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  స్థితి (Status)
                </label>
                <select
                  value={editingQuestion.status || 'published'}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      status: e.target.value as any,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                >
                  <option value="published">ప్రచురించబడింది (Published)</option>
                  <option value="coming-soon">త్వరలో (Coming Soon)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  సంక్షిప్త సమాధానం (Short Summary)
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.summary || ''}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, summary: e.target.value })
                  }
                  placeholder="జాబితా కార్డులో కనపడే సంక్షిప్త సమాధానం..."
                  className="mt-1 w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm focus:border-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  విపులమైన సమాధానం (Detailed Answer Paragraphs)
                </label>
                <p className="text-[11px] text-ink-muted mb-1">
                  పేరాలు విభజించడానికి ఖాళీ లైన్ వదలండి.
                </p>
                <textarea
                  rows={6}
                  value={questionAnswerText}
                  onChange={(e) => setQuestionAnswerText(e.target.value)}
                  placeholder="బైబిల్ ఆధారిత పూర్తి సమాధానం ఇక్కడ నమోదు చేయండి..."
                  className="w-full rounded-lg border border-cream-300 px-3.5 py-2 text-sm leading-relaxed focus:border-forest-600 focus:outline-none font-serif"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-cream-200 pt-4">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="rounded-lg border border-cream-300 px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-cream-100"
                >
                  రద్దు చేయండి
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-lg bg-forest-800 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-900 disabled:opacity-50"
                >
                  {actionLoading ? 'సేవ్ అవుతోంది...' : 'ప్రశ్న సేవ్ చేయండి'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
