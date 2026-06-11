import { coerceMoneyAmount, formatDisplayMoney } from '@/lib/currencyDisplay'
import { store } from '@/stores'

const PLAIN = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
})

/**
 * Hiển thị số tiền (BE lưu VND). Theo preferences: VND hoặc USD ($, ÷ 26.300).
 */
export function formatCurrencyVnd(
  value: number | string | null | undefined,
): string {
  const amount = coerceMoneyAmount(value)
  if (amount == null || Number.isNaN(amount)) return '—'
  const { currency, language } = store.getState().preferences
  return formatDisplayMoney(amount, currency, language)
}

export function formatNumberVi(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return PLAIN.format(value)
}

/**
 * Format một datetime ISO string (`2025-12-31T08:00:00`) sang tiếng Việt
 * dạng `08:00 31/12/2025`. Trả `'—'` nếu null/undefined/invalid.
 */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = String(date.getFullYear())
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${min} ${dd}/${mm}/${yyyy}`
}

/**
 * Convert `Date` → string `YYYY-MM-DDTHH:mm` cho input `datetime-local`.
 * Convert `string ISO` → cùng format.
 */
export function toDatetimeLocalValue(
  value: string | Date | null | undefined,
): string {
  if (value == null) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

/**
 * Convert input `datetime-local` (`YYYY-MM-DDTHH:mm`) → ISO `LocalDateTime`
 * theo định dạng BE Spring expect (`YYYY-MM-DDTHH:mm:ss`). Trả `''` nếu invalid.
 */
export function fromDatetimeLocalValue(value: string): string {
  if (!value) return ''
  // Append seconds for Spring `LocalDateTime` parser.
  return value.length === 16 ? `${value}:00` : value
}
