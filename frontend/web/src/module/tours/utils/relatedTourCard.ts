import type { TFunction } from 'i18next'

import type { TourCardProps, TourCardSavingTier } from '@/components/ui/TourCard/TourCard'
import { BRAND_LOGO_SRC } from '@/constants/brandAssets'
import { buildAssetUrl } from '@/utils/buildAssetUrl'
import type { Tour } from '../../home/database/interface/publicTravel'

import type { TourResponse } from '../types/publicTour'
import { TOUR_LINE_TAG_CODES } from './tourCatalogFacets'
import { parseTourTextList } from './tourDetailFormatters'
import { resolveEsgScore, resolveLeiScore } from './tourSustainability'
import { tourDetailPath } from './slug'
import { inclusionBadgeLabels } from './tourInclusionBadges'

/** Logo thẻ tour — cùng homepage (`HomeTourRows`). */
export const HOME_TOUR_CARD_BRAND_LOGO = BRAND_LOGO_SRC

export function pickTourCoverUrl(tour: TourResponse): string | undefined {
  const media = tour.media
    ?.filter((item) => item.isActive !== false && item.mediaUrl)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .find((item) => String(item.mediaType ?? '').toLowerCase() !== 'video')

  return media?.mediaUrl ? buildAssetUrl(media.mediaUrl) : undefined
}

export function formatRelatedTourDuration(
  tour: TourResponse,
  t: TFunction<'tours'>,
): string {
  const days = tour.durationDays
  const nights = tour.durationNights
  if (days == null && nights == null) return '—'
  if (days != null && nights != null) {
    return `${days} ${t('detail.daysShort')} · ${nights} ${t('detail.nightsShort')}`
  }
  if (days != null) return `${days} ${t('detail.daysShort')}`
  return `${nights} ${t('detail.nightsShort')}`
}

function tagCodesFromTour(tour: TourResponse): string[] {
  return (tour.tags ?? []).map((t) => t.code).filter((c): c is string => Boolean(c))
}

function savingTierFromTagCodes(codes: string[], esg?: number | null, lei?: number | null): TourCardSavingTier | undefined {
  if (codes.includes(TOUR_LINE_TAG_CODES.cao_cap)) return 'cao_cap'
  if (codes.includes(TOUR_LINE_TAG_CODES.tieu_chuan)) return 'tieu_chuan'
  if (codes.includes(TOUR_LINE_TAG_CODES.tiet_kiem)) return 'tiet_kiem'
  if (codes.includes(TOUR_LINE_TAG_CODES.gia_tot)) return 'tiet_kiem'
  if (
    (esg != null && lei != null && esg >= 80 && lei >= 70) ||
    codes.includes(TOUR_LINE_TAG_CODES.esg)
  ) {
    return 'tieu_chuan'
  }
  return undefined
}

/** Badge tier cho thẻ tour trên trang chủ (HomeTourRows). */
export function savingTierForHomeTour(tour: Tour): TourCardSavingTier | undefined {
  return savingTierFromTagCodes(
    tour.tagCodes ?? [],
    tour.esgScore,
    tour.leiScore,
  )
}

export function savingTierForTour(tour: TourResponse): TourCardSavingTier | undefined {
  const codes = tagCodesFromTour(tour)
  const esg = resolveEsgScore(tour)
  const lei = resolveLeiScore(tour)
  return savingTierFromTagCodes(codes, esg, lei)
}

export function cornerLabelsForRelatedTour(tour: TourResponse): string[] {
  const labels: string[] = [...inclusionBadgeLabels(tour.inclusionFlags ?? undefined)]
  const esg = resolveEsgScore(tour)
  const lei = resolveLeiScore(tour)
  if (esg != null && lei != null && esg >= 80 && lei >= 70) labels.push('ESG & LEI')
  if (tour.tripMode?.trim()) labels.push(tour.tripMode.trim())
  const highlight = parseTourTextList(tour.highlights ?? undefined)[0]
  if (highlight) {
    labels.push(highlight.length > 26 ? `${highlight.slice(0, 26)}…` : highlight)
  }
  return labels.slice(0, 3)
}

export function mapTourToHomeStyleCardProps(
  tour: TourResponse,
  t: TFunction<'tours'>,
): Pick<
  TourCardProps,
  | 'title'
  | 'detailPath'
  | 'imageUrl'
  | 'location'
  | 'duration'
  | 'price'
  | 'savingTier'
  | 'cornerLabels'
  | 'brandLogoUrl'
> {
  const location =
    [tour.destinationName, tour.destinationProvince].filter(Boolean).join(' · ') ||
    '—'

  return {
    title: tour.name ?? '—',
    detailPath: tourDetailPath(tour.id, tour.name),
    imageUrl: pickTourCoverUrl(tour),
    location,
    duration: formatRelatedTourDuration(tour, t),
    price: tour.basePrice ?? 0,
    savingTier: savingTierForTour(tour),
    cornerLabels: cornerLabelsForRelatedTour(tour),
    brandLogoUrl: HOME_TOUR_CARD_BRAND_LOGO,
  }
}
