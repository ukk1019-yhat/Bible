import { useLocation } from 'react-router-dom'
import { site } from '../../config/site'
import { Icon } from './Icon'

/**
 * Floating WhatsApp contact button.
 *
 * Provides a direct, 1-click WhatsApp conversation starter with Satya Sakshi
 * (+91 98499 44954) accessible from every page across the website.
 */
export function FloatingWhatsApp() {
  const { pathname } = useLocation()

  // Hide on admin portal to prevent covering admin controls
  if (pathname.startsWith('/admin') || !site.contact.phone) {
    return null
  }

  return (
    <aside
      aria-label="WhatsApp సంప్రదింపు"
      className="fixed bottom-5 right-5 z-40 print:hidden"
    >
      <a
        href={site.contact.whatsappUrl}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`WhatsApp సంప్రదింపు: ${site.contact.phoneFormatted}`}
        className="group relative flex items-center gap-2.5 rounded-full border border-emerald-400/40 bg-emerald-600 pl-3.5 pr-4 py-2.5 text-white shadow-lg shadow-emerald-900/25 transition-all duration-300 hover:scale-105 hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-900/35 focus:outline-none focus:ring-3 focus:ring-emerald-400 focus:ring-offset-2"
      >
        <span className="relative flex size-6 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/40 opacity-75" />
          <Icon name="whatsapp" size={22} className="relative text-white" />
        </span>

        <span className="flex flex-col text-left leading-tight">
          <span className="text-[0.68rem] font-medium tracking-wide text-emerald-100 uppercase">
            WhatsApp
          </span>
          <span className="text-xs font-semibold text-white tracking-wide">
            {site.contact.phoneFormatted}
          </span>
        </span>
      </a>
    </aside>
  )
}
