import type { ManagerRoleCode } from '../../auth/api/authApi'
import { managerRoleHasPermission } from './managementRoles'

export type EndpointMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ManagementEndpoint = {
  id: string
  method: EndpointMethod
  path: string
  controller: string
  permission?: string
  note?: string
}

export type ManagementModule = {
  id: string
  title: string
  description: string
  endpoints: ManagementEndpoint[]
}

export const managementModules: ManagementModule[] = [
  {
    id: 'system',
    title: 'Hệ thống & phân quyền',
    description: 'Quản lý người dùng, vai trò, quyền và nhật ký audit.',
    endpoints: [
      {
        id: 'users-list',
        method: 'GET',
        path: '/users?page=0&size=10',
        controller: 'AdminUserController',
        permission: 'user.view',
      },
      {
        id: 'users-create',
        method: 'POST',
        path: '/users',
        controller: 'AdminUserController',
        permission: 'user.create',
      },
      {
        id: 'users-update',
        method: 'PUT',
        path: '/users/{id}',
        controller: 'AdminUserController',
        permission: 'user.update',
      },
      {
        id: 'users-deactivate',
        method: 'PATCH',
        path: '/users/{id}/deactivate',
        controller: 'AdminUserController',
        permission: 'user.block',
      },
      {
        id: 'roles-list',
        method: 'GET',
        path: '/roles',
        controller: 'AdminRbacController',
        permission: 'user.view',
      },
      {
        id: 'roles-create',
        method: 'POST',
        path: '/roles',
        controller: 'AdminRbacController',
        permission: 'role.assign',
      },
      {
        id: 'roles-update',
        method: 'PUT',
        path: '/roles/{id}',
        controller: 'AdminRbacController',
        permission: 'role.assign',
      },
      {
        id: 'permissions-list',
        method: 'GET',
        path: '/permissions',
        controller: 'AdminRbacController',
        permission: 'user.view',
      },
      {
        id: 'roles-update-perms',
        method: 'PATCH',
        path: '/roles/{id}/permissions',
        controller: 'AdminRbacController',
        permission: 'role.assign',
      },
      {
        id: 'audit-logs',
        method: 'GET',
        path: '/audit-logs?page=0&size=20',
        controller: 'AdminAuditLogController',
        permission: 'audit.view',
      },
    ],
  },
  {
    id: 'destination',
    title: 'Điểm đến & thời tiết',
    description: 'Quản lý điểm đến, duyệt đề xuất và thông tin thời tiết.',
    endpoints: [
      {
        id: 'destination-list',
        method: 'GET',
        path: '/admin/destinations?page=0&size=10',
        controller: 'AdminDestinationController',
        permission: 'destination.view',
      },
      {
        id: 'destination-create',
        method: 'POST',
        path: '/admin/destinations',
        controller: 'AdminDestinationController',
        permission: 'destination.create',
      },
      {
        id: 'destination-update',
        method: 'PUT',
        path: '/admin/destinations/{uuid}',
        controller: 'AdminDestinationController',
        permission: 'destination.update',
      },
      {
        id: 'destination-delete',
        method: 'DELETE',
        path: '/admin/destinations/{uuid}',
        controller: 'AdminDestinationController',
        permission: 'destination.delete',
      },
      {
        id: 'destination-approve',
        method: 'PATCH',
        path: '/admin/destinations/{uuid}/approve',
        controller: 'AdminDestinationController',
        permission: 'destination.review',
      },
      {
        id: 'weather-alert-list',
        method: 'GET',
        path: '/admin/destinations/{destinationUuid}/weather/alerts',
        controller: 'AdminWeatherController',
        permission: 'destination.view',
      },
      {
        id: 'route-estimates-list',
        method: 'GET',
        path: '/admin/route-estimates',
        controller: 'AdminRouteEstimateController',
        permission: 'destination.view',
      },
    ],
  },
  {
    id: 'tour-schedule',
    title: 'Tour & lịch khởi hành',
    description: 'Quản lý tour, lịch khởi hành và phòng chat theo lịch.',
    endpoints: [
      {
        id: 'tour-public-list',
        method: 'GET',
        path: '/tours?page=0&size=10',
        controller: 'TourController',
        permission: 'tour.view',
        note: 'API public hiện đang được dùng để liệt kê tour.',
      },
      {
        id: 'tour-create',
        method: 'POST',
        path: '/admin/tours',
        controller: 'AdminTourController',
        permission: 'tour.create',
      },
      {
        id: 'tour-update',
        method: 'PUT',
        path: '/admin/tours/{id}',
        controller: 'AdminTourController',
        permission: 'tour.update',
      },
      {
        id: 'tour-delete',
        method: 'DELETE',
        path: '/admin/tours/{id}',
        controller: 'AdminTourController',
        permission: 'tour.delete',
      },
      {
        id: 'schedule-list',
        method: 'GET',
        path: '/admin/tours/{tourId}/schedules',
        controller: 'AdminTourController',
        permission: 'schedule.view',
      },
      {
        id: 'schedule-create',
        method: 'POST',
        path: '/admin/tours/{tourId}/schedules',
        controller: 'AdminTourController',
        permission: 'schedule.create',
      },
      {
        id: 'schedule-status',
        method: 'PATCH',
        path: '/admin/tours/{tourId}/schedules/{scheduleId}/status',
        controller: 'AdminTourController',
        permission: 'schedule.close',
      },
      {
        id: 'chat-room',
        method: 'GET',
        path: '/admin/schedules/{scheduleId}/chat-room',
        controller: 'AdminScheduleChatController',
        permission: 'schedule.view',
      },
    ],
  },
  {
    id: 'operation',
    title: 'Vận hành',
    description: 'Booking, thanh toán, hoàn tiền và hỗ trợ vận hành.',
    endpoints: [
      {
        id: 'booking-create',
        method: 'POST',
        path: '/bookings',
        controller: 'BookingController',
        permission: 'booking.create',
      },
      {
        id: 'booking-detail',
        method: 'GET',
        path: '/bookings/{id}',
        controller: 'BookingController',
        permission: 'booking.view',
      },
      {
        id: 'booking-checkin',
        method: 'PATCH',
        path: '/bookings/{id}/check-in',
        controller: 'BookingController',
        permission: 'booking.checkin',
      },
      {
        id: 'payment-create',
        method: 'POST',
        path: '/payments',
        controller: 'PaymentController',
        permission: 'payment.create',
      },
      {
        id: 'payment-detail',
        method: 'GET',
        path: '/payments/{id}',
        controller: 'PaymentController',
        permission: 'payment.view',
      },
      {
        id: 'refund-create',
        method: 'POST',
        path: '/refunds',
        controller: 'RefundController',
        permission: 'refund.create',
      },
      {
        id: 'refund-detail',
        method: 'GET',
        path: '/refunds/{id}',
        controller: 'RefundController',
        permission: 'refund.view',
      },
      {
        id: 'refund-approve',
        method: 'PATCH',
        path: '/refunds/{id}/approve',
        controller: 'RefundController',
        permission: 'refund.approve',
      },
      {
        id: 'support-sessions',
        method: 'GET',
        path: '/support/sessions',
        controller: 'AdminSupportController',
        permission: 'support.view',
      },
      {
        id: 'support-reply',
        method: 'POST',
        path: '/support/sessions/{id}/messages',
        controller: 'AdminSupportController',
        permission: 'support.reply',
      },
    ],
  },
  {
    id: 'review',
    title: 'Đánh giá',
    description: 'Xem chi tiết, phản hồi và kiểm duyệt đánh giá.',
    endpoints: [
      {
        id: 'reviews-detail',
        method: 'GET',
        path: '/reviews/{id}',
        controller: 'ReviewController',
        permission: 'review.view',
      },
      {
        id: 'reviews-reply',
        method: 'POST',
        path: '/reviews/{id}/replies',
        controller: 'ReviewController',
        permission: 'review.reply',
      },
      {
        id: 'reviews-moderate',
        method: 'PATCH',
        path: '/reviews/{id}/moderation',
        controller: 'ReviewController',
        permission: 'review.moderate',
      },
    ],
  },
  {
    id: 'communication',
    title: 'Thông báo',
    description: 'Gửi thông báo vận hành và chiến dịch cho người dùng.',
    endpoints: [
      {
        id: 'notifications-create',
        method: 'POST',
        path: '/notifications',
        controller: 'AdminNotificationController',
        permission: 'user.update',
        note: 'Backend đang dùng user.update; nên đổi sang notification.send ở giai đoạn sau.',
      },
    ],
  },
  {
    id: 'promotion',
    title: 'Khuyến mãi',
    description: 'Voucher, chiến dịch khuyến mãi và gói sản phẩm.',
    endpoints: [
      {
        id: 'vouchers-list',
        method: 'GET',
        path: '/vouchers?page=0&size=10',
        controller: 'AdminVoucherController',
        permission: 'voucher.view',
      },
      {
        id: 'vouchers-create',
        method: 'POST',
        path: '/vouchers',
        controller: 'AdminVoucherController',
        permission: 'voucher.create',
      },
      {
        id: 'campaign-list',
        method: 'GET',
        path: '/promotion-campaigns?page=0&size=10',
        controller: 'AdminPromotionCampaignController',
        permission: 'voucher.view',
      },
      {
        id: 'campaign-create',
        method: 'POST',
        path: '/promotion-campaigns',
        controller: 'AdminPromotionCampaignController',
        permission: 'voucher.create',
      },
    ],
  },
]

