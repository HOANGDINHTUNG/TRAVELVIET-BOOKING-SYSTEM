import { createContext, useContext } from "react";
import type { LenisInstance } from "@/lib/lenis";

export type LenisContextValue = {
  /**
   * Instance Lenis hiện hành. Có thể là `null` trong tích tắc đầu mount
   * hoặc khi người dùng bật `prefers-reduced-motion`.
   */
  lenis: LenisInstance | null;
  /** Bật/tắt smooth scroll thủ công (vd. khi mở Modal/Sheet full-screen). */
  setEnabled: (enabled: boolean) => void;
  enabled: boolean;
};

export const LenisContext = createContext<LenisContextValue | null>(null);

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
  const ctx = useContext(LenisContext);
  if (!ctx) {
    // Không throw để giữ tương thích nếu component dùng ngoài provider
    // (vd. dùng chung component giữa public và management).
    return {
      lenis: null as LenisInstance | null,
      setEnabled: () => {},
      enabled: false,
    };
  }
  return ctx;
}
