import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Moon, SunMedium } from 'lucide-react'
import { LocaleLanguageIcon } from './HeaderLocaleIcons'
import i18n from 'i18next'

import { cn } from '@/lib/utils'
import { VND_PER_USD } from '@/lib/currencyDisplay'
import { useAppDispatch } from '../../hooks/reduxHooks'
import {
  setCurrency,
  setLanguage,
  setTheme,
} from '../../stores/slices/preferencesSlice'
import type { HeaderNavAppearance } from './ui/navbar-menu'
import type { CurrencyMode, LanguageMode, ThemeMode } from '../../constants/preferences'
import './HeaderLocalePanel.css'

type HeaderLocalePanelProps = {
  appearance: HeaderNavAppearance
  theme: ThemeMode
  language: LanguageMode
  currency: CurrencyMode
}

type DraftState = {
  language: LanguageMode
  currency: CurrencyMode
  theme: ThemeMode
}

export function HeaderLocalePanel({
  appearance,
  theme,
  language,
  currency,
}: HeaderLocalePanelProps) {
  const { t } = useTranslation('translation')
  const dispatch = useAppDispatch()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DraftState>({
    language,
    currency,
    theme,
  })

  const isOverlay = appearance === 'overlay'

  useEffect(() => {
    if (!open) return
    setDraft({ language, currency, theme })
  }, [open, language, currency, theme])

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const applyDraft = () => {
    dispatch(setLanguage(draft.language))
    dispatch(setTheme(draft.theme))
    dispatch(setCurrency(draft.currency))
    void i18n.changeLanguage(draft.language)
    document.documentElement.lang = draft.language
    document.documentElement.dataset.theme = draft.theme
    document.documentElement.classList.toggle('theme-dark', draft.theme === 'dark')
    setOpen(false)
  }

  const themeLabel = theme === 'dark' ? t('header.dark') : t('header.light')
  const triggerAria =
    language === 'vi'
      ? t('header.localePanel.ariaVi', { currency, theme: themeLabel })
      : t('header.localePanel.ariaEn', { currency, theme: themeLabel })

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={cn(
          'hlp-trigger',
          `hlp-trigger--theme-${theme}`,
          isOverlay && 'hlp-trigger--overlay',
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={triggerAria}
        title={triggerAria}
        onClick={() => setOpen((v) => !v)}
      >
        <LocaleLanguageIcon language={language} size={22} className="hlp-trigger__flag" />
        <span className="hlp-trigger__currency">{currency}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          className="hlp-panel"
          role="dialog"
          aria-label={t('header.localePanel.title')}
        >
          <div className="hlp-panel__grid">
            <section className="hlp-panel__col">
              <h3 className="hlp-panel__heading">{t('header.localePanel.language')}</h3>
              <button
                type="button"
                className={cn('hlp-option', draft.language === 'vi' && 'is-selected')}
                onClick={() => setDraft((d) => ({ ...d, language: 'vi' }))}
              >
                <span className="hlp-option__icon">
                  <LocaleLanguageIcon language="vi" size={22} />
                </span>
                <span className="hlp-option__body">
                  <span
                    className={cn(
                      'hlp-option__title',
                      draft.language === 'vi' && 'is-accent',
                    )}
                  >
                    {t('header.localePanel.viTitle')}
                  </span>
                  <span
                    className={cn(
                      'hlp-option__sub',
                      draft.language === 'vi' && 'is-accent',
                    )}
                  >
                    {t('header.localePanel.viSub')}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className={cn('hlp-option', draft.language === 'en' && 'is-selected')}
                onClick={() => setDraft((d) => ({ ...d, language: 'en' }))}
              >
                <span className="hlp-option__icon">
                  <LocaleLanguageIcon language="en" size={22} />
                </span>
                <span className="hlp-option__body">
                  <span
                    className={cn(
                      'hlp-option__title',
                      draft.language === 'en' && 'is-accent',
                    )}
                  >
                    {t('header.localePanel.enTitle')}
                  </span>
                  <span
                    className={cn(
                      'hlp-option__sub',
                      draft.language === 'en' && 'is-accent',
                    )}
                  >
                    {t('header.localePanel.enSub')}
                  </span>
                </span>
              </button>
            </section>

            <section className="hlp-panel__col">
              <h3 className="hlp-panel__heading">{t('header.localePanel.currency')}</h3>
              <button
                type="button"
                className={cn('hlp-option', draft.currency === 'VND' && 'is-selected')}
                onClick={() => setDraft((d) => ({ ...d, currency: 'VND' }))}
              >
                <span className="hlp-option__body">
                  <span
                    className={cn(
                      'hlp-option__title',
                      draft.currency === 'VND' && 'is-accent',
                    )}
                  >
                    VND
                  </span>
                  <span
                    className={cn(
                      'hlp-option__sub',
                      draft.currency === 'VND' && 'is-accent',
                    )}
                  >
                    {t('header.localePanel.vndSub')}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className={cn('hlp-option', draft.currency === 'USD' && 'is-selected')}
                onClick={() => setDraft((d) => ({ ...d, currency: 'USD' }))}
              >
                <span className="hlp-option__body">
                  <span
                    className={cn(
                      'hlp-option__title',
                      draft.currency === 'USD' && 'is-accent',
                    )}
                  >
                    USD
                  </span>
                  <span
                    className={cn(
                      'hlp-option__sub',
                      draft.currency === 'USD' && 'is-accent',
                    )}
                  >
                    {t('header.localePanel.usdSub')}
                  </span>
                </span>
              </button>
            </section>

            <section className="hlp-panel__col">
              <h3 className="hlp-panel__heading">{t('header.localePanel.theme')}</h3>
              <div className="hlp-theme-grid">
                <button
                  type="button"
                  className={cn(
                    'hlp-theme-btn',
                    draft.theme === 'light' && 'is-selected',
                  )}
                  onClick={() => setDraft((d) => ({ ...d, theme: 'light' }))}
                >
                  <SunMedium className="h-4 w-4" aria-hidden />
                  {t('header.light')}
                </button>
                <button
                  type="button"
                  className={cn(
                    'hlp-theme-btn',
                    draft.theme === 'dark' && 'is-selected',
                  )}
                  onClick={() => setDraft((d) => ({ ...d, theme: 'dark' }))}
                >
                  <Moon className="h-4 w-4" aria-hidden />
                  {t('header.dark')}
                </button>
              </div>
            </section>
          </div>

          <p className="hlp-panel__hint">
            {t('header.localePanel.rateHint', {
              rate: VND_PER_USD.toLocaleString('vi-VN'),
            })}
          </p>

          <div className="hlp-panel__footer">
            <button type="button" className="hlp-confirm" onClick={applyDraft}>
              {t('header.localePanel.confirm')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
