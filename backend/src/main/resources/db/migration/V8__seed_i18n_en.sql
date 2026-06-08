-- =====================================================================
-- V8: Seed English i18n overlays for visible public fields
-- Scope: destinations, tours, customer testimonials (Home section)
-- Source of truth: existing Vietnamese/base data in current DB
-- =====================================================================

-- 1) Translation store for Home testimonials (no table in V1)
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

-- 2) Ensure VI rows exist in translation tables for fallback consistency
INSERT INTO destination_translations (destination_id, locale, name, short_description, description)
SELECT
    d.id,
    'vi',
    d.name,
    d.short_description,
    d.description
FROM destinations d
WHERE d.deleted_at IS NULL
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(VALUES(name), ''), destination_translations.name),
    short_description = COALESCE(NULLIF(VALUES(short_description), ''), destination_translations.short_description),
    description = COALESCE(NULLIF(VALUES(description), ''), destination_translations.description);

-- 3.1) Reconcile destination EN by V7 seed scope:
-- Ensure EN rows are complete for destination ids used in V7 (1..142).
-- Rules:
-- - Create EN row if missing
-- - If EN row exists, only backfill blank fields (do not overwrite existing EN content)
INSERT INTO destination_translations (destination_id, locale, name, short_description, description)
SELECT
    d.id,
    'en',
    COALESCE(NULLIF(dvi.name, ''), d.name),
    COALESCE(NULLIF(dvi.short_description, ''), d.short_description),
    COALESCE(NULLIF(dvi.description, ''), d.description)
FROM destinations d
LEFT JOIN destination_translations dvi
    ON dvi.destination_id = d.id
   AND dvi.locale = 'vi'
WHERE d.deleted_at IS NULL
  AND d.id BETWEEN 1 AND 142
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(destination_translations.name, ''), VALUES(name)),
    short_description = COALESCE(NULLIF(destination_translations.short_description, ''), VALUES(short_description)),
    description = COALESCE(NULLIF(destination_translations.description, ''), VALUES(description));

-- EN cho TOAN BO tour trong DB:
-- - Lay tu ban dich VI neu co, fallback ve cot goc tours
-- - Chi chen ban ghi EN con thieu (khong ghi de EN da co)
INSERT IGNORE INTO tour_translations (
    tour_id, locale, name, short_description, description, highlights, inclusions, exclusions, notes, itinerary_summary
)
SELECT
    t.id,
    'vi',
    t.name,
    t.short_description,
    t.description,
    t.highlights,
    t.inclusions,
    t.exclusions,
    t.notes,
    NULL
FROM tours t
WHERE t.deleted_at IS NULL
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(VALUES(name), ''), tour_translations.name),
    short_description = COALESCE(NULLIF(VALUES(short_description), ''), tour_translations.short_description),
    description = COALESCE(NULLIF(VALUES(description), ''), tour_translations.description),
    highlights = COALESCE(NULLIF(VALUES(highlights), ''), tour_translations.highlights),
    inclusions = COALESCE(NULLIF(VALUES(inclusions), ''), tour_translations.inclusions),
    exclusions = COALESCE(NULLIF(VALUES(exclusions), ''), tour_translations.exclusions),
    notes = COALESCE(NULLIF(VALUES(notes), ''), tour_translations.notes);

INSERT INTO customer_testimonial_translations (testimonial_id, locale, customer_name, customer_title, content)
SELECT
    ct.id,
    'vi',
    ct.customer_name,
    ct.customer_title,
    ct.content
FROM customer_testimonials ct
WHERE ct.is_active = TRUE
ON DUPLICATE KEY UPDATE
    customer_name = COALESCE(NULLIF(VALUES(customer_name), ''), customer_testimonial_translations.customer_name),
    customer_title = COALESCE(NULLIF(VALUES(customer_title), ''), customer_testimonial_translations.customer_title),
    content = COALESCE(NULLIF(VALUES(content), ''), customer_testimonial_translations.content);

-- =====================================================================
-- Hotels / Flights / Combos i18n overlays
-- =====================================================================

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

