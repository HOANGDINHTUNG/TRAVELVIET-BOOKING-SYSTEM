import { useTranslation } from 'react-i18next'
import type { ScheduleStatus } from '../types/schedule'

const STATUS_CLASS: Record<ScheduleStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 ring-slate-200',
  open: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  closed: 'bg-amber-100 text-amber-800 ring-amber-200',
  full: 'bg-rose-100 text-rose-800 ring-rose-200',
  departed: 'bg-sky-100 text-sky-800 ring-sky-200',
  completed: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
  cancelled: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
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
