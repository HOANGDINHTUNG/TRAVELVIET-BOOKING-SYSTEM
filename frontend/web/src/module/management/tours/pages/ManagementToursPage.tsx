import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, Trash2 } from 'lucide-react'
import { handleApiError } from '../../../../lib/handleApiError'
import Modal from '../../../../components/ui/Modal'
import ConfirmDialog from '../../../../components/ui/ConfirmDialog'
import TourDataTable from '../components/TourDataTable'
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
import type { TourResponse, TourSearchParams } from '../types/tour'
import { DEFAULT_TOUR_SEARCH_PARAMS } from '../types/tour'
import {
  isTourStatus,
  tourResponseToFormDefaults,
  type TourRequestForm,
  type TourStatusValue,
} from '../validation/tourSchema'
import { recordAdminRecent } from '../../lib/adminRecentHistory'
import {
  deleteTourSavedView,
  listTourSavedViews,
  saveTourViewFromQuery,
} from '../../lib/adminTourSavedViews'

type DialogState =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; tour: TourResponse }
  | { kind: 'delete'; tour: TourResponse }
  | { kind: 'schedules'; tour: TourResponse }

const DEFAULT_PAGE = DEFAULT_TOUR_SEARCH_PARAMS.page ?? 0
const DEFAULT_SIZE = DEFAULT_TOUR_SEARCH_PARAMS.size ?? 20
const TOUR_CREATE_DRAFT_KEY = 'tv-admin-tour-draft-create'

const TOUR_COUNTRY_OPTIONS = ['', 'VN', 'TH', 'KR', 'JP', 'SG', 'US', 'AU'] as const

