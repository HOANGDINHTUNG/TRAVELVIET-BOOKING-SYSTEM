import { useMemo } from 'react'

import type { TourResponse, TourSearchParams } from '../types/publicTour'
import { pickRelatedTours, RELATED_TOURS_LIMIT } from '../utils/relatedTours'
import { useTourListQuery } from './usePublicTours'

function buildRelatedPoolParams(tour: TourResponse): TourSearchParams {
  const country = (tour.destinationCountryCode ?? '').trim().toUpperCase()
  const base: TourSearchParams = {
    page: 0,
    size: 100,
    sortBy: 'totalBookings',
    sortDir: 'desc',
  }

  if (country === 'VN') {
    return { ...base, domesticOnly: true }
  }
  if (country) {
    return { ...base, internationalOnly: true }
  }
  return base
}

export function useRelatedTours(tour: TourResponse | undefined) {
  const poolParams = useMemo(
    () => (tour ? buildRelatedPoolParams(tour) : null),
    [tour],
  )

  const query = useTourListQuery(poolParams ?? {}, {
    enabled: tour != null && poolParams != null,
    staleTime: 2 * 60_000,
  })

  const relatedTours = useMemo(() => {
    if (!tour || !query.data?.content?.length) return []
    return pickRelatedTours(tour, query.data.content, RELATED_TOURS_LIMIT)
  }, [query.data?.content, tour])

  return {
    relatedTours,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  }
}
