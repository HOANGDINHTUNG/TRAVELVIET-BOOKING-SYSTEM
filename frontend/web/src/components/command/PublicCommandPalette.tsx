import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Compass,
  Home,
  LifeBuoy,
  Link as LinkIcon,
  LogIn,
  Map,
  Moon,
  Plane,
  Stamp,
  SunMedium,
  UserRound,
} from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { CommandPaletteContext } from '@/components/command/CommandPaletteContext'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { setLanguage, setTheme } from '../../stores/slices/preferencesSlice'
import { useAuthStore } from '../../stores/authStore'
import { buildTourSlug } from '../../module/tours/utils/slug'
import { selectHome } from '../../module/home/store/homeSlice'
import { showError, showSuccess } from '../../lib/toast'

type PaletteProps = {
  children?: React.ReactNode
}

/**
 * Public Command Palette — Phase 3.
 *
 * Tổng hợp các thao tác hay dùng nhất cho người dùng đầu cuối:
 * - **Navigation**: chuyển nhanh trang chủ, tour, điểm đến, hỗ trợ…
 * - **Actions**: đổi theme, đổi ngôn ngữ, copy link, mở Passport…
 * - **Search**: gợi ý tour / điểm đến theo từ khoá (đọc từ `homeSlice`,
 *   data đã có cache khi user vừa ghé `/`).
 *
 * Đặc điểm:
 * - Tự động ẩn group "Tour gợi ý" / "Điểm đến" khi không có dữ liệu.
 * - Toast feedback (qua `@/lib/toast`) sau khi đổi theme / ngôn ngữ /
 *   sao chép link ⇒ user thấy hành động đã thực hiện.
 * - **Không** mount ở `/management/*` (admin có palette riêng).
 *
 * Component này đồng thời là `<CommandPaletteContext.Provider>` ⇒ bất kỳ
 * component nào dùng `useCommandPalette()` cũng mở/đóng được.
 */
