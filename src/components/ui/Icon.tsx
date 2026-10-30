import type { SVGProps } from 'react'

/**
 * A small, consistent set of line icons.
 *
 * Deliberately restrained: 24×24 grid, 1.5px strokes, no fills, no emoji.
 * Everything inherits `currentColor` so icons always match their context.
 */

export type IconName =
  | 'book'
  | 'book-open'
  | 'stack'
  | 'play'
  | 'question'
  | 'search'
  | 'menu'
  | 'close'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'arrow-right'
  | 'arrow-left'
  | 'bookmark'
  | 'share'
  | 'download'
  | 'external'
  | 'youtube'
  | 'mail'
  | 'whatsapp'
  | 'phone'
  | 'clock'
  | 'calendar'
  | 'quote'
  | 'sparkle'
  | 'check'
  | 'alert'
  | 'home'
  | 'language'
  | 'text-size'
  | 'map-pin'
  | 'qr-code'
  | 'refresh'
  | 'chart'
  | 'trending-up'
  | 'eye'
  | 'mouse-pointer'
  | 'filter'
  | 'trash'
  | 'export'
  | 'smartphone'
  | 'apple'
  | 'android'
  | 'zap'
  | 'grid'
  | 'grid-compact'
  | 'list'
  | 'layers'

const paths: Record<IconName, React.ReactNode> = {
  book: (
    <>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5.5A1.5 1.5 0 0 1 4 15.5Z" />
      <path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H14a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h4.5a1.5 1.5 0 0 0 1.5-1.5Z" />
    </>
  ),
  'book-open': (
    <>
      <path d="M12 6.5C10.5 5 8.5 4.5 6 4.5H3v13h3c2.5 0 4.5.5 6 2 1.5-1.5 3.5-2 6-2h3v-13h-3c-2.5 0-4.5.5-6 2Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  stack: (
    <>
      <rect x="3" y="4" width="18" height="4.5" rx="1" />
      <rect x="3" y="10" width="18" height="4.5" rx="1" />
      <path d="M5 17h14" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10.5 8.5 5 3.5-5 3.5Z" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.7-.9 1.3v.4" />
      <path d="M12 17h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  'chevron-right': <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  'chevron-left': <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />,
  'chevron-down': <path d="m5.5 9.5 6.5 6.5 6.5-6.5" />,
  'arrow-right': (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  'arrow-left': (
    <>
      <path d="M20 12H4" />
      <path d="m10 6-6 6 6 6" />
    </>
  ),
  bookmark: <path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4-6.5 4V4.5a1 1 0 0 1 1-1Z" />,
  share: (
    <>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="m8.3 10.8 7.4-4M8.3 13.2l7.4 4" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5v11" />
      <path d="m8 11 4 4 4-4" />
      <path d="M4.5 19.5h15" />
    </>
  ),
  external: (
    <>
      <path d="M13.5 4.5H19.5V10.5" />
      <path d="m19.5 4.5-8 8" />
      <path d="M18 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="m10.2 9.4 4.8 2.6-4.8 2.6Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  whatsapp: (
    <>
      <path d="M3 21l1.65-3.8A9 9 0 1 1 20.3 8.3a9 9 0 0 1-12.2 9.6L3 21Z" />
      <path d="M9.5 9c-.3.8-.2 1.8.8 3.2 1 1.4 2.2 2.2 3.1 2.4.7.2 1.5-.1 1.9-.6l.7-.9c.2-.2.1-.6-.2-.7l-1.8-.8c-.3-.1-.6 0-.8.2l-.5.6c-.6-.4-1.2-1-1.6-1.6l.6-.5c.2-.2.3-.5.2-.8l-.8-1.8c-.1-.3-.5-.4-.7-.2l-.9.7Z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  quote: (
    <>
      <path d="M9.5 6.5C7 7.5 5.5 9.5 5.5 12.5V17.5h5V12H8c0-2 .8-3.2 2.4-4Z" />
      <path d="M18 6.5c-2.5 1-4 3-4 6v5h5V12h-2.5c0-2 .8-3.2 2.4-4Z" />
    </>
  ),
  sparkle: <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9Z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16h.01" />
    </>
  ),
  home: (
    <>
      <path d="m4 10.5 8-6.5 8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19Z" />
      <path d="M9.5 20.5v-6h5v6" />
    </>
  ),
  language: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.4 3.3 5.4 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.4-3.3-8.5S9.8 5.9 12 3.5Z" />
    </>
  ),
  'text-size': (
    <>
      <path d="M3.5 18 7 7l3.5 11" />
      <path d="M4.6 14.5h4.8" />
      <path d="m14 18 2.8-8 2.8 8" />
      <path d="M14.8 15.4h4" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  'qr-code': (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h3M20 14v3" />
    </>
  ),
  refresh: (
    <path d="M21 12a9 9 0 0 0-15.5-6.36L3 8m0-5v5h5M3 12a9 9 0 0 0 15.5 6.36L21 16m0 5v-5h-5" />
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <rect x="7" y="10" width="3" height="8" rx="1" />
      <rect x="13" y="6" width="3" height="12" rx="1" />
      <rect x="19" y="13" width="2" height="5" rx="1" />
    </>
  ),
  'trending-up': (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'mouse-pointer': (
    <>
      <path d="m3 3 7 18 3.5-6.5L20 11 3 3Z" />
      <path d="m13 13 6 6" />
    </>
  ),
  filter: (
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  ),
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </>
  ),
  export: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  smartphone: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </>
  ),
  apple: (
    <>
      <path d="M12 20.94c1.5 0 2.75-.81 3.5-1.5.75-.69 1.5-1.44 2.5-1.44.75 0 1.5.56 2 1.06-.5-1.88-1.5-3.06-2.5-4.06 1.75-1.25 2.5-3 2.5-5 0-3.31-2.69-6-6-6-2 0-3.5 1-4.5 1s-2.5-1-4.5-1c-3.31 0-6 2.69-6 6 0 4.5 3.5 10 6 10.94 1.5.56 2.5 0 3.5 0z" />
      <path d="M12 4a3 3 0 0 1 2-3" />
    </>
  ),
  android: (
    <>
      <path d="M5 16h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2Z" />
      <line x1="7" y1="8" x2="5" y2="4" />
      <line x1="17" y1="8" x2="19" y2="4" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
    </>
  ),
  zap: (
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  'grid-compact': (
    <>
      <rect x="3.5" y="3.5" width="4.5" height="4.5" rx="1" />
      <rect x="9.75" y="3.5" width="4.5" height="4.5" rx="1" />
      <rect x="16" y="3.5" width="4.5" height="4.5" rx="1" />
      <rect x="3.5" y="9.75" width="4.5" height="4.5" rx="1" />
      <rect x="9.75" y="9.75" width="4.5" height="4.5" rx="1" />
      <rect x="16" y="9.75" width="4.5" height="4.5" rx="1" />
      <rect x="3.5" y="16" width="4.5" height="4.5" rx="1" />
      <rect x="9.75" y="16" width="4.5" height="4.5" rx="1" />
      <rect x="16" y="16" width="4.5" height="4.5" rx="1" />
    </>
  ),
  list: (
    <>
      <line x1="8" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="20" y2="12" />
      <line x1="8" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="1.2" fill="currentColor" />
      <circle cx="4" cy="12" r="1.2" fill="currentColor" />
      <circle cx="4" cy="18" r="1.2" fill="currentColor" />
    </>
  ),
  layers: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>
  ),
}

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
  /** Provide when the icon is the only content of a control. */
  title?: string
}

export function Icon({ name, size = 20, title, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  )
}