import type { DestinationDetail } from '../database/interface/destination'
import type { DestinationDetailCopy } from './destinationDetailCopy'
import {
  formatCoordinate,
  formatMonthRange,
  getCrowdLabel,
  isVideo,
  splitText,
} from './destinationDetailFormatters'

export type DestinationDetailStatId =
  | 'idealTime'
  | 'crowdDefault'
  | 'media'
  | 'contentBlocks'

export type DestinationDetailStat = {
  id: DestinationDetailStatId
  label: string
  value: string
  note: string
}

export type DestinationDetailViewModel = {
  activeMedia: DestinationDetail['mediaList']
  imageMedia: DestinationDetail['mediaList']
  videoMedia: DestinationDetail['mediaList']
  heroImage: string | undefined
  bestTime: string
  locationParts: string
  paragraphs: string[]
  facts: Array<[string, string]>
  stats: DestinationDetailStat[]
}

export function createDestinationDetailViewModel(
  detail: DestinationDetail,
  copy: DestinationDetailCopy,
): DestinationDetailViewModel {
  const activeMedia = detail.mediaList.filter((item) => item.isActive !== false)
  const imageMedia = activeMedia.filter((item) => !isVideo(item.mediaType))
  const videoMedia = activeMedia.filter((item) => isVideo(item.mediaType))
  const heroImage = detail.coverImage || imageMedia[0]?.url
  const bestTime = formatMonthRange(
    detail.bestTimeFromMonth,
    detail.bestTimeToMonth,
    copy,
  )
  const locationParts = [detail.district, detail.province, detail.region]
    .filter(Boolean)
    .join(' / ')
  const contentCount =
    detail.foods.length +
    detail.specialties.length +
    detail.activities.length +
    detail.tips.length +
    detail.events.length

  return {
    activeMedia,
    imageMedia,
    videoMedia,
    heroImage,
    bestTime,
    locationParts,
    paragraphs: splitText(detail.description || detail.shortDescription, copy),
    facts: [
      [copy.facts.uuid, detail.uuid],
      [copy.facts.slug, detail.slug || copy.updating],
      [copy.facts.country, detail.countryCode || copy.facts.vietnam],
      [copy.facts.province, detail.province || copy.updating],
      [copy.facts.district, detail.district || copy.updating],
      [copy.facts.region, detail.region || copy.updating],
      [copy.facts.address, detail.address || copy.updating],
      [copy.facts.latitude, formatCoordinate(detail.latitude, copy)],
      [copy.facts.longitude, formatCoordinate(detail.longitude, copy)],
      [copy.facts.bestTime, bestTime],
      [copy.facts.crowd, getCrowdLabel(detail.crowdLevelDefault, copy)],
      [copy.facts.featured, detail.isFeatured ? copy.facts.yes : copy.facts.no],
    ],
    stats: [
      {
        id: 'idealTime',
        label: copy.idealTime,
        value: bestTime,
        note: copy.backendData,
      },
      {
        id: 'crowdDefault',
        label: copy.crowdDefault,
        value: getCrowdLabel(detail.crowdLevelDefault, copy),
        note: copy.defaultCrowdNote,
      },
      {
        id: 'media',
        label: copy.media,
        value: activeMedia.length.toString(),
        note: copy.mediaNote(imageMedia.length, videoMedia.length),
      },
      {
        id: 'contentBlocks',
        label: copy.contentBlocks,
        value: contentCount.toString(),
        note: copy.contentBlocksNote,
      },
    ],
  }
}
