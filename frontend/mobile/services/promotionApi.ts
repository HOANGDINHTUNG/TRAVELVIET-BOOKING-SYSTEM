import { apiRequest } from '@/services/apiClient';
import type { PageResponse } from '@/types/api';
import type { DeskPageParams, PromotionCampaign, Voucher } from '@/types/promotion';

export interface PromotionCampaignRequest {
  code: string;
  name: string;
  description?: string;
  startAt: string;
  endAt: string;
  targetMemberLevel?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  conditionsJson?: any;
  rewardJson?: any;
  isActive?: boolean;
}

export interface VoucherRequest {
  code: string;
  campaignId?: number;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount' | 'gift' | 'cashback';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue: number;
  usageLimitTotal?: number;
  usageLimitPerUser?: number;
  applicableScope: 'all' | 'tour' | 'destination';
  applicableTourId?: number;
  applicableDestinationId?: number;
  applicableMemberLevel?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  startAt: string;
  endAt: string;
  isStackable?: boolean;
  isActive?: boolean;
}

export interface UserVoucherClaim {
  id: number;
  userId: string;
  voucherId: number;
  voucherCode: string;
  claimedAt: string;
  usedAt?: string;
  isUsed: boolean;
  status: 'available' | 'inactive' | 'expired' | 'exhausted_total' | 'used_up';
  voucher?: Voucher;
}

// Vouchers CRUD & Actions
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

export async function fetchVoucher(id: number) {
  return apiRequest<Voucher>(`/vouchers/${id}`);
}

export async function createVoucher(request: VoucherRequest) {
  return apiRequest<Voucher>('/vouchers', {
    method: 'POST',
    body: request,
  });
}

export async function updateVoucher(id: number, request: VoucherRequest) {
  return apiRequest<Voucher>(`/vouchers/${id}`, {
    method: 'PUT',
    body: request,
  });
}

export async function setVoucherActive(id: number, isActive: boolean) {
  return apiRequest<Voucher>(`/vouchers/${id}/status`, {
    method: 'PATCH',
    body: { isActive },
  });
}

export async function fetchMyVouchers() {
  return apiRequest<UserVoucherClaim[]>('/users/me/vouchers');
}

export async function claimVoucher(voucherCode: string) {
  return apiRequest<UserVoucherClaim>('/vouchers/claim', {
    method: 'POST',
    body: { voucherCode },
  });
}

// Promotion Campaigns CRUD
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

export async function fetchCampaign(id: number) {
  return apiRequest<PromotionCampaign>(`/promotion-campaigns/${id}`);
}

export async function createCampaign(request: PromotionCampaignRequest) {
  return apiRequest<PromotionCampaign>('/promotion-campaigns', {
    method: 'POST',
    body: request,
  });
}

export async function updateCampaign(id: number, request: PromotionCampaignRequest) {
  return apiRequest<PromotionCampaign>(`/promotion-campaigns/${id}`, {
    method: 'PUT',
    body: request,
  });
}

export async function setCampaignActive(id: number, isActive: boolean) {
  return apiRequest<PromotionCampaign>(`/promotion-campaigns/${id}/status`, {
    method: 'PATCH',
    body: { isActive },
  });
}
