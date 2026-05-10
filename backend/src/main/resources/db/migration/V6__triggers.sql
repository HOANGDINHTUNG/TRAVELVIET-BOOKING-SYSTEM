-- Flyway V6: triggers

DELIMITER $$
-- 18. TRIGGERS (moved from baseline)
 
CREATE TRIGGER trg_users_before_insert BEFORE INSERT ON users FOR EACH ROW BEGIN IF NEW.id IS NULL OR NEW.id = '' THEN SET NEW.id = UUID(); END IF; END$$ 
CREATE TRIGGER trg_guides_before_insert BEFORE INSERT ON guides FOR EACH ROW BEGIN IF NEW.code IS NULL OR NEW.code = '' THEN SET NEW.code = fn_generate_code('GD'); END IF; END$$ 
CREATE TRIGGER trg_tour_schedules_before_insert BEFORE INSERT ON tour_schedules FOR EACH ROW BEGIN IF NEW.schedule_code IS NULL OR NEW.schedule_code = '' THEN SET NEW.schedule_code = fn_generate_code('SCH'); END IF; END$$ 
CREATE TRIGGER trg_bookings_before_insert BEFORE INSERT ON bookings FOR EACH ROW BEGIN DECLARE v_capacity INT DEFAULT 0; DECLARE v_booked INT DEFAULT 0; DECLARE v_new_seats INT DEFAULT 0; IF NEW.booking_code IS NULL OR NEW.booking_code = '' THEN SET NEW.booking_code = fn_generate_code('BK'); END IF; SET v_new_seats = NEW.adults + NEW.children + NEW.seniors;SELECT 
    capacity_total, booked_seats
INTO v_capacity , v_booked FROM
    tour_schedules
WHERE
    id = NEW.schedule_id; IF v_capacity IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Schedule does not exist'; END IF; IF NEW.status IN ('pending_payment', 'confirmed', 'checked_in', 'completed') THEN IF (v_booked + v_new_seats) > v_capacity THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Over capacity for schedule'; END IF; END IF; END$$ CREATE TRIGGER trg_bookings_before_update BEFORE UPDATE ON bookings FOR EACH ROW BEGIN DECLARE v_capacity INT DEFAULT 0; DECLARE v_booked INT DEFAULT 0; DECLARE v_new_seats INT DEFAULT 0; SET v_new_seats = NEW.adults + NEW.children + NEW.seniors;SELECT 
    capacity_total
INTO v_capacity FROM
    tour_schedules
WHERE
    id = NEW.schedule_id;SELECT 
    IFNULL(SUM(adults + children + seniors), 0)
INTO v_booked FROM
    bookings
WHERE
    schedule_id = NEW.schedule_id
        AND id <> OLD.id
        AND status IN ('pending_payment' , 'confirmed', 'checked_in', 'completed'); IF NEW.status IN ('pending_payment', 'confirmed', 'checked_in', 'completed') THEN IF (v_booked + v_new_seats) > v_capacity THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Over capacity for schedule'; END IF; END IF; END$$ CREATE TRIGGER trg_bookings_after_insert AFTER INSERT ON bookings FOR EACH ROW BEGIN INSERT INTO booking_status_history(booking_id, old_status, new_status, created_at) VALUES (NEW.id, NULL, NEW.status, NOW()); CALL sp_sync_schedule_booked_seats(NEW.schedule_id); CALL sp_sync_tour_booking_stats(NEW.tour_id); END$$ CREATE TRIGGER trg_bookings_after_update AFTER UPDATE ON bookings FOR EACH ROW BEGIN IF OLD.status <> NEW.status THEN INSERT INTO booking_status_history(booking_id, old_status, new_status, created_at) VALUES (NEW.id, OLD.status, NEW.status, NOW()); END IF; CALL sp_sync_schedule_booked_seats(OLD.schedule_id); IF NEW.schedule_id <> OLD.schedule_id THEN CALL sp_sync_schedule_booked_seats(NEW.schedule_id); END IF; CALL sp_sync_tour_booking_stats(OLD.tour_id); IF NEW.tour_id <> OLD.tour_id THEN CALL sp_sync_tour_booking_stats(NEW.tour_id); END IF; IF OLD.status <> 'completed' AND NEW.status = 'completed' THEN UPDATE travel_passports tp SET tp.total_tours = tp.total_tours + 1, tp.last_trip_at = NOW() WHERE tp.user_id = NEW.user_id; INSERT INTO passport_visited_destinations ( passport_id, destination_id, first_booking_id, first_visited_at, last_visited_at ) SELECT tp.id, t.destination_id, NEW.id, NOW(), NOW() FROM travel_passports tp JOIN tours t ON t.id = NEW.tour_id WHERE tp.user_id = NEW.user_id ON DUPLICATE KEY UPDATE last_visited_at = VALUES(last_visited_at);UPDATE travel_passports tp 
