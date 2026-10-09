import { Link } from 'react-router-dom'
import { BIBLE_BOOKS } from '../data/bible/books.generated'
import { site } from '../config/site'
import { FullBrandLogo } from '../components/brand/Logo'
import { ScriptureBlock } from '../components/bible/ScriptureBlock'
import { Icon, type IconName } from '../components/ui/Icon'
import { PageHeader, Prose } from '../components/ui/Layout'
import { Reveal, SectionHeading } from '../components/ui/Section'
import { graph, useSeo } from '../hooks/useSeo'

const PILLARS: { icon: IconName; title: string; body: string; to: string }[] = [
  {
    icon: 'book-open',
    title: 'బైబిల్ మొదట',
    body: 'మా వేదికలో ప్రతి సమాధానం, ప్రతి వ్యాసం బైబిల్ వాక్యంతో ముందుచేయబడినది. మనసుకు సరిపోయే వాటితో మేము ముందుగా వెళ్తున్నాం.',
    to: '/bible',
  },
  {
    icon: 'play',
    title: 'సందేశాలు',
    body: 'బైబిల్ సందేశాలు, బైబిల్ అధ్యయనం — బ్రో. పి. సునిల్‌కుమార్ గారి బోధనలు మీరు ఎప్పుడైనా చూడగలరు.',
    to: '/messages',
  },
  {
    icon: 'question',
    title: 'ప్రశ్నలకు సమాధానాలు',
    body: 'తెలుగులో ప్రశ్న పెట్టేవారికి స్పష్టమైన, బైబిల్ ఆధారిత సమాధానాలు — కఠినమైన ప్రశ్నలకూ.',
    to: '/questions',
  },
  {
    icon: 'stack',
    title: 'పుస్తకాలు',
    body: 'ఉచిత తెలుగు క్రైస్తవ పుస్తకాల గ్రంథాలయం. పుస్తకాలు తయారవుతున్నాయి — వచ్చిన వెంటనే ఇక్కడే అందుబాటులో ఉంటాయి.',
    to: '/books',
  },
]

