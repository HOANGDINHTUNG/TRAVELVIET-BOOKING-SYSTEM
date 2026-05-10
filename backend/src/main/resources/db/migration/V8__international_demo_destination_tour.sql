-- Demo data: international destination + featured tour for homepage "tour hot nước ngoài"
INSERT IGNORE INTO destinations (
    id, uuid, code, name, slug, country_code, province, district, region, address,
    latitude, longitude, short_description, description, best_time_from_month, best_time_to_month,
    crowd_level_default, is_featured, is_active, status, proposed_by, verified_by, is_official
) VALUES
(23,'27b85f64-5717-4562-b3fc-2c963f66afa6','SEL','Seoul','seoul','KR','Seoul','Jung-gu','Northeast Asia','Myeongdong',
37.5665,126.9780,'Thủ đô Hàn Quốc','Cung điện cổ, K-culture và ẩm thực đường phố.',4,11,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE);

INSERT IGNORE INTO destination_media (id, destination_id, media_type, media_url, alt_text, sort_order, is_active)
VALUES
(23,23,'cover','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80','Seoul về đêm',0,TRUE);

INSERT IGNORE INTO tours (
    id, code, name, slug, destination_id, cancellation_policy_id,
    short_description, description, highlights, inclusions, exclusions,
    duration_days, max_group_size, min_age, base_price, currency,
    trip_mode, status, is_featured, total_bookings
) VALUES
(3,'TOUR_KR_01','Seoul 4N3Đ – Ẩm thực & văn hóa','seoul-4n3d-am-thuc-van-hoa',23,1,
'Tour hot Hàn Quốc','Lịch trình Gyeongbokgung, Myeongdong, N Seoul Tower và ẩm thực đường phố.','Cung điện, K-beauty, street food','Xe, HDV tiếng Việt, vé tham quan','Visa và chi phí cá nhân',4,25,12,12500000,'VND','group','active',TRUE,42);

INSERT IGNORE INTO tour_media (id, tour_id, media_type, media_url, alt_text, sort_order, is_active)
VALUES
(3,3,'cover','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80','Seoul skyline',0,TRUE);

INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT 3, t.id FROM tags t WHERE t.code IN ('VAN_HOA','CHECKIN','AM_THUC')
ON DUPLICATE KEY UPDATE tour_id = tour_id;
