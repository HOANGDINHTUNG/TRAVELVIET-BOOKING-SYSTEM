SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
-- 08_VOUCHERS_SEED_FRONTEND - Seed all frontend voucher codes
-- =====================================================================

INSERT IGNORE INTO vouchers (
    code, name, description, discount_type, discount_value, max_discount_amount,
    min_order_value, usage_limit_total, usage_limit_per_user, start_at, end_at,
    applicable_scope, applicable_member_level, is_active
) VALUES
-- Tour Vouchers
('THDTOUR200', 'Giảm 200K cho Tour Sa Pa, Hạ Long', 'Cho Tour Sa Pa, Hạ Long / For Sapa, Halong Tours', 'fixed_amount', 200000.00, 200000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'tour', 'bronze', TRUE),
('THDTOUR50', 'Giảm 50K cho Tour Một Ngày', 'Cho Tour Một Ngày / For 1-Day Tours', 'fixed_amount', 50000.00, 50000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'tour', 'bronze', TRUE),
('THDTOUR1000', 'Giảm 1M cho Tour Nước Ngoài', 'Cho Tour Nước Ngoài / For International Tours', 'fixed_amount', 1000000.00, 1000000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 360 DAY), 'tour', 'bronze', TRUE),

-- Flight Vouchers
('THDFLIGHT15', 'Giảm 15% cho vé máy bay đi Phú Quốc', 'Cho vé máy bay đi Phú Quốc / For Phu Quoc Flights', 'percentage', 15.00, 500000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'all', 'bronze', TRUE),
('THDFLIGHT100', 'Giảm 100K vé máy bay nội địa', 'Vé máy bay nội địa / Domestic Flights', 'fixed_amount', 100000.00, 100000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'all', 'bronze', TRUE),
('THDFLIGHT300', 'Giảm 300K vé bay quốc tế khứ hồi', 'Vé bay quốc tế khứ hồi / Roundtrip Int''l Flights', 'fixed_amount', 300000.00, 300000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'all', 'bronze', TRUE),

-- Hotel Vouchers
('THDHOTEL500', 'Giảm 500K cho khách sạn 4-5 sao', 'Cho khách sạn 4-5 sao / For 4-5 Star Hotels', 'fixed_amount', 500000.00, 500000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'all', 'bronze', TRUE),
('THDHOTEL200', 'Giảm 200K cho Homestay Đà Lạt', 'Cho Homestay Đà Lạt / For Dalat Homestays', 'fixed_amount', 200000.00, 200000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'all', 'bronze', TRUE),
('THDHOTEL80', 'Giảm 80K đặt phòng chặng ngắn', 'Đặt phòng chặng ngắn / Short-stay Bookings', 'fixed_amount', 80000.00, 80000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'all', 'bronze', TRUE),

-- Checkout-only vouchers (applied coupon examples)
('DALAT15', 'Giảm 15% cho Tour Đà Lạt', 'Áp dụng giảm giá 15% / 15% Off Sapa/Dalat Tours', 'percentage', 15.00, 1000000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'all', 'bronze', TRUE),
('CHUANBAY', 'Giảm 10% vé máy bay', 'Mã giảm giá 10% / 10% Off Flights', 'percentage', 10.00, 500000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'all', 'bronze', TRUE),
('SAVING99', 'Giảm trực tiếp 99K', 'Giảm trực tiếp 99.000đ / Flat 99K Off', 'fixed_amount', 99000.00, 99000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'all', 'bronze', TRUE),
('TRAVELVIET', 'Giảm trực tiếp 200K từ TravelViet', 'Ưu đãi đặc biệt giảm 200.000đ / Special 200K Off', 'fixed_amount', 200000.00, 200000.00, 0.00, 10000, 5, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 180 DAY), 'all', 'bronze', TRUE);

SET FOREIGN_KEY_CHECKS = 1;
