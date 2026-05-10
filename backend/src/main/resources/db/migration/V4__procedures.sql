-- Flyway V4: stored procedures

DELIMITER $$
CREATE PROCEDURE sp_sync_schedule_booked_seats(IN p_schedule_id BIGINT) 
BEGIN UPDATE tour_schedules s SET s.booked_seats = IFNULL(( SELECT SUM(b.adults + b.children + b.seniors) 
FROM bookings b 
WHERE b.schedule_id = p_schedule_id AND b.status 
IN ('pending_payment', 'confirmed', 'checked_in', 'completed') ), 0) 
WHERE s.id = p_schedule_id; 
END$$ 
CREATE PROCEDURE sp_sync_tour_booking_stats(IN p_tour_id BIGINT)
BEGIN UPDATE tours t SET t.total_bookings = IFNULL(( SELECT COUNT(*) 
FROM bookings b WHERE b.tour_id = p_tour_id AND b.status IN ('confirmed', 'checked_in', 'completed') ), 0) 
WHERE t.id = p_tour_id; END$$ 
CREATE PROCEDURE sp_sync_tour_rating(IN p_tour_id BIGINT) 
BEGIN UPDATE tours t SET t.average_rating = IFNULL(( SELECT ROUND(AVG(r.overall_rating), 2) 
FROM reviews r WHERE r.tour_id = p_tour_id ), 0), 
t.total_reviews = IFNULL(( SELECT COUNT(*) 
FROM reviews r 
WHERE r.tour_id = p_tour_id ), 0) 
WHERE t.id = p_tour_id; 
END$$ 
CREATE PROCEDURE sp_get_refund_quote(IN p_booking_id BIGINT) 
BEGIN SELECT b.id AS booking_id, b.booking_code, cp.id AS policy_id, cp.name AS policy_name, 
TIMESTAMPDIFF(HOUR, NOW(), ts.departure_at) AS hours_before_departure, cpr.refund_percent, cpr.voucher_percent, cpr.allow_reschedule, 
ROUND(b.final_amount * cpr.refund_percent / 100, 2) AS refundable_amount, 
ROUND(b.final_amount * cpr.voucher_percent / 100, 2) AS voucher_offer_amount FROM bookings b JOIN tours t ON t.id = b.tour_id JOIN tour_schedules ts ON ts.id = b.schedule_id LEFT JOIN cancellation_policies cp ON cp.id = t.cancellation_policy_id 
LEFT JOIN cancellation_policy_rules cpr ON cpr.policy_id = cp.id 
AND TIMESTAMPDIFF(HOUR, NOW(), ts.departure_at) >= IFNULL(cpr.min_hours_before, 0) 
AND ( cpr.max_hours_before IS NULL OR TIMESTAMPDIFF(HOUR, NOW(), ts.departure_at) < cpr.max_hours_before ) 
WHERE b.id = p_booking_id ORDER BY cpr.min_hours_before DESC LIMIT 1; END$$
DELIMITER ;