INSERT INTO hotel_translations (hotel_id, locale, name, description)
SELECT h.id, 'vi', h.name, h.description
FROM hotels h
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(VALUES(name), ''), hotel_translations.name),
    description = COALESCE(NULLIF(VALUES(description), ''), hotel_translations.description);

INSERT INTO hotel_translations (hotel_id, locale, name, description)
SELECT h.id, 'en', h.name, h.description
FROM hotels h
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(hotel_translations.name, ''), VALUES(name)),
    description = COALESCE(NULLIF(hotel_translations.description, ''), VALUES(description));

INSERT INTO airline_translations (airline_id, locale, name)
SELECT a.id, 'vi', a.name
FROM airlines a
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(VALUES(name), ''), airline_translations.name);

INSERT INTO airline_translations (airline_id, locale, name)
SELECT a.id, 'en', a.name
FROM airlines a
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(airline_translations.name, ''), VALUES(name));

INSERT INTO airport_translations (airport_id, locale, name, city_name)
SELECT ap.id, 'vi', ap.name, ap.city_name
FROM airports ap
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(VALUES(name), ''), airport_translations.name),
    city_name = COALESCE(NULLIF(VALUES(city_name), ''), airport_translations.city_name);

INSERT INTO airport_translations (airport_id, locale, name, city_name)
SELECT ap.id, 'en', ap.name, ap.city_name
FROM airports ap
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(airport_translations.name, ''), VALUES(name)),
    city_name = COALESCE(NULLIF(airport_translations.city_name, ''), VALUES(city_name));

INSERT INTO combo_package_translations (combo_package_id, locale, name, description)
SELECT c.id, 'vi', c.name, c.description
FROM combo_packages c
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(VALUES(name), ''), combo_package_translations.name),
    description = COALESCE(NULLIF(VALUES(description), ''), combo_package_translations.description);

INSERT INTO combo_package_translations (combo_package_id, locale, name, description)
SELECT c.id, 'en', c.name, c.description
FROM combo_packages c
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(combo_package_translations.name, ''), VALUES(name)),
    description = COALESCE(NULLIF(combo_package_translations.description, ''), VALUES(description));

-- 8) Final tour EN reconciliation (strict):
-- Compare EN vs VI per field and backfill any EN field that is null/blank (including whitespace).
-- Preserve existing curated EN content.
INSERT INTO tour_translations (
    tour_id, locale, name, short_description, description, highlights, inclusions, exclusions, notes, itinerary_summary
)
SELECT
    t.id,
    'en',
    COALESCE(NULLIF(TRIM(tvi.name), ''), t.name),
    COALESCE(NULLIF(TRIM(tvi.short_description), ''), t.short_description),
    COALESCE(NULLIF(TRIM(tvi.description), ''), t.description),
    COALESCE(NULLIF(TRIM(tvi.highlights), ''), t.highlights),
    COALESCE(NULLIF(TRIM(tvi.inclusions), ''), t.inclusions),
    COALESCE(NULLIF(TRIM(tvi.exclusions), ''), t.exclusions),
    COALESCE(NULLIF(TRIM(tvi.notes), ''), t.notes),
    COALESCE(NULLIF(TRIM(tvi.itinerary_summary), ''), NULL)
FROM tours t
LEFT JOIN tour_translations tvi
    ON tvi.tour_id = t.id
   AND tvi.locale = 'vi'