SET 
    tp.total_destinations = (SELECT 
            COUNT(*)
        FROM
            passport_visited_destinations pvd
        WHERE
            pvd.passport_id = tp.id)
WHERE
    tp.user_id = NEW.user_id;UPDATE users 
SET 
    total_spent = total_spent + NEW.final_amount,
    loyalty_points = loyalty_points + FLOOR(NEW.final_amount / 1000000)
WHERE
    id = NEW.user_id; END IF; END$$ CREATE TRIGGER trg_bookings_after_delete AFTER DELETE ON bookings FOR EACH ROW BEGIN CALL sp_sync_schedule_booked_seats(OLD.schedule_id); CALL sp_sync_tour_booking_stats(OLD.tour_id); END$$ CREATE TRIGGER trg_payments_before_insert BEFORE INSERT ON payments FOR EACH ROW BEGIN IF NEW.payment_code IS NULL OR NEW.payment_code = '' THEN SET NEW.payment_code = fn_generate_code('PM'); END IF; END$$ CREATE TRIGGER trg_refund_requests_before_insert BEFORE INSERT ON refund_requests FOR EACH ROW BEGIN IF NEW.refund_code IS NULL OR NEW.refund_code = '' THEN SET NEW.refund_code = fn_generate_code('RF'); END IF; END$$ CREATE TRIGGER trg_support_sessions_before_insert BEFORE INSERT ON support_sessions FOR EACH ROW BEGIN IF NEW.session_code IS NULL OR NEW.session_code = '' THEN SET NEW.session_code = fn_generate_code('CS'); END IF; END$$ CREATE TRIGGER trg_users_after_insert AFTER INSERT ON users FOR EACH ROW BEGIN DECLARE v_user_role_id BIGINT; INSERT INTO travel_passports(user_id, passport_no) VALUES (NEW.id, fn_generate_code('TVP')); SELECT id INTO v_user_role_id FROM roles WHERE code = 'USER' LIMIT 1; IF v_user_role_id IS NOT NULL THEN INSERT IGNORE INTO user_roles(user_id, role_id, is_primary, assigned_at, note) VALUES (NEW.id, v_user_role_id, TRUE, NOW(), 'Auto assign default USER role'); END IF; END$$ CREATE TRIGGER trg_reviews_after_insert AFTER INSERT ON reviews FOR EACH ROW BEGIN CALL sp_sync_tour_rating(NEW.tour_id); END$$ CREATE TRIGGER trg_reviews_after_update AFTER UPDATE ON reviews FOR EACH ROW BEGIN CALL sp_sync_tour_rating(OLD.tour_id); IF NEW.tour_id <> OLD.tour_id THEN CALL sp_sync_tour_rating(NEW.tour_id); END IF; END$$ CREATE TRIGGER trg_reviews_after_delete AFTER DELETE ON reviews FOR EACH ROW BEGIN CALL sp_sync_tour_rating(OLD.tour_id); END$$ CREATE TRIGGER trg_user_checkins_after_insert AFTER INSERT ON user_checkins FOR EACH ROW BEGIN UPDATE travel_passports tp SET tp.total_checkins = ( SELECT COUNT(*) FROM user_checkins uc WHERE uc.user_id = NEW.user_id ) WHERE tp.user_id = NEW.user_id; END$$
DELIMITER ;
DELIMITER ;
