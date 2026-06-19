SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- V7_04A__seed_combos_promotions_vouchers.sql
-- Dữ liệu combo/promotion/voucher: tách riêng vì sau này dễ phát triển lớn.
-- ============================================================

-- =====================================================================
-- 07_COMBOS_HOTELS_FLIGHTS - Combo, khách sạn, chuyến bay
-- =====================================================================

-- COMMERCE / PROMOTIONS (minimal)
INSERT IGNORE INTO combo_packages (
    id, code, name, description, base_price, discount_amount, is_active
) VALUES
(6,'COMBO-001','Adventure Combo','Gói add-on nhẹ: nước uống + áo mưa',100000,50000,TRUE),
(7,'COMBO-002','Connectivity Pack','SIM 4G dung lượng cao + Sạc dự phòng cho mượn.',250000,50000,TRUE),
(8,'COMBO-003','Safety First','Gói bảo hiểm du lịch mở rộng + Bộ sơ cứu cá nhân.',150000,30000,TRUE),
(9,'COMBO-004','Digital Nomad','Wifi di động tốc độ cao + Chỗ ngồi làm việc tại điểm dừng.',350000,70000,TRUE),
(10,'COMBO-005','Foodie Lover','Thưởng thức 3 món ăn đường phố đặc sản + 1 đồ uống.',200000,40000,TRUE),
(11,'COMBO-006','Bữa Trưa Tiện Lợi','Cơm hộp văn phòng cao cấp + Nước suối + Trái cây.',120000,20000,TRUE),
(12,'COMBO-007','Tiệc Nướng BBQ','Gói nâng cấp bữa tối thành tiệc nướng hải sản bãi biển.',550000,100000,TRUE),
(13,'COMBO-008','Beer & Chill','Combo 4 chai bia địa phương + Mồi nhắm khô mực/đậu phộng.',300000,60000,TRUE),
(14,'COMBO-009','Hương Vị Cố Đô','Set trà cung đình + Bánh đậu xanh/bánh in truyền thống.',180000,30000,TRUE),
(15,'COMBO-010','Photo Memories','Thợ chụp ảnh đi kèm đoàn trong 2 tiếng + Chỉnh sửa 20 ảnh.',1500000,300000,TRUE),
(16,'COMBO-011','Video Highlights','Quay phim bằng Flycam và dựng clip ngắn 1 phút.',2500000,500000,TRUE),
(17,'COMBO-012','Local Gift S','Giỏ quà đặc sản địa phương loại nhỏ (Trà, bánh, mứt).',300000,50000,TRUE),
(18,'COMBO-013','Local Gift L','Giỏ quà đặc sản cao cấp (Rượu vang, hải sản khô, đồ thủ công).',800000,150000,TRUE),
(19,'COMBO-014','Trải Nghiệm Nghệ Nhân','Vé tham quan xưởng thủ công + Tự tay làm sản phẩm mang về.',250000,50000,TRUE),
(20,'COMBO-015','VIP Lounge Access','Vé sử dụng phòng chờ thương gia tại sân bay/bến tàu.',450000,90000,TRUE),
(21,'COMBO-016','Luxury Transport','Nâng cấp xe di chuyển sang dòng Limousine 9 chỗ.',1200000,200000,TRUE),
(22,'COMBO-017','Late Check-out','Gói gia hạn thời gian trả phòng khách sạn đến 18:00.',500000,100000,TRUE),
(23,'COMBO-018','Private Dinner','Bữa tối lãng mạn riêng tư cho 2 người với nến và hoa.',2000000,400000,TRUE),
(24,'COMBO-019','Family Fun','Gói đồ chơi bãi biển cho bé + Ghế nghỉ cho bố mẹ.',300000,70000,TRUE),
(25,'COMBO-020','Team Spirit','Bộ áo thun đồng phục đoàn (10 áo) + Cờ đội.',1500000,250000,TRUE),
(26,'COMBO-021','Gala Dinner Basic','Gói trang trí sân khấu, âm thanh ánh sáng cơ bản.',5000000,1000000,TRUE),
(27,'COMBO-022','Teambuilding Kit','Dụng cụ trò chơi vận động + Loa kéo công suất lớn.',800000,150000,TRUE),
(28,'COMBO-023','Wellness Spa','Liệu trình massage chân 45 phút tại Spa liên kết.',400000,80000,TRUE),
(29,'COMBO-024','Healing Tour','Gói thiền sáng sớm + Nước detox thanh lọc cơ thể.',200000,50000,TRUE),
(30,'COMBO-025','Sun Protection','Kem chống nắng + Mũ cói thời trang + Kính râm.',450000,100000,TRUE),
(31,'COMBO-026','Night Owl','Vé xem show nghệ thuật thực cảnh + Ăn nhẹ đêm.',800000,150000,TRUE),
(32,'COMBO-027','Camping Night','Thuê lều trại cao cấp + Đèn trang trí + Củi đốt lửa trại.',600000,120000,TRUE),
(33,'COMBO-028','Fishing Gear','Cho thuê cần câu chuyên dụng + Mồi câu + Thuyền thúng.',400000,80000,TRUE),
(34,'COMBO-029','Tet Holiday Pack','Giỏ quà Tết truyền thống + Bao lì xì may mắn.',1000000,200000,TRUE),
(35,'COMBO-030','Birthday Surprise','Bánh kem sinh nhật + Pháo bông + Bài hát chúc mừng.',350000,50000,TRUE),
(36,'COMBO-031','Full Option Add-on','Bao gồm bảo hiểm, Sim, ăn nhẹ và chụp ảnh (Gói tổng hợp).',2000000,500000,TRUE);


