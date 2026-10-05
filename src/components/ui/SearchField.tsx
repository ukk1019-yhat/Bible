import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from './Icon'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
  /** Hide the visible label but keep it for screen readers. */
  hideLabel?: boolean
  /** Show a "clear" button while there is a query. */
  onSubmit?: () => void
  autoFocus?: boolean
  className?: string
  size?: 'md' | 'lg'
  /** Rendered under the field, e.g. a result count or hint. */
  hint?: React.ReactNode
}

/**
 * The platform's single search input style.
 *
 * Deliberately a plain form control: no animation on focus beyond a colour
 * change, because it sits inside scripture-heavy pages where a moving target
 * is distracting. Pressing Enter inside a form submits; the parent decides
 * what that means.
 */
export function SearchField({
  value,
  onChange,
  placeholder = 'వెతకండి…',
  label,
  hideLabel = false,
  onSubmit,
  autoFocus,
  className = '',
  size = 'md',
  hint,
}: SearchFieldProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  // `/` focuses the field from anywhere, as long as the user is not typing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (target?.isContentEditable) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const heights = size === 'lg' ? 'min-h-14' : 'min-h-12'

  return (
    <div className={className}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit?.()
        }}
      >
        <label
          htmlFor={id}
          className={hideLabel ? 'sr-only' : 'mb-2 block text-sm font-medium text-forest-900'}
        >
          {label}
        </label>

        <div className="relative">
          <span
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              focused ? 'text-forest-600' : 'text-ink-muted'
            }`}
          >
            <Icon name="search" size={size === 'lg' ? 20 : 18} />
          </span>

          <input
            id={id}
            ref={inputRef}
            type="search"
            inputMode="search"
            autoFocus={autoFocus}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            aria-describedby={hint ? `${id}-hint` : undefined}
            className={`w-full ${heights} rounded-[var(--radius-md)] border bg-cream-50 pl-11 text-[0.95rem] text-ink shadow-xs transition-colors duration-200 placeholder:text-ink-muted/80 focus:outline-none ${
              value ? 'pr-11' : 'pr-4'
            } ${
              focused
                ? 'border-forest-600 bg-white'
                : 'border-cream-400 hover:border-cream-400'
            }`}
          />

          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange('')
                inputRef.current?.focus()
              }}
              className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-cream-200 hover:text-forest-800"
            >
              <Icon name="close" size={16} />
              <span className="sr-only">వెతకింపును తొలగించు</span>
            </button>
          ) : null}
        </div>
      </form>

      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