WHERE t.deleted_at IS NULL
ON DUPLICATE KEY UPDATE
    name = CASE
        WHEN tour_translations.name IS NULL OR TRIM(tour_translations.name) = ''
            THEN VALUES(name)
        ELSE tour_translations.name
    END,
    short_description = CASE
        WHEN tour_translations.short_description IS NULL OR TRIM(tour_translations.short_description) = ''
            THEN VALUES(short_description)
        ELSE tour_translations.short_description
    END,
    description = CASE
        WHEN tour_translations.description IS NULL OR TRIM(tour_translations.description) = ''
            THEN VALUES(description)
        ELSE tour_translations.description
    END,
    highlights = CASE
        WHEN tour_translations.highlights IS NULL OR TRIM(tour_translations.highlights) = ''
            THEN VALUES(highlights)
        ELSE tour_translations.highlights
    END,
    inclusions = CASE
        WHEN tour_translations.inclusions IS NULL OR TRIM(tour_translations.inclusions) = ''
            THEN VALUES(inclusions)
        ELSE tour_translations.inclusions
    END,
    exclusions = CASE
        WHEN tour_translations.exclusions IS NULL OR TRIM(tour_translations.exclusions) = ''
            THEN VALUES(exclusions)
        ELSE tour_translations.exclusions
    END,
    notes = CASE
        WHEN tour_translations.notes IS NULL OR TRIM(tour_translations.notes) = ''
            THEN VALUES(notes)
        ELSE tour_translations.notes
    END,
    itinerary_summary = CASE
        WHEN tour_translations.itinerary_summary IS NULL OR TRIM(tour_translations.itinerary_summary) = ''
            THEN VALUES(itinerary_summary)
        ELSE tour_translations.itinerary_summary
    END;

-- 7) Reconcile by V7 tour seed scope (ids 1..100):
-- V7 seed_data.sql currently provisions the main public tour set in this id range.
-- This block ensures EN rows exist and backfills any blank EN fields for that exact scope.
INSERT INTO tour_translations (
    tour_id, locale, name, short_description, description, highlights, inclusions, exclusions, notes, itinerary_summary
)
SELECT
    t.id,
    'en',
    COALESCE(NULLIF(tvi.name, ''), t.name),
    COALESCE(NULLIF(tvi.short_description, ''), t.short_description),
    COALESCE(NULLIF(tvi.description, ''), t.description),
    COALESCE(NULLIF(tvi.highlights, ''), t.highlights),
    COALESCE(NULLIF(tvi.inclusions, ''), t.inclusions),
    COALESCE(NULLIF(tvi.exclusions, ''), t.exclusions),
    COALESCE(NULLIF(tvi.notes, ''), t.notes),
    COALESCE(NULLIF(tvi.itinerary_summary, ''), NULL)
FROM tours t
LEFT JOIN tour_translations tvi
    ON tvi.tour_id = t.id
   AND tvi.locale = 'vi'
WHERE t.deleted_at IS NULL
  AND t.id BETWEEN 1 AND 100
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(tour_translations.name, ''), VALUES(name)),
    short_description = COALESCE(NULLIF(tour_translations.short_description, ''), VALUES(short_description)),
    description = COALESCE(NULLIF(tour_translations.description, ''), VALUES(description)),
    highlights = COALESCE(NULLIF(tour_translations.highlights, ''), VALUES(highlights)),
    inclusions = COALESCE(NULLIF(tour_translations.inclusions, ''), VALUES(inclusions)),
    exclusions = COALESCE(NULLIF(tour_translations.exclusions, ''), VALUES(exclusions)),
    notes = COALESCE(NULLIF(tour_translations.notes, ''), VALUES(notes)),
    itinerary_summary = COALESCE(NULLIF(tour_translations.itinerary_summary, ''), VALUES(itinerary_summary));

