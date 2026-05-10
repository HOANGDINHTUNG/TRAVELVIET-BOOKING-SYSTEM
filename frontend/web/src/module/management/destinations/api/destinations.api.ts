import { apiClient } from '../../../../lib/apiClient'
import type { PageResponse } from '../../../../types/api'
import type {
  DestinationLookupItem,
  DestinationSearchParams,
} from '../types/destination'

function toQueryParams(params: DestinationSearchParams): Record<string, string> {
  const output: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    output[key] = String(value)
  }
  return output
}

/**
 * Public destinations search — `GET /destinations`.
 * Dùng cho autocomplete (không yêu cầu permission backoffice).
 */
export const DestinationsApi = {
  async search(
    params: DestinationSearchParams = {},
  ): Promise<PageResponse<DestinationLookupItem>> {
    const merged = { size: 10, ...params }
    const response = await apiClient.get<PageResponse<DestinationLookupItem>>(
      'destinations',
      { params: toQueryParams(merged) },
    )
    return response.data
  },
}
