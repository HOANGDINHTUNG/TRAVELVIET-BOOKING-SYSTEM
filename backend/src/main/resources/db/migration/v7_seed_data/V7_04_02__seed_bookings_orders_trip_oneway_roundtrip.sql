SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- V7_04B__seed_bookings_orders_trip_oneway_roundtrip.sql
-- Dữ liệu booking/order: tour booking, hotel booking, flight booking 1 chiều/khứ hồi, combo booking, passenger.
-- ============================================================

-- 9) flight classes cho moi flight: economy + business
INSERT IGNORE INTO flight_classes (
    flight_id, cabin_class, fare_family, base_price, tax_amount, currency,
    seat_total, seat_available, baggage_rule_json, change_refund_rule_json, is_active
)
SELECT
    f.id,
    c.cabin_class,
    c.fare_family,
    CASE c.cabin_class
        WHEN 'economy' THEN CAST(1200000 + MOD(f.id * 17000, 1800000) AS DECIMAL(14,2))
        ELSE CAST(3500000 + MOD(f.id * 25000, 3000000) AS DECIMAL(14,2))
    END,
    CASE c.cabin_class
        WHEN 'economy' THEN 250000
        ELSE 450000
    END,
    'VND',
    CASE c.cabin_class
        WHEN 'economy' THEN 180
        ELSE 24
    END,
    CASE c.cabin_class
        WHEN 'economy' THEN 120 + MOD(f.id, 40)
        ELSE 12 + MOD(f.id, 8)
    END,
    CASE c.cabin_class
        WHEN 'economy' THEN JSON_OBJECT('checked_baggage_kg', 20, 'carry_on_kg', 7)
        ELSE JSON_OBJECT('checked_baggage_kg', 35, 'carry_on_kg', 10)
    END,
    JSON_OBJECT('change_fee', CASE c.cabin_class WHEN 'economy' THEN 350000 ELSE 250000 END, 'refundable', CASE c.cabin_class WHEN 'economy' THEN FALSE ELSE TRUE END),
    TRUE
FROM flights f
CROSS JOIN (
    SELECT 'economy' AS cabin_class, 'standard' AS fare_family
    UNION ALL
    SELECT 'business', 'flex'
) c;


INSERT INTO hotel_bookings (
    booking_code, user_id, order_id, hotel_id, room_type_id, checkin_date, checkout_date,
    rooms, adults, children, status, payment_status, contact_name, contact_phone, contact_email,
    subtotal_amount, discount_amount, tax_amount, final_amount, currency, special_requests
)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 240
),
room_pool AS (
    SELECT
        rt.id AS room_type_id,
        h.id AS hotel_id,
        rt.currency,
        rt.base_price,
        ROW_NUMBER() OVER (ORDER BY rt.id) AS rn,
        COUNT(*) OVER () AS total
    FROM hotel_room_types rt
    JOIN hotels h ON h.id = rt.hotel_id
),
user_pool AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS rn, COUNT(*) OVER () AS total
    FROM users
    WHERE deleted_at IS NULL
)
SELECT
    CONCAT('HBK', LPAD(s.n, 6, '0')),
    u.id,
    o.id,
    rp.hotel_id,
    rp.room_type_id,
    DATE_ADD(CURDATE(), INTERVAL MOD(s.n, 20) DAY),
    DATE_ADD(CURDATE(), INTERVAL MOD(s.n, 20) + (1 + MOD(s.n, 4)) DAY),
    1 + MOD(s.n, 2),
    1 + MOD(s.n, 3),
    MOD(s.n, 2),
    'pending_payment',
    'unpaid',
    CONCAT('Khach Hotel ', s.n),
    CONCAT('09', LPAD(12000000 + s.n, 8, '0')),
    CONCAT('hotel.booking', s.n, '@travelviet.vn'),
    CAST(rp.base_price * (1 + MOD(s.n, 3)) AS DECIMAL(14,2)),
    0, 0,
    CAST(rp.base_price * (1 + MOD(s.n, 3)) AS DECIMAL(14,2)),
    rp.currency,
    'Phong yên tĩnh, tầng cao'