-- 4) Curated EN overlays for records that are prominently visible on Home
-- 4.1) Home Flash Sale tours (tag HOME_FLASH_SALE)
INSERT INTO tour_translations (
    tour_id, locale, name, short_description, description, highlights, inclusions, exclusions, notes, itinerary_summary
) VALUES
(
    41, 'en',
    'Bangkok - Pattaya Discovery',
    'A vibrant city-and-beach Thailand itinerary.',
    'Explore Bangkok highlights and Pattaya seaside attractions in one convenient journey, ideal for families and first-time Thailand travelers.',
    'Bangkok landmarks, Coral Island, Alcazar Show',
    'Round-trip transfers, selected meals, tour guide',
    'Personal expenses',
    NULL,
    'Day 1: Arrival and city orientation; Day 2: Coral Island and Pattaya attractions; Day 3+: Shopping and leisure.'
),
(
    46, 'en',
    'Cambodia Heritage Escape',
    'A short and meaningful cultural trip to Cambodia.',
    'Discover the timeless heritage of Cambodia with iconic temples, historical sites, and local cuisine across a compact itinerary.',
    'Angkor area, Phnom Penh landmarks, local culture',
    'Transport, accommodation, selected sightseeing',
    'Personal expenses',
    NULL,
    'Visit heritage highlights with balanced pacing for both family and business groups.'
),
(
    50, 'en',
    'Myanmar Golden Land Experience',
    'A spiritual and cultural route through Myanmar.',
    'Experience Myanmar''s sacred pagodas, historical cities, and authentic local life with a thoughtfully planned travel program.',
    'Yangon, Bagan, Shwedagon Pagoda',
    'Flights/transport package, accommodation, guide service',
    'Personal expenses',
    NULL,
    'A classic Myanmar route combining spiritual landmarks and scenic cultural stops.'
),
(
    63, 'en',
    'Chengdu and Sichuan Wonders',
    'A signature western China journey with iconic sights.',
    'From Chengdu city experiences to famous Sichuan landmarks, this trip blends culture, nature, and comfortable pacing.',
    'Chengdu highlights, scenic mountains, cultural sites',
    'Transport, tickets, guide service',
    'Personal expenses',
    NULL,
    'An all-round Sichuan itinerary suitable for travelers seeking both scenery and culture.'
),
(
    78, 'en',
    'Germany Festival and Heritage Tour',
    'A lively Europe itinerary with seasonal festival atmosphere.',
    'Enjoy Germany''s iconic festival spirit alongside classic European architecture, old towns, and cultural landmarks.',
    'Munich experience, castle visits, city exploration',
    'Long-haul transport package, accommodation, guide support',
    'Personal expenses',
    NULL,
    'Festival-themed schedule combined with heritage sightseeing in Germany.'
),
(
    89, 'en',
    'Egypt Ancient Civilization Journey',
    'An immersive trip through Egypt''s world-famous heritage.',
    'Travel through Cairo and the Nile corridor to experience monumental history, desert landscapes, and timeless culture.',
    'Pyramids, Nile experience, historical temples',
    'Transport package, selected meals, guide service',
    'Personal expenses',
    NULL,
    'A heritage-focused Egypt route with premium cultural highlights.'
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    short_description = VALUES(short_description),
    description = VALUES(description),
    highlights = VALUES(highlights),
    inclusions = VALUES(inclusions),
    exclusions = VALUES(exclusions),
    notes = VALUES(notes),
    itinerary_summary = VALUES(itinerary_summary);

-- 5) Home-row safety net:
-- Ensure every tour currently tagged for Home rows always has an EN overlay row.
-- Important: do not overwrite existing EN rows (curated/manual content is preserved).
INSERT IGNORE INTO tour_translations (
    tour_id, locale, name, short_description, description, highlights, inclusions, exclusions, notes, itinerary_summary
)
SELECT
    t.id,
    'en',
    COALESCE(NULLIF(tvi.name, ''), t.name),
    COALESCE(NULLIF(tvi.short_description, ''), t.short_description),
    COALESCE(NULLIF(tvi.description, ''), t.description),
    COALESCE(NULLIF(tvi.highlights, ''), t.highlights),
    COALESCE(NULLIF(tvi.inclusions, ''), t.inclusions),
    COALESCE(NULLIF(tvi.exclusions, ''), t.exclusions),
    COALESCE(NULLIF(tvi.notes, ''), t.notes),
    COALESCE(NULLIF(tvi.itinerary_summary, ''), NULL)
FROM tours t
JOIN tour_tags tt
    ON tt.tour_id = t.id
   AND tt.deleted_at IS NULL
JOIN tags tg
    ON tg.id = tt.tag_id
   AND tg.code IN ('HOME_BEACH_VN', 'HOME_HOT_INTL', 'HOME_FLASH_SALE')
LEFT JOIN tour_translations tvi
    ON tvi.tour_id = t.id
   AND tvi.locale = 'vi'
