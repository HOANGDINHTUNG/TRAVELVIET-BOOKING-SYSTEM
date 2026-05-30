export function formatComboPrice(vndAmount: number, language: string): string {
  if (!Number.isFinite(vndAmount)) return ''
  const locale = language === 'en' ? 'en-US' : 'vi-VN'
  return new Intl.NumberFormat(locale).format(vndAmount)
}

