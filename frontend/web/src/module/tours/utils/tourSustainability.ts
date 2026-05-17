/** Điểm ESG/LEI và giá niêm yết — chỉ từ BE, không bịa công thức. */

export function resolveEsgScore(tour: { esgScore?: number | null }): number | null {
  if (tour.esgScore != null && Number.isFinite(tour.esgScore)) {
    return Math.round(tour.esgScore)
  }
  return null
}

export function resolveLeiScore(tour: { leiScore?: number | null }): number | null {
  if (tour.leiScore != null && Number.isFinite(tour.leiScore)) {
    return Math.round(tour.leiScore)
  }
  return null
}

export function hasSustainabilityScores(tour: {
  esgScore?: number | null
  leiScore?: number | null
}): boolean {
  return resolveEsgScore(tour) != null || resolveLeiScore(tour) != null
}

/** Giá niêm yết thật — chỉ khi BE có listPrice > giá bán. */
export function resolveListPrice(tour: {
  price?: number
  listPrice?: number | null
  basePrice?: number | null
}): number | null {
  const sale = tour.price ?? tour.basePrice
  const list = tour.listPrice
  if (list == null || sale == null) return null
  const listN = Number(list)
  const saleN = Number(sale)
  if (!Number.isFinite(listN) || !Number.isFinite(saleN) || listN <= saleN) {
    return null
  }
  return listN
}
