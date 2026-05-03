package com.wedservice.backend.module.weather.service;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ExternalServiceException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.entity.DestinationStatus;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.weather.config.WeatherApiProperties;
import com.wedservice.backend.module.weather.dto.response.CrowdPredictionResponse;
import com.wedservice.backend.module.weather.dto.response.RouteEstimateResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherAlertResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherForecastResponse;
import com.wedservice.backend.module.weather.entity.CrowdPrediction;
import com.wedservice.backend.module.weather.entity.RouteEstimate;
import com.wedservice.backend.module.weather.entity.WeatherAlert;
import com.wedservice.backend.module.weather.entity.WeatherForecast;
import com.wedservice.backend.module.weather.integration.WeatherApiClient;
import com.wedservice.backend.module.weather.repository.CrowdPredictionRepository;
import com.wedservice.backend.module.weather.repository.RouteEstimateRepository;
import com.wedservice.backend.module.weather.repository.WeatherAlertRepository;
import com.wedservice.backend.module.weather.repository.WeatherForecastRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import tools.jackson.databind.JsonNode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PublicWeatherService {

    private final DestinationRepository destinationRepository;
    private final WeatherForecastRepository weatherForecastRepository;
    private final WeatherAlertRepository weatherAlertRepository;
    private final CrowdPredictionRepository crowdPredictionRepository;
    private final RouteEstimateRepository routeEstimateRepository;
    private final WeatherApiClient weatherApiClient;
    private final WeatherApiProperties weatherApiProperties;

    @Transactional(readOnly = true)
    public List<WeatherForecastResponse> getDestinationForecasts(UUID destinationUuid) {
        Destination destination = findPublicDestination(destinationUuid);
        if (weatherApiClient.isConfigured()) {
            try {
                return getLiveDestinationForecasts(destination);
            } catch (BadRequestException | ExternalServiceException ex) {
                log.warn(
                        "WeatherAPI.com forecast failed for destination {}. Falling back to stored forecasts. Cause: {}",
                        destinationUuid,
                        ex.getMessage());
            }
        }

        return getStoredDestinationForecasts(destination);
    }

    public JsonNode getRealtime(String query, String aqi) {
        return weatherApiClient.fetchCurrent(normalizeQuery(query), normalizeYesNo(aqi, "aqi"));
    }

    public JsonNode getForecast(String query, int days, String aqi, String alerts) {
        return weatherApiClient.fetchForecast(
                normalizeQuery(query),
                normalizeForecastDays(days),
                normalizeYesNo(aqi, "aqi"),
                normalizeYesNo(alerts, "alerts"));
    }

    public JsonNode searchLocations(String query) {
        return weatherApiClient.search(normalizeQuery(query));
    }

    public JsonNode lookupIp(String query) {
        return weatherApiClient.lookupIp(normalizeQuery(query));
    }

    private List<WeatherForecastResponse> getStoredDestinationForecasts(Destination destination) {
        return weatherForecastRepository.findByDestinationIdAndForecastDateGreaterThanEqualOrderByForecastDateAsc(
                destination.getId(),
                LocalDate.now()).stream()
                .map(this::toForecastResponse)
                .toList();
    }

    private List<WeatherForecastResponse> getLiveDestinationForecasts(Destination destination) {
        JsonNode payload = weatherApiClient.fetchForecast(
                buildWeatherApiLocationQuery(destination),
                normalizeForecastDays(weatherApiProperties.getForecastDays()),
                normalizeYesNo(weatherApiProperties.getAqi(), "aqi"),
                normalizeYesNo(weatherApiProperties.getAlerts(), "alerts"));
        JsonNode forecastDays = payload.path("forecast").path("forecastday");

        if (!forecastDays.isArray()) {
            return List.of();
        }

        List<WeatherForecastResponse> forecasts = new ArrayList<>();
        for (JsonNode forecastDay : forecastDays) {
            forecasts.add(toWeatherApiForecastResponse(destination, forecastDay));
        }
        return forecasts;
    }

    @Transactional(readOnly = true)
    public List<WeatherAlertResponse> getDestinationAlerts(UUID destinationUuid) {
        Destination destination = findPublicDestination(destinationUuid);
        LocalDateTime now = LocalDateTime.now();
        return weatherAlertRepository
                .findByDestinationIdAndIsActiveTrueAndValidFromLessThanEqualAndValidToGreaterThanEqualOrderByValidFromDesc(
                        destination.getId(),
                        now,
                        now)
                .stream()
                .map(this::toAlertResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CrowdPredictionResponse> getDestinationCrowdPredictions(UUID destinationUuid) {
        Destination destination = findPublicDestination(destinationUuid);
        return crowdPredictionRepository.findByDestinationIdAndPredictionDateGreaterThanEqualOrderByPredictionDateAsc(
                destination.getId(),
                LocalDate.now()).stream()
                .map(this::toCrowdPredictionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RouteEstimateResponse> getRouteEstimates(String fromLabel, String toLabel) {
        String normalizedFromLabel = normalizeLabel(fromLabel);
        String normalizedToLabel = normalizeLabel(toLabel);
        return routeEstimateRepository.findTop100ByOrderByCreatedAtDesc().stream()
                .filter(item -> matchesLabel(item.getFromLabel(), normalizedFromLabel))
                .filter(item -> matchesLabel(item.getToLabel(), normalizedToLabel))
                .limit(20)
                .map(this::toRouteEstimateResponse)
                .toList();
    }

    private Destination findPublicDestination(UUID destinationUuid) {
        Destination destination = destinationRepository.findByUuid(destinationUuid)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Destination not found with uuid: " + destinationUuid));

        if (destination.getDeletedAt() != null
                || destination.getStatus() != DestinationStatus.APPROVED
                || !Boolean.TRUE.equals(destination.getIsActive())) {
            throw new ResourceNotFoundException("Destination not found with uuid: " + destinationUuid);
        }
        return destination;
    }

    private WeatherForecastResponse toWeatherApiForecastResponse(Destination destination, JsonNode forecastDay) {
        JsonNode day = forecastDay.path("day");
        JsonNode condition = day.path("condition");

        return WeatherForecastResponse.builder()
                .destinationId(destination.getId())
                .forecastDate(parseDate(forecastDay.path("date").asString()))
                .weatherCode(textToNull(condition.path("code").asString()))
                .summary(textToNull(condition.path("text").asString()))
                .tempMin(decimalValue(day.path("mintemp_c")))
                .tempMax(decimalValue(day.path("maxtemp_c")))
                .humidityPercent(decimalValue(day.path("avghumidity")))
                .windSpeed(decimalValue(day.path("maxwind_kph")))
                .rainProbability(decimalValue(day.path("daily_chance_of_rain")))
                .sourceName(weatherApiClient.getSourceName())
                .rawPayload(forecastDay.toString())
                .build();
    }

    private WeatherForecastResponse toForecastResponse(WeatherForecast forecast) {
        return WeatherForecastResponse.builder()
                .id(forecast.getId())
                .destinationId(forecast.getDestinationId())
                .forecastDate(forecast.getForecastDate())
                .weatherCode(forecast.getWeatherCode())
                .summary(forecast.getSummary())
                .tempMin(forecast.getTempMin())
                .tempMax(forecast.getTempMax())
                .humidityPercent(forecast.getHumidityPercent())
                .windSpeed(forecast.getWindSpeed())
                .rainProbability(forecast.getRainProbability())
                .sourceName(forecast.getSourceName())
                .rawPayload(forecast.getRawPayload())
                .createdAt(forecast.getCreatedAt())
                .build();
    }

    private WeatherAlertResponse toAlertResponse(WeatherAlert alert) {
        return WeatherAlertResponse.builder()
                .id(alert.getId())
                .destinationId(alert.getDestinationId())
                .scheduleId(alert.getScheduleId())
                .severity(alert.getSeverity())
                .alertType(alert.getAlertType())
                .title(alert.getTitle())
                .message(alert.getMessage())
                .actionAdvice(alert.getActionAdvice())
                .validFrom(alert.getValidFrom())
                .validTo(alert.getValidTo())
                .isActive(alert.getIsActive())
                .createdAt(alert.getCreatedAt())
                .build();
    }

    private CrowdPredictionResponse toCrowdPredictionResponse(CrowdPrediction prediction) {
        return CrowdPredictionResponse.builder()
                .id(prediction.getId())
                .destinationId(prediction.getDestinationId())
                .predictionDate(prediction.getPredictionDate())
                .crowdLevel(prediction.getCrowdLevel() == null ? null : prediction.getCrowdLevel().getValue())
                .predictedVisitors(prediction.getPredictedVisitors())
                .confidenceScore(prediction.getConfidenceScore())
                .reasonsJson(prediction.getReasonsJson())
                .createdAt(prediction.getCreatedAt())
                .build();
    }

    private RouteEstimateResponse toRouteEstimateResponse(RouteEstimate routeEstimate) {
        return RouteEstimateResponse.builder()
                .id(routeEstimate.getId())
                .fromLabel(routeEstimate.getFromLabel())
                .toLabel(routeEstimate.getToLabel())
                .fromLatitude(routeEstimate.getFromLatitude())
                .fromLongitude(routeEstimate.getFromLongitude())
                .toLatitude(routeEstimate.getToLatitude())
                .toLongitude(routeEstimate.getToLongitude())
                .distanceKm(routeEstimate.getDistanceKm())
                .durationMinutes(routeEstimate.getDurationMinutes())
                .googleMapUrl(routeEstimate.getGoogleMapUrl())
                .sourceName(routeEstimate.getSourceName())
                .createdAt(routeEstimate.getCreatedAt())
                .build();
    }

    private String normalizeLabel(String value) {
        return StringUtils.hasText(value) ? value.trim().toLowerCase() : null;
    }

    private boolean matchesLabel(String sourceValue, String normalizedFilter) {
        if (!StringUtils.hasText(normalizedFilter)) {
            return true;
        }
        return StringUtils.hasText(sourceValue) && sourceValue.toLowerCase().contains(normalizedFilter);
    }

    private String buildWeatherApiLocationQuery(Destination destination) {
        if (destination.getLatitude() != null && destination.getLongitude() != null) {
            return destination.getLatitude().toPlainString() + "," + destination.getLongitude().toPlainString();
        }

        List<String> parts = new ArrayList<>();
        addLocationPart(parts, destination.getName());
        addLocationPart(parts, destination.getProvince());
        addLocationPart(parts, destination.getCountryCode());
        return String.join(", ", parts);
    }

    private void addLocationPart(List<String> parts, String value) {
        if (StringUtils.hasText(value)) {
            parts.add(value.trim());
        }
    }

    private String normalizeQuery(String value) {
        if (!StringUtils.hasText(value)) {
            throw new BadRequestException("q is required");
        }
        return value.trim();
    }

    private int normalizeForecastDays(int days) {
        if (days < 1 || days > 14) {
            throw new BadRequestException("days must be between 1 and 14");
        }
        return days;
    }

    private String normalizeYesNo(String value, String fieldName) {
        String normalized = StringUtils.hasText(value) ? value.trim().toLowerCase() : "no";
        if (!"yes".equals(normalized) && !"no".equals(normalized)) {
            throw new BadRequestException(fieldName + " must be yes or no");
        }
        return normalized;
    }

    private LocalDate parseDate(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }

        try {
            return LocalDate.parse(value);
        } catch (Exception ex) {
            return null;
        }
    }

    private BigDecimal decimalValue(JsonNode value) {
        if (value == null || value.isMissingNode() || value.isNull()) {
            return null;
        }

        String rawValue = value.asString();
        if (!StringUtils.hasText(rawValue)) {
            return null;
        }

        try {
            return new BigDecimal(rawValue);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String textToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
