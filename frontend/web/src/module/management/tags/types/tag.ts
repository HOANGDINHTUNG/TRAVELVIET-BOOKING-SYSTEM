/**
 * Tùy chọn hiển thị trong Multi-select tags. Khớp `TagResponse.java`.
 *
 * ⚠️ BE GAP: Hiện chưa có `GET /admin/tags` controller. Module Tags chỉ có
 * entity, repository, DTO. FE đã wrap query nhưng sẽ fallback CSV input nếu
 * endpoint trả 404. Khi BE bổ sung controller (perm `tag.view`), không cần
 * sửa FE.
 *
 * @see backend/src/main/java/com/wedservice/backend/module/tours/dto/response/TagResponse.java
 */
export type TagOption = {
  id: number
  code: string | null
  name: string | null
  tagGroup: string | null
  description: string | null
}
