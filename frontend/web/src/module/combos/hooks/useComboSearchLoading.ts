import { useEffect, useState } from 'react'

const DEFAULT_DURATION_MS = 2800

/**
 * Giả lập tiến trình tìm giá combo (ảnh 1) trước khi hiện kết quả (ảnh 2).
 */
export function useComboSearchLoading(searchKey: string, durationMs = DEFAULT_DURATION_MS) {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setProgress(0)
    setIsLoading(true)
    const started = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = now - started
      const ratio = Math.min(1, elapsed / durationMs)
      const eased = 1 - (1 - ratio) ** 1.4
      const next = Math.min(100, Math.round(eased * 100))
      setProgress(next)
      if (ratio < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setIsLoading(false)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [searchKey, durationMs])

  return { progress, isLoading }
}
