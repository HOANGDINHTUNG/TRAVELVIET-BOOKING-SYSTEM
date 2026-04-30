package com.wedservice.backend.module.weather.service;

import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.entity.DestinationStatus;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.weather.dto.response.CrowdPredictionResponse;
import com.wedservice.backend.module.weather.dto.response.RouteEstimateResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherAlertResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherDisplayPolicyResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherForecastResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherNoticeCenterResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherPublicNoticeResponse;
import com.wedservice.backend.module.weather.entity.CrowdPrediction;
import com.wedservice.backend.module.weather.entity.RouteEstimate;
import com.wedservice.backend.module.weather.entity.WeatherAlert;
import com.wedservice.backend.module.weather.entity.WeatherDisplayPolicy;
import com.wedservice.backend.module.weather.entity.WeatherForecast;
import com.wedservice.backend.module.weather.entity.WeatherNoticeStatus;
import com.wedservice.backend.module.weather.entity.WeatherPublicNotice;
import com.wedservice.backend.module.weather.repository.CrowdPredictionRepository;
import com.wedservice.backend.module.weather.repository.RouteEstimateRepository;
import com.wedservice.backend.module.weather.repository.WeatherAlertRepository;
import com.wedservice.backend.module.weather.repository.WeatherDisplayPolicyRepository;
import com.wedservice.backend.module.weather.repository.WeatherForecastRepository;
import com.wedservice.backend.module.weather.repository.WeatherPublicNoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PublicWeatherService {

    private final DestinationRepository destinationRepository;
    private final WeatherForecastRepository weatherForecastRepository;
    private final WeatherAlertRepository weatherAlertRepository;
    private final WeatherDisplayPolicyRepository weatherDisplayPolicyRepository;
    private final WeatherPublicNoticeRepository weatherPublicNoticeRepository;
    private final CrowdPredictionRepository crowdPredictionRepository;
    private final RouteEstimateRepository routeEstimateRepository;

    @Transactional(readOnly = true)
    public List<WeatherForecastResponse> getDestinationForecasts(UUID destinationUuid) {
        Destination destination = findPublicDestination(destinationUuid);
        WeatherDisplayPolicy policy = findDisplayPolicyOrDefault(destination.getId());
        return weatherForecastRepository.findByDestinationIdAndForecastDateGreaterThanEqualOrderByForecastDateAsc(
                        destination.getId(),
                        LocalDate.now()
                ).stream()
                .map(forecast -> toForecastResponse(forecast, policy))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<WeatherAlertResponse> getDestinationAlerts(UUID destinationUuid) {
        Destination destination = findPublicDestination(destinationUuid);
        WeatherDisplayPolicy policy = findDisplayPolicyOrDefault(destination.getId());
        if (!Boolean.TRUE.equals(policy.getShowAlerts())) {
            return List.of();
        }

        LocalDateTime now = LocalDateTime.now();
        return weatherAlertRepository
                .findByDestinationIdAndIsActiveTrueAndValidFromLessThanEqualAndValidToGreaterThanEqualOrderByValidFromDesc(
                        destination.getId(),
                        now,
                        now
                ).stream()
                .map(alert -> toAlertResponse(alert, policy))
                .toList();
    }

    @Transactional(readOnly = true)
    public WeatherNoticeCenterResponse getDestinationWeatherNotice(UUID destinationUuid) {
        Destination destination = findPublicDestination(destinationUuid);
        WeatherDisplayPolicy policy = findDisplayPolicyOrDefault(destination.getId());
        LocalDateTime now = LocalDateTime.now();

        WeatherForecastResponse currentForecast = weatherForecastRepository
                .findByDestinationIdAndForecastDateGreaterThanEqualOrderByForecastDateAsc(
                        destination.getId(),
                        LocalDate.now()
                ).stream()
                .findFirst()
                .map(forecast -> toForecastResponse(forecast, policy))
                .orElse(null);

        List<WeatherPublicNoticeResponse> notices = weatherPublicNoticeRepository
                .findByDestinationIdAndStatusAndDisplayFromLessThanEqualAndDisplayToGreaterThanEqualOrderByPinnedDescDisplayFromDesc(
                        destination.getId(),
                        WeatherNoticeStatus.PUBLISHED,
                        now,
                        now
                ).stream()
                .map(this::toPublicNoticeResponse)
                .toList();

        List<WeatherAlertResponse> activeAlerts = Boolean.TRUE.equals(policy.getShowAlerts())
                ? weatherAlertRepository
                .findByDestinationIdAndIsActiveTrueAndValidFromLessThanEqualAndValidToGreaterThanEqualOrderByValidFromDesc(
                        destination.getId(),
                        now,
                        now
                ).stream()
                .map(alert -> toAlertResponse(alert, policy))
                .toList()
                : List.of();

        return WeatherNoticeCenterResponse.builder()
                .destinationId(destination.getId())
                .displayPolicy(toDisplayPolicyResponse(policy))
                .currentForecast(currentForecast)
                .notices(notices)
                .activeAlerts(activeAlerts)
                .build();
    }

    @Transactional(readOnly = true)
    public List<CrowdPredictionResponse> getDestinationCrowdPredictions(UUID destinationUuid) {
        Destination destination = findPublicDestination(destinationUuid);
        return crowdPredictionRepository.findByDestinationIdAndPredictionDateGreaterThanEqualOrderByPredictionDateAsc(
                        destination.getId(),
                        LocalDate.now()
                ).stream()
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
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with uuid: " + destinationUuid));

        if (destination.getDeletedAt() != null
                || destination.getStatus() != DestinationStatus.APPROVED
                || !Boolean.TRUE.equals(destination.getIsActive())) {
            throw new ResourceNotFoundException("Destination not found with uuid: " + destinationUuid);
        }
        return destination;
    }

    private WeatherDisplayPolicy findDisplayPolicyOrDefault(Long destinationId) {
        return weatherDisplayPolicyRepository.findByDestinationId(destinationId)
                .orElseGet(() -> WeatherDisplayPolicy.builder()
                        .destinationId(destinationId)
                        .build());
    }

    private WeatherForecastResponse toForecastResponse(WeatherForecast forecast, WeatherDisplayPolicy policy) {
        return WeatherForecastResponse.builder()
                .id(forecast.getId())
                .destinationId(forecast.getDestinationId())
                .forecastDate(forecast.getForecastDate())
                .weatherCode(Boolean.TRUE.equals(policy.getShowForecastSummary()) ? forecast.getWeatherCode() : null)
                .summary(Boolean.TRUE.equals(policy.getShowForecastSummary()) ? forecast.getSummary() : null)
                .tempMin(Boolean.TRUE.equals(policy.getShowTemperature()) ? forecast.getTempMin() : null)
                .tempMax(Boolean.TRUE.equals(policy.getShowTemperature()) ? forecast.getTempMax() : null)
                .humidityPercent(Boolean.TRUE.equals(policy.getShowHumidity()) ? forecast.getHumidityPercent() : null)
                .windSpeed(Boolean.TRUE.equals(policy.getShowWindSpeed()) ? forecast.getWindSpeed() : null)
                .rainProbability(Boolean.TRUE.equals(policy.getShowRainProbability()) ? forecast.getRainProbability() : null)
                .sourceName(forecast.getSourceName())
                .rawPayload(null)
                .createdAt(forecast.getCreatedAt())
                .build();
    }

    private WeatherAlertResponse toAlertResponse(WeatherAlert alert, WeatherDisplayPolicy policy) {
        boolean showDetail = Boolean.TRUE.equals(policy.getShowAlertDetail());
        return WeatherAlertResponse.builder()
                .id(alert.getId())
                .destinationId(alert.getDestinationId())
                .scheduleId(alert.getScheduleId())
                .severity(alert.getSeverity())
                .alertType(alert.getAlertType())
                .title(alert.getTitle())
                .message(showDetail ? alert.getMessage() : null)
                .actionAdvice(showDetail ? alert.getActionAdvice() : null)
                .validFrom(alert.getValidFrom())
                .validTo(alert.getValidTo())
                .isActive(alert.getIsActive())
                .createdAt(alert.getCreatedAt())
                .build();
    }

    private WeatherDisplayPolicyResponse toDisplayPolicyResponse(WeatherDisplayPolicy policy) {
        return WeatherDisplayPolicyResponse.builder()
                .id(policy.getId())
                .destinationId(policy.getDestinationId())
                .showForecastSummary(policy.getShowForecastSummary())
                .showTemperature(policy.getShowTemperature())
                .showRainProbability(policy.getShowRainProbability())
                .showWindSpeed(policy.getShowWindSpeed())
                .showHumidity(policy.getShowHumidity())
                .showAqi(policy.getShowAqi())
                .showHourlyForecast(policy.getShowHourlyForecast())
                .showAlerts(policy.getShowAlerts())
                .showAlertDetail(policy.getShowAlertDetail())
                .updatedAt(policy.getUpdatedAt())
                .build();
    }

    private WeatherPublicNoticeResponse toPublicNoticeResponse(WeatherPublicNotice notice) {
        return WeatherPublicNoticeResponse.builder()
                .id(notice.getId())
                .destinationId(notice.getDestinationId())
                .sourceAlertId(notice.getSourceAlertId())
                .severity(notice.getSeverity())
                .title(notice.getTitle())
                .summary(notice.getSummary())
                .detail(notice.getDetail())
                .actionAdvice(notice.getActionAdvice())
                .displayFrom(notice.getDisplayFrom())
                .displayTo(notice.getDisplayTo())
                .status(notice.getStatus())
                .pinned(notice.getPinned())
                .createdAt(notice.getCreatedAt())
                .updatedAt(notice.getUpdatedAt())
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
}
