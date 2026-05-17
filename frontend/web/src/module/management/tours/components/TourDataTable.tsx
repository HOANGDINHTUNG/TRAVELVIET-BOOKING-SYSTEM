import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import * as XLSX from 'xlsx'
import {
  CalendarClock,
  Copy,
  Eye,
  Loader2,
  Pencil,
  Settings2,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import StatusBadge from './StatusBadge'
import type { TourResponse } from '../types/tour'

const columnHelper = createColumnHelper<TourResponse>()

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

export type TourDataTableProps = {
  items: TourResponse[]
  isPending: boolean
  isFetching: boolean
  onEdit: (tour: TourResponse) => void
  onDelete: (tour: TourResponse) => void
  onManageSchedules: (tour: TourResponse) => void
}

export default function TourDataTable({
  items,
  isPending,
  isFetching,
  onEdit,
  onDelete,
  onManageSchedules,
}: TourDataTableProps) {
  const { t } = useTranslation('management')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [showCols, setShowCols] = useState(false)

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: String(t('tours.table.id')),
        cell: (info) => (
          <span className="font-mono text-xs text-[var(--admin-muted)]">#{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('name', {
        header: String(t('tours.table.name')),
        cell: (info) => {
          const row = info.row.original
          return (
            <div>
              <p className="font-semibold text-[var(--admin-text)]">{row.name ?? '—'}</p>
              <p className="mt-0.5 text-xs text-[var(--admin-muted)]">
                {row.code ?? '—'}
                {row.destinationName ? ` · ${row.destinationName}` : ''}
              </p>
            </div>
          )
        },
      }),
      columnHelper.accessor('status', {
        header: String(t('tours.table.status')),
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'price',
        header: String(t('tours.table.price')),
        cell: ({ row }) => (
          <span className="tabular-nums text-[var(--admin-text)]">
            {formatPrice(row.original.basePrice, row.original.currency)}
          </span>
        ),
      }),
      columnHelper.accessor('esgScore', {
        header: String(t('tours.table.esg')),
        cell: (info) => (
          <span className="tabular-nums text-[var(--admin-muted)]">
            {info.getValue() ?? '—'}
          </span>
        ),
      }),
      columnHelper.accessor('leiScore', {
        header: String(t('tours.table.lei')),
        cell: (info) => (
          <span className="tabular-nums text-[var(--admin-muted)]">
            {info.getValue() ?? '—'}
          </span>
        ),
      }),
    ],
    [t],
  )

  const table = useReactTable({
    data: items,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  const exportExcel = () => {
    const rows = items.map((r) => ({
      ID: r.id,
      Mã: r.code,
      Tên: r.name,
      Slug: r.slug,
      'Điểm đến': r.destinationName,
      'Trạng thái': r.status,
      'Giá cơ bản': r.basePrice,
      ESG: r.esgScore,
      LEI: r.leiScore,
      'Giá niêm yết': r.listPrice,
      'Tiền tệ': r.currency,
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Tours')
    XLSX.writeFile(wb, `tours-${new Date().toISOString().slice(0, 10)}.xlsx`)
    toast.success('Đã xuất Excel')
  }

  const copySlug = async (slug: string | null) => {
    if (!slug) {
      toast.message('Tour chưa có slug')
      return
    }
    try {
      await navigator.clipboard.writeText(slug)
      toast.success('Đã sao chép slug')
    } catch {
      toast.error('Không sao chép được slug')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCols((s) => !s)}
            className="admin-icon-btn inline-flex items-center gap-2 rounded-[var(--admin-radius)] border border-[var(--admin-border)] px-3 py-1.5 text-xs font-semibold text-[var(--admin-text)] shadow-sm"
          >
            <Settings2 className="h-3.5 w-3.5" aria-hidden />
            Cột hiển thị
          </button>
          {showCols ? (
            <div className="absolute right-0 z-20 mt-1 min-w-[180px] rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-2 text-xs text-[var(--admin-text)] shadow-lg">
              {table.getAllLeafColumns().map((col) => (
                <label
                  key={col.id}
                  className="flex cursor-pointer items-center gap-2 rounded-[var(--admin-radius-sm)] px-2 py-1 hover:bg-[color-mix(in_srgb,var(--admin-muted)_10%,var(--admin-surface))]"
                >
                  <input
                    type="checkbox"
                    checked={col.getIsVisible()}
                    onChange={col.getToggleVisibilityHandler()}
                  />
                  <span>{typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id}</span>
                </label>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={exportExcel}
          disabled={!items.length}
          className="admin-icon-btn rounded-[var(--admin-radius)] border border-[var(--admin-border)] px-3 py-1.5 text-xs font-semibold text-[var(--admin-text)] shadow-sm disabled:opacity-50"
        >
          Xuất Excel
        </button>
      </div>

      <div
        className={`overflow-x-auto rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)] ${
          isFetching && !isPending ? 'opacity-70' : ''
        }`}
      >
        <table className="min-w-full divide-y divide-[var(--admin-border)] text-sm">
          <thead className="bg-[color-mix(in_srgb,var(--admin-muted)_8%,var(--admin-surface))] text-left text-xs font-semibold uppercase tracking-wide text-[var(--admin-muted)]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} scope="col" className="px-4 py-3">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right">
                  {String(t('tours.table.actions'))}
                </th>
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {isPending ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden />
                  <p className="mt-2 text-sm">{String(t('common.loading'))}</p>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--admin-muted)]">
                  {String(t('common.empty'))}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const tour = row.original
                return (
                  <tr
                    key={row.id}
                    className="group relative cursor-pointer hover:bg-[color-mix(in_srgb,var(--admin-muted)_8%,var(--admin-surface))]"
                    onClick={() => onManageSchedules(tour)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                    <td className="relative px-4 py-3 text-right align-middle">
                      <div className="pointer-events-none flex justify-end gap-1 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 max-md:pointer-events-auto max-md:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onManageSchedules(tour)
                          }}
                          className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--admin-primary)_45%,var(--admin-border))] bg-[var(--admin-surface)] text-[var(--admin-primary)] shadow-sm hover:bg-[color-mix(in_srgb,var(--admin-primary)_12%,var(--admin-surface))]"
                          title="Lịch & giá"
                        >
                          <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(tour)
                          }}
                          className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-sm hover:bg-[color-mix(in_srgb,var(--admin-muted)_10%,var(--admin-surface))]"
                          title={String(t('common.edit'))}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            void copySlug(tour.slug)
                          }}
                          className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] shadow-sm hover:bg-[color-mix(in_srgb,var(--admin-muted)_10%,var(--admin-surface))]"
                          title="Sao chép slug"
                        >
                          <Copy className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(tour)
                          }}
                          className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--admin-danger)_40%,var(--admin-border))] bg-[var(--admin-surface)] text-[var(--admin-danger)] shadow-sm hover:bg-[color-mix(in_srgb,var(--admin-danger)_10%,var(--admin-surface))]"
                          title={String(t('common.delete'))}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </div>
                      <span
                        className="hidden text-[color-mix(in_srgb,var(--admin-muted)_45%,var(--admin-surface))] group-hover:hidden max-md:hidden md:inline-flex"
                        aria-hidden
                      >
                        <Eye className="h-4 w-4" />
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
