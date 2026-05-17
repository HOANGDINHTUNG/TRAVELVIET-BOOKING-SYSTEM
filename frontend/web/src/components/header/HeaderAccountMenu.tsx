import { useState, type MouseEventHandler } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Languages,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Moon,
  Stamp,
  SunMedium,
  UserCircle2,
  UserRound,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { UserMeResponse } from '../../types/user'
import type { ThemeMode, LanguageMode } from '../../constants/preferences'

type HeaderAccountMenuProps = {
  user: UserMeResponse
  theme: ThemeMode
  language: LanguageMode
  hasManagementAccess: boolean
  triggerClassName?: string
  onChangeTheme: (next: ThemeMode) => void
  onChangeLanguage: (next: LanguageMode) => void
  onLogout: () => void
}

function getUserInitial(
  displayName?: string | null,
  fullName?: string | null,
  email?: string | null,
) {
  const source = displayName || fullName || email || 'U'
  return source.trim().charAt(0).toUpperCase() || 'U'
}

/**
 * Account menu của Header — dựng trên Radix `DropdownMenu`.
 *
 * Thay thế bản tự viết trước đây (`setIsAccountOpen` + pointer-listener +
 * Escape handler) — Radix lo:
 * - Click-outside close.
 * - Escape close.
 * - Focus management + roving tabindex bằng phím.
 * - ARIA `menu`/`menuitem` chuẩn.
 *
 * Component nhận đủ tham số qua prop để **không phụ thuộc store cụ thể**
 * (Header.tsx vẫn đọc redux preferences + zustand auth như cũ).
 */
export function HeaderAccountMenu({
  user,
  theme,
  language,
  hasManagementAccess,
  triggerClassName,
  onChangeTheme,
  onChangeLanguage,
  onLogout,
}: HeaderAccountMenuProps) {
  const { t } = useTranslation('translation')
  const [open, setOpen] = useState(false)
  const [showProfileDetails, setShowProfileDetails] = useState(false)

  const accountName =
    user.displayName || user.fullName || user.email || t('header.account')

  const profileDetails = [
    { label: t('header.fullName'), value: user.fullName },
    { label: t('header.displayName'), value: user.displayName },
    { label: t('header.email'), value: user.email },
    { label: t('header.phone'), value: user.phone },
    { label: t('header.status'), value: user.status },
    { label: t('header.memberLevel'), value: user.memberLevel },
  ]

  const handleLogout: MouseEventHandler<HTMLDivElement> = () => {
    setOpen(false)
    setShowProfileDetails(false)
    onLogout()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={accountName}
          title={accountName}
          className={cn(
            'relative inline-flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 text-[15px] font-bold leading-none shadow-md outline-none transition-[transform,opacity] duration-200 hover:opacity-95 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            triggerClassName,
          )}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="relative z-[1] flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ff8533] to-[#e65c00] text-white shadow-inner">
              <UserRound
                className="absolute h-7 w-7 opacity-20 text-white"
                aria-hidden
              />
              <span className="relative">
                {getUserInitial(user.displayName, user.fullName, user.email)}
              </span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-2rem,300px)] p-0"
      >
        {/* Khối profile header */}
        <div className="flex items-start gap-3 border-b border-border/70 bg-muted/30 px-3 py-3">
          <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border/70 bg-muted text-lg font-bold leading-none shadow">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="relative z-[1] flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ff8533] to-[#e65c00] text-white">
                <UserRound
                  className="absolute h-8 w-8 opacity-20 text-white"
                  aria-hidden
                />
                <span className="relative">
                  {getUserInitial(user.displayName, user.fullName, user.email)}
                </span>
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {t('header.signedIn')}
            </p>
            <p className="truncate text-sm font-semibold text-foreground">
              {accountName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email || t('header.notUpdated')}
            </p>
          </div>
        </div>

        <div className="max-h-[min(70vh,520px)] overflow-y-auto p-1">
          <DropdownMenuItem asChild>
            <Link to="/account" className="cursor-pointer">
              <UserRound className="h-4 w-4 opacity-70" aria-hidden />
              <span>{t('header.accountPage')}</span>
            </Link>
          </DropdownMenuItem>

          {hasManagementAccess ? (
            <DropdownMenuItem asChild>
              <Link to="/management/dashboard" className="cursor-pointer">
                <LayoutDashboard className="h-4 w-4 opacity-70" aria-hidden />
                <span>{t('header.managementPage')}</span>
              </Link>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem asChild>
            <Link to="/support" className="cursor-pointer">
              <LifeBuoy className="h-4 w-4 opacity-70" aria-hidden />
              <span>{t('header.supportCenter')}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/passport" className="cursor-pointer">
              <Stamp className="h-4 w-4 opacity-70" aria-hidden />
              <span>{t('header.passport')}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setShowProfileDetails((v) => !v)
            }}
          >
            <UserCircle2 className="h-4 w-4 opacity-70" aria-hidden />
            <span>{t('header.profileDetails')}</span>
          </DropdownMenuItem>

          {showProfileDetails ? (
            <div className="mb-1 grid gap-1.5 rounded-md bg-muted/60 px-3 py-2 text-xs">
              {profileDetails.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <strong className="text-right font-medium text-foreground">
                    {item.value != null && item.value !== ''
                      ? String(item.value)
                      : t('header.notUpdated')}
                  </strong>
                </div>
              ))}
            </div>
          ) : null}

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="flex items-center gap-1.5">
            <SunMedium className="h-3.5 w-3.5" aria-hidden />
            <span>{t('header.theme')}</span>
          </DropdownMenuLabel>
          <div className="px-2 pb-1.5">
            <div className="grid grid-cols-2 gap-1 rounded-full border border-border/70 p-0.5">
              <button
                type="button"
                onClick={() => onChangeTheme('light')}
                className={cn(
                  'rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors',
                  theme === 'light'
                    ? 'bg-[#ff6600] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <SunMedium className="mr-1 inline h-3 w-3" aria-hidden />
                {t('header.light')}
              </button>
              <button
                type="button"
                onClick={() => onChangeTheme('dark')}
                className={cn(
                  'rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors',
                  theme === 'dark'
                    ? 'bg-[#ff6600] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Moon className="mr-1 inline h-3 w-3" aria-hidden />
                {t('header.dark')}
              </button>
            </div>
          </div>

          <DropdownMenuLabel className="flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5" aria-hidden />
            <span>{t('header.language')}</span>
          </DropdownMenuLabel>
          <div className="px-2 pb-1.5">
            <div className="grid grid-cols-2 gap-1 rounded-full border border-border/70 p-0.5">
              <button
                type="button"
                onClick={() => onChangeLanguage('vi')}
                className={cn(
                  'rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors',
                  language === 'vi'
                    ? 'bg-[#ff6600] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t('header.vietnamese')}
              </button>
              <button
                type="button"
                onClick={() => onChangeLanguage('en')}
                className={cn(
                  'rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors',
                  language === 'en'
                    ? 'bg-[#ff6600] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t('header.english')}
              </button>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              handleLogout(
                event as unknown as Parameters<typeof handleLogout>[0],
              )
            }}
            className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:text-rose-300 dark:focus:bg-rose-950/40 dark:focus:text-rose-200"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span>{t('header.logout')}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
