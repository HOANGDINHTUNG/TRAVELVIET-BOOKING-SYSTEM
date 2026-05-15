import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  SunMedium,
  UserRound,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { setTheme } from '../../../stores/slices/preferencesSlice'
import type { UserAccessContext } from '../../auth/api/authApi'
import { adminShellNavItems, isAdminShellPathAllowed } from '../config/adminShellNav'
import type { ManagementNavGroup } from '../config/managementNavigation'
import { AdminCommandPalette } from './AdminCommandPalette'
import AdminHealthDot from './AdminHealthDot'
import './adminShell.css'

const NOTIF_READ_STORAGE = 'tv-admin-notif-read-ids'

type DemoNotif = {
  id: string
  titleKey: string
  bodyKey: string
  path: string
}

const DEMO_NOTIFS: DemoNotif[] = [
  {
    id: 'demo-paid',
    titleKey: 'adminShell.notif.samplePaidTitle',
    bodyKey: 'adminShell.notif.samplePaidBody',
    path: '/management/bookings',
  },
  {
    id: 'demo-new',
    titleKey: 'adminShell.notif.sampleNewTitle',
    bodyKey: 'adminShell.notif.sampleNewBody',
    path: '/management/bookings',
  },
]

function readNotifReadIds(): Set<string> {
  try {
    const raw = window.localStorage.getItem(NOTIF_READ_STORAGE)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((x): x is string => typeof x === 'string'))
  } catch {
    return new Set()
  }
}

function writeNotifReadIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(NOTIF_READ_STORAGE, JSON.stringify([...ids]))
  } catch {
    /* ignore */
  }
}

export type AdminLayoutProps = {
  children: React.ReactNode
  accessContext: UserAccessContext | null
  accessError: string | null
  displayName: string
  isAccessLoading: boolean
  onLogout: () => void
  roleSummary: string
  visibleGroups: ManagementNavGroup[]
}

