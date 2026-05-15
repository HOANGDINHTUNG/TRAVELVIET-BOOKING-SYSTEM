-- Flyway V1: CREATE TABLE only (baseline + TravelViet extension; columns inlined, no trailing ALTER)
-- Schema is the DB selected by the datasource (do not USE a different database).

SET NAMES utf8mb4; SET FOREIGN_KEY_CHECKS = 0; 
-- Run against the schema selected by the datasource/Flyway connection.
-- Do not switch databases inside the migration, otherwise runtime config and migration history diverge.
SET FOREIGN_KEY_CHECKS = 1; 

-- =============================================================================
-- Quy ước ngôn ngữ trong schema (V1) — chỉ tài liệu, không đổi hành vi
-- ERD.sql không dùng làm nguồn chạy; Flyway chỉ đọc file migration này.
--
-- A) PHẢI GIỮ TIẾNG ANH (HOẶC MÃ ASCII) — “HỢP ĐỒNG” VỚI BACKEND / TÍCH HỢP
--    Toàn bộ giá trị ENUM trong các bảng dưới đây được map trực tiếp hoặc tương
--    đương với enum/string trong Java; đổi literal → phải đổi code + dữ liệu cũ.
--
--    • users: user_category, status, gender, member_level
--    • roles: role_scope
--    • user_preferences: budget_level, preferred_trip_mode, travel_style
--    • destinations: crowd_level_default; cột status (VARCHAR) = mã workflow EN (vd. APPROVED)
--    • destination_media, tour_media: media_type
--    • guides: gender, status
--    • tours: trip_mode, status
--    • tour_schedules: status
--    • promotion_campaigns: target_member_level
--    • vouchers: discount_type, applicable_member_level
--    • user_missions: status
--    • products: product_type
--    • orders: status, payment_status; order_items.item_type
--    • bookings: status, payment_status
--    • booking_passengers: passenger_type, gender
--    • booking_status_history: old_status, new_status
--    • payments: payment_method, status (thanh toán)
--    • refund_requests: refund_method, status
--    • review_analysis: sentiment
--    • weather_alerts: severity; crowd_predictions.crowd_level
--    • notifications: notification_type, channel
--    • support_sessions: status
--    • support_messages: sender_type
--    • schedule_chat_rooms: visibility
--    • recommendation_logs: requested_budget, requested_trip_mode
--    • payment_attempts: payment_method, status
--    • refund_status_history: old_status, new_status
--    • refund_transactions: status
--    • addon_definitions: addon_type, pricing_mode
--    • booking_addons: pricing_mode
--    • tour_price_rules: rule_type, target_guest_type, adjust_type, member_level
--    • schedule_price_rules: target_guest_type, adjust_type
--    • suppliers: supplier_type, status
--    • supplier_services: service_type
--    • hotels.status, vehicles: vehicle_type + status
--    • schedule_resource_allocations: resource_type, allocation_status
--    • destination_proposals: proposal_type, status
--    • destination_proposal_reviews: decision
--    • voucher_redemptions: status
--    • invoices / invoice_items / invoice_requests: invoice_type, status, request_type
--    • commissions: source_type, beneficiary_type, commission_type, status
--    • partner_payouts, guide_payouts: status
--    • tour_schedule_status_history: old_status, new_status
--    • notification_campaigns: notification_type, channel, status
--    • notification_deliveries: channel, status
--
--    Chuỗi DEFAULT kiểu mã (giữ EN / ISO): country_code 'VN', currency 'VND',
--    booking_source / order_source 'app', guide_role 'main', applicable_scope 'all',
--    storage_provider 'local', v.v.
--
-- B) KHÔNG BẮT BUỘC TIẾNG ANH — DỮ LIỆU NHẬP / HIỂN THỊ (UTF-8, thường TIẾNG VIỆT)
--    Mọi VARCHAR/TEXT/JSON “nội dung”: tên, mô tả, địa chỉ, ghi chú, template copy,
--    alt ảnh (theo locale), payload do người nhập. Địa danh do CMS nhập — không ép
--    quy tắc ngôn ngữ ở tầng DDL.
--
-- C) JSON TRONG CỘT (conditions_json, reward_json, target_query, …)
--    • Tên thuộc tính (key) nên ASCII/EN để code đọc; giá trị có thể là số hoặc chuỗi
--      hiển thị theo ngôn ngữ nghiệp vụ.
--
-- D) SEED / NHÃN HIỂN THỊ
--    Vai trò, quyền, khuyến mãi mẫu… nằm ở V7__seed_data.sql (đã Việt hóa phần UI);
--    mã permission.code / role.code vẫn EN.
--
-- KHÔNG đổi literal ENUM trong file này trừ khi refactor đồng bộ toàn bộ entity + dữ liệu.
-- =============================================================================

-- 1. USERS audit_logs/ PREFERENCES / DEVICES -- 
-- Bẳng mô tả người dùng
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY, -- id người dùng
    email VARCHAR(150) UNIQUE, -- email người dùng
    phone VARCHAR(20) UNIQUE, -- số điện thoại người dùng
    password_hash VARCHAR(255) NOT NULL, -- mật khẩu người dùng đã được mã hoá
    user_category ENUM('INTERNAL', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER', -- loại người dùng
    status ENUM('pending', 'active', 'suspended', 'blocked', 'deleted') NOT NULL DEFAULT 'active', -- trạng thái người dùng
    full_name VARCHAR(150) NOT NULL, -- tên người dùng
    display_name VARCHAR(120), -- tên hiển thị người dùng
    gender ENUM('male', 'female', 'other', 'unknown') NOT NULL DEFAULT 'unknown', -- giới tính người dùng
    date_of_birth DATE, -- ngày sinh người dùng
    avatar_url TEXT, -- url ảnh đại diện người dùng
    member_level ENUM('bronze', 'silver', 'gold', 'platinum', 'diamond') NOT NULL DEFAULT 'bronze', -- cấp độ thành viên người dùng
    loyalty_points INT NOT NULL DEFAULT 0, -- điểm thưởng người dùng
    total_spent DECIMAL(14 , 2 ) NOT NULL DEFAULT 0, -- tổng tiền người dùng đã chi tiêu
    email_verified_at DATETIME NULL, -- ngày email đã được xác thực
    phone_verified_at DATETIME NULL, -- ngày số điện thoại đã được xác thực
    last_login_at DATETIME NULL, -- ngày đăng nhập cuối cùng của người dùng
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo người dùng
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật người dùng
    deleted_at DATETIME NULL, -- ngày xóa người dùng
    CONSTRAINT chk_user_contact_required CHECK (email IS NOT NULL OR phone IS NOT NULL) -- kiểm tra email hoặc số điện thoại có tồn tại
)  ENGINE=INNODB; 

-- Bảng vai trò
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id vai trò
    code VARCHAR(50) NOT NULL UNIQUE, -- mã vai trò
    name VARCHAR(120) NOT NULL, -- tên vai trò
    description VARCHAR(255), -- mô tả vai trò
    role_scope ENUM('SYSTEM', 'BACKOFFICE', 'CUSTOMER') NOT NULL DEFAULT 'SYSTEM', -- phạm vi vai trò
    hierarchy_level INT NOT NULL DEFAULT 0, -- cấp độ vai trò
    is_system_role BOOLEAN NOT NULL DEFAULT TRUE, -- có phải là vai trò hệ thống không
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- có hoạt động không
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo vai trò
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật vai trò
    deleted_at DATETIME NULL -- ngày xóa vai trò
) ENGINE=InnoDB; 

-- Bảng quyền hạn
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id quyền hạn
    code VARCHAR(100) NOT NULL UNIQUE, -- mã quyền hạn
    name VARCHAR(150) NOT NULL, -- tên hành động quyền hạn
    module_name VARCHAR(80) NOT NULL, -- tên module quyền hạn
    action_name VARCHAR(80) NOT NULL, -- tên hành động quyền hạn
    description VARCHAR(255), -- mô tả quyền hạn
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- có hoạt động không
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật 
    deleted_at DATETIME NULL -- ngày xóa 
) ENGINE=InnoDB; 

