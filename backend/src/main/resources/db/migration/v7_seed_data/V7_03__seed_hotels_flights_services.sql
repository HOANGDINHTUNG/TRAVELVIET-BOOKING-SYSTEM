SET FOREIGN_KEY_CHECKS = 0;
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


INSERT INTO airlines (code_iata, code_icao, name, logo_url, is_active)
VALUES
    ('VN', 'HVN', 'Vietnam Airlines', NULL, TRUE),
    ('VJ', 'VJC', 'VietJet Air', NULL, TRUE),
    ('QH', 'BAV', 'Bamboo Airways', NULL, TRUE)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    code_icao = VALUES(code_icao),
    logo_url = VALUES(logo_url),
    is_active = VALUES(is_active);


INSERT IGNORE INTO cancellation_policies ( id, name, description, voucher_bonus_percent, is_default, is_active ) 
VALUES (1, 'CHINH_SACH_MAC_DINH', 'Chính sách hoàn hủy mặc định của TravelViet', 10, TRUE, TRUE);


INSERT IGNORE INTO cancellation_policy_rules ( id, policy_id, min_hours_before, max_hours_before, refund_percent, voucher_percent, fee_percent, allow_reschedule, notes ) 
VALUES (1, 1, 168, NULL, 80, 90, 20, TRUE, 'Hủy trước 7 ngày'), (2, 1, 72, 168, 50, 60, 50, TRUE, 'Hủy trước 3 ngày'), (3, 1, 0, 72, 0, 30, 100, FALSE, 'Hủy dưới 3 ngày');


-- Bổ sung policy id 2, 3: tours seed dùng cancellation_policy_id 1|2|3 — trước đây chỉ có id=1
-- nên INSERT IGNORE tours bỏ 63 dòng (FK), DB chỉ còn 37 tour.
INSERT IGNORE INTO cancellation_policies ( id, name, description, voucher_bonus_percent, is_default, is_active )
VALUES
(2, 'CHINH_SACH_LINH_HOAT', 'Chính sách linh hoạt hơn cho một số tour ghép / biển / cao cấp nhẹ.', 8, FALSE, TRUE),
(3, 'CHINH_SACH_CHAT_CHE', 'Chính sách chặt hơn cho tour quốc tế dài ngày / khuyến mãi sâu.', 5, FALSE, TRUE);


INSERT IGNORE INTO cancellation_policy_rules ( id, policy_id, min_hours_before, max_hours_before, refund_percent, voucher_percent, fee_percent, allow_reschedule, notes )
VALUES
(4, 2, 168, NULL, 70, 85, 30, TRUE, 'Hủy trước 7 ngày'),
(5, 2, 72, 168, 40, 55, 60, TRUE, 'Hủy trước 3 ngày'),
(6, 2, 0, 72, 0, 20, 100, FALSE, 'Hủy dưới 3 ngày'),
(7, 3, 240, NULL, 60, 75, 40, TRUE, 'Hủy trước 10 ngày'),
(8, 3, 120, 240, 30, 45, 70, FALSE, 'Hủy trước 5 ngày'),
(9, 3, 0, 120, 0, 15, 100, FALSE, 'Hủy dưới 5 ngày');


