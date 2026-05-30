import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

const DEFAULT_STRIDE = 328
/** Trượt chậm, dễ thấy — ~0.65s mỗi bước */
const SLIDE_DURATION_S = 0.65

type UseSmoothInfiniteCarouselOptions = {
  itemCount: number
  visibleCount: number
  loop?: boolean
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useSmoothInfiniteCarousel({
  itemCount,
  visibleCount,
  loop = true,
}: UseSmoothInfiniteCarouselOptions) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(0)
  const isMovingRef = useRef(false)
  const unlockTimerRef = useRef<number | null>(null)

  const n = itemCount
  const vis = Math.max(1, Math.min(visibleCount, n || 1))
  const canLoop = loop && n > 1

  const [stride, setStride] = useState(DEFAULT_STRIDE)
  const [position, setPosition] = useState(0)
  const [instant, setInstant] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  positionRef.current = position
  isMovingRef.current = isMoving

  const clearUnlockTimer = useCallback(() => {
    if (unlockTimerRef.current != null) {
      window.clearTimeout(unlockTimerRef.current)
      unlockTimerRef.current = null
    }
  }, [])

  const releaseMoving = useCallback(() => {
    clearUnlockTimer()
    isMovingRef.current = false
    setIsMoving(false)
  }, [clearUnlockTimer])

  const scheduleReleaseMoving = useCallback(
    (durationMs: number) => {
      clearUnlockTimer()
      const delay = Math.max(32, durationMs)
      unlockTimerRef.current = window.setTimeout(() => {
        unlockTimerRef.current = null
        if (!isMovingRef.current) return
        releaseMoving()
        const pos = positionRef.current
        if (canLoop && pos >= n) {
          setInstant(true)
          setPosition(0)
          positionRef.current = 0
          requestAnimationFrame(() => {
            setInstant(false)
          })
        }
      }, delay)
    },
    [canLoop, clearUnlockTimer, n, releaseMoving],
  )

  const measureStride = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport || n < 1) return

    const track = viewport.querySelector<HTMLElement>('.smooth-carousel-track')
    const slide = viewport.querySelector<HTMLElement>('[data-carousel-slide]')

    const gap =
      (track &&
        (Number.parseFloat(getComputedStyle(track).columnGap) ||
          Number.parseFloat(getComputedStyle(track).gap) ||
          0)) ||
      0

    const viewportWidth = viewport.getBoundingClientRect().width
    if (viewportWidth > 0) {
      const slideWidth = (viewportWidth - (vis - 1) * gap) / vis
      const fromViewport = slideWidth + gap
      if (fromViewport > 0) {
        setStride(fromViewport)
        return
      }
    }

    if (!slide) return

    const measured = slide.getBoundingClientRect().width + gap
    if (measured > 0) {
      setStride(measured)
    }
  }, [n, vis])

  useLayoutEffect(() => {
    measureStride()
    const viewport = viewportRef.current
    if (!viewport) return

    const observer = new ResizeObserver(measureStride)
    observer.observe(viewport)
    window.addEventListener('resize', measureStride)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measureStride)
    }
  }, [measureStride, n, vis])

  useEffect(() => {
    setPosition(0)
    positionRef.current = 0
    setInstant(true)
    releaseMoving()
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setInstant(false))
    })
    return () => cancelAnimationFrame(id)
  }, [n, vis, releaseMoving])

  const durationSec =
    instant || prefersReducedMotion() ? 0 : SLIDE_DURATION_S

  const finishLoopReset = useCallback(() => {
    if (!canLoop) return
    if (positionRef.current >= n) {
      setInstant(true)
      setPosition(0)
      positionRef.current = 0
      requestAnimationFrame(() => {
        setInstant(false)
      })
    }
  }, [canLoop, n])

  const onTransitionComplete = useCallback(() => {
    releaseMoving()
    finishLoopReset()
  }, [finishLoopReset, releaseMoving])

  const slideUnlockMs = useCallback(
    () => (prefersReducedMotion() ? 50 : SLIDE_DURATION_S * 1000 + 80),
    [],
  )

  const goNext = useCallback(() => {
    if (n <= 1 || isMovingRef.current) return
    isMovingRef.current = true
    setIsMoving(true)

    scheduleReleaseMoving(slideUnlockMs())

    if (!canLoop) {
      setPosition((p) => {
        const max = Math.max(0, n - vis)
        if (p >= max) {
          releaseMoving()
          return p
        }
        const next = p + 1
        positionRef.current = next
        return next
      })
      return
    }

    setPosition((p) => {
      const next = p >= n ? p : p + 1
      positionRef.current = next
      return next
    })
  }, [canLoop, n, releaseMoving, scheduleReleaseMoving, slideUnlockMs, vis])

  const goPrev = useCallback(() => {
    if (n <= 1 || isMovingRef.current) return
    isMovingRef.current = true
    setIsMoving(true)

    scheduleReleaseMoving(slideUnlockMs())

    if (!canLoop) {
      setPosition((p) => {
        if (p <= 0) {
          releaseMoving()
          return p
        }
        const next = p - 1
        positionRef.current = next
        return next
      })
      return
    }

    if (positionRef.current === 0) {
      setInstant(true)
      setPosition(n)
      positionRef.current = n
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setInstant(false)
          const prev = n - 1
          setPosition(prev)
          positionRef.current = prev
        })
      })
      return
    }

    setPosition((p) => {
      const next = p - 1
      positionRef.current = next
      return next
    })
  }, [canLoop, n, releaseMoving, scheduleReleaseMoving, slideUnlockMs, vis])

  useEffect(() => clearUnlockTimer, [clearUnlockTimer])

  const offsetX = -position * stride
  const cloneCount = canLoop ? vis : 0

  return {
    viewportRef,
    offsetX,
    durationSec,
    onTransitionComplete,
    goNext,
    goPrev,
    isMoving,
    canNavigate: n > 1,
    cloneCount,
    position,
  }
}
