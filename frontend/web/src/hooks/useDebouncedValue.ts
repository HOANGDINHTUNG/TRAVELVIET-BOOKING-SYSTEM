import { useEffect, useState } from 'react'

/**
 * Debounce 1 giá trị bất kỳ. Trả `value` sau khi không đổi trong `delayMs` ms.
 *
 * Tuân thủ React Compiler `react-hooks/set-state-in-effect`: setState chỉ
 * được gọi trong **callback** của `setTimeout`, không gọi đồng bộ trong body
 * effect.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebounced(value)
    }, Math.max(0, delayMs))
    return () => window.clearTimeout(handle)
  }, [value, delayMs])
  return debounced
}
