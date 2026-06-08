-- Phase 1 - Task 2: Allotment and TTL extensions

-- 1. Add Allotment controls to hotel_room_inventory
ALTER TABLE `hotel_room_inventory`
ADD COLUMN `cutoff_days` INT NOT NULL DEFAULT 0 AFTER `available_qty`,
ADD COLUMN `is_free_sale` BOOLEAN NOT NULL DEFAULT FALSE AFTER `cutoff_days`;

-- 2. Add Booking Hold limits to flight_bookings
ALTER TABLE `flight_bookings`
ADD COLUMN `pnr_code` VARCHAR(50) NULL AFTER `currency`,
ADD COLUMN `ticketing_time_limit` DATETIME NULL AFTER `pnr_code`;
