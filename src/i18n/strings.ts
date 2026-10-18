/**
 * Interface strings.
 *
 * Scope, deliberately: this covers the *chrome* — navigation, buttons, labels,
 * headings, empty states, form fields. It does not cover scripture.
 *
 * The Bible corpus is the Telugu text of `sajeevavahini/bibles` (BSI). There is
 * no published English translation of that same text in this project, so the
 * reader never switches language. Anything claiming otherwise would be showing
 * a reader scripture that does not exist in their hands. `LANG_NOTICE` below is
 * what the reader shows instead, so the boundary is explained rather than
 * silently crossed.
 *
 * Content data (article bodies, Q&A answers, video titles) is likewise not
 * translated: those are published Telugu texts, and translating them here would
 * mean writing new content the ministry has not reviewed.
 */

export const LANGUAGES = [
  { code: 'te', label: 'తెలుగు', htmlLang: 'te-IN', dir: 'ltr' },
  { code: 'en', label: 'English', htmlLang: 'en', dir: 'ltr' },
] as const

export type LanguageCode = (typeof LANGUAGES)[number]['code']

export const DEFAULT_LANGUAGE: LanguageCode = 'te'

/** Shown on Bible pages when the interface is not in Telugu. */
export const LANG_NOTICE: Record<Exclude<LanguageCode, 'te'>, string> = {
  en: 'The Bible text on this site is the Telugu (BSI) text only. There is no English translation of this text published here, so the scripture stays in Telugu. The interface around it is shown in English.',
}

