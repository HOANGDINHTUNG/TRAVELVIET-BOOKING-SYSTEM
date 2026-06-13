# Backoffice Tours — Phase 5 Notes (Autocomplete · Media · Itinerary)

> Tài liệu này mô tả các **gap ở Backend** mà frontend Phase 5 phát hiện được khi
> tích hợp Destination Autocomplete, Tag Multi-select và Media Upload cho module
> Quản lý Tours. Không có gap nào _block_ chức năng — FE đã có fallback hoạt
> động được. Khi BE bổ sung các điểm dưới, frontend không cần sửa code.

## 1. Destination DTO không có `Long id`

| Item | Trạng thái |
|------|-----------|
| Endpoint dùng | `GET /destinations` (public) — `DestinationController.searchDestinations` |
| DTO trả về | `DestinationPublicResponse` |
| Trường `Long id` | ❌ Không có (chỉ có `UUID uuid`) |
| FE cần | `TourRequest.destinationId: Long` |

**Tác động FE:** `DestinationSelect` đã sẵn `id?: number` trong type
`DestinationLookupItem`. Khi BE trả `null/undefined` cho `id`, autocomplete
disable nút chọn item (option) và bật **fallback numeric input** để user nhập
ID thủ công + cảnh báo bằng `tours.destinationSelect.beGapWarning`.

**Đề xuất sửa BE:**

```diff
 // backend/src/main/java/com/wedservice/backend/module/destinations/dto/response/DestinationPublicResponse.java
 public class DestinationPublicResponse {
+    private Long id;
     private UUID uuid;
     private String name;
     ...
 }
```

Cập nhật `DestinationMapper.toPublicResponse(Destination entity)` để set
`id = entity.getId()`. Tương tự cho `DestinationResponse` (admin).

## 2. Module Tags chưa có Controller

| Item | Trạng thái |
|------|-----------|
| Entity, Repository, DTO `TagResponse` | ✅ Có |
| Controller `/admin/tags` | ❌ Không có |
| Search/list endpoint | ❌ Không có |

**Tác động FE:** `useTagsQuery()` gọi `GET /admin/tags`. Khi 404, component
`TagsMultiSelect` chuyển sang **fallback CSV** cho user nhập ID
(`tours.tags.beGapWarning`). Schema `tagIds: number[]` đã sẵn sàng.

**Đề xuất sửa BE:** thêm `AdminTagController` với phân quyền `tag.view`:

```java
@RestController
@RequestMapping("/admin/tags")
@PreAuthorize("hasAuthority('tag.view')")
public class AdminTagController {
    @GetMapping
    public ApiResponse<List<TagResponse>> list() { ... }

    @PostMapping
    @PreAuthorize("hasAuthority('tag.create')")
    public ApiResponse<TagResponse> create(@Valid @RequestBody TagRequest body) { ... }
    // ... update / delete tương tự destination
}
```

Tối thiểu cần `GET /admin/tags` để Multi-select hoạt động đầy đủ. Không cần sửa
gì ở FE khi endpoint sẵn sàng.

## 3. Endpoint upload file độc lập (`/admin/files/upload`)

| Item | Trạng thái |
|------|-----------|
| `FileService.uploadFile(MultipartFile)` | ✅ Có (MinIO put + trả URL) |
| Multipart endpoint kèm tour | ✅ `POST/PUT /admin/tours` (consumes multipart) |
| Multipart endpoint kèm destination | ✅ `POST/PUT /admin/destinations` |
| Endpoint upload độc lập | ❌ Không có |

**Tác động FE:** `MediaUploader` upload **ngay khi user chọn file** (UX khuyến
cáo) qua helper `uploadMedia(file)` → `POST /admin/files/upload`. Khi 404, FE
hiển thị toast cảnh báo (`tours.upload.beGapWarning`) và mở **ô paste URL trực
tiếp**. Trong cả 2 trường hợp form vẫn submit được payload đúng cấu trúc
`TourMediaRequest[]`.

**Đề xuất sửa BE:** thêm controller mỏng dùng lại `FileService`:

```java
@RestController
@RequestMapping("/admin/files")
@PreAuthorize("hasAuthority('file.upload')")
public class AdminFileController {
    private final FileService fileService;

    @PostMapping(value = "/upload",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Map<String, String>> upload(@RequestPart("file") MultipartFile file)
            throws Exception {
        String url = fileService.uploadFile(file);
        return ApiResponse.success(Map.of("url", url));
    }
}
```

Trả về `{ "url": "https://minio/.../file.jpg" }`. Helper `uploadMedia` đã handle
cả 2 dạng `string | { url }`.

## 4. Itinerary nested items (`ItineraryItemRequest[]`)

Phase 5 mới hỗ trợ ở mức **ngày** (`dayNumber`, `title`, `description`,
`overnightDestinationId`). Field `items: List<ItineraryItemRequest>` (mỗi item
có `sequenceNo`, `itemType`, `title`, `startTime`, `endTime`, `latitude`,
`longitude`...) sẽ được mở rộng ở Phase 6 sau.

## Tổng kết tác động lên FE

| Thay đổi BE đề xuất | Sửa FE? |
|---------------------|---------|
| Bổ sung `id` vào `DestinationPublicResponse` / `DestinationResponse` | ❌ Không cần |
| Thêm `AdminTagController` | ❌ Không cần |
| Thêm `AdminFileController#upload` | ❌ Không cần |

Tất cả gap đều có fallback an toàn ở FE. Khi BE bổ sung, các tính năng mở rộng
(autocomplete chuẩn, multi-select chuẩn, upload trực tiếp) sẽ hoạt động ngay
mà không cần deploy lại frontend.
