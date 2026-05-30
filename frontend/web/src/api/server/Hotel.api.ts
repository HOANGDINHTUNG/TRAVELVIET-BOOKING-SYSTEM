import type { PageResponse } from "../../types/api";
import { getBackendData } from "./serverApiClient";

export type HotelSearchRequest = {
  destinationId?: number;
  keyword?: string;
  minStar?: number;
  maxStar?: number;
  minPrice?: number;
  maxPrice?: number;
  checkinDate?: string;
  checkoutDate?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  page?: number;
  size?: number;
};

export type HotelResponse = {
  id: number;
  destinationId: number;
  destinationName: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  starRating: number;
  reviewScore: number;
  phone: string;
  email: string;
  province: string;
  district: string;
  address: string;
  status: string;
  minRoomPrice: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HotelImageDto = {
  id: number;
  mediaUrl: string;
  altText: string;
  isCover: boolean;
};

export type RoomRatePlanResponse = {
  planId: string;
  inclusionTags: string[];
  cancellationTags: string[];
  isBreakfastIncluded: boolean;
  isNonRefundable: boolean;
  defaultPrice: number;
  originalPrice: number;
  discountPrice: number;
  promoTag: string;
  remainingRooms: number;
};

export type RoomTypeResponse = {
  id: number;
  code: string;
  name: string;
  bedType: string;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  roomAreaSize: number;
  roomView: string;
  isRefundable: boolean;
  imageUrl: string;
  ratePlans: RoomRatePlanResponse[];
};

export type HotelDetailResponse = {
  basicInfo: HotelResponse;
  amenities: string[];
  images: HotelImageDto[];
  roomTypes: RoomTypeResponse[];
};

export const hotelApi = {
  search(params: HotelSearchRequest = {}) {
    return getBackendData<PageResponse<HotelResponse>>("hotels", params);
  },

  getById(
    id: number,
    params: { checkinDate?: string; checkoutDate?: string } = {},
  ) {
    return getBackendData<HotelResponse>(`hotels/${id}`, params);
  },

  getDetail(
    id: number,
    params: { checkinDate?: string; checkoutDate?: string } = {},
  ) {
    return getBackendData<HotelDetailResponse>(`hotels/${id}/detail`, params);
  },
};

export async function fetchPublicHotels(params: HotelSearchRequest = {}) {
  const res = await hotelApi.search(params);
  return res.content ?? [];
}
