import { useEffect, useRef, useState } from 'react'

type Options = {
  /** Số phần tử render ngay sau khi danh sách đổi */
  initial?: number
  /** Mỗi lần sentinel vào viewport thêm bao nhiêu */
  step?: number
  rootMargin?: string
}

/**
 * Chỉ mount DOM cho N phần tử đầu; tải thêm khi cuộn gần cuối (giảm DOM/CPU lúc mở trang).
 */
export function useProgressiveList<T>(
  items: T[],
  { initial = 12, step = 12, rootMargin = '320px' }: Options = {},
) {
  const [visibleCount, setVisibleCount] = useState(initial)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setVisibleCount(Math.min(initial, items.length))
  }, [items, initial])

  useEffect(() => {
    if (visibleCount >= items.length) return undefined

    const sentinel = sentinelRef.current
    if (!sentinel) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setVisibleCount((prev) => Math.min(prev + step, items.length))
      },
      { rootMargin },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [items.length, rootMargin, step, visibleCount])

  return {
    visibleItems: items.slice(0, visibleCount),
    sentinelRef,
    hasMore: visibleCount < items.length,
  }
}
