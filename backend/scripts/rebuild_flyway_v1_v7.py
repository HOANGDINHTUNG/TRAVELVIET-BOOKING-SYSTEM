# -*- coding: utf-8 -*-
"""One-off: split V1__baseline_core.sql into V1..V7 and inject TRAVELVIET extension DDL."""
from pathlib import Path

MIG = Path(__file__).resolve().parent.parent / "src/main/resources/db/migration"
SRC = MIG / "V1__baseline_core.sql"
text = SRC.read_text(encoding="utf-8")

idx15 = text.index("-- 15. INDEXES --")
idx16 = text.index("-- 16. VIEWS --")
idx17 = text.index("-- 17. FUNCTIONS / PROCEDURES --")
idx18 = text.index("-- ========================================================= -- 18. TRIGGERS --")
idx_delim_end = text.index("DELIMITER ;", idx18) + len("DELIMITER ;")
idx19 = text.index("-- ========================================================= -- 19. DEFAULT DATA")

tables = text[:idx15].rstrip()
indexes = text[idx15:idx16].strip()
views = text[idx16:idx17].strip()
fp_block = text[idx17:idx18].strip()
triggers_raw = text[idx18:idx_delim_end].strip()
seed = text[idx19:].strip()

# --- Extension DDL (no USE; no indexes/views; no ALTER bookings/payments/guides) ---
EXT = r"""
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
"""

EXT_INDEXES = """
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payment_attempts_payment_status ON payment_attempts(payment_id, status);
CREATE INDEX idx_payment_webhook_logs_event_ref ON payment_webhook_logs(event_ref);
CREATE INDEX idx_refund_status_history_request ON refund_status_history(refund_request_id);
CREATE INDEX idx_refund_transactions_request ON refund_transactions(refund_request_id);
CREATE INDEX idx_booking_addons_booking ON booking_addons(booking_id);
CREATE INDEX idx_tour_price_rules_tour_active ON tour_price_rules(tour_id, is_active);
CREATE INDEX idx_schedule_price_rules_schedule_active ON schedule_price_rules(schedule_id, is_active);
CREATE INDEX idx_suppliers_type_status ON suppliers(supplier_type, status);
CREATE INDEX idx_supplier_services_supplier ON supplier_services(supplier_id);
CREATE INDEX idx_schedule_resource_allocations_schedule ON schedule_resource_allocations(schedule_id);
CREATE INDEX idx_destination_proposals_user_status ON destination_proposals(proposed_by, status);
CREATE INDEX idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX idx_voucher_redemptions_voucher_user ON voucher_redemptions(voucher_id, user_id);
CREATE INDEX idx_invoices_user_status ON invoices(user_id, status);
CREATE INDEX idx_commissions_source ON commissions(source_type, source_ref_id);
CREATE INDEX idx_tour_schedule_status_history_schedule ON tour_schedule_status_history(schedule_id);
CREATE INDEX idx_notification_deliveries_user_status ON notification_deliveries(user_id, status);
CREATE INDEX idx_file_attachments_entity ON file_attachments(entity_name, entity_id);
"""

EXT_VIEWS = """
CREATE OR REPLACE VIEW v_order_summary AS
SELECT
    o.id,
    o.order_code,
    o.user_id,
    o.status,
    o.payment_status,
    o.final_amount,
    o.currency,
    o.placed_at,
    o.created_at,
    COUNT(oi.id) AS total_items
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY
    o.id, o.order_code, o.user_id, o.status, o.payment_status, o.final_amount, o.currency, o.placed_at, o.created_at;

CREATE OR REPLACE VIEW v_supplier_service_summary AS
SELECT
    s.id AS supplier_id,
    s.name AS supplier_name,
    s.supplier_type,
    ss.id AS supplier_service_id,
    ss.service_type,
    ss.service_name,
    ss.unit_price,
    ss.currency,
    ss.is_active
FROM suppliers s
JOIN supplier_services ss ON ss.supplier_id = s.id;
"""

# Split orders: only orders + order_items before bookings (payment_* reference bookings/payments)
marker = "CREATE TABLE IF NOT EXISTS bookings ("
pos_book = tables.index(marker)
before = tables[:pos_book].rstrip()
after_book = tables[pos_book:]

# Inject only orders + order_items from EXT (first two CREATE blocks) — already in EXT string at start
ext_lines = EXT.strip().split("CREATE TABLE IF NOT EXISTS payment_attempts")[0].strip()

