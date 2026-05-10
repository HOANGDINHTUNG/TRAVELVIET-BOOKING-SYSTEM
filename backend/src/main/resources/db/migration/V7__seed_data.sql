-- Flyway V7: INSERT seed data (RBAC, policies, tags, promotions, testimonials)

-- ========================================================= -- 19. DEFAULT DATA -- ========================================================= 

INSERT IGNORE INTO roles (code, name, description, role_scope, hierarchy_level, is_system_role, is_active) 
VALUES ('SUPER_ADMIN', 'Quản trị viên cao cấp', 'Toàn quyền hệ thống, quản lý vai trò và quyền hạn', 'SYSTEM', 100, TRUE, TRUE), ('ADMIN', 'Quản trị viên', 'Quản trị vận hành toàn hệ thống nhưng không toàn quyền như quản trị viên cao cấp', 'BACKOFFICE', 80, TRUE, TRUE), ('CONTENT_EDITOR', 'Biên tập nội dung', 'Quản lý nội dung điểm đến, tour, media, bài mô tả', 'BACKOFFICE', 60, TRUE, TRUE), ('FIELD_STAFF', 'Nhân sự hiện trường', 'Khảo sát thực địa, cập nhật dữ liệu thực tế, hỗ trợ check-in điểm đón', 'BACKOFFICE', 50, TRUE, TRUE), ('OPERATOR', 'Điều hành viên', 'Điều phối lịch khởi hành, đặt chỗ, hỗ trợ và hoàn tiền cơ bản', 'BACKOFFICE', 55, TRUE, TRUE), ('USER', 'Khách hàng', 'Người dùng ứng dụng đặt tour', 'CUSTOMER', 10, TRUE, TRUE); 

INSERT IGNORE INTO permissions (code, name, module_name, action_name, description) 
VALUES ('dashboard.view', 'Xem bảng điều khiển', 'dashboard', 'view', 'Truy cập bảng điều khiển quản trị'), ('user.view', 'Xem người dùng', 'user', 'view', 'Xem danh sách và chi tiết người dùng'), ('user.create', 'Tạo người dùng', 'user', 'create', 'Tạo tài khoản nội bộ hoặc khách hàng'), ('user.update', 'Sửa người dùng', 'user', 'update', 'Cập nhật hồ sơ người dùng'), ('user.delete', 'Xóa người dùng', 'user', 'delete', 'Xóa mềm hoặc vô hiệu hóa tài khoản'), ('user.block', 'Khóa người dùng', 'user', 'block', 'Khóa hoặc mở khóa tài khoản'), ('role.view', 'Xem vai trò', 'role', 'view', 'Xem danh sách vai trò'), ('role.create', 'Tạo vai trò', 'role', 'create', 'Tạo vai trò mới'), ('role.update', 'Sửa vai trò', 'role', 'update', 'Chỉnh sửa vai trò'), ('role.delete', 'Xóa vai trò', 'role', 'delete', 'Xóa vai trò không còn dùng'), ('role.assign', 'Gán vai trò', 'role', 'assign', 'Gán vai trò cho người dùng'), ('permission.view', 'Xem quyền', 'permission', 'view', 'Xem danh sách quyền'), ('permission.assign', 'Gán quyền', 'permission', 'assign', 'Gán quyền cho vai trò'), ('destination.view', 'Xem điểm đến', 'destination', 'view', 'Xem thông tin điểm đến'), ('destination.create', 'Tạo điểm đến', 'destination', 'create', 'Tạo điểm đến mới'), ('destination.update', 'Sửa điểm đến', 'destination', 'update', 'Cập nhật điểm đến'), ('destination.delete', 'Xóa điểm đến', 'destination', 'delete', 'Xóa hoặc ẩn điểm đến'), ('destination.publish', 'Xuất bản điểm đến', 'destination', 'publish', 'Kích hoạt và hiển thị điểm đến'), ('content.view', 'Xem nội dung', 'content', 'view', 'Xem nội dung CMS'), ('content.create', 'Tạo nội dung', 'content', 'create', 'Tạo mô tả, media, mẹo, sự kiện'), ('content.update', 'Sửa nội dung', 'content', 'update', 'Cập nhật nội dung'), ('content.delete', 'Xóa nội dung', 'content', 'delete', 'Xóa nội dung'), ('content.publish', 'Xuất bản nội dung', 'content', 'publish', 'Duyệt và xuất bản'), ('tour.view', 'Xem tour', 'tour', 'view', 'Xem thông tin tour'), ('tour.create', 'Tạo tour', 'tour', 'create', 'Tạo tour mới'), ('tour.update', 'Sửa tour', 'tour', 'update', 'Cập nhật tour'), ('tour.delete', 'Xóa tour', 'tour', 'delete', 'Xóa hoặc ẩn tour'), ('tour.publish', 'Xuất bản tour', 'tour', 'publish', 'Kích hoạt tour'), ('schedule.view', 'Xem lịch khởi hành', 'schedule', 'view', 'Xem lịch khởi hành'), ('schedule.create', 'Tạo lịch khởi hành', 'schedule', 'create', 'Tạo lịch khởi hành mới'), ('schedule.update', 'Sửa lịch khởi hành', 'schedule', 'update', 'Cập nhật lịch khởi hành'), ('schedule.close', 'Đóng hoặc mở lịch', 'schedule', 'close', 'Đóng, mở hoặc hủy lịch'), ('guide.assign', 'Phân công hướng dẫn viên', 'guide', 'assign', 'Gán HDV cho lịch khởi hành'), ('booking.view', 'Xem đặt chỗ', 'booking', 'view', 'Xem thông tin đặt chỗ'), ('booking.create', 'Tạo đặt chỗ', 'booking', 'create', 'Tạo đặt chỗ mới'), ('booking.update', 'Sửa đặt chỗ', 'booking', 'update', 'Chỉnh sửa đặt chỗ'), ('booking.cancel', 'Hủy đặt chỗ', 'booking', 'cancel', 'Thực hiện hủy đặt chỗ'), ('booking.checkin', 'Check-in đặt chỗ', 'booking', 'checkin', 'Check-in khách đi tour'), ('payment.view', 'Xem thanh toán', 'payment', 'view', 'Xem giao dịch thanh toán'), ('payment.create', 'Tạo thanh toán', 'payment', 'create', 'Ghi nhận thanh toán'), ('payment.update', 'Sửa thanh toán', 'payment', 'update', 'Cập nhật trạng thái thanh toán'), ('refund.view', 'Xem hoàn tiền', 'refund', 'view', 'Xem yêu cầu hoàn tiền'), ('refund.create', 'Tạo yêu cầu hoàn tiền', 'refund', 'create', 'Tạo yêu cầu hoàn tiền'), ('refund.approve', 'Duyệt hoàn tiền', 'refund', 'approve', 'Duyệt hoàn tiền'), ('refund.reject', 'Từ chối hoàn tiền', 'refund', 'reject', 'Từ chối hoàn tiền'), ('refund.process', 'Xử lý hoàn tiền', 'refund', 'process', 'Xử lý hoàn tiền thực tế'), ('voucher.view', 'Xem ưu đãi', 'voucher', 'view', 'Xem voucher và chiến dịch'), ('voucher.create', 'Tạo ưu đãi', 'voucher', 'create', 'Tạo voucher hoặc chiến dịch'), ('voucher.update', 'Sửa ưu đãi', 'voucher', 'update', 'Cập nhật voucher hoặc chiến dịch'), ('voucher.delete', 'Xóa ưu đãi', 'voucher', 'delete', 'Xóa voucher'), ('review.view', 'Xem đánh giá', 'review', 'view', 'Xem đánh giá của khách'), ('review.reply', 'Phản hồi đánh giá', 'review', 'reply', 'Trả lời đánh giá'), ('review.moderate', 'Kiểm duyệt đánh giá', 'review', 'moderate', 'Ẩn hoặc duyệt đánh giá'), ('support.view', 'Xem hỗ trợ', 'support', 'view', 'Xem phiên hỗ trợ'), ('support.reply', 'Trả lời hỗ trợ', 'support', 'reply', 'Nhắn tin hỗ trợ khách hàng'), ('support.assign', 'Phân công hỗ trợ', 'support', 'assign', 'Gán nhân viên xử lý hội thoại'), ('notification.view', 'Xem thông báo', 'notification', 'view', 'Xem thông báo hệ thống'), ('notification.send', 'Gửi thông báo', 'notification', 'send', 'Gửi push, email hoặc SMS'), ('report.view', 'Xem báo cáo', 'report', 'view', 'Xem thống kê và báo cáo'), ('audit.view', 'Xem nhật ký thao tác', 'audit', 'view', 'Xem lịch sử thao tác hệ thống'); 

INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'SUPER_ADMIN'; 
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'ADMIN' AND p.code IN ('dashboard.view','user.view','user.create','user.update','user.delete','user.block','role.view','role.assign','permission.view','destination.view','destination.create','destination.update','destination.delete','destination.publish','content.view','content.create','content.update','content.delete','content.publish','tour.view','tour.create','tour.update','tour.delete','tour.publish','schedule.view','schedule.create','schedule.update','schedule.close','guide.assign','booking.view','booking.create','booking.update','booking.cancel','booking.checkin','payment.view','payment.create','payment.update','refund.view','refund.create','refund.approve','refund.reject','refund.process','voucher.view','voucher.create','voucher.update','voucher.delete','review.view','review.reply','review.moderate','support.view','support.reply','support.assign','notification.view','notification.send','report.view','audit.view'); 
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'CONTENT_EDITOR' AND p.code IN ('dashboard.view','destination.view','destination.create','destination.update','destination.publish','content.view','content.create','content.update','content.delete','content.publish','tour.view','tour.create','tour.update','tour.publish','schedule.view','review.view','notification.view'); 
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'FIELD_STAFF' AND p.code IN ('dashboard.view','destination.view','destination.create','destination.update','content.view','content.create','content.update','tour.view','schedule.view','schedule.update','booking.view','booking.checkin'); 
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'OPERATOR' AND p.code IN ('dashboard.view','user.view','destination.view','tour.view','schedule.view','schedule.create','schedule.update','schedule.close','guide.assign','booking.view','booking.create','booking.update','booking.cancel','booking.checkin','payment.view','payment.create','payment.update','refund.view','refund.create','refund.approve','refund.reject','refund.process','review.view','review.reply','support.view','support.reply','support.assign','notification.view','notification.send','report.view'); 
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'USER' AND p.code IN ('destination.view','content.view','tour.view','schedule.view','booking.view','booking.create','booking.cancel','payment.view','payment.create','refund.view','refund.create','review.view','notification.view','support.view','support.reply'); 

INSERT IGNORE INTO permissions (code, name, module_name, action_name, description) VALUES ('destination.propose', 'Đề xuất điểm đến', 'destination', 'propose', 'Người dùng gửi đề xuất điểm đến mới hoặc cập nhật, chờ kiểm duyệt'), ('destination.review', 'Kiểm duyệt đề xuất điểm đến', 'destination', 'review', 'Thẩm định và phê duyệt đề xuất trước khi xuất bản');
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'USER' AND p.code IN ('destination.propose');
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'FIELD_STAFF' AND p.code IN ('destination.review');
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'CONTENT_EDITOR' AND p.code IN ('destination.review');
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'OPERATOR' AND p.code IN ('destination.review');
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'ADMIN' AND p.code IN ('destination.review');
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'SUPER_ADMIN' AND p.code IN ('destination.review');

INSERT IGNORE INTO permissions (code, name, module_name, action_name, description) VALUES ('review.create', 'Tạo đánh giá', 'review', 'create', 'Khách tạo đánh giá sau khi hoàn thành tour');
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'USER' AND p.code IN ('review.create');
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'ADMIN' AND p.code IN ('review.create');
INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p WHERE r.code = 'OPERATOR' AND p.code IN ('review.create');

INSERT IGNORE INTO cancellation_policies ( id, name, description, voucher_bonus_percent, is_default, is_active ) 
VALUES (1, 'CHINH_SACH_MAC_DINH', 'Chính sách hoàn hủy mặc định của TravelViet', 10, TRUE, TRUE); 
INSERT IGNORE INTO cancellation_policy_rules ( id, policy_id, min_hours_before, max_hours_before, refund_percent, voucher_percent, fee_percent, allow_reschedule, notes ) 
VALUES (1, 1, 168, NULL, 80, 90, 20, TRUE, 'Hủy trước 7 ngày'), (2, 1, 72, 168, 50, 60, 50, TRUE, 'Hủy trước 3 ngày'), (3, 1, 0, 72, 0, 30, 100, FALSE, 'Hủy dưới 3 ngày'); 
INSERT IGNORE INTO tags(code, name, tag_group, description) 
VALUES ('GIAI_TRI', 'Giải trí', 'phong_cach', 'Tour vui chơi, hoạt động sôi động'), ('NGHI_DUONG', 'Nghỉ dưỡng', 'phong_cach', 'Tour nghỉ ngơi, thư giãn'), ('CHECKIN', 'Check-in', 'phong_cach', 'Tour phù hợp sống ảo, chụp hình'), ('GIA_DINH', 'Gia đình', 'doi_tuong', 'Tour phù hợp gia đình và trẻ em'), ('NGUOI_LON_TUOI', 'Người lớn tuổi', 'doi_tuong', 'Tour nhẹ nhàng, ít di chuyển'), ('SINH_VIEN', 'Sinh viên', 'doi_tuong', 'Tour giá tốt cho sinh viên'), ('BIEN', 'Biển', 'dia_hinh', 'Tour biển'), ('NUI', 'Núi', 'dia_hinh', 'Tour núi'), ('AM_THUC', 'Ẩm thực', 'trai_nghiem', 'Tour ẩm thực'), ('VAN_HOA', 'Văn hóa', 'trai_nghiem', 'Tour văn hóa');

INSERT INTO promotion_campaigns (
    code, name, description, image_url, image_alt, display_title, display_subtitle,
    badge_text, cta_label, cta_url, sort_order, is_featured, start_at, end_at,
    target_member_level, conditions_json, reward_json, is_active
) VALUES
('TEAMBUILDING_SUMMER_2026','Du lịch team building mùa hè 2026','Gói ưu đãi cho doanh nghiệp đặt tour đoàn hè, phù hợp chương trình gắn kết và gala dinner.','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80','Đoàn khách tham gia hoạt động team building ngoài trời','Du lịch — Teambuilding — Gala','Chương trình hè trọn gói cho doanh nghiệp từ 30 khách.','Ưu đãi doanh nghiệp','Xem ưu đãi','/promotions/TEAMBUILDING_SUMMER_2026',1,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 DAY),'silver',JSON_OBJECT('minGuests', 30, 'applicableScope', 'corporate_group', 'advanceBookingDays', 14),JSON_OBJECT('type', 'percentage_discount', 'value', 12, 'maxDiscountAmount', 5000000),TRUE),
('COMPANY_TRIP_2026','Cả công ty cùng đi','Khuyến mãi tour đoàn lớn cho công ty tổ chức du lịch nghỉ dưỡng, hội nghị và gala cuối năm.','https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80','Nhóm nhân viên công ty cùng tham gia chuyến đi','Cả công ty cùng đi','Gói tour trọn gói cho đoàn 50 đến 1000 khách.','Tour đoàn lớn','Nhận tư vấn','/promotions/COMPANY_TRIP_2026',2,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 120 DAY),'gold',JSON_OBJECT('minGuests', 50, 'applicableScope', 'company_trip', 'includesGala', true),JSON_OBJECT('type', 'fixed_amount_discount', 'value', 3000000, 'gift', 'Free gala backdrop'),TRUE),
('FAMILY_CONNECT_2026','Hành trình gắn kết gia đình','Ưu đãi cho gia đình và nhóm bạn đặt tour nghỉ dưỡng, miễn phí tư vấn lịch trình riêng.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80','Gia đình nghỉ dưỡng trên bãi biển','Hành trình gắn kết','Giảm giá cho nhóm gia đình từ 6 khách trở lên.','Gia đình','Đặt tour ngay','/promotions/FAMILY_CONNECT_2026',3,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 75 DAY),'bronze',JSON_OBJECT('minGuests', 6, 'applicableScope', 'family_group', 'advanceBookingDays', 7),JSON_OBJECT('type', 'cashback', 'value', 500000, 'voucherForNextTrip', true),TRUE)
ON DUPLICATE KEY UPDATE description=VALUES(description), image_url=VALUES(image_url), image_alt=VALUES(image_alt), display_title=VALUES(display_title), display_subtitle=VALUES(display_subtitle), badge_text=VALUES(badge_text), cta_label=VALUES(cta_label), cta_url=VALUES(cta_url), sort_order=VALUES(sort_order), is_featured=VALUES(is_featured), start_at=VALUES(start_at), end_at=VALUES(end_at), target_member_level=VALUES(target_member_level), conditions_json=VALUES(conditions_json), reward_json=VALUES(reward_json), is_active=VALUES(is_active);

