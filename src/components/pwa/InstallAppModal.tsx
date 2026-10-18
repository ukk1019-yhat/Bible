import { useEffect, useState } from 'react'
import { Icon } from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageProvider'
import { usePwa } from '../../pwa/usePwa'

export function InstallAppModal() {
  const { t } = useLanguage()
  const { isModalOpen, closeModal, canPromptInstall, promptInstall, isInstalled } = usePwa()

  // Auto-detect iOS vs Android
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android')
  const [isMobile, setIsMobile] = useState(false)
  const [showGuideNotice, setShowGuideNotice] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isIos =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      if (isIos) {
        setActiveTab('ios')
      }
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768)
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

  const handleInstallClick = async () => {
    if (canPromptInstall) {
      await promptInstall()
    } else {
      setShowGuideNotice(true)
      const guideEl = document.getElementById('install-steps-container')
      if (guideEl) {
        guideEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }

  if (!isModalOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/85 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden rounded-2xl border border-gold-500/30 bg-forest-900 text-cream-100 shadow-2xl">
        {/* Header */}
        <div className="relative border-b border-white/10 bg-forest-950/70 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400 ring-1 ring-gold-400/40">
                <Icon name="smartphone" size={24} />
              </div>
              <div>
                <span className="text-2xs font-semibold uppercase tracking-wider text-gold-400">
                  {t('footer.appBadge')}
                </span>
                <h3 id="pwa-install-title" className="text-base font-bold text-white sm:text-xl">
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

          <p className="mt-2 text-xs leading-relaxed text-cream-200/80 sm:text-sm">
            {t('pwa.modalSubtitle')}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4">
          {/* DIRECT 1-TAP INSTALL CARD (ALWAYS PROMINENT AT TOP) */}
          <div className="rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-950/80 via-forest-900 to-forest-950 p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-3.5 mb-3.5">
              <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-forest-950 p-1.5 ring-2 ring-emerald-400/50 shadow-md">
                <img
                  src="/icons/icon-192.png"
                  alt="Satyasakshi App Icon"
                  width={56}
                  height={56}
                  className="size-11 rounded-xl object-contain"
                />
                <span className="absolute -right-1 -top-1 flex size-3.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-3.5 rounded-full bg-emerald-500" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-white leading-tight">
                  సత్య సాక్షి — Satyasakshi
                </h4>
                <p className="text-2xs text-emerald-300/90 font-medium mt-0.5">
                  మొబైల్ హోమ్‌స్క్రీన్ యాప్ • 1.8 MB
                </p>
                <p className="text-3xs text-cream-300/70 truncate mt-0.5">
                  పరిశుద్ధ బైబిల్, సందేశాలు, ప్రశ్నలు & సమాధానాలు
                </p>
              </div>
            </div>

            {/* Direct Action Button */}
            {isInstalled ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/20 py-3 px-4 text-xs font-semibold text-emerald-200">
                <Icon name="check" size={16} className="text-emerald-400" />
                <span>{t('footer.appInstalled')} ✓</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 py-3.5 px-5 text-sm sm:text-base font-bold text-white shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-400/60 hover:brightness-110 active:scale-98 transition-all"
              >
                <Icon name="download" size={20} className="animate-bounce" />
                <span>ఇప్పుడే ఇన్‌స్టాల్ చేసుకోండి (Install App Now)</span>
              </button>
            )}

            {showGuideNotice && !canPromptInstall && (
              <p className="mt-2.5 text-center text-xs text-gold-300 animate-pulse">
                👇 కింద ఇచ్చిన సాధారణ దశల (Steps) ద్వారా నేరుగా హోమ్‌స్క్రీన్‌కు జోడించండి:
              </p>
            )}
          </div>

          {/* DESKTOP-ONLY QR CODE SECTION (NEVER SHOWN ON MOBILE PHONES) */}
          {!isMobile && (
            <div className="hidden md:flex items-center gap-4 rounded-2xl border border-gold-400/30 bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-950 p-4 shadow-inner">
              <div className="relative shrink-0 rounded-xl bg-white p-2 shadow-lg ring-2 ring-gold-400/40">
                <img
                  src="/brand/qr-download-app.png"
                  alt="Satyasakshi Mobile App Download QR Code"
                  width={100}
                  height={100}
                  className="size-24 rounded-lg object-contain bg-white"
                />
              </div>

              <div className="flex flex-col items-start text-left space-y-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-500/15 px-2.5 py-0.5 text-3xs font-bold uppercase tracking-wider text-gold-300">
                  <Icon name="qr-code" size={11} />
                  {t('pwa.scanQrTitle')}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {t('footer.appScanQr')}
                </h4>
                <p className="text-xs text-cream-200/80 leading-relaxed">
                  {t('footer.appScanDesc')}
                </p>
                <a
                  href="/brand/qr-download-app.png"
                  download="satyasakshi-app-qr.png"
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 hover:underline"
                >
                  <Icon name="download" size={13} />
                  <span>{t('pwa.downloadQrBtn')}</span>
                </a>
              </div>
            </div>
          )}

          {/* Tab Selection */}
          <div id="install-steps-container" className="grid grid-cols-2 rounded-xl border border-white/10 bg-black/30 p-1 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab('android')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 font-medium transition-all ${
                activeTab === 'android'
                  ? 'bg-emerald-600/30 text-emerald-300 ring-1 ring-emerald-400/40 font-bold'
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
                  ? 'bg-gold-500/20 text-gold-300 ring-1 ring-gold-400/40 font-bold'
                  : 'text-cream-300/70 hover:text-white'
              }`}
            >
              <Icon name="apple" size={18} />
              <span>{t('pwa.iosTab')}</span>
            </button>
          </div>

          {/* Step-by-Step Instructions */}
          {activeTab === 'android' ? (
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                  1
                </span>
                <p className="text-xs sm:text-sm leading-snug text-cream-100">{t('pwa.step1Android')}</p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-emerald-400/40 bg-emerald-950/30 p-3 ring-1 ring-emerald-400/30">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-forest-950">
                  2
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                    {t('pwa.step2Android')}
                  </p>
                  <p className="text-2xs text-cream-300/80 mt-0.5">
                    కుడివైపు పైన లేదా కింద ఉన్న (⋮ మూడు చుక్కలు) మెనూ బటన్ నొక్కండి
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-emerald-400/40 bg-emerald-950/30 p-3 ring-1 ring-emerald-400/30">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-forest-950">
                  3
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                    {t('pwa.step3Android')}
                  </p>
                  <p className="text-2xs text-cream-300/80 mt-0.5">
                    "Install app" లేదా "Add to Home screen" నొక్కండి
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                  4
                </span>
                <p className="text-xs sm:text-sm leading-snug text-cream-100">{t('pwa.step4Android')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs font-bold text-gold-300">
                  1
                </span>
                <p className="text-xs sm:text-sm leading-snug text-cream-100">{t('pwa.step1Ios')}</p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-gold-400/40 bg-gold-950/30 p-3 ring-1 ring-gold-400/30">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-forest-950">
                  2
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                    {t('pwa.step2Ios')}
                  </p>
                  <p className="text-2xs text-gold-200/90 mt-0.5">
                    కింద ఉన్న 'Share' బటన్ (⎋ బాణం గుర్తు) నొక్కండి
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-gold-400/40 bg-gold-950/30 p-3 ring-1 ring-gold-400/30">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-forest-950">
                  3
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                    {t('pwa.step3Ios')}
                  </p>
                  <p className="text-2xs text-gold-200/90 mt-0.5">
                    కిందికి స్క్రోల్ చేసి 'Add to Home Screen' (➕) ఎంచుకోండి
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs font-bold text-gold-300">
                  4
                </span>
                <p className="text-xs sm:text-sm leading-snug text-cream-100">{t('pwa.step4Ios')}</p>
              </div>
            </div>
          )}

          {/* Sync Guarantee Notice */}
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-950/50 p-3 text-xs leading-relaxed text-emerald-200">
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
        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-forest-950/70 px-5 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-white/15 px-4 py-2 text-xs sm:text-sm text-cream-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            {t('pwa.close')}
          </button>

          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-500 active:scale-95"
          >
            <Icon name="download" size={16} />
            <span>{t('pwa.installNow')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
