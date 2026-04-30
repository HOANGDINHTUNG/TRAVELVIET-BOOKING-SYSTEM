CREATE TABLE IF NOT EXISTS weather_display_policies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT NOT NULL,
    show_forecast_summary BOOLEAN NOT NULL DEFAULT TRUE,
    show_temperature BOOLEAN NOT NULL DEFAULT TRUE,
    show_rain_probability BOOLEAN NOT NULL DEFAULT TRUE,
    show_wind_speed BOOLEAN NOT NULL DEFAULT TRUE,
    show_humidity BOOLEAN NOT NULL DEFAULT FALSE,
    show_aqi BOOLEAN NOT NULL DEFAULT FALSE,
    show_hourly_forecast BOOLEAN NOT NULL DEFAULT FALSE,
    show_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    show_alert_detail BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_weather_display_policy_destination (destination_id),
    CONSTRAINT fk_weather_display_policies_destination
        FOREIGN KEY (destination_id)
        REFERENCES destinations (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS weather_public_notices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT NOT NULL,
    source_alert_id BIGINT NULL,
    severity ENUM('info', 'watch', 'warning', 'danger') NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    detail TEXT NULL,
    action_advice TEXT NULL,
    display_from DATETIME NOT NULL,
    display_to DATETIME NOT NULL,
    status ENUM('draft', 'published', 'expired') NOT NULL DEFAULT 'draft',
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_weather_public_notices_destination
        FOREIGN KEY (destination_id)
        REFERENCES destinations (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_weather_public_notices_source_alert
        FOREIGN KEY (source_alert_id)
        REFERENCES weather_alerts (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_weather_public_notices_destination_status
    ON weather_public_notices(destination_id, status, display_from, display_to);
