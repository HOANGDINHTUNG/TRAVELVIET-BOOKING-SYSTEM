/**
 * Chuẩn hoá itinerary / checklist / seasonality từ TourResponse (BE còn unknown[]).
 */

export type NormalizedItineraryItem = {
  id: number
  sequenceNo: number
  title: string
  description: string | null
  locationName: string | null
  itemType: string | null
}

export type NormalizedItineraryDay = {
  id: number
  dayNumber: number | null
  title: string | null
  description: string | null
  overnightDestinationId: number | null
  items: NormalizedItineraryItem[]
}

export type NormalizedSeasonality = {
  id: number
  seasonName: string
  monthFrom: number | null
  monthTo: number | null
  recommendationScore: number | null
  notes: string | null
}

export type NormalizedChecklistItem = {
  id: number
  itemName: string
  itemGroup: string | null
  isRequired: boolean
}

export type NormalizedCancellationPolicy = {
  id: number
  name: string
  description: string | null
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return typeof v === 'object' && v !== null ? (v as Record<string, unknown>) : null
}

export function normalizeItineraryItems(input: unknown): NormalizedItineraryItem[] {
  if (!Array.isArray(input)) return []
  return input
    .map((raw) => asRecord(raw))
    .filter((raw): raw is Record<string, unknown> => raw !== null)
    .map((raw) => ({
      id: typeof raw.id === 'number' ? raw.id : Number(raw.id) || 0,
      sequenceNo:
        typeof raw.sequenceNo === 'number' ? raw.sequenceNo : Number(raw.sequenceNo) || 0,
      title: typeof raw.title === 'string' ? raw.title : '—',
      description: typeof raw.description === 'string' ? raw.description : null,
      locationName: typeof raw.locationName === 'string' ? raw.locationName : null,
      itemType: typeof raw.itemType === 'string' ? raw.itemType : null,
    }))
    .sort((a, b) => a.sequenceNo - b.sequenceNo)
}

export function normalizeItineraryDays(input: unknown): NormalizedItineraryDay[] {
  if (!Array.isArray(input)) return []
  return input
    .map((raw) => asRecord(raw))
    .filter((raw): raw is Record<string, unknown> => raw !== null)
    .map((raw) => ({
      id: typeof raw.id === 'number' ? raw.id : Number(raw.id) || 0,
      dayNumber: typeof raw.dayNumber === 'number' ? raw.dayNumber : null,
      title: typeof raw.title === 'string' ? raw.title : null,
      description: typeof raw.description === 'string' ? raw.description : null,
      overnightDestinationId:
        typeof raw.overnightDestinationId === 'number' ? raw.overnightDestinationId : null,
      items: normalizeItineraryItems(raw.items),
    }))
    .sort((a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0))
}

export function normalizeSeasonalityList(input: unknown): NormalizedSeasonality[] {
  if (!Array.isArray(input)) return []
  return input
    .map((raw) => asRecord(raw))
    .filter((raw): raw is Record<string, unknown> => raw !== null)
    .map((raw) => ({
      id: typeof raw.id === 'number' ? raw.id : Number(raw.id) || 0,
      seasonName: typeof raw.seasonName === 'string' ? raw.seasonName : '—',
      monthFrom: typeof raw.monthFrom === 'number' ? raw.monthFrom : null,
      monthTo: typeof raw.monthTo === 'number' ? raw.monthTo : null,
      recommendationScore:
        typeof raw.recommendationScore === 'number' ? raw.recommendationScore : null,
      notes: typeof raw.notes === 'string' ? raw.notes : null,
    }))
}

export function normalizeChecklistItems(input: unknown): NormalizedChecklistItem[] {
  if (!Array.isArray(input)) return []
  return input
    .map((raw) => asRecord(raw))
    .filter((raw): raw is Record<string, unknown> => raw !== null)
    .map((raw) => ({
      id: typeof raw.id === 'number' ? raw.id : Number(raw.id) || 0,
      itemName: typeof raw.itemName === 'string' ? raw.itemName : '—',
      itemGroup: typeof raw.itemGroup === 'string' ? raw.itemGroup : null,
      isRequired: raw.isRequired === true,
    }))
}

export function normalizeCancellationPolicy(
  input: unknown,
): NormalizedCancellationPolicy | null {
  const raw = asRecord(input)
  if (!raw) return null
  const id = typeof raw.id === 'number' ? raw.id : Number(raw.id)
  if (!Number.isFinite(id)) return null
  return {
    id,
    name: typeof raw.name === 'string' ? raw.name : '—',
    description: typeof raw.description === 'string' ? raw.description : null,
  }
}