-- Bảng quyền hạn của vai trò
CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- mã
    role_id BIGINT NOT NULL, -- id vai trò
    permission_id BIGINT NOT NULL, -- id quyền hạn
    granted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày cấp quyền
    granted_by CHAR(36) NULL, -- id người cấp quyền
    deleted_at DATETIME NULL, -- ngày xóa
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật
    UNIQUE KEY uk_role_permission (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_role_permissions_granted_by
        FOREIGN KEY (granted_by) REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    role_id BIGINT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expired_at DATETIME NULL,
    assigned_by CHAR(36) NULL,
    note VARCHAR(255) NULL,
    deleted_at DATETIME NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_role (user_id, role_id),
    KEY idx_user_roles_user_primary (user_id, is_primary),
    KEY idx_user_roles_role (role_id),
    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_assigned_by
        FOREIGN KEY (assigned_by) REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB; 

CREATE TABLE IF NOT EXISTS user_preferences ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
	user_id CHAR(36) NOT NULL UNIQUE, 
	budget_level ENUM('low', 'medium', 'high', 'luxury') NULL, 
	preferred_trip_mode ENUM('group', 'private', 'shared') NULL, 
	travel_style ENUM('relax', 'adventure', 'checkin', 'family', 'culture', 'food', 'spiritual', 'mixed') NULL, 
	preferred_departure_city VARCHAR(120), favorite_regions JSON NULL, 
	favorite_tags JSON NULL, favorite_destinations JSON NULL, 
	prefers_low_mobility BOOLEAN NOT NULL DEFAULT FALSE, 
	prefers_family_friendly BOOLEAN NOT NULL DEFAULT FALSE, 
	prefers_student_budget BOOLEAN NOT NULL DEFAULT FALSE, 
	prefers_weather_alert BOOLEAN NOT NULL DEFAULT TRUE, 
	prefers_promotion_alert BOOLEAN NOT NULL DEFAULT TRUE, 
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
	CONSTRAINT fk_user_preferences_user 
	FOREIGN KEY (user_id) 
	REFERENCES users(id) 
	ON DELETE CASCADE 
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS user_devices ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
	user_id CHAR(36) NOT NULL, 
	platform VARCHAR(30) NOT NULL, 
	device_name VARCHAR(100), 
	push_token TEXT, 
	app_version VARCHAR(30), 
	is_active BOOLEAN NOT NULL DEFAULT TRUE, 
	last_seen_at DATETIME NULL, 
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
	CONSTRAINT fk_user_devices_user 
	FOREIGN KEY (user_id) 
	REFERENCES users(id) 
	ON DELETE CASCADE 
) ENGINE=InnoDB; 


CREATE TABLE IF NOT EXISTS user_addresses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    contact_name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    province VARCHAR(100),
    district VARCHAR(100),
    ward VARCHAR(100),
    address_line TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_addresses_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
)  ENGINE=INNODB; 

-- 2. DESTINATIONS / CONTENT / FOLLOW -- 

-- Bảng điểm đến
CREATE TABLE IF NOT EXISTS destinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id điểm đến
    uuid CHAR(36) NOT NULL DEFAULT (UUID()), -- uuid điểm đến
    code VARCHAR(30) NOT NULL UNIQUE, -- mã điểm đến
    name VARCHAR(200) NOT NULL, -- tên điểm đến
    slug VARCHAR(220) NOT NULL UNIQUE, -- slug điểm đến
    country_code CHAR(2) NOT NULL DEFAULT 'VN', -- mã quốc gia
    province VARCHAR(120) NOT NULL, -- tỉnh thành phố
    district VARCHAR(120), -- quận huyện
    region VARCHAR(120), -- khu vực
    address TEXT, -- địa chỉ
    latitude DECIMAL(10 , 7 ), -- vĩ độ
    longitude DECIMAL(10 , 7 ), -- kinh độ
    short_description TEXT, -- mô tả ngắn
    description TEXT, -- mô tả đầy đủ
    best_time_from_month TINYINT NULL, -- tháng tốt nhất đi đến
    best_time_to_month TINYINT NULL, -- tháng tốt nhất đi đến
    crowd_level_default ENUM('low', 'medium', 'high', 'very_high') NOT NULL DEFAULT 'medium', -- mức độ đông đúc
    is_featured BOOLEAN NOT NULL DEFAULT FALSE, -- có được đặt làm điểm đến nổi bật không
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- có hoạt động không
    status VARCHAR(20) NOT NULL DEFAULT 'APPROVED', -- trạng thái điểm đến
    proposed_by CHAR(36) NULL, -- id người đề xuất
    verified_by CHAR(36) NULL, -- id người xác thực
    rejection_reason TEXT NULL, -- lý do từ chối
    is_official BOOLEAN NOT NULL DEFAULT FALSE, -- có phải là điểm đến chính thức không
    parent_id BIGINT NULL,
    destination_level INT NOT NULL DEFAULT 0,
    destination_path VARCHAR(512) NOT NULL DEFAULT '/',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật
    deleted_at DATETIME NULL, -- ngày xóa
    UNIQUE KEY uk_destinations_uuid (uuid), -- unique key uuid
    KEY idx_destinations_parent (parent_id),
    KEY idx_destinations_path_prefix (destination_path(190)),
    CONSTRAINT chk_best_time_from CHECK (best_time_from_month BETWEEN 1 AND 12
        OR best_time_from_month IS NULL), -- kiểm tra tháng tốt nhất đi đến
    CONSTRAINT chk_best_time_to CHECK (best_time_to_month BETWEEN 1 AND 12
        OR best_time_to_month IS NULL), -- kiểm tra tháng tốt nhất đi đến
    CONSTRAINT fk_destinations_parent FOREIGN KEY (parent_id) REFERENCES destinations (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS destination_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    name VARCHAR(200),
    short_description TEXT,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_destination_translations_dest_locale (destination_id, locale),
    CONSTRAINT fk_destination_translations_destination
        FOREIGN KEY (destination_id) REFERENCES destinations (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bảng media điểm đến
CREATE TABLE IF NOT EXISTS destination_media ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id media điểm đến
    destination_id BIGINT NOT NULL, -- id điểm đến
    media_type ENUM('image', 'video', 'cover', 'banner') NOT NULL DEFAULT 'image', -- loại media
    media_url TEXT NOT NULL, -- url media
    alt_text VARCHAR(255), -- text thay thế
    sort_order INT NOT NULL DEFAULT 0, -- thứ tự sắp xếp
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- có hoạt động không
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật
    deleted_at DATETIME NULL, -- ngày xóa
    CONSTRAINT fk_destination_media_destination 
    FOREIGN KEY (destination_id) 
    REFERENCES destinations(id) 
    ON DELETE CASCADE 
) ENGINE=InnoDB; 

-- Bảng món ăn điểm đến
CREATE TABLE IF NOT EXISTS destination_foods ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id món ăn điểm đến
    destination_id BIGINT NOT NULL, -- id điểm đến
    food_name VARCHAR(200) NOT NULL, -- tên món ăn
    description TEXT, -- mô tả
    is_featured BOOLEAN NOT NULL DEFAULT TRUE, -- có được đặt làm món ăn nổi bật không
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật
    deleted_at DATETIME NULL, -- ngày xóa
    CONSTRAINT fk_destination_foods_destination 
    FOREIGN KEY (destination_id)
    REFERENCES destinations(id) 
    ON DELETE CASCADE
) ENGINE=InnoDB; 

-- Bảng chuyên ngành điểm đến
CREATE TABLE IF NOT EXISTS destination_specialties ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id chuyên ngành điểm đến
    destination_id BIGINT NOT NULL, -- id điểm đến
    specialty_name VARCHAR(200) NOT NULL, -- tên chuyên ngành
    description TEXT, -- mô tả
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật
    deleted_at DATETIME NULL, -- ngày xóa
    CONSTRAINT fk_destination_specialties_destination 
    FOREIGN KEY (destination_id)
    REFERENCES destinations(id) 
    ON DELETE CASCADE
) ENGINE=InnoDB; 


CREATE TABLE IF NOT EXISTS destination_activities ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id hoạt động điểm đến
    destination_id BIGINT NOT NULL, -- id điểm đến
    activity_name VARCHAR(200) NOT NULL, -- tên hoạt động
    description TEXT, -- mô tả
    activity_score DECIMAL(5,2) NOT NULL DEFAULT 0, -- điểm hoạt động
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật
    deleted_at DATETIME NULL, -- ngày xóa
    CONSTRAINT fk_destination_activities_destination 
    FOREIGN KEY (destination_id)
    REFERENCES destinations(id) 
    ON DELETE CASCADE
) ENGINE=InnoDB; 


-- Bảng mẹo điểm đến
CREATE TABLE IF NOT EXISTS destination_tips (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id mẹo điểm đến
    destination_id BIGINT NOT NULL, -- id điểm đến
    tip_title VARCHAR(200) NOT NULL, -- tên mẹo
    tip_content TEXT NOT NULL, -- nội dung mẹo
    sort_order INT NOT NULL DEFAULT 0, -- thứ tự sắp xếp
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật
    deleted_at DATETIME NULL, -- ngày xóa
    CONSTRAINT fk_destination_tips_destination 
    FOREIGN KEY (destination_id)
    REFERENCES destinations(id) 
    ON DELETE CASCADE
)  ENGINE=INNODB; 

