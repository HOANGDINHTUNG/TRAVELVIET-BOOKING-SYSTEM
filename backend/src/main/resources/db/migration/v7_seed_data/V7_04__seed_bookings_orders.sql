SET FOREIGN_KEY_CHECKS = 0;
INSERT INTO promotion_campaigns (
    code, name, description, image_url, image_alt, display_title, display_subtitle,
    badge_text, cta_label, cta_url, sort_order, is_featured, start_at, end_at,
    target_member_level, conditions_json, reward_json, is_active
) VALUES
('TEAMBUILDING_SUMMER_2026','Du lịch team building mùa hè 2026','Gói ưu đãi cho doanh nghiệp đặt tour đoàn hè, phù hợp chương trình gắn kết và gala dinner.','https://res.cloudinary.com/dmzvum1lp/image/upload/v1778944947/bn_260507_cham-series-moi-2_lmum6g.webp','Đoàn khách tham gia hoạt động team building ngoài trời','Du lịch — Teambuilding — Gala','Chương trình hè trọn gói cho doanh nghiệp từ 30 khách.','Ưu đãi doanh nghiệp','Xem ưu đãi','/promotions/TEAMBUILDING_SUMMER_2026',1,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 DAY),'silver',JSON_OBJECT('minGuests', 30, 'applicableScope', 'corporate_group', 'advanceBookingDays', 14),JSON_OBJECT('type', 'percentage_discount', 'value', 12, 'maxDiscountAmount', 5000000),TRUE),
('COMPANY_TRIP_2026','Cả công ty cùng đi','Khuyến mãi tour đoàn lớn cho công ty tổ chức du lịch nghỉ dưỡng, hội nghị và gala cuối năm.','https://res.cloudinary.com/dmzvum1lp/image/upload/v1778944948/bn_260507_framehe2026tnn_ymdbnv.webp','Nhóm nhân viên công ty cùng tham gia chuyến đi','Cả công ty cùng đi','Gói tour trọn gói cho đoàn 50 đến 1000 khách.','Tour đoàn lớn','Nhận tư vấn','/promotions/COMPANY_TRIP_2026',2,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 120 DAY),'gold',JSON_OBJECT('minGuests', 50, 'applicableScope', 'company_trip', 'includesGala', true),JSON_OBJECT('type', 'fixed_amount_discount', 'value', 3000000, 'gift', 'Free gala backdrop'),TRUE),
('FAMILY_CONNECT_2026','Hành trình gắn kết gia đình','Ưu đãi cho gia đình và nhóm bạn đặt tour nghỉ dưỡng, miễn phí tư vấn lịch trình riêng.','https://res.cloudinary.com/dmzvum1lp/image/upload/v1778944947/bn_260507_bn260505resize-banner-tour-nuoc-ngoai_ytjwfp.webp','Gia đình nghỉ dưỡng trên bãi biển','Hành trình gắn kết','Giảm giá cho nhóm gia đình từ 6 khách trở lên.','Gia đình','Đặt tour ngay','/promotions/FAMILY_CONNECT_2026',3,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 75 DAY),'bronze',JSON_OBJECT('minGuests', 6, 'applicableScope', 'family_group', 'advanceBookingDays', 7),JSON_OBJECT('type', 'cashback', 'value', 500000, 'voucherForNextTrip', true),TRUE),
('AUTUMN_VIBE_2026', 'Mùa thu vàng - Chạm khẽ hương thu', 'Giảm giá sâu cho các tour Tây Bắc mùa lúa chín và Hà Nội mùa thu.', 'https://res.cloudinary.com/dmzvum1lp/image/upload/v1778944947/bn_260507_cham-series-moi_ts7mic.webp', 'Cánh đồng lúa chín vàng óng', 'Mùa Thu Vàng', 'Giảm tới 15% tour Tây Bắc.', 'Mùa thu', 'Khám phá ngay', '/promotions/AUTUMN_VIBE_2026', 4, TRUE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 DAY), 'bronze', JSON_OBJECT('region', 'North', 'minPurchase', 2000000), JSON_OBJECT('type', 'percentage', 'value', 15), TRUE),
('HONEYMOON_PARADISE', 'Kỳ nghỉ thiên đường cho cặp đôi', 'Tặng gói trang trí phòng lãng mạn và bữa tối dưới ánh nến.', 'https://res.cloudinary.com/dmzvum1lp/image/upload/v1778944947/bn_260506_duthuyenhongkong_eqtucw.webp', 'Bữa tối lãng mạn ven biển', 'Trăng Mật Ngọt Ngào', 'Tặng bữa tối Steak & Wine.', 'Cặp đôi', 'Xem chi tiết', '/promotions/HONEYMOON_PARADISE', 5, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'silver', JSON_OBJECT('minGuests', 2, 'tourType', 'honeymoon'), JSON_OBJECT('gift', 'Romantic Dinner', 'service', 'Room Decor'), TRUE),
('EARLY_BIRD_WINTER', 'Đặt sớm đón đông - Giá hời bất tận', 'Ưu đãi dành cho khách hàng đặt tour mùa đông trước 60 ngày.', 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1200&q=80', 'Đỉnh núi tuyết phủ trắng', 'Đặt Sớm Giá Tốt', 'Ưu đãi 20% khi đặt trước 2 tháng.', 'Đặt sớm', 'Nhận ưu đãi', '/promotions/EARLY_BIRD_WINTER', 6, TRUE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY), 'bronze', JSON_OBJECT('advanceDays', 60), JSON_OBJECT('type', 'percentage', 'value', 20), TRUE),
('BLACK_FRIDAY_2026', 'Black Friday - Bùng nổ giá sàn', 'Săn deal tour đồng giá chỉ từ 999k duy nhất trong tuần lễ vàng.', 'https://images.unsplash.com/photo-1540959733332-e9ab65c8a681?auto=format&fit=crop&w=1200&q=80', 'Biển hiệu Neon Black Friday', 'Siêu Sale Cuối Năm', 'Đồng giá tour 999k.', 'Hot Sale', 'Săn Deal', '/promotions/BLACK_FRIDAY_2026', 7, TRUE, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY), 'bronze', JSON_OBJECT('minPurchase', 0), JSON_OBJECT('type', 'flash_sale', 'price', 999000), TRUE),
('DIAMOND_EXCLUSIVE_2026', 'Đẳng cấp Diamond - Đặc quyền thượng lưu', 'Dịch vụ xe Limousine đưa đón tận nhà và phòng chờ thương gia.', 'https://images.unsplash.com/photo-1540552989939-688039ba3bb9?auto=format&fit=crop&w=1200&q=80', 'Xe Limousine sang trọng', 'Đặc Quyền Diamond', 'Miễn phí nâng hạng phòng 5 sao.', 'VIP Only', 'Khám phá đặc quyền', '/promotions/DIAMOND_EXCLUSIVE_2026', 8, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 365 DAY), 'platinum', JSON_OBJECT('memberLevel', 'diamond'), JSON_OBJECT('upgrade', 'Room 5 Star', 'transport', 'Limousine'), TRUE),
('TET_REUNION_2027', 'Tết sum vầy - Du xuân như ý', 'Chương trình tour Tết đặc sắc dành cho gia đình đa thế hệ.', 'https://images.unsplash.com/photo-1583244532610-2ca27017009a?auto=format&fit=crop&w=1200&q=80', 'Hoa mai vàng nở rộ', 'Du Xuân Giáp Ngọ', 'Lì xì ngay 500k cho mỗi khách.', 'Tết sum vầy', 'Xem tour Tết', '/promotions/TET_REUNION_2027', 9, TRUE, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 120 DAY), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 150 DAY), 'bronze', JSON_OBJECT('minGuests', 4), JSON_OBJECT('type', 'cash', 'value', 500000), TRUE),
('FLASH_SALE_1212', 'Siêu sale 12.12 - Giờ vàng giá sốc', 'Chỉ diễn ra trong khung giờ 12h-13h ngày 12/12.', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80', 'Đồng hồ đếm ngược Flash Sale', 'Giờ Vàng 12.12', 'Giảm trực tiếp 1.212.000đ.', 'Chỉ 1 giờ', 'Săn ngay', '/promotions/FLASH_SALE_1212', 10, FALSE, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY), 'silver', JSON_OBJECT('minPurchase', 5000000), JSON_OBJECT('type', 'fixed', 'value', 1212000), TRUE),
('MEKONG_STORY_2026', 'Hương sắc Miền Tây', 'Giảm giá cho các tour về miền sông nước Cần Thơ, An Giang.', 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', 'Thuyền chở hoa trên sông', 'Về Miền Tây', 'Tặng nón lá và khăn rằn cho đoàn.', 'Sông nước', 'Đặt tour', '/promotions/MEKONG_STORY_2026', 11, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY), 'bronze', JSON_OBJECT('region', 'South'), JSON_OBJECT('gift', 'Traditional Scarf'), TRUE),
('BEACH_PARTY_VIBE', 'Lễ hội biển Summer Party', 'Miễn phí tiệc nướng BBQ và âm thanh ánh sáng cho đoàn biển.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'Tiệc bãi biển sôi động', 'Beach Party', 'Tặng gói âm thanh ánh sáng đêm Gala.', 'Tiệc biển', 'Nhận tư vấn', '/promotions/BEACH_PARTY_VIBE', 12, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 DAY), 'silver', JSON_OBJECT('minGuests', 20, 'location', 'beach'), JSON_OBJECT('freeService', 'Sound & Light System'), TRUE),
('MID_AUTUMN_FEST', 'Trung thu đoàn viên - Gắn kết yêu thương', 'Tour du lịch kết hợp đêm tiệc trông trăng cho bé.', 'https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?auto=format&fit=crop&w=1200&q=80', 'Đèn lồng trung thu rực rỡ', 'Trung Thu Đoàn Viên', 'Tặng bánh trung thu cao cấp cho mỗi phòng.', 'Lễ hội', 'Xem lịch trình', '/promotions/MID_AUTUMN_FEST', 13, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY), 'bronze', JSON_OBJECT('includesChildren', true), JSON_OBJECT('gift', 'Mooncake Box'), TRUE),
('GLOBAL_EXPLORER', 'Bay ra thế giới - Ưu đãi hoàn tiền', 'Hoàn tiền 1 triệu đồng cho các tour Thái Lan, Nhật Bản, Hàn Quốc.', 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1200&q=80', 'Máy bay trên bầu trời', 'Bay Ra Thế Giới', 'Hoàn tiền 1.000.000đ khi thanh toán thẻ.', 'Quốc tế', 'Săn tour ngay', '/promotions/GLOBAL_EXPLORER', 14, TRUE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 DAY), 'gold', JSON_OBJECT('type', 'International'), JSON_OBJECT('cashback', 1000000), TRUE),
('WELLNESS_RETREAT', 'Nghỉ dưỡng Wellness - Tái tạo năng lượng', 'Giảm 30% gói Spa và Thiền tại các resort nghỉ dưỡng.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', 'Phòng thiền yên tĩnh', 'Wellness Retreat', 'Tặng gói Spa trị liệu 60 phút.', 'Sức khỏe', 'Trải nghiệm', '/promotions/WELLNESS_RETREAT', 15, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY), 'silver', JSON_OBJECT('service', 'Spa'), JSON_OBJECT('discount', '30% Spa'), TRUE),
('STUDENT_ADVENTURE', 'Hè rực rỡ - Nhóm bạn đi xa', 'Ưu đãi dành riêng cho học sinh sinh viên đi phượt nhóm.', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80', 'Nhóm bạn trẻ đi du lịch', 'Hè Cùng Nhóm Bạn', 'Giảm 200k/khách cho nhóm từ 5 bạn.', 'Sinh viên', 'Đăng ký ngay', '/promotions/STUDENT_ADVENTURE', 16, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 DAY), 'bronze', JSON_OBJECT('minGuests', 5, 'requireStudentCard', true), JSON_OBJECT('value', 200000), TRUE),
('BIRTHDAY_GIFT_2026', 'Chúc mừng sinh nhật khách hàng', 'Món quà tri ân dành cho khách hàng có sinh nhật trong tháng.', 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80', 'Bánh sinh nhật và nến', 'Mừng Sinh Nhật Bạn', 'Tặng Voucher giảm giá 1.000.000đ.', 'Happy Birthday', 'Nhận quà', '/promotions/BIRTHDAY_GIFT_2026', 17, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 365 DAY), 'bronze', JSON_OBJECT('isBirthdayMonth', true), JSON_OBJECT('voucherValue', 1000000), TRUE),
('APP_EXCLUSIVE_DEAL', 'Tải App ngay - Nhận Deal liền tay', 'Giảm giá 5% cho tất cả tour khi đặt qua ứng dụng di động.', 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80', 'Người dùng sử dụng điện thoại', 'Ưu Đãi Trên App', 'Giảm 5% không giới hạn tối đa.', 'App Only', 'Tải App', '/promotions/APP_EXCLUSIVE_DEAL', 18, TRUE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 365 DAY), 'bronze', JSON_OBJECT('platform', 'MobileApp'), JSON_OBJECT('percentage', 5), TRUE),
('PILGRIMAGE_PEACE', 'Hành trình tâm linh - Tìm về an yên', 'Tour viếng chùa đầu năm và các thánh địa tôn giáo.', 'https://images.unsplash.com/photo-1548013146-72479768b921?auto=format&fit=crop&w=1200&q=80', 'Ngôi chùa cổ kính trong sương', 'Hành Trình Tâm Linh', 'Miễn phí ăn chay cho cả đoàn.', 'Tâm linh', 'Xem tour', '/promotions/PILGRIMAGE_PEACE', 19, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 DAY), 'bronze', JSON_OBJECT('tourCategory', 'Religious'), JSON_OBJECT('freeService', 'Vegetarian Meal'), TRUE),
('NORTHEAST_DISCOVERY', 'Khám phá Đông Bắc hùng vĩ', 'Ưu đãi cho tour Cao Bằng, Bắc Kạn, Lạng Sơn.', 'https://images.unsplash.com/photo-1631522304910-c116d8a3917d?auto=format&fit=crop&w=1200&q=80', 'Thác Bản Giốc hùng vĩ', 'Đông Bắc Hùng Vĩ', 'Tặng áo cờ đỏ sao vàng cho đoàn.', 'Đông Bắc', 'Khám phá', '/promotions/NORTHEAST_DISCOVERY', 20, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 DAY), 'bronze', JSON_OBJECT('region', 'NorthEast'), JSON_OBJECT('gift', 'Vietnam Flag Shirt'), TRUE)

ON DUPLICATE KEY UPDATE 
    description=VALUES(description), 
    image_url=VALUES(image_url), 
    image_alt=VALUES(image_alt), 
    display_title=VALUES(display_title), 
    display_subtitle=VALUES(display_subtitle), 
    badge_text=VALUES(badge_text), 
    cta_label=VALUES(cta_label), 
    cta_url=VALUES(cta_url), 
    sort_order=VALUES(sort_order), 
    is_featured=VALUES(is_featured), 
    start_at=VALUES(start_at), 
    end_at=VALUES(end_at), 
    target_member_level=VALUES(target_member_level), 
    conditions_json=VALUES(conditions_json), 
    reward_json=VALUES(reward_json), 
    is_active=VALUES(is_active);


INSERT INTO combo_packages (
    code, name, description, destination_id, combo_type, base_price,
    discount_type, discount_value, discount_amount, pricing_rule_json,
    start_at, end_at, is_active
)
WITH RECURSIVE seq AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM seq WHERE n < 300
),
dest_pool AS (
    SELECT id,
           province,
           ROW_NUMBER() OVER (ORDER BY id) AS rn,
           COUNT(*) OVER () AS total
    FROM destinations
    WHERE deleted_at IS NULL
)
SELECT
    CONCAT('CMB', LPAD(s.n, 4, '0')) AS code,
    CONCAT(
        CASE MOD(s.n, 6)
            WHEN 0 THEN 'Combo Nghi duong'
            WHEN 1 THEN 'Combo Kham pha'
            WHEN 2 THEN 'Combo Gia dinh'
            WHEN 3 THEN 'Combo Cuoi tuan'
            WHEN 4 THEN 'Combo Tiet kiem'
            ELSE 'Combo Premium'
        END,
        ' ',
        COALESCE(NULLIF(dp.province, ''), CONCAT('Diem den ', dp.id))
    ) AS name,
    CONCAT(
        'Goi ket hop dich vu di chuyen, luu tru va trai nghiem tai ',
        COALESCE(NULLIF(dp.province, ''), CONCAT('destination #', dp.id)),
        ', toi uu tong chi phi so voi mua le.'
    ),
    dp.id,
    CASE MOD(s.n, 3)
        WHEN 0 THEN 'tour_hotel'
        WHEN 1 THEN 'flight_hotel'
        ELSE 'custom'
    END,
    CAST(3500000 + MOD(s.n * 215000, 12000000) AS DECIMAL(14,2)),
    CASE MOD(s.n, 2)
        WHEN 0 THEN 'percentage'
        ELSE 'fixed_amount'
    END,
    CASE MOD(s.n, 2)
        WHEN 0 THEN CAST(8 + MOD(s.n, 18) AS DECIMAL(14,2))
        ELSE CAST(250000 + MOD(s.n * 50000, 1200000) AS DECIMAL(14,2))
    END,
    CAST(0 AS DECIMAL(14,2)),
    JSON_OBJECT(
        'bundle_tier', CONCAT('tier_', MOD(s.n, 5) + 1),
        'allow_stack_voucher', MOD(s.n, 2) = 0,
        'season', CASE WHEN MOD(s.n, 4) IN (0, 1) THEN 'peak' ELSE 'offpeak' END
    ),
    DATE_ADD(CURDATE(), INTERVAL -10 DAY),
    DATE_ADD(CURDATE(), INTERVAL 365 DAY),
    TRUE
FROM seq s
JOIN dest_pool dp
  ON dp.rn = MOD(s.n - 1, dp.total) + 1
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    destination_id = VALUES(destination_id),
    combo_type = VALUES(combo_type),
    base_price = VALUES(base_price),
    discount_type = VALUES(discount_type),
    discount_value = VALUES(discount_value),
    pricing_rule_json = VALUES(pricing_rule_json),
    start_at = VALUES(start_at),
    end_at = VALUES(end_at),
    is_active = VALUES(is_active);


-- 11) dong bo discount_amount tu discount_type + discount_value
UPDATE combo_packages c
SET c.discount_amount = CASE
    WHEN c.discount_type = 'percentage'
        THEN ROUND(c.base_price * c.discount_value / 100, 2)
    ELSE c.discount_value
END
WHERE c.code LIKE 'CMB%';


-- 12) tao combo items lien ket chéo:
-- - 1 item room_type
-- - 1 item flight_class
-- - 1 item tour (neu co)
INSERT INTO combo_package_items (
    combo_id, item_type, item_ref_id, item_name, quantity,
    unit_price, unit_price_snapshot, is_mandatory, sort_order, created_at
)
SELECT
    c.id,
    src.item_type,
    src.item_ref_id,
    src.item_name,
    1,
    src.unit_price,
    src.unit_price,
    TRUE,
    src.sort_order,
    CURRENT_TIMESTAMP
