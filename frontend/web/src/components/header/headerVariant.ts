/**
 * Trang có hero/banner tối phía dưới header → overlay (nền trong, chữ sáng khi chưa scroll).
 * Trang nền sáng (catalog, chi tiết tour, …) → solid (nền sáng, chữ tối ngay từ đầu).
 */
export type HeaderVariant = 'over-hero' | 'solid'

const UUID_SEGMENT =
  /^\/destinations\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function resolveHeaderVariant(pathname: string): HeaderVariant {
  if (pathname === '/') return 'over-hero'
  if (pathname === '/tours') return 'over-hero'
  if (pathname === '/flights') return 'over-hero'
  if (pathname === '/flights/search') return 'solid'

  if (pathname.startsWith('/tour/')) return 'solid'

  if (pathname === '/destinations' || pathname.startsWith('/destinations/branch/')) {
    return 'solid'
  }
  if (UUID_SEGMENT.test(pathname)) return 'over-hero'

  if (
    pathname === '/support' ||
    pathname === '/passport' ||
    pathname === '/account' ||
    pathname === '/my-bookings' ||
    pathname === '/schedules' ||
    /^\/bookings\//.test(pathname) ||
    /^\/schedules\/.+\/chat$/.test(pathname)
  ) {
    return 'over-hero'
  }

  return 'solid'
}