INSERT IGNORE INTO tags(code, name, tag_group, description) 
VALUES 
    -- 1. NHÓM PHONG CÁCH (Style) - Mở rộng
    ('GIAI_TRI', 'Giải trí', 'phong_cach', 'Tour vui chơi, hoạt động sôi động'), 
    ('NGHI_DUONG', 'Nghỉ dưỡng', 'phong_cach', 'Tour nghỉ ngơi, thư giãn'), 
    ('CHECKIN', 'Check-in', 'phong_cach', 'Tour phù hợp sống ảo, chụp hình'), 
    ('MAO_HIEM', 'Khám phá mạo hiểm', 'phong_cach', 'Tour trekking, leo núi, vượt thác'),
    ('LANG_MAN', 'Lãng mạn', 'phong_cach', 'Tour trăng mật, không gian riêng tư cho cặp đôi'),
    ('SANG_TRONG', 'Sang trọng (Luxury)', 'phong_cach', 'Tour cao cấp 4-5 sao, dịch vụ hạng thương gia'),
    ('SINH_THAI', 'Sinh thái (Eco)', 'phong_cach', 'Tour gần gũi thiên nhiên, xanh và bền vững'),
    ('TAM_LINH', 'Hành hương tâm linh', 'phong_cach', 'Tour tham quan đền chùa, thiền định, tôn giáo'),
    ('FREE_EASY', 'Tự túc (Free & Easy)', 'phong_cach', 'Chỉ bao gồm vé máy bay và khách sạn, tự do lịch trình'),

    -- 2. NHÓM ĐỐI TƯỢNG (Audience) - Mở rộng
    ('GIA_DINH', 'Gia đình', 'doi_tuong', 'Tour phù hợp gia đình và trẻ em'), 
    ('NGUOI_LON_TUOI', 'Người lớn tuổi', 'doi_tuong', 'Tour nhẹ nhàng, ít di chuyển, chú trọng sức khỏe'), 
    ('SINH_VIEN', 'Sinh viên', 'doi_tuong', 'Tour giá tốt, vui nhộn cho sinh viên'), 
    ('CAP_DOI', 'Cặp đôi', 'doi_tuong', 'Thiết kế riêng cho 2 người, đề cao sự lãng mạn'),
    ('DOC_HANH', 'Độc hành (Solo)', 'doi_tuong', 'Tour ghép đoàn, an toàn và thân thiện cho người đi một mình'),
    ('DOAN_THE', 'Đoàn thể / Teambuilding', 'doi_tuong', 'Tour có kết hợp hội thảo, gala dinner, trò chơi tập thể'),
    ('TRE_NHO', 'Trẻ nhỏ (Kids friendly)', 'doi_tuong', 'Tour có khu vui chơi, hoạt động giáo dục cho bé'),

    -- 3. NHÓM ĐỊA HÌNH & KHÔNG GIAN (Terrain/Geography) - Mở rộng
    ('BIEN', 'Biển', 'dia_hinh', 'Tour vui chơi bãi biển'), 
    ('NUI', 'Núi đồi', 'dia_hinh', 'Tour vùng cao, đồi núi se lạnh'), 
    ('DAO', 'Hải đảo', 'dia_hinh', 'Tour đi tàu ra đảo, lặn biển'),
    ('SONG_HO', 'Sông hồ', 'dia_hinh', 'Tour miền tây sông nước, du thuyền trên hồ/vịnh'),
    ('RUNG', 'Rừng nguyên sinh', 'dia_hinh', 'Tour thám hiểm rừng quốc gia, ngắm thú'),
    ('THANH_PHO', 'Thành phố', 'dia_hinh', 'City tour, mua sắm, ngắm kiến trúc hiện đại'),
    ('HANG_DONG', 'Hang động', 'dia_hinh', 'Thám hiểm hang động, thạch nhũ'),
    ('THAO_NGUYEN', 'Thảo nguyên', 'dia_hinh', 'Ngắm cảnh đồi cỏ, chăn cừu/ngựa, thảo nguyên mênh mông'),

    -- 4. NHÓM TRẢI NGHIỆM CHI TIẾT (Specific Experience) - Mở rộng
    ('AM_THUC', 'Ẩm thực', 'trai_nghiem', 'Trải nghiệm đặc sản địa phương, food tour'), 
    ('VAN_HOA', 'Văn hóa', 'trai_nghiem', 'Tìm hiểu phong tục, bản sắc dân tộc'),
    ('TREKKING', 'Trekking & Hiking', 'trai_nghiem', 'Đi bộ xuyên rừng, chinh phục đỉnh núi'),
    ('CAMPING', 'Cắm trại', 'trai_nghiem', 'Ngủ lều, BBQ ngoài trời, đốt lửa trại (Glamping)'),
    ('LICH_SU', 'Lịch sử di sản', 'trai_nghiem', 'Tham quan di tích, bảo tàng, cội nguồn lịch sử'),
    ('MUA_SAM', 'Mua sắm', 'trai_nghiem', 'Tour ghé các trung tâm thương mại, chợ sầm uất'),
    ('LE_HOI', 'Lễ hội', 'trai_nghiem', 'Tham gia các sự kiện, lễ hội âm nhạc, văn hóa địa phương'),
    ('THU_CONG', 'Làng nghề thủ công', 'trai_nghiem', 'Tham quan và làm thử gốm, nón, dệt lụa'),
    ('WILDLIFE', 'Động vật hoang dã', 'trai_nghiem', 'Safari, ngắm thú, tham quan khu bảo tồn'),
    ('THE_THAO_NUOC', 'Thể thao dưới nước', 'trai_nghiem', 'Chèo Kayak, lặn ngắm san hô (Snorkeling), đi bộ dưới biển'),
    ('NIGHTLIFE', 'Sôi động về đêm', 'trai_nghiem', 'Phố đi bộ, bar/pub, chợ đêm, các show diễn tối'),

    -- 5. NHÓM MÙA VỤ / THỜI ĐIỂM (Season) - [MỚI - Rất quan trọng cho AI tư vấn]
    ('MUA_XUAN', 'Mùa Xuân / Ngắm hoa', 'mua_vu', 'Tour ngắm hoa anh đào, hoa mai, hoa mận (Tháng 1 - Tháng 3)'),
    ('MUA_HE', 'Mùa Hè / Tránh nóng', 'mua_vu', 'Tour biển, công viên nước, cao nguyên mát mẻ (Tháng 5 - Tháng 8)'),
    ('MUA_THU', 'Mùa Thu / Lá vàng', 'mua_vu', 'Tour ngắm lá phong đỏ, thời tiết thu lãng mạn (Tháng 9 - Tháng 11)'),
    ('MUA_DONG', 'Mùa Đông / Băng tuyết', 'mua_vu', 'Tour săn mây, trượt tuyết, ngắm băng giá (Tháng 12 - Tháng 2)'),
    ('LE_TET', 'Dịp Lễ / Tết', 'mua_vu', 'Tour khởi hành các dịp cao điểm Lễ, Tết Nguyên Đán'),

    -- 6. NHÓM NGÂN SÁCH (Budget) - [MỚI - AI dùng để lọc giá theo túi tiền]
    ('BUDGET_VIP', 'Ngân sách Không giới hạn', 'ngan_sach', 'Ưu tiên dịch vụ tốt nhất, không màng chi phí'),
    ('BUDGET_TB', 'Ngân sách Tiêu chuẩn', 'ngan_sach', 'Chi tiêu hợp lý, dịch vụ khách sạn 3-4 sao'),
    ('BUDGET_RE', 'Siêu tiết kiệm', 'ngan_sach', 'Ưu tiên giá rẻ, homestay, nhà nghỉ, săn sale'),

    -- 7. NHÓM THỜI LƯỢNG (Duration) - [MỚI - AI dùng để hỏi khách rảnh bao lâu]
    ('THOI_GIAN_NGAY', 'Đi trong ngày', 'thoi_gian', 'City tour hoặc đi về trong ngày, không ngủ lại'),
    ('THOI_GIAN_NGAN', 'Ngắn ngày (2-3 ngày)', 'thoi_gian', 'Phù hợp đi xả stress dịp cuối tuần'),
    ('THOI_GIAN_DAI', 'Dài ngày (4 ngày trở lên)', 'thoi_gian', 'Tour dài ngày, khám phá chuyên sâu hoặc đi nước ngoài'),

    -- 8. VỊ TRÍ HIỂN THỊ UI (Home Row) - Mở rộng
    ('HOME_BEACH_VN', 'Kệ trang chủ: Biển đảo VN', 'home_row', 'Hiển thị hàng Biển đảo trong nước.'),
    ('HOME_HOT_INTL', 'Kệ trang chủ: HOT quốc tế', 'home_row', 'Hiển thị hàng HOT nước ngoài.'),
    ('HOME_FLASH_SALE', 'Kệ trang chủ: Flash Sale', 'home_row', 'Hiển thị các tour đang có ưu đãi giảm giá sâu.'),
    ('HOME_TRENDING', 'Kệ trang chủ: Đang thịnh hành', 'home_row', 'Hiển thị các tour được tìm kiếm/đặt nhiều nhất tuần.'),
    ('HOME_LUXURY', 'Kệ trang chủ: Trải nghiệm đẳng cấp', 'home_row', 'Hiển thị các tour 5 sao sang trọng nhất.'),

    ('UNESCO', 'Di sản UNESCO', 'trai_nghiem', 'Các điểm đến được UNESCO công nhận, giá trị lịch sử cao'),
    ('CHUA_LANH', 'Chữa lành & Wellness', 'phong_cach', 'Suối khoáng nóng, thiền, không khí tĩnh lặng, phục hồi năng lượng'),
    ('PHIM_TRUONG', 'Bối cảnh phim ảnh', 'trai_nghiem', 'Nơi quay các bộ phim bom tấn nổi tiếng thế giới / Việt Nam'),
    ('ROADTRIP', 'Phượt & Xe địa hình', 'trai_nghiem', 'Tự lái xe, đi xe máy, xe Jeep, xe chuyên dụng chinh phục địa hình'),
    ('MIET_VUON', 'Nông nghiệp & Miệt vườn', 'trai_nghiem', 'Hái trái cây, bắt cá, hòa mình vào đời sống nông thôn'),

    ('VISA_FREE', 'Không cần Visa / Dễ đi', 'doi_tuong', 'Tour quốc tế miễn visa hoặc thủ tục cực kỳ đơn giản cho người Việt'),
    ('GIAO_DUC', 'Giáo dục & Khám phá', 'trai_nghiem', 'Tour mang tính học thuật, tìm hiểu lịch sử, thế giới tự nhiên cho trẻ em'),
    ('DI_BO_NHIEU', 'Đi bộ nhiều (Cảnh báo)', 'dia_hinh', 'Tour yêu cầu đi bộ vãn cảnh nhiều, cân nhắc cho người già/khớp yếu'),
    ('SUNRISE_SUNSET', 'Săn bình minh / Hoàng hôn', 'trai_nghiem', 'Điểm đến có tầm nhìn ngắm mặt trời mọc/lặn cực phẩm'),
    ('PHAT_GIAO', 'Hành hương Phật Giáo', 'trai_nghiem', 'Tham quan các đại tự, thánh tích Phật Giáo thiêng liêng'),
    ('CONG_GIAO_HOI_GIAO', 'Kiến trúc Công Giáo / Hồi Giáo', 'trai_nghiem', 'Khám phá các nhà thờ, thánh đường Hồi Giáo đồ sộ, tráng lệ');


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



