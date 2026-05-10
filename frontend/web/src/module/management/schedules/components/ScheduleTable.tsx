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

  if (props.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-md border border-[var(--color-border,#e2e8f0)] bg-slate-50 px-3 py-6 text-xs text-[var(--color-muted,#64748b)]">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        {String(t('common.loading'))}
      </div>
    )
  }

  if (props.items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[var(--color-border,#e2e8f0)] bg-slate-50 px-3 py-6 text-center text-xs text-[var(--color-muted,#64748b)]">
        {String(t('tours.schedules.empty'))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-[var(--color-border,#e2e8f0)]">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
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
        <tbody className="divide-y divide-slate-100 bg-white">
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
              <tr key={row.id} className="hover:bg-slate-50/60">
                <td className="px-3 py-2 align-top">
                  <span className="font-medium text-slate-900">
                    {row.scheduleCode ?? `#${row.id}`}
                  </span>
                  <p className="text-[10px] text-[var(--color-muted,#64748b)]">
                    ID #{row.id}
                  </p>
                </td>
                <td className="px-3 py-2 align-top">
                  {formatDateTime(row.departureAt)}
                </td>
                <td className="px-3 py-2 align-top">
                  {formatDateTime(row.returnAt)}
                </td>
                <td className="px-3 py-2 align-top">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium">
                    <Users className="h-3 w-3" aria-hidden />
                    {seatsLabel}
                  </span>
                  {row.remainingSeats != null ? (
                    <p className="text-[10px] text-[var(--color-muted,#64748b)]">
                      {String(t('tours.schedules.table.remaining'))}:{' '}
                      {formatNumberVi(row.remainingSeats)}
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-2 align-top font-medium text-slate-900">
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
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                    >
                      <Pencil className="h-3 w-3" aria-hidden />
                      {String(t('common.edit'))}
                    </button>
                    <button
                      type="button"
                      onClick={() => props.onCancel(row)}
                      disabled={isTerminal}
                      className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-40"
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
        <div className="flex items-center justify-end gap-1 bg-slate-50 px-3 py-1 text-[10px] text-[var(--color-muted,#94a3b8)]">
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          {String(t('common.loading'))}
        </div>
      ) : null}
    </div>
  )
}

export default ScheduleTable
