import type { PageResponse } from "../../types/api";
import type {
  BackendTour,
  BackendTourSchedule,
  Tour,
} from "../../module/home/database/interface/publicTravel";
import { buildAssetUrl } from "../../utils/buildAssetUrl";
import { axiosBackend } from "../../utils/axiosInstance";
import {
  deleteBackendData,
  getBackendData,
  patchBackendData,
  postBackendData,
  putBackendData,
} from "./serverApiClient";
import i18n from "../../lib/i18n";
import {
  catalogFiltersToServerParams,
  parseTourCatalogFilters,
} from "../../module/tours/utils/tourCatalogSearch";

const featuredTourFetchSize = 6;
const tourFetchSize = 100;

/** Query params for GET /tours (Spring-friendly: repeated tagCodes, boolean as true/false). */
export type PublicTourSearchParams = {
  page?: number;
  size?: number;
  keyword?: string;
  domesticOnly?: boolean;
  internationalOnly?: boolean;
  destinationCountryCode?: string;
  destinationId?: number;
  /** Khi có destinationId: false = chỉ tour gắn đúng destination đó (mặc định backend là true = cả cây con). */
  destinationSubtree?: boolean;
  featuredOnly?: boolean;
  tagCodes?: string[];
  minPrice?: number;
  maxPrice?: number;
  transportType?: string;
  sortBy?: string;
  sortDir?: string;
  esgOnly?: boolean;
};

