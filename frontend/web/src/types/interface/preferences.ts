import type { CurrencyMode, LanguageMode, ThemeMode } from '../../constants/preferences'

export type PreferencesState = {
  theme: ThemeMode
  language: LanguageMode
  currency: CurrencyMode
}
