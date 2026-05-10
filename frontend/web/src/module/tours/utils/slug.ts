/**
 * Slug helpers cho URL public.
 *
 * ⚠️ BE GAP: Backend không expose `GET /tours/by-slug/{slug}` — chỉ có
 * `GET /tours/{id}` (Long). FE workaround: encode ID ở **cuối slug** dạng
 * `<slug>-<id>` (pattern phổ biến của Tiki/Booking.com/Lazada). Khi BE bổ sung
 * endpoint by-slug, chỉ cần đổi `extractTourIdFromSlug` để gọi BE thay vì
 * parse local.
 */

/** Build URL slug từ tour: `<slug>-<id>`. */
export function buildTourSlug(
  slug: string | null | undefined,
  id: number,
): string {
  const cleanSlug = (slug ?? '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')
  return cleanSlug ? `${cleanSlug}-${id}` : String(id)
}

/**
 * Trích Long id từ URL slug. Hỗ trợ:
 * - Pure number: "42" → 42
 * - Slug-id: "halong-bay-3-days-42" → 42
 * Trả `null` nếu không parse được.
 */
export function extractTourIdFromSlug(
  param: string | null | undefined,
): number | null {
  if (!param) return null
  const trimmed = param.trim()
  if (/^\d+$/.test(trimmed)) {
    const id = Number(trimmed)
    return Number.isFinite(id) && id > 0 ? id : null
  }
  const match = trimmed.match(/-(\d+)$/)
  if (!match) return null
  const id = Number(match[1])
  return Number.isFinite(id) && id > 0 ? id : null
}
