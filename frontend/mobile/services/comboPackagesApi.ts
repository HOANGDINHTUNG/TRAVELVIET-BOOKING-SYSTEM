import { apiRequest } from '@/services/apiClient';
import type { PageResponse } from '@/types/api';
import type { ComboPackage, DeskPageParams } from '@/types/promotion';

export async function fetchComboPackages(params: DeskPageParams = {}) {
  return apiRequest<PageResponse<ComboPackage>>('/combo-packages', {
    query: {
      page: params.page ?? 0,
      size: params.size ?? 12,
      keyword: params.keyword,
      sortBy: params.sortBy ?? 'createdAt',
      sortDir: params.sortDir ?? 'desc',
    },
  });
}

export async function setComboPackageActive(id: number, isActive: boolean) {
  return apiRequest<ComboPackage>(`/combo-packages/${id}/status`, {
    method: 'PATCH',
    body: { isActive },
  });
}
