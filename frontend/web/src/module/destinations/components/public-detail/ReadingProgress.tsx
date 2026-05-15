import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [p, setP] = useState(0)

  useEffect(() => {
    let frame = 0

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const doc = document.documentElement
        const max = Math.max(1, doc.scrollHeight - doc.clientHeight)
        setP(Math.min(1, Math.max(0, scrollTop / max)))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-slate-200/80"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left rounded-r-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-transform duration-150 ease-out will-change-transform"
        style={{ transform: `scaleX(${p})` }}
      />
    </div>
  )
}