export type QuickCheckItem = {
  id: string
  label: string
  path: string
  permission?: string
}

export const quickCheckItems: QuickCheckItem[] = [
  {
    id: 'check-roles',
    label: 'Danh sách vai trò',
    path: '/roles',
    permission: 'user.view',
  },
  {
    id: 'check-users',
    label: 'Danh sách người dùng',
    path: '/users?page=0&size=5',
    permission: 'user.view',
  },
  {
    id: 'check-destinations',
    label: 'Danh sách điểm đến',
    path: '/admin/destinations?page=0&size=5',
    permission: 'destination.view',
  },
  {
    id: 'check-tours',
    label: 'Danh sách tour',
    path: '/tours?page=0&size=5',
    permission: 'tour.view',
  },
  {
    id: 'check-support',
    label: 'Phiên hỗ trợ',
    path: '/support/sessions',
    permission: 'support.view',
  },
  {
    id: 'check-vouchers',
    label: 'Danh sách voucher',
    path: '/vouchers?page=0&size=5',
    permission: 'voucher.view',
  },
  {
    id: 'check-audit',
    label: 'Nhật ký audit',
    path: '/audit-logs?page=0&size=5',
    permission: 'audit.view',
  },
]

export function filterModulesByRole(roleCode: ManagerRoleCode) {
  return managementModules
    .map((module) => ({
      ...module,
      endpoints: module.endpoints.filter((endpoint) =>
        managerRoleHasPermission(roleCode, endpoint.permission),
      ),
    }))
    .filter((module) => module.endpoints.length > 0)
}

export function filterChecksByRole(roleCode: ManagerRoleCode) {
  return quickCheckItems.filter((check) =>
    managerRoleHasPermission(roleCode, check.permission),
  )
}
