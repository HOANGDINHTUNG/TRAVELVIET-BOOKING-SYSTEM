import { useEffect, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { DestinationsApi } from '../api/destinations.api'

const DEBOUNCE_MS = 300

export const destinationLookupKeys = {
  all: ['public', 'destinations', 'lookup'] as const,
  list: (keyword: string, size: number) =>
    [...destinationLookupKeys.all, { keyword, size }] as const,
}

/**
 * Tìm kiếm điểm đến cho autocomplete (debounce 300ms).
 * - `enabled` chỉ true khi keyword ≥ 1 ký tự.
 * - `keepPreviousData` giúp combobox không "nhảy" khi keyword đổi.
 */
export function useDestinationSearch(keyword: string, size = 10) {
  const [debounced, setDebounced] = useState(keyword)

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(keyword), DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
  }, [keyword])

  const trimmed = debounced.trim()

  return useQuery({
    queryKey: destinationLookupKeys.list(trimmed, size),
    queryFn: () =>
      DestinationsApi.search({ keyword: trimmed || undefined, size }),
    enabled: trimmed.length >= 1,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
}
