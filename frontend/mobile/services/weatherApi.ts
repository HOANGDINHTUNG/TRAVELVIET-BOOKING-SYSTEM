import {
  BACKEND_WEATHER_MOCKS,
  getDestinationById,
  getDestinationByUuid,
} from '@/constants/Tours';
import type {
  ApiResponse,
  WeatherNoticeCenter,
  WeatherNoticeResult,
  WeatherSeverity,
} from '@/types/Weather';

const DEFAULT_API_BASE_URL = 'http://localhost:8088/api/v1';
const REQUEST_TIMEOUT_MS = 6500;

function getApiBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  return (envUrl && envUrl.trim().length > 0 ? envUrl : DEFAULT_API_BASE_URL).replace(/\/$/, '');
}

export async function fetchDestinationWeatherNotice(
  destinationUuid: string,
  fallbackDestinationId?: number,
): Promise<WeatherNoticeResult> {
  if (!destinationUuid) {
    return {
      data: buildFallbackWeatherNotice(fallbackDestinationId),
      source: 'fallback',
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/destinations/${encodeURIComponent(destinationUuid)}/weather/notice`,
      { signal: controller.signal },
    );

    if (!response.ok) {
      throw new Error(`Weather request failed: ${response.status}`);
    }

    const payload = (await response.json()) as ApiResponse<WeatherNoticeCenter>;
    if (!payload.success || !payload.data) {
      throw new Error(payload.message || 'Weather response is empty');
    }

    return { data: payload.data, source: 'backend' };
  } catch {
    return {
      data: buildFallbackWeatherNotice(fallbackDestinationId, destinationUuid),
      source: 'fallback',
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildFallbackWeatherNotice(
  destinationId?: number,
  destinationUuid?: string,
): WeatherNoticeCenter {
  const destination =
    (destinationId ? getDestinationById(destinationId) : undefined) ||
    (destinationUuid ? getDestinationByUuid(destinationUuid) : undefined) ||
    getDestinationById(102);
  const weather =
    BACKEND_WEATHER_MOCKS.find((item) => item.destinationId === destination?.id) ||
    BACKEND_WEATHER_MOCKS[0];
  const severity = getFallbackSeverity(weather.rainProbability);
  const isRainy = weather.rainProbability >= 50;

  return {
    destinationId: destination?.id ?? weather.destinationId,
    displayPolicy: {
      destinationId: destination?.id ?? weather.destinationId,
      showForecastSummary: true,
      showTemperature: true,
      showRainProbability: true,
      showWindSpeed: true,
      showHumidity: true,
      showAqi: false,
      showHourlyForecast: false,
      showAlerts: true,
      showAlertDetail: true,
    },
    currentForecast: {
      id: weather.id,
      destinationId: weather.destinationId,
      forecastDate: weather.forecastDate,
      weatherCode: weather.weatherCode,
      summary: weather.summary,
      tempMin: weather.tempMin,
      tempMax: weather.tempMax,
      humidityPercent: weather.humidityPercent,
      windSpeed: weather.windSpeed,
      rainProbability: weather.rainProbability,
      sourceName: weather.sourceName,
    },
    notices: [
      {
        id: weather.id,
        destinationId: weather.destinationId,
        severity,
        title: isRainy ? 'Luu y thoi tiet' : 'Thoi tiet on dinh',
        summary: isRainy
          ? `Kha nang mua ${weather.rainProbability}%, nen chuan bi ao mua mong.`
          : `Nhiet do ${weather.tempMin}-${weather.tempMax}C, phu hop de khoi hanh.`,
        detail: isRainy
          ? `Du lieu du phong ghi nhan xac suat mua cao tai ${destination?.name ?? 'diem den'}. Nen uu tien giay de di bo va tui chong nuoc cho do dien tu.`
          : `Du lieu du phong cho thay thoi tiet kha de chiu tai ${destination?.name ?? 'diem den'}. Van nen theo doi cap nhat truoc gio khoi hanh.`,
        actionAdvice: isRainy
          ? 'Mang ao mua, boc tui hanh ly gon va tranh lich trinh ngoai troi qua dai.'
          : 'Giu lich trinh linh hoat va mang them nuoc uong.',
        status: 'published',
        pinned: isRainy,
      },
    ],
    activeAlerts: isRainy
      ? [
          {
            id: weather.id,
            destinationId: weather.destinationId,
            severity,
            alertType: 'rain',
            title: 'Co kha nang mua',
            message: `Xac suat mua hien la ${weather.rainProbability}%.`,
            actionAdvice: 'Kiem tra lich trinh ngoai troi truoc khi dat.',
            isActive: true,
          },
        ]
      : [],
  };
}

function getFallbackSeverity(rainProbability: number): WeatherSeverity {
  if (rainProbability >= 75) {
    return 'warning';
  }
  if (rainProbability >= 45) {
    return 'watch';
  }
  return 'info';
}
