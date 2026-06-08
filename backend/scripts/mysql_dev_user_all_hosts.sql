-- =============================================================================
-- Script MySQL LOCAL (máy bạn) — KHÔNG chạy trên Aiven/cloud
-- Chạy trong MySQL Workbench với user có quyền admin (thường là root).
-- =============================================================================

-- 1. Tạo database
CREATE DATABASE IF NOT EXISTS wedservice
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Tạo user (đuôi @'%' để app kết nối từ 127.0.0.1 / Docker / WSL)
CREATE USER IF NOT EXISTS 'wed_app_user'@'%' IDENTIFIED BY '123456';

-- 3. Cấp quyền
GRANT ALL PRIVILEGES ON wedservice.* TO 'wed_app_user'@'%';
FLUSH PRIVILEGES;

-- -----------------------------------------------------------------------------
-- 4. Dòng dưới CẦN user root (SUPER). Nếu báo Error 1227 → bỏ qua bước 4,
--    mở tab mới đăng nhập root rồi chỉ chạy dòng SET GLOBAL.
--    Flyway tạo FUNCTION/TRIGGER (V5, V6) có thể cần setting này.
-- -----------------------------------------------------------------------------
SET GLOBAL log_bin_trust_function_creators = 1;
