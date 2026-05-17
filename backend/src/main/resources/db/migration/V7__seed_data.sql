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

INSERT INTO promotion_campaigns (
    code, name, description, image_url, image_alt, display_title, display_subtitle,
    badge_text, cta_label, cta_url, sort_order, is_featured, start_at, end_at,
    target_member_level, conditions_json, reward_json, is_active
) VALUES
('TEAMBUILDING_SUMMER_2026','Du lịch team building mùa hè 2026','Gói ưu đãi cho doanh nghiệp đặt tour đoàn hè, phù hợp chương trình gắn kết và gala dinner.','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80','Đoàn khách tham gia hoạt động team building ngoài trời','Du lịch — Teambuilding — Gala','Chương trình hè trọn gói cho doanh nghiệp từ 30 khách.','Ưu đãi doanh nghiệp','Xem ưu đãi','/promotions/TEAMBUILDING_SUMMER_2026',1,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 DAY),'silver',JSON_OBJECT('minGuests', 30, 'applicableScope', 'corporate_group', 'advanceBookingDays', 14),JSON_OBJECT('type', 'percentage_discount', 'value', 12, 'maxDiscountAmount', 5000000),TRUE),
('COMPANY_TRIP_2026','Cả công ty cùng đi','Khuyến mãi tour đoàn lớn cho công ty tổ chức du lịch nghỉ dưỡng, hội nghị và gala cuối năm.','https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80','Nhóm nhân viên công ty cùng tham gia chuyến đi','Cả công ty cùng đi','Gói tour trọn gói cho đoàn 50 đến 1000 khách.','Tour đoàn lớn','Nhận tư vấn','/promotions/COMPANY_TRIP_2026',2,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 120 DAY),'gold',JSON_OBJECT('minGuests', 50, 'applicableScope', 'company_trip', 'includesGala', true),JSON_OBJECT('type', 'fixed_amount_discount', 'value', 3000000, 'gift', 'Free gala backdrop'),TRUE),
('FAMILY_CONNECT_2026','Hành trình gắn kết gia đình','Ưu đãi cho gia đình và nhóm bạn đặt tour nghỉ dưỡng, miễn phí tư vấn lịch trình riêng.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80','Gia đình nghỉ dưỡng trên bãi biển','Hành trình gắn kết','Giảm giá cho nhóm gia đình từ 6 khách trở lên.','Gia đình','Đặt tour ngay','/promotions/FAMILY_CONNECT_2026',3,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 75 DAY),'bronze',JSON_OBJECT('minGuests', 6, 'applicableScope', 'family_group', 'advanceBookingDays', 7),JSON_OBJECT('type', 'cashback', 'value', 500000, 'voucherForNextTrip', true),TRUE),
('AUTUMN_VIBE_2026', 'Mùa thu vàng - Chạm khẽ hương thu', 'Giảm giá sâu cho các tour Tây Bắc mùa lúa chín và Hà Nội mùa thu.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80', 'Cánh đồng lúa chín vàng óng', 'Mùa Thu Vàng', 'Giảm tới 15% tour Tây Bắc.', 'Mùa thu', 'Khám phá ngay', '/promotions/AUTUMN_VIBE_2026', 4, TRUE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 DAY), 'bronze', JSON_OBJECT('region', 'North', 'minPurchase', 2000000), JSON_OBJECT('type', 'percentage', 'value', 15), TRUE),
('HONEYMOON_PARADISE', 'Kỳ nghỉ thiên đường cho cặp đôi', 'Tặng gói trang trí phòng lãng mạn và bữa tối dưới ánh nến.', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80', 'Bữa tối lãng mạn ven biển', 'Trăng Mật Ngọt Ngào', 'Tặng bữa tối Steak & Wine.', 'Cặp đôi', 'Xem chi tiết', '/promotions/HONEYMOON_PARADISE', 5, FALSE, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'silver', JSON_OBJECT('minGuests', 2, 'tourType', 'honeymoon'), JSON_OBJECT('gift', 'Romantic Dinner', 'service', 'Room Decor'), TRUE),
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

INSERT INTO customer_testimonials (customer_name, customer_title, content, rating, avatar_url, is_verified, sort_order, is_active) VALUES
('Chị Nguyễn Mai','Nguyen Dinh Chieu - Ho Chi Minh','CÔNG TY TNHH ON VIỆT NAM đặc biệt ấn tượng với sự chuyên nghiệp của THD Travel trong việc thiết kế hành trình nghỉ dưỡng cho ON Việt Nam.',5,'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',TRUE,1,TRUE),
('Chị Thơ Nguyễn','Dong Da - Ha Noi','[Happy Money — Công ty cổ phần TM liên kết Nano] Nhờ sự hỗ trợ tận tâm của THD Travel, chuyến du lịch kết hợp hội thảo của doanh nghiệp chúng tôi diễn ra thuận lợi và trọn vẹn.',5,'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=160&q=80',TRUE,2,TRUE),
('Anh Hùng','Thuy Nguyen - Hai Phong','[Công ty TNHH LITEON] Chuyến đi lần này thực sự ý nghĩa với toàn thể nhân viên.',5,'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',TRUE,3,TRUE),
('Chị Trương Uyển Thanh','An Khanh - Ho Chi Minh','Chi nhánh HCM của Electrolux Vietnam đánh giá cao sự chuyên nghiệp của THD Travel.',5,'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',TRUE,4,TRUE),
('Anh Trần Quốc Bảo', 'CEO - TechVina, Quận 1', 'Chương trình Team Building tại Phan Thiết do THD tổ chức rất sáng động, kịch bản mới lạ, giúp nhân viên gắn kết hơn rất nhiều.', 5, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80', TRUE, 5, TRUE),
('Cô Lâm Gia Linh', 'Nha Trang, Khánh Hòa', 'Gia đình tôi vừa có chuyến nghỉ dưỡng 4 ngày tại Phú Quốc. HDV rất nhiệt tình, đặc biệt là sự chăm sóc chu đáo đối với người lớn tuổi trong đoàn.', 5, 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=160&q=80', TRUE, 6, TRUE),
('Thầy Lê Văn Thành', 'Giảng viên - ĐH Bách Khoa', 'Tour tham quan thực tế tại Địa đạo Củ Chi được tổ chức bài bản. Các em sinh viên rất hào hứng với những kiến thức lịch sử thực tế mà THD cung cấp.', 5, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80', TRUE, 7, TRUE),
('Bạn Minh Tú', 'Food Blogger - Đà Nẵng', 'Lịch trình Food Tour Huế cực kỳ chất lượng. Mình đã được thử những quán địa phương đúng chuẩn mà nếu tự đi chắc chắn không tìm ra.', 5, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80', TRUE, 8, TRUE),
('Mr. Jonathan Wick', 'Tourist from Australia', 'Một trải nghiệm tuyệt vời tại Vịnh Hạ Long. Du thuyền 5 sao sang trọng, đồ ăn ngon và cảnh sắc thì không thể tin nổi. Cảm ơn THD!', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80', TRUE, 9, TRUE),
('Chị Phan Hoàng Yến', 'Dược phẩm Tâm Bình - Hà Nội', 'Cảm ơn THD Travel đã hỗ trợ đoàn 200 người của chúng tôi tại Đà Lạt một cách trơn tru. Gala Dinner thực sự bùng nổ!', 5, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80', TRUE, 10, TRUE),
('Bác Nguyễn Thị Hòa', 'Hưu trí - TP. Thái Bình', 'Tôi rất hài lòng với tour hành hương núi Bà Đen. Xe đưa đón tận nhà, ăn uống hợp khẩu vị người già, HDV nói chuyện rất lễ phép.', 5, 'https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?auto=format&fit=crop&w=160&q=80', TRUE, 11, TRUE),
('Anh chị Đức & Mai', 'Quận Long Biên - Hà Nội', 'Kỳ nghỉ trăng mật tại Sapa thật sự lãng mạn. THD đã bí mật chuẩn bị nến và hoa trong phòng giúp chúng mình rất bất ngờ.', 5, 'https://images.unsplash.com/photo-1516195851888-6f1a981a862e?auto=format&fit=crop&w=160&q=80', TRUE, 12, TRUE),
('Anh Lý Hoàng Nam', 'Quận Bình Thạnh - HCM', 'Trải nghiệm chợ nổi Cái Răng rất thú vị. HDV am hiểu văn hóa vùng miền, kể chuyện rất duyên. Sẽ tiếp tục ủng hộ công ty.', 5, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80', TRUE, 13, TRUE),
('Anh Đỗ Minh Quân', 'Vinhomes Sale Team', 'Chuyến khảo sát thị trường kết hợp nghỉ dưỡng tại Quy Nhơn rất thành công. Dịch vụ xe vận chuyển đời mới, tài xế lái xe an toàn.', 5, 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=160&q=80', TRUE, 14, TRUE),
('Chị Lê Thúy Hạnh', 'Tp. Vinh, Nghệ An', 'Thác Bản Giốc mùa này đẹp quá. Cảm ơn THD đã tư vấn thời điểm đi rất chuẩn để đoàn có những bức ảnh để đời.', 5, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80', TRUE, 15, TRUE),
('Bạn Hoàng Dương', 'Freelancer - HCM', 'Tour 3 đảo Nha Trang đi bằng cano cao tốc rất phê. Lặn ngắm san hô ở Hòn Mun là trải nghiệm không thể quên.', 4, 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=160&q=80', TRUE, 16, TRUE),
('Chị Ngọc Anh', 'Quận Cầu Giấy - Hà Nội', 'Dậy sớm đi săn mây ở Đà Lạt mệt nhưng mà đáng. Ảnh đẹp lung linh luôn, cảm ơn bạn HDV đã chụp hình có tâm cho đoàn.', 5, 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=160&q=80', TRUE, 17, TRUE),
('Anh Phạm Quang Huy', 'Quận 7 - Ho Chi Minh', 'Lần đầu đi camping tại Hồ Dầu Tiếng, dịch vụ chuẩn bị lều trại và BBQ rất đầy đủ. Một cách xả stress cuối tuần tuyệt vời.', 5, 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=160&q=80', TRUE, 18, TRUE),
('Chị Vũ Thanh Tâm', 'Logistics WorldWide', 'Sự chuyên nghiệp từ khâu tư vấn đến khi kết thúc tour. THD luôn phản hồi nhanh các yêu cầu thay đổi đột xuất của đoàn.', 5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80', TRUE, 19, TRUE),
('Bạn Nguyễn Thế Sang', 'Nhiếp ảnh gia tự do', 'Cung đường Hà Giang rất hùng vĩ. Tài xế của THD điềm đạm, xử lý tình huống tốt trên các đoạn cua dốc. Rất an tâm!', 5, 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&q=80', TRUE, 20, TRUE),
('Chị Đặng Thu Thảo', 'Quận 2 - Ho Chi Minh', 'Lâu đài rượu vang đẹp như ở Châu Âu. Tour thiết kế hợp lý, không quá dày đặc giúp gia đình có thời gian nghỉ ngơi.', 5, 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=160&q=80', TRUE, 21, TRUE)

ON DUPLICATE KEY UPDATE 
    customer_title=VALUES(customer_title), 
    content=VALUES(content), 
    rating=VALUES(rating), 
    avatar_url=VALUES(avatar_url), 
    is_verified=VALUES(is_verified), 
    sort_order=VALUES(sort_order), 
    is_active=VALUES(is_active);

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
(1,'5fa85f64-5717-4562-b3fc-2c963f66afa6','HCM','TP. Hồ Chí Minh','tp-ho-chi-minh','VN','TP. Hồ Chí Minh','Quận 1','South','Trung tâm Quận 1',10.7768897,106.7008066,'Thành phố năng động','Trung tâm kinh tế, văn hóa, ẩm thực.',11,4,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(2,'6fa85f64-5717-4562-b3fc-2c963f66afa6','DN','Đà Nẵng','da-nang','VN','Đà Nẵng','Hải Châu','Central','Bạch Đằng',16.06778,108.22083,'Thành phố biển','Cầu Rồng, biển Mỹ Khê, Bà Nà Hills.',3,9,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(3,'7fa85f64-5717-4562-b3fc-2c963f66afa6','HN','Hà Nội','ha-noi','VN','Hà Nội','Hoàn Kiếm','North','Phố Cổ Hà Nội',21.0285,105.8542,'Thủ đô ngàn năm văn hiến','Trung tâm chính trị, văn hóa với Hồ Gươm và 36 phố phường.',9,11,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(4,'8fa85f64-5717-4562-b3fc-2c963f66afa6','HL','Vịnh Hạ Long','vinh-ha-long','VN','Quảng Ninh','Hạ Long','North','Vịnh Hạ Long',20.9101,107.1839,'Kỳ quan thiên nhiên thế giới','Hàng ngàn đảo đá vôi kỳ vĩ và hang động độc đáo.',4,10,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(5,'9fa85f64-5717-4562-b3fc-2c963f66afa6','SP','Sa Pa','sa-pa','VN','Lào Cai','Sa Pa','North','Thị xã Sa Pa',22.3364,103.8438,'Thành phố trong sương','Đỉnh Fansipan, ruộng bậc thang và văn hóa dân tộc đặc sắc.',3,5,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(6,'10a85f64-5717-4562-b3fc-2c963f66afa6','NB','Ninh Bình','ninh-binh','VN','Ninh Bình','Hoa Lư','North','Tràng An',20.2506,105.9744,'Hạ Long trên cạn','Quần thể di sản thế giới Tràng An, Tam Cốc, Bái Đính.',1,4,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(7,'11a85f64-5717-4562-b3fc-2c963f66afa6','HG','Hà Giang','ha-giang','VN','Hà Giang','Đồng Văn','North','Cao nguyên đá Đồng Văn',23.2345,105.2505,'Vùng địa đầu Tổ quốc','Đèo Mã Pì Lèng, cột cờ Lũng Cú và hoa tam giác mạch.',10,12,'low',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(8,'12a85f64-5717-4562-b3fc-2c963f66afa6','MC','Mộc Châu','moc-chau','VN','Sơn La','Mộc Châu','North','Thị trấn Mộc Châu',20.8465,104.6483,'Thiên đường hoa Tây Bắc','Đồi chè trái tim, thác Dải Yếm và rừng thông Bản Áng.',1,3,'medium',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(9,'13a85f64-5717-4562-b3fc-2c963f66afa6','HUI','Huế','hue','VN','Thừa Thiên Huế','Huế','Central','Kinh thành Huế',16.4637,107.5908,'Cố đô trầm mặc','Di sản văn hóa triều Nguyễn, lăng tẩm và ẩm thực cung đình.',1,4,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(10,'14a85f64-5717-4562-b3fc-2c963f66afa6','HOI','Hội An','hoi-an','VN','Quảng Nam','Hội An','Central','Phố cổ Hội An',15.8801,108.3380,'Thương cảng cổ xưa','Dãy nhà vàng rêu phong, đèn lồng rực rỡ và sông Hoài.',2,5,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(11,'15a85f64-5717-4562-b3fc-2c963f66afa6','NT','Nha Trang','nha-trang','VN','Khánh Hòa','Nha Trang','Central','Trần Phú',12.2388,109.1967,'Hòn ngọc Biển Đông','Vịnh biển đẹp thế giới, VinWonders và tháp Bà Ponagar.',1,8,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(12,'16a85f64-5717-4562-b3fc-2c963f66afa6','DL','Đà Lạt','da-lat','VN','Lâm Đồng','Đà Lạt','Central','Hồ Xuân Hương',11.9404,108.4583,'Thành phố ngàn hoa','Khí hậu mát mẻ quanh năm, thung lũng tình yêu và hồ Tuyền Lâm.',11,3,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(13,'17a85f64-5717-4562-b3fc-2c963f66afa6','QB','Phong Nha','phong-nha','VN','Quảng Bình','Bố Trạch','Central','Vườn quốc gia Phong Nha - Kẻ Bàng',17.5110,106.2794,'Vương quốc hang động','Hang Sơn Đoòng, Động Thiên Đường và hang Én.',3,8,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(14,'18a85f64-5717-4562-b3fc-2c963f66afa6','QY','Quy Nhơn','quy-nhon','VN','Bình Định','Quy Nhơn','Central','Eo Gió',13.7767,109.2243,'Thành phố thi ca','Kỳ Co, Eo Gió và vẻ đẹp hoang sơ của biển miền Trung.',3,9,'medium',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(15,'19a85f64-5717-4562-b3fc-2c963f66afa6','PY','Phú Yên','phu-yen','VN','Phú Yên','Tuy An','Central','Gành Đá Đĩa',13.3351,109.3031,'Xứ sở hoa vàng trên cỏ xanh','Gành Đá Đĩa độc đáo, Bãi Xép và tháp Nhạn.',2,8,'low',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(16,'20a85f64-5717-4562-b3fc-2c963f66afa6','MT','Mũi Né','mui-ne','VN','Bình Thuận','Phan Thiết','Central','Đồi Cát Bay',10.9433,108.3062,'Thủ phủ resort','Đồi Cát Bay, Bàu Trắng và các môn thể thao biển.',11,4,'medium',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(17,'21a85f64-5717-4562-b3fc-2c963f66afa6','PQ','Phú Quốc','phu-quoc','VN','Kiên Giang','Phú Quốc','South','Bãi Trường',10.2270,103.9630,'Đảo Ngọc','Thiên đường nghỉ dưỡng biển, vườn quốc gia và Sunset Town.',11,4,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(18,'22a85f64-5717-4562-b3fc-2c963f66afa6','VT','Vũng Tàu','vung-tau','VN','Bà Rịa - Vũng Tàu','Vũng Tàu','South','Bãi Sau',10.3460,107.0843,'Thành phố biển gần Sài Gòn','Tượng Chúa Kitô Vua, hải đăng và ẩm thực hải sản.',1,12,'high',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(19,'23a85f64-5717-4562-b3fc-2c963f66afa6','CT','Cần Thơ','can-tho','VN','Cần Thơ','Ninh Kiều','South','Bến Ninh Kiều',10.0333,105.7833,'Thủ phủ miền Tây','Chợ nổi Cái Răng, vườn trái cây và nét đẹp sông nước.',12,4,'medium',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(20,'24a85f64-5717-4562-b3fc-2c963f66afa6','CD','Côn Đảo','con-dao','VN','Bà Rịa - Vũng Tàu','Côn Đảo','South','Cảng Bến Đầm',8.6821,106.6071,'Địa ngục trần gian xưa','Di tích nhà tù lịch sử và những bãi biển hoang sơ tuyệt đẹp.',3,9,'low',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(21,'25a85f64-5717-4562-b3fc-2c963f66afa6','TN','Tây Ninh','tay-ninh','VN','Tây Ninh','Tây Ninh','South','Núi Bà Đen',11.3688,106.1264,'Vùng đất thánh','Núi Bà Đen, Tòa Thánh Cao Đài và đặc sản muối tôm.',1,5,'medium',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(22,'26a85f64-5717-4562-b3fc-2c963f66afa6','AG','An Giang','an-giang','VN','An Giang','Tịnh Biên','South','Rừng tràm Trà Sư',10.5528,105.0001,'Miền đất tâm linh','Rừng tràm Trà Sư, Miếu Bà Chúa Xứ và núi Cấm.',9,11,'medium',FALSE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(23,'27b85f64-5717-4562-b3fc-2c963f66afa6','SEL','Seoul','seoul','KR','Seoul','Jung-gu','Northeast Asia','Myeongdong',37.5665,126.9780,'Thủ đô Hàn Quốc','Cung điện cổ, K-culture và ẩm thực đường phố.',4,11,'high',TRUE,TRUE,'APPROVED',NULL,'550e8400-e29b-41d4-a716-446655440000',TRUE),
(24, '28a85f64-5717-4562-b3fc-2c963f66afa6', 'TYO', 'Tokyo', 'tokyo', 'JP', 'Tokyo', 'Shinjuku', 'East Asia', 'Shibuya Crossing', 35.6895, 139.6917, 'Thành phố hiện đại nhất Nhật Bản', 'Sự giao thoa giữa truyền thống và công nghệ tương lai.', 3, 5, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(25, '29a85f64-5717-4562-b3fc-2c963f66afa6', 'OSA', 'Osaka', 'osaka', 'JP', 'Osaka', 'Chuo-ku', 'East Asia', 'Dotonbori', 34.6937, 135.5023, 'Nhà bếp của Nhật Bản', 'Nổi tiếng với ẩm thực đường phố và lâu đài Osaka.', 3, 11, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(26, '30a85f64-5717-4562-b3fc-2c963f66afa6', 'KYT', 'Kyoto', 'kyoto', 'JP', 'Kyoto', 'Shimogyo', 'East Asia', 'Gion District', 35.0116, 135.7681, 'Cố đô nghìn năm văn hiến', 'Nơi có hàng ngàn ngôi đền và văn hóa Geisha.', 3, 11, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(27, '31a85f64-5717-4562-b3fc-2c963f66afa6', 'PUS', 'Busan', 'busan', 'KR', 'Busan', 'Haeundae', 'East Asia', 'Haeundae Beach', 35.1796, 129.0756, 'Thành phố cảng sôi động', 'Bãi biển tuyệt đẹp và chợ hải sản Jagalchi.', 5, 10, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(28, '32a85f64-5717-4562-b3fc-2c963f66afa6', 'BKK', 'Bangkok', 'bangkok', 'TH', 'Bangkok', 'Phra Nakhon', 'Southeast Asia', 'Grand Palace', 13.7563, 100.5018, 'Thủ đô của những nụ cười', 'Chùa vàng, mua sắm và ẩm thực đường phố độc đáo.', 11, 2, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(29, '33a85f64-5717-4562-b3fc-2c963f66afa6', 'HKT', 'Phuket', 'phuket', 'TH', 'Phuket', 'Kathu', 'Southeast Asia', 'Patong Beach', 7.8804, 98.3923, 'Thiên đường biển đảo', 'Hòn đảo lớn nhất Thái Lan với làn nước trong xanh.', 11, 4, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(30, '34a85f64-5717-4562-b3fc-2c963f66afa6', 'SIN', 'Singapore', 'singapore', 'SG', 'Singapore', 'Central Business District', 'Southeast Asia', 'Marina Bay Sands', 1.3521, 103.8198, 'Đảo quốc sư tử', 'Thành phố xanh, sạch và hiện đại bậc nhất thế giới.', 1, 12, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(31, '35a85f64-5717-4562-b3fc-2c963f66afa6', 'KUL', 'Kuala Lumpur', 'kuala-lumpur', 'MY', 'Selangor', 'KLCC', 'Southeast Asia', 'Petronas Twin Towers', 3.1390, 101.6869, 'Trái tim của Malaysia', 'Sự pha trộn văn hóa Mã Lai, Hoa và Ấn.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(32, '36a85f64-5717-4562-b3fc-2c963f66afa6', 'TPE', 'Taipei', 'taipei', 'TW', 'Taipei', 'Xinyi', 'East Asia', 'Taipei 101', 25.0330, 121.5654, 'Thủ đô ẩm thực đêm', 'Chợ đêm sôi động và tòa tháp biểu tượng.', 10, 12, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(33, '37a85f64-5717-4562-b3fc-2c963f66afa6', 'DPS', 'Bali', 'bali', 'ID', 'Bali', 'Ubud', 'Southeast Asia', 'Ubud Art Market', -8.4095, 115.1889, 'Đảo của những vị thần', 'Văn hóa Hindu đặc sắc và bãi biển tuyệt mỹ.', 4, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(34, '38a85f64-5717-4562-b3fc-2c963f66afa6', 'HKG', 'Hong Kong', 'hong-kong', 'HK', 'Hong Kong', 'Central', 'East Asia', 'Victoria Peak', 22.3193, 114.1694, 'Cảng thơm rực rỡ', 'Thiên đường mua sắm và ẩm thực Dimsum.', 10, 12, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(35, '39a85f64-5717-4562-b3fc-2c963f66afa6', 'REP', 'Siem Reap', 'siem-reap', 'KH', 'Siem Reap', 'Angkor', 'Southeast Asia', 'Angkor Wat', 13.4125, 103.8670, 'Quần thể đền đài cổ kính', 'Di sản văn hóa thế giới vĩ đại nhất nhân loại.', 11, 2, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(36, '40a85f64-5717-4562-b3fc-2c963f66afa6', 'LPQ', 'Luang Prabang', 'luang-prabang', 'LA', 'Luang Prabang', 'Old Town', 'Southeast Asia', 'Wat Xieng Thong', 19.8833, 102.1333, 'Cố đô yên bình của Lào', 'Nơi lưu giữ vẻ đẹp Phật giáo và kiến trúc Pháp.', 11, 3, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(37, '41a85f64-5717-4562-b3fc-2c963f66afa6', 'PEK', 'Beijing', 'beijing', 'CN', 'Beijing', 'Dongcheng', 'East Asia', 'The Forbidden City', 39.9042, 116.4074, 'Kinh đô vạn lý', 'Tử Cấm Thành và Vạn Lý Trường Thành kỳ vĩ.', 4, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(38, '42a85f64-5717-4562-b3fc-2c963f66afa6', 'SHA', 'Shanghai', 'shanghai', 'CN', 'Shanghai', 'Pudong', 'East Asia', 'The Bund', 31.2304, 121.4737, 'Hòn ngọc Viễn Đông', 'Sự phồn hoa của bến Thượng Hải.', 10, 11, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(39, '43a85f64-5717-4562-b3fc-2c963f66afa6', 'DEL', 'New Delhi', 'new-delhi', 'IN', 'Delhi', 'Central Delhi', 'South Asia', 'India Gate', 28.6139, 77.2090, 'Thủ đô ngàn năm văn hóa', 'Kiến trúc Mughal và sự nhộn nhịp đặc trưng.', 10, 3, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(40, '44a85f64-5717-4562-b3fc-2c963f66afa6', 'AGR', 'Agra', 'agra', 'IN', 'Uttar Pradesh', 'Agra', 'South Asia', 'Taj Mahal', 27.1751, 78.0421, 'Thành phố của tình yêu', 'Nơi tọa lạc của kỳ quan Taj Mahal.', 11, 2, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(41, '45a85f64-5717-4562-b3fc-2c963f66afa6', 'MLE', 'Maldives', 'maldives', 'MV', 'Male', 'Kaafu', 'South Asia', 'Male Atoll', 4.1755, 73.5093, 'Thiên đường hạ giới', 'Resort trên mặt nước và biển xanh ngọc bích.', 11, 4, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(42, '46a85f64-5717-4562-b3fc-2c963f66afa6', 'DXB', 'Dubai', 'dubai', 'AE', 'Dubai', 'Downtown Dubai', 'Middle East', 'Burj Khalifa', 25.2048, 55.2708, 'Thành phố của những kỷ lục', 'Sự xa hoa bậc nhất giữa lòng sa mạc.', 11, 3, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(43, '47a85f64-5717-4562-b3fc-2c963f66afa6', 'DOH', 'Doha', 'doha', 'QA', 'Ad-Dawhah', 'Doha', 'Middle East', 'Souq Waqif', 25.2854, 51.5310, 'Viên ngọc vùng Vịnh', 'Sự kết hợp giữa nghệ thuật hiện đại và truyền thống.', 11, 3, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(44, '48a85f64-5717-4562-b3fc-2c963f66afa6', 'PAR', 'Paris', 'paris', 'FR', 'Île-de-France', 'Paris', 'Europe', 'Eiffel Tower', 48.8566, 2.3522, 'Kinh đô ánh sáng', 'Thành phố lãng mạn với tháp Eiffel và bảo tàng Louvre.', 5, 9, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(45, '49a85f64-5717-4562-b3fc-2c963f66afa6', 'ROM', 'Rome', 'rome', 'IT', 'Lazio', 'Rome', 'Europe', 'Colosseum', 41.9028, 12.4964, 'Thành phố vĩnh cửu', 'Cái nôi của văn minh La Mã.', 4, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(46, '50a85f64-5717-4562-b3fc-2c963f66afa6', 'VCE', 'Venice', 'venice', 'IT', 'Veneto', 'Venice', 'Europe', 'St. Mark Square', 45.4408, 12.3155, 'Thành phố trên nước', 'Những con kênh đào lãng mạn và thuyền Gondola.', 4, 6, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(47, '51a85f64-5717-4562-b3fc-2c963f66afa6', 'LON', 'London', 'london', 'GB', 'Greater London', 'Westminster', 'Europe', 'Big Ben', 51.5074, -0.1278, 'Thủ đô sương mù', 'Di sản hoàng gia và các bảo tàng tầm cỡ thế giới.', 6, 8, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(48, '52a85f64-5717-4562-b3fc-2c963f66afa6', 'AMS', 'Amsterdam', 'amsterdam', 'NL', 'North Holland', 'Amsterdam', 'Europe', 'Dam Square', 52.3676, 4.9041, 'Thành phố xe đạp', 'Hệ thống kênh đào và vườn hoa Tulip.', 4, 5, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(49, '53a85f64-5717-4562-b3fc-2c963f66afa6', 'BCN', 'Barcelona', 'barcelona', 'ES', 'Catalonia', 'Barcelona', 'Europe', 'Sagrada Familia', 41.3851, 2.1734, 'Thành phố của kiến trúc Gaudi', 'Nổi tiếng với bãi biển và câu lạc bộ bóng đá FCB.', 5, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(50, '54a85f64-5717-4562-b3fc-2c963f66afa6', 'MAD', 'Madrid', 'madrid', 'ES', 'Madrid', 'Madrid', 'Europe', 'Royal Palace', 40.4168, -3.7038, 'Trái tim của Tây Ban Nha', 'Bảo tàng nghệ thuật và cuộc sống đêm sôi động.', 4, 10, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(51, '55a85f64-5717-4562-b3fc-2c963f66afa6', 'BER', 'Berlin', 'berlin', 'DE', 'Berlin', 'Berlin', 'Europe', 'Brandenburg Gate', 52.5200, 13.4050, 'Thành phố lịch sử', 'Sự kết hợp giữa quá khứ đau thương và sáng tạo hiện đại.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(52, '56a85f64-5717-4562-b3fc-2c963f66afa6', 'MUC', 'Munich', 'munich', 'DE', 'Bavaria', 'Munich', 'Europe', 'Marienplatz', 48.1351, 11.5820, 'Thành phố bia và lễ hội', 'Quê hương của lễ hội Oktoberfest.', 9, 10, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(53, '57a85f64-5717-4562-b3fc-2c963f66afa6', 'PRG', 'Prague', 'prague', 'CZ', 'Prague', 'Prague 1', 'Europe', 'Charles Bridge', 50.0755, 14.4378, 'Thành phố vàng', 'Kiến trúc cổ tích đẹp nhất Đông Âu.', 5, 9, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(54, '58a85f64-5717-4562-b3fc-2c963f66afa6', 'VIE', 'Vienna', 'vienna', 'AT', 'Vienna', 'Innere Stadt', 'Europe', 'Schönbrunn Palace', 48.2082, 16.3738, 'Thành phố âm nhạc cổ điển', 'Thủ đô của nghệ thuật và những quán cà phê cổ.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(55, '59a85f64-5717-4562-b3fc-2c963f66afa6', 'ZRH', 'Zurich', 'zurich', 'CH', 'Zurich', 'Altstadt', 'Europe', 'Lake Zurich', 47.3769, 8.5417, 'Trung tâm tài chính thế giới', 'Thành phố sạch nhất với phong cảnh hồ và núi.', 6, 8, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(56, '60a85f64-5717-4562-b3fc-2c963f66afa6', 'ATH', 'Athens', 'athens', 'GR', 'Attica', 'Athens', 'Europe', 'Acropolis', 37.9838, 23.7275, 'Cái nôi văn minh phương Tây', 'Những tàn tích cổ đại hùng vĩ.', 5, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(57, '61a85f64-5717-4562-b3fc-2c963f66afa6', 'SNT', 'Santorini', 'santorini', 'GR', 'South Aegean', 'Thira', 'Europe', 'Oia', 36.3932, 25.4615, 'Hòn đảo của những giấc mơ', 'Mái vòm xanh và hoàng hôn đẹp nhất thế giới.', 5, 9, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(58, '62a85f64-5717-4562-b3fc-2c963f66afa6', 'IST', 'Istanbul', 'istanbul', 'TR', 'Istanbul', 'Fatih', 'Eurasia', 'Hagia Sophia', 41.0082, 28.9784, 'Giao điểm Á - Âu', 'Sự pha trộn độc đáo giữa Hồi giáo và Thiên chúa giáo.', 4, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(59, '63a85f64-5717-4562-b3fc-2c963f66afa6', 'LIS', 'Lisbon', 'lisbon', 'PT', 'Lisbon', 'Alfama', 'Europe', 'Belem Tower', 38.7223, -9.1393, 'Thành phố của những ngọn đồi', 'Ẩm thực hải sản và những chiếc xe điện màu vàng.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(60, '64a85f64-5717-4562-b3fc-2c963f66afa6', 'HEL', 'Helsinki', 'helsinki', 'FI', 'Uusimaa', 'Helsinki', 'Europe', 'Helsinki Cathedral', 60.1699, 24.9384, 'Thủ đô hạnh phúc nhất', 'Kiến trúc tối giản và văn hóa xông hơi.', 6, 8, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(61, '65a85f64-5717-4562-b3fc-2c963f66afa6', 'CPH', 'Copenhagen', 'copenhagen', 'DK', 'Capital Region', 'Indre By', 'Europe', 'Nyhavn', 55.6761, 12.5683, 'Xứ sở cổ tích', 'Kênh đào đầy màu sắc và tượng Nàng tiên cá.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(62, '66a85f64-5717-4562-b3fc-2c963f66afa6', 'OSL', 'Oslo', 'oslo', 'NO', 'Oslo', 'Sentrum', 'Europe', 'Vigeland Park', 59.9139, 10.7522, 'Cửa ngõ vào các Vịnh hẹp', 'Bảo tàng tàu Viking và thiên nhiên hùng vĩ.', 6, 8, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(63, '67a85f64-5717-4562-b3fc-2c963f66afa6', 'REK', 'Reykjavik', 'reykjavik', 'IS', 'Capital Region', 'Reykjavik', 'Europe', 'Hallgrimskirkja', 64.1265, -21.8174, 'Xứ sở băng và lửa', 'Cực quang và suối nước nóng Blue Lagoon.', 6, 8, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(64, '68a85f64-5717-4562-b3fc-2c963f66afa6', 'NYC', 'New York', 'new-york', 'US', 'New York', 'Manhattan', 'North America', 'Times Square', 40.7128, -74.0060, 'Thành phố không bao giờ ngủ', 'Trung tâm kinh tế, văn hóa và giải trí toàn cầu.', 4, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(65, '69a85f64-5717-4562-b3fc-2c963f66afa6', 'LAX', 'Los Angeles', 'los-angeles', 'US', 'California', 'Hollywood', 'North America', 'Walk of Fame', 34.0522, -118.2437, 'Kinh đô điện ảnh', 'Bãi biển Santa Monica và biểu tượng Hollywood.', 1, 12, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(66, '70a85f64-5717-4562-b3fc-2c963f66afa6', 'SFO', 'San Francisco', 'san-francisco', 'US', 'California', 'San Francisco', 'North America', 'Golden Gate Bridge', 37.7749, -122.4194, 'Thành phố bên vịnh', 'Cầu Cổng Vàng và những con dốc đặc trưng.', 9, 11, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(67, '71a85f64-5717-4562-b3fc-2c963f66afa6', 'LAS', 'Las Vegas', 'las-vegas', 'US', 'Nevada', 'The Strip', 'North America', 'Bellagio Fountains', 36.1699, -115.1398, 'Thủ đô giải trí thế giới', 'Casino rực rỡ và các show diễn đẳng cấp.', 3, 5, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(68, '72a85f64-5717-4562-b3fc-2c963f66afa6', 'WAS', 'Washington D.C.', 'washington-dc', 'US', 'District of Columbia', 'National Mall', 'North America', 'The White House', 38.9072, -77.0369, 'Trung tâm quyền lực Mỹ', 'Nơi có Nhà Trắng và các bảo tàng Smithsonian.', 3, 5, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(69, '73a85f64-5717-4562-b3fc-2c963f66afa6', 'CHI', 'Chicago', 'chicago', 'US', 'Illinois', 'The Loop', 'North America', 'Millennium Park', 41.8781, -87.6298, 'Thành phố lộng gió', 'Kiến trúc chọc trời và món pizza đế dày.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(70, '74a85f64-5717-4562-b3fc-2c963f66afa6', 'TOR', 'Toronto', 'toronto', 'CA', 'Ontario', 'Downtown', 'North America', 'CN Tower', 43.6532, -79.3832, 'Thành phố đa văn hóa', 'Tháp CN và thác nước Niagara hùng vĩ.', 6, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(71, '75a85f64-5717-4562-b3fc-2c963f66afa6', 'VAN', 'Vancouver', 'vancouver', 'CA', 'British Columbia', 'Downtown', 'North America', 'Stanley Park', 49.2827, -123.1207, 'Thành phố giữa núi và biển', 'Cảnh quan thiên nhiên tuyệt đẹp và không khí trong lành.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(72, '76a85f64-5717-4562-b3fc-2c963f66afa6', 'MEX', 'Mexico City', 'mexico-city', 'MX', 'CDMX', 'Zocalo', 'North America', 'Chapultepec Castle', 19.4326, -99.1332, 'Thành phố của những cung điện', 'Ẩm thực đường phố và di tích Aztec.', 3, 5, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(73, '77a85f64-5717-4562-b3fc-2c963f66afa6', 'CUN', 'Cancun', 'cancun', 'MX', 'Quintana Roo', 'Hotel Zone', 'North America', 'Chichen Itza', 21.1619, -86.8515, 'Thiên đường nghỉ dưỡng biển', 'Bãi biển Caribe và di tích Maya.', 12, 4, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(74, '78a85f64-5717-4562-b3fc-2c963f66afa6', 'SYD', 'Sydney', 'sydney', 'AU', 'New South Wales', 'Sydney CBD', 'Oceania', 'Opera House', -33.8688, 151.2093, 'Biểu tượng của nước Úc', 'Nhà hát Con Sò và bãi biển Bondi.', 9, 11, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(75, '79a85f64-5717-4562-b3fc-2c963f66afa6', 'MEL', 'Melbourne', 'melbourne', 'AU', 'Victoria', 'Melbourne CBD', 'Oceania', 'Federation Square', -37.8136, 144.9631, 'Thành phố nghệ thuật và cà phê', 'Văn hóa cafe độc đáo và các con hẻm nghệ thuật.', 3, 5, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(76, '80a85f64-5717-4562-b3fc-2c963f66afa6', 'AKL', 'Auckland', 'auckland', 'NZ', 'Auckland', 'Central', 'Oceania', 'Sky Tower', -36.8485, 174.7633, 'Thành phố của những cánh buồm', 'Cảng biển rực rỡ và những ngọn núi lửa đã tắt.', 12, 3, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(77, '81a85f64-5717-4562-b3fc-2c963f66afa6', 'ZQN', 'Queenstown', 'queenstown', 'NZ', 'Otago', 'Queenstown', 'Oceania', 'Lake Wakatipu', -45.0312, 168.6626, 'Thủ đô phiêu lưu thế giới', 'Nhảy Bungee, trượt tuyết và leo núi.', 12, 2, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(78, '82a85f64-5717-4562-b3fc-2c963f66afa6', 'GIG', 'Rio de Janeiro', 'rio-de-janeiro', 'BR', 'Rio de Janeiro', 'Copacabana', 'South America', 'Christ the Redeemer', -22.9068, -43.1729, 'Vũ điệu Samba rực lửa', 'Tượng Chúa Cứu Thế và lễ hội Carnival.', 12, 3, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(79, '83a85f64-5717-4562-b3fc-2c963f66afa6', 'BUE', 'Buenos Aires', 'buenos-aires', 'AR', 'Buenos Aires', 'Palermo', 'South America', 'Casa Rosada', -34.6037, -58.3816, 'Paris của Nam Mỹ', 'Vũ điệu Tango và ẩm thực thịt nướng.', 3, 5, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(80, '84a85f64-5717-4562-b3fc-2c963f66afa6', 'CUZ', 'Cusco', 'cusco', 'PE', 'Cusco', 'Urubamba', 'South America', 'Machu Picchu', -13.5319, -71.9675, 'Thành phố của đế chế Inca', 'Cổng vào Machu Picchu huyền bí.', 5, 9, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(81, '85a85f64-5717-4562-b3fc-2c963f66afa6', 'CPT', 'Cape Town', 'cape-town', 'ZA', 'Western Cape', 'City Bowl', 'Africa', 'Table Mountain', -33.9249, 18.4241, 'Thành phố đẹp nhất Châu Phi', 'Núi Bàn và các vườn rượu vang tuyệt đẹp.', 11, 3, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(82, '86a85f64-5717-4562-b3fc-2c963f66afa6', 'CAI', 'Cairo', 'cairo', 'EG', 'Cairo', 'Giza', 'Africa', 'Great Pyramid of Giza', 30.0444, 31.2357, 'Thành phố của Kim Tự Tháp', 'Khám phá nền văn minh cổ đại bên dòng sông Nile.', 10, 4, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE),
(83, '87a85f64-5717-4562-b3fc-2c963f66afa6', 'RAK', 'Marrakech', 'marrakech', 'MA', 'Marrakesh-Safi', 'Medina', 'Africa', 'Jemaa el-Fnaa', 31.6295, -7.9811, 'Thành phố đỏ', 'Chợ truyền thống nhộn nhịp và cung điện Moorish.', 3, 5, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE);


INSERT IGNORE INTO destination_media (id, destination_id, media_type, media_url, alt_text, sort_order, is_active)
VALUES
(1,1,'cover','https://ik.imagekit.io/tvlk/blog/2023/08/cong-vien-ben-bach-dang-3.png?tr=q-70,c-at_max,w-500,h-250,dpr-2','Bến Bạch Đằng',0,TRUE),
(2,2,'cover','https://ik.imagekit.io/tvlk/blog/2024/10/cau-rong-da-nang-7.png?tr=q-70,c-at_max,w-500,h-250,dpr-2','Cầu Rồng Đà Nẵng',0,TRUE),
(3,3,'cover','https://imagevietnam.vnanet.vn//MediaUpload/Org/2024/10/10/ha-noi10-10-45-27.jpg','Thủ đô Hà Nội',0,TRUE),
(4,4,'cover','https://dulichkhatvongviet.com/wp-content/uploads/2016/04/vinh-ha-long.jpg','Vịnh Hạ Long kỳ vĩ',0,TRUE),
(5,5,'cover','https://cattour.vn/images/upload/images/Sapa/sapa-trong-suong/sapatrongsuong2.png','Sapa mù sương',0,TRUE),
(6,6,'cover','https://images.vietnamtourism.gov.vn/vn//images/2021/trang_an.jpg','Quần thể Tràng An',0,TRUE),
(7,7,'cover','https://media.vietravel.com/images/Content/du-lich-cao-nguyen-da-dong-van-1.jpg','Cao nguyên đá Hà Giang',0,TRUE),
(8,8,'cover','https://cdn3.ivivu.com/2023/02/%C4%90%E1%BB%93i-ch%C3%A8-M%E1%BB%99c-Ch%C3%A2u-ivivu-1.jpg','Đồi chè Mộc Châu',0,TRUE),
(9,9,'cover','https://statics.vinpearl.com/dai-noi-hue_1749523018.jpg','Đại nội Huế',0,TRUE),
(10,10,'cover','https://ik.imagekit.io/tvlk/blog/2023/10/BMtB3OPW-anhvo2804-180216040226-Hoi-an-1.jpg?tr=q-70,c-at_max,w-500,h-250,dpr-2','Phố cổ Hội An về đêm',0,TRUE),
(11,11,'cover','https://ik.imagekit.io/tvlk/blog/2022/06/bai-tam-dep-o-nha-trang-1.jpg?tr=q-70,c-at_max,w-500,h-250,dpr-2','Bờ biển Nha Trang',0,TRUE),
(12,12,'cover','https://s3-ap-southeast-1.amazonaws.com/cntatr-assets-ap-southeast-1-250226768838-55a62c9399d4d8a6/2023/01/ho-xuan-huong-da-lat-1.jpg?tr=q-70,c-at_max,w-1000,h-600','Hồ Xuân Hương Đà Lạt',0,TRUE),
(13,13,'cover','https://media.vietravel.com/images/Content/du-lich-phong-nha-ke-bang-01.png','Động Phong Nha',0,TRUE),
(14,14,'cover','https://i1-dulich.vnecdn.net/2023/05/17/2-2-1684296816.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=UKDsFltxA9CsYlIcpkmjtA','Bình minh Quy Nhơn',0,TRUE),
(15,15,'cover','https://statics.vinpearl.com/ganh-da-dia-phu-yen_1751078702.jpg','Gành Đá Đĩa Phú Yên',0,TRUE),
(16,16,'cover','https://bbt.1cdn.vn/2022/12/09/doi-cat.jpg','Đồi cát Mũi Né',0,TRUE),
(17,17,'cover','https://cdn3.ivivu.com/2024/09/thi-tran-hoang-hon-ivivu-2-1536x1152.jpg','Hoàng hôn Phú Quốc',0,TRUE),
(18,18,'cover','https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/B%C3%A3i_sau%2C_V%C5%A9ng_T%C3%A0u%2C_02_2014.JPG/500px-B%C3%A3i_sau%2C_V%C5%A9ng_T%C3%A0u%2C_02_2014.JPG','Bãi Sau Vũng Tàu',0,TRUE),
(19,19,'cover','https://baocantho.com.vn/image/fckeditor/upload/2025/20251224/images/t13b1%20song%2061.webp','Sông nước Cần Thơ',0,TRUE),
(20,20,'cover','https://cdn3.ivivu.com/2018/03/mua-he-ve-con-dao-ngam-bien-troi-xanh-ngat-ivivu-1.jpg','Biển Côn Đảo xanh ngắt',0,TRUE),
(21,21,'cover','https://cdn2.ivivu.com/2023/02/06/16/ivivu-nui-ba-den-570x320.gif','Núi Bà Đen Tây Ninh',0,TRUE),
(22,22,'cover','https://i1-dulich.vnecdn.net/2023/10/18/TS11-8180-1697622340.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Yd4OyPJ2_Ff9dlD5Znylzw','Rừng tràm An Giang',0,TRUE),
(23,23,'cover','https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80','Seoul về đêm',0,TRUE),
(24, 24, 'cover', 'https://media.istockphoto.com/id/1390815938/vi/anh/th%C3%A0nh-ph%E1%BB%91-tokyo-%E1%BB%9F-nh%E1%BA%ADt-b%E1%BA%A3n.jpg?s=2048x2048&w=is&k=20&c=uVvXxODRxNjAfiQp2uTAY7VxuwkKpvNrHffnqKw4RXo=', 'Tokyo Cityscape', 0, TRUE),
(25, 25, 'cover', 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=1200', 'Osaka Dotonbori', 0, TRUE),
(26, 26, 'cover', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200', 'Kyoto Pagoda', 0, TRUE),
(27, 27, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Haeundae_Beach_May_2024.jpg/500px-Haeundae_Beach_May_2024.jpg', 'Busan Beach', 0, TRUE),
(28, 28, 'cover', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/e3/e6/92/caption.jpg?w=2400&h=-1&s=1&cx=1920&cy=1080&chk=v1_cd56231660940ec6f969', 'Bangkok Temple', 0, TRUE),
(29, 29, 'cover', 'https://ik.imagekit.io/tvlk/blog/2023/08/shutterstock_1122451769-1.jpg?tr=q-70,c-at_max,w-500,h-250,dpr-2', 'Phuket Islands', 0, TRUE),
(30, 30, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Marina_Bay_Sands_in_the_evening_-_20101120.jpg/500px-Marina_Bay_Sands_in_the_evening_-_20101120.jpg', 'Singapore Marina Bay Sands', 0, TRUE),
(31, 31, 'cover', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200', 'Kuala Lumpur Petronas Towers', 0, TRUE),
(32, 32, 'cover', 'https://ik.imagekit.io/tvlk/blog/2022/12/thap-taipei-101-2.png?tr=q-70,c-at_max,w-500,h-250,dpr-2', 'Taipei 101', 0, TRUE),
(33, 33, 'cover', 'https://static.mybalitrips.com/media/45608/responsive-images/tegallalang-compressed___responsive-webp_1280_853.webp', 'Bali Terrace', 0, TRUE),
(34, 34, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Hong_Kong_Night_Skyline.jpg/1920px-Hong_Kong_Night_Skyline.jpg', 'Hong Kong Skyline', 0, TRUE),
(35, 35, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Buddhist_monks_in_front_of_the_Angkor_Wat.jpg/500px-Buddhist_monks_in_front_of_the_Angkor_Wat.jpg', 'Siem Reap Angkor Wat', 0, TRUE),
(36, 36, 'cover', 'https://images.unsplash.com/photo-1544161513-0179fe746fd5?w=1200', 'Luang Prabang', 0, TRUE),
(37, 37, 'cover', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200', 'Beijing Great Wall', 0, TRUE),
(38, 38, 'cover', 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=1200', 'Shanghai Pudong', 0, TRUE),
(39, 39, 'cover', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200', 'New Delhi India Gate', 0, TRUE),
(40, 40, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/500px-Taj_Mahal_%28Edited%29.jpeg', 'Agra Taj Mahal', 0, TRUE),
(41, 41, 'cover', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200', 'Maldives Resort', 0, TRUE),
(42, 42, 'cover', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 'Dubai Burj Khalifa', 0, TRUE),
(43, 43, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Doha_skyline_in_the_morning_%2812544910974%29.jpg/1920px-Doha_skyline_in_the_morning_%2812544910974%29.jpg', 'Doha Skyline', 0, TRUE),
(44, 44, 'cover', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200', 'Paris Eiffel Tower', 0, TRUE),
(45, 45, 'cover', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200', 'Rome Colosseum', 0, TRUE),
(46, 46, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/View_of_the_Grand_Canal_from_Rialto_to_Ca%27Foscari.jpg/960px-View_of_the_Grand_Canal_from_Rialto_to_Ca%27Foscari.jpg', 'Venice Canal', 0, TRUE),
(47, 47, 'cover', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 'London Big Ben', 0, TRUE),
(48, 48, 'cover', 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200', 'Amsterdam Canal', 0, TRUE),
(49, 49, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/%CE%A3%CE%B1%CE%B3%CF%81%CE%AC%CE%B4%CE%B1_%CE%A6%CE%B1%CE%BC%CE%AF%CE%BB%CE%B9%CE%B1_2941.jpg/500px-%CE%A3%CE%B1%CE%B3%CF%81%CE%AC%CE%B4%CE%B1_%CE%A6%CE%B1%CE%BC%CE%AF%CE%BB%CE%B9%CE%B1_2941.jpg', 'Barcelona Sagrada Familia', 0, TRUE),
(50, 50, 'cover', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200', 'Madrid Royal Palace', 0, TRUE),
(51, 51, 'cover', 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?w=1200', 'Berlin Brandenburg Gate', 0, TRUE),
(52, 52, 'cover', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 'Munich City', 0, TRUE),
(53, 53, 'cover', 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1200', 'Prague Old Town', 0, TRUE),
(54, 54, 'cover', 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200', 'Vienna Opera House', 0, TRUE),
(55, 55, 'cover', 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200', 'Zurich Lake', 0, TRUE),
(56, 56, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/1029_Acropolis_of_Athens_in_Greece_at_night_Photo_by_Giles_Laurent.jpg/960px-1029_Acropolis_of_Athens_in_Greece_at_night_Photo_by_Giles_Laurent.jpg', 'Athens Acropolis', 0, TRUE),
(57, 57, 'cover', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200', 'Santorini Oia', 0, TRUE),
(58, 58, 'cover', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 'Istanbul Mosque', 0, TRUE),
(59, 59, 'cover', 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200', 'Lisbon Tram', 0, TRUE),
(60, 60, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Helsinki_July_2013-27a.jpg/500px-Helsinki_July_2013-27a.jpg', 'Helsinki Cathedral', 0, TRUE),
(61, 61, 'cover', 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=1200', 'Copenhagen Nyhavn', 0, TRUE),
(62, 62, 'cover', 'https://www.dailyscandinavian.com/wp-content/uploads/2017/08/180817-tjuvholmen-oslo.jpg', 'Oslo Waterfront', 0, TRUE),
(63, 63, 'cover', 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1200', 'Iceland Landscape', 0, TRUE),
(64, 64, 'cover', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200', 'New York Times Square', 0, TRUE),
(65, 65, 'cover', 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=1200', 'Los Angeles Hollywood', 0, TRUE),
(66, 66, 'cover', 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200', 'San Francisco Golden Gate', 0, TRUE),
(67, 67, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Las_Vegas_Strip_09_2017_4897.jpg/960px-Las_Vegas_Strip_09_2017_4897.jpg', 'Las Vegas Strip', 0, TRUE),
(68, 68, 'cover', 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=1200', 'Washington DC Capitol', 0, TRUE),
(69, 69, 'cover', 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=1200', 'Chicago Skyline', 0, TRUE),
(70, 70, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Toronto_-_ON_-_Toronto_Harbourfront7.jpg/500px-Toronto_-_ON_-_Toronto_Harbourfront7.jpg', 'Toronto CN Tower', 0, TRUE),
(71, 71, 'cover', 'https://images.unsplash.com/photo-1559511260-66a654ae982a?w=1200', 'Vancouver Harbor', 0, TRUE),
(72, 72, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg/960px-Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg', 'Mexico City', 0, TRUE),
(73, 73, 'cover', 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=1200', 'Cancun Beach', 0, TRUE),
(74, 74, 'cover', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200', 'Sydney Opera House', 0, TRUE),
(75, 75, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/CBD_Melbourne.jpg/960px-CBD_Melbourne.jpg', 'Melbourne City', 0, TRUE),
(76, 76, 'cover', 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200', 'Auckland Harbor', 0, TRUE),
(77, 77, 'cover', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Lake_Whakatipu_from_Queenstown.jpg/500px-Lake_Whakatipu_from_Queenstown.jpg', 'Queenstown Lake', 0, TRUE),
(78, 78, 'cover', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200', 'Rio De Janeiro', 0, TRUE),
(79, 79, 'cover', 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200', 'Buenos Aires', 0, TRUE),
(80, 80, 'cover', 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200', 'Machu Picchu', 0, TRUE),
(81, 81, 'cover', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200', 'Cape Town Table Mountain', 0, TRUE),
(82, 82, 'cover', 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200', 'Giza Pyramids', 0, TRUE),
(83, 83, 'cover', 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200', 'Marrakech Medina', 0, TRUE);

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

-- ============================================================
-- Bổ sung: destination_foods / activities / tips / events cho destination_id 23–83
-- (điểm đến quốc tế; destination 1–22 đã có ở khối seed phía trên)
-- ============================================================

-- destination_foods: bổ sung destination_id 23–83
INSERT IGNORE INTO destination_foods (id, destination_id, food_name, description, is_featured)
VALUES
(23,23,'Kimchi & thịt nướng','Ẩm thực Myeongdong, chợ Gwangjang và quán nướng Hàn Quốc.',TRUE),
(24,24,'Ramen & sushi','Ramen ga Shinjuku, sushi tươi Toyosu và đồ ăn konbini.',TRUE),
(25,25,'Takoyaki & okonomiyaki','Dotonbori: bánh bạch tuộc và bánh xèo Osaka đặc trưng.',TRUE),
(26,26,'Kaiseki & matcha','Trà đạo Uji, wagashi và bữa kaiseki tinh tế cố đô.',TRUE),
(27,27,'Hoe & chả cá','Chợ Jagalchi: cá sống trộn cơm và hải sản nướng Busan.',TRUE),
(28,28,'Pad Thai & tom yum','Xe đẩy Michelin, tom yum và mì thuyền Bangkok.',TRUE),
(29,29,'Hải sản nướng','Tôm hùm, ghẹ sốt ớt và bar bãi biển Phuket.',TRUE),
(30,30,'Chilli crab & laksa','Cua sốt ớt và laksa Peranakan Singapore.',TRUE),
(31,31,'Nasi lemak & satay','Cơm dừa, satay Jalan Alor và roti canai.',TRUE),
(32,32,'Mì bò Đài Loan & trà sữa','Chợ đêm Shilin, mì bò và trà sân bay Đào Viên.',TRUE),
(33,33,'Babi guling & sate lilit','Heo quay Bali, sate lilit và lawar địa phương.',TRUE),
(34,34,'Dim sum & tart trứng','Trà chiều Central, dim sum và bánh tart Hong Kong.',TRUE),
(35,35,'Amok & num banh chok','Cà ri amok Khmer và bún num banh chok Siem Reap.',TRUE),
(36,36,'Xôi nếp nướng & salad','Chợ sáng ven Mekong và món ăn Lào nhẹ nhàng.',TRUE),
(37,37,'Vịt quay Bắc Kinh','Vịt quay da giòn, quán hutong và lẩu cừu nội địa.',TRUE),
(38,38,'Tiểu long bao','Bánh bao Thượng Hải Nam Tường và món Hồ Nam.',TRUE),
(39,39,'Butter chicken & paratha','Ẩm thực Ấn tại Connaught Place và Old Delhi.',TRUE),
(40,40,'Petha & chaat','Kẹo bí Agra và chaat đường phố gần Taj Mahal.',TRUE),
(41,41,'Cá nướng & salad','Hải sản tươi resort, cá nướng than và salad rong biển.',TRUE),
(42,42,'Machboos & cà phê Ả Rập','Cơm machboos vùng Vịnh và cà phê Arabic Dubai.',TRUE),
(43,43,'Machboos & chà là','Souq Waqif, cơm gia vị và tráng miệng chà là Qatar.',TRUE),
(44,44,'Croissant & phô mai','Bánh sừng bò, phô mai và bistro vỉa hè Paris.',TRUE),
(45,45,'Carbonara & gelato','Carbonara, cacio e pepe và gelato Rome.',TRUE),
(46,46,'Cicchetti & risotto','Ăn vặt ven kênh và risotto hải sản Venice.',TRUE),
(47,47,'Fish & chips','Pub London, fish & chips và chợ Borough.',TRUE),
(48,48,'Stroopwafel & herring','Bánh quế caramel và cá trích Amsterdam.',TRUE),
(49,49,'Paella & tapas','Paella hải sản và tapas Barcelona.',TRUE),
(50,50,'Churros & jamón','Churros socola và jamón Iberico Madrid.',TRUE),
(51,51,'Currywurst & döner','Currywurst và döner đường phố Berlin.',TRUE),
(52,52,'Brezel & Weisswurst','Bánh pretzel, xúc xích trắng và bia sảnh Munich.',TRUE),
(53,53,'Trdelník & goulash','Bánh ống quế và súp goulash Prague.',TRUE),
(54,54,'Sachertorte & schnitzel','Bánh Sacher và Wiener schnitzel Vienna.',TRUE),
(55,55,'Fondue & chocolate','Lẩu phô mai và socola hồ Zurich.',TRUE),
(56,56,'Souvlaki & Greek salad','Souvlaki, salad Hy Lạp và tzatziki Athens.',TRUE),
(57,57,'Fava & hải sản','Đậu fava Santorini và tôm địa phương.',TRUE),
(58,58,'Kebab & baklava','Doner, kebab và baklava chợ Gia Cát Istanbul.',TRUE),
(59,59,'Pastel de nata','Bánh tart trứng Belém và hải sản Alfama Lisbon.',TRUE),
(60,60,'Súp cá hồi','Lohikeitto, bánh mì đen và berry Phần Lan.',TRUE),
(61,61,'Smørrebrød','Bánh mì đen phết topping Copenhagen.',TRUE),
(62,62,'Gravlax & brunost','Cá hồi ướp và phô mai nâu Na Uy Oslo.',TRUE),
(63,63,'Súp cừu & skyr','Thịt cừu, skyr và cá tuyết Iceland.',TRUE),
(64,64,'Bagel & pizza','Bagel New York và pizza lát kiểu NY.',TRUE),
(65,65,'Taco & burger','Xe taco East LA và burger California.',TRUE),
(66,66,'Sourdough & cioppino','Bánh chua và súp hải sản Fisherman''s Wharf.',TRUE),
(67,67,'Buffet & steak','Buffet sòng bài và steak high-end Las Vegas.',TRUE),
(68,68,'Half-smoke','Xúc xích half-smoke và nhà hàng Ethiopia DC.',TRUE),
(69,69,'Deep dish pizza','Pizza chảo sâu kiểu Chicago.',TRUE),
(70,70,'Poutine','Khoai tây phô mai sốt và peameal bacon Toronto.',TRUE),
(71,71,'Sushi cá hồi','Cá hồi British Columbia và ramen Vancouver.',TRUE),
(72,72,'Tacos al pastor','Taco al pastor và mole Mexico City.',TRUE),
(73,73,'Ceviche','Ceviche tôm cá và taco bãi biển Cancun.',TRUE),
(74,74,'Meat pie','Bánh thịt Úc và flat white Sydney.',TRUE),
(75,75,'Brunch & coffee','Brunch hẻm và cà phê nghệ thuật Melbourne.',TRUE),
(76,76,'Fish & chips NZ','Hải sản cảng và rượu vang Waiheke Auckland.',TRUE),
(77,77,'Thịt cừu & pinot','Thịt cừu Central Otago và rượu Pinot Queenstown.',TRUE),
(78,78,'Feijoada','Món đậu đen thịt và churrasco Rio.',TRUE),
(79,79,'Asado','Thịt nướng asado và chimichurri Buenos Aires.',TRUE),
(80,80,'Súp quinoa','Súp quinoa, lợn nướng và đặc sản vùng cao Cusco.',TRUE),
(81,81,'Braai & bobotie','Nướng braai và bobotie Cape Town.',TRUE),
(82,82,'Koshari','Món mì gạo đậu koshari và ful medames Cairo.',TRUE),
(83,83,'Tagine & trà bạc hà','Tagine gốm và trà mint chợ Marrakech.',TRUE);

-- destination_activities: bổ sung destination_id 23–83
INSERT IGNORE INTO destination_activities (id, destination_id, activity_name, description, activity_score)
VALUES
(23,23,'K-pop & shopping Gangnam','Trải nghiệm studio K-pop và mua sắm Gangnam.',4.8),
(24,24,'Shibuya crossing & Senso-ji','Giao lộ Shibuya và đền Asakusa.',4.9),
(25,25,'Lâu đài Osaka & Universal','Thành cổ và công viên Universal Studios.',4.7),
(26,26,'Fushimi Inari & Gion','Cổng torii và phố geisha Gion.',4.9),
(27,27,'Haeundae & Gamcheon','Biển Haeundae và làng nghệ thuật Gamcheon.',4.6),
(28,28,'Chùa Phật Vàng & kênh','Wat Phra Kaew và tour kênh Thonburi.',4.8),
(29,29,'Đảo Phi Phi & lặn','Tàu ra đảo và lặn san hô.',4.7),
(30,30,'Gardens by the Bay','Siêu cây và nhạc nước Marina Bay.',4.8),
(31,31,'Petronas & động Batu','Tháp đôi và động Batu.',4.6),
(32,32,'Tháp 101 & chợ đêm','Taipei 101 và Shilin night market.',4.7),
(33,33,'Ubud ruộng bậc thang','Ruộng Tegalalang và spa jungle.',4.8),
(34,34,'Victoria Peak & Star Ferry','Ngắm cảnh và phà ngắm cảng.',4.7),
(35,35,'Angkor Wat bình minh','Sunrise Angkor và Bayon.',4.9),
(36,36,'Kuang Si & chùa','Thác Kuang Si và Wat Xieng Thong.',4.8),
(37,37,'Vạn Lý Trường Thành','Leo thành cổ Badaling/Mutianyu.',4.9),
(38,38,'Bund & Tháp Minh Châu','Bến Thượng Hải và tháp truyền hình.',4.7),
(39,39,'India Gate & Qutub','Cổng Ấn và tháp Qutub Minar.',4.5),
(40,40,'Taj Mahal & Agra Fort','Taj lúc bình minh và pháo đài đỏ.',4.9),
(41,41,'Snorkeling & dhoni','Lặn ván và thuyền truyền thống.',4.8),
(42,42,'Burj Khalifa & sa mạc','Lên tháp và safari sa mạc.',4.8),
(43,43,'Museum of Islamic Art','Bảo tàng và phố cổ Souq Waqif.',4.6),
(44,44,'Louvre & tháp Eiffel','Bảo tàng và tháp sắt.',4.9),
(45,45,'Colosseum & Vatican','Đấu trường La Mã và Vatican.',4.9),
(46,46,'Gondola & San Marco','Thuyền gondola và quảng trường.',4.7),
(47,47,'Thames cruise & West End','Du thuyền sông và nhạc kịch.',4.7),
(48,48,'Anne Frank & kênh đào','Nhà Anne Frank và tour kênh.',4.6),
(49,49,'Sagrada Familia & Park Güell','Nhà thờ Gaudi và công viên.',4.9),
(50,50,'Prado & Retiro','Bảo tàng Prado và công viên Retiro.',4.6),
(51,51,'Bức tường Berlin & Museum Island','Lịch sử và bảo tàng.',4.7),
(52,52,'Oktoberfest & Nymphenburg','Lễ hội bia và cung điện.',4.6),
(53,53,'Charles Bridge & lâu đài','Cầu Charles và Prague Castle.',4.8),
(54,54,'Schönbrunn & opera','Cung điện và nhà hát.',4.7),
(55,55,'Hồ Zurich & Uetliberg','Tàu lên núi ngắm hồ.',4.6),
(56,56,'Acropolis & Plaka','Đền Parthenon và phố cổ.',4.9),
(57,57,'Oia hoàng hôn','Hoàng hôn Oia và bãi đỏ.',4.9),
(58,58,'Hagia Sophia & Bosphorus','Thánh Sophia và du thuyền eo biển.',4.8),
(59,59,'Alfama & tram 28','Phố cổ và tram vàng.',4.7),
(60,60,'Sauna & design district','Xông hơi và kiến trúc Nordic.',4.5),
(61,61,'Nyhavn & Little Mermaid','Kênh màu và tượng nàng tiên cá.',4.7),
(62,62,'Vigeland & fjord cruise','Công viên điêu khắc và tour vịnh.',4.6),
(63,63,'Golden Circle & Blue Lagoon','Thác Gullfoss và suối nước nóng.',4.9),
(64,64,'Central Park & Broadway','Công viên và nhạc kịch.',4.8),
(65,65,'Hollywood & Santa Monica','Nhà hát Dolby và bãi biển.',4.7),
(66,66,'Golden Gate & Alcatraz','Cầu và đảo nhà tù.',4.8),
(67,67,'Strip & show','Đại lộ Strip và show Cirque.',4.6),
(68,68,'Smithsonian & monuments','Bảo tàng và đài tưởng niệm.',4.7),
(69,69,'Millennium Park & architecture','The Bean và kiến trúc.',4.6),
(70,70,'CN Tower & Niagara','Tháp CN và thác Niagara.',4.8),
(71,71,'Stanley Park & Granville','Xe đạp công viên và chợ nghệ thuật.',4.7),
(72,72,'Zócalo & Teotihuacan','Quảng trường và kim tự tháp.',4.7),
(73,73,'Chichen Itza & cenote','Di sản Maya và bơi cenote.',4.8),
(74,74,'Opera House & Harbour Bridge','Nhà hát và leo cầu cảng.',4.9),
(75,75,'Great Ocean Road','Tour ven biển Twelve Apostles.',4.8),
(76,76,'Sky Tower & Waiheke','Tháp và đảo rượu.',4.6),
(77,77,'Bungee & Milford','Nhảy bungee hoặc tour Milford Sound.',4.9),
(78,78,'Christ & Sugarloaf','Tượng Chúa và cáp treo.',4.8),
(79,79,'Tango & La Boca','Show tango và phố La Boca.',4.7),
(80,80,'Machu Picchu & Sacred Valley','Tàu lên Machu Picchu.',4.9),
(81,81,'Table Mountain & Cape Point','Cáp treo núi Bàn và mũi Hảo Vọng.',4.8),
(82,82,'Kim tự tháp & bảo tàng','Giza và bảo tàng Cairo.',4.8),
(83,83,'Medina & Jemaa el-Fnaa','Chợ đêm và cung điện Bahia.',4.7);

-- destination_tips: bổ sung destination_id 23–83
INSERT IGNORE INTO destination_tips (id, destination_id, tip_title, tip_content, sort_order)
VALUES
(23,23,'T-card & tiền mặt','Mua thẻ T-money cho metro; nhiều quán chỉ nhận tiền mặt.',0),
(24,24,'JR Pass','Cân nhắc JR Pass nếu đi nhiều tỉnh; tránh giờ cao điểm 8–9h.',0),
(25,25,'Osaka Amazing Pass','Gói vé tham quan và metro tiết kiệm.',0),
(26,26,'Giày đế mềm','Kyoto đi bộ nhiều trong đền chùa; mang giày dễ cởi.',0),
(27,27,'App gọi xe','KakaoTaxi tiện hơn taxi đường phố.',0),
(28,28,'Mặc kín đáo chùa','Vai và đầu gối che kín khi vào wat.',0),
(29,29,'Chống nắng biển','Nắng gắt; mang kem chống nắng và nước.',0),
(30,30,'Luật nơi công cộng','Không ăn uống trên MRT; phạt nếu vi phạm.',0),
(31,31,'Grab & tiền Ringgit','Grab phổ biến; đổi tiền tại mall uy tín.',0),
(32,32,'EasyCard','Thẻ EasyCard cho MRT và cửa hàng tiện lợi.',0),
(33,33,'Nước uống & đền','Mang chai nước; chuẩn bị sarong khi vào đền.',0),
(34,34,'Octopus card','Thẻ Octopus cho MTR, phà và minimart.',0),
(35,35,'Pass Angkor','Mua pass 1/3 ngày trước khi vào quần thể.',0),
(36,36,'Tôn trọng sáng sớm','Alms giving lúc bình minh: giữ khoảng cách, không dùng đèn flash.',0),
(37,37,'VPN & thanh toán','Chuẩn bị app thanh toán phổ biến tại Trung Quốc.',0),
(38,38,'Maglev & metro','Tàu đệm từ sân bay Pudong nhanh nhưng đắt.',0),
(39,39,'An toàn đường phố','Tránh ăn đồ lạ từ nguồn không rõ; uống nước đóng chai.',0),
(40,40,'Mùa khách đông','Taj đông sớm; đặt vé online để giảm xếp hàng.',0),
(41,41,'Transfer thủy phi cơ','Kiểm tra gói resort có bao gồm seaplane không.',0),
(42,42,'Dress code nhà hàng','Một số nhà hàng sang yêu cầu smart casual.',0),
(43,43,'Nắng sa mạc','Mũ và nước khi tham quan ngoài trời giữa trưa.',0),
(44,44,'Đề phòng móc túi','Cảnh giác tại metro và khu du lịch đông.',0),
(45,45,'Dress Vatican','Vai và đầu gối che kín khi vào Vatican.',0),
(46,46,'Acqua alta','Theo dõi triều cường; mang ủng nếu mùa cao.',0),
(47,47,'Oyster card','Thẻ Oyster tiết kiệm cho tube và bus.',0),
(48,48,'Xe đạp','Thuê xe đạp nhưng khóa cẩn thận trộm.',0),
(49,49,'Giờ Sagrada','Đặt vé giờ cụ thể; đến đúng slot.',0),
(50,50,'Siesta','Một số cửa hàng đóng giữa trưa.',0),
(51,51,'Tiền mặt nhỏ','Nhà vệ sinh công cộng đôi khi tính phí xu.',0),
(52,52,'Oktoberfest đặt bàn','Đặt chỗ trước nếu đến mùa lễ hội bia.',0),
(53,53,'Tiền Koruna','Đổi tiền mặt cho quán nhỏ; tránh đổi ở sân bay.',0),
(54,54,'Nhạc cổ điển','Đặt vé concert Musikverein trước.',0),
(55,55,'Swiss Pass','Swiss Travel Pass tiết kiệm tàu và tàu thuyền.',0),
(56,56,'Nắng Acropolis','Mang ô và nước; leo đá trơn.',0),
(57,57,'Đặt chỗ Oia','Nhà hàng view hoàng hôn cần book trước.',0),
(58,58,'Hagia Sophia ticket','Kiểm tra quy định vé và dress code mới nhất.',0),
(59,59,'Cobblestone','Giày đế bệt cho đá cổ Alfama.',0),
(60,60,'Mùa cực quang','Mùa đông lạnh; lớp áo kỹ thuật.',0),
(61,61,'Xe đạp','Bike Copenhagen an toàn nhưng tuân luật.',0),
(62,62,'Giá Na Uy','Ngân sách cao; ưu tiên siêu thị Rema 1000.',0),
(63,63,'Gió & tuyết','Áo gió và giày chống trượt mùa đông.',0),
(64,64,'Tip & metro','Tip 15–20% nhà hàng; metro 24/7 một số tuyến.',0),
(65,65,'Kẹt xe LA','Tránh giờ cao điểm 405; dùng Google Maps live.',0),
(66,66,'Sương mù','Sương mù SF; mang áo khoác mỏng.',0),
(67,67,'Nóng sa mạc','Uống nhiều nước khi tour sa mạc.',0),
(68,68,'Bảo tàng miễn phí','Smithsonian miễn phí nhưng cần đặt slot.',0),
(69,69,'Gió hồ Michigan','Mùa đông rất lạnh; trang bị ấm.',0),
(70,70,'Niagara từ Toronto','Tour 1 ngày phổ biến; mang passport.',0),
(71,71,'Mưa Vancouver','Áo mưa; thời tiết thay đổi nhanh.',0),
(72,72,'An toàn Mexico City','Uber/Didi; tránh hiển thị điện thoại ngoài đường về đêm.',0),
(73,73,'Bảo vệ san hô','Kem chống nắng reef-safe khi lặn.',0),
(74,74,'Tia UV','Mũ và kem chống nắng bãi biển Australia.',0),
(75,75,'Myki card','Thẻ Myki cho tram Melbourne.',0),
(76,76,'Giao thông trái tay','Lái xe bên trái; cẩn thận khi sang đường.',0),
(77,77,'Hoạt động mạo hiểm','Đặt trước bungy/skydiving; kiểm tra thời tiết.',0),
(78,78,'An toàn khu một số favela','Tham quan có hướng dẫn; tránh đi một mình ban đêm.',0),
(79,79,'Tiền peso','Mang tiền mặt cho taxi và quán nhỏ.',0),
(80,80,'Sốc độ cao','Nghỉ ngơi aclimatization Cusco trước khi leo cao.',0),
(81,81,'An toàn Table Mountain','Kiểm tra gió đóng cáp treo.',0),
(82,82,'Khan scarf','Mang khăn khi vào đền thờ Hồi giáo.',0),
(83,83,'Mặc cả chợ','Mặc cả nhẹ nhàng Medina; giữ điện thoại cẩn thận.',0);

-- destination_events: bổ sung destination_id 23–83
INSERT IGNORE INTO destination_events (id, destination_id, event_name, event_type, description, starts_at, ends_at, notify_all_followers, is_active)
VALUES
(23,23,'Lễ hội ẩm thực & văn hóa Seoul','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Seoul.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(24,24,'Lễ hội ẩm thực & văn hóa Tokyo','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Tokyo.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(25,25,'Lễ hội ẩm thực & văn hóa Osaka','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Osaka.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(26,26,'Lễ hội ẩm thực & văn hóa Kyoto','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Kyoto.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(27,27,'Lễ hội ẩm thực & văn hóa Busan','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Busan.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(28,28,'Lễ hội ẩm thực & văn hóa Bangkok','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Bangkok.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(29,29,'Lễ hội ẩm thực & văn hóa Phuket','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Phuket.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(30,30,'Lễ hội ẩm thực & văn hóa Singapore','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Singapore.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(31,31,'Lễ hội ẩm thực & văn hóa Kuala Lumpur','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Kuala Lumpur.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(32,32,'Lễ hội ẩm thực & văn hóa Taipei','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Taipei.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(33,33,'Lễ hội ẩm thực & văn hóa Bali','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Bali.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(34,34,'Lễ hội ẩm thực & văn hóa Hong Kong','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Hong Kong.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(35,35,'Lễ hội ẩm thực & văn hóa Siem Reap','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Siem Reap.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(36,36,'Lễ hội ẩm thực & văn hóa Luang Prabang','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Luang Prabang.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(37,37,'Lễ hội ẩm thực & văn hóa Bắc Kinh','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Bắc Kinh.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(38,38,'Lễ hội ẩm thực & văn hóa Thượng Hải','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Thượng Hải.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(39,39,'Lễ hội ẩm thực & văn hóa New Delhi','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại New Delhi.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(40,40,'Lễ hội ẩm thực & văn hóa Agra','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Agra.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(41,41,'Lễ hội ẩm thực & văn hóa Maldives','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Maldives.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(42,42,'Lễ hội ẩm thực & văn hóa Dubai','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Dubai.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(43,43,'Lễ hội ẩm thực & văn hóa Doha','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Doha.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(44,44,'Lễ hội ẩm thực & văn hóa Paris','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Paris.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(45,45,'Lễ hội ẩm thực & văn hóa Rome','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Rome.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(46,46,'Lễ hội ẩm thực & văn hóa Venice','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Venice.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(47,47,'Lễ hội ẩm thực & văn hóa London','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại London.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(48,48,'Lễ hội ẩm thực & văn hóa Amsterdam','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Amsterdam.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(49,49,'Lễ hội ẩm thực & văn hóa Barcelona','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Barcelona.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(50,50,'Lễ hội ẩm thực & văn hóa Madrid','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Madrid.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(51,51,'Lễ hội ẩm thực & văn hóa Berlin','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Berlin.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(52,52,'Lễ hội ẩm thực & văn hóa Munich','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Munich.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(53,53,'Lễ hội ẩm thực & văn hóa Prague','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Prague.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(54,54,'Lễ hội ẩm thực & văn hóa Vienna','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Vienna.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(55,55,'Lễ hội ẩm thực & văn hóa Zurich','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Zurich.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(56,56,'Lễ hội ẩm thực & văn hóa Athens','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Athens.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(57,57,'Lễ hội ẩm thực & văn hóa Santorini','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Santorini.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(58,58,'Lễ hội ẩm thực & văn hóa Istanbul','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Istanbul.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(59,59,'Lễ hội ẩm thực & văn hóa Lisbon','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Lisbon.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(60,60,'Lễ hội ẩm thực & văn hóa Helsinki','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Helsinki.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(61,61,'Lễ hội ẩm thực & văn hóa Copenhagen','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Copenhagen.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(62,62,'Lễ hội ẩm thực & văn hóa Oslo','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Oslo.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(63,63,'Lễ hội ẩm thực & văn hóa Reykjavik','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Reykjavik.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(64,64,'Lễ hội ẩm thực & văn hóa New York','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại New York.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(65,65,'Lễ hội ẩm thực & văn hóa Los Angeles','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Los Angeles.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(66,66,'Lễ hội ẩm thực & văn hóa San Francisco','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại San Francisco.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(67,67,'Lễ hội ẩm thực & văn hóa Las Vegas','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Las Vegas.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(68,68,'Lễ hội ẩm thực & văn hóa Washington DC','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Washington DC.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(69,69,'Lễ hội ẩm thực & văn hóa Chicago','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Chicago.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(70,70,'Lễ hội ẩm thực & văn hóa Toronto','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Toronto.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(71,71,'Lễ hội ẩm thực & văn hóa Vancouver','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Vancouver.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(72,72,'Lễ hội ẩm thực & văn hóa Mexico City','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Mexico City.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(73,73,'Lễ hội ẩm thực & văn hóa Cancun','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Cancun.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(74,74,'Lễ hội ẩm thực & văn hóa Sydney','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Sydney.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(75,75,'Lễ hội ẩm thực & văn hóa Melbourne','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Melbourne.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(76,76,'Lễ hội ẩm thực & văn hóa Auckland','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Auckland.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(77,77,'Lễ hội ẩm thực & văn hóa Queenstown','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Queenstown.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(78,78,'Lễ hội ẩm thực & văn hóa Rio de Janeiro','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Rio de Janeiro.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(79,79,'Lễ hội ẩm thực & văn hóa Buenos Aires','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Buenos Aires.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(80,80,'Lễ hội ẩm thực & văn hóa Cusco','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Cusco.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(81,81,'Lễ hội ẩm thực & văn hóa Cape Town','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Cape Town.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(82,82,'Lễ hội ẩm thực & văn hóa Cairo','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Cairo.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE),
(83,83,'Lễ hội ẩm thực & văn hóa Marrakech','festival','Sự kiện định kỳ giới thiệu ẩm thực và nghệ thuật đường phố tại Marrakech.','2026-06-01 10:00:00','2026-06-03 22:00:00',TRUE,TRUE);

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

-- ============================================================
-- tours: INSERT IGNORE — nếu DB đã có id/code/slug trùng, destination_id / cancellation_policy_id
-- không tồn tại, MySQL bỏ im lặng từng dòng → COUNT(tours) có thể < 100.
-- Cần cancellation_policies id 1, 2, 3 (đã seed ở trên) + destinations id 1..83.
-- ============================================================

INSERT IGNORE INTO tours (
    id, code, name, slug, destination_id, cancellation_policy_id,
    short_description, description, highlights, inclusions, exclusions,
    duration_days, max_group_size, min_age, base_price, currency,
    trip_mode, status, is_featured
) VALUES
(1,'TOUR_DN_01','Đà Nẵng 3N2Đ – Biển & Bà Nà','da-nang-3n2d-bien-ba-na',2,1,'Tour nhẹ nhàng cho gia đình','Hành trình đưa bạn khám phá vẻ đẹp hiện đại của biển Mỹ Khê, trải nghiệm tiên cảnh tại đỉnh Bà Nà Hills và đắm mình trong không gian rêu phong, tĩnh lặng của phố cổ Hội An lúc lên đèn.','Cầu Rồng, Bà Nà, biển Mỹ Khê','Xe, vé tham quan, HDV','Chi phí cá nhân',3,30,3,3500000,'VND','group','active',TRUE),
(2,'TOUR_HCM_01','Sài Gòn 1 ngày – City tour','sai-gon-1-day-city-tour',1,1,'Khám phá trung tâm thành phố','Trải nghiệm nhịp sống sôi động của hòn ngọc Viễn Đông qua các công trình kiến trúc biểu tượng như Dinh Độc Lập, Nhà thờ Đức Bà cổ kính và tìm hiểu những câu chuyện lịch sử hào hùng của thành phố.','City highlights','Xe, HDV','Ăn uống cá nhân',1,20,0,790000,'VND','group','active',TRUE),
(3,'TOUR_HL_01','Hạ Long Heritage – Ngủ đêm du thuyền','ha-long-heritage-ngu-dem-du-thuyen',3,2,'Trải nghiệm đẳng cấp trên vịnh','Tận hưởng kỳ nghỉ sang trọng trên du thuyền 5 sao giữa kỳ quan thế giới, tham quan hang động kỳ vĩ, chèo thuyền kayak và đón bình minh rực rỡ ngay trên mặt vịnh xanh biếc thơ mộng.','Vịnh Hạ Long, Hang Sửng Sốt, Đảo TiTop','Du thuyền, ăn 4 bữa, vé tham quan','Đồ uống, tip',2,24,5,3800000,'VND','group','active',TRUE),
(4,'TOUR_SP_01','Sapa – Bản Cát Cát & Fansipan','sapa-cat-cat-fansipan',4,1,'Chinh phục nóc nhà Đông Dương','Hành trình chinh phục đỉnh Fansipan hùng vĩ bằng cáp treo hiện đại, khám phá bản làng của người dân tộc Mông và tận hưởng không khí se lạnh, mờ ảo của thị trấn sương mù Sapa đầy quyến rũ.','Fansipan, Bản Cát Cát, Thác Bạc','Xe giường nằm, khách sạn, vé cáp treo','Ăn tối tự túc',3,15,6,2950000,'VND','group','active',TRUE),
(5,'TOUR_NB_01','Ninh Bình – Tràng An & Bái Đính','ninh-binh-trang-an-bai-dinh',5,1,'Vẻ đẹp non nước hữu tình','Khám phá quần thể di sản thế giới Tràng An bằng thuyền chèo tay, chiêm bái ngôi chùa Bái Đính với nhiều kỷ lục ấn tượng và chiêm ngưỡng toàn cảnh vùng non nước hữu tình từ đỉnh Hang Múa.','Tràng An, Chùa Bái Đính, Hang Múa','Xe đưa đón, ăn trưa buffet, thuyền','Chi phí cá nhân',1,30,0,950000,'VND','group','active',FALSE),
(6,'TOUR_HG_01','Hà Giang – Cung đường hạnh phúc','ha-giang-cung-duong-hanh-phuc',6,2,'Khám phá cao nguyên đá hùng vĩ','Chuyến đi đầy cảm hứng vượt qua đèo Mã Pì Lèng hiểm trở, thăm dinh thự họ Vương huyền bí và đứng dưới lá cờ Tổ quốc tại cột cờ Lũng Cú, nơi địa đầu cực Bắc thiêng liêng của Tổ quốc.','Đèo Mã Pì Lèng, Lũng Cú, Sông Nho Quế','Xe bán tải/xe máy, HDV bản địa, homestay','Nước uống dọc đường',4,10,12,4500000,'VND','group','active',TRUE),
(7,'TOUR_HN_01','Hà Nội – Tinh hoa văn hóa','ha-noi-tinh-hoa-van-hoa',7,1,'Tìm hiểu lịch sử nghìn năm văn hiến','Lắng đọng cùng không gian lịch sử tại Lăng Chủ tịch Hồ Chí Minh, tham quan Văn Miếu Quốc Tử Giám cổ kính và cảm nhận nét văn hóa nghìn năm văn hiến qua từng góc phố nhỏ của thủ đô.','Lăng Bác, Hồ Gươm, Văn Miếu','Xe, vé tham quan, ăn trưa','Mua sắm cá nhân',1,20,0,650000,'VND','group','active',FALSE),
(8,'TOUR_CB_01','Cao Bằng – Thác Bản Giốc','cao-bang-thac-ban-gioc',8,2,'Kỳ quan thác nước biên giới','Chiêm ngưỡng vẻ đẹp hùng vĩ của thác nước biên giới lớn nhất Việt Nam, khám phá động Ngườm Ngao kỳ ảo và tìm về cội nguồn cách mạng tại suối Lê-nin trong vắt, tĩnh lặng giữa đại ngàn Cao Bằng.','Thác Bản Giốc, Động Ngườm Ngao, Pác Bó','Xe, homestay, bảo hiểm','VAT',3,12,6,3200000,'VND','group','active',FALSE),
(9,'TOUR_HUE_01','Cố đô Huế – Vẻ đẹp trầm mặc','co-do-hue-ve-dep-tram-mac',9,1,'Hành trình di sản văn hóa','Trở về quá khứ với hệ thống cung điện lăng tẩm uy nghiêm của triều Nguyễn, xuôi dòng sông Hương nghe ca Huế mộng mơ và thưởng thức nét tinh hoa ẩm thực cung đình đặc sắc của vùng đất cố đô.','Đại Nội, Chùa Thiên Mụ, Lăng Khải Định','Xe, HDV, vé tham quan','Ăn tối',1,25,0,800000,'VND','group','active',TRUE),
(10,'TOUR_HA_01','Hội An – Phố cổ đêm rằm','hoi-an-pho-co-dem-ram',10,1,'Lãng mạn không gian xưa','Tận hưởng không gian lãng mạn của phố cổ Hội An về đêm với những ánh đèn lồng rực rỡ, tham gia thả đèn hoa đăng trên sông Hoài và thưởng thức món cao lầu đặc sản trứ danh vùng Quảng Nam.','Chùa Cầu, Nhà cổ Tân Ký','HDV, ăn tối, vé phố cổ','Xe đưa đón ngoài khu vực',1,15,0,550000,'VND','private','active',TRUE),
(11,'TOUR_NT_01','Nha Trang – Vịnh Đảo Thiên Đường','nha-trang-vinh-dao-thien-duong',11,1,'Nghỉ dưỡng biển đảo','Đắm mình trong làn nước xanh ngọc bích tại vịnh Nha Trang, khám phá thế giới san hô rực rỡ sắc màu tại Hòn Mun và thư giãn cùng các dịch vụ giải trí đẳng cấp tại đảo Hòn Tằm xinh đẹp.','Hòn Mun, Robinson Island','Cano cao tốc, ăn trưa hải sản, dụng cụ lặn','Trò chơi mất phí',1,35,4,750000,'VND','group','active',TRUE),
(12,'TOUR_DL_01','Đà Lạt – Thành phố ngàn hoa','da-lat-thanh-pho-ngan-hoa',12,1,'Không gian mộng mơ và se lạnh','Tìm về sự bình yên giữa thành phố ngàn hoa với không khí trong lành, check-in những vườn hoa rực rỡ, chinh phục đỉnh Langbiang huyền thoại và lắng nghe tiếng thông reo bên hồ Tuyền Lâm thơ mộng, trữ tình.','Langbiang, Thung lũng tình yêu','Xe, vé tham quan, ăn trưa','Cáp treo, máng trượt',1,20,0,600000,'VND','group','active',TRUE),
(13,'TOUR_PY_01','Phú Yên – Hoa vàng cỏ xanh','phu-yen-hoa-vang-co-xanh',13,1,'Vẻ đẹp hoang sơ vùng duyên hải','Ghé thăm những địa danh nổi tiếng trong phim tại Bãi Xép, ngỡ ngàng trước vẻ đẹp độc đáo của Gành Đá Đĩa và đón những ánh nắng đầu tiên của ngày mới tại hải đăng Đại Lãnh cực Đông.','Gành Đá Đĩa, Hải Đăng Đại Lãnh','Xe, HDV, ăn trưa','Tiền tip',1,15,5,850000,'VND','group','active',FALSE),
(14,'TOUR_QN_01','Quy Nhơn – Kỳ Co & Eo Gió','quy-nhon-ky-co-eo-gio',14,1,'Maldives của Việt Nam','Khám phá thiên đường biển đảo Kỳ Co với làn nước trong vắt, đi dạo trên cung đường ven biển tuyệt đẹp tại Eo Gió và thưởng thức hải sản tươi ngon được đánh bắt trực tiếp từ làng chài Nhơn Lý.','Kỳ Co, Eo Gió, Tịnh Xá Ngọc Hòa','Cano, ăn trưa, vé cầu tình yêu','Dịch vụ tắm nước ngọt',1,25,3,990000,'VND','group','active',TRUE),
(15,'TOUR_BMT_01','Buôn Ma Thuột – Thủ phủ cà phê','buon-ma-thuot-thu-phu-ca-phe',15,2,'Hương vị đại ngàn Tây Nguyên','Hành trình tìm về thủ phủ cà phê với hương vị đại ngàn nồng nàn, trải nghiệm cưỡi voi tại Buôn Đôn, chiêm ngưỡng thác Dray Nur hùng vĩ và tìm hiểu nét văn hóa mẫu hệ đặc sắc của người Ê-đê.','Thác Dray Nur, Buôn Đôn','Xe, khách sạn, vé tham quan','Cưỡi voi (nếu có)',3,12,6,3600000,'VND','group','active',FALSE),
(16,'TOUR_VT_01','Vũng Tàu – Biển xanh vẫy gọi','vung-tau-bien-xanh-vay-goi',16,1,'Chuyến đi ngắn ngày cho gia đình','Chuyến nghỉ dưỡng cuối tuần hoàn hảo tại thành phố biển Vũng Tàu, tham quan tượng Chúa Kitô Vua, ngắm nhìn toàn cảnh từ ngọn hải đăng cổ xưa và tận hưởng làn gió biển mát lành tại bãi Sau sôi động.','Tượng Chúa Kitô, Ngọn Hải Đăng','Xe đưa đón, ăn trưa','Ghế dù bãi biển',1,40,0,500000,'VND','group','active',FALSE),
(17,'TOUR_PQ_01','Phú Quốc – Safari & Grand World','phu-quoc-safari-grand-world',17,2,'Đảo ngọc đa sắc màu','Trải nghiệm thế giới động vật hoang dã tại Safari, lạc bước trong không gian lễ hội không ngủ của Grand World và tận hưởng kỳ nghỉ đẳng cấp bên những bãi cát trắng mịn của đảo ngọc Phú Quốc.','VinWonders, Safari, Bãi Sao','Vé máy bay, khách sạn 4 sao, ăn sáng','Vé vào cổng VinWonders',4,20,0,6800000,'VND','group','active',TRUE),
(18,'TOUR_CT_01','Cần Thơ – Chợ nổi Cái Răng','can-tho-cho-noi-cai-rang',18,1,'Nét đẹp sông nước miền Tây','Khám phá nét văn hóa sông nước độc đáo tại chợ nổi Cái Răng lúc sáng sớm, ghé thăm vườn trái cây trĩu quả và tìm hiểu quy trình làm hủ tiếu truyền thống của người dân miền Tây chất phác.','Chợ nổi Cái Răng, Lò hủ tiếu','Thuyền, HDV, ăn sáng','Mua sắm trái cây',1,12,0,450000,'VND','group','active',TRUE),
(19,'TOUR_MD_01','Mũi Né – Đồi cát bay','mui-ne-doi-cat-bay',19,1,'Tiểu sa mạc ven biển','Trải nghiệm xe Jeep vượt qua những đồi cát trắng và cát đỏ mênh mông, lội suối Tiên hiền hòa giữa hẻm núi rực rỡ màu sắc và cảm nhận cuộc sống thanh bình của ngư dân tại làng chài Mũi Né.','Bàu Trắng, Suối Tiên, Làng Chài','Xe Jeep, HDV','Trượt cát',1,10,5,700000,'VND','private','active',FALSE),
(20,'TOUR_TN_01','Tây Ninh – Núi Bà Đen','tay-ninh-nui-ba-den',20,1,'Hành trình tâm linh','Chinh phục nóc nhà Nam Bộ bằng hệ thống cáp treo hiện đại, chiêm bái tượng Phật Bà bằng đồng cao nhất châu Á và tham quan Tòa Thánh Tây Ninh với kiến trúc độc đáo, uy nghiêm giữa vùng thánh địa.','Núi Bà Đen, Tòa Thánh Tây Ninh','Xe, ăn trưa buffet','Vé cáp treo',1,30,0,850000,'VND','group','active',FALSE),
(21,'TOUR_DN_02','Đà Nẵng – Ngũ Hành Sơn & Hội An','da-nang-ngu-hanh-son-hoi-an',2,1,'Tour chiều tối lãng mạn','Tham quan danh thắng Ngũ Hành Sơn với những hang động huyền bí, sau đó hành trình đưa bạn đến với phố cổ Hội An lãng mạn để thưởng thức ẩm thực và đi dạo dưới ánh đèn lồng rực rỡ sắc màu.','Ngũ Hành Sơn, Hội An','Xe, ăn tối, vé','Cá nhân',1,20,0,500000,'VND','group','active',FALSE),
(22,'TOUR_SP_02','Sapa Trekking – Lao Chải Tả Van','sapa-trekking-lao-chai-ta-van',4,1,'Đi bộ xuyên các bản làng','Hành trình đi bộ xuyên qua những thửa ruộng bậc thang tuyệt đẹp, ghé thăm bản làng của người Mông, người Giáy tại Lao Chải và Tả Van để tìm hiểu sâu sắc về đời sống văn hóa bản địa độc đáo.','Bản Lao Chải, Tả Van','HDV bản địa, ăn trưa','Xe về lại trung tâm',1,8,10,400000,'VND','group','active',FALSE),
(23,'TOUR_HL_02','Hạ Long 1 ngày – Vịnh luồn','ha-long-1-day-vinh-luon',3,1,'Tour vịnh ngắn ngày','Dành cho du khách có thời gian hạn hẹp nhưng vẫn muốn khám phá trọn vẹn vẻ đẹp hang Sửng Sốt, trải nghiệm chèo thuyền kayak qua hang Luồn và chiêm ngưỡng kỳ quan thiên nhiên thế giới ngay trong ngày.','Hang Sửng Sốt, Kayak','Tàu, ăn trưa, vé','Đồ uống',1,45,3,850000,'VND','group','active',FALSE),
(24,'TOUR_NT_02','Nha Trang – Tour 3 đảo VIP','nha-trang-tour-3-dao-vip',11,1,'Cano cao tốc riêng biệt','Trải nghiệm đẳng cấp với cano cao tốc đưa bạn đi khám phá các hòn đảo đẹp nhất vịnh Nha Trang, tham gia lặn ngắm san hô và thưởng thức tiệc hải sản tươi ngon ngay trên bãi biển hoang sơ, thơ mộng.','Hòn Tằm, Vịnh San Hô','Cano, ăn hải sản, lặn','Phí lên đảo',1,10,0,1200000,'VND','private','active',TRUE),
(25,'TOUR_DL_02','Đà Lạt – Săn mây cầu gỗ','da-lat-san-may-cau-go',12,1,'Trải nghiệm sáng sớm cực chill','Khởi đầu ngày mới cực chill bằng chuyến săn mây trên cầu gỗ, ngắm nhìn ánh bình minh rạng rỡ trên những đồi chè xanh mướt tại Cầu Đất và hít hà không khí trong lành của buổi sớm mai Đà Lạt.','Cầu gỗ săn mây, Đồi chè','Xe đón sớm, ăn sáng','Mua quà',1,12,6,450000,'VND','group','active',TRUE),
(26,'TOUR_PQ_02','Phú Quốc – Câu cá lặn ngắm san hô','phu-quoc-cau-ca-lan-ngam-san-ho',17,1,'Trải nghiệm phía Nam đảo','Cùng lênh đênh trên biển phía Nam đảo ngọc để trải nghiệm làm ngư dân thực thụ, tự tay câu cá và lặn ngắm những rạn san hô đa sắc màu tại quần đảo An Thới đẹp như tranh vẽ.','Bãi Sao, Quần đảo An Thới','Tàu, dụng cụ câu, ăn trưa','Tips',1,25,5,600000,'VND','group','active',FALSE),
(27,'TOUR_NB_02','Ninh Bình – Tuyệt Tình Cốc','ninh-binh-tuyet-tinh-coc',5,1,'Vẻ đẹp hoang sơ kỳ bí','Tìm về chốn bồng lai tiên cảnh tại Am Tiên, nơi được mệnh danh là Tuyệt Tình Cốc với hồ nước xanh ngắt, sau đó thử thách bản thân leo lên đỉnh Hang Múa để ngắm nhìn toàn cảnh Tam Cốc.','Động Am Tiên, Hang Múa','Xe, ăn trưa, vé','Gửi xe',1,20,0,900000,'VND','group','active',FALSE),
(28,'TOUR_HCM_02','Địa đạo Củ Chi – Bến Dược','dia-dao-cu-chi-ben-duoc',1,1,'Hành trình về nguồn','Trải nghiệm khám phá hệ thống địa đạo chằng chịt trong lòng đất, tìm hiểu về tinh thần kiên cường của quân dân ta thời kháng chiến và thưởng thức món khoai mì luộc dân dã đặc trưng vùng đất thép.','Hầm địa đạo, khu bắn súng','Xe, HDV, khoai mì','Đạn bắn súng',1,30,6,450000,'VND','group','active',FALSE),
(29,'TOUR_HG_02','Hà Giang – Mùa hoa tam giác mạch','ha-giang-mua-hoa-tam-giac-mach',6,2,'Ngắm hoa trên cao nguyên đá','Hành trình thu vào tầm mắt sắc tím hồng mộng mơ của những cánh đồng hoa tam giác mạch trải dài trên cao nguyên đá, kết hợp khám phá nét văn hóa độc đáo của đồng bào vùng cao Hà Giang.','Cánh đồng hoa, Mã Pì Lèng','Xe, ăn, ngủ, vé','Tiền hoa',3,15,10,3800000,'VND','group','active',TRUE),
(30,'TOUR_HUE_02','Huế – Lăng Cô – Hải Vân','hue-lang-co-hai-van',9,1,'Vẻ đẹp thiên nhiên hùng vĩ','Hành trình chinh phục cung đường đèo Hải Vân hùng vĩ để đến với vịnh Lăng Cô xanh ngắt, tận hưởng bầu không khí trong lành và vẻ đẹp tĩnh lặng của đầm Lập An lúc hoàng hôn buông xuống.','Đèo Hải Vân, Đầm Lập An','Xe, ăn trưa hải sản','Cá nhân',1,15,0,950000,'VND','group','active',FALSE),
(31,'TOUR_CT_02','Cần Thơ – Mỹ Khánh – Thiền viện','can-tho-my-khanh-thien-vien',18,1,'Du lịch sinh thái miền Tây','Hòa mình vào không gian sinh thái đặc trưng của miền Tây tại làng du lịch Mỹ Khánh, thưởng thức ẩm thực dân dã và chiêm bái Thiền viện Trúc Lâm Phương Nam lớn nhất khu vực đồng bằng sông Cửu Long.','Vườn cây, trò chơi dân gian','Xe, vé, ăn trưa','Trò chơi có phí',1,40,0,550000,'VND','group','active',FALSE),
(32,'TOUR_CB_02','Cao Bằng – Hồ Thang Hen','cao-bang-ho-thang-hen',8,2,'Hồ nước trên núi tuyệt đẹp','Khám phá vẻ đẹp kỳ ảo của hồ Thang Hen nằm giữa núi rừng Cao Bằng, trải nghiệm cắm trại bên núi Mắt Thần và tận hưởng cảm giác tự do, yên bình giữa không gian thiên nhiên hoang sơ, tĩnh lặng.','Hồ Thang Hen, Núi Mắt Thần','Xe, ăn, lều trại','Phí cắm trại',2,10,12,2200000,'VND','group','active',FALSE),
(33,'TOUR_HA_02','Hội An – Rừng dừa Bảy Mẫu','hoi-an-rung-dua-bay-mau',10,1,'Trải nghiệm múa thúng','Trải nghiệm ngồi thúng chai len lỏi giữa rừng dừa nước xanh mướt, xem các nghệ nhân biểu diễn múa thúng điêu luyện và tham gia các trò chơi dân gian thú vị đậm chất sông nước miền Trung tại Hội An.','Rừng dừa Bảy Mẫu','Thúng, ăn trưa, HDV','Cá nhân',1,20,0,400000,'VND','group','active',FALSE),
(34,'TOUR_QN_02','Quy Nhơn – Tháp Bánh Ít','quy-nhon-thap-ban-it',14,1,'Văn hóa Champa cổ xưa','Tìm về những dấu ấn rêu phong của vương triều Champa xưa qua cụm tháp Bánh Ít và tháp Đôi, nơi lưu giữ những giá trị kiến trúc nghệ thuật độc đáo và những câu chuyện lịch sử huyền bí của vùng đất võ.','Tháp Bánh Ít, Tháp Đôi','Xe, HDV, vé','Ăn trưa',1,15,0,450000,'VND','group','active',FALSE),
(35,'TOUR_PY_02','Phú Yên – Hòn Nưa hoang sơ','phu-yen-hon-nua-hoang-so',13,1,'Đảo hoang cho người thích khám phá','Chinh phục hòn đảo hoang sơ nằm dưới chân đèo Cả, nơi bạn có thể tự do tắm biển trong làn nước xanh ngắt, lặn ngắm san hô và thưởng thức tiệc nướng BBQ hải sản ngay trên bãi cát trắng mịn.','Đảo Hòn Nưa','Cano, BBQ bãi biển','Dụng cụ câu cá',1,12,8,1100000,'VND','private','active',TRUE),
(36,'TOUR_VT_02','Vũng Tàu – Hồ Mây Park','vung-tau-ho-may-park',16,1,'Giải trí trên núi ven biển','Trải nghiệm cáp treo lên đỉnh núi Tương Kỳ để khám phá khu du lịch Hồ Mây, nơi tích hợp nhiều trò chơi giải trí hiện đại, công viên nước và chiêm ngưỡng toàn cảnh thành phố biển Vũng Tàu từ trên cao.','KDL Hồ Mây','Vé trọn gói, xe đưa đón','Ăn uống',1,20,0,850000,'VND','group','active',FALSE),
(37,'TOUR_TN_02','Tây Ninh – Hồ Dầu Tiếng Camping','tay-ninh-ho-dau-tieng-camping',20,1,'Cắm trại cực hot cho giới trẻ','Trốn khỏi khói bụi thành phố để tận hưởng chuyến cắm trại lãng mạn bên hồ Dầu Tiếng, ngắm nhìn hoàng hôn rực rỡ và cùng bạn bè tổ chức tiệc nướng BBQ dưới bầu trời đầy sao tại vùng đất Tây Ninh.','Hồ Dầu Tiếng, Núi Bà Đen','Lều, tiệc nướng BBQ','Túi ngủ cá nhân',2,15,15,1200000,'VND','group','active',TRUE),
(38,'TOUR_MD_02','Mũi Né – Lâu đài rượu vang','mui-ne-lau-dai-ruou-vang',19,1,'Trải nghiệm sang trọng','Lạc bước vào không gian kiến trúc Châu Âu cổ kính tại lâu đài rượu vang RD, tìm hiểu quy trình sản xuất và thưởng thức những loại vang hảo hạng trong hầm rượu sâu dưới lòng đất tại Mũi Né.','Lâu đài rượu vang, Sea Links','Xe, vé, thử rượu','Mua rượu mang về',1,15,18,600000,'VND','group','active',FALSE),
(39,'TOUR_HN_02','Hà Nội – Làng cổ Đường Lâm','ha-noi-lang-co-duong-lam',7,1,'Tìm về không gian xưa','Tìm lại những hình ảnh thân thương của làng quê Bắc Bộ xưa với cây đa, bến nước, sân đình tại làng cổ Đường Lâm, trải nghiệm đạp xe quanh làng và thưởng thức bữa cơm quê ấm cúng của người dân địa phương.','Cổng làng, Nhà cổ','Xe đạp, ăn trưa nhà dân','Mua quà lưu niệm',1,10,0,750000,'VND','group','active',FALSE),
(40,'TOUR_BMT_02','Đắk Lắk – Hồ Lắk thơ mộng','dak-lak-ho-lak-tho-mong',15,2,'Vẻ đẹp yên bình bên hồ','Cảm nhận vẻ đẹp thanh bình của hồ nước ngọt lớn thứ hai Việt Nam, trải nghiệm chèo thuyền độc mộc ngắm hoàng hôn và khám phá nét văn hóa độc đáo của người đồng bào M''Nông sống quanh hồ Lắk thơ mộng.','Hồ Lắk, Biệt điện Bảo Đại','Xe, ăn, HDV','Phí cưỡi voi',1,15,6,800000,'VND','group','active',FALSE),
(41,'TOUR_TH_01','Bangkok - Pattaya: Thiên đường biển','bangkok-pattaya-thien-duong-bien',24,1,'Tour Thái Lan giá tốt','Khám phá thủ đô Bangkok náo nhiệt với những ngôi chùa vàng rực rỡ, vui chơi thỏa thích tại thành phố biển Pattaya và thưởng thức những show diễn nghệ thuật hoành tráng mang đậm bản sắc văn hóa xứ sở chùa Vàng.','Đảo Coral, Chùa Phật Vàng, Show Alcazar','Vé máy bay, Khách sạn 4*, Ăn uống','Tiền Tip, Visa (nếu có)',5,30,5,7500000,'VND','group','active',TRUE),
(42,'TOUR_SG_01','Singapore: Đảo quốc Sư Tử','singapore-dao-quoc-su-tu',25,2,'Khám phá Singapore hiện đại','Hành trình khám phá đảo quốc sư tử hiện đại bậc nhất thế giới, tham quan Gardens by the Bay với những siêu cây khổng lồ, chụp hình tại tượng Merlion và trải nghiệm thế giới giải trí tuyệt vời trên đảo Sentosa.','Nhạc nước Spectra, Garden by the Bay','Vé máy bay, HDV, Bảo hiểm','Chi phí cá nhân',4,20,3,12900000,'VND','group','active',FALSE),
(43,'TOUR_MY_01','Malaysia: Kuala Lumpur - Genting','malaysia-kuala-lumpur-genting',26,1,'Trải nghiệm văn hóa Malaysia','Chiêm ngưỡng tòa tháp đôi Petronas biểu tượng, chinh phục các bậc thang rực rỡ tại động Batu và tận hưởng không khí mát mẻ, vui chơi thỏa thích tại cao nguyên Genting – thành phố giải trí trên mây của Malaysia.','Tháp đôi Petronas, Động Batu','Xe đưa đón, Ăn sáng, Vé tham quan','Visa, Tiền Tip',4,25,5,8800000,'VND','group','active',FALSE),
(44,'TOUR_ID_01','Bali: Thiên đường nghỉ dưỡng','bali-thien-duong-nghi-duong',27,3,'Check-in Bali cực hot','Tận hưởng kỳ nghỉ dưỡng thiên đường tại hòn đảo Bali xinh đẹp, check-in cổng trời Lempuyang hùng vĩ, trải nghiệm xích đu Bali Swing và khám phá những bãi biển xanh ngắt cùng nền văn hóa Hindu giáo độc đáo bậc nhất.','Cổng trời, Đu quay Bali Swing','Resort 4*, Vé máy bay, Ăn uống','Tiền Tip (5$/ngày)',5,15,10,14500000,'VND','group','active',TRUE),
(45,'TOUR_TH_02','Phuket - Đảo Phi Phi','phuket-dao-phi-phi',28,2,'Nghỉ dưỡng biển đảo Thái Lan','Đắm mình trong làn nước xanh trong như ngọc tại vịnh Maya – phim trường của những bộ phim nổi tiếng, khám phá đảo Phi Phi tuyệt đẹp và tận hưởng những đêm hội sôi động trên phố đi bộ Patong náo nhiệt.','Vịnh Maya, Phố đi bộ Patong','Cano tham quan, HDV, Ăn trưa','Chi phí cá nhân',4,20,6,11200000,'VND','group','active',FALSE),
(46,'TOUR_KH_01','Cambodia: Angkor Wat huyền bí','cambodia-angkor-wat-huyen-bi',29,1,'Khám phá kỳ quan thế giới','Hành trình tìm về những giá trị lịch sử và tâm linh tại quần thể di tích Angkor Wat hùng vĩ, khám phá vẻ đẹp kiến trúc Khmer độc đáo và trải nghiệm nhịp sống bình yên tại thủ đô Phnom Penh của Campuchia.','Quần thể Angkor, Chùa Vàng Chùa Bạc','Khách sạn, Xe bus máy lạnh','Visa (cho người nước ngoài)',4,35,5,5500000,'VND','group','active',FALSE),
(47,'TOUR_PH_01','Philippines: Manila - Boracay','philippines-manila-boracay',30,2,'Khám phá biển đảo Philippines','Khám phá vẻ đẹp cổ kính của phố cổ Intramuros tại Manila và tận hưởng kỳ nghỉ tại đảo Boracay – nơi có bãi cát trắng mịn và làn nước trong xanh bậc nhất thế giới, thiên đường cho những người yêu biển đảo.','Bãi biển Boracay, Phố cổ Intramuros','Vé máy bay nội địa, Khách sạn','Ăn tối tự túc',5,15,8,18900000,'VND','group','active',FALSE),
(48,'TOUR_LA_01','Lào: Luang Prabang - Vang Vieng','lao-luang-prabang-vang-vieng',31,1,'Tìm về sự bình yên','Tìm về chốn bình yên tại cố đô Luang Prabang thơ mộng, chiêm bái những ngôi chùa cổ kính và trải nghiệm các hoạt động thể thao mạo hiểm thú vị giữa thiên nhiên núi rừng hùng vĩ tại thị trấn Vang Vieng.','Thác Kuang Si, Chùa Xieng Thong','Xe giường nằm, Khách sạn','Visa',5,20,5,9200000,'VND','group','active',FALSE),
(49,'TOUR_SG_MY','Liên tuyến Singapore - Malaysia','lien-tuyen-singapore-malaysia',32,2,'2 quốc gia 1 điểm đến','Hành trình liên tuyến qua hai quốc gia phát triển nhất Đông Nam Á, kết hợp giữa sự hiện đại của Singapore và nét văn hóa đa dạng của Malaysia, mang đến những trải nghiệm tham quan, mua sắm và giải trí trọn vẹn.','Gardens by the Bay, Genting','Vé máy bay, Xe du lịch','Tip cho HDV',6,30,5,15500000,'VND','group','active',TRUE),
(50,'TOUR_MM_01','Myanmar: Yangon - Bagan','myanmar-yangon-bagan',33,3,'Vùng đất của những ngôi chùa','Chiêm bái vẻ đẹp lộng lẫy của chùa vàng Shwedagon tại Yangon và quay ngược thời gian khám phá hàng nghìn ngôi đền cổ kính lung linh dưới ánh bình minh tại vùng đất huyền bí Bagan, niềm tự hào của người dân Myanmar.','Chùa Shwedagon, Bình minh Bagan','Vé máy bay, HDV','Phí chụp ảnh',5,12,12,16800000,'VND','group','active',FALSE),
(51,'TOUR_TH_03','Chiang Mai - Chiang Rai','chiang-mai-chiang-rai',34,1,'Vẻ đẹp vùng Bắc Thái','Khám phá vùng đất Bắc Thái đầy quyến rũ với vẻ đẹp kiến trúc độc đáo của Chùa Trắng, Chùa Đen và tìm hiểu về lịch sử huyền bí của vùng Tam Giác Vàng cùng nhịp sống thanh bình, mộc mạc của người dân.','Chùa Trắng (Wat Rong Khun)','Ăn theo chương trình, Xe','Chi phí cá nhân',4,20,5,10500000,'VND','group','active',FALSE),
(52,'TOUR_BN_01','Brunei: Vương quốc giàu có','brunei-vuong-quoc-giau-co',35,2,'Khám phá vương quốc Hồi giáo','Lạc bước vào vương quốc giàu có bậc nhất thế giới với những thánh đường Hồi giáo bằng vàng ròng lộng lẫy, tham quan cung điện hoàng gia xa hoa và tìm hiểu về đời sống thanh bình của người dân Brunei hiền hậu.','Thánh đường Jame/Asr Hassanil Bolkiah','Vé máy bay, Khách sạn 5*','Tiền Tip',4,15,10,19900000,'VND','group','active',FALSE),
(53,'TOUR_JP_02','Nhật Bản: Cung đường vàng','nhat-ban-cung-duong-vang',36,3,'Hành trình Tokyo - Fuji - Kyoto','Trải nghiệm cung đường vàng kết nối những giá trị tinh hoa của Nhật Bản, từ thủ đô Tokyo hiện đại, núi Phú Sĩ hùng vĩ đến cố đô Kyoto cổ kính với những ngôi chùa linh thiêng và nét văn hóa trà đạo.','Núi Phú Sĩ, Làng Oshino Hakkai','Visa, Vé máy bay, Khách sạn 4*','Tiền Tip (7$/ngày)',6,25,5,32900000,'VND','group','active',TRUE),
(54,'TOUR_KR_02','Hàn Quốc: Seoul - Nami - Everland','han-quoc-seoul-nami-everland',37,2,'Mùa thu lá vàng xứ Kim Chi','Khám phá vẻ đẹp lãng mạn của xứ sở Kim Chi, dạo bước dưới những hàng cây lá vàng tại đảo Nami, trải nghiệm mặc Hanbok truyền thống và vui chơi thỏa thích tại công viên giải trí hàng đầu thế giới Everland đầy sôi động.','Đảo Nami, Công viên Everland','Phí Visa, Ăn uống, Vé tham quan','Chi tiêu cá nhân',5,28,5,15900000,'VND','group','active',TRUE),
(55,'TOUR_CN_01','Trung Quốc: Bắc Kinh - Thượng Hải','trung-quoc-bac-kinh-thuong-hai',38,2,'Hành trình di sản','Hành trình khám phá sự kết hợp giữa giá trị lịch sử ngàn năm của Vạn Lý Trường Thành, Tử Cấm Thành tại Bắc Kinh và nhịp sống hiện đại, sầm uất bậc nhất thế giới bên bến Thượng Hải lung linh ánh đèn.','Vạn Lý Trường Thành, Tử Cấm Thành','Visa đoàn, Khách sạn 4*','Tiền Tip',6,30,10,18500000,'VND','group','active',FALSE),
(56,'TOUR_TW_01','Đài Loan: Đài Bắc - Đài Trung - Cao Hùng','dai-loan-vong-quanh-dao',39,2,'Khám phá hòn đảo xinh đẹp','Khám phá hòn đảo xinh đẹp Đài Loan qua các thành phố lớn, chinh phục tháp 101 cao chọc trời, thả đèn trời cầu may mắn tại Thập Phần và thưởng thức thiên đường ẩm thực đường phố tại các chợ đêm náo nhiệt.','Tòa tháp 101, Hồ Nhật Nguyệt','E-visa, Vé máy bay, Ăn uống','Tiền Tip',5,25,5,11900000,'VND','group','active',FALSE),
(57,'TOUR_JP_03','Hokkaido: Mùa tuyết trắng','hokkaido-mua-tuyet-trang',40,3,'Trải nghiệm trượt tuyết Nhật Bản','Hành trình chinh phục vùng đất Hokkaido vào mùa đông kỳ ảo, trải nghiệm trượt tuyết trên những lớp tuyết xốp mịn, ngắm nhìn kênh đào Otaru lãng mạn và hòa mình vào không khí lễ hội băng tuyết độc đáo tại Nhật Bản.','Kênh đào Otaru, Hồ Toya','Trang thiết bị trượt tuyết cơ bản','Chi phí cá nhân',6,15,12,45000000,'VND','group','active',FALSE),
(58,'TOUR_CN_02','Phượng Hoàng Cổ Trấn - Trương Gia Giới','phuong-hoang-co-tran-truong-gia-gioi',41,2,'Hành trình tiên cảnh','Lạc bước vào chốn bồng lai tiên cảnh tại Trương Gia Giới với những cột đá hùng vĩ và dạo bước qua những con ngõ nhỏ đầy rêu phong của Phượng Hoàng Cổ Trấn nghìn năm tuổi soi bóng bên dòng sông Đà Giang.','Cầu Kính, Phượng Hoàng Cổ Trấn','Visa, Tàu cao tốc, Ăn uống','Tiền Tip',6,35,10,13900000,'VND','group','active',TRUE),
(59,'TOUR_KR_03','Hàn Quốc: Đảo Jeju - Thiên đường tình yêu','han-quoc-dao-jeju',42,2,'Nghỉ dưỡng tại đảo ngọc Jeju','Tận hưởng kỳ nghỉ lãng mạn tại đảo ngọc Jeju – nơi được mệnh danh là thiên đường tình yêu với những ngọn núi lửa độc đáo, thác nước kỳ vĩ và những bãi biển xanh mát mà không cần thủ tục xin visa phức tạp.','Đỉnh núi Seongsan, Thác Cheonjiyeon','Vé máy bay, Khách sạn 4*','Bảo hiểm',5,20,5,17500000,'VND','group','active',FALSE),
(60,'TOUR_CN_03','Cửu Trại Câu: Thiên đường hạ giới','cuu-trai-cau-thien-duong',43,3,'Khám phá hồ nước ngũ sắc','Chiêm ngưỡng vẻ đẹp siêu thực của thiên đường hạ giới Cửu Trại Câu, nơi có những hồ nước ngũ sắc trong vắt, những ngọn thác đổ hùng vĩ và cánh rừng nguyên sinh rực rỡ sắc màu mỗi khi thu sang đông tới.','Hồ Ngũ Sắc, Thác Nuorilang','Vé máy bay, Visa, HDV','Chi phí cá nhân',6,20,12,19900000,'VND','group','active',FALSE),
(61,'TOUR_JP_04','Mùa hoa Anh Đào Nhật Bản','mua-hoa-anh-dao-nhat-ban',44,3,'Sắc hồng xứ sở Phù Tang','Hòa mình vào không khí mùa xuân rực rỡ của Nhật Bản, dạo bước dưới những tán hoa anh đào nở rộ khắp các công viên nổi tiếng tại Tokyo, Osaka và tham gia các lễ hội truyền thống đậm đà bản sắc dân tộc.','Ueno Park, Lâu đài Osaka','Visa, Khách sạn, HDV','Tiền Tip',6,25,5,38900000,'VND','group','active',TRUE),
(62,'TOUR_TW_02','Đài Loan: Mùa hoa anh đào Alishan','dai-loan-alishan',45,2,'Hành trình đi tàu hỏa ngắm hoa','Trải nghiệm đi tàu hỏa hơi nước cổ xuyên qua những cánh rừng mờ ảo, ngắm nhìn rừng hoa anh đào nở rộ trên vùng núi Alishan và tận hưởng bầu không khí trong lành, se lạnh của núi rừng miền Trung Đài Loan.','Rừng Alishan, Chợ đêm Lục Hợp','Vé máy bay, Ăn uống','Tip cho HDV',5,22,5,13500000,'VND','group','active',FALSE),
(63,'TOUR_CN_04','Thành Đô - Nga Mi Sơn','thanh-do-nga-mi-son',46,2,'Vùng đất gấu trúc','Hành trình khám phá vùng đất của những chú gấu trúc dễ thương tại Thành Đô, chinh phục đỉnh Nga Mi Sơn linh thiêng và chiêm bái tượng Lạc Sơn Đại Phật bằng đá cao nhất thế giới được tạc trực tiếp vào núi.','Gấu Trúc, Lạc Sơn Đại Phật','Vé tham quan, Khách sạn','Visa cá nhân',5,25,10,15800000,'VND','group','active',FALSE),
(64,'TOUR_HK_01','Hong Kong: Disneyland - Lan Quế Phường','hong-kong-disneyland',47,3,'Thiên đường giải trí','Khám phá thiên đường giải trí Disneyland Hong Kong, ngắm nhìn toàn cảnh thành phố rực rỡ từ đỉnh núi Thái Bình và trải nghiệm nhịp sống sôi động về đêm tại khu phố Lan Quế Phường nổi tiếng sầm uất bậc nhất châu Á.','Disneyland, Đỉnh Thái Bình','Visa Hong Kong, Vé máy bay','Ăn uống tự túc',4,20,3,16900000,'VND','group','active',FALSE),
(65,'TOUR_CN_05','Tây Tạng: Huyền bí Lhasa','tay-tang-lhasa',69,3,'Hành trình tâm linh','Chinh phục nóc nhà thế giới Tây Tạng với hành trình tìm về vùng đất tâm linh Lhasa, chiêm ngưỡng cung điện Potala hùng vĩ và đắm mình trong không gian huyền bí, tĩnh lặng của những ngôi chùa Tây Tạng linh thiêng.','Cung điện Potala, Chùa Jokhang','Giấy phép vào Tây Tạng, HDV','Visa Trung Quốc',8,12,15,48000000,'VND','group','active',FALSE),
(66,'TOUR_JP_05','Nhật Bản: Cung đường Tuyết Tateyama','nhat-ban-tateyama',68,3,'Bức tường tuyết vĩ đại','Trải nghiệm hành trình xuyên qua dãy núi Alps của Nhật Bản trên cung đường Tateyama Kurobe nổi tiếng, chiêm ngưỡng bức tường tuyết cao sừng sững và tận hưởng cảnh quan thiên nhiên mùa đông tuyệt đẹp chỉ có tại xứ sở Phù Tang.','Tateyama Kurobe Alpine Route','Visa, Khách sạn, Di chuyển','Chi phí cá nhân',6,25,5,35000000,'VND','group','active',FALSE),
(67,'TOUR_CN_06','Tân Cương: Sắc màu Trung Á','tan-cuong-sac-mau',74,3,'Khám phá con đường tơ lụa','Khám phá vẻ đẹp hoang dại và huyền bí của Tân Cương, dạo bước qua những thảo nguyên xanh mướt, hồ nước trong vắt và tìm hiểu nét văn hóa đa dạng của các dân tộc dọc theo con đường tơ lụa lịch sử.','Hồ Kanas, Làng Hemu','Visa, Vé máy bay, Xe du lịch','Tiền Tip',10,15,12,45900000,'VND','group','active',FALSE),
(68,'TOUR_EU_01','Pháp - Thụy Sĩ - Ý: 3 Nước Tây Âu','phap-thuy-si-y-3-nuoc',48,3,'Hành trình lãng mạn Châu Âu','Hành trình trong mơ qua ba quốc gia lãng mạn nhất Tây Âu, chiêm ngưỡng tháp Eiffel tại Pháp, chinh phục đỉnh núi Titlis tuyết trắng tại Thụy Sĩ và thả mình trên những con thuyền Gondola tại thành phố nổi Venice thơ mộng.','Tháp Eiffel, Núi Titlis, Venice','Visa, Khách sạn 4*, Bảo hiểm','Tiền Tip (8 Euro/ngày)',10,25,12,65900000,'VND','group','active',TRUE),
(69,'TOUR_EU_02','Bắc Âu: Đan Mạch - Na Uy - Thụy Điển','bac-au-mua-he-xanh',49,3,'Khám phá vùng đất của Viking','Khám phá vẻ đẹp thiên nhiên kỳ vĩ và nhịp sống văn minh của vùng Bắc Âu, trải nghiệm du thuyền trên những vịnh biển hẹp nổi tiếng tại Na Uy và tham quan các cung điện hoàng gia tráng lệ tại Đan Mạch, Thụy Điển.','Vịnh Fjord, Cung điện Hoàng gia','Vé máy bay, Du thuyền, HDV','Visa, Tip',11,20,15,89000000,'VND','group','active',FALSE),
(70,'TOUR_EU_03','Đông Âu: Đức - Áo - Séc - Hungary','dong-au-co-kinh',50,3,'Vẻ đẹp cổ kính Đông Âu','Hành trình tìm về những giá trị văn hóa lịch sử lâu đời tại Đông Âu, chiêm ngưỡng vẻ đẹp cổ kính của thủ đô Praha, thưởng thức âm nhạc tại thành phố Vienna và ngắm nhìn Budapest lung linh bên dòng sông Danube.','Lâu đài Praha, Cung điện Schonbrunn','Vé máy bay, Ăn sáng, Xe','Visa và Tip',9,25,12,58000000,'VND','group','active',FALSE),
(71,'TOUR_EU_04','Hà Lan - Bỉ: Mùa hoa Tulip','ha-lan-bi-mua-hoa-tulip',51,3,'Sắc màu Keukenhof','Đắm chìm trong biển hoa tulip rực rỡ sắc màu tại vườn hoa Keukenhof lớn nhất thế giới, khám phá thủ đô Brussels với quảng trường Grote Markt hoành tráng và trải nghiệm nét văn hóa độc đáo của vùng đất thấp Hà Lan.','Vườn hoa Keukenhof, Quảng trường Lớn','Visa, Vé máy bay, Khách sạn','Chi phí cá nhân',7,25,10,49900000,'VND','group','active',TRUE),
(72,'TOUR_EU_05','Anh Quốc: London - Scotland','anh-quoc-london-scotland',52,3,'Xứ sở sương mù','Khám phá vẻ đẹp quý tộc của thủ đô London với đồng hồ Big Ben biểu tượng và hành trình chinh phục vùng cao nguyên Scotland hoang sơ, hùng vĩ cùng những câu chuyện truyền thuyết bí ẩn về quái vật hồ Loch Ness.','Đồng hồ Big Ben, Hồ Loch Ness','Visa Anh, Vé máy bay, Ăn uống','Tip cho HDV',9,18,12,79000000,'VND','group','active',FALSE),
(73,'TOUR_EU_06','Tây Ban Nha - Bồ Đào Nha','tay-ban-nha-bo-dao-nha',53,3,'Vũ điệu Flamenco','Hành trình khám phá bán đảo Iberia đầy nắng và gió, thưởng thức vũ điệu Flamenco nóng bỏng tại Tây Ban Nha, chiêm ngưỡng kiến trúc độc đáo của Gaudi và tìm về lịch sử hàng hải huy hoàng của Bồ Đào Nha tại tháp Belem.','Nhà thờ Sagrada Familia, Tháp Belem','Khách sạn 4*, Xe du lịch','Visa, Tip',10,22,12,69900000,'VND','group','active',FALSE),
(74,'TOUR_EU_07','Thụy Sĩ: Trải nghiệm đỉnh Jungfrau','thuy-si-dinh-jungfrau',54,3,'Nóc nhà Châu Âu','Trải nghiệm chuyến tàu hỏa leo núi đặc biệt để chinh phục đỉnh Jungfrau – nơi được mệnh danh là nóc nhà châu Âu, tận hưởng toàn cảnh dãy Alps tuyết phủ và ghé thăm những ngôi làng nhỏ đẹp như tranh vẽ.','Đỉnh Jungfrau, Làng Lauterbrunnen','Vé tàu hỏa leo núi, Khách sạn','Ăn tối, Visa',7,15,12,75000000,'VND','group','active',FALSE),
(75,'TOUR_EU_08','Ý: Rome - Florence - Venice','y-nghe-thuat-va-lich-su',55,3,'Cái nôi của Phục Hưng','Tìm về cội nguồn của nghệ thuật Phục hưng tại nước Ý, hành trình đi qua đấu trường La Mã cổ đại tại Rome, chiêm ngưỡng các kiệt tác tại Florence và trải nghiệm không gian lãng mạn vô tận tại thành phố kênh đào Venice.','Đấu trường La Mã, Tháp nghiêng Pisa','Vé tham quan, HDV, Ăn uống','Tiền Tip',8,25,12,59900000,'VND','group','active',FALSE),
(76,'TOUR_EU_09','Hy Lạp: Athens - Santorini','hy-lap-santorini',75,3,'Thiên đường xanh trắng','Hành trình khám phá cái nôi của văn minh nhân loại tại Athens và tận hưởng kỳ nghỉ thiên đường tại hòn đảo Santorini với những ngôi nhà mái vòm xanh trắng đặc trưng soi bóng bên bờ biển Địa Trung Hải xanh ngắt.','Đảo Santorini, Đền Parthenon','Khách sạn view biển, Vé máy bay','Visa, Tip',8,15,15,72000000,'VND','group','active',TRUE),
(77,'TOUR_EU_10','Pháp: Provence mùa hoa oải hương','phap-mua-hoa-oai-huong',76,3,'Sắc tím nước Pháp','Đắm mình trong sắc tím thơ mộng của những cánh đồng hoa oải hương trải dài vô tận tại miền Nam nước Pháp, tham quan những ngôi làng cổ rêu phong và tận hưởng bầu không khí lãng mạn tuyệt đối của vùng Provence.','Cánh đồng Lavender, Làng Gordes','Xe du lịch, HDV, Khách sạn','Visa, Chi phí cá nhân',7,20,10,55000000,'VND','group','active',FALSE),
(78,'TOUR_EU_11','Đức: Lễ hội bia Oktoberfest','duc-oktoberfest',77,3,'Sôi động cùng lễ hội bia','Hòa mình vào không khí sôi động và náo nhiệt của lễ hội bia lớn nhất thế giới Oktoberfest tại Munich, thưởng thức những ly bia hảo hạng, ẩm thực truyền thống Đức và tham quan lâu đài cổ tích Neuschwanstein đẹp mê hồn.','Lễ hội Oktoberfest, Lâu đài Neuschwanstein','Vé vào cổng, Khách sạn, Ăn sáng','Tiền bia tự túc',6,25,18,48000000,'VND','group','active',FALSE),
(79,'TOUR_EU_12','Ba Lan: Krakow - Warsaw','ba-lan-co-kinh',78,2,'Vẻ đẹp tiềm ẩn Đông Âu','Khám phá vẻ đẹp tiềm ẩn của đất nước Ba Lan với những di tích lịch sử quan trọng, dạo bước qua quảng trường phố cổ Warsaw phục dựng kỳ công và tham quan mỏ muối Wieliczka độc đáo sâu dưới lòng đất.','Mỏ muối Wieliczka, Phố cổ Warsaw','Khách sạn 4*, HDV địa phương','Visa, Tip',7,20,12,42000000,'VND','group','active',FALSE),
(80,'TOUR_EU_13','Croatia: Vẻ đẹp vùng biển Adriatic','croatia-bien-xanh',79,3,'Hành trình đến Dubrovnik','Khám phá vẻ đẹp rực rỡ của vùng biển Adriatic tại Croatia, dạo bước trên những bức tường thành cổ kính của thành phố Dubrovnik – bối cảnh phim đình đám và tham quan thiên nhiên xanh mướt tại vườn quốc gia hồ Plitvice.','Phố cổ Dubrovnik, Vườn quốc gia Plitvice','Du thuyền, Khách sạn','Visa, Ăn tối',8,15,12,68000000,'VND','group','active',FALSE),
(81,'TOUR_EU_14','Thụy Sĩ - Áo: Cung đường núi Alps','thuy-si-ao-alps',67,3,'Vẻ đẹp vùng cao nguyên','Hành trình đi qua những cung đường đẹp nhất vùng núi Alps, tham quan ngôi làng cổ Hallstatt thơ mộng bên hồ nước và tận hưởng không gian âm nhạc tuyệt vời tại thành phố Salzburg xinh đẹp của nước Áo.','Hallstatt, Salzburg','Vé máy bay, Khách sạn, HDV','Visa, Tip',9,20,12,65000000,'VND','group','active',FALSE),
(82,'TOUR_IS_01','Iceland: Săn cực quang','iceland-san-cuc-quang',72,3,'Vùng đất của lửa và băng','Trải nghiệm chuyến thám hiểm kỳ thú tại vùng đất của lửa và băng Iceland, săn tìm ánh sáng cực quang huyền ảo, tắm suối khoáng nóng Blue Lagoon và chiêm ngưỡng những thác nước hùng vĩ giữa thiên nhiên hoang sơ.','Cực quang, Blue Lagoon','Xe chuyên dụng, Khách sạn','Visa, Ăn uống tự túc',8,10,18,110000000,'VND','group','active',FALSE),
(83,'TOUR_AU_01','Úc: Sydney - Melbourne','uc-sydney-melbourne',56,3,'Mùa hè nước Úc','Khám phá nước Úc hiện đại với biểu tượng nhà hát Con Sò tại Sydney, trải nghiệm cung đường ven biển Great Ocean Road tuyệt đẹp tại Melbourne và ngắm nhìn những loài động vật hoang dã đặc trưng như Kanguru, Gấu túi.','Opera House, Đảo Phillip','Visa Úc, Vé máy bay, Ăn uống','Tiền Tip (7 AUD/ngày)',7,25,5,49900000,'VND','group','active',TRUE),
(84,'TOUR_US_01','Mỹ: Bờ Tây (L.A - Las Vegas)','my-bo-tay-la-vegas',57,3,'Giấc mơ Mỹ','Chạm tay vào giấc mơ Mỹ với hành trình khám phá kinh đô điện ảnh Hollywood tại Los Angeles và thử vận may tại thành phố ánh sáng Las Vegas sầm uất, nơi có những sòng bài và show diễn hàng đầu thế giới.','Hollywood, Grand Canyon','Vé máy bay, Khách sạn 3-4*','Phí phỏng vấn Visa, Tip',8,20,12,62000000,'VND','group','active',TRUE),
(85,'TOUR_US_02','Mỹ: Bờ Đông (New York - Washington D.C)','my-bo-dong-new-york',58,3,'Thủ đô và trung tâm tài chính','Hành trình khám phá các biểu tượng quyền lực của nước Mỹ, từ trung tâm tài chính New York sôi động với tượng Nữ thần Tự do đến thủ đô Washington D.C trang nghiêm với Nhà Trắng và các bảo tàng lịch sử.','Tượng Nữ Thần Tự Do, White House','Vé máy bay, HDV tiếng Việt','Visa, Tip 10$/ngày',8,20,12,68000000,'VND','group','active',FALSE),
(86,'TOUR_CA_01','Canada: Mùa lá phong đỏ','canada-mua-la-phong',59,3,'Vẻ đẹp thiên nhiên Canada','Chiêm ngưỡng sắc đỏ rực rỡ của mùa lá phong tại đất nước Canada xinh đẹp, khám phá thác nước Niagara hùng vĩ, tham quan các thành phố hiện đại như Toronto, Montreal và tận hưởng bầu không khí thanh bình của vùng Bắc Mỹ.','Thác Niagara, Đảo 1000 hòn','Visa Canada, Khách sạn','Chi phí cá nhân',10,20,12,95000000,'VND','group','active',FALSE),
(87,'TOUR_NZ_01','New Zealand: Đảo Nam','new-zealand-dao-nam',60,3,'Vùng đất của Chúa Tể Những Chiếc Nhẫn','Khám phá vùng đất Nam bán cầu với cảnh quan thiên nhiên kỳ vĩ, tham quan ngôi làng Hobbiton trong phim điện ảnh nổi tiếng, trải nghiệm du thuyền trên vịnh Milford Sound và tận hưởng không khí trong lành tại Queenstown.','Milford Sound, Làng Hobbiton','Vé máy bay, Xe tự lái hoặc có tài','Visa, Ăn uống',9,12,12,85000000,'VND','group','active',FALSE),
(88,'TOUR_TR_01','Thổ Nhĩ Kỳ: Kinh đô của những nền văn minh','tho-nhi-ky-kinh-do',61,3,'Bay khinh khí cầu tại Cappadocia','Hành trình kết nối Á – Âu đầy huyền bí, trải nghiệm bay khinh khí cầu ngắm bình minh tại Cappadocia, khám phá thành phố ngầm độc đáo và tìm hiểu về lịch sử huy hoàng của các triều đại tại Istanbul cổ kính.','Cappadocia, Thành cổ Troy','Visa, Khách sạn 5*, HDV','Khinh khí cầu (túc túc)',9,25,10,39900000,'VND','group','active',TRUE),
(89,'TOUR_EG_01','Ai Cập: Huyền thoại Kim Tự Tháp','ai-cap-huyen-thoai',62,3,'Hành trình ngược dòng thời gian','Ngược dòng thời gian trở về thời đại của các Pharaoh, chiêm ngưỡng đại Kim Tự Tháp Giza hùng vĩ, tượng Nhân Sư huyền bí và trải nghiệm du thuyền sang trọng trên dòng sông Nile huyền thoại chảy qua các di tích cổ xưa.','Kim Tự Tháp, Thung lũng các vị vua','Visa, Du thuyền 5*, Ăn uống','Tiền Tip cho địa phương',8,20,12,52000000,'VND','group','active',FALSE),
(90,'TOUR_DU_01','Dubai - Abu Dhabi: Xa hoa lộng lẫy','dubai-xa-hoa',63,2,'Trải nghiệm vương quốc dầu mỏ','Choáng ngợp trước vẻ xa hoa lộng lẫy của vương quốc dầu mỏ, chinh phục tòa tháp Burj Khalifa cao nhất thế giới, trải nghiệm đua xe trên sa mạc Safari và tham quan thánh đường Sheikh Zayed bằng vàng tại Abu Dhabi.','Burj Khalifa, Sa mạc Safari','Visa Dubai, Khách sạn 4-5*','Tiền Tip',5,30,5,24500000,'VND','group','active',TRUE),
(91,'TOUR_ZA_01','Nam Phi: Khám phá thế giới hoang dã','nam-phi-hoang-da',64,3,'Thám hiểm rừng xanh','Hành trình thám hiểm vùng đất Nam Phi đầy sắc màu, chinh phục núi Bàn hùng vĩ, tham quan mũi Hảo Vọng và trải nghiệm xe chuyên dụng săn lùng 5 loài động vật quý hiếm tại vườn quốc gia hoang dã.','Núi Bàn, Công viên Kruger','Visa, Vé máy bay, HDV','Chi phí cá nhân',8,15,12,55000000,'VND','group','active',FALSE),
(92,'TOUR_MV_01','Maldives: Thiên đường hạ giới','maldives-thien-duong',65,3,'Nghỉ dưỡng tại Water Villa','Tận hưởng kỳ nghỉ dưỡng xa hoa bậc nhất tại thiên đường hạ giới Maldives, trải nghiệm ngủ tại các Water Villa trên mặt nước xanh ngắt, lặn ngắm san hô và tận hưởng các bữa tối lãng mạn dưới bầu trời đầy sao.','Lặn biển ngắm san hô','Resort, Ăn sáng - tối, Thủy phi cơ','Vé máy bay, Ăn trưa',5,10,12,42000000,'VND','group','active',FALSE),
(93,'TOUR_US_CA','Liên tuyến Mỹ - Canada','lien-tuyen-my-canada',66,3,'Hành trình Bắc Mỹ','Hành trình kết nối những điểm đến nổi tiếng nhất vùng Bắc Mỹ qua hai quốc gia láng giềng, khám phá vẻ đẹp hiện đại của các thành phố lớn và sự hùng vĩ của thiên nhiên biên giới giữa Mỹ và Canada.','Thác Niagara, New York','Khách sạn, Xe di chuyển','Visa 2 nước, Tip',12,15,12,125000000,'VND','group','active',FALSE),
(94,'TOUR_AU_02','Úc: Perth - Vẻ đẹp hoang sơ','uc-perth',70,3,'Khám phá Tây Úc','Tìm về vẻ đẹp hoang sơ và bình yên của vùng Tây Úc, check-in cùng loài chuột túi Quokka thân thiện trên đảo Rottnest, khám phá sa mạc Pinnacles kỳ ảo và tận hưởng không gian thoáng đạt tại thành phố Perth xinh đẹp.','Quokka, Sa mạc Pinnacles','Visa, Vé máy bay, Ăn uống','Tip',6,18,5,42000000,'VND','group','active',FALSE),
(95,'TOUR_BR_01','Brazil - Argentina: Nam Mỹ rực lửa','nam-my-ruc-lua',71,3,'Vũ điệu Samba và Tango','Hành trình rực lửa qua hai quốc gia Nam Mỹ sôi động, chiêm ngưỡng tượng Chúa Cứu Thế tại Brazil, thác nước Iguazu hùng vĩ trên biên giới và đắm mình trong vũ điệu Tango quyến rũ tại thủ đô Buenos Aires của Argentina.','Tượng Chúa Cứu Thế, Thác Iguazu','Vé máy bay, Khách sạn, HDV','Visa Nam Mỹ',14,12,15,185000000,'VND','group','active',FALSE),
(96,'TOUR_IN_01','Ấn Độ: Tam giác vàng Delhi - Agra - Jaipur','an-do-tam-giac-vang',73,2,'Khám phá văn hóa Ấn Độ','Hành trình khám phá vùng đất huyền bí Ấn Độ qua cung đường tam giác vàng, chiêm ngưỡng kiệt tác tình yêu Taj Mahal bằng đá cẩm thạch trắng và tìm hiểu nền văn hóa rực rỡ, đa dạng của người dân bản địa.','Taj Mahal, Pháo đài Amber','Visa Ấn Độ, Khách sạn 5*','Tiền Tip',6,25,12,18500000,'VND','group','active',FALSE),
(97,'TOUR_MA_01','Morocco: Xứ sở nghìn lẻ một đêm','morocco-nghin-le-mot-dem',80,3,'Khám phá Bắc Phi huyền bí','Hành trình lạc bước vào thế giới nghìn lẻ một đêm tại Morocco, khám phá thành phố xanh Chefchaouen ảo diệu, trải nghiệm cưỡi lạc đà ngắm hoàng hôn trên sa mạc Sahara và tham quan các cung điện cổ kính mang đậm kiến trúc Hồi giáo.','Chefchaouen, Sahara','Khách sạn 4*, Xe địa hình','Visa, Tip',9,15,12,52000000,'VND','group','active',FALSE),
(98,'TOUR_MX_01','Mexico: Di sản Maya','mexico-di-san-maya',81,3,'Vùng đất của các vị thần','Tìm hiểu về nền văn minh Maya cổ xưa tại Mexico, chinh phục kim tự tháp Chichen Itza kỳ vĩ, tham quan các thành phố cổ đầy màu sắc và tận hưởng làn nước xanh ngắt tại các bãi biển thiên đường ở vùng Cancun.','Chichen Itza, Cancun','HDV bản địa, Vé tham quan','Visa Mexico',10,12,12,88000000,'VND','group','active',FALSE),
(99,'TOUR_RU_01','Nga: Moscow - Saint Petersburg','nga-mua-thu-vang',82,3,'Mùa thu nước Nga','Chiêm ngưỡng vẻ đẹp lộng lẫy của nước Nga vào mùa thu vàng, dạo bước qua Quảng trường Đỏ lịch sử tại Moscow và tham quan bảo tàng Hermitage cùng những cung điện tráng lệ tại thành phố Saint Petersburg cổ kính, mộng mơ.','Quảng trường Đỏ, Bảo tàng Hermitage','Visa Nga, Vé máy bay','Chi phí cá nhân',8,25,10,55000000,'VND','group','active',FALSE),
(100,'TOUR_KE_01','Kenya: Mùa thú di cư','kenya-thu-di-cu',83,3,'Trải nghiệm hoang dã Châu Phi','Trải nghiệm chuyến safari hoang dã đích thực tại Kenya, tận mắt chứng kiến cuộc di cư vĩ đại của hàng triệu loài động vật trên thảo nguyên Maasai Mara và khám phá nét văn hóa độc đáo của các bộ lạc địa phương.','Khu bảo tồn Maasai Mara','Xe chuyên dụng Safari, HDV','Visa Kenya, Tip',9,10,15,75000000,'VND','group','active',FALSE);

INSERT IGNORE INTO tour_media (id, tour_id, media_type, media_url, alt_text, sort_order, is_active)
VALUES
(1,1,'cover','https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Favatar%2F1742405317.jpg&w=1920&q=75','Bà Nà Hills',0,TRUE),
(2,2,'cover','https://ik.imagekit.io/tvlk/blog/2023/01/nha-tho-duc-ba-cover.jpg?tr=q-70,c-at_max,w-500,h-250,dpr-2','Nhà thờ Đức Bà',0,TRUE),
(3,3,'cover','https://cdn3.ivivu.com/2019/07/vinh-ha-long-cat-ba-tuyet-tac-thien-nhien-nhin-tu-bau-troi-ivivu-1.jpg','Toàn cảnh Vịnh Hạ Long',0,TRUE),
(4,3,'image','https://static.vinwonders.com/production/hang-sung-sot-1.jpg','Hang Sửng Sốt bên trong',1,TRUE),
(5,3,'image','https://mia.vn/media/uploads/blog-du-lich/den-hang-luon-cheo-thuyen-kayak-ngam-khi-vang-va-nhieu-hoat-dong-thu-vi-khac-1-1641810323.jpg','Chèo thuyền Kayak trên vịnh',2,TRUE),
(6,4,'cover','https://cdn.tcdulichtphcm.vn/upload/4-2024/images/2024-11-26/0fd57d0b6abbd1e588aa11-1732620855-902-width1387height780.jpg','Đỉnh Fansipan trong mây',0,TRUE),
(7,4,'image','https://cdn.tgdd.vn/Files/2022/09/09/1466405/kham-pha-ban-cat-cat-mong-mo-giua-nui-rung-sa-pa-hung-vi-202209091635373855.jpg','Bản Cát Cát mộng mơ',1,TRUE),
(8,4,'image','https://xesaoviet.com.vn/wp-content/uploads/2024/08/sapa-mua-lua-chin-1.jpg','Ruộng bậc thang Sapa mùa lúa',2,TRUE),
(9,5,'cover','https://images2.thanhnien.vn/528068263637045248/2024/11/14/anh-1-1731543645326509186261.jpg?_gl=1*2rbyqz*_ga*MjA5NTI2MzE0Mi4xNzc4NTAwNjc5*_ga_DDKGVNZ9BG*czE3Nzg1MDA2NzkkbzEkZzAkdDE3Nzg1MDA2NzkkajYwJGwwJGgw','Thuyền nan trên dòng Tràng An',0,TRUE),
(10,5,'image','https://file.hstatic.net/200000836389/file/chua-bai-dinh-8_9d32e73e738749539ae17505af1b65af.jpg','Chùa Bái Đính hùng vĩ',1,TRUE),
(11,5,'image','https://www.vietnamairlines.com/jp/vi/plan-book/travel/travel-guide/mua-caves-ninh-binh/_jcr_content/root/maincontent/container/container_911134791/container_1490556511/container_2051784589/image-10-1.coreimg.85.1600.jpeg/1761031133727/its-best-to-visit-mua-caves-in-the-early-morning-for-a-breathtaking-sunrise-view.jpeg','Toàn cảnh Hang Múa từ trên cao',2,TRUE),
(12,6,'cover','https://bizweb.dktcdn.net/100/512/250/files/deo-ma-pi-leng-18981c60-cc9a-4377-b853-2814e60a4be4.jpg?v=1721309840626','Đèo Mã Pì Lèng kỳ vĩ',0,TRUE),
(13,6,'image','https://hagiangamazingtour.vn/upload/images/du-lich-ha-giang/song-nho-que-mua-nao-dep-7-.jpg','Sông Nho Quế xanh ngắt',1,TRUE),
(14,6,'image','https://image.vietgoing.com/editor/image_dio1636615366.jpg','Dinh thự họ Vương cổ kính',2,TRUE),
(15,7,'cover','https://image.vietgoing.com/editor/image_tss1637810024.jpg','Hồ Hoàn Kiếm ban mai',0,TRUE),
(16,7,'image','https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Hanoi_Temple_of_Literature_%28cropped%29.jpg/960px-Hanoi_Temple_of_Literature_%28cropped%29.jpg','Văn Miếu Quốc Tử Giám',1,TRUE),
(17,7,'image','https://static.vinwonders.com/production/ha_noi_ve_dem_banner.jpg','Phố cổ Hà Nội về đêm',2,TRUE),
(18,8,'cover','https://images.vietnamtourism.gov.vn/vn//images/2021/thac_ban_gioc.jpeg','Thác Bản Giốc đại ngàn',0,TRUE),
(19,8,'image','https://ik.imagekit.io/tvlk/blog/2025/03/3-1024x683.jpg?tr=q-70,c-at_max,w-1000,h-600','Suối Lê-nin trong vắt',1,TRUE),
(20,8,'image','https://media.vietravel.com/images/Content/du-lich-dong-nguom-ngao-1.jpg','Động Ngườm Ngao thạch nhũ',2,TRUE),
(21,9,'cover','https://mia.vn/media/uploads/blog-du-lich/ghe-tham-cong-ngo-mon-kham-pha-di-san-kien-truc-duoi-trieu-nguyen-01-1638279590.png','Cổng Ngọ Môn Đại Nội',0,TRUE),
(22,9,'image','https://images.unsplash.com/photo-1563811771046-ba984ff30900?auto=format&fit=crop&w=1200&q=80','Chùa Thiên Mụ soi bóng',1,TRUE),
(23,9,'image','https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Khai_Dinh_tomb_Hue_%2827767136409%29.jpg/960px-Khai_Dinh_tomb_Hue_%2827767136409%29.jpg','Kiến trúc Lăng Khải Định',2,TRUE),
(24,10,'cover','https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80','Phố cổ Hội An đèn lồng',0,TRUE),
(25,10,'image','https://statics.vinpearl.com/chua-cau-hoi-an-1_1628047366.jpg','Chùa Cầu về đêm',1,TRUE),
(26,10,'image','https://daivietourist.vn/wp-content/uploads/2025/06/tha-den-hoa-dang-hoi-an-13.jpg','Thả hoa đăng trên sông Hoài',2,TRUE),
(27,11,'cover','https://i1-vnexpress.vnecdn.net/2021/03/19/NhaTrang-KhoaTran-27-1616120145.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=fxfAn5DgbEkhinFh73gVLw','Vịnh Nha Trang nhìn từ trên cao',0,TRUE),
(28,11,'image','https://statics.vinpearl.com/lan-bien-nha-trang-01_1635674501.jpg','Lặn ngắm san hô Hòn Mun',1,TRUE),
(29,11,'image','https://news.baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/dataimages/201906/original/images5366685_images5362234_R1.jpg','Bãi tắm Robinson Island',2,TRUE),
(30,12,'cover','https://i1-vnexpress.vnecdn.net/2019/08/20/MG-6292-2-RS-1566235112.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=KyKG60Oy_iL_aCovs6nrTQ','Đà Lạt thành phố sương mù',0,TRUE),
(31,12,'image','https://www.anamandara-resort.com/wp-content/uploads/sites/233/2023/07/Picture1.png','Thác Datanla hùng vĩ',1,TRUE),
(32,12,'image','https://mia.vn/media/uploads/blog-du-lich/langbiang-01-1691202638.jpg','Đỉnh Langbiang rực rỡ',2,TRUE),
(33,13,'cover','https://media.baobinhphuoc.com.vn/upload/news/12_2021/image001_10470506122021.jpg','Gành Đá Đĩa độc đáo',0,TRUE),
(34,13,'image','https://statics.vinpearl.com/bai-xep-toi-thay-hoa-vang-tren-co-xanh_1750951619.jpg','Bãi Xép - Hoa vàng cỏ xanh',1,TRUE),
(35,13,'image','https://mia.vn/media/uploads/blog-du-lich/den-mui-dien-phu-yen-kham-pha-ve-dep-tuyet-my-diem-cuc-dong-viet-nam-03-1664857052.jpg','Mũi Điện cực Đông',2,TRUE),
(36,14,'cover','https://statics.vinpearl.com/eo-gio-quy-nhon-1_1703490274.jpg','Eo Gió Quy Nhơn nắng vàng',0,TRUE),
(37,14,'image','https://imagevietnam.vnanet.vn//MediaUpload/Org/2023/07/27/5-cover27-10-19-16.jpg','Biển Kỳ Co nước trong xanh',1,TRUE),
(38,14,'image','https://zoomtravel.vn/upload/images/tinh-xa-ngoc-hoa-0.jpg','Tượng phật Tịnh Xá Ngọc Hòa',2,TRUE),
(39,15,'cover','https://images.vietnamtourism.gov.vn/vn//images/2024/thang_12/bao_tang_ca_phe_1.jpg','Bảo tàng Thế giới Cà phê',0,TRUE),
(40,15,'image','https://i.imgur.com/l17mLBP.jpeg','Thác Dray Nur hùng vĩ',1,TRUE),
(41,15,'image','https://zoomtravel.vn/upload/images/cau-treo-buon-don-1-min.jpeg','Cầu treo Buôn Đôn',2,TRUE),
(42,16,'cover','https://mia.vn/media/uploads/blog-du-lich/tuong-chua-kito-vung-tau-tuong-chua-jesus-lon-nhat-chau-a-01-1633683877.jpg','Tượng Chúa Kitô Vũng Tàu',0,TRUE),
(43,16,'image','https://media.baobinhphuoc.com.vn/upload/news/1_2023/image001_10283403012023.jpg','Ngọn Hải Đăng cổ nhất VN',1,TRUE),
(44,16,'image','https://ik.imagekit.io/tvlk/blog/2022/07/bai-sau-1.jpg?tr=q-70,c-at_max,w-500,h-250,dpr-2','Bãi Sau Vũng Tàu',2,TRUE),
(45,17,'cover','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-RdG-supGsm1ioBrfV0LwJ7qNtO39R-GDSg&s','Bình minh biển Phú Quốc',0,TRUE),
(46,17,'image','https://mia.vn/media/uploads/blog-du-lich/grand-world-1-1710640341.jpg','Grand World thành phố không ngủ',1,TRUE),
(47,17,'image','https://cdn3.ivivu.com/2024/01/vinpearl-safari-phu-quoc-ivivu-1.jpg','Safari vườn thú bán hoang dã',2,TRUE),
(48,18,'cover','https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/8/25/946185/Can-Tho-10.jpg','Ghe thuyền chợ nổi Cái Răng',0,TRUE),
(49,18,'image','https://mia.vn/media/uploads/blog-du-lich/den-ben-ninh-kieu-ngam-ve-dep-cua-tay-do-long-lay-ve-dem-02-1649167496.jpeg','Bến Ninh Kiều về đêm',1,TRUE),
(50,18,'image','https://statics.vinpearl.com/lo-hu-tieu-can-tho-01_1628009175.jpg','Lò hủ tiếu truyền thống',2,TRUE),
(51,19,'cover','https://file.hstatic.net/200000852337/article/1_3bd107ede41846cd9e15cc5b06c461e1.png','Đồi cát trắng Mũi Né',0,TRUE),
(52,19,'image','https://ik.imagekit.io/tvlk/blog/2022/12/suoi-tien-mui-ne-6.jpg?tr=q-70,c-at_max,w-500,h-250,dpr-2','Suối Tiên Phan Thiết',1,TRUE),
(53,19,'image','https://muinejeeptour.com/wp-content/uploads/2020/04/nhung-chiec-xe-leo-doi-cat-mui-ne-768x576.jpg','Xe Jeep trên đồi cát',2,TRUE),
(54,20,'cover','https://i1-vnexpress.vnecdn.net/2019/02/22/nui-ba-den-81-1550803601.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=sIdIEsjEUTIWjAVlKo74-A','Chùa Bà Đen trên đỉnh núi',0,TRUE),
(55,20,'image','https://i1-dulich.vnecdn.net/2025/01/16/di-nh-nu-i-le-nha-t-hu-ng-pha-6559-1501-1737020880.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=578km73nPXBKh7oAqrMhfg','Cáp treo núi Bà Đen',1,TRUE),
(56,20,'image','https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/T%C3%B2a_Th%C3%A1nh_T%C3%A2y_Ninh_042013.JPG/500px-T%C3%B2a_Th%C3%A1nh_T%C3%A2y_Ninh_042013.JPG','Tòa Thánh Tây Ninh',2,TRUE),
(57,21,'cover','https://image.vietgoing.com/editor/image_nhs1623077831.jpg','Ngũ Hành Sơn Đà Nẵng',0,TRUE),
(58,21,'image','https://mia.vn/media/uploads/blog-du-lich/Pho-den-long-Hoi-An-Chiem-nguong-ve-dep-lung-linh-day-lang-man-01-1618322258.jpg','Phố cổ Hội An đèn lồng',1,TRUE),
(59,21,'image','https://statics.vinpearl.com/cau-rong-da-nang-0_1629438622.png','Cầu Rồng phun lửa',2,TRUE),
(60,22,'cover','https://xesaoviet.com.vn/wp-content/uploads/2025/12/trekking-ban-lao-chai-1.jpg','Trekking bản Lao Chải',0,TRUE),
(61,22,'image','https://vouchersapa.vn/wp-content/uploads/2025/09/vouchersapa-2025-09-19T230942.904.jpg','Người dân tộc Mông Sapa',1,TRUE),
(62,22,'image','https://media-cdn-v2.laodong.vn/storage/newsportal/2025/7/16/1541020/Ta-Van-Sa-Pa-Large.jpeg','Cảnh sắc Tả Van',2,TRUE),
(63,23,'cover','https://image.vietgoing.com/tour/01/44/vietgoing_jwj2404025937.webp','Tàu tham quan Vịnh Hạ Long',0,TRUE),
(64,23,'image','https://statics.vinpearl.com/hon-trong-mai-1_1629525454.JPG','Hòn Trống Mái',1,TRUE),
(65,23,'image','https://mia.vn/media/uploads/blog-du-lich/den-hang-luon-cheo-thuyen-kayak-ngam-khi-vang-va-nhieu-hoat-dong-thu-vi-khac-1-1641810323.jpg','Hang Luồn - Kayak',2,TRUE),
(66,24,'cover','https://cdn3.ivivu.com/2014/06/TTNhatrang-A3.jpg','Cano lướt sóng Nha Trang',0,TRUE),
(67,24,'image','https://mia.vn/media/uploads/blog-du-lich/tam-bun-hon-tam-03-1700401349.jpg','Tắm bùn Hòn Tằm',1,TRUE),
(68,24,'image','https://statics.vinpearl.com/vinh-san-ho-01_1635835935.jpg','Rạn san hô Vịnh San Hô',2,TRUE),
(69,25,'cover','https://mia.vn/media/uploads/blog-du-lich/Cau-go-san-may-dalat-tien-canh-tuyet-dep-cua-vung-cao-01-1635289379.jpg','Cầu gỗ săn mây Đà Lạt',0,TRUE),
(70,25,'image','https://statics.vinpearl.com/doi-che-cau-dat-thumbnail_1688736851.jpg','Đồi chè Cầu Đất xanh mướt',1,TRUE),
(71,25,'image','https://cdn3.ivivu.com/2015/07/binh-minh-len-ruc-ro-noi-thung-lung-bac-son-ivivu-1.jpg','Bình minh thung lũng',2,TRUE),
(72,26,'cover','https://statics.vinpearl.com/cau-ca-phu-quoc-1_1630808479.jpg','Câu cá trên tàu Phú Quốc',0,TRUE),
(73,26,'image','https://phuquoctrip.com/files/images/vui-choi-phu-quoc/bai-bien-phu-quoc/bai-sao-phu-quoc-dep-nhat.jpg','Bãi Sao cát trắng',1,TRUE),
(74,26,'image','https://letravel.vn/uploaded/Anh-Cam-NangDL/cl-dl-phu-quoc/trainghiemlanngamsanhotaiquandaoanthoi.jpg','San hô quần đảo An Thới',2,TRUE),
(75,27,'cover','https://mia.vn/media/uploads/blog-du-lich/tuyet-tinh-coc-ninh-binh-1-1690702331.jpg','Tuyệt Tình Cốc Ninh Bình',0,TRUE),
(76,27,'image','https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Chuaamtien5.JPG/500px-Chuaamtien5.JPG','Động Am Tiên hoang sơ',1,TRUE),
(77,27,'image','https://mia.vn/media/uploads/blog-du-lich/co-mot-hang-mua-dep-nao-long-nguoi-giua-may-troi-ninh-binh-6-1640608283.jpg','Cổng trời Hang Múa',2,TRUE),
(78,28,'cover','https://i1-dulich.vnecdn.net/2025/04/12/DSC06053-2-1744449276-1744449824.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=G6dQASwIVXEQlsL44Hacng','Địa đạo Củ Chi lối vào',0,TRUE),
(79,28,'image','https://cdn3.ivivu.com/2020/03/bao-tang-vu-khi-tu-nhan-lon-nhat-viet-nam-ivivu-2.jpg','Khu trưng bày vũ khí',1,TRUE),
(80,28,'image','https://mia.vn/media/uploads/blog-du-lich/dia-dao-cu-chi-12-1721208626.jpg','Trải nghiệm đào hầm',2,TRUE),
(81,29,'cover','https://mia.vn/media/uploads/blog-du-lich/mua-hoa-tam-giac-mach-ha-giang-ngam-nhin-mot-ha-giang-ruc-ro-dip-cuoi-nam-01-1642692940.jpg','Cánh đồng hoa Tam Giác Mạch',0,TRUE),
(82,29,'image','https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/1/18/1139524/Hoa-To-Day-Mu-Cang-C-19.jpg','Bản làng vùng cao mùa hoa',1,TRUE),
(83,29,'image','https://mia.vn/media/uploads/blog-du-lich/nhung-em-be-ha-giang-dang-yeu-tren-vung-cao-nguyen-da-01-1667357812.jpg','Trẻ em vùng cao Hà Giang',2,TRUE),
(84,30,'cover','https://statics.vinpearl.com/vinh-Lang-Co-Hue-hinh-anh1_1624952931.jpg','Vịnh Lăng Cô nhìn từ Hải Vân',0,TRUE),
(85,30,'image','https://images.unsplash.com/photo-1563811771046-ba984ff30900?auto=format&fit=crop&w=1200&q=80','Khúc cua đèo Hải Vân',1,TRUE),
(86,30,'image','https://mia.vn/media/uploads/blog-du-lich/den-hue-thi-nho-ghe-dam-lap-an-check-in-hoang-hon-nhe-ban-oi-1-1637679283.jpeg','Hoàng hôn Đầm Lập An',2,TRUE),
(87,31,'cover','https://statics.vinpearl.com/khu-du-lich-my-khanh-can-tho-3_1624587715.jpg','Làng du lịch Mỹ Khánh',0,TRUE),
(88,31,'image','https://autopro8.mediacdn.vn/thumb_w/640/2019/2/6/photo-1-1549435846250603170835.jpg','Đua heo dân gian',1,TRUE),
(89,31,'image','https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Tam_quan_Thi%E1%BB%81n_vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam.JPG/500px-Tam_quan_Thi%E1%BB%81n_vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam.JPG','Thiền Viện Trúc Lâm Phương Nam',2,TRUE),
(90,32,'cover','https://cdn3.ivivu.com/2023/09/ho-thang-hen-ivivu-2.jpg','Hồ Thang Hen xanh ngọc',0,TRUE),
(91,32,'image','https://cdn3.ivivu.com/2024/06/Nui-Mat-Than-ivivu-1.jpg','Núi Mắt Thần Cao Bằng',1,TRUE),
(92,32,'image','https://www2.thesaigontimes.vn/wp-content/uploadsgtt/2022/08/3-Ho-Seo-My-Ty-5.jpg','Cắm trại ven hồ',2,TRUE),
(93,33,'cover','https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80','Chèo thúng Rừng dừa Bảy Mẫu',0,TRUE),
(94,33,'image','https://cdn.tcdulichtphcm.vn/upload/2-2021/images/2021-06-17/1623947755-th--ng-2.jpg','Trình diễn múa thúng',1,TRUE),
(95,33,'image','https://images.vietnamtourism.gov.vn/vn//images/2021/thang_12/1312.rung_dua_nuoc_cam_thanh2.jpg','Hệ sinh thái rừng dừa',2,TRUE),
(96,34,'cover','https://zoomtravel.vn/upload/images/thap-banh-it-0.jpg','Tháp Bánh Ít Quy Nhơn',0,TRUE),
(97,34,'image','https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/World_Trade_Center%2C_New_York_City_-_aerial_view_%28March_2001%29.jpg/960px-World_Trade_Center%2C_New_York_City_-_aerial_view_%28March_2001%29.jpg','Tháp Đôi trung tâm thành phố',1,TRUE),
(98,34,'image','https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/ChamMuiNe.jpg/960px-ChamMuiNe.jpg','Kiến trúc Champa cổ',2,TRUE),
(99,35,'cover','https://cdn3.ivivu.com/2024/05/hon-nua-ivivu-7.jpg','Đảo Hòn Nưa hoang sơ',0,TRUE),
(100,35,'image','https://images.vietnamtourism.gov.vn/vn//images/2023/thang_8/1608.nga_ba_dong_duong_1.jpg','Cột mốc 3 tỉnh ven biển',1,TRUE),
(101,35,'image','https://phuquyfourseasons.com/wp-content/uploads/2024/01/hai-san-dao-binh-hung-25.jpg','BBQ hải sản bãi biển',2,TRUE),
(102,36,'cover','https://imagevietnam.vnanet.vn//MediaUpload/Org/2023/08/08/homay-18-13-44-27.jpg','Công viên Hồ Mây',0,TRUE),
(103,36,'image','https://cdn3.ivivu.com/2016/02/Nhung-cap-treo-vuot-nui-an-tuong-khap-the-gioi-ivivu-1.jpg','Cáp treo núi Tương Kỳ',1,TRUE),
(104,36,'image','https://ik.imagekit.io/tvlk/blog/2022/11/khu-du-lich-ho-may-13.jpg?tr=q-70,c-at_max,w-1000,h-600','Trò chơi máng trượt Hồ Mây',2,TRUE),
(105,37,'cover','https://ik.imagekit.io/tvlk/blog/2022/12/cam-trai-ho-dau-tieng-1.jpg?tr=q-70,c-at_max,w-1000,h-600','Cắm trại hồ Dầu Tiếng',0,TRUE),
(106,37,'image','https://cdn3.ivivu.com/2020/06/ho-tay-ivivu-4.jpg','Hoàng hôn trên hồ',1,TRUE),
(107,37,'image','https://mia.vn/media/uploads/blog-du-lich/huong-dan-di-nui-ba-den-tu-tphcm-chi-tiet-tu-a-den-z-4-1661273666.jpg','Núi Bà Đen từ xa',2,TRUE),
(108,38,'cover','https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&w=1200&q=80','Lâu đài Rượu Vang Mũi Né',0,TRUE),
(109,38,'image','https://beautywood.vn/public/upload/images/tin-tuc/ham-ruou-duoi-long-dat/ham-ruou-duoi-long-dat-3.png','Hầm rượu dưới lòng đất',1,TRUE),
(110,38,'image','https://i1-ione.vnecdn.net/2014/01/09/laudai1-5913-1389259916.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=qfUuHOqODUDGIEGYjtK3uQ','Kiến trúc lâu đài Châu Âu',2,TRUE),
(111,39,'cover','https://statics.vinpearl.com/lang-co-duong-lam-1_1681311454.jpg','Làng cổ Đường Lâm',0,TRUE),
(112,39,'image','https://nhn.1cdn.vn/thumbs/1200x630/2023/05/27/cong-lang-mong-phu.jpg','Cổng làng Mông Phụ',1,TRUE),
(113,39,'image','https://cdn.baophapluat.vn/w1280/uploaded/trinhninh/2018_04_14/anh_1_1_of_1_1_cbcx.jpg','Nhà cổ đá ong',2,TRUE),
(114,40,'cover','https://top7vietnam.sgtiepthi.vn/wp-content/uploads/2022/10/Ho-lak-1920x1080-1.jpg','Hoàng hôn Hồ Lắk',0,TRUE),
(115,40,'image','https://mia.vn/media/uploads/blog-du-lich/Den-Biet-dien-Bao-Dai-lam-ngay-po-anh-dep-ngat-ngay-01-1652222632.jpg','Biệt điện Bảo Đại Đắk Lắk',1,TRUE),
(116,40,'banner','https://phunuvietnam.mediacdn.vn/thumb_w/1000/179072216278405120/2025/12/16/dsc04576-1765918167022131865832.jpg','Văn hóa người M''Nông bên hồ',2,TRUE),
(117,41,'cover','https://vietlandtravel.vn/upload/images/bangkok-ve-dem.jpg','Toàn cảnh Bangkok về đêm',0,TRUE),
(118,41,'image','https://admin.goldensmiletravel.com/upload/old/images/2025/01/16/chua-phat-ngoc-5-1737034680.webp','Chùa Phật Ngọc lộng lẫy',1,TRUE),
(119,41,'banner','https://bazantravel.com/cdn/medias/uploads/29/29761-pattaya-thai-lan-670x446.jpg','Biển Pattaya xanh ngắt',2,TRUE),
(120,42,'cover','https://cdn-images.vtv.vn/thumb_w/740/2019/10/10/photo-1-15706773672561948662638.jpg','Tượng Sư tử biển Merlion',0,TRUE),
(121,42,'image','https://cdn3.ivivu.com/2024/09/Garden-by-the-Bay-Singapore-ivivu-9.jpg','Gardens by the Bay rực rỡ',1,TRUE),
(122,42,'banner','https://saithanhtourist.vn/public/elfinder/upload/elfinder/Blog/Singapore/nhung-dieu-can-biet-truoc-khi-du-lich-singapore-lan-dau-cam-nang-cho-nguoi-moi-5.jpg','Marina Bay Sands sang trọng',2,TRUE),
(123,43,'cover','https://dulichminhanh.com.vn/wp-content/uploads/2023/10/thap-doi-petronas-5.jpg','Tháp đôi Petronas kiêu hãnh',0,TRUE),
(124,43,'image','https://otrip.vn/wp-content/uploads/2022/12/3.png','Động Batu huyền bí',1,TRUE),
(125,43,'banner','https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272','Cao nguyên Genting mờ sương',2,TRUE),
(126,44,'cover','https://static.vinwonders.com/production/cong-troi-bali-da-lat-4.jpg','Cổng trời Bali check-in',0,TRUE),
(127,44,'image','https://phuotvivu.com/blog/wp-content/uploads/2021/01/ruong-bali.png','Ruộng bậc thang Tegalalang',1,TRUE),
(128,44,'banner','https://vietluxtour.com/Upload/images/2024/kham%20pha%20nuoc%20ngoai/Bali/Ho%C3%A0ng%20h%C3%B4n%20tr%C3%AAn%20%C4%91%E1%BB%81n%20Tanah%20Lot.jpg','Hoàng hôn trên biển Uluwatu',2,TRUE),
(129,45,'cover','https://innotour.vn/image/catalog/blog-du-lich/vinh-maya/maya-3.png','Vịnh Maya huyền thoại',0,TRUE),
(130,45,'image','https://res.klook.com/image/upload/w_1265,h_791,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/jfydmwtrnf5vymppief3.webp','Cano trên biển Phuket',1,TRUE),
(131,45,'banner','https://res.klook.com/image/upload/u_activities:glayainwg7uxmszhzfy2,w_1.0,ar_960:460,c_scale,e_blur:10000/w_1265,h_791,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/glayainwg7uxmszhzfy2.webp','Hoàng hôn trên đảo Phi Phi',2,TRUE),
(132,46,'cover','https://www.agoda.com/wp-content/uploads/2024/04/siem-reap-cambodia-angkor-wat-1244x700.jpg','Quần thể Angkor Wat hùng vĩ',0,TRUE),
(133,46,'image','https://www.360go.com.vn/datafiles/42191/upload/images/Tin%20t%E1%BB%A9c%20/den-bayon-mang-ve-dep-doc-dao-dulich360go.png','Đền Bayon với các khuôn mặt đá',1,TRUE),
(134,46,'banner','https://media.vov.vn/sites/default/files/styles/large/public/2024-06/1_13.jpg','Bình minh trên hồ Angkor',2,TRUE),
(135,47,'cover','https://vja-ui.useleadr.com/uploads/boracay-thang-1.jpeg','Bãi cát trắng mịn Boracay',0,TRUE),
(136,47,'image','https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86','Làn nước xanh trong Philippines',1,TRUE),
(137,47,'banner','https://baohaiquanvietnam.vn/storage/users/user_6/N%C4%83m%202022/th%C3%A1ng%208/27-8/7-1.jpg','Thuyền buồm trên biển',2,TRUE),
(138,48,'cover','https://trieuhaotravel.vn/Uploads/images/leech/gdocs_1_20250918_092304_f1aa1bce.png_medium.webp','Thác Kuang Si xanh biếc',0,TRUE),
(139,48,'image','https://trieuhaotravel.vn/Uploads/images/leech/gdocs_1_20250918_091711_8ef312e9.png_medium.webp','Cố đô Luang Prabang yên bình',1,TRUE),
(140,48,'banner','https://file3.qdnd.vn/data/images/0/2025/02/24/upload_2126/1%201.jpg?dpi=150&quality=100&w=870','Chùa Xieng Thong cổ kính',2,TRUE),
(141,49,'cover','https://booking.dulichthiennhien.vn/Data/image/TIN%20T%E1%BB%A8C%20DU%20L%E1%BB%8ACH/58/singapore-ve-dem.png','Skyline Singapore về đêm',0,TRUE),
(142,49,'image','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/6d/26/83/jembatan-seri-wawasan.jpg?w=1400&h=800&s=1','Cầu Seri Wawasan Malaysia',1,TRUE),
(143,49,'banner','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/2b/b7/8e/chinatown.jpg?w=1200&h=-1&s=1','Chinatown nhộn nhịp',2,TRUE),
(144,50,'cover','https://vcdn1-vnexpress.vnecdn.net/2018/10/07/BaganSonnenaufgang-1538889622-2914-1538889735.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=f45xouNSgNaA4jWbkYNyQQ','Thung lũng đền tháp Bagan',0,TRUE),
(145,50,'image','https://mekongasean.vn/stores/news_dataimages/mekongaseanvn/012023/20/09/shwedagon-pagoda-terrace-yangon-myanmar-7855.jpg','Chùa Shwedagon mạ vàng',1,TRUE),
(146,50,'banner','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv6V1ZeapUjnUQSyx-gon0StstFS4QGTaaIA&s','Bình minh tuyệt đẹp tại Myanmar',2,TRUE),
(147,51,'cover','https://zoomtravel.vn/upload/images/wat-rong-khun-2.jpg','Wat Rong Khun (Chùa Trắng)',0,TRUE),
(148,51,'image','https://lh7-rt.googleusercontent.com/docsz/AD_4nXcYHHa6AK_jR6qhEGX-cV_-nOKOngozpTnDaYUx8sSDWrBde9Mrcxk_KVEFWTDUv2odfBEjnAdJ1vA_zR7q3RnlrTWb7aDpSi8HJlrs5ZxAE7WpxO6bYs7QgTRfWeS36l2ikqfe4A?key=zuolm4pcCQ1vYY9o3ZiLTw','Vẻ đẹp núi rừng Chiang Mai',1,TRUE),
(149,51,'banner','https://vcdn1-dulich.vnecdn.net/2022/11/08/loy-krathong-06-1667895540-9537-1667895875.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=DwizdX_mHn7D8bQX6MfB6g','Thả đèn trời Chiang Mai',2,TRUE),
(150,52,'cover','https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/08_2022/nha-tho-hoi-giao-Sultan-Omar-Ali-Saifuddin_1.jpg','Thánh đường Omar Ali Saifuddien',0,TRUE),
(151,52,'image','https://vietsuntravel.com/_next/image?url=https%3A%2F%2Fvietsuntravel.com%2Fassets%2Fuploads%2FHoang_cung_Istana_Nurul_Iman_diem_den_khong_the_bo_lo_tai_Brunei_Viet_Sun_Travel_f6f05ca6c7.png&w=3840&q=75','Hoàng cung Brunei lộng lẫy',1,TRUE),
(152,52,'banner','https://cdn3.ivivu.com/2023/02/Kampong-Ayer-ivivu1.jpg','Làng nổi Kampong Ayer',2,TRUE),
(153,53,'cover','https://www.kkday.com/vi/blog/wp-content/uploads/cee3417ba81d67f8-1024x659.jpg','Núi Phú Sĩ soi bóng',0,TRUE),
(154,53,'image','https://cdn3.ivivu.com/2016/03/tram-mac-kyoto-ivivu-1.jpg','Cố đô Kyoto trầm mặc',1,TRUE),
(155,53,'banner','https://cdn.jeepe.jp/uploads/public_image/image/282/normal_982ef2c9-f697-4577-89ad-ed07cb812edc.jpg','Ngã tư Shibuya sầm uất',2,TRUE),
(156,54,'cover','https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/y2-1715750242759.jpg','Cung điện Gyeongbokgung',0,TRUE),
(157,54,'image','https://cattour.vn/images/upload/images/z6999857511235_4998c501edb3724c4d91b5a52fc45022.jpg','Đảo Nami mùa thu lá vàng',1,TRUE),
(158,54,'banner','https://admin.goldensmiletravel.com/upload/old/images/2024/12/11/tour-han-quoc-namsan-2-1733882932.webp','Tháp N Seoul rực sáng',2,TRUE),
(159,55,'cover','https://images.unsplash.com/photo-1508804185872-d7badad00f7d','Vạn Lý Trường Thành hùng vĩ',0,TRUE),
(160,55,'image','https://trieuhaotravel.vn/Uploads/images/leech/gdocs_1_20250929_165135_aef9c803.png_medium.webp','Bến Thượng Hải lung linh',1,TRUE),
(161,55,'banner','https://bizweb.dktcdn.net/100/562/154/files/tu-cam-thanh-trung-quoc-6-jpg.jpg?v=1755751929797','Tử Cấm Thành uy nghiêm',2,TRUE),
(162,56,'cover','https://ik.imagekit.io/tvlk/blog/2022/12/thap-taipei-101-2-1024x677.png?tr=q-70,c-at_max,w-1000,h-600','Tòa tháp Taipei 101',0,TRUE),
(163,56,'image','https://cdn3.ivivu.com/2018/07/lang-co-cuu-phan-o-dai-loan-co-gi-dac-biet-ivivu-1.jpg','Phố cổ Cửu Phần',1,TRUE),
(164,56,'banner','https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/1-1675507889727.jpg','Hồ Nhật Nguyệt mộng mơ',2,TRUE),
(165,57,'cover','https://trieuhaotravel.vn/Uploads/images/leech/gdocs_1_20251003_092325_0d88c791.png_medium.webp','Cánh đồng tuyết Hokkaido',0,TRUE),
(166,57,'image','https://nippontravel.vn/wp-content/uploads/2023/08/kenh-dao-otaru-vao-ban-dem-1-1024x683.jpg','Kênh đào Otaru lãng mạn',1,TRUE),
(167,57,'banner','https://media.vietravel.com/images/Content/le-hoi-mua-dong-o-Hokkaido--1-.png','Lễ hội băng tuyết Sapporo',2,TRUE),
(168,58,'cover','https://ik.imagekit.io/tvlk/blog/2023/04/go-and-share-du-lich-phuong-hoang-co-tran-1.jpg','Phượng Hoàng Cổ Trấn cổ kính',0,TRUE),
(169,58,'image','https://dulichdaiviet.com/uploaded/2024/08/du-lich-trung-quoc-phuong-hoang-co-tran.jpg','Dòng sông Đà Giang xanh ngắt',1,TRUE),
(170,58,'banner','https://booking.pystravel.vn/wp-content/uploads/2018/06/truong-gia-gioi-pys-travel-aba.jpg','Cầu kính Trương Gia Giới',2,TRUE),
(171,59,'cover','https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/09_2024/bai_bien_hyeopjae_han_quoc_thisiskoreatours.jpg','Biển Jeju xanh ngọc',0,TRUE),
(172,59,'image','https://cdn.saigontimestravel.com/storage/images/retail/ckeditor/2025/02/1740555447_1_25.jpg','Núi Hallasan hùng vĩ',1,TRUE),
(173,59,'banner','https://bazantravel.com/cdn/medias/uploads/30/30738-thac-nuoc-cheonjiyeon.jpg','Thác nước Cheonjiyeon',2,TRUE),
(174,60,'cover','https://kimlientravel.com.vn/upload/image/image-20240108160041-2.jpeg','Hồ nước ngũ sắc Cửu Trại Câu',0,TRUE),
(175,60,'image','https://hanvinatravel.vn/uploads/images/cuu-trai-cau-mua-thu.jpeg','Mùa thu tại Cửu Trại Câu',1,TRUE),
(176,60,'banner','https://storage.googleapis.com/travelteam//upload/manageWebsite/Golden%20smile/news/ee70730f4621b25d620ff3c1cf509781.webp?GoogleAccessId=firebase-adminsdk-1qkmx%40nhanhtravel-129e6.iam.gserviceaccount.com&Expires=2255600055&Signature=u4mz0Pi%2FHReqLt3j%2BObHP4SNVF8FBF9rD4wG2ybVYhImL2UiP036oLVOlJWTlIq0znJIAYCvWtSNrzB34iBnk0QcYywAs6qPnq85qNSABXar6YpxCw5KA3%2B5zMJEDZpjFUtZOQc5r0EIwYoSsJhlajI1BXsIMYZ5t8d9riXvIcs%2FyIzOzK0TgQ8KWvIJ5VzpbfizPz6pFcyA6iYsOnjw3bxxGV1Y2OTVe7B9yAKvFoihluASK%2Fv3Gl58DagFEW9k18JLLOHh6upRd0zQ%2F30tCUqWdPnWfYuSHU3u07iDU67A2X1eqQc5Je%2BIRFDgJWEPvEpEyBWeWWf%2Bj5Jg380m3g%3D%3D','Thác nước Nuorilang rực rỡ',2,TRUE),
(177,61,'cover','https://images.unsplash.com/photo-1522383225653-ed111181a951','Hoa anh đào nở rộ Tokyo',0,TRUE),
(178,61,'image','https://innotour.vn/image/catalog/blog-du-lich/nhat-ban/lau-dai-osaka/lau-dai-osaka-3.jpg','Lâu đài Osaka mùa hoa',1,TRUE),
(179,61,'banner','https://tptravel.com.vn/data/media/1850/images/A%CC%89nh%20ma%CC%80n%20hi%CC%80nh%202025-02-04%20lu%CC%81c%2014_13_44.png','Công viên Ueno sắc hồng',2,TRUE),
(180,62,'cover','https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/depositphotos122946872xl-1715653542377.jpg','Rừng quốc gia Alishan',0,TRUE),
(181,62,'image','https://cdn3.ivivu.com/2024/10/tau-do-alishan-ivivu1.jpg','Tàu hỏa xuyên rừng Alishan',1,TRUE),
(182,62,'banner','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2d6hO08TjxkYrr9q7-debdd6_likJ8bMP-g&s','Biển mây tại Alishan',2,TRUE),
(183,63,'cover','https://phunuvietnam.mediacdn.vn/thumb_w/860/179072216278405120/2023/5/24/pri207080436-1684899629974478243058.jpg','Gấu trúc khổng lồ dễ thương',0,TRUE),
(184,63,'image','https://www.tour-trungquoc.com/wp-content/uploads/Bo-y-phuc-uy-nghi-cua-Lac-Son-Dai-Phat-1.jpg','Lạc Sơn Đại Phật uy nghi',1,TRUE),
(185,63,'banner','https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-6/547556312_803255765552028_7451569745970676091_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFjZQ8uNoHRU5HJtHpM1xoKe6oh5G5CkFt7qiHkbkKQW7_YkpUcEBRhUYgDVttEG24nVDN5pAGH3DkduDbCaHe9&_nc_ohc=NoFtAdI9r68Q7kNvwEa4tXB&_nc_oc=AdowSHF3fGj77QyewORjVTY0o5ingzF4PH9_KWPkpwUdXed5lRQW9SWB7_7oJLgCqZm4Hj_jKVtHy9741OLgWrsY&_nc_zt=23&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=_gca886ieGrZ61Z2d5Wgzw&_nc_ss=7b2a8&oh=00_Af7flZAybeLW-NaL9nQcYvu8NT8w1WuFuEUHMOtBgDWfGQ&oe=6A0906BF','Phố cổ Jinli nhộn nhịp',2,TRUE),
(186,64,'cover','https://bazantravel.com/cdn/medias/uploads/30/30152-ben-cang-victoria.jpg','Bến cảng Victoria Hong Kong',0,TRUE),
(187,64,'image','https://www.tour-trungquoc.com/wp-content/uploads/dai-dien-1-1-7.jpg','Đỉnh núi Thái Bình Peak',1,TRUE),
(188,64,'banner','https://booking.dulichthiennhien.vn/Data/image/TIN%20T%E1%BB%A8C%20DU%20L%E1%BB%8ACH/131/Disneyland-Hong-Kong.jpg','Hong Kong Disneyland sôi động',2,TRUE),
(189,65,'cover','https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB.jpg/500px-%E5%B8%83%E8%BE%BE%E6%8B%89%E5%AE%AB.jpg','Cung điện Potala Tây Tạng',0,TRUE),
(190,65,'image','https://cattour.vn/images/upload/images/Tay-Tang/ho-yam-drok-tay-tang/hoyamdroktaytang12.jpg','Hồ Yamdrok xanh huyền bí',1,TRUE),
(191,65,'banner','https://hires.vn/cdn-cgi/imagedelivery/1m1rJdJLBoJbXbtIvke6Fg/8b900922-29be-4c6c-990f-740a5be4d501/public','Cờ phướn cầu nguyện trên đỉnh núi',2,TRUE),
(192,66,'cover','https://www.womjapan.com/vn/wp-content/uploads/sites/2/2020/10/0.jpg','Bức tường tuyết Tateyama',0,TRUE),
(193,66,'image','https://media.vietravel.com/images/Content/nui-tuyet-o-Trung-Quoc--2-.png','Cảnh núi tuyết hùng vĩ',1,TRUE),
(194,66,'banner','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV62WpxcGQtUQ9nbvPDcTfr2L63Kmbl6bTyQ&s','Hồ Mikuriga-ike soi bóng',2,TRUE),
(195,67,'cover','https://sakos.vn/wp-content/uploads/2024/05/1-nalati-grassland-xinjiang-china-feng-wei-photography.jpg','Thảo nguyên xanh Tân Cương',0,TRUE),
(196,67,'image','https://cdn.saigontimestravel.com/storage/images/retail/ckeditor/2025/07/1752132317_ho-kanas_1.jpg','Hồ Kanas mộng mơ',1,TRUE),
(197,67,'banner','https://cdn.saigontimestravel.com/storage/images/retail/ckeditor/2025/07/1752113699_nui-thien-son-2_50.jpg','Núi tuyết Thiên Sơn',2,TRUE),
(198,68,'cover','https://eurotravel.com.vn/wp-content/uploads/2023/02/thap-eiffel-bieu-tuong-van-hoa-cua-nuoc-phap.jpg','Tháp Eiffel biểu tượng',0,TRUE),
(199,68,'image','hhttps://eutrip.vn/view/admin/Themes/kcfinder/upload/images/01-interlaken-3%20(1).jpeg','Làng cổ Thụy Sĩ bên hồ',1,TRUE),
(200,68,'banner','https://ik.imagekit.io/tvlk/blog/2021/07/kinh-nghiem-du-lich-venice-1.jpeg','Thành phố kênh đào Venice',2,TRUE),
(201,69,'cover','https://lh7-rt.googleusercontent.com/docsz/AD_4nXdov9XQUzq5HzzPxWPKpDAppSuXNTfn5f_2hzMftBQdppvNrRIGa1qNHltybYn35r46R0_xqW6JiCdXHX4EgQiZMxz3XAq5WpUTqfLDFkkKMwl56RqJ4ZuwqXm1AXOLz4qHG2hKYw?key=KuOi_BJ6vvXxOFip-xTatSsf','Vịnh Fjord Na Uy hùng vĩ',0,TRUE),
(202,69,'image','https://dulichviet.com.vn/images/bandidau/du-lich-thuy-dien-kham-pha-thu-do-stockholm-xinh-dep-me-hoac-long-du-khach.jpg','Thành phố Stockholm cổ kính',1,TRUE),
(203,69,'banner','https://www.dulichhoanmy.com/wp-content/uploads/2023/03/kenh-dao-nyhavn-ruc-ro.jpg','Phố cảng Nyhavn Đan Mạch',2,TRUE),
(204,70,'cover','https://www.trieuhaotravel.vn/Uploads/images/leech/gdocs_1_20251011_085259_47b95939.png_medium.webp','Lâu đài Praha lung linh',0,TRUE),
(205,70,'image','https://cdn.saigontimestravel.com/storage/images/retail/ckeditor/2025/07/1752721426_budapest-1_22.webp','Thủ đô Budapest bên sông Danube',1,TRUE),
(206,70,'banner','https://cdn.saigontimestravel.com/storage/images/retail/ckeditor/2025/09/1758164919_schonbrunn-1_47.webp','Cung điện Schonbrunn Áo',2,TRUE),
(207,71,'cover','https://cdn.saigontimestravel.com/storage/images/retail/wp-content/uploads/2024/11/Vuon-hoa-Keukenhof-Ha-Lan-4.jpg','Cánh đồng hoa Tulip Keukenhof',0,TRUE),
(208,71,'image','https://cdn.saigontimestravel.com/storage/images/retail/ckeditor/2025/04/1745827075_coi-xay-gio-ha-lan-5_6.jpg','Cối xay gió Hà Lan',1,TRUE),
(209,71,'banner','https://sacotravel.com/wp-content/uploads/2023/06/Lich-su-hinh-thanh-Quang-truong-Grand-Place.jpg','Quảng trường lớn Brussels',2,TRUE),
(210,72,'cover','https://ik.imagekit.io/tvlk/blog/2023/08/dong-ho-big-ben-1.webp?tr=q-70,c-at_max,w-1000,h-600','Tháp đồng hồ Big Ben London',0,TRUE),
(211,72,'image','https://cdn.saigontimestravel.com/storage/images/retail/ckeditor/2025/10/1759908774_inverness-2_15.webp','Cao nguyên Scotland hùng vĩ',1,TRUE),
(212,72,'banner','https://cafefcdn.com/203337114487263232/2026/3/18/image1773831146232kvdr-1773847316052-17738473167891506923554.jpg','Đại học Oxford cổ kính',2,TRUE),
(213,73,'cover','https://deviet.vn/wp-content/uploads/2017/11/Sagrada-Familia.png','Nhà thờ Sagrada Familia Barcelona',0,TRUE),
(214,73,'image','https://bizweb.dktcdn.net/100/514/927/files/du-lich-lisbon-bo-dao-nha-1.webp?v=1763975965137','Thành phố Lisbon rực rỡ',1,TRUE),
(215,73,'banner','https://blueskytravelblog.wordpress.com/wp-content/uploads/2016/06/71.png','Vũ điệu Flamenco nóng bỏng',2,TRUE),
(216,74,'cover','https://travelpx.net/wp-content/uploads/2021/09/Jungfrau-Travelpx-1.jpg','Đỉnh núi Jungfrau tuyết phủ',0,TRUE),
(217,74,'image','https://www.dulichhoanmy.com/wp-content/uploads/2023/10/lang-lauterbrunnen.jpg','Làng Lauterbrunnen tiên cảnh',1,TRUE),
(218,74,'banner','https://travelpx.net/wp-content/uploads/2022/07/Tau-ngam-canh-Thuy-Si-Travelpx-7.jpg','Tàu hỏa leo núi Thụy Sĩ',2,TRUE),
(219,75,'cover','https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b','Đấu trường La Mã Rome',0,TRUE),
(220,75,'image','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPVR8dI7OKUmMG-siFUmvPz9IR-oiZRZPcTg&s','Thành phố nghệ thuật Florence',1,TRUE),
(221,75,'banner','https://cdn3.ivivu.com/2023/08/thap-nghieng-pisa-ivivu-1.jpg','Tháp nghiêng Pisa',2,TRUE),
(222,76,'cover','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff','Đảo Santorini xanh trắng',0,TRUE),
(223,76,'image','https://datviettour.com.vn/uploads/images/tin-tuc-SEO-chau-au/tong-hop/hoang-hon-sieu-dep.jpg','Hoàng hôn tại Oia',1,TRUE),
(224,76,'banner','https://cdn.saigontimestravel.com/storage/images/retail/ckeditor/2025/04/1744614490_den-parthenon_8.jpg','Đền Parthenon Athens',2,TRUE),
(225,77,'cover','https://cdn.saigontimestravel.com/storage/images/retail/wp-content/uploads/2024/12/0-4.jpg','Cánh đồng Lavender Provence',0,TRUE),
(226,77,'image','https://e.khoahoc.tv/photos/image/2016/05/13/ngoi-lang-1.jpg','Ngôi làng cổ tại Provence',1,TRUE),
(227,77,'banner','https://media.baovanhoa.vn/zoom/800_600/Portals/0/EasyGalleryImages/1/42904/Hoa-o%E1%BA%A3i-h%C6%B0%C6%A1ng-3.jpg','Mùa hoa oải hương nước Pháp',2,TRUE),
(228,78,'cover','https://www.trieuhaotravel.vn/Uploads/images/leech/gdocs_1_20250922_103229_ddcceff2.png_medium.webp','Lễ hội bia Oktoberfest Munich',0,TRUE),
(229,78,'image','https://ik.imagekit.io/tvlk/blog/2023/09/lau-dai-neuschwanstein-15.webp','Lâu đài Neuschwanstein cổ tích',1,TRUE),
(230,78,'banner','https://cdn.hstatic.net/200000836389/file/munich-2_8fcb1475883e47fb85a5325dc9db4b06_1024x1024.png','Thành phố Munich nhộn nhịp',2,TRUE),
(231,79,'cover','https://cdn.saigontimestravel.com/storage/images/retail/ckeditor/2025/07/1753698823_warsaw-1_16.webp','Phố cổ Warsaw rực rỡ',0,TRUE),
(232,79,'image','https://upload.wikimedia.org/wikipedia/commons/7/70/Wieliczka_salt_mine.jpg','Mỏ muối Wieliczka kỳ vĩ',1,TRUE),
(233,79,'banner','https://t.ex-cdn.com/vntravellive.com/resize/900x312/files/content/2019/10/05/krakow-travel-luxury-krakow-poland-luxury-travel-water-130544.jpg','Lâu đài Wawel tại Krakow',2,TRUE),
(234,80,'cover','https://cdn.saigontimestravel.com/storage/images/retail/ckeditor/2025/07/1753959377_dubrovnik-14_50.webp','Thành phố Dubrovnik bên biển',0,TRUE),
(235,80,'image','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKVKDn82Cxn4fQY0ZJu7vaLjmxppxoH3zXnA&s','Vườn quốc gia Plitvice Lakes',1,TRUE),
(236,80,'banner','https://cdn.eva.vn/upload/2-2018/images/2018-06-15/nuoc-bien-adriatic-tinh-khiet-dem-lai-nhieu-loi-ich-cho-suc-khoe-con-nguoi-1-1529062697-156-width660height437.jpg','Biển Adriatic xanh trong',2,TRUE),
(237,81,'cover','https://trieuhaotravel.vn/Uploads/files/unnamed__2025_07_30T164942_561.png_large.webp','Làng Hallstatt tuyệt đẹp',0,TRUE),
(238,81,'image','https://eurotravel.com.vn/wp-content/uploads/2024/08/Alps-20.jpg','Dãy Alps hùng vĩ',1,TRUE),
(239,81,'banner','https://image.kkday.com/v2/image/get/s1.kkday.com/product_21011/20190104064723_fl5fa/jpg','Thành phố Salzburg quê hương Mozart',2,TRUE),
(240,82,'cover','https://images.unsplash.com/photo-1483347756197-71ef80e95f73','Ánh sáng cực quang Iceland',0,TRUE),
(241,82,'image','https://media.vietravel.com/images/Content/tam-suoi-khoang-xanh-blue-lagoon-2.png','Suối khoáng nóng Blue Lagoon',1,TRUE),
(242,82,'banner','https://dulichcoguu.com/wp-content/uploads/2024/04/thac-Skogafoss-iceland.jpg','Thác nước Skogafoss mạnh mẽ',2,TRUE),
(243,83,'cover','https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9','Nhà hát con sò Opera House',0,TRUE),
(244,83,'image','https://ik.imagekit.io/tvlk/blog/2023/11/cau-cang-sydney-2-1024x576.jpg?tr=q-70,c-at_max,w-1000,h-600','Cầu cảng Sydney Harbour',1,TRUE),
(245,83,'banner','https://res.klook.com/image/upload/u_activities:wlcxal6tzw64anpcwseb,h_1.0,ar_16:9,c_scale,e_blur:10000/w_1265,h_791,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/wlcxal6tzw64anpcwseb.webp','Hoàng hôn tại Melbourne',2,TRUE),
(246,84,'cover','https://pantravel.vn/wp-content/uploads/2024/08/bang-hieu-hollywood-ban-dau-duoc-dung-len-nham-muc-dich-ban-dat.jpg','Bảng hiệu Hollywood',0,TRUE),
(247,84,'image','https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-6/546000425_1185339553628249_2887840777846439531_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeGQt0mp8svSZ0YG9oMrPfa5Fg0J82NhyYgWDQnzY2HJiLgA58U1III2UnhACxmKSIM9M0FV5itPB_ITWKA3YlF_&_nc_ohc=Ccki1Muban4Q7kNvwEHBjIY&_nc_oc=Adr9x_4a1WFvv1RFJrpiceDZK9wPsMS22gchG53Mt7GxayacCDaFZkl2g2SHjhXHOSbDFef3Hy1Fkt6DqhmzQp5A&_nc_zt=23&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=nJZnCdAamxP8qriE8FHoRw&_nc_ss=7b2a8&oh=00_Af7LN4x17BRFYdAxq7w0pcUEU0hZKMGHHsu4vBDO2fhbSg&oe=6A0919EA','Las Vegas rực rỡ đèn màu',1,TRUE),
(248,84,'banner','https://www.trieuhaotravel.vn/Uploads/images/ncvy/1_1_.jpg_medium.webp','Đại vực Grand Canyon',2,TRUE),
(249,85,'cover','https://booking.dulichthiennhien.vn/Data/image/TIN%20T%E1%BB%A8C%20DU%20L%E1%BB%8ACH/233/T%C6%B0%E1%BB%A3ng%20N%E1%BB%AF%20th%E1%BA%A7n%20T%E1%BB%B1%20Do.jpg','Tượng Nữ Thần Tự Do',0,TRUE),
(250,85,'image','https://dulichminhanh.com.vn/wp-content/uploads/2024/12/quang-truong-thoi-dai-new-york-6.webp','Quảng trường Thời đại New York',1,TRUE),
(251,85,'banner','https://kimlientravel.com.vn/upload/image/image-20230905171812-1.jpeg','Nhà Trắng Washington D.C',2,TRUE),
(252,86,'cover','https://edulinks.vn/wp-content/uploads/2020/03/Ca1.jpg','Mùa thu lá phong Canada',0,TRUE),
(253,86,'image','https://trieuhaotravel.vn/Uploads/images/leech/gdocs_1_20250913_105458_b28ed3c2.png_medium.webp','Thác Niagara hùng vĩ',1,TRUE),
(254,86,'banner','https://www.thm.vn/media/k2/items/cache/82558bd755d4bf64f8b1324b360ed554_M.jpg','Hồ Louise xanh ngọc bích',2,TRUE),
(255,87,'cover','https://trieuhaotravel.vn/Uploads/images/leech/gdocs_1_20251119_135529_ccff824f.png_medium.webp','Làng Hobbiton như cổ tích',0,TRUE),
(256,87,'image','https://bestour.com.vn/uploads/vinh-milford-sound-new-zealand-bestour2.jpg','Vịnh Milford Sound',1,TRUE),
(257,87,'banner','https://bestour.com.vn/uploads/Queenstown-New-Zealand-BesTour1.jpg','Thành phố Queenstown thơ mộng',2,TRUE),
(258,88,'cover','https://file.hstatic.net/200000929393/article/tho-nhi-ky-ivivu-1_18eb0deb5e1b409f91f4d40581b4b5ca.jpg','Khinh khí cầu tại Cappadocia',0,TRUE),
(259,88,'image','https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b','Thánh đường Hagia Sophia',1,TRUE),
(260,88,'banner','https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/04_2023/1605366322.jpg','Bờ biển Antalya tuyệt đẹp',2,TRUE),
(261,89,'cover','https://images.unsplash.com/photo-1503177119275-0aa32b3a9368','Đại Kim Tự Tháp Giza',0,TRUE),
(262,89,'image','https://www.migolatravel.com/wp-content/uploads/2021/06/nile-river-1.jpg','Du thuyền trên sông Nile',1,TRUE),
(263,89,'banner','https://pantravel.vn/wp-content/uploads/2024/01/abu-simbel-kien-truc-nghe-thuat-dinh-cao.jpg','Đền thờ Abu Simbel',2,TRUE),
(264,90,'cover','https://saigonoffice.com.vn/contents_saigonoffice/uploads/images/su-dung-cac-cong-nghe-bao-ve-khoi-tac-dong-moi-truong-khac-nghiet.jpg','Tháp Burj Khalifa cao nhất thế giới',0,TRUE),
(265,90,'image','https://cdn3.ivivu.com/2022/06/sa-mac-safari-dubai-ivivu.jpg','Sa mạc Safari Dubai',1,TRUE),
(266,90,'banner','https://dulichdisanviet.vn/lib/ckeditor/images/khach-san-burj-al-arab-dubai.jpg','Khách sạn Burj Al Arab',2,TRUE),
(267,91,'cover','https://mia.vn/media/uploads/blog-du-lich/gioi-thieu-doi-net-1719300870.jpg','Núi Bàn Cape Town',0,TRUE),
(268,91,'image','https://anh.24h.com.vn/upload/2-2016/images/2016-04-05/1459828070-1459823586-1--copy-.jpg','Sư tử tại vườn Kruger',1,TRUE),
(269,91,'banner','https://nhabup.vn/uploads/news/2021_06/tranh-truyen.jpg','Bình minh trên thảo nguyên Phi Châu',2,TRUE),
(270,92,'cover','https://images.unsplash.com/photo-1514282401047-d79a71a590e8','Biệt thự trên mặt nước',0,TRUE),
(271,92,'image','https://bizweb.dktcdn.net/100/094/983/files/1-copy-8bd25bfd-122b-4624-8d14-293b85737f6c.jpg?v=1584819073695','Làn nước trong vắt Maldives',1,TRUE),
(272,92,'banner','https://danangfantasticity.com/wp-content/uploads/2025/03/bua-toi-lang-man-ben-bo-bien-trai-nghiem-nen-co-cua-cap-doi-01.jpg','Bữa tối lãng mạn bên bờ biển',2,TRUE),
(273,93,'cover','https://vcdn1-dulich.vnecdn.net/2020/11/20/niagara1-1605810326-1605810338-6665-1605858966.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=I-10sOKq3UTSrk_bCkHSIQ','Thác Niagara giữa hai nước',0,TRUE),
(274,93,'image','https://pantravel.vn/wp-content/uploads/2024/09/con-pho-sam-uat-nhat-new-york.jpg','Thành phố New York sầm uất',1,TRUE),
(275,93,'banner','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Ringrose.jpg/500px-Ringrose.jpg','Dãy núi Rocky Canada',2,TRUE),
(276,94,'cover','https://sakos.vn/wp-content/uploads/2023/08/greens-pool-william-bay-national-park-tourism-wa-4.jpg','Bãi biển Tây Úc hoang sơ',0,TRUE),
(277,94,'image','https://i1-dulich.vnecdn.net/2013/10/10/1-pinnacles-desert-8-7-2930-1381401041.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=NjQAJFPyyjHWyPUB1_WaoA','Sa mạc Pinnacles',1,TRUE),
(278,94,'banner','https://preview.redd.it/rottnest-island-quokkas-land-in-west-australia-v0-bb1eby554ehe1.jpg?width=1080&crop=smart&auto=webp&s=ccfb79e5befc379b319d0df21592a864bee69a20','Quokka tại đảo Rottnest',2,TRUE),
(279,95,'cover','https://giaoxuchauson.com/uploads/news/2019/a.0_44.jpg','Tượng Chúa Cứu Thế Brazil',0,TRUE),
(280,95,'image','https://pantravel.vn/wp-content/uploads/2023/11/cung-chinh-phuc-thac-iguazu-thac-nuoc-hung-vi-nhat-the-gioi.jpg','Thác Iguazu hùng vĩ',1,TRUE),
(281,95,'banner','https://upload.wikimedia.org/wikipedia/commons/8/81/Miguel_Angel_Zotto_and_partner_dance_tango.jpg','Vũ điệu Tango Argentina',2,TRUE),
(282,96,'cover','https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/depositphotos9177235xl-1715910488706.jpg','Lăng mộ Taj Mahal',0,TRUE),
(283,96,'image','https://www.migolatravel.com/wp-content/uploads/2020/06/hawa-mahal.png','Thành phố hồng Jaipur',1,TRUE),
(284,96,'banner','https://admin.goldensmiletravel.com/upload/old/images/2023/09/09/e68947670145b9ac7fdaab034954904c-1694240751.jpg','Văn hóa Ấn Độ rực rỡ',2,TRUE),
(285,97,'cover','https://bizweb.dktcdn.net/100/456/675/files/318021066-832213584730171-3836376020985226635-n.jpg?v=1670465430004','Thành phố xanh Chefchaouen',0,TRUE),
(286,97,'image','https://dulichmaroc.vn/UploadFile/Article/Merzouga/Merzouga%202.jpg','Sa mạc Sahara Morocco',1,TRUE),
(287,97,'banner','https://cdn3.ivivu.com/2019/07/rod-fai-va-nhung-cho-dem-noi-tieng-the-gioi-ivivu-1.jpg','Chợ đêm Marrakech náo nhiệt',2,TRUE),
(288,98,'cover','https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/500px-Chichen_Itza_3.jpg','Kim tự tháp Chichen Itza',0,TRUE),
(289,98,'image','https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/05_2020/thien-duong-du-lich-cancun-mexico.jpg','Bãi biển Cancun xanh ngọc',1,TRUE),
(290,98,'banner','https://genk.mediacdn.vn/139269124445442048/2024/7/9/46b35b52c25a49cf9e5ec14a1560ef47-17204988503091455896710.jpeg','Văn hóa Maya huyền bí',2,TRUE),
(291,99,'cover','https://dulichviet.com.vn/images/bandidau/vi-tri-quang-tr%C6%B0%C6%A1ng-do.jpg','Quảng trường Đỏ Moscow',0,TRUE),
(292,99,'image','https://lh7-rt.googleusercontent.com/docsz/AD_4nXeKRHPOFF2OODSGkS4XqJ45y5lHGdKxrFuPYnaRXIYTQZJRFSqKHuyYmPV5aN0d6FG8G_s7i3nWQMr0HR8sV8C9K4PoDV-K8nILBDz3auYgfUlCjGN18tw0oIvJB0EShUjxlRvtShUcR-C17juyoW9f?key=IKZfCKZ6MFvyajLq9pESbA','Cung điện Mùa Thu Saint Petersburg',1,TRUE),
(293,99,'banner','https://lh7-rt.googleusercontent.com/docsz/AD_4nXfqppn_4WbMgfHlmFzodIEQgWZ34EoFpGVIPS7WClA71nUHTCTvM6V6lwP4TQlV-mxT42bbV1cMdAg_kwzoQEzb0SyBipx1Igi92-3CLKcLeKg4KLz36HezBhOeDN9SxlnN8UgS?key=lkydNTJrx5IGnwl1qJvgan33','Mùa thu vàng nước Nga',2,TRUE),
(294,100,'cover','https://images.unsplash.com/photo-1516426122078-c23e76319801','Động vật hoang dã Maasai Mara',0,TRUE),
(295,100,'image','https://png.pngtree.com/thumb_back/fh260/background/20250329/pngtree-silhouetted-giraffes-walk-against-a-vibrant-sunset-framed-by-acacia-trees-image_17153246.jpg','Hươu cao cổ dưới hoàng hôn',1,TRUE),
(296,100,'banner','https://images.unsplash.com/photo-1454496522488-7a8e488e8606','Cảnh quan hùng vĩ Kenya',2,TRUE);

-- ============================================================
-- tour_tags: ví dụ nội dung + kệ trang chủ HOME_* (chọn tour cụ thể)
-- ============================================================

INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 4 AS tid UNION ALL SELECT 6 UNION ALL SELECT 8 UNION ALL SELECT 22 UNION ALL SELECT 29 UNION ALL SELECT 32
) AS n(tid) JOIN tags tg ON tg.code IN ('NUI', 'TREKKING', 'VAN_HOA', 'MAO_HIEM', 'MUA_DONG', 'BUDGET_RE');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 3 AS tid UNION ALL SELECT 23
) AS n(tid) JOIN tags tg ON tg.code IN ('DAO', 'SONG_HO', 'SANG_TRONG', 'NGHI_DUONG', 'THE_THAO_NUOC', 'HOME_BEACH_VN');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 5 AS tid UNION ALL SELECT 27 UNION ALL SELECT 39
) AS n(tid) JOIN tags tg ON tg.code IN ('SONG_HO', 'TAM_LINH', 'VAN_HOA', 'LICH_SU', 'CHECKIN', 'GIA_DINH');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 7 AS tid
) AS n(tid) JOIN tags tg ON tg.code IN ('THANH_PHO', 'VAN_HOA', 'LICH_SU', 'AM_THUC', 'NGUOI_LON_TUOI', 'THOI_GIAN_NGAY');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 1 AS tid UNION ALL SELECT 11 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 21 UNION ALL SELECT 24 UNION ALL SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 35
) AS n(tid) JOIN tags tg ON tg.code IN ('BIEN', 'DAO', 'CHECKIN', 'GIA_DINH', 'MUA_HE', 'BUDGET_TB', 'HOME_BEACH_VN');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 9 AS tid UNION ALL SELECT 10 UNION ALL SELECT 30
) AS n(tid) JOIN tags tg ON tg.code IN ('VAN_HOA', 'LICH_SU', 'AM_THUC', 'LANG_MAN', 'CAP_DOI', 'NIGHTLIFE');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 12 AS tid UNION ALL SELECT 25
) AS n(tid) JOIN tags tg ON tg.code IN ('NUI', 'CHECKIN', 'LANG_MAN', 'CAP_DOI', 'MUA_XUAN', 'THOI_GIAN_NGAN');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 15 AS tid UNION ALL SELECT 40
) AS n(tid) JOIN tags tg ON tg.code IN ('NUI', 'VAN_HOA', 'WILDLIFE', 'SINH_THAI', 'BUDGET_RE');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 2 AS tid UNION ALL SELECT 28
) AS n(tid) JOIN tags tg ON tg.code IN ('THANH_PHO', 'LICH_SU', 'AM_THUC', 'THOI_GIAN_NGAY', 'SINH_VIEN');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 18 AS tid UNION ALL SELECT 31
) AS n(tid) JOIN tags tg ON tg.code IN ('SONG_HO', 'AM_THUC', 'VAN_HOA', 'BUDGET_RE', 'GIA_DINH');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 19 AS tid UNION ALL SELECT 38
) AS n(tid) JOIN tags tg ON tg.code IN ('BIEN', 'MAO_HIEM', 'CHECKIN', 'THOI_GIAN_NGAN', 'CAP_DOI');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 16 AS tid UNION ALL SELECT 20 UNION ALL SELECT 36 UNION ALL SELECT 37
) AS n(tid) JOIN tags tg ON tg.code IN ('GIAI_TRI', 'GIA_DINH', 'BUDGET_RE', 'THOI_GIAN_NGAY', 'CAMPING');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 17 AS tid UNION ALL SELECT 26
) AS n(tid) JOIN tags tg ON tg.code IN ('BIEN', 'DAO', 'SANG_TRONG', 'GIAI_TRI', 'WILDLIFE', 'HOME_BEACH_VN', 'THOI_GIAN_DAI');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 41 AS tid UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 45 UNION ALL SELECT 46 UNION ALL SELECT 47 UNION ALL SELECT 48 UNION ALL SELECT 49 UNION ALL SELECT 50 UNION ALL SELECT 51 UNION ALL SELECT 52
) AS n(tid) JOIN tags tg ON tg.code IN ('VAN_HOA', 'MUA_SAM', 'GIAI_TRI', 'BUDGET_TB', 'THOI_GIAN_DAI', 'HOME_HOT_INTL');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 44 AS tid -- Bali
) AS n(tid) JOIN tags tg ON tg.code IN ('BIEN', 'LANG_MAN', 'CHECKIN', 'CAP_DOI', 'BUDGET_TB', 'HOME_HOT_INTL');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 53 AS tid UNION ALL SELECT 54 UNION ALL SELECT 56 UNION ALL SELECT 59 UNION ALL SELECT 61 UNION ALL SELECT 62
) AS n(tid) JOIN tags tg ON tg.code IN ('VAN_HOA', 'MUA_XUAN', 'MUA_THU', 'CHECKIN', 'MUA_SAM', 'BUDGET_VIP', 'HOME_HOT_INTL');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 55 AS tid UNION ALL SELECT 58 UNION ALL SELECT 60 UNION ALL SELECT 63 UNION ALL SELECT 64 UNION ALL SELECT 65 UNION ALL SELECT 67
) AS n(tid) JOIN tags tg ON tg.code IN ('LICH_SU', 'VAN_HOA', 'NUI', 'SINH_THAI', 'CHECKIN', 'HOME_HOT_INTL');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 57 AS tid UNION ALL SELECT 66
) AS n(tid) JOIN tags tg ON tg.code IN ('MUA_DONG', 'MAO_HIEM', 'SANG_TRONG', 'CHECKIN', 'BUDGET_VIP');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 68 AS tid UNION ALL SELECT 70 UNION ALL SELECT 71 UNION ALL SELECT 72 UNION ALL SELECT 73 UNION ALL SELECT 74 UNION ALL SELECT 75 UNION ALL SELECT 76 UNION ALL SELECT 77 UNION ALL SELECT 78 UNION ALL SELECT 79 UNION ALL SELECT 80 UNION ALL SELECT 81
) AS n(tid) JOIN tags tg ON tg.code IN ('LICH_SU', 'VAN_HOA', 'SANG_TRONG', 'BUDGET_VIP', 'THOI_GIAN_DAI', 'HOME_HOT_INTL');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 69 AS tid UNION ALL SELECT 82
) AS n(tid) JOIN tags tg ON tg.code IN ('MAO_HIEM', 'SINH_THAI', 'SANG_TRONG', 'MUA_HE', 'MUA_DONG', 'BUDGET_VIP');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 83 AS tid UNION ALL SELECT 84 UNION ALL SELECT 85 UNION ALL SELECT 86 UNION ALL SELECT 87 UNION ALL SELECT 93 UNION ALL SELECT 94
) AS n(tid) JOIN tags tg ON tg.code IN ('THANH_PHO', 'SINH_THAI', 'SANG_TRONG', 'BUDGET_VIP', 'THOI_GIAN_DAI', 'HOME_HOT_INTL');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 88 AS tid UNION ALL SELECT 89 UNION ALL SELECT 90 UNION ALL SELECT 96 UNION ALL SELECT 97 UNION ALL SELECT 98 UNION ALL SELECT 99
) AS n(tid) JOIN tags tg ON tg.code IN ('VAN_HOA', 'LICH_SU', 'TAM_LINH', 'CHECKIN', 'BUDGET_VIP', 'HOME_HOT_INTL');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 91 AS tid UNION ALL SELECT 92 UNION ALL SELECT 95 UNION ALL SELECT 100
) AS n(tid) JOIN tags tg ON tg.code IN ('WILDLIFE', 'SINH_THAI', 'MAO_HIEM', 'BIEN', 'BUDGET_VIP', 'THOI_GIAN_DAI');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 1 AS tid UNION ALL SELECT 21) AS n
JOIN tags tg ON tg.code IN ('BIEN', 'GIA_DINH', 'CHECKIN', 'BUDGET_TB', 'MUA_HE', 'HOME_BEACH_VN', 'THOI_GIAN_NGAN');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 2 AS tid UNION ALL SELECT 7 UNION ALL SELECT 28) AS n
JOIN tags tg ON tg.code IN ('THANH_PHO', 'LICH_SU', 'AM_THUC', 'THOI_GIAN_NGAY', 'BUDGET_RE', 'GIA_DINH', 'NGUOI_LON_TUOI');
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 3 AS tid UNION ALL SELECT 23) AS n
JOIN tags tg ON tg.code IN ('DAO', 'SONG_HO', 'SANG_TRONG', 'NGHI_DUONG', 'CAP_DOI', 'THOI_GIAN_NGAN', 'HOME_BEACH_VN');

-- Nhóm 4: Sapa Trekking (Núi, Mùa đông, Sinh viên mạo hiểm)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 4 AS tid UNION ALL SELECT 22) AS n
JOIN tags tg ON tg.code IN ('NUI', 'TREKKING', 'VAN_HOA', 'MUA_DONG', 'BUDGET_RE', 'THOI_GIAN_NGAN', 'SINH_VIEN', 'MAO_HIEM');

-- Nhóm 5: Ninh Bình (Sông hồ, Tâm linh, Gia đình)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 5 AS tid UNION ALL SELECT 27) AS n
JOIN tags tg ON tg.code IN ('SONG_HO', 'TAM_LINH', 'VAN_HOA', 'LICH_SU', 'GIA_DINH', 'THOI_GIAN_NGAY', 'BUDGET_TB');

-- Nhóm 6: Đông - Tây Bắc Cảnh quan (Hà Giang, Cao Bằng - Vĩ đại, Check-in)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 6 AS tid UNION ALL SELECT 8 UNION ALL SELECT 29 UNION ALL SELECT 32) AS n
JOIN tags tg ON tg.code IN ('NUI', 'MAO_HIEM', 'VAN_HOA', 'CHECKIN', 'MUA_DONG', 'BUDGET_RE', 'THOI_GIAN_NGAN');

-- Nhóm 7: Huế, Quy Nhơn tháp cổ, Đường Lâm (Văn hóa, Lịch sử, Người lớn tuổi)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 9 AS tid UNION ALL SELECT 10 UNION ALL SELECT 30 UNION ALL SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 39) AS n
JOIN tags tg ON tg.code IN ('VAN_HOA', 'LICH_SU', 'AM_THUC', 'NGUOI_LON_TUOI', 'BUDGET_TB', 'THOI_GIAN_NGAN', 'CHECKIN');

-- Nhóm 8: Biển Nam Trung Bộ (Nha Trang, Phú Yên, Quy Nhơn đảo hoang)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 11 AS tid UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 24 UNION ALL SELECT 35) AS n
JOIN tags tg ON tg.code IN ('BIEN', 'DAO', 'THE_THAO_NUOC', 'CHECKIN', 'MUA_HE', 'BUDGET_TB', 'HOME_BEACH_VN');

-- Nhóm 9: Đà Lạt & Hồ Lắk (Núi, Lãng mạn, Mùa xuân, Chụp ảnh)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 12 AS tid UNION ALL SELECT 25 UNION ALL SELECT 40) AS n
JOIN tags tg ON tg.code IN ('NUI', 'LANG_MAN', 'CAP_DOI', 'MUA_XUAN', 'CHECKIN', 'THOI_GIAN_NGAN', 'BUDGET_TB');

-- Nhóm 10: Buôn Ma Thuột (Cà phê, Sinh thái Tây Nguyên)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 15 AS tid) AS n
JOIN tags tg ON tg.code IN ('NUI', 'VAN_HOA', 'AM_THUC', 'SINH_THAI', 'BUDGET_TB', 'THOI_GIAN_NGAN');

-- Nhóm 11: Đi về trong ngày phía Nam (Vũng Tàu, Tây Ninh, Mũi Né lâu đài)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 16 AS tid UNION ALL SELECT 20 UNION ALL SELECT 36 UNION ALL SELECT 38) AS n
JOIN tags tg ON tg.code IN ('GIA_DINH', 'GIAI_TRI', 'THOI_GIAN_NGAY', 'BUDGET_RE', 'SINH_VIEN', 'CHECKIN');

-- Nhóm 12: Phú Quốc (Cao cấp, Giải trí, Biển đảo)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 17 AS tid UNION ALL SELECT 26) AS n
JOIN tags tg ON tg.code IN ('BIEN', 'DAO', 'SANG_TRONG', 'GIAI_TRI', 'GIA_DINH', 'THOI_GIAN_NGAN', 'HOME_BEACH_VN');

-- Nhóm 13: Miền Tây Sông Nước (Cần Thơ, Chợ nổi)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 18 AS tid UNION ALL SELECT 31) AS n
JOIN tags tg ON tg.code IN ('SONG_HO', 'AM_THUC', 'VAN_HOA', 'NGUOI_LON_TUOI', 'GIA_DINH', 'BUDGET_RE', 'THOI_GIAN_NGAY');

-- Nhóm 14: Cắm trại (Đồi cát, Hồ Dầu Tiếng)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 19 AS tid UNION ALL SELECT 37) AS n
JOIN tags tg ON tg.code IN ('CAMPING', 'MAO_HIEM', 'SINH_VIEN', 'CHECKIN', 'BUDGET_RE', 'THOI_GIAN_NGAY', 'SINH_THAI');


-- =====================================================================
-- KHỐI 2: DU LỊCH QUỐC TẾ (CHÂU Á & ĐÔNG NAM Á)
-- =====================================================================

-- Nhóm 15: Thái Lan, Sing, Malay, Hong Kong (Shopping, Giải trí, Gia đình)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 41 AS tid UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 49 UNION ALL SELECT 51 UNION ALL SELECT 64) AS n
JOIN tags tg ON tg.code IN ('THANH_PHO', 'MUA_SAM', 'GIAI_TRI', 'GIA_DINH', 'BUDGET_TB', 'THOI_GIAN_NGAN', 'HOME_HOT_INTL');

-- Nhóm 16: Thiên đường đảo Quốc tế (Bali, Phuket, Boracay, Maldives)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 44 AS tid UNION ALL SELECT 45 UNION ALL SELECT 47 UNION ALL SELECT 92) AS n
JOIN tags tg ON tg.code IN ('BIEN', 'DAO', 'LANG_MAN', 'CAP_DOI', 'NGHI_DUONG', 'SANG_TRONG', 'THOI_GIAN_NGAN', 'HOME_HOT_INTL');

-- Nhóm 17: Campuchia, Lào, Myanmar (Văn hóa, Tâm linh, Nhẹ nhàng)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 46 AS tid UNION ALL SELECT 48 UNION ALL SELECT 50) AS n
JOIN tags tg ON tg.code IN ('VAN_HOA', 'LICH_SU', 'TAM_LINH', 'NGUOI_LON_TUOI', 'BUDGET_TB', 'THOI_GIAN_NGAN', 'HOME_HOT_INTL');

-- Nhóm 18: Vương quốc Xa hoa (Brunei, Dubai)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 52 AS tid UNION ALL SELECT 90) AS n
JOIN tags tg ON tg.code IN ('THANH_PHO', 'SANG_TRONG', 'MUA_SAM', 'GIAI_TRI', 'BUDGET_VIP', 'THOI_GIAN_NGAN', 'HOME_HOT_INTL');

-- Nhóm 19: Đông Á Mùa Đẹp (Nhật, Hàn, Đài Loan - Ngắm hoa, Mùa thu)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 53 AS tid UNION ALL SELECT 54 UNION ALL SELECT 56 UNION ALL SELECT 59 UNION ALL SELECT 61 UNION ALL SELECT 62 UNION ALL SELECT 99) AS n
JOIN tags tg ON tg.code IN ('VAN_HOA', 'MUA_XUAN', 'MUA_THU', 'CHECKIN', 'GIA_DINH', 'BUDGET_VIP', 'HOME_HOT_INTL', 'THOI_GIAN_DAI');

-- Nhóm 20: Trung Quốc Cảnh Quan Thần Tiên (Trương Gia Giới, Tây Tạng, Cửu Trại Câu)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 55 AS tid UNION ALL SELECT 58 UNION ALL SELECT 60 UNION ALL SELECT 63 UNION ALL SELECT 65 UNION ALL SELECT 67) AS n
JOIN tags tg ON tg.code IN ('LICH_SU', 'NUI', 'SINH_THAI', 'CHECKIN', 'NGUOI_LON_TUOI', 'BUDGET_VIP', 'THOI_GIAN_DAI', 'HOME_HOT_INTL');

-- Nhóm 21: Hokkaido & Tateyama (Mùa đông tuyết rơi Nhật Bản)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 57 AS tid UNION ALL SELECT 66) AS n
JOIN tags tg ON tg.code IN ('MUA_DONG', 'NUI', 'MAO_HIEM', 'SANG_TRONG', 'CHECKIN', 'BUDGET_VIP', 'THOI_GIAN_DAI', 'HOME_HOT_INTL');


-- =====================================================================
-- KHỐI 3: DU LỊCH QUỐC TẾ (CHÂU ÂU, MỸ, ÚC, PHI)
-- =====================================================================

-- Nhóm 22: Châu Âu Cổ Kính (Pháp, Ý, Đức, Anh, Ba Lan...)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 68 AS tid UNION ALL SELECT 70 UNION ALL SELECT 71 UNION ALL SELECT 72 UNION ALL SELECT 73 UNION ALL SELECT 74 UNION ALL SELECT 75 UNION ALL SELECT 78 UNION ALL SELECT 79 UNION ALL SELECT 81) AS n
JOIN tags tg ON tg.code IN ('LICH_SU', 'VAN_HOA', 'SANG_TRONG', 'NGUOI_LON_TUOI', 'BUDGET_VIP', 'THOI_GIAN_DAI', 'HOME_HOT_INTL');

-- Nhóm 23: Bắc Âu, Iceland (Cực quang, Băng giá, Sinh thái cao cấp)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 69 AS tid UNION ALL SELECT 80 UNION ALL SELECT 82) AS n
JOIN tags tg ON tg.code IN ('MAO_HIEM', 'SINH_THAI', 'MUA_DONG', 'SANG_TRONG', 'BUDGET_VIP', 'THOI_GIAN_DAI', 'HOME_HOT_INTL');

-- Nhóm 24: Châu Âu Lãng Mạn (Santorini, Hoa Oải Hương Provence)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 76 AS tid UNION ALL SELECT 77) AS n
JOIN tags tg ON tg.code IN ('LANG_MAN', 'CAP_DOI', 'CHECKIN', 'SANG_TRONG', 'BUDGET_VIP', 'MUA_HE', 'HOME_HOT_INTL');

-- Nhóm 25: Mỹ, Canada, Úc, New Zealand (Hiện đại, Siêu xe, Thiên nhiên lớn)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 83 AS tid UNION ALL SELECT 84 UNION ALL SELECT 85 UNION ALL SELECT 86 UNION ALL SELECT 87 UNION ALL SELECT 93 UNION ALL SELECT 94) AS n
JOIN tags tg ON tg.code IN ('THANH_PHO', 'SINH_THAI', 'SANG_TRONG', 'GIA_DINH', 'BUDGET_VIP', 'THOI_GIAN_DAI', 'HOME_HOT_INTL');

-- Nhóm 26: Trung Đông & Di Sản Thế Giới (Thổ Nhĩ Kỳ, Ai Cập, Morocco, Mexico, Ấn Độ)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 88 AS tid UNION ALL SELECT 89 UNION ALL SELECT 96 UNION ALL SELECT 97 UNION ALL SELECT 98) AS n
JOIN tags tg ON tg.code IN ('VAN_HOA', 'LICH_SU', 'TAM_LINH', 'CHECKIN', 'BUDGET_VIP', 'THOI_GIAN_DAI', 'HOME_HOT_INTL');

-- Nhóm 27: Thám hiểm hoang dã (Châu Phi, Brazil Nam Mỹ)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (SELECT 91 AS tid UNION ALL SELECT 95 UNION ALL SELECT 100) AS n
JOIN tags tg ON tg.code IN ('WILDLIFE', 'SINH_THAI', 'MAO_HIEM', 'SANG_TRONG', 'BUDGET_VIP', 'THOI_GIAN_DAI', 'HOME_HOT_INTL');

-- 1. Nhóm DOAN_THE (Phù hợp đi Công ty, Teambuilding, sức chứa lớn, có bãi biển/sân chơi rộng)
-- Gồm: Đà Nẵng, Hạ Long, Vũng Tàu, Mũi Né, Phú Quốc, Thái Lan
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 1 AS tid UNION ALL SELECT 3 UNION ALL SELECT 11 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 19 UNION ALL SELECT 23 UNION ALL SELECT 36 UNION ALL SELECT 41
) AS n JOIN tags tg ON tg.code IN ('DOAN_THE', 'GIAI_TRI');

-- 2. Nhóm TRE_NHO (Kids friendly - Có công viên giải trí, sở thú, không gian an toàn cho bé)
-- Gồm: Phú Quốc (Safari/Vin), Vũng Tàu (Hồ Mây), Sing (Sentosa), Hàn (Everland), HK (Disneyland), Mỹ (Hollywood)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 17 AS tid UNION ALL SELECT 36 UNION ALL SELECT 42 UNION ALL SELECT 54 UNION ALL SELECT 64 UNION ALL SELECT 84
) AS n JOIN tags tg ON tg.code IN ('TRE_NHO', 'GIAI_TRI');

-- 3. Nhóm DOC_HANH (An toàn cho khách đi Solo, dễ ghép đoàn, văn hóa mở)
-- Gồm: Sapa, Hội An, Đà Lạt, Chiang Mai, Bali, Nhật Bản, Châu Âu cơ bản
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 4 AS tid UNION ALL SELECT 10 UNION ALL SELECT 12 UNION ALL SELECT 22 UNION ALL SELECT 51 UNION ALL SELECT 44 UNION ALL SELECT 53 UNION ALL SELECT 68
) AS n JOIN tags tg ON tg.code IN ('DOC_HANH', 'FREE_EASY');

-- 4. Nhóm NIGHTLIFE (Trải nghiệm sống về đêm, Bar/Pub, Chợ đêm, Show diễn)
-- Gồm: Sài Gòn, Hội An, Bangkok/Pattaya, Phuket, Đài Loan (chợ đêm), HongKong, Las Vegas
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 2 AS tid UNION ALL SELECT 10 UNION ALL SELECT 41 UNION ALL SELECT 45 UNION ALL SELECT 56 UNION ALL SELECT 64 UNION ALL SELECT 84
) AS n JOIN tags tg ON tg.code IN ('NIGHTLIFE');

-- 5. Nhóm MUA_SAM (Thiên đường Shopping, Trung tâm thương mại sầm uất, săn sale)
-- Gồm: Sài Gòn, Thái Lan, Singapore, Nhật, Hàn, Paris(Châu Âu), New York(Mỹ Đông), Dubai
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 2 AS tid UNION ALL SELECT 41 UNION ALL SELECT 42 UNION ALL SELECT 53 UNION ALL SELECT 54 UNION ALL SELECT 68 UNION ALL SELECT 85 UNION ALL SELECT 90
) AS n JOIN tags tg ON tg.code IN ('MUA_SAM', 'THANH_PHO');

-- 6. Nhóm HANG_DONG (Khám phá hang động, thạch nhũ - Phục vụ khách thích địa chất)
-- Gồm: Hạ Long (Sửng Sốt, Hang Luồn), Ninh Bình (Tràng An, Hang Múa), Cao Bằng (Ngườm Ngao)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 3 AS tid UNION ALL SELECT 5 UNION ALL SELECT 8 UNION ALL SELECT 23 UNION ALL SELECT 27
) AS n JOIN tags tg ON tg.code IN ('HANG_DONG', 'SINH_THAI');

-- 7. Nhóm UI - TRENDING (Các tour đang HOT, xu hướng đặt nhiều nhất hiện nay)
-- Áp dụng để show lên kệ "Đang thịnh hành" ở Trang chủ
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 1 AS tid UNION ALL SELECT 4 UNION ALL SELECT 12 UNION ALL SELECT 17 UNION ALL SELECT 41 UNION ALL SELECT 44 UNION ALL SELECT 54 UNION ALL SELECT 68
) AS n JOIN tags tg ON tg.code IN ('HOME_TRENDING');

-- 8. Nhóm UI - LUXURY (Kệ trang chủ: Trải nghiệm đẳng cấp nhất)
-- Dành cho phân khúc siêu giàu: Maldives, Dubai, Thụy Sĩ, Bắc Âu, Khinh khí cầu Thổ Nhĩ Kỳ
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 69 AS tid UNION ALL SELECT 74 UNION ALL SELECT 88 UNION ALL SELECT 90 UNION ALL SELECT 92
) AS n JOIN tags tg ON tg.code IN ('HOME_LUXURY', 'SANG_TRONG');

-- 9. Nhóm LỄ HỘI (Tour có kết hợp tham gia các sự kiện văn hóa lớn của địa phương)
-- Gồm: Oktoberfest (Đức), Lễ hội hoa anh đào (Nhật), Lễ hội băng tuyết (Hokkaido)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 57 AS tid UNION ALL SELECT 61 UNION ALL SELECT 78
) AS n JOIN tags tg ON tg.code IN ('LE_HOI', 'VAN_HOA');

-- 10. Nhóm LE_TET (Tour phù hợp kích cầu dịp Tết Nguyên Đán / Lễ lớn, đi ngắn ngày hoặc visa dễ)
-- Gồm: Thái Lan, Đài Loan, Hàn Quốc, Phú Quốc, Miền Tây
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 17 AS tid UNION ALL SELECT 18 UNION ALL SELECT 41 UNION ALL SELECT 54 UNION ALL SELECT 56
) AS n JOIN tags tg ON tg.code IN ('LE_TET');


-- 1. Nhóm PHƯƠNG TIỆN ĐẶC BIỆT (Trải nghiệm đi Tàu hỏa, Du thuyền, Trực thăng/Khinh khí cầu)
-- Gồm: Hạ Long (Du thuyền), Alishan (Tàu hỏa), Jungfrau (Tàu hỏa leo núi), Thổ Nhĩ Kỳ (Khinh khí cầu), Sông Nile (Du thuyền), Bắc Âu (Du thuyền Fjord)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 3 AS tid UNION ALL SELECT 62 UNION ALL SELECT 69 UNION ALL SELECT 74 UNION ALL SELECT 80 UNION ALL SELECT 88 UNION ALL SELECT 89
) AS n JOIN tags tg ON tg.code IN ('TRAI_NGHIEM_DOC_LA'); 

-- 2. Nhóm KIẾN TRÚC & MỸ THUẬT (Art & Architecture - Dành cho người yêu cái đẹp)
-- Gồm: Châu Âu (Ý Phục Hưng, Tây Ban Nha Gaudi, Pháp Eiffel), Nga (Cung điện), Ấn Độ (Taj Mahal), Ai Cập (Kim tự tháp)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 68 AS tid UNION ALL SELECT 73 UNION ALL SELECT 75 UNION ALL SELECT 89 UNION ALL SELECT 96 UNION ALL SELECT 99
) AS n JOIN tags tg ON tg.code IN ('KIEN_TRUC', 'LICH_SU', 'VAN_HOA');

-- 3. Nhóm TÔN GIÁO & HÀNH HƯƠNG TÂM LINH SÂU TẦNG
-- Gồm: Myanmar (Bagan), Tây Tạng (Lhasa), Tây Ninh (Tòa Thánh), Ấn Độ
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 20 AS tid UNION ALL SELECT 50 UNION ALL SELECT 65 UNION ALL SELECT 96
) AS n JOIN tags tg ON tg.code IN ('TAM_LINH', 'VAN_HOA');

-- 4. Nhóm THỂ THAO DƯỚI NƯỚC CHI TIẾT (Lặn biển, San hô, Mũi Né lướt ván)
-- Gồm: Nha Trang (VIP lặn), Phú Yên (Hòn Nưa), Phú Quốc, Maldives
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 11 AS tid UNION ALL SELECT 24 UNION ALL SELECT 26 UNION ALL SELECT 35 UNION ALL SELECT 92
) AS n JOIN tags tg ON tg.code IN ('THE_THAO_NUOC', 'GIAI_TRI');

-- 5. Nhóm THÚ CƯNG & ĐỘNG VẬT HOANG DÃ (Tương tác động vật)
-- Gồm: Nam Phi (Safari), Kenya (Đại di cư), Úc (Quokka, Kangaroo), Buôn Đôn (Cưỡi voi - văn hóa cũ), Phú Quốc (Safari)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 15 AS tid UNION ALL SELECT 17 UNION ALL SELECT 83 UNION ALL SELECT 91 UNION ALL SELECT 94 UNION ALL SELECT 100
) AS n JOIN tags tg ON tg.code IN ('WILDLIFE', 'SINH_THAI');

-- 6. Nhóm KHÔNG GIAN YÊN TĨNH / CHỮA LÀNH (Healing & Quiet - Né đám đông)
-- Gồm: Lào (Luang Prabang), Cao Bằng (Hồ Thang Hen), Đà Lạt (Săn mây), Phú Yên (Hoa vàng cỏ xanh)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 13 AS tid UNION ALL SELECT 25 UNION ALL SELECT 32 UNION ALL SELECT 48 UNION ALL SELECT 60
) AS n JOIN tags tg ON tg.code IN ('NGHI_DUONG', 'SINH_THAI', 'DOC_HANH');

-- 7. Nhóm THẢO NGUYÊN & SA MẠC (Cảnh quan khô cằn / hùng vĩ)
-- Gồm: Mũi Né (Đồi cát), Dubai (Safari Sa mạc), Morocco (Sahara), Tân Cương (Thảo nguyên)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 19 AS tid UNION ALL SELECT 67 UNION ALL SELECT 90 UNION ALL SELECT 97
) AS n JOIN tags tg ON tg.code IN ('THAO_NGUYEN', 'MAO_HIEM', 'CHECKIN');

-- 8. Nhóm GẦN GŨI ĐỒNG BÀO BẢN ĐỊA (Homestay, Ăn ngủ cùng dân bản xứ)
-- Gồm: Sapa (Tả Van), Hà Giang, Đường Lâm (Hà Nội), Tây Bắc nói chung
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 4 AS tid UNION ALL SELECT 6 UNION ALL SELECT 22 UNION ALL SELECT 39 UNION ALL SELECT 40
) AS n JOIN tags tg ON tg.code IN ('VAN_HOA', 'AM_THUC', 'THU_CONG');

-- 9. Nhóm CUNG ĐƯỜNG ĐẸP (Dành cho người thích ngồi xe ngắm cảnh quan qua cửa sổ)
-- Gồm: Đèo Hải Vân, Mã Pì Lèng (Hà Giang), Great Ocean Road (Úc), Cung đường Vàng (Nhật Bản)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 6 AS tid UNION ALL SELECT 30 UNION ALL SELECT 53 UNION ALL SELECT 83
) AS n JOIN tags tg ON tg.code IN ('CHECKIN', 'THOI_GIAN_DAI');

-- 10. Bổ sung Tag UI: HOME_FLASH_SALE (Giả định các tour này hay có chương trình giảm giá giờ chót)
-- Gồm: Sài Gòn City, Miền Tây 1 ngày, Vũng Tàu, Thái Lan
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 2 AS tid UNION ALL SELECT 16 UNION ALL SELECT 18 UNION ALL SELECT 41
) AS n JOIN tags tg ON tg.code IN ('HOME_FLASH_SALE');


-- =====================================================================
-- BỔ SUNG ĐỢT 4: MỞ RỘNG SIÊU CHI TIẾT (CROSS-FUNCTIONAL TAGS)
-- =====================================================================

-- 1. Nhóm ẨM THỰC CHUYÊN SÂU (Food Tour - Street Food, Hải sản tươi sống, Đặc sản vùng miền)
-- Gồm: Hội An, Huế, Cần Thơ, Thái Lan, Đài Loan, Sài Gòn, Hà Nội, Nha Trang (hải sản)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 2 AS tid UNION ALL SELECT 7 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 18 UNION ALL SELECT 41 UNION ALL SELECT 56
) AS n JOIN tags tg ON tg.code IN ('AM_THUC', 'GIAI_TRI', 'NIGHTLIFE');

-- 2. Nhóm NHIẾP ẢNH CHUYÊN NGHIỆP (Photography/Check-in đỉnh cao - Cảnh quan hùng vĩ, ánh sáng đẹp)
-- Gồm: Sapa, Hà Giang, Mũi Né (đồi cát), Cửu Trại Câu, Bali (Cổng trời), Santorini, Cappadocia
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 4 AS tid UNION ALL SELECT 6 UNION ALL SELECT 19 UNION ALL SELECT 44 UNION ALL SELECT 60 UNION ALL SELECT 76 UNION ALL SELECT 88
) AS n JOIN tags tg ON tg.code IN ('CHECKIN', 'NUI', 'THAO_NGUYEN');

-- 3. Nhóm THỂ LỰC & MẠO HIỂM CAO (Trekking sâu, Leo núi mệt, Cần sức khỏe tốt)
-- Gồm: Fansipan (leo/trekking), Hang động sâu, Tây Tạng, Nam Mỹ (Iguazu), Nepal (nếu có)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 4 AS tid UNION ALL SELECT 65 UNION ALL SELECT 95
) AS n JOIN tags tg ON tg.code IN ('MAO_HIEM', 'TREKKING', 'SINH_THAI');

-- 4. Nhóm GIA ĐÌNH ĐA THẾ HỆ (Multi-generation - Phù hợp cả ông bà và cháu nhỏ, di chuyển nhẹ, khách sạn tiện nghi)
-- Gồm: Du thuyền Hạ Long, Phú Quốc (Resort), Vũng Tàu, Đà Nẵng (Resort), Sing, Châu Âu (Tour VIP)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 1 AS tid UNION ALL SELECT 3 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 42 UNION ALL SELECT 68
) AS n JOIN tags tg ON tg.code IN ('GIA_DINH', 'NGUOI_LON_TUOI', 'TRE_NHO', 'NGHI_DUONG');

-- 5. Nhóm THỂ THAO MÙA ĐÔNG (Trượt tuyết, Trải nghiệm băng giá)
-- Gồm: Hokkaido (Nhật), Hàn Quốc (Mùa đông), Bắc Âu, Thụy Sĩ
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 57 AS tid UNION ALL SELECT 66 UNION ALL SELECT 69 UNION ALL SELECT 74
) AS n JOIN tags tg ON tg.code IN ('MUA_DONG', 'MAO_HIEM', 'GIAI_TRI');

-- 6. Nhóm VĂN HÓA BẢN ĐỊA SÂU SẮC (Trải nghiệm sống cùng dân địa phương, lễ hội truyền thống)
-- Gồm: Tây Bắc (Tả Van, Lao Chải), Tây Nguyên (M'Nông), Châu Phi (Maasai Mara)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 22 AS tid UNION ALL SELECT 40 UNION ALL SELECT 100
) AS n JOIN tags tg ON tg.code IN ('VAN_HOA', 'SINH_THAI', 'WILDLIFE');

-- 7. Nhóm KIẾN TRÚC HIỆN ĐẠI & TƯƠNG LAI (Công trình siêu hiện đại, Kỹ thuật cao)
-- Gồm: Dubai (Burj Khalifa), Singapore (Marina Bay), Thượng Hải, Mỹ (New York)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 42 UNION ALL SELECT 55 UNION ALL SELECT 85 UNION ALL SELECT 90
) AS n(tid) JOIN tags tg ON tg.code IN ('THANH_PHO', 'CHECKIN', 'SANG_TRONG');

-- 8. Nhóm THOÁT KHỎI CÔNG NGHỆ (Digital Detox - Nơi vắng vẻ, có thể không có sóng điện thoại)
-- Gồm: Cắm trại Dầu Tiếng, Đảo Hòn Nưa (Phú Yên), Rừng Amazon (nếu có - tương đương Nam Mỹ), Safari Châu Phi sâu
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 35 AS tid UNION ALL SELECT 37 UNION ALL SELECT 91
) AS n JOIN tags tg ON tg.code IN ('SINH_THAI', 'CAMPING', 'NGHI_DUONG');

-- 9. Nhóm TOUR DU THUYỀN SÔNG (River Cruise - Nhẹ nhàng, lãng mạn, ngắm cảnh 2 bên bờ)
-- Gồm: Sông Hương (Huế), Sông Nile (Ai Cập), Sông Seine (Paris - thuộc tour Pháp), Danube (Đông Âu)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 9 AS tid UNION ALL SELECT 68 UNION ALL SELECT 70 UNION ALL SELECT 89
) AS n JOIN tags tg ON tg.code IN ('SONG_HO', 'LANG_MAN', 'NGHI_DUONG');

-- 10. Bổ sung Tag UI: HOME_BEACH_VN (Phủ thêm các tour biển đảo có tiềm năng)
-- Gồm: Cô Tô (nếu có), Lý Sơn (nếu có), thêm Vũng Tàu, Mũi Né vào kệ biển nội địa
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 16 AS tid UNION ALL SELECT 19
) AS n JOIN tags tg ON tg.code IN ('HOME_BEACH_VN');

-- 11. Bổ sung Tag UI: HOME_HOT_INTL (Phủ thêm các tour quốc tế đường trung/xa đang lên)
-- Gồm: Ấn Độ, Nam Phi, Úc (Perth)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 91 AS tid UNION ALL SELECT 94 UNION ALL SELECT 96
) AS n JOIN tags tg ON tg.code IN ('HOME_HOT_INTL');

-- =====================================================================
-- BỔ SUNG ĐỢT 5: MA TRẬN DỮ LIỆU TOÀN DIỆN (THỜI GIAN, GIÁ, MÙA VỤ, CẶP ĐÔI)
-- =====================================================================

-- 1. MA TRẬN THỜI GIAN: ĐI TRONG NGÀY (Duration = 1)
-- Tất cả các tour có duration_days = 1 bắt buộc phải có tag THOI_GIAN_NGAY
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 2 AS tid UNION ALL SELECT 5 UNION ALL SELECT 7 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 16 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 30 UNION ALL SELECT 31 UNION ALL SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 35 UNION ALL SELECT 36 UNION ALL SELECT 37 UNION ALL SELECT 38 UNION ALL SELECT 39 UNION ALL SELECT 40
) AS n JOIN tags tg ON tg.code IN ('THOI_GIAN_NGAY');

-- 2. MA TRẬN THỜI GIAN: ĐI NGẮN NGÀY (Duration = 2, 3)
-- Phù hợp cho khách tìm tour đi chơi cuối tuần (Weekend Getaway)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 1 AS tid UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 8 UNION ALL SELECT 15 UNION ALL SELECT 17 UNION ALL SELECT 29 UNION ALL SELECT 32 UNION ALL SELECT 42 UNION ALL SELECT 44 UNION ALL SELECT 45 UNION ALL SELECT 47 UNION ALL SELECT 52 UNION ALL SELECT 54 UNION ALL SELECT 55 UNION ALL SELECT 56 UNION ALL SELECT 58 UNION ALL SELECT 59 UNION ALL SELECT 62 UNION ALL SELECT 63 UNION ALL SELECT 79 UNION ALL SELECT 90 UNION ALL SELECT 96
) AS n JOIN tags tg ON tg.code IN ('THOI_GIAN_NGAN');

-- 3. MA TRẬN THỜI GIAN: ĐI DÀI NGÀY (Duration >= 4)
-- Phù hợp nghỉ phép dài, lễ Tết, du lịch xuyên quốc gia
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 6 AS tid UNION ALL SELECT 41 UNION ALL SELECT 43 UNION ALL SELECT 46 UNION ALL SELECT 48 UNION ALL SELECT 49 UNION ALL SELECT 50 UNION ALL SELECT 51 UNION ALL SELECT 53 UNION ALL SELECT 57 UNION ALL SELECT 60 UNION ALL SELECT 61 UNION ALL SELECT 64 UNION ALL SELECT 65 UNION ALL SELECT 66 UNION ALL SELECT 67 UNION ALL SELECT 68 UNION ALL SELECT 69 UNION ALL SELECT 70 UNION ALL SELECT 71 UNION ALL SELECT 72 UNION ALL SELECT 73 UNION ALL SELECT 74 UNION ALL SELECT 75 UNION ALL SELECT 76 UNION ALL SELECT 77 UNION ALL SELECT 78 UNION ALL SELECT 80 UNION ALL SELECT 81 UNION ALL SELECT 82 UNION ALL SELECT 83 UNION ALL SELECT 84 UNION ALL SELECT 85 UNION ALL SELECT 86 UNION ALL SELECT 87 UNION ALL SELECT 88 UNION ALL SELECT 89 UNION ALL SELECT 91 UNION ALL SELECT 92 UNION ALL SELECT 93 UNION ALL SELECT 94 UNION ALL SELECT 95 UNION ALL SELECT 97 UNION ALL SELECT 98 UNION ALL SELECT 99 UNION ALL SELECT 100
) AS n JOIN tags tg ON tg.code IN ('THOI_GIAN_DAI');

-- 4. MA TRẬN NGÂN SÁCH: SIÊU TIẾT KIỆM (Dưới 1 triệu / Dành cho Sinh viên, phượt thủ)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 2 AS tid UNION ALL SELECT 5 UNION ALL SELECT 7 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 16 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 30 UNION ALL SELECT 31 UNION ALL SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 36 UNION ALL SELECT 38 UNION ALL SELECT 39 UNION ALL SELECT 40
) AS n JOIN tags tg ON tg.code IN ('BUDGET_RE', 'SINH_VIEN', 'FREE_EASY');

-- 5. MA TRẬN NGÂN SÁCH: VIP & SIÊU SANG (Giá trị cao, Dịch vụ 5 sao, Nước ngoài đường dài)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 3 AS tid UNION ALL SELECT 17 UNION ALL SELECT 42 UNION ALL SELECT 44 UNION ALL SELECT 52 UNION ALL SELECT 53 UNION ALL SELECT 57 UNION ALL SELECT 60 UNION ALL SELECT 61 UNION ALL SELECT 65 UNION ALL SELECT 66 UNION ALL SELECT 67 UNION ALL SELECT 68 UNION ALL SELECT 69 UNION ALL SELECT 70 UNION ALL SELECT 71 UNION ALL SELECT 72 UNION ALL SELECT 73 UNION ALL SELECT 74 UNION ALL SELECT 75 UNION ALL SELECT 76 UNION ALL SELECT 77 UNION ALL SELECT 78 UNION ALL SELECT 79 UNION ALL SELECT 80 UNION ALL SELECT 81 UNION ALL SELECT 82 UNION ALL SELECT 83 UNION ALL SELECT 84 UNION ALL SELECT 85 UNION ALL SELECT 86 UNION ALL SELECT 87 UNION ALL SELECT 88 UNION ALL SELECT 89 UNION ALL SELECT 90 UNION ALL SELECT 91 UNION ALL SELECT 92 UNION ALL SELECT 93 UNION ALL SELECT 94 UNION ALL SELECT 95 UNION ALL SELECT 97 UNION ALL SELECT 98 UNION ALL SELECT 99 UNION ALL SELECT 100
) AS n JOIN tags tg ON tg.code IN ('BUDGET_VIP', 'SANG_TRONG');

-- 6. MA TRẬN MÙA VỤ: MÙA HÈ / TRÁNH NÓNG (Tất cả các tour Biển, Đảo, Núi cao mát mẻ)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 1 AS tid UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 24 UNION ALL SELECT 26 UNION ALL SELECT 35 UNION ALL SELECT 41 UNION ALL SELECT 44 UNION ALL SELECT 45 UNION ALL SELECT 47 UNION ALL SELECT 69 UNION ALL SELECT 76 UNION ALL SELECT 80 UNION ALL SELECT 83 UNION ALL SELECT 92
) AS n JOIN tags tg ON tg.code IN ('MUA_HE');

-- 7. MA TRẬN MÙA VỤ: MÙA THU / LÁ VÀNG LÁ ĐỎ (Khí hậu lãng mạn, cảnh quan thay lá)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 7 AS tid UNION ALL SELECT 39 UNION ALL SELECT 54 UNION ALL SELECT 55 UNION ALL SELECT 60 UNION ALL SELECT 86 UNION ALL SELECT 99
) AS n JOIN tags tg ON tg.code IN ('MUA_THU', 'CHECKIN');

-- 8. MA TRẬN ĐỐI TƯỢNG: CẶP ĐÔI / HONEYMOON (Tuyệt đối lãng mạn, riêng tư, cảnh đẹp)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 3 AS tid UNION ALL SELECT 10 UNION ALL SELECT 12 UNION ALL SELECT 14 UNION ALL SELECT 17 UNION ALL SELECT 21 UNION ALL SELECT 25 UNION ALL SELECT 30 UNION ALL SELECT 32 UNION ALL SELECT 37 UNION ALL SELECT 44 UNION ALL SELECT 54 UNION ALL SELECT 59 UNION ALL SELECT 61 UNION ALL SELECT 68 UNION ALL SELECT 71 UNION ALL SELECT 73 UNION ALL SELECT 75 UNION ALL SELECT 76 UNION ALL SELECT 77 UNION ALL SELECT 81 UNION ALL SELECT 92
) AS n JOIN tags tg ON tg.code IN ('CAP_DOI', 'LANG_MAN');

-- 9. MA TRẬN GIA ĐÌNH BÌNH AN (Kids & Elders Friendly - Rộng khắp)
-- Đảm bảo AI luôn có hàng chục lựa chọn an toàn khi user hỏi "Tour cho gia đình"
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 1 AS tid UNION ALL SELECT 2 UNION ALL SELECT 5 UNION ALL SELECT 7 UNION ALL SELECT 9 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 31 UNION ALL SELECT 36 UNION ALL SELECT 38 UNION ALL SELECT 41 UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 53 UNION ALL SELECT 54 UNION ALL SELECT 64 UNION ALL SELECT 83 UNION ALL SELECT 84 UNION ALL SELECT 85
) AS n JOIN tags tg ON tg.code IN ('GIA_DINH', 'TRE_NHO');

-- 10. PHỦ UI TRANG CHỦ: HOME_TRENDING & HOME_FLASH_SALE 
-- Trải đều thêm để hệ thống Random hiển thị ngoài trang chủ luôn làm mới
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 6 AS tid UNION ALL SELECT 15 UNION ALL SELECT 50 UNION ALL SELECT 78 UNION ALL SELECT 89
) AS n JOIN tags tg ON tg.code IN ('HOME_TRENDING', 'HOME_FLASH_SALE');

-- 1. Nhóm DI SẢN THẾ GIỚI UNESCO (Tệp khách: Trí thức, Tây Ba-lô, Yêu văn hóa sâu)
-- Gồm: Hạ Long, Tràng An, Huế, Hội An, Tháp Chăm, Angkor Wat, Vạn Lý Trường Thành, Lạc Sơn, Rome, Ai Cập, Taj Mahal, Chichen Itza
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 3 AS tid UNION ALL SELECT 5 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 34 UNION ALL SELECT 46 UNION ALL SELECT 55 UNION ALL SELECT 63 UNION ALL SELECT 75 UNION ALL SELECT 89 UNION ALL SELECT 96 UNION ALL SELECT 98
) AS n JOIN tags tg ON tg.code IN ('UNESCO', 'LICH_SU', 'VAN_HOA');

-- 2. Nhóm CHỮA LÀNH / WELLNESS (Tệp khách: Burnout, Dân văn phòng stress, Tìm sự tĩnh tại)
-- Gồm: Đà Lạt, Tuyệt Tình Cốc, Luang Prabang, Cửu Trại Câu, Iceland (Tắm khoáng Blue Lagoon), Nhật Bản (Onsen ngầm hiểu)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 12 AS tid UNION ALL SELECT 27 UNION ALL SELECT 48 UNION ALL SELECT 60 UNION ALL SELECT 82 UNION ALL SELECT 53 UNION ALL SELECT 61
) AS n JOIN tags tg ON tg.code IN ('CHUA_LANH', 'NGHI_DUONG', 'DOC_HANH');

-- 3. Nhóm CINEMATIC / BỐI CẢNH PHIM BOM TẤN (Tệp khách: Gen Z, Yêu điện ảnh, Thích Sống ảo)
-- Gồm: Phú Yên (Hoa vàng cỏ xanh), Vịnh Maya Thái Lan (Phim The Beach), Trương Gia Giới (Avatar), Scotland (Harry Potter), Croatia (Game of Thrones), New Zealand (Chúa Tể Những Chiếc Nhẫn)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 13 AS tid UNION ALL SELECT 45 UNION ALL SELECT 58 UNION ALL SELECT 72 UNION ALL SELECT 80 UNION ALL SELECT 87
) AS n JOIN tags tg ON tg.code IN ('PHIM_TRUONG', 'CHECKIN');

-- 4. Nhóm ROADTRIP / PHƯỢT ĐỊA HÌNH (Tệp khách: Đam mê tốc độ, Bụi bặm, Nam giới)
-- Gồm: Hà Giang (Đi xe máy), Mũi Né (Xe Jeep đồi cát), New Zealand (Xe tự lái), Dubai (Jeep sa mạc), Morocco (Xe địa hình sa mạc Sahara)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 6 AS tid UNION ALL SELECT 19 UNION ALL SELECT 87 UNION ALL SELECT 90 UNION ALL SELECT 97
) AS n JOIN tags tg ON tg.code IN ('ROADTRIP', 'MAO_HIEM');

-- 5. Nhóm MIỆT VƯỜN / DU LỊCH NÔNG NGHIỆP (Tệp khách: Gia đình có trẻ nhỏ mầm non, Người cao tuổi)
-- Gồm: Cần Thơ (vườn trái cây), Mỹ Khánh, Rừng dừa Bảy Mẫu, Đường Lâm (ẩm thực quê), Hồ Lắk
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 18 AS tid UNION ALL SELECT 31 UNION ALL SELECT 33 UNION ALL SELECT 39 UNION ALL SELECT 40
) AS n JOIN tags tg ON tg.code IN ('MIET_VUON', 'GIA_DINH', 'SINH_THAI');

-- 6. Nhóm WEEKEND GETAWAY (Xách balo lên và đi ngay thứ 7, Chủ Nhật)
-- Gồm các tour đi gần trung tâm (TPHCM/Hà Nội), chỉ 1-2 ngày, đi xe ô tô/xe khách là tới.
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 16 AS tid UNION ALL SELECT 20 UNION ALL SELECT 28 UNION ALL SELECT 36 UNION ALL SELECT 37 UNION ALL SELECT 38 UNION ALL SELECT 39
) AS n JOIN tags tg ON tg.code IN ('THOI_GIAN_NGAY', 'BUDGET_RE', 'FREE_EASY');

-- 7. Nhóm HOA MÙA XUÂN QUỐC TẾ HIẾM CÓ (Lễ hội hoa đặc thù)
-- Gồm: Hà Lan (Tulip Keukenhof), Đài Loan (Hoa anh đào rừng Alishan), Nhật Bản (Sakura)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 61 AS tid UNION ALL SELECT 62 UNION ALL SELECT 71
) AS n JOIN tags tg ON tg.code IN ('MUA_XUAN', 'CHECKIN', 'LE_HOI');

-- 8. Nhóm LUXURY HONEYMOON ĐỘC BẢN (Tuần trăng mật "đốt tiền", lưu giữ cả đời)
-- Gồm: Maldives (Water Villa), Santorini (Hy Lạp), Châu Âu 3 nước (Lãng mạn Paris)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 68 AS tid UNION ALL SELECT 76 UNION ALL SELECT 92
) AS n JOIN tags tg ON tg.code IN ('LANG_MAN', 'CAP_DOI', 'BUDGET_VIP', 'HOME_LUXURY');

-- 1. Nhóm VISA_FREE (Vũ khí chốt sale phút chót cho khách ghét làm giấy tờ)
-- Gồm: Đông Nam Á (Thái, Sing, Malay, Bali, Cam, Phi, Lào), Đảo Jeju (Hàn Quốc - miễn visa), Maldives (miễn visa)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 41 AS tid UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 44 UNION ALL SELECT 45 UNION ALL SELECT 46 UNION ALL SELECT 47 UNION ALL SELECT 48 UNION ALL SELECT 49 UNION ALL SELECT 50 UNION ALL SELECT 51 UNION ALL SELECT 52 UNION ALL SELECT 59 UNION ALL SELECT 92
) AS n JOIN tags tg ON tg.code IN ('VISA_FREE', 'THOI_GIAN_NGAN');

-- 2. Nhóm GIAO_DUC (Phụ huynh muốn con vừa đi chơi vừa học)
-- Gồm: Lăng Bác/Văn Miếu (7), Địa đạo Củ Chi (28), Dinh Độc Lập (2), Safari Nam Phi (91), Kenya (100), Ai Cập cổ đại (89)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 2 AS tid UNION ALL SELECT 7 UNION ALL SELECT 28 UNION ALL SELECT 89 UNION ALL SELECT 91 UNION ALL SELECT 100
) AS n JOIN tags tg ON tg.code IN ('GIAO_DUC', 'GIA_DINH', 'TRE_NHO');

-- 3. Nhóm CẢNH BÁO ĐI BỘ NHIỀU (Giúp AI thể hiện sự tinh tế, cảnh báo khách lớn tuổi)
-- Gồm: Vạn Lý Trường Thành (55), Phượng Hoàng Cổ Trấn (58), Angkor Wat (46), Các tour Châu Âu dạo bộ phố cổ (68, 70, 75, 78)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 46 AS tid UNION ALL SELECT 55 UNION ALL SELECT 58 UNION ALL SELECT 68 UNION ALL SELECT 70 UNION ALL SELECT 75 UNION ALL SELECT 78
) AS n JOIN tags tg ON tg.code IN ('DI_BO_NHIEU');

-- 4. Nhóm SĂN MẶT TRỜI CỰC PHẨM (Khách mê lãng mạn & nhiếp ảnh)
-- Gồm: Fansipan (4), Đồi chè săn mây Đà Lạt (25), Ngắm hoàng hôn Eo Gió (14), Hoàng hôn Phú Quốc (17), Bình minh Bagan (50), Đồi cát Mũi Né (19), Hoàng hôn Santorini (76)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 4 AS tid UNION ALL SELECT 14 UNION ALL SELECT 17 UNION ALL SELECT 19 UNION ALL SELECT 25 UNION ALL SELECT 50 UNION ALL SELECT 76
) AS n JOIN tags tg ON tg.code IN ('SUNRISE_SUNSET', 'CHECKIN', 'LANG_MAN');

-- 5. Nhóm PHẬT GIÁO CHI TIẾT (Cho khách lớn tuổi, khách hướng Phật)
-- Gồm: Bái Đính (5), Tây Tạng (65), Myanmar (50), Thái Lan (41), Chiang Mai (51), Ấn Độ (96)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 5 AS tid UNION ALL SELECT 41 UNION ALL SELECT 50 UNION ALL SELECT 51 UNION ALL SELECT 65 UNION ALL SELECT 96
) AS n JOIN tags tg ON tg.code IN ('PHAT_GIAO', 'TAM_LINH', 'NGUOI_LON_TUOI');

-- 6. Nhóm CÔNG GIÁO / HỒI GIÁO (Khám phá kiến trúc ngoạn mục)
-- Gồm: Sài Gòn (Nhà thờ Đức Bà - 2), Brunei (52), Ý/Vatican (75), Tây Ban Nha (73), Dubai (90), Morocco (97)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 2 AS tid UNION ALL SELECT 52 UNION ALL SELECT 73 UNION ALL SELECT 75 UNION ALL SELECT 90 UNION ALL SELECT 97
) AS n JOIN tags tg ON tg.code IN ('CONG_GIAO_HOI_GIAO', 'KIEN_TRUC');

-- 7. Nhóm TRẢI NGHIỆM ĐỘC LẠ TẠI VIỆT NAM (Dùng để push sale khách inbound / kiều bào)
-- Gồm: Lội suối Tiên (19), Múa thúng Rừng Dừa (33), Tắm bùn Nha Trang (11), Ngủ đêm vịnh Hạ Long (3)
INSERT IGNORE INTO tour_tags (tour_id, tag_id)
SELECT n.tid, tg.id FROM (
    SELECT 3 AS tid UNION ALL SELECT 11 UNION ALL SELECT 19 UNION ALL SELECT 33
) AS n JOIN tags tg ON tg.code IN ('TRAI_NGHIEM_DOC_LA', 'VAN_HOA');


INSERT IGNORE INTO tour_itinerary_days (id, tour_id, day_number, title, description)
VALUES
(1,1,1,'Ngày 1','Đón khách – tham quan biển – ăn tối.'),
(2,1,2,'Ngày 2','Bà Nà Hills – Cầu Vàng – nghỉ ngơi.'),
(3,1,3,'Ngày 3','Mua sắm đặc sản tại chợ Hàn. Xe đưa đoàn ra sân bay Đà Nẵng, kết thúc hành trình.'),
(4,2,1,'Buổi sáng','Tham quan Dinh Độc Lập, Bưu điện Trung tâm và Nhà thờ Đức Bà cổ kính.'),
(5,2,2,'Buổi chiều','Khám phá Bảo tàng Chứng tích Chiến tranh và mua sắm tại Chợ Bến Thành.'),
(6,2,3,'Buổi tối','Dạo phố đi bộ Nguyễn Huệ, ngắm nhìn UBND Thành phố lên đèn và dùng bữa tối tự túc.'),
(7,3,1,'Ngày 1 - Sáng','Đón khách tại bến Tuần Châu, lên du thuyền 5 sao nhận phòng và thưởng thức đồ uống chào mừng.'),
(8,3,2,'Ngày 1 - Chiều','Khám phá Hang Sửng Sốt - hang động lớn và đẹp nhất vịnh. Chèo thuyền Kayak tại khu vực Hang Luồn.'),
(9,3,3,'Ngày 2','Đón bình minh với bài tập Tai Chi. Tham quan đảo TiTop, tắm biển hoặc leo núi ngắm toàn cảnh Vịnh. Trả phòng và về bến.'),
(10,4,1,'Ngày 1','Hà Nội - Sapa. Buổi chiều trekking khám phá bản Cát Cát, tìm hiểu văn hóa người H''Mông, ngắm thác nước.'),
(11,4,2,'Ngày 2','Đi cáp treo chinh phục đỉnh Fansipan - Nóc nhà Đông Dương, dâng hương tại quần thể tâm linh trên đỉnh núi.'),
(12,4,3,'Ngày 3','Tham quan Thác Bạc, Cổng Trời. Tự do mua sắm đặc sản Sapa trước khi lên xe về lại Hà Nội.'),
(13,5,1,'Buổi sáng','Khởi hành từ Hà Nội. Tham quan Chùa Bái Đính - ngôi chùa có nhiều kỷ lục nhất Việt Nam (tượng Phật đồng lớn nhất, hành lang La Hán dài nhất).'),
(14,5,2,'Buổi chiều','Lên thuyền nan xuôi dòng Tràng An, đi qua các hang động kỳ bí và phim trường Kong: Skull Island.'),
(15,5,3,'Buổi chiều muộn','Chinh phục 500 bậc đá tại Hang Múa, ngắm toàn cảnh Tam Cốc từ trên cao lúc hoàng hôn.'),
(16,6,1,'Ngày 1','Hà Nội - TP. Hà Giang - Quản Bạ. Check-in cổng trời Quản Bạ, ngắm Núi Đôi Cô Tiên.'),
(17,6,2,'Ngày 2','Yên Minh - Đồng Văn. Tham quan Dinh thự vua Mèo họ Vương, check-in Cột cờ Lũng Cú - điểm cực Bắc tổ quốc.'),
(18,6,3,'Ngày 3','Chinh phục một trong tứ đại đỉnh đèo Mã Pì Lèng. Đi thuyền ngắm hẻm tu Sản trên dòng sông Nho Quế.'),
(19,6,4,'Ngày 4','Đồng Văn - Hà Nội. Dừng chân mua sắm các sản vật vùng cao, kết thúc chuyến đi.'),
(20,7,1,'Buổi sáng','Viếng Lăng Chủ tịch Hồ Chí Minh, tham quan Phủ Chủ tịch, Ao cá, Nhà sàn và Chùa Một Cột.'),
(21,7,2,'Buổi chiều','Tham quan Văn Miếu Quốc Tử Giám - trường đại học đầu tiên của Việt Nam. Dạo bước quanh Hồ Hoàn Kiếm, đền Ngọc Sơn.'),
(22,7,3,'Buổi tối','Khám phá 36 phố phường bằng xích lô hoặc đi bộ. Thưởng thức ẩm thực đường phố và xem múa rối nước.'),
(23,8,1,'Ngày 1','Hà Nội - Cao Bằng. Băng qua các con đèo ngoạn mục, nhận phòng homestay tại làng đá Khuổi Ky.'),
(24,8,2,'Ngày 2','Chiêm ngưỡng vẻ đẹp hùng vĩ của Thác Bản Giốc. Buổi chiều khám phá hệ thống thạch nhũ độc đáo tại Động Ngườm Ngao.'),
(25,8,3,'Ngày 3','Tham quan Khu di tích Pác Bó, suối Lê-nin, núi Các Mác nước trong vắt. Khởi hành về lại Hà Nội.'),
(26,9,1,'Buổi sáng','Tham quan Đại Nội Huế (Hoàng Thành của 13 vị vua triều Nguyễn) với Ngọ Môn, Điện Thái Hòa, Tử Cấm Thành.'),
(27,9,2,'Buổi chiều','Viếng Chùa Thiên Mụ cổ kính bên bờ sông Hương. Tham quan Lăng Khải Định với kiến trúc giao thoa Đông - Tây.'),
(28,9,3,'Buổi tối','Lên thuyền rồng xuôi dòng sông Hương, nghe ca Huế và thả hoa đăng cầu bình an.'),
(29,10,1,'Buổi chiều','Tản bộ tham quan phố cổ Hội An: Chùa Cầu Nhật Bản, Hội quán Phước Kiến, Nhà cổ Tân Ký.'),
(30,10,2,'Buổi chiều muộn','Thưởng thức đặc sản Hội An: Cao lầu, cơm gà, bánh mì Phượng. Nghỉ ngơi tại quán cafe ven sông.'),
(31,10,3,'Buổi tối','Ngắm phố cổ lung linh dưới ánh đèn lồng, đi thuyền trên sông Hoài và chơi các trò chơi dân gian (bài chòi).'),
(32,11,1,'Buổi sáng','Xe đón tại khách sạn ra cảng. Lên cano cao tốc đến Hòn Mun - Khu bảo tồn biển lớn nhất VN để lặn ngắm san hô.'),
(33,11,2,'Buổi trưa','Di chuyển đến Làng Chài thăm các bè nuôi hải sản, dùng bữa trưa với các món hải sản tươi sống.'),
(34,11,3,'Buổi chiều','Đến Hòn Tằm (hoặc Robinson). Trải nghiệm tắm bùn khoáng nóng, thư giãn tại hồ bơi vô cực hoặc chơi thể thao nước.'),
(35,12,1,'Buổi sáng','Tham quan Dinh Bảo Đại, vườn hoa thành phố và check-in quảng trường Lâm Viên.'),
(36,12,2,'Buổi chiều','Đi cáp treo Đồi Robin hoặc máng trượt khám phá Thác Datanla. Viếng Thiền viện Trúc Lâm, hồ Tuyền Lâm.'),
(37,12,3,'Buổi tối','Tự do dạo Chợ đêm Đà Lạt, thưởng thức bánh tráng nướng, sữa đậu nành nóng trong tiết trời se lạnh.'),
(38,13,1,'Buổi sáng','Đón ánh bình minh đầu tiên tại Hải đăng Đại Lãnh (Mũi Điện), tham quan Bãi Môn hoang sơ.'),
(39,13,2,'Buổi chiều','Chiêm ngưỡng kiệt tác thiên nhiên Gành Đá Đĩa. Tham quan Bãi Xép - bối cảnh phim "Tôi thấy hoa vàng trên cỏ xanh".'),
(40,13,3,'Buổi tối','Thưởng thức hải sản tươi sống, đặc biệt là sò huyết tại Đầm Ô Loan trước khi về lại khách sạn.'),
(41,14,1,'Buổi sáng','Đi cano ra đảo Kỳ Co - Maldives của Việt Nam, tự do tắm biển và lặn ngắm san hô tại Bãi Dứa.'),
(42,14,2,'Buổi chiều','Check-in Eo Gió với con đường đi bộ ven biển tuyệt đẹp. Viếng Tịnh xá Ngọc Hòa có tượng Phật đôi cao nhất VN.'),
(43,14,3,'Buổi tối','Trở về trung tâm Quy Nhơn, tự do dạo biển và thưởng thức bánh xèo tôm nhảy.'),
(44,15,1,'Ngày 1','Đến TP Buôn Ma Thuột, tham quan Bảo tàng Thế giới Cà phê với kiến trúc nhà dài độc đáo. Thưởng thức ly cà phê đậm chất Tây Nguyên.'),
(45,15,2,'Ngày 2','Di chuyển đi Buôn Đôn, tìm hiểu nghề săn bắt và thuần dưỡng voi. Chiều ghé thăm cụm thác Đray Nur - Đray Sáp hùng vĩ.'),
(46,15,3,'Ngày 3','Tham quan buôn Ako Dhong - buôn làng giàu đẹp nhất BMT. Mua sắm đặc sản và kết thúc hành trình.'),
(47,16,1,'Buổi sáng','Chinh phục 847 bậc thang lên Tượng Chúa Kitô Vua lớn nhất châu Á, ngắm nhìn toàn cảnh thành phố biển.'),
(48,16,2,'Buổi chiều','Tham quan Bạch Dinh (Villa Blanche) và vui chơi, tắm biển tại Bãi Sau.'),
(49,16,3,'Buổi tối','Thưởng thức lẩu cá đuối, bánh khọt đặc sản Vũng Tàu và dạo biển về đêm trước khi lên xe về.'),
(50,17,1,'Ngày 1','Đến Phú Quốc, nhận phòng. Chiều khám phá Grand World - thành phố không ngủ, đi thuyền trên sông Venice.'),
(51,17,2,'Ngày 2','Vui chơi thỏa thích tại công viên chủ đề VinWonders và thăm Vườn thú bán hoang dã Safari lớn nhất VN.'),
(52,17,3,'Ngày 3','Tham quan Nam đảo: nhà tù Phú Quốc, nhà thùng nước mắm, tắm biển Bãi Sao và tiễn khách ra sân bay.'),
(53,18,1,'Buổi sáng','Dậy sớm ra bến tàu, tham quan Chợ nổi Cái Răng - nét văn hóa đặc trưng sông nước miền Tây. Ghé lò hủ tiếu truyền thống.'),
(54,18,2,'Buổi trưa','Di chuyển vào các miệt vườn trái cây, thưởng thức trái cây theo mùa và nghe đờn ca tài tử Nam Bộ.'),
(55,18,3,'Buổi chiều','Tham quan Nhà cổ Bình Thủy (bối cảnh phim Người Tình). Dạo bến Ninh Kiều lúc hoàng hôn.'),
(56,19,1,'Buổi sáng','Đi xe Jeep ngắm bình minh trên Đồi Cát Trắng (Bàu Trắng), trải nghiệm trượt cát và chạy xe địa hình ATV.'),
(57,19,2,'Buổi trưa','Ghé thăm Làng Chài Mũi Né nhộn nhịp, xem ngư dân gỡ lưới và mua hải sản tươi sống.'),
(58,19,3,'Buổi chiều','Lội nước mát lạnh tại Suối Tiên - dòng suối có một không hai với màu đỏ cam đặc trưng từ cát.'),
(59,20,1,'Buổi sáng','Đi tuyến cáp treo hiện đại lên đỉnh Núi Bà Đen - Nóc nhà Đông Nam Bộ. Viếng tượng Phật Bà Tây Bổ Đà Sơn bằng đồng.'),
(60,20,2,'Buổi trưa','Xuống núi, dùng bữa trưa với đặc sản bò tơ Tây Ninh hoặc các món chay truyền thống.'),
(61,20,3,'Buổi chiều','Tham quan Tòa Thánh Tây Ninh - công trình kiến trúc độc đáo của đạo Cao Đài, xem nghi lễ cúng Tứ Thời.'),
(62,21,1,'Buổi chiều','Tham quan Ngũ Hành Sơn, leo núi thăm động Huyền Không, viếng chùa Linh Ứng Non Nước.'),
(63,21,2,'Buổi chiều muộn','Khám phá Làng đá mỹ nghệ Non Nước dưới chân núi.'),
(64,21,3,'Buổi tối','Di chuyển vào Hội An, dạo phố lồng đèn, ăn tối và về lại Đà Nẵng.'),
(65,22,1,'Ngày 1 - Sáng','Đón khách tại trung tâm Sapa, bắt đầu hành trình trekking đi bộ xuống thung lũng Mường Hoa.'),
(66,22,2,'Ngày 1 - Chiều','Khám phá bản Lao Chải của người H''Mông Đen, tận mắt xem quy trình dệt vải lanh, nhuộm chàm.'),
(67,22,3,'Ngày 1 - Tối','Tới bản Tả Van của người Giáy, nhận phòng homestay, ăn tối cùng gia đình bản địa và nghỉ ngơi.'),
(68,23,1,'Sáng','9h00 Lên tàu tại Cảng Tuần Châu. Tàu di chuyển qua các hòn đảo nổi tiếng: Hòn Chó Đá, Đỉnh Hương, Trống Mái.'),
(69,23,2,'Trưa','Thưởng thức bữa trưa hải sản trên tàu. Sau đó khám phá Hang Sửng Sốt.'),
(70,23,3,'Chiều','Tự chèo Kayak hoặc đi đò nan qua Hang Luồn. Trở về tàu ngắm hoàng hôn, 17h00 cập bến.'),
(71,24,1,'Sáng','Đón khách, cano đưa đoàn đến Hòn Mun lặn bình khí ngắm san hô (Scuba diving).'),
(72,24,2,'Trưa','Di chuyển đến Làng Chài dùng cơm trưa, trải nghiệm bar nổi trên biển vô cùng sôi động.'),
(73,24,3,'Chiều','Sang Bãi Tranh nghỉ ngơi, chơi dù lượn, mô tô nước trước khi cano đưa về lại đất liền.'),
(74,25,1,'Sáng sớm','4h00 Khởi hành đi săn mây tại khu vực Cầu gỗ săn mây Đồi chè Cầu Đất, đón bình minh sớm nhất Đà Lạt.'),
(75,25,2,'Giữa sáng','Tham quan Đồi chè xanh mướt, check-in cánh đồng điện gió.'),
(76,25,3,'Trưa','Thưởng thức bữa sáng tự túc, ghé nông trại Chika Farm chơi cùng cừu Alpaca rồi về trung tâm.'),
(77,26,1,'Sáng','Lên tàu du lịch tại cảng An Thới. Tàu neo đậu tại các rạn san hô để quý khách lặn ngắm bằng ống thở (Snorkeling).'),
(78,26,2,'Trưa','Trải nghiệm câu cá giữa biển khơi, chiến lợi phẩm sẽ được chế biến ngay trên tàu cùng bữa trưa.'),
(79,26,3,'Chiều','Tàu đưa đoàn đến Bãi Sao tắm biển, thư giãn trên bãi cát trắng mịn, xích đu cây dừa.'),
(80,27,1,'Sáng','Tham quan Tuyệt Tình Cốc (Động Am Tiên) - nơi có hồ nước xanh ngọc bích nằm lọt thỏm giữa những ngọn núi.'),
(81,27,2,'Trưa','Dùng bữa trưa với đặc sản Dê núi Ninh Bình, cơm cháy.'),
(82,27,3,'Chiều','Chinh phục đỉnh núi Múa với kiến trúc Vạn Lý Trường Thành thu nhỏ, check-in toàn cảnh.'),
(83,28,1,'Sáng','Di chuyển đến khu di tích Địa Đạo Củ Chi (Bến Dược). Xem phim tư liệu về thời kỳ chiến tranh.'),
(84,28,2,'Trưa','Khám phá hệ thống đường hầm dưới lòng đất, thưởng thức khoai mì luộc chấm muối đậu.'),
(85,28,3,'Chiều','Tự do thử tài bắn súng đạn thật tại trường bắn thể thao, mua sắm lưu niệm rồi về lại TP.HCM.'),
(86,29,1,'Ngày 1','Khởi hành lên Đồng Văn. Trên đường dừng check-in các cánh đồng hoa Tam Giác Mạch bạt ngàn tại Phố Cáo, Sủng Là.'),
(87,29,2,'Ngày 2','Tham gia Lễ hội hoa Tam Giác Mạch (nếu đi đúng dịp), uống rượu ngô, ăn thắng cố.'),
(88,29,3,'Ngày 3','Chinh phục đèo Mã Pì Lèng, chụp ảnh cùng hoa trên các mỏm đá tai mèo hùng vĩ trước khi về.'),
(89,30,1,'Sáng','Từ Huế khởi hành đi Lăng Cô. Dừng chân tại đỉnh Đèo Hải Vân - Thiên hạ đệ nhất hùng quan.'),
(90,30,2,'Trưa','Đến Vịnh Lăng Cô, tự do tắm biển và thưởng thức hải sản tươi sống tại các nhà hàng nổi ven đầm Lập An.'),
(91,30,3,'Chiều','Ghé thăm Đầm Lập An, chụp ảnh với bãi cát giữa đầm lúc triều rút trước khi trở về Huế.'),
(92,31,1,'Sáng','Tham quan Thiền Viện Trúc Lâm Phương Nam với kiến trúc gỗ lim độc đáo.'),
(93,31,2,'Trưa','Di chuyển vào Làng du lịch Mỹ Khánh, xem đua heo, đua chó, xiếc khỉ và dùng cơm trưa Nam Bộ.'),
(94,31,3,'Chiều','Tự do dạo vườn trái cây, trải nghiệm làm điền chủ, nghe đờn ca tài tử.'),
(95,32,1,'Ngày 1','Từ TP Cao Bằng di chuyển đến Hồ Thang Hen, nhận lều trại. Buổi chiều chèo SUP trên mặt hồ tĩnh lặng.'),
(96,32,2,'Ngày 1 - Tối','Tổ chức tiệc nướng BBQ ngoài trời, đốt lửa trại và giao lưu văn nghệ.'),
(97,32,3,'Ngày 2','Thức dậy sớm đón bình minh. Trekking ngắn đến khu vực Núi Mắt Thần (Thủng) chiêm ngưỡng bãi cỏ xanh mướt.'),
(98,33,1,'Sáng','Đạp xe xuyên qua các làng quê thanh bình để đến với Rừng dừa Bảy Mẫu Cẩm Thanh.'),
(99,33,2,'Trưa','Lên thuyền thúng, len lỏi qua các rạch dừa nước. Xem ngư dân biểu diễn múa thúng chai và quăng chài lưới.'),
(100,33,3,'Chiều','Học cách làm đồ chơi từ lá dừa (cào cào, nón), dùng bữa trưa tại nhà dân địa phương.'),
(101,34,1,'Sáng','Tham quan Tháp Bánh Ít - quần thể 4 tòa tháp Chăm nghìn năm tuổi tọa lạc trên một ngọn đồi cao.'),
(102,34,2,'Trưa','Về trung tâm thành phố, thưởng thức bún chả cá Quy Nhơn trứ danh.'),
(103,34,3,'Chiều','Khám phá Tháp Đôi ngay giữa lòng thành phố, tìm hiểu kiến trúc điêu khắc đậm chất văn hóa Champa.'),
(104,35,1,'Sáng','Đến chân đèo Cả, đi cano ra Đảo Hòn Nưa. Tự do tắm biển tại bãi cát trắng hoang sơ.'),
(105,35,2,'Trưa','Lặn ngắm san hô (snorkeling) và tổ chức nướng BBQ cá, mực tươi ngay trên bãi biển.'),
(106,35,3,'Chiều','Khám phá các ngọn hải đăng nhỏ trên đảo, chụp ảnh với cột mốc ranh giới Phú Yên - Khánh Hòa.'),
(107,36,1,'Sáng','Đến trạm cáp treo, di chuyển lên Khu du lịch Hồ Mây nằm trên đỉnh núi Tương Kỳ.'),
(108,36,2,'Trưa','Thỏa sức tham gia các trò chơi: Trượt cỏ, xe trượt ống Alpine Coaster, xem phim 5D.'),
(109,36,3,'Chiều','Tham quan vườn thú, đền thờ Phật giáo trên núi và ngắm hoàng hôn Vũng Tàu từ trên cao.'),
(110,37,1,'Ngày 1 - Chiều','Tập trung tại Hồ Dầu Tiếng, setup lều trại ven hồ. Chèo SUP ngắm hoàng hôn buông xuống mặt hồ.'),
(111,37,2,'Ngày 1 - Tối','Thưởng thức tiệc BBQ lửa trại với thịt nướng, giao lưu âm nhạc Acoustic giữa thiên nhiên.'),
(112,37,3,'Ngày 2 - Sáng','Dậy sớm nhâm nhi ly cà phê sáng, ngắm nhìn mây vờn quanh đỉnh núi Bà Đen ở phía xa, nhổ trại.'),
(113,38,1,'Sáng','Tham quan Lâu đài Rượu Vang RD mang kiến trúc thời Trung Cổ châu Âu tại khu nghỉ dưỡng Sea Links.'),
(114,38,2,'Trưa','Tham quan hầm rượu bảo quản dưới lòng đất, nghe giới thiệu về quy trình sản xuất rượu vang.'),
(115,38,3,'Chiều','Thưởng thức các loại rượu vang thượng hạng, tự do mua sắm và chụp ảnh tại vườn hoa lâu đài.'),
(116,39,1,'Sáng','Khởi hành từ Hà Nội đến Làng cổ Đường Lâm. Check-in tại cây đa, bến nước, sân đình và cổng làng Mông Phụ.'),
(117,39,2,'Trưa','Thăm nhà cổ bằng đá ong, thưởng thức bữa cơm trưa truyền thống: thịt quay đòn, gà luộc, chè kho.'),
(118,39,3,'Chiều','Đạp xe đi thăm Đền thờ Phùng Hưng, lăng Ngô Quyền trước khi lên xe về lại thủ đô.'),
(119,40,1,'Sáng','Khởi hành đi Hồ Lắk. Ngồi thuyền độc mộc dạo quanh hồ nước ngọt tự nhiên lớn thứ hai Việt Nam.'),
(120,40,2,'Trưa','Dùng bữa trưa với món chả cá thác lác, cơm lam và gà nướng đặc sản.'),
(121,40,3,'Chiều','Tham quan Biệt điện Bảo Đại tọa lạc trên đồi cao. Dạo quanh Buôn Jun tìm hiểu đời sống người M''Nông.')
;

INSERT IGNORE INTO itinerary_items (
    itinerary_day_id,
    sequence_no,
    item_type,
    title,
    description,
    location_name,
    start_time,
    end_time
)
VALUES
(1,1,'activity','Đón khách','Tập trung tại điểm hẹn','Điểm hẹn trung tâm',NULL,NULL),
(2,1,'activity','Tham quan Bà Nà','Đi cáp treo và tham quan','Bà Nà Hills',NULL,NULL),
(1, 2, 'meal', 'Ăn trưa đặc sản', 'Thưởng thức bánh tráng cuốn thịt heo và mỳ Quảng.', 'Nhà hàng đặc sản Trần', '11:30:00', '13:00:00'),
(1, 3, 'activity', 'Check-in biển Mỹ Khê', 'Tự do tắm biển và tham gia các trò chơi trên cát.', 'Bãi biển Mỹ Khê', '15:00:00', '17:30:00'),
(2, 2, 'activity', 'Check-in Cầu Vàng', 'Đi bộ trên cây cầu biểu tượng được nâng đỡ bởi bàn tay khổng lồ.', 'Cầu Vàng (Golden Bridge)', '10:00:00', '11:30:00'),
(2, 3, 'meal', 'Buffet trưa tại Bà Nà', 'Thưởng thức hơn 100 món ăn Á - Âu tại nhà hàng Arapang.', 'Nhà hàng Arapang', '12:00:00', '13:30:00'),
(3, 1, 'activity', 'Mua sắm đặc sản', 'Mua sắm quà lưu niệm, hải sản khô tại chợ trung tâm.', 'Chợ Hàn Đà Nẵng', '08:30:00', '10:30:00'),
(3, 2, 'transport', 'Tiễn sân bay', 'Xe đưa đoàn ra sân bay quốc tế Đà Nẵng.', 'Sân bay Đà Nẵng', '11:00:00', '12:00:00'),
(4, 2, 'activity', 'Bưu điện Thành phố', 'Chiêm ngưỡng kiến trúc Phục Hưng cổ kính giữa lòng Sài Gòn.', 'Bưu điện trung tâm', '10:30:00', '11:30:00'),
(5, 1, 'meal', 'Ăn trưa cơm tấm', 'Thưởng thức cơm tấm Sài Gòn chính gốc.', 'Cơm tấm Thuận Kiều', '12:00:00', '13:00:00'),
(5, 2, 'activity', 'Mua sắm chợ Bến Thành', 'Khám phá khu chợ biểu tượng của thành phố.', 'Chợ Bến Thành', '14:30:00', '16:00:00'),
(6, 1, 'activity', 'Dạo phố đi bộ', 'Tự do check-in và xem biểu diễn nghệ thuật đường phố.', 'Phố đi bộ Nguyễn Huệ', '19:00:00', '21:00:00'),
(7, 1, 'transport', 'Di chuyển ra bến tàu', 'Xe đón khách tại Hà Nội đi cao tốc đến Hạ Long.', 'Cảng Tuần Châu', '08:00:00', '11:30:00'),
(8, 1, 'activity', 'Thăm Hang Sửng Sốt', 'Khám phá hang động thạch nhũ kỳ ảo.', 'Hang Sửng Sốt', '14:00:00', '15:30:00'),
(8, 2, 'activity', 'Chèo Kayak', 'Trải nghiệm tự tay chèo thuyền xuyên qua các hòn đảo.', 'Khu vực Hang Luồn', '16:00:00', '17:30:00'),
(9, 1, 'activity', 'Leo núi TiTop', 'Ngắm nhìn toàn cảnh vịnh từ đỉnh núi và tắm biển.', 'Đảo TiTop', '08:00:00', '09:30:00'),
(9, 2, 'meal', 'Bữa trưa chia tay', 'Dùng bữa trưa sớm trên du thuyền trước khi về cảng.', 'Du thuyền Hạ Long', '11:00:00', '12:00:00'),
(10, 2, 'activity', 'Trekking bản Cát Cát', 'Đi bộ qua các nếp nhà gỗ, xem dệt vải và thác nước.', 'Bản Cát Cát', '14:00:00', '17:00:00'),
(11, 1, 'activity', 'Chinh phục Fansipan', 'Đi cáp treo đạt kỷ lục thế giới lên đỉnh núi.', 'Cáp treo Fansipan', '08:30:00', '11:30:00'),
(12, 1, 'activity', 'Thăm Thác Bạc', 'Ngắm nhìn dòng thác đổ trắng xóa từ độ cao 200m.', 'KDL Thác Bạc', '09:00:00', '10:30:00'),
(13, 1, 'activity', 'Viếng chùa Bái Đính', 'Chiêm bái tượng Phật bằng đồng và hành lang La Hán.', 'Chùa Bái Đính', '09:30:00', '11:30:00'),
(14, 1, 'activity', 'Đi thuyền Tràng An', 'Ngồi thuyền nan qua 4-5 hang động tự nhiên.', 'Khu sinh thái Tràng An', '13:30:00', '16:00:00'),
(15, 1, 'activity', 'Leo Hang Múa', 'Check-in trên lưng rồng và ngắm toàn cảnh Tam Cốc.', 'Hang Múa', '16:30:00', '18:00:00'),
(16, 1, 'activity', 'Cổng trời Quản Bạ', 'Ngắm Núi Đôi Cô Tiên từ điểm dừng chân.', 'Cổng trời Quản Bạ', '14:30:00', '15:30:00'),
(17, 1, 'activity', 'Cột cờ Lũng Cú', 'Làm lễ chào cờ tại điểm cực Bắc.', 'Cột cờ Lũng Cú', '09:00:00', '10:30:00'),
(17, 2, 'activity', 'Dinh Thự Họ Vương', 'Khám phá kiến trúc của "Vua Mèo".', 'Dinh thự họ Vương', '14:00:00', '15:30:00'),
(18, 1, 'activity', 'Đèo Mã Pì Lèng', 'Dừng chân chụp ảnh tại mỏm đá tử thần.', 'Đèo Mã Pì Lèng', '08:30:00', '10:00:00'),
(18, 2, 'activity', 'Thuyền Sông Nho Quế', 'Đi thuyền qua hẻm Tu Sản.', 'Sông Nho Quế', '10:30:00', '12:30:00'),
(32, 2, 'activity', 'Lặn ngắm san hô', 'Khám phá hệ sinh thái biển đa dạng.', 'Đảo Hòn Mun', '09:30:00', '11:00:00'),
(33, 1, 'meal', 'Ăn trưa hải sản bè', 'Dùng bữa với các món tôm, mực tươi sống.', 'Làng Chài Nha Trang', '12:00:00', '13:30:00'),
(34, 1, 'activity', 'Thư giãn tắm bùn', 'Ngâm bùn khoáng nóng phục hồi sức khỏe.', 'Đảo Hòn Tằm', '14:30:00', '16:30:00'),
(50, 2, 'activity', 'Dạo Venice thu nhỏ', 'Đi thuyền trên kênh đào và xem show biểu diễn.', 'Grand World Phú Quốc', '16:00:00', '18:30:00'),
(51, 1, 'activity', 'Khám phá Safari', 'Ngồi xe chuyên dụng xem động vật hoang dã.', 'Vinpearl Safari', '09:00:00', '12:00:00'),
(51, 2, 'activity', 'VinWonders vui chơi', 'Trải nghiệm các trò chơi cảm giác mạnh.', 'VinWonders Phú Quốc', '14:00:00', '17:30:00'),
(52, 1, 'activity', 'Thăm Bãi Sao', 'Tắm biển tại bãi cát trắng đẹp nhất đảo.', 'Bãi Sao', '09:00:00', '11:30:00'),
(62, 1, 'activity', 'Thăm Động Huyền Không', 'Khám phá hang động đẹp nhất Ngũ Hành Sơn với ánh sáng tự nhiên.', 'Ngũ Hành Sơn', '15:30:00', '17:00:00'),
(63, 1, 'activity', 'Làng đá Non Nước', 'Xem nghệ nhân chế tác các sản phẩm từ đá cẩm thạch.', 'Làng đá mỹ nghệ', '17:15:00', '18:00:00'),
(64, 1, 'meal', 'Ăn tối Hội An', 'Thưởng thức Cao Lầu và Bánh bao bánh vạc.', 'Phố cổ Hội An', '18:30:00', '19:30:00'),
(64, 2, 'activity', 'Thả đèn hoa đăng', 'Đi thuyền trên sông Hoài và thả đèn cầu may.', 'Sông Hoài', '20:00:00', '21:00:00'),
(65, 1, 'activity', 'Bắt đầu trekking', 'Đi bộ xuyên qua các triền núi từ trung tâm Sapa.', 'Thung lũng Mường Hoa', '08:30:00', '11:30:00'),
(66, 1, 'meal', 'Ăn trưa bản làng', 'Dùng bữa tại nhà dân với các món rau rừng.', 'Bản Lao Chải', '12:00:00', '13:00:00'),
(67, 1, 'activity', 'Trải nghiệm văn hóa Giáy', 'Giao lưu và xem múa sạp cùng người dân bản địa.', 'Bản Tả Van', '19:30:00', '21:00:00'),
(68, 1, 'activity', 'Ngắm Hòn Trống Mái', 'Biểu tượng của Vịnh Hạ Long trên mặt biển.', 'Vịnh Hạ Long', '10:30:00', '11:00:00'),
(69, 1, 'meal', 'Tiệc hải sản trên tàu', 'Ăn trưa trong khi tàu len lỏi qua các đảo đá.', 'Du thuyền', '12:00:00', '13:30:00'),
(70, 1, 'activity', 'Thăm Hang Luồn', 'Trải nghiệm đi đò nan xuyên qua vòm hang.', 'Hang Luồn', '15:00:00', '16:00:00'),
(71, 1, 'activity', 'Lặn bình khí', 'Khám phá thế giới đại dương dưới độ sâu 5-10m.', 'Vịnh San Hô', '09:00:00', '11:00:00'),
(72, 1, 'activity', 'Tiệc rượu nổi', 'Uống vang và ăn trái cây ngay trên mặt biển.', 'Làng Chài', '11:30:00', '12:30:00'),
(73, 1, 'activity', 'Nghỉ dưỡng Hòn Tằm', 'Sử dụng các dịch vụ cao cấp: hồ bơi, ghế nằm.', 'Đảo Hòn Tằm', '14:00:00', '16:00:00'),
(74, 1, 'activity', 'Săn mây cầu gỗ', 'Chụp ảnh với biển mây bồng bềnh lúc bình minh.', 'Cầu gỗ săn mây', '05:00:00', '07:00:00'),
(75, 1, 'activity', 'Check-in Đồi Chè', 'Chụp ảnh với các luống chè xanh mướt và quạt gió.', 'Đồi chè Cầu Đất', '08:00:00', '09:30:00'),
(76, 1, 'activity', 'Vườn thú Chika Farm', 'Chơi đùa cùng lạc đà Alpaca và cừu.', 'Chika Farm', '10:00:00', '11:30:00'),
(77, 1, 'activity', 'Lặn Snorkeling', 'Ngắm san hô bằng kính lặn và ống thở.', 'Quần đảo An Thới', '09:30:00', '11:00:00'),
(78, 1, 'activity', 'Thử tài câu cá', 'Học cách câu cá mú, cá hồng như ngư dân.', 'Trên tàu du lịch', '11:15:00', '12:00:00'),
(79, 1, 'activity', 'Thư giãn Bãi Sao', 'Tự do tắm biển và dạo chơi trên cát trắng.', 'Bãi Sao', '14:30:00', '16:30:00'),
(80, 1, 'activity', 'Thăm Am Tiên', 'Đi xuyên hầm đá để vào lòng hồ xanh ngắt.', 'Động Am Tiên', '09:00:00', '10:30:00'),
(81, 1, 'meal', 'Cơm cháy dê núi', 'Bữa trưa đậm đà bản sắc cố đô.', 'Nhà hàng địa phương', '12:00:00', '13:00:00'),
(82, 1, 'activity', 'Chinh phục Ngọa Long', 'Leo mỏi chân nhưng bù lại là view triệu đô.', 'Núi Múa', '15:30:00', '17:30:00'),
(83, 1, 'activity', 'Xem sa bàn chiến đấu', 'Nghe giới thiệu về sơ đồ địa đạo phức tạp.', 'Khu di tích Bến Dược', '09:30:00', '10:30:00'),
(84, 1, 'activity', 'Chui hầm địa đạo', 'Trải nghiệm cảm giác di chuyển trong lòng đất hẹp.', 'Hầm địa đạo', '10:45:00', '11:45:00'),
(85, 1, 'meal', 'Khoai mì muối mè', 'Thưởng thức món ăn dân dã của chiến sĩ ngày xưa.', 'Bếp Hoàng Cầm', '12:00:00', '12:30:00'),
(86, 1, 'activity', 'Check-in Phố Cáo', 'Chụp ảnh tại thung lũng hoa Tam Giác Mạch.', 'Phố Cáo', '14:00:00', '15:30:00'),
(87, 1, 'activity', 'Phim trường Chuyện của Pao', 'Thăm ngôi nhà trình tường cổ của người Mông.', 'Bản Sủng Là', '09:00:00', '10:30:00'),
(88, 1, 'activity', 'Mã Pì Lèng Panorama', 'Uống cà phê và ngắm nhìn đèo từ vách núi.', 'Mã Pì Lèng', '08:30:00', '10:00:00'),
(89, 1, 'activity', 'Check-in Hải Vân Quan', 'Dừng chân tại ranh giới Đà Nẵng - Huế.', 'Đỉnh đèo Hải Vân', '09:00:00', '10:00:00'),
(90, 1, 'meal', 'Hải sản Lăng Cô', 'Thưởng thức mực nhảy và tôm hùm.', 'Vịnh Lăng Cô', '12:00:00', '13:30:00'),
(91, 1, 'activity', 'Sống ảo đầm Lập An', 'Đi bộ trên con đường cát giữa lòng đầm.', 'Đầm Lập An', '15:00:00', '16:30:00'),
(92, 1, 'activity', 'Viếng Trúc Lâm Phương Nam', 'Tham quan ngôi chùa lớn nhất miền Tây.', 'Thiền viện Trúc Lâm', '09:00:00', '10:30:00'),
(93, 1, 'activity', 'Xem đua heo', 'Trò chơi dân gian vui nhộn tại khu du lịch.', 'Làng Mỹ Khánh', '11:00:00', '11:45:00'),
(94, 1, 'activity', 'Học làm bánh tráng', 'Tự tay tráng bánh và thưởng thức tại chỗ.', 'Lò bánh truyền thống', '14:30:00', '15:30:00'),
(95, 1, 'activity', 'Chèo SUP trên hồ', 'Lướt nhẹ trên mặt nước xanh ngọc tĩnh lặng.', 'Hồ Thang Hen', '15:00:00', '17:00:00'),
(96, 1, 'meal', 'Tiệc nướng BBQ', 'Nướng thịt và rau củ ven hồ.', 'Khu vực cắm trại', '18:30:00', '20:30:00'),
(97, 1, 'activity', 'Núi Thủng (Mắt Thần)', 'Khám phá ngọn núi có lỗ thủng xuyên thấu độc đáo.', 'Núi Mắt Thần', '08:30:00', '10:30:00'),
(98, 1, 'activity', 'Lênh đênh thuyền thúng', 'Đi sâu vào rừng dừa nước bạt ngàn.', 'Rừng dừa Bảy Mẫu', '09:00:00', '10:30:00'),
(99, 1, 'activity', 'Múa thúng chai', 'Xem màn biểu diễn xoay thúng nghệ thuật.', 'Khu vực lòng sông', '10:45:00', '11:15:00'),
(100, 1, 'meal', 'Cơm trưa nhà vườn', 'Ăn trưa trong không gian chòi lá mát mẻ.', 'Nhà hàng sinh thái', '12:00:00', '13:00:00'),
(101, 1, 'activity', 'Khám phá Tháp Chăm', 'Tìm hiểu về lịch sử vương quốc Champa.', 'Tháp Bánh Ít', '08:30:00', '10:00:00'),
(102, 1, 'meal', 'Bún chả cá Quy Nhơn', 'Thưởng thức bún cá, sứa đặc trưng.', 'Quán Ngọc Liên', '11:30:00', '12:30:00'),
(103, 1, 'activity', 'Tháp Đôi', 'Check-in hai tòa tháp song song độc nhất.', 'Tháp Đôi', '14:30:00', '15:30:00'),
(104, 1, 'activity', 'Cano xuyên đèo Cả', 'Ngắm nhìn vách đá đèo Cả từ dưới biển.', 'Cửa biển đèo Cả', '08:30:00', '09:00:00'),
(105, 1, 'meal', 'Nướng hải sản trên đảo', 'Mực, tôm, cá nướng muối ớt.', 'Đảo Hòn Nưa', '12:00:00', '13:30:00'),
(106, 1, 'activity', 'Check-in Hải Đăng nhỏ', 'Leo lên trạm gác đèn trên đảo.', 'Hải đăng Hòn Nưa', '14:30:00', '15:30:00'),
(107, 1, 'activity', 'Cáp treo lên đỉnh', 'Ngắm toàn cảnh Bãi Trước từ cabin.', 'Nhà ga cáp treo', '09:00:00', '09:30:00'),
(108, 1, 'activity', 'Xe trượt núi', 'Cảm giác mạnh với đường trượt Alpine Coaster.', 'Hồ Mây Park', '10:00:00', '11:30:00'),
(109, 1, 'activity', 'Thăm tượng Di Lặc', 'Viếng tượng Phật khổng lồ trên núi.', 'Chùa Hồ Mây', '15:00:00', '16:00:00'),
(110, 1, 'activity', 'Chèo SUP hoàng hôn', 'Hoạt động thư giãn nhất chuyến đi.', 'Hồ Dầu Tiếng', '16:30:00', '17:30:00'),
(111, 1, 'meal', 'Tiệc nướng BBQ đêm', 'Ăn tối và hát hò bên lửa trại.', 'Bãi cắm trại', '19:00:00', '21:00:00'),
(112, 1, 'activity', 'Đón bình minh', 'Nhìn mây bay trên đỉnh núi Bà Đen.', 'Ven hồ', '05:30:00', '07:00:00'),
(113, 1, 'activity', 'Thăm hầm rượu', 'Khám phá quy trình bảo quản rượu vang.', 'Lâu đài Rượu Vang', '10:00:00', '11:00:00'),
(114, 1, 'activity', 'Thử rượu vang', 'Nếm thử 3 loại rượu vang cao cấp.', 'Phòng Tasting', '11:15:00', '12:00:00'),
(115, 1, 'activity', 'Chụp ảnh sân golf', 'Check-in không gian xanh của Sea Links.', 'Sea Links City', '15:00:00', '16:30:00'),
(116, 1, 'activity', 'Cổng làng đá ong', 'Chụp ảnh tại cổng làng cổ nhất VN.', 'Cổng làng Mông Phụ', '09:00:00', '10:00:00'),
(117, 1, 'meal', 'Thịt quay đòn', 'Bữa trưa đặc sản làm thủ công.', 'Nhà cổ ông Huy', '12:00:00', '13:00:00'),
(118, 1, 'activity', 'Đền thờ hai vua', 'Tìm hiểu về Phùng Hưng và Ngô Quyền.', 'Khu di tích Hai Vua', '14:30:00', '15:30:00'),
(119, 1, 'activity', 'Đi thuyền độc mộc', 'Lướt trên mặt hồ bằng thuyền khoét từ thân cây.', 'Bến thuyền Hồ Lắk', '09:00:00', '10:30:00'),
(120, 1, 'meal', 'Chả cá thác lác', 'Thưởng thức món cá đặc sản của hồ.', 'Nhà hàng ven hồ', '12:00:00', '13:00:00'),
(121, 1, 'activity', 'Thăm Buôn Jun', 'Khám phá kiến trúc nhà dài của người M''Nông.', 'Buôn Jun', '14:30:00', '16:00:00');

INSERT IGNORE INTO tour_schedules (
    id, schedule_code, tour_id, departure_at, return_at, status,
    capacity_total, booked_seats,
    adult_price, child_price, infant_price, senior_price,
    booking_open_at, booking_close_at, meeting_point_name, note
) VALUES
(5,'SCH_DN_2026_001',1,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),'open',
30,0,
1500000,1200000,0,1300000,
DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'Sân bay Đà Nẵng','Mang theo giấy tờ tuỳ thân'),
(6,'SCH_HCM_2026_001',2,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'open',20,0,790000,590000,0,700000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),'Dinh Độc Lập','City tour trong ngày'),
(7,'SCH_HL_2026_001',3,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'open',24,0,3800000,2850000,500000,3400000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'Cảng Tuần Châu','Tour du thuyền 5 sao'),
(8,'SCH_SP_2026_001',4,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'open',15,0,2950000,2200000,0,2650000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),'Bến xe Sapa','Chuẩn bị giày leo núi'),
(9,'SCH_NB_2026_001',5,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 5 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 5 DAY),'open',30,0,950000,750000,0,850000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 DAY),'Văn phòng phố cổ HN','Tour khởi hành hàng ngày'),
(10,'SCH_HG_2026_001',6,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 33 DAY),'open',10,0,4500000,3600000,0,4200000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),'Bến xe Hà Giang','Đường đèo khó đi'),
(11,'SCH_HN_2026_001',7,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY),'open',20,0,650000,450000,0,550000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY),'Nhà hát Lớn HN','Mặc đồ lịch sự viếng Lăng'),
(12,'SCH_CB_2026_001',8,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 27 DAY),'open',12,0,3200000,2400000,0,2900000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 24 DAY),'TP Cao Bằng','Mang theo áo ấm'),
(13,'SCH_HUE_2026_001',9,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'open',25,0,800000,600000,0,700000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),'Trung tâm TP Huế','Tour văn hóa lịch sử'),
(14,'SCH_HA_2026_001',10,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),'open',15,0,550000,400000,0,500000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),'Phố cổ Hội An','Tour đi bộ buổi chiều'),
(15,'SCH_NT_2026_001',11,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'open',35,0,750000,550000,0,650000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),'Cảng Nha Trang','Mang theo đồ bơi'),
(16,'SCH_DL_2026_001',12,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'open',20,0,600000,450000,0,550000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),'Chợ Đà Lạt','Thời tiết se lạnh'),
(17,'SCH_PY_2026_001',13,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'open',15,0,850000,650000,0,750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 17 DAY),'TP Tuy Hòa','Cảnh đẹp hoang sơ'),
(18,'SCH_QN_2026_001',14,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'open',25,0,990000,790000,0,890000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),'TP Quy Nhơn','Check-in Kỳ Co'),
(19,'SCH_BMT_2026_001',15,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'open',12,0,3600000,2800000,0,3200000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 27 DAY),'Sân bay Buôn Ma Thuột','Hương vị cafe đại ngàn'),
(20,'SCH_VT_2026_001',16,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 DAY),'open',40,0,500000,350000,0,450000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY),'Bãi Sau Vũng Tàu','Tour nghỉ dưỡng cuối tuần'),
(21,'SCH_PQ_2026_001',17,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),'open',20,0,6800000,5400000,1000000,6000000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),'Sân bay Phú Quốc','Vé bao gồm máy bay'),
(22,'SCH_CT_2026_001',18,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),'open',12,0,450000,350000,0,400000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 DAY),'Bến Ninh Kiều','Đi sớm lúc 5h sáng'),
(23,'SCH_MD_2026_001',19,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'open',10,0,700000,550000,0,650000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),'Phan Thiết','Trải nghiệm xe Jeep'),
(24,'SCH_TN_2026_001',20,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 DAY),'open',30,0,850000,650000,0,750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 5 DAY),'TP Tây Ninh','Hành trình tâm linh'),
(25,'SCH_DN_2026_002',21,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),'open',20,0,500000,400000,0,450000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY),'Đà Nẵng','Tour chiều tối'),
(26,'SCH_SP_2026_002',22,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),'open',8,0,400000,300000,0,350000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY),'Bản Lao Chải','Trekking thực tế'),
(27,'SCH_HL_2026_002',23,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 DAY),'open',45,0,850000,650000,0,750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 DAY),'Tuần Châu','Tour tàu ghép đoàn'),
(28,'SCH_NT_2026_002',24,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY),'open',10,0,1200000,900000,0,1100000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'Cảng Cầu Đá','Cano riêng biệt'),
(29,'SCH_DL_2026_002',25,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY),'open',12,0,450000,350000,0,400000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY),'Trung tâm Đà Lạt','Săn mây sáng sớm'),
(30,'SCH_PQ_2026_002',26,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY),'open',25,0,600000,450000,0,550000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY),'Bãi Sao','Câu cá lặn ngắm san hô'),
(31,'SCH_NB_2026_002',27,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY),'open',20,0,900000,700000,0,800000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY),'Tràng An','Thăm Tuyệt Tình Cốc'),
(32,'SCH_HCM_2026_002',28,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY),'open',30,0,450000,350000,0,400000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY),'TP.HCM','Thăm địa đạo'),
(33,'SCH_HG_2026_002',29,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 43 DAY),'open',15,0,3800000,3000000,0,3500000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),'Đồng Văn','Mùa hoa tam giác mạch'),
(34,'SCH_HUE_2026_002',30,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY),'open',15,0,950000,750000,0,850000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY),'TP Huế','Qua đèo Hải Vân'),
(35,'SCH_CT_2026_002',31,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 23 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 23 DAY),'open',40,0,550000,450000,0,500000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY),'Cần Thơ','Tour vườn trái cây'),
(36,'SCH_CB_2026_002',32,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 27 DAY),'open',10,0,2200000,1800000,0,2000000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY),'Hồ Thang Hen','Cắm trại ven hồ'),
(37,'SCH_HA_2026_002',33,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY),'open',20,0,400000,300000,0,350000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 29 DAY),'Rừng dừa','Múa thúng chai'),
(38,'SCH_QN_2026_002',34,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY),'open',15,0,450000,350000,0,400000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 31 DAY),'Quy Nhơn','Thăm tháp cổ'),
(39,'SCH_PY_2026_002',35,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY),'open',12,0,1100000,850000,0,1000000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 33 DAY),'Đèo Cả','Đảo Hòn Nưa'),
(40,'SCH_VT_2026_002',36,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY),'open',20,0,850000,650000,0,750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY),'Hồ Mây','Vé cáp treo trọn gói'),
(41,'SCH_TN_2026_002',37,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 39 DAY),'open',15,0,1200000,950000,0,1100000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 37 DAY),'Hồ Dầu Tiếng','Cắm trại Camping'),
(42,'SCH_MD_2026_002',38,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY),'open',15,0,600000,450000,0,550000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 39 DAY),'Mũi Né','Thăm lâu đài rượu'),
(43,'SCH_HN_2026_002',39,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY),'open',10,0,750000,550000,0,650000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 41 DAY),'Sơn Tây','Làng cổ Đường Lâm'),
(44,'SCH_BMT_2026_002',40,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY),DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY),'open',15,0,800000,600000,0,700000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 44 DAY),'Hồ Lắk','Thuyền độc mộc');

INSERT IGNORE INTO tour_schedule_pickup_points (
    schedule_id, point_name, address, latitude, longitude, pickup_at, sort_order
) VALUES
(5,'Điểm đón trung tâm','Hải Châu, Đà Nẵng',16.06778,108.22083,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY),0),
(6, 'Văn phòng Quận 1', '235 Nguyễn Văn Cừ, Quận 1, TP.HCM', 10.7624, 106.6812, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY), 0),
(6, 'Sân bay Tân Sơn Nhất', 'Cột số 12, Ga quốc nội', 10.8185, 106.6588, DATE_ADD(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY), INTERVAL 30 MINUTE), 1),
(7, 'Nhà hát Lớn Hà Nội', '01 Tràng Tiền, Hoàn Kiếm, Hà Nội', 21.0242, 105.8556, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY), 0),
(7, 'Cảng tàu Tuần Châu', 'Phường Tuần Châu, Hạ Long', 20.9324, 107.0145, DATE_ADD(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY), INTERVAL 3 HOUR), 1),
(8, 'Bến xe Mỹ Đình', '20 Phạm Hùng, Nam Từ Liêm, Hà Nội', 21.0285, 105.7783, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY), 0),
(8, 'Bến xe Sapa', 'Thị xã Sapa, Lào Cai', 22.3364, 103.8438, DATE_ADD(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 DAY), INTERVAL 6 HOUR), 1),
(9, 'Phố Cổ Hà Nội', 'Hàng Bông, Hoàn Kiếm, Hà Nội', 21.0306, 105.8475, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 5 DAY), 0),
(10, 'Bến xe Mỹ Đình', '20 Phạm Hùng, Hà Nội', 21.0285, 105.7783, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY), 0),
(10, 'Km0 Hà Giang', 'Nguyễn Trãi, TP. Hà Giang', 22.8233, 104.9836, DATE_ADD(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY), INTERVAL 7 HOUR), 1),
(11, 'Văn phòng đại diện', '55 Hàng Gai, Hoàn Kiếm, Hà Nội', 21.0333, 105.8500, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY), 0),
(12, 'Bến xe Gia Lâm', 'Số 9 Ngô Gia Khảm, Hà Nội', 21.0451, 105.8791, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 DAY), 0),
(13, 'Sân bay Phú Bài', 'Khu 8, Phú Bài, Hương Thủy, Thừa Thiên Huế', 16.4017, 107.7032, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY), 0),
(14, 'Cổng Phố Cổ', '01 Hoàng Diệu, Hội An', 15.8773, 108.3323, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 8 DAY), 0),
(15, 'Cảng Cầu Đá', 'Vĩnh Nguyên, Nha Trang', 12.2154, 109.2136, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 14 DAY), 0),
(16, 'Chợ Đà Lạt', 'Phường 1, TP. Đà Lạt', 11.9427, 108.4382, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY), 0),
(17, 'Ga Tuy Hòa', '27 Anh Hùng, Tuy Hòa', 13.0906, 109.3039, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 18 DAY), 0),
(18, 'Quảng trường Quy Nhơn', 'Lý Thường Kiệt, Quy Nhơn', 13.7744, 109.2275, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 22 DAY), 0),
(19, 'Sân bay Buôn Ma Thuột', 'Hòa Thắng, TP. Buôn Ma Thuột', 12.6681, 108.1189, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 28 DAY), 0),
(20, 'Bến xe miền Đông', 'Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM', 10.8129, 106.7119, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 3 DAY), 0),
(21, 'Sân bay Phú Quốc', 'Dương Tơ, Phú Quốc', 10.1691, 103.9936, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 DAY), 0),
(22, 'Bến Ninh Kiều', 'Hai Bà Trưng, Tân An, Cần Thơ', 10.0345, 105.7891, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 DAY), 0),
(23, 'Văn phòng Phạm Ngũ Lão', '201 Phạm Ngũ Lão, Quận 1, TP.HCM', 10.7686, 106.6917, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 DAY), 0),
(24, 'Ga cáp treo núi Bà Đen', 'Thạnh Tân, Tây Ninh', 11.3725, 106.1265, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 6 DAY), 0),
(25, 'Vòng quay Mặt Trời', 'Đường Phan Đăng Lưu, Đà Nẵng', 16.0397, 108.2251, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 9 DAY), 0),
(26, 'Nhà thờ Đá Sapa', 'Thị xã Sapa', 22.3351, 103.8427, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 DAY), 0),
(27, 'Bến tàu Bãi Cháy', 'Hạ Long, Quảng Ninh', 20.9594, 107.0375, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 DAY), 0),
(28, 'Khách sạn trung tâm', 'Trần Phú, Nha Trang', 12.2389, 109.1961, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 11 DAY), 0),
(29, 'Văn phòng trung tâm', 'Phan Bội Châu, Đà Lạt', 11.9429, 108.4371, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 13 DAY), 0),
(30, 'Cảng An Thới', 'Nam Đảo Phú Quốc', 10.0076, 104.0151, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 16 DAY), 0),
(31, 'KDL Tràng An', 'Tràng An, Ninh Bình', 20.2522, 105.8972, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 19 DAY), 0),
(32, 'Bảo tàng Chứng tích Chiến tranh', 'Quận 3, TP.HCM', 10.7794, 106.6921, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 21 DAY), 0),
(33, 'Phố cổ Đồng Văn', 'Đồng Văn, Hà Giang', 23.2789, 105.3611, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY), 0),
(34, 'Cửa Ngọ Môn', 'Đại Nội Huế', 16.4678, 107.5786, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 DAY), 0),
(35, 'Làng du lịch Mỹ Khánh', 'Phong Điền, Cần Thơ', 10.0017, 105.7051, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 23 DAY), 0),
(36, 'Hồ Thang Hen', 'Trà Lĩnh, Cao Bằng', 22.7561, 106.2885, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 26 DAY), 0),
(37, 'Rừng dừa Bảy Mẫu', 'Cẩm Thanh, Hội An', 15.8642, 108.3611, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY), 0),
(38, 'Tháp Bánh Ít', 'Tuy Phước, Bình Định', 13.8644, 109.1306, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 32 DAY), 0),
(39, 'Hải đăng Đại Lãnh', 'Hòa Tâm, Đông Hòa, Phú Yên', 12.8967, 109.4551, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 34 DAY), 0),
(40, 'Tượng Chúa Kitô', 'Núi Nhỏ, Vũng Tàu', 10.3236, 107.0842, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 36 DAY), 0),
(41, 'Hồ Dầu Tiếng', 'Tây Ninh', 11.3651, 106.3406, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 38 DAY), 0),
(42, 'Đồi Cát Bay', 'Mũi Né, Phan Thiết', 10.9451, 108.2831, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 DAY), 0),
(43, 'Làng cổ Đường Lâm', 'Sơn Tây, Hà Nội', 21.0772, 105.4751, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 42 DAY), 0),
(44, 'Buôn Jun', 'Hồ Lắk, Đắk Lắk', 12.4331, 108.1831, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 DAY), 0);

INSERT IGNORE INTO tour_schedule_guides (id, schedule_id, guide_id, guide_role, assigned_at)
VALUES (1,5,1,'main',CURRENT_TIMESTAMP),
(2, 6, 2, 'main', CURRENT_TIMESTAMP),
(3, 7, 3, 'main', CURRENT_TIMESTAMP),
(4, 7, 4, 'support', CURRENT_TIMESTAMP), -- Tour Hạ Long cần thêm hỗ trợ
(5, 8, 5, 'main', CURRENT_TIMESTAMP),
(6, 9, 6, 'main', CURRENT_TIMESTAMP),
(7, 10, 7, 'main', CURRENT_TIMESTAMP),
(8, 10, 8, 'support', CURRENT_TIMESTAMP), -- Tour Hà Giang cần 2 người vì đường khó
(9, 11, 9, 'main', CURRENT_TIMESTAMP),
(10, 12, 10, 'main', CURRENT_TIMESTAMP),
(11, 13, 11, 'main', CURRENT_TIMESTAMP),
(12, 14, 12, 'main', CURRENT_TIMESTAMP),
(13, 15, 13, 'main', CURRENT_TIMESTAMP),
(14, 16, 14, 'main', CURRENT_TIMESTAMP),
(15, 17, 15, 'main', CURRENT_TIMESTAMP),
(16, 18, 16, 'main', CURRENT_TIMESTAMP),
(17, 19, 17, 'main', CURRENT_TIMESTAMP),
(18, 20, 18, 'main', CURRENT_TIMESTAMP),
(19, 21, 19, 'main', CURRENT_TIMESTAMP),
(20, 21, 20, 'support', CURRENT_TIMESTAMP), -- Tour Phú Quốc đoàn đông
(21, 22, 21, 'main', CURRENT_TIMESTAMP),
(22, 23, 1, 'main', CURRENT_TIMESTAMP), -- Quay vòng về Guide 1
(23, 24, 2, 'main', CURRENT_TIMESTAMP),
(24, 25, 3, 'main', CURRENT_TIMESTAMP),
(25, 26, 4, 'main', CURRENT_TIMESTAMP),
(26, 27, 5, 'main', CURRENT_TIMESTAMP),
(27, 28, 6, 'main', CURRENT_TIMESTAMP),
(28, 29, 7, 'main', CURRENT_TIMESTAMP),
(29, 30, 8, 'main', CURRENT_TIMESTAMP),
(30, 31, 9, 'main', CURRENT_TIMESTAMP),
(31, 32, 10, 'main', CURRENT_TIMESTAMP),
(32, 33, 11, 'main', CURRENT_TIMESTAMP),
(33, 33, 12, 'support', CURRENT_TIMESTAMP), -- Mùa hoa Tam Giác Mạch tăng cường
(34, 34, 13, 'main', CURRENT_TIMESTAMP),
(35, 35, 14, 'main', CURRENT_TIMESTAMP),
(36, 36, 15, 'main', CURRENT_TIMESTAMP),
(37, 37, 16, 'main', CURRENT_TIMESTAMP),
(38, 38, 17, 'main', CURRENT_TIMESTAMP),
(39, 39, 18, 'main', CURRENT_TIMESTAMP),
(40, 40, 19, 'main', CURRENT_TIMESTAMP),
(41, 41, 20, 'main', CURRENT_TIMESTAMP),
(42, 42, 21, 'main', CURRENT_TIMESTAMP),
(43, 43, 1, 'main', CURRENT_TIMESTAMP),
(44, 44, 2, 'main', CURRENT_TIMESTAMP);

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

INSERT IGNORE INTO products (
    id, sku, name, description, product_type, unit_price, is_active
) VALUES
(1,'SIM-4G-01','SIM 4G du lịch','SIM data sử dụng trong 7 ngày','service',150000,TRUE),
(2, 'ACC-WATER-01', 'Nước suối Aquafina 500ml', 'Nước uống tinh khiết đóng chai.', 'physical', 10000, TRUE),
(3, 'ACC-RAIN-01', 'Áo mưa nilon tiện lợi', 'Áo mưa dùng một lần, gọn nhẹ.', 'physical', 15000, TRUE),
(4, 'ACC-RAIN-02', 'Áo mưa cánh dơi cao cấp', 'Chất liệu vải dù, bền bỉ.', 'physical', 85000, TRUE),
(5, 'ACC-SUN-01', 'Kem chống nắng Sunplay', 'Chỉ số SPF 50+, bảo vệ da tối ưu.', 'physical', 120000, TRUE),
(6, 'ACC-HAT-01', 'Mũ lưỡi trai du lịch', 'Chất liệu vải thun thoáng mát.', 'physical', 75000, TRUE),
(7, 'ACC-HAT-02', 'Nón lá truyền thống', 'Đan tay thủ công, quà tặng đặc trưng VN.', 'physical', 50000, TRUE),
(8, 'ACC-PB-01', 'Sạc dự phòng 10.000mAh', 'Hỗ trợ sạc nhanh cho điện thoại.', 'physical', 350000, TRUE),
(9, 'ACC-ADAPT-01', 'Củ sạc đa năng (Universal)', 'Dùng được cho nhiều chuẩn ổ cắm.', 'physical', 150000, TRUE),
(10, 'ACC-BAG-01', 'Túi chống nước điện thoại', 'Bảo vệ thiết bị khi tắm biển/chèo kayak.', 'physical', 45000, TRUE),
(11, 'ACC-FAN-01', 'Quạt cầm tay mini', 'Sạc USB, nhỏ gọn cho mùa hè.', 'physical', 120000, TRUE),
(12, 'FOOD-SNACK-01', 'Hạt điều rang muối 250g', 'Đặc sản Bình Phước, giòn rụm.', 'physical', 115000, TRUE),
(13, 'FOOD-SNACK-02', 'Khô gà lá chanh 200g', 'Mồi nhắm tiện lợi khi đi xe.', 'physical', 85000, TRUE),
(14, 'FOOD-TEA-01', 'Trà Thái Nguyên thượng hạng', 'Hộp thiếc 100g sang trọng.', 'physical', 150000, TRUE),
(15, 'FOOD-COFFEE-01', 'Cà phê hạt rang xay 500g', 'Robusta & Arabica nguyên chất.', 'physical', 220000, TRUE),
(16, 'GIFT-SHIRT-01', 'Áo thun "I Love VN"', 'Chất liệu cotton, nhiều size.', 'physical', 120000, TRUE),
(17, 'GIFT-SHIRT-02', 'Áo cờ đỏ sao vàng', 'Sử dụng cho các tour chụp ảnh check-in.', 'physical', 95000, TRUE),
(18, 'GIFT-MAG-01', 'Magnet kỷ niệm địa danh', 'Nam châm gắn tủ lạnh in hình 3D.', 'physical', 35000, TRUE),
(19, 'FOOD-SWEET-01', 'Bánh đậu xanh Hải Dương', 'Hộp quà tặng truyền thống.', 'physical', 65000, TRUE),
(20, 'FOOD-SWEET-02', 'Kẹo dừa Bến Tre', 'Đặc sản miền Tây chính gốc.', 'physical', 45000, TRUE),
(21, 'SRV-INS-01', 'Bảo hiểm du lịch cơ bản', 'Mức bồi thường tối đa 20.000.000đ.', 'service', 50000, TRUE),
(22, 'SRV-INS-02', 'Bảo hiểm du lịch cao cấp', 'Mức bồi thường tối đa 50.000.000đ.', 'service', 120000, TRUE),
(23, 'SRV-PICK-01', 'Đón sân bay bằng xe 4 chỗ', 'Đón tận nơi, đúng giờ.', 'service', 350000, TRUE),
(24, 'SRV-PICK-02', 'Đón sân bay bằng xe 7 chỗ', 'Phù hợp cho nhóm gia đình.', 'service', 450000, TRUE),
(25, 'SRV-GUIDE-01', 'Thuê HDV tiếng Anh 1 ngày', 'Dành cho khách lẻ/khách quốc tế.', 'service', 800000, TRUE),
(26, 'SRV-PHOTO-01', 'Gói chụp ảnh cơ bản', '1 tiếng chụp hình tại điểm tham quan.', 'service', 500000, TRUE),
(27, 'SRV-WIFI-01', 'Thuê bộ phát Wifi di động', 'Data không giới hạn, dùng cho 5 máy.', 'service', 80000, TRUE),
(28, 'SRV-BIKE-01', 'Thuê xe máy 1 ngày', 'Bao gồm 2 mũ bảo hiểm.', 'service', 150000, TRUE),
(29, 'ACC-UMB-01', 'Ô (Dù) gấp gọn', 'Chống tia UV, khung xương chắc chắn.', 'physical', 135000, TRUE),
(30, 'ACC-PILL-01', 'Gối cổ chữ U', 'Chất liệu cao su non, đi xe đường dài.', 'physical', 180000, TRUE),
(31, 'ACC-EYE-01', 'Bịt mắt ngủ', 'Giúp nghỉ ngơi trên xe/máy bay.', 'physical', 25000, TRUE),
(32, 'ACC-EAR-01', 'Nút bịt tai chống ồn', 'Giảm áp suất khi đi máy bay.', 'physical', 15000, TRUE),
(33, 'ACC-SAN-01', 'Gel rửa tay khô 50ml', 'Diệt khuẩn nhanh không cần dùng nước.', 'physical', 30000, TRUE),
(34, 'ACC-TISSUE-01', 'Khăn giấy ướt (gói 20 tờ)', 'Tiện lợi vệ sinh cá nhân.', 'physical', 15000, TRUE),
(35, 'GIFT-POST-01', 'Bộ Bưu thiếp VN (10 tấm)', 'Hình ảnh danh lam thắng cảnh đẹp.', 'physical', 80000, TRUE),
(36, 'FOOD-FRUIT-01', 'Trái cây sấy dẻo 150g', 'Xoài, mít, chuối sấy tổng hợp.', 'physical', 75000, TRUE),
(37, 'SRV-TRANS-01', 'Dịch thuật tài liệu', 'Hỗ trợ dịch hồ sơ visa.', 'service', 200000, TRUE),
(38, 'ACC-BATT-01', 'Bộ pin tiểu AA (4 viên)', 'Dùng cho đèn pin/máy ảnh.', 'physical', 40000, TRUE),
(39, 'ACC-FLAS-01', 'Đèn pin cầm tay siêu sáng', 'Dành cho khách đi tour trekking/camping.', 'physical', 250000, TRUE),
(40, 'SRV-SIM-02', 'eSIM du lịch toàn cầu', 'Sử dụng dữ liệu tại hơn 50 quốc gia.', 'service', 550000, TRUE);

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
(2,2,'all_year',1,12,4.2,'Đi được quanh năm.'),
(3,3,'summer_peak',4,10,4.9,'Mùa biển đẹp nhất, nắng vàng rực rỡ.'),
(4,4,'cloud_hunting',9,11,4.7,'Mùa lúa chín vàng và săn mây cực đỉnh.'),
(5,5,'spring_festival',1,3,4.5,'Tiết trời xuân mát mẻ, phù hợp đi lễ chùa.'),
(6,6,'flower_season',10,12,4.9,'Mùa hoa tam giác mạch nở rộ khắp cao nguyên.'),
(7,7,'autumn_vibe',8,11,4.8,'Hà Nội mùa thu là đẹp nhất trong năm.'),
(8,8,'waterfall_peak',8,10,4.6,'Thác Bản Giốc nhiều nước, hùng vĩ nhất.'),
(9,9,'heritage_season',1,5,4.4,'Trời mát, ít mưa, tiện tham quan di tích.'),
(10,10,'lantern_festival',1,8,4.7,'Mùa khô ráo, phố cổ lung linh nắng.'),
(11,11,'beach_season',2,8,4.9,'Biển trong xanh, lặng sóng, lặn ngắm san hô tốt.'),
(12,12,'dry_season',11,4,4.8,'Mùa hoa dã quỳ và mai anh đào.'),
(13,13,'golden_grass',1,7,4.5,'Mùa cỏ xanh và nắng vàng duyên hải.'),
(14,14,'sea_exploration',3,9,4.7,'Biển Kỳ Co vào mùa đẹp nhất.'),
(15,15,'coffee_harvest',11,3,4.3,'Mùa thu hoạch cafe và hội đua voi.'),
(16,16,'weekend_getaway',1,12,4.0,'Đi được quanh năm, thích hợp cuối tuần.'),
(17,17,'dry_season',11,4,5.0,'Mùa vàng của Phú Quốc, biển lặng như gương.'),
(18,18,'fruit_season',5,9,4.6,'Mùa trái cây chín rộ tại các miệt vườn.'),
(19,19,'sand_dune_season',11,5,4.7,'Tránh mùa mưa để trượt cát và đi xe Jeep.'),
(20,20,'pilgrimage_season',1,3,4.9,'Tháng Giêng là mùa lễ hội núi Bà lớn nhất.'),
(21,21,'night_tour',3,9,4.4,'Hội An về đêm mùa khô rất thoáng đãng.'),
(22,22,'trekking_season',9,11,4.6,'Tránh mùa mưa trơn trượt khi trekking bản.'),
(23,23,'daily_cruise',4,10,4.2,'Tour ngắn ngày đi mùa hè là hợp lý nhất.'),
(24,24,'vip_snorkeling',2,8,4.8,'Cano đi biển mùa này cực kỳ êm.'),
(25,25,'early_morning',12,3,4.9,'Thời điểm săn mây cầu gỗ dễ gặp nhất.'),
(26,26,'fishing_season',11,4,4.5,'Biển Nam đảo lặng, dễ câu được nhiều cá.'),
(27,27,'ancient_valley',1,4,4.4,'Mùa rêu phong và nước trong xanh ở Am Tiên.'),
(28,28,'history_exploration',11,5,4.1,'Tránh mùa mưa khi xuống địa đạo.'),
(29,29,'buckwheat_flower',10,12,5.0,'Đặc sản hoa Tam Giác Mạch chỉ có mùa này.'),
(30,30,'bay_view',2,7,4.6,'Ngắm đầm Lập An lúc nắng đẹp nhất.'),
(31,31,'garden_experience',6,8,4.3,'Trải nghiệm làm nông dân mùa trái cây.'),
(32,32,'camping_vibe',10,4,4.7,'Trời lạnh, đốt lửa trại ven hồ cực chill.'),
(33,33,'basket_boat',2,9,4.5,'Rừng dừa mát mẻ, xem múa thúng vui nhất.'),
(34,34,'champa_culture',1,8,4.0,'Tham quan tháp cổ vào mùa khô ráo.'),
(35,35,'island_camping',3,8,4.8,'Đảo Hòn Nưa mùa này nước xanh ngắt.'),
(36,36,'family_fun',1,12,4.2,'KDL Hồ Mây phục vụ quanh năm.'),
(37,37,'sunset_camping',12,4,4.9,'Ngắm hoàng hôn hồ Dầu Tiếng không bị mưa.'),
(38,38,'wine_tasting',1,12,4.0,'Trải nghiệm trong nhà, không phụ thuộc thời tiết.'),
(39,39,'ancient_village',1,12,4.3,'Không gian làng cổ đẹp cả 4 mùa.'),
(40,40,'lake_sunset',11,4,4.6,'Ngắm hoàng hôn trên hồ Lắk mùa khô.');

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

-- ============================================================
-- Destination hierarchy: châu lục → quốc gia → địa danh (seed)
-- Thêm nút meta (id 84–89: lục địa, id 100–142: quốc gia), gán parent cho 1–83.
-- ============================================================

INSERT IGNORE INTO destinations (
    id, uuid, code, name, slug, country_code, province, district, region, address,
    latitude, longitude, short_description, description, best_time_from_month, best_time_to_month,
    crowd_level_default, is_featured, is_active, status, proposed_by, verified_by, is_official,
    parent_id, destination_level, destination_path
) VALUES
(84, 'c0000001-0000-4000-8000-000000000084', 'CONT_AS', 'Châu Á', 'continent-asia', 'ZZ', 'Meta', '', 'Asia', '', 20.0000000, 100.0000000, 'Lục địa Á', 'Nhóm điểm đến châu Á (seed phân cấp).', 1, 12, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, NULL, 0, '/'),
(85, 'c0000001-0000-4000-8000-000000000085', 'CONT_EU', 'Châu Âu', 'continent-europe', 'ZZ', 'Meta', '', 'Europe', '', 50.0000000, 10.0000000, 'Lục địa Âu', 'Nhóm điểm đến châu Âu (seed phân cấp).', 5, 9, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, NULL, 0, '/'),
(86, 'c0000001-0000-4000-8000-000000000086', 'CONT_NA', 'Châu Mỹ (Bắc)', 'continent-north-america', 'ZZ', 'Meta', '', 'North America', '', 40.0000000, -100.0000000, 'Bắc Mỹ', 'Nhóm điểm đến Bắc Mỹ.', 4, 10, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, NULL, 0, '/'),
(87, 'c0000001-0000-4000-8000-000000000087', 'CONT_SA', 'Châu Mỹ (Nam)', 'continent-south-america', 'ZZ', 'Meta', '', 'South America', '', -15.0000000, -60.0000000, 'Nam Mỹ', 'Nhóm điểm đến Nam Mỹ.', 11, 3, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, NULL, 0, '/'),
(88, 'c0000001-0000-4000-8000-000000000088', 'CONT_OC', 'Châu Đại Dương', 'continent-oceania', 'ZZ', 'Meta', '', 'Oceania', '', -25.0000000, 140.0000000, 'Đại Dương', 'Úc, New Zealand và vùng lân cận.', 9, 11, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, NULL, 0, '/'),
(89, 'c0000001-0000-4000-8000-000000000089', 'CONT_AF', 'Châu Phi', 'continent-africa', 'ZZ', 'Meta', '', 'Africa', '', 0.0000000, 20.0000000, 'Châu Phi', 'Nhóm điểm đến châu Phi.', 10, 4, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, NULL, 0, '/'),

(100, 'c0000002-0000-4000-8000-000000000100', 'CNT_VN', 'Việt Nam', 'country-vietnam', 'VN', 'Việt Nam', '', 'Asia', '', 16.0000000, 106.0000000, 'Quốc gia', 'Các thành phố/tỉnh du lịch Việt Nam trong seed.', 1, 12, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(101, 'c0000002-0000-4000-8000-000000000101', 'CNT_KR', 'Hàn Quốc', 'country-south-korea', 'KR', 'Hàn Quốc', '', 'East Asia', '', 37.5000000, 127.9000000, 'Quốc gia', 'Seed hierarchy.', 4, 11, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(102, 'c0000002-0000-4000-8000-000000000102', 'CNT_JP', 'Nhật Bản', 'country-japan', 'JP', 'Nhật Bản', '', 'East Asia', '', 36.0000000, 138.0000000, 'Quốc gia', 'Seed hierarchy.', 3, 11, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(103, 'c0000002-0000-4000-8000-000000000103', 'CNT_TH', 'Thái Lan', 'country-thailand', 'TH', 'Thái Lan', '', 'Southeast Asia', '', 13.7000000, 100.5000000, 'Quốc gia', 'Seed hierarchy.', 11, 2, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(104, 'c0000002-0000-4000-8000-000000000104', 'CNT_SG', 'Singapore', 'country-singapore', 'SG', 'Singapore', '', 'Southeast Asia', '', 1.3500000, 103.8200000, 'Quốc gia', 'Seed hierarchy.', 1, 12, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(105, 'c0000002-0000-4000-8000-000000000105', 'CNT_MY', 'Malaysia', 'country-malaysia', 'MY', 'Malaysia', '', 'Southeast Asia', '', 3.1000000, 101.7000000, 'Quốc gia', 'Seed hierarchy.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(106, 'c0000002-0000-4000-8000-000000000106', 'CNT_TW', 'Đài Loan', 'country-taiwan', 'TW', 'Đài Loan', '', 'East Asia', '', 23.7000000, 121.0000000, 'Quốc gia', 'Seed hierarchy.', 10, 12, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(107, 'c0000002-0000-4000-8000-000000000107', 'CNT_ID', 'Indonesia', 'country-indonesia', 'ID', 'Indonesia', '', 'Southeast Asia', '', -2.5000000, 118.0000000, 'Quốc gia', 'Seed hierarchy.', 4, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(108, 'c0000002-0000-4000-8000-000000000108', 'CNT_HK', 'Hồng Kông', 'country-hong-kong', 'HK', 'Hồng Kông', '', 'East Asia', '', 22.3000000, 114.2000000, 'Đặc khu', 'Seed hierarchy.', 10, 12, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(109, 'c0000002-0000-4000-8000-000000000109', 'CNT_KH', 'Campuchia', 'country-cambodia', 'KH', 'Campuchia', '', 'Southeast Asia', '', 13.4000000, 104.5000000, 'Quốc gia', 'Seed hierarchy.', 11, 2, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(110, 'c0000002-0000-4000-8000-000000000110', 'CNT_LA', 'Lào', 'country-laos', 'LA', 'Lào', '', 'Southeast Asia', '', 19.9000000, 102.6000000, 'Quốc gia', 'Seed hierarchy.', 11, 3, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(111, 'c0000002-0000-4000-8000-000000000111', 'CNT_CN', 'Trung Quốc', 'country-china', 'CN', 'Trung Quốc', '', 'East Asia', '', 35.0000000, 105.0000000, 'Quốc gia', 'Seed hierarchy.', 4, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(112, 'c0000002-0000-4000-8000-000000000112', 'CNT_IN', 'Ấn Độ', 'country-india', 'IN', 'Ấn Độ', '', 'South Asia', '', 22.5000000, 79.0000000, 'Quốc gia', 'Seed hierarchy.', 10, 3, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(113, 'c0000002-0000-4000-8000-000000000113', 'CNT_MV', 'Maldives', 'country-maldives', 'MV', 'Maldives', '', 'South Asia', '', 3.2000000, 73.2000000, 'Quốc gia', 'Seed hierarchy.', 11, 4, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(114, 'c0000002-0000-4000-8000-000000000114', 'CNT_AE', 'Các tiểu vương quốc Ả Rập', 'country-uae', 'AE', 'UAE', '', 'Middle East', '', 24.0000000, 54.0000000, 'Quốc gia', 'Seed hierarchy.', 11, 3, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(115, 'c0000002-0000-4000-8000-000000000115', 'CNT_QA', 'Qatar', 'country-qatar', 'QA', 'Qatar', '', 'Middle East', '', 25.3000000, 51.5000000, 'Quốc gia', 'Seed hierarchy.', 11, 3, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(116, 'c0000002-0000-4000-8000-000000000116', 'CNT_FR', 'Pháp', 'country-france', 'FR', 'Pháp', '', 'Europe', '', 46.0000000, 2.0000000, 'Quốc gia', 'Seed hierarchy.', 5, 9, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(117, 'c0000002-0000-4000-8000-000000000117', 'CNT_IT', 'Ý', 'country-italy', 'IT', 'Ý', '', 'Europe', '', 42.0000000, 12.5000000, 'Quốc gia', 'Seed hierarchy.', 4, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(118, 'c0000002-0000-4000-8000-000000000118', 'CNT_GB', 'Vương quốc Anh', 'country-united-kingdom', 'GB', 'Anh', '', 'Europe', '', 51.5000000, -0.1000000, 'Quốc gia', 'Seed hierarchy.', 6, 8, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(119, 'c0000002-0000-4000-8000-000000000119', 'CNT_NL', 'Hà Lan', 'country-netherlands', 'NL', 'Hà Lan', '', 'Europe', '', 52.3000000, 5.3000000, 'Quốc gia', 'Seed hierarchy.', 4, 5, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(120, 'c0000002-0000-4000-8000-000000000120', 'CNT_ES', 'Tây Ban Nha', 'country-spain', 'ES', 'Tây Ban Nha', '', 'Europe', '', 40.4000000, -3.7000000, 'Quốc gia', 'Seed hierarchy.', 4, 10, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(121, 'c0000002-0000-4000-8000-000000000121', 'CNT_DE', 'Đức', 'country-germany', 'DE', 'Đức', '', 'Europe', '', 51.2000000, 10.4000000, 'Quốc gia', 'Seed hierarchy.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(122, 'c0000002-0000-4000-8000-000000000122', 'CNT_CZ', 'Séc', 'country-czech-republic', 'CZ', 'Séc', '', 'Europe', '', 50.0000000, 15.4000000, 'Quốc gia', 'Seed hierarchy.', 5, 9, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(123, 'c0000002-0000-4000-8000-000000000123', 'CNT_AT', 'Áo', 'country-austria', 'AT', 'Áo', '', 'Europe', '', 47.5000000, 14.5000000, 'Quốc gia', 'Seed hierarchy.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(124, 'c0000002-0000-4000-8000-000000000124', 'CNT_CH', 'Thụy Sĩ', 'country-switzerland', 'CH', 'Thụy Sĩ', '', 'Europe', '', 46.8000000, 8.2000000, 'Quốc gia', 'Seed hierarchy.', 6, 8, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(125, 'c0000002-0000-4000-8000-000000000125', 'CNT_GR', 'Hy Lạp', 'country-greece', 'GR', 'Hy Lạp', '', 'Europe', '', 39.0000000, 22.0000000, 'Quốc gia', 'Seed hierarchy.', 5, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(126, 'c0000002-0000-4000-8000-000000000126', 'CNT_TR', 'Thổ Nhĩ Kỳ', 'country-turkey', 'TR', 'Thổ Nhĩ Kỳ', '', 'West Asia', '', 39.0000000, 35.0000000, 'Quốc gia', 'Seed hierarchy (gán châu Á).', 4, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 84, 0, '/'),
(127, 'c0000002-0000-4000-8000-000000000127', 'CNT_PT', 'Bồ Đào Nha', 'country-portugal', 'PT', 'Bồ Đào Nha', '', 'Europe', '', 39.5000000, -8.0000000, 'Quốc gia', 'Seed hierarchy.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(128, 'c0000002-0000-4000-8000-000000000128', 'CNT_FI', 'Phần Lan', 'country-finland', 'FI', 'Phần Lan', '', 'Europe', '', 61.9000000, 25.7000000, 'Quốc gia', 'Seed hierarchy.', 6, 8, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(129, 'c0000002-0000-4000-8000-000000000129', 'CNT_DK', 'Đan Mạch', 'country-denmark', 'DK', 'Đan Mạch', '', 'Europe', '', 56.0000000, 10.0000000, 'Quốc gia', 'Seed hierarchy.', 5, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(130, 'c0000002-0000-4000-8000-000000000130', 'CNT_NO', 'Na Uy', 'country-norway', 'NO', 'Na Uy', '', 'Europe', '', 60.4000000, 8.5000000, 'Quốc gia', 'Seed hierarchy.', 6, 8, 'low', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(131, 'c0000002-0000-4000-8000-000000000131', 'CNT_IS', 'Iceland', 'country-iceland', 'IS', 'Iceland', '', 'Europe', '', 64.1000000, -21.9000000, 'Quốc gia', 'Seed hierarchy.', 6, 8, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 85, 0, '/'),
(132, 'c0000002-0000-4000-8000-000000000132', 'CNT_US', 'Hoa Kỳ', 'country-united-states', 'US', 'Hoa Kỳ', '', 'North America', '', 39.0000000, -98.0000000, 'Quốc gia', 'Seed hierarchy.', 4, 10, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 86, 0, '/'),
(133, 'c0000002-0000-4000-8000-000000000133', 'CNT_CA', 'Canada', 'country-canada', 'CA', 'Canada', '', 'North America', '', 56.0000000, -106.0000000, 'Quốc gia', 'Seed hierarchy.', 6, 9, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 86, 0, '/'),
(134, 'c0000002-0000-4000-8000-000000000134', 'CNT_MX', 'Mexico', 'country-mexico', 'MX', 'Mexico', '', 'North America', '', 19.4000000, -99.1000000, 'Quốc gia', 'Seed hierarchy.', 3, 5, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 86, 0, '/'),
(135, 'c0000002-0000-4000-8000-000000000135', 'CNT_AU', 'Úc', 'country-australia', 'AU', 'Úc', '', 'Oceania', '', -25.0000000, 134.0000000, 'Quốc gia', 'Seed hierarchy.', 9, 11, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 88, 0, '/'),
(136, 'c0000002-0000-4000-8000-000000000136', 'CNT_NZ', 'New Zealand', 'country-new-zealand', 'NZ', 'New Zealand', '', 'Oceania', '', -41.0000000, 172.0000000, 'Quốc gia', 'Seed hierarchy.', 12, 3, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 88, 0, '/'),
(137, 'c0000002-0000-4000-8000-000000000137', 'CNT_BR', 'Brazil', 'country-brazil', 'BR', 'Brazil', '', 'South America', '', -14.2000000, -51.9000000, 'Quốc gia', 'Seed hierarchy.', 12, 3, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 87, 0, '/'),
(138, 'c0000002-0000-4000-8000-000000000138', 'CNT_AR', 'Argentina', 'country-argentina', 'AR', 'Argentina', '', 'South America', '', -34.6000000, -58.4000000, 'Quốc gia', 'Seed hierarchy.', 3, 5, 'medium', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 87, 0, '/'),
(139, 'c0000002-0000-4000-8000-000000000139', 'CNT_PE', 'Peru', 'country-peru', 'PE', 'Peru', '', 'South America', '', -9.2000000, -75.0000000, 'Quốc gia', 'Seed hierarchy.', 5, 9, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 87, 0, '/'),
(140, 'c0000002-0000-4000-8000-000000000140', 'CNT_ZA', 'Nam Phi', 'country-south-africa', 'ZA', 'Nam Phi', '', 'Africa', '', -29.0000000, 24.0000000, 'Quốc gia', 'Seed hierarchy.', 11, 3, 'medium', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 89, 0, '/'),
(141, 'c0000002-0000-4000-8000-000000000141', 'CNT_EG', 'Ai Cập', 'country-egypt', 'EG', 'Ai Cập', '', 'Africa', '', 26.0000000, 30.0000000, 'Quốc gia', 'Seed hierarchy.', 10, 4, 'high', TRUE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 89, 0, '/'),
(142, 'c0000002-0000-4000-8000-000000000142', 'CNT_MA', 'Ma-rốc', 'country-morocco', 'MA', 'Ma-rốc', '', 'Africa', '', 32.0000000, -6.0000000, 'Quốc gia', 'Seed hierarchy.', 3, 5, 'high', FALSE, TRUE, 'APPROVED', NULL, '550e8400-e29b-41d4-a716-446655440000', TRUE, 89, 0, '/');

UPDATE destinations SET parent_id = 100 WHERE id BETWEEN 1 AND 22;
UPDATE destinations SET parent_id = 101 WHERE id IN (23, 27);
UPDATE destinations SET parent_id = 102 WHERE id IN (24, 25, 26);
UPDATE destinations SET parent_id = 103 WHERE id IN (28, 29);
UPDATE destinations SET parent_id = 104 WHERE id = 30;
UPDATE destinations SET parent_id = 105 WHERE id = 31;
UPDATE destinations SET parent_id = 106 WHERE id = 32;
UPDATE destinations SET parent_id = 107 WHERE id = 33;
UPDATE destinations SET parent_id = 108 WHERE id = 34;
UPDATE destinations SET parent_id = 109 WHERE id = 35;
UPDATE destinations SET parent_id = 110 WHERE id = 36;
UPDATE destinations SET parent_id = 111 WHERE id IN (37, 38);
UPDATE destinations SET parent_id = 112 WHERE id IN (39, 40);
UPDATE destinations SET parent_id = 113 WHERE id = 41;
UPDATE destinations SET parent_id = 114 WHERE id = 42;
UPDATE destinations SET parent_id = 115 WHERE id = 43;
UPDATE destinations SET parent_id = 116 WHERE id = 44;
UPDATE destinations SET parent_id = 117 WHERE id IN (45, 46);
UPDATE destinations SET parent_id = 118 WHERE id = 47;
UPDATE destinations SET parent_id = 119 WHERE id = 48;
UPDATE destinations SET parent_id = 120 WHERE id IN (49, 50);
UPDATE destinations SET parent_id = 121 WHERE id IN (51, 52);
UPDATE destinations SET parent_id = 122 WHERE id = 53;
UPDATE destinations SET parent_id = 123 WHERE id = 54;
UPDATE destinations SET parent_id = 124 WHERE id = 55;
UPDATE destinations SET parent_id = 125 WHERE id IN (56, 57);
UPDATE destinations SET parent_id = 126 WHERE id = 58;
UPDATE destinations SET parent_id = 127 WHERE id = 59;
UPDATE destinations SET parent_id = 128 WHERE id = 60;
UPDATE destinations SET parent_id = 129 WHERE id = 61;
UPDATE destinations SET parent_id = 130 WHERE id = 62;
UPDATE destinations SET parent_id = 131 WHERE id = 63;
UPDATE destinations SET parent_id = 132 WHERE id IN (64, 65, 66, 67, 68, 69);
UPDATE destinations SET parent_id = 133 WHERE id IN (70, 71);
UPDATE destinations SET parent_id = 134 WHERE id IN (72, 73);
UPDATE destinations SET parent_id = 135 WHERE id IN (74, 75);
UPDATE destinations SET parent_id = 136 WHERE id IN (76, 77);
UPDATE destinations SET parent_id = 137 WHERE id = 78;
UPDATE destinations SET parent_id = 138 WHERE id = 79;
UPDATE destinations SET parent_id = 139 WHERE id = 80;
UPDATE destinations SET parent_id = 140 WHERE id = 81;
UPDATE destinations SET parent_id = 141 WHERE id = 82;
UPDATE destinations SET parent_id = 142 WHERE id = 83;

UPDATE destinations d
SET d.destination_level = 0,
    d.destination_path = CONCAT('/', d.id, '/')
WHERE d.id BETWEEN 84 AND 89 AND d.deleted_at IS NULL;

UPDATE destinations c
INNER JOIN destinations p ON c.parent_id = p.id
SET c.destination_level = p.destination_level + 1,
    c.destination_path = CONCAT(p.destination_path, c.id, '/')
WHERE c.id BETWEEN 100 AND 142 AND c.deleted_at IS NULL;

UPDATE destinations c
INNER JOIN destinations p ON c.parent_id = p.id
SET c.destination_level = p.destination_level + 1,
    c.destination_path = CONCAT(p.destination_path, c.id, '/')
WHERE c.id BETWEEN 1 AND 83 AND c.deleted_at IS NULL;

-- ============================================================
-- EN i18n overlays (merged from former V10 + V12)
-- ============================================================
INSERT IGNORE INTO destination_translations (destination_id, locale, name, short_description, description)
VALUES
(1, 'en', 'Ho Chi Minh City', 'A dynamic metropolis', 'The economic and culinary hub of southern Vietnam, blending history with modern life.'),
(10, 'en', 'Hoi An', 'Ancient trading port', 'Yellow-walled old town, lantern-lit evenings, and the Thu Bon River.');

INSERT IGNORE INTO guide_translations (guide_id, locale, full_name, bio)
VALUES
(1, 'en', 'Minh Tran', 'Enthusiastic licensed guide specializing in central Vietnam food and culture.'),
(2, 'en', 'Lan Nguyen', 'Historian guide focused on Hoi An heritage and highland cultures.');

INSERT IGNORE INTO destination_translations (
    destination_id,
    locale,
    name,
    short_description,
    description
) VALUES (
    3,
    'en',
    'Hanoi',
    'The thousand-year-old capital',
    'Vietnam''s political and cultural heart, with Hoan Kiem Lake, the Old Quarter''s 36 streets, and a rich street-food scene.'
);

INSERT IGNORE INTO tour_translations (
    tour_id,
    locale,
    name,
    short_description,
    description,
    highlights,
    inclusions,
    exclusions,
    notes,
    itinerary_summary
) VALUES (
    1,
    'en',
    'Da Nang 3D2N – Beach & Ba Na Hills',
    'A gentle, family-friendly getaway',
    'Explore modern Da Nang: the sandy shore of My Khe, the fairy-tale Ba Na Hills with the Golden Bridge and French Village, and lantern-lit Hoi An after dark.',
    'Dragon Bridge, Ba Na Hills cable car, My Khe Beach',
    'Transport, attraction tickets, tour guide',
    'Personal expenses',
    NULL,
    'Day 1: city/beach highlights · Day 2: Ba Na Hills full day · Day 3: Hoi An evening stroll (indicative; follow the live itinerary from operations).'
);

-- =====================================================================
-- CUỐI V7: Booking readiness wave 1 (flash / beach / hot tours)
-- booked_seats = 0; marketing "còn ít chỗ" chỉ ghi trong note
-- =====================================================================

UPDATE tours
SET is_featured = TRUE
WHERE id IN (41, 46, 50, 63, 78, 89)
  AND deleted_at IS NULL;

-- =====================================================================
-- A) LICH KHOI HANH — HOME_FLASH_SALE (41, 46, 50, 63, 78, 89)
-- =====================================================================
INSERT IGNORE INTO tour_schedules (
    id, schedule_code, tour_id, departure_at, return_at, status,
    capacity_total, booked_seats,
    adult_price, child_price, infant_price, senior_price,
    booking_open_at, booking_close_at, meeting_point_name, note
) VALUES
-- 41 Bangkok-Pattaya 5N
(1001,'SCH_TOUR_TH_01_202605_A',41,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 9 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 13 DAY),'open',30,0,7500000,5625000,500000,6750000,DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 1 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 8 DAY),'Sân bay Tân Sơn Nhất','Bay Vietnam Airlines — khởi hành đoàn Bangkok-Pattaya.'),
(1002,'SCH_TOUR_TH_01_202605_B',41,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 16 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 20 DAY),'open',30,0,7500000,5625000,500000,6750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 15 DAY),'Sân bay Tân Sơn Nhất','Còn ít chỗ — đặt sớm để giữ suất phòng KS 4*.'),
(1003,'SCH_TOUR_TH_01_202605_C',41,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 23 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 27 DAY),'open',30,0,7500000,5625000,500000,6750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 22 DAY),'Sân bay Tân Sơn Nhất','Show Alcazar + đảo Coral theo chương trình.'),
(1004,'SCH_TOUR_TH_01_202605_D',41,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 30 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 34 DAY),'open',30,0,7500000,5625000,500000,6750000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 29 DAY),'Sân bay Tân Sơn Nhất','Suất mới — đủ chỗ cho nhóm gia đình.'),
-- 46 Cambodia 4N
(1005,'SCH_TOUR_KH_01_202605_A',46,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 12 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 15 DAY),'open',35,0,5500000,4125000,400000,4950000,DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 1 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 11 DAY),'Văn phòng Quận 1','Xe giường nằm — Siem Reap & Phnom Penh.'),
(1006,'SCH_TOUR_KH_01_202605_B',46,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 19 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 22 DAY),'open',35,0,5500000,4125000,400000,4950000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 18 DAY),'Văn phòng Quận 1','Angkor Wat sunrise — HDV tiếng Việt.'),
(1007,'SCH_TOUR_KH_01_202605_C',46,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 26 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 29 DAY),'open',35,0,5500000,4125000,400000,4950000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 25 DAY),'Văn phòng Quận 1','Còn 2 chỗ cuối.'),
(1008,'SCH_TOUR_KH_01_202605_D',46,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 33 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 36 DAY),'open',35,0,5500000,4125000,400000,4950000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 32 DAY),'Văn phòng Quận 1','Suất mới mở bán.'),
-- 50 Myanmar 5N
(1009,'SCH_TOUR_MM_01_202605_A',50,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 14 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 18 DAY),'open',24,0,16800000,12600000,1000000,15120000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 13 DAY),'Sân bay Tân Sơn Nhất','Yangon — Bagan bình minh trên khinh khí cầu (tùy thời tiết).'),
(1010,'SCH_TOUR_MM_01_202605_B',50,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 21 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 25 DAY),'open',24,0,16800000,12600000,1000000,15120000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 20 DAY),'Sân bay Tân Sơn Nhất','Chùa Shwedagon + hàng nghìn đền Bagan.'),
(1011,'SCH_TOUR_MM_01_202605_C',50,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 28 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 32 DAY),'open',24,0,16800000,12600000,1000000,15120000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 27 DAY),'Sân bay Tân Sơn Nhất','Còn 1 chỗ — ưu đãi giờ chót.'),
(1012,'SCH_TOUR_MM_01_202605_D',50,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 35 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 39 DAY),'open',24,0,16800000,12600000,1000000,15120000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 34 DAY),'Sân bay Tân Sơn Nhất','Suất Tết hè — đặt trước visa Myanmar.'),
-- 63 Chengdu 5N
(1013,'SCH_TOUR_CN_04_202605_A',63,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 11 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 15 DAY),'open',25,0,15800000,11850000,800000,14220000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 10 DAY),'Sân bay Tân Sơn Nhất','Gấu trúc + Nga Mi Sơn + Lạc Sơn Đại Phật.'),
(1014,'SCH_TOUR_CN_04_202605_B',63,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 18 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 22 DAY),'open',25,0,15800000,11850000,800000,14220000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 17 DAY),'Sân bay Tân Sơn Nhất','KS 4* trung tâm Thành Đô.'),
(1015,'SCH_TOUR_CN_04_202605_C',63,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 25 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 29 DAY),'open',25,0,15800000,11850000,800000,14220000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 24 DAY),'Sân bay Tân Sơn Nhất','Visa Trung Quốc theo đoàn.'),
(1016,'SCH_TOUR_CN_04_202605_D',63,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 32 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 36 DAY),'open',25,0,15800000,11850000,800000,14220000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 31 DAY),'Sân bay Tân Sơn Nhất','Suất mới.'),
-- 78 Oktoberfest 6N
(1017,'SCH_TOUR_EU_11_202605_A',78,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 20 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 25 DAY),'open',25,0,48000000,36000000,2000000,43200000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 19 DAY),'Sân bay Tân Sơn Nhất','Munich Oktoberfest + lâu đài Neuschwanstein.'),
(1018,'SCH_TOUR_EU_11_202605_B',78,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 27 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 32 DAY),'open',25,0,48000000,36000000,2000000,43200000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 26 DAY),'Sân bay Tân Sơn Nhất','HDV tiếng Việt — Schengen visa đoàn.'),
(1019,'SCH_TOUR_EU_11_202605_C',78,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 34 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 39 DAY),'open',25,0,48000000,36000000,2000000,43200000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 33 DAY),'Sân bay Tân Sơn Nhất','Còn 4 chỗ.'),
(1020,'SCH_TOUR_EU_11_202605_D',78,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 41 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 46 DAY),'open',25,0,48000000,36000000,2000000,43200000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 40 DAY),'Sân bay Tân Sơn Nhất','Suất cao điểm hè.'),
-- 89 Egypt 8N
(1021,'SCH_TOUR_EG_01_202605_A',89,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 15 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 22 DAY),'open',20,0,52000000,39000000,2500000,46800000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 14 DAY),'Sân bay Tân Sơn Nhất','Kim tự tháp + du thuyền Nile 5*.'),
(1022,'SCH_TOUR_EG_01_202605_B',89,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 22 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 29 DAY),'open',20,0,52000000,39000000,2500000,46800000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 21 DAY),'Sân bay Tân Sơn Nhất','Thung lũng các vị vua + Cairo.'),
(1023,'SCH_TOUR_EG_01_202605_C',89,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 29 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 36 DAY),'open',20,0,52000000,39000000,2500000,46800000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 28 DAY),'Sân bay Tân Sơn Nhất','Còn 2 chỗ VIP.'),
(1024,'SCH_TOUR_EG_01_202605_D',89,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 36 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 43 DAY),'open',20,0,52000000,39000000,2500000,46800000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 35 DAY),'Sân bay Tân Sơn Nhất','Suất mới — visa Ai Cập hỗ trợ.'),

-- Beach VN bổ sung (16 Vũng Tàu, 19 Mũi Né)
(1025,'SCH_TOUR_VT_01_202605_A',16,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 6 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 6 DAY),'open',40,0,500000,375000,0,450000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 5 DAY),'Bến xe Miền Đông','Tour biển cuối tuần — tượng Chúa Kitô.'),
(1026,'SCH_TOUR_VT_01_202605_B',16,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 13 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 13 DAY),'open',40,0,500000,375000,0,450000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 12 DAY),'Bến xe Miền Đông','Đi sáng về tối.'),
(1027,'SCH_TOUR_MD_01_202605_A',19,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 8 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 8 DAY),'open',25,0,700000,525000,0,630000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 7 DAY),'Phan Thiết','Jeep đồi cát + làng chài.'),
(1028,'SCH_TOUR_MD_01_202605_B',19,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 15 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 15 DAY),'open',25,0,700000,525000,0,630000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 14 DAY),'Phan Thiết','Suất mới.'),

-- HOT intl mẫu (91 Nam Phi, 94 Perth, 96 Ấn Độ)
(1029,'SCH_TOUR_ZA_01_202605_A',91,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 25 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 32 DAY),'open',15,0,55000000,41250000,2000000,49500000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 24 DAY),'Sân bay Tân Sơn Nhất','Safari Kruger + Cape Town.'),
(1030,'SCH_TOUR_AU_02_202605_A',94,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 28 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 33 DAY),'open',18,0,42000000,31500000,1500000,37800000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 27 DAY),'Sân bay Tân Sơn Nhất','Perth + Rottnest Quokka.'),
(1031,'SCH_TOUR_IN_01_202605_A',96,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 18 DAY),DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 23 DAY),'open',25,0,18500000,13875000,800000,16650000,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP,INTERVAL 17 DAY),'Sân bay Tân Sơn Nhất','Tam giác vàng Delhi-Agra-Jaipur.');

-- =====================================================================
-- B) DIEM DON (moi schedule flash co it nhat 1 diem)
-- =====================================================================
INSERT IGNORE INTO tour_schedule_pickup_points (schedule_id, point_name, address, latitude, longitude, pickup_at, sort_order)
SELECT s.id, 'Văn phòng TravelViet Q.1', '235 Nguyễn Huệ, Quận 1, TP.HCM', 10.7743, 106.7019,
       DATE_SUB(s.departure_at, INTERVAL 3 HOUR), 0
FROM tour_schedules s
WHERE s.id BETWEEN 1001 AND 1024
UNION ALL
SELECT s.id, 'Sân bay Tân Sơn Nhất', 'Cột 12, ga quốc tế TSN', 10.8185, 106.6588,
       DATE_SUB(s.departure_at, INTERVAL 2 HOUR), 1
FROM tour_schedules s
WHERE s.id BETWEEN 1001 AND 1024;

INSERT IGNORE INTO tour_schedule_pickup_points (schedule_id, point_name, address, latitude, longitude, pickup_at, sort_order)
VALUES
(1025,'Bến xe Miền Đông','292 Đinh Bộ Lĩnh, Bình Thạnh',10.8129,106.7119,DATE_SUB((SELECT departure_at FROM tour_schedules WHERE id=1025),INTERVAL 1 HOUR),0),
(1026,'Bến xe Miền Đông','292 Đinh Bộ Lĩnh, Bình Thạnh',10.8129,106.7119,DATE_SUB((SELECT departure_at FROM tour_schedules WHERE id=1026),INTERVAL 1 HOUR),0),
(1027,'Văn phòng Phan Thiết','01 Trần Hưng Đạo, Phan Thiết',10.9378,108.1522,DATE_SUB((SELECT departure_at FROM tour_schedules WHERE id=1027),INTERVAL 1 HOUR),0),
(1028,'Văn phòng Phan Thiết','01 Trần Hưng Đạo, Phan Thiết',10.9378,108.1522,DATE_SUB((SELECT departure_at FROM tour_schedules WHERE id=1028),INTERVAL 1 HOUR),0),
(1029,'Sân bay Tân Sơn Nhất','Ga quốc tế',10.8185,106.6588,DATE_SUB((SELECT departure_at FROM tour_schedules WHERE id=1029),INTERVAL 2 HOUR),0),
(1030,'Sân bay Tân Sơn Nhất','Ga quốc tế',10.8185,106.6588,DATE_SUB((SELECT departure_at FROM tour_schedules WHERE id=1030),INTERVAL 2 HOUR),0),
(1031,'Sân bay Tân Sơn Nhất','Ga quốc tế',10.8185,106.6588,DATE_SUB((SELECT departure_at FROM tour_schedules WHERE id=1031),INTERVAL 2 HOUR),0);

-- =====================================================================
-- C) DIEM KHOI HANH (catalog)
-- =====================================================================
INSERT IGNORE INTO tour_departure_hubs (tour_id, city_code, city_name_vi, city_name_en, is_primary, sort_order) VALUES
(41,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(41,'HAN','Hà Nội','Hanoi',FALSE,1),
(46,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(50,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(63,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(78,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(89,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(16,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(19,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(91,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(94,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0),
(96,'SGN','TP. Hồ Chí Minh','Ho Chi Minh City',TRUE,0);

-- =====================================================================
-- D) BAO GOM / ICON UI
-- =====================================================================
INSERT IGNORE INTO tour_inclusion_flags (
    tour_id, has_flight, has_hotel, has_meals, has_tickets, has_guide, has_insurance, has_transport,
    hotel_stars, flight_type, notes
) VALUES
(41,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,4,'roundtrip','Vé máy bay khứ hồi + KS 4* + ăn theo chương trình'),
(46,FALSE,TRUE,TRUE,TRUE,TRUE,FALSE,TRUE,3,'none','Xe máy lạnh + KS tiêu chuẩn — không gồm vé máy bay'),
(50,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,4,'roundtrip','Bay Yangon + KS 3-4* + HDV'),
(63,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,4,'roundtrip','Bay Thành Đô + vé tham quan + KS 4*'),
(78,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,4,'roundtrip','Bay châu Âu + KS 4* + vé Oktoberfest'),
(89,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,5,'roundtrip','Bay + du thuyền Nile 5* + visa hỗ trợ'),
(16,FALSE,FALSE,TRUE,TRUE,TRUE,FALSE,TRUE,NULL,'none','Tour trong ngày — xe + HDV + ăn trưa'),
(19,FALSE,FALSE,TRUE,TRUE,TRUE,FALSE,TRUE,NULL,'none','Tour Jeep — không nghỉ đêm'),
(91,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,4,'roundtrip','Safari + bay Johannesburg/Cape Town'),
(94,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,4,'roundtrip','Bay Perth + KS 4*'),
(96,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,5,'roundtrip','Bay Delhi + KS 5* tam giác vàng');

-- =====================================================================
-- E) COMBO gan tour (combo_packages id 6-36 da co trong V7)
-- =====================================================================
INSERT IGNORE INTO tour_combo_packages (tour_id, combo_id, package_role, is_default, sort_order) VALUES
(41,36,'recommended',FALSE,1),
(41,16,'optional',FALSE,2),
(41,8,'optional',FALSE,3),
(46,6,'included',TRUE,1),
(46,10,'optional',FALSE,2),
(50,36,'recommended',FALSE,1),
(50,15,'optional',FALSE,2),
(63,36,'recommended',FALSE,1),
(63,9,'optional',FALSE,2),
(78,36,'recommended',FALSE,1),
(78,13,'optional',FALSE,2),
(89,36,'recommended',FALSE,1),
(89,20,'optional',FALSE,2),
(16,6,'optional',FALSE,1),
(19,7,'optional',FALSE,1),
(91,36,'recommended',FALSE,1),
(94,25,'optional',FALSE,1),
(96,14,'optional',FALSE,1);


-- =====================================================================
-- CUỐI V7 Wave 2: Lịch OPEN + hub + flags + điểm đón cho tour active còn thiếu
-- booked_seats = 0 (không seed số giả)
-- =====================================================================

INSERT IGNORE INTO tour_schedules (
    id, schedule_code, tour_id, departure_at, return_at, status,
    capacity_total, booked_seats,
    adult_price, child_price, infant_price, senior_price,
    booking_open_at, booking_close_at, meeting_point_name, note
)
SELECT
    2000 + t.id * 10 + 1,
    CONCAT('SCH_', t.code, '_W2A'),
    t.id,
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (7 + (t.id % 21)) DAY),
    DATE_ADD(
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (7 + (t.id % 21)) DAY),
        INTERVAL GREATEST(COALESCE(t.duration_days, 1), 1) DAY),
    'open',
    LEAST(45, GREATEST(12, COALESCE(t.max_group_size, 20))),
    0,
    t.base_price,
    ROUND(t.base_price * 0.75, 0),
    ROUND(t.base_price * 0.08, 0),
    ROUND(t.base_price * 0.90, 0),
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY),
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (6 + (t.id % 21)) DAY),
    'Điểm tập trung TravelViet',
    CONCAT('Suất A — ', t.name)
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

INSERT IGNORE INTO tour_schedules (
    id, schedule_code, tour_id, departure_at, return_at, status,
    capacity_total, booked_seats,
    adult_price, child_price, infant_price, senior_price,
    booking_open_at, booking_close_at, meeting_point_name, note
)
SELECT
    2000 + t.id * 10 + 2,
    CONCAT('SCH_', t.code, '_W2B'),
    t.id,
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (14 + (t.id % 18)) DAY),
    DATE_ADD(
        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (14 + (t.id % 18)) DAY),
        INTERVAL GREATEST(COALESCE(t.duration_days, 1), 1) DAY),
    'open',
    LEAST(45, GREATEST(12, COALESCE(t.max_group_size, 20))),
    0,
    t.base_price,
    ROUND(t.base_price * 0.75, 0),
    ROUND(t.base_price * 0.08, 0),
    ROUND(t.base_price * 0.90, 0),
    CURRENT_TIMESTAMP,
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL (13 + (t.id % 18)) DAY),
    'Điểm tập trung TravelViet',
    CONCAT('Suất B — ', t.name)
FROM tours t
WHERE t.deleted_at IS NULL
  AND t.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM tour_schedules s
    WHERE s.tour_id = t.id AND s.id = 2000 + t.id * 10 + 2
  );

INSERT IGNORE INTO tour_schedule_pickup_points (
    schedule_id, point_name, address, latitude, longitude, pickup_at, sort_order
)
SELECT
    s.id,
    'Văn phòng TravelViet Q.1',
    '235 Nguyễn Huệ, Quận 1, TP.HCM',
    10.7743,
    106.7019,
    DATE_SUB(s.departure_at, INTERVAL 3 HOUR),
    0
FROM tour_schedules s
WHERE s.deleted_at IS NULL
  AND s.status = 'open'
  AND s.departure_at > NOW()
  AND NOT EXISTS (
    SELECT 1 FROM tour_schedule_pickup_points p
    WHERE p.schedule_id = s.id AND p.deleted_at IS NULL
  );

INSERT IGNORE INTO tour_departure_hubs (tour_id, city_code, city_name_vi, city_name_en, is_primary, sort_order)
SELECT t.id, 'SGN', 'TP. Hồ Chí Minh', 'Ho Chi Minh City', TRUE, 0
FROM tours t
WHERE t.deleted_at IS NULL
  AND t.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM tour_departure_hubs h
    WHERE h.tour_id = t.id AND h.deleted_at IS NULL
  );

INSERT IGNORE INTO tour_inclusion_flags (
    tour_id, has_flight, has_hotel, has_meals, has_tickets, has_guide, has_insurance, has_transport,
    hotel_stars, flight_type, notes
)
SELECT
    t.id,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'máy bay|vé máy bay|bay khứ|bay perth|bay delhi' THEN TRUE
        ELSE FALSE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'khách sạn|ks [0-9]|resort|du thuyền|homestay|ngủ đêm' THEN TRUE
        WHEN COALESCE(t.duration_days, 1) >= 2 THEN TRUE
        ELSE FALSE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'ăn |bữa |buffet|ẩm thực' THEN TRUE
        ELSE FALSE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'vé |vào cổng|tham quan' THEN TRUE
        ELSE TRUE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'hdv|hướng dẫn' THEN TRUE
        ELSE TRUE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'bảo hiểm' THEN TRUE
        WHEN t.base_price >= 10000000 THEN TRUE
        ELSE FALSE
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'xe |đưa đón|cano|tàu |thuyền' THEN TRUE
        ELSE TRUE
    END,
    CASE
        WHEN t.base_price >= 45000000 THEN 5
        WHEN t.base_price >= 20000000 THEN 4
        WHEN COALESCE(t.duration_days, 1) >= 3 AND t.base_price >= 8000000 THEN 4
        WHEN COALESCE(t.duration_days, 1) >= 2 THEN 3
        ELSE NULL
    END,
    CASE
        WHEN LOWER(CONCAT(IFNULL(t.inclusions, ''), ' ', IFNULL(t.description, '')))
             REGEXP 'máy bay|vé máy bay' THEN 'roundtrip'
        ELSE 'none'
    END,
    LEFT(CONCAT('Gồm: ', IFNULL(t.inclusions, 'Theo chương trình')), 500)
FROM tours t
WHERE t.deleted_at IS NULL
  AND t.status = 'active'
  AND NOT EXISTS (SELECT 1 FROM tour_inclusion_flags f WHERE f.tour_id = t.id);

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
