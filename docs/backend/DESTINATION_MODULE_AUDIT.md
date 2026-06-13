# KẾT QUẢ KIỂM TOÁN MÔ-ĐUN QUẢN LÝ ĐIỂM ĐẾN (DESTINATIONS)

## 1. Khảo sát Cấu trúc Cơ sở dữ liệu (Database Schema)

Hệ thống sử dụng mô hình "Data-Rich Entity" phân tán dữ liệu ra nhiều bảng con vệ tinh. Tổng cộng có **11 bảng** liên quan đến Destination:

- **`destinations`**: Bảng lõi, quản lý trạng thái, tọa độ, mức đổ xô (`crowd_level`), và quan hệ cây phân cấp phân rã điểm đến (thông qua `parent_id`, `destination_path`, `destination_level`).
- **Bảng đa ngôn ngữ**: `destination_translations` (Áp dụng I18N locale).
- **Các bảng vệ tinh (OneToMany)**: `destination_media` (ảnh cover/gallery), `destination_activities` (hoạt động), `destination_events` (sự kiện), `destination_foods` (ẩm thực), `destination_specialties` (đặc sản), `destination_tips` (lưu ý).
- **Tính năng mở rộng**: `destination_follows` (User theo dõi điểm đến), `destination_proposals` (quy trình đề xuất từ cộng đồng và duyệt bởi admin).

_Nhận xét:_ Schema được chuẩn hóa ở mức rất tốt, không dồn cục (God table). Việc lưu trữ cấu trúc đường dẫn phân cấp (vd: `/1/22/`) giúp tối ưu truy vấn cây thư mục con mạnh mẽ.

---

## 2. Danh sách API Endpoints (Coverage)

Qua quá trình quét codebase, tôi tổng hợp được **16 Endpoints** chia thành 3 phân vùng chính:

### A. Quản trị viên (AdminDestinationController / AdminDestinationTranslationController)

1. `GET /admin/destinations` (Search/List) - Sử dụng QueryDSL.
2. `GET /admin/destinations/{uuid}` (Detail)
3. `POST /admin/destinations` (Create) - Có hỗ trợ Multipart Upload File qua Form-data
4. `PUT /admin/destinations/{uuid}` (Update) - Tương thích form update có file.
5. `DELETE /admin/destinations/{uuid}` (Soft Delete qua `deleted_at`)
6. `PATCH /admin/destinations/{uuid}/approve` (Duyệt đề xuất)
7. `PATCH /admin/destinations/{uuid}/reject` (Từ chối đề xuất)
8. `PUT /admin/destinations/{uuid}/translations/{locale}` - API quản lý ngôn ngữ trực tiếp.

### B. Hành khách / Public (DestinationController)

9. `GET /destinations` (Tìm kiếm Public - Cache Redis)
10. `GET /destinations/{uuid}` (Lấy Detail qua UUID - Cache Redis)
11. `GET /destinations/program/{programSlug}` (Lấy Detail bằng Slug kiểu OTA)
12. `POST /destinations/propose` (User đề xuất điểm đến mới)

### C. Theo dõi điểm đến (DestinationFollowController)

13. `GET /destinations/me/follows` & `GET /users/me/destination-follows`
14. `POST /destinations/{uuid}/follow` (Bấm Follow)
15. `DELETE /destinations/{uuid}/follow` (Hủy Follow)
16. `PUT /destinations/{uuid}/follow/settings` (Setup nhận thông báo cho sự kiện)

---

## 3. Rà soát Hiệu năng & Rủi ro Kiến trúc (Data Flow Audit)

Qua rà soát logic tại Tầng Service (`AdminDestinationService`, `DestinationQueryServiceImpl`) cùng công cụ `DestinationMapper`, hệ thống từng tồn tại 2 vấn đề **nút thắt cổ chai vòng lặp N+1 (N+1 Query Issue)** lớn, nhưng **đã được fix triệt để**:

> [!TIP]
> **Đã FIX Rủi ro N+1 Query trên API cấp danh sách Public (`GET /destinations`)**  
> Trước đây, trong hàm `DestinationQueryServiceImpl.toPublicResponse`, hệ thống lấy `coverImageUrl` bằng cách duyệt qua `destination.getMediaList()`. Vì quan hệ `mediaList` FETCH LAZY nên bị N+1.
> **Fix:** Đã tách ra 1 hàm `batchResolveCoverImages(destinations)` dùng câu lệnh `SELECT m FROM DestinationMedia m WHERE m.destination.id IN :ids` để gom nhóm toàn bộ ID điểm đến vào và lấy cùng lúc, xóa sổ N+1 hoàn toàn.

> [!TIP]
> **Đã FIX Lỗi N+1 với quan hệ Phân cấp (Parent) trên API Admin (`GET /admin/destinations`)**  
> Việc gọi mapper dẫn tới chạy `entity.getParent().getUuid()`.
> **Fix:** Ở Tầng Service, đã đổi logic, ignore DTO mapper `parentUuid` mặc định, và xây dựng map thủ công `parentUuidMap` qua `destinationRepository.findAllById(parentIds)`.

_Note Optimizations (Điểm cộng):_ Nhóm phát triển backend đã thực thi rất tốt việc fetch gom lô (Batch Fetching) cho `DestinationTranslation` (`loadDestinationTranslations()`) và Map in-memory count cho Active Tours. Nay áp dụng tư duy "IN query" này giải quyết thêm cho Media và Parent thì ứng dụng cực kỳ hoàn mỹ.

---

## 4. Tích hợp Frontend (Frontend Alignment)

Frontend đang tách rời rất gọn gàng:

- **`src/module/destinations`**: Module công khai, hiển thị chi tiết (bắn request tới cụm API `/destinations`), sử dụng `useGetDestinations` (React Query) với Suspense Boundries tốt.
- **`src/module/admin/features/destinations`**: Quản trị (bắn đến `/admin/destinations`). Logic form upload file qua multipart Form Data tương ứng cực kỳ chính xác với Backend.

Mọi thứ đang chuẩn chỉ. Sau khi fix N+1 Query kia, hệ thống có thể scale ra hàng chục nghìn điểm đến. Giao tiếp DTO hiện tại "No Over-fetching" (API List chỉ gọi ListDTO gọn thay vì nhồi toàn bộ Event/Tips ra ngoài) giúp Response Payload siêu nhỏ. Đạt tiêu chuẩn Production!
