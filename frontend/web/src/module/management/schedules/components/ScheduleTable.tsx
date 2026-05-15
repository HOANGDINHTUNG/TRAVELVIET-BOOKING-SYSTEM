import { useTranslation } from 'react-i18next'
import {
  Ban,
  Loader2,
  Pencil,
  Users,
} from 'lucide-react'
import ScheduleStatusBadge from './ScheduleStatusBadge'
import { deriveEffectiveStatus } from '../utils/scheduleStatus'
import { formatCurrencyVnd, formatDateTime, formatNumberVi } from '../utils/currency'
import type { TourScheduleResponse } from '../types/schedule'

type ScheduleTableProps = {
  items: TourScheduleResponse[]
  isLoading?: boolean
  isFetching?: boolean
  onEdit: (schedule: TourScheduleResponse) => void
  onCancel: (schedule: TourScheduleResponse) => void
}

function ScheduleTable(props: ScheduleTableProps) {
  const { t } = useTranslation('management')

  const shellBorder = 'border border-[var(--admin-border)]'
  const mutedText = 'text-[var(--admin-muted)]'
  const surfaceBg = 'bg-[var(--admin-surface)]'

  if (props.isLoading) {
    return (
      <div
        className={`flex items-center justify-center gap-2 rounded-[var(--admin-radius-sm)] ${shellBorder} bg-[color-mix(in_srgb,var(--admin-muted)_6%,var(--admin-surface))] px-3 py-6 text-xs ${mutedText}`}
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        {String(t('common.loading'))}
      </div>
    )
  }

  if (props.items.length === 0) {
    return (
      <div
        className={`rounded-[var(--admin-radius-sm)] border border-dashed border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-muted)_6%,var(--admin-surface))] px-3 py-6 text-center text-xs ${mutedText}`}
      >
        {String(t('tours.schedules.empty'))}
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-[var(--admin-radius-sm)] ${shellBorder}`}>
      <table className={`min-w-full divide-y divide-[var(--admin-border)] text-sm ${surfaceBg}`}>
        <thead
          className={`bg-[color-mix(in_srgb,var(--admin-muted)_8%,var(--admin-surface))] text-xs uppercase tracking-wide ${mutedText}`}
        >
          <tr>
            <th className="px-3 py-2 text-left">
              {String(t('tours.schedules.table.code'))}
            </th>
            <th className="px-3 py-2 text-left">
              {String(t('tours.schedules.table.departure'))}
            </th>
            <th className="px-3 py-2 text-left">
              {String(t('tours.schedules.table.return'))}
            </th>
            <th className="px-3 py-2 text-left">
              {String(t('tours.schedules.table.seats'))}
            </th>
            <th className="px-3 py-2 text-left">
              {String(t('tours.schedules.table.adultPrice'))}
            </th>
            <th className="px-3 py-2 text-left">
              {String(t('tours.schedules.table.status'))}
            </th>
            <th className="px-3 py-2 text-right">
              {String(t('tours.schedules.table.actions'))}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--admin-border)]">
          {props.items.map((row) => {
            const effective = deriveEffectiveStatus(row)
            const isDerivedFull =
              effective === 'full' &&
              (row.status?.toLowerCase?.() ?? 'open') !== 'full'
            const seatsLabel = `${formatNumberVi(row.bookedSeats)} / ${formatNumberVi(row.capacityTotal)}`
            const isTerminal =
              effective === 'cancelled' ||
              effective === 'completed' ||
              effective === 'departed'

            return (
              <tr
                key={row.id}
                className="hover:bg-[color-mix(in_srgb,var(--admin-muted)_7%,var(--admin-surface))]"
              >
                <td className="px-3 py-2 align-top">
                  <span className="font-medium text-[var(--admin-text)]">
                    {row.scheduleCode ?? `#${row.id}`}
                  </span>
                  <p className={`text-[10px] ${mutedText}`}>ID #{row.id}</p>
                </td>
                <td className={`px-3 py-2 align-top ${mutedText}`}>
                  {formatDateTime(row.departureAt)}
                </td>
                <td className={`px-3 py-2 align-top ${mutedText}`}>
                  {formatDateTime(row.returnAt)}
                </td>
                <td className="px-3 py-2 align-top">
                  <span
                    className={`inline-flex items-center gap-1 rounded-[var(--admin-radius-sm)] bg-[color-mix(in_srgb,var(--admin-muted)_12%,var(--admin-surface))] px-2 py-0.5 text-xs font-medium text-[var(--admin-text)]`}
                  >
                    <Users className="h-3 w-3" aria-hidden />
                    {seatsLabel}
                  </span>
                  {row.remainingSeats != null ? (
                    <p className={`text-[10px] ${mutedText}`}>
                      {String(t('tours.schedules.table.remaining'))}:{' '}
                      {formatNumberVi(row.remainingSeats)}
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-2 align-top font-medium text-[var(--admin-text)]">
                  {formatCurrencyVnd(row.adultPrice)}
                </td>
                <td className="px-3 py-2 align-top">
                  <ScheduleStatusBadge
                    status={effective}
                    derived={isDerivedFull}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => props.onEdit(row)}
                      className="admin-icon-btn inline-flex items-center gap-1 rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-2 py-1 text-xs text-[var(--admin-text)]"
                    >
                      <Pencil className="h-3 w-3" aria-hidden />
                      {String(t('common.edit'))}
                    </button>
                    <button
                      type="button"
                      onClick={() => props.onCancel(row)}
                      disabled={isTerminal}
                      className="inline-flex items-center gap-1 rounded-[var(--admin-radius-sm)] border border-[color-mix(in_srgb,var(--admin-danger)_35%,var(--admin-border))] px-2 py-1 text-xs text-[var(--admin-danger)] hover:bg-[color-mix(in_srgb,var(--admin-danger)_8%,var(--admin-surface))] disabled:opacity-40"
                    >
                      <Ban className="h-3 w-3" aria-hidden />
                      {String(t('tours.schedules.table.cancel'))}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {props.isFetching ? (
        <div
          className={`flex items-center justify-end gap-1 border-t border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-muted)_6%,var(--admin-surface))] px-3 py-1 text-[10px] ${mutedText}`}
        >
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          {String(t('common.loading'))}
        </div>
      ) : null}
    </div>
  )
}

export default ScheduleTable
