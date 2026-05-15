import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { adminPaletteActions } from '../config/adminPaletteActions'
import type { ManagementNavGroup } from '../config/managementNavigation'
import {
  adminShellNavItems,
  isAdminShellPathAllowed,
  type AdminShellNavItem,
} from '../config/adminShellNav'
import { readAdminRecent, recordAdminRecent, type AdminRecentEntry } from '../lib/adminRecentHistory'

export type AdminCommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  visibleGroups: ManagementNavGroup[]
  anchorRef: React.RefObject<HTMLElement | null>
}

type AnchorBox = {
  top: number
  left: number
  width: number
}

type FlatRow =
  | { kind: 'recent'; entry: AdminRecentEntry }
  | { kind: 'action'; action: (typeof adminPaletteActions)[number] }
  | { kind: 'nav'; item: AdminShellNavItem }

function pathAllowed(path: string, visibleGroups: ManagementNavGroup[]) {
  return isAdminShellPathAllowed(path, visibleGroups)
}

export function AdminCommandPalette({
  open,
  onOpenChange,
  visibleGroups,
  anchorRef,
}: AdminCommandPaletteProps) {
  const { t } = useTranslation('management')
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [box, setBox] = useState<AnchorBox>({ top: 0, left: 0, width: 320 })
  const [recentTick, setRecentTick] = useState(0)

  const navItems = useMemo(
    () => adminShellNavItems.filter((item) => pathAllowed(item.path, visibleGroups)),
    [visibleGroups],
  )

  const actionItems = useMemo(
    () => adminPaletteActions.filter((a) => pathAllowed(a.path, visibleGroups)),
    [visibleGroups],
  )

  const filteredNav = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return navItems
    return navItems.filter((item) => {
      const label = t(item.labelKey).toLowerCase()
      return (
        label.includes(q) ||
        item.path.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      )
    })
  }, [navItems, query, t])

  const filteredActions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return actionItems
    return actionItems.filter((a) => {
      const label = t(a.labelKey).toLowerCase()
      const kw = a.keywords.some((k) => k.includes(q) || q.includes(k))
      return label.includes(q) || kw || a.path.toLowerCase().includes(q)
    })
  }, [actionItems, query, t])

  const filteredRecent = useMemo(() => {
    const all = readAdminRecent()
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.subtitle?.toLowerCase().includes(q) ?? false) ||
        e.path.toLowerCase().includes(q),
    )
  }, [query, recentTick])

  const flatRows: FlatRow[] = useMemo(() => {
    const rows: FlatRow[] = []
    for (const entry of filteredRecent) rows.push({ kind: 'recent', entry })
    for (const action of filteredActions) rows.push({ kind: 'action', action })
    for (const item of filteredNav) rows.push({ kind: 'nav', item })
    return rows
  }, [filteredRecent, filteredActions, filteredNav])

  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, flatRows.length - 1)))
  }, [flatRows])

  const measure = useCallback(() => {
    const el = anchorRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const margin = 10
    const minW = 280
    const w = Math.min(Math.max(r.width, minW), window.innerWidth - margin * 2)
    const left = Math.min(Math.max(r.left, margin), window.innerWidth - margin - w)
    setBox({ top: r.bottom + 6, left, width: w })
  }, [anchorRef])

  const close = () => onOpenChange(false)

  const runNav = useCallback(
    (item: AdminShellNavItem) => {
      recordAdminRecent({
        id: `nav:${item.path}`,
        kind: 'route',
        title: t(item.labelKey),
        path: item.path,
      })
      setRecentTick((x) => x + 1)
      navigate(item.path)
      onOpenChange(false)
    },
    [navigate, onOpenChange, t],
  )

  const runAction = useCallback(
    (action: (typeof adminPaletteActions)[number]) => {
      recordAdminRecent({
        id: `action:${action.id}`,
        kind: 'route',
        title: t(action.labelKey),
        path: action.path,
      })
      setRecentTick((x) => x + 1)
      const search = action.search ? `?${action.search}` : ''
      navigate(`${action.path}${search}`)
      onOpenChange(false)
    },
    [navigate, onOpenChange, t],
  )

  const runRecent = useCallback(
    (entry: AdminRecentEntry) => {
      navigate(entry.path)
      onOpenChange(false)
    },
    [navigate, onOpenChange],
  )

  const runRow = useCallback(
    (row: FlatRow) => {
      if (row.kind === 'recent') runRecent(row.entry)
      else if (row.kind === 'action') runAction(row.action)
      else runNav(row.item)
    },
    [runAction, runNav, runRecent],
  )

  useLayoutEffect(() => {
    if (!open) return
    measure()
    const onScroll = () => measure()
    const onResize = () => measure()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    setQuery('')
    setActiveIndex(0)
    queueMicrotask(() => inputRef.current?.focus())
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [open, measure])

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return
      onOpenChange(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open, onOpenChange, anchorRef])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onOpenChange(false)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(flatRows.length - 1, i + 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(0, i - 1))
      }
      if (e.key === 'Enter' && flatRows[activeIndex]) {
        e.preventDefault()
        runRow(flatRows[activeIndex])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, flatRows, activeIndex, onOpenChange, runRow])

  if (!open) {
    return null
  }

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label={t('adminShell.commandPalette.title')}
      className="admin-command-palette flex max-h-[min(56vh,440px)] flex-col overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-surface)_94%,var(--admin-bg))] text-[var(--admin-text)] shadow-[var(--admin-shadow-md)] backdrop-blur-md"
      style={{
        position: 'fixed',
        top: box.top,
        left: box.left,
        width: box.width,
        zIndex: 80,
      }}
    >
      <div className="flex flex-col border-b border-[var(--admin-border)] px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--admin-primary)]">
              {t('adminShell.commandPalette.title')}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-[var(--admin-muted)]">
              {t('adminShell.commandPalette.subtitle')}
            </p>
          </div>
          <button
            type="button"
            className="admin-icon-btn inline-flex h-8 w-8 shrink-0 items-center justify-center !p-0"
            onClick={close}
            aria-label={t('common.close')}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('adminShell.commandPalette.inputPlaceholder')}
            className="admin-input h-9 w-full pl-10 pr-3 text-[13px] placeholder:text-[var(--admin-muted)]"
            aria-autocomplete="list"
            aria-controls="admin-command-palette-list"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5" id="admin-command-palette-list">
        {flatRows.length === 0 ? (
          <p className="px-2 py-5 text-center text-[13px] text-[var(--admin-muted)]">
            {t('adminShell.commandPalette.empty')}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredRecent.length > 0 ? (
              <div>
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--admin-primary)]">
                  {t('adminShell.commandPalette.recentSection')}
                </p>
                <ul className="space-y-0.5">
                  {filteredRecent.map((e) => {
                    const index = flatRows.findIndex((r) => r.kind === 'recent' && r.entry.id === e.id)
                    const active = index === activeIndex
                    return (
                      <li key={`r-${e.id}`}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => runRecent(e)}
                          className={[
                            'flex w-full items-center gap-2 rounded-[var(--admin-radius)] px-2.5 py-2 text-left text-[13px] font-medium transition-colors',
                            active
                              ? 'bg-[color-mix(in_srgb,var(--admin-primary)_18%,var(--admin-surface))] text-[var(--admin-text)]'
                              : 'text-[var(--admin-muted)] hover:bg-[color-mix(in_srgb,var(--admin-primary)_8%,var(--admin-surface))] hover:text-[var(--admin-text)]',
                          ].join(' ')}
                        >
                          <span className="min-w-0 flex-1 truncate">
                            <span className="block font-medium">{e.title}</span>
                            {e.subtitle ? (
                              <span className="block truncate text-[11px] text-[var(--admin-muted)]">{e.subtitle}</span>
                            ) : null}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}

            {filteredActions.length > 0 ? (
              <div>
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--admin-primary)]">
                  {t('adminShell.commandPalette.actionsSection')}
                </p>
                <ul className="space-y-0.5">
                  {filteredActions.map((a) => {
                    const index = flatRows.findIndex((r) => r.kind === 'action' && r.action.id === a.id)
                    const active = index === activeIndex
                    const Icon = a.icon
                    return (
                      <li key={`a-${a.id}`}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => runAction(a)}
                          className={[
                            'flex w-full items-center gap-2 rounded-[var(--admin-radius)] px-2.5 py-2 text-left text-[13px] font-medium transition-colors',
                            active
                              ? 'bg-[color-mix(in_srgb,var(--admin-primary)_18%,var(--admin-surface))] text-[var(--admin-text)]'
                              : 'text-[var(--admin-muted)] hover:bg-[color-mix(in_srgb,var(--admin-primary)_8%,var(--admin-surface))] hover:text-[var(--admin-text)]',
                          ].join(' ')}
                        >
                          <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                          <span className="min-w-0 flex-1 truncate">{t(a.labelKey)}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}

            {filteredNav.length > 0 ? (
              <div>
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--admin-muted)]">
                  {t('adminShell.commandPalette.navSection')}
                </p>
                <ul className="space-y-0.5">
                  {filteredNav.map((item) => {
                    const index = flatRows.findIndex((r) => r.kind === 'nav' && r.item.id === item.id)
                    const active = index === activeIndex
                    const Icon = item.icon
                    return (
                      <li key={`n-${item.id}`}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => runNav(item)}
                          className={[
                            'flex w-full items-center gap-2 rounded-[var(--admin-radius)] px-2.5 py-2 text-left text-[13px] font-medium transition-colors',
                            active
                              ? 'bg-[color-mix(in_srgb,var(--admin-primary)_18%,var(--admin-surface))] text-[var(--admin-text)]'
                              : 'text-[var(--admin-muted)] hover:bg-[color-mix(in_srgb,var(--admin-primary)_8%,var(--admin-surface))] hover:text-[var(--admin-text)]',
                          ].join(' ')}
                        >
                          <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                          <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
                          <span className="hidden shrink-0 font-mono text-[10px] text-[var(--admin-muted)] sm:inline">
                            {item.path}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <p className="border-t border-[var(--admin-border)] px-3 py-1.5 text-[10px] text-[var(--admin-muted)]">
        {t('adminShell.commandPalette.hint')}
      </p>
    </div>
  )

  return createPortal(panel, document.body)
}
