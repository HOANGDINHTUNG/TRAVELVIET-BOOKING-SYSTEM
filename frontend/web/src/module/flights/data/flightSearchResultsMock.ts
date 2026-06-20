export type FlightAirlineId =
  | 'vietjet'
  | 'vietravel'
  | 'bamboo'
  | 'vietnam'
  | 'sun-phuquoc'

export type FlightTimeSlotId = 'early' | 'morning' | 'afternoon' | 'evening'

export type FlightStopType = 'direct' | 'one-stop'

export type MockFlightOffer = {
  id: string
  airlineId: FlightAirlineId
  departTime: string
  arriveTime: string
  durationMinutes: number
  stopType: FlightStopType
  priceVnd: number
  checkedBagKg: number
  carryOnKg: number
  isBestPick?: boolean
  timeSlot: FlightTimeSlotId
}

export type FlightAirlineMeta = {
  id: FlightAirlineId
  name: string
  shortCode: string
  brandColor: string
  logoText: string
}

export const FLIGHT_AIRLINES: FlightAirlineMeta[] = [
  { id: 'vietjet', name: 'VietJet Air', shortCode: 'VJ', brandColor: '#e4002b', logoText: 'VJ' },
  {
    id: 'vietravel',
    name: 'Vietravel Airlines',
    shortCode: 'VU',
    brandColor: '#0066b3',
    logoText: 'VU',
  },
  {
    id: 'bamboo',
    name: 'Bamboo Airways',
    shortCode: 'QH',
    brandColor: '#2d8c4e',
    logoText: 'QH',
  },
  {
    id: 'vietnam',
    name: 'Vietnam Airlines',
    shortCode: 'VN',
    brandColor: '#006885',
    logoText: 'VN',
  },
  {
    id: 'sun-phuquoc',
    name: 'Sun PhuQuoc Airways',
    shortCode: '9G',
    brandColor: '#f5a623',
    logoText: '9G',
  },
]

export const FLIGHT_TIME_SLOTS: { id: FlightTimeSlotId; labelKey: string; rangeKey: string }[] = [
  { id: 'early', labelKey: 'filters.timeEarly', rangeKey: 'filters.timeEarlyRange' },
  { id: 'morning', labelKey: 'filters.timeMorning', rangeKey: 'filters.timeMorningRange' },
  { id: 'afternoon', labelKey: 'filters.timeAfternoon', rangeKey: 'filters.timeAfternoonRange' },
  { id: 'evening', labelKey: 'filters.timeEvening', rangeKey: 'filters.timeEveningRange' },
]

/** Kết quả mock SGN → HAN (khớp ảnh Vietravel). */
export const MOCK_FLIGHT_OFFERS_SGN_HAN: MockFlightOffer[] = [
  {
    id: 'vn-1600',
    airlineId: 'vietnam',
    departTime: '16:00',
    arriveTime: '18:10',
    durationMinutes: 130,
    stopType: 'direct',
    priceVnd: 4036500,
    checkedBagKg: 32,
    carryOnKg: 10,
    isBestPick: true,
    timeSlot: 'afternoon',
  },
  {
    id: 'vn-0600',
    airlineId: 'vietnam',
    departTime: '06:00',
    arriveTime: '08:10',
    durationMinutes: 130,
    stopType: 'direct',
    priceVnd: 4414500,
    checkedBagKg: 32,
    carryOnKg: 10,
    timeSlot: 'morning',
  },
  {
    id: 'vn-0700',
    airlineId: 'vietnam',
    departTime: '07:00',
    arriveTime: '09:10',
    durationMinutes: 130,
    stopType: 'direct',
    priceVnd: 4844500,
    checkedBagKg: 32,
    carryOnKg: 10,
    timeSlot: 'morning',
  },
  {
    id: 'vn-0800',
    airlineId: 'vietnam',
    departTime: '08:00',
    arriveTime: '10:10',
    durationMinutes: 130,
    stopType: 'direct',
    priceVnd: 4414500,
    checkedBagKg: 32,
    carryOnKg: 10,
    timeSlot: 'morning',
  },
  {
    id: 'vn-0900',
    airlineId: 'vietnam',
    departTime: '09:00',
    arriveTime: '11:10',
    durationMinutes: 130,
    stopType: 'direct',
    priceVnd: 4844500,
    checkedBagKg: 32,
    carryOnKg: 10,
    timeSlot: 'morning',
  },
  {
    id: 'vn-1000',
    airlineId: 'vietnam',
    departTime: '10:00',
    arriveTime: '12:10',
    durationMinutes: 130,
    stopType: 'direct',
    priceVnd: 5923500,
    checkedBagKg: 32,
    carryOnKg: 10,
    timeSlot: 'morning',
  },
  {
    id: 'vj-1130',
    airlineId: 'vietjet',
    departTime: '11:30',
    arriveTime: '13:40',
    durationMinutes: 130,
    stopType: 'direct',
    priceVnd: 2300340,
    checkedBagKg: 20,
    carryOnKg: 7,
    timeSlot: 'morning',
  },
  {
    id: 'qh-1420',
    airlineId: 'bamboo',
    departTime: '14:20',
    arriveTime: '16:30',
    durationMinutes: 130,
    stopType: 'direct',
    priceVnd: 2345700,
    checkedBagKg: 23,
    carryOnKg: 7,
    timeSlot: 'afternoon',
  },
  {
    id: 'vu-1835',
    airlineId: 'vietravel',
    departTime: '18:35',
    arriveTime: '20:45',
    durationMinutes: 130,
    stopType: 'one-stop',
    priceVnd: 3189900,
    checkedBagKg: 20,
    carryOnKg: 7,
    timeSlot: 'evening',
  },
]

export const FLIGHT_RESULTS_BANNER_PLANE =
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'

export const MOCK_BUDGET_RANGE = {
  min: 4_001_250,
  max: 5_923_500,
}

export function getAirlineMeta(id: FlightAirlineId): FlightAirlineMeta {
  return FLIGHT_AIRLINES.find((a) => a.id === id) ?? FLIGHT_AIRLINES[3]
}

export function formatDurationVi(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatPriceVnd(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN').format(amount) + '₫'
}

export function getMockOffersForRoute(fromIata: string, toIata: string): MockFlightOffer[] {
  if (fromIata === 'SGN' && toIata === 'HAN') return MOCK_FLIGHT_OFFERS_SGN_HAN
  return MOCK_FLIGHT_OFFERS_SGN_HAN.map((o) => ({
    ...o,
    id: `${fromIata}-${toIata}-${o.id}`,
    priceVnd: o.priceVnd + (fromIata.charCodeAt(0) % 7) * 12_000,
  }))
}

export function cityLabelForIata(iata: string, locale: string): string {
  const mapVi: Record<string, string> = {
    SGN: 'TP HCM',
    HAN: 'Hà Nội',
    DAD: 'Đà Nẵng',
    CXR: 'Nha Trang',
    PQC: 'Phú Quốc',
    BKK: 'Bangkok',
    SIN: 'Singapore',
  }
  const mapEn: Record<string, string> = {
    SGN: 'Ho Chi Minh City',
    HAN: 'Hanoi',
    DAD: 'Da Nang',
    CXR: 'Nha Trang',
    PQC: 'Phu Quoc',
    BKK: 'Bangkok',
    SIN: 'Singapore',
  }
  const map = locale === 'en' ? mapEn : mapVi
  return map[iata] ?? iata
}