function readNumberParam(value: string | null, fallback: number): number {
  if (value === null) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

function readCountryParam(value: string | null): string {
  if (!value || value.length !== 2) return ''
  return value.toUpperCase()
}

function ManagementToursPage() {
  const { t } = useTranslation('management')
  const [searchParams, setSearchParams] = useSearchParams()

  const page = readNumberParam(searchParams.get('page'), DEFAULT_PAGE)
  const size = readNumberParam(searchParams.get('size'), DEFAULT_SIZE)
  const keyword = searchParams.get('q') ?? ''
  const statusParam = searchParams.get('status') ?? ''
  const status: TourStatusValue | '' = isTourStatus(statusParam) ? statusParam : ''
  const countryCode = readCountryParam(searchParams.get('cc'))
  const domesticOnly = searchParams.get('domestic') === '1'

  const [dialog, setDialog] = useState<DialogState>({ kind: 'closed' })
  const [savedViewsTick, setSavedViewsTick] = useState(0)

  const queryParams = useMemo<TourSearchParams>(
    () => ({
      ...DEFAULT_TOUR_SEARCH_PARAMS,
      page,
      size,
      keyword: keyword.trim() || undefined,
      status: status || undefined,
      destinationCountryCode: countryCode || undefined,
      domesticOnly: domesticOnly || undefined,
    }),
    [page, size, keyword, status, countryCode, domesticOnly],
  )

  const query = useToursQuery(queryParams)
  const createMutation = useCreateTour({
    onSuccess: () => {
      try {
        window.localStorage.removeItem(TOUR_CREATE_DRAFT_KEY)
      } catch {
        /* ignore */
      }
      setDialog({ kind: 'closed' })
    },
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

  useEffect(() => {
    if (searchParams.get('create') !== '1') return
    setDialog({ kind: 'create' })
    const next = new URLSearchParams(searchParams)
    next.delete('create')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (dialog.kind === 'edit') {
      recordAdminRecent({
        id: `tour-${dialog.tour.id}`,
        kind: 'tour',
        title: dialog.tour.name ?? dialog.tour.code ?? `#${dialog.tour.id}`,
        subtitle: dialog.tour.destinationName ?? undefined,
        path: '/management/tours',
      })
    }
    if (dialog.kind === 'schedules') {
      recordAdminRecent({
        id: `sched-${dialog.tour.id}`,
        kind: 'tour',
        title: `${String(t('tours.schedulesOpenLabel', { defaultValue: 'Lịch' }))} · ${dialog.tour.name ?? dialog.tour.code ?? `#${dialog.tour.id}`}`,
        path: '/management/tours',
      })
    }
  }, [dialog, t])

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

  const handleChangeCountry = useCallback(
    (cc: string) => {
      updateSearch((next) => {
        if (cc.length === 2) next.set('cc', cc)
        else next.delete('cc')
        next.set('page', '0')
      })
    },
    [updateSearch],
  )

  const handleChangeDomestic = useCallback(
    (next: boolean) => {
      updateSearch((nextParams) => {
        if (next) nextParams.set('domestic', '1')
        else nextParams.delete('domestic')
        nextParams.set('page', '0')
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

  const savedViews = useMemo(() => listTourSavedViews(), [savedViewsTick, searchParams])

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
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text,var(--color-text))]">
            {String(
              t('tours.pageTitle', { defaultValue: 'Quản lý Tours' }),
            )}
          </h1>
          <p className="max-w-2xl text-sm text-[var(--admin-muted,var(--color-muted))]">
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
          className="inline-flex items-center gap-2 rounded-[var(--admin-radius,8px)] bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--admin-shadow-sm,none)] transition hover:opacity-92 dark:text-[#1a1d21]"
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
        destinationCountryCode={countryCode}
        domesticOnly={domesticOnly}
        onChangeDestinationCountry={handleChangeCountry}
        onChangeDomesticOnly={handleChangeDomestic}
        countryOptions={TOUR_COUNTRY_OPTIONS}
      />

      <div className="flex flex-wrap items-center gap-2 rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm shadow-[var(--admin-shadow-sm)] dark:shadow-none">
        <span className="font-medium text-[var(--admin-text)]">{String(t('tours.facet.savedViews'))}</span>
        {savedViews.length === 0 ? (
          <span className="text-[var(--admin-muted)]">{String(t('tours.facet.noSavedViews'))}</span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {savedViews.map((v) => (
              <span
                key={v.id}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-muted)_6%,var(--admin-surface))] pl-2.5 pr-1 text-[12px]"
              >
                <button
                  type="button"
                  className="max-w-[140px] truncate font-medium text-[var(--admin-text)]"
                  onClick={() => setSearchParams(new URLSearchParams(v.query), { replace: true })}
                >
                  {v.name}
                </button>
                <button
                  type="button"
                  className="rounded-full p-1 text-[var(--admin-danger)] hover:bg-[color-mix(in_srgb,var(--admin-danger)_10%,var(--admin-surface))]"
                  aria-label={String(t('tours.facet.deleteView'))}
                  onClick={() => {
                    deleteTourSavedView(v.id)
                    setSavedViewsTick((x) => x + 1)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </span>
            ))}
          </div>
        )}
        <button
          type="button"
          className="ml-auto inline-flex items-center rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-2.5 py-1 text-[12px] font-semibold text-[var(--admin-primary)]"
          onClick={() => {
            const name = window.prompt(String(t('tours.facet.saveViewPrompt')))
            if (!name?.trim()) return
            saveTourViewFromQuery(name.trim(), searchParams.toString())
            setSavedViewsTick((x) => x + 1)
          }}
        >
          {String(t('tours.facet.saveView'))}
        </button>
      </div>

      {errorMessage ? (
        <div className="rounded-[var(--admin-radius,8px)] border border-[color-mix(in_srgb,var(--admin-danger,#dc3545)_45%,var(--admin-border,#dee2e6))] bg-[color-mix(in_srgb,var(--admin-danger,#dc3545)_10%,var(--admin-surface,#fff))] px-4 py-3 text-sm text-[var(--admin-danger,#b91c1c)] dark:text-[var(--admin-danger)]">
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

      <div className="admin-card overflow-hidden !p-0">
        <TourDataTable
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
          key="tour-create"
          draftStorageKey={TOUR_CREATE_DRAFT_KEY}
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
