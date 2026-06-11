# BÁO CÁO KIỂM TOÁN LÕI HỆ THỐNG BACKEND - PHÂN TÍCH TẦN SÂU NGHIỆP VỤ (DEEP DIVE)

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `AI`

### 1. Database Schema (Các Bảng Dữ Liệu)
*Không có Bảng/Thực thể Database nào nằm trong module này.*

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `POST` | `/ai/chat` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `chat` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `AUTH`

### 1. Database Schema (Các Bảng Dữ Liệu)
*Không có Bảng/Thực thể Database nào nằm trong module này.*

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `POST` | `/auth/register` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `register` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/auth/login` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `login` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/auth/refresh` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `refresh` | ✅ Áp dụng Trang chủ Client Web B2C |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `BOOKINGS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `Booking` | **bookings** | Lưu trữ thông tin giao dịch đặt vé tổng hợp (Master Record). Tóm tắt giá trị tổng tiền và liên kết sang các dịch vụ Tour/Flight/Hotel. |
| `BookingComboItem` | **booking_combo_items** | Lưu trữ sản phẩm chi tiết của siêu gói (Combo). Cho phép đối soát tài chính khi bóc tách doanh thu của riêng vé bay hay khách sạn bên trong Combo. |
| `BookingPassenger` | **booking_passengers** | Lưu trữ thông tin khách hàng đi kèm. Dữ liệu sinh tử dùng để xuất vé máy bay (Ticketing) lưu ý chuẩn APIS/Passport. |
| `BookingProduct` | **booking_products** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `BookingStatusHistory` | **booking_status_history** | Lưu vết (Audit Log) thời gian thực về chuyển trạng thái (Pending -> Paid -> Cancelled). Ngăn chặn chối bỏ trách nhiệm. |
| `ComboBooking` | **combo_bookings** | Lưu cấu hình phiên bản đóng băng (Snapshot) của gói dịch vụ tích hợp tại thời điểm thanh toán. |
| `FlightBooking` | **flight_bookings** | Bảng ánh xạ trực tiếp với GDS hàng không. Gồm thông tin PNR (Mã đặt chỗ), hạng ghế, số hiệu bay. |
| `FlightBookingPassenger` | **flight_booking_passengers** | Danh sách hành khách tham gia chuyến bay, bắt buộc tuân thủ chuẩn danh tính Hàng không. |
| `HotelBooking` | **hotel_bookings** | Ghi nhận số lượng phòng thuê, loại phòng (Room Type ID), ngày check-in/checkout để đồng bộ kênh Quản lý Phòng ảo (PMS / Allotments). |
| `HotelBookingGuest` | **hotel_booking_guests** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `bookings` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `bookings` | `bookingCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `bookings` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `bookings` | `scheduleId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `bookings` | `orderId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `bookings` | `contactName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `bookings` | `contactPhone` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `bookings` | `contactEmail` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `booking_combo_items` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_combo_items` | `bookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_combo_items` | `comboId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_combo_items` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `booking_passengers` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_passengers` | `bookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_passengers` | `passengerType` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `booking_passengers` | `fullName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `booking_passengers` | `gender` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `booking_passengers` | `dateOfBirth` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `booking_passengers` | `identityNo` | `String` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_passengers` | `passportNo` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `booking_products` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_products` | `bookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_products` | `productId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_products` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `booking_status_history` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_status_history` | `bookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `booking_status_history` | `oldStatus` | `BookingStatus` | Cờ Enum vòng đời. Mấu chốt của Data Filtering và quản lý Logic hệ thống (Thay vì xóa mềm DB). |
| `booking_status_history` | `newStatus` | `BookingStatus` | Cờ Enum vòng đời. Mấu chốt của Data Filtering và quản lý Logic hệ thống (Thay vì xóa mềm DB). |
| `booking_status_history` | `changedBy` | `UUID` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `booking_status_history` | `changeReason` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `booking_status_history` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `combo_bookings` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `combo_bookings` | `bookingCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `combo_bookings` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `combo_bookings` | `orderId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `combo_bookings` | `comboId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `combo_bookings` | `travelStartDate` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `combo_bookings` | `travelEndDate` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `combo_bookings` | `selectionSnapshotJson` | `String` | Màng NoSQL nằm ngầm trong Data Table. Lưu cấu hình phi cấu trúc mà không phải Build lại Cột DB. |
| `flight_bookings` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flight_bookings` | `bookingCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `flight_bookings` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flight_bookings` | `orderId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flight_bookings` | `flightId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flight_bookings` | `flightClassId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flight_bookings` | `departureDate` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flight_bookings` | `returnFlightId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flight_booking_passengers` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flight_booking_passengers` | `flightBookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flight_booking_passengers` | `fullName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `flight_booking_passengers` | `dateOfBirth` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flight_booking_passengers` | `passportNo` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flight_booking_passengers` | `identityNo` | `String` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_bookings` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_bookings` | `bookingCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `hotel_bookings` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_bookings` | `orderId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_bookings` | `hotelId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_bookings` | `roomTypeId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_bookings` | `checkinDate` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_bookings` | `checkoutDate` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_booking_guests` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_booking_guests` | `hotelBookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_booking_guests` | `fullName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `hotel_booking_guests` | `dateOfBirth` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_booking_guests` | `identityNo` | `String` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `POST` | `/bookings/quote` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `quoteBooking` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/bookings/me` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyBookings` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/bookings/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getBooking` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/bookings/{id}/status-history` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getBookingStatusHistory` | ✅ Áp dụng Trang chủ Client Web B2C |
| `PATCH` | `/bookings/{id}/cancel` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `cancelBooking` | ✅ Áp dụng Trang chủ Client Web B2C |
| `PATCH` | `/bookings/{id}/check-in` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `checkInBooking` | ✅ Áp dụng Trang chủ Client Web B2C |
| `PATCH` | `/bookings/{id}/complete` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `completeBooking` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/bookings/hotels` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `createHotelBooking` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/bookings/flights` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `createFlightBooking` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/bookings/combos` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `createComboBooking` | ✅ Áp dụng Trang chủ Client Web B2C |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `COMMERCE`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `ComboPackage` | **combo_packages** | Định nghĩa một gói du lịch lai (Bundle). Ví dụ: 1 Khách sạn + 1 Chuyến bay + Discount. |
| `ComboPackageItem` | **combo_package_items** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `Product` | **products** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `combo_packages` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `combo_packages` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `combo_packages` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `combo_packages` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `combo_packages` | `destinationId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `combo_packages` | `pricingRuleJson` | `String` | Màng NoSQL nằm ngầm trong Data Table. Lưu cấu hình phi cấu trúc mà không phải Build lại Cột DB. |
| `combo_packages` | `startAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `combo_packages` | `endAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `combo_package_items` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `combo_package_items` | `comboPackage` | `ComboPackage` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `combo_package_items` | `itemType` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `combo_package_items` | `itemRefId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `combo_package_items` | `itemName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `combo_package_items` | `unitPriceSnapshot` | `BigDecimal` | Chỉ số Tài chính kế toán. Dữ liệu nhạy cảm cực cao ảnh hưởng lợi nhuận. |
| `combo_package_items` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `products` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `products` | `sku` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `products` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `products` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `products` | `productType` | `ProductType` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `products` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `products` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/combo-packages/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getComboPackage` | ⚠️ Hệ Khách đang dần tích hợp (WIP) |
| `PUT` | `/combo-packages/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateComboPackage` | ⚠️ Hệ Khách đang dần tích hợp (WIP) |
| `PATCH` | `/combo-packages/{id}/status` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateComboPackageStatus` | ⚠️ Hệ Khách đang dần tích hợp (WIP) |
| `GET` | `/products/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getProduct` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PUT` | `/products/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateProduct` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PATCH` | `/products/{id}/status` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateProductStatus` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/combos/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getById` | ⚠️ Hệ Khách đang dần tích hợp (WIP) |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `DASHBOARD`

### 1. Database Schema (Các Bảng Dữ Liệu)
*Không có Bảng/Thực thể Database nào nằm trong module này.*

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/admin/dashboard/statistics` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getStatistics` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `DESTINATIONS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `Destination` | **destinations** | Hạt nhân điểm đến địa lý, thiết kế theo cấu trúc Cây/Đường dẫn tĩnh phục vụ SEO và Category Filter. |
| `DestinationActivity` | **destination_activities** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `DestinationEvent` | **destination_events** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `DestinationFollow` | **uk_destination_follow** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `DestinationFood` | **destination_foods** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `DestinationMedia` | **destination_media** | CDN Media. Tách Resource nặng ra khỏi bảng lõi để API truy xuất In-memory cực kỳ nhẹ. |
| `DestinationSpecialty` | **destination_specialties** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `DestinationTip` | **destination_tips** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `DestinationTranslation` | **uk_destination_translations_dest_locale** | Bảng Đa ngôn ngữ (Localize/I18N), giúp scale data tiếng nước ngoài không phá vỡ DB lõi. |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `destinations` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `destinations` | `uuid` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `destinations` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `destinations` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `destinations` | `slug` | `String` | Đường dẫn liên kết SEO thân thiện, tăng cường khả năng xuất hiện trên máy tìm kiếm. |
| `destinations` | `province` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destinations` | `district` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destinations` | `region` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_activities` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `destination_activities` | `destination` | `Destination` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_activities` | `activityName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `destination_activities` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_events` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `destination_events` | `destination` | `Destination` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_events` | `eventName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `destination_events` | `eventType` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_events` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_events` | `startsAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_events` | `endsAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_destination_follow` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `uk_destination_follow` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `uk_destination_follow` | `destination` | `Destination` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_foods` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `destination_foods` | `destination` | `Destination` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_foods` | `foodName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `destination_foods` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_media` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `destination_media` | `destination` | `Destination` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_media` | `mediaUrl` | `String` | Resource Locator đường dẫn tĩnh. |
| `destination_media` | `altText` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_specialties` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `destination_specialties` | `destination` | `Destination` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_specialties` | `specialtyName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `destination_specialties` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_tips` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `destination_tips` | `destination` | `Destination` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_tips` | `tipTitle` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `destination_tips` | `tipContent` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_destination_translations_dest_locale` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `uk_destination_translations_dest_locale` | `destination` | `Destination` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_destination_translations_dest_locale` | `locale` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_destination_translations_dest_locale` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `uk_destination_translations_dest_locale` | `shortDescription` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_destination_translations_dest_locale` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/admin/destinations/{uuid}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getDestination` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `POST` | `/admin/destinationsimageFiles` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `createDestinationWithMedia` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/destinations/{uuid}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateDestination` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/destinations/{uuid}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateDestinationWithMedia` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `DELETE` | `/admin/destinations/{uuid}` | Luật vô hiệu hóa dữ liệu. Block API với Soft-Delete. Controller Func: `deleteDestination` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PATCH` | `/admin/destinations/{uuid}/approve` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `approveProposal` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PATCH` | `/admin/destinations/{uuid}/reject` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `rejectProposal` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/destinations/{destinationUuid}/translations/{locale}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `upsert` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/destinations/program/{programSlug}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getDestinationByProgramSlug` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/destinations/{uuid}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getDestination` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/destinations/propose` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `proposeDestination` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/destinations/{uuid}/follow` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `followDestination` | ✅ Áp dụng Trang chủ Client Web B2C |
| `DELETE` | `/destinations/{uuid}/follow` | Luật vô hiệu hóa dữ liệu. Block API với Soft-Delete. Controller Func: `unfollowDestination` | ✅ Áp dụng Trang chủ Client Web B2C |
| `PUT` | `/destinations/{uuid}/follow/settings` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateFollowSettings` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/destinations/me/follows` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyFollows` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/users/me/destination-follows` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyDestinationFollows` | ✅ Áp dụng Trang chủ Client Web B2C |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `ENGAGEMENT`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `RecommendationLog` | **recommendation_logs** | Bảng Ghi Log Đóng băng. Chống thao tác xóa lén (DELETE), bắt buộc cho Tracking/Compliance. |
| `UserTourView` | **user_tour_views** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `WishlistTour` | **wishlist_tours** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `recommendation_logs` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `recommendation_logs` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `recommendation_logs` | `requestedTag` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `recommendation_logs` | `requestedBudget` | `BudgetLevel` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `recommendation_logs` | `requestedTripMode` | `PreferredTripMode` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `recommendation_logs` | `requestedPeopleCount` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `recommendation_logs` | `requestedDepartureAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `recommendation_logs` | `generatedResult` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_tour_views` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_tour_views` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_tour_views` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_tour_views` | `viewedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `wishlist_tours` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `wishlist_tours` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `wishlist_tours` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `wishlist_tours` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `POST` | `/users/me/recommendations/tours` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `generateMyTourRecommendations` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/users/me/recommendations/logs` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyRecommendationLogs` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/users/me/wishlist/tours/{tourId}` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `addMyWishlistTour` | ✅ Áp dụng Trang chủ Client Web B2C |
| `DELETE` | `/users/me/wishlist/tours/{tourId}` | Luật vô hiệu hóa dữ liệu. Block API với Soft-Delete. Controller Func: `removeMyWishlistTour` | ✅ Áp dụng Trang chủ Client Web B2C |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `FLIGHTS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `Airline` | **airlines** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `Airport` | **airports** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `Flight` | **flights** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `FlightClass` | **flight_classes** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `FlightFareRule` | **flight_fare_rules** | Hệ thống Quản trị Luật số. Dễ thao tác đổi chính sách kinh doanh (ví dụ: Chính sách hủy) trên giao diện thay vì đổi Code. |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `airlines` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `airlines` | `codeIata` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `airlines` | `codeIcao` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `airlines` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `airlines` | `logoUrl` | `String` | Resource Locator đường dẫn tĩnh. |
| `airlines` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `airlines` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `airports` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `airports` | `codeIata` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `airports` | `codeIcao` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `airports` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `airports` | `cityName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `airports` | `destination` | `Destination` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `airports` | `latitude` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `airports` | `longitude` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flights` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flights` | `airline` | `Airline` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flights` | `flightNo` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flights` | `originAirport` | `Airport` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flights` | `destinationAirport` | `Airport` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flights` | `departureTimeLocal` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flights` | `arrivalTimeLocal` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flights` | `durationMinutes` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flight_classes` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flight_classes` | `flight` | `Flight` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flight_classes` | `fareRule` | `FlightFareRule` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flight_classes` | `cabinClass` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flight_classes` | `baggageRuleJson` | `String` | Màng NoSQL nằm ngầm trong Data Table. Lưu cấu hình phi cấu trúc mà không phải Build lại Cột DB. |
| `flight_classes` | `changeRefundRuleJson` | `String` | Màng NoSQL nằm ngầm trong Data Table. Lưu cấu hình phi cấu trúc mà không phải Build lại Cột DB. |
| `flight_classes` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `flight_classes` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flight_fare_rules` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `flight_fare_rules` | `flightClass` | `FlightClass` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `flight_fare_rules` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `flight_fare_rules` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `PUT` | `/admin/flights/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `update` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/flights/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getFlight` | ⚠️ Hệ Khách đang dần tích hợp (WIP) |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `HOTELS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `Hotel` | **hotels** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `HotelAmenity` | **hotel_amenities** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `HotelImage` | **hotel_images** | CDN Media. Tách Resource nặng ra khỏi bảng lõi để API truy xuất In-memory cực kỳ nhẹ. |
| `HotelRoomInventory` | **hotel_room_inventory** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `HotelRoomType` | **hotel_room_types** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `hotels` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotels` | `supplierId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotels` | `destination` | `Destination` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotels` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `hotels` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `hotels` | `slug` | `String` | Đường dẫn liên kết SEO thân thiện, tăng cường khả năng xuất hiện trên máy tìm kiếm. |
| `hotels` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotels` | `starRating` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_amenities` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_amenities` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `hotel_amenities` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `hotel_amenities` | `icon` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_amenities` | `category` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_amenities` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `hotel_amenities` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_images` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_images` | `hotel` | `Hotel` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_images` | `mediaUrl` | `String` | Resource Locator đường dẫn tĩnh. |
| `hotel_images` | `altText` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_room_inventory` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_room_inventory` | `roomType` | `HotelRoomType` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_room_inventory` | `stayDate` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_room_inventory` | `priceOverride` | `BigDecimal` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_room_inventory` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `hotel_room_inventory` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_room_types` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `hotel_room_types` | `hotel` | `Hotel` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_room_types` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `hotel_room_types` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `hotel_room_types` | `bedType` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `hotel_room_types` | `childSurchargeRules` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `PUT` | `/admin/hotels/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `update` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/hotels/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getHotel` | ⚠️ Hệ Khách đang dần tích hợp (WIP) |
| `GET` | `/hotels/{id}/detail` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getHotelDetail` | ⚠️ Hệ Khách đang dần tích hợp (WIP) |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `LOYALTY`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `BadgeDefinition` | **badge_definitions** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `MissionDefinition` | **mission_definitions** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `PassportBadge` | **passport_badges** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `PassportVisitedDestination` | **passport_visited_destinations** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `TravelPassport` | **travel_passports** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `UserCheckin` | **user_checkins** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `UserMission` | **uk_user_mission** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `badge_definitions` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `badge_definitions` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `badge_definitions` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `badge_definitions` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `badge_definitions` | `iconUrl` | `String` | Resource Locator đường dẫn tĩnh. |
| `badge_definitions` | `conditionJson` | `String` | Màng NoSQL nằm ngầm trong Data Table. Lưu cấu hình phi cấu trúc mà không phải Build lại Cột DB. |
| `badge_definitions` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `mission_definitions` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `mission_definitions` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `mission_definitions` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `mission_definitions` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `mission_definitions` | `ruleJson` | `String` | Màng NoSQL nằm ngầm trong Data Table. Lưu cấu hình phi cấu trúc mà không phải Build lại Cột DB. |
| `mission_definitions` | `rewardType` | `MissionRewardType` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `mission_definitions` | `rewardRefId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `mission_definitions` | `startAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `passport_badges` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `passport_badges` | `passportId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `passport_badges` | `badgeId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `passport_badges` | `unlockedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `passport_visited_destinations` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `passport_visited_destinations` | `passportId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `passport_visited_destinations` | `destinationId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `passport_visited_destinations` | `firstBookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `passport_visited_destinations` | `firstVisitedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `passport_visited_destinations` | `lastVisitedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `travel_passports` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `travel_passports` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `travel_passports` | `passportNo` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `travel_passports` | `lastTripAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `travel_passports` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `travel_passports` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_checkins` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_checkins` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_checkins` | `bookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_checkins` | `destinationId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_checkins` | `checkinLatitude` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_checkins` | `checkinLongitude` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_checkins` | `note` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_checkins` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `uk_user_mission` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `uk_user_mission` | `user` | `User` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_user_mission` | `mission` | `MissionDefinition` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_user_mission` | `completedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_user_mission` | `claimedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/badges/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getBadge` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PUT` | `/badges/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateBadge` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PATCH` | `/badges/{id}/status` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateBadgeStatus` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `POST` | `/badges/{badgeId}/grant/users/{userId}` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `grantBadge` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/admin/missions/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getMissionById` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/missions/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateMission` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PATCH` | `/admin/missions/{id}/status` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `toggleMissionStatus` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `POST` | `/users/me/missions/{id}/claim` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `claimReward` | ✅ Áp dụng Trang chủ Client Web B2C |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `NOTIFICATIONS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `Notification` | **notifications** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `notifications` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `notifications` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `notifications` | `notificationType` | `NotificationType` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `notifications` | `title` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `notifications` | `body` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `notifications` | `referenceType` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `notifications` | `referenceId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `notifications` | `payload` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `PATCH` | `/users/me/notifications/{id}/read` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `markMyNotificationRead` | ✅ Áp dụng Trang chủ Client Web B2C |
| `PATCH` | `/users/me/notifications/read-all` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `markAllMyNotificationsRead` | ✅ Áp dụng Trang chủ Client Web B2C |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `ORDERS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `Order` | **orders** | Khối gốc của vòng đời thanh toán eCommerce. Giữ tổng số tiền và gửi lệnh khởi tạo sang Payment Gateway. |
| `OrderItem` | **order_items** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `orders` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `orders` | `orderCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `orders` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `orders` | `note` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `orders` | `expiresAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `orders` | `placedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `orders` | `completedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `orders` | `cancelledAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `order_items` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `order_items` | `orderId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `order_items` | `itemType` | `OrderItemType` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `order_items` | `itemRefId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `order_items` | `itemName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `order_items` | `metadataJson` | `String` | Màng NoSQL nằm ngầm trong Data Table. Lưu cấu hình phi cấu trúc mà không phải Build lại Cột DB. |
| `order_items` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
*Không có API Cổng kết nối (HTTP Endpoints) trong module này.*

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `PAYMENTS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `Payment` | **payments** | Lưu chứng từ hệ thống cổng thanh toán thứ 3 (Ví dụ VNPay / Stripe). Đây là dữ liệu dùng để giải quyết tranh chấp bồi hoàn (Dispute). |
| `RefundRequest` | **refund_requests** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `payments` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `payments` | `paymentCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `payments` | `bookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `payments` | `orderId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `payments` | `paymentMethod` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `payments` | `provider` | `String` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `payments` | `transactionRef` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `payments` | `amount` | `BigDecimal` | Lượng tiền / Số lượng. Mọi sự thay đổi (Mutation) đều phải trigger file log. |
| `refund_requests` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `refund_requests` | `refundCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `refund_requests` | `bookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `refund_requests` | `reasonType` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `refund_requests` | `reasonDetail` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `refund_requests` | `refundMethod` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `refund_requests` | `policySnapshot` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `refund_requests` | `processedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/payments/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getPayment` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/refunds/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getRefund` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PATCH` | `/refunds/{id}/approve` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `approveRefund` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `POST` | `/payments/vnpay/checkout` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `createCheckout` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/payments/vnpay/ipn` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `unknown` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `PROMOTIONS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `PromotionCampaign` | **promotion_campaigns** | Bảng Chiến dịch Marketing. Định nghĩa ranh giới ngân sách tối đa (Max Budget) và thời gian sống (TTL) của các mã Voucher. |
| `Voucher` | **vouchers** | Mỗi dòng là một mã giảm giá độc lập. Quản lý % giảm giá, tổng số lần sử dụng tối đa. |
| `VoucherUserClaim` | **voucher_user_claims** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `promotion_campaigns` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `promotion_campaigns` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `promotion_campaigns` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `promotion_campaigns` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `promotion_campaigns` | `imageUrl` | `String` | Resource Locator đường dẫn tĩnh. |
| `promotion_campaigns` | `imageAlt` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `promotion_campaigns` | `displayTitle` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `promotion_campaigns` | `displaySubtitle` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `vouchers` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `vouchers` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `vouchers` | `campaignId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `vouchers` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `vouchers` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `vouchers` | `discountType` | `VoucherDiscountType` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `vouchers` | `maxDiscountAmount` | `BigDecimal` | Lượng tiền / Số lượng. Mọi sự thay đổi (Mutation) đều phải trigger file log. |
| `vouchers` | `usageLimitTotal` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `voucher_user_claims` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `voucher_user_claims` | `voucherId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `voucher_user_claims` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `voucher_user_claims` | `claimedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/promotion-campaigns/public` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getPublicPromotionCampaigns` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/promotion-campaigns/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getPromotionCampaign` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PUT` | `/promotion-campaigns/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updatePromotionCampaign` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PATCH` | `/promotion-campaigns/{id}/status` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updatePromotionCampaignStatus` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `DELETE` | `/promotion-campaigns/{id}` | Luật vô hiệu hóa dữ liệu. Block API với Soft-Delete. Controller Func: `deletePromotionCampaign` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/vouchers/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getVoucher` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PUT` | `/vouchers/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateVoucher` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PATCH` | `/vouchers/{id}/status` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateVoucherStatus` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `DELETE` | `/vouchers/{id}` | Luật vô hiệu hóa dữ liệu. Block API với Soft-Delete. Controller Func: `deleteVoucher` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/users/me/vouchers` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyVouchers` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/vouchers/claim` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `claimVoucher` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `POST` | `/users/me/vouchers/claim` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `claimVoucherForCurrentUser` | ✅ Áp dụng Trang chủ Client Web B2C |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `REVIEWS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `CustomerTestimonial` | **customer_testimonials** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `CustomerTestimonialTranslation` | **uk_customer_testimonial_translations_testimonial_locale** | Bảng Đa ngôn ngữ (Localize/I18N), giúp scale data tiếng nước ngoài không phá vỡ DB lõi. |
| `Review` | **reviews** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `ReviewAspect` | **review_aspects** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `ReviewReply` | **review_replies** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `customer_testimonials` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `customer_testimonials` | `customerName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `customer_testimonials` | `customerTitle` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `customer_testimonials` | `content` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `customer_testimonials` | `avatarUrl` | `String` | Resource Locator đường dẫn tĩnh. |
| `customer_testimonials` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `customer_testimonials` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_customer_testimonial_translations_testimonial_locale` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `uk_customer_testimonial_translations_testimonial_locale` | `testimonial` | `CustomerTestimonial` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_customer_testimonial_translations_testimonial_locale` | `locale` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_customer_testimonial_translations_testimonial_locale` | `customerName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `uk_customer_testimonial_translations_testimonial_locale` | `customerTitle` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_customer_testimonial_translations_testimonial_locale` | `content` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `reviews` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `reviews` | `bookingId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `reviews` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `reviews` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `reviews` | `scheduleId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `reviews` | `overallRating` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `reviews` | `title` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `reviews` | `content` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `review_aspects` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `review_aspects` | `reviewId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `review_aspects` | `aspectName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `review_aspects` | `aspectRating` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `review_aspects` | `comment` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `review_replies` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `review_replies` | `reviewId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `review_replies` | `staffId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `review_replies` | `content` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `review_replies` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/testimonials/public` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getPublicTestimonials` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/reviews/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getReview` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/reviews/tours/{tourId}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getTourReviews` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/reviews/me` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyReviews` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `POST` | `/reviews/{id}/replies` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `replyReview` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PATCH` | `/reviews/{id}/moderation` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `moderateReview` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `SCHEDULECHAT`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `ScheduleChatMessage` | **schedule_chat_messages** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `ScheduleChatRoom` | **schedule_chat_rooms** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `ScheduleChatRoomMember` | **schedule_chat_room_members** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `schedule_chat_messages` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `schedule_chat_messages` | `roomId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `schedule_chat_messages` | `senderUserId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `schedule_chat_messages` | `messageText` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `schedule_chat_messages` | `attachmentUrl` | `String` | Resource Locator đường dẫn tĩnh. |
| `schedule_chat_messages` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `schedule_chat_rooms` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `schedule_chat_rooms` | `scheduleId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `schedule_chat_rooms` | `roomName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `schedule_chat_rooms` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `schedule_chat_room_members` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `schedule_chat_room_members` | `roomId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `schedule_chat_room_members` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `schedule_chat_room_members` | `joinedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/admin/schedules/{scheduleId}/chat-room` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getRoom` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/schedules/{scheduleId}/chat-room` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `upsertRoom` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/admin/schedules/{scheduleId}/chat-room/messages` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMessages` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `POST` | `/admin/schedules/{scheduleId}/chat-room/messages` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `sendMessage` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PATCH` | `/admin/schedules/{scheduleId}/chat-room/members/{userId}/mute` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `muteMember` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/schedules/{scheduleId}/chat-room` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyRoom` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/schedules/{scheduleId}/chat-room/messages` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyMessages` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `POST` | `/schedules/{scheduleId}/chat-room/messages` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `sendMyMessage` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `SUPPORT`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `SupportMessage` | **support_messages** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `SupportSession` | **support_sessions** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `support_messages` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `support_messages` | `sessionId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `support_messages` | `senderType` | `SupportSenderType` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `support_messages` | `senderUserId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `support_messages` | `messageText` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `support_messages` | `attachmentUrl` | `String` | Resource Locator đường dẫn tĩnh. |
| `support_messages` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `support_sessions` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `support_sessions` | `sessionCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `support_sessions` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `support_sessions` | `assignedStaffId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `support_sessions` | `startedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `support_sessions` | `endedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `support_sessions` | `lastMessageAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `support_sessions` | `rating` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/support/sessions/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getSupportSession` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PATCH` | `/support/sessions/{id}/assign` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `assignSupportSession` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PATCH` | `/support/sessions/{id}/status` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateSupportSessionStatus` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `POST` | `/support/sessions/{id}/messages` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `sendSupportReply` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/users/me/support/sessions/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getMySupportSession` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/users/me/support/sessions/{id}/messages` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `sendMySupportMessage` | ✅ Áp dụng Trang chủ Client Web B2C |
| `PATCH` | `/users/me/support/sessions/{id}/rate` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `rateMySupportSession` | ✅ Áp dụng Trang chủ Client Web B2C |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `SYSTEM`

### 1. Database Schema (Các Bảng Dữ Liệu)
*Không có Bảng/Thực thể Database nào nằm trong module này.*

### 3. API Endpoints (Giao tiếp Phía Frontend)
*Không có API Cổng kết nối (HTTP Endpoints) trong module này.*

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `TOURS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `CancellationPolicy` | **cancellation_policies** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `CancellationPolicyRule` | **cancellation_policy_rules** | Hệ thống Quản trị Luật số. Dễ thao tác đổi chính sách kinh doanh (ví dụ: Chính sách hủy) trên giao diện thay vì đổi Code. |
| `Guide` | **guides** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `GuideTranslation` | **uk_guide_translations_guide_locale** | Bảng Đa ngôn ngữ (Localize/I18N), giúp scale data tiếng nước ngoài không phá vỡ DB lõi. |
| `ItineraryItem` | **itinerary_items** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `Tag` | **tags** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `Tour` | **tours** | Đối tượng kinh doanh lõi của OTA. Quản lý metadata Tour, chỉ số ESGs, giá Base, và điểm đón trả. |
| `TourChecklistItem` | **tour_checklist_items** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `TourComboPackageLink` | **tour_combo_packages** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `TourDepartureHub` | **tour_departure_hubs** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `TourInclusionFlags` | **tour_inclusion_flags** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `TourItineraryDay` | **tour_itinerary_days** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `TourMedia` | **tour_media** | CDN Media. Tách Resource nặng ra khỏi bảng lõi để API truy xuất In-memory cực kỳ nhẹ. |
| `TourSchedule` | **tour_schedules** | Bảng Tồn Kho (Inventory). Cập nhật số ghế mua real-time, khóa chặn hành vi Overbooking (Bán lố chỗ). |
| `TourScheduleGuide` | **tour_schedule_guides** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `TourSchedulePickupPoint` | **tour_schedule_pickup_points** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `TourSeasonality` | **tour_seasonality** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `TourTag` | **tour_tags** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `TourTranslation` | **uk_tour_translations_tour_locale** | Bảng Đa ngôn ngữ (Localize/I18N), giúp scale data tiếng nước ngoài không phá vỡ DB lõi. |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `cancellation_policies` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `cancellation_policies` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `cancellation_policies` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `cancellation_policies` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `cancellation_policies` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `cancellation_policy_rules` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `cancellation_policy_rules` | `policyId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `cancellation_policy_rules` | `minHoursBefore` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `cancellation_policy_rules` | `maxHoursBefore` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `cancellation_policy_rules` | `notes` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `cancellation_policy_rules` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `guides` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `guides` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `guides` | `fullName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `guides` | `phone` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `guides` | `email` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `guides` | `localRegion` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `guides` | `bio` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `guides` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `uk_guide_translations_guide_locale` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `uk_guide_translations_guide_locale` | `guide` | `Guide` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `uk_guide_translations_guide_locale` | `locale` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_guide_translations_guide_locale` | `fullName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `uk_guide_translations_guide_locale` | `bio` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `itinerary_items` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `itinerary_items` | `itineraryDayId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `itinerary_items` | `sequenceNo` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `itinerary_items` | `itemType` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `itinerary_items` | `title` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `itinerary_items` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `itinerary_items` | `destinationId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `itinerary_items` | `locationName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `tags` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tags` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `tags` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `tags` | `tagGroup` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tags` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tags` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `tours` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tours` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `tours` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `tours` | `slug` | `String` | Đường dẫn liên kết SEO thân thiện, tăng cường khả năng xuất hiện trên máy tìm kiếm. |
| `tours` | `cancellationPolicyId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tours` | `shortDescription` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tours` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tours` | `highlights` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_checklist_items` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_checklist_items` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_checklist_items` | `itemName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `tour_checklist_items` | `itemGroup` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_combo_packages` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_combo_packages` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_combo_packages` | `comboId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_combo_packages` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `tour_combo_packages` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_departure_hubs` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_departure_hubs` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_departure_hubs` | `cityCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `tour_departure_hubs` | `cityNameVi` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `tour_departure_hubs` | `cityNameEn` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `tour_inclusion_flags` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_inclusion_flags` | `hotelStars` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_inclusion_flags` | `notes` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_inclusion_flags` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `tour_inclusion_flags` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_itinerary_days` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_itinerary_days` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_itinerary_days` | `dayNumber` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_itinerary_days` | `title` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_itinerary_days` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_itinerary_days` | `overnightDestinationId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_media` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_media` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_media` | `mediaType` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_media` | `mediaUrl` | `String` | Resource Locator đường dẫn tĩnh. |
| `tour_media` | `altText` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_schedules` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_schedules` | `scheduleCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `tour_schedules` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_schedules` | `departureAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_schedules` | `returnAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_schedules` | `bookingOpenAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_schedules` | `bookingCloseAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_schedules` | `meetingAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_schedule_guides` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_schedule_guides` | `scheduleId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_schedule_guides` | `guideId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_schedule_guides` | `assignedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_schedule_pickup_points` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_schedule_pickup_points` | `scheduleId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_schedule_pickup_points` | `pointName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `tour_schedule_pickup_points` | `address` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_schedule_pickup_points` | `latitude` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_schedule_pickup_points` | `longitude` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_schedule_pickup_points` | `pickupAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_seasonality` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_seasonality` | `tourId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_seasonality` | `seasonName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `tour_seasonality` | `monthFrom` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_seasonality` | `monthTo` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_seasonality` | `notes` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `tour_tags` | `id` | `TourTagId` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `tour_tags` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `uk_tour_translations_tour_locale` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `uk_tour_translations_tour_locale` | `tour` | `Tour` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_tour_translations_tour_locale` | `locale` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_tour_translations_tour_locale` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `uk_tour_translations_tour_locale` | `shortDescription` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_tour_translations_tour_locale` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_tour_translations_tour_locale` | `highlights` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `uk_tour_translations_tour_locale` | `inclusions` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `PUT` | `/admin/guides/{guideId}/translations/{locale}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `upsert` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/admin/tours/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getTour` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `POST` | `/admin/toursfileImage` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `createTourWithImage` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/tours/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateTour` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/tours/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateTourWithImage` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `DELETE` | `/admin/tours/{id}` | Luật vô hiệu hóa dữ liệu. Block API với Soft-Delete. Controller Func: `deleteTour` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/admin/tours/{tourId}/schedules` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getAdminTourSchedules` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/admin/tours/{tourId}/schedules/{scheduleId}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getAdminTourSchedule` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `POST` | `/admin/tours/{tourId}/schedules` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `createTourSchedule` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/tours/{tourId}/schedules/{scheduleId}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateTourSchedule` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PATCH` | `/admin/tours/{tourId}/schedules/{scheduleId}/status` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateTourScheduleStatus` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/tours/{tourId}/translations/{locale}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `upsert` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `DELETE` | `/admin/tours/{tourId}/translations/{locale}` | Luật vô hiệu hóa dữ liệu. Block API với Soft-Delete. Controller Func: `delete` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/tours/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getTour` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/tours/{id}/schedules` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getTourSchedules` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/tours/{tourId}/schedules/{scheduleId}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getTourSchedule` | ✅ Áp dụng Trang chủ Client Web B2C |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `USERS`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `AuditLog` | **audit_logs** | Bảng Ghi Log Đóng băng. Chống thao tác xóa lén (DELETE), bắt buộc cho Tracking/Compliance. |
| `Permission` | **permissions** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `Role` | **roles** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `User` | **users** | Lưu trữ hồ sơ khách hàng. Quản lý Authentication và phân quyền truy cập hệ thống (Role-based). |
| `UserAddress` | **user_addresses** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `UserDevice` | **user_devices** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `UserPreference` | **user_preferences** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `UserRole` | **user_roles** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `audit_logs` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `audit_logs` | `actorUserId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `audit_logs` | `actionName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `audit_logs` | `entityName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `audit_logs` | `entityId` | `String` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `audit_logs` | `oldData` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `audit_logs` | `newData` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `audit_logs` | `ipAddress` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `permissions` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `permissions` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `permissions` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `permissions` | `moduleName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `permissions` | `actionName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `permissions` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `roles` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `roles` | `code` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `roles` | `name` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `roles` | `description` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `users` | `id` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `users` | `email` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `users` | `phone` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `users` | `passwordHash` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `users` | `fullName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `users` | `displayName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `users` | `dateOfBirth` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `users` | `avatarUrl` | `String` | Resource Locator đường dẫn tĩnh. |
| `user_addresses` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_addresses` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_addresses` | `contactName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `user_addresses` | `contactPhone` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_addresses` | `province` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_addresses` | `district` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_addresses` | `ward` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_addresses` | `addressLine` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_devices` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_devices` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_devices` | `platform` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_devices` | `deviceName` | `String` | Dữ liệu Index Full-text cho Elastic Search/UI. Cần Encode để diệt XSS. |
| `user_devices` | `pushToken` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_devices` | `appVersion` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_devices` | `lastSeenAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_devices` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `user_preferences` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_preferences` | `userId` | `UUID` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_preferences` | `budgetLevel` | `BudgetLevel` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_preferences` | `preferredTripMode` | `PreferredTripMode` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_preferences` | `travelStyle` | `TravelStyle` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_preferences` | `preferredDepartureCity` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_preferences` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `user_preferences` | `updatedAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_roles` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `user_roles` | `user` | `User` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_roles` | `role` | `Role` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_roles` | `expiredAt` | `LocalDateTime` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_roles` | `assignedBy` | `UUID` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `user_roles` | `note` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/roles` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getRoles` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/roles/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getRoleById` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/permissions` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getPermissions` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `POST` | `/roles` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `createRole` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PUT` | `/roles/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateRole` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PATCH` | `/roles/{id}/permissions` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateRolePermissions` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/users/{id}` | Truy xuất chi tiết Đối tượng duy nhất. Thường In-Memory Cache cao. Controller Func: `getUserById` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PUT` | `/users/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateUser` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `PATCH` | `/users/{id}/deactivate` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `deactivateUser` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/users/me/access-context` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyAccessContext` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/users/me/addresses` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyAddresses` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/users/me/preferences` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyPreferences` | ✅ Áp dụng Trang chủ Client Web B2C |
| `PUT` | `/users/me/preferences` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateMyPreferences` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/users/me/devices` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getMyDevices` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/users/me/devices` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `registerMyDevice` | ✅ Áp dụng Trang chủ Client Web B2C |
| `POST` | `/users/me/addresses` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `createMyAddress` | ✅ Áp dụng Trang chủ Client Web B2C |
| `PUT` | `/users/me/addresses/{id}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateMyAddress` | ✅ Áp dụng Trang chủ Client Web B2C |
| `PATCH` | `/users/me/addresses/{id}/default` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `setMyDefaultAddress` | ✅ Áp dụng Trang chủ Client Web B2C |
| `DELETE` | `/users/me/addresses/{id}` | Luật vô hiệu hóa dữ liệu. Block API với Soft-Delete. Controller Func: `deleteMyAddress` | ✅ Áp dụng Trang chủ Client Web B2C |
| `DELETE` | `/users/me/devices/{id}` | Luật vô hiệu hóa dữ liệu. Block API với Soft-Delete. Controller Func: `deleteMyDevice` | ✅ Áp dụng Trang chủ Client Web B2C |

---

## 🏢 MẢNG NGHIỆP VỤ (MODULE): `WEATHER`

### 1. Database Schema (Các Bảng Dữ Liệu)
| Lớp Code Java (Entity) | Bảng Vật Lý (SQL Table) | Phân Tích Chuyên Sâu Tác Dụng Của Bảng (Core Role) |
|---|---|---|
| `CrowdPrediction` | **crowd_predictions** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `RouteEstimate` | **route_estimates** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `WeatherAlert` | **weather_alerts** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |
| `WeatherForecast` | **weather_forecasts** | Lưu trữ Entity Con chuẩn Phụ thuộc (One-To-Many). Chia nhỏ data theo Chuẩn 3NF (Bình Thường Hóa 3). |

### 2. Thiết Kế Trường Dữ Liệu Lõi (Field Architecture Breakdown)
| Thuộc Tên Bảng SQL | Cột Dữ Liệu (Field) | Kiểu Dữ Liệu Khai Báo | Phân Tích Ý Nghĩa & Vai Trò Trong Dự Án |
|---|---|---|---|
| `crowd_predictions` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `crowd_predictions` | `destinationId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `crowd_predictions` | `predictionDate` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `crowd_predictions` | `crowdLevel` | `CrowdLevel` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `crowd_predictions` | `predictedVisitors` | `Integer` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `crowd_predictions` | `confidenceScore` | `BigDecimal` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `crowd_predictions` | `reasonsJson` | `String` | Màng NoSQL nằm ngầm trong Data Table. Lưu cấu hình phi cấu trúc mà không phải Build lại Cột DB. |
| `crowd_predictions` | `createdAt` | `LocalDateTime` | Mốc thời gian quan trọng dùng cho Sorting Time-decay & Sync. |
| `route_estimates` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `route_estimates` | `fromLabel` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `route_estimates` | `toLabel` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `route_estimates` | `fromLatitude` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `route_estimates` | `fromLongitude` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `route_estimates` | `toLatitude` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `route_estimates` | `toLongitude` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `route_estimates` | `distanceKm` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `weather_alerts` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `weather_alerts` | `destinationId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `weather_alerts` | `scheduleId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `weather_alerts` | `severity` | `WeatherSeverity` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `weather_alerts` | `alertType` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `weather_alerts` | `title` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `weather_alerts` | `message` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `weather_alerts` | `actionAdvice` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `weather_forecasts` | `id` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `weather_forecasts` | `destinationId` | `Long` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |
| `weather_forecasts` | `forecastDate` | `LocalDate` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `weather_forecasts` | `weatherCode` | `String` | Mã Code Mã Hóa Identifier (Ví dụ In vé QR/Barcode BKG-482). |
| `weather_forecasts` | `summary` | `String` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `weather_forecasts` | `tempMin` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `weather_forecasts` | `tempMax` | `BigDecimal` | Trường String/Integer Phụ trợ thuần cung cấp Meta Logic cho Domain. |
| `weather_forecasts` | `humidityPercent` | `BigDecimal` | Khóa API/DB (Primary Key/UUID). Xương sống cho hệ O(1) Index Tra cứu. |

