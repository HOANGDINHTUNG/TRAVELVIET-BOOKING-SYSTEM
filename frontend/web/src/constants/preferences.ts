export const THEME_MODES = ['light', 'dark'] as const
export const LANGUAGE_MODES = ['vi', 'en'] as const
export const CURRENCY_MODES = ['VND', 'USD'] as const

export type ThemeMode = (typeof THEME_MODES)[number]
export type LanguageMode = (typeof LANGUAGE_MODES)[number]
export type CurrencyMode = (typeof CURRENCY_MODES)[number]

export const DEFAULT_THEME: ThemeMode = 'light'
export const DEFAULT_LANGUAGE: LanguageMode = 'vi'
export const DEFAULT_CURRENCY: CurrencyMode = 'VND'

/** 1 USD = 26.300 VND (quy đổi hiển thị trên UI). */
export const VND_PER_USD = 26_300

export const PREFERENCES_STORAGE_KEY = 'travelviet-ui-preferences'
