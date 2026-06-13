SET FOREIGN_KEY_CHECKS = 0;
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


CREATE TABLE IF NOT EXISTS combo_packages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    destination_id BIGINT NULL,
    combo_type ENUM('tour_hotel','flight_hotel','custom') NOT NULL DEFAULT 'custom',
    base_price DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    discount_type ENUM('fixed_amount','percentage') NOT NULL DEFAULT 'fixed_amount',
    discount_value DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    pricing_rule_json JSON NULL,
    start_at DATETIME NULL,
    end_at DATETIME NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_combo_packages_destination FOREIGN KEY (destination_id)
        REFERENCES destinations (id)
        ON DELETE SET NULL
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS combo_package_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    combo_id BIGINT NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    item_ref_id BIGINT NULL,
    item_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(14 , 2 ) NOT NULL DEFAULT 0,
    unit_price_snapshot DECIMAL(14 , 2 ) NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
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
    item_type ENUM('booking','tour_booking','hotel_booking','flight_booking','combo_booking','product','combo','addon','insurance','service') NOT NULL,
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

CREATE TABLE IF NOT EXISTS hotel_bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_code VARCHAR(50) UNIQUE,
    user_id CHAR(36) NOT NULL,
    order_id BIGINT NULL,
    hotel_id BIGINT NOT NULL,
    room_type_id BIGINT NOT NULL,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    rooms INT NOT NULL DEFAULT 1,
    adults INT NOT NULL DEFAULT 1,
    children INT NOT NULL DEFAULT 0,
    status ENUM('pending_payment','confirmed','checked_in','completed','cancel_requested','cancelled','refunded','expired') NOT NULL DEFAULT 'pending_payment',
    payment_status ENUM('unpaid','partial','paid','failed','refunded','chargeback') NOT NULL DEFAULT 'unpaid',
    contact_name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(150) NULL,
    subtotal_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    special_requests TEXT NULL,
    cancel_reason TEXT NULL,
    cancelled_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT chk_hotel_bookings_stay_date CHECK (checkout_date > checkin_date),
    CONSTRAINT fk_hotel_bookings_user FOREIGN KEY (user_id)
        REFERENCES users (id),
    CONSTRAINT fk_hotel_bookings_order FOREIGN KEY (order_id)
        REFERENCES orders (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_hotel_bookings_hotel FOREIGN KEY (hotel_id)
        REFERENCES hotels (id),
    CONSTRAINT fk_hotel_bookings_room_type FOREIGN KEY (room_type_id)
        REFERENCES hotel_room_types (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hotel_booking_guests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hotel_booking_id BIGINT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    guest_type ENUM('adult','child') NOT NULL DEFAULT 'adult',
    date_of_birth DATE NULL,
    identity_no VARCHAR(50) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_hotel_booking_guests_booking FOREIGN KEY (hotel_booking_id)
        REFERENCES hotel_bookings (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS flight_bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_code VARCHAR(50) UNIQUE,
    user_id CHAR(36) NOT NULL,
    order_id BIGINT NULL,
    flight_id BIGINT NOT NULL,
    flight_class_id BIGINT NOT NULL,
    departure_date DATE NOT NULL,
    trip_type ENUM('one_way','round_trip') NOT NULL DEFAULT 'one_way',
    return_flight_id BIGINT NULL,
    return_departure_date DATE NULL,
    passenger_count INT NOT NULL DEFAULT 1,
    status ENUM('pending_payment','confirmed','checked_in','completed','cancel_requested','cancelled','refunded','expired') NOT NULL DEFAULT 'pending_payment',
    payment_status ENUM('unpaid','partial','paid','failed','refunded','chargeback') NOT NULL DEFAULT 'unpaid',
    contact_name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(150) NULL,
    subtotal_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    special_requests TEXT NULL,
    cancel_reason TEXT NULL,
    cancelled_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT chk_flight_bookings_passengers CHECK (passenger_count > 0),
    CONSTRAINT fk_flight_bookings_user FOREIGN KEY (user_id)
        REFERENCES users (id),
    CONSTRAINT fk_flight_bookings_order FOREIGN KEY (order_id)
        REFERENCES orders (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_flight_bookings_flight FOREIGN KEY (flight_id)
        REFERENCES flights (id),
    CONSTRAINT fk_flight_bookings_return_flight FOREIGN KEY (return_flight_id)
        REFERENCES flights (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_flight_bookings_class FOREIGN KEY (flight_class_id)
        REFERENCES flight_classes (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS flight_booking_passengers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    flight_booking_id BIGINT NOT NULL,
    passenger_type ENUM('adult','child','infant','senior') NOT NULL DEFAULT 'adult',
    full_name VARCHAR(150) NOT NULL,
    gender ENUM('male','female','other','unknown') NOT NULL DEFAULT 'unknown',
    date_of_birth DATE NULL,
    passport_no VARCHAR(50) NULL,
    identity_no VARCHAR(50) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_flight_booking_passengers_booking FOREIGN KEY (flight_booking_id)
        REFERENCES flight_bookings (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS combo_bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_code VARCHAR(50) UNIQUE,
    user_id CHAR(36) NOT NULL,
    order_id BIGINT NULL,
    combo_id BIGINT NOT NULL,
    travel_start_date DATE NULL,
    travel_end_date DATE NULL,
    selection_snapshot_json JSON NULL,
    status ENUM('pending_payment','confirmed','checked_in','completed','cancel_requested','cancelled','refunded','expired') NOT NULL DEFAULT 'pending_payment',
    payment_status ENUM('unpaid','partial','paid','failed','refunded','chargeback') NOT NULL DEFAULT 'unpaid',
    contact_name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(150) NULL,
    subtotal_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    special_requests TEXT NULL,
    cancel_reason TEXT NULL,
    cancelled_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_combo_bookings_user FOREIGN KEY (user_id)
        REFERENCES users (id),
    CONSTRAINT fk_combo_bookings_order FOREIGN KEY (order_id)
        REFERENCES orders (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_combo_bookings_combo FOREIGN KEY (combo_id)
        REFERENCES combo_packages (id)
        ON DELETE RESTRICT
) ENGINE=InnoDB;

ALTER TABLE `flight_bookings`
ADD COLUMN `pnr_code` VARCHAR(50) NULL AFTER `currency`,
ADD COLUMN `ticketing_time_limit` DATETIME NULL AFTER `pnr_code`;
SET FOREIGN_KEY_CHECKS = 1;
