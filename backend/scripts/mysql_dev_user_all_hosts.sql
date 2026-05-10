-- Chạy bằng user MySQL có quyền admin (Workbench / mysql CLI).
-- Thay YOUR_PASSWORD bằng cùng giá trị DB_PASSWORD trong backend/.env
-- Bắt buộc có @'%' nếu server báo Access denied for user ... @'10.0.2.2' (Docker / WSL / một số mạng NAT).

CREATE DATABASE IF NOT EXISTS wedservice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'wed_app_user'@'%' IDENTIFIED BY 'YOUR_PASSWORD';
ALTER USER 'wed_app_user'@'%' IDENTIFIED BY 'YOUR_PASSWORD';

GRANT ALL PRIVILEGES ON wedservice.* TO 'wed_app_user'@'%';

FLUSH PRIVILEGES;
