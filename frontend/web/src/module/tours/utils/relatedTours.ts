import type { TourResponse } from '../types/publicTour'

export const RELATED_TOURS_LIMIT = 8

export function extractTourTagIdSet(tour: TourResponse): Set<number> {
  return new Set(
    (tour.tags ?? [])
      .map((tag) => tag.id)
      .filter((id): id is number => id != null && id > 0),
  )
}

function tagOverlapCount(candidate: TourResponse, tagIds: Set<number>): number {
  if (tagIds.size === 0) return 0
  return (candidate.tags ?? []).filter(
    (tag) => tag.id != null && tagIds.has(tag.id),
  ).length
}

function tieBreakScore(candidate: TourResponse, current: TourResponse): number {
  let score = 0
  if (
    current.destinationId != null &&
    candidate.destinationId === current.destinationId
  ) {
    score += 100
  }
  if (candidate.isFeatured) score += 10
  score += (candidate.totalBookings ?? 0) * 0.001
  score += candidate.averageRating ?? 0
  return score
}

/**
 * Chọn tour liên quan: ưu tiên nhiều thẻ (tag) trùng nhất → ít hơn.
 * Tie-break: cùng điểm đến, nổi bật, lượt đặt, rating.
 */
export function pickRelatedTours(
  current: TourResponse,
  pool: TourResponse[],
  limit = RELATED_TOURS_LIMIT,
): TourResponse[] {
  const tagIds = extractTourTagIdSet(current)
  const candidates = pool.filter((item) => item.id !== current.id)

  const ranked = candidates
    .map((item) => ({
      tour: item,
      overlap: tagOverlapCount(item, tagIds),
      tie: tieBreakScore(item, current),
    }))
    .sort((left, right) => {
      if (right.overlap !== left.overlap) return right.overlap - left.overlap
      return right.tie - left.tie
    })

  const picked: TourResponse[] = []
  const seen = new Set<number>()

  for (const row of ranked) {
    if (picked.length >= limit) break
    if (seen.has(row.tour.id)) continue
    seen.add(row.tour.id)
    picked.push(row.tour)
  }

  return picked
}
