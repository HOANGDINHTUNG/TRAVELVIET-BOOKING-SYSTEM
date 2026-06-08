/** Cùng logic web PromotionCommercePanel.formatDate */
export function formatDate(value: string | undefined | null) {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date);
}
