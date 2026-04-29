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

const destinationFetchSize = 50;
const featuredDestinationLimit = 10;

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
};

export const fetchPublicDestinations = () => destinationApi.getDestinations();
export const fetchPublicDestinationByUuid = (uuid: string) =>
  destinationApi.getDestinationByUuid(uuid);