INSERT INTO customer_testimonials (customer_name, customer_title, content, rating, avatar_url, is_verified, sort_order, is_active) VALUES
('Chị Nguyễn Mai','Nguyen Dinh Chieu - Ho Chi Minh','CÔNG TY TNHH ON VIỆT NAM đặc biệt ấn tượng với sự chuyên nghiệp của THD Travel trong việc thiết kế hành trình nghỉ dưỡng cho ON Việt Nam.',5,'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',TRUE,1,TRUE),
('Chị Thơ Nguyễn','Dong Da - Ha Noi','[Happy Money — Công ty cổ phần TM liên kết Nano] Nhờ sự hỗ trợ tận tâm của THD Travel, chuyến du lịch kết hợp hội thảo của doanh nghiệp chúng tôi diễn ra thuận lợi và trọn vẹn.',5,'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=160&q=80',TRUE,2,TRUE),
('Anh Hùng','Thuy Nguyen - Hai Phong','[Công ty TNHH LITEON] Chuyến đi lần này thực sự ý nghĩa với toàn thể nhân viên.',5,'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',TRUE,3,TRUE),
('Chị Trương Uyển Thanh','An Khanh - Ho Chi Minh','Chi nhánh HCM của Electrolux Vietnam đánh giá cao sự chuyên nghiệp của THD Travel.',5,'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',TRUE,4,TRUE)
ON DUPLICATE KEY UPDATE customer_title=VALUES(customer_title), content=VALUES(content), rating=VALUES(rating), avatar_url=VALUES(avatar_url), is_verified=VALUES(is_verified), sort_order=VALUES(sort_order), is_active=VALUES(is_active);

-- =========================================================
-- SAMPLE DATA PACK (1–2 rows/table; EN for codes/enum keys)
-- =========================================================

-- USERS / RBAC (users are required for many FK columns)
INSERT IGNORE INTO users (
    id, email, phone, password_hash, user_category, status,
    full_name, display_name, gender, date_of_birth, avatar_url,
    member_level, loyalty_points, total_spent
) VALUES
('550e8400-e29b-41d4-a716-446655440000','admin@travelviet.local','+84900000001','$2a$10$demo.hash.for.local.only','INTERNAL','active','Admin TravelViet','Admin','unknown','1990-01-01',NULL,'diamond',0,0),
('550e8400-e29b-41d4-a716-446655440001','an.nguyen+seed@gmail.com','+84901234567','$2a$10$demo.hash.for.local.only','CUSTOMER','active','Nguyễn Văn An','An Nguyen','male','1995-06-15',NULL,'bronze',0,0);

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r
WHERE (u.email = 'admin@travelviet.local' AND r.code IN ('SUPER_ADMIN'))
   OR (u.email = 'an.nguyen+seed@gmail.com' AND r.code IN ('USER'));

INSERT IGNORE INTO user_preferences (
    id, user_id, budget_level, preferred_trip_mode, travel_style,
    preferred_departure_city, favorite_regions, prefers_weather_alert, prefers_promotion_alert
) VALUES
(1,'550e8400-e29b-41d4-a716-446655440001','medium','group','mixed','TP. Hồ Chí Minh',JSON_ARRAY('South','Central'),TRUE,TRUE);

INSERT IGNORE INTO user_devices (
    id, user_id, platform, device_name, push_token, app_version, is_active
) VALUES
(1,'550e8400-e29b-41d4-a716-446655440001','android','Pixel 7',NULL,'1.0.0',TRUE);

INSERT IGNORE INTO user_addresses (
    id, user_id, contact_name, contact_phone, province, district, ward, address_line, is_default
) VALUES
(1,'550e8400-e29b-41d4-a716-446655440001','Nguyễn Văn An','+84901234567','TP. Hồ Chí Minh','Quận 1','Bến Nghé','12 Nguyễn Huệ',TRUE);