# Patch guides: typo column -> specialties (match tab-indented baseline)
before = before.replace(
    "    languages JSON NULL, \n    pecialties JSON NULL,",
    "    languages JSON NULL, \n    specialties JSON NULL,",
)

# Patch promotion_campaigns
old_pc = """CREATE TABLE IF NOT EXISTS promotion_campaigns ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    code VARCHAR(40) NOT NULL UNIQUE, 
    name VARCHAR(200) NOT NULL, 
    description TEXT, 
    start_at DATETIME NOT NULL,"""
new_pc = """CREATE TABLE IF NOT EXISTS promotion_campaigns ( 
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
    start_at DATETIME NOT NULL,"""
if old_pc in before:
    before = before.replace(old_pc, new_pc)

# Patch bookings: order_id after user_id
old_bk = """CREATE TABLE IF NOT EXISTS bookings ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    booking_code VARCHAR(50) UNIQUE, 
    user_id CHAR(36) NOT NULL, 
    tour_id BIGINT NOT NULL,"""
new_bk = """CREATE TABLE IF NOT EXISTS bookings ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    booking_code VARCHAR(50) UNIQUE, 
    user_id CHAR(36) NOT NULL, 
    order_id BIGINT NULL,
    tour_id BIGINT NOT NULL,"""
after_book = after_book.replace(old_bk, new_bk, 1)
# Add FK for order_id before closing ) ENGINE of bookings - insert before last CONSTRAINT chk
fk_orders = """
    CONSTRAINT fk_bookings_order
    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE SET NULL,
"""
after_book = after_book.replace(
    "    CONSTRAINT chk_booking_people CHECK",
    fk_orders + "    CONSTRAINT chk_booking_people CHECK",
    1,
)

# Patch payments
old_pay = """CREATE TABLE IF NOT EXISTS payments ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    payment_code VARCHAR(50) UNIQUE, 
    booking_id BIGINT NOT NULL, 
    payment_method ENUM("""
new_pay = """CREATE TABLE IF NOT EXISTS payments ( 
	id BIGINT PRIMARY KEY AUTO_INCREMENT, 
    payment_code VARCHAR(50) UNIQUE, 
    booking_id BIGINT NOT NULL, 
    order_id BIGINT NULL,
    payment_method ENUM("""
after_book = after_book.replace(old_pay, new_pay, 1)
fk_pay_orders = """
    CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE SET NULL,
"""
after_book = after_book.replace(
    "    CONSTRAINT fk_payments_booking\n",
    fk_pay_orders + "    CONSTRAINT fk_payments_booking\n",
    1,
)

# support_sessions rating/feedback in CREATE
old_ss = """CREATE TABLE IF NOT EXISTS support_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_code VARCHAR(50) UNIQUE,
    user_id CHAR(36) NOT NULL,
    assigned_staff_id CHAR(36) NULL,
    status ENUM('open', 'waiting_staff', 'waiting_customer', 'resolved', 'closed') NOT NULL DEFAULT 'open',
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME NULL,
    last_message_at DATETIME NULL,"""
new_ss = """CREATE TABLE IF NOT EXISTS support_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_code VARCHAR(50) UNIQUE,
    user_id CHAR(36) NOT NULL,
    assigned_staff_id CHAR(36) NULL,
    status ENUM('open', 'waiting_staff', 'waiting_customer', 'resolved', 'closed') NOT NULL DEFAULT 'open',
    rating TINYINT NULL,
    feedback TEXT NULL,
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME NULL,
    last_message_at DATETIME NULL,"""
# find in after_book (support is after bookings)
if old_ss in after_book:
    after_book = after_book.replace(old_ss, new_ss, 1)
    after_book = after_book.replace(
        "    CONSTRAINT fk_support_sessions_staff FOREIGN KEY (assigned_staff_id)\n        REFERENCES users (id)\n        ON DELETE SET NULL\n)  ENGINE=INNODB;",
        "    CONSTRAINT fk_support_sessions_staff FOREIGN KEY (assigned_staff_id)\n        REFERENCES users (id)\n        ON DELETE SET NULL,\n    CONSTRAINT chk_support_session_rating CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5))\n)  ENGINE=INNODB;",
        1,
    )

# tour_schedule_guides: add created_at, updated_at, deleted_at in CREATE
old_tsg = """CREATE TABLE IF NOT EXISTS tour_schedule_guides (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    guide_id BIGINT NOT NULL,
    guide_role VARCHAR(80) NOT NULL DEFAULT 'main',
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_schedule_guide (schedule_id , guide_id),"""
new_tsg = """CREATE TABLE IF NOT EXISTS tour_schedule_guides (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    guide_id BIGINT NOT NULL,
    guide_role VARCHAR(80) NOT NULL DEFAULT 'main',
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    UNIQUE KEY uk_schedule_guide (schedule_id , guide_id),"""
if old_tsg in before:
    before = before.replace(old_tsg, new_tsg, 1)

