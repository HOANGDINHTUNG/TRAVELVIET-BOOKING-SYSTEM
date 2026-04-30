package com.wedservice.backend.module.weather.integration;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.module.weather.config.WeatherApiProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class WeatherApiClient {

    private final WeatherApiProperties properties;
    private final JsonMapper jsonMapper = JsonMapper.builder().findAndAddModules().build();

    public WeatherApiForecastResult fetchForecast(String query) {
        if (!StringUtils.hasText(properties.getApiKey())) {
            throw new BadRequestException("WEATHERAPI_KEY is not configured");
        }
        if (!StringUtils.hasText(query)) {
            throw new BadRequestException("WeatherAPI query is required");
        }

        String rawPayload = send(buildForecastUri(query));
        JsonNode payload = parsePayload(rawPayload);
        return WeatherApiForecastResult.builder()
                .query(query)
                .payload(payload)
                .rawPayload(rawPayload)
                .fetchedAt(LocalDateTime.now())
                .build();
    }

    private URI buildForecastUri(String query) {
        String baseUrl = properties.getBaseUrl();
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }

        String url = baseUrl + "/forecast.json"
                + "?key=" + encode(properties.getApiKey())
                + "&q=" + encode(query)
                + "&days=" + properties.getForecastDays()
                + "&aqi=" + encode(properties.getAqi())
                + "&alerts=" + encode(properties.getAlerts())
                + "&lang=" + encode(properties.getLang());
        return URI.create(url);
    }

    private String send(URI uri) {
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(properties.getTimeoutSeconds()))
                .build();
        HttpRequest request = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(properties.getTimeoutSeconds()))
                .GET()
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new BadRequestException("WeatherAPI request failed with status: " + response.statusCode());
            }
            return response.body();
        } catch (IOException ex) {
            throw new BadRequestException("WeatherAPI request failed: " + ex.getMessage());
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new BadRequestException("WeatherAPI request was interrupted");
        }
    }

    private JsonNode parsePayload(String rawPayload) {
        try {
            return jsonMapper.readTree(rawPayload);
        } catch (Exception ex) {
            throw new BadRequestException("WeatherAPI response is not valid JSON");
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }
}
