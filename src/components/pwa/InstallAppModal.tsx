import { useEffect, useState } from 'react'
import { Icon } from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageProvider'
import { usePwa } from '../../pwa/usePwa'

export function InstallAppModal() {
  const { t } = useLanguage()
  const { isModalOpen, closeModal, canPromptInstall, promptInstall } = usePwa()

  // Auto-detect iOS vs Android
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isIos =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      if (isIos) {
        setActiveTab('ios')
      }
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    if (!isModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isModalOpen, closeModal])

  if (!isModalOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/80 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-forest-900 text-cream-100 shadow-2xl">
        {/* Header */}
        <div className="relative border-b border-white/10 bg-forest-950/60 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400 ring-1 ring-gold-400/30">
                <Icon name="smartphone" size={24} />
              </div>
              <div>
                <span className="text-2xs font-semibold uppercase tracking-wider text-gold-400">
                  {t('footer.appBadge')}
                </span>
                <h3 id="pwa-install-title" className="text-lg font-bold text-white sm:text-xl">
                  {t('pwa.modalTitle')}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="flex size-9 items-center justify-center rounded-lg text-cream-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t('pwa.close')}
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-cream-200/80 sm:text-sm">
            {t('pwa.modalSubtitle')}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 border-b border-white/10 bg-black/20 p-1.5 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 font-medium transition-all ${
              activeTab === 'android'
                ? 'bg-emerald-600/30 text-emerald-300 ring-1 ring-emerald-400/40'
                : 'text-cream-300/70 hover:text-white'
            }`}
          >
            <Icon name="android" size={18} />
            <span>{t('pwa.androidTab')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 font-medium transition-all ${
              activeTab === 'ios'
                ? 'bg-gold-500/20 text-gold-300 ring-1 ring-gold-400/40'
                : 'text-cream-300/70 hover:text-white'
            }`}
          >
            <Icon name="apple" size={18} />
            <span>{t('pwa.iosTab')}</span>
          </button>
        </div>

        {/* Body Steps */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          {activeTab === 'android' ? (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                  1
                </span>
                <p className="text-sm leading-snug text-cream-100">{t('pwa.step1Android')}</p>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                  2
                </span>
                <p className="text-sm leading-snug text-cream-100">{t('pwa.step2Android')}</p>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                  3
                </span>
                <p className="text-sm leading-snug text-cream-100">{t('pwa.step3Android')}</p>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                  4
                </span>
                <p className="text-sm leading-snug text-cream-100">{t('pwa.step4Android')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs font-bold text-gold-300">
                  1
                </span>
                <p className="text-sm leading-snug text-cream-100">{t('pwa.step1Ios')}</p>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs font-bold text-gold-300">
                  2
                </span>
                <p className="text-sm leading-snug text-cream-100">{t('pwa.step2Ios')}</p>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs font-bold text-gold-300">
                  3
                </span>
                <p className="text-sm leading-snug text-cream-100">{t('pwa.step3Ios')}</p>
              </div>

              <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs font-bold text-gold-300">
                  4
                </span>
                <p className="text-sm leading-snug text-cream-100">{t('pwa.step4Ios')}</p>
              </div>
            </div>
          )}

          {/* Sync Guarantee Notice */}
          <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-950/40 p-3.5 text-xs leading-relaxed text-emerald-200">
            <div className="flex items-start gap-2.5">
              <Icon name="zap" size={16} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>
                <strong>{t('footer.appSyncNotice')}</strong> —{' '}
                {t('pwa.benefit3')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 bg-forest-950/60 px-6 py-4">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-cream-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            {t('pwa.close')}
          </button>

          {canPromptInstall && (
            <button
              type="button"
              onClick={promptInstall}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-emerald-500 active:scale-95"
            >
              <Icon name="download" size={16} />
              <span>{t('pwa.installNow')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
