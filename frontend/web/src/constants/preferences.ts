export const THEME_MODES = ['light', 'dark'] as const
export const LANGUAGE_MODES = ['vi', 'en'] as const

export type ThemeMode = (typeof THEME_MODES)[number]
export type LanguageMode = (typeof LANGUAGE_MODES)[number]

export const DEFAULT_THEME: ThemeMode = 'light'
export const DEFAULT_LANGUAGE: LanguageMode = 'vi'

export const PREFERENCES_STORAGE_KEY = 'travelviet-ui-preferences'