export function AboutPage() {
  useSeo({
    title: 'మా గురించి — సత్య సాక్షి',
    description:
      'సత్య సాక్షి గురించి: తెలుగు క్రైస్తవుల కోసం బైబిల్, సందేశాలు, ప్రశ్నలు & సమాధానాలు అందించే క్రైస్తవ విజ్ఞాన వేధిక. మా లక్ష్యం, మా వనరులు.',
    path: '/about',
    jsonLd: graph({
      '@type': 'AboutPage',
      name: 'మా గురించి',
      inLanguage: 'te-IN',
      url: 'https://satyasakshi.in/about',
    }),
  })

  return (
    <>
      <PageHeader
        eyebrow="మా గురించి"
        title={site.brand.telugu}
        icon="sparkle"
        lede={`${site.brand.mission}. ${site.brand.promise}`}
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'మా గురించి' }]}
      />

      <div className="shell py-14 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,40rem)_1fr] lg:gap-20">
          <div>
            <div className="mb-10 flex flex-col items-center gap-6 rounded-[var(--radius-xl)] border border-cream-300 bg-cream-50 p-6 shadow-sm sm:flex-row sm:items-center">
              <FullBrandLogo width={220} className="shrink-0" />
              <div className="flex-1 text-center sm:text-left">
                <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-gold-700">
                  అధికారిక చిహ్నం &amp; నినాదం
                </span>
                <h2 className="mt-1 font-logo text-2xl font-extrabold text-forest-950 sm:text-3xl">
                  {site.brand.telugu}
                </h2>
                <p className="mt-1 font-sans text-sm font-semibold text-gold-800">
                  {site.brand.positioning}
                </p>
                <p className="mt-0.5 font-serif italic text-xs text-ink-muted">
                  &ldquo;{site.brand.tagline}&rdquo;
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  సంప్రదాయ ఆలోచనా ధోరణులను దేవుని వాక్య వెలుగులో సవాలు చేస్తూ, పరిశుద్ధ సత్యాన్ని తెలుగు ప్రజల హృదయాల్లో నాటడమే మా దర్శనం.
                </p>
              </div>
            </div>

            <Prose>
              <p className="text-[1.1rem] text-ink">
                <strong className="font-semibold text-forest-900">{site.brand.telugu}</strong>{' '}
                అంటే “సత్యం చూసేవాడు” అనే అర్థం. ఈ పేరు పెట్టడానికి కారణం — దేవుని
                సత్యం యొక్క మాట, మేము మన వాక్యం ద్వారా మాత్రమే ముందుగా వెళ్తున్నాం.
              </p>

              <p>
                తెలుగు మాట్లాడే క్రైస్తవులకు, దేవుని వాక్యాన్ని ఇంటికి తీసుకెళ్లే వేదిక
                కావాలనే ఆశతో ఈ వేదికను నిర్మించాము. బైబిల్ ఒక్కటే మా ముఖ్య వనరు; దాని
                పక్కన సందేశాలు, వ్యాసాలు, ప్రశ్నలకు సమాధానాలు — అవన్నీ దానికి సేవ చేస్తాయి.
              </p>

              <p>
                ఈ వేదికలోని వాక్యం తెలుగు బైబిల్ (BSI) అనే పాఠ్యం నుండి తీసుకోబడింది. ఆ పాఠ్యాన్ని{' '}
                <a
                  href="https://github.com/sajeevavahini/bibles"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline text-forest-700"
                >
                  Sajeeva Vahini
                </a>{' '}
                సంస్థ సమకూలంగా అందుబాటులో ఉంచింది; మేము దానికి కృతజ్ఞతలు తెలిపే దృష్టితో
                ఉపయోగిస్తున్నాం.
              </p>
            </Prose>

            <Reveal className="mt-10">
              <ScriptureBlock
                reference={{ bookSlug: 'matthew', chapter: 6, verseStart: 33, verseEnd: 33 }}
              />
            </Reveal>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-xl text-forest-950">ఈ వేదికలో ఏమి ఉంది</h2>
              <ul className="mt-5 space-y-4">
                {PILLARS.map((pillar) => (
                  <li key={pillar.title}>
                    <Link
                      to={pillar.to}
                      className="group flex items-start gap-4 rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 p-5 transition-colors hover:border-forest-300 hover:bg-forest-100/40"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-forest-100 text-forest-700">
                        <Icon name={pillar.icon} size={18} />
                      </span>
                      <span>
                        <span className="flex items-center gap-1.5 font-serif text-[1.05rem] font-semibold text-forest-900">
                          {pillar.title}
                          <Icon
                            name="arrow-right"
                            size={15}
                            className="text-gold-600 transition-transform group-hover:translate-x-0.5"
                          />
                        </span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                          {pillar.body}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl text-forest-950">బైబిల్ గురించి సంఖ్యల్లో</h2>
              <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  {
                    value: BIBLE_BOOKS.length.toLocaleString('te-IN'),
                    label: 'పుస్తకాలు',
                    to: '/bible',
                  },
                  {
                    value: BIBLE_BOOKS.reduce((s, b) => s + b.chapters, 0).toLocaleString('te-IN'),
                    label: 'అధ్యాయాలు',
                    to: '/bible',
                  },
                  {
                    value: BIBLE_BOOKS.reduce((s, b) => s + b.verses, 0).toLocaleString('te-IN'),
                    label: 'వాక్యాలు',
                    to: '/bible',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 px-4 py-5"
                  >
                    <dd className="font-serif text-2xl text-forest-900">{item.value}</dd>
                    <dt className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-muted">
                      {item.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-6">
              <h2 className="text-lg text-forest-900">మా సందేశాలు</h2>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                సత్యసాక్షి సందేశాలు “Church of The Living God — కాకినాడ” అనే YouTube
                చానెల్‌లో ప్రచురిస్తారు.
              </p>
              <a
                href={site.youtube.channelUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-forest-800/25 px-5 text-[0.95rem] font-medium text-forest-800 transition-colors hover:bg-forest-100/60"
              >
                <Icon name="youtube" size={18} />
                {site.youtube.channelHandle}
                <Icon name="external" size={14} />
              </a>
            </div>
          </div>
        </div>

        <Reveal className="mt-20">
          <section aria-labelledby="why-honest">
            <SectionHeading
              as="h2"
              id="why-honest"
              title="మేము ఏమి చేయం"
              lede="ఈ వేదిక నిజాయితీతో నిర్మించబడింది — ఇదే మా విధానం."
            />

            <ul className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'బైబిల్ మాట మాత్రమే',
                  body: 'ప్రతి సమాధానం వాక్యంతో ముందుచేయబడినది. మన సిద్ధాంతం బైబిల్‌కు అనుగుణంగా ఉండాలి.',
                },
                {
                  title: 'అసత్యాలు లేవు',
                  body: 'ప్రచురించబడని వ్యాసం, పుస్తకం, సంప్రదింపు వివరాలు లేవు అనేది స్పష్టంగా చెబుతున్నాం. ఖాళీగా ఉండటం అప్పు కాదు, నిజాయితీ.',
                },
                {
                  title: 'మీ గోప్యత మా బాధ్యత',
                  body: 'మీరు భద్రపరచిన అధ్యాయాలు మీ బ్రౌజర్‌లోనే ఉంటాయి. మేము వాటిని సేకరించం.',
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-6"
                >
                  <h3 className="flex items-start gap-2 font-serif text-[1.05rem] font-semibold text-forest-900">
                    <Icon name="check" size={18} className="mt-1 shrink-0 text-forest-600" />
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>
    </>
  )
}
