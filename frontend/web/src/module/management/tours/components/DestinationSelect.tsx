import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, MapPin, X } from 'lucide-react'
import { useDestinationSearch } from '../../destinations/hooks/useDestinationSearch'
import type { DestinationLookupItem } from '../../destinations/types/destination'

type DestinationSelectProps = {
  /** Giá trị `Long destinationId` đang chọn (BE expect số). */
  value: number | null | undefined
  onChange: (value: number | null) => void
  /** Tên hiển thị ban đầu khi load form edit (lấy từ TourResponse.destinationName). */
  initialDisplay?: string | null
  disabled?: boolean
  error?: string
  required?: boolean
}

const FIELD_INPUT_CLASS =
  'w-full rounded-md border border-[var(--color-border,#cbd5e1)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

/**
 * Combobox chọn điểm đến — autocomplete `GET /destinations?keyword=`.
 *
 * ⚠️ BE GAP: `DestinationPublicResponse` chưa expose `Long id`.
 * Khi user chọn 1 item mà không có `id`, FE fallback về numeric input để user
 * nhập tay. Khi BE bổ sung field `id`, autocomplete sẽ tự động hoạt động trọn vẹn.
 */
function DestinationSelect(props: DestinationSelectProps) {
  const { t } = useTranslation('management')
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const search = useDestinationSearch(keyword, 8)
  const items = useMemo(() => search.data?.content ?? [], [search.data])

  /** Display trong input chính (read-only khi đã chọn).
   *  Đồng bộ lại khi `initialDisplay` đổi (vd: chuyển từ tour này sang tour khác
   *  trong cùng modal). Dùng pattern "Adjusting state during render" (React 19)
   *  thay vì useEffect → setState để tránh cascading renders.
   */
  const [display, setDisplay] = useState<string>(props.initialDisplay ?? '')
  const [prevInitial, setPrevInitial] = useState<string | null | undefined>(
    props.initialDisplay,
  )
  if (prevInitial !== props.initialDisplay) {
    setPrevInitial(props.initialDisplay)
    setDisplay(props.initialDisplay ?? '')
  }

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function handleSelect(item: DestinationLookupItem) {
    if (item.id == null) {
      // BE chưa expose id — không thể bind, hướng dẫn user nhập tay.
      // (silent: không bind, để user thấy thông báo gap dưới.)
      return
    }
    props.onChange(item.id)
    setDisplay(`${item.name ?? '—'}${item.province ? ` · ${item.province}` : ''}`)
    setKeyword('')
    setOpen(false)
  }

  function handleClear() {
    props.onChange(null)
    setDisplay('')
    setKeyword('')
  }

  const hasMissingIdFromBe = items.length > 0 && items.every((it) => it.id == null)

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      {/* Display + clear */}
      <div className="relative">
        <div
          className={`flex items-center gap-2 ${FIELD_INPUT_CLASS} ${
            props.disabled ? '' : 'cursor-pointer'
          }`}
          onClick={() => !props.disabled && setOpen(true)}
          role="combobox"
          aria-expanded={open}
        >
          <MapPin className="h-4 w-4 text-[var(--color-muted,#64748b)]" aria-hidden />
          <span className="flex-1 truncate text-sm">
            {display || (
              <span className="text-[var(--color-muted,#94a3b8)]">
                {String(t('tours.destinationSelect.placeholder'))}
              </span>
            )}
          </span>
          {props.value != null ? (
            <span className="text-xs text-[var(--color-muted,#64748b)]">
              #{props.value}
            </span>
          ) : null}
          {props.value != null && !props.disabled ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="rounded p-1 text-slate-400 hover:bg-slate-100"
              aria-label={String(t('common.cancel'))}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          ) : null}
        </div>

        {/* Dropdown */}
        {open && !props.disabled ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-md border border-[var(--color-border,#e2e8f0)] bg-white shadow-lg">
            <div className="border-b border-slate-100 p-2">
              <input
                autoFocus
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={String(t('tours.destinationSelect.searchPlaceholder'))}
                className={FIELD_INPUT_CLASS}
              />
            </div>
            <div className="max-h-72 overflow-y-auto">
              {search.isFetching ? (
                <div className="flex items-center justify-center gap-2 px-3 py-4 text-xs text-[var(--color-muted,#64748b)]">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {String(t('common.loading'))}
                </div>
              ) : keyword.trim().length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-[var(--color-muted,#64748b)]">
                  {String(t('tours.destinationSelect.hint'))}
                </div>
              ) : items.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-[var(--color-muted,#64748b)]">
                  {String(t('common.empty'))}
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const disabled = item.id == null
                    return (
                      <li key={item.uuid}>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => handleSelect(item)}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-[var(--color-page,#f1f5f9)] disabled:cursor-not-allowed disabled:opacity-60 ${
                            item.id === props.value
                              ? 'bg-[var(--color-primary,#0ea5e9)]/10'
                              : ''
                          }`}
                        >
                          <span className="flex-1">
                            <span className="block font-medium">
                              {item.name ?? '—'}
                            </span>
                            <span className="text-xs text-[var(--color-muted,#64748b)]">
                              {item.province ?? '—'}
                              {item.countryCode ? ` · ${item.countryCode}` : ''}
                              {item.id != null ? ` · #${item.id}` : ''}
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Fallback numeric input — luôn hiển thị để user override khi cần. */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wide text-[var(--color-muted,#94a3b8)]">
          {String(t('tours.destinationSelect.manualLabel'))}
        </span>
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={props.value ?? ''}
          onChange={(event) => {
            const next = event.target.value
            if (next === '') {
              props.onChange(null)
              setDisplay('')
              return
            }
            const parsed = Number(next)
            if (Number.isFinite(parsed) && parsed > 0) {
              props.onChange(parsed)
            }
          }}
          disabled={props.disabled}
          required={props.required}
          className={`w-32 ${FIELD_INPUT_CLASS}`}
        />
      </div>

      {hasMissingIdFromBe ? (
        <span
          className="text-[10px] text-amber-600"
          role="status"
        >
          {String(t('tours.destinationSelect.beGapWarning'))}
        </span>
      ) : null}

      {props.error ? (
        <span className="text-xs text-rose-600" role="alert">
          {props.error}
        </span>
      ) : null}
    </div>
  )
}

export default DestinationSelect
