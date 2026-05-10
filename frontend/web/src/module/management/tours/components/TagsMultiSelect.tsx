import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Tag as TagIcon } from 'lucide-react'
import { useTagsQuery } from '../../tags/hooks/useTagsQuery'

type TagsMultiSelectProps = {
  value: number[]
  onChange: (next: number[]) => void
  disabled?: boolean
}

const FIELD_INPUT_CLASS =
  'w-full rounded-md border border-[var(--color-border,#cbd5e1)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

function parseCsvIds(value: string): number[] {
  return Array.from(
    new Set(
      value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => Number(s))
        .filter((n) => Number.isFinite(n) && n > 0),
    ),
  )
}

/**
 * Multi-select tags. Khi `useTagsQuery` thành công ⇒ render checkbox grid.
 * Khi BE chưa expose endpoint ⇒ fallback ô CSV để user nhập IDs (1, 2, 3).
 */
function TagsMultiSelect(props: TagsMultiSelectProps) {
  const { t } = useTranslation('management')
  const query = useTagsQuery()

  const [csvInput, setCsvInput] = useState(props.value.join(', '))

  const tags = useMemo(() => query.data ?? [], [query.data])
  const selectedSet = useMemo(() => new Set(props.value), [props.value])

  function toggleTag(id: number) {
    const next = new Set(props.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    props.onChange([...next])
  }

  if (query.isPending) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-[var(--color-border,#e2e8f0)] bg-slate-50 px-3 py-2 text-xs text-[var(--color-muted,#64748b)]">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        {String(t('common.loading'))}
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <TagIcon className="h-3.5 w-3.5" aria-hidden />
          {String(t('tours.tags.beGapWarning'))}
        </div>
        <input
          type="text"
          value={csvInput}
          onChange={(event) => {
            setCsvInput(event.target.value)
            props.onChange(parseCsvIds(event.target.value))
          }}
          disabled={props.disabled}
          placeholder={String(t('tours.tags.csvPlaceholder'))}
          className={FIELD_INPUT_CLASS}
        />
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div className="rounded-md border border-[var(--color-border,#e2e8f0)] bg-slate-50 px-3 py-2 text-xs text-[var(--color-muted,#64748b)]">
        {String(t('common.empty'))}
      </div>
    )
  }

  // Group tag theo `tagGroup`
  const groups = new Map<string, typeof tags>()
  for (const tag of tags) {
    const key = tag.tagGroup ?? 'other'
    const arr = groups.get(key) ?? []
    arr.push(tag)
    groups.set(key, arr)
  }

  return (
    <div className="flex max-h-60 flex-col gap-3 overflow-y-auto rounded-md border border-[var(--color-border,#e2e8f0)] p-3">
      {[...groups.entries()].map(([group, list]) => (
        <div key={group} className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted,#64748b)]">
            {group}
          </p>
          <div className="flex flex-wrap gap-2">
            {list.map((tag) => {
              const checked = selectedSet.has(tag.id)
              return (
                <label
                  key={tag.id}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
                    checked
                      ? 'border-[var(--color-primary,#0ea5e9)] bg-[var(--color-primary,#0ea5e9)]/10 text-[var(--color-primary,#0ea5e9)]'
                      : 'border-[var(--color-border,#e2e8f0)] bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={props.disabled}
                    onChange={() => toggleTag(tag.id)}
                    className="sr-only"
                  />
                  <span>{tag.name ?? tag.code ?? `#${tag.id}`}</span>
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TagsMultiSelect
