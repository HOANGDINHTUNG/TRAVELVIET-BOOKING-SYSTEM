/**
 * Dữ liệu mẫu cho Dashboard — dùng khi API lỗi hoặc trong lúc chờ tải.
 *
 * BACKEND (ưu tiên):
 * - GET /api/v1/admin/statistics — KPI, chuỗi doanh thu, phân bổ trạng thái đơn, đơn gần đây.
 * @see ../docs/BACKLOG_BE_ADMIN.md
 * @see ../docs/DASHBOARD_OVERVIEW_FE_NOTES.md
 */

function buildMockRevenueCurrentMonth(): { day: string; revenueVnd: number }[] {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const last = new Date(y, m + 1, 0).getDate()
  const out: { day: string; revenueVnd: number }[] = []
  for (let day = 1; day <= last; day += 1) {
    const wave = 28_000_000 + ((day * 1_370_000) % 42_000_000)
    out.push({
      day: `${String(day).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}`,
      revenueVnd: wave,
    })
  }
  return out
}

export type AdminDashboardKpi = {
  id: string
  /** @deprecated Dùng i18n `dashboard.kpi.{id}` trên UI */
  label?: string
  hint?: string
  value: string
  sparkline: number[]
}

export type AdminRevenuePoint = {
  day: string
  revenueVnd: number
}

export type AdminOrderStatusSlice = {
  key: string
  /** @deprecated Dùng i18n `dashboard.orderStatus.{key}` */
  label?: string
  value: number
  color: string
}

export type AdminRecentBookingRow = {
  id: number
  code: string
  customer: string
  /** Tên tour — BE booking chưa embed title; FE resolve qua GET /admin/tours/{id}. */
  tourTitle: string
  amountVnd: number
  status: 'pending_payment' | 'paid' | 'cancelled'
  createdAt: string
}

export type AdminDashboardBundle = {
  kpis: AdminDashboardKpi[]
  /** Chuỗi 7 ngày (đơn vị VND) — dùng cho tham chiếu / debug. */
  revenueLast7Days: AdminRevenuePoint[]
  /** Doanh thu theo ngày trong tháng hiện tại (AreaChart chính). */
  revenueCurrentMonth: AdminRevenuePoint[]
  orderStatusSlices: AdminOrderStatusSlice[]
  recentBookings: AdminRecentBookingRow[]
}

export const mockAdminDashboardBundle: AdminDashboardBundle = {
  kpis: [
    {
      id: 'revenue',
      value: '1,28 tỷ ₫',
      sparkline: [12, 14, 13, 18, 22, 20, 26],
    },
    {
      id: 'orders',
      value: '3.842',
      sparkline: [40, 42, 41, 44, 48, 50, 49],
    },
    {
      id: 'tours',
      value: '128',
      sparkline: [20, 21, 22, 22, 23, 24, 24],
    },
    {
      id: 'customers',
      value: '612',
      sparkline: [8, 10, 9, 12, 15, 14, 16],
    },
  ],
  revenueLast7Days: [
    { day: '07/05', revenueVnd: 42_000_000 },
    { day: '08/05', revenueVnd: 38_500_000 },
    { day: '09/05', revenueVnd: 55_200_000 },
    { day: '10/05', revenueVnd: 48_000_000 },
    { day: '11/05', revenueVnd: 62_300_000 },
    { day: '12/05', revenueVnd: 51_000_000 },
    { day: '13/05', revenueVnd: 58_800_000 },
  ],
  revenueCurrentMonth: buildMockRevenueCurrentMonth(),
  orderStatusSlices: [
    { key: 'paid', value: 64, color: '#1cc88a' },
    { key: 'pending', value: 18, color: '#f6c23e' },
    { key: 'cancelled', value: 12, color: '#c67872' },
  ],
  recentBookings: [
    {
      id: 501,
      code: 'BK-2026-0501',
      customer: 'Nguyễn Minh An',
      tourTitle: 'Hà Nội — Hạ Long 2N1Đ',
      amountVnd: 12_600_000,
      status: 'paid',
      createdAt: '2026-05-13T09:12:00',
    },
    {
      id: 502,
      code: 'BK-2026-0502',
      customer: 'Trần Hải Yến',
      tourTitle: 'Sapa trekking 3N2Đ',
      amountVnd: 8_900_000,
      status: 'pending_payment',
      createdAt: '2026-05-13T08:40:00',
    },
    {
      id: 503,
      code: 'BK-2026-0503',
      customer: 'Lê Quốc Bảo',
      tourTitle: 'Huế — Đà Nẵng 4N3Đ',
      amountVnd: 15_200_000,
      status: 'paid',
      createdAt: '2026-05-12T21:05:00',
    },
    {
      id: 504,
      code: 'BK-2026-0504',
      customer: 'Phạm Thu Giang',
      tourTitle: 'Phú Quốc nghỉ dưỡng',
      amountVnd: 6_450_000,
      status: 'cancelled',
      createdAt: '2026-05-12T18:22:00',
    },
    {
      id: 505,
      code: 'BK-2026-0505',
      customer: 'Hoàng Việt Đức',
      tourTitle: 'Mekong 1 ngày',
      amountVnd: 22_000_000,
      status: 'paid',
      createdAt: '2026-05-12T11:00:00',
    },
  ],
}
