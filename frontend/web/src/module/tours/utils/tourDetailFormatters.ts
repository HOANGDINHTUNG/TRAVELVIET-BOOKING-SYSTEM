import { buildAssetUrl } from "../../../utils/buildAssetUrl";
import type {
  BackendTour,
  BackendTourMedia,
  BackendTourSeasonality,
} from "../../home/database/interface/publicTravel";
import type { TourDetailCopy, TourDetailLocale } from "./tourDetailCopy";

export function formatTourPrice(
  value: number | string | undefined,
  currency = "VND",
  locale: TourDetailLocale,
) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return locale === "en" ? "Contact" : "Lien he";
  }

  return new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN", {
    maximumFractionDigits: 0,
  }).format(amount) + ` ${currency}`;
}

export function formatTourDuration(
  days: number | undefined,
  nights: number | undefined,
  copy: TourDetailCopy,
) {
  if (!days && !nights) {
    return copy.durationFallback;
  }

  if (days && nights !== undefined) {
    return `${days} ${copy.day.toLowerCase()} ${nights} ${copy.day === "Day" ? "nights" : "dem"}`;
  }

  return `${days ?? nights} ${copy.day.toLowerCase()}`;
}

export function parseTourTextList(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getActiveTourMedia(tour: BackendTour) {
  return (tour.media ?? [])
    .filter((item) => item.isActive !== false && item.mediaUrl)
    .map((item) => ({
      ...item,
      url: buildAssetUrl(item.mediaUrl),
    }))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function isVideoMedia(media: Pick<BackendTourMedia, "mediaType">) {
  return media.mediaType?.toLowerCase() === "video";
}

export function getTourHeroImage(tour: BackendTour) {
  return (
    getActiveTourMedia(tour).find((item) => !isVideoMedia(item))?.url ?? ""
  );
}

export function formatTourDate(value: string | undefined, locale: TourDetailLocale) {
  if (!value) {
    return locale === "en" ? "Updating" : "Dang cap nhat";
  }

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTourTime(value?: string | number[] | null) {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return `${String(value[0]).padStart(2, "0")}:${String(value[1]).padStart(2, "0")}`;
  }

  return value.substring(0, 5);
}

export function formatSeasonality(
  seasonality: BackendTourSeasonality[] | undefined,
  locale: TourDetailLocale,
) {
  if (!seasonality?.length) {
    return locale === "en" ? "All season" : "Quanh nam";
  }

  return seasonality
    .map((item) => {
      if (item.monthFrom && item.monthTo) {
        return `${item.seasonName} (${item.monthFrom}-${item.monthTo})`;
      }
      return item.seasonName;
    })
    .join(", ");
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