WHERE t.deleted_at IS NULL
;

-- 6) Full-tour EN coverage:
-- Apply EN overlay for all tours in DB (e.g. 100 tours), but only for tours that do not already have EN.
-- This guarantees complete EN readiness while keeping previously translated tours untouched.
INSERT IGNORE INTO tour_translations (
    tour_id, locale, name, short_description, description, highlights, inclusions, exclusions, notes, itinerary_summary
)
SELECT
    t.id,
    'en',
    COALESCE(NULLIF(tvi.name, ''), t.name),
    COALESCE(NULLIF(tvi.short_description, ''), t.short_description),
    COALESCE(NULLIF(tvi.description, ''), t.description),
    COALESCE(NULLIF(tvi.highlights, ''), t.highlights),
    COALESCE(NULLIF(tvi.inclusions, ''), t.inclusions),
    COALESCE(NULLIF(tvi.exclusions, ''), t.exclusions),
    COALESCE(NULLIF(tvi.notes, ''), t.notes),
    COALESCE(NULLIF(tvi.itinerary_summary, ''), NULL)
FROM tours t
LEFT JOIN tour_translations tvi
    ON tvi.tour_id = t.id
   AND tvi.locale = 'vi'
WHERE t.deleted_at IS NULL;

-- 4.2) Home testimonials (top sort_order set shown on Home carousel)
INSERT INTO customer_testimonial_translations (testimonial_id, locale, customer_name, customer_title, content)
SELECT
    ct.id,
    'en',
    ct.customer_name,
    CASE ct.sort_order
        WHEN 1 THEN 'Nguyen Dinh Chieu - Ho Chi Minh City'
        WHEN 2 THEN 'Dong Da - Hanoi'
        WHEN 3 THEN 'Thuy Nguyen - Hai Phong'
        WHEN 4 THEN 'An Khanh - Ho Chi Minh City'
        WHEN 5 THEN 'CEO - TechVina, District 1'
        WHEN 6 THEN 'Nha Trang, Khanh Hoa'
        WHEN 7 THEN 'Lecturer - University of Technology'
        WHEN 8 THEN 'Food Blogger - Da Nang'
        ELSE ct.customer_title
    END,
    CASE ct.sort_order
        WHEN 1 THEN 'ON Vietnam Co., Ltd. is highly impressed by THD Travel''s professional planning for our corporate leisure itinerary.'
        WHEN 2 THEN '[Happy Money - Nano Link JSC] Thanks to THD Travel''s dedicated support, our combined seminar and travel program ran smoothly end-to-end.'
        WHEN 3 THEN '[LITEON Co., Ltd.] This trip was truly meaningful for our entire team.'
        WHEN 4 THEN 'The HCMC branch of Electrolux Vietnam highly values THD Travel''s professional service quality.'
        WHEN 5 THEN 'Our Phan Thiet team-building program was energetic and creative. It helped our staff bond much better.'
        WHEN 6 THEN 'Our family had a wonderful 4-day getaway in Phu Quoc. The guide team was attentive, especially to elderly members.'
        WHEN 7 THEN 'The Cu Chi educational field trip was organized very well. Students were highly engaged with practical historical insights.'
        WHEN 8 THEN 'The Hue food tour itinerary was excellent. I got to try authentic local spots that are hard to discover on my own.'
        ELSE ct.content
    END
FROM customer_testimonials ct
WHERE ct.is_active = TRUE
  AND ct.sort_order BETWEEN 1 AND 8
ON DUPLICATE KEY UPDATE
    customer_name = VALUES(customer_name),
    customer_title = VALUES(customer_title),
    content = VALUES(content);

