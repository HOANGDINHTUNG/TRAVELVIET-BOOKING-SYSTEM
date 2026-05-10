import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarPlus, Sparkles } from 'lucide-react'
import Modal from '../../../../components/ui/Modal'
import ConfirmDialog from '../../../../components/ui/ConfirmDialog'
import { handleApiError } from '../../../../lib/handleApiError'
import ScheduleTable from './ScheduleTable'
import ScheduleForm from './ScheduleForm'
import {
  useCancelSchedule,
  useCreateSchedule,
  useTourSchedulesQuery,
  useUpdateSchedule,
} from '../hooks/useSchedules'
import {
  scheduleResponseToFormDefaults,
  toSchedulePayload,
  type ScheduleRequestForm,
} from '../validation/scheduleSchema'
import type { TourScheduleResponse } from '../types/schedule'

type ScheduleManagerDrawerProps = {
  open: boolean
  tourId: number | null
  tourName?: string | null
  onClose: () => void
}

type InnerDialog =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; schedule: TourScheduleResponse }
  | { kind: 'cancel'; schedule: TourScheduleResponse }

/**
 * Modal lớn (size `xl`) hiển thị danh sách Schedules + form CRUD lồng.
 * - Mở từ TourTable action "Lịch khởi hành".
 * - 2 lớp dialog: bảng schedules ở ngoài + create/edit/cancel form ở trong.
 */
function ScheduleManagerDrawer(props: ScheduleManagerDrawerProps) {
  const { t } = useTranslation('management')
  const [inner, setInner] = useState<InnerDialog>({ kind: 'closed' })

  const query = useTourSchedulesQuery(props.tourId, {
    enabled: props.open && props.tourId != null,
  })

  const createMutation = useCreateSchedule({
    onSuccess: () => setInner({ kind: 'closed' }),
  })
  const updateMutation = useUpdateSchedule({
    onSuccess: () => setInner({ kind: 'closed' }),
  })
  const cancelMutation = useCancelSchedule({
    onSuccess: () => setInner({ kind: 'closed' }),
  })

  const handleSubmitCreate = useCallback(
    (form: ScheduleRequestForm) => {
      if (props.tourId == null) return
      createMutation.mutate({
        tourId: props.tourId,
        payload: toSchedulePayload(form),
      })
    },
    [createMutation, props.tourId],
  )

  const handleSubmitEdit = useCallback(
    (form: ScheduleRequestForm) => {
      if (props.tourId == null || inner.kind !== 'edit') return
      updateMutation.mutate({
        tourId: props.tourId,
        scheduleId: inner.schedule.id,
        payload: toSchedulePayload(form),
      })
    },
    [updateMutation, props.tourId, inner],
  )

  const handleConfirmCancel = useCallback(() => {
    if (props.tourId == null || inner.kind !== 'cancel') return
    cancelMutation.mutate({
      tourId: props.tourId,
      scheduleId: inner.schedule.id,
    })
  }, [cancelMutation, props.tourId, inner])

  const items: TourScheduleResponse[] = query.data ?? []
  const errorMessage = query.error
    ? handleApiError(
        query.error,
        String(
          t('tours.schedules.errorMessage', {
            defaultValue: 'Không thể tải danh sách đợt khởi hành.',
          }),
        ),
      )
    : null

  return (
    <>
      {/* Outer modal: list schedules */}
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="xl"
        title={String(
          t('tours.schedules.dialog.listTitle', {
            defaultValue: 'Lịch khởi hành',
          }),
        )}
        description={
          props.tourName
            ? String(
                t('tours.schedules.dialog.listSubtitle', {
                  defaultValue: 'Tour: {{name}}',
                  name: props.tourName,
                }),
              )
            : undefined
        }
        footer={
          <div className="flex justify-between gap-2">
            <span className="text-xs text-[var(--color-muted,#64748b)]">
              {String(t('common.items'))}: {items.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={props.onClose}
                className="rounded-md border border-[var(--color-border,#e2e8f0)] bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
              >
                {String(t('common.close'))}
              </button>
              <button
                type="button"
                onClick={() => setInner({ kind: 'create' })}
                disabled={props.tourId == null}
                className="inline-flex items-center gap-1 rounded-md bg-[var(--color-primary,#0ea5e9)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                <CalendarPlus className="h-3.5 w-3.5" aria-hidden />
                {String(t('tours.schedules.createButton'))}
              </button>
            </div>
          </div>
        }
      >
        {errorMessage ? (
          <div className="mb-3 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {errorMessage}
          </div>
        ) : null}

        <ScheduleTable
          items={items}
          isLoading={query.isPending}
          isFetching={query.isFetching}
          onEdit={(schedule) => setInner({ kind: 'edit', schedule })}
          onCancel={(schedule) => setInner({ kind: 'cancel', schedule })}
        />
      </Modal>

      {/* Inner: create */}
      <Modal
        open={inner.kind === 'create' && props.open}
        onClose={() => setInner({ kind: 'closed' })}
        dismissable={!createMutation.isPending}
        size="lg"
        title={String(t('tours.schedules.dialog.createTitle'))}
        description={String(t('tours.schedules.dialog.createSubtitle'))}
      >
        <ScheduleForm
          isSubmitting={createMutation.isPending}
          submitLabel={String(t('common.create'))}
          onSubmit={handleSubmitCreate}
          onCancel={() => setInner({ kind: 'closed' })}
        />
      </Modal>

      {/* Inner: edit */}
      <Modal
        open={inner.kind === 'edit' && props.open}
        onClose={() => setInner({ kind: 'closed' })}
        dismissable={!updateMutation.isPending}
        size="lg"
        title={String(t('tours.schedules.dialog.editTitle'))}
        description={String(t('tours.schedules.dialog.editSubtitle'))}
      >
        {inner.kind === 'edit' ? (
          <ScheduleForm
            defaultValues={scheduleResponseToFormDefaults(inner.schedule)}
            isSubmitting={updateMutation.isPending}
            submitLabel={String(t('common.save'))}
            onSubmit={handleSubmitEdit}
            onCancel={() => setInner({ kind: 'closed' })}
          />
        ) : null}
      </Modal>

      {/* Inner: cancel confirm */}
      <ConfirmDialog
        open={inner.kind === 'cancel' && props.open}
        isPending={cancelMutation.isPending}
        title={String(t('tours.schedules.dialog.cancelTitle'))}
        message={String(
          t('tours.schedules.dialog.cancelMessage', {
            defaultValue: 'Hành động này sẽ huỷ đợt khởi hành. Bạn có chắc chắn?',
            code: inner.kind === 'cancel' ? (inner.schedule.scheduleCode ?? `#${inner.schedule.id}`) : '',
          }),
        )}
        confirmLabel={String(t('tours.schedules.table.cancel'))}
        cancelLabel={String(t('common.cancel'))}
        onConfirm={handleConfirmCancel}
        onCancel={() => setInner({ kind: 'closed' })}
      />
    </>
  )
}

export default ScheduleManagerDrawer
