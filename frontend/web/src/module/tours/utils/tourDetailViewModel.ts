import type { BackendTour } from "../../home/database/interface/publicTravel";
import type { TourDetailCopy, TourDetailLocale } from "./tourDetailCopy";
import {
  formatSeasonality,
  formatTourDuration,
  formatTourPrice,
  getActiveTourMedia,
  getTourHeroImage,
  parseTourTextList,
} from "./tourDetailFormatters";

export function createTourDetailViewModel(
  tour: BackendTour,
  copy: TourDetailCopy,
  locale: TourDetailLocale,
) {
  const media = getActiveTourMedia(tour);
  const duration = formatTourDuration(tour.durationDays, tour.durationNights, copy);
  const price = formatTourPrice(tour.basePrice, tour.currency, locale);
  const highlights = parseTourTextList(tour.highlights);
  const tags = (tour.tags ?? []).map((item) => item.name).filter(Boolean);

  return {
    heroImage: getTourHeroImage(tour),
    media,
    duration,
    price,
    highlights,
    seasonText: formatSeasonality(tour.seasonality, locale),
    facts: [
      { label: copy.facts.code, value: tour.code },
      { label: copy.facts.slug, value: tour.slug },
      { label: copy.facts.destination, value: tour.destinationId?.toString() },
      { label: copy.facts.duration, value: duration },
      { label: copy.facts.transport, value: tour.transportType },
      { label: copy.facts.tripMode, value: tour.tripMode },
      { label: copy.facts.season, value: formatSeasonality(tour.seasonality, locale) },
      { label: copy.facts.tags, value: tags.join(", ") },
      {
        label: copy.facts.featured,
        value: tour.isFeatured ? copy.facts.yes : copy.facts.no,
      },
    ].filter((item) => Boolean(item.value)),
  };
}

export type TourDetailViewModel = ReturnType<typeof createTourDetailViewModel>;