export type PublicTourSearchPage = {
  items: Tour[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

function appendTourSearchToUrlSearchParams(
  usp: URLSearchParams,
  params: PublicTourSearchParams,
) {
  const scalarKeys: (keyof PublicTourSearchParams)[] = [
    "page",
    "size",
    "keyword",
    "sortBy",
    "sortDir",
    "destinationCountryCode",
    "destinationId",
    "transportType",
  ];
  for (const key of scalarKeys) {
    const v = params[key];
    if (v === undefined || v === null || v === "") continue;
    usp.set(key, String(v));
  }
  if (params.minPrice != null) usp.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null) usp.set("maxPrice", String(params.maxPrice));
  if (params.domesticOnly === true) usp.set("domesticOnly", "true");
  if (params.internationalOnly === true) usp.set("internationalOnly", "true");
  if (params.featuredOnly === true) usp.set("featuredOnly", "true");
  if (params.esgOnly === true) usp.set("esgOnly", "true");
  if (params.destinationSubtree === false) usp.set("destinationSubtree", "false");
  if (params.tagCodes?.length) {
    for (const code of params.tagCodes) {
      const c = code?.trim();
      if (c) usp.append("tagCodes", c);
    }
  }
}

async function getTourSearchPage(params: PublicTourSearchParams) {
  const usp = new URLSearchParams();
  appendTourSearchToUrlSearchParams(usp, params);
  const qs = usp.toString();
  const path = qs.length > 0 ? `tours?${qs}` : "tours";
  const response = await axiosBackend.get<PageResponse<BackendTour>>(path);
  return response.data;
}

function toNumber(value: number | string | undefined, fallback = 0) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDuration(days?: number, nights?: number) {
  if (!days && !nights) {
    return i18n.t("tourCard.durationUnknown");
  }

  if (days != null && nights !== undefined && nights !== null) {
    return i18n.t("tourCard.durationDaysNights", { days, nights });
  }

  return i18n.t("tourCard.durationDaysOnly", {
    count: days ?? nights ?? 0,
  });
}

function formatDepartureLine(item: BackendTour): string {
  if (item.primaryDepartureCity?.trim()) {
    return i18n.t("tourCard.departureFromProvince", {
      place: item.primaryDepartureCity.trim(),
    });
  }
  if (item.destinationProvince != null && item.destinationProvince !== "") {
    return i18n.t("tourCard.departureFromProvince", {
      place: item.destinationProvince,
    });
  }
  if (item.destinationName != null && item.destinationName !== "") {
    return i18n.t("tourCard.departurePlace", { place: item.destinationName });
  }
  return (
    item.transportType ||
    item.tripMode ||
    i18n.t("tourCard.departureFallback")
  );
}

/**
 * Đọc query trên /tours để gọi GET /tours với bộ lọc server (trùng với backend).
 * Trả về null → tải toàn bộ danh sách (getAllTours).
 */
export function tourListSearchParamsFromUrl(
  searchParams: URLSearchParams,
): PublicTourSearchParams | null {
  if (!searchParams.toString()) {
    return null;
  }

  return catalogFiltersToServerParams(parseTourCatalogFilters(searchParams));
}

/** Link từ trang chủ → danh sách tour đã lọc (phần A). */
export const catalogTourLinks = {
  domesticBeachFeatured:
    "/tours?tagCodes=HOME_BEACH_VN&featuredOnly=true",
  internationalFeatured:
    "/tours?tagCodes=HOME_HOT_INTL&featuredOnly=true",
  lastMinuteDeals: "/tours?tagCodes=HOME_FLASH_SALE&featuredOnly=true",
} as const;

function parseHighlights(highlights?: string) {
  if (!highlights) {
    return [];
  }

  return highlights
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function chooseTourImage(tour: BackendTour) {
  const image = tour.media
    ?.filter((item) => item.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .find((item) => item.mediaType?.toLowerCase() !== "video" && item.mediaUrl);

  return buildAssetUrl(image?.mediaUrl);
}

/** Tất cả ảnh tour (không video), đã sort — dùng gallery + nền blur */
function collectTourImageUrls(tour: BackendTour): string[] {
  if (!tour.media?.length) {
    return [];
  }

  return tour.media
    .filter(
      (item) =>
        item.isActive !== false &&
        item.mediaUrl &&
        String(item.mediaType ?? "").toLowerCase() !== "video",
    )
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item) => buildAssetUrl(item.mediaUrl))
    .filter((u): u is string => Boolean(u));
}

function mapTour(item: BackendTour): Tour {
  const departure = formatDepartureLine(item);
  const gallery = collectTourImageUrls(item);
  const primary = gallery[0] ?? chooseTourImage(item);
  const allUrls = gallery.length > 0 ? gallery : primary ? [primary] : [];

  return {
    id: item.id,
    code: item.code?.trim() || undefined,
    translationKey: item.translationKey,
    title: item.name,
    location: departure,
    category: item.tripMode || "Tour",
    days: formatDuration(item.durationDays, item.durationNights),
    price: toNumber(item.basePrice),
    listPrice:
      item.listPrice != null && item.listPrice !== ""
        ? toNumber(item.listPrice, 0) || undefined
        : undefined,
    esgScore:
      item.esgScore != null && Number.isFinite(Number(item.esgScore))
        ? Number(item.esgScore)
        : undefined,
    leiScore:
      item.leiScore != null && Number.isFinite(Number(item.leiScore))
        ? Number(item.leiScore)
        : undefined,
    tagCodes: item.tags?.map((tag) => tag.code).filter(Boolean) as string[] | undefined,
    rating: toNumber(item.averageRating) || undefined,
    reviewCount: item.totalReviews,
    image: primary,
    mediaGalleryUrls: allUrls.length ? allUrls : undefined,
    highlights: parseHighlights(item.highlights),
    shortDescription: item.shortDescription,
    description: item.description,
    destinationId: item.destinationId,
    destinationCountryCode: item.destinationCountryCode,
    destinationName: item.destinationName,
    destinationProvince: item.destinationProvince,
    currency: item.currency,
    nextOpenSchedule: item.nextOpenSchedule,
    primaryDepartureCity: item.primaryDepartureCity,
    inclusionFlags: item.inclusionFlags,
  };
}

export const tourApi = {
  async getAllTours() {
    const page = await getBackendData<PageResponse<BackendTour>>("tours", {
      page: 0,
      size: tourFetchSize,
    });

    return page.content.map(mapTour);
  },
  async getTours() {
    const page = await getBackendData<PageResponse<BackendTour>>("tours", {
      page: 0,
      size: featuredTourFetchSize,
    });

    return page.content.map(mapTour);
  },

  async searchPublicTours(params: PublicTourSearchParams) {
    const page = await getTourSearchPage(params);
    return page.content.map(mapTour);
  },
  async searchPublicToursPage(params: PublicTourSearchParams): Promise<PublicTourSearchPage> {
    const page = await getTourSearchPage(params);
    return {
      items: page.content.map(mapTour),
      page: page.page,
      size: page.size,
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      last: page.last,
    };
  },
  async getTourById(id: string) {
    const tour = await getBackendData<BackendTour>(`tours/${id}`);
    return tour;
  },
  async getTourSchedules(tourId: number) {
    const schedules = await getBackendData<BackendTourSchedule[]>(
      `tours/${tourId}/schedules`,
    );
    return schedules;
  },
  async getTourSchedule(tourId: number, scheduleId: number) {
    const schedule = await getBackendData<BackendTourSchedule>(
      `tours/${tourId}/schedules/${scheduleId}`,
    );
    return schedule;
  },

  getAdminTours(params: Record<string, unknown> = {}) {
    return getBackendData<PageResponse<BackendTour>>("tours", params);
  },

  createAdminTour(payload: unknown) {
    return postBackendData<BackendTour>("admin/tours", payload);
  },

  updateAdminTour(id: number, payload: unknown) {
    return putBackendData<BackendTour>(`admin/tours/${id}`, payload);
  },

  deleteAdminTour(id: number) {
    return deleteBackendData(`admin/tours/${id}`);
  },

  getAdminSchedules(tourId: number) {
    return getBackendData<BackendTourSchedule[]>(`admin/tours/${tourId}/schedules`);
  },

  getAdminSchedule(tourId: number, scheduleId: number) {
    return getBackendData<BackendTourSchedule>(
      `admin/tours/${tourId}/schedules/${scheduleId}`,
    );
  },

  createAdminSchedule(tourId: number, payload: unknown) {
    return postBackendData<BackendTourSchedule>(
      `admin/tours/${tourId}/schedules`,
      payload,
    );
  },

  updateAdminSchedule(tourId: number, scheduleId: number, payload: unknown) {
    return putBackendData<BackendTourSchedule>(
      `admin/tours/${tourId}/schedules/${scheduleId}`,
      payload,
    );
  },

  updateAdminScheduleStatus(
    tourId: number,
    scheduleId: number,
    status: string,
  ) {
    return patchBackendData<BackendTourSchedule>(
      `admin/tours/${tourId}/schedules/${scheduleId}/status`,
      { status },
    );
  },
};

export const fetchPublicTours = () => tourApi.getTours();
