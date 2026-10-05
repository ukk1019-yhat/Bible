import { useEffect } from 'react'

/**
 * Adds `is-revealed` to `[data-reveal]` elements as they enter the viewport.
 *
 * The `html.js` class is added synchronously on mount so that without JS the
 * content is simply visible — the animation is pure enhancement. Elements are
 * unobserved once revealed, so scrolling back does not re-animate.
 */
export function useScrollReveal() {
  useEffect(() => {
    document.documentElement.classList.add('js')

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      for (const node of nodes) node.classList.add('is-revealed')
      return () => document.documentElement.classList.remove('js')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    for (const node of nodes) observer.observe(node)

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('js')
    }
  }, [])
}