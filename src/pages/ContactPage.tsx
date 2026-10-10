import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/Layout'
import { Reveal } from '../components/ui/Section'
import { useSeo } from '../hooks/useSeo'

/**
 * Contact Page.
 *
 * Official support email: bible@support.satyasakshi.in.
 * When visitors fill out the form or click email links, it redirects
 * them to bible@support.satyasakshi.in with their name, email, and message.
 */
export function ContactPage() {
  useSeo({
    title: 'సంప్రదించండి',
    description:
      'సత్యసాక్షితో సంప్రదించండి. మీ ప్రశ్నలు, ప్రార్థన అవసరాలు, సూచనల కోసం bible@support.satyasakshi.in లేదా మా YouTube చానెల్ ద్వారా సంప్రదించండి.',
    path: '/contact',
  })

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!site.contact.email) return

    const subject = encodeURIComponent(
      form.name
        ? `[సత్య సాక్షి సంప్రదింపు] ${form.name} గారి నుండి సందేశం`
        : `[సత్య సాక్షి సంప్రదింపు] సందేశం`
    )
    const bodyLines = [
      `పేరు (Name): ${form.name || 'పేర్కొనలేదు'}`,
      `ఇమెయిల్ (Email): ${form.email || 'పేర్కొనలేదు'}`,
      '',
      '--- సందేశం (Message) ---',
      form.message,
    ].join('\n')

    const mailtoUrl = `mailto:${site.contact.email}?subject=${subject}&body=${encodeURIComponent(
      bodyLines
    )}`

    setSubmitted(true)
    window.location.href = mailtoUrl
  }

  const mailtoFallback = site.contact.email
    ? `mailto:${site.contact.email}?subject=${encodeURIComponent(
        form.name
          ? `[సత్య సాక్షి సంప్రదింపు] ${form.name} గారి నుండి సందేశం`
          : '[సత్య సాక్షి సంప్రదింపు] సందేశం'
      )}&body=${encodeURIComponent(
        `పేరు: ${form.name}\nఇమెయిల్: ${form.email}\n\nసందేశం:\n${form.message}`
      )}`
    : '#'

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
              {/* Official email */}
              <li className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-forest-300 bg-forest-50/70 p-5 shadow-xs">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-forest-900 text-cream-100">
                  <Icon name="mail" size={19} />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-medium text-forest-950">అధికారిక ఇమెయిల్</h3>
                    <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-medium text-forest-800">
                      సహాయం & సంప్రదింపు
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    సందేహాలు, ప్రార్థనా అవసరాలు, సందేశాల గురించి మాకు నేరుగా ఇమెయిల్ ద్వారా
                    సంప్రదించవచ్చు.
                  </p>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="link-underline mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:text-forest-950"
                  >
                    {site.contact.email}
                    <Icon name="external" size={14} />
                  </a>
                </div>
              </li>

              {/* YouTube channel */}
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

              {/* Bible questions */}
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

            {/* Address & directions notice */}
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

          {/* Form */}
          <div>
            <h2 className="text-xl text-forest-950">మీ సందేశం</h2>

            <form
              className="mt-6 space-y-5"
              onSubmit={handleSubmit}
              aria-describedby="form-notice"
            >
              <div
                id="form-notice"
                role="status"
                className="flex items-start gap-3 rounded-[var(--radius-md)] border border-forest-200 bg-forest-50/70 p-4 text-sm text-forest-900"
              >
                <Icon name="mail" size={18} className="mt-0.5 shrink-0 text-forest-700" />
                <p>
                  క్రింద మీ వివరాలు మరియు సందేశాన్ని వ్రాయండి. 'సందేశం పంపండి' బటన్ నొక్కగానే
                  మీ సందేశం నేరుగా{' '}
                  <strong className="font-semibold text-forest-950">{site.contact.email}</strong> కు
                  మీ ఇమెయిల్ యాప్ ద్వారా రీడైరెక్ట్ చేయబడుతుంది.
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
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  required
                  placeholder="మీ పేరు రాయండి"
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="min-h-12 w-full rounded-[var(--radius-md)] border border-cream-400 bg-white px-4 text-ink placeholder:text-ink-muted/60 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-200"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-medium text-forest-900"
                >
                  మీ ఇమెయిల్
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  required
                  placeholder="name@example.com"
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="min-h-12 w-full rounded-[var(--radius-md)] border border-cream-400 bg-white px-4 text-ink placeholder:text-ink-muted/60 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-200"
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
                  required
                  placeholder="మీ ప్రశ్న, ప్రార్థనా అవసరం లేదా సూచనను ఇక్కడ వ్రాయండి..."
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  className="w-full rounded-[var(--radius-md)] border border-cream-400 bg-white px-4 py-3 text-ink placeholder:text-ink-muted/60 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-200"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-forest-900 px-6 font-medium text-cream-50 shadow-xs transition-colors hover:bg-forest-800 active:bg-forest-950 sm:w-auto"
                >
                  <Icon name="mail" size={18} />
                  సందేశం పంపండి
                </button>

                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-forest-300 bg-forest-50/50 px-5 text-sm font-medium text-forest-800 transition-colors hover:bg-forest-100 sm:w-auto"
                >
                  <Icon name="external" size={16} />
                  నేరుగా ఇమెయిల్ ఓపెన్ చేయండి
                </a>
              </div>

              {submitted && (
                <div
                  role="status"
                  className="rounded-[var(--radius-md)] border border-forest-300 bg-forest-50 p-4 text-sm text-forest-900"
                >
                  <div className="flex items-center gap-2 font-medium text-forest-950">
                    <Icon name="check" size={18} className="text-forest-700" />
                    మీ ఇమెయిల్ అప్లికేషన్‌కు మళ్ళిస్తున్నాము (Redirecting to Email)...
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                    ఒకవేళ మీ పరికరంలో ఇమెయిల్ యాప్ తెరవబడకపోతే,{' '}
                    <a
                      href={mailtoFallback}
                      className="font-semibold text-forest-800 underline hover:text-forest-950"
                    >
                      ఇక్కడ క్లిక్ చేసి నేరుగా పంపండి
                    </a>
                    .
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
