import { apiClient } from '../../../../lib/apiClient'
import { ApiClientError } from '../../../../types/api'

/**
 * Kết quả upload 1 file: URL trả về từ MinIO + meta cho UI.
 */
export type UploadedMedia = {
  url: string
  fileName: string
  size: number
  mimeType: string
}

/**
 * Body trả về của endpoint upload (FE assume).
 * - String url đơn giản, hoặc object `{ url }`.
 */
type UploadResponse = string | { url?: string; mediaUrl?: string }

function extractUrl(payload: UploadResponse): string {
  if (typeof payload === 'string') return payload
  if (payload && typeof payload === 'object') {
    const url = payload.url ?? payload.mediaUrl
    if (typeof url === 'string' && url.length > 0) return url
  }
  throw new ApiClientError({
    message: 'Upload response did not contain a URL.',
    errorCode: 'UPLOAD_INVALID_RESPONSE',
    httpStatus: 200,
  })
}

/**
 * Upload từng file lên BE qua `POST /admin/files/upload` (multipart `file`).
 *
 * ⚠️ BE GAP: Endpoint upload độc lập **chưa được implement**. Hiện BE chỉ cho
 * upload kèm `POST /admin/tours` (multipart) hoặc `POST /admin/destinations`.
 * Helper này gọi `/admin/files/upload`; nếu 404, caller (`MediaUploader`)
 * sẽ thông báo & cho user nhập URL trực tiếp.
 *
 * Khi BE bổ sung controller upload chuẩn (perm `file.upload`), không cần sửa FE.
 */
export async function uploadMedia(file: File): Promise<UploadedMedia> {
  const form = new FormData()
  form.append('file', file)

  const response = await apiClient.post<UploadResponse>(
    'admin/files/upload',
    form,
    {
      headers: {
        // Để Axios tự gắn boundary multipart.
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return {
    url: extractUrl(response.data),
    fileName: file.name,
    size: file.size,
    mimeType: file.type,
  }
}

/**
 * Upload nhiều file song song, trả về kết quả theo thứ tự input.
 */
export async function uploadMediaBatch(files: File[]): Promise<UploadedMedia[]> {
  return Promise.all(files.map(uploadMedia))
}
