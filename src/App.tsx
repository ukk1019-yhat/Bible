import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import { HomePage } from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

/**
 * Route-level code splitting.
 *
 * The homepage and the Bible reader are the only routes most visitors need up
 * front, so everything else loads on demand. This keeps the first bundle small
 * on slow connections — important for readers on modest devices and data.
 */
const BiblePage = lazy(() => import('./pages/BiblePage').then((m) => ({ default: m.BiblePage })))
const BibleSearchPage = lazy(() =>
  import('./pages/BibleSearchPage').then((m) => ({ default: m.BibleSearchPage })),
)
const BibleBookPage = lazy(() =>
  import('./pages/BibleBookPage').then((m) => ({ default: m.BibleBookPage })),
)
const BibleChapterRoute = lazy(() =>
  import('./pages/BibleBookPage').then((m) => ({ default: m.BibleChapterRoute })),
)
const QuestionsPage = lazy(() =>
  import('./pages/QuestionsPage').then((m) => ({ default: m.QuestionsPage })),
)
const QuestionRoute = lazy(() =>
  import('./pages/QuestionsPage').then((m) => ({ default: m.QuestionRoute })),
)
const MessagesPage = lazy(() =>
  import('./pages/VideosPage').then((m) => ({ default: m.MessagesPage })),
)
const VideosPage = lazy(() => import('./pages/VideosPage').then((m) => ({ default: m.VideosPage })))
const VideoRoute = lazy(() => import('./pages/VideosPage').then((m) => ({ default: m.VideoRoute })))
const ArticlesPage = lazy(() =>
  import('./pages/ArticlesPage').then((m) => ({ default: m.ArticlesPage })),
)
const ArticleRoute = lazy(() =>
  import('./pages/ArticlesPage').then((m) => ({ default: m.ArticleRoute })),
)
const BooksPage = lazy(() => import('./pages/BooksPage').then((m) => ({ default: m.BooksPage })))
const SearchPage = lazy(() => import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const PrivacyPage = lazy(() =>
  import('./pages/LegalPages').then((m) => ({ default: m.PrivacyPage })),
)
const TermsPage = lazy(() => import('./pages/LegalPages').then((m) => ({ default: m.TermsPage })))

/** Shown while a lazily loaded route is fetched. */
function RouteFallback() {
  return (
    <div className="shell py-24" aria-busy="true" aria-live="polite">
      <p className="sr-only">పేజీ లోడ్ అవుతోంది</p>
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-9 w-3/4 animate-pulse rounded-[var(--radius-xs)] bg-cream-200" />
        <div className="h-5 w-full animate-pulse rounded-[var(--radius-xs)] bg-cream-200" />
        <div className="h-5 w-5/6 animate-pulse rounded-[var(--radius-xs)] bg-cream-200" />
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteFallback />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'bible', element: <BiblePage /> },
      { path: 'bible/search', element: <BibleSearchPage /> },
      { path: 'bible/:bookSlug', element: <BibleBookPage /> },
      { path: 'bible/:bookSlug/:chapter', element: <BibleChapterRoute /> },
      { path: 'questions', element: <QuestionsPage /> },
      { path: 'questions/:slug', element: <QuestionRoute /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'videos', element: <VideosPage /> },
      { path: 'videos/:slug', element: <VideoRoute /> },
      { path: 'articles', element: <ArticlesPage /> },
      { path: 'articles/:slug', element: <ArticleRoute /> },
      { path: 'books', element: <BooksPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
