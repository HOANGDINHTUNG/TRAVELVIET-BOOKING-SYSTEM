import { useTranslation } from 'react-i18next'

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  draft: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  inactive: 'bg-slate-200 text-slate-700 ring-1 ring-slate-300',
  archived: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
}

type StatusBadgeProps = {
  status: string | null | undefined
}

function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation('management')
  const normalized = (status ?? '').toString().toLowerCase()
  const classes =
    STATUS_BADGE_CLASS[normalized] ??
    'bg-slate-100 text-slate-600 ring-1 ring-slate-200'

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${classes}`}
    >
      {String(
        t(`tours.status.${normalized || 'draft'}`, {
          defaultValue: status ?? '—',
        }),
      )}
    </span>
  )
}

export default StatusBadge
