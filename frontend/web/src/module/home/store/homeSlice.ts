import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { destinationApi } from '../../../api/server/Destination.api'
import { tourApi } from '../../../api/server/Tour.api'
import { weatherApi } from '../../../api/server/Weather.api'
import type { RootState } from '../../../stores'
import type {
  CrowdPrediction,
  Destination,
  Tour,
  WeatherAlert,
  WeatherForecast,
} from '../database/interface/publicTravel'

type HomePublicData = {
  destinations: Destination[]
  tours: Tour[]
  toursDomesticBeach: Tour[]
  toursInternationalHot: Tour[]
  toursLastMinuteDeals: Tour[]
}

type HomeWeatherData = {
  forecasts: WeatherForecast[]
  alerts: WeatherAlert[]
  crowdPredictions: CrowdPrediction[]
}

type HomeState = HomePublicData &
  HomeWeatherData & {
    loading: boolean
    weatherLoading: boolean
    error: string | null
    weatherError: string | null
  }

const initialState: HomeState = {
  destinations: [],
  tours: [],
  toursDomesticBeach: [],
  toursInternationalHot: [],
  toursLastMinuteDeals: [],
  forecasts: [],
  alerts: [],
  crowdPredictions: [],
  loading: false,
  weatherLoading: false,
  error: null,
  weatherError: null,
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function getSettledError(result: PromiseSettledResult<unknown>) {
  return result.status === 'rejected' ? result.reason : null
}

export const fetchHomePublicData = createAsyncThunk<
  HomePublicData,
  void,
  { rejectValue: string }
>('home/fetchPublicData', async (_unused, { rejectWithValue }) => {
  const [
    destinationResult,
    tourResult,
    domesticBeachResult,
    internationalHotResult,
    lastMinuteDealsResult,
  ] = await Promise.allSettled([
    destinationApi.getDestinations(),
    tourApi.getTours(),
    tourApi.searchPublicTours({
      tagCodes: ['HOME_BEACH_VN'],
      featuredOnly: true,
      size: 12,
      sortBy: 'totalBookings',
      sortDir: 'desc',
    }),
    tourApi.searchPublicTours({
      tagCodes: ['HOME_HOT_INTL'],
      featuredOnly: true,
      size: 12,
      sortBy: 'totalBookings',
      sortDir: 'desc',
    }),
    tourApi.searchPublicTours({
      tagCodes: ['HOME_FLASH_SALE'],
      featuredOnly: true,
      size: 12,
      sortBy: 'totalBookings',
      sortDir: 'desc',
    }),
  ])

  const toursLastMinuteDeals =
    lastMinuteDealsResult.status === 'fulfilled'
      ? lastMinuteDealsResult.value
      : []

  if (import.meta.env.DEV) {
    if (lastMinuteDealsResult.status === 'rejected') {
      console.warn(
        `[home] HOME_FLASH_SALE fetch FAILED — kiem tra VITE_API_BASE_URL va backend.`,
        lastMinuteDealsResult.reason,
      )
    } else {
      console.info(
        '[home] HOME_FLASH_SALE fetch OK:',
        toursLastMinuteDeals.length,
        'tours',
        toursLastMinuteDeals.map((t) => t.id),
      )
    }
  }

  const payload: HomePublicData = {
    destinations:
      destinationResult.status === 'fulfilled' ? destinationResult.value : [],
    tours: tourResult.status === 'fulfilled' ? tourResult.value : [],
    toursDomesticBeach:
      domesticBeachResult.status === 'fulfilled' ? domesticBeachResult.value : [],
    toursInternationalHot:
      internationalHotResult.status === 'fulfilled'
        ? internationalHotResult.value
        : [],
    toursLastMinuteDeals,
  }

  const hasAnyHomeData =
    payload.destinations.length > 0 ||
    payload.tours.length > 0 ||
    payload.toursDomesticBeach.length > 0 ||
    payload.toursInternationalHot.length > 0 ||
    payload.toursLastMinuteDeals.length > 0

  if (hasAnyHomeData) {
    return payload
  }

  const error =
    getSettledError(destinationResult) ??
    getSettledError(tourResult) ??
    getSettledError(domesticBeachResult) ??
    getSettledError(internationalHotResult) ??
    getSettledError(lastMinuteDealsResult)

  if (error) {
    return rejectWithValue(
      getErrorMessage(error, 'Khong the tai du lieu trang chu.'),
    )
  }

  return rejectWithValue('Khong the tai du lieu trang chu.')
})

export const fetchHomeWeather = createAsyncThunk<
  HomeWeatherData,
  string,
  { rejectValue: string }
>('home/fetchWeather', async (destinationUuid, { rejectWithValue }) => {
  try {
    const [forecasts, alerts, crowdPredictions] = await Promise.all([
      weatherApi.getDestinationForecasts(destinationUuid),
      weatherApi.getDestinationAlerts(destinationUuid),
      weatherApi.getDestinationCrowdPredictions(destinationUuid),
    ])

    return { forecasts, alerts, crowdPredictions }
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, 'Khong the tai du lieu thoi tiet.'),
    )
  }
})

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeWeather(state) {
      state.forecasts = []
      state.alerts = []
      state.crowdPredictions = []
      state.weatherError = null
      state.weatherLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePublicData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHomePublicData.fulfilled, (state, action) => {
        state.loading = false
        state.destinations = action.payload.destinations
        state.tours = action.payload.tours
        state.toursDomesticBeach = action.payload.toursDomesticBeach
        state.toursInternationalHot = action.payload.toursInternationalHot
        state.toursLastMinuteDeals = action.payload.toursLastMinuteDeals
      })
      .addCase(fetchHomePublicData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Khong the tai du lieu trang chu.'
      })

    builder
      .addCase(fetchHomeWeather.pending, (state) => {
        state.weatherLoading = true
        state.weatherError = null
      })
      .addCase(fetchHomeWeather.fulfilled, (state, action) => {
        state.weatherLoading = false
        state.forecasts = action.payload.forecasts
        state.alerts = action.payload.alerts
        state.crowdPredictions = action.payload.crowdPredictions
      })
      .addCase(fetchHomeWeather.rejected, (state, action) => {
        state.weatherLoading = false
        state.forecasts = []
        state.alerts = []
        state.crowdPredictions = []
        state.weatherError = action.payload ?? 'Khong the tai du lieu thoi tiet.'
      })
  },
})

export const { clearHomeWeather } = homeSlice.actions

export const selectHome = (state: RootState) => state.home

function hasAnyHomePublicData(state: HomeState): boolean {
  return (
    state.destinations.length > 0 ||
    state.tours.length > 0 ||
    state.toursDomesticBeach.length > 0 ||
    state.toursInternationalHot.length > 0 ||
    state.toursLastMinuteDeals.length > 0
  )
}

/** Mega menu: skeleton khi đang gọi BE hoặc đã gọi xong nhưng không có dữ liệu. */
export function selectMegaMenuForceLoading(state: RootState): boolean {
  const home = state.home
  if (home.loading) return true
  return !hasAnyHomePublicData(home)
}

/** @deprecated Dùng selectMegaMenuForceLoading — giữ để tương thích. */
export function selectMegaMenuContentReady(state: RootState): boolean {
  return !selectMegaMenuForceLoading(state)
}

export default homeSlice.reducer