FROM combo_packages c
JOIN (
    -- room_type
    SELECT
        cp.id AS combo_id,
        'room_type' AS item_type,
        ANY_VALUE(rt.id) AS item_ref_id,
        CONCAT('RoomType #', ANY_VALUE(rt.id)) AS item_name,
        ANY_VALUE(rt.base_price) AS unit_price,
        1 AS sort_order
    FROM combo_packages cp
    JOIN hotels h ON h.destination_id = cp.destination_id
    JOIN hotel_room_types rt ON rt.hotel_id = h.id
    WHERE cp.code LIKE 'CMB%'
    GROUP BY cp.id
    UNION ALL
    -- flight_class
    SELECT
        cp.id AS combo_id,
        'flight_class' AS item_type,
        ANY_VALUE(fc.id) AS item_ref_id,
        CONCAT('FlightClass #', ANY_VALUE(fc.id)) AS item_name,
        (ANY_VALUE(fc.base_price) + ANY_VALUE(fc.tax_amount)) AS unit_price,
        2 AS sort_order
    FROM combo_packages cp
    JOIN airports ap ON ap.destination_id = cp.destination_id
    JOIN flights f ON f.destination_airport_id = ap.id OR f.origin_airport_id = ap.id
    JOIN flight_classes fc ON fc.flight_id = f.id AND fc.cabin_class = 'economy'
    WHERE cp.code LIKE 'CMB%'
    GROUP BY cp.id
    UNION ALL
    -- tour
    SELECT
        cp.id AS combo_id,
        'tour' AS item_type,
        ANY_VALUE(t.id) AS item_ref_id,
        CONCAT('Tour #', ANY_VALUE(t.id)) AS item_name,
        ANY_VALUE(t.base_price) AS unit_price,
        3 AS sort_order
    FROM combo_packages cp
    JOIN tour_destinations td ON td.destination_id = cp.destination_id
    JOIN tours t ON t.id = td.tour_id AND t.deleted_at IS NULL
    WHERE cp.code LIKE 'CMB%'
    GROUP BY cp.id
) src ON src.combo_id = c.id
WHERE c.code LIKE 'CMB%'
  AND NOT EXISTS (
      SELECT 1
      FROM combo_package_items ex
      WHERE ex.combo_id = c.id
        AND ex.item_type = src.item_type
        AND (
            (ex.item_ref_id IS NULL AND src.item_ref_id IS NULL)
            OR ex.item_ref_id = src.item_ref_id
        )
  );


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
    DATE_ADD(CURDATE(), INTERVAL MOD(s.n, 45) DAY),
    CASE WHEN MOD(s.n, 3) = 0 THEN 'round_trip' ELSE 'one_way' END,
    NULL,
    NULL,
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
    'Uu tien ghe gan loi di'
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


