package com.wedservice.backend.module.weather.integration;

import com.wedservice.backend.common.exception.BadRequestException;
import com.wedservice.backend.common.exception.ExternalServiceException;
import com.wedservice.backend.module.weather.config.WeatherApiProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class WeatherApiClient {

    private static final String SOURCE_NAME = "WeatherAPI.com";

    private final WeatherApiProperties properties;
    private final RestClient restClient = RestClient.create();
    private final JsonMapper jsonMapper = JsonMapper.builder().findAndAddModules().build();

    public boolean isConfigured() {
        return StringUtils.hasText(properties.getApiKey());
    }

    public JsonNode fetchCurrent(String query, String aqi) {
        Map<String, Object> params = baseParams(query);
        params.put("aqi", aqi);
        return fetch("current.json", params);
    }

    public JsonNode fetchForecast(String query, int days, String aqi, String alerts) {
        Map<String, Object> params = baseParams(query);
        params.put("days", days);
        params.put("aqi", aqi);
        params.put("alerts", alerts);
        return fetch("forecast.json", params);
    }

    public JsonNode search(String query) {
        return fetch("search.json", baseParams(query));
    }

    public JsonNode lookupIp(String query) {
        return fetch("ip.json", baseParams(query));
    }

    public String getSourceName() {
        return SOURCE_NAME;
    }

    private Map<String, Object> baseParams(String query) {
        if (!StringUtils.hasText(query)) {
            throw new BadRequestException("q is required");
        }

        Map<String, Object> params = new LinkedHashMap<>();
        params.put("key", requireApiKey());
        params.put("q", query.trim());
        return params;
    }

    private String requireApiKey() {
        if (!isConfigured()) {
            throw new BadRequestException("WeatherAPI.com key is not configured. Set WEATHERAPI_KEY.");
        }
        return properties.getApiKey().trim();
    }

    private JsonNode fetch(String path, Map<String, Object> params) {
        String uri = buildUri(path, params);
        String body;

        try {
            body = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(String.class);
        } catch (RestClientResponseException ex) {
            handleResponseException(ex);
            throw ex;
        } catch (RestClientException ex) {
            throw new ExternalServiceException("WeatherAPI.com request failed", ex);
        }

        return parseResponse(body);
    }

    private String buildUri(String path, Map<String, Object> params) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(properties.getBaseUrl())
                .pathSegment(path);
        params.forEach(builder::queryParam);
        return builder.build().encode().toUriString();
    }

    private JsonNode parseResponse(String body) {
        try {
            JsonNode root = jsonMapper.readTree(body);
            String errorMessage = extractErrorMessage(root);
            if (StringUtils.hasText(errorMessage)) {
                throw new BadRequestException("WeatherAPI.com error: " + errorMessage);
            }
            return root;
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ExternalServiceException("WeatherAPI.com response is invalid", ex);
        }
    }

    private void handleResponseException(RestClientResponseException ex) {
        String weatherApiMessage = extractErrorMessage(ex.getResponseBodyAsString());
        String message = StringUtils.hasText(weatherApiMessage)
                ? "WeatherAPI.com error: " + weatherApiMessage
                : "WeatherAPI.com request failed with status " + ex.getStatusCode();

        if (ex.getStatusCode().is4xxClientError()) {
            throw new BadRequestException(message);
        }

        throw new ExternalServiceException(message, ex);
    }

    private String extractErrorMessage(String body) {
        if (!StringUtils.hasText(body)) {
            return null;
        }

        try {
            return extractErrorMessage(jsonMapper.readTree(body));
        } catch (Exception ex) {
            return null;
        }
    }

    private String extractErrorMessage(JsonNode root) {
        if (root == null) {
            return null;
        }

        String message = root.path("error").path("message").asText();
        return StringUtils.hasText(message) ? message : null;
    }
}
