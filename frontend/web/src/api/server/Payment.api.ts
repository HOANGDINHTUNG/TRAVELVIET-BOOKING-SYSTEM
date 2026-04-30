import { getBackendData, patchBackendData, postBackendData } from './serverApiClient'

export type CreatePaymentPayload = {
  bookingId: number
  paymentMethod: string
  provider?: string
  transactionRef?: string
  amount: number | string
}

export type Payment = {
  id: number
  paymentCode?: string
  bookingId: number
  amount: number | string
  status?: string
}

export type CreateRefundPayload = {
  bookingId: number
  requestedBy?: string
  reasonType?: string
  reasonDetail?: string
  requestedAmount: number | string
}

export type ApproveRefundPayload = {
  approvedAmount: number | string
}

export type Refund = {
  id: number
  refundCode?: string
  bookingId: number
  status?: string
  requestedAmount?: number | string
}

export const paymentApi = {
  create(payload: CreatePaymentPayload) {
    return postBackendData<Payment>('payments', payload)
  },

  getById(id: number) {
    return getBackendData<Payment>(`payments/${id}`)
  },

  createRefund(payload: CreateRefundPayload) {
    return postBackendData<Refund>('refunds', payload)
  },

  getRefund(id: number) {
    return getBackendData<Refund>(`refunds/${id}`)
  },

  approveRefund(id: number, payload: ApproveRefundPayload) {
    return patchBackendData<Refund>(`refunds/${id}/approve`, payload)
  },
}
