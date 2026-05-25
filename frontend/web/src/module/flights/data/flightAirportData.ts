export type FlightAirportOption = {
  city: string
  airportName: string
  iata: string
}

/** Dữ liệu mock — thay bằng API gợi ý sân bay khi có BE. */
export const FLIGHT_AIRPORT_OPTIONS: FlightAirportOption[] = [
  { city: 'Hà Nội', airportName: 'Sân bay Quốc tế Nội Bài', iata: 'HAN' },
  { city: 'TP. Hồ Chí Minh', airportName: 'Sân bay Quốc tế Tân Sơn Nhất', iata: 'SGN' },
  { city: 'Đà Nẵng', airportName: 'Sân bay Quốc tế Đà Nẵng', iata: 'DAD' },
  { city: 'Nha Trang', airportName: 'Sân bay Cam Ranh', iata: 'CXR' },
  { city: 'Phú Quốc', airportName: 'Sân bay Quốc tế Phú Quốc', iata: 'PQC' },
  { city: 'Huế', airportName: 'Sân bay Phú Bài', iata: 'HUI' },
  { city: 'Cần Thơ', airportName: 'Sân bay Quốc tế Cần Thơ', iata: 'VCA' },
  { city: 'Thanh Hoá', airportName: 'Sân bay Thọ Xuân', iata: 'THD' },
  { city: 'Vinh', airportName: 'Sân bay Vinh', iata: 'VII' },
  { city: 'Pleiku', airportName: 'Sân bay Pleiku', iata: 'PXU' },
  { city: 'Bangkok', airportName: 'Sân bay Suvarnabhumi', iata: 'BKK' },
  { city: 'Singapore', airportName: 'Sân bay Changi', iata: 'SIN' },
  { city: 'Seoul', airportName: 'Sân bay Incheon', iata: 'ICN' },
  { city: 'Tokyo', airportName: 'Sân bay Narita', iata: 'NRT' },
  { city: 'Taipei', airportName: 'Sân bay Taoyuan', iata: 'TPE' },
  { city: 'Kuala Lumpur', airportName: 'Sân bay KLIA', iata: 'KUL' },
  { city: 'Hong Kong', airportName: 'Sân bay Quốc tế Hong Kong', iata: 'HKG' },
  { city: 'Djibouti', airportName: 'Sân bay quốc tế Djibouti Ambouli', iata: 'JIB' },
  { city: 'Ambouli', airportName: 'Sân bay quốc tế Djibouti Ambouli', iata: 'JIB' },
  { city: 'Paris', airportName: 'Sân bay Charles de Gaulle', iata: 'CDG' },
  { city: 'London', airportName: 'Sân bay Heathrow', iata: 'LHR' },
]

/** Gợi ý mặc định khi focus chưa gõ (thứ tự ưu tiên VN + hub quốc tế). */
const DEFAULT_SUGGESTION_IATAS = [
  'SGN',
  'HAN',
  'DAD',
  'CXR',
  'BKK',
  'SIN',
  'ICN',
  'TPE',
] as const

export function filterFlightAirports(query: string, limit = 8): FlightAirportOption[] {
  const q = query.trim().toLowerCase()

  if (!q) {
    const byIata = new Map(FLIGHT_AIRPORT_OPTIONS.map((o) => [o.iata, o]))
    const defaults = DEFAULT_SUGGESTION_IATAS.map((code) => byIata.get(code)).filter(
      (o): o is FlightAirportOption => Boolean(o),
    )
    return defaults.length > 0 ? defaults : FLIGHT_AIRPORT_OPTIONS.slice(0, limit)
  }

  return FLIGHT_AIRPORT_OPTIONS.filter((opt) => {
    const hay = `${opt.city} ${opt.airportName} ${opt.iata}`.toLowerCase()
    return hay.includes(q)
  }).slice(0, limit)
}

export function formatAirportLabel(opt: FlightAirportOption): string {
  return `${opt.city} (${opt.iata})`
}
