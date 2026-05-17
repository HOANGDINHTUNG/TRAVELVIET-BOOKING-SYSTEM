-- Audit: tour san sang hien thi + dat cho (chay: mysql ... < scripts/audit-tour-booking-readiness.sql)

SELECT '=== 1) Tour ACTIVE thieu lich OPEN tuong lai ===' AS section;
SELECT t.id, t.code, t.name, t.duration_days, t.base_price
FROM tours t
WHERE t.deleted_at IS NULL
  AND t.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM tour_schedules s
    WHERE s.tour_id = t.id
      AND s.deleted_at IS NULL
      AND s.status = 'open'
      AND s.departure_at > NOW()
      AND (s.capacity_total - s.booked_seats) > 0
  )
ORDER BY t.id
LIMIT 50;

SELECT CONCAT('Tong tour active thieu lich: ', COUNT(*)) AS summary
FROM tours t
WHERE t.deleted_at IS NULL
  AND t.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM tour_schedules s
    WHERE s.tour_id = t.id
      AND s.deleted_at IS NULL
      AND s.status = 'open'
      AND s.departure_at > NOW()
      AND (s.capacity_total - s.booked_seats) > 0
  );

SELECT '=== 2) HOME_FLASH_SALE (6 tour) ===' AS section;
SELECT t.id, t.code, t.is_featured,
       (SELECT COUNT(*) FROM tour_schedules s
        WHERE s.tour_id = t.id AND s.status = 'open' AND s.departure_at > NOW()) AS open_schedules,
       (SELECT MIN(s.departure_at) FROM tour_schedules s
        WHERE s.tour_id = t.id AND s.status = 'open' AND s.departure_at > NOW()) AS next_departure,
       (SELECT f.has_flight FROM tour_inclusion_flags f WHERE f.tour_id = t.id) AS has_flight,
       (SELECT h.city_name_vi FROM tour_departure_hubs h
        WHERE h.tour_id = t.id AND h.is_primary = TRUE LIMIT 1) AS depart_city
FROM tours t
JOIN tour_tags tt ON tt.tour_id = t.id
JOIN tags tg ON tg.id = tt.tag_id AND tg.code = 'HOME_FLASH_SALE'
WHERE t.deleted_at IS NULL
ORDER BY t.id;

SELECT '=== 3) Tour co lich nhung thieu diem don ===' AS section;
SELECT s.id AS schedule_id, s.tour_id, t.code, s.schedule_code
FROM tour_schedules s
JOIN tours t ON t.id = s.tour_id
WHERE s.deleted_at IS NULL
  AND s.status = 'open'
  AND s.departure_at > NOW()
  AND NOT EXISTS (
    SELECT 1 FROM tour_schedule_pickup_points p
    WHERE p.schedule_id = s.id AND p.deleted_at IS NULL
  )
ORDER BY s.tour_id
LIMIT 30;

SELECT '=== 4) Tour active thieu inclusion_flags ===' AS section;
SELECT t.id, t.code
FROM tours t
WHERE t.deleted_at IS NULL AND t.status = 'active'
  AND NOT EXISTS (SELECT 1 FROM tour_inclusion_flags f WHERE f.tour_id = t.id)
ORDER BY t.id
LIMIT 30;
