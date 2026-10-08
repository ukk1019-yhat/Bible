import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BrandLockup } from '../brand/Logo'
import { Icon } from '../ui/Icon'
import { LanguageToggle } from '../ui/LanguageToggle'
import { primaryNav } from '../../data/navigation'
import { useFocusTrap, useScrolled } from '../../hooks/useUi'
import { useLanguage } from '../../i18n/LanguageProvider'
import { navLabel } from '../../i18n/navLabels'
import { site } from '../../config/site'

/** Nav links shown in the header. Contact lives in the drawer/footer only. */
const headerNav = primaryNav.filter(
  (item) => !['/about', '/contact'].includes(item.to),
)

function isActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

function NavRow({ to, label, onNavigate }: { to: string; label: string; onNavigate?: () => void }) {
  const { pathname } = useLocation()
  const active = isActive(pathname, to)

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`relative py-2 text-[0.93rem] transition-colors duration-200 ${
        active ? 'text-forest-900' : 'text-ink-soft hover:text-forest-800'
      }`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold-600 transition-transform duration-300 ${
          active ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </NavLink>
  )
}

export function SiteHeader() {
  const scrolled = useScrolled(16)
  const drawerRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const { t } = useLanguage()

  /**
   * The drawer stores *which route it was opened on*, so closing it is derived
   * rather than stored — navigating away (including via the back button)
   * closes it automatically, with no effect to keep in sync.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null)
  const drawerOpen = openedOn === pathname

  const openDrawer = () => setOpenedOn(pathname)
  const closeDrawer = () => setOpenedOn(null)

  useFocusTrap(drawerOpen, drawerRef)

  useEffect(() => {
    if (!drawerOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--radius-sm)] focus:bg-forest-800 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-cream-50"
      >
        {t('a11y.skipToMain')}
      </a>

      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled
            ? 'border-cream-300 bg-cream-50/92 backdrop-blur-md supports-[backdrop-filter]:bg-cream-50/80 shadow-xs'
            : 'border-transparent bg-cream-100'
        }`}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-4">
          <BrandLockup hideTextOnMobile />

          <nav aria-label={t('a11y.primaryNav')} className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {headerNav.map((item) => (
                <li key={item.to}>
                  <NavRow to={item.to} label={navLabel(item.to, t)} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <LanguageToggle />

            <Link
              to="/search"
              aria-label={t('a11y.search')}
              className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-ink-soft transition-colors hover:bg-cream-200 hover:text-forest-800"
            >
              <Icon name="search" size={19} />
            </Link>

            <Link
              to="/contact"
              className="hidden min-h-10 items-center rounded-[var(--radius-sm)] bg-forest-800 px-4 text-sm font-medium text-cream-50 transition-colors hover:bg-forest-700 xl:inline-flex"
            >
              {t('nav.contact')}
            </Link>

            <button
              type="button"
              onClick={() => openDrawer()}
              aria-label={t('a11y.openMenu')}
              aria-expanded={drawerOpen}
              className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-ink-soft transition-colors hover:bg-cream-200 hover:text-forest-800 lg:hidden"
            >
              <Icon name="menu" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-[55] lg:hidden">
          <button
            type="button"
            aria-label={t('a11y.closeMenu')}
            onClick={() => closeDrawer()}
            className="absolute inset-0 bg-forest-950/45 backdrop-blur-[2px]"
          />

          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('a11y.drawer')}
            className="absolute inset-y-0 right-0 flex w-[min(21rem,88vw)] flex-col bg-cream-50 shadow-xl"
            style={{ animation: 'drawer-in 0.28s var(--ease-calm) both' }}
          >
            <div className="flex items-center justify-between border-b border-cream-300 px-5 py-4">
              <BrandLockup size="sm" markSize={42} />
              <button
                type="button"
                onClick={() => closeDrawer()}
                aria-label={t('a11y.closeMenu')}
                className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-ink-soft transition-colors hover:bg-cream-200"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <nav aria-label={t('a11y.drawerNav')} className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1">
                {primaryNav.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => closeDrawer()}
                      className={({ isActive: active }) =>
                        `flex min-h-12 items-center justify-between rounded-[var(--radius-sm)] px-3 text-[1.02rem] transition-colors ${
                          active
                            ? 'bg-forest-100 font-medium text-forest-900'
                            : 'text-ink-soft hover:bg-cream-200'
                        }`
                      }
                    >
                      {navLabel(item.to, t)}
                      <Icon name="chevron-right" size={16} className="text-cream-400" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-4 border-t border-cream-300 px-5 py-5">
              <LanguageToggle />

              <a
                href={site.youtube.channelUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2.5 text-sm text-ink-soft transition-colors hover:text-forest-800"
              >
                <Icon name="youtube" size={18} className="text-forest-700" />
                {t('footer.youtubeChannel')}
                <Icon name="external" size={14} className="text-ink-muted" />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
