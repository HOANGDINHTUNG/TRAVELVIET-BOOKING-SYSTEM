SET FOREIGN_KEY_CHECKS = 0;
UPDATE tours
SET esg_score = 88, lei_score = 78, list_price = 7600000
WHERE code = 'TOUR_PQ_01';


UPDATE tours
SET esg_score = 86, lei_score = 73, list_price = 4300000
WHERE code = 'TOUR_HL_01';


UPDATE tours
SET esg_score = 82, lei_score = 71, list_price = 3200000
WHERE code = 'TOUR_SP_01';


UPDATE tours
SET esg_score = 81, lei_score = 70, list_price = 3900000
WHERE code = 'TOUR_HG_01';


UPDATE tours
SET esg_score = 84, lei_score = 72, list_price = 5200000
WHERE code = 'TOUR_DN_01';


UPDATE tours
SET esg_score = 89, lei_score = 76, list_price = 128000000
WHERE code = 'TOUR_US_CA';


UPDATE tours
SET list_price = 76000000
WHERE code = 'TOUR_EU_09';


UPDATE tours
SET list_price = 45000000
WHERE code = 'TOUR_MV_01';


UPDATE tours
SET list_price = 59000000
WHERE code = 'TOUR_EG_01';


UPDATE tours
SET list_price = 62000000
WHERE code = 'TOUR_CA_01';


UPDATE tours
SET list_price = 98000000
WHERE code = 'TOUR_NZ_01';


UPDATE tours
SET list_price = 43000000
WHERE code = 'TOUR_TR_01';


-- Bổ sung ESG/LEI cho toàn bộ 100 tour còn thiếu điểm:
-- - Chỉ áp dụng cho bản ghi chưa đủ 2 chỉ số (esg_score hoặc lei_score đang NULL)
-- - Sinh điểm giả lập > 70 để hiển thị badge theo yêu cầu UI
UPDATE tours
SET
    esg_score = 61 + MOD(id * 7, 40),
    lei_score = 61 + MOD(id * 11, 40)
WHERE id BETWEEN 1 AND 100
  AND (esg_score IS NULL OR lei_score IS NULL);


-- Tăng dữ liệu mẫu cho rule "Giá tốt" (giảm >= 12%):
-- Chỉ áp dụng cho tour chưa có line tag Cao cấp/Tiêu chuẩn/Tiết kiệm và chưa có list_price.
-- Mục tiêu: khi test UI sẽ thấy rõ nhóm "Giá tốt" theo điều kiện mới.
UPDATE tours t
SET t.list_price = ROUND(t.base_price * 1.16)
WHERE t.id BETWEEN 1 AND 100
  AND (t.list_price IS NULL OR t.list_price <= t.base_price)
  AND MOD(t.id, 3) = 0
  AND NOT EXISTS (
    SELECT 1
    FROM tour_tags tt
    JOIN tags tg ON tg.id = tt.tag_id
    WHERE tt.tour_id = t.id
      AND tg.code IN ('TOUR_LINE_CAO_CAP', 'TOUR_LINE_TIEU_CHUAN', 'TOUR_LINE_TIET_KIEM')
  );
INSERT IGNORE INTO guide_translations (guide_id, locale, full_name, bio)
VALUES
(1, 'en', 'Minh Tran', 'Enthusiastic licensed guide specializing in central Vietnam food and culture.'),
(2, 'en', 'Lan Nguyen', 'Historian guide focused on Hoi An heritage and highland cultures.');
-- =====================================================================
-- CUỐI V7: Booking readiness wave 1 (flash / beach / hot tours)
-- booked_seats = 0; marketing "còn ít chỗ" chỉ ghi trong note
-- =====================================================================

UPDATE tours
SET is_featured = TRUE
WHERE id IN (41, 46, 50, 63, 78, 89)
  AND deleted_at IS NULL;


-- ============================================================
-- 05B_TOURS_REBUILT - Tour mới đồng bộ với destinations level 2
-- Quy ước: LOCAL_VN = tour trong một tỉnh/thành; TRANS_VN = xuyên Việt; FOREIGN_LOCAL = một nước; MULTI_COUNTRY = nhiều nước.
-- destination_id luôn trỏ tới một destination level 2 làm điểm chính của tour.
-- ============================================================

INSERT IGNORE INTO tours (
    id, code, name, slug, cancellation_policy_id, short_description, description, highlights, inclusions, exclusions, duration_days, duration_nights, max_group_size, min_age, base_price, currency, trip_mode, status, is_featured
) VALUES
(1,'TOUR_LOCAL_VN_001','TOUR HÀ NỘI 1 NGÀY: KHÁM PHÁ HỒ HOÀN KIẾM - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','ha-noi-1n-kham-pha-ho-hoan-kiem',1,'Tour nội địa trong phạm vi Hà Nội','Hành trình chỉ di chuyển trong Hà Nội, phù hợp khách muốn khám phá sâu Hồ Hoàn Kiếm và văn hóa địa phương mà không phải đổi tỉnh/thành.','Hồ Hoàn Kiếm, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(2,'TOUR_LOCAL_VN_002','TOUR HÀ NỘI 2 NGÀY 1 ĐÊM: KHÁM PHÁ VĂN MIẾU - QUỐC TỬ GIÁM - CHẤT LƯỢNG CAO','ha-noi-2n-kham-pha-van-mieu-quoc-tu-giam',1,'Tour nội địa trong phạm vi Hà Nội','Hành trình chỉ di chuyển trong Hà Nội, phù hợp khách muốn khám phá sâu Văn Miếu - Quốc Tử Giám và văn hóa địa phương mà không phải đổi tỉnh/thành.','Văn Miếu - Quốc Tử Giám, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(3,'TOUR_LOCAL_VN_003','TOUR HUẾ 1 NGÀY: KHÁM PHÁ ĐẠI NỘI HUẾ - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','hue-1n-kham-pha-ai-noi-hue',1,'Tour nội địa trong phạm vi Huế','Hành trình chỉ di chuyển trong Huế, phù hợp khách muốn khám phá sâu Đại Nội Huế và văn hóa địa phương mà không phải đổi tỉnh/thành.','Đại Nội Huế, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(4,'TOUR_LOCAL_VN_004','TOUR HUẾ 2 NGÀY 1 ĐÊM: KHÁM PHÁ LĂNG KHẢI ĐỊNH - CHẤT LƯỢNG CAO','hue-2n-kham-pha-lang-khai-inh',1,'Tour nội địa trong phạm vi Huế','Hành trình chỉ di chuyển trong Huế, phù hợp khách muốn khám phá sâu Lăng Khải Định và văn hóa địa phương mà không phải đổi tỉnh/thành.','Lăng Khải Định, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(5,'TOUR_LOCAL_VN_005','TOUR HẢI PHÒNG 1 NGÀY: KHÁM PHÁ ĐẢO CÁT BÀ - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','hai-phong-1n-kham-pha-ao-cat-ba',1,'Tour nội địa trong phạm vi Hải Phòng','Hành trình chỉ di chuyển trong Hải Phòng, phù hợp khách muốn khám phá sâu Đảo Cát Bà và văn hóa địa phương mà không phải đổi tỉnh/thành.','Đảo Cát Bà, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(6,'TOUR_LOCAL_VN_006','TOUR HẢI PHÒNG 2 NGÀY 1 ĐÊM: KHÁM PHÁ VỊNH LAN HẠ - CHẤT LƯỢNG CAO','hai-phong-2n-kham-pha-vinh-lan-ha',1,'Tour nội địa trong phạm vi Hải Phòng','Hành trình chỉ di chuyển trong Hải Phòng, phù hợp khách muốn khám phá sâu Vịnh Lan Hạ và văn hóa địa phương mà không phải đổi tỉnh/thành.','Vịnh Lan Hạ, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(7,'TOUR_LOCAL_VN_007','TOUR ĐÀ NẴNG 1 NGÀY: KHÁM PHÁ BÀ NÀ HILLS - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','a-nang-1n-kham-pha-ba-na-hills',1,'Tour nội địa trong phạm vi Đà Nẵng','Hành trình chỉ di chuyển trong Đà Nẵng, phù hợp khách muốn khám phá sâu Bà Nà Hills và văn hóa địa phương mà không phải đổi tỉnh/thành.','Bà Nà Hills, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(8,'TOUR_LOCAL_VN_008','TOUR ĐÀ NẴNG 2 NGÀY 1 ĐÊM: KHÁM PHÁ CẦU RỒNG - CHẤT LƯỢNG CAO','a-nang-2n-kham-pha-cau-rong',1,'Tour nội địa trong phạm vi Đà Nẵng','Hành trình chỉ di chuyển trong Đà Nẵng, phù hợp khách muốn khám phá sâu Cầu Rồng và văn hóa địa phương mà không phải đổi tỉnh/thành.','Cầu Rồng, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(9,'TOUR_LOCAL_VN_009','TOUR TP. HỒ CHÍ MINH 1 NGÀY: KHÁM PHÁ DINH ĐỘC LẬP - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','tp-ho-chi-minh-1n-kham-pha-dinh-oc-lap',1,'Tour nội địa trong phạm vi TP. Hồ Chí Minh','Hành trình chỉ di chuyển trong TP. Hồ Chí Minh, phù hợp khách muốn khám phá sâu Dinh Độc Lập và văn hóa địa phương mà không phải đổi tỉnh/thành.','Dinh Độc Lập, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(10,'TOUR_LOCAL_VN_010','TOUR TP. HỒ CHÍ MINH 2 NGÀY 1 ĐÊM: KHÁM PHÁ NHÀ THỜ ĐỨC BÀ - CHẤT LƯỢNG CAO','tp-ho-chi-minh-2n-kham-pha-nha-tho-uc-ba',1,'Tour nội địa trong phạm vi TP. Hồ Chí Minh','Hành trình chỉ di chuyển trong TP. Hồ Chí Minh, phù hợp khách muốn khám phá sâu Nhà thờ Đức Bà và văn hóa địa phương mà không phải đổi tỉnh/thành.','Nhà thờ Đức Bà, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(11,'TOUR_LOCAL_VN_011','TOUR CẦN THƠ 1 NGÀY: KHÁM PHÁ CHỢ NỔI CÁI RĂNG - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','can-tho-1n-kham-pha-cho-noi-cai-rang',1,'Tour nội địa trong phạm vi Cần Thơ','Hành trình chỉ di chuyển trong Cần Thơ, phù hợp khách muốn khám phá sâu Chợ nổi Cái Răng và văn hóa địa phương mà không phải đổi tỉnh/thành.','Chợ nổi Cái Răng, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(12,'TOUR_LOCAL_VN_012','TOUR CẦN THƠ 2 NGÀY 1 ĐÊM: KHÁM PHÁ BẾN NINH KIỀU - CHẤT LƯỢNG CAO','can-tho-2n-kham-pha-ben-ninh-kieu',1,'Tour nội địa trong phạm vi Cần Thơ','Hành trình chỉ di chuyển trong Cần Thơ, phù hợp khách muốn khám phá sâu Bến Ninh Kiều và văn hóa địa phương mà không phải đổi tỉnh/thành.','Bến Ninh Kiều, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(13,'TOUR_LOCAL_VN_013','TOUR TUYÊN QUANG 1 NGÀY: KHÁM PHÁ KHU DI TÍCH TÂN TRÀO - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','tuyen-quang-1n-kham-pha-khu-di-tich-tan-trao',1,'Tour nội địa trong phạm vi Tuyên Quang','Hành trình chỉ di chuyển trong Tuyên Quang, phù hợp khách muốn khám phá sâu Khu di tích Tân Trào và văn hóa địa phương mà không phải đổi tỉnh/thành.','Khu di tích Tân Trào, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(14,'TOUR_LOCAL_VN_014','TOUR TUYÊN QUANG 2 NGÀY 1 ĐÊM: KHÁM PHÁ HỒ NA HANG - CHẤT LƯỢNG CAO','tuyen-quang-2n-kham-pha-ho-na-hang',1,'Tour nội địa trong phạm vi Tuyên Quang','Hành trình chỉ di chuyển trong Tuyên Quang, phù hợp khách muốn khám phá sâu Hồ Na Hang và văn hóa địa phương mà không phải đổi tỉnh/thành.','Hồ Na Hang, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(15,'TOUR_LOCAL_VN_015','TOUR LÀO CAI 1 NGÀY: KHÁM PHÁ SA PA - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','lao-cai-1n-kham-pha-sa-pa',1,'Tour nội địa trong phạm vi Lào Cai','Hành trình chỉ di chuyển trong Lào Cai, phù hợp khách muốn khám phá sâu Sa Pa và văn hóa địa phương mà không phải đổi tỉnh/thành.','Sa Pa, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(16,'TOUR_LOCAL_VN_016','TOUR LÀO CAI 2 NGÀY 1 ĐÊM: KHÁM PHÁ ĐỈNH FANSIPAN - CHẤT LƯỢNG CAO','lao-cai-2n-kham-pha-inh-fansipan',1,'Tour nội địa trong phạm vi Lào Cai','Hành trình chỉ di chuyển trong Lào Cai, phù hợp khách muốn khám phá sâu Đỉnh Fansipan và văn hóa địa phương mà không phải đổi tỉnh/thành.','Đỉnh Fansipan, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(17,'TOUR_LOCAL_VN_017','TOUR LAI CHÂU 1 NGÀY: KHÁM PHÁ PU TA LENG - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','lai-chau-1n-kham-pha-pu-ta-leng',1,'Tour nội địa trong phạm vi Lai Châu','Hành trình chỉ di chuyển trong Lai Châu, phù hợp khách muốn khám phá sâu Pu Ta Leng và văn hóa địa phương mà không phải đổi tỉnh/thành.','Pu Ta Leng, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(18,'TOUR_LOCAL_VN_018','TOUR LAI CHÂU 2 NGÀY 1 ĐÊM: KHÁM PHÁ ĐÈO Ô QUY HỒ - CHẤT LƯỢNG CAO','lai-chau-2n-kham-pha-eo-o-quy-ho',1,'Tour nội địa trong phạm vi Lai Châu','Hành trình chỉ di chuyển trong Lai Châu, phù hợp khách muốn khám phá sâu Đèo Ô Quy Hồ và văn hóa địa phương mà không phải đổi tỉnh/thành.','Đèo Ô Quy Hồ, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(19,'TOUR_LOCAL_VN_019','TOUR ĐIỆN BIÊN 1 NGÀY: KHÁM PHÁ ĐỒI A1 - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','ien-bien-1n-kham-pha-oi-a1',1,'Tour nội địa trong phạm vi Điện Biên','Hành trình chỉ di chuyển trong Điện Biên, phù hợp khách muốn khám phá sâu Đồi A1 và văn hóa địa phương mà không phải đổi tỉnh/thành.','Đồi A1, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(20,'TOUR_LOCAL_VN_020','TOUR ĐIỆN BIÊN 2 NGÀY 1 ĐÊM: KHÁM PHÁ BẢO TÀNG CHIẾN THẮNG ĐIỆN BIÊN PHỦ - CHẤT LƯỢNG CAO','ien-bien-2n-kham-pha-bao-tang-chien-thang-ien-bien-phu',1,'Tour nội địa trong phạm vi Điện Biên','Hành trình chỉ di chuyển trong Điện Biên, phù hợp khách muốn khám phá sâu Bảo tàng Chiến thắng Điện Biên Phủ và văn hóa địa phương mà không phải đổi tỉnh/thành.','Bảo tàng Chiến thắng Điện Biên Phủ, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(21,'TOUR_LOCAL_VN_021','TOUR SƠN LA 1 NGÀY: KHÁM PHÁ MỘC CHÂU - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','son-la-1n-kham-pha-moc-chau',1,'Tour nội địa trong phạm vi Sơn La','Hành trình chỉ di chuyển trong Sơn La, phù hợp khách muốn khám phá sâu Mộc Châu và văn hóa địa phương mà không phải đổi tỉnh/thành.','Mộc Châu, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(22,'TOUR_LOCAL_VN_022','TOUR SƠN LA 2 NGÀY 1 ĐÊM: KHÁM PHÁ TÀ XÙA - CHẤT LƯỢNG CAO','son-la-2n-kham-pha-ta-xua',1,'Tour nội địa trong phạm vi Sơn La','Hành trình chỉ di chuyển trong Sơn La, phù hợp khách muốn khám phá sâu Tà Xùa và văn hóa địa phương mà không phải đổi tỉnh/thành.','Tà Xùa, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(23,'TOUR_LOCAL_VN_023','TOUR LẠNG SƠN 1 NGÀY: KHÁM PHÁ MẪU SƠN - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','lang-son-1n-kham-pha-mau-son',1,'Tour nội địa trong phạm vi Lạng Sơn','Hành trình chỉ di chuyển trong Lạng Sơn, phù hợp khách muốn khám phá sâu Mẫu Sơn và văn hóa địa phương mà không phải đổi tỉnh/thành.','Mẫu Sơn, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(24,'TOUR_LOCAL_VN_024','TOUR LẠNG SƠN 2 NGÀY 1 ĐÊM: KHÁM PHÁ ĐỘNG TAM THANH - CHẤT LƯỢNG CAO','lang-son-2n-kham-pha-ong-tam-thanh',1,'Tour nội địa trong phạm vi Lạng Sơn','Hành trình chỉ di chuyển trong Lạng Sơn, phù hợp khách muốn khám phá sâu Động Tam Thanh và văn hóa địa phương mà không phải đổi tỉnh/thành.','Động Tam Thanh, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(25,'TOUR_LOCAL_VN_025','TOUR CAO BẰNG 1 NGÀY: KHÁM PHÁ THÁC BẢN GIỐC - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','cao-bang-1n-kham-pha-thac-ban-gioc',1,'Tour nội địa trong phạm vi Cao Bằng','Hành trình chỉ di chuyển trong Cao Bằng, phù hợp khách muốn khám phá sâu Thác Bản Giốc và văn hóa địa phương mà không phải đổi tỉnh/thành.','Thác Bản Giốc, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(26,'TOUR_LOCAL_VN_026','TOUR CAO BẰNG 2 NGÀY 1 ĐÊM: KHÁM PHÁ ĐỘNG NGƯỜM NGAO - CHẤT LƯỢNG CAO','cao-bang-2n-kham-pha-ong-nguom-ngao',1,'Tour nội địa trong phạm vi Cao Bằng','Hành trình chỉ di chuyển trong Cao Bằng, phù hợp khách muốn khám phá sâu Động Ngườm Ngao và văn hóa địa phương mà không phải đổi tỉnh/thành.','Động Ngườm Ngao, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(27,'TOUR_LOCAL_VN_027','TOUR THÁI NGUYÊN 1 NGÀY: KHÁM PHÁ HỒ NÚI CỐC - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','thai-nguyen-1n-kham-pha-ho-nui-coc',1,'Tour nội địa trong phạm vi Thái Nguyên','Hành trình chỉ di chuyển trong Thái Nguyên, phù hợp khách muốn khám phá sâu Hồ Núi Cốc và văn hóa địa phương mà không phải đổi tỉnh/thành.','Hồ Núi Cốc, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(28,'TOUR_LOCAL_VN_028','TOUR THÁI NGUYÊN 2 NGÀY 1 ĐÊM: KHÁM PHÁ ĐỒI CHÈ TÂN CƯƠNG - CHẤT LƯỢNG CAO','thai-nguyen-2n-kham-pha-oi-che-tan-cuong',1,'Tour nội địa trong phạm vi Thái Nguyên','Hành trình chỉ di chuyển trong Thái Nguyên, phù hợp khách muốn khám phá sâu Đồi chè Tân Cương và văn hóa địa phương mà không phải đổi tỉnh/thành.','Đồi chè Tân Cương, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(29,'TOUR_LOCAL_VN_029','TOUR PHÚ THỌ 1 NGÀY: KHÁM PHÁ ĐỀN HÙNG - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','phu-tho-1n-kham-pha-en-hung',1,'Tour nội địa trong phạm vi Phú Thọ','Hành trình chỉ di chuyển trong Phú Thọ, phù hợp khách muốn khám phá sâu Đền Hùng và văn hóa địa phương mà không phải đổi tỉnh/thành.','Đền Hùng, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(30,'TOUR_LOCAL_VN_030','TOUR PHÚ THỌ 2 NGÀY 1 ĐÊM: KHÁM PHÁ VƯỜN QUỐC GIA XUÂN SƠN - CHẤT LƯỢNG CAO','phu-tho-2n-kham-pha-vuon-quoc-gia-xuan-son',1,'Tour nội địa trong phạm vi Phú Thọ','Hành trình chỉ di chuyển trong Phú Thọ, phù hợp khách muốn khám phá sâu Vườn quốc gia Xuân Sơn và văn hóa địa phương mà không phải đổi tỉnh/thành.','Vườn quốc gia Xuân Sơn, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(31,'TOUR_LOCAL_VN_031','TOUR BẮC NINH 1 NGÀY: KHÁM PHÁ CHÙA DÂU - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','bac-ninh-1n-kham-pha-chua-dau',1,'Tour nội địa trong phạm vi Bắc Ninh','Hành trình chỉ di chuyển trong Bắc Ninh, phù hợp khách muốn khám phá sâu Chùa Dâu và văn hóa địa phương mà không phải đổi tỉnh/thành.','Chùa Dâu, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(32,'TOUR_LOCAL_VN_032','TOUR BẮC NINH 2 NGÀY 1 ĐÊM: KHÁM PHÁ CHÙA BÚT THÁP - CHẤT LƯỢNG CAO','bac-ninh-2n-kham-pha-chua-but-thap',1,'Tour nội địa trong phạm vi Bắc Ninh','Hành trình chỉ di chuyển trong Bắc Ninh, phù hợp khách muốn khám phá sâu Chùa Bút Tháp và văn hóa địa phương mà không phải đổi tỉnh/thành.','Chùa Bút Tháp, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(33,'TOUR_LOCAL_VN_033','TOUR HƯNG YÊN 1 NGÀY: KHÁM PHÁ PHỐ HIẾN - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','hung-yen-1n-kham-pha-pho-hien',1,'Tour nội địa trong phạm vi Hưng Yên','Hành trình chỉ di chuyển trong Hưng Yên, phù hợp khách muốn khám phá sâu Phố Hiến và văn hóa địa phương mà không phải đổi tỉnh/thành.','Phố Hiến, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(34,'TOUR_LOCAL_VN_034','TOUR HƯNG YÊN 2 NGÀY 1 ĐÊM: KHÁM PHÁ ĐỀN CHỬ ĐỒNG TỬ - CHẤT LƯỢNG CAO','hung-yen-2n-kham-pha-en-chu-ong-tu',1,'Tour nội địa trong phạm vi Hưng Yên','Hành trình chỉ di chuyển trong Hưng Yên, phù hợp khách muốn khám phá sâu Đền Chử Đồng Tử và văn hóa địa phương mà không phải đổi tỉnh/thành.','Đền Chử Đồng Tử, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(35,'TOUR_LOCAL_VN_035','TOUR NINH BÌNH 1 NGÀY: KHÁM PHÁ TRÀNG AN - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','ninh-binh-1n-kham-pha-trang-an',1,'Tour nội địa trong phạm vi Ninh Bình','Hành trình chỉ di chuyển trong Ninh Bình, phù hợp khách muốn khám phá sâu Tràng An và văn hóa địa phương mà không phải đổi tỉnh/thành.','Tràng An, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(36,'TOUR_LOCAL_VN_036','TOUR NINH BÌNH 2 NGÀY 1 ĐÊM: KHÁM PHÁ TAM CỐC - BÍCH ĐỘNG - CHẤT LƯỢNG CAO','ninh-binh-2n-kham-pha-tam-coc-bich-ong',1,'Tour nội địa trong phạm vi Ninh Bình','Hành trình chỉ di chuyển trong Ninh Bình, phù hợp khách muốn khám phá sâu Tam Cốc - Bích Động và văn hóa địa phương mà không phải đổi tỉnh/thành.','Tam Cốc - Bích Động, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(37,'TOUR_LOCAL_VN_037','TOUR QUẢNG NINH 1 NGÀY: KHÁM PHÁ VỊNH HẠ LONG - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','quang-ninh-1n-kham-pha-vinh-ha-long',1,'Tour nội địa trong phạm vi Quảng Ninh','Hành trình chỉ di chuyển trong Quảng Ninh, phù hợp khách muốn khám phá sâu Vịnh Hạ Long và văn hóa địa phương mà không phải đổi tỉnh/thành.','Vịnh Hạ Long, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(38,'TOUR_LOCAL_VN_038','TOUR QUẢNG NINH 2 NGÀY 1 ĐÊM: KHÁM PHÁ YÊN TỬ - CHẤT LƯỢNG CAO','quang-ninh-2n-kham-pha-yen-tu',1,'Tour nội địa trong phạm vi Quảng Ninh','Hành trình chỉ di chuyển trong Quảng Ninh, phù hợp khách muốn khám phá sâu Yên Tử và văn hóa địa phương mà không phải đổi tỉnh/thành.','Yên Tử, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(39,'TOUR_LOCAL_VN_039','TOUR THANH HÓA 1 NGÀY: KHÁM PHÁ BIỂN SẦM SƠN - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','thanh-hoa-1n-kham-pha-bien-sam-son',1,'Tour nội địa trong phạm vi Thanh Hóa','Hành trình chỉ di chuyển trong Thanh Hóa, phù hợp khách muốn khám phá sâu Biển Sầm Sơn và văn hóa địa phương mà không phải đổi tỉnh/thành.','Biển Sầm Sơn, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(40,'TOUR_LOCAL_VN_040','TOUR THANH HÓA 2 NGÀY 1 ĐÊM: KHÁM PHÁ PÙ LUÔNG - CHẤT LƯỢNG CAO','thanh-hoa-2n-kham-pha-pu-luong',1,'Tour nội địa trong phạm vi Thanh Hóa','Hành trình chỉ di chuyển trong Thanh Hóa, phù hợp khách muốn khám phá sâu Pù Luông và văn hóa địa phương mà không phải đổi tỉnh/thành.','Pù Luông, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(41,'TOUR_LOCAL_VN_041','TOUR NGHỆ AN 1 NGÀY: KHÁM PHÁ BIỂN CỬA LÒ - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','nghe-an-1n-kham-pha-bien-cua-lo',1,'Tour nội địa trong phạm vi Nghệ An','Hành trình chỉ di chuyển trong Nghệ An, phù hợp khách muốn khám phá sâu Biển Cửa Lò và văn hóa địa phương mà không phải đổi tỉnh/thành.','Biển Cửa Lò, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(42,'TOUR_LOCAL_VN_042','TOUR NGHỆ AN 2 NGÀY 1 ĐÊM: KHÁM PHÁ LÀNG SEN QUÊ BÁC - CHẤT LƯỢNG CAO','nghe-an-2n-kham-pha-lang-sen-que-bac',1,'Tour nội địa trong phạm vi Nghệ An','Hành trình chỉ di chuyển trong Nghệ An, phù hợp khách muốn khám phá sâu Làng Sen quê Bác và văn hóa địa phương mà không phải đổi tỉnh/thành.','Làng Sen quê Bác, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(43,'TOUR_LOCAL_VN_043','TOUR HÀ TĨNH 1 NGÀY: KHÁM PHÁ BIỂN THIÊN CẦM - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','ha-tinh-1n-kham-pha-bien-thien-cam',1,'Tour nội địa trong phạm vi Hà Tĩnh','Hành trình chỉ di chuyển trong Hà Tĩnh, phù hợp khách muốn khám phá sâu Biển Thiên Cầm và văn hóa địa phương mà không phải đổi tỉnh/thành.','Biển Thiên Cầm, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(44,'TOUR_LOCAL_VN_044','TOUR HÀ TĨNH 2 NGÀY 1 ĐÊM: KHÁM PHÁ CHÙA HƯƠNG TÍCH - CHẤT LƯỢNG CAO','ha-tinh-2n-kham-pha-chua-huong-tich',1,'Tour nội địa trong phạm vi Hà Tĩnh','Hành trình chỉ di chuyển trong Hà Tĩnh, phù hợp khách muốn khám phá sâu Chùa Hương Tích và văn hóa địa phương mà không phải đổi tỉnh/thành.','Chùa Hương Tích, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(45,'TOUR_LOCAL_VN_045','TOUR QUẢNG TRỊ 1 NGÀY: KHÁM PHÁ THÀNH CỔ QUẢNG TRỊ - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','quang-tri-1n-kham-pha-thanh-co-quang-tri',1,'Tour nội địa trong phạm vi Quảng Trị','Hành trình chỉ di chuyển trong Quảng Trị, phù hợp khách muốn khám phá sâu Thành cổ Quảng Trị và văn hóa địa phương mà không phải đổi tỉnh/thành.','Thành cổ Quảng Trị, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(46,'TOUR_LOCAL_VN_046','TOUR QUẢNG TRỊ 2 NGÀY 1 ĐÊM: KHÁM PHÁ ĐỊA ĐẠO VỊNH MỐC - CHẤT LƯỢNG CAO','quang-tri-2n-kham-pha-ia-ao-vinh-moc',1,'Tour nội địa trong phạm vi Quảng Trị','Hành trình chỉ di chuyển trong Quảng Trị, phù hợp khách muốn khám phá sâu Địa đạo Vịnh Mốc và văn hóa địa phương mà không phải đổi tỉnh/thành.','Địa đạo Vịnh Mốc, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(47,'TOUR_LOCAL_VN_047','TOUR QUẢNG NGÃI 1 NGÀY: KHÁM PHÁ ĐẢO LÝ SƠN - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','quang-ngai-1n-kham-pha-ao-ly-son',1,'Tour nội địa trong phạm vi Quảng Ngãi','Hành trình chỉ di chuyển trong Quảng Ngãi, phù hợp khách muốn khám phá sâu Đảo Lý Sơn và văn hóa địa phương mà không phải đổi tỉnh/thành.','Đảo Lý Sơn, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(48,'TOUR_LOCAL_VN_048','TOUR QUẢNG NGÃI 2 NGÀY 1 ĐÊM: KHÁM PHÁ BIỂN MỸ KHÊ QUẢNG NGÃI - CHẤT LƯỢNG CAO','quang-ngai-2n-kham-pha-bien-my-khe-quang-ngai',1,'Tour nội địa trong phạm vi Quảng Ngãi','Hành trình chỉ di chuyển trong Quảng Ngãi, phù hợp khách muốn khám phá sâu Biển Mỹ Khê Quảng Ngãi và văn hóa địa phương mà không phải đổi tỉnh/thành.','Biển Mỹ Khê Quảng Ngãi, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(49,'TOUR_LOCAL_VN_049','TOUR GIA LAI 1 NGÀY: KHÁM PHÁ BIỂN HỒ PLEIKU - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','gia-lai-1n-kham-pha-bien-ho-pleiku',1,'Tour nội địa trong phạm vi Gia Lai','Hành trình chỉ di chuyển trong Gia Lai, phù hợp khách muốn khám phá sâu Biển Hồ Pleiku và văn hóa địa phương mà không phải đổi tỉnh/thành.','Biển Hồ Pleiku, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(50,'TOUR_LOCAL_VN_050','TOUR GIA LAI 2 NGÀY 1 ĐÊM: KHÁM PHÁ GHỀNH RÁNG TIÊN SA - CHẤT LƯỢNG CAO','gia-lai-2n-kham-pha-ghenh-rang-tien-sa',1,'Tour nội địa trong phạm vi Gia Lai','Hành trình chỉ di chuyển trong Gia Lai, phù hợp khách muốn khám phá sâu Ghềnh Ráng Tiên Sa và văn hóa địa phương mà không phải đổi tỉnh/thành.','Ghềnh Ráng Tiên Sa, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(51,'TOUR_LOCAL_VN_051','TOUR ĐẮK LẮK 1 NGÀY: KHÁM PHÁ BUÔN MA THUỘT - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','ak-lak-1n-kham-pha-buon-ma-thuot',1,'Tour nội địa trong phạm vi Đắk Lắk','Hành trình chỉ di chuyển trong Đắk Lắk, phù hợp khách muốn khám phá sâu Buôn Ma Thuột và văn hóa địa phương mà không phải đổi tỉnh/thành.','Buôn Ma Thuột, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(52,'TOUR_LOCAL_VN_052','TOUR ĐẮK LẮK 2 NGÀY 1 ĐÊM: KHÁM PHÁ BUÔN ĐÔN - CHẤT LƯỢNG CAO','ak-lak-2n-kham-pha-buon-on',1,'Tour nội địa trong phạm vi Đắk Lắk','Hành trình chỉ di chuyển trong Đắk Lắk, phù hợp khách muốn khám phá sâu Buôn Đôn và văn hóa địa phương mà không phải đổi tỉnh/thành.','Buôn Đôn, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(53,'TOUR_LOCAL_VN_053','TOUR KHÁNH HÒA 1 NGÀY: KHÁM PHÁ NHA TRANG - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','khanh-hoa-1n-kham-pha-nha-trang',1,'Tour nội địa trong phạm vi Khánh Hòa','Hành trình chỉ di chuyển trong Khánh Hòa, phù hợp khách muốn khám phá sâu Nha Trang và văn hóa địa phương mà không phải đổi tỉnh/thành.','Nha Trang, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(54,'TOUR_LOCAL_VN_054','TOUR KHÁNH HÒA 2 NGÀY 1 ĐÊM: KHÁM PHÁ VINWONDERS NHA TRANG - CHẤT LƯỢNG CAO','khanh-hoa-2n-kham-pha-vinwonders-nha-trang',1,'Tour nội địa trong phạm vi Khánh Hòa','Hành trình chỉ di chuyển trong Khánh Hòa, phù hợp khách muốn khám phá sâu VinWonders Nha Trang và văn hóa địa phương mà không phải đổi tỉnh/thành.','VinWonders Nha Trang, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(55,'TOUR_LOCAL_VN_055','TOUR LÂM ĐỒNG 1 NGÀY: KHÁM PHÁ ĐÀ LẠT - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','lam-ong-1n-kham-pha-a-lat',1,'Tour nội địa trong phạm vi Lâm Đồng','Hành trình chỉ di chuyển trong Lâm Đồng, phù hợp khách muốn khám phá sâu Đà Lạt và văn hóa địa phương mà không phải đổi tỉnh/thành.','Đà Lạt, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(56,'TOUR_LOCAL_VN_056','TOUR LÂM ĐỒNG 2 NGÀY 1 ĐÊM: KHÁM PHÁ HỒ XUÂN HƯƠNG - CHẤT LƯỢNG CAO','lam-ong-2n-kham-pha-ho-xuan-huong',1,'Tour nội địa trong phạm vi Lâm Đồng','Hành trình chỉ di chuyển trong Lâm Đồng, phù hợp khách muốn khám phá sâu Hồ Xuân Hương và văn hóa địa phương mà không phải đổi tỉnh/thành.','Hồ Xuân Hương, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(57,'TOUR_LOCAL_VN_057','TOUR ĐỒNG NAI 1 NGÀY: KHÁM PHÁ HỒ TRỊ AN - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','ong-nai-1n-kham-pha-ho-tri-an',1,'Tour nội địa trong phạm vi Đồng Nai','Hành trình chỉ di chuyển trong Đồng Nai, phù hợp khách muốn khám phá sâu Hồ Trị An và văn hóa địa phương mà không phải đổi tỉnh/thành.','Hồ Trị An, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(58,'TOUR_LOCAL_VN_058','TOUR ĐỒNG NAI 2 NGÀY 1 ĐÊM: KHÁM PHÁ VƯỜN QUỐC GIA NAM CÁT TIÊN - CHẤT LƯỢNG CAO','ong-nai-2n-kham-pha-vuon-quoc-gia-nam-cat-tien',1,'Tour nội địa trong phạm vi Đồng Nai','Hành trình chỉ di chuyển trong Đồng Nai, phù hợp khách muốn khám phá sâu Vườn quốc gia Nam Cát Tiên và văn hóa địa phương mà không phải đổi tỉnh/thành.','Vườn quốc gia Nam Cát Tiên, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(59,'TOUR_LOCAL_VN_059','TOUR TÂY NINH 1 NGÀY: KHÁM PHÁ NÚI BÀ ĐEN - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','tay-ninh-1n-kham-pha-nui-ba-en',1,'Tour nội địa trong phạm vi Tây Ninh','Hành trình chỉ di chuyển trong Tây Ninh, phù hợp khách muốn khám phá sâu Núi Bà Đen và văn hóa địa phương mà không phải đổi tỉnh/thành.','Núi Bà Đen, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(60,'TOUR_LOCAL_VN_060','TOUR TÂY NINH 2 NGÀY 1 ĐÊM: KHÁM PHÁ TÒA THÁNH CAO ĐÀI - CHẤT LƯỢNG CAO','tay-ninh-2n-kham-pha-toa-thanh-cao-ai',1,'Tour nội địa trong phạm vi Tây Ninh','Hành trình chỉ di chuyển trong Tây Ninh, phù hợp khách muốn khám phá sâu Tòa Thánh Cao Đài và văn hóa địa phương mà không phải đổi tỉnh/thành.','Tòa Thánh Cao Đài, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(61,'TOUR_LOCAL_VN_061','TOUR ĐỒNG THÁP 1 NGÀY: KHÁM PHÁ VƯỜN QUỐC GIA TRÀM CHIM - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','ong-thap-1n-kham-pha-vuon-quoc-gia-tram-chim',1,'Tour nội địa trong phạm vi Đồng Tháp','Hành trình chỉ di chuyển trong Đồng Tháp, phù hợp khách muốn khám phá sâu Vườn quốc gia Tràm Chim và văn hóa địa phương mà không phải đổi tỉnh/thành.','Vườn quốc gia Tràm Chim, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(62,'TOUR_LOCAL_VN_062','TOUR ĐỒNG THÁP 2 NGÀY 1 ĐÊM: KHÁM PHÁ LÀNG HOA SA ĐÉC - CHẤT LƯỢNG CAO','ong-thap-2n-kham-pha-lang-hoa-sa-ec',1,'Tour nội địa trong phạm vi Đồng Tháp','Hành trình chỉ di chuyển trong Đồng Tháp, phù hợp khách muốn khám phá sâu Làng hoa Sa Đéc và văn hóa địa phương mà không phải đổi tỉnh/thành.','Làng hoa Sa Đéc, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(63,'TOUR_LOCAL_VN_063','TOUR AN GIANG 1 NGÀY: KHÁM PHÁ RỪNG TRÀM TRÀ SƯ - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','an-giang-1n-kham-pha-rung-tram-tra-su',1,'Tour nội địa trong phạm vi An Giang','Hành trình chỉ di chuyển trong An Giang, phù hợp khách muốn khám phá sâu Rừng tràm Trà Sư và văn hóa địa phương mà không phải đổi tỉnh/thành.','Rừng tràm Trà Sư, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(64,'TOUR_LOCAL_VN_064','TOUR AN GIANG 2 NGÀY 1 ĐÊM: KHÁM PHÁ MIẾU BÀ CHÚA XỨ NÚI SAM - CHẤT LƯỢNG CAO','an-giang-2n-kham-pha-mieu-ba-chua-xu-nui-sam',1,'Tour nội địa trong phạm vi An Giang','Hành trình chỉ di chuyển trong An Giang, phù hợp khách muốn khám phá sâu Miếu Bà Chúa Xứ Núi Sam và văn hóa địa phương mà không phải đổi tỉnh/thành.','Miếu Bà Chúa Xứ Núi Sam, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(65,'TOUR_LOCAL_VN_065','TOUR VĨNH LONG 1 NGÀY: KHÁM PHÁ CÙ LAO AN BÌNH - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','vinh-long-1n-kham-pha-cu-lao-an-binh',1,'Tour nội địa trong phạm vi Vĩnh Long','Hành trình chỉ di chuyển trong Vĩnh Long, phù hợp khách muốn khám phá sâu Cù lao An Bình và văn hóa địa phương mà không phải đổi tỉnh/thành.','Cù lao An Bình, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(66,'TOUR_LOCAL_VN_066','TOUR VĨNH LONG 2 NGÀY 1 ĐÊM: KHÁM PHÁ VĂN THÁNH MIẾU VĨNH LONG - CHẤT LƯỢNG CAO','vinh-long-2n-kham-pha-van-thanh-mieu-vinh-long',1,'Tour nội địa trong phạm vi Vĩnh Long','Hành trình chỉ di chuyển trong Vĩnh Long, phù hợp khách muốn khám phá sâu Văn Thánh Miếu Vĩnh Long và văn hóa địa phương mà không phải đổi tỉnh/thành.','Văn Thánh Miếu Vĩnh Long, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(67,'TOUR_LOCAL_VN_067','TOUR CÀ MAU 1 NGÀY: KHÁM PHÁ MŨI CÀ MAU - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','ca-mau-1n-kham-pha-mui-ca-mau',1,'Tour nội địa trong phạm vi Cà Mau','Hành trình chỉ di chuyển trong Cà Mau, phù hợp khách muốn khám phá sâu Mũi Cà Mau và văn hóa địa phương mà không phải đổi tỉnh/thành.','Mũi Cà Mau, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',1,0,30,0,900000,'VND','group','active',TRUE),
(68,'TOUR_LOCAL_VN_068','TOUR CÀ MAU 2 NGÀY 1 ĐÊM: KHÁM PHÁ RỪNG U MINH HẠ - CHẤT LƯỢNG CAO','ca-mau-2n-kham-pha-rung-u-minh-ha',1,'Tour nội địa trong phạm vi Cà Mau','Hành trình chỉ di chuyển trong Cà Mau, phù hợp khách muốn khám phá sâu Rừng U Minh Hạ và văn hóa địa phương mà không phải đổi tỉnh/thành.','Rừng U Minh Hạ, ẩm thực địa phương, trải nghiệm văn hóa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',2,1,30,0,1800000,'VND','group','active',FALSE),
(69,'TOUR_LOCAL_VN_069','TOUR NGHỈ DƯỠNG VỊNH HẠ LONG 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-vinh-ha-long-3n2',1,'Tour nội địa tại Quảng Ninh','Lịch trình nghỉ dưỡng và tham quan tập trung trong Quảng Ninh, lấy Vịnh Hạ Long làm điểm chính để làm tour.','Vịnh Hạ Long, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(70,'TOUR_LOCAL_VN_070','TOUR NGHỈ DƯỠNG SA PA 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-sa-pa-3n2',1,'Tour nội địa tại Lào Cai','Lịch trình nghỉ dưỡng và tham quan tập trung trong Lào Cai, lấy Sa Pa làm điểm chính để làm tour.','Sa Pa, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(71,'TOUR_LOCAL_VN_071','TOUR NGHỈ DƯỠNG TRÀNG AN 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-trang-an-3n2',1,'Tour nội địa tại Ninh Bình','Lịch trình nghỉ dưỡng và tham quan tập trung trong Ninh Bình, lấy Tràng An làm điểm chính để làm tour.','Tràng An, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(72,'TOUR_LOCAL_VN_072','TOUR NGHỈ DƯỠNG ĐÀ LẠT 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-a-lat-3n2',1,'Tour nội địa tại Lâm Đồng','Lịch trình nghỉ dưỡng và tham quan tập trung trong Lâm Đồng, lấy Đà Lạt làm điểm chính để làm tour.','Đà Lạt, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(73,'TOUR_LOCAL_VN_073','TOUR NGHỈ DƯỠNG PHÚ QUỐC 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-phu-quoc-3n2',1,'Tour nội địa tại An Giang','Lịch trình nghỉ dưỡng và tham quan tập trung trong An Giang, lấy Phú Quốc làm điểm chính để làm tour.','Phú Quốc, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(74,'TOUR_LOCAL_VN_074','TOUR NGHỈ DƯỠNG BÀ NÀ HILLS 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-ba-na-hills-3n2',1,'Tour nội địa tại Đà Nẵng','Lịch trình nghỉ dưỡng và tham quan tập trung trong Đà Nẵng, lấy Bà Nà Hills làm điểm chính để làm tour.','Bà Nà Hills, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(75,'TOUR_LOCAL_VN_075','TOUR NGHỈ DƯỠNG MŨI NÉ 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-mui-ne-3n2',1,'Tour nội địa tại Lâm Đồng','Lịch trình nghỉ dưỡng và tham quan tập trung trong Lâm Đồng, lấy Mũi Né làm điểm chính để làm tour.','Mũi Né, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(76,'TOUR_LOCAL_VN_076','TOUR NGHỈ DƯỠNG CÔN ĐẢO 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-con-ao-3n2',1,'Tour nội địa tại TP. Hồ Chí Minh','Lịch trình nghỉ dưỡng và tham quan tập trung trong TP. Hồ Chí Minh, lấy Côn Đảo làm điểm chính để làm tour.','Côn Đảo, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(77,'TOUR_LOCAL_VN_077','TOUR NGHỈ DƯỠNG RỪNG TRÀM TRÀ SƯ 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-rung-tram-tra-su-3n2',1,'Tour nội địa tại An Giang','Lịch trình nghỉ dưỡng và tham quan tập trung trong An Giang, lấy Rừng tràm Trà Sư làm điểm chính để làm tour.','Rừng tràm Trà Sư, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(78,'TOUR_LOCAL_VN_078','TOUR NGHỈ DƯỠNG MỘC CHÂU 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-moc-chau-3n2',1,'Tour nội địa tại Sơn La','Lịch trình nghỉ dưỡng và tham quan tập trung trong Sơn La, lấy Mộc Châu làm điểm chính để làm tour.','Mộc Châu, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(79,'TOUR_LOCAL_VN_079','TOUR NGHỈ DƯỠNG CAO NGUYÊN ĐÁ ĐỒNG VĂN 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-cao-nguyen-a-ong-van-3n2',1,'Tour nội địa tại Tuyên Quang','Lịch trình nghỉ dưỡng và tham quan tập trung trong Tuyên Quang, lấy Cao nguyên đá Đồng Văn làm điểm chính để làm tour.','Cao nguyên đá Đồng Văn, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(80,'TOUR_LOCAL_VN_080','TOUR NGHỈ DƯỠNG NHA TRANG 3N2Đ 3 NGÀY 2 ĐÊM CAO CẤP','nghi-duong-nha-trang-3n2',1,'Tour nội địa tại Khánh Hòa','Lịch trình nghỉ dưỡng và tham quan tập trung trong Khánh Hòa, lấy Nha Trang làm điểm chính để làm tour.','Nha Trang, check-in, nghỉ dưỡng, đặc sản','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',3,2,12,0,3780000,'VND','private','active',TRUE),
(81,'TOUR_TRANS_VN_081','TOUR XUYÊN VIỆT DI SẢN BẮC BỘ 6N 6 NGÀY 5 ĐÊM CAO CẤP','xuyen-viet-di-san-bac-bo-6n',1,'Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Hà Nội – Ninh Bình – Hạ Long – Sa Pa. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.','Hồ Hoàn Kiếm, Tràng An, Vịnh Hạ Long, Sa Pa','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',6,5,30,0,7560000,'VND','group','active',TRUE),
(82,'TOUR_TRANS_VN_082','TOUR XUYÊN VIỆT MIỀN TRUNG DI SẢN 5N 5 NGÀY 4 ĐÊM CAO CẤP','xuyen-viet-mien-trung-di-san-5n',1,'Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Huế – Đà Nẵng – Hội An – Quảng Ngãi. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.','Đại Nội Huế, Bà Nà Hills, Hội An, Lý Sơn','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,6300000,'VND','group','active',TRUE),
(83,'TOUR_TRANS_VN_083','TOUR XUYÊN VIỆT BIỂN ĐẢO PHƯƠNG NAM 7N 7 NGÀY 6 ĐÊM CAO CẤP','xuyen-viet-bien-ao-phuong-nam-7n',1,'Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: TP.HCM – Côn Đảo – Phú Quốc – Cần Thơ. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.','Dinh Độc Lập, Côn Đảo, Phú Quốc, Chợ nổi Cái Răng','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',7,6,30,0,8820000,'VND','group','active',TRUE),
(84,'TOUR_TRANS_VN_084','TOUR ĐẠI VÒNG CUNG TÂY BẮC 6N 6 NGÀY 5 ĐÊM CAO CẤP','ai-vong-cung-tay-bac-6n',1,'Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Hà Nội – Mộc Châu – Điện Biên – Sa Pa. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.','Mộc Châu, Điện Biên Phủ, Sa Pa, Fansipan','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',6,5,30,0,7560000,'VND','group','active',TRUE),
(85,'TOUR_TRANS_VN_085','TOUR CUNG ĐƯỜNG ĐÔNG BẮC 5N 5 NGÀY 4 ĐÊM CAO CẤP','cung-uong-ong-bac-5n',1,'Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Cao Bằng – Lạng Sơn – Quảng Ninh. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.','Thác Bản Giốc, Mẫu Sơn, Vịnh Hạ Long','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,6300000,'VND','group','active',TRUE),
(86,'TOUR_TRANS_VN_086','TOUR TÂY NGUYÊN ĐẠI NGÀN 5N 5 NGÀY 4 ĐÊM CAO CẤP','tay-nguyen-ai-ngan-5n',1,'Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Đắk Lắk – Gia Lai – Lâm Đồng. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.','Buôn Ma Thuột, Biển Hồ Gia Lai, Đà Lạt','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,6300000,'VND','group','active',TRUE),
(87,'TOUR_TRANS_VN_087','TOUR MIỀN TÂY SÔNG NƯỚC 5N 5 NGÀY 4 ĐÊM CAO CẤP','mien-tay-song-nuoc-5n',1,'Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Cần Thơ – Đồng Tháp – An Giang – Cà Mau. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.','Chợ nổi Cái Răng, Tràm Chim, Rừng tràm Trà Sư, Mũi Cà Mau','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,6300000,'VND','group','active',TRUE),
(88,'TOUR_TRANS_VN_088','TOUR HÀNH TRÌNH BIỂN MIỀN TRUNG 6N 6 NGÀY 5 ĐÊM CAO CẤP','hanh-trinh-bien-mien-trung-6n',1,'Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Thanh Hóa – Nghệ An – Hà Tĩnh – Huế – Đà Nẵng. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.','Sầm Sơn, Cửa Lò, Thiên Cầm, Đại Nội Huế, Mỹ Khê','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',6,5,30,0,7560000,'VND','group','active',TRUE),
(89,'TOUR_TRANS_VN_089','TOUR TỪ SÀI GÒN RA HÀ NỘI 8N 8 NGÀY 7 ĐÊM CAO CẤP','tu-sai-gon-ra-ha-noi-8n',1,'Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: TP.HCM – Nha Trang – Đà Nẵng – Huế – Hà Nội. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.','Dinh Độc Lập, Nha Trang, Bà Nà Hills, Đại Nội Huế, Hồ Hoàn Kiếm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',8,7,30,0,10080000,'VND','group','active',TRUE),
(90,'TOUR_TRANS_VN_090','TOUR VIỆT NAM GRAND TOUR 10N 10 NGÀY 9 ĐÊM CAO CẤP','viet-nam-grand-tour-10n',1,'Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Hà Nội – Hạ Long – Huế – Đà Nẵng – Hội An – TP.HCM – Cần Thơ. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.','Hồ Hoàn Kiếm, Vịnh Hạ Long, Đại Nội Huế, Hội An, Dinh Độc Lập, Chợ nổi Cái Răng','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',10,9,30,0,12600000,'VND','group','active',TRUE),
(91,'TOUR_FOREIGN_LOCAL_091','TOUR HÀN QUỐC 4 NGÀY 3 ĐÊM: KHÁM PHÁ SEOUL - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','han-quoc-4n-kham-pha-seoul',2,'Tour quốc tế tại Hàn Quốc','Tour quốc tế tập trung trong Hàn Quốc, chọn Seoul làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Seoul, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',TRUE),
(92,'TOUR_FOREIGN_LOCAL_092','TOUR HÀN QUỐC PREMIUM BUSAN 5N 5 NGÀY 4 ĐÊM CAO CẤP','han-quoc-premium-busan-5n',2,'Tour quốc tế cao cấp tại Hàn Quốc','Hành trình cao cấp khám phá Busan và các điểm nổi tiếng trong Hàn Quốc, phù hợp nhóm nhỏ hoặc gia đình.','Busan, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(93,'TOUR_FOREIGN_LOCAL_093','TOUR NHẬT BẢN 4 NGÀY 3 ĐÊM: KHÁM PHÁ TOKYO - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','nhat-ban-4n-kham-pha-tokyo',2,'Tour quốc tế tại Nhật Bản','Tour quốc tế tập trung trong Nhật Bản, chọn Tokyo làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Tokyo, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',TRUE),
(94,'TOUR_FOREIGN_LOCAL_094','TOUR NHẬT BẢN PREMIUM KYOTO 5N 5 NGÀY 4 ĐÊM CAO CẤP','nhat-ban-premium-kyoto-5n',2,'Tour quốc tế cao cấp tại Nhật Bản','Hành trình cao cấp khám phá Kyoto và các điểm nổi tiếng trong Nhật Bản, phù hợp nhóm nhỏ hoặc gia đình.','Kyoto, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(95,'TOUR_FOREIGN_LOCAL_095','TOUR THÁI LAN 4 NGÀY 3 ĐÊM: KHÁM PHÁ BANGKOK - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','thai-lan-4n-kham-pha-bangkok',2,'Tour quốc tế tại Thái Lan','Tour quốc tế tập trung trong Thái Lan, chọn Bangkok làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Bangkok, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',TRUE),
(96,'TOUR_FOREIGN_LOCAL_096','TOUR THÁI LAN PREMIUM PHUKET 5N 5 NGÀY 4 ĐÊM CAO CẤP','thai-lan-premium-phuket-5n',2,'Tour quốc tế cao cấp tại Thái Lan','Hành trình cao cấp khám phá Phuket và các điểm nổi tiếng trong Thái Lan, phù hợp nhóm nhỏ hoặc gia đình.','Phuket, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(97,'TOUR_FOREIGN_LOCAL_097','TOUR SINGAPORE 4 NGÀY 3 ĐÊM: KHÁM PHÁ MARINA BAY SANDS - CHẤT LƯỢNG CAO','singapore-4n-kham-pha-marina-bay-sands',2,'Tour quốc tế tại Singapore','Tour quốc tế tập trung trong Singapore, chọn Marina Bay Sands làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Marina Bay Sands, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(98,'TOUR_FOREIGN_LOCAL_098','TOUR MALAYSIA 4 NGÀY 3 ĐÊM: KHÁM PHÁ KUALA LUMPUR - CHẤT LƯỢNG CAO','malaysia-4n-kham-pha-kuala-lumpur',2,'Tour quốc tế tại Malaysia','Tour quốc tế tập trung trong Malaysia, chọn Kuala Lumpur làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Kuala Lumpur, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(99,'TOUR_FOREIGN_LOCAL_099','TOUR INDONESIA 4 NGÀY 3 ĐÊM: KHÁM PHÁ BALI - CHẤT LƯỢNG CAO','indonesia-4n-kham-pha-bali',2,'Tour quốc tế tại Indonesia','Tour quốc tế tập trung trong Indonesia, chọn Bali làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Bali, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(100,'TOUR_FOREIGN_LOCAL_100','TOUR TRUNG QUỐC 4 NGÀY 3 ĐÊM: KHÁM PHÁ BEIJING - CHẤT LƯỢNG CAO','trung-quoc-4n-kham-pha-beijing',2,'Tour quốc tế tại Trung Quốc','Tour quốc tế tập trung trong Trung Quốc, chọn Beijing làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Beijing, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(101,'TOUR_FOREIGN_LOCAL_101','TOUR TRUNG QUỐC PREMIUM SHANGHAI 5N 5 NGÀY 4 ĐÊM CAO CẤP','trung-quoc-premium-shanghai-5n',2,'Tour quốc tế cao cấp tại Trung Quốc','Hành trình cao cấp khám phá Shanghai và các điểm nổi tiếng trong Trung Quốc, phù hợp nhóm nhỏ hoặc gia đình.','Shanghai, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(102,'TOUR_FOREIGN_LOCAL_102','TOUR ĐÀI LOAN 4 NGÀY 3 ĐÊM: KHÁM PHÁ TAIPEI - CHẤT LƯỢNG CAO','ai-loan-4n-kham-pha-taipei',2,'Tour quốc tế tại Đài Loan','Tour quốc tế tập trung trong Đài Loan, chọn Taipei làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Taipei, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(103,'TOUR_FOREIGN_LOCAL_103','TOUR HỒNG KÔNG 4 NGÀY 3 ĐÊM: KHÁM PHÁ VICTORIA PEAK - CHẤT LƯỢNG CAO','hong-kong-4n-kham-pha-victoria-peak',2,'Tour quốc tế tại Hồng Kông','Tour quốc tế tập trung trong Hồng Kông, chọn Victoria Peak làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Victoria Peak, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(104,'TOUR_FOREIGN_LOCAL_104','TOUR CAMPUCHIA 4 NGÀY 3 ĐÊM: KHÁM PHÁ SIEM REAP - CHẤT LƯỢNG CAO','campuchia-4n-kham-pha-siem-reap',2,'Tour quốc tế tại Campuchia','Tour quốc tế tập trung trong Campuchia, chọn Siem Reap làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Siem Reap, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(105,'TOUR_FOREIGN_LOCAL_105','TOUR LÀO 4 NGÀY 3 ĐÊM: KHÁM PHÁ LUANG PRABANG - CHẤT LƯỢNG CAO','lao-4n-kham-pha-luang-prabang',2,'Tour quốc tế tại Lào','Tour quốc tế tập trung trong Lào, chọn Luang Prabang làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Luang Prabang, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(106,'TOUR_FOREIGN_LOCAL_106','TOUR ẤN ĐỘ 4 NGÀY 3 ĐÊM: KHÁM PHÁ NEW DELHI - CHẤT LƯỢNG CAO','an-o-4n-kham-pha-new-delhi',2,'Tour quốc tế tại Ấn Độ','Tour quốc tế tập trung trong Ấn Độ, chọn New Delhi làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','New Delhi, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(107,'TOUR_FOREIGN_LOCAL_107','TOUR ẤN ĐỘ PREMIUM AGRA 5N 5 NGÀY 4 ĐÊM CAO CẤP','an-o-premium-agra-5n',2,'Tour quốc tế cao cấp tại Ấn Độ','Hành trình cao cấp khám phá Agra và các điểm nổi tiếng trong Ấn Độ, phù hợp nhóm nhỏ hoặc gia đình.','Agra, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(108,'TOUR_FOREIGN_LOCAL_108','TOUR MALDIVES 4 NGÀY 3 ĐÊM: KHÁM PHÁ MALE - CHẤT LƯỢNG CAO','maldives-4n-kham-pha-male',2,'Tour quốc tế tại Maldives','Tour quốc tế tập trung trong Maldives, chọn Male làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Male, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(109,'TOUR_FOREIGN_LOCAL_109','TOUR UAE 4 NGÀY 3 ĐÊM: KHÁM PHÁ DUBAI - CHẤT LƯỢNG CAO','uae-4n-kham-pha-dubai',2,'Tour quốc tế tại UAE','Tour quốc tế tập trung trong UAE, chọn Dubai làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Dubai, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(110,'TOUR_FOREIGN_LOCAL_110','TOUR THỔ NHĨ KỲ 4 NGÀY 3 ĐÊM: KHÁM PHÁ ISTANBUL - CHẤT LƯỢNG CAO','tho-nhi-ky-4n-kham-pha-istanbul',2,'Tour quốc tế tại Thổ Nhĩ Kỳ','Tour quốc tế tập trung trong Thổ Nhĩ Kỳ, chọn Istanbul làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Istanbul, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',4,3,30,0,14000000,'VND','group','active',FALSE),
(111,'TOUR_FOREIGN_LOCAL_111','TOUR PHÁP 5 NGÀY 4 ĐÊM: KHÁM PHÁ PARIS - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','phap-5n-kham-pha-paris',2,'Tour quốc tế tại Pháp','Tour quốc tế tập trung trong Pháp, chọn Paris làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Paris, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',TRUE),
(112,'TOUR_FOREIGN_LOCAL_112','TOUR Ý 5 NGÀY 4 ĐÊM: KHÁM PHÁ ROME - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','y-5n-kham-pha-rome',2,'Tour quốc tế tại Ý','Tour quốc tế tập trung trong Ý, chọn Rome làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Rome, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',TRUE),
(113,'TOUR_FOREIGN_LOCAL_113','TOUR Ý PREMIUM VENICE 5N 5 NGÀY 4 ĐÊM CAO CẤP','y-premium-venice-5n',2,'Tour quốc tế cao cấp tại Ý','Hành trình cao cấp khám phá Venice và các điểm nổi tiếng trong Ý, phù hợp nhóm nhỏ hoặc gia đình.','Venice, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(114,'TOUR_FOREIGN_LOCAL_114','TOUR VƯƠNG QUỐC ANH 5 NGÀY 4 ĐÊM: KHÁM PHÁ LONDON - CHẤT LƯỢNG CAO','vuong-quoc-anh-5n-kham-pha-london',2,'Tour quốc tế tại Vương quốc Anh','Tour quốc tế tập trung trong Vương quốc Anh, chọn London làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','London, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(115,'TOUR_FOREIGN_LOCAL_115','TOUR TÂY BAN NHA 5 NGÀY 4 ĐÊM: KHÁM PHÁ MADRID - CHẤT LƯỢNG CAO','tay-ban-nha-5n-kham-pha-madrid',2,'Tour quốc tế tại Tây Ban Nha','Tour quốc tế tập trung trong Tây Ban Nha, chọn Madrid làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Madrid, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(116,'TOUR_FOREIGN_LOCAL_116','TOUR TÂY BAN NHA PREMIUM BARCELONA 5N 5 NGÀY 4 ĐÊM CAO CẤP','tay-ban-nha-premium-barcelona-5n',2,'Tour quốc tế cao cấp tại Tây Ban Nha','Hành trình cao cấp khám phá Barcelona và các điểm nổi tiếng trong Tây Ban Nha, phù hợp nhóm nhỏ hoặc gia đình.','Barcelona, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(117,'TOUR_FOREIGN_LOCAL_117','TOUR ĐỨC 5 NGÀY 4 ĐÊM: KHÁM PHÁ BERLIN - CHẤT LƯỢNG CAO','uc-5n-kham-pha-berlin',2,'Tour quốc tế tại Đức','Tour quốc tế tập trung trong Đức, chọn Berlin làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Berlin, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(118,'TOUR_FOREIGN_LOCAL_118','TOUR ĐỨC PREMIUM MUNICH 5N 5 NGÀY 4 ĐÊM CAO CẤP','uc-premium-munich-5n',2,'Tour quốc tế cao cấp tại Đức','Hành trình cao cấp khám phá Munich và các điểm nổi tiếng trong Đức, phù hợp nhóm nhỏ hoặc gia đình.','Munich, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(119,'TOUR_FOREIGN_LOCAL_119','TOUR HÀ LAN 5 NGÀY 4 ĐÊM: KHÁM PHÁ AMSTERDAM - CHẤT LƯỢNG CAO','ha-lan-5n-kham-pha-amsterdam',2,'Tour quốc tế tại Hà Lan','Tour quốc tế tập trung trong Hà Lan, chọn Amsterdam làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Amsterdam, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(120,'TOUR_FOREIGN_LOCAL_120','TOUR THỤY SĨ 5 NGÀY 4 ĐÊM: KHÁM PHÁ ZURICH - CHẤT LƯỢNG CAO','thuy-si-5n-kham-pha-zurich',2,'Tour quốc tế tại Thụy Sĩ','Tour quốc tế tập trung trong Thụy Sĩ, chọn Zurich làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Zurich, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(121,'TOUR_FOREIGN_LOCAL_121','TOUR ÁO 5 NGÀY 4 ĐÊM: KHÁM PHÁ VIENNA - CHẤT LƯỢNG CAO','ao-5n-kham-pha-vienna',2,'Tour quốc tế tại Áo','Tour quốc tế tập trung trong Áo, chọn Vienna làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Vienna, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(122,'TOUR_FOREIGN_LOCAL_122','TOUR SÉC 5 NGÀY 4 ĐÊM: KHÁM PHÁ PRAGUE - CHẤT LƯỢNG CAO','sec-5n-kham-pha-prague',2,'Tour quốc tế tại Séc','Tour quốc tế tập trung trong Séc, chọn Prague làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Prague, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(123,'TOUR_FOREIGN_LOCAL_123','TOUR HY LẠP 5 NGÀY 4 ĐÊM: KHÁM PHÁ ATHENS - CHẤT LƯỢNG CAO','hy-lap-5n-kham-pha-athens',2,'Tour quốc tế tại Hy Lạp','Tour quốc tế tập trung trong Hy Lạp, chọn Athens làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Athens, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(124,'TOUR_FOREIGN_LOCAL_124','TOUR BỒ ĐÀO NHA 5 NGÀY 4 ĐÊM: KHÁM PHÁ LISBON - CHẤT LƯỢNG CAO','bo-ao-nha-5n-kham-pha-lisbon',2,'Tour quốc tế tại Bồ Đào Nha','Tour quốc tế tập trung trong Bồ Đào Nha, chọn Lisbon làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Lisbon, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(125,'TOUR_FOREIGN_LOCAL_125','TOUR PHẦN LAN 5 NGÀY 4 ĐÊM: KHÁM PHÁ HELSINKI - CHẤT LƯỢNG CAO','phan-lan-5n-kham-pha-helsinki',2,'Tour quốc tế tại Phần Lan','Tour quốc tế tập trung trong Phần Lan, chọn Helsinki làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Helsinki, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(126,'TOUR_FOREIGN_LOCAL_126','TOUR NA UY 5 NGÀY 4 ĐÊM: KHÁM PHÁ OSLO - CHẤT LƯỢNG CAO','na-uy-5n-kham-pha-oslo',2,'Tour quốc tế tại Na Uy','Tour quốc tế tập trung trong Na Uy, chọn Oslo làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Oslo, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(127,'TOUR_FOREIGN_LOCAL_127','TOUR ĐAN MẠCH 5 NGÀY 4 ĐÊM: KHÁM PHÁ COPENHAGEN - CHẤT LƯỢNG CAO','an-mach-5n-kham-pha-copenhagen',2,'Tour quốc tế tại Đan Mạch','Tour quốc tế tập trung trong Đan Mạch, chọn Copenhagen làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Copenhagen, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(128,'TOUR_FOREIGN_LOCAL_128','TOUR ICELAND 5 NGÀY 4 ĐÊM: KHÁM PHÁ REYKJAVIK - CHẤT LƯỢNG CAO','iceland-5n-kham-pha-reykjavik',2,'Tour quốc tế tại Iceland','Tour quốc tế tập trung trong Iceland, chọn Reykjavik làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Reykjavik, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(129,'TOUR_FOREIGN_LOCAL_129','TOUR AI CẬP 5 NGÀY 4 ĐÊM: KHÁM PHÁ CAIRO - CHẤT LƯỢNG CAO','ai-cap-5n-kham-pha-cairo',2,'Tour quốc tế tại Ai Cập','Tour quốc tế tập trung trong Ai Cập, chọn Cairo làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Cairo, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(130,'TOUR_FOREIGN_LOCAL_130','TOUR NAM PHI 5 NGÀY 4 ĐÊM: KHÁM PHÁ CAPE TOWN - CHẤT LƯỢNG CAO','nam-phi-5n-kham-pha-cape-town',2,'Tour quốc tế tại Nam Phi','Tour quốc tế tập trung trong Nam Phi, chọn Cape Town làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Cape Town, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(131,'TOUR_FOREIGN_LOCAL_131','TOUR MA-RỐC 5 NGÀY 4 ĐÊM: KHÁM PHÁ MARRAKECH - CHẤT LƯỢNG CAO','ma-roc-5n-kham-pha-marrakech',2,'Tour quốc tế tại Ma-rốc','Tour quốc tế tập trung trong Ma-rốc, chọn Marrakech làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Marrakech, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(132,'TOUR_FOREIGN_LOCAL_132','TOUR KENYA 5 NGÀY 4 ĐÊM: KHÁM PHÁ NAIROBI - CHẤT LƯỢNG CAO','kenya-5n-kham-pha-nairobi',2,'Tour quốc tế tại Kenya','Tour quốc tế tập trung trong Kenya, chọn Nairobi làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Nairobi, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(133,'TOUR_FOREIGN_LOCAL_133','TOUR TANZANIA 5 NGÀY 4 ĐÊM: KHÁM PHÁ SERENGETI - CHẤT LƯỢNG CAO','tanzania-5n-kham-pha-serengeti',2,'Tour quốc tế tại Tanzania','Tour quốc tế tập trung trong Tanzania, chọn Serengeti làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Serengeti, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(134,'TOUR_FOREIGN_LOCAL_134','TOUR HOA KỲ 5 NGÀY 4 ĐÊM: KHÁM PHÁ NEW YORK - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','hoa-ky-5n-kham-pha-new-york',2,'Tour quốc tế tại Hoa Kỳ','Tour quốc tế tập trung trong Hoa Kỳ, chọn New York làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','New York, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',TRUE),
(135,'TOUR_FOREIGN_LOCAL_135','TOUR HOA KỲ PREMIUM LOS ANGELES 5N 5 NGÀY 4 ĐÊM CAO CẤP','hoa-ky-premium-los-angeles-5n',2,'Tour quốc tế cao cấp tại Hoa Kỳ','Hành trình cao cấp khám phá Los Angeles và các điểm nổi tiếng trong Hoa Kỳ, phù hợp nhóm nhỏ hoặc gia đình.','Los Angeles, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(136,'TOUR_FOREIGN_LOCAL_136','TOUR CANADA 5 NGÀY 4 ĐÊM: KHÁM PHÁ TORONTO - CHẤT LƯỢNG CAO','canada-5n-kham-pha-toronto',2,'Tour quốc tế tại Canada','Tour quốc tế tập trung trong Canada, chọn Toronto làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Toronto, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(137,'TOUR_FOREIGN_LOCAL_137','TOUR CANADA PREMIUM VANCOUVER 5N 5 NGÀY 4 ĐÊM CAO CẤP','canada-premium-vancouver-5n',2,'Tour quốc tế cao cấp tại Canada','Hành trình cao cấp khám phá Vancouver và các điểm nổi tiếng trong Canada, phù hợp nhóm nhỏ hoặc gia đình.','Vancouver, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(138,'TOUR_FOREIGN_LOCAL_138','TOUR MEXICO 5 NGÀY 4 ĐÊM: KHÁM PHÁ MEXICO CITY - CHẤT LƯỢNG CAO','mexico-5n-kham-pha-mexico-city',2,'Tour quốc tế tại Mexico','Tour quốc tế tập trung trong Mexico, chọn Mexico City làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Mexico City, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(139,'TOUR_FOREIGN_LOCAL_139','TOUR BRAZIL 5 NGÀY 4 ĐÊM: KHÁM PHÁ RIO DE JANEIRO - CHẤT LƯỢNG CAO','brazil-5n-kham-pha-rio-de-janeiro',2,'Tour quốc tế tại Brazil','Tour quốc tế tập trung trong Brazil, chọn Rio de Janeiro làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Rio de Janeiro, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(140,'TOUR_FOREIGN_LOCAL_140','TOUR ARGENTINA 5 NGÀY 4 ĐÊM: KHÁM PHÁ BUENOS AIRES - CHẤT LƯỢNG CAO','argentina-5n-kham-pha-buenos-aires',2,'Tour quốc tế tại Argentina','Tour quốc tế tập trung trong Argentina, chọn Buenos Aires làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Buenos Aires, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(141,'TOUR_FOREIGN_LOCAL_141','TOUR PERU 5 NGÀY 4 ĐÊM: KHÁM PHÁ LIMA - CHẤT LƯỢNG CAO','peru-5n-kham-pha-lima',2,'Tour quốc tế tại Peru','Tour quốc tế tập trung trong Peru, chọn Lima làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Lima, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(142,'TOUR_FOREIGN_LOCAL_142','TOUR CHILE 5 NGÀY 4 ĐÊM: KHÁM PHÁ SANTIAGO - CHẤT LƯỢNG CAO','chile-5n-kham-pha-santiago',2,'Tour quốc tế tại Chile','Tour quốc tế tập trung trong Chile, chọn Santiago làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Santiago, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(143,'TOUR_FOREIGN_LOCAL_143','TOUR ÚC 5 NGÀY 4 ĐÊM: KHÁM PHÁ SYDNEY - NGHỈ DƯỠNG KHÁCH SẠN 5 SAO','uc-5n-kham-pha-sydney',2,'Tour quốc tế tại Úc','Tour quốc tế tập trung trong Úc, chọn Sydney làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Sydney, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',TRUE),
(144,'TOUR_FOREIGN_LOCAL_144','TOUR ÚC PREMIUM MELBOURNE 5N 5 NGÀY 4 ĐÊM CAO CẤP','uc-premium-melbourne-5n',2,'Tour quốc tế cao cấp tại Úc','Hành trình cao cấp khám phá Melbourne và các điểm nổi tiếng trong Úc, phù hợp nhóm nhỏ hoặc gia đình.','Melbourne, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(145,'TOUR_FOREIGN_LOCAL_145','TOUR NEW ZEALAND 5 NGÀY 4 ĐÊM: KHÁM PHÁ AUCKLAND - CHẤT LƯỢNG CAO','new-zealand-5n-kham-pha-auckland',2,'Tour quốc tế tại New Zealand','Tour quốc tế tập trung trong New Zealand, chọn Auckland làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Auckland, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(146,'TOUR_FOREIGN_LOCAL_146','TOUR NEW ZEALAND PREMIUM QUEENSTOWN 5N 5 NGÀY 4 ĐÊM CAO CẤP','new-zealand-premium-queenstown-5n',2,'Tour quốc tế cao cấp tại New Zealand','Hành trình cao cấp khám phá Queenstown và các điểm nổi tiếng trong New Zealand, phù hợp nhóm nhỏ hoặc gia đình.','Queenstown, trải nghiệm cao cấp, ẩm thực địa phương','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,12,0,24500000,'VND','private','active',TRUE),
(147,'TOUR_FOREIGN_LOCAL_147','TOUR FIJI 5 NGÀY 4 ĐÊM: KHÁM PHÁ NADI - CHẤT LƯỢNG CAO','fiji-5n-kham-pha-nadi',2,'Tour quốc tế tại Fiji','Tour quốc tế tập trung trong Fiji, chọn Nadi làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.','Nadi, city tour, ẩm thực, mua sắm','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',5,4,30,0,17500000,'VND','group','active',FALSE),
(148,'TOUR_MULTI_COUNTRY_148','TOUR ĐÔNG BẮC Á VÀNG SON 7N 7 NGÀY 6 ĐÊM CAO CẤP','ong-bac-a-vang-son-7n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Seoul – Tokyo – Kyoto. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Seoul, Tokyo, Kyoto','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',7,6,30,0,34300000,'VND','group','active',TRUE),
(149,'TOUR_MULTI_COUNTRY_149','TOUR NHẬT HÀN MÙA LÁ ĐỎ 8N 8 NGÀY 7 ĐÊM CAO CẤP','nhat-han-mua-la-o-8n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Osaka – Kyoto – Seoul – Busan. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Osaka, Kyoto, Seoul, Busan','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',8,7,30,0,39200000,'VND','group','active',TRUE),
(150,'TOUR_MULTI_COUNTRY_150','TOUR ASEAN CITY BREAK 6N 6 NGÀY 5 ĐÊM CAO CẤP','asean-city-break-6n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Bangkok – Singapore – Kuala Lumpur. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Bangkok, Singapore, Kuala Lumpur','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',6,5,30,0,29400000,'VND','group','active',TRUE),
(151,'TOUR_MULTI_COUNTRY_151','TOUR HÀNH TRÌNH ĐÔNG DƯƠNG 6N 6 NGÀY 5 ĐÊM CAO CẤP','hanh-trinh-ong-duong-6n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Luang Prabang – Siem Reap – Bangkok. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Luang Prabang, Siem Reap, Bangkok','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',6,5,30,0,29400000,'VND','group','active',TRUE),
(152,'TOUR_MULTI_COUNTRY_152','TOUR CHÂU ÂU KINH ĐIỂN 9N 9 NGÀY 8 ĐÊM CAO CẤP','chau-au-kinh-ien-9n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Paris – Rome – Venice – Zurich. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Paris, Rome, Venice, Zurich','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',9,8,30,0,44100000,'VND','group','active',TRUE),
(153,'TOUR_MULTI_COUNTRY_153','TOUR TÂY ÂU LÃNG MẠN 7N 7 NGÀY 6 ĐÊM CAO CẤP','tay-au-lang-man-7n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: London – Amsterdam – Paris. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','London, Amsterdam, Paris','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',7,6,30,0,34300000,'VND','group','active',TRUE),
(154,'TOUR_MULTI_COUNTRY_154','TOUR NAM ÂU ĐỊA TRUNG HẢI 7N 7 NGÀY 6 ĐÊM CAO CẤP','nam-au-ia-trung-hai-7n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Barcelona – Madrid – Lisbon. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Barcelona, Madrid, Lisbon','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',7,6,30,0,34300000,'VND','group','active',TRUE),
(155,'TOUR_MULTI_COUNTRY_155','TOUR BẮC ÂU & ICELAND 8N 8 NGÀY 7 ĐÊM CAO CẤP','bac-au-iceland-8n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Copenhagen – Oslo – Reykjavik. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Copenhagen, Oslo, Reykjavik','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',8,7,30,0,39200000,'VND','group','active',TRUE),
(156,'TOUR_MULTI_COUNTRY_156','TOUR BỜ TÂY HOA KỲ 8N 8 NGÀY 7 ĐÊM CAO CẤP','bo-tay-hoa-ky-8n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Los Angeles – Las Vegas – San Francisco. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Los Angeles, Las Vegas, San Francisco','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',8,7,30,0,39200000,'VND','group','active',TRUE),
(157,'TOUR_MULTI_COUNTRY_157','TOUR BẮC MỸ NỔI BẬT 8N 8 NGÀY 7 ĐÊM CAO CẤP','bac-my-noi-bat-8n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: New York – Washington D.C. – Toronto. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','New York, Washington D.C., Toronto','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',8,7,30,0,39200000,'VND','group','active',TRUE),
(158,'TOUR_MULTI_COUNTRY_158','TOUR ÚC NEW ZEALAND 10N 10 NGÀY 9 ĐÊM CAO CẤP','uc-new-zealand-10n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Sydney – Melbourne – Auckland – Queenstown. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Sydney, Melbourne, Auckland, Queenstown','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',10,9,30,0,49000000,'VND','group','active',TRUE),
(159,'TOUR_MULTI_COUNTRY_159','TOUR NAM MỸ HUYỀN THOẠI 10N 10 NGÀY 9 ĐÊM CAO CẤP','nam-my-huyen-thoai-10n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Rio de Janeiro – Buenos Aires – Cusco. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Rio de Janeiro, Buenos Aires, Cusco','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',10,9,30,0,49000000,'VND','group','active',TRUE),
(160,'TOUR_MULTI_COUNTRY_160','TOUR CHÂU PHI DI SẢN 10N 10 NGÀY 9 ĐÊM CAO CẤP','chau-phi-di-san-10n',2,'Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Cairo – Marrakech – Cape Town. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.','Cairo, Marrakech, Cape Town','Xe/HDV/vé tham quan theo chương trình, bảo hiểm du lịch cơ bản','Chi phí cá nhân, phụ thu phòng đơn, visa nếu có',10,9,30,0,49000000,'VND','group','active',TRUE);

INSERT IGNORE INTO tour_destinations (tour_id, destination_id) VALUES
(1,1000),
(2,1001),
(3,1005),
(4,1006),
(5,1010),
(6,1011),
(7,1014),
(8,1015),
(9,1020),
(10,1021),
(11,1025),
(12,1026),
(13,1029),
(14,1030),
(15,1033),
(16,1034),
(17,1038),
(18,1039),
(19,1042),
(20,1043),
(21,1046),
(22,1047),
(23,1051),
(24,1052),
(25,1055),
(26,1056),
(27,1059),
(28,1060),
(29,1063),
(30,1064),
(31,1067),
(32,1068),
(33,1071),
(34,1072),
(35,1075),
(36,1076),
(37,1080),
(38,1081),
(39,1085),
(40,1086),
(41,1089),
(42,1090),
(43,1093),
(44,1094),
(45,1097),
(46,1098),
(47,1102),
(48,1103),
(49,1106),
(50,1108),
(51,1111),
(52,1112),
(53,1116),
(54,1117),
(55,1121),
(56,1122),
(57,1126),
(58,1127),
(59,1131),
(60,1132),
(61,1135),
(62,1136),
(63,1139),
(64,1140),
(65,1143),
(66,1144),
(67,1147),
(68,1148),
(69,1080),
(70,1033),
(71,1075),
(72,1121),
(73,2256),
(74,1014),
(75,2241),
(76,1130),
(77,1139),
(78,1046),
(79,2219),
(80,1116),
(81,1033),
(82,1014),
(83,1025),
(84,1033),
(85,1080),
(86,1121),
(87,1147),
(88,1005),
(89,1000),
(90,1025),
(91,2000),
(92,2001),
(93,2005),
(94,2006),
(95,2011),
(96,2012),
(97,2016),
(98,2020),
(99,2025),
(100,2030),
(101,2031),
(102,2036),
(103,2041),
(104,2045),
(105,2049),
(106,2053),
(107,2054),
(108,2059),
(109,2063),
(110,2067),
(111,2072),
(112,2077),
(113,2078),
(114,2083),
(115,2088),
(116,2089),
(117,2093),
(118,2094),
(119,2098),
(120,2103),
(121,2108),
(122,2112),
(123,2116),
(124,2121),
(125,2125),
(126,2129),
(127,2134),
(128,2138),
(129,2143),
(130,2148),
(131,2153),
(132,2158),
(133,2162),
(134,2166),
(135,2167),
(136,2173),
(137,2174),
(138,2179),
(139,2184),
(140,2189),
(141,2194),
(142,2199),
(143,2203),
(144,2204),
(145,2209),
(146,2210),
(147,2215),
(148,2006),
(149,2001),
(150,2020),
(151,2011),
(152,2103),
(153,2072),
(154,2121),
(155,2138),
(156,2168),
(157,2173),
(158,2210),
(159,2195),
(160,2148);


INSERT IGNORE INTO tour_media (
    id, tour_id, media_type, media_url, alt_text, sort_order, is_active
) VALUES
(1,1,'cover','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01522','Ảnh tour Hà Nội 1N – Khám phá Hồ Hoàn Kiếm',0,TRUE),
(2,1,'image','https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01523','Trải nghiệm Hồ Hoàn Kiếm',1,TRUE),
(3,1,'image','https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01524','Toàn cảnh tour Hà Nội 1N – Khám phá Hồ Hoàn Kiếm',2,TRUE),
(4,2,'cover','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01525','Ảnh tour Hà Nội 2N – Khám phá Văn Miếu - Quốc Tử Giám',0,TRUE),
(5,2,'image','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01526','Trải nghiệm Văn Miếu - Quốc Tử Giám',1,TRUE),
(6,2,'image','https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01527','Toàn cảnh tour Hà Nội 2N – Khám phá Văn Miếu - Quốc Tử Giám',2,TRUE),
(7,3,'cover','https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01528','Ảnh tour Huế 1N – Khám phá Đại Nội Huế',0,TRUE),
(8,3,'image','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01529','Trải nghiệm Đại Nội Huế',1,TRUE),
(9,3,'image','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01530','Toàn cảnh tour Huế 1N – Khám phá Đại Nội Huế',2,TRUE),
(10,4,'cover','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01531','Ảnh tour Huế 2N – Khám phá Lăng Khải Định',0,TRUE),
(11,4,'image','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01532','Trải nghiệm Lăng Khải Định',1,TRUE),
(12,4,'image','https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01533','Toàn cảnh tour Huế 2N – Khám phá Lăng Khải Định',2,TRUE),
(13,5,'cover','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01534','Ảnh tour Hải Phòng 1N – Khám phá Đảo Cát Bà',0,TRUE),
(14,5,'image','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01535','Trải nghiệm Đảo Cát Bà',1,TRUE),
(15,5,'image','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01536','Toàn cảnh tour Hải Phòng 1N – Khám phá Đảo Cát Bà',2,TRUE),
(16,6,'cover','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01537','Ảnh tour Hải Phòng 2N – Khám phá Vịnh Lan Hạ',0,TRUE),
(17,6,'image','https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01538','Trải nghiệm Vịnh Lan Hạ',1,TRUE),
(18,6,'image','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01539','Toàn cảnh tour Hải Phòng 2N – Khám phá Vịnh Lan Hạ',2,TRUE),
(19,7,'cover','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01540','Ảnh tour Đà Nẵng 1N – Khám phá Bà Nà Hills',0,TRUE),
(20,7,'image','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01541','Trải nghiệm Bà Nà Hills',1,TRUE),
(21,7,'image','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01542','Toàn cảnh tour Đà Nẵng 1N – Khám phá Bà Nà Hills',2,TRUE),
(22,8,'cover','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01543','Ảnh tour Đà Nẵng 2N – Khám phá Cầu Rồng',0,TRUE),
(23,8,'image','https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01544','Trải nghiệm Cầu Rồng',1,TRUE),
(24,8,'image','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01545','Toàn cảnh tour Đà Nẵng 2N – Khám phá Cầu Rồng',2,TRUE),
(25,9,'cover','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01546','Ảnh tour TP. Hồ Chí Minh 1N – Khám phá Dinh Độc Lập',0,TRUE),
(26,9,'image','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01547','Trải nghiệm Dinh Độc Lập',1,TRUE),
(27,9,'image','https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01548','Toàn cảnh tour TP. Hồ Chí Minh 1N – Khám phá Dinh Độc Lập',2,TRUE),
(28,10,'cover','https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01549','Ảnh tour TP. Hồ Chí Minh 2N – Khám phá Nhà thờ Đức Bà',0,TRUE),
(29,10,'image','https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01550','Trải nghiệm Nhà thờ Đức Bà',1,TRUE),
(30,10,'image','https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01551','Toàn cảnh tour TP. Hồ Chí Minh 2N – Khám phá Nhà thờ Đức Bà',2,TRUE),
(31,11,'cover','https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01552','Ảnh tour Cần Thơ 1N – Khám phá Chợ nổi Cái Răng',0,TRUE),
(32,11,'image','https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01553','Trải nghiệm Chợ nổi Cái Răng',1,TRUE),
(33,11,'image','https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01554','Toàn cảnh tour Cần Thơ 1N – Khám phá Chợ nổi Cái Răng',2,TRUE),
(34,12,'cover','https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01555','Ảnh tour Cần Thơ 2N – Khám phá Bến Ninh Kiều',0,TRUE),
(35,12,'image','https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01556','Trải nghiệm Bến Ninh Kiều',1,TRUE),
(36,12,'image','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01557','Toàn cảnh tour Cần Thơ 2N – Khám phá Bến Ninh Kiều',2,TRUE),
(37,13,'cover','https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01558','Ảnh tour Tuyên Quang 1N – Khám phá Khu di tích Tân Trào',0,TRUE),
(38,13,'image','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01559','Trải nghiệm Khu di tích Tân Trào',1,TRUE),
(39,13,'image','https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01560','Toàn cảnh tour Tuyên Quang 1N – Khám phá Khu di tích Tân Trào',2,TRUE),
(40,14,'cover','https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01561','Ảnh tour Tuyên Quang 2N – Khám phá Hồ Na Hang',0,TRUE),
(41,14,'image','https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01562','Trải nghiệm Hồ Na Hang',1,TRUE),
(42,14,'image','https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01563','Toàn cảnh tour Tuyên Quang 2N – Khám phá Hồ Na Hang',2,TRUE),
(43,15,'cover','https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01564','Ảnh tour Lào Cai 1N – Khám phá Sa Pa',0,TRUE),
(44,15,'image','https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01565','Trải nghiệm Sa Pa',1,TRUE),
(45,15,'image','https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01566','Toàn cảnh tour Lào Cai 1N – Khám phá Sa Pa',2,TRUE),
(46,16,'cover','https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01567','Ảnh tour Lào Cai 2N – Khám phá Đỉnh Fansipan',0,TRUE),
(47,16,'image','https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01568','Trải nghiệm Đỉnh Fansipan',1,TRUE),
(48,16,'image','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01569','Toàn cảnh tour Lào Cai 2N – Khám phá Đỉnh Fansipan',2,TRUE),
(49,17,'cover','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01570','Ảnh tour Lai Châu 1N – Khám phá Pu Ta Leng',0,TRUE),
(50,17,'image','https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01571','Trải nghiệm Pu Ta Leng',1,TRUE),
(51,17,'image','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01572','Toàn cảnh tour Lai Châu 1N – Khám phá Pu Ta Leng',2,TRUE),
(52,18,'cover','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01573','Ảnh tour Lai Châu 2N – Khám phá Đèo Ô Quy Hồ',0,TRUE),
(53,18,'image','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01574','Trải nghiệm Đèo Ô Quy Hồ',1,TRUE),
(54,18,'image','https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01575','Toàn cảnh tour Lai Châu 2N – Khám phá Đèo Ô Quy Hồ',2,TRUE),
(55,19,'cover','https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01576','Ảnh tour Điện Biên 1N – Khám phá Đồi A1',0,TRUE),
(56,19,'image','https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01577','Trải nghiệm Đồi A1',1,TRUE),
(57,19,'image','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01578','Toàn cảnh tour Điện Biên 1N – Khám phá Đồi A1',2,TRUE),
(58,20,'cover','https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01579','Ảnh tour Điện Biên 2N – Khám phá Bảo tàng Chiến thắng Điện Biên Phủ',0,TRUE),
(59,20,'image','https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01580','Trải nghiệm Bảo tàng Chiến thắng Điện Biên Phủ',1,TRUE),
(60,20,'image','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01581','Toàn cảnh tour Điện Biên 2N – Khám phá Bảo tàng Chiến thắng Điện Biên Phủ',2,TRUE),
(61,21,'cover','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01582','Ảnh tour Sơn La 1N – Khám phá Mộc Châu',0,TRUE),
(62,21,'image','https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01583','Trải nghiệm Mộc Châu',1,TRUE),
(63,21,'image','https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01584','Toàn cảnh tour Sơn La 1N – Khám phá Mộc Châu',2,TRUE),
(64,22,'cover','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01585','Ảnh tour Sơn La 2N – Khám phá Tà Xùa',0,TRUE),
(65,22,'image','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01586','Trải nghiệm Tà Xùa',1,TRUE),
(66,22,'image','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01587','Toàn cảnh tour Sơn La 2N – Khám phá Tà Xùa',2,TRUE),
(67,23,'cover','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01588','Ảnh tour Lạng Sơn 1N – Khám phá Mẫu Sơn',0,TRUE),
(68,23,'image','https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01589','Trải nghiệm Mẫu Sơn',1,TRUE),
(69,23,'image','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01590','Toàn cảnh tour Lạng Sơn 1N – Khám phá Mẫu Sơn',2,TRUE),
(70,24,'cover','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01591','Ảnh tour Lạng Sơn 2N – Khám phá Động Tam Thanh',0,TRUE),
(71,24,'image','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01592','Trải nghiệm Động Tam Thanh',1,TRUE),
(72,24,'image','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01593','Toàn cảnh tour Lạng Sơn 2N – Khám phá Động Tam Thanh',2,TRUE),
(73,25,'cover','https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01594','Ảnh tour Cao Bằng 1N – Khám phá Thác Bản Giốc',0,TRUE),
(74,25,'image','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01595','Trải nghiệm Thác Bản Giốc',1,TRUE),
(75,25,'image','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01596','Toàn cảnh tour Cao Bằng 1N – Khám phá Thác Bản Giốc',2,TRUE),
(76,26,'cover','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01597','Ảnh tour Cao Bằng 2N – Khám phá Động Ngườm Ngao',0,TRUE),
(77,26,'image','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01598','Trải nghiệm Động Ngườm Ngao',1,TRUE),
(78,26,'image','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01599','Toàn cảnh tour Cao Bằng 2N – Khám phá Động Ngườm Ngao',2,TRUE),
(79,27,'cover','https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01600','Ảnh tour Thái Nguyên 1N – Khám phá Hồ Núi Cốc',0,TRUE),
(80,27,'image','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01601','Trải nghiệm Hồ Núi Cốc',1,TRUE),
(81,27,'image','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01602','Toàn cảnh tour Thái Nguyên 1N – Khám phá Hồ Núi Cốc',2,TRUE),
(82,28,'cover','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01603','Ảnh tour Thái Nguyên 2N – Khám phá Đồi chè Tân Cương',0,TRUE),
(83,28,'image','https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01604','Trải nghiệm Đồi chè Tân Cương',1,TRUE),
(84,28,'image','https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01605','Toàn cảnh tour Thái Nguyên 2N – Khám phá Đồi chè Tân Cương',2,TRUE),
(85,29,'cover','https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01606','Ảnh tour Phú Thọ 1N – Khám phá Đền Hùng',0,TRUE),
(86,29,'image','https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01607','Trải nghiệm Đền Hùng',1,TRUE),
(87,29,'image','https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01608','Toàn cảnh tour Phú Thọ 1N – Khám phá Đền Hùng',2,TRUE),
(88,30,'cover','https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01609','Ảnh tour Phú Thọ 2N – Khám phá Vườn quốc gia Xuân Sơn',0,TRUE),
(89,30,'image','https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01610','Trải nghiệm Vườn quốc gia Xuân Sơn',1,TRUE),
(90,30,'image','https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01611','Toàn cảnh tour Phú Thọ 2N – Khám phá Vườn quốc gia Xuân Sơn',2,TRUE),
(91,31,'cover','https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01612','Ảnh tour Bắc Ninh 1N – Khám phá Chùa Dâu',0,TRUE),
(92,31,'image','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01613','Trải nghiệm Chùa Dâu',1,TRUE),
(93,31,'image','https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01614','Toàn cảnh tour Bắc Ninh 1N – Khám phá Chùa Dâu',2,TRUE),
(94,32,'cover','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01615','Ảnh tour Bắc Ninh 2N – Khám phá Chùa Bút Tháp',0,TRUE),
(95,32,'image','https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01616','Trải nghiệm Chùa Bút Tháp',1,TRUE),
(96,32,'image','https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01617','Toàn cảnh tour Bắc Ninh 2N – Khám phá Chùa Bút Tháp',2,TRUE),
(97,33,'cover','https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01618','Ảnh tour Hưng Yên 1N – Khám phá Phố Hiến',0,TRUE),
(98,33,'image','https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01619','Trải nghiệm Phố Hiến',1,TRUE),
(99,33,'image','https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01620','Toàn cảnh tour Hưng Yên 1N – Khám phá Phố Hiến',2,TRUE),
(100,34,'cover','https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01621','Ảnh tour Hưng Yên 2N – Khám phá Đền Chử Đồng Tử',0,TRUE),
(101,34,'image','https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01622','Trải nghiệm Đền Chử Đồng Tử',1,TRUE),
(102,34,'image','https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01623','Toàn cảnh tour Hưng Yên 2N – Khám phá Đền Chử Đồng Tử',2,TRUE),
(103,35,'cover','https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01624','Ảnh tour Ninh Bình 1N – Khám phá Tràng An',0,TRUE),
(104,35,'image','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01625','Trải nghiệm Tràng An',1,TRUE),
(105,35,'image','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01626','Toàn cảnh tour Ninh Bình 1N – Khám phá Tràng An',2,TRUE),
(106,36,'cover','https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01627','Ảnh tour Ninh Bình 2N – Khám phá Tam Cốc - Bích Động',0,TRUE),
(107,36,'image','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01628','Trải nghiệm Tam Cốc - Bích Động',1,TRUE),
(108,36,'image','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01629','Toàn cảnh tour Ninh Bình 2N – Khám phá Tam Cốc - Bích Động',2,TRUE),
(109,37,'cover','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01630','Ảnh tour Quảng Ninh 1N – Khám phá Vịnh Hạ Long',0,TRUE),
(110,37,'image','https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01631','Trải nghiệm Vịnh Hạ Long',1,TRUE),
(111,37,'image','https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01632','Toàn cảnh tour Quảng Ninh 1N – Khám phá Vịnh Hạ Long',2,TRUE),
(112,38,'cover','https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01633','Ảnh tour Quảng Ninh 2N – Khám phá Yên Tử',0,TRUE),
(113,38,'image','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01634','Trải nghiệm Yên Tử',1,TRUE),
(114,38,'image','https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01635','Toàn cảnh tour Quảng Ninh 2N – Khám phá Yên Tử',2,TRUE),
(115,39,'cover','https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01636','Ảnh tour Thanh Hóa 1N – Khám phá Biển Sầm Sơn',0,TRUE),
(116,39,'image','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01637','Trải nghiệm Biển Sầm Sơn',1,TRUE),
(117,39,'image','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01638','Toàn cảnh tour Thanh Hóa 1N – Khám phá Biển Sầm Sơn',2,TRUE),
(118,40,'cover','https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01639','Ảnh tour Thanh Hóa 2N – Khám phá Pù Luông',0,TRUE),
(119,40,'image','https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01640','Trải nghiệm Pù Luông',1,TRUE),
(120,40,'image','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01641','Toàn cảnh tour Thanh Hóa 2N – Khám phá Pù Luông',2,TRUE),
(121,41,'cover','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01642','Ảnh tour Nghệ An 1N – Khám phá Biển Cửa Lò',0,TRUE),
(122,41,'image','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01643','Trải nghiệm Biển Cửa Lò',1,TRUE),
(123,41,'image','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01644','Toàn cảnh tour Nghệ An 1N – Khám phá Biển Cửa Lò',2,TRUE),
(124,42,'cover','https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01645','Ảnh tour Nghệ An 2N – Khám phá Làng Sen quê Bác',0,TRUE),
(125,42,'image','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01646','Trải nghiệm Làng Sen quê Bác',1,TRUE),
(126,42,'image','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01647','Toàn cảnh tour Nghệ An 2N – Khám phá Làng Sen quê Bác',2,TRUE),
(127,43,'cover','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01648','Ảnh tour Hà Tĩnh 1N – Khám phá Biển Thiên Cầm',0,TRUE),
(128,43,'image','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01649','Trải nghiệm Biển Thiên Cầm',1,TRUE),
(129,43,'image','https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01650','Toàn cảnh tour Hà Tĩnh 1N – Khám phá Biển Thiên Cầm',2,TRUE),
(130,44,'cover','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01651','Ảnh tour Hà Tĩnh 2N – Khám phá Chùa Hương Tích',0,TRUE),
(131,44,'image','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01652','Trải nghiệm Chùa Hương Tích',1,TRUE),
(132,44,'image','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01653','Toàn cảnh tour Hà Tĩnh 2N – Khám phá Chùa Hương Tích',2,TRUE),
(133,45,'cover','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01654','Ảnh tour Quảng Trị 1N – Khám phá Thành cổ Quảng Trị',0,TRUE),
(134,45,'image','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01655','Trải nghiệm Thành cổ Quảng Trị',1,TRUE),
(135,45,'image','https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01656','Toàn cảnh tour Quảng Trị 1N – Khám phá Thành cổ Quảng Trị',2,TRUE),
(136,46,'cover','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01657','Ảnh tour Quảng Trị 2N – Khám phá Địa đạo Vịnh Mốc',0,TRUE),
(137,46,'image','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01658','Trải nghiệm Địa đạo Vịnh Mốc',1,TRUE),
(138,46,'image','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01659','Toàn cảnh tour Quảng Trị 2N – Khám phá Địa đạo Vịnh Mốc',2,TRUE),
(139,47,'cover','https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01660','Ảnh tour Quảng Ngãi 1N – Khám phá Đảo Lý Sơn',0,TRUE),
(140,47,'image','https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01661','Trải nghiệm Đảo Lý Sơn',1,TRUE),
(141,47,'image','https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01662','Toàn cảnh tour Quảng Ngãi 1N – Khám phá Đảo Lý Sơn',2,TRUE),
(142,48,'cover','https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01663','Ảnh tour Quảng Ngãi 2N – Khám phá Biển Mỹ Khê Quảng Ngãi',0,TRUE),
(143,48,'image','https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01664','Trải nghiệm Biển Mỹ Khê Quảng Ngãi',1,TRUE),
(144,48,'image','https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01665','Toàn cảnh tour Quảng Ngãi 2N – Khám phá Biển Mỹ Khê Quảng Ngãi',2,TRUE),
(145,49,'cover','https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01666','Ảnh tour Gia Lai 1N – Khám phá Biển Hồ Pleiku',0,TRUE),
(146,49,'image','https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01667','Trải nghiệm Biển Hồ Pleiku',1,TRUE),
(147,49,'image','https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01668','Toàn cảnh tour Gia Lai 1N – Khám phá Biển Hồ Pleiku',2,TRUE),
(148,50,'cover','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01669','Ảnh tour Gia Lai 2N – Khám phá Ghềnh Ráng Tiên Sa',0,TRUE),
(149,50,'image','https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01670','Trải nghiệm Ghềnh Ráng Tiên Sa',1,TRUE),
(150,50,'image','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01671','Toàn cảnh tour Gia Lai 2N – Khám phá Ghềnh Ráng Tiên Sa',2,TRUE),
(151,51,'cover','https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01672','Ảnh tour Đắk Lắk 1N – Khám phá Buôn Ma Thuột',0,TRUE),
(152,51,'image','https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01673','Trải nghiệm Buôn Ma Thuột',1,TRUE),
(153,51,'image','https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01674','Toàn cảnh tour Đắk Lắk 1N – Khám phá Buôn Ma Thuột',2,TRUE),
(154,52,'cover','https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01675','Ảnh tour Đắk Lắk 2N – Khám phá Buôn Đôn',0,TRUE),
(155,52,'image','https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01676','Trải nghiệm Buôn Đôn',1,TRUE),
(156,52,'image','https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01677','Toàn cảnh tour Đắk Lắk 2N – Khám phá Buôn Đôn',2,TRUE),
(157,53,'cover','https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01678','Ảnh tour Khánh Hòa 1N – Khám phá Nha Trang',0,TRUE),
(158,53,'image','https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01679','Trải nghiệm Nha Trang',1,TRUE),
(159,53,'image','https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01680','Toàn cảnh tour Khánh Hòa 1N – Khám phá Nha Trang',2,TRUE),
(160,54,'cover','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01681','Ảnh tour Khánh Hòa 2N – Khám phá VinWonders Nha Trang',0,TRUE),
(161,54,'image','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01682','Trải nghiệm VinWonders Nha Trang',1,TRUE),
(162,54,'image','https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01683','Toàn cảnh tour Khánh Hòa 2N – Khám phá VinWonders Nha Trang',2,TRUE),
(163,55,'cover','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01684','Ảnh tour Lâm Đồng 1N – Khám phá Đà Lạt',0,TRUE),
(164,55,'image','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01685','Trải nghiệm Đà Lạt',1,TRUE),
(165,55,'image','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01686','Toàn cảnh tour Lâm Đồng 1N – Khám phá Đà Lạt',2,TRUE),
(166,56,'cover','https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01687','Ảnh tour Lâm Đồng 2N – Khám phá Hồ Xuân Hương',0,TRUE),
(167,56,'image','https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01688','Trải nghiệm Hồ Xuân Hương',1,TRUE),
(168,56,'image','https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01689','Toàn cảnh tour Lâm Đồng 2N – Khám phá Hồ Xuân Hương',2,TRUE),
(169,57,'cover','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01690','Ảnh tour Đồng Nai 1N – Khám phá Hồ Trị An',0,TRUE),
(170,57,'image','https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01691','Trải nghiệm Hồ Trị An',1,TRUE),
(171,57,'image','https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01692','Toàn cảnh tour Đồng Nai 1N – Khám phá Hồ Trị An',2,TRUE),
(172,58,'cover','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01693','Ảnh tour Đồng Nai 2N – Khám phá Vườn quốc gia Nam Cát Tiên',0,TRUE),
(173,58,'image','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01694','Trải nghiệm Vườn quốc gia Nam Cát Tiên',1,TRUE),
(174,58,'image','https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01695','Toàn cảnh tour Đồng Nai 2N – Khám phá Vườn quốc gia Nam Cát Tiên',2,TRUE),
(175,59,'cover','https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01696','Ảnh tour Tây Ninh 1N – Khám phá Núi Bà Đen',0,TRUE),
(176,59,'image','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01697','Trải nghiệm Núi Bà Đen',1,TRUE),
(177,59,'image','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01698','Toàn cảnh tour Tây Ninh 1N – Khám phá Núi Bà Đen',2,TRUE),
(178,60,'cover','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01699','Ảnh tour Tây Ninh 2N – Khám phá Tòa Thánh Cao Đài',0,TRUE),
(179,60,'image','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01700','Trải nghiệm Tòa Thánh Cao Đài',1,TRUE),
(180,60,'image','https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01701','Toàn cảnh tour Tây Ninh 2N – Khám phá Tòa Thánh Cao Đài',2,TRUE),
(181,61,'cover','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01702','Ảnh tour Đồng Tháp 1N – Khám phá Vườn quốc gia Tràm Chim',0,TRUE),
(182,61,'image','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01703','Trải nghiệm Vườn quốc gia Tràm Chim',1,TRUE),
(183,61,'image','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01704','Toàn cảnh tour Đồng Tháp 1N – Khám phá Vườn quốc gia Tràm Chim',2,TRUE),
(184,62,'cover','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01705','Ảnh tour Đồng Tháp 2N – Khám phá Làng hoa Sa Đéc',0,TRUE),
(185,62,'image','https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01706','Trải nghiệm Làng hoa Sa Đéc',1,TRUE),
(186,62,'image','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01707','Toàn cảnh tour Đồng Tháp 2N – Khám phá Làng hoa Sa Đéc',2,TRUE),
(187,63,'cover','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01708','Ảnh tour An Giang 1N – Khám phá Rừng tràm Trà Sư',0,TRUE),
(188,63,'image','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01709','Trải nghiệm Rừng tràm Trà Sư',1,TRUE),
(189,63,'image','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01710','Toàn cảnh tour An Giang 1N – Khám phá Rừng tràm Trà Sư',2,TRUE),
(190,64,'cover','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01711','Ảnh tour An Giang 2N – Khám phá Miếu Bà Chúa Xứ Núi Sam',0,TRUE),
(191,64,'image','https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01712','Trải nghiệm Miếu Bà Chúa Xứ Núi Sam',1,TRUE),
(192,64,'image','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01713','Toàn cảnh tour An Giang 2N – Khám phá Miếu Bà Chúa Xứ Núi Sam',2,TRUE),
(193,65,'cover','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01714','Ảnh tour Vĩnh Long 1N – Khám phá Cù lao An Bình',0,TRUE),
(194,65,'image','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01715','Trải nghiệm Cù lao An Bình',1,TRUE),
(195,65,'image','https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01716','Toàn cảnh tour Vĩnh Long 1N – Khám phá Cù lao An Bình',2,TRUE),
(196,66,'cover','https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01717','Ảnh tour Vĩnh Long 2N – Khám phá Văn Thánh Miếu Vĩnh Long',0,TRUE),
(197,66,'image','https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01718','Trải nghiệm Văn Thánh Miếu Vĩnh Long',1,TRUE),
(198,66,'image','https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01719','Toàn cảnh tour Vĩnh Long 2N – Khám phá Văn Thánh Miếu Vĩnh Long',2,TRUE),
(199,67,'cover','https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01720','Ảnh tour Cà Mau 1N – Khám phá Mũi Cà Mau',0,TRUE),
(200,67,'image','https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01721','Trải nghiệm Mũi Cà Mau',1,TRUE),
(201,67,'image','https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01722','Toàn cảnh tour Cà Mau 1N – Khám phá Mũi Cà Mau',2,TRUE),
(202,68,'cover','https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01723','Ảnh tour Cà Mau 2N – Khám phá Rừng U Minh Hạ',0,TRUE),
(203,68,'image','https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01724','Trải nghiệm Rừng U Minh Hạ',1,TRUE),
(204,68,'image','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01725','Toàn cảnh tour Cà Mau 2N – Khám phá Rừng U Minh Hạ',2,TRUE),
(205,69,'cover','https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01726','Ảnh tour Nghỉ dưỡng Vịnh Hạ Long 3N2Đ',0,TRUE),
(206,69,'image','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01727','Trải nghiệm Vịnh Hạ Long',1,TRUE),
(207,69,'image','https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01728','Toàn cảnh tour Nghỉ dưỡng Vịnh Hạ Long 3N2Đ',2,TRUE),
(208,70,'cover','https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01729','Ảnh tour Nghỉ dưỡng Sa Pa 3N2Đ',0,TRUE),
(209,70,'image','https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01730','Trải nghiệm Sa Pa',1,TRUE),
(210,70,'image','https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01731','Toàn cảnh tour Nghỉ dưỡng Sa Pa 3N2Đ',2,TRUE),
(211,71,'cover','https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01732','Ảnh tour Nghỉ dưỡng Tràng An 3N2Đ',0,TRUE),
(212,71,'image','https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01733','Trải nghiệm Tràng An',1,TRUE),
(213,71,'image','https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01734','Toàn cảnh tour Nghỉ dưỡng Tràng An 3N2Đ',2,TRUE),
(214,72,'cover','https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01735','Ảnh tour Nghỉ dưỡng Đà Lạt 3N2Đ',0,TRUE),
(215,72,'image','https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01736','Trải nghiệm Đà Lạt',1,TRUE),
(216,72,'image','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01737','Toàn cảnh tour Nghỉ dưỡng Đà Lạt 3N2Đ',2,TRUE),
(217,73,'cover','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01738','Ảnh tour Nghỉ dưỡng Phú Quốc 3N2Đ',0,TRUE),
(218,73,'image','https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01739','Trải nghiệm Phú Quốc',1,TRUE),
(219,73,'image','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01740','Toàn cảnh tour Nghỉ dưỡng Phú Quốc 3N2Đ',2,TRUE),
(220,74,'cover','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01741','Ảnh tour Nghỉ dưỡng Bà Nà Hills 3N2Đ',0,TRUE),
(221,74,'image','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01742','Trải nghiệm Bà Nà Hills',1,TRUE),
(222,74,'image','https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01743','Toàn cảnh tour Nghỉ dưỡng Bà Nà Hills 3N2Đ',2,TRUE),
(223,75,'cover','https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01744','Ảnh tour Nghỉ dưỡng Mũi Né 3N2Đ',0,TRUE),
(224,75,'image','https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01745','Trải nghiệm Mũi Né',1,TRUE),
(225,75,'image','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01746','Toàn cảnh tour Nghỉ dưỡng Mũi Né 3N2Đ',2,TRUE),
(226,76,'cover','https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01747','Ảnh tour Nghỉ dưỡng Côn Đảo 3N2Đ',0,TRUE),
(227,76,'image','https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01748','Trải nghiệm Côn Đảo',1,TRUE),
(228,76,'image','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01749','Toàn cảnh tour Nghỉ dưỡng Côn Đảo 3N2Đ',2,TRUE),
(229,77,'cover','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01750','Ảnh tour Nghỉ dưỡng Rừng tràm Trà Sư 3N2Đ',0,TRUE),
(230,77,'image','https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01751','Trải nghiệm Rừng tràm Trà Sư',1,TRUE),
(231,77,'image','https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01752','Toàn cảnh tour Nghỉ dưỡng Rừng tràm Trà Sư 3N2Đ',2,TRUE),
(232,78,'cover','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01753','Ảnh tour Nghỉ dưỡng Mộc Châu 3N2Đ',0,TRUE),
(233,78,'image','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01754','Trải nghiệm Mộc Châu',1,TRUE),
(234,78,'image','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01755','Toàn cảnh tour Nghỉ dưỡng Mộc Châu 3N2Đ',2,TRUE),
(235,79,'cover','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01756','Ảnh tour Nghỉ dưỡng Cao nguyên đá Đồng Văn 3N2Đ',0,TRUE),
(236,79,'image','https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01757','Trải nghiệm Cao nguyên đá Đồng Văn',1,TRUE),
(237,79,'image','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01758','Toàn cảnh tour Nghỉ dưỡng Cao nguyên đá Đồng Văn 3N2Đ',2,TRUE),
(238,80,'cover','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01759','Ảnh tour Nghỉ dưỡng Nha Trang 3N2Đ',0,TRUE),
(239,80,'image','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01760','Trải nghiệm Nha Trang',1,TRUE),
(240,80,'image','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01761','Toàn cảnh tour Nghỉ dưỡng Nha Trang 3N2Đ',2,TRUE),
(241,81,'cover','https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01762','Ảnh tour Xuyên Việt Di sản Bắc Bộ 6N',0,TRUE),
(242,81,'image','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01763','Trải nghiệm Sa Pa',1,TRUE),
(243,81,'image','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01764','Toàn cảnh tour Xuyên Việt Di sản Bắc Bộ 6N',2,TRUE),
(244,82,'cover','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01765','Ảnh tour Xuyên Việt Miền Trung Di sản 5N',0,TRUE),
(245,82,'image','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01766','Trải nghiệm Bà Nà Hills',1,TRUE),
(246,82,'image','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01767','Toàn cảnh tour Xuyên Việt Miền Trung Di sản 5N',2,TRUE),
(247,83,'cover','https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01768','Ảnh tour Xuyên Việt Biển đảo phương Nam 7N',0,TRUE),
(248,83,'image','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01769','Trải nghiệm Chợ nổi Cái Răng',1,TRUE),
(249,83,'image','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01770','Toàn cảnh tour Xuyên Việt Biển đảo phương Nam 7N',2,TRUE),
(250,84,'cover','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01771','Ảnh tour Đại vòng cung Tây Bắc 6N',0,TRUE),
(251,84,'image','https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01772','Trải nghiệm Sa Pa',1,TRUE),
(252,84,'image','https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01773','Toàn cảnh tour Đại vòng cung Tây Bắc 6N',2,TRUE),
(253,85,'cover','https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01774','Ảnh tour Cung đường Đông Bắc 5N',0,TRUE),
(254,85,'image','https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01775','Trải nghiệm Vịnh Hạ Long',1,TRUE),
(255,85,'image','https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01776','Toàn cảnh tour Cung đường Đông Bắc 5N',2,TRUE),
(256,86,'cover','https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01777','Ảnh tour Tây Nguyên đại ngàn 5N',0,TRUE),
(257,86,'image','https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01778','Trải nghiệm Đà Lạt',1,TRUE),
(258,86,'image','https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01779','Toàn cảnh tour Tây Nguyên đại ngàn 5N',2,TRUE),
(259,87,'cover','https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01780','Ảnh tour Miền Tây sông nước 5N',0,TRUE),
(260,87,'image','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01781','Trải nghiệm Mũi Cà Mau',1,TRUE),
(261,87,'image','https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01782','Toàn cảnh tour Miền Tây sông nước 5N',2,TRUE),
(262,88,'cover','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01783','Ảnh tour Hành trình biển miền Trung 6N',0,TRUE),
(263,88,'image','https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01784','Trải nghiệm Đại Nội Huế',1,TRUE),
(264,88,'image','https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01785','Toàn cảnh tour Hành trình biển miền Trung 6N',2,TRUE),
(265,89,'cover','https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01786','Ảnh tour Từ Sài Gòn ra Hà Nội 8N',0,TRUE),
(266,89,'image','https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01787','Trải nghiệm Hồ Hoàn Kiếm',1,TRUE),
(267,89,'image','https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01788','Toàn cảnh tour Từ Sài Gòn ra Hà Nội 8N',2,TRUE),
(268,90,'cover','https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01789','Ảnh tour Việt Nam Grand Tour 10N',0,TRUE),
(269,90,'image','https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01790','Trải nghiệm Chợ nổi Cái Răng',1,TRUE),
(270,90,'image','https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01791','Toàn cảnh tour Việt Nam Grand Tour 10N',2,TRUE),
(271,91,'cover','https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01792','Ảnh tour Hàn Quốc 4N – Khám phá Seoul',0,TRUE),
(272,91,'image','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01793','Trải nghiệm Seoul',1,TRUE),
(273,91,'image','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01794','Toàn cảnh tour Hàn Quốc 4N – Khám phá Seoul',2,TRUE),
(274,92,'cover','https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01795','Ảnh tour Hàn Quốc premium Busan 5N',0,TRUE),
(275,92,'image','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01796','Trải nghiệm Busan',1,TRUE),
(276,92,'image','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01797','Toàn cảnh tour Hàn Quốc premium Busan 5N',2,TRUE),
(277,93,'cover','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01798','Ảnh tour Nhật Bản 4N – Khám phá Tokyo',0,TRUE),
(278,93,'image','https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01799','Trải nghiệm Tokyo',1,TRUE),
(279,93,'image','https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01800','Toàn cảnh tour Nhật Bản 4N – Khám phá Tokyo',2,TRUE),
(280,94,'cover','https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01801','Ảnh tour Nhật Bản premium Kyoto 5N',0,TRUE),
(281,94,'image','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01802','Trải nghiệm Kyoto',1,TRUE),
(282,94,'image','https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01803','Toàn cảnh tour Nhật Bản premium Kyoto 5N',2,TRUE),
(283,95,'cover','https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01804','Ảnh tour Thái Lan 4N – Khám phá Bangkok',0,TRUE),
(284,95,'image','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01805','Trải nghiệm Bangkok',1,TRUE),
(285,95,'image','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01806','Toàn cảnh tour Thái Lan 4N – Khám phá Bangkok',2,TRUE),
(286,96,'cover','https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01807','Ảnh tour Thái Lan premium Phuket 5N',0,TRUE),
(287,96,'image','https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01808','Trải nghiệm Phuket',1,TRUE),
(288,96,'image','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01809','Toàn cảnh tour Thái Lan premium Phuket 5N',2,TRUE),
(289,97,'cover','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01810','Ảnh tour Singapore 4N – Khám phá Marina Bay Sands',0,TRUE),
(290,97,'image','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01811','Trải nghiệm Marina Bay Sands',1,TRUE),
(291,97,'image','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01812','Toàn cảnh tour Singapore 4N – Khám phá Marina Bay Sands',2,TRUE),
(292,98,'cover','https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01813','Ảnh tour Malaysia 4N – Khám phá Kuala Lumpur',0,TRUE),
(293,98,'image','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01814','Trải nghiệm Kuala Lumpur',1,TRUE),
(294,98,'image','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01815','Toàn cảnh tour Malaysia 4N – Khám phá Kuala Lumpur',2,TRUE),
(295,99,'cover','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01816','Ảnh tour Indonesia 4N – Khám phá Bali',0,TRUE),
(296,99,'image','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01817','Trải nghiệm Bali',1,TRUE),
(297,99,'image','https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01818','Toàn cảnh tour Indonesia 4N – Khám phá Bali',2,TRUE),
(298,100,'cover','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01819','Ảnh tour Trung Quốc 4N – Khám phá Beijing',0,TRUE),
(299,100,'image','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01820','Trải nghiệm Beijing',1,TRUE),
(300,100,'image','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01821','Toàn cảnh tour Trung Quốc 4N – Khám phá Beijing',2,TRUE),
(301,101,'cover','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01822','Ảnh tour Trung Quốc premium Shanghai 5N',0,TRUE),
(302,101,'image','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01823','Trải nghiệm Shanghai',1,TRUE),
(303,101,'image','https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01824','Toàn cảnh tour Trung Quốc premium Shanghai 5N',2,TRUE),
(304,102,'cover','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01825','Ảnh tour Đài Loan 4N – Khám phá Taipei',0,TRUE),
(305,102,'image','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01826','Trải nghiệm Taipei',1,TRUE),
(306,102,'image','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01827','Toàn cảnh tour Đài Loan 4N – Khám phá Taipei',2,TRUE),
(307,103,'cover','https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01828','Ảnh tour Hồng Kông 4N – Khám phá Victoria Peak',0,TRUE),
(308,103,'image','https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01829','Trải nghiệm Victoria Peak',1,TRUE),
(309,103,'image','https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01830','Toàn cảnh tour Hồng Kông 4N – Khám phá Victoria Peak',2,TRUE),
(310,104,'cover','https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01831','Ảnh tour Campuchia 4N – Khám phá Siem Reap',0,TRUE),
(311,104,'image','https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01832','Trải nghiệm Siem Reap',1,TRUE),
(312,104,'image','https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01833','Toàn cảnh tour Campuchia 4N – Khám phá Siem Reap',2,TRUE),
(313,105,'cover','https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01834','Ảnh tour Lào 4N – Khám phá Luang Prabang',0,TRUE),
(314,105,'image','https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01835','Trải nghiệm Luang Prabang',1,TRUE),
(315,105,'image','https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01836','Toàn cảnh tour Lào 4N – Khám phá Luang Prabang',2,TRUE),
(316,106,'cover','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01837','Ảnh tour Ấn Độ 4N – Khám phá New Delhi',0,TRUE),
(317,106,'image','https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01838','Trải nghiệm New Delhi',1,TRUE),
(318,106,'image','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01839','Toàn cảnh tour Ấn Độ 4N – Khám phá New Delhi',2,TRUE),
(319,107,'cover','https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01840','Ảnh tour Ấn Độ premium Agra 5N',0,TRUE),
(320,107,'image','https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01841','Trải nghiệm Agra',1,TRUE),
(321,107,'image','https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01842','Toàn cảnh tour Ấn Độ premium Agra 5N',2,TRUE),
(322,108,'cover','https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01843','Ảnh tour Maldives 4N – Khám phá Male',0,TRUE),
(323,108,'image','https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01844','Trải nghiệm Male',1,TRUE),
(324,108,'image','https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01845','Toàn cảnh tour Maldives 4N – Khám phá Male',2,TRUE),
(325,109,'cover','https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01846','Ảnh tour UAE 4N – Khám phá Dubai',0,TRUE),
(326,109,'image','https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01847','Trải nghiệm Dubai',1,TRUE),
(327,109,'image','https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01848','Toàn cảnh tour UAE 4N – Khám phá Dubai',2,TRUE),
(328,110,'cover','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01849','Ảnh tour Thổ Nhĩ Kỳ 4N – Khám phá Istanbul',0,TRUE),
(329,110,'image','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01850','Trải nghiệm Istanbul',1,TRUE),
(330,110,'image','https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01851','Toàn cảnh tour Thổ Nhĩ Kỳ 4N – Khám phá Istanbul',2,TRUE),
(331,111,'cover','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01852','Ảnh tour Pháp 5N – Khám phá Paris',0,TRUE),
(332,111,'image','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01853','Trải nghiệm Paris',1,TRUE),
(333,111,'image','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01854','Toàn cảnh tour Pháp 5N – Khám phá Paris',2,TRUE),
(334,112,'cover','https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01855','Ảnh tour Ý 5N – Khám phá Rome',0,TRUE),
(335,112,'image','https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01856','Trải nghiệm Rome',1,TRUE),
(336,112,'image','https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01857','Toàn cảnh tour Ý 5N – Khám phá Rome',2,TRUE),
(337,113,'cover','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01858','Ảnh tour Ý premium Venice 5N',0,TRUE),
(338,113,'image','https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01859','Trải nghiệm Venice',1,TRUE),
(339,113,'image','https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01860','Toàn cảnh tour Ý premium Venice 5N',2,TRUE),
(340,114,'cover','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01861','Ảnh tour Vương quốc Anh 5N – Khám phá London',0,TRUE),
(341,114,'image','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01862','Trải nghiệm London',1,TRUE),
(342,114,'image','https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01863','Toàn cảnh tour Vương quốc Anh 5N – Khám phá London',2,TRUE),
(343,115,'cover','https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01864','Ảnh tour Tây Ban Nha 5N – Khám phá Madrid',0,TRUE),
(344,115,'image','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01865','Trải nghiệm Madrid',1,TRUE),
(345,115,'image','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01866','Toàn cảnh tour Tây Ban Nha 5N – Khám phá Madrid',2,TRUE),
(346,116,'cover','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01867','Ảnh tour Tây Ban Nha premium Barcelona 5N',0,TRUE),
(347,116,'image','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01868','Trải nghiệm Barcelona',1,TRUE),
(348,116,'image','https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01869','Toàn cảnh tour Tây Ban Nha premium Barcelona 5N',2,TRUE),
(349,117,'cover','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01870','Ảnh tour Đức 5N – Khám phá Berlin',0,TRUE),
(350,117,'image','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01871','Trải nghiệm Berlin',1,TRUE),
(351,117,'image','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01872','Toàn cảnh tour Đức 5N – Khám phá Berlin',2,TRUE),
(352,118,'cover','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01873','Ảnh tour Đức premium Munich 5N',0,TRUE),
(353,118,'image','https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01874','Trải nghiệm Munich',1,TRUE),
(354,118,'image','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01875','Toàn cảnh tour Đức premium Munich 5N',2,TRUE),
(355,119,'cover','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01876','Ảnh tour Hà Lan 5N – Khám phá Amsterdam',0,TRUE),
(356,119,'image','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01877','Trải nghiệm Amsterdam',1,TRUE),
(357,119,'image','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01878','Toàn cảnh tour Hà Lan 5N – Khám phá Amsterdam',2,TRUE),
(358,120,'cover','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01879','Ảnh tour Thụy Sĩ 5N – Khám phá Zurich',0,TRUE),
(359,120,'image','https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01880','Trải nghiệm Zurich',1,TRUE),
(360,120,'image','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01881','Toàn cảnh tour Thụy Sĩ 5N – Khám phá Zurich',2,TRUE),
(361,121,'cover','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01882','Ảnh tour Áo 5N – Khám phá Vienna',0,TRUE),
(362,121,'image','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01883','Trải nghiệm Vienna',1,TRUE),
(363,121,'image','https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01884','Toàn cảnh tour Áo 5N – Khám phá Vienna',2,TRUE),
(364,122,'cover','https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01885','Ảnh tour Séc 5N – Khám phá Prague',0,TRUE),
(365,122,'image','https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01886','Trải nghiệm Prague',1,TRUE),
(366,122,'image','https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01887','Toàn cảnh tour Séc 5N – Khám phá Prague',2,TRUE),
(367,123,'cover','https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01888','Ảnh tour Hy Lạp 5N – Khám phá Athens',0,TRUE),
(368,123,'image','https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01889','Trải nghiệm Athens',1,TRUE),
(369,123,'image','https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01890','Toàn cảnh tour Hy Lạp 5N – Khám phá Athens',2,TRUE),
(370,124,'cover','https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01891','Ảnh tour Bồ Đào Nha 5N – Khám phá Lisbon',0,TRUE),
(371,124,'image','https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01892','Trải nghiệm Lisbon',1,TRUE),
(372,124,'image','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01893','Toàn cảnh tour Bồ Đào Nha 5N – Khám phá Lisbon',2,TRUE),
(373,125,'cover','https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01894','Ảnh tour Phần Lan 5N – Khám phá Helsinki',0,TRUE),
(374,125,'image','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01895','Trải nghiệm Helsinki',1,TRUE),
(375,125,'image','https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01896','Toàn cảnh tour Phần Lan 5N – Khám phá Helsinki',2,TRUE),
(376,126,'cover','https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01897','Ảnh tour Na Uy 5N – Khám phá Oslo',0,TRUE),
(377,126,'image','https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01898','Trải nghiệm Oslo',1,TRUE),
(378,126,'image','https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01899','Toàn cảnh tour Na Uy 5N – Khám phá Oslo',2,TRUE),
(379,127,'cover','https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01900','Ảnh tour Đan Mạch 5N – Khám phá Copenhagen',0,TRUE),
(380,127,'image','https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01901','Trải nghiệm Copenhagen',1,TRUE),
(381,127,'image','https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01902','Toàn cảnh tour Đan Mạch 5N – Khám phá Copenhagen',2,TRUE),
(382,128,'cover','https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01903','Ảnh tour Iceland 5N – Khám phá Reykjavik',0,TRUE),
(383,128,'image','https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01904','Trải nghiệm Reykjavik',1,TRUE),
(384,128,'image','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01905','Toàn cảnh tour Iceland 5N – Khám phá Reykjavik',2,TRUE),
(385,129,'cover','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01906','Ảnh tour Ai Cập 5N – Khám phá Cairo',0,TRUE),
(386,129,'image','https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01907','Trải nghiệm Cairo',1,TRUE),
(387,129,'image','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01908','Toàn cảnh tour Ai Cập 5N – Khám phá Cairo',2,TRUE),
(388,130,'cover','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01909','Ảnh tour Nam Phi 5N – Khám phá Cape Town',0,TRUE),
(389,130,'image','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01910','Trải nghiệm Cape Town',1,TRUE),
(390,130,'image','https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01911','Toàn cảnh tour Nam Phi 5N – Khám phá Cape Town',2,TRUE),
(391,131,'cover','https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01912','Ảnh tour Ma-rốc 5N – Khám phá Marrakech',0,TRUE),
(392,131,'image','https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01913','Trải nghiệm Marrakech',1,TRUE),
(393,131,'image','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01914','Toàn cảnh tour Ma-rốc 5N – Khám phá Marrakech',2,TRUE),
(394,132,'cover','https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01915','Ảnh tour Kenya 5N – Khám phá Nairobi',0,TRUE),
(395,132,'image','https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01916','Trải nghiệm Nairobi',1,TRUE),
(396,132,'image','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01917','Toàn cảnh tour Kenya 5N – Khám phá Nairobi',2,TRUE),
(397,133,'cover','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01918','Ảnh tour Tanzania 5N – Khám phá Serengeti',0,TRUE),
(398,133,'image','https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01919','Trải nghiệm Serengeti',1,TRUE),
(399,133,'image','https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01920','Toàn cảnh tour Tanzania 5N – Khám phá Serengeti',2,TRUE),
(400,134,'cover','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01921','Ảnh tour Hoa Kỳ 5N – Khám phá New York',0,TRUE),
(401,134,'image','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01922','Trải nghiệm New York',1,TRUE),
(402,134,'image','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01923','Toàn cảnh tour Hoa Kỳ 5N – Khám phá New York',2,TRUE),
(403,135,'cover','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01924','Ảnh tour Hoa Kỳ premium Los Angeles 5N',0,TRUE),
(404,135,'image','https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01925','Trải nghiệm Los Angeles',1,TRUE),
(405,135,'image','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01926','Toàn cảnh tour Hoa Kỳ premium Los Angeles 5N',2,TRUE),
(406,136,'cover','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01927','Ảnh tour Canada 5N – Khám phá Toronto',0,TRUE),
(407,136,'image','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01928','Trải nghiệm Toronto',1,TRUE),
(408,136,'image','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01929','Toàn cảnh tour Canada 5N – Khám phá Toronto',2,TRUE),
(409,137,'cover','https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01930','Ảnh tour Canada premium Vancouver 5N',0,TRUE),
(410,137,'image','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01931','Trải nghiệm Vancouver',1,TRUE),
(411,137,'image','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01932','Toàn cảnh tour Canada premium Vancouver 5N',2,TRUE),
(412,138,'cover','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01933','Ảnh tour Mexico 5N – Khám phá Mexico City',0,TRUE),
(413,138,'image','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01934','Trải nghiệm Mexico City',1,TRUE),
(414,138,'image','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01935','Toàn cảnh tour Mexico 5N – Khám phá Mexico City',2,TRUE),
(415,139,'cover','https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01936','Ảnh tour Brazil 5N – Khám phá Rio de Janeiro',0,TRUE),
(416,139,'image','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01937','Trải nghiệm Rio de Janeiro',1,TRUE),
(417,139,'image','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01938','Toàn cảnh tour Brazil 5N – Khám phá Rio de Janeiro',2,TRUE),
(418,140,'cover','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01939','Ảnh tour Argentina 5N – Khám phá Buenos Aires',0,TRUE),
(419,140,'image','https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01940','Trải nghiệm Buenos Aires',1,TRUE),
(420,140,'image','https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01941','Toàn cảnh tour Argentina 5N – Khám phá Buenos Aires',2,TRUE),
(421,141,'cover','https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01942','Ảnh tour Peru 5N – Khám phá Lima',0,TRUE),
(422,141,'image','https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01943','Trải nghiệm Lima',1,TRUE),
(423,141,'image','https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01944','Toàn cảnh tour Peru 5N – Khám phá Lima',2,TRUE),
(424,142,'cover','https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01945','Ảnh tour Chile 5N – Khám phá Santiago',0,TRUE),
(425,142,'image','https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01946','Trải nghiệm Santiago',1,TRUE),
(426,142,'image','https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01947','Toàn cảnh tour Chile 5N – Khám phá Santiago',2,TRUE),
(427,143,'cover','https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01948','Ảnh tour Úc 5N – Khám phá Sydney',0,TRUE),
(428,143,'image','https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01949','Trải nghiệm Sydney',1,TRUE),
(429,143,'image','https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01950','Toàn cảnh tour Úc 5N – Khám phá Sydney',2,TRUE),
(430,144,'cover','https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01951','Ảnh tour Úc premium Melbourne 5N',0,TRUE),
(431,144,'image','https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01952','Trải nghiệm Melbourne',1,TRUE),
(432,144,'image','https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01953','Toàn cảnh tour Úc premium Melbourne 5N',2,TRUE),
(433,145,'cover','https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01954','Ảnh tour New Zealand 5N – Khám phá Auckland',0,TRUE),
(434,145,'image','https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01955','Trải nghiệm Auckland',1,TRUE),
(435,145,'image','https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01956','Toàn cảnh tour New Zealand 5N – Khám phá Auckland',2,TRUE),
(436,146,'cover','https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01957','Ảnh tour New Zealand premium Queenstown 5N',0,TRUE),
(437,146,'image','https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01958','Trải nghiệm Queenstown',1,TRUE),
(438,146,'image','https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01959','Toàn cảnh tour New Zealand premium Queenstown 5N',2,TRUE),
(439,147,'cover','https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01960','Ảnh tour Fiji 5N – Khám phá Nadi',0,TRUE),
(440,147,'image','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01961','Trải nghiệm Nadi',1,TRUE),
(441,147,'image','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01962','Toàn cảnh tour Fiji 5N – Khám phá Nadi',2,TRUE),
(442,148,'cover','https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01963','Ảnh tour Đông Bắc Á vàng son 7N',0,TRUE),
(443,148,'image','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01964','Trải nghiệm Kyoto',1,TRUE),
(444,148,'image','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-01965','Toàn cảnh tour Đông Bắc Á vàng son 7N',2,TRUE),
(445,149,'cover','https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-01966','Ảnh tour Nhật Hàn mùa lá đỏ 8N',0,TRUE),
(446,149,'image','https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=820&q=80&ixid=seed-01967','Trải nghiệm Busan',1,TRUE),
(447,149,'image','https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1210&h=830&q=81&ixid=seed-01968','Toàn cảnh tour Nhật Hàn mùa lá đỏ 8N',2,TRUE),
(448,150,'cover','https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1220&h=840&q=82&ixid=seed-01969','Ảnh tour ASEAN city break 6N',0,TRUE),
(449,150,'image','https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1230&h=800&q=78&ixid=seed-01970','Trải nghiệm Kuala Lumpur',1,TRUE),
(450,150,'image','https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1240&h=810&q=79&ixid=seed-01971','Toàn cảnh tour ASEAN city break 6N',2,TRUE),
(451,151,'cover','https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1250&h=820&q=80&ixid=seed-01972','Ảnh tour Hành trình Đông Dương 6N',0,TRUE),
(452,151,'image','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1260&h=830&q=81&ixid=seed-01973','Trải nghiệm Bangkok',1,TRUE),
(453,151,'image','https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=840&q=82&ixid=seed-01974','Toàn cảnh tour Hành trình Đông Dương 6N',2,TRUE),
(454,152,'cover','https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1210&h=800&q=78&ixid=seed-01975','Ảnh tour Châu Âu kinh điển 9N',0,TRUE),
(455,152,'image','https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1220&h=810&q=79&ixid=seed-01976','Trải nghiệm Zurich',1,TRUE),
(456,152,'image','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1230&h=820&q=80&ixid=seed-01977','Toàn cảnh tour Châu Âu kinh điển 9N',2,TRUE),
(457,153,'cover','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1240&h=830&q=81&ixid=seed-01978','Ảnh tour Tây Âu lãng mạn 7N',0,TRUE),
(458,153,'image','https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1250&h=840&q=82&ixid=seed-01979','Trải nghiệm Paris',1,TRUE),
(459,153,'image','https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1260&h=800&q=78&ixid=seed-01980','Toàn cảnh tour Tây Âu lãng mạn 7N',2,TRUE),
(460,154,'cover','https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&h=810&q=79&ixid=seed-01981','Ảnh tour Nam Âu Địa Trung Hải 7N',0,TRUE),
(461,154,'image','https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1210&h=820&q=80&ixid=seed-01982','Trải nghiệm Lisbon',1,TRUE),
(462,154,'image','https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1220&h=830&q=81&ixid=seed-01983','Toàn cảnh tour Nam Âu Địa Trung Hải 7N',2,TRUE),
(463,155,'cover','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1230&h=840&q=82&ixid=seed-01984','Ảnh tour Bắc Âu & Iceland 8N',0,TRUE),
(464,155,'image','https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1240&h=800&q=78&ixid=seed-01985','Trải nghiệm Reykjavik',1,TRUE),
(465,155,'image','https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1250&h=810&q=79&ixid=seed-01986','Toàn cảnh tour Bắc Âu & Iceland 8N',2,TRUE),
(466,156,'cover','https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1260&h=820&q=80&ixid=seed-01987','Ảnh tour Bờ Tây Hoa Kỳ 8N',0,TRUE),
(467,156,'image','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&h=830&q=81&ixid=seed-01988','Trải nghiệm San Francisco',1,TRUE),
(468,156,'image','https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1210&h=840&q=82&ixid=seed-01989','Toàn cảnh tour Bờ Tây Hoa Kỳ 8N',2,TRUE),
(469,157,'cover','https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1220&h=800&q=78&ixid=seed-01990','Ảnh tour Bắc Mỹ nổi bật 8N',0,TRUE),
(470,157,'image','https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1230&h=810&q=79&ixid=seed-01991','Trải nghiệm Toronto',1,TRUE),
(471,157,'image','https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1240&h=820&q=80&ixid=seed-01992','Toàn cảnh tour Bắc Mỹ nổi bật 8N',2,TRUE),
(472,158,'cover','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1250&h=830&q=81&ixid=seed-01993','Ảnh tour Úc New Zealand 10N',0,TRUE),
(473,158,'image','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1260&h=840&q=82&ixid=seed-01994','Trải nghiệm Queenstown',1,TRUE),
(474,158,'image','https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&h=800&q=78&ixid=seed-01995','Toàn cảnh tour Úc New Zealand 10N',2,TRUE),
(475,159,'cover','https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1210&h=810&q=79&ixid=seed-01996','Ảnh tour Nam Mỹ huyền thoại 10N',0,TRUE),
(476,159,'image','https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1220&h=820&q=80&ixid=seed-01997','Trải nghiệm Cusco',1,TRUE),
(477,159,'image','https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1230&h=830&q=81&ixid=seed-01998','Toàn cảnh tour Nam Mỹ huyền thoại 10N',2,TRUE),
(478,160,'cover','https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1240&h=840&q=82&ixid=seed-01999','Ảnh tour Châu Phi di sản 10N',0,TRUE),
(479,160,'image','https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1250&h=800&q=78&ixid=seed-02000','Trải nghiệm Cape Town',1,TRUE),
(480,160,'image','https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1260&h=810&q=79&ixid=seed-02001','Toàn cảnh tour Châu Phi di sản 10N',2,TRUE);

INSERT IGNORE INTO tour_itinerary_days (
    id, tour_id, day_number, title, description
) VALUES
(1,1,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Hồ Hoàn Kiếm.'),
(2,2,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Văn Miếu - Quốc Tử Giám.'),
(3,2,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(4,3,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Đại Nội Huế.'),
(5,4,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Lăng Khải Định.'),
(6,4,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(7,5,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Đảo Cát Bà.'),
(8,6,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Vịnh Lan Hạ.'),
(9,6,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(10,7,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Bà Nà Hills.'),
(11,8,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Cầu Rồng.'),
(12,8,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(13,9,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Dinh Độc Lập.'),
(14,10,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Nhà thờ Đức Bà.'),
(15,10,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(16,11,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Chợ nổi Cái Răng.'),
(17,12,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Bến Ninh Kiều.'),
(18,12,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(19,13,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Khu di tích Tân Trào.'),
(20,14,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Hồ Na Hang.'),
(21,14,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(22,15,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Sa Pa.'),
(23,16,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Đỉnh Fansipan.'),
(24,16,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(25,17,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Pu Ta Leng.'),
(26,18,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Đèo Ô Quy Hồ.'),
(27,18,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(28,19,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Đồi A1.'),
(29,20,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Bảo tàng Chiến thắng Điện Biên Phủ.'),
(30,20,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(31,21,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Mộc Châu.'),
(32,22,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Tà Xùa.'),
(33,22,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(34,23,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Mẫu Sơn.'),
(35,24,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Động Tam Thanh.'),
(36,24,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(37,25,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Thác Bản Giốc.'),
(38,26,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Động Ngườm Ngao.'),
(39,26,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(40,27,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Hồ Núi Cốc.'),
(41,28,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Đồi chè Tân Cương.'),
(42,28,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(43,29,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Đền Hùng.'),
(44,30,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Vườn quốc gia Xuân Sơn.'),
(45,30,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(46,31,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Chùa Dâu.'),
(47,32,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Chùa Bút Tháp.'),
(48,32,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(49,33,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Phố Hiến.'),
(50,34,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Đền Chử Đồng Tử.'),
(51,34,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(52,35,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Tràng An.'),
(53,36,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Tam Cốc - Bích Động.'),
(54,36,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(55,37,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Vịnh Hạ Long.'),
(56,38,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Yên Tử.'),
(57,38,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(58,39,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Biển Sầm Sơn.'),
(59,40,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Pù Luông.'),
(60,40,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(61,41,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Biển Cửa Lò.'),
(62,42,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Làng Sen quê Bác.'),
(63,42,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(64,43,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Biển Thiên Cầm.'),
(65,44,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Chùa Hương Tích.'),
(66,44,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(67,45,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Thành cổ Quảng Trị.'),
(68,46,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Địa đạo Vịnh Mốc.'),
(69,46,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(70,47,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Đảo Lý Sơn.'),
(71,48,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Biển Mỹ Khê Quảng Ngãi.'),
(72,48,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(73,49,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Biển Hồ Pleiku.'),
(74,50,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Ghềnh Ráng Tiên Sa.'),
(75,50,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(76,51,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Buôn Ma Thuột.'),
(77,52,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Buôn Đôn.'),
(78,52,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(79,53,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Nha Trang.'),
(80,54,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: VinWonders Nha Trang.'),
(81,54,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(82,55,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Đà Lạt.'),
(83,56,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Hồ Xuân Hương.'),
(84,56,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(85,57,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Hồ Trị An.'),
(86,58,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Vườn quốc gia Nam Cát Tiên.'),
(87,58,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(88,59,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Núi Bà Đen.'),
(89,60,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Tòa Thánh Cao Đài.'),
(90,60,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(91,61,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Vườn quốc gia Tràm Chim.'),
(92,62,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Làng hoa Sa Đéc.'),
(93,62,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(94,63,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Rừng tràm Trà Sư.'),
(95,64,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Miếu Bà Chúa Xứ Núi Sam.'),
(96,64,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(97,65,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Cù lao An Bình.'),
(98,66,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Văn Thánh Miếu Vĩnh Long.'),
(99,66,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(100,67,1,'Trong ngày','Đón khách, di chuyển và tham quan điểm chính: Mũi Cà Mau.'),
(101,68,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Rừng U Minh Hạ.'),
(102,68,2,'Ngày 2','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(103,69,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Vịnh Hạ Long.'),
(104,69,2,'Ngày 2','Tiếp tục khám phá tuyến Vịnh Hạ Long, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(105,69,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(106,70,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Sa Pa.'),
(107,70,2,'Ngày 2','Tiếp tục khám phá tuyến Sa Pa, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(108,70,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(109,71,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Tràng An.'),
(110,71,2,'Ngày 2','Tiếp tục khám phá tuyến Tràng An, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(111,71,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(112,72,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Đà Lạt.'),
(113,72,2,'Ngày 2','Tiếp tục khám phá tuyến Đà Lạt, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(114,72,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(115,73,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Phú Quốc.'),
(116,73,2,'Ngày 2','Tiếp tục khám phá tuyến Phú Quốc, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(117,73,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(118,74,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Bà Nà Hills.'),
(119,74,2,'Ngày 2','Tiếp tục khám phá tuyến Bà Nà Hills, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(120,74,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(121,75,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Mũi Né.'),
(122,75,2,'Ngày 2','Tiếp tục khám phá tuyến Mũi Né, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(123,75,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(124,76,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Côn Đảo.'),
(125,76,2,'Ngày 2','Tiếp tục khám phá tuyến Côn Đảo, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(126,76,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(127,77,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Rừng tràm Trà Sư.'),
(128,77,2,'Ngày 2','Tiếp tục khám phá tuyến Rừng tràm Trà Sư, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(129,77,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(130,78,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Mộc Châu.'),
(131,78,2,'Ngày 2','Tiếp tục khám phá tuyến Mộc Châu, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(132,78,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(133,79,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Cao nguyên đá Đồng Văn.'),
(134,79,2,'Ngày 2','Tiếp tục khám phá tuyến Cao nguyên đá Đồng Văn, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(135,79,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(136,80,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Nha Trang.'),
(137,80,2,'Ngày 2','Tiếp tục khám phá tuyến Nha Trang, check-in, nghỉ dưỡng, đặc sản với hoạt động trải nghiệm địa phương.'),
(138,80,3,'Ngày 3','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(139,81,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Sa Pa.'),
(140,81,2,'Ngày 2','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Tràng An, Vịnh Hạ Long, Sa Pa với hoạt động trải nghiệm địa phương.'),
(141,81,3,'Ngày 3','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Tràng An, Vịnh Hạ Long, Sa Pa với hoạt động trải nghiệm địa phương.'),
(142,81,4,'Ngày 4','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Tràng An, Vịnh Hạ Long, Sa Pa với hoạt động trải nghiệm địa phương.'),
(143,81,5,'Ngày 5','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Tràng An, Vịnh Hạ Long, Sa Pa với hoạt động trải nghiệm địa phương.'),
(144,81,6,'Ngày 6','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(145,82,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Bà Nà Hills.'),
(146,82,2,'Ngày 2','Tiếp tục khám phá tuyến Đại Nội Huế, Bà Nà Hills, Hội An, Lý Sơn với hoạt động trải nghiệm địa phương.'),
(147,82,3,'Ngày 3','Tiếp tục khám phá tuyến Đại Nội Huế, Bà Nà Hills, Hội An, Lý Sơn với hoạt động trải nghiệm địa phương.'),
(148,82,4,'Ngày 4','Tiếp tục khám phá tuyến Đại Nội Huế, Bà Nà Hills, Hội An, Lý Sơn với hoạt động trải nghiệm địa phương.'),
(149,82,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(150,83,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Chợ nổi Cái Răng.'),
(151,83,2,'Ngày 2','Tiếp tục khám phá tuyến Dinh Độc Lập, Côn Đảo, Phú Quốc, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(152,83,3,'Ngày 3','Tiếp tục khám phá tuyến Dinh Độc Lập, Côn Đảo, Phú Quốc, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(153,83,4,'Ngày 4','Tiếp tục khám phá tuyến Dinh Độc Lập, Côn Đảo, Phú Quốc, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(154,83,5,'Ngày 5','Tiếp tục khám phá tuyến Dinh Độc Lập, Côn Đảo, Phú Quốc, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(155,83,6,'Ngày 6','Tiếp tục khám phá tuyến Dinh Độc Lập, Côn Đảo, Phú Quốc, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(156,83,7,'Ngày 7','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(157,84,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Sa Pa.'),
(158,84,2,'Ngày 2','Tiếp tục khám phá tuyến Mộc Châu, Điện Biên Phủ, Sa Pa, Fansipan với hoạt động trải nghiệm địa phương.'),
(159,84,3,'Ngày 3','Tiếp tục khám phá tuyến Mộc Châu, Điện Biên Phủ, Sa Pa, Fansipan với hoạt động trải nghiệm địa phương.'),
(160,84,4,'Ngày 4','Tiếp tục khám phá tuyến Mộc Châu, Điện Biên Phủ, Sa Pa, Fansipan với hoạt động trải nghiệm địa phương.'),
(161,84,5,'Ngày 5','Tiếp tục khám phá tuyến Mộc Châu, Điện Biên Phủ, Sa Pa, Fansipan với hoạt động trải nghiệm địa phương.'),
(162,84,6,'Ngày 6','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(163,85,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Vịnh Hạ Long.'),
(164,85,2,'Ngày 2','Tiếp tục khám phá tuyến Thác Bản Giốc, Mẫu Sơn, Vịnh Hạ Long với hoạt động trải nghiệm địa phương.'),
(165,85,3,'Ngày 3','Tiếp tục khám phá tuyến Thác Bản Giốc, Mẫu Sơn, Vịnh Hạ Long với hoạt động trải nghiệm địa phương.'),
(166,85,4,'Ngày 4','Tiếp tục khám phá tuyến Thác Bản Giốc, Mẫu Sơn, Vịnh Hạ Long với hoạt động trải nghiệm địa phương.'),
(167,85,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(168,86,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Đà Lạt.'),
(169,86,2,'Ngày 2','Tiếp tục khám phá tuyến Buôn Ma Thuột, Biển Hồ Gia Lai, Đà Lạt với hoạt động trải nghiệm địa phương.'),
(170,86,3,'Ngày 3','Tiếp tục khám phá tuyến Buôn Ma Thuột, Biển Hồ Gia Lai, Đà Lạt với hoạt động trải nghiệm địa phương.'),
(171,86,4,'Ngày 4','Tiếp tục khám phá tuyến Buôn Ma Thuột, Biển Hồ Gia Lai, Đà Lạt với hoạt động trải nghiệm địa phương.'),
(172,86,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(173,87,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Mũi Cà Mau.'),
(174,87,2,'Ngày 2','Tiếp tục khám phá tuyến Chợ nổi Cái Răng, Tràm Chim, Rừng tràm Trà Sư, Mũi Cà Mau với hoạt động trải nghiệm địa phương.'),
(175,87,3,'Ngày 3','Tiếp tục khám phá tuyến Chợ nổi Cái Răng, Tràm Chim, Rừng tràm Trà Sư, Mũi Cà Mau với hoạt động trải nghiệm địa phương.'),
(176,87,4,'Ngày 4','Tiếp tục khám phá tuyến Chợ nổi Cái Răng, Tràm Chim, Rừng tràm Trà Sư, Mũi Cà Mau với hoạt động trải nghiệm địa phương.'),
(177,87,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(178,88,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Đại Nội Huế.'),
(179,88,2,'Ngày 2','Tiếp tục khám phá tuyến Sầm Sơn, Cửa Lò, Thiên Cầm, Đại Nội Huế, Mỹ Khê với hoạt động trải nghiệm địa phương.'),
(180,88,3,'Ngày 3','Tiếp tục khám phá tuyến Sầm Sơn, Cửa Lò, Thiên Cầm, Đại Nội Huế, Mỹ Khê với hoạt động trải nghiệm địa phương.'),
(181,88,4,'Ngày 4','Tiếp tục khám phá tuyến Sầm Sơn, Cửa Lò, Thiên Cầm, Đại Nội Huế, Mỹ Khê với hoạt động trải nghiệm địa phương.'),
(182,88,5,'Ngày 5','Tiếp tục khám phá tuyến Sầm Sơn, Cửa Lò, Thiên Cầm, Đại Nội Huế, Mỹ Khê với hoạt động trải nghiệm địa phương.'),
(183,88,6,'Ngày 6','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(184,89,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Hồ Hoàn Kiếm.'),
(185,89,2,'Ngày 2','Tiếp tục khám phá tuyến Dinh Độc Lập, Nha Trang, Bà Nà Hills, Đại Nội Huế, Hồ Hoàn Kiếm với hoạt động trải nghiệm địa phương.'),
(186,89,3,'Ngày 3','Tiếp tục khám phá tuyến Dinh Độc Lập, Nha Trang, Bà Nà Hills, Đại Nội Huế, Hồ Hoàn Kiếm với hoạt động trải nghiệm địa phương.'),
(187,89,4,'Ngày 4','Tiếp tục khám phá tuyến Dinh Độc Lập, Nha Trang, Bà Nà Hills, Đại Nội Huế, Hồ Hoàn Kiếm với hoạt động trải nghiệm địa phương.'),
(188,89,5,'Ngày 5','Tiếp tục khám phá tuyến Dinh Độc Lập, Nha Trang, Bà Nà Hills, Đại Nội Huế, Hồ Hoàn Kiếm với hoạt động trải nghiệm địa phương.'),
(189,89,6,'Ngày 6','Tiếp tục khám phá tuyến Dinh Độc Lập, Nha Trang, Bà Nà Hills, Đại Nội Huế, Hồ Hoàn Kiếm với hoạt động trải nghiệm địa phương.'),
(190,89,7,'Ngày 7','Tiếp tục khám phá tuyến Dinh Độc Lập, Nha Trang, Bà Nà Hills, Đại Nội Huế, Hồ Hoàn Kiếm với hoạt động trải nghiệm địa phương.'),
(191,89,8,'Ngày 8','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(192,90,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Chợ nổi Cái Răng.'),
(193,90,2,'Ngày 2','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Vịnh Hạ Long, Đại Nội Huế, Hội An, Dinh Độc Lập, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(194,90,3,'Ngày 3','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Vịnh Hạ Long, Đại Nội Huế, Hội An, Dinh Độc Lập, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(195,90,4,'Ngày 4','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Vịnh Hạ Long, Đại Nội Huế, Hội An, Dinh Độc Lập, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(196,90,5,'Ngày 5','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Vịnh Hạ Long, Đại Nội Huế, Hội An, Dinh Độc Lập, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(197,90,6,'Ngày 6','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Vịnh Hạ Long, Đại Nội Huế, Hội An, Dinh Độc Lập, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(198,90,7,'Ngày 7','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Vịnh Hạ Long, Đại Nội Huế, Hội An, Dinh Độc Lập, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(199,90,8,'Ngày 8','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Vịnh Hạ Long, Đại Nội Huế, Hội An, Dinh Độc Lập, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(200,90,9,'Ngày 9','Tiếp tục khám phá tuyến Hồ Hoàn Kiếm, Vịnh Hạ Long, Đại Nội Huế, Hội An, Dinh Độc Lập, Chợ nổi Cái Răng với hoạt động trải nghiệm địa phương.'),
(201,90,10,'Ngày 10','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(202,91,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Seoul.'),
(203,91,2,'Ngày 2','Tiếp tục khám phá tuyến Seoul, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(204,91,3,'Ngày 3','Tiếp tục khám phá tuyến Seoul, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(205,91,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(206,92,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Busan.'),
(207,92,2,'Ngày 2','Tiếp tục khám phá tuyến Busan, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(208,92,3,'Ngày 3','Tiếp tục khám phá tuyến Busan, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(209,92,4,'Ngày 4','Tiếp tục khám phá tuyến Busan, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(210,92,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(211,93,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Tokyo.'),
(212,93,2,'Ngày 2','Tiếp tục khám phá tuyến Tokyo, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(213,93,3,'Ngày 3','Tiếp tục khám phá tuyến Tokyo, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(214,93,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(215,94,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Kyoto.'),
(216,94,2,'Ngày 2','Tiếp tục khám phá tuyến Kyoto, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(217,94,3,'Ngày 3','Tiếp tục khám phá tuyến Kyoto, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(218,94,4,'Ngày 4','Tiếp tục khám phá tuyến Kyoto, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(219,94,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(220,95,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Bangkok.'),
(221,95,2,'Ngày 2','Tiếp tục khám phá tuyến Bangkok, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(222,95,3,'Ngày 3','Tiếp tục khám phá tuyến Bangkok, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(223,95,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(224,96,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Phuket.'),
(225,96,2,'Ngày 2','Tiếp tục khám phá tuyến Phuket, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(226,96,3,'Ngày 3','Tiếp tục khám phá tuyến Phuket, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(227,96,4,'Ngày 4','Tiếp tục khám phá tuyến Phuket, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(228,96,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(229,97,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Marina Bay Sands.'),
(230,97,2,'Ngày 2','Tiếp tục khám phá tuyến Marina Bay Sands, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(231,97,3,'Ngày 3','Tiếp tục khám phá tuyến Marina Bay Sands, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(232,97,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(233,98,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Kuala Lumpur.'),
(234,98,2,'Ngày 2','Tiếp tục khám phá tuyến Kuala Lumpur, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(235,98,3,'Ngày 3','Tiếp tục khám phá tuyến Kuala Lumpur, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(236,98,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(237,99,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Bali.'),
(238,99,2,'Ngày 2','Tiếp tục khám phá tuyến Bali, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(239,99,3,'Ngày 3','Tiếp tục khám phá tuyến Bali, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(240,99,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(241,100,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Beijing.'),
(242,100,2,'Ngày 2','Tiếp tục khám phá tuyến Beijing, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(243,100,3,'Ngày 3','Tiếp tục khám phá tuyến Beijing, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(244,100,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(245,101,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Shanghai.'),
(246,101,2,'Ngày 2','Tiếp tục khám phá tuyến Shanghai, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(247,101,3,'Ngày 3','Tiếp tục khám phá tuyến Shanghai, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(248,101,4,'Ngày 4','Tiếp tục khám phá tuyến Shanghai, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(249,101,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(250,102,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Taipei.'),
(251,102,2,'Ngày 2','Tiếp tục khám phá tuyến Taipei, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(252,102,3,'Ngày 3','Tiếp tục khám phá tuyến Taipei, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(253,102,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(254,103,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Victoria Peak.'),
(255,103,2,'Ngày 2','Tiếp tục khám phá tuyến Victoria Peak, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(256,103,3,'Ngày 3','Tiếp tục khám phá tuyến Victoria Peak, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(257,103,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(258,104,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Siem Reap.'),
(259,104,2,'Ngày 2','Tiếp tục khám phá tuyến Siem Reap, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(260,104,3,'Ngày 3','Tiếp tục khám phá tuyến Siem Reap, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(261,104,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(262,105,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Luang Prabang.'),
(263,105,2,'Ngày 2','Tiếp tục khám phá tuyến Luang Prabang, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(264,105,3,'Ngày 3','Tiếp tục khám phá tuyến Luang Prabang, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(265,105,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(266,106,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: New Delhi.'),
(267,106,2,'Ngày 2','Tiếp tục khám phá tuyến New Delhi, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(268,106,3,'Ngày 3','Tiếp tục khám phá tuyến New Delhi, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(269,106,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(270,107,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Agra.'),
(271,107,2,'Ngày 2','Tiếp tục khám phá tuyến Agra, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(272,107,3,'Ngày 3','Tiếp tục khám phá tuyến Agra, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(273,107,4,'Ngày 4','Tiếp tục khám phá tuyến Agra, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(274,107,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(275,108,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Male.'),
(276,108,2,'Ngày 2','Tiếp tục khám phá tuyến Male, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(277,108,3,'Ngày 3','Tiếp tục khám phá tuyến Male, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(278,108,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(279,109,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Dubai.'),
(280,109,2,'Ngày 2','Tiếp tục khám phá tuyến Dubai, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(281,109,3,'Ngày 3','Tiếp tục khám phá tuyến Dubai, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(282,109,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(283,110,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Istanbul.'),
(284,110,2,'Ngày 2','Tiếp tục khám phá tuyến Istanbul, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(285,110,3,'Ngày 3','Tiếp tục khám phá tuyến Istanbul, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(286,110,4,'Ngày 4','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(287,111,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Paris.'),
(288,111,2,'Ngày 2','Tiếp tục khám phá tuyến Paris, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(289,111,3,'Ngày 3','Tiếp tục khám phá tuyến Paris, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(290,111,4,'Ngày 4','Tiếp tục khám phá tuyến Paris, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(291,111,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(292,112,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Rome.'),
(293,112,2,'Ngày 2','Tiếp tục khám phá tuyến Rome, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(294,112,3,'Ngày 3','Tiếp tục khám phá tuyến Rome, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(295,112,4,'Ngày 4','Tiếp tục khám phá tuyến Rome, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(296,112,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(297,113,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Venice.'),
(298,113,2,'Ngày 2','Tiếp tục khám phá tuyến Venice, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(299,113,3,'Ngày 3','Tiếp tục khám phá tuyến Venice, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(300,113,4,'Ngày 4','Tiếp tục khám phá tuyến Venice, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(301,113,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(302,114,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: London.'),
(303,114,2,'Ngày 2','Tiếp tục khám phá tuyến London, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(304,114,3,'Ngày 3','Tiếp tục khám phá tuyến London, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(305,114,4,'Ngày 4','Tiếp tục khám phá tuyến London, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(306,114,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(307,115,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Madrid.'),
(308,115,2,'Ngày 2','Tiếp tục khám phá tuyến Madrid, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(309,115,3,'Ngày 3','Tiếp tục khám phá tuyến Madrid, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(310,115,4,'Ngày 4','Tiếp tục khám phá tuyến Madrid, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(311,115,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(312,116,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Barcelona.'),
(313,116,2,'Ngày 2','Tiếp tục khám phá tuyến Barcelona, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(314,116,3,'Ngày 3','Tiếp tục khám phá tuyến Barcelona, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(315,116,4,'Ngày 4','Tiếp tục khám phá tuyến Barcelona, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(316,116,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(317,117,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Berlin.'),
(318,117,2,'Ngày 2','Tiếp tục khám phá tuyến Berlin, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(319,117,3,'Ngày 3','Tiếp tục khám phá tuyến Berlin, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(320,117,4,'Ngày 4','Tiếp tục khám phá tuyến Berlin, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(321,117,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(322,118,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Munich.'),
(323,118,2,'Ngày 2','Tiếp tục khám phá tuyến Munich, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(324,118,3,'Ngày 3','Tiếp tục khám phá tuyến Munich, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(325,118,4,'Ngày 4','Tiếp tục khám phá tuyến Munich, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(326,118,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(327,119,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Amsterdam.'),
(328,119,2,'Ngày 2','Tiếp tục khám phá tuyến Amsterdam, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(329,119,3,'Ngày 3','Tiếp tục khám phá tuyến Amsterdam, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(330,119,4,'Ngày 4','Tiếp tục khám phá tuyến Amsterdam, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(331,119,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(332,120,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Zurich.'),
(333,120,2,'Ngày 2','Tiếp tục khám phá tuyến Zurich, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(334,120,3,'Ngày 3','Tiếp tục khám phá tuyến Zurich, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(335,120,4,'Ngày 4','Tiếp tục khám phá tuyến Zurich, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(336,120,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(337,121,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Vienna.'),
(338,121,2,'Ngày 2','Tiếp tục khám phá tuyến Vienna, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(339,121,3,'Ngày 3','Tiếp tục khám phá tuyến Vienna, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(340,121,4,'Ngày 4','Tiếp tục khám phá tuyến Vienna, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(341,121,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(342,122,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Prague.'),
(343,122,2,'Ngày 2','Tiếp tục khám phá tuyến Prague, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(344,122,3,'Ngày 3','Tiếp tục khám phá tuyến Prague, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(345,122,4,'Ngày 4','Tiếp tục khám phá tuyến Prague, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(346,122,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(347,123,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Athens.'),
(348,123,2,'Ngày 2','Tiếp tục khám phá tuyến Athens, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(349,123,3,'Ngày 3','Tiếp tục khám phá tuyến Athens, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(350,123,4,'Ngày 4','Tiếp tục khám phá tuyến Athens, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(351,123,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(352,124,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Lisbon.'),
(353,124,2,'Ngày 2','Tiếp tục khám phá tuyến Lisbon, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(354,124,3,'Ngày 3','Tiếp tục khám phá tuyến Lisbon, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(355,124,4,'Ngày 4','Tiếp tục khám phá tuyến Lisbon, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(356,124,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(357,125,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Helsinki.'),
(358,125,2,'Ngày 2','Tiếp tục khám phá tuyến Helsinki, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(359,125,3,'Ngày 3','Tiếp tục khám phá tuyến Helsinki, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(360,125,4,'Ngày 4','Tiếp tục khám phá tuyến Helsinki, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(361,125,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(362,126,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Oslo.'),
(363,126,2,'Ngày 2','Tiếp tục khám phá tuyến Oslo, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(364,126,3,'Ngày 3','Tiếp tục khám phá tuyến Oslo, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(365,126,4,'Ngày 4','Tiếp tục khám phá tuyến Oslo, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(366,126,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(367,127,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Copenhagen.'),
(368,127,2,'Ngày 2','Tiếp tục khám phá tuyến Copenhagen, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(369,127,3,'Ngày 3','Tiếp tục khám phá tuyến Copenhagen, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(370,127,4,'Ngày 4','Tiếp tục khám phá tuyến Copenhagen, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(371,127,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(372,128,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Reykjavik.'),
(373,128,2,'Ngày 2','Tiếp tục khám phá tuyến Reykjavik, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(374,128,3,'Ngày 3','Tiếp tục khám phá tuyến Reykjavik, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(375,128,4,'Ngày 4','Tiếp tục khám phá tuyến Reykjavik, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(376,128,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(377,129,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Cairo.'),
(378,129,2,'Ngày 2','Tiếp tục khám phá tuyến Cairo, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(379,129,3,'Ngày 3','Tiếp tục khám phá tuyến Cairo, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(380,129,4,'Ngày 4','Tiếp tục khám phá tuyến Cairo, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(381,129,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(382,130,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Cape Town.'),
(383,130,2,'Ngày 2','Tiếp tục khám phá tuyến Cape Town, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(384,130,3,'Ngày 3','Tiếp tục khám phá tuyến Cape Town, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(385,130,4,'Ngày 4','Tiếp tục khám phá tuyến Cape Town, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(386,130,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(387,131,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Marrakech.'),
(388,131,2,'Ngày 2','Tiếp tục khám phá tuyến Marrakech, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(389,131,3,'Ngày 3','Tiếp tục khám phá tuyến Marrakech, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(390,131,4,'Ngày 4','Tiếp tục khám phá tuyến Marrakech, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(391,131,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(392,132,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Nairobi.'),
(393,132,2,'Ngày 2','Tiếp tục khám phá tuyến Nairobi, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(394,132,3,'Ngày 3','Tiếp tục khám phá tuyến Nairobi, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(395,132,4,'Ngày 4','Tiếp tục khám phá tuyến Nairobi, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(396,132,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(397,133,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Serengeti.'),
(398,133,2,'Ngày 2','Tiếp tục khám phá tuyến Serengeti, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(399,133,3,'Ngày 3','Tiếp tục khám phá tuyến Serengeti, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(400,133,4,'Ngày 4','Tiếp tục khám phá tuyến Serengeti, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(401,133,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(402,134,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: New York.'),
(403,134,2,'Ngày 2','Tiếp tục khám phá tuyến New York, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(404,134,3,'Ngày 3','Tiếp tục khám phá tuyến New York, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(405,134,4,'Ngày 4','Tiếp tục khám phá tuyến New York, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(406,134,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(407,135,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Los Angeles.'),
(408,135,2,'Ngày 2','Tiếp tục khám phá tuyến Los Angeles, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(409,135,3,'Ngày 3','Tiếp tục khám phá tuyến Los Angeles, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(410,135,4,'Ngày 4','Tiếp tục khám phá tuyến Los Angeles, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(411,135,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(412,136,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Toronto.'),
(413,136,2,'Ngày 2','Tiếp tục khám phá tuyến Toronto, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(414,136,3,'Ngày 3','Tiếp tục khám phá tuyến Toronto, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(415,136,4,'Ngày 4','Tiếp tục khám phá tuyến Toronto, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(416,136,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(417,137,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Vancouver.'),
(418,137,2,'Ngày 2','Tiếp tục khám phá tuyến Vancouver, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(419,137,3,'Ngày 3','Tiếp tục khám phá tuyến Vancouver, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(420,137,4,'Ngày 4','Tiếp tục khám phá tuyến Vancouver, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(421,137,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(422,138,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Mexico City.'),
(423,138,2,'Ngày 2','Tiếp tục khám phá tuyến Mexico City, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(424,138,3,'Ngày 3','Tiếp tục khám phá tuyến Mexico City, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(425,138,4,'Ngày 4','Tiếp tục khám phá tuyến Mexico City, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(426,138,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(427,139,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Rio de Janeiro.'),
(428,139,2,'Ngày 2','Tiếp tục khám phá tuyến Rio de Janeiro, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(429,139,3,'Ngày 3','Tiếp tục khám phá tuyến Rio de Janeiro, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(430,139,4,'Ngày 4','Tiếp tục khám phá tuyến Rio de Janeiro, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(431,139,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(432,140,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Buenos Aires.'),
(433,140,2,'Ngày 2','Tiếp tục khám phá tuyến Buenos Aires, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(434,140,3,'Ngày 3','Tiếp tục khám phá tuyến Buenos Aires, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(435,140,4,'Ngày 4','Tiếp tục khám phá tuyến Buenos Aires, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(436,140,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(437,141,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Lima.'),
(438,141,2,'Ngày 2','Tiếp tục khám phá tuyến Lima, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(439,141,3,'Ngày 3','Tiếp tục khám phá tuyến Lima, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(440,141,4,'Ngày 4','Tiếp tục khám phá tuyến Lima, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(441,141,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(442,142,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Santiago.'),
(443,142,2,'Ngày 2','Tiếp tục khám phá tuyến Santiago, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(444,142,3,'Ngày 3','Tiếp tục khám phá tuyến Santiago, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(445,142,4,'Ngày 4','Tiếp tục khám phá tuyến Santiago, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(446,142,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(447,143,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Sydney.'),
(448,143,2,'Ngày 2','Tiếp tục khám phá tuyến Sydney, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(449,143,3,'Ngày 3','Tiếp tục khám phá tuyến Sydney, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(450,143,4,'Ngày 4','Tiếp tục khám phá tuyến Sydney, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(451,143,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(452,144,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Melbourne.'),
(453,144,2,'Ngày 2','Tiếp tục khám phá tuyến Melbourne, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(454,144,3,'Ngày 3','Tiếp tục khám phá tuyến Melbourne, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(455,144,4,'Ngày 4','Tiếp tục khám phá tuyến Melbourne, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(456,144,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(457,145,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Auckland.'),
(458,145,2,'Ngày 2','Tiếp tục khám phá tuyến Auckland, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(459,145,3,'Ngày 3','Tiếp tục khám phá tuyến Auckland, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(460,145,4,'Ngày 4','Tiếp tục khám phá tuyến Auckland, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(461,145,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(462,146,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Queenstown.'),
(463,146,2,'Ngày 2','Tiếp tục khám phá tuyến Queenstown, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(464,146,3,'Ngày 3','Tiếp tục khám phá tuyến Queenstown, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(465,146,4,'Ngày 4','Tiếp tục khám phá tuyến Queenstown, trải nghiệm cao cấp, ẩm thực địa phương với hoạt động trải nghiệm địa phương.'),
(466,146,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(467,147,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Nadi.'),
(468,147,2,'Ngày 2','Tiếp tục khám phá tuyến Nadi, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(469,147,3,'Ngày 3','Tiếp tục khám phá tuyến Nadi, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(470,147,4,'Ngày 4','Tiếp tục khám phá tuyến Nadi, city tour, ẩm thực, mua sắm với hoạt động trải nghiệm địa phương.'),
(471,147,5,'Ngày 5','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(472,148,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Kyoto.'),
(473,148,2,'Ngày 2','Tiếp tục khám phá tuyến Seoul, Tokyo, Kyoto với hoạt động trải nghiệm địa phương.'),
(474,148,3,'Ngày 3','Tiếp tục khám phá tuyến Seoul, Tokyo, Kyoto với hoạt động trải nghiệm địa phương.'),
(475,148,4,'Ngày 4','Tiếp tục khám phá tuyến Seoul, Tokyo, Kyoto với hoạt động trải nghiệm địa phương.'),
(476,148,5,'Ngày 5','Tiếp tục khám phá tuyến Seoul, Tokyo, Kyoto với hoạt động trải nghiệm địa phương.'),
(477,148,6,'Ngày 6','Tiếp tục khám phá tuyến Seoul, Tokyo, Kyoto với hoạt động trải nghiệm địa phương.'),
(478,148,7,'Ngày 7','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(479,149,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Busan.'),
(480,149,2,'Ngày 2','Tiếp tục khám phá tuyến Osaka, Kyoto, Seoul, Busan với hoạt động trải nghiệm địa phương.'),
(481,149,3,'Ngày 3','Tiếp tục khám phá tuyến Osaka, Kyoto, Seoul, Busan với hoạt động trải nghiệm địa phương.'),
(482,149,4,'Ngày 4','Tiếp tục khám phá tuyến Osaka, Kyoto, Seoul, Busan với hoạt động trải nghiệm địa phương.'),
(483,149,5,'Ngày 5','Tiếp tục khám phá tuyến Osaka, Kyoto, Seoul, Busan với hoạt động trải nghiệm địa phương.'),
(484,149,6,'Ngày 6','Tiếp tục khám phá tuyến Osaka, Kyoto, Seoul, Busan với hoạt động trải nghiệm địa phương.'),
(485,149,7,'Ngày 7','Tiếp tục khám phá tuyến Osaka, Kyoto, Seoul, Busan với hoạt động trải nghiệm địa phương.'),
(486,149,8,'Ngày 8','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(487,150,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Kuala Lumpur.'),
(488,150,2,'Ngày 2','Tiếp tục khám phá tuyến Bangkok, Singapore, Kuala Lumpur với hoạt động trải nghiệm địa phương.'),
(489,150,3,'Ngày 3','Tiếp tục khám phá tuyến Bangkok, Singapore, Kuala Lumpur với hoạt động trải nghiệm địa phương.'),
(490,150,4,'Ngày 4','Tiếp tục khám phá tuyến Bangkok, Singapore, Kuala Lumpur với hoạt động trải nghiệm địa phương.'),
(491,150,5,'Ngày 5','Tiếp tục khám phá tuyến Bangkok, Singapore, Kuala Lumpur với hoạt động trải nghiệm địa phương.'),
(492,150,6,'Ngày 6','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(493,151,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Bangkok.'),
(494,151,2,'Ngày 2','Tiếp tục khám phá tuyến Luang Prabang, Siem Reap, Bangkok với hoạt động trải nghiệm địa phương.'),
(495,151,3,'Ngày 3','Tiếp tục khám phá tuyến Luang Prabang, Siem Reap, Bangkok với hoạt động trải nghiệm địa phương.'),
(496,151,4,'Ngày 4','Tiếp tục khám phá tuyến Luang Prabang, Siem Reap, Bangkok với hoạt động trải nghiệm địa phương.'),
(497,151,5,'Ngày 5','Tiếp tục khám phá tuyến Luang Prabang, Siem Reap, Bangkok với hoạt động trải nghiệm địa phương.'),
(498,151,6,'Ngày 6','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(499,152,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Zurich.'),
(500,152,2,'Ngày 2','Tiếp tục khám phá tuyến Paris, Rome, Venice, Zurich với hoạt động trải nghiệm địa phương.'),
(501,152,3,'Ngày 3','Tiếp tục khám phá tuyến Paris, Rome, Venice, Zurich với hoạt động trải nghiệm địa phương.'),
(502,152,4,'Ngày 4','Tiếp tục khám phá tuyến Paris, Rome, Venice, Zurich với hoạt động trải nghiệm địa phương.'),
(503,152,5,'Ngày 5','Tiếp tục khám phá tuyến Paris, Rome, Venice, Zurich với hoạt động trải nghiệm địa phương.'),
(504,152,6,'Ngày 6','Tiếp tục khám phá tuyến Paris, Rome, Venice, Zurich với hoạt động trải nghiệm địa phương.'),
(505,152,7,'Ngày 7','Tiếp tục khám phá tuyến Paris, Rome, Venice, Zurich với hoạt động trải nghiệm địa phương.'),
(506,152,8,'Ngày 8','Tiếp tục khám phá tuyến Paris, Rome, Venice, Zurich với hoạt động trải nghiệm địa phương.'),
(507,152,9,'Ngày 9','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(508,153,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Paris.'),
(509,153,2,'Ngày 2','Tiếp tục khám phá tuyến London, Amsterdam, Paris với hoạt động trải nghiệm địa phương.'),
(510,153,3,'Ngày 3','Tiếp tục khám phá tuyến London, Amsterdam, Paris với hoạt động trải nghiệm địa phương.'),
(511,153,4,'Ngày 4','Tiếp tục khám phá tuyến London, Amsterdam, Paris với hoạt động trải nghiệm địa phương.'),
(512,153,5,'Ngày 5','Tiếp tục khám phá tuyến London, Amsterdam, Paris với hoạt động trải nghiệm địa phương.'),
(513,153,6,'Ngày 6','Tiếp tục khám phá tuyến London, Amsterdam, Paris với hoạt động trải nghiệm địa phương.'),
(514,153,7,'Ngày 7','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(515,154,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Lisbon.'),
(516,154,2,'Ngày 2','Tiếp tục khám phá tuyến Barcelona, Madrid, Lisbon với hoạt động trải nghiệm địa phương.'),
(517,154,3,'Ngày 3','Tiếp tục khám phá tuyến Barcelona, Madrid, Lisbon với hoạt động trải nghiệm địa phương.'),
(518,154,4,'Ngày 4','Tiếp tục khám phá tuyến Barcelona, Madrid, Lisbon với hoạt động trải nghiệm địa phương.'),
(519,154,5,'Ngày 5','Tiếp tục khám phá tuyến Barcelona, Madrid, Lisbon với hoạt động trải nghiệm địa phương.'),
(520,154,6,'Ngày 6','Tiếp tục khám phá tuyến Barcelona, Madrid, Lisbon với hoạt động trải nghiệm địa phương.'),
(521,154,7,'Ngày 7','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(522,155,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Reykjavik.'),
(523,155,2,'Ngày 2','Tiếp tục khám phá tuyến Copenhagen, Oslo, Reykjavik với hoạt động trải nghiệm địa phương.'),
(524,155,3,'Ngày 3','Tiếp tục khám phá tuyến Copenhagen, Oslo, Reykjavik với hoạt động trải nghiệm địa phương.'),
(525,155,4,'Ngày 4','Tiếp tục khám phá tuyến Copenhagen, Oslo, Reykjavik với hoạt động trải nghiệm địa phương.'),
(526,155,5,'Ngày 5','Tiếp tục khám phá tuyến Copenhagen, Oslo, Reykjavik với hoạt động trải nghiệm địa phương.'),
(527,155,6,'Ngày 6','Tiếp tục khám phá tuyến Copenhagen, Oslo, Reykjavik với hoạt động trải nghiệm địa phương.'),
(528,155,7,'Ngày 7','Tiếp tục khám phá tuyến Copenhagen, Oslo, Reykjavik với hoạt động trải nghiệm địa phương.'),
(529,155,8,'Ngày 8','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(530,156,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: San Francisco.'),
(531,156,2,'Ngày 2','Tiếp tục khám phá tuyến Los Angeles, Las Vegas, San Francisco với hoạt động trải nghiệm địa phương.'),
(532,156,3,'Ngày 3','Tiếp tục khám phá tuyến Los Angeles, Las Vegas, San Francisco với hoạt động trải nghiệm địa phương.'),
(533,156,4,'Ngày 4','Tiếp tục khám phá tuyến Los Angeles, Las Vegas, San Francisco với hoạt động trải nghiệm địa phương.'),
(534,156,5,'Ngày 5','Tiếp tục khám phá tuyến Los Angeles, Las Vegas, San Francisco với hoạt động trải nghiệm địa phương.'),
(535,156,6,'Ngày 6','Tiếp tục khám phá tuyến Los Angeles, Las Vegas, San Francisco với hoạt động trải nghiệm địa phương.'),
(536,156,7,'Ngày 7','Tiếp tục khám phá tuyến Los Angeles, Las Vegas, San Francisco với hoạt động trải nghiệm địa phương.'),
(537,156,8,'Ngày 8','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(538,157,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Toronto.'),
(539,157,2,'Ngày 2','Tiếp tục khám phá tuyến New York, Washington D.C., Toronto với hoạt động trải nghiệm địa phương.'),
(540,157,3,'Ngày 3','Tiếp tục khám phá tuyến New York, Washington D.C., Toronto với hoạt động trải nghiệm địa phương.'),
(541,157,4,'Ngày 4','Tiếp tục khám phá tuyến New York, Washington D.C., Toronto với hoạt động trải nghiệm địa phương.'),
(542,157,5,'Ngày 5','Tiếp tục khám phá tuyến New York, Washington D.C., Toronto với hoạt động trải nghiệm địa phương.'),
(543,157,6,'Ngày 6','Tiếp tục khám phá tuyến New York, Washington D.C., Toronto với hoạt động trải nghiệm địa phương.'),
(544,157,7,'Ngày 7','Tiếp tục khám phá tuyến New York, Washington D.C., Toronto với hoạt động trải nghiệm địa phương.'),
(545,157,8,'Ngày 8','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(546,158,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Queenstown.'),
(547,158,2,'Ngày 2','Tiếp tục khám phá tuyến Sydney, Melbourne, Auckland, Queenstown với hoạt động trải nghiệm địa phương.'),
(548,158,3,'Ngày 3','Tiếp tục khám phá tuyến Sydney, Melbourne, Auckland, Queenstown với hoạt động trải nghiệm địa phương.'),
(549,158,4,'Ngày 4','Tiếp tục khám phá tuyến Sydney, Melbourne, Auckland, Queenstown với hoạt động trải nghiệm địa phương.'),
(550,158,5,'Ngày 5','Tiếp tục khám phá tuyến Sydney, Melbourne, Auckland, Queenstown với hoạt động trải nghiệm địa phương.'),
(551,158,6,'Ngày 6','Tiếp tục khám phá tuyến Sydney, Melbourne, Auckland, Queenstown với hoạt động trải nghiệm địa phương.'),
(552,158,7,'Ngày 7','Tiếp tục khám phá tuyến Sydney, Melbourne, Auckland, Queenstown với hoạt động trải nghiệm địa phương.'),
(553,158,8,'Ngày 8','Tiếp tục khám phá tuyến Sydney, Melbourne, Auckland, Queenstown với hoạt động trải nghiệm địa phương.'),
(554,158,9,'Ngày 9','Tiếp tục khám phá tuyến Sydney, Melbourne, Auckland, Queenstown với hoạt động trải nghiệm địa phương.'),
(555,158,10,'Ngày 10','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(556,159,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Cusco.'),
(557,159,2,'Ngày 2','Tiếp tục khám phá tuyến Rio de Janeiro, Buenos Aires, Cusco với hoạt động trải nghiệm địa phương.'),
(558,159,3,'Ngày 3','Tiếp tục khám phá tuyến Rio de Janeiro, Buenos Aires, Cusco với hoạt động trải nghiệm địa phương.'),
(559,159,4,'Ngày 4','Tiếp tục khám phá tuyến Rio de Janeiro, Buenos Aires, Cusco với hoạt động trải nghiệm địa phương.'),
(560,159,5,'Ngày 5','Tiếp tục khám phá tuyến Rio de Janeiro, Buenos Aires, Cusco với hoạt động trải nghiệm địa phương.'),
(561,159,6,'Ngày 6','Tiếp tục khám phá tuyến Rio de Janeiro, Buenos Aires, Cusco với hoạt động trải nghiệm địa phương.'),
(562,159,7,'Ngày 7','Tiếp tục khám phá tuyến Rio de Janeiro, Buenos Aires, Cusco với hoạt động trải nghiệm địa phương.'),
(563,159,8,'Ngày 8','Tiếp tục khám phá tuyến Rio de Janeiro, Buenos Aires, Cusco với hoạt động trải nghiệm địa phương.'),
(564,159,9,'Ngày 9','Tiếp tục khám phá tuyến Rio de Janeiro, Buenos Aires, Cusco với hoạt động trải nghiệm địa phương.'),
(565,159,10,'Ngày 10','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.'),
(566,160,1,'Ngày 1','Đón khách, di chuyển và tham quan điểm chính: Cape Town.'),
(567,160,2,'Ngày 2','Tiếp tục khám phá tuyến Cairo, Marrakech, Cape Town với hoạt động trải nghiệm địa phương.'),
(568,160,3,'Ngày 3','Tiếp tục khám phá tuyến Cairo, Marrakech, Cape Town với hoạt động trải nghiệm địa phương.'),
(569,160,4,'Ngày 4','Tiếp tục khám phá tuyến Cairo, Marrakech, Cape Town với hoạt động trải nghiệm địa phương.'),
(570,160,5,'Ngày 5','Tiếp tục khám phá tuyến Cairo, Marrakech, Cape Town với hoạt động trải nghiệm địa phương.'),
(571,160,6,'Ngày 6','Tiếp tục khám phá tuyến Cairo, Marrakech, Cape Town với hoạt động trải nghiệm địa phương.'),
(572,160,7,'Ngày 7','Tiếp tục khám phá tuyến Cairo, Marrakech, Cape Town với hoạt động trải nghiệm địa phương.'),
(573,160,8,'Ngày 8','Tiếp tục khám phá tuyến Cairo, Marrakech, Cape Town với hoạt động trải nghiệm địa phương.'),
(574,160,9,'Ngày 9','Tiếp tục khám phá tuyến Cairo, Marrakech, Cape Town với hoạt động trải nghiệm địa phương.'),
(575,160,10,'Ngày 10','Ăn sáng, mua sắm đặc sản/quà lưu niệm và kết thúc hành trình.');

INSERT IGNORE INTO itinerary_items (
    itinerary_day_id, sequence_no, item_type, title, description, location_name, start_time, end_time
) VALUES
(1,1,'activity','Tham quan Hồ Hoàn Kiếm','Điểm chính của tour: Hồ Hoàn Kiếm','Hồ Hoàn Kiếm','08:30:00','10:30:00'),
(1,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(2,1,'activity','Tham quan Văn Miếu - Quốc Tử Giám','Điểm chính của tour: Văn Miếu - Quốc Tử Giám','Văn Miếu - Quốc Tử Giám','08:30:00','10:30:00'),
(2,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(3,1,'activity','Tham quan Văn Miếu - Quốc Tử Giám','Điểm chính của tour: Văn Miếu - Quốc Tử Giám','Văn Miếu - Quốc Tử Giám','08:30:00','10:30:00'),
(3,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(4,1,'activity','Tham quan Đại Nội Huế','Điểm chính của tour: Đại Nội Huế','Đại Nội Huế','08:30:00','10:30:00'),
(4,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(5,1,'activity','Tham quan Lăng Khải Định','Điểm chính của tour: Lăng Khải Định','Lăng Khải Định','08:30:00','10:30:00'),
(5,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(6,1,'activity','Tham quan Lăng Khải Định','Điểm chính của tour: Lăng Khải Định','Lăng Khải Định','08:30:00','10:30:00'),
(6,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(7,1,'activity','Tham quan Đảo Cát Bà','Điểm chính của tour: Đảo Cát Bà','Đảo Cát Bà','08:30:00','10:30:00'),
(7,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(8,1,'activity','Tham quan Vịnh Lan Hạ','Điểm chính của tour: Vịnh Lan Hạ','Vịnh Lan Hạ','08:30:00','10:30:00'),
(8,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(9,1,'activity','Tham quan Vịnh Lan Hạ','Điểm chính của tour: Vịnh Lan Hạ','Vịnh Lan Hạ','08:30:00','10:30:00'),
(9,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(10,1,'activity','Tham quan Bà Nà Hills','Điểm chính của tour: Bà Nà Hills','Bà Nà Hills','08:30:00','10:30:00'),
(10,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(11,1,'activity','Tham quan Cầu Rồng','Điểm chính của tour: Cầu Rồng','Cầu Rồng','08:30:00','10:30:00'),
(11,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(12,1,'activity','Tham quan Cầu Rồng','Điểm chính của tour: Cầu Rồng','Cầu Rồng','08:30:00','10:30:00'),
(12,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(13,1,'activity','Tham quan Dinh Độc Lập','Điểm chính của tour: Dinh Độc Lập','Dinh Độc Lập','08:30:00','10:30:00'),
(13,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(14,1,'activity','Tham quan Nhà thờ Đức Bà','Điểm chính của tour: Nhà thờ Đức Bà','Nhà thờ Đức Bà','08:30:00','10:30:00'),
(14,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(15,1,'activity','Tham quan Nhà thờ Đức Bà','Điểm chính của tour: Nhà thờ Đức Bà','Nhà thờ Đức Bà','08:30:00','10:30:00'),
(15,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(16,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(16,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(17,1,'activity','Tham quan Bến Ninh Kiều','Điểm chính của tour: Bến Ninh Kiều','Bến Ninh Kiều','08:30:00','10:30:00'),
(17,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(18,1,'activity','Tham quan Bến Ninh Kiều','Điểm chính của tour: Bến Ninh Kiều','Bến Ninh Kiều','08:30:00','10:30:00'),
(18,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(19,1,'activity','Tham quan Khu di tích Tân Trào','Điểm chính của tour: Khu di tích Tân Trào','Khu di tích Tân Trào','08:30:00','10:30:00'),
(19,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(20,1,'activity','Tham quan Hồ Na Hang','Điểm chính của tour: Hồ Na Hang','Hồ Na Hang','08:30:00','10:30:00'),
(20,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(21,1,'activity','Tham quan Hồ Na Hang','Điểm chính của tour: Hồ Na Hang','Hồ Na Hang','08:30:00','10:30:00'),
(21,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(22,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(22,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(23,1,'activity','Tham quan Đỉnh Fansipan','Điểm chính của tour: Đỉnh Fansipan','Đỉnh Fansipan','08:30:00','10:30:00'),
(23,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(24,1,'activity','Tham quan Đỉnh Fansipan','Điểm chính của tour: Đỉnh Fansipan','Đỉnh Fansipan','08:30:00','10:30:00'),
(24,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(25,1,'activity','Tham quan Pu Ta Leng','Điểm chính của tour: Pu Ta Leng','Pu Ta Leng','08:30:00','10:30:00'),
(25,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(26,1,'activity','Tham quan Đèo Ô Quy Hồ','Điểm chính của tour: Đèo Ô Quy Hồ','Đèo Ô Quy Hồ','08:30:00','10:30:00'),
(26,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(27,1,'activity','Tham quan Đèo Ô Quy Hồ','Điểm chính của tour: Đèo Ô Quy Hồ','Đèo Ô Quy Hồ','08:30:00','10:30:00'),
(27,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(28,1,'activity','Tham quan Đồi A1','Điểm chính của tour: Đồi A1','Đồi A1','08:30:00','10:30:00'),
(28,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(29,1,'activity','Tham quan Bảo tàng Chiến thắng Điện Biên Phủ','Điểm chính của tour: Bảo tàng Chiến thắng Điện Biên Phủ','Bảo tàng Chiến thắng Điện Biên Phủ','08:30:00','10:30:00'),
(29,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(30,1,'activity','Tham quan Bảo tàng Chiến thắng Điện Biên Phủ','Điểm chính của tour: Bảo tàng Chiến thắng Điện Biên Phủ','Bảo tàng Chiến thắng Điện Biên Phủ','08:30:00','10:30:00'),
(30,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(31,1,'activity','Tham quan Mộc Châu','Điểm chính của tour: Mộc Châu','Mộc Châu','08:30:00','10:30:00'),
(31,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(32,1,'activity','Tham quan Tà Xùa','Điểm chính của tour: Tà Xùa','Tà Xùa','08:30:00','10:30:00'),
(32,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(33,1,'activity','Tham quan Tà Xùa','Điểm chính của tour: Tà Xùa','Tà Xùa','08:30:00','10:30:00'),
(33,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(34,1,'activity','Tham quan Mẫu Sơn','Điểm chính của tour: Mẫu Sơn','Mẫu Sơn','08:30:00','10:30:00'),
(34,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(35,1,'activity','Tham quan Động Tam Thanh','Điểm chính của tour: Động Tam Thanh','Động Tam Thanh','08:30:00','10:30:00'),
(35,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(36,1,'activity','Tham quan Động Tam Thanh','Điểm chính của tour: Động Tam Thanh','Động Tam Thanh','08:30:00','10:30:00'),
(36,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(37,1,'activity','Tham quan Thác Bản Giốc','Điểm chính của tour: Thác Bản Giốc','Thác Bản Giốc','08:30:00','10:30:00'),
(37,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(38,1,'activity','Tham quan Động Ngườm Ngao','Điểm chính của tour: Động Ngườm Ngao','Động Ngườm Ngao','08:30:00','10:30:00'),
(38,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(39,1,'activity','Tham quan Động Ngườm Ngao','Điểm chính của tour: Động Ngườm Ngao','Động Ngườm Ngao','08:30:00','10:30:00'),
(39,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(40,1,'activity','Tham quan Hồ Núi Cốc','Điểm chính của tour: Hồ Núi Cốc','Hồ Núi Cốc','08:30:00','10:30:00'),
(40,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(41,1,'activity','Tham quan Đồi chè Tân Cương','Điểm chính của tour: Đồi chè Tân Cương','Đồi chè Tân Cương','08:30:00','10:30:00'),
(41,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(42,1,'activity','Tham quan Đồi chè Tân Cương','Điểm chính của tour: Đồi chè Tân Cương','Đồi chè Tân Cương','08:30:00','10:30:00'),
(42,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(43,1,'activity','Tham quan Đền Hùng','Điểm chính của tour: Đền Hùng','Đền Hùng','08:30:00','10:30:00'),
(43,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(44,1,'activity','Tham quan Vườn quốc gia Xuân Sơn','Điểm chính của tour: Vườn quốc gia Xuân Sơn','Vườn quốc gia Xuân Sơn','08:30:00','10:30:00'),
(44,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(45,1,'activity','Tham quan Vườn quốc gia Xuân Sơn','Điểm chính của tour: Vườn quốc gia Xuân Sơn','Vườn quốc gia Xuân Sơn','08:30:00','10:30:00'),
(45,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(46,1,'activity','Tham quan Chùa Dâu','Điểm chính của tour: Chùa Dâu','Chùa Dâu','08:30:00','10:30:00'),
(46,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(47,1,'activity','Tham quan Chùa Bút Tháp','Điểm chính của tour: Chùa Bút Tháp','Chùa Bút Tháp','08:30:00','10:30:00'),
(47,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(48,1,'activity','Tham quan Chùa Bút Tháp','Điểm chính của tour: Chùa Bút Tháp','Chùa Bút Tháp','08:30:00','10:30:00'),
(48,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(49,1,'activity','Tham quan Phố Hiến','Điểm chính của tour: Phố Hiến','Phố Hiến','08:30:00','10:30:00'),
(49,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(50,1,'activity','Tham quan Đền Chử Đồng Tử','Điểm chính của tour: Đền Chử Đồng Tử','Đền Chử Đồng Tử','08:30:00','10:30:00'),
(50,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(51,1,'activity','Tham quan Đền Chử Đồng Tử','Điểm chính của tour: Đền Chử Đồng Tử','Đền Chử Đồng Tử','08:30:00','10:30:00'),
(51,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(52,1,'activity','Tham quan Tràng An','Điểm chính của tour: Tràng An','Tràng An','08:30:00','10:30:00'),
(52,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(53,1,'activity','Tham quan Tam Cốc - Bích Động','Điểm chính của tour: Tam Cốc - Bích Động','Tam Cốc - Bích Động','08:30:00','10:30:00'),
(53,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(54,1,'activity','Tham quan Tam Cốc - Bích Động','Điểm chính của tour: Tam Cốc - Bích Động','Tam Cốc - Bích Động','08:30:00','10:30:00'),
(54,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(55,1,'activity','Tham quan Vịnh Hạ Long','Điểm chính của tour: Vịnh Hạ Long','Vịnh Hạ Long','08:30:00','10:30:00'),
(55,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(56,1,'activity','Tham quan Yên Tử','Điểm chính của tour: Yên Tử','Yên Tử','08:30:00','10:30:00'),
(56,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(57,1,'activity','Tham quan Yên Tử','Điểm chính của tour: Yên Tử','Yên Tử','08:30:00','10:30:00'),
(57,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(58,1,'activity','Tham quan Biển Sầm Sơn','Điểm chính của tour: Biển Sầm Sơn','Biển Sầm Sơn','08:30:00','10:30:00'),
(58,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(59,1,'activity','Tham quan Pù Luông','Điểm chính của tour: Pù Luông','Pù Luông','08:30:00','10:30:00'),
(59,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(60,1,'activity','Tham quan Pù Luông','Điểm chính của tour: Pù Luông','Pù Luông','08:30:00','10:30:00'),
(60,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(61,1,'activity','Tham quan Biển Cửa Lò','Điểm chính của tour: Biển Cửa Lò','Biển Cửa Lò','08:30:00','10:30:00'),
(61,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(62,1,'activity','Tham quan Làng Sen quê Bác','Điểm chính của tour: Làng Sen quê Bác','Làng Sen quê Bác','08:30:00','10:30:00'),
(62,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(63,1,'activity','Tham quan Làng Sen quê Bác','Điểm chính của tour: Làng Sen quê Bác','Làng Sen quê Bác','08:30:00','10:30:00'),
(63,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(64,1,'activity','Tham quan Biển Thiên Cầm','Điểm chính của tour: Biển Thiên Cầm','Biển Thiên Cầm','08:30:00','10:30:00'),
(64,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(65,1,'activity','Tham quan Chùa Hương Tích','Điểm chính của tour: Chùa Hương Tích','Chùa Hương Tích','08:30:00','10:30:00'),
(65,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(66,1,'activity','Tham quan Chùa Hương Tích','Điểm chính của tour: Chùa Hương Tích','Chùa Hương Tích','08:30:00','10:30:00'),
(66,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(67,1,'activity','Tham quan Thành cổ Quảng Trị','Điểm chính của tour: Thành cổ Quảng Trị','Thành cổ Quảng Trị','08:30:00','10:30:00'),
(67,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(68,1,'activity','Tham quan Địa đạo Vịnh Mốc','Điểm chính của tour: Địa đạo Vịnh Mốc','Địa đạo Vịnh Mốc','08:30:00','10:30:00'),
(68,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(69,1,'activity','Tham quan Địa đạo Vịnh Mốc','Điểm chính của tour: Địa đạo Vịnh Mốc','Địa đạo Vịnh Mốc','08:30:00','10:30:00'),
(69,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(70,1,'activity','Tham quan Đảo Lý Sơn','Điểm chính của tour: Đảo Lý Sơn','Đảo Lý Sơn','08:30:00','10:30:00'),
(70,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(71,1,'activity','Tham quan Biển Mỹ Khê Quảng Ngãi','Điểm chính của tour: Biển Mỹ Khê Quảng Ngãi','Biển Mỹ Khê Quảng Ngãi','08:30:00','10:30:00'),
(71,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(72,1,'activity','Tham quan Biển Mỹ Khê Quảng Ngãi','Điểm chính của tour: Biển Mỹ Khê Quảng Ngãi','Biển Mỹ Khê Quảng Ngãi','08:30:00','10:30:00'),
(72,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(73,1,'activity','Tham quan Biển Hồ Pleiku','Điểm chính của tour: Biển Hồ Pleiku','Biển Hồ Pleiku','08:30:00','10:30:00'),
(73,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(74,1,'activity','Tham quan Ghềnh Ráng Tiên Sa','Điểm chính của tour: Ghềnh Ráng Tiên Sa','Ghềnh Ráng Tiên Sa','08:30:00','10:30:00'),
(74,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(75,1,'activity','Tham quan Ghềnh Ráng Tiên Sa','Điểm chính của tour: Ghềnh Ráng Tiên Sa','Ghềnh Ráng Tiên Sa','08:30:00','10:30:00'),
(75,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(76,1,'activity','Tham quan Buôn Ma Thuột','Điểm chính của tour: Buôn Ma Thuột','Buôn Ma Thuột','08:30:00','10:30:00'),
(76,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(77,1,'activity','Tham quan Buôn Đôn','Điểm chính của tour: Buôn Đôn','Buôn Đôn','08:30:00','10:30:00'),
(77,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(78,1,'activity','Tham quan Buôn Đôn','Điểm chính của tour: Buôn Đôn','Buôn Đôn','08:30:00','10:30:00'),
(78,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(79,1,'activity','Tham quan Nha Trang','Điểm chính của tour: Nha Trang','Nha Trang','08:30:00','10:30:00'),
(79,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(80,1,'activity','Tham quan VinWonders Nha Trang','Điểm chính của tour: VinWonders Nha Trang','VinWonders Nha Trang','08:30:00','10:30:00'),
(80,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(81,1,'activity','Tham quan VinWonders Nha Trang','Điểm chính của tour: VinWonders Nha Trang','VinWonders Nha Trang','08:30:00','10:30:00'),
(81,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(82,1,'activity','Tham quan Đà Lạt','Điểm chính của tour: Đà Lạt','Đà Lạt','08:30:00','10:30:00'),
(82,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(83,1,'activity','Tham quan Hồ Xuân Hương','Điểm chính của tour: Hồ Xuân Hương','Hồ Xuân Hương','08:30:00','10:30:00'),
(83,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(84,1,'activity','Tham quan Hồ Xuân Hương','Điểm chính của tour: Hồ Xuân Hương','Hồ Xuân Hương','08:30:00','10:30:00'),
(84,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(85,1,'activity','Tham quan Hồ Trị An','Điểm chính của tour: Hồ Trị An','Hồ Trị An','08:30:00','10:30:00'),
(85,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(86,1,'activity','Tham quan Vườn quốc gia Nam Cát Tiên','Điểm chính của tour: Vườn quốc gia Nam Cát Tiên','Vườn quốc gia Nam Cát Tiên','08:30:00','10:30:00'),
(86,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(87,1,'activity','Tham quan Vườn quốc gia Nam Cát Tiên','Điểm chính của tour: Vườn quốc gia Nam Cát Tiên','Vườn quốc gia Nam Cát Tiên','08:30:00','10:30:00'),
(87,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(88,1,'activity','Tham quan Núi Bà Đen','Điểm chính của tour: Núi Bà Đen','Núi Bà Đen','08:30:00','10:30:00'),
(88,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(89,1,'activity','Tham quan Tòa Thánh Cao Đài','Điểm chính của tour: Tòa Thánh Cao Đài','Tòa Thánh Cao Đài','08:30:00','10:30:00'),
(89,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(90,1,'activity','Tham quan Tòa Thánh Cao Đài','Điểm chính của tour: Tòa Thánh Cao Đài','Tòa Thánh Cao Đài','08:30:00','10:30:00'),
(90,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(91,1,'activity','Tham quan Vườn quốc gia Tràm Chim','Điểm chính của tour: Vườn quốc gia Tràm Chim','Vườn quốc gia Tràm Chim','08:30:00','10:30:00'),
(91,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(92,1,'activity','Tham quan Làng hoa Sa Đéc','Điểm chính của tour: Làng hoa Sa Đéc','Làng hoa Sa Đéc','08:30:00','10:30:00'),
(92,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(93,1,'activity','Tham quan Làng hoa Sa Đéc','Điểm chính của tour: Làng hoa Sa Đéc','Làng hoa Sa Đéc','08:30:00','10:30:00'),
(93,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(94,1,'activity','Tham quan Rừng tràm Trà Sư','Điểm chính của tour: Rừng tràm Trà Sư','Rừng tràm Trà Sư','08:30:00','10:30:00'),
(94,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(95,1,'activity','Tham quan Miếu Bà Chúa Xứ Núi Sam','Điểm chính của tour: Miếu Bà Chúa Xứ Núi Sam','Miếu Bà Chúa Xứ Núi Sam','08:30:00','10:30:00'),
(95,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(96,1,'activity','Tham quan Miếu Bà Chúa Xứ Núi Sam','Điểm chính của tour: Miếu Bà Chúa Xứ Núi Sam','Miếu Bà Chúa Xứ Núi Sam','08:30:00','10:30:00'),
(96,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(97,1,'activity','Tham quan Cù lao An Bình','Điểm chính của tour: Cù lao An Bình','Cù lao An Bình','08:30:00','10:30:00'),
(97,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(98,1,'activity','Tham quan Văn Thánh Miếu Vĩnh Long','Điểm chính của tour: Văn Thánh Miếu Vĩnh Long','Văn Thánh Miếu Vĩnh Long','08:30:00','10:30:00'),
(98,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(99,1,'activity','Tham quan Văn Thánh Miếu Vĩnh Long','Điểm chính của tour: Văn Thánh Miếu Vĩnh Long','Văn Thánh Miếu Vĩnh Long','08:30:00','10:30:00'),
(99,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(100,1,'activity','Tham quan Mũi Cà Mau','Điểm chính của tour: Mũi Cà Mau','Mũi Cà Mau','08:30:00','10:30:00'),
(100,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(101,1,'activity','Tham quan Rừng U Minh Hạ','Điểm chính của tour: Rừng U Minh Hạ','Rừng U Minh Hạ','08:30:00','10:30:00'),
(101,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(102,1,'activity','Tham quan Rừng U Minh Hạ','Điểm chính của tour: Rừng U Minh Hạ','Rừng U Minh Hạ','08:30:00','10:30:00'),
(102,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(103,1,'activity','Tham quan Vịnh Hạ Long','Điểm chính của tour: Vịnh Hạ Long','Vịnh Hạ Long','08:30:00','10:30:00'),
(103,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(104,1,'activity','Tham quan Vịnh Hạ Long','Điểm chính của tour: Vịnh Hạ Long','Vịnh Hạ Long','08:30:00','10:30:00'),
(104,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(105,1,'activity','Tham quan Vịnh Hạ Long','Điểm chính của tour: Vịnh Hạ Long','Vịnh Hạ Long','08:30:00','10:30:00'),
(105,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(106,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(106,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(107,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(107,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(108,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(108,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(109,1,'activity','Tham quan Tràng An','Điểm chính của tour: Tràng An','Tràng An','08:30:00','10:30:00'),
(109,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(110,1,'activity','Tham quan Tràng An','Điểm chính của tour: Tràng An','Tràng An','08:30:00','10:30:00'),
(110,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(111,1,'activity','Tham quan Tràng An','Điểm chính của tour: Tràng An','Tràng An','08:30:00','10:30:00'),
(111,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(112,1,'activity','Tham quan Đà Lạt','Điểm chính của tour: Đà Lạt','Đà Lạt','08:30:00','10:30:00'),
(112,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(113,1,'activity','Tham quan Đà Lạt','Điểm chính của tour: Đà Lạt','Đà Lạt','08:30:00','10:30:00'),
(113,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(114,1,'activity','Tham quan Đà Lạt','Điểm chính của tour: Đà Lạt','Đà Lạt','08:30:00','10:30:00'),
(114,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(115,1,'activity','Tham quan Phú Quốc','Điểm chính của tour: Phú Quốc','Phú Quốc','08:30:00','10:30:00'),
(115,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(116,1,'activity','Tham quan Phú Quốc','Điểm chính của tour: Phú Quốc','Phú Quốc','08:30:00','10:30:00'),
(116,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(117,1,'activity','Tham quan Phú Quốc','Điểm chính của tour: Phú Quốc','Phú Quốc','08:30:00','10:30:00'),
(117,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(118,1,'activity','Tham quan Bà Nà Hills','Điểm chính của tour: Bà Nà Hills','Bà Nà Hills','08:30:00','10:30:00'),
(118,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(119,1,'activity','Tham quan Bà Nà Hills','Điểm chính của tour: Bà Nà Hills','Bà Nà Hills','08:30:00','10:30:00'),
(119,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(120,1,'activity','Tham quan Bà Nà Hills','Điểm chính của tour: Bà Nà Hills','Bà Nà Hills','08:30:00','10:30:00'),
(120,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(121,1,'activity','Tham quan Mũi Né','Điểm chính của tour: Mũi Né','Mũi Né','08:30:00','10:30:00'),
(121,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(122,1,'activity','Tham quan Mũi Né','Điểm chính của tour: Mũi Né','Mũi Né','08:30:00','10:30:00'),
(122,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(123,1,'activity','Tham quan Mũi Né','Điểm chính của tour: Mũi Né','Mũi Né','08:30:00','10:30:00'),
(123,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(124,1,'activity','Tham quan Côn Đảo','Điểm chính của tour: Côn Đảo','Côn Đảo','08:30:00','10:30:00'),
(124,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(125,1,'activity','Tham quan Côn Đảo','Điểm chính của tour: Côn Đảo','Côn Đảo','08:30:00','10:30:00'),
(125,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(126,1,'activity','Tham quan Côn Đảo','Điểm chính của tour: Côn Đảo','Côn Đảo','08:30:00','10:30:00'),
(126,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(127,1,'activity','Tham quan Rừng tràm Trà Sư','Điểm chính của tour: Rừng tràm Trà Sư','Rừng tràm Trà Sư','08:30:00','10:30:00'),
(127,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(128,1,'activity','Tham quan Rừng tràm Trà Sư','Điểm chính của tour: Rừng tràm Trà Sư','Rừng tràm Trà Sư','08:30:00','10:30:00'),
(128,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(129,1,'activity','Tham quan Rừng tràm Trà Sư','Điểm chính của tour: Rừng tràm Trà Sư','Rừng tràm Trà Sư','08:30:00','10:30:00'),
(129,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(130,1,'activity','Tham quan Mộc Châu','Điểm chính của tour: Mộc Châu','Mộc Châu','08:30:00','10:30:00'),
(130,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(131,1,'activity','Tham quan Mộc Châu','Điểm chính của tour: Mộc Châu','Mộc Châu','08:30:00','10:30:00'),
(131,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(132,1,'activity','Tham quan Mộc Châu','Điểm chính của tour: Mộc Châu','Mộc Châu','08:30:00','10:30:00'),
(132,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(133,1,'activity','Tham quan Cao nguyên đá Đồng Văn','Điểm chính của tour: Cao nguyên đá Đồng Văn','Cao nguyên đá Đồng Văn','08:30:00','10:30:00'),
(133,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(134,1,'activity','Tham quan Cao nguyên đá Đồng Văn','Điểm chính của tour: Cao nguyên đá Đồng Văn','Cao nguyên đá Đồng Văn','08:30:00','10:30:00'),
(134,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(135,1,'activity','Tham quan Cao nguyên đá Đồng Văn','Điểm chính của tour: Cao nguyên đá Đồng Văn','Cao nguyên đá Đồng Văn','08:30:00','10:30:00'),
(135,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(136,1,'activity','Tham quan Nha Trang','Điểm chính của tour: Nha Trang','Nha Trang','08:30:00','10:30:00'),
(136,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(137,1,'activity','Tham quan Nha Trang','Điểm chính của tour: Nha Trang','Nha Trang','08:30:00','10:30:00'),
(137,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(138,1,'activity','Tham quan Nha Trang','Điểm chính của tour: Nha Trang','Nha Trang','08:30:00','10:30:00'),
(138,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(139,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(139,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(140,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(140,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(141,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(141,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(142,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(142,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(143,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(143,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(144,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(144,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(145,1,'activity','Tham quan Bà Nà Hills','Điểm chính của tour: Bà Nà Hills','Bà Nà Hills','08:30:00','10:30:00'),
(145,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(146,1,'activity','Tham quan Bà Nà Hills','Điểm chính của tour: Bà Nà Hills','Bà Nà Hills','08:30:00','10:30:00'),
(146,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(147,1,'activity','Tham quan Bà Nà Hills','Điểm chính của tour: Bà Nà Hills','Bà Nà Hills','08:30:00','10:30:00'),
(147,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(148,1,'activity','Tham quan Bà Nà Hills','Điểm chính của tour: Bà Nà Hills','Bà Nà Hills','08:30:00','10:30:00'),
(148,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(149,1,'activity','Tham quan Bà Nà Hills','Điểm chính của tour: Bà Nà Hills','Bà Nà Hills','08:30:00','10:30:00'),
(149,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(150,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(150,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(151,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(151,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(152,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(152,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(153,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(153,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(154,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(154,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(155,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(155,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(156,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(156,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(157,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(157,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(158,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(158,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(159,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(159,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(160,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(160,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(161,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(161,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(162,1,'activity','Tham quan Sa Pa','Điểm chính của tour: Sa Pa','Sa Pa','08:30:00','10:30:00'),
(162,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(163,1,'activity','Tham quan Vịnh Hạ Long','Điểm chính của tour: Vịnh Hạ Long','Vịnh Hạ Long','08:30:00','10:30:00'),
(163,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(164,1,'activity','Tham quan Vịnh Hạ Long','Điểm chính của tour: Vịnh Hạ Long','Vịnh Hạ Long','08:30:00','10:30:00'),
(164,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(165,1,'activity','Tham quan Vịnh Hạ Long','Điểm chính của tour: Vịnh Hạ Long','Vịnh Hạ Long','08:30:00','10:30:00'),
(165,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(166,1,'activity','Tham quan Vịnh Hạ Long','Điểm chính của tour: Vịnh Hạ Long','Vịnh Hạ Long','08:30:00','10:30:00'),
(166,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(167,1,'activity','Tham quan Vịnh Hạ Long','Điểm chính của tour: Vịnh Hạ Long','Vịnh Hạ Long','08:30:00','10:30:00'),
(167,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(168,1,'activity','Tham quan Đà Lạt','Điểm chính của tour: Đà Lạt','Đà Lạt','08:30:00','10:30:00'),
(168,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(169,1,'activity','Tham quan Đà Lạt','Điểm chính của tour: Đà Lạt','Đà Lạt','08:30:00','10:30:00'),
(169,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(170,1,'activity','Tham quan Đà Lạt','Điểm chính của tour: Đà Lạt','Đà Lạt','08:30:00','10:30:00'),
(170,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(171,1,'activity','Tham quan Đà Lạt','Điểm chính của tour: Đà Lạt','Đà Lạt','08:30:00','10:30:00'),
(171,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(172,1,'activity','Tham quan Đà Lạt','Điểm chính của tour: Đà Lạt','Đà Lạt','08:30:00','10:30:00'),
(172,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(173,1,'activity','Tham quan Mũi Cà Mau','Điểm chính của tour: Mũi Cà Mau','Mũi Cà Mau','08:30:00','10:30:00'),
(173,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(174,1,'activity','Tham quan Mũi Cà Mau','Điểm chính của tour: Mũi Cà Mau','Mũi Cà Mau','08:30:00','10:30:00'),
(174,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(175,1,'activity','Tham quan Mũi Cà Mau','Điểm chính của tour: Mũi Cà Mau','Mũi Cà Mau','08:30:00','10:30:00'),
(175,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(176,1,'activity','Tham quan Mũi Cà Mau','Điểm chính của tour: Mũi Cà Mau','Mũi Cà Mau','08:30:00','10:30:00'),
(176,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(177,1,'activity','Tham quan Mũi Cà Mau','Điểm chính của tour: Mũi Cà Mau','Mũi Cà Mau','08:30:00','10:30:00'),
(177,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(178,1,'activity','Tham quan Đại Nội Huế','Điểm chính của tour: Đại Nội Huế','Đại Nội Huế','08:30:00','10:30:00'),
(178,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(179,1,'activity','Tham quan Đại Nội Huế','Điểm chính của tour: Đại Nội Huế','Đại Nội Huế','08:30:00','10:30:00'),
(179,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(180,1,'activity','Tham quan Đại Nội Huế','Điểm chính của tour: Đại Nội Huế','Đại Nội Huế','08:30:00','10:30:00'),
(180,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(181,1,'activity','Tham quan Đại Nội Huế','Điểm chính của tour: Đại Nội Huế','Đại Nội Huế','08:30:00','10:30:00'),
(181,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(182,1,'activity','Tham quan Đại Nội Huế','Điểm chính của tour: Đại Nội Huế','Đại Nội Huế','08:30:00','10:30:00'),
(182,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(183,1,'activity','Tham quan Đại Nội Huế','Điểm chính của tour: Đại Nội Huế','Đại Nội Huế','08:30:00','10:30:00'),
(183,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(184,1,'activity','Tham quan Hồ Hoàn Kiếm','Điểm chính của tour: Hồ Hoàn Kiếm','Hồ Hoàn Kiếm','08:30:00','10:30:00'),
(184,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(185,1,'activity','Tham quan Hồ Hoàn Kiếm','Điểm chính của tour: Hồ Hoàn Kiếm','Hồ Hoàn Kiếm','08:30:00','10:30:00'),
(185,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(186,1,'activity','Tham quan Hồ Hoàn Kiếm','Điểm chính của tour: Hồ Hoàn Kiếm','Hồ Hoàn Kiếm','08:30:00','10:30:00'),
(186,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(187,1,'activity','Tham quan Hồ Hoàn Kiếm','Điểm chính của tour: Hồ Hoàn Kiếm','Hồ Hoàn Kiếm','08:30:00','10:30:00'),
(187,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(188,1,'activity','Tham quan Hồ Hoàn Kiếm','Điểm chính của tour: Hồ Hoàn Kiếm','Hồ Hoàn Kiếm','08:30:00','10:30:00'),
(188,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(189,1,'activity','Tham quan Hồ Hoàn Kiếm','Điểm chính của tour: Hồ Hoàn Kiếm','Hồ Hoàn Kiếm','08:30:00','10:30:00'),
(189,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(190,1,'activity','Tham quan Hồ Hoàn Kiếm','Điểm chính của tour: Hồ Hoàn Kiếm','Hồ Hoàn Kiếm','08:30:00','10:30:00'),
(190,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(191,1,'activity','Tham quan Hồ Hoàn Kiếm','Điểm chính của tour: Hồ Hoàn Kiếm','Hồ Hoàn Kiếm','08:30:00','10:30:00'),
(191,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(192,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(192,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(193,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(193,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(194,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(194,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(195,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(195,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(196,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(196,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(197,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(197,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(198,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(198,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(199,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(199,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(200,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(200,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(201,1,'activity','Tham quan Chợ nổi Cái Răng','Điểm chính của tour: Chợ nổi Cái Răng','Chợ nổi Cái Răng','08:30:00','10:30:00'),
(201,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(202,1,'activity','Tham quan Seoul','Điểm chính của tour: Seoul','Seoul','08:30:00','10:30:00'),
(202,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(203,1,'activity','Tham quan Seoul','Điểm chính của tour: Seoul','Seoul','08:30:00','10:30:00'),
(203,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(204,1,'activity','Tham quan Seoul','Điểm chính của tour: Seoul','Seoul','08:30:00','10:30:00'),
(204,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(205,1,'activity','Tham quan Seoul','Điểm chính của tour: Seoul','Seoul','08:30:00','10:30:00'),
(205,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(206,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(206,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(207,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(207,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(208,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(208,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(209,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(209,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(210,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(210,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(211,1,'activity','Tham quan Tokyo','Điểm chính của tour: Tokyo','Tokyo','08:30:00','10:30:00'),
(211,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(212,1,'activity','Tham quan Tokyo','Điểm chính của tour: Tokyo','Tokyo','08:30:00','10:30:00'),
(212,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(213,1,'activity','Tham quan Tokyo','Điểm chính của tour: Tokyo','Tokyo','08:30:00','10:30:00'),
(213,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(214,1,'activity','Tham quan Tokyo','Điểm chính của tour: Tokyo','Tokyo','08:30:00','10:30:00'),
(214,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(215,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(215,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(216,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(216,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(217,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(217,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(218,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(218,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(219,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(219,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(220,1,'activity','Tham quan Bangkok','Điểm chính của tour: Bangkok','Bangkok','08:30:00','10:30:00'),
(220,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(221,1,'activity','Tham quan Bangkok','Điểm chính của tour: Bangkok','Bangkok','08:30:00','10:30:00'),
(221,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(222,1,'activity','Tham quan Bangkok','Điểm chính của tour: Bangkok','Bangkok','08:30:00','10:30:00'),
(222,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(223,1,'activity','Tham quan Bangkok','Điểm chính của tour: Bangkok','Bangkok','08:30:00','10:30:00'),
(223,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(224,1,'activity','Tham quan Phuket','Điểm chính của tour: Phuket','Phuket','08:30:00','10:30:00'),
(224,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(225,1,'activity','Tham quan Phuket','Điểm chính của tour: Phuket','Phuket','08:30:00','10:30:00'),
(225,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(226,1,'activity','Tham quan Phuket','Điểm chính của tour: Phuket','Phuket','08:30:00','10:30:00'),
(226,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(227,1,'activity','Tham quan Phuket','Điểm chính của tour: Phuket','Phuket','08:30:00','10:30:00'),
(227,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(228,1,'activity','Tham quan Phuket','Điểm chính của tour: Phuket','Phuket','08:30:00','10:30:00'),
(228,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(229,1,'activity','Tham quan Marina Bay Sands','Điểm chính của tour: Marina Bay Sands','Marina Bay Sands','08:30:00','10:30:00'),
(229,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(230,1,'activity','Tham quan Marina Bay Sands','Điểm chính của tour: Marina Bay Sands','Marina Bay Sands','08:30:00','10:30:00'),
(230,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(231,1,'activity','Tham quan Marina Bay Sands','Điểm chính của tour: Marina Bay Sands','Marina Bay Sands','08:30:00','10:30:00'),
(231,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(232,1,'activity','Tham quan Marina Bay Sands','Điểm chính của tour: Marina Bay Sands','Marina Bay Sands','08:30:00','10:30:00'),
(232,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(233,1,'activity','Tham quan Kuala Lumpur','Điểm chính của tour: Kuala Lumpur','Kuala Lumpur','08:30:00','10:30:00'),
(233,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(234,1,'activity','Tham quan Kuala Lumpur','Điểm chính của tour: Kuala Lumpur','Kuala Lumpur','08:30:00','10:30:00'),
(234,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(235,1,'activity','Tham quan Kuala Lumpur','Điểm chính của tour: Kuala Lumpur','Kuala Lumpur','08:30:00','10:30:00'),
(235,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(236,1,'activity','Tham quan Kuala Lumpur','Điểm chính của tour: Kuala Lumpur','Kuala Lumpur','08:30:00','10:30:00'),
(236,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(237,1,'activity','Tham quan Bali','Điểm chính của tour: Bali','Bali','08:30:00','10:30:00'),
(237,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(238,1,'activity','Tham quan Bali','Điểm chính của tour: Bali','Bali','08:30:00','10:30:00'),
(238,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(239,1,'activity','Tham quan Bali','Điểm chính của tour: Bali','Bali','08:30:00','10:30:00'),
(239,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(240,1,'activity','Tham quan Bali','Điểm chính của tour: Bali','Bali','08:30:00','10:30:00'),
(240,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(241,1,'activity','Tham quan Beijing','Điểm chính của tour: Beijing','Beijing','08:30:00','10:30:00'),
(241,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(242,1,'activity','Tham quan Beijing','Điểm chính của tour: Beijing','Beijing','08:30:00','10:30:00'),
(242,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(243,1,'activity','Tham quan Beijing','Điểm chính của tour: Beijing','Beijing','08:30:00','10:30:00'),
(243,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(244,1,'activity','Tham quan Beijing','Điểm chính của tour: Beijing','Beijing','08:30:00','10:30:00'),
(244,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(245,1,'activity','Tham quan Shanghai','Điểm chính của tour: Shanghai','Shanghai','08:30:00','10:30:00'),
(245,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(246,1,'activity','Tham quan Shanghai','Điểm chính của tour: Shanghai','Shanghai','08:30:00','10:30:00'),
(246,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(247,1,'activity','Tham quan Shanghai','Điểm chính của tour: Shanghai','Shanghai','08:30:00','10:30:00'),
(247,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(248,1,'activity','Tham quan Shanghai','Điểm chính của tour: Shanghai','Shanghai','08:30:00','10:30:00'),
(248,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(249,1,'activity','Tham quan Shanghai','Điểm chính của tour: Shanghai','Shanghai','08:30:00','10:30:00'),
(249,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(250,1,'activity','Tham quan Taipei','Điểm chính của tour: Taipei','Taipei','08:30:00','10:30:00'),
(250,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(251,1,'activity','Tham quan Taipei','Điểm chính của tour: Taipei','Taipei','08:30:00','10:30:00'),
(251,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(252,1,'activity','Tham quan Taipei','Điểm chính của tour: Taipei','Taipei','08:30:00','10:30:00'),
(252,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(253,1,'activity','Tham quan Taipei','Điểm chính của tour: Taipei','Taipei','08:30:00','10:30:00'),
(253,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(254,1,'activity','Tham quan Victoria Peak','Điểm chính của tour: Victoria Peak','Victoria Peak','08:30:00','10:30:00'),
(254,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(255,1,'activity','Tham quan Victoria Peak','Điểm chính của tour: Victoria Peak','Victoria Peak','08:30:00','10:30:00'),
(255,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(256,1,'activity','Tham quan Victoria Peak','Điểm chính của tour: Victoria Peak','Victoria Peak','08:30:00','10:30:00'),
(256,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(257,1,'activity','Tham quan Victoria Peak','Điểm chính của tour: Victoria Peak','Victoria Peak','08:30:00','10:30:00'),
(257,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(258,1,'activity','Tham quan Siem Reap','Điểm chính của tour: Siem Reap','Siem Reap','08:30:00','10:30:00'),
(258,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(259,1,'activity','Tham quan Siem Reap','Điểm chính của tour: Siem Reap','Siem Reap','08:30:00','10:30:00'),
(259,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(260,1,'activity','Tham quan Siem Reap','Điểm chính của tour: Siem Reap','Siem Reap','08:30:00','10:30:00'),
(260,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(261,1,'activity','Tham quan Siem Reap','Điểm chính của tour: Siem Reap','Siem Reap','08:30:00','10:30:00'),
(261,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(262,1,'activity','Tham quan Luang Prabang','Điểm chính của tour: Luang Prabang','Luang Prabang','08:30:00','10:30:00'),
(262,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(263,1,'activity','Tham quan Luang Prabang','Điểm chính của tour: Luang Prabang','Luang Prabang','08:30:00','10:30:00'),
(263,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(264,1,'activity','Tham quan Luang Prabang','Điểm chính của tour: Luang Prabang','Luang Prabang','08:30:00','10:30:00'),
(264,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(265,1,'activity','Tham quan Luang Prabang','Điểm chính của tour: Luang Prabang','Luang Prabang','08:30:00','10:30:00'),
(265,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(266,1,'activity','Tham quan New Delhi','Điểm chính của tour: New Delhi','New Delhi','08:30:00','10:30:00'),
(266,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(267,1,'activity','Tham quan New Delhi','Điểm chính của tour: New Delhi','New Delhi','08:30:00','10:30:00'),
(267,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(268,1,'activity','Tham quan New Delhi','Điểm chính của tour: New Delhi','New Delhi','08:30:00','10:30:00'),
(268,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(269,1,'activity','Tham quan New Delhi','Điểm chính của tour: New Delhi','New Delhi','08:30:00','10:30:00'),
(269,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(270,1,'activity','Tham quan Agra','Điểm chính của tour: Agra','Agra','08:30:00','10:30:00'),
(270,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(271,1,'activity','Tham quan Agra','Điểm chính của tour: Agra','Agra','08:30:00','10:30:00'),
(271,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(272,1,'activity','Tham quan Agra','Điểm chính của tour: Agra','Agra','08:30:00','10:30:00'),
(272,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(273,1,'activity','Tham quan Agra','Điểm chính của tour: Agra','Agra','08:30:00','10:30:00'),
(273,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(274,1,'activity','Tham quan Agra','Điểm chính của tour: Agra','Agra','08:30:00','10:30:00'),
(274,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(275,1,'activity','Tham quan Male','Điểm chính của tour: Male','Male','08:30:00','10:30:00'),
(275,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(276,1,'activity','Tham quan Male','Điểm chính của tour: Male','Male','08:30:00','10:30:00'),
(276,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(277,1,'activity','Tham quan Male','Điểm chính của tour: Male','Male','08:30:00','10:30:00'),
(277,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(278,1,'activity','Tham quan Male','Điểm chính của tour: Male','Male','08:30:00','10:30:00'),
(278,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(279,1,'activity','Tham quan Dubai','Điểm chính của tour: Dubai','Dubai','08:30:00','10:30:00'),
(279,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(280,1,'activity','Tham quan Dubai','Điểm chính của tour: Dubai','Dubai','08:30:00','10:30:00'),
(280,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(281,1,'activity','Tham quan Dubai','Điểm chính của tour: Dubai','Dubai','08:30:00','10:30:00'),
(281,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(282,1,'activity','Tham quan Dubai','Điểm chính của tour: Dubai','Dubai','08:30:00','10:30:00'),
(282,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(283,1,'activity','Tham quan Istanbul','Điểm chính của tour: Istanbul','Istanbul','08:30:00','10:30:00'),
(283,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(284,1,'activity','Tham quan Istanbul','Điểm chính của tour: Istanbul','Istanbul','08:30:00','10:30:00'),
(284,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(285,1,'activity','Tham quan Istanbul','Điểm chính của tour: Istanbul','Istanbul','08:30:00','10:30:00'),
(285,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(286,1,'activity','Tham quan Istanbul','Điểm chính của tour: Istanbul','Istanbul','08:30:00','10:30:00'),
(286,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(287,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(287,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(288,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(288,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(289,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(289,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(290,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(290,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(291,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(291,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(292,1,'activity','Tham quan Rome','Điểm chính của tour: Rome','Rome','08:30:00','10:30:00'),
(292,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(293,1,'activity','Tham quan Rome','Điểm chính của tour: Rome','Rome','08:30:00','10:30:00'),
(293,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(294,1,'activity','Tham quan Rome','Điểm chính của tour: Rome','Rome','08:30:00','10:30:00'),
(294,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(295,1,'activity','Tham quan Rome','Điểm chính của tour: Rome','Rome','08:30:00','10:30:00'),
(295,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(296,1,'activity','Tham quan Rome','Điểm chính của tour: Rome','Rome','08:30:00','10:30:00'),
(296,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(297,1,'activity','Tham quan Venice','Điểm chính của tour: Venice','Venice','08:30:00','10:30:00'),
(297,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(298,1,'activity','Tham quan Venice','Điểm chính của tour: Venice','Venice','08:30:00','10:30:00'),
(298,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(299,1,'activity','Tham quan Venice','Điểm chính của tour: Venice','Venice','08:30:00','10:30:00'),
(299,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(300,1,'activity','Tham quan Venice','Điểm chính của tour: Venice','Venice','08:30:00','10:30:00'),
(300,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(301,1,'activity','Tham quan Venice','Điểm chính của tour: Venice','Venice','08:30:00','10:30:00'),
(301,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(302,1,'activity','Tham quan London','Điểm chính của tour: London','London','08:30:00','10:30:00'),
(302,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(303,1,'activity','Tham quan London','Điểm chính của tour: London','London','08:30:00','10:30:00'),
(303,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(304,1,'activity','Tham quan London','Điểm chính của tour: London','London','08:30:00','10:30:00'),
(304,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(305,1,'activity','Tham quan London','Điểm chính của tour: London','London','08:30:00','10:30:00'),
(305,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(306,1,'activity','Tham quan London','Điểm chính của tour: London','London','08:30:00','10:30:00'),
(306,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(307,1,'activity','Tham quan Madrid','Điểm chính của tour: Madrid','Madrid','08:30:00','10:30:00'),
(307,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(308,1,'activity','Tham quan Madrid','Điểm chính của tour: Madrid','Madrid','08:30:00','10:30:00'),
(308,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(309,1,'activity','Tham quan Madrid','Điểm chính của tour: Madrid','Madrid','08:30:00','10:30:00'),
(309,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(310,1,'activity','Tham quan Madrid','Điểm chính của tour: Madrid','Madrid','08:30:00','10:30:00'),
(310,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(311,1,'activity','Tham quan Madrid','Điểm chính của tour: Madrid','Madrid','08:30:00','10:30:00'),
(311,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(312,1,'activity','Tham quan Barcelona','Điểm chính của tour: Barcelona','Barcelona','08:30:00','10:30:00'),
(312,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(313,1,'activity','Tham quan Barcelona','Điểm chính của tour: Barcelona','Barcelona','08:30:00','10:30:00'),
(313,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(314,1,'activity','Tham quan Barcelona','Điểm chính của tour: Barcelona','Barcelona','08:30:00','10:30:00'),
(314,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(315,1,'activity','Tham quan Barcelona','Điểm chính của tour: Barcelona','Barcelona','08:30:00','10:30:00'),
(315,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(316,1,'activity','Tham quan Barcelona','Điểm chính của tour: Barcelona','Barcelona','08:30:00','10:30:00'),
(316,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(317,1,'activity','Tham quan Berlin','Điểm chính của tour: Berlin','Berlin','08:30:00','10:30:00'),
(317,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(318,1,'activity','Tham quan Berlin','Điểm chính của tour: Berlin','Berlin','08:30:00','10:30:00'),
(318,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(319,1,'activity','Tham quan Berlin','Điểm chính của tour: Berlin','Berlin','08:30:00','10:30:00'),
(319,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(320,1,'activity','Tham quan Berlin','Điểm chính của tour: Berlin','Berlin','08:30:00','10:30:00'),
(320,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(321,1,'activity','Tham quan Berlin','Điểm chính của tour: Berlin','Berlin','08:30:00','10:30:00'),
(321,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(322,1,'activity','Tham quan Munich','Điểm chính của tour: Munich','Munich','08:30:00','10:30:00'),
(322,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(323,1,'activity','Tham quan Munich','Điểm chính của tour: Munich','Munich','08:30:00','10:30:00'),
(323,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(324,1,'activity','Tham quan Munich','Điểm chính của tour: Munich','Munich','08:30:00','10:30:00'),
(324,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(325,1,'activity','Tham quan Munich','Điểm chính của tour: Munich','Munich','08:30:00','10:30:00'),
(325,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(326,1,'activity','Tham quan Munich','Điểm chính của tour: Munich','Munich','08:30:00','10:30:00'),
(326,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(327,1,'activity','Tham quan Amsterdam','Điểm chính của tour: Amsterdam','Amsterdam','08:30:00','10:30:00'),
(327,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(328,1,'activity','Tham quan Amsterdam','Điểm chính của tour: Amsterdam','Amsterdam','08:30:00','10:30:00'),
(328,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(329,1,'activity','Tham quan Amsterdam','Điểm chính của tour: Amsterdam','Amsterdam','08:30:00','10:30:00'),
(329,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(330,1,'activity','Tham quan Amsterdam','Điểm chính của tour: Amsterdam','Amsterdam','08:30:00','10:30:00'),
(330,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(331,1,'activity','Tham quan Amsterdam','Điểm chính của tour: Amsterdam','Amsterdam','08:30:00','10:30:00'),
(331,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(332,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(332,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(333,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(333,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(334,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(334,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(335,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(335,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(336,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(336,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(337,1,'activity','Tham quan Vienna','Điểm chính của tour: Vienna','Vienna','08:30:00','10:30:00'),
(337,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(338,1,'activity','Tham quan Vienna','Điểm chính của tour: Vienna','Vienna','08:30:00','10:30:00'),
(338,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(339,1,'activity','Tham quan Vienna','Điểm chính của tour: Vienna','Vienna','08:30:00','10:30:00'),
(339,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(340,1,'activity','Tham quan Vienna','Điểm chính của tour: Vienna','Vienna','08:30:00','10:30:00'),
(340,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(341,1,'activity','Tham quan Vienna','Điểm chính của tour: Vienna','Vienna','08:30:00','10:30:00'),
(341,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(342,1,'activity','Tham quan Prague','Điểm chính của tour: Prague','Prague','08:30:00','10:30:00'),
(342,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(343,1,'activity','Tham quan Prague','Điểm chính của tour: Prague','Prague','08:30:00','10:30:00'),
(343,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(344,1,'activity','Tham quan Prague','Điểm chính của tour: Prague','Prague','08:30:00','10:30:00'),
(344,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(345,1,'activity','Tham quan Prague','Điểm chính của tour: Prague','Prague','08:30:00','10:30:00'),
(345,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(346,1,'activity','Tham quan Prague','Điểm chính của tour: Prague','Prague','08:30:00','10:30:00'),
(346,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(347,1,'activity','Tham quan Athens','Điểm chính của tour: Athens','Athens','08:30:00','10:30:00'),
(347,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(348,1,'activity','Tham quan Athens','Điểm chính của tour: Athens','Athens','08:30:00','10:30:00'),
(348,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(349,1,'activity','Tham quan Athens','Điểm chính của tour: Athens','Athens','08:30:00','10:30:00'),
(349,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(350,1,'activity','Tham quan Athens','Điểm chính của tour: Athens','Athens','08:30:00','10:30:00'),
(350,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(351,1,'activity','Tham quan Athens','Điểm chính của tour: Athens','Athens','08:30:00','10:30:00'),
(351,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(352,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(352,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(353,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(353,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(354,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(354,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(355,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(355,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(356,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(356,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(357,1,'activity','Tham quan Helsinki','Điểm chính của tour: Helsinki','Helsinki','08:30:00','10:30:00'),
(357,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(358,1,'activity','Tham quan Helsinki','Điểm chính của tour: Helsinki','Helsinki','08:30:00','10:30:00'),
(358,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(359,1,'activity','Tham quan Helsinki','Điểm chính của tour: Helsinki','Helsinki','08:30:00','10:30:00'),
(359,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(360,1,'activity','Tham quan Helsinki','Điểm chính của tour: Helsinki','Helsinki','08:30:00','10:30:00'),
(360,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(361,1,'activity','Tham quan Helsinki','Điểm chính của tour: Helsinki','Helsinki','08:30:00','10:30:00'),
(361,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(362,1,'activity','Tham quan Oslo','Điểm chính của tour: Oslo','Oslo','08:30:00','10:30:00'),
(362,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(363,1,'activity','Tham quan Oslo','Điểm chính của tour: Oslo','Oslo','08:30:00','10:30:00'),
(363,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(364,1,'activity','Tham quan Oslo','Điểm chính của tour: Oslo','Oslo','08:30:00','10:30:00'),
(364,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(365,1,'activity','Tham quan Oslo','Điểm chính của tour: Oslo','Oslo','08:30:00','10:30:00'),
(365,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(366,1,'activity','Tham quan Oslo','Điểm chính của tour: Oslo','Oslo','08:30:00','10:30:00'),
(366,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(367,1,'activity','Tham quan Copenhagen','Điểm chính của tour: Copenhagen','Copenhagen','08:30:00','10:30:00'),
(367,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(368,1,'activity','Tham quan Copenhagen','Điểm chính của tour: Copenhagen','Copenhagen','08:30:00','10:30:00'),
(368,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(369,1,'activity','Tham quan Copenhagen','Điểm chính của tour: Copenhagen','Copenhagen','08:30:00','10:30:00'),
(369,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(370,1,'activity','Tham quan Copenhagen','Điểm chính của tour: Copenhagen','Copenhagen','08:30:00','10:30:00'),
(370,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(371,1,'activity','Tham quan Copenhagen','Điểm chính của tour: Copenhagen','Copenhagen','08:30:00','10:30:00'),
(371,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(372,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(372,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(373,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(373,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(374,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(374,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(375,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(375,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(376,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(376,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(377,1,'activity','Tham quan Cairo','Điểm chính của tour: Cairo','Cairo','08:30:00','10:30:00'),
(377,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(378,1,'activity','Tham quan Cairo','Điểm chính của tour: Cairo','Cairo','08:30:00','10:30:00'),
(378,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(379,1,'activity','Tham quan Cairo','Điểm chính của tour: Cairo','Cairo','08:30:00','10:30:00'),
(379,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(380,1,'activity','Tham quan Cairo','Điểm chính của tour: Cairo','Cairo','08:30:00','10:30:00'),
(380,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(381,1,'activity','Tham quan Cairo','Điểm chính của tour: Cairo','Cairo','08:30:00','10:30:00'),
(381,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(382,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(382,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(383,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(383,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(384,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(384,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(385,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(385,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(386,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(386,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(387,1,'activity','Tham quan Marrakech','Điểm chính của tour: Marrakech','Marrakech','08:30:00','10:30:00'),
(387,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(388,1,'activity','Tham quan Marrakech','Điểm chính của tour: Marrakech','Marrakech','08:30:00','10:30:00'),
(388,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(389,1,'activity','Tham quan Marrakech','Điểm chính của tour: Marrakech','Marrakech','08:30:00','10:30:00'),
(389,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(390,1,'activity','Tham quan Marrakech','Điểm chính của tour: Marrakech','Marrakech','08:30:00','10:30:00'),
(390,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(391,1,'activity','Tham quan Marrakech','Điểm chính của tour: Marrakech','Marrakech','08:30:00','10:30:00'),
(391,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(392,1,'activity','Tham quan Nairobi','Điểm chính của tour: Nairobi','Nairobi','08:30:00','10:30:00'),
(392,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(393,1,'activity','Tham quan Nairobi','Điểm chính của tour: Nairobi','Nairobi','08:30:00','10:30:00'),
(393,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(394,1,'activity','Tham quan Nairobi','Điểm chính của tour: Nairobi','Nairobi','08:30:00','10:30:00'),
(394,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(395,1,'activity','Tham quan Nairobi','Điểm chính của tour: Nairobi','Nairobi','08:30:00','10:30:00'),
(395,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(396,1,'activity','Tham quan Nairobi','Điểm chính của tour: Nairobi','Nairobi','08:30:00','10:30:00'),
(396,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(397,1,'activity','Tham quan Serengeti','Điểm chính của tour: Serengeti','Serengeti','08:30:00','10:30:00'),
(397,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(398,1,'activity','Tham quan Serengeti','Điểm chính của tour: Serengeti','Serengeti','08:30:00','10:30:00'),
(398,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(399,1,'activity','Tham quan Serengeti','Điểm chính của tour: Serengeti','Serengeti','08:30:00','10:30:00'),
(399,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(400,1,'activity','Tham quan Serengeti','Điểm chính của tour: Serengeti','Serengeti','08:30:00','10:30:00'),
(400,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(401,1,'activity','Tham quan Serengeti','Điểm chính của tour: Serengeti','Serengeti','08:30:00','10:30:00'),
(401,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(402,1,'activity','Tham quan New York','Điểm chính của tour: New York','New York','08:30:00','10:30:00'),
(402,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(403,1,'activity','Tham quan New York','Điểm chính của tour: New York','New York','08:30:00','10:30:00'),
(403,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(404,1,'activity','Tham quan New York','Điểm chính của tour: New York','New York','08:30:00','10:30:00'),
(404,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(405,1,'activity','Tham quan New York','Điểm chính của tour: New York','New York','08:30:00','10:30:00'),
(405,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(406,1,'activity','Tham quan New York','Điểm chính của tour: New York','New York','08:30:00','10:30:00'),
(406,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(407,1,'activity','Tham quan Los Angeles','Điểm chính của tour: Los Angeles','Los Angeles','08:30:00','10:30:00'),
(407,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(408,1,'activity','Tham quan Los Angeles','Điểm chính của tour: Los Angeles','Los Angeles','08:30:00','10:30:00'),
(408,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(409,1,'activity','Tham quan Los Angeles','Điểm chính của tour: Los Angeles','Los Angeles','08:30:00','10:30:00'),
(409,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(410,1,'activity','Tham quan Los Angeles','Điểm chính của tour: Los Angeles','Los Angeles','08:30:00','10:30:00'),
(410,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(411,1,'activity','Tham quan Los Angeles','Điểm chính của tour: Los Angeles','Los Angeles','08:30:00','10:30:00'),
(411,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(412,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(412,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(413,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(413,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(414,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(414,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(415,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(415,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(416,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(416,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(417,1,'activity','Tham quan Vancouver','Điểm chính của tour: Vancouver','Vancouver','08:30:00','10:30:00'),
(417,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(418,1,'activity','Tham quan Vancouver','Điểm chính của tour: Vancouver','Vancouver','08:30:00','10:30:00'),
(418,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(419,1,'activity','Tham quan Vancouver','Điểm chính của tour: Vancouver','Vancouver','08:30:00','10:30:00'),
(419,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(420,1,'activity','Tham quan Vancouver','Điểm chính của tour: Vancouver','Vancouver','08:30:00','10:30:00'),
(420,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(421,1,'activity','Tham quan Vancouver','Điểm chính của tour: Vancouver','Vancouver','08:30:00','10:30:00'),
(421,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(422,1,'activity','Tham quan Mexico City','Điểm chính của tour: Mexico City','Mexico City','08:30:00','10:30:00'),
(422,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(423,1,'activity','Tham quan Mexico City','Điểm chính của tour: Mexico City','Mexico City','08:30:00','10:30:00'),
(423,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(424,1,'activity','Tham quan Mexico City','Điểm chính của tour: Mexico City','Mexico City','08:30:00','10:30:00'),
(424,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(425,1,'activity','Tham quan Mexico City','Điểm chính của tour: Mexico City','Mexico City','08:30:00','10:30:00'),
(425,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(426,1,'activity','Tham quan Mexico City','Điểm chính của tour: Mexico City','Mexico City','08:30:00','10:30:00'),
(426,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(427,1,'activity','Tham quan Rio de Janeiro','Điểm chính của tour: Rio de Janeiro','Rio de Janeiro','08:30:00','10:30:00'),
(427,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(428,1,'activity','Tham quan Rio de Janeiro','Điểm chính của tour: Rio de Janeiro','Rio de Janeiro','08:30:00','10:30:00'),
(428,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(429,1,'activity','Tham quan Rio de Janeiro','Điểm chính của tour: Rio de Janeiro','Rio de Janeiro','08:30:00','10:30:00'),
(429,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(430,1,'activity','Tham quan Rio de Janeiro','Điểm chính của tour: Rio de Janeiro','Rio de Janeiro','08:30:00','10:30:00'),
(430,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(431,1,'activity','Tham quan Rio de Janeiro','Điểm chính của tour: Rio de Janeiro','Rio de Janeiro','08:30:00','10:30:00'),
(431,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(432,1,'activity','Tham quan Buenos Aires','Điểm chính của tour: Buenos Aires','Buenos Aires','08:30:00','10:30:00'),
(432,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(433,1,'activity','Tham quan Buenos Aires','Điểm chính của tour: Buenos Aires','Buenos Aires','08:30:00','10:30:00'),
(433,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(434,1,'activity','Tham quan Buenos Aires','Điểm chính của tour: Buenos Aires','Buenos Aires','08:30:00','10:30:00'),
(434,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(435,1,'activity','Tham quan Buenos Aires','Điểm chính của tour: Buenos Aires','Buenos Aires','08:30:00','10:30:00'),
(435,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(436,1,'activity','Tham quan Buenos Aires','Điểm chính của tour: Buenos Aires','Buenos Aires','08:30:00','10:30:00'),
(436,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(437,1,'activity','Tham quan Lima','Điểm chính của tour: Lima','Lima','08:30:00','10:30:00'),
(437,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(438,1,'activity','Tham quan Lima','Điểm chính của tour: Lima','Lima','08:30:00','10:30:00'),
(438,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(439,1,'activity','Tham quan Lima','Điểm chính của tour: Lima','Lima','08:30:00','10:30:00'),
(439,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(440,1,'activity','Tham quan Lima','Điểm chính của tour: Lima','Lima','08:30:00','10:30:00'),
(440,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(441,1,'activity','Tham quan Lima','Điểm chính của tour: Lima','Lima','08:30:00','10:30:00'),
(441,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(442,1,'activity','Tham quan Santiago','Điểm chính của tour: Santiago','Santiago','08:30:00','10:30:00'),
(442,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(443,1,'activity','Tham quan Santiago','Điểm chính của tour: Santiago','Santiago','08:30:00','10:30:00'),
(443,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(444,1,'activity','Tham quan Santiago','Điểm chính của tour: Santiago','Santiago','08:30:00','10:30:00'),
(444,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(445,1,'activity','Tham quan Santiago','Điểm chính của tour: Santiago','Santiago','08:30:00','10:30:00'),
(445,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(446,1,'activity','Tham quan Santiago','Điểm chính của tour: Santiago','Santiago','08:30:00','10:30:00'),
(446,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(447,1,'activity','Tham quan Sydney','Điểm chính của tour: Sydney','Sydney','08:30:00','10:30:00'),
(447,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(448,1,'activity','Tham quan Sydney','Điểm chính của tour: Sydney','Sydney','08:30:00','10:30:00'),
(448,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(449,1,'activity','Tham quan Sydney','Điểm chính của tour: Sydney','Sydney','08:30:00','10:30:00'),
(449,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(450,1,'activity','Tham quan Sydney','Điểm chính của tour: Sydney','Sydney','08:30:00','10:30:00'),
(450,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(451,1,'activity','Tham quan Sydney','Điểm chính của tour: Sydney','Sydney','08:30:00','10:30:00'),
(451,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(452,1,'activity','Tham quan Melbourne','Điểm chính của tour: Melbourne','Melbourne','08:30:00','10:30:00'),
(452,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(453,1,'activity','Tham quan Melbourne','Điểm chính của tour: Melbourne','Melbourne','08:30:00','10:30:00'),
(453,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(454,1,'activity','Tham quan Melbourne','Điểm chính của tour: Melbourne','Melbourne','08:30:00','10:30:00'),
(454,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(455,1,'activity','Tham quan Melbourne','Điểm chính của tour: Melbourne','Melbourne','08:30:00','10:30:00'),
(455,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(456,1,'activity','Tham quan Melbourne','Điểm chính của tour: Melbourne','Melbourne','08:30:00','10:30:00'),
(456,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(457,1,'activity','Tham quan Auckland','Điểm chính của tour: Auckland','Auckland','08:30:00','10:30:00'),
(457,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(458,1,'activity','Tham quan Auckland','Điểm chính của tour: Auckland','Auckland','08:30:00','10:30:00'),
(458,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(459,1,'activity','Tham quan Auckland','Điểm chính của tour: Auckland','Auckland','08:30:00','10:30:00'),
(459,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(460,1,'activity','Tham quan Auckland','Điểm chính của tour: Auckland','Auckland','08:30:00','10:30:00'),
(460,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(461,1,'activity','Tham quan Auckland','Điểm chính của tour: Auckland','Auckland','08:30:00','10:30:00'),
(461,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(462,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(462,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(463,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(463,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(464,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(464,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(465,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(465,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(466,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(466,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(467,1,'activity','Tham quan Nadi','Điểm chính của tour: Nadi','Nadi','08:30:00','10:30:00'),
(467,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(468,1,'activity','Tham quan Nadi','Điểm chính của tour: Nadi','Nadi','08:30:00','10:30:00'),
(468,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(469,1,'activity','Tham quan Nadi','Điểm chính của tour: Nadi','Nadi','08:30:00','10:30:00'),
(469,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(470,1,'activity','Tham quan Nadi','Điểm chính của tour: Nadi','Nadi','08:30:00','10:30:00'),
(470,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(471,1,'activity','Tham quan Nadi','Điểm chính của tour: Nadi','Nadi','08:30:00','10:30:00'),
(471,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(472,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(472,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(473,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(473,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(474,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(474,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(475,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(475,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(476,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(476,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(477,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(477,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(478,1,'activity','Tham quan Kyoto','Điểm chính của tour: Kyoto','Kyoto','08:30:00','10:30:00'),
(478,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(479,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(479,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(480,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(480,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(481,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(481,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(482,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(482,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(483,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(483,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(484,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(484,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(485,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(485,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(486,1,'activity','Tham quan Busan','Điểm chính của tour: Busan','Busan','08:30:00','10:30:00'),
(486,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(487,1,'activity','Tham quan Kuala Lumpur','Điểm chính của tour: Kuala Lumpur','Kuala Lumpur','08:30:00','10:30:00'),
(487,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(488,1,'activity','Tham quan Kuala Lumpur','Điểm chính của tour: Kuala Lumpur','Kuala Lumpur','08:30:00','10:30:00'),
(488,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(489,1,'activity','Tham quan Kuala Lumpur','Điểm chính của tour: Kuala Lumpur','Kuala Lumpur','08:30:00','10:30:00'),
(489,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(490,1,'activity','Tham quan Kuala Lumpur','Điểm chính của tour: Kuala Lumpur','Kuala Lumpur','08:30:00','10:30:00'),
(490,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(491,1,'activity','Tham quan Kuala Lumpur','Điểm chính của tour: Kuala Lumpur','Kuala Lumpur','08:30:00','10:30:00'),
(491,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(492,1,'activity','Tham quan Kuala Lumpur','Điểm chính của tour: Kuala Lumpur','Kuala Lumpur','08:30:00','10:30:00'),
(492,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(493,1,'activity','Tham quan Bangkok','Điểm chính của tour: Bangkok','Bangkok','08:30:00','10:30:00'),
(493,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(494,1,'activity','Tham quan Bangkok','Điểm chính của tour: Bangkok','Bangkok','08:30:00','10:30:00'),
(494,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(495,1,'activity','Tham quan Bangkok','Điểm chính của tour: Bangkok','Bangkok','08:30:00','10:30:00'),
(495,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(496,1,'activity','Tham quan Bangkok','Điểm chính của tour: Bangkok','Bangkok','08:30:00','10:30:00'),
(496,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(497,1,'activity','Tham quan Bangkok','Điểm chính của tour: Bangkok','Bangkok','08:30:00','10:30:00'),
(497,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(498,1,'activity','Tham quan Bangkok','Điểm chính của tour: Bangkok','Bangkok','08:30:00','10:30:00'),
(498,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(499,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(499,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(500,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(500,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(501,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(501,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(502,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(502,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(503,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(503,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(504,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(504,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(505,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(505,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(506,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(506,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(507,1,'activity','Tham quan Zurich','Điểm chính của tour: Zurich','Zurich','08:30:00','10:30:00'),
(507,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(508,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(508,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(509,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(509,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(510,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(510,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(511,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(511,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(512,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(512,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(513,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(513,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(514,1,'activity','Tham quan Paris','Điểm chính của tour: Paris','Paris','08:30:00','10:30:00'),
(514,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(515,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(515,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(516,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(516,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(517,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(517,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(518,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(518,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(519,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(519,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(520,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(520,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(521,1,'activity','Tham quan Lisbon','Điểm chính của tour: Lisbon','Lisbon','08:30:00','10:30:00'),
(521,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(522,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(522,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(523,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(523,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(524,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(524,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(525,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(525,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(526,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(526,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(527,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(527,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(528,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(528,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(529,1,'activity','Tham quan Reykjavik','Điểm chính của tour: Reykjavik','Reykjavik','08:30:00','10:30:00'),
(529,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(530,1,'activity','Tham quan San Francisco','Điểm chính của tour: San Francisco','San Francisco','08:30:00','10:30:00'),
(530,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(531,1,'activity','Tham quan San Francisco','Điểm chính của tour: San Francisco','San Francisco','08:30:00','10:30:00'),
(531,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(532,1,'activity','Tham quan San Francisco','Điểm chính của tour: San Francisco','San Francisco','08:30:00','10:30:00'),
(532,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(533,1,'activity','Tham quan San Francisco','Điểm chính của tour: San Francisco','San Francisco','08:30:00','10:30:00'),
(533,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(534,1,'activity','Tham quan San Francisco','Điểm chính của tour: San Francisco','San Francisco','08:30:00','10:30:00'),
(534,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(535,1,'activity','Tham quan San Francisco','Điểm chính của tour: San Francisco','San Francisco','08:30:00','10:30:00'),
(535,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(536,1,'activity','Tham quan San Francisco','Điểm chính của tour: San Francisco','San Francisco','08:30:00','10:30:00'),
(536,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(537,1,'activity','Tham quan San Francisco','Điểm chính của tour: San Francisco','San Francisco','08:30:00','10:30:00'),
(537,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(538,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(538,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(539,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(539,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(540,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(540,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(541,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(541,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(542,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(542,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(543,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(543,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(544,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(544,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(545,1,'activity','Tham quan Toronto','Điểm chính của tour: Toronto','Toronto','08:30:00','10:30:00'),
(545,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(546,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(546,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(547,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(547,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(548,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(548,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(549,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(549,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(550,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(550,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(551,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(551,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(552,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(552,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(553,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(553,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(554,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(554,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(555,1,'activity','Tham quan Queenstown','Điểm chính của tour: Queenstown','Queenstown','08:30:00','10:30:00'),
(555,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(556,1,'activity','Tham quan Cusco','Điểm chính của tour: Cusco','Cusco','08:30:00','10:30:00'),
(556,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(557,1,'activity','Tham quan Cusco','Điểm chính của tour: Cusco','Cusco','08:30:00','10:30:00'),
(557,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(558,1,'activity','Tham quan Cusco','Điểm chính của tour: Cusco','Cusco','08:30:00','10:30:00'),
(558,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(559,1,'activity','Tham quan Cusco','Điểm chính của tour: Cusco','Cusco','08:30:00','10:30:00'),
(559,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(560,1,'activity','Tham quan Cusco','Điểm chính của tour: Cusco','Cusco','08:30:00','10:30:00'),
(560,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(561,1,'activity','Tham quan Cusco','Điểm chính của tour: Cusco','Cusco','08:30:00','10:30:00'),
(561,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(562,1,'activity','Tham quan Cusco','Điểm chính của tour: Cusco','Cusco','08:30:00','10:30:00'),
(562,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(563,1,'activity','Tham quan Cusco','Điểm chính của tour: Cusco','Cusco','08:30:00','10:30:00'),
(563,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(564,1,'activity','Tham quan Cusco','Điểm chính của tour: Cusco','Cusco','08:30:00','10:30:00'),
(564,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(565,1,'activity','Tham quan Cusco','Điểm chính của tour: Cusco','Cusco','08:30:00','10:30:00'),
(565,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(566,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(566,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(567,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(567,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(568,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(568,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(569,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(569,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(570,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(570,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(571,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(571,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(572,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(572,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(573,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(573,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(574,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(574,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00'),
(575,1,'activity','Tham quan Cape Town','Điểm chính của tour: Cape Town','Cape Town','08:30:00','10:30:00'),
(575,2,'meal','Ẩm thực địa phương','Thưởng thức món ăn đặc trưng theo vùng/tuyến tour.','Nhà hàng địa phương','11:30:00','13:00:00');

INSERT IGNORE INTO tour_seasonality (tour_id, month_from, month_to, season_name, notes) VALUES
(1,1,12,'best','Thời điểm phù hợp để tham quan Hồ Hoàn Kiếm.'),
(2,1,12,'best','Thời điểm phù hợp để tham quan Văn Miếu - Quốc Tử Giám.'),
(3,1,12,'best','Thời điểm phù hợp để tham quan Đại Nội Huế.'),
(4,1,12,'best','Thời điểm phù hợp để tham quan Lăng Khải Định.'),
(5,1,12,'best','Thời điểm phù hợp để tham quan Đảo Cát Bà.'),
(6,1,12,'best','Thời điểm phù hợp để tham quan Vịnh Lan Hạ.'),
(7,1,12,'best','Thời điểm phù hợp để tham quan Bà Nà Hills.'),
(8,1,12,'best','Thời điểm phù hợp để tham quan Cầu Rồng.'),
(9,1,12,'best','Thời điểm phù hợp để tham quan Dinh Độc Lập.'),
(10,1,12,'best','Thời điểm phù hợp để tham quan Nhà thờ Đức Bà.'),
(11,1,12,'best','Thời điểm phù hợp để tham quan Chợ nổi Cái Răng.'),
(12,1,12,'best','Thời điểm phù hợp để tham quan Bến Ninh Kiều.'),
(13,1,12,'best','Thời điểm phù hợp để tham quan Khu di tích Tân Trào.'),
(14,1,12,'best','Thời điểm phù hợp để tham quan Hồ Na Hang.'),
(15,1,12,'best','Thời điểm phù hợp để tham quan Sa Pa.'),
(16,1,12,'best','Thời điểm phù hợp để tham quan Đỉnh Fansipan.'),
(17,1,12,'best','Thời điểm phù hợp để tham quan Pu Ta Leng.'),
(18,1,12,'best','Thời điểm phù hợp để tham quan Đèo Ô Quy Hồ.'),
(19,1,12,'best','Thời điểm phù hợp để tham quan Đồi A1.'),
(20,1,12,'best','Thời điểm phù hợp để tham quan Bảo tàng Chiến thắng Điện Biên Phủ.'),
(21,1,12,'best','Thời điểm phù hợp để tham quan Mộc Châu.'),
(22,1,12,'best','Thời điểm phù hợp để tham quan Tà Xùa.'),
(23,1,12,'best','Thời điểm phù hợp để tham quan Mẫu Sơn.'),
(24,1,12,'best','Thời điểm phù hợp để tham quan Động Tam Thanh.'),
(25,1,12,'best','Thời điểm phù hợp để tham quan Thác Bản Giốc.'),
(26,1,12,'best','Thời điểm phù hợp để tham quan Động Ngườm Ngao.'),
(27,1,12,'best','Thời điểm phù hợp để tham quan Hồ Núi Cốc.'),
(28,1,12,'best','Thời điểm phù hợp để tham quan Đồi chè Tân Cương.'),
(29,1,12,'best','Thời điểm phù hợp để tham quan Đền Hùng.'),
(30,1,12,'best','Thời điểm phù hợp để tham quan Vườn quốc gia Xuân Sơn.'),
(31,1,12,'best','Thời điểm phù hợp để tham quan Chùa Dâu.'),
(32,1,12,'best','Thời điểm phù hợp để tham quan Chùa Bút Tháp.'),
(33,1,12,'best','Thời điểm phù hợp để tham quan Phố Hiến.'),
(34,1,12,'best','Thời điểm phù hợp để tham quan Đền Chử Đồng Tử.'),
(35,1,12,'best','Thời điểm phù hợp để tham quan Tràng An.'),
(36,1,12,'best','Thời điểm phù hợp để tham quan Tam Cốc - Bích Động.'),
(37,1,12,'best','Thời điểm phù hợp để tham quan Vịnh Hạ Long.'),
(38,1,12,'best','Thời điểm phù hợp để tham quan Yên Tử.'),
(39,1,12,'best','Thời điểm phù hợp để tham quan Biển Sầm Sơn.'),
(40,1,12,'best','Thời điểm phù hợp để tham quan Pù Luông.'),
(41,1,12,'best','Thời điểm phù hợp để tham quan Biển Cửa Lò.'),
(42,1,12,'best','Thời điểm phù hợp để tham quan Làng Sen quê Bác.'),
(43,1,12,'best','Thời điểm phù hợp để tham quan Biển Thiên Cầm.'),
(44,1,12,'best','Thời điểm phù hợp để tham quan Chùa Hương Tích.'),
(45,1,12,'best','Thời điểm phù hợp để tham quan Thành cổ Quảng Trị.'),
(46,1,12,'best','Thời điểm phù hợp để tham quan Địa đạo Vịnh Mốc.'),
(47,1,12,'best','Thời điểm phù hợp để tham quan Đảo Lý Sơn.'),
(48,1,12,'best','Thời điểm phù hợp để tham quan Biển Mỹ Khê Quảng Ngãi.'),
(49,1,12,'best','Thời điểm phù hợp để tham quan Biển Hồ Pleiku.'),
(50,1,12,'best','Thời điểm phù hợp để tham quan Ghềnh Ráng Tiên Sa.'),
(51,1,12,'best','Thời điểm phù hợp để tham quan Buôn Ma Thuột.'),
(52,1,12,'best','Thời điểm phù hợp để tham quan Buôn Đôn.'),
(53,1,12,'best','Thời điểm phù hợp để tham quan Nha Trang.'),
(54,1,12,'best','Thời điểm phù hợp để tham quan VinWonders Nha Trang.'),
(55,1,12,'best','Thời điểm phù hợp để tham quan Đà Lạt.'),
(56,1,12,'best','Thời điểm phù hợp để tham quan Hồ Xuân Hương.'),
(57,1,12,'best','Thời điểm phù hợp để tham quan Hồ Trị An.'),
(58,1,12,'best','Thời điểm phù hợp để tham quan Vườn quốc gia Nam Cát Tiên.'),
(59,1,12,'best','Thời điểm phù hợp để tham quan Núi Bà Đen.'),
(60,1,12,'best','Thời điểm phù hợp để tham quan Tòa Thánh Cao Đài.'),
(61,1,12,'best','Thời điểm phù hợp để tham quan Vườn quốc gia Tràm Chim.'),
(62,1,12,'best','Thời điểm phù hợp để tham quan Làng hoa Sa Đéc.'),
(63,1,12,'best','Thời điểm phù hợp để tham quan Rừng tràm Trà Sư.'),
(64,1,12,'best','Thời điểm phù hợp để tham quan Miếu Bà Chúa Xứ Núi Sam.'),
(65,1,12,'best','Thời điểm phù hợp để tham quan Cù lao An Bình.'),
(66,1,12,'best','Thời điểm phù hợp để tham quan Văn Thánh Miếu Vĩnh Long.'),
(67,1,12,'best','Thời điểm phù hợp để tham quan Mũi Cà Mau.'),
(68,1,12,'best','Thời điểm phù hợp để tham quan Rừng U Minh Hạ.'),
(69,1,12,'best','Thời điểm phù hợp để tham quan Vịnh Hạ Long.'),
(70,1,12,'best','Thời điểm phù hợp để tham quan Sa Pa.'),
(71,1,12,'best','Thời điểm phù hợp để tham quan Tràng An.'),
(72,1,12,'best','Thời điểm phù hợp để tham quan Đà Lạt.'),
(73,1,12,'best','Thời điểm phù hợp để tham quan Phú Quốc.'),
(74,1,12,'best','Thời điểm phù hợp để tham quan Bà Nà Hills.'),
(75,1,12,'best','Thời điểm phù hợp để tham quan Mũi Né.'),
(76,1,12,'best','Thời điểm phù hợp để tham quan Côn Đảo.'),
(77,1,12,'best','Thời điểm phù hợp để tham quan Rừng tràm Trà Sư.'),
(78,1,12,'best','Thời điểm phù hợp để tham quan Mộc Châu.'),
(79,1,12,'best','Thời điểm phù hợp để tham quan Cao nguyên đá Đồng Văn.'),
(80,1,12,'best','Thời điểm phù hợp để tham quan Nha Trang.'),
(81,1,12,'best','Thời điểm phù hợp để tham quan Sa Pa.'),
(82,1,12,'best','Thời điểm phù hợp để tham quan Bà Nà Hills.'),
(83,1,12,'best','Thời điểm phù hợp để tham quan Chợ nổi Cái Răng.'),
(84,1,12,'best','Thời điểm phù hợp để tham quan Sa Pa.'),
(85,1,12,'best','Thời điểm phù hợp để tham quan Vịnh Hạ Long.'),
(86,1,12,'best','Thời điểm phù hợp để tham quan Đà Lạt.'),
(87,1,12,'best','Thời điểm phù hợp để tham quan Mũi Cà Mau.'),
(88,1,12,'best','Thời điểm phù hợp để tham quan Đại Nội Huế.'),
(89,1,12,'best','Thời điểm phù hợp để tham quan Hồ Hoàn Kiếm.'),
(90,1,12,'best','Thời điểm phù hợp để tham quan Chợ nổi Cái Răng.'),
(91,1,12,'best','Thời điểm phù hợp để tham quan Seoul.'),
(92,1,12,'best','Thời điểm phù hợp để tham quan Busan.'),
(93,1,12,'best','Thời điểm phù hợp để tham quan Tokyo.'),
(94,1,12,'best','Thời điểm phù hợp để tham quan Kyoto.'),
(95,1,12,'best','Thời điểm phù hợp để tham quan Bangkok.'),
(96,1,12,'best','Thời điểm phù hợp để tham quan Phuket.'),
(97,1,12,'best','Thời điểm phù hợp để tham quan Marina Bay Sands.'),
(98,1,12,'best','Thời điểm phù hợp để tham quan Kuala Lumpur.'),
(99,1,12,'best','Thời điểm phù hợp để tham quan Bali.'),
(100,1,12,'best','Thời điểm phù hợp để tham quan Beijing.'),
(101,1,12,'best','Thời điểm phù hợp để tham quan Shanghai.'),
(102,1,12,'best','Thời điểm phù hợp để tham quan Taipei.'),
(103,1,12,'best','Thời điểm phù hợp để tham quan Victoria Peak.'),
(104,1,12,'best','Thời điểm phù hợp để tham quan Siem Reap.'),
(105,1,12,'best','Thời điểm phù hợp để tham quan Luang Prabang.'),
(106,1,12,'best','Thời điểm phù hợp để tham quan New Delhi.'),
(107,1,12,'best','Thời điểm phù hợp để tham quan Agra.'),
(108,1,12,'best','Thời điểm phù hợp để tham quan Male.'),
(109,1,12,'best','Thời điểm phù hợp để tham quan Dubai.'),
(110,1,12,'best','Thời điểm phù hợp để tham quan Istanbul.'),
(111,1,12,'best','Thời điểm phù hợp để tham quan Paris.'),
(112,1,12,'best','Thời điểm phù hợp để tham quan Rome.'),
(113,1,12,'best','Thời điểm phù hợp để tham quan Venice.'),
(114,1,12,'best','Thời điểm phù hợp để tham quan London.'),
(115,1,12,'best','Thời điểm phù hợp để tham quan Madrid.'),
(116,1,12,'best','Thời điểm phù hợp để tham quan Barcelona.'),
(117,1,12,'best','Thời điểm phù hợp để tham quan Berlin.'),
(118,1,12,'best','Thời điểm phù hợp để tham quan Munich.'),
(119,1,12,'best','Thời điểm phù hợp để tham quan Amsterdam.'),
(120,1,12,'best','Thời điểm phù hợp để tham quan Zurich.'),
(121,1,12,'best','Thời điểm phù hợp để tham quan Vienna.'),
(122,1,12,'best','Thời điểm phù hợp để tham quan Prague.'),
(123,1,12,'best','Thời điểm phù hợp để tham quan Athens.'),
(124,1,12,'best','Thời điểm phù hợp để tham quan Lisbon.'),
(125,1,12,'best','Thời điểm phù hợp để tham quan Helsinki.'),
(126,1,12,'best','Thời điểm phù hợp để tham quan Oslo.'),
(127,1,12,'best','Thời điểm phù hợp để tham quan Copenhagen.'),
(128,1,12,'best','Thời điểm phù hợp để tham quan Reykjavik.'),
(129,1,12,'best','Thời điểm phù hợp để tham quan Cairo.'),
(130,1,12,'best','Thời điểm phù hợp để tham quan Cape Town.'),
(131,1,12,'best','Thời điểm phù hợp để tham quan Marrakech.'),
(132,1,12,'best','Thời điểm phù hợp để tham quan Nairobi.'),
(133,1,12,'best','Thời điểm phù hợp để tham quan Serengeti.'),
(134,1,12,'best','Thời điểm phù hợp để tham quan New York.'),
(135,1,12,'best','Thời điểm phù hợp để tham quan Los Angeles.'),
(136,1,12,'best','Thời điểm phù hợp để tham quan Toronto.'),
(137,1,12,'best','Thời điểm phù hợp để tham quan Vancouver.'),
(138,1,12,'best','Thời điểm phù hợp để tham quan Mexico City.'),
(139,1,12,'best','Thời điểm phù hợp để tham quan Rio de Janeiro.'),
(140,1,12,'best','Thời điểm phù hợp để tham quan Buenos Aires.'),
(141,1,12,'best','Thời điểm phù hợp để tham quan Lima.'),
(142,1,12,'best','Thời điểm phù hợp để tham quan Santiago.'),
(143,1,12,'best','Thời điểm phù hợp để tham quan Sydney.'),
(144,1,12,'best','Thời điểm phù hợp để tham quan Melbourne.'),
(145,1,12,'best','Thời điểm phù hợp để tham quan Auckland.'),
(146,1,12,'best','Thời điểm phù hợp để tham quan Queenstown.'),
(147,1,12,'best','Thời điểm phù hợp để tham quan Nadi.'),
(148,1,12,'best','Thời điểm phù hợp để tham quan Kyoto.'),
(149,1,12,'best','Thời điểm phù hợp để tham quan Busan.'),
(150,1,12,'best','Thời điểm phù hợp để tham quan Kuala Lumpur.'),
(151,1,12,'best','Thời điểm phù hợp để tham quan Bangkok.'),
(152,1,12,'best','Thời điểm phù hợp để tham quan Zurich.'),
(153,1,12,'best','Thời điểm phù hợp để tham quan Paris.'),
(154,1,12,'best','Thời điểm phù hợp để tham quan Lisbon.'),
(155,1,12,'best','Thời điểm phù hợp để tham quan Reykjavik.'),
(156,1,12,'best','Thời điểm phù hợp để tham quan San Francisco.'),
(157,1,12,'best','Thời điểm phù hợp để tham quan Toronto.'),
(158,1,12,'best','Thời điểm phù hợp để tham quan Queenstown.'),
(159,1,12,'best','Thời điểm phù hợp để tham quan Cusco.'),
(160,1,12,'best','Thời điểm phù hợp để tham quan Cape Town.');

INSERT IGNORE INTO tour_checklist_items (
    tour_id, item_name, is_required
) VALUES
(1,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(1,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(2,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(2,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(3,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(3,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(4,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(4,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(5,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(5,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(6,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(6,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(7,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(7,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(8,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(8,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(9,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(9,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(10,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(10,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(11,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(11,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(12,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(12,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(13,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(13,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(14,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(14,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(15,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(15,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(16,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(16,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(17,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(17,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(18,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(18,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(19,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(19,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(20,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(20,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(21,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(21,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(22,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(22,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(23,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(23,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(24,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(24,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(25,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(25,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(26,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(26,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(27,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(27,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(28,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(28,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(29,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(29,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(30,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(30,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(31,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(31,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(32,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(32,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(33,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(33,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(34,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(34,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(35,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(35,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(36,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(36,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(37,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(37,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(38,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(38,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(39,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(39,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(40,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(40,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(41,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(41,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(42,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(42,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(43,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(43,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(44,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(44,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(45,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(45,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(46,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(46,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(47,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(47,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(48,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(48,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(49,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(49,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(50,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(50,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(51,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(51,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(52,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(52,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(53,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(53,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(54,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(54,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(55,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(55,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(56,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(56,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(57,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(57,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(58,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(58,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(59,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(59,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(60,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(60,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(61,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(61,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(62,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(62,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(63,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(63,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(64,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(64,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(65,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(65,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(66,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(66,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(67,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(67,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(68,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(68,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(69,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(69,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(70,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(70,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(71,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(71,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(72,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(72,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(73,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(73,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(74,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(74,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(75,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(75,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(76,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(76,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(77,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(77,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(78,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(78,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(79,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(79,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(80,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(80,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(81,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(81,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(82,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(82,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(83,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(83,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(84,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(84,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(85,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(85,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(86,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(86,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(87,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(87,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(88,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(88,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(89,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(89,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(90,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(90,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(91,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(91,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(92,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(92,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(93,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(93,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(94,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(94,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(95,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(95,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(96,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(96,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(97,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(97,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(98,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(98,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(99,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(99,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(100,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(100,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(101,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(101,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(102,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(102,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(103,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(103,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(104,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(104,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(105,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(105,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(106,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(106,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(107,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(107,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(108,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(108,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(109,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(109,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(110,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(110,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(111,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(111,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(112,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(112,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(113,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(113,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(114,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(114,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(115,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(115,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(116,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(116,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(117,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(117,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(118,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(118,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(119,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(119,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(120,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(120,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(121,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(121,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(122,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(122,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(123,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(123,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(124,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(124,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(125,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(125,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(126,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(126,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(127,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(127,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(128,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(128,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(129,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(129,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(130,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(130,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(131,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(131,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(132,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(132,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(133,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(133,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(134,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(134,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(135,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(135,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(136,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(136,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(137,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(137,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(138,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(138,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(139,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(139,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(140,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(140,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(141,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(141,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(142,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(142,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(143,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(143,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(144,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(144,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(145,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(145,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(146,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(146,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(147,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(147,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(148,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(148,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(149,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(149,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(150,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(150,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(151,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(151,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(152,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(152,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(153,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(153,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(154,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(154,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(155,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(155,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(156,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(156,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(157,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(157,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(158,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(158,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(159,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(159,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE),
(160,'Mang giấy tờ tùy thân/hộ chiếu còn hạn',FALSE),
(160,'Chuẩn bị giày đi bộ và thuốc cá nhân',FALSE);;

INSERT IGNORE INTO tour_translations (
    tour_id, locale, name, short_description, description
) VALUES
(1,'vi','Hà Nội 1N – Khám phá Hồ Hoàn Kiếm','Tour nội địa trong phạm vi Hà Nội','Hành trình chỉ di chuyển trong Hà Nội, phù hợp khách muốn khám phá sâu Hồ Hoàn Kiếm và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(2,'vi','Hà Nội 2N – Khám phá Văn Miếu - Quốc Tử Giám','Tour nội địa trong phạm vi Hà Nội','Hành trình chỉ di chuyển trong Hà Nội, phù hợp khách muốn khám phá sâu Văn Miếu - Quốc Tử Giám và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(3,'vi','Huế 1N – Khám phá Đại Nội Huế','Tour nội địa trong phạm vi Huế','Hành trình chỉ di chuyển trong Huế, phù hợp khách muốn khám phá sâu Đại Nội Huế và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(4,'vi','Huế 2N – Khám phá Lăng Khải Định','Tour nội địa trong phạm vi Huế','Hành trình chỉ di chuyển trong Huế, phù hợp khách muốn khám phá sâu Lăng Khải Định và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(5,'vi','Hải Phòng 1N – Khám phá Đảo Cát Bà','Tour nội địa trong phạm vi Hải Phòng','Hành trình chỉ di chuyển trong Hải Phòng, phù hợp khách muốn khám phá sâu Đảo Cát Bà và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(6,'vi','Hải Phòng 2N – Khám phá Vịnh Lan Hạ','Tour nội địa trong phạm vi Hải Phòng','Hành trình chỉ di chuyển trong Hải Phòng, phù hợp khách muốn khám phá sâu Vịnh Lan Hạ và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(7,'vi','Đà Nẵng 1N – Khám phá Bà Nà Hills','Tour nội địa trong phạm vi Đà Nẵng','Hành trình chỉ di chuyển trong Đà Nẵng, phù hợp khách muốn khám phá sâu Bà Nà Hills và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(8,'vi','Đà Nẵng 2N – Khám phá Cầu Rồng','Tour nội địa trong phạm vi Đà Nẵng','Hành trình chỉ di chuyển trong Đà Nẵng, phù hợp khách muốn khám phá sâu Cầu Rồng và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(9,'vi','TP. Hồ Chí Minh 1N – Khám phá Dinh Độc Lập','Tour nội địa trong phạm vi TP. Hồ Chí Minh','Hành trình chỉ di chuyển trong TP. Hồ Chí Minh, phù hợp khách muốn khám phá sâu Dinh Độc Lập và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(10,'vi','TP. Hồ Chí Minh 2N – Khám phá Nhà thờ Đức Bà','Tour nội địa trong phạm vi TP. Hồ Chí Minh','Hành trình chỉ di chuyển trong TP. Hồ Chí Minh, phù hợp khách muốn khám phá sâu Nhà thờ Đức Bà và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(11,'vi','Cần Thơ 1N – Khám phá Chợ nổi Cái Răng','Tour nội địa trong phạm vi Cần Thơ','Hành trình chỉ di chuyển trong Cần Thơ, phù hợp khách muốn khám phá sâu Chợ nổi Cái Răng và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(12,'vi','Cần Thơ 2N – Khám phá Bến Ninh Kiều','Tour nội địa trong phạm vi Cần Thơ','Hành trình chỉ di chuyển trong Cần Thơ, phù hợp khách muốn khám phá sâu Bến Ninh Kiều và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(13,'vi','Tuyên Quang 1N – Khám phá Khu di tích Tân Trào','Tour nội địa trong phạm vi Tuyên Quang','Hành trình chỉ di chuyển trong Tuyên Quang, phù hợp khách muốn khám phá sâu Khu di tích Tân Trào và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(14,'vi','Tuyên Quang 2N – Khám phá Hồ Na Hang','Tour nội địa trong phạm vi Tuyên Quang','Hành trình chỉ di chuyển trong Tuyên Quang, phù hợp khách muốn khám phá sâu Hồ Na Hang và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(15,'vi','Lào Cai 1N – Khám phá Sa Pa','Tour nội địa trong phạm vi Lào Cai','Hành trình chỉ di chuyển trong Lào Cai, phù hợp khách muốn khám phá sâu Sa Pa và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(16,'vi','Lào Cai 2N – Khám phá Đỉnh Fansipan','Tour nội địa trong phạm vi Lào Cai','Hành trình chỉ di chuyển trong Lào Cai, phù hợp khách muốn khám phá sâu Đỉnh Fansipan và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(17,'vi','Lai Châu 1N – Khám phá Pu Ta Leng','Tour nội địa trong phạm vi Lai Châu','Hành trình chỉ di chuyển trong Lai Châu, phù hợp khách muốn khám phá sâu Pu Ta Leng và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(18,'vi','Lai Châu 2N – Khám phá Đèo Ô Quy Hồ','Tour nội địa trong phạm vi Lai Châu','Hành trình chỉ di chuyển trong Lai Châu, phù hợp khách muốn khám phá sâu Đèo Ô Quy Hồ và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(19,'vi','Điện Biên 1N – Khám phá Đồi A1','Tour nội địa trong phạm vi Điện Biên','Hành trình chỉ di chuyển trong Điện Biên, phù hợp khách muốn khám phá sâu Đồi A1 và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(20,'vi','Điện Biên 2N – Khám phá Bảo tàng Chiến thắng Điện Biên Phủ','Tour nội địa trong phạm vi Điện Biên','Hành trình chỉ di chuyển trong Điện Biên, phù hợp khách muốn khám phá sâu Bảo tàng Chiến thắng Điện Biên Phủ và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(21,'vi','Sơn La 1N – Khám phá Mộc Châu','Tour nội địa trong phạm vi Sơn La','Hành trình chỉ di chuyển trong Sơn La, phù hợp khách muốn khám phá sâu Mộc Châu và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(22,'vi','Sơn La 2N – Khám phá Tà Xùa','Tour nội địa trong phạm vi Sơn La','Hành trình chỉ di chuyển trong Sơn La, phù hợp khách muốn khám phá sâu Tà Xùa và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(23,'vi','Lạng Sơn 1N – Khám phá Mẫu Sơn','Tour nội địa trong phạm vi Lạng Sơn','Hành trình chỉ di chuyển trong Lạng Sơn, phù hợp khách muốn khám phá sâu Mẫu Sơn và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(24,'vi','Lạng Sơn 2N – Khám phá Động Tam Thanh','Tour nội địa trong phạm vi Lạng Sơn','Hành trình chỉ di chuyển trong Lạng Sơn, phù hợp khách muốn khám phá sâu Động Tam Thanh và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(25,'vi','Cao Bằng 1N – Khám phá Thác Bản Giốc','Tour nội địa trong phạm vi Cao Bằng','Hành trình chỉ di chuyển trong Cao Bằng, phù hợp khách muốn khám phá sâu Thác Bản Giốc và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(26,'vi','Cao Bằng 2N – Khám phá Động Ngườm Ngao','Tour nội địa trong phạm vi Cao Bằng','Hành trình chỉ di chuyển trong Cao Bằng, phù hợp khách muốn khám phá sâu Động Ngườm Ngao và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(27,'vi','Thái Nguyên 1N – Khám phá Hồ Núi Cốc','Tour nội địa trong phạm vi Thái Nguyên','Hành trình chỉ di chuyển trong Thái Nguyên, phù hợp khách muốn khám phá sâu Hồ Núi Cốc và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(28,'vi','Thái Nguyên 2N – Khám phá Đồi chè Tân Cương','Tour nội địa trong phạm vi Thái Nguyên','Hành trình chỉ di chuyển trong Thái Nguyên, phù hợp khách muốn khám phá sâu Đồi chè Tân Cương và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(29,'vi','Phú Thọ 1N – Khám phá Đền Hùng','Tour nội địa trong phạm vi Phú Thọ','Hành trình chỉ di chuyển trong Phú Thọ, phù hợp khách muốn khám phá sâu Đền Hùng và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(30,'vi','Phú Thọ 2N – Khám phá Vườn quốc gia Xuân Sơn','Tour nội địa trong phạm vi Phú Thọ','Hành trình chỉ di chuyển trong Phú Thọ, phù hợp khách muốn khám phá sâu Vườn quốc gia Xuân Sơn và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(31,'vi','Bắc Ninh 1N – Khám phá Chùa Dâu','Tour nội địa trong phạm vi Bắc Ninh','Hành trình chỉ di chuyển trong Bắc Ninh, phù hợp khách muốn khám phá sâu Chùa Dâu và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(32,'vi','Bắc Ninh 2N – Khám phá Chùa Bút Tháp','Tour nội địa trong phạm vi Bắc Ninh','Hành trình chỉ di chuyển trong Bắc Ninh, phù hợp khách muốn khám phá sâu Chùa Bút Tháp và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(33,'vi','Hưng Yên 1N – Khám phá Phố Hiến','Tour nội địa trong phạm vi Hưng Yên','Hành trình chỉ di chuyển trong Hưng Yên, phù hợp khách muốn khám phá sâu Phố Hiến và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(34,'vi','Hưng Yên 2N – Khám phá Đền Chử Đồng Tử','Tour nội địa trong phạm vi Hưng Yên','Hành trình chỉ di chuyển trong Hưng Yên, phù hợp khách muốn khám phá sâu Đền Chử Đồng Tử và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(35,'vi','Ninh Bình 1N – Khám phá Tràng An','Tour nội địa trong phạm vi Ninh Bình','Hành trình chỉ di chuyển trong Ninh Bình, phù hợp khách muốn khám phá sâu Tràng An và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(36,'vi','Ninh Bình 2N – Khám phá Tam Cốc - Bích Động','Tour nội địa trong phạm vi Ninh Bình','Hành trình chỉ di chuyển trong Ninh Bình, phù hợp khách muốn khám phá sâu Tam Cốc - Bích Động và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(37,'vi','Quảng Ninh 1N – Khám phá Vịnh Hạ Long','Tour nội địa trong phạm vi Quảng Ninh','Hành trình chỉ di chuyển trong Quảng Ninh, phù hợp khách muốn khám phá sâu Vịnh Hạ Long và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(38,'vi','Quảng Ninh 2N – Khám phá Yên Tử','Tour nội địa trong phạm vi Quảng Ninh','Hành trình chỉ di chuyển trong Quảng Ninh, phù hợp khách muốn khám phá sâu Yên Tử và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(39,'vi','Thanh Hóa 1N – Khám phá Biển Sầm Sơn','Tour nội địa trong phạm vi Thanh Hóa','Hành trình chỉ di chuyển trong Thanh Hóa, phù hợp khách muốn khám phá sâu Biển Sầm Sơn và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(40,'vi','Thanh Hóa 2N – Khám phá Pù Luông','Tour nội địa trong phạm vi Thanh Hóa','Hành trình chỉ di chuyển trong Thanh Hóa, phù hợp khách muốn khám phá sâu Pù Luông và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(41,'vi','Nghệ An 1N – Khám phá Biển Cửa Lò','Tour nội địa trong phạm vi Nghệ An','Hành trình chỉ di chuyển trong Nghệ An, phù hợp khách muốn khám phá sâu Biển Cửa Lò và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(42,'vi','Nghệ An 2N – Khám phá Làng Sen quê Bác','Tour nội địa trong phạm vi Nghệ An','Hành trình chỉ di chuyển trong Nghệ An, phù hợp khách muốn khám phá sâu Làng Sen quê Bác và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(43,'vi','Hà Tĩnh 1N – Khám phá Biển Thiên Cầm','Tour nội địa trong phạm vi Hà Tĩnh','Hành trình chỉ di chuyển trong Hà Tĩnh, phù hợp khách muốn khám phá sâu Biển Thiên Cầm và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(44,'vi','Hà Tĩnh 2N – Khám phá Chùa Hương Tích','Tour nội địa trong phạm vi Hà Tĩnh','Hành trình chỉ di chuyển trong Hà Tĩnh, phù hợp khách muốn khám phá sâu Chùa Hương Tích và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(45,'vi','Quảng Trị 1N – Khám phá Thành cổ Quảng Trị','Tour nội địa trong phạm vi Quảng Trị','Hành trình chỉ di chuyển trong Quảng Trị, phù hợp khách muốn khám phá sâu Thành cổ Quảng Trị và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(46,'vi','Quảng Trị 2N – Khám phá Địa đạo Vịnh Mốc','Tour nội địa trong phạm vi Quảng Trị','Hành trình chỉ di chuyển trong Quảng Trị, phù hợp khách muốn khám phá sâu Địa đạo Vịnh Mốc và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(47,'vi','Quảng Ngãi 1N – Khám phá Đảo Lý Sơn','Tour nội địa trong phạm vi Quảng Ngãi','Hành trình chỉ di chuyển trong Quảng Ngãi, phù hợp khách muốn khám phá sâu Đảo Lý Sơn và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(48,'vi','Quảng Ngãi 2N – Khám phá Biển Mỹ Khê Quảng Ngãi','Tour nội địa trong phạm vi Quảng Ngãi','Hành trình chỉ di chuyển trong Quảng Ngãi, phù hợp khách muốn khám phá sâu Biển Mỹ Khê Quảng Ngãi và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(49,'vi','Gia Lai 1N – Khám phá Biển Hồ Pleiku','Tour nội địa trong phạm vi Gia Lai','Hành trình chỉ di chuyển trong Gia Lai, phù hợp khách muốn khám phá sâu Biển Hồ Pleiku và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(50,'vi','Gia Lai 2N – Khám phá Ghềnh Ráng Tiên Sa','Tour nội địa trong phạm vi Gia Lai','Hành trình chỉ di chuyển trong Gia Lai, phù hợp khách muốn khám phá sâu Ghềnh Ráng Tiên Sa và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(51,'vi','Đắk Lắk 1N – Khám phá Buôn Ma Thuột','Tour nội địa trong phạm vi Đắk Lắk','Hành trình chỉ di chuyển trong Đắk Lắk, phù hợp khách muốn khám phá sâu Buôn Ma Thuột và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(52,'vi','Đắk Lắk 2N – Khám phá Buôn Đôn','Tour nội địa trong phạm vi Đắk Lắk','Hành trình chỉ di chuyển trong Đắk Lắk, phù hợp khách muốn khám phá sâu Buôn Đôn và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(53,'vi','Khánh Hòa 1N – Khám phá Nha Trang','Tour nội địa trong phạm vi Khánh Hòa','Hành trình chỉ di chuyển trong Khánh Hòa, phù hợp khách muốn khám phá sâu Nha Trang và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(54,'vi','Khánh Hòa 2N – Khám phá VinWonders Nha Trang','Tour nội địa trong phạm vi Khánh Hòa','Hành trình chỉ di chuyển trong Khánh Hòa, phù hợp khách muốn khám phá sâu VinWonders Nha Trang và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(55,'vi','Lâm Đồng 1N – Khám phá Đà Lạt','Tour nội địa trong phạm vi Lâm Đồng','Hành trình chỉ di chuyển trong Lâm Đồng, phù hợp khách muốn khám phá sâu Đà Lạt và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(56,'vi','Lâm Đồng 2N – Khám phá Hồ Xuân Hương','Tour nội địa trong phạm vi Lâm Đồng','Hành trình chỉ di chuyển trong Lâm Đồng, phù hợp khách muốn khám phá sâu Hồ Xuân Hương và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(57,'vi','Đồng Nai 1N – Khám phá Hồ Trị An','Tour nội địa trong phạm vi Đồng Nai','Hành trình chỉ di chuyển trong Đồng Nai, phù hợp khách muốn khám phá sâu Hồ Trị An và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(58,'vi','Đồng Nai 2N – Khám phá Vườn quốc gia Nam Cát Tiên','Tour nội địa trong phạm vi Đồng Nai','Hành trình chỉ di chuyển trong Đồng Nai, phù hợp khách muốn khám phá sâu Vườn quốc gia Nam Cát Tiên và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(59,'vi','Tây Ninh 1N – Khám phá Núi Bà Đen','Tour nội địa trong phạm vi Tây Ninh','Hành trình chỉ di chuyển trong Tây Ninh, phù hợp khách muốn khám phá sâu Núi Bà Đen và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(60,'vi','Tây Ninh 2N – Khám phá Tòa Thánh Cao Đài','Tour nội địa trong phạm vi Tây Ninh','Hành trình chỉ di chuyển trong Tây Ninh, phù hợp khách muốn khám phá sâu Tòa Thánh Cao Đài và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(61,'vi','Đồng Tháp 1N – Khám phá Vườn quốc gia Tràm Chim','Tour nội địa trong phạm vi Đồng Tháp','Hành trình chỉ di chuyển trong Đồng Tháp, phù hợp khách muốn khám phá sâu Vườn quốc gia Tràm Chim và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(62,'vi','Đồng Tháp 2N – Khám phá Làng hoa Sa Đéc','Tour nội địa trong phạm vi Đồng Tháp','Hành trình chỉ di chuyển trong Đồng Tháp, phù hợp khách muốn khám phá sâu Làng hoa Sa Đéc và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(63,'vi','An Giang 1N – Khám phá Rừng tràm Trà Sư','Tour nội địa trong phạm vi An Giang','Hành trình chỉ di chuyển trong An Giang, phù hợp khách muốn khám phá sâu Rừng tràm Trà Sư và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(64,'vi','An Giang 2N – Khám phá Miếu Bà Chúa Xứ Núi Sam','Tour nội địa trong phạm vi An Giang','Hành trình chỉ di chuyển trong An Giang, phù hợp khách muốn khám phá sâu Miếu Bà Chúa Xứ Núi Sam và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(65,'vi','Vĩnh Long 1N – Khám phá Cù lao An Bình','Tour nội địa trong phạm vi Vĩnh Long','Hành trình chỉ di chuyển trong Vĩnh Long, phù hợp khách muốn khám phá sâu Cù lao An Bình và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(66,'vi','Vĩnh Long 2N – Khám phá Văn Thánh Miếu Vĩnh Long','Tour nội địa trong phạm vi Vĩnh Long','Hành trình chỉ di chuyển trong Vĩnh Long, phù hợp khách muốn khám phá sâu Văn Thánh Miếu Vĩnh Long và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(67,'vi','Cà Mau 1N – Khám phá Mũi Cà Mau','Tour nội địa trong phạm vi Cà Mau','Hành trình chỉ di chuyển trong Cà Mau, phù hợp khách muốn khám phá sâu Mũi Cà Mau và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(68,'vi','Cà Mau 2N – Khám phá Rừng U Minh Hạ','Tour nội địa trong phạm vi Cà Mau','Hành trình chỉ di chuyển trong Cà Mau, phù hợp khách muốn khám phá sâu Rừng U Minh Hạ và văn hóa địa phương mà không phải đổi tỉnh/thành.'),
(69,'vi','Nghỉ dưỡng Vịnh Hạ Long 3N2Đ','Tour nội địa tại Quảng Ninh','Lịch trình nghỉ dưỡng và tham quan tập trung trong Quảng Ninh, lấy Vịnh Hạ Long làm điểm chính để làm tour.'),
(70,'vi','Nghỉ dưỡng Sa Pa 3N2Đ','Tour nội địa tại Lào Cai','Lịch trình nghỉ dưỡng và tham quan tập trung trong Lào Cai, lấy Sa Pa làm điểm chính để làm tour.'),
(71,'vi','Nghỉ dưỡng Tràng An 3N2Đ','Tour nội địa tại Ninh Bình','Lịch trình nghỉ dưỡng và tham quan tập trung trong Ninh Bình, lấy Tràng An làm điểm chính để làm tour.'),
(72,'vi','Nghỉ dưỡng Đà Lạt 3N2Đ','Tour nội địa tại Lâm Đồng','Lịch trình nghỉ dưỡng và tham quan tập trung trong Lâm Đồng, lấy Đà Lạt làm điểm chính để làm tour.'),
(73,'vi','Nghỉ dưỡng Phú Quốc 3N2Đ','Tour nội địa tại An Giang','Lịch trình nghỉ dưỡng và tham quan tập trung trong An Giang, lấy Phú Quốc làm điểm chính để làm tour.'),
(74,'vi','Nghỉ dưỡng Bà Nà Hills 3N2Đ','Tour nội địa tại Đà Nẵng','Lịch trình nghỉ dưỡng và tham quan tập trung trong Đà Nẵng, lấy Bà Nà Hills làm điểm chính để làm tour.'),
(75,'vi','Nghỉ dưỡng Mũi Né 3N2Đ','Tour nội địa tại Lâm Đồng','Lịch trình nghỉ dưỡng và tham quan tập trung trong Lâm Đồng, lấy Mũi Né làm điểm chính để làm tour.'),
(76,'vi','Nghỉ dưỡng Côn Đảo 3N2Đ','Tour nội địa tại TP. Hồ Chí Minh','Lịch trình nghỉ dưỡng và tham quan tập trung trong TP. Hồ Chí Minh, lấy Côn Đảo làm điểm chính để làm tour.'),
(77,'vi','Nghỉ dưỡng Rừng tràm Trà Sư 3N2Đ','Tour nội địa tại An Giang','Lịch trình nghỉ dưỡng và tham quan tập trung trong An Giang, lấy Rừng tràm Trà Sư làm điểm chính để làm tour.'),
(78,'vi','Nghỉ dưỡng Mộc Châu 3N2Đ','Tour nội địa tại Sơn La','Lịch trình nghỉ dưỡng và tham quan tập trung trong Sơn La, lấy Mộc Châu làm điểm chính để làm tour.'),
(79,'vi','Nghỉ dưỡng Cao nguyên đá Đồng Văn 3N2Đ','Tour nội địa tại Tuyên Quang','Lịch trình nghỉ dưỡng và tham quan tập trung trong Tuyên Quang, lấy Cao nguyên đá Đồng Văn làm điểm chính để làm tour.'),
(80,'vi','Nghỉ dưỡng Nha Trang 3N2Đ','Tour nội địa tại Khánh Hòa','Lịch trình nghỉ dưỡng và tham quan tập trung trong Khánh Hòa, lấy Nha Trang làm điểm chính để làm tour.'),
(81,'vi','Xuyên Việt Di sản Bắc Bộ 6N','Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Hà Nội – Ninh Bình – Hạ Long – Sa Pa. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.'),
(82,'vi','Xuyên Việt Miền Trung Di sản 5N','Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Huế – Đà Nẵng – Hội An – Quảng Ngãi. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.'),
(83,'vi','Xuyên Việt Biển đảo phương Nam 7N','Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: TP.HCM – Côn Đảo – Phú Quốc – Cần Thơ. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.'),
(84,'vi','Đại vòng cung Tây Bắc 6N','Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Hà Nội – Mộc Châu – Điện Biên – Sa Pa. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.'),
(85,'vi','Cung đường Đông Bắc 5N','Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Cao Bằng – Lạng Sơn – Quảng Ninh. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.'),
(86,'vi','Tây Nguyên đại ngàn 5N','Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Đắk Lắk – Gia Lai – Lâm Đồng. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.'),
(87,'vi','Miền Tây sông nước 5N','Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Cần Thơ – Đồng Tháp – An Giang – Cà Mau. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.'),
(88,'vi','Hành trình biển miền Trung 6N','Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Thanh Hóa – Nghệ An – Hà Tĩnh – Huế – Đà Nẵng. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.'),
(89,'vi','Từ Sài Gòn ra Hà Nội 8N','Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: TP.HCM – Nha Trang – Đà Nẵng – Huế – Hà Nội. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.'),
(90,'vi','Việt Nam Grand Tour 10N','Tour xuyên Việt qua nhiều tỉnh/thành','Tour xuyên Việt đi qua nhiều tỉnh/thành: Hà Nội – Hạ Long – Huế – Đà Nẵng – Hội An – TP.HCM – Cần Thơ. Lịch trình có nhiều chặng di chuyển, phù hợp khách muốn trải nghiệm đa vùng miền.'),
(91,'vi','Hàn Quốc 4N – Khám phá Seoul','Tour quốc tế tại Hàn Quốc','Tour quốc tế tập trung trong Hàn Quốc, chọn Seoul làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(92,'vi','Hàn Quốc premium Busan 5N','Tour quốc tế cao cấp tại Hàn Quốc','Hành trình cao cấp khám phá Busan và các điểm nổi tiếng trong Hàn Quốc, phù hợp nhóm nhỏ hoặc gia đình.'),
(93,'vi','Nhật Bản 4N – Khám phá Tokyo','Tour quốc tế tại Nhật Bản','Tour quốc tế tập trung trong Nhật Bản, chọn Tokyo làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(94,'vi','Nhật Bản premium Kyoto 5N','Tour quốc tế cao cấp tại Nhật Bản','Hành trình cao cấp khám phá Kyoto và các điểm nổi tiếng trong Nhật Bản, phù hợp nhóm nhỏ hoặc gia đình.'),
(95,'vi','Thái Lan 4N – Khám phá Bangkok','Tour quốc tế tại Thái Lan','Tour quốc tế tập trung trong Thái Lan, chọn Bangkok làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(96,'vi','Thái Lan premium Phuket 5N','Tour quốc tế cao cấp tại Thái Lan','Hành trình cao cấp khám phá Phuket và các điểm nổi tiếng trong Thái Lan, phù hợp nhóm nhỏ hoặc gia đình.'),
(97,'vi','Singapore 4N – Khám phá Marina Bay Sands','Tour quốc tế tại Singapore','Tour quốc tế tập trung trong Singapore, chọn Marina Bay Sands làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(98,'vi','Malaysia 4N – Khám phá Kuala Lumpur','Tour quốc tế tại Malaysia','Tour quốc tế tập trung trong Malaysia, chọn Kuala Lumpur làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(99,'vi','Indonesia 4N – Khám phá Bali','Tour quốc tế tại Indonesia','Tour quốc tế tập trung trong Indonesia, chọn Bali làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(100,'vi','Trung Quốc 4N – Khám phá Beijing','Tour quốc tế tại Trung Quốc','Tour quốc tế tập trung trong Trung Quốc, chọn Beijing làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(101,'vi','Trung Quốc premium Shanghai 5N','Tour quốc tế cao cấp tại Trung Quốc','Hành trình cao cấp khám phá Shanghai và các điểm nổi tiếng trong Trung Quốc, phù hợp nhóm nhỏ hoặc gia đình.'),
(102,'vi','Đài Loan 4N – Khám phá Taipei','Tour quốc tế tại Đài Loan','Tour quốc tế tập trung trong Đài Loan, chọn Taipei làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(103,'vi','Hồng Kông 4N – Khám phá Victoria Peak','Tour quốc tế tại Hồng Kông','Tour quốc tế tập trung trong Hồng Kông, chọn Victoria Peak làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(104,'vi','Campuchia 4N – Khám phá Siem Reap','Tour quốc tế tại Campuchia','Tour quốc tế tập trung trong Campuchia, chọn Siem Reap làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(105,'vi','Lào 4N – Khám phá Luang Prabang','Tour quốc tế tại Lào','Tour quốc tế tập trung trong Lào, chọn Luang Prabang làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(106,'vi','Ấn Độ 4N – Khám phá New Delhi','Tour quốc tế tại Ấn Độ','Tour quốc tế tập trung trong Ấn Độ, chọn New Delhi làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(107,'vi','Ấn Độ premium Agra 5N','Tour quốc tế cao cấp tại Ấn Độ','Hành trình cao cấp khám phá Agra và các điểm nổi tiếng trong Ấn Độ, phù hợp nhóm nhỏ hoặc gia đình.'),
(108,'vi','Maldives 4N – Khám phá Male','Tour quốc tế tại Maldives','Tour quốc tế tập trung trong Maldives, chọn Male làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(109,'vi','UAE 4N – Khám phá Dubai','Tour quốc tế tại UAE','Tour quốc tế tập trung trong UAE, chọn Dubai làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(110,'vi','Thổ Nhĩ Kỳ 4N – Khám phá Istanbul','Tour quốc tế tại Thổ Nhĩ Kỳ','Tour quốc tế tập trung trong Thổ Nhĩ Kỳ, chọn Istanbul làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(111,'vi','Pháp 5N – Khám phá Paris','Tour quốc tế tại Pháp','Tour quốc tế tập trung trong Pháp, chọn Paris làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(112,'vi','Ý 5N – Khám phá Rome','Tour quốc tế tại Ý','Tour quốc tế tập trung trong Ý, chọn Rome làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(113,'vi','Ý premium Venice 5N','Tour quốc tế cao cấp tại Ý','Hành trình cao cấp khám phá Venice và các điểm nổi tiếng trong Ý, phù hợp nhóm nhỏ hoặc gia đình.'),
(114,'vi','Vương quốc Anh 5N – Khám phá London','Tour quốc tế tại Vương quốc Anh','Tour quốc tế tập trung trong Vương quốc Anh, chọn London làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(115,'vi','Tây Ban Nha 5N – Khám phá Madrid','Tour quốc tế tại Tây Ban Nha','Tour quốc tế tập trung trong Tây Ban Nha, chọn Madrid làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(116,'vi','Tây Ban Nha premium Barcelona 5N','Tour quốc tế cao cấp tại Tây Ban Nha','Hành trình cao cấp khám phá Barcelona và các điểm nổi tiếng trong Tây Ban Nha, phù hợp nhóm nhỏ hoặc gia đình.'),
(117,'vi','Đức 5N – Khám phá Berlin','Tour quốc tế tại Đức','Tour quốc tế tập trung trong Đức, chọn Berlin làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(118,'vi','Đức premium Munich 5N','Tour quốc tế cao cấp tại Đức','Hành trình cao cấp khám phá Munich và các điểm nổi tiếng trong Đức, phù hợp nhóm nhỏ hoặc gia đình.'),
(119,'vi','Hà Lan 5N – Khám phá Amsterdam','Tour quốc tế tại Hà Lan','Tour quốc tế tập trung trong Hà Lan, chọn Amsterdam làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(120,'vi','Thụy Sĩ 5N – Khám phá Zurich','Tour quốc tế tại Thụy Sĩ','Tour quốc tế tập trung trong Thụy Sĩ, chọn Zurich làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(121,'vi','Áo 5N – Khám phá Vienna','Tour quốc tế tại Áo','Tour quốc tế tập trung trong Áo, chọn Vienna làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(122,'vi','Séc 5N – Khám phá Prague','Tour quốc tế tại Séc','Tour quốc tế tập trung trong Séc, chọn Prague làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(123,'vi','Hy Lạp 5N – Khám phá Athens','Tour quốc tế tại Hy Lạp','Tour quốc tế tập trung trong Hy Lạp, chọn Athens làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(124,'vi','Bồ Đào Nha 5N – Khám phá Lisbon','Tour quốc tế tại Bồ Đào Nha','Tour quốc tế tập trung trong Bồ Đào Nha, chọn Lisbon làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(125,'vi','Phần Lan 5N – Khám phá Helsinki','Tour quốc tế tại Phần Lan','Tour quốc tế tập trung trong Phần Lan, chọn Helsinki làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(126,'vi','Na Uy 5N – Khám phá Oslo','Tour quốc tế tại Na Uy','Tour quốc tế tập trung trong Na Uy, chọn Oslo làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(127,'vi','Đan Mạch 5N – Khám phá Copenhagen','Tour quốc tế tại Đan Mạch','Tour quốc tế tập trung trong Đan Mạch, chọn Copenhagen làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(128,'vi','Iceland 5N – Khám phá Reykjavik','Tour quốc tế tại Iceland','Tour quốc tế tập trung trong Iceland, chọn Reykjavik làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(129,'vi','Ai Cập 5N – Khám phá Cairo','Tour quốc tế tại Ai Cập','Tour quốc tế tập trung trong Ai Cập, chọn Cairo làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(130,'vi','Nam Phi 5N – Khám phá Cape Town','Tour quốc tế tại Nam Phi','Tour quốc tế tập trung trong Nam Phi, chọn Cape Town làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(131,'vi','Ma-rốc 5N – Khám phá Marrakech','Tour quốc tế tại Ma-rốc','Tour quốc tế tập trung trong Ma-rốc, chọn Marrakech làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(132,'vi','Kenya 5N – Khám phá Nairobi','Tour quốc tế tại Kenya','Tour quốc tế tập trung trong Kenya, chọn Nairobi làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(133,'vi','Tanzania 5N – Khám phá Serengeti','Tour quốc tế tại Tanzania','Tour quốc tế tập trung trong Tanzania, chọn Serengeti làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(134,'vi','Hoa Kỳ 5N – Khám phá New York','Tour quốc tế tại Hoa Kỳ','Tour quốc tế tập trung trong Hoa Kỳ, chọn New York làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(135,'vi','Hoa Kỳ premium Los Angeles 5N','Tour quốc tế cao cấp tại Hoa Kỳ','Hành trình cao cấp khám phá Los Angeles và các điểm nổi tiếng trong Hoa Kỳ, phù hợp nhóm nhỏ hoặc gia đình.'),
(136,'vi','Canada 5N – Khám phá Toronto','Tour quốc tế tại Canada','Tour quốc tế tập trung trong Canada, chọn Toronto làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(137,'vi','Canada premium Vancouver 5N','Tour quốc tế cao cấp tại Canada','Hành trình cao cấp khám phá Vancouver và các điểm nổi tiếng trong Canada, phù hợp nhóm nhỏ hoặc gia đình.'),
(138,'vi','Mexico 5N – Khám phá Mexico City','Tour quốc tế tại Mexico','Tour quốc tế tập trung trong Mexico, chọn Mexico City làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(139,'vi','Brazil 5N – Khám phá Rio de Janeiro','Tour quốc tế tại Brazil','Tour quốc tế tập trung trong Brazil, chọn Rio de Janeiro làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(140,'vi','Argentina 5N – Khám phá Buenos Aires','Tour quốc tế tại Argentina','Tour quốc tế tập trung trong Argentina, chọn Buenos Aires làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(141,'vi','Peru 5N – Khám phá Lima','Tour quốc tế tại Peru','Tour quốc tế tập trung trong Peru, chọn Lima làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(142,'vi','Chile 5N – Khám phá Santiago','Tour quốc tế tại Chile','Tour quốc tế tập trung trong Chile, chọn Santiago làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(143,'vi','Úc 5N – Khám phá Sydney','Tour quốc tế tại Úc','Tour quốc tế tập trung trong Úc, chọn Sydney làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(144,'vi','Úc premium Melbourne 5N','Tour quốc tế cao cấp tại Úc','Hành trình cao cấp khám phá Melbourne và các điểm nổi tiếng trong Úc, phù hợp nhóm nhỏ hoặc gia đình.'),
(145,'vi','New Zealand 5N – Khám phá Auckland','Tour quốc tế tại New Zealand','Tour quốc tế tập trung trong New Zealand, chọn Auckland làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(146,'vi','New Zealand premium Queenstown 5N','Tour quốc tế cao cấp tại New Zealand','Hành trình cao cấp khám phá Queenstown và các điểm nổi tiếng trong New Zealand, phù hợp nhóm nhỏ hoặc gia đình.'),
(147,'vi','Fiji 5N – Khám phá Nadi','Tour quốc tế tại Fiji','Tour quốc tế tập trung trong Fiji, chọn Nadi làm điểm đến chính và kết hợp các trải nghiệm văn hóa, ẩm thực, mua sắm.'),
(148,'vi','Đông Bắc Á vàng son 7N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Seoul – Tokyo – Kyoto. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(149,'vi','Nhật Hàn mùa lá đỏ 8N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Osaka – Kyoto – Seoul – Busan. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(150,'vi','ASEAN city break 6N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Bangkok – Singapore – Kuala Lumpur. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(151,'vi','Hành trình Đông Dương 6N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Luang Prabang – Siem Reap – Bangkok. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(152,'vi','Châu Âu kinh điển 9N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Paris – Rome – Venice – Zurich. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(153,'vi','Tây Âu lãng mạn 7N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: London – Amsterdam – Paris. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(154,'vi','Nam Âu Địa Trung Hải 7N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Barcelona – Madrid – Lisbon. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(155,'vi','Bắc Âu & Iceland 8N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Copenhagen – Oslo – Reykjavik. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(156,'vi','Bờ Tây Hoa Kỳ 8N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Los Angeles – Las Vegas – San Francisco. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(157,'vi','Bắc Mỹ nổi bật 8N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: New York – Washington D.C. – Toronto. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(158,'vi','Úc New Zealand 10N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Sydney – Melbourne – Auckland – Queenstown. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(159,'vi','Nam Mỹ huyền thoại 10N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Rio de Janeiro – Buenos Aires – Cusco. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.'),
(160,'vi','Châu Phi di sản 10N','Tour quốc tế liên tuyến qua nhiều quốc gia','Tour đi qua nhiều thành phố/quốc gia: Cairo – Marrakech – Cape Town. Lịch trình thiết kế theo tuyến bay hoặc đường bộ, phù hợp khách muốn khám phá nhiều nước trong một hành trình.');

INSERT IGNORE INTO tour_departure_hubs (
    tour_id, city_code, city_name_vi, city_name_en, is_primary, sort_order
) VALUES
(1,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(1,'HAN','Hà Nội','Hanoi',FALSE,1),
(2,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(2,'HAN','Hà Nội','Hanoi',FALSE,1),
(3,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(3,'HAN','Hà Nội','Hanoi',FALSE,1),
(4,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(4,'HAN','Hà Nội','Hanoi',FALSE,1),
(5,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(5,'HAN','Hà Nội','Hanoi',FALSE,1),
(6,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(6,'HAN','Hà Nội','Hanoi',FALSE,1),
(7,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(7,'HAN','Hà Nội','Hanoi',FALSE,1),
(8,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(8,'HAN','Hà Nội','Hanoi',FALSE,1),
(9,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(9,'HAN','Hà Nội','Hanoi',FALSE,1),
(10,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(10,'HAN','Hà Nội','Hanoi',FALSE,1),
(11,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(11,'HAN','Hà Nội','Hanoi',FALSE,1),
(12,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(12,'HAN','Hà Nội','Hanoi',FALSE,1),
(13,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(13,'HAN','Hà Nội','Hanoi',FALSE,1),
(14,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(14,'HAN','Hà Nội','Hanoi',FALSE,1),
(15,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(15,'HAN','Hà Nội','Hanoi',FALSE,1),
(16,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(16,'HAN','Hà Nội','Hanoi',FALSE,1),
(17,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(17,'HAN','Hà Nội','Hanoi',FALSE,1),
(18,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(18,'HAN','Hà Nội','Hanoi',FALSE,1),
(19,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(19,'HAN','Hà Nội','Hanoi',FALSE,1),
(20,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(20,'HAN','Hà Nội','Hanoi',FALSE,1),
(21,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(21,'HAN','Hà Nội','Hanoi',FALSE,1),
(22,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(22,'HAN','Hà Nội','Hanoi',FALSE,1),
(23,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(23,'HAN','Hà Nội','Hanoi',FALSE,1),
(24,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(24,'HAN','Hà Nội','Hanoi',FALSE,1),
(25,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(25,'HAN','Hà Nội','Hanoi',FALSE,1),
(26,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(26,'HAN','Hà Nội','Hanoi',FALSE,1),
(27,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(27,'HAN','Hà Nội','Hanoi',FALSE,1),
(28,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(28,'HAN','Hà Nội','Hanoi',FALSE,1),
(29,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(29,'HAN','Hà Nội','Hanoi',FALSE,1),
(30,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(30,'HAN','Hà Nội','Hanoi',FALSE,1),
(31,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(31,'HAN','Hà Nội','Hanoi',FALSE,1),
(32,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(32,'HAN','Hà Nội','Hanoi',FALSE,1),
(33,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(33,'HAN','Hà Nội','Hanoi',FALSE,1),
(34,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(34,'HAN','Hà Nội','Hanoi',FALSE,1),
(35,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(35,'HAN','Hà Nội','Hanoi',FALSE,1),
(36,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(36,'HAN','Hà Nội','Hanoi',FALSE,1),
(37,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(37,'HAN','Hà Nội','Hanoi',FALSE,1),
(38,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(38,'HAN','Hà Nội','Hanoi',FALSE,1),
(39,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(39,'HAN','Hà Nội','Hanoi',FALSE,1),
(40,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(40,'HAN','Hà Nội','Hanoi',FALSE,1),
(41,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(41,'HAN','Hà Nội','Hanoi',FALSE,1),
(42,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(42,'HAN','Hà Nội','Hanoi',FALSE,1),
(43,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(43,'HAN','Hà Nội','Hanoi',FALSE,1),
(44,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(44,'HAN','Hà Nội','Hanoi',FALSE,1),
(45,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(45,'HAN','Hà Nội','Hanoi',FALSE,1),
(46,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(46,'HAN','Hà Nội','Hanoi',FALSE,1),
(47,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(47,'HAN','Hà Nội','Hanoi',FALSE,1),
(48,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(48,'HAN','Hà Nội','Hanoi',FALSE,1),
(49,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(49,'HAN','Hà Nội','Hanoi',FALSE,1),
(50,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(50,'HAN','Hà Nội','Hanoi',FALSE,1),
(51,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(51,'HAN','Hà Nội','Hanoi',FALSE,1),
(52,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(52,'HAN','Hà Nội','Hanoi',FALSE,1),
(53,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(53,'HAN','Hà Nội','Hanoi',FALSE,1),
(54,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(54,'HAN','Hà Nội','Hanoi',FALSE,1),
(55,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(55,'HAN','Hà Nội','Hanoi',FALSE,1),
(56,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(56,'HAN','Hà Nội','Hanoi',FALSE,1),
(57,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(57,'HAN','Hà Nội','Hanoi',FALSE,1),
(58,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(58,'HAN','Hà Nội','Hanoi',FALSE,1),
(59,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(59,'HAN','Hà Nội','Hanoi',FALSE,1),
(60,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(60,'HAN','Hà Nội','Hanoi',FALSE,1),
(61,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(61,'HAN','Hà Nội','Hanoi',FALSE,1),
(62,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(62,'HAN','Hà Nội','Hanoi',FALSE,1),
(63,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(63,'HAN','Hà Nội','Hanoi',FALSE,1),
(64,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(64,'HAN','Hà Nội','Hanoi',FALSE,1),
(65,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(65,'HAN','Hà Nội','Hanoi',FALSE,1),
(66,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(66,'HAN','Hà Nội','Hanoi',FALSE,1),
(67,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(67,'HAN','Hà Nội','Hanoi',FALSE,1),
(68,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(68,'HAN','Hà Nội','Hanoi',FALSE,1),
(69,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(69,'HAN','Hà Nội','Hanoi',FALSE,1),
(70,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(70,'HAN','Hà Nội','Hanoi',FALSE,1),
(71,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(71,'HAN','Hà Nội','Hanoi',FALSE,1),
(72,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(72,'HAN','Hà Nội','Hanoi',FALSE,1),
(73,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(73,'HAN','Hà Nội','Hanoi',FALSE,1),
(74,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(74,'HAN','Hà Nội','Hanoi',FALSE,1),
(75,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(75,'HAN','Hà Nội','Hanoi',FALSE,1),
(76,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(76,'HAN','Hà Nội','Hanoi',FALSE,1),
(77,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(77,'HAN','Hà Nội','Hanoi',FALSE,1),
(78,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(78,'HAN','Hà Nội','Hanoi',FALSE,1),
(79,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(79,'HAN','Hà Nội','Hanoi',FALSE,1),
(80,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(80,'HAN','Hà Nội','Hanoi',FALSE,1),
(81,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(81,'HAN','Hà Nội','Hanoi',FALSE,1),
(82,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(82,'HAN','Hà Nội','Hanoi',FALSE,1),
(83,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(83,'HAN','Hà Nội','Hanoi',FALSE,1),
(84,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(84,'HAN','Hà Nội','Hanoi',FALSE,1),
(85,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(85,'HAN','Hà Nội','Hanoi',FALSE,1),
(86,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(86,'HAN','Hà Nội','Hanoi',FALSE,1),
(87,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(87,'HAN','Hà Nội','Hanoi',FALSE,1),
(88,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(88,'HAN','Hà Nội','Hanoi',FALSE,1),
(89,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(89,'HAN','Hà Nội','Hanoi',FALSE,1),
(90,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(90,'HAN','Hà Nội','Hanoi',FALSE,1),
(91,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(92,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(93,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(94,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(95,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(96,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(97,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(98,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(99,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(100,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(101,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(102,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(103,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(104,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(105,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(106,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(107,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(108,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(109,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(110,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(111,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(112,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(113,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(114,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(115,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(116,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(117,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(118,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(119,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(120,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(121,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(122,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(123,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(124,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(125,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(126,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(127,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(128,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(129,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(130,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(131,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(132,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(133,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(134,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(135,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(136,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(137,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(138,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(139,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(140,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(141,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(142,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(143,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(144,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(145,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(146,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(147,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(148,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(149,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(150,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(151,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(152,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(153,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(154,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(155,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(156,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(157,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(158,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(159,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(160,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0);



INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT v.tour_id, tg.id
FROM (
    SELECT 1 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 1 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 1 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 2 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 2 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 2 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 3 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 3 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 3 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 4 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 4 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 4 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 5 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 5 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 5 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 6 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 6 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 6 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 7 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 7 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 7 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 8 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 8 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 8 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 9 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 9 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 9 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 10 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 10 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 10 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 11 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 11 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 11 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 12 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 12 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 12 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 13 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 13 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 13 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 14 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 14 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 14 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 15 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 15 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 15 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 16 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 16 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 16 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 17 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 17 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 17 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 18 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 18 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 18 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 19 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 19 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 19 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 20 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 20 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 20 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 21 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 21 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 21 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 22 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 22 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 22 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 23 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 23 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 23 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 24 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 24 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 24 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 25 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 25 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 25 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 26 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 26 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 26 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 27 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 27 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 27 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 28 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 28 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 28 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 29 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 29 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 29 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 30 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 30 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 30 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 31 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 31 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 31 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 32 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 32 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 32 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 33 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 33 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 33 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 34 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 34 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 34 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 35 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 35 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 35 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 36 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 36 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 36 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 37 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 37 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 37 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 38 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 38 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 38 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 39 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 39 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 39 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 40 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 40 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 40 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 41 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 41 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 41 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 42 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 42 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 42 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 43 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 43 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 43 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 44 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 44 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 44 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 45 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 45 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 45 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 46 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 46 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 46 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 47 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 47 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 47 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 48 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 48 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 48 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 49 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 49 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 49 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 50 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 50 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 50 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 51 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 51 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 51 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 52 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 52 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 52 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 53 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 53 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 53 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 54 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 54 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 54 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 55 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 55 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 55 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 56 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 56 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 56 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 57 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 57 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 57 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 58 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 58 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 58 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 59 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 59 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 59 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 60 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 60 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 60 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 61 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 61 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 61 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 62 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 62 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 62 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 63 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 63 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 63 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 64 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 64 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 64 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 65 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 65 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 65 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 66 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 66 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 66 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 67 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 67 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 67 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 68 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 68 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 68 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 69 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 69 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 69 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 70 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 70 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 70 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 71 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 71 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 71 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 72 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 72 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 72 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 73 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 73 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 73 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 74 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 74 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 74 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 75 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 75 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 75 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 76 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 76 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 76 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 77 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 77 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 77 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 78 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 78 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 78 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 79 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 79 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 79 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 80 AS tour_id, 'THANH_PHO' AS tag_code
    UNION ALL
    SELECT 80 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 80 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 81 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 81 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 81 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 82 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 82 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 82 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 83 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 83 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 83 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 84 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 84 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 84 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 85 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 85 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 85 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 86 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 86 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 86 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 87 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 87 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 87 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 88 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 88 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 88 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 89 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 89 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 89 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 90 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 90 AS tour_id, 'VAN_HOA' AS tag_code
    UNION ALL
    SELECT 90 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 91 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 91 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 91 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 92 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 92 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 92 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 93 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 93 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 93 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 94 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 94 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 94 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 95 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 95 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 95 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 96 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 96 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 96 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 97 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 97 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 97 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 98 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 98 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 98 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 99 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 99 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 99 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 100 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 100 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 100 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 101 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 101 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 101 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 102 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 102 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 102 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 103 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 103 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 103 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 104 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 104 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 104 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 105 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 105 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 105 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 106 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 106 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 106 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 107 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 107 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 107 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 108 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 108 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 108 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 109 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 109 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 109 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 110 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 110 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 110 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 111 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 111 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 111 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 112 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 112 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 112 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 113 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 113 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 113 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 114 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 114 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 114 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 115 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 115 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 115 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 116 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 116 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 116 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 117 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 117 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 117 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 118 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 118 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 118 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 119 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 119 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 119 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 120 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 120 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 120 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 121 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 121 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 121 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 122 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 122 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 122 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 123 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 123 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 123 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 124 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 124 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 124 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 125 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 125 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 125 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 126 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 126 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 126 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 127 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 127 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 127 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 128 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 128 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 128 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 129 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 129 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 129 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 130 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 130 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 130 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 131 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 131 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 131 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 132 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 132 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 132 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 133 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 133 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 133 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 134 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 134 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 134 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 135 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 135 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 135 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 136 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 136 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 136 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 137 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 137 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 137 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 138 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 138 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 138 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 139 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 139 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 139 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 140 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 140 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 140 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 141 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 141 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 141 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 142 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 142 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 142 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 143 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 143 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 143 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 144 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 144 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 144 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 145 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 145 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 145 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 146 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 146 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 146 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 147 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 147 AS tour_id, 'MUA_SAM' AS tag_code
    UNION ALL
    SELECT 147 AS tour_id, 'AM_THUC' AS tag_code
    UNION ALL
    SELECT 148 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 148 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 148 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 149 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 149 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 149 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 150 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 150 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 150 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 151 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 151 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 151 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 152 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 152 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 152 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 153 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 153 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 153 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 154 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 154 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 154 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 155 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 155 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 155 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 156 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 156 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 156 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 157 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 157 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 157 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 158 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 158 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 158 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 159 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 159 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 159 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
    UNION ALL
    SELECT 160 AS tour_id, 'ROADTRIP' AS tag_code
    UNION ALL
    SELECT 160 AS tour_id, 'HOME_HOT_INTL' AS tag_code
    UNION ALL
    SELECT 160 AS tour_id, 'THOI_GIAN_DAI' AS tag_code
) v
JOIN tags tg ON tg.code = v.tag_code;

INSERT IGNORE INTO tour_combo_packages (
    tour_id, combo_id, package_role, is_default, sort_order
) VALUES
(1,6,'optional',FALSE,1),
(5,6,'optional',FALSE,1),
(16,6,'optional',FALSE,1),
(19,6,'optional',FALSE,1),
(41,6,'optional',FALSE,1),
(46,6,'optional',FALSE,1),
(50,6,'optional',FALSE,1),
(63,6,'optional',FALSE,1),
(78,6,'optional',FALSE,1),
(89,6,'optional',FALSE,1),
(91,6,'optional',FALSE,1),
(94,6,'optional',FALSE,1),
(96,6,'optional',FALSE,1);



INSERT IGNORE INTO vehicles (
    id, supplier_id, code, vehicle_type, plate_no, seat_capacity, brand_name, model_name, status
) VALUES
(1,1,'VEH-DN-001','van','43A-123.45',16,'Ford','Transit','active');


-- CUỐI V7: Đồng bộ booked_seats từ booking thực tế (sau mọi seed)
UPDATE tour_schedules s
LEFT JOIN (
    SELECT
        b.schedule_id,
        COALESCE(SUM(b.adults + b.children + b.seniors), 0) AS occupied
    FROM bookings b
    WHERE b.status IN ('pending_payment', 'confirmed', 'checked_in', 'completed')
    GROUP BY b.schedule_id
) occ ON occ.schedule_id = s.id
SET s.booked_seats = COALESCE(occ.occupied, 0)
WHERE s.deleted_at IS NULL;


-- Đóng đợt đã full (chỉ đợt OPEN tương lai)
UPDATE tour_schedules s
SET s.status = 'full'
WHERE s.deleted_at IS NULL
  AND s.status = 'open'
  AND s.capacity_total > 0
  AND s.booked_seats >= s.capacity_total
  AND s.departure_at > NOW();


-- Mở lại đợt bị full nhầm khi còn chỗ
UPDATE tour_schedules s
SET s.status = 'open'
WHERE s.deleted_at IS NULL
  AND s.status = 'full'
  AND s.capacity_total > 0
  AND s.booked_seats < s.capacity_total
  AND s.departure_at > NOW();





-- ============================================================
-- 06B_SCHEDULES_REBUILT - Lịch tour đồng bộ với tour mới
-- schedule_id = tour_id + 4 để giữ booking seed cũ tour_id=1/schedule_id=5 không bị lệch.
-- ============================================================

INSERT IGNORE INTO tour_schedules (
    id, schedule_code, tour_id, departure_at, return_at, status, capacity_total, booked_seats, adult_price, child_price, infant_price, senior_price, booking_open_at, booking_close_at, meeting_point_name, note
) VALUES
(5,'SCH_TOUR_LOCAL_VN_001_2026_001',1,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(6,'SCH_TOUR_LOCAL_VN_002_2026_001',2,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(7,'SCH_TOUR_LOCAL_VN_003_2026_001',3,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(8,'SCH_TOUR_LOCAL_VN_004_2026_001',4,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(9,'SCH_TOUR_LOCAL_VN_005_2026_001',5,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(10,'SCH_TOUR_LOCAL_VN_006_2026_001',6,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(11,'SCH_TOUR_LOCAL_VN_007_2026_001',7,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(12,'SCH_TOUR_LOCAL_VN_008_2026_001',8,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(13,'SCH_TOUR_LOCAL_VN_009_2026_001',9,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(14,'SCH_TOUR_LOCAL_VN_010_2026_001',10,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(15,'SCH_TOUR_LOCAL_VN_011_2026_001',11,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(16,'SCH_TOUR_LOCAL_VN_012_2026_001',12,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(17,'SCH_TOUR_LOCAL_VN_013_2026_001',13,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(18,'SCH_TOUR_LOCAL_VN_014_2026_001',14,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(19,'SCH_TOUR_LOCAL_VN_015_2026_001',15,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(20,'SCH_TOUR_LOCAL_VN_016_2026_001',16,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 23 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(21,'SCH_TOUR_LOCAL_VN_017_2026_001',17,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 23 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(22,'SCH_TOUR_LOCAL_VN_018_2026_001',18,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(23,'SCH_TOUR_LOCAL_VN_019_2026_001',19,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(24,'SCH_TOUR_LOCAL_VN_020_2026_001',20,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 27 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(25,'SCH_TOUR_LOCAL_VN_021_2026_001',21,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 27 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(26,'SCH_TOUR_LOCAL_VN_022_2026_001',22,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 29 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(27,'SCH_TOUR_LOCAL_VN_023_2026_001',23,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 29 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(28,'SCH_TOUR_LOCAL_VN_024_2026_001',24,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 31 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(29,'SCH_TOUR_LOCAL_VN_025_2026_001',25,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 31 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(30,'SCH_TOUR_LOCAL_VN_026_2026_001',26,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 33 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(31,'SCH_TOUR_LOCAL_VN_027_2026_001',27,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 33 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(32,'SCH_TOUR_LOCAL_VN_028_2026_001',28,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(33,'SCH_TOUR_LOCAL_VN_029_2026_001',29,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(34,'SCH_TOUR_LOCAL_VN_030_2026_001',30,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 37 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(35,'SCH_TOUR_LOCAL_VN_031_2026_001',31,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 37 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(36,'SCH_TOUR_LOCAL_VN_032_2026_001',32,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 39 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(37,'SCH_TOUR_LOCAL_VN_033_2026_001',33,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 39 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(38,'SCH_TOUR_LOCAL_VN_034_2026_001',34,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 41 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(39,'SCH_TOUR_LOCAL_VN_035_2026_001',35,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 41 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(40,'SCH_TOUR_LOCAL_VN_036_2026_001',36,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 43 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 44 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(41,'SCH_TOUR_LOCAL_VN_037_2026_001',37,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 44 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 44 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 43 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(42,'SCH_TOUR_LOCAL_VN_038_2026_001',38,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 44 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(43,'SCH_TOUR_LOCAL_VN_039_2026_001',39,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(44,'SCH_TOUR_LOCAL_VN_040_2026_001',40,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 47 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(45,'SCH_TOUR_LOCAL_VN_041_2026_001',41,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 47 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(46,'SCH_TOUR_LOCAL_VN_042_2026_001',42,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 49 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(47,'SCH_TOUR_LOCAL_VN_043_2026_001',43,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 49 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(48,'SCH_TOUR_LOCAL_VN_044_2026_001',44,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 51 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 52 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(49,'SCH_TOUR_LOCAL_VN_045_2026_001',45,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 52 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 52 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 51 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(50,'SCH_TOUR_LOCAL_VN_046_2026_001',46,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 54 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 52 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(51,'SCH_TOUR_LOCAL_VN_047_2026_001',47,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 54 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 54 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(52,'SCH_TOUR_LOCAL_VN_048_2026_001',48,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 56 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 54 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(53,'SCH_TOUR_LOCAL_VN_049_2026_001',49,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 56 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 56 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(54,'SCH_TOUR_LOCAL_VN_050_2026_001',50,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(55,'SCH_TOUR_LOCAL_VN_051_2026_001',51,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(56,'SCH_TOUR_LOCAL_VN_052_2026_001',52,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(57,'SCH_TOUR_LOCAL_VN_053_2026_001',53,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(58,'SCH_TOUR_LOCAL_VN_054_2026_001',54,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(59,'SCH_TOUR_LOCAL_VN_055_2026_001',55,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(60,'SCH_TOUR_LOCAL_VN_056_2026_001',56,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(61,'SCH_TOUR_LOCAL_VN_057_2026_001',57,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(62,'SCH_TOUR_LOCAL_VN_058_2026_001',58,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(63,'SCH_TOUR_LOCAL_VN_059_2026_001',59,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(64,'SCH_TOUR_LOCAL_VN_060_2026_001',60,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(65,'SCH_TOUR_LOCAL_VN_061_2026_001',61,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(66,'SCH_TOUR_LOCAL_VN_062_2026_001',62,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(67,'SCH_TOUR_LOCAL_VN_063_2026_001',63,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(68,'SCH_TOUR_LOCAL_VN_064_2026_001',64,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(69,'SCH_TOUR_LOCAL_VN_065_2026_001',65,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(70,'SCH_TOUR_LOCAL_VN_066_2026_001',66,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 23 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(71,'SCH_TOUR_LOCAL_VN_067_2026_001',67,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),'open',30,0,900000,675000,0,810000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 23 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(72,'SCH_TOUR_LOCAL_VN_068_2026_001',68,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),'open',30,0,1800000,1350000,0,1620000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(73,'SCH_TOUR_LOCAL_VN_069_2026_001',69,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(74,'SCH_TOUR_LOCAL_VN_070_2026_001',70,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 27 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 29 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(75,'SCH_TOUR_LOCAL_VN_071_2026_001',71,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 27 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(76,'SCH_TOUR_LOCAL_VN_072_2026_001',72,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 29 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 31 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(77,'SCH_TOUR_LOCAL_VN_073_2026_001',73,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 29 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(78,'SCH_TOUR_LOCAL_VN_074_2026_001',74,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 31 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 33 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(79,'SCH_TOUR_LOCAL_VN_075_2026_001',75,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 31 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(80,'SCH_TOUR_LOCAL_VN_076_2026_001',76,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 33 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(81,'SCH_TOUR_LOCAL_VN_077_2026_001',77,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 33 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(82,'SCH_TOUR_LOCAL_VN_078_2026_001',78,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 37 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(83,'SCH_TOUR_LOCAL_VN_079_2026_001',79,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(84,'SCH_TOUR_LOCAL_VN_080_2026_001',80,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 37 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 39 DAY),'open',12,0,3780000,2835000,0,3402000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(85,'SCH_TOUR_TRANS_VN_081_2026_001',81,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 43 DAY),'open',30,0,7560000,5670000,0,6804000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 37 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(86,'SCH_TOUR_TRANS_VN_082_2026_001',82,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 39 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 43 DAY),'open',30,0,6300000,4725000,0,5670000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(87,'SCH_TOUR_TRANS_VN_083_2026_001',83,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),'open',30,0,8820000,6615000,0,7938000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 39 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(88,'SCH_TOUR_TRANS_VN_084_2026_001',84,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 41 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),'open',30,0,7560000,5670000,0,6804000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(89,'SCH_TOUR_TRANS_VN_085_2026_001',85,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),'open',30,0,6300000,4725000,0,5670000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 41 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(90,'SCH_TOUR_TRANS_VN_086_2026_001',86,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 43 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 47 DAY),'open',30,0,6300000,4725000,0,5670000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(91,'SCH_TOUR_TRANS_VN_087_2026_001',87,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 44 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),'open',30,0,6300000,4725000,0,5670000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 43 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(92,'SCH_TOUR_TRANS_VN_088_2026_001',88,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 DAY),'open',30,0,7560000,5670000,0,6804000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 44 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(93,'SCH_TOUR_TRANS_VN_089_2026_001',89,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),'open',30,0,10080000,7560000,0,9072000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(94,'SCH_TOUR_TRANS_VN_090_2026_001',90,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 47 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 56 DAY),'open',30,0,12600000,9450000,0,11340000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(95,'SCH_TOUR_FOREIGN_LOCAL_091_2026_001',91,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 51 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 47 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(96,'SCH_TOUR_FOREIGN_LOCAL_092_2026_001',92,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 49 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(97,'SCH_TOUR_FOREIGN_LOCAL_093_2026_001',93,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 49 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(98,'SCH_TOUR_FOREIGN_LOCAL_094_2026_001',94,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 51 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(99,'SCH_TOUR_FOREIGN_LOCAL_095_2026_001',95,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 52 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 51 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(100,'SCH_TOUR_FOREIGN_LOCAL_096_2026_001',96,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 57 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 52 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(101,'SCH_TOUR_FOREIGN_LOCAL_097_2026_001',97,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 54 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 57 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(102,'SCH_TOUR_FOREIGN_LOCAL_098_2026_001',98,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 58 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 54 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(103,'SCH_TOUR_FOREIGN_LOCAL_099_2026_001',99,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 56 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 59 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(104,'SCH_TOUR_FOREIGN_LOCAL_100_2026_001',100,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(105,'SCH_TOUR_FOREIGN_LOCAL_101_2026_001',101,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(106,'SCH_TOUR_FOREIGN_LOCAL_102_2026_001',102,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(107,'SCH_TOUR_FOREIGN_LOCAL_103_2026_001',103,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(108,'SCH_TOUR_FOREIGN_LOCAL_104_2026_001',104,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(109,'SCH_TOUR_FOREIGN_LOCAL_105_2026_001',105,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(110,'SCH_TOUR_FOREIGN_LOCAL_106_2026_001',106,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(111,'SCH_TOUR_FOREIGN_LOCAL_107_2026_001',107,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(112,'SCH_TOUR_FOREIGN_LOCAL_108_2026_001',108,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(113,'SCH_TOUR_FOREIGN_LOCAL_109_2026_001',109,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(114,'SCH_TOUR_FOREIGN_LOCAL_110_2026_001',110,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),'open',30,0,14000000,10500000,0,12600000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(115,'SCH_TOUR_FOREIGN_LOCAL_111_2026_001',111,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(116,'SCH_TOUR_FOREIGN_LOCAL_112_2026_001',112,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 23 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(117,'SCH_TOUR_FOREIGN_LOCAL_113_2026_001',113,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(118,'SCH_TOUR_FOREIGN_LOCAL_114_2026_001',114,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(119,'SCH_TOUR_FOREIGN_LOCAL_115_2026_001',115,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(120,'SCH_TOUR_FOREIGN_LOCAL_116_2026_001',116,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 23 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 27 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(121,'SCH_TOUR_FOREIGN_LOCAL_117_2026_001',117,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 23 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(122,'SCH_TOUR_FOREIGN_LOCAL_118_2026_001',118,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 29 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(123,'SCH_TOUR_FOREIGN_LOCAL_119_2026_001',119,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(124,'SCH_TOUR_FOREIGN_LOCAL_120_2026_001',120,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 27 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 31 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(125,'SCH_TOUR_FOREIGN_LOCAL_121_2026_001',121,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 27 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(126,'SCH_TOUR_FOREIGN_LOCAL_122_2026_001',122,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 29 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 33 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(127,'SCH_TOUR_FOREIGN_LOCAL_123_2026_001',123,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 29 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(128,'SCH_TOUR_FOREIGN_LOCAL_124_2026_001',124,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 31 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(129,'SCH_TOUR_FOREIGN_LOCAL_125_2026_001',125,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 31 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(130,'SCH_TOUR_FOREIGN_LOCAL_126_2026_001',126,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 33 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 37 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(131,'SCH_TOUR_FOREIGN_LOCAL_127_2026_001',127,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 33 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(132,'SCH_TOUR_FOREIGN_LOCAL_128_2026_001',128,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 39 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(133,'SCH_TOUR_FOREIGN_LOCAL_129_2026_001',129,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(134,'SCH_TOUR_FOREIGN_LOCAL_130_2026_001',130,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 37 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 41 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(135,'SCH_TOUR_FOREIGN_LOCAL_131_2026_001',131,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 37 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(136,'SCH_TOUR_FOREIGN_LOCAL_132_2026_001',132,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 39 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 43 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(137,'SCH_TOUR_FOREIGN_LOCAL_133_2026_001',133,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 44 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 39 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(138,'SCH_TOUR_FOREIGN_LOCAL_134_2026_001',134,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 41 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(139,'SCH_TOUR_FOREIGN_LOCAL_135_2026_001',135,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 41 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(140,'SCH_TOUR_FOREIGN_LOCAL_136_2026_001',136,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 43 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 47 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(141,'SCH_TOUR_FOREIGN_LOCAL_137_2026_001',137,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 44 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 43 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(142,'SCH_TOUR_FOREIGN_LOCAL_138_2026_001',138,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 49 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 44 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(143,'SCH_TOUR_FOREIGN_LOCAL_139_2026_001',139,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(144,'SCH_TOUR_FOREIGN_LOCAL_140_2026_001',140,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 47 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 51 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 46 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(145,'SCH_TOUR_FOREIGN_LOCAL_141_2026_001',141,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 52 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 47 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(146,'SCH_TOUR_FOREIGN_LOCAL_142_2026_001',142,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 49 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(147,'SCH_TOUR_FOREIGN_LOCAL_143_2026_001',143,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 54 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 49 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(148,'SCH_TOUR_FOREIGN_LOCAL_144_2026_001',144,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 51 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(149,'SCH_TOUR_FOREIGN_LOCAL_145_2026_001',145,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 52 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 56 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 51 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(150,'SCH_TOUR_FOREIGN_LOCAL_146_2026_001',146,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 57 DAY),'open',12,0,24500000,18375000,0,22050000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 52 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(151,'SCH_TOUR_FOREIGN_LOCAL_147_2026_001',147,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 54 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 58 DAY),'open',30,0,17500000,13125000,0,15750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 53 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(152,'SCH_TOUR_MULTI_COUNTRY_148_2026_001',148,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 61 DAY),'open',30,0,34300000,25725000,0,30870000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 54 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(153,'SCH_TOUR_MULTI_COUNTRY_149_2026_001',149,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 56 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 63 DAY),'open',30,0,39200000,29400000,0,35280000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(154,'SCH_TOUR_MULTI_COUNTRY_150_2026_001',150,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'open',30,0,29400000,22050000,0,26460000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(155,'SCH_TOUR_MULTI_COUNTRY_151_2026_001',151,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),'open',30,0,29400000,22050000,0,26460000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(156,'SCH_TOUR_MULTI_COUNTRY_152_2026_001',152,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY),'open',30,0,44100000,33075000,0,39690000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(157,'SCH_TOUR_MULTI_COUNTRY_153_2026_001',153,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'open',30,0,34300000,25725000,0,30870000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(158,'SCH_TOUR_MULTI_COUNTRY_154_2026_001',154,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY),'open',30,0,34300000,25725000,0,30870000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(159,'SCH_TOUR_MULTI_COUNTRY_155_2026_001',155,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),'open',30,0,39200000,29400000,0,35280000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(160,'SCH_TOUR_MULTI_COUNTRY_156_2026_001',156,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),'open',30,0,39200000,29400000,0,35280000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(161,'SCH_TOUR_MULTI_COUNTRY_157_2026_001',157,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),'open',30,0,39200000,29400000,0,35280000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(162,'SCH_TOUR_MULTI_COUNTRY_158_2026_001',158,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),'open',30,0,49000000,36750000,0,44100000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(163,'SCH_TOUR_MULTI_COUNTRY_159_2026_001',159,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),'open',30,0,49000000,36750000,0,44100000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới'),
(164,'SCH_TOUR_MULTI_COUNTRY_160_2026_001',160,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),'open',30,0,49000000,36750000,0,44100000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'Điểm hẹn trung tâm','Lịch seed đồng bộ với tour mới');

INSERT IGNORE INTO tour_schedule_pickup_points (
    schedule_id, point_name, address, sort_order
) VALUES (5,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(6,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(7,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(8,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(9,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(10,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(11,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(12,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(13,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(14,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(15,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(16,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(17,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(18,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(19,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(20,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(21,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(22,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(23,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(24,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(25,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(26,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(27,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(28,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(29,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(30,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(31,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(32,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(33,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(34,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(35,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(36,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(37,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(38,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(39,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(40,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(41,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(42,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(43,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(44,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(45,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(46,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(47,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(48,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(49,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(50,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(51,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(52,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(53,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(54,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(55,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(56,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(57,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(58,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(59,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(60,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(61,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(62,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(63,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(64,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(65,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(66,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(67,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(68,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(69,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(70,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(71,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(72,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(73,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(74,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(75,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(76,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(77,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(78,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(79,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(80,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(81,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(82,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(83,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(84,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(85,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(86,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(87,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(88,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(89,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(90,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(91,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(92,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(93,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(94,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(95,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(96,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(97,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(98,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(99,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(100,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(101,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(102,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(103,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(104,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(105,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(106,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(107,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(108,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(109,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(110,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(111,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(112,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(113,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(114,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(115,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(116,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(117,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(118,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(119,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(120,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(121,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(122,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(123,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(124,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(125,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(126,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(127,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(128,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(129,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(130,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(131,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(132,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(133,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(134,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(135,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(136,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(137,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(138,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(139,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(140,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(141,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(142,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(143,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(144,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(145,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(146,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(147,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(148,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(149,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(150,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(151,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(152,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(153,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(154,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(155,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(156,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(157,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(158,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(159,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(160,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(161,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(162,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(163,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0),
(164,'Điểm hẹn trung tâm','Liên hệ trước ngày khởi hành',0);

INSERT IGNORE INTO tour_schedule_guides (
    schedule_id, guide_id, guide_role
) VALUES (5,1,'lead'),
(6,1,'lead'),
(7,1,'lead'),
(8,1,'lead'),
(9,1,'lead'),
(10,1,'lead'),
(11,1,'lead'),
(12,1,'lead'),
(13,1,'lead'),
(14,1,'lead'),
(15,1,'lead'),
(16,1,'lead'),
(17,1,'lead'),
(18,1,'lead'),
(19,1,'lead'),
(20,1,'lead'),
(21,1,'lead'),
(22,1,'lead'),
(23,1,'lead'),
(24,1,'lead'),
(25,1,'lead'),
(26,1,'lead'),
(27,1,'lead'),
(28,1,'lead'),
(29,1,'lead'),
(30,1,'lead'),
(31,1,'lead'),
(32,1,'lead'),
(33,1,'lead'),
(34,1,'lead'),
(35,1,'lead'),
(36,1,'lead'),
(37,1,'lead'),
(38,1,'lead'),
(39,1,'lead'),
(40,1,'lead'),
(41,1,'lead'),
(42,1,'lead'),
(43,1,'lead'),
(44,1,'lead'),
(45,1,'lead'),
(46,1,'lead'),
(47,1,'lead'),
(48,1,'lead'),
(49,1,'lead'),
(50,1,'lead'),
(51,1,'lead'),
(52,1,'lead'),
(53,1,'lead'),
(54,1,'lead'),
(55,1,'lead'),
(56,1,'lead'),
(57,1,'lead'),
(58,1,'lead'),
(59,1,'lead'),
(60,1,'lead'),
(61,1,'lead'),
(62,1,'lead'),
(63,1,'lead'),
(64,1,'lead'),
(65,1,'lead'),
(66,1,'lead'),
(67,1,'lead'),
(68,1,'lead'),
(69,1,'lead'),
(70,1,'lead'),
(71,1,'lead'),
(72,1,'lead'),
(73,1,'lead'),
(74,1,'lead'),
(75,1,'lead'),
(76,1,'lead'),
(77,1,'lead'),
(78,1,'lead'),
(79,1,'lead'),
(80,1,'lead'),
(81,1,'lead'),
(82,1,'lead'),
(83,1,'lead'),
(84,1,'lead'),
(85,1,'lead'),
(86,1,'lead'),
(87,1,'lead'),
(88,1,'lead'),
(89,1,'lead'),
(90,1,'lead'),
(91,1,'lead'),
(92,1,'lead'),
(93,1,'lead'),
(94,1,'lead'),
(95,1,'lead'),
(96,1,'lead'),
(97,1,'lead'),
(98,1,'lead'),
(99,1,'lead'),
(100,1,'lead'),
(101,1,'lead'),
(102,1,'lead'),
(103,1,'lead'),
(104,1,'lead'),
(105,1,'lead'),
(106,1,'lead'),
(107,1,'lead'),
(108,1,'lead'),
(109,1,'lead'),
(110,1,'lead'),
(111,1,'lead'),
(112,1,'lead'),
(113,1,'lead'),
(114,1,'lead'),
(115,1,'lead'),
(116,1,'lead'),
(117,1,'lead'),
(118,1,'lead'),
(119,1,'lead'),
(120,1,'lead'),
(121,1,'lead'),
(122,1,'lead'),
(123,1,'lead'),
(124,1,'lead'),
(125,1,'lead'),
(126,1,'lead'),
(127,1,'lead'),
(128,1,'lead'),
(129,1,'lead'),
(130,1,'lead'),
(131,1,'lead'),
(132,1,'lead'),
(133,1,'lead'),
(134,1,'lead'),
(135,1,'lead'),
(136,1,'lead'),
(137,1,'lead'),
(138,1,'lead'),
(139,1,'lead'),
(140,1,'lead'),
(141,1,'lead'),
(142,1,'lead'),
(143,1,'lead'),
(144,1,'lead'),
(145,1,'lead'),
(146,1,'lead'),
(147,1,'lead'),
(148,1,'lead'),
(149,1,'lead'),
(150,1,'lead'),
(151,1,'lead'),
(152,1,'lead'),
(153,1,'lead'),
(154,1,'lead'),
(155,1,'lead'),
(156,1,'lead'),
(157,1,'lead'),
(158,1,'lead'),
(159,1,'lead'),
(160,1,'lead'),
(161,1,'lead'),
(162,1,'lead'),
(163,1,'lead'),
(164,1,'lead');





INSERT IGNORE INTO tour_schedule_status_history (
    schedule_id, old_status, new_status, changed_by, note
) VALUES
(5,'draft','open','system','Tạo lịch khởi hành seed'),
(6,'draft','open','system','Tạo lịch khởi hành seed'),
(7,'draft','open','system','Tạo lịch khởi hành seed'),
(8,'draft','open','system','Tạo lịch khởi hành seed'),
(9,'draft','open','system','Tạo lịch khởi hành seed'),
(10,'draft','open','system','Tạo lịch khởi hành seed'),
(11,'draft','open','system','Tạo lịch khởi hành seed'),
(12,'draft','open','system','Tạo lịch khởi hành seed'),
(13,'draft','open','system','Tạo lịch khởi hành seed'),
(14,'draft','open','system','Tạo lịch khởi hành seed'),
(15,'draft','open','system','Tạo lịch khởi hành seed'),
(16,'draft','open','system','Tạo lịch khởi hành seed'),
(17,'draft','open','system','Tạo lịch khởi hành seed'),
(18,'draft','open','system','Tạo lịch khởi hành seed'),
(19,'draft','open','system','Tạo lịch khởi hành seed'),
(20,'draft','open','system','Tạo lịch khởi hành seed'),
(21,'draft','open','system','Tạo lịch khởi hành seed'),
(22,'draft','open','system','Tạo lịch khởi hành seed'),
(23,'draft','open','system','Tạo lịch khởi hành seed'),
(24,'draft','open','system','Tạo lịch khởi hành seed'),
(25,'draft','open','system','Tạo lịch khởi hành seed'),
(26,'draft','open','system','Tạo lịch khởi hành seed'),
(27,'draft','open','system','Tạo lịch khởi hành seed'),
(28,'draft','open','system','Tạo lịch khởi hành seed'),
(29,'draft','open','system','Tạo lịch khởi hành seed'),
(30,'draft','open','system','Tạo lịch khởi hành seed'),
(31,'draft','open','system','Tạo lịch khởi hành seed'),
(32,'draft','open','system','Tạo lịch khởi hành seed'),
(33,'draft','open','system','Tạo lịch khởi hành seed'),
(34,'draft','open','system','Tạo lịch khởi hành seed'),
(35,'draft','open','system','Tạo lịch khởi hành seed'),
(36,'draft','open','system','Tạo lịch khởi hành seed'),
(37,'draft','open','system','Tạo lịch khởi hành seed'),
(38,'draft','open','system','Tạo lịch khởi hành seed'),
(39,'draft','open','system','Tạo lịch khởi hành seed'),
(40,'draft','open','system','Tạo lịch khởi hành seed'),
(41,'draft','open','system','Tạo lịch khởi hành seed'),
(42,'draft','open','system','Tạo lịch khởi hành seed'),
(43,'draft','open','system','Tạo lịch khởi hành seed'),
(44,'draft','open','system','Tạo lịch khởi hành seed'),
(45,'draft','open','system','Tạo lịch khởi hành seed'),
(46,'draft','open','system','Tạo lịch khởi hành seed'),
(47,'draft','open','system','Tạo lịch khởi hành seed'),
(48,'draft','open','system','Tạo lịch khởi hành seed'),
(49,'draft','open','system','Tạo lịch khởi hành seed'),
(50,'draft','open','system','Tạo lịch khởi hành seed'),
(51,'draft','open','system','Tạo lịch khởi hành seed'),
(52,'draft','open','system','Tạo lịch khởi hành seed'),
(53,'draft','open','system','Tạo lịch khởi hành seed'),
(54,'draft','open','system','Tạo lịch khởi hành seed'),
(55,'draft','open','system','Tạo lịch khởi hành seed'),
(56,'draft','open','system','Tạo lịch khởi hành seed'),
(57,'draft','open','system','Tạo lịch khởi hành seed'),
(58,'draft','open','system','Tạo lịch khởi hành seed'),
(59,'draft','open','system','Tạo lịch khởi hành seed'),
(60,'draft','open','system','Tạo lịch khởi hành seed'),
(61,'draft','open','system','Tạo lịch khởi hành seed'),
(62,'draft','open','system','Tạo lịch khởi hành seed'),
(63,'draft','open','system','Tạo lịch khởi hành seed'),
(64,'draft','open','system','Tạo lịch khởi hành seed'),
(65,'draft','open','system','Tạo lịch khởi hành seed'),
(66,'draft','open','system','Tạo lịch khởi hành seed'),
(67,'draft','open','system','Tạo lịch khởi hành seed'),
(68,'draft','open','system','Tạo lịch khởi hành seed'),
(69,'draft','open','system','Tạo lịch khởi hành seed'),
(70,'draft','open','system','Tạo lịch khởi hành seed'),
(71,'draft','open','system','Tạo lịch khởi hành seed'),
(72,'draft','open','system','Tạo lịch khởi hành seed'),
(73,'draft','open','system','Tạo lịch khởi hành seed'),
(74,'draft','open','system','Tạo lịch khởi hành seed'),
(75,'draft','open','system','Tạo lịch khởi hành seed'),
(76,'draft','open','system','Tạo lịch khởi hành seed'),
(77,'draft','open','system','Tạo lịch khởi hành seed'),
(78,'draft','open','system','Tạo lịch khởi hành seed'),
(79,'draft','open','system','Tạo lịch khởi hành seed'),
(80,'draft','open','system','Tạo lịch khởi hành seed'),
(81,'draft','open','system','Tạo lịch khởi hành seed'),
(82,'draft','open','system','Tạo lịch khởi hành seed'),
(83,'draft','open','system','Tạo lịch khởi hành seed'),
(84,'draft','open','system','Tạo lịch khởi hành seed'),
(85,'draft','open','system','Tạo lịch khởi hành seed'),
(86,'draft','open','system','Tạo lịch khởi hành seed'),
(87,'draft','open','system','Tạo lịch khởi hành seed'),
(88,'draft','open','system','Tạo lịch khởi hành seed'),
(89,'draft','open','system','Tạo lịch khởi hành seed'),
(90,'draft','open','system','Tạo lịch khởi hành seed'),
(91,'draft','open','system','Tạo lịch khởi hành seed'),
(92,'draft','open','system','Tạo lịch khởi hành seed'),
(93,'draft','open','system','Tạo lịch khởi hành seed'),
(94,'draft','open','system','Tạo lịch khởi hành seed'),
(95,'draft','open','system','Tạo lịch khởi hành seed'),
(96,'draft','open','system','Tạo lịch khởi hành seed'),
(97,'draft','open','system','Tạo lịch khởi hành seed'),
(98,'draft','open','system','Tạo lịch khởi hành seed'),
(99,'draft','open','system','Tạo lịch khởi hành seed'),
(100,'draft','open','system','Tạo lịch khởi hành seed'),
(101,'draft','open','system','Tạo lịch khởi hành seed'),
(102,'draft','open','system','Tạo lịch khởi hành seed'),
(103,'draft','open','system','Tạo lịch khởi hành seed'),
(104,'draft','open','system','Tạo lịch khởi hành seed'),
(105,'draft','open','system','Tạo lịch khởi hành seed'),
(106,'draft','open','system','Tạo lịch khởi hành seed'),
(107,'draft','open','system','Tạo lịch khởi hành seed'),
(108,'draft','open','system','Tạo lịch khởi hành seed'),
(109,'draft','open','system','Tạo lịch khởi hành seed'),
(110,'draft','open','system','Tạo lịch khởi hành seed'),
(111,'draft','open','system','Tạo lịch khởi hành seed'),
(112,'draft','open','system','Tạo lịch khởi hành seed'),
(113,'draft','open','system','Tạo lịch khởi hành seed'),
(114,'draft','open','system','Tạo lịch khởi hành seed'),
(115,'draft','open','system','Tạo lịch khởi hành seed'),
(116,'draft','open','system','Tạo lịch khởi hành seed'),
(117,'draft','open','system','Tạo lịch khởi hành seed'),
(118,'draft','open','system','Tạo lịch khởi hành seed'),
(119,'draft','open','system','Tạo lịch khởi hành seed'),
(120,'draft','open','system','Tạo lịch khởi hành seed'),
(121,'draft','open','system','Tạo lịch khởi hành seed'),
(122,'draft','open','system','Tạo lịch khởi hành seed'),
(123,'draft','open','system','Tạo lịch khởi hành seed'),
(124,'draft','open','system','Tạo lịch khởi hành seed'),
(125,'draft','open','system','Tạo lịch khởi hành seed'),
(126,'draft','open','system','Tạo lịch khởi hành seed'),
(127,'draft','open','system','Tạo lịch khởi hành seed'),
(128,'draft','open','system','Tạo lịch khởi hành seed'),
(129,'draft','open','system','Tạo lịch khởi hành seed'),
(130,'draft','open','system','Tạo lịch khởi hành seed'),
(131,'draft','open','system','Tạo lịch khởi hành seed'),
(132,'draft','open','system','Tạo lịch khởi hành seed'),
(133,'draft','open','system','Tạo lịch khởi hành seed'),
(134,'draft','open','system','Tạo lịch khởi hành seed'),
(135,'draft','open','system','Tạo lịch khởi hành seed'),
(136,'draft','open','system','Tạo lịch khởi hành seed'),
(137,'draft','open','system','Tạo lịch khởi hành seed'),
(138,'draft','open','system','Tạo lịch khởi hành seed'),
(139,'draft','open','system','Tạo lịch khởi hành seed'),
(140,'draft','open','system','Tạo lịch khởi hành seed'),
(141,'draft','open','system','Tạo lịch khởi hành seed'),
(142,'draft','open','system','Tạo lịch khởi hành seed'),
(143,'draft','open','system','Tạo lịch khởi hành seed'),
(144,'draft','open','system','Tạo lịch khởi hành seed'),
(145,'draft','open','system','Tạo lịch khởi hành seed'),
(146,'draft','open','system','Tạo lịch khởi hành seed'),
(147,'draft','open','system','Tạo lịch khởi hành seed'),
(148,'draft','open','system','Tạo lịch khởi hành seed'),
(149,'draft','open','system','Tạo lịch khởi hành seed'),
(150,'draft','open','system','Tạo lịch khởi hành seed'),
(151,'draft','open','system','Tạo lịch khởi hành seed'),
(152,'draft','open','system','Tạo lịch khởi hành seed'),
(153,'draft','open','system','Tạo lịch khởi hành seed'),
(154,'draft','open','system','Tạo lịch khởi hành seed'),
(155,'draft','open','system','Tạo lịch khởi hành seed'),
(156,'draft','open','system','Tạo lịch khởi hành seed'),
(157,'draft','open','system','Tạo lịch khởi hành seed'),
(158,'draft','open','system','Tạo lịch khởi hành seed'),
(159,'draft','open','system','Tạo lịch khởi hành seed'),
(160,'draft','open','system','Tạo lịch khởi hành seed'),
(161,'draft','open','system','Tạo lịch khởi hành seed'),
(162,'draft','open','system','Tạo lịch khởi hành seed'),
(163,'draft','open','system','Tạo lịch khởi hành seed'),
(164,'draft','open','system','Tạo lịch khởi hành seed');


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


-- HOTELS / VEHICLES
INSERT IGNORE INTO hotels (
    id, supplier_id, code, name, star_rating, phone, email, province, district, address,
    latitude, longitude, checkin_time, checkout_time, status
) VALUES
(1,1,'HOTEL-DN-001','TravelViet Hotel Danang',4.0,'+842363333333','booking@hotel.local','Đà Nẵng','Hải Châu','Trung tâm Hải Châu',16.06778,108.22083,'14:00','12:00','active');


-- 3) 300 hotels, map destination theo vong lap
UPDATE tours
SET is_featured = TRUE
WHERE id IN (5, 6, 37, 48, 53, 73, 76, 80);

-- =====================================================================
-- X) EXTENDED TOUR SCHEDULES (2-3 Months, 4 deps/month per tour)
-- =====================================================================
INSERT IGNORE INTO tour_schedules (
    schedule_code, tour_id, departure_at, return_at,
    capacity_total, booked_seats, adult_price, child_price, status
)
SELECT 
    CONCAT('SCH_EXT_', t.id, '_', n.num),
    t.id,
    DATE_ADD(CURDATE(), INTERVAL (n.num * 7 + (t.id % 5)) DAY),
    DATE_ADD(CURDATE(), INTERVAL (n.num * 7 + (t.id % 5) + t.duration_days) DAY),
    30,
    MOD(t.id + n.num, 15),
    t.base_price,
    ROUND(t.base_price * 0.75),
    'open'
FROM tours t
CROSS JOIN (
    SELECT 1 AS num UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 
    UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
    UNION ALL SELECT 11 UNION ALL SELECT 12
) n
WHERE t.deleted_at IS NULL;

SET FOREIGN_KEY_CHECKS = 1;
SET FOREIGN_KEY_CHECKS = 1;
