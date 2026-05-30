/** Cùng logic với web PromotionCommercePanel.formatMoney */
export function formatMoney(value: number | string | undefined | null) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return '—';
  }
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(amount);
}
