import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { handleApiError } from '../../../../lib/handleApiError'
import Modal from '../../../../components/ui/Modal'
import ConfirmDialog from '../../../../components/ui/ConfirmDialog'
import TourTable from '../components/TourTable'
import TourFilters from '../components/TourFilters'
import Pagination from '../components/Pagination'
import TourForm from '../components/TourForm'
import ScheduleManagerDrawer from '../../schedules/components/ScheduleManagerDrawer'
import {
  useCreateTour,
  useDeleteTour,
  useToursQuery,
  useUpdateTour,
} from '../hooks/useTours'
import type {
  TourResponse,
  TourSearchParams,
} from '../types/tour'
import { DEFAULT_TOUR_SEARCH_PARAMS } from '../types/tour'
import {
  isTourStatus,
  tourResponseToFormDefaults,
  type TourRequestForm,
  type TourStatusValue,
} from '../validation/tourSchema'

type DialogState =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; tour: TourResponse }
  | { kind: 'delete'; tour: TourResponse }
  | { kind: 'schedules'; tour: TourResponse }

const DEFAULT_PAGE = DEFAULT_TOUR_SEARCH_PARAMS.page ?? 0
const DEFAULT_SIZE = DEFAULT_TOUR_SEARCH_PARAMS.size ?? 20

