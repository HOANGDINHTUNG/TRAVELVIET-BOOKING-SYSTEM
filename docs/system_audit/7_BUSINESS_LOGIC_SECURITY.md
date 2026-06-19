# 7. PHÁT DỆT LUỒNG NGHIỆP VỤ & HÀNG RÀO BẢO MẬT (Business Logic & Security Core)

Phần này đi thẳng vào các "Kỹ Thuật Hay Ho" nhất được nhúng ngầm phía sau mà bề mặt Frontend không hề nhìn thấy.

## 1. THUẬT TOÁN TRANH VÉ BẰNG KHÓA CSDL (DATABASE PESSIMISTIC / OPTIMISTIC LOCKING)

Bản chất Mua Vé Dịch vụ chung một Hệ quy chiếu là một rủi ro cực lớn `Concurrency Race Condition`. 1 cái Váy Hạng Thương gia chỉ còn 1 chỗ -> 2 ông khách Thái Lan và Sài Gòn đều thanh toán VNPAY lúc 9:00:00. Ai là người bị đền tiền?

- **Trái Tim BE JPA Database:** Logic lệnh Update số ghế không phải kiểu `so_ghe_hien_tai - 1`. Nó là 1 cục IN-LINE query tại `FlightClassRepository`:
  `UPDATE FlightClass f SET f.seatAvailable = f.seatAvailable - :seats WHERE f.id = :flightClassId AND f.seatAvailable >= :seats`
- **Cơ chế Atomicity:** Database MySQL tự khóa Cột Level bằng Row-Level Locking của Transaction. Update này trả về số lượng row bị đổi. Nếu = 0 -> Tức là vé đã bay màu (Seat không còn >= 1 nữa). BE báo ngay Global Exception Transaction Abort.

## 2. BẢO VỆ CHỐNG TẤN CÔNG BẰNG REDIS BUCKET (DDoS Rate Limit Guard)

TravelViet hỗ trợ Web Public tra cứu Tour, Flight không kẹt User Password (Giống Skyscanner/Agoda). Điều này dụ những tụi Cào Dữ Liệu (Crawlers) dùng Bot net đẩy 10,000 requests/giây để cào vé của dự án sang trang web mạo danh. Đánh sập luôn Database của công ty.

- **Phòng thủ nhiều lớp bằng Bucket4J:** Filter HTTP bọc ngoài cùng (Trước khi Spring thèm quan tâm URL là gì), trỏ thẳng Request qua RAM Redis.
- Mục `IP 192.168.x.x` được gán 1 cái Xô nước (Bucket). Mọi Request làm rút 1 giọt. Sau 5 giây xô tự đầy 20 giọt lại. Nếu cào mạnh -> Xô Cạn Nước -> Bắn Header HTTP `429 Too Many Requests`.

## 3. CHỮ KÝ BẢO MẬT TOKEN & VỮNG CHẮC THANH TOÁN

- **Stateless REST:** Server không dùng Session (JSessionId). Toàn bộ gói ở chuỗi JWT Token. Khách hàng phải truyền kèm `Authorization: Bearer <token>` để Controller bóc tách Authority `@PreAuthorize("hasRole('ADMIN')")`. Mọi thông tin Mật Khẩu đều được tiêu hủy ngay tại bộ Hash hàm BCrypt 12 Vòng băm (Mã hóa một chiều không thể dịch ngược).
- **IPN VNPAY Callback:** Gateway Ngân Hàng khi Khách trả tiền thành công sẽ âm thầm ping lệnh sang Server Cổng `/payments/vnpay`. Server sử dụng Hàm chữ ký CheckSum Hash so khớp IP ngầm do VNPay cấp riêng. Không pass Hash Checksum -> Đá Request IPN vì cho là Hacker làm giả Webhook.

## 4. TỐI ƯU HÓA NĂNG LỰC DỊCH CHUYỂN DỮ LIỆU ĐÁM ĐÔNG (O(1) Data Optimization)

(Kỹ Thuật vừa được Dev Áp dụng để sửa 500 Network)

- **Cựu Lỗi Batch Lặp:** Backend cũ quét 1 vòng List các máy bay bằng Stream -> Gửi 1000 Queries lẻ tẻ cắm vào pool CSDL sinh lỗi N+1 Query cực đoan.
- **Hiện hành Batch In-Memory Map:** Toàn bộ Object IDs được lọc Map trên RAM Backend. Dùng đúng 1 Câu IN Clause đẩy xuống SQL `findByIdIn([List ID])`. DB ném ngược Payload lớn về RAM. JVM xử lý trỏ Reference Java `classMap.get(id)`. Đạt Cảnh giới tốc độ Query O(1) Fetching nhanh như chớp cắm cực ít chi phí Network Connection.
