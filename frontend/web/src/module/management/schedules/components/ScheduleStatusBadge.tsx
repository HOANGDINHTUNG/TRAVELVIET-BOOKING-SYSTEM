import { useTranslation } from 'react-i18next'
import type { ScheduleStatus } from '../types/schedule'

const STATUS_CLASS: Record<ScheduleStatus, string> = {
  draft:
    'bg-[color-mix(in_srgb,var(--admin-muted)_14%,var(--admin-surface))] text-[var(--admin-text)] ring-[var(--admin-border)]',
  open:
    'bg-emerald-100 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/55 dark:text-emerald-200 dark:ring-emerald-800',
  closed:
    'bg-amber-100 text-amber-900 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800',
  full:
    'bg-rose-100 text-rose-900 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:ring-rose-800',
  departed:
    'bg-sky-100 text-sky-900 ring-sky-200 dark:bg-sky-950/45 dark:text-sky-200 dark:ring-sky-800',
  completed:
    'bg-indigo-100 text-indigo-900 ring-indigo-200 dark:bg-indigo-950/45 dark:text-indigo-200 dark:ring-indigo-800',
  cancelled:
    'bg-zinc-200 text-zinc-800 ring-zinc-300 dark:bg-zinc-800/50 dark:text-zinc-200 dark:ring-zinc-600',
}

type ScheduleStatusBadgeProps = {
  status: ScheduleStatus
  /** Khi `derived=true`, hiển thị thêm gợi ý "FULL được tự derive". */
  derived?: boolean
}

function ScheduleStatusBadge({ status, derived }: ScheduleStatusBadgeProps) {
  const { t } = useTranslation('management')
  const cls = STATUS_CLASS[status]

  const label = String(
    t(`tours.schedules.status.${status}`, { defaultValue: status }),
  )

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
      title={
        derived
          ? String(t('tours.schedules.status.derivedFull'))
          : undefined
      }
    >
      {label}
      {derived ? (
        <span className="text-[9px] uppercase opacity-70">·auto</span>
      ) : null}
    </span>
  )
}

export default ScheduleStatusBadge
