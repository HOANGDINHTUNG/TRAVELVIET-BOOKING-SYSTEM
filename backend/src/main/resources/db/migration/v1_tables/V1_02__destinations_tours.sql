SET FOREIGN_KEY_CHECKS = 0;
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
    esg_score TINYINT NULL COMMENT 'điểm ESG 0-100',
    lei_score TINYINT NULL COMMENT 'điểm LEI 0-100',
    list_price DECIMAL(14 , 2 ) NULL COMMENT 'giá niêm yết (gạch ngang)',
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
    CONSTRAINT chk_activity_level CHECK (activity_level BETWEEN 1 AND 5),
    CONSTRAINT chk_tours_esg_score CHECK (esg_score IS NULL OR (esg_score BETWEEN 0 AND 100)),
    CONSTRAINT chk_tours_lei_score CHECK (lei_score IS NULL OR (lei_score BETWEEN 0 AND 100))
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS tour_destinations (
    tour_id BIGINT NOT NULL,
    destination_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (tour_id, destination_id),
    CONSTRAINT fk_tour_destinations_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_destinations_destination FOREIGN KEY (destination_id)
        REFERENCES destinations (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

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
    day_image_url TEXT NULL,
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
    image_url TEXT NULL,
    image_caption VARCHAR(255) NULL,
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
	-- Chỉ phản ánh booking thực (pending_payment..completed); seed không gán số giả marketing
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
	CONSTRAINT chk_schedule_time CHECK (return_at >= departure_at), 
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

CREATE TABLE IF NOT EXISTS tour_departure_hubs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_id BIGINT NOT NULL,
    city_code VARCHAR(10) NOT NULL,
    city_name_vi VARCHAR(120) NOT NULL,
    city_name_en VARCHAR(120) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    UNIQUE KEY uk_tour_departure_hub (tour_id, city_code),
    CONSTRAINT fk_tour_departure_hubs_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tour_combo_packages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tour_id BIGINT NOT NULL,
    combo_id BIGINT NOT NULL,
    package_role ENUM('included', 'optional', 'recommended') NOT NULL DEFAULT 'optional',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tour_combo_packages (tour_id, combo_id),
    CONSTRAINT fk_tour_combo_packages_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id) ON DELETE CASCADE,
    CONSTRAINT fk_tour_combo_packages_combo FOREIGN KEY (combo_id)
        REFERENCES combo_packages (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tour_inclusion_flags (
    tour_id BIGINT PRIMARY KEY,
    has_flight BOOLEAN NOT NULL DEFAULT FALSE,
    has_hotel BOOLEAN NOT NULL DEFAULT FALSE,
    has_meals BOOLEAN NOT NULL DEFAULT FALSE,
    has_tickets BOOLEAN NOT NULL DEFAULT FALSE,
    has_guide BOOLEAN NOT NULL DEFAULT FALSE,
    has_insurance BOOLEAN NOT NULL DEFAULT FALSE,
    has_transport BOOLEAN NOT NULL DEFAULT FALSE,
    hotel_stars TINYINT NULL,
    flight_type ENUM('none', 'one_way', 'roundtrip') NOT NULL DEFAULT 'none',
    notes VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_inclusion_flags_tour FOREIGN KEY (tour_id)
        REFERENCES tours (id) ON DELETE CASCADE,
    CONSTRAINT chk_tour_inclusion_hotel_stars CHECK (hotel_stars IS NULL OR hotel_stars BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- =====================================================================
-- Hotels / Flights / Combo booking extension (parallel to legacy bookings)
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 1;
