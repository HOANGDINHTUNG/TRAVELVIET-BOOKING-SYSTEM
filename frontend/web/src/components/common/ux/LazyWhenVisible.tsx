import { type ReactNode, useEffect, useRef, useState } from 'react'

type LazyWhenVisibleProps = {
  children: ReactNode
  /** Chiều cao placeholder trước khi mount — tránh CLS khi section xuất hiện */
  minHeight?: number
  rootMargin?: string
  className?: string
}

/**
 * Chỉ render children khi gần viewport (below-the-fold, giảm JS/DOM ban đầu).
 */
export function LazyWhenVisible({
  children,
  minHeight = 280,
  rootMargin = '240px 0px',
  className,
}: LazyWhenVisibleProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host || visible) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(host)
    return () => observer.disconnect()
  }, [rootMargin, visible])

  return (
    <div
      ref={hostRef}
      className={className}
      style={visible ? undefined : { minHeight }}
    >
      {visible ? children : null}
    </div>
  )
}