function readNumberParam(value: string | null, fallback: number): number {
  if (value === null) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

function ManagementToursPage() {
  const { t } = useTranslation('management')
  const [searchParams, setSearchParams] = useSearchParams()

  const page = readNumberParam(searchParams.get('page'), DEFAULT_PAGE)
  const size = readNumberParam(searchParams.get('size'), DEFAULT_SIZE)
  const keyword = searchParams.get('q') ?? ''
  const statusParam = searchParams.get('status') ?? ''
  const status: TourStatusValue | '' = isTourStatus(statusParam)
    ? statusParam
    : ''

  const [dialog, setDialog] = useState<DialogState>({ kind: 'closed' })

  const queryParams = useMemo<TourSearchParams>(
    () => ({
      ...DEFAULT_TOUR_SEARCH_PARAMS,
      page,
      size,
      keyword: keyword.trim() || undefined,
      status: status || undefined,
    }),
    [page, size, keyword, status],
  )

  const query = useToursQuery(queryParams)
  const createMutation = useCreateTour({
    onSuccess: () => setDialog({ kind: 'closed' }),
  })
  const updateMutation = useUpdateTour({
    onSuccess: () => setDialog({ kind: 'closed' }),
  })
  const deleteMutation = useDeleteTour({
    onSuccess: () => setDialog({ kind: 'closed' }),
  })

  const updateSearch = useCallback(
    (mutator: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams)
      mutator(next)
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const handleChangeKeyword = useCallback(
    (nextKeyword: string) => {
      updateSearch((next) => {
        const trimmed = nextKeyword.trim()
        if (trimmed.length > 0) next.set('q', trimmed)
        else next.delete('q')
        next.set('page', '0')
      })
    },
    [updateSearch],
  )

  const handleChangeStatus = useCallback(
    (nextStatus: TourStatusValue | '') => {
      updateSearch((next) => {
        if (nextStatus) next.set('status', nextStatus)
        else next.delete('status')
        next.set('page', '0')
      })
    },
    [updateSearch],
  )

  const handleChangePage = useCallback(
    (nextPage: number) => {
      updateSearch((next) => next.set('page', String(nextPage)))
    },
    [updateSearch],
  )

  const handleChangeSize = useCallback(
    (nextSize: number) => {
      updateSearch((next) => {
        next.set('size', String(nextSize))
        next.set('page', '0')
      })
    },
    [updateSearch],
  )

  const handleSubmitCreate = (form: TourRequestForm) => {
    createMutation.mutate(form)
  }

  const handleSubmitEdit = (form: TourRequestForm) => {
    if (dialog.kind !== 'edit') return
    updateMutation.mutate({ id: dialog.tour.id, form })
  }

  const handleConfirmDelete = () => {
    if (dialog.kind !== 'delete') return
    deleteMutation.mutate(dialog.tour.id)
  }

  const items: TourResponse[] = query.data?.content ?? []
  const totalElements = query.data?.totalElements ?? 0
  const totalPages = query.data?.totalPages ?? 0
  const errorMessage = query.error
    ? handleApiError(
        query.error,
        String(
          t('tours.errorMessage', {
            defaultValue:
              'Không thể tải danh sách tour. Vui lòng thử lại sau ít phút.',
          }),
        ),
      )
    : null

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {String(
              t('tours.pageTitle', { defaultValue: 'Quản lý Tours' }),
            )}
          </h1>
          <p className="max-w-2xl text-sm text-[var(--color-muted,#64748b)]">
            {String(
              t('tours.pageSubtitle', {
                defaultValue:
                  'Theo dõi danh sách tour, trạng thái và thông tin cơ bản phục vụ vận hành.',
              }),
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDialog({ kind: 'create' })}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--color-primary,#0ea5e9)] px-4 py-2 text-sm font-semibold text-white"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          {String(
            t('tours.createButton', { defaultValue: 'Tạo tour mới' }),
          )}
        </button>
      </header>

      <TourFilters
        keyword={keyword}
        status={status}
        isFetching={query.isFetching}
        onChangeKeyword={handleChangeKeyword}
        onChangeStatus={handleChangeStatus}
        onRefresh={() => query.refetch()}
      />

      {errorMessage ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p className="font-semibold">
            {String(
              t('common.errorTitle', {
                defaultValue: 'Không tải được dữ liệu',
              }),
            )}
          </p>
          <p className="mt-1">{errorMessage}</p>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-[var(--color-border,#e2e8f0)] bg-white">
        <TourTable
          items={items}
          isPending={query.isPending}
          isFetching={query.isFetching}
          onEdit={(tour) => setDialog({ kind: 'edit', tour })}
          onDelete={(tour) => setDialog({ kind: 'delete', tour })}
          onManageSchedules={(tour) => setDialog({ kind: 'schedules', tour })}
        />
        <Pagination
          page={page}
          size={size}
          totalElements={totalElements}
          totalPages={totalPages}
          isFetching={query.isFetching}
          onChangePage={handleChangePage}
          onChangeSize={handleChangeSize}
        />
      </div>

      <Modal
        open={dialog.kind === 'create'}
        title={String(t('tours.dialog.createTitle'))}
        description={String(t('tours.dialog.createSubtitle'))}
        onClose={() => setDialog({ kind: 'closed' })}
        dismissable={!createMutation.isPending}
        size="lg"
      >
        <TourForm
          onSubmit={handleSubmitCreate}
          onCancel={() => setDialog({ kind: 'closed' })}
          isSubmitting={createMutation.isPending}
          submitLabel={String(t('common.create', { defaultValue: 'Tạo' }))}
        />
      </Modal>

      <Modal
        open={dialog.kind === 'edit'}
        title={
          dialog.kind === 'edit'
            ? `${String(t('tours.dialog.editTitle'))}${
                dialog.tour.name ? ` — ${dialog.tour.name}` : ''
              }`
            : String(t('tours.dialog.editTitle'))
        }
        description={String(t('tours.dialog.editSubtitle'))}
        onClose={() => setDialog({ kind: 'closed' })}
        dismissable={!updateMutation.isPending}
        size="lg"
      >
        {dialog.kind === 'edit' ? (
          <TourForm
            defaultValues={tourResponseToFormDefaults(dialog.tour)}
            initialDestinationName={dialog.tour.destinationName ?? null}
            onSubmit={handleSubmitEdit}
            onCancel={() => setDialog({ kind: 'closed' })}
            isSubmitting={updateMutation.isPending}
            submitLabel={String(t('common.save', { defaultValue: 'Lưu' }))}
          />
        ) : null}
      </Modal>

      <ConfirmDialog
        open={dialog.kind === 'delete'}
        isPending={deleteMutation.isPending}
        title={String(t('tours.dialog.deleteTitle'))}
        message={
          dialog.kind === 'delete'
            ? String(
                t('tours.dialog.deleteMessage', {
                  name: dialog.tour.name ?? `#${dialog.tour.id}`,
                }),
              )
            : ''
        }
        confirmLabel={String(t('common.delete', { defaultValue: 'Xoá' }))}
        cancelLabel={String(t('common.cancel', { defaultValue: 'Huỷ' }))}
        onCancel={() => setDialog({ kind: 'closed' })}
        onConfirm={handleConfirmDelete}
      />

      <ScheduleManagerDrawer
        open={dialog.kind === 'schedules'}
        tourId={dialog.kind === 'schedules' ? dialog.tour.id : null}
        tourName={dialog.kind === 'schedules' ? dialog.tour.name : null}
        onClose={() => setDialog({ kind: 'closed' })}
      />
    </section>
  )
}

export default ManagementToursPage
