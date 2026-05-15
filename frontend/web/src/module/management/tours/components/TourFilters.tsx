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

  destinationCountryCode?: string
  domesticOnly?: boolean
  onChangeDestinationCountry?: (code: string) => void
  onChangeDomesticOnly?: (value: boolean) => void
  countryOptions?: readonly string[]
}

const SEARCH_DEBOUNCE_MS = 350

function TourFilters(props: TourFiltersProps) {
  const { t } = useTranslation('management')
  const {
    keyword,
    status,
    isFetching,
    onChangeKeyword,
    onChangeStatus,
    onRefresh,
    destinationCountryCode = '',
    domesticOnly = false,
    onChangeDestinationCountry,
    onChangeDomesticOnly,
    countryOptions = [],
  } = props

  const [internalKeyword, setInternalKeyword] = useState(keyword)

  const showCountryFacet = typeof onChangeDestinationCountry === 'function'
  const showDomesticFacet = typeof onChangeDomesticOnly === 'function'

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
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 shadow-[var(--admin-shadow-sm)] dark:shadow-none">
        <label className="flex min-h-[40px] min-w-0 flex-1 basis-[200px] items-center gap-2">
          <Search className="h-4 w-4 shrink-0 text-[var(--admin-muted)]" aria-hidden />
          <input
            type="search"
            value={internalKeyword}
            placeholder={String(
              t('common.search', { defaultValue: 'Tìm kiếm' }),
            )}
            onChange={(event) => setInternalKeyword(event.target.value)}
            className="min-h-0 w-full min-w-0 border-0 bg-transparent py-1 text-sm text-[var(--admin-text)] outline-none ring-0 placeholder:text-[var(--admin-muted)]"
          />
        </label>

        <select
          value={status}
          onChange={(event) =>
            onChangeStatus((event.target.value || '') as TourStatusValue | '')
          }
          className="min-h-[40px] min-w-[140px] shrink-0 rounded-[var(--admin-radius-sm)] border-0 bg-[color-mix(in_srgb,var(--admin-muted)_8%,var(--admin-surface))] px-3 py-2 text-sm font-medium text-[var(--admin-text)] outline-none ring-0 focus-visible:ring-2 focus-visible:ring-[var(--admin-primary-dim)]"
        >
          <option value="">
            {String(t('tours.table.status'))}: —
          </option>
          {TOUR_STATUS_VALUES.map((s) => (
            <option key={s} value={s}>
              {String(t(`tours.status.${s}`))}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="admin-icon-btn inline-flex min-h-[40px] shrink-0 items-center gap-2 px-3 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <RefreshCw className="h-4 w-4" aria-hidden />
          )}
          {String(t('common.retry', { defaultValue: 'Thử lại' }))}
        </button>
      </div>

      {showCountryFacet || showDomesticFacet ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm shadow-[var(--admin-shadow-sm)] dark:shadow-none">
          {showCountryFacet ? (
            <label className="flex min-h-[40px] flex-wrap items-center gap-2 text-[var(--admin-text)]">
              <span className="shrink-0 font-medium text-[var(--admin-muted)]">
                {String(t('tours.facet.countryLabel'))}
              </span>
              <select
                value={destinationCountryCode}
                onChange={(event) =>
                  onChangeDestinationCountry?.(event.target.value)
                }
                className="min-h-[36px] min-w-[120px] rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-muted)_6%,var(--admin-surface))] px-2 py-1.5 text-sm font-medium text-[var(--admin-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary-dim)]"
              >
                <option value="">
                  {String(t('tours.facet.countryAll'))}
                </option>
                {countryOptions
                  .filter((code) => code.length > 0)
                  .map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
              </select>
            </label>
          ) : null}

          {showDomesticFacet ? (
            <label className="inline-flex cursor-pointer select-none items-center gap-2 text-[var(--admin-text)]">
              <input
                type="checkbox"
                checked={domesticOnly}
                onChange={(event) =>
                  onChangeDomesticOnly?.(event.target.checked)
                }
                className="h-4 w-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary-dim)]"
              />
              <span>{String(t('tours.facet.domesticLabel'))}</span>
            </label>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default TourFilters