-- 4.3) Curated EN overlays for Home rows: HOME_BEACH_VN + HOME_HOT_INTL
INSERT INTO tour_translations (
    tour_id, locale, name, short_description, description, highlights, inclusions, exclusions, notes, itinerary_summary
) VALUES
(
    1, 'en',
    'Da Nang 3D2N - Beach and Ba Na Hills',
    'A balanced family-friendly coastal getaway.',
    'Explore Da Nang city highlights, enjoy the coastline, and experience the iconic Ba Na Hills in a compact and comfortable itinerary.',
    'Dragon Bridge, Ba Na Hills, My Khe Beach',
    'Transport, sightseeing tickets, guide service',
    'Personal expenses',
    NULL,
    NULL
),
(
    3, 'en',
    'Ha Long Heritage - Overnight Cruise',
    'Premium overnight cruise across world-famous bays.',
    'Sail through Ha Long Bay, enjoy cave visits and panoramic viewpoints, and relax with premium cruise amenities.',
    'Ha Long Bay, Sung Sot Cave, Ti Top Island',
    'Cruise package, selected meals, sightseeing tickets',
    'Personal expenses and beverage upgrades',
    NULL,
    NULL
),
(
    11, 'en',
    'Nha Trang - Island Paradise Escape',
    'A classic sea-and-island day experience.',
    'Discover Nha Trang''s clear waters, coral activities, and island leisure with a convenient all-in-one schedule.',
    'Hon Mun, island hopping, beach leisure',
    'Speedboat transfer, selected meals, guide support',
    'Optional paid activities',
    NULL,
    NULL
),
(
    14, 'en',
    'Quy Nhon - Ky Co and Eo Gio',
    'A scenic coastal route with crystal-clear waters.',
    'Visit Ky Co and Eo Gio for striking sea views, fresh local seafood, and relaxing beach time.',
    'Ky Co Beach, Eo Gio coast, local seafood',
    'Transport, boat transfer, selected meals',
    'Optional personal services',
    NULL,
    NULL
),
(
    17, 'en',
    'Phu Quoc - Safari and Grand World',
    'An island itinerary blending nature and entertainment.',
    'Combine wildlife experiences with modern entertainment districts and beach relaxation on Vietnam''s island destination.',
    'Safari, Grand World, island beaches',
    'Flights/transport package, accommodation, breakfast',
    'Optional theme-park charges',
    NULL,
    NULL
),
(
    24, 'en',
    'Nha Trang - Premium 3-Island Tour',
    'A high-comfort island-hopping experience.',
    'Travel by high-speed boat to key Nha Trang islands for beach activities, swimming, and marine sightseeing.',
    'Hon Tam, coral bay, speedboat route',
    'Boat transfer, selected meals, guide support',
    'Optional paid activities',
    NULL,
    NULL
),
(
    35, 'en',
    'Phu Yen - Untouched Hon Nua Island',
    'A light adventure for beach and island lovers.',
    'Reach Hon Nua Island for clear water, snorkeling opportunities, and a relaxed coastal atmosphere.',
    'Hon Nua Island, snorkeling spots, beach BBQ',
    'Boat transfer, selected meals, guide support',
    'Optional personal expenses',
    NULL,
    NULL
),
(
    42, 'en',
    'Singapore - Lion City Discovery',
    'A modern city break with iconic attractions.',
    'Explore Singapore''s landmark skyline, garden architecture, and entertainment areas in a compact urban itinerary.',
    'Marina Bay, Gardens by the Bay, Sentosa',
    'Flights/transport package, selected sightseeing',
    'Personal expenses',
    NULL,
    NULL
),
(
    44, 'en',
    'Bali - Tropical Leisure Journey',
    'A stylish resort-and-culture island vacation.',
    'Experience Bali''s temple landscapes, cultural highlights, and beachside relaxation in one complete trip.',
    'Lempuyang Gate, island beaches, Bali Swing',
    'Flights, accommodation, selected meals',
    'Personal expenses',
    NULL,
    NULL
),
(
    49, 'en',
    'Singapore - Malaysia Twin-City Route',
    'Two countries in one efficient itinerary.',
    'Combine Singapore''s modern attractions with Malaysia''s cultural variety and shopping-friendly city experiences.',
    'Singapore skyline, Genting area, city exploration',
    'Flights/transport package, selected meals',
    'Personal expenses',
    NULL,
    NULL
),
(
    53, 'en',
    'Japan - Golden Route',
    'A signature Tokyo-Fuji-Kyoto experience.',
    'Travel through Japan''s most popular corridor, balancing urban highlights, scenic landscapes, and cultural heritage.',
    'Tokyo highlights, Mount Fuji area, Kyoto heritage',
    'Flights, accommodation, selected meals, guide support',
    'Personal expenses',
    NULL,
    NULL
),
(
    54, 'en',
    'South Korea - Seoul, Nami and Everland',
    'A family-friendly mix of city and leisure.',
    'Enjoy Korean city life, seasonal scenery at Nami, and all-ages attractions in Everland.',
    'Seoul city tour, Nami Island, Everland',
    'Transport package, selected meals, sightseeing tickets',
    'Personal expenses',
    NULL,
    NULL
),
(
    58, 'en',
    'Phoenix Ancient Town - Zhangjiajie',
    'A scenic route through dramatic landscapes.',
    'Discover Zhangjiajie''s iconic mountain views and the historic charm of Phoenix Ancient Town.',
    'Glass bridge, mountain scenery, old-town walk',
    'Transport package, selected meals, guide support',
    'Personal expenses',
    NULL,
    NULL
),
(
    61, 'en',
    'Japan - Cherry Blossom Season Journey',
    'A spring-themed cultural itinerary.',
    'Experience Japan during cherry blossom season with urban highlights, parks, and cultural landmarks.',
    'Sakura viewing, Tokyo-Osaka corridor, cultural sites',
    'Flights, accommodation, selected meals',
    'Personal expenses',
    NULL,
    NULL
),
(
    68, 'en',
    'France - Switzerland - Italy',
    'A classic three-country West Europe route.',
    'Cover Europe''s iconic landmarks across France, Switzerland, and Italy in one curated long-haul itinerary.',
    'Eiffel Tower, Alps scenery, Venice canals',
    'Flights, accommodation, selected transfers',
    'Personal expenses',
    NULL,
    NULL
),
(
    71, 'en',
    'Netherlands - Belgium Tulip Season',
    'Seasonal Europe route with city heritage.',
    'Visit tulip fields and major city landmarks while exploring local culture and architecture.',
    'Keukenhof season, city squares, canal scenery',
    'Flights/transport package, selected services',
    'Personal expenses',
    NULL,
    NULL
),
(
    76, 'en',
    'Greece - Athens and Santorini',
    'A Mediterranean heritage-and-leisure escape.',
    'Combine historical highlights in Athens with island relaxation and sunset views in Santorini.',
    'Parthenon, Santorini viewpoints, island leisure',
    'Flights, accommodation, selected transfers',
    'Personal expenses',
    NULL,
    NULL
),
(
    83, 'en',
    'Australia - Sydney and Melbourne',
    'An urban-and-scenic Australia introduction.',
    'Discover iconic city landmarks and representative coastal scenery through two flagship Australian cities.',
    'Opera House, city highlights, coastal route',
    'Flights, accommodation, selected meals',
    'Personal expenses',
    NULL,
    NULL
),
(
    88, 'en',
    'Turkey - Civilizations Crossroads',
    'A heritage-rich transcontinental journey.',
    'Explore Turkey''s landmark heritage, city stories, and geological wonders in a balanced route.',
    'Istanbul heritage, Cappadocia region, historical sites',
    'Flights/transport package, accommodation, guide support',
    'Personal expenses',
    NULL,
    NULL
),
(
    90, 'en',
    'Dubai - Abu Dhabi Luxury Escape',
    'A premium Middle East city experience.',
    'Discover modern skyline attractions, desert activities, and grand architecture across Dubai and Abu Dhabi.',
    'Burj Khalifa, desert safari, Sheikh Zayed Mosque',
    'Flights, accommodation, selected city tours',
    'Personal expenses',
    NULL,
    NULL
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    short_description = VALUES(short_description),
    description = VALUES(description),
    highlights = VALUES(highlights),
    inclusions = VALUES(inclusions),
    exclusions = VALUES(exclusions),
    notes = VALUES(notes),
    itinerary_summary = VALUES(itinerary_summary);

-- 3) Seed EN rows from VI translations first, then fallback to canonical columns.
-- Note: EN content is seeded from existing VI text so BE can switch language immediately.
INSERT INTO destination_translations (destination_id, locale, name, short_description, description)
SELECT
    d.id,
    'en',
    COALESCE(NULLIF(dvi.name, ''), d.name),
    COALESCE(NULLIF(dvi.short_description, ''), d.short_description),
    COALESCE(NULLIF(dvi.description, ''), d.description)
