/**
 * Satyasakshi (సత్య సాక్షి) Service Worker.
 *
 * Designed specifically for instant real-time synchronization between
 * the website and installed mobile web app (PWA) with ZERO caching glitches.
 *
 * Strategies:
 * 1. HTML Pages (navigation): Network-first with offline cache fallback.
 *    Whenever the user is online, they ALWAYS receive the newest index.html
 *    matching the latest deployment build hashes.
 * 2. Static Assets (/assets/*): Cache-first (Vite content-hashed files are immutable).
 * 3. Version file (/version.json): Network-only (never cached).
 * 4. Immediate activation: calls skipWaiting() on install and clients.claim()
 *    on activate so updates apply seamlessly without waiting for tabs to close.
 */

const CACHE_NAME = 'satyasakshi-pwa-v1'
const ASSET_CACHE = 'satyasakshi-assets-v1'

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
]

// 1. Install phase: pre-cache shell and immediately skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting()),
  )
})

// 2. Activate phase: claim clients and purge obsolete caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME && key !== ASSET_CACHE) {
              return caches.delete(key)
            }
            return null
          }),
        ),
      ),
    ]),
  )
})

// 3. Message listener: allow frontend to trigger skipWaiting on demand
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// 4. Fetch phase: robust routing strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle HTTP/HTTPS GET requests from the same origin
  if (request.method !== 'GET') return
  if (url.origin !== self.location.origin) return

  // /version.json must NEVER be cached (used to check real-time updates)
  if (url.pathname === '/version.json') {
    event.respondWith(fetch(request, { cache: 'no-store' }))
    return
  }

  // HTML navigation requests: Network-First with quick timeout
  // If online, this guarantees the user gets the fresh build immediately.
  const isNavigate =
    request.mode === 'navigate' ||
    (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))

  if (isNavigate) {
    event.respondWith(
      fetchWithTimeout(request, 2800)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(async () => {
          // If offline or request timed out, fall back to cached page or cached root shell
          const cached = await caches.match(request)
          if (cached) return cached
          const cachedShell = await caches.match('/index.html')
          if (cachedShell) return cachedShell
          return caches.match('/')
        }),
    )
    return
  }

  // Hashed Vite assets (/assets/*): Cache-First
  // Since Vite asset filenames have unique content hashes (e.g. index-B6HQSG-X.js),
  // they never mutate, making Cache-First 100% safe and lightning fast.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        if (cached) return cached
        try {
          const fresh = await fetch(request)
          if (fresh && fresh.status === 200) {
            cache.put(request, fresh.clone())
          }
          return fresh
        } catch {
          return cached
        }
      }),
    )
    return
  }

  // Bible static data (/data/bible/*) & fonts: Stale-While-Revalidate
  if (url.pathname.startsWith('/data/bible/') || url.pathname.startsWith('/fonts/')) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(request)
        const fetchPromise = fetch(request)
          .then((fresh) => {
            if (fresh && fresh.status === 200) {
              cache.put(request, fresh.clone())
            }
            return fresh
          })
          .catch(() => cached)

        return cached || fetchPromise
      }),
    )
    return
  }

  // Default: fetch from network, fallback to cache if offline
  event.respondWith(
    fetch(request).catch(() => caches.match(request)),
  )
})

/**
 * Fetch wrapper with timeout to prevent hanging on slow networks.
 */
function fetchWithTimeout(request, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Network request timed out'))
    }, timeoutMs)

    fetch(request)
      .then((res) => {
        clearTimeout(timer)
        resolve(res)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}
