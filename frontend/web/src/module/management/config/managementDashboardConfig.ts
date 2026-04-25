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
    title: 'Kiem soat tai khoan',
    description: 'Tao, khoa, cap nhat nguoi dung va phan role theo tung bo phan.',
    icon: Users,
    tone: 'green',
  },
  {
    title: 'Role & permission',
    description: 'Quan ly ma quyen, cap phat role, kiem tra quyen nhay cam.',
    icon: KeyRound,
    tone: 'amber',
  },
  {
    title: 'Audit & bao mat',
    description: 'Theo doi thao tac quan trong, request loi, hanh vi can canh bao.',
    icon: ShieldCheck,
    tone: 'blue',
  },
  {
    title: 'Health check API',
    description: 'Chay nhanh cac endpoint GET de xac nhan token va policy.',
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
    description: 'Mo danh sach user, tao tai khoan noi bo, khoa tai khoan va gan role.',
    moduleId: 'system',
    endpointIds: ['users-list', 'users-create', 'users-deactivate', 'roles-list'],
    icon: Users,
    tone: 'green',
  },
  {
    title: 'Destination review',
    description: 'Duyet diem den, sua thong tin can thiet va kiem tra canh bao thoi tiet.',
    moduleId: 'destination',
    endpointIds: ['destination-list', 'destination-approve', 'weather-alert-list'],
    icon: MapPinned,
    tone: 'blue',
  },
  {
    title: 'Tour planning',
    description: 'Tao tour, cap nhat lich khoi hanh va dong lich khi het slot.',
    moduleId: 'tour-schedule',
    endpointIds: ['tour-public-list', 'tour-create', 'schedule-list', 'schedule-status'],
    icon: CalendarDays,
    tone: 'amber',
  },
  {
    title: 'Booking support',
    description: 'Theo doi booking, check-in, ho tro khach va xu ly hoan tien.',
    moduleId: 'operation',
    endpointIds: ['booking-detail', 'booking-checkin', 'refund-approve', 'support-sessions'],
    icon: MessageSquareText,
    tone: 'slate',
  },
  {
    title: 'Campaign control',
    description: 'Quan ly voucher va promotion campaign dang chay tren he thong.',
    moduleId: 'promotion',
    endpointIds: ['vouchers-list', 'vouchers-create', 'campaign-list'],
    icon: TicketPercent,
    tone: 'purple',
  },
] as const

