import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageProvider'
import { usePwa } from '../../pwa/usePwa'

export function UpdateBanner() {
  const { t } = useLanguage()
  const { isUpdateAvailable, applyUpdate } = usePwa()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isUpdateAvailable || isDismissed) return null

  return (
    <div
      role="region"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 animate-bounce-subtle sm:bottom-6"
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-gold-400/50 bg-forest-950/95 p-3.5 shadow-2xl backdrop-blur-md sm:p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400">
            <Icon name="sparkle" size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-white sm:text-sm">
              {t('pwa.updateReadyTitle')}
            </p>
            <p className="text-2xs text-cream-200/80 sm:text-xs">
              {t('pwa.updateReadyDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={applyUpdate}
            className="shrink-0 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-500 active:scale-95"
          >
            {t('pwa.reloadNow')}
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="flex size-7 items-center justify-center rounded-lg text-cream-300 hover:bg-white/10 hover:text-white"
            aria-label={t('pwa.close')}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
