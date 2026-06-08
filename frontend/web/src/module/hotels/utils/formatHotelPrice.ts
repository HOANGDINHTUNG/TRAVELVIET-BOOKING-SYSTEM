/** Định dạng giá VND cho UI khách sạn. */
export function formatHotelPrice(amount: number, locale: string): string {
  const formatted = amount.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')
  return locale === 'vi' ? `${formatted}đ` : `${formatted} VND`
}
