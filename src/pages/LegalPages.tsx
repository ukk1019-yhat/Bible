import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { PageHeader, Prose } from '../components/ui/Layout'
import { useSeo } from '../hooks/useSeo'

const UPDATED = '2026'

/**
 * Privacy.
 *
 * Written to describe what this application actually does: there is no
 * analytics, no advertising and no server. The only stored data is the reader's
 * own bookmarks and font-size preference, in their own browser.
 */
export function PrivacyPage() {
  useSeo({
    title: 'గోప్యతా విధానం',
    description:
      'సత్యసాక్షి గోప్యతా విధానం — మేము సేకరించే సమాచారం ఏమిటో, మీ బ్రౌజర్‌లో ఏమి భద్రపరచబడుతుందో, మీ హక్కులు ఏమిటో స్పష్టంగా చెప్పాము.',
    path: site.legal.privacyPath,
  })

  return (
    <>
      <PageHeader
        eyebrow="గోప్యతా విధానం"
        title="గోప్యతా విధానం"
        icon="sparkle"
        lede="మీ గోప్యత మాకు ముఖ్యం. ఈ పేజీలో మేము ఏం సేకరిస్తున్నామో, ఏం చేయం టోటో స్పష్టంగా ఉంది."
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'గోప్యతా విధానం' }]}
      />

      <div className="shell py-14 sm:py-20">
        <Prose>
          <p className="text-sm text-ink-muted">చివరి నవీకరణ: {UPDATED}</p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">మేము సేకరించే సమాచారం</h2>
          <p>
            ఈ వెబ్‌సైట్‌లో మేము మీ ఖాతాను నిర్వహించం, మీరు సేవ చేసిన విషయాలు (సర్చ్
            హిస్ట్రీ, ప్రశ్నలు) సేకరించం. ఈ వేదికలో యూసర్ అకౌంట్లు లేవు.
          </p>
          <p>
            మీరు సంప్రదింపు ఫారం పంపినప్పుడు మీరు ఇచ్చిన పేరు, ఇమెయిల్, సందేశం మాత్రమే
            మేము చూస్తాము. ఈ ఫారం ఇంకా అనుసంధానం చేయలేదు కాబట్టి ప్రస్తుతం సందేశాలు
            సేకరించబడవు.
          </p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">మీ బ్రౌజర్‌లో భద్రపరచబడేది</h2>
          <p>
            మీరు భద్రపరచిన బైబిల్ అధ్యాయాలు మరియు మీరు ఎంచుకున్న అక్షర పరిమాణం మీ
            బ్రౌజర్‌లోని <code className="rounded-[3px] bg-cream-200 px-1.5 py-0.5 text-[0.9em]">localStorage</code>{' '}
            లో మాత్రమే భద్రపరచబడతాయి. ఈ సమాచారం మీ పరికరంలోనే ఉంటుంది; మేము దానిని
            సేకరించం, పంపం లేదా చూడం.
          </p>
          <p>
            మీరు ఈ సమాచారాన్ని ఎప్పుడైనా తొలగించవచ్చు — అధ్యాయం చదవేటప్పుడు “భద్రపరచు”
            మళ్ళీ నొక్కండి, లేదా బ్రౌజర్ సెట్టింగ్‌లలో సైట్ డేటా తొలగించండి.
          </p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">యూజర్ డేటా</h2>
          <p>
            మేము యూజర్ అనాలిటిక్స్, యాడ్ ట్రాకర్లు లేదా ఫిస్ింగ్ కురిగా క్రమాలను ఉపయోగించం.
            బైబిల్ వాక్యం అన్వేషించేప్పుడు ఆ పాఠ్యం మీ బ్రౌజర్‌లోనే ఉంటుంది — మేము
            దానిని భద్రపరచం.
          </p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">బాహ్య సైట్లు</h2>
          <p>
            వీడియో చూడేటప్పుడు మీరు యూట్యూబ్‌కు కొడత బంధం కారడు మారుతుంది. యూట్యూబ్
            మీ గోప్యత విధానాన్ని దాని సొంతంగా నిర్వహిస్తుంది — దాని వివరాలకు{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline text-forest-700"
            >
              Google విధానం
            </a>{' '}
            చూడండి. వీడియోలు ఇక్కడ లోడ్ అవ్వకుండా ముందు థంబ్‌నెయిల్ చూపిస్తాము.
          </p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">మీ హక్కులు</h2>
          <p>
            మీరు మీ డేటాను చూడడం, సరిచేయడం, తొలగించడం హక్కు మీదే. ఈ సైట్ ద్వారా మేము
            మీ వ్యక్తిగత సమాచారాన్ని అమ్మం లేదా పంచుకోం. మీ డేటాను తొలగించాలంటే{' '}
            <Link to="/contact" className="link-underline text-forest-700">
              సంప్రదించండి
            </Link>{' '}
            పేజీ చూడండి.
          </p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">ఈ విధానంలో మార్పులు</h2>
          <p>
            ఈ విధానాన్ని మేము అప్‌డేట్ చేసినప్పుడు ఈ పేజీలో కొత్త తేదీ చూపిస్తాము.
          </p>
        </Prose>
      </div>
    </>
  )
}

