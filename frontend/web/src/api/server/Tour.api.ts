import type { PageResponse } from '../../types/api'
import type {
  BackendTour,
  Tour,
} from '../../module/home/database/interface/publicTravel'
import { buildAssetUrl } from '../../utils/buildAssetUrl'
import { getBackendData } from './serverApiClient'

const tourFetchSize = 10

function toNumber(value: number | string | undefined, fallback = 0) {
  if (value === undefined || value === null || value === '') {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function formatDuration(days?: number, nights?: number) {
  if (!days && !nights) {
    return 'Lich trinh dang cap nhat'
  }

  if (days && nights !== undefined) {
    return `${days} ngay ${nights} dem`
  }

  return `${days ?? nights} ngay`
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

function chooseTourImage(tour: BackendTour) {
  const image = tour.media
    ?.filter((item) => item.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .find((item) => item.mediaType?.toLowerCase() !== 'video' && item.mediaUrl)

  return buildAssetUrl(image?.mediaUrl)
}

function mapTour(item: BackendTour): Tour {
  return {
    id: item.id,
    title: item.name,
    location: item.transportType || item.tripMode || 'Dang cap nhat',
    category: item.tripMode || 'Tour',
    days: formatDuration(item.durationDays, item.durationNights),
    price: toNumber(item.basePrice),
    image: chooseTourImage(item),
    highlights: parseHighlights(item.highlights),
    description: item.shortDescription || item.description,
    destinationId: item.destinationId,
    currency: item.currency,
  }
}

export const tourApi = {
  async getTours() {
    const page = await getBackendData<PageResponse<BackendTour>>('tours', {
      page: 0,
      size: tourFetchSize,
      sortBy: 'createdAt',
      sortDir: 'desc',
    })

    return page.content.map(mapTour)
  },
}

export const fetchPublicTours = () => tourApi.getTours()
