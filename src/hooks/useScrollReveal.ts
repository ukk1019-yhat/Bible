import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Adds `is-revealed` to `[data-reveal]` elements as they enter the viewport.
 *
 * Observes elements on initial mount, route transitions, and DOM mutations
 * (e.g. lazily loaded route chunks, category filter changes) so that content
 * is immediately revealed on client-side navigation without needing a page reload.
 */
export function useScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.classList.add('js')

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)')
      for (const node of nodes) node.classList.add('is-revealed')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '50px 0px 50px 0px', threshold: 0.01 },
    )

    const observeUnrevealed = () => {
      const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)')
      for (const node of nodes) {
        observer.observe(node)
      }
    }

    observeUnrevealed()

    // Observe newly rendered elements on dynamic changes (e.g. lazy routes, filter changes)
    const mutationObserver = new MutationObserver(() => {
      observeUnrevealed()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])
}