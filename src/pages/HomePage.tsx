import { Link } from 'react-router-dom'
import { BIBLE_BOOKS } from '../data/bible/books.generated'
import { articles } from '../data/content/articles'
import { questions } from '../data/content/questions'
import { featuredVideo } from '../data/content/videos'
import { quickResources } from '../data/navigation'
import { site } from '../config/site'
import { ScriptureBlock } from '../components/bible/ScriptureBlock'
import { ArticleCard, QuestionCard } from '../components/content/Cards'
import { VideoCard } from '../components/content/VideoCard'
import { Icon, type IconName } from '../components/ui/Icon'
import { Button } from '../components/ui/Button'
import { Reveal, SectionHeading } from '../components/ui/Section'
import { graph, useSeo } from '../hooks/useSeo'

const totals = {
  chapters: BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0),
  verses: BIBLE_BOOKS.reduce((sum, b) => sum + b.verses, 0),
}

const RESOURCE_ICONS: Record<string, IconName> = {
  book: 'book',
  play: 'play',
  stack: 'stack',
  question: 'question',
}

export function HomePage() {
  useSeo({
    title: `${site.brand.telugu} | ${site.brand.positioning}`,
    description:
      'దేవుని వాక్యము ప్రతి ఇంటికి. పరిశుద్ధ తెలుగు బైబిల్, బైబిల్ సందేశాలు, ప్రశ్నలు & సమాధానాలు, వ్యాసాలు — ఒకే వేదికలో, ఉచితంగా.',
    path: '/',
    jsonLd: graph(
      {
        '@type': 'WebPage',
        name: `${site.brand.telugu} — ${site.brand.positioning}`,
        inLanguage: 'te-IN',
        url: 'https://satyasakshi.in/',
        description: site.brand.promise,
      },
      {
        '@type': 'FAQPage',
        mainEntity: questions.slice(0, 5).map((question) => ({
          '@type': 'Question',
          name: question.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: question.summary,
          },
        })),
      },
    ),
  })

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-cream-300">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_15%_0%,var(--color-forest-100)_0%,transparent_60%),radial-gradient(50%_50%_at_90%_10%,var(--color-gold-100)_0%,transparent_65%)]"
        />

        <div className="shell relative py-16 sm:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow mb-5">{site.brand.positioning}</p>

              <h1 className="text-[2.15rem] leading-[1.22] text-forest-950 sm:text-5xl lg:text-[3.4rem]">
                దేవుని వాక్యము
                <br />
                ప్రతి ఇంటికి
              </h1>

              <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft sm:text-lg">
                పరిశుద్ధ తెలుగు బైబిల్, బైబిల్ సందేశాలు, ప్రశ్నలు & సమాధానాలు, వ్యాసాలు
                — అన్నీ ఒకే వేదికలో, ఉచితంగా. చదవండి, వెతకండి, మీ హృదయానికి సమీపించండి.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button to="/bible" size="lg" icon="book-open">
                  బైబిల్ చదవండి
                </Button>
                <Button to="/messages" size="lg" variant="secondary" icon="play" iconPosition="start">
                  సందేశాలు చూడండి
                </Button>
              </div>

              <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-cream-300 pt-7">
                {[
                  { value: BIBLE_BOOKS.length.toLocaleString('te-IN'), label: 'పుస్తకాలు' },
                  { value: totals.chapters.toLocaleString('te-IN'), label: 'అధ్యాయాలు' },
                  { value: totals.verses.toLocaleString('te-IN'), label: 'వాక్యాలు' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-serif text-2xl text-forest-900">{stat.value}</dd>
                    <dt className="mt-0.5 text-xs uppercase tracking-[0.14em] text-ink-muted">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* A real verse from the reader, not a stock illustration. */}
            <Reveal delay={120}>
              <div className="rounded-[var(--radius-xl)] border border-cream-300 bg-cream-50 p-6 shadow-lg sm:p-8">
                <Icon name="quote" size={28} className="text-gold-500" />
                {/* ScriptureBlock renders the reference itself, so it is not repeated here. */}
                <ScriptureBlock
                  reference={{ bookSlug: 'john', chapter: 3, verseStart: 16, verseEnd: 16 }}
                  showLink={false}
                />

                <div className="mt-7 border-t border-cream-300 pt-6">
                  <p className="text-[0.95rem] leading-relaxed text-ink-soft">
                    ఈ వేదికలో మీరు చదివే ప్రతి వాక్యం, ప్రతి సమాధానం — అన్నీ
                    బైబిల్ నుండే. దేవుడే మాట.
                  </p>
                  <Link
                    to="/bible/search?q=%E0%B0%AF%D0%BE%E0%B0%B9%D0%BE%E0%B0%BE%E0%B0%A8"
                    className="link-underline mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700"
                  >
                    బైబిల్‌లో వెతకండి
                    <Icon name="arrow-right" size={15} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Quick resources */}
      <section className="shell py-16 sm:py-20" aria-labelledby="quick-resources">
        <h2 id="quick-resources" className="sr-only">
          ముఖ్య వనరులు
        </h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickResources.map((resource, index) => (
            <li key={resource.key}>
              <Link
                to={resource.to}
                data-reveal=""
                style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
                className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-cream-300 bg-cream-50 p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-forest-300 hover:shadow-lg"
              >
                <span className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-forest-100 text-forest-700 transition-colors group-hover:bg-forest-800 group-hover:text-cream-50">
                  <Icon name={RESOURCE_ICONS[resource.icon] ?? 'book'} size={21} />
                </span>

                <h3 className="mt-4 font-serif text-[1.1rem] font-semibold text-forest-900 transition-colors group-hover:text-forest-700">
                  {resource.title}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {resource.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700">
                  చదవండి
                  <Icon
                    name="arrow-right"
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------ Featured message */}
      <section className="border-y border-cream-300 bg-cream-50 py-16 sm:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="బైబిల్ సందేశం"
              title="ఈ సప్తాహాంలో మొదలుపెట్టండి"
              lede="బ్రో. పి. సునిల్‌కుమార్ గారి బైబిల్ సందేశాలు — మీరు ఎప్పుడైనా చూడగలరు."
              action={{ label: 'అన్ని సందేశాలు', to: '/messages' }}
            />
          </Reveal>

          <div className="mt-9">
            <VideoCard video={featuredVideo} featured />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Bible strip */}
      <section className="shell py-16 sm:py-20" aria-labelledby="bible-invite">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow mb-3">పరిశుద్ధ బైబిల్</p>
              <h2
                id="bible-invite"
                className="text-2xl text-forest-950 sm:text-3xl lg:text-[2.1rem]"
              >
                మీ భాషలోనే, అధ్యాయం వారీగా
              </h2>
              <p className="mt-4 max-w-lg text-[1.02rem] leading-relaxed text-ink-soft">
                మీరు తెరిచిన అధ్యాయం మాత్రమే లోడ్ అవుతుంది — అందుకే చదవడం వేగంగా, డేటా
                వ్యర్థం లేకుండా. అక్షర పరిమాణాన్ని మార్చవచ్చు, వాక్యాన్ని భద్రపరచవచ్చు, భాగం
                చేయవచ్చు.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button to="/bible" icon="arrow-right">
                  బైబిల్ తెరవండి
                </Button>
                <Button to="/bible/search" variant="secondary" icon="search" iconPosition="start">
                  వాక్యంలో వెతకండి
                </Button>
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { title: 'మొదటి అధ్యాయం', body: 'ఆదికాండము 1 — సృష్టి ఆరంభం.', to: '/bible/genesis/1' },
                { title: 'యేసు గురించి', body: 'యోహాను 1 — మొదటి అధ్యాయం.', to: '/bible/john/1' },
                { title: 'కీర్తనలు', body: 'కీర్తనలు 23 — దేవుడు నా పర్యవేక్షకుడు.', to: '/bible/psalms/23' },
                { title: 'ప్రార్థన', body: 'మత్తయి 6 — మీరు ఎలా ప్రార్థించాలి.', to: '/bible/matthew/6' },
              ].map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.to}
                    className="group flex h-full flex-col rounded-[var(--radius-md)] border border-cream-300 bg-cream-50 p-5 transition-colors hover:border-forest-300 hover:bg-forest-100/40"
                  >
                    <span className="font-serif text-[1rem] font-semibold text-forest-900">
                      {item.title}
                    </span>
                    <span className="mt-1.5 text-sm text-ink-muted">{item.body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------- Questions */}
      <section className="border-y border-cream-300 bg-cream-50 py-16 sm:py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="ప్రశ్నలు & సమాధానాలు"
              title="బైబిల్ ఆధారంగా"
              lede="మీ ప్రశ్నకు సమాధానం బైబిల్‌లో ఉంది. ఇక్కడ అదే వాక్యాలతో వివరణ ఇస్తున్నాం."
              action={{ label: 'అన్ని ప్రశ్నలు', to: '/questions' }}
            />
          </Reveal>

          <ul className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {questions.slice(0, 3).map((question, index) => (
              <li key={question.slug}>
                <QuestionCard question={question} delay={index * 70} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------------- Articles */}
      <section className="shell py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="వ్యాసాలు"
            title="ఆలోచనలకు ఆహారం"
            lede="విశ్వాసం, ప్రార్థన, ఆత్మీయ జీవితం గురించి సంక్షిప్త వ్యాసాలు."
            action={{ label: 'అన్ని వ్యాసాలు', to: '/articles' }}
          />
        </Reveal>

        <ul className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <li key={article.slug}>
              <ArticleCard article={article} delay={index * 70} />
            </li>
          ))}
        </ul>
      </section>

      {/* --------------------------------------------------- YouTube invitation */}
      <section className="shell pb-20 sm:pb-24">
        <Reveal>
          <div className="overflow-hidden rounded-[var(--radius-xl)] bg-forest-950 text-cream-100">
            <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <Icon name="youtube" size={30} className="text-gold-400" />
                <h2 className="mt-5 text-2xl text-cream-50 sm:text-3xl">
                  Church of The Living God — కాకినాడ
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-cream-300/85">
                  సత్యసాక్షి సందేశాలు YouTube చానెల్‌లో అందుబాటులో ఉన్నాయి. మీరు ఎప్పుడైనా,
                  ఎక్కడైనా చూడండి.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <Button
                  href={site.youtube.channelUrl}
                  size="lg"
                  variant="onDark"
                  icon="external"
                >
                  చానెల్ చూడండి
                </Button>
                <span className="text-xs text-cream-300/60">{site.youtube.channelHandle}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
