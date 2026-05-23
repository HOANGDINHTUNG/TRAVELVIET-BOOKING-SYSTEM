import { VND_PER_USD, type CurrencyMode } from '../constants/preferences'

export { VND_PER_USD }

/** BE/Jackson có thể trả số tiền dạng string (BigDecimal). */
export function coerceMoneyAmount(
  value: number | string | null | undefined,
): number | null | undefined {
  if (value == null) return undefined
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

/** Quy đổi VND → USD, làm tròn 2 chữ số thập phân. */
export function convertVndToUsd(amountVnd: number): number {
  if (!Number.isFinite(amountVnd)) return 0
  return Math.round((amountVnd / VND_PER_USD) * 100) / 100
}

export function formatDisplayMoney(
  amountVnd: number | string | null | undefined,
  currency: CurrencyMode,
  language: 'vi' | 'en' = 'vi',
): string {
  const amount = coerceMoneyAmount(amountVnd)
  if (amount == null || Number.isNaN(amount)) return '—'

  if (currency === 'VND') {
    return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const usd = convertVndToUsd(amount)
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
