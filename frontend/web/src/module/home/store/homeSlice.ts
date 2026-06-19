import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { destinationApi } from "../../../api/server/Destination.api";
import { tourApi } from "../../../api/server/Tour.api";
import { weatherApi } from "../../../api/server/Weather.api";
import type { RootState } from "../../../stores";
import type {
  CrowdPrediction,
  Destination,
  Tour,
  WeatherAlert,
  WeatherForecast,
} from "../database/interface/publicTravel";

export type DynamicTourRow = {
  title: string;
  tagCode: string;
  tours: Tour[];
};

type HomePublicData = {
  destinations: Destination[];
  tours: Tour[];
  dynamicRows: DynamicTourRow[];
  toursLastMinuteDeals: Tour[];
};

type HomeWeatherData = {
  forecasts: WeatherForecast[];
  alerts: WeatherAlert[];
  crowdPredictions: CrowdPrediction[];
};

type HomeState = HomePublicData &
  HomeWeatherData & {
    loading: boolean;
    weatherLoading: boolean;
    error: string | null;
    weatherError: string | null;
  };

const initialState: HomeState = {
  destinations: [],
  tours: [],
  dynamicRows: [],
  toursLastMinuteDeals: [],
  forecasts: [],
  alerts: [],
  crowdPredictions: [],
  loading: false,
  weatherLoading: false,
  error: null,
  weatherError: null,
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function getSettledError(result: PromiseSettledResult<unknown>) {
  return result.status === "rejected" ? result.reason : null;
}

const CATEGORIES_POOL = [
  { code: "MAO_HIEM", name: "Khám Phá Mạo Hiểm" },
  { code: "SANG_TRONG", name: "Trải Nghiệm Sang Trọng" },
  { code: "GIA_DINH", name: "Du Lịch Gia Đình" },
  { code: "SINH_THAI", name: "Du Lịch Sinh Thái" },
  { code: "NGHI_DUONG", name: "Nghỉ Dưỡng Thư Giãn" },
  { code: "VAN_HOA", name: "Văn Hóa Bản Địa" },
  { code: "AM_THUC", name: "Khám Phá Ẩm Thực" },
  { code: "LICH_SU", name: "Hành Trình Lịch Sử" },
  { code: "TAM_LINH", name: "Hành Hương Tâm Linh" },
  { code: "GIAI_TRI", name: "Vui Chơi Sôi Động" },
  { code: "CAP_DOI", name: "Lãng Mạn Cặp Đôi" },
  { code: "CHECKIN", name: "Góc Nhìn Check-in" },
  { code: "WILDLIFE", name: "Động Vật Hoang Dã" },
  { code: "THE_THAO_NUOC", name: "Thể Thao Dưới Nước" },
  { code: "TREKKING", name: "Trải Nghiệm Trekking" },
  { code: "CAMPING", name: "Cắm Trại & Lửa Trại" },
  { code: "VISA_FREE", name: "Du Lịch Miễn Visa" },
];

export const fetchHomePublicData = createAsyncThunk<
  HomePublicData,
  void,
  { rejectValue: string }
>("home/fetchPublicData", async (_unused, { rejectWithValue }) => {
  const shuffled = [...CATEGORIES_POOL].sort(() => 0.5 - Math.random());
  const selectedCategories = shuffled.slice(0, 2);

  const [
    destinationResult,
    tourResult,
    row1Result,
    row2Result,
    lastMinuteDealsResult,
  ] = await Promise.allSettled([
    destinationApi.getDestinations(),
    tourApi.getTours(),
    tourApi.searchPublicTours({
      tagCodes: [selectedCategories[0].code],
      size: 10,
    }),
    tourApi.searchPublicTours({
      tagCodes: [selectedCategories[1].code],
      size: 10,
    }),
    tourApi.searchPublicTours({
      tagCodes: ["HOME_FLASH_SALE"],
      featuredOnly: true,
      size: 12,
      sortBy: "totalBookings",
      sortDir: "desc",
    }),
  ]);

  const toursLastMinuteDeals =
    lastMinuteDealsResult.status === "fulfilled"
      ? lastMinuteDealsResult.value
      : [];

  const dynamicRows: DynamicTourRow[] = [];
  if (row1Result.status === "fulfilled" && row1Result.value.length >= 2) {
    dynamicRows.push({
      title: selectedCategories[0].name,
      tagCode: selectedCategories[0].code,
      tours: row1Result.value,
    });
  } else {
    const beachResult = await tourApi.searchPublicTours({
      tagCodes: ["HOME_BEACH_VN"],
      size: 10,
    });
    dynamicRows.push({
      title: "Biển Đảo Việt Theo Mùa",
      tagCode: "HOME_BEACH_VN",
      tours: beachResult,
    });
  }

  if (row2Result.status === "fulfilled" && row2Result.value.length >= 2) {
    dynamicRows.push({
      title: selectedCategories[1].name,
      tagCode: selectedCategories[1].code,
      tours: row2Result.value,
    });
  } else {
    const intlResult = await tourApi.searchPublicTours({
      tagCodes: ["HOME_HOT_INTL"],
      size: 10,
    });
    dynamicRows.push({
      title: "Quốc Tế Đang Hot",
      tagCode: "HOME_HOT_INTL",
      tours: intlResult,
    });
  }

  const payload: HomePublicData = {
    destinations:
      destinationResult.status === "fulfilled" ? destinationResult.value : [],
    tours: tourResult.status === "fulfilled" ? tourResult.value : [],
    dynamicRows,
    toursLastMinuteDeals,
  };

  const hasAnyHomeData =
    payload.destinations.length > 0 ||
    payload.tours.length > 0 ||
    payload.dynamicRows.some((row) => row.tours.length > 0) ||
    payload.toursLastMinuteDeals.length > 0;

  if (hasAnyHomeData) {
    return payload;
  }

  return rejectWithValue("Khong the tai du lieu trang chu.");
});

export const fetchHomeWeather = createAsyncThunk<
  HomeWeatherData,
  string,
  { rejectValue: string }
>("home/fetchWeather", async (destinationUuid, { rejectWithValue }) => {
  try {
    const [forecasts, alerts, crowdPredictions] = await Promise.all([
      weatherApi.getDestinationForecasts(destinationUuid),
      weatherApi.getDestinationAlerts(destinationUuid),
      weatherApi.getDestinationCrowdPredictions(destinationUuid),
    ]);

    return { forecasts, alerts, crowdPredictions };
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Khong the tai du lieu thoi tiet."),
    );
  }
});

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearHomeWeather(state) {
      state.forecasts = [];
      state.alerts = [];
      state.crowdPredictions = [];
      state.weatherError = null;
      state.weatherLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePublicData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomePublicData.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload.destinations;
        state.tours = action.payload.tours;
        state.dynamicRows = action.payload.dynamicRows;
        state.toursLastMinuteDeals = action.payload.toursLastMinuteDeals;
      })
      .addCase(fetchHomePublicData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Khong the tai du lieu trang chu.";
      });

    builder
      .addCase(fetchHomeWeather.pending, (state) => {
        state.weatherLoading = true;
        state.weatherError = null;
      })
      .addCase(fetchHomeWeather.fulfilled, (state, action) => {
        state.weatherLoading = false;
        state.forecasts = action.payload.forecasts;
        state.alerts = action.payload.alerts;
        state.crowdPredictions = action.payload.crowdPredictions;
      })
      .addCase(fetchHomeWeather.rejected, (state, action) => {
        state.weatherLoading = false;
        state.forecasts = [];
        state.alerts = [];
        state.crowdPredictions = [];
        state.weatherError =
          action.payload ?? "Khong the tai du lieu thoi tiet.";
      });
  },
});

export const { clearHomeWeather } = homeSlice.actions;

export const selectHome = (state: RootState) => state.home;

function hasAnyHomePublicData(state: HomeState): boolean {
  return (
    state.destinations.length > 0 ||
    state.tours.length > 0 ||
    state.dynamicRows.some((row) => row.tours.length > 0) ||
    state.toursLastMinuteDeals.length > 0
  );
}

/** Mega menu: skeleton khi đang gọi BE hoặc đã gọi xong nhưng không có dữ liệu. */
export function selectMegaMenuForceLoading(state: RootState): boolean {
  const home = state.home;
  if (home.loading) return true;
  return !hasAnyHomePublicData(home);
}

/** @deprecated Dùng selectMegaMenuForceLoading — giữ để tương thích. */
export function selectMegaMenuContentReady(state: RootState): boolean {
  return !selectMegaMenuForceLoading(state);
}

export default homeSlice.reducer;
