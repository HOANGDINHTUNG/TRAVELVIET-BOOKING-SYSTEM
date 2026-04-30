package com.wedservice.backend.module.weather.service;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ResourceNotFoundException;
import com.wedservice.backend.common.util.DataNormalizer;
import com.wedservice.backend.module.destinations.entity.Destination;
import com.wedservice.backend.module.destinations.repository.DestinationRepository;
import com.wedservice.backend.module.users.service.AuditActionType;
import com.wedservice.backend.module.users.service.AuditTrailRecorder;
import com.wedservice.backend.module.weather.dto.response.WeatherAlertResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherApiSyncResponse;
import com.wedservice.backend.module.weather.dto.response.WeatherForecastResponse;
import com.wedservice.backend.module.weather.entity.WeatherAlert;
import com.wedservice.backend.module.weather.entity.WeatherForecast;
import com.wedservice.backend.module.weather.entity.WeatherSeverity;
import com.wedservice.backend.module.weather.integration.WeatherApiClient;
import com.wedservice.backend.module.weather.integration.WeatherApiForecastResult;
import com.wedservice.backend.module.weather.repository.WeatherAlertRepository;
import com.wedservice.backend.module.weather.repository.WeatherForecastRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WeatherApiSyncService {

    private static final String SOURCE_NAME = "WeatherAPI";
    private static final DateTimeFormatter WEATHER_API_DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final DestinationRepository destinationRepository;
    private final WeatherForecastRepository weatherForecastRepository;
    private final WeatherAlertRepository weatherAlertRepository;
    private final WeatherApiClient weatherApiClient;
    private final AuditTrailRecorder auditTrailRecorder;
    private final JsonMapper jsonMapper = JsonMapper.builder().findAndAddModules().build();

    @Transactional
    public WeatherApiSyncResponse syncDestination(UUID destinationUuid) {
        Destination destination = findAdminDestination(destinationUuid);
        String query = buildQuery(destination);
        WeatherApiForecastResult result = weatherApiClient.fetchForecast(query);

        List<WeatherForecastResponse> forecasts = syncForecasts(destination.getId(), result.getPayload());
        List<WeatherAlertResponse> alerts = syncAlerts(destination.getId(), result.getPayload());

        WeatherApiSyncResponse response = WeatherApiSyncResponse.builder()
                .destinationId(destination.getId())
                .query(query)
                .locationName(text(result.getPayload(), "location", "name"))
                .region(text(result.getPayload(), "location", "region"))
                .country(text(result.getPayload(), "location", "country"))
                .fetchedAt(result.getFetchedAt())
                .forecastsSaved(forecasts.size())
                .alertsSaved(alerts.size())
                .forecasts(forecasts)
                .alerts(alerts)
                .build();

        auditTrailRecorder.record(AuditActionType.WEATHERAPI_SYNC, destination.getId(), null, response);
        return response;
    }

    private List<WeatherForecastResponse> syncForecasts(Long destinationId, JsonNode payload) {
        JsonNode forecastDays = node(payload, "forecast", "forecastday");
        if (forecastDays == null || !forecastDays.isArray()) {
            return List.of();
        }

        List<WeatherForecastResponse> responses = new ArrayList<>();
        for (JsonNode item : forecastDays) {
            LocalDate forecastDate = parseDate(text(item, "date"));
            if (forecastDate == null) {
                continue;
            }

            WeatherForecast forecast = weatherForecastRepository
                    .findByDestinationIdAndForecastDate(destinationId, forecastDate)
                    .orElseGet(() -> WeatherForecast.builder()
                            .destinationId(destinationId)
                            .forecastDate(forecastDate)
                            .build());

            JsonNode day = node(item, "day");
            forecast.setWeatherCode(text(day, "condition", "code"));
            forecast.setSummary(text(day, "condition", "text"));
            forecast.setTempMin(decimal(day, "mintemp_c"));
            forecast.setTempMax(decimal(day, "maxtemp_c"));
            forecast.setHumidityPercent(decimal(day, "avghumidity"));
            forecast.setWindSpeed(decimal(day, "maxwind_kph"));
            forecast.setRainProbability(decimal(day, "daily_chance_of_rain"));
            forecast.setSourceName(SOURCE_NAME);
            forecast.setRawPayload(writeJson(item));

            responses.add(toForecastResponse(weatherForecastRepository.save(forecast)));
        }
        return responses;
    }

    private List<WeatherAlertResponse> syncAlerts(Long destinationId, JsonNode payload) {
        JsonNode alertItems = node(payload, "alerts", "alert");
        if (alertItems == null || !alertItems.isArray()) {
            return List.of();
        }

        List<WeatherAlertResponse> responses = new ArrayList<>();
        for (JsonNode item : alertItems) {
            WeatherAlert mappedAlert = mapAlert(destinationId, item);
            WeatherAlert alert = weatherAlertRepository
                    .findFirstByDestinationIdAndAlertTypeAndTitleAndValidFromAndValidTo(
                            destinationId,
                            mappedAlert.getAlertType(),
                            mappedAlert.getTitle(),
                            mappedAlert.getValidFrom(),
                            mappedAlert.getValidTo()
                    )
                    .orElseGet(() -> WeatherAlert.builder()
                            .destinationId(destinationId)
                            .build());

            alert.setSeverity(mappedAlert.getSeverity());
            alert.setAlertType(mappedAlert.getAlertType());
            alert.setTitle(mappedAlert.getTitle());
            alert.setMessage(mappedAlert.getMessage());
            alert.setActionAdvice(mappedAlert.getActionAdvice());
            alert.setValidFrom(mappedAlert.getValidFrom());
            alert.setValidTo(mappedAlert.getValidTo());
            alert.setIsActive(true);

            responses.add(toAlertResponse(weatherAlertRepository.save(alert)));
        }
        return responses;
    }

    private WeatherAlert mapAlert(Long destinationId, JsonNode item) {
        String alertType = firstText(item, "event", "category", "msgtype", "weather");
        String title = firstText(item, "headline", "event", "category", "Weather alert");
        String message = firstText(item, "desc", "note", "headline", title);
        LocalDateTime validFrom = parseDateTime(firstText(item, "effective", "onset", null));
        if (validFrom == null) {
            validFrom = LocalDateTime.now();
        }

        LocalDateTime validTo = parseDateTime(text(item, "expires"));
        if (validTo == null || validTo.isBefore(validFrom)) {
            validTo = validFrom.plusHours(12);
        }

        return WeatherAlert.builder()
                .destinationId(destinationId)
                .severity(mapSeverity(firstText(item, "severity", "urgency", null)))
                .alertType(limit(normalizeRequired(alertType, "alertType"), 100))
                .title(limit(normalizeRequired(title, "title"), 255))
                .message(normalizeRequired(message, "message"))
                .actionAdvice(trimToNull(firstText(item, "instruction", "note", null)))
                .validFrom(validFrom)
                .validTo(validTo)
                .isActive(true)
                .build();
    }

    private WeatherSeverity mapSeverity(String value) {
        if (!StringUtils.hasText(value)) {
            return WeatherSeverity.INFO;
        }

        String normalized = value.toLowerCase(Locale.ROOT);
        if (normalized.contains("extreme")) {
            return WeatherSeverity.DANGER;
        }
        if (normalized.contains("severe")) {
            return WeatherSeverity.WARNING;
        }
        if (normalized.contains("moderate") || normalized.contains("watch")) {
            return WeatherSeverity.WATCH;
        }
        return WeatherSeverity.INFO;
    }

    private String buildQuery(Destination destination) {
        if (destination.getLatitude() != null && destination.getLongitude() != null) {
            return destination.getLatitude().stripTrailingZeros().toPlainString()
                    + ","
                    + destination.getLongitude().stripTrailingZeros().toPlainString();
        }

        String name = trimToNull(destination.getName());
        String province = trimToNull(destination.getProvince());
        if (StringUtils.hasText(name) && StringUtils.hasText(province) && !name.equalsIgnoreCase(province)) {
            return name + ", " + province;
        }
        if (StringUtils.hasText(name)) {
            return name;
        }
        throw new BadRequestException("Destination must have coordinates or name to sync WeatherAPI data");
    }

    private Destination findAdminDestination(UUID destinationUuid) {
        Destination destination = destinationRepository.findByUuid(destinationUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with uuid: " + destinationUuid));

        if (destination.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Destination not found with uuid: " + destinationUuid);
        }
        return destination;
    }

    private JsonNode node(JsonNode source, String... path) {
        JsonNode current = source;
        for (String key : path) {
            if (key == null || current == null || current.isNull()) {
                return null;
            }
            current = current.get(key);
        }
        return current;
    }

    private String text(JsonNode source, String... path) {
        JsonNode value = node(source, path);
        if (value == null || value.isNull()) {
            return null;
        }
        return trimToNull(value.asText());
    }

    private BigDecimal decimal(JsonNode source, String... path) {
        JsonNode value = node(source, path);
        if (value == null || value.isNull() || !value.isNumber()) {
            return null;
        }
        return BigDecimal.valueOf(value.asDouble());
    }

    private String firstText(JsonNode source, String firstField, String fallbackField, String defaultValue) {
        String value = text(source, firstField);
        if (StringUtils.hasText(value)) {
            return value;
        }
        value = text(source, fallbackField);
        return StringUtils.hasText(value) ? value : defaultValue;
    }

    private String firstText(JsonNode source, String firstField, String secondField, String thirdField, String defaultValue) {
        String value = text(source, firstField);
        if (StringUtils.hasText(value)) {
            return value;
        }
        value = text(source, secondField);
        if (StringUtils.hasText(value)) {
            return value;
        }
        value = text(source, thirdField);
        return StringUtils.hasText(value) ? value : defaultValue;
    }

    private LocalDate parseDate(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException ex) {
            return null;
        }
    }

    private LocalDateTime parseDateTime(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return LocalDateTime.parse(value, WEATHER_API_DATE_TIME);
        } catch (DateTimeParseException ignored) {
            try {
                return OffsetDateTime.parse(value).toLocalDateTime();
            } catch (DateTimeParseException ignoredAgain) {
                try {
                    return LocalDateTime.parse(value);
                } catch (DateTimeParseException ex) {
                    return null;
                }
            }
        }
    }

    private String writeJson(JsonNode node) {
        try {
            return jsonMapper.writeValueAsString(node);
        } catch (Exception ex) {
            throw new BadRequestException("WeatherAPI forecast payload could not be stored");
        }
    }

    private String normalizeRequired(String value, String fieldName) {
        String normalized = trimToNull(value);
        if (!StringUtils.hasText(normalized)) {
            throw new BadRequestException(fieldName + " is required");
        }
        return normalized;
    }

    private String trimToNull(String value) {
        String normalized = DataNormalizer.normalize(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String limit(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
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
}
