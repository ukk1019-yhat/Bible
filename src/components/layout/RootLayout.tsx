import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { useScrollReveal } from '../../hooks/useScrollReveal'

/**
 * Scroll behaviour for client-side navigation.
 *
 * Restores the previous offset on back/forward (which is what a reader
 * expects when they return from a chapter) and jumps to top on a new page.
 * A hash in the URL is honoured so `#v12` deep links still work.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ block: 'start' })
        return
      }
    }

    const saved = window.sessionStorage.getItem(`scroll:${key}`)
    if (saved !== null) {
      window.scrollTo(0, Number(saved))
      return
    }

    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash, key])

  useEffect(() => {
    const save = () => {
      window.sessionStorage.setItem(`scroll:${key}`, String(window.scrollY))
    }
    window.addEventListener('scroll', save, { passive: true })
    return () => {
      save()
      window.removeEventListener('scroll', save)
    }
  }, [key])

  return null
}

export function RootLayout() {
  useScrollReveal()

  return (
    <div className="relative flex min-h-dvh flex-col bg-cream-100">
      <ScrollManager />

      {/* Low-opacity background brand watermark across all pages */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center overflow-hidden select-none"
      >
        <img
          src="/brand/satyasakshi-watermark.png"
          alt=""
          width={500}
          height={500}
          className="w-[min(520px,76vw)] max-h-[70vh] object-contain opacity-[0.042] mix-blend-multiply transition-opacity duration-700"
          loading="eager"
        />
      </div>

      <SiteHeader />

      <main id="main" className="relative z-0 flex-1">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  )
}
