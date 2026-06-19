import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { createLenis, type LenisInstance } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

import { LenisContext, type LenisContextValue } from "./lenis-context";

export type LenisProviderProps = {
  children: ReactNode;
  /**
   * Nếu `true` (mặc định) sẽ TỰ ĐỘNG đồng bộ GSAP `ScrollTrigger.update()`
   * theo từng event scroll của Lenis. Tắt khi bạn muốn quản lý thủ công.
   */
  syncScrollTrigger?: boolean;
};

/**
 * Provider duy nhất chịu trách nhiệm cuộn mượt cho public site.
 * - Tự honor `prefers-reduced-motion`.
 * - Tự `destroy()` khi unmount để tránh leak listener.
 * - Cung cấp hook `useLenis()` để các điểm khác gọi `scrollTo(target)`.
 *
 * KHÔNG dùng trong `/management` (Admin shell có scroll container riêng).
 */
export function LenisProvider({
  children,
  syncScrollTrigger = true,
}: LenisProviderProps) {
  const [enabled, setEnabled] = useState(true);
  const [lenis, setLenis] = useState<LenisInstance | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !enabled) {
      return undefined;
    }

    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduce) {
      // It's already null initially, and if enabled changes we also reset the provider
      return undefined;
    }

    const lenisInstance = createLenis();
    // eslint-disable-next-line
    setLenis(lenisInstance);

    const onScroll = () => {
      if (syncScrollTrigger) {
        ScrollTrigger.update();
      }
    };
    lenisInstance.on("scroll", onScroll);

    const update = (time: number) => {
      lenisInstance.raf(time * 1000);
      rafIdRef.current = window.requestAnimationFrame(loop);
    };
    const loop = (t: number) => update(t);
    rafIdRef.current = window.requestAnimationFrame(loop);

    // GSAP ticker đồng bộ — tránh hai vòng RAF cạnh tranh
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance.off("scroll", onScroll);
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lenisInstance.destroy();
      setLenis(null);
    };
  }, [enabled, syncScrollTrigger]);

  const value = useMemo<LenisContextValue>(
    () => ({
      lenis,
      setEnabled,
      enabled,
    }),
    [lenis, enabled],
  );

  return (
    <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
  );
}
