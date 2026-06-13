SET FOREIGN_KEY_CHECKS = 0;
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

-- =====================================================================
-- Booking experience (merged from V9): departure hubs, tour combos, inclusion flags
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 1;
