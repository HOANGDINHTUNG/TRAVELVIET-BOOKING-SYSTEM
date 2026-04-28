-- Migration to add deleted_at column to all tables whose entities extend AuditableEntity

-- Destinations module
ALTER TABLE destinations ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE destination_media ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE destination_foods ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE destination_specialties ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE destination_activities ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE destination_tips ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE destination_events ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE destination_follows ADD COLUMN deleted_at DATETIME NULL;

-- Tours module
ALTER TABLE tours ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE tour_media ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE tour_seasonality ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE tour_itinerary_days ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE itinerary_items ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE tour_checklist_items ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE tour_schedules ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE tour_schedule_pickup_points ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE tour_schedule_guides ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE tour_tags ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE tags ADD COLUMN deleted_at DATETIME NULL;

-- User & Auth module (users already has it)
ALTER TABLE roles ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE permissions ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE role_permissions ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE user_roles ADD COLUMN deleted_at DATETIME NULL;

-- Loyalty module
ALTER TABLE mission_definitions ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE user_missions ADD COLUMN deleted_at DATETIME NULL;

-- Bookings module
ALTER TABLE bookings ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE booking_passengers ADD COLUMN deleted_at DATETIME NULL;

-- Payments module
ALTER TABLE payments ADD COLUMN deleted_at DATETIME NULL;
ALTER TABLE refund_requests ADD COLUMN deleted_at DATETIME NULL;
