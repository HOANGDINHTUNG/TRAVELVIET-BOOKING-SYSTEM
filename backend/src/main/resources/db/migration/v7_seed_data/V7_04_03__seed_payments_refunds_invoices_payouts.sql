SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- V7_04C__seed_payments_refunds_invoices_payouts.sql
-- Dữ liệu thanh toán, refund, invoice, commission, payout.
-- ============================================================

-- =====================================================================
-- 09_PAYMENTS_REFUNDS_INVOICES - Thanh toán, hoàn tiền, hóa đơn, hoa hồng
-- =====================================================================

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


-- E7) payments cho don tour legacy co order + paid (dashboard doanh thu)
INSERT INTO payments (
    payment_code, booking_id, order_id, payment_method, provider, transaction_ref,
    amount, currency, status, paid_at, request_payload, response_payload, created_at, updated_at
)
SELECT
    CONCAT('PAY', LPAD(b.id, 8, '0')),
    b.id,
    b.order_id,
    CASE MOD(b.id, 4)
        WHEN 0 THEN 'gateway'
        WHEN 1 THEN 'credit_card'
        WHEN 2 THEN 'qr'
        ELSE 'e_wallet'
    END,
    CASE MOD(b.id, 3)
        WHEN 0 THEN 'vnpay'
        WHEN 1 THEN 'stripe'
        ELSE 'momo'
    END,
    CONCAT('TXN', LPAD(b.id, 10, '0')),
    b.final_amount,
    b.currency,
    CASE
        WHEN b.payment_status = 'paid' THEN 'paid'
        WHEN b.payment_status = 'failed' THEN 'failed'
        WHEN b.payment_status = 'refunded' THEN 'refunded'
        ELSE 'unpaid'
    END,
    CASE WHEN b.payment_status = 'paid' THEN DATE_ADD(b.created_at, INTERVAL 20 MINUTE) ELSE NULL END,
    JSON_OBJECT('source', 'seed_v7', 'booking_type', 'tour'),
    JSON_OBJECT('status', b.payment_status),
    COALESCE(b.created_at, NOW()),
    NOW()
FROM bookings b
WHERE b.order_id IS NOT NULL
  AND b.deleted_at IS NULL
  AND b.payment_status IN ('paid','failed','refunded')
  AND NOT EXISTS (
      SELECT 1
      FROM payments p
      WHERE p.booking_id = b.id
        AND p.order_id = b.order_id
  );


-- E8) payment_attempts cho ca booking moi (hotel/flight/combo) thong qua order
INSERT INTO payment_attempts (
    payment_id, order_id, booking_id, attempt_no, provider, payment_method, status,
    gateway_transaction_ref, gateway_response_code, gateway_message,
    request_payload, response_payload, started_at, finished_at, created_at, updated_at
)
SELECT
    NULL,
    o.id,
    NULL,
    1,
    CASE MOD(o.id, 3)
        WHEN 0 THEN 'vnpay'
        WHEN 1 THEN 'stripe'
        ELSE 'momo'
    END,
    CASE MOD(o.id, 4)
        WHEN 0 THEN 'gateway'
        WHEN 1 THEN 'credit_card'
        WHEN 2 THEN 'qr'
        ELSE 'e_wallet'
    END,
    CASE
        WHEN o.payment_status = 'paid' THEN 'paid'
        WHEN o.payment_status = 'failed' THEN 'failed'
        WHEN o.payment_status = 'refunded' THEN 'refunded'
        ELSE 'pending'
    END,
    CONCAT('ATT', LPAD(o.id, 10, '0')),
    CASE
        WHEN o.payment_status = 'paid' THEN '00'
        WHEN o.payment_status = 'failed' THEN '99'
        ELSE NULL
    END,
    CASE
        WHEN o.payment_status = 'paid' THEN 'Payment success'
        WHEN o.payment_status = 'failed' THEN 'Payment failed'
        WHEN o.payment_status = 'refunded' THEN 'Refunded after payment'
        ELSE 'Pending payment'
    END,
    JSON_OBJECT('source', 'seed_v7', 'order_code', o.order_code),
    JSON_OBJECT('payment_status', o.payment_status),
    DATE_SUB(COALESCE(o.placed_at, NOW()), INTERVAL 10 MINUTE),
    CASE WHEN o.payment_status IN ('paid','failed','refunded') THEN COALESCE(o.placed_at, NOW()) ELSE NULL END,
    NOW(),
    NOW()