INSERT IGNORE INTO combo_package_items (
    combo_id, item_type, item_ref_id, item_name, quantity, unit_price
) VALUES
(6,'addon',NULL,'Nước suối',2,10000),
(6,'addon',NULL,'Áo mưa',1,30000),
(7,'addon',NULL,'SIM 4G Vinaphone 4GB/Ngày',1,200000),
(7,'service',NULL,'Thuê sạc dự phòng 10.000mAh',1,50000),
(8,'service',NULL,'Bảo hiểm du lịch (mức 50tr)',1,100000),
(8,'addon',NULL,'Túi sơ cứu y tế cá nhân',1,50000),
(9,'service',NULL,'Thuê bộ phát Wifi di động',1,250000),
(9,'service',NULL,'Phí giữ chỗ làm việc (Co-working)',1,100000),
(10,'addon',NULL,'Suất ăn nhẹ (Bánh mì/Xôi)',3,50000),
(10,'addon',NULL,'Đồ uống (Trà sữa/Cafe)',1,50000),
(11,'addon',NULL,'Cơm hộp Bento cao cấp',1,85000),
(11,'addon',NULL,'Nước suối Aquafina 500ml',1,15000),
(11,'addon',NULL,'Trái cây tráng miệng',1,20000),
(12,'addon',NULL,'Set hải sản nướng (Tôm, mực, hàu)',1,400000),
(12,'service',NULL,'Phí phục vụ nướng tại bàn',1,150000),
(13,'addon',NULL,'Bia Sài Gòn/Hà Nội',4,40000),
(13,'addon',NULL,'Mồi nhắm (Khô mực/Lạc)',1,140000),
(14,'addon',NULL,'Set trà cung đình Huế',1,100000),
(14,'addon',NULL,'Bánh đậu xanh/Bánh in',2,40000),
(15,'service',NULL,'Thợ chụp ảnh chuyên nghiệp',1,1000000),
(15,'service',NULL,'Gói hậu kỳ & chỉnh sửa ảnh',1,500000),
(16,'service',NULL,'Quay phim Flycam',1,1500000),
(16,'service',NULL,'Dựng clip highlight (60s)',1,1000000),
(17,'gift',NULL,'Trà đặc sản vùng miền',1,150000),
(17,'gift',NULL,'Mứt/Bánh kẹo địa phương',2,75000),
(18,'gift',NULL,'Rượu vang Đà Lạt/Ninh Thuận',1,450000),
(18,'gift',NULL,'Hải sản khô cao cấp (túi)',2,175000),
(20,'service',NULL,'Vé vào phòng chờ thương gia',1,450000),
(21,'service',NULL,'Phụ phí nâng hạng xe Limousine',1,1200000),
(23,'addon',NULL,'Set menu Âu 5 món',2,750000),
(23,'service',NULL,'Trang trí nến & hoa tươi',1,500000),
(25,'addon',NULL,'Áo thun đồng phục đoàn',10,120000),
(25,'addon',NULL,'Cờ đội & Băng rôn',1,300000),
(26,'service',NULL,'Thuê sân khấu & Backdrop',1,2000000),
(26,'service',NULL,'Hệ thống âm thanh ánh sáng',1,3000000),
(28,'service',NULL,'Liệu trình Massage chân',1,400000),
(30,'addon',NULL,'Kem chống nắng La Roche-Posay',1,250000),
(30,'addon',NULL,'Mũ cói đi biển',1,100000),
(30,'addon',NULL,'Kính râm thời trang',1,100000),
(32,'service',NULL,'Thuê lều cắm trại 4 người',1,350000),
(32,'addon',NULL,'Bộ đèn trang trí & củi khô',1,250000),
(35,'addon',NULL,'Bánh kem sinh nhật (20cm)',1,250000),
(35,'addon',NULL,'Nến, pháo bông & mũ sinh nhật',1,100000),
(36,'service',NULL,'Gói bảo hiểm cao cấp',1,500000),
(36,'service',NULL,'Gói chụp ảnh suốt hành trình',1,1000000),
(36,'addon',NULL,'Bộ quà tặng đặc biệt',1,500000);


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


-- VOUCHER REDEMPTIONS
INSERT IGNORE INTO voucher_redemptions (id, voucher_id, user_id, order_id, booking_id, redeemed_amount, status, redeemed_at, note)
VALUES (1,5,'550e8400-e29b-41d4-a716-446655440001',42,1,150000,'applied',CURRENT_TIMESTAMP,'Áp dụng voucher cho booking seed');


SET FOREIGN_KEY_CHECKS = 1;
