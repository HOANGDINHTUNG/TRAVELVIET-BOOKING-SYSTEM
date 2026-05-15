import { useMemo } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { systemAdminApi } from '../../../api/server/SystemAdmin.api'
import type { AdminUser } from '../../../api/server/SystemAdmin.api'
import { ManagementBookingsApi } from '../bookings/api/managementBookings.api'
import type { ManagementBookingResponse } from '../bookings/types/managementBooking'
import { ManagementToursApi } from '../tours/api/managementTours.api'
import type { TourResponse } from '../tours/types/tour'
import { tourKeys } from '../tours/hooks/useTours'
import type {
  AdminDashboardBundle,
  AdminDashboardKpi,
  AdminOrderStatusSlice,
  AdminRecentBookingRow,
  AdminRevenuePoint,
} from './dashboardMock'
import { mockAdminDashboardBundle } from './dashboardMock'

export type DashboardWarning = {
  code: string
  values?: Record<string, string | number>
}

export type DashboardOverviewMeta = {
  warnings: DashboardWarning[]
  bookingsFallback: boolean
  usedMockFallback: boolean
  aggregatedBookingsSampleSize: number | null
}

// ============================================================
// Ghi chú
// ============================================================
// BE chưa có API thống kê tổng hợp / list thanh toán admin.
// Hook này tổng hợp từ: admin/bookings (mẫu), admin/tours (đếm active), users admin.

const BOOKING_SAMPLE_SIZE = 150
const USER_SAMPLE_SIZE = 200
const DAYS_SPARK = 7

function startOfLocalDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function localDayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseToLocalDayKey(iso: string | null | undefined): string | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return null
  return localDayKey(new Date(t))
}

function lastNDatesInclusive(n: number, end = new Date()): Date[] {
  const endDay = startOfLocalDay(end)
  const out: Date[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(endDay)
    d.setDate(d.getDate() - i)
    out.push(d)
  }
  return out
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

function isPaidLike(paymentStatus: string | null | undefined): boolean {
  const p = (paymentStatus ?? '').toLowerCase()
  return p === 'paid' || p === 'partial'
}

function isCancelledLike(b: ManagementBookingResponse): boolean {
  const s = (b.status ?? '').toLowerCase()
  const ps = (b.paymentStatus ?? '').toLowerCase()
  return (
    s === 'cancelled' ||
    s === 'expired' ||
    s === 'refunded' ||
    ps === 'refunded' ||
    ps === 'failed'
  )
}

function rowUiStatus(
  b: ManagementBookingResponse,
): AdminRecentBookingRow['status'] {
  if (isCancelledLike(b)) return 'cancelled'
  if (isPaidLike(b.paymentStatus)) return 'paid'
  return 'pending_payment'
}

function formatIntVi(n: number): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(n)
}

function formatCompactVnd(n: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(n)
}

function sumPaidRevenueInList(rows: ManagementBookingResponse[]): number {
  let s = 0
  for (const b of rows) {
    if (!isPaidLike(b.paymentStatus)) continue
    s += b.finalAmount ?? 0
  }
  return s
}

function countBookingsOnDay(rows: ManagementBookingResponse[], dayKey: string): number {
  let c = 0
  for (const b of rows) {
    const k = parseToLocalDayKey(b.createdAt)
    if (k === dayKey) c += 1
  }
  return c
}

function sumPaidRevenueOnDay(rows: ManagementBookingResponse[], dayKey: string): number {
  let s = 0
  for (const b of rows) {
    if (!isPaidLike(b.paymentStatus)) continue
    const k = parseToLocalDayKey(b.createdAt)
    if (k === dayKey) s += b.finalAmount ?? 0
  }
  return s
}

function buildOrderStatusSlices(rows: ManagementBookingResponse[]): AdminOrderStatusSlice[] {
  let paid = 0
  let pending = 0
  let cancelled = 0
  for (const b of rows) {
    if (isCancelledLike(b)) {
      cancelled += 1
      continue
    }
    if (isPaidLike(b.paymentStatus)) paid += 1
    else pending += 1
  }
  const total = paid + pending + cancelled
  if (total === 0) {
    return [
      { key: 'paid', value: 0, color: '#1cc88a' },
      { key: 'pending', value: 0, color: '#f6c23e' },
      { key: 'cancelled', value: 0, color: '#c67872' },
    ]
  }
  return [
    { key: 'paid', value: paid, color: '#1cc88a' },
    { key: 'pending', value: pending, color: '#f6c23e' },
    { key: 'cancelled', value: cancelled, color: '#c67872' },
  ]
}

function buildRevenueMonthSeries(
  rows: ManagementBookingResponse[],
  ref = new Date(),
): AdminRevenuePoint[] {
  const y = ref.getFullYear()
  const m = ref.getMonth()
  const last = daysInMonth(y, m)
  const out: AdminRevenuePoint[] = []
  for (let day = 1; day <= last; day += 1) {
    const d = new Date(y, m, day)
    const key = localDayKey(d)
    const revenueVnd = sumPaidRevenueOnDay(rows, key)
    out.push({
      day: `${String(day).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}`,
      revenueVnd,
    })
  }
  return out
}

