import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  CURRENCY_MODES,
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  LANGUAGE_MODES,
  PREFERENCES_STORAGE_KEY,
  type CurrencyMode,
  type LanguageMode,
  type ThemeMode,
} from '../../constants/preferences'
import type { PreferencesState } from '../../types/interface/preferences'

const LEGACY_CURRENCY_KEY = 'travelviet-header-currency'

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark'
}

function isLanguageMode(value: unknown): value is LanguageMode {
  return LANGUAGE_MODES.includes(value as LanguageMode)
}

function isCurrencyMode(value: unknown): value is CurrencyMode {
  return CURRENCY_MODES.includes(value as CurrencyMode)
}

function readLegacyCurrency(): CurrencyMode | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(LEGACY_CURRENCY_KEY)
    return isCurrencyMode(raw) ? raw : null
  } catch {
    return null
  }
}

function loadPreferences(): PreferencesState {
  if (typeof window === 'undefined') {
    return {
      theme: DEFAULT_THEME,
      language: DEFAULT_LANGUAGE,
      currency: DEFAULT_CURRENCY,
    }
  }

  try {
    const savedPreferences = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    const parsedPreferences = savedPreferences
      ? (JSON.parse(savedPreferences) as Partial<PreferencesState>)
      : {}
    const legacyCurrency = readLegacyCurrency()

    return {
      theme: isThemeMode(parsedPreferences.theme)
        ? parsedPreferences.theme
        : DEFAULT_THEME,
      language: isLanguageMode(parsedPreferences.language)
        ? parsedPreferences.language
        : DEFAULT_LANGUAGE,
      currency:
        isCurrencyMode(parsedPreferences.currency)
          ? parsedPreferences.currency
          : legacyCurrency ?? DEFAULT_CURRENCY,
    }
  } catch {
    return {
      theme: DEFAULT_THEME,
      language: DEFAULT_LANGUAGE,
      currency: readLegacyCurrency() ?? DEFAULT_CURRENCY,
    }
  }
}

const initialState: PreferencesState = loadPreferences()

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setLanguage(state, action: PayloadAction<LanguageMode>) {
      state.language = action.payload
    },
    toggleLanguage(state) {
      state.language = state.language === 'vi' ? 'en' : 'vi'
    },
    setCurrency(state, action: PayloadAction<CurrencyMode>) {
      state.currency = action.payload
    },
  },
})

export const {
  setTheme,
  toggleTheme,
  setLanguage,
  toggleLanguage,
  setCurrency,
} = preferencesSlice.actions
export const preferencesReducer = preferencesSlice.reducer
