import type { ComboSearchParams } from './comboSearchParams'

const IATA_CITY_VI: Record<string, string> = {
  HAN: 'Hà Nội',
  SGN: 'TP HCM',
  DAD: 'Đà Nẵng',
  CXR: 'Nha Trang',
  PQC: 'Phú Quốc',
  HUI: 'Huế',
  VCA: 'Cần Thơ',
  DLI: 'Đà Lạt',
}

const IATA_CITY_EN: Record<string, string> = {
  HAN: 'Hanoi',
  SGN: 'Ho Chi Minh City',
  DAD: 'Da Nang',
  CXR: 'Nha Trang',
  PQC: 'Phu Quoc',
  HUI: 'Hue',
  VCA: 'Can Tho',
  DLI: 'Da Lat',
}

export function extractIataCode(value: string, fallback: string): string {
  const trimmed = value.trim()
  const paren = trimmed.match(/\(([A-Z]{3})\)\s*$/i)
  if (paren) return paren[1].toUpperCase()
  const leading = trimmed.match(/^([A-Z]{3})\b/i)
  if (leading) return leading[1].toUpperCase()
  if (/^[A-Z]{3}$/i.test(trimmed)) return trimmed.toUpperCase()
  return fallback
}

export function cityNameForIata(iata: string, locale: string): string {
  const map = locale.startsWith('en') ? IATA_CITY_EN : IATA_CITY_VI
  return map[iata] ?? iata
}

export function formatComboSearchDate(iso: string, locale: string): string {
  const d = new Date(`${iso}T12:00:00`)
  if (locale.startsWith('en')) {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d)
  }
  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  return `${day} thg ${month}, ${year}`
}

export function countStayNights(checkIn: string, checkOut: string): number {
  const a = new Date(`${checkIn}T12:00:00`).getTime()
  const b = new Date(`${checkOut}T12:00:00`).getTime()
  return Math.max(1, Math.round((b - a) / 86400000))
}

export type ComboRouteDisplay = {
  fromIata: string
  toIata: string
  fromCity: string
  toCity: string
  routeTitle: string
  breadcrumbRoute: string
  routeCompact: string
}

export function buildComboRouteDisplay(params: ComboSearchParams, locale: string): ComboRouteDisplay {
  const fromIata = extractIataCode(params.from, 'HAN')
  const toIata = extractIataCode(params.to, 'SGN')
  const fromCity = cityNameForIata(fromIata, locale)
  const toCity = cityNameForIata(toIata, locale)

  return {
    fromIata,
    toIata,
    fromCity,
    toCity,
    routeTitle: `${fromCity} (${fromIata}) - ${toCity} (${toIata})`,
    breadcrumbRoute: `${fromIata} - ${toIata}`,
    routeCompact: `${fromIata} (${fromIata})- ${toIata} (${toIata})`,
  }
}

/** Ảnh skyline đêm (tham chiếu banner Vietravel). */
export const COMBO_SEARCH_BANNER_IMAGE =
  'https://images.unsplash.com/photo-1579685232683-326fc01b3170?auto=format&fit=crop&w=1400&q=80'