export function PublicCommandPalette({ children }: PaletteProps) {
  const { t } = useTranslation('translation')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { theme, language } = useAppSelector((state) => state.preferences)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const home = useAppSelector(selectHome)

  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((v) => !v), [])

  const ctxValue = useMemo(
    () => ({ open, setOpen, toggle }),
    [open, toggle],
  )

  // Cmd/Ctrl + K toàn site → toggle palette.
  // Bỏ qua khi user đang gõ trong input/textarea/contenteditable.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.key === 'k' || event.key === 'K') &&
        (event.metaKey || event.ctrlKey)

      if (!isShortcut) return

      const target = event.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        const isEditable =
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          target.isContentEditable === true
        // Cho phép trong palette input (vẫn toggle để đóng).
        if (isEditable && !target.closest('[cmdk-input-wrapper]')) {
          return
        }
      }

      event.preventDefault()
      setOpen((v) => !v)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const go = useCallback(
    (path: string) => {
      close()
      navigate(path)
    },
    [close, navigate],
  )

  const handleCopyLink = useCallback(async () => {
    close()
    try {
      await navigator.clipboard.writeText(window.location.href)
      showSuccess('commandPalette.feedback.linkCopied')
    } catch {
      showError('commandPalette.feedback.linkCopyFailed')
    }
  }, [close])

  const handleTheme = useCallback(
    (next: 'light' | 'dark') => {
      close()
      dispatch(setTheme(next))
      showSuccess('commandPalette.feedback.themeChanged')
    },
    [close, dispatch],
  )

  const handleLanguage = useCallback(
    (next: 'vi' | 'en') => {
      close()
      dispatch(setLanguage(next))
      showSuccess('commandPalette.feedback.languageChanged')
    },
    [close, dispatch],
  )

  // === SEARCH SOURCES ===========================================
  // Lấy dataset đã có sẵn từ home slice (cached khi user ghé /).
  // Filter rất rẻ — chỉ chạy khi palette mở + có query.
  const tourMatches = useMemo(() => {
    if (!home.tours.length) return []
    return home.tours.slice(0, 30)
  }, [home.tours])

  const destinationMatches = useMemo(() => {
    if (!home.destinations.length) return []
    return home.destinations.slice(0, 30)
  }, [home.destinations])

  return (
    <CommandPaletteContext.Provider value={ctxValue}>
      {children}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t('commandPalette.triggerLabel')}
        description={t('commandPalette.placeholder')}
      >
        <CommandInput placeholder={t('commandPalette.placeholder')} />

        <CommandList>
          <CommandEmpty>{t('commandPalette.empty')}</CommandEmpty>

          {/* ====== NAVIGATION ====== */}
          <CommandGroup heading={t('commandPalette.groups.navigation')}>
            <CommandItem onSelect={() => go('/')}>
              <Home aria-hidden />
              <span>{t('commandPalette.nav.home')}</span>
              <CommandShortcut>G H</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => go('/tours')}>
              <Plane aria-hidden />
              <span>{t('commandPalette.nav.tours')}</span>
              <CommandShortcut>G T</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => go('/destinations')}>
              <Map aria-hidden />
              <span>{t('commandPalette.nav.destinations')}</span>
              <CommandShortcut>G D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => go('/support')}>
              <LifeBuoy aria-hidden />
              <span>{t('commandPalette.nav.support')}</span>
            </CommandItem>
            <CommandItem onSelect={() => go('/passport')}>
              <Stamp aria-hidden />
              <span>{t('commandPalette.nav.passport')}</span>
            </CommandItem>
            {isAuthenticated ? (
              <CommandItem onSelect={() => go('/account')}>
                <UserRound aria-hidden />
                <span>{t('commandPalette.nav.account')}</span>
              </CommandItem>
            ) : (
              <CommandItem onSelect={() => go('/login')}>
                <LogIn aria-hidden />
                <span>{t('commandPalette.nav.login')}</span>
              </CommandItem>
            )}
          </CommandGroup>

          <CommandSeparator />

          {/* ====== ACTIONS ====== */}
          <CommandGroup heading={t('commandPalette.groups.actions')}>
            {theme === 'dark' ? (
              <CommandItem
                onSelect={() => handleTheme('light')}
                keywords={['theme', 'light', 'sáng']}
              >
                <SunMedium aria-hidden />
                <span>{t('commandPalette.actions.themeLight')}</span>
              </CommandItem>
            ) : (
              <CommandItem
                onSelect={() => handleTheme('dark')}
                keywords={['theme', 'dark', 'tối']}
              >
                <Moon aria-hidden />
                <span>{t('commandPalette.actions.themeDark')}</span>
              </CommandItem>
            )}

            {language === 'vi' ? (
              <CommandItem
                onSelect={() => handleLanguage('en')}
                keywords={['language', 'english', 'en']}
              >
                <span aria-hidden className="text-[12px]">EN</span>
                <span>{t('commandPalette.actions.langEn')}</span>
              </CommandItem>
            ) : (
              <CommandItem
                onSelect={() => handleLanguage('vi')}
                keywords={['language', 'tiếng việt', 'vi']}
              >
                <span aria-hidden className="text-[12px]">VI</span>
                <span>{t('commandPalette.actions.langVi')}</span>
              </CommandItem>
            )}

            <CommandItem
              onSelect={() => void handleCopyLink()}
              keywords={['copy', 'link', 'url', 'share']}
            >
              <LinkIcon aria-hidden />
              <span>{t('commandPalette.actions.copyLink')}</span>
            </CommandItem>
          </CommandGroup>

          {/* ====== TOUR SUGGESTIONS ====== */}
          {tourMatches.length ? (
            <>
              <CommandSeparator />
              <CommandGroup heading={t('commandPalette.groups.tours')}>
                {tourMatches.map((tour) => {
                  const slug = buildTourSlug(
                    (tour.title || '').toLowerCase(),
                    tour.id,
                  )
                  return (
                    <CommandItem
                      key={`tour-${tour.id}`}
                      value={`${tour.title} ${tour.location ?? ''} ${tour.category ?? ''}`}
                      keywords={[tour.location, tour.category].filter(
                        (s): s is string => typeof s === 'string' && s.length > 0,
                      )}
                      onSelect={() => go(`/tour/${slug}`)}
                    >
                      <Compass aria-hidden />
                      <span className="line-clamp-1">{tour.title}</span>
                      {tour.location ? (
                        <CommandShortcut className="ml-auto truncate text-[10px] text-muted-foreground">
                          {tour.location}
                        </CommandShortcut>
                      ) : null}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </>
          ) : null}

          {/* ====== DESTINATION SUGGESTIONS ====== */}
          {destinationMatches.length ? (
            <>
              <CommandSeparator />
              <CommandGroup heading={t('commandPalette.groups.destinations')}>
                {destinationMatches.map((dest, i) => {
                  const key = dest.uuid || dest.id || `dest-${i}`
                  const target = dest.uuid
                    ? `/destinations/${dest.uuid}`
                    : '/destinations'
                  return (
                    <CommandItem
                      key={`dest-${key}`}
                      value={dest.name}
                      onSelect={() => go(target)}
                    >
                      <Map aria-hidden />
                      <span className="line-clamp-1">{dest.name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </>
          ) : null}
        </CommandList>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  )
}
