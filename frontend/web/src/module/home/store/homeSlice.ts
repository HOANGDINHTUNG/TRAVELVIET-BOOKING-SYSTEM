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
  WeatherNoticeCenter,
} from '../database/interface/publicTravel'

type HomePublicData = {
  destinations: Destination[]
  tours: Tour[]
}

type HomeWeatherData = {
  noticeCenter: WeatherNoticeCenter | null
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
  noticeCenter: null,
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
  const [destinationResult, tourResult] = await Promise.allSettled([
    destinationApi.getDestinations(),
    tourApi.getTours(),
  ])

  if (destinationResult.status === 'fulfilled') {
    return {
      destinations: destinationResult.value,
      tours: tourResult.status === 'fulfilled' ? tourResult.value : [],
    }
  }

  const error = getSettledError(destinationResult) ?? getSettledError(tourResult)

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
  const [noticeCenter, forecasts, alerts, crowdPredictions] =
    await Promise.allSettled([
      weatherApi.getDestinationWeatherNotice(destinationUuid),
      weatherApi.getDestinationForecasts(destinationUuid),
      weatherApi.getDestinationAlerts(destinationUuid),
      weatherApi.getDestinationCrowdPredictions(destinationUuid),
    ])

  const resolvedNoticeCenter =
    noticeCenter.status === 'fulfilled' ? noticeCenter.value : null
  const resolvedForecasts =
    forecasts.status === 'fulfilled' ? forecasts.value : []
  const resolvedAlerts = alerts.status === 'fulfilled' ? alerts.value : []
  const resolvedCrowdPredictions =
    crowdPredictions.status === 'fulfilled' ? crowdPredictions.value : []

  if (
    noticeCenter.status === 'rejected' &&
    forecasts.status === 'rejected' &&
    alerts.status === 'rejected' &&
    crowdPredictions.status === 'rejected'
  ) {
    const error = getSettledError(noticeCenter)

    return rejectWithValue(
      getErrorMessage(error, 'Khong the tai du lieu thoi tiet.'),
    )
  }

  return {
    noticeCenter: resolvedNoticeCenter,
    forecasts: resolvedNoticeCenter?.currentForecast
      ? [resolvedNoticeCenter.currentForecast]
      : resolvedForecasts,
    alerts: resolvedNoticeCenter?.activeAlerts ?? resolvedAlerts,
    crowdPredictions: resolvedCrowdPredictions,
  }
})

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeWeather(state) {
      state.noticeCenter = null
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
        state.noticeCenter = action.payload.noticeCenter
        state.forecasts = action.payload.forecasts
        state.alerts = action.payload.alerts
        state.crowdPredictions = action.payload.crowdPredictions
      })
      .addCase(fetchHomeWeather.rejected, (state, action) => {
        state.weatherLoading = false
        state.noticeCenter = null
        state.forecasts = []
        state.alerts = []
        state.crowdPredictions = []
        state.weatherError = action.payload ?? 'Khong the tai du lieu thoi tiet.'
      })
  },
})

export const { clearHomeWeather } = homeSlice.actions

export const selectHome = (state: RootState) => state.home

export default homeSlice.reducer
