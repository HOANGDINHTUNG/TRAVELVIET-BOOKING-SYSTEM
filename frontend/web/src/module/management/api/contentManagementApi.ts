import type { PageResponse } from '../../../types/api'
import type {
  BackendDestination,
  BackendTour,
} from '../../home/database/interface/publicTravel'
import type {
  BackendDestinationDetail,
  DestinationActivity,
  DestinationEvent,
  DestinationFood,
  DestinationMedia,
  DestinationSpecialty,
  DestinationTip,
} from '../../destinations/database/interface/destination'
import { buildAssetUrl } from '../../../utils/buildAssetUrl'
import {
  deleteBackendData,
  getBackendData,
  patchBackendData,
  putBackendData,
} from '../../../api/server/serverApiClient'

export type AdminListParams = Partial<{
  keyword: string
  status: string
  page: number
  size: number
  sortBy: string
  sortDir: 'asc' | 'desc'
}>

export type AdminDestination = BackendDestination & {
  code?: string
  address?: string
  latitude?: number | string
  longitude?: number | string
  description?: string
  isActive?: boolean
  status?: string
  proposedBy?: string
  verifiedBy?: string
  rejectionReason?: string
  isOfficial?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  coverImageUrl?: string
}

export type AdminDestinationDetail = BackendDestinationDetail & {
  code?: string
  isActive?: boolean
  status?: string
  proposedBy?: string
  verifiedBy?: string
  rejectionReason?: string
  isOfficial?: boolean
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  coverImageUrl?: string
}

export type AdminTour = BackendTour & {
  cancellationPolicyId?: number
}

export type DestinationMediaPayload = {
  mediaType?: string
  mediaUrl?: string
  altText?: string
  sortOrder?: number
  isActive?: boolean
}

export type AdminDestinationPayload = {
  code?: string
  name: string
  slug?: string
  countryCode?: string
  province: string
  district?: string
  region?: string
  address?: string
  latitude?: number | string
  longitude?: number | string
  shortDescription?: string
  description?: string
  bestTimeFromMonth?: number
  bestTimeToMonth?: number
  crowdLevelDefault?: string
  isFeatured?: boolean
  isActive?: boolean
  isOfficial?: boolean
  mediaList?: DestinationMediaPayload[]
  foods?: Array<Pick<DestinationFood, 'foodName' | 'description' | 'isFeatured'>>
  specialties?: Array<Pick<DestinationSpecialty, 'specialtyName' | 'description'>>
  activities?: Array<Pick<DestinationActivity, 'activityName' | 'description' | 'activityScore'>>
  tips?: Array<Pick<DestinationTip, 'tipTitle' | 'tipContent' | 'sortOrder'>>
  events?: Array<
    Pick<
      DestinationEvent,
      'eventName' | 'eventType' | 'description' | 'startsAt' | 'endsAt' | 'notifyAllFollowers' | 'isActive'
    >
  >
}

export type TourMediaPayload = {
  mediaType?: string
  mediaUrl?: string
  altText?: string
  sortOrder?: number
  isActive?: boolean
}

export type AdminTourPayload = {
  code?: string
  name: string
  slug?: string
  destinationId?: number
  cancellationPolicyId?: number
  basePrice?: number | string
  currency?: string
  durationDays?: number
  durationNights?: number
  transportType?: string
  tripMode?: string
  shortDescription?: string
  description?: string
  highlights?: string
  inclusions?: string
  exclusions?: string
  notes?: string
  isFeatured?: boolean
  status?: string
  tagIds?: number[]
  media?: TourMediaPayload[]
  seasonality?: Array<{
    seasonName?: string
    monthFrom?: number
    monthTo?: number
    recommendationScore?: number | string
    notes?: string
  }>
  itineraryDays?: Array<{
    dayNumber?: number
    title?: string
    description?: string
    overnightDestinationId?: number
    items?: Array<{
      sequenceNo?: number
      itemType?: string
      title?: string
      description?: string
      destinationId?: number
      locationName?: string
      address?: string
      latitude?: number | string
      longitude?: number | string
      googleMapUrl?: string
      startTime?: string
      endTime?: string
      travelMinutesEstimated?: number
    }>
  }>
  checklistItems?: Array<{
    itemName?: string
    itemGroup?: string
    isRequired?: boolean
  }>
}

function cleanParams(params: AdminListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  )
}

function isVideoMedia(mediaType?: string) {
  return mediaType?.toLowerCase() === 'video'
}

function resolveDestinationCover(mediaList?: Array<Omit<DestinationMedia, 'url'> | DestinationMedia>) {
  const activeMedia = (mediaList ?? []).filter((item) => item.isActive !== false)
  const cover =
    activeMedia.find((item) => item.mediaType?.toLowerCase() === 'cover') ??
    activeMedia.find((item) => item.mediaType?.toLowerCase() === 'banner') ??
    activeMedia.find((item) => !isVideoMedia(item.mediaType))

  return buildAssetUrl(cover?.mediaUrl)
}

export function resolveTourCover(tour: AdminTour) {
  const cover = tour.media
    ?.filter((item) => item.isActive !== false)
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
    .find((item) => item.mediaType?.toLowerCase() !== 'video' && item.mediaUrl)

  return buildAssetUrl(cover?.mediaUrl)
}

function withDestinationCover(detail: AdminDestinationDetail): AdminDestinationDetail {
  return {
    ...detail,
    coverImageUrl: resolveDestinationCover(detail.mediaList),
  }
}

