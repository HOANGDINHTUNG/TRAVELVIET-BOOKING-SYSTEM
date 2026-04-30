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
  postBackendData,
  putBackendData,
} from "./serverApiClient";

const destinationFetchSize = 50;
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

function hasActiveTours(item: BackendDestination) {
  return (item.activeTourCount ?? 0) > 0;
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
  async getDestinations() {
    const page = await getBackendData<PageResponse<BackendDestination>>(
      "destinations",
      {
        page: 0,
        size: destinationFetchSize,
        sortBy: "name",
        sortDir: "asc",
      },
    );

    return getRandomItems(
      page.content.filter(hasActiveTours).map(mapDestination),
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
};

export const fetchPublicDestinations = () => destinationApi.getDestinations();
export const fetchPublicDestinationByUuid = (uuid: string) =>
  destinationApi.getDestinationByUuid(uuid);
