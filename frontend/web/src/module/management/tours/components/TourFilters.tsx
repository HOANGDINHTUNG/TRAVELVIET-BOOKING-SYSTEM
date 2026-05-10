import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, RefreshCw, Search } from 'lucide-react'
import {
  TOUR_STATUS_VALUES,
  type TourStatusValue,
} from '../validation/tourSchema'

type TourFiltersProps = {
  keyword: string
  status: TourStatusValue | ''
  isFetching: boolean
  onChangeKeyword: (value: string) => void
  onChangeStatus: (value: TourStatusValue | '') => void
  onRefresh: () => void
}

const SEARCH_DEBOUNCE_MS = 350

function TourFilters(props: TourFiltersProps) {
  const { t } = useTranslation('management')
  const { keyword, status, isFetching, onChangeKeyword, onChangeStatus, onRefresh } =
    props
  const [internalKeyword, setInternalKeyword] = useState(keyword)

  useEffect(() => {
    setInternalKeyword(keyword)
  }, [keyword])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = internalKeyword.trim()
      const cur = keyword.trim()
      if (next === cur) return
      onChangeKeyword(internalKeyword)
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
  }, [internalKeyword, keyword, onChangeKeyword])

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--color-border,#e2e8f0)] bg-white p-3">
      <label className="flex flex-1 items-center gap-2 rounded-md border border-[var(--color-border,#e2e8f0)] bg-[var(--color-page,#f8fafc)] px-3 py-2 text-sm">
        <Search
          className="h-4 w-4 text-[var(--color-muted,#64748b)]"
          aria-hidden
        />
        <input
          type="search"
          value={internalKeyword}
          placeholder={String(
            t('common.search', { defaultValue: 'Tìm kiếm' }),
          )}
          onChange={(event) => setInternalKeyword(event.target.value)}
          className="w-full bg-transparent outline-none"
        />
      </label>

      <select
        value={status}
        onChange={(event) =>
          onChangeStatus((event.target.value || '') as TourStatusValue | '')
        }
        className="rounded-md border border-[var(--color-border,#e2e8f0)] bg-white px-3 py-2 text-sm"
      >
        <option value="">
          {String(t('tours.table.status'))}: —
        </option>
        {TOUR_STATUS_VALUES.map((status) => (
          <option key={status} value={status}>
            {String(t(`tours.status.${status}`))}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border,#e2e8f0)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-page,#f1f5f9)] disabled:opacity-50"
      >
        {isFetching ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <RefreshCw className="h-4 w-4" aria-hidden />
        )}
        {String(t('common.retry', { defaultValue: 'Thử lại' }))}
      </button>
    </div>
  )
}

export default TourFilters
