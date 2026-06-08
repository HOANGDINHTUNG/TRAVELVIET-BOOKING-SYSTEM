export interface HotelCheckoutSession {
  hotel: {
    id: number;
    name: string;
    address: string;
    starRating: number;
    score: number;
  };
  room: {
    id: number;
    name: string;
    imageUrl: string;
  };
  ratePlan: {
    planId: string;
    title: string;
    priceVnd: number;
    isRefundable: boolean;
    isBreakfastIncluded: boolean;
  };
  checkInDate: string; // ISO yyyy-mm-dd
  checkOutDate: string; // ISO yyyy-mm-dd
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
  totalAmountVnd: number;
  taxAmountVnd: number;
  feeAmountVnd: number;
  holdExpiresAtMs: number;
}
