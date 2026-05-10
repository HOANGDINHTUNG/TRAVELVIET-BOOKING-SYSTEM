-- Flyway V3: views

-- 16. VIEWS -- 


CREATE OR REPLACE VIEW v_tour_public_summary AS
    SELECT 
        t.id,
        t.code,
        t.name,
        t.slug,
        d.name AS destination_name,
        d.province,
        t.duration_days,
        t.duration_nights,
        t.base_price,
        t.currency,
        t.transport_type,
        t.trip_mode,
        t.is_student_friendly,
        t.is_family_friendly,
        t.is_senior_friendly,
        t.average_rating,
        t.total_reviews,
        t.total_bookings,
        t.status
    FROM
        tours t
            JOIN
        destinations d ON d.id = t.destination_id;

CREATE OR REPLACE VIEW v_schedule_availability AS
    SELECT 
        ts.id,
        ts.schedule_code,
        ts.tour_id,
        t.name AS tour_name,
        ts.departure_at,
        ts.return_at,
        ts.capacity_total,
        ts.booked_seats,
        ts.remaining_seats,
        ts.status
    FROM
        tour_schedules ts
            JOIN
        tours t ON t.id = ts.tour_id;

CREATE OR REPLACE VIEW v_popular_tours_by_tag AS
    SELECT 
        tg.id AS tag_id,
        tg.name AS tag_name,
        t.id AS tour_id,
        t.name AS tour_name,
        COUNT(b.id) AS successful_bookings,
        ROUND(IFNULL(AVG(r.overall_rating), 0), 2) AS avg_rating
    FROM
        tags tg
            JOIN
        tour_tags tt ON tt.tag_id = tg.id
            JOIN
        tours t ON t.id = tt.tour_id
            LEFT JOIN
        bookings b ON b.tour_id = t.id
            AND b.status IN ('confirmed' , 'checked_in', 'completed')
            LEFT JOIN
        reviews r ON r.tour_id = t.id
    GROUP BY tg.id , tg.name , t.id , t.name; 
    
    


CREATE OR REPLACE VIEW v_user_primary_roles AS
    SELECT 
        u.id AS user_id,
        u.full_name,
        u.email,
        u.phone,
        u.status,
        u.user_category,
        r.code AS primary_role_code,
        r.name AS primary_role_name,
        r.hierarchy_level
    FROM
        users u
            LEFT JOIN
        user_roles ur ON ur.user_id = u.id AND ur.is_primary = TRUE
            LEFT JOIN
        roles r ON r.id = ur.role_id;

CREATE OR REPLACE VIEW v_user_effective_permissions AS
    SELECT DISTINCT
        u.id AS user_id,
        u.full_name,
        r.code AS role_code,
        p.code AS permission_code,
        p.module_name,
        p.action_name
    FROM
        users u
            JOIN
        user_roles ur ON ur.user_id = u.id
            JOIN
        roles r ON r.id = ur.role_id AND r.is_active = TRUE
            JOIN
        role_permissions rp ON rp.role_id = r.id
            JOIN
        permissions p ON p.id = rp.permission_id AND p.is_active = TRUE; 

CREATE OR REPLACE VIEW v_transactions AS
    SELECT 
        'PAYMENT' AS transaction_type,
        p.payment_code AS transaction_code,
        b.booking_code,
        p.amount,
        p.currency,
        p.status,
        p.payment_method AS method,
        p.paid_at AS transaction_date,
        b.user_id,
        p.created_at
    FROM
        payments p
            JOIN
        bookings b ON b.id = p.booking_id 
    UNION ALL 
    SELECT 
        'REFUND' AS transaction_type,
        r.refund_code AS transaction_code,
        b.booking_code,
        -r.approved_amount AS amount,
        'VND' AS currency,
        r.status,
        r.refund_method AS method,
        r.processed_at AS transaction_date,
        b.user_id,
        r.created_at
    FROM
        refund_requests r
            JOIN
        bookings b ON b.id = r.booking_id
    WHERE r.status = 'completed';

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
