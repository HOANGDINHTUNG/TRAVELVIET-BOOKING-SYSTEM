import {
  BadgePercent,
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileClock,
  KeyRound,
  LifeBuoy,
  MapPinned,
  ReceiptText,
  ShieldCheck,
  Star,
  TicketPercent,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type ManagementPageId =
  | 'dashboard'
  | 'users'
  | 'roles'
  | 'permissions'
  | 'audit-logs'
  | 'destinations'
  | 'tours'
  | 'schedules'
  | 'bookings'
  | 'payments'
  | 'refunds'
  | 'support'
  | 'promotions'
  | 'reviews'
  | 'notifications'
  | 'reports'

export type ManagementNavItem = {
  id: ManagementPageId
  label: string
  description: string
  path: string
  icon: LucideIcon
  requiredPermissions: string[]
  moduleIds: string[]
  endpointIds: string[]
}

export type ManagementNavGroup = {
  id: string
  label: string
  items: ManagementNavItem[]
}

export const managementNavGroups: ManagementNavGroup[] = [
  {
    id: 'overview',
    label: 'Tổng quan',
    items: [
      {
        id: 'dashboard',
        label: 'Bảng điều khiển',
        description: 'Tổng quan quyền, module và kiểm tra nhanh API.',
        path: '/management/dashboard',
        icon: BarChart3,
        requiredPermissions: [],
        moduleIds: [],
        endpointIds: [],
      },
    ],
  },
  {
    id: 'system',
    label: 'Hệ thống',
    items: [
      {
        id: 'users',
        label: 'Người dùng',
        description: 'Tìm kiếm, tạo, cập nhật và khóa tài khoản.',
        path: '/management/users',
        icon: Users,
        requiredPermissions: ['user.view'],
        moduleIds: ['system'],
        endpointIds: ['users-list', 'users-create', 'users-update', 'users-deactivate'],
      },
      {
        id: 'roles',
        label: 'Vai trò',
        description: 'Xem vai trò và chuẩn bị luồng gán quyền.',
        path: '/management/roles',
        icon: KeyRound,
        requiredPermissions: ['user.view', 'role.assign'],
        moduleIds: ['system'],
        endpointIds: ['roles-list', 'roles-create', 'roles-update', 'roles-update-perms'],
      },
      {
        id: 'permissions',
        label: 'Quyền',
        description: 'Tra cứu permission backend đang dùng.',
        path: '/management/permissions',
        icon: ShieldCheck,
        requiredPermissions: ['user.view'],
        moduleIds: ['system'],
        endpointIds: ['permissions-list'],
      },
      {
        id: 'audit-logs',
        label: 'Nhật ký audit',
        description: 'Theo dõi thao tác nhạy cảm trong hệ thống.',
        path: '/management/audit-logs',
        icon: FileClock,
        requiredPermissions: ['audit.view'],
        moduleIds: ['system'],
        endpointIds: ['audit-logs'],
      },
    ],
  },
  {
    id: 'content',
    label: 'Nội dung',
    items: [
      {
        id: 'destinations',
        label: 'Điểm đến',
        description: 'Quản lý điểm đến, đề xuất và dữ liệu thời tiết.',
        path: '/management/destinations',
        icon: MapPinned,
        requiredPermissions: ['destination.view'],
        moduleIds: ['destination'],
        endpointIds: [
          'destination-list',
          'destination-create',
          'destination-update',
          'destination-delete',
          'destination-approve',
          'weather-alert-list',
          'route-estimates-list',
        ],
      },
      {
        id: 'tours',
        label: 'Tour',
        description: 'Quản lý nội dung tour và trạng thái bán.',
        path: '/management/tours',
        icon: TicketPercent,
        requiredPermissions: ['tour.view'],
        moduleIds: ['tour-schedule'],
        endpointIds: ['tour-public-list', 'tour-create', 'tour-update', 'tour-delete'],
      },
      {
        id: 'reviews',
        label: 'Đánh giá',
        description: 'Xem, phản hồi và kiểm duyệt đánh giá.',
        path: '/management/reviews',
        icon: Star,
        requiredPermissions: ['review.view'],
        moduleIds: ['review'],
        endpointIds: ['reviews-detail', 'reviews-reply', 'reviews-moderate'],
      },
    ],
  },
  {
    id: 'operation',
    label: 'Vận hành',
    items: [
      {
        id: 'schedules',
        label: 'Lịch khởi hành',
        description: 'Quản lý lịch tour, chat room và trạng thái lịch.',
        path: '/management/schedules',
        icon: CalendarDays,
        requiredPermissions: ['schedule.view'],
        moduleIds: ['tour-schedule'],
        endpointIds: ['schedule-list', 'schedule-create', 'schedule-status', 'chat-room'],
      },
      {
        id: 'bookings',
        label: 'Booking',
        description: 'Theo dõi booking, tạo hỗ trợ và check-in.',
        path: '/management/bookings',
        icon: ClipboardList,
        requiredPermissions: ['booking.view'],
        moduleIds: ['operation'],
        endpointIds: ['booking-create', 'booking-detail', 'booking-checkin'],
      },
      {
        id: 'payments',
        label: 'Thanh toán',
        description: 'Tra cứu thanh toán và tạo giao dịch khi cần.',
        path: '/management/payments',
        icon: CreditCard,
        requiredPermissions: ['payment.view'],
        moduleIds: ['operation'],
        endpointIds: ['payment-create', 'payment-detail'],
      },
      {
        id: 'refunds',
        label: 'Hoàn tiền',
        description: 'Tiếp nhận, xem và duyệt yêu cầu hoàn tiền.',
        path: '/management/refunds',
        icon: ReceiptText,
        requiredPermissions: ['refund.view'],
        moduleIds: ['operation'],
        endpointIds: ['refund-create', 'refund-detail', 'refund-approve'],
      },
      {
        id: 'support',
        label: 'Hỗ trợ',
        description: 'Quản lý phiên hỗ trợ và phản hồi khách hàng.',
        path: '/management/support',
        icon: LifeBuoy,
        requiredPermissions: ['support.view'],
        moduleIds: ['operation'],
        endpointIds: ['support-sessions', 'support-reply'],
      },
    ],
  },
  {
    id: 'commerce',
    label: 'Kinh doanh',
    items: [
      {
        id: 'promotions',
        label: 'Khuyến mãi',
        description: 'Quản lý voucher, campaign và gói sản phẩm.',
        path: '/management/promotions',
        icon: BadgePercent,
        requiredPermissions: ['voucher.view'],
        moduleIds: ['promotion'],
        endpointIds: ['vouchers-list', 'vouchers-create', 'campaign-list', 'campaign-create'],
      },
      {
        id: 'notifications',
        label: 'Thông báo',
        description: 'Gửi thông báo cho người dùng hoặc broadcast.',
        path: '/management/notifications',
        icon: Bell,
        requiredPermissions: ['notification.send', 'user.update'],
        moduleIds: ['communication'],
        endpointIds: ['notifications-create'],
      },
      {
        id: 'reports',
        label: 'Báo cáo',
        description: 'Khu vực báo cáo vận hành và doanh thu.',
        path: '/management/reports',
        icon: BarChart3,
        requiredPermissions: ['report.view'],
        moduleIds: [],
        endpointIds: [],
      },
    ],
  },
]

export const managementNavItems = managementNavGroups.flatMap((group) => group.items)

export function getManagementNavItem(pageId: string | undefined) {
  return managementNavItems.find((item) => item.id === pageId)
}

export function canAccessManagementItem(
  item: ManagementNavItem,
  permissions: string[],
  isSuperAdmin: boolean,
) {
  return (
    isSuperAdmin ||
    item.requiredPermissions.length === 0 ||
    item.requiredPermissions.some((permission) => permissions.includes(permission))
  )
}

export function getVisibleManagementGroups(permissions: string[], isSuperAdmin: boolean) {
  return managementNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        canAccessManagementItem(item, permissions, isSuperAdmin),
      ),
    }))
    .filter((group) => group.items.length > 0)
}
