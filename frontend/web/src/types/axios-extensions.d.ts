import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * Khi `true`, interceptor không bóc envelope `ApiResponse<T>` — dùng khi cần đọc `message` lớp ngoài.
     */
    skipApiEnvelope?: boolean
  }
}
