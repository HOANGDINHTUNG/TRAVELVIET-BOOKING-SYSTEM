import { getBackendData, postBackendData } from './serverApiClient'

export type ClaimedVoucher = {
  id: number
  voucherId?: number
  voucherCode?: string
  code?: string
  name?: string
  description?: string
  discountType?: string
  discountValue?: number | string
  maxDiscountAmount?: number | string
  minOrderValue?: number | string
  usedCount?: number
  usageLimit?: number
  startAt?: string
  endAt?: string
  isActive?: boolean
}

export type ClaimVoucherPayload = {
  voucherCode: string
}

export const voucherApi = {
  getMyVouchers() {
    return getBackendData<ClaimedVoucher[]>('users/me/vouchers')
  },

  claim(payload: ClaimVoucherPayload) {
    return postBackendData<ClaimedVoucher>('vouchers/claim', payload)
  },
}