-- DESTINATIONS + CONTENT
INSERT IGNORE INTO destinations (
    id, uuid, code, name, slug, country_code, province, district, region, address,
    latitude, longitude, short_description, description, best_time_from_month, best_time_to_month,
    crowd_level_default, is_featured, is_active, status, proposed_by, verified_by, is_official
) VALUES
(1,'3fa85f64-5717-4562-b3fc-2c963f66afa6','HCM','TP. Hồ Chí Minh','tp-ho-chi-minh','VN','TP. Hồ Chí Minh','Quận 1','South','Trung tâm Quận 1',10.7768897,106.7008066,'Thành phố năng động','Trung tâm kinh tế, văn hóa, ẩm thực.',11,4,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(2,'6fa85f64-5717-4562-b3fc-2c963f66afa6','DN','Đà Nẵng','da-nang','VN','Đà Nẵng','Hải Châu','Central','Bạch Đằng',16.06778,108.22083,'Thành phố biển','Cầu Rồng, biển Mỹ Khê, Bà Nà Hills.',3,9,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(3,'7fa85f64-5717-4562-b3fc-2c963f66afa6','HN','Hà Nội','ha-noi','VN','Hà Nội','Hoàn Kiếm','North','Phố Cổ Hà Nội',21.0285,105.8542,'Thủ đô ngàn năm văn hiến','Trung tâm chính trị, văn hóa với Hồ Gươm và 36 phố phường.',9,11,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(4,'8fa85f64-5717-4562-b3fc-2c963f66afa6','HL','Vịnh Hạ Long','vinh-ha-long','VN','Quảng Ninh','Hạ Long','North','Vịnh Hạ Long',20.9101,107.1839,'Kỳ quan thiên nhiên thế giới','Hàng ngàn đảo đá vôi kỳ vĩ và hang động độc đáo.',4,10,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(5,'9fa85f64-5717-4562-b3fc-2c963f66afa6','SP','Sa Pa','sa-pa','VN','Lào Cai','Sa Pa','North','Thị xã Sa Pa',22.3364,103.8438,'Thành phố trong sương','Đỉnh Fansipan, ruộng bậc thang và văn hóa dân tộc đặc sắc.',3,5,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(6,'10a85f64-5717-4562-b3fc-2c963f66afa6','NB','Ninh Bình','ninh-binh','VN','Ninh Bình','Hoa Lư','North','Tràng An',20.2506,105.9744,'Hạ Long trên cạn','Quần thể di sản thế giới Tràng An, Tam Cốc, Bái Đính.',1,4,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(7,'11a85f64-5717-4562-b3fc-2c963f66afa6','HG','Hà Giang','ha-giang','VN','Hà Giang','Đồng Văn','North','Cao nguyên đá Đồng Văn',23.2345,105.2505,'Vùng địa đầu Tổ quốc','Đèo Mã Pì Lèng, cột cờ Lũng Cú và hoa tam giác mạch.',10,12,'low',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(8,'12a85f64-5717-4562-b3fc-2c963f66afa6','MC','Mộc Châu','moc-chau','VN','Sơn La','Mộc Châu','North','Thị trấn Mộc Châu',20.8465,104.6483,'Thiên đường hoa Tây Bắc','Đồi chè trái tim, thác Dải Yếm và rừng thông Bản Áng.',1,3,'medium',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),

-- Miền Trung
(9,'13a85f64-5717-4562-b3fc-2c963f66afa6','HUI','Huế','hue','VN','Thừa Thiên Huế','Huế','Central','Kinh thành Huế',16.4637,107.5908,'Cố đô trầm mặc','Di sản văn hóa triều Nguyễn, lăng tẩm và ẩm thực cung đình.',1,4,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(10,'14a85f64-5717-4562-b3fc-2c963f66afa6','HOI','Hội An','hoi-an','VN','Quảng Nam','Hội An','Central','Phố cổ Hội An',15.8801,108.3380,'Thương cảng cổ xưa','Dãy nhà vàng rêu phong, đèn lồng rực rỡ và sông Hoài.',2,5,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(11,'15a85f64-5717-4562-b3fc-2c963f66afa6','NT','Nha Trang','nha-trang','VN','Khánh Hòa','Nha Trang','Central','Trần Phú',12.2388,109.1967,'Hòn ngọc Biển Đông','Vịnh biển đẹp thế giới, VinWonders và tháp Bà Ponagar.',1,8,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(12,'16a85f64-5717-4562-b3fc-2c963f66afa6','DL','Đà Lạt','da-lat','VN','Lâm Đồng','Đà Lạt','Central','Hồ Xuân Hương',11.9404,108.4583,'Thành phố ngàn hoa','Khí hậu mát mẻ quanh năm, thung lũng tình yêu và hồ Tuyền Lâm.',11,3,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(13,'17a85f64-5717-4562-b3fc-2c963f66afa6','QB','Phong Nha','phong-nha','VN','Quảng Bình','Bố Trạch','Central','Vườn quốc gia Phong Nha - Kẻ Bàng',17.5110,106.2794,'Vương quốc hang động','Hang Sơn Đoòng, Động Thiên Đường và hang Én.',3,8,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(14,'18a85f64-5717-4562-b3fc-2c963f66afa6','QY','Quy Nhơn','quy-nhon','VN','Bình Định','Quy Nhơn','Central','Eo Gió',13.7767,109.2243,'Thành phố thi ca','Kỳ Co, Eo Gió và vẻ đẹp hoang sơ của biển miền Trung.',3,9,'medium',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(15,'19a85f64-5717-4562-b3fc-2c963f66afa6','PY','Phú Yên','phu-yen','VN','Phú Yên','Tuy An','Central','Gành Đá Đĩa',13.3351,109.3031,'Xứ sở hoa vàng trên cỏ xanh','Gành Đá Đĩa độc đáo, Bãi Xép và tháp Nhạn.',2,8,'low',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(16,'20a85f64-5717-4562-b3fc-2c963f66afa6','MT','Mũi Né','mui-ne','VN','Bình Thuận','Phan Thiết','Central','Đồi Cát Bay',10.9433,108.3062,'Thủ phủ resort','Đồi Cát Bay, Bàu Trắng và các môn thể thao biển.',11,4,'medium',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),

-- Miền Nam & Tây Nam Bộ
(17,'21a85f64-5717-4562-b3fc-2c963f66afa6','PQ','Phú Quốc','phu-quoc','VN','Kiên Giang','Phú Quốc','South','Bãi Trường',10.2270,103.9630,'Đảo Ngọc','Thiên đường nghỉ dưỡng biển, vườn quốc gia và Sunset Town.',11,4,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(18,'22a85f64-5717-4562-b3fc-2c963f66afa6','VT','Vũng Tàu','vung-tau','VN','Bà Rịa - Vũng Tàu','Vũng Tàu','South','Bãi Sau',10.3460,107.0843,'Thành phố biển gần Sài Gòn','Tượng Chúa Kitô Vua, hải đăng và ẩm thực hải sản.',1,12,'high',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(19,'23a85f64-5717-4562-b3fc-2c963f66afa6','CT','Cần Thơ','can-tho','VN','Cần Thơ','Ninh Kiều','South','Bến Ninh Kiều',10.0333,105.7833,'Thủ phủ miền Tây','Chợ nổi Cái Răng, vườn trái cây và nét đẹp sông nước.',12,4,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(20,'24a85f64-5717-4562-b3fc-2c963f66afa6','CD','Côn Đảo','con-dao','VN','Bà Rịa - Vũng Tàu','Côn Đảo','South','Cảng Bến Đầm',8.6821,106.6071,'Địa ngục trần gian xưa','Di tích nhà tù lịch sử và những bãi biển hoang sơ tuyệt đẹp.',3,9,'low',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(21,'25a85f64-5717-4562-b3fc-2c963f66afa6','TN','Tây Ninh','tay-ninh','VN','Tây Ninh','Tây Ninh','South','Núi Bà Đen',11.3688,106.1264,'Vùng đất thánh','Núi Bà Đen, Tòa Thánh Cao Đài và đặc sản muối tôm.',1,5,'medium',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(22,'26a85f64-5717-4562-b3fc-2c963f66afa6','AG','An Giang','an-giang','VN','An Giang','Tịnh Biên','South','Rừng tràm Trà Sư',10.5528,105.0001,'Miền đất tâm linh','Rừng tràm Trà Sư, Miếu Bà Chúa Xứ và núi Cấm.',9,11,'medium',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE);

INSERT IGNORE INTO destination_media (id, destination_id, media_type, media_url, alt_text, sort_order, is_active)
VALUES
(1,1,'cover','https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1200&q=80','Bến Bạch Đằng',0,TRUE),
(2,2,'cover','https://images.unsplash.com/photo-1544961371-516024f2d10b?auto=format&fit=crop&w=1200&q=80','Cầu Rồng Đà Nẵng',0,TRUE),
(3,3,'cover','https://images.unsplash.com/photo-1555944630-12419696355c?w=1200','Thủ đô Hà Nội',0,TRUE),
(4,4,'cover','https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200','Vịnh Hạ Long kỳ vĩ',0,TRUE),
(5,5,'cover','https://images.unsplash.com/photo-1504457047772-27fb10f442d1?w=1200','Sapa mù sương',0,TRUE),
(6,6,'cover','https://images.unsplash.com/photo-1596391122601-5c469f69749f?w=1200','Quần thể Tràng An',0,TRUE),
(7,7,'cover','https://images.unsplash.com/photo-1508739158474-e73517dc0234?w=1200','Cao nguyên đá Hà Giang',0,TRUE),
(8,8,'cover','https://images.unsplash.com/photo-1614947706437-0803e0797746?w=1200','Đồi chè Mộc Châu',0,TRUE),
(9,9,'cover','https://images.unsplash.com/photo-1599708145806-ba3ad25802b2?w=1200','Đại nội Huế',0,TRUE),
(10,10,'cover','https://images.unsplash.com/photo-1599818204001-f2d4e38c232c?w=1200','Phố cổ Hội An về đêm',0,TRUE),
(11,11,'cover','https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=1200','Bờ biển Nha Trang',0,TRUE),
(12,12,'cover','https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200','Hồ Xuân Hương Đà Lạt',0,TRUE),
(13,13,'cover','https://images.unsplash.com/photo-1621252179027-94459d278660?w=1200','Động Phong Nha',0,TRUE),
(14,14,'cover','https://images.unsplash.com/photo-1605307370842-7a875a6be7b8?w=1200','Bình minh Quy Nhơn',0,TRUE),
(15,15,'cover','https://images.unsplash.com/photo-1623869259275-f86055d045d4?w=1200','Gành Đá Đĩa Phú Yên',0,TRUE),
(16,16,'cover','https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=1200','Đồi cát Mũi Né',0,TRUE),
(17,17,'cover','https://images.unsplash.com/photo-1589779267422-242d1414407c?w=1200','Hoàng hôn Phú Quốc',0,TRUE),
(18,18,'cover','https://images.unsplash.com/photo-1621516065584-633ca5e71465?w=1200','Bãi Sau Vũng Tàu',0,TRUE),
(19,19,'cover','https://images.unsplash.com/photo-1615591322240-a3df3ec6d820?w=1200','Sông nước Cần Thơ',0,TRUE),
(20,20,'cover','https://images.unsplash.com/photo-1596402184320-417d7178b2cd?w=1200','Biển Côn Đảo xanh ngắt',0,TRUE),
(21,21,'cover','https://images.unsplash.com/photo-1610813892019-3f0f9c2d1b70?w=1200','Núi Bà Đen Tây Ninh',0,TRUE),
(22,22,'cover','https://images.unsplash.com/photo-1622329383389-9828e67a077a?w=1200','Rừng tràm An Giang',0,TRUE);

INSERT IGNORE INTO destination_foods (id, destination_id, food_name, description, is_featured)
VALUES
(1,1,'Bánh mì','Món ăn đường phố nổi tiếng.',TRUE),
(2,2,'Mì Quảng','Đặc sản miền Trung.',TRUE),
(3,3,'Phở Hà Nội','Hương vị truyền thống ngàn năm.',TRUE),
(4,4,'Chả mực Hạ Long','Chả mực giã tay thơm ngon.',TRUE),
(5,5,'Thắng Cố','Đặc sản vùng cao Lào Cai.',TRUE),
(6,6,'Cơm cháy Ninh Bình','Cơm cháy giòn rụm ăn kèm sốt dê.',TRUE),
(7,7,'Cháo ấu tẩu','Món cháo đắng đặc trưng Hà Giang.',TRUE),
(8,8,'Bê chao Mộc Châu','Thịt bê non mềm ngọt thơm mùi gừng.',TRUE),
(9,9,'Cơm hến','Món ăn dân dã đậm chất Huế.',TRUE),
(10,10,'Cao lầu Hội An','Sợi mì độc đáo chỉ có tại Hội An.',TRUE),
(11,11,'Bún chả cá Nha Trang','Nước dùng trong, chả cá dai ngọt.',TRUE),
(12,12,'Bánh căn Đà Lạt','Ăn kèm xíu mại trong không khí lạnh.',TRUE),
(13,13,'Cháo canh Quảng Bình','Sợi bánh canh to, nước dùng hải sản.',TRUE),
(14,14,'Bánh hỏi lòng heo','Bữa sáng truyền thống của người Bình Định.',TRUE),
(15,15,'Mắt cá ngừ đại dương','Món ăn bổ dưỡng đặc sản Tuy Hòa.',TRUE),
(16,16,'Lẩu thả Phan Thiết','Sự kết hợp tinh tế của các loại hải sản.',TRUE),
(17,17,'Gỏi cá trích','Cá tươi cuốn bánh tráng rau rừng.',TRUE),
(18,18,'Lẩu súng Vũng Tàu','Vị chua ngọt đặc trưng vùng biển.',TRUE),
(19,19,'Vịt nấu chao','Hương vị đậm đà miền sông nước.',TRUE),
(20,20,'Cua mặt trăng','Loại cua quý hiếm vùng biển Côn Đảo.',TRUE),
(21,21,'Bánh tráng phơi sương','Cuốn thịt luộc rau rừng Tây Ninh.',TRUE),
(22,22,'Lẩu mắm Châu Đốc','Tinh hoa ẩm thực vùng biên viễn.',TRUE);

INSERT IGNORE INTO destination_activities (id, destination_id, activity_name, description, activity_score)
VALUES
(1,1,'Dạo phố đi bộ','Ngắm cảnh, chụp ảnh, trải nghiệm ẩm thực.',4.5),
(2,2,'Tắm biển Mỹ Khê','Biển đẹp, nhiều hoạt động thể thao.',4.7),
(3,3,'Dạo quanh Hồ Gươm','Thưởng thức kem Tràng Tiền và phố đi bộ.',4.7),
(4,4,'Ngắm vịnh từ trực thăng','Góc nhìn toàn cảnh kỳ quan thiên nhiên.',4.9),
(5,5,'Chinh phục Fansipan','Đi cáp treo lên đỉnh núi cao nhất VN.',4.8),
(6,6,'Đi thuyền Tràng An','Len lỏi qua các hang động và phim trường.',4.7),
(7,7,'Check-in dốc Thẩm Mã','Cung đường đèo uốn lượn danh tiếng.',4.9),
(8,8,'Hái chè tại đồi chè trái tim','Trải nghiệm làm nông dân vùng cao.',4.5),
(9,9,'Thăm lăng tẩm triều Nguyễn','Khám phá kiến trúc cung đình cổ xưa.',4.6),
(10,10,'Thả hoa đăng sông Hoài','Cầu nguyện may mắn vào buổi tối.',4.8),
(11,11,'Đi bộ dưới đáy biển','Ngắm san hô tại đảo Hòn Tằm.',4.7),
(12,12,'Săn mây cầu đất','Trải nghiệm cảm giác đứng trên tầng mây.',4.9),
(13,13,'Đu dây Zip-line','Hoạt động mạo hiểm tại Sông Chày Hang Tối.',4.6),
(14,14,'Lặn biển Kỳ Co','Khám phá làn nước trong xanh như ngọc.',4.7),
(15,15,'Thăm tháp Nhạn','Công trình kiến trúc Chăm Pa cổ xưa.',4.4),
(16,16,'Trượt cát Mũi Né','Trò chơi cảm giác mạnh trên đồi cát.',4.5),
(17,17,'Câu mực đêm','Trải nghiệm làm ngư dân trên đảo ngọc.',4.6),
(18,18,'Check-in ngọn hải đăng','Ngắm toàn cảnh thành phố biển từ trên cao.',4.5),
(19,19,'Đi chợ nổi Cái Răng','Tìm hiểu văn hóa giao thương sông nước.',4.7),
(20,20,'Xem rùa đẻ trứng','Hoạt động bảo tồn thiên nhiên độc đáo.',4.9),
(21,21,'Đi cáp treo núi Bà','Viếng tượng Phật Bà bằng đồng cao nhất.',4.8),
(22,22,'Chèo xuồng Trà Sư','Đi xuyên rừng tràm xanh mướt.',4.7);

INSERT IGNORE INTO destination_tips (id, destination_id, tip_title, tip_content, sort_order)
VALUES
(1,1,'Giờ cao điểm','Nên tránh kẹt xe 7–9h và 17–19h.',0),
(2,2,'Thời tiết','Mùa đẹp: tháng 3–9, ít mưa.',0),
(3,3,'Hỏi giá trước','Nên hỏi giá kỹ khi mua hàng tại phố cổ.',0),
(4,4,'Đặt tàu sớm','Hãy đặt tàu tham quan vịnh trước 1 tuần.',0),
(5,5,'Mang đồ ấm','Nhiệt độ Sa Pa thay đổi rất nhanh trong ngày.',0),
(6,6,'Trang phục lịch sự','Khi vào chùa Bái Đính cần mặc đồ kín đáo.',0),
(7,7,'Giấy tờ tùy thân','Cần có giấy phép vùng biên nếu vào Lũng Cú.',0),
(8,8,'Thời điểm hoa nở','Nên đến vào tháng 11 để ngắm hoa cải trắng.',0),
(9,9,'Tránh nắng','Mang theo ô khi tham quan các lăng tẩm.',0),
(10,10,'Đi bộ','Hội An cấm xe máy vào một số khung giờ.',0),
(11,11,'Chống nắng','Biển Nha Trang nắng khá gắt, hãy bôi kem kỹ.',0),
(12,12,'Say xe','Đường lên Đà Lạt khá nhiều đèo dốc quanh co.',0),
(13,13,'Đèn pin','Mang theo đèn pin cá nhân khi thăm hang tự do.',0),
(14,14,'Giữ vệ sinh','Đừng để lại rác khi tham quan đảo Kỳ Co.',0),
(15,15,'Phương tiện','Thuê xe máy là cách tốt nhất để khám phá Tuy Hòa.',0),
(16,16,'Giờ trượt cát','Nên đi trước 9h sáng để cát không bị quá nóng.',0),
(17,17,'Thuốc say sóng','Hãy chuẩn bị nếu bạn định đi tour các đảo.',0),
(18,18,'Tránh cuối tuần','Vũng Tàu rất đông vào thứ 7 và Chủ Nhật.',0),
(19,19,'Dậy sớm','Chợ nổi hoạt động sôi nổi nhất lúc 5-7h sáng.',0),
(20,20,'Kính cẩn','Khi viếng mộ chị Sáu nên đi vào buổi đêm.',0),
(21,21,'Giày thể thao','Nên đi giày êm để leo núi hoặc đi bộ tham quan.',0),
(22,22,'Thuốc xịt muỗi','Cần thiết khi đi vào vùng rừng tràm ngập nước.',0);

INSERT IGNORE INTO destination_events (id, destination_id, event_name, event_type, description, starts_at, ends_at, notify_all_followers, is_active)
VALUES
(1,1,'Lễ hội ẩm thực','festival','Sự kiện ẩm thực cuối tuần.',CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY),TRUE,TRUE),
(2,2,'Carnival biển','festival','Diễu hành ven biển.',CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY),TRUE,TRUE),
(3,3,'Hà Nội City Tour','festival','Tour khám phá văn hóa thủ đô.', '2026-05-15 08:00:00', '2026-05-20 22:00:00', TRUE, TRUE),
(4,4,'Carnival Hạ Long','festival','Lễ hội đường phố trên biển.', '2026-05-01 19:00:00', '2026-05-01 23:00:00', TRUE, TRUE),
(5,9,'Tuần lễ Festival Huế','festival','Di sản văn hóa và nghệ thuật.', '2026-06-01 00:00:00', '2026-06-07 23:59:59', TRUE, TRUE),
(6,12,'Lễ hội hoa Đà Lạt','festival','Triển lãm hoa quy mô toàn quốc.', '2026-12-20 00:00:00', '2026-12-30 23:59:59', TRUE, TRUE),
(7,17,'Giải Marathon Phú Quốc','sports','Chạy bộ xuyên rừng và biển.', '2026-05-25 04:00:00', '2026-05-25 11:00:00', TRUE, TRUE),
-- Thêm các sự kiện ngắn hạn khác cho đủ số lượng 20
(8,11,'Lễ hội Tháp Bà','festival','Lễ hội truyền thống của người Chăm.', '2026-05-10 07:00:00', '2026-05-13 21:00:00', TRUE, TRUE),
(9,10,'Lễ hội đèn lồng','festival','Trình diễn ánh sáng phố cổ.', '2026-05-14 18:00:00', '2026-05-14 22:00:00', TRUE, TRUE),
(10,5,'Chợ tình Sa Pa','festival','Hoạt động văn hóa đêm thứ Bảy.', '2026-05-16 19:00:00', '2026-05-16 23:59:00', TRUE, TRUE),
(11,2,'Pháo hoa Đà Nẵng','festival','Lễ hội pháo hoa quốc tế DIFF.', '2026-06-15 20:00:00', '2026-06-15 22:00:00', TRUE, TRUE),
(12,19,'Ngày hội bánh dân gian','festival','Trình diễn đặc sản Nam Bộ.', '2026-05-20 08:00:00', '2026-05-25 21:00:00', TRUE, TRUE),
(13,22,'Hội rằm tháng Giêng','festival','Lễ hội hành hương Núi Cấm.', '2026-02-15 05:00:00', '2026-02-15 23:00:00', TRUE, TRUE),
(14,21,'Lễ hội Núi Bà','festival','Lễ hội Vía Bà truyền thống.', '2026-05-18 06:00:00', '2026-05-20 22:00:00', TRUE, TRUE),
(15,13,'Lễ hội Hang Động','festival','Khám phá chiều sâu di sản.', '2026-07-10 08:00:00', '2026-07-15 17:00:00', TRUE, TRUE),
(16,7,'Lễ hội hoa tam giác mạch','festival','Mùa hoa rực rỡ nhất Hà Giang.', '2026-10-15 00:00:00', '2026-11-15 23:59:59', TRUE, TRUE),
(17,8,'Lễ hội trà Mộc Châu','festival','Tôn vinh cây chè Tây Bắc.', '2026-04-10 08:00:00', '2026-04-12 17:00:00', TRUE, TRUE),
(18,18,'Khai trương mùa du lịch','festival','Sự kiện mở màn hè Vũng Tàu.', '2026-04-25 09:00:00', '2026-04-25 21:00:00', TRUE, TRUE),
(19,16,'Giải đua lướt ván diều','sports','Cuộc thi quốc tế tại Mũi Né.', '2026-02-20 08:00:00', '2026-02-25 17:00:00', TRUE, TRUE),
(20,20,'Ngày giỗ Côn Đảo','festival','Tưởng niệm các anh hùng.', '2026-07-27 07:00:00', '2026-07-27 21:00:00', TRUE, TRUE),
(21,14,'Đêm nhạc Quy Nhơn','music','Sự kiện ca nhạc ngoài trời.', '2026-06-20 19:00:00', '2026-06-20 23:00:00', TRUE, TRUE),
(22,15,'Lễ hội tôm hùm','festival','Quảng bá hải sản Phú Yên.', '2026-08-01 08:00:00', '2026-08-05 21:00:00', TRUE, TRUE);

INSERT IGNORE INTO destination_follows (id, user_id, destination_id, created_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',2,CURRENT_TIMESTAMP);

-- TOURS / SCHEDULES / GUIDES
INSERT IGNORE INTO guides (
    id, code, full_name, phone, email, gender,
    local_region, languages, specialties, bio,
    rating_avg, total_tours_led, status, is_local_guide
) VALUES
(1,'GD001','Trần Minh','+84909990001','minh.guide@travelviet.local','male', 'Central',JSON_ARRAY('vi','en'),JSON_ARRAY('food','culture'),'Hướng dẫn viên nhiệt tình', 4.90,12,'active',TRUE),
(2,'GD002','Nguyễn Thị Lan','+84909990002','lan.guide@travelviet.local','female','North',JSON_ARRAY('vi','en','fr'),JSON_ARRAY('history','culture'),'Chuyên gia lịch sử Phố cổ và văn hóa vùng cao.',4.85,45,'active',TRUE),
(3,'GD003','Phạm Hùng','+84909990003','hung.guide@travelviet.local','male','South',JSON_ARRAY('vi','en'),JSON_ARRAY('adventure','food'),'HDV trẻ trung, chuyên dẫn tour khám phá sông nước.',4.75,22,'active',TRUE),
(4,'GD004','Lê Thu Thủy','+84909990004','thuy.guide@travelviet.local','female','Central',JSON_ARRAY('vi','en','kr'),JSON_ARRAY('photography','food'),'Đam mê nhiếp ảnh và am hiểu ẩm thực miền Trung.',4.92,30,'active',TRUE),
(5,'GD005','Hoàng Văn Nam','+84909990005','nam.guide@travelviet.local','male','North',JSON_ARRAY('vi','zh'),JSON_ARRAY('trekking','nature'),'Kinh nghiệm trekking 5 năm tại các tỉnh miền núi phía Bắc.',4.80,56,'active',TRUE),
(6,'GD006','Đặng Hồng Ngọc','+84909990006','ngoc.guide@travelviet.local','female','Central',JSON_ARRAY('vi','ja'),JSON_ARRAY('culture','art'),'Chuyên dẫn khách Nhật tham quan cố đô Huế.',4.95,120,'active',TRUE),
(7,'GD007','Bùi Tiến Dũng','+84909990007','dung.guide@travelviet.local','male','South',JSON_ARRAY('vi','en'),JSON_ARRAY('history','nightlife'),'Am hiểu lịch sử Sài Gòn và các điểm vui chơi đêm.',4.65,15,'active',TRUE),
(8,'GD008','Vũ Mai Anh','+84909990008','maianh.guide@travelviet.local','female','North',JSON_ARRAY('vi','en'),JSON_ARRAY('food','shopping'),'Người bản địa Hà Nội, chuyên tour food tour Phố Cổ.',4.88,38,'active',TRUE),
(9,'GD009','Trịnh Gia Bảo','+84909990009','bao.guide@travelviet.local','male','Central',JSON_ARRAY('vi','en'),JSON_ARRAY('beach','adventure'),'HDV chuyên các tour lặn biển và thể thao dưới nước tại Đà Nẵng.',4.70,28,'active',TRUE),
(10,'GD010','Lý Thanh Trúc','+84909990010','truc.guide@travelviet.local','female','South',JSON_ARRAY('vi','fr'),JSON_ARRAY('architecture','history'),'Nghiên cứu sinh ngành kiến trúc, am hiểu về di tích miền Tây.',4.90,12,'active',TRUE),
(11,'GD011','Đỗ Mạnh Cường','+84909990011','cuong.guide@travelviet.local','male','North',JSON_ARRAY('vi','en'),JSON_ARRAY('motorbike','adventure'),'Chuyên dẫn đoàn phượt xe máy cung đường Hà Giang.',4.82,64,'active',TRUE),
(12,'GD012','Ngô Phương Thảo','+84909990012','thao.guide@travelviet.local','female','Central',JSON_ARRAY('vi','en'),JSON_ARRAY('wellness','yoga'),'HDV tour nghỉ dưỡng và thiền định tại Hội An.',4.78,19,'active',TRUE),
(13,'GD013','Phan Anh Tuấn','+84909990013','tuan.guide@travelviet.local','male','South',JSON_ARRAY('vi','zh','en'),JSON_ARRAY('business','shopping'),'Hỗ trợ tour giao thương và mua sắm tại TP.HCM.',4.55,42,'active',TRUE),
(14,'GD014','Lương Minh Hạnh','+84909990014','hanh.guide@travelviet.local','female','North',JSON_ARRAY('vi','en'),JSON_ARRAY('craft','culture'),'Chuyên tour làng nghề truyền thống quanh Hà Nội.',4.89,33,'active',TRUE),
(15,'GD015','Trần Đình Trọng','+84909990015','trong.guide@travelviet.local','male','Central',JSON_ARRAY('vi','en'),JSON_ARRAY('cave','nature'),'Chuyên gia hang động tại Vườn quốc gia Phong Nha.',4.97,88,'active',TRUE),
(16,'GD016','Hồ Bích Liên','+84909990016','lien.guide@travelviet.local','female','South',JSON_ARRAY('vi','en'),JSON_ARRAY('food','cooking'),'Tổ chức các lớp học nấu ăn và tour chợ địa phương.',4.93,51,'active',TRUE),
(17,'GD017','Đào Quốc Việt','+84909990017','viet.guide@travelviet.local','male','North',JSON_ARRAY('vi','en'),JSON_ARRAY('photography','birdwatching'),'HDV nhiếp ảnh chuyên nghiệp tại vịnh Hạ Long.',4.81,27,'active',TRUE),
(18,'GD018','Vương Kim Ngân','+84909990018','ngan.guide@travelviet.local','female','Central',JSON_ARRAY('vi','kr'),JSON_ARRAY('fashion','food'),'Am hiểu xu hướng du lịch của khách Hàn Quốc.',4.72,40,'active',TRUE),
(19,'GD019','Tạ Hoàng Bách','+84909990019','bach.guide@travelviet.local','male','South',JSON_ARRAY('vi','en'),JSON_ARRAY('cycling','nature'),'Chuyên dẫn đoàn đạp xe xuyên rừng quốc gia.',4.86,24,'active',TRUE),
(20,'GD020','Trương Mỹ Linh','+84909990020','linh.guide@travelviet.local','female','North',JSON_ARRAY('vi','en','ja'),JSON_ARRAY('culture','history'),'Thông thạo đa ngôn ngữ, chuyên khách đoàn quốc tế.',4.94,75,'active',TRUE),
(21,'GD021','Nguyễn Thế Anh','+84909990021','theanh.guide@travelviet.local','male','Central',JSON_ARRAY('vi','en'),JSON_ARRAY('history','battlefield'),'Chuyên các tour lịch sử chiến trường xưa miền Trung.',4.87,49,'active',TRUE);

INSERT IGNORE INTO tours (
    id, code, name, slug, destination_id, cancellation_policy_id,
    short_description, description, highlights, inclusions, exclusions,
    duration_days, max_group_size, min_age, base_price, currency,
    trip_mode, status, is_featured
) VALUES
(1,'TOUR_DN_01','Đà Nẵng 3N2Đ – Biển & Bà Nà','da-nang-3n2d-bien-ba-na',2,1,
'Tour nhẹ nhàng cho gia đình','Lịch trình tham quan biển Mỹ Khê, Bà Nà Hills và phố cổ.','Cầu Rồng, Bà Nà, biển Mỹ Khê','Xe, vé tham quan, HDV','Chi phí cá nhân',3,30,3,3500000,'VND','group','active',TRUE),
(2,'TOUR_HCM_01','Sài Gòn 1 ngày – City tour','sai-gon-1-day-city-tour',1,1,
'Khám phá trung tâm thành phố','Tham quan Dinh Độc Lập, Bưu điện, Nhà thờ Đức Bà.','City highlights','Xe, HDV','Ăn uống cá nhân',1,20,0,790000,'VND','group','active',TRUE);

INSERT IGNORE INTO tour_media (id, tour_id, media_type, media_url, alt_text, sort_order, is_active)
VALUES
(1,1,'cover','https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80','Bà Nà Hills',0,TRUE),
(2,2,'cover','https://images.unsplash.com/photo-1583413232478-8e4a1af9da6f?auto=format&fit=crop&w=1200&q=80','Nhà thờ Đức Bà',0,TRUE);

INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT 1, t.id FROM tags t WHERE t.code IN ('NGHI_DUONG','BIEN','VAN_HOA')
ON DUPLICATE KEY UPDATE tour_id = tour_id;

INSERT IGNORE INTO tour_itinerary_days (id, tour_id, day_number, title, description)
VALUES
(1,1,1,'Ngày 1','Đón khách – tham quan biển – ăn tối.'),
(2,1,2,'Ngày 2','Bà Nà Hills – Cầu Vàng – nghỉ ngơi.');

INSERT IGNORE INTO itinerary_items (id, itinerary_day_id, sequence_no, item_type, title, description, location_name)
VALUES
(1,1,1,'activity','Đón khách','Tập trung tại điểm hẹn','Điểm hẹn trung tâm'),
(2,2,1,'activity','Tham quan Bà Nà','Đi cáp treo và tham quan','Bà Nà Hills');

INSERT IGNORE INTO tour_schedules (
    id, schedule_code, tour_id, departure_at, return_at, status,
    capacity_total, booked_seats,
    adult_price, child_price, infant_price, senior_price,
    booking_open_at, booking_close_at, meeting_point_name, note
) VALUES
(5,'SCH_DN_2026_001',1,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),'open',
30,0,
1500000,1200000,0,1300000,
DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'Sân bay Đà Nẵng','Mang theo giấy tờ tuỳ thân');

INSERT IGNORE INTO tour_schedule_pickup_points (
    id, schedule_id, point_name, address, latitude, longitude, pickup_at, sort_order
) VALUES
(1,5,'Điểm đón trung tâm','Hải Châu, Đà Nẵng',16.06778,108.22083,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),0);

INSERT IGNORE INTO tour_schedule_guides (id, schedule_id, guide_id, guide_role, assigned_at)
VALUES (1,5,1,'main',CURRENT_TIMESTAMP);

-- COMMERCE / PROMOTIONS (minimal)
INSERT IGNORE INTO combo_packages (
    id, code, name, description, base_price, discount_amount, is_active
) VALUES
(6,'COMBO-001','Adventure Combo','Gói add-on nhẹ: nước uống + áo mưa',100000,50000,TRUE);

INSERT IGNORE INTO combo_package_items (
    id, combo_id, item_type, item_ref_id, item_name, quantity, unit_price
) VALUES
(1,6,'addon',NULL,'Nước suối',2,10000),
(2,6,'addon',NULL,'Áo mưa',1,30000);

INSERT IGNORE INTO products (
    id, sku, name, description, product_type, unit_price, is_active
) VALUES
(1,'SIM-4G-01','SIM 4G du lịch','SIM data sử dụng trong 7 ngày','service',150000,TRUE);

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

-- LOYALTY / ENGAGEMENT
INSERT IGNORE INTO travel_passports (id, user_id, passport_no, total_tours, total_destinations, total_checkins, last_trip_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001','PASS-AN-0001',0,0,0,NULL);

INSERT IGNORE INTO badge_definitions (id, code, name, description, icon_url, condition_json, is_active)
VALUES (1,'FIRST_TRIP','Chuyến đi đầu tiên','Hoàn thành chuyến đi đầu tiên',NULL,JSON_OBJECT('type','count_completed_bookings','value',1),TRUE);

INSERT IGNORE INTO passport_badges (id, passport_id, badge_id, unlocked_at)
VALUES (1,1,1,CURRENT_TIMESTAMP);

INSERT IGNORE INTO user_checkins (id, user_id, booking_id, destination_id, checkin_latitude, checkin_longitude, note, created_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',1,2,16.06778,108.22083,'Check-in thử nghiệm',CURRENT_TIMESTAMP);

INSERT IGNORE INTO wishlist_tours (id, user_id, tour_id, created_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',1,CURRENT_TIMESTAMP);

INSERT IGNORE INTO wishlist_destinations (id, user_id, destination_id, created_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',2,CURRENT_TIMESTAMP);

INSERT IGNORE INTO user_tour_views (id, user_id, tour_id, viewed_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',1,CURRENT_TIMESTAMP);

INSERT IGNORE INTO recommendation_logs (
    id, user_id, requested_tag, requested_budget, requested_trip_mode, requested_people_count, requested_departure_at, generated_result, scoring_detail, created_at
) VALUES
(1,'550e8400-e29b-41d4-a716-446655440001','NGHI_DUONG','medium','group',3,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),
 JSON_OBJECT('recommendedTourIds',JSON_ARRAY(1),'reason','match budget and beach'),JSON_OBJECT('scores',JSON_OBJECT('tour:1',0.92)),CURRENT_TIMESTAMP);

INSERT IGNORE INTO audit_logs (
    id, actor_user_id, action_name, entity_name, entity_id, old_data, new_data, ip_address, user_agent, created_at
) VALUES
(1,'550e8400-e29b-41d4-a716-446655440000','CREATE','booking','1',NULL,JSON_OBJECT('bookingId',1,'orderId',42),'127.0.0.1','seed-script',CURRENT_TIMESTAMP);

-- =========================================================
-- FULL COVERAGE SEED (remaining tables from V1)
-- =========================================================

-- DESTINATION SPECIALTIES
INSERT IGNORE INTO destination_specialties (id, destination_id, specialty_name, description)
VALUES
(1,1,'Cà phê sữa đá','Đặc sản cà phê Sài Gòn.'),
(2,2,'Hải sản tươi','Hải sản Đà Nẵng, chế biến tại chỗ.');

-- TOUR SEASONALITY / CHECKLIST
INSERT IGNORE INTO tour_seasonality (id, tour_id, season_name, month_from, month_to, recommendation_score, notes)
VALUES
(1,1,'dry_season',3,9,4.8,'Mùa đẹp, ít mưa.'),
(2,2,'all_year',1,12,4.2,'Đi được quanh năm.');

INSERT IGNORE INTO tour_checklist_items (id, tour_id, item_name, item_group, is_required)
VALUES
(1,1,'CCCD/Hộ chiếu','documents',TRUE),
(2,1,'Kem chống nắng','personal',FALSE);

-- MISSIONS
INSERT IGNORE INTO mission_definitions (id, code, name, description, rule_json, reward_type, reward_value, reward_ref_id, start_at, end_at, is_active)
VALUES
(1,'TOTAL_BOOKINGS','Hoàn thành 1 booking','Nhận thêm điểm thưởng khi hoàn thành booking đầu tiên.',JSON_OBJECT('type','completed_bookings','min',1),'points',100,NULL,NULL,NULL,TRUE);

INSERT IGNORE INTO user_missions (id, user_id, mission_id, progress, goal, status, completed_at)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',1,0,1,'in_progress',NULL);

-- BOOKING PRODUCTS (attach product to booking)
INSERT IGNORE INTO booking_products (id, booking_id, product_id, quantity, unit_price, line_total, is_free_gift)
VALUES (1,1,1,1,150000,150000,FALSE);

-- WEATHER / CROWD / ROUTE
INSERT IGNORE INTO weather_forecasts (
    id, destination_id, forecast_date, weather_code, summary, temp_min, temp_max, humidity_percent, wind_speed, rain_probability, source_name, raw_payload
) VALUES
(1,2,DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY),'clear','Trời nắng đẹp',25.0,32.0,60.0,12.5,10.0,'seed',JSON_OBJECT('provider','seed'));

INSERT IGNORE INTO weather_alerts (
    id, destination_id, schedule_id, severity, alert_type, title, message, action_advice, valid_from, valid_to, is_active
) VALUES
(1,2,5,'info','heat','Nắng nóng nhẹ','Nhiệt độ cao vào buổi trưa, uống đủ nước.','Chuẩn bị nón, nước uống.',CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY),TRUE);

INSERT IGNORE INTO crowd_predictions (
    id, destination_id, prediction_date, crowd_level, predicted_visitors, confidence_score, reasons_json
) VALUES
(1,2,DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY),'high',12000,0.82,JSON_ARRAY('weekend','good_weather'));

INSERT IGNORE INTO route_estimates (
    id, from_label, to_label, from_latitude, from_longitude, to_latitude, to_longitude, distance_km, duration_minutes, google_map_url, source_name
) VALUES
(1,'Sân bay Đà Nẵng','Cầu Rồng',16.0439,108.1994,16.0615,108.2320,6.5,20,'https://maps.google.com/?q=DaNang','seed');

-- PASSPORT VISITED DESTINATIONS
INSERT IGNORE INTO passport_visited_destinations (id, passport_id, destination_id, first_booking_id, first_visited_at, last_visited_at)
VALUES (1,1,2,1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

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

-- ADDONS
INSERT IGNORE INTO addon_definitions (id, code, name, addon_type, description, pricing_mode, unit_price, is_active)
VALUES
(1,'AIRPORT_TRANSFER','Đưa đón sân bay','airport_transfer','Xe đưa đón sân bay 1 chiều','per_booking',250000,TRUE);

INSERT IGNORE INTO booking_addons (id, booking_id, addon_id, addon_name, pricing_mode, quantity, unit_price, discount_amount, line_total, note)
VALUES (1,1,1,'Đưa đón sân bay','per_booking',1,250000,0,250000,'Áp dụng cho 1 booking');

-- PRICE RULES
INSERT IGNORE INTO tour_price_rules (
    id, tour_id, rule_name, rule_type, target_guest_type, adjust_type, adjust_value,
    min_people_count, max_people_count, member_level, booking_from, booking_to, departure_from, departure_to,
    priority_no, is_stackable, is_active
) VALUES
(1,1,'Early bird 10%','early_bird','all','percentage',10,NULL,NULL,NULL,
 DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY),CURRENT_TIMESTAMP,NULL,NULL,1,FALSE,TRUE);

INSERT IGNORE INTO schedule_price_rules (
    id, schedule_id, rule_name, target_guest_type, adjust_type, adjust_value, booking_from, booking_to, priority_no, is_active
) VALUES
(1,5,'Override adult price','adult','override_price',1400000,NULL,NULL,1,TRUE);

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

-- HOTELS / VEHICLES
INSERT IGNORE INTO hotels (
    id, supplier_id, code, name, star_rating, phone, email, province, district, address,
    latitude, longitude, checkin_time, checkout_time, status
) VALUES
(1,1,'HOTEL-DN-001','TravelViet Hotel Danang',4.0,'+842363333333','booking@hotel.local','Đà Nẵng','Hải Châu','Trung tâm Hải Châu',16.06778,108.22083,'14:00','12:00','active');

INSERT IGNORE INTO vehicles (
    id, supplier_id, code, vehicle_type, plate_no, seat_capacity, brand_name, model_name, status
) VALUES
(1,1,'VEH-DN-001','van','43A-123.45',16,'Ford','Transit','active');

-- SCHEDULE RESOURCE ALLOCATIONS
INSERT IGNORE INTO schedule_resource_allocations (
    id, schedule_id, resource_type, resource_ref_id, resource_name, supplier_id, quantity,
    unit_cost, total_cost, allocation_status, note, allocated_at
) VALUES
(1,5,'hotel',1,'TravelViet Hotel Danang',1,1,900000,900000,'confirmed','Đặt phòng cho lịch',CURRENT_TIMESTAMP);

-- DESTINATION PROPOSALS
INSERT IGNORE INTO destination_proposals (
    id, proposal_code, proposed_by, proposal_type, destination_id, name, country_code, province, district, region, address,
    latitude, longitude, short_description, description, evidence_note,
    status, submitted_at, reviewed_by, reviewed_at, review_note
) VALUES
(1,'DP_SEED_00001','550e8400-e29b-41d4-a716-446655440001','update_destination',2,'Đà Nẵng','VN','Đà Nẵng','Hải Châu','Central','Bạch Đằng',
16.06778,108.22083,'Cập nhật mô tả','Bổ sung thông tin điểm check-in mới.','Link bài viết & hình ảnh',
'submitted',CURRENT_TIMESTAMP,'550e8400-e29b-41d4-a716-446655440000',CURRENT_TIMESTAMP,'Đã tiếp nhận');

INSERT IGNORE INTO destination_proposal_attachments (id, proposal_id, file_url, file_type, caption)
VALUES (1,1,'https://images.unsplash.com/photo-1544961371-516024f2d10b?auto=format&fit=crop&w=800&q=80','image','Ảnh minh chứng');

INSERT IGNORE INTO destination_proposal_reviews (id, proposal_id, reviewer_id, decision, note)
VALUES (1,1,'550e8400-e29b-41d4-a716-446655440000','request_update','Vui lòng bổ sung địa chỉ chi tiết và nguồn tham khảo.');

-- SAVED SEARCHES / ITINERARIES
INSERT IGNORE INTO saved_searches (id, user_id, search_name, keyword, filters_json, last_result_count)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001','Tìm tour biển','biển',JSON_OBJECT('tag','BIEN','budget','medium'),5);

INSERT IGNORE INTO saved_itineraries (id, user_id, destination_id, title, note, itinerary_json, is_public)
VALUES (1,'550e8400-e29b-41d4-a716-446655440001',2,'Lịch trình 2 ngày Đà Nẵng','Bản nháp lịch trình',JSON_OBJECT('days',JSON_ARRAY('Ngày 1: biển','Ngày 2: Bà Nà')),FALSE);

-- VOUCHER REDEMPTIONS
INSERT IGNORE INTO voucher_redemptions (id, voucher_id, user_id, order_id, booking_id, redeemed_amount, status, redeemed_at, note)
VALUES (1,5,'550e8400-e29b-41d4-a716-446655440001',42,1,150000,'applied',CURRENT_TIMESTAMP,'Áp dụng voucher cho booking seed');

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

-- TOUR SCHEDULE STATUS HISTORY
INSERT IGNORE INTO tour_schedule_status_history (id, schedule_id, old_status, new_status, changed_by, note, created_at)
VALUES (1,5,NULL,'open','550e8400-e29b-41d4-a716-446655440000','Schedule opened',CURRENT_TIMESTAMP);

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

-- MEDIA FILES / ATTACHMENTS
INSERT IGNORE INTO media_files (
    id, file_key, original_name, mime_type, file_ext, file_size_bytes, storage_provider,
    file_url, thumbnail_url, uploaded_by, is_public, created_at
) VALUES
(1,'seed/destination/da-nang-cover','da-nang.jpg','image/jpeg','jpg',123456,'local',
'https://images.unsplash.com/photo-1544961371-516024f2d10b?auto=format&fit=crop&w=1200&q=80',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE,CURRENT_TIMESTAMP);

INSERT IGNORE INTO file_attachments (
    id, media_file_id, entity_name, entity_id, attachment_role, caption, sort_order, created_at
) VALUES
(1,1,'destination','2','cover','Ảnh cover Đà Nẵng',0,CURRENT_TIMESTAMP);

-- English overlays for destinations/guides live in destination_translations / guide_translations (see V9 + V10__seed_i18n_en_sample.sql).