function buildSparkline7(
  rows: ManagementBookingResponse[],
  kind: 'revenue' | 'orders' | 'tours' | 'customers',
  activeTours: number,
  newUsersSeries: number[],
): number[] {
  const days = lastNDatesInclusive(DAYS_SPARK)
  if (kind === 'tours') {
    const base = Math.max(1, activeTours)
    return days.map((_, i) => Math.round((base * (0.92 + (0.08 * i) / Math.max(1, DAYS_SPARK - 1))) || 1))
  }
  if (kind === 'customers') {
    return newUsersSeries.length === DAYS_SPARK
      ? newUsersSeries
      : days.map(() => 0)
  }
  return days.map((d) => {
    const key = localDayKey(d)
    if (kind === 'revenue') return Math.round(sumPaidRevenueOnDay(rows, key) / 1_000_000) || 0
    return countBookingsOnDay(rows, key)
  })
}

function countNewUsersLast30Days(users: AdminUser[], ref = new Date()): { count: number; series: number[] } {
  const end = startOfLocalDay(ref)
  const start = new Date(end)
  start.setDate(start.getDate() - 29)
  const days = lastNDatesInclusive(DAYS_SPARK, end)
  const perLast7 = days.map((d) => {
    const key = localDayKey(d)
    let c = 0
    for (const u of users) {
      const uk = parseToLocalDayKey(u.createdAt)
      if (uk === key) c += 1
    }
    return c
  })
  let count30 = 0
  for (const u of users) {
    const uk = parseToLocalDayKey(u.createdAt)
    if (!uk) continue
    const t = Date.parse(`${uk}T12:00:00`)
    if (Number.isNaN(t)) continue
    const ud = startOfLocalDay(new Date(t))
    if (ud >= start && ud <= end) count30 += 1
  }
  return { count: count30, series: perLast7 }
}

function deriveFromBookings(
  rows: ManagementBookingResponse[],
  totalElements: number,
  activeTourCount: number,
  newUsersCount: number,
  newUsersSpark: number[],
  warnings: DashboardWarning[],
): {
  kpis: AdminDashboardKpi[]
  revenueLast7Days: AdminRevenuePoint[]
  revenueCurrentMonth: AdminRevenuePoint[]
  orderStatusSlices: AdminOrderStatusSlice[]
  recentRaw: ManagementBookingResponse[]
} {
  const paidSampleTotal = sumPaidRevenueInList(rows)
  const kpis: AdminDashboardKpi[] = [
    {
      id: 'revenue',
      value: formatCompactVnd(paidSampleTotal),
      sparkline: buildSparkline7(rows, 'revenue', activeTourCount, newUsersSpark),
    },
    {
      id: 'orders',
      value: formatIntVi(totalElements),
      sparkline: buildSparkline7(rows, 'orders', activeTourCount, newUsersSpark),
    },
    {
      id: 'tours',
      value: formatIntVi(activeTourCount),
      sparkline: buildSparkline7(rows, 'tours', activeTourCount, newUsersSpark),
    },
    {
      id: 'customers',
      value: formatIntVi(newUsersCount),
      sparkline: buildSparkline7(rows, 'customers', activeTourCount, newUsersSpark),
    },
  ]

  const revenueLast7Days: AdminRevenuePoint[] = lastNDatesInclusive(DAYS_SPARK).map((d) => ({
    day: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
    revenueVnd: sumPaidRevenueOnDay(rows, localDayKey(d)),
  }))

  const revenueCurrentMonth = buildRevenueMonthSeries(rows)
  const orderStatusSlices = buildOrderStatusSlices(rows)

  if (rows.length < totalElements) {
    warnings.push({
      code: 'chart_limited_to_page_sample',
      values: { rows: rows.length },
    })
  }

  return {
    kpis,
    revenueLast7Days,
    revenueCurrentMonth,
    orderStatusSlices,
    recentRaw: [...rows]
      .sort((a, b) => {
        const ta = Date.parse(a.createdAt ?? '') || 0
        const tb = Date.parse(b.createdAt ?? '') || 0
        return tb - ta
      })
      .slice(0, 5),
  }
}

