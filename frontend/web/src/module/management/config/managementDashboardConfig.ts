import {
  Activity,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  KeyRound,
  MapPinned,
  MessageSquareText,
  Route,
  ServerCog,
  ShieldCheck,
  TicketPercent,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type DashboardTone = 'green' | 'amber' | 'blue' | 'slate' | 'purple'

export type DashboardFocusItem = {
  title: string
  description: string
  moduleId: string
  endpointIds: readonly string[]
  icon: LucideIcon
  tone: DashboardTone
}

export type SpecialistRoleCode = 'OPERATOR' | 'CONTENT_EDITOR' | 'FIELD_STAFF'

export const superAdminCommands = [
  {
    title: 'Kiểm soát tài khoản',
    description: 'Tạo, khóa, cập nhật người dùng và phân role theo từng bộ phận.',
    icon: Users,
    tone: 'green',
  },
  {
    title: 'Role & permission',
    description: 'Quản lý mã quyền, cấp phát role, kiểm tra quyền nhạy cảm.',
    icon: KeyRound,
    tone: 'amber',
  },
  {
    title: 'Audit & bảo mật',
    description: 'Theo dõi thao tác quan trọng, request lỗi, hành vi cần cảnh báo.',
    icon: ShieldCheck,
    tone: 'blue',
  },
  {
    title: 'Health check API',
    description: 'Chạy nhanh các endpoint GET để xác nhận token và policy.',
    icon: ServerCog,
    tone: 'slate',
  },
] as const

export const superAdminLanes = [
  {
    title: '1. Identity',
    items: ['User lifecycle', 'Role assignment', 'Permission review'],
  },
  {
    title: '2. Operation',
    items: ['Booking flow', 'Payment/refund', 'Support routing'],
  },
  {
    title: '3. Content',
    items: ['Destination approval', 'Tour publishing', 'Weather alerts'],
  },
  {
    title: '4. Control',
    items: ['Audit log', 'Quick checks', 'Incident follow-up'],
  },
] as const

export const adminFocusCards: readonly DashboardFocusItem[] = [
  {
    title: 'User & access',
    description: 'Mở danh sách user, tạo tài khoản nội bộ, khóa tài khoản và gán role.',
    moduleId: 'system',
    endpointIds: ['users-list', 'users-create', 'users-deactivate', 'roles-list'],
    icon: Users,
    tone: 'green',
  },
  {
    title: 'Destination review',
    description: 'Duyệt điểm đến, sửa thông tin cần thiết và kiểm tra cảnh báo thời tiết.',
    moduleId: 'destination',
    endpointIds: ['destination-list', 'destination-approve', 'weather-alert-list'],
    icon: MapPinned,
    tone: 'blue',
  },
  {
    title: 'Tour planning',
    description: 'Tạo tour, cập nhật lịch khởi hành và đóng lịch khi hết slot.',
    moduleId: 'tour-schedule',
    endpointIds: ['tour-public-list', 'tour-create', 'schedule-list', 'schedule-status'],
    icon: CalendarDays,
    tone: 'amber',
  },
  {
    title: 'Booking support',
    description: 'Theo dõi booking, check-in, hỗ trợ khách và xử lý hoàn tiền.',
    moduleId: 'operation',
    endpointIds: ['booking-detail', 'booking-checkin', 'refund-approve', 'support-sessions'],
    icon: MessageSquareText,
    tone: 'slate',
  },
  {
    title: 'Campaign control',
    description: 'Quản lý voucher và promotion campaign đang chạy trên hệ thống.',
    moduleId: 'promotion',
    endpointIds: ['vouchers-list', 'vouchers-create', 'campaign-list'],
    icon: TicketPercent,
    tone: 'purple',
  },
] as const

export const adminWorkQueues = [
  {
    title: 'Cần duyệt hôm nay',
    detail: 'Destination, tour và lịch khởi hành cần được xem trước khi publish.',
    icon: ClipboardCheck,
  },
  {
    title: 'Cần xử lý vận hành',
    detail: 'Booking đang chờ check-in, refund cần duyệt, support sessions đang mở.',
    icon: CreditCard,
  },
  {
    title: 'Cần kiểm tra quyền',
    detail: 'Tài khoản mới, role thay đổi và các endpoint nhạy cảm trong audit log.',
    icon: ShieldCheck,
  },
] as const

export const specialistRoleDashboards: Record<
  SpecialistRoleCode,
  {
    kicker: string
    title: string
    description: string
    primaryAction: string
    focus: readonly DashboardFocusItem[]
    routines: readonly string[]
  }
> = {
  OPERATOR: {
    kicker: 'OPERATOR DESK',
    title: 'Điều phối booking, refund và support',
    description:
      'Màn hình này ưu tiên các việc cần xử lý liên tục trong ngày: booking, payment, refund, support và lịch tour đang chạy.',
    primaryAction: 'Run operation checks',
    focus: [
      {
        title: 'Booking flow',
        description: 'Xem booking, tạo booking hỗ trợ, cập nhật trạng thái và check-in khi cần.',
        moduleId: 'operation',
        endpointIds: ['booking-detail', 'booking-create', 'booking-checkin'],
        icon: ClipboardCheck,
        tone: 'green',
      },
      {
        title: 'Refund desk',
        description: 'Tiếp nhận yêu cầu hoàn tiền, duyệt hoặc từ chối theo quy trình vận hành.',
        moduleId: 'operation',
        endpointIds: ['refund-create', 'refund-approve'],
        icon: CreditCard,
        tone: 'amber',
      },
      {
        title: 'Support routing',
        description: 'Mở session hỗ trợ, phản hồi khách và điều phối case cho bộ phận liên quan.',
        moduleId: 'operation',
        endpointIds: ['support-sessions', 'support-reply'],
        icon: MessageSquareText,
        tone: 'blue',
      },
      {
        title: 'Schedule control',
        description: 'Theo dõi lịch khởi hành, tạo lịch và đóng lịch khi hết slot hoặc có sự cố.',
        moduleId: 'tour-schedule',
        endpointIds: ['schedule-list', 'schedule-create', 'schedule-status'],
        icon: CalendarDays,
        tone: 'slate',
      },
    ],
    routines: [
      'Mở support sessions đang chờ phản hồi',
      'Kiểm tra booking cần check-in trong ngày',
      'Xử lý refund đang chờ duyệt',
      'Đối chiếu payment detail trước khi escalated',
    ],
  },
  CONTENT_EDITOR: {
    kicker: 'CONTENT STUDIO',
    title: 'Quản lý nội dung điểm đến và tour',
    description:
      'Không gian cho editor tập trung vào nội dung: destination, weather context, tour listing và lịch đang cần publish.',
    primaryAction: 'Run content checks',
    focus: [
      {
        title: 'Destination content',
        description: 'Tạo, sửa và duyệt điểm đến để nội dung lên public đúng chuẩn.',
        moduleId: 'destination',
        endpointIds: ['destination-list', 'destination-create', 'destination-update', 'destination-approve'],
        icon: MapPinned,
        tone: 'green',
      },
      {
        title: 'Weather context',
        description: 'Kiểm tra weather alerts và route estimates trước khi cập nhật nội dung.',
        moduleId: 'destination',
        endpointIds: ['weather-alert-list', 'route-estimates-list'],
        icon: Activity,
        tone: 'blue',
      },
      {
        title: 'Tour publishing',
        description: 'Đọc danh sách tour, tạo mới và cập nhật nội dung tour đang bán.',
        moduleId: 'tour-schedule',
        endpointIds: ['tour-public-list', 'tour-create', 'tour-update'],
        icon: CalendarDays,
        tone: 'amber',
      },
      {
        title: 'Schedule visibility',
        description: 'Xem lịch tour và chat room liên quan để nội dung khớp với thực tế vận hành.',
        moduleId: 'tour-schedule',
        endpointIds: ['schedule-list', 'chat-room'],
        icon: MessageSquareText,
        tone: 'slate',
      },
    ],
    routines: [
      'Duyệt destination mới trước khi publish',
      'Cập nhật tour đang có thay đổi lịch',
      'Kiểm tra weather alerts cho điểm đến nổi bật',
      'Đối chiếu nội dung với chat room/schedule nếu có thay đổi',
    ],
  },
  FIELD_STAFF: {
    kicker: 'FIELD STAFF BOARD',
    title: 'Cập nhật thực địa và check-in khách',
    description:
      'Giao diện gọn cho nhân sự thực địa: xem lịch, xem booking, check-in và gửi cập nhật về destination.',
    primaryAction: 'Run field checks',
    focus: [
      {
        title: 'Today schedules',
        description: 'Xem lịch khởi hành, tour liên quan và chat room của lịch khi cần phối hợp.',
        moduleId: 'tour-schedule',
        endpointIds: ['tour-public-list', 'schedule-list', 'chat-room'],
        icon: CalendarDays,
        tone: 'green',
      },
      {
        title: 'Guest check-in',
        description: 'Mở booking và thực hiện check-in tại điểm tập trung hoặc điểm đến.',
        moduleId: 'operation',
        endpointIds: ['booking-detail', 'booking-checkin'],
        icon: ClipboardCheck,
        tone: 'blue',
      },
      {
        title: 'Destination update',
        description: 'Xem, tạo đề xuất và cập nhật thông tin điểm đến từ hiện trường.',
        moduleId: 'destination',
        endpointIds: ['destination-list', 'destination-create', 'destination-update'],
        icon: MapPinned,
        tone: 'amber',
      },
      {
        title: 'Route context',
        description: 'Kiểm tra route estimates và weather alerts để báo lại vận hành.',
        moduleId: 'destination',
        endpointIds: ['route-estimates-list', 'weather-alert-list'],
        icon: Route,
        tone: 'slate',
      },
    ],
    routines: [
      'Mở lịch tour phụ trách trước giờ khởi hành',
      'Check-in booking ngay khi khách có mặt',
      'Cập nhật destination nếu có thay đổi tại thực địa',
      'Báo vận hành nếu route/weather có rủi ro',
    ],
  },
}
