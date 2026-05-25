package com.wedservice.backend.config;

import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Health check nhẹ cho Render (&lt; 5s, không probe DB).
 * /api/v1/live — khuyến nghị trên Dashboard.
 * /api/v1/actuator/health — tương thích khi Render vẫn probe path mặc định.
 */
@Lazy(false)
@RestController
@Profile("prod")
public class RenderLivenessController {

    @GetMapping({"/live", "/actuator/health"})
    public Map<String, String> live() {
        return Map.of("status", "UP");
    }
}