FROM orders o
WHERE (o.order_code LIKE 'HORD%' OR o.order_code LIKE 'FORD%' OR o.order_code LIKE 'CORD%')
  AND NOT EXISTS (
      SELECT 1
      FROM payment_attempts pa
      WHERE pa.order_id = o.id
  );


-- E9) payment_webhook_logs cho cac payment da seed
INSERT INTO payment_webhook_logs (
    provider, event_type, event_ref, order_id, payment_id, booking_id,
    is_verified, payload, processed_result, received_at, processed_at
)
SELECT
    COALESCE(p.provider, 'gateway'),
    CASE
        WHEN p.status = 'paid' THEN 'payment.succeeded'
        WHEN p.status = 'failed' THEN 'payment.failed'
        WHEN p.status = 'refunded' THEN 'payment.refunded'
        ELSE 'payment.pending'
    END,
    CONCAT('EVT-', p.payment_code),
    p.order_id,
    p.id,
    p.booking_id,
    TRUE,
    JSON_OBJECT(
        'payment_code', p.payment_code,
        'amount', p.amount,
        'currency', p.currency,
        'status', p.status
    ),
    JSON_OBJECT(
        'mapped_status', p.status,
        'note', 'processed by V7 seed'
    ),
    DATE_ADD(COALESCE(p.created_at, NOW()), INTERVAL 2 MINUTE),
    DATE_ADD(COALESCE(p.created_at, NOW()), INTERVAL 3 MINUTE)
FROM payments p
WHERE p.order_id IS NOT NULL
  AND p.booking_id IS NOT NULL
  AND p.status IN ('paid','failed','refunded')
  AND NOT EXISTS (
      SELECT 1
      FROM payment_webhook_logs wl
      WHERE wl.payment_id = p.id
  );


-- E10) refund_requests gan tu booking bi refunded (end-to-end)
INSERT INTO refund_requests (
    refund_code, booking_id, requested_by, reason_type, reason_detail,
    requested_amount, quoted_amount, approved_amount, voucher_offer_amount,
    refund_method, status, policy_snapshot, processed_by, processed_at, created_at, updated_at
)
SELECT
    CONCAT('RFD', LPAD(b.id, 8, '0')),
    b.id,
    b.user_id,
    CASE MOD(b.id, 4)
        WHEN 0 THEN 'customer_change_plan'
        WHEN 1 THEN 'schedule_change'
        WHEN 2 THEN 'service_issue'
        ELSE 'weather_disruption'
    END,
    CONCAT('Refund request seeded from booking ', b.booking_code),
    b.final_amount,
    b.final_amount,
    b.final_amount,
    0,
    CASE MOD(b.id, 3)
        WHEN 0 THEN 'original_method'
        WHEN 1 THEN 'bank_transfer'
        ELSE 'wallet'
    END,
    'completed',
    JSON_OBJECT(
        'source', 'seed_v7',
        'booking_status', b.status,
        'payment_status', b.payment_status
    ),
    b.user_id,
    DATE_ADD(COALESCE(b.updated_at, NOW()), INTERVAL 1 HOUR),
    COALESCE(b.updated_at, NOW()),
    NOW()
FROM bookings b
WHERE b.deleted_at IS NULL
  AND (b.payment_status = 'refunded' OR b.status = 'refunded')
  AND b.final_amount > 0
  AND NOT EXISTS (
      SELECT 1
      FROM refund_requests rr
      WHERE rr.booking_id = b.id
  );


