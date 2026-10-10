import { site } from '../../config/site'
import { Icon } from '../ui/Icon'
import { useLanguage } from '../../i18n/LanguageProvider'

export function FooterLocations() {
  const { t, language } = useLanguage()

  return (
    <section aria-labelledby="footer-locations-heading" className="border-t border-white/10 pt-12 pb-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1 text-2xs font-semibold uppercase tracking-[0.18em] text-gold-300">
            <Icon name="map-pin" size={13} className="text-gold-400" />
            {t('footer.locationsHeading')}
          </span>
          <h2
            id="footer-locations-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-cream-50 sm:text-3xl font-serif"
          >
            {t('footer.locationsTitle')}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cream-300/80">
            {t('footer.locationsSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 text-2xs text-gold-400/85">
          <Icon name="sparkle" size={14} className="text-gold-400" />
          <span>{language === 'en' ? 'Direct Navigation & Verified QR' : 'ప్రత్యక్ష గూగుల్ మ్యాప్స్ నావిగేషన్'}</span>
        </div>
      </div>

      <div className={site.locations.length > 1 ? "grid gap-6 md:grid-cols-2" : "grid gap-6 max-w-2xl"}>
        {site.locations.map((loc) => {
          const isTelugu = language === 'te'
          const title = isTelugu ? loc.teluguName : loc.name
          const subtitle = isTelugu ? loc.name : loc.teluguName
          const tag = isTelugu ? loc.tag : loc.englishTag
          const address = isTelugu ? loc.addressLine1 + ', ' + loc.addressLine2 : loc.fullAddress

          return (
            <article
              key={loc.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-forest-900/90 via-forest-900/70 to-forest-950/95 p-6 sm:p-7 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-gold-500/50 hover:bg-forest-900/95 hover:shadow-2xl hover:shadow-gold-500/10 hover:-translate-y-0.5"
            >
              {/* Subtle gold ambient glow behind card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-gold-500/8 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60"
              />

              <div>
                {/* Header row: badge + city location */}
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/12 px-3 py-0.5 text-2xs font-semibold text-gold-300">
                    <span className="size-1.5 rounded-full bg-gold-400 animate-pulse" />
                    {tag}
                  </span>

                  <span
                    title={isTelugu ? 'ప్రాంతం' : 'Location'}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-2xs font-medium text-cream-200/90"
                  >
                    <Icon name="map-pin" size={11} className="text-gold-400" />
                    {isTelugu ? loc.area : loc.city}
                  </span>
                </div>

                {/* Title & subtitle */}
                <div className="mt-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-cream-50 transition-colors group-hover:text-gold-200">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium tracking-wide text-gold-400/90">
                    {subtitle}
                  </p>
                </div>

                {/* Address block */}
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/8 bg-black/20 p-3.5">
                  <Icon name="map-pin" size={18} className="mt-0.5 shrink-0 text-gold-400" />
                  <p className="text-[0.92rem] leading-relaxed text-cream-200/90">
                    {address}
                  </p>
                </div>
              </div>

              {/* Action row: Navigation Button + QR Code */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-5">
                <div className="flex flex-col gap-1.5">
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold-500/35 bg-gold-500/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-gold-200 shadow-xs transition-all duration-200 hover:border-gold-400 hover:bg-gold-500 hover:text-forest-950 hover:shadow-md hover:shadow-gold-500/20"
                    aria-label={`${title} — ${t('footer.getDirections')}`}
                  >
                    <Icon name="map-pin" size={15} />
                    <span>{t('footer.getDirections')}</span>
                    <Icon name="external" size={14} className="opacity-80" />
                  </a>
                  <span className="text-3xs text-cream-400/65 hidden sm:inline">
                    {t('footer.scanPrompt')}
                  </span>
                </div>

                {/* Scannable QR code thumbnail with direct link */}
                <a
                  href={loc.mapUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  title={`${title} — ${t('footer.scanQr')}`}
                  className="group/qr inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/95 p-1.5 pr-3 shadow-md transition-all duration-300 hover:border-gold-400 hover:bg-white hover:scale-[1.03] hover:shadow-xl self-start sm:self-auto"
                >
                  <img
                    src={loc.qrImage}
                    alt={`${loc.name} Google Maps QR Code`}
                    width={64}
                    height={64}
                    className="size-14 sm:size-16 rounded-lg object-contain bg-white ring-1 ring-black/5"
                    loading="lazy"
                  />
                  <div className="flex flex-col text-left">
                    <span className="flex items-center gap-1 text-3xs font-bold uppercase tracking-wider text-forest-950">
                      <Icon name="qr-code" size={12} className="text-forest-800" />
                      {t('footer.scanQr')}
                    </span>
                    <span className="mt-0.5 text-3xs font-medium text-stone-600">
                      Google Maps
                    </span>
                    <span className="text-3xs text-gold-700 font-semibold group-hover/qr:underline">
                      {isTelugu ? 'ఓపెన్ చేయండి →' : 'Open in Maps →'}
                    </span>
                  </div>
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