FROM seq s
JOIN room_pool rp ON rp.rn = MOD(s.n - 1, rp.total) + 1
JOIN user_pool u ON u.rn = MOD(s.n - 1, u.total) + 1
JOIN orders o ON o.order_code = CONCAT('HORD', LPAD(s.n, 6, '0'))
ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    order_id = VALUES(order_id),
    hotel_id = VALUES(hotel_id),
    room_type_id = VALUES(room_type_id),
    checkin_date = VALUES(checkin_date),
    checkout_date = VALUES(checkout_date),
    rooms = VALUES(rooms),
    adults = VALUES(adults),
    children = VALUES(children),
    subtotal_amount = VALUES(subtotal_amount),
    final_amount = VALUES(final_amount),
    currency = VALUES(currency),
    special_requests = VALUES(special_requests);


-- ============================================================
-- FLIGHT BOOKINGS / ĐẶT CHUYẾN BAY
-- Mục đích:
-- - Tạo dữ liệu đặt vé máy bay có cả 1 chiều và 2 chiều.
-- - trip_type = 'one_way'    : chỉ có flight_id / departure_date.
-- - trip_type = 'round_trip' : có thêm return_flight_id / return_departure_date.
-- - return_flight_id được lấy từ chuyến bay chiều ngược lại cùng cặp sân bay.
-- ============================================================
INSERT INTO flight_bookings (
    booking_code, user_id, order_id, flight_id, flight_class_id, departure_date, trip_type,
    return_flight_id, return_departure_date, passenger_count, status, payment_status,
    contact_name, contact_phone, contact_email, subtotal_amount, discount_amount, tax_amount,
    final_amount, currency, special_requests
)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 260
),
fc_pool AS (
    SELECT
        fc.id AS flight_class_id,
        f.id AS flight_id,
        f.origin_airport_id,
        f.destination_airport_id,
        f.departure_time_local,
        fc.currency,
        (fc.base_price + fc.tax_amount) AS gross_price,
        ROW_NUMBER() OVER (ORDER BY fc.id) AS rn,
        COUNT(*) OVER () AS total
    FROM flight_classes fc
    JOIN flights f ON f.id = fc.flight_id
    WHERE fc.is_active = TRUE
),
user_pool AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS rn, COUNT(*) OVER () AS total
    FROM users
    WHERE deleted_at IS NULL
)
SELECT
    CONCAT('FBK', LPAD(s.n, 6, '0')),
    u.id,
    o.id,
    fp.flight_id,
    fp.flight_class_id,
    DATE(fp.departure_time_local),
    CASE WHEN MOD(s.n, 3) = 0 THEN 'round_trip' ELSE 'one_way' END,
    CASE WHEN MOD(s.n, 3) = 0 THEN (
        SELECT f2.id
        FROM flights f2
        WHERE f2.origin_airport_id = fp.destination_airport_id
          AND f2.destination_airport_id = fp.origin_airport_id
          AND f2.departure_time_local > fp.departure_time_local
          AND f2.status IN ('scheduled','active')
        ORDER BY f2.departure_time_local
        LIMIT 1
    ) ELSE NULL END,
    CASE WHEN MOD(s.n, 3) = 0 THEN (
        SELECT DATE(f2.departure_time_local)
        FROM flights f2
        WHERE f2.origin_airport_id = fp.destination_airport_id
          AND f2.destination_airport_id = fp.origin_airport_id
          AND f2.departure_time_local > fp.departure_time_local
          AND f2.status IN ('scheduled','active')
        ORDER BY f2.departure_time_local
        LIMIT 1
    ) ELSE NULL END,
    1 + MOD(s.n, 3),
    'pending_payment',
    'unpaid',
    CONCAT('Khach Flight ', s.n),
    CONCAT('09', LPAD(22000000 + s.n, 8, '0')),
    CONCAT('flight.booking', s.n, '@travelviet.vn'),
    CAST(fp.gross_price * (1 + MOD(s.n, 3)) AS DECIMAL(14,2)),
    0, 0,
    CAST(fp.gross_price * (1 + MOD(s.n, 3)) AS DECIMAL(14,2)),
    fp.currency,
    CASE WHEN MOD(s.n, 3) = 0 THEN 'Khứ hồi - ưu tiên ghế gần lối đi' ELSE 'Một chiều - ưu tiên ghế gần lối đi' END
