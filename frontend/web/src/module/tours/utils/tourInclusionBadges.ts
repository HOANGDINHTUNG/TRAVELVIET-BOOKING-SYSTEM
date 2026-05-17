type InclusionFlagsInput = {
  hasFlight?: boolean | null
  hasHotel?: boolean | null
  hasMeals?: boolean | null
  hasTickets?: boolean | null
  hasGuide?: boolean | null
  hasInsurance?: boolean | null
  hasTransport?: boolean | null
  hotelStars?: number | null
}

/** Nhãn ngắn trên thẻ tour (Vietravel-style). */
export function inclusionBadgeLabels(flags?: InclusionFlagsInput | null): string[] {
  if (!flags) return []

  const labels: string[] = []
  if (flags.hasFlight) labels.push('Máy bay')
  if (flags.hasHotel) {
    labels.push(flags.hotelStars ? `KS ${flags.hotelStars}★` : 'Khách sạn')
  }
  if (flags.hasMeals) labels.push('Ăn uống')
  if (flags.hasGuide) labels.push('HDV')
  if (flags.hasInsurance) labels.push('Bảo hiểm')
  if (flags.hasTickets && labels.length < 4) labels.push('Vé tham quan')
  if (flags.hasTransport && labels.length < 4) labels.push('Xe đưa đón')

  return labels.slice(0, 4)
}
