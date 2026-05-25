package com.wedservice.backend.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
@ConditionalOnProperty(prefix = "minio", name = "enabled", havingValue = "true")
public class MinioConfig {

    @Value("${minio.url}")
    private String url;

    @Value("${minio.accessKey}")
    private String accessKey;

    @Value("${minio.secretKey}")
    private String secretKey;

    @Bean
    public MinioClient minioClient() {
        if (!StringUtils.hasText(url)) {
            throw new IllegalStateException(
                    "minio.enabled=true nhưng minio.url trống. Đặt MINIO_URL trên Render hoặc MINIO_ENABLED=false."
            );
        }
        return MinioClient.builder()
                .endpoint(url)
                .credentials(accessKey, secretKey)
                .build();
    }
}
