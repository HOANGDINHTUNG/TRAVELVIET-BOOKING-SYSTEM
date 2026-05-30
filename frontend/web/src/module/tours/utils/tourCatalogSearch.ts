import type { PublicTourSearchParams } from '../../../api/server/Tour.api'
import { tourLineIdsToTagCodes } from './tourCatalogFacets'

export type TourCatalogSortKey =
  | 'createdAt'
  | 'basePrice'
  | 'durationDays'
  | 'name'

export type TourCatalogViewMode = 'grid' | 'list'

export type TourCatalogUiFilters = {
  /** domestic | international | all */
  scope: 'domestic' | 'international' | 'all'
  keyword: string
  departure: string
  destinationLabel: string
  departDate: string
  destinationId?: number
  tagCodes: string[]
  featuredOnly: boolean
  tourLines: string[]
  transportTypes: string[]
  minPrice?: number
  maxPrice?: number
  esgOnly: boolean
  sortBy: TourCatalogSortKey
  sortDir: 'asc' | 'desc'
  view: TourCatalogViewMode
}

const DEFAULT_FILTERS: TourCatalogUiFilters = {
  scope: 'domestic',
  keyword: '',
  departure: '',
  destinationLabel: 'Du lịch trong nước',
  departDate: '',
  tagCodes: [],
  featuredOnly: false,
  tourLines: [],
  transportTypes: [],
  esgOnly: false,
  sortBy: 'createdAt',
  sortDir: 'desc',
  view: 'grid',
}

function readNumberParam(raw: string | null): number | undefined {
  if (!raw?.trim()) return undefined
  const n = Number(raw.replace(/\./g, '').replace(/,/g, ''))
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

export function parseTourCatalogFilters(
  searchParams: URLSearchParams,
): TourCatalogUiFilters {
  const internationalOnly = searchParams.get('internationalOnly') === 'true'
  const domesticOnly = searchParams.get('domesticOnly') === 'true'
  const scope: TourCatalogUiFilters['scope'] = internationalOnly
    ? 'international'
    : domesticOnly
      ? 'domestic'
      : searchParams.toString()
        ? 'all'
        : 'domestic'

  const sortByRaw = searchParams.get('sortBy')?.trim()
  const sortBy: TourCatalogSortKey =
    sortByRaw === 'basePrice' ||
    sortByRaw === 'durationDays' ||
    sortByRaw === 'name' ||
    sortByRaw === 'createdAt'
      ? sortByRaw
      : DEFAULT_FILTERS.sortBy

  const sortDirRaw = searchParams.get('sortDir')?.toLowerCase()
  const sortDir: 'asc' | 'desc' = sortDirRaw === 'asc' ? 'asc' : 'desc'

  const rawDestId = searchParams.get('destinationId')?.trim()
  let destinationId: number | undefined
  if (rawDestId && /^\d+$/.test(rawDestId)) {
    const n = Number(rawDestId)
    if (Number.isFinite(n)) destinationId = n
  }

  return {
    scope,
    keyword: searchParams.get('keyword')?.trim() ?? searchParams.get('query')?.trim() ?? '',
    departure: searchParams.get('departure')?.trim() ?? '',
    destinationLabel:
      searchParams.get('destinationLabel')?.trim() ??
      (scope === 'international' ? 'Du lịch nước ngoài' : 'Du lịch trong nước'),
    departDate: searchParams.get('date')?.trim() ?? '',
    destinationId,
    tagCodes: searchParams
      .getAll('tagCodes')
      .map((c) => c.trim())
      .filter(Boolean),
    featuredOnly: searchParams.get('featuredOnly') === 'true',
    tourLines: searchParams
      .getAll('tourLine')
      .map((c) => c.trim())
      .filter(Boolean),
    transportTypes: searchParams
      .getAll('transport')
      .map((c) => c.trim())
      .filter(Boolean),
    minPrice: readNumberParam(searchParams.get('minPrice')),
    maxPrice: readNumberParam(searchParams.get('maxPrice')),
    esgOnly: searchParams.get('esgOnly') === 'true',
    sortBy,
    sortDir,
    view: searchParams.get('view') === 'list' ? 'list' : 'grid',
  }
}

export function buildTourCatalogUrl(filters: TourCatalogUiFilters): string {
  const usp = new URLSearchParams()
  if (filters.scope === 'domestic') usp.set('domesticOnly', 'true')
  if (filters.scope === 'international') usp.set('internationalOnly', 'true')
  if (filters.keyword) usp.set('keyword', filters.keyword)
  if (filters.departure) usp.set('departure', filters.departure)
  if (filters.destinationLabel) usp.set('destinationLabel', filters.destinationLabel)
  if (filters.departDate) usp.set('date', filters.departDate)
  if (filters.destinationId != null) {
    usp.set('destinationId', String(filters.destinationId))
  }
  for (const code of filters.tagCodes) usp.append('tagCodes', code)
  if (filters.featuredOnly) usp.set('featuredOnly', 'true')
  for (const line of filters.tourLines) usp.append('tourLine', line)
  for (const transport of filters.transportTypes) usp.append('transport', transport)
  if (filters.minPrice != null) usp.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice != null) usp.set('maxPrice', String(filters.maxPrice))
  if (filters.esgOnly) usp.set('esgOnly', 'true')
  if (filters.sortBy !== DEFAULT_FILTERS.sortBy) usp.set('sortBy', filters.sortBy)
  if (filters.sortDir !== DEFAULT_FILTERS.sortDir) usp.set('sortDir', filters.sortDir)
  if (filters.view !== 'grid') usp.set('view', filters.view)
  const qs = usp.toString()
  return qs.length > 0 ? `/tours?${qs}` : '/tours?domesticOnly=true'
}

