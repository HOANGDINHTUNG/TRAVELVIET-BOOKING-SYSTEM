import type { Tour } from '../../home/database/interface/publicTravel'
import { resolveListPrice } from './tourSustainability'

/** Giá niêm yết catalog — dùng chung logic với flash / sticky card. */
export function resolveCatalogListPrice(tour: Tour): number | null {
  return resolveListPrice(tour)
}

export function formatCatalogDepartureDate(tour: Tour, locale = 'vi-VN'): string {
  const raw = tour.nextOpenSchedule?.departureAt
  if (!raw) return '—'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function catalogRemainingSeats(tour: Tour): number | null {
  const n = tour.nextOpenSchedule?.remainingSeats
  if (n == null || !Number.isFinite(n)) return null
  return Math.max(0, Math.floor(n))
}

export function catalogDepartureCity(tour: Tour, fallback = ''): string {
  return tour.primaryDepartureCity?.trim() || fallback.trim() || '—'
}
