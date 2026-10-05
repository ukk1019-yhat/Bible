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
  'footer.bibleText': 'బైబిల్ వాక్యం',
  'footer.bibleSource': 'తెలుగు బైబిల్ (BSI)',
  'footer.bibleCredit': 'Sajeeva Vahini వారి అనుమతితో.',
  'footer.psalmRef': 'కీర్తనలు 119:105',
  'footer.youtubeChannel': 'YouTube చానెల్',

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
  'footer.bibleText': 'Bible text:',
  'footer.bibleSource': 'Telugu Bible (BSI)',
  'footer.bibleCredit': ', with permission from Sajeeva Vahini.',
  'footer.psalmRef': 'Psalm 119:105',
  'footer.youtubeChannel': 'YouTube channel',

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
