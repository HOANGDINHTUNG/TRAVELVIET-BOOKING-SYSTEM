import { useTranslation } from 'react-i18next'
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { PASSENGER_TYPES, type PassengerType } from '../types/schedule'
import { formatCurrencyVnd } from '../utils/currency'
import type { ScheduleRequestForm } from '../validation/scheduleSchema'

type PassengerPricesEditorProps = {
  control: Control<ScheduleRequestForm>
  register: UseFormRegister<ScheduleRequestForm>
  errors?: FieldErrors<ScheduleRequestForm>['passengerPrices']
  /** Watch giá để hiển thị format VND */
  watchedValues?: Array<{ passengerType: PassengerType; price: number }>
  disabled?: boolean
}

const FIELD_INPUT_CLASS =
  'w-full rounded-md border border-[var(--color-border,#cbd5e1)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

function localize(
  t: ReturnType<typeof useTranslation>['t'],
  message?: string,
) {
  if (!message) return undefined
  return String(t(message, { defaultValue: message }))
}

/**
 * Quản lý bảng giá theo loại khách bằng `useFieldArray`.
 * Cho phép Admin tự do thêm/xoá nhưng đảm bảo phải có ít nhất 1 dòng "adult".
 */
function PassengerPricesEditor(props: PassengerPricesEditorProps) {
  const { t } = useTranslation('management')
  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: 'passengerPrices',
  })

  /** Loại khách chưa được dùng — gợi ý append. */
  const usedTypes = new Set(
    (props.watchedValues ?? []).map((v) => v.passengerType),
  )
  const availableTypes = PASSENGER_TYPES.filter((t) => !usedTypes.has(t))

  function addRow(type?: PassengerType) {
    append({
      passengerType: type ?? availableTypes[0] ?? 'adult',
      price: 0,
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--color-muted,#64748b)]">
          {String(t('tours.schedules.passenger.subtitle'))}
        </p>
        <div className="flex flex-wrap items-center gap-1">
          {availableTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addRow(type)}
              disabled={props.disabled}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-50"
            >
              <Plus className="h-3 w-3" aria-hidden />
              {String(t(`tours.schedules.passenger.types.${type}`))}
            </button>
          ))}
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-md border border-dashed border-rose-200 bg-rose-50 px-3 py-3 text-center text-xs text-rose-700">
          {String(t('tours.schedules.passenger.empty'))}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {fields.map((field, index) => {
            const rowErrors = props.errors?.[index]
            const watchedPrice = props.watchedValues?.[index]?.price ?? 0
            return (
              <li
                key={field.id}
                className="grid grid-cols-1 items-center gap-2 rounded-md border border-[var(--color-border,#e2e8f0)] bg-white p-2 md:grid-cols-[160px_1fr_auto_auto]"
              >
                <select
                  disabled={props.disabled}
                  {...props.register(
                    `passengerPrices.${index}.passengerType` as const,
                  )}
                  className={FIELD_INPUT_CLASS}
                >
                  {PASSENGER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {String(t(`tours.schedules.passenger.types.${type}`))}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  step="1000"
                  disabled={props.disabled}
                  {...props.register(`passengerPrices.${index}.price` as const, {
                    valueAsNumber: true,
                  })}
                  className={FIELD_INPUT_CLASS}
                />
                <span className="px-2 text-xs font-medium text-slate-500">
                  {formatCurrencyVnd(watchedPrice)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={props.disabled}
                  className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" aria-hidden />
                </button>
                {localize(t, rowErrors?.price?.message) ? (
                  <span
                    className="col-span-full text-[11px] text-rose-600"
                    role="alert"
                  >
                    {localize(t, rowErrors?.price?.message)}
                  </span>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default PassengerPricesEditor