export default function AdminLayout({
  children,
  accessContext,
  accessError,
  displayName,
  isAccessLoading,
  onLogout,
  roleSummary,
  visibleGroups,
}: AdminLayoutProps) {
  const { t } = useTranslation('management')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useAppSelector((s) => s.preferences.theme)
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [notifReadIds, setNotifReadIds] = useState<Set<string>>(() =>
    typeof window !== 'undefined' ? readNotifReadIds() : new Set(),
  )
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const quickNavAnchorRef = useRef<HTMLDivElement>(null)

  const navItems = useMemo(
    () =>
      adminShellNavItems.filter((item) => isAdminShellPathAllowed(item.path, visibleGroups)),
    [visibleGroups],
  )

  useEffect(() => {
    if (!notifOpen && !profileOpen) return undefined
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!notifRef.current?.contains(target)) setNotifOpen(false)
      if (!profileRef.current?.contains(target)) setProfileOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [notifOpen, profileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const unreadNotifCount = useMemo(
    () => DEMO_NOTIFS.filter((n) => !notifReadIds.has(n.id)).length,
    [notifReadIds],
  )

  const markNotifRead = (id: string) => {
    setNotifReadIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      writeNotifReadIds(next)
      return next
    })
  }

  const markAllNotifsRead = () => {
    const next = new Set(DEMO_NOTIFS.map((n) => n.id))
    setNotifReadIds(next)
    writeNotifReadIds(next)
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    if (!q) return
    navigate(`/management/tours?q=${encodeURIComponent(q)}`)
    setSearch('')
  }

  return (
    <div className="admin-shell admin-shell--glass flex h-dvh max-h-dvh min-h-0 overflow-hidden bg-[var(--admin-bg)] text-[var(--admin-text)] transition-colors duration-300 ease-out">
      <aside
        className={`admin-shell-sidebar flex h-full max-h-dvh min-h-0 shrink-0 flex-col overflow-hidden border-r border-[var(--admin-border)] transition-[width] duration-300 ease-out ${
          collapsed ? 'w-[76px]' : 'w-[clamp(240px,20vw,300px)]'
        }`}
        aria-label={t('adminShell.sidebarNavAria')}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[var(--admin-border)] px-3">
          <Link
            to="/management/dashboard"
            className={`flex min-w-0 items-center gap-2 font-semibold tracking-tight ${collapsed ? 'justify-center' : ''}`}
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--admin-radius)] bg-gradient-to-br from-[#17a2b8] to-[#117a8b] text-sm font-bold text-white shadow-[var(--admin-shadow-sm)] dark:from-[#20c997] dark:to-[#169b7a] dark:text-[#1a1d21]">
              TV
            </span>
            {!collapsed ? (
              <span className="truncate text-[13px] leading-tight">
                {t('adminShell.brandTitle')}
                <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--admin-secondary)]">
                  {t('adminShell.brandSubtitle')}
                </span>
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="admin-icon-btn inline-flex h-8 w-8 flex-shrink-0 items-center justify-center !p-0"
            aria-label={collapsed ? t('adminShell.expandSidebar') : t('adminShell.collapseSidebar')}
            title={collapsed ? t('adminShell.expandShort') : t('adminShell.collapseShort')}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden />
            ) : (
              <PanelLeftClose className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col space-y-1 overflow-y-auto overflow-x-hidden px-2 py-4 overscroll-contain">
          {isAccessLoading ? (
            <p className="px-2 text-[11px] text-[var(--admin-muted)]">{t('adminShell.permissionsLoading')}</p>
          ) : null}
          {accessError ? (
            <p className="rounded-[var(--admin-radius)] border border-[color-mix(in_srgb,var(--admin-danger)_45%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-danger)_10%,var(--admin-surface))] px-2 py-2 text-[11px] text-[var(--admin-danger)]">
              {accessError}
            </p>
          ) : null}

          {!isAccessLoading &&
            !accessError &&
            navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  title={collapsed ? t(item.labelKey) : undefined}
                  className={({ isActive }) =>
                    [
                      'admin-nav-link group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium',
                      collapsed ? 'justify-center px-0' : '',
                      isActive ? 'admin-nav-link--active' : '',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="h-[18px] w-[18px] flex-shrink-0 opacity-95" aria-hidden />
                      {!collapsed ? <span className="truncate">{t(item.labelKey)}</span> : null}
                      {!collapsed ? (
                        <ChevronRight
                          className={`ml-auto h-4 w-4 transition group-hover:translate-x-0.5 group-hover:opacity-70 ${
                            isActive ? 'text-white/75' : 'text-[var(--admin-secondary)] opacity-0 group-hover:opacity-70'
                          }`}
                          aria-hidden
                        />
                      ) : null}
                    </>
                  )}
                </NavLink>
              )
            })}
        </nav>

        <div className="shrink-0 border-t border-[var(--admin-border)] p-3">
          <div
            className={`admin-card !shadow-[var(--admin-shadow-sm)] p-2 text-[11px] text-[var(--admin-muted)] ${collapsed ? 'text-center' : ''}`}
          >
            {!collapsed ? (
              <>
                <p className="font-semibold text-[var(--admin-text)]">{displayName}</p>
                <p className="mt-1 line-clamp-2 text-[10px] leading-snug">{roleSummary}</p>
                {accessContext?.isSuperAdmin ? (
                  <span className="mt-2 inline-block rounded-full border border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-primary)_12%,var(--admin-surface))] px-2 py-0.5 text-[10px] font-semibold text-[var(--admin-primary)]">
                    {t('adminShell.superAdminBadge')}
                  </span>
                ) : null}
              </>
            ) : (
              <UserRound className="mx-auto h-5 w-5 text-[var(--admin-muted)]" aria-hidden />
            )}
          </div>
          <Link
            to="/"
            className={`mt-2 flex items-center gap-2 rounded-[var(--admin-radius)] px-2 py-1.5 text-[11px] font-medium text-[var(--admin-muted)] transition hover:bg-[color-mix(in_srgb,var(--admin-primary)_8%,var(--admin-surface))] hover:text-[var(--admin-text)] ${collapsed ? 'justify-center' : ''}`}
            title={t('adminShell.backToSiteTitle')}
          >
            <ChevronLeft className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
            {!collapsed ? <span>{t('adminShell.backToSite')}</span> : null}
          </Link>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="admin-shell-header sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 overflow-visible border-b border-[var(--admin-border)] px-4 shadow-[var(--admin-shadow-sm)] backdrop-blur-md transition-shadow duration-300 dark:shadow-none">
          <div
            ref={quickNavAnchorRef}
            className="relative flex min-w-0 flex-1 items-center md:mx-auto md:max-w-md"
          >
            <form onSubmit={submitSearch} className="relative hidden w-full md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--admin-muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('adminShell.searchPlaceholder')}
                className="admin-input h-10 w-full pl-10 pr-3 text-[13px] placeholder:text-[var(--admin-muted)]"
              />
            </form>
            <button
              type="button"
              className="admin-icon-btn inline-flex h-10 w-10 shrink-0 items-center justify-center !p-0 md:hidden"
              onClick={() => setPaletteOpen(true)}
              aria-label={t('adminShell.searchMobileAria')}
            >
              <Search className="h-[18px] w-[18px]" aria-hidden />
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <AdminHealthDot />

            <button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
              className="admin-icon-btn inline-flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-medium"
              aria-label={theme === 'dark' ? t('adminShell.themeSwitchToLight') : t('adminShell.themeSwitchToDark')}
            >
              <span className="admin-theme-track shrink-0" aria-hidden>
                <span className="admin-theme-thumb" />
              </span>
              <span className="hidden text-[var(--admin-muted)] sm:inline">
                {theme === 'dark' ? t('adminShell.themeDark') : t('adminShell.themeLight')}
              </span>
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-[var(--admin-primary)]" aria-hidden />
              ) : (
                <SunMedium className="h-4 w-4 text-[var(--admin-warning)]" aria-hidden />
              )}
            </button>

            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className={`admin-icon-btn inline-flex h-10 w-10 items-center justify-center !p-0 ${unreadNotifCount > 0 ? 'admin-shell-notif-bell--pulse' : ''}`}
                aria-label={t('adminShell.notifications')}
                aria-expanded={notifOpen}
              >
                <Bell className="h-[18px] w-[18px]" aria-hidden />
              </button>
              {notifOpen ? (
                <div className="admin-card absolute right-0 top-12 z-50 w-[min(100vw-2rem,22rem)] !p-0 text-[13px] shadow-lg">
                  <div className="border-b border-[var(--admin-border)] px-3 py-2">
                    <p className="font-semibold text-[var(--admin-text)]">{t('adminShell.notificationsEmptyTitle')}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-[var(--admin-muted)]">{t('adminShell.notif.demoHint')}</p>
                  </div>
                  <ul className="max-h-72 overflow-y-auto overscroll-contain py-1">
                    {DEMO_NOTIFS.map((n) => {
                      const unread = !notifReadIds.has(n.id)
                      return (
                        <li
                          key={n.id}
                          className={`border-b border-[color-mix(in_srgb,var(--admin-border)_70%,transparent)] px-3 py-2 last:border-b-0 ${unread ? 'bg-[color-mix(in_srgb,var(--admin-primary)_6%,var(--admin-surface))]' : ''}`}
                        >
                          <p className="font-medium text-[var(--admin-text)]">{t(n.titleKey)}</p>
                          <p className="mt-0.5 text-[11px] text-[var(--admin-muted)]">{t(n.bodyKey)}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Link
                              to={n.path}
                              className="inline-flex rounded-[var(--admin-radius-sm)] bg-[var(--admin-primary)] px-2.5 py-1 text-[11px] font-semibold text-white dark:text-[#1a1d21]"
                              onClick={() => {
                                markNotifRead(n.id)
                                setNotifOpen(false)
                              }}
                            >
                              {t('adminShell.notif.viewBooking')}
                            </Link>
                            <button
                              type="button"
                              className="text-[11px] font-medium text-[var(--admin-muted)] underline underline-offset-2"
                              onClick={() => markNotifRead(n.id)}
                            >
                              {t('common.close')}
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="border-t border-[var(--admin-border)] px-3 py-2">
                    <button
                      type="button"
                      className="text-[11px] font-semibold text-[var(--admin-primary)]"
                      onClick={() => {
                        markAllNotifsRead()
                        setNotifOpen(false)
                      }}
                    >
                      {t('adminShell.notif.markAllRead')}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="admin-icon-btn flex items-center gap-2 !py-1 pl-1 pr-2"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label={t('adminShell.profileMenu')}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-[var(--admin-radius-sm)] bg-gradient-to-br from-[#212529] to-[#495057] text-xs font-bold text-[#f8f9fa] dark:from-[#e9ecef] dark:to-[#adb5bd] dark:text-[#1a1d21]">
                  {displayName.trim().charAt(0).toUpperCase() || 'A'}
                </span>
                <span className="hidden max-w-[140px] truncate text-left text-[12px] font-semibold text-[var(--admin-text)] lg:inline">
                  {displayName}
                </span>
              </button>
              {profileOpen ? (
                <div
                  className="admin-card absolute right-0 top-12 z-50 min-w-[200px] !p-0 py-2"
                  role="menu"
                >
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-[13px] text-[var(--admin-text)] transition hover:bg-[color-mix(in_srgb,var(--admin-primary)_10%,var(--admin-surface))]"
                    onClick={() => setProfileOpen(false)}
                  >
                    {t('adminShell.profileAccount')}
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] text-[var(--admin-danger)] transition hover:bg-[color-mix(in_srgb,var(--admin-danger)_10%,var(--admin-surface))]"
                    onClick={() => {
                      setProfileOpen(false)
                      onLogout()
                    }}
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    {t('common.logout')}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </main>
      </div>

      <AdminCommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        visibleGroups={visibleGroups}
        anchorRef={quickNavAnchorRef}
      />
    </div>
  )
}