-- E6) Seed lich su trang thai (2-3 moc su kien)






























-- =====================================================================
-- 08_VOUCHERS_ORDERS_BOOKINGS - Voucher, đơn hàng, booking
-- =====================================================================

INSERT IGNORE INTO vouchers (
    id, code, name, description, discount_type, discount_value, max_discount_amount,
    min_order_value, usage_limit_total, usage_limit_per_user, start_at, end_at,
    applicable_scope, applicable_member_level, is_active
) VALUES
(5,'SPRING10','Spring 10','Giảm 10% cho đơn từ 1.000.000','percentage',10,150000,
1000000,1000,2,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 DAY),
'all','bronze',TRUE);


INSERT IGNORE INTO voucher_user_claims (
    id, voucher_id, user_id, claimed_at, used_count
) VALUES
(9,5,'550e8400-e29b-41d4-a716-446655440001',CURRENT_TIMESTAMP,0);


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


-- VOUCHER REDEMPTIONS
INSERT IGNORE INTO voucher_redemptions (id, voucher_id, user_id, order_id, booking_id, redeemed_amount, status, redeemed_at, note)
VALUES (1,5,'550e8400-e29b-41d4-a716-446655440001',42,1,150000,'applied',CURRENT_TIMESTAMP,'Áp dụng voucher cho booking seed');


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





