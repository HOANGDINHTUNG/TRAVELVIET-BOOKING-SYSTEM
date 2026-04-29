import { getBackendData, postBackendData } from './serverApiClient'

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

export const paymentApi = {
  create(payload: CreatePaymentPayload) {
    return postBackendData<Payment>('payments', payload)
  },

  getById(id: number) {
    return getBackendData<Payment>(`payments/${id}`)
  },
}
