-- Localized tour content (locale: ISO language tag, e.g. en, vi). Canonical copy remains on `tours`.

CREATE TABLE IF NOT EXISTS tour_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    name VARCHAR(255),
    short_description TEXT,
    description TEXT,
    highlights TEXT,
    inclusions TEXT,
    exclusions TEXT,
    notes TEXT,
    itinerary_summary TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tour_translations_tour_locale (tour_id, locale),
    CONSTRAINT fk_tour_translations_tour
        FOREIGN KEY (tour_id) REFERENCES tours (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
