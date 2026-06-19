# 3. NGĂN XẾP CÔNG NGHỆ BACKEND CORE LÕI (Backend Tech Stack Core)

Tài liệu này bóc tách `backend/pom.xml`, đi sâu vào kỹ thuật hệ sinh thái Java Spring đang cấu thành Server API.

## 1. NỀN TẢNG MVC & CSDL (CORE ECOSYSTEM & DATABASE)

- **Java 21 (LTS) & Spring Boot 4.0.5:** Nhân tố chính của server sử dụng JVM 21 mới đai với mô hình Virtual Threads mạnh mẽ giúp API vượt ngàn request song song không chết. Cốt lõi sử dụng `spring-boot-starter-webmvc`.
- **Spring Data JPA & Hibernate:** ORM trừu tượng hóa DB.
- **MySQL & H2 Database:** Data Engine chính. RDBMS được xài MySQL, nhưng H2 được nhúng vào Test scope (Tạo In-memory DB test).
- **Flyway (10.10.0):** Framework di trú dữ liệu (Migration Engine). Đảm bảo mọi dev đều phải chạy lên Schema tạo Bảng thứ tự giống hệt nhau (`v1`, `v2`, `v3`).

## 2. API QUERY & DATA MAPPING

- **QueryDSL (5.1.0):** Một kiệt tác mã nguồn mở để thay thế chuỗi JPA `@Query("Select x from Y")` thô kệch. QueryDSL tạo ra một file Q-class ảo (`QFlight.java`) giúp gọi biến Object Type-safe (ví dụ: `qFlight.originAirport.eq(...)`). Tránh lỗi Runtime.
- **MapStruct (1.6.3):** Sinh mã mapper ảo mượt như lụa. Khác với ModelMapper (dùng Reflection chậm chạp lúc runtime), MapStruct sinh file code Java mapping Setter Getter tay trong lúc Biên Dịch (Compile). Chống Memory Leak tuyệt đối.
- **Lombok:** Bùa sinh Annotation (`@Getter`, `@Setter`, `@Builder`, `@Slf4j`) cho code siêu gọn gàng.

## 3. SECURITY & PERFORMANCE GUARD

- **Spring Security:** Ngăn chặn và bảo vệ Router / Phân chia vai trò Admin / Customer.
- **Resilience4J:** Lib thiết lập Circuit Breaker cho tính đàn hồi (Fault Tolerance). Nếu Database MySQL tự nhiên down, mạch ngắt để báo về API lỗi bảo trì, tránh làm hệ thống sập dồn dập (Cascading Failure).
- **Bucket4j (8.10.1) & Spring Boot Data Redis:** Kiệt tác Throttling chống cào dữ liệu Token Bucket Algorithm.
  - Giới hạn lượt gọi API (Rate limit) được kiểm soát bởi Bucket4J.
  - Trạng thái của các Bucket này được serialize trên REDIS. Token của một user (theo IP hoặc ID JWT) sẽ bị giảm dần tới 0, và Redis chịu trách nhiệm trừ đi số đó cực nhanh, không ảnh hưởng DB.
- **Spring Boot Cache & Caffeine:** In-memory Caching nội bộ tốc độ cao nhất hiện nay. Dùng để bọc các API Search public để Response Cache lập tức không cần gõ Query SQL.

## 4. XỬ LÝ MEDIA

- **MinIO (8.5.10):** SDK Client. Object Storage mã nguồn mở tương thích giao thức của Amazon S3. Mọi file được đẩy trực tiếp lên Cloud ảo hoá MinIO.
