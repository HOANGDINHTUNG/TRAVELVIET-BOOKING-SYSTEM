import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Row,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table'
import * as XLSX from 'xlsx'
import {
  CheckCheck,
  Loader2,
  Settings2,
  Undo2,
  UserCheck,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '../../../../components/ui/badge'
import BookingStatusBadge from '../../../bookings/components/BookingStatusBadge'
import PaymentStatusBadge from '../../../bookings/components/PaymentStatusBadge'
import { formatCurrencyVnd, formatDateTime } from '../../schedules/utils/currency'
import type { ManagementBookingResponse } from '../types/managementBooking'

const columnHelper = createColumnHelper<ManagementBookingResponse>()

export type BookingsDataTableProps = {
  rows: ManagementBookingResponse[]
  isPending: boolean
  busy: boolean
  bulkSelectionEnabled?: boolean
  onBulkCheckIn?: (ids: number[]) => void | Promise<void>
  onBulkComplete?: (ids: number[]) => void | Promise<void>
  onCancel: (booking: ManagementBookingResponse) => void
  onCheckIn: (booking: ManagementBookingResponse) => void
  onComplete: (booking: ManagementBookingResponse) => void
  onRefund: (booking: ManagementBookingResponse) => void
}

function bookingBulkSelectable(b: ManagementBookingResponse) {
  const st = b.status ?? ''
  return (
    st === 'paid' ||
    st === 'confirmed' ||
    st === 'checked_in'
  )
}

function bookingStatusCell(booking: ManagementBookingResponse) {
  const st = booking.status ?? ''
  if (st === 'pending') {
    return (
      <Badge variant="warning" pulse>
        Chờ xử lý
      </Badge>
    )
  }
  return <BookingStatusBadge status={st} />
}

export default function BookingsDataTable({
  rows,
  isPending,
  busy,
  bulkSelectionEnabled = false,
  onBulkCheckIn,
  onBulkComplete,
  onCancel,
  onCheckIn,
  onComplete,
  onRefund,
}: BookingsDataTableProps) {
  const { t } = useTranslation('management')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [showCols, setShowCols] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const rowIdsKey = useMemo(
    () => rows.map((r) => r.id).join(','),
    [rows],
  )

  useEffect(() => {
    if (!bulkSelectionEnabled) return
    setRowSelection({})
  }, [bulkSelectionEnabled, rowIdsKey])

  const dataColumns = useMemo(
    () => [
      columnHelper.accessor((r) => r.bookingCode ?? `#${r.id}`, {
        id: 'code',
        header: String(t('bookings.page.col.id')),
        cell: (info) => (
          <span className="font-mono text-[11px] text-[var(--admin-muted)]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('contactName', {
        header: String(t('bookings.page.col.contact')),
        cell: ({ row }) => (
          <div className="text-[var(--admin-text)]">
            <div className="font-medium">{row.original.contactName ?? '—'}</div>
            <div className="text-[10px] text-[var(--admin-muted)]">
              {row.original.contactPhone ?? ''}
              {row.original.contactEmail ? ` · ${row.original.contactEmail}` : ''}
            </div>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'tour',
        header: String(t('bookings.page.col.tour')),
        cell: ({ row }) => (
          <span className="text-xs text-[var(--admin-text)]">
            #{row.original.tourId} · #{row.original.scheduleId}
          </span>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: String(t('bookings.page.col.bookedAt')),
        cell: (info) => (
          <span className="text-xs text-[var(--admin-muted)]">{formatDateTime(info.getValue())}</span>
        ),
      }),
      columnHelper.display({
        id: 'status',
        header: String(t('bookings.page.col.status')),
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {bookingStatusCell(row.original)}
            <PaymentStatusBadge status={row.original.paymentStatus} />
          </div>
        ),
      }),
      columnHelper.accessor('finalAmount', {
        header: String(t('bookings.page.col.amount')),
        cell: (info) => (
          <span className="tabular-nums">{formatCurrencyVnd(info.getValue())}</span>
        ),
      }),
    ],
    [t],
  )

  const columns = useMemo(() => {
    if (!bulkSelectionEnabled) return dataColumns

    const selectColumn = columnHelper.display({
      id: 'select',
      enableHiding: false,
      header: ({ table }) => (
        <input
          type="checkbox"
          aria-label={String(t('bookings.page.bulk.selectAllPage'))}
          checked={table.getIsAllPageRowsSelected()}
          ref={(el) => {
            if (!el) return
            el.indeterminate =
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected()
          }}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          disabled={busy}
          className="h-4 w-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)]"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          aria-label={String(t('bookings.page.bulk.selectRow'))}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect() || busy}
          onChange={row.getToggleSelectedHandler()}
          className="h-4 w-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)]"
        />
      ),
    })

    return [selectColumn, ...dataColumns]
  }, [bulkSelectionEnabled, busy, dataColumns, t])

  const table = useReactTable<ManagementBookingResponse>({
    data: rows,
    columns,
    getRowId: (row) => String(row.id),
    state: {
      columnVisibility,
      ...(bulkSelectionEnabled ? { rowSelection } : {}),
    },
    onColumnVisibilityChange: setColumnVisibility,
    ...(bulkSelectionEnabled
      ? {
          onRowSelectionChange: setRowSelection,
          enableRowSelection: (row: Row<ManagementBookingResponse>) =>
            bookingBulkSelectable(row.original),
        }
      : {}),
    getCoreRowModel: getCoreRowModel(),
  })

  const colSpan = table.getAllLeafColumns().length + 1

  const selectedBookings = useMemo(() => {
    if (!bulkSelectionEnabled) return []
    return Object.keys(rowSelection)
      .filter((id) => rowSelection[id])
      .map((id) => rows.find((r) => String(r.id) === id))
      .filter((b): b is ManagementBookingResponse => Boolean(b))
  }, [bulkSelectionEnabled, rowSelection, rows])

  const checkInTargetIds = useMemo(
    () =>
      selectedBookings
        .filter((b) => b.status === 'paid' || b.status === 'confirmed')
        .map((b) => b.id),
    [selectedBookings],
  )

  const completeTargetIds = useMemo(
    () =>
      selectedBookings.filter((b) => b.status === 'checked_in').map((b) => b.id),
    [selectedBookings],
  )

  const selectedCount = selectedBookings.length

  const runBulkCheckIn = async () => {
    if (!onBulkCheckIn) return
    if (checkInTargetIds.length === 0) {
      toast.message(String(t('bookings.page.bulk.noneEligible')))
      return
    }
    await onBulkCheckIn(checkInTargetIds)
    setRowSelection({})
  }

  const runBulkComplete = async () => {
    if (!onBulkComplete) return
    if (completeTargetIds.length === 0) {
      toast.message(String(t('bookings.page.bulk.noneEligible')))
      return
    }
    await onBulkComplete(completeTargetIds)
    setRowSelection({})
  }

  const exportExcel = () => {
    const data = rows.map((b) => ({
      ID: b.id,
      'Mã đơn': b.bookingCode,
      'Khách hàng': b.contactName,
      'Điện thoại': b.contactPhone,
      Email: b.contactEmail,
      'Tour ID': b.tourId,
      'Lịch ID': b.scheduleId,
      'Trạng thái': b.status,
      'Thanh toán': b.paymentStatus,
      'Số tiền': b.finalAmount,
      'Tạo lúc': b.createdAt,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings')
    XLSX.writeFile(wb, `bookings-${new Date().toISOString().slice(0, 10)}.xlsx`)
    toast.success('Đã xuất Excel')
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-end gap-2">
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
            <div className="absolute right-0 z-20 mt-1 min-w-[200px] rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-2 text-xs text-[var(--admin-text)] shadow-lg">
              {table.getAllLeafColumns().map((col) => (
                <label
                  key={col.id}
                  className={`flex items-center gap-2 rounded-[var(--admin-radius-sm)] px-2 py-1 ${
                    col.getCanHide()
                      ? 'cursor-pointer hover:bg-[color-mix(in_srgb,var(--admin-muted)_10%,var(--admin-surface))]'
                      : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={col.getIsVisible()}
                    disabled={!col.getCanHide()}
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
          disabled={!rows.length}
          className="admin-icon-btn rounded-[var(--admin-radius)] border border-[var(--admin-border)] px-3 py-1.5 text-xs font-semibold text-[var(--admin-text)] shadow-sm disabled:opacity-50"
        >
          Xuất Excel
        </button>
      </div>

      {bulkSelectionEnabled && selectedCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-primary)_6%,var(--admin-surface))] px-3 py-2 text-xs text-[var(--admin-text)]">
          <span className="font-semibold">
            {String(
              t('bookings.page.bulk.selected', { count: selectedCount }),
            )}
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={() => void runBulkCheckIn()}
            className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-2.5 py-1 font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {String(t('bookings.page.bulk.checkIn'))}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void runBulkComplete()}
            className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-2.5 py-1 font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {String(t('bookings.page.bulk.complete'))}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setRowSelection({})}
            className="ml-auto rounded-[var(--admin-radius-sm)] px-2 py-1 font-medium text-[var(--admin-muted)] underline-offset-2 hover:underline disabled:opacity-50"
          >
            {String(t('bookings.page.bulk.clear'))}
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <table className="min-w-full divide-y divide-[var(--admin-border)] text-sm">
          <thead className="bg-[color-mix(in_srgb,var(--admin-muted)_8%,var(--admin-surface))] text-[10px] uppercase tracking-wide text-[var(--admin-muted)]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} scope="col" className="px-3 py-2 text-left font-semibold">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  {String(t('bookings.page.col.actions'))}
                </th>
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {isPending ? (
              <tr>
                <td colSpan={colSpan} className="px-3 py-12 text-center text-[var(--admin-muted)]">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden />
                  <p className="mt-2">{String(t('bookings.page.loading'))}</p>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-3 py-12 text-center text-[var(--admin-muted)]">
                  {String(t('bookings.page.empty'))}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const b = row.original
                const canCheckIn = b.status === 'paid' || b.status === 'confirmed'
                const canComplete = b.status === 'checked_in'
                const canCancel = b.status === 'pending' || b.status === 'confirmed'
                const canRefund =
                  b.paymentStatus === 'paid' || b.paymentStatus === 'partially_refunded'
                return (
                  <tr
                    key={row.id}
                    className="group relative hover:bg-[color-mix(in_srgb,var(--admin-muted)_8%,var(--admin-surface))]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-2 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                    <td className="relative px-3 py-2 text-right align-top">
                      <div className="flex justify-end gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                        {canCheckIn ? (
                          <IconAction
                            icon={UserCheck}
                            label={String(t('bookings.page.actions.checkIn'))}
                            onClick={() => onCheckIn(b)}
                            disabled={busy}
                            tone="indigo"
                          />
                        ) : null}
                        {canComplete ? (
                          <IconAction
                            icon={CheckCheck}
                            label={String(t('bookings.page.actions.complete'))}
                            onClick={() => onComplete(b)}
                            disabled={busy}
                            tone="emerald"
                          />
                        ) : null}
                        {canRefund ? (
                          <IconAction
                            icon={Undo2}
                            label={String(t('bookings.page.actions.refund'))}
                            onClick={() => onRefund(b)}
                            disabled={busy}
                            tone="violet"
                          />
                        ) : null}
                        {canCancel ? (
                          <IconAction
                            icon={XCircle}
                            label={String(t('bookings.page.actions.cancel'))}
                            onClick={() => onCancel(b)}
                            disabled={busy}
                            tone="rose"
                          />
                        ) : null}
                      </div>
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

const TONE = {
  indigo:
    'border-indigo-200 text-indigo-800 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-200 dark:hover:bg-indigo-950/40',
  emerald:
    'border-emerald-200 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-200 dark:hover:bg-emerald-950/40',
  rose: 'border-rose-200 text-rose-800 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950/40',
  violet:
    'border-violet-200 text-violet-800 hover:bg-violet-50 dark:border-violet-900 dark:text-violet-200 dark:hover:bg-violet-950/40',
} as const

type ToneKey = keyof typeof TONE

function IconAction(props: {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
  tone: ToneKey
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={props.label}
      disabled={props.disabled}
      onClick={props.onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border bg-[var(--admin-surface)] text-[10px] shadow-sm transition disabled:opacity-50 ${TONE[props.tone]}`}
    >
      <props.icon className="h-3.5 w-3.5" aria-hidden />
    </button>
  )
}