-- =====================================================================
-- 09_PAYMENTS_REFUNDS_INVOICES - Thanh toán, hoàn tiền, hóa đơn, hoa hồng
-- =====================================================================

INSERT IGNORE INTO payments (
    id, payment_code, booking_id, order_id, payment_method, provider, transaction_ref,
    amount, currency, status, paid_at
) VALUES
(1,'PM_SEED_00001',1,42,'gateway','vnpay','VNPAY-SEED-00001',2850000,'VND','paid',CURRENT_TIMESTAMP);


INSERT IGNORE INTO refund_requests (
    id, refund_code, booking_id, requested_by, reason_type, reason_detail, requested_amount,
    refund_method, status, created_at
) VALUES
(1,'RF_SEED_00001',1,'550e8400-e29b-41d4-a716-446655440001','customer','Đổi kế hoạch cá nhân',1000000,
'bank_transfer','requested',CURRENT_TIMESTAMP);


-- PAYMENT ATTEMPTS / WEBHOOK LOGS
INSERT IGNORE INTO payment_attempts (
    id, payment_id, order_id, booking_id, attempt_no, provider, payment_method, status,
    gateway_transaction_ref, gateway_response_code, gateway_message, request_payload, response_payload, started_at, finished_at
) VALUES
(1,1,42,1,1,'vnpay','gateway','paid','VNPAY-SEED-00001','00','Approved',JSON_OBJECT('amount',2850000),JSON_OBJECT('result','paid'),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);


INSERT IGNORE INTO payment_webhook_logs (
    id, provider, event_type, event_ref, order_id, payment_id, booking_id, is_verified, payload, processed_result, received_at, processed_at
) VALUES
(1,'vnpay','payment.paid','VNPAY-SEED-00001',42,1,1,TRUE,JSON_OBJECT('status','paid'),JSON_OBJECT('handled',true),CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);


-- REFUND STATUS HISTORY / TRANSACTIONS
INSERT IGNORE INTO refund_status_history (id, refund_request_id, old_status, new_status, changed_by, note, created_at)
VALUES (1,1,NULL,'requested','550e8400-e29b-41d4-a716-446655440001','Tạo yêu cầu hoàn tiền',CURRENT_TIMESTAMP);


INSERT IGNORE INTO refund_transactions (
    id, refund_request_id, payment_id, provider, transaction_ref, amount, currency, status, response_payload, processed_at
) VALUES
(1,1,1,'bank','RF-TXN-SEED-00001',1000000,'VND','pending',JSON_OBJECT('note','waiting approval'),NULL);


