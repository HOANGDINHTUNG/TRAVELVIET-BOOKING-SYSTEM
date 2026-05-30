import type { HotelCheckoutSession } from "../types/hotelCheckout";

const STORAGE_KEY = "hotel_checkout_session";

export function loadHotelCheckoutSession(): HotelCheckoutSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HotelCheckoutSession;
  } catch (e) {
    console.warn("Failed to parse hotel checkout session", e);
    return null;
  }
}

export function saveHotelCheckoutSession(session: HotelCheckoutSession): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error("Failed to save hotel checkout session", e);
  }
}

export function clearHotelCheckoutSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear hotel checkout session", e);
  }
}
