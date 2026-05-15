import type { DestinationDetailCopy } from '../../utils/destinationDetailCopy'
import { useActiveSection } from './useActiveSection'

export type TocItem = { id: string; label: string }

type DestinationTocSidebarProps = {
  items: TocItem[]
  copy: DestinationDetailCopy
}

export function DestinationTocSidebar({ items, copy }: DestinationTocSidebarProps) {
  const ids = items.map((i) => i.id)
  const activeId = useActiveSection(ids)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label={copy.detailTocTitle}
      className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm backdrop-blur-md"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {copy.detailTocTitle}
      </p>
      <ul className="mt-3 space-y-1">
        {items.map((item) => {
          const active = activeId === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  active
                    ? 'bg-teal-500/15 font-semibold text-teal-900 ring-1 ring-teal-500/25'
                    : 'text-slate-700 hover:bg-slate-100/80'
                }`}
                aria-current={active ? 'true' : undefined}
              >
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
