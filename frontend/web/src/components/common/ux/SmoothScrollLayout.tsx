import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

type SmoothScrollLayoutProps = {
  children: ReactNode
  ease?: number
}

function SmoothScrollLayout({
  children,
  ease = 0.08,
}: SmoothScrollLayoutProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const current = useRef(0)
  const target = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const content = contentRef.current

    if (!content) {
      return undefined
    }

    const previousHtmlScrollBehavior = html.style.scrollBehavior
    const previousBodyHeight = body.style.height
    const previousBodyOverflow = body.style.overflow
    const previousContentTransform = content.style.transform
    const previousContentWillChange = content.style.willChange

    current.current = window.scrollY
    target.current = window.scrollY

    html.style.scrollBehavior = 'auto'
    body.style.overflow = 'auto'
    content.style.willChange = 'transform'

    const setBodyHeight = () => {
      body.style.height = `${content.scrollHeight}px`
      target.current = window.scrollY
      window.dispatchEvent(new CustomEvent('travelviet:smooth-scroll-refresh'))
    }

    setBodyHeight()

    let resizeObserver: ResizeObserver | null = null

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(setBodyHeight)
      resizeObserver.observe(content)
    } else {
      window.addEventListener('resize', setBodyHeight)
    }

    const handleScroll = () => {
      target.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    const smoothScroll = () => {
      current.current += (target.current - current.current) * ease

      if (Math.abs(target.current - current.current) < 0.05) {
        current.current = target.current
      }

      const y = Math.round(current.current * 100) / 100
      content.style.transform = `translate3d(0, -${y}px, 0)`
      window.dispatchEvent(new CustomEvent('travelviet:smooth-scroll'))
      rafId.current = window.requestAnimationFrame(smoothScroll)
    }

    smoothScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)

      if (resizeObserver) {
        resizeObserver.disconnect()
      } else {
        window.removeEventListener('resize', setBodyHeight)
      }

      if (rafId.current) {
        window.cancelAnimationFrame(rafId.current)
      }

      html.style.scrollBehavior = previousHtmlScrollBehavior
      body.style.height = previousBodyHeight
      body.style.overflow = previousBodyOverflow
      content.style.transform = previousContentTransform
      content.style.willChange = previousContentWillChange
    }
  }, [ease])

  return (
    <div className="fixed inset-0 w-full overflow-hidden">
      <div ref={contentRef} className="will-change-transform">
        {children}
      </div>
    </div>
  )
}

export default SmoothScrollLayout