-- =====================================================================
-- X) SEED REALISTIC AIRPORTS & AIRLINES
-- =====================================================================
INSERT IGNORE INTO airports (code_iata, code_icao, name, city_name, country_code, destination_id, latitude, longitude, timezone, is_active)
SELECT 'HAN', 'VVNB', 'Sân bay quốc tế Nội Bài', 'Hà Nội', 'VN', id, 21.2212, 105.8072, 'Asia/Ho_Chi_Minh', TRUE FROM destinations WHERE name LIKE '%Hà Nội%' LIMIT 1;

INSERT IGNORE INTO airports (code_iata, code_icao, name, city_name, country_code, destination_id, latitude, longitude, timezone, is_active)
SELECT 'SGN', 'VVTS', 'Sân bay quốc tế Tân Sơn Nhất', 'Hồ Chí Minh', 'VN', id, 10.8184, 106.6588, 'Asia/Ho_Chi_Minh', TRUE FROM destinations WHERE name LIKE '%Hồ Chí Minh%' LIMIT 1;

INSERT IGNORE INTO airports (code_iata, code_icao, name, city_name, country_code, destination_id, latitude, longitude, timezone, is_active)
SELECT 'DAD', 'VVDN', 'Sân bay quốc tế Đà Nẵng', 'Đà Nẵng', 'VN', id, 16.0439, 108.1994, 'Asia/Ho_Chi_Minh', TRUE FROM destinations WHERE name LIKE '%Đà Nẵng%' LIMIT 1;

