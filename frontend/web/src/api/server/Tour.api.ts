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
  featuredOnly?: boolean;
  tagCodes?: string[];
  sortBy?: string;
  sortDir?: string;
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
  ];
  for (const key of scalarKeys) {
    const v = params[key];
    if (v === undefined || v === null || v === "") continue;
    usp.set(key, String(v));
  }
  if (params.domesticOnly === true) usp.set("domesticOnly", "true");
  if (params.internationalOnly === true) usp.set("internationalOnly", "true");
  if (params.featuredOnly === true) usp.set("featuredOnly", "true");
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
  const domesticOnly = searchParams.get("domesticOnly") === "true";
  const internationalOnly = searchParams.get("internationalOnly") === "true";
  const featuredOnly = searchParams.get("featuredOnly") === "true";
  const rawCc = searchParams.get("destinationCountryCode")?.trim();
  const destinationCountryCode =
    rawCc && /^[a-zA-Z]{2}$/.test(rawCc) ? rawCc.toUpperCase() : undefined;
  const tagCodes = searchParams
    .getAll("tagCodes")
    .map((c) => c.trim())
    .filter(Boolean);

  if (
    !domesticOnly &&
    !internationalOnly &&
    !featuredOnly &&
    !destinationCountryCode &&
    tagCodes.length === 0
  ) {
    return null;
  }

  return {
    page: 0,
    size: 100,
    ...(domesticOnly ? { domesticOnly: true } : {}),
    ...(internationalOnly ? { internationalOnly: true } : {}),
    ...(featuredOnly ? { featuredOnly: true } : {}),
    ...(destinationCountryCode ? { destinationCountryCode } : {}),
    ...(tagCodes.length ? { tagCodes } : {}),
    sortBy: "createdAt",
    sortDir: "desc",
  };
}

/** Link từ trang chủ → danh sách tour đã lọc (phần A). */
export const catalogTourLinks = {
  domesticBeachFeatured:
    "/tours?domesticOnly=true&tagCodes=BIEN&featuredOnly=true",
  internationalFeatured: "/tours?internationalOnly=true&featuredOnly=true",
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

function mapTour(item: BackendTour): Tour {
  const departure = formatDepartureLine(item);
  return {
    id: item.id,
    translationKey: item.translationKey,
    title: item.name,
    location: departure,
    category: item.tripMode || "Tour",
    days: formatDuration(item.durationDays, item.durationNights),
    price: toNumber(item.basePrice),
    rating: toNumber(item.averageRating) || undefined,
    reviewCount: item.totalReviews,
    image: chooseTourImage(item),
    highlights: parseHighlights(item.highlights),
    description: item.shortDescription || item.description,
    destinationId: item.destinationId,
    destinationCountryCode: item.destinationCountryCode,
    destinationName: item.destinationName,
    destinationProvince: item.destinationProvince,
    currency: item.currency,
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