ext_tail = "CREATE TABLE IF NOT EXISTS payment_attempts" + EXT.strip().split("CREATE TABLE IF NOT EXISTS payment_attempts", 1)[1]

v1_tables = (
    before
    + "\n\n"
    + ext_lines
    + "\n\n"
    + after_book
    + "\n\n"
    + ext_tail.strip()
)

# Fix views: split glued CREATE OR REPLACE
views_fixed = views.replace(
    "destinations d ON d.id = t.destination_id;CREATE OR REPLACE VIEW v_schedule_availability AS",
    "destinations d ON d.id = t.destination_id;\n\nCREATE OR REPLACE VIEW v_schedule_availability AS",
).replace(
    "tours t ON t.id = ts.tour_id;CREATE OR REPLACE VIEW v_popular_tours_by_tag AS",
    "tours t ON t.id = ts.tour_id;\n\nCREATE OR REPLACE VIEW v_popular_tours_by_tag AS",
)

# Split function vs procedures
fp_lines = [ln for ln in fp_block.splitlines() if ln.strip()]
delim_idx = next(i for i, ln in enumerate(fp_lines) if ln.strip().startswith("DELIMITER $$"))
body = "\n".join(fp_lines[delim_idx + 1 :])
# fn ends at first END$$ after CREATE FUNCTION
idx_fn = body.index("CREATE FUNCTION")
idx_proc = body.index("CREATE PROCEDURE")
func_part = body[idx_fn:idx_proc].strip()
proc_part = body[idx_proc:].strip()

v5_funcs = "DELIMITER $$\n" + func_part + "\nDELIMITER ;\n"
v4_procs = "DELIMITER $$\n" + proc_part + "\nDELIMITER ;\n"

v6_trig = "DELIMITER $$\n" + triggers_raw.replace("-- ========================================================= -- 18. TRIGGERS -- =========================================================", "-- 18. TRIGGERS (moved from baseline)\n").strip() + "\nDELIMITER ;\n"

CT_TEST = """
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
"""
v1_tables = v1_tables + "\n\n" + CT_TEST.strip() + "\n"

v7_only = seed + "\n\n" + """INSERT INTO promotion_campaigns (
    code, name, description, image_url, image_alt, display_title, display_subtitle,
    badge_text, cta_label, cta_url, sort_order, is_featured, start_at, end_at,
    target_member_level, conditions_json, reward_json, is_active
) VALUES
('TEAMBUILDING_SUMMER_2026','Du lich team building mua he 2026','Goi uu dai cho doanh nghiep dat tour doan he, phu hop chuong trinh gan ket va gala dinner.','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80','Doan khach tham gia hoat dong team building ngoai troi','Du lich - Teambuilding - Gala','Chuong trinh he tron goi cho doanh nghiep tu 30 khach.','Uu dai doanh nghiep','Xem uu dai','/promotions/TEAMBUILDING_SUMMER_2026',1,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 DAY),'silver',JSON_OBJECT('minGuests', 30, 'applicableScope', 'corporate_group', 'advanceBookingDays', 14),JSON_OBJECT('type', 'percentage_discount', 'value', 12, 'maxDiscountAmount', 5000000),TRUE),
('COMPANY_TRIP_2026','Ca cong ty cung di','Khuyen mai tour doan lon cho cong ty to chuc du lich nghi duong, hoi nghi va gala cuoi nam.','https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80','Nhom nhan vien cong ty cung tham gia chuyen di','Ca cong ty cung di','Goi tour tron goi cho doan 50 den 1000 khach.','Tour doan lon','Nhan tu van','/promotions/COMPANY_TRIP_2026',2,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 120 DAY),'gold',JSON_OBJECT('minGuests', 50, 'applicableScope', 'company_trip', 'includesGala', true),JSON_OBJECT('type', 'fixed_amount_discount', 'value', 3000000, 'gift', 'Free gala backdrop'),TRUE),
('FAMILY_CONNECT_2026','Hanh trinh gan ket gia dinh','Uu dai cho gia dinh va nhom ban dat tour nghi duong, mien phi tu van lich trinh rieng.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80','Gia dinh nghi duong tren bai bien','Hanh trinh gan ket','Giam gia cho nhom gia dinh tu 6 khach tro len.','Gia dinh','Dat tour ngay','/promotions/FAMILY_CONNECT_2026',3,TRUE,CURRENT_TIMESTAMP,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 75 DAY),'bronze',JSON_OBJECT('minGuests', 6, 'applicableScope', 'family_group', 'advanceBookingDays', 7),JSON_OBJECT('type', 'cashback', 'value', 500000, 'voucherForNextTrip', true),TRUE)
ON DUPLICATE KEY UPDATE description=VALUES(description), image_url=VALUES(image_url), image_alt=VALUES(image_alt), display_title=VALUES(display_title), display_subtitle=VALUES(display_subtitle), badge_text=VALUES(badge_text), cta_label=VALUES(cta_label), cta_url=VALUES(cta_url), sort_order=VALUES(sort_order), is_featured=VALUES(is_featured), start_at=VALUES(start_at), end_at=VALUES(end_at), target_member_level=VALUES(target_member_level), conditions_json=VALUES(conditions_json), reward_json=VALUES(reward_json), is_active=VALUES(is_active);
"""

