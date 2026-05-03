import type { PageResponse } from "../../types/api";
import type {
  BackendTour,
  BackendTourSchedule,
  Tour,
} from "../../module/home/database/interface/publicTravel";
import { buildAssetUrl } from "../../utils/buildAssetUrl";
import {
  deleteBackendData,
  getBackendData,
  patchBackendData,
  postBackendData,
  putBackendData,
} from "./serverApiClient";

function toNumber(value: number | string | undefined, fallback = 0) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDuration(days?: number, nights?: number) {
  if (!days && !nights) {
    return "Lich trinh dang cap nhat";
  }

  if (days && nights !== undefined) {
    return `${days} ngay ${nights} dem`;
  }

  return `${days ?? nights} ngay`;
}

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
  return {
    id: item.id,
    translationKey: item.translationKey,
    title: item.name,
    location: item.transportType || item.tripMode || "Dang cap nhat",
    category: item.tripMode || "Tour",
    days: formatDuration(item.durationDays, item.durationNights),
    price: toNumber(item.basePrice),
    rating: toNumber(item.averageRating) || undefined,
    reviewCount: item.totalReviews,
    image: chooseTourImage(item),
    highlights: parseHighlights(item.highlights),
    description: item.shortDescription || item.description,
    destinationId: item.destinationId,
    currency: item.currency,
  };
}

export const tourApi = {
  async getTours() {
    const page = await getBackendData<PageResponse<BackendTour>>("tours", {
      page: 0,
      size: 6,
    });

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
