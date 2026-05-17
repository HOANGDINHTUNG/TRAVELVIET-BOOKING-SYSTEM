/** Parse HTML/plain text lists (inclusions, highlights, …) into string[]. */
export function parseTourTextList(value?: string) {
  if (!value) {
    return []
  }

  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean)
}
