export type HotelSearchParams = {
  destination: string
  checkIn: string
  checkOut: string
  rooms: number
  adults: number
  children: number
}

export function parseHotelSearchParams(search: URLSearchParams): HotelSearchParams {
  return {
    destination: search.get('destination')?.trim() || 'Hà Nội',
    checkIn: search.get('checkIn') ?? defaultCheckInIso(),
    checkOut: search.get('checkOut') ?? defaultCheckOutIso(),
    rooms: Math.max(1, Number(search.get('rooms')) || 1),
    adults: Math.max(1, Number(search.get('adults')) || 2),
    children: Math.max(0, Number(search.get('children')) || 0),
  }
}

export function buildHotelSearchQuery(input: HotelSearchParams): string {
  const q = new URLSearchParams({
    destination: input.destination,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    rooms: String(input.rooms),
    adults: String(input.adults),
    children: String(input.children),
  })
  return q.toString()
}

function defaultCheckInIso(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 10)
}

function defaultCheckOutIso(): string {
  const d = new Date()
  d.setDate(d.getDate() + 8)
  return d.toISOString().slice(0, 10)
}

export function totalGuests(p: HotelSearchParams): number {
  return p.adults + p.children
}
