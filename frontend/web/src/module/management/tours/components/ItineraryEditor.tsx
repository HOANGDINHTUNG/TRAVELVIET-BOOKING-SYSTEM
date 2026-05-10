import { useTranslation } from 'react-i18next'
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import type { TourRequestForm } from '../validation/tourSchema'

type ItineraryEditorProps = {
  control: Control<TourRequestForm>
  register: UseFormRegister<TourRequestForm>
  errors?: FieldErrors<TourRequestForm>['itineraryDays']
  disabled?: boolean
}

const FIELD_INPUT_CLASS =
  'w-full rounded-md border border-[var(--color-border,#cbd5e1)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

function localize(
  t: ReturnType<typeof useTranslation>['t'],
  message?: string,
): string | undefined {
  if (!message) return undefined
  return String(t(message, { defaultValue: message }))
}

/**
 * Quản lý lịch trình theo ngày của Tour bằng `useFieldArray`.
 * Bật `dayNumber` auto-increment khi thêm ngày mới (dựa vào `fields.length`).
 */
function ItineraryEditor(props: ItineraryEditorProps) {
  const { t } = useTranslation('management')
  const { fields, append, remove, swap } = useFieldArray({
    control: props.control,
    name: 'itineraryDays',
  })

  function addDay() {
    append({
      dayNumber: fields.length + 1,
      title: '',
      description: '',
      overnightDestinationId: undefined,
    })
  }

  function removeDay(index: number) {
    remove(index)
  }

  function moveUp(index: number) {
    if (index === 0) return
    swap(index - 1, index)
  }

  function moveDown(index: number) {
    if (index >= fields.length - 1) return
    swap(index + 1, index)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--color-muted,#64748b)]">
          {String(t('tours.itinerary.subtitle'))}
        </p>
        <button
          type="button"
          onClick={addDay}
          disabled={props.disabled}
          className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border,#e2e8f0)] bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          {String(t('tours.itinerary.addDay'))}
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-md border border-dashed border-[var(--color-border,#e2e8f0)] bg-slate-50 px-3 py-6 text-center text-xs text-[var(--color-muted,#64748b)]">
          {String(t('tours.itinerary.empty'))}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {fields.map((field, index) => {
            const dayErrors = props.errors?.[index]
            return (
              <li
                key={field.id}
                className="rounded-lg border border-[var(--color-border,#e2e8f0)] bg-white p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                    {String(t('tours.itinerary.dayLabel'))} {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={props.disabled || index === 0}
                      className="rounded border border-slate-200 px-2 py-0.5 text-xs disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={props.disabled || index === fields.length - 1}
                      className="rounded border border-slate-200 px-2 py-0.5 text-xs disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDay(index)}
                      disabled={props.disabled}
                      className="inline-flex items-center gap-1 rounded border border-rose-200 px-2 py-0.5 text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden />
                      {String(t('common.delete'))}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      {String(t('tours.itinerary.dayNumber'))}{' '}
                      <span className="text-rose-500">*</span>
                    </span>
                    <input
                      type="number"
                      min={1}
                      disabled={props.disabled}
                      {...props.register(
                        `itineraryDays.${index}.dayNumber` as const,
                        { valueAsNumber: true },
                      )}
                      className={FIELD_INPUT_CLASS}
                    />
                    {localize(t, dayErrors?.dayNumber?.message) ? (
                      <span className="text-xs text-rose-600" role="alert">
                        {localize(t, dayErrors?.dayNumber?.message)}
                      </span>
                    ) : null}
                  </label>

                  <label className="flex flex-col gap-1 md:col-span-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      {String(t('tours.itinerary.title'))}{' '}
                      <span className="text-rose-500">*</span>
                    </span>
                    <input
                      type="text"
                      maxLength={255}
                      disabled={props.disabled}
                      {...props.register(
                        `itineraryDays.${index}.title` as const,
                      )}
                      className={FIELD_INPUT_CLASS}
                    />
                    {localize(t, dayErrors?.title?.message) ? (
                      <span className="text-xs text-rose-600" role="alert">
                        {localize(t, dayErrors?.title?.message)}
                      </span>
                    ) : null}
                  </label>

                  <label className="flex flex-col gap-1 md:col-span-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      {String(t('tours.itinerary.description'))}
                    </span>
                    <textarea
                      rows={3}
                      disabled={props.disabled}
                      {...props.register(
                        `itineraryDays.${index}.description` as const,
                      )}
                      className={FIELD_INPUT_CLASS}
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      {String(t('tours.itinerary.overnightDestination'))}
                    </span>
                    <input
                      type="number"
                      min={1}
                      disabled={props.disabled}
                      {...props.register(
                        `itineraryDays.${index}.overnightDestinationId` as const,
                        {
                          setValueAs: (value) =>
                            value === '' || value == null
                              ? undefined
                              : Number(value),
                        },
                      )}
                      className={FIELD_INPUT_CLASS}
                    />
                  </label>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default ItineraryEditor