const te = {
  /* Skip link and navigation */
  'a11y.skipToMain': 'ముఖ్య విభాగానికి వెళ్ళండి',
  'a11y.primaryNav': 'ప్రధాన మార్గాలు',
  'a11y.drawerNav': 'మెనూ మార్గాలు',
  'a11y.openMenu': 'మెనూను తెరవండి',
  'a11y.closeMenu': 'మెనూను మూసివేయండి',
  'a11y.drawer': 'మెనూ',
  'a11y.search': 'అన్వేషించండి',
  'a11y.clearSearch': 'వెతకింపును తొలగించు',
  'nav.home': 'హోమ్',
  'nav.bible': 'బైబిల్',
  'nav.messages': 'సందేశాలు',
  'nav.books': 'పుస్తకాలు',
  'nav.questions': 'ప్రశ్నలు & సమాధానాలు',
  'nav.articles': 'వ్యాసాలు',
  'nav.about': 'మా గురించి',
  'nav.contact': 'సంప్రదించండి',
  'nav.videos': 'వీడియోలు',
  'nav.privacy': 'గోప్యతా విధానం',
  'nav.terms': 'నిబంధనలు',
  'nav.search': 'వెతకండి',

  /* Footer */
  'footer.resources': 'వనరులు',
  'footer.info': 'సమాచారం',
  'footer.rights': 'సర్వ హక్కులు సురక్షితం.',
  'footer.designedBy': 'Designed by',
  'footer.bibleText': 'బైబిల్ వాక్యం',
  'footer.bibleSource': 'తెలుగు బైబిల్ (BSI)',
  'footer.bibleCredit': 'Sajeeva Vahini వారి అనుమతితో.',
  'footer.psalmRef': 'కీర్తనలు 119:105',
  'footer.youtubeChannel': 'YouTube చానెల్',
  'footer.locationsHeading': 'మా కేంద్రాలు & ప్రార్థనా స్థలాలు',
  'footer.locationsTitle': 'మమ్మల్ని సందర్శించండి',
  'footer.locationsSubtitle': 'దేవుని వాక్య అధ్యయనం & ఆరాధన కూడికల కొరకు మా కేంద్రాలకు స్వాగతం. గూగుల్ మ్యాప్స్ లేదా QR కోడ్ ద్వారా సులభంగా చేరుకోండి.',
  'footer.getDirections': 'గూగుల్ మ్యాప్స్ మార్గం',
  'footer.scanQr': 'QR స్కాన్ చేయండి',
  'footer.scanPrompt': 'కెమెరాతో స్కాన్ చేసి నేరుగా గూగుల్ మ్యాప్స్‌లో మార్గం పొందండి',

  /* Mobile App / PWA */
  'footer.appBadge': 'మొబైల్ వెబ్ యాప్',
  'footer.appTitle': 'సత్య సాక్షి మొబైల్ యాప్ డౌన్‌లోడ్ చేసుకోండి',
  'footer.appSubtitle': 'మీ ఫోన్ హోమ్‌స్క్రీన్‌లో యాప్‌లా ఇన్‌స్టాల్ చేసుకోండి — వెబ్‌సైట్ అప్‌డేట్ అయిన వెంటనే యాప్ కూడా ఒకే సమయంలో ఎటువంటి సమస్య లేకుండా అప్‌డేట్ అవుతుంది.',
  'footer.appInstallBtn': 'ఫోన్‌లో ఇన్‌స్టాల్ చేసుకోండి',
  'footer.appInstalled': 'యాప్ ఇన్‌స్టాల్ చేయబడింది',
  'footer.appCheckUpdate': 'తాజా వెర్షన్ తనిఖీ',
  'footer.appChecking': 'తనిఖీ చేస్తోంది...',
  'footer.appUpdated': 'యాప్ తాజా వెర్షన్‌లో ఉంది',
  'footer.appGuideLink': 'ఇన్‌స్టాలేషన్ సూచనలు',
  'footer.appSyncNotice': '⚡ వెబ్‌సైట్ మారిన వెంటనే మొబైల్ యాప్ స్వయంచాలకంగా అప్‌డేట్ అవుతుంది',
  'pwa.modalTitle': 'సత్య సాక్షి మొబైల్ యాప్ ఇన్‌స్టాల్ చేసుకోండి',
  'pwa.modalSubtitle': 'యాప్ స్టోర్ లేదా ప్లేస్టోర్ అవసరం లేకుండా, నేరుగా మీ మొబైల్ హోమ్‌స్క్రీన్‌కు జోడించుకోండి. వెబ్‌సైట్ మరియు మొబైల్ వెర్షన్ ఎల్లప్పుడూ ఒకే సమయంలో అప్‌డేట్ అవుతాయి.',
  'pwa.androidTab': 'ఆండ్రాయిడ్ (Chrome)',
  'pwa.iosTab': 'ఐఫోన్ / ఐప్యాడ్ (Safari)',
  'pwa.step1Android': 'Google Chrome లేదా Samsung Internet లో ఈ సైట్ తెరవండి.',
  'pwa.step2Android': 'కుడివైపు పైభాగంలో ఉన్న మూడు చుక్కల (⋮) మెనూను నొక్కండి.',
  'pwa.step3Android': '"Install app" లేదా "Add to Home screen" (యాప్‌ను ఇన్‌స్టాల్ చేయండి) ఎంచుకోండి.',
  'pwa.step4Android': '"Install" క్లిక్ చేయండి. సత్య సాక్షి యాప్ మీ ఫోన్‌లో సిద్ధమవుతుంది.',
  'pwa.step1Ios': 'ఈ పేజీని Safari బ్రౌజర్‌లో తెరవండి.',
  'pwa.step2Ios': 'కింది భాగంలో ఉన్న షేర్ ఐకాన్ (⎋ Share బటన్) నొక్కండి.',
  'pwa.step3Ios': 'కిందికి స్క్రోల్ చేసి "Add to Home Screen" (హోమ్ స్క్రీన్‌కు జోడించండి) ఎంచుకోండి.',
  'pwa.step4Ios': 'కుడివైపు పైభాగంలో "Add" క్లిక్ చేయండి. సత్య సాక్షి ఐకాన్ మీ హోమ్ స్క్రీన్‌పై కనిపిస్తుంది.',
  'pwa.benefit1': 'యాప్ స్టోర్ వెతకాల్సిన పనిలేదు — తేలికైన పరిమాణం (< 2 MB)',
  'pwa.benefit2': 'పూర్తి ఆఫ్‌లైన్ రీడర్ & వేగవంతమైన లోడింగ్',
  'pwa.benefit3': 'వెబ్‌సైట్ మారిన వెంటనే ఎటువంటి గ్లిచ్ లేకుండా ఇక్కడ కూడా మారుతుంది',
  'pwa.installNow': 'ఇప్పుడే ఇన్‌స్టాల్ చేయండి',
  'pwa.close': 'మూసివేయండి',
  'pwa.updateReadyTitle': 'నూతన నవీకరణ అందుబాటులో ఉంది',
  'pwa.updateReadyDesc': 'సత్య సాక్షి తాజా వెర్షన్ సిద్ధమైంది. వెంటనే అప్‌డేట్ చేసుకోండి.',
  'pwa.reloadNow': 'వెంటనే అప్‌డేట్ చేయండి',

  /* Language switcher */
  'lang.label': 'భాష',
  'lang.switchTo': 'English మర్చి పెట్టండి',

  /* Shared UI */
  'ui.searchPlaceholder': 'వెతకండి…',
  'ui.viewAll': 'అన్నీ చూడండి',
  'ui.loading': 'లోడ్ అవుతోంది',
  'ui.pageLoading': 'పేజీ లోడ్ అవుతోంది',
  'ui.error': 'ఏదో పొరపాటు జరిగింది',
  'ui.retry': 'మళ్ళీ ప్రయత్నించండి',
  'ui.home': 'హోమ్',
  'ui.notFound': 'పేజీ దొరకలేదు',

  /* Bible */
  'bible.searchLabel': 'బైబిల్‌లో వెతకండి',
  'bible.openInBible': 'బైబిల్‌లో చదవండి',
  'bible.textUnavailable': 'వాక్యం చూడలేకపోయాము.',
  'bible.bookNotFound': 'పుస్తకం కనబడలేదు',
  'bible.chapterNotFound': 'అధ్యాయం కనబడలేదు',
  'bible.increaseText': 'అక్షరాల పరిమాణం పెంచండి',
  'bible.decreaseText': 'అక్షరాల పరిమాణం తగ్గించండి',
  'bible.resetText': 'అక్షరాల పరిమాణం మామూలుగా',
  'bible.addBookmark': 'బుక్‌మార్క్ చేయండి',
  'bible.removeBookmark': 'బుక్‌మార్క్ తొలగించండి',
  'bible.share': 'పంచుకోండి',
  'bible.copied': 'కాపీ అయ్యింది',
  'bible.prevChapter': 'మునుపటి అధ్యాయం',
  'bible.nextChapter': 'తదుపరి అధ్యాయం',
  'bible.selectChapter': 'అధ్యాయం ఎంచుకోండి',
  'bible.chapters': 'అధ్యాయాలు',
  'bible.verses': 'వాక్యాలు',

  /* Search */
  'search.sitePlaceholder': 'ఈ వేదికలో వెతకండి',
  'search.siteLabel': 'ఈ వేదికలో వెతకండి',
  'search.siteHeading': 'అన్వేషించండి',
  'search.bibleHeading': 'బైబిల్‌లో వెతకండి',
  'search.resultsFor': 'ఫలితాలు',
  'search.noResults': 'ఏ ఫలితాలూ కనబడలేదు',
  'search.minChars': 'కనీసం రెండు అక్షరాలు టైప్ చేయండి.',
} as const

