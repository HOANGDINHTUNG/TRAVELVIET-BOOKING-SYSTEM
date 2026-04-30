import type { PageResponse } from '../../types/api'
import {
  getBackendData,
  patchBackendData,
  postBackendData,
  putBackendData,
} from './serverApiClient'

export type PageQuery = {
  page?: number
  size?: number
  keyword?: string
  isActive?: boolean
  sortBy?: string
  sortDir?: 'asc' | 'desc' | string
}

export type VoucherDiscountType =
  | 'percentage'
  | 'fixed_amount'
  | 'gift'
  | 'cashback'
  | string

export type VoucherApplicableScope = 'all' | 'tour' | 'destination' | string

export type Voucher = {
  id: number
  code?: string
  campaignId?: number
  name?: string
  description?: string
  discountType?: VoucherDiscountType
  discountValue?: number | string
  maxDiscountAmount?: number | string
  minOrderValue?: number | string
  usageLimitTotal?: number
  usageLimitPerUser?: number
  usedCount?: number
  applicableScope?: VoucherApplicableScope
  applicableTourId?: number
  applicableDestinationId?: number
  applicableMemberLevel?: string
  startAt?: string
  endAt?: string
  isStackable?: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type VoucherQuery = PageQuery & {
  campaignId?: number
  discountType?: VoucherDiscountType
  applicableScope?: VoucherApplicableScope
  applicableMemberLevel?: string
  activeAt?: string
  startsFrom?: string
  endsTo?: string
}

export type VoucherPayload = {
  code: string
  campaignId?: number
  name: string
  description?: string
  discountType: VoucherDiscountType
  discountValue: number | string
  maxDiscountAmount?: number | string
  minOrderValue: number | string
  usageLimitTotal?: number
  usageLimitPerUser?: number
  applicableScope: VoucherApplicableScope
  applicableTourId?: number
  applicableDestinationId?: number
  applicableMemberLevel?: string
  startAt: string
  endAt: string
  isStackable?: boolean
  isActive?: boolean
}

export type PromotionCampaign = {
  id: number
  code?: string
  name?: string
  description?: string
  startAt?: string
  endAt?: string
  targetMemberLevel?: string
  conditionsJson?: unknown
  rewardJson?: unknown
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type PromotionCampaignQuery = PageQuery & {
  targetMemberLevel?: string
  startsFrom?: string
  endsTo?: string
}

export type PromotionCampaignPayload = {
  code: string
  name: string
  description?: string
  startAt: string
  endAt: string
  targetMemberLevel?: string
  conditionsJson?: unknown
  rewardJson?: unknown
  isActive?: boolean
}

export type ActiveStatusPayload = {
  isActive: boolean
}

export const promotionApi = {
  getVouchers(params: VoucherQuery = {}) {
    return getBackendData<PageResponse<Voucher>>('vouchers', params)
  },

  getVoucher(id: number) {
    return getBackendData<Voucher>(`vouchers/${id}`)
  },

  createVoucher(payload: VoucherPayload) {
    return postBackendData<Voucher>('vouchers', payload)
  },

  updateVoucher(id: number, payload: VoucherPayload) {
    return putBackendData<Voucher>(`vouchers/${id}`, payload)
  },

  updateVoucherStatus(id: number, payload: ActiveStatusPayload) {
    return patchBackendData<Voucher>(`vouchers/${id}/status`, payload)
  },

  getCampaigns(params: PromotionCampaignQuery = {}) {
    return getBackendData<PageResponse<PromotionCampaign>>(
      'promotion-campaigns',
      params,
    )
  },

  getCampaign(id: number) {
    return getBackendData<PromotionCampaign>(`promotion-campaigns/${id}`)
  },

  createCampaign(payload: PromotionCampaignPayload) {
    return postBackendData<PromotionCampaign>('promotion-campaigns', payload)
  },

  updateCampaign(id: number, payload: PromotionCampaignPayload) {
    return putBackendData<PromotionCampaign>(`promotion-campaigns/${id}`, payload)
  },

  updateCampaignStatus(id: number, payload: ActiveStatusPayload) {
    return patchBackendData<PromotionCampaign>(
      `promotion-campaigns/${id}/status`,
      payload,
    )
  },
}
