import { useCallback } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LogOut, Sparkles } from 'lucide-react'
import RequireAuthenticated from '../../router/guards/RequireAuthenticated'
import RequireManagerAccess from '../../router/guards/RequireManagerAccess'
import {
  selectCurrentUser,
  useAuthStore,
} from '../../stores/authStore'
import { queryClient } from '../../app/queryClient'

type SideLink = {
  to: string
  label: string
}

const PRIMARY_LINKS: SideLink[] = [
  { to: '/management', label: 'Tổng quan' },
  { to: '/management/destinations', label: 'Điểm đến' },
  { to: '/management/tours', label: 'Tours (legacy)' },
  { to: '/management/tours-v2', label: 'Tours (mới)' },
  { to: '/management/bookings-v2', label: 'Đặt chỗ (mới)' },
  { to: '/management/promotions', label: 'Khuyến mãi' },
  { to: '/management/support', label: 'Hỗ trợ' },
  { to: '/management/system', label: 'Hệ thống' },
  { to: '/management/audit', label: 'Audit' },
]

function ManagementLayoutShell() {
  const navigate = useNavigate()
  const { t } = useTranslation('management')
  const user = useAuthStore(selectCurrentUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const handleLogout = useCallback(() => {
    clearAuth()
    queryClient.clear()
    toast.success(
      String(
        t('logoutSuccess', {
          ns: 'auth',
          defaultValue: 'Đã đăng xuất khỏi tài khoản.',
        }),
      ),
    )
    navigate('/login', { replace: true })
  }, [clearAuth, navigate, t])

  const displayName =
    user?.displayName || user?.fullName || user?.email || user?.phone || 'Quản trị viên'
  const primaryRole = user?.role ?? user?.roles?.[0] ?? 'BACKOFFICE'

  return (
    <div className="grid min-h-screen grid-cols-[260px_minmax(0,1fr)] bg-[var(--color-page,#f7f8fb)] text-[var(--color-text,#0f172a)]">
      <aside className="flex flex-col gap-5 border-r border-[var(--color-border,#e2e8f0)] bg-[var(--color-surface,#ffffff)] px-4 py-5">
        <Link
          className="flex items-center gap-2 text-base font-bold tracking-wide"
          to="/management"
        >
          <Sparkles aria-hidden className="h-5 w-5 text-[var(--color-primary,#0ea5e9)]" />
          TravelViet Backoffice
        </Link>

        <div className="rounded-md border border-[var(--color-border,#e2e8f0)] p-3 text-sm">
          <p className="font-semibold leading-tight">{displayName}</p>
          <p className="mt-1 text-xs text-[var(--color-muted,#64748b)]">
            {primaryRole}
          </p>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Điều hướng quản lý">
          {PRIMARY_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/management'}
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-primary,#0ea5e9)] text-white'
                    : 'text-[var(--color-muted,#475569)] hover:bg-[var(--color-page,#f1f5f9)] hover:text-[var(--color-text,#0f172a)]',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-md border border-[var(--color-border,#e2e8f0)] px-3 py-2 text-sm font-semibold text-[var(--color-text,#0f172a)] transition-colors hover:bg-[var(--color-page,#f1f5f9)]"
        >
          <LogOut aria-hidden className="h-4 w-4" />
          {String(t('common.logout', { defaultValue: 'Đăng xuất' }))}
        </button>
      </aside>

      <main className="min-w-0 overflow-y-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}

/**
 * Layout chuẩn cho khu vực `/management` — tự bọc 2 lớp guard:
 * 1. `RequireAuthenticated` — bắt buộc đã đăng nhập.
 * 2. `RequireManagerAccess` — bắt buộc có role thuộc nhóm quản trị.
 *
 * Layout này dùng Tailwind utility (đã setup ở Phase 1) để giảm phụ thuộc CSS module legacy.
 * Nút **Đăng xuất** clear auth + clear TanStack Query cache + redirect `/login`.
 */
function ManagementLayout() {
  return (
    <RequireAuthenticated>
      <RequireManagerAccess>
        <ManagementLayoutShell />
      </RequireManagerAccess>
    </RequireAuthenticated>
  )
}

export default ManagementLayout
