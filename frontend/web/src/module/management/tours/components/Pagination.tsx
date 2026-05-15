import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  page: number
  size: number
  totalElements: number
  totalPages: number
  isFetching?: boolean
  onChangePage: (page: number) => void
  onChangeSize?: (size: number) => void
  pageSizeOptions?: number[]
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

function Pagination(props: PaginationProps) {
  const { t } = useTranslation('management')
  const totalPages = Math.max(props.totalPages, 1)
  const sizeOptions = props.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS

  const goPrev = () => {
    if (props.page === 0 || props.isFetching) return
    props.onChangePage(props.page - 1)
  }
  const goNext = () => {
    if (props.page + 1 >= totalPages || props.isFetching) return
    props.onChangePage(props.page + 1)
  }

  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-muted)_6%,var(--admin-surface))] px-4 py-3 text-xs text-[var(--admin-muted)]">
      <span>
        {String(t('common.page'))} {props.page + 1} / {totalPages} ·{' '}
        {props.totalElements} {String(t('common.items'))}
      </span>

      <div className="flex items-center gap-2">
        {props.onChangeSize ? (
          <select
            value={props.size}
            onChange={(event) =>
              props.onChangeSize?.(Number(event.target.value))
            }
            className="admin-input rounded-[var(--admin-radius-sm)] px-2 py-1 text-xs text-[var(--admin-text)]"
          >
            {sizeOptions.map((option) => (
              <option key={option} value={option}>
                {option} / {String(t('common.page'))}
              </option>
            ))}
          </select>
        ) : null}

        <button
          type="button"
          onClick={goPrev}
          disabled={props.page === 0 || props.isFetching}
          aria-label="Previous page"
          className="admin-icon-btn inline-flex h-7 w-7 items-center justify-center !p-0 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={props.page + 1 >= totalPages || props.isFetching}
          aria-label="Next page"
          className="admin-icon-btn inline-flex h-7 w-7 items-center justify-center !p-0 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </footer>
  )
}

export default Pagination
