export type FlightAirlineMeta = {
  id: string;
  name: string;
  shortCode: string;
  brandColor: string;
  logoText: string;
};

export const FLIGHT_AIRLINES: FlightAirlineMeta[] = [
  {
    id: "vietjet",
    name: "VietJet Air",
    shortCode: "VJ",
    brandColor: "#e4002b",
    logoText: "VJ",
  },
  {
    id: "vietravel",
    name: "Vietravel Airlines",
    shortCode: "VU",
    brandColor: "#0066b3",
    logoText: "VU",
  },
  {
    id: "bamboo",
    name: "Bamboo Airways",
    shortCode: "QH",
    brandColor: "#2d8c4e",
    logoText: "QH",
  },
  {
    id: "vietnam",
    name: "Vietnam Airlines",
    shortCode: "VN",
    brandColor: "#006885",
    logoText: "VN",
  },
  {
    id: "sun-phuquoc",
    name: "Sun PhuQuoc Airways",
    shortCode: "9G",
    brandColor: "#f5a623",
    logoText: "9G",
  },
];

export function getAirlineMetaById(id: number): FlightAirlineMeta {
  // Mock hardcode mapping for demo purposes based on ID until BE provides airline details
  const mapping: Record<number, FlightAirlineMeta> = {
    1: FLIGHT_AIRLINES[0], // vietjet
    2: FLIGHT_AIRLINES[3], // vietnam airline
    3: FLIGHT_AIRLINES[2], // bamboo
    4: FLIGHT_AIRLINES[1], // vietravel
  };
  return mapping[id] || FLIGHT_AIRLINES[3];
}

export function cityLabelForIata(
  iata: string | undefined | null,
  locale: string,
): string {
  if (!iata) return "";
  const mapVi: Record<string, string> = {
    SGN: "TP HCM",
    HAN: "Hà Nội",
    DAD: "Đà Nẵng",
    CXR: "Nha Trang",
    PQC: "Phú Quốc",
    DLI: "Đà Lạt",
  };
  const mapEn: Record<string, string> = {
    SGN: "Ho Chi Minh",
    HAN: "Hanoi",
    DAD: "Da Nang",
    CXR: "Nha Trang",
    PQC: "Phu Quoc",
    DLI: "Da Lat",
  };
  const m = locale === "en" ? mapEn : mapVi;
  return m[iata.toUpperCase()] || iata;
}
