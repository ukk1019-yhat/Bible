import type { NavItem } from '../types/content'

/**
 * Primary navigation. Deliberately matches the platform's real content
 * sections and the navigation the existing site already uses, so returning
 * visitors find the same destinations in a better layout.
 */
export const primaryNav: NavItem[] = [
  { label: 'హోమ్', to: '/' },
  { label: 'బైబిల్', to: '/bible' },
  { label: 'సందేశాలు', to: '/messages' },
  { label: 'పుస్తకాలు', to: '/books' },
  { label: 'ప్రశ్నలు & సమాధానాలు', to: '/questions' },
  { label: 'వ్యాసాలు', to: '/articles' },
  { label: 'మా గురించి', to: '/about' },
  { label: 'సంప్రదించండి', to: '/contact' },
]

export const footerResourceNav: NavItem[] = [
  { label: 'బైబిల్', to: '/bible' },
  { label: 'సందేశాలు', to: '/messages' },
  { label: 'పుస్తకాలు', to: '/books' },
  { label: 'ప్రశ్నలు & సమాధానాలు', to: '/questions' },
  { label: 'వ్యాసాలు', to: '/articles' },
  { label: 'వీడియోలు', to: '/videos' },
]

export const footerInfoNav: NavItem[] = [
  { label: 'మా గురించి', to: '/about' },
  { label: 'సంప్రదించండి', to: '/contact' },
  { label: 'గోప్యతా విధానం', to: '/privacy' },
  { label: 'నిబంధనలు', to: '/terms' },
]

/** The four entry points shown directly under the homepage hero. */
export const quickResources = [
  {
    key: 'bible',
    title: 'బైబిల్',
    description: 'దేవుని వాక్యాన్ని అధ్యాయం వారీగా చదవండి.',
    to: '/bible',
    icon: 'book',
  },
  {
    key: 'messages',
    title: 'బైబిల్ సందేశాలు',
    description: 'విశ్వాసాన్ని బలపరిచే బైబిల్ బోధనలు మరియు సందేశాలు.',
    to: '/messages',
    icon: 'play',
  },
  {
    key: 'books',
    title: 'క్రైస్తవ పుస్తకాలు',
    description: 'ఉచిత తెలుగు క్రైస్తవ పుస్తకాలను చదవండి మరియు డౌన్‌లోడ్ చేసుకోండి.',
    to: '/books',
    icon: 'stack',
  },
  {
    key: 'questions',
    title: 'ప్రశ్నలు & సమాధానాలు',
    description: 'బైబిల్ ఆధారంగా మీ ప్రశ్నలకు సమాధానాలు తెలుసుకోండి.',
    to: '/questions',
    icon: 'question',
  },
] as const