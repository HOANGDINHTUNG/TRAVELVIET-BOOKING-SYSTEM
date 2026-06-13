SET FOREIGN_KEY_CHECKS = 0;
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
-- Add deleted_at to hotels table for AuditableEntity support
-- Phase 1 - Task 1: Pricing extensions for Hotel and Flights

-- 1. Add pricing extension columns to hotel_room_types 
-- Phase 1 - Task 2: Allotment and TTL extensions

-- 1. Add Allotment controls to hotel_room_inventory
SET FOREIGN_KEY_CHECKS = 1;
