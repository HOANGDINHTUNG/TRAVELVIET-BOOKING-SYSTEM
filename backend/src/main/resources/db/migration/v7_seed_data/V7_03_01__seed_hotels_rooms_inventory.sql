SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- V7_03A__seed_hotels_rooms_inventory.sql
-- Dữ liệu khách sạn: amenities, hotels, room types, inventory, images.
-- ============================================================

-- HOTELS / VEHICLES
INSERT IGNORE INTO hotels (
    id, supplier_id, code, name, star_rating, phone, email, province, district, address,
    latitude, longitude, checkin_time, checkout_time, status
) VALUES
(1,1,'HOTEL-DN-001','TravelViet Hotel Danang',4.0,'+842363333333','booking@hotel.local','Đà Nẵng','Hải Châu','Trung tâm Hải Châu',16.06778,108.22083,'14:00','12:00','active');


INSERT INTO hotel_amenities (code, name, icon, category, is_active)
VALUES
    ('wifi', 'Wi-Fi', 'wifi', 'connectivity', TRUE),
    ('breakfast', 'Breakfast Included', 'coffee', 'food', TRUE),
    ('pool', 'Swimming Pool', 'waves', 'leisure', TRUE),
    ('gym', 'Fitness Center', 'dumbbell', 'wellness', TRUE),
    ('airport_shuttle', 'Airport Shuttle', 'bus', 'transport', TRUE)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    icon = VALUES(icon),
    category = VALUES(category),
    is_active = VALUES(is_active);


INSERT INTO hotels (
    supplier_id, destination_id, code, name, slug, description, star_rating, review_score, phone, email,
    province, district, address, latitude, longitude, checkin_time, checkout_time, status
)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 300
),
dest_pool AS (
    SELECT id,
           province,
           district,
           ROW_NUMBER() OVER (ORDER BY id) AS rn,
           COUNT(*) OVER () AS total
    FROM destinations
    WHERE deleted_at IS NULL
)
SELECT
    NULL,
    dp.id,
    CONCAT('HTL', LPAD(n, 4, '0')) AS code,
    CONCAT(
        CASE MOD(n, 10)
            WHEN 0 THEN 'Grand'
            WHEN 1 THEN 'Royal'
            WHEN 2 THEN 'Sunset'
            WHEN 3 THEN 'Ocean'
            WHEN 4 THEN 'Heritage'
            WHEN 5 THEN 'Lotus'
            WHEN 6 THEN 'Riverside'
            WHEN 7 THEN 'Palm'
            WHEN 8 THEN 'Imperial'
            ELSE 'Garden'
        END,
        ' ',
        CASE MOD(n, 8)
            WHEN 0 THEN 'Hotel'
            WHEN 1 THEN 'Resort'
            WHEN 2 THEN 'Suites'
            WHEN 3 THEN 'Boutique'
            WHEN 4 THEN 'Grand Hotel'
            WHEN 5 THEN 'Collection'
            WHEN 6 THEN 'Retreat'
            ELSE 'Palace'
        END,
        ' ',
        COALESCE(NULLIF(dp.province, ''), CONCAT('Khu ', dp.id))
    ) AS name,
    CONCAT(
        'khach-san-',
        REPLACE(LOWER(COALESCE(NULLIF(dp.province, ''), CONCAT('khu-', dp.id))), ' ', '-'),
        '-',
        LPAD(n, 3, '0')
    ) AS slug,
    CONCAT(
        'Co so luu tru tieu chuan ',
        ((n - 1) % 5) + 1,
        ' sao, phu hop nghi duong va cong tac tai ',
        COALESCE(NULLIF(dp.province, ''), 'dia phuong du lich'),
        '.'
    ),
    CAST((((n - 1) % 5) + 1) AS DECIMAL(2,1)),
    CAST(3.50 + ((n % 15) * 0.10) AS DECIMAL(3,2)),
    CONCAT('09', LPAD(70000000 + n, 8, '0')),
    CONCAT('hotel', LPAD(n, 3, '0'), '@travelviet.vn'),
    COALESCE(dp.province, CONCAT('Province ', n)),
    COALESCE(dp.district, CONCAT('District ', n)),
    CONCAT(
        CASE MOD(n, 6)
            WHEN 0 THEN '12 Tran Hung Dao'
            WHEN 1 THEN '88 Nguyen Hue'
            WHEN 2 THEN '45 Vo Nguyen Giap'
            WHEN 3 THEN '102 Le Loi'
            WHEN 4 THEN '27 Bach Dang'
            ELSE '61 Hai Ba Trung'
        END,
        ', ',
        COALESCE(dp.district, 'Trung tam')
    ),
    9.0000000 + (n * 0.0400000),
    103.0000000 + (n * 0.0600000),
    '14:00:00',
    '12:00:00',
    'active'
