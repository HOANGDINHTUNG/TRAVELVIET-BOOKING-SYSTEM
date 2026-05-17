import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Languages, LogIn, Menu as MenuIcon, Moon, SunMedium } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import type { ThemeMode, LanguageMode } from '../../constants/preferences'

type MobileNavItem = {
  label: string
  to: string
}

type MobileNavProps = {
  brandName: string
  brandTagline: string
  logoSrc: string
  items: MobileNavItem[]
  theme: ThemeMode
  language: LanguageMode
  isAuthenticated: boolean
  onChangeTheme: (next: ThemeMode) => void
  onChangeLanguage: (next: LanguageMode) => void
}

/**
 * Mobile nav drawer dùng Shadcn `Sheet` — thay panel slide tự viết.
 * Ưu điểm:
 * - Khoá body scroll tự động (Radix Dialog).
 * - Focus-trap + ESC close miễn phí.
 * - Animation slide-in/out qua `data-state` (driven by Radix), không cần JS state.
 * - Hỗ trợ swipe-to-close trên touch khi gắn thêm gesture (Phase tiếp theo).
 */
export function MobileNav({
  brandName,
  brandTagline,
  logoSrc,
  items,
  theme,
  language,
  isAuthenticated,
  onChangeTheme,
  onChangeLanguage,
}: MobileNavProps) {
  const { t } = useTranslation('translation')
  const [open, setOpen] = useState(false)

  const ariaTheme =
    theme === 'dark'
      ? t('header.ariaSwitchToLight')
      : t('header.ariaSwitchToDark')
  const ariaLanguage = t('header.ariaToggleLanguage')

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={t('nav.ariaMain')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <MenuIcon className="h-5 w-5" aria-hidden />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[82%] max-w-sm border-r-0 bg-neutral-950/95 text-white backdrop-blur-xl p-0"
      >
        <SheetHeader className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt={brandName}
              className="h-10 w-10 rounded-md bg-white/5 object-contain"
            />
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                {brandName}
              </SheetTitle>
              <SheetDescription className="text-[11px] text-white/60">
                {brandTagline}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <nav
          aria-label={t('nav.ariaMain')}
          className="flex flex-col gap-1 p-4"
        >
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-lg px-3 py-2.5 text-[13px] font-medium tracking-wide transition-colors',
                  isActive
                    ? 'bg-[#ff6600] text-white shadow-md shadow-[#ff6600]/35'
                    : 'bg-white/5 text-white/85 hover:bg-white/10',
                )
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 p-4">
          {!isAuthenticated ? (
            <SheetClose asChild>
              <Link
                to="/login"
                className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6600] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-white shadow-md shadow-[#ff6600]/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" aria-hidden />
                {t('header.login')}
              </Link>
            </SheetClose>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onChangeTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={ariaTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors hover:bg-white/10"
            >
              {theme === 'dark' ? (
                <SunMedium className="h-4 w-4 text-white/85" aria-hidden />
              ) : (
                <Moon className="h-4 w-4 text-white/85" aria-hidden />
              )}
            </button>
            <button
              type="button"
              onClick={() => onChangeLanguage(language === 'vi' ? 'en' : 'vi')}
              aria-label={ariaLanguage}
              className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-white/10"
            >
              <Languages className="h-4 w-4 text-white/80" aria-hidden />
              <span className="text-white/90">
                {language === 'vi' ? t('header.vietnamese') : t('header.english')}
              </span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
