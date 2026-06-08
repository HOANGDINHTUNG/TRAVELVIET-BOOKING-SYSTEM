import { apiRequest } from '@/services/apiClient';
import type { PageResponse } from '@/types/api';
import type { DeskPageParams, PromotionCampaign, Voucher } from '@/types/promotion';

export async function fetchVouchers(params: DeskPageParams = {}) {
  return apiRequest<PageResponse<Voucher>>('/vouchers', {
    query: {
      page: params.page ?? 0,
      size: params.size ?? 12,
      keyword: params.keyword,
      sortBy: params.sortBy ?? 'createdAt',
      sortDir: params.sortDir ?? 'desc',
    },
  });
}

export async function setVoucherActive(id: number, isActive: boolean) {
  return apiRequest<Voucher>(`/vouchers/${id}/status`, {
    method: 'PATCH',
    body: { isActive },
  });
}

export async function fetchCampaigns(params: DeskPageParams = {}) {
  return apiRequest<PageResponse<PromotionCampaign>>('/promotion-campaigns', {
    query: {
      page: params.page ?? 0,
      size: params.size ?? 12,
      keyword: params.keyword,
      sortBy: params.sortBy ?? 'createdAt',
      sortDir: params.sortDir ?? 'desc',
    },
  });
}

export async function setCampaignActive(id: number, isActive: boolean) {
  return apiRequest<PromotionCampaign>(`/promotion-campaigns/${id}/status`, {
    method: 'PATCH',
    body: { isActive },
  });
}
