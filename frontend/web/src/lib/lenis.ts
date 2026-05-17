import Lenis from 'lenis'

/**
 * Factory tạo instance Lenis chuẩn của TravelViet.
 * Dùng chung 1 cấu hình ở `LenisProvider` và các điểm cần
 * `lenis.scrollTo()` (CTA anchor, command palette result, …).
 *
 * Lưu ý:
 * - `lerp` 0.1 = cảm giác premium, không quá lê.
 * - `wheelMultiplier` 1.0 = giữ tốc độ cuộn tự nhiên của hệ thống.
 * - `smoothWheel` true ở desktop; trên touch, Lenis sẽ tự fallback
 *   sang native scroll (smoothTouch mặc định false trong v1.x).
 */
export function createLenis() {
  return new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false,
    anchors: false,
  })
}

export type LenisInstance = ReturnType<typeof createLenis>
