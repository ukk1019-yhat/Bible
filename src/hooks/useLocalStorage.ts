import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'satyasakshi:'

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    // Private mode, quota errors, or corrupted JSON — fall back silently.
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    // Notify other components mounted on the same page.
    window.dispatchEvent(new CustomEvent(`${PREFIX}change`, { detail: key }))
  } catch {
    /* storage unavailable — state still works for this session */
  }
}

/**
 * State mirrored into localStorage, used for reading preferences and
 * bookmarks. Degrades to plain in-memory state when storage is blocked.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => read(key, initialValue))

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (prev: T) => T)(prev) : next
        write(key, resolved)
        return resolved
      })
    },
    [key],
  )

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail
      if (detail === key) setValue(read(key, initialValue))
    }
    window.addEventListener(`${PREFIX}change`, handler)
    return () => window.removeEventListener(`${PREFIX}change`, handler)
    // `initialValue` is intentionally excluded: callers pass literals.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [value, set] as const
}