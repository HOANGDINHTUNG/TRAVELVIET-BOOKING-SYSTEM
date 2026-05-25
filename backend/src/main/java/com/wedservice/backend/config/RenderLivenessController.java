package com.wedservice.backend.config;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Health check nhẹ cho Render (&lt; 5s, không probe DB).
 * Path đầy đủ: /api/v1/live — cấu hình healthCheckPath trên Render.
 */
@RestController
@Profile("prod")
public class RenderLivenessController {

    @GetMapping("/live")
    public Map<String, String> live() {
        return Map.of("status", "UP");
    }
}
