import type { Tour } from '../../home/database/interface/publicTravel'
import { resolveEsgScore, resolveLeiScore, resolveListPrice } from './tourSustainability'

export type TourLineFacet = {
  id: string
  label: string
  count: number
}

/** Map facet id (URL) → tag code trong DB (V8 seed). */
export const TOUR_LINE_TAG_CODES: Record<string, string> = {
  tieu_chuan: 'TOUR_LINE_TIEU_CHUAN',
  tiet_kiem: 'TOUR_LINE_TIET_KIEM',
  gia_tot: 'TOUR_LINE_GIA_TOT',
  esg: 'TOUR_LINE_ESG',
  cao_cap: 'TOUR_LINE_CAO_CAP',
}

const HIGH_PRICE_THRESHOLD = 30_000_000
const GOOD_PRICE_DISCOUNT_RATIO = 0.12

const TOUR_LINE_RULES: { id: string; label: string }[] = [
  { id: 'cao_cap', label: 'Cao cấp' },
  { id: 'tieu_chuan', label: 'Tiêu chuẩn' },
  { id: 'tiet_kiem', label: 'Tiết kiệm' },
  { id: 'gia_tot', label: 'Giá tốt' },
  { id: 'esg', label: 'Tour ESG & LEI' },
]

function tourLineHaystack(tour: Tour): string {
  return `${tour.category} ${tour.title}`
}

function isEsgLine(tour: Tour): boolean {
  if (hasTourLineTag(tour, 'esg')) return true
  const esg = resolveEsgScore(tour)
  const lei = resolveLeiScore(tour)
  return esg != null && lei != null && esg >= 80 && lei >= 70
}

function isCaoCapLine(tour: Tour): boolean {
  if (hasTourLineTag(tour, 'cao_cap')) return true
  return tour.price >= HIGH_PRICE_THRESHOLD || /cao cấp|premium|luxury/i.test(tourLineHaystack(tour))
}

function isTieuChuanLine(tour: Tour): boolean {
  return hasTourLineTag(tour, 'tieu_chuan') || /tiêu chuẩn|standard/i.test(tourLineHaystack(tour))
}

function isTietKiemLine(tour: Tour): boolean {
  if (hasTourLineTag(tour, 'tiet_kiem')) return true
  const listPrice = resolveListPrice(tour)
  if (listPrice != null && listPrice > 0) {
    const discountRatio = (listPrice - tour.price) / listPrice
    if (
      Number.isFinite(discountRatio) &&
      discountRatio > 0 &&
      discountRatio < GOOD_PRICE_DISCOUNT_RATIO
    ) {
      return true
    }
  }
  return /tiết kiệm|economy|budget/i.test(tourLineHaystack(tour))
}

function isGiaTotLine(tour: Tour): boolean {
  if (hasTourLineTag(tour, 'gia_tot')) return true
  const listPrice = resolveListPrice(tour)
  if (listPrice == null || listPrice <= 0) return false
  const discountRatio = (listPrice - tour.price) / listPrice
  return Number.isFinite(discountRatio) && discountRatio >= GOOD_PRICE_DISCOUNT_RATIO
}

export function hasTourLineTag(tour: Tour, lineId: string): boolean {
  const code = TOUR_LINE_TAG_CODES[lineId]
  if (!code || !tour.tagCodes?.length) return false
  return tour.tagCodes.includes(code)
}

export function resolveTourLineId(tour: Tour): string {
  if (isCaoCapLine(tour)) return 'cao_cap'
  if (isTieuChuanLine(tour)) return 'tieu_chuan'
  if (isTietKiemLine(tour)) return 'tiet_kiem'
  if (isGiaTotLine(tour)) return 'gia_tot'
  if (isEsgLine(tour)) return 'esg'
  return 'gia_tot'
}

export function buildTourLineFacets(tours: Tour[]): TourLineFacet[] {
  return TOUR_LINE_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    count: tours.filter((tour) => resolveTourLineId(tour) === rule.id).length,
  }))
}

export function tourMatchesLine(tour: Tour, lineId: string): boolean {
  return resolveTourLineId(tour) === lineId
}

export function tourMatchesTransport(tour: Tour, transports: string[]): boolean {
  if (!transports.length) return true
  const hay = `${tour.category} ${tour.highlights.join(' ')} ${tour.tagCodes?.join(' ') ?? ''}`.toLowerCase()
  return transports.some((tr) => {
    if (tr === 'may_bay') {
      return (
        tour.inclusionFlags?.hasFlight === true ||
        /máy bay|flight|air/i.test(hay)
      )
    }
    if (tr === 'xe') {
      return (
        tour.inclusionFlags?.hasTransport === true ||
        /xe|bus|ô tô|oto/i.test(hay)
      )
    }
    return true
  })
}

export function tourMatchesDeparture(tour: Tour, departure: string): boolean {
  if (!departure.trim()) return true
  const q = departure.trim().toLowerCase()
  const hay = [
    tour.primaryDepartureCity,
    tour.location,
    tour.destinationProvince,
    tour.destinationName,
    tour.title,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

export function tourMatchesEsgOnly(tour: Tour, esgOnly: boolean): boolean {
  if (!esgOnly) return true
  if (hasTourLineTag(tour, 'esg')) return true
  const esg = resolveEsgScore(tour)
  return esg != null && esg >= 80
}

export function tourMatchesPrice(
  tour: Tour,
  minPrice?: number,
  maxPrice?: number,
): boolean {
  const price = tour.price
  if (minPrice != null && price < minPrice) return false
  if (maxPrice != null && price > maxPrice) return false
  return true
}

/** Bước slider giá — làm tròn theo khoảng min–max. */
export function priceSliderStep(min: number, max: number): number {
  const span = Math.max(0, max - min)
  if (span <= 500_000) return 50_000
  if (span <= 5_000_000) return 100_000
  if (span <= 20_000_000) return 500_000
  return 1_000_000
}

export function priceBounds(tours: Tour[]): { min: number; max: number } {
  if (!tours.length) return { min: 0, max: 50_000_000 }
  const prices = tours.map((t) => t.price).filter((p) => p > 0)
  if (!prices.length) return { min: 0, max: 50_000_000 }
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

export function sortCatalogTours(
  tours: Tour[],
  sortBy: 'createdAt' | 'basePrice' | 'durationDays' | 'name',
  sortDir: 'asc' | 'desc',
): Tour[] {
  const dir = sortDir === 'asc' ? 1 : -1
  return [...tours].sort((a, b) => {
    if (sortBy === 'basePrice') return (a.price - b.price) * dir
    if (sortBy === 'name') return a.title.localeCompare(b.title, 'vi') * dir
    if (sortBy === 'durationDays') {
      const ad = parseInt(a.days, 10) || 0
      const bd = parseInt(b.days, 10) || 0
      return (ad - bd) * dir
    }
    return (a.id - b.id) * dir
  })
}

/** Chuyển tourLine URL → tagCodes gửi BE. */
export function tourLineIdsToTagCodes(lineIds: string[]): string[] {
  return lineIds
    .map((id) => TOUR_LINE_TAG_CODES[id])
    .filter((code): code is string => Boolean(code))
}
