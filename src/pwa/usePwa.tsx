import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PwaContextValue {
  /** True if the browser supports 1-click native install prompt */
  canPromptInstall: boolean
  /** True if the app is currently running as an installed standalone PWA */
  isInstalled: boolean
  /** True if a newer version of the website has been deployed */
  isUpdateAvailable: boolean
  /** Loading indicator when user clicks 'Check for updates' */
  isCheckingUpdate: boolean
  /** Feedback message after manual update check */
  checkStatus: 'idle' | 'up-to-date' | 'update-found' | 'error'
  /** Trigger native install prompt or open the install guide modal */
  promptInstall: () => Promise<void>
  /** Apply latest update immediately by refreshing to new service worker assets */
  applyUpdate: () => void
  /** Manually trigger an update check */
  checkForUpdates: () => Promise<void>
  /** Control the installation guide dialog */
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const PwaContext = createContext<PwaContextValue | null>(null)

export function PwaProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false)
  const [checkStatus, setCheckStatus] = useState<'idle' | 'up-to-date' | 'update-found' | 'error'>(
    'idle',
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null)
  const currentVersionRef = useRef<string | null>(null)

  // 1. Detect if running in standalone mode (installed PWA)
  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://')
      setIsInstalled(isStandalone)
    }

    checkStandalone()
    const matcher = window.matchMedia('(display-mode: standalone)')
    matcher.addEventListener('change', checkStandalone)

    // Intercept native beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // App installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setIsModalOpen(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      matcher.removeEventListener('change', checkStandalone)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // 2. Prevent dynamic chunk load glitches (Vite chunk rotation on deployment)
  useEffect(() => {
    const handlePreloadError = (event: Event) => {
      event.preventDefault()
      console.warn('Vite preload error detected. Reloading to synchronize latest app version...')
      const lastReload = sessionStorage.getItem('chunk_reload_ts')
      const now = Date.now()
      if (!lastReload || now - Number(lastReload) > 8000) {
        sessionStorage.setItem('chunk_reload_ts', String(now))
        window.location.reload()
      }
    }

    window.addEventListener('vite:preloadError', handlePreloadError)

    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message || ''
      if (
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('error loading dynamically imported module') ||
        msg.includes('Importing a module script failed')
      ) {
        const lastReload = sessionStorage.getItem('chunk_reload_ts')
        const now = Date.now()
        if (!lastReload || now - Number(lastReload) > 8000) {
          sessionStorage.setItem('chunk_reload_ts', String(now))
          window.location.reload()
        }
      }
    }

    window.addEventListener('error', handleGlobalError)

    return () => {
      window.removeEventListener('vite:preloadError', handlePreloadError)
      window.removeEventListener('error', handleGlobalError)
    }
  }, [])

  // 3. Register Service Worker and synchronize updates in real time
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    // Fetch initial version from /version.json
    fetch('/version.json?t=' + Date.now(), { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.version) {
          currentVersionRef.current = data.version
        }
      })
      .catch(() => {})

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        swRegistrationRef.current = registration

        // Check if there is already an updated service worker waiting
        if (registration.waiting) {
          setIsUpdateAvailable(true)
        }

        // Listen for new service worker installation
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available and waiting
              setIsUpdateAvailable(true)
            }
          })
        })
      })
      .catch((err) => {
        console.warn('Service Worker registration skipped or failed:', err)
      })

    // When the new worker takes control, signal update ready
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        // If the user hasn't explicitly reloaded, ensure clean reload
        window.location.reload()
      }
    })

    // Check for updates automatically when user returns to tab/app
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && swRegistrationRef.current) {
        swRegistrationRef.current.update().catch(() => {})
        checkServerVersion()
      }
    }

    // Periodic check every 4 minutes while app is running
    const interval = window.setInterval(() => {
      if (swRegistrationRef.current) {
        swRegistrationRef.current.update().catch(() => {})
      }
      checkServerVersion()
    }, 4 * 60 * 1000)

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleVisibility)
    }
  }, [])

  // Check if server's /version.json has a newer version than current
  const checkServerVersion = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' })
      if (!res.ok) return false
      const data = await res.json()
      if (data?.version && currentVersionRef.current && data.version !== currentVersionRef.current) {
        setIsUpdateAvailable(true)
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  // Manual update check triggered by user button
  const checkForUpdates = useCallback(async () => {
    setIsCheckingUpdate(true)
    setCheckStatus('idle')

    try {
      if (swRegistrationRef.current) {
        await swRegistrationRef.current.update()
      }

      const hasNewVersion = await checkServerVersion()

      if (hasNewVersion || isUpdateAvailable || (swRegistrationRef.current?.waiting)) {
        setIsUpdateAvailable(true)
        setCheckStatus('update-found')
      } else {
        setCheckStatus('up-to-date')
        setTimeout(() => setCheckStatus('idle'), 4000)
      }
    } catch {
      setCheckStatus('error')
      setTimeout(() => setCheckStatus('idle'), 4000)
    } finally {
      setIsCheckingUpdate(false)
    }
  }, [checkServerVersion, isUpdateAvailable])

  // Apply update immediately
  const applyUpdate = useCallback(() => {
    const reg = swRegistrationRef.current
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    // Hard reload without cache
    window.location.reload()
  }, [])

  // Prompt install
  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null)
        }
      } catch {
        setIsModalOpen(true)
      }
    } else {
      // Show instructional modal for iOS / manual installation
      setIsModalOpen(true)
    }
  }, [deferredPrompt])

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  return (
    <PwaContext.Provider
      value={{
        canPromptInstall: Boolean(deferredPrompt),
        isInstalled,
        isUpdateAvailable,
        isCheckingUpdate,
        checkStatus,
        promptInstall,
        applyUpdate,
        checkForUpdates,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </PwaContext.Provider>
  )
}

export function usePwa() {
  const context = useContext(PwaContext)
  if (!context) {
    throw new Error('usePwa must be used within a PwaProvider')
  }
  return context
}
