export type TourCheckoutSession = {
  tourId: number;
  tourTitle: string;
  scheduleId?: number;
  scheduleCode?: string;
  coverImage?: string;
  adultPrice: number;
  childPrice: number;
  infantPrice: number;
  departureAt?: string;
  primaryDepartureCity?: string;

  // Passenger counts from Booking Panel
  adultCount: number;
  childCount: number;
  infantCount: number;
  seniorCount: number;
  comboId?: number;
};

const STORAGE_KEY = "tour_checkout_session";

export const tourCheckoutStorage = {
  save(data: TourCheckoutSession) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  get(): TourCheckoutSession | null {
    if (typeof window === "undefined") return null;
    const str = sessionStorage.getItem(STORAGE_KEY);
    if (!str) return null;
    try {
      return JSON.parse(str) as TourCheckoutSession;
    } catch {
      return null;
    }
  },
  clear() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(STORAGE_KEY);
  },
};
