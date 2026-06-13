import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, MapPin, ShoppingCart, UserRound } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { HeaderNavAppearance } from './ui/navbar-menu'
import { HEADER_NAV_LINKS } from './headerNavConfig'
import { HeaderAccountMenu } from './HeaderAccountMenu'
import { HeaderLocalePanel } from './HeaderLocalePanel'
import type { UserMeResponse } from '../../types/user'
import type { LanguageMode, ThemeMode } from '../../constants/preferences'
import type { CurrencyMode } from '../../constants/preferences'

const LOCATION_STORAGE_KEY = 'travelviet-header-location'

type LocationCode = 'hcm' | 'hanoi' | 'danang'

type HeaderUtilityActionsProps = {
  appearance: HeaderNavAppearance
  isAuthenticated: boolean
  user: UserMeResponse | null
  theme: ThemeMode
  language: LanguageMode
  currency: CurrencyMode
  hasManagementAccess: boolean
  avatarRingClassName?: string
  onChangeTheme: (next: ThemeMode) => void
  onChangeLanguage: (next: LanguageMode) => void
  onLogout: () => void
}

function readStoredLocation(): LocationCode {
  if (typeof window === 'undefined') return 'hcm'
  try {
    const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY)
    if (raw === 'hanoi' || raw === 'danang' || raw === 'hcm') return raw
  } catch {
    /* ignore */
  }
  return 'hcm'
}

export function HeaderUtilityActions({
  appearance,
  isAuthenticated,
  user,
  theme,
  language,
  currency,
  hasManagementAccess,
  avatarRingClassName,
  onChangeTheme,
  onChangeLanguage,
  onLogout,
}: HeaderUtilityActionsProps) {
  const { t } = useTranslation('translation')
  const [locationCode, setLocationCode] = useState<LocationCode>(readStoredLocation)

  useEffect(() => {
    window.localStorage.setItem(LOCATION_STORAGE_KEY, locationCode)
  }, [locationCode])

  const isOverlay = appearance === 'overlay'
  const isDark = appearance === 'solid-dark'
  const useLightText = isOverlay || isDark

  const utilityBtnClass = cn(
    'inline-flex h-9 max-w-[11rem] items-center gap-1.5 rounded-lg px-1.5 text-[12.5px] font-semibold transition-colors',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]/50',
    useLightText
      ? 'text-white/95 hover:bg-white/10'
      : 'text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))]',
  )

  const chevronClass = cn(
    'h-3.5 w-3.5 shrink-0 opacity-70',
    useLightText ? 'text-white/80' : 'text-[var(--color-muted)]',
  )

  const locationLabel =
    locationCode === 'hanoi'
      ? t('header.utility.locations.hanoi')
      : locationCode === 'danang'
        ? t('header.utility.locations.danang')
        : t('header.utility.locations.hcm')

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:gap-2">
      <HeaderLocalePanel
        appearance={appearance}
        theme={theme}
        language={language}
        currency={currency}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(utilityBtnClass, 'hidden md:inline-flex')}
            aria-label={t('header.utility.locationAria')}
          >
            <MapPin className="h-4 w-4 shrink-0 opacity-85" aria-hidden />
            <span className="max-w-[7.5rem] truncate">{locationLabel}</span>
            <ChevronDown className={chevronClass} aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[1100] min-w-[11rem]">
          <DropdownMenuItem onClick={() => setLocationCode('hcm')}>
            {t('header.utility.locations.hcm')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLocationCode('hanoi')}>
            {t('header.utility.locations.hanoi')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLocationCode('danang')}>
            {t('header.utility.locations.danang')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isAuthenticated && user ? (
        <HeaderAccountMenu
          user={user}
          theme={theme}
          language={language}
          hasManagementAccess={hasManagementAccess}
          triggerClassName={avatarRingClassName}
          onChangeTheme={onChangeTheme}
          onChangeLanguage={onChangeLanguage}
          onLogout={onLogout}
        />
      ) : (
        <Link
          to={HEADER_NAV_LINKS.login}
          className={cn(
            'inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-2.5 pl-1.5 text-[12px] font-semibold transition-colors lg:text-[12.5px]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
            useLightText
              ? 'bg-white/15 text-white hover:bg-white/25'
              : 'bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-surface))] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white',
          )}
        >
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
              useLightText ? 'bg-white text-[var(--color-accent)]' : 'bg-[var(--color-accent)] text-white',
            )}
            aria-hidden
          >
            <UserRound className="h-3.5 w-3.5" strokeWidth={2.2} />
          </span>
          <span className="pr-1">{t('header.login')}</span>
        </Link>
      )}

      <Link
        to={isAuthenticated ? HEADER_NAV_LINKS.myBookings : HEADER_NAV_LINKS.login}
        className={cn(
          utilityBtnClass,
          'h-9 w-9 max-w-none justify-center rounded-lg px-0',
        )}
        aria-label={t('header.utility.cartAria')}
        title={t('header.utility.cartAria')}
      >
        <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden />
      </Link>
    </div>
  )
}