-- INVOICES
INSERT IGNORE INTO invoices (
    id, invoice_no, order_id, booking_id, user_id, invoice_type, billing_name, billing_email, billing_phone, tax_code, billing_address,
    subtotal_amount, tax_amount, final_amount, currency, status, issued_at
) VALUES
(1,'INV-0001',42,1,'550e8400-e29b-41d4-a716-446655440001','personal','Nguyễn Văn An','an.nguyen+seed@gmail.com','+84901234567',NULL,'TP. Hồ Chí Minh',
2850000,0,2850000,'VND','issued',CURRENT_TIMESTAMP);


INSERT IGNORE INTO invoice_items (id, invoice_id, item_name, quantity, unit_price, tax_rate_percent, line_total)
VALUES (1,1,'Tour Đà Nẵng 3N2Đ',1,2850000,0,2850000);


INSERT IGNORE INTO invoice_requests (
    id, order_id, booking_id, user_id, request_type, invoice_type, billing_name, billing_email, billing_phone, tax_code, billing_address,
    status, note, processed_by, processed_at
) VALUES
(1,42,1,'550e8400-e29b-41d4-a716-446655440001','issue','personal','Nguyễn Văn An','an.nguyen+seed@gmail.com','+84901234567',NULL,'TP. Hồ Chí Minh',
'completed','Tạo hóa đơn seed','550e8400-e29b-41d4-a716-446655440000',CURRENT_TIMESTAMP);


-- COMMISSIONS / PAYOUTS
INSERT IGNORE INTO commissions (
    id, source_type, source_ref_id, beneficiary_type, beneficiary_user_id, supplier_id, guide_id,
    commission_type, commission_value, commission_amount, status, note
) VALUES
(1,'booking',1,'guide',NULL,NULL,1,'percentage',5,142500,'approved','Hoa hồng HDV 5% theo booking seed'),
(2,'order',42,'supplier',NULL,1,NULL,'fixed_amount',0,900000,'pending','Chi phí khách sạn theo đơn seed');


INSERT IGNORE INTO partner_payouts (
    id, supplier_id, payout_code, period_from, period_to, gross_amount, deduction_amount, net_amount, status, paid_at, note
) VALUES
(1,1,'PO_SEED_00001',CURRENT_DATE(),CURRENT_DATE(),900000,0,900000,'approved',NULL,'Đề nghị thanh toán đối tác');


INSERT IGNORE INTO guide_payouts (
    id, guide_id, payout_code, schedule_id, amount, status, paid_at, note
) VALUES
(1,1,'GP_SEED_00001',5,142500,'approved',NULL,'Tạm tính payout cho HDV');


-- E7) payments cho don tour legacy co order + paid (dashboard doanh thu)
INSERT INTO payments (
    payment_code, booking_id, order_id, payment_method, provider, transaction_ref,
    amount, currency, status, paid_at, request_payload, response_payload, created_at, updated_at
)
SELECT
    CONCAT('PAY', LPAD(b.id, 8, '0')),
    b.id,
    b.order_id,
    CASE MOD(b.id, 4)
        WHEN 0 THEN 'gateway'
        WHEN 1 THEN 'credit_card'
        WHEN 2 THEN 'qr'
        ELSE 'e_wallet'
    END,
    CASE MOD(b.id, 3)
        WHEN 0 THEN 'vnpay'
        WHEN 1 THEN 'stripe'
        ELSE 'momo'
    END,
    CONCAT('TXN', LPAD(b.id, 10, '0')),
    b.final_amount,
    b.currency,
    CASE
        WHEN b.payment_status = 'paid' THEN 'paid'
        WHEN b.payment_status = 'failed' THEN 'failed'
        WHEN b.payment_status = 'refunded' THEN 'refunded'
        ELSE 'unpaid'
    END,
    CASE WHEN b.payment_status = 'paid' THEN DATE_ADD(b.created_at, INTERVAL 20 MINUTE) ELSE NULL END,
    JSON_OBJECT('source', 'seed_v7', 'booking_type', 'tour'),
    JSON_OBJECT('status', b.payment_status),
    COALESCE(b.created_at, NOW()),
    NOW()
FROM bookings b
WHERE b.order_id IS NOT NULL
  AND b.deleted_at IS NULL
  AND b.payment_status IN ('paid','failed','refunded')
  AND NOT EXISTS (
      SELECT 1
      FROM payments p
      WHERE p.booking_id = b.id
        AND p.order_id = b.order_id
  );


-- E8) payment_attempts cho ca booking moi (hotel/flight/combo) thong qua order
INSERT INTO payment_attempts (
    payment_id, order_id, booking_id, attempt_no, provider, payment_method, status,
    gateway_transaction_ref, gateway_response_code, gateway_message,
    request_payload, response_payload, started_at, finished_at, created_at, updated_at
)
SELECT
    NULL,
    o.id,
    NULL,
    1,
    CASE MOD(o.id, 3)
        WHEN 0 THEN 'vnpay'
        WHEN 1 THEN 'stripe'
        ELSE 'momo'
    END,
    CASE MOD(o.id, 4)
        WHEN 0 THEN 'gateway'
        WHEN 1 THEN 'credit_card'
        WHEN 2 THEN 'qr'
        ELSE 'e_wallet'
    END,
    CASE
        WHEN o.payment_status = 'paid' THEN 'paid'
        WHEN o.payment_status = 'failed' THEN 'failed'
        WHEN o.payment_status = 'refunded' THEN 'refunded'
        ELSE 'pending'
    END,
    CONCAT('ATT', LPAD(o.id, 10, '0')),
    CASE
        WHEN o.payment_status = 'paid' THEN '00'
        WHEN o.payment_status = 'failed' THEN '99'
        ELSE NULL
    END,
    CASE
        WHEN o.payment_status = 'paid' THEN 'Payment success'
        WHEN o.payment_status = 'failed' THEN 'Payment failed'
        WHEN o.payment_status = 'refunded' THEN 'Refunded after payment'
        ELSE 'Pending payment'
    END,
    JSON_OBJECT('source', 'seed_v7', 'order_code', o.order_code),
    JSON_OBJECT('payment_status', o.payment_status),
    DATE_SUB(COALESCE(o.placed_at, NOW()), INTERVAL 10 MINUTE),
    CASE WHEN o.payment_status IN ('paid','failed','refunded') THEN COALESCE(o.placed_at, NOW()) ELSE NULL END,
    NOW(),
    NOW()
FROM orders o
WHERE (o.order_code LIKE 'HORD%' OR o.order_code LIKE 'FORD%' OR o.order_code LIKE 'CORD%')
  AND NOT EXISTS (
      SELECT 1
      FROM payment_attempts pa
      WHERE pa.order_id = o.id
  );