/** Terms of use. */
export function TermsPage() {
  useSeo({
    title: 'నిబంధనలు',
    description:
      'సత్యసాక్షి వెబ్‌సైట్‌ను ఉపయోగించడం వివరాలు — బైబిల్ వాక్యం ఉపయోగ హక్కులు, సమాచార సరైంది, వివరాల కొరకు.',
    path: site.legal.termsPath,
  })

  return (
    <>
      <PageHeader
        eyebrow="నిబంధనలు"
        title="ఉపయోగ నిబంధనలు"
        icon="sparkle"
        lede="ఈ వెబ్‌సైట్‌ను ఉపయోగించే ముందు తప్పనిసరిగా తెలుసుకోవలసినవి."
        crumbs={[{ label: 'హోమ్', to: '/' }, { label: 'నిబంధనలు' }]}
      />

      <div className="shell py-14 sm:py-20">
        <Prose>
          <p className="text-sm text-ink-muted">చివరి నవీకరణ: {UPDATED}</p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">ఈ సైట్ ఏమి</h2>
          <p>
            ఇది {site.brand.telugu} అనే సంస్థ సంరక్షించే క్రైస్తవ విజ్ఞాన వేధిక. ఇక్కడ
            పరిశుద్ధ బైబిల్, బైబిల్ సందేశాలు, ప్రశ్నలు & సమాధానాలు, వ్యాసాలు అందుబాటులో
            ఉంటాయి.
          </p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">బైబిల్ వాక్యం ఉపయోగం</h2>
          <p>
            ఈ సైట్‌లోని బైబిల్ వాక్యం తెలుగు బైబిల్ (BSI) అనే పాఠ్యం నుండి తీసుకోబడింది.
            ఆ పాఠ్యాన్ని{' '}
            <a
              href="https://github.com/sajeevavahini/bibles"
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline text-forest-700"
            >
              Sajeeva Vahini
            </a>{' '}
            సంస్థ సమకూలంగా అందుబాటులో ఉంచింది. వాక్యాన్ని వ్యక్తిగత, విద్యాంతర, అర్చన
            ఉపయోగాలకు మీరు స్వేచ్ఛగా ఉపయోగించవచ్చు. వాణిజ్య ప్రయోజనాల కోసం ఈ పాఠ్యాన్ని
            మళ్ళీ పంపిణీ చేయడం లేదా అమ్మడం అనుమతించబడదు.
          </p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">సమాచార సరైంది</h2>
          <p>
            ఈ సైట్‌లోని ప్రశ్నలకు సమాధానాలు, వ్యాసాలు, వివరణలు మన విశ్వాసానికి, అభిప్రాయానికి
            సంబంధించినవి. వాటిని బైబిల్ సూచనలతో ముందుచేసి అందించాము — కానీ వాటిని
            తప్పుగా భావించవద్దని, అన్ని పరిస్థితులకు సమాధానమని భావించవద్దని చెప్పడం మా ఉద్దేశ్యం.
            మీ జీవితంలోని నిర్ణయాలు మీవే.
          </p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">సమాచార అందుబాటులో లేకపోవడం</h2>
          <p>
            ఈ సైట్‌లో కొన్ని విభాగాలు ఇంకా పూర్తి కాలేదు. ఏదైనా అంశం ప్రచురించబడకపోతే,
            అది తప్పుగా ఇవ్వబడదు — కేవలం ఖాళీగా ఉంటుంది. ఏదైనా అంశం తప్పుగా లేదా అసంపూర్ణంగా
            కనిపిస్తే దయచేసి{' '}
            <Link to="/contact" className="link-underline text-forest-700">
              తెలియజేయండి
            </Link>
            .
          </p>

          <h2 className="mb-3 mt-10 text-xl text-forest-950">బాధ్యత</h2>
          <p>
            ఈ సైట్‌లోని సమాచారం ఉపయోగకరంగా ఉండేలా శ్రద్ధగా ఉంచబడింది, కానీ ఏ జాబితా లేదా
            గుర్తులో తప్పు ఉంటే మేము సరిచేసి తెలియజేస్తాము. ఈ సైట్ ఆధారంగా మీరు తీసుకున్న
            నిర్ణయాలకు మేము జవాబుదారులం కావం.
          </p>
        </Prose>
      </div>
    </>
  )
}