export function useDashboardOverviewData(): {
  bundle: AdminDashboardBundle
  meta: DashboardOverviewMeta
  isLoading: boolean
} {
  const bookingsQ = useQuery({
    queryKey: ['dashboard', 'bookings', BOOKING_SAMPLE_SIZE],
    queryFn: () =>
      ManagementBookingsApi.search({
        page: 0,
        size: BOOKING_SAMPLE_SIZE,
        sortBy: 'createdAt',
        sortDir: 'desc',
      }),
    staleTime: 60_000,
  })

  const toursQ = useQuery({
    queryKey: ['dashboard', 'tours-active-count'],
    queryFn: () =>
      ManagementToursApi.list({
        page: 0,
        size: 1,
        status: 'active',
      }),
    staleTime: 120_000,
  })

  const usersQ = useQuery({
    queryKey: ['dashboard', 'users-new-sample', USER_SAMPLE_SIZE],
    queryFn: () =>
      systemAdminApi.getUsers({
        page: 0,
        size: USER_SAMPLE_SIZE,
        sortBy: 'createdAt',
        sortDir: 'desc',
      }),
    staleTime: 120_000,
  })

  const bookingsFallback = bookingsQ.data?.fallback ?? false
  const recentTourIds = useMemo(() => {
    if (!bookingsQ.isSuccess || !bookingsQ.data) return []
    const content = bookingsQ.data.page.content ?? []
    const five = [...content]
      .sort((a, b) => (Date.parse(b.createdAt ?? '') || 0) - (Date.parse(a.createdAt ?? '') || 0))
      .slice(0, 5)
    return [...new Set(five.map((b) => b.tourId).filter((id) => typeof id === 'number'))]
  }, [bookingsQ.isSuccess, bookingsQ.data])

  const titleQueries = useQueries({
    queries: recentTourIds.map((id: number) => ({
      queryKey: tourKeys.detail(id),
      queryFn: (): Promise<TourResponse> => ManagementToursApi.detail(id),
      enabled: bookingsQ.isSuccess && recentTourIds.length > 0,
      staleTime: 300_000,
    })),
  })

  const tourNameById = useMemo(() => {
    const m = new Map<number, string>()
    recentTourIds.forEach((id: number, i: number) => {
      const tour = titleQueries[i]?.data
      const name = tour?.name
      if (name) m.set(id, name)
    })
    return m
  }, [recentTourIds, titleQueries])

  const isLoading =
    bookingsQ.isPending || toursQ.isPending || usersQ.isPending

  const { bundle, meta } = useMemo(() => {
    const warnings: DashboardWarning[] = []
    let usedMockFallback = false

    if (bookingsQ.isPending || toursQ.isPending || usersQ.isPending) {
      return {
        bundle: { ...mockAdminDashboardBundle },
        meta: {
          warnings,
          bookingsFallback,
          usedMockFallback: false,
          aggregatedBookingsSampleSize: null,
        } satisfies DashboardOverviewMeta,
      }
    }

    if (bookingsFallback) {
      warnings.push({ code: 'bookings_api_fallback' })
    }

    if (bookingsQ.isError) {
      warnings.push({ code: 'bookings_load_error' })
      usedMockFallback = true
      if (toursQ.isError) warnings.push({ code: 'tours_load_error' })
      if (usersQ.isError) warnings.push({ code: 'users_load_error' })
      return {
        bundle: { ...mockAdminDashboardBundle },
        meta: {
          warnings,
          bookingsFallback,
          usedMockFallback,
          aggregatedBookingsSampleSize: null,
        } satisfies DashboardOverviewMeta,
      }
    }

    if (!bookingsQ.data) {
      warnings.push({ code: 'bookings_missing_after_load' })
      usedMockFallback = true
      return {
        bundle: { ...mockAdminDashboardBundle },
        meta: {
          warnings,
          bookingsFallback,
          usedMockFallback,
          aggregatedBookingsSampleSize: null,
        } satisfies DashboardOverviewMeta,
      }
    }

    const page = bookingsQ.data.page
    const rows = page.content ?? []
    const totalElements = page.totalElements ?? rows.length

    const activeTourCount = toursQ.data?.totalElements ?? 0
    if (toursQ.isError) {
      warnings.push({ code: 'tours_kpi_unavailable' })
    }

    const users = usersQ.data?.content ?? []
    const { count: newUsersCount, series: newUsersSpark } = usersQ.isSuccess
      ? countNewUsersLast30Days(users)
      : { count: 0, series: lastNDatesInclusive(DAYS_SPARK).map(() => 0) }
    if (usersQ.isError) {
      warnings.push({ code: 'users_kpi_unavailable' })
    }

    const derived = deriveFromBookings(
      rows,
      totalElements,
      activeTourCount,
      newUsersCount,
      newUsersSpark,
      warnings,
    )

    const recentBookings: AdminRecentBookingRow[] = derived.recentRaw.map((b) => ({
      id: b.id,
      code: b.bookingCode ?? `#${b.id}`,
      customer: b.contactName ?? '—',
      tourTitle: tourNameById.get(b.tourId) ?? `Tour #${b.tourId}`,
      amountVnd: b.finalAmount ?? 0,
      status: rowUiStatus(b),
      createdAt: b.createdAt ?? new Date().toISOString(),
    }))

    const { recentRaw: _r, ...rest } = derived

    return {
      bundle: {
        ...rest,
        recentBookings,
      } satisfies AdminDashboardBundle,
      meta: {
        warnings,
        bookingsFallback,
        usedMockFallback,
        aggregatedBookingsSampleSize: rows.length,
      } satisfies DashboardOverviewMeta,
    }
  }, [
    bookingsQ.isPending,
    bookingsQ.isError,
    bookingsQ.data,
    toursQ.isPending,
    usersQ.isPending,
    bookingsFallback,
    toursQ.data,
    toursQ.isError,
    usersQ.data,
    usersQ.isSuccess,
    usersQ.isError,
    tourNameById,
  ])

  return { bundle, meta, isLoading }
}
