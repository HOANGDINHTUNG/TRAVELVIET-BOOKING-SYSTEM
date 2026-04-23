import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const start = window.pageYOffset

    if (start <= 0) {
      return undefined
    }

    const duration = 600
    const startTime = performance.now()
    let rafId = 0

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)

      window.scrollTo(0, start * (1 - ease))

      if (elapsed < duration) {
        rafId = window.requestAnimationFrame(animateScroll)
      }
    }

    rafId = window.requestAnimationFrame(animateScroll)

    return () => window.cancelAnimationFrame(rafId)
  }, [pathname])

  return null
}

export default ScrollToTop
