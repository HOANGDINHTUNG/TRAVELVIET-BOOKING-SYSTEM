-- Phase 1 - Task 1: Pricing extensions for Hotel and Flights

-- 1. Add pricing extension columns to hotel_room_types 
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
