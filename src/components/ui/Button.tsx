import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from './Icon'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'onDarkSecondary'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Trailing icon. Ignored when `children` already contains an icon. */
  icon?: IconName
  iconPosition?: 'start' | 'end'
  className?: string
  children: ReactNode
}

type LinkProps = CommonProps & {
  to: string
  href?: undefined
  type?: undefined
  onClick?: () => void
  disabled?: undefined
}

type AnchorProps = CommonProps & {
  href: string
  to?: undefined
  type?: undefined
  onClick?: () => void
  disabled?: undefined
}

type NativeProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: undefined
    href?: undefined
  }

export type ButtonProps = LinkProps | AnchorProps | NativeProps

/**
 * Restrained, editorial button.
 *
 * `primary` is a solid forest-green block, `secondary` is an outlined block,
 * `ghost` is text-only and `onDark` is for use over forest backgrounds.
 * Rounded corners are subtle — this is a reading platform, not a SaaS console.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'end',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'group/btn inline-flex items-center justify-center gap-2 font-medium ' +
    'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ' +
    'active:translate-y-px disabled:pointer-events-none disabled:opacity-55'

  const sizes: Record<ButtonSize, string> = {
    sm: 'min-h-9 px-3.5 text-sm rounded-[var(--radius-sm)]',
    md: 'min-h-11 px-5 text-[0.95rem] rounded-[var(--radius-md)]',
    lg: 'min-h-13 px-7 text-base rounded-[var(--radius-md)]',
  }

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-forest-800 text-cream-50 shadow-xs hover:bg-forest-700 hover:shadow-md ' +
      'focus-visible:outline-forest-500',
    secondary:
      'border border-forest-800/25 bg-transparent text-forest-900 hover:border-forest-700/45 ' +
      'hover:bg-forest-100/60',
    ghost: 'text-forest-800 hover:text-forest-600 px-0 sm:px-0',
    onDark:
      'bg-cream-50 text-forest-900 shadow-xs hover:bg-cream-200 hover:shadow-md',
    onDarkSecondary:
      'border border-gold-400/40 bg-transparent text-cream-100 hover:border-gold-300 hover:bg-white/10 hover:text-white',
  }

  const iconOnly = sizes[size].includes('px-3.5') && !String(children).trim()

  const classes = [
    base,
    sizes[size],
    variants[variant],
    iconOnly ? 'aspect-square !px-0' : '',
    variant === 'ghost' && icon ? 'gap-1.5' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const glyph = icon ? (
    <Icon
      name={icon}
      size={size === 'sm' ? 16 : 18}
      className={
        iconPosition === 'end'
          ? 'transition-transform duration-200 group-hover/btn:translate-x-0.5'
          : 'transition-transform duration-200 group-hover/btn:-translate-x-0.5'
      }
    />
  ) : null

  const content = (
    <>
      {iconPosition === 'start' && glyph}
      <span className={iconOnly ? 'sr-only' : undefined}>{children}</span>
      {iconPosition === 'end' && glyph}
    </>
  )

  if ('to' in rest && rest.to !== undefined) {
    const { to, onClick, ...linkRest } = rest
    return (
      <Link to={to} onClick={onClick} className={classes} {...linkRest}>
        {content}
      </Link>
    )
  }

  if ('href' in rest && rest.href !== undefined) {
    const { href, onClick, ...anchorRest } = rest
    return (
      <a href={href} onClick={onClick} className={classes} {...anchorRest}>
        {content}
      </a>
    )
  }

  const { type = 'button', ...buttonRest } = rest as NativeProps
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  )
}
