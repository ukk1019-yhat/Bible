import { Link } from 'react-router-dom'
import { BrandLockup } from '../brand/Logo'
import { Icon } from '../ui/Icon'
import { LanguageToggle } from '../ui/LanguageToggle'
import { footerInfoNav, footerResourceNav } from '../../data/navigation'
import { site } from '../../config/site'
import { useLanguage } from '../../i18n/LanguageProvider'
import { navLabel } from '../../i18n/navLabels'
import { FooterLocations } from './FooterLocations'
import { InstallAppCard } from '../pwa/InstallAppCard'

const year = new Date().getFullYear()

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto bg-forest-950 text-cream-200">
      {/*
        Footer verse — the line the existing site closes with.

        The verse text stays in Telugu in every language, because it is scripture
        and the only published text of it here is the Telugu (BSI). Only the
        reference label is translated, so a reader knows which passage it is
        without the verse itself being presented as a translation.
      */}
      <div className="border-b border-white/8">
        <div className="shell py-10 text-center">
          <p
            lang="te"
            className="mx-auto max-w-2xl text-lg leading-relaxed text-cream-100 sm:text-xl"
          >
            «నీ వాక్యము నా పాదములకు దీపమును, నా త్రోవకు వెలుగై యున్నది»
          </p>
          <p className="mt-3 text-sm text-gold-400/90">{t('footer.psalmRef')}</p>
        </div>
      </div>

      <div className="shell grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
        <div className="max-w-sm">
          <BrandLockup onDark size="lg" />

          {/*
            The brand lines are published Telugu copy, so they stay Telugu.
            `lang` marks them as such for assistive tech rather than letting an
            English interface mispronounce them.
          */}
          <p lang="te" className="mt-5 text-[0.95rem] leading-relaxed text-cream-300/85">
            {site.brand.mission}. {site.brand.promise}
          </p>

          <a
            href={site.youtube.channelUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex min-h-10 items-center gap-2.5 rounded-[var(--radius-sm)] border border-white/15 px-4 text-sm text-cream-100 transition-colors hover:border-gold-500/60 hover:text-white"
          >
            <Icon name="youtube" size={18} className="text-gold-400" />
            Church of The Living God — Kakinada
            <Icon name="external" size={14} className="text-cream-300/70" />
          </a>

          {site.contact.phone && (
            <a
              href={site.contact.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 flex min-h-10 items-center gap-2.5 rounded-[var(--radius-sm)] border border-white/15 px-4 text-sm text-cream-100 transition-colors hover:border-emerald-500/60 hover:text-white"
            >
              <Icon name="whatsapp" size={18} className="text-emerald-400" />
              <span>WhatsApp: {site.contact.phoneFormatted}</span>
              <Icon name="external" size={14} className="text-cream-300/70" />
            </a>
          )}

          {site.contact.email && (
            <a
              href={`mailto:${site.contact.email}`}
              className="mt-3 flex min-h-10 items-center gap-2.5 rounded-[var(--radius-sm)] border border-white/15 px-4 text-sm text-cream-100 transition-colors hover:border-gold-500/60 hover:text-white"
            >
              <Icon name="mail" size={18} className="text-gold-400" />
              <span>{site.contact.email}</span>
            </a>
          )}
        </div>

        <nav aria-labelledby="footer-resources">
          <h2
            id="footer-resources"
            className="text-2xs font-semibold uppercase tracking-[0.16em] text-gold-400"
          >
            {t('footer.resources')}
          </h2>
          <ul className="mt-5 space-y-3">
            {footerResourceNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-[0.95rem] text-cream-300/85 transition-colors hover:text-white"
                >
                  {navLabel(item.to, t)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-info">
          <h2
            id="footer-info"
            className="text-2xs font-semibold uppercase tracking-[0.16em] text-gold-400"
          >
            {t('footer.info')}
          </h2>
          <ul className="mt-5 space-y-3">
            {footerInfoNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-[0.95rem] text-cream-300/85 transition-colors hover:text-white"
                >
                  {navLabel(item.to, t)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="shell pb-10">
        <InstallAppCard />
      </div>

      <div className="shell pb-12">
        <FooterLocations />
      </div>

      {/* Setsuzoku Design & Technology Partner Showcase */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="shell flex flex-col items-center justify-between gap-5 py-6 sm:flex-row sm:gap-6">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
              Technology &amp; Design Partner
            </span>
            <p className="mt-1 text-sm text-cream-300/80">
              డిజిటల్ వేదిక రూపకల్పన &amp; సాంకేతిక నిర్వహణ
            </p>
          </div>

          <a
            href={site.credits.website}
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-emerald-400/60 hover:bg-white/10 hover:shadow-xl hover:shadow-emerald-950/50"
            title={`${site.credits.designedBy} - ${site.credits.displayUrl}`}
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-md transition-transform duration-300 group-hover:scale-105">
              <img
                src={site.credits.emblem}
                alt={`${site.credits.designedBy} Logo`}
                width={48}
                height={48}
                className="size-11 object-contain"
              />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream-300/80">
                {t('footer.designedBy')}
              </span>
              <div className="mt-0.5 flex flex-wrap items-center gap-2.5">
                <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-emerald-300 sm:text-xl">
                  {site.credits.designedBy}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-0.5 font-mono text-xs font-semibold text-emerald-300 transition-colors group-hover:bg-emerald-500/30 group-hover:text-emerald-200">
                  {site.credits.displayUrl}
                  <Icon
                    name="external"
                    size={12}
                    className="opacity-80 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="shell flex flex-col gap-5 py-7 text-xs text-cream-300/65 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>
              © {year} {site.brand.telugu}. {t('footer.rights')}
            </p>
            <span className="hidden text-white/20 sm:inline" aria-hidden="true">
              •
            </span>
            <p className="text-cream-300/80">
              {t('footer.designedBy')}{' '}
              <a
                href={site.credits.website}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-gold-400/90 transition-colors hover:text-gold-300 hover:underline"
              >
                {site.credits.designedBy} ({site.credits.displayUrl})
              </a>
            </p>
            <span className="hidden text-white/20 sm:inline" aria-hidden="true">
              •
            </span>
            <div className="flex items-center gap-3">
              <LanguageToggle compact />
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 text-[11px] text-cream-400/50 transition-colors hover:text-gold-300"
                title="అడ్మిన్ పోర్టల్"
              >
                అడ్మిన్
              </Link>
            </div>
          </div>

          {/* Bible text attribution — required, and honest, in every language. */}
          <p className="max-w-xl md:text-right">
            {t('footer.bibleText')}{' '}
            <a
              href="https://github.com/sajeevavahini/bibles"
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline text-cream-300/85 hover:text-white"
            >
              {t('footer.bibleSource')}
            </a>
            {t('footer.bibleCredit')}
          </p>
        </div>
      </div>
    </footer>
  )
}
