import type { PageResponse } from "../../types/api";
import type {
  BackendDestinationDetail,
  DestinationDetail,
  DestinationMedia,
} from "../../module/destinations/database/interface/destination";
import type {
  BackendDestination,
  Destination,
} from "../../module/home/database/interface/publicTravel";
import { buildAssetUrl } from "../../utils/buildAssetUrl";
import { getRandomItems } from "./apiCollectionUtils";
import { getBackendData } from "./serverApiClient";
import {
  deleteBackendData,
  patchBackendData,
  postBackendData,
  putBackendData,
} from "./serverApiClient";

const destinationFetchSize = 100;
const featuredDestinationLimit = 10;

export type DestinationFollowPayload = Partial<{
  notifyEvent: boolean;
  notifyVoucher: boolean;
  notifyNewTour: boolean;
  notifyBestSeason: boolean;
}>;

export type DestinationFollow = {
  id: number;
  destinationUuid?: string;
  destinationName?: string;
  notifyEvent?: boolean;
  notifyVoucher?: boolean;
  notifyNewTour?: boolean;
  notifyBestSeason?: boolean;
  createdAt?: string;
};

export type ProposeDestinationPayload = {
  name: string;
  province: string;
  district?: string;
  region?: string;
  countryCode?: string;
  address?: string;
  latitude?: number | string;
  longitude?: number | string;
  shortDescription?: string;
  description?: string;
  bestTimeFromMonth?: number;
  bestTimeToMonth?: number;
  crowdLevelDefault?: string;
};

export type DestinationProposal = {
  uuid: string;
  name?: string;
  province?: string;
  district?: string;
  region?: string;
  status?: string;
  submittedAt?: string;
};

export type AdminDestinationStatus = "pending" | "approved" | "rejected" | string;

export type AdminDestination = {
  uuid: string;
  code?: string;
  name?: string;
  slug?: string;
  countryCode?: string;
  province?: string;
  district?: string;
  region?: string;
  address?: string;
  latitude?: number | string;
  longitude?: number | string;
  shortDescription?: string;
  description?: string;
  bestTimeFromMonth?: number;
  bestTimeToMonth?: number;
  crowdLevelDefault?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  status?: AdminDestinationStatus;
  proposedBy?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  isOfficial?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type AdminDestinationDetail = AdminDestination & {
  mediaList?: Array<NonNullable<BackendDestinationDetail["mediaList"]>[number]>;
  foods?: BackendDestinationDetail["foods"];
  specialties?: BackendDestinationDetail["specialties"];
  activities?: BackendDestinationDetail["activities"];
  tips?: BackendDestinationDetail["tips"];
  events?: BackendDestinationDetail["events"];
};

export type AdminDestinationQuery = {
  keyword?: string;
  province?: string;
  region?: string;
  crowdLevel?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  isOfficial?: boolean;
  status?: AdminDestinationStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc" | string;
};

export type AdminDestinationPayload = {
  code: string;
  name: string;
  slug?: string;
  countryCode?: string;
  province: string;
  district?: string;
  region?: string;
  address?: string;
  latitude?: number | string;
  longitude?: number | string;
  shortDescription?: string;
  description?: string;
  bestTimeFromMonth?: number;
  bestTimeToMonth?: number;
  crowdLevelDefault?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  isOfficial?: boolean;
};

function mapDestination(item: BackendDestination): Destination {
  const activeTourCount = item.activeTourCount ?? 0;

  return {
    translationKey: item.translationKey,
    uuid: item.uuid,
    name: item.name,
    province: item.province,
    region: item.region,
    shortDescription: item.shortDescription,
    tours: `${activeTourCount} tour${activeTourCount === 1 ? "" : "s"}`,
    image: buildAssetUrl(item.coverImageUrl),
  };
}

function isVideoMedia(mediaType: string | undefined) {
  return mediaType?.toLowerCase() === "video";
}

function mapDestinationMedia(
  item: NonNullable<BackendDestinationDetail["mediaList"]>[number],
): DestinationMedia {
  return {
    ...item,
    url: buildAssetUrl(item.mediaUrl),
  };
}

function resolveDetailCover(mediaList: DestinationMedia[]) {
  const activeMedia = mediaList.filter((item) => item.isActive !== false);
  const cover =
    activeMedia.find((item) => item.mediaType?.toLowerCase() === "cover") ??
    activeMedia.find((item) => item.mediaType?.toLowerCase() === "banner") ??
    activeMedia.find((item) => !isVideoMedia(item.mediaType));

  return cover?.url ?? "";
}

function mapDestinationDetail(
  item: BackendDestinationDetail,
): DestinationDetail {
  const mediaList = (item.mediaList ?? [])
    .map(mapDestinationMedia)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return {
    ...item,
    mediaList,
    coverImage: resolveDetailCover(mediaList),
    foods: item.foods ?? [],
    specialties: item.specialties ?? [],
    activities: item.activities ?? [],
    tips: (item.tips ?? []).sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    ),
    events: item.events ?? [],
  };
}

