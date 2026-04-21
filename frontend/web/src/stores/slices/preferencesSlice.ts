import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  LANGUAGE_MODES,
  PREFERENCES_STORAGE_KEY,
  type LanguageMode,
  type ThemeMode,
} from '../../constants/preferences'
import type { PreferencesState } from '../../types/interface/preferences'

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark'
}

function isLanguageMode(value: unknown): value is LanguageMode {
  return LANGUAGE_MODES.includes(value as LanguageMode)
}

function loadPreferences(): PreferencesState {
  if (typeof window === 'undefined') {
    return {
      theme: DEFAULT_THEME,
      language: DEFAULT_LANGUAGE,
    }
  }

  try {
    const savedPreferences = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    const parsedPreferences = savedPreferences
      ? (JSON.parse(savedPreferences) as Partial<PreferencesState>)
      : {}

    return {
      theme: isThemeMode(parsedPreferences.theme)
        ? parsedPreferences.theme
        : DEFAULT_THEME,
      language: isLanguageMode(parsedPreferences.language)
        ? parsedPreferences.language
        : DEFAULT_LANGUAGE,
    }
  } catch {
    return {
      theme: DEFAULT_THEME,
      language: DEFAULT_LANGUAGE,
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
  },
})

export const { setTheme, toggleTheme, setLanguage, toggleLanguage } =
  preferencesSlice.actions
export const preferencesReducer = preferencesSlice.reducer
