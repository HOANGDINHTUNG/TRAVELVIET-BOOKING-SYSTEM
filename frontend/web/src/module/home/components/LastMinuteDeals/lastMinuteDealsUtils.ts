import type { Tour } from '../../database/interface/publicTravel'

/** Số tour flash sale seed trong V7 (HOME_FLASH_SALE). */
export const LAST_MINUTE_DEAL_COUNT = 6

/** URL ảnh thẻ — dùng cover, gallery, hoặc giữ tour (tránh lọc mất thẻ khi chỉ thiếu `image`). */
export function resolveTourCardImage(tour: Tour): string {
  const cover = tour.image?.trim()
  if (cover) return cover
  const fromGallery = tour.mediaGalleryUrls?.find((url) => url?.trim())
  if (fromGallery?.trim()) return fromGallery.trim()
  return ''
}

/** Tour có thể render thẻ (có ảnh hoặc vẫn hiển thị placeholder). */
export function isRenderableDealTour(tour: Tour): boolean {
  return Boolean(tour.id && tour.title?.trim())
}

/** Lấy đủ 6 tour — ưu tiên kệ HOME_FLASH_SALE, rồi biển đảo VN, HOT intl, danh sách chung. */
export function pickLastMinuteDealTours(
  primary: Tour[],
  ...fallbacks: Tour[][]
): Tour[] {
  const seen = new Set<number>()
  const out: Tour[] = []

  const tryPush = (tour: Tour) => {
    if (out.length >= LAST_MINUTE_DEAL_COUNT) return
    if (!isRenderableDealTour(tour) || seen.has(tour.id)) return
    seen.add(tour.id)
    out.push({
      ...tour,
      image: resolveTourCardImage(tour) || tour.image,
    })
  }

  for (const tour of primary) tryPush(tour)
  for (const list of fallbacks) {
    for (const tour of list) tryPush(tour)
  }

  return out
}

export { formatCurrencyVnd as formatDealPriceVnd } from '@/module/management/schedules/utils/currency'

export { resolveListPrice } from '@/module/tours/utils/tourSustainability'

/** Mã tour hiển thị — ưu tiên code BE, fallback sinh theo id. */
export function displayTourCode(tour: Tour): string {
  if (tour.code?.trim()) return tour.code.trim()
  const suffix = String(tour.id).padStart(4, '0')
  return `TVN-${suffix}-VN`
}

/** Ngày khởi hành — từ lịch OPEN gần nhất (API), không bịa số. */
export function displayDepartureDate(tour: Tour): string {
  const raw = tour.nextOpenSchedule?.departureAt
  if (raw) {
    const d = new Date(raw)
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }
  }
  return '—'
}

/** Chỗ còn lại trên lịch gần nhất. */
export function displaySeatsLeft(tour: Tour): number {
  const n = tour.nextOpenSchedule?.remainingSeats
  if (n != null && Number.isFinite(n)) {
    return Math.max(0, Math.floor(n))
  }
  return 0
}

/** Điểm khởi hành hiển thị trên thẻ. */
export function displayDepartureCity(tour: Tour, locationFallback: string): string {
  return tour.primaryDepartureCity?.trim() || locationFallback
}

/** Thời điểm kết thúc ưu đãi — cuối ngày + offset theo tour. */
export function dealEndsAtMs(tourId: number): number {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  end.setMinutes(end.getMinutes() + (tourId % 36) * 17)
  return end.getTime()
}

export function formatCountdown(msLeft: number): { days: number; time: string } {
  const total = Math.max(0, Math.floor(msLeft / 1000))
  const days = Math.floor(total / 86400)
  const h = Math.floor((total % 86400) / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return { days, time: `${pad(h)}:${pad(m)}:${pad(s)}` }
}
