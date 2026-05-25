import { useCallback, useEffect, useRef } from 'react'

/**
 * Trả callback được debounce — dùng cho sidebar filter / resize (giảm INP).
 */
export function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs = 300,
): (...args: Args) => void {
  const fnRef = useRef(fn)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  useEffect(
    () => () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current)
      }
    },
    [],
  )

  return useCallback(
    (...args: Args) => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current)
      }
      timerRef.current = window.setTimeout(() => {
        fnRef.current(...args)
      }, Math.max(0, delayMs))
    },
    [delayMs],
  )
}
