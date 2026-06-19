SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- V7_04D__seed_customer_interactions_ops.sql
-- Dữ liệu tương tác/vận hành: review, notification, support, wishlist, recommendation, weather, audit, supplier/media.
-- ============================================================

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


SET FOREIGN_KEY_CHECKS = 1;