v7_only += """
INSERT INTO customer_testimonials (customer_name, customer_title, content, rating, avatar_url, is_verified, sort_order, is_active) VALUES
('Chi Nguyen Mai','Nguyen Dinh Chieu - Ho Chi Minh','CONG TY TNHH ON VIET NAM dac biet an tuong voi su chuyen nghiep cua THD Travel trong viec thiet ke hanh trinh nghi duong cho ON Viet Nam.',5,'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',TRUE,1,TRUE),
('Chi Tho Nguyen','Dong Da - Ha Noi','[Happy Money - Cong ty co phan TM lien ket Nano] Nho su ho tro tan tam cua THD Travel, chuyen du lich ket hop hoi thao cua doanh nghiep chung toi dien ra thuan loi va tron ven.',5,'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=160&q=80',TRUE,2,TRUE),
('Anh Hung','Thuy Nguyen - Hai Phong','[Cong ty TNHH LITEON] Chuyen di lan nay thuc su y nghia voi toan the nhan vien.',5,'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',TRUE,3,TRUE),
('Chi Truong Uyen Thanh','An Khanh - Ho Chi Minh','HCM branch of Electrolux Vietnam danh gia cao su chuyen nghiep cua THD Travel.',5,'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',TRUE,4,TRUE)
ON DUPLICATE KEY UPDATE customer_title=VALUES(customer_title), content=VALUES(content), rating=VALUES(rating), avatar_url=VALUES(avatar_url), is_verified=VALUES(is_verified), sort_order=VALUES(sort_order), is_active=VALUES(is_active);
"""

v1_final = (
    "-- Flyway V1: CREATE TABLE only (baseline + TravelViet extension + legacy ALTERs)\n"
    "-- Schema is the DB selected by the datasource (do not USE a different database).\n\n"
    + v1_tables
)

(MIG / "V1__tables.sql").write_text(v1_final, encoding="utf-8")
(MIG / "V2__indexes.sql").write_text(
    "-- Flyway V2: indexes (baseline + extension)\n\n" + indexes + "\n\n" + EXT_INDEXES.strip() + "\n",
    encoding="utf-8",
)
(MIG / "V3__views.sql").write_text(
    "-- Flyway V3: views\n\n" + views_fixed + "\n\n" + EXT_VIEWS.strip() + "\n",
    encoding="utf-8",
)
(MIG / "V4__procedures.sql").write_text("-- Flyway V4: stored procedures\n\n" + v4_procs, encoding="utf-8")
(MIG / "V5__functions.sql").write_text("-- Flyway V5: functions\n\n" + v5_funcs, encoding="utf-8")
(MIG / "V6__triggers.sql").write_text("-- Flyway V6: triggers\n\n" + v6_trig, encoding="utf-8")
(MIG / "V7__seed_data.sql").write_text(
    "-- Flyway V7: INSERT seed data (RBAC, policies, tags, promotions, testimonials)\n\n" + v7_only,
    encoding="utf-8",
)

# Remove old files
for name in [
    "V1__baseline_core.sql",
    "V2__baseline_promotions_commerce_reviews.sql",
    "V3__extension_travelviet_domain.sql",
    "V4__extension_indexes_views.sql",
    "V5__seed_smoke_extension.sql",
]:
    p = MIG / name
    if p.exists():
        p.unlink()

print("Wrote V1__tables.sql .. V7__seed_data.sql")