export const destinationApi = {
  async getAllDestinations() {
    const page = await getBackendData<PageResponse<BackendDestination>>(
      "destinations",
      {
        page: 0,
        size: destinationFetchSize,
        sortBy: "name",
        sortDir: "asc",
      },
    );

    return page.content.map(mapDestination);
  },

  async getDestinations() {
    const destinations = await this.getAllDestinations();

    return getRandomItems(
      destinations.filter((item) => Number.parseInt(item.tours, 10) > 0),
      featuredDestinationLimit,
    );
  },

  async getDestinationByUuid(uuid: string) {
    const detail = await getBackendData<BackendDestinationDetail>(
      `destinations/${uuid}`,
    );

    return mapDestinationDetail(detail);
  },

  followDestination(uuid: string, payload?: DestinationFollowPayload) {
    return postBackendData<DestinationFollow>(`destinations/${uuid}/follow`, payload);
  },

  unfollowDestination(uuid: string) {
    return deleteBackendData(`destinations/${uuid}/follow`);
  },

  updateFollowSettings(uuid: string, payload: DestinationFollowPayload) {
    return putBackendData<DestinationFollow>(
      `destinations/${uuid}/follow/settings`,
      payload,
    );
  },

  getMyFollows(page = 0, size = 50) {
    return getBackendData<PageResponse<DestinationFollow>>(
      "destinations/me/follows",
      { page, size },
    );
  },

  proposeDestination(payload: ProposeDestinationPayload) {
    return postBackendData<DestinationProposal>("destinations/propose", payload);
  },

  getAdminDestinations(params: AdminDestinationQuery = {}) {
    return getBackendData<PageResponse<AdminDestination>>(
      "admin/destinations",
      params,
    );
  },

  getAdminDestination(uuid: string) {
    return getBackendData<AdminDestinationDetail>(`admin/destinations/${uuid}`);
  },

  createAdminDestination(payload: AdminDestinationPayload) {
    return postBackendData<AdminDestinationDetail>("admin/destinations", payload);
  },

  updateAdminDestination(uuid: string, payload: AdminDestinationPayload) {
    return putBackendData<AdminDestinationDetail>(
      `admin/destinations/${uuid}`,
      payload,
    );
  },

  deleteAdminDestination(uuid: string) {
    return deleteBackendData(`admin/destinations/${uuid}`);
  },

  approveAdminDestination(uuid: string) {
    return patchBackendData<AdminDestinationDetail>(
      `admin/destinations/${uuid}/approve`,
    );
  },

  rejectAdminDestination(uuid: string, reason: string) {
    return patchBackendData<AdminDestinationDetail>(
      `admin/destinations/${uuid}/reject`,
      { reason },
    );
  },
};

export const fetchPublicDestinations = () => destinationApi.getDestinations();
export const fetchPublicDestinationByUuid = (uuid: string) =>
  destinationApi.getDestinationByUuid(uuid);