FROM destinations d
LEFT JOIN destination_translations dvi
    ON dvi.destination_id = d.id
   AND dvi.locale = 'vi'
WHERE d.deleted_at IS NULL
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(VALUES(name), ''), destination_translations.name),
    short_description = COALESCE(NULLIF(VALUES(short_description), ''), destination_translations.short_description),
    description = COALESCE(NULLIF(VALUES(description), ''), destination_translations.description);

-- EN cho toan bo tours:
-- - Tao moi row EN neu chua co
-- - Neu da co row EN thi CHI bo sung cac field dang rong (khong ghi de noi dung da co)
INSERT INTO tour_translations (
    tour_id, locale, name, short_description, description, highlights, inclusions, exclusions, notes, itinerary_summary
)
SELECT
    t.id,
    'en',
    COALESCE(NULLIF(tvi.name, ''), t.name),
    COALESCE(NULLIF(tvi.short_description, ''), t.short_description),
    COALESCE(NULLIF(tvi.description, ''), t.description),
    COALESCE(NULLIF(tvi.highlights, ''), t.highlights),
    COALESCE(NULLIF(tvi.inclusions, ''), t.inclusions),
    COALESCE(NULLIF(tvi.exclusions, ''), t.exclusions),
    COALESCE(NULLIF(tvi.notes, ''), t.notes),
    COALESCE(NULLIF(tvi.itinerary_summary, ''), NULL)
