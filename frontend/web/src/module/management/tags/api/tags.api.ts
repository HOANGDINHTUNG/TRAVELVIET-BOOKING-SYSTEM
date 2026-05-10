import { apiClient } from '../../../../lib/apiClient'
import type { TagOption } from '../types/tag'

/**
 * Quản lý Tags — bám sát convention `/admin/tags`.
 *
 * ⚠️ Endpoint hiện chưa được BE expose; nếu 404 thì caller (`useTagsQuery`)
 * sẽ chuyển sang fallback CSV input. Khi BE thêm `AdminTagController` chuẩn
 * (perm `tag.view`), FE không cần sửa.
 */
export const TagsApi = {
  async list(): Promise<TagOption[]> {
    const response = await apiClient.get<TagOption[]>('admin/tags')
    return response.data
  },
}
