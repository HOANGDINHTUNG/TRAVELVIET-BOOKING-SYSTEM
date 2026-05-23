import { VND_PER_USD, type CurrencyMode } from '../constants/preferences'

export { VND_PER_USD }

/** Quy đổi VND → USD, làm tròn 2 chữ số thập phân. */
export function convertVndToUsd(amountVnd: number): number {
  if (!Number.isFinite(amountVnd)) return 0
  return Math.round((amountVnd / VND_PER_USD) * 100) / 100
}

export function formatDisplayMoney(
  amountVnd: number | null | undefined,
  currency: CurrencyMode,
  language: 'vi' | 'en' = 'vi',
): string {
  if (amountVnd == null || Number.isNaN(amountVnd)) return '—'

  if (currency === 'VND') {
    return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amountVnd)
  }

  const usd = convertVndToUsd(amountVnd)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usd)
}

/** Ví dụ quy đổi hiển thị trong panel (vd. 1.000.000 ₫ → 38.02 USD). */
export function formatCurrencyConversionPreview(
  sampleVnd: number,
  currency: CurrencyMode,
): string {
  if (currency === 'VND') {
    return formatDisplayMoney(sampleVnd, 'VND', 'vi')
  }
  return formatDisplayMoney(sampleVnd, 'USD', 'en')
}
