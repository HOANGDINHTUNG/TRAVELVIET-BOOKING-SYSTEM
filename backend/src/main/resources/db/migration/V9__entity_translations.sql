-- Localized strings for destinations and guides (locale: ISO language tag, e.g. en, vi)

CREATE TABLE IF NOT EXISTS destination_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    name VARCHAR(200),
    short_description TEXT,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_destination_translations_dest_locale (destination_id, locale),
    CONSTRAINT fk_destination_translations_destination
        FOREIGN KEY (destination_id) REFERENCES destinations (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS guide_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    guide_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    full_name VARCHAR(150),
    bio TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_guide_translations_guide_locale (guide_id, locale),
    CONSTRAINT fk_guide_translations_guide
        FOREIGN KEY (guide_id) REFERENCES guides (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
