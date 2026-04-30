package com.wedservice.backend.module.weather.entity;

import com.wedservice.backend.module.weather.entity.converter.WeatherNoticeStatusConverter;
import com.wedservice.backend.module.weather.entity.converter.WeatherSeverityConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "weather_public_notices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherPublicNotice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "destination_id", nullable = false)
    private Long destinationId;

    @Column(name = "source_alert_id")
    private Long sourceAlertId;

    @Convert(converter = WeatherSeverityConverter.class)
    @Column(name = "severity", nullable = false, length = 20)
    private WeatherSeverity severity;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "summary", nullable = false, length = 500)
    private String summary;

    @Column(name = "detail", columnDefinition = "TEXT")
    private String detail;

    @Column(name = "action_advice", columnDefinition = "TEXT")
    private String actionAdvice;

    @Column(name = "display_from", nullable = false)
    private LocalDateTime displayFrom;

    @Column(name = "display_to", nullable = false)
    private LocalDateTime displayTo;

    @Convert(converter = WeatherNoticeStatusConverter.class)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private WeatherNoticeStatus status = WeatherNoticeStatus.DRAFT;

    @Column(name = "is_pinned", nullable = false)
    @Builder.Default
    private Boolean pinned = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        onUpdate();
    }

    @PreUpdate
    protected void onUpdate() {
        if (status == null) {
            status = WeatherNoticeStatus.DRAFT;
        }
        if (pinned == null) {
            pinned = false;
        }
        updatedAt = LocalDateTime.now();
    }
}
