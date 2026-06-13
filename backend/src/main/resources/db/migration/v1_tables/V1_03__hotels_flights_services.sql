SET FOREIGN_KEY_CHECKS = 0;
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(40) NOT NULL UNIQUE,
    supplier_type ENUM('hotel','transport','restaurant','insurance','local_partner','guide_partner','ticket_partner','other') NOT NULL DEFAULT 'other',
    name VARCHAR(200) NOT NULL,
    legal_name VARCHAR(255),
    tax_code VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(150),
    website VARCHAR(255),
    province VARCHAR(120),
    district VARCHAR(120),
    address TEXT,
    status ENUM('active','inactive','blacklisted') NOT NULL DEFAULT 'active',
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS supplier_contacts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    job_title VARCHAR(120),
    phone VARCHAR(20),
    email VARCHAR(150),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_supplier_contacts_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS supplier_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NOT NULL,
    service_type ENUM('hotel','vehicle','meal','ticket','guide','insurance','other') NOT NULL DEFAULT 'other',
    service_name VARCHAR(200) NOT NULL,
    description TEXT,
    unit_price DECIMAL(14,2) NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_supplier_services_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotels (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NULL,
    destination_id BIGINT NULL,
    code VARCHAR(40) UNIQUE,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NULL UNIQUE,
    description TEXT NULL,
    star_rating DECIMAL(2,1) NULL,
    review_score DECIMAL(3,2) NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    province VARCHAR(120),
    district VARCHAR(120),
    address TEXT,
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL,
    checkin_time TIME NULL,
    checkout_time TIME NULL,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hotels_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_hotels_destination FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NULL,
    code VARCHAR(40) UNIQUE,
    vehicle_type ENUM('car','van','bus','boat','train','plane','other') NOT NULL DEFAULT 'other',
    plate_no VARCHAR(50),
    seat_capacity INT NULL,
    brand_name VARCHAR(100),
    model_name VARCHAR(100),
    status ENUM('active','inactive','maintenance') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicles_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS schedule_resource_allocations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    resource_type ENUM('hotel','vehicle','supplier_service','guide','other') NOT NULL,
    resource_ref_id BIGINT NULL,
    resource_name VARCHAR(200) NOT NULL,
    supplier_id BIGINT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_cost DECIMAL(14,2) NULL,
    total_cost DECIMAL(14,2) NULL,
    allocation_status ENUM('reserved','confirmed','cancelled','completed') NOT NULL DEFAULT 'reserved',
    note TEXT,
    allocated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_resource_allocations_schedule FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_schedule_resource_allocations_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotel_room_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hotel_id BIGINT NOT NULL,
    code VARCHAR(40) NOT NULL,
    name VARCHAR(180) NOT NULL,
    bed_type VARCHAR(80) NULL,
    max_adults INT NOT NULL DEFAULT 2,
    max_children INT NOT NULL DEFAULT 0,
    max_occupancy INT NOT NULL DEFAULT 2,
    base_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    inventory_total INT NOT NULL DEFAULT 0,
    is_refundable BOOLEAN NOT NULL DEFAULT TRUE,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    UNIQUE KEY uk_hotel_room_types_hotel_code (hotel_id, code),
    CONSTRAINT fk_hotel_room_types_hotel FOREIGN KEY (hotel_id)
        REFERENCES hotels (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotel_room_inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_type_id BIGINT NOT NULL,
    stay_date DATE NOT NULL,
    allotment INT NOT NULL DEFAULT 0,
    booked_qty INT NOT NULL DEFAULT 0,
    available_qty INT NOT NULL DEFAULT 0,
    price_override DECIMAL(14,2) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_hotel_room_inventory_room_date (room_type_id, stay_date),
    CONSTRAINT chk_hotel_room_inventory_allotment CHECK (allotment >= 0),
    CONSTRAINT chk_hotel_room_inventory_booked CHECK (booked_qty >= 0),
    CONSTRAINT chk_hotel_room_inventory_available CHECK (available_qty >= 0),
    CONSTRAINT fk_hotel_room_inventory_room_type FOREIGN KEY (room_type_id)
        REFERENCES hotel_room_types (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotel_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hotel_id BIGINT NOT NULL,
    media_url TEXT NOT NULL,
    alt_text VARCHAR(255) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_hotel_images_hotel FOREIGN KEY (hotel_id)
        REFERENCES hotels (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotel_amenities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    icon VARCHAR(120) NULL,
    category VARCHAR(80) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotel_amenity_mappings (
    hotel_id BIGINT NOT NULL,
    amenity_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (hotel_id, amenity_id),
    CONSTRAINT fk_hotel_amenity_mappings_hotel FOREIGN KEY (hotel_id)
        REFERENCES hotels (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_hotel_amenity_mappings_amenity FOREIGN KEY (amenity_id)
        REFERENCES hotel_amenities (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS airlines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code_iata CHAR(2) NOT NULL UNIQUE,
    code_icao VARCHAR(3) NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    logo_url TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS airports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code_iata CHAR(3) NOT NULL UNIQUE,
    code_icao VARCHAR(4) NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    city_name VARCHAR(120) NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'VN',
    destination_id BIGINT NOT NULL,
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL,
    timezone VARCHAR(60) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_airports_destination FOREIGN KEY (destination_id)
        REFERENCES destinations (id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS flights (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    airline_id BIGINT NOT NULL,
    flight_no VARCHAR(10) NOT NULL,
    origin_airport_id BIGINT NOT NULL,
    destination_airport_id BIGINT NOT NULL,
    departure_time_local DATETIME NOT NULL,
    arrival_time_local DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    status ENUM('scheduled','active','inactive','cancelled') NOT NULL DEFAULT 'scheduled',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_flights_airline FOREIGN KEY (airline_id)
        REFERENCES airlines (id),
    CONSTRAINT fk_flights_origin_airport FOREIGN KEY (origin_airport_id)
        REFERENCES airports (id),
    CONSTRAINT fk_flights_destination_airport FOREIGN KEY (destination_airport_id)
        REFERENCES airports (id),
    CONSTRAINT chk_flights_duration CHECK (duration_minutes >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS flight_classes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flight_id BIGINT NOT NULL,
    cabin_class ENUM('economy','premium_economy','business','first') NOT NULL,
    fare_family VARCHAR(80) NOT NULL DEFAULT 'standard',
    base_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    seat_total INT NOT NULL DEFAULT 0,
    seat_available INT NOT NULL DEFAULT 0,
    baggage_rule_json JSON NULL,
    change_refund_rule_json JSON NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_flight_classes_unique (flight_id, cabin_class, fare_family),
    CONSTRAINT chk_flight_classes_seat_total CHECK (seat_total >= 0),
    CONSTRAINT chk_flight_classes_seat_available CHECK (seat_available >= 0),
    CONSTRAINT fk_flight_classes_flight FOREIGN KEY (flight_id)
        REFERENCES flights (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;



ALTER TABLE `hotels` ADD COLUMN `deleted_at` timestamp NULL DEFAULT NULL;
ALTER TABLE `hotel_room_types`
ADD COLUMN `extra_bed_fee` DECIMAL(14,2) NOT NULL DEFAULT 0 AFTER `base_price`,
ADD COLUMN `child_surcharge_rules` JSON NULL AFTER `extra_bed_fee`;

-- 2. Create flight_fare_rules table 
CREATE TABLE IF NOT EXISTS `flight_fare_rules` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `flight_class_id` BIGINT NOT NULL,
    `child_multiplier` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    `infant_multiplier` DECIMAL(5,2) NOT NULL DEFAULT 0.10,
    `senior_multiplier` DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_flight_fare_rules_class` (`flight_class_id`),
    CONSTRAINT `fk_flight_fare_rules_class` FOREIGN KEY (`flight_class_id`)
        REFERENCES `flight_classes` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB;
ALTER TABLE `hotel_room_inventory`
ADD COLUMN `cutoff_days` INT NOT NULL DEFAULT 0 AFTER `available_qty`,
ADD COLUMN `is_free_sale` BOOLEAN NOT NULL DEFAULT FALSE AFTER `cutoff_days`;

-- 2. Add Booking Hold limits to flight_bookings
SET FOREIGN_KEY_CHECKS = 1;