-- E9) payment_webhook_logs cho cac payment da seed
INSERT INTO payment_webhook_logs (
    provider, event_type, event_ref, order_id, payment_id, booking_id,
    is_verified, payload, processed_result, received_at, processed_at
)
SELECT
    COALESCE(p.provider, 'gateway'),
    CASE
        WHEN p.status = 'paid' THEN 'payment.succeeded'
        WHEN p.status = 'failed' THEN 'payment.failed'
        WHEN p.status = 'refunded' THEN 'payment.refunded'
        ELSE 'payment.pending'
    END,
    CONCAT('EVT-', p.payment_code),
    p.order_id,
    p.id,
    p.booking_id,
    TRUE,
    JSON_OBJECT(
        'payment_code', p.payment_code,
        'amount', p.amount,
        'currency', p.currency,
        'status', p.status
    ),
    JSON_OBJECT(
        'mapped_status', p.status,
        'note', 'processed by V7 seed'
    ),
    DATE_ADD(COALESCE(p.created_at, NOW()), INTERVAL 2 MINUTE),
    DATE_ADD(COALESCE(p.created_at, NOW()), INTERVAL 3 MINUTE)
FROM payments p
WHERE p.order_id IS NOT NULL
  AND p.booking_id IS NOT NULL
  AND p.status IN ('paid','failed','refunded')
  AND NOT EXISTS (
      SELECT 1
      FROM payment_webhook_logs wl
      WHERE wl.payment_id = p.id
  );


-- E10) refund_requests gan tu booking bi refunded (end-to-end)
INSERT INTO refund_requests (
    refund_code, booking_id, requested_by, reason_type, reason_detail,
    requested_amount, quoted_amount, approved_amount, voucher_offer_amount,
    refund_method, status, policy_snapshot, processed_by, processed_at, created_at, updated_at
)
SELECT
    CONCAT('RFD', LPAD(b.id, 8, '0')),
    b.id,
    b.user_id,
    CASE MOD(b.id, 4)
        WHEN 0 THEN 'customer_change_plan'
        WHEN 1 THEN 'schedule_change'
        WHEN 2 THEN 'service_issue'
        ELSE 'weather_disruption'
    END,
    CONCAT('Refund request seeded from booking ', b.booking_code),
    b.final_amount,
    b.final_amount,
    b.final_amount,
    0,
    CASE MOD(b.id, 3)
        WHEN 0 THEN 'original_method'
        WHEN 1 THEN 'bank_transfer'
        ELSE 'wallet'
    END,
    'completed',
    JSON_OBJECT(
        'source', 'seed_v7',
        'booking_status', b.status,
        'payment_status', b.payment_status
    ),
    b.user_id,
    DATE_ADD(COALESCE(b.updated_at, NOW()), INTERVAL 1 HOUR),
    COALESCE(b.updated_at, NOW()),
    NOW()
FROM bookings b
WHERE b.deleted_at IS NULL
  AND (b.payment_status = 'refunded' OR b.status = 'refunded')
  AND b.final_amount > 0
  AND NOT EXISTS (
      SELECT 1
      FROM refund_requests rr
      WHERE rr.booking_id = b.id
  );


-- E11) refund_status_history (requested -> approved -> processing -> completed)
INSERT INTO refund_status_history (refund_request_id, old_status, new_status, changed_by, note, created_at)
SELECT
    rr.id,
    NULL,
    'requested',
    rr.requested_by,
    'Refund requested by customer',
    DATE_SUB(rr.created_at, INTERVAL 30 MINUTE)
FROM refund_requests rr
WHERE rr.refund_code LIKE 'RFD%'
  AND NOT EXISTS (
      SELECT 1
      FROM refund_status_history rsh
      WHERE rsh.refund_request_id = rr.id
  );


INSERT INTO refund_status_history (refund_request_id, old_status, new_status, changed_by, note, created_at)
SELECT
    rr.id,
    'requested',
    'approved',
    rr.processed_by,
    'Approved by system seed',
    DATE_SUB(rr.created_at, INTERVAL 20 MINUTE)
FROM refund_requests rr
WHERE rr.refund_code LIKE 'RFD%'
  AND rr.status = 'completed'
  AND NOT EXISTS (
      SELECT 1
      FROM refund_status_history rsh
      WHERE rsh.refund_request_id = rr.id
        AND rsh.old_status = 'requested'
        AND rsh.new_status = 'approved'
  );


INSERT INTO refund_status_history (refund_request_id, old_status, new_status, changed_by, note, created_at)
SELECT
    rr.id,
    'approved',
    'processing',
    rr.processed_by,
    'Refund is processing',
    DATE_SUB(rr.created_at, INTERVAL 10 MINUTE)
FROM refund_requests rr
WHERE rr.refund_code LIKE 'RFD%'
  AND rr.status = 'completed'
  AND NOT EXISTS (
      SELECT 1
      FROM refund_status_history rsh
      WHERE rsh.refund_request_id = rr.id
        AND rsh.old_status = 'approved'
        AND rsh.new_status = 'processing'
  );


INSERT INTO refund_status_history (refund_request_id, old_status, new_status, changed_by, note, created_at)
SELECT
    rr.id,
    'processing',
    'completed',
    rr.processed_by,
    'Refund completed',
    COALESCE(rr.processed_at, rr.updated_at)
FROM refund_requests rr
WHERE rr.refund_code LIKE 'RFD%'
  AND rr.status = 'completed'
  AND NOT EXISTS (
      SELECT 1
      FROM refund_status_history rsh
      WHERE rsh.refund_request_id = rr.id
        AND rsh.old_status = 'processing'
        AND rsh.new_status = 'completed'
  );


-- E12) refund_transactions lien ket payment + refund_request
INSERT INTO refund_transactions (
    refund_request_id, payment_id, provider, transaction_ref, amount, currency,
    status, response_payload, processed_at, created_at, updated_at
)
SELECT
    rr.id,
    p.id,
    COALESCE(p.provider, 'gateway'),
    CONCAT('RTX-', rr.refund_code),
    rr.approved_amount,
    COALESCE(p.currency, 'VND'),
    'completed',
    JSON_OBJECT(
        'refund_code', rr.refund_code,
        'payment_code', p.payment_code,
        'approved_amount', rr.approved_amount
    ),
    COALESCE(rr.processed_at, NOW()),
    rr.created_at,
    NOW()
FROM refund_requests rr
LEFT JOIN payments p
       ON p.booking_id = rr.booking_id
      AND p.order_id = (
          SELECT b.order_id
          FROM bookings b
          WHERE b.id = rr.booking_id
          LIMIT 1
      )