FROM seq s
JOIN fc_pool fp ON fp.rn = MOD(s.n - 1, fp.total) + 1
JOIN user_pool u ON u.rn = MOD(s.n - 1, u.total) + 1
JOIN orders o ON o.order_code = CONCAT('FORD', LPAD(s.n, 6, '0'))
ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    order_id = VALUES(order_id),
    flight_id = VALUES(flight_id),
    flight_class_id = VALUES(flight_class_id),
    departure_date = VALUES(departure_date),
    trip_type = VALUES(trip_type),
    return_flight_id = VALUES(return_flight_id),
    return_departure_date = VALUES(return_departure_date),
    passenger_count = VALUES(passenger_count),
    subtotal_amount = VALUES(subtotal_amount),
    final_amount = VALUES(final_amount),
    currency = VALUES(currency),
    special_requests = VALUES(special_requests);


INSERT INTO combo_bookings (
    booking_code, user_id, order_id, combo_id, travel_start_date, travel_end_date,
    selection_snapshot_json, status, payment_status, contact_name, contact_phone, contact_email,
    subtotal_amount, discount_amount, tax_amount, final_amount, currency, special_requests
)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 220
),
combo_pool AS (
    SELECT
        c.id AS combo_id,
        c.base_price,
        c.discount_amount,
        ROW_NUMBER() OVER (ORDER BY c.id) AS rn,
        COUNT(*) OVER () AS total
    FROM combo_packages c
    WHERE c.is_active = TRUE
),
user_pool AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS rn, COUNT(*) OVER () AS total
    FROM users
    WHERE deleted_at IS NULL
)
SELECT
    CONCAT('CBK', LPAD(s.n, 6, '0')),
    u.id,
    o.id,
    cp.combo_id,
    DATE_ADD(CURDATE(), INTERVAL MOD(s.n, 35) DAY),
    DATE_ADD(CURDATE(), INTERVAL MOD(s.n, 35) + (2 + MOD(s.n, 5)) DAY),
    JSON_OBJECT('seed', s.n, 'channel', 'app', 'market', CASE WHEN MOD(s.n, 2) = 0 THEN 'domestic' ELSE 'international' END),
    'pending_payment',
    'unpaid',
    CONCAT('Khach Combo ', s.n),
    CONCAT('09', LPAD(32000000 + s.n, 8, '0')),
    CONCAT('combo.booking', s.n, '@travelviet.vn'),
    cp.base_price,
    cp.discount_amount,
    0,
    GREATEST(cp.base_price - cp.discount_amount, 0),
    'VND',
    'Uu tien lich trinh gon'
FROM seq s
JOIN combo_pool cp ON cp.rn = MOD(s.n - 1, cp.total) + 1
JOIN user_pool u ON u.rn = MOD(s.n - 1, u.total) + 1
JOIN orders o ON o.order_code = CONCAT('CORD', LPAD(s.n, 6, '0'))
ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    order_id = VALUES(order_id),
    combo_id = VALUES(combo_id),
    travel_start_date = VALUES(travel_start_date),
    travel_end_date = VALUES(travel_end_date),
    selection_snapshot_json = VALUES(selection_snapshot_json),
    subtotal_amount = VALUES(subtotal_amount),
    discount_amount = VALUES(discount_amount),
    final_amount = VALUES(final_amount),
    special_requests = VALUES(special_requests);


-- E) Status distribution + *_status_history + payments for dashboard realism