INSERT IGNORE INTO airports (code_iata, code_icao, name, city_name, country_code, destination_id, latitude, longitude, timezone, is_active)
SELECT 'PQC', 'VVPQ', 'Sân bay quốc tế Phú Quốc', 'Kiên Giang', 'VN', id, 10.1654, 103.9942, 'Asia/Ho_Chi_Minh', TRUE FROM destinations WHERE name LIKE '%Phú Quốc%' LIMIT 1;

INSERT IGNORE INTO airports (code_iata, code_icao, name, city_name, country_code, destination_id, latitude, longitude, timezone, is_active)
SELECT 'CXR', 'VVCR', 'Sân bay quốc tế Cam Ranh', 'Khánh Hòa', 'VN', id, 11.9981, 109.2193, 'Asia/Ho_Chi_Minh', TRUE FROM destinations WHERE name LIKE '%Nha Trang%' LIMIT 1;

-- 8) tao 100 realistic flights
INSERT INTO flights (airline_id, flight_no, origin_airport_id, destination_airport_id, departure_time_local, arrival_time_local, duration_minutes, status)
VALUES
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ101', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-25 17:15:00', '2024-06-25 19:30:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH102', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-25 18:30:00', '2024-06-25 20:45:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN103', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-25 19:45:00', '2024-06-25 21:10:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ104', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-25 20:00:00', '2024-06-25 21:25:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH105', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-25 21:15:00', '2024-06-25 22:40:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN106', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-25 22:30:00', '2024-06-25 23:55:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ107', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-25 23:45:00', '2024-06-26 00:45:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH108', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-26 00:00:00', '2024-06-26 01:00:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN109', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-26 01:15:00', '2024-06-26 03:25:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ110', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-26 02:30:00', '2024-06-26 04:40:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH111', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-26 03:45:00', '2024-06-26 06:00:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN112', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-25 16:00:00', '2024-06-25 18:15:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ113', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-25 17:15:00', '2024-06-25 18:40:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH114', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-25 18:30:00', '2024-06-25 19:55:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN115', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-26 19:45:00', '2024-06-26 21:10:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ116', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-26 20:00:00', '2024-06-26 21:25:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH117', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-26 21:15:00', '2024-06-26 22:15:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN118', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-26 22:30:00', '2024-06-26 23:30:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ119', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-26 23:45:00', '2024-06-27 01:55:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH120', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-27 00:00:00', '2024-06-27 02:10:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN121', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-27 01:15:00', '2024-06-27 03:30:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ122', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-27 02:30:00', '2024-06-27 04:45:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH123', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-27 03:45:00', '2024-06-27 05:10:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN124', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-26 16:00:00', '2024-06-26 17:25:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ125', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-26 17:15:00', '2024-06-26 18:40:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH126', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-26 18:30:00', '2024-06-26 19:55:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN127', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-26 19:45:00', '2024-06-26 20:45:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ128', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-26 20:00:00', '2024-06-26 21:00:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH129', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-26 21:15:00', '2024-06-26 23:25:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN130', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-27 22:30:00', '2024-06-28 00:40:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ131', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-27 23:45:00', '2024-06-28 02:00:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH132', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-28 00:00:00', '2024-06-28 02:15:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN133', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-28 01:15:00', '2024-06-28 02:40:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ134', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-28 02:30:00', '2024-06-28 03:55:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH135', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-28 03:45:00', '2024-06-28 05:10:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN136', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-27 16:00:00', '2024-06-27 17:25:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ137', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-27 17:15:00', '2024-06-27 18:15:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH138', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-27 18:30:00', '2024-06-27 19:30:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN139', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-27 19:45:00', '2024-06-27 21:55:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ140', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-27 20:00:00', '2024-06-27 22:10:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH141', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-27 21:15:00', '2024-06-27 23:30:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN142', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-27 22:30:00', '2024-06-28 00:45:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ143', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-27 23:45:00', '2024-06-28 01:10:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH144', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-28 00:00:00', '2024-06-28 01:25:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN145', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-29 01:15:00', '2024-06-29 02:40:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ146', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-29 02:30:00', '2024-06-29 03:55:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH147', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-29 03:45:00', '2024-06-29 04:45:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN148', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-28 16:00:00', '2024-06-28 17:00:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ149', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-28 17:15:00', '2024-06-28 19:25:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH150', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-28 18:30:00', '2024-06-28 20:40:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN151', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-28 19:45:00', '2024-06-28 22:00:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ152', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-28 20:00:00', '2024-06-28 22:15:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH153', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-28 21:15:00', '2024-06-28 22:40:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN154', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-28 22:30:00', '2024-06-28 23:55:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ155', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-28 23:45:00', '2024-06-29 01:10:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH156', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-29 00:00:00', '2024-06-29 01:25:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN157', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-29 01:15:00', '2024-06-29 02:15:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ158', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-29 02:30:00', '2024-06-29 03:30:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH159', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-29 03:45:00', '2024-06-29 05:55:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN160', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-29 16:00:00', '2024-06-29 18:10:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ161', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-29 17:15:00', '2024-06-29 19:30:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH162', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-29 18:30:00', '2024-06-29 20:45:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN163', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-29 19:45:00', '2024-06-29 21:10:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ164', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-29 20:00:00', '2024-06-29 21:25:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH165', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-29 21:15:00', '2024-06-29 22:40:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN166', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-29 22:30:00', '2024-06-29 23:55:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ167', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-29 23:45:00', '2024-06-30 00:45:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH168', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-30 00:00:00', '2024-06-30 01:00:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN169', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-30 01:15:00', '2024-06-30 03:25:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ170', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-30 02:30:00', '2024-06-30 04:40:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH171', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-30 03:45:00', '2024-06-30 06:00:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN172', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-29 16:00:00', '2024-06-29 18:15:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ173', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-29 17:15:00', '2024-06-29 18:40:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH174', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-29 18:30:00', '2024-06-29 19:55:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN175', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-30 19:45:00', '2024-06-30 21:10:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ176', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-30 20:00:00', '2024-06-30 21:25:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH177', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-30 21:15:00', '2024-06-30 22:15:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN178', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-30 22:30:00', '2024-06-30 23:30:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ179', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-30 23:45:00', '2024-07-01 01:55:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH180', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-07-01 00:00:00', '2024-07-01 02:10:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN181', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-07-01 01:15:00', '2024-07-01 03:30:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ182', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-07-01 02:30:00', '2024-07-01 04:45:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH183', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-07-01 03:45:00', '2024-07-01 05:10:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN184', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-06-30 16:00:00', '2024-06-30 17:25:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ185', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-06-30 17:15:00', '2024-06-30 18:40:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH186', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-30 18:30:00', '2024-06-30 19:55:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN187', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-30 19:45:00', '2024-06-30 20:45:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ188', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-06-30 20:00:00', '2024-06-30 21:00:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH189', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-06-30 21:15:00', '2024-06-30 23:25:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN190', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-07-01 22:30:00', '2024-07-02 00:40:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ191', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-07-01 23:45:00', '2024-07-02 02:00:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH192', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-07-02 00:00:00', '2024-07-02 02:15:00', 135, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN193', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-07-02 01:15:00', '2024-07-02 02:40:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ194', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-07-02 02:30:00', '2024-07-02 03:55:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH195', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), '2024-07-02 03:45:00', '2024-07-02 05:10:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN196', (SELECT id FROM airports WHERE code_iata = 'DAD' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-07-01 16:00:00', '2024-07-01 17:25:00', 85, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ197', (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-07-01 17:15:00', '2024-07-01 18:15:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'QH' LIMIT 1), 'QH198', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'SGN' LIMIT 1), '2024-07-01 18:30:00', '2024-07-01 19:30:00', 60, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VN' LIMIT 1), 'VN199', (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), '2024-07-01 19:45:00', '2024-07-01 21:55:00', 130, 'scheduled'),
((SELECT id FROM airlines WHERE code_iata = 'VJ' LIMIT 1), 'VJ200', (SELECT id FROM airports WHERE code_iata = 'PQC' LIMIT 1), (SELECT id FROM airports WHERE code_iata = 'HAN' LIMIT 1), '2024-07-01 20:00:00', '2024-07-01 22:10:00', 130, 'scheduled');

