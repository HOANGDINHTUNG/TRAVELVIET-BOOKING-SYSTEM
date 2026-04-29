SET UP PROJECT

1. Vào link git clone dự án về [https://github.com/HOANGDINHTUNG/TRAVELVIET-BOOKING-SYSTEM](https://github.com/HOANGDINHTUNG/TRAVELVIET-BOOKING-SYSTEM)  
     
2. Vào Backend:   
   cd backend  
     
3. Cài dependency / build :   
   .\\mvnw.cmd clean install  
     
4. Vào mysql workbench tạo mới một Schema:   
   \-- 1\. Tạo Database  
   CREATE DATABASE IF NOT EXISTS wedservice CHARACTER SET utf8mb4 COLLATE utf8mb4\_unicode\_ci;  
     
   \-- 2\. Tạo User (BẮT BUỘC phải có đuôi @'%' để kết nối từ máy thật vào)  
   CREATE USER IF NOT EXISTS 'wed\_app\_user'@'%' IDENTIFIED BY '123456';  
     
   \-- 3\. Cấp quyền cho User này trên Database vừa tạo  
   GRANT ALL PRIVILEGES ON wedservice.\* TO 'wed\_app\_user'@'%';  
     
   SET GLOBAL log\_bin\_trust\_function\_creators \= 1;  
     
   \-- 4\. Lưu thay đổi  
   FLUSH PRIVILEGES;

5. Vào file application-dev.yaml

	Thay đổi thành localhost://3306

6. Chạy BE :

	./run hoặc có thể chạy .\\mvnw.cmd spring-boot:run

7. Dành cho AE nào chưa biết thì tôi đang dùng flyway nó là một tool dùng để quản lý version cho DB. Nói dễ hiểu thì nó như git vậy á, và khi có ai sửa db thì khi ae chạy BE thì nó điều cập nhật DB ở phía ae cho nó đồng bộ nhất có thể . (Đọc thêm)

8. Mở termial mới   
   cd frontend/web

9. Cài dependency / build:  
   npm install  
     
10. Chạy  
    npm run dev  
      
11. Mở termial mới   
    cd frontend/mobile  
      
12. Cài dependency / build:  
    npm install  
      
13. Chạy (ae nào làm phần mobile này thì chạy không thì thôi)  
    npm run dev  
      
    —-----------------------------------------------  
    AE NÀO CÓ VẤN ĐỀ GÌ NHẮN CHO TÙNG \=00