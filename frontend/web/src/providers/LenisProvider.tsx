import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { createLenis, type LenisInstance } from '@/lib/lenis'

gsap.registerPlugin(ScrollTrigger)

type LenisContextValue = {
  /**
   * Instance Lenis hiện hành. Có thể là `null` trong tích tắc đầu mount
   * hoặc khi người dùng bật `prefers-reduced-motion`.
   */
  lenis: LenisInstance | null
  /** Bật/tắt smooth scroll thủ công (vd. khi mở Modal/Sheet full-screen). */
  setEnabled: (enabled: boolean) => void
  enabled: boolean
}

const LenisContext = createContext<LenisContextValue | null>(null)

export type LenisProviderProps = {
  children: ReactNode
  /**
   * Nếu `true` (mặc định) sẽ TỰ ĐỘNG đồng bộ GSAP `ScrollTrigger.update()`
   * theo từng event scroll của Lenis. Tắt khi bạn muốn quản lý thủ công.
   */
  syncScrollTrigger?: boolean
}

/**
 * Provider duy nhất chịu trách nhiệm cuộn mượt cho public site.
 * - Tự honor `prefers-reduced-motion`.
 * - Tự `destroy()` khi unmount để tránh leak listener.
 * - Cung cấp hook `useLenis()` để các điểm khác gọi `scrollTo(target)`.
 *
 * KHÔNG dùng trong `/management` (Admin shell có scroll container riêng).
 */
export function LenisProvider({ children, syncScrollTrigger = true }: LenisProviderProps) {
  const [enabled, setEnabled] = useState(true)
  const lenisRef = useRef<LenisInstance | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const [, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) {
      return undefined
    }

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduce) {
      lenisRef.current = null
      return undefined
    }

    const lenis = createLenis()
    lenisRef.current = lenis
    setReady(true)

    const onScroll = () => {
      if (syncScrollTrigger) {
        ScrollTrigger.update()
      }
    }
    lenis.on('scroll', onScroll)

    const update = (time: number) => {
      lenis.raf(time * 1000)
      rafIdRef.current = window.requestAnimationFrame(loop)
    }
    const loop = (t: number) => update(t)
    rafIdRef.current = window.requestAnimationFrame(loop)

    // GSAP ticker đồng bộ — tránh hai vòng RAF cạnh tranh
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onScroll)
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      lenis.destroy()
      lenisRef.current = null
      setReady(false)
    }
  }, [enabled, syncScrollTrigger])

  const value = useMemo<LenisContextValue>(
    () => ({
      lenis: lenisRef.current,
      setEnabled,
      enabled,
    }),
    [enabled],
  )

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
}

/**
 * Hook tiện ích — đọc instance Lenis hiện hành.
 * Trả về `null` nếu provider không mount hoặc user prefers-reduced-motion.
 *
 * Ví dụ:
 * ```tsx
 * const { lenis } = useLenis()
 * lenis?.scrollTo('#booking-form', { offset: -80, duration: 1.2 })
 * ```
 */
export function useLenis() {
  const ctx = useContext(LenisContext)
  if (!ctx) {
    // Không throw để giữ tương thích nếu component dùng ngoài provider
    // (vd. dùng chung component giữa public và management).
    return { lenis: null as LenisInstance | null, setEnabled: () => {}, enabled: false }
  }
  return ctx
}