-- Bảng sự kiện điểm đến
CREATE TABLE IF NOT EXISTS destination_events (     
	id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id sự kiện điểm đến
    destination_id BIGINT NOT NULL, -- id điểm đến
    event_name VARCHAR(200) NOT NULL, -- tên sự kiện
    event_type VARCHAR(80), -- loại sự kiện
    description TEXT, -- mô tả
    starts_at DATETIME NULL, -- ngày bắt đầu
    ends_at DATETIME NULL, -- ngày kết thúc
    notify_all_followers BOOLEAN NOT NULL DEFAULT FALSE, -- có thông báo cho tất cả người theo dõi không
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- có hoạt động không
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật
    deleted_at DATETIME NULL, -- ngày xóa
    CONSTRAINT fk_destination_events_destination 
    FOREIGN KEY (destination_id) 
    REFERENCES destinations(id) 
    ON DELETE CASCADE 
) ENGINE=InnoDB; 

-- Bảng theo dõi điểm đến
CREATE TABLE IF NOT EXISTS destination_follows ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id theo dõi điểm đến
    user_id CHAR(36) NOT NULL, -- id người theo dõi
    destination_id BIGINT NOT NULL, -- id điểm đến
    notify_event BOOLEAN NOT NULL DEFAULT TRUE, -- có thông báo cho sự kiện không
    notify_voucher BOOLEAN NOT NULL DEFAULT TRUE, -- có thông báo cho voucher không
    notify_new_tour BOOLEAN NOT NULL DEFAULT TRUE, -- có thông báo cho tour mới không
    notify_best_season BOOLEAN NOT NULL DEFAULT TRUE, -- có thông báo cho mùa tốt nhất không
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật
    deleted_at DATETIME NULL, -- ngày xóa
    UNIQUE KEY uk_destination_follow (user_id, destination_id), 
    CONSTRAINT fk_destination_follows_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE, 
    CONSTRAINT fk_destination_follows_destination 
    FOREIGN KEY (destination_id) 
    REFERENCES destinations(id) 
    ON DELETE CASCADE 
) ENGINE=InnoDB; 


-- 3. TAGS / POLICIES / GUIDES -- 


CREATE TABLE IF NOT EXISTS tags (
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    code VARCHAR(50) NOT NULL UNIQUE, 
    name VARCHAR(100) NOT NULL, 
    tag_group VARCHAR(100), 
    description TEXT, 
    is_active BOOLEAN NOT NULL DEFAULT TRUE, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
) ENGINE=InnoDB; 


CREATE TABLE IF NOT EXISTS cancellation_policies ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(150) NOT NULL UNIQUE, 
    description TEXT, 
    voucher_bonus_percent DECIMAL(5,2) NOT NULL DEFAULT 0, 
    is_default BOOLEAN NOT NULL DEFAULT FALSE, 
    is_active BOOLEAN NOT NULL DEFAULT TRUE, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
    ) ENGINE=InnoDB; 
    
    
CREATE TABLE IF NOT EXISTS cancellation_policy_rules ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    policy_id BIGINT NOT NULL, 
    min_hours_before INT NULL, 
    max_hours_before INT NULL, 
    refund_percent DECIMAL(5,2) NOT NULL DEFAULT 0, 
    voucher_percent DECIMAL(5,2) NOT NULL DEFAULT 0, 
    fee_percent DECIMAL(5,2) NOT NULL DEFAULT 0, 
    allow_reschedule BOOLEAN NOT NULL DEFAULT FALSE, 
    notes TEXT, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_cancellation_policy_rules_policy
    FOREIGN KEY (policy_id) 
    REFERENCES cancellation_policies(id) 
    ON DELETE CASCADE 
) ENGINE=InnoDB; 