const en: Record<keyof typeof te, string> = {
  'a11y.skipToMain': 'Skip to main content',
  'a11y.primaryNav': 'Primary navigation',
  'a11y.drawerNav': 'Menu navigation',
  'a11y.openMenu': 'Open menu',
  'a11y.closeMenu': 'Close menu',
  'a11y.drawer': 'Menu',
  'a11y.search': 'Search',
  'a11y.clearSearch': 'Clear search',
  'nav.home': 'Home',
  'nav.bible': 'Bible',
  'nav.messages': 'Messages',
  'nav.books': 'Books',
  'nav.questions': 'Questions & Answers',
  'nav.articles': 'Articles',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.videos': 'Videos',
  'nav.privacy': 'Privacy Policy',
  'nav.terms': 'Terms',
  'nav.search': 'Search',

  'footer.resources': 'Resources',
  'footer.info': 'Information',
  'footer.rights': 'All rights reserved.',
  'footer.designedBy': 'Designed by',
  'footer.bibleText': 'Bible text:',
  'footer.bibleSource': 'Telugu Bible (BSI)',
  'footer.bibleCredit': ', with permission from Sajeeva Vahini.',
  'footer.psalmRef': 'Psalm 119:105',
  'footer.youtubeChannel': 'YouTube channel',
  'footer.locationsHeading': 'Our Locations & Fellowship Centers',
  'footer.locationsTitle': 'Visit Us',
  'footer.locationsSubtitle': 'Welcome to our Bible study and worship fellowship centers in Kakinada and Gondhi Kottapalli (Sankavaram Mandal). Get directions on Google Maps or scan the QR code.',
  'footer.getDirections': 'Get Directions on Google Maps',
  'footer.scanQr': 'Scan QR Code',
  'footer.scanPrompt': 'Scan with mobile camera to open navigation directly',

  /* Mobile App / PWA */
  'footer.appBadge': 'Mobile Web App',
  'footer.appTitle': 'Download Satyasakshi Mobile App',
  'footer.appSubtitle': 'Install directly onto your phone home screen — when the website is updated, the mobile web app updates simultaneously without any glitches.',
  'footer.appInstallBtn': 'Install on Your Phone',
  'footer.appInstalled': 'App Installed',
  'footer.appCheckUpdate': 'Check for Updates',
  'footer.appChecking': 'Checking...',
  'footer.appUpdated': 'App is up to date',
  'footer.appGuideLink': 'Installation Guide',
  'footer.appSyncNotice': '⚡ Mobile web app updates simultaneously whenever website is updated',
  'pwa.modalTitle': 'Install Satyasakshi Mobile App',
  'pwa.modalSubtitle': 'No App Store download required. Add directly to your home screen. Website and mobile app always update at the exact same time.',
  'pwa.androidTab': 'Android (Chrome)',
  'pwa.iosTab': 'iPhone / iPad (Safari)',
  'pwa.step1Android': 'Open this website in Google Chrome or Samsung Internet.',
  'pwa.step2Android': 'Tap the three dots (⋮) menu icon at the top right or bottom.',
  'pwa.step3Android': 'Select "Install app" or "Add to Home screen".',
  'pwa.step4Android': 'Tap "Install". Satyasakshi will appear on your phone home screen.',
  'pwa.step1Ios': 'Open this page in the Safari browser.',
  'pwa.step2Ios': 'Tap the Share icon (⎋ square with upward arrow) at the bottom.',
  'pwa.step3Ios': 'Scroll down and tap "Add to Home Screen" (➕).',
  'pwa.step4Ios': 'Tap "Add" in the top right corner. Satyasakshi icon will be on your home screen.',
  'pwa.benefit1': 'No app store search — ultra-lightweight (< 2 MB)',
  'pwa.benefit2': 'Fast loading with offline scripture access',
  'pwa.benefit3': 'Simultaneous instant updates whenever website updates without glitches',
  'pwa.installNow': 'Install Now',
  'pwa.close': 'Close',
  'pwa.updateReadyTitle': 'New Update Available',
  'pwa.updateReadyDesc': 'A newer version of Satyasakshi is ready. Update now to load the latest changes.',
  'pwa.reloadNow': 'Update Now',

  'lang.label': 'Language',
  'lang.switchTo': 'Switch to Telugu',

  'ui.searchPlaceholder': 'Search…',
  'ui.viewAll': 'View all',
  'ui.loading': 'Loading',
  'ui.pageLoading': 'Loading page',
  'ui.error': 'Something went wrong',
  'ui.retry': 'Try again',
  'ui.home': 'Home',
  'ui.notFound': 'Page not found',

  'bible.searchLabel': 'Search the Bible',
  'bible.openInBible': 'Read in the Bible',
  'bible.textUnavailable': 'The verse text could not be loaded.',
  'bible.bookNotFound': 'Book not found',
  'bible.chapterNotFound': 'Chapter not found',
  'bible.increaseText': 'Increase text size',
  'bible.decreaseText': 'Decrease text size',
  'bible.resetText': 'Reset text size',
  'bible.addBookmark': 'Add bookmark',
  'bible.removeBookmark': 'Remove bookmark',
  'bible.share': 'Share',
  'bible.copied': 'Copied',
  'bible.prevChapter': 'Previous chapter',
  'bible.nextChapter': 'Next chapter',
  'bible.selectChapter': 'Select a chapter',
  'bible.chapters': 'chapters',
  'bible.verses': 'verses',

  'search.sitePlaceholder': 'Search this site',
  'search.siteLabel': 'Search this site',
  'search.siteHeading': 'Search',
  'search.bibleHeading': 'Search the Bible',
  'search.resultsFor': 'results for',
  'search.noResults': 'No results found',
  'search.minChars': 'Type at least two characters.',
}

export const STRINGS = { te, en }

export type StringKey = keyof typeof te