-- E1) Phan bo trang thai cho hotel_bookings (gan voi order)
UPDATE hotel_bookings hb
SET
    hb.status = CASE
        WHEN MOD(hb.id, 100) < 62 THEN 'confirmed'
        WHEN MOD(hb.id, 100) < 78 THEN 'completed'
        WHEN MOD(hb.id, 100) < 90 THEN 'cancelled'
        WHEN MOD(hb.id, 100) < 96 THEN 'expired'
        ELSE 'pending_payment'
    END,
    hb.payment_status = CASE
        WHEN MOD(hb.id, 100) < 76 THEN 'paid'
        WHEN MOD(hb.id, 100) < 88 THEN 'failed'
        WHEN MOD(hb.id, 100) < 94 THEN 'refunded'
        ELSE 'unpaid'
    END,
    hb.cancel_reason = CASE WHEN MOD(hb.id, 100) BETWEEN 78 AND 95 THEN 'Customer requested cancellation' ELSE hb.cancel_reason END,
    hb.cancelled_at = CASE WHEN MOD(hb.id, 100) BETWEEN 78 AND 95 THEN DATE_SUB(NOW(), INTERVAL MOD(hb.id, 30) DAY) ELSE hb.cancelled_at END,
    hb.completed_at = CASE WHEN MOD(hb.id, 100) BETWEEN 62 AND 77 THEN DATE_SUB(NOW(), INTERVAL MOD(hb.id, 20) DAY) ELSE hb.completed_at END
WHERE hb.booking_code LIKE 'HBK%';


-- E2) Phan bo trang thai cho flight_bookings
UPDATE flight_bookings fb
SET
    fb.status = CASE
        WHEN MOD(fb.id, 100) < 58 THEN 'confirmed'
        WHEN MOD(fb.id, 100) < 74 THEN 'completed'
        WHEN MOD(fb.id, 100) < 89 THEN 'cancelled'
        WHEN MOD(fb.id, 100) < 95 THEN 'expired'
        ELSE 'pending_payment'
    END,
    fb.payment_status = CASE
        WHEN MOD(fb.id, 100) < 73 THEN 'paid'
        WHEN MOD(fb.id, 100) < 86 THEN 'failed'
        WHEN MOD(fb.id, 100) < 93 THEN 'refunded'
        ELSE 'unpaid'
    END,
    fb.cancel_reason = CASE WHEN MOD(fb.id, 100) BETWEEN 74 AND 95 THEN 'Schedule changed or customer cancellation' ELSE fb.cancel_reason END,
    fb.cancelled_at = CASE WHEN MOD(fb.id, 100) BETWEEN 74 AND 95 THEN DATE_SUB(NOW(), INTERVAL MOD(fb.id, 25) DAY) ELSE fb.cancelled_at END,
    fb.completed_at = CASE WHEN MOD(fb.id, 100) BETWEEN 58 AND 73 THEN DATE_SUB(NOW(), INTERVAL MOD(fb.id, 18) DAY) ELSE fb.completed_at END
WHERE fb.booking_code LIKE 'FBK%';


-- E3) Phan bo trang thai cho combo_bookings
UPDATE combo_bookings cb
SET
    cb.status = CASE
        WHEN MOD(cb.id, 100) < 60 THEN 'confirmed'
        WHEN MOD(cb.id, 100) < 76 THEN 'completed'
        WHEN MOD(cb.id, 100) < 90 THEN 'cancelled'
        WHEN MOD(cb.id, 100) < 96 THEN 'expired'
        ELSE 'pending_payment'
    END,
    cb.payment_status = CASE
        WHEN MOD(cb.id, 100) < 74 THEN 'paid'
        WHEN MOD(cb.id, 100) < 87 THEN 'failed'
        WHEN MOD(cb.id, 100) < 94 THEN 'refunded'
        ELSE 'unpaid'
    END,
    cb.cancel_reason = CASE WHEN MOD(cb.id, 100) BETWEEN 76 AND 95 THEN 'Combo policy cancellation' ELSE cb.cancel_reason END,
    cb.cancelled_at = CASE WHEN MOD(cb.id, 100) BETWEEN 76 AND 95 THEN DATE_SUB(NOW(), INTERVAL MOD(cb.id, 22) DAY) ELSE cb.cancelled_at END,
    cb.completed_at = CASE WHEN MOD(cb.id, 100) BETWEEN 60 AND 75 THEN DATE_SUB(NOW(), INTERVAL MOD(cb.id, 16) DAY) ELSE cb.completed_at END
