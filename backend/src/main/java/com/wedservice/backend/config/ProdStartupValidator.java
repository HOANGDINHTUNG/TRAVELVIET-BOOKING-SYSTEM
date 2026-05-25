package com.wedservice.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.util.StringUtils;

import jakarta.annotation.PostConstruct;

/**
 * Fail-fast trên Render khi thiếu secret bắt buộc (trước khi Tomcat nhận traffic).
 */
@Configuration
@Profile("prod")
public class ProdStartupValidator {

    @Value("${app.security.jwt.secret:}")
    private String jwtSecret;

    @PostConstruct
    void validate() {
        if (!StringUtils.hasText(jwtSecret) || jwtSecret.length() < 32) {
            throw new IllegalStateException(
                    """
                    Prod (Render): JWT_SECRET thiếu hoặc ngắn hơn 32 ký tự.
                    Render Dashboard → Environment → JWT_SECRET → chuỗi random ≥ 32 ký tự (render.yaml có thể generateValue).
                    """
                            .trim()
            );
        }
    }
}
