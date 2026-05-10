import { useEffect, type ReactNode } from 'react'
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import PassengerPricesEditor from './PassengerPricesEditor'
import {
  EMPTY_SCHEDULE_FORM,
  scheduleRequestSchema,
  type ScheduleRequestForm,
} from '../validation/scheduleSchema'
import { SCHEDULE_STATUS_VALUES } from '../types/schedule'

type ScheduleFormProps = {
  defaultValues?: Partial<ScheduleRequestForm>
  isSubmitting?: boolean
  submitLabel?: string
  onSubmit: (form: ScheduleRequestForm) => void
  onCancel?: () => void
}

const FIELD_INPUT_CLASS =
  'w-full rounded-md border border-[var(--color-border,#cbd5e1)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

function fieldErrorMessage(
  t: ReturnType<typeof useTranslation>['t'],
  message?: string,
) {
  if (!message) return undefined
  return String(t(message, { defaultValue: message }))
}

function ScheduleForm(props: ScheduleFormProps) {
  const { t } = useTranslation('management')
  const isSubmitting = Boolean(props.isSubmitting)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ScheduleRequestForm>({
    resolver: zodResolver(scheduleRequestSchema),
    defaultValues: { ...EMPTY_SCHEDULE_FORM, ...props.defaultValues },
    mode: 'onBlur',
  })

  useEffect(() => {
    reset({ ...EMPTY_SCHEDULE_FORM, ...props.defaultValues })
  }, [props.defaultValues, reset])

  // useWatch tương thích React Compiler tốt hơn `watch()`.
  const watchedPrices = useWatch({ control, name: 'passengerPrices' })

  const onValid: SubmitHandler<ScheduleRequestForm> = (values) => {
    props.onSubmit(values)
  }

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="flex flex-col gap-5"
      noValidate
    >
      <Section title={String(t('tours.schedules.section.basic'))}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field
            label={String(t('tours.schedules.form.scheduleCode'))}
            error={fieldErrorMessage(t, errors.scheduleCode?.message)}
          >
            <input
              type="text"
              maxLength={50}
              disabled={isSubmitting}
              placeholder={String(t('tours.schedules.form.scheduleCodePlaceholder'))}
              {...register('scheduleCode')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
          <Field
            label={String(t('tours.schedules.form.status'))}
            error={fieldErrorMessage(t, errors.status?.message)}
          >
            <select
              disabled={isSubmitting}
              {...register('status')}
              className={FIELD_INPUT_CLASS}
            >
              {SCHEDULE_STATUS_VALUES.map((status) => (
                <option key={status} value={status}>
                  {String(t(`tours.schedules.status.${status}`))}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={String(t('tours.schedules.form.departureAt'))}
            required
            error={fieldErrorMessage(t, errors.departureAt?.message)}
          >
            <input
              type="datetime-local"
              disabled={isSubmitting}
              {...register('departureAt')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
          <Field
            label={String(t('tours.schedules.form.returnAt'))}
            required
            error={fieldErrorMessage(t, errors.returnAt?.message)}
          >
            <input
              type="datetime-local"
              disabled={isSubmitting}
              {...register('returnAt')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>

          <Field
            label={String(t('tours.schedules.form.bookingOpenAt'))}
            error={fieldErrorMessage(t, errors.bookingOpenAt?.message)}
          >
            <input
              type="datetime-local"
              disabled={isSubmitting}
              {...register('bookingOpenAt')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
          <Field
            label={String(t('tours.schedules.form.bookingCloseAt'))}
            error={fieldErrorMessage(t, errors.bookingCloseAt?.message)}
          >
            <input
              type="datetime-local"
              disabled={isSubmitting}
              {...register('bookingCloseAt')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
        </div>
      </Section>

      <Section title={String(t('tours.schedules.section.capacity'))}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Field
            label={String(t('tours.schedules.form.capacityTotal'))}
            required
            error={fieldErrorMessage(t, errors.capacityTotal?.message)}
          >
            <input
              type="number"
              min={1}
              disabled={isSubmitting}
              {...register('capacityTotal', { valueAsNumber: true })}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
          <Field
            label={String(t('tours.schedules.form.minGuestsToOperate'))}
            error={fieldErrorMessage(t, errors.minGuestsToOperate?.message)}
          >
            <input
              type="number"
              min={1}
              disabled={isSubmitting}
              {...register('minGuestsToOperate', {
                setValueAs: (value) =>
                  value === '' || value == null ? undefined : Number(value),
              })}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
          <Field
            label={String(t('tours.schedules.form.singleRoomSurcharge'))}
            error={fieldErrorMessage(t, errors.singleRoomSurcharge?.message)}
          >
            <input
              type="number"
              min={0}
              step="1000"
              disabled={isSubmitting}
              {...register('singleRoomSurcharge', {
                setValueAs: (value) =>
                  value === '' || value == null ? undefined : Number(value),
              })}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
        </div>
      </Section>

      <Section title={String(t('tours.schedules.section.passengerPrices'))}>
        <PassengerPricesEditor
          control={control}
          register={register}
          errors={errors.passengerPrices as never}
          watchedValues={watchedPrices}
          disabled={isSubmitting}
        />
        {fieldErrorMessage(t, errors.passengerPrices?.message) ? (
          <p className="mt-2 text-xs text-rose-600" role="alert">
            {fieldErrorMessage(t, errors.passengerPrices?.message)}
          </p>
        ) : null}
      </Section>

      <Section title={String(t('tours.schedules.section.meeting'))}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field
            label={String(t('tours.schedules.form.meetingAt'))}
            error={fieldErrorMessage(t, errors.meetingAt?.message)}
          >
            <input
              type="datetime-local"
              disabled={isSubmitting}
              {...register('meetingAt')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
          <Field
            label={String(t('tours.schedules.form.meetingPointName'))}
            error={fieldErrorMessage(t, errors.meetingPointName?.message)}
          >
            <input
              type="text"
              maxLength={255}
              disabled={isSubmitting}
              {...register('meetingPointName')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
          <div className="md:col-span-2">
            <Field
              label={String(t('tours.schedules.form.meetingAddress'))}
              error={fieldErrorMessage(t, errors.meetingAddress?.message)}
            >
              <input
                type="text"
                maxLength={500}
                disabled={isSubmitting}
                {...register('meetingAddress')}
                className={FIELD_INPUT_CLASS}
              />
            </Field>
          </div>
        </div>
      </Section>

      <Section title={String(t('tours.schedules.section.extras'))}>
        <div className="grid grid-cols-1 gap-3">
          <Field
            label={String(t('tours.schedules.form.transportDetail'))}
            error={fieldErrorMessage(t, errors.transportDetail?.message)}
          >
            <input
              type="text"
              maxLength={500}
              disabled={isSubmitting}
              {...register('transportDetail')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
          <Field
            label={String(t('tours.schedules.form.note'))}
            error={fieldErrorMessage(t, errors.note?.message)}
          >
            <textarea
              rows={3}
              maxLength={2000}
              disabled={isSubmitting}
              {...register('note')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
        </div>
      </Section>

      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
        {props.onCancel ? (
          <button
            type="button"
            onClick={props.onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-[var(--color-border,#e2e8f0)] bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            {String(t('common.cancel'))}
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--color-primary,#0ea5e9)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          {props.submitLabel ?? String(t('common.save'))}
        </button>
      </div>
    </form>
  )
}

type FieldProps = {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </span>
      {children}
      {error ? (
        <span className="text-xs text-rose-600" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}

type SectionProps = { title: string; children: ReactNode }
function Section({ title, children }: SectionProps) {
  return (
    <fieldset className="rounded-lg border border-[var(--color-border,#e2e8f0)] bg-slate-50/40 p-4">
      <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

export default ScheduleForm