export const adminWorkQueues = [
  {
    title: 'Can duyet hom nay',
    detail: 'Destination, tour va lich khoi hanh can duoc xem truoc khi publish.',
    icon: ClipboardCheck,
  },
  {
    title: 'Can xu ly van hanh',
    detail: 'Booking dang cho check-in, refund can duyet, support sessions dang mo.',
    icon: CreditCard,
  },
  {
    title: 'Can kiem tra quyen',
    detail: 'Tai khoan moi, role thay doi va cac endpoint nhay cam trong audit log.',
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
    title: 'Dieu phoi booking, refund va support',
    description:
      'Man hinh nay uu tien cac viec can xu ly lien tuc trong ngay: booking, payment, refund, support va lich tour dang chay.',
    primaryAction: 'Run operation checks',
    focus: [
      {
        title: 'Booking flow',
        description: 'Xem booking, tao booking ho tro, cap nhat trang thai va check-in khi can.',
        moduleId: 'operation',
        endpointIds: ['booking-detail', 'booking-create', 'booking-checkin'],
        icon: ClipboardCheck,
        tone: 'green',
      },
      {
        title: 'Refund desk',
        description: 'Tiep nhan yeu cau hoan tien, duyet hoac tu choi theo quy trinh van hanh.',
        moduleId: 'operation',
        endpointIds: ['refund-create', 'refund-approve'],
        icon: CreditCard,
        tone: 'amber',
      },
      {
        title: 'Support routing',
        description: 'Mo session ho tro, phan hoi khach va dieu phoi case cho bo phan lien quan.',
        moduleId: 'operation',
        endpointIds: ['support-sessions', 'support-reply'],
        icon: MessageSquareText,
        tone: 'blue',
      },
      {
        title: 'Schedule control',
        description: 'Theo doi lich khoi hanh, tao lich va dong lich khi het slot hoac co su co.',
        moduleId: 'tour-schedule',
        endpointIds: ['schedule-list', 'schedule-create', 'schedule-status'],
        icon: CalendarDays,
        tone: 'slate',
      },
    ],
    routines: [
      'Mo support sessions dang cho phan hoi',
      'Kiem tra booking can check-in trong ngay',
      'Xu ly refund dang cho duyet',
      'Doi chieu payment detail truoc khi escalated',
    ],
  },
  CONTENT_EDITOR: {
    kicker: 'CONTENT STUDIO',
    title: 'Quan ly noi dung diem den va tour',
    description:
      'Khong gian cho editor tap trung vao noi dung: destination, weather context, tour listing va lich dang can publish.',
    primaryAction: 'Run content checks',
    focus: [
      {
        title: 'Destination content',
        description: 'Tao, sua va duyet diem den de noi dung len public dung chuan.',
        moduleId: 'destination',
        endpointIds: ['destination-list', 'destination-create', 'destination-update', 'destination-approve'],
        icon: MapPinned,
        tone: 'green',
      },
      {
        title: 'Weather context',
        description: 'Kiem tra weather alerts va route estimates truoc khi cap nhat noi dung.',
        moduleId: 'destination',
        endpointIds: ['weather-alert-list', 'route-estimates-list'],
        icon: Activity,
        tone: 'blue',
      },
      {
        title: 'Tour publishing',
        description: 'Doc danh sach tour, tao moi va cap nhat noi dung tour dang ban.',
        moduleId: 'tour-schedule',
        endpointIds: ['tour-public-list', 'tour-create', 'tour-update'],
        icon: CalendarDays,
        tone: 'amber',
      },
      {
        title: 'Schedule visibility',
        description: 'Xem lich tour va chat room lien quan de noi dung khop voi thuc te van hanh.',
        moduleId: 'tour-schedule',
        endpointIds: ['schedule-list', 'chat-room'],
        icon: MessageSquareText,
        tone: 'slate',
      },
    ],
    routines: [
      'Duyet destination moi truoc khi publish',
      'Cap nhat tour dang co thay doi lich',
      'Kiem tra weather alerts cho diem den noi bat',
      'Doi chieu noi dung voi chat room/schedule neu co thay doi',
    ],
  },
  FIELD_STAFF: {
    kicker: 'FIELD STAFF BOARD',
    title: 'Cap nhat thuc dia va check-in khach',
    description:
      'Giao dien gon cho nhan su thuc dia: xem lich, xem booking, check-in va gui cap nhat ve destination.',
    primaryAction: 'Run field checks',
    focus: [
      {
        title: 'Today schedules',
        description: 'Xem lich khoi hanh, tour lien quan va chat room cua lich khi can phoi hop.',
        moduleId: 'tour-schedule',
        endpointIds: ['tour-public-list', 'schedule-list', 'chat-room'],
        icon: CalendarDays,
        tone: 'green',
      },
      {
        title: 'Guest check-in',
        description: 'Mo booking va thuc hien check-in tai diem tap trung hoac diem den.',
        moduleId: 'operation',
        endpointIds: ['booking-detail', 'booking-checkin'],
        icon: ClipboardCheck,
        tone: 'blue',
      },
      {
        title: 'Destination update',
        description: 'Xem, tao de xuat va cap nhat thong tin diem den tu hien truong.',
        moduleId: 'destination',
        endpointIds: ['destination-list', 'destination-create', 'destination-update'],
        icon: MapPinned,
        tone: 'amber',
      },
      {
        title: 'Route context',
        description: 'Kiem tra route estimates va weather alerts de bao lai van hanh.',
        moduleId: 'destination',
        endpointIds: ['route-estimates-list', 'weather-alert-list'],
        icon: Route,
        tone: 'slate',
      },
    ],
    routines: [
      'Mo lich tour phu trach truoc gio khoi hanh',
      'Check-in booking ngay khi khach co mat',
      'Cap nhat destination neu co thay doi tai thuc dia',
      'Bao van hanh neu route/weather co rui ro',
    ],
  },
}