FROM tours t
LEFT JOIN tour_translations tvi
    ON tvi.tour_id = t.id
   AND tvi.locale = 'vi'
WHERE t.deleted_at IS NULL
ON DUPLICATE KEY UPDATE
    name = COALESCE(NULLIF(tour_translations.name, ''), VALUES(name)),
    short_description = COALESCE(NULLIF(tour_translations.short_description, ''), VALUES(short_description)),
    description = COALESCE(NULLIF(tour_translations.description, ''), VALUES(description)),
    highlights = COALESCE(NULLIF(tour_translations.highlights, ''), VALUES(highlights)),
    inclusions = COALESCE(NULLIF(tour_translations.inclusions, ''), VALUES(inclusions)),
    exclusions = COALESCE(NULLIF(tour_translations.exclusions, ''), VALUES(exclusions)),
    notes = COALESCE(NULLIF(tour_translations.notes, ''), VALUES(notes)),
    itinerary_summary = COALESCE(NULLIF(tour_translations.itinerary_summary, ''), VALUES(itinerary_summary));

INSERT INTO customer_testimonial_translations (testimonial_id, locale, customer_name, customer_title, content)
SELECT
    ct.id,
    'en',
    COALESCE(NULLIF(ctvi.customer_name, ''), ct.customer_name),
    COALESCE(NULLIF(ctvi.customer_title, ''), ct.customer_title),
    COALESCE(NULLIF(ctvi.content, ''), ct.content)
FROM customer_testimonials ct
LEFT JOIN customer_testimonial_translations ctvi
    ON ctvi.testimonial_id = ct.id
   AND ctvi.locale = 'vi'
WHERE ct.is_active = TRUE
ON DUPLICATE KEY UPDATE
    customer_name = COALESCE(NULLIF(VALUES(customer_name), ''), customer_testimonial_translations.customer_name),
    customer_title = COALESCE(NULLIF(VALUES(customer_title), ''), customer_testimonial_translations.customer_title),
    content = COALESCE(NULLIF(VALUES(content), ''), customer_testimonial_translations.content);
