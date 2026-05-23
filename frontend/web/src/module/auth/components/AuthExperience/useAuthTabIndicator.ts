import { useCallback, useEffect, useState, type RefObject } from 'react'
import type { AuthMode } from './AuthExperience'

export function useAuthTabIndicator(
  tabListRef: RefObject<HTMLDivElement | null>,
  mode: AuthMode,
) {
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const measure = useCallback(() => {
    const list = tabListRef.current
    if (!list) return
    const active = list.querySelector<HTMLButtonElement>(
      `[data-auth-tab="${mode}"]`,
    )
    if (!active) return
    setIndicator({
      left: active.offsetLeft,
      width: active.offsetWidth,
    })
  }, [mode, tabListRef])

  useEffect(() => {
    measure()
    const list = tabListRef.current
    if (!list) return

    const observer = new ResizeObserver(() => measure())
    observer.observe(list)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure, tabListRef])

  return indicator
}
