import { Activity, PlusCircle, Ticket, ClipboardList } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AdminPaletteAction = {
  id: string
  labelKey: string
  /** Từ khóa gõ tắt (đã lowercase) */
  keywords: string[]
  icon: LucideIcon
  path: string
  /** Query bổ sung khi điều hướng (vd mở form tạo tour) */
  search?: string
}

export const adminPaletteActions: AdminPaletteAction[] = [
  {
    id: 'api-probe',
    labelKey: 'adminShell.paletteAction.openApiProbe',
    keywords: ['api', 'health', 'ping', 'probe', 'test', 'ket noi', 'kết nối', 'he thong', 'hệ thống'],
    icon: Activity,
    path: '/management/system-api-probe',
  },
  {
    id: 'create-tour',
    labelKey: 'adminShell.paletteAction.createTour',
    keywords: ['tao', 'tạo', 'tour', 'new', 'create', 'them', 'thêm'],
    icon: PlusCircle,
    path: '/management/tours',
    search: 'create=1',
  },
  {
    id: 'open-bookings',
    labelKey: 'adminShell.paletteAction.openBookings',
    keywords: ['don', 'đơn', 'booking', 'dat', 'đặt'],
    icon: ClipboardList,
    path: '/management/bookings',
  },
  {
    id: 'open-tours',
    labelKey: 'adminShell.paletteAction.openTours',
    keywords: ['tours', 'danh sach', 'danh sách'],
    icon: Ticket,
    path: '/management/tours',
  },
]