FROM seq s
JOIN dest_pool dp
  ON dp.rn = MOD(s.n - 1, dp.total) + 1
ON DUPLICATE KEY UPDATE
    destination_id = VALUES(destination_id),
    name = VALUES(name),
    slug = VALUES(slug),
    description = VALUES(description),
    star_rating = VALUES(star_rating),
    review_score = VALUES(review_score),
    phone = VALUES(phone),
    email = VALUES(email),
    province = VALUES(province),
    district = VALUES(district),
    address = VALUES(address),
    latitude = VALUES(latitude),
    longitude = VALUES(longitude),
    checkin_time = VALUES(checkin_time),
    checkout_time = VALUES(checkout_time),
    status = VALUES(status);


-- 4) moi hotel tao 5 room types => ~1000 phòng
INSERT INTO hotel_room_types (
    hotel_id, code, name, bed_type, max_adults, max_children, max_occupancy,
    base_price, currency, inventory_total, is_refundable, status
)
SELECT
    h.id,
    CONCAT('RT-', h.id, '-', t.seq_no),
    CASE t.seq_no
        WHEN 1 THEN CONCAT('Standard ', h.name)
        WHEN 2 THEN CONCAT('Deluxe ', h.name)
        WHEN 3 THEN CONCAT('Executive ', h.name)
        WHEN 4 THEN CONCAT('Suite ', h.name)
        ELSE CONCAT('Family ', h.name)
    END,
    CASE t.seq_no
        WHEN 1 THEN 'queen'
        WHEN 4 THEN 'king'
        WHEN 5 THEN 'double_queen'
        ELSE 'king'
    END,
    CASE t.seq_no
        WHEN 1 THEN 2
        WHEN 2 THEN 2
        WHEN 3 THEN 2
        WHEN 4 THEN 3
        ELSE 4
    END,
    CASE t.seq_no
        WHEN 1 THEN 1
        WHEN 2 THEN 1
        WHEN 3 THEN 2
        WHEN 4 THEN 2
        ELSE 3
    END,
    CASE t.seq_no
        WHEN 1 THEN 3
        WHEN 2 THEN 3
        WHEN 3 THEN 4
        WHEN 4 THEN 5
        ELSE 7
    END,
    CASE t.seq_no
        WHEN 1 THEN CAST((900000 + (h.id * 1000)) AS DECIMAL(14,2))
        WHEN 2 THEN CAST((1500000 + (h.id * 1500)) AS DECIMAL(14,2))
        WHEN 3 THEN CAST((2200000 + (h.id * 2000)) AS DECIMAL(14,2))
        WHEN 4 THEN CAST((3800000 + (h.id * 3000)) AS DECIMAL(14,2))
        ELSE CAST((4500000 + (h.id * 4000)) AS DECIMAL(14,2))
    END,
    'VND',
    CASE t.seq_no
        WHEN 1 THEN 20 + MOD(h.id, 15)
        WHEN 2 THEN 15 + MOD(h.id, 10)
        WHEN 3 THEN 10 + MOD(h.id, 5)
        WHEN 4 THEN 5
        ELSE 3
    END,
    CASE t.seq_no
        WHEN 4 THEN FALSE
        WHEN 5 THEN FALSE
        ELSE TRUE
    END,
    'active'
