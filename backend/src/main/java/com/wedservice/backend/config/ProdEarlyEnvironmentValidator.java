package com.wedservice.backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

import java.util.Arrays;

/**
 * Fail-fast sớm trên Render (profile prod) khi thiếu host/URI DB — trước khi scan Redis/JPA 60s.
 */
public class ProdEarlyEnvironmentValidator implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        if (!isProd(environment)) {
            return;
        }
        String uri = firstNonBlank(
                environment,
                "MYSQL_SERVICE_URI",
                "DATABASE_URL",
                "SPRING_DATASOURCE_URL",
                "AIVEN_MYSQL_URI"
        );
        String host = firstNonBlank(environment, "AIVEN_DB_HOST", "MYSQL_HOST", "DB_HOST");
        String password = firstNonBlank(environment, "AIVEN_DB_PASSWORD", "MYSQL_PASSWORD", "DB_PASSWORD");

        if (StringUtils.hasText(uri) || StringUtils.hasText(host)) {
            return;
        }

        String passwordHint = StringUtils.hasText(password)
                ? "AIVEN_DB_PASSWORD=đã có trên Render nhưng THIẾU địa chỉ server."
                : "Thiếu cả MYSQL_SERVICE_URI / AIVEN_DB_HOST và AIVEN_DB_PASSWORD.";

        throw new IllegalStateException(
                """
                [Render prod] Chưa cấu hình database Aiven trên Environment của Render.
                %s

                DB chạy trên máy local (file backend/.env) KHÔNG tự động lên Render — phải thêm thủ công:
                Cách 1: MYSQL_SERVICE_URI = Service URI (Public) từ Aiven Console
                Cách 2: AIVEN_DB_HOST + AIVEN_DB_PORT + AIVEN_DB_PASSWORD

                Mẫu: backend/render.env.example
                """
                        .formatted(passwordHint)
                        .trim()
        );
    }

    private static boolean isProd(Environment environment) {
        return Arrays.asList(environment.getActiveProfiles()).contains("prod");
    }

    private static String firstNonBlank(Environment environment, String... keys) {
        for (String key : keys) {
            String value = environment.getProperty(key);
            if (StringUtils.hasText(value)) {
                return value.trim();
            }
        }
        return "";
    }
}
