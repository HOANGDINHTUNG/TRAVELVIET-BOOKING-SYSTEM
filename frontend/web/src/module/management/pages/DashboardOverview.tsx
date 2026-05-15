import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Banknote, ClipboardList, MapPin, UserPlus } from 'lucide-react'
import type { TooltipProps } from 'recharts'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '../../../components/ui/badge'
import type { AdminRecentBookingRow } from './dashboardMock'
import type { DashboardWarning } from './useDashboardOverviewData'
import { useDashboardOverviewData } from './useDashboardOverviewData'

function formatVnd(n: number, language: string) {
  const locale = language.toLowerCase().startsWith('vi') ? 'vi-VN' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(n)
}

const kpiIcon = {
  revenue: Banknote,
  orders: ClipboardList,
  tours: MapPin,
  customers: UserPlus,
} as const

const kpiSparkStroke: Record<string, string> = {
  revenue: '#17a2b8',
  orders: '#1cc88a',
  tours: '#a5a58d',
  customers: '#6f42c1',
}

function SparklineMini({ values, stroke }: { values: number[]; stroke: string }) {
  const chartData = values.map((v, i) => ({ i, v }))
  return (
    <div className="h-10 w-full opacity-90">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <Line type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function StatusBadge({ status }: { status: AdminRecentBookingRow['status'] }) {
  const { t } = useTranslation('management')
  if (status === 'pending_payment') {
    return (
      <Badge variant="warning" pulse>
        {t('dashboard.bookingRowStatus.pending_payment')}
      </Badge>
    )
  }
  if (status === 'paid') {
    return <Badge variant="success">{t('dashboard.bookingRowStatus.paid')}</Badge>
  }
  return <Badge variant="destructive">{t('dashboard.bookingRowStatus.cancelled')}</Badge>
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
}

function RevenueMonthTooltip({ active, payload, label }: TooltipProps<number, string>) {
  const { t, i18n } = useTranslation('management')
  if (!active || !payload?.length) return null
  const v = payload[0]?.value
  if (typeof v !== 'number') return null
  return (
    <div className="admin-card !p-3 text-[13px]">
      <p className="font-medium text-[var(--admin-muted)]">{t('dashboard.chart.revenueDay', { day: label })}</p>
      <p className="mt-0.5 tabular-nums text-[var(--admin-text)]">{formatVnd(v, i18n.language)}</p>
    </div>
  )
}

function DashboardSkeleton() {
  const { t } = useTranslation('management')
  const pulse =
    'animate-pulse rounded-[var(--admin-radius)] bg-[color-mix(in_srgb,var(--admin-muted)_16%,var(--admin-bg))]'
  return (
    <div className="space-y-6" aria-busy="true" aria-label={t('dashboard.skeletonAria')}>
      <div className={`h-24 ${pulse}`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-32 ${pulse}`} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`h-72 lg:col-span-2 ${pulse}`} />
        <div className={`h-72 ${pulse}`} />
      </div>
      <div className={`h-56 ${pulse}`} />
    </div>
  )
}

function warningText(w: DashboardWarning, t: ReturnType<typeof useTranslation<'management'>>['t']) {
  return t(`dashboard.warnings.${w.code}`, { ...(w.values ?? {}), defaultValue: w.code })
}

function resolveKpiHint(
  kpiId: string,
  t: ReturnType<typeof useTranslation<'management'>>['t'],
  sampleSize: number | null,
): string {
  if (kpiId === 'revenue') {
    return t('dashboard.kpi.revenue.hint', { count: sampleSize ?? 0 })
  }
  return t(`dashboard.kpi.${kpiId}.hint`, { defaultValue: '' })
}

/**
 * Tổng quan admin: KPI + biểu đồ + bảng đơn gần đây.
 * Dữ liệu live qua TanStack Query — xem `useDashboardOverviewData.ts` và `DASHBOARD_OVERVIEW_FE_NOTES.md`.
 */
export default function DashboardOverview() {
  const { t, i18n } = useTranslation('management')
  const { bundle: data, meta, isLoading } = useDashboardOverviewData()

  const pieData = useMemo(
    () =>
      data.orderStatusSlices.map((s) => ({
        ...s,
        label: t(`dashboard.orderStatus.${s.key}`),
      })),
    [data.orderStatusSlices, t],
  )

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="space-y-6"
    >
      <header className="flex flex-col gap-1 border-b border-[var(--admin-border)] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--admin-primary)]">
          {t('dashboard.kicker')}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--admin-text)]">{t('dashboard.title')}</h1>
        <p className="max-w-3xl text-[13px] leading-relaxed text-[var(--admin-muted)]">{t('dashboard.subtitle')}</p>

        {meta.aggregatedBookingsSampleSize != null ? (
          <p className="text-[12px] text-[var(--admin-muted)]">
            {t('dashboard.metaAggregated', { count: meta.aggregatedBookingsSampleSize })}
          </p>
        ) : null}

        {meta.warnings.length > 0 ? (
          <ul className="list-inside list-disc space-y-1 text-[12px] text-[color-mix(in_srgb,var(--admin-warning)_85%,#5c4a00)] dark:text-[var(--admin-warning)]">
            {meta.warnings.map((w) => (
              <li key={`${w.code}-${JSON.stringify(w.values ?? {})}`}>{warningText(w, t)}</li>
            ))}
          </ul>
        ) : null}

        {meta.usedMockFallback ? (
          <p className="text-[12px] font-medium text-[color-mix(in_srgb,var(--admin-warning)_85%,#5c4a00)] dark:text-[var(--admin-warning)]">
            {t('dashboard.mockFallbackBanner')}
          </p>
        ) : null}

        <p className="text-[12px] text-[var(--admin-muted)]">
          {t('dashboard.devHubPrefix')}{' '}
          <Link
            className="font-medium text-[var(--admin-primary)] underline underline-offset-2 transition hover:opacity-85"
            to="/management/developer-hub"
          >
            {t('dashboard.devHubLink')}
          </Link>
          {' · '}
          <Link
            className="font-medium text-[var(--admin-primary)] underline underline-offset-2 transition hover:opacity-85"
            to="/management/system-api-probe"
          >
            {t('dashboard.apiProbeLink')}
          </Link>
        </p>
      </header>

      <motion.section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        {data.kpis.map((kpi) => {
          const Icon = kpiIcon[kpi.id as keyof typeof kpiIcon] ?? Banknote
          const stroke = kpiSparkStroke[kpi.id] ?? '#17a2b8'
          return (
            <motion.div key={kpi.id} variants={fadeUp} className="admin-card p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--admin-muted)]">
                  {t(`dashboard.kpi.${kpi.id}.label`)}
                </p>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--admin-radius-sm)] bg-[var(--admin-primary-dim)] text-[var(--admin-primary)]">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--admin-text)]">{kpi.value}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-[var(--admin-muted)]">
                {resolveKpiHint(kpi.id, t, meta.aggregatedBookingsSampleSize)}
              </p>
              <div className="mt-3">
                <SparklineMini values={kpi.sparkline} stroke={stroke} />
              </div>
            </motion.div>
          )
        })}
      </motion.section>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="admin-card p-4 lg:col-span-2"
        >
          <h2 className="text-sm font-semibold text-[var(--admin-text)]">{t('dashboard.chart.revenueMonthTitle')}</h2>
          <p className="mt-0.5 text-[11px] text-[var(--admin-muted)]">{t('dashboard.chart.revenueMonthSubtitle')}</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenueCurrentMonth} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: 'var(--admin-muted)' }}
                  stroke="var(--admin-border)"
                  interval={Math.max(0, Math.floor(data.revenueCurrentMonth.length / 8))}
                />
                <YAxis
                  tickFormatter={(v: number) =>
                    t('dashboard.chart.yAxisMillions', { n: Math.round(Number(v) / 1_000_000) })
                  }
                  width={40}
                  tick={{ fontSize: 10, fill: 'var(--admin-muted)' }}
                  stroke="var(--admin-border)"
                />
                <Tooltip
                  content={<RevenueMonthTooltip />}
                  cursor={{ stroke: 'var(--admin-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenueVnd"
                  stroke="var(--admin-primary)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: 'var(--admin-primary)', strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="admin-card p-4"
        >
          <h2 className="text-sm font-semibold text-[var(--admin-text)]">{t('dashboard.chart.orderStatusTitle')}</h2>
          <p className="mt-0.5 text-[11px] text-[var(--admin-muted)]">{t('dashboard.chart.orderStatusSubtitle')}</p>
          <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
            <div className="h-52 w-full max-w-[220px] sm:h-56 sm:max-w-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, name: string) => [t('dashboard.chart.pieTooltipOrders', { count: v }), name]}
                    contentStyle={{
                      borderRadius: 'var(--admin-radius)',
                      border: '1px solid var(--admin-border)',
                      fontSize: 12,
                      background: 'var(--admin-surface)',
                      color: 'var(--admin-text)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-full min-w-0 space-y-2 text-[13px] sm:w-auto sm:min-w-[180px]">
              {pieData.map((s) => (
                <li key={s.key} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[var(--admin-text)]">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </span>
                  <span className="tabular-nums font-semibold text-[var(--admin-text)]">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
      </div>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="admin-card p-4"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--admin-text)]">{t('dashboard.activity.title')}</h2>
            <p className="mt-0.5 text-[11px] text-[var(--admin-muted)]">{t('dashboard.activity.subtitle')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              disabled
              aria-disabled="true"
              title={t('dashboard.activity.filterTitle')}
              placeholder={t('dashboard.activity.filterPlaceholder')}
              className="admin-input h-9 min-w-[200px] flex-1 cursor-not-allowed opacity-60 sm:max-w-xs"
            />
            <span className="text-[12px] tabular-nums text-[var(--admin-muted)]">
              {t('dashboard.activity.pager', { page: 1, pages: 1, total: data.recentBookings.length })}
            </span>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)]">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-muted)_6%,var(--admin-surface))] text-[11px] uppercase tracking-wide text-[var(--admin-muted)]">
                <th className="px-3 py-2.5 font-semibold">{t('dashboard.activity.colCode')}</th>
                <th className="px-3 py-2.5 font-semibold">{t('dashboard.activity.colCustomer')}</th>
                <th className="px-3 py-2.5 font-semibold">{t('dashboard.activity.colTour')}</th>
                <th className="px-3 py-2.5 font-semibold">{t('dashboard.activity.colAmount')}</th>
                <th className="px-3 py-2.5 font-semibold">{t('dashboard.activity.colStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {data.recentBookings.map((row) => (
                <tr
                  key={row.id}
                  className="text-[var(--admin-text)] transition-colors hover:bg-[color-mix(in_srgb,var(--admin-primary)_6%,var(--admin-surface))]"
                >
                  <td className="px-3 py-2.5 font-mono text-[12px]">{row.code}</td>
                  <td className="px-3 py-2.5">{row.customer}</td>
                  <td className="px-3 py-2.5 text-[var(--admin-muted)]">{row.tourTitle}</td>
                  <td className="px-3 py-2.5 tabular-nums">{formatVnd(row.amountVnd, i18n.language)}</td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </motion.div>
  )
}
