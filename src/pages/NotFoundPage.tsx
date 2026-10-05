import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../components/ui/Icon'
import { useSeo } from '../hooks/useSeo'

const DESTINATIONS: { to: string; label: string; description: string; icon: IconName }[] = [
  { to: '/bible', label: 'బైబిల్', description: '66 పుస్తకాలు, 1,189 అధ్యాయాలు', icon: 'book-open' },
  { to: '/questions', label: 'ప్రశ్నలు & సమాధానాలు', description: 'బైబిల్ ఆధారంగా', icon: 'question' },
  { to: '/messages', label: 'సందేశాలు', description: 'బ్రో. సునిల్‌కుమార్ గారి బోధనలు', icon: 'play' },
  { to: '/books', label: 'పుస్తకాలు', description: 'తెలుగు క్రైస్తవ పుస్తకాలు', icon: 'stack' },
  { to: '/articles', label: 'వ్యాసాలు', description: 'ఆలోచనలకు ఆహారం', icon: 'book' },
]

export default function NotFoundPage() {
  useSeo({
    title: 'పేజీ దొరకలేదు',
    description: 'మీరు వెతుకుతున్న పేజీ ఈ వేదికలో లేదు.',
    path: '/404',
    noIndex: true,
  })

  return (
    <div className="shell py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-4">404</p>

        <h1 className="text-3xl text-forest-950 sm:text-4xl">
          ఈ పేజీ దొరకలేదు
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-[1.02rem] leading-relaxed text-ink-soft">
          మీరు వెతుకుతున్న పేజీ ఇక్కడ లేదు — లేదా అది తరలేశారు. కింది వాటిలో నుండి
          మీకు కావాల్సినది చూడండి.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] bg-forest-800 px-6 font-medium text-cream-50 transition-colors hover:bg-forest-700"
          >
            <Icon name="home" size={18} />
            హోమ్ పేజీకి
          </Link>

          <Link
            to="/search"
            className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-md)] border border-forest-800/25 px-6 font-medium text-forest-800 transition-colors hover:bg-forest-100/60"
          >
            <Icon name="search" size={18} />
            వెతకండి
          </Link>
        </div>
      </div>

      <ul className="mx-auto mt-16 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATIONS.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="group flex items-center gap-3.5 rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 p-4 transition-colors hover:border-forest-300 hover:bg-forest-100/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-forest-100 text-forest-700">
                <Icon name={item.icon} size={18} />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-forest-900">{item.label}</span>
                <span className="block truncate text-xs text-ink-muted">
                  {item.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
