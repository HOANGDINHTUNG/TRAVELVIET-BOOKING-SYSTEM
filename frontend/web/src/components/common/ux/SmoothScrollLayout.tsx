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

    const applyBodyHeight = () => {
      const h = content.scrollHeight
      body.style.height = `${h}px`
    }

    let resizeDebounce: ReturnType<typeof setTimeout> | null = null

    const scheduleBodyHeight = () => {
      if (resizeDebounce) {
        window.clearTimeout(resizeDebounce)
      }
      resizeDebounce = window.setTimeout(() => {
        resizeDebounce = null
        applyBodyHeight()
      }, 120)
    }

    applyBodyHeight()

    const resizeObserver = new ResizeObserver(() => {
      scheduleBodyHeight()
    })
    resizeObserver.observe(content)
    window.addEventListener('resize', scheduleBodyHeight)

    const handleScroll = () => {
      target.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    html.style.scrollBehavior = 'auto'
    body.style.overflow = 'auto'
    content.style.willChange = 'transform'

    const smoothScroll = () => {
      current.current += (target.current - current.current) * ease

      if (Math.abs(target.current - current.current) < 0.1) {
        current.current = target.current
      }

      const y = Math.round(current.current * 100) / 100
      content.style.transform = `translate3d(0, -${y}px, 0)`
      rafId.current = window.requestAnimationFrame(smoothScroll)
    }

    smoothScroll()

    return () => {
      if (resizeDebounce) {
        window.clearTimeout(resizeDebounce)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', scheduleBodyHeight)
      resizeObserver.disconnect()

      if (rafId.current) {
        window.cancelAnimationFrame(rafId.current)
      }

      body.style.height = ''
      body.style.overflow = ''
      html.style.scrollBehavior = ''
      content.style.transform = ''
      content.style.willChange = ''
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
