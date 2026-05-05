package com.wedservice.backend.module.ai.service;

import com.wedservice.backend.module.ai.config.GeminiProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {
    public static final String ERROR_ANSWER = AiChatMessages.ERROR;

    private final GeminiProperties properties;
    private final ObjectMapper objectMapper;

    public String generateAnswer(String prompt) {
        if (!StringUtils.hasText(properties.getApiKey())) {
            log.warn("Gemini API key is not configured");
            return ERROR_ANSWER;
        }

        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(resolveTimeout())
                    .build();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(buildUrl()))
                    .timeout(resolveTimeout())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(buildBody(prompt)))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Gemini request failed with status {}", response.statusCode());
                return ERROR_ANSWER;
            }

            return parseText(response.body());
        } catch (Exception e) {
            log.warn("Gemini request failed: {}", e.getMessage());
            return ERROR_ANSWER;
        }
    }

    private String buildUrl() {
        String baseUrl = properties.getBaseUrl().replaceAll("/+$", "");
        String model = properties.getModel();
        String key = URLEncoder.encode(properties.getApiKey(), StandardCharsets.UTF_8);
        return baseUrl + "/" + model + ":generateContent?key=" + key;
    }

    private String buildBody(String prompt) throws Exception {
        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.2,
                        "topP", 0.8,
                        "maxOutputTokens", 900
                )
        );
        return objectMapper.writeValueAsString(body);
    }

    private String parseText(String body) throws Exception {
        JsonNode root = objectMapper.readTree(body);
        JsonNode textNode = root.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text");

        String text = textNode.asString();
        if (!StringUtils.hasText(text)) {
            return ERROR_ANSWER;
        }
        return text.trim();
    }

    private Duration resolveTimeout() {
        return properties.getTimeout() == null ? Duration.ofSeconds(15) : properties.getTimeout();
    }
}