WHERE cb.booking_code LIKE 'CBK%';


-- E5) *_status_history tables cho booking moi
CREATE TABLE IF NOT EXISTS hotel_booking_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hotel_booking_id BIGINT NOT NULL,
    old_status ENUM('pending_payment','confirmed','checked_in','completed','cancel_requested','cancelled','refunded','expired') NULL,
    new_status ENUM('pending_payment','confirmed','checked_in','completed','cancel_requested','cancelled','refunded','expired') NOT NULL,
    changed_by CHAR(36) NULL,
    change_reason TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hotel_booking_status_history_booking
        FOREIGN KEY (hotel_booking_id) REFERENCES hotel_bookings (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_hotel_booking_status_history_user
        FOREIGN KEY (changed_by) REFERENCES users (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS flight_booking_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flight_booking_id BIGINT NOT NULL,
    old_status ENUM('pending_payment','confirmed','checked_in','completed','cancel_requested','cancelled','refunded','expired') NULL,
    new_status ENUM('pending_payment','confirmed','checked_in','completed','cancel_requested','cancelled','refunded','expired') NOT NULL,
    changed_by CHAR(36) NULL,
    change_reason TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_flight_booking_status_history_booking
        FOREIGN KEY (flight_booking_id) REFERENCES flight_bookings (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_flight_booking_status_history_user
        FOREIGN KEY (changed_by) REFERENCES users (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS combo_booking_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combo_booking_id BIGINT NOT NULL,
    old_status ENUM('pending_payment','confirmed','checked_in','completed','cancel_requested','cancelled','refunded','expired') NULL,
    new_status ENUM('pending_payment','confirmed','checked_in','completed','cancel_requested','cancelled','refunded','expired') NOT NULL,
    changed_by CHAR(36) NULL,
    change_reason TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_combo_booking_status_history_booking
        FOREIGN KEY (combo_booking_id) REFERENCES combo_bookings (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_combo_booking_status_history_user
        FOREIGN KEY (changed_by) REFERENCES users (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;


-- ORDERS / BOOKINGS / PAYMENTS / REFUNDS (core test flow)
INSERT IGNORE INTO orders (
    id, order_code, user_id, status, payment_status, order_source, currency,
    subtotal_amount, discount_amount, voucher_discount_amount, loyalty_discount_amount, addon_amount, tax_amount, final_amount,
    note, placed_at
) VALUES
(42,'ORD_SEED_00042','550e8400-e29b-41d4-a716-446655440001','pending_payment','unpaid','app','VND',
3000000,200000,150000,0,50000,0,2850000,
'Phòng gần cửa sổ, ăn chay.',NULL);


INSERT IGNORE INTO bookings (
    id, booking_code, user_id, order_id, tour_id, schedule_id,
    status, payment_status,
    contact_name, contact_phone, contact_email,
    adults, children, infants, seniors,
    subtotal_amount, discount_amount, voucher_discount_amount, loyalty_discount_amount, addon_amount, tax_amount, final_amount,
    currency, voucher_id, combo_id, booking_source, special_requests
) VALUES
(1,'BK_SEED_00001','550e8400-e29b-41d4-a716-446655440001',42,1,5,
'pending_payment','unpaid',
'Nguyễn Văn An','+84901234567','an.nguyen+seed@gmail.com',
2,1,0,0,
3000000,200000,150000,0,50000,0,2850000,
'VND',5,6,'app','Phòng gần cửa sổ, ăn chay.');


INSERT IGNORE INTO order_items (
    id, order_id, item_type, item_ref_id, item_name, quantity, unit_price, discount_amount, line_total, metadata_json
) VALUES
(1,42,'booking',1,'Đà Nẵng 3N2Đ – Biển & Bà Nà',1,3000000,350000,2850000,JSON_OBJECT('tourId',1,'scheduleId',5));


INSERT IGNORE INTO booking_combo_items (id, booking_id, combo_id, unit_price, discount_amount, final_price)
VALUES (1,1,6,100000,50000,50000);


INSERT IGNORE INTO booking_passengers (
    id, booking_id, passenger_type, full_name, gender, date_of_birth, identity_no, phone, email, checked_in
) VALUES
(1,1,'adult','Nguyễn Văn An','male','1995-06-15','001095012345','+84901234567','an.nguyen+seed@gmail.com',FALSE),
(2,1,'child','Trần Thị Bình','female','2015-06-01',NULL,NULL,NULL,FALSE);


INSERT IGNORE INTO booking_status_history (
    id, booking_id, old_status, new_status, changed_by, change_reason, created_at
) VALUES
(1,1,NULL,'pending_payment','550e8400-e29b-41d4-a716-446655440001','Booking created',CURRENT_TIMESTAMP);


-- BOOKING PRODUCTS (attach product to booking)
INSERT IGNORE INTO booking_products (id, booking_id, product_id, quantity, unit_price, line_total, is_free_gift)
VALUES (1,1,1,1,150000,150000,FALSE);


INSERT IGNORE INTO booking_addons (id, booking_id, addon_id, addon_name, pricing_mode, quantity, unit_price, discount_amount, line_total, note)
VALUES (1,1,1,'Đưa đón sân bay','per_booking',1,250000,0,250000,'Áp dụng cho 1 booking');


-- D) E2E seed: orders + hotel/flight/combo bookings + order_items
-- D1) Hotel booking orders
INSERT INTO orders (
    order_code, user_id, status, payment_status, order_source, currency,
    subtotal_amount, discount_amount, voucher_discount_amount, loyalty_discount_amount,
    addon_amount, tax_amount, final_amount, note, expires_at, placed_at
)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 240
),
user_pool AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS rn, COUNT(*) OVER () AS total
    FROM users
    WHERE deleted_at IS NULL
)
SELECT
    CONCAT('HORD', LPAD(s.n, 6, '0')),
    u.id,
    'pending_payment',
    'unpaid',
    'app',
    'VND',
    CAST(1800000 + MOD(s.n * 315000, 5200000) AS DECIMAL(14,2)),
    0, 0, 0, 0, 0,
    CAST(1800000 + MOD(s.n * 315000, 5200000) AS DECIMAL(14,2)),
    CONCAT('Hotel order seed #', s.n),
    DATE_ADD(NOW(), INTERVAL 2 DAY),
    NOW()
FROM seq s
JOIN user_pool u ON u.rn = MOD(s.n - 1, u.total) + 1
ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    status = VALUES(status),
    payment_status = VALUES(payment_status),
    subtotal_amount = VALUES(subtotal_amount),
    final_amount = VALUES(final_amount),
    note = VALUES(note),
    expires_at = VALUES(expires_at),
    placed_at = VALUES(placed_at);


INSERT INTO order_items (
    order_id, item_type, item_ref_id, item_name, quantity, unit_price, discount_amount, line_total, metadata_json
)
SELECT
    hb.order_id,
    'hotel_booking',
    hb.id,
    CONCAT('Hotel booking ', hb.booking_code),
    1,
    hb.subtotal_amount,
    hb.discount_amount,
    hb.final_amount,
    JSON_OBJECT('booking_type', 'hotel', 'hotel_id', hb.hotel_id, 'room_type_id', hb.room_type_id)
FROM hotel_bookings hb
WHERE hb.booking_code LIKE 'HBK%'
  AND NOT EXISTS (
      SELECT 1 FROM order_items oi
      WHERE oi.order_id = hb.order_id
        AND oi.item_type = 'hotel_booking'
        AND oi.item_ref_id = hb.id
  );


-- D2) Flight booking orders
INSERT INTO orders (
    order_code, user_id, status, payment_status, order_source, currency,
    subtotal_amount, discount_amount, voucher_discount_amount, loyalty_discount_amount,
    addon_amount, tax_amount, final_amount, note, expires_at, placed_at
)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 260
),
user_pool AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS rn, COUNT(*) OVER () AS total
    FROM users
    WHERE deleted_at IS NULL
)
SELECT
    CONCAT('FORD', LPAD(s.n, 6, '0')),
    u.id,
    'pending_payment',
    'unpaid',
    'web',
    'VND',
    CAST(2800000 + MOD(s.n * 510000, 9000000) AS DECIMAL(14,2)),
    0, 0, 0, 0, 0,
    CAST(2800000 + MOD(s.n * 510000, 9000000) AS DECIMAL(14,2)),
    CONCAT('Flight order seed #', s.n),
    DATE_ADD(NOW(), INTERVAL 1 DAY),
    NOW()
