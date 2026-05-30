export interface ComboCheckoutSession {
  comboId: string;
  scheduleId?: number;
  comboTitle: string;
  coverImage: string;
  scheduleCode: string;
  adultPrice: number;
  childPrice: number;
  infantPrice: number;
  departureAt?: string;
  primaryDepartureCity?: string;
}

const STORAGE_KEY = "travelviet_combo_checkout";

export const comboCheckoutStorage = {
  save(data: ComboCheckoutSession) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  get(): ComboCheckoutSession | null {
    const data = sessionStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },
  clear() {
    sessionStorage.removeItem(STORAGE_KEY);
  },
};
