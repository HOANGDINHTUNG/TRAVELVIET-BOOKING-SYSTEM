package com.wedservice.backend.module.ai.service;

import com.sun.net.httpserver.HttpServer;
import com.wedservice.backend.module.ai.config.GeminiProperties;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class GeminiServiceTest {
    private final ObjectMapper objectMapper = JsonMapper.builder().findAndAddModules().build();

    @Test
    void returnsFriendlyErrorWhenApiKeyIsMissing() {
        GeminiProperties properties = new GeminiProperties();
        properties.setApiKey("");

        GeminiService service = new GeminiService(properties, objectMapper);

        assertThat(service.generateAnswer("prompt")).isEqualTo(GeminiService.ERROR_ANSWER);
    }

    @Test
    void parsesGeminiTextResponseSafely() throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/v1beta/models/gemini-test:generateContent", exchange -> {
            byte[] response = """
                    {
                      "candidates": [
                        {
                          "content": {
                            "parts": [
                              { "text": "Có tour phù hợp theo dữ liệu hệ thống." }
                            ]
                          }
                        }
                      ]
                    }
                    """.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            try (OutputStream body = exchange.getResponseBody()) {
                body.write(response);
            }
        });
        server.start();

        try {
            GeminiProperties properties = new GeminiProperties();
            properties.setApiKey("test-key");
            properties.setModel("gemini-test");
            properties.setBaseUrl("http://localhost:" + server.getAddress().getPort() + "/v1beta/models");
            properties.setTimeout(Duration.ofSeconds(3));

            GeminiService service = new GeminiService(properties, objectMapper);

            assertThat(service.generateAnswer("prompt")).isEqualTo("Có tour phù hợp theo dữ liệu hệ thống.");
        } finally {
            server.stop(0);
        }
    }
}
