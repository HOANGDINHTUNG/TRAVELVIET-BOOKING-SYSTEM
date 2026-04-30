export type WeatherSeverity = 'info' | 'watch' | 'warning' | 'danger';
export type WeatherNoticeStatus = 'draft' | 'published' | 'expired';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type WeatherDisplayPolicy = {
  id?: number | null;
  destinationId: number;
  showForecastSummary?: boolean | null;
  showTemperature?: boolean | null;
  showRainProbability?: boolean | null;
  showWindSpeed?: boolean | null;
  showHumidity?: boolean | null;
  showAqi?: boolean | null;
  showHourlyForecast?: boolean | null;
  showAlerts?: boolean | null;
  showAlertDetail?: boolean | null;
  updatedAt?: string | null;
};

export type WeatherForecast = {
  id?: number | null;
  destinationId: number;
  forecastDate?: string | null;
  weatherCode?: string | null;
  summary?: string | null;
  tempMin?: number | null;
  tempMax?: number | null;
  humidityPercent?: number | null;
  windSpeed?: number | null;
  rainProbability?: number | null;
  sourceName?: string | null;
  rawPayload?: string | null;
  createdAt?: string | null;
};

export type WeatherAlert = {
  id?: number | null;
  destinationId: number;
  scheduleId?: number | null;
  severity?: WeatherSeverity | null;
  alertType?: string | null;
  title?: string | null;
  message?: string | null;
  actionAdvice?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  isActive?: boolean | null;
  createdAt?: string | null;
};

export type WeatherPublicNotice = {
  id?: number | null;
  destinationId: number;
  sourceAlertId?: number | null;
  severity?: WeatherSeverity | null;
  title?: string | null;
  summary?: string | null;
  detail?: string | null;
  actionAdvice?: string | null;
  displayFrom?: string | null;
  displayTo?: string | null;
  status?: WeatherNoticeStatus | null;
  pinned?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type WeatherNoticeCenter = {
  destinationId: number;
  displayPolicy?: WeatherDisplayPolicy | null;
  currentForecast?: WeatherForecast | null;
  notices?: WeatherPublicNotice[] | null;
  activeAlerts?: WeatherAlert[] | null;
};

export type WeatherNoticeResult = {
  data: WeatherNoticeCenter;
  source: 'backend' | 'fallback';
};
