import { apiRequest } from "@/services/apiClient";

export interface BookingQuoteRequest {
  tourId: number;
  scheduleId: number;
  adults?: number;
  children?: number;
  infants?: number;
  seniors?: number;
  voucherCode?: string;
  comboId?: number;
  bookingProducts?: any[];
}

export interface BookingQuoteResponse {
  tourId: number;
  scheduleId: number;
  adults: number;
  children: number;
  infants: number;
  seniors: number;
  subtotal: number;
  discount: number;
  taxes: number;
  totalPrice: number;
  voucherCode?: string;
}

export interface CreatePassengerRequest {
  fullName: string;
  dob?: string;
  gender?: string;
  type?: string;
}

export interface CreateBookingRequest {
  userId?: string;
  tourId: number;
  scheduleId: number;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  adults?: number;
  children?: number;
  infants?: number;
  seniors?: number;
  voucherCode?: string;
  comboId?: number;
  bookingSource?: string;
  specialRequests?: string;
  passengers?: CreatePassengerRequest[];
  bookingProducts?: any[];
}

export interface BookingResponse {
  id: number;
  bookingCode: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  createdAt: string;
}

export async function fetchBookingQuote(data: BookingQuoteRequest) {
  return apiRequest<BookingQuoteResponse>("/bookings/quote", {
    method: "POST",
    body: data,
  });
}

export async function createBooking(data: CreateBookingRequest) {
  return apiRequest<BookingResponse>("/bookings", {
    method: "POST",
    body: data,
  });
}

export interface BookingSummaryResponse {
  id: number;
  bookingCode: string;
  tourTitle: string;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  travelDate: string;
}

export async function fetchMyBookings() {
  return apiRequest<BookingSummaryResponse[]>("/bookings/me", {
    method: "GET",
  });
}

export async function cancelBookingApi(id: number | string) {
  return apiRequest<BookingResponse>(`/bookings/${id}/cancel`, {
    method: "PATCH",
  });
}
