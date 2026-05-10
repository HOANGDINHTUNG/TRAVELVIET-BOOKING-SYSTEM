import { useTranslation } from 'react-i18next'
import { CalendarClock, Loader2, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'
import type { TourResponse } from '../types/tour'

type TourTableProps = {
  items: TourResponse[]
  isPending: boolean
  isFetching: boolean
  onEdit: (tour: TourResponse) => void
  onDelete: (tour: TourResponse) => void
  /** Mở modal Lịch khởi hành (Phase 6). */
  onManageSchedules?: (tour: TourResponse) => void
}

function formatPrice(value: number | null, currency: string | null) {
  if (value === null || value === undefined) return '—'
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND',
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${value.toLocaleString('vi-VN')} ${currency ?? ''}`.trim()
  }
}

function TourTable(props: TourTableProps) {
  const { t } = useTranslation('management')
  const { items, isPending, isFetching, onEdit, onDelete, onManageSchedules } = props

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[var(--color-border,#e2e8f0)] text-sm">
        <thead className="bg-[var(--color-page,#f8fafc)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-muted,#64748b)]">
          <tr>
            <th scope="col" className="px-4 py-3">
              {String(t('tours.table.id'))}
            </th>
            <th scope="col" className="px-4 py-3">
              {String(t('tours.table.name'))}
            </th>
            <th scope="col" className="px-4 py-3">
              {String(t('tours.table.status'))}
            </th>
            <th scope="col" className="px-4 py-3">
              {String(t('tours.table.price'))}
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              {String(t('tours.table.actions'))}
            </th>
          </tr>
        </thead>
        <tbody
          className={`divide-y divide-[var(--color-border,#e2e8f0)] ${
            isFetching && !isPending ? 'opacity-70' : ''
          }`}
        >
          {isPending ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-sm">
                <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden />
                <p className="mt-2 text-[var(--color-muted,#64748b)]">
                  {String(t('common.loading'))}
                </p>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-sm text-[var(--color-muted,#64748b)]"
              >
                {String(t('common.empty'))}
              </td>
            </tr>
          ) : (
            items.map((tour) => (
              <tr
                key={tour.id}
                className="hover:bg-[var(--color-page,#f8fafc)]"
              >
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-muted,#64748b)]">
                  #{tour.id}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{tour.name ?? '—'}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-muted,#64748b)]">
                    {tour.code ?? '—'}
                    {tour.destinationName ? ` · ${tour.destinationName}` : ''}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={tour.status} />
                </td>
                <td className="px-4 py-3 font-semibold tabular-nums">
                  {formatPrice(tour.basePrice, tour.currency)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {onManageSchedules ? (
                      <button
                        type="button"
                        onClick={() => onManageSchedules(tour)}
                        className="inline-flex items-center gap-1 rounded-md border border-sky-200 px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50"
                        aria-label={String(t('tours.schedules.openButton'))}
                        title={String(t('tours.schedules.openButton'))}
                      >
                        <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                        {String(t('tours.schedules.openButton'))}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onEdit(tour)}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border,#e2e8f0)] px-2 py-1 text-xs font-medium hover:bg-[var(--color-page,#f1f5f9)]"
                      aria-label={String(t('common.edit'))}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                      {String(t('common.edit'))}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(tour)}
                      className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      aria-label={String(t('common.delete'))}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      {String(t('common.delete'))}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TourTable
