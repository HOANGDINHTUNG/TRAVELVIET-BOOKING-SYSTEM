import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../../lib/apiClient";
import type { PageResponse } from "../../../../../types/api";

export interface Booking {
  id: number;
  bookingCode: string;
  orderId: number;
  tourId: number;
  scheduleId: number;
  status: string;
  paymentStatus: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  adults: number;
  children: number;
  infants: number;
  seniors: number;
  subtotalAmount: number;
  discountAmount: number;
  voucherDiscountAmount: number;
  loyaltyDiscountAmount: number;
  addonAmount: number;
  taxAmount: number;
  finalAmount: number;
  voucherId?: number;
  comboId?: number;
  currency: string;
  bookingSource: string;
  specialRequests?: string;
  cancelReason?: string;
  cancelledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const BOOKING_QUERY_KEY = ["admin-bookings"];

export const useGetBookings = (page: number, size: number, search?: string) => {
  return useQuery({
    queryKey: [...BOOKING_QUERY_KEY, "list", page, size, search],
    queryFn: async () => {
      const { data } = await apiClient.get<PageResponse<Booking>>(
        "/admin/bookings",
        {
          params: { page, size, keyword: search || undefined },
        },
      );
      return data;
    },
  });
};