FROM seq s
JOIN user_pool u ON u.rn = MOD(s.n - 1, u.total) + 1
ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    subtotal_amount = VALUES(subtotal_amount),
    final_amount = VALUES(final_amount),
    note = VALUES(note),
    expires_at = VALUES(expires_at),
    placed_at = VALUES(placed_at);


INSERT INTO order_items (
    order_id, item_type, item_ref_id, item_name, quantity, unit_price, discount_amount, line_total, metadata_json
)
SELECT
    fb.order_id,
    'flight_booking',
    fb.id,
    CONCAT('Flight booking ', fb.booking_code),
    1,
    fb.subtotal_amount,
    fb.discount_amount,
    fb.final_amount,
    JSON_OBJECT('booking_type', 'flight', 'flight_id', fb.flight_id, 'flight_class_id', fb.flight_class_id)
FROM flight_bookings fb
WHERE fb.booking_code LIKE 'FBK%'
  AND NOT EXISTS (
      SELECT 1 FROM order_items oi
      WHERE oi.order_id = fb.order_id
        AND oi.item_type = 'flight_booking'
        AND oi.item_ref_id = fb.id
  );


-- D3) Combo booking orders
INSERT INTO orders (
    order_code, user_id, status, payment_status, order_source, currency,
    subtotal_amount, discount_amount, voucher_discount_amount, loyalty_discount_amount,
    addon_amount, tax_amount, final_amount, note, expires_at, placed_at
)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 220
),
user_pool AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS rn, COUNT(*) OVER () AS total
    FROM users
    WHERE deleted_at IS NULL
)
SELECT
    CONCAT('CORD', LPAD(s.n, 6, '0')),
    u.id,
    'pending_payment',
    'unpaid',
    'app',
    'VND',
    CAST(5200000 + MOD(s.n * 420000, 11000000) AS DECIMAL(14,2)),
    0, 0, 0, 0, 0,
    CAST(5200000 + MOD(s.n * 420000, 11000000) AS DECIMAL(14,2)),
    CONCAT('Combo order seed #', s.n),
    DATE_ADD(NOW(), INTERVAL 3 DAY),
    NOW()
