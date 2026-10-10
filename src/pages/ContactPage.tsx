import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/Layout'
import { Reveal } from '../components/ui/Section'
import { useSeo } from '../hooks/useSeo'

/**
 * Contact.
 *
 * Satya Sakshi has never published an email address, phone number or postal
 * address, and a form that quietly discards a reader's message is worse than
 * no form. So the page is explicit: it names what is missing, shows the one
 * channel that genuinely works today, and offers a form that is visibly
 * disabled rather than pretending to send.
 */
export function ContactPage() {
  useSeo({
    title: 'సంప్రదించండి',
    description:
      'సత్యసాక్షితో సంప్రదించండి. బైబిల్ ప్రశ్నలు, సందేశాల గురించి అడుగుతున్నారా? మా YouTube చానెల్ ద్వారా సంప్రదించండి.',
    path: '/contact',
  })

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const notConnected = site.contact.email === null

  return (
    <>
      <PageHeader
        eyebrow="సంప్రదింపు"
        title="మేము ఎలా చేరుకోవాలి"
        icon="mail"
        lede="మీ ప్రశ్న, మీ సూచన — మేము వినండి."
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'సంప్రదించండి' }]}
      />

      <div className="shell py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* What actually works today */}
          <div>
            <h2 className="text-xl text-forest-950">ఈ రోజు మనకు అందుబాటులో ఉన్నది</h2>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-forest-100 text-forest-700">
                  <Icon name="youtube" size={19} />
                </span>
                <div>
                  <h3 className="font-medium text-forest-900">YouTube చానెల్</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    Church of The Living God — కాకినాడ. సందేశాలను చూడండి, కమెంట్‌లో మీ
                    ప్రశ్నలు పెట్టండి.
                  </p>
                  <a
                    href={site.youtube.channelUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700"
                  >
                    {site.youtube.channelHandle}
                    <Icon name="external" size={14} />
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-forest-100 text-forest-700">
                  <Icon name="book-open" size={19} />
                </span>
                <div>
                  <h3 className="font-medium text-forest-900">బైబిల్ ప్రశ్నలు</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    బైబిల్ గురించి మీకు సమాధానం కావాలంటే — వాక్యంలోనే సమాధానం ఉంది.
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-3 text-sm">
                    <Link to="/questions" className="link-underline font-medium text-forest-700">
                      ప్రశ్నలు & సమాధానాలు
                    </Link>
                    <Link
                      to="/bible/search"
                      className="link-underline font-medium text-forest-700"
                    >
                      వాక్యంలో వెతకండి
                    </Link>
                  </div>
                </div>
              </li>
            </ul>

            {/* Honest notice about what has not been published. */}
            <Reveal className="mt-6">
              <div className="rounded-[var(--radius-lg)] border border-gold-200 bg-gold-100/60 p-5">
                <h3 className="flex items-center gap-2 font-medium text-forest-900">
                  <Icon name="map-pin" size={18} className="text-gold-700" />
                  కేంద్రాల చిరునామాలు అందుబాటులో ఉన్నాయి
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  సత్యసాక్షి బైబిల్ స్టడీ సెంటర్ — కాకినాడ మరియు చర్చ్ ఆఫ్ ది లివింగ్ గాడ్ — జి. కొత్తపల్లి (శంఖవరం మండలం) చిరునామాలు, గూగుల్ మ్యాప్స్ నావిగేషన్ మార్గాలు మరియు QR కోడ్స్ క్రింద ఫుటర్‌లో వివరంగా అందుబాటులో ఉన్నాయి.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Form — visible, but honestly disabled. */}
          <div>
            <h2 className="text-xl text-forest-950">మీ సందేశం</h2>

            <form
              className="mt-6 space-y-5"
              onSubmit={(event) => event.preventDefault()}
              aria-describedby="form-notice"
            >
              <div
                id="form-notice"
                role="status"
                className="flex items-start gap-3 rounded-[var(--radius-md)] border border-cream-400 bg-cream-200/70 p-4 text-sm text-ink-soft"
              >
                <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-gold-700" />
                <p>
                  ఈ ఫారం ఇంకా అనుసంధానం చేయలేదు — మీ సందేశం ఎక్కడికీ పంపబడదు. దయచేసి
                  పైన ఉన్న YouTube చానెల్ ద్వారా సంప్రదించండి. ఈ ఫారం
                  ప్రారంభించిన వెంటనే మీరు ఇక్కడ మీ సందేశం రాయగలరు.
                </p>
              </div>

              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-medium text-forest-900"
                >
                  మీ పేరు
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  disabled
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="min-h-12 w-full rounded-[var(--radius-md)] border border-cream-400 bg-cream-200/50 px-4 text-ink disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-medium text-forest-900"
                >
                  ఇమెయిల్
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  disabled
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="min-h-12 w-full rounded-[var(--radius-md)] border border-cream-400 bg-cream-200/50 px-4 text-ink disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-medium text-forest-900"
                >
                  మీ సందేశం
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  disabled
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  className="w-full rounded-[var(--radius-md)] border border-cream-400 bg-cream-200/50 px-4 py-3 text-ink disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled
                className="min-h-12 w-full cursor-not-allowed rounded-[var(--radius-md)] bg-cream-300 px-6 font-medium text-ink-muted sm:w-auto"
              >
                పంపండి — ఇంకా అందుబాటులో లేదు
              </button>
            </form>

            {notConnected ? (
              <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                ఈ సందేశాన్ని సేకరించే విధానం సిద్ధం కాకపోవడంతో, ఫారం ప్రారంభించిన వరకు
                మీ సమాధానం కనిపించదు. మీ ప్రశ్నను మేము ఇంకా చూడలేదు — దయచేసి అన్య మార్గం
                ఉపయోగించండి.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