WHERE rr.refund_code LIKE 'RFD%'
  AND rr.status = 'completed'
  AND NOT EXISTS (
      SELECT 1
      FROM refund_transactions rt
      WHERE rt.refund_request_id = rr.id
  );





-- =====================================================================
-- 10_REVIEWS_SUPPORT_NOTIFICATIONS - Đánh giá, hỗ trợ, thông báo, chat
-- =====================================================================

-- REVIEWS
INSERT IGNORE INTO reviews (
    id, booking_id, user_id, tour_id, schedule_id, overall_rating, title, content, sentiment, would_recommend
) VALUES
(1,1,'550e8400-e29b-41d4-a716-446655440001',1,5,5,'Rất hài lòng','Hành trình trọn vẹn, HDV nhiệt tình, đồ ăn ổn.','positive',TRUE);


INSERT IGNORE INTO review_aspects (id, review_id, aspect_name, aspect_rating, comment)
VALUES (1,1,'service',5,'Phục vụ tốt');


INSERT IGNORE INTO review_replies (id, review_id, staff_id, content, created_at)
VALUES (1,1,'550e8400-e29b-41d4-a716-446655440000','Cảm ơn bạn đã tin tưởng TravelViet!',CURRENT_TIMESTAMP);


INSERT IGNORE INTO review_analysis (id, review_id, positive_points, negative_points, keywords, summary, processed_at)
VALUES (1,1,JSON_ARRAY('HDV nhiệt tình','Lịch trình hợp lý'),JSON_ARRAY(),JSON_ARRAY('service','guide','food'),'Trải nghiệm rất tốt, đáng giới thiệu.',CURRENT_TIMESTAMP);


-- NOTIFICATIONS / SUPPORT / CHAT
INSERT IGNORE INTO notifications (
    id, user_id, notification_type, channel, title, body, payload, created_at
) VALUES
(1,'550e8400-e29b-41d4-a716-446655440001','system','in_app','Chào mừng','Chào mừng bạn đến với TravelViet!',JSON_OBJECT('source','seed'),CURRENT_TIMESTAMP);


INSERT IGNORE INTO support_sessions (
    id, session_code, user_id, assigned_staff_id, status, started_at, last_message_at
) VALUES
(1,'SUP_SEED_00001','550e8400-e29b-41d4-a716-446655440001',NULL,'open',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);


INSERT IGNORE INTO support_messages (
    id, session_id, sender_type, sender_user_id, message_text, created_at
) VALUES
(1,1,'customer','550e8400-e29b-41d4-a716-446655440001','Mình muốn đổi lịch khởi hành, hỗ trợ giúp ạ.',CURRENT_TIMESTAMP);


INSERT IGNORE INTO schedule_chat_rooms (
    id, schedule_id, room_name, visibility, is_active, created_at
) VALUES
(1,5,'Nhóm lịch Đà Nẵng 2026_001','all_members',TRUE,CURRENT_TIMESTAMP);


INSERT IGNORE INTO schedule_chat_room_members (id, room_id, user_id, joined_at, is_muted)
VALUES
(1,1,'550e8400-e29b-41d4-a716-446655440001',CURRENT_TIMESTAMP,FALSE),
(2,1,'550e8400-e29b-41d4-a716-446655440000',CURRENT_TIMESTAMP,FALSE);


INSERT IGNORE INTO schedule_chat_messages (id, room_id, sender_user_id, message_text, created_at)
VALUES (1,1,'550e8400-e29b-41d4-a716-446655440000','Chào cả nhà, vui lòng có mặt trước 15 phút tại điểm đón.',CURRENT_TIMESTAMP);


-- NOTIFICATION CAMPAIGNS / DELIVERIES
INSERT IGNORE INTO notification_campaigns (
    id, code, campaign_name, notification_type, channel, title_template, body_template,
    target_query, scheduled_at, sent_at, status, created_by
) VALUES
(1,'WELCOME_2026','Chiến dịch chào mừng','system','in_app','Chào mừng {{name}}','Chào mừng bạn đến với TravelViet!',
JSON_OBJECT('userIds',JSON_ARRAY('550e8400-e29b-41d4-a716-446655440001')),NULL,CURRENT_TIMESTAMP,'completed','550e8400-e29b-41d4-a716-446655440000');


INSERT IGNORE INTO notification_deliveries (
    id, campaign_id, notification_id, user_id, channel, recipient, status, provider_message_id, error_message, sent_at, delivered_at, read_at
) VALUES
(1,1,1,'550e8400-e29b-41d4-a716-446655440001','in_app',NULL,'delivered',NULL,NULL,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,NULL);





-- =====================================================================
-- 11_PERSONALIZATION_TRAVEL_PASSPORT - Cá nhân hóa, travel passport, wishlist, mission
-- =====================================================================