FROM hotels h
JOIN (
    SELECT 1 AS seq_no
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
    UNION ALL SELECT 5
) t
WHERE h.code LIKE 'HTL%'
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    bed_type = VALUES(bed_type),
    max_adults = VALUES(max_adults),
    max_children = VALUES(max_children),
    max_occupancy = VALUES(max_occupancy),
    base_price = VALUES(base_price),
    currency = VALUES(currency),
    inventory_total = VALUES(inventory_total),
    is_refundable = VALUES(is_refundable),
    status = VALUES(status);


-- 5) inventory 15 ngay toi cho moi room type => da dang availability
-- Tach 2 buoc (INSERT IGNORE + UPDATE JOIN) de tuong thich parser MySQL/Flyway on all envs.
INSERT IGNORE INTO hotel_room_inventory (
    room_type_id, stay_date, allotment, booked_qty, available_qty, price_override
)
WITH RECURSIVE day_seq AS (
    SELECT 0 AS d
    UNION ALL
    SELECT d + 1 FROM day_seq WHERE d < 14
)
SELECT
    rt.id,
    DATE_ADD(CURDATE(), INTERVAL ds.d DAY) AS stay_date,
    rt.inventory_total AS allotment,
    MOD(rt.id + ds.d, 5) AS booked_qty,
    GREATEST(rt.inventory_total - MOD(rt.id + ds.d, 5), 0) AS available_qty,
    CAST(rt.base_price + (MOD(rt.id + ds.d, 7) * 50000) AS DECIMAL(14,2))
FROM hotel_room_types rt
CROSS JOIN day_seq ds;


UPDATE hotel_room_inventory hri
JOIN hotel_room_types rt ON rt.id = hri.room_type_id
SET
    hri.allotment = rt.inventory_total,
    hri.booked_qty = MOD(rt.id + DATEDIFF(hri.stay_date, CURDATE()), 5),
    hri.available_qty = GREATEST(rt.inventory_total - MOD(rt.id + DATEDIFF(hri.stay_date, CURDATE()), 5), 0),
    hri.price_override = CAST(rt.base_price + (MOD(rt.id + DATEDIFF(hri.stay_date, CURDATE()), 7) * 50000) AS DECIMAL(14,2))
WHERE hri.stay_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 14 DAY);


-- 6) hotel images, moi hotel 2 anh => ~400
INSERT INTO hotel_images (hotel_id, media_url, alt_text, sort_order, is_cover, is_active)
SELECT
    h.id,
    CONCAT('https://cdn.travelviet.vn/hotels/', h.id, '/img-', p.pos, '.jpg'),
    CONCAT('Hotel ', h.name, ' image ', p.pos),
    p.pos - 1,
    (p.pos = 1),
    TRUE
FROM hotels h
JOIN (
    SELECT 1 AS pos
    UNION ALL
    SELECT 2
) p
WHERE h.code LIKE 'HTL%'
ON DUPLICATE KEY UPDATE
    media_url = VALUES(media_url),
    alt_text = VALUES(alt_text),
    sort_order = VALUES(sort_order),
    is_cover = VALUES(is_cover),
    is_active = VALUES(is_active);


-- 7) map amenities cho hotels: moi hotel 4 amenity
INSERT IGNORE INTO hotel_amenity_mappings (hotel_id, amenity_id, created_at)
SELECT
    h.id,
    ha.id,
    CURRENT_TIMESTAMP
FROM hotels h
JOIN hotel_amenities ha
  ON MOD(ha.id + h.id, 5) IN (0, 1, 2, 3)
WHERE h.code LIKE 'HTL%';


SET FOREIGN_KEY_CHECKS = 1;