### 3. API Endpoints (Giao tiếp Phía Frontend)
| Mẫu Giao Tiếp (Method) | Tọa Độ Endpoint (Target URL) | Chức năng (Business Endpoint Meaning) | Trạng Thái App (Frontend Mapping Status) |
|-------------|-------------------|-----------------------------------|-------------------------------------|
| `GET` | `/admin/destinations/{destinationUuid}/weather/forecasts` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getForecasts` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/destinations/{destinationUuid}/weather/forecasts/{forecastDate}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `upsertForecast` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/admin/destinations/{destinationUuid}/weather/alerts` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getAlerts` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `POST` | `/admin/destinations/{destinationUuid}/weather/alerts` | Khởi tạo Dữ liệu mới. Gắn luồng Transaction SQL bảo vệ. Controller Func: `createAlert` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/destinations/{destinationUuid}/weather/alerts/{alertId}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateAlert` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PATCH` | `/admin/destinations/{destinationUuid}/weather/alerts/{alertId}/status` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `updateAlertStatus` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/admin/destinations/{destinationUuid}/weather/crowd-predictions` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getCrowdPredictions` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `PUT` | `/admin/destinations/{destinationUuid}/weather/crowd-predictions/{predictionDate}` | Cập nhật đè dữ liệu hoặc Bẻ ngoặt Status Pipeline. Controller Func: `upsertCrowdPrediction` | ✅ Áp dụng CMS Admin. Hook: (useQuery/useMutation) |
| `GET` | `/weather/realtime` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getRealtime` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/weather/forecast` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getForecast` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/weather/search` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `searchLocations` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/weather/ip` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `lookupIp` | ❌ API Nội Trữ - Phục vụ CronJob hoặc Đang Treo |
| `GET` | `/destinations/{destinationUuid}/weather/forecasts` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getDestinationForecasts` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/destinations/{destinationUuid}/weather/alerts` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getDestinationAlerts` | ✅ Áp dụng Trang chủ Client Web B2C |
| `GET` | `/destinations/{destinationUuid}/weather/crowd-predictions` | Lấy danh sách phân trang (Collection Endpoint) theo bộ lọc. Controller Func: `getDestinationCrowdPredictions` | ✅ Áp dụng Trang chủ Client Web B2C |

---