export function destinationDetailToPayload(
  detail: AdminDestinationDetail,
): AdminDestinationPayload {
  return {
    code: detail.code,
    name: detail.name,
    slug: detail.slug,
    countryCode: detail.countryCode,
    province: detail.province || 'Viet Nam',
    district: detail.district,
    region: detail.region,
    address: detail.address,
    latitude: detail.latitude,
    longitude: detail.longitude,
    shortDescription: detail.shortDescription,
    description: detail.description,
    bestTimeFromMonth: detail.bestTimeFromMonth,
    bestTimeToMonth: detail.bestTimeToMonth,
    crowdLevelDefault: detail.crowdLevelDefault,
    isFeatured: detail.isFeatured,
    isActive: detail.isActive,
    isOfficial: detail.isOfficial,
    mediaList: detail.mediaList?.map((item) => ({
      mediaType: item.mediaType,
      mediaUrl: item.mediaUrl,
      altText: item.altText,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    })),
    foods: detail.foods?.map((item) => ({
      foodName: item.foodName,
      description: item.description,
      isFeatured: item.isFeatured,
    })),
    specialties: detail.specialties?.map((item) => ({
      specialtyName: item.specialtyName,
      description: item.description,
    })),
    activities: detail.activities?.map((item) => ({
      activityName: item.activityName,
      description: item.description,
      activityScore: item.activityScore,
    })),
    tips: detail.tips?.map((item) => ({
      tipTitle: item.tipTitle,
      tipContent: item.tipContent,
      sortOrder: item.sortOrder,
    })),
    events: detail.events?.map((item) => ({
      eventName: item.eventName,
      eventType: item.eventType,
      description: item.description,
      startsAt: item.startsAt,
      endsAt: item.endsAt,
      notifyAllFollowers: item.notifyAllFollowers,
      isActive: item.isActive,
    })),
  }
}

export function tourDetailToPayload(detail: AdminTour): AdminTourPayload {
  return {
    code: detail.code,
    name: detail.name,
    slug: detail.slug,
    destinationId: detail.destinationId,
    cancellationPolicyId: detail.cancellationPolicyId,
    basePrice: detail.basePrice,
    currency: detail.currency,
    durationDays: detail.durationDays,
    durationNights: detail.durationNights,
    transportType: detail.transportType,
    tripMode: detail.tripMode,
    shortDescription: detail.shortDescription,
    description: detail.description,
    highlights: detail.highlights,
    inclusions: detail.inclusions,
    exclusions: detail.exclusions,
    notes: detail.notes,
    isFeatured: detail.isFeatured,
    status: detail.status,
    tagIds: detail.tags?.map((tag) => tag.id),
    media: detail.media?.map((item) => ({
      mediaType: item.mediaType,
      mediaUrl: item.mediaUrl,
      altText: item.altText,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    })),
    seasonality: detail.seasonality?.map((item) => ({
      seasonName: item.seasonName,
      monthFrom: item.monthFrom,
      monthTo: item.monthTo,
      recommendationScore: item.recommendationScore,
      notes: item.notes,
    })),
    itineraryDays: detail.itineraryDays?.map((day) => ({
      dayNumber: day.dayNumber,
      title: day.title,
      description: day.description,
      items: day.items?.map((item) => ({
        sequenceNo: item.sequenceNo,
        itemType: item.itemType,
        title: item.title,
        description: item.description,
        locationName: item.locationName,
        address: item.address,
        startTime: item.startTime,
        endTime: item.endTime,
      })),
    })),
    checklistItems: detail.checklistItems?.map((item) => ({
      itemName: item.itemName,
      itemGroup: item.itemGroup,
      isRequired: item.isRequired,
    })),
  }
}

export const contentManagementApi = {
  async getAdminDestinations(params: AdminListParams = {}) {
    const page = await getBackendData<PageResponse<AdminDestination>>(
      'admin/destinations',
      cleanParams({
        page: 0,
        size: 60,
        sortBy: 'name',
        sortDir: 'asc',
        ...params,
      }),
    )

    const detailResults = await Promise.allSettled(
      page.content.map((item) => this.getAdminDestinationByUuid(item.uuid)),
    )

    return {
      ...page,
      content: page.content.map((item, index) => {
        const detailResult = detailResults[index]
        const detail =
          detailResult?.status === 'fulfilled' ? detailResult.value : undefined

        return {
          ...item,
          coverImageUrl: detail?.coverImageUrl,
        }
      }),
    }
  },

  async getAdminDestinationByUuid(uuid: string) {
    const detail = await getBackendData<AdminDestinationDetail>(
      `admin/destinations/${uuid}`,
    )

    return withDestinationCover(detail)
  },

  updateDestination(uuid: string, payload: AdminDestinationPayload) {
    return putBackendData<AdminDestinationDetail>(
      `admin/destinations/${uuid}`,
      payload,
    )
  },

  deleteDestination(uuid: string) {
    return deleteBackendData(`admin/destinations/${uuid}`)
  },

  approveDestination(uuid: string) {
    return patchBackendData<AdminDestinationDetail>(
      `admin/destinations/${uuid}/approve`,
    )
  },

  rejectDestination(uuid: string, reason: string) {
    return patchBackendData<AdminDestinationDetail>(
      `admin/destinations/${uuid}/reject`,
      { reason },
    )
  },

  getAdminTours(params: AdminListParams = {}) {
    return getBackendData<PageResponse<AdminTour>>(
      'admin/tours',
      cleanParams({
        page: 0,
        size: 60,
        sortBy: 'createdAt',
        sortDir: 'desc',
        ...params,
      }),
    )
  },

  getAdminTourById(id: number) {
    return getBackendData<AdminTour>(`admin/tours/${id}`)
  },

  updateTour(id: number, payload: AdminTourPayload) {
    return putBackendData<AdminTour>(`admin/tours/${id}`, payload)
  },

  deleteTour(id: number) {
    return deleteBackendData(`admin/tours/${id}`)
  },
}
