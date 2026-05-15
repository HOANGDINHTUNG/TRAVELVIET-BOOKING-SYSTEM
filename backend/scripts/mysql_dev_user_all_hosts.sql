-- 1. Tạo Database
CREATE DATABASE IF NOT EXISTS wedservice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Tạo User (BẮT BUỘC phải có đuôi @'%' để kết nối từ máy thật vào)
CREATE USER IF NOT EXISTS 'wed_app_user'@'%' IDENTIFIED BY '123456';

-- 3. Cấp quyền cho User này trên Database vừa tạo
GRANT ALL PRIVILEGES ON wedservice.* TO 'wed_app_user'@'%';

SET GLOBAL log_bin_trust_function_creators = 1;

-- 4. Lưu thay đổi
FLUSH PRIVILEGES;