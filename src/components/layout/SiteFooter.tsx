import { Link } from 'react-router-dom'
import { BrandMark, Wordmark } from '../brand/Logo'
import { Icon } from '../ui/Icon'
import { LanguageToggle } from '../ui/LanguageToggle'
import { footerInfoNav, footerResourceNav } from '../../data/navigation'
import { site } from '../../config/site'
import { useLanguage } from '../../i18n/LanguageProvider'
import { navLabel } from '../../i18n/navLabels'

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
            className="mx-auto max-w-2xl font-serif text-lg leading-relaxed text-cream-100 sm:text-xl"
          >
            «నీ వాక్యము నా పాదములకు దీపమును, నా త్రోవకు వెలుగై యున్నది»
          </p>
          <p className="mt-3 text-sm text-gold-400/90">{t('footer.psalmRef')}</p>
        </div>
      </div>

      <div className="shell grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <BrandMark size={40} />
            <Wordmark onDark />
          </div>

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

      <div className="border-t border-white/8">
        <div className="shell flex flex-col gap-5 py-7 text-xs text-cream-300/65 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p>
              © {year} {site.brand.telugu}. {t('footer.rights')}
            </p>
            <LanguageToggle compact />
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
