SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- V7_01A__seed_core_base_users_permissions.sql
-- Dữ liệu nền ngắn: role, permission, user mẫu, product/addon, tags, testimonial.
-- ============================================================

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


-- ============================================================
-- TOUR LINE LABELS (Tours catalog): ESG & LEI / Cao cấp / Tiêu chuẩn / Tiết kiệm / Giá tốt
-- Quy tắc đã duyệt phía FE:
-- 1) ESG & LEI: esg_score >= 80 và lei_score >= 70 (hoặc có tag TOUR_LINE_ESG)
-- 2) Cao cấp: có tag TOUR_LINE_CAO_CAP hoặc giá cao
-- 3) Tiêu chuẩn: có tag TOUR_LINE_TIEU_CHUAN
-- 4) Tiết kiệm: có tag TOUR_LINE_TIET_KIEM hoặc list_price > base_price
-- 5) Giá tốt: fallback
-- ============================================================
INSERT IGNORE INTO tags(code, name, tag_group, description)
VALUES
    ('TOUR_LINE_ESG', 'Tour ESG & LEI', 'tour_line', 'Tour có điểm ESG/LEI tốt theo chuẩn catalog.'),
    ('TOUR_LINE_CAO_CAP', 'Cao cấp', 'tour_line', 'Tour premium hoặc mức giá cao.'),
    ('TOUR_LINE_TIEU_CHUAN', 'Tiêu chuẩn', 'tour_line', 'Tour cân bằng giữa trải nghiệm và ngân sách.'),
    ('TOUR_LINE_TIET_KIEM', 'Tiết kiệm', 'tour_line', 'Tour tối ưu chi phí hoặc có giá niêm yết cao hơn giá bán.'),
    ('TOUR_LINE_GIA_TOT', 'Giá tốt', 'tour_line', 'Tour có mức giá tốt cho đa số người dùng.'),
    ('HOME_BEACH_VN', 'Kệ trang chủ: Biển đảo VN', 'home_row', ''),
    ('HOME_FLASH_SALE', 'Kệ trang chủ: Giờ chót', 'home_row', ''),
    ('HOME_HOT_INTL', 'Kệ trang chủ: Quốc tế', 'home_row', ''),
    ('MAO_HIEM', 'Khám Phá Mạo Hiểm', 'category', 'Du lịch cảm giác mạnh và thử thách'),
    ('SANG_TRONG', 'Trải Nghiệm Sang Trọng', 'category', 'Kỳ nghỉ dưỡng xa hoa đẳng cấp'),
    ('GIA_DINH', 'Du Lịch Gia Đình', 'category', 'Phù hợp cho mọi độ tuổi trong gia đình'),
    ('SINH_THAI', 'Du Lịch Sinh Thái', 'category', 'Hoà mình vào thiên nhiên hoang sơ'),
    ('NGHI_DUONG', 'Nghỉ Dưỡng Thư Giãn', 'category', 'Nạp năng lượng và chữa lành'),
    ('VAN_HOA', 'Văn Hóa Bản Địa', 'category', 'Trải nghiệm văn hoá và con người địa phương'),
    ('AM_THUC', 'Khám Phá Ẩm Thực', 'category', 'Hành trình di sản ẩm thực vùng miền'),
    ('LICH_SU', 'Hành Trình Lịch Sử', 'category', 'Tìm hiểu về các cột mốc lịch sử'),
    ('TAM_LINH', 'Hành Hương Tâm Linh', 'category', 'Du lịch đền chùa và các địa điểm tâm linh'),
    ('CHUA_LANH', 'Du Lịch Chữa Lành', 'category', 'Wellness retreat, thiền và yoga'),
    ('GIAI_TRI', 'Vui Chơi Sôi Động', 'category', 'Công viên giải trí và hoạt động nhóm'),
    ('CAP_DOI', 'Lãng Mạn Cặp Đôi', 'category', 'Phù hợp cho tuần trăng mật và hẹn hò'),
    ('CHECKIN', 'Góc Nhìn Check-in', 'category', 'Địa điểm sống ảo cực chill'),
    ('WILDLIFE', 'Động Vật Hoang Dã', 'category', 'Thám hiểm thế giới hoang dã tự nhiên'),
    ('THE_THAO_NUOC', 'Thể Thao Dưới Nước', 'category', 'Lặn ngắm san hô, chèo thuyền kayak'),
    ('NIGHTLIFE', 'Vui Chơi Về Đêm', 'category', 'Cuộc sống sôi động khi màn đêm buông xuống'),
    ('LE_HOI', 'Nhịp Điệu Lễ Hội', 'category', 'Tham gia các lễ hội lớn trong năm'),
    ('TREKKING', 'Trải Nghiệm Trekking', 'category', 'Băng rừng vượt suối chinh phục đỉnh cao'),
    ('CAMPING', 'Cắm Trại & Lửa Trại', 'category', 'Bữa tối BBQ và cắm trại ngoài trời'),
    ('VISA_FREE', 'Du Lịch Miễn Visa', 'category', 'Thoải mái xách vali lên và đi');


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