-- LOYALTY / ENGAGEMENT
INSERT IGNORE INTO travel_passports (id, user_id, passport_no, total_tours, total_destinations, total_checkins, last_trip_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001','PASS-AN-0001',0,0,0,NULL);


INSERT IGNORE INTO badge_definitions (id, code, name, description, icon_url, condition_json, is_active)
VALUES (1,'FIRST_TRIP','Chuyến đi đầu tiên','Hoàn thành chuyến đi đầu tiên',NULL,JSON_OBJECT('type','count_completed_bookings','value',1),TRUE);


INSERT IGNORE INTO passport_badges (id, passport_id, badge_id, unlocked_at)
VALUES (1,1,1,CURRENT_TIMESTAMP);


INSERT IGNORE INTO user_checkins (id, user_id, booking_id, destination_id, checkin_latitude, checkin_longitude, note, created_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',1,1015,16.0615,108.2320,'Check-in thử nghiệm',CURRENT_TIMESTAMP);


INSERT IGNORE INTO wishlist_tours (id, user_id, tour_id, created_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',1,CURRENT_TIMESTAMP);


INSERT IGNORE INTO wishlist_destinations (id, user_id, destination_id, created_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',1015,CURRENT_TIMESTAMP);


INSERT IGNORE INTO user_tour_views (id, user_id, tour_id, viewed_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',1,CURRENT_TIMESTAMP);


INSERT IGNORE INTO recommendation_logs (
    id, user_id, requested_tag, requested_budget, requested_trip_mode, requested_people_count, requested_departure_at, generated_result, scoring_detail, created_at
) VALUES
(1,'550e8400-e29b-41d4-a716-446655440001','NGHI_DUONG','medium','group',3,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),
 JSON_OBJECT('recommendedTourIds',JSON_ARRAY(1),'reason','match budget and beach'),JSON_OBJECT('scores',JSON_OBJECT('tour:1',0.92)),CURRENT_TIMESTAMP);


-- MISSIONS
INSERT IGNORE INTO mission_definitions (id, code, name, description, rule_json, reward_type, reward_value, reward_ref_id, start_at, end_at, is_active)
VALUES
(1,'TOTAL_BOOKINGS','Hoàn thành 1 booking','Nhận thêm điểm thưởng khi hoàn thành booking đầu tiên.',JSON_OBJECT('type','completed_bookings','min',1),'points',100,NULL,NULL,NULL,TRUE);


INSERT IGNORE INTO user_missions (id, user_id, mission_id, progress, goal, status, completed_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',1,0,1,'in_progress',NULL);


-- PASSPORT VISITED DESTINATIONS
INSERT IGNORE INTO passport_visited_destinations (id, passport_id, destination_id, first_booking_id, first_visited_at, last_visited_at)
VALUES (1,1,1015,1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);


-- SAVED SEARCHES / ITINERARIES
INSERT IGNORE INTO saved_searches (id, user_id, search_name, keyword, filters_json, last_result_count)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001','Tìm tour biển','biển',JSON_OBJECT('tag','BIEN','budget','medium'),5);


INSERT IGNORE INTO saved_itineraries (id, user_id, destination_id, title, note, itinerary_json, is_public)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',1015,'Lịch trình 2 ngày Đà Nẵng','Bản nháp lịch trình',JSON_OBJECT('days',JSON_ARRAY('Ngày 1: biển','Ngày 2: Bà Nà')),FALSE);





-- =====================================================================
-- 12_SUPPLIERS_MEDIA_WEATHER_AUDIT - Nhà cung cấp, media, thời tiết, audit
-- =====================================================================

INSERT IGNORE INTO audit_logs (
    id, actor_user_id, action_name, entity_name, entity_id, old_data, new_data, ip_address, user_agent, created_at
) VALUES
(1,'550e8400-e29b-41d4-a716-446655440000','CREATE','booking','1',NULL,JSON_OBJECT('bookingId',1,'orderId',42),'127.0.0.1','seed-script',CURRENT_TIMESTAMP);


-- WEATHER / CROWD / ROUTE
INSERT IGNORE INTO weather_forecasts (
    id, destination_id, forecast_date, weather_code, summary, temp_min, temp_max, humidity_percent, wind_speed, rain_probability, source_name, raw_payload
) VALUES
(1,1015,DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY),'clear','Trời nắng đẹp',25.0,32.0,60.0,12.5,10.0,'seed',JSON_OBJECT('provider','seed'));


INSERT IGNORE INTO weather_alerts (
    id, destination_id, schedule_id, severity, alert_type, title, message, action_advice, valid_from, valid_to, is_active
) VALUES
(1,1015,5,'info','heat','Nắng nóng nhẹ','Nhiệt độ cao vào buổi trưa, uống đủ nước.','Chuẩn bị nón, nước uống.',CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY),TRUE);


INSERT IGNORE INTO crowd_predictions (
    id, destination_id, prediction_date, crowd_level, predicted_visitors, confidence_score, reasons_json
) VALUES
(1,1015,DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY),'high',12000,0.82,JSON_ARRAY('weekend','good_weather'));


INSERT IGNORE INTO route_estimates (
    id, from_label, to_label, from_latitude, from_longitude, to_latitude, to_longitude, distance_km, duration_minutes, google_map_url, source_name
) VALUES
(1,'Sân bay Đà Nẵng','Cầu Rồng',16.0439,108.1994,16.0615,108.2320,6.5,20,'https://maps.google.com/?q=DaNang','seed');


-- SUPPLIERS / CONTACTS / SERVICES
INSERT IGNORE INTO suppliers (
    id, code, supplier_type, name, legal_name, tax_code, phone, email, website, province, district, address, status, note
) VALUES
(1,'SUP-DN-001','hotel','Đối tác khách sạn Đà Nẵng','CÔNG TY TNHH KHÁCH SẠN ĐÀ NẴNG','0312345678','+842362222222','hotel.partner@travelviet.local','https://example.com','Đà Nẵng','Hải Châu','Bạch Đằng, Hải Châu','active','Đối tác seed');


INSERT IGNORE INTO supplier_contacts (id, supplier_id, full_name, job_title, phone, email, is_primary, note)
VALUES (1,1,'Nguyễn Thu Trang','Sales','+84908887777','trang.sales@hotel.local',TRUE,'Liên hệ chính');


INSERT IGNORE INTO supplier_services (id, supplier_id, service_type, service_name, description, unit_price, currency, is_active)
VALUES (1,1,'hotel','Phòng đôi tiêu chuẩn','Giá phòng/đêm',900000,'VND',TRUE);


INSERT IGNORE INTO tour_supplier_services (id, tour_id, supplier_service_id, quantity_default, note)
VALUES (1,1,1,1,'Gợi ý dịch vụ kèm tour');


-- MEDIA FILES / ATTACHMENTS
INSERT IGNORE INTO media_files (
    id, file_key, original_name, mime_type, file_ext, file_size_bytes, storage_provider,
    file_url, thumbnail_url, uploaded_by, is_public, created_at
) VALUES
(1,'seed/destination/da-nang-cover','da-nang.jpg','image/jpeg','jpg',123456,'local',
'https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-02002',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE,CURRENT_TIMESTAMP);










-- CHECK NHANH
SELECT destination_level, COUNT(*) AS total FROM destinations GROUP BY destination_level ORDER BY destination_level;
SELECT COUNT(*) AS total_tours FROM tours;
SELECT COUNT(*) AS invalid_tour_destination FROM tours t LEFT JOIN tour_destinations td ON td.tour_id = t.id LEFT JOIN destinations d ON d.id=td.destination_id WHERE d.id IS NULL OR d.destination_level <> 2;
SELECT COUNT(*) AS duplicate_destination_slug FROM (SELECT slug FROM destinations GROUP BY slug HAVING COUNT(*) > 1) x;
SELECT COUNT(*) AS duplicate_tour_slug FROM (SELECT slug FROM tours GROUP BY slug HAVING COUNT(*) > 1) x;

-- ADDED TO FIX MISSING HOME PAGE TAGS
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT t.id, tg.id
FROM tours t
JOIN tags tg ON tg.code IN ('HOME_BEACH_VN', 'HOME_FLASH_SALE')
WHERE t.id IN (5, 6, 37, 48, 53, 73, 76, 80);

SET FOREIGN_KEY_CHECKS = 1;
