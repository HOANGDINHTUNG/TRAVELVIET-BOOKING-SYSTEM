import type {
  DestinationDetailCopy,
  DestinationDetailLocale,
} from './destinationDetailCopy'

export function formatMonth(
  value: number | undefined,
  copy: DestinationDetailCopy,
) {
  if (!value || value < 1 || value > 12) {
    return copy.updating
  }

  return copy.monthNames[value - 1]
}

export function formatMonthRange(
  from: number | undefined,
  to: number | undefined,
  copy: DestinationDetailCopy,
) {
  if (!from && !to) {
    return copy.updating
  }

  if (from && to) {
    return `${formatMonth(from, copy)} - ${formatMonth(to, copy)}`
  }

  return formatMonth(from ?? to, copy)
}

export function formatCoordinate(
  value: number | string | undefined,
  copy: DestinationDetailCopy,
) {
  if (value === undefined || value === null || value === '') {
    return copy.updating
  }

  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(6) : String(value)
}

export function formatDateTime(
  value: string | undefined,
  locale: DestinationDetailLocale,
  copy: DestinationDetailCopy,
) {
  if (!value) {
    return copy.updating
  }

  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatScore(
  value: number | string | undefined,
  copy: DestinationDetailCopy,
) {
  if (value === undefined || value === null || value === '') {
    return copy.noScore
  }

  const numeric = Number(value)
  return Number.isFinite(numeric) ? copy.score(numeric.toFixed(1)) : String(value)
}

export function isVideo(mediaType: string | undefined) {
  return mediaType?.toLowerCase() === 'video'
}

export function getCrowdLabel(
  value: string | undefined,
  copy: DestinationDetailCopy,
) {
  if (!value) {
    return copy.updating
  }

  const normalized = value.toUpperCase()
  return copy.crowdLabels[normalized] ?? value
}

export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function splitText(value: string | undefined, copy: DestinationDetailCopy) {
  return (value || copy.noDescription)
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
}
