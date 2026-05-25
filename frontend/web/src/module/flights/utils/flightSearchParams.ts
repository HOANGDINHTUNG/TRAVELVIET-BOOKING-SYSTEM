export type FlightTripType = 'round-trip' | 'one-way'

export type FlightSearchParams = {
  fromIata: string
  toIata: string
  departDate: string
  returnDate?: string
  tripType: FlightTripType
  adults: number
  children: number
  infants: number
}

export function extractIataFromLabel(value: string, fallback: string): string {
  const trimmed = value.trim()
  const paren = trimmed.match(/\(([A-Z]{3})\)\s*$/i)
  if (paren) return paren[1].toUpperCase()
  const bare = trimmed.match(/\b([A-Z]{3})\b/i)
  if (bare) return bare[1].toUpperCase()
  return fallback.toUpperCase()
}

export function parseFlightSearchParams(search: URLSearchParams): FlightSearchParams {
  const tripRaw = search.get('trip')
  const tripType: FlightTripType = tripRaw === 'one-way' ? 'one-way' : 'round-trip'
  const returnDate = search.get('return') ?? undefined

  return {
    fromIata: (search.get('from') ?? 'SGN').toUpperCase(),
    toIata: (search.get('to') ?? 'HAN').toUpperCase(),
    departDate: search.get('depart') ?? defaultDepartIso(),
    returnDate: tripType === 'round-trip' ? returnDate : undefined,
    tripType,
    adults: Math.max(1, Number(search.get('adults')) || 2),
    children: Math.max(0, Number(search.get('children')) || 0),
    infants: Math.max(0, Number(search.get('infants')) || 0),
  }
}

export function buildFlightSearchQuery(input: FlightSearchParams): string {
  const q = new URLSearchParams({
    from: input.fromIata,
    to: input.toIata,
    depart: input.departDate,
    trip: input.tripType,
    adults: String(input.adults),
    children: String(input.children),
    infants: String(input.infants),
  })
  if (input.tripType === 'round-trip' && input.returnDate) {
    q.set('return', input.returnDate)
  }
  return q.toString()
}

function defaultDepartIso(): string {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
}

export function totalPassengers(p: FlightSearchParams): number {
  return p.adults + p.children + p.infants
}