-- 10) tao 300 combo moi, lien ket destination + gia da dang
UPDATE flight_classes fc
JOIN flights f ON f.id = fc.flight_id
SET
    fc.base_price = CASE fc.cabin_class
        WHEN 'economy' THEN CAST(1200000 + MOD(f.id * 17000, 1800000) AS DECIMAL(14,2))
        ELSE CAST(3500000 + MOD(f.id * 25000, 3000000) AS DECIMAL(14,2))
    END,
    fc.tax_amount = CASE fc.cabin_class
        WHEN 'economy' THEN 250000
        ELSE 450000
    END,
    fc.currency = 'VND',
    fc.seat_total = CASE fc.cabin_class
        WHEN 'economy' THEN 180
        ELSE 24
    END,
    fc.seat_available = CASE fc.cabin_class
        WHEN 'economy' THEN 120 + MOD(f.id, 40)
        ELSE 12 + MOD(f.id, 8)
    END,
    fc.baggage_rule_json = CASE fc.cabin_class
        WHEN 'economy' THEN JSON_OBJECT('checked_baggage_kg', 20, 'carry_on_kg', 7)
        ELSE JSON_OBJECT('checked_baggage_kg', 35, 'carry_on_kg', 10)
    END,
    fc.change_refund_rule_json = JSON_OBJECT(
        'change_fee', CASE fc.cabin_class WHEN 'economy' THEN 350000 ELSE 250000 END,
        'refundable', CASE fc.cabin_class WHEN 'economy' THEN FALSE ELSE TRUE END
    ),
    fc.is_active = TRUE
WHERE fc.cabin_class IN ('economy', 'business')
  AND fc.fare_family IN ('standard', 'flex');


SET FOREIGN_KEY_CHECKS = 1;
