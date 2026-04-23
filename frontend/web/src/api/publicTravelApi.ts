import type { Destination, Tour } from '../data/travelData'

type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
}

type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

type BackendDestination = {
  uuid: string
  name: string
  province?: string
  region?: string
  shortDescription?: string
  isFeatured?: boolean
  coverImageUrl?: string
}

type BackendTourMedia = {
  mediaType?: string
  mediaUrl?: string
  altText?: string
  sortOrder?: number
  isActive?: boolean
}

type BackendTour = {
  id: number
  name: string
  destinationId?: number
  basePrice?: number | string
  currency?: string
  durationDays?: number
  durationNights?: number
  shortDescription?: string
  description?: string
  transportType?: string
  tripMode?: string
  highlights?: string
  isFeatured?: boolean
  media?: BackendTourMedia[]
}

export type WeatherSeverity = 'info' | 'watch' | 'warning' | 'danger'

export type WeatherForecast = {
  id: number
  destinationId: number
  forecastDate: string
  weatherCode?: string
  summary?: string
  tempMin?: number
  tempMax?: number
  humidityPercent?: number
  windSpeed?: number
  rainProbability?: number
  sourceName?: string
}

export type WeatherAlert = {
  id: number
  destinationId: number
  scheduleId?: number
  severity?: WeatherSeverity
  alertType?: string
  title?: string
  message?: string
  actionAdvice?: string
  validFrom?: string
  validTo?: string
  isActive?: boolean
}

export type CrowdPrediction = {
  id: number
  destinationId: number
  predictionDate: string
  crowdLevel?: string
  predictedVisitors?: number
  confidenceScore?: number
  reasonsJson?: string
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  'http://localhost:8088/api/v1'

const fallbackImages = [
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
]

async function getJson<T>(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok || !payload?.success || payload.data === undefined) {
    throw new Error(payload?.message || `Không thể tải dữ liệu từ ${path}.`)
  }

  return payload.data
}

function toNumber(value: number | string | undefined, fallback = 0) {
  if (value === undefined || value === null || value === '') {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function chooseTourImage(tour: BackendTour, index: number) {
  const image = tour.media
    ?.filter((item) => item.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .find((item) => item.mediaType?.toLowerCase() !== 'video' && item.mediaUrl)

  return image?.mediaUrl ?? fallbackImages[index % fallbackImages.length]
}

function formatDuration(days?: number, nights?: number) {
  if (!days && !nights) {
    return 'Lịch trình linh hoạt'
  }

  if (days && nights !== undefined) {
    return `${days} ngày ${nights} đêm`
  }

  return `${days ?? nights} ngày`
}

function parseHighlights(highlights?: string) {
  if (!highlights) {
    return []
  }

  return highlights
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4)
}

function mapDestination(item: BackendDestination, index: number): Destination {
  return {
    uuid: item.uuid,
    name: item.name,
    province: item.province,
    region: item.region,
    shortDescription: item.shortDescription,
    tours: item.region || item.province || 'Điểm đến',
    image: item.coverImageUrl || fallbackImages[index % fallbackImages.length],
  }
}

function mapTour(item: BackendTour, index: number): Tour {
  return {
    id: item.id,
    title: item.name,
    location: item.transportType || item.tripMode || 'TravelViet',
    category: item.tripMode || 'Tour',
    days: formatDuration(item.durationDays, item.durationNights),
    price: toNumber(item.basePrice),
    rating: item.isFeatured ? 4.9 : 4.7,
    image: chooseTourImage(item, index),
    highlights: parseHighlights(item.highlights),
    description: item.shortDescription || item.description,
    destinationId: item.destinationId,
    currency: item.currency,
  }
}

export async function fetchPublicDestinations() {
  const page = await getJson<PageResponse<BackendDestination>>(
    '/destinations?page=0&size=10&sortBy=name&sortDir=asc',
  )

  return page.content.map(mapDestination)
}

export async function fetchPublicTours() {
  const page = await getJson<PageResponse<BackendTour>>(
    '/tours?page=0&size=6&sortBy=createdAt&sortDir=desc',
  )

  return page.content.map(mapTour)
}

export function fetchDestinationForecasts(destinationUuid: string) {
  return getJson<WeatherForecast[]>(
    `/destinations/${destinationUuid}/weather/forecasts`,
  )
}

export function fetchDestinationAlerts(destinationUuid: string) {
  return getJson<WeatherAlert[]>(`/destinations/${destinationUuid}/weather/alerts`)
}

export function fetchDestinationCrowdPredictions(destinationUuid: string) {
  return getJson<CrowdPrediction[]>(
    `/destinations/${destinationUuid}/weather/crowd-predictions`,
  )
}
