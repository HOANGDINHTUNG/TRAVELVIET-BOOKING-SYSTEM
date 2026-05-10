/**
 * Lookup item dùng cho autocomplete chọn điểm đến trong các form backoffice.
 *
 * ⚠️ BE GAP: `DestinationPublicResponse` / `DestinationResponse` hiện chỉ expose
 *    `uuid` (UUID), không có `Long id`. Trong khi đó `TourRequest.destinationId`
 *    yêu cầu Long. ⇒ Field `id` ở dưới là **forward-compatible**: khi nào BE bổ
 *    sung `private Long id;` vào DTO thì autocomplete sẽ hoạt động hoàn chỉnh.
 *    Trước mắt, FE fallback cho user nhập numeric id thủ công.
 *
 * @see backend/src/main/java/com/wedservice/backend/module/destinations/dto/response/DestinationPublicResponse.java
 */
export type DestinationLookupItem = {
  id?: number | null
  uuid: string
  name: string | null
  slug: string | null
  province: string | null
  countryCode: string | null
  coverImageUrl: string | null
}

export type DestinationSearchParams = {
  keyword?: string
  province?: string
  region?: string
  isActive?: boolean
  isFeatured?: boolean
  page?: number
  size?: number
}