-- ADDONS
INSERT IGNORE INTO addon_definitions (id, code, name, addon_type, description, pricing_mode, unit_price, is_active)
VALUES
(1,'AIRPORT_TRANSFER','Đưa đón sân bay','airport_transfer','Xe đưa đón sân bay 1 chiều','per_booking',250000,TRUE);


-- =====================================================================
-- 02_AUTH_PERMISSIONS - Phân quyền: roles / permissions / role_permissions
-- =====================================================================

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


-- =====================================================================
-- 03_USERS - Người dùng và dữ liệu hồ sơ
-- =====================================================================

-- =========================================================
-- SAMPLE DATA PACK (1-2 rows/table; EN for codes/enum keys)
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


-- =====================================================================
-- 05_GUIDES_TOURS - Guides, tours, media, tags, itinerary
-- =====================================================================

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


INSERT IGNORE INTO guide_translations (guide_id, locale, full_name, bio)
VALUES
(1, 'en', 'Minh Tran', 'Enthusiastic licensed guide specializing in central Vietnam food and culture.'),
(2, 'en', 'Lan Nguyen', 'Historian guide focused on Hoi An heritage and highland cultures.');


;


-- 3) Kiểm tra parent/breadcrumb của POI:
-- SELECT child.id, child.name, child.parent_id, parent.name AS parent_name, child.destination_path, child.latitude, child.longitude
-- FROM destinations child JOIN destinations parent ON parent.id = child.parent_id
-- WHERE child.destination_level = 2 LIMIT 20;


-- 3) Kiểm tra parent/breadcrumb của POI:
-- SELECT child.id, child.name, child.parent_id, parent.name AS parent_name, child.destination_path, child.latitude, child.longitude
-- FROM destinations child JOIN destinations parent ON parent.id = child.parent_id
-- WHERE child.destination_level = 2 LIMIT 20;


-- 3) Kiểm tra parent/breadcrumb/Google Map của POI quốc tế:
-- SELECT child.id, child.name, child.parent_id, parent.name AS parent_name, child.destination_path, child.latitude, child.longitude
-- FROM destinations child JOIN destinations parent ON parent.id = child.parent_id
-- WHERE child.id BETWEEN 8000 AND 9000 AND child.destination_level = 2 LIMIT 30;


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


-- 8) Useful check queries
-- SELECT f.flight_no, a1.code_iata AS from_airport, a2.code_iata AS to_airport, f.departure_time_local, SUM(fc.seat_available) AS total_seat_available,
--        CASE WHEN SUM(fc.seat_available) = 0 THEN 'FULL' ELSE 'AVAILABLE' END AS flight_capacity_status
-- FROM flights f JOIN airports a1 ON a1.id = f.origin_airport_id JOIN airports a2 ON a2.id = f.destination_airport_id JOIN flight_classes fc ON fc.flight_id = f.id
-- WHERE f.flight_no IN ('VN2601', 'VN2602', 'VN2603', 'VN2604', 'VN2605', 'VN2606', 'VN2607', 'VN2608', 'VN2609', 'VN2610', '...')
-- GROUP BY f.id, f.flight_no, a1.code_iata, a2.code_iata, f.departure_time_local;


SET FOREIGN_KEY_CHECKS = 1;
