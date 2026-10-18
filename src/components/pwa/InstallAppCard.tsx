import { Icon } from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageProvider'
import { usePwa } from '../../pwa/usePwa'

export function InstallAppCard() {
  const { t } = useLanguage()
  const {
    isInstalled,
    promptInstall,
    openModal,
    checkForUpdates,
    isCheckingUpdate,
    checkStatus,
    isUpdateAvailable,
    applyUpdate,
  } = usePwa()

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-forest-900/90 via-forest-900/70 to-emerald-950/80 p-6 shadow-2xl backdrop-blur-md transition-all sm:p-8">
      {/* Subtle decorative glow */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 size-56 rounded-full bg-gold-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left column: Icon & Details */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* App Icon preview */}
          <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-forest-950 p-2 shadow-inner ring-1 ring-white/20 sm:size-20">
            <img
              src="/icons/icon-192.png"
              alt="సత్య సాక్షి యాప్ ఐకాన్"
              width={72}
              height={72}
              className="size-12 rounded-xl object-contain sm:size-16"
            />
            {/* Live sync pulse badge */}
            <span
              className="absolute -right-1 -top-1 flex size-4 items-center justify-center"
              title="Real-time sync active"
            >
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-500/15 px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wider text-gold-300">
                <Icon name="smartphone" size={12} />
                {t('footer.appBadge')}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-2xs font-medium text-emerald-300">
                <Icon name="zap" size={12} />
                రియల్-టైమ్ సింక్
              </span>
            </div>

            <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              {t('footer.appTitle')}
            </h3>

            <p className="max-w-2xl text-xs leading-relaxed text-cream-200/80 sm:text-sm">
              {t('footer.appSubtitle')}
            </p>
          </div>
        </div>

        {/* Right column: Action Buttons */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          {isInstalled ? (
            /* When user is already in standalone installed app */
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-200">
                <Icon name="check" size={16} className="text-emerald-400" />
                <span>{t('footer.appInstalled')} ✓</span>
              </div>

              {isUpdateAvailable ? (
                <button
                  type="button"
                  onClick={applyUpdate}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2 text-xs font-bold text-forest-950 shadow-lg transition-transform hover:bg-gold-400 active:scale-95"
                >
                  <Icon name="refresh" size={14} className="animate-spin" />
                  <span>{t('pwa.reloadNow')}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={checkForUpdates}
                    disabled={isCheckingUpdate}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-cream-200 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-60"
                  >
                    <Icon
                      name="refresh"
                      size={13}
                      className={isCheckingUpdate ? 'animate-spin text-gold-400' : ''}
                    />
                    <span>
                      {isCheckingUpdate ? t('footer.appChecking') : t('footer.appCheckUpdate')}
                    </span>
                  </button>
                  {checkStatus === 'up-to-date' && (
                    <span className="text-2xs text-emerald-300">{t('footer.appUpdated')} ✓</span>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* When user visits from browser on phone/desktop */
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={promptInstall}
                className="group inline-flex items-center gap-2.5 rounded-xl border border-emerald-400/50 bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/60 active:scale-95"
              >
                <Icon
                  name="download"
                  size={18}
                  className="transition-transform group-hover:translate-y-0.5"
                />
                <span>{t('footer.appInstallBtn')}</span>
              </button>

              {/* Scannable QR code badge */}
              <button
                type="button"
                onClick={openModal}
                title={t('footer.appScanQr')}
                className="group/qr inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white p-1.5 pr-3 shadow-md transition-all duration-300 hover:border-gold-400 hover:bg-cream-50 hover:scale-[1.02] hover:shadow-xl"
              >
                <img
                  src="/brand/qr-download-app.png"
                  alt="Satyasakshi App Download QR Code"
                  width={56}
                  height={56}
                  className="size-12 rounded-lg object-contain bg-white"
                  loading="lazy"
                />
                <div className="flex flex-col text-left">
                  <span className="flex items-center gap-1 text-3xs font-bold uppercase tracking-wider text-forest-950">
                    <Icon name="qr-code" size={11} className="text-forest-800" />
                    {t('footer.scanQr')}
                  </span>
                  <span className="text-3xs font-semibold text-stone-700">
                    మొబైల్ కెమెరాతో
                  </span>
                  <span className="text-3xs font-bold text-emerald-800 group-hover/qr:underline">
                    యాప్ పొందండి →
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-medium text-cream-200 transition-colors hover:border-gold-400/40 hover:bg-white/10 hover:text-white"
              >
                <Icon name="question" size={15} className="text-gold-400" />
                <span>{t('footer.appGuideLink')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
