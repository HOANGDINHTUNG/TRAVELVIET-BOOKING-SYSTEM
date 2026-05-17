-- Audit chỗ ngồi / đặt tour: booked_seats seed vs booking thực tế

SELECT '=== A) Lịch OPEN nhưng remaining=0 (không đặt được) ===' AS section;
SELECT s.id, s.schedule_code, s.tour_id, t.code AS tour_code,
       s.status, s.capacity_total, s.booked_seats, s.remaining_seats,
       s.departure_at, s.booking_close_at
FROM tour_schedules s
JOIN tours t ON t.id = s.tour_id
WHERE s.deleted_at IS NULL
  AND s.status = 'open'
  AND s.departure_at > NOW()
  AND s.remaining_seats <= 0
ORDER BY s.tour_id, s.departure_at
LIMIT 40;

SELECT '=== B) booked_seats seed KHÔNG khớp tổng booking thực (PENDING+CONFIRMED+...) ===' AS section;
SELECT s.id AS schedule_id, s.schedule_code, s.tour_id,
       s.capacity_total, s.booked_seats AS db_booked_seats,
       COALESCE(SUM(b.adults + b.children + b.seniors), 0) AS actual_occupied,
       s.remaining_seats,
       COUNT(b.id) AS booking_count
FROM tour_schedules s
LEFT JOIN bookings b ON b.schedule_id = s.id
  AND b.status IN ('pending_payment', 'confirmed', 'checked_in', 'completed')
WHERE s.deleted_at IS NULL
  AND s.status IN ('open', 'full')
  AND s.departure_at > NOW()
GROUP BY s.id, s.schedule_code, s.tour_id, s.capacity_total, s.booked_seats, s.remaining_seats
HAVING s.booked_seats != COALESCE(SUM(b.adults + b.children + b.seniors), 0)
ORDER BY ABS(s.booked_seats - COALESCE(SUM(b.adults + b.children + b.seniors), 0)) DESC
LIMIT 40;

SELECT '=== C) Tour 41 (Bangkok) — tất cả lịch OPEN ===' AS section;
SELECT s.id, s.schedule_code, s.capacity_total, s.booked_seats, s.remaining_seats, s.status,
       (SELECT COALESCE(SUM(b.adults+b.children+b.seniors),0)
        FROM bookings b WHERE b.schedule_id=s.id
          AND b.status IN ('pending_payment','confirmed','checked_in','completed')) AS actual_occupied
FROM tour_schedules s
WHERE s.tour_id = 41 AND s.deleted_at IS NULL
ORDER BY s.departure_at;

SELECT '=== D) Flash sale tours (41,46,50,63,78,89) — lịch sớm nhất còn chỗ ===' AS section;
SELECT s.tour_id, t.code, s.id, s.schedule_code,
       s.capacity_total, s.booked_seats, s.remaining_seats, s.status, s.departure_at
FROM tour_schedules s
JOIN tours t ON t.id = s.tour_id
WHERE s.tour_id IN (41,46,50,63,78,89)
  AND s.deleted_at IS NULL
  AND s.status = 'open'
  AND s.departure_at > NOW()
ORDER BY s.tour_id, s.departure_at;