FROM seq s
JOIN user_pool u ON u.rn = MOD(s.n - 1, u.total) + 1
ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    subtotal_amount = VALUES(subtotal_amount),
    final_amount = VALUES(final_amount),
    note = VALUES(note),
    expires_at = VALUES(expires_at),
    placed_at = VALUES(placed_at);


INSERT INTO order_items (
    order_id, item_type, item_ref_id, item_name, quantity, unit_price, discount_amount, line_total, metadata_json
)
SELECT
    cb.order_id,
    'combo_booking',
    cb.id,
    CONCAT('Combo booking ', cb.booking_code),
    1,
    cb.subtotal_amount,
    cb.discount_amount,
    cb.final_amount,
    JSON_OBJECT('booking_type', 'combo', 'combo_id', cb.combo_id)
FROM combo_bookings cb
WHERE cb.booking_code LIKE 'CBK%'
  AND NOT EXISTS (
      SELECT 1 FROM order_items oi
      WHERE oi.order_id = cb.order_id
        AND oi.item_type = 'combo_booking'
        AND oi.item_ref_id = cb.id
  );


-- E4) Dong bo order status/payment_status theo booking moi
UPDATE orders o
JOIN hotel_bookings hb ON hb.order_id = o.id AND hb.booking_code LIKE 'HBK%'
SET
    o.status = CASE
        WHEN hb.payment_status = 'paid' AND hb.status IN ('confirmed', 'completed') THEN 'paid'
        WHEN hb.payment_status = 'refunded' THEN 'refunded'
        WHEN hb.payment_status = 'failed' THEN 'cancelled'
        WHEN hb.status = 'expired' THEN 'expired'
        ELSE 'pending_payment'
    END,
    o.payment_status = CASE
        WHEN hb.payment_status = 'paid' THEN 'paid'
        WHEN hb.payment_status = 'failed' THEN 'failed'
        WHEN hb.payment_status = 'refunded' THEN 'refunded'
        ELSE 'unpaid'
    END,
    o.completed_at = CASE WHEN hb.status = 'completed' THEN hb.completed_at ELSE o.completed_at END,
    o.cancelled_at = CASE WHEN hb.status = 'cancelled' THEN hb.cancelled_at ELSE o.cancelled_at END;


