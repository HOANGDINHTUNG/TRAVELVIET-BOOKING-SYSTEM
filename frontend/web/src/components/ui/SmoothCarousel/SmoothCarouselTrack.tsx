import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'

import { cn } from '@/lib/utils'

import './SmoothCarousel.css'

type SmoothCarouselTrackProps = {
  viewportRef: RefObject<HTMLDivElement | null>
  offsetX: number
  /** Thời gian (giây); 0 = không animate */
  durationSec: number
  onTransitionComplete?: () => void
  className?: string
  trackClassName?: string
  style?: CSSProperties
  children: ReactNode
}

export function SmoothCarouselTrack({
  viewportRef,
  offsetX,
  durationSec,
  onTransitionComplete,
  className,
  trackClassName,
  style,
  children,
}: SmoothCarouselTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onTransitionComplete)

  onCompleteRef.current = onTransitionComplete

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onEnd = (event: TransitionEvent) => {
      if (event.target !== track || event.propertyName !== 'transform') {
        return
      }
      onCompleteRef.current?.()
    }

    track.addEventListener('transitionend', onEnd)
    return () => track.removeEventListener('transitionend', onEnd)
  }, [])

  const transition =
    durationSec <= 0
      ? 'none'
      : `transform ${durationSec}s cubic-bezier(0.22, 0.85, 0.32, 1)`

  return (
    <div
      ref={viewportRef}
      className={cn('smooth-carousel-viewport', className)}
      style={style}
    >
      <div
        ref={trackRef}
        className={cn('smooth-carousel-track', trackClassName)}
        style={{
          transform: `translate3d(${offsetX}px, 0, 0)`,
          transition,
        }}
      >
        {children}
      </div>
    </div>
  )
}
