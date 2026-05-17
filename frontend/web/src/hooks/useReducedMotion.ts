import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Hook đọc reactively `prefers-reduced-motion` của hệ thống.
 * Mọi animation lớn (parallax, hero loop, stagger) NÊN check hook này
 * và degrade về fade nhẹ hoặc không animate.
 *
 * Tham khảo: <https://web.dev/articles/prefers-reduced-motion>
 */
export function useReducedMotion(defaultValue = false) {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return defaultValue
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return undefined
    const mql = window.matchMedia(QUERY)
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches)
    setReduced(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return reduced
}