-- E11) refund_status_history (requested -> approved -> processing -> completed)
INSERT INTO refund_status_history (refund_request_id, old_status, new_status, changed_by, note, created_at)
SELECT
    rr.id,
    NULL,
    'requested',
    rr.requested_by,
    'Refund requested by customer',
    DATE_SUB(rr.created_at, INTERVAL 30 MINUTE)
FROM refund_requests rr
WHERE rr.refund_code LIKE 'RFD%'
  AND NOT EXISTS (
      SELECT 1
      FROM refund_status_history rsh
      WHERE rsh.refund_request_id = rr.id
  );


INSERT INTO refund_status_history (refund_request_id, old_status, new_status, changed_by, note, created_at)
SELECT
    rr.id,
    'requested',
    'approved',
    rr.processed_by,
    'Approved by system seed',
    DATE_SUB(rr.created_at, INTERVAL 20 MINUTE)
FROM refund_requests rr
WHERE rr.refund_code LIKE 'RFD%'
  AND rr.status = 'completed'
  AND NOT EXISTS (
      SELECT 1
      FROM refund_status_history rsh
      WHERE rsh.refund_request_id = rr.id
        AND rsh.old_status = 'requested'
        AND rsh.new_status = 'approved'
  );


INSERT INTO refund_status_history (refund_request_id, old_status, new_status, changed_by, note, created_at)
SELECT
    rr.id,
    'approved',
    'processing',
    rr.processed_by,
    'Refund is processing',
    DATE_SUB(rr.created_at, INTERVAL 10 MINUTE)
FROM refund_requests rr
WHERE rr.refund_code LIKE 'RFD%'
  AND rr.status = 'completed'
  AND NOT EXISTS (
      SELECT 1
      FROM refund_status_history rsh
      WHERE rsh.refund_request_id = rr.id
        AND rsh.old_status = 'approved'
        AND rsh.new_status = 'processing'
  );


INSERT INTO refund_status_history (refund_request_id, old_status, new_status, changed_by, note, created_at)
SELECT
    rr.id,
    'processing',
    'completed',
    rr.processed_by,
    'Refund completed',
    COALESCE(rr.processed_at, rr.updated_at)
FROM refund_requests rr
WHERE rr.refund_code LIKE 'RFD%'
  AND rr.status = 'completed'
  AND NOT EXISTS (
      SELECT 1
      FROM refund_status_history rsh
      WHERE rsh.refund_request_id = rr.id
        AND rsh.old_status = 'processing'
        AND rsh.new_status = 'completed'
  );


-- E12) refund_transactions lien ket payment + refund_request
INSERT INTO refund_transactions (
    refund_request_id, payment_id, provider, transaction_ref, amount, currency,
    status, response_payload, processed_at, created_at, updated_at
)
SELECT
    rr.id,
    p.id,
    COALESCE(p.provider, 'gateway'),
    CONCAT('RTX-', rr.refund_code),
    rr.approved_amount,
    COALESCE(p.currency, 'VND'),
    'completed',
    JSON_OBJECT(
        'refund_code', rr.refund_code,
        'payment_code', p.payment_code,
        'approved_amount', rr.approved_amount
    ),
    COALESCE(rr.processed_at, NOW()),
    rr.created_at,
    NOW()
FROM refund_requests rr
LEFT JOIN payments p
       ON p.booking_id = rr.booking_id
      AND p.order_id = (
          SELECT b.order_id
          FROM bookings b
          WHERE b.id = rr.booking_id
          LIMIT 1
      )
WHERE rr.refund_code LIKE 'RFD%'
  AND rr.status = 'completed'
  AND NOT EXISTS (
      SELECT 1
      FROM refund_transactions rt
      WHERE rt.refund_request_id = rr.id
  );


SET FOREIGN_KEY_CHECKS = 1;
