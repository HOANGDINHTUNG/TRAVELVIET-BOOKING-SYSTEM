import { configureStore } from '@reduxjs/toolkit'
import { PREFERENCES_STORAGE_KEY } from '../constants/preferences'
import { preferencesReducer } from './slices/preferencesSlice'

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
  },
})

store.subscribe(() => {
  const { preferences } = store.getState()
  window.localStorage.setItem(
    PREFERENCES_STORAGE_KEY,
    JSON.stringify(preferences),
  )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