export function catalogFiltersToServerParams(
  filters: TourCatalogUiFilters,
  paging?: { page?: number; size?: number },
): PublicTourSearchParams {
  const params: PublicTourSearchParams = {
    page: paging?.page ?? 0,
    size: paging?.size ?? 20,
    sortBy: filters.sortBy,
    sortDir: filters.sortDir,
  }
  if (filters.scope === 'domestic') params.domesticOnly = true
  if (filters.scope === 'international') params.internationalOnly = true
  if (filters.keyword) params.keyword = filters.keyword.slice(0, 100)
  if (filters.destinationId != null) params.destinationId = filters.destinationId
  const lineTags = tourLineIdsToTagCodes(filters.tourLines)
  const mergedTags = [...filters.tagCodes, ...lineTags]
  if (mergedTags.length) params.tagCodes = [...new Set(mergedTags)]
  if (filters.featuredOnly) params.featuredOnly = true
  if (filters.esgOnly) params.esgOnly = true
  if (filters.minPrice != null) params.minPrice = filters.minPrice
  if (filters.maxPrice != null) params.maxPrice = filters.maxPrice
  if (filters.transportTypes.length === 1) {
    params.transportType = filters.transportTypes[0]
  }
  return params
}

export function catalogHeroCopy(filters: TourCatalogUiFilters): {
  title: string
  lead: string
} {
  if (filters.scope === 'international') {
    return {
      title: 'DU LỊCH NƯỚC NGOÀI',
      lead: 'Khám phá hành trình quốc tế với đa dạng điểm đến, lịch khởi hành linh hoạt và ưu đãi theo mùa.',
    }
  }
  if (filters.destinationId != null || filters.tagCodes.length > 0) {
    return {
      title: 'KẾT QUẢ TOUR',
      lead: 'Danh sách chương trình tour phù hợp bộ lọc bạn đã chọn.',
    }
  }
  return {
    title: 'DU LỊCH TRONG NƯỚC',
    lead: 'Hệ thống tour trong nước đa dạng: biển đảo, di sản, nghỉ dưỡng — lọc theo ngân sách, phương tiện và dòng tour.',
  }
}

export const catalogDefaultFilters = DEFAULT_FILTERS
