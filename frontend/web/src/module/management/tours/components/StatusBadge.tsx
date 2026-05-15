import { useTranslation } from 'react-i18next'

const STATUS_BADGE_CLASS: Record<string, string> = {
  active:
    'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/55 dark:text-emerald-200 dark:ring-emerald-800',
  draft:
    'bg-amber-100 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800',
  inactive:
    'bg-slate-200 text-slate-800 ring-1 ring-slate-300 dark:bg-[color-mix(in_srgb,var(--admin-muted)_22%,var(--admin-surface))] dark:text-[var(--admin-text)] dark:ring-[var(--admin-border)]',
  archived:
    'bg-rose-100 text-rose-800 ring-1 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:ring-rose-800',
}

type StatusBadgeProps = {
  status: string | null | undefined
}

function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation('management')
  const normalized = (status ?? '').toString().toLowerCase()
  const classes =
    STATUS_BADGE_CLASS[normalized] ??
    'bg-[color-mix(in_srgb,var(--admin-muted)_14%,var(--admin-surface))] text-[var(--admin-muted)] ring-1 ring-[var(--admin-border)] dark:text-[var(--admin-text)]'

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
