import {
  Activity,
  BarChart3,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  MapPinned,
  Ticket,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { ManagementNavGroup } from './managementNavigation'
import type { ManagementPageId } from './managementNavigation'

export type AdminShellNavItem = {
  id: string
  /** Khóa i18n trong namespace `management`, ví dụ `adminShell.nav.dashboard` */
  labelKey: string
  path: string
  icon: LucideIcon
  /** Khớp mục trong `managementNavigation` để lọc theo quyền */
  pageId: ManagementPageId
}

/**
 * Menu shell Apple-style — tập trung vận hành hằng ngày.
 * Quyền chi tiết vẫn lấy từ `getVisibleManagementGroups`.
 */
export const adminShellNavItems: AdminShellNavItem[] = [
  {
    id: 'overview',
    labelKey: 'adminShell.nav.dashboard',
    path: '/management/dashboard',
    icon: LayoutDashboard,
    pageId: 'dashboard',
  },
  {
    id: 'api-probe',
    labelKey: 'adminShell.nav.apiProbe',
    path: '/management/system-api-probe',
    icon: Activity,
    pageId: 'api-probe',
  },
  {
    id: 'tours',
    labelKey: 'adminShell.nav.tours',
    path: '/management/tours',
    icon: Ticket,
    pageId: 'tours',
  },
  {
    id: 'schedules',
    labelKey: 'adminShell.nav.schedules',
    path: '/management/schedules',
    icon: CalendarDays,
    pageId: 'schedules',
  },
  {
    id: 'bookings',
    labelKey: 'adminShell.nav.bookings',
    path: '/management/bookings',
    icon: ClipboardList,
    pageId: 'bookings',
  },
  {
    id: 'destinations',
    labelKey: 'adminShell.nav.destinations',
    path: '/management/destinations',
    icon: MapPinned,
    pageId: 'destinations',
  },
  {
    id: 'customers',
    labelKey: 'adminShell.nav.customers',
    path: '/management/users',
    icon: Users,
    pageId: 'users',
  },
  {
    id: 'reports',
    labelKey: 'adminShell.nav.reports',
    path: '/management/reports',
    icon: BarChart3,
    pageId: 'reports',
  },
]

export function isAdminShellPathAllowed(
  path: string,
  visibleGroups: ManagementNavGroup[],
): boolean {
  const allowed = new Set(visibleGroups.flatMap((g) => g.items.map((i) => i.path)))
  return allowed.has(path)
}
