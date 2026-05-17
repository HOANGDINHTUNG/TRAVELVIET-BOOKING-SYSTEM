import type { TourResponse } from '../types/publicTour'
import { normalizeItineraryDays } from '../components/public-detail/tourPublicDetailNormalize'

export type TourRouteStop = {
  label: string
  /** Anchor trong trang chi tiết */
  anchorId: string
}

export type TourBreadcrumbItem = {
  label: string
  href?: string
}

/** Cấu trúc breadcrumb kiểu Vietravel: … mở dropdown điểm trên hành trình */
export type TourBreadcrumbTrail = {
  prefix: TourBreadcrumbItem[]
  /** Các điểm ẩn sau nút … — chỉ hiện khi bấm */
  collapsedStops: TourRouteStop[]
  /** Điểm đích gần cuối (vd: Quảng Ninh) */
  suffix: TourBreadcrumbItem | null
  currentTitle: string
}

function slugifyAnchor(label: string) {
  return (
    'stop-' +
    label
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  )
}

function splitTitleSegments(title: string): string[] {
  return title
    .split(/\s*[-–—|]\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2 && s.length <= 80)
}

/** Gợi ý miền từ tỉnh — chỉ để hiển thị breadcrumb khi BE chưa có region */
function regionLabelForProvince(province?: string | null): string | null {
  if (!province?.trim()) return null
  const key = province.trim()
  const map: Record<string, string> = {
    'Quảng Ninh': 'Miền Bắc',
    'Hà Nội': 'Miền Bắc',
    'Lào Cai': 'Miền Bắc',
    'Ninh Bình': 'Miền Bắc',
    'Đà Nẵng': 'Miền Trung',
    'Huế': 'Miền Trung',
    'Khánh Hòa': 'Miền Nam',
    'TP. Hồ Chí Minh': 'Miền Nam',
    'Phú Quốc': 'Miền Nam',
  }
  return map[key] ?? null
}

/**
 * Điểm dừng trên hành trình — ưu tiên itinerary, fallback tách tiêu đề tour.
 */
export function extractTourRouteStops(
  tour: Pick<TourResponse, 'name' | 'itineraryDays'>,
): TourRouteStop[] {
  const seen = new Set<string>()
  const out: TourRouteStop[] = []

  const push = (raw: string) => {
    const label = raw.trim()
    if (!label) return
    const key = label.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push({ label, anchorId: slugifyAnchor(label) })
  }

  const days = normalizeItineraryDays(tour.itineraryDays)
  for (const day of days) {
    for (const item of day.items) {
      if (item.locationName) push(item.locationName)
    }
  }

  if (out.length === 0 && tour.name) {
    for (const segment of splitTitleSegments(tour.name)) {
      const short = segment.split(/\s+/).slice(0, 3).join(' ')
      if (/hạ long|ha long/i.test(segment)) push('Hạ Long')
      else if (/hà nội|ha noi/i.test(segment)) push('Hà Nội')
      else if (/ninh bình/i.test(segment)) push('Ninh Bình')
      else if (short.length <= 24) push(short)
    }
  }

  return out.slice(0, 8)
}

export function buildTourBreadcrumbTrail(
  tour: Pick<
    TourResponse,
    'name' | 'destinationCountryCode' | 'destinationName' | 'destinationProvince'
  >,
  routeStops: TourRouteStop[],
): TourBreadcrumbTrail {
  const isDomestic =
    !tour.destinationCountryCode || tour.destinationCountryCode.toUpperCase() === 'VN'

  const prefix: TourBreadcrumbItem[] = [
    { label: 'Du lịch', href: '/tours?domesticOnly=true' },
    {
      label: isDomestic ? 'Trong nước' : 'Nước ngoài',
      href: isDomestic
        ? '/tours?domesticOnly=true'
        : '/tours?internationalOnly=true',
    },
  ]

  const province = tour.destinationProvince?.trim()
  const region =
    regionLabelForProvince(province) ||
    (tour.destinationName?.trim() &&
    tour.destinationName !== province
      ? tour.destinationName.trim()
      : null)

  if (region) {
    prefix.push({
      label: region,
      href: `/tours?domesticOnly=true&keyword=${encodeURIComponent(region)}`,
    })
  }

  const collapsedStops = routeStops.filter((stop) => {
    if (!province) return true
    return stop.label.toLowerCase() !== province.toLowerCase()
  })

  let suffix: TourBreadcrumbItem | null = null
  if (province) {
    suffix = {
      label: province,
      href: `/tours?domesticOnly=true&keyword=${encodeURIComponent(province)}`,
    }
  }

  return {
    prefix,
    collapsedStops,
    suffix,
    currentTitle: tour.name?.trim() || '—',
  }
}

/** @deprecated Dùng buildTourBreadcrumbTrail */
export function buildTourDetailBreadcrumbs(
  tour: Pick<
    TourResponse,
    'name' | 'destinationCountryCode' | 'destinationName' | 'destinationProvince'
  >,
  routeStops: TourRouteStop[],
): TourBreadcrumbItem[] {
  const trail = buildTourBreadcrumbTrail(tour, routeStops)
  return [
    ...trail.prefix,
    ...(trail.collapsedStops.length ? [{ label: '…' }] : []),
    ...(trail.suffix ? [trail.suffix] : []),
    { label: trail.currentTitle },
  ]
}

