import { useEffect, useState, type ReactNode } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import DestinationSelect from './DestinationSelect'
import TagsMultiSelect from './TagsMultiSelect'
import MediaUploader from './MediaUploader'
import ItineraryEditor from './ItineraryEditor'
import {
  EMPTY_TOUR_FORM,
  TOUR_STATUS_VALUES,
  tourRequestSchema,
  type TourRequestForm,
} from '../validation/tourSchema'

type TourFormProps = {
  defaultValues?: Partial<TourRequestForm>
  /** Tên điểm đến hiển thị ban đầu khi edit (lấy từ TourResponse.destinationName). */
  initialDestinationName?: string | null
  isSubmitting?: boolean
  submitLabel?: string
  onCancel?: () => void
  onSubmit: (form: TourRequestForm) => void
}

function fieldErrorMessage(
  t: ReturnType<typeof useTranslation>['t'],
  message?: string,
) {
  if (!message) return undefined
  // Tất cả message từ schema đều là i18n key (vd: tours.validation.codeRequired).
  return String(t(message, { defaultValue: message }))
}

const FIELD_INPUT_CLASS =
  'w-full rounded-md border border-[var(--color-border,#cbd5e1)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

function TourForm(props: TourFormProps) {
  const { t } = useTranslation('management')

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TourRequestForm>({
    resolver: zodResolver(tourRequestSchema),
    defaultValues: { ...EMPTY_TOUR_FORM, ...props.defaultValues },
    mode: 'onBlur',
  })

  /** Trạng thái upload media — chặn Submit khi đang upload để tránh save thiếu URL. */
  const [isUploadingMedia, setUploadingMedia] = useState(false)

  useEffect(() => {
    reset({ ...EMPTY_TOUR_FORM, ...props.defaultValues })
  }, [props.defaultValues, reset])

  const onValid: SubmitHandler<TourRequestForm> = (values) => {
    if (isUploadingMedia) return
    props.onSubmit(values)
  }

  const isSubmitting = Boolean(props.isSubmitting)
  const isFormDisabled = isSubmitting || isUploadingMedia

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label={String(t('tours.form.code'))}
          required
          error={fieldErrorMessage(t, errors.code?.message)}
        >
          <input
            type="text"
            autoComplete="off"
            placeholder={String(t('tours.form.codePlaceholder'))}
            disabled={isFormDisabled}
            {...register('code')}
            className={FIELD_INPUT_CLASS}
          />
        </Field>

        <Field
          label={String(t('tours.form.slug'))}
          required
          error={fieldErrorMessage(t, errors.slug?.message)}
        >
          <input
            type="text"
            autoComplete="off"
            placeholder={String(t('tours.form.slugPlaceholder'))}
            disabled={isFormDisabled}
            {...register('slug')}
            className={FIELD_INPUT_CLASS}
          />
        </Field>

        <div className="md:col-span-2">
          <Field
            label={String(t('tours.form.name'))}
            required
            error={fieldErrorMessage(t, errors.name?.message)}
          >
            <input
              type="text"
              placeholder={String(t('tours.form.namePlaceholder'))}
              disabled={isFormDisabled}
              {...register('name')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field
            label={String(t('tours.form.destinationId'))}
            required
            error={fieldErrorMessage(t, errors.destinationId?.message)}
          >
            <Controller
              control={control}
              name="destinationId"
              render={({ field }) => (
                <DestinationSelect
                  value={field.value}
                  onChange={(next) => field.onChange(next ?? 0)}
                  initialDisplay={props.initialDestinationName ?? null}
                  disabled={isFormDisabled}
                  required
                />
              )}
            />
          </Field>
        </div>

        <Field
          label={String(t('tours.form.cancellationPolicyId'))}
          error={fieldErrorMessage(t, errors.cancellationPolicyId?.message)}
        >
          <input
            type="number"
            min={1}
            disabled={isFormDisabled}
            {...register('cancellationPolicyId', {
              setValueAs: (value) =>
                value === '' || value == null ? undefined : Number(value),
            })}
            className={FIELD_INPUT_CLASS}
          />
        </Field>

        <Field
          label={String(t('tours.form.basePrice'))}
          required
          error={fieldErrorMessage(t, errors.basePrice?.message)}
        >
          <input
            type="number"
            min={0}
            step="1"
            disabled={isFormDisabled}
            {...register('basePrice', { valueAsNumber: true })}
            className={FIELD_INPUT_CLASS}
          />
        </Field>

        <Field
          label={String(t('tours.form.currency'))}
          error={fieldErrorMessage(t, errors.currency?.message)}
        >
          <input
            type="text"
            maxLength={3}
            disabled={isFormDisabled}
            {...register('currency')}
            className={`${FIELD_INPUT_CLASS} uppercase`}
          />
        </Field>

        <Field
          label={String(t('tours.form.durationDays'))}
          required
          error={fieldErrorMessage(t, errors.durationDays?.message)}
        >
          <input
            type="number"
            min={1}
            disabled={isFormDisabled}
            {...register('durationDays', { valueAsNumber: true })}
            className={FIELD_INPUT_CLASS}
          />
        </Field>

        <Field
          label={String(t('tours.form.durationNights'))}
          error={fieldErrorMessage(t, errors.durationNights?.message)}
        >
          <input
            type="number"
            min={0}
            disabled={isFormDisabled}
            {...register('durationNights', {
              setValueAs: (value) =>
                value === '' || value == null ? undefined : Number(value),
            })}
            className={FIELD_INPUT_CLASS}
          />
        </Field>

        <Field
          label={String(t('tours.form.transportType'))}
          error={fieldErrorMessage(t, errors.transportType?.message)}
        >
          <input
            type="text"
            maxLength={120}
            disabled={isFormDisabled}
            {...register('transportType')}
            className={FIELD_INPUT_CLASS}
          />
        </Field>

        <Field
          label={String(t('tours.form.tripMode'))}
          error={fieldErrorMessage(t, errors.tripMode?.message)}
        >
          <input
            type="text"
            maxLength={50}
            disabled={isFormDisabled}
            {...register('tripMode')}
            className={FIELD_INPUT_CLASS}
          />
        </Field>

        <Field
          label={String(t('tours.form.status'))}
          error={fieldErrorMessage(t, errors.status?.message)}
        >
          <select
            disabled={isFormDisabled}
            {...register('status')}
            className={FIELD_INPUT_CLASS}
          >
            {TOUR_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {String(t(`tours.status.${status}`))}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-center gap-2 self-end pb-2">
          <input
            id="tour-is-featured"
            type="checkbox"
            disabled={isFormDisabled}
            {...register('isFeatured')}
            className="h-4 w-4"
          />
          <label
            htmlFor="tour-is-featured"
            className="text-sm font-medium text-slate-700"
          >
            {String(t('tours.form.isFeatured'))}
          </label>
        </div>

        <div className="md:col-span-2">
          <Field
            label={String(t('tours.form.shortDescription'))}
            error={fieldErrorMessage(t, errors.shortDescription?.message)}
          >
            <textarea
              rows={2}
              disabled={isFormDisabled}
              {...register('shortDescription')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field
            label={String(t('tours.form.description'))}
            error={fieldErrorMessage(t, errors.description?.message)}
          >
            <textarea
              rows={4}
              disabled={isFormDisabled}
              {...register('description')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field
            label={String(t('tours.form.highlights'))}
            error={fieldErrorMessage(t, errors.highlights?.message)}
          >
            <textarea
              rows={2}
              disabled={isFormDisabled}
              {...register('highlights')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
        </div>

        <Field
          label={String(t('tours.form.inclusions'))}
          error={fieldErrorMessage(t, errors.inclusions?.message)}
        >
          <textarea
            rows={2}
            disabled={isFormDisabled}
            {...register('inclusions')}
            className={FIELD_INPUT_CLASS}
          />
        </Field>

        <Field
          label={String(t('tours.form.exclusions'))}
          error={fieldErrorMessage(t, errors.exclusions?.message)}
        >
          <textarea
            rows={2}
            disabled={isFormDisabled}
            {...register('exclusions')}
            className={FIELD_INPUT_CLASS}
          />
        </Field>

        <div className="md:col-span-2">
          <Field
            label={String(t('tours.form.notes'))}
            error={fieldErrorMessage(t, errors.notes?.message)}
          >
            <textarea
              rows={2}
              disabled={isFormDisabled}
              {...register('notes')}
              className={FIELD_INPUT_CLASS}
            />
          </Field>
        </div>
      </div>

      {/* ----------------- Tags ----------------- */}
      <Section title={String(t('tours.form.tags'))}>
        <Controller
          control={control}
          name="tagIds"
          render={({ field }) => (
            <TagsMultiSelect
              value={field.value ?? []}
              onChange={(next) => field.onChange(next)}
              disabled={isFormDisabled}
            />
          )}
        />
      </Section>

      {/* ----------------- Media ----------------- */}
      <Section title={String(t('tours.form.media'))}>
        <Controller
          control={control}
          name="media"
          render={({ field }) => (
            <MediaUploader
              value={field.value ?? []}
              onChange={(next) => field.onChange(next)}
              onUploadingChange={setUploadingMedia}
              disabled={isFormDisabled}
            />
          )}
        />
      </Section>

      {/* ----------------- Itinerary ----------------- */}
      <Section title={String(t('tours.form.itinerary'))}>
        <ItineraryEditor
          control={control}
          register={register}
          errors={errors.itineraryDays}
          disabled={isFormDisabled}
        />
      </Section>

      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
        {props.onCancel ? (
          <button
            type="button"
            onClick={props.onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-[var(--color-border,#e2e8f0)] bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            {String(t('common.cancel', { defaultValue: 'Huỷ' }))}
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isFormDisabled}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--color-primary,#0ea5e9)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          {isUploadingMedia
            ? String(t('tours.upload.waitForUpload'))
            : (props.submitLabel ??
              String(t('common.save', { defaultValue: 'Lưu' })))}
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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
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

type SectionProps = {
  title: string
  children: ReactNode
}

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

export default TourForm