UPDATE orders o
JOIN flight_bookings fb ON fb.order_id = o.id AND fb.booking_code LIKE 'FBK%'
SET
    o.status = CASE
        WHEN fb.payment_status = 'paid' AND fb.status IN ('confirmed', 'completed') THEN 'paid'
        WHEN fb.payment_status = 'refunded' THEN 'refunded'
        WHEN fb.payment_status = 'failed' THEN 'cancelled'
        WHEN fb.status = 'expired' THEN 'expired'
        ELSE 'pending_payment'
    END,
    o.payment_status = CASE
        WHEN fb.payment_status = 'paid' THEN 'paid'
        WHEN fb.payment_status = 'failed' THEN 'failed'
        WHEN fb.payment_status = 'refunded' THEN 'refunded'
        ELSE 'unpaid'
    END,
    o.completed_at = CASE WHEN fb.status = 'completed' THEN fb.completed_at ELSE o.completed_at END,
    o.cancelled_at = CASE WHEN fb.status = 'cancelled' THEN fb.cancelled_at ELSE o.cancelled_at END;


UPDATE orders o
JOIN combo_bookings cb ON cb.order_id = o.id AND cb.booking_code LIKE 'CBK%'
SET
    o.status = CASE
        WHEN cb.payment_status = 'paid' AND cb.status IN ('confirmed', 'completed') THEN 'paid'
        WHEN cb.payment_status = 'refunded' THEN 'refunded'
        WHEN cb.payment_status = 'failed' THEN 'cancelled'
        WHEN cb.status = 'expired' THEN 'expired'
        ELSE 'pending_payment'
    END,
    o.payment_status = CASE
        WHEN cb.payment_status = 'paid' THEN 'paid'
        WHEN cb.payment_status = 'failed' THEN 'failed'
        WHEN cb.payment_status = 'refunded' THEN 'refunded'
        ELSE 'unpaid'
    END,
    o.completed_at = CASE WHEN cb.status = 'completed' THEN cb.completed_at ELSE o.completed_at END,
    o.cancelled_at = CASE WHEN cb.status = 'cancelled' THEN cb.cancelled_at ELSE o.cancelled_at END;


SET FOREIGN_KEY_CHECKS = 1;
