-- Flyway V8: composite / covering indexes for hot read paths (bookings, tours, destinations, schedules)

CREATE INDEX idx_bookings_user_created
    ON bookings (user_id, created_at DESC, id DESC);

CREATE INDEX idx_bookings_schedule_status
    ON bookings (schedule_id, status, deleted_at);

CREATE INDEX idx_bookings_admin_list
    ON bookings (deleted_at, created_at DESC, id DESC);

CREATE INDEX idx_bookings_paid_revenue
    ON bookings (deleted_at, payment_status, final_amount);

CREATE INDEX idx_bookings_status_created
    ON bookings (status, deleted_at, created_at);

CREATE INDEX idx_tours_dest_status_active
    ON tours (destination_id, status, deleted_at);

CREATE INDEX idx_destinations_public_list
    ON destinations (status, is_active, deleted_at, parent_id, is_featured);

CREATE INDEX idx_destinations_approved_sort
    ON destinations (status, is_active, deleted_at, created_at DESC, id DESC);

CREATE INDEX idx_schedules_tour_status_departure
    ON tour_schedules (tour_id, status, deleted_at, departure_at);

CREATE INDEX idx_payments_status_paid_at
    ON payments (status, deleted_at, paid_at);

CREATE INDEX idx_schedule_pickup_schedule
    ON tour_schedule_pickup_points (schedule_id, deleted_at, sort_order);

CREATE INDEX idx_schedule_guides_schedule
    ON tour_schedule_guides (schedule_id, deleted_at);

CREATE INDEX idx_dest_translation_dest_locale
    ON destination_translations (destination_id, locale);

CREATE INDEX idx_tour_translation_tour_locale
    ON tour_translations (tour_id, locale);
