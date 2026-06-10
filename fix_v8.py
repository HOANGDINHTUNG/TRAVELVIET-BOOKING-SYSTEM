import re

file_path = r'backend\src\main\resources\db\migration\V8__seed_i18n_en.sql'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# We will remove all INSERT INTO tour_translations that use VALUES (...), (...)
# Specifically the blocks 4.1, 4.2, 4.3 which contain hardcoded IDs.
# Instead of complex regex, let's just write a clean V8 script that only contains CREATE TABLE and basic SELECT inserts.

clean_sql = '''-- =====================================================================
-- V8: Seed English i18n overlays for visible public fields
-- Removed hardcoded EN data as requested by user.
-- =====================================================================

CREATE TABLE IF NOT EXISTS customer_testimonial_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    testimonial_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    customer_name VARCHAR(120),
    customer_title VARCHAR(180),
    content TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_customer_testimonial_translations_testimonial_locale (testimonial_id, locale),
    CONSTRAINT fk_customer_testimonial_translations_testimonial
        FOREIGN KEY (testimonial_id) REFERENCES customer_testimonials (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotel_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hotel_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    name VARCHAR(200) NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_hotel_translations_hotel_locale (hotel_id, locale),
    CONSTRAINT fk_hotel_translations_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS airline_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    airline_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    name VARCHAR(160) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_airline_translations_airline_locale (airline_id, locale),
    CONSTRAINT fk_airline_translations_airline
        FOREIGN KEY (airline_id) REFERENCES airlines (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS airport_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    airport_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    name VARCHAR(180) NULL,
    city_name VARCHAR(120) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_airport_translations_airport_locale (airport_id, locale),
    CONSTRAINT fk_airport_translations_airport
        FOREIGN KEY (airport_id) REFERENCES airports (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS combo_package_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combo_package_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    name VARCHAR(200) NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_combo_package_translations_combo_locale (combo_package_id, locale),
    CONSTRAINT fk_combo_package_translations_combo
        FOREIGN KEY (combo_package_id) REFERENCES combo_packages (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Just fallbacks
INSERT INTO hotel_translations (hotel_id, locale, name, description)
SELECT h.id, 'vi', h.name, h.description FROM hotels h ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO airline_translations (airline_id, locale, name)
SELECT a.id, 'vi', a.name FROM airlines a ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO airport_translations (airport_id, locale, name, city_name)
SELECT ap.id, 'vi', ap.name, ap.city_name FROM airports ap ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO combo_package_translations (combo_package_id, locale, name, description)
SELECT c.id, 'vi', c.name, c.description FROM combo_packages c ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Tours fallback 'vi' and 'en'
INSERT IGNORE INTO tour_translations (tour_id, locale, name, short_description, description, highlights, inclusions, exclusions, notes)
SELECT t.id, 'vi', t.name, t.short_description, t.description, t.highlights, t.inclusions, t.exclusions, t.notes
FROM tours t WHERE t.deleted_at IS NULL;

INSERT IGNORE INTO tour_translations (tour_id, locale, name, short_description, description, highlights, inclusions, exclusions, notes)
SELECT t.id, 'en', t.name, t.short_description, t.description, t.highlights, t.inclusions, t.exclusions, t.notes
FROM tours t WHERE t.deleted_at IS NULL;

'''

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(clean_sql)
print("Updated V8_seed_i18n_en.sql")
