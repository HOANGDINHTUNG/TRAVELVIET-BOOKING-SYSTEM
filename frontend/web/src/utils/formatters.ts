export function formatDurationVi(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatPriceVnd(amount: number, locale: string): string {
  return (
    new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN").format(amount) +
    "₫"
  );
}
