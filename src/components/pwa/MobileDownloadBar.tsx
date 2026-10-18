import { useEffect, useState } from 'react'
import { Icon } from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageProvider'
import { usePwa } from '../../pwa/usePwa'

export function MobileDownloadBar() {
  const { t } = useLanguage()
  const { isInstalled, promptInstall } = usePwa()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mobileCheck =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768
      setIsMobile(mobileCheck)

      const dismissed = sessionStorage.getItem('pwa_banner_dismissed') === '1'
      if (dismissed) setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem('pwa_banner_dismissed', '1')
  }

  // Only show on mobile devices when app is not installed and not dismissed
  if (!isMobile || isInstalled || isDismissed) return null

  return (
    <div
      role="region"
      aria-label="Mobile App Direct Download"
      className="sticky top-0 z-40 border-b border-gold-500/30 bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-950 px-3 py-2 text-white shadow-md backdrop-blur-md"
    >
      <div className="shell flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/icons/icon-192.png"
            alt="Satyasakshi App Icon"
            width={36}
            height={36}
            className="size-8 shrink-0 rounded-lg object-contain bg-forest-950 ring-1 ring-gold-400/30"
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold leading-tight text-white">
              సత్య సాక్షి మొబైల్ యాప్
            </p>
            <p className="truncate text-3xs text-cream-200/80">
              మీ ఫోన్ హోమ్‌స్క్రీన్‌లో ఇన్‌స్టాల్ చేసుకోండి
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={promptInstall}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
          >
            <Icon name="download" size={14} />
            <span>డౌన్‌లోడ్</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="flex size-7 items-center justify-center rounded-md text-cream-300/70 hover:bg-white/10 hover:text-white"
            aria-label={t('pwa.close')}
          >
            <Icon name="close" size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
