import { useQuery } from '@tanstack/react-query'
import { ApiClientError } from '../../../../types/api'
import { TagsApi } from '../api/tags.api'
import type { TagOption } from '../types/tag'

export const tagKeys = {
  all: ['management', 'tags'] as const,
  list: () => [...tagKeys.all, 'list'] as const,
}

/**
 * Lấy danh sách tags. Không retry khi 404/4xx (BE chưa có endpoint).
 */
export function useTagsQuery() {
  return useQuery<TagOption[]>({
    queryKey: tagKeys.list(),
    queryFn: () => TagsApi.list(),
    staleTime: 5 * 60_000,
    retry: (failureCount, error) => {
      if (
        error instanceof ApiClientError &&
        error.httpStatus > 0 &&
        error.httpStatus < 500
      ) {
        return false
      }
      return failureCount < 2
    },
  })
}