CREATE TABLE IF NOT EXISTS guides ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    code VARCHAR(30) UNIQUE, 
    full_name VARCHAR(150) NOT NULL, 
    phone VARCHAR(20), 
    email VARCHAR(150), 
    gender ENUM('male', 'female', 'other', 'unknown') NOT NULL DEFAULT 'unknown', 
    local_region VARCHAR(120), 
    languages JSON NULL, 
    specialties JSON NULL, 
    bio TEXT, 
    rating_avg DECIMAL(3,2) NOT NULL DEFAULT 0, 
    total_tours_led INT NOT NULL DEFAULT 0, 
    status ENUM('active', 'inactive', 'busy', 'suspended') NOT NULL DEFAULT 'active', 
    is_local_guide BOOLEAN NOT NULL DEFAULT TRUE, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS guide_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    guide_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    full_name VARCHAR(150),
    bio TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_guide_translations_guide_locale (guide_id, locale),
    CONSTRAINT fk_guide_translations_guide
        FOREIGN KEY (guide_id) REFERENCES guides (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. TOURS / ITINERARY / SCHEDULE -- 

-- Bảng tour
CREATE TABLE IF NOT EXISTS tours (
    id BIGINT PRIMARY KEY AUTO_INCREMENT, -- id tour
    code VARCHAR(30) NOT NULL UNIQUE, -- mã tour
    name VARCHAR(255) NOT NULL, -- tên tour
    slug VARCHAR(280) NOT NULL UNIQUE, -- slug tour
    destination_id BIGINT NOT NULL, -- id điểm đến
    cancellation_policy_id BIGINT NULL, -- id chính sách hủy
    short_description TEXT, -- mô tả ngắn
    description TEXT, -- mô tả đầy đủ
    highlights TEXT, -- điểm nổi bật
    inclusions TEXT, -- bao gồm
    exclusions TEXT, -- không bao gồm
    notes TEXT, -- ghi chú
    duration_days SMALLINT NOT NULL, -- số ngày
    duration_nights SMALLINT NOT NULL DEFAULT 0, -- số đêm
    base_price DECIMAL(14 , 2 ) NOT NULL DEFAULT 0, -- giá cơ bản
    currency CHAR(3) NOT NULL DEFAULT 'VND', -- loại tiền tệ
    transport_type VARCHAR(120), -- loại phương tiện
    trip_mode ENUM('group', 'private', 'shared') NOT NULL DEFAULT 'group', -- loại tour
    difficulty_level TINYINT NOT NULL DEFAULT 1, -- độ khó
    activity_level TINYINT NOT NULL DEFAULT 1, -- độ hoạt động
    min_age SMALLINT NULL, -- tuổi tối thiểu
    max_age SMALLINT NULL, -- tuổi tối đa
    min_group_size SMALLINT NOT NULL DEFAULT 1, -- số người tối thiểu
    max_group_size SMALLINT NOT NULL DEFAULT 50, -- số người tối đa
    is_student_friendly BOOLEAN NOT NULL DEFAULT FALSE, -- có phù hợp với sinh viên không
    is_family_friendly BOOLEAN NOT NULL DEFAULT FALSE, -- có phù hợp với gia đình không
    is_senior_friendly BOOLEAN NOT NULL DEFAULT FALSE, -- có phù hợp với người già không
    is_featured BOOLEAN NOT NULL DEFAULT FALSE, -- có được đặt làm tour nổi bật không
    average_rating DECIMAL(3 , 2 ) NOT NULL DEFAULT 0, -- điểm trung bình
    total_reviews INT NOT NULL DEFAULT 0, -- số đánh giá
    total_bookings INT NOT NULL DEFAULT 0, -- số đặt tour
    status ENUM('draft', 'active', 'inactive', 'archived') NOT NULL DEFAULT 'draft', -- trạng thái tour
    created_by CHAR(36) NULL, -- id người tạo
    updated_by CHAR(36) NULL, -- id người cập nhật
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ngày tạo
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- ngày cập nhật
    deleted_at DATETIME NULL, -- ngày xóa
    CONSTRAINT fk_tours_destination FOREIGN KEY (destination_id)
        REFERENCES destinations (id),
    CONSTRAINT fk_tours_policy FOREIGN KEY (cancellation_policy_id)
        REFERENCES cancellation_policies (id),
    CONSTRAINT fk_tours_created_by FOREIGN KEY (created_by)
        REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_tours_updated_by FOREIGN KEY (updated_by)
        REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT chk_duration_days CHECK (duration_days > 0),
    CONSTRAINT chk_duration_nights CHECK (duration_nights >= 0),
    CONSTRAINT chk_difficulty_level CHECK (difficulty_level BETWEEN 1 AND 5),
    CONSTRAINT chk_activity_level CHECK (activity_level BETWEEN 1 AND 5)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS tour_translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_id BIGINT NOT NULL,
    locale VARCHAR(10) NOT NULL,
    name VARCHAR(255),
    short_description TEXT,
    description TEXT,
    highlights TEXT,
    inclusions TEXT,
    exclusions TEXT,
    notes TEXT,
    itinerary_summary TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tour_translations_tour_locale (tour_id, locale),
    CONSTRAINT fk_tour_translations_tour
        FOREIGN KEY (tour_id) REFERENCES tours (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS tour_tags (
    tour_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    PRIMARY KEY (tour_id , tag_id),
    CONSTRAINT fk_tour_tags_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_tags_tag FOREIGN KEY (tag_id)
        REFERENCES tags (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS tour_media (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_id BIGINT NOT NULL,
    media_type ENUM('image', 'video', 'cover', 'banner') NOT NULL DEFAULT 'image',
    media_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_tour_media_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS tour_seasonality (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_id BIGINT NOT NULL,
    season_name VARCHAR(100) NOT NULL,
    month_from TINYINT NULL,
    month_to TINYINT NULL,
    recommendation_score DECIMAL(5 , 2 ) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_tour_seasonality_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS tour_itinerary_days (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_id BIGINT NOT NULL,
    day_number SMALLINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    overnight_destination_id BIGINT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    UNIQUE KEY uk_tour_day (tour_id , day_number),
    CONSTRAINT fk_tour_itinerary_days_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_itinerary_days_destination FOREIGN KEY (overnight_destination_id)
        REFERENCES destinations (id)
        ON DELETE SET NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS itinerary_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    itinerary_day_id BIGINT NOT NULL,
    sequence_no SMALLINT NOT NULL DEFAULT 1,
    item_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    destination_id BIGINT NULL,
    location_name VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10 , 7 ),
    longitude DECIMAL(10 , 7 ),
    google_map_url TEXT,
    start_time TIME NULL,
    end_time TIME NULL,
    travel_minutes_estimated INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    UNIQUE KEY uk_itinerary_items_sequence (itinerary_day_id , sequence_no),
    CONSTRAINT fk_itinerary_items_day FOREIGN KEY (itinerary_day_id)
        REFERENCES tour_itinerary_days (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_itinerary_items_destination FOREIGN KEY (destination_id)
        REFERENCES destinations (id)
        ON DELETE SET NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS tour_checklist_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_id BIGINT NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    item_group VARCHAR(80),
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_tour_checklist_items_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id)
        ON DELETE CASCADE
)  ENGINE=INNODB; 


CREATE TABLE IF NOT EXISTS tour_schedules ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
	schedule_code VARCHAR(40) UNIQUE, 
	tour_id BIGINT NOT NULL, 
	departure_at DATETIME NOT NULL, 
	return_at DATETIME NOT NULL, 
	booking_open_at DATETIME NULL, 
	booking_close_at DATETIME NULL, 
	meeting_at DATETIME NULL, 
	meeting_point_name VARCHAR(200), 
	meeting_address TEXT, 
	meeting_latitude DECIMAL(10,7), 
	meeting_longitude DECIMAL(10,7), 
	capacity_total INT NOT NULL, 
	booked_seats INT NOT NULL DEFAULT 0, 
	min_guests_to_operate INT NOT NULL DEFAULT 1, 
	adult_price DECIMAL(14,2) NOT NULL DEFAULT 0, 
	child_price DECIMAL(14,2) NOT NULL DEFAULT 0, 
	infant_price DECIMAL(14,2) NOT NULL DEFAULT 0, 
	senior_price DECIMAL(14,2) NOT NULL DEFAULT 0, 
	single_room_surcharge DECIMAL(14,2) NOT NULL DEFAULT 0, 
	transport_detail VARCHAR(255), 
	note TEXT, status ENUM('draft', 'open', 'closed', 'full', 'departed', 'completed', 'cancelled') NOT NULL DEFAULT 'draft', 
	remaining_seats INT GENERATED ALWAYS AS (capacity_total - booked_seats) STORED, 
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	deleted_at DATETIME NULL,
	CONSTRAINT fk_tour_schedules_tour 
	FOREIGN KEY (tour_id) 
	REFERENCES tours(id) 
	ON DELETE CASCADE, 
	CONSTRAINT chk_schedule_time CHECK (return_at > departure_at), 
	CONSTRAINT chk_capacity_total CHECK (capacity_total > 0), 
	CONSTRAINT chk_booked_seats CHECK (booked_seats >= 0) 
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS tour_schedule_pickup_points (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    point_name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10 , 7 ),
    longitude DECIMAL(10 , 7 ),
    pickup_at DATETIME NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_tour_schedule_pickup_points_schedule FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS tour_schedule_guides (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    guide_id BIGINT NOT NULL,
    guide_role VARCHAR(80) NOT NULL DEFAULT 'main',
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    UNIQUE KEY uk_schedule_guide (schedule_id , guide_id),
    CONSTRAINT fk_tour_schedule_guides_schedule FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_schedule_guides_guide FOREIGN KEY (guide_id)
        REFERENCES guides (id)
)  ENGINE=INNODB; 
-- 5. PROMOTIONS / VOUCHERS / MISSIONS / COMBO / PRODUCTS -- 
CREATE TABLE IF NOT EXISTS promotion_campaigns ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    code VARCHAR(40) NOT NULL UNIQUE, 
    name VARCHAR(200) NOT NULL, 
    description TEXT, 
    image_url TEXT NULL,
    image_alt VARCHAR(180) NULL,
    display_title VARCHAR(160) NULL,
    display_subtitle VARCHAR(255) NULL,
    badge_text VARCHAR(80) NULL,
    cta_label VARCHAR(80) NULL,
    cta_url VARCHAR(255) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    start_at DATETIME NOT NULL, 
    end_at DATETIME NOT NULL, 
    target_member_level ENUM('bronze', 'silver', 'gold', 'platinum', 'diamond') NULL, 
    conditions_json JSON NULL, 
    reward_json JSON NULL, 
    is_active BOOLEAN NOT NULL DEFAULT TRUE, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP 
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS vouchers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    campaign_id BIGINT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount', 'gift', 'cashback') NOT NULL,
    discount_value DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    max_discount_amount DECIMAL(14 , 2 ) NULL,
    min_order_value DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    usage_limit_total INT NULL,
    usage_limit_per_user INT NOT NULL DEFAULT 1,
    used_count INT NOT NULL DEFAULT 0,
    applicable_scope VARCHAR(50) NOT NULL DEFAULT 'all',
    applicable_tour_id BIGINT NULL,
    applicable_destination_id BIGINT NULL,
    applicable_member_level ENUM('bronze', 'silver', 'gold', 'platinum', 'diamond') NULL,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    is_stackable BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vouchers_campaign FOREIGN KEY (campaign_id)
        REFERENCES promotion_campaigns (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_vouchers_tour FOREIGN KEY (applicable_tour_id)
        REFERENCES tours (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_vouchers_destination FOREIGN KEY (applicable_destination_id)
        REFERENCES destinations (id)
        ON DELETE SET NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS voucher_user_claims (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    voucher_id BIGINT NOT NULL,
    user_id CHAR(36) NOT NULL,
    claimed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    used_count INT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_voucher_user_claim (voucher_id , user_id),
    CONSTRAINT fk_voucher_user_claims_voucher FOREIGN KEY (voucher_id)
        REFERENCES vouchers (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_voucher_user_claims_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
)  ENGINE=INNODB; 


CREATE TABLE IF NOT EXISTS mission_definitions ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
	code VARCHAR(50) NOT NULL UNIQUE, 
    name VARCHAR(200) NOT NULL, 
    description TEXT, 
    rule_json JSON NULL, 
    reward_type ENUM('voucher', 'points', 'gift') NOT NULL, 
    reward_value DECIMAL(14,2) NOT NULL DEFAULT 0, 
    reward_ref_id BIGINT NULL, 
    start_at DATETIME NULL, 
    end_at DATETIME NULL, 
    is_active BOOLEAN NOT NULL DEFAULT TRUE, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS user_missions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    mission_id BIGINT NOT NULL,
    progress DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    goal DECIMAL(14 , 2 ) NOT NULL DEFAULT 1,
    status ENUM('in_progress', 'completed', 'claimed', 'expired') NOT NULL DEFAULT 'in_progress',
    completed_at DATETIME NULL,
    claimed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    UNIQUE KEY uk_user_mission (user_id , mission_id),
    CONSTRAINT fk_user_missions_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_missions_mission FOREIGN KEY (mission_id)
        REFERENCES mission_definitions (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS combo_packages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    base_price DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS combo_package_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combo_id BIGINT NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    item_ref_id BIGINT NULL,
    item_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_combo_package_items_combo FOREIGN KEY (combo_id)
        REFERENCES combo_packages (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    product_type ENUM('gear', 'insurance', 'food', 'souvenir', 'service', 'gift') NOT NULL,
    unit_price DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    stock_qty INT NOT NULL DEFAULT 0,
    is_giftable BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)  ENGINE=INNODB; 


-- 6. BOOKINGS / PASSENGERS / HISTORY --

-- =========================================================
-- TRAVELVIET EXTENSION (tables only; indexes -> V2, views -> V3)
-- Schema = connection default (no USE ...).
-- =========================================================

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    user_id CHAR(36) NOT NULL,
    status ENUM('draft','pending_payment','partially_paid','paid','processing','completed','cancelled','expired','refunded') NOT NULL DEFAULT 'draft',
    payment_status ENUM('unpaid','partial','paid','failed','refunded','chargeback') NOT NULL DEFAULT 'unpaid',
    order_source VARCHAR(30) NOT NULL DEFAULT 'app',
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    subtotal_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    voucher_discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    loyalty_discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    addon_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    note TEXT,
    expires_at DATETIME NULL,
    placed_at DATETIME NULL,
    completed_at DATETIME NULL,
    cancelled_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    item_type ENUM('booking','product','combo','addon','insurance','service') NOT NULL,
    item_ref_id BIGINT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    line_total DECIMAL(14,2) NOT NULL DEFAULT 0,
    metadata_json JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_order_items_qty CHECK (quantity > 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    booking_code VARCHAR(50) UNIQUE, 
    user_id CHAR(36) NOT NULL, 
    order_id BIGINT NULL,
    tour_id BIGINT NOT NULL, 
    schedule_id BIGINT NOT NULL, 
    status ENUM('pending_payment', 'confirmed', 'checked_in', 'completed', 'cancel_requested', 'cancelled', 'refunded', 'expired') NOT NULL DEFAULT 'pending_payment', 
    payment_status ENUM('unpaid', 'partial', 'paid', 'failed', 'refunded', 'chargeback') NOT NULL DEFAULT 'unpaid', 
    contact_name VARCHAR(150) NOT NULL, 
    contact_phone VARCHAR(20) NOT NULL, 
    contact_email VARCHAR(150), 
    adults INT NOT NULL DEFAULT 1, 
    children INT NOT NULL DEFAULT 0, 
    infants INT NOT NULL DEFAULT 0, 
    seniors INT NOT NULL DEFAULT 0, 
    people_count INT GENERATED ALWAYS AS (adults + children + infants + seniors) STORED, 
    seat_count INT GENERATED ALWAYS AS (adults + children + seniors) STORED, 
    subtotal_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    voucher_discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    loyalty_discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    addon_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    tax_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    final_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    currency CHAR(3) NOT NULL DEFAULT 'VND', 
    voucher_id BIGINT NULL, 
    combo_id BIGINT NULL, 
    booking_source VARCHAR(30) NOT NULL DEFAULT 'app', 
    special_requests TEXT, 
    cancel_reason TEXT, 
    cancelled_at DATETIME NULL, 
    completed_at DATETIME NULL, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_bookings_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id), 
    CONSTRAINT fk_bookings_tour 
    FOREIGN KEY (tour_id) 
    REFERENCES tours(id), 
    CONSTRAINT fk_bookings_schedule 
    FOREIGN KEY (schedule_id) 
    REFERENCES tour_schedules(id), 
    CONSTRAINT fk_bookings_voucher 
    FOREIGN KEY (voucher_id) 
    REFERENCES vouchers(id) 
    ON DELETE SET NULL, 
    CONSTRAINT fk_bookings_combo 
    FOREIGN KEY (combo_id) 
    REFERENCES combo_packages(id) ON DELETE SET NULL, 

    CONSTRAINT fk_bookings_order
    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE SET NULL,
    CONSTRAINT chk_booking_people CHECK ((adults + children + infants + seniors) > 0) 
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS booking_passengers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    passenger_type ENUM('adult', 'child', 'infant', 'senior') NOT NULL DEFAULT 'adult',
    full_name VARCHAR(150) NOT NULL,
    gender ENUM('male', 'female', 'other', 'unknown') NOT NULL DEFAULT 'unknown',
    date_of_birth DATE NULL,
    identity_no VARCHAR(50),
    passport_no VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(150),
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(20),
    medical_note TEXT,
    meal_note TEXT,
    seat_note TEXT,
    checked_in BOOLEAN NOT NULL DEFAULT FALSE,
    checked_in_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_booking_passengers_booking FOREIGN KEY (booking_id)
        REFERENCES bookings (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS booking_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    old_status ENUM('pending_payment', 'confirmed', 'checked_in', 'completed', 'cancel_requested', 'cancelled', 'refunded', 'expired') NULL,
    new_status ENUM('pending_payment', 'confirmed', 'checked_in', 'completed', 'cancel_requested', 'cancelled', 'refunded', 'expired') NOT NULL,
    changed_by CHAR(36) NULL,
    change_reason TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_status_history_booking FOREIGN KEY (booking_id)
        REFERENCES bookings (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_status_history_user FOREIGN KEY (changed_by)
        REFERENCES users (id)
        ON DELETE SET NULL
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS booking_products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    line_total DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    is_free_gift BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_products_booking FOREIGN KEY (booking_id)
        REFERENCES bookings (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_products_product FOREIGN KEY (product_id)
        REFERENCES products (id)
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS booking_combo_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    combo_id BIGINT NOT NULL,
    unit_price DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    final_price DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_combo_items_booking FOREIGN KEY (booking_id)
        REFERENCES bookings (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_combo_items_combo FOREIGN KEY (combo_id)
        REFERENCES combo_packages (id)
)  ENGINE=INNODB; 

-- 7. PAYMENTS / REFUNDS -- 

CREATE TABLE IF NOT EXISTS payments ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    payment_code VARCHAR(50) UNIQUE, 
    booking_id BIGINT NOT NULL, 
    order_id BIGINT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'credit_card', 'e_wallet', 'qr', 'gateway') NOT NULL, 
    provider VARCHAR(100), 
    transaction_ref VARCHAR(150), 
    amount DECIMAL(14,2) NOT NULL, 
    currency CHAR(3) NOT NULL DEFAULT 'VND', status ENUM('unpaid', 'partial', 'paid', 'failed', 'refunded', 'chargeback') NOT NULL DEFAULT 'unpaid', 
    paid_at DATETIME NULL, 
    request_payload JSON NULL, 
    response_payload JSON NULL, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_payments_order 
    FOREIGN KEY (order_id) 
    REFERENCES orders(id) 
    ON DELETE SET NULL,
    CONSTRAINT fk_payments_booking 
    FOREIGN KEY (booking_id) 
    REFERENCES bookings(id) 
    ON DELETE CASCADE 
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS refund_requests ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    refund_code VARCHAR(50) UNIQUE, 
    booking_id BIGINT NOT NULL, 
    requested_by CHAR(36) NULL, 
    reason_type VARCHAR(100), 
    reason_detail TEXT, 
    requested_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    quoted_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    approved_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    voucher_offer_amount DECIMAL(14,2) NOT NULL DEFAULT 0, 
    refund_method ENUM('original_method', 'bank_transfer', 'wallet', 'voucher') NULL, 
    status ENUM('requested', 'quoted', 'approved', 'rejected', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'requested',
    policy_snapshot JSON NULL, 
    processed_by CHAR(36) NULL, 
    processed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_refund_requests_booking
    FOREIGN KEY (booking_id) 
    REFERENCES bookings(id) ON DELETE CASCADE, 
    CONSTRAINT fk_refund_requests_user_requested 
    FOREIGN KEY (requested_by) 
    REFERENCES users(id) ON DELETE SET NULL, 
    CONSTRAINT fk_refund_requests_user_processed 
    FOREIGN KEY (processed_by) 
    REFERENCES users(id) ON DELETE SET NULL 
) ENGINE=InnoDB; 


-- 8. REVIEWS / ANALYSIS -- 


CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL UNIQUE,
    user_id CHAR(36) NOT NULL,
    tour_id BIGINT NOT NULL,
    schedule_id BIGINT NULL,
    overall_rating TINYINT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    sentiment ENUM('positive', 'neutral', 'negative', 'mixed') NOT NULL DEFAULT 'neutral',
    would_recommend BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id)
        REFERENCES bookings (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reviews_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reviews_schedule FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules (id)
        ON DELETE SET NULL,
    CONSTRAINT chk_reviews_rating CHECK (overall_rating BETWEEN 1 AND 5)
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS review_aspects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    review_id BIGINT NOT NULL,
    aspect_name VARCHAR(100) NOT NULL,
    aspect_rating TINYINT NOT NULL,
    comment TEXT,
    UNIQUE KEY uk_review_aspect (review_id , aspect_name),
    CONSTRAINT fk_review_aspects_review FOREIGN KEY (review_id)
        REFERENCES reviews (id)
        ON DELETE CASCADE,
    CONSTRAINT chk_review_aspects_rating CHECK (aspect_rating BETWEEN 1 AND 5)
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS review_replies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    review_id BIGINT NOT NULL,
    staff_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_replies_review FOREIGN KEY (review_id)
        REFERENCES reviews (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_review_replies_staff FOREIGN KEY (staff_id)
        REFERENCES users (id)
)  ENGINE=INNODB; 


CREATE TABLE IF NOT EXISTS review_analysis ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    review_id BIGINT NOT NULL UNIQUE, 
    positive_points JSON NULL, 
    negative_points JSON NULL, 
    keywords JSON NULL, 
    summary TEXT, 
    processed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_review_analysis_review 
    FOREIGN KEY (review_id) 
    REFERENCES reviews(id) 
    ON DELETE CASCADE 
) ENGINE=InnoDB; 


-- 9. WEATHER / CROWD / ROUTE -- 


CREATE TABLE IF NOT EXISTS weather_forecasts ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
	destination_id BIGINT NOT NULL, 
	forecast_date DATE NOT NULL, 
	weather_code VARCHAR(50), 
	summary VARCHAR(255), 
	temp_min DECIMAL(5,2), 
	temp_max DECIMAL(5,2), 
	humidity_percent DECIMAL(5,2), 
	wind_speed DECIMAL(6,2), 
	rain_probability DECIMAL(5,2), 
	source_name VARCHAR(100), 
	raw_payload JSON NULL, 
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
	UNIQUE KEY uk_weather_forecast (destination_id, forecast_date), 
	CONSTRAINT fk_weather_forecasts_destination 
	FOREIGN KEY (destination_id) 
	REFERENCES destinations(id) 
	ON DELETE CASCADE 
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS weather_alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT NOT NULL,
    schedule_id BIGINT NULL,
    severity ENUM('info', 'watch', 'warning', 'danger') NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_advice TEXT,
    valid_from DATETIME NOT NULL,
    valid_to DATETIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_weather_alerts_destination FOREIGN KEY (destination_id)
        REFERENCES destinations (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_weather_alerts_schedule FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules (id)
        ON DELETE SET NULL
)  ENGINE=INNODB; 


CREATE TABLE IF NOT EXISTS crowd_predictions ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
	destination_id BIGINT NOT NULL, 
	prediction_date DATE NOT NULL, 
	crowd_level ENUM('low', 'medium', 'high', 'very_high') NOT NULL, 
	predicted_visitors INT NULL, confidence_score DECIMAL(5,2), 
	reasons_json JSON NULL, 
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
	UNIQUE KEY uk_crowd_prediction (destination_id, prediction_date), 
	CONSTRAINT fk_crowd_predictions_destination 
	FOREIGN KEY (destination_id) 
	REFERENCES destinations(id) 
	ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS route_estimates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    from_label VARCHAR(255),
    to_label VARCHAR(255),
    from_latitude DECIMAL(10 , 7 ),
    from_longitude DECIMAL(10 , 7 ),
    to_latitude DECIMAL(10 , 7 ),
    to_longitude DECIMAL(10 , 7 ),
    distance_km DECIMAL(10 , 2 ),
    duration_minutes INT,
    google_map_url TEXT,
    source_name VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB; 



-- 10. NOTIFICATIONS -- 


CREATE TABLE IF NOT EXISTS notifications ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    user_id CHAR(36) NULL, 
    notification_type ENUM('booking', 'payment', 'weather', 'promotion', 'schedule_change', 'reminder', 'system', 'chat', 'destination_follow') NOT NULL, channel ENUM('push', 'email', 'sms', 'in_app') NOT NULL DEFAULT 'in_app', 
    title VARCHAR(255) NOT NULL, 
    body TEXT NOT NULL, 
    reference_type VARCHAR(80), 
    reference_id BIGINT NULL, 
    payload JSON NULL, 
    scheduled_at DATETIME NULL, 
    sent_at DATETIME NULL, 
    read_at DATETIME NULL, 
    is_broadcast BOOLEAN NOT NULL DEFAULT FALSE, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_notifications_user 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE 
) ENGINE=InnoDB; 



-- 11. SUPPORT CHAT / TOUR MEMBER CHAT -- 


CREATE TABLE IF NOT EXISTS support_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_code VARCHAR(50) UNIQUE,
    user_id CHAR(36) NOT NULL,
    assigned_staff_id CHAR(36) NULL,
    status ENUM('open', 'waiting_staff', 'waiting_customer', 'resolved', 'closed') NOT NULL DEFAULT 'open',
    rating TINYINT NULL,
    feedback TEXT NULL,
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME NULL,
    last_message_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_support_sessions_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_support_sessions_staff FOREIGN KEY (assigned_staff_id)
        REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT chk_support_session_rating CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5))
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS support_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    sender_type ENUM('customer', 'staff', 'bot', 'system') NOT NULL,
    sender_user_id CHAR(36) NULL,
    message_text TEXT NOT NULL,
    attachment_url TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_support_messages_session FOREIGN KEY (session_id)
        REFERENCES support_sessions (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_support_messages_user FOREIGN KEY (sender_user_id)
        REFERENCES users (id)
        ON DELETE SET NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS schedule_chat_rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL UNIQUE,
    room_name VARCHAR(200) NOT NULL,
    visibility ENUM('all_members', 'staff_only') NOT NULL DEFAULT 'all_members',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_chat_rooms_schedule FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS schedule_chat_room_members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    user_id CHAR(36) NOT NULL,
    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_muted BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE KEY uk_schedule_chat_member (room_id , user_id),
    CONSTRAINT fk_schedule_chat_room_members_room FOREIGN KEY (room_id)
        REFERENCES schedule_chat_rooms (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_schedule_chat_room_members_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS schedule_chat_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    sender_user_id CHAR(36) NOT NULL,
    message_text TEXT NOT NULL,
    attachment_url TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_chat_messages_room FOREIGN KEY (room_id)
        REFERENCES schedule_chat_rooms (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_schedule_chat_messages_user FOREIGN KEY (sender_user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
)  ENGINE=INNODB; 

-- 12. PASSPORT / BADGES / CHECKIN -- 


CREATE TABLE IF NOT EXISTS travel_passports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL UNIQUE,
    passport_no VARCHAR(50) UNIQUE,
    total_tours INT NOT NULL DEFAULT 0,
    total_destinations INT NOT NULL DEFAULT 0,
    total_checkins INT NOT NULL DEFAULT 0,
    last_trip_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_travel_passports_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
)  ENGINE=INNODB; 


CREATE TABLE IF NOT EXISTS badge_definitions ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    code VARCHAR(50) NOT NULL UNIQUE, 
    name VARCHAR(150) NOT NULL, 
    description TEXT, 
    icon_url TEXT, 
    condition_json JSON NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP 
) ENGINE=InnoDB;
    
    
CREATE TABLE IF NOT EXISTS passport_badges (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    passport_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    unlocked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_passport_badge (passport_id , badge_id),
    CONSTRAINT fk_passport_badges_passport FOREIGN KEY (passport_id)
        REFERENCES travel_passports (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_passport_badges_badge FOREIGN KEY (badge_id)
        REFERENCES badge_definitions (id)
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS user_checkins (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    booking_id BIGINT NULL,
    destination_id BIGINT NULL,
    checkin_latitude DECIMAL(10 , 7 ),
    checkin_longitude DECIMAL(10 , 7 ),
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_checkins_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_checkins_booking FOREIGN KEY (booking_id)
        REFERENCES bookings (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_user_checkins_destination FOREIGN KEY (destination_id)
        REFERENCES destinations (id)
        ON DELETE SET NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS passport_visited_destinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    passport_id BIGINT NOT NULL,
    destination_id BIGINT NOT NULL,
    first_booking_id BIGINT NULL,
    first_visited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_visited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_passport_visited_destination (passport_id , destination_id),
    CONSTRAINT fk_passport_visited_destinations_passport FOREIGN KEY (passport_id)
        REFERENCES travel_passports (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_passport_visited_destinations_destination FOREIGN KEY (destination_id)
        REFERENCES destinations (id),
    CONSTRAINT fk_passport_visited_destinations_booking FOREIGN KEY (first_booking_id)
        REFERENCES bookings (id)
        ON DELETE SET NULL
)  ENGINE=INNODB; 


-- 13. USER BEHAVIOR / WISHLIST / RECOMMENDATION -- 


CREATE TABLE IF NOT EXISTS user_tour_views (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    tour_id BIGINT NOT NULL,
    viewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_tour_views_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_tour_views_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id)
        ON DELETE CASCADE
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS wishlist_tours (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    tour_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_wishlist_tour (user_id , tour_id),
    CONSTRAINT fk_wishlist_tours_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_tours_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id)
        ON DELETE CASCADE
)  ENGINE=INNODB; 


CREATE TABLE IF NOT EXISTS recommendation_logs ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    user_id CHAR(36) NULL, 
    requested_tag VARCHAR(100), 
    requested_budget ENUM('low', 'medium', 'high', 'luxury') NULL, 
    requested_trip_mode ENUM('group', 'private', 'shared') NULL, 
    requested_people_count INT NULL, 
    requested_departure_at DATETIME NULL, 
    generated_result JSON NULL, 
    scoring_detail JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_recommendation_logs_user 
    FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE SET NULL 
) ENGINE=InnoDB; 


-- 14. AUDIT LOG --
CREATE TABLE IF NOT EXISTS audit_logs ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    actor_user_id CHAR(36) NULL, 
    action_name VARCHAR(120) NOT NULL, 
    entity_name VARCHAR(120) NOT NULL, 
    entity_id VARCHAR(120) NOT NULL, 
    old_data JSON NULL, 
    new_data JSON NULL, 
    ip_address VARCHAR(45), 
    user_agent TEXT, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_audit_logs_user 
    FOREIGN KEY (actor_user_id) 
    REFERENCES users(id) 
    ON DELETE SET NULL 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT NULL,
    order_id BIGINT NULL,
    booking_id BIGINT NULL,
    attempt_no INT NOT NULL DEFAULT 1,
    provider VARCHAR(100),
    payment_method ENUM('cash','bank_transfer','credit_card','e_wallet','qr','gateway') NOT NULL,
    status ENUM('initiated','redirected','pending','authorized','paid','failed','cancelled','expired','refunded') NOT NULL DEFAULT 'initiated',
    gateway_transaction_ref VARCHAR(150),
    gateway_response_code VARCHAR(100),
    gateway_message VARCHAR(255),
    request_payload JSON NULL,
    response_payload JSON NULL,
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_attempts_payment FOREIGN KEY (payment_id)
        REFERENCES payments(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_payment_attempts_order FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_payment_attempts_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_webhook_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    provider VARCHAR(100) NOT NULL,
    event_type VARCHAR(120),
    event_ref VARCHAR(150),
    order_id BIGINT NULL,
    payment_id BIGINT NULL,
    booking_id BIGINT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    payload JSON NULL,
    processed_result JSON NULL,
    received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME NULL,
    CONSTRAINT fk_payment_webhook_logs_order FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_payment_webhook_logs_payment FOREIGN KEY (payment_id)
        REFERENCES payments(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_payment_webhook_logs_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS refund_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    refund_request_id BIGINT NOT NULL,
    old_status ENUM('requested','quoted','approved','rejected','processing','completed','cancelled') NULL,
    new_status ENUM('requested','quoted','approved','rejected','processing','completed','cancelled') NOT NULL,
    changed_by CHAR(36) NULL,
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refund_status_history_request FOREIGN KEY (refund_request_id)
        REFERENCES refund_requests(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_refund_status_history_user FOREIGN KEY (changed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS refund_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    refund_request_id BIGINT NOT NULL,
    payment_id BIGINT NULL,
    provider VARCHAR(100),
    transaction_ref VARCHAR(150),
    amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    status ENUM('pending','processing','completed','failed','reversed') NOT NULL DEFAULT 'pending',
    response_payload JSON NULL,
    processed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_refund_transactions_request FOREIGN KEY (refund_request_id)
        REFERENCES refund_requests(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_refund_transactions_payment FOREIGN KEY (payment_id)
        REFERENCES payments(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS addon_definitions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    addon_type ENUM('room_upgrade','airport_transfer','meal','insurance','seat','equipment','service','other') NOT NULL DEFAULT 'other',
    description TEXT,
    pricing_mode ENUM('per_booking','per_person','per_adult','per_child','fixed') NOT NULL DEFAULT 'fixed',
    unit_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS booking_addons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    addon_id BIGINT NULL,
    addon_name VARCHAR(200) NOT NULL,
    pricing_mode ENUM('per_booking','per_person','per_adult','per_child','fixed') NOT NULL DEFAULT 'fixed',
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    line_total DECIMAL(14,2) NOT NULL DEFAULT 0,
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_addons_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_addons_addon FOREIGN KEY (addon_id)
        REFERENCES addon_definitions(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tour_price_rules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_id BIGINT NOT NULL,
    rule_name VARCHAR(200) NOT NULL,
    rule_type ENUM('seasonal','holiday','early_bird','last_minute','group_size','channel','member_level','custom') NOT NULL DEFAULT 'custom',
    target_guest_type ENUM('all','adult','child','infant','senior') NOT NULL DEFAULT 'all',
    adjust_type ENUM('fixed_amount','percentage','override_price') NOT NULL DEFAULT 'fixed_amount',
    adjust_value DECIMAL(14,2) NOT NULL DEFAULT 0,
    min_people_count INT NULL,
    max_people_count INT NULL,
    member_level ENUM('bronze','silver','gold','platinum','diamond') NULL,
    booking_from DATETIME NULL,
    booking_to DATETIME NULL,
    departure_from DATETIME NULL,
    departure_to DATETIME NULL,
    priority_no INT NOT NULL DEFAULT 1,
    is_stackable BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_price_rules_tour FOREIGN KEY (tour_id)
        REFERENCES tours(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS schedule_price_rules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    rule_name VARCHAR(200) NOT NULL,
    target_guest_type ENUM('all','adult','child','infant','senior') NOT NULL DEFAULT 'all',
    adjust_type ENUM('fixed_amount','percentage','override_price') NOT NULL DEFAULT 'override_price',
    adjust_value DECIMAL(14,2) NOT NULL DEFAULT 0,
    booking_from DATETIME NULL,
    booking_to DATETIME NULL,
    priority_no INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_price_rules_schedule FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(40) NOT NULL UNIQUE,
    supplier_type ENUM('hotel','transport','restaurant','insurance','local_partner','guide_partner','ticket_partner','other') NOT NULL DEFAULT 'other',
    name VARCHAR(200) NOT NULL,
    legal_name VARCHAR(255),
    tax_code VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(150),
    website VARCHAR(255),
    province VARCHAR(120),
    district VARCHAR(120),
    address TEXT,
    status ENUM('active','inactive','blacklisted') NOT NULL DEFAULT 'active',
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS supplier_contacts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    job_title VARCHAR(120),
    phone VARCHAR(20),
    email VARCHAR(150),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_supplier_contacts_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS supplier_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NOT NULL,
    service_type ENUM('hotel','vehicle','meal','ticket','guide','insurance','other') NOT NULL DEFAULT 'other',
    service_name VARCHAR(200) NOT NULL,
    description TEXT,
    unit_price DECIMAL(14,2) NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_supplier_services_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tour_supplier_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_id BIGINT NOT NULL,
    supplier_service_id BIGINT NOT NULL,
    quantity_default INT NOT NULL DEFAULT 1,
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_supplier_services_tour FOREIGN KEY (tour_id)
        REFERENCES tours(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_supplier_services_service FOREIGN KEY (supplier_service_id)
        REFERENCES supplier_services(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotels (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NULL,
    code VARCHAR(40) UNIQUE,
    name VARCHAR(200) NOT NULL,
    star_rating DECIMAL(2,1) NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    province VARCHAR(120),
    district VARCHAR(120),
    address TEXT,
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL,
    checkin_time TIME NULL,
    checkout_time TIME NULL,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hotels_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NULL,
    code VARCHAR(40) UNIQUE,
    vehicle_type ENUM('car','van','bus','boat','train','plane','other') NOT NULL DEFAULT 'other',
    plate_no VARCHAR(50),
    seat_capacity INT NULL,
    brand_name VARCHAR(100),
    model_name VARCHAR(100),
    status ENUM('active','inactive','maintenance') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicles_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS schedule_resource_allocations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    resource_type ENUM('hotel','vehicle','supplier_service','guide','other') NOT NULL,
    resource_ref_id BIGINT NULL,
    resource_name VARCHAR(200) NOT NULL,
    supplier_id BIGINT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_cost DECIMAL(14,2) NULL,
    total_cost DECIMAL(14,2) NULL,
    allocation_status ENUM('reserved','confirmed','cancelled','completed') NOT NULL DEFAULT 'reserved',
    note TEXT,
    allocated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_resource_allocations_schedule FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_schedule_resource_allocations_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS destination_proposals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    proposal_code VARCHAR(50) NOT NULL UNIQUE,
    proposed_by CHAR(36) NOT NULL,
    proposal_type ENUM('new_destination','update_destination') NOT NULL DEFAULT 'new_destination',
    destination_id BIGINT NULL,
    name VARCHAR(200) NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'VN',
    province VARCHAR(120),
    district VARCHAR(120),
    region VARCHAR(120),
    address TEXT,
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL,
    short_description TEXT,
    description TEXT,
    evidence_note TEXT,
    status ENUM('draft','submitted','under_review','approved','rejected','published','cancelled') NOT NULL DEFAULT 'draft',
    submitted_at DATETIME NULL,
    reviewed_by CHAR(36) NULL,
    reviewed_at DATETIME NULL,
    review_note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_destination_proposals_user FOREIGN KEY (proposed_by)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_destination_proposals_destination FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_destination_proposals_reviewer FOREIGN KEY (reviewed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS destination_proposal_attachments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    proposal_id BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    caption VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_destination_proposal_attachments_proposal FOREIGN KEY (proposal_id)
        REFERENCES destination_proposals(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS destination_proposal_reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    proposal_id BIGINT NOT NULL,
    reviewer_id CHAR(36) NOT NULL,
    decision ENUM('request_update','approve','reject') NOT NULL,
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_destination_proposal_reviews_proposal FOREIGN KEY (proposal_id)
        REFERENCES destination_proposals(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_destination_proposal_reviews_user FOREIGN KEY (reviewer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS wishlist_destinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    destination_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_wishlist_destination (user_id, destination_id),
    CONSTRAINT fk_wishlist_destinations_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_destinations_destination FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS saved_searches (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    search_name VARCHAR(150),
    keyword VARCHAR(255),
    filters_json JSON NULL,
    last_result_count INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_searches_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS saved_itineraries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    destination_id BIGINT NULL,
    title VARCHAR(200) NOT NULL,
    note TEXT,
    itinerary_json JSON NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_itineraries_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_saved_itineraries_destination FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS voucher_redemptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    voucher_id BIGINT NOT NULL,
    user_id CHAR(36) NOT NULL,
    order_id BIGINT NULL,
    booking_id BIGINT NULL,
    redeemed_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    status ENUM('reserved','applied','released','reversed') NOT NULL DEFAULT 'reserved',
    redeemed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    released_at DATETIME NULL,
    note TEXT,
    CONSTRAINT fk_voucher_redemptions_voucher FOREIGN KEY (voucher_id)
        REFERENCES vouchers(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_voucher_redemptions_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_voucher_redemptions_order FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_voucher_redemptions_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT NULL,
    booking_id BIGINT NULL,
    user_id CHAR(36) NOT NULL,
    invoice_type ENUM('personal','business') NOT NULL DEFAULT 'personal',
    billing_name VARCHAR(255) NOT NULL,
    billing_email VARCHAR(150),
    billing_phone VARCHAR(20),
    tax_code VARCHAR(50),
    billing_address TEXT,
    subtotal_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    status ENUM('draft','issued','cancelled') NOT NULL DEFAULT 'draft',
    issued_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_invoices_order FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_invoices_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_invoices_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoice_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    invoice_id BIGINT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    tax_rate_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
    line_total DECIMAL(14,2) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invoice_items_invoice FOREIGN KEY (invoice_id)
        REFERENCES invoices(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoice_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NULL,
    booking_id BIGINT NULL,
    user_id CHAR(36) NOT NULL,
    request_type ENUM('issue','reissue','cancel') NOT NULL DEFAULT 'issue',
    invoice_type ENUM('personal','business') NOT NULL DEFAULT 'personal',
    billing_name VARCHAR(255) NOT NULL,
    billing_email VARCHAR(150),
    billing_phone VARCHAR(20),
    tax_code VARCHAR(50),
    billing_address TEXT,
    status ENUM('requested','approved','rejected','completed') NOT NULL DEFAULT 'requested',
    note TEXT,
    processed_by CHAR(36) NULL,
    processed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_invoice_requests_order FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_invoice_requests_booking FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_invoice_requests_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_invoice_requests_staff FOREIGN KEY (processed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS commissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    source_type ENUM('booking','order','schedule') NOT NULL DEFAULT 'booking',
    source_ref_id BIGINT NOT NULL,
    beneficiary_type ENUM('user','guide','supplier','staff') NOT NULL,
    beneficiary_user_id CHAR(36) NULL,
    supplier_id BIGINT NULL,
    guide_id BIGINT NULL,
    commission_type ENUM('fixed_amount','percentage') NOT NULL DEFAULT 'fixed_amount',
    commission_value DECIMAL(14,2) NOT NULL DEFAULT 0,
    commission_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    status ENUM('pending','approved','paid','cancelled') NOT NULL DEFAULT 'pending',
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_commissions_user FOREIGN KEY (beneficiary_user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_commissions_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_commissions_guide FOREIGN KEY (guide_id)
        REFERENCES guides(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS partner_payouts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supplier_id BIGINT NOT NULL,
    payout_code VARCHAR(50) NOT NULL UNIQUE,
    period_from DATE NULL,
    period_to DATE NULL,
    gross_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    deduction_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    status ENUM('draft','approved','processing','paid','cancelled') NOT NULL DEFAULT 'draft',
    paid_at DATETIME NULL,
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_partner_payouts_supplier FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS guide_payouts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    guide_id BIGINT NOT NULL,
    payout_code VARCHAR(50) NOT NULL UNIQUE,
    schedule_id BIGINT NULL,
    amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    status ENUM('draft','approved','paid','cancelled') NOT NULL DEFAULT 'draft',
    paid_at DATETIME NULL,
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_guide_payouts_guide FOREIGN KEY (guide_id)
        REFERENCES guides(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_guide_payouts_schedule FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tour_schedule_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    old_status ENUM('draft','open','closed','full','departed','completed','cancelled') NULL,
    new_status ENUM('draft','open','closed','full','departed','completed','cancelled') NOT NULL,
    changed_by CHAR(36) NULL,
    note TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_schedule_status_history_schedule FOREIGN KEY (schedule_id)
        REFERENCES tour_schedules(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_schedule_status_history_user FOREIGN KEY (changed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notification_campaigns (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    campaign_name VARCHAR(200) NOT NULL,
    notification_type ENUM('booking','payment','weather','promotion','schedule_change','reminder','system','chat','destination_follow') NOT NULL,
    channel ENUM('push','email','sms','in_app') NOT NULL,
    title_template VARCHAR(255) NOT NULL,
    body_template TEXT NOT NULL,
    target_query JSON NULL,
    scheduled_at DATETIME NULL,
    sent_at DATETIME NULL,
    status ENUM('draft','scheduled','sending','completed','cancelled') NOT NULL DEFAULT 'draft',
    created_by CHAR(36) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_campaigns_user FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notification_deliveries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    campaign_id BIGINT NULL,
    notification_id BIGINT NULL,
    user_id CHAR(36) NULL,
    channel ENUM('push','email','sms','in_app') NOT NULL,
    recipient VARCHAR(255) NULL,
    status ENUM('queued','sent','delivered','failed','read') NOT NULL DEFAULT 'queued',
    provider_message_id VARCHAR(150),
    error_message VARCHAR(255),
    sent_at DATETIME NULL,
    delivered_at DATETIME NULL,
    read_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_deliveries_campaign FOREIGN KEY (campaign_id)
        REFERENCES notification_campaigns(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_notification_deliveries_notification FOREIGN KEY (notification_id)
        REFERENCES notifications(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_notification_deliveries_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media_files (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    file_key VARCHAR(255) NOT NULL UNIQUE,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    file_ext VARCHAR(20),
    file_size_bytes BIGINT NULL,
    storage_provider VARCHAR(50) NOT NULL DEFAULT 'local',
    file_url TEXT NOT NULL,
    thumbnail_url TEXT NULL,
    uploaded_by CHAR(36) NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_media_files_user FOREIGN KEY (uploaded_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS file_attachments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    media_file_id BIGINT NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(120) NOT NULL,
    attachment_role VARCHAR(50) NULL,
    caption VARCHAR(255) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_file_attachments_media FOREIGN KEY (media_file_id)
        REFERENCES media_files(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_testimonials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(120) NOT NULL,
    customer_title VARCHAR(180) NULL,
    content TEXT NOT NULL,
    rating TINYINT NOT NULL DEFAULT 5,
    avatar_url TEXT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_customer_testimonial_name (customer_name),
    CONSTRAINT chk_customer_testimonials_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;